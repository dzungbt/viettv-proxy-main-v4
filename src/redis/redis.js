require('dotenv').config();
const { createClient } = require('redis')

class Redis {
    client = null
    constructor() {
        this.client = createClient(process.env.REDIS_PORT, process.env.REDIS_HOST);
        this.client.connect();
    }

    async set (key, data) {
        try{
            const res = await this.client.set(key, JSON.stringify(data));
            return this.successResponse(data)
        } catch (e) {
            console.log('set redis data err :' , e)
            return this.errorResponse(e, 'set data to redis fail')
        }
    }

    async get (key) {
        try{
            const data = await this.client.get(key);
            return this.successResponse(data)
        } catch (e) {
            console.log('get redis data err :' , e)
            return this.errorResponse(e, 'get data from redis fail')
        }
    }

    async bulk (key) {
        try{
             
        } catch (e) {
            return this.errorResponse(e, 'bulk data to redis fail')
        }
    }

    async delete (key) {
        try{
            await this.client.del(key);
            return this.successResponse(true)
        } catch (e) {
            return this.errorResponse(e, 'delete data in redis fail')
        }
    }

    async truncate () {
        try{
            this.client.flushall('ASYNC', function (err, succeeded) {
                if (err) {
                    console.log('error in truncate data : ', err)
                    return this.errorResponse(err)
                }

                if (succeeded) {
                    return this.successResponse(true)
                }
            });
        } catch (e) {
            return this.errorResponse(e, 'truncate data in redis fail')
        }
    }

    async successResponse (data) {
        return {
            success: true,
            data
        }
    }

    async errorResponse (data, message) {
        return {
            success: false,
            data,
            message
        }
    }

    async clearClient () {
        await this.client.quit();
    }

}


module.exports = {
    Redis: Redis
}