const User=require("../models/User");

const getAllUsersController=async (req,res,next)=>{
    try {
        res.status(200).json(await User.getAllUsers());
    } catch (error) {
        if(!error.statusCode){
            error.statusCode=500;
        }
        next(error);
    }
}

const addNewUserController=async (req,res,next)=>{
    try {
        res.status(201).json(await User.addNewUser(req.body));
    } catch (error) {
        if(!error.statusCode){
            error.statusCode=500;
        }
        next(error);
    }
}

const updateUserDataController=async (req,res,next)=>{
    try {
        res.status(200).json(await User.updateUserData(req.body.user_id,req.body));
    } catch (error) {
        if(!error.statusCode){
            error.statusCode=500;
        }
        next(error);
    }
}

const deleteUserController=async (req,res,next)=>{
    try {
        res.status(200).json(await User.deleteUser(req.params.id));
    } catch (error) {
        if(!error.statusCode){
            error.statusCode=500;
        }
        next(error);
    }
}

module.exports = {
    getAllUsersController,
    addNewUserController,
    updateUserDataController,
    deleteUserController
}