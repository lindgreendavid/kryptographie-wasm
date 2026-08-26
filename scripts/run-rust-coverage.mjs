import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const mode = process.argv[2] ?? "check";
const coverageTargetDirectory = path.join("target", `llvm-cov-${mode}`);
const selectedModeArguments =
    mode === "check"
        ? ["--summary-only", "--fail-under-lines", "85"]
        : mode === "html"
          ? ["--html", "--output-dir", "reports/coverage"]
          : mode === "lcov"
            ? ["--lcov", "--output-path", "reports/coverage/lcov.info"]
            : undefined;

if (!selectedModeArguments) {
    throw new Error(`Unbekannter Coverage-Modus: ${mode}`);
}

const rustc = spawnSync("rustc", ["-vV"], { cwd: projectRoot, encoding: "utf8" });
if (rustc.status !== 0) {
    throw new Error("Die Rust-Hostplattform konnte nicht ermittelt werden.");
}

const host = /^host:\s*(.+)$/m.exec(rustc.stdout)?.[1]?.trim();
const targetArguments = [];
if (host === "aarch64-pc-windows-msvc") {
    const fallbackTarget = "x86_64-pc-windows-msvc";
    console.log(
        `Coverage-Fallback: ${host} besitzt einen LLVM-Profilfehler; Tests laufen über ${fallbackTarget}.`,
    );
    const install = spawnSync("rustup", ["target", "add", fallbackTarget], {
        cwd: projectRoot,
        stdio: "inherit",
    });
    if (install.status !== 0) {
        throw new Error(`Rust-Ziel ${fallbackTarget} konnte nicht installiert werden.`);
    }
    targetArguments.push("--target", fallbackTarget);
}

const result = spawnSync(
    "cargo",
    ["llvm-cov", "--workspace", "--all-features", ...targetArguments, ...selectedModeArguments],
    {
        cwd: projectRoot,
        env: { ...process.env, CARGO_LLVM_COV_TARGET_DIR: coverageTargetDirectory },
        stdio: "inherit",
    },
);

process.exit(result.status ?? 1);
