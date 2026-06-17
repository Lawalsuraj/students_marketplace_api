import logger from '../config/logger.js';

const errorHandler =(err,req,res,next)=>{

    let statusCode = err.statusCode || 500
    let message = err.message || 'something went wrong';

     logger.error({
        message: err.message,
        statusCode,
        method: req.method,
        url: req.url,
        timestamp: new Date(),
     });


    if(err.name === "CastError"){
        statusCode = 400
        message = 'invalid ID format';
    }

    if(err.code === 11000){
        const field = Object.keys(err.keyValue)[0];
        statusCode=409;
        message=`${field} already exist`;
    }

    if(err.name === 'validationEerror'){
        statusCode=400;
        message = Object.values(err.errors).map(e=>e.message).join(', ');
    }
        // console.log(err)

    res.status(statusCode).json({

        success:false,
        message

    })

}

export default errorHandler;