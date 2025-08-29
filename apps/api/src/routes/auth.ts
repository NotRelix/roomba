import { Hono } from "hono";
import { registerHandler } from "../controllers/register.js";

const app = new Hono();

app.post("/register", ...registerHandler);

export default app;
