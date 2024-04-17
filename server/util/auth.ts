import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { Lucia } from "lucia";
import { prisma } from "./db";
import { User } from "@prisma/client";
import { Google } from "arctic";

const adapter = new PrismaAdapter(prisma.session, prisma.user);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: !import.meta.dev
    },
    name: "POV-session"
  },
  getUserAttributes: (attributes) => {
    return {
      name: attributes.name,
      oauthId: attributes.oauthId,
      admin: attributes.admin,
    };
  }
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: Omit<User, "id">;
  }
}

const config = useRuntimeConfig();

export const google = new Google(config.googleClientId, config.googleClientSecret, config.googleRedirectURI);
