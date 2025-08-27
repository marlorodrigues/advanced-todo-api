import Joi from 'joi'

export = {
    LoginForm: (data: any) => {
        let schema = Joi.object({
            username: Joi.string().min(6).max(128).required(),
            password: Joi.string().min(8).max(256).required(),
        })

        return schema.validate(data)
    }
}
 