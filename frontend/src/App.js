import React from "react";
import './App.css';
import Login from './components/Login';
import Home from './components/Home';
import Navigation from './components/Navigation';
import Register from './components/Register';
import Profile from './components/Profile';
import Dashboard from './components/Dashboard/Dashboard';
import Chat from './components/Chat';
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
              <Route path='/login' exact component={Login} />
              <Route path='/register' exact component={Register} />
              <Route path='/profile' exact component={Profile} />
              <Route path='/dashboard' exact component={Dashboard} />
              <Route path='/chat' exact component={Chat}/>
            </Switch>
        </div>
      </Router>
    </AuthContextProvider> 
  )
}

export default App;