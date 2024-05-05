import { createContext, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  let [user, setUser] = useState(null);
  let [authTokens, setAuthTokens] = useState(null);

  let loginUser = async (username, password, setUserID) => {
    const response = await fetch(process.env.REACT_APP_API_URL + "token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: username, password: password }),
    });
    let data = await response.json();
    if (data) {
      if (data.detail === "No active account found with the given credentials")
        return false;
      localStorage.setItem("authTokens", JSON.stringify(data));
      setAuthTokens(data);
      let tmp = jwtDecode(data.access);
      setUserID(tmp.user_id);
      setUser(username);
      return true;
    } else {
      alert("Something went wrong during authentication.");
      return false;
    }
  };

  let logoutUser = (e) => {
    e.preventDefault();
  };

  let contextData = {
    user: user,
    authTokens: authTokens,
    loginUser: loginUser,
    logoutUser: logoutUser,
  };
  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};
