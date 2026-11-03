import { ImageResponse } from "next/og";

export const alt = "Data Quest — le jeu de cartes quotidien sur vos vraies données";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#14302B",
          color: "#F4EEDF",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 90px",
          position: "relative",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 44, fontWeight: 800 }}>
          <div style={{ display: "flex", width: 56, height: 72, background: "#FFF7E8", border: "4px solid #22201C", borderRadius: 12, transform: "rotate(-8deg)" }} />
          Data Quest
        </div>
        <div style={{ display: "flex", flexDirection: "column", marginTop: 40, fontSize: 76, fontWeight: 800, lineHeight: 1.05 }}>
          <span>Vos équipes ouvrent enfin</span>
          <span>leurs dashboards.</span>
          <span style={{ color: "#F7C548" }}>Chaque matin.</span>
        </div>
        <div style={{ display: "flex", marginTop: 36, fontSize: 30, color: "#DCE5DF" }}>
          Le jeu de cartes quotidien sur les vraies données de votre entreprise
        </div>
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 26, background: "#F7C548", display: "flex" }} />
      </div>
    ),
    size,
  );
}
