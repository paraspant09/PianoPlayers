const db=require('../configure/mysqlConnection');
const Joi=require("joi");

const Song={
    //:TODO song field regular expression for checking valid song format or else error occur while song playing
    schema: {
        song_name:Joi.string().regex(/^([a-zA-Z]+\s?)+$/).trim().min(3).max(50).required().messages({
            "string.pattern.base": "{{#label}} must be words with space between.!!",
        }),
        status:Joi.string().valid("PUB","PRI").required(),
        song:Joi.string().min(3).max(Math.pow(2,24)-1).required()
    },
    async getAllSongs(){
        try {
            const [rows] = await db.query("SELECT * FROM `piano`.`song` WHERE (`status` = 'PUB');");
            return { DBdata:rows };
        } catch (error) {
            console.error(error.sqlMessage);
            return { DBerror: "Database Error Occured." };
        }
    },
    async getSongBySongID(song_id,publicOnly){
        try {
            if(publicOnly){
                const [rows] = await db.query("SELECT * FROM `piano`.`song` WHERE (`song_id` = ? and status = 'PUB');",[song_id]);
                return { DBdata:rows };
            }
            const [rows] = await db.query("SELECT * FROM `piano`.`song` WHERE (`song_id` = ?);",[song_id]);
            return { DBdata:rows };
        } catch (error) {
            console.error(error.sqlMessage);
            return { DBerror: "Database Error Occured." };
        }
    },
    async getSongsByName(song_name,publicOnly){
        try {
            if(publicOnly){
                const [rows] = await db.query("SELECT * FROM `piano`.`song` WHERE (`song_name` LIKE CONCAT( '%',?,'%') and status = 'PUB') ORDER BY `popularity` DESC;",[song_name]);
                return { DBdata:rows };
            }
            const [rows] = await db.query("SELECT * FROM `piano`.`song` WHERE (`song_name` LIKE CONCAT( '%',?,'%')) ORDER BY `popularity` DESC;",[song_name]);
            return { DBdata:rows };
        } catch (error) {
            console.error(error.sqlMessage);
            return { DBerror: "Database Error Occured." };
        }
    },
    async getSongsByUserID(user_id,publicOnly){
        try {
            if(publicOnly){
                const [rows] = await db.query("SELECT * FROM `piano`.`song` WHERE (`user_id` = ? and status = 'PUB') ORDER BY `popularity` DESC;",[user_id]);
                return { DBdata:rows };
            }
            const [rows] = await db.query("SELECT * FROM `piano`.`song` WHERE (`user_id` = ?) ORDER BY `popularity` DESC;",[user_id]);
            return { DBdata:rows };
        } catch (error) {
            console.error(error.sqlMessage);
            return { DBerror: "Database Error Occured." };
        }
    },
    async addNewSong({song_name,user_id,status,song}){
        try {
            const queryString="INSERT INTO `piano`.`song` (`song_name`, `user_id`, `status`, `song`) VALUES (?, ?, ?, ?);";
            const [rows] = await db.query(queryString,[song_name,user_id,status,song]);
            return { DBdata: { message:rows.affectedRows>0 ? "Song added Successful." : "Song not added."} };
        } catch (error) {
            console.error(error.sqlMessage);
            return { DBerror:"Database Error Occured." };
        }
    },
    async updateASongData({song_id,song_name,status,song}){
        try {
            const queryString="UPDATE `piano`.`song` SET `song_name` = ?, `status` = ?, `song` = ? WHERE (`song_id` = ?);"
            const [rows] = await db.query(queryString,[song_name,status,song,song_id]);
            return { DBdata:{ message:rows.affectedRows>0 ? "Updation Successful." : "Updation Unsuccessful."} };
        } catch (error) {
            console.error(error.sqlMessage);
            return { DBerror: "Database Error Occured." };
        }  
    },
    async deleteSong(song_id){
        try {
            const queryString="DELETE FROM `piano`.`song` WHERE (`song_id` = ?);";
            const [rows] = await db.query(queryString,[song_id]);
            return { DBdata: { message:rows.affectedRows>0 ? "Deletion Successful." : "Deletion Unsuccessful."} };
        } catch (error) {
            console.error(error.sqlMessage);
            return { DBerror: "Database Error Occured." };
        }
        
    }
}

module.exports = Song;