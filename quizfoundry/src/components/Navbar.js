import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";

export default function Navbar({
  showLoginScreen,
  fetchSearchResult,
  header,
  currentUser,
  logOut,
  showUserHistory,
  username,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = async () => {
    if (searchQuery.trim() !== "") {
      setLoading(true);
      try {
        const searchResult = await fetchSearchResult(searchQuery);
      } catch (error) {
        console.error("Error fetching search result:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div style={{ paddingBottom: "10px" }}>
      <AppBar position="static">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <TextField
              size="small"
              placeholder="Enter quiz code"
              variant="filled"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <IconButton
              size="small"
              variant="contained"
              color="inherit"
              aria-label="search"
              onClick={handleSearchSubmit}
            >
              <SearchIcon />
            </IconButton>
            {loading && <Typography variant="body2">Loading...</Typography>}
          </div>
          <Typography
            variant="h6"
            component="div"
            sx={{
              display: "flex",
              justifyContent: "center",
              flexGrow: 1,
            }}
          >
            {header}
          </Typography>
          {currentUser === -1 ? (
            <div>
              <Button
                onClick={showLoginScreen}
                variant="contained"
                color="inherit"
                sx={{ display: { xs: "none", sm: "block" } }}
              >
                Log in
              </Button>
              <IconButton
                onClick={showLoginScreen}
                variant="contained"
                color="inherit"
                sx={{ display: { xs: "block", sm: "none" } }}
              >
                <LoginIcon />
              </IconButton>
            </div>
          ) : (
            <div>
              <Button
                onClick={showUserHistory}
                variant="contained"
                color="inherit"
                sx={{ display: { xs: "none", sm: "block" } }}
              >
                {username}
              </Button>

              <Button
                onClick={logOut}
                variant="contained"
                color="inherit"
                sx={{ display: { xs: "none", sm: "block" } }}
              >
                Log out
              </Button>
              <IconButton
                onClick={logOut}
                variant="contained"
                color="inherit"
                sx={{ display: { xs: "block", sm: "none" } }}
              >
                <LogoutIcon />
              </IconButton>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}
