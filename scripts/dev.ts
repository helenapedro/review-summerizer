type ProcessConfig = {
  name: string;
  command: string[];
  cwd: string;
};

const processes: ProcessConfig[] = [
  {
    name: "server",
    command: ["bun", "run", "index.ts"],
    cwd: "packages/server",
  },
  {
    name: "client",
    command: ["bun", "run", "dev"],
    cwd: "packages/client",
  },
];

const children = processes.map((processConfig) => {
  const child = Bun.spawn(processConfig.command, {
    cwd: processConfig.cwd,
    stdout: "pipe",
    stderr: "pipe",
  });

  void pipeOutput(processConfig.name, child.stdout);
  void pipeOutput(processConfig.name, child.stderr);

  return {
    ...processConfig,
    child,
  };
});

const shutdown = () => {
  for (const { child } of children) {
    child.kill();
  }

  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

await Promise.race(
  children.map(async ({ name, child }) => {
    const exitCode = await child.exited;

    for (const { child: otherChild } of children) {
      if (otherChild.pid !== child.pid) {
        otherChild.kill();
      }
    }

    console.error(`[${name}] exited with code ${exitCode}`);
    process.exit(exitCode ?? 1);
  }),
);

async function pipeOutput(name: string, stream: ReadableStream<Uint8Array>) {
  const reader = stream.pipeThrough(new TextDecoderStream()).getReader();

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    for (const line of value.split(/\r?\n/)) {
      if (line.trim()) {
        console.log(`[${name}] ${line}`);
      }
    }
  }
}
