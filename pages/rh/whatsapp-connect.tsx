import { useState } from 'react';
import RHLayout from '@/components/RHLayout';
import { apiGet, apiPost } from '@/lib/api';
import { Smartphone, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

interface QRCodeResponse {
  qrcode?: string;
  message?: string;
}

export default function WhatsAppConnect() {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [status, setStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const gerarQRCode = async () => {
    try {
      setLoading(true);
      setError(null);
      setStatus('connecting');
      
      // Primeiro, iniciar o WPPConnect
      await apiPost('/whatsapp/iniciar', {});
      
      // Aguardar 3 segundos para o QR Code ser gerado
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Buscar o QR Code
      const data = await apiGet<QRCodeResponse>('/whatsapp/qrcode');
      
      if (data.qrcode) {
        setQrCode(data.qrcode);
        setStatus('connecting');
        // Verificar status a cada 5 segundos
        checkConnectionStatus();
      } else if (data.message) {
        if (data.message.includes('conectado')) {
          setStatus('connected');
        }
        setError(data.message);
      }
    } catch (error: unknown) {
      console.error('Erro ao gerar QR Code:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao conectar com WhatsApp';
      setError(errorMessage);
      setStatus('disconnected');
    } finally {
      setLoading(false);
    }
  };

  const checkConnectionStatus = () => {
    const interval = setInterval(async () => {
      try {
        const data = await apiGet<QRCodeResponse>('/whatsapp/qrcode');
        if (data.message && data.message.includes('conectado')) {
          setStatus('connected');
          setQrCode(null);
          setError('WhatsApp conectado com sucesso!');
          clearInterval(interval);
        }
      } catch (error) {
        console.error('Erro ao verificar status:', error);
      }
    }, 5000);

    // Limpar apÃ³s 2 minutos (QR code expira)
    setTimeout(() => {
      clearInterval(interval);
      if (status === 'connecting') {
        setError('QR Code expirou. Tente novamente.');
        setStatus('disconnected');
        setQrCode(null);
      }
    }, 120000);
  };

  return (
    <RHLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Smartphone className="w-8 h-8 text-green-600" />
            Conectar WhatsApp
          </h1>
          <p className="text-gray-600 mt-2">
            Configure sua conta do WhatsApp para envio automÃ¡tico de mensagens aos candidatos.
          </p>
        </div>

        {/* Card Principal */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Status */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="font-semibold text-gray-700">Status:</span>
              {status === 'connected' && (
                <span className="flex items-center gap-2 text-green-600 font-medium">
                  <CheckCircle className="w-5 h-5" />
                  Conectado
                </span>
              )}
              {status === 'connecting' && (
                <span className="flex items-center gap-2 text-yellow-600 font-medium">
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Aguardando conexÃ£o...
                </span>
              )}
              {status === 'disconnected' && (
                <span className="flex items-center gap-2 text-red-600 font-medium">
                  <XCircle className="w-5 h-5" />
                  Desconectado
                </span>
              )}
            </div>
          </div>

          {/* BotÃ£o Gerar QR Code */}
          {status !== 'connected' && (
            <button
              onClick={gerarQRCode}
              disabled={loading}
              className="w-full md:w-auto px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  <Smartphone className="w-5 h-5" />
                  Gerar QR Code
                </>
              )}
            </button>
          )}

          {/* Erro ou Mensagem */}
          {error && (
            <div className={`mt-4 p-4 rounded-lg ${
              error.includes('sucesso') || error.includes('conectado')
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}>
              <p className={
                error.includes('sucesso') || error.includes('conectado')
                  ? 'text-green-700'
                  : 'text-red-700'
              }>{error}</p>
            </div>
          )}

          {/* QR Code */}
          {qrCode && (
            <div className="mt-8">
              <div className="bg-gray-50 rounded-xl p-8 text-center">
                <p className="text-gray-700 font-medium mb-4">
                  ðŸ“± Escaneie o QR Code com seu WhatsApp
                </p>
                <div className="flex justify-center mb-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={qrCode} 
                    alt="QR Code WhatsApp" 
                    className="max-w-xs rounded-lg shadow-md bg-white p-4"
                  />
                </div>
                <div className="text-sm text-gray-600 space-y-2">
                  <p><strong>1.</strong> Abra o WhatsApp no celular</p>
                  <p><strong>2.</strong> Toque em &quot;ConfiguraÃ§Ãµes&quot; â†’ &quot;Aparelhos conectados&quot;</p>
                  <p><strong>3.</strong> Toque em &quot;Conectar um aparelho&quot;</p>
                  <p><strong>4.</strong> Escaneie o QR Code acima</p>
                  <p className="text-yellow-600 font-medium mt-4">
                    â±ï¸ O QR Code expira em 2 minutos
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Mensagem de Sucesso */}
          {status === 'connected' && (
            <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-green-900 mb-2">
                    âœ… WhatsApp Conectado com Sucesso!
                  </h3>
                  <p className="text-green-700 text-sm mb-3">
                    Seu WhatsApp estÃ¡ conectado e pronto para enviar mensagens automÃ¡ticas aos candidatos.
                  </p>
                  <button
                    onClick={() => window.location.href = '/rh/comunicacao'}
                    className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Ir para ComunicaÃ§Ã£o
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* InformaÃ§Ãµes Adicionais */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">â„¹ï¸ Importante:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>â€¢ O WhatsApp precisa estar instalado no celular</li>
              <li>â€¢ Mantenha o celular conectado Ã  internet</li>
              <li>â€¢ NÃ£o faÃ§a logout do WhatsApp Web manualmente</li>
              <li>â€¢ A conexÃ£o Ã© salva e persiste entre reinicializaÃ§Ãµes do servidor</li>
              <li>â€¢ Recomenda-se usar um nÃºmero comercial, nÃ£o pessoal</li>
            </ul>
          </div>
        </div>
      </div>
    </RHLayout>
  );
}

