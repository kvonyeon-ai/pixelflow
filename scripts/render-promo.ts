import "dotenv/config";
import { mkdirSync, writeFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { createCanvas, GlobalFonts, loadImage } from "@napi-rs/canvas";
import ffmpegPath from "ffmpeg-static";
import QRCode from "qrcode";
import { drawPromoFrame, VIDEO_DURATION, VIDEO_FPS } from "../src/lib/video/renderer";
import { synthesizeScore, scoreToWav } from "../src/lib/video/soundtrack";

async function main() {
  if (!ffmpegPath) throw new Error("Local FFmpeg binary is unavailable");
  const root = process.cwd();
  const out = resolve(root, "public/media");
  const cache = resolve(root, ".render-cache");
  mkdirSync(out, { recursive: true });
  mkdirSync(cache, { recursive: true });
  GlobalFonts.registerFromPath(resolve(root, "public/fonts/Inter.ttf"), "Inter");
  GlobalFonts.registerFromPath(resolve(root, "public/fonts/Unbounded.ttf"), "Unbounded");
  const hero = await loadImage(resolve(root, "public/images/hero.png"));
  const mark = await loadImage(resolve(root, "public/images/mark.png"));
  const qrData = await QRCode.toDataURL("https://t.me/p_f_helperbot", {
    width: 440, margin: 2, errorCorrectionLevel: "M",
    color: { dark: "#08101fff", light: "#ffffffff" },
  });
  const qr = await loadImage(qrData);
  const assets = { hero, mark, qr };
  const width = 720;
  const height = 1280;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");
  const draw = (t: number) => drawPromoFrame(ctx as unknown as CanvasRenderingContext2D, width, height, t, assets);
  draw(9.8);
  writeFileSync(resolve(out, "pixel-flow-poster.jpg"), canvas.toBuffer("image/jpeg", 91));
  console.log("Poster ready. Synthesizing original stereo soundtrack…");
  const wavPath = resolve(cache, "pixel-flow-score.wav");
  writeFileSync(wavPath, scoreToWav(synthesizeScore(VIDEO_DURATION)));
  const videoPath = resolve(out, "pixel-flow-60s.mp4");
  const args = [
    "-hide_banner", "-loglevel", "warning", "-y",
    "-f", "rawvideo", "-pix_fmt", "rgba", "-s", `${width}x${height}`,
    "-r", String(VIDEO_FPS), "-i", "pipe:0",
    "-i", wavPath,
    "-c:v", "libx264", "-preset", "veryfast", "-crf", "22",
    "-pix_fmt", "yuv420p", "-profile:v", "high", "-level", "4.0",
    "-c:a", "aac", "-b:a", "160k", "-ar", "44100",
    "-t", String(VIDEO_DURATION), "-movflags", "+faststart",
    "-metadata", "title=Pixel Flow — учебные проекты",
    "-metadata", "comment=Original procedural motion design and synthesized music; AI-generated brand artwork.",
    videoPath,
  ];
  const proc = spawn(ffmpegPath, args, { stdio: ["pipe", "ignore", "pipe"] });
  let errors = "";
  proc.stderr.on("data", (chunk: Buffer) => { errors += chunk.toString(); });
  const finished = new Promise<void>((resolveDone, reject) => {
    proc.on("error", reject);
    proc.on("close", (code) => code === 0 ? resolveDone() : reject(new Error(`FFmpeg exited ${code}: ${errors.slice(-3000)}`)));
  });
  proc.stdin.on("error", () => { /* The exit handler reports the encoder error. */ });
  const total = VIDEO_DURATION * VIDEO_FPS;
  const started = Date.now();
  for (let frame = 0; frame < total; frame++) {
    draw(frame / VIDEO_FPS);
    const pixels = Buffer.from(canvas.data());
    if (!proc.stdin.write(pixels)) await once(proc.stdin, "drain");
    if (frame % 120 === 0) console.log(`Rendering ${Math.round(frame / total * 100)}% · ${frame}/${total} frames`);
  }
  proc.stdin.end();
  await finished;
  console.log("MP4 ready. Exporting music track…");
  const audioPath = resolve(out, "pixel-flow-theme.mp3");
  const audio = spawn(ffmpegPath, ["-hide_banner", "-loglevel", "error", "-y", "-i", wavPath, "-c:a", "libmp3lame", "-b:a", "160k", audioPath], { stdio: "inherit" });
  const [audioCode] = await once(audio, "close");
  if (audioCode !== 0) throw new Error("Music export failed");
  const manifest = {
    title: "Pixel Flow — учебные проекты под ключ",
    videoUrl: "/media/pixel-flow-60s.mp4",
    posterUrl: "/media/pixel-flow-poster.jpg",
    audioUrl: "/media/pixel-flow-theme.mp3",
    duration: VIDEO_DURATION,
    width, height, fps: VIDEO_FPS,
    bytes: statSync(videoPath).size,
    audioBytes: statSync(audioPath).size,
    language: "ru",
    videoCodec: "H.264",
    audioCodec: "AAC",
    botUrl: "https://t.me/p_f_helperbot",
    channelUrl: "https://t.me/pixel_flow_1",
    createdAt: new Date().toISOString(),
    production: "Local procedural motion design, original synthesized score, AI-generated brand illustrations.",
  };
  writeFileSync(resolve(out, "pixel-flow.json"), JSON.stringify(manifest, null, 2));
  console.log(`Done in ${Math.round((Date.now() - started) / 1000)}s · ${(manifest.bytes / 1024 / 1024).toFixed(1)} MB · ${width}×${height} · ${VIDEO_DURATION}s`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
