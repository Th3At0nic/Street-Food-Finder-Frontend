"use client";

import { BiCategory } from "react-icons/bi";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, Pencil, PlusCircle, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { IMeta, TPostCategory } from "@/types";
import { formatDate } from "date-fns";
import { toast } from "sonner";
import { fetchPostCategories } from "@/app/actions/post-actions";
import { PostCategoryModal } from "@/components/modules/post/AllComments/PostCategoryModal";
import { createOrUpdatePostCategory, deletePostCategory } from "@/components/services/PostServices";
import { DeleteConfirmationModal } from "@/components/modules/deleteModal/deleteConfirmationModal";
import { NoDataFound } from "@/components/modules/common/NoDataFound";
import { PaginationComponent } from "@/components/shared/PaginationComponent";
import { TableSkeleton } from "@/components/shared/TableSkeleton";

export default function PostCategoryPage() {
  const [postCategories, setPostCategories] = useState<TPostCategory[]>([]);
  const [page, setPage] = useState(1);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [limit, setLimit] = useState(7);
  const [meta, setMeta] = useState<IMeta>({ page, limit, total: 0, totalPages: 1 });

  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<TPostCategory | undefined>(undefined);

  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchInput);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchInput]);



  useEffect(() => {
    const getPostCategories = async () => {
      setIsTableLoading(true);
      try {
        const result = await fetchPostCategories({
          page,
          limit,
          searchTerm
        });
        setMeta(result.meta);
        setPostCategories(result.categories);
      } catch (err) {
        console.log("Failed to fetch post categories", err);
      } finally {
        setIsTableLoading(false);
      }

    };
    getPostCategories();
  }, [page, limit, searchTerm]);

  const handleCreateCategory = () => {
    setCurrentCategory(undefined);
    setOpen(true);
  };

  const handleEditPlan = async (category: TPostCategory) => {
    setCurrentCategory(category);
    setOpen(true);
  };
  const handleDeleteCategory = async () => {
    const toastId = toast.loading("Deleting category...");
    setIsDeleting(true);
    const result = await deletePostCategory(currentCategory!.catId);
    if (result.success) {
      setPostCategories(postCategories.filter(plan => plan.catId !== currentCategory?.catId));
      toast.success(result.message || "Category deleted", { id: toastId });
    } else {
      toast.error(result.message || "Some error occurred while deleting", { id: toastId });
    }
    setIsDeleting(false);
    setIsDeleteOpen(false);
  };

  const openDeleteConfirmModal = (category: TPostCategory) => {
    setCurrentCategory(category);
    setIsDeleteOpen(true);
  };

  const handleSubmit = async (data: TPostCategory) => {
    setIsLoading(true);
    const toastId = toast.loading(`${currentCategory ? "Updating" : "Creating"} plan ${data.name}...`);

    try {
      const result = await createOrUpdatePostCategory(data);
      console.log({ result });
      if (currentCategory) {
        // Update existing category
        setPostCategories(postCategories.map(plan =>
          plan.name === currentCategory.name ? result.data : plan
        ));
        toast.success(`Successfully updated ${data.name}`, { id: toastId })
      } else {
        // Create new category
        setPostCategories([...postCategories, result.data]);
        toast.success(`Successfully created ${data.name}`, { id: toastId })
      }

      setOpen(false);
    } catch (error) {
      console.log({ error });
      toast.error("Something went wrong. Please try again.", { id: toastId })
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <BiCategory className="h-6 w-6" />
            <span className="text-xl sm:text-2xl">Post Category Management</span>
          </h2>
          <p className="text-sm text-gray-500">
            Manage post categories
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4 w-full sm:w-auto">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search category..."
              className="pl-10 w-full"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <Button className="cursor-pointer" onClick={handleCreateCategory}>
            <PlusCircle /> Add
          </Button>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="min-w-[600px]">
            <TableHeader className="bg-accent">
              <TableRow>
                <TableHead className="w-[30%]">Category Name</TableHead>
                <TableHead className="w-[20%] text-left">Created At</TableHead>
                <TableHead className="w-[20%] text-left">Updated At</TableHead>
                <TableHead className="w-[30%] text-right">Actions</TableHead>

              </TableRow>
            </TableHeader>
            <TableBody>
              {isTableLoading ? (
                <TableSkeleton cols={4} />
              ) : postCategories.length ? postCategories?.map((postCategory) => (
                <TableRow key={postCategory.catId}>
                  <TableCell className="font-medium truncate max-w-[200px] sm:max-w-none">
                    {postCategory.name}
                  </TableCell>
                  <TableCell className="text-left">
                    {formatDate(postCategory.createdAt, "dd-MMM-yyyy hh:mm:ss a")}

                  </TableCell>
                  <TableCell className="text-left">
                    {formatDate(postCategory.updatedAt, "dd-MMM-yyyy hh:mm:ss a")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1 sm:gap-2">
                      <Button
                        onClick={() => handleEditPlan(postCategory)}
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8 cursor-pointer"
                      >
                        <Pencil />
                      </Button>
                      <Button
                        onClick={() => openDeleteConfirmModal(postCategory)}
                        size="icon"
                        variant="destructive"
                        className="h-8 w-8 cursor-pointer"
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )) : <TableRow>
                <TableCell colSpan={4} className="text-center">
                  <NoDataFound className="h-full" />
                </TableCell>
              </TableRow>}
            </TableBody>
          </Table>
        </div>
      </div>


      {/* Pagination */}
      <PaginationComponent
        isTableLoading={isTableLoading}
        meta={meta}
        setPage={setPage}
        page={page}
        tableContentName="post categories"
      />
      <PostCategoryModal
        open={open}
        onOpenChange={setOpen}
        category={currentCategory}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteCategory}
        isLoading={isDeleting}
        title="Delete Post Category?"
        description={<>
          Are you sure you want to delete <span className="font-bold">{currentCategory?.name}?</span> This action cannot be undone.
        </>}
      />
    </div >
  );
}
