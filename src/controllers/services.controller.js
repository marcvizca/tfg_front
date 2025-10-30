import { getUserInfo, updateUserProfile, postUserAuthByEmail, getUserLoggedOut, getRefreshToken, postSignUp, getUserByIdTeams, getTeamName, postTeam, getTeamMember, postRpeTest, postWellnessTest, getRpeInfo, getWellnessInfo, postMinuts, getOneWeekRpe, getOneWeekWellness,getActualRatio3, getLastWeekRatio4, getMI, getLastWeekMI, postMemberPendent, getMembersPendents, postMember, deleteMemberPendent, exitTeam, recoveryPwdFunc, changePassword } from '../services/services.service.js'


//User
export const getInfoProfile = async (id) => {
    const { data } = await getUserInfo(id);
    return data;
}

export const updateUser = async (name, surname, id) => {
    const { data } = await updateUserProfile(name, surname, id);
    return data;
}

//Login function
export const postUserAuth = async (email, password) => {
    const { data } = await postUserAuthByEmail(email, password)
    return data;
}

//Logout function
export const logOutUser = async () => {
    const { data } = await getUserLoggedOut();
    return data;
}

//Auth
export const postNewUser = async (email, password, name, surname) => {
    const { data } = await postSignUp(email, password, name, surname);
    return data;
}

export const newPassword = async (email, password) => {
    const { data } = await changePassword(email, password);
    return data; 
}

//Refresh Token

export const refreshToken = async() => {
    const { data } = await getRefreshToken();
    return data;
}


//Users
export const getUserTeams = async (id) => {
    const { data } = await getUserByIdTeams(id);
    return data;
}

//Teams
export const getTeamById = async (id) => {
    const { data } = await getTeamName(id);
    return data;
}

export const createTeam = async (userId, teamName, sport) => {
    const { data } = await postTeam(userId, teamName, sport);
    return data;
}

export const joinTeam = async (teamId, userId, number, position) => {
    const { data } = await postMemberPendent(teamId, userId, number, position);
    return data;
}

export const getMembersJoining = async (teamId) => {
    const { data } = await getMembersPendents(teamId);
    return data;
}
//Members
export const getMemberInfo = async (userId, teamId) => {
    const { data } = await getTeamMember(userId, teamId);
    return data;
}

export const postMemberJoinTeam = async (userId, teamId, number, position) => {
    const { data } = await postMember(userId, teamId, number, position);
    return data;
}

export const denyMemberPendent = async (userId, teamId) => {
    const { data } = await deleteMemberPendent(userId, teamId);
    return data;
}

export const exitTeamMember = async (userId, teamId) => {
    const { data } = await exitTeam(userId, teamId);
    return data;
}

//Polls
export const postRpe = async(userId, teamId, rpe) => {
    const { data } = await postRpeTest(userId, teamId, rpe);
    return data;
}

export const postWellness = async(userId, teamId, answers) => {
    const { data } = await postWellnessTest(userId, teamId, answers);
    return data;
}

export const getRpeInfoByDate = async(teamId, date) => {
    const { data } = await getRpeInfo(teamId, date);
    return data || [];
}

export const getWellnessInfoByDate = async (teamId, date) => {
    const { data } = await getWellnessInfo(teamId, date);
    return data || [];
}

export const getRpeByUser = async (userId, teamId, fromDate, toDate) => {
    const { data } = await getOneWeekRpe(userId, teamId, fromDate, toDate);
    return data || [];
}

export const getWellnessByUser = async (userId, teamId, fromDate, toDate) => {
    const { data } = await getOneWeekWellness(userId, teamId, fromDate, toDate);
    return data || [];
}

//Minuts
export const registerMinuts = async(teamId, date, minuts) => {
    const { data } = await postMinuts(teamId, date, minuts);
    return data;
}

//Data
export const getActualACWR3 = async(teamId) => {
    const { data } = await getActualRatio3(teamId);
    return data || [];
}

export const getLastWeekACWR4 = async(teamId) => {
    const { data } = await getLastWeekRatio4(teamId);
    return data || [];
}

export const getTeamMI = async (teamId) => {
    const { data } = await getMI(teamId);
    return data || [];
}

export const getTeamLastWeekMI = async (teamId) => {
    const { data } = await getLastWeekMI(teamId);
    return data || [];
}

//recovery
export const postRecoveryPwd = async (email, otp) => {
    const { data } = await recoveryPwdFunc(email, otp);
    return data;
}