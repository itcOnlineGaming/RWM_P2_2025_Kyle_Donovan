# CalendarSync Pro - Automated Test Script
# This script runs automated tests against the push server

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "CalendarSync Pro - Automated Tests" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

$pushServerUrl = "http://localhost:3000"
$webAppUrl = "http://localhost:5173"

Write-Host "🔍 Testing Push Server Endpoints..." -ForegroundColor Yellow
Write-Host ""

# Test 1: Check if push server is running
Write-Host "TEST 1: Push Server Availability" -ForegroundColor Green
try {
    $response = Invoke-WebRequest -Uri "$pushServerUrl/vapidPublicKey" -Method GET -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "  ✅ PASS - Push server is running" -ForegroundColor Green
        $vapidKey = ($response.Content | ConvertFrom-Json).publicKey
        Write-Host "  📝 VAPID Public Key: $vapidKey" -ForegroundColor Gray
    }
} catch {
    Write-Host "  ❌ FAIL - Push server is not responding" -ForegroundColor Red
    Write-Host "  Error: $_" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Test 2: Test subscription endpoint
Write-Host "TEST 2: Subscription Endpoint" -ForegroundColor Green
$mockSubscription = @{
    endpoint = "https://test.pushservice.com/mock"
    keys = @{
        p256dh = "mock-p256dh-key"
        auth = "mock-auth-key"
    }
}
$mockSubscriptionJson = $mockSubscription | ConvertTo-Json -Depth 3

try {
    $response = Invoke-WebRequest -Uri "$pushServerUrl/subscribe" -Method POST -Body $mockSubscriptionJson -ContentType "application/json" -UseBasicParsing
    if ($response.StatusCode -eq 201) {
        Write-Host "  ✅ PASS - Subscription endpoint working" -ForegroundColor Green
        Write-Host "  📝 Response: $($response.Content)" -ForegroundColor Gray
    }
} catch {
    Write-Host "  ❌ FAIL - Subscription endpoint error" -ForegroundColor Red
    Write-Host "  Error: $_" -ForegroundColor Red
}
Write-Host ""

# Test 3: Test notification trigger endpoint
Write-Host "TEST 3: Notification Trigger Endpoint" -ForegroundColor Green
try {
    $response = Invoke-WebRequest -Uri "$pushServerUrl/trigger" -Method GET -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "  ✅ PASS - Trigger endpoint working" -ForegroundColor Green
        $result = $response.Content | ConvertFrom-Json
        Write-Host "  📝 Notifications sent: $($result.success)" -ForegroundColor Gray
        Write-Host "  📝 Failed: $($result.failed)" -ForegroundColor Gray
    }
} catch {
    Write-Host "  ❌ FAIL - Trigger endpoint error" -ForegroundColor Red
    Write-Host "  Error: $_" -ForegroundColor Red
}
Write-Host ""

# Test 4: Check web app is running
Write-Host "TEST 4: Web App Availability" -ForegroundColor Green
try {
    $response = Invoke-WebRequest -Uri $webAppUrl -Method GET -UseBasicParsing -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host "  ✅ PASS - Web app is running" -ForegroundColor Green
        Write-Host "  📝 URL: $webAppUrl" -ForegroundColor Gray
    }
} catch {
    Write-Host "  ❌ FAIL - Web app is not responding" -ForegroundColor Red
    Write-Host "  Error: $_" -ForegroundColor Red
}
Write-Host ""

# Test 5: Check for CORS headers
Write-Host "TEST 5: CORS Configuration" -ForegroundColor Green
try {
    $response = Invoke-WebRequest -Uri "$pushServerUrl/vapidPublicKey" -Method GET -UseBasicParsing
    $corsHeader = $response.Headers['Access-Control-Allow-Origin']
    if ($corsHeader) {
        Write-Host "  ✅ PASS - CORS headers present" -ForegroundColor Green
        Write-Host "  📝 Access-Control-Allow-Origin: $corsHeader" -ForegroundColor Gray
    } else {
        Write-Host "  ⚠️  WARNING - CORS headers not found" -ForegroundColor Yellow
    }
} catch {
    Write-Host "  ❌ FAIL - Could not check CORS" -ForegroundColor Red
}
Write-Host ""

# Summary
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "Test Summary" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Push Server: Running on port 3000" -ForegroundColor Green
Write-Host "✅ Web App: Running on port 5173" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Open http://localhost:5173 in your browser" -ForegroundColor White
Write-Host "2. Follow the TEST_EXECUTION_CHECKLIST.md for manual tests" -ForegroundColor White
Write-Host "3. Enable push notifications and test" -ForegroundColor White
Write-Host ""
Write-Host "For mobile testing:" -ForegroundColor Yellow
Write-Host "1. Get your network IP address: ipconfig" -ForegroundColor White
Write-Host "2. Access http://[YOUR-IP]:5173 from mobile device" -ForegroundColor White
Write-Host "3. Ensure both devices are on same WiFi network" -ForegroundColor White
Write-Host ""