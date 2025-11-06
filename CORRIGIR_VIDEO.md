# 🎬 Corrigir Vídeo Institucional

## ❌ Problema Identificado

O vídeo `fg.mp4` está usando um codec ou formato que não é compatível com navegadores web.

**Erro:** `DEMUXER_ERROR_COULD_NOT_OPEN: FFmpegDemuxer: open context failed`

---

## ✅ Solução: Reconverter o Vídeo

### Opção 1: Usar FFmpeg (Recomendado)

#### 1. Instalar FFmpeg

**Windows:**
```bash
# Baixar em: https://ffmpeg.org/download.html
# Ou usar Chocolatey:
choco install ffmpeg
```

**macOS:**
```bash
brew install ffmpeg
```

**Linux:**
```bash
sudo apt install ffmpeg
```

#### 2. Reconverter o Vídeo

```bash
cd "C:\Users\user\Documents\trabalhe conosco\trabalhe-_conosco\public"

# Converter para formato web-friendly
ffmpeg -i fg.mp4 -c:v libx264 -preset slow -crf 22 -c:a aac -b:a 128k -movflags +faststart fg_converted.mp4
```

**Explicação dos parâmetros:**
- `-c:v libx264`: codec H.264 (compatível com todos navegadores)
- `-preset slow`: melhor compressão (mais lento, mas menor arquivo)
- `-crf 22`: qualidade (18-28, 22 é boa qualidade)
- `-c:a aac`: codec de áudio AAC
- `-b:a 128k`: bitrate de áudio
- `-movflags +faststart`: permite streaming progressivo

#### 3. Substituir o Arquivo

```bash
# Backup do original
mv fg.mp4 fg_original.mp4

# Renomear o convertido
mv fg_converted.mp4 fg.mp4
```

#### 4. (Opcional) Criar versão WebM para maior compatibilidade

```bash
ffmpeg -i fg.mp4 -c:v libvpx-vp9 -crf 30 -b:v 0 -c:a libopus fg.webm
```

---

### Opção 2: Converter Online

Se não conseguir instalar o FFmpeg, use um conversor online:

1. **CloudConvert** (recomendado): https://cloudconvert.com/mp4-converter
   - Selecione o arquivo `fg.mp4`
   - Configure:
     - Codec de vídeo: H.264
     - Codec de áudio: AAC
     - Qualidade: Alta
     - Otimizar para web: ✅
   - Baixe o arquivo convertido

2. **HandBrake** (software gratuito): https://handbrake.fr/
   - Preset: "Web > HQ 1080p30 Surround"

---

## 🎨 Fallback Visual Implementado

Enquanto o vídeo não é corrigido, o site exibe um **gradiente animado elegante** com efeito de bolhas flutuantes. Isso garante que o site continue bonito mesmo sem o vídeo.

---

## 📊 Verificar o Vídeo Atual

Para ver informações sobre o vídeo atual:

```bash
ffmpeg -i fg.mp4
```

Procure por:
- **Codec de vídeo**: deve ser `h264`
- **Codec de áudio**: deve ser `aac`
- **Perfil**: deve ser `Main` ou `High`

---

## 🧪 Testar Após Conversão

1. Reinicie o servidor Next.js:
   ```bash
   npm run dev
   ```

2. Abra o navegador em `http://localhost:3000`

3. Abra o Console (F12) e verifique:
   - ✅ "Vídeo fg.mp4 carregado com sucesso"
   - ✅ Nenhum erro de carregamento

---

## 📁 Estrutura Esperada

```
public/
├── fg.mp4          ← Vídeo principal (formato H.264)
├── fg.webm         ← (Opcional) Formato alternativo
└── logo-fg.png
```

---

## 🔍 Troubleshooting

### Vídeo muito grande?

Reduzir resolução:
```bash
ffmpeg -i fg.mp4 -vf scale=1920:1080 -c:v libx264 -crf 23 fg_hd.mp4
```

### Arquivo ainda não funciona?

Verifique se o arquivo não está corrompido:
```bash
ffmpeg -v error -i fg.mp4 -f null -
```

Se houver erros, o arquivo está corrompido e precisa ser re-exportado da fonte original.

---

## 💡 Dicas

1. **Tamanho ideal:** 5-15 MB (máximo 50 MB para Vercel)
2. **Resolução:** 1920x1080 (Full HD)
3. **Duração:** 10-30 segundos em loop
4. **FPS:** 30fps é suficiente para vídeo institucional

---

## ✅ Checklist

- [ ] FFmpeg instalado
- [ ] Vídeo convertido com H.264
- [ ] Arquivo substituído em `public/fg.mp4`
- [ ] Servidor Next.js reiniciado
- [ ] Testado no navegador
- [ ] Console sem erros
- [ ] Vídeo reproduz automaticamente

