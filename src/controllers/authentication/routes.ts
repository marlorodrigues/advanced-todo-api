import Controllers from './controllers'


export default {
    base: '/authentication',
    routes: {
        PUBLIC: [
            { url: 'login', method: 'post', handler: Controllers.makeLogin}
        ],
        ONLY_VALID_TOKEN: [],
        ADMIN_ONY: [],
        COMMON: [],
    }
}