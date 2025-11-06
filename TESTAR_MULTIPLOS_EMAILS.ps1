# Script para testar envio de emails para múltiplos destinatários

Write-Host "📧 Testando envio de emails via SendGrid..." -ForegroundColor Cyan
Write-Host ""

$destinatarios = @(
    "douglas.mds24@gmail.com",
    "rh-2@fgservices.com.br",
    "rh-3@fgservices.com.br"
)

$sucessos = 0
$falhas = 0

foreach ($email in $destinatarios) {
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
    Write-Host "📤 Enviando para: $email" -ForegroundColor Yellow
    
    try {
        $body = @{
            destinatario = $email
            assunto = "✅ Teste de Email - Sistema RH"
            mensagem = @"
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <h2 style="color: #4F46E5;">🎉 Email de Teste - Sistema RH</h2>
    
    <p>Olá!</p>
    
    <p>Este é um <strong>email de teste</strong> enviado pelo sistema de Recrutamento e Seleção da FG Services.</p>
    
    <div style="background-color: #F3F4F6; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #1F2937;">✅ Configuração do Email:</h3>
        <ul style="color: #4B5563;">
            <li>📧 Provedor: <strong>SendGrid (Twilio)</strong></li>
            <li>🌐 Domínio: <strong>fgservices.com.br</strong></li>
            <li>⚡ Status: <strong>Funcionando</strong></li>
            <li>📬 Destinatário: <strong>$email</strong></li>
        </ul>
    </div>
    
    <p style="color: #6B7280;">Se você recebeu este email, significa que o sistema de comunicação está <strong>100% operacional</strong>!</p>
    
    <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 30px 0;">
    
    <p style="font-size: 12px; color: #9CA3AF; text-align: center;">
        Enviado automaticamente pelo Sistema de RH - FG Services<br>
        Data: $(Get-Date -Format "dd/MM/yyyy HH:mm:ss")
    </p>
</div>
"@
        } | ConvertTo-Json

        $response = Invoke-RestMethod `
            -Uri "https://trabalhe-conoscoserver-production.up.railway.app/comunicacao/testar-email" `
            -Method POST `
            -Headers @{"Content-Type"="application/json"} `
            -Body $body `
            -TimeoutSec 30

        Write-Host "✅ SUCESSO!" -ForegroundColor Green
        Write-Host "   Message ID: $($response.messageId)" -ForegroundColor White
        Write-Host "   Timestamp: $($response.timestamp)" -ForegroundColor White
        $sucessos++
        
    } catch {
        Write-Host "❌ ERRO!" -ForegroundColor Red
        Write-Host "   Erro: $($_.Exception.Message)" -ForegroundColor White
        $falhas++
    }
    
    Start-Sleep -Seconds 2
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "📊 RESUMO:" -ForegroundColor Cyan
Write-Host "   ✅ Sucessos: $sucessos" -ForegroundColor Green
Write-Host "   ❌ Falhas: $falhas" -ForegroundColor Red
Write-Host "   📧 Total: $($destinatarios.Count)" -ForegroundColor White
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""
Write-Host "📬 Verifique as caixas de entrada (e SPAM) dos emails!" -ForegroundColor Yellow

