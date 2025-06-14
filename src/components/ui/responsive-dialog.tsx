import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export function ResponsiveDialog({
  open,
  onOpenChange,
  children,
  ...props
}: React.ComponentProps<typeof Dialog> & React.ComponentProps<typeof Drawer>) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange} {...props}>
        {children}
      </Dialog>
    );
  }
  return (
    <Drawer open={open} onOpenChange={onOpenChange} {...props}>
      {children}
    </Drawer>
  );
}

export const ResponsiveDialogContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof DialogContent> &
    React.ComponentProps<typeof DrawerContent>
>(({ className, children, ...props }, ref) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  if (isDesktop) {
    return (
      <DialogContent ref={ref} className={cn(className)} {...props}>
        {children}
      </DialogContent>
    );
  }
  return (
    <DrawerContent ref={ref} className={cn(className)} {...props}>
      {children}
    </DrawerContent>
  );
});
ResponsiveDialogContent.displayName = "ResponsiveDialogContent";

export function ResponsiveDialogHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  if (isDesktop) {
    return (
      <DialogHeader className={cn(className)} {...props}>
        {children}
      </DialogHeader>
    );
  }
  return (
    <DrawerHeader className={cn(className)} {...props}>
      {children}
    </DrawerHeader>
  );
}

export const ResponsiveDialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.ComponentProps<typeof DialogTitle> &
    React.ComponentProps<typeof DrawerTitle>
>(({ className, children, ...props }, ref) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  if (isDesktop) {
    return (
      <DialogTitle ref={ref} className={cn(className)} {...props}>
        {children}
      </DialogTitle>
    );
  }
  return (
    <DrawerTitle ref={ref} className={cn(className)} {...props}>
      {children}
    </DrawerTitle>
  );
});
ResponsiveDialogTitle.displayName = "ResponsiveDialogTitle";

export const ResponsiveDialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentProps<typeof DialogDescription> &
    React.ComponentProps<typeof DrawerDescription>
>(({ className, children, ...props }, ref) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  if (isDesktop) {
    return (
      <DialogDescription ref={ref} className={cn(className)} {...props}>
        {children}
      </DialogDescription>
    );
  }
  return (
    <DrawerDescription ref={ref} className={cn(className)} {...props}>
      {children}
    </DrawerDescription>
  );
});
ResponsiveDialogDescription.displayName = "ResponsiveDialogDescription";

export function ResponsiveDialogFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  if (isDesktop) {
    return (
      <DialogFooter className={cn(className)} {...props}>
        {children}
      </DialogFooter>
    );
  }
  return (
    <DrawerFooter className={cn(className)} {...props}>
      {children}
    </DrawerFooter>
  );
}

export const ResponsiveDialogTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof DialogTrigger> &
    React.ComponentProps<typeof DrawerTrigger>
>(({ className, children, ...props }, ref) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  if (isDesktop) {
    return (
      <DialogTrigger ref={ref} className={cn(className)} {...props}>
        {children}
      </DialogTrigger>
    );
  }
  return (
    <DrawerTrigger ref={ref} className={cn(className)} {...props}>
      {children}
    </DrawerTrigger>
  );
});
ResponsiveDialogTrigger.displayName = "ResponsiveDialogTrigger";
