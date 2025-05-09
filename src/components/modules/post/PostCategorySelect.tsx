import Select, { components, MenuListProps } from "react-select";
import { usePaginatedFetch } from "@/hooks/usePaginatedFetch";
import { useCallback } from "react";
import { fetchPostCategories } from "@/app/actions/post-actions";

// Define shape for react-select options
type SelectOption = {
    value: string;
    label: string;
};

interface PostCategorySelectProps {
    handleCategoryChange: (value: string) => void
}

export default function PostCategorySelect({ handleCategoryChange }: PostCategorySelectProps) {
    const {
        items: postCategories,
        observerRef,
        loading,
        meta,
    } = usePaginatedFetch({
        fetchFn: async (page) => {
            const { categories, meta } = await fetchPostCategories({ page, limit: 10 });
            const mapped = categories.map((c) => ({
                value: c.catId,
                label: c.name,
            }));
            return { data: mapped, meta };
        },
    });

    const customMenuList = useCallback(
        (props: MenuListProps<SelectOption>) => {
            return (
                <div>
                    <components.MenuList {...props}>
                        {props.children}
                        <div ref={observerRef} style={{ textAlign: "center", padding: "0.5rem" }}>
                            {loading
                                ? "Loading..."
                                : meta.page >= meta.totalPages
                                    ? "All categories loaded"
                                    : "Scroll to load more"}
                        </div>
                    </components.MenuList>
                </div>
            );
        },
        [observerRef, loading, meta]
    );

    return (
        <Select
            onChange={(newValue) => {
                if (!newValue) return;
                handleCategoryChange((newValue as SelectOption).value);
            }}
            options={postCategories}
            components={{ MenuList: customMenuList }}
            placeholder="Select category"
            isSearchable
            className="w-full"
        />
    );
}
