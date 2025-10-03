# TrackMan Development Server Launcher
Write-Host "Starting TrackMan Development Server..." -ForegroundColor Green
Write-Host ""

# Start backend server
Write-Host "Starting Backend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run server:dev"

# Wait a moment
Start-Sleep -Seconds 2

# Start frontend client
Write-Host "Starting Frontend Client..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run client:dev"

Write-Host ""
Write-Host "Both servers are starting in separate windows..." -ForegroundColor Green
Write-Host "Press any key to exit this launcher..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
