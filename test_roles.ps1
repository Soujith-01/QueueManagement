$c = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -ContentType "application/json" -Body (@{email="customer@canteen.com"; password="password123"} | ConvertTo-Json)
$ca = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -ContentType "application/json" -Body (@{email="canteen@canteen.com"; password="password123"} | ConvertTo-Json)
$sa = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -ContentType "application/json" -Body (@{email="superadmin@canteen.com"; password="password123"} | ConvertTo-Json)

Write-Host "Customer Role: $($c.data.role) (Name: $($c.data.name))"
Write-Host "Canteen Admin Role: $($ca.data.role) (Name: $($ca.data.name))"
Write-Host "Super Admin Role: $($sa.data.role) (Name: $($sa.data.name))"

# Test Canteen Admin adding product
$caHeaders = @{
    Authorization = "Bearer $($ca.data.token)"
    "Content-Type" = "application/json"
}
$newProduct = @{
    name = "Paneer Tikka Roll"
    description = "Grilled cottage cheese spiced with mint chutney"
    price = 95.0
    category = "Rolls & Wraps"
    image = "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600"
    stock = 30
    preparationTimeMinutes = 7
    isAvailable = $true
    isVeg = $true
    tags = @("Spicy", "Chef Special")
    isSpecialToday = $true
} | ConvertTo-Json

$createdFood = Invoke-RestMethod -Uri "http://localhost:8080/api/foods" -Method Post -Headers $caHeaders -Body $newProduct
Write-Host "Canteen Admin Created Product:" $createdFood.data.name "(ID:" $createdFood.data.id ")"

