const db=require('../configure/mysqlConnection');
const Joi=require("joi");

const Playlist={
    schema: {
        playlist_name:Joi.string().regex(/^([a-zA-Z]+\s?)+$/).trim().min(3).max(50).required().messages({
            "string.pattern.base": "{{#label}} must be words with space between.!!",
        }),
        details:Joi.string().regex(/^[a-zA-Z\s]+.$/).trim().min(5).max(255).required().messages({
            "string.pattern.base": "{{#label}} must be words with space between( can be ended with full stop ) !!",
        }),
        tag:Joi.string().regex(/^#[a-zA-Z0-9(_)]+$/).min(3).max(30).required().messages({
            "string.pattern.base": "{{#label}} must be hashtags with or without underscores alphabet or numbers !!",
        })
    },
    async getAllPlaylists(){
        try {
            const [rows] = await db.query("SELECT * FROM `piano`.`playlist`;");
            return { DBdata:rows };
        } catch (error) {
            console.error(error.sqlMessage);
            return { DBerror: "Database Error Occured." };
        }
    },
    async getPlaylistByPlaylistID(playlist_id){
        try {
            const [rows] = await db.query("SELECT * FROM `piano`.`playlist` WHERE (`playlist_id` = ?);",[playlist_id]);
            return { DBdata:rows };
        } catch (error) {
            console.error(error.sqlMessage);
            return { DBerror: "Database Error Occured." };
        }
    },
    async getPlaylistsByName(playlist_name){
        try {
            const [rows] = await db.query("SELECT * FROM `piano`.`playlist` WHERE (`playlist_name` LIKE CONCAT( '%',?,'%')) ORDER BY `popularity` DESC;",[playlist_name]);
            return { DBdata:rows };
        } catch (error) {
            console.error(error.sqlMessage);
            return { DBerror: "Database Error Occured." };
        }
    },
    async getPlaylistsByUserID(user_id){
        try {
            const [rows] = await db.query("SELECT * FROM `piano`.`playlist` WHERE (`user_id` = ?) ORDER BY `popularity` DESC;",[user_id]);
            return { DBdata:rows };
        } catch (error) {
            console.error(error.sqlMessage);
            return { DBerror: "Database Error Occured." };
        }
    },
    async addNewPlaylist({playlist_name,user_id,details,tag}){
        try {
            const queryString="INSERT INTO `piano`.`playlist` (`playlist_name`, `user_id`, `details`, `tag`) VALUES (?, ?, ?, ?);";
            const [rows] = await db.query(queryString,[playlist_name,user_id,details,tag]);
            return { DBdata:rows };
        } catch (error) {
            console.error(error.sqlMessage);
            return { DBerror:"Database Error Occured." };
        }
    },
    async updateAPlaylistData({playlist_id,playlist_name,details,tag}){
        try {
            const queryString="UPDATE `piano`.`playlist` SET `playlist_name` = ?, `details` = ?, `tag` = ? WHERE (`playlist_id` = ?);"
            const [rows] = await db.query(queryString,[playlist_name,details,tag,playlist_id]);
            return { DBdata:rows };
        } catch (error) {
            console.error(error.sqlMessage);
            return { DBerror: "Database Error Occured." };
        }  
    },
    async deletePlaylist(playlist_id){
        try {
            const queryString="DELETE FROM `piano`.`playlist` WHERE (`playlist_id` = ?);";
            const [rows] = await db.query(queryString,[playlist_id]);
            return { DBdata:rows };
        } catch (error) {
            console.error(error.sqlMessage);
            return { DBerror: "Database Error Occured." };
        }
        
    }
}

module.exports = Playlist;