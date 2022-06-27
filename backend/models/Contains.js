const db=require('../configure/mysqlConnection');
const Joi=require("joi");

const Contains={
    schema: {
        playlist_id:Joi.number().min(1).required(),
        song_id:Joi.number().min(1).required()
    },
    async getAllSongsOfAPlaylist(playlist_id){
        try {
            const [rows] = await db.query("SELECT * FROM `piano`.`contains` as c join `piano`.`song` as s ON s.`song_id`=c.`song_id` WHERE (`playlist_id` = ? and `status`='PUB') ORDER BY `popularity` DESC;",[playlist_id]);
            return { DBdata:rows };
        } catch (error) {
            console.error(error.sqlMessage);
            return { DBerror: "Database Error Occured." };
        }
    },
    async getAllPlaylistsContainingASong(song_id){
        try {
            const [rows] = await db.query("SELECT * FROM `piano`.`contains` as c join `piano`.`playlist` as p ON p.`playlist_id`=c.`playlist_id` WHERE (`song_id` = ?) ORDER BY `popularity` DESC;",[song_id]);
            return { DBdata:rows };
        } catch (error) {
            console.error(error.sqlMessage);
            return { DBerror: "Database Error Occured." };
        }
    },
    async checkASongIsInThisPlaylist({song_id,playlist_id}){
        try {
            const [rows] = await db.query("SELECT * FROM `piano`.`contains` WHERE (`song_id` = ? and `playlist_id` = ?);",[song_id,playlist_id]);
            return { DBdata:rows };
        } catch (error) {
            console.error(error.sqlMessage);
            return { DBerror: "Database Error Occured." };
        }
    },
    async addNewSongInAPlaylist({song_id,playlist_id}){
        try {
            const queryString="INSERT INTO `piano`.`contains` (`song_id`,`playlist_id`) VALUES (?, ?);";
            const [rows] = await db.query(queryString,[song_id,playlist_id]);
            return { DBdata: { message:rows.affectedRows>0 ? "Song added in playlist." : "Song cannot added in playlist."} };
        } catch (error) {
            console.error(error.sqlMessage);
            return { DBerror:"Database Error Occured." };
        }
    },
    async deleteSongFromAPlaylist({song_id,playlist_id}){
        try {
            const queryString="DELETE FROM `piano`.`contains` WHERE `song_id` = ? and `playlist_id` = ?;";
            const [rows] = await db.query(queryString,[song_id,playlist_id]);
            return { DBdata: { message:rows.affectedRows>0 ? "Song removed from playlist." : "Song cannot removed from playlist."} };
        } catch (error) {
            console.error(error.sqlMessage);
            return { DBerror: "Database Error Occured." };
        }
    }
}

module.exports = Contains;