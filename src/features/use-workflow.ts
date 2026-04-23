import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

const WORKFLOWS_KEY = ["workflows"] as const;

export const UseCreateWorkflow = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { name: string; description?: string }) => {
      const response = await axios.post("/api/workflow", payload);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Workflow created successfully");
      queryClient.invalidateQueries({ queryKey: WORKFLOWS_KEY });
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
    queryKey: WORKFLOWS_KEY,
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
    retry: 1,
  });
