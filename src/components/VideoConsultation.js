import React, { useEffect, useRef, useState } from 'react';
import Peer from 'simple-peer';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import './VideoConsultation.css';

const VideoConsultation = () => {
  const [stream, setStream] = useState(null);
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState('');
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [idToCall, setIdToCall] = useState('');
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState('');
  const [mediaError, setMediaError] = useState('');

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io.connect('http://localhost:5000');
    
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        myVideo.current.srcObject = currentStream;
      })
      .catch((err) => {
        let message = 'Could not access camera or microphone.';
        if (err && err.name === 'NotFoundError') {
          message = 'No camera or microphone detected. Please connect a device and allow browser access.';
        } else if (err && err.name === 'NotAllowedError') {
          message = 'Permission denied. Please allow camera and microphone access in your browser.';
        }
        setMediaError(message);
      });

    socketRef.current.on('me', (id) => {
      setName(id);
    });

    socketRef.current.on('callUser', (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setName(data.name);
      setCallerSignal(data.signal);
    });
  }, []);

  const callUser = (id) => {
    if (!stream) return;
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream
    });

    peer.on('signal', (data) => {
      socketRef.current.emit('callUser', {
        userToCall: id,
        signalData: data,
        from: name,
        name: name
      });
    });

    peer.on('stream', (stream) => {
      userVideo.current.srcObject = stream;
    });

    socketRef.current.on('callAccepted', (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    if (!stream) return;
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream
    });

    peer.on('signal', (data) => {
      socketRef.current.emit('answerCall', { signal: data, to: caller });
    });

    peer.on('stream', (stream) => {
      userVideo.current.srcObject = stream;
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    if (connectionRef.current) connectionRef.current.destroy();
    window.location.reload();
  };

  return (
    <div className="video-consultation">
      {mediaError ? (
        <div className="media-error">
          <h2>Video Consultation Error</h2>
          <p>{mediaError}</p>
        </div>
      ) : (
        <>
          <div className="video-grid">
            <div className="video-container">
              <video playsInline muted ref={myVideo} autoPlay className="video" />
              <div className="video-label">You</div>
            </div>
            {callAccepted && !callEnded && (
              <div className="video-container">
                <video playsInline ref={userVideo} autoPlay className="video" />
                <div className="video-label">Remote User</div>
              </div>
            )}
          </div>

          <div className="controls">
            {stream && (
              <div className="call-controls">
                <input
                  type="text"
                  placeholder="ID to call"
                  value={idToCall}
                  onChange={(e) => setIdToCall(e.target.value)}
                />
                <button onClick={() => callUser(idToCall)}>Call</button>
              </div>
            )}
            
            {receivingCall && !callAccepted && (
              <div className="incoming-call">
                <h3>Incoming call from {caller}</h3>
                <button onClick={answerCall}>Answer</button>
              </div>
            )}
            
            {callAccepted && !callEnded && (
              <button onClick={leaveCall}>End Call</button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default VideoConsultation; 