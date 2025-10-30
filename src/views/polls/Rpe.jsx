import React, { useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import './wellness.css';
import Button from '@mui/material/Button';
import { showNotification } from '../../components/showNotification';
import { postRpe } from "../../controllers/services.controller";
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import escalaRPE from '../../assets/Escala_rpe.png';
import { AiOutlineArrowLeft } from 'react-icons/ai';

function Home () {
  const [rpe, setRpe] = useState();
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const { teamId } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rpe) {
        await postResult();
        navigate(-1);
        showNotification("RPE contestat correctament!");
    }
    else showNotification("Selecciona una opció", "error");
  };

  const options = [...Array(10)].map((x, i) => (i + 1));

  const postResult = async () => {
    const response = await postRpe(userId, teamId, rpe);
  }

  const handleChange = (e) => {
    setRpe(e.target.value);
  };


  return (
    <>
    <AiOutlineArrowLeft onClick={() => navigate(-1)} style={{ cursor: 'pointer', marginTop: '10px', marginLeft:'10px', fontSize: '24px' }} />
    <Container component="main" maxWidth="sm">
    <CssBaseline />
        <form onSubmit={handleSubmit}>
            <h1>Qüestionari RPE</h1>
            <div className='question-container'>
                <label style={{fontWeight:'bold'}}>Fatiga en la sessió entrenament</label>
                <div className='rpe-test'>
                  <div className='answers-input-rpe'>
                    {options.map(option => (
                    <div key={option}>
                    <input
                    className='answer-option'
                    type="radio"
                    value={option}
                    name="answer"
                    onChange={handleChange}
                    />
                    <label>{option}</label>
                
                    </div>
                    ))}
                    </div>
                    <div style={{marginTop: '10px'}}>
                      <img src={escalaRPE} alt="escala_rpe"/>
                    </div>
                </div>
                <Button type='submit' className="app-button" sx={{ mt: 3, mb: 2 }}>Enviar</Button>
            </div>
            <br />
        </form>
    </Container>
    </>
  );
};

export default Home;