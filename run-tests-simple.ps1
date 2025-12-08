# CalendarSync Pro - Simple Test Script

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "CalendarSync Pro - Quick Tests" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

$pushServer = "http://localhost:3000"
$webApp = "http://localhost:5173"

# Test 1: Push Server
Write-Host "TEST 1: Push Server" -ForegroundColor Green
try {
    $status = Invoke-WebRequest -Uri "$pushServer/status" -UseBasicParsing
    $statusData = $status.Content | ConvertFrom-Json
    Write-Host "  PASS - Push server is running" -ForegroundColor Green
    Write-Host "  Active subscriptions: $($statusData.subscriptions)" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "  FAIL - Push server not running" -ForegroundColor Red
    Write-Host ""
}

# Test 2: Web App
Write-Host "TEST 2: Web App" -ForegroundColor Green
try {
    $app = Invoke-WebRequest -Uri $webApp -UseBasicParsing -TimeoutSec 3
    Write-Host "  PASS - Web app is running" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "  FAIL - Web app not running" -ForegroundColor Red
    Write-Host ""
}

# Test 3: Subscribe Endpoint
Write-Host "TEST 3: Subscribe Endpoint" -ForegroundColor Green
$testSub = '{"endpoint":"https://test.com","keys":{"p256dh":"test","auth":"test"}}'
try {
    $sub = Invoke-WebRequest -Uri "$pushServer/subscribe" -Method POST -Body $testSub -ContentType "application/json" -UseBasicParsing
    Write-Host "  PASS - Subscription endpoint works" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "  FAIL - Subscription endpoint error" -ForegroundColor Red
    Write-Host ""
}

# Test 4: Trigger Endpoint
Write-Host "TEST 4: Notification Trigger" -ForegroundColor Green
try {
    $trigger = Invoke-WebRequest -Uri "$pushServer/trigger" -UseBasicParsing
    $result = $trigger.Content | ConvertFrom-Json
    Write-Host "  PASS - Trigger endpoint works" -ForegroundColor Green
    Write-Host "  Sent: $($result.success), Failed: $($result.failed)" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "  FAIL - Trigger endpoint error" -ForegroundColor Red
    Write-Host ""
}

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "All backend tests complete!" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next: Open http://localhost:5173 and test manually" -ForegroundColor Yellow
Write-Host "Use TEST_EXECUTION_CHECKLIST.md for detailed tests" -ForegroundColor Yellow
Write-Host ""
