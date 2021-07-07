import React, {useContext, useState} from 'react';
import ChartForm from './createChartForm';
import FetchChart from './fetchChart';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import Button from 'react-bootstrap/Button'
import { AuthContext } from '../../hooks/useLoginStatus';
import { Redirect } from 'react-router';

const Dashboard = () => {
    const [active, setActive] = useState('notactive');

    const {isLoggedIn} = useContext(AuthContext)

    return isLoggedIn ? ( 
        <div className="main">
            {active === 'notactive' && 
                <Button variant="dark" expand="lg"  onClick={() => setActive('active')} >
                    Create a new Chart
                </Button>}
            {active === 'active' && 
                <Button variant="dark" className="xbtn" onClick={() => setActive('notactive')}> 
                    <FontAwesomeIcon icon={faTimes} /> 
                </Button>}
            <div>
                {active === 'active' && <ChartForm/>}
            </div>
            <div className="chart">
                {active === 'notactive' && <FetchChart/>}  
            </div>  
        </div>     
    ): <Redirect to="login" />
}

export default Dashboard;