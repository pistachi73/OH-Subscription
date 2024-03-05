import { Button } from "@/components/ui/button";

export default async function Home() {
  return (
    <main className="flex h-full min-h-[1000px] flex-col items-center justify-center bg-background">
      <div className="flex flex-col items-center space-y-6">
        <h1 className="text- max-w-[600px] text-center text-5xl font-semibold leading-tight">
          The only subscription you really need to boost your English.
        </h1>
        <p className="max-w-[350px] text-center">
          Dive into tailored video lessons, interactive clubs, and personalized
          coaching sessions.
        </p>
        <Button variant="default" size="lg">
          Subscribe for 4,99€
        </Button>
      </div>
    </main>
  );
}
