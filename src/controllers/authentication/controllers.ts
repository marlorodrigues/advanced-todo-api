import Valid from './validation';
import { Request, Response } from 'express'
import factory from "./factory";
import { encryptData, generateHash } from '../../utils/encryption';
import { newAccessToken, newRefreshToken } from '../../utils/token';

function denyRequest(reply: Response, message: string, statusCode = 400){
    console.log("Request denied by reason:", message)

    reply.status(statusCode).send({
        message: message,
        success: false,
    });
}

function sendResponse(reply: Response, data: any, dataExpectedType = 'object'){
    reply.status(200).send({
        message: data,
        success: typeof data == dataExpectedType,
    });
}

function makeCookie(AccessToken: string, RefreshToken: string){
    let cookieIngredients = {}

    if(process.env.NODE_ENV != "dev"){
        console.log("Setting Secure Cookie")
        cookieIngredients = {
            domain: process.env.COOKIE_DOMAIN,
            sameSite: "none",
            httpOnly: true,
            signed: true,
            secure: true,
        }
    } else {
        console.log("Setting Regular Cookie")
        cookieIngredients = {
            domain: process.env.COOKIE_DOMAIN,
            httpOnly: true,
        }
    }

    let key = Buffer.from(process.env.COOKIE_SECRET!, "hex")

    return {
        ingredients: cookieIngredients,
        access: encryptData(JSON.stringify(AccessToken), key),
        refresh: encryptData(JSON.stringify(RefreshToken), key),
    }
}

export default {

    makeLogin: async (request: Request, reply: Response) => {
        try{
            let userAgent = request.headers['user-agent']?.toLowerCase()
            let acceptLanguage = request.headers['accept-language'] || 'en'

            const body = request.body
            let validation = Valid.LoginForm(body)

            if(!validation.success)
                return denyRequest(reply, validation.error)

            const userData = await factory.findUserData(validation.data.username, validation.data.password)
            if(typeof userData == "string")
                return denyRequest(reply, userData, 400)

            const sessionId = generateHash()
            const RefreshToken = newRefreshToken({ 
                sessionId,  
                userId: userData.userId
            })
            const AccessToken = newAccessToken({
                sessionId,
                ...userData,
            })

            let cookies = makeCookie(AccessToken, RefreshToken)
            reply.cookie('_td_at', cookies.access, cookies.ingredients)
            reply.cookie('_td_rt', cookies.refresh, cookies.ingredients)

            sendResponse(reply, userData)
        } catch (error: any) {
            console.log("-----------------------------")
            console.log(error.message)
            console.log(error.stack)
            console.log("-----------------------------")

            denyRequest(reply, "Unknown Error", 500)
        }
    }


}