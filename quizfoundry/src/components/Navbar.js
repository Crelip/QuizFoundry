import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { ThemeProvider } from '@emotion/react';

export default function Navbar({theme, startQuizCreation, startSampleQuiz}) {
  const [isSearchClicked, setIsSearchClicked] = useState(false);

  const handleSearchClick = () => {
    setIsSearchClicked(true);
  };

  return (
    <div>
        <ThemeProvider theme={theme}>
        <AppBar position="static">
            <Toolbar sx={{ display: 'flex',
            justifyContent: 'space-between'
            }}>
            {isSearchClicked ? (
                <TextField
                size="tiny"
                placeholder="Search"
                sx={{ mr: 1, display: 'flex', alignItems: 'center' }}
                variant='filled'
                />
            ) : (
                <IconButton
                size="large"
                variant='contained'
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={handleSearchClick}
                >
                <SearchIcon />
                </IconButton>
            )}

            <Typography
                variant="h6"
                component="div"
                sx={{
                display: 'flex',
                justifyContent: 'center',
                flexGrow: 1,
                }}
            >
                QuizFoundry
            </Typography>

            <div>
                <Button onClick={startSampleQuiz} variant='contained' color="inherit" sx={{ display: { xs: 'none', sm: 'block' } }}>
                    Sample quiz
                </Button>
                <Button onClick={startQuizCreation} variant='contained' color="inherit" sx={{ display: { xs: 'none', sm: 'block' } }}>
                    Create a new quiz
                </Button>
                <IconButton
                    variant='contained'
                color="inherit"
                sx={{ display: { xs: 'block', sm: 'none' } }}
                >
                <AddIcon />
                </IconButton>
            </div>
            </Toolbar>
        </AppBar>
        </ThemeProvider>
    </div>
  );
}
