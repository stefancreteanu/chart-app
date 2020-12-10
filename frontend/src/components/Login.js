import React from 'react';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state =  {
            logInEmail: '',
            logInPassword: ''
        }
    } 

    onEmailChange = (event) => {
        this.setState({logInEmail: event.target.value})
    }

    onPasswordChange = (event) => {
        this.setState({logInPassword: event.target.value})
    }

    onSubmitLogin = () => {
        fetch('http://localhost:5500/login', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: this.state.logInEmail,
                password: this.state.logInPassword
            })
        })
            .then(response => response.json())
            .then(user => {
                if(user.id) {
                    this.props.onRouteChange('home');
                }
            })
    }

    render() {
        const { onRouteChange } = this.props;
        return (
            <div className="main">
                <div className="logo">
                    <h1 className="logo-text">Stocks Managing App</h1>
                </div>
                <div className="form">
                    <div action="login" className="form-item">
                        <div className="login">
                            <h3>Log In</h3>
                        </div>
                        <div className="credentials">
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
                                value="Log In"
                            />
                            <input 
                                onClick={() => onRouteChange('register')} 
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

export default Login;