import { Router } from "express";
import multer from "multer";
import { pool } from "../db";

const upload = multer({ dest: "uploads/" });
export const candidatosRouter = Router();

candidatosRouter.get("/:vagaId", async (req, res) => {
  const { vagaId } = req.params;
  const { rows } = await pool.query("SELECT * FROM candidatos WHERE vaga_id = $1 ORDER BY data_cadastro DESC", [vagaId]);
  res.json(rows);
});

candidatosRouter.post("/", upload.single("curriculo"), async (req, res) => {
  const { nome, cpf, email, telefone, vaga_id } = req.body;
  const curriculo = req.file?.filename || null;
  const { rows } = await pool.query(
    `INSERT INTO candidatos (nome, cpf, email, telefone, curriculo, vaga_id)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [nome, cpf, email, telefone, curriculo, vaga_id]
  );
  res.status(201).json(rows[0]);
});

candidatosRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body as { status?: string };
  const { rows } = await pool.query(
    `UPDATE candidatos SET status = COALESCE($1, status) WHERE id = $2 RETURNING *`,
    [status, id]
  );
  if (!rows[0]) return res.status(404).json({ error: "Candidato não encontrado" });
  res.json(rows[0]);
});
