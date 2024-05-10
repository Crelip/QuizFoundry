import { Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

export default function UserHistory({ userID, username }) {
  useEffect(() => {
    //Fetching user history from API.
    return;
  });

  return (
    <div>
      <Typography variant="h2">{username + "'s history"}</Typography>
    </div>
  );
}
