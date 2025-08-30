import { Hono } from "hono";
import { registerHandler } from "../controllers/register.js";
import { loginHandler } from "../controllers/login.js";

const app = new Hono();

app.post("/register", ...registerHandler);
app.post("/login", ...loginHandler);

export default app;
