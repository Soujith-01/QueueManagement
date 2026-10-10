package com.smartcanteen.service;

import com.smartcanteen.model.*;
import com.smartcanteen.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.List;

@Service
public class DatabaseSeederService implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DatabaseSeederService.class);

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final FoodRepository foodRepository;
    private final PickupSlotRepository pickupSlotRepository;
    private final CouponRepository couponRepository;
    private final CanteenSettingsRepository settingsRepository;
    private final OrderRepository orderRepository;
    private final PasswordEncoder passwordEncoder;
    private final PickupSlotService pickupSlotService;

    public DatabaseSeederService(UserRepository userRepository,
                                 CategoryRepository categoryRepository,
                                 FoodRepository foodRepository,
                                 PickupSlotRepository pickupSlotRepository,
                                 CouponRepository couponRepository,
                                 CanteenSettingsRepository settingsRepository,
                                 OrderRepository orderRepository,
                                 PasswordEncoder passwordEncoder,
                                 PickupSlotService pickupSlotService) {
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.foodRepository = foodRepository;
        this.pickupSlotRepository = pickupSlotRepository;
        this.couponRepository = couponRepository;
        this.settingsRepository = settingsRepository;
        this.orderRepository = orderRepository;
        this.passwordEncoder = passwordEncoder;
        this.pickupSlotService = pickupSlotService;
    }

    @Override
    public void run(String... args) {
        log.info("Checking database seed status...");
        seedSettings();
        seedCategories();
        seedUsers();
        seedFoods();
        seedPickupSlots();
        seedCoupons();
        seedInitialDemoOrders();
        log.info("Database seeding check complete!");
    }

    private void seedSettings() {
        if (!settingsRepository.existsById("GLOBAL_SETTINGS")) {
            CanteenSettings settings = CanteenSettings.builder()
                    .id("GLOBAL_SETTINGS")
                    .canteenName("Apex University Central Canteen")
                    .open(true)
                    .openingTime("08:00")
                    .closingTime("20:00")
                    .maxOrdersPerSlot(25)
                    .slotDurationMinutes(10)
                    .avgPrepTimeMinutes(8)
                    .leaveNowAlertMinutes(5)
                    .crowdThresholdMedium(15)
                    .crowdThresholdHigh(30)
                    .allowPreorders(true)
                    .aiRecommendationsEnabled(true)
                    .announcementBanner("🔥 Peak lunch rush expected between 12:45 PM and 01:15 PM. Pre-order now to skip the line!")
                    .build();
            settingsRepository.save(settings);
            log.info("Seeded Canteen Settings");
        }
    }

    private void seedUsers() {
        // 3 Primary Distinct Roles
        createOrUpdateUser("customer@canteen.com", "Rohan Mehta (Customer)", "password123", Role.CUSTOMER, "CUST-1001", "Campus Customer");
        createOrUpdateUser("canteen@canteen.com", "Chef Suresh (Canteen Admin)", "password123", Role.CANTEEN_ADMIN, "CADM-501", "Canteen Operations & Menu");
        createOrUpdateUser("superadmin@canteen.com", "Director Verma (Super Admin)", "password123", Role.SUPER_ADMIN, "SADM-001", "Executive Management");

        // Campus Demo Users
        createOrUpdateUser("admin@canteen.edu", "Dr. Rajesh Sharma (Admin)", "Admin@123", Role.SUPER_ADMIN, "ADM-001", "Canteen Directorate");
        createOrUpdateUser("admin@canteen.com", "Admin Director", "password123", Role.SUPER_ADMIN, "ADM-002", "Canteen Directorate");
        
        createOrUpdateUser("staff@canteen.edu", "Ramesh Kumar (Chef / Staff)", "Staff@123", Role.CANTEEN_ADMIN, "STF-204", "Kitchen Operations");
        createOrUpdateUser("staff@canteen.com", "Canteen Kitchen Staff", "password123", Role.CANTEEN_ADMIN, "STF-205", "Kitchen Operations");
        
        createOrUpdateUser("faculty@campus.edu", "Prof. Ananya Iyer", "Faculty@123", Role.FACULTY, "FAC-CS-104", "Computer Science & Engg");
        createOrUpdateUser("faculty@canteen.com", "Dr. Vikram Seth (Faculty)", "password123", Role.FACULTY, "FAC-EC-102", "Electronics & Comm");
        
        createOrUpdateUser("student@campus.edu", "Rahul Verma (Student)", "Student@123", Role.STUDENT, "STU-2026-881", "Information Technology");
        createOrUpdateUser("student@canteen.com", "Soujith Goudampally (Student)", "password123", Role.STUDENT, "STU-2026-900", "Computer Science");
        log.info("Verified all demo accounts for Customer, Canteen Admin, Super Admin, Faculty, Student");
    }

    private void createOrUpdateUser(String email, String name, String rawPassword, Role role, String universityId, String department) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            user = User.builder()
                    .name(name)
                    .email(email)
                    .password(passwordEncoder.encode(rawPassword))
                    .phone("+91 98765 43210")
                    .role(role)
                    .universityId(universityId)
                    .department(department)
                    .active(true)
                    .build();
            userRepository.save(user);
        } else {
            user.setPassword(passwordEncoder.encode(rawPassword));
            user.setActive(true);
            userRepository.save(user);
        }
    }

    private void seedCategories() {
        if (categoryRepository.count() == 0) {
            List<Category> categories = Arrays.asList(
                    Category.builder().name("Biryani & Meals").slug("biryani-meals").icon("🍲").description("Authentic biryanis, thalis, and meal combos").displayOrder(1).build(),
                    Category.builder().name("Rolls & Wraps").slug("rolls-wraps").icon("🌯").description("Fresh grilled kathi rolls and loaded wraps").displayOrder(2).build(),
                    Category.builder().name("Snacks & Quick Bites").slug("snacks").icon("🥟").description("Samosas, egg puffs, cutlets & crispy fries").displayOrder(3).build(),
                    Category.builder().name("South Indian").slug("south-indian").icon("🥞").description("Crispy dosas, idlis, and vadas").displayOrder(4).build(),
                    Category.builder().name("Beverages & Shakes").slug("beverages").icon("🥤").description("Masala chai, cold coffee, juices & coolers").displayOrder(5).build()
            );
            categoryRepository.saveAll(categories);
            log.info("Seeded Categories");
        }
    }

    private void seedFoods() {
        if (foodRepository.count() == 0) {
            List<Food> foods = Arrays.asList(
                    Food.builder()
                            .name("Hyderabadi Veg Dum Biryani")
                            .description("Fragrant basmati rice layered with spiced vegetables, saffron, served with raita and mirchi ka salan.")
                            .price(80.0)
                            .category("Biryani & Meals")
                            .image("https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80")
                            .stock(35)
                            .initialStock(50)
                            .soldCount(48)
                            .preparationTimeMinutes(8)
                            .isAvailable(true)
                            .isVeg(true)
                            .rating(4.8)
                            .ratingCount(124)
                            .tags(Arrays.asList("Bestseller", "Lunch Special", "Spicy"))
                            .isSpecialToday(true)
                            .build(),

                    Food.builder()
                            .name("Chicken Dum Biryani (Single)")
                            .description("Slow-cooked aromatic basmati rice with succulent marinated chicken, boiled egg, and rich spices.")
                            .price(120.0)
                            .category("Biryani & Meals")
                            .image("https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=600&auto=format&fit=crop&q=80")
                            .stock(22)
                            .initialStock(40)
                            .soldCount(65)
                            .preparationTimeMinutes(10)
                            .isAvailable(true)
                            .isVeg(false)
                            .rating(4.9)
                            .ratingCount(210)
                            .tags(Arrays.asList("Chef Special", "Popular"))
                            .isSpecialToday(true)
                            .build(),

                    Food.builder()
                            .name("Paneer Butter Masala + 2 Butter Naan")
                            .description("Soft cottage cheese cubes in rich creamy tomato cashew gravy, served with hot buttered naans.")
                            .price(110.0)
                            .category("Biryani & Meals")
                            .image("https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop&q=80")
                            .stock(18)
                            .initialStock(30)
                            .soldCount(32)
                            .preparationTimeMinutes(12)
                            .isAvailable(true)
                            .isVeg(true)
                            .rating(4.7)
                            .ratingCount(88)
                            .tags(Arrays.asList("North Indian", "Rich"))
                            .build(),

                    Food.builder()
                            .name("Crispy Paneer Kathi Roll")
                            .description("Golden flaky paratha wrapped with spicy tandoori paneer, sliced peppers, onions, and mint mayo.")
                            .price(70.0)
                            .category("Rolls & Wraps")
                            .image("https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80")
                            .stock(28)
                            .initialStock(45)
                            .soldCount(40)
                            .preparationTimeMinutes(6)
                            .isAvailable(true)
                            .isVeg(true)
                            .rating(4.6)
                            .ratingCount(95)
                            .tags(Arrays.asList("Quick Grab", "Crunchy"))
                            .build(),

                    Food.builder()
                            .name("Double Egg Chicken Roll")
                            .description("Pan-seared egg paratha loaded with grilled shredded chicken chunks and spicy tangy sauces.")
                            .price(85.0)
                            .category("Rolls & Wraps")
                            .image("https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=600&auto=format&fit=crop&q=80")
                            .stock(15)
                            .initialStock(35)
                            .soldCount(52)
                            .preparationTimeMinutes(7)
                            .isAvailable(true)
                            .isVeg(false)
                            .rating(4.8)
                            .ratingCount(142)
                            .tags(Arrays.asList("High Protein", "Bestseller"))
                            .build(),

                    Food.builder()
                            .name("Aloo Samosa (2 Pieces)")
                            .description("Crispy golden-fried pastry stuffed with spiced potato and green peas, served with tamarind chutney.")
                            .price(20.0)
                            .category("Snacks & Quick Bites")
                            .image("https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80")
                            .stock(45)
                            .initialStock(80)
                            .soldCount(90)
                            .preparationTimeMinutes(3)
                            .isAvailable(true)
                            .isVeg(true)
                            .rating(4.5)
                            .ratingCount(180)
                            .tags(Arrays.asList("Campus Classic", "Tea Time"))
                            .build(),

                    Food.builder()
                            .name("Spicy Egg Puff")
                            .description("Freshly baked crispy layered puff pastry filled with half boiled spiced egg and caramelized onion masala.")
                            .price(25.0)
                            .category("Snacks & Quick Bites")
                            .image("https://images.unsplash.com/photo-1509722747041-616f39b57569?w=600&auto=format&fit=crop&q=80")
                            .stock(20)
                            .initialStock(40)
                            .soldCount(38)
                            .preparationTimeMinutes(2)
                            .isAvailable(true)
                            .isVeg(false)
                            .rating(4.4)
                            .ratingCount(76)
                            .tags(Arrays.asList("Bakery Fresh"))
                            .build(),

                    Food.builder()
                            .name("Butter Masala Dosa")
                            .description("Crispy golden fermented crepe roasted with pure butter, stuffed with spiced potato masala, served with 2 chutneys & sambar.")
                            .price(50.0)
                            .category("South Indian")
                            .image("https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80")
                            .stock(30)
                            .initialStock(50)
                            .soldCount(72)
                            .preparationTimeMinutes(6)
                            .isAvailable(true)
                            .isVeg(true)
                            .rating(4.8)
                            .ratingCount(160)
                            .tags(Arrays.asList("Crispy", "All Day"))
                            .build(),

                    Food.builder()
                            .name("Iced Cold Coffee")
                            .description("Thick and creamy blended cold brew espresso with chocolate syrup drizzle and ice cream scoop.")
                            .price(40.0)
                            .category("Beverages & Shakes")
                            .image("https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600&auto=format&fit=crop&q=80")
                            .stock(40)
                            .initialStock(60)
                            .soldCount(85)
                            .preparationTimeMinutes(4)
                            .isAvailable(true)
                            .isVeg(true)
                            .rating(4.9)
                            .ratingCount(220)
                            .tags(Arrays.asList("Chilled", "Top Rated"))
                            .build(),

                    Food.builder()
                            .name("Kadak Masala Chai")
                            .description("Traditional hand-boiled Indian milk tea infused with crushed cardamom, fresh ginger, and cloves.")
                            .price(15.0)
                            .category("Beverages & Shakes")
                            .image("https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?w=600&auto=format&fit=crop&q=80")
                            .stock(60)
                            .initialStock(100)
                            .soldCount(150)
                            .preparationTimeMinutes(2)
                            .isAvailable(true)
                            .isVeg(true)
                            .rating(4.9)
                            .ratingCount(340)
                            .tags(Arrays.asList("Hot", "Student Fuel"))
                            .build()
            );

            foodRepository.saveAll(foods);
            log.info("Seeded 10 authentic canteen foods");
        }
    }

    private void seedPickupSlots() {
        String today = LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE);
        pickupSlotService.getSlotsForDate(today);
    }

    private void seedCoupons() {
        if (couponRepository.count() == 0) {
            List<Coupon> coupons = Arrays.asList(
                    Coupon.builder()
                            .code("CANTEEN10")
                            .description("10% instant discount on orders above ₹50")
                            .discountType("PERCENTAGE")
                            .discountValue(10.0)
                            .minimumOrder(50.0)
                            .maximumDiscount(25.0)
                            .active(true)
                            .build(),

                    Coupon.builder()
                            .code("WELCOME20")
                            .description("20% off on your first order above ₹100")
                            .discountType("PERCENTAGE")
                            .discountValue(20.0)
                            .minimumOrder(100.0)
                            .maximumDiscount(40.0)
                            .active(true)
                            .build(),

                    Coupon.builder()
                            .code("LUNCHDEAL")
                            .description("Flat ₹15 off on delicious meal combos")
                            .discountType("FIXED")
                            .discountValue(15.0)
                            .minimumOrder(75.0)
                            .maximumDiscount(15.0)
                            .active(true)
                            .build()
            );
            couponRepository.saveAll(coupons);
            log.info("Seeded Coupons");
        }
    }

    private void seedInitialDemoOrders() {
        if (orderRepository.count() == 0) {
            User student = userRepository.findByEmail("student@campus.edu").orElse(null);
            User faculty = userRepository.findByEmail("faculty@campus.edu").orElse(null);
            List<Food> foods = foodRepository.findAll();
            if (student == null || foods.size() < 4) return;

            String today = LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE);

            // Order A001 - PREPARING
            Order ord1 = Order.builder()
                    .orderNumber("ORD-" + today.replace("-", "") + "-1001")
                    .userId(student.getId())
                    .userName(student.getName())
                    .userEmail(student.getEmail())
                    .userRole(Role.STUDENT)
                    .items(List.of(OrderItem.builder()
                            .foodId(foods.get(0).getId())
                            .foodName(foods.get(0).getName())
                            .price(foods.get(0).getPrice())
                            .quantity(1)
                            .isVeg(true)
                            .subtotal(80.0)
                            .build()))
                    .subtotal(80.0)
                    .finalAmount(80.0)
                    .tokenNumber("A001")
                    .qrCodeIdentifier("SQC-DEMO-ORD-A001")
                    .pickupSlotTime("12:30 PM - 12:40 PM")
                    .pickupSlotDate(today)
                    .status(OrderStatus.PREPARING)
                    .paymentStatus(PaymentStatus.SUCCESS)
                    .queuePosition(1)
                    .estimatedReadyTime(Instant.now().plus(4, ChronoUnit.MINUTES))
                    .createdAt(Instant.now().minus(5, ChronoUnit.MINUTES))
                    .build();

            // Order A002 - READY
            Order ord2 = Order.builder()
                    .orderNumber("ORD-" + today.replace("-", "") + "-1002")
                    .userId(faculty != null ? faculty.getId() : student.getId())
                    .userName(faculty != null ? faculty.getName() : "Faculty User")
                    .userEmail(faculty != null ? faculty.getEmail() : "faculty@campus.edu")
                    .userRole(Role.FACULTY)
                    .items(List.of(OrderItem.builder()
                            .foodId(foods.get(3).getId())
                            .foodName(foods.get(3).getName())
                            .price(foods.get(3).getPrice())
                            .quantity(2)
                            .isVeg(true)
                            .subtotal(140.0)
                            .build()))
                    .subtotal(140.0)
                    .finalAmount(140.0)
                    .tokenNumber("A002")
                    .qrCodeIdentifier("SQC-DEMO-ORD-A002")
                    .pickupSlotTime("12:40 PM - 12:50 PM")
                    .pickupSlotDate(today)
                    .status(OrderStatus.READY)
                    .paymentStatus(PaymentStatus.SUCCESS)
                    .queuePosition(0)
                    .readyAt(Instant.now().minus(2, ChronoUnit.MINUTES))
                    .createdAt(Instant.now().minus(12, ChronoUnit.MINUTES))
                    .build();

            // Order A003 - ACCEPTED
            Order ord3 = Order.builder()
                    .orderNumber("ORD-" + today.replace("-", "") + "-1003")
                    .userId(student.getId())
                    .userName(student.getName())
                    .userEmail(student.getEmail())
                    .userRole(Role.STUDENT)
                    .items(List.of(OrderItem.builder()
                            .foodId(foods.get(1).getId())
                            .foodName(foods.get(1).getName())
                            .price(foods.get(1).getPrice())
                            .quantity(1)
                            .isVeg(false)
                            .subtotal(120.0)
                            .build()))
                    .subtotal(120.0)
                    .finalAmount(120.0)
                    .tokenNumber("A003")
                    .qrCodeIdentifier("SQC-DEMO-ORD-A003")
                    .pickupSlotTime("12:50 PM - 01:00 PM")
                    .pickupSlotDate(today)
                    .status(OrderStatus.ACCEPTED)
                    .paymentStatus(PaymentStatus.SUCCESS)
                    .queuePosition(2)
                    .estimatedReadyTime(Instant.now().plus(8, ChronoUnit.MINUTES))
                    .createdAt(Instant.now().minus(1, ChronoUnit.MINUTES))
                    .build();

            orderRepository.saveAll(Arrays.asList(ord1, ord2, ord3));
            log.info("Seeded initial active demo orders");
        }
    }
}
