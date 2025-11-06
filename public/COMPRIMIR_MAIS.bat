@echo off
echo ============================================
echo   COMPRIMIR VIDEO PARA MENOS DE 50 MB
echo ============================================
echo.
echo Arquivo atual: fg.mp4 (62 MB)
echo Alvo: Menos de 50 MB para Vercel
echo.
echo Comprimindo com CRF 32 (qualidade media-alta)...
echo.

ffmpeg -i fg.mp4 -c:v libx264 -crf 32 -preset slow -c:a aac -b:a 96k -movflags +faststart fg_compressed_50mb.mp4

echo.
echo ============================================
echo   COMPRESSAO CONCLUIDA!
echo ============================================
echo.
echo Arquivo gerado: fg_compressed_50mb.mp4
echo.

for %%A in (fg_compressed_50mb.mp4) do (
    set size=%%~zA
    set /a sizeMB=!size! / 1048576
    echo Tamanho: !sizeMB! MB
)

echo.
echo Para usar o arquivo comprimido:
echo 1. Renomeie: mv fg.mp4 fg_original.mp4
echo 2. Renomeie: mv fg_compressed_50mb.mp4 fg.mp4
echo 3. Commit e push
echo.
pause

