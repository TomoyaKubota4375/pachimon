type PlayerProps = {
  x: number;
  y: number;
};

export default function Player({ x, y }: PlayerProps) {
  return (
    <div
      className="absolute z-30 flex h-14 w-10 flex-col items-center"
      style={{
        left: x,
        top: y,
      }}
    >
      <div className="h-5 w-5 rounded-full border-2 border-black bg-orange-200" />
      <div className="h-7 w-8 rounded-md border-2 border-black bg-blue-600" />
      <div className="flex gap-1">
        <div className="h-3 w-3 bg-black" />
        <div className="h-3 w-3 bg-black" />
      </div>
    </div>
  );
}