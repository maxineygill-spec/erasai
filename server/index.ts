import "dotenv/config";
import express from "express";
import cors from "cors";
import { synthesizeRouter } from "./routes/synthesize";
import { ledgerRouter } from "./routes/ledger";

const app = express();
app.use(cors({ origin: "http://localhost:8080" }));
app.use(express.json());
app.use("/api/synthesize", synthesizeRouter);
app.use("/api/ledger", ledgerRouter);

const PORT = process.env.PORT ?? 3001;
app.listen(PORT, () => console.log(`Eras API running on port ${PORT}`));
