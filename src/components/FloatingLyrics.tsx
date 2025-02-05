'use client';

import { useEffect, useState } from 'react';

const lyrics = [
  "ecstacy",
  "Song by SUICIDAL-IDOL ‧ 2022",
  "I just wanna be your sweetheart",
  "Fucking come here, give me your heart",
  "Just you and me to infinity",
  "I can't fucking breathe, too much ecstasy",
  "Kiss me on the lips, choke me on the floor",
  "Drag me around, push me right against your door",
  "I'm your little doll, come and play with me",
  "Dyeing all my hair, we could be in the scene",
  "Lights out, you don't tap out",
  "You're so crazy, manipulate me",
  "Fucking chase me, fucking break me",
  "You're my everything, please just rape me",
  "I just wanna be your sweetheart",
  "Fucking come here, give me your heart",
  "Just you and me to infinity",
  "I can't fucking breathe, too much ecstasy",
  "Piercing on your lip, it's perfect",
  "Never seen another girl this perfect",
  "Sticking out your tongue for the picture"
];

const FloatingLyrics = ({ isVisible }: { isVisible: boolean }) => {
  const [currentLine, setCurrentLine] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setCurrentLine(prev => (prev + 1) % lyrics.length);
    }, 5000); // 5 seconds interval

    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100%',
        textAlign: 'center',
        zIndex: 10,
        pointerEvents: 'none',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.4s ease-in-out',
      }}
    >
      <p
        style={{
          fontFamily: 'BenguiatBold',
          fontSize: '48px',
          background: 'linear-gradient(180deg, #ff0000 0%, #300000 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          margin: 0,
          padding: '0 20px',
          animation: 'fadeInOut 5s ease-in-out infinite',
        }}
      >
        {lyrics[currentLine]}
      </p>
    </div>
  );
};

export default FloatingLyrics; 