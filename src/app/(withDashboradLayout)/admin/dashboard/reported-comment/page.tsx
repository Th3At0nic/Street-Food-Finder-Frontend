import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
    <div>
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
    </div>
  );
};

export default page;
