import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// 🔧 Fungsi bantu buat generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "7d", // token berlaku 7 hari
    });
};

// 🧍‍♂️ Register user baru
export const registerUser = async (req, res) => {
    try {
        const { nama, email, password, no_hp, alamat } = req.body;

        // cek apakah user sudah ada
        const existingUser = await User.findOne({ email });
        if (existingUser) {
        return res.status(400).json({ success: false, message: "Email sudah terdaftar" });
        }

        // enkripsi password
        const hashedPassword = await bcrypt.hash(password, 10);

        // buat user baru
        const newUser = await User.create({
            nama,
            email,
            password: hashedPassword,
            no_hp,
            alamat,
        });

        res.status(201).json({
        success: true,
        message: "Registrasi berhasil",
        user: {
            id: newUser._id,
            nama: newUser.nama,
            email: newUser.email,
            role: newUser.role,
        },
        token: generateToken(newUser._id),
        });
    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
    }
};

// 🔑 Login user
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // cari user berdasarkan email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User tidak ditemukan" });
        }

        // cocokkan password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Password salah" });
        }

        res.status(200).json({
        success: true,
        message: "Login berhasil",
        user: {
            id: user._id,
            nama: user.nama,
            email: user.email,
            role: user.role,
        },
        token: generateToken(user._id),
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
    }
};

// 👤 Ambil data profil user (hanya untuk user login)
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User tidak ditemukan" });
        }
        res.status(200).json({ success: true, user });
    } catch (error) {
        console.error("Get profile error:", error);
        res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
    }
};

// ⚙️ Update profil user
export const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User tidak ditemukan" });
        }

        user.nama = req.body.nama || user.nama;
        user.email = req.body.email || user.email;
        user.no_hp = req.body.no_hp || user.no_hp;
        user.alamat = req.body.alamat || user.alamat;

        if (req.body.password) {
            user.password = await bcrypt.hash(req.body.password, 10);
        }

        const updatedUser = await user.save();

        res.status(200).json({
            success: true,
            message: "Profil berhasil diperbarui",
            user: {
                id: updatedUser._id,
                nama: updatedUser.nama,
                email: updatedUser.email,
                role: updatedUser.role,
            },
        });
    } catch (error) {
        console.error("Update profile error:", error);
        res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
    }
};
