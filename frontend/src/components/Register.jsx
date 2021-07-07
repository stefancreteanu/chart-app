import React, { useState } from 'react';
import axios from 'axios';
import logo from "../imgs/logo.png"
import Button from "react-bootstrap/Button"

const Register = ({history}) => {
    const [FirstName, setFirstName] = useState('')
    const [LastName, setLastName] = useState('')
    const [Email, setEmail] = useState('')
    const [Password, setPassword] = useState('')
    const [username, setUsername] = useState('')
    const [Gender, setGender] = useState('')
    const [showPass, setShowPass] = useState(false);
    
    const regUser = () => {
        if(Gender === 'Male' || Gender === 'Female' || Gender === 'Other') {
            axios.post("http://localhost:5500/register", {
            firstName: FirstName,
            lastName: LastName,
            email: Email,
            password: Password,
            username: username,
            gender: Gender
            }).then((response) => {
                if(response.data.message === "Success") {
                    history.push('/login');
                }
            })
        }
    }

    const passwordVisibility = () => {
        setShowPass(showPass ? false : true);
    }

    return (
        <div className="reusable-container">
            <div className="form">
                <div className="logo">
                    <img src={logo} className="image" alt="logo" />
                </div>
                    <div className="credentials">
                        <h4 className="title">Register</h4>
                            <form className="credentials">
                                <div className="rows">
                                    <div className="st-row">
                                        <input 
                                            className="input"
                                            type="text" 
                                            placeholder="First Name*"
                                            name="firstname"    
                                            onChange = {(e) => {
                                                setFirstName(e.target.value)
                                            }}
                                            required
                                        />
                                        <input 
                                            className="input"
                                            type="text" 
                                            placeholder="Last Name*"
                                            name="lastname"    
                                            onChange = {(e) => {
                                                setLastName(e.target.value)
                                            }}
                                            required
                                        />
                                        <input 
                                                className="input" 
                                                type="text" 
                                                name="username"
                                                placeholder="Username*"
                                                onChange = {(e) => {
                                                    setUsername(e.target.value)
                                                }}
                                                required
                                            />
                                        {/* <p className="error-message">{error}</p> */}
                                    </div>
                                    <div className="nd-row">
                                        <input 
                                            className="input" 
                                            type="email" 
                                            name="email"
                                            placeholder="Email*"
                                            onChange = {(e) => {
                                                setEmail(e.target.value)
                                            }}
                                            required
                                        />
                                        <input 
                                        className="input" 
                                        type={showPass ? 'text' : 'password'}
                                        name="password"
                                        placeholder="Password*"
                                        onChange = {(e) => {
                                            setPassword(e.target.value)
                                        }}
                                        required
                                    />
                                        <select name="gender" className="input" defaultValue="Gender" onChange= {(e) => {setGender(e.target.value)}}>
                                            <option value="Gender" disabled>Gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="check-area">
                                    <input type="checkbox" onClick={passwordVisibility}/>
                                    <p>Show Password</p>
                                </div>
                                <div>
                                    <Button variant="primary" onClick={regUser}>
                                        Register
                                    </Button>
                                </div>
                            </form>         
                    </div>
            </div>    
        </div>
    )
}

export default Register;