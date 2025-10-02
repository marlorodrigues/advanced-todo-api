import Controllers from './controllers'

export default {
    base: '/todo',
    routes: {
        PUBLIC: [],
        ONLY_VALID_TOKEN: [
            { url: 'tasks', method: 'get', handler: Controllers.getTasks },
            { url: 'tasks', method: 'post', handler: Controllers.createTask },
            { url: 'tasks', method: 'put', handler: Controllers.updateTask },
            { url: 'tasks', method: 'delete', handler: Controllers.deleteTask },
        ],
        ADMIN_ONY: [],
        COMMON: [],
    }
}