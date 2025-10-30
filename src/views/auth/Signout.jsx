import React, {useState, useContext, useEffect} from 'react';
//import {signOut} from 'firebase/auth'
//import { auth } from '../../firebase.js';
import {useNavigate } from 'react-router-dom';
import { showNotification } from '../../components/showNotification'
import { logOutUser } from '../../controllers/services.controller.js';
import AuthContext from '../../context/AuthProvider';

const SignOut = () => {
    const navigate = useNavigate();
    const { setAuth } = useContext(AuthContext);
    
    const logOut = async () => {
      try {
        setAuth({});
        const response = await logOutUser();
        navigate("/");
        showNotification("Has tancat la sessió correctament");
      } catch (error) {

      }
    };

    useEffect(() => {
      logOut();
  }, []);

    const handleLogout = () => {
        //auth.signOut()
        setAuth({})
          .then(() => {
            navigate("/" );
            showNotification("Has tancat la sessió correctament");
          })
          .catch((error) => {
            showNotification("Algo ha anat malament", "error");
          });
    };

  return (
    <div></div>
    //<button className="logoutBut" onClick={handleLogout}>Logout</button>
  );
};

export default SignOut;
