# GDGoC Learning Companion App Demo (Web Version)

## Prerequisites

- NodeJS as for running frontend application
- Ollama for running LLM models. You need to install these models by using this commands:

```bash
ollama pull gemma3:1b
ollama pull qwen3:0.6b
```

## Steps

### Step 1: Run npm install and add Ollama class

```typescript
export interface OllamaRequestBody {
  model: string;
  prompt?: string;
  messages?: {
    role: string;
    content: string;
  }[];
  stream?: boolean;
  options?: Record<string, any>;
}

export interface OllamaResponseMessage {
  model: string;
  created_at: string;
  message: {
    role: string;
    content: string;
  };
}
```

### Step 2: Install react-markdown and remark-gfm and wrap displayedText with Markdown component

```bash
npm install react-markdown remark-gfm
```

```typescript
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

<p className="whitespace-pre-wrap min-h-[1.5em]">{<Markdown remarkPlugins={[remarkGfm]}>{displayedText}</Markdown>}</p>
```

### Step 3: Add sendMessage API

In this API, we need to pass in three parameters: model name, current messages and is message streamed.

```typescript
export const sendMessage = async (
  message: string, 
  model: string,
  previousMessages: ChatMessage[]
): Promise<string> => {
  try {
    // Map our internal messages to Ollama format
    const ollamaMessages = previousMessages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
    
    // Add the new message
    ollamaMessages.push({
      role: "user",
      content: message
    });
    
    const requestBody: OllamaRequestBody = {
      model,
      messages: ollamaMessages,
      stream: false
    };
    
    const response = await fetch(`${OLLAMA_API_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }
    
    const data: OllamaResponseMessage = await response.json();
    return data.message.content;
    
  } catch (error) {
    console.error("Error sending message to Ollama:", error);
    toast.error("Failed to get a response from Ollama");
    return "Sorry, I encountered an error while processing your request.";
  }
};
```

### Step 4: Retrieve list of multiple LLM models

```typescript
export const getModels = async (): Promise<{id: string, name: string}[]> => {
  try {
    const response = await fetch(`${OLLAMA_API_URL}/api/tags`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch models: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Map the returned models to our format
    return data.models?.map((model: any) => ({
      id: model.name,
      name: model.name
    })) || [];
    
  } catch (error) {
    console.error("Error fetching Ollama models:", error);
    toast.error("Failed to connect to Ollama. Is Ollama running?");
    return []; 
  }
};
```

### Step 5: Run it

1.Select Model: The user first selects a model from the model selection screen.

2.Download Model: You need to download the model from Ollama, after that the model will be showed in list.

3.Chat with Model: Once the model is downloaded, the user can interact with it by entering prompts and receiving responses.
