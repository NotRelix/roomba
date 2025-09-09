import Link from "next/link";
import { ProfileIcon } from "./profile-icon";

export function Navbar() {
  return (
    <nav className="border-b-1 sticky top-0 flex justify-between border-neutral-200 px-4 py-2 dark:border-neutral-800">
      <Link
        href={"/"}
        className="self-center border-0 text-xl font-semibold ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
      >
        Roomba
      </Link>
      <div className="flex items-center gap-4">
        <ProfileIcon />
      </div>
    </nav>
  );
}
