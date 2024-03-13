import { Hero } from "@/components/hero/hero";
import { BookCarousel } from "@/components/ui/carousel/book-carousel";
import { SeriesCarousel } from "@/components/ui/carousel/series-carousel";

export default async function Home() {
  return (
    <main className="h-full">
      <Hero />
      <SeriesCarousel title="Grammar" href="/" />
      <SeriesCarousel title="Vocabulary" href="/" />
      <SeriesCarousel title="News" href="/" />

      <BookCarousel title="Books to read" href="/" />
      <SeriesCarousel title="Learning capsules" href="/" />
    </main>
  );
}
