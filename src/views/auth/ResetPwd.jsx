import React, { useState } from "react";
import CssBaseline from '@mui/material/CssBaseline';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import LogoMain from '../../assets/LogoMain.jpg'
import { newPassword } from "../../controllers/services.controller";
import { showNotification } from '../../components/showNotification'


function ResetPwd() {
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const navigate = useNavigate();

    const handleChange = (e) => {
        e.preventDefault();
        setPassword(e.target.value);
    }
    const handleChangeConfirm = (e) => {
        e.preventDefault();
        setConfirmPassword(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (confirmPassword === password) {
            const email = localStorage.getItem('rec_email');
            try {
                const response = await newPassword(email, password);
                showNotification(response.message);
                navigate('/');
            } catch (error) {
                showNotification("Algo ha anat malament", "error");
            }
        }
        else {
            showNotification("Les contrasenyes han de coincidir", "error");
        }
    }

    const handleBack = () => {
        localStorage.setItem('rec_email', null);
                localStorage.setItem('otp', null);
        navigate('/');
    }

    return (
        <div>
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
                      id="new_password"
                      label="Nova contrasenya"
                      name="New Password"
                      type="password"
                      value={password}
                      onChange={handleChange}
                  />
                  </Grid>
                  <Grid item xs={12}>
                  <TextField
                      required
                      fullWidth
                      id="confirm_password"
                      label="Confirma la contrasenya"
                      name="Confirm Password"
                      type="password"
                      value={confirmPassword}
                      onChange={handleChangeConfirm}
                  />
                  </Grid>
                  <Grid item xs={12}>
                  <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  className="app-button"
              >
                  Canviar contrasenya
              </Button>
              </Grid>
                </Grid>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  onClick={handleBack}
                  className="back_start_button"
              >
                  Tornar al inici
              </Button>
            </Box>
            </Box>
        </Container>
        </div>
    )
}

export default ResetPwd;