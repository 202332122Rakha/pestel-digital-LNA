import React, { useState, useRef, useEffect } from 'react';
import {
  Zap,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  ArrowRight,
  Building2,
  ShieldCheck,
  Award,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';

/**
 * Configure corporate video URL here.
 * If empty or unreachable, the interactive company profile player is displayed.
 */
export const CORPORATE_VIDEO_URL = '';

interface CorporateLandingPageProps {
  onEnterSystem: () => void;
}

export const CorporateLandingPage: React.FC<CorporateLandingPageProps> = ({ onEnterSystem }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(120); // 2 minutes profile demo
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const videoElementRef = useRef<HTMLVideoElement>(null);

  // Simulated video playback timer if using placeholder interactive presentation
  useEffect(() => {
    let timer: any;
    if (isPlaying && (!CORPORATE_VIDEO_URL || !videoElementRef.current?.currentSrc)) {
      timer = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            return 0;
          }
          const next = prev + 1;
          setProgress((next / duration) * 100);
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, duration]);

  const handleTogglePlay = () => {
    if (CORPORATE_VIDEO_URL && videoElementRef.current) {
      if (videoElementRef.current.paused) {
        videoElementRef.current.play();
        setIsPlaying(true);
      } else {
        videoElementRef.current.pause();
        setIsPlaying(false);
      }
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleToggleMute = () => {
    if (videoElementRef.current) {
      videoElementRef.current.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setProgress(val);
    const newTime = (val / 100) * duration;
    setCurrentTime(newTime);
    if (videoElementRef.current) {
      videoElementRef.current.currentTime = newTime;
    }
  };

  const handleToggleFullscreen = () => {
    if (!videoContainerRef.current) return;
    if (!document.fullscreenElement) {
      videoContainerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#006B32] to-[#00A84D] flex items-center justify-center shadow-md border border-emerald-400/30">
              <Zap className="w-5 h-5 text-yellow-300 fill-yellow-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white">PLN DIGITAL LNA</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Prototype
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Learning Need Analysis & Competency Management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col text-right text-[11px] text-slate-400">
              <span className="font-bold text-slate-200">BIDANG PERENCANAAN</span>
              <span className="text-[10px] text-slate-400">Sub Bidang Pengelolaan Pembelajaran, Asesmen & Sertifikasi Digital</span>
            </div>
            <button
              onClick={onEnterSystem}
              className="px-4 py-2 bg-[#00843D] hover:bg-[#00A84D] text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-900/40 flex items-center gap-2 cursor-pointer group"
            >
              <span>Masuk ke Sistem</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Hero & Corporate Video Section */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col justify-center items-center">
        {/* App Title & Intro */}
        <div className="text-center max-w-3xl mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/90 border border-slate-700/80 text-xs font-semibold text-emerald-400 mb-3 shadow-inner">
            <Building2 className="w-3.5 h-3.5 text-yellow-400" />
            <span>Corporate Video / Company Profile</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            PLN DIGITAL LNA
          </h1>
          <h2 className="text-sm sm:text-lg text-emerald-400 font-semibold mt-1">
            Learning Need Analysis & Competency Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2.5 leading-relaxed max-w-2xl mx-auto">
            Platform tata kelola analisis kebutuhan pembelajaran terintegrasi Sub Bidang Pengelolaan Pembelajaran, Asesmen dan Sertifikasi Berbasis Digital (Bidang Perencanaan) untuk pemetaan kompetensi, kurikulum digital, dan akselerasi kapabilitas talent PLN.
          </p>
        </div>

        {/* Video Player Card */}
        <div
          ref={videoContainerRef}
          className="w-full max-w-4xl bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden relative group aspect-video flex flex-col justify-between"
        >
          {/* Actual Video tag or simulated animated canvas/poster */}
          {CORPORATE_VIDEO_URL ? (
            <video
              ref={videoElementRef}
              src={CORPORATE_VIDEO_URL}
              className="w-full h-full object-cover"
              onTimeUpdate={() => {
                if (videoElementRef.current) {
                  setCurrentTime(videoElementRef.current.currentTime);
                  setDuration(videoElementRef.current.duration || 120);
                  setProgress((videoElementRef.current.currentTime / (videoElementRef.current.duration || 120)) * 100);
                }
              }}
              onEnded={() => setIsPlaying(false)}
            />
          ) : (
            /* Elegant Corporate Presentation / Video Placeholder with Motion */
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-[#003818] to-slate-950 flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden">
              {/* Animated Background Rays */}
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500 rounded-full blur-[100px] animate-pulse" />
              </div>

              {/* Poster Content */}
              <div className="relative z-10 flex flex-col items-center max-w-lg">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-600/30 border border-emerald-400/40 flex items-center justify-center backdrop-blur-md shadow-xl mb-4 text-yellow-300">
                  <Zap className="w-8 h-8 sm:w-10 sm:h-10 fill-yellow-300" />
                </div>
                <div className="text-[11px] tracking-widest text-emerald-400 uppercase font-bold mb-1">
                  Corporate Video & Profile Showcase
                </div>
                <h3 className="text-lg sm:text-2xl font-bold text-white tracking-tight">
                  Transformasi Kompetensi Digital PLN
                </h3>
                <p className="text-xs text-slate-300 mt-2 max-w-md leading-relaxed">
                  Menyiapkan talenta unggul ketenagalistrikan melalui analisis kebutuhan terukur:
                  Competency Gap Analysis, Diklat Terarah, dan Solusi Pembelajaran Modern.
                </p>

                {/* Big Center Play Button Overlay */}
                <button
                  onClick={handleTogglePlay}
                  className="mt-6 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-full font-bold text-xs sm:text-sm flex items-center gap-2.5 transition-transform hover:scale-105 shadow-xl cursor-pointer"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4 fill-slate-950" />
                      <span>Jeda Video Profile</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-slate-950 ml-0.5" />
                      <span>Putar Video Corporate</span>
                    </>
                  )}
                </button>
              </div>

              {/* Status Info in Video */}
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[11px] font-mono text-emerald-300 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-700">
                  {isPlaying ? 'PLAYING · PROFILE DEMO' : 'READY · PLN CORPU'}
                </span>
              </div>
            </div>
          )}

          {/* Bottom Player Controls Bar */}
          <div className="relative z-30 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-4 flex flex-col gap-2 mt-auto">
            {/* Progress Bar (Scrubber) */}
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="100"
                step="0.1"
                value={progress}
                onChange={handleSeek}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#00A84D]"
              />
            </div>

            {/* Controls Row */}
            <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleTogglePlay}
                  className="p-1.5 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                </button>

                <button
                  onClick={handleToggleMute}
                  className="p-1.5 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
                </button>

                <div className="font-mono text-[11px] text-slate-400">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[11px] text-slate-400 hidden sm:inline">
                  PLN Corporate University Presentation
                </span>
                <button
                  onClick={handleToggleFullscreen}
                  className="p-1.5 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                  title="Fullscreen"
                >
                  <Maximize className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Big Entry Action Button */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={onEnterSystem}
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#00843D] to-[#00A84D] hover:from-[#006B32] hover:to-[#00843D] text-white rounded-xl text-sm font-extrabold transition-all shadow-xl shadow-emerald-900/50 flex items-center justify-center gap-3 cursor-pointer group hover:scale-[1.02]"
          >
            <span>MASUK KE SISTEM</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
          </button>
        </div>

        {/* Academic Project Disclaimer */}
        <div className="mt-6 max-w-xl text-center">
          <div className="p-3 bg-slate-900/60 border border-slate-800/80 rounded-xl text-[11px] text-slate-400 flex items-center gap-2.5 text-left">
            <Info className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Pemberitahuan:</strong> Aplikasi ini adalah prototype/academic project konseptual untuk
              Sub Bidang Pengelolaan Pembelajaran, Asesmen dan Sertifikasi Berbasis Digital (Bidang Perencanaan), bukan aplikasi resmi PT PLN (Persero). Menggunakan dummy data untuk demonstrasi fungsi LNA.
            </span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 text-center text-[11px] text-slate-500">
        © 2026 PLN Digital LNA · Learning Need Analysis & Competency Management Prototype
      </footer>
    </div>
  );
};
