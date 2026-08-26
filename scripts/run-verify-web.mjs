import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const verifier = path.join(projectRoot, "scripts", "verify_web.py");
/** @type {Array<[string, string[]]>} */
const candidates =
    process.platform === "win32"
        ? [
              ["py", ["-3"]],
              ["python", []],
          ]
        : [
              ["python3", []],
              ["python", []],
          ];

for (const [command, prefix] of candidates) {
    const result = spawnSync(command, [...prefix, verifier], {
        cwd: projectRoot,
        encoding: "utf8",
        stdio: "inherit",
    });

    if (!result.error) {
        process.exit(result.status ?? 1);
    }

    const processError = /** @type {NodeJS.ErrnoException} */ (result.error);
    if (processError.code !== "ENOENT") {
        throw result.error;
    }
}

throw new Error("Python 3 wurde für die statische Webprüfung nicht gefunden.");
