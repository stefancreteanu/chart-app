import React, {useState, useEffect} from 'react';
import {Bar, Doughnut, Line, Pie} from 'react-chartjs-2';
import axios from 'axios';

const staticOptions = {
    responsive: false,
    title: { text: "Chart", display: true },
    scales: {
        yAxes: [
        {
            ticks: {
            autoSkip: true,
            maxTicksLimit: 10,
            beginAtZero: true
            },
            gridLines: {
            display: false
            }
        }
        ],
        xAxes: [
        {
            gridLines: {
            display: false
            }
        }
        ]
    }
}

const FetchChart = () => {
    const token = window.localStorage.getItem('token');
    const [chartsData, setChartsData] = useState([]);

    const fetchChart = () => {
        axios.get("http://localhost:5500/user-charts", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(res => {
            const dc = res.data.chart.map(x => 
                ({labels: x.labels.map(label => label.Label),
                datasets: [{
                    label: x.datalabel,
                    data: x.chartdata.map(x => x.Data),
                    backgroundColor: ["rgba(75, 192, 192, 0.6)"],
                    borderWidth: 4
                }]}))
            setChartsData(dc);
        })
        .catch(err => {
            console.log(err);
        });
    }

    useEffect(() => {
        fetchChart();
    }, []);

    const renderLine = (chartData) =>
        <Bar
                data={chartData}
                options={staticOptions}
            />

    return (
         <div className="chart-container">
            {chartsData.map(chartData => renderLine(chartData))}
         </div>
    )
}

export default FetchChart;