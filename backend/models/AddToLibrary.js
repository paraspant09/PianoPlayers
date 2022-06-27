const db=require('../configure/mysqlConnection');
const Joi=require("joi");

const AddToLibrary={
    schema: {
        playlist_id:Joi.number().min(1).required()
    },
    async getAllPlaylistsAddedByAUser(user_id){
        try {
            const [rows] = await db.query("SELECT al.`playlist_id`,`playlist_name`,p.`user_id`,`creation_date`,`details`,`tag`,`popularity` FROM `piano`.`add_to_library` as al join `piano`.`playlist` as p ON al.`playlist_id`=p.`playlist_id` WHERE (al.`user_id` = ?) ORDER BY `popularity` DESC;",[user_id]);
            return { DBdata:rows };
        } catch (error) {
            console.error(error.sqlMessage);
            return { DBerror: "Database Error Occured." };
        }
    },
    async getAllUsersWhoAddedAPlaylist(playlist_id){
        try {
            const [rows] = await db.query("SELECT u.`user_id`,`popularity` FROM `piano`.`add_to_library` as al join `piano`.`user` as u ON u.`user_id`=al.`user_id` WHERE (`playlist_id` = ?) ORDER BY `popularity` DESC;",[playlist_id]);
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

            const updatePopularity="UPDATE `piano`.`playlist` SET `popularity` = `popularity`+ 1 WHERE (`playlist_id` = ?);";
            const [_] = await db.query(updatePopularity,[playlist_id]);
            return { DBdata:{ message:rows.affectedRows>0 ? "Liked Successfully." : "Like Unsuccessful."} };
        } catch (error) {
            console.error(error.sqlMessage);
            return { DBerror:"Database Error Occured." };
        }
    },
    async deleteUserWhoAddedAPlaylist({user_id,playlist_id}){
        try {
            const queryString="DELETE FROM `piano`.`add_to_library` WHERE `user_id` = ? and `playlist_id` = ?;";
            const [rows] = await db.query(queryString,[user_id,playlist_id]);

            const updatePopularity="UPDATE `piano`.`playlist` SET `popularity` = `popularity`- 1 WHERE (`playlist_id` = ?);";
            const [_] = await db.query(updatePopularity,[playlist_id]);
            return { DBdata:{ message:rows.affectedRows>0 ? "Removed Like Successfully." : "Like Removal Unsuccessful."} };
        } catch (error) {
            console.error(error.sqlMessage);
            return { DBerror: "Database Error Occured." };
        }
    }
}

module.exports = AddToLibrary;