import React from "react";
import LeftLogo from "./leftlogo";
import Links from "./links";
import Search from "./search";
import UserMenu from "./user-menu";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center py-2">
      <div className="flex items-center gap-12">
        <LeftLogo />
        <Links />
      </div>
      <div className="flex items-center gap-4">
        <Search />
        <UserMenu />
      </div>
    </nav>
  );
}
