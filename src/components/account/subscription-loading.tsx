import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const SubscriptionLoading = () => {
  return (
    <div className="flex flex-col gap-9">
      <div className="space-y-2">
        <h1 className="font-bold tracking-tighter text-4xl">Subscription</h1>
        <p className="text-base text-foreground">Manage your OH Subscription</p>
      </div>
      <Card className="shadow-md relative overflow-hidden">
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-secondary w-full h-1" />
        <CardHeader className="flex flex-row justify-between items-center">
          <Skeleton className="h-5 w-[120px]" />
          <Skeleton className="h-5 w-[140px]" />
        </CardHeader>
        <CardContent className="p-6 pt-0 space-y-6 pb-0">
          <div className="flex flex-row gap-4">
            <div className="relative aspect-video basis-[200px] h-full w-full rounded-md overflow-hidden">
              <Skeleton className="w-full h-full" />
            </div>
            <div className="flex flex-col gap-2">
              <Skeleton className="h-5 w-[160px]" />
              <Skeleton className="h-4 w-[80px]" />
            </div>
          </div>
          <div>
            <div className="border-t border-accent w-full py-2">
              <div className="flex h-14 items-center">
                <Skeleton className="h-5 w-[300px]" />
              </div>
            </div>
            <div className="border-t border-accent w-full py-2">
              <div className="flex h-14 items-center">
                <Skeleton className="h-5 w-[350px]" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* <div className="space-y-2">
        <p className="text-base text-foreground">Payment details</p>
        <Card className="shadow-md p-6 space-y-3">
          <Skeleton className="h-7 w-[140px]" />
          <Skeleton className="h-6 w-[140px]" />
          <Skeleton className="h-5 w-[120px]" />
        </Card>
      </div> */}
    </div>
  );
};
