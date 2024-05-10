import React, { useContext, useEffect, useState } from "react";
import AuthContext from "./context/AuthContext";
import StartQuizCreation from "./StartQuizCreation";
import { Grid, TextField, Button, Typography } from "@mui/material";

export default function Login({
  setHeader,
  currentUser,
  setCurrentUser,
  setCurrentView,
  setCurrentUsername,
}) {
  const { user, loginUser } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [registeringUser, setRegisteringUser] = useState(false);
  const [registationStatus, setRegistrationStatus] = useState("");

  //Authentication
  const handleLogin = (e) => {
    e.preventDefault();
    if (loginUser(username, password, setCurrentUser)) {
      setHeader("QuizFoundry");
      setCurrentView("welcomeScreen");
      setCurrentUsername(username);
    }
  };

  //Registation
  const handleRegistatrion = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL + "register/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: username, password: password }),
        }
      );
      if (response.ok) {
        let data = await response.json();
        window.location.reload();
      } else {
        setRegistrationStatus("Failed to register user.");
      }
    } catch (error) {
      setRegistrationStatus("Failed to register user.");
    }
  };

  const registerUser = () => {
    setRegisteringUser(true);
  };

  useEffect(() => {
    if (!user) setHeader("Login");
  });

  return (
    <div>
      {user ? (
        <div>
          <StartQuizCreation userID={currentUser} setHeader={setHeader} />
        </div>
      ) : registeringUser ? (
        <div>
          <form onSubmit={handleRegistatrion}>
            <Grid container direction="column" spacing={2}>
              <Grid item>
                <TextField
                  type="text"
                  label="Username"
                  variant="outlined"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Grid>
              <Grid item>
                <TextField
                  type="password"
                  label="Password"
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Grid>
              <Grid item>
                <Button type="submit" variant="contained" color="primary">
                  Register
                </Button>
              </Grid>
            </Grid>
          </form>
          <Typography>{registationStatus}</Typography>
        </div>
      ) : (
        <div>
          <form onSubmit={handleLogin}>
            <Grid container direction="column" spacing={2}>
              <Grid item>
                <TextField
                  type="text"
                  label="Username"
                  variant="outlined"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Grid>
              <Grid item>
                <TextField
                  type="password"
                  label="Password"
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Grid>
              <Grid item>
                <Button type="submit" variant="contained" color="primary">
                  Login
                </Button>
              </Grid>
              <Grid item>
                <Button variant="contained" onClick={registerUser}>
                  Register
                </Button>
              </Grid>
            </Grid>
          </form>
        </div>
      )}
    </div>
  );
}
