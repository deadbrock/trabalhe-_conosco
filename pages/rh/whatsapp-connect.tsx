import { useState } from 'react';
import RHLayout from '@/components/RHLayout';
import { apiGet, apiPost } from '@/lib/api';
import { Smartphone, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

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

    // Limpar após 2 minutos (QR code expira)
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
      <div className="space-y-10 max-w-4xl mx-auto">
        <SectionTitle
          title="WhatsApp"
          subtitle="Conecte sua conta para envio automatizado de mensagens aos candidatos"
          icon={<Smartphone className="h-5 w-5" />}
        />

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <div>
                <CardTitle>Conexão</CardTitle>
                <CardDescription>Status e pareamento via QR Code</CardDescription>
              </div>
              {status === "connected" ? (
                <Badge tone="success">Conectado</Badge>
              ) : status === "connecting" ? (
                <Badge tone="warning">Aguardando conexão</Badge>
              ) : (
                <Badge tone="error">Desconectado</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">

          {/* Botão Gerar QR Code */}
          {status !== 'connected' && (
            <Button
              onClick={gerarQRCode}
              disabled={loading}
              tone="primary"
              gradient
              className="w-full md:w-auto"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Gerando…
                </>
              ) : (
                <>
                  <Smartphone className="h-4 w-4" />
                  Gerar QR Code
                </>
              )}
            </Button>
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
                   Escaneie o QR Code com seu WhatsApp
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
                  <p><strong>2.</strong> Toque em &quot;Configurações&quot; → &quot;Aparelhos conectados&quot;</p>
                  <p><strong>3.</strong> Toque em &quot;Conectar um aparelho&quot;</p>
                  <p><strong>4.</strong> Escaneie o QR Code acima</p>
                  <p className="text-yellow-600 font-medium mt-4">
                    O QR Code expira em 2 minutos
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
                     WhatsApp Conectado com Sucesso!
                  </h3>
                  <p className="text-green-700 text-sm mb-3">
                    Seu WhatsApp está conectado e pronto para enviar mensagens automáticas aos candidatos.
                  </p>
                  <button
                    onClick={() => window.location.href = '/rh/comunicacao'}
                    className="hidden"
                  >
                    Ir para Comunicação
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Informações Adicionais */}
          {status === "connected" ? (
            <Button
              onClick={() => (window.location.href = "/rh/comunicacao")}
              variant="outline"
              tone="primary"
              className="w-full sm:w-auto"
            >
              Ir para Comunicação
            </Button>
          ) : null}
        </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Importante</CardTitle>
            <CardDescription>Boas práticas para manter a integração estável</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2 text-sm text-neutral-700">
              <li>O WhatsApp precisa estar instalado no celular</li>
              <li>Mantenha o celular conectado à internet</li>
              <li>Não faça logout do WhatsApp Web manualmente</li>
              <li>A conexão persiste entre reinicializações do servidor</li>
              <li>Recomenda-se usar um número comercial, não pessoal</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </RHLayout>
  );
}

