import { Schema, model } from "mongoose";

const invoiceSchema = Schema({

    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    cart: {
        type: Schema.Types.ObjectId,
        ref: "Cart",
        required: true
    },

    totalAmount: {
        type: Number,
        required: true
    },

    status: {
        type: Boolean,
        default: true
    },
},
    {
        versionKey: false,
        timeStamps: true
    })


export default model("Invoice", invoiceSchema)