import { useState, useEffect, useRef } from 'react';

const CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%&';

export function useScramble(value, duration = 600) {
  const [display, setDisplay] = useState(value);
  const prevValue = useRef(value);

  useEffect(() => {
    if (value === prevValue.current) return;
    prevValue.current = value;

    const target = String(value);
    const totalFrames = Math.floor(duration / 40);  /* 40ms per frame */
    let frame = 0;

    const interval = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;

      if (progress >= 1) {
        setDisplay(target);
        clearInterval(interval);
        return;
      }

      /* Karakter yang sudah "muncul" = progress * panjang target */
      const revealed = Math.floor(progress * target.length);
      const scrambled = target
        .split('')
        .map((char, i) => {
          if (i < revealed) return char;        /* sudah reveal */
          if (char === ' ' || char === '°') return char;  /* skip spasi/simbol */
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        })
        .join('');

      setDisplay(scrambled);
    }, 40);

    return () => clearInterval(interval);
  }, [value, duration]);

  return display;
}
