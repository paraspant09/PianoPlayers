const db=require('../configure/mysqlConnection');
const Joi=require("joi");

const LikesArtist={
    schema: {
        artist_id:Joi.number().min(1).required()
    },
    async getAllArtistsLikedByAUser(user_id){
        try {
            const [rows] = await db.query("SELECT * FROM `piano`.`likes_artist` WHERE (`user_id` = ?);",[user_id]);
            return { DBdata:rows };
        } catch (error) {
            console.error(error.sqlMessage);
            return { DBerror: "Database Error Occured." };
        }
    },
    async getAllUsersWhoLikesAnArtist(artist_id){
        try {
            const [rows] = await db.query("SELECT * FROM `piano`.`likes_artist` WHERE (`artist_id` = ?);",[artist_id]);
            return { DBdata:rows };
        } catch (error) {
            console.error(error.sqlMessage);
            return { DBerror: "Database Error Occured." };
        }
    },
    async checkAUserLikesThisArtist({user_id,artist_id}){
        try {
            const [rows] = await db.query("SELECT * FROM `piano`.`likes_artist` WHERE (`user_id` = ? and `artist_id` = ?);",[user_id,artist_id]);
            return { DBdata:rows };
        } catch (error) {
            console.error(error.sqlMessage);
            return { DBerror: "Database Error Occured." };
        }
    },
    async addNewUserWhoLikedAnArtist({user_id,artist_id}){
        try {
            const queryString="INSERT INTO `piano`.`likes_artist` (`user_id`,`artist_id`) VALUES (?, ?);";
            const [rows] = await db.query(queryString,[user_id,artist_id]);
            return { DBdata:rows };
        } catch (error) {
            console.error(error.sqlMessage);
            return { DBerror:"Database Error Occured." };
        }
    },
    async deleteUserWhoLikedAnArtist({user_id,artist_id}){
        try {
            const queryString="DELETE FROM `piano`.`likes_artist` WHERE `user_id` = ? and `artist_id` = ?;";
            const [rows] = await db.query(queryString,[user_id,artist_id]);
            return { DBdata:rows };
        } catch (error) {
            console.error(error.sqlMessage);
            return { DBerror: "Database Error Occured." };
        }
    }
}

module.exports = LikesArtist;