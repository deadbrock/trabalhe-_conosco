# ☁️ Hospedar Vídeo no Cloudinary (SOLUÇÃO RECOMENDADA)

## 🚫 Problema

O vídeo `fg.mp4` tem **194 MB**, mas o **Vercel tem limite de 50 MB** para servir arquivos estáticos.

---

## ✅ Solução: Cloudinary (Gratuito)

O Cloudinary oferece:
- ✅ **25 GB de armazenamento gratuito**
- ✅ **25 GB de bandwidth/mês gratuito**
- ✅ **CDN global rápido**
- ✅ **Otimização automática de vídeos**

---

## 📋 Passo a Passo

### 1. Criar conta no Cloudinary

1. Acesse: https://cloudinary.com/users/register_free
2. Crie uma conta gratuita
3. Confirme o email

### 2. Upload do vídeo

1. Faça login em: https://console.cloudinary.com
2. Vá em **Media Library** (menu lateral)
3. Clique em **Upload**
4. Arraste o arquivo `fg.mp4` ou selecione
5. Aguarde o upload terminar

### 3. Copiar URL do vídeo

Após o upload, clique no vídeo e copie a **URL pública**.

Exemplo:
```
https://res.cloudinary.com/sua-conta/video/upload/v1234567890/fg.mp4
```

### 4. Atualizar o código

Abra `components/Hero.tsx` e substitua:

**DE:**
```tsx
<source src="/fg.mp4" type="video/mp4" />
```

**PARA:**
```tsx
<source src="https://res.cloudinary.com/SUA-CONTA/video/upload/v1234567890/fg.mp4" type="video/mp4" />
```

### 5. Commit e push

```bash
git add .
git commit -m "feat: hospedar vídeo institucional no Cloudinary"
git push
```

---

## 🎯 Alternativa: Comprimir o Vídeo

Se preferir manter no Vercel, comprima o vídeo para **menos de 50 MB**:

```bash
# Opção 1: Reduzir qualidade (CRF 28-32)
ffmpeg -i fg.mp4 -c:v libx264 -crf 30 -preset slow -c:a aac -b:a 96k -movflags +faststart fg_compressed.mp4

# Opção 2: Reduzir resolução (720p)
ffmpeg -i fg.mp4 -vf scale=1280:720 -c:v libx264 -crf 24 -preset slow -c:a aac -b:a 128k -movflags +faststart fg_720p.mp4

# Opção 3: Cortar duração (primeiros 15 segundos)
ffmpeg -i fg.mp4 -t 15 -c:v libx264 -crf 23 -preset slow -c:a aac -b:a 128k -movflags +faststart fg_short.mp4
```

Teste até conseguir um arquivo **menor que 50 MB**.

---

## 📊 Comparação

| Solução | Vantagem | Desvantagem |
|---------|----------|-------------|
| **Cloudinary** | ✅ Sem limite de tamanho<br>✅ CDN rápido<br>✅ Otimização automática | ⚠️ Dependência externa |
| **Comprimir** | ✅ Hospedado no projeto<br>✅ Sem dependências | ⚠️ Perda de qualidade<br>⚠️ Limite de 50 MB |

---

## 🚀 Recomendação Final

**Use Cloudinary** - É gratuito, rápido e profissional. Grandes sites usam CDNs para vídeos.

Depois de configurar, o vídeo carregará mais rápido para seus usuários! 🎉

