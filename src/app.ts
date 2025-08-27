import { manual } from './../node_modules/effect/src/Reloadable';
import express, { Express } from 'express'
import { json } from 'body-parser'
import Compression from 'compression'
import Cors from 'cors'
import Helmet from "helmet"
import cookieParser from 'cookie-parser';
import { encryptData } from './utils/encryption';
import crypto from 'crypto'

export default class APIServer {
    public app: Express
    private allowedHeaders = [
        'Content-Type', 'Content-Encoding', 'Accept', 'Origin', 'Connection',
        'Access-Control-Allow-Origin', 'Access-Control-Allow-Headers', 'Access-Control-Allow-Methods',
        'Authorization', 'If-Modified-Since', 'If-None-Match', 'Accept-Language'
    ]

    constructor() {
        this.app = express()

        let t = encryptData("teste", crypto.randomBytes(32))
        console.log("encryptData", t.data.replace(/\./g, "O"))
    }

    public async startAPI(){
        this.initializePlugins()
        this.initializeRoutes()
        this.manualRoutes()

        const port = Number(process.env.HTTP_PORT) || 3200;
        this.app.listen(port, "0.0.0.0", () => {
            console.log(`Server Running at http://0.0.0.0:${port} 🚀🚀🚀`)
        })
    }

    public async stopAPI(){
        // Nothing to do here
    }

    private async initializePlugins() {
        this.app.set('etag', 'strong')
        this.app.disable('x-powered-by')

        this.app.use(Helmet({
            noSniff: true,
            referrerPolicy: false,
            xPoweredBy: false,
            xssFilter: true
        }))

        this.app.use(cookieParser(process.env.COOKIE_SECRET));
        this.app.use(express.Router({ caseSensitive: true }))
        this.app.use(express.urlencoded({ extended: true, limit: '300mb' }))
        this.app.use(json({ limit: '300mb'}))
        this.app.use(Compression({ level: 9, threshold: 1024 }))
        this.app.use(Cors({
            origin: "*",
            methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
            allowedHeaders: this.allowedHeaders,
            exposedHeaders: this.allowedHeaders,
            preflightContinue: false,
            credentials: true,
            optionsSuccessStatus: 204,
            maxAge: 3600,
        }))
    }

    private async initializeRoutes() {
        // var Middlewares = await import('./middlewares')
        var AllRoutes = await import('./controllers/index')
        for (let route of AllRoutes.default()) {
            console.log(`Registering route: [${route.method}] ${route.url}`)
        }
    }

    private manualRoutes() {
        this.app['get']('/api/metrics/health', async (_request, reply) => {
            return reply.status(200).send({ status: "up"})
        })
    }
}