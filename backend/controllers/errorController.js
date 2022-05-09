const errorController=(error, req, res,next)=>{
    // console.log(res,req);
    res.status(error.statusCode).json({
        error:{
            message: error,
        },
    });
}

module.exports = {errorController};