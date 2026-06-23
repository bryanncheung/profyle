import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 192, height: 192 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 192,
          height: 192,
          background: "#F5F3EE",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 40,
        }}
      >
        <svg width="108" height="120" viewBox="0 0 108 120" fill="none">
          <path
            d="M12 8 L12 112 M12 8 L58 8 Q88 8 88 40 Q88 72 58 72 L12 72"
            stroke="#6B3FD0"
            strokeWidth="20"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}
