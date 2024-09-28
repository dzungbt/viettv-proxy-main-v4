const {Redis} = require('../redis/redis')
const db = require("../../models/index");
const { Op } = require("sequelize");
const constants = require("../config/constants/constants");

async function loadUserHistory (userHistories, userData) {
    if (!userData) {
        return
    }
    let ips = []
    console.log('---> userData : ', userData)
    const historyDataForSave = []
    userHistories.forEach((history) => {
        let numberDivices = 1
        if (userData && userData?.numberDevicesAllowOneTime) {
            numberDivices = userData?.numberDevicesAllowOneTime ?? 1
        }
        if (history?.ip && !ips.includes(history?.ip) && ips.length < (numberDivices ?? 1)) {
            ips.push(history.ip)
        }
        historyDataForSave.push({
            userId : userData.id,
            username: userData.username,
            ip: history?.ip,
            timestamp: history?.timestamp,
            datetime: history?.datetime
        })
    })

    const ipString = ips.join(',')

    db.users.update(
        { 
            watching: 1,
            ipsWatching: ipString
        },
        {
            where: {
                username: userData.username
            }
        }
    )
    try {
        db.userHistories.bulkCreate(historyDataForSave)
    } catch (e) {
        console.log('error in bulk create user history : ', e)
    }
}


async function scanUserHistory () {
    const redisClient = new Redis
    try {
        const usersInfo = await redisClient.get('users')
        const userInfoString = usersInfo.data
        if (usersInfo.success && userInfoString) {
            let userInfoJson = JSON.parse(userInfoString)
            const usernames = Object.keys(userInfoJson)

            const allUsers = await db.users.findAll( {
                where: {
                    active: 1
                },
            })

            let usernamesWatchingOnCache = []
            usernames.forEach((username) => {
                const userHistories = userInfoJson[username]?.history
                if (!userHistories || userHistories.length == 0) {
                    return 
                }

                const userData = allUsers.find((user) => user.username == username)
                loadUserHistory(userHistories, userData)    
                
                userInfoJson[username].history = []
                usernamesWatchingOnCache.push(username)
            })

            console.log('usernamesWatchingOnCache : ', usernamesWatchingOnCache)

            db.users.update(
                { watching: 0, ipsWatching: '' },
                {
                    where: {
                        username: {
                            [Op.notIn]: usernamesWatchingOnCache
                        }
                    }
                }
            )

            redisClient.set('users', userInfoJson)
        }
        
    } catch (e) {
        console.log('error in scan user history : ', e)
    }
    redisClient.clearClient()
}

async function allowWatching (currentIp, userData) {
    try {
        if (!userData?.ipsWatching || userData?.ipsWatching.length == 0) {
            console.log('current ip : ', currentIp, ' -- 1')
            return true
        }
        const ipsWatching = userData?.ipsWatching?.split(',')
        if (ipsWatching.length < (userData.numberDevicesAllowOneTime ?? 1)){
            console.log('current ip : ', currentIp, ' -- 2')

            return true
        }
    
        if (ipsWatching.includes(currentIp)) {
            console.log('current ip : ', currentIp, ' -- 3')

            return true
        }
        console.log('current ip : ', currentIp, ' -- 4')

        return false
    } catch (e) {
        console.log('error in allowWatching: ', e)
        return true
    }
}

module.exports = {
    scanUserHistory: scanUserHistory,
    allowWatching: allowWatching
}