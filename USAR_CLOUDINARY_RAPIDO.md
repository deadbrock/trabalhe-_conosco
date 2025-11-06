# ⚡ Cloudinary - Setup Rápido (5 minutos)

## 🎯 Por que Cloudinary?

- ✅ Seu vídeo (62 MB) é muito bom para comprimir mais
- ✅ Cloudinary é **GRATUITO** (25 GB)
- ✅ CDN global = carrega mais rápido
- ✅ Usado por sites grandes profissionalmente

---

## 📋 Passo a Passo (5 minutos)

### 1️⃣ Criar Conta (1 minuto)

1. Abra: https://cloudinary.com/users/register_free
2. Preencha:
   - Nome
   - Email
   - Senha
3. Clique **"Sign Up"**
4. Confirme o email que receberá

### 2️⃣ Upload do Vídeo (2 minutos)

1. Login: https://console.cloudinary.com
2. Menu lateral: **"Media Library"**
3. Clique: **"Upload"** (botão azul)
4. Arraste `fg.mp4` ou clique **"Select File"**
5. Aguarde upload terminar (barra de progresso)

### 3️⃣ Copiar URL (30 segundos)

1. Clique no vídeo que fez upload
2. Copie a **URL** que aparece (algo como):
   ```
   https://res.cloudinary.com/dxxxxxxxxx/video/upload/v1730935123/fg.mp4
   ```

### 4️⃣ Atualizar Código (1 minuto)

Cole a URL que copiou aqui:

```
URL_DO_CLOUDINARY = _________________________________
```

Agora me envie essa URL que eu atualizo o código automaticamente! 🚀

---

## 🎬 Resultado

Seu vídeo:
- ✅ Carregará mais rápido (CDN global)
- ✅ Terá a melhor qualidade (62 MB sem mais compressão)
- ✅ Funcionará perfeitamente no Vercel
- ✅ Economizará espaço no seu repositório

---

## 💰 É Realmente Gratuito?

**SIM!** Plano gratuito inclui:
- 25 GB de armazenamento
- 25 GB de bandwidth/mês
- CDN global
- Otimização automática

Seu vídeo (62 MB) é apenas **0.24% do limite gratuito**.

---

## 🆚 Alternativa: Comprimir Mais

Se preferir não usar Cloudinary:

```bash
cd "C:\Users\user\Documents\trabalhe conosco\trabalhe-_conosco\public"
ffmpeg -i fg.mp4 -c:v libx264 -crf 32 -preset slow -vf scale=1280:720 -c:a aac -b:a 96k -movflags +faststart fg_final.mp4
```

Isso deve gerar um arquivo de **~35-40 MB** (mas com perda de qualidade).

---

## 🚀 Sua Escolha

1. **Cloudinary** (5 min, melhor qualidade) ⭐ **RECOMENDADO**
2. **Comprimir mais** (2 min, perde qualidade)

**Me diga qual prefere e eu ajudo!** 😊

