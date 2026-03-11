export default function LoadingPart() {
  const skeleton = {
    background: "#222",
    borderRadius: 6,
    animation: "pulse 1.5s infinite ease-in-out",
  };

  return (
    <main style={{ padding: 40 }}>
      <style>{`
        @keyframes pulse {
          0% { opacity: 0.5; }
          50% { opacity: 1; }
          100% { opacity: 0.5; }
        }
      `}</style>

      {/* Title skeleton */}
      <div
        style={{
          ...skeleton,
          width: "60%",
          height: 32,
          marginBottom: 20,
        }}
      />

      {/* Image skeleton */}
      <div
        style={{
          ...skeleton,
          width: 300,
          height: 200,
          marginBottom: 20,
          borderRadius: 8,
        }}
      />

      {/* Price skeleton */}
      <div
        style={{
          ...skeleton,
          width: 120,
          height: 20,
          marginBottom: 12,
        }}
      />

      {/* Description skeleton */}
      <div
        style={{
          ...skeleton,
          width: "100%",
          height: 16,
          marginBottom: 8,
        }}
      />

      <div
        style={{
          ...skeleton,
          width: "90%",
          height: 16,
        }}
      />
    </main>
  );
}
