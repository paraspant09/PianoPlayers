const db=require('../configure/mysqlConnection');

const User={
    async getAllUsers(){
        try {
            const [rows] = await db.query("SELECT * FROM user;");
            return rows;
        } catch (error) {
            console.error(error.sqlMessage);
            return {
                error:{
                    message: "Database Error Occured.",
                },
            };
        }
    },
    async getUserByID(user_id){
        try {
            const [rows] = await db.query("SELECT * FROM user WHERE (`user_id` = ?);",[user_id]);
            return rows;
        } catch (error) {
            console.error(error.sqlMessage);
            return {
                error:{
                    message: "Database Error Occured.",
                },
            };
        }
    },
    async addNewUser({fname,lname,email,password,bio,country_code,gender}){
        try {
            const queryString="INSERT INTO `piano`.`user` (`fname`,`lname`, `email`, `password`, `bio`, `country_code`, `gender`) VALUES (?, ?, ?, ?, ?, ?, ?);";
            const [rows] = await db.query(queryString,[fname,lname,email,password,bio,country_code,gender]);
            return rows;
        } catch (error) {
            console.error(error.sqlMessage);
            return {
                error:{
                    message: "Database Error Occured.",
                },
            };
        }
        
    },
    async updateUserData(user_id,{fname,lname,email,password,bio,country_code,gender}){
        try {
            const queryString="UPDATE `piano`.`user` SET `fname` = ?, `lname` = ?, `email` = ?, `password` = ?, `bio` = ?, `country_code` = ?, `gender` = ? WHERE (`user_id` = ?);"
            const [rows] = await db.query(queryString,[fname,lname,email,password,bio,country_code,gender,user_id]);
            return rows;
        } catch (error) {
            console.error(error.sqlMessage);
            return {
                error:{
                    message: "Database Error Occured.",
                },
            };
        }  
    },
    async deleteUser(id){
        try {
            const queryString="DELETE FROM `piano`.`user` WHERE `user_id` = ?;";
            const [rows] = await db.query(queryString,[id]);
            return rows;
        } catch (error) {
            console.error(error.sqlMessage);
            return {
                error:{
                    message: "Database Error Occured.",
                },
            };
        }
        
    }
}

module.exports = User;