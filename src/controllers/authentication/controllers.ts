import Valid from './validation';
import { Request, Response } from 'express'
import factory from "./factory";
import { encryptData, generateHash } from '../../utils/encryption';
import { newAccessToken, newRefreshToken } from '../../utils/token';
import Redis from '../../services/redis';


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

function getCookieIngredients() {
    if(process.env.NODE_ENV != "dev"){
        console.log("Setting Secure Cookie")
        return {
            domain: process.env.COOKIE_DOMAIN,
            sameSite: "none",
            httpOnly: true,
            signed: true,
            secure: true,
            expires: new Date(Date.now() + 900000) // 15 min
        }
    }

    console.log("Setting Regular Cookie")
    return {
        domain: process.env.COOKIE_DOMAIN,
        httpOnly: true,
        expires: new Date(Date.now() + 900000) // 15 min
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

            let ingredients = getCookieIngredients()
            //@ts-ignore
            reply.cookie('_td_at', sessionId, ingredients)

            await Redis.set(sessionId, JSON.stringify({
                access: AccessToken,
                refresh: RefreshToken
            }), 15 * 60 * 60)

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