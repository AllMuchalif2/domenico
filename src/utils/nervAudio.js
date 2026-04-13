let ctx = null;

export function initAudio() {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return ctx;
}

export function getAudioContext() {
  return ctx;
}

export function playBootBeep() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type = 'sine';
  osc.frequency.setValueAtTime(440, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);

  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.4);
}

export function playWarningBeep() {
  const ctx = getAudioContext();
  if (!ctx) return;

  [0, 0.25].forEach(delay => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'square';
    osc.frequency.setValueAtTime(880, ctx.currentTime + delay);

    gain.gain.setValueAtTime(0.15, ctx.currentTime + delay);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.2);

    osc.start(ctx.currentTime + delay);
    osc.stop(ctx.currentTime + delay + 0.2);
  });
}

let sirenOsc = null;
let sirenGain = null;
let sirenInterval = null;
let sirenCount = 0;

export function playSiren() {
  const ctx = getAudioContext();
  if (!ctx || sirenOsc) return;

  sirenCount = 0;
  sirenGain = ctx.createGain();
  sirenGain.gain.setValueAtTime(0.25, ctx.currentTime);
  sirenGain.connect(ctx.destination);

  function oneCycle() {
    if (sirenCount >= 3) {
      stopSiren();
      return;
    }
    sirenOsc = ctx.createOscillator();
    sirenOsc.connect(sirenGain);
    sirenOsc.type = 'sawtooth';

    const t = ctx.currentTime;
    sirenOsc.frequency.setValueAtTime(440, t);
    sirenOsc.frequency.linearRampToValueAtTime(880, t + 0.6);
    sirenOsc.frequency.linearRampToValueAtTime(440, t + 1.2);

    sirenOsc.start(t);
    sirenOsc.stop(t + 1.2);
    sirenOsc.onended = () => {
      sirenOsc = null;
      sirenCount++;
      setTimeout(oneCycle, 200);
    };
  }

  oneCycle();
}

export function stopSiren() {
  if (sirenOsc) {
    try { sirenOsc.stop(); } catch(e) {}
    sirenOsc = null;
  }
  if (sirenGain) {
    try { sirenGain.disconnect(); } catch(e) {}
    sirenGain = null;
  }
  sirenCount = 0;
}

export function playDismissBeep() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type = 'sine';
  osc.frequency.setValueAtTime(660, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.4);

  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.4);
}
