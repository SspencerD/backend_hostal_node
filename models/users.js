const mongoose = require("mongoose");
const crypto = require("crypto");
const uuidv1 =require("uuid/v1");

const userSchema = new mongoose.Schema(
    {

        name: {
            type: String,
            trim: true, 
            require: true,
            maxlength : 32
        },
        run: {  
            type: Number, 
            require: true           
        },
        dv:{
            type: String,
            require: true,
            maxlength: 1

        }, Nacionality: {  
            type: String,
            maxlength : 20
            
        },
          email: {  
            type: String,
            trim: true, 
            require: true,
            unique: true
        },
        place_of_origin: {  
            type: String,
            trim: true, 
            require: true,
           
        },
        phonenumber:{           
            type:Number,
            require: true

        },
        hashed_password: {   
            type: String,
            require: true
        },
        about:{
            type: String,
            trim : true
        },

        salt: String,
        role :{
        
            type: Number,
            default : 0 
        },
        history: {
           type: Array,
           default :[]
        }
    
    },  
    { timestamps: true} 
);

// virtual field
userSchema
    .virtual("password")
    .set(function(password) {
        this._password = password;
        this.salt = uuidv1();
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function() {
        return this._password;
    });

userSchema.methods = {
    authenticate: function(plainText) {
        return this.encryptPassword(plainText) === this.hashed_password;
    },

    encryptPassword: function(password) {
        if (!password) return "";
        try {
            return crypto
                .createHmac("sha1", this.salt)
                .update(password)
                .digest("hex");
        } catch (err) {
            return "";
        }
    }
};

module.exports = mongoose.model("Users", userSchema);
