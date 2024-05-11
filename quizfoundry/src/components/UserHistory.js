import { Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

export default function UserHistory({ userID, username }) {
  const [history, setHistory] = useState(null);

  async function fetchUserHistory() {
    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL + "user_history/" + userID + "/"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      let data = await response.json();
      const updatedData = await Promise.all(
        data.map(async (element) => {
          const name = await fetchQuizName(element);
          return { ...element, name };
        })
      );

      setHistory(updatedData);
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }

  async function fetchQuizName(quizAnswer) {
    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL + "quiz/" + quizAnswer.quizID + "/"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      return data.quizName;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }

  useEffect(() => {
    //Fetching user history from API.
    if (history === null) fetchUserHistory();
  }, []);

  return (
    <div>
      <Typography variant="h2">{username + "'s history"}</Typography>
      <div>
        {history ? (
          history.map((item, index) => (
            <Typography key={index}>{item.name}</Typography>
          ))
        ) : (
          <Typography>Loading history...</Typography>
        )}
      </div>
    </div>
  );
}
