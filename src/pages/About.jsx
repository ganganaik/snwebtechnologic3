
import { Link } from "react-router-dom";

function About() {
  return (
    <div className="about-page">
      <style>{`
        .about-page {
          min-height: 100vh;
          background: #080808;
          color: #f8f5ed;
          font-family: Arial, sans-serif;
        }

        .about-header {
          padding: 22px 7%;
          border-bottom: 1px solid #b68b35;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
        }

        .about-logo {
          color: #d6ad55;
          font-size: 23px;
          font-weight: bold;
          text-decoration: none;
        }

        .about-back {
          color: #d6ad55;
          text-decoration: none;
          border: 1px solid #d6ad55;
          padding: 10px 18px;
          border-radius: 6px;
          transition: 0.3s;
        }

        .about-back:hover {
          background: #d6ad55;
          color: #080808;
        }

        .about-hero {
          text-align: center;
          padding: 85px 20px 65px;
          background: radial-gradient(circle, #211a0c, #080808 70%);
        }

        .about-label {
          color: #d6ad55;
          letter-spacing: 4px;
          font-size: 13px;
          font-weight: bold;
        }

        .about-hero h1 {
          font-size: clamp(36px, 6vw, 62px);
          margin: 20px 0;
        }

        .about-hero h1 span {
          color: #d6ad55;
        }

        .about-hero p {
          max-width: 720px;
          margin: auto;
          color: #c3bdb0;
          line-height: 1.8;
          font-size: 16px;
        }

        .about-content {
          max-width: 1150px;
          margin: auto;
          padding: 65px 22px;
        }

        .about-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 35px;
          align-items: stretch;
        }

        .about-card {
          background: #111;
          border: 1px solid #3b3020;
          border-radius: 14px;
          padding: 32px;
        }

        .about-card h2 {
          color: #d6ad55;
          font-size: 27px;
          margin-bottom: 18px;
        }

        .about-card p {
          color: #c3bdb0;
          line-height: 1.9;
          font-size: 15px;
        }

        .about-highlight {
          min-height: 260px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          background: linear-gradient(145deg, #211a0c, #111);
        }

        .about-highlight strong {
          color: #d6ad55;
          font-size: 70px;
        }

        .about-highlight span {
          font-size: 18px;
          letter-spacing: 3px;
        }

        .about-values {
          margin-top: 55px;
          text-align: center;
        }

        .about-values h2 {
          font-size: 32px;
          margin-bottom: 28px;
        }

        .about-values h2 span {
          color: #d6ad55;
        }

        .values-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .value-card {
          background: #111;
          border: 1px solid #3b3020;
          padding: 28px 20px;
          border-radius: 12px;
          transition: transform 0.3s, border-color 0.3s;
        }

        .value-card:hover {
          transform: translateY(-5px);
          border-color: #d6ad55;
        }

        .value-card h3 {
          color: #d6ad55;
          margin-bottom: 12px;
        }

        .value-card p {
          color: #c3bdb0;
          line-height: 1.7;
          font-size: 14px;
        }

        .about-cta {
          margin-top: 55px;
          padding: 45px 20px;
          text-align: center;
          background: #111;
          border: 1px solid #b68b35;
          border-radius: 14px;
        }

        .about-cta h2 {
          font-size: 30px;
          margin-bottom: 15px;
        }

        .about-cta p {
          color: #c3bdb0;
          margin-bottom: 25px;
          line-height: 1.7;
        }

        .about-button {
          display: inline-block;
          background: #d6ad55;
          color: #080808;
          padding: 13px 25px;
          border-radius: 6px;
          text-decoration: none;
          font-weight: bold;
          transition: 0.3s;
        }

        .about-button:hover {
          background: #efc96e;
          transform: translateY(-2px);
        }

        .about-back:focus-visible,
        .about-logo:focus-visible,
        .about-button:focus-visible {
          outline: 2px solid #fff;
          outline-offset: 4px;
        }

        .about-footer {
          border-top: 1px solid #302719;
          text-align: center;
          padding: 25px 15px;
          color: #999;
          font-size: 13px;
        }

        @media (max-width: 900px) {
          .values-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 760px) {
          .about-grid {
            grid-template-columns: 1fr;
            gap: 22px;
          }

          .values-grid {
            grid-template-columns: 1fr;
          }

          .about-hero {
            padding: 65px 18px 50px;
          }

          .about-card {
            padding: 25px;
          }

          .about-content {
            padding: 45px 17px;
          }

          .about-values {
            margin-top: 40px;
          }
        }

        @media (max-width: 420px) {
          .about-header {
            padding: 17px;
          }

          .about-logo {
            font-size: 17px;
          }

          .about-back {
            padding: 9px 12px;
            font-size: 13px;
          }

          .about-hero h1 {
            font-size: 36px;
          }

          .about-card {
            padding: 22px;
          }

          .about-cta h2 {
            font-size: 25px;
          }
        }
      `}</style>

      <header className="about-header">
        <Link to="/" className="about-logo">
          SN WEB TECHNOLOGIES
        </Link>

        <Link to="/" className="about-back">
          ← Home
        </Link>
      </header>

      <section className="about-hero">
        <div className="about-label">WHO WE ARE</div>

        <h1>
          About <span>Us</span>
        </h1>

        <p>
          We turn ideas into digital experiences. SN WEB TECHNOLOGIES
          is focused on creating modern websites and practical digital
          solutions that help businesses grow online.
        </p>
      </section>

      <main className="about-content">
        <div className="about-grid">
          <div className="about-card">
            <h2>Our Story</h2>

            <p>
              SN WEB TECHNOLOGIES was created with a vision to make
              professional web solutions accessible to businesses
              and individuals. We believe every idea deserves a strong
              digital presence.
            </p>

            <br />

            <p>
              Our focus is on clean design, useful features, smooth
              user experiences and reliable digital solutions.
            </p>
          </div>

          <div className="about-card about-highlight">
            <strong>SN</strong>
            <span>WEB TECHNOLOGIES</span>

            <p style={{ marginTop: "18px" }}>
              Your Vision, Our Creation.
            </p>
          </div>
        </div>

        <div className="about-grid" style={{ marginTop: "25px" }}>
          <div className="about-card">
            <h2>Our Mission</h2>

            <p>
              Our mission is to help businesses build a strong online
              identity through quality website development, creative
              design and useful business solutions.
            </p>
          </div>

          <div className="about-card">
            <h2>Our Founder</h2>

            <p>
              Founded by Ganga Naik, SN WEB TECHNOLOGIES is driven by
              a passion for technology, creativity and building
              meaningful digital experiences.
            </p>

            <br />

            <p>
              <strong>Location:</strong> Mayurbhanj, Odisha, India
            </p>
          </div>
        </div>

        <section className="about-values">
          <h2>
            What We <span>Believe In</span>
          </h2>

          <div className="values-grid">
            <div className="value-card">
              <h3>Quality</h3>
              <p>
                We focus on clean work, attention to detail and
                professional results.
              </p>
            </div>

            <div className="value-card">
              <h3>Creativity</h3>
              <p>
                We bring fresh ideas and thoughtful design to every
                digital project.
              </p>
            </div>

            <div className="value-card">
              <h3>Growth</h3>
              <p>
                We aim to create digital solutions that support
                long-term business growth.
              </p>
            </div>
          </div>
        </section>

        <section className="about-cta">
          <h2>Let's Build Something Great</h2>

          <p>
            Have a project idea? Let's discuss how we can help.
          </p>

          <Link to="/contact" className="about-button">
            Contact Us
          </Link>
        </section>
      </main>

      <footer className="about-footer">
        © {new Date().getFullYear()} SN WEB TECHNOLOGIES. All Rights Reserved.
      </footer>
    </div>
  );
}

export default About;
