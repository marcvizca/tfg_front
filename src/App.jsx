import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Wellness from './views/polls/Wellness.jsx';
import Signin from './views/auth/Signin.jsx';
import Signup from './views/auth/Signup.jsx';
import Signout from './views/auth/Signout.jsx';
import RecoveryPwd from './views/auth/RecoveryPwd.jsx';
import InsertOtp from './views/auth/InsertOtp.jsx';
import Profile from './views/profile/UserProfile.jsx';
import ResetPwd from './views/auth/ResetPwd.jsx';
import CreateTeam from './views/teams/CreateTeam.jsx';
import TeamsSelector from './views/teams/TeamsSelector.jsx';
import Header from './components/Header.jsx';
import Team from './views/teams/Team.jsx';
import Rpe from './views/polls/Rpe.jsx';
import TeamData from './views/teams/team/TeamData.jsx';
import UserData from './views/teams/team/UserData.jsx';
import JoinTeam from './views/teams/JoinTeam.jsx';
import RequireAuth from './components/requireAuth.js';
import PersistLogin from './views/auth/PersistLogin.js';
import {HeaderTemplate} from './components/Template.jsx';
import Header2 from './components/Header2.jsx';

function App() { 
  return (
    <div>
      
      <Routes>
          <Route path='/' exact element = { <><Header2 /><Signin /></> } />
          <Route path='logout' exact element = { <><Header2 /><Signout /></> } />
          <Route path='signup' exact element = { <><Header2 /><Signup /></> } />
          <Route path='recoverypwd' element = { <><Header2 /><RecoveryPwd /></> } />
          <Route path='recoverypwd/insertotp' element = {<><Header2 /><InsertOtp /></>} />
          <Route path='newpassword' element = { <><Header2 /><ResetPwd /></> } />

          <Route element={<PersistLogin />} >
          <Route element = { <RequireAuth /> } >
          <Route path='' element={<HeaderTemplate /> }>
            <Route path='profile' exactm element = {<Profile />} />
            <Route path='teams' exact element = {<TeamsSelector /> } />
            <Route path='createteam' exact element = { < CreateTeam /> } />
            <Route path='jointeam' exact element = { <JoinTeam /> } />
            <Route path='team/:teamId' exact element = {<Team /> } />
            <Route path='team/:teamId/wellness' exact element = {<Wellness /> } />
            <Route path='team/:teamId/rpe' exact element = {<Rpe /> } />
            <Route path='team/:teamId/data' exact element = {<TeamData /> } />
            <Route path='team/:teamId/data/userData/:playerId' exact element = {<UserData /> } />
          </Route>
          </Route>
          </Route> 
      </Routes>
      </div>
      
  );
}

export default App;
