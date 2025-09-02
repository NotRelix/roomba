import type { userPayloadType } from "@repo/types/user";
import "hono";

declare module "hono" {
  interface ContextVariableMap {
    user: userPayloadType;
  }
}
