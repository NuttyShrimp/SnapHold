import { verifyRequestOrigin } from "lucia";

import type { User, Session } from "lucia";
import { lucia } from "../util/auth";

export default defineEventHandler(async (event) => {
  if (event.node.req.method !== "GET") {
    const originHeader = getHeader(event, "Origin") ?? null;
    const hostHeader = getHeader(event, "Host") ?? null;
    if (!originHeader || !hostHeader || !verifyRequestOrigin(originHeader, [hostHeader])) {
      return event.node.res.writeHead(403).end();
    }
  }

  const sessionId = getCookie(event, lucia.sessionCookieName) ?? null;
  if (!sessionId) {
    event.context.session = null;
    event.context.user = null;
    deleteCookie(event, lucia.sessionCookieName);
    if (!event.path.startsWith("/login")) {
      return sendRedirect(event, "/login")
    }
    return;
  }

  const { session, user } = await lucia.validateSession(sessionId);
  if (session && session.fresh) {
    appendHeader(event, "Set-Cookie", lucia.createSessionCookie(session.id).serialize());
  }
  if (!session) {
    appendHeader(event, "Set-Cookie", lucia.createBlankSessionCookie().serialize());
  }
  event.context.session = session;
  event.context.user = user;
});

declare module "h3" {
  interface H3EventContext {
    user: User | null;
    session: Session | null;
  }
}
