import Controllers from './controllers'


export default {
    base: '/users',
    routes: {
        PUBLIC: [
            { url: '', method: 'post', handler: Controllers.CreateUser}
        ],
        ONLY_VALID_TOKEN: [
            { url: '', method: 'get', handler: Controllers.FindAllUser }
        ],
        ADMIN_ONY: [],
        COMMON: [],
    }
}