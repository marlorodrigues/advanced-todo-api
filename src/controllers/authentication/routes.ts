import Controllers from './controllers'


module.exports = {
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