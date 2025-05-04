"use client";
import { Sparkles, Utensils } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { useUser } from "@/context/UserContext";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "../services/AuthService";

export default function Navbar() {
  const { user, setIsLoading } = useUser();
  console.log(user);
  const pathname = usePathname();
  const router = useRouter();
  const handleLogOut = () => {
    logout();
    setIsLoading(true);
    // if (protectedRoutes.some((route) => pathname.match(route))) {
    //   router.push("/");
    // }
  };
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-orange-600 font-bold text-xl"
        >
          <Utensils className="h-6 w-6" />
          StreetBites
        </Link>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            className="text-orange-600 hover:bg-orange-50"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Go Premium
          </Button>
          {/* <Link href={"/signup"}>
            <Button variant="outline">Sign In</Button>
          </Link> */}
          {user ? (
          <>
            <Button
              onClick={handleLogOut}
              variant={"outline"}
              className="rounded-full"
            >
              LogOut
            </Button>

            {/* <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Dashboard</DropdownMenuItem>
                <DropdownMenuItem>My shop</DropdownMenuItem>
                <DropdownMenuSeparator></DropdownMenuSeparator>
                <DropdownMenuItem
                  className="bg-red-500 text-white cursor-pointer"
                  onClick={handleLogOut}
                >
                  <LogOut></LogOut>
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu> */}
          </>
        ) : (
          <Link href={"/login"}>
            <Button variant={"outline"} className="rounded-full">
              Login
            </Button>
          </Link>
        )}
        </div>

     
      </div>
    </nav>
  );
}
