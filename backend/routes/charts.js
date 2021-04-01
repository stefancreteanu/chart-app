const router = require('express').Router();
let Chart = require('../models/chart.model');

router.route('/').get((req, res) => {
    Chart.find()
        .then(charts => res.json(charts))
        .catch(err => res.status(400).json('Error: ' + err));
})

router.route('/add').post((req, res) => {
    const chartName = req.body.chartName;
    const labels = req.body.labels;
    const datasetLabel = req.body.datasetLabel;
    const datasetData = req.body.datasetData;

    const newChart = new Chart({
        chartName,
        labels,
        datasetLabel,
        datasetData
    });

    newChart.save()
        .then(() => res.json('Chart added'))
        .catch(err => res.status(400).json('Error: ' + err));
})

module.exports = router;