$ErrorActionPreference = "Stop"

Write-Host "=========================================================="
Write-Host "SMART QUEUELESS CANTEEN: FULL E2E SYSTEM INTEGRATION TEST"
Write-Host "=========================================================="

# 1. Student Login
Write-Host "`n1. Testing Student Authentication..."
$loginBody = @{
    email = "student@canteen.com"
    password = "password123"
} | ConvertTo-Json

$loginRes = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -ContentType "application/json" -Body $loginBody
$studentToken = $loginRes.data.token
$studentId = $loginRes.data.id
Write-Host "   -> Logged in as: $($loginRes.data.name) (Role: $($loginRes.data.role))"
Write-Host "   -> Token acquired: $($studentToken.Substring(0, 20))..."

$studentHeaders = @{
    Authorization = "Bearer $studentToken"
    "Content-Type" = "application/json"
}

# 2. Browse Queue
Write-Host "`n2. Checking Live Queue Status..."
$queueRes = Invoke-RestMethod -Uri "http://localhost:8080/api/queue/current" -Method Get
Write-Host "   -> Crowd Level: $($queueRes.data.crowdLevel)"
Write-Host "   -> Orders In Queue: $($queueRes.data.totalInQueue)"
Write-Host "   -> Estimated Wait: $($queueRes.data.estimatedWaitMinutes) mins"

# 3. Browse Foods
Write-Host "`n3. Browsing Menu Foods..."
$foodsRes = Invoke-RestMethod -Uri "http://localhost:8080/api/foods" -Method Get
Write-Host "   -> Food items available: $($foodsRes.data.Count)"
$firstFood = $foodsRes.data[0]
Write-Host "   -> Sample food item: $($firstFood.name) - INR $($firstFood.price)"

# 4. Fetch Pickup Slots
Write-Host "`n4. Fetching Pickup Time Slots..."
$slotsRes = Invoke-RestMethod -Uri "http://localhost:8080/api/pickup-slots" -Method Get
Write-Host "   -> Available slots: $($slotsRes.data.Count)"
$firstSlot = $slotsRes.data[0]
Write-Host "   -> Selected slot: $($firstSlot.startTime) - $($firstSlot.endTime)"

# 5. Apply Promo Coupon
Write-Host "`n5. Applying Coupon Code (WELCOME50)..."
$couponBody = @{
    code = "WELCOME50"
    subtotal = $firstFood.price * 2
} | ConvertTo-Json
$couponRes = Invoke-RestMethod -Uri "http://localhost:8080/api/coupons/apply" -Method Post -ContentType "application/json" -Body $couponBody
Write-Host "   -> Discount calculated: INR $($couponRes.data.discountAmount)"
Write-Host "   -> Final amount: INR $($couponRes.data.finalAmount)"

# 6. Place Pre-Order
Write-Host "`n6. Placing Food Pre-Order..."
$orderBody = @{
    items = @(
        @{
            foodId = $firstFood.id
            quantity = 2
            customizations = "Extra crispy"
        }
    )
    pickupSlotId = $firstSlot.id
    couponCode = "WELCOME50"
    notes = "E2E automated verification order"
} | ConvertTo-Json

$orderRes = Invoke-RestMethod -Uri "http://localhost:8080/api/orders" -Method Post -Headers $studentHeaders -Body $orderBody
$order = $orderRes.data
Write-Host "   -> Order Placed Successfully!"
Write-Host "   -> Order ID: $($order.id)"
Write-Host "   -> Token Number: $($order.tokenNumber)"
Write-Host "   -> Order Status: $($order.status)"
Write-Host "   -> QR Identifier: $($order.qrCodeIdentifier)"

# 7. Check Order-Specific Queue Status
Write-Host "`n7. Checking Real-time Order Queue Position..."
$orderQueueRes = Invoke-RestMethod -Uri "http://localhost:8080/api/queue/order/$($order.id)" -Method Get
Write-Host "   -> Queue Position: $($orderQueueRes.data.queuePosition)"
Write-Host "   -> Orders Ahead: $($orderQueueRes.data.ordersAhead)"

