// Tipos para vagas do backend
export type Job = {
  id: number;
  titulo: string;
  tipo_contrato: string;
  endereco: string;
  descricao?: string;
  requisitos?: string;
  diferenciais?: string;
  status: string;
  criado_em?: string;
};

// Função para buscar vagas ativas da API
export async function getActiveJobs(): Promise<Job[]> {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3333";
    const response = await fetch(`${API_URL}/vagas?status=ativa`, {
      cache: "no-store", // Sempre busca dados frescos
    });

    if (!response.ok) {
      console.error("Erro ao buscar vagas:", response.statusText);
      return [];
    }

    const jobs = await response.json();
    return jobs;
  } catch (error) {
    console.error("Erro ao conectar com API:", error);
    return [];
  }
}

// Função para buscar vaga por ID
export async function getJobById(id: string | number): Promise<Job | null> {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3333";
    const response = await fetch(`${API_URL}/vagas?status=ativa`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const jobs = await response.json();
    const job = jobs.find((j: Job) => j.id === Number(id));
    return job || null;
  } catch (error) {
    console.error("Erro ao buscar vaga:", error);
    return null;
  }
}

