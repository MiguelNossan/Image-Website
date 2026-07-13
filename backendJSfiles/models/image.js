import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    filename: {
        type: String,
        required: true,
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    tags: {
        type: [String],
        default: []
    }
})

export const Image = mongoose.model("Image", imageSchema);