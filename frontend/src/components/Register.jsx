import React, { useState } from 'react';
import axios from 'axios';

const Register = ({history}) => {
    const [Name, setName] = useState('')
    const [Email, setEmail] = useState('')
    const [Password, setPassword] = useState('')
    
    const register = () => {
        axios.post("http://localhost:5500/register", {
        name: Name,
        email: Email,
        password: Password
        }).then((response) => {
            history.push('/login')        
            window.location.reload();
            console.log(response);
        }) 
    }
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
                                onChange = {(e) => {
                                    setName(e.target.value)
                                }}
                            />
                        </div>
                        <div className="email">
                            <input 
                                className="input" 
                                type="email" 
                                name="email-address"
                                placeholder="Email"
                                onChange = {(e) => {
                                    setEmail(e.target.value)
                                }}
                            />
                        </div>
                        <div className="pass">
                            <input 
                                className="input" 
                                type="password" 
                                name="password"
                                placeholder="Password"
                                onChange = {(e) => {
                                    setPassword(e.target.value)
                                }}
                            />
                        </div>
                    </div>
                    <div className="check-area">
                        <input type="checkbox"/>
                        <p>Show Password</p>
                    </div>
                    <div className="buttons">
                        <input 
                            onClick={register} 
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

export default Register;