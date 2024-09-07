const cron = require('node-cron');
const {scanUserHistory} = require('../services/userHistoryService')

function kernel () {
    cron.schedule('*/20 * * * * *', () => {
        scanUserHistory()
    });

}

module.exports = {
    kernel
}