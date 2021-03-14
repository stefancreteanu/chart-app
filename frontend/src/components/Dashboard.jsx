import React, {useEffect, useState} from 'react';
import useLoginStatus from '../hooks/useLoginStatus';
import {Bar, Line, Pie} from 'react-chartjs-2';
import axios from 'axios';

const Dashboard = ({history}) => {
    const token = window.localStorage.getItem('token');
    const isLoggedIn = useLoginStatus();
    const [chartName, setChartName] = useState('');
    const [labels, setLabels] = useState([{ Label: "" }]);
    const [dataLabel, setDataLabel] = useState([{ DataLabel: "" }]);
    const [data, setData] = useState([{ Data: "" }]);

    useEffect(() => {
        if(!isLoggedIn) {
            history.push('/login');
        }
    })

    const createChart = () => {
        axios.post("http://localhost:5500/create-table", {
            chartName: chartName,
            labels: labels,
            dataLabel: dataLabel,
            data: data
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

    const handleDataInput = (e, index) => {
        const { name, value } = e.target;
        const list = [...data];
        list[index][name] = value;
        setData(list);
    }
   
    const handleDataLabelInput = (e, index) => {
        const { name, value } = e.target;
        const list = [...dataLabel];
        list[index][name] = value;
        setDataLabel(list);
    }

    const handleRemoveClick = index => {
      const list = [...labels];
      const dataList = [...data];
      const dataLabelList = [...dataLabel];
      
      list.splice(index, 1);
      dataList.splice(index, 1);
      dataLabelList.splice(index, 1);

      setLabels(list);
      setData(dataList);
      setDataLabel(dataLabelList);
    };
   
    const handleAddClick = () => {
      setLabels([...labels, { Label: "" }]);
      setData([...data, { Data: "" }]);
      setDataLabel([...dataLabel, { DataLabel: "" }]);
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
                            </div>
                            );
                        })}
                    </div>
                    <div className="data">
                        {data.map((x, i) => {
                            return (
                                <div className="box">
                                    <input
                                    name="Data"
                                    placeholder="Data"
                                    className="chart-input"
                                    value={x.data}
                                    onChange={e => handleDataInput(e, i)}
                                    />    
                                </div>
                            );
                        })}
                    </div>
                    <div className="data-label">
                        {dataLabel.map((x, i) => {
                            return (
                                <div className="box">
                                    <input
                                    name="DataLabel"
                                    placeholder="Data Label"
                                    className="chart-input"
                                    value={x.dataLabel}
                                    onChange= {e => handleDataLabelInput(e, i)}
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
                {/* chart-ul asta e doar sa vad cum arata */}
                {/* <Bar 
                    data={{
                        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                        datasets: [{
                            label: '# of Votes',
                            data: [12, 19, 3, 5, 8, 3],
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(255, 159, 64, 0.2)'
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)'
                            ],
                            borderWidth: 1
                        }]
                    }}
                /> */}
                <button onClick={createChart}>print labels</button>
            </div>
        </div>
    )
}

export default Dashboard;