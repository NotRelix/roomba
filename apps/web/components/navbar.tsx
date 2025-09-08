import Link from "next/link";
import { ModeToggle } from "./toggle-mode";

export function Navbar() {
  return (
    <nav className="sticky top-0 flex justify-between px-4 py-2">
      <Link
        href={"/"}
        className="self-center border-0 text-xl font-semibold ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
      >
        Roomba
      </Link>
      <ModeToggle />
    </nav>
  );
}
