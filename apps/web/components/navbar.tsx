import Link from "next/link";
import ProfileDropDown from "#components/profile-dropdown";

export default function Navbar() {
  return (
    <nav className="bg-background border-b-1 sticky top-0 flex justify-between border-neutral-200 px-4 py-2 dark:border-neutral-800">
      <Link
        href={"/"}
        className="self-center border-0 text-xl font-semibold ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
      >
        Roomba
      </Link>
      <div className="flex items-center gap-4">
        <ProfileDropDown />
      </div>
    </nav>
  );
}
