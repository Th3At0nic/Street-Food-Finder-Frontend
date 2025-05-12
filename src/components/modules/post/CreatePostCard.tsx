"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ImageIcon, MapPinIcon, DollarSignIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Image from "next/image";
import { createPost } from "@/app/actions/post-actions";
import PostCategorySelect from "./PostCategorySelect";
import { redirect } from "next/navigation";

export function CreatePostCard() {
  const { data: session } = useSession();

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categoryId: "",
    location: "",
    priceRangeStart: "",
    priceRangeEnd: "",
    images: [] as File[],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    console.log("ekhane category value: ", value);
    setFormData((prev) => ({ ...prev, categoryId: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = Array.from(e.target.files);
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newImages],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      toast.error("Please log in to create a post");
      return;
    }

    const toastId = toast.loading("Creating post...");
    try {
      const postFormData = new FormData();

      const jsonData = {
        title: formData.title,
        description: formData.description,
        categoryId: formData.categoryId,
        location: formData.location,
        priceRangeStart: Number(formData.priceRangeStart),
        priceRangeEnd: Number(formData.priceRangeEnd),
      };

      postFormData.append("data", JSON.stringify(jsonData));

      formData.images.forEach((image) => {
        postFormData.append("files", image);
      });

      const response = await createPost(postFormData);
      console.log({ response });
      if (response.success) {
        toast.success("Your post has been submitted for review", {
          id: toastId,
        });

        setIsDialogOpen(false);
        setFormData({
          title: "",
          description: "",
          categoryId: "",
          location: "",
          priceRangeStart: "",
          priceRangeEnd: "",
          images: [],
        });
      } else throw new Error(response.message);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(
          error.message || "Failed to create post. Please try again.",
          { id: toastId }
        );
      }
    }
  };
  const handleOpenDialog = () => {
    if (!session) {
      redirect("/login"); // redirect if not logged in
    }
    setIsDialogOpen(true); // otherwise open dialog
  };
  return (
    <Card className="mb-4 shadow-sm">
      <CardContent className="pt-0">
        <div className="flex items-center justify-center space-x-3 w-full">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={handleOpenDialog}
                className="rounded-full cursor-pointer w-full"
              >
                Share a post...
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[500px] max-h-[90vh] p-0 flex flex-col">
              <form
                onSubmit={handleSubmit}
                className="flex-1 flex flex-col overflow-hidden"
              >
                <DialogHeader className="p-6 pb-2">
                  <DialogTitle>Share a post</DialogTitle>
                  <DialogDescription>
                    Tell others about an amazing street food find!
                  </DialogDescription>
                </DialogHeader>

                {/* Scrollable form body */}
                <div className="flex-1 overflow-y-auto px-6 space-y-4 pb-6">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g., Amazing Taco Stand"
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Tell us about this street food spot..."
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <PostCategorySelect
                      handleCategoryChange={handleCategoryChange}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Where is this street food spot?"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="priceRangeStart">Price From</Label>
                      <Input
                        id="priceRangeStart"
                        name="priceRangeStart"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.priceRangeStart}
                        onChange={handleChange}
                        placeholder="0.00"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="priceRangeEnd">Price To</Label>
                      <Input
                        id="priceRangeEnd"
                        name="priceRangeEnd"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.priceRangeEnd}
                        onChange={handleChange}
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="images">Upload Images</Label>
                    <Input
                      id="images"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="cursor-pointer"
                    />
                    <div className="grid grid-cols-4 gap-2">
                      {formData.images.map((image, index) => (
                        <div
                          key={index}
                          className="h-16 w-16 rounded overflow-hidden"
                        >
                          <Image
                            src={URL.createObjectURL(image)}
                            alt={`Upload ${index + 1}`}
                            className="h-full w-full object-cover"
                            width={64}
                            height={64}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <DialogFooter className="p-4 border-t">
                  <Button type="submit" className="w-full">
                    Post
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Separator className="my-4" />

        <div className="flex flex-wrap justify-between">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1"
            onClick={handleOpenDialog}
          >
            <ImageIcon className="w-5 h-5 mr-2 text-green-500" />
            Upload Photos
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="flex-1"
            onClick={handleOpenDialog}
          >
            <MapPinIcon className="w-5 h-5 mr-2 text-red-500" />
            Add Location
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="flex-1"
            onClick={handleOpenDialog}
          >
            <DollarSignIcon className="w-5 h-5 mr-2 text-blue-500" />
            Price Range
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
