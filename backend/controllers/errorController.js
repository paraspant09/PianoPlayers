exports.error404Controller=async (req,res,next)=>{
    const error=new Error("File Not Found");
    error.status=404;
    next(error);
}
exports.error500Controller=async (error,req,res)=>{
    res.status(error.status | 500);
    res.json({
        error:{
            message: error.message,
        },
    });
}