import { Schema, model } from "mongoose";

const categoriesSchema = Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        maxLength: [25, "Name cannot exceed 25 characters"]
    },

    description: {
        type: String,
        maxLength: [200, "Description cannot exceed 200 characters"],
    },

    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: Boolean,
        default: true
    }
},
    {
        versionKey: false,
        timeStamps: true
    })


export default model("Categories", categoriesSchema)