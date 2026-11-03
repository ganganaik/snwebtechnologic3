function App() {
  return (
    <div className="app">

      <nav className="navbar">
        <h2>SN WEB TECHNOLOGIES</h2>

        <div>
          <a href="#">Home</a>
          <a href="#">Services</a>
          <a href="#">About</a>
          <a href="#">Contact</a>
        </div>
      </nav>


      <section className="hero">

        <h1>
          Your Vision,
          <br />
          Our Creation
        </h1>

        <p>
          Premium Website Development Company
        </p>

        <p>
          Founder: <b>Ganga Naik</b>
        </p>

        <p>
          📍 Mayurbhanj, Odisha, India 🇮🇳
        </p>

        <button>
          Get Started
        </button>

      </section>


      <section className="services">

        <h2>Our Services</h2>

        <div className="cards">

          <div>
            <h3>Website Development</h3>
            <p>Modern & Professional Websites</p>
          </div>

          <div>
            <h3>Web Design</h3>
            <p>Premium UI/UX Designs</p>
          </div>

          <div>
            <h3>Business Solutions</h3>
            <p>Grow your business online</p>
          </div>

        </div>

      </section>

      <section className="order">
  <h2>Start Your Project</h2>

  <p>Fill the details and we will contact you.</p>

  <input type="text" placeholder="Your Name" />

  <input type="tel" placeholder="Mobile Number" />

  <input type="email" placeholder="Email Address" />

  <select>
    <option>Choose Service</option>
    <option>Website Development</option>
    <option>Web Design</option>
    <option>Business Solution</option>
  </select>

  <textarea placeholder="Tell us about your project"></textarea>

  <button>
    Submit Order
  </button>


  <div className="payment">

    <h2>Payment</h2>

    <p>
      UPI ID: <b>7846944419@ybl</b>
    </p>

    <p>
      Scan QR Code to Pay
    </p>

    <div className="qr">
      QR CODE WILL BE ADDED SOON
    </div>

  </div>

</section>

      <footer>
        Made with ❤️ by Ganga Naik
        <br />
        Mayurbhanj, Odisha, India
      </footer>

    </div>
  );
}

export default App;
