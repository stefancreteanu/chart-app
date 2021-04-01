import React, {useEffect, useState} from 'react';
import useLoginStatus from '../../hooks/useLoginStatus';
import ChartForm from './createChartForm';
import FetchChart from './fetchChart';

const Dashboard = ({history}) => {
    const isLoggedIn = useLoginStatus();

    useEffect(() => {
        if(!isLoggedIn) {
            history.push('/login');
        }
    }, [history, isLoggedIn])

    return ( 
        <div className="chart-form">
            <ChartForm/>
            <div className="chart">
                <FetchChart/>  
            </div>  
        </div>     
    )
}

export default Dashboard;