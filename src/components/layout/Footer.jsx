export default function Footer({ lastUpdated }) {
  return (
    <footer
      style={{
        width: "100%",
        boxSizing: "border-box",
        margin: 0,
        padding: "32px 24px",
        backgroundColor: "#000000",
        color: "#a1a1aa",
        textAlign: "center",
        flexShrink: 0,
        display: "block",
      }}
    >
      <p
        style={{
          margin: "0 auto 16px",
          maxWidth: "600px",
          fontSize: "14px",
          lineHeight: 1.7,
        }}
      >
        Visualisasi data iklim Indonesia untuk eksplorasi data,
        bukan sebagai peringatan cuaca resmi.
      </p>

      <div
        className="footer-sources"
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          gap: "8px 16px",
          margin: 0,
          fontSize: "13px",
          lineHeight: 1.6,
        }}
      >
        <span>Data sumber: Open-Meteo Historical API</span>
      </div>
    </footer>
  );
}