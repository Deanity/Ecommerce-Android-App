import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import {
    createProduk,
    getAllProduk,
    getProdukById,
    updateProduk,
    softDeleteProduk
} from "../controllers/produkController.js";

const router = express.Router();

router.post("/", protect, adminOnly, createProduk);
router.get("/", getAllProduk);
router.get("/:id", getProdukById);
router.put("/:id", protect, adminOnly, updateProduk);
router.delete("/:id", protect, adminOnly, softDeleteProduk);

export default router;
