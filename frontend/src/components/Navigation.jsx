import React, {useContext} from 'react';
import {Link} from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import smallLogoTwo from '../imgs/logo_sm_2.png'
import { useMediaPredicate } from 'react-media-hook'
import { AuthContext } from '../hooks/useLoginStatus';

const Navigation = () => {    
    const {isLoggedIn, setIsLoggedIn} = useContext(AuthContext);

    const logout = () => {
        window.localStorage.removeItem('token');
        setIsLoggedIn(false);
    }

    const smallerThan767 = useMediaPredicate("(max-width: 767px)")
    const biggerThan768 = useMediaPredicate("(min-width: 768px)")

    const ChartApp = "Chart App"

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
                        <Nav className="mr-auto">
                            <Link className="nav-link" to="/">Home</Link>
                            <Link className="nav-link" to="/profile">Profile</Link>
                            <Link className="nav-link" to="/dashboard">My Charts</Link>
                            <Link className="nav-link" to="/chat">Chat</Link>
                        </Nav>
                        <Nav>
                            <Link className="nav-link" to='/login' onClick={logout}>Log out</Link>
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
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </div>
        )
    }
}

export default Navigation;