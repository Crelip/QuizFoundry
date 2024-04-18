import React, { useState } from 'react';
import {
  Button,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { ThemeProvider } from '@emotion/react';

const QuizCreation = ( {theme, questions, onAddQuestion, onDeleteQuestion }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswers, setNewAnswers] = useState(['']);
  const [newCorrectAnswers, setNewCorrectAnswers] = useState(['']);


  //Creating a new question
  const handleAddQuestion = () => {
    onAddQuestion({
      id: questions.length,
      questionText: newQuestion,
      isChoice: newAnswers.length > 1,
      choiceAnswers: newAnswers,
      correctAnswers: newCorrectAnswers,
      dynamicNext: false,
      nextQuestion: -1,
    });
    setIsDialogOpen(false);
    setNewQuestion('');
    setNewAnswers(['']);
    setNewCorrectAnswers(['']);
  };

  const handleAddAnswer = () => {
    setNewAnswers([...newAnswers, '']);
  };

  const handleRemoveAnswer = (index) => {
    const updatedAnswers = [...newAnswers];
    updatedAnswers.splice(index, 1);
    setNewAnswers(updatedAnswers);
  };

  const handleAnswerChange = (index, event) => {
    const updatedAnswers = [...newAnswers];
    updatedAnswers[index] = event.target.value;
    setNewAnswers(updatedAnswers);
  };

  const handleAddCorrectAnswer = () => {
    setNewCorrectAnswers([...newCorrectAnswers, ''])
  }

  const handleCorrectAnswerChange = (index, event) => {
    const updatedCorrectAnswers = [...newCorrectAnswers];
    updatedCorrectAnswers[index] = event.target.value;
    setNewCorrectAnswers(updatedCorrectAnswers);
  }

  const handleRemoveCorrectAnswer = (index) => {
    const updatedCorrectAnswers = [...newCorrectAnswers];
    updatedCorrectAnswers.splice(index, 1);
    setNewCorrectAnswers(updatedCorrectAnswers);
  };

  const handleRemoveQuestion = (id) => {
    onDeleteQuestion(id);
  };

  return (
    <div>
      <ThemeProvider theme={theme}>
      <Typography variant="h5">Quiz Creation</Typography>
      <List>
        {questions.map((question) => (
          <ListItem key={question.id}>
            <ListItemText primary={question.questionText} />
            <ListItemSecondaryAction>
              <IconButton onClick={() => handleRemoveQuestion(question.id)} edge="end" aria-label="delete">
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => setIsDialogOpen(true)}
      >
        Add Question
      </Button>

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>Add New Question</DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            label="Question Text"
            fullWidth
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
          />
          {newAnswers.map((answer, index) => (
            <div key={index}>
              <TextField
                margin="normal"
                label={`Answer ${index + 1}`}
                fullWidth
                value={answer}
                onChange={(e) => handleAnswerChange(index, e)}
              />
              {index > 0 && (
                <IconButton onClick={() => handleRemoveAnswer(index)}>
                  <DeleteIcon />
                </IconButton>
              )}
            </div>
          ))}
          <Button color="primary" onClick={handleAddAnswer}>
            Add Answer
          </Button>
          <Box sx={{color: 'text.secondary', fontSize: 8}}>Don't add answers if you don't want this to be a choice question</Box>

          {newCorrectAnswers.map((correctAnswer, index) => (
            <div key={index}>
              <TextField
                margin="normal"
                label={`Correct Answer ${index + 1}`}
                fullWidth
                value={correctAnswer}
                onChange={(e) => handleCorrectAnswerChange(index, e)}
              />
              {index > 0 && (
                <IconButton onClick={() => handleRemoveCorrectAnswer(index)}>
                  <DeleteIcon />
                </IconButton>
              )}
            </div>
          ))}
          <Button color="primary" onClick={handleAddCorrectAnswer}>
            Add A Correct Answer
          </Button>

        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddQuestion} color="primary">
            Add Question
          </Button>
        </DialogActions>
      </Dialog>
      </ThemeProvider>
    </div>
  );
};

export default QuizCreation;
