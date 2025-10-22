import { initializeAppDataSource } from "@datasource";
import app from "@/app";

import config from "@config";

async function startServer(): Promise<void> {
  try {
    await Promise.all([initializeAppDataSource()]);
    console.log("All services initialized successfully");

    app.listen(config.port, () => console.log(`App is listening on port: ${config.port}`));
  } catch (error) {
    console.error("Failed to initialize services:", error);
  }
}

startServer();
