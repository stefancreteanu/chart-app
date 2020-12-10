import React, { Component } from "react";
import './App.css';
import Login from './components/Login';
import Home from './components/Home';
import Nav from './components/Nav';
import Register from './components/Register';
import Profile from './components/Profile';

const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'login',
  isLoggedIn: false
}
class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      joined: data.joined
    }})
  }

  onRouteChange = (route) => {
    if(route === 'login') {
      this.setState(initialState)
    } else if(route === 'home') {
      this.setState({isLoggedIn: true})
    }
    this.setState({route: route});
  }

  render() {
    return(
      <div className="App">
        <Nav isLoggedIn={this.state.isLoggedIn} onRouteChange={this.onRouteChange}/>
        { this.state.route === 'home' 
          ? <div>
              <Home />
              <Profile />
            </div>
          : (
              this.state.route === 'login'
              ? <Login onRouteChange={this.onRouteChange} />
              : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
            )
          // : (
          //     this.state.route === 'profile'
          //     ? <Profile onRouteChange={this.onRouteChange} />
          //     : <Login onRouteChange={this.onRouteChange} />
          //   )
        }
      </div>
    )
  }
}

export default App;