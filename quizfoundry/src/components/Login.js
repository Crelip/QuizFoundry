import React, { useContext, useState } from "react";
import AuthContext from "./context/AuthContext";
import StartQuizCreation from "./StartQuizCreation";
import { Grid, TextField, Button } from "@mui/material";

const Login = () => {
  const { user, loginUser } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userID, setUserID] = useState(0);

  //Authentication
  const handleLogin = (e) => {
    e.preventDefault();
    loginUser(username, password, setUserID);
  };

  return (
    <div>
      {user ? (
        <div>
          <StartQuizCreation userID={userID} />
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
