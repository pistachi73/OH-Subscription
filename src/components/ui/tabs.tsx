"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import * as React from "react";

import { cn } from "@/lib/utils/cn";

type TabsContextProps = {
  selected?: string;
};

const TabsContext = React.createContext<TabsContextProps | null>(null);

export function useTabs() {
  const context = React.useContext(TabsContext);

  if (!context) {
    throw new Error("useTabs must be used within a <Tabs />");
  }

  return context;
}

const Tabs = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>
>(({ className, ...props }, ref) => {
  const [selected, setSelected] = React.useState(props.defaultValue);
  return (
    <TabsContext.Provider value={{ selected }}>
      <TabsPrimitive.Root
        ref={ref}
        className={cn(className)}
        onValueChange={(v) => {
          setSelected(v);
        }}
        {...props}
      />
    </TabsContext.Provider>
  );
});

Tabs.displayName = TabsPrimitive.Root.displayName;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md text-muted-foreground",
      className,
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, children, ...props }, ref) => {
  const { selected } = useTabs();
  return (
    <>
      <TabsPrimitive.Trigger
        ref={ref}
        className={cn(
          "relative  inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium text-muted-foreground ring-offset-background transition-all before:absolute before:top-full before:h-0.5 before:w-0  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-foreground data-[state=active]:before:w-[calc(100%-6px)] data-[state=active]:before:bg-foreground xs:text-base lg:text-base  ",
          "hover:text-foreground/90",
          className,
        )}
        {...props}
      >
        {children}
      </TabsPrimitive.Trigger>
    </>
  );
});
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsContent, TabsList, TabsTrigger };
