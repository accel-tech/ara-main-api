import { startupTasks } from "./config/utils/startup";

async function main() {
  console.log("Initializing server...");
  await startupTasks();
  const { app } = await import("./app/app");
  const { PORT } = await import("./config/utils/constants");
  app.listen(PORT);
  console.log(`Server listening on port ${PORT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

//
