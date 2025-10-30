import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import useAuth from '../../hooks/useAuth.js';
import { getMemberInfo, registerMinuts, getMembersJoining, postMemberJoinTeam, denyMemberPendent, exitTeamMember } from "../../controllers/services.controller.js";
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {DesktopDatePicker} from '@mui/x-date-pickers/DesktopDatePicker';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import TextField from '@mui/material/TextField';
import { showNotification } from '../../components/showNotification'
import { parse, format } from 'date-fns';
import { getMembersPendents } from "../../services/services.service.js";
import { getRpeByUser, getWellnessByUser } from "../../controllers/services.controller.js";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Bar } from 'react-chartjs-2';
import { subWeeks, addDays, subDays } from "date-fns";

function Team() {
    const { auth } = useAuth();
    const [isTrainer, setIsTrainer] = useState(false);
    const { teamId } = useParams();
    const [selectedDate, setSelectedDate] = useState(null);
    const [minuts, setMinuts] = useState('');
    const [membersPendents, setMembersPendents] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [authorized, setAuthorized] = useState();
    const [loading, setLoading] = useState(false);
    const [rpeInfo, setRpeInfo] = useState([]);
    const [wellnessInfo, setWellnessInfo] = useState([]);
    const [wellnessDone, setWellnessDone] = useState(false);
    const [rpeDone, setRpeDone] = useState(false);
    const navigate = useNavigate();

    //Player section
    useEffect(() => {
        setLoading(false);
        const getMembersPendents = async () => {
            try {
                const response = await getMembersJoining(teamId);
                setMembersPendents(response);
            } catch (error) {
                showNotification("S'ha produit algun error al sistema", "error");
            }
        }

        const getUserPollsInfoRpe = async () => {
            try {
                const from = format(subWeeks(new Date(), 1), 'yyyy-MM-dd');
                const to = format(new Date(), 'yyyy-MM-dd')
                const resultRpe = await getRpeByUser(auth.userId, teamId, from, to);
                setRpeInfo(resultRpe);
                let lastRpe = resultRpe[resultRpe.length -1].date;
                lastRpe = lastRpe.split('T')[0];
                const todayRpe = format((new Date()), 'yyyy-MM-dd');
                if(lastRpe === todayRpe) {
                    setRpeDone(true);
                }
            } catch (error) {
                
            }
        }

        const getUserPollsInfoWellness = async () => {
            try {
                const from = format(subWeeks(new Date(), 1), 'yyyy-MM-dd');
                const to = format(new Date(), 'yyyy-MM-dd')
                const resultWellness = await getWellnessByUser(auth.userId, teamId, from, to);
                setWellnessInfo(resultWellness);
                let lastWellnes = resultWellness[resultWellness.length -1].date;
                lastWellnes = lastWellnes.split('T')[0];
                const todayWellness = format((new Date()), 'yyyy-MM-dd');
                if(lastWellnes === todayWellness) {
                    setWellnessDone(true);
                }
            } catch (error) {
                
            }
        }

        const getUserInfo = async() => {
            try {
                const response = await getMemberInfo(auth.userId, teamId);
                setAuthorized(true);
                setIsTrainer(response.is_trainer);

                if (response.is_trainer) {
                    await getMembersPendents();
                }
                else {
                    await getUserPollsInfoRpe();
                    await getUserPollsInfoWellness();
                }
                setLoading(true);
            } catch(error) {
                if (error.response && error.response.status === 404) {
                    setAuthorized(false);
                    setLoading(true);
                }
            }
        };
        getUserInfo();
    }, []);

    const handleGoBack = () => {
        navigate('/teams');
    }
    const handleOpenDialog = () => {
        setOpenDialog(true);
    };
    
    const handleCloseDialog = () => {
        setOpenDialog(false);
    };
    const handleAcceptDialog = async() => {
        const response = await exitTeamMember(auth.userId, teamId);
        showNotification(response.message);
        setOpenDialog(false);
        navigate('/teams');
    }

    //Trainer section
    const handleDateChange = async (newDate) => {
        await setSelectedDate(newDate);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedDate) {
            if (minuts) {
                try {
                    if (minuts > 0) {
                        const dateFormated = format(new Date(selectedDate), 'yyyy-MM-dd');
                        const response = await registerMinuts(teamId, dateFormated, minuts);
                        setSelectedDate(null);
                        setMinuts('');
                        showNotification('Minuts registrats correctament!');
                    }
                    else showNotification('Els minuts registrats han de ser un nombre positiu', 'error')
                } catch (error) {
                    if (!error?.response) {
                        showNotification('No Server Response', 'error');
                    } else if (error.response?.status === 400) {
                        showNotification('Ja hi ha minuts registrats per aquesta data', 'error');
                    }
                }
            } else showNotification('Enter a valid number of minuts', 'failure')
        }
        else showNotification('Enter a date', 'failure');
    };

    const handleAccept = async (member) => {
        const response = await postMemberJoinTeam(member.user_id, member.team_id, member.number, member.position);
        const membersPend = await getMembersJoining();
        setMembersPendents(membersPend);
        //fer notificacio
    }
    const handleDeny = async (member) => {
        const response = await denyMemberPendent(member.user_id, member.team_id);
        const membersPend = await getMembersJoining();
        setMembersPendents(membersPend);
    }

    const grafic_labels = () => {
        let labels = [];
        const from = format(addDays(subWeeks(new Date(), 1), 1), 'yyyy-MM-dd');
        const to = format(new Date(), 'yyyy-MM-dd')
        let currentDate = new Date(from);
        while (currentDate <= new Date()) {
            labels.push(currentDate.toISOString().split('T')[0]);
            currentDate.setDate(currentDate.getDate() +1);
        }
        return labels;
    }

    let wellnessDay = Array.from({ length: 7 }, () => ({
        media: 0,
        sleep: 0,
        stress: 0,
        fatigue: 0,
        pain: 0,
        mood: 0,
    }));

    let rpeDay = Array.from({ length: 7 }, () => ({
        rpe:0,
    }));

    if (wellnessInfo && Array.isArray(wellnessInfo)) {
        const first = format(subWeeks(new Date(), 1), 'yyyy-MM-dd')
        wellnessInfo.forEach((dayInfo) => {
          let date = new Date(dayInfo.date);
          date = date.toISOString().split('T')[0];
          if(date === first) {
            wellnessDay[0] = {
                media: (dayInfo.sleep + dayInfo.stress + dayInfo.fatigue + dayInfo.pain + dayInfo.mood) / 5,
                sleep: dayInfo.sleep,
                stress: dayInfo.stress,
                fatigue: dayInfo.fatigue,
                pain: dayInfo.pain,
                mood: dayInfo.mood,
            };
        }
          for (let i = 0; i <= 7; i++) {
            if (grafic_labels()[i] === date) {
                wellnessDay[i] = {
                    media: (dayInfo.sleep + dayInfo.stress + dayInfo.fatigue + dayInfo.pain + dayInfo.mood) / 5,
                    sleep: dayInfo.sleep,
                    stress: dayInfo.stress,
                    fatigue: dayInfo.fatigue,
                    pain: dayInfo.pain,
                    mood: dayInfo.mood,
                };
            }
          }
        });
    }

    if (rpeInfo && Array.isArray(wellnessInfo)) {
        const first = format(subWeeks(new Date(), 1), 'yyyy-MM-dd')
        rpeInfo.forEach((dayInfo) => {
            let date = new Date(dayInfo.date);
            date = date.toISOString().split('T')[0];
            if(date === first) {
                rpeDay[0] = {rpe: dayInfo.rpe}
            }
            for (let i = 0; i <= 7; i++) {
                if (grafic_labels()[i] === date) {
                    rpeDay[i] = {
                        rpe: dayInfo.rpe
                    };
                }
            }
        })
    }

    //User grafics
    const options = {
        scales: {
            x: {
            ticks: {
                autoSkip: false,
            },
            },
            y: {
            title: {
                display: true,
                text: 'RPE',
            },
            beginAtZero: true,
            max: 10,
            },
        },
        plugins: {
            tooltip: {
            callbacks: {
                label: (context) => {
                const index = context.dataIndex;
                return `${context.dataset.data[index]}`;
                },
            },
            },
        },
    };

    const data = {
        labels: grafic_labels(),
        datasets: [
          {
            label: 'RPE',
            data: rpeDay.map(item => item.rpe),
            backgroundColor: 'rgba(255, 165, 0, 0.8)',
          }
        ],
    };

    const wellnessData = {
        labels: grafic_labels(),
        datasets: [
            {
              label: 'Media',
              data: wellnessDay.map((item) => item.media),
              type: 'line',
              fill: false,
              borderColor: 'rgba(0, 128, 0, 1)',
              borderWidth: 2,
            },
            {
              label: 'Son',
              data: wellnessDay.map((item) => item.sleep),
              backgroundColor: 'rgba(0, 0, 255, 1)',
            },
            {
              label: 'Estrés',
              data: wellnessDay.map((item) => item.stress),
              backgroundColor: 'rgba(255, 0, 0, 1)',
            },
            {
              label: 'Fatiga',
              data: wellnessDay.map((item) => item.fatigue),
              backgroundColor: 'rgba(165, 165, 165, 1)',
            },
            {
              label: 'Dolor',
              data: wellnessDay.map((item) => item.pain),
              backgroundColor: 'rgba(255, 186, 0, 1)',
            },
            {
              label: 'Estat anímic',
              data: wellnessDay.map((item) => item.mood),
              backgroundColor: 'rgba(60, 179, 113, 1)',
            },
          ],
    };
    const wellnessOptions = {
        scales: {
            x: {
            ticks: {
                autoSkip: false,
            },
            },
            y: {
            title: {
                display: true,
                text: 'Wellness',
            },
            beginAtZero: true,
            max: 7,
            },
        },
        plugins: {
            tooltip: {
            callbacks: {
                label: (context) => {
                const index = context.dataIndex;
                const datasetIndex = context.datasetIndex;
                return `${wellnessData.datasets[datasetIndex].data[index]}`;
                },
            },
            },
        },
        };

    return (
        <div>
            <CssBaseline />
        {loading ? (
        <div>
        { authorized ? (
        <div>
        { isTrainer ? (
            <div style={{display:'flex'}}>
                <div style={{alignItems: 'center', marginTop:'30px', justifyContent:'center', marginLeft:'auto'}}>
                    <div style={{backgroundColor: '#f0f0f0', padding: '16px', borderRadius: '4px'}}>
                        <h2>Registrar minuts d'entrenament</h2>
                        <label>Registra els minuts d'entrenament per dia de l'equip per poder generar més dades</label>
                        <div style={{marginTop:'10px'}}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DesktopDatePicker
                                label="Selecciona una data"
                                value={selectedDate}
                                onChange={handleDateChange}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        "&:hover fieldset": {
                                            borderColor: "orange !important",
                                        },
                                        "&.Mui-focused fieldset": {
                                            borderColor: "orange !important",
                                        },
                                    },
                                    '& label.Mui-focused': {
                                        color: 'orange',
                                      },
                                }}
                                renderInput={(params) => <TextField {...params} fullWidth  />}
                            />
                        </LocalizationProvider>
                        </div>
                        <div style={{marginTop:'10px'}}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Minuts entrenats"
                                value={minuts}
                                onChange={(e) => setMinuts(e.target.value)}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        "&:hover fieldset": {
                                            borderColor: "orange !important",
                                        },
                                        "&.Mui-focused fieldset": {
                                            borderColor: "orange !important",
                                        },
                                    },
                                    '& label.Mui-focused': {
                                        color: 'orange',
                                      },
                                }}
                            />
                        </div>
                        <div>
                            <Button
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                onClick={handleSubmit}
                                >
                                Enviar
                            </Button>
                        </div>
                    </div>
                    <div>
                        <Link to='data'>
                            <Button
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                className="data-button"
                            >
                                Veure les dades de l'equip
                            </Button>
                        </Link>
                    </div>
                </div>
                <div style={{ justifyContent:'flex-end', marginLeft: 'auto'}}>
                        <div style={{ overflowY: 'auto', backgroundColor: 'lightgrey', marginLeft: 'auto'}}>
                            <div style={{marginLeft: '3px'}}>
                            <h3>Codi de l'equip:</h3>
                            <div style={{display: 'flex', justifyContent: 'center'}}>
                            <text className="code-text">{teamId}</text>
                            </div>
                            <text>Comparteix-lo!!</text>
                            </div>
                        </div>
                        <div style={{width:'fit-content', overflowY: 'auto', backgroundColor: 'rgb(252, 193, 84)', marginLeft: 'auto'}}>
                            <h4>Sol·licituds Pendents:</h4>
                            {membersPendents.length > 0 ? ( 
                        <ul style={{ listStyleType: 'none', padding: 5 }}>
                            {membersPendents.map((member) => (
                            <li
                                key={`${member.name}-${member.surname}`}
                                style={{ cursor: 'pointer', padding: '5px', marginBottom: '5px', border: '1px solid black' }}
                            >
                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '3px'}}>
                                {`${member.name} ${member.surname.slice(0, 10)}${member.surname.length > 10 ? '...' : ''}`}
                                    <div style={{alignContent:'flex-end !important'}}>
                                        <Button className="pendingMember_accept_button" onClick={() => handleAccept(member)}>Aceptar</Button>
                                        <Button className="pendingMember_deny_button" onClick={() => handleDeny(member)}>Denegar</Button>
                                    </div>
                                </div>
                            </li>
                            ))}
                        </ul>
                        ):(<text>No hi ha sol·licituds pendents</text>)}
                        </div>
                </div>
            </div>
        ) : (
            <div style={{display:'flex', justifyContent: 'center', flexDirection: 'column'}}>
                <div style={{display:'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', marginTop:'30px'}}>
                    <div>
                        {!wellnessDone ? (
                        <Link to='wellness'>
                            <Button
                                variant="contained"
                                sx={{ mt: 3, mb: 2, width:'400px'}}
                                className="app-button"
                            >
                                Wellness
                            </Button>
                        </Link>
                        ):(<div></div>)}
                    </div>
                    <div style={{marginTop:'30px'}}>
                        {!rpeDone ? (
                        <Link to='rpe'>
                            <Button
                                variant="contained"
                                sx={{ mt: 3, mb: 2, width:'400px'}}
                                className="app-button"
                            >
                                RPE
                            </Button>
                        </Link>
                        ):(<div></div>)}
                    </div>
                </div>
                <div style={{display: 'flex', gap: '20px', alignItems: 'center'}}>
                    <div style={{flex: 1}}>
                        <h3>RPE de la setmana</h3>
                        <Bar data={data} options={options} style={{ width: '600px', height: '400px' }}/>
                    </div>

                    <div style={{flex: 1}}>
                        <h3>Wellness de la setmana</h3>
                        <Bar data={wellnessData} options={wellnessOptions} style={{ width: '600px', height: '400px' }}/>
                    </div>
                </div>

                <div className="exit_button_container">
                    <Button className="exit_team_button" onClick={handleOpenDialog}>
                        Sortir de l'equip
                    </Button>
                </div>
                <Dialog open={openDialog} onClose={handleCloseDialog}>
                    <DialogTitle>Sortir de l'equip</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Segur que vols sortir de l'equip?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Cancel·lar</Button>
                        <Button onClick={handleAcceptDialog} color="primary">
                            Confirmar
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )}
        </div>
        ):(
                
            <div style={{display: 'flex', flexDirection: 'column',justifyContent: 'center', alignItems: 'center'}}>
                <h1>No autoritzat</h1>
                <br />
                <p>No tens accés a aquesta pàgina.</p>
                <div style={{flexGrow: '1', display: 'flex', justifyContent: 'center', alignItems: 'flex-end'}}>
                    <button onClick={handleGoBack}>Tornar</button>
                </div>
            </div>
               
        )}
        </div>
        ):(<p style={{display: 'flex', flexDirection: 'column',justifyContent: 'center', alignItems: 'center'}}>Carregant...</p>)}
        </div>
        
    )
}

export default Team;