# 8. Create Razorpay Payment Order
Write-Host "`n8. Creating Razorpay Payment Order..."
$payCreateBody = @{
    orderId = $order.id
} | ConvertTo-Json
$payCreateRes = Invoke-RestMethod -Uri "http://localhost:8080/api/payments/create-order" -Method Post -Headers $studentHeaders -Body $payCreateBody
Write-Host "   -> Razorpay Order ID: $($payCreateRes.data.razorpayOrderId)"
Write-Host "   -> Amount: INR $($payCreateRes.data.amount)"

# 9. Verify Razorpay Payment
Write-Host "`n9. Verifying Payment Callback Signature..."
$payVerifyBody = @{
    orderId = $order.id
    razorpayOrderId = $payCreateRes.data.razorpayOrderId
    razorpayPaymentId = "pay_e2e_test_9999"
    razorpaySignature = "demo_sig_valid"
} | ConvertTo-Json
$payVerifyRes = Invoke-RestMethod -Uri "http://localhost:8080/api/payments/verify" -Method Post -Headers $studentHeaders -Body $payVerifyBody
Write-Host "   -> Payment status: $($payVerifyRes.data.status)"
Write-Host "   -> Order status after payment: $($payVerifyRes.data.orderStatus)"

# 10. Staff Login & QR Code Scanning at Quick Pickup Counter
Write-Host "`n10. Staff Pickup Scanning Flow..."
$staffLoginBody = @{
    email = "staff@canteen.com"
    password = "password123"
} | ConvertTo-Json
$staffLoginRes = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -ContentType "application/json" -Body $staffLoginBody
$staffToken = $staffLoginRes.data.token
Write-Host "   -> Logged in as Staff: $($staffLoginRes.data.name)"

$staffHeaders = @{
    Authorization = "Bearer $staffToken"
    "Content-Type" = "application/json"
}

# Scan customer QR code
Write-Host "`n11. Staff Scanning Customer QR Code..."
$qrScanRes = Invoke-RestMethod -Uri "http://localhost:8080/api/orders/verify/qr?qrIdentifier=$($order.qrCodeIdentifier)" -Method Post -Headers $staffHeaders
Write-Host "   -> QR Code Verified Successfully!"
Write-Host "   -> Order $($qrScanRes.data.tokenNumber) status transitioned to: $($qrScanRes.data.status)"

# 12. Student Reviews the meal
Write-Host "`n12. Student Submitting Review..."
$reviewBody = @{
    foodId = $firstFood.id
    orderId = $order.id
    rating = 5
    waitTimeRating = 5
    comment = "Authentic taste and hot delivery at counter! Queue was completely eliminated."
} | ConvertTo-Json
$reviewRes = Invoke-RestMethod -Uri "http://localhost:8080/api/reviews" -Method Post -Headers $studentHeaders -Body $reviewBody
Write-Host "   -> Review submitted: Rating $($reviewRes.data.rating) Stars"

# 13. Admin Analytics KPI Check
Write-Host "`n13. Admin Dashboard & Analytics..."
$adminLoginBody = @{
    email = "admin@canteen.com"
    password = "password123"
} | ConvertTo-Json
$adminLoginRes = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -ContentType "application/json" -Body $adminLoginBody
$adminToken = $adminLoginRes.data.token
$adminHeaders = @{
    Authorization = "Bearer $adminToken"
    "Content-Type" = "application/json"
}
$adminStatsRes = Invoke-RestMethod -Uri "http://localhost:8080/api/admin/dashboard" -Method Get -Headers $adminHeaders
Write-Host "   -> Total Orders Today: $($adminStatsRes.data.todayOrders)"
Write-Host "   -> Total Revenue Today: INR $($adminStatsRes.data.todayRevenue)"
Write-Host "   -> Pending Orders In Queue: $($adminStatsRes.data.pendingOrders)"
Write-Host "   -> Avg Preparation Time: $($adminStatsRes.data.avgPrepMinutes) mins"

Write-Host "`n=========================================================="
Write-Host "ALL 13 END-TO-END PIPELINE STEPS PASSED SUCCESSFULLY!"
Write-Host "=========================================================="
