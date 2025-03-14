"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Repeat2, ExternalLink } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface CastResultsProps {
  results: any
}

export function CastResults({ results }: CastResultsProps) {
  const [expandedCasts, setExpandedCasts] = useState<Set<string>>(new Set())

  const toggleExpand = (hash: string) => {
    const newExpanded = new Set(expandedCasts)
    if (newExpanded.has(hash)) {
      newExpanded.delete(hash)
    } else {
      newExpanded.add(hash)
    }
    setExpandedCasts(newExpanded)
  }

  if (!results?.result?.casts || results.result.casts.length === 0) {
    return (
      <Card className="mt-6">
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">No results found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="mt-6 space-y-6">
      <h2 className="text-2xl font-bold">Search Results</h2>
      <p className="text-muted-foreground">Found {results.result.casts.length} casts</p>

      <div className="space-y-4">
        {results.result.casts.map((cast: any) => (
          <Card key={cast.hash} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage src={cast.author.pfp_url} alt={cast.author.display_name || cast.author.username} />
                    <AvatarFallback>
                      {(cast.author.display_name || cast.author.username || "").substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{cast.author.display_name || cast.author.username}</div>
                    <div className="text-sm text-muted-foreground">@{cast.author.username}</div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(cast.timestamp), { addSuffix: true })}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className={expandedCasts.has(cast.hash) ? "" : "line-clamp-4"}>{cast.text}</p>
              {cast.text.length > 280 && (
                <Button variant="link" className="p-0 h-auto mt-1" onClick={() => toggleExpand(cast.hash)}>
                  {expandedCasts.has(cast.hash) ? "Show less" : "Show more"}
                </Button>
              )}

              {cast.embeds && cast.embeds.length > 0 && (
                <div className="mt-3">
                  {cast.embeds.map((embed: any, index: number) => {
                    if (embed.url) {
                      const metadata = embed.metadata?.html
                      return (
                        <a
                          key={index}
                          href={embed.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block mt-2 border rounded-md p-3 hover:bg-muted/50 transition-colors"
                        >
                          {metadata?.ogImage && metadata.ogImage[0]?.url && (
                            <div className="mb-2 rounded-md overflow-hidden">
                              <img
                                src={metadata.ogImage[0].url || "/placeholder.svg"}
                                alt={metadata.ogTitle || "Embedded content"}
                                className="w-full h-auto object-cover max-h-48"
                              />
                            </div>
                          )}
                          <div className="flex items-center gap-1 text-sm font-medium text-primary">
                            {metadata?.ogTitle || embed.url}
                            <ExternalLink className="h-3 w-3" />
                          </div>
                          {metadata?.ogDescription && (
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{metadata.ogDescription}</p>
                          )}
                        </a>
                      )
                    }
                    return null
                  })}
                </div>
              )}

              {cast.channel && (
                <Badge variant="outline" className="mt-3">
                  {cast.channel.name}
                </Badge>
              )}
            </CardContent>
            <CardFooter className="border-t pt-3 pb-3">
              <div className="flex gap-4 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  <span className="text-sm">{cast.reactions?.likes_count || 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-sm">{cast.replies?.count || 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Repeat2 className="h-4 w-4" />
                  <span className="text-sm">{cast.reactions?.recasts_count || 0}</span>
                </div>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {results.result.next?.cursor && (
        <div className="flex justify-center mt-6">
          <Button variant="outline">Load More</Button>
        </div>
      )}
    </div>
  )
}

