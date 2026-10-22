import { useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from 'react-leaflet';

function FitIndonesia() {
  const map = useMap();
  useMemo(() => {
    map.setView([-2.5, 118], 4);
  }, [map]);
  return null;
}

export default function ClimateMap({ places = [], provinceRows = [], selected = [], onSelect = () => {} }) {
  const values = new Map(provinceRows.map((row) => [row.name, row.temp]));
  return (
    <div className="map-wrap">
      <MapContainer center={[-2.5, 118]} zoom={4} minZoom={3} maxZoom={10} scrollWheelZoom style={{ height: '100%', width: '100%' }}>
        <FitIndonesia />
        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {places.map((place) => {
          const isSelected = selected.includes(place.name);
          const temp = values.get(place.name);
          return (
            <CircleMarker
              key={place.name}
              center={[place.lat, place.lon]}
              radius={isSelected ? 8 : 5}
              pathOptions={{ color: isSelected ? '#00bfd0' : '#1678ed', fillColor: isSelected ? '#00bfd0' : '#1678ed', fillOpacity: 0.85, weight: 2 }}
              eventHandlers={{ click: () => onSelect(place.name) }}
            >
              <Tooltip direction="top" offset={[0, -5]}>
                <strong>{place.name}</strong><br />{place.city}<br />Suhu: {Number.isFinite(temp) ? `${temp.toFixed(1)} °C` : 'Data belum tersedia'}
              </Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>
      <div className="map-legend">
        <span><i style={{ background: '#00bfd0' }} /> Wilayah dipilih</span>
        <span><i style={{ background: '#1678ed' }} /> Titik provinsi</span>
      </div>
    </div>
  );
}
