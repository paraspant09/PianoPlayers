const User=require("../models/User");
const bcrypt=require("bcrypt");
const Joi = require("joi");
const {CountryCodeRegEx,CountryCodeRegExErrorMessage}=require('../constants/CountryCodeRegEx');

const UserController={
    getAllUsersController:async (req,res,next)=>{
        try {
            const {DBdata,DBerror}=await User.getAllUsers();
            if(!DBerror)  res.status(200).json(DBdata);
            else    res.status(200).json({error:DBerror});
        } catch (error) {
            if(!error.statusCode){
                error.statusCode=500;
            }
            next(error);
        }
    },
    getUserByIDController:async (req,res,next)=>{
        try {
            const schema=Joi.object({
                user_id:Joi.number().min(1).required()
            });
            const {value:requestData,error}=schema.validate({user_id:req.params.id});
            if(!error){
                const {DBdata,DBerror}=await User.getUserByID(requestData.user_id);
                if(!DBerror)  res.status(200).json(DBdata);
                else    res.status(200).json({error:DBerror});
            }
            else    res.status(200).json({message:error.message});

        } catch (error) {
            if(!error.statusCode){
                error.statusCode=500;
            }
            next(error);
        }
    },
    updateUserDataController:async (req,res,next)=>{
        try {
            const schema=Joi.object({
                user_id:Joi.number().min(1).required(),
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
                const {DBdata,DBerror}=await User.getUserByID(requestData.user_id);
                if(DBerror){
                    res.status(200).json({error:DBerror});
                    return;
                }
                if(DBdata.length==0){
                    res.status(200).json({error:`User Id ${requestData.user_id} do not exist in database.`});
                    return;
                }
                
                let isAnyChange=false;
                for (let [key, value] of Object.entries(requestData)) {
                    if(DBdata[0][key]!==value){
                        if(key==="password"){
                            if(await bcrypt.compare(value, DBdata[0][key])) continue;
                            DBdata[0][key] = await bcrypt.hash(value,10);
                        }    
                        else if(key==="email"){
                            const {DBdata:emailData,DBerror}=await User.getUserByEmail(value);
                            if(DBerror){
                                res.status(200).json({error:DBerror});
                                return;
                            }
                            if(emailData.length!=0){
                                res.status(200).json({error:"Email ID Already Exists."});
                                return;
                            }
                            DBdata[0][key]=value;
                        }
                        else    DBdata[0][key]=value;
                        isAnyChange=true;
                    }   
                }
                if(isAnyChange){
                    const {DBdata:updatedData,DBerror}=await User.updateUserData(DBdata[0]);
                    if(DBerror)
                        res.status(200).json({error:DBerror});
                    else    res.status(200).json(updatedData);
                }
                else
                    res.status(200).json({message:"No appropriate data is given to update."});
            }
            else    res.status(200).json({message:error.message});

        } catch (error) {
            if(!error.statusCode){
                error.statusCode=500;
            }
            next(error);
        }
    },
    deleteUserController:async (req,res,next)=>{
        try {
            const schema=Joi.object({
                user_id:Joi.number().min(1).required()
            });
            const {value:requestData,error}=schema.validate({user_id:req.params.id});
            if(!error){
                const {DBdata,DBerror}=await User.deleteUser(requestData.user_id);
                if(!DBerror)  res.status(200).json(DBdata);
                else    res.status(200).json({error:DBerror});
            }
            else    res.status(200).json({message:error.message});
        } catch (error) {
            if(!error.statusCode){
                error.statusCode=500;
            }
            next(error);
        }
    }
}

module.exports = UserController