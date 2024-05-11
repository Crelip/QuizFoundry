import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import React, { useEffect, useState } from "react";

export default function UserHistory({ userID, username }) {
  const [history, setHistory] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [answerData, setAnswerData] = useState([]);

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
          const name = await fetchQuizName(element.quizID);
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

  async function fetchQuizName(quizID) {
    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL + "quiz/" + quizID + "/"
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

  async function fetchQuestionName(questionID) {
    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL + "question/" + questionID + "/"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      return data.questionText;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }

  async function showAnswerDetails(id) {
    //Fetch all answer details
    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL + "answer_question/" + id + "/"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      const updatedData = await Promise.all(
        data.map(async (element) => {
          const name = await fetchQuestionName(element.questionID);
          return { ...element, name };
        })
      );
      setAnswerData(updatedData);
      setIsDialogOpen(true);
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
          <div>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Quiz Name</TableCell>
                    <TableCell align="right">Time Finished</TableCell>
                    <TableCell align="right">Correct Answers</TableCell>
                    <TableCell align="right">Total Questions</TableCell>
                    <TableCell align="right">Success rate</TableCell>
                    <TableCell align="center">Details</TableCell>
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
                      <TableCell align="center">
                        <Button
                          onClick={() => {
                            showAnswerDetails(row.id);
                          }}
                          variant="contained"
                        >
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Dialog
              open={isDialogOpen}
              onClose={() => setIsDialogOpen(false)}
              fullWidth
              maxWidth="xl"
              sx={{ p: 3 }}
            >
              <DialogTitle>Answer data</DialogTitle>
              <DialogContent>
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Question</TableCell>
                        <TableCell align="right">Your Answer</TableCell>
                        <TableCell align="right">Correct</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {answerData.map((row) => (
                        <TableRow
                          key={row.id}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            {row.name}
                          </TableCell>
                          <TableCell align="right">{row.answer}</TableCell>
                          <TableCell align="right">
                            {row.isCorrect ? "Yes" : "No"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
              </DialogActions>
            </Dialog>
          </div>
        ) : (
          <Typography>Loading history...</Typography>
        )}
      </div>
    </div>
  );
}
