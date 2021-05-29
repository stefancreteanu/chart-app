import React, {useEffect, useState} from 'react';
import useLoginStatus from '../hooks/useLoginStatus'
import axios from 'axios';
import profile_image from '../imgs/business_man.png';

const Profile = ({history}) => {
    const token = window.localStorage.getItem('token');
    const [user, setUser] = useState('');
    const isLoggedIn = useLoginStatus();

    useEffect(() => {
        axios.get('http://localhost:5500/profile', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((response) => {
            setUser(response.data);
        })

        if(!isLoggedIn) {
            history.push('/login');
        }
    }, [history, isLoggedIn, token, user])

    return (
        <div className="container">
            <div className="userCard">
                <div className="color-card">
                    <div className="profile-wrapper">
                        <img className='profile-pic' src={profile_image} alt=""/>
                        <p> Welcome to your profile, <br/>{user.firstName}!</p>
                    </div>
                </div>
                <div className="user-info">
                    <div className="info-title">
                        <p>Information <hr/></p>
                    </div>
                    <div className="info-boxes">
                        <p>Full name:  <hr/></p>
                        {user.firstName} {user.lastName}
                        <p>Email: <hr/></p> 
                        {user.email}
                        <p>Phone: <hr/></p>
                        {user.phone}
                        <p>Gender <hr/></p>
                        {user.gender}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;