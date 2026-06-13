const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    email : {
        type: String,
        unique : [true, "User already exists with this email"],
        required : [true, "Email is required for creating a user"],
        lowercase : true,
        trim : true,
        match: [/^\S+@\S+\.\S+$/, "Invalid Email Address"]
    },
    username : {
        type: String,
        required : [true, "Username is required for creating an account"],
        unique : [true, "User already exists with this username"],
        trim: true,
        minlength: [3, "Username should contain more than 3 characters"],
        maxlength: [20, "Username should contain less than 20 characters"],
        match: [/^[a-zA-Z0-9_]+$/, "username can only contain letters, numbers and underscore"]
    },
    password : {
        type: String,
        required : [true, "Password is required for creating an account"],
        minlength: [8, "Password should contain more than 6 characters"],
        select: false
    },
    systemUser : {
        type: Boolean,
        default: false,
        immutable : true,
        select: false
    }
}, {
    timestamps: true
})

userSchema.pre("save", async function(){
    if(!this.isModified("password")){
        return
    }
    
    const hash = await bcrypt.hash(this.password, 10)
    
    this.password = hash

    return
})

userSchema.methods.comparePassword = async function (password){
    return await bcrypt.compare(password, this.password)
}

const userModel = mongoose.model("user", userSchema)

module.exports = userModel
