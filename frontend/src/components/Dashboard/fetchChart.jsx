import React, {useState, useEffect} from 'react';
import {Bar, Doughnut, Line, Pie} from 'react-chartjs-2';
import axios from 'axios';

const staticOptions = {
    responsive: true,
    scales: {
        yAxes: [{
            ticks: {
            autoSkip: true,
            maxTicksLimit: 10,
            beginAtZero: true
            },
            gridLines: {
            display: true
            }
        }],
        xAxes: [{
            gridLines: {
            display: true
            }
        }]
    }
}

const FetchChart = () => {
    const token = window.localStorage.getItem('token');
    const [chartsData, setChartsData] = useState([]);
    const [chartType, setChartType] = useState("Line");

    const fetchChart = () => {
        axios.get("http://localhost:5500/user-charts", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(res => {
            const dc = res.data.chart.map(x => ({
                labels: x.labels.map(label => label.Label),
                id: x.id,
                datasets: [{
                    label: x.datalabel,
                    data: x.chartdata.map(x => x.Data),
                    backgroundColor: x.color.map(x => x.Color),
                    borderWidth: 4
                }]}))
            setChartsData(dc);
            console.log(res.data.chart);
        })
        .catch(err => {
            console.log(err);
        });
    }

    const deleteChart = (chartsId) => {
        axios.post('http://localhost:5500/delete-chart', {
            id: chartsId
        })
        const filteredCharts = chartsData.filter(filter => filter.id !== chartsId);
        setChartsData(filteredCharts);
    }

    useEffect(() => {
        fetchChart()
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const renderLine = (chartData) => {
        if(chartType === "Line") {
            return (
                <>
                    <Line
                        data={chartData}
                        options={staticOptions}
                        width={"750px"}
                        height={"500px"}
                    />
                    <button onClick={() => deleteChart(chartData.id)} className="chart-btn btn-color">Delete Chart</button>
                </>
            )
        } else if (chartType === "Bar") {
            return (
                <>
                    <Bar
                        data={chartData}
                        options={staticOptions}
                        width={"750px"}
                        height={"500px"}
                    />
                    <button onClick={() => deleteChart(chartData.id)} className="chart-btn btn-color">Delete Chart</button>
                </>
            )
        } else if (chartType === "Pie") {
            return (
                <>
                    <Pie
                        data={chartData}
                        options={staticOptions}
                        width={"750px"}
                        height={"500px"}
                    />
                    <button onClick={() => deleteChart(chartData.id)} className="chart-btn btn-color">Delete Chart</button>
                </>
            )
        } else if (chartType === "Doughnut") {
            return (
                <>
                    <Doughnut
                        data={chartData}
                        options={staticOptions}
                        width={"750px"}
                        height={"500px"}
                    />
                    <button onClick={() => deleteChart(chartData.id)} className="chart-btn btn-color">Delete Chart</button>
                </>
            )
        }
    }  

    return (
         <div className="chart-container">
            <span>Chart Type</span>
            <select name="chartType" className="chart-drop" defaultValue={chartType} onChange = {(e) => {setChartType(e.target.value)}}>
                <option value="Line">Line</option>
                <option value="Bar">Bar</option>
                <option value="Pie">Pie</option>
                <option value="Doughnut">Dougnut</option>
            </select>
            {chartsData.map(chartData => renderLine(chartData))}
         </div>
    )
}

export default FetchChart;