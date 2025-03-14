"use client"

import { useState } from "react"
import { Eye, EyeOff, Key } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ApiKeyInputProps {
  apiKey: string
  setApiKey: (key: string) => void
}

export function ApiKeyInput({ apiKey, setApiKey }: ApiKeyInputProps) {
  const [showApiKey, setShowApiKey] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  const handleSaveKey = () => {
    if (apiKey) {
      setIsSaved(true)
      // In a real app, you might want to store this in localStorage
      // localStorage.setItem('farcaster-api-key', apiKey);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          Neynar API Key
        </CardTitle>
        <CardDescription>Enter your Neynar API key to search Farcaster</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              type={showApiKey ? "text" : "password"}
              placeholder="Enter your Neynar API key"
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value)
                setIsSaved(false)
              }}
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full"
              onClick={() => setShowApiKey(!showApiKey)}
            >
              {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          <Button onClick={handleSaveKey} disabled={!apiKey || isSaved}>
            {isSaved ? "Saved" : "Save"}
          </Button>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Your API key is only stored in your browser and is never sent to our servers.
        </p>
      </CardContent>
    </Card>
  )
}

