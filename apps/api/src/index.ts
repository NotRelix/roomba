import { Hono } from "hono";
import auth from "#routes/auth";
import rooms from "#routes/rooms";

export const app = new Hono();

app.route("/auth", auth);
app.route("/rooms", rooms);
