import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useMediaPredicate } from 'react-media-hook'
import {Bar, Doughnut, Line, Pie} from 'react-chartjs-2';
import male_placeholder from '../imgs/male_placeholder.png';
import female_placeholder from '../imgs/female_placeholder.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-solid-svg-icons';

const SharedCharts = () => {
    const [chartsOptions, setChartsOptions] = useState([]);
    const [chartsData, setChartsData] = useState([]);
    const [commentPlaceholder, setCommentPlaceholder] = useState('Write a comment...');

    const smallerThan567 = useMediaPredicate("(max-width: 360px)");
    const smallerThan767 = useMediaPredicate("(max-width: 767px)");
    const biggerThan768 = useMediaPredicate("(min-width: 768px)");

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

    const removePlaceholder = () => {
        setCommentPlaceholder('');
    }

    const addPlaceholder = () => {
        setCommentPlaceholder('Write a comment...');
    }

    const getChart = () => {
        axios.get('http://localhost:5500/shared-chart')
            .then(res => {
                const dc = res.data.chart.map((x, key) => ({
                    _chartType: x.charttype,
                    _firstname: x.firstname,
                    _lastname: x.lastname,
                    _userid: x.userid,
                    _filename: x.filename,
                    key: {key},
                    labels: x.labels.map(label => label.Label),
                    datasets: [{
                        label: x.dataset,
                        data: x.chartdata.map(x => x.Data),
                        backgroundColor: x.color.map(x => x.Color),
                        borderWidth: 4
                    }]
                }))
                const ops = res.data.chart.map((x, key) => ({
                    key: {key},
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
                console.log(chartsData._filename);

            })
            .catch(err => {
                console.log(err);
            });

    }

    useEffect(() => {
        getChart();
    }, []);

    const renderLine = (chartData) => {
        if(chartData._chartType === "Line") {
            return (
                <div className="chart-component-column">
                    <div className="user">
                        <img className='nav-profile-pic' src={`http://localhost:5500/uploads/${chartData._userid}/${chartData._filename}`} alt="profile_image"/>
                        <span>{chartData._firstname + ' ' + chartData._lastname} shared a new chart.</span>
                    </div>
                    <Line className="chart-type"
                        data={chartData}
                        options={chartData.chartOptions}
                        {...biggerThan768 && bigSize}
                        {...smallerThan767 && smallSize}
                        {...smallerThan567 && smallerSize}
                    />
                    <div className="comment-title">
                        <span><FontAwesomeIcon icon={faComment}/> Comment</span>
                    </div>
                    <p className="comment-ta" contentEditable="true" onFocus={removePlaceholder} onBlur={addPlaceholder}>{commentPlaceholder}</p>
                </div>
            )
        } else if (chartData._chartType === "Bar") {
            return (
                <div className="chart-component-column">
                    <div className="user">
                        <img className='nav-profile-pic' src={`http://localhost:5500/uploads/${chartData._userid}/${chartData._filename}`} alt="profile_image"/>
                        <span>{chartData._firstname + ' ' + chartData._lastname} shared a new chart.</span>
                    </div>
                    <Bar className="chart-type"
                        data={chartData}
                        options={chartData.chartOptions}
                        {...biggerThan768 && bigSize}
                        {...smallerThan767 && smallSize}
                        {...smallerThan567 && smallerSize}
                    />
                    <div className="comment-title">
                        <span><FontAwesomeIcon icon={faComment}/> Comment</span>
                    </div>
                    <p className="comment-ta" contentEditable="true" onFocus={removePlaceholder} onBlur={addPlaceholder}>{commentPlaceholder}</p>
                </div>
            )
        } else if (chartData._chartType === "Pie") {
            return (
                <div className="chart-component-column">
                    <div className="user">
                        <img className='nav-profile-pic' src={`http://localhost:5500/uploads/${chartData._userid}/${chartData._filename}`} alt="profile_image"/>
                        <span>{chartData._firstname + ' ' + chartData._lastname} shared a new chart.</span>
                    </div>
                    <Pie className="chart-type"
                        data={chartData}
                        options={chartData.chartOptions}
                        {...biggerThan768 && bigSize}
                        {...smallerThan767 && smallSize}
                        {...smallerThan567 && smallerSize}
                    />
                    <div className="comment-title">
                        <span><FontAwesomeIcon icon={faComment}/> Comment</span>
                    </div>
                    <p className="comment-ta" contentEditable="true" onFocus={removePlaceholder} onBlur={addPlaceholder}>{commentPlaceholder}</p>
                </div>
            )
        } else if (chartData._chartType === "Doughnut") {
            return (
                <div className="chart-component-column">
                    <div className="user">
                        <img className='nav-profile-pic' src={`http://localhost:5500/uploads/${chartData._userid}/${chartData._filename}`} alt="profile_image"/>
                        <span>{chartData._firstname + ' ' + chartData._lastname} shared a new chart.</span>
                    </div>
                    <Doughnut className="chart-type"
                        data={chartData}
                        options={chartData.chartOptions}
                        {...biggerThan768 && bigSize}
                        {...smallerThan767 && smallSize}
                        {...smallerThan567 && smallerSize}
                    />
                    <div className="comment-title">
                        <span><FontAwesomeIcon icon={faComment}/> Comment</span>
                    </div>
                    <p className="comment-ta" contentEditable="true" onFocus={removePlaceholder} onBlur={addPlaceholder}>{commentPlaceholder}</p>
                </div>
            )
        }
    }
    if(chartsData.length >= 1) {
        return (
            <div className="chart-container">
                <div className="charts-flex"> 
                    {chartsData.forEach(chartData => { 
                        chartsOptions.forEach(chart => { 
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

export default SharedCharts;