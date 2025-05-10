import { PostImage } from '@/types';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface ImageGalleryProps {
    images: PostImage[];
}

export function ImageGallery({ images }: ImageGalleryProps) {
    const [activeIndex, setActiveIndex] = useState(0);

    if (images.length === 0) return null;

    // For simplicity, just show one image if there's only one
    if (images.length === 1) {
        return (
            <div className="rounded-md overflow-hidden mb-3">
                <Image
                    src={images[0].file_path}
                    alt="Post image"
                    className="w-full h-auto object-cover max-w-[200px]"

                    height={100}
                    width={100}
                />
            </div>
        );
    }

    const nextImage = () => {
        setActiveIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div className="relative rounded-md overflow-hidden mb-3">
            <Image
                src={images[activeIndex].file_path}
                alt={`Post image ${activeIndex + 1}`}
                className="w-full max-w-[200px] h-64 object-cover"
                height={100}
                width={100}
            />

            <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs">
                {activeIndex + 1} / {images.length}
            </div>

            <Button
                variant="outline"
                size="icon"
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full h-8 w-8"
                onClick={prevImage}
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>

            <Button
                variant="outline"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full h-8 w-8"
                onClick={nextImage}
            >
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    );
}