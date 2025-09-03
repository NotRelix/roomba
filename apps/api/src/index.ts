import { serve } from "@hono/node-server";
import { Hono } from "hono";
import auth from "#routes/auth";
import rooms from "#routes/rooms";

const app = new Hono();

app.route("/auth", auth);
app.route("/rooms", rooms);

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
