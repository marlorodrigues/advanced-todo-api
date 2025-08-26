import { PrismaClient } from '../../generated/prisma'

var options: any = {
    log: [
        { emit: 'stdout', level: 'warn' },
        { emit: 'stdout', level: 'error' }
    ]
}
const prisma = new PrismaClient(options);


if(process.env.NODE_ENV == "debug") {
    //@ts-expect-error
    prisma.$on("query", async (e) => {
        //@ts-expect-error
        console.log(`\x1b[32m QUERY:\x1b[0m`,`\t${e.query}`)
        //@ts-expect-error
        console.log('\x1b[33m PARAMS:\x1b[0m',`\t${e.params}\n\n`)
    });
}




export default prisma;

//@ts-expect-error
export const Metrics = prisma.$metrics
export const QueryRaw = prisma.$queryRaw
export const Transaction = prisma.$transaction
export const Disconnect = prisma.$disconnect
