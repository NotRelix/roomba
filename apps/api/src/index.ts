import { serve } from "@hono/node-server";
import { Hono } from "hono";
import type { JwtVariables } from "hono/jwt";
import auth from "#routes/auth";
import messages from "#routes/messages";

type Variables = JwtVariables;

const app = new Hono<{ Variables: Variables }>();

app.route("/auth", auth);
app.route("/messages", messages);

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
