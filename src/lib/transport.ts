import { DefaultChatTransport } from "ai";

export const createWorkflowTransport = ({
  workflowId,
}: {
  workflowId: string;
}) =>
  new DefaultChatTransport({
    api: "/api/upstash/trigger",
    prepareSendMessagesRequest: ({ messages }) => ({
      body: {
        messages,
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
