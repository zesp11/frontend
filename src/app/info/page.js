export default function Info() {
  return (
    <>
      <div
        style={{
          backgroundImage: "url('/info-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -9999,
        }}
      />
      <div>
        <h1>Informacje o projekcie</h1>
      </div>
    </>
  );
}
