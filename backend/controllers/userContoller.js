const User=require("../models/User");
const bcrypt=require("bcrypt");
const Joi = require("joi");
const {CountryCodeRegEx,CountryCodeRegExErrorMessage}=require('../constants/CountryCodeRegEx');

const UserController={
    getUserDataController:async (req,res,next)=>{
        try {
            if(req.session.userId){
                const {DBdata,DBerror}=await User.getUserByID(req.session.userId);
                if(!DBerror)  res.status(200).json(DBdata);
                else    throw {message:DBerror , statusCode:200};
            }
            else    throw {message:"Your login data not found." , statusCode:200};

        } catch (error) {
            next(error);
        }
    },
    updateUserDataController:async (req,res,next)=>{
        try {
            const schema=Joi.object({
                fname:Joi.string().alphanum().min(3).max(100),
                lname:Joi.string().alphanum().min(3).max(100),
                email:Joi.string().max(50).email(),
                password:Joi.string().min(8).max(255),
                bio:Joi.string().trim().min(10).max(230),
                country_code:Joi.string().min(3).max(3).pattern(new RegExp(CountryCodeRegEx)).messages(CountryCodeRegExErrorMessage),
                gender:Joi.string().valid('M','F','O')
            });
            const {value:requestData,error}=schema.validate(req.body);
            if(!error){
                const {DBdata,DBerror}=await User.getUserByID(req.session.userId);
                if(DBerror)     throw {message:DBerror , statusCode:200};

                if(DBdata.length==0)    throw {message:`User Id ${req.session.userId} do not exist in database.` , statusCode:200};
                
                let isAnyChange=false;
                for (let [key, value] of Object.entries(requestData)) {
                    if(DBdata[0][key]!==value){
                        if(key==="password"){
                            if(await bcrypt.compare(value, DBdata[0][key])) continue;
                            DBdata[0][key] = await bcrypt.hash(value,10);
                        }    
                        else if(key==="email"){
                            const {DBdata:emailData,DBerror}=await User.getUserByEmail(value);
                            if(DBerror)     throw {message:DBerror , statusCode:200};
                            if(emailData.length!=0)     throw {message:"Email ID Already Exists." , statusCode:200};
                            DBdata[0][key]=value;
                        }
                        else    DBdata[0][key]=value;
                        isAnyChange=true;
                    }   
                }
                if(isAnyChange){
                    const {DBdata:updatedData,DBerror}=await User.updateUserData(DBdata[0]);
                    if(DBerror)     throw {message:DBerror , statusCode:200};
                    res.status(200).json(updatedData);
                }
                else    throw {message:"No appropriate data is given to update." , statusCode:200};
            }
            else    throw {message:error.message , statusCode:200};
        } catch (error) {
            next(error);
        }
    },
    deleteUserController:async (req,res,next)=>{
        try {
            if(req.session.userId){
                const {DBdata,DBerror}=await User.deleteUser(req.session.userId);
                req.session.destroy(err => {
                    if(!err){
                        res.clearCookie(process.env.SESSION_NAME);
                    }
                    if(!DBerror)  res.status(200).json(DBdata);
                    else    throw {message:DBerror , statusCode:200};
                });
            }
            else    throw {message:"Your login data not found." , statusCode:200};
        } catch (error) {
            next(error);
        }
    }
}

module.exports = UserController