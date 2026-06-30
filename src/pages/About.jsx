import React, { useState, useEffect } from "react";
import usePageMusic from '../hooks/usePageMusic';



// Composant effet machine à écrire
function Typewriter({ text, color = "#000000", speed = 50, className = "" }) {
  const [displayed, setDisplayed] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayed((prev) => prev + text[index]);
        setIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [index, text, speed]);

  return (
    <p className={className} style={{ color }}>
      {displayed}
    </p>
  );
}

export default function About() {
  usePageMusic('about.mp3')
  const introText =
    "Hi, I’m a French computer engineering student, with a strong interest in cognitive science. If you want to know more about me go to Game page.";

  
  return (
    <div className="about-page">
      {/* Image papillon à gauche */}
      <img
        src="hoffmannmathias-main\public\images\portrait_butterfly.png"
        alt="Portrait Butterfly"
        className="about-portrait"
      />

      {/* Texte machine à écrire énorme */}
      <Typewriter text={introText} color="#000000" speed={35} className="typewriter-text" />
    </div>
  );
}
