const Joi=require("joi");
const AddToLibrary = require("../models/AddToLibrary");
const Contains = require("../models/Contains");
const LikesArtist = require("../models/LikesArtist");
const LikesSong = require("../models/LikesSong");
const Playlist = require("../models/Playlist");
const Song = require("../models/Song");
const User = require("../models/User");

const DetailsController={
    getUserDetailsController:async (req,res,next)=>{
        try {
            const schema=Joi.object({
                user_id:Joi.number().min(1).required()
            });
            const {value:requestData,error}=schema.validate({user_id:req.params.uid});
            if(!error){
                const {DBdata,DBerror}=await User.getUserByID(requestData.user_id,true);
                if(!DBerror)  res.status(200).json(DBdata);
                else    throw {message:DBerror , statusCode:200};
            }
            else    throw {message:error.message , statusCode:200};
        } catch (error) {
            next(error);
        }
    },
    getSongDetailsController:async (req,res,next)=>{
        try {
            const schema=Joi.object({
                song_id:Joi.number().min(1).required()
            });
            const {value:requestData,error}=schema.validate({song_id:req.params.sid});
            if(!error){
                const {DBdata,DBerror}=await Song.getSongBySongID(requestData.song_id,true);
                if(!DBerror)  res.status(200).json(DBdata);
                else    throw {message:DBerror , statusCode:200};
            }
            else    throw {message:error.message , statusCode:200};
        } catch (error) {
            next(error);
        }
    },
    getPlaylistDetailsController:async (req,res,next)=>{
        try {
            const schema=Joi.object({
                playlist_id:Joi.number().min(1).required()
            });
            const {value:requestData,error}=schema.validate({playlist_id:req.params.pid});
            if(!error){
                const {DBdata,DBerror}=await Playlist.getPlaylistByPlaylistID(requestData.playlist_id);
                if(!DBerror)  res.status(200).json(DBdata);
                else    throw {message:DBerror , statusCode:200};
            }
            else    throw {message:error.message , statusCode:200};
        } catch (error) {
            next(error);
        }
    },

    getLikesOfArtistController:async (req,res,next)=>{
        try {
            const schema=Joi.object(LikesArtist.schema);
            const {value:requestData,error}=schema.validate({artist_id:req.params.id});
            if(!error){
                const {DBdata,DBerror}=await LikesArtist.getAllUsersWhoLikesAnArtist(requestData.artist_id);
                if(!DBerror)  res.status(200).json(DBdata);
                else    throw {message:DBerror , statusCode:200};
            }
            else    throw {message:error.message , statusCode:200};
        } catch (error) {
            next(error);
        }
    },
    getLikesOfSongController:async (req,res,next)=>{
        try {
            const schema=Joi.object(LikesSong.schema);
            const {value:requestData,error}=schema.validate({song_id:req.params.id});
            if(!error){
                const {DBdata:songExistData,DBerror:songExistError}=await Song.getSongBySongID(requestData.song_id,false);
                if(songExistError)     throw {message:songExistError , statusCode:200};
    
                if(songExistData.length==0)    throw {message:`Song by this songid do not exist in database.` , statusCode:200};
                if(songExistData[0].status==="PRI")    throw {message:`Song is private cannot be searched on.` , statusCode:200};
                
                const {DBdata,DBerror}=await LikesSong.getAllUsersWhoLikesASong(requestData.song_id);
                if(!DBerror)  res.status(200).json(DBdata);
                else    throw {message:DBerror , statusCode:200};
            }
            else    throw {message:error.message , statusCode:200};
        } catch (error) {
            next(error);
        }
    },
    getAddsToLibraryOfPlaylistController:async (req,res,next)=>{
        try {
            const schema=Joi.object(AddToLibrary.schema);
            const {value:requestData,error}=schema.validate({playlist_id:req.params.id});
            if(!error){
                const {DBdata,DBerror}=await AddToLibrary.getAllUsersWhoAddedAPlaylist(requestData.playlist_id);
                if(!DBerror)  res.status(200).json(DBdata);
                else    throw {message:DBerror , statusCode:200};
            }
            else    throw {message:error.message , statusCode:200};
        } catch (error) {
            next(error);
        }
    },

    getAllSongsOfAPlaylistController:async (req,res,next)=>{
        try {
            const schema=Joi.object({
                playlist_id:Joi.number().min(1).required()
            });
            const {value:requestData,error}=schema.validate({playlist_id:req.params.pid});
            if(!error){
                const {DBdata,DBerror}=await Contains.getAllSongsOfAPlaylist(requestData.playlist_id);
                if(!DBerror)  res.status(200).json(DBdata);
                else    throw {message:DBerror , statusCode:200};
            }
            else    throw {message:error.message , statusCode:200};
        } catch (error) {
            next(error);
        }
    },
    getAllPlaylistsContainingASongController:async (req,res,next)=>{
        try {
            const schema=Joi.object({
                song_id:Joi.number().min(1).required()
            });
            const {value:requestData,error}=schema.validate({song_id:req.params.sid});
            if(!error){
                const {DBdata:songExistData,DBerror:songExistError}=await Song.getSongBySongID(requestData.song_id,false);
                if(songExistError)     throw {message:songExistError , statusCode:200};
    
                if(songExistData.length==0)    throw {message:`Song by this songid do not exist in database.` , statusCode:200};
                if(songExistData[0].status==="PRI")    throw {message:`Song is private cannot be searched on.` , statusCode:200};

                const {DBdata,DBerror}=await Contains.getAllPlaylistsContainingASong(requestData.song_id);
                if(!DBerror)  res.status(200).json(DBdata);
                else    throw {message:DBerror , statusCode:200};
            }
            else    throw {message:error.message , statusCode:200};
        } catch (error) {
            next(error);
        }
    },
    getPlaylistsOfAUserController:async (req,res,next)=>{
        try {
            const schema=Joi.object({
                user_id:Joi.number().min(1).required()
            });
            const {value:requestData,error}=schema.validate({user_id:req.params.uid});
            if(!error){
                const {DBdata,DBerror}=await Playlist.getPlaylistsByUserID(requestData.user_id);
                if(!DBerror)  res.status(200).json(DBdata);
                else    throw {message:DBerror , statusCode:200};
            }
            else    throw {message:error.message , statusCode:200};
        } catch (error) {
            next(error);
        }
    },
    getSongsOfAUserController:async (req,res,next)=>{
        try {
            const schema=Joi.object({
                user_id:Joi.number().min(1).required()
            });
            const {value:requestData,error}=schema.validate({user_id:req.params.uid});
            if(!error){
                const {DBdata,DBerror}=await Song.getSongsByUserID(requestData.user_id,true);
                if(!DBerror)  res.status(200).json(DBdata);
                else    throw {message:DBerror , statusCode:200};
            }
            else    throw {message:error.message , statusCode:200};
        } catch (error) {
            next(error);
        }
    }
}

module.exports = DetailsController