"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap,
} from "react-leaflet";
import { LocateFixed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { PostSummary, PostCategory } from "@/lib/types";
import { categoryLabels, categoryMapColors } from "@/lib/mock-data";
import "leaflet/dist/leaflet.css";

interface ExploreMapClientProps {
  posts: PostSummary[];
}

function LocateButton() {
  const map = useMap();

  const handleLocate = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          map.flyTo([pos.coords.latitude, pos.coords.longitude], 15);
        },
        () => {
          // silently fail
        }
      );
    }
  };

  return (
    <div className="leaflet-top leaflet-right" style={{ zIndex: 1000 }}>
      <div className="leaflet-control m-2">
        <Button
          size="sm"
          variant="secondary"
          className="shadow-md"
          onClick={handleLocate}
        >
          <LocateFixed className="h-4 w-4 mr-1" />
          My Location
        </Button>
      </div>
    </div>
  );
}

const allCategories: PostCategory[] = ["EVENT", "FOOD", "SPORTS", "DAYRO"];

export default function ExploreMapClient({ posts }: ExploreMapClientProps) {
  const [activeCategories, setActiveCategories] = useState<Set<PostCategory>>(
    new Set(allCategories)
  );

  const toggleCategory = (cat: PostCategory) => {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) {
        next.delete(cat);
      } else {
        next.add(cat);
      }
      return next;
    });
  };

  const filteredPosts = posts.filter((p) => activeCategories.has(p.category));

  return (
    <div className="relative h-[calc(100vh-4rem)]">
      <MapContainer
        center={[22.3039, 70.8022]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocateButton />

        {filteredPosts.map((post) => {
          const coords = post.locationCoordinate?.split(",");
          const pLat = coords ? parseFloat(coords[0]) : NaN;
          const pLng = coords ? parseFloat(coords[1]) : NaN;
          return !isNaN(pLat) && !isNaN(pLng) ? (
            <CircleMarker
              key={post.id}
              center={[pLat, pLng]}
              radius={10}
              pathOptions={{
                color: categoryMapColors[post.category],
                fillColor: categoryMapColors[post.category],
                fillOpacity: 0.8,
                weight: 2,
              }}
            >
              <Popup>
                <div className="min-w-[200px]">
                  <Badge
                    variant="outline"
                    className="mb-2 text-[10px]"
                    style={{
                      borderColor: categoryMapColors[post.category],
                      color: categoryMapColors[post.category],
                    }}
                  >
                    {categoryLabels[post.category]}
                  </Badge>
                  <h3 className="font-semibold text-sm leading-tight mb-1">
                    {post.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-2">
                    by {post.author.displayName}
                  </p>
                  <Link href={`/post/${post.id}`}>
                    <Button size="sm" className="w-full text-xs h-7">
                      View Post
                    </Button>
                  </Link>
                </div>
              </Popup>
            </CircleMarker>
          ) : null;
        })}
      </MapContainer>

      {/* Category filter overlay */}
      <div className="absolute top-3 left-3 z-[1000] bg-background/95 backdrop-blur rounded-lg border shadow-lg p-3 space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Filter
        </p>
        {allCategories.map((cat) => (
          <div key={cat} className="flex items-center gap-2">
            <Checkbox
              id={`filter-${cat}`}
              checked={activeCategories.has(cat)}
              onCheckedChange={() => toggleCategory(cat)}
            />
            <Label
              htmlFor={`filter-${cat}`}
              className="text-sm flex items-center gap-1.5 cursor-pointer"
            >
              <span
                className="h-3 w-3 rounded-full inline-block"
                style={{ backgroundColor: categoryMapColors[cat] }}
              />
              {categoryLabels[cat]}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
}
