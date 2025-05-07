'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ImageIcon, MapPinIcon, DollarSignIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
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
import { toast } from 'sonner';
import { PostSearchBox } from './PostSearchBox';
import Image from 'next/image';
import { createPost } from '@/app/actions/post-actions';
import PostCategorySelect from './PostCategorySelect';

export function CreatePostCard() {
    const { data: session } = useSession();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        categoryId: '',
        location: '',
        priceRangeStart: '',
        priceRangeEnd: '',
        images: [] as File[]
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCategoryChange = (value: string) => {
        setFormData(prev => ({ ...prev, categoryId: value }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newImages = Array.from(e.target.files);
            setFormData(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!session) {
            toast.error('Please log in to create a post');
            return;
        }
        const toastId = toast.loading('Creating post...');
        try {
            const postFormData = new FormData();

            const jsonData = {
                title: formData.title,
                description: formData.description,
                categoryId: formData.categoryId,
                location: formData.location,
                priceRangeStart: Number(formData.priceRangeStart),
                priceRangeEnd: Number(formData.priceRangeEnd)
            };

            postFormData.append('data', JSON.stringify(jsonData));

            formData.images.forEach(image => {
                postFormData.append('files', image);
            });

            const response = await createPost(postFormData)
            console.log({ response });
            if (response.success) {
                toast.success("Your post has been submitted for review", { id: toastId });

                setIsDialogOpen(false);
                setFormData({
                    title: '',
                    description: '',
                    categoryId: '',
                    location: '',
                    priceRangeStart: '',
                    priceRangeEnd: '',
                    images: []
                });
            } else throw new Error(response.message);
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message || 'Failed to create post. Please try again.', { id: toastId });
            }
        }
    };

    return (
        <Card className="mb-4 shadow-sm">
            <CardContent className="pt-0">
                <div className='flex justify-between mb-4 items-center'>
                    <Avatar>
                        <AvatarImage
                            src={session?.user?.image || '/api/placeholder/32/32'}
                            alt="Your profile"
                        />
                        <AvatarFallback>
                            {session?.user?.name?.[0] || 'U'}
                        </AvatarFallback>
                    </Avatar>
                    <PostSearchBox />
                </div>
                <div className="flex items-center justify-center space-x-3">
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button
                                className="rounded-full bg-orange-500 cursor-pointer hover:bg-orange-600"
                            >
                                Share a post...
                            </Button>
                        </DialogTrigger>

                        <DialogContent className="sm:max-w-[500px]">
                            <form onSubmit={handleSubmit}>
                                <DialogHeader>
                                    <DialogTitle>Share a post</DialogTitle>
                                    <DialogDescription>
                                        Tell others about an amazing street food find!
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="grid gap-4 py-4">
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
                                        <PostCategorySelect handleCategoryChange={handleCategoryChange} />
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
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {formData.images.map((image, index) => (
                                                <div key={index} className="h-16 w-16 rounded overflow-hidden">
                                                    <Image
                                                        src={URL.createObjectURL(image)}
                                                        alt={`Upload ${index + 1}`}
                                                        className="h-full w-full object-cover"
                                                        width={40}
                                                        height={40}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <DialogFooter>
                                    <Button type="submit">Post</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1"
                        onClick={() => setIsDialogOpen(true)}
                    >
                        <ImageIcon className="w-5 h-5 mr-2 text-green-500" />
                        Upload Photos
                    </Button>

                    <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1"
                        onClick={() => setIsDialogOpen(true)}
                    >
                        <MapPinIcon className="w-5 h-5 mr-2 text-red-500" />
                        Add Location
                    </Button>

                    <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1"
                        onClick={() => setIsDialogOpen(true)}
                    >
                        <DollarSignIcon className="w-5 h-5 mr-2 text-blue-500" />
                        Price Range
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}