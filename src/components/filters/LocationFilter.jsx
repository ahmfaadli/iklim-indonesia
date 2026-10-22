import { MapPin, X } from 'lucide-react';

export default function LocationFilter({ locations, selected, setSelected, query, setQuery, onToggle }) {
  const filteredLocations = locations.filter((place) => place.name.toLowerCase().includes(query.toLowerCase()) || place.city.toLowerCase().includes(query.toLowerCase()));
  return <section className="panel filter-panel">
    <div className="panel-heading"><div><h3>Wilayah</h3></div></div>
    <div className="search-box"><MapPin size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari provinsi atau kota…" aria-label="Cari provinsi atau kota" /><button onClick={() => setQuery('')} aria-label="Hapus pencarian"><X size={14} /></button></div>
    <div className="filter-actions"><button onClick={() => setSelected(locations.slice(0, 3).map((place) => place.name))}>Pilih 3 lokasi</button><button onClick={() => setSelected([])}>Kosongkan</button></div>
    <div className="province-list">{filteredLocations.map((place) => <label className="province-option" key={place.name}><input type="checkbox" checked={selected.includes(place.name)} onChange={() => onToggle(place.name)} /><span>{place.name}</span><small>{place.city}</small></label>)}{filteredLocations.length === 0 && <p className="empty">Tidak ada wilayah yang cocok.</p>}</div>
    <p className="filter-note">Titik menunjukkan ibu kota provinsi, bukan agregasi seluruh area. Maksimal tiga lokasi dimuat bersamaan agar permintaan API terkendali.</p>
  </section>;
}
