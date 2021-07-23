import React, {useState, useContext} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import logo from '../imgs/logo.png'
import Button from "react-bootstrap/Button"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../hooks/useLoginStatus';
import { Redirect } from 'react-router';

const Login = () => {
    const [Email, setEmail] = useState('');
    const [Password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState('');
    const [wrongPass, setWrongPass] = useState('none');
    const [wrongEmail, setWrongEmail] = useState('none');

    const {isLoggedIn, setIsLoggedIn} = useContext(AuthContext)

    const login = () => {
        axios.post("http://localhost:5500/login", {
        email: Email,
        password: Password
        }).then((response) => {
            if(response.data.message === "Success") {
                window.localStorage.setItem('token', response.data.token); 
                setIsLoggedIn(true);  
            } else if (response.data.message === "User not found, please register.") {
                setWrongEmail('block');
                setIsLoggedIn(false);
                setError(response.data.message);
            } else if (response.data.message === "Wrong password") {
                setWrongPass('block');
                setIsLoggedIn(false);
                setError(response.data.message);
            }
            console.log(response.data.message);
        }) 
    }

    const passwordVisibility = () => {
        setShowPass(showPass ? false : true);
    }

    return !isLoggedIn ? (
        <div className="reusable-container">
            <div className="form">
                <div className="logo">
                    <img src={logo} className="image" alt="logo" />
                </div>
                    <div className="credentials">
                        <h4 className="title">Log In</h4>
                        <div className="email-pass">
                            <input 
                                className="input"
                                type="email" 
                                name="email-address"
                                placeholder="Email"
                                onChange = {(e) => {
                                    setEmail(e.target.value)
                                }}
                            />
                            <p style={{display: wrongEmail}} className="error-message">{error}</p>
                            <input 
                                className="input" 
                                name="password"
                                placeholder="Password"
                                onChange = {(e) => {
                                    setPassword(e.target.value)
                                }}
                                type={showPass ? 'text' : 'password'}
                            />
                           <div>
                                <p style={{display: wrongPass}} className="error-message">{error}</p>
                           </div>
                           <div className="change-pass">
                               <Link to="/change-password">Forgot password?</Link>
                           </div>
                        </div>
                        <div className="check-area">
                            <input type="checkbox" onClick={passwordVisibility}/>
                            <p>Show Password</p>
                        </div>
                        <div>
                            <Button variant="primary" onClick={login}>
                                Log In
                            </Button>
                        </div> 
                        <div className="register">
                            <p>Don't have an account?</p>
                            <Link to="/register">Please Register <FontAwesomeIcon icon={faArrowRight} /></Link>
                        </div>
                    </div>
            </div>
        </div>
    ): <Redirect to="/profile"/>
}

export default Login;