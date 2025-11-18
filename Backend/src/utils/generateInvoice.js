import Penjualan from "../models/penjualan.js";

export const generateKodeInvoice = async () => {
    const lastInvoice = await Penjualan.findOne()
        .sort({ kode_invoice: -1 });

    let next = 1;
    if (lastInvoice) {
        const lastNum = parseInt(lastInvoice.kode_invoice.split("-")[1]);
        next = lastNum + 1;
    }

    return `INV-${String(next).padStart(3, "0")}`;
};
