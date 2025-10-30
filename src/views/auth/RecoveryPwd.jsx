import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import LogoMain from '../../assets/LogoMain.jpg'
import '../general.css'
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { postRecoveryPwd } from "../../controllers/services.controller.js";
import { showNotification } from "../../components/showNotification";

function RecoveryPwd() {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setEmail(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const OTP = Math.floor(Math.random() * 9000 + 1000);
            setOtp(OTP);
            const response = await postRecoveryPwd(email, OTP);
                localStorage.setItem('rec_email', email);
                localStorage.setItem('otp', OTP);
                if(response.message) navigate('./insertotp');
        } catch (error) {
            if (error.response && error.response.status === 409) {
                showNotification(error.response.data.message, "error");
            }
            else {
                showNotification("Algo ha anat malament", "error");
            }
        }
    }

    const defaultTheme = createTheme();
    return (
      <ThemeProvider theme={defaultTheme}>
        <AiOutlineArrowLeft onClick={() => navigate(-1)} style={{ cursor: 'pointer', marginTop: '10px', marginLeft:'10px', fontSize: '24px' }} />
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
                      value={email}
                      onChange={handleChange}
                  />
                  </Grid>
                  <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  className="app-button"
              >
                  Recuperar contrasenya
              </Button>
                </Grid>
            </Box>
            </Box>
        </Container>
        </ThemeProvider>
    )
}

export default RecoveryPwd;