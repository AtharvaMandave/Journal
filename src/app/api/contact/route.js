import { NextResponse } from "next/server";
import validator from "validator";
import nodemailer from "nodemailer";
import { captchaStore } from "../captcha/route";

// Email transporter with debug logging
function createTransporter() {
  console.log("SMTP_USER:", process.env.SMTP_USER ? "✓ Set" : "✗ Missing");
  console.log("SMTP_PASS:", process.env.SMTP_PASS ? "✓ Set" : "✗ Missing");
  console.log("SMTP_HOST:", process.env.SMTP_HOST || "smtp.gmail.com");
  console.log("SMTP_PORT:", process.env.SMTP_PORT || "587");

  const requiredEnvVars = ["SMTP_USER", "SMTP_PASS"];
  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}`
    );
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    debug: true,
    logger: true,
  });
}

function validateContactForm(data) {
  const errors = [];

  if (!data.contactName || data.contactName.trim().length < 2) {
    errors.push("Contact name must be at least 2 characters long");
  }

  if (!data.email || !validator.isEmail(data.email)) {
    errors.push("Valid email address is required");
  }

  if (!data.mobile || !validator.isMobilePhone(data.mobile, "any")) {
    errors.push("Valid mobile number is required");
  }

  if (!data.contactType) {
    errors.push("Contact type is required");
  }

  if (!data.subject || data.subject.trim().length < 5) {
    errors.push("Subject must be at least 5 characters long");
  }

  if (!data.message || data.message.trim().length < 10) {
    errors.push("Message must be at least 10 characters long");
  }

  const validTypes = [
    "author",
    "reviewer",
    "editor",
    "subscription",
    "technical",
    "general",
  ];

  if (data.contactType && !validTypes.includes(data.contactType)) {
    errors.push("Invalid contact type");
  }

  return errors;
}

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      contactName,
      email,
      mobile,
      contactType,
      subject,
      message,
      captcha,
      sessionId,
    } = body;

    // ✅ Validate captcha
    const storedCaptcha = captchaStore.get(sessionId);
    if (!storedCaptcha || storedCaptcha.expires < Date.now()) {
      captchaStore.delete(sessionId);
      return NextResponse.json(
        {
          success: false,
          error: "Captcha expired. Please refresh and try again.",
        },
        { status: 400 }
      );
    }

    if (storedCaptcha.code !== captcha.toUpperCase()) {
      return NextResponse.json(
        { success: false, error: "Invalid captcha. Please try again." },
        { status: 400 }
      );
    }

    captchaStore.delete(sessionId);

    // ✅ Validate form
    const validationErrors = validateContactForm(body);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: validationErrors,
        },
        { status: 400 }
      );
    }

    // ✅ Create transporter
    console.log("Creating transporter...");
    let transporter;
    try {
      transporter = createTransporter();

      console.log("Testing SMTP connection...");
      await transporter.verify();
      console.log("SMTP connection successful!");
    } catch (smtpError) {
      console.error("SMTP Error Details:", {
        message: smtpError.message,
        code: smtpError.code,
        response: smtpError.response,
        responseCode: smtpError.responseCode,
        command: smtpError.command,
      });

      return NextResponse.json(
        {
          success: false,
          error:
            "Email service configuration error. Please check server logs.",
          details: smtpError.message,
        },
        { status: 503 }
      );
    }

    // ✅ Send the actual email
    try {
      const info = await transporter.sendMail({
        from: `"${contactName}" <${process.env.SMTP_USER}>`, // must match Gmail account
        to: process.env.SMTP_USER, // your own email (recipient)
        replyTo: email, // allows replying to sender
        subject: `[Contact Form] ${subject}`,
        text: `
Name: ${contactName}
Email: ${email}
Mobile: ${mobile}
Type: ${contactType}

Message:
${message}
        `,
      });

      console.log("Message sent:", info.messageId);

      return NextResponse.json({
        success: true,
        message: "Email sent successfully!",
        messageId: info.messageId,
      });
    } catch (sendError) {
      console.error("Error sending mail:", sendError);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to send email",
          details: sendError.message,
        },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error. Check server logs for details.",
      },
      { status: 500 }
    );
  }
}
