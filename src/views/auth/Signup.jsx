import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import LogoMain from '../../assets/LogoMain.jpg'
import '../general.css'
import { postNewUser } from "../../controllers/services.controller";
import { showNotification } from "../../components/showNotification";

const Signup = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState ({
    email:'',
    password:'',
    name:'',
    surname:''
  });

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
        const response = await postNewUser(userData.email, userData.password, userData.name, userData.surname);
        navigate("/");
      } catch (error) {
        showNotification("Algo ha anat malament", "error")
      }
    }

    const handleSignInClick = () => {
      navigate("/");
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
                      id="email"
                      label="Email"
                      name="email"
                      type="email"
                      value={userData.email}
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
                  <Grid item xs={12}>
                  <TextField
                      required
                      fullWidth
                      id="name"
                      label="Nom"
                      name="name"
                      value={userData.name}
                      onChange={handleChange}
                  />
                  </Grid>
                  <Grid item xs={12}>
                  <TextField
                      required
                      fullWidth
                      id="surname"
                      label="Cognom"
                      name="surname"
                      value={userData.surname}
                      onChange={handleChange}
                  />
                  </Grid>
              </Grid>
              <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  className="app-button"
              >
                  Registrar-se
              </Button>

              <Button
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  className="app-button"
                  onClick={handleSignInClick}
              >
                  Ja tens compte? Inicia Sessió
              </Button>
              
              </Box>
          </Box>
      </Container>
  </ThemeProvider>
  )
}

export default Signup;