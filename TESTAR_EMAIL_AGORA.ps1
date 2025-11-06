# Script PowerShell para testar envio de email

Write-Host "📧 Testando envio de email via SendGrid..." -ForegroundColor Cyan
Write-Host ""

# Aguardar Railway estar pronto
Write-Host "⏱️  Aguardando 10 segundos para Railway estar pronto..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

try {
    $body = @{
        destinatario = "douglas.mds24@gmail.com"
    } | ConvertTo-Json

    Write-Host "🚀 Enviando requisição..." -ForegroundColor Yellow
    
    $response = Invoke-RestMethod `
        -Uri "https://trabalhe-conosco-production.up.railway.app/api/comunicacao/testar-email" `
        -Method POST `
        -Headers @{"Content-Type"="application/json"} `
        -Body $body `
        -TimeoutSec 60 `
        -Verbose

    Write-Host ""
    Write-Host "✅ SUCESSO!" -ForegroundColor Green
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
    Write-Host "Mensagem: $($response.message)" -ForegroundColor White
    Write-Host "Destinatário: $($response.destinatario)" -ForegroundColor White
    Write-Host "Assunto: $($response.assunto)" -ForegroundColor White
    Write-Host "Message ID: $($response.messageId)" -ForegroundColor White
    Write-Host "Timestamp: $($response.timestamp)" -ForegroundColor White
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
    Write-Host ""
    Write-Host "📬 Verifique seu email: douglas.mds24@gmail.com" -ForegroundColor Cyan
    
} catch {
    Write-Host ""
    Write-Host "❌ ERRO!" -ForegroundColor Red
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Red
    Write-Host "Erro: $($_.Exception.Message)" -ForegroundColor White
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Possíveis causas:" -ForegroundColor Yellow
    Write-Host "  1. Railway ainda está fazendo deploy (aguarde mais 1 minuto)" -ForegroundColor White
    Write-Host "  2. SendGrid API Key inválida" -ForegroundColor White
    Write-Host "  3. Email remetente não verificado no SendGrid" -ForegroundColor White
    Write-Host ""
    Write-Host "🔍 Execute 'railway logs' para ver detalhes" -ForegroundColor Cyan
}

