import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import emailjs from "emailjs-com";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";
import { IoSend } from "react-icons/io5";
import "./Contact.css";

export default function Contact() {
  const navigate = useNavigate();
  const [sent, setSent] = useState(false);
  const formRef = useRef();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const time = new Date().toLocaleString();
    const hiddenTimeInput = document.createElement("input");
    hiddenTimeInput.type = "hidden";
    hiddenTimeInput.name = "time";
    hiddenTimeInput.value = time;
    formRef.current.appendChild(hiddenTimeInput);

    emailjs
      .sendForm("admin_groep12",    // ✅ your service ID
        "admin_12",         // ✅ your template ID
        formRef.current,    // ✅ form reference
        "hR1SrVH5iBfyJtEzM")
      .then(() => {
        setSent(true);
        formRef.current.reset();
        alert("Bericht succesvol verzonden!");
      })
      .catch((error) => {
        console.error("EmailJS fout:", error);
        alert("Er is iets misgegaan. Probeer het later opnieuw.");
      });
  };

  return (
    <div className="contact-page">
      <div className="contact-hero">
        <svg
          className="contact-wave"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#eef4ff"
            fillOpacity="1"
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,138.7C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>

      <main className="contact-main">
        <div className="contact-intro">
          <h1><span role="img" aria-label="mail">&#128236;</span> Heb je een vraag?</h1>
          <p>We staan voor je klaar! Laat gerust een bericht achter – we beantwoorden je mail zo snel mogelijk.</p>
        </div>

        <div className="contact-info">
          <div className="contact-info-item">
            <MdEmail className="contact-icon" />
            <p>support-careerlaunch@ehb.be</p>
          </div>
          <div className="contact-info-item">
            <MdPhone className="contact-icon" />
            <p>+32 494 77 08 550</p>
          </div>
          <div className="contact-info-item">
            <MdLocationOn className="contact-icon" />
            <p>Nijverheidskaai 170, 1070 Anderlecht</p>
          </div>
        </div>

        <form ref={formRef} className="contact-form" onSubmit={handleSubmit}>
          <label>
            Naam
            <input type="text" name="name" required placeholder="Jouw naam" />
          </label>
          <label>
            E-mail
            <input type="email" name="email" required placeholder="jouw@email.be" />
          </label>
          <label>
            Bericht
            <textarea name="message" rows={4} required placeholder="Hoe kunnen we je helpen?" />
          </label>
          <button type="submit">
            <span>{sent ? "Verzonden!" : "Verzenden"}</span>
            <IoSend className="send-icon" />
          </button>
        </form>
      </main>
    </div>
  );
}
