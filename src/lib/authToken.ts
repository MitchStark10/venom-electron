export const getAuthToken = () => {
  const authToken = localStorage.getItem("AUTH_TOKEN");

  return authToken || null;
};

export const writeAuthToken = (token: string) => {
  localStorage.setItem("AUTH_TOKEN", token);
};
