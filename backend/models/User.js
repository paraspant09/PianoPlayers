const db=require('../configure/mysqlConnection');
const Joi=require("joi");
const {CountryCodeRegEx,CountryCodeRegExErrorMessage}=require('../constants/CountryCodeRegEx')

const User={
    schema: {
        fname:Joi.string().alphanum().min(3).max(100).required(),
        lname:Joi.string().alphanum().min(3).max(100).default(null),
        email:Joi.string().max(50).email().required(),
        password:Joi.string().min(8).max(255).required(),
        bio:Joi.string().trim().min(10).max(230).default(null),
        country_code:Joi.string().min(3).max(3).pattern(new RegExp(CountryCodeRegEx)).required().messages(CountryCodeRegExErrorMessage),
        gender:Joi.string().valid('M','F','O').required()
    },
    async getAllUsers(){
        try {
            const [rows] = await db.query("SELECT * FROM user;");
            return { DBdata:rows };
        } catch (error) {
            console.error(error.sqlMessage);
            return { DBerror: "Database Error Occured." };
        }
    },
    async getUserByID(user_id){
        try {
            const [rows] = await db.query("SELECT * FROM user WHERE (`user_id` = ?);",[user_id]);
            return { DBdata:rows };
        } catch (error) {
            console.error(error.sqlMessage);
            return { DBerror: "Database Error Occured." };
        }
    },
    async getUserByEmail(email){
        try {
            const [rows] = await db.query("SELECT * FROM user WHERE (`email` = ?);",[email]);
            return { DBdata:rows };
        } catch (error) {
            console.error(error.sqlMessage);
            return { DBerror: "Database Error Occured." };
        }
    },
    async getAllUsersByName(nameBreak,nameLength){
        try {
            if(nameLength==1){
                const [rows] = await db.query("SELECT `user_id`,`fname`,`lname`,`bio` FROM user WHERE (`fname` LIKE CONCAT( '%',?,'%') or `lname` LIKE CONCAT( '%',?,'%'));",[nameBreak[0],nameBreak[0]]);
                return { DBdata:rows };
            }
            const [rows] = await db.query("SELECT `user_id`,`fname`,`lname`,`bio` FROM user WHERE (`fname` = ? and `lname` LIKE CONCAT( '%',?,'%'));",[nameBreak[0],nameBreak[1]]);
            return { DBdata:rows };
        } catch (error) {
            console.error(error.sqlMessage);
            return { DBerror: "Database Error Occured." };
        }
    },
    async addNewUser({fname,lname,email,password,bio,country_code,gender}){
        try {
            const queryString="INSERT INTO `piano`.`user` (`fname`,`lname`, `email`, `password`, `bio`, `country_code`, `gender`) VALUES (?, ?, ?, ?, ?, ?, ?);";
            const [rows] = await db.query(queryString,[fname,lname,email,password,bio,country_code,gender]);
            return { DBdata:rows };
        } catch (error) {
            console.error(error.sqlMessage);
            return { DBerror:"Database Error Occured." };
        }
    },
    async updateUserData({user_id,fname,lname,email,password,bio,country_code,gender}){
        try {
            const queryString="UPDATE `piano`.`user` SET `fname` = ?, `lname` = ?, `email` = ?, `password` = ?, `bio` = ?, `country_code` = ?, `gender` = ? WHERE (`user_id` = ?);"
            const [rows] = await db.query(queryString,[fname,lname,email,password,bio,country_code,gender,user_id]);
            return { DBdata:rows };
        } catch (error) {
            console.error(error.sqlMessage);
            return { DBerror: "Database Error Occured." };
        }  
    },
    async deleteUser(id){
        try {
            const queryString="DELETE FROM `piano`.`user` WHERE `user_id` = ?;";
            const [rows] = await db.query(queryString,[id]);
            return { DBdata:rows };
        } catch (error) {
            console.error(error.sqlMessage);
            return { DBerror: "Database Error Occured." };
        }
        
    }
}

module.exports = User;