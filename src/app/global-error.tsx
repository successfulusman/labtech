"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#0f172a",
            color: "#f8fafc",
            fontFamily: "system-ui, sans-serif",
            padding: "24px",
          }}
        >
          <div style={{ textAlign: "center", maxWidth: "480px" }}>
            <h1 style={{ fontSize: "2rem", fontWeight: 700, margin: 0 }}>
              Oops! Something went wrong
            </h1>
            <p style={{ color: "#94a3b8", marginTop: "12px" }}>
              A serious error occurred. Click below to try again.
            </p>
            <button
              onClick={() => reset()}
              style={{
                marginTop: "20px",
                padding: "12px 28px",
                borderRadius: "12px",
                border: "none",
                background: "#2563eb",
                color: "#fff",
                fontSize: "1rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}