import React from "react";
import './App.css';
import Login from './components/Login';
// import Home from './components/Home';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

const App = () => {
  return (
    <Router>
      <div>
        <Switch>
          <Route path='/login' exact component={Login} />
          {/* <Route path='/' component={Home} /> */}
        </Switch>
      </div>
    </Router>
  )
}
export default App;