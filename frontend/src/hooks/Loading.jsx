import React, { useEffect } from 'react'
import useLoginStatus from './useLoginStatus';

const Loading = ({history}) => {
    const isLoggedIn = useLoginStatus();

    useEffect(() => {
        if(isLoggedIn) {
            history.push('/profile');
        }
    });

    return (
        <div className='container'>
            <h1>App is loading</h1>
        </div>
    )
}

export default Loading;