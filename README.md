# Explorer Iklim Nusantara

Dashboard React + Vite untuk eksplorasi data historis iklim pada titik ibu kota provinsi Indonesia.

## Instalasi

```bash
npm install
npm run dev
```

Untuk memeriksa build produksi:

```bash
npm run build
```

## Catatan data

- Data historis menggunakan Open-Meteo Archive API untuk periode 2015–2025.
- Peta menggunakan Leaflet dan tile OpenStreetMap.
- Fungsi `fetchBmkgForecast` saat ini memakai prakiraan Open-Meteo sebagai prakiraan pendamping, bukan endpoint resmi BMKG. Jangan menyebutnya data prakiraan BMKG resmi sampai integrasi endpoint BMKG yang valid ditambahkan.
- Koordinat merupakan titik ibu kota provinsi; hasil tidak mewakili rata-rata seluruh wilayah administratif.
