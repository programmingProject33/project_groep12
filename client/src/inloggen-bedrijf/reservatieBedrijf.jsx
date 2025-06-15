import React from "react";
import BedrijfNavbar from "./BedrijfNavbar";
import BedrijfFooter from "./bedrijfFooter";
import "./reservatieBedrijf.css";

export default function Reservaties() {
  return (
    <div>
      <BedrijfNavbar />
      <main className="reservatiebedrijf-main">
        <h1>Reservaties</h1>
        <p>Hier komt het overzicht van alle speeddate-reservaties voor jouw bedrijf.</p>
      </main>
      <BedrijfFooter />
    </div>
  );
} 