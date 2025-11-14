import mongoose from "mongoose";

const kodeDiskonSchema = new mongoose.Schema({
    kode_diskon: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ["percentage", "fixed"], required: true },
    minimal_pembelian: { type: Number, default: null },
    berlaku_sampai: { type: Date, required: true },
    deleted_at: { type: Date, default: null }
}, { timestamps: true });

export default mongoose.model("KodeDiskon", kodeDiskonSchema);
