function productionEnv(err,res){
    const response =  res.status(err.statusCode)
    .json({
        status: err.status,
        message: err.message
    })
    return response
}
function developmentEnv(err,res){
    const response =res.status(err.statusCode)
    .json({
        status: err.status,
        message: err.message,
        error: err,
        stack: err.stack

    })
    return response
}
module.exports = (err, req, res,next) =>{
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
     // handling castError
     if(err.name === "CastError"){
        err.message = ` the ${err.path} : ${err.value} not valid`
     }
    if(process.env.NODE_ENV === "production"){
        productionEnv(err,res)
     }
     if(process.env.NODE_ENV === "development"){
        developmentEnv(err,res)
     }
   
}