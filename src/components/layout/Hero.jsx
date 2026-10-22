import { ArrowDown, MapPin } from 'lucide-react';
import ClimateMap from '../ClimateMap';

export default function Hero({ locations, province, selected }) {
  const scrollToDashboard = () => {
    document
      .getElementById('dashboard-content')
      ?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      className="hero"
      id="top"
      style={{
        position: 'relative',
        isolation: 'isolate',
        minHeight: '100vh',
        overflow: 'hidden',
        backgroundColor: '#08121b',
      }}
    >
      {/* Gambar latar belakang */}
      <img
        src="/assets/bg-iklim.webp"
        alt=""
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          opacity: 1,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Overlay transparan */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          background: `
            linear-gradient(
              90deg,
              rgba(8, 18, 27, 0.10) 0%,
              rgba(8, 18, 27, 0.04) 55%,
              rgba(8, 18, 27, 0.02) 100%
            ),
            linear-gradient(
              0deg,
              rgba(8, 18, 27, 0.18),
              transparent 45%
            )
          `,
          pointerEvents: 'none',
        }}
      />

      {/* Peta transparan */}
      <div
        className="hero-map-bg"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          opacity: 0.06,
          pointerEvents: 'none',
        }}
      >
        <ClimateMap
          places={locations}
          provinceRows={province}
          selected={selected}
          onSelect={() => {}}
        />
      </div>

      {/* Grid dekoratif */}
      <div
        className="hero-grid"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 3,
          pointerEvents: 'none',
        }}
      />

      {/* Konten utama */}
      <div
        className="hero-content"
        style={{
          position: 'relative',
          zIndex: 4,
          color: '#ffffff',
          textShadow: '0 2px 18px rgba(0, 0, 0, 0.45)',
        }}
      >
        <h1>
          Membaca pola iklim,
          <br />
          <em>memahami Indonesia</em>
        </h1>

        <p>
          Eksplorasi data historis cuaca dari berbagai wilayah Indonesia
          melalui peta interaktif dan visualisasi yang berbasis data
        </p>
      </div>

      {/* Label lokasi */}
      <div
        className="hero-map-label"
        style={{
          position: 'absolute',
          zIndex: 4,
          textShadow: '0 2px 10px rgba(0, 0, 0, 0.7)',
        }}
      >
        <MapPin size={15} />
        38 titik ibu kota provinsi
      </div>

      {/* Tombol panah scroll */}
      <button
        type="button"
        aria-label="Jelajahi dashboard"
        onClick={scrollToDashboard}
        style={{
          position: 'absolute',
          left: '50%',
          top: '66.5%',
          transform: 'translate(-50%, -50%)',
          width: '46px',
          height: '46px',
          padding: 0,
          border: 'none',
          borderRadius: '50%',
          backgroundColor: '#1677f9',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxSizing: 'border-box',
          lineHeight: 0,
          cursor: 'pointer',
          zIndex: 5,
        }}
      >
        <ArrowDown
          size={20}
          strokeWidth={2}
          style={{
            display: 'block',
            flexShrink: 0,
            margin: 0,
            padding: 0,
          }}
        />
      </button>
    </section>
  );
}