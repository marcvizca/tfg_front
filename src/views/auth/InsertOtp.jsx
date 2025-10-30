import React, { useState } from "react";
import CssBaseline from '@mui/material/CssBaseline';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import LogoMain from '../../assets/LogoMain.jpg'
import { postRecoveryPwd } from "../../controllers/services.controller";
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { showNotification } from "../../components/showNotification";

const InsertOtp = (props) => {
    const [otpInput, setOtpInput] = useState('');
    const [disable, setDisable] = useState(true);
    const [timerCount, setTimer] = React.useState(60);
    const email = localStorage.getItem('rec_email')
    const otp = localStorage.getItem('otp');
    const navigate = useNavigate();


    const handleChange = async(e) => {
        setOtpInput(e.target.value);
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        if (otpInput === otp) {
            navigate('/newpassword');
        }
        else {
          showNotification("El codi introduït no és correcte", "error");
          setOtpInput('');
        }
    }

    const handleResend = async(e) => {
        e.preventDefault();
        const OTP = Math.floor(Math.random() * 9000 + 1000);
        const response = await postRecoveryPwd(email, OTP);
        otp = OTP;
        localStorage.setItem('otp', OTP);
    }

    React.useEffect(() => {
        let interval = setInterval(() => {
          setTimer((lastTimerCount) => {
            lastTimerCount <= 1 && clearInterval(interval);
            if (lastTimerCount <= 1) setDisable(false);
            if (lastTimerCount <= 0) return lastTimerCount;
            return lastTimerCount - 1;
          });
        }, 1000);
        return () => clearInterval(interval);
      }, [disable]);


    return(
      <>
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
                <h3>Verificació de correu electrònic</h3>
                <p>T'hem enviat un codi al teu correu {email}</p>
              <Grid container spacing={2}>
                  <Grid item xs={12}>
                  <TextField
                      required
                      fullWidth
                      id="otp"
                      label="OTP"
                      name="otp"
                      value={otpInput}
                      onChange={handleChange}
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
                  Validar OTP
              </Button>
              </Grid>
                </Grid>
                <p>No has rebut el codi?</p>{" "}
                    <a
                      style={{
                        color: disable ? "gray" : "blue",
                        cursor: disable ? "none" : "pointer",
                        textDecorationLine: disable ? "none" : "underline",
                      }}
                      onClick={() => handleResend()}
                    >
                      {disable ? `Reenvia el OTP en ${timerCount}s` : "Reenvia el OTP"}
                    </a>
            </Box>
            </Box>
        </Container>
        </>
    )
}

export default InsertOtp;