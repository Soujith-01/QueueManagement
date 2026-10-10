package com.smartcanteen.util;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.ByteArrayOutputStream;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

public class QrCodeUtil {

    private static final Logger log = LoggerFactory.getLogger(QrCodeUtil.class);

    public static String generateUniqueQrIdentifier() {
        return "SQC-" + UUID.randomUUID().toString().replace("-", "").substring(0, 16).toUpperCase();
    }

    public static String generateQrBase64Image(String content, int width, int height) {
        try {
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            Map<EncodeHintType, Object> hints = new HashMap<>();
            hints.put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.H);
            hints.put(EncodeHintType.MARGIN, 1);
            hints.put(EncodeHintType.CHARACTER_SET, "UTF-8");

            BitMatrix bitMatrix = qrCodeWriter.encode(content, BarcodeFormat.QR_CODE, width, height, hints);
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream);
            byte[] qrBytes = outputStream.toByteArray();

            return "data:image/png;base64," + Base64.getEncoder().encodeToString(qrBytes);
        } catch (Exception e) {
            log.error("Failed to generate QR code image: {}", e.getMessage());
            return "";
        }
    }

    public static String decodeQrBase64(String base64Data) {
        try {
            if (base64Data == null || base64Data.isBlank()) return null;
            if (base64Data.contains(",")) {
                base64Data = base64Data.split(",")[1];
            }
            byte[] bytes = Base64.getDecoder().decode(base64Data.trim());
            java.io.ByteArrayInputStream bis = new java.io.ByteArrayInputStream(bytes);
            java.awt.image.BufferedImage bufferedImage = javax.imageio.ImageIO.read(bis);
            if (bufferedImage == null) return null;
            com.google.zxing.LuminanceSource source = new com.google.zxing.client.j2se.BufferedImageLuminanceSource(bufferedImage);
            com.google.zxing.BinaryBitmap bitmap = new com.google.zxing.BinaryBitmap(new com.google.zxing.common.HybridBinarizer(source));
            com.google.zxing.Result result = new com.google.zxing.MultiFormatReader().decode(bitmap);
            return result.getText();
        } catch (Exception e) {
            log.warn("Failed to decode QR code: {}", e.getMessage());
            return null;
        }
    }
}
