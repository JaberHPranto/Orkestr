import { nanoid } from "nanoid";

export function generateId(type: string) {
  return `${type.toLowerCase()}-${nanoid(8)}`;
}
