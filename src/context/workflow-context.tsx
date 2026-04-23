import { createContext, useContext, useState } from "react";

export type WorkflowView = "edit" | "preview";

export interface WorkflowContextType {
  setView: (view: WorkflowView) => void;
  view: WorkflowView;
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(
  undefined
);

export function WorkflowProvider({ children }: { children: React.ReactNode }) {
  const [view, setView] = useState<WorkflowView>("edit");

  return (
    <WorkflowContext.Provider value={{ view, setView }}>
      {children}
    </WorkflowContext.Provider>
  );
}

export function useWorkflowContext() {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error(
      "useWorkflowContext must be used within a WorkflowProvider"
    );
  }
  return context;
}
