import fs from 'fs'

interface ExposedRoutes {
    method: string
    url: string
    prehandler: Function | undefined,
    handler: Function,
}

export default function initializeControllers(): ExposedRoutes[] {
    try{
        var directories = fs.readdirSync(__dirname)
        var allRoutes: ExposedRoutes[] = []

        directories.map(async (controller: string) => {
            if (controller.includes('index')) return;

            var files = fs.readdirSync(`${__dirname}/${controller}`)
            files.map(async (file: string) => {
                var isRouteFile = file.includes('.routes.')
                if (!isRouteFile) return;

                let handlers: any = require(`${__dirname}/${controller}/${file}`)
            })
        })


        return allRoutes
    }
    catch(error: any){
        console.log("-----------------------------")
        console.log(error.message)
        console.log(error.stack)
        console.log("-----------------------------")

        return []
    }
}