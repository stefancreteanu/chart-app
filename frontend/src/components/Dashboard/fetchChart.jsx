import React, {useState, useEffect} from 'react';
import {Bar, Line, Pie} from 'react-chartjs-2';
import axios from 'axios';

const FetchChart = () => {
    const [labels, setLabels] = useState([{ Label: "" }]);
    const [data2, setData] = useState([{ Data: ""}]);
    const [chartData, setChartData] = useState({});

    const fetchChart = () => {
        axios
        .get("http://localhost:5500/charts")
        .then(res => {
            console.log(res.data[0])
            const {labels, datasetData} = res.data[0]
            const l = labels.map(x => x.Label)
            const d = datasetData.map(x => x.Data)
            setLabels(l)
            setData(d)
            setChartData({
            labels: l,
            datasets: [{
                    label: "Chart 1",
                    data: d,
                    backgroundColor: ["rgba(75, 192, 192, 0.6)"],
                    borderWidth: 4
                }]
            });
        })
        .catch(err => {
            console.log(err);
        });
    }

    useEffect(() => {
        fetchChart();
    }, []);

    return (
        <Line
            data={chartData}
            options={{
                responsive: true,
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
            }}
        /> 
    )
}

export default FetchChart;