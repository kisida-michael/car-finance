import { and, eq } from "drizzle-orm";
import type { NextFunction, Request, Response } from "express";

import { db } from "./db/index.js";
import { staffRoles, type roleEnum } from "./db/schema/business.js";
import { requireSession } from "./session.js";

export type StaffRole = (typeof roleEnum.enumValues)[number];

export async function getActiveRolesForUserId(userId: string) {
  const roles = await db
    .select({
      role: staffRoles.role,
    })
    .from(staffRoles)
    .where(and(eq(staffRoles.userId, userId), eq(staffRoles.isActive, true)));

  return roles.map((entry) => entry.role);
}

export async function requireRole(
  req: Request,
  res: Response,
  next: NextFunction,
  allowedRoles: StaffRole[],
) {
  await requireSession(req, res, async () => {
    const session = res.locals.session;
    const roles = await getActiveRolesForUserId(session.user.id);

    res.locals.roles = roles;

    if (!roles.some((role) => allowedRoles.includes(role))) {
      res.status(403).json({
        error: "forbidden",
        message: "You do not have access to this resource.",
      });
      return;
    }

    next();
  });
}

export function requireAdminRole(allowedRoles: StaffRole[] = ["owner", "admin"]) {
  return (req: Request, res: Response, next: NextFunction) =>
    requireRole(req, res, next, allowedRoles);
}
