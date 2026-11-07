
import { useState } from "react";
import { Link } from "react-router-dom";

function Contact() {
  const businessEmail = "twelvefailuresth@gmail.com";

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const subject = encodeURIComponent(form.subject);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`
    );

    const gmailUrl =
      `https://mail.google.com/mail/?view=cm&fs=1&to=${businessEmail}&su=${subject}&body=${body}`;

    window.open(gmailUrl, "_blank");

    setForm({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div className="contact-page">
      <style>{`
        .contact-page {
          min-height: 100vh;
          background: #080808;
          color: #f8f5ed;
          font-family: Arial, sans-serif;
        }

        .contact-header {
          padding: 22px 7%;
          border-bottom: 1px solid #b68b35;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
        }

        .contact-logo {
          color: #d6ad55;
          font-size: 23px;
          font-weight: bold;
          text-decoration: none;
        }

        .contact-back {
          color: #d6ad55;
          border: 1px solid #d6ad55;
          padding: 10px 18px;
          border-radius: 6px;
          text-decoration: none;
        }

        .contact-hero {
          text-align: center;
          padding: 70px 20px 45px;
          background: radial-gradient(circle, #211a0c, #080808 70%);
        }

        .contact-hero span {
          color: #d6ad55;
          letter-spacing: 4px;
          font-size: 13px;
          font-weight: bold;
        }

        .contact-hero h1 {
          font-size: clamp(36px, 6vw, 58px);
          margin: 18px 0;
        }

        .contact-hero h1 strong {
          color: #d6ad55;
        }

        .contact-hero p {
          color: #c3bdb0;
          line-height: 1.8;
        }

        .contact-content {
          max-width: 1050px;
          margin: auto;
          padding: 35px 20px 70px;
          display: grid;
          grid-template-columns: 0.8fr 1.2fr;
          gap: 30px;
        }

        .contact-info,
        .contact-form {
          background: #111;
          border: 1px solid #3b3020;
          border-radius: 13px;
          padding: 30px;
        }

        .contact-info h2,
        .contact-form h2 {
          color: #d6ad55;
          font-size: 25px;
          margin-bottom: 20px;
        }

        .contact-info p {
          color: #c3bdb0;
          line-height: 1.8;
          margin-bottom: 22px;
        }

        .contact-email {
          display: block;
          color: #d6ad55;
          overflow-wrap: anywhere;
          text-decoration: none;
          margin-top: 8px;
        }

        .contact-note {
          border-top: 1px solid #3b3020;
          padding-top: 20px;
          font-size: 13px;
        }

        .contact-form label {
          display: block;
          color: #d6ad55;
          margin: 15px 0 8px;
          font-size: 14px;
        }

        .contact-form input,
        .contact-form textarea {
          width: 100%;
          padding: 13px;
          border: 1px solid #403521;
          border-radius: 6px;
          background: #080808;
          color: #fff;
          outline: none;
        }

        .contact-form input:focus,
        .contact-form textarea:focus {
          border-color: #d6ad55;
        }

        .contact-form textarea {
          min-height: 140px;
          resize: vertical;
        }

        .contact-submit {
          width: 100%;
          margin-top: 22px;
          padding: 14px;
          background: #d6ad55;
          color: #080808;
          border: none;
          border-radius: 6px;
          font-weight: bold;
          cursor: pointer;
        }

        .contact-submit:hover {
          background: #efc96e;
        }

        .contact-footer {
          border-top: 1px solid #302719;
          text-align: center;
          padding: 25px 15px;
          color: #999;
          font-size: 13px;
        }

        @media (max-width: 760px) {
          .contact-content {
            grid-template-columns: 1fr;
            padding: 25px 17px 50px;
          }

          .contact-hero {
            padding: 55px 17px 35px;
          }

          .contact-info,
          .contact-form {
            padding: 23px;
          }
        }

        @media (max-width: 420px) {
          .contact-header {
            padding: 17px;
          }

          .contact-logo {
            font-size: 17px;
          }

          .contact-back {
            padding: 9px 12px;
            font-size: 13px;
          }
        }
      `}</style>

      <header className="contact-header">
        <Link to="/" className="contact-logo">
          SN WEB TECHNOLOGIES
        </Link>
        <Link to="/" className="contact-back">
          ← Home
        </Link>
      </header>

      <section className="contact-hero">
        <span>GET IN TOUCH</span>
        <h1>Contact <strong>Us</strong></h1>
        <p>
          Have a project or question? Send us an enquiry.
          We would love to hear from you.
        </p>
      </section>

      <main className="contact-content">
        <section className="contact-info">
          <h2>Let's Talk</h2>
          <p>
            Tell us about your project, requirements or ideas.
            Our team will be happy to hear from you.
          </p>

          <p>
            <strong>Email Address</strong>
            <a
              className="contact-email"
              href={`mailto:${businessEmail}`}
            >
              {businessEmail}
            </a>
          </p>

          <p>
            <strong>Location</strong>
            <br />
            Mayurbhanj, Odisha, India
          </p>

          <p className="contact-note">
            Your privacy matters. You can contact us through
            email without sharing your personal phone number.
          </p>
        </section>

        <section className="contact-form">
          <h2>Send an Enquiry</h2>

          <form onSubmit={handleSubmit}>
            <label htmlFor="contact-name">Your Name</label>
            <input
              id="contact-name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />

            <label htmlFor="contact-email">Your Email</label>
            <input
              id="contact-email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />

            <label htmlFor="contact-subject">Subject</label>
            <input
              id="contact-subject"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="Enter subject"
              required
            />

            <label htmlFor="contact-message">Your Message</label>
            <textarea
              id="contact-message"
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Write your message..."
              required
            />

            <button type="submit" className="contact-submit">
              Send Enquiry Through Gmail
            </button>
          </form>
        </section>
      </main>

      <footer className="contact-footer">
        © {new Date().getFullYear()} SN WEB TECHNOLOGIES. All Rights Reserved.
      </footer>
    </div>
  );
}

export default Contact;
