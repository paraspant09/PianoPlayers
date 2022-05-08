const db=require('../configure/mysqlConnection');

class User{
    constructor(user_id,fname,lname,email,password,bio,country_code,gender){
        this.user_id=user_id;
        this.fname=fname;
        this.lname=lname;
        this.email=email;
        this.password=password;
        this.bio=bio;
        this.country_code=country_code;
        this.gender=gender;
    }
    static async getAllUsers(){
        const [rows,field] = await db.query("SELECT * FROM user;");
        return rows;
    }
    static async addNewUser({fname,lname,email,password,bio,country_code,gender}){
        const queryString="INSERT INTO `piano`.`user` (`fname`,`lname`, `email`, `password`, `bio`, `country_code`, `gender`) VALUES (?, ?, ?, ?, ?, ?, ?);";
        const [rows] = await db.query(queryString,[fname,lname,email,password,bio,country_code,gender]);
        return rows;
    }
    static async updateUserData(id,reqBody){
        const queryString="UPDATE `piano`.`user` SET `gender` = 'F' WHERE (`user_id` = ?);";
        const [rows] = await db.query(queryString,[id]);
        return rows;
    }
    static async deleteUser(id){
        const queryString="DELETE FROM `piano`.`user` WHERE `user_id` = ?;";
        const [rows] = await db.query(queryString,[id]);
        return rows;
    }
}

module.exports = User;