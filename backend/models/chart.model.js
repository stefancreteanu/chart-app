const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const chartSchema = new Schema ({
    chartName: {type: String, required: true},
    labels: {type: Array, required: true},
    datasetLabel: {type: String, required: true},
    datasetData: {type: Array, required: true}
})

const chart = mongoose.model('Chart', chartSchema);

module.exports = chart;