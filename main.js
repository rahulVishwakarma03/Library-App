import {connectToServer, handleUserRequest} from "./src/agent.js"

const HOSTNAME = "127.0.0.1";
const PORT = 8000;

const REQUESTS = {
  register : {
    command: "registerCustomer",
    data: {name: "abc", email: "abc@gmail.com", password: "1234" },
  },
  login : {
    command: "loginCustomer",
    data: { email: "abc@gmail.com", password: "1234" },
  },
  invalidLoginDetails : {
    command: "loginCustomer",
    data: { email: "abc12@gmail.com", password: "1234" },
  }
}

const main = async (hostname, port) => {
  const conn = await connectToServer(hostname, port);

const req = REQUESTS.invalidLoginDetails;

  const response = await handleUserRequest(conn, req);
  console.log(response);
};

await main(HOSTNAME, PORT);
