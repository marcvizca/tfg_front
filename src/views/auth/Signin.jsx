import React, { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth.js';
import { postUserAuth } from '../../controllers/services.controller.js';

import { Link, useNavigate, useLocation } from 'react-router-dom';
import Signup from './Signup.jsx';
import { showNotification } from '../../components/showNotification'

import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import LogoMain from '../../assets/LogoMain.jpg'
import '../general.css'

const Signin = () => {
    const { setAuth, persist, setPersist } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/teams";

    const [userData, setUserData] = useState ({
        username:'',
        password:'',
    });
    const [errMsg, setErrMsg] = useState('');


    useEffect(() => {
        setErrMsg('')
    }, [userData.username, userData.password])
    

    const handleChange = (e) => {
        const {name, value} = e.target;
        setUserData({
            ...userData,
            [name]: value,
        })
    }
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await postUserAuth(userData.username, userData.password);
            const accessToken = response.accessToken;
            const userId = response.userId;
            localStorage.setItem ( 'userId', userId);
            setAuth({ userData , userId ,accessToken });
            navigate(from, { replace: true });

        } catch (error) {
            if (!error?.response) {
                showNotification('No Server Response', 'error');
            } else if (error.response?.status === 400) {
                showNotification('Falta algun camp per completar', 'error');
            } else if (error.response?.status === 401 || error.response?.status === 404) {
                showNotification('El email o contrasenya indicats són incorrectes', 'error');
            } else {
                showNotification("L'inici de sessió ha fallat", "error");
            }
        }
    }

    const handleSignUpClick = () => {
        navigate('/Signup');
    }

    const handleForgotPwd = () => {
    }

    const defaultTheme = createTheme();
    return (
        <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                }}
            >
                <img src={LogoMain} alt="Logo" />
                
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                    <TextField
                        required
                        fullWidth
                        id="username"
                        label="Email"
                        name="username"
                        value={userData.username}
                        onChange={handleChange}
                    />
                    </Grid>
                    <Grid item xs={12}>
                    <TextField
                        required
                        fullWidth
                        id="password"
                        label="Contrasenya"
                        name="password"
                        type="password"
                        value={userData.password}
                        onChange={handleChange}
                    />
                    </Grid>
                </Grid>
                <a
                    href='/recoverypwd'
                    onClick={handleForgotPwd}
                    className="forgot_pwd"
                >
                    Has oblidat la contrasenya?
                </a>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    className="app-button"
                >
                    Iniciar Sessió
                </Button>

                <Button
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    className="app-button"
                    onClick={handleSignUpClick}
                >
                    Registra't
                </Button>
                
                </Box>
            </Box>
        </Container>
  </ThemeProvider>
    )
}

export default Signin;