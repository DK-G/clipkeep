// @ts-expect-error Generated file has no published types.
import openNextWorker from "../.open-next/worker.js";

type WorkerEnv = {
  NEXT_PUBLIC_SITE_URL?: string;
  CRON_SECRET?: string;
};

const worker = {
  async fetch(request: Request, env: WorkerEnv, ctx: ExecutionContext) {
    return openNextWorker.fetch(request, env, ctx);
  },

  async scheduled(event: ScheduledEvent, env: WorkerEnv, ctx: ExecutionContext) {
    console.log(`[Worker] Scheduled event triggered via cron: ${event.cron}`);

    const protocol = env.NEXT_PUBLIC_SITE_URL ? "https:" : "http:";
    const host = env.NEXT_PUBLIC_SITE_URL ? new URL(env.NEXT_PUBLIC_SITE_URL).host : "localhost";
    const secret = env.CRON_SECRET || "";

    const url = new URL(`${protocol}//${host}/api/admin/auto-trend?secret=${secret}`);
    const req = new Request(url.toString(), {
      method: "GET",
      headers: {
        "User-Agent": "Cloudflare-Workers-Scheduled-Event",
      },
    });

    const promise = openNextWorker.fetch(req, env, ctx)
      .then(async (res: Response) => {
        if (!res.ok) {
          const text = await res.text();
          console.error(`[Worker] Auto-trend API failed with status ${res.status}: ${text}`);
        } else {
          console.log("[Worker] Auto-trend API completed successfully.");
        }
      })
      .catch((e: unknown) => {
        console.error("[Worker] Exception calling auto-trend API:", e);
      });

    ctx.waitUntil(promise);
  },
};

export default worker;