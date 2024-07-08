import mongoose from "mongoose";

const usersSchema = new mongoose.Schema({
    userId:{type: mongoose.Schema.Types.ObjectId},
    fullNames: {
        type: String,
        required: false,
    },
    username: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: true
    },
    picture:{type:String,
        default:"https://st3.depositphotos.com/15648834/17930/v/450/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg",
    required:false},
    image:{type:String,
        default:"https://st3.depositphotos.com/15648834/17930/v/450/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg",
    required:false},
    password: {
        type: String,
        required: true
    },
    gender:{type:String, required: false},
    role: {
        type: String,
        default:"user",
       required:false
    },
    otpExpiresAt: {
        type: String,
        required: false
    },
    deleted:{type:Boolean,
        default:false,
        required:false
      },
    otp: {
        type: String,
        required: false
    },
    token:{type:String,
    },
    verified:{type:Boolean,
    default:false   },
    location:{type:String,
    },
    phoneNumber:{type:String,}
    
    ,delivelinglocation:{type:String,}
}, {
    timestamps: { currentTime: () => new Date() }, 
  }

).set('strictPopulate', false);
usersSchema.pre('save', function (next) {
    this.userId=this._id;
    const now = new Date();
    next();
  });
 export const User = mongoose.model('User', usersSchema);

 
