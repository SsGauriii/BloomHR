package com.bloomhr.service;

import com.bloomhr.dto.Dto;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String hrEmail;

    @Value("${app.name:BloomHR}")
    private String appName;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendContactEmail(Dto.ContactRequest req) {
        try {
            MimeMessage msg = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(msg, true, "UTF-8");

            helper.setTo(hrEmail);
            helper.setSubject("[" + appName + "] [" + req.category() + "] " + req.subject());
            helper.setReplyTo(req.senderEmail());

            String html = """
                <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:32px;background:#f9f9f9;border-radius:12px;">
                  <h2 style="color:#3d7a5c;margin-bottom:4px;">📬 New HR Message</h2>
                  <p style="color:#888;font-size:13px;margin-bottom:24px;">via %s</p>
                  <table style="width:100%%;border-collapse:collapse;">
                    <tr><td style="padding:8px 12px;background:#fff;border-radius:6px;font-weight:600;width:120px;color:#555;">From</td>
                        <td style="padding:8px 12px;">%s &lt;%s&gt;</td></tr>
                    <tr><td style="padding:8px 12px;font-weight:600;color:#555;">Category</td>
                        <td style="padding:8px 12px;">%s</td></tr>
                    <tr><td style="padding:8px 12px;font-weight:600;color:#555;">Subject</td>
                        <td style="padding:8px 12px;">%s</td></tr>
                  </table>
                  <div style="margin-top:20px;padding:20px;background:#fff;border-radius:8px;border-left:4px solid #3d7a5c;">
                    <p style="white-space:pre-wrap;color:#333;line-height:1.6;">%s</p>
                  </div>
                  <p style="font-size:11px;color:#aaa;margin-top:20px;">Sent via %s HR Platform</p>
                </div>
                """.formatted(appName, req.senderName(), req.senderEmail(),
                    req.category(), req.subject(), req.message(), appName);

            helper.setText(html, true);
            mailSender.send(msg);

            // Auto-reply to sender
            MimeMessage reply = mailSender.createMimeMessage();
            MimeMessageHelper rh = new MimeMessageHelper(reply, true, "UTF-8");
            rh.setTo(req.senderEmail());
            rh.setSubject("We received your message — " + appName + " HR");
            String replyHtml = """
                <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:32px;">
                  <h2 style="color:#3d7a5c;">Hi %s 👋</h2>
                  <p>Thanks for reaching out to HR. We've received your message about <strong>"%s"</strong>.</p>
                  <p>We'll get back to you within <strong>24 business hours</strong>.</p>
                  <br/>
                  <p>— The %s HR Team</p>
                </div>
                """.formatted(req.senderName(), req.subject(), appName);
            rh.setText(replyHtml, true);
            mailSender.send(reply);

        } catch (Exception e) {
            throw new RuntimeException("Failed to send email: " + e.getMessage());
        }
    }
}
