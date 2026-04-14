import PostFeed from "@/components/PostFeed";
import TrendingSidebar from "@/components/TrendingSidebar";

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex gap-6">
        <div className="flex-1 min-w-0">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">
              What&apos;s happening in{" "}
              <span className="bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
                Rajkot
              </span>
            </h1>
            <p className="text-muted-foreground mt-1">
              Discover local events, food spots, sports, and more
            </p>
          </div>
          <PostFeed />
        </div>
        <aside className="hidden lg:block w-80 flex-shrink-0">
          <div className="sticky top-20">
            <TrendingSidebar />
          </div>
        </aside>
      </div>
    </div>
  );
}
