export type Job = {
  id: string;
  title: string;
  contractType: string;
  address: string;
  description?: string;
  requirements?: string[];
};

export const jobs: Job[] = [
  {
    id: "1",
    title: "Desenvolvedor(a) Front-end",
    contractType: "CLT",
    address: "São Paulo, SP",
    description: "Trabalhe com Next.js, Tailwind e animações modernas.",
    requirements: ["React/Next.js", "TypeScript", "Tailwind CSS", "Teste e Acessibilidade"],
  },
  {
    id: "2",
    title: "Product Designer",
    contractType: "PJ",
    address: "Remoto",
    description: "Crie experiências incríveis focadas em usabilidade.",
    requirements: ["UI/UX", "Figma", "Design System", "Prototipagem"],
  },
  {
    id: "3",
    title: "Engenheiro(a) de Dados",
    contractType: "CLT",
    address: "Belo Horizonte, MG",
    description: "Pipelines, modelagem e qualidade de dados em escala.",
    requirements: ["SQL", "ETL", "Cloud Data", "Python/Scala"],
  },
  {
    id: "4",
    title: "QA Analyst",
    contractType: "CLT",
    address: "Curitiba, PR",
    description: "Automação de testes e garantia de qualidade.",
    requirements: ["Cypress/Playwright", "Testes Funcionais", "Boas práticas QA"],
  },
  {
    id: "5",
    title: "Tech Lead",
    contractType: "PJ",
    address: "Remoto",
    description: "Lidere times e decisões técnicas estratégicas.",
    requirements: ["Liderança técnica", "Arquitetura", "Code Review", "Roadmap"],
  },
  {
    id: "6",
    title: "DevOps Engineer",
    contractType: "CLT",
    address: "Porto Alegre, RS",
    description: "Infraestrutura como código, observabilidade e CI/CD.",
    requirements: ["IaC (Terraform)", "Kubernetes", "Observabilidade", "CI/CD"],
  },
];

export function getJobById(id: string): Job | undefined {
  return jobs.find((j) => j.id === id);
}

