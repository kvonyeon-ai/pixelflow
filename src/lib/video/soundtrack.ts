export type Score = { left: Float32Array; right: Float32Array; sampleRate: number };

/** Original, deterministic electronic score. No samples or third-party music. */
export function synthesizeScore(duration = 60, sampleRate = 44100): Score {
  const length = Math.ceil(duration * sampleRate);
  const left = new Float32Array(length);
  const right = new Float32Array(length);
  const TAU = Math.PI * 2;
  let seed = 73191;
  const noise = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) | 0;
    return (seed >>> 0) / 2147483648 - 1;
  };
  const mix = (index: number, value: number, pan: number) => {
    if (index < 0 || index >= length) return;
    left[index] += value * Math.sqrt((1 - pan) / 2);
    right[index] += value * Math.sqrt((1 + pan) / 2);
  };
  const tone = (
    start: number, dur: number, freq: number, amp: number,
    kind: "sine" | "triangle" | "pad" | "bass", pan = 0, echo = false
  ) => {
    const from = Math.floor(start * sampleRate);
    const count = Math.floor(dur * sampleRate);
    const attack = kind === "pad" ? Math.min(0.32, dur / 4) : 0.008;
    const release = kind === "pad" ? Math.min(0.65, dur / 3) : Math.min(0.09, dur / 3);
    let low = 0;
    for (let j = 0; j < count; j++) {
      const t = j / sampleRate;
      const p = TAU * freq * t;
      const env = Math.min(1, t / attack) * Math.min(1, (dur - t) / release);
      let sample = Math.sin(p);
      if (kind === "triangle") sample = Math.asin(sample) * 2 / Math.PI;
      if (kind === "pad") sample = sample * 0.75 + Math.sin(p * 2.003) * 0.16 + Math.sin(p * 0.997) * 0.16;
      if (kind === "bass") {
        const saw = 2 * ((freq * t) % 1) - 1;
        low += 0.13 * (saw - low);
        sample = sample * 0.72 + low * 0.5;
      }
      const value = sample * env * amp;
      mix(from + j, value, pan);
      if (echo) {
        mix(from + j + Math.floor(0.25 * sampleRate), value * 0.2, -pan);
        mix(from + j + Math.floor(0.5 * sampleRate), value * 0.075, pan);
      }
    }
  };
  const kick = (start: number, amp = 0.48) => {
    const from = Math.floor(start * sampleRate);
    let phase = 0;
    for (let j = 0; j < sampleRate * 0.32; j++) {
      const t = j / sampleRate;
      const freq = 43 + 105 * Math.exp(-t * 32);
      phase += TAU * freq / sampleRate;
      const value = Math.sin(phase) * Math.exp(-t * 16) * amp * Math.min(1, t / 0.003);
      mix(from + j, value, 0);
    }
  };
  const percussion = (start: number, dur: number, amp: number, hat: boolean, pan = 0) => {
    const from = Math.floor(start * sampleRate);
    let previous = 0;
    let low = 0;
    for (let j = 0; j < dur * sampleRate; j++) {
      const t = j / sampleRate;
      const n = noise();
      low += (hat ? 0.45 : 0.17) * (n - low);
      const sample = hat ? n - previous : low;
      previous = n;
      mix(from + j, sample * Math.exp(-t * (hat ? 95 : 24)) * amp, pan);
    }
    if (!hat) tone(start, 0.12, 185, amp * 0.45, "triangle");
  };

  const chords = [
    { root: 73.416, notes: [146.832, 174.614, 220] },
    { root: 58.27, notes: [116.541, 146.832, 174.614] },
    { root: 87.307, notes: [174.614, 220, 261.626] },
    { root: 65.406, notes: [130.813, 164.814, 195.998] },
  ];
  const beat = 0.5;
  const bar = 2;
  for (let b = 0; b * bar < duration; b++) {
    const start = b * bar;
    const chord = chords[b % chords.length];
    const intro = start < 8;
    const outro = start >= 56;
    chord.notes.forEach((note, i) => {
      tone(start, Math.min(2.65, duration - start), note, intro ? 0.042 : 0.032, "pad", (i - 1) * 0.5);
    });
    if (intro) {
      for (let k = 0; k < 4; k++) percussion(start + k * beat, 0.035, 0.045, true, k % 2 ? 0.3 : -0.3);
      tone(start + 0.02, 0.5, chord.notes[0] * 2, 0.045, "sine", -0.25, true);
      continue;
    }
    if (outro) {
      tone(start, 1.4, chord.notes[1] * 2, 0.045, "sine", 0.2, true);
      continue;
    }
    for (let k = 0; k < 4; k++) {
      kick(start + k * beat, k === 0 ? 0.52 : 0.43);
      if (k === 1 || k === 3) percussion(start + k * beat, 0.19, 0.2, false, 0.05);
    }
    for (let k = 0; k < 8; k++) {
      const at = start + k * beat / 2;
      percussion(at, 0.065, k % 2 ? 0.06 : 0.035, true, k % 2 ? 0.42 : -0.42);
      const bassNote = chord.root * (k === 6 ? 1.5 : 1);
      tone(at, 0.21, bassNote, 0.13, "bass");
      const arp = chord.notes[[0, 1, 2, 1, 0, 2, 1, 2][k]] * 2;
      tone(at, 0.24, arp, 0.052, "triangle", k % 2 ? 0.48 : -0.48, true);
    }
  }
  // A gentle noise rise leads into the logo reveal at 00:08.
  const riseStart = Math.floor(6 * sampleRate);
  let low = 0;
  for (let j = 0; j < 2 * sampleRate; j++) {
    const p = j / (2 * sampleRate);
    const n = noise(); low += 0.08 * (n - low);
    mix(riseStart + j, (n - low) * p * p * 0.055, Math.sin(p * 5) * 0.5);
  }
  tone(8, 0.9, 55, 0.22, "sine");
  let peak = 0;
  for (let i = 0; i < length; i++) {
    const t = i / sampleRate;
    const fade = Math.min(1, t / 0.12) * Math.min(1, Math.max(0, (duration - t) / 2.4));
    left[i] = Math.tanh(left[i] * 1.25) * fade;
    right[i] = Math.tanh(right[i] * 1.25) * fade;
    peak = Math.max(peak, Math.abs(left[i]), Math.abs(right[i]));
  }
  const gain = peak > 0 ? 0.84 / peak : 1;
  for (let i = 0; i < length; i++) { left[i] *= gain; right[i] *= gain; }
  return { left, right, sampleRate };
}

export function scoreToWav(score: Score): Buffer {
  const samples = score.left.length;
  const dataBytes = samples * 4;
  const buffer = Buffer.alloc(44 + dataBytes);
  buffer.write("RIFF", 0); buffer.writeUInt32LE(36 + dataBytes, 4);
  buffer.write("WAVE", 8); buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16); buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(2, 22); buffer.writeUInt32LE(score.sampleRate, 24);
  buffer.writeUInt32LE(score.sampleRate * 4, 28); buffer.writeUInt16LE(4, 32);
  buffer.writeUInt16LE(16, 34); buffer.write("data", 36);
  buffer.writeUInt32LE(dataBytes, 40);
  for (let i = 0; i < samples; i++) {
    buffer.writeInt16LE(Math.round(Math.max(-1, Math.min(1, score.left[i])) * 32767), 44 + i * 4);
    buffer.writeInt16LE(Math.round(Math.max(-1, Math.min(1, score.right[i])) * 32767), 46 + i * 4);
  }
  return buffer;
}
