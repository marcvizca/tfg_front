import React, { useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import './wellness.css';
import { postWellness } from "../../controllers/services.controller";
import { showNotification } from '../../components/showNotification';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Button from '@mui/material/Button';
import EscalaWellness1 from '../../assets/Escala_wellness_1.png';
import EscalaWellness2 from '../../assets/Escala_wellness_2.png';
import { AiOutlineArrowLeft } from 'react-icons/ai';

function Home () {
  const [answers, setAnswers] = useState({});
  const [questionAnswers, setQuestionAnswers] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const { teamId } = useParams();

  const handleSubmit = async(e) => {
    e.preventDefault();
    const currentAnswer = document.querySelector("input[name='" + questions[currentQuestion].name + "']:checked");
    if(currentAnswer) {
      await postAnswers();
      navigate(-1);
      showNotification("Wellness contestat correctament!");
    }
    else showNotification("Selecciona una opció", "error");
  };

  const postAnswers = async () => {
    const response = await postWellness(userId, teamId, answers);
  }

  const nextQuestion = () => {
    const currentAnswer = document.querySelector("input[name='" + questions[currentQuestion].name + "']:checked");
    if(currentAnswer) {
      setQuestionAnswers([...questionAnswers, currentAnswer.value]);
      clearSelection();
      setCurrentQuestion(currentQuestion + 1);
    } else {
      showNotification("Selecciona una opció", "error");
    }
  };

  const lastQuestion = () => {
    const currentAnswer = document.querySelector("input[name='" + questions[currentQuestion].name + "']:checked");
    if(currentAnswer) {
      setQuestionAnswers([...questionAnswers, currentAnswer.value]);
    }
  }

  const clearSelection = () => {
    const allRadios = document.querySelectorAll("input[type='radio']");
    allRadios.forEach(radio => {
        radio.checked = false;
    });
  }

  const questions = [
        {
        id: 1,
        name: "sleep",
        text: "Com has dormit?",
        options: [...Array(7)].map((x, i) => (i + 1))
        },
        {
            id: 2,
            name: "fatigue",
            text: "Fatiga/cansament?",
            options: [...Array(7)].map((x, i) => (i + 1))
        },
        {
            id: 3,
            name: "pain",
            text: "Dolor muscular general?",
            options: [...Array(7)].map((x, i) => (i + 1))
        },
        {
            id: 4,
            name: "stress",
            text: "Percepció d'estrès?",
            options: [...Array(7)].map((x, i) => (i + 1))
        },
        {
            id: 5,
            name: "mood",
            text: "Estat d'ànim?",
            options: [...Array(7)].map((x, i) => (i + 1))
        }
  ]
  const handleChange = (e) => {
    setAnswers({
      ...answers,
      [e.target.name]: e.target.value
    });
  };

  const renderQuestions = () => {
    const question = questions[currentQuestion];
    return (
        
            <div className='question-container'>
            <label style={{fontWeight: 'bold'}}>{question.text}</label>
            <div className='rpe-test'>
              <div className='answers-input'>
                {question.options.map(option => (
                <div key={option}>
                    <input
                    className='answer-option'
                    type="radio"
                    name={question.name}
                    value={option}
                    onChange={handleChange}
                    />
                    <label>{option}</label>
                </div>
                ))}
                </div>
                <div>
                  {question.id === 1 || question.id === 5 ? <img src={EscalaWellness1} alt="escala_wellnes1"/> : <img src={EscalaWellness2} alt="escala_wellnes2"/>}
                </div>
            </div>
            
            {currentQuestion !== questions.length - 1  ? (
                <Button className="app-button" type='button' onClick={() => {nextQuestion()}}>Següent</Button>
            ) : (
                <div>
                <Button className="app-button" type='submit' onClick={() => lastQuestion()}>Enviar</Button>
                </div>
            )}
        </div>
    )
  }
  return (
    <>
    <AiOutlineArrowLeft onClick={() => navigate(-1)} style={{ cursor: 'pointer', marginTop: '10px', marginLeft:'10px', fontSize: '24px' }} />
      <Container component="main" maxWidth="sm">
      <CssBaseline />
        <form onSubmit={handleSubmit}>
            <h1>Qüestionari Wellness</h1>
                {renderQuestions()}
            <br />
        </form>
      </Container>
    </>
  );
};

export default Home;
