import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';
import { showNotification } from '../../components/showNotification'
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
import { getInfoProfile, updateUser } from "../../controllers/services.controller";
import '../general.css'
import { AiOutlineArrowLeft } from 'react-icons/ai';

function UserProfile() {
    const navigate = useNavigate();
    const { auth } = useAuth();
    const [edit, setEdit] = useState(false);
    const [editedName, setEditedName] = useState('');
    const [userName, setUserName] = useState();
    const [editedSurname, setEditedSurname] = useState('');
    const [userSurname, setUserSurname] = useState();
    const [userEmail, setUserEmail] = useState();

    useEffect (() => {
        const getUserInfo = async () => {
            try {
                const response = await getInfoProfile(auth.userId);
                setUserEmail(response.email);
                setUserName(response.name);
                setUserSurname(response.surname);
            } catch (error) {
                showNotification("S'ha produit un error al sistema", "error");
            }
        }

        getUserInfo();
    }, []);

    const handleEditClick = (() => {
        setEditedName(userName);
        setEditedSurname(userSurname);
        setEdit(true);
    });

    const handleSaveEditClick = async() => {
        if (editedName === userName && editedSurname === userSurname) {
            setEdit(false);
        }
        else if (editedName === userName) {
            if (editedSurname !== '') {
                try{
                setEditedName('');
                await updateUser('', editedSurname, auth.userId);
                setUserSurname(editedSurname);
                setEdit(false);
                } catch (error) { showNotification("Error", "error"); }
            } else {
                showNotification("No pots deixar el camp 'Cognom buit", "error");
            }
        }
        else if (editedSurname === userSurname) {
            if (editedName !== '') {
                try{
                    setEditedSurname('');
                    await updateUser(editedName, '', auth.userId);
                    setUserName(editedName);
                    setEdit(false);
                } catch (error) { showNotification("Error", "error"); }
            } else showNotification("No pots deixar el camp 'Nom' buit", "error");
        }
        else {
            if (editedSurname !== '' || editedName !== '') {
                if (editedSurname !== '') {
                    if (editedName !== '') {
                        try {
                            await updateUser(editedName, editedSurname, auth.userId);
                            setUserSurname(editedSurname);
                            setUserName(editedName);
                            setEdit(false);
                        } catch (error) { showNotification("Error", "error"); }
                    } else showNotification("No pots deixar el camp 'Nom' buit", "error");
                } else showNotification("No pots deixar el camp 'Cognom' buit", "error");
            } else showNotification("No pots deixar els camps 'Nom' i 'Cognom' buits", "error");
        }
    }

    const handleCancelEditClick = (() => {
        setEditedName('');
        setEditedSurname('');
        setEdit(false);
    });


    return (
        <div>
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
                <img src={LogoSample} alt="Logo" />
                
                <Typography component="h1" variant="h5">
                Perfil
                </Typography>
                <Box component="form" noValidate sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                    <TextField
                        fullWidth
                        id="user_name"
                        label="Nom"
                        name="user_name"
                        value={edit ? editedName : userName}
                        disabled={!edit}
                        onChange={(e) => setEditedName(e.target.value)}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    </Grid>
                    <Grid item xs={12}>
                    <TextField
                        fullWidth
                        id="user_surname"
                        label="Cognom"
                        name="user_surname"
                        value={edit ? editedSurname : userSurname}
                        disabled={!edit}
                        onChange={(e) => setEditedSurname(e.target.value)}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    </Grid>
                    <Grid item xs={12}>
                    <TextField
                        fullWidth
                        id="user_email"
                        label="Correu electrònic"
                        name="user_email"
                        value={userEmail}
                        disabled
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    </Grid>
                </Grid>
                {edit ? (
                    <div>
                        <Button 
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            className="create-button"
                            onClick={handleCancelEditClick}>
                        Cancel·lar
                        </Button>
                        <Button
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }} 
                            className="app-button"
                            style={{marginLeft:'50px'}}
                            onClick={handleSaveEditClick}>
                                Guardar els canvis
                        </Button>
                    </div>
                ):(
                    <Button
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }} 
                    className="app-button" 
                    onClick={handleEditClick}>Editar perfil</Button>
                )}
                
                </Box>
            </Box>
            </Container>
  </div>
    )
}

export default UserProfile;