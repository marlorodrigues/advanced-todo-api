import dotenv from "dotenv";
dotenv.config({});


import App from './app';

const Application = new App()


//#region Process Handlers

process.on('SIGINT', () => {
    console.log('API Node Stopped with success!')
    Application.stopAPI()
    console.log("Exiting process...")
    process.exit(0)
})

process.on('uncaughtException', (error, origin) => {
    console.log(`Uncaught Exception`)
    console.log(`name: ${error.name}`)
    console.log(`message: ${error.message}`)
    console.log(`stack: ${error.stack || "unknown stack"}`)
    console.log(`cause: ${error.cause as any}`)
    console.log(`origin: ${origin}`)

    setTimeout(async () => {
        console.log("Exiting process...")
        process.exit(1);
    }, 1000)
});

process.on('unhandledRejection', async (reason, promise) => {
    console.log(`TYPEOF reason: ${typeof reason}`)
    console.log(`IS ERROR: ${reason instanceof Error}`)
    console.log(`CONSTRUCTOR:' ${reason?.constructor?.name}`)

    //@ts-ignore
    console.log(`REASON KEYS: ${Object.keys(reason)}`)

    //@ts-ignore
    if (reason && reason.stack) {
        //@ts-ignore
        console.log(`REASON STACK: ${reason.stack}`)
    }
})

//#endregion


Application.startAPI().catch((err) => {
    console.error("Failed to start API server", err);
    process.exit(1);
});

