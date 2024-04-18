import React, { useContext, useState } from 'react';
import AuthContext from './context/AuthContext';
import QuizCreation from './QuizCreation';

const Login = ({theme}) => {
    const { user, loginUser } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    //Authentication
    const handleLogin = (e) => {
        e.preventDefault();
        loginUser(username, password);
    };

    return (
        <div>
            {user ? (
                <div>
                    <p>Signed in as: {user}</p>
                    <QuizCreation theme={theme}/>
                </div>
            ) : (
                <form onSubmit={handleLogin}>
                    <input 
                        type="text" 
                        name="username" 
                        placeholder="Enter username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input 
                        type="password" 
                        name="password" 
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <input type="submit" value="Login" />
                </form>
            )}
        </div>
    );
};

export default Login;
