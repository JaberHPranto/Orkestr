// /** biome-ignore-all lint/suspicious/noExplicitAny: data    */
// import { useReactFlow } from "@xyflow/react";
// import { useState } from "react";

// interface Props {
//   data: any;
//   id: string;
// }

// const OUTPUT_FORMATS = [
//   { value: "text", label: "Text" },
//   { value: "json", label: "JSON" },
// ];

// export const AgentSettings = ({ id, data }: Props) => {
//   const { updateNodeData } = useReactFlow();

//   const [openModel, setOpenModel] = useState(false);
//   const [openFormat, setOpenFormat] = useState(false);

//   const [agentLabel, setAgentLabel] = useState(data?.label ?? "Agent");
//   const [instructionValue, setinstructionValue] = useState(
//     data?.instructions ?? ""
//   );

//   const model = data?.model;
//   const tools = data?.tools || [];
//   const outputFormat = data?.outputFormat || "text";

//   const responseSchema = data?.responseSchema || {
//     type: "object",
//     title: "response_schema",
//     properties: {},
//   };

//   const handleChange = (key: string, value: any) => {
//     updateNodeData(id, {
//       ...data,
//       [key]: value,
//     });
//   };

//   return <div>Agent Settings</div>;
// };

export const Settings = () => <div>Work In Progress</div>;
