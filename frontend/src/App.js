import React from "react";

import './App.css';

import Login from './components/Login';
import Home from './components/Home';
import Navigation from './components/Navigation';
import Register from './components/Register';
import Profile from './components/Profile';
import Dashboard from './components/Dashboard/Dashboard';
import Chat from './components/Chat';
import SharedCharts from './components/SharedCharts';
import ChangePassword from "./components/ChangePassword";

import AuthContextProvider from "./hooks/useLoginStatus";

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'


function App () {
  return (
    <AuthContextProvider>
      <Router>
        <div className="App">
          <Navigation />
            <Switch>
              <Route path='/' exact component={Home}/>
              <Route path='/login' component={Login} />
              <Route path='/register' component={Register} />
              <Route path='/change-password' component={ChangePassword}/>
              <Route path='/profile' component={Profile} />
              <Route path='/dashboard' component={Dashboard} />
              <Route path='/shared-charts' component={SharedCharts} />
              <Route path='/chat' component={Chat}/>
            </Switch>
        </div>
      </Router>
    </AuthContextProvider> 
  )
}

export default App;