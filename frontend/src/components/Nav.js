import React from 'react';

const Nav = ({onRouteChange, isLoggedIn}) => {
    if(isLoggedIn) {
        return (
            <nav>
                <input
                    onClick={() => onRouteChange('login')}
                    type="submit"
                    value="Log out"
                    className="nav-btn"    
                />
                <input
                    onClick={() => onRouteChange('profile')}
                    type="submit"
                    value="Profile"
                    className="nav-btn"    
                />
            </nav>
        )
    } else {
        return(
            <nav style={{display: 'flex', justifyContent: 'flex-start'}}>
                <input
                    onClick={() => onRouteChange('login')}
                    type="submit"
                    value="Log in"
                    className="nav-btn"    
                />
                <input
                    onClick={() => onRouteChange('register')}
                    type="submit"
                    value="Register"
                    className="nav-btn"    
                />
            </nav>
        )
    }
}

export default Nav;