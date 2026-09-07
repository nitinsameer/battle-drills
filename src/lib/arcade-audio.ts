let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let enabled = true;

let drillOsc: OscillatorNode | null = null;
let drillGain: GainNode | null = null;
let drillFilter: BiquadFilterNode | null = null;

function ensure(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
    master = ctx.createGain();
    master.gain.value = enabled ? 0.5 : 0;
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

export function setSoundEnabled(value: boolean) {
  enabled = value;
  if (master && ctx) master.gain.setTargetAtTime(value ? 0.5 : 0, ctx.currentTime, 0.03);
}

export function unlockAudio() {
  ensure();
}

type ToneOptions = { freq: number; to?: number; dur?: number; type?: OscillatorType; gain?: number; delay?: number };

function tone({ freq, to, dur = 0.14, type = "square", gain = 0.25, delay = 0 }: ToneOptions) {
  const audio = ensure();
  if (!audio || !master) return;
  const t0 = audio.currentTime + delay;
  const osc = audio.createOscillator();
  const env = audio.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (to) osc.frequency.exponentialRampToValueAtTime(Math.max(30, to), t0 + dur);
  env.gain.setValueAtTime(0.0001, t0);
  env.gain.exponentialRampToValueAtTime(gain, t0 + 0.012);
  env.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(env);
  env.connect(master);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

function noise(dur = 0.3, gain = 0.3, freq = 900) {
  const audio = ensure();
  if (!audio || !master) return;
  const frames = Math.floor(audio.sampleRate * dur);
  const buffer = audio.createBuffer(1, frames, audio.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < frames; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / frames);
  const src = audio.createBufferSource();
  src.buffer = buffer;
  const filter = audio.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = freq;
  const env = audio.createGain();
  env.gain.value = gain;
  src.connect(filter);
  filter.connect(env);
  env.connect(master);
  src.start();
}

export const sfx = {
  click: () => tone({ freq: 420, to: 620, dur: 0.08, gain: 0.18 }),
  back: () => tone({ freq: 380, to: 200, dur: 0.1, gain: 0.16 }),
  select: () => { tone({ freq: 540, dur: 0.08, gain: 0.2 }); tone({ freq: 810, dur: 0.1, gain: 0.18, delay: 0.07 }); },
  countdown: () => tone({ freq: 640, dur: 0.16, type: "sawtooth", gain: 0.22 }),
  go: () => { tone({ freq: 520, to: 1040, dur: 0.35, type: "sawtooth", gain: 0.3 }); },
  star: () => { tone({ freq: 880, dur: 0.07, type: "triangle", gain: 0.22 }); tone({ freq: 1320, dur: 0.1, type: "triangle", gain: 0.2, delay: 0.06 }); },
  gem: () => { [660, 990, 1480].forEach((f, i) => tone({ freq: f, dur: 0.12, type: "triangle", gain: 0.22, delay: i * 0.06 })); },
  alarm: () => { tone({ freq: 300, to: 160, dur: 0.3, type: "sawtooth", gain: 0.25 }); noise(0.4, 0.18, 400); },
  win: () => { [523, 659, 784, 1046].forEach((f, i) => tone({ freq: f, dur: 0.22, type: "square", gain: 0.24, delay: i * 0.12 })); },
  pause: () => tone({ freq: 500, to: 240, dur: 0.18, gain: 0.2 }),
};

export function startDrillLoop() {
  const audio = ensure();
  if (!audio || !master || drillOsc) return;
  drillOsc = audio.createOscillator();
  drillOsc.type = "sawtooth";
  drillOsc.frequency.value = 70;
  drillFilter = audio.createBiquadFilter();
  drillFilter.type = "lowpass";
  drillFilter.frequency.value = 500;
  drillGain = audio.createGain();
  drillGain.gain.value = 0.0001;
  drillOsc.connect(drillFilter);
  drillFilter.connect(drillGain);
  drillGain.connect(master);
  drillOsc.start();
}

export function setDrillIntensity(intensity: number) {
  if (!ctx || !drillGain || !drillOsc || !drillFilter) return;
  const t = ctx.currentTime;
  drillGain.gain.setTargetAtTime(0.02 + intensity * 0.11, t, 0.08);
  drillOsc.frequency.setTargetAtTime(62 + intensity * 78, t, 0.1);
  drillFilter.frequency.setTargetAtTime(360 + intensity * 900, t, 0.1);
}

export function stopDrillLoop() {
  if (drillOsc) { try { drillOsc.stop(); } catch { /* already stopped */ } drillOsc.disconnect(); }
  drillGain?.disconnect();
  drillFilter?.disconnect();
  drillOsc = null;
  drillGain = null;
  drillFilter = null;
}
