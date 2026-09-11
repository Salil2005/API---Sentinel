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
                code: 400,
                details: result.error.issues,
            });
        }

        req.validated = result.data;

        next();
    };
};