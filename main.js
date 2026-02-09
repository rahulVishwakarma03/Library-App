import { mockRequests } from "./data/mock_requests.js";
import { handleUserRequest } from "./src/agent.js";
import { uiManager } from "./src/user_interface.js";

const main = async () => {
  const response = await fetch("http://localhost:8000/customer/register", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      name: "abc",
      email: "abc@gmail.com",
      password: "1234",
    }),
  });
  const data = await response.json();
  console.log(data);
};

await main();
