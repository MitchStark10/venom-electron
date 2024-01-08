export const getAuthToken = () => {
  const authToken = localStorage.getItem("AUTH_TOKEN");

  return authToken || null;
};
