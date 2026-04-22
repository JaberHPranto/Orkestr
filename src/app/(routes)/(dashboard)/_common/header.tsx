"use client";

import { Logout, MoonIcon, SunIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export const Header = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && theme === "dark";

  return (
    <div className="border-border border-b bg-background">
      <div className="mx-auto flex h-12 w-full max-w-6xl items-center justify-end px-4 lg:px-0">
        <div className="flex items-center gap-4">
          <Button
            className={"relative size-8 rounded-full"}
            onClick={() => setTheme(isDark ? "light" : "dark")}
            size={"icon"}
            variant={"outline"}
          >
            <HugeiconsIcon
              className={cn(
                "absolute size-5",
                isDark ? "scale-100" : "scale-0"
              )}
              icon={SunIcon}
            />
            <HugeiconsIcon
              className={cn(
                "absolute size-5",
                isDark ? "scale-0" : "scale-100"
              )}
              icon={MoonIcon}
            />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className={"size-8 shrink-0 rounded-full"}>
                <AvatarImage src={""} />
                <AvatarFallback className={"rounded-full"}>JH</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className={"w-56"}>
              <DropdownMenuItem>
                <HugeiconsIcon className="size-4" icon={Logout} />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};
