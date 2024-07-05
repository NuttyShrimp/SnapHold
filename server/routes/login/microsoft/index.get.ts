import { generateCodeVerifier, generateState } from "arctic";
import { microsoft } from "~/server/util/auth";

export default defineEventHandler(async (event) => {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const url = await microsoft.createAuthorizationURL(state, codeVerifier, {
    scopes: ["profile", "email"]
  });

  setCookie(event, "oauth_state", state, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax"
  });

  setCookie(event, "oauth_code_verifier", codeVerifier, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax"
  });

  return sendRedirect(event, url.toString());
});
