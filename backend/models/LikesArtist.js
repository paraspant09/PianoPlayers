const db=require('../configure/mysqlConnection');
const Joi=require("joi");

const LikesArtist={
    schema: {
        artist_id:Joi.number().min(1).required()
    },
    async getAllArtistsLikedByAUser(user_id){
        try {
            const [rows] = await db.query("SELECT la.`artist_id`,`popularity` FROM `piano`.`likes_artist` as la join `piano`.`user` as u ON la.`artist_id`=u.`user_id` WHERE (la.`user_id` = ?) ORDER BY `popularity` DESC;",[user_id]);
            return { DBdata:rows };
        } catch (error) {
            console.error(error.sqlMessage);
            return { DBerror: "Database Error Occured." };
        }
    },
    async getAllUsersWhoLikesAnArtist(artist_id){
        try {
            const [rows] = await db.query("SELECT u.`user_id`,`popularity` FROM `piano`.`likes_artist` as la join `piano`.`user` as u ON u.`user_id`=la.`user_id` WHERE (`artist_id` = ?) ORDER BY `popularity` DESC;",[artist_id]);
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

            const updatePopularity="UPDATE `piano`.`user` SET `popularity` = `popularity`+ 1 WHERE (`user_id` = ?);";
            const [_] = await db.query(updatePopularity,[artist_id]);
            return { DBdata:{ message:rows.affectedRows>0 ? "Liked Successfully." : "Like Unsuccessful."} };
        } catch (error) {
            console.error(error.sqlMessage);
            return { DBerror:"Database Error Occured." };
        }
    },
    async deleteUserWhoLikedAnArtist({user_id,artist_id}){
        try {
            const queryString="DELETE FROM `piano`.`likes_artist` WHERE `user_id` = ? and `artist_id` = ?;";
            const [rows] = await db.query(queryString,[user_id,artist_id]);

            const updatePopularity="UPDATE `piano`.`user` SET `popularity` = `popularity`- 1 WHERE (`user_id` = ?);";
            const [_] = await db.query(updatePopularity,[artist_id]);
            return { DBdata:{ message:rows.affectedRows>0 ? "Removed Like Successfully." : "Like Removal Unsuccessful."} };
        } catch (error) {
            console.error(error.sqlMessage);
            return { DBerror: "Database Error Occured." };
        }
    }
}

module.exports = LikesArtist;