export default function Contact() {
  return (
    <>
      <div
        style={{
          backgroundImage: "url('/contact-bg.jpg')",
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
        <h1>Kontakt</h1>
      </div>
    </>
  );
}
