import React from 'react';
import useLoginStatus from '../hooks/useLoginStatus'
import {Link} from 'react-router-dom';

const Nav = () => {
    const isLoggedIn = useLoginStatus();

    const logout = () => {
        window.localStorage.removeItem('token');
        window.location.reload();
        console.log(isLoggedIn);
    }

    if(isLoggedIn) {
        return (
            <nav>
                <Link to='/'>
                    <input
                        type="submit"
                        value="Home"
                        className="nav-btn"    
                    />
                </Link>
                <Link to='/profile'>
                    <input
                        type="submit"
                        value="Profile"
                        className="nav-btn"    
                    />
                </Link>
                <Link to='/dashboard'>
                    <input
                        type="submit"
                        value="Dashboard"
                        className="nav-btn"    
                    />
                </Link>
                <Link to='/login' onClick={logout}>
                    <input 
                        type="submit"
                        value="Log out"
                        className="nav-btn"
                    />
                </Link>
            </nav>
        )
    } else {
        return (
            <nav>
                <Link to='/'>
                    <input
                        type="submit"
                        value="Home"
                        className="nav-btn"    
                    />
                </Link>
                <Link to='/profile'>
                    <input
                        type="submit"
                        value="Profile"
                        className="nav-btn"    
                    />
                </Link>
                <Link to='/dashboard'>
                    <input
                        type="submit"
                        value="Dashboard"
                        className="nav-btn"    
                    />
                </Link>
            </nav>
        )
    }
}

export default Nav;