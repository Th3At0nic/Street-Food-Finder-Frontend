import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Session } from "next-auth";
import { cn } from "@/lib/utils";

export default function ProfileCard({ session, className }: { session: Session | null, className?: string }) {
    return (
        <Card className={cn('w-full max-w-sm mx-auto shadow-lg rounded-2xl p-8 h-[220px]', className)}>
            <CardHeader className="flex flex-col items-center">
                <Avatar className="h-20 w-20 sm:h-20 sm:w-20 mb-2">
                    <AvatarImage
                        src={session?.user?.image || "/api/placeholder/64/64"}
                        alt="Your profile"
                        sizes="40px"
                    />
                    <AvatarFallback className="text-xl">
                        {session?.user?.name?.[0] || "U"}
                    </AvatarFallback>
                </Avatar>
                <CardTitle className="text-lg text-center whitespace-nowrap">
                    {session?.user?.name || "Unknown User"}
                </CardTitle>
                <p className="text-sm text-muted-foreground">{session?.user?.email || "No email provided"}</p>
            </CardHeader>
        </Card>
    );
}
