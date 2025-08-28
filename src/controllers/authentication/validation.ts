import * as z from "zod";

interface ZodData {
    success: boolean
    error?: any
    data?: any
}

export = {
    LoginForm: (data: any): ZodData => {
        let schema = z.object({
            username: z.string().min(6).max(128),
            password: z.string().min(8).max(256),
        })

        let parsed = schema.safeParse(data)

        if(parsed.success)
            return parsed

        const tree = z.flattenError(parsed.error);

        return {
            success: false,
            error: Object.keys(tree.fieldErrors).length > 0 ? tree.fieldErrors : tree.formErrors
        }
        
    }
}
 