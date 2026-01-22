$source = "d:\школа сайт"
$public = "d:\школа сайт\public"

# Создаём папку public если её нет
if (-not (Test-Path $public)) {
    New-Item -ItemType Directory -Path $public | Out-Null
    Write-Host "✅ Папка public создана"
}

# Копируем основные файлы
@("index.html", "manifest.json", "service-worker.js", "package.json", "vercel.json") | ForEach-Object {
    $file = "$source\$_"
    if (Test-Path $file) {
        Copy-Item $file "$public\$_" -Force
        Write-Host "✅ Скопирован $_"
    }
}

# Копируем папки
@("src", "assets") | ForEach-Object {
    $folder = "$source\$_"
    $dest = "$public\$_"
    if (Test-Path $folder) {
        if (Test-Path $dest) {
            Remove-Item $dest -Recurse -Force
        }
        Copy-Item $folder $dest -Recurse
        Write-Host "✅ Скопирована папка $_"
    }
}

Write-Host "`n✨ Готово! Все файлы в public"
