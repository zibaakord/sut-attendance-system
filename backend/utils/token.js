const crypto = require("crypto");

const TOKEN_SECRET = process.env.AUTH_SECRET || "sut-attendance-secret";
const DEFAULT_EXPIRES_IN_SEC = 60 * 60 * 12;

const toBase64Url = (value) =>
  Buffer.from(value)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

const fromBase64Url = (value) => {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "===".slice((normalized.length + 3) % 4);
  return Buffer.from(padded, "base64").toString("utf8");
};

const signToken = (payload, expiresInSec = DEFAULT_EXPIRES_IN_SEC) => {
  const now = Math.floor(Date.now() / 1000);
  const tokenPayload = {
    ...payload,
    iat: now,
    exp: now + expiresInSec,
  };

  const encodedPayload = toBase64Url(JSON.stringify(tokenPayload));
  const signature = crypto
    .createHmac("sha256", TOKEN_SECRET)
    .update(encodedPayload)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  return `${encodedPayload}.${signature}`;
};

const verifyToken = (token) => {
  if (!token || typeof token !== "string" || !token.includes(".")) {
    throw new Error("Invalid token");
  }

  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) {
    throw new Error("Invalid token");
  }

  const expectedSignature = crypto
    .createHmac("sha256", TOKEN_SECRET)
    .update(encodedPayload)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  if (signature !== expectedSignature) {
    throw new Error("Invalid token signature");
  }

  const payload = JSON.parse(fromBase64Url(encodedPayload));
  const now = Math.floor(Date.now() / 1000);

  if (!payload.exp || payload.exp <= now) {
    throw new Error("Token expired");
  }

  return payload;
};

module.exports = { signToken, verifyToken };
