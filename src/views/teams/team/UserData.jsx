import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import CssBaseline from '@mui/material/CssBaseline';
import Button from '@mui/material/Button';
import { format, subDays, startOfWeek, endOfWeek, subWeeks } from 'date-fns';
import { getRpeByUser, getWellnessByUser, exitTeamMember, getInfoProfile } from "../../../controllers/services.controller.js";
import { Bar } from 'react-chartjs-2';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { showNotification } from '../../../components/showNotification';


function UserData() {
    const actualDate = format(new Date(), 'yyyy-MM-dd');
    const [selectedDateRpe, setSelectedDateRpe] = useState([format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd'), format(endOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd')]);
    const [selectedDateWellness, setSelectedDateWellness] = useState([format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd'), format(endOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd')]);
    const { teamId, playerId } = useParams();
    const [rpeInfo, setRpeInfo] = useState();
    const [wellnessInfo, setWellnessInfo] = useState();
    const [openDialog, setOpenDialog] = useState(false);
    const [playerName, setPlayerName] = useState('');
    const navigate = useNavigate();

    //Week RPE
    useEffect(() => {
        const infoRpeUser = async () => {
          const result = await getRpeByUser(playerId, teamId, selectedDateRpe[0], selectedDateRpe[1]);
          setRpeInfo(result);
        }
        infoRpeUser();
    }, [selectedDateRpe]);

    useEffect(() => {
        const infoWellnessUser = async () => {
          const result = await getWellnessByUser(playerId, teamId, selectedDateWellness[0], selectedDateWellness[1]);
          setWellnessInfo(result);
        }
        infoWellnessUser();
    }, [selectedDateWellness]);

    useEffect(() => {
        const getUserInfo = async () => {
            const result = await getInfoProfile(playerId);
            setPlayerName(result.name + ' ' + result.surname);
        }
        getUserInfo();
    }, []);

    const handleDateChange = (event) => {
        setSelectedDateRpe(event.target.value.split(','));
    };

    const handleWellnessDateChange = (event) => {
        setSelectedDateWellness(event.target.value.split(','));
    };

    const handleOpenDialog = () => {
      setOpenDialog(true);
  };
  
  const handleCloseDialog = () => {
      setOpenDialog(false);
  };
  const handleAcceptDialog = async() => {
      const response = await exitTeamMember(playerId, teamId);
      showNotification("El jugador ha estat expulsat de l'equip");
      setOpenDialog(false);
      navigate(-1);
  }

    const labels = ['Dilluns', 'Dimarts' ,'Dimecres', 'Dijous', 'Divendres', 'Disabte', 'Diumenge'];


    const rpePorDia = (rpeInfo || []).reduce((acc, item) => {
        const fecha = new Date(item.date);
        let weekDay = fecha.getDay(); // Diumenge = 0

        weekDay = (weekDay === 0) ? 6 : weekDay - 1;
      
        if (!acc[weekDay]) {
          acc[weekDay] = { total: 0, count: 0 };
        }
      
        acc[weekDay].total += item.rpe;
        acc[weekDay].count += 1;
      
        return acc;
    }, {});
      
    const promedioRPEPorDia = labels.map((dia, index) => {
            if (rpePorDia[index] && rpePorDia[index].count > 0) {
                return rpePorDia[index].total / rpePorDia[index].count;
            } else {
            return 0;
            }
    });


    const dayOfWeekIndex = {
        "Dilluns": 0,
        "Dimarts": 1,
        "Dimecres": 2,
        "Dijous": 3,
        "Divendres": 4,
        "Disabte": 5,
        "Diumenge": 6,
    };
      
    let wellnessDay = Array.from({ length: 7 }, () => ({
        sleep: 0,
        stress: 0,
        fatigue: 0,
        pain: 0,
        mood: 0,
    }));
      
      if (wellnessInfo && Array.isArray(wellnessInfo)) {
      wellnessInfo.forEach((dayInfo) => {
        const date = new Date(dayInfo.date);
        let weekDay = date.getDay();
        weekDay = (weekDay === 0) ? 6 : weekDay - 1;
        const dayOfWeek = labels[weekDay];
        
        const index = dayOfWeekIndex[dayOfWeek];
        wellnessDay[index] = {
          sleep: dayInfo.sleep,
          stress: dayInfo.stress,
          fatigue: dayInfo.fatigue,
          pain: dayInfo.pain,
          mood: dayInfo.mood,
        };
      });
    }
      
    

    const data = {
        labels,
        datasets: [
          {
            label: 'RPE',
            data: promedioRPEPorDia,
            backgroundColor: 'rgba(255, 165, 0, 0.8)',
          }
        ]
    };
    
    const wellnessData = {
        labels,
        datasets: [
            {
              label: 'Mitja',
              data: wellnessDay.map((item) => {
                const media =
                  (item.sleep + item.stress + item.fatigue + item.pain + item.mood) / 5;
                return media;
              }),
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
    }

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
            const count = rpePorDia[index].count;
            return `Total RPE answered: ${count}`;
            },
        },
        },
    },
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

    const dateOptions = [
        { value: [format(startOfWeek(new Date(), {weekStartsOn: 1}), 'yyyy-MM-dd'), format(endOfWeek(new Date(), {weekStartsOn: 1}), 'yyyy-MM-dd')], label: 'Setmana actual' },
        { value: [format(startOfWeek(subWeeks(new Date(), 1), {weekStartsOn: 1}), 'yyyy-MM-dd'), format(endOfWeek(subWeeks(new Date(), 1), {weekStartsOn: 1}), 'yyyy-MM-dd')], label: 'Setmana pasada' },
        { value: [format(startOfWeek(subWeeks(new Date(), 2), {weekStartsOn: 1}), 'yyyy-MM-dd'), format(endOfWeek(subWeeks(new Date(), 2), {weekStartsOn: 1}), 'yyyy-MM-dd')], label: 'Fa 2 setmanes' },
        ];

    return(
        <div>
            <CssBaseline />
            <AiOutlineArrowLeft onClick={() => navigate(-1)} style={{ cursor: 'pointer', marginTop: '10px', marginLeft:'10px', fontSize: '24px' }} />
            <div style={{display: 'flex', flexDirection:'column', gap: '20px', alignItems: 'center', marginTop: '20px'}}>
            <h2>Dades {playerName}</h2>
                <div style={{display: 'flex', gap: '20px', alignItems: 'center'}}>
                    <div style={{flex: 1}}>
                        <h3>RPE</h3>
                        <select id="dateSelect" value={selectedDateRpe} onChange={handleDateChange}>
                            {dateOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                {option.label}
                                </option>
                            ))}
                        </select>
                        <Bar data={data} options={options} style={{ width: '600px', height: '400px' }}/>
                    </div>

                    <div style={{flex: 1}}>
                        <h3>Wellness</h3>
                        <select id="dateSelect" value={selectedDateWellness} onChange={handleWellnessDateChange}>
                            {dateOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                {option.label}
                                </option>
                            ))}
                        </select>
                        <Bar data={wellnessData} options={wellnessOptions} style={{ width: '600px', height: '400px' }}/>
                    </div>
                </div>
                </div>

                <div className="exit_button_container">
                    <Button className="exit_team_button" onClick={handleOpenDialog}>
                        Expulsar de l'equip
                    </Button>
                </div>
                <Dialog open={openDialog} onClose={handleCloseDialog}>
                    <DialogTitle>Expulsar jugador del equip</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Segur que vols expulsar el jugador del equip?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Cancelar</Button>
                        <Button onClick={handleAcceptDialog} color="primary">
                            Confirmar
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
    )
}


export default UserData;