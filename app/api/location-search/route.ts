import { NextRequest, NextResponse } from "next/server";
import { RAJKOT_BBOX } from "@/lib/geo";

export interface LocationResult {
  name: string;
  city: string;
  lat: number;
  lng: number;
  displayName: string;
}

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q")?.trim();

  if (!query || query.length < 2) {
    return NextResponse.json([]);
  }

  try {
    const url = new URL("https://photon.komoot.io/api/");
    url.searchParams.set("q", query);
    url.searchParams.set("bbox", RAJKOT_BBOX);
    url.searchParams.set("limit", "5");
    url.searchParams.set("lang", "en");

    const res = await fetch(url.toString(), {
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Photon API request failed" },
        { status: 502 }
      );
    }

    const data = await res.json();

    const results: LocationResult[] = (data.features ?? []).map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (f: any) => {
        const props = f.properties ?? {};
        const [lng, lat] = f.geometry?.coordinates ?? [0, 0];
        const name: string = props.name ?? "";
        const city: string = props.city ?? props.county ?? "Rajkot";
        const parts = [name, props.street, props.district, city].filter(Boolean);
        return {
          name,
          city,
          lat,
          lng,
          displayName: parts.join(", "),
        };
      }
    );

    return NextResponse.json(results);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch location results" },
      { status: 500 }
    );
  }
}
