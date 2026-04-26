import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const commonStyles = `
  font-family: 'Inter', Helvetica, Arial, sans-serif;
  background-color: #0a0a0a;
  color: #ffffff;
  padding: 40px;
  max-width: 600px;
  margin: 0 auto;
  border: 1px solid #d4af37;
`;

const goldText = "color: #d4af37;";

export const sendOrderEmail = async (orderData, type = "placed") => {
  const subjectMap = {
    placed: `Order Confirmed - #${orderData.id}`,
    cancelled: `Order Cancelled - #${orderData.id}`,
    delivered: `Order Delivered - #${orderData.id}`,
  };

  const statusText = {
    placed: "Your order has been successfully placed.",
    cancelled: "Your order has been cancelled.",
    delivered: "Your order has been delivered successfully.",
  };

  const html = `
    <div style="${commonStyles}">
      <h1 style="${goldText} text-align: center; font-serif;">Kasana Watches</h1>
      <h2 style="text-align: center;">${subjectMap[type]}</h2>
      <p>Dear ${orderData.customerName},</p>
      <p>${statusText[type]}</p>
      
      <div style="border: 1px solid #333; padding: 20px; margin: 20px 0;">
        <h3 style="${goldText}">Order Details</h3>
        <p><strong>Order ID:</strong> ${orderData.id}</p>
        <p><strong>Total Amount:</strong> Rs ${orderData.total.toLocaleString()}</p>
      </div>

      <p>Thank you for choosing Kasana Watches.</p>
      <hr style="border: 0; border-top: 1px solid #333; margin: 20px 0;" />
      <p style="font-size: 12px; color: #666; text-align: center;">
        Kasana Watches - Precision in Every Moment
      </p>
    </div>
  `;

  return transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: orderData.customerEmail,
    subject: subjectMap[type],
    html,
  });
};

export const sendNewsletterEmail = async (email, productName) => {
  const html = `
    <div style="${commonStyles}">
      <h1 style="${goldText} text-align: center; font-serif;">Kasana Watches</h1>
      <h2 style="text-align: center;">New Arrival in Stock!</h2>
      <p>Hello,</p>
      <p>We are excited to announce that a new exquisite timepiece has just arrived at Kasana Watches:</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <h3 style="${goldText}">${productName}</h3>
        <p>Experience the luxury and precision of our latest collection.</p>
        <a href="${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}" 
           style="background-color: #d4af37; color: #000; padding: 12px 25px; text-decoration: none; border-radius: 50px; font-weight: bold; display: inline-block;">
           Explore Now
        </a>
      </div>

      <p>You are receiving this because you are part of our Inner Circle.</p>
      <hr style="border: 0; border-top: 1px solid #333; margin: 20px 0;" />
      <p style="font-size: 12px; color: #666; text-align: center;">
        Kasana Watches - Precision in Every Moment
      </p>
    </div>
  `;

  return transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "New Luxury Watch Available - Kasana Watches",
    html,
  });
};

export default transporter;
