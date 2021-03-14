import React, {useEffect, useState} from 'react';
import useLoginStatus from '../hooks/useLoginStatus'
import axios from 'axios';
import profile_image from '../imgs/business_man.png';

const Profile = ({history}) => {
    const token = window.localStorage.getItem('token');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [gender, setGender]  = useState('');

    useEffect(() => {
        axios.get('http://localhost:5500/profile', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((response) => {
            setFirstName(response.data.firstName);
            setLastName(response.data.lastName);
            setEmail(response.data.email);
            setPhone(response.data.phone);
            setGender(response.data.gender);
        })
    })
    
    const isLoggedIn = useLoginStatus();

    useEffect(() => {
        if(!isLoggedIn) {
            history.push('/login');
        }
    })

    return (
        <div className="container">
            <div className="userCard">
                <div className="color-card">
                    <div className="profile-wrapper">
                        <img className='profile-pic' src={profile_image} alt=""/>
                        <p> Welcome to your profile, <br/>{firstName}!</p>
                    </div>
                </div>
                <div className="user-info">
                    <div className="info-title">
                        <p>Information <hr/></p>
                    </div>
                    <div className="info-boxes">
                        <p>Full name:  <hr/></p>
                        {firstName}{lastName}
                        <p>Email: <hr/></p> 
                        {email}
                        <p>Phone: <hr/></p>
                        {phone}
                        <p>Gender <hr/></p>
                        {gender}
                    </div>
                </div>
                <div className="info-card"></div>
            </div>
        </div>
    );
}

export default Profile;