import { OAuth2RequestError } from "arctic";
import { generateId } from "lucia";
import { google, lucia } from "~/server/util/auth";
import { prisma } from "~/server/util/db";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const code = query.code?.toString() ?? null;
  const state = query.state?.toString() ?? null;
  const storedState = getCookie(event, "oauth_state") ?? null;
  const storedCodeVerifier = getCookie(event, "oauth_code_verifier") ?? null;
  if (!code || !state || !storedState || !storedCodeVerifier || state !== storedState) {
    throw createError({
      status: 400
    });
  }

  try {
    const tokens = await google.validateAuthorizationCode(code, storedCodeVerifier);
    const googleUserRes = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`
      }
    });
    const user: GoogleUser = await googleUserRes.json();

    const existingOAuthUser = await prisma.oAuthUser.findFirst({
      where: {
        oauthId: String(user.sub),
        oauthProvider: "google"
      }
    })
    if (existingOAuthUser) {
      const session = await lucia.createSession(existingOAuthUser.user_id, {});
      appendHeader(event, "Set-Cookie", lucia.createSessionCookie(session.id).serialize());
      return sendRedirect(event, "/");
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        name: {
          equals: user.name,
          mode: "insensitive"
        }
      }
    });
    if (existingUser) {
      await prisma.oAuthUser.create({
        data: {
          user_id: existingUser.id,
          oauthId: user.sub,
          oauthProvider: "google"
        }
      });
      const session = await lucia.createSession(existingUser.id, {});
      appendHeader(event, "Set-Cookie", lucia.createSessionCookie(session.id).serialize());
      return sendRedirect(event, "/");
    }

    const userId = generateId(15);
    await prisma.user.create({
      data: {
        id: userId,
        name: user.name,
        OAuthUser: {
          create: {
            oauthId: user.sub,
            oauthProvider: "google"
          }
        }
      }
    });
    const session = await lucia.createSession(userId, {});
    appendHeader(event, "Set-Cookie", lucia.createSessionCookie(session.id).serialize());
    return sendRedirect(event, "/");
  } catch (e) {
    if (e instanceof OAuth2RequestError && e.message === "bad_verification_code") {
      // invalid code
      throw createError({
        status: 400
      });
    }
    console.error(e)
    throw createError({
      status: 500
    });
  }
});

interface GoogleUser {
  email: string;
  sub: string;
  name: string;
}
