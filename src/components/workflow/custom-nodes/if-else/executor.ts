import type { Node } from "@xyflow/react";
import { Parser } from "expr-eval";
import { replaceVariables } from "@/lib/helper";
import type { ExecutorContextType } from "@/types/workflow";

interface Props {
  context: ExecutorContextType;
  node: Node;
}

interface Condition {
  caseName: "";
  operator: "";
  value: "";
  variable: "";
}

export function ifElseNodeExecutor({ node, context }: Props) {
  const { outputs } = context;

  const conditions: Condition[] = (node.data?.conditions as Condition[]) || [];

  if (!Array.isArray(conditions) || conditions.length === 0) {
    throw new Error("No conditions defined for If-Else node");
  }

  for (let index = 0; index < conditions.length; index++) {
    const condition = conditions[index];
    if (!(condition.variable && condition.operator && condition.value)) {
      continue; // Skip incomplete conditions
    }

    const variable = replaceVariables(condition.variable, outputs);
    const value = condition.value;

    const variableExpr = needsQuoting(variable)
      ? JSON.stringify(variable)
      : variable;
    const valueExpr = needsQuoting(value) ? JSON.stringify(value) : value;

    const expression = `${variableExpr} ${condition.operator} ${valueExpr}`;

    try {
      const parser = new Parser();
      const result = parser.evaluate(expression);
      if (result) {
        return {
          output: {
            result: true,
            selectedBranch: `condition-${index}`,
          },
        };
      }
    } catch (error) {
      console.error("Error evaluating condition expression:", error);
      throw new Error(
        `Failed to evaluate condition: ${condition.caseName || "Unnamed Case"}`
      );
    }
  }

  return {
    output: {
      result: false,
      selectedBranch: "else",
    },
  };
}

function needsQuoting(val: string) {
  // Checks if val does not already start and end with a quote
  return (
    Number.isNaN(Number(val)) && !(val.startsWith('"') && val.endsWith('"'))
  );
}
