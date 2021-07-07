import React, {useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../hooks/useLoginStatus';

const Profile = ({history}) => {
    const token = window.localStorage.getItem('token');
    const [user, setUser] = useState('');
    const {isLoggedIn} = useContext(AuthContext);
    const [file, setFile] = useState([]);

    const onChangeHandler = (e) => {
        setFile(e.target.files[0]);
    }

    const onClickHandler = () => {
        const data = new FormData();
        data.append('file', file);
        axios.post('http://localhost:5500/upload', data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    }

    useEffect(() => {
        const ac = new AbortController();  

        const getUser = () => {
            axios.get('http://localhost:5500/profile', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then((response) => {
                setUser(response.data);
            })
        }
    
        getUser();

        if(!isLoggedIn) {
            history.push('/login');
        }
        return () => ac.abort();
    }, [history, isLoggedIn, token, user])

    return (
        <div className="reusable-container">
            <div className="userCard">
                <div className="color-card">
                    <div className="profile-wrapper">
                        <label htmlFor="file_input"><img className='profile-pic' src={`http://localhost:5500/image/${user.id}/${user.filename}`} alt=""/></label>
                        <input 
                            type="file" 
                            id="file_input" 
                            accept="image/png, image/jpeg, image/jpg"
                            name="profile_pic"
                            onChange={onChangeHandler}
                        />
                        <button onClick={onClickHandler}>Upload photo</button>
                        <p> Welcome to your profile, <br/>{user.firstName}!</p>
                    </div>
                </div>
                <div className="user-info">
                    <div className="info-title">
                        <p>Information</p><hr/>
                    </div>
                    <div className="info-boxes">
                        <p>Username: </p>
                        {user.username}
                        <p>Full name: </p>
                        {user.firstName} {user.lastName}
                        <p>Email: </p>
                        {user.email}
                        <p>Gender: </p>
                        {user.gender}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;

// action="/upload" method="POST" encType="multipart/form-data"