const User=require("../models/User");

const UserController={
    getAllUsersController:async (req,res,next)=>{
        try {
            res.status(200).json(await User.getAllUsers());
        } catch (error) {
            if(!error.statusCode){
                error.statusCode=500;
            }
            next(error);
        }
    },
    getUserByIDController:async (req,res,next)=>{
        try {
            res.status(200).json(await User.getUserByID(req.params.id));
        } catch (error) {
            if(!error.statusCode){
                error.statusCode=500;
            }
            next(error);
        }
    },
    addNewUserController:async (req,res,next)=>{
        try {
            res.status(201).json(await User.addNewUser(req.body));
        } catch (error) {
            if(!error.statusCode){
                error.statusCode=500;
            }
            next(error);
        }
    },
    updateUserDataController:async (req,res,next)=>{
        try {
            let isAnyChange=false;
            const [data]=await User.getUserByID(req.params.id);

            for (let [key, value] of Object.entries(req.body)) {
                if(key!=="user_id" && key in data){
                    data[key]=value;
                    isAnyChange=true;
                }   
            }
            if(isAnyChange)
                res.status(200).json(await User.updateUserData(req.params.id,data));
            else
                res.status(200).json({message:"No data is given to change."});

        } catch (error) {
            if(!error.statusCode){
                error.statusCode=500;
            }
            next(error);
        }
    },
    deleteUserController:async (req,res,next)=>{
        try {
            res.status(200).json(await User.deleteUser(req.params.id));
        } catch (error) {
            if(!error.statusCode){
                error.statusCode=500;
            }
            next(error);
        }
    }
}

module.exports = UserController