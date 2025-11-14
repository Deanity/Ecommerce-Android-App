import Produk from "../models/produk.js";

export const generateKodeProduk = async (prefix = "PRD") => {
    // Cari produk dengan prefix terkait
    const lastProduct = await Produk.findOne({ kode_produk: new RegExp(`^${prefix}-`) })
        .sort({ kode_produk: -1 });

    let nextNumber = 1;

    if (lastProduct) {
        const lastCode = lastProduct.kode_produk.split("-")[1];
        nextNumber = parseInt(lastCode) + 1;
    }

    const newCode = `${prefix}-${String(nextNumber).padStart(3, "0")}`;
    return newCode;
};
