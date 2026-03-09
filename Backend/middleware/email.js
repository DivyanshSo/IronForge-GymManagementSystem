const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ── Send welcome / registration confirmation email ──
exports.sendWelcomeEmail = async (member) => {
  const planPrices = { Starter: '₹999', Elite: '₹1,999', Pro: '₹3,499' };

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background: #0a0a0a; color: #f5f0e8; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
        .header { background: #111; border-bottom: 3px solid #ff5c00; padding: 30px; text-align: center; }
        .logo { font-size: 2.5rem; font-weight: 900; letter-spacing: 4px; color: #ff5c00; }
        .logo span { color: #f5f0e8; }
        .content { background: #181818; padding: 40px; margin-top: 2px; }
        .greeting { font-size: 1.4rem; font-weight: bold; margin-bottom: 16px; }
        .highlight { color: #ff5c00; font-weight: bold; }
        .plan-box { background: #111; border: 1px solid #ff5c00; padding: 20px; margin: 24px 0; border-radius: 4px; }
        .plan-box h3 { color: #ff5c00; margin: 0 0 8px; font-size: 1.1rem; letter-spacing: 2px; text-transform: uppercase; }
        .plan-box p { margin: 4px 0; color: #aaa; font-size: 0.9rem; }
        .plan-box p span { color: #f5f0e8; }
        .member-id { font-size: 1.5rem; font-weight: bold; color: #ff5c00; letter-spacing: 3px; text-align: center; padding: 16px; background: #111; margin: 20px 0; }
        .footer { background: #111; padding: 20px; text-align: center; color: #555; font-size: 0.8rem; }
        .btn { display: inline-block; background: #ff5c00; color: #000; padding: 14px 32px; font-weight: bold; text-decoration: none; letter-spacing: 2px; margin-top: 20px; text-transform: uppercase; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">IRON<span>FORGE</span></div>
          <p style="color:#888; margin:8px 0 0; font-size:0.85rem; letter-spacing:3px;">YOUR MEMBERSHIP IS CONFIRMED</p>
        </div>
        <div class="content">
          <p class="greeting">Welcome, <span class="highlight">${member.firstName} ${member.lastName}!</span> 🔥</p>
          <p style="color:#aaa; line-height:1.7;">You've officially joined the IronForge family. Your application has been received and our team will activate your membership within 24 hours.</p>

          <div class="plan-box">
            <h3>Your Membership Details</h3>
            <p>Member ID: <span>${member.memberId}</span></p>
            <p>Plan: <span>${member.membershipPlan} — ${planPrices[member.membershipPlan]}/month</span></p>
            <p>Goal: <span>${member.fitnessGoal}</span></p>
            <p>Level: <span>${member.experienceLevel}</span></p>
            <p>Status: <span style="color:#ff5c00;">Pending Activation</span></p>
          </div>

          <p style="color:#aaa;">Save your Member ID:</p>
          <div class="member-id">${member.memberId}</div>

          <p style="color:#aaa; line-height:1.7;">What happens next:</p>
          <ul style="color:#aaa; line-height:2;">
            <li>Our team will call you within 24 hours</li>
            <li>Free orientation session will be scheduled</li>
            <li>You'll receive your access card at the gym</li>
            <li>Complimentary PT session included</li>
          </ul>
        </div>
        <div class="footer">
          © 2025 IronForge Gym. Forge Your Legacy.<br>
          If you didn't register, please ignore this email.
        </div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: member.email,
    subject: `🔥 Welcome to IronForge, ${member.firstName}! Your Membership is Confirmed`,
    html,
  });
};

// ── Send admin notification of new registration ──
exports.sendAdminNotification = async (member) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: process.env.ADMIN_EMAIL,
    subject: `New Member Registration: ${member.firstName} ${member.lastName} — ${member.membershipPlan}`,
    html: `
      <h2>New Member Registration</h2>
      <p><strong>Name:</strong> ${member.firstName} ${member.lastName}</p>
      <p><strong>Email:</strong> ${member.email}</p>
      <p><strong>Phone:</strong> ${member.phone}</p>
      <p><strong>Plan:</strong> ${member.membershipPlan}</p>
      <p><strong>Goal:</strong> ${member.fitnessGoal}</p>
      <p><strong>Member ID:</strong> ${member.memberId}</p>
      <p><strong>Registered at:</strong> ${new Date().toLocaleString()}</p>
    `,
  });
};
