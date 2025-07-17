import React from 'react';
import VideoConsultation from '../components/VideoConsultation';
import './VideoConsultationPage.css';

const VideoConsultationPage = () => {
  return (
    <div className="video-consultation-page">
      <div className="video-consultation-header">
        <h1>Video Consultation</h1>
        <p>Connect with healthcare professionals through secure video calls</p>
      </div>
      <VideoConsultation />
    </div>
  );
};

export default VideoConsultationPage; 