import Joi from 'joi'

export = {
    Create: (data: any) => {
        let schema = Joi.object({
            userId: Joi.number().min(0).required(),
            title: Joi.string().min(1).max(256).required(),
            isCompleted: Joi.boolean().default(false),
            scheduledAt: Joi.string().isoDate().optional()
        })

        return schema.validate(data)
    },

    Update: (data: any) => {
        let schema = Joi.object({
            taskId: Joi.number().min(0).required(),
            userId: Joi.number().min(0).required(),
            title: Joi.string().min(1).max(256).required(),
            isCompleted: Joi.boolean().default(false),
            scheduledAt: Joi.string().isoDate().optional()
        })

        return schema.validate(data)
    }
}
 