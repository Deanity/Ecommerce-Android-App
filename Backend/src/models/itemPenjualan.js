import mongoose from "mongoose";

const itemPenjualanSchema = new mongoose.Schema({
    id_penjualan: { type: mongoose.Schema.Types.ObjectId, ref: "Penjualan" },
    id_produk: { type: mongoose.Schema.Types.ObjectId, ref: "Produk", required: true },
    jumlah: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    deleted_at: { type: Date, default: null }
}, { timestamps: true });

export default mongoose.model("Item_penjualan", itemPenjualanSchema);
