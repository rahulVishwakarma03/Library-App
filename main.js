import { mock_requests } from "./data/mock_requests.js";
import { connectToServer, handleUserRequest } from "./src/agent.js";

const HOSTNAME = "127.0.0.1";
const PORT = 8000;

const main = async (hostname, port) => {
  const conn = await connectToServer(hostname, port);

  const req = mock_requests.viewBook;

  const response = await handleUserRequest(conn, req);
  console.log(response);
};

await main(HOSTNAME, PORT);
