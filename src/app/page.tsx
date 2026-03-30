'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import repo4 from '../img/repo4.jpg';
import repo5 from '../img/repo5.webp';
import p1Image from '../img/p1.png';
import fondo1 from '../img/fondorepo1.avif';
import fondo2 from '../img/fondorepo2.png';
import fondo3 from '../img/fondorepo3.png';
import fondo4 from '../img/fondorepo4.jpg';
import fondo5 from '../img/fondorepo5.jpg';
import repotpato from '../img/repotpato.png';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [confirmedGuests, setConfirmedGuests] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState('');
  const ITEMS_PER_PAGE = 5;

  const backgrounds = [fondo1, fondo2, fondo3, fondo4, fondo5];
  const [currentBg, setCurrentBg] = useState(0);

  useEffect(() => {
    const bgInterval = setInterval(() => {
      setCurrentBg(prev => (prev + 1) % backgrounds.length);
    }, 5000);
    return () => clearInterval(bgInterval);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('partyGuests');
    if (stored) {
      try {
        setConfirmedGuests(JSON.parse(stored));
      } catch (e) {
        // ignore
      }
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0', 'translate-x-0', 'scale-100');
          entry.target.classList.remove('opacity-0', 'translate-y-12', 'translate-x-12', '-translate-x-12', 'scale-95');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const startAudio = () => {
      if (audioRef.current && audioRef.current.paused) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            // Remove listeners once audio is successfully playing
            ['click', 'keydown', 'scroll', 'pointerdown'].forEach(evt => 
              document.removeEventListener(evt, startAudio)
            );
          }).catch(err => {
            console.log("Esperando interacción para autoplay:", err);
          });
        }
      }
    };

    // Intentar reproducir directamente
    startAudio();

    // Si está bloqueado, reproducir con el primer evento de interacción
    ['click', 'keydown', 'scroll', 'pointerdown'].forEach(evt => 
      document.addEventListener(evt, startAudio, { passive: true })
    );

    return () => {
      ['click', 'keydown', 'scroll', 'pointerdown'].forEach(evt => 
        document.removeEventListener(evt, startAudio)
      );
    };
  }, []);

  const handleConfirm = () => {
    const name = guestName.trim();
    if (name) {
      if (confirmedGuests.some(g => g.toLowerCase() === name.toLowerCase())) {
        setError('Nombre ya existente');
        return;
      }
      const updated = [...confirmedGuests, name];
      setConfirmedGuests(updated);
      localStorage.setItem('partyGuests', JSON.stringify(updated));
      setGuestName('');
      setError('');
      setIsModalOpen(false);
    }
  };

  return (
    <main className="w-full h-full overflow-x-hidden border-box relative">
      <audio ref={audioRef} src="/soundrepo.mp3" loop muted={isMuted} />
      <button 
        onClick={() => {
          const nextMuted = !isMuted;
          setIsMuted(nextMuted);
          if (audioRef.current) {
            audioRef.current.muted = nextMuted;
            if (!nextMuted) {
              audioRef.current.play().catch(e => console.log('Audio error:', e));
            }
          }
        }}
        className="fixed top-4 right-4 z-50 bg-repoSecondary/80 backdrop-blur-sm border-2 border-repoAccent p-3 rounded-full text-repoAccent hover:bg-repoAccent hover:text-black transition-all shadow-[0_0_15px_rgba(255,170,0,0.4)] hover:scale-110"
        aria-label={isMuted ? "Activar sonido" : "Silenciar sonido"}
      >
        {isMuted ? (
          <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
        ) : (
          <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>
        )}
      </button>

      {/* SECTION 1: Invitation / Hero */}
      <section className="relative w-full min-h-screen flex flex-col items-center justify-center p-6 scanlines border-b-4 border-repoAccent overflow-hidden bg-black">

        {/* Carousel Backgrounds */}
        {backgrounds.map((bg, index) => (
          <Image
            key={index}
            src={bg}
            alt={`Fondo ${index + 1}`}
            fill
            className={`object-cover object-center absolute inset-0 z-0 transition-opacity duration-1000 ${index === currentBg ? 'opacity-30' : 'opacity-0'
              }`}
            priority={index === 0}
          />
        ))}

        {/* Top Floating decorative elements */}
        <div className="absolute top-10 w-full flex justify-between px-6 opacity-30 text-xs font-mono z-10">
          <span>SCORE: 099900</span>
          <span>LEVEL: 2X</span>
        </div>

        {/* Main Title Area */}
        <div className="animate-on-scroll opacity-0 translate-y-12 transition-all duration-1000 ease-out z-10 text-center mb-8 flex flex-col items-center w-full">
          <h2 className="text-repoAccent tracking-widest font-mono text-xl mb-2 animate-pulse">¡ESTÁS INVITADO!</h2>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter shadow-repoAccent leading-tight max-w-5xl mx-auto"
            style={{ textShadow: '2px 2px 0px #ffaa00, 4px 4px 0px #0a0a0a' }}>
            Fiesta de Cumpleaños
          </h1>
          <p className="mt-4 text-gray-300 max-w-xs text-center font-bold">
            PREPARA TUS CONTROLES PARA LA MEJOR PARTIDA DE LA HISTORIA
          </p>
        </div>

        {/* Character / Avatar Images (Monitos) */}
        <div className="z-10 relative flex justify-center items-center w-full my-6 gap-4">
          <div className="animate-float relative w-32 h-32 md:w-48 md:h-48 rounded-xl bg-repoSecondary/50 border-2 border-repoAccent flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(255,170,0,0.3)] hover:scale-105 transition-transform">
            <Image src={repo4} alt="Monito 1" className="object-cover w-full h-full" placeholder="blur" />
          </div>
          <div className="animate-float-delayed relative w-24 h-24 md:w-32 md:h-32 rounded-xl bg-repoSecondary/50 border-2 border-repoAccent flex items-center justify-center overflow-hidden translate-y-4 shadow-[0_0_15px_rgba(255,170,0,0.3)] hover:scale-105 transition-transform">
            <Image src={repo5} alt="Monito 2" className="object-cover w-full h-full" placeholder="blur" />
          </div>
        </div>

        {/* Scroll down indicator */}
        <div className="absolute bottom-10 animate-bounce flex flex-col items-center">
          <span className="font-mono text-xs text-repoAccent mb-2">PRESS START TO CONTINUE</span>
          <svg className="w-6 h-6 text-repoAccent" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </section>

      {/* SECTION 2: Location and Time */}
      <section className="relative w-full min-h-screen flex flex-col items-center justify-center p-6 bg-repoBlack text-white border-b-4 border-repoAccent overflow-hidden">

        {/* Geometric Background Elements */}
        <div className="absolute bottom-20 right-10 w-64 h-64 border-4 border-dashed border-repoAccent/10 rotate-45"></div>

        <div className="z-10 w-full max-w-6xl">
          <h3 className="animate-on-scroll opacity-0 translate-y-12 transition-all duration-1000 ease-out text-4xl md:text-5xl font-black mb-16 text-center text-white uppercase tracking-widest drop-shadow-md">
            <span className="text-repoAccent">DESTINO</span> DE LA MISIÓN
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">

            {/* Left Box: Time and Address */}
            <div className="animate-on-scroll opacity-0 -translate-x-12 transition-all duration-1000 ease-out delay-200 flex flex-col justify-center gap-8">

              {/* Hora Card */}
              <div className="group bg-repoSecondary/40 backdrop-blur-sm p-8 rounded-2xl border-l-[6px] border-repoAccent hover:bg-repoSecondary/60 hover:-translate-y-2 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.4)] flex items-center gap-6">
                <div className="bg-repoDark p-4 rounded-xl text-repoAccent group-hover:scale-110 transition-transform shadow-inner">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div>
                  <h4 className="font-bold text-2xl text-repoAccent font-mono mb-1">HORA</h4>
                  <p className="text-gray-200 text-xl font-bold tracking-wider">16:00 HRS</p>
                  <p className="text-gray-400 text-sm mt-1 uppercase">10 de Mayo</p>
                </div>
              </div>

              {/* Ubicación Card */}
              <div className="group bg-repoSecondary/40 backdrop-blur-sm p-8 rounded-2xl border-l-[6px] border-repoAccent hover:bg-repoSecondary/60 hover:-translate-y-2 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.4)] flex items-center gap-6">
                <div className="bg-repoDark p-4 rounded-xl text-repoAccent group-hover:scale-110 transition-transform shadow-inner">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <div>
                  <h4 className="font-bold text-2xl text-repoAccent font-mono mb-1">UBICACIÓN</h4>
                  <p className="text-gray-200 text-lg leading-tight mb-3">Los morros pasaje la manta 1717, La Serena</p>
                  <a href="https://maps.app.goo.gl/XhJg8DZjKVPmV6u99" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-xs font-mono bg-repoAccent text-black px-4 py-2 rounded font-bold hover:bg-yellow-400 transition-colors shadow-md">
                    <span>VER EN GOOGLE MAPS</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                  </a>
                </div>
              </div>

            </div>

            {/* Right Box: Map Embed */}
            <div className="animate-on-scroll opacity-0 translate-x-12 transition-all duration-1000 ease-out delay-500 w-full flex">
              <div className="w-full relative bg-repoSecondary/30 p-3 rounded-2xl border-2 border-dashed border-repoAccent shadow-[0_0_20px_rgba(255,170,0,0.2)] md:rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="absolute -top-4 -right-4 bg-green-500 text-black font-black text-[10px] px-3 py-1 flex items-center gap-2 rounded-full border-2 border-black z-20 font-mono tracking-widest cursor-default shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-black animate-ping"></span>
                  RADAR ONLINE
                </div>
                <div className="w-full h-80 lg:h-full min-h-[350px] rounded-xl overflow-hidden border-2 border-repoDark relative z-10 bg-repoDark/50">
                  <iframe
                    src="https://maps.google.com/maps?q=la%20manta%201717%20%2C%20la%20serena&t=&z=15&ie=UTF8&iwloc=&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0 grayscale contrast-125 hover:grayscale-0 transition-all duration-700"
                    title="Mapa de ubicación"
                  ></iframe>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 3: Contact and Wait message */}
      <section className="relative w-full min-h-screen flex flex-col items-center justify-center p-6 bg-repoDark/95">

        <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #ffaa00 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

        <div className="z-10 w-full max-w-5xl flex flex-col md:flex-row items-center md:items-start justify-center gap-12 pt-8">

          {/* Left Column: Registered Guests */}
          <div className="animate-on-scroll opacity-0 translate-y-12 transition-all duration-1000 ease-out delay-500 w-full md:w-1/3 bg-repoSecondary/80 backdrop-blur border-2 border-repoAccent p-6 rounded-2xl order-2 md:order-1 shadow-xl relative z-10 text-left">
            <h3 className="text-repoAccent font-mono font-bold text-xl mb-4 border-b border-repoAccent/30 pb-2 flex items-center gap-2 justify-center md:justify-start">
              <svg className="w-5 h-5 text-repoAccent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              PLAYERS
            </h3>
            <div className="min-h-[250px] relative">
              <ul className="text-gray-300 font-mono space-y-3">
                {confirmedGuests.length === 0 ? (
                  <li className="text-gray-500 text-sm text-center py-4 italic">No hay jugadores en la partida.</li>
                ) : (
                  confirmedGuests.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map((guest, idx) => (
                    <li key={(currentPage - 1) * ITEMS_PER_PAGE + idx} className="flex items-center gap-3 bg-repoDark/50 p-2 rounded border border-gray-700 text-sm animate-item-enter">
                      <div className="w-8 h-8 shrink-0 relative overflow-hidden rounded bg-gray-800 border-2 border-repoAccent flex items-center justify-center">
                        <Image src={p1Image} alt="Player Icon" className="object-cover w-full h-full" placeholder="blur" />
                      </div>
                      <span className="truncate">{guest}</span>
                    </li>
                  ))
                )}
              </ul>
            </div>
            {confirmedGuests.length > ITEMS_PER_PAGE && (
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-repoAccent/30">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="text-xs bg-gray-800 text-gray-300 px-3 py-1 rounded disabled:opacity-50 hover:bg-gray-700 transition-colors font-mono font-bold border border-gray-600"
                >
                  ANTERIOR
                </button>
                <span className="text-xs text-repoAccent font-mono">
                  {currentPage} / {Math.ceil(confirmedGuests.length / ITEMS_PER_PAGE)}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(Math.ceil(confirmedGuests.length / ITEMS_PER_PAGE), p + 1))}
                  disabled={currentPage >= Math.ceil(confirmedGuests.length / ITEMS_PER_PAGE)}
                  className="text-xs bg-repoAccent/20 text-repoAccent px-3 py-1 rounded disabled:opacity-50 hover:bg-repoAccent hover:text-black transition-colors font-mono font-bold border border-repoAccent"
                >
                  SIGUIENTE
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Title, text, buttons */}
          <div className="animate-on-scroll opacity-0 translate-y-12 transition-all duration-1000 ease-out delay-200 max-w-md w-full text-center order-1 md:order-2">
            <h2 className="text-4xl font-black mb-4 text-white uppercase">¡TE ESPERO CON MUCHAS GANAS!</h2>
            <p className="text-gray-400 mb-8 max-w-sm mx-auto">
              Por favor, confirma tu asistencia para preparar el loot adecuado para ti. ¡No faltes!
            </p>

            <div className="flex justify-center mb-8">
              <div className="relative w-24 h-24 rounded-full bg-repoBlack border-2 border-repoAccent flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(255,170,0,0.3)] hover:scale-105 transition-transform">
                <Image src={repotpato} alt="Monito Final" className="object-cover w-full h-full" placeholder="blur" />
              </div>
            </div>

            <div className="space-y-4 relative">
              <button
                onClick={() => setIsModalOpen(true)}
                className="animate-pulse-glow block w-full py-4 bg-transparent border-2 border-repoAccent text-repoAccent font-bold font-mono rounded-xl hover:bg-repoAccent hover:text-black transition-all"
              >
                CONFIRMAR ASISTENCIA
              </button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-5 text-xs text-gray-600 font-mono z-10 w-full text-center">
          GAME OVER / TO BE CONTINUED
        </div>
      </section>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in text-left">
          <div className="bg-repoSecondary border-2 border-repoAccent rounded-2xl p-6 w-full max-w-md relative shadow-[0_0_30px_rgba(255,170,0,0.4)]">
            <h3 className="text-2xl font-black text-white mb-2 uppercase flex items-center gap-2">
              <span className="text-repoAccent">▶</span> INGRESA TU NOMBRE
            </h3>
            <p className="text-gray-400 text-sm mb-6">Confirma tu asistencia usando tu nombre para sumarte al lobby.</p>
            <input
              type="text"
              value={guestName}
              onChange={(e) => { setGuestName(e.target.value); setError(''); }}
              placeholder="Player 1..."
              className={`w-full bg-repoDark border-2 ${error ? 'border-red-500 mb-4' : 'border-repoAccent mb-6'} text-white font-mono p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-repoAccent placeholder-gray-600`}
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
            />
            {error && (
              <div className="bg-red-900/80 border border-red-500 text-white px-3 py-2 rounded-xl mb-6 text-sm font-bold text-center animate-pulse shadow-[0_0_15px_rgba(255,0,0,0.5)]">
                ⚠️ {error}
              </div>
            )}
            <div className="flex gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-3 text-gray-300 bg-transparent border-2 border-gray-600 rounded-xl font-bold font-mono hover:bg-gray-800 transition-colors"
              >
                CANCELAR
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 py-3 bg-repoAccent text-black border-2 border-repoAccent rounded-xl font-bold font-mono hover:bg-yellow-400 transition-colors"
              >
                ACEPTAR
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
