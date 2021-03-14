import React from 'react';
import useLoginStatus from '../hooks/useLoginStatus';
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
            <div className="nav">
                <div>
                    <Link className='h4-logo' to='/'>
                        <h4>STOCKS</h4>
                    </Link>
                </div>
                <div className="wrapper">
                    <div className="nav-bar">
                        <nav>
                            <Link to='/'>
                                <button className="nav-btn">Home</button>    
                            </Link>
                            <Link to='/profile'>
                                <button className="nav-btn">Profile</button>    
                            </Link>
                            <Link to='/dashboard'>
                                <button className="nav-btn">My Charts</button>   
                            </Link>
                        </nav>
                    </div>
                </div>
                <Link to='/login' onClick={logout}>
                    <button className="nav-btn">Log out</button>
                </Link>
            </div>
        )
    } else {
        return (
            <div className="nav">
                <div className="nav-logo">
                    <Link className='h4-logo' to='/'>
                        <h4>STOCKS</h4>
                    </Link>
                </div>
            </div>
        )
    }
}

export default Nav;