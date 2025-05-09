// components/ui/no-data-found.tsx
import { FileText, Search, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

interface NoDataFoundProps extends React.HTMLAttributes<HTMLDivElement> {
    title?: string;
    description?: string;
    icon?: keyof typeof icons;
    action?: React.ReactNode;
}

const icons = {
    default: FileText,
    search: Search,
    inbox: Inbox,
};

export function NoDataFound({
    title = "No data found",
    description = "There's no data to display here at the moment.",
    icon = "default",
    action,
    className,
    ...props
}: NoDataFoundProps) {
    const IconComponent = icons[icon] || icons.default;

    return (
        <div className={cn("w-full h-full flex items-center justify-center", className)} {...props}>
            <div className="flex flex-col items-center justify-center gap-4 p-8 text-center max-w-md mx-auto">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <IconComponent className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                    <h3 className="text-lg font-medium text-foreground">{title}</h3>
                    <p className="text-sm text-muted-foreground">{description}</p>
                </div>
                {action && <div className="mt-2">{action}</div>}
            </div>
        </div>
    );
}