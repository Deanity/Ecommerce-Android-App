import mongoose from "mongoose";

const kategoriSchema = new mongoose.Schema({
    nama_kategori: { type: String, required: true },
    deskripsi: { type: String, default: null },
}, { timestamps: true });

export default mongoose.model("Kategori", kategoriSchema);
