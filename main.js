import { mockRequests } from "./data/mock_requests.js";
import { handleUserRequest } from "./src/agent.js";
import { uiManager } from "./src/ui_manager.js";

const main = async () => {
  const res1 = await fetch("http://localhost:8000/addBook", {
    method: "POST",
    body: JSON.stringify(mockRequests.addBook.body),
    headers: {
      "content-type": "application/json",
    },
  });
  const res2 = await fetch("http://localhost:8000/addBook", {
    method: "POST",
    body: JSON.stringify({ title: "book1", author: "abc", total: 1 }),
    headers: {
      "content-type": "application/json",
    },
  });
  console.log(">>>", res1.status, res2.status);
  await uiManager(handleUserRequest);
};

await main();
