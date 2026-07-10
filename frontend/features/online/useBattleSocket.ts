"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ClientMessage, ServerMessage } from "./protocol";

// backendのAPIと同じホストでWebSocketも待ち受けている想定（http→ws, https→wssに変換するだけ）
const WS_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
).replace(/^http/, "ws");

const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY_MS = 1500;

export type SocketStatus = "connecting" | "open" | "reconnecting" | "closed";

// メッセージは単一のstateスロットに溜めず、届いた瞬間にonMessageを同期的に呼ぶ。
// (Reactのstate更新に載せてしまうと理論上バッチングで取りこぼす可能性があるため)
//
// 接続が意図せず切れた場合（ページを閉じた・明示的にcloseした場合を除く）は
// 自動でWebSocketを繋ぎ直す。再接続後にrejoin_roomを送るのは呼び出し側の責務
// （statusが"open"に戻ったタイミングをuseEffectで見て送る）。
export function useBattleSocket(
  token: string | null,
  onMessage: (msg: ServerMessage) => void
) {
  const [status, setStatus] = useState<SocketStatus>("connecting");
  const wsRef = useRef<WebSocket | null>(null);
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;

  const intentionalCloseRef = useRef(false);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!token) return;

    intentionalCloseRef.current = false;
    reconnectAttemptsRef.current = 0;

    function connect() {
      setStatus((current) =>
        current === "closed" || current === "connecting"
          ? "connecting"
          : "reconnecting"
      );

      const ws = new WebSocket(
        `${WS_BASE_URL}/ws/battle?token=${encodeURIComponent(token!)}`
      );
      wsRef.current = ws;

      ws.onopen = () => {
        reconnectAttemptsRef.current = 0;
        setStatus("open");
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data) as ServerMessage;
          onMessageRef.current(msg);
        } catch {
          // 壊れたメッセージは無視する
        }
      };

      ws.onclose = () => {
        if (intentionalCloseRef.current) {
          setStatus("closed");
          return;
        }

        if (reconnectAttemptsRef.current >= MAX_RECONNECT_ATTEMPTS) {
          setStatus("closed");
          return;
        }

        reconnectAttemptsRef.current += 1;
        setStatus("reconnecting");

        reconnectTimeoutRef.current = window.setTimeout(() => {
          connect();
        }, RECONNECT_DELAY_MS);
      };

      ws.onerror = () => {
        ws.close();
      };
    }

    connect();

    return () => {
      intentionalCloseRef.current = true;

      if (reconnectTimeoutRef.current !== null) {
        window.clearTimeout(reconnectTimeoutRef.current);
      }

      wsRef.current?.close();
      wsRef.current = null;
    };
  }, [token]);

  const send = useCallback((msg: ClientMessage) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(msg));
    }
  }, []);

  return { status, send };
}
