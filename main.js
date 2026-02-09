import { handleUserRequest } from "./src/agent.js";
import { uiManager } from "./src/user_interface.js";

const main = async () => {
  await uiManager(handleUserRequest);
};

await main();
