
import { Link } from "react-router-dom";

function Services() {
  const services = [
    {
      number: "01",
      title: "Website Development",
      subtitle: "Powerful websites for growing businesses",
      description:
        "We create modern, responsive and user-friendly websites that help businesses build a strong online presence and reach more customers.",
      features: [
        "Business Website Development",
        "E-commerce Website Development",
        "Responsive Mobile-Friendly Design",
        "Custom Website Development",
        "Website Maintenance & Support",
      ],
    },
    {
      number: "02",
      title: "Web Design",
      subtitle: "Beautiful designs that make an impression",
      description:
        "We design clean, attractive and professional website experiences that represent your brand and make it easy for customers to connect with you.",
      features: [
        "Modern UI/UX Design",
        "Professional Landing Pages",
        "Mobile-Friendly Layouts",
        "Creative Website Design",
        "User-Friendly Navigation",
      ],
    },
    {
      number: "03",
      title: "Business Solutions",
      subtitle: "Digital solutions to move your business forward",
      description:
        "We help businesses improve their digital presence with practical technology solutions designed around their goals and requirements.",
      features: [
        "Business Website Solutions",
        "Online Business Presence",
        "Digital Consultation",
        "Custom Business Requirements",
        "Technical Support",
      ],
    },
  ];

  return (
    <div className="services-page">
      <style>{`
        .services-page {
          min-height: 100vh;
          background: #080808;
          color: #f8f5ed;
          font-family: Arial, sans-serif;
        }

        .services-page * {
          box-sizing: border-box;
        }

        .services-page a {
          text-decoration: none;
        }

        .services-topbar {
          padding: 20px 7%;
          border-bottom: 1px solid rgba(212, 175, 55, 0.25);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
        }

        .services-logo {
          color: #d4af37;
          font-size: 23px;
          font-weight: 800;
          letter-spacing: 2px;
        }

        .services-back {
          color: #d4af37;
          border: 1px solid #d4af37;
          padding: 10px 18px;
          border-radius: 6px;
          font-size: 14px;
          transition: 0.3s;
        }

        .services-back:hover {
          background: #d4af37;
          color: #080808;
        }

        .services-hero {
          text-align: center;
          padding: 85px 20px 65px;
          background:
            radial-gradient(
              ellipse at top,
              rgba(212, 175, 55, 0.13),
              transparent 65%
            );
        }

        .services-label {
          color: #d4af37;
          font-size: 13px;
          letter-spacing: 4px;
          font-weight: bold;
          text-transform: uppercase;
        }

        .services-hero h1 {
          font-size: clamp(36px, 6vw, 65px);
          margin: 22px 0;
          line-height: 1.15;
        }

        .services-hero h1 span {
          color: #d4af37;
        }

        .services-hero p {
          max-width: 650px;
          margin: auto;
          color: #aaa;
          font-size: 16px;
          line-height: 1.8;
        }

        .services-list {
          max-width: 1150px;
          margin: auto;
          padding: 25px 25px 90px;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 25px;
        }

        .service-detail-card {
          background: #111;
          border: 1px solid #29251a;
          border-radius: 14px;
          padding: 32px;
          transition: transform 0.3s, border-color 0.3s;
        }

        .service-detail-card:hover {
          border-color: #d4af37;
          transform: translateY(-5px);
        }

        .service-number {
          color: #d4af37;
          font-size: 14px;
          font-weight: bold;
          letter-spacing: 2px;
        }

        .service-detail-card h2 {
          font-size: 25px;
          margin: 20px 0 10px;
        }

        .service-subtitle {
          color: #d4af37;
          font-size: 14px;
          margin-bottom: 18px;
          line-height: 1.6;
        }

        .service-description {
          color: #aaa;
          line-height: 1.8;
          font-size: 14px;
          margin-bottom: 25px;
        }

        .service-detail-card h3 {
          font-size: 15px;
          margin-bottom: 15px;
        }

        .service-features {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          gap: 13px;
        }

        .service-features li {
          color: #ccc;
          font-size: 14px;
          display: flex;
          align-items: flex-start;
          gap: 10px;
          line-height: 1.5;
        }

        .service-features li span {
          color: #d4af37;
          font-weight: bold;
        }

        .services-contact {
          max-width: 1000px;
          margin: 0 auto 80px;
          padding: 55px 25px;
          text-align: center;
          background: #111;
          border: 1px solid #d4af37;
          border-radius: 14px;
        }

        .services-contact h2 {
          font-size: clamp(25px, 4vw, 38px);
          margin-bottom: 15px;
        }

        .services-contact h2 span {
          color: #d4af37;
        }

        .services-contact p {
          color: #aaa;
          line-height: 1.7;
          margin-bottom: 25px;
        }

        .services-contact a {
          display: inline-block;
          background: #d4af37;
          color: #080808;
          padding: 14px 25px;
          border-radius: 6px;
          font-weight: bold;
          transition: 0.3s;
        }

        .services-contact a:hover {
          background: #f0cf62;
          transform: translateY(-2px);
        }

        .services-back:focus-visible,
        .services-contact a:focus-visible {
          outline: 2px solid #fff;
          outline-offset: 4px;
        }

        .services-footer {
          text-align: center;
          padding: 25px 15px;
          border-top: 1px solid #29251a;
          color: #888;
          font-size: 13px;
        }

        .services-footer span {
          color: #d4af37;
        }

        @media (max-width: 900px) {
          .services-list {
            padding-left: 20px;
            padding-right: 20px;
          }

          .services-contact {
            margin-left: 20px;
            margin-right: 20px;
          }
        }

        @media (max-width: 700px) {
          .services-topbar {
            padding: 16px 5%;
          }

          .services-hero {
            padding: 65px 20px 45px;
          }

          .services-list {
            grid-template-columns: 1fr;
            padding: 15px 18px 65px;
          }

          .service-detail-card {
            padding: 25px 22px;
          }

          .services-contact {
            margin: 0 18px 60px;
            padding: 40px 20px;
          }
        }

        @media (max-width: 380px) {
          .services-logo {
            font-size: 16px;
            letter-spacing: 1px;
          }

          .services-back {
            padding: 9px 12px;
            font-size: 12px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .service-detail-card,
          .services-back,
          .services-contact a {
            transition: none;
          }
        }
      `}</style>

      <header className="services-topbar">
        <div className="services-logo">
          SN WEB TECHNOLOGIES
        </div>

        <Link to="/" className="services-back">
          ← Back to Home
        </Link>
      </header>

      <section className="services-hero">
        <div className="services-label">What We Offer</div>

        <h1>
          Our <span>Services</span>
        </h1>

        <p>
          We provide creative and reliable digital solutions to help
          businesses grow, connect with customers and build a strong
          online presence.
        </p>
      </section>

      <section className="services-list">
        {services.map((service) => (
          <div className="service-detail-card" key={service.number}>
            <div className="service-number">
              {service.number}
            </div>

            <h2>{service.title}</h2>

            <div className="service-subtitle">
              {service.subtitle}
            </div>

            <p className="service-description">
              {service.description}
            </p>

            <h3>What We Provide</h3>

            <ul className="service-features">
              {service.features.map((feature) => (
                <li key={feature}>
                  <span aria-hidden="true">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="services-contact">
        <h2>
          Have a Project in <span>Mind?</span>
        </h2>

        <p>
          Let's discuss your requirements and find the right digital
          solution for your business.
        </p>

        <Link to="/contact">
          Contact Us
        </Link>
      </section>

      <footer className="services-footer">
        © {new Date().getFullYear()}{" "}
        <span>SN WEB TECHNOLOGIES</span>. All Rights Reserved.
      </footer>
    </div>
  );
}

export default Services;
