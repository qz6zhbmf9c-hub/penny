import { ImageResponse } from "next/og";

export const alt = "Penny: The minimalist AI personal finance tracker";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", flexDirection: "column",
          justifyContent: "center", padding: 90, color: "white",
          background: "linear-gradient(135deg,#0d0f15 0%,#1e1b4b 60%,#6d28d9 100%)",
        }}
      >
        <div style={{ fontSize: 180, fontWeight: 800, letterSpacing: -6 }}>Penny.</div>
        <div style={{ fontSize: 50, marginTop: 12, opacity: 0.95 }}>The minimalist AI personal finance tracker</div>
        <div style={{ fontSize: 32, marginTop: 28, opacity: 0.75 }}>mypenny.net · Voice Logging · Receipt Scanner · No Subscription</div>
      </div>
    ),
    size
  );
}