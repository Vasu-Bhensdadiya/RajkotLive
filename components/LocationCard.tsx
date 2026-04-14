"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { MapPin, Navigation, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { haversineDistance } from "@/lib/geo";

const MapView = dynamic(() => import("./MapView"), { ssr: false });

interface LocationData {
  name: string;
  address: string;
  lat: number;
  lng: number;
}

interface LocationCardProps {
  location: LocationData;
}

export default function LocationCard({ location }: LocationCardProps) {
  const [distance, setDistance] = useState<string | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const d = haversineDistance(
            pos.coords.latitude,
            pos.coords.longitude,
            location.lat,
            location.lng
          );
          setDistance(d.toFixed(1));
        },
        () => {} // silently fail
      );
    }
  }, [location.lat, location.lng]);

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-red-100 p-2 mt-0.5">
            <MapPin className="h-4 w-4 text-red-600" />
          </div>
          <div className="flex-1">
            <p className="font-semibold">{location.name}</p>
            <p className="text-sm text-muted-foreground">{location.address}</p>
            {distance && (
              <p className="text-sm text-blue-600 flex items-center gap-1 mt-1">
                <Navigation className="h-3 w-3" />
                {distance} km from your location
              </p>
            )}
          </div>
        </div>

        <MapView lat={location.lat} lng={location.lng} />

        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1" asChild>
            <a
              href={`https://www.google.com/maps?q=${location.lat},${location.lng}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-3.5 w-3.5 mr-1" />
              Google Maps
            </a>
          </Button>
          <Button variant="outline" size="sm" className="flex-1" asChild>
            <a
              href={`https://maps.apple.com/?q=${location.lat},${location.lng}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-3.5 w-3.5 mr-1" />
              Apple Maps
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
