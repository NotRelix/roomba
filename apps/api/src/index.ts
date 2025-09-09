import { Hono } from "hono";
import auth from "#routes/auth";
import rooms from "#routes/rooms";
import { cors } from "hono/cors";

const app = new Hono();
app.use(cors());

const routes = app.route("/auth", auth).route("/rooms", rooms);

export default app;
export type AppType = typeof routes;
