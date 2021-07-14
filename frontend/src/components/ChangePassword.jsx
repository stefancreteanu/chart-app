import React, { useEffect, useContext } from 'react';
import { AuthContext } from '../hooks/useLoginStatus';

const ChangePassword = ({history}) => {
    const {isLoggedIn} = useContext(AuthContext);

    useEffect(() => {
        if(!isLoggedIn) {
            history.push('/login');
        }
    }, [history, isLoggedIn]);

    return(
        <div>
            Hello
        </div>
    )
}

export default ChangePassword;