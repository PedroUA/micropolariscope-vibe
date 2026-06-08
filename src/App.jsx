import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import './App.css';

// Pre-defined image options for event creators to select from
const STOCK_IMAGES = [
  { url: '/assets/hardbar_photo.png', name: 'Concerto' },
  { url: '/assets/aee_photo.png', name: 'Cicloturismo' },
  { url: '/assets/tricot_thumb.png', name: 'Tricot' },
];

export default function App() {
  // --- STATE ---
  const [events, setEvents] = useState([
    {
      id: 'event-1',
      title: 'Concerto no Hardbar',
      organizer: 'HardBar',
      image: '/assets/hardbar_thumb.png',
      logo: '/assets/hardbar_avatar.png',
      live: false,
      description: 'Concerto incrível com o artista Marcvs Marçal! Uma noite inesquecível de música ao vivo no melhor bar da zona.',
      detailImage: '/assets/hardbar_photo.png',
      lat: 40.6413,
      lng: -8.6433
    },
    {
      id: 'event-2',
      title: 'Cicloturismo - AEE',
      organizer: 'Agrupamento Escolas de Esgueira',
      image: '/assets/cicloturismo_thumb.png',
      logo: '/assets/aee_avatar.png',
      live: true,
      description: 'Passeio anual de cicloturismo. Venha pedalar connosco e promover a saúde e a mobilidade sustentável!',
      detailImage: '/assets/aee_photo.png',
      lat: 40.6514,
      lng: -8.6291
    },
    {
      id: 'event-3',
      title: 'Quintas com tricot',
      organizer: 'Clube de Tricot de Aveiro',
      image: '/assets/tricot_thumb.png',
      logo: '/assets/profile.svg', // Default profile logo
      live: false,
      description: 'Junte-se a nós todas as quintas-feiras às 18h no café do parque para tricotar, conversar e trocar experiências!',
      detailImage: '/assets/tricot_thumb.png',
      lat: 40.6385,
      lng: -8.6512
    }
  ]);

  const [moments, setMoments] = useState([
    {
      id: 'moment-1',
      eventId: 'event-1',
      authorName: 'HardBar',
      authorAvatar: '/assets/hardbar_avatar.png',
      eventTitle: 'Concerto no HardBar',
      photo: '/assets/hardbar_photo.png',
      title: 'Estou adorar!',
      description: 'Não estava a contar vir ao HardBar e ter um concerto!! Tenho de cá voltar! Adorei o Marcvs Marçal!',
      time: '1 dia atrás',
      likes: 42,
      liked: false,
      isLive: false,
      comments: [
        { id: 1, author: 'Pedro', content: 'Marcvs toca demais! A vibe está excelente.' },
        { id: 2, author: 'Sara', content: 'Que inveja! Devia ter ido com vocês.' }
      ]
    },
    {
      id: 'moment-2',
      eventId: 'event-2',
      authorName: 'Agrupamento Escolas de Esgueira',
      authorAvatar: '/assets/aee_avatar.png',
      eventTitle: 'Cicloturismo - AEE',
      photo: '/assets/aee_photo.png',
      title: 'Excelente adesão!',
      description: 'O grupo de cicloturismo das Escolas de Esgueira já está a caminho! Lindo ver tanta gente unida pelo desporto.',
      time: 'LIVE',
      likes: 89,
      liked: true,
      isLive: true,
      comments: [
        { id: 1, author: 'Professor Ramos', content: 'Incrível ver os nossos alunos a participar!' },
        { id: 2, author: 'Marta', content: 'O tempo está espetacular para pedalar!' }
      ]
    }
  ]);

  const [currentTab, setCurrentTab] = useState('feed'); // 'feed' | 'camera' | 'map'
  const [activeStoryEventId, setActiveStoryEventId] = useState(null);
  const [storyTimeProgress, setStoryTimeProgress] = useState(0);
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [activeCommentsMomentId, setActiveCommentsMomentId] = useState(null);

  // New Event Form State
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventOrg, setNewEventOrg] = useState('');
  const [newEventDesc, setNewEventDesc] = useState('');
  const [newEventIsLive, setNewEventIsLive] = useState(false);
  const [newEventImg, setNewEventImg] = useState(STOCK_IMAGES[0].url);

  // Comment Input State
  const [newCommentText, setNewCommentText] = useState('');

  // Camera State
  const [cameraStream, setCameraStream] = useState(null);
  const [cameraError, setCameraError] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [newPostCaption, setNewPostCaption] = useState('');
  const [newPostEventId, setNewPostEventId] = useState('');

  // UI animations
  const [animateHeartMomentId, setAnimateHeartMomentId] = useState(null);

  // Map Ref
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  // Video Ref
  const videoRef = useRef(null);

  // --- MAP INTEGRATION ---
  useEffect(() => {
    if (currentTab === 'map' && mapContainerRef.current && !mapInstanceRef.current) {
      // Initialize map centered at Aveiro
      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false
      }).setView([40.6425, -8.6430], 14);

      // Add modern clean map tiles (CartoDB Positron is very sleek and fits the UI)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19
      }).addTo(map);

      // Add Zoom Control at bottom right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      mapInstanceRef.current = map;
    }

    // Refresh markers whenever events change or tab opens
    if (currentTab === 'map' && mapInstanceRef.current) {
      const map = mapInstanceRef.current;

      // Clear existing markers
      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];

      // Add markers for all events in state
      events.forEach(evt => {
        // Render custom circular HTML pin that aligns with our theme
        const pinHtml = `
          <div style="
            background: ${evt.live ? 'var(--live-gradient)' : 'var(--primary-gradient)'};
            width: 38px;
            height: 38px;
            border-radius: 12px;
            border: 2px solid white;
            box-shadow: 0 4px 10px rgba(0,0,0,0.25);
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
            animation: ${evt.live ? 'pulse-border 2s infinite' : 'none'};
          ">
            <img src="${evt.image}" style="width:100%; height:100%; object-fit:cover; border-radius:10px;" />
          </div>
        `;

        const customIcon = L.divIcon({
          html: pinHtml,
          className: 'custom-leaflet-marker',
          iconSize: [38, 38],
          iconAnchor: [19, 19],
          popupAnchor: [0, -20]
        });

        // Popup Content
        const popupContent = document.createElement('div');
        popupContent.className = 'map-card-popup';
        popupContent.innerHTML = `
          <img src="${evt.detailImage}" />
          <div class="map-card-popup-title">${evt.title}</div>
          <div class="map-card-popup-org">${evt.organizer}</div>
          ${evt.live ? '<span style="color:#ff1b1b; font-size:10px; font-weight:700;">● AO VIVO</span>' : ''}
          <button style="
            margin-top: 6px;
            padding: 6px 0;
            background: var(--primary-gradient);
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 600;
            cursor: pointer;
            width: 100%;
          ">Ver Momento</button>
        `;

        // Action when button is clicked inside popup
        popupContent.querySelector('button').addEventListener('click', () => {
          setActiveStoryEventId(evt.id);
        });

        const marker = L.marker([evt.lat, evt.lng], { icon: customIcon })
          .bindPopup(popupContent, { maxWidth: 140 })
          .addTo(map);

        markersRef.current.push(marker);
      });
    }

    return () => {
      // Cleanup map instance if tab changes
      if (currentTab !== 'map' && mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [currentTab, events]);

  // --- WEBCAM INTEGRATION ---
  useEffect(() => {
    if (currentTab === 'camera' && !capturedPhoto) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => stopCamera();
  }, [currentTab, capturedPhoto]);

  const startCamera = async () => {
    try {
      setCameraError(false);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn("Webcam access failed or denied: ", err);
      setCameraError(true);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
  };

  // Capture Photo
  const capturePhoto = () => {
    if (videoRef.current && cameraStream) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 640;
      const ctx = canvas.getContext('2d');
      // Mirror the image for self-camera feel
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/png');
      setCapturedPhoto(dataUrl);
      stopCamera();
    } else {
      // Fallback: use a random placeholder stock photo if no webcam is running
      const randomStock = STOCK_IMAGES[Math.floor(Math.random() * STOCK_IMAGES.length)].url;
      setCapturedPhoto(randomStock);
    }
  };

  // Submit Captured Photo as new Feed Moment
  const publishPhotoPost = (e) => {
    e.preventDefault();
    if (!capturedPhoto) return;

    // Resolve matching event title
    const selectedEvent = events.find(ev => ev.id === newPostEventId) || events[0];

    const newMoment = {
      id: `moment-${Date.now()}`,
      eventId: selectedEvent.id,
      authorName: selectedEvent.organizer,
      authorAvatar: selectedEvent.logo,
      eventTitle: selectedEvent.title,
      photo: capturedPhoto,
      title: 'Momento Capturado',
      description: newPostCaption || 'Registado agora mesmo durante o evento!',
      time: selectedEvent.live ? 'LIVE' : 'Agora mesmo',
      likes: 0,
      liked: false,
      isLive: selectedEvent.live,
      comments: []
    };

    setMoments([newMoment, ...moments]);
    setCapturedPhoto(null);
    setNewPostCaption('');
    setCurrentTab('feed');
  };

  // --- STORY TIMERS ---
  useEffect(() => {
    let timer;
    if (activeStoryEventId) {
      setStoryTimeProgress(0);
      timer = setInterval(() => {
        setStoryTimeProgress(prev => {
          if (prev >= 100) {
            // Move to next story, or close
            const currentIndex = events.findIndex(e => e.id === activeStoryEventId);
            if (currentIndex < events.length - 1) {
              setActiveStoryEventId(events[currentIndex + 1].id);
              return 0;
            } else {
              // End of stories
              setActiveStoryEventId(null);
              clearInterval(timer);
              return 0;
            }
          }
          return prev + 2; // Fill up bar gradually (around 5 seconds)
        });
      }, 100);
    } else {
      setStoryTimeProgress(0);
    }

    return () => clearInterval(timer);
  }, [activeStoryEventId]);

  // Navigate story manually
  const navigateStory = (direction) => {
    const currentIndex = events.findIndex(e => e.id === activeStoryEventId);
    if (direction === 'next') {
      if (currentIndex < events.length - 1) {
        setActiveStoryEventId(events[currentIndex + 1].id);
      } else {
        setActiveStoryEventId(null);
      }
    } else if (direction === 'prev') {
      if (currentIndex > 0) {
        setActiveStoryEventId(events[currentIndex - 1].id);
      } else {
        // Restart current story
        setStoryTimeProgress(0);
      }
    }
  };

  // --- FORM ACTIONS ---
  const handleCreateEvent = (e) => {
    e.preventDefault();
    if (!newEventTitle.trim() || !newEventOrg.trim()) return;

    // Generate random coordinates in Aveiro area
    const randomLat = 40.635 + Math.random() * 0.02;
    const randomLng = -8.66 + Math.random() * 0.025;

    const newEvt = {
      id: `event-${Date.now()}`,
      title: newEventTitle,
      organizer: newEventOrg,
      image: newEventImg,
      logo: '/assets/profile.svg',
      live: newEventIsLive,
      description: newEventDesc || 'Novo evento adicionado à comunidade! Junta-te a nós e cria momentos.',
      detailImage: newEventImg,
      lat: randomLat,
      lng: randomLng
    };

    setEvents([...events, newEvt]);

    // Reset Form
    setNewEventTitle('');
    setNewEventOrg('');
    setNewEventDesc('');
    setNewEventIsLive(false);
    setIsCreatingEvent(false);

    // Scroll to new event
    setTimeout(() => {
      const scrollBar = document.querySelector('.eventos-scroll-bar');
      if (scrollBar) {
        scrollBar.scrollLeft = scrollBar.scrollWidth;
      }
    }, 100);
  };

  // Double tap moment for Heart animation
  let lastTap = null;
  const handlePhotoTap = (momentId) => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    if (lastTap && (now - lastTap) < DOUBLE_PRESS_DELAY) {
      // It's a double tap!
      likeMoment(momentId, true);
    }
    lastTap = now;
  };

  const likeMoment = (momentId, forceLike = false) => {
    setMoments(prevMoments =>
      prevMoments.map(m => {
        if (m.id === momentId) {
          const newLikedState = forceLike ? true : !m.liked;
          // Only increment/decrement if state changed
          let newLikes = m.likes;
          if (newLikedState && !m.liked) {
            newLikes += 1;
            // Trigger heart animation
            setAnimateHeartMomentId(momentId);
            setTimeout(() => setAnimateHeartMomentId(null), 800);
          } else if (!newLikedState && m.liked) {
            newLikes -= 1;
          }
          return { ...m, liked: newLikedState, likes: newLikes };
        }
        return m;
      })
    );
  };

  // Add comment
  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    setMoments(prevMoments =>
      prevMoments.map(m => {
        if (m.id === activeCommentsMomentId) {
          return {
            ...m,
            comments: [
              ...m.comments,
              { id: Date.now(), author: 'Eu', content: newCommentText }
            ]
          };
        }
        return m;
      })
    );
    setNewCommentText('');
  };

  // Get active story details
  const activeStoryEvent = events.find(e => e.id === activeStoryEventId);
  const activeCommentsMoment = moments.find(m => m.id === activeCommentsMomentId);

  // Default event selection in Camera tab
  useEffect(() => {
    if (events.length > 0 && !newPostEventId) {
      setNewPostEventId(events[0].id);
    }
  }, [events, newPostEventId]);

  return (
    <div className="phone-shell">
      {/* Speaker & Sensor Bezel Notch */}
      <div className="phone-notch"></div>

      <div className="app-viewport">
        {/* --- MAIN HEADER --- */}
        {currentTab === 'feed' && (
          <header className="brand-header">
            <div className="brand-logo-container">
              <img src="/assets/logo.svg" className="brand-logo-icon" alt="microPolariscope Logo" />
              <h1 className="brand-logo-text">
                <span className="light">micro</span>
                <span className="bold">polariscope</span>
              </h1>
            </div>
          </header>
        )}

        {/* --- SCREEN CONTENT AREA --- */}
        <main className="screen-content">
          
          {/* TAB 1: MOMENTS FEED */}
          {currentTab === 'feed' && (
            <>
              {/* Eventos Horizontal Scroll Section */}
              <section className="eventos-section">
                <h2 className="eventos-title">Eventos</h2>
                <div className="eventos-scroll-bar">
                  {/* Plus card - "Criar Evento" */}
                  <div className="event-story-item" onClick={() => setIsCreatingEvent(true)}>
                    <div className="event-card-frame">
                      <button className="create-event-btn" aria-label="Criar Evento">
                        <img src="/assets/plus.svg" alt="Plus Icon" />
                      </button>
                    </div>
                    <span className="event-story-caption">Criar Evento</span>
                  </div>

                  {/* Dynamic Event list */}
                  {events.map(evt => (
                    <div key={evt.id} className="event-story-item" onClick={() => setActiveStoryEventId(evt.id)}>
                      <div className={`event-card-frame ${evt.live ? 'live-event' : 'active-event'}`}>
                        <div className="event-card-image-container">
                          <img src={evt.image} alt={evt.title} />
                        </div>
                      </div>
                      <span className="event-story-caption">{evt.title}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Feed of Moments */}
              <section className="moments-feed">
                {moments.map(m => (
                  <article key={m.id} className="moment-card">
                    {/* User profile row */}
                    <div className="moment-author-bar">
                      <img src={m.authorAvatar} className="moment-author-avatar" alt={m.authorName} />
                      <div className="moment-author-info">
                        <span className="moment-author-name">{m.authorName}</span>
                        <div className="moment-event-tag">
                          {m.eventTitle}
                          {m.isLive && <span className="live">(LIVE)</span>}
                        </div>
                      </div>
                    </div>

                    {/* Main image content with overlay details */}
                    <div 
                      className="moment-image-container"
                      onClick={() => handlePhotoTap(m.id)}
                    >
                      <img src={m.photo} className="moment-main-photo" alt={m.title} />
                      
                      {/* Gradient Info Box */}
                      <div className="moment-image-gradient">
                        <h3 className="moment-photo-title">{m.title}</h3>
                        <p className="moment-photo-description">{m.description}</p>
                        <time className="moment-photo-time">{m.time}</time>
                      </div>

                      {/* Floating Pop Heart Animation */}
                      <span className={`double-tap-heart ${animateHeartMomentId === m.id ? 'animate' : ''}`}>
                        <svg width="60" height="60" viewBox="0 0 24 24" fill="#ff1b1b">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                      </span>
                    </div>

                    {/* Actions: Likes and Comments */}
                    <div className="moment-actions">
                      <button 
                        className={`moment-action-btn ${m.liked ? 'liked' : ''}`}
                        onClick={() => likeMoment(m.id)}
                      >
                        <svg viewBox="0 0 24 24">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                        <span>{m.likes} Likes</span>
                      </button>

                      <button 
                        className="moment-action-btn"
                        onClick={() => setActiveCommentsMomentId(m.id)}
                      >
                        <svg viewBox="0 0 24 24">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                        </svg>
                        <span>{m.comments.length} Comentários</span>
                      </button>
                    </div>
                  </article>
                ))}
              </section>
            </>
          )}

          {/* TAB 2: CAMERA CAPTURE */}
          {currentTab === 'camera' && (
            <div className="camera-screen-container">
              {!capturedPhoto ? (
                // Camera viewfinder
                <div className="camera-preview">
                  {!cameraError ? (
                    <video ref={videoRef} className="camera-video-feed" autoPlay playsInline muted></video>
                  ) : (
                    <div className="camera-placeholder-ui">
                      <span className="camera-placeholder-icon">📸</span>
                      <p>A câmara não está disponível ou a permissão foi negada.</p>
                      <button className="camera-placeholder-btn" onClick={capturePhoto}>Simular Foto</button>
                    </div>
                  )}
                </div>
              ) : (
                // Captured preview screen
                <div className="camera-preview-captured">
                  <div className="camera-captured-image-container">
                    <img src={capturedPhoto} className="camera-captured-image" alt="Captura" />
                  </div>
                  <form onSubmit={publishPhotoPost} className="camera-captured-form">
                    <div className="form-group">
                      <label className="form-label">Pertence a qual Evento?</label>
                      <select 
                        className="form-input"
                        value={newPostEventId}
                        onChange={(e) => setNewPostEventId(e.target.value)}
                      >
                        {events.map(ev => (
                          <option key={ev.id} value={ev.id}>{ev.title}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Legenda do Momento</label>
                      <input 
                        type="text" 
                        placeholder="Escreve uma legenda..."
                        className="form-input"
                        value={newPostCaption}
                        onChange={(e) => setNewPostCaption(e.target.value)}
                        required
                      />
                    </div>
                    <div className="camera-captured-btn-row">
                      <button 
                        type="button" 
                        className="camera-btn-secondary" 
                        onClick={() => {
                          setCapturedPhoto(null);
                          startCamera();
                        }}
                      >
                        Repetir
                      </button>
                      <button type="submit" className="submit-btn" style={{flex: 2, marginTop: 0}}>
                        Publicar no Feed
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Camera Shutter Panel */}
              {!capturedPhoto && (
                <div className="camera-bottom-panel">
                  <div className="camera-shutter-container">
                    <div className="camera-shutter-outer" onClick={capturePhoto}>
                      <div className="camera-shutter-inner"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: LOCAL EVENT MAP */}
          {currentTab === 'map' && (
            <div className="map-screen-container">
              <div id="map" ref={mapContainerRef} className="leaflet-map-div"></div>
            </div>
          )}

        </main>

        {/* --- FLOATING BOTTOM NAVBAR --- */}
        <nav className="navbar-floating-capsule">
          <button 
            className={`navbar-item ${currentTab === 'feed' ? 'active' : ''}`}
            onClick={() => setCurrentTab('feed')}
            aria-label="Moments Feed"
          >
            <img src="/assets/profile.svg" alt="Profile" />
          </button>
          
          <button 
            className={`navbar-item ${currentTab === 'camera' ? 'active' : ''}`}
            onClick={() => {
              setCapturedPhoto(null);
              setCurrentTab('camera');
            }}
            aria-label="Capture Moment"
          >
            <img src="/assets/camera.svg" alt="Camera" />
          </button>
          
          <button 
            className={`navbar-item ${currentTab === 'map' ? 'active' : ''}`}
            onClick={() => setCurrentTab('map')}
            aria-label="Event Map"
          >
            <img src="/assets/map.svg" alt="Map" />
          </button>
        </nav>

        {/* --- STORY PLAYER OVERLAY (Instagram-style) --- */}
        {activeStoryEventId && activeStoryEvent && (
          <div className="story-player-overlay">
            {/* Tap Navigation */}
            <div className="story-tap-navigation">
              <div className="story-tap-left" onClick={() => navigateStory('prev')}></div>
              <div className="story-tap-right" onClick={() => navigateStory('next')}></div>
            </div>

            {/* Header with bars and metadata */}
            <div className="story-player-header">
              <div className="story-progress-bar-container">
                {events.map((evt, idx) => {
                  const currentActiveIndex = events.findIndex(e => e.id === activeStoryEventId);
                  let fillClass = '';
                  let fillStyle = {};

                  if (idx < currentActiveIndex) {
                    fillClass = 'completed';
                  } else if (idx === currentActiveIndex) {
                    fillClass = 'active';
                    fillStyle = { width: `${storyTimeProgress}%` };
                  }

                  return (
                    <div key={evt.id} className="story-progress-bar-bg">
                      <div className={`story-progress-bar-fill ${fillClass}`} style={fillStyle}></div>
                    </div>
                  );
                })}
              </div>

              <div className="story-player-meta">
                <div className="story-player-author">
                  <img src={activeStoryEvent.logo} className="story-player-avatar" alt="Avatar" />
                  <div className="story-player-info">
                    <div className="story-player-name">{activeStoryEvent.organizer}</div>
                    <div className="story-player-subtitle">
                      {activeStoryEvent.title} {activeStoryEvent.live && <span style={{color:'#ff3b30', fontWeight:'bold'}}>(LIVE)</span>}
                    </div>
                  </div>
                </div>
                <button className="story-player-close" onClick={() => setActiveStoryEventId(null)}>×</button>
              </div>
            </div>

            {/* Media Content */}
            <div className="story-player-content">
              <img src={activeStoryEvent.detailImage} className="story-player-image" alt="Story content" />
            </div>

            {/* Card Overlay info */}
            <div className="story-player-info-card">
              <h2 className="story-player-title">{activeStoryEvent.title}</h2>
              <p className="story-player-description">{activeStoryEvent.description}</p>
            </div>
          </div>
        )}

        {/* --- BOTTOM SHEET: CREATE EVENT --- */}
        {isCreatingEvent && (
          <div className="bottom-sheet-overlay" onClick={() => setIsCreatingEvent(false)}>
            <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
              <div className="bottom-sheet-drag-handle"></div>
              
              <div className="bottom-sheet-header">
                <h3 className="bottom-sheet-title">Criar Novo Evento</h3>
                <button className="bottom-sheet-close" onClick={() => setIsCreatingEvent(false)}>×</button>
              </div>

              <form onSubmit={handleCreateEvent}>
                <div className="form-group">
                  <label className="form-label">Nome do Evento</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Concerto acústico..." 
                    className="form-input"
                    value={newEventTitle}
                    onChange={(e) => setNewEventTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Organizador</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Associação de Estudantes..." 
                    className="form-input"
                    value={newEventOrg}
                    onChange={(e) => setNewEventOrg(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Descrição do Evento</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Junte-se a nós..." 
                    className="form-input"
                    value={newEventDesc}
                    onChange={(e) => setNewEventDesc(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Escolhe a Imagem de Capa</label>
                  <div className="image-selector-row">
                    {STOCK_IMAGES.map((img, idx) => (
                      <div 
                        key={idx} 
                        className={`image-selector-option ${newEventImg === img.url ? 'selected' : ''}`}
                        onClick={() => setNewEventImg(img.url)}
                      >
                        <img src={img.url} alt={img.name} />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="form-group form-toggle-container">
                  <span className="form-label" style={{margin: 0}}>Iniciar o evento em DIRECTO (LIVE)?</span>
                  <input 
                    type="checkbox" 
                    className="form-toggle"
                    checked={newEventIsLive}
                    onChange={(e) => setNewEventIsLive(e.target.checked)}
                  />
                </div>

                <button type="submit" className="submit-btn">Adicionar Evento</button>
              </form>
            </div>
          </div>
        )}

        {/* --- BOTTOM SHEET: COMMENTS SECTION --- */}
        {activeCommentsMomentId && activeCommentsMoment && (
          <div className="bottom-sheet-overlay" onClick={() => setActiveCommentsMomentId(null)}>
            <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
              <div className="bottom-sheet-drag-handle"></div>
              
              <div className="bottom-sheet-header">
                <h3 className="bottom-sheet-title">Comentários</h3>
                <button className="bottom-sheet-close" onClick={() => setActiveCommentsMomentId(null)}>×</button>
              </div>

              {/* List comments */}
              <div className="comments-list">
                {activeCommentsMoment.comments.length === 0 ? (
                  <p style={{color: 'var(--text-muted)', fontSize: '13px', textAlign: 'center', padding: '16px 0'}}>
                    Ainda não há comentários. Sê o primeiro a comentar!
                  </p>
                ) : (
                  activeCommentsMoment.comments.map(c => (
                    <div key={c.id} className="comment-item">
                      <img src="/assets/profile.svg" className="comment-avatar" alt="Avatar" />
                      <div className="comment-details">
                        <div className="comment-author-name-sub">{c.author}</div>
                        <div className="comment-content">{c.content}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Add comment form */}
              <form onSubmit={handleAddComment} className="comment-input-row">
                <input 
                  type="text" 
                  placeholder="Escreve um comentário..."
                  className="comment-input"
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  required
                />
                <button type="submit" className="comment-send-btn">Enviar</button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
