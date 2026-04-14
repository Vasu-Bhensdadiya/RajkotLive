import PostFeed from "@/components/PostFeed";
import TrendingSidebar from "@/components/TrendingSidebar";

export default function EventsPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex gap-6">
        <div className="flex-1 min-w-0">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Events in Rajkot</h1>
            <p className="text-muted-foreground mt-1">
              Festivals, melas, exhibitions, and cultural gatherings
            </p>
          </div>
          <PostFeed category="EVENT" />
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
