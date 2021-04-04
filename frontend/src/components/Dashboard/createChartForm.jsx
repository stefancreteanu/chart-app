import React, {useState} from 'react';
import axios from 'axios';

const ChartForm = () => {
    const token = window.localStorage.getItem('token');
    const [labels, setLabels] = useState([{ Label: "" }]);
    const [data2, setData] = useState([{ Data: ""}]);
    const [chartName, setChartName] = useState('');
    const [dataLabel, setDataLabel] = useState('');

    const createChart = () => {
        axios.post("http://localhost:5500/user-charts", {
            headers: {
                Authorization: token
            },
            chartName: chartName,
            labels: labels,
            datasetData: data2,
            datasetLabel: dataLabel,
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
        const list = [...data2];
        list[index][name] = value;
        setData(list);
    }

    const handleRemoveClick = index => {
      const list = [...labels];
      list.splice(index, 1);
      setLabels(list);
    };
   
    const handleAddClick = () => {
      setLabels([...labels, { Label: "" }]);
      setData([...data2, { Data: "" }]);
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
                    <input
                        type="text"
                        name="DataLabel"
                        placeholder="Data Label"
                        className="chart-input"
                        onChange= {(e) => {
                            setDataLabel(e.target.value)
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
                                    onChange={e => handleDataInput(e, i)}
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
                <button onClick={createChart}>print labels</button>
            </div>
        </div>
    )
}

export default ChartForm;