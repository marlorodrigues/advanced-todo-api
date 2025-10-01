import jwt from "jsonwebtoken";

const HASH = process.env.COOKIE_SECRET || ""

export function newRefreshToken(data: any) {
    return jwt.sign({ data }, HASH)
}

export function newAccessToken(data: any) {
    return jwt.sign({ data }, HASH)
}

export function decodeAccessToken(token: string) {
    try {
        return jwt.verify(token, HASH);
    } catch (error: any) {
        console.log("-----------------------------")
        console.log(error.message)
        console.log(error.stack)
        console.log("-----------------------------")

        return "MALFORMED_TOKEN"
    }
}
