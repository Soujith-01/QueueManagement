$ErrorActionPreference = "Stop"

Write-Host "=========================================================="
Write-Host "TESTING ORDER CREATION & QR SCAN DETAILS PIPELINE"
Write-Host "=========================================================="

# 1. Login as Customer
Write-Host "`n1. Customer Login..."
$custLoginBody = @{
    email = "customer@canteen.com"
    password = "password123"
} | ConvertTo-Json

$custLoginRes = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -Body $custLoginBody -ContentType "application/json"
$custToken = $custLoginRes.data.token
$custHeaders = @{ Authorization = "Bearer $custToken" }
Write-Host "   -> Logged in as: $($custLoginRes.data.user.name) ($($custLoginRes.data.user.role))"

# 2. Get Available Food
Write-Host "`n2. Fetching Menu Foods..."
$foods = (Invoke-RestMethod -Uri "http://localhost:8080/api/foods" -Method Get).data
$foodItem = $foods[0]
Write-Host "   -> Selected Food: $($foodItem.name) (Price: $($foodItem.price), ID: $($foodItem.id))"

# 3. Place Order
Write-Host "`n3. Placing Pre-Order..."
$orderBody = @{
    items = @(
        @{ foodId = $foodItem.id; quantity = 2 }
    )
    pickupSlotId = $null
    notes = "Test QR Generation & Scanning"
} | ConvertTo-Json

$orderRes = Invoke-RestMethod -Uri "http://localhost:8080/api/orders" -Method Post -Body $orderBody -ContentType "application/json" -Headers $custHeaders
$createdOrder = $orderRes.data
Write-Host "   -> Order Placed Successfully!"
Write-Host "   -> Order ID: $($createdOrder.id)"
Write-Host "   -> Daily Token Number: $($createdOrder.tokenNumber)"
Write-Host "   -> QR Identifier: $($createdOrder.qrCodeIdentifier)"
Write-Host "   -> QR Payload Length: $($createdOrder.qrCodePayload.Length) chars"

if (-not $createdOrder.qrCodeIdentifier) {
    throw "QR Identifier was not generated!"
}

# 4. Public QR Code Lookup (simulating mobile camera scanning without auth)
Write-Host "`n4. Public QR Code Lookup (Simulating phone camera scan)..."
$lookupUrl = "http://localhost:8080/api/orders/lookup/qr?qrIdentifier=$($createdOrder.qrCodeIdentifier)"
$lookupRes = Invoke-RestMethod -Uri $lookupUrl -Method Get
$scannedOrder = $lookupRes.data

Write-Host "   -> QR Code Scan Success!"
Write-Host "   -> Token Returned: $($scannedOrder.tokenNumber)"
Write-Host "   -> Customer Name: $($scannedOrder.userName)"
Write-Host "   -> Order Status: $($scannedOrder.status)"
Write-Host "   -> Items Count: $($scannedOrder.items.Count)"
Write-Host "   -> Item 1: $($scannedOrder.items[0].foodName) x $($scannedOrder.items[0].quantity)"
Write-Host "   -> Total Amount: Rs. $($scannedOrder.finalAmount)"

if ($scannedOrder.tokenNumber -ne $createdOrder.tokenNumber) {
    throw "Token mismatch between created and scanned order!"
}

# 5. Token Lookup Test
Write-Host "`n5. Public Token Lookup..."
$tokenLookupUrl = "http://localhost:8080/api/orders/lookup/token?tokenNumber=$($createdOrder.tokenNumber)"
$tokenLookupRes = Invoke-RestMethod -Uri $tokenLookupUrl -Method Get
Write-Host "   -> Token Lookup Success: Token #$($tokenLookupRes.data.tokenNumber)"

# 6. Canteen Admin Login & Handover
Write-Host "`n6. Canteen Admin Login & Order Handover..."
$canteenLoginBody = @{
    email = "canteen@canteen.com"
    password = "password123"
} | ConvertTo-Json

$canteenLoginRes = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -Body $canteenLoginBody -ContentType "application/json"
$canteenToken = $canteenLoginRes.data.token
$canteenHeaders = @{ Authorization = "Bearer $canteenToken" }

$verifyRes = Invoke-RestMethod -Uri "http://localhost:8080/api/orders/verify/qr?qrIdentifier=$($createdOrder.qrCodeIdentifier)" -Method Post -Headers $canteenHeaders
Write-Host "   -> Order Handed Over & Verified!"
Write-Host "   -> Final Order Status: $($verifyRes.data.status)"

if ($verifyRes.data.status -ne "COLLECTED") {
    throw "Expected status COLLECTED but got $($verifyRes.data.status)"
}

Write-Host "`n=========================================================="
Write-Host "ALL QR CODE & ORDER DETAILS SCAN TESTS PASSED SUCCESSFULLY!"
Write-Host "=========================================================="
