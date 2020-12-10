import React from 'react';

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state =  {
            email: '',
            password: '',
            name: ''
        }
    } 

    onNameChange = (event) => {
        this.setState({name: event.target.value})
    }

    onEmailChange = (event) => {
        this.setState({email: event.target.value})
    }

    onPasswordChange = (event) => {
        this.setState({password: event.target.value})
    }

    onSubmitLogin = () => {
        fetch('http://localhost:5500/register', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password,
                name: this.state.name
            })
        })
            .then(response => response.json())
            .then(user => {
                if(user.id) {
                    this.props.loadUser(user);
                    this.props.onRouteChange('home');
                }
            })
    }

    render() {
        return (
            <div className="main">
                <div className="logo">
                    <h1 className="logo-text">Stocks Managing App</h1>
                </div>
                <div className="form">
                    <div className="form-item">
                        <div className="login">
                            <h3>Register</h3>
                        </div>
                        <div className="credentials">
                            <div className="name">
                                <input 
                                    className="input"
                                    type="text" 
                                    placeholder="Username"
                                    name="username"    
                                    onChange={this.onNameChange}
                                />
                            </div>
                            <div className="email">
                                <input 
                                    className="input" 
                                    type="email" 
                                    name="email-address"
                                    placeholder="Email"
                                    onChange={this.onEmailChange}
                                />
                            </div>
                            <div className="pass">
                                <input 
                                    className="input" 
                                    type="password" 
                                    name="password"
                                    placeholder="Password"
                                    onChange={this.onPasswordChange}
                                />
                            </div>
                        </div>
                        <div className="check-area">
                            <input type="checkbox"/>
                            <p>Show Password</p>
                        </div>
                        <div className="buttons">
                            <input 
                                onClick={this.onSubmitLogin} 
                                type="submit" 
                                className="btn" 
                                value="Register"
                            />
                        </div>
                    </div>
                </div>    
            </div>
        )
    }
}

export default Register;