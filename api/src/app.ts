import cors from "cors";
import { fromNodeHeaders, toNodeHandler } from "better-auth/node";
import { sql } from "drizzle-orm";
import express from "express";

import { auth } from "./auth.js";
import { db } from "./db/index.js";
import { env, webOrigins } from "./env.js";

export function createApp() {
  const app = express();

  app.set("trust proxy", 1);

  app.use(
    cors({
      origin: webOrigins,
      credentials: true,
    }),
  );

  app.all("/api/auth/*", toNodeHandler(auth));

  app.use(express.json());

  app.get("/api/health", async (_req, res) => {
    await db.execute(sql`select 1`);

    res.status(200).json({
      status: "ok",
      environment: env.NODE_ENV,
      authBaseUrl: env.BETTER_AUTH_URL,
    });
  });

  app.get("/api/session", async (req, res) => {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    res.status(200).json(
      session ?? {
        session: null,
        user: null,
      },
    );
  });

  return app;
}
