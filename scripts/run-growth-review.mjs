import { spawn } from "node:child_process";
import process from "node:process";

function run(scriptPath) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [scriptPath], {
      cwd: process.cwd(),
      stdio: "inherit",
      shell: false,
    });

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${scriptPath} exited with code ${code}`));
    });
  });
}

try {
  await run("scripts/fetch-ga4-report.mjs");
  try {
    await run("scripts/fetch-gsc-report.mjs");
  } catch (error) {
    console.warn(`[growth] Search Console export skipped: ${error.message}`);
    console.warn("[growth] If this is an auth scope issue, re-run npm run analytics:ga4:login and grant Search Console read access.");
  }
  try {
    await run("scripts/fetch-gsc-index-coverage.mjs");
  } catch (error) {
    console.warn(`[growth] Index coverage (URL Inspection) skipped: ${error.message}`);
  }
  await run("scripts/growth-summary.mjs");
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
