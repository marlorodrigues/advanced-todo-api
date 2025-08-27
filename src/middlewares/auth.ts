import { Locals, NextFunction, Request, Response } from 'express'
import { decryptData } from '../utils/encryption'


function tasteCookie(cookies: object): any {
    if(!Object.hasOwn(cookies, process.env.COOKIE_NAME || "_todo"))
        return false

    var cookieIngredients = (cookies[process.env.COOKIE_NAME || "_todo"], process.env.COOKIE_SECRET)

    if(!cookieIngredients)
        return false

    return JSON.parse(cookieIngredients)
}

export = {
    checkAuthorization: async (request: Request, reply: Response, next: NextFunction) => {
        try {
            let accept_language = request.headers['accept-language'] || 'en'
            const cookies = process.env.NODE_ENV == "debug" ? request.cookies : request.signedCookies

            next()

        } catch (error: any) {
            console.log("-----------------------------")
            console.log(error.message)
            console.log(error.stack)
            console.log("-----------------------------")

            reply.status(500).send({
                message: "Unknown Error",
                success: false,
            });
        }
    }
}