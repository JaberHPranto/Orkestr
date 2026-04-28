import { type UIMessage, useChat } from "@ai-sdk/react";
import { ArrowUp, Plus, SparklesIcon } from "@hugeicons/core-free-icons";
import { DefaultChatTransport } from "ai";
import { useState } from "react";
import {
  Conversation,
  ConversationContent,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  type PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Loader } from "@/components/ui/loader";

interface Props {
  workflowId: string;
}

export const ChatPanel = (_props: Props) => {
  const [input, setInput] = useState("");
  const [chatId, setChatId] = useState(() => crypto.randomUUID());

  const { messages, sendMessage, status } = useChat<UIMessage>({
    id: chatId,
    messages: [],
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const isLoading =
    status === "submitted" ||
    (status === "streaming" &&
      Boolean(
        messages
          .at(-1)
          ?.parts.some((part) => part.type === "text" && Boolean(part.text))
      ));

  const handleSubmit = (message: PromptInputMessage) => {
    if (!message.text.trim()) {
      return;
    }

    sendMessage({
      text: message.text,
    });
    setInput("");
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-background">
      {/* Chat Header */}
      <div className="relative bg-linear-to-br from-primary via-primary/90 to-primary/80 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between text-primary-foreground">
          <h5 className="font-bold text-lg">Workflow Preview</h5>
          <Button
            onClick={() => setChatId(crypto.randomUUID())}
            size={"sm"}
            variant={"ghost"}
          >
            New Chat <Icon className="size-3.5" icon={Plus} />
          </Button>
        </div>
      </div>

      {/* Chat Body */}
      <div className="relative flex flex-1 flex-col overflow-hidden">
        {messages.length > 0 ? (
          <Conversation className="flex-1">
            <ConversationContent className="px-4 pt-10">
              {messages.map((message) => (
                <Message from={message.role} key={message.id}>
                  <MessageContent className="text-sm">
                    {message.parts.map((part, index) => {
                      if (part.type === "text") {
                        return (
                          <MessageResponse
                            className="whitespace-pre-wrap"
                            key={`${message.id}-part-${index as number}`}
                          >
                            {part.text}
                          </MessageResponse>
                        );
                      }
                      // Handle other part types (e.g., images, files) as needed
                      return null;
                    })}
                  </MessageContent>
                </Message>
              ))}
              {isLoading && (
                <div className="px-2">
                  <Loader size="md" variant="dots" />
                </div>
              )}
            </ConversationContent>
          </Conversation>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <Empty className="border-0">
              <EmptyHeader>
                <EmptyMedia variant={"icon"}>
                  <Icon className="text-primary" icon={SparklesIcon} />
                </EmptyMedia>

                <EmptyTitle>Preview your workflow</EmptyTitle>

                <EmptyDescription>
                  Write a prompt as if you are interacting with an AI assistant.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </div>
        )}

        <div className="border-t bg-background p-4">
          <PromptInput
            className="rounded-xl! border shadow-sm"
            onSubmit={handleSubmit}
          >
            <PromptInputBody>
              <PromptInputTextarea
                className="pt-3"
                onChange={(e) => setInput(e.target.value)}
                placeholder="Send a message to preview your workflow..."
                value={input}
              />
            </PromptInputBody>

            <PromptInputFooter className="flex justify-end p-2 pt-0">
              <PromptInputSubmit
                className={
                  "size-9! rounded-xl! bg-primary! p-0! text-primary-foreground!"
                }
                disabled={isLoading || !input.trim()}
              >
                <Icon className="size-4.5" icon={ArrowUp} />
              </PromptInputSubmit>
            </PromptInputFooter>
          </PromptInput>
        </div>
      </div>
    </div>
  );
};
