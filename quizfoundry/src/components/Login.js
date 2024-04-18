import React, { useContext, useState } from "react";
import AuthContext from "./context/AuthContext";
import QuizCreation from "./QuizCreation";
import { Grid, TextField, Button } from "@mui/material";

const Login = () => {
  const { user, loginUser } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  //Authentication
  const handleLogin = (e) => {
    e.preventDefault();
    loginUser(username, password);
  };

  return (
    <div>
      {user ? (
        <div>
          <QuizCreation />
        </div>
      ) : (
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
          </Grid>
        </form>
      )}
    </div>
  );
};

export default Login;
