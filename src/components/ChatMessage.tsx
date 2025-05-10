import React, { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

export type MessageRole = "user" | "assistant";

export interface ChatMessageProps {
  content: string;
  role: MessageRole;
  isAnimated?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ 
  content, 
  role, 
  isAnimated = false
}) => {
  const isUser = role === "user";
  const [displayedText, setDisplayedText] = useState(isUser || !isAnimated ? content : "");
  const [isTyping, setIsTyping] = useState(false);
  const fullTextRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    if (!isAnimated || isUser) {
      setDisplayedText(content);
      return;
    }
    
    // Reset the text and typing state when content changes
    setDisplayedText("");
    setIsTyping(true);
    
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    let index = 0;
    // Start with a small initial delay to ensure clean rendering
    setTimeout(() => {
      intervalRef.current = setInterval(() => {
        if (index < content.length) {
          setDisplayedText(content.slice(0, index + 1));
          index++;
        } else {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          setIsTyping(false);
        }
      }, 5); // Speed of typing effect
    }, 10);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [content, isAnimated, isUser]);
  
  return (
    <div
      className={cn(
        "flex w-full gap-3 py-4",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <Avatar className={cn(
        "flex h-8 w-8 items-center justify-center rounded-full text-white",
        isUser ? "bg-primary" : "bg-purple-600"
      )}>
        <span className="text-xs">
          {isUser ? "You" : "AI"}
        </span>
      </Avatar>
      
      <Card className={cn(
        "max-w-[80%] rounded-2xl px-4 py-3",
        isUser 
          ? "bg-primary text-primary-foreground" 
          : "bg-muted",
        isTyping && "after:ml-1 after:inline-block after:h-4 after:w-0.5 after:animate-blink after:bg-current after:content-['']"
      )}>
        <p className="whitespace-pre-wrap min-h-[1.5em]">{displayedText}</p>
        {/* Hidden element to maintain correct dimensions */}
        {isAnimated && !isUser && (
          <div 
            ref={fullTextRef} 
            className="invisible absolute h-0 w-0 overflow-hidden whitespace-pre-wrap"
          >
            {content}
          </div>
        )}
      </Card>
    </div>
  );
};

export default ChatMessage;
