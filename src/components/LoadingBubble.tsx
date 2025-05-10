import React from "react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

const LoadingBubble: React.FC = () => {
  return (
    <div className="flex w-full gap-3 py-4">
      <Avatar className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 text-white">
        <span className="text-xs">AI</span>
      </Avatar>
      
      <Card className="max-w-[80%] rounded-2xl bg-muted px-4 py-3">
        <div className="flex min-h-[1.5em] items-center space-x-2">
          <div className="h-2.5 w-2.5 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]"></div>
          <div className="h-2.5 w-2.5 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]"></div>
          <div className="h-2.5 w-2.5 animate-bounce rounded-full bg-gray-400"></div>
        </div>
      </Card>
    </div>
  );
};

export default LoadingBubble; 