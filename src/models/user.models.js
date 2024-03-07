import mongoose, {Schema} from "mongoose";

const userSchema = new Schema(
    {
       userName:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
       },
       password: {
        type: String,
        required: [true, 'Password is required']
      }, 
      refreshToken: {
        type: String
      },
       email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
       },
       firstName:{
        type: String,
        required: true,
        index:true,
        trim: true,
       },
       lastName:{
        type: String,
        required: true,
        index:true,
        trim: true,
       },
       avatar:{
        type: String, // cloudinary,
        required: true,
       }
    },
    {
        timestamps: true
    }
)

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            email: this.email,
            username: this.username,
            firstName: this.firstName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const user = mongoose.model("user",userSchema);