export const  validate = (schema) => {
    return (req , res , next) => {
        const result = schema.safeParse({
            body: req.body,
            query: req.query,
            params: req.params,
        });

        if(!result.success){
            return res.status(400).json({
                success: false,
                status: "validation error",
                details: result.error.issues,
            });
        }

        req.validate = result.data;

        next();
    };
};