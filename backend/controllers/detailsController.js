const Joi=require("joi");
const AddToLibrary = require("../models/AddToLibrary");
const Contains = require("../models/Contains");
const LikesArtist = require("../models/LikesArtist");
const LikesSong = require("../models/LikesSong");

const DetailsController={
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
            const {value:requestData,error}=schema.validate({playlist_id:req.params.id});
            if(!error){
                const {DBdata,DBerror}=await Contains.getAllSongsOfAPlaylist(requestData.playlist_id);
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