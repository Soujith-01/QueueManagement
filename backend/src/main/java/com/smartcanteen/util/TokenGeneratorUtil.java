package com.smartcanteen.util;

import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Component
public class TokenGeneratorUtil {

    private final ConcurrentHashMap<String, AtomicInteger> dailyCounters = new ConcurrentHashMap<>();
    private final char[] prefixes = {'A', 'B', 'C', 'D', 'E', 'F'};

    public String generateNextDailyToken(String dateStr) {
        if (dateStr == null || dateStr.isBlank()) {
            dateStr = LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE);
        }

        dailyCounters.putIfAbsent(dateStr, new AtomicInteger(0));
        int count = dailyCounters.get(dateStr).incrementAndGet();

        // 1 - 999 -> A001..A999, 1000 - 1999 -> B001..B999
        int prefixIndex = (count - 1) / 999;
        char prefix = prefixes[Math.min(prefixIndex, prefixes.length - 1)];
        int sequenceNum = ((count - 1) % 999) + 1;

        return String.format("%c%03d", prefix, sequenceNum);
    }

    public String generateOrderNumber() {
        String today = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        long randomSuffix = (long) (Math.random() * 9000L) + 1000L;
        return "ORD-" + today + "-" + randomSuffix;
    }
}
