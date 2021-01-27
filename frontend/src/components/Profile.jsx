import React, {useEffect, useState} from 'react';
import useLoginStatus from '../hooks/useLoginStatus'
import axios from 'axios';

const Profile = ({history}) => {
    const token = window.localStorage.getItem('token');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [joined, setJoined] = useState('');
    useEffect(() => {
        axios.get('http://localhost:5500/profile/', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((response) => {
            setUsername(response.data.username);
            setEmail(response.data.email);
            setJoined(response.data.joined);
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
            <h1>Profile </h1>
            <div className="userInfo">
                <li>Username: {username}</li>
                <li>Email: {email}</li>
                <li>Joined: {joined}</li>
            </div>
        </div>
    );
}

export default Profile;