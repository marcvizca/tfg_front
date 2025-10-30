import axios from 'axios';
//import dotenv from 'dotenv';


//dotenv.config()

export const axiosPrivate = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {'Content-Type': 'application/json' },
    withCredentials: true
});