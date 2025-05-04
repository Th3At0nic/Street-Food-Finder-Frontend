import PostCard from "@/components/modules/post/PostCard";
import SearchBox from "@/components/shared/Search";

export default function AllspotsPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">All Spots</h1>
                <p className="text-gray-600 text-lg mb-8">
                    Explore all the street food spots
                </p>
                <div className="mb-8">
                    <SearchBox />
                </div>
                {/* Add your content here */}
                <div className="grid md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((item) => (
                        <PostCard key={item} />
                    ))}
                </div>
            </div>
        </div>
    );
}