import { Hono } from "hono";
import { registerHandler } from "../controllers/register.js";
import { loginHandler } from "../controllers/login.js";
import { validateRegister } from "#middlewares/register";

const app = new Hono();

app.post("/register", validateRegister, ...registerHandler);
app.post("/login", ...loginHandler);

export default app;
