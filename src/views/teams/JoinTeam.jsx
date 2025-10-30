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
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { width } from "@mui/system";
import { joinTeam } from "../../controllers/services.controller";
import { showNotification } from '../../components/showNotification'

const options = ["Porter", "Defensa", "Mig", "Davanter", "Base", "Escorta", "Aler", "Aler-pivot", "Pivot", "Nadador", "Atleta"]
function JoinTeam() {
    const navigate = useNavigate();
    const defaultTheme = createTheme();
    const [teamCode, setTeamCode] = useState();
    const [playerNumber, setPlayerNumber] = useState();
    const [playerPosition, setPlayerPosition] = useState('');
    const userId = localStorage.getItem('userId');

    const handleSubmit = async (e) => {
        e.preventDefault();
            if (teamCode) {
                if (playerNumber && playerNumber >= 0) {
                    if (playerPosition && playerPosition !== '') {
                        try{
                            e.preventDefault();
                            const result = await joinTeam(teamCode, userId, playerNumber, playerPosition);
                            showNotification(result.message);
                            navigate('/teams');
                        } catch (error) {
                            if (error.response && error.response.status === 404) showNotification("No existeix cap equip amb el codi indicat", "error")
                            else showNotification("S'ha produit algun error", "error");
                        }
                    } else showNotification("Enter a valid position", "error");
                } else showNotification("Enter a valid number", "error");
            } else showNotification("Enter a valid code", "error");
        
      };

    const handleChangeCode = (e) => {
        setTeamCode(e.target.value);
    }
    const handleChangeNumber = (e) => {
        setPlayerNumber(e.target.value);
    }
    const handleChangePosition = (e) => {
        setPlayerPosition(e.target.value);
    }

    return(
        <div>
            <AiOutlineArrowLeft onClick={() => navigate(-1)} style={{ cursor: 'pointer', marginTop: '10px', marginLeft:'10px', fontSize: '24px' }} />
            <ThemeProvider theme={defaultTheme}>
            <div style={{display: 'flex', flexDirection:'column', gap: '20px', alignItems: 'center', marginTop: '20px'}}>
            <CssBaseline />
            <Box
                sx={{
                width: '500px',
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                }}
            >
                <img src={LogoSample} alt="Logo" />
                
                <Typography component="h1" variant="h5">
                Unir-se a un equip
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <div style={{display: 'flex', flexDirection:'column', gap: '20px', alignItems: 'center', marginTop: '20px'}}>
                    
                        <TextField
                            required
                            id="team_code"
                            label="Introdueix el codi d'equip"
                            name="team_code"
                            value={teamCode}
                            onChange={handleChangeCode}
                            sx={{width:400}}
                        />
                    
                    <div style={{display: 'flex', flexDirection: 'row'}}>
                        <div>
                        <InputLabel htmlFor="sport">Dorsal</InputLabel>
                        <TextField
                            required
                            id="player_number"
                            type="number"
                            label="Dorsal"
                            name="player_number"
                            value={playerNumber}
                            onChange={handleChangeNumber}
                            sx={{mt: 2, mb: 2, width:180}}
                        />
                        </div>
                        <div>
                        <InputLabel sx={{ml:5}} htmlFor="sport">Posició</InputLabel>
                        <Select
                            required
                            fullWidth
                            name="posicio"
                            label="Posició"
                            id="posicio"
                            value={playerPosition}
                            onChange={handleChangePosition}
                            sx={{mt: 2, mb: 2, ml:5, width:180}}
                        >
                            {options.map((option, index) => (
                                <MenuItem key={index} value={option}> { option } </MenuItem>
                            ))}
                        </Select>
                        </div>
                    
                    </div>
                </div>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2, width: 400 }}
                    className="app-button"
                >
                    Enviar sol·licitud
                </Button>
                
                </Box>
            </Box>
            </div>
            </ThemeProvider>
        </div>
    )
}

export default JoinTeam;