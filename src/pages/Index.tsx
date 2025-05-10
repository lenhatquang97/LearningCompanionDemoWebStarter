import { useEffect, useRef, useState } from "react";
import ChatMessage, { ChatMessageProps } from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import LoadingBubble from "@/components/LoadingBubble";
import ModelSelector, { ModelOption } from "@/components/ModelSelector";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getModels, sendMessage } from "@/services/ollamaService";
import { toast } from "sonner";

const DEFAULT_MODEL = "llama3";

const Index = () => {
  const [messages, setMessages] = useState<ChatMessageProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [models, setModels] = useState<ModelOption[]>([]);
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL);
  const [isConnected, setIsConnected] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Fetch available models on component mount
  useEffect(() => {
    const fetchModels = async () => {
      try {
        setIsLoading(true);
        const availableModels = await getModels();
        
        if (availableModels.length > 0) {
          setModels(availableModels);
          setSelectedModel(availableModels[0].id);
          setIsConnected(true);
        } else {
          toast.error("No models found. Is Ollama running?");
        }
      } catch (error) {
        console.error("Error initializing chat:", error);
        toast.error("Failed to connect to Ollama");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchModels();
  }, []);
  
  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);
  
  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: ChatMessageProps = {
      content,
      role: "user",
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      // Send to Ollama API
      const response = await sendMessage(content, selectedModel, messages);
      
      // Add AI response
      const assistantMessage: ChatMessageProps = {
        content: response,
        role: "assistant",
        isAnimated: true
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error in chat:", error);
      toast.error("Failed to get a response");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleClearChat = () => {
    setMessages([]);
  };
  
  return (
    <div className="px-4 flex min-h-screen flex-col py-4 md:py-8">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Learning Companion Demo</h1>
      </header>
      
      <div className="grid gap-4 md:grid-cols-[1fr_250px]">
        <Card className="flex h-[75vh] flex-col p-4">
          <div className="flex-1 overflow-y-auto pr-2">
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
                <p>No messages yet</p>
                <p className="text-sm">
                  Start chatting with your Ollama model
                </p>
              </div>
            ) : (
              <>
                {messages.map((message, index) => (
                  <ChatMessage
                    key={index}
                    content={message.content}
                    role={message.role}
                    isAnimated={message.isAnimated}
                  />
                ))}
                {isLoading && <LoadingBubble />}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <Separator className="my-4" />
          
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </Card>
        
        <Card className="p-4">
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 text-sm font-medium">Model</h3>
              <ModelSelector
                models={models}
                selectedModel={selectedModel}
                onSelectModel={setSelectedModel}
                isLoading={isLoading}
              />
            </div>
            
            <Separator />
            
            <div>
              <h3 className="mb-2 text-sm font-medium">Status</h3>
              <div className="flex items-center gap-2">
                <div
                  className={`h-2 w-2 rounded-full ${
                    isConnected ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                <span className="text-sm">
                  {isConnected ? "Connected" : "Not connected"}
                </span>
              </div>
            </div>
            
            <Separator />
            
            <Button 
              variant="outline" 
              onClick={handleClearChat}
              disabled={messages.length === 0 || isLoading}
              className="w-full"
            >
              Clear Chat
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;
