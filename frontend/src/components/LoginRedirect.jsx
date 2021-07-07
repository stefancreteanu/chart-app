import React from 'react'
import Button from 'react-bootstrap/Button'
import { Link } from 'react-router-dom';
import useLoginStatus from '../hooks/useLoginStatus';
import Home from './Home'

const LoginRedirect = () => {
    const isLoggedIn = useLoginStatus()

    if(!isLoggedIn) {
        return (
            <div className="redirect">
                <div className="redirect-register">
                    <h3>To experience the full capability of this application, please consider registering!</h3>
                    <Link to="/register"><Button variant="danger">Register</Button></Link>
                </div>
                <div className="redirect-login">
                    <h4>If you already have an account, please Log In.</h4>
                    <Link to="/login"><Button variant="Success">Log In</Button></Link>
                </div>
            </div>
        )
    } else {
        return (
            <Home/>
        )
    }
}

export default LoginRedirect