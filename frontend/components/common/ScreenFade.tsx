type ScreenFadeProps = {
  active: boolean;
};

export default function ScreenFade({ active }: ScreenFadeProps) {
  return (
    <div
      className={`pointer-events-none fixed inset-0 z-[9999] bg-black transition-opacity duration-500 ${
        active ? "opacity-100" : "opacity-0"
      }`}
    />
  );
}