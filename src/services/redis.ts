import { createClient } from 'redis'

const REDIS_URL = process.env.REDIS_URL

async function get_client() {
    try {
        var client = createClient({
            url: REDIS_URL
        })

        await client.connect()

        client.on('error', (error: any) => {
            console.log(`Open Redis Error - ${error}`)
        })

        return client
    }
    catch (error: any) {
        console.log(`${error.message} - ${error.stack}`)
        throw error
    }
}

export = {

    //#region Using as Cache

    get: async (key: string) => {
        try {
            var client = await get_client()

            const value = await client?.get(key)
            await client?.quit()

            return value
        }
        catch (error: any) {
            console.log(`${error.message} - ${error.stack}`)
        }
    },

    set: async (key: string, value: string, ttlSeconds?: number) => {
        try {
            var client = await get_client()

            if(ttlSeconds)
                await client?.set(key, value, { EX: ttlSeconds })
            else
                await client?.set(key, value)

            await client?.quit()
        }
        catch (error: any) {
            console.log(`${error.message} - ${error.stack}`)
        }
    },

    delete: async (key: string) => {
        try {
            var client = await get_client()

            await client?.del(key)
            await client?.quit()
        }
        catch (error: any) {
            console.log(`${error.message} - ${error.stack}`)
        }
    },

    //#endregion

}
