import { Hono } from "hono";
import messages from "#routes/messages";
import { beforeEach, describe, expect, it } from "vitest";
import type { createMessageType } from "@repo/types/message";
import { resetDb } from "@repo/helpers/db";

const app = new Hono();
app.route("/messages", messages);

beforeEach(async () => {
  await resetDb();
});

describe.skip("Create message test", () => {
  it("should create a message", async () => {
    const message: createMessageType = {
      message: "this is why we clash",
      authorId: 1,
    };
    const response = await app.request("/messages", {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(message),
    });

    const result = await response.json();

    expect(response.status).toBe(201);
    expect(result.messages[0]).toBe("Successfully created a message");
  });

  it("should create multiple messages", async () => {
    const message1: createMessageType = {
      message: "this is why we clash",
      authorId: 1,
    };
    const message2: createMessageType = {
      message: "for games like that",
      authorId: 2,
    };
    const response1 = await app.request("/messages", {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(message1),
    });
    const response2 = await app.request("/messages", {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(message2),
    });

    const result1 = await response1.json();
    const result2 = await response2.json();

    expect(response1).toBe(201);
    expect(response2).toBe(201);
    expect(result1.message.authorId).toBe(1);
    expect(result2.message.authorId).toBe(2);
  });
});
