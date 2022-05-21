const db=require('../configure/mysqlConnection');
const Joi=require("joi");

const AddToLibrary={
    schema: {
        playlist_id:Joi.number().min(1).required()
    },
    async getAllPlaylistsAddedByAUser(user_id){
        try {
            const [rows] = await db.query("SELECT * FROM `piano`.`add_to_library` WHERE (`user_id` = ?);",[user_id]);
            return { DBdata:rows };
        } catch (error) {
            console.error(error.sqlMessage);
            return { DBerror: "Database Error Occured." };
        }
    },
    async getAllUsersWhoAddedAPlaylist(playlist_id){
        try {
            const [rows] = await db.query("SELECT * FROM `piano`.`add_to_library` WHERE (`playlist_id` = ?);",[playlist_id]);
            return { DBdata:rows };
        } catch (error) {
            console.error(error.sqlMessage);
            return { DBerror: "Database Error Occured." };
        }
    },
    async checkAUserAddedThisPlaylist({user_id,playlist_id}){
        try {
            const [rows] = await db.query("SELECT * FROM `piano`.`add_to_library` WHERE (`user_id` = ? and `playlist_id` = ?);",[user_id,playlist_id]);
            return { DBdata:rows };
        } catch (error) {
            console.error(error.sqlMessage);
            return { DBerror: "Database Error Occured." };
        }
    },
    async addNewUserWhoAddedAPlaylist({user_id,playlist_id}){
        try {
            const queryString="INSERT INTO `piano`.`add_to_library` (`user_id`,`playlist_id`) VALUES (?, ?);";
            const [rows] = await db.query(queryString,[user_id,playlist_id]);
            return { DBdata:rows };
        } catch (error) {
            console.error(error.sqlMessage);
            return { DBerror:"Database Error Occured." };
        }
    },
    async deleteUserWhoAddedAPlaylist({user_id,playlist_id}){
        try {
            const queryString="DELETE FROM `piano`.`add_to_library` WHERE `user_id` = ? and `playlist_id` = ?;";
            const [rows] = await db.query(queryString,[user_id,playlist_id]);
            return { DBdata:rows };
        } catch (error) {
            console.error(error.sqlMessage);
            return { DBerror: "Database Error Occured." };
        }
    }
}

module.exports = AddToLibrary;