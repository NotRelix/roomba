import { Hono } from "hono";
import { registerHandler } from "#controllers/register";
import { loginHandler } from "#controllers/login";

const app = new Hono()
  .post("/register", ...registerHandler)
  .post("/login", ...loginHandler);

export default app;
