const cron = require('node-cron');
const {scanUserHistory} = require('../services/userHistoryService')
const {getUsersData} = require('../services/userService')

function kernel () {
    cron.schedule('*/20 * * * * *', () => {
        scanUserHistory()
    });

    cron.schedule('*/20 * * * * *', () => {
        getUsersData()
    });

}

module.exports = {
    kernel
}