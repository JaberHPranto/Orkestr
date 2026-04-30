import { type InferRealtimeEvents, Realtime } from "@upstash/realtime";
import type { UIMessageChunk } from "ai";
import z from "zod/v4";
import { redis } from "./redis";

const schema = {
  workflow: {
    chunks: z.any() as z.ZodType<UIMessageChunk>,
  },
};

export const realtime = new Realtime({ schema, redis });
export type RealtimeEvents = InferRealtimeEvents<typeof realtime>;
