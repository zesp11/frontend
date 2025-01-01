export default function About() {
  return (
    <>
        <div
        style={{
          backgroundImage: "url('/about-bg.jpg')",
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
      <div className="wrapper">
        <h1>O nas</h1>
      </div>
    </>
  );
}
