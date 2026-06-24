# Anker · lokaler Test-Server (kein Node/Python nötig)
# Rechtsklick -> "Mit PowerShell ausführen"  ODER  in PowerShell:  .\serve.ps1
# Beendet wird er mit Strg + C.

$port = 8080
$root = $PSScriptRoot
$prefix = "http://localhost:$port/"

$mime = @{
  ".html"="text/html; charset=utf-8"; ".css"="text/css; charset=utf-8";
  ".js"="application/javascript; charset=utf-8"; ".json"="application/json; charset=utf-8";
  ".webmanifest"="application/manifest+json; charset=utf-8"; ".png"="image/png";
  ".svg"="image/svg+xml"; ".ico"="image/x-icon"; ".txt"="text/plain; charset=utf-8"
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)
try { $listener.Start() }
catch { Write-Host "Konnte Port $port nicht öffnen. Läuft schon ein Server? Fehler: $_" -ForegroundColor Red; return }

Write-Host ""
Write-Host "  Anker läuft:  $prefix" -ForegroundColor Green
Write-Host "  Im Browser öffnen, dann zum Installieren das Menü -> 'App installieren'." -ForegroundColor Gray
Write-Host "  Beenden mit Strg + C." -ForegroundColor Gray
Write-Host ""
try { Start-Process $prefix } catch {}

while ($listener.IsListening) {
  try {
    $ctx = $listener.GetContext()
    $rel = [System.Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath).TrimStart("/")
    if ([string]::IsNullOrEmpty($rel)) { $rel = "index.html" }
    $path = Join-Path $root $rel
    if (Test-Path $path -PathType Leaf) {
      $ext = [System.IO.Path]::GetExtension($path).ToLower()
      $ct = $mime[$ext]; if (-not $ct) { $ct = "application/octet-stream" }
      $bytes = [System.IO.File]::ReadAllBytes($path)
      $ctx.Response.ContentType = $ct
      $ctx.Response.ContentLength64 = $bytes.Length
      $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
      $ctx.Response.StatusCode = 404
      $msg = [System.Text.Encoding]::UTF8.GetBytes("404 - nicht gefunden: $rel")
      $ctx.Response.OutputStream.Write($msg, 0, $msg.Length)
    }
    $ctx.Response.OutputStream.Close()
  } catch { }
}
