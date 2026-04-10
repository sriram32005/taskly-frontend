const BASE_URL = "http://localhost:8085";

export const api = async (
  endpoint: string,
  method: string = "GET",
  body?: any
) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  console.log("API Response:", res);
  return res.json();
};
