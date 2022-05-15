const User=require("../models/User");
const Joi=require("joi");

const SearchController={
    getArtistsBySearchController:async (req,res,next)=>{
        try {
            const schema=Joi.object({
                name:Joi.string().min(3).max(201).regex(/^[a-zA-Z0-9]+\s?[a-zA-Z0-9]+$/).required().messages({
                    "string.pattern.base": "{{#label}} must be alpha numeric with may or may not space between.!!",
                })
            });
            const {value:requestData,error}=schema.validate({name:req.params.name});
            if(!error){
                const nameBreak=requestData.name.split(" ");
                const nameLength=nameBreak.length;
                if(nameLength==1 || nameLength==2){
                    const {DBdata,DBerror}=await User.getAllUsersByName(nameBreak,nameLength);
                    if(!DBerror)  res.status(200).json(DBdata);
                    else    res.status(200).json({error:DBerror});
                }
                else
                    res.status(200).json({message:"Inappropriate Search Query."});
            }
            else    res.status(200).json({message:error.message});
        } catch (error) {
            if(!error.statusCode){
                error.statusCode=500;
            }
            next(error);
        }
    }
}

module.exports = SearchController