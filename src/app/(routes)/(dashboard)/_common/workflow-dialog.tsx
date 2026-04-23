"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "@hugeicons/core-free-icons";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { UseCreateWorkflow } from "@/features/use-workflow";

const workflowSchema = z.object({
  name: z.string().min(1, "Workflow name is required"),
  description: z.string().optional(),
});

type WorkflowFormData = z.infer<typeof workflowSchema>;

export const WorkflowDialog = () => {
  const [open, setOpen] = useState(false);

  const { mutate: createWorkflow, isPending } = UseCreateWorkflow();

  const form = useForm<WorkflowFormData>({
    resolver: zodResolver(workflowSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = (data: WorkflowFormData) => {
    createWorkflow(data, {
      onSuccess: () => {
        form.reset();
        setOpen(false);
      },
    });
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger render={<Button />}>
        <Icon icon={Plus} size={18} />
        New Workflow
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Workflow</DialogTitle>
          <DialogDescription>
            Start a workflow to automate your tasks and processes.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workflow Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g Customer Support" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workflow Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="This workflow automates customer support ticket handling."
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button
                disabled={isPending}
                onClick={() => setOpen(false)}
                type="button"
                variant="outline"
              >
                Cancel
              </Button>
              <Button disabled={isPending} type="submit">
                {isPending ? (
                  <>
                    <Spinner />
                    <span>Creating...</span>
                  </>
                ) : (
                  "Create Workflow"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
