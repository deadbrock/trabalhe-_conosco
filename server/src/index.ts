import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { vagasRouter } from "./routes/vagas";
import { candidatosRouter } from "./routes/candidatos";
import { authRouter } from "./routes/auth";
import { metricsRouter } from "./routes/metrics";
import { requireAuth } from "./middleware/auth";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// públicas
app.use("/auth", authRouter);
app.use("/vagas", vagasRouter);

// protegidas (ex.: métricas e gestão de candidatos)
app.use("/metrics", requireAuth, metricsRouter);
app.use("/candidatos", requireAuth, candidatosRouter);

const port = process.env.PORT || 3333;
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
