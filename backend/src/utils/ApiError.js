class ApiError extends Error{
    constructor(
        statusCode,
        massage='something went wrong',
        errors=[],
        stack=""
    ){
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.massage = massage
        this.success = false;
        this.errors = errors

        if(stack){
            this.stack=stack
        }
        else{
            Error.captureStackTrace(this,this.constructor)
        }
    }
}

export{ApiError};
export default ApiError;