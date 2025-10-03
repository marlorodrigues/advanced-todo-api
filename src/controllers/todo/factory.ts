import DB from '../../database/postgres'
import { DateTime } from "luxon";
import { Task, TaskIdBigInt, Tasks } from './types';

//#region Erros Map
const USER_NOT_FOUND = "Was not possibly to find user"
const TASKS_NOT_FOUND = "This user has not tasks"
const TASK_NOT_FOUND = "Task not found"
const GENERIC_THROW = "Unknown Error, please try check your parameters and try later"
const INVALID_PERIOD = "Select a valid period"
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

async function getTaskById(userId: bigint, taskId: bigint): Promise<Task | string> {
    try{
        if(!await isUserValid(userId))
            return USER_NOT_FOUND

        let task = await DB.tasks.findUnique({
            where: { userId: userId, taskId: taskId }
        })

        return task ? task as Task : TASK_NOT_FOUND

    } catch (error: any) {
        console.log("-----------------------------")
        console.log(error.message)
        console.log(error.stack)
        console.log("-----------------------------")

        return GENERIC_THROW
    }
}

export = {

    getTaskById: getTaskById,

    getTasks: async (userId: bigint): Promise<Tasks | string> => {
        try{
            if(!await isUserValid(userId))
                return USER_NOT_FOUND

            let allTasks = await DB.tasks.findMany({
                where: { userId: userId }
            })

            if (allTasks.length > 0)
                return allTasks.map(task => {
                    let { taskId, userId, ...rest } = task
                    return {
                        taskId: taskId.toString(),
                        userId: userId.toString(),
                        ...rest
                    }
                }) as Tasks
            else 
                return TASKS_NOT_FOUND

        } catch (error: any) {
            console.log("-----------------------------")
            console.log(error.message)
            console.log(error.stack)
            console.log("-----------------------------")

            return GENERIC_THROW
        }
    },

    getTasksByTitle: async (userId: bigint, textToSearch: string): Promise<Tasks | string>=> {
        try{
            if(!await isUserValid(userId))
                return USER_NOT_FOUND

            let tasks = await DB.tasks.findMany({
                where: { 
                    userId: userId,
                    title: {
                        contains: textToSearch,
                        mode: 'insensitive',
                    } 
                }
            })

            if (tasks.length > 0)
                return tasks.map(task => {
                    let { taskId, userId, ...rest } = task
                    return {
                        taskId: taskId.toString(),
                        userId: userId.toString(),
                        ...rest
                    }
                }) as Tasks
            else 
                return TASKS_NOT_FOUND

        } catch (error: any) {
            console.log("-----------------------------")
            console.log(error.message)
            console.log(error.stack)
            console.log("-----------------------------")

            return GENERIC_THROW
        }
    },

    getTasksByStatus: async (userId: bigint, isCompleted: boolean): Promise<Tasks | string>=> {
        try{
            if(!await isUserValid(userId))
                return USER_NOT_FOUND

            let tasks = await DB.tasks.findMany({
                where: { 
                    userId: userId,
                    isCompleted: isCompleted
                }
            })

            if (tasks.length > 0)
                return tasks.map(task => {
                    let { taskId, userId, ...rest } = task
                    return {
                        taskId: taskId.toString(),
                        userId: userId.toString(),
                        ...rest
                    }
                }) as Tasks
            else 
                return TASKS_NOT_FOUND

        } catch (error: any) {
            console.log("-----------------------------")
            console.log(error.message)
            console.log(error.stack)
            console.log("-----------------------------")

            return GENERIC_THROW
        }
    },

    getTasksByPeriod: async (userId: bigint, startAt: string, endAt: string, timezone: string): Promise<Tasks | string> => {
        try{
            if(!await isUserValid(userId))
                return USER_NOT_FOUND

            const start_at = (DateTime.fromSQL(startAt, { zone: timezone })).toUTC().toISO()
            const end_at = (DateTime.fromSQL(endAt, { zone: timezone })).toUTC().toISO()

            if(!start_at || !end_at)
                return INVALID_PERIOD

            let tasks = await DB.tasks.findMany({
                where: { 
                    AND: [
                        { userId: userId },
                        { scheduledAt: { gte: start_at } },
                        { scheduledAt: { lte: end_at } },
                    ]
                }
            })

            if (tasks.length > 0)
                return tasks.map(task => {
                    let { taskId, userId, ...rest } = task
                    return {
                        taskId: taskId.toString(),
                        userId: userId.toString(),
                        ...rest
                    }
                }) as Tasks
            else 
                return TASKS_NOT_FOUND

        } catch (error: any) {
            console.log("-----------------------------")
            console.log(error.message)
            console.log(error.stack)
            console.log("-----------------------------")

            return GENERIC_THROW
        }
    },

    createTask: async (userId: bigint, task: Task): Promise<object | string>  => {
        try{
            if(!await isUserValid(userId))
                return USER_NOT_FOUND

            let result = await DB.tasks.create({
                data: {
                    title: task.title,
                    description: task.description,
                    isCompleted: task.isCompleted,
                    scheduledAt: task.scheduledAt,
                    userId: userId
                },
                select: {
                    taskId: true
                }
            })

            return {
                taskId: result.taskId.toString()
            }
        } catch (error: any) {
            console.log("-----------------------------")
            console.log(error.message)
            console.log(error.stack)
            console.log("-----------------------------")

            return GENERIC_THROW
        }
    },

    updateTask: async (userId: bigint, task: Task)=> {
        try{

            if(!await isUserValid(userId))
                return USER_NOT_FOUND

            let existTask = await getTaskById(userId, BigInt(task.taskId)) as TaskIdBigInt
            if(typeof existTask == "string")
                return existTask

            existTask.title = task?.title || existTask.title
            existTask.description = task?.description || existTask.description
            existTask.isCompleted = task?.isCompleted || existTask.isCompleted
            existTask.scheduledAt = task?.scheduledAt || existTask.scheduledAt
            existTask.updatedAt = new Date()

            let result = await DB.tasks.update({
                where: { taskId: existTask.taskId, userId: userId },
                data: existTask,
                select: {
                    taskId: true
                }
            })

            return {
                taskId: result.taskId.toString()
            }

        } catch (error: any) {
            console.log("-----------------------------")
            console.log(error.message)
            console.log(error.stack)
            console.log("-----------------------------")

            return GENERIC_THROW
        }
    },

    setTaskComplete: async (userId: bigint, taskId: bigint, status: boolean) => {
        try{
            if(!await isUserValid(userId))
                return USER_NOT_FOUND

            let task = await getTaskById(userId, taskId) as TaskIdBigInt
            if(typeof task == "string")
                return task

            task.isCompleted = status

            let result = await DB.tasks.update({
                where: { taskId: taskId, userId: userId },
                data: task,
                select: {
                    taskId: true
                }
            })

            return {
                taskId: result.taskId.toString()
            }

        } catch (error: any) {
            console.log("-----------------------------")
            console.log(error.message)
            console.log(error.stack)
            console.log("-----------------------------")

            return GENERIC_THROW
        }
    },

    deleteTask: async (userId: bigint, taskId: bigint) => {
        try{
            if(!await isUserValid(userId))
                return USER_NOT_FOUND

            let task = await getTaskById(userId, taskId)
            if(typeof task == "string")
                return task

            let result = await DB.tasks.delete({
                where: {
                    taskId: taskId,
                    userId: userId
                },
                select: {
                    taskId: true
                }
            })

            return {
                taskId: result.taskId.toString()
            }

        } catch (error: any) {
            console.log("-----------------------------")
            console.log(error.message)
            console.log(error.stack)
            console.log("-----------------------------")

            return GENERIC_THROW
        }
    },
}