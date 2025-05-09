import NoPost from "@/components/shared/noPost";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Shield } from "lucide-react";

const page = () => {
  const reportedComments = [
    {
      id: 1,
      content: "Overrated, not worth the price!",
      author: "user3@example.com",
      post: "Spicy Chicken Tacos",
      reports: 3,
    },
  ];

  return (
    <div className="space-y">
      
       <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-red-600" />
              Pending Comment Approval
            </CardTitle>
            <div className="text-sm text-gray-500">
              1 Comment awaiting moderation
            </div>
          </div>
          <div className="flex gap-4 w-full sm:w-auto">
            {/* <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="normal">Normal Posts</SelectItem>
                <SelectItem value="premium">Premium Posts</SelectItem>
              </SelectContent>
            </Select> */}
            <div className="relative w-full sm:w-[240px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input placeholder="Search posts..." className="pl-10" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {1 === 0 ? (
            <div className="flex justify-center items-center py-10">
              <NoPost h="h-20" w="w-20" title="No Pending Comment Yet" />
            </div>
          ) : (
            <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Comment</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Post</TableHead>
                <TableHead>Reports</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
    
            <TableBody>
              {reportedComments.map((comment) => (
                <TableRow key={comment.id}>
                  <TableCell className="max-w-[300px] truncate">
                    {comment.content}
                  </TableCell>
                  <TableCell>{comment.author}</TableCell>
                  <TableCell>{comment.post}</TableCell>
                  <TableCell>
                    <Badge variant="destructive">{comment.reports}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button size="sm" variant="ghost">
                        Approve
                      </Button>
                      <Button size="sm" variant="destructive">
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          )}
        </CardContent>
      </Card>
      {/* Pagination Controls */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Showing 1-{2} of {3} results
        </div>
        <div className="flex gap-2">
          <Button variant="outline" disabled>
            Previous
          </Button>
          <Button variant="outline" disabled>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default page;
