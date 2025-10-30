import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { MenuItem, InputLabel } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Select } from "@mui/material";
import LogoSample from '../../assets/LogoSample.jpg';
import { createTeam } from "../../controllers/services.controller";
import './teams.css'
import '../general.css'
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { showNotification } from "../../components/showNotification";

const options = ["Futbol", "Hockey herba", "Natació", "Atletisme"];

function CreateTeam() {
  const [teamData, setTeamData] = useState({
    team:'',
    sport:'',
  });
  const navigate = useNavigate();
  const defaultTheme = createTheme();
  const handleSubmit = async(e) => {
    e.preventDefault();
    if (teamData.team && teamData.sport) {
      const userId = localStorage.getItem('userId');
      try {
      const response = await createTeam(userId, teamData.team, teamData.sport);
      navigate('/teams');
      } catch (error) {
        showNotification("S'ha produit algun error", "error");
      }
    } else showNotification("Falten dates per emplenar", "error")
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTeamData({
      ...teamData,
      [name]: value,
    });
  };

  return (
  <div>
  <AiOutlineArrowLeft onClick={() => navigate(-1)} style={{ cursor: 'pointer', marginTop: '10px', marginLeft:'10px', fontSize: '24px' }} />
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
          <img src={LogoSample} alt="Logo" />
        
        <Typography component="h1" variant="h5">
          Crear un equip
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="team_name"
                label="Nom de l'equip"
                name="team"
                value={teamData.team}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <InputLabel htmlFor="sport">Esport</InputLabel>
              <Select
                  required
                  fullWidth
                  name="sport"
                  id="sport"
                  value={teamData.sport}
                  onChange={handleChange}
              >
                  {options.map((option, index) => (
                      <MenuItem key={index} value={option}> { option } </MenuItem>
                  ))}
              </Select>
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            className="app-button"
          >
            Crear l'equip
          </Button>
          
        </Box>
      </Box>
    </Container>
  </ThemeProvider>
  </div>
  )
}

export default CreateTeam;