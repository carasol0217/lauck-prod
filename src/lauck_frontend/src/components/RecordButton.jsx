import React, { useState, useRef, useEffect } from 'react';

const AudioRecorder = ({ principal, contact }) => {
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);
  const [stream, setStream] = useState(null);
  const canvasRef = useRef(null);
  const analyserRef = useRef(null);
  const animationRef = useRef(null);
  const audioRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (recording) {
      timerRef.current = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [recording]);

  const startRecording = async () => {
    // Reset the previous recording and timer
    setAudioBlob(null);
    setElapsedTime(0); // Reset the timer for the new recording

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setStream(stream);

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        audioChunks.current = [];
        stopMicrophone();
      };

      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.fftSize = 2048;
      analyserRef.current = analyser;
      visualizeWaveform(analyser);

      mediaRecorder.start();
      setRecording(true); // Start recording and timer
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Microphone access is required to record audio.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
    stopMicrophone();
    cancelAnimationFrame(animationRef.current);
  };

  const stopMicrophone = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (analyserRef.current) {
      analyserRef.current.disconnect();
      analyserRef.current = null;
    }
  };

  const visualizeWaveform = (analyser) => {
    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d');
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;

    const draw = () => {
      analyser.getByteTimeDomainData(dataArray);
      canvasCtx.fillStyle = '#ffffff';  // Background color
      canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = '#db4a2b';  // Set waveform color to match logo

      canvasCtx.beginPath();

      let sliceWidth = WIDTH / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * HEIGHT) / 2;

        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      canvasCtx.lineTo(WIDTH, HEIGHT / 2);
      canvasCtx.stroke();

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();
  };

  const playAudio = () => {
    if (audioBlob) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      audio.play();
    }
  };

  const discardRecording = () => {
    if (audioRef.current) {
      audioRef.current.pause();   // Stop playing the audio
      audioRef.current.currentTime = 0;  // Reset the audio play time
    }
    setAudioBlob(null);
    setIsUploading(false);  // Reset the uploading status
    setElapsedTime(0);  // Reset timer when discarding
    stopMicrophone();
  };

  return (
    <div className="record-container">
      <h2>Audio Recorder</h2>
      <canvas ref={canvasRef} className="waveform-canvas" width="400" height="150"></canvas>
      <div>Recording Time: {recording ? `${elapsedTime}s` : (audioBlob ? `${elapsedTime}s` : '0s')}</div>
      <div className="button-group">
        <button onClick={recording ? stopRecording : startRecording}>
          {recording ? 'Stop Recording' : 'Start Recording'}
        </button>
        <button onClick={playAudio} disabled={!audioBlob}>
          Play Audio
        </button>
        <button onClick={discardRecording} disabled={!audioBlob}>
          Discard Recording
        </button>
        <button className="lauck-send-button" onClick={() => lauckNow()} disabled={!audioBlob || isUploading}>
          {isUploading ? 'Uploading...' : <><strong>Lauck</strong> & Send</>}
        </button>
      </div>
    </div>
  );
};

export default AudioRecorder;