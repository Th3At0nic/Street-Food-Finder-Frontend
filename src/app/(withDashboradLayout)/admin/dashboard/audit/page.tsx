// app/admin/audit/page.tsx
'use client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Shield, User, Edit, Trash } from "lucide-react";

const logs = [
  { id: 1, action: "POST_APPROVAL", user: "admin@example.com", target: "Spicy Tacos", timestamp: "2024-03-15 14:30" },
  { id: 2, action: "USER_BAN", user: "admin@example.com", target: "user3@example.com", timestamp: "2024-03-15 14:25" }
];

export default function AuditLogPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Shield className="h-6 w-6 text-purple-600" />
          Audit Logs
        </h2>
        <p className="text-sm text-gray-500">System activity and administrative actions</p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Action</TableHead>
            <TableHead>Performed By</TableHead>
            <TableHead>Target</TableHead>
            <TableHead>Timestamp</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell>
                <Badge variant={
                  log.action.includes('APPROVAL') ? 'default' :
                  log.action.includes('BAN') ? 'destructive' : 'outline'
                }>
                  {log.action}
                </Badge>
              </TableCell>
              <TableCell>{log.user}</TableCell>
              <TableCell>{log.target}</TableCell>
              <TableCell>{log.timestamp}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}