import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import chalk from "chalk";
import figlet from "figlet";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
    res.send("🚀 API Ecommerce is Live!");
});

app.use("/api/v1/users", userRoutes);
app.use("/api/v2/product", productRoutes);

app.listen(PORT, () => {
    console.clear();
    console.log(
        chalk.cyan(
        figlet.textSync("DTM Labs", { horizontalLayout: "default" })
        )
    );
    console.log(chalk.green.bold("✅ Server Status: ") + chalk.white("Running Smoothly"));
    console.log(chalk.yellow.bold("🌐 URL: ") + chalk.white(`http://localhost:${PORT}/`));
    console.log(chalk.magenta.bold("📦 Database: ") + chalk.white("Connected"));
    console.log(chalk.blue.bold("👨‍💻 Developer: ") + chalk.white("Deanity"));
    console.log(chalk.gray("-------------------------------------------"));
});
