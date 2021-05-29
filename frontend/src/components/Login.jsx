import React, {useState, useEffect} from 'react';
import axios from 'axios';
import useLoginStatus from '../hooks/useLoginStatus'
import { Link } from 'react-router-dom';


const Login = ({history}) => {
    const [Email, setEmail] = useState('')
    const [Password, setPassword] = useState('')
    const [showPass, setShowPass] = useState(false);
    const login = () => {
        axios.post("http://localhost:5500/login", {
        email: Email,
        password: Password
        }).then((response) => {
            window.localStorage.setItem('token', response.data.token);      
            window.location.reload();
        }) 
    }

    const isLoggedIn = useLoginStatus();

    useEffect(() => {
        if(isLoggedIn) {
            history.push('/profile');
        }
    }, [history, isLoggedIn])

    const passwordVisibility = () => {
        setShowPass(showPass ? false : true);
    }

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
                                onChange = {(e) => {
                                    setEmail(e.target.value)
                                }}
                            />
                        </div>
                        <div className="pass">
                            <input 
                                className="input" 
                                name="password"
                                placeholder="Password"
                                onChange = {(e) => {
                                    setPassword(e.target.value)
                                }}
                                type={showPass ? 'text' : 'password'}
                            />
                        </div>
                    </div>
                    <div className="check-area">
                        <input type="checkbox" onClick={passwordVisibility}/>
                        <p>Show Password</p>
                    </div>
                    <div className="buttons">
                        <input 
                            onClick={login}
                            type="submit" 
                            className="no-margin btn btn-color" 
                            value="Log In"
                        />
                        <Link to='/register'>
                            <input 
                                type="submit" 
                                className="no-margin btn btn-color" 
                                value="Register"
                            />
                        </Link>
                    </div>
                </div>
            </div>    
        </div>
    )
}

export default Login;