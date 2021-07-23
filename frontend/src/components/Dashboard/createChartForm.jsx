import React, {useState} from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons'
import Button from 'react-bootstrap/Button'

const ChartForm = () => {
    const token = window.localStorage.getItem('token');
    const [labels, setLabels] = useState([{ Label: "" }]);
    const [data2, setData] = useState([{ Data: "" }]);
    const [color, setColor] = useState([{ Color: "" }]);
    const [dataLabel, setDataLabel] = useState("");
    const [title, setTitle] = useState('');
    const [chartType, setChartType] = useState('');
    const formActive = true;

    const createChart = () => {
        axios.post("http://localhost:5500/create-charts", {
            headers: {
                Authorization: token
            },
            labels: labels,
            datasetData: data2,
            datasetLabel: dataLabel,
            color: color,
            title: title,
            chartType: chartType
        })
        window.location.reload();
    }   

    const handleLabelInput = (e, index) => {
        const { name, value } = e.target;
        const list = [...labels];
        list[index][name] = value;
        setLabels(list); 
    }

    const handleDataInput = (e, index) => {
        const { name, value } = e.target;
        const list = [...data2];
        list[index][name] = value;
        setData(list);
    }

    const handleColorInput = (e, index) => {
        const {name, value} = e.target;
        const list = [...color];
        list[index][name] = value;
        setColor(list);
    }

    const handleRemoveClick = index => {
      const list = [...labels];
      list.splice(index, 1);
      setLabels(list);
    };
   
    const handleAddClick = () => {
      setLabels([...labels, { Label: "" }]);
      setData([...data2, { Data: "" }]);
      setColor([...color, { Color: "" }])
    };   

    if (chartType === "Line" || chartType === "Bar") {
        return (
            <div className="chart-form">
                <div>Chart type: {chartType}</div>
                <div className="chart-title">
                    <input
                        type="text"
                        name="Title"
                        placeholder="Title"
                        className="chart-input"
                        onChange= {(e) => {
                            setTitle(e.target.value)
                        }}
                    />
                </div>
                <div className="chart-datasets">
                    <input
                    type="text"
                    name="DataLabel"
                    placeholder="Dataset Label"
                    className="chart-input"
                    onChange= {(e) => { setDataLabel(e.target.value)} }
                    />
                </div>
                <div className="label-container">
                    {labels.map((x, i) => {
                        return (
                            <div className="chart-data">
                                <div className="inputs">
                                    <input
                                        name="Label"
                                        placeholder="Label"
                                        className="chart-input"
                                        value={x.label}
                                        onChange={e => handleLabelInput(e, i)}
                                    /> 
                                    <input
                                        name="Data"
                                        placeholder="Data"
                                        className="chart-input"
                                        value={x.data}
                                        onChange={e => handleDataInput(e, i)}
                                    />
                                    <input 
                                        type="color" 
                                        name="Color"
                                        className="color-input"
                                        value={x.color}
                                        onChange={e => handleColorInput(e, i)}
                                    /> 
                                </div>
                                <div className="chart-buttons">
                                    {labels.length - 1 === i && <button 
                                            className="plus round-btn" 
                                            onClick={handleAddClick}> <FontAwesomeIcon icon={faPlus} /> </button>}
                                    {labels.length > 1 && <button
                                            className="minus round-btn"
                                            onClick={() => handleRemoveClick(i)}> <FontAwesomeIcon icon={faTimes} /> </button>}
                                </div>
                            </div>
                        );
                    })}
                </div>
                <Button variant="dark" className="button" onClick={createChart}>Create the chart</Button>
            </div>
        )
    } else if (chartType === "Pie" || chartType === "Doughnut") {
        return (
            <div className="chart-form">
                <div>Chart type: {chartType}</div>
                <div className="chart-title">
                    <input
                        type="text"
                        name="Title"
                        placeholder="Title"
                        className="chart-input"
                        onChange= {(e) => {
                            setTitle(e.target.value)
                        }}
                    />
                </div>
                <div className="label-container">
                    {labels.map((x, i) => {
                        return (
                            <div className="chart-data">
                                <div className="inputs">
                                    <input
                                        name="Label"
                                        placeholder="Label"
                                        className="chart-input"
                                        value={x.label}
                                        onChange={e => handleLabelInput(e, i)}
                                    /> 
                                    <input
                                        name="Data"
                                        placeholder="Data"
                                        className="chart-input"
                                        value={x.data}
                                        onChange={e => handleDataInput(e, i)}
                                    />
                                    <input 
                                        type="color" 
                                        name="Color"
                                        className="color-input"
                                        value={x.color}
                                        onChange={e => handleColorInput(e, i)}
                                    /> 
                                </div>
                                <div className="chart-buttons">
                                    {labels.length - 1 === i && <button 
                                            className="plus round-btn" 
                                            onClick={handleAddClick}> <FontAwesomeIcon icon={faPlus} /> </button>}
                                    {labels.length > 1 && <button
                                            className="minus round-btn"
                                            onClick={() => handleRemoveClick(i)}> <FontAwesomeIcon icon={faTimes} /> </button>}
                                </div>
                            </div>
                        );
                    })}
                </div>
                <Button variant="dark" className="button" onClick={createChart}>Create the chart</Button>
            </div>
        )
    }

    if(formActive) {
        return (
            <div className="chart-form">
                <h4 className="title fs-40" style={{marginBottom: "1.4rem", marginTop: "1rem"}}>
                    Chart form
                </h4>
                <div className="selection-area">
                    <span style={{fontWeight: "bold"}}>Chart Type</span>
                    <select name="chartType" className="chart-selection" defaultValue="Chart Type" onChange = {(e) => {setChartType(e.target.value)}}>
                        <option value="Chart Type" disabled>Chart Type</option>
                        <option value="Line">Line</option>
                        <option value="Bar">Bar</option>
                        <option value="Pie">Pie</option>
                        <option value="Doughnut">Dougnut</option>
                    </select>
                </div>
            </div>
        )
    }
}

export default ChartForm;