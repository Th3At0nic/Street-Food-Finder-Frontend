import { IMeta } from "@/types";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";

interface PaginationProps {
    meta: IMeta;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    page: number;
    isTableLoading: boolean;
    tableContentName: string;
}

export const PaginationComponent = ({ meta, setPage, page, isTableLoading, tableContentName = "data" }: PaginationProps) => {
    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {isTableLoading ? (
                <Skeleton className="h-4 w-[200px]" />
            ) : (
                <div className="text-sm">
                    Showing {(meta.page * meta.limit) - meta.limit + 1} -  {(meta.page * meta.limit)} of {meta.total} {tableContentName}
                </div>
            )}
            <div className="flex gap-2">
                <Button
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    variant="outline"
                    disabled={page <= 1 || isTableLoading}
                >
                    Previous
                </Button>
                <Button
                    onClick={() => setPage((prev) => prev + 1)}
                    variant="outline"
                    disabled={page >= meta.totalPages || isTableLoading}
                >
                    Next
                </Button>
            </div>
        </div>
    );
};