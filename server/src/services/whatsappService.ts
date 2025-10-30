import axios from 'axios';

interface EnviarWhatsAppParams {
  numero: string;
  mensagem: string;
}

interface ResultadoEnvio {
  sucesso: boolean;
  messageId?: string;
  erro?: string;
}

export async function enviarWhatsApp({
  numero,
  mensagem
}: EnviarWhatsAppParams): Promise<ResultadoEnvio> {
  try {
    // Verificar se Evolution API está configurada
    if (!process.env.EVOLUTION_API_URL || !process.env.EVOLUTION_API_KEY) {
      console.warn('⚠️ Evolution API não configurada. WhatsApp não será enviado.');
      return {
        sucesso: false,
        erro: 'Serviço de WhatsApp não configurado'
      };
    }

    // Limpar e formatar número
    const numeroLimpo = numero.replace(/\D/g, '');
    
    // Adicionar código do país se não tiver
    const numeroFormatado = numeroLimpo.startsWith('55') 
      ? numeroLimpo 
      : `55${numeroLimpo}`;

    const instanceName = process.env.EVOLUTION_INSTANCE_NAME || 'default';
    const url = `${process.env.EVOLUTION_API_URL}/message/sendText/${instanceName}`;

    const response = await axios.post(
      url,
      {
        number: numeroFormatado,
        text: mensagem
      },
      {
        headers: {
          'apikey': process.env.EVOLUTION_API_KEY,
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 segundos
      }
    );

    if (response.data && response.data.key) {
      console.log(`✅ WhatsApp enviado com sucesso para ${numeroFormatado} - ID: ${response.data.key.id}`);
      return {
        sucesso: true,
        messageId: response.data.key.id
      };
    }

    return {
      sucesso: true,
      messageId: response.data?.messageId || 'unknown'
    };
  } catch (error: any) {
    console.error('❌ Erro ao enviar WhatsApp:', error.message);
    
    if (error.response) {
      return {
        sucesso: false,
        erro: error.response.data?.message || 'Erro na API do WhatsApp'
      };
    }

    if (error.code === 'ECONNABORTED') {
      return {
        sucesso: false,
        erro: 'Timeout ao conectar com Evolution API'
      };
    }

    return {
      sucesso: false,
      erro: error.message || 'Erro desconhecido ao enviar WhatsApp'
    };
  }
}

export async function verificarConexao(): Promise<boolean> {
  try {
    if (!process.env.EVOLUTION_API_URL || !process.env.EVOLUTION_API_KEY) {
      return false;
    }

    const instanceName = process.env.EVOLUTION_INSTANCE_NAME || 'default';
    const url = `${process.env.EVOLUTION_API_URL}/instance/connectionState/${instanceName}`;

    const response = await axios.get(url, {
      headers: {
        'apikey': process.env.EVOLUTION_API_KEY
      },
      timeout: 5000
    });

    return response.data?.state === 'open';
  } catch (error) {
    console.error('❌ Erro ao verificar conexão WhatsApp:', error);
    return false;
  }
}

export async function substituirVariaveis(
  template: string,
  variaveis: Record<string, string | number>
): Promise<string> {
  let resultado = template;
  
  Object.entries(variaveis).forEach(([chave, valor]) => {
    const regex = new RegExp(`{{${chave}}}`, 'g');
    resultado = resultado.replace(regex, String(valor));
  });

  return resultado;
}

