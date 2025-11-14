import mongoose from "mongoose";

const historiStokSchema = new mongoose.Schema({
    id_produk: { type: mongoose.Schema.Types.ObjectId, ref: "Produk", required: true },
    amount: { type: Number, required: true },
    status: {
        type: String,
        enum: ["IN", "OUT"],
        required: true
    },
    keterangan: { type: String },
    deleted_at: { type: Date, default: null }
}, { timestamps: true });

export default mongoose.model("Histori_stok", historiStokSchema);
