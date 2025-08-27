import { Request, Response } from 'express'
import Valid from './validation'
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
    createTask: async (request: Request, reply: Response) => {
        try {
            let body = request.body

            let validation = Valid.Create(body)

            if(validation.error)
                return denyRequest(reply, validation.error.message)

            let result = factory.createTask(1n, body)

            sendResponse(reply, result, 'object')

        } catch (error: any) {
            console.log("-----------------------------")
            console.log(error.message)
            console.log(error.stack)
            console.log("-----------------------------")

            denyRequest(reply, "Unknown Error", 500)
        }
    }
}