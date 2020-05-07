import http from "./httpService";

export async function login(email, password) {
  const result = await http.post("/loginsystemapi/users.php", {
    action: "login",
    email,
    password,
  });

  return result;
}

export function logout() {
  return localStorage.removeItem("isLoggedIn");
}

export function isLoggedIn() {
  return localStorage.getItem("isLoggedIn");
}

export default {
  login,
  logout,
  isLoggedIn,
};
