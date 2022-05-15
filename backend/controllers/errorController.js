const errorController=(error, _ , res,next)=>{
    res.status(error.statusCode).json({
        message:"An unexpected error occured.",
    });
}

module.exports = {errorController};