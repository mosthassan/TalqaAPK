'use client';

import React, { useEffect, useRef, useState, useCallback, useSyncExternalStore } from 'react';
import Hls from 'hls.js';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  PictureInPicture2,
  RotateCcw,
  AlertCircle,
  WifiOff,
  Settings,
  ExternalLink,
  Copy,
  Check,
  Radio,
  Tv,
} from 'lucide-react';
import { NETWORK_LINKS } from '@/src/config/links';

interface HlsVideoPlayerProps {
  src: string;
  httpsUrl?: string;
  channelId?: string;
  poster?: string;
  title: string;
  requiresLan?: boolean;
  lanPlayerUrl?: string;
  onClose?: () => void;
}

function getPlaylistUrl(url: string): string {
  if (!url) return '';
  if (url.endsWith('.m3u8')) return url;
  if (url.endsWith('/')) return `${url}index.m3u8`;
  return `${url}/index.m3u8`;
}

export default function HlsVideoPlayer({
  src,
  httpsUrl,
  channelId,
  poster,
  title,
  requiresLan = true,
  lanPlayerUrl,
}: HlsVideoPlayerProps) {
  const effectiveSrc = httpsUrl || src;
  const directServerUrl = src || NETWORK_LINKS.localServer.liveMatchUrl;
  const resolvedLanPlayerUrl =
    lanPlayerUrl ||
    `${NETWORK_LINKS.localServer.lanPlayerUrl}?ch=${channelId || 'bein1'}`;
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isPipSupported, setIsPipSupported] = useState(false);

  useEffect(() => {
    if (typeof document !== 'undefined' && Boolean(document.pictureInPictureEnabled)) {
      setIsPipSupported(true);
    }
  }, []);
  const [isBuffering, setIsBuffering] = useState(true);
  const [errorState, setErrorState] = useState<string | null>(null);
  const [qualities, setQualities] = useState<{ id: number; height: number; bitrate: number }[]>([]);
  const [currentQuality, setCurrentQuality] = useState<number>(-1); // -1 = Auto
  const [showQualityMenu, setShowQualityMenu] = useState(false);

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(directServerUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }).catch(() => {});
    }
  };

  // Request Wake Lock to prevent screen sleep while video plays
  const requestWakeLock = useCallback(async () => {
    try {
      if ('wakeLock' in navigator && !wakeLockRef.current) {
        wakeLockRef.current = await navigator.wakeLock.request('screen');
        wakeLockRef.current.addEventListener('release', () => {
          wakeLockRef.current = null;
        });
      }
    } catch {
      // Wake Lock not supported or rejected
    }
  }, []);

  const releaseWakeLock = useCallback(async () => {
    try {
      if (wakeLockRef.current) {
        await wakeLockRef.current.release();
        wakeLockRef.current = null;
      }
    } catch {
      // Ignore
    }
  }, []);

  const initHls = useCallback(() => {
    const video = videoRef.current;
    if (!video || !effectiveSrc) return;

    setErrorState(null);
    setIsBuffering(true);

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 30,
      });

      const playlistUrl = getPlaylistUrl(effectiveSrc);
      hls.loadSource(playlistUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
        setIsBuffering(false);
        const parsedQualities = data.levels.map((lvl, index) => ({
          id: index,
          height: lvl.height || 720,
          bitrate: lvl.bitrate || 0,
        }));
        setQualities(parsedQualities);
        video.play().catch(() => {
          setIsPlaying(false);
        });
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              setErrorState(
                requiresLan
                  ? 'هذا البث متاح داخل شبكة طلقة (LAN). يمكنك فتح الرابط المباشر أدناه في أي مشغل.'
                  : 'تعذر الاتصال بسيرفر البث المباشر'
              );
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              hls.destroy();
              setErrorState('البث متاح عبر المشغل الداخلي أو نافذة السيرفر المباشرة.');
              break;
          }
        }
      });

      hlsRef.current = hls;
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native Safari / iOS HLS support
      video.src = getPlaylistUrl(effectiveSrc);
      video.addEventListener('loadedmetadata', () => {
        setIsBuffering(false);
        video.play().catch(() => setIsPlaying(false));
      });
      video.addEventListener('error', () => {
        setErrorState(
          requiresLan
            ? 'هذا البث متاح داخل شبكة طلقة (LAN). يمكنك فتح الرابط المباشر أدناه.'
            : 'تعذر تحميل بث القناة'
        );
      });
    } else {
      setErrorState('المتصفح لا يدعم تشغيل بث HLS المباشر');
    }
  }, [effectiveSrc, requiresLan]);

  useEffect(() => {
    initHls();

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      releaseWakeLock();
    };
  }, [initHls, releaseWakeLock]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().then(() => {
        setIsPlaying(true);
        requestWakeLock();
      }).catch(() => {});
    } else {
      video.pause();
      setIsPlaying(false);
      releaseWakeLock();
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    const video = videoRef.current;
    if (!video) return;
    video.volume = val;
    setVolume(val);
    video.muted = val === 0;
    setIsMuted(val === 0);
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const togglePip = async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await video.requestPictureInPicture();
      }
    } catch {
      // Pip failed or user exited
    }
  };

  const setQuality = (levelIndex: number) => {
    if (hlsRef.current) {
      hlsRef.current.currentLevel = levelIndex;
      setCurrentQuality(levelIndex);
    }
    setShowQualityMenu(false);
  };

  return (
    <div className="w-full space-y-2">
      <div
        ref={containerRef}
        className="relative w-full aspect-video bg-black rounded-[20px] overflow-hidden border border-[#E7E5E4] shadow-md group select-none"
      >
      <video
        ref={videoRef}
        poster={poster}
        playsInline
        className="w-full h-full object-contain"
        onPlay={() => {
          setIsPlaying(true);
          requestWakeLock();
        }}
        onPause={() => {
          setIsPlaying(false);
          releaseWakeLock();
        }}
        onWaiting={() => setIsBuffering(true)}
        onPlaying={() => setIsBuffering(false)}
      />

      {/* Buffering Indicator */}
      {isBuffering && !errorState && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-xs z-10 pointer-events-none">
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 border-3 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
            <span className="text-[11px] text-white/90 font-medium font-body">جاري تحميل البث المباشر...</span>
          </div>
        </div>
      )}

      {/* Error Overlay */}
      {errorState && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/85 p-6 text-center z-20 font-body">
          <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mb-3">
            {requiresLan ? <WifiOff className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
          </div>
          <h4 className="text-white text-sm font-bold font-heading mb-1">{title}</h4>
          <p className="text-xs text-white/70 max-w-sm mb-2 leading-relaxed">{errorState}</p>
          <div className="text-[11px] font-mono text-[#D4AF37] mb-4 bg-white/5 px-3 py-1 rounded-full border border-white/10" dir="ltr">
            {directServerUrl}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <a
              href={directServerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C59424] hover:bg-[#B58218] text-white text-xs font-bold transition-transform active:scale-95 shadow-sm"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              فتح في سيرفر البث المباشر
            </a>
            <a
              href={resolvedLanPlayerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-transform active:scale-95 border border-white/20"
            >
              <Tv className="w-3.5 h-3.5 text-[#D4AF37]" />
              المشغل المحلي (LAN Player)
            </a>
            <button
              onClick={initHls}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/5 hover:bg-white/10 text-white/80 text-xs font-medium transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              إعادة المحاولة
            </button>
          </div>
        </div>
      )}

      {/* Channel Header Overlay */}
      <div className="absolute top-0 inset-x-0 p-3 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between text-white z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs font-bold font-heading">{title}</span>
        </div>
        {requiresLan && (
          <span className="px-2 py-0.5 rounded-full bg-[#0284C7]/80 text-[10px] font-semibold text-white">
            مباشر LAN
          </span>
        )}
      </div>

      {/* Video Controls Bar */}
      <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-center justify-between gap-3 text-white z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-2">
          {/* Play/Pause */}
          <button
            onClick={togglePlay}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
            title={isPlaying ? 'إيقاف' : 'تشغيل'}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
          </button>

          {/* Volume / Mute */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleMute}
              className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
              title={isMuted ? 'إلغاء الكتم' : 'كتم'}
            >
              {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-14 accent-[#D4AF37] h-1 rounded-full cursor-pointer hidden sm:block"
            />
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2 relative">
          {/* Quality Switcher */}
          {qualities.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setShowQualityMenu(!showQualityMenu)}
                className="p-1.5 rounded-full hover:bg-white/20 transition-colors flex items-center gap-1 text-[10px]"
                title="الجودة"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>{currentQuality === -1 ? 'تلقائي' : `${qualities[currentQuality]?.height}p`}</span>
              </button>

              {showQualityMenu && (
                <div className="absolute bottom-8 left-0 bg-[#1C1917] border border-[#44403C] rounded-lg shadow-xl p-1 text-right min-w-[90px] z-30">
                  <button
                    onClick={() => setQuality(-1)}
                    className={`w-full text-right px-2 py-1 text-[10px] rounded hover:bg-white/10 ${
                      currentQuality === -1 ? 'text-[#D4AF37] font-bold' : 'text-white'
                    }`}
                  >
                    تلقائي
                  </button>
                  {qualities.map((q) => (
                    <button
                      key={q.id}
                      onClick={() => setQuality(q.id)}
                      className={`w-full text-right px-2 py-1 text-[10px] rounded hover:bg-white/10 ${
                        currentQuality === q.id ? 'text-[#D4AF37] font-bold' : 'text-white'
                      }`}
                    >
                      {q.height}p
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Picture in Picture */}
          {isPipSupported && (
            <button
              onClick={togglePip}
              className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
              title="نافذة عائمة (PiP)"
            >
              <PictureInPicture2 className="w-4 h-4" />
            </button>
          )}

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
            title={isFullscreen ? 'تصغير' : 'ملء الشاشة'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>

    {/* Live Server Direct Access Bar */}
    <div className="p-3 bg-gradient-to-r from-[#1C1917] via-[#292524] to-[#1C1917] rounded-[18px] text-white border border-[#44403C] flex flex-wrap items-center justify-between gap-2.5 text-xs font-body shadow-xs">
      <div className="flex items-center gap-2.5">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
        <div className="text-right">
          <div className="font-bold text-white font-heading text-[11px] sm:text-xs flex items-center gap-1.5">
            <span>سيرفر البث المباشر (HLS LAN)</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium">نشط الآن</span>
          </div>
          <div className="text-[10px] text-stone-300 font-mono tracking-tight" dir="ltr">
            {directServerUrl}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        <a
          href={directServerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#C59424] hover:bg-[#B58218] text-white rounded-full font-bold text-[11px] transition-transform active:scale-95 shadow-xs"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>فتح في السيرفر المباشر</span>
        </a>

        <a
          href={resolvedLanPlayerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-stone-200 border border-white/20 rounded-full font-medium text-[11px] transition-colors"
        >
          <Tv className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>مشغل LAN</span>
        </a>

        <button
          onClick={handleCopyLink}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white/5 hover:bg-white/10 text-stone-300 rounded-full font-medium text-[11px] transition-colors"
          title="نسخ رابط سيرفر البث"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">تم النسخ</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>نسخ</span>
            </>
          )}
        </button>
      </div>
    </div>
  </div>
  );
}
