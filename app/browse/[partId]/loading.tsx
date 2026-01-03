export default function LoadingPart() {
  return (
    <main style={{ padding: 40 }}>
      {/* Title skeleton */}
      <div
        style={{
          width: "60%",
          height: 32,
          background: "#222",
          marginBottom: 20,
          borderRadius: 6,
        }}
      />

      {/* Image skeleton */}
      <div
        style={{
          width: 300,
          height: 200,
          background: "#222",
          marginBottom: 20,
          borderRadius: 8,
        }}
      />

      {/* Price skeleton */}
      <div
        style={{
          width: 120,
          height: 20,
          background: "#222",
          marginBottom: 12,
          borderRadius: 4,
        }}
      />

      {/* Description skeleton */}
      <div
        style={{
          width: "100%",
          height: 16,
          background: "#222",
          marginBottom: 8,
          borderRadius: 4,
        }}
      />
      <div
        style={{
          width: "90%",
          height: 16,
          background: "#222",
          borderRadius: 4,
        }}
      />
    </main>
  );
}
