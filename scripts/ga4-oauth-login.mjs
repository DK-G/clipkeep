import crypto from "node:crypto";
import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const SECRETS_DIR = path.join(ROOT, ".secrets");
const CLIENT_PATH = path.join(SECRETS_DIR, "ga4-oauth-client.json");
const TOKEN_PATH = path.join(SECRETS_DIR, "ga4-oauth-token.json");
const AUTH_URL_PATH = path.join(SECRETS_DIR, "ga4-oauth-login-url.txt");
const REDIRECT_HOST = "127.0.0.1";
const REDIRECT_PATH = "/oauth2callback";
const SCOPES = [
  "https://www.googleapis.com/auth/analytics.readonly",
  "https://www.googleapis.com/auth/webmasters.readonly",
];

function getClientConfig(raw) {
  const parsed = JSON.parse(raw);
  const config = parsed.installed || parsed.web;
  if (!config?.client_id || !config?.client_secret) {
    throw new Error("OAuth client JSON must contain installed.client_id and installed.client_secret.");
  }
  return config;
}

async function openBrowser(url) {
  const command = `Start-Process "${url}"`;
  const { spawn } = await import("node:child_process");
  return new Promise((resolve, reject) => {
    const child = spawn("powershell.exe", ["-NoProfile", "-Command", command], {
      stdio: "ignore",
      detached: true,
    });
    child.on("error", reject);
    child.on("exit", resolve);
  });
}

function createCodeListener(expectedState) {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      try {
        const address = server.address();
        const port = typeof address === "object" && address ? address.port : 0;
        const redirectUri = `http://${REDIRECT_HOST}:${port}${REDIRECT_PATH}`;
        const url = new URL(req.url || "/", redirectUri);
        if (url.pathname !== REDIRECT_PATH) {
          res.writeHead(404);
          res.end("Not found");
          return;
        }

        const error = url.searchParams.get("error");
        if (error) {
          throw new Error(`OAuth error: ${error}`);
        }

        const state = url.searchParams.get("state");
        if (state !== expectedState) {
          throw new Error("OAuth state mismatch.");
        }

        const code = url.searchParams.get("code");
        if (!code) {
          throw new Error("OAuth callback did not include a code.");
        }

        res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
        res.end("<h1>ClipKeep Google analytics login complete</h1><p>You can close this tab.</p>");
        server.close();
        server.emit("clipkeep-code", code);
      } catch (error) {
        res.writeHead(400, { "content-type": "text/plain; charset=utf-8" });
        res.end(error.message);
        server.close();
        server.emit("clipkeep-error", error);
      }
    });

    server.on("error", reject);
    server.listen(0, REDIRECT_HOST, () => {
      const address = server.address();
      const port = typeof address === "object" && address ? address.port : 0;
      resolve({
        redirectUri: `http://${REDIRECT_HOST}:${port}${REDIRECT_PATH}`,
        codePromise: new Promise((resolveCode, rejectCode) => {
          server.once("clipkeep-code", resolveCode);
          server.once("clipkeep-error", rejectCode);
        }),
      });
    });
  });
}

async function exchangeCode({ clientId, clientSecret, code, redirectUri }) {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
    }),
  });

  if (!response.ok) {
    throw new Error(`Token exchange failed: ${response.status} ${await response.text()}`);
  }

  return response.json();
}

async function main() {
  const client = getClientConfig(await fs.readFile(CLIENT_PATH, "utf8"));
  const state = crypto.randomBytes(16).toString("hex");
  const { redirectUri, codePromise } = await createCodeListener(state);
  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.searchParams.set("client_id", client.client_id);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", SCOPES.join(" "));
  authUrl.searchParams.set("access_type", "offline");
  authUrl.searchParams.set("prompt", "consent");
  authUrl.searchParams.set("state", state);

  console.log("Opening Google OAuth consent screen...");
  console.log(authUrl.toString());
  await fs.mkdir(SECRETS_DIR, { recursive: true });
  await fs.writeFile(AUTH_URL_PATH, `${authUrl.toString()}\n`);
  console.log(`If the browser does not open, open ${path.relative(ROOT, AUTH_URL_PATH)} manually.`);

  await openBrowser(authUrl.toString());
  const code = await codePromise;
  const token = await exchangeCode({
    clientId: client.client_id,
    clientSecret: client.client_secret,
    code,
    redirectUri,
  });

  await fs.mkdir(SECRETS_DIR, { recursive: true });
  await fs.writeFile(
    TOKEN_PATH,
    JSON.stringify(
      {
        ...token,
        created_at: new Date().toISOString(),
        client_id: client.client_id,
      },
      null,
      2,
    ),
  );

  console.log(`Saved OAuth token to ${path.relative(ROOT, TOKEN_PATH)}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
