import DB from '../../database/postgres'
import { DateTime } from "luxon";
import { verifyPassword } from '../../utils/encryption';

//#region Erros Map
const USER_NOT_FOUND = "Was not possibly to find user"
const GENERIC_THROW = "Unknown Error, please try check your parameters and try later"
const AUTHENTICATION_FAILED = "Authentication failed"
const PERMISSION_NOT_FOUND = "Was not possibly to find permission"
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

export default {

    findUserData: async (username: string, givenPassword: string) => {
        try{
            let user = await DB.users.findFirst({
                where: { username: username },
                select: {
                    userId: true,
                    name: true,
                    password: true,
                    permissionId: true,
                    username: true,
                    createdAt: true,
                    deletedAt: true
                }
            })
            
            if(!user || user.deletedAt)
                return USER_NOT_FOUND

            if (!verifyPassword(givenPassword, user.password))
                return AUTHENTICATION_FAILED
            
            let {userId, password, ...rest} = user
            password = ""

            return {
                userId: userId.toString(),
                ...rest
            }

        } catch (error: any) {
            console.log("-----------------------------")
            console.log(error.message)
            console.log(error.stack)
            console.log("-----------------------------")

            return GENERIC_THROW
        }
    },

    findPermissionData: async (permissionId: number) => {
        try{
            let permission = await DB.permissions.findFirst({
                where: { permissionId: permissionId },
                select: {
                    name: true,
                    type: true,
                    permissionId: true
                }
            })

            if(!permission)
                return PERMISSION_NOT_FOUND

            return permission
        } catch (error: any) {
            console.log("-----------------------------")
            console.log(error.message)
            console.log(error.stack)
            console.log("-----------------------------")

            return GENERIC_THROW
        }
    }

}


