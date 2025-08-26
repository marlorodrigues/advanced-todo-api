export interface Task {
    taskId: bigint
    userId: bigint
    title: string
    description?: string
    isCompleted: boolean
    scheduledAt?: Date
    createdAt: Date
    updatedAt: Date
}

export type Tasks = Array<Task>
