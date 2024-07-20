import React, { useState, useRef, useEffect } from 'react';
import { HashRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { Play, Users, Send, AlertCircle, ArrowLeft, StopCircle } from 'lucide-react';

// Base API URL
const BASE_API_URL = 'https://proctorpass-a50034e2cf52.herokuapp.com/';

// Main App component
function Page() {
  const [sessionCode, setSessionCode] = useState(null);
  const [isHost, setIsHost] = useState(false);

  return (
    <Router>
      <div className="font-sans min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600">
        <Routes>
          <Route path="/" element={<StartScreen setSessionCode={setSessionCode} setIsHost={setIsHost} />} />
          <Route 
            path="/join" 
            element={<JoinScreen setSessionCode={setSessionCode} setIsHost={setIsHost} />} 
          />
          <Route 
            path="/session" 
            element={sessionCode ? <SessionScreen sessionCode={sessionCode} isHost={isHost} /> : <Navigate to="/" />} 
          />
          <Route 
            path="/camera" 
            element={sessionCode ? <CameraScreen sessionCode={sessionCode} /> : <Navigate to="/" />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

// BackButton component
function BackButton() {
  const navigate = useNavigate();
  return (
    <button 
      onClick={() => navigate(-1)}
      className="absolute top-4 left-4 p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all duration-300"
    >
      <ArrowLeft size={24} color="white" />
    </button>
  );
}

// StartScreen component
function StartScreen({ setSessionCode, setIsHost }) {
  const navigate = useNavigate();

  const startSession = async () => {
    const response = await fetch(`${BASE_API_URL}/api/start-session`, { method: 'POST' });
    const { code } = await response.json();
    setSessionCode(code);
    setIsHost(true);
    navigate('/session');
  };

  return (
    <div className="flex flex-col items-center gap-8 p-8 bg-white bg-opacity-20 backdrop-blur-lg rounded-xl shadow-lg">
      <h1 className="text-4xl font-bold text-white mb-4">Welcome to the Session App</h1>
      <button 
        className="flex items-center justify-center gap-2 px-6 py-3 text-lg bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        onClick={startSession}
      >
        <Play size={24} />
        Start a New Session
      </button>
      <button 
        className="flex items-center justify-center gap-2 px-6 py-3 text-lg bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        onClick={() => navigate('/join')}
      >
        <Users size={24} />
        Join Existing Session
      </button>
    </div>
  );
}

// JoinScreen component
function JoinScreen({ setSessionCode, setIsHost }) {
  const [inputCode, setInputCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const joinSession = async () => {
    try {
      const response = await fetch(`${BASE_API_URL}/api/connect-session/${inputCode}`);
      if (response.ok) {
        setSessionCode(inputCode);
        setIsHost(false);
        navigate('/camera');
      } else {
        setError('Invalid session code');
      }
    } catch (error) {
      console.error('Error joining session:', error);
      setError('Error joining session. Please try again.');
    }
  };
  return (
    <div className="relative flex flex-col items-center gap-6 p-8 bg-white bg-opacity-20 backdrop-blur-lg rounded-xl shadow-lg">
      <BackButton />
      <h2 className="text-3xl font-bold text-white mb-4">Join a Session</h2>
      <input
        type="text"
        placeholder="Enter session code"
        value={inputCode}
        onChange={(e) => setInputCode(e.target.value)}
        className="px-4 py-2 text-lg bg-white bg-opacity-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button 
        className="flex items-center justify-center gap-2 px-6 py-3 text-lg bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        onClick={joinSession}
      >
        <Send size={24} />
        Join Session
      </button>
      {error && (
        <p className="flex items-center text-red-500">
          <AlertCircle size={20} className="mr-2" />
          {error}
        </p>
      )}
    </div>
  );
}

// SessionScreen component
function SessionScreen({ sessionCode, isHost }) {
  const [response, setResponse] = useState('');
  const [activeTab, setActiveTab] = useState('prompt');
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const prompts = ['answer the question in teh image throughouly work through every step and make sure you do it right', 'answer the question in the picture throughly give your english thinking and translation about the question and then the answer in frenhc at the end', 'give a few sentance responce to this question in simple early french 3 level french', 'answer this logicly in a few short sentances'];

  useEffect(() => {
    const eventSource = new EventSource(`${BASE_API_URL}/api/events/${sessionCode}`);
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'response') {
        setResponse(data.content);
      }
    };
    return () => eventSource.close();
  }, [sessionCode]);

  const handlePrompt = async (prompt) => {
    if (isHost) {
      await fetch(`${BASE_API_URL}/api/prompt/${sessionCode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
    }
  };

  if (!isHost) {
    return <Navigate to="/camera" />;
  }

  return (
    <div className="relative w-full max-w-3xl px-4">
      <BackButton className="absolute top-3 left-3 z-10" />

      <div className="absolute top-3 right-3 font-bold text-white bg-black bg-opacity-50 px-4 py-2 rounded-full">
        Session Code: {sessionCode}
      </div>
      <div className="flex mb-6 mt-16">
        <button
          className={`flex-1 py-2 px-4 ${activeTab === 'prompt' ? 'bg-blue-600' : 'bg-blue-400'} text-white font-bold rounded-l-lg`}
          onClick={() => setActiveTab('prompt')}
        >
          Prompt
        </button>
        <button
          className={`flex-1 py-2 px-4 ${activeTab === 'view' ? 'bg-blue-600' : 'bg-blue-400'} text-white font-bold rounded-r-lg`}
          onClick={() => setActiveTab('view')}
        >
          View
        </button>
      </div>
      {activeTab === 'prompt' && (
        <>
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {prompts.map((prompt) => (
              <button
                key={prompt}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                onClick={() => handlePrompt(prompt)}
              >
                {prompt}
              </button>
            ))}
          </div>
          <textarea
            value={response}
            readOnly
            className="w-full h-64 p-4 bg-white bg-opacity-50 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </>
      )}
      {activeTab === 'view' && (
        <div className="bg-white bg-opacity-50 rounded-lg p-4 h-64 flex items-center justify-center">
          <video ref={videoRef} autoPlay className="w-full max-w-xl rounded-lg shadow-lg mt-16" />
        </div>
      )}
    </div>
  );
}

// CameraScreen component
function CameraScreen({ sessionCode }) {
  const videoRef = useRef(null);
  const [streaming, setStreaming] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    let stream;
    const startCamera = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Media Devices API not supported');
        }
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setStreaming(true);
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
        setError(`Error accessing camera: ${err.message}`);
      }
    };

    startCamera();

    const eventSource = new EventSource(`${BASE_API_URL}/api/events/${sessionCode}`);
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'prompt') {
        setPrompt(data.content);
      }
    };

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      eventSource.close();
    };
  }, [sessionCode]);

  const captureAndSendImage = async () => {
    if (!streaming) {
      console.error('Cannot capture image: camera not streaming');
      return;
    }
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
    const imageDataUrl = canvas.toDataURL('image/jpeg');

    try {
      const response = await fetch(`${BASE_API_URL}/api/upload-image/${sessionCode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageDataUrl }),
      });
      if (!response.ok) {
        throw new Error('Failed to upload image');
      }
    } catch (err) {
      console.error('Error sending image:', err);
      setError(`Error sending image: ${err.message}`);
    }
  };

  const stopStreaming = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      setStreaming(false);
    }
  };

  useEffect(() => {
    if (prompt && streaming) {
      captureAndSendImage();
    }
  }, [prompt]);

  return (
    <div className="relative flex flex-col items-center gap-6">
      <BackButton />
      {error ? (
        <div className="text-red-500 bg-white bg-opacity-75 p-4 rounded-lg mt-16">
          {error}
        </div>
      ) : (
        <>
          <video ref={videoRef} autoPlay className="w-full max-w-xl rounded-lg shadow-lg mt-16" />
          {streaming ? (
            <button
              className="flex items-center justify-center gap-2 px-6 py-3 text-lg bg-gradient-to-r from-red-500 to-red-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              onClick={stopStreaming}
            >
              <StopCircle size={24} />
              Stop Recording
            </button>
          ) : (
            <div className="text-white text-xl mt-4">Camera stopped</div>
          )}
        </>
      )}
      <p className="text-white text-xl">Current Prompt: {prompt || 'Waiting for prompt...'}</p>
    </div>
  );
}

export default Page;