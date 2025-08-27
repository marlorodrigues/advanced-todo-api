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

function sendResponse(reply: Response, data: any, dataExpectedType: string){
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

            if(validation.error)
                return denyRequest(reply, validation.error.message)

            const userData = await factory.findUserData(validation.value.username, validation.value.password)
            if(typeof userData == "string")
                denyRequest(reply, userData, 404)

        } catch (error: any) {
            console.log("-----------------------------")
            console.log(error.message)
            console.log(error.stack)
            console.log("-----------------------------")

            denyRequest(reply, "Unknown Error", 500)
        }
    }


}