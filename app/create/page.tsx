"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  MapPin,
  X,
  Search,
  Image as ImageIcon,
  Check,
  Upload,
  Trash2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";
import { createPost } from "@/lib/api/postService";
import { uploadImages } from "@/lib/api/uploadService";
import { PostCategory } from "@/lib/types";
import { categoryLabels, categoryColors } from "@/lib/mock-data";
import type { LocationResult } from "@/app/api/location-search/route";

const MapPicker = dynamic(() => import("@/components/MapPicker"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] bg-muted rounded-lg flex items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin" />
    </div>
  ),
});

const schema = yup.object({
  title: yup
    .string()
    .min(5, "Min 5 characters")
    .max(200)
    .required("Title is required"),
  content: yup
    .string()
    .min(20, "Min 20 characters")
    .required("Content is required"),
  category: yup
    .string()
    .oneOf(["EVENT", "FOOD", "SPORTS", "DAYRO", "OTHER"])
    .required("Category is required"),
  image: yup.string().notRequired().default(""),
});

type FormData = yup.InferType<typeof schema>;

const categories: PostCategory[] = [
  "EVENT",
  "FOOD",
  "SPORTS",
  "DAYRO",
  "OTHER",
];

export default function CreatePostPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [locationName, setLocationName] = useState("");
  const [locationAddress, setLocationAddress] = useState("");
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [searchingLocation, setSearchingLocation] = useState(false);
  const [locationQuery, setLocationQuery] = useState("");
  const [locationResults, setLocationResults] = useState<LocationResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: { category: "OTHER" },
  });

  const watchedCategory = watch("category");
  const watchedTitle = watch("title");
  const watchedContent = watch("content");

  const handleStep1Next = async () => {
    const valid = await trigger(["title", "content", "category"]);
    if (valid) setStep(2);
  };

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      setImagePreview(dataUrl);
      setValue("image", dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setValue("image", "");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleLocationChange = useCallback((newLat: number, newLng: number) => {
    setLat(newLat);
    setLng(newLng);
  }, []);

  // Debounced autocomplete using Photon API via our backend
  useEffect(() => {
    if (locationQuery.length < 2) {
      setLocationResults([]);
      setShowDropdown(false);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setSearchingLocation(true);
      try {
        const res = await fetch(
          `/api/location-search?q=${encodeURIComponent(locationQuery)}`,
          { signal: controller.signal }
        );
        const data: LocationResult[] = await res.json();
        setLocationResults(data);
        setShowDropdown(data.length > 0);
      } catch {
        // silently fail (includes aborted requests)
      } finally {
        setSearchingLocation(false);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [locationQuery]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectLocation = (result: LocationResult) => {
    setLocationName(result.name);
    setLocationAddress(result.displayName);
    setLat(result.lat);
    setLng(result.lng);
    setLocationQuery(result.displayName);
    setShowDropdown(false);
  };

  const clearLocation = () => {
    setLocationName("");
    setLocationAddress("");
    setLat(null);
    setLng(null);
    setLocationQuery("");
    setLocationResults([]);
    setShowDropdown(false);
  };

  const onSubmit = async (data: FormData) => {
    if (!user) {
      router.push("/login");
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    try {
      // Upload image to S3 first
      let imageUrls: string[] = [];
      if (imageFile) {
        const uploaded = await uploadImages([imageFile]);
        imageUrls = uploaded.map((f) => f.url);
      }

      const post = await createPost({
        title: data.title,
        content: data.content,
        category: data.category as PostCategory,
        images: imageUrls.length > 0 ? imageUrls : undefined,
        address: locationAddress || locationName || undefined,
        locationCoordinate: lat && lng ? `${lat},${lng}` : undefined,
      });
      router.push(`/post/${post.id}`);
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Failed to publish post. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-2">Sign in to create a post</h2>
        <Button asChild className="mt-4">
          <a href="/login">Login</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Create a Post</h1>

      {/* Step indicators */}
      <div className="flex items-center gap-2 mb-6">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === s
                  ? "bg-primary text-primary-foreground"
                  : step > s
                  ? "bg-green-100 text-green-700"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {step > s ? <Check className="h-4 w-4" /> : s}
            </div>
            {s < 4 && (
              <div
                className={`h-0.5 w-8 ${
                  step > s ? "bg-green-300" : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="What's happening in Rajkot?"
                  {...register("title")}
                />
                {errors.title && (
                  <p className="text-xs text-red-500">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <Badge
                      key={cat}
                      variant="outline"
                      className={`cursor-pointer text-sm px-3 py-1.5 ${
                        watchedCategory === cat
                          ? categoryColors[cat] + " ring-2 ring-offset-1"
                          : "hover:bg-muted"
                      }`}
                      onClick={() => setValue("category", cat)}
                    >
                      {categoryLabels[cat]}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  placeholder="Share details about the event, food spot, match, or anything interesting..."
                  rows={6}
                  {...register("content")}
                />
                {errors.content && (
                  <p className="text-xs text-red-500">
                    {errors.content.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end">
                <Button
                  type="button"
                  onClick={handleStep1Next}
                  disabled={!watchedTitle || !watchedContent}
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Image (Required) */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Add Image
                <span className="text-xs text-red-500 font-normal">
                  *required
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              {!imagePreview ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-colors"
                >
                  <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                  <p className="text-sm font-medium">
                    Click to upload an image
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    JPG, PNG, GIF, WebP — max 10MB
                  </p>
                </div>
              ) : (
                <div className="relative rounded-lg overflow-hidden border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-56 object-cover"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      className="h-8 shadow"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Change
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      className="h-8 shadow"
                      onClick={removeImage}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  {imageFile && (
                    <div className="p-2 bg-muted/80 text-xs text-muted-foreground">
                      {imageFile.name} ({(imageFile.size / 1024).toFixed(0)} KB)
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={!imagePreview}
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Location */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-red-500" />
                Add Location (Optional)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2" ref={dropdownRef}>
                <Label>Search Location</Label>
                <div className="relative">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Type to search... e.g. Racecourse, Atal Sarovar"
                      value={locationQuery}
                      onChange={(e) => {
                        setLocationQuery(e.target.value);
                        if (!e.target.value) clearLocation();
                      }}
                      onFocus={() =>
                        locationResults.length > 0 && setShowDropdown(true)
                      }
                      className="pl-9"
                    />
                    {searchingLocation && (
                      <Loader2 className="absolute right-2.5 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
                    )}
                  </div>

                  {showDropdown && (
                    <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-lg max-h-60 overflow-auto">
                      {locationResults.map((r, i) => (
                        <button
                          key={`${r.lat}-${r.lng}-${i}`}
                          type="button"
                          className="flex items-start gap-2 w-full px-3 py-2 text-left text-sm hover:bg-accent transition-colors"
                          onClick={() => handleSelectLocation(r)}
                        >
                          <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-red-500" />
                          <div>
                            <p className="font-medium">{r.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {r.displayName}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {(lat || locationName) && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={clearLocation}
                    className="mt-1"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear Location
                  </Button>
                )}
              </div>

              <p className="text-xs text-muted-foreground">
                Start typing to find locations in Rajkot, or click on the map to
                drop a pin.
              </p>

              <MapPicker
                initialLat={lat || undefined}
                initialLng={lng || undefined}
                onLocationChange={handleLocationChange}
              />

              {lat && lng && (
                <p className="text-xs text-muted-foreground">
                  📍 Coordinates: {lat.toFixed(4)}, {lng.toFixed(4)}
                </p>
              )}

              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(2)}
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
                <Button type="button" onClick={() => setStep(4)}>
                  Next
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Preview & Submit */}
        {step === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>Preview & Submit</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-lg p-4 space-y-3">
                {watchedCategory && (
                  <Badge
                    variant="outline"
                    className={categoryColors[watchedCategory as PostCategory]}
                  >
                    {categoryLabels[watchedCategory as PostCategory]}
                  </Badge>
                )}
                <h2 className="text-xl font-bold">{watchedTitle}</h2>
                {imagePreview && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded"
                  />
                )}
                <p className="text-sm whitespace-pre-wrap">{watchedContent}</p>
                {locationName && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 text-red-500" />
                    {locationName}
                    {locationAddress && ` — ${locationAddress}`}
                  </div>
                )}
              </div>

              {submitError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                  {submitError}
                </div>
              )}

              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(3)}
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-1" />
                  ) : (
                    <Check className="h-4 w-4 mr-1" />
                  )}
                  Publish Post
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </form>
    </div>
  );
}
