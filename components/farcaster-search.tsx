"use client";

import { useState } from "react";
import { Search, Calendar, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CastResults, FarcasterCastSearch } from "@/components/cast-results";

export function FarcasterSearch() {
  const [query, setQuery] = useState<string>("");
  const [mode, setMode] = useState<string>("literal");
  const [sortType, setSortType] = useState<string>("desc_chron");
  const [limit, setLimit] = useState<string>("25");
  const [priorityMode, setPriorityMode] = useState<boolean>(false);
  const [authorFid, setAuthorFid] = useState<string>("");
  const [viewerFid, setViewerFid] = useState<string>("");
  const [channelId, setChannelId] = useState<string>("");
  const [parentUrl, setParentUrl] = useState<string>("");
  const [dateRange, setDateRange] = useState<{ before?: Date; after?: Date }>(
    {}
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [results, setResults] = useState<FarcasterCastSearch | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query) {
      setError("Please enter a search query");
      return;
    }

    setIsLoading(true);
    setError(null);

    let searchQuery = query;

    // Add date filters to query if selected
    if (dateRange.before) {
      searchQuery += ` before:${format(dateRange.before, "yyyy-MM-dd")}`;
    }
    if (dateRange.after) {
      searchQuery += ` after:${format(dateRange.after, "yyyy-MM-dd")}`;
    }

    // Build URL with query parameters
    const params = new URLSearchParams();
    params.append("q", searchQuery);
    params.append("mode", mode);
    params.append("sort_type", sortType);
    params.append("limit", limit);
    params.append("priority_mode", priorityMode.toString());

    if (authorFid) params.append("author_fid", authorFid);
    if (viewerFid) params.append("viewer_fid", viewerFid);
    if (channelId) params.append("channel_id", channelId);
    if (parentUrl) params.append("parent_url", parentUrl);

    try {
      // Use our internal API route instead of calling Neynar directly
      const response = await fetch(`/api/search?${params.toString()}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch results");
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Search Farcaster</CardTitle>
          <CardDescription>
            Search for casts using keywords and filters
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">Basic Search</TabsTrigger>
              <TabsTrigger value="advanced">Advanced Filters</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="grid flex-1 gap-2">
                  <Label htmlFor="query">Search Query</Label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="query"
                      type="text"
                      placeholder="Enter search terms..."
                      className="pl-8"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="mode">Search Mode</Label>
                  <Select value={mode} onValueChange={setMode}>
                    <SelectTrigger id="mode">
                      <SelectValue placeholder="Select mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="literal">
                        Literal (exact words)
                      </SelectItem>
                      <SelectItem value="semantic">
                        Semantic (meaning)
                      </SelectItem>
                      <SelectItem value="hybrid">Hybrid (both)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="sort">Sort By</Label>
                  <Select value={sortType} onValueChange={setSortType}>
                    <SelectTrigger id="sort">
                      <SelectValue placeholder="Select sort" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="desc_chron">Newest First</SelectItem>
                      <SelectItem value="algorithmic">
                        Engagement & Time
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="limit">Results Limit</Label>
                  <Select value={limit} onValueChange={setLimit}>
                    <SelectTrigger id="limit">
                      <SelectValue placeholder="Select limit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 results</SelectItem>
                      <SelectItem value="25">25 results</SelectItem>
                      <SelectItem value="50">50 results</SelectItem>
                      <SelectItem value="100">100 results</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2 pt-8">
                  <Switch
                    id="priority-mode"
                    checked={priorityMode}
                    onCheckedChange={setPriorityMode}
                  />
                  <Label htmlFor="priority-mode">Priority Mode</Label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label className="flex items-center gap-1">
                    Before Date
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-5 w-5"
                        >
                          <Calendar className="h-3 w-3" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent
                          mode="single"
                          selected={dateRange.before}
                          onSelect={(date) =>
                            setDateRange({
                              ...dateRange,
                              before: date || undefined,
                            })
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={
                        dateRange.before
                          ? format(dateRange.before, "yyyy-MM-dd")
                          : ""
                      }
                      readOnly
                      placeholder="Select date..."
                    />
                    {dateRange.before && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          setDateRange({ ...dateRange, before: undefined })
                        }
                      >
                        ×
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label className="flex items-center gap-1">
                    After Date
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-5 w-5"
                        >
                          <Calendar className="h-3 w-3" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent
                          mode="single"
                          selected={dateRange.after}
                          onSelect={(date) =>
                            setDateRange({
                              ...dateRange,
                              after: date || undefined,
                            })
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={
                        dateRange.after
                          ? format(dateRange.after, "yyyy-MM-dd")
                          : ""
                      }
                      readOnly
                      placeholder="Select date..."
                    />
                    {dateRange.after && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          setDateRange({ ...dateRange, after: undefined })
                        }
                      >
                        ×
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="author-fid">Author FID</Label>
                  <Input
                    id="author-fid"
                    type="text"
                    placeholder="Author FID (optional)"
                    value={authorFid}
                    onChange={(e) => setAuthorFid(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="viewer-fid">Viewer FID</Label>
                  <Input
                    id="viewer-fid"
                    type="text"
                    placeholder="Viewer FID (optional)"
                    value={viewerFid}
                    onChange={(e) => setViewerFid(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="channel-id">Channel ID</Label>
                  <Input
                    id="channel-id"
                    type="text"
                    placeholder="Channel ID (optional)"
                    value={channelId}
                    onChange={(e) => setChannelId(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="parent-url">Parent URL</Label>
                  <Input
                    id="parent-url"
                    type="text"
                    placeholder="Parent URL (optional)"
                    value={parentUrl}
                    onChange={(e) => setParentUrl(e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => {
              setQuery("");
              setDateRange({});
              setAuthorFid("");
              setViewerFid("");
              setChannelId("");
              setParentUrl("");
              setMode("literal");
              setSortType("desc_chron");
              setLimit("25");
              setPriorityMode(false);
            }}
          >
            Reset
          </Button>
          <Button onClick={handleSearch} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Search
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {error && (
        <div className="mt-4 p-4 bg-destructive/10 text-destructive rounded-md">
          {error}
        </div>
      )}

      {results && <CastResults results={results} />}
    </div>
  );
}
