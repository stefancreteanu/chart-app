import React, {useEffect} from 'react';
import useLoginStatus from '../hooks/useLoginStatus'

const Home = ({history}) => {
    const isLoggedIn = useLoginStatus();

    useEffect(() => { if(!isLoggedIn) { history.push('/login') } })
    
    return(
        <div className="container">
            <h1>homepage</h1>
        </div>
    );
}

export default Home;