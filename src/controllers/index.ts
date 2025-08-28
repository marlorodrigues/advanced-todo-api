import fs from 'fs'

interface Routes {
    method: string
    url: string
    prehandler: Function | undefined,
    handler: Function,
}

interface Routes2Expose {
    base: string,
    routes: Array<Routes>
}

export default function initializeControllers(): Routes2Expose[] {
    try{
        var directories = fs.readdirSync(__dirname)
        var allRoutes: Routes2Expose[] = []

        directories.map(async (controller: string) => {
            if (controller.includes('index')) return;

            var files = fs.readdirSync(`${__dirname}/${controller}`)
            files.map(async (file: string) => {
                var isRouteFile = file.includes('routes.')
                if (!isRouteFile) return;

                let handlers: any = require(`${__dirname}/${controller}/${file}`)
                allRoutes.push(handlers.default)
            })
        })

        console.log(allRoutes)
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