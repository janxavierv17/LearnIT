import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        // Removes beginning and ending space
        trim: true,
        required: true
    },
    email: {
        type: String,
        // Removes beginning and ending space
        trim: true,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 64
    },
    picture: {
        type: String,
        //If the user didn't provide an image then we can use a default user photo.
        default: "/avatar.png",
    },
    // Users with different privilege.
    role: {
        type: [String],
        default: ["Subscriber"],
        enum: ["Subscriber", "Instructor", "Admin"]
    },
    // For payment system.
    stripe_account_id: "",
    stripe_seller: {},
    // Paid status. More information later on.
    stripeSession: {},
    passwordResetCode: {
        data: String,
        default:""
    }
}, { timestamps: true })

export default mongoose.model("User", userSchema)