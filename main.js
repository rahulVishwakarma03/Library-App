import { agent } from "./src/user_interface/agent.js";
import { uiManager } from "./src/user_interface/ui_manager.js";

const main = async (agent) => {
  await uiManager(agent);
};

await main(agent);
