"use client";


import { format } from "date-fns";
import Link from "next/link";
type Category = {
  catId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

type CategoryCardProps = {
  category: Category;
};

export const CategoryCard = ({ category }: CategoryCardProps) => {
   
  return (
  <Link href={"/posts"}>
    <div className="rounded-xl border shadow-sm p-4 hover:shadow-md transition-all cursor-pointer">
      <h3 className="text-lg font-semibold text-primary mb-1">{category.name}</h3>
      <p className="text-sm text-muted-foreground">
        <span className="font-medium">Created:</span>{" "}
        {format(new Date(category.createdAt), "dd MMM yyyy, hh:mm a")}
      </p>
      <p className="text-sm text-muted-foreground">
        <span className="font-medium">Updated:</span>{" "}
        {format(new Date(category.updatedAt), "dd MMM yyyy, hh:mm a")}
      </p>
    </div>
  </Link>
  );
};
