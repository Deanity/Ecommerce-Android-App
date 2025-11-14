import mongoose from "mongoose";

const penjualanSchema = new mongoose.Schema({
    kode_invoice: { type: String, required: true, unique: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    subtotal: { type: Number, required: true },
    kode_diskon: { type: String, default: null },
    diskon: { type: Number, default: 0 },
    ongkir: { type: Number, default: 0 },
    total: { type: Number, required: true },
    status: {
        type: String,
        enum: ["pending", "paid", "shipped", "completed", "cancelled"],
        default: "pending"
    },
    metode_pembayaran: { type: String, required: true },
    alamat_pengiriman: { type: String, required: true },
    deleted_at: { type: Date, default: null }
}, { timestamps: true });

export default mongoose.model("Penjualan", penjualanSchema);
