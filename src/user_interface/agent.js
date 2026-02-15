const URL = "http://localhost:8000";

export const agent = async (path, method, body) => {
  const url = `${URL}${path}`;
  const response = await fetch(url, {
    method,
    body: JSON.stringify(body),
    headers: {
      "content-type": "application/json",
    },
  });

  return response;
};
