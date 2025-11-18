import Penjualan from "../models/penjualan.js";
import ItemPenjualan from "../models/itemPenjualan.js";
import Produk from "../models/produk.js";
import KodeDiskon from "../models/kodeDiskon.js";
import { generateKodeInvoice } from "../utils/generateInvoice.js";

export const createOrder = async (req, res) => {
    try {
        const {
            items,              // [{ id_produk, jumlah }]
            kode_diskon,
            ongkir,
            metode_pembayaran,
            alamat_pengiriman
        } = req.body;

        // 1️⃣ Validasi items tidak kosong
        if (!items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Item penjualan tidak boleh kosong"
            });
        }

        let subtotal = 0;

        // 2️⃣ Validasi produk + hitung subtotal
        for (let item of items) {
            const produk = await Produk.findById(item.id_produk);
            if (!produk) {
                return res.status(404).json({
                    success: false,
                    message: `Produk dengan ID ${item.id_produk} tidak ditemukan`
                });
            }

            if (produk.stok < item.jumlah) {
                return res.status(400).json({
                    success: false,
                    message: `Stok produk ${produk.nama} tidak cukup`
                });
            }

            subtotal += produk.harga * item.jumlah;
        }

        // 3️⃣ Hitung Diskon (optional)
        let diskon = 0;

        if (kode_diskon) {
            const diskonData = await KodeDiskon.findOne({
                kode_diskon
            });

            if (!diskonData) {
                return res.status(400).json({
                    success: false,
                    message: "Kode diskon tidak valid"
                });
            }

            // cek masa berlaku
            if (new Date() > new Date(diskonData.berlaku_sampai)) {
                return res.status(400).json({
                    success: false,
                    message: "Kode diskon sudah kadaluarsa"
                });
            }

            // cek minimum pembelian
            if (subtotal < diskonData.minimal_pembelian) {
                return res.status(400).json({
                    success: false,
                    message: `Minimal pembelian adalah ${diskonData.minimal_pembelian}`
                });
            }

            // hitung diskon
            if (diskonData.type === "percentage") {
                diskon = subtotal * (diskonData.amount / 100);
            } else {
                diskon = diskonData.amount;
            }
        }

        // 4️⃣ Hitung total akhir
        const totalHarga = subtotal - diskon + (ongkir || 0);

        // 5️⃣ Generate Invoice
        const kode_invoice = await generateKodeInvoice();

        // 6️⃣ Simpan Penjualan
        const penjualan = await Penjualan.create({
            kode_invoice,
            user_id: req.user.id,
            subtotal,
            kode_diskon: kode_diskon || null,
            diskon,
            ongkir,
            total: totalHarga,
            metode_pembayaran,
            alamat_pengiriman
        });

        // 7️⃣ Simpan Item Penjualan + kurangi stok
        for (let item of items) {
            const produk = await Produk.findById(item.id_produk);

            await ItemPenjualan.create({
                id_penjualan: penjualan._id,
                id_produk: item.id_produk,
                jumlah: item.jumlah,
                subtotal: produk.harga * item.jumlah
            });

            // Kurangi stok
            produk.stok -= item.jumlah;
            await produk.save();
        }

        res.status(201).json({
            success: true,
            message: "Order berhasil dibuat",
            data: penjualan
        });

    } catch (error) {
        console.error("Create order error:", error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan server"
        });
    }
};

export const getOrders = async (req, res) => {
    try {
        const orders = await Penjualan.find()
            .populate("user_id", "nama email")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error("Get orders error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const order = await Penjualan.findById(req.params.id)
            .populate("user_id", "nama email");

        if (!order) {
            return res.status(404).json({ success: false, message: "Order tidak ditemukan" });
        }

        const items = await ItemPenjualan.find({ id_penjualan: order._id })
            .populate("id_produk", "nama harga");

        res.status(200).json({
            success: true,
            order,
            items
        });

    } catch (error) {
        console.error("Get order error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
