import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function PostSearchBox() {
    return (
        <div className="relative">
            <Input
                type="search"
                placeholder="Search street food spots..."
                className="w-full max-w-xs bg-gray-100 rounded-full pl-10 py-2"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
        </div>
    );
}