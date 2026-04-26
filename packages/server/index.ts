import { app } from "./app";
import { env } from "./config/env";

const server = app.listen(env.PORT, () => {
  console.log(`Server listening on http://localhost:${env.PORT}`);
});

const shutdown = (signal: string) => {
  console.log(`${signal} received. Shutting down server.`);

  server.close((error) => {
    if (error) {
      console.error("Error while shutting down server.", error);
      process.exit(1);
    }

    process.exit(0);
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
