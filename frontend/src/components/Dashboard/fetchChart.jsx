import React, {useState, useEffect} from 'react';
import {Bar, Doughnut, Line, Pie} from 'react-chartjs-2';
import axios from 'axios';
import Button from 'react-bootstrap/Button'
import { useMediaPredicate } from 'react-media-hook'

const FetchChart = () => {
    const token = window.localStorage.getItem('token');
    const [chartsData, setChartsData] = useState([]);
    const [chartType, setChartType] = useState("Line");
    const [chartsOptions, setChartsOptions] = useState([]);

    const smallerThan567 = useMediaPredicate("(max-width: 360px)")
    const smallerThan767 = useMediaPredicate("(max-width: 767px)")
    const biggerThan768 = useMediaPredicate("(min-width: 768px)")

    const bigSize = {
        width: 750,
        height: 500
    }

    const smallSize = {
        width: 300,
        height: 300
    }
    
    const smallerSize = {
        width: 240,
        height: 240
    }

    const fetchChart = () => {
        axios.get("http://localhost:5500/user-charts", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(res => {
            const dc = res.data.chart.map((x, key) => ({
                key: {key},
                labels: x.labels.map(label => label.Label),
                id: x.id,
                datasets: [{
                    label: x.datalabel,
                    data: x.chartdata.map(x => x.Data),
                    backgroundColor: x.color.map(x => x.Color),
                    borderWidth: 4
                }]}))

            const ops = res.data.chart.map((x, key) => ({
                key: {key},
                id: x.id,
                responsive: true,
                title: {
                    display: true,
                    text: x.title
                },
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
            }))
            setChartsOptions(ops);
            setChartsData(dc);
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
        const ac = new AbortController();
        fetchChart()
        return () => ac.abort();
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const renderLine = (chartData) => {
        if(chartType === "Line") {
            return (
                <div className="chart-component">
                    <Line className="chart-type"
                        data={chartData}
                        options={chartData.chartOptions}
                        {...biggerThan768 && bigSize}
                        {...smallerThan767 && smallSize}
                        {...smallerThan567 && smallerSize}
                    />
                    {biggerThan768 && <Button variant="dark" onClick={() => deleteChart(chartData.id)} className="w-25">Delete Chart</Button>}
                    {smallerThan767 && <Button variant="dark" onClick={() => deleteChart(chartData.id)} className="w-50">Delete Chart</Button>}
                </div>
            )
        } else if (chartType === "Bar") {
            return (
                <div className="chart-component">
                    <Bar className="chart-type"
                        data={chartData}
                        options={chartData.chartOptions}
                        {...biggerThan768 && bigSize}
                        {...smallerThan767 && smallSize}
                        {...smallerThan567 && smallerSize}
                    />
                    {biggerThan768 && <Button variant="dark" onClick={() => deleteChart(chartData.id)} className="w-25">Delete Chart</Button>}
                    {smallerThan767 && <Button variant="dark" onClick={() => deleteChart(chartData.id)} className="w-50">Delete Chart</Button>}
                </div>
            )
        } else if (chartType === "Pie") {
            return (
                <div className="chart-component">
                    <Pie className="chart-type"
                        data={chartData}
                        options={chartData.chartOptions}
                        {...biggerThan768 && bigSize}
                        {...smallerThan767 && smallSize}
                        {...smallerThan567 && smallerSize}
                    />
                    {biggerThan768 && <Button variant="dark" onClick={() => deleteChart(chartData.id)} className="w-25">Delete Chart</Button>}
                    {smallerThan767 && <Button variant="dark" onClick={() => deleteChart(chartData.id)} className="w-50">Delete Chart</Button>}
                </div>
            )
        } else if (chartType === "Doughnut") {
            return (
                <div className="chart-component">
                    <Doughnut className="chart-type"
                        data={chartData}
                        options={chartData.chartOptions}
                        {...biggerThan768 && bigSize}
                        {...smallerThan767 && smallSize}
                        {...smallerThan567 && smallerSize}
                    />
                    {biggerThan768 && <Button variant="dark" onClick={() => deleteChart(chartData.id)} className="w-25">Delete Chart</Button>}
                    {smallerThan767 && <Button variant="dark" onClick={() => deleteChart(chartData.id)} className="w-50">Delete Chart</Button>}
                </div>
            )
        }
    }
    if(chartsData.length >= 1) {
        return (
            <div className="chart-container">
                <div className="selection-area">
                    <span style={{fontWeight: "bold"}}>Chart Type</span>
                    <select name="chartType" className="chart-selection" defaultValue={chartType} onChange = {(e) => {setChartType(e.target.value)}}>
                        <option value="Line">Line</option>
                        <option value="Bar">Bar</option>
                        <option value="Pie">Pie</option>
                        <option value="Doughnut">Dougnut</option>
                    </select>
                </div>
                <div className="charts"> 
                    {chartsData.map(chartData => { // eslint-disable-next-line
                        chartsOptions.map(chart => { 
                            if(chart.id === chartData.id) { 
                                chartData.chartOptions = chart 
                            }
                        }) 
                    })} 
                    {chartsData.map(chartData => renderLine(chartData))}  
                </div>
            </div>
        )
    } else {
        return (
            <div className="chart-container">
                <p>There are no charts displayed yet.</p>
            </div>
        )
    }
}

export default FetchChart;