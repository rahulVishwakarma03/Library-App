export const createResponse = (status, body) => {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json",
    },
  });
};

export const createRequest = ({ url, method, body }) => {
  return new Request(url, {
    method,
    body: JSON.stringify(body),
    headers: {
      "content-type": "application/json",
    },
  });
};
