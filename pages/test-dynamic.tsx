export default function TestDynamic() {
  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>✅ Rotas dinâmicas funcionando!</h1>
      <p>Se você está vendo isso, o Next.js está servindo páginas corretamente.</p>
      <p>Teste a rota de documentos:</p>
      <a href="/documentos/teste123" style={{ color: 'blue', textDecoration: 'underline' }}>
        /documentos/teste123
      </a>
    </div>
  );
}

