import { FarcasterSearch } from "@/components/farcaster-search";

export default function Home() {
  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Farcaster Search</h1>
      <p className="text-center text-muted-foreground mb-8">
        Search for casts on Farcaster using the Neynar API
      </p>
      <FarcasterSearch />
    </main>
  );
}
