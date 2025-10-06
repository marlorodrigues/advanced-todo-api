import DB from '../../database/postgres'
import { encryptPassword } from '../../utils/encryption'

//#region Erros Map
const GENERIC_THROW = "Unknown Error, please try check your parameters and try later"
const USER_NOT_FOUND = "Was not possibly to find user"
const USER_ALREADY_REGISTERED = "This username was already taken, please choose another one"
//#endregion


interface Users {
    userId: bigint
    name: string
    username: string
    password: string
    createdAt: Date
    updatedAt: Date
    deletedAt: Date
}

async function isUserValid(filter?: bigint | string): Promise<boolean> {
    try {
        let filterColumn = typeof filter == 'bigint' ? 'userId' : 'username'

        const user = await DB.users.count({
            where: { [filterColumn]: filter }
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
    findAllUser: async () => {
        try{
            let users = await DB.users.findMany({
                select: {
                    userId: true,
                    username: true,
                    name: true,
                    createdAt: true,
                    deletedAt: true
                }
            })

            return users.map(user => {
                let { deletedAt, userId, ...rest } = user
                return {
                    isActive: deletedAt ? true : false, 
                    userId: userId.toString(),
                    ...rest
                }
            })

        } catch (error: any) {
            console.log("-----------------------------")
            console.log(error.message)
            console.log(error.stack)
            console.log("-----------------------------")

            return GENERIC_THROW
        }
    },

    findUserById: async () => {
        try{

        } catch (error: any) {
            console.log("-----------------------------")
            console.log(error.message)
            console.log(error.stack)
            console.log("-----------------------------")

            return GENERIC_THROW
        }
    },

    findUserByUsername: async () => {
        try{

        } catch (error: any) {
            console.log("-----------------------------")
            console.log(error.message)
            console.log(error.stack)
            console.log("-----------------------------")

            return GENERIC_THROW
        }
    },

    createUser: async (data: Users) => {
        try {
            if(await isUserValid(data.username))
                return USER_ALREADY_REGISTERED

            let user = await DB.users.create({
                data: {
                    name: data.name,
                    username: data.username,
                    password: encryptPassword(data.password),
                    permissionId: 1
                }
            })

            return {
                userId: user.userId.toString()
            }

        } catch (error: any) {
            console.log("-----------------------------")
            console.log(error.message)
            console.log(error.stack)
            console.log("-----------------------------")

            return GENERIC_THROW
        }
    },
    
    updateUser: async () => {
        try{

        } catch (error: any) {
            console.log("-----------------------------")
            console.log(error.message)
            console.log(error.stack)
            console.log("-----------------------------")

            return GENERIC_THROW
        }
    },

    deleteUser: async () => {
        try{

        } catch (error: any) {
            console.log("-----------------------------")
            console.log(error.message)
            console.log(error.stack)
            console.log("-----------------------------")

            return GENERIC_THROW
        }
    },    
}