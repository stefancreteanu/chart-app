import React, {useEffect, useState} from 'react';
import useLoginStatus from '../../hooks/useLoginStatus';
import ChartForm from './createChartForm';
import FetchChart from './fetchChart';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

const Dashboard = ({history}) => {
    const isLoggedIn = useLoginStatus();
    const [active, setActive] = useState('notactive');

    useEffect(() => {
        if(!isLoggedIn) {
            history.push('/login');
        }
    }, [history, isLoggedIn])

    return ( 
        <div className="main">
            {active === 'notactive' && <button onClick={() => setActive('active')} className="btn btn-color">Create a new Chart</button>}
            {active === 'active' && <button onClick={() => setActive('notactive')} className="xbtn btn btn-color"> <FontAwesomeIcon icon={faTimes} /> </button>}
            <div className="chart-form">
                {active === 'active' && <ChartForm/>}
            </div>
            <div className="chart">
                {active === 'notactive' && <FetchChart/>}  
            </div>  
        </div>     
    )
}

export default Dashboard;