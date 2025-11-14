import mongoose from "mongoose";

const produkSchema = new mongoose.Schema({
    kode_produk: { type: String, required: true, unique: true },
    nama: { type: String, required: true },
    deskripsi: { type: String },
    kategori_id: { type: mongoose.Schema.Types.ObjectId, ref: "Kategori" },
    harga: { type: Number, required: true },
    stok: { type: Number, required: true },
    ukuran: {
        type: String,
        enum: ["S", "M", "L", "XL", "XXL", "XXXL"],
        default: "M"
    },
    warna: { type: String },
    gambar: { type: String },
    created_by: { type: String },
    deleted_at: { type: Date, default: null }
}, { timestamps: true });

export default mongoose.model("Produk", produkSchema);
