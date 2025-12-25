import React, { useEffect, useState, useRef } from "react";
import RHLayout from "@/components/RHLayout";
import { motion } from "framer-motion";
import { User, Mail, Phone, Briefcase, Camera, Lock, Save, X, Upload, Trash2, Settings } from "lucide-react";
import api from "@/lib/api";
import { apiGet } from "@/lib/api";

type Usuario = {
  id: number;
  nome: string;
  email: string;
  perfil: string;
  foto_perfil?: string | null;
  telefone?: string | null;
  cargo?: string | null;
  criado_em?: string;
  data_atualizacao?: string;
};

export default function ConfiguracoesPage() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [uploadando, setUploadando] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState<'perfil' | 'senha'>('perfil');
  
  // Estados do formulário de perfil
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cargo, setCargo] = useState("");
  
  // Estados do formulário de senha
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("rh_token") || undefined : undefined;

  useEffect(() => {
    carregarPerfil();
  }, []);

  const carregarPerfil = async () => {
    setLoading(true);
    try {
      const data = await apiGet<Usuario>("/perfil", token);
      setUsuario(data);
      setNome(data.nome || "");
      setTelefone(data.telefone || "");
      setCargo(data.cargo || "");
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
      alert("❌ Erro ao carregar perfil");
    } finally {
      setLoading(false);
    }
  };

  const handleSalvarPerfil = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);
    
    try {
      const response = await api.put("/perfil", {
        nome: nome.trim(),
        telefone: telefone.trim() || null,
        cargo: cargo.trim() || null,
      });
      
      setUsuario(response.data);
      
      // Atualizar localStorage se o nome mudou
      if (response.data.nome) {
        localStorage.setItem("rh_user_name", response.data.nome);
      }
      
      alert("✅ Perfil atualizado com sucesso!");
    } catch (error: any) {
      console.error("Erro ao salvar perfil:", error);
      alert(`❌ ${error.response?.data?.error || "Erro ao salvar perfil"}`);
    } finally {
      setSalvando(false);
    }
  };

  const handleUploadFoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      alert("❌ Por favor, selecione uma imagem");
      return;
    }

    // Validar tamanho (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("❌ A imagem deve ter no máximo 5MB");
      return;
    }

    setUploadando(true);
    
    try {
      const formData = new FormData();
      formData.append("foto", file);
      
      const response = await api.post("/perfil/foto", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      setUsuario(response.data);
      alert("✅ Foto atualizada com sucesso!");
    } catch (error: any) {
      console.error("Erro ao fazer upload:", error);
      alert(`❌ ${error.response?.data?.error || "Erro ao fazer upload da foto"}`);
    } finally {
      setUploadando(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoverFoto = async () => {
    if (!confirm("Deseja realmente remover sua foto de perfil?")) return;
    
    setUploadando(true);
    
    try {
      const response = await api.delete("/perfil/foto");
      setUsuario(response.data);
      alert("✅ Foto removida com sucesso!");
    } catch (error: any) {
      console.error("Erro ao remover foto:", error);
      alert(`❌ ${error.response?.data?.error || "Erro ao remover foto"}`);
    } finally {
      setUploadando(false);
    }
  };

  const handleAlterarSenha = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (novaSenha !== confirmarSenha) {
      alert("❌ As senhas não coincidem");
      return;
    }
    
    if (novaSenha.length < 6) {
      alert("❌ A nova senha deve ter pelo menos 6 caracteres");
      return;
    }
    
    setSalvando(true);
    
    try {
      await api.put("/perfil/senha", {
        senhaAtual,
        novaSenha,
      });
      
      setSenhaAtual("");
      setNovaSenha("");
      setConfirmarSenha("");
      
      alert("✅ Senha alterada com sucesso!");
    } catch (error: any) {
      console.error("Erro ao alterar senha:", error);
      alert(`❌ ${error.response?.data?.error || "Erro ao alterar senha"}`);
    } finally {
      setSalvando(false);
    }
  };

  if (loading) {
    return (
      <RHLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        </div>
      </RHLayout>
    );
  }

  return (
    <RHLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Settings className="w-8 h-8 text-primary" />
            Configurações
          </h1>
          <p className="text-gray-600 mt-2">Gerencie seu perfil e preferências</p>
        </div>

        {/* Foto de Perfil Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8"
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-primary to-red-700 flex items-center justify-center">
                {usuario?.foto_perfil ? (
                  <img
                    src={usuario.foto_perfil}
                    alt={usuario.nome}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-16 h-16 text-white" />
                )}
              </div>
              
              {uploadando && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent"></div>
                </div>
              )}
            </div>

            {/* Informações e Ações */}
            <div className="flex-grow text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-900">{usuario?.nome}</h2>
              <p className="text-gray-600 flex items-center gap-2 justify-center md:justify-start mt-1">
                <Mail className="w-4 h-4" />
                {usuario?.email}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {usuario?.perfil === 'admin' ? '👑 Administrador' : '👤 Usuário RH'}
              </p>
            </div>

            {/* Botões de Foto */}
            <div className="flex flex-col gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleUploadFoto}
                className="hidden"
              />
              
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadando}
                className="px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <Camera className="w-4 h-4" />
                {usuario?.foto_perfil ? 'Alterar Foto' : 'Adicionar Foto'}
              </button>
              
              {usuario?.foto_perfil && (
                <button
                  onClick={handleRemoverFoto}
                  disabled={uploadando}
                  className="px-4 py-2 rounded-lg border-2 border-red-200 text-red-600 font-semibold hover:bg-red-50 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  Remover
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Abas */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setAbaAtiva('perfil')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors flex items-center justify-center gap-2 ${
                abaAtiva === 'perfil'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <User className="w-5 h-5" />
              Dados do Perfil
            </button>
            <button
              onClick={() => setAbaAtiva('senha')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors flex items-center justify-center gap-2 ${
                abaAtiva === 'senha'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Lock className="w-5 h-5" />
              Alterar Senha
            </button>
          </div>

          <div className="p-8">
            {/* Aba: Dados do Perfil */}
            {abaAtiva === 'perfil' && (
              <motion.form
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onSubmit={handleSalvarPerfil}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nome Completo *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      required
                      minLength={3}
                      className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors"
                      placeholder="Seu nome completo"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={usuario?.email || ""}
                      disabled
                      className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    O email não pode ser alterado
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Telefone
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        value={telefone}
                        onChange={(e) => setTelefone(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors"
                        placeholder="(00) 00000-0000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Cargo
                    </label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={cargo}
                        onChange={(e) => setCargo(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors"
                        placeholder="Ex: Analista de RH"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={carregarPerfil}
                    className="px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-all flex items-center gap-2"
                  >
                    <X className="w-5 h-5" />
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={salvando}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-red-700 text-white font-semibold hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {salvando ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Salvar Alterações
                      </>
                    )}
                  </button>
                </div>
              </motion.form>
            )}

            {/* Aba: Alterar Senha */}
            {abaAtiva === 'senha' && (
              <motion.form
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                onSubmit={handleAlterarSenha}
                className="space-y-6"
              >
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                  <p className="text-sm text-blue-800">
                    <strong>ℹ️ Dica de Segurança:</strong> Use uma senha forte com pelo menos 6 caracteres, incluindo letras e números.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Senha Atual *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      value={senhaAtual}
                      onChange={(e) => setSenhaAtual(e.target.value)}
                      required
                      className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors"
                      placeholder="Digite sua senha atual"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nova Senha *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      value={novaSenha}
                      onChange={(e) => setNovaSenha(e.target.value)}
                      required
                      minLength={6}
                      className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors"
                      placeholder="Digite a nova senha"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirmar Nova Senha *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      value={confirmarSenha}
                      onChange={(e) => setConfirmarSenha(e.target.value)}
                      required
                      minLength={6}
                      className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors"
                      placeholder="Confirme a nova senha"
                    />
                  </div>
                  {novaSenha && confirmarSenha && novaSenha !== confirmarSenha && (
                    <p className="text-xs text-red-600 mt-1">
                      ❌ As senhas não coincidem
                    </p>
                  )}
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setSenhaAtual("");
                      setNovaSenha("");
                      setConfirmarSenha("");
                    }}
                    className="px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-all flex items-center gap-2"
                  >
                    <X className="w-5 h-5" />
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={salvando || (novaSenha !== confirmarSenha)}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-red-700 text-white font-semibold hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {salvando ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                        Alterando...
                      </>
                    ) : (
                      <>
                        <Lock className="w-5 h-5" />
                        Alterar Senha
                      </>
                    )}
                  </button>
                </div>
              </motion.form>
            )}
          </div>
        </div>
      </div>
    </RHLayout>
  );
}

