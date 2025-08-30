import { serve } from "@hono/node-server";
import { Hono } from "hono";
import auth from "./routes/auth.js";
import type { JwtVariables } from "hono/jwt";

type Variables = JwtVariables;

const app = new Hono<{ Variables: Variables }>();

app.route("/auth", auth);

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
