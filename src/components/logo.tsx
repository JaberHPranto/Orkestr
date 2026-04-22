import Link from "next/link";

export const Logo = () => (
  <Link className="flex items-center gap-2" href="/workflow">
    <div className="flex size-7 items-center justify-center rounded-md bg-primary text-black/90 text-lg">
      <span>O</span>
    </div>

    <div className="flex items-center">
      <span className="font-black text-lg text-primary">Orkestr</span>
    </div>
  </Link>
);
