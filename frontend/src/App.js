import React from "react";
import './App.css';
import Login from './components/Login';
import Home from './components/Home';
import Nav from './components/Nav';
import Register from './components/Register';
import Profile from './components/Profile';
import Dashboard from './components/Dashboard/Dashboard';
import {BrowserRouter as Router, Switch, Route } from 'react-router-dom'

function App () {
  return (
    <Router>
      <div className="App">
        <Nav />
          <Switch>
            <Route path='/' exact component={Home}/>
            <Route path='/login' exact component={Login} />
            <Route path='/register' exact component={Register} />
            <Route path='/profile' exact component={Profile} />
            <Route path='/dashboard' exact component={Dashboard} />
          </Switch>
      </div>
    </Router>
  )
}

export default App;