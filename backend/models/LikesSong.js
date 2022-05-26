const db=require('../configure/mysqlConnection');
const Joi=require("joi");

const LikesSong={
    schema: {
        song_id:Joi.number().min(1).required()
    },
    async getAllSongsLikedByAUser(user_id){
        try {
            const [rows] = await db.query("SELECT s.`song_id`,`popularity` FROM `piano`.`likes_song` as ls join `piano`.`song` as s ON s.`song_id`=ls.`song_id` WHERE (ls.`user_id` = ? and `status`='PUB') ORDER BY `popularity` DESC;",[user_id]);
            return { DBdata:rows };
        } catch (error) {
            console.error(error.sqlMessage);
            return { DBerror: "Database Error Occured." };
        }
    },
    async getAllUsersWhoLikesASong(song_id){
        try {
            const [rows] = await db.query("SELECT u.`user_id`,`popularity` FROM `piano`.`likes_song` as ls join `piano`.`user` as u ON u.`user_id`=ls.`user_id` WHERE (`song_id` = ?) ORDER BY `popularity` DESC;",[song_id]);
            return { DBdata:rows };
        } catch (error) {
            console.error(error.sqlMessage);
            return { DBerror: "Database Error Occured." };
        }
    },
    async checkAUserLikesThisSong({user_id,song_id}){
        try {
            const [rows] = await db.query("SELECT * FROM `piano`.`likes_song` WHERE (`user_id` = ? and `song_id` = ?);",[user_id,song_id]);
            return { DBdata:rows };
        } catch (error) {
            console.error(error.sqlMessage);
            return { DBerror: "Database Error Occured." };
        }
    },
    async addNewUserWhoLikedASong({user_id,song_id}){
        try {
            const queryString="INSERT INTO `piano`.`likes_song` (`user_id`,`song_id`) VALUES (?, ?);";
            const [rows] = await db.query(queryString,[user_id,song_id]);

            const updatePopularity="UPDATE `piano`.`song` SET `popularity` = `popularity`+ 1 WHERE (`song_id` = ?);";
            const [_] = await db.query(updatePopularity,[song_id]);
            return { DBdata:rows };
        } catch (error) {
            console.error(error.sqlMessage);
            return { DBerror:"Database Error Occured." };
        }
    },
    async deleteUserWhoLikedASong({user_id,song_id}){
        try {
            const queryString="DELETE FROM `piano`.`likes_song` WHERE `user_id` = ? and `song_id` = ?;";
            const [rows] = await db.query(queryString,[user_id,song_id]);

            const updatePopularity="UPDATE `piano`.`song` SET `popularity` = `popularity`- 1 WHERE (`song_id` = ?);";
            const [_] = await db.query(updatePopularity,[song_id]);
            return { DBdata:rows };
        } catch (error) {
            console.error(error.sqlMessage);
            return { DBerror: "Database Error Occured." };
        }
    }
}

module.exports = LikesSong;