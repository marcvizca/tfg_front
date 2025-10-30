import axios from 'axios';
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import {formatInTimeZone} from 'date-fns-tz'


//User

export const getUserInfo = async (id) => {
    const response = await axios.get(process.env.REACT_APP_BASE_URL + "/api/user/" + id, { withCredentials: true });
    return response;
}

export const updateUserProfile = async (name, surname, id) => {
    const response = await axios.put(process.env.REACT_APP_BASE_URL + "/api/user/" + id , 
    {name, surname}, { withCredentials: true }
    );
    return response;
}

//Login function
export const postUserAuthByEmail = async (email, password) => {
    const response = await axios.post(process.env.REACT_APP_BASE_URL + "/api/login" , 
        JSON.stringify({ email, password }),
        {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        }
    );
    return response;
}

//Logout function
export const getUserLoggedOut = async () => {
    const response = await axios.get(process.env.REACT_APP_BASE_URL + "/api/logout",
        {
            withCredentials: true
        }
    );
    return response;
}

//Auth
export const postSignUp = async (email, password, name, surname) => {
    const response = await axios.post(process.env.REACT_APP_BASE_URL + "/api/register",
    { email, password, name, surname }, { withCredentials: true }
    );
    return response;
}

export const changePassword = async (email, password) => {
    const response = await axios.put(process.env.REACT_APP_BASE_URL + "/api/changepassword",
    {email, password}, { withCredentials: true }
    );
    return response;
}

//Refresh Token
export const getRefreshToken = async () => {
    const response = await axios.get(process.env.REACT_APP_BASE_URL + "/api/refresh",
        {
            withCredentials: true
        }
    );
    return response;
}

//Users
export const getUserByIdTeams = async (id) => {
    const response = await axios.get(process.env.REACT_APP_BASE_URL + "/api/user/" + id + "/teams",
    {
        withCredentials: true
    });
    return response;
}

//Teams
export const getTeamName = async (id) => {
    const response = await axios.get(process.env.REACT_APP_BASE_URL + "/api/team/" + id,
    {
        withCredentials: true
    });
    return response;
}

export const postTeam = async (userId, teamName, sport) => {
    const response = await axios.post(process.env.REACT_APP_BASE_URL + "/api/team/create",
    {userId, teamName, sport}, { withCredentials: true }
    );
    return response;
}

export const postMemberPendent = async (teamId, userId, number, position) => {
    const response = await axios.post(process.env.REACT_APP_BASE_URL + "/api/team/join",
    {teamId, userId, number, position}, { withCredentials: true }
    );
    return response;
}

export const getMembersPendents = async (teamId) => {
    const response = await axios.get(process.env.REACT_APP_BASE_URL + "/api/team/getMembersPendents/" + teamId, { withCredentials: true });
    return response;
}

//Members
export const getTeamMember = async (userId, teamId) => {
    const response = await axios.get(process.env.REACT_APP_BASE_URL + "/api/members", {
    params: {
        userId: userId,
        teamId: teamId
    }, withCredentials: true
    });
    return response;
}
export const postMember = async (userId, teamId, number, position) => {
    const response = await axios.post(process.env.REACT_APP_BASE_URL + "/api/members/post",
    {userId, teamId, number, position}, { withCredentials: true }
    );
    return response;
}

export const deleteMemberPendent = async (userId, teamId) => {
    const response = await axios.delete(process.env.REACT_APP_BASE_URL + "/api/members/denyjoin", {
        params: {
            userId: userId,
            teamId: teamId
        }, withCredentials: true
        });
    return response;
}

export const exitTeam = async (userId, teamId) => {
    const response = await axios.delete(process.env.REACT_APP_BASE_URL + "/api/members/exitTeam", {
        params: {
            userId: userId,
            teamId: teamId
        }, withCredentials: true
    });
    return response;
}

//polls
export const postRpeTest = async (userId, teamId, rpe) => {
    const date = formatInTimeZone(new Date(), 'Europe/Madrid', 'yyyy-MM-dd');
    const response = await axios.post(process.env.REACT_APP_BASE_URL + "/api/poll/rpe",
    {userId, teamId, date, rpe}, { withCredentials: true }
    );
    return response;
}

export const postWellnessTest = async (userId, teamId, data) => {
    const date = formatInTimeZone(new Date(), 'Europe/Madrid', 'yyyy-MM-dd');
    const response = await axios.post(process.env.REACT_APP_BASE_URL + "/api/poll/wellness",
    {userId, teamId, date, data}, { withCredentials: true }
    );
    return response;
}

export const getRpeInfo = async (teamId, date) => {
    const response = await axios.get(process.env.REACT_APP_BASE_URL + "/api/poll/getRpeInfo/" + teamId  + "/" + date, { withCredentials: true });
    return response;
}

export const getWellnessInfo = async (teamId, date) => {
    const response = await axios.get(process.env.REACT_APP_BASE_URL + "/api/poll/getWellnessInfo/" + teamId  + "/" + date, { withCredentials: true });
    return response;
}

export const getOneWeekRpe = async (userId, teamId, fromDate, toDate) => {
    const response = await axios.get(process.env.REACT_APP_BASE_URL + "/api/poll/getRpeByUser/" + userId  + "/" + teamId + "/" + fromDate  + "/" + toDate, { withCredentials: true });
    return response;
}

export const getOneWeekWellness = async (userId, teamId, fromDate, toDate) => {
    const response = await axios.get(process.env.REACT_APP_BASE_URL + "/api/poll/getWellnessByUser/" + userId  + "/" + teamId + "/" + fromDate  + "/" + toDate, { withCredentials: true });
    return response;
}

//Minuts
export const postMinuts = async (teamId, date, minuts) => {
    const response = await axios.post(process.env.REACT_APP_BASE_URL + "/api/minuts/postminuts",
    {teamId, date, minuts}, { withCredentials: true }
    );
    return response;
}

//Data
export const getActualRatio3 = async (teamId) => {
    const response = await axios.get(process.env.REACT_APP_BASE_URL + "/api/data/getActualACWR3/" + teamId, { withCredentials: true });
    return response;
}

export const getLastWeekRatio4 = async (teamId) => {
    const response = await axios.get(process.env.REACT_APP_BASE_URL + "/api/data/getACWR4/" + teamId, { withCredentials: true });
    return response;
}

export const getMI = async (teamId) => {
    const response = await axios.get(process.env.REACT_APP_BASE_URL + "/api/data/getMI/" + teamId, { withCredentials: true });
    return response;
}

export const getLastWeekMI = async (teamId) => {
    const response = await axios.get(process.env.REACT_APP_BASE_URL + "/api/data/getMILastWeek/" + teamId, { withCredentials: true });
    return response;
}

//recovery
export const recoveryPwdFunc = async (email, otp) => {
    const response = await axios.post(process.env.REACT_APP_BASE_URL + "/api/recovery",
    {email, otp}, { withCredentials: true }
    );
    return response;
}

