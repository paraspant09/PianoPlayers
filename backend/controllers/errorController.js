const errorController=(error, _ , res,next)=>{
    if(!error.statusCode){
        error.statusCode=500;
        error.message="An unexpected error occured.";
    }
    
    res.status(error.statusCode).json({
        message:error.message,
    });
}

module.exports = {errorController};