package com.smartcanteen.controller;

import com.smartcanteen.dto.AiMealRecommendationResponse;
import com.smartcanteen.dto.AiPredictionResponse;
import com.smartcanteen.dto.ApiResponse;
import com.smartcanteen.model.User;
import com.smartcanteen.security.UserPrincipal;
import com.smartcanteen.service.AiService;
import com.smartcanteen.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai")
@Tag(name = "AI Insights & Recommendations", description = "Queue crowd prediction and smart meal recommendations")
public class AiController {

    private final AiService aiService;
    private final AuthService authService;

    public AiController(AiService aiService, AuthService authService) {
        this.aiService = aiService;
        this.authService = authService;
    }

    @GetMapping("/queue-prediction")
    @Operation(summary = "Get AI crowd rush forecast and recommended pickup time")
    public ResponseEntity<ApiResponse<AiPredictionResponse>> getQueuePrediction() {
        AiPredictionResponse prediction = aiService.predictQueueDemand();
        return ResponseEntity.ok(ApiResponse.success(prediction, "AI crowd predictions generated"));
    }

    @GetMapping("/recommendations")
    @Operation(summary = "Get personalized meal combos and food recommendations")
    public ResponseEntity<ApiResponse<AiMealRecommendationResponse>> getRecommendations(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        User user = null;
        if (userPrincipal != null) {
            user = authService.getCurrentUser(userPrincipal.getId());
        }
        AiMealRecommendationResponse recommendations = aiService.getPersonalizedRecommendations(user);
        return ResponseEntity.ok(ApiResponse.success(recommendations, "AI meal recommendations retrieved"));
    }
}
