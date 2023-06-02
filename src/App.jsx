import React, { useState, useRef } from "react";
import JsSIP from 'jssip';
import './App.css';

function App() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [callStatus, setCallStatus] = useState("");
  const sessionRef = useRef(null);

  const handleButtonClick = (number) => {
    setPhoneNumber((prevNumber) => prevNumber + number);
  };

  const handleDeleteClick = () => {
    setPhoneNumber((prevNumber) => prevNumber.slice(0, -1));
  };

  const handleCallClick = () => {
    const socket = new JsSIP.WebSocketInterface("wss://gc03-pbx.tel4vn.com:7444");
    const configuration = {
      sockets: [socket],
      uri: "sip:105@2-test1.gcalls.vn:50061",
      password: "test1105",
      session_timers: false,
    };
    const userAgent = new JsSIP.UA(configuration);

    userAgent.start();

    const session = userAgent.call(phoneNumber);
    sessionRef.current = session;
    
    session.on("connecting", () => {
      setCallStatus("Connecting...");
    });

    session.on("connected", () => {
      setCallStatus("Connected");
    });

    session.on("ended", () => {
      setCallStatus("Call ended");
    });

    // Display call ringing
    session.on("progress", () => {
      setCallStatus("Ringing...");
    });

    session.on("failed", () => {
      setCallStatus("Call failed");
    });

    session.on("accepted", () => {
      setCallStatus("Call accepted");
    }
    );

    session.on("confirmed", () => {
      setCallStatus("Call confirmed");
    }
    );

    session.connection.addEventListener("addstream", (e) => {
      const audio = new Audio();
      audio.srcObject = e.stream;
      audio.play();
    }); 
  };

  const handleEndCallClick = () => {
    const session = sessionRef.current;
    if (session) {
      session.terminate();
      setCallStatus("Call ended");
    }
  };
  
  return (
    <>
    <div className="container">
      <div className="App">
        {/* Create Display Input */}
        <div className="display">
          <input
            className="display_input"
            type="text"
            value={phoneNumber}
            readOnly
          />
        </div>

        {/* Create Number Pad */}
        <div className="number-pad">
          <div className="number-pad_row">
            <button
              className="number-pad_button"
              onClick={() => handleButtonClick("1")}
            >
              1
            </button>
            <button
              className="number-pad_button"
              onClick={() => handleButtonClick("2")}
            >
              2
            </button>
            <button
              className="number-pad_button"
              onClick={() => handleButtonClick("3")}
            >
              3
            </button>
          </div>
          <div className="number-pad_row">
            <button
              className="number-pad_button"
              onClick={() => handleButtonClick("4")}
            >
              4
            </button>
            <button
              className="number-pad_button"
              onClick={() => handleButtonClick("5")}
            >
              5
            </button>
            <button
              className="number-pad_button"
              onClick={() => handleButtonClick("6")}
            >
              6
            </button>
          </div>
          <div className="number-pad_row">
            <button
              className="number-pad_button"
              onClick={() => handleButtonClick("7")}
            >
              7
            </button>
            <button
              className="number-pad_button"
              onClick={() => handleButtonClick("8")}
            >
              8
            </button>
            <button
              className="number-pad_button"
              onClick={() => handleButtonClick("9")}
            >
              9
            </button>
          </div>
          <div className="number-pad_row">
            <button
              className="number-pad_button"
              onClick={() => handleButtonClick("*")}
            >
              *
            </button>
            <button
              className="number-pad_button"
              onClick={() => handleButtonClick("0")}
            >
              0
            </button>
            <button
              className="number-pad_button"
              onClick={() => handleButtonClick("#")}
            >
              #
            </button>
          </div>
        </div>

        {/* Create Button Call and Delete */}
        <div className="function">
          <div className="call">
            <button className="call_button" onClick={handleCallClick}>
              Call
            </button>
          </div>
          <div className="delete">
            <button className="delete_button" onClick={handleDeleteClick}>
              Delete
            </button>
          </div>
          <div className="end_call">
            <button className="end_call_button" onClick={handleEndCallClick}>End Call
            </button>
          </div>
        </div>

        {/* Display call status */}
        <div className="status">{callStatus}</div>
      </div>
      </div>
    </>
  );
}

export default App;
