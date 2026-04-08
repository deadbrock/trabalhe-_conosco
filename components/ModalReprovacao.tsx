import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X, UserX } from "lucide-react";

const MAX_CHARS = 800;

interface ModalReprovacaoProps {
  aberto: boolean;
  nomeCandidato: string;
  vagaTitulo?: string;
  enviando?: boolean;
  onConfirmar: (motivo: string) => Promise<void>;
  onCancelar: () => void;
}

export default function ModalReprovacao({
  aberto,
  nomeCandidato,
  vagaTitulo,
  enviando = false,
  onConfirmar,
  onCancelar,
}: ModalReprovacaoProps) {
  const [motivo, setMotivo] = useState("");
  const [tentouEnviar, setTentouEnviar] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (aberto) {
      setMotivo("");
      setTentouEnviar(false);
      setTimeout(() => textareaRef.current?.focus(), 80);
    }
  }, [aberto]);

  const handleConfirmar = async () => {
    setTentouEnviar(true);
    const m = motivo.trim();
    if (!m) return;
    await onConfirmar(m);
  };

  const invalido = tentouEnviar && !motivo.trim();
  const restante = MAX_CHARS - motivo.length;

  return (
    <AnimatePresence>
      {aberto && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm overscroll-none"
          style={{ touchAction: "none" }}
          onClick={onCancelar}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Faixa de alerta no topo */}
            <div className="h-1.5 w-full bg-gradient-to-r from-red-500 via-red-600 to-red-800" />

            {/* Cabeçalho */}
            <div className="px-6 pt-5 pb-4 border-b border-gray-100">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
                    <UserX className="h-5 w-5 text-red-700" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">Registrar reprovação</h3>
                    <p className="text-sm text-gray-600 mt-0.5 leading-snug">
                      <span className="font-semibold text-gray-800">{nomeCandidato}</span>
                      {vagaTitulo && (
                        <span className="text-gray-500"> · {vagaTitulo}</span>
                      )}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onCancelar}
                  className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Corpo */}
            <div className="px-6 py-5 space-y-4">
              <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 flex gap-2.5">
                <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800 leading-relaxed">
                  O motivo será exibido no módulo <strong>Reprovados</strong> e registrado com data e hora (horário de Brasília). Esta ação não pode ser desfeita.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                  Motivo da reprovação <span className="text-red-600">*</span>
                </label>
                <textarea
                  ref={textareaRef}
                  value={motivo}
                  onChange={(e) => {
                    if (e.target.value.length <= MAX_CHARS) setMotivo(e.target.value);
                  }}
                  rows={4}
                  placeholder="Descreva o motivo da reprovação com detalhes suficientes para futuras consultas…"
                  className={`w-full rounded-xl border-2 p-3 text-sm text-gray-900 outline-none transition resize-none leading-relaxed
                    ${invalido
                      ? "border-red-400 bg-red-50 focus:border-red-500"
                      : "border-gray-200 bg-gray-50 focus:border-primary focus:bg-white"
                    }`}
                />
                <div className="flex items-center justify-between mt-1.5">
                  {invalido ? (
                    <p className="text-xs font-medium text-red-600">O motivo é obrigatório para registrar a reprovação.</p>
                  ) : (
                    <span />
                  )}
                  <span className={`text-xs ml-auto ${restante < 50 ? "text-amber-600" : "text-gray-400"}`}>
                    {restante} caracteres restantes
                  </span>
                </div>
              </div>

              {/* Data de registro (apenas informativo, gravada pelo servidor) */}
              <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-2.5 flex items-center gap-2 text-xs text-gray-500">
                <span className="text-gray-400">🕐</span>
                Data e hora serão registradas automaticamente no horário de Brasília.
              </div>
            </div>

            {/* Rodapé */}
            <div className="px-6 pb-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={onCancelar}
                disabled={enviando}
                className="rounded-xl border-2 border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => void handleConfirmar()}
                disabled={enviando}
                className="rounded-xl bg-gradient-to-r from-red-600 to-red-800 px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition disabled:opacity-50 flex items-center gap-2 min-w-[145px] justify-center"
              >
                {enviando ? (
                  <>
                    <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Registrando…
                  </>
                ) : (
                  <>
                    <UserX className="h-4 w-4" />
                    Confirmar reprovação
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
