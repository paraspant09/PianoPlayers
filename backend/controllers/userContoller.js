const bcrypt=require("bcrypt");
const Joi = require("joi");
const {CountryCodeRegEx,CountryCodeRegExErrorMessage}=require('../constants/CountryCodeRegEx');
const User=require("../models/User");
const Song = require("../models/Song");
const Playlist = require('../models/Playlist');
const LikesArtist = require("../models/LikesArtist");
const LikesSong = require("../models/LikesSong");
const AddToLibrary = require("../models/AddToLibrary");
const Contains = require("../models/Contains");

const UserController={
    getUserDataController:async (req,res,next)=>{
        try {
            if(req.session.userId){
                const {DBdata,DBerror}=await User.getUserByID(req.session.userId,false);
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
                const {DBdata,DBerror}=await User.getUserByID(req.session.userId,false);
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
    },

    // /user/song
    getUserSongsController:async (req,res,next)=>{
        try {
            if(req.session.userId){
                const {DBdata,DBerror}=await Song.getSongsByUserID(req.session.userId,false);
                if(!DBerror)  res.status(200).json(DBdata);
                else    throw {message:DBerror , statusCode:200};
            }
            else    throw {message:"Your login data not found." , statusCode:200};

        } catch (error) {
            next(error);
        }
    },
    createNewSongController:async (req,res,next)=>{
        try {
            if(!req.session.userId)      throw {message:"You are not logged In." , statusCode:200};
            else{
                const schema=Joi.object(Song.schema);
                const {value:requestData,error}=schema.validate(req.body);
                if(!error){
                    const {DBdata:insertRes,DBerror}=await Song.addNewSong({
                        user_id:req.session.userId,
                        ...requestData
                    });
                    if(DBerror)     throw {message:DBerror , statusCode:200};
    
                    res.status(200).json({message:insertRes});
                }
                else    throw {message:error.message , statusCode:200};
            }
        } catch (error) {
            next(error);
        }
    },
    updateUserSongDataController:async (req,res,next)=>{
        try {
            if(!req.session.userId)  throw {message:"Your login data not found." , statusCode:200};
            else{
                const schema=Joi.object({
                    song_id:Joi.number().min(1).required(),
                    song_name:Joi.string().regex(/^([a-zA-Z]+\s?)+$/).trim().min(3).max(50).messages({
                        "string.pattern.base": "{{#label}} must be words with space between.!!",
                    }),
                    status:Joi.string().valid("PUB","PRI"),
                    song:Joi.string().min(3).max(Math.pow(2,24)-1)
                });
                const {value:requestData,error}=schema.validate(req.body);
                if(!error){
                    const {DBdata,DBerror}=await Song.getSongBySongID(requestData.song_id,false);
                    if(DBerror)     throw {message:DBerror , statusCode:200};
    
                    if(DBdata.length==0)    throw {message:"This Song do not exist in database." , statusCode:200};
                    
                    if(DBdata[0].user_id !== req.session.userId)     throw {message:"You cannot update other user's song data." , statusCode:200};
                    
                    let isAnyChange=false;
                    for (let [key, value] of Object.entries(requestData)) {
                        if(DBdata[0][key]!==value){
                            DBdata[0][key]=value;
                            isAnyChange=true;
                        }   
                    }
                    if(isAnyChange){
                        const {DBdata:updatedData,DBerror}=await Song.updateASongData(DBdata[0]);
                        if(DBerror)     throw {message:DBerror , statusCode:200};
                        res.status(200).json(updatedData);
                    }
                    else    throw {message:"No appropriate data is given to update." , statusCode:200};
                }
                else    throw {message:error.message , statusCode:200};
            }
        } catch (error) {
            next(error);
        }
    },
    deleteASongController:async (req,res,next)=>{
        try {
            if(req.session.userId){
                const schema=Joi.object({
                    song_id:Joi.number().min(1).required()
                });
                const {value:requestData,error}=schema.validate(req.body);
                if(!error){
                    const {DBdata:songData,DBerror:songError}=await Song.getSongBySongID(requestData.song_id,false);
                    if(songError)     throw {message:songError , statusCode:200};
    
                    if(songData.length==0)    throw {message:"This Song do not exist in database." , statusCode:200};
                    
                    if(songData[0].user_id !== req.session.userId)     throw {message:"You cannot delete other user's songs." , statusCode:200};

                    const {DBdata,DBerror}=await Song.deleteSong(requestData.song_id);
                    
                    if(!DBerror)  res.status(200).json(DBdata);
                    else    throw {message:DBerror , statusCode:200};
                }
                else    throw {message:error.message , statusCode:200};
            }
            else    throw {message:"Your login data not found." , statusCode:200};
        } catch (error) {
            next(error);
        }
    },

    // /user/playlist
    getUserPlaylistsController:async (req,res,next)=>{
        try {
            if(req.session.userId){
                const {DBdata,DBerror}=await Playlist.getPlaylistsByUserID(req.session.userId);
                if(!DBerror)  res.status(200).json(DBdata);
                else    throw {message:DBerror , statusCode:200};
            }
            else    throw {message:"Your login data not found." , statusCode:200};

        } catch (error) {
            next(error);
        }
    },
    createNewPlaylistController:async (req,res,next)=>{
        try {
            if(!req.session.userId)      throw {message:"You are not logged In." , statusCode:200};
            else{
                const schema=Joi.object(Playlist.schema);
                const {value:requestData,error}=schema.validate(req.body);
                if(!error){
                    const {DBdata:insertRes,DBerror}=await Playlist.addNewPlaylist({
                        user_id:req.session.userId,
                        ...requestData
                    });
                    if(DBerror)     throw {message:DBerror , statusCode:200};
    
                    res.status(200).json({message:insertRes});
                }
                else    throw {message:error.message , statusCode:200};
            }
        } catch (error) {
            next(error);
        }
    },
    updateUserPlaylistDataController:async (req,res,next)=>{
        try {
            if(!req.session.userId)  throw {message:"Your login data not found." , statusCode:200};
            else{
                const schema=Joi.object({
                    playlist_id:Joi.number().min(1).required(),
                    playlist_name:Joi.string().regex(/^([a-zA-Z]+\s?)+$/).trim().min(3).max(50).messages({
                        "string.pattern.base": "{{#label}} must be words with space between.!!",
                    }),
                    details:Joi.string().regex(/^[a-zA-Z\s]+.$/).trim().min(5).max(255).messages({
                        "string.pattern.base": "{{#label}} must be words with space between( can be ended with full stop ) !!",
                    }),
                    tag:Joi.string().regex(/^#[a-zA-Z0-9(_)]+$/).min(3).max(30).messages({
                        "string.pattern.base": "{{#label}} must be hashtags with or without underscores alphabet or numbers !!",
                    })
                });
                const {value:requestData,error}=schema.validate(req.body);
                if(!error){
                    const {DBdata,DBerror}=await Playlist.getPlaylistByPlaylistID(requestData.playlist_id);
                    if(DBerror)     throw {message:DBerror , statusCode:200};
    
                    if(DBdata.length==0)    throw {message:"This Playlist do not exist in database." , statusCode:200};
                    
                    if(DBdata[0].user_id !== req.session.userId)     throw {message:"You cannot update other user's playlist data." , statusCode:200};
                    
                    let isAnyChange=false;
                    for (let [key, value] of Object.entries(requestData)) {
                        if(DBdata[0][key]!==value){
                            DBdata[0][key]=value;
                            isAnyChange=true;
                        }   
                    }
                    if(isAnyChange){
                        const {DBdata:updatedData,DBerror}=await Playlist.updateAPlaylistData(DBdata[0]);
                        if(DBerror)     throw {message:DBerror , statusCode:200};
                        res.status(200).json(updatedData);
                    }
                    else    throw {message:"No appropriate data is given to update." , statusCode:200};
                }
                else    throw {message:error.message , statusCode:200};
            }
        } catch (error) {
            next(error);
        }
    },
    deleteAPlaylistController:async (req,res,next)=>{
        try {
            if(req.session.userId){
                const schema=Joi.object({
                    playlist_id:Joi.number().min(1).required()
                });
                const {value:requestData,error}=schema.validate(req.body);
                if(!error){
                    const {DBdata:playlistData,DBerror:playlistError}=await Playlist.getPlaylistByPlaylistID(requestData.playlist_id);
                    if(playlistError)     throw {message:playlistError , statusCode:200};
    
                    if(playlistData.length==0)    throw {message:"This Playlist do not exist in database." , statusCode:200};
                    
                    if(playlistData[0].user_id !== req.session.userId)     throw {message:"You cannot delete other user's playlists." , statusCode:200};

                    const {DBdata,DBerror}=await Playlist.deletePlaylist(requestData.playlist_id);
                    
                    if(!DBerror)  res.status(200).json(DBdata);
                    else    throw {message:DBerror , statusCode:200};
                }
                else    throw {message:error.message , statusCode:200};
            }
            else    throw {message:"Your login data not found." , statusCode:200};
        } catch (error) {
            next(error);
        }
    },

    // /user/like/artist
    getAllArtistsLikedByAUserController:async (req,res,next)=>{
        try {
            if(req.session.userId){
                const {DBdata,DBerror}=await LikesArtist.getAllArtistsLikedByAUser(req.session.userId);
                if(!DBerror)  res.status(200).json(DBdata);
                else    throw {message:DBerror , statusCode:200};
            }
            else    throw {message:"Your login data not found." , statusCode:200};

        } catch (error) {
            next(error);
        }
    },
    addNewUserWhoLikedAnArtistController:async (req,res,next)=>{
        try {
            if(!req.session.userId)      throw {message:"You are not logged In." , statusCode:200};
            else{
                const schema=Joi.object(LikesArtist.schema);
                const {value:requestData,error}=schema.validate(req.body);
                if(!error){
                    const {DBdata:userExistData,DBerror:userExistError}=await User.getUserByID(requestData.artist_id,true);
                    if(userExistError)     throw {message:userExistError , statusCode:200};
    
                    if(userExistData.length==0)    throw {message:`Artist by this userid do not exist in database.` , statusCode:200};

                    const {DBdata:likesAnArtistData,DBerror:likesAnArtistError}=await LikesArtist.checkAUserLikesThisArtist({
                        user_id:req.session.userId,
                        artist_id:requestData.artist_id
                    });
                    if(likesAnArtistError)     throw {message:likesAnArtistError , statusCode:200};
    
                    if(likesAnArtistData.length!==0)    throw {message:"You already likes this artist." , statusCode:200};

                    const {DBdata:insertRes,DBerror}=await LikesArtist.addNewUserWhoLikedAnArtist({
                        user_id:req.session.userId,
                        ...requestData
                    });
                    if(DBerror)     throw {message:DBerror , statusCode:200};
    
                    res.status(200).json({message:insertRes});
                }
                else    throw {message:error.message , statusCode:200};
            }
        } catch (error) {
            next(error);
        }
    },
    deleteUserWhoLikedAnArtistController:async (req,res,next)=>{
        try {
            if(req.session.userId){
                const schema=Joi.object(LikesArtist.schema);
                const {value:requestData,error}=schema.validate(req.body);
                if(!error){
                    const {DBdata:userExistData,DBerror:userExistError}=await User.getUserByID(requestData.artist_id,true);
                    if(userExistError)     throw {message:userExistError , statusCode:200};
    
                    if(userExistData.length==0)    throw {message:`Artist by this userid do not exist in database.` , statusCode:200};
                    
                    const {DBdata:likesAnArtistData,DBerror:likesAnArtistError}=await LikesArtist.checkAUserLikesThisArtist({
                        user_id:req.session.userId,
                        artist_id:requestData.artist_id
                    });
                    if(likesAnArtistError)     throw {message:likesAnArtistError , statusCode:200};
    
                    if(likesAnArtistData.length==0)    throw {message:"You currently do not likes this artist." , statusCode:200};

                    const {DBdata,DBerror}=await LikesArtist.deleteUserWhoLikedAnArtist({
                        user_id:req.session.userId,
                        artist_id:requestData.artist_id
                    });
                    
                    if(!DBerror)  res.status(200).json(DBdata);
                    else    throw {message:DBerror , statusCode:200};
                }
                else    throw {message:error.message , statusCode:200};
            }
            else    throw {message:"Your login data not found." , statusCode:200};
        } catch (error) {
            next(error);
        }
    },

    // /user/like/song
    getAllSongsLikedByAUserController:async (req,res,next)=>{
        try {
            if(req.session.userId){
                const {DBdata,DBerror}=await LikesSong.getAllSongsLikedByAUser(req.session.userId);
                if(!DBerror)  res.status(200).json(DBdata);
                else    throw {message:DBerror , statusCode:200};
            }
            else    throw {message:"Your login data not found." , statusCode:200};

        } catch (error) {
            next(error);
        }
    },
    addNewUserWhoLikedASongController:async (req,res,next)=>{
        try {
            if(!req.session.userId)      throw {message:"You are not logged In." , statusCode:200};
            else{
                const schema=Joi.object(LikesSong.schema);
                const {value:requestData,error}=schema.validate(req.body);
                if(!error){
                    const {DBdata:songExistData,DBerror:songExistError}=await Song.getSongBySongID(requestData.song_id,false);
                    if(songExistError)     throw {message:songExistError , statusCode:200};
    
                    if(songExistData.length==0)    throw {message:`Song by this songid do not exist in database.` , statusCode:200};

                    if(songExistData[0].status==="PRI")    throw {message:`You cannot like a private song.` , statusCode:200};

                    const {DBdata:likesASongData,DBerror:likesASongError}=await LikesSong.checkAUserLikesThisSong({
                        user_id:req.session.userId,
                        song_id:requestData.song_id
                    });
                    if(likesASongError)     throw {message:likesASongError , statusCode:200};
    
                    if(likesASongData.length!==0)    throw {message:"You already likes this song." , statusCode:200};

                    const {DBdata:insertRes,DBerror}=await LikesSong.addNewUserWhoLikedASong({
                        user_id:req.session.userId,
                        ...requestData
                    });
                    if(DBerror)     throw {message:DBerror , statusCode:200};
    
                    res.status(200).json({message:insertRes});
                }
                else    throw {message:error.message , statusCode:200};
            }
        } catch (error) {
            next(error);
        }
    },
    deleteUserWhoLikedASongController:async (req,res,next)=>{
        try {
            if(req.session.userId){
                const schema=Joi.object(LikesSong.schema);
                const {value:requestData,error}=schema.validate(req.body);
                if(!error){
                    const {DBdata:songExistData,DBerror:songExistError}=await Song.getSongBySongID(requestData.song_id,false);
                    if(songExistError)     throw {message:songExistError , statusCode:200};
    
                    if(songExistData.length==0)    throw {message:`Song by this songid do not exist in database.` , statusCode:200};
                    
                    const {DBdata:likesASongData,DBerror:likesASongError}=await LikesSong.checkAUserLikesThisSong({
                        user_id:req.session.userId,
                        song_id:requestData.song_id
                    });
                    if(likesASongError)     throw {message:likesASongError , statusCode:200};
    
                    if(likesASongData.length==0)    throw {message:"You currently do not likes this song." , statusCode:200};

                    const {DBdata,DBerror}=await LikesSong.deleteUserWhoLikedASong({
                        user_id:req.session.userId,
                        song_id:requestData.song_id
                    });
                    
                    if(!DBerror)  res.status(200).json(DBdata);
                    else    throw {message:DBerror , statusCode:200};
                }
                else    throw {message:error.message , statusCode:200};
            }
            else    throw {message:"Your login data not found." , statusCode:200};
        } catch (error) {
            next(error);
        }
    },

    // /user/add/playlist
    getAllPlaylistsAddedByAUserController:async (req,res,next)=>{
        try {
            if(req.session.userId){
                const {DBdata,DBerror}=await AddToLibrary.getAllPlaylistsAddedByAUser(req.session.userId);
                if(!DBerror)  res.status(200).json(DBdata);
                else    throw {message:DBerror , statusCode:200};
            }
            else    throw {message:"Your login data not found." , statusCode:200};

        } catch (error) {
            next(error);
        }
    },
    addNewUserWhoAddedAPlaylistController:async (req,res,next)=>{
        try {
            if(!req.session.userId)      throw {message:"You are not logged In." , statusCode:200};
            else{
                const schema=Joi.object(AddToLibrary.schema);
                const {value:requestData,error}=schema.validate(req.body);
                if(!error){
                    const {DBdata:playlistExistData,DBerror:playlistExistError}=await Playlist.getPlaylistByPlaylistID(requestData.playlist_id);
                    if(playlistExistError)     throw {message:playlistExistError , statusCode:200};
    
                    if(playlistExistData.length==0)    throw {message:`Playlist by this playlistid do not exist in database.` , statusCode:200};

                    const {DBdata:addAPlaylistData,DBerror:addAPlaylistError}=await AddToLibrary.checkAUserAddedThisPlaylist({
                        user_id:req.session.userId,
                        playlist_id:requestData.playlist_id
                    });
                    if(addAPlaylistError)     throw {message:addAPlaylistError , statusCode:200};
    
                    if(addAPlaylistData.length!==0)    throw {message:"You already added this playlist." , statusCode:200};

                    const {DBdata:insertRes,DBerror}=await AddToLibrary.addNewUserWhoAddedAPlaylist({
                        user_id:req.session.userId,
                        ...requestData
                    });
                    if(DBerror)     throw {message:DBerror , statusCode:200};
    
                    res.status(200).json({message:insertRes});
                }
                else    throw {message:error.message , statusCode:200};
            }
        } catch (error) {
            next(error);
        }
    },
    deleteUserWhoAddedAPlaylistController:async (req,res,next)=>{
        try {
            if(req.session.userId){
                const schema=Joi.object(AddToLibrary.schema);
                const {value:requestData,error}=schema.validate(req.body);
                if(!error){
                    const {DBdata:playlistExistData,DBerror:playlistExistError}=await Playlist.getPlaylistByPlaylistID(requestData.playlist_id);
                    if(playlistExistError)     throw {message:playlistExistError , statusCode:200};
    
                    if(playlistExistData.length==0)    throw {message:`Playlist by this playlistid do not exist in database.` , statusCode:200};
                    
                    const {DBdata:addAPlaylistData,DBerror:addAPlaylistError}=await AddToLibrary.checkAUserAddedThisPlaylist({
                        user_id:req.session.userId,
                        playlist_id:requestData.playlist_id
                    });
                    if(addAPlaylistError)     throw {message:addAPlaylistError , statusCode:200};
    
                    if(addAPlaylistData.length==0)    throw {message:"You currently had not added this playlist." , statusCode:200};

                    const {DBdata,DBerror}=await AddToLibrary.deleteUserWhoAddedAPlaylist({
                        user_id:req.session.userId,
                        playlist_id:requestData.playlist_id
                    });
                    
                    if(!DBerror)  res.status(200).json(DBdata);
                    else    throw {message:DBerror , statusCode:200};
                }
                else    throw {message:error.message , statusCode:200};
            }
            else    throw {message:"Your login data not found." , statusCode:200};
        } catch (error) {
            next(error);
        }
    },

    // /user/add/song
    addNewSongInAPlaylistController:async (req,res,next)=>{
        try {
            if(!req.session.userId)      throw {message:"You are not logged In." , statusCode:200};
            else{
                const schema=Joi.object(Contains.schema);
                const {value:requestData,error}=schema.validate(req.body);
                if(!error){
                    const {DBdata:playlistExistData,DBerror:playlistExistError}=await Playlist.getPlaylistByPlaylistID(requestData.playlist_id);
                    if(playlistExistError)     throw {message:playlistExistError , statusCode:200};
    
                    if(playlistExistData.length==0)    throw {message:`Playlist by this playlistid do not exist in database.` , statusCode:200};

                    const {DBdata:songExistData,DBerror:songExistError}=await Song.getSongBySongID(requestData.song_id,false);
                    if(songExistError)     throw {message:songExistError , statusCode:200};
    
                    if(songExistData.length==0)    throw {message:`Song by this songid do not exist in database.` , statusCode:200};
                    if(songExistData[0].status==="PRI")    throw {message:`Song is private cannot be addded in any playlist.` , statusCode:200};
                    
                    if(playlistExistData[0].user_id!==req.session.userId)    throw {message:`This playlist do not belongs to you only owner can add songs.` , statusCode:200};

                    const {DBdata:addAPlaylistData,DBerror:addAPlaylistError}=await Contains.checkASongIsInThisPlaylist(requestData);
                    if(addAPlaylistError)     throw {message:addAPlaylistError , statusCode:200};
    
                    if(addAPlaylistData.length!==0)    throw {message:"You already added this song in this playlist." , statusCode:200};

                    const {DBdata:insertRes,DBerror}=await Contains.addNewSongInAPlaylist(requestData);
                    if(DBerror)     throw {message:DBerror , statusCode:200};
    
                    res.status(200).json({message:insertRes});
                }
                else    throw {message:error.message , statusCode:200};
            }
        } catch (error) {
            next(error);
        }
    },
    deleteSongFromAPlaylistController:async (req,res,next)=>{
        try {
            if(req.session.userId){
                const schema=Joi.object(Contains.schema);
                const {value:requestData,error}=schema.validate(req.body);
                if(!error){
                    const {DBdata:playlistExistData,DBerror:playlistExistError}=await Playlist.getPlaylistByPlaylistID(requestData.playlist_id);
                    if(playlistExistError)     throw {message:playlistExistError , statusCode:200};
    
                    if(playlistExistData.length==0)    throw {message:`Playlist by this playlistid do not exist in database.` , statusCode:200};
                    if(playlistExistData[0].user_id!==req.session.userId)    throw {message:`This playlist do not belongs to you only owner can delete songs.` , statusCode:200};

                    const {DBdata:songInAPlaylistData,DBerror:songInAPlaylistError}=await Contains.checkASongIsInThisPlaylist(requestData);
                    if(songInAPlaylistError)     throw {message:songInAPlaylistError , statusCode:200};
    
                    if(songInAPlaylistData.length==0)    throw {message:"You currently had not added this song in this playlist." , statusCode:200};

                    const {DBdata,DBerror}=await Contains.deleteSongFromAPlaylist(requestData);
                    
                    if(!DBerror)  res.status(200).json(DBdata);
                    else    throw {message:DBerror , statusCode:200};
                }
                else    throw {message:error.message , statusCode:200};
            }
            else    throw {message:"Your login data not found." , statusCode:200};
        } catch (error) {
            next(error);
        }
    }
}

module.exports = UserController