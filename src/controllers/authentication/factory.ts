import DB from '../../database/postgres'
import { DateTime } from "luxon";
import { verifyPassword } from '../../utils/encryption';

//#region Erros Map
const USER_NOT_FOUND = "Was not possibly to find user"
const GENERIC_THROW = "Unknown Error, please try check your parameters and try later"
const AUTHENTICATION_FAILED = "Authentication failed"
//#endregion

async function isUserValid(userId: bigint): Promise<boolean> {
    try {
        const user = await DB.users.count({
            where: { userId: userId }
        })

        if(!user)
            return false

        return true

    } catch (error: any) {
        console.log("-----------------------------")
        console.log(error.message)
        console.log(error.stack)
        console.log("-----------------------------")

        return false
    }
}

export = {

    findUserData: async (username: string, password: string) => {
        try{
            let user = await DB.users.findFirst({
                where: { username: username }
            })
            
            if(!user)
                return USER_NOT_FOUND

            if (!verifyPassword(password, user.password))
                return AUTHENTICATION_FAILED
            
            return user

        } catch (error: any) {
            console.log("-----------------------------")
            console.log(error.message)
            console.log(error.stack)
            console.log("-----------------------------")

            return GENERIC_THROW
        }
    },

}


