import React, {useEffect} from 'react';
import useLoginStatus from '../hooks/useLoginStatus'

const Dashboard = ({history}) => {
    const isLoggedIn = useLoginStatus();

    useEffect(() => {
        if(!isLoggedIn) {
            history.push('/login');
        }
    })

    return (
        <div className="container">
            <p>DASHBOARD</p>
        </div>
    )
}

export default Dashboard;