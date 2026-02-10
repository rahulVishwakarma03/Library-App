import { handleUserRequest } from "./src/agent.js";
import { uiManager } from "./src/ui_manager.js";

const main = async () => {
  await uiManager(handleUserRequest);
};

await main();
