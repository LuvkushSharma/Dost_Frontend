import React from "react";

const Oops = () => {
  return (
    <div className="oops-container">
      <video
        src="/videos/oops.mp4"
        autoPlay
        loop
        style={{
          width: "100%", 
          height: "100vh", 
          objectFit: "cover",
          position: "fixed", 
          top: 0,
          left: 0,
        }}
      />
      <div className="oops-content">
        <h1>Oops!</h1>
        <p>Looks like you stumbled upon a glitch in the matrix.</p>
        <p>
          Don't worry, these things happen sometimes. We're working hard to fix
          it as soon as possible.
        </p>
        <button onClick={() => window.history.back()}>Take me back</button>
      </div>
    </div>
  );
};

export default Oops;
