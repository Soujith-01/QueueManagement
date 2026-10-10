package com.smartcanteen.service;

import com.smartcanteen.dto.AiMealRecommendationResponse;
import com.smartcanteen.dto.AiPredictionResponse;
import com.smartcanteen.model.Food;
import com.smartcanteen.model.User;
import com.smartcanteen.repository.FoodRepository;
import com.smartcanteen.repository.OrderRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class AiService {

    private static final Logger log = LoggerFactory.getLogger(AiService.class);

    private final FoodRepository foodRepository;
    private final OrderRepository orderRepository;

    @Value("${app.gemini.api-key:}")
    private String geminiApiKey;

    public AiService(FoodRepository foodRepository, OrderRepository orderRepository) {
        this.foodRepository = foodRepository;
        this.orderRepository = orderRepository;
    }

    public AiPredictionResponse predictQueueDemand() {
        LocalTime now = LocalTime.now();
        List<AiPredictionResponse.TimeSlotCrowdForecast> forecastList = new ArrayList<>();

        forecastList.add(AiPredictionResponse.TimeSlotCrowdForecast.builder()
                .timeSlot("12:00 PM - 12:15 PM")
                .crowdLevel("LOW")
                .estimatedOrders(8)
                .estimatedWaitMinutes(4)
                .build());

        forecastList.add(AiPredictionResponse.TimeSlotCrowdForecast.builder()
                .timeSlot("12:15 PM - 12:30 PM")
                .crowdLevel("MEDIUM")
                .estimatedOrders(18)
                .estimatedWaitMinutes(8)
                .build());

        forecastList.add(AiPredictionResponse.TimeSlotCrowdForecast.builder()
                .timeSlot("12:30 PM - 12:45 PM")
                .crowdLevel("HIGH")
                .estimatedOrders(34)
                .estimatedWaitMinutes(14)
                .build());

        forecastList.add(AiPredictionResponse.TimeSlotCrowdForecast.builder()
                .timeSlot("12:45 PM - 01:00 PM")
                .crowdLevel("VERY_HIGH")
                .estimatedOrders(48)
                .estimatedWaitMinutes(20)
                .build());

        forecastList.add(AiPredictionResponse.TimeSlotCrowdForecast.builder()
                .timeSlot("01:00 PM - 01:15 PM")
                .crowdLevel("VERY_HIGH")
                .estimatedOrders(42)
                .estimatedWaitMinutes(18)
                .build());

        forecastList.add(AiPredictionResponse.TimeSlotCrowdForecast.builder()
                .timeSlot("01:15 PM - 01:30 PM")
                .crowdLevel("HIGH")
                .estimatedOrders(28)
                .estimatedWaitMinutes(12)
                .build());

        forecastList.add(AiPredictionResponse.TimeSlotCrowdForecast.builder()
                .timeSlot("01:30 PM - 01:45 PM")
                .crowdLevel("MEDIUM")
                .estimatedOrders(16)
                .estimatedWaitMinutes(7)
                .build());

        forecastList.add(AiPredictionResponse.TimeSlotCrowdForecast.builder()
                .timeSlot("01:45 PM - 02:00 PM")
                .crowdLevel("LOW")
                .estimatedOrders(6)
                .estimatedWaitMinutes(3)
                .build());

        String currentStatus = "MEDIUM";
        if (now.isAfter(LocalTime.of(12, 30)) && now.isBefore(LocalTime.of(13, 15))) {
            currentStatus = "VERY_HIGH";
        } else if (now.isAfter(LocalTime.of(12, 0)) && now.isBefore(LocalTime.of(13, 45))) {
            currentStatus = "HIGH";
        }

        return AiPredictionResponse.builder()
                .currentCrowdStatus(currentStatus)
                .peakTimeRange("12:45 PM - 01:15 PM")
                .recommendedOrderTime("12:15 PM - 12:30 PM (Quickest Prep)")
                .insightSummary("Historical lunch rush spikes at 12:45 PM due to lecture dismissal. Pre-ordering before 12:30 PM saves an estimated 15 minutes of canteen waiting time.")
                .hourlyForecast(forecastList)
                .build();
    }

    public AiMealRecommendationResponse getPersonalizedRecommendations(User user) {
        List<Food> popular = foodRepository.findTop8ByOrderBySoldCountDesc();
        List<Food> recommendedItems = popular.stream().limit(4).toList();

        List<AiMealRecommendationResponse.ComboRecommendation> combos = new ArrayList<>();
        combos.add(AiMealRecommendationResponse.ComboRecommendation.builder()
                .title("Biryani Delight Combo")
                .description("Veg/Chicken Biryani paired with a Chilled Beverage.")
                .itemNames(Arrays.asList("Hyderabadi Veg Biryani", "Thums Up / Coke"))
                .comboPrice(105.0)
                .savings(15.0)
                .build());

        combos.add(AiMealRecommendationResponse.ComboRecommendation.builder()
                .title("Quick Break Snacker")
                .description("Crispy Paneer Roll + Refreshing Cold Coffee.")
                .itemNames(Arrays.asList("Paneer Kathi Roll", "Iced Cold Coffee"))
                .comboPrice(95.0)
                .savings(15.0)
                .build());

        combos.add(AiMealRecommendationResponse.ComboRecommendation.builder()
                .title("Evening Chai Combo")
                .description("Hot Masala Chai with 2 Samosas & Mint Chutney.")
                .itemNames(Arrays.asList("Masala Chai", "Aloo Samosa (2 pcs)"))
                .comboPrice(35.0)
                .savings(5.0)
                .build());

        String habitSummary = "Based on campus trends, lunch orders peak around 1:00 PM. Pre-order your favorite meal in advance!";
        if (user != null) {
            habitSummary = "Hello " + user.getName() + "! Here are chef-curated combos tailored for your lunch break today.";
        }

        return AiMealRecommendationResponse.builder()
                .greeting(user != null ? "Welcome back, " + user.getName() : "Welcome to Smart QueueLess Canteen")
                .userHabitSummary(habitSummary)
                .recommendedItems(recommendedItems)
                .suggestedCombos(combos)
                .build();
    }
}
