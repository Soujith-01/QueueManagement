package com.smartcanteen.repository;

import com.smartcanteen.model.CanteenSettings;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CanteenSettingsRepository extends MongoRepository<CanteenSettings, String> {
}
