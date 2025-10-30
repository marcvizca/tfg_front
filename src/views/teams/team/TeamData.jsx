import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { getRpeInfoByDate, getWellnessInfoByDate, getActualACWR3, getLastWeekACWR4, getTeamMI, getTeamLastWeekMI } from "../../../controllers/services.controller.js";
import { format, subDays } from 'date-fns';
import 'chartjs-plugin-annotation';
import 'chart.js/auto'
import { Bar, Line } from 'react-chartjs-2';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


function TeamData() {
    const [rpeInfo, setRpeInfo] = useState([]);
    const [wellnessInfo, setWellnessInfo] = useState([]);
    const [ratioInfo, setRatioInfo] = useState([]);
    const [lastWeekRatio, setLastWeekRatio] = useState([]);
    const [mIndex, setMIndex] = useState([]);
    const [lastWeekMIndex, setLastWeekMIndex] = useState([]);
    const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [selectedDateWellness, setSelectedDateWellness] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const { teamId } = useParams();
    const navigate = useNavigate();
    const topValue = '1.3';

    useEffect(() => {
        const info = async () => {
            const result = await getRpeInfoByDate(teamId, selectedDate);
            setRpeInfo(result);
        }

        info();
    }, [selectedDate]);

    useEffect(() => {
      const infoWellness = async () => {
        const result = await getWellnessInfoByDate(teamId, selectedDateWellness);
        setWellnessInfo(result);
      }
      infoWellness();
  }, [selectedDateWellness]);

  useEffect(() => {
    const infoActualRatio = async () => {
      const result = await getActualACWR3(teamId);
      setRatioInfo(result);
    }
    const infoLastWeekRatio = async () => {
      const result = await getLastWeekACWR4(teamId);
      setLastWeekRatio(result);
    }
    const infoMi = async() => {
      const result = await getTeamMI(teamId);
      setMIndex(result);
    }
    const infoLastWeekMi = async () => {
      const result = await getTeamLastWeekMI(teamId);
      setLastWeekMIndex(result);
    }
    infoActualRatio();
    infoLastWeekRatio();
    infoMi();
    infoLastWeekMi();
  }, []);


    
    
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
                const user = rpeInfo[index];
                return `${user.name} ${user.surname}`;
              },
            },
          },
        },
      };

      const optionsWellness = {
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
                return `${dataWellness.datasets[datasetIndex].data[index]}`
              },
            },
          },
        },
      };

      const optionsRatio = (info) => {
        return {
        scales: {
          x: {
            ticks: {
              autoSkip: false,
            },
          },
          y: {
            title: {
              display: true,
              text: 'ACWR',
            },
            beginAtZero: true,
            max: 2.5,
            ticks: {
              stepSize: 0.2,
            }
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => {
                const index = context.dataIndex;
                const ratio = info[index].ratio;
                return `${ratio}`
              },
            },
          },
        },
      }
      };

      const optionsMI = {
        scales: {
          x: {
            ticks: {
              autoSkip: false,
            },
          },
          y: {
            title: {
              display: true,
              text: 'Índex de monotonia',
            },
            beginAtZero: true,
            max: 2.5,
            ticks: {
              stepSize: 0.2,
            }
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => {
                const index = context.dataIndex;
                const user = mIndex[index];
                return `${user.MI}`;
              },
            },
          },
        },
      };

      
    const data = {
        labels: rpeInfo.map((item) => ([item.name, item.surname])),
        datasets: [
          {
            label: 'RPE',
            data: rpeInfo.map((item) => (item.rpe ? item.rpe[0] : null)),
            backgroundColor: 'rgba(255, 165, 0, 0.8)',
          },
          /*{
            label: 'RPE',
            data: rpeInfo.map((item) => (item.rpe && item.rpe.length > 1 ? Number(item.rpe.split(',')[1]): null)),
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          },*/
        ],
      };

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    };
    
    const handleDateChangeWellness = (event) => {
      setSelectedDateWellness(event.target.value);
    }
    const handlePlayerClick = (playerId) => {
      setSelectedPlayer(playerId);
      navigate(`./userData/${playerId}`)
    };

    const dataWellness = {
      labels: wellnessInfo.map((item) => ([item.name, item.surname])),
      datasets: [
        {
          label: 'Mitja',
          data: wellnessInfo.map((item) => {
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
          data: wellnessInfo.map((item) => item.sleep),
          backgroundColor: 'rgba(0, 0, 255, 1)',
        },
        {
          label: 'Estrés',
          data: wellnessInfo.map((item) => item.stress),
          backgroundColor: 'rgba(255, 0, 0, 1)',
        },
        {
          label: 'Fatiga',
          data: wellnessInfo.map((item) => item.fatigue),
          backgroundColor: 'rgba(165, 165, 165, 1)',
        },
        {
          label: 'Dolor',
          data: wellnessInfo.map((item) => item.pain),
          backgroundColor: 'rgba(255, 186, 0, 1)',
        },
        {
          label: 'Estat anímic',
          data: wellnessInfo.map((item) => item.mood),
          backgroundColor: 'rgba(60, 179, 113, 1)',
        },
      ],
    };

    const dataRatio = (info) => {
      return {
      labels: info.map((item) => ([item.name, item.surname])),
      datasets: [
        
        {
          label: 'Ratio',
          data: info.map((item) => (item.ratio)),
          backgroundColor: 'rgba(255, 165, 0, 0.8)',
        },
        {
          label: 'Zona òptima',
          data: Array(info.length).fill(1.3),
          type: 'line',
          fill: false,
          borderColor: 'green',
          borderWidth: 2,
          pointRadius:0,
          borderDash: [5, 5],
        },
        {
          label: '',
          data: Array(info.length).fill(0.8),
          type: 'line',
          fill: false,
          borderColor: 'green',
          borderWidth: 2,
          pointRadius:0,
          borderDash: [5, 5],
        },
      ],
    }
    };

    const dataMI = {
      labels: mIndex.map((item) => ([item.name, item.surname])),
      datasets: [
        {
          label: 'Aquesta setmana',
          data: mIndex.map((item) => item.MI ),
          borderColor: 'rgb(255,99,132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
          label: 'Setmana pasada',
          data: lastWeekMIndex.map((item) => item.MI),
          borderColor: 'rgb(0,128,0)',
          backgroundColor: 'rgba(0, 128, 0, 0.5)',
        }
      ],
    };
    
    const dateOptions = [
    { value: format(new Date(), 'yyyy-MM-dd'), label: 'Avui' },
    { value: format(subDays(new Date(), 1), 'yyyy-MM-dd'), label: 'Ahir' },
    { value: format(subDays(new Date(), 2), 'yyyy-MM-dd'), label: 'Fa 2 dies' },
    ];

    return(
      
      
      <div style={{ display: 'flex', height: '100vh' }}>
        <CssBaseline />
        <div style={{ width: '200px', overflowY: 'auto', backgroundColor: 'lightgrey'}}>
          <ul style={{ listStyleType: 'none', padding: 5 }}>
            {rpeInfo.map((player) => (
              <li
                key={`${player.name}-${player.surname}`}
                style={{ cursor: 'pointer', padding: '5px', marginBottom: '5px', border: '1px solid black' ,backgroundColor: selectedPlayer === player ? 'darkgray' : 'transparent' }}
                onClick={() => handlePlayerClick(player.id)}
              >
                {`${player.name} ${player.surname} (${player.number})`}
              </li>
            ))}
          </ul>
        </div>
        <div style={{display: 'flex', flexDirection:'column', gap: '20px', alignItems: 'center', marginTop: '20px', marginLeft:'10px'}}>
          <div style={{display: 'flex', gap: '20px', alignItems: 'center'}}>

            <div style={{flex: 1}}>
                <label htmlFor="dateSelect">Selecciona la data:</label>
                <select id="dateSelect" value={selectedDate} onChange={handleDateChange}>
                {dateOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
                <h2>Gràfic RPE</h2>
                <Bar data={data} options={options} style={{ width: '600px', height: '400px' }}/>
            </div>

            <div style={{flex: 1}}>
              <label htmlFor="dateSelect">Selecciona la data:</label>
                <select id="dateSelect" value={selectedDateWellness} onChange={handleDateChangeWellness}>
                  {dateOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <h2>Gràfic Wellness</h2>
                <Bar data={dataWellness} options={optionsWellness} style={{ width: '600px', height: '400px' }}/>
            </div>

          </div>
          <h2>Acute Chronic Workload Ratio</h2>
          <div style={{display: 'flex', gap: '20px', alignItems: 'center'}}>
            <div style={{flex: 1, alignItems: 'center'}}>
              <h3>Setmana Actual</h3>
              <Bar data={dataRatio(ratioInfo)} options={optionsRatio(ratioInfo)} style={{ width: '600px', height: '400px' }}/>
            </div>
            <div style={{flex: 1}}>
              <h3>Setmana pasada</h3>
              <Bar data={dataRatio(lastWeekRatio)} options={optionsRatio(lastWeekRatio)} style={{ width: '600px', height: '400px' }}/>
            </div>
          </div>

          <div style={{display: 'flex', gap: '20px', alignItems: 'center'}}>
            <div style={{flex: 1, alignItems: 'center'}}>
              <h3>Setmana actual</h3>
              <Line data={dataMI} options={optionsMI} style={{ width: '600px', height: '400px' }}/>
            </div>
          </div>
            
        </div>
      </div>
    )
}

export default TeamData;