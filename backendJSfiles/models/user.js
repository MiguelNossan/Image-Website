import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    passwordHash: {
        type: String,
        required: true,
    },
    tags:  [{
        tag: {
            type: String,
            required: true
        },
        count: {
            type: Number
        }
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
})

export const User = mongoose.model("User", userSchema);