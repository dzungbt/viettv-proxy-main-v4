

function addNewUserHistory (cacheString, username, ip) {
    try {
        if (!cacheString) {
            //first time
            let cacheJson = {};
            cacheJson[username] = {
                history: [
                    {
                        ip,
                        timestamp: Date.now(),
                        datetime: new Date()
                    }
                ]
            };
            return cacheJson
        }

        let cacheJson = JSON.parse(cacheString)

        if (cacheJson.hasOwnProperty(username)) {
            let userHistory = cacheJson[username].history
            userHistory = [...userHistory, {
                ip,
                timestamp: Date.now(),
                datetime: new Date()
            }]
        
            cacheJson[username].history = userHistory
        } else {
            cacheJson[username] = {
                history: [{
                    ip,
                    timestamp: Date.now(),
                    datetime: new Date()
                }]
            };
        }
        
        return cacheJson
    } catch (e) {
        console.log('add new user history error : ', e)
        return null
    }
}


module.exports = {
    addNewUserHistory: addNewUserHistory
}