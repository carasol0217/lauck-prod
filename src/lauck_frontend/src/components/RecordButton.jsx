import React, { useState } from 'react';

const RecordButton = () => {
  const [recording, setRecording] = useState(false);
  const [timer, setTimer] = useState(null);
  const [sending, setSending] = useState(false);

  const startRecording = () => {
    setRecording(true);
    console.log("Recording started...");
    // Initialize actual recording logic
  };

  const stopRecording = () => {
    setRecording(false);
    console.log("Recording stopped...");
    // Stop the recording logic
  };

  const handleHold = () => {
    setTimer(setTimeout(() => {
      setSending(true);
      sendRecording();
    }, 3000)); // After 3 seconds of hold, send the recording
  };

  const cancelHold = () => {
    clearTimeout(timer);
    if (!sending) stopRecording();  // Cancel sending if release before 3 seconds
  };

  const sendRecording = () => {
    console.log("Recording sent to recipient!");
    setSending(false);
  };

  return (
    <button 
      className="record-button"
      onMouseDown={handleHold}
      onMouseUp={cancelHold}
      onTouchStart={handleHold}
      onTouchEnd={cancelHold}
    >
      {recording ? (sending ? "Sending..." : "Recording...") : "Hold to Record"}
    </button>
  );
};

export default RecordButton;
