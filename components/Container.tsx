import { cn } from "@/lib/util";
import React from "react";

interface Props {
  className?: string;
  children: React.ReactNode;
}

const Container = ({ className, children }: Props) => {
  return (
    <div
      className={cn(
        "w-full max-w-screen-xl mx-auto px-2.5 md:px-20",
        className && className
      )}
    >
      {children}
    </div>
  );
};

export default Container;
