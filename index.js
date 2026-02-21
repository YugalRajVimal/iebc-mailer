import "dotenv/config";
import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import bodyParser from "body-parser";

const server = express();
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));

server.use(
  cors({
    origin: [
      "https://indoeuropeancouncil.eu",
      "http://localhost:5173",
      "http://localhost:3000"
    ],
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Content-Type, Authorization",
    credentials: true,
  })
);

// Change this if you're using a different email provider for IEBC
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.Mailer_User,
    pass: process.env.Mailer_Pass,
  },
});

// POST endpoint for IEBC contact form
server.post("/send-mail", (req, res) => {
  // Expecting: firstName, lastName, email, company, message
  const { firstName, lastName, email, company, message } = req.body;
  const fullName = `${firstName} ${lastName}`.trim();

  // -- ADMIN EMAIL (to iebc@indoeuropeancouncil.eu) --
  const htmlContent = `
    <div style="font-family: 'Segoe UI',Arial,sans-serif; background:linear-gradient(135deg,#f2f6fb 0%,#dde5f2 100%); min-height:100vh; padding: 42px;">
      <div style="max-width:650px; margin:auto; background:#fff; border-radius:18px; box-shadow:0 8px 32px rgba(51,82,153,0.14); overflow:hidden; border: 1.5px solid #e3eaf2;">
        <div style="background: linear-gradient(90deg,#132e66 60%,#025bb2 100%); color:#fff; text-align:center; padding:30px 0 18px 0;">
          <div style="font-size:2.85rem; margin-bottom:8px;">📥</div>
          <h2 style="margin:0; font-size:2rem; font-weight:700; letter-spacing:0.02em; line-height:1.2;">
            New Business Contact – IEBC
          </h2>
        </div>
        <div style="padding:38px 32px 28px 32px;">
          <p style="font-size:1.135rem; margin-bottom:1.7em; color:#26376c; letter-spacing:0.01em;">
            <span style="font-weight:600;">You’ve received a new message via the Indo European Business Council website contact form: </span>
          </p>
          <table style="width:100%; border-collapse:separate; border-spacing:0 8px;">
            <tr>
              <td style="padding:10px 12px; background:#f7faff; border-radius:6px 0 0 6px; color:#1868b7; font-weight:bold;">First Name:</td>
              <td style="padding:10px 12px; background:#f7faff; border-radius:0 6px 6px 0;">${firstName || "—"}</td>
            </tr>
            <tr>
              <td style="padding:10px 12px; background:#f7faff; border-radius:6px 0 0 6px; color:#1868b7; font-weight:bold;">Last Name:</td>
              <td style="padding:10px 12px; background:#f7faff; border-radius:0 6px 6px 0;">${lastName || "—"}</td>
            </tr>
            <tr>
              <td style="padding:10px 12px; background:#f7faff; border-radius:6px 0 0 6px; color:#1868b7; font-weight:bold;">Email Address:</td>
              <td style="padding:10px 12px; background:#f7faff; border-radius:0 6px 6px 0;">${email || "—"}</td>
            </tr>
            <tr>
              <td style="padding:10px 12px; background:#f7faff; border-radius:6px 0 0 6px; color:#1868b7; font-weight:bold;">Company / Organization:</td>
              <td style="padding:10px 12px; background:#f7faff; border-radius:0 6px 6px 0;">${company || "—"}</td>
            </tr>
            <tr>
              <td style="padding:10px 12px; background:#f7faff; border-radius:6px 0 0 6px; color:#1868b7; font-weight:bold; vertical-align:top;">Message:</td>
              <td style="padding:10px 12px; background:#f7faff; border-radius:0 6px 6px 0;">
                <div style="white-space:pre-line; color:#234;">${message || "—"}</div>
              </td>
            </tr>
          </table>
          <div style="margin-top:36px; padding:18px 20px; background:linear-gradient(101deg,#f3f8fd 70%,#e5ebfb 100%); border-radius:8px; color:#4469a3; font-size:0.99rem; text-align:center; letter-spacing:0.01em;">
            If you have questions, follow up to the sender’s email above.<br/>
            <span style="color:#0e347c; font-weight:500;">IEBC Secretariat</span>
          </div>
        </div>
        <div style="background:#e6eef8; padding:17px 10px; text-align:center; font-size:0.97rem; color:#254077; border-top: 1px solid #e3eaf2;">
          <span style="font-size:0.92em;">Sent securely via <strong>IEBC</strong> Website Contact</span>
        </div>
      </div>
    </div>
  `;

  // -- CONFIRMATION TO USER --
  const confirmationHtml = `
    <div style="font-family:'Segoe UI',Arial,sans-serif; background: linear-gradient(133deg,#f8fcff 20%,#f0f5fa 100%); min-height:100vh; padding: 32px;">
      <div style="max-width:620px; margin:auto;background:#fff;border-radius:18px; box-shadow:0 8px 28px rgba(42,71,125,0.13); overflow:hidden; border:1.5px solid #e2eaf5;">
        <div style="background:linear-gradient(90deg,#035bb0 65%,#233f8a 100%); color:#fff; padding:26px 0 16px 0; text-align:center;">
          <div style="font-size:2.25rem; margin-bottom:8px;">✅</div>
          <h2 style="margin:0;font-size:1.85rem;letter-spacing:0.02em;">Thank You for Contacting IEBC</h2>
        </div>
        <div style="padding:32px 32px 28px 32px; color:#28376e;">
          <p style="font-size:1.08rem; margin-bottom:18px;">
            Dear <span style="color:#0655a6;font-weight:600;">${firstName || "Friend"}</span>,
          </p>
          <p style="margin-bottom:22px;">
            We sincerely appreciate your interest in the Indo European Business Council.<br/>
            Your message has been received, and our team will respond soon.
          </p>
          <div style="margin: 25px 0 18px 0; background:linear-gradient(93deg,#f3f8ff 65%,#e6f1fa 100%); padding:17px 20px; border-radius:7px;">
            <span style="font-weight:500; color:#013473;">Your Message:</span>
            <blockquote style="margin: 11px 0 0 0; border-left: 3px solid #035bb0; padding-left: 14px; color: #335; background: #fafdfe; border-radius:3px;">
              ${message || ""}
            </blockquote>
          </div>
          <p style="margin-top:32px;">Best regards,<br><span style="font-weight:600; color:#01396c;">IEBC Secretariat</span></p>
        </div>
        <div style="background:#e7eef8; padding:15px; text-align:center; font-size:0.98rem; color:#204090; border-top:1px solid #e5edf9;">
          Indo European Business Council &middot;
          <a href="https://indoeuropeancouncil.eu" style="color:#1056a5; font-weight:500; text-decoration:none;">indoeuropeancouncil.eu</a>
        </div>
      </div>
    </div>
  `;

  // Email data for admin/secretary (to IEBC office)
  const mailOptions = {
    from: process.env.Mailer_User, // must be the authenticating sender
    to: process.env.Send_Mailer_User,
    subject: `IEBC Website Inquiry from ${fullName || email || "Website User"}`,
    html: htmlContent,
  };

  // Confirmation mail to the user/public sender
  const mailOptions2 = {
    from: process.env.Mailer_User, // still send from office address
    to: email,
    subject: `Thank You for Contacting IEBC`,
    html: confirmationHtml,
  };

  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      console.error(error);
      return res.status(500).send("Error sending your message to IEBC.");
    }
    // Only send confirmation if sender email provided
    if (email && email.includes("@")) {
      transporter.sendMail(mailOptions2, (error) => {
        if (error) {
          console.error(error);
          return res.status(500).send("Error sending confirmation email to you, but your message reached us.");
        }
        res
          .status(200)
          .send("Your message was sent to IEBC and a confirmation was emailed to you.");
      });
    } else {
      res.status(200).send("Your message was sent to IEBC.");
    }
  });
});

server.listen(8080, () => {
  console.log("IEBC server is running on port 8080");
});
