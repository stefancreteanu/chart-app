import React, {useContext, useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import smallLogoTwo from '../imgs/logo_sm_2.png'
import { useMediaPredicate } from 'react-media-hook'
import { AuthContext } from '../hooks/useLoginStatus';
import axios from 'axios';
import male_placeholder from '../imgs/male_placeholder.png';
import female_placeholder from '../imgs/female_placeholder.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faSignOutAlt, faComments, faHome, faChartBar } from '@fortawesome/free-solid-svg-icons';
import NavDropdown from 'react-bootstrap/NavDropdown';

const Navigation = () => {    
    const {isLoggedIn, setIsLoggedIn} = useContext(AuthContext);
    const token = window.localStorage.getItem('token');
    const [avatar, setAvatar] = useState('');
    const [firstName, setFirstName] = useState('');

    const logout = () => {
        window.localStorage.removeItem('token');
        setIsLoggedIn(false);
    }

    const smallerThan767 = useMediaPredicate("(max-width: 767px)")
    const biggerThan768 = useMediaPredicate("(min-width: 768px)")

    const ChartApp = "Chart App"

    useEffect(() => {
        const getUser = () => {
            axios.get('http://localhost:5500/profile', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then((response) => {
                setFirstName(response.data.firstName);
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
    }, [token]);

    if(isLoggedIn) {
        return (
            <div>   
                <Navbar bg="dark" variant="dark" expand="lg">
                    <Navbar.Brand className="color-text" href="/">
                        { biggerThan768 && ChartApp }
                        { smallerThan767 && <img src={smallLogoTwo} className="small-logo" alt="logo" /> }
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto"></Nav>
                        <Nav className="mr-auto">
                            <div className="item bg">
                                <Link className="nav-link" to="/">
                                    <FontAwesomeIcon className="icon big" icon={faHome} />
                                </Link>                              
                            </div>
                            <div className="item bg">
                                <Link className="nav-link" to="/chat">
                                    <FontAwesomeIcon className="icon big" icon={faComments} />
                                </Link>
                            </div>
                            <div className="item bg">
                                <Link className="nav-link" to="/shared-charts">
                                    <FontAwesomeIcon className="icon big" icon={faChartBar} />
                                </Link>
                            </div>
                        </Nav>
                        <Nav>
                            <Link className="nav-link profile-link" to="/profile">
                                <img className='nav-profile-pic' src={avatar} alt="profile_image"/>
                                <p className="nav-link">{firstName}</p>
                            </Link>
                            <NavDropdown align="end" menuVariant="dark">
                                    <div className="item">
                                        <FontAwesomeIcon className="icon" icon={faChartLine} />
                                        <Link className="nav-link" to="/dashboard">My Charts</Link>
                                    </div>
                                <NavDropdown.Divider />
                                    <div className="item">
                                        <FontAwesomeIcon className="icon" icon={faSignOutAlt} />
                                        <Link className="nav-link" to='/login' onClick={logout}>Log out</Link>
                                    </div>
                            </NavDropdown>                            
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </div>
        )
    } else {
        return (
            <div>
                <Navbar bg="dark" variant="dark">
                    <Navbar.Brand className="color-text" href="/">
                        { biggerThan768 && ChartApp }
                        { smallerThan767 && <img src={smallLogoTwo} className="small-logo" alt="logo" /> }
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse>
                        <Nav>
                            <Link className="nav-link" to='/login'>Log In</Link>
                            <Link className="nav-link" to='/register'>Register</Link>
                            <Link className="nav-link" to='/shared-charts'>Shared Charts</Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </div>
        )
    }
}

export default Navigation;