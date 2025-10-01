export interface Task {
    taskId: string | bigint
    userId: string | bigint
    title: string
    description?: string
    isCompleted: boolean
    scheduledAt?: Date
    createdAt: Date
    updatedAt: Date
    deletedAt: Date | null
}

export interface TaskIdBigInt {
    taskId: bigint
    userId: bigint
    title: string
    description?: string
    isCompleted: boolean
    scheduledAt?: Date
    createdAt: Date
    updatedAt: Date
    deletedAt: Date | null
}

export interface TaskIdString {
    taskId: string
    userId: string
    title: string
    description?: string
    isCompleted: boolean
    scheduledAt?: Date
    createdAt: Date
    updatedAt: Date
    deletedAt: Date | null
}


export type Tasks = Array<Task>
