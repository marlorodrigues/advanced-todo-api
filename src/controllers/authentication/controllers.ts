import Valid from './validation';
import { Request, Response } from 'express'
import factory from "./factory";

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

export = {

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
                return denyRequest(reply, userData, 404)

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