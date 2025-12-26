import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/iconButton";
import { LinkButton } from "@/components/ui/linkButton";

export default function Home() {
  return (
    <div className="flex flex-col items-start min-h-screen justify-center">
      <div className="w-full relative">
        <img src="/hero-image-1.jpg" alt="UBS Watchdog" className="h-[400px] w-full object-cover" />
        <div className="absolute top-0 left-0 max-w-[1554px] mx-auto w-full px-8 h-full z-10 flex items-center justify-start">
          <div className="bg-background/80 p-6 z-5 flex items-center justify-center w-full md:w-2/5">
            <h1 className="text-4xl font-bold text-secondary-foreground">UBS Watchdog</h1>
          </div>
        </div>
      </div>
      <main className="flex min-h-screen w-full flex-col items-start gap-4 max-w-[1554px] mx-auto w-full px-8">
        <Button variant="default" >
          Click me
        </Button>
        <Button variant="secondary" >
          Click me
        </Button>
        <Button variant="link" >
          Click me
        </Button>
        <IconButton icon="chevron-right" variant="default" size="small" disabled />
        <IconButton icon="chevron-right" variant="secondary" size="default" disabled />
        <IconButton icon="chevron-right" variant="destructive" size="large" disabled />
        <LinkButton>
          Click me
        </LinkButton>
        <LinkButton size="small">
          Click me
        </LinkButton>
      </main>
    </div>
  );
}
