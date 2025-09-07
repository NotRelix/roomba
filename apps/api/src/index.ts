import { Hono } from "hono";
import auth from "#routes/auth";
import rooms from "#routes/rooms";

const app = new Hono().route("/auth", auth).route("/rooms", rooms);

export default app;
