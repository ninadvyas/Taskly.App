import React from "react";
import { Avatar, AvatarImage } from "../ui/avatar";

export default function LeftLogo() {
  return (
    <div
      aria-label="Select a team"
      className="px-3 py-2 transition-all hover:bg-secondary flex rounded-sm items-center gap-1.5 justify-between border"
    >
      <Avatar className="h-6 w-6">
        <AvatarImage
          src="/taskly.png"
          alt="taskly"
        />
      </Avatar>
      Taskly.App
    </div>
  );
}
