import { Sparkles, Utensils } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

export default function Navbar() {

    return (
        <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-orange-600 font-bold text-xl">
            <Utensils className="h-6 w-6" />
            StreetBites
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="text-orange-600 hover:bg-orange-50">
              <Sparkles className="h-4 w-4 mr-2" />
              Go Premium
            </Button>
            <Button variant="outline">Sign In</Button>
          </div>
        </div>
      </nav>
    );


}