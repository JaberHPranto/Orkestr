import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import type { Workflow } from "@/lib/generated/prisma/client";

const WORKFLOWS_KEY = ["workflows"] as const;

const workflowKeys = {
  all: WORKFLOWS_KEY,
  details: (id: string) => [...WORKFLOWS_KEY, id] as const,
};

export const UseCreateWorkflow = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { name: string; description?: string }) => {
      const response = await axios.post("/api/workflow", payload);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Workflow created successfully");
      queryClient.invalidateQueries({ queryKey: workflowKeys.all });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "An error occurred while creating the workflow"
      );
    },
  });
};

export const UseGetWorkflows = () =>
  useQuery({
    queryKey: workflowKeys.all,
    queryFn: async () => {
      const response = await axios.get<{
        data: {
          id: string;
          name: string;
          description: string | null;
          createdAt: string;
        }[];
      }>("/api/workflow");
      return response.data.data;
    },
  });

export const UseGetWorkflowById = (id: string) =>
  useQuery({
    queryKey: workflowKeys.details(id),
    queryFn: async () => {
      const response = await axios.get<{ data: Workflow }>(
        `/api/workflow/${id}`
      );
      return response.data.data;
    },
    enabled: !!id,
  });
