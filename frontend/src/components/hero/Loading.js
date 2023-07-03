import React from "react";
import logoSBS from "../../images/logo-sbs.png";

const Loading = () => {
  return (
    <>
      <div className="loading">
        <img src={logoSBS} alt="Logo" className="logo" />
        <div className="dots-container">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      </div>
      <style>
        {`
        body {
          display: flex;
          height: 100vh;
          justify-content: center;
          align-items: center;
          background: rgb(34, 193, 195);
          background: linear-gradient(0deg, rgba(34, 193, 195, 0) 39%, rgba(47, 224, 221, 0.4248074229691877) 100%);
        }
        .loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          animation: fade-in 0.5s ease-in;
        }
        .logo {
          margin-left: -50px;
          width: 400px;
          margin-bottom: 1em;
        }
        .dots-container {
          display: flex;
        }
        .dots-container .dot {
          position: relative;
          width: 1.5em;
          height: 1.5em;
          margin: 0.5em;
          border-radius: 50%;
        }
        .dots-container .dot::before {
          position: absolute;
          content: "";
          width: 100%;
          height: 100%;
          background: inherit;
          border-radius: inherit;
          animation: wave 1.5s ease-out infinite;
        }
        .dots-container .dot:nth-child(1) {
          background: #7ef9ff;
        }
        .dots-container .dot:nth-child(1)::before {
          animation-delay: 0.2s;
        }
        .dots-container .dot:nth-child(2) {
          background: #89cff0;
        }
        .dots-container .dot:nth-child(2)::before {
          animation-delay: 0.4s;
        }
        .dots-container .dot:nth-child(3) {
          background: #4682b4;
        }
        .dots-container .dot:nth-child(3)::before {
          animation-delay: 0.6s;
        }
        .dots-container .dot:nth-child(4) {
          background: #0f52ba;
        }
        .dots-container .dot:nth-child(4)::before {
          animation-delay: 0.8s;
        }
        .dots-container .dot:nth-child(5) {
          background: #000080;
        }
        .dots-container .dot:nth-child(5)::before {
          animation-delay: 1s;
        }
        @keyframes wave {
          50%, 75% {
            transform: scale(2);
          }
          80%, 100% {
            opacity: 0;
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}
      </style>
    </>
  );
};

export default Loading;
