import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
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
      console.log(updatedData);
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
      <Typography sx={{ my: 1 }} variant="h2">
        {username + "'s history"}
      </Typography>
      <div>
        {history ? (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Quiz Name</TableCell>
                  <TableCell align="right">Time Finished</TableCell>
                  <TableCell align="right">Correct Answers</TableCell>
                  <TableCell align="right">Total Questions</TableCell>
                  <TableCell align="right">Success rate</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {history.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell align="right">
                      {new Date(row.timeSubmitted).toLocaleString()}
                    </TableCell>
                    <TableCell align="right">{row.correctAnswers}</TableCell>
                    <TableCell align="right">{row.totalQuestions}</TableCell>
                    <TableCell align="right">
                      {parseFloat(
                        (row.correctAnswers / row.totalQuestions) * 100
                      ).toFixed(2) + "%"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography>Loading history...</Typography>
        )}
      </div>
    </div>
  );
}
