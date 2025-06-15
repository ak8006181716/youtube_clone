const asyncHandler =(requestHandler)=>{
    // This function takes a request handler and returns a new function that wraps the request handler in a Promise.
    // This is useful for handling errors in async functions without having to use try/catch blocks everywhere.
    return (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).catch((err)=> next(err))
    }
  
}



export {asyncHandler}