const nodemailer = require('nodemailer');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { to, subject, html, pdfBase64, fileName } = req.body;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Fenix BPO" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
      attachments: pdfBase64 ? [{
        filename: fileName || 'proposta-fenixbpo.pdf',
        content: pdfBase64,
        encoding: 'base64',
      }] : [],
    });

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
