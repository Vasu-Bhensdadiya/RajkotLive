import PostFeed from "@/components/PostFeed";
import TrendingSidebar from "@/components/TrendingSidebar";

export default function DayroPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex gap-6">
        <div className="flex-1 min-w-0">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Dayro in Rajkot</h1>
            <p className="text-muted-foreground mt-1">
              Folk music, bhajans, lok dayro, and cultural performances
            </p>
          </div>
          <PostFeed category="DAYRO" />
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
