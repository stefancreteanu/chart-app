import React, { useState } from 'react';
import axios from 'axios';

const Register = ({history}) => {
    const [FirstName, setFirstName] = useState('')
    const [LastName, setLastName] = useState('')
    const [Email, setEmail] = useState('')
    const [Password, setPassword] = useState('')
    const [PhoneNumber, setPhoneNumber] = useState('')
    const [Gender, setGender] = useState('')
    
    const register = () => {
        if(Gender === 'Male' || Gender === 'Female') {
            axios.post("http://localhost:5500/register", {
            firstName: FirstName,
            lastName: LastName,
            email: Email,
            password: Password,
            phone: PhoneNumber,
            gender: Gender
            }).then(() => {
                history.push('/login')        
                window.location.reload();
            })
        } else if(Gender === '' && Gender === 'Gender') {
            console.log("error");
        }
        
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
                                placeholder="First Name"
                                name="username"    
                                onChange = {(e) => {
                                    setFirstName(e.target.value)
                                }}
                            />
                        </div>
                        <div className="name">
                            <input 
                                className="input"
                                type="text" 
                                placeholder="Last Name"
                                name="username"    
                                onChange = {(e) => {
                                    setLastName(e.target.value)
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
                        <div className="phone">
                            <input 
                                    className="input" 
                                    type="text" 
                                    name="phone"
                                    placeholder="Phone number"
                                    onChange = {(e) => {
                                        setPhoneNumber(e.target.value)
                                        console.log(PhoneNumber)
                                    }}
                                />
                        </div>
                        <select name="Gender" className='drop' defaultValue="Gender" onChange= {(e) => {setGender(e.target.value); console.log(Gender)}}>
                            <option value="Gender">Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
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