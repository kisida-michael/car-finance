import { APIError } from "better-auth";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { auth } from "../auth.js";
import { db, pool } from "../db/index.js";
import { staffRoles } from "../db/schema/business.js";
import { user } from "../db/schema/auth.js";

const bootstrapSchema = z.object({
  BOOTSTRAP_ADMIN_NAME: z.string().min(1),
  BOOTSTRAP_ADMIN_EMAIL: z.string().email(),
  BOOTSTRAP_ADMIN_PASSWORD: z.string().min(8),
  BOOTSTRAP_ADMIN_ROLE: z.enum(["owner", "admin", "manager", "agent"]).default("owner"),
});

async function main() {
  const config = bootstrapSchema.parse(process.env);

  const existingUser = await db.query.user.findFirst({
    where: eq(user.email, config.BOOTSTRAP_ADMIN_EMAIL),
  });

  let userId = existingUser?.id;

  if (!existingUser) {
    try {
      await auth.api.signUpEmail({
        body: {
          name: config.BOOTSTRAP_ADMIN_NAME,
          email: config.BOOTSTRAP_ADMIN_EMAIL,
          password: config.BOOTSTRAP_ADMIN_PASSWORD,
        },
      });
    } catch (error) {
      if (!(error instanceof APIError)) {
        throw error;
      }

      if (error.status !== 409) {
        throw error;
      }
    }

    const createdUser = await db.query.user.findFirst({
      where: eq(user.email, config.BOOTSTRAP_ADMIN_EMAIL),
    });

    if (!createdUser) {
      throw new Error("Bootstrap admin user was not found after sign up.");
    }

    userId = createdUser.id;
    console.log(`Created Better Auth user ${createdUser.email}`);
  } else {
    console.log(`Using existing Better Auth user ${existingUser.email}`);
  }

  if (!userId) {
    throw new Error("Bootstrap admin user ID could not be resolved.");
  }

  const existingRole = await db.query.staffRoles.findFirst({
    where: and(
      eq(staffRoles.userId, userId),
      eq(staffRoles.role, config.BOOTSTRAP_ADMIN_ROLE),
    ),
  });

  if (!existingRole) {
    await db.insert(staffRoles).values({
      userId,
      role: config.BOOTSTRAP_ADMIN_ROLE,
    });

    console.log(`Assigned role ${config.BOOTSTRAP_ADMIN_ROLE} to ${config.BOOTSTRAP_ADMIN_EMAIL}`);
  } else {
    console.log(
      `Role ${config.BOOTSTRAP_ADMIN_ROLE} already assigned to ${config.BOOTSTRAP_ADMIN_EMAIL}`,
    );
  }
}

main()
  .catch((error) => {
    console.error("Failed to bootstrap admin user", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
