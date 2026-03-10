"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Users, Plus, Edit, Trash2, AlertCircle, Building2 } from "lucide-react";

interface Usuario {
  id: number;
  nome: string;
  email: string;
  perfil: string;
  filial_id: number;
  filial_nome: string;
}

interface Filial {
  id: number;
  nome: string;
  slug: string;
  ativa: boolean;
}

export default function GestaoUsuarios() {
  const router = useRouter();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [filiais, setFiliais] = useState<Filial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtroFilial, setFiltroFilial] = useState<string>("todas");
  const [filtroPerfil, setFiltroPerfil] = useState<string>("todos");

  const [dialogAberto, setDialogAberto] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null);

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    perfil: "admin",
    filial_id: "",
  });

  useEffect(() => {
    const usuario = localStorage.getItem("usuario");
    if (!usuario) {
      router.push("/login");
      return;
    }

    const user = JSON.parse(usuario);
    if (user.perfil !== "gestor") {
      setError("Acesso negado. Apenas gestores podem acessar esta área.");
      return;
    }

    carregarDados();
  }, [router]);

  const carregarDados = async () => {
    try {
      const token = localStorage.getItem("token");

      const [usuariosRes, filiaisRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/gestao/usuarios`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/gestao/filiais`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!usuariosRes.ok || !filiaisRes.ok) {
        throw new Error("Erro ao carregar dados");
      }

      const usuariosData = await usuariosRes.json();
      const filiaisData = await filiaisRes.json();

      setUsuarios(usuariosData);
      setFiliais(filiaisData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const abrirDialogNovo = () => {
    setModoEdicao(false);
    setUsuarioEditando(null);
    setFormData({
      nome: "",
      email: "",
      senha: "",
      perfil: "admin",
      filial_id: filiais[0]?.id.toString() || "",
    });
    setDialogAberto(true);
  };

  const abrirDialogEditar = (usuario: Usuario) => {
    setModoEdicao(true);
    setUsuarioEditando(usuario);
    setFormData({
      nome: usuario.nome,
      email: usuario.email,
      senha: "",
      perfil: usuario.perfil,
      filial_id: usuario.filial_id.toString(),
    });
    setDialogAberto(true);
  };

  const salvarUsuario = async () => {
    try {
      const token = localStorage.getItem("token");
      const url = modoEdicao
        ? `${process.env.NEXT_PUBLIC_API_URL}/gestao/usuarios/${usuarioEditando?.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/gestao/usuarios`;

      const body: any = {
        nome: formData.nome,
        email: formData.email,
        perfil: formData.perfil,
        filial_id: parseInt(formData.filial_id),
      };

      if (!modoEdicao) {
        body.senha = formData.senha;
      } else if (formData.senha) {
        body.nova_senha = formData.senha;
      }

      const response = await fetch(url, {
        method: modoEdicao ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao salvar usuário");
      }

      setDialogAberto(false);
      carregarDados();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const excluirUsuario = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este usuário?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gestao/usuarios/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao excluir usuário");
      }

      carregarDados();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const usuariosFiltrados = usuarios.filter((u) => {
    const matchFilial = filtroFilial === "todas" || u.filial_id.toString() === filtroFilial;
    const matchPerfil = filtroPerfil === "todos" || u.perfil === filtroPerfil;
    return matchFilial && matchPerfil;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando usuários...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Erro de Acesso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">{error}</p>
            <Button onClick={() => router.push("/rh")} variant="outline">
              Voltar ao Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestão de Usuários</h1>
            <p className="text-gray-600 mt-2">Gerenciar usuários de todas as filiais</p>
          </div>
          <Button onClick={abrirDialogNovo}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Usuário
          </Button>
        </div>

        {/* Filtros */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Filial</Label>
                <Select value={filtroFilial} onValueChange={setFiltroFilial}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas as filiais</SelectItem>
                    {filiais.map((f) => (
                      <SelectItem key={f.id} value={f.id.toString()}>
                        {f.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Perfil</Label>
                <Select value={filtroPerfil} onValueChange={setFiltroPerfil}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os perfis</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="gestor">Gestor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Usuários */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Usuários ({usuariosFiltrados.length})
            </CardTitle>
            <CardDescription>
              Lista completa de usuários do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {usuariosFiltrados.map((usuario) => (
                <div
                  key={usuario.id}
                  className="border rounded-lg p-4 flex items-center justify-between hover:bg-gray-50 transition"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{usuario.nome}</h3>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          usuario.perfil === "gestor"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {usuario.perfil}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{usuario.email}</p>
                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                      <Building2 className="h-4 w-4" />
                      <span>{usuario.filial_nome}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => abrirDialogEditar(usuario)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => excluirUsuario(usuario.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {usuariosFiltrados.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Nenhum usuário encontrado com os filtros selecionados
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Dialog de Criar/Editar */}
        <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {modoEdicao ? "Editar Usuário" : "Novo Usuário"}
              </DialogTitle>
              <DialogDescription>
                {modoEdicao
                  ? "Atualize as informações do usuário"
                  : "Preencha os dados do novo usuário"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Nome completo"
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@exemplo.com"
                />
              </div>

              <div>
                <Label htmlFor="senha">
                  {modoEdicao ? "Nova Senha (deixe vazio para manter)" : "Senha"}
                </Label>
                <Input
                  id="senha"
                  type="password"
                  value={formData.senha}
                  onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                  placeholder={modoEdicao ? "Digite para alterar" : "Senha inicial"}
                />
              </div>

              <div>
                <Label htmlFor="perfil">Perfil</Label>
                <Select
                  value={formData.perfil}
                  onValueChange={(value) => setFormData({ ...formData, perfil: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="gestor">Gestor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="filial">Filial</Label>
                <Select
                  value={formData.filial_id}
                  onValueChange={(value) => setFormData({ ...formData, filial_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {filiais.map((f) => (
                      <SelectItem key={f.id} value={f.id.toString()}>
                        {f.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogAberto(false)}>
                Cancelar
              </Button>
              <Button onClick={salvarUsuario}>
                {modoEdicao ? "Salvar Alterações" : "Criar Usuário"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
