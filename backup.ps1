# Skrip Backup Otomatis PARABOT ke GitHub
# Author: bangkitberuang <bangkitberuang@gmail.com>

$env:PATH = [System.Environment]::GetEnvironmentVariable("PATH","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("PATH","User")

$commitMsg = $args[0]
if (-not $commitMsg) {
    $commitMsg = "backup: pembaruan otomatis proyek " + (Get-Date -Format "yyyy-MM-dd HH:mm:ss")
}

Write-Host ">>> Memulai proses backup PARABOT ke GitHub..." -ForegroundColor Cyan

# Pastikan identitas git sudah benar
git config user.email "bangkitberuang@gmail.com"
git config user.name "bangkitberuang"

# Tambahkan perubahan ke git
git add .

# Cek apakah ada perubahan
$status = git status --porcelain
if (-not $status) {
    Write-Host ">>> Tidak ada perubahan baru yang perlu di-commit." -ForegroundColor Yellow
} else {
    Write-Host ">>> Menyimpan perubahan..." -ForegroundColor Green
    git commit -m $commitMsg
}

# Dorong ke GitHub
Write-Host ">>> Mengirim ke repository GitHub (bangkitberuang/parabot)..." -ForegroundColor Cyan
git push -u origin main

Write-Host ">>> Backup selesai!" -ForegroundColor Green
