const asyncHandler=(RequestHandler)=>{
    Promise.resolve(RequestHandler(req,res,next)).catch((err)=>next(err));
}

export {asyncHandler};