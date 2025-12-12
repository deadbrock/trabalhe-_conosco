/**
 * cn() — utilitário simples para compor className sem dependências externas.
 */
export function cn(...classes: Array<string | null | undefined | false>): string {
  return classes.filter(Boolean).join(" ");
}


