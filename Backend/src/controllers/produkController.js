import Produk from "../models/produk.js";
import Kategori from "../models/kategori.js";
import { generateKodeProduk } from "../utils/generateKodeProduk.js";

export const createProduk = async (req, res) => {
    try {
        const {
            nama,
            deskripsi,
            kategori_id,
            harga,
            stok,
            ukuran,
            warna,
            gambar,
            prefix,
        } = req.body;

        if (kategori_id) {
            const kategori = await Kategori.findById(kategori_id);
            if (!kategori) {
                return res.status(400).json({ message: "Kategori tidak ditemukan." });
            }
        }

        const created_by = req.user?.id || "Admin";

        const kode_produk = await generateKodeProduk(prefix);

        const produk = await Produk.create({
            kode_produk,
            nama,
            deskripsi,
            kategori_id,
            harga,
            stok,
            ukuran,
            warna,
            gambar,
            created_by,
        });

        res.status(201).json({
            message: "Produk berhasil dibuat!",
            produk
        });

    } catch (error) {
        res.status(500).json({
            message: "Gagal membuat produk",
            error: error.message
        });
    }
};

export const getAllProduk = async (req, res) => {
    try {
        const { kategori } = req.query;

        const filter = { deleted_at: null };

        if (kategori) {
            filter.kategori_id = kategori;
        }

        const produk = await Produk.find(filter).populate("kategori_id");

        res.json(produk);

    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil data produk", error: error.message });
    }
};

export const getProdukById = async (req, res) => {
    try {
        const produk = await Produk.findById(req.params.id).populate("kategori_id");

        if (!produk) {
            return res.status(404).json({ message: "Produk tidak ditemukan." });
        }

        res.json(produk);

    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil produk", error: error.message });
    }
};

export const updateProduk = async (req, res) => {
    try {
        const produk = await Produk.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!produk) {
            return res.status(404).json({ message: "Produk tidak ditemukan." });
        }

        res.json({
            message: "Produk berhasil diperbarui",
            produk
        });

    } catch (error) {
        res.status(500).json({ message: "Gagal update", error: error.message });
    }
};

export const deleteProduk = async (req, res) => {
    try {
        const produk = await Produk.findByIdAndUpdate(
            req.params.id,
            { deleted_at: new Date() },
            { new: true }
        );

        if (!produk) {
            return res.status(404).json({ message: "Produk tidak ditemukan." });
        }

        res.json({
            message: "Produk dihapus (soft delete)",
            produk
        });

    } catch (error) {
        res.status(500).json({ message: "Gagal menghapus", error: error.message });
    }
};

export const restoreProduk = async (req, res) => {
    try {
        const produk = await Produk.findByIdAndUpdate(
            req.params.id,
            { deleted_at: null },
            { new: true }
        );

        if (!produk) {
            return res.status(404).json({ message: "Produk tidak ditemukan." });
        }

        res.json({
            message: "Produk berhasil direstore",
            produk
        });

    } catch (error) {
        res.status(500).json({ message: "Gagal restore", error: error.message });
    }
};

export const hardDeleteProduk = async (req, res) => {
    try {
        const produk = await Produk.findByIdAndDelete(req.params.id);

        if (!produk) {
            return res.status(404).json({ message: "Produk tidak ditemukan." });
        }

        res.json({ message: "Produk dihapus permanen." });

    } catch (error) {
        res.status(500).json({ message: "Gagal hard delete", error: error.message });
    }
};
