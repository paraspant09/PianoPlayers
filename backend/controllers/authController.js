const User=require("../models/User");
const bcrypt=require("bcrypt");
const Joi=require("joi");

const AuthController={
    checkAuthorization: (req,_,next)=>{
        try {
            if(req.session.userId)
                next();
            else    throw {message:"You are not logged In." , statusCode:200};
        } catch (error) {
            next(error);
        }
    },
    registerController:async (req,res,next)=>{
        try {
            if(req.session.userId)      throw {message:"You are already logged In." , statusCode:200};

            const schema=Joi.object(User.schema);
            const {value:requestData,error}=schema.validate(req.body);
            if(!error){
                const {DBdata,DBerror}=await User.getUserByEmail(requestData.email);
                if(DBerror)     throw {message:DBerror , statusCode:200};
                
                if(DBdata.length==0){
                    requestData.password = await bcrypt.hash(requestData.password,10);
                    const {DBdata:insertRes,DBerror}=await User.addNewUser(requestData);
                    if(DBerror)     throw {message:DBerror , statusCode:200};

                    req.session.userId = insertRes.insertId;
                    res.status(200).json({message:`${requestData.fname},your login is succesful.`});
                }
                else    throw {message:"Email ID already existed." , statusCode:200};
            }
            else    throw {message:error.message , statusCode:200};
        } catch (error) {
            next(error);
        }
    },
    loginController:async (req,res,next)=>{
        try {
            if(req.session.userId)  throw {message:"You are already logged In." , statusCode:200};

            const schema=Joi.object({
                email:User.schema.email,
                password:User.schema.password
            });
            const {value:requestData,error}=schema.validate(req.body);
            if(!error){
                const {DBdata,DBerror}=await User.getUserByEmail(requestData.email);
                if(DBerror)     throw {message:DBerror , statusCode:200};
                
                if(DBdata.length!=0){
                    const passwordMatch=await bcrypt.compare(requestData.password, DBdata[0].password);
                    if(passwordMatch){
                        req.session.userId = DBdata[0].user_id;
                        res.status(200).json({message:`${DBdata[0].fname},your login is succesful.`});
                    }
                    else    throw {message:"Email/password does not exist." , statusCode:200};
                }
                else    throw {message:"Email/password does not exist." , statusCode:200};
            }
            else    throw {message:error.message , statusCode:200};
        } catch (error) {
            next(error);
        }
    },
    logoutController:(req,res,next)=>{
        try {
            req.session.destroy(err => {
                if(!err){
                    res.clearCookie(process.env.SESSION_NAME);
                    res.status(200).json({message:"Logged Out succesfully."});
                }
                else    throw {message:"Error Occured in Logging Out." , statusCode:200};
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = AuthController