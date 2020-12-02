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
        fetch('http://localhost:3000/login', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            email: this.state.logInEmail,
            password: this.state.logInPassword
        })
        })
        .then(response => response.json())
        .then(data => {
            if (data && data.success === "true") {
            this.saveAuthTokenInSessions(data.token)
            this.props.loadUser(data.user)
            this.props.onRouteChange('home');
            }
        })
        .catch(console.log)
    }

    render() {
        // const { onRouteChange } = this.props;
        return (
            <div className="main">
                <div className="logo">
                    <h1 className="logo-text">Stocks Managing App</h1>
                </div>
                <div className="form">
                    <form action="login" className="form-item">
                        <div className="container">
                            <div className="login">
                                <h3>Log In</h3>
                            </div>
                            <div className="credentials">
                                <div className="email">
                                    <input 
                                        className="input" 
                                        type="text" 
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
                                <input onClick={this.onSubmitLogin} type="submit" className="btn" value="Log In"/>
                            </div>
                        </div>
                    </form>
                </div>    
            </div>
        )
    }
}

export default Login;