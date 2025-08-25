import { PrismaClient } from '@prisma/client'

var options: any = {
    log: [
        { emit: 'stdout', level: 'warn' },
        { emit: 'stdout', level: 'error' }
    ]
}

const prisma = new PrismaClient(options);

export default prisma;

export const Metrics = prisma.$metrics
export const QueryRaw = prisma.$queryRaw
export const Transaction = prisma.$transaction
export const Disconnect = prisma.$disconnect
