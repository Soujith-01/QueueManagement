package com.smartcanteen.util;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class QrCodeUtilTest {

    @Test
    @DisplayName("Should generate unique QR identifier starting with QR-")
    void testGenerateUniqueQrIdentifier() {
        String id1 = QrCodeUtil.generateUniqueQrIdentifier();
        String id2 = QrCodeUtil.generateUniqueQrIdentifier();

        assertNotNull(id1);
        assertNotNull(id2);
        assertTrue(id1.startsWith("SQC-"));
        assertNotEquals(id1, id2);
    }

    @Test
    @DisplayName("Should generate valid QR base64 image and decode back correctly")
    void testGenerateAndDecodeQrBase64() {
        String testData = "QR-TEST-ORDER-123456";
        String base64Image = QrCodeUtil.generateQrBase64Image(testData, 250, 250);

        assertNotNull(base64Image);
        assertTrue(base64Image.startsWith("data:image/png;base64,"));

        String decoded = QrCodeUtil.decodeQrBase64(base64Image);
        assertEquals(testData, decoded);
    }
}
