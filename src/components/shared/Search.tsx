import { Search as SearchIcon, ChevronRight } from "lucide-react";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "../ui/button";
export default function SearchBox() {

    return(
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-2 flex flex-col md:flex-row gap-2">
        <div className="flex-1 flex items-center gap-2">
          <SearchIcon className="h-5 w-5 text-gray-400 ml-3" />
          <Input
            placeholder="Search for tacos, dumplings, churros..."
            className="border-0 shadow-none focus-visible:ring-0"
          />
        </div>
        
        <Select>
          <SelectTrigger className="w-[180px] border-0">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="snacks">Snacks</SelectItem>
            <SelectItem value="meals">Meals</SelectItem>
            <SelectItem value="sweets">Sweets</SelectItem>
          </SelectContent>
        </Select>

        <Button className="bg-orange-600 hover:bg-orange-700">
          Search
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    )
}