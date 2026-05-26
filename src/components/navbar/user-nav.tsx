import { ChevronDown, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export function UserNav({
  userName,
  profilePicture,
  onLogout,
}: {
  userName: string;
  profilePicture: string;
  onLogout: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative !bg-transparent h-9 px-2 hover:bg-muted/50 rounded-full flex items-center gap-1.5 transition-all duration-200 border border-transparent hover:border-border/30"
        >
          <Avatar className="h-7 w-7 !cursor-pointer transition-transform duration-200 hover:scale-105">
            <AvatarImage
              src={profilePicture || ""}
              className="!cursor-pointer"
            />
            <AvatarFallback
              className="bg-primary/10 border border-primary/20 text-primary font-medium text-xs flex items-center justify-center"
            >
              {userName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-[13px] font-medium text-foreground/80 hidden sm:inline-block max-w-[80px] truncate">
            {userName}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-foreground/50 transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 p-1.5 border border-border/80 shadow-xl rounded-xl bg-popover/95 backdrop-blur-md"
        align="end"
        forceMount
      >
        <DropdownMenuLabel className="flex flex-col items-start gap-0.5 px-2.5 py-2">
          <span className="font-semibold text-[13.5px] text-foreground leading-none">{userName}</span>
          <span className="text-[11px] text-muted-foreground font-light leading-none">Personal Account</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-1" />
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="cursor-pointer rounded-lg px-2.5 py-2 text-[13px] text-foreground hover:bg-accent/80 hover:text-foreground focus:bg-accent/80 transition-colors duration-150"
            onClick={onLogout}
          >
            <LogOut className="w-4 h-4 mr-2.5 text-muted-foreground" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

