import { DefaultChatTransport } from "ai";

const MAX_HISTORY_MESSAGES = 12;
// const MAX_TEXT_CHARS = 4000;

// const limitText = (value: string): string =>
//   value.length > MAX_TEXT_CHARS ? value.slice(-MAX_TEXT_CHARS) : value;

// const toTextContent = (message: {
//   parts?: Array<{ type?: string; text?: string; data?: { output?: unknown } }>;
// }): string => {
//   const parts = message.parts ?? [];

//   const textParts = parts
//     .filter((part) => part.type === "text" && typeof part.text === "string")
//     .map((part) => part.text as string)
//     .join("\n");

//   if (textParts.trim().length > 0) {
//     return limitText(textParts);
//   }

//   const workflowText = parts
//     .filter((part) => part.type === "data-workflow-node")
//     .map((part) => {
//       const output = part.data?.output;
//       if (typeof output === "string") {
//         return output;
//       }
//       if (
//         output &&
//         typeof output === "object" &&
//         "text" in output &&
//         typeof (output as { text?: unknown }).text === "string"
//       ) {
//         return (output as { text: string }).text;
//       }
//       return "";
//     })
//     .filter(Boolean)
//     .join("\n");

//   return limitText(workflowText);
// };

const compactMessages = (
  messages: Array<{ id?: string; role: string; parts?: unknown[] }>
) => {
  const recentMessages = messages.slice(-MAX_HISTORY_MESSAGES);

  return recentMessages.map((message) => ({
    id: message.id,
    role: message.role,
    parts: [
      {
        type: "text" as const,
        // text: toTextContent(message as),
        // TODO: WILL FIX IT
        text: "",
      },
    ],
  }));
};

export const createWorkflowTransport = ({
  workflowId,
}: {
  workflowId: string;
}) =>
  new DefaultChatTransport({
    api: "/api/upstash/trigger",
    prepareSendMessagesRequest: ({ messages }) => ({
      body: {
        messages: compactMessages(messages),
        workflowId,
      },
    }),

    prepareReconnectToStreamRequest: (data) => ({
      ...data,
      headers: {
        ...data.headers,
        "x-is-reconnect": "true",
      },
    }),

    fetch: async (input, init) => {
      const triggerResponse = await fetch(input, init);

      if (!triggerResponse.ok) {
        const errorData = await triggerResponse.json().catch(() => null);
        const errorMessage =
          errorData?.error ||
          `Request failed with status ${triggerResponse.status}`;
        throw new Error(errorMessage);
      }

      const data = await triggerResponse.json();
      const workflowRunId = data?.data;

      if (!workflowRunId) {
        throw new Error("Workflow run ID not found in response");
      }

      return fetch(`/api/workflow/chat?id=${workflowRunId}`, {
        method: "GET",
      });
    },
  });
