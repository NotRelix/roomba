"use client";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { useAuth } from "@repo/ui/hooks/auth";
import { UserRound } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";

export default function ProfileDropDown() {
  const { setTheme } = useTheme();
  const { isAuthenticated, username, logout } = useAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={"ghost"}
          size={"icon"}
          className="border-1 box-content size-4 rounded-lg bg-transparent p-1.5 dark:bg-neutral-800"
        >
          <UserRound className="h-4 w-4 dark:stroke-neutral-400" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="z-[9999] w-24" align="end">
        {isAuthenticated ? (
          <DropdownMenuLabel>{username}</DropdownMenuLabel>
        ) : (
          <DropdownMenuLabel>Guest</DropdownMenuLabel>
        )}
        <DropdownMenuSeparator />
        {isAuthenticated ? (
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link href={"/"}>Home</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={"/"}>Create Room</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={"/"}>Join Room</Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        ) : (
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link href={"/login"}>Login</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={"/register"}>Register</Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Theme</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="z-[9999]">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  System
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        {isAuthenticated && (
          <DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => logout()}>Logout</DropdownMenuItem>
          </DropdownMenuGroup>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
