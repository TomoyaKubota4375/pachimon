// 図鑑のまだ埋まっていない枠。選択できない（クリック・hover・キー操作の対象外）
//
// pixel-retroui のCSSがレイヤー外（unlayered）でborderをリセットしており、
// Tailwindのborder系ユーティリティが効かないためinline styleで直接指定する。
export default function EmptyCharacterSlot() {
  return (
    <div
      style={{
        borderWidth: 4,
        borderStyle: "dashed",
        borderColor: "#9ca3af",
        backgroundColor: "rgba(0,0,0,0.2)",
      }}
      className="flex aspect-[3/4] flex-col items-center justify-center gap-2 rounded-lg p-3 text-center text-gray-300"
    >
      <div
        style={{ borderWidth: 2, borderStyle: "dashed", borderColor: "#9ca3af" }}
        className="flex h-20 w-20 items-center justify-center rounded-md text-4xl font-bold"
      >
        ？
      </div>

      <p className="text-sm font-bold">未実装</p>
    </div>
  );
}
