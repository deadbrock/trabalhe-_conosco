import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function Hero() {
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Verificar se o arquivo existe antes de tentar carregar
    const checkVideoExists = async () => {
      try {
        const response = await fetch('/fg.mp4', { method: 'HEAD' });
        if (!response.ok) {
          console.error(`❌ Arquivo fg.mp4 não encontrado. Status: ${response.status}`);
          console.error(`📁 URL tentada: ${window.location.origin}/fg.mp4`);
          setVideoError(true);
          return;
        }
        console.log("✅ Arquivo fg.mp4 encontrado, iniciando carregamento...");
      } catch (error) {
        console.error("❌ Erro ao verificar arquivo:", error);
        setVideoError(true);
      }
    };

    checkVideoExists();

    // Forçar o vídeo a carregar e reproduzir
    if (videoRef.current) {
      const video = videoRef.current;
      
      // Verificar se o vídeo existe
      video.addEventListener('loadstart', () => {
        console.log("🟡 Iniciando carregamento do vídeo fg.mp4");
      });
      
      video.addEventListener('loadedmetadata', () => {
        console.log("📊 Metadados do vídeo carregados:", {
          duration: video.duration,
          videoWidth: video.videoWidth,
          videoHeight: video.videoHeight,
          readyState: video.readyState
        });
      });
      
      video.addEventListener('canplay', () => {
        console.log("🟢 Vídeo pronto para reproduzir");
        video.play().catch((error) => {
          console.error("❌ Erro ao reproduzir vídeo:", error);
          setVideoError(true);
        });
      });
      
      video.addEventListener('error', (e) => {
        const videoElement = e.target as HTMLVideoElement;
        const error = videoElement.error;
        if (error) {
          console.error("❌ Erro detalhado no vídeo:", {
            code: error.code,
            message: error.message,
            MEDIA_ERR_ABORTED: error.MEDIA_ERR_ABORTED,
            MEDIA_ERR_NETWORK: error.MEDIA_ERR_NETWORK,
            MEDIA_ERR_DECODE: error.MEDIA_ERR_DECODE,
            MEDIA_ERR_SRC_NOT_SUPPORTED: error.MEDIA_ERR_SRC_NOT_SUPPORTED
          });
          
          let errorMsg = "Erro desconhecido";
          switch(error.code) {
            case error.MEDIA_ERR_ABORTED:
              errorMsg = "Carregamento abortado pelo usuário";
              break;
            case error.MEDIA_ERR_NETWORK:
              errorMsg = "Erro de rede ao carregar vídeo";
              break;
            case error.MEDIA_ERR_DECODE:
              errorMsg = "Erro ao decodificar vídeo (formato não suportado?)";
              break;
            case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
              errorMsg = "Formato de vídeo não suportado ou arquivo não encontrado";
              break;
          }
          console.error(`❌ ${errorMsg}`);
        }
        setVideoError(true);
      });
      
      // Carregar o vídeo
      video.load();
    }
  }, []);

  return (
    <section className="relative flex items-center justify-center overflow-hidden h-[70vh]">
      {/* Vídeo de fundo ou imagem de fallback */}
      <div className="absolute inset-0 w-full h-full z-0">
        {!videoError ? (
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover z-0"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            style={{ zIndex: -1 }}
            onError={(e) => {
              const video = e.currentTarget;
              const error = video.error;
              
              console.error("❌ ERRO DETALHADO NO VÍDEO:");
              console.error("- URL do vídeo:", video.src);
              console.error("- currentSrc:", video.currentSrc);
              console.error("- networkState:", video.networkState, ["NETWORK_EMPTY", "NETWORK_IDLE", "NETWORK_LOADING", "NETWORK_NO_SOURCE"][video.networkState]);
              console.error("- readyState:", video.readyState, ["HAVE_NOTHING", "HAVE_METADATA", "HAVE_CURRENT_DATA", "HAVE_FUTURE_DATA", "HAVE_ENOUGH_DATA"][video.readyState]);
              
              if (error) {
                console.error("- Código do erro:", error.code);
                console.error("- Mensagem:", error.message);
                const errorMessages = [
                  "Erro desconhecido",
                  "MEDIA_ERR_ABORTED: Download abortado",
                  "MEDIA_ERR_NETWORK: Erro de rede",
                  "MEDIA_ERR_DECODE: Erro ao decodificar",
                  "MEDIA_ERR_SRC_NOT_SUPPORTED: Formato não suportado ou arquivo muito grande"
                ];
                console.error("- Tipo:", errorMessages[error.code] || errorMessages[0]);
              }
              
              console.warn("⚠️ Vídeo não pode ser carregado. Usando fallback visual.");
              
              // Tentar verificar se é problema de tamanho
              fetch(video.src, { method: 'HEAD' }).then(response => {
                const size = response.headers.get('content-length');
                if (size) {
                  const sizeMB = (parseInt(size) / 1024 / 1024).toFixed(2);
                  console.info(`📊 Tamanho do arquivo: ${sizeMB} MB`);
                  if (parseInt(size) > 50 * 1024 * 1024) {
                    console.warn("⚠️ ARQUIVO MUITO GRANDE! Vercel tem limite de 50MB para servir arquivos.");
                    console.info("💡 Solução: Comprimir o vídeo ou hospedar externamente (Cloudinary, S3, etc)");
                  }
                }
              }).catch(err => {
                console.error("❌ Erro ao verificar tamanho:", err);
              });
              
              setVideoError(true);
            }}
            onLoadedData={() => {
              console.log("✅ Vídeo fg.mp4 carregado com sucesso");
            }}
          >
            {/* Vídeo hospedado no Cloudinary para melhor performance e CDN global */}
            <source src="https://res.cloudinary.com/djbvjlw1m/video/upload/v1762443018/fg_oecdza.mp4" type="video/mp4" />
            {/* Fallback para arquivo local caso Cloudinary esteja indisponível */}
            <source src="/fg.mp4" type="video/mp4" />
            Seu navegador não suporta vídeo HTML5.
          </video>
        ) : (
          // Fallback visual elegante quando o vídeo não carrega
          <div className="absolute inset-0 w-full h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-red-900 to-purple-900 animate-gradient-xy" />
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-0 left-0 w-96 h-96 bg-primary/30 rounded-full filter blur-3xl animate-blob" />
              <div className="absolute top-0 right-0 w-96 h-96 bg-red-700/30 rounded-full filter blur-3xl animate-blob animation-delay-2000" />
              <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-purple-600/30 rounded-full filter blur-3xl animate-blob animation-delay-4000" />
            </div>
          </div>
        )}
      </div>

      {/* Overlay com gradiente mais intenso */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70 z-[1]" />
      
      {/* Efeito de vinheta nas bordas */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] z-[1]" />

      {/* Partículas */}
      <div className="absolute inset-0">
        <div className="particles" />
      </div>

      {/* Conteúdo */}
      <div className="relative z-10 mx-auto max-w-6xl px-6 text-center py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-block px-6 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-4"
          >
            <span className="text-white font-medium">✨ Sua carreira começa aqui</span>
          </motion.div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight">
            <span className="block text-white drop-shadow-2xl">
              <span className="text-primary">Construa</span> seu futuro
            </span>
            <span className="block text-white drop-shadow-2xl mt-2">
              conosco
            </span>
          </h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 text-white/90 text-xl sm:text-2xl font-light drop-shadow-lg max-w-3xl mx-auto"
          >
            Conheça a família FG Services
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12"
          >
            <a
              href="#oportunidades"
              className="group relative inline-flex items-center justify-center rounded-full px-8 py-4 font-bold text-lg text-white bg-gradient-to-r from-primary to-red-700 hover:from-red-700 hover:to-primary transition-all duration-300 shadow-2xl hover:shadow-primary/50 hover:scale-105"
            >
              <span className="relative z-10">Ver Oportunidades</span>
              <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
            </a>
            
            <a
              href="#nossa-historia"
              className="inline-flex items-center justify-center rounded-full px-8 py-4 font-semibold text-lg text-white bg-white/10 backdrop-blur-sm border-2 border-white/30 hover:bg-white/20 transition-all duration-300"
            >
              Saiba Mais
            </a>
          </motion.div>
        </motion.div>

        {/* Seta para scroll */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChevronDown className="w-8 h-8 text-white/60" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

