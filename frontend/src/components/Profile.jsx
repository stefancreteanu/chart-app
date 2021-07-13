import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../hooks/useLoginStatus';
import male_placeholder from '../imgs/male_placeholder.png';
import female_placeholder from '../imgs/female_placeholder.png';
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrashAlt, faImages } from '@fortawesome/free-solid-svg-icons'

const Profile = ({history}) => {
    const token = window.localStorage.getItem('token');
    const [user, setUser] = useState('');
    const {isLoggedIn} = useContext(AuthContext);
    const [file, setFile] = useState([]);
    const [avatar, setAvatar] = useState('');

    const [isDisplayed, setIsDisplayed] = useState('none');

    const [nameInputDisplayed, setNameInputDisplayed] = useState('none');
    const [nameDisplayed, setNameDisplayed] = useState('block');

    const [usernameInputDisplayed, setUsernameInputDisplayed] = useState('none');
    const [usernameDisplayed, setUsernameDisplayed] = useState('block');

    const [emailInputDisplayed, setEmailInputDisplayed] = useState('none');
    const [emailDisplayed, setEmailDisplayed] = useState('block');

    const [picSettingsDisplayed, setPicSettingsDisplayed] = useState('none');

    const [username, setUsername] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
 
    const onChangeHandler = (e) => {
        setFile(e.target.files[0]);
        setIsDisplayed('block');
    }

    const onClickHandler = () => {
        const data = new FormData();
        data.append('file', file);
        axios.post('http://localhost:5500/upload', data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(() => {
            window.location.reload();
        })
    }

    const changeUsername = () => {
        setUsernameInputDisplayed('block');
        setUsernameDisplayed('none');
    }

    const changeName = () => {
        setNameInputDisplayed('block');
        setNameDisplayed('none');
    }

    const changeEmail = () => {
        setEmailInputDisplayed('block');
        setEmailDisplayed('none');
    }

    const saveUsername = () => {
        axios.post('http://localhost:5500/change-username', {
            headers: {
                Authorization: token
            },
            username: username
        }).then((response) => {
           if(response.data.message === 'success' ) {
               window.location.reload();
           }
        })
    }

    const saveName = () => {
        axios.post('http://localhost:5500/change-name', {
            headers: {
                Authorization: token
            },
            firstname: firstname,
            lastname: lastname
        }).then((response) => {
           if(response.data.message === 'success' ) {
               window.location.reload();
           }
        })
    }

    const saveEmail = () => {
        axios.post('http://localhost:5500/change-email', {
            headers: {
                Authorization: token
            },
            email: email
        }).then((response) => {
           if(response.data.message === 'success' ) {
               window.location.reload();
           }
        })
    }

    const displaySettings = () => {
        if(picSettingsDisplayed === 'none') {
            setPicSettingsDisplayed('block');
        } else {
            setPicSettingsDisplayed('none');
        }
    }

    const deleteProfilePicture = () => {
        axios.post('http://localhost:5500/delete-picture', {
            headers: {
                Authorization: token
            },
            avatar: avatar
        })
        window.location.reload();
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
                if(response.data.gender === 'Male' && response.data.fileName === '') {
                    setAvatar(`${male_placeholder}`)
                } else if (response.data.gender === 'Female' && response.data.fileName === '') {
                    setAvatar(`${female_placeholder}`);
                } else {
                    setAvatar(`http://localhost:5500/uploads/${response.data.id}/${response.data.fileName}`);
                }
            })
        }

        getUser();

        if(!isLoggedIn) {
            history.push('/login');
        }
        return () => ac.abort();
    }, [history, isLoggedIn, token])

    return (
        <div className="reusable-container">
            <div className="userCard">
                <div className="color-card">
                    <div className="profile-wrapper">
                        <label onClick={displaySettings}>
                            <img className='profile-pic' src={avatar} alt="profile_image"/>
                        </label>
                        <div className="profile-pic-settings" style={{display: `${picSettingsDisplayed}`}}>
                            <div>
                                <div className="setting">
                                    <label htmlFor="file_input"><p><FontAwesomeIcon icon={faImages} /> Choose a new picture</p></label>
                                    <input 
                                        type="file"
                                        id="file_input"                            
                                        accept="image/png, image/jpeg, image/jpg"
                                        name="profile_pic"
                                        onChange={onChangeHandler}
                                    />
                                </div>
                                <div className="setting" onClick={deleteProfilePicture}>
                                    <p><FontAwesomeIcon icon={faTrashAlt} /> Delete profile picture</p>
                                </div>
                            </div>
                        </div>
                        <Button variant="dark" style={{display: `${isDisplayed}`}} className="profile-pic-settings myBtn" onClick={onClickHandler}>Upload photo</Button>
                        <p className="welcome-p"> Welcome to your profile, <br/>{user.firstName}!</p>
                    </div>
                </div>
                <div className="user-info">
                    <div className="info-title">
                        <p>Information</p><hr/>
                    </div>
                    <div className="info-boxes">
                        <p className="titles">Username: </p>
                            <div className="fa-Icon">
                                <p style={{display: `${usernameDisplayed}`}} className="text">{user.username}</p> 
                                <input required style={{display: `${usernameInputDisplayed}`}} onChange={(e) => {setUsername(e.target.value)}} className="chart-input" type="text" name="user_name" />
                                <FontAwesomeIcon onClick={changeUsername} className="edit-icon" icon={faEdit} />
                                <Button onClick={saveUsername} style={{display: `${usernameInputDisplayed}`}} className="changes-btn" variant="success">Save changes</Button>
                            </div>
                        <p className="titles">Full name: </p>
                            <div className="fa-Icon">
                                <p style={{display: `${nameDisplayed}`}} className="text">{user.firstName} {user.lastName}</p>
                                <input required style={{display: `${nameInputDisplayed}`}} onChange={(e) => {setFirstname(e.target.value)}} className="chart-input" type="text" name="first_name" />
                                <input required style={{display: `${nameInputDisplayed}`}} onChange={(e) => {setLastname(e.target.value)}} className="chart-input" type="text" name="last_name" /> 
                                <FontAwesomeIcon onClick={changeName} className="edit-icon" icon={faEdit} />
                                <Button onClick={saveName} style={{display: `${nameInputDisplayed}`}} className="changes-btn" variant="success">Save changes</Button>
                            </div>
                        <p className="titles">Email: </p>
                            <div className="fa-Icon">
                                <p style={{display: `${emailDisplayed}`}} className="text">{user.email}</p>
                                <input required style={{display: `${emailInputDisplayed}`}} onChange={(e) => {setEmail(e.target.value)}} className="chart-input" type="text" name="email" />
                                <FontAwesomeIcon onClick={changeEmail} className="edit-icon" icon={faEdit} />
                                <Button onClick={saveEmail} style={{display: `${emailInputDisplayed}`}} className="changes-btn" variant="success">Save changes</Button>
                            </div>
                        <p className="titles">Gender: </p>
                        <div> 
                            <p className="text">{user.gender}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;