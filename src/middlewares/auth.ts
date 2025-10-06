declare global {
  namespace Express {
    interface Request {
      sessionData?: SessionData
    }
  }
}

interface SessionData {
    sessionId: string
    user: {
        userId: string
        permissionId: number
        name: string
        createdAt: string
        updatedAt: string
        deletedAt: string
    }
    permission: {
        permissionId: number
        name: string
        type: string
        createdAt: string
        updatedAt: string
        deletedAt: string
    }
}


import { NextFunction, Request, Response } from 'express'
import Redis from './../services/redis';
import { decodeAccessToken } from '../utils/token';


async function tasteCookie(cookies: object): Promise<SessionData> {
    if(!Object.hasOwn(cookies, "_td_at"))
        return {} as SessionData

    const cookieFlavor = await Redis.get(cookies["_td_at"])
    if(!cookieFlavor)
        return {} as SessionData

    const cookieData = JSON.parse(cookieFlavor)
    const accessAuth = cookieData?.access

    if(!accessAuth)
        return {} as SessionData

    const session = decodeAccessToken(accessAuth)

    if(session == "MALFORMED_TOKEN")
        return {} as SessionData

    //@ts-ignore
    if(session.data.deletedAt)
        return {} as SessionData

    //@ts-ignore
    console.log(session.data)

    //@ts-ignore
    return session.data as SessionData
}

export = {
    checkAuthorization: async (request: Request, reply: Response, next: NextFunction) => {
        try {
            let accept_language = request.headers['accept-language'] || 'en'
            const cookies = process.env.NODE_ENV == "dev" ? request.cookies : request.signedCookies
            const sessionData = await tasteCookie(cookies)

            if(Object.keys(sessionData).length == 0)
                return reply.status(401).send({
                    message: "Unauthorized to Access",
                    success: false,
                });

            request.sessionData = sessionData

            next()

        } catch (error: any) {
            console.log("-----------------------------")
            console.log(error.message)
            console.log(error.stack)
            console.log("-----------------------------")

            reply.status(500).send({
                message: "Unknown Server Error",
                success: false,
            });
        }
    },

    checkAdminAuthorization: async (request: Request, reply: Response, next: NextFunction) => {
        try {
            let accept_language = request.headers['accept-language'] || 'en'
            const cookies = process.env.NODE_ENV == "dev" ? request.cookies : request.signedCookies
            const sessionData = await tasteCookie(cookies)

            if(Object.keys(sessionData).length == 0)
                return reply.status(401).send({
                    message: "Unauthorized to Access",
                    success: false,
                });

            request.sessionData = sessionData

            next()

        } catch (error: any) {
            console.log("-----------------------------")
            console.log(error.message)
            console.log(error.stack)
            console.log("-----------------------------")

            reply.status(500).send({
                message: "Unknown Server Error",
                success: false,
            });
        }
    },
}