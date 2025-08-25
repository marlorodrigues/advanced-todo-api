import DB from '@prisma/client'

interface ITasks {
    userId: bigint,
    title: string
    description?: string
    completed: boolean
    scheduledAt?: string
    createdAt: string
    updatedAt: string
}

type Task = Tasks | null
type Tasks = Array<Tasks>

function getAllTasks(userId: bigint): Promise<Tasks> {
    return Promise.resolve([]);
}

function getTaskById(userId: bigint, taskId: bigint): Promise<Task>{
    return Promise.resolve([]);
}

function createTask(userId: bigint){}

function updateTask(userId: bigint){}

function deleteTask(userId: bigint){}


export default {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
}