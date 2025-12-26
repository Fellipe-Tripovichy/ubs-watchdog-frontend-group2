import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/iconButton";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center gap-4 py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Button variant="default" >
          Click me
        </Button>
        <Button variant="secondary" >
          Click me
        </Button>
        <Button variant="link" >
          Click me
        </Button>
        <IconButton icon="chevron-right" variant="default" size="small" disabled/>
        <IconButton icon="chevron-right" variant="secondary" size="default" disabled/>
        <IconButton icon="chevron-right" variant="destructive" size="large" disabled/>
      </main>
    </div>
  );
}
