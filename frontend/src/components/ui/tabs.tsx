"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/lib/utils";
import { useBreakpoint } from "@/lib/use-breakpoint";
import IconViewer from "@/components/ui/IconViewer";
import { Popover, PopoverTrigger, PopoverContent } from "./popover";

const Tabs = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>
>(({ ...props }, ref) => {
  return (
    <TabsPrimitive.Root ref={ref} {...props} />
  );
});
Tabs.displayName = "Tabs";

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & {
    onTriggerCountChange?: (count: number) => void;
  }
>(({ className, onTriggerCountChange, children, ...props }, ref) => {
  const breakpoint = useBreakpoint();
  const [open, setOpen] = React.useState(false);

  const triggerCount = React.useMemo(() => {
    let count = 0;
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child)) {
        const componentName = (child.type as any)?.displayName || (child.type as any)?.name;
        if (componentName === "TabsTrigger" || componentName === "Trigger") {
          count++;
        }
      }
    });
    return count;
  }, [children]);

  const sliceCount = React.useMemo(() => {
    switch (breakpoint) {
      case "lg":
        return 4;
      case "md":
        return 4;
      case "sm":
        return 2;
      default:
        return 2;
    }
  }, [breakpoint, triggerCount]);

  React.useEffect(() => {
    if (onTriggerCountChange) {
      onTriggerCountChange(triggerCount);
    }
  }, [triggerCount, onTriggerCountChange]);

  const hasHiddenItems = sliceCount < triggerCount;
  const visibleChildren = React.Children.toArray(children).slice(0, sliceCount);
  const hiddenChildren = React.Children.toArray(children).slice(sliceCount);

  return (
    <TabsPrimitive.List
      ref={ref}
      className={cn(
        "flex items-center w-full bg-background border-b border-muted",
        className
      )}
      {...props}
    >
      <div className={cn(
        `flex-1 rounded-lg text-foreground grid grid-cols-${sliceCount}`,
      )}>
        {visibleChildren.map((child, index) => (
          <React.Fragment key={index}>
            {child}
          </React.Fragment>
        ))}
      </div>
      {hasHiddenItems && (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild style={{ height: "36px" }} className="cursor-pointer hover:bg-muted">
            <div onClick={() => setOpen(!open)} className="inline-flex items-center justify-center bg-background px-3 font-medium ring-offset-background transition-all relative">
              <div className={cn(`absolute top-3 right-1 text-caption bg-primary text-primary-foreground rounded-full h-4 w-4 pr-[1px] flex items-center justify-center top-2 right-1`)}>{triggerCount - sliceCount}</div>
              <IconViewer iconName={open ? "chevron-up" : "chevron-down"} />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 offset-y-4" align="end" sideOffset={15}>
            <div className="flex flex-col">
              {hiddenChildren.map((child, index) => (
                <React.Fragment key={sliceCount + index}>
                  {child}
                </React.Fragment>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      )
      }
    </TabsPrimitive.List >
  );
});
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => {
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        "inline-flex h-9 md:h-11 items-center data-[state=active]:text-primary-foreground text-caption py-2 justify-center bg-background px-3 font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-primary-foreground data-[state=active]:shadow data-[state=active]:border-primary data-[state=active]:bg-primary hover:bg-muted",
        className
      )}
      {...props}
    />
  );
});
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => {
  return (
    <TabsPrimitive.Content
      ref={ref}
      className={cn(
        "ring-offset-background h-9 md:h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      {...props}
    />
  );
});
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
