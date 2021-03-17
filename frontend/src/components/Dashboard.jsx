import React, {useEffect, useState} from 'react';
import useLoginStatus from '../hooks/useLoginStatus';
import {Bar, Line, Pie} from 'react-chartjs-2';
import axios from 'axios';

const Dashboard = ({history}) => {
    const token = window.localStorage.getItem('token');
    const isLoggedIn = useLoginStatus();
    const [chartName, setChartName] = useState('');
    const [labels, setLabels] = useState([{ Label: "", DataLabel: "", Data: "" }]);
    const [chartData, setChartData] = useState([]);

    const getChart = () => {
        axios.get('http://localhost:5500/get-chart')
            .then((response) => {
                const _chart = response.data.chart[0].labels;        
                for(const linie in _chart) {
                    setChartData([_chart[linie].Label]);
                    console.log(_chart[linie].Label)
                    console.log(chartData);
                }
            })
    }

    useEffect(() => {
        if(!isLoggedIn) {
            history.push('/login');
        }
        getChart();
    }, [history, isLoggedIn])

    const createChart = () => {
        axios.post("http://localhost:5500/create-table", {
            chartName: chartName,
            labels: labels,
        }).then(() => {
            window.location.reload()
        })
    }    

    const handleLabelInput = (e, index) => {
        const { name, value } = e.target;
        const list = [...labels];
        list[index][name] = value;
        setLabels(list); 
    };

    const handleRemoveClick = index => {
      const list = [...labels];
      
      list.splice(index, 1);

      setLabels(list);
    };
   
    const handleAddClick = () => {
      setLabels([...labels, { Label: "", DataLabel: "", Data: "" }]);
    };

    return (
        <div className="container">
            <div className="chart-form">
                <div className="chart-name">
                    <input 
                        type="text" 
                        name="chartName"
                        className="chart-input"
                        placeholder="Chart name"
                        onChange= {(e) => {
                            setChartName(e.target.value)
                        }}    
                    />
                </div>
                <div className="data-input">
                    <div className="label">
                        {labels.map((x, i) => {
                            return (
                            <div className="box">
                                <input
                                    name="Label"
                                    placeholder="Label"
                                    className="chart-input"
                                    value={x.label}
                                    onChange={e => handleLabelInput(e, i)}
                                /> 
                                <input
                                    key='2'
                                    name="Data"
                                    placeholder="Data"
                                    className="chart-input"
                                    value={x.data}
                                    onChange={e => handleLabelInput(e, i)}
                                /> 
                                <input
                                    key='3'
                                    name="DataLabel"
                                    placeholder="Data Label"
                                    className="chart-input"
                                    value={x.dataLabel}
                                    onChange= {e => handleLabelInput(e, i)}
                                    />
                                    {labels.length - 1 === i && <button 
                                        className="square-btn" 
                                        onClick={handleAddClick}>+</button>}
                                    {labels.length !== 1 && <button
                                        className="square-btn"
                                        onClick={() => handleRemoveClick(i)}>X</button>} 
                            </div>
                            );
                        })}
                    </div>   
                </div>
                <div className="chart">
                    <Bar
                        data={{
                            labels: [],
                            datasets: [{
                                label: '# of Votes'
                            }]
                        }}
                    />
                </div>
                <button onClick={createChart}>print labels</button>
            </div>
        </div>
    )
}

export default Dashboard;