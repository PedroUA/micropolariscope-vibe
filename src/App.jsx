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
      lng: -8.6433,
      date: 'Hoje, 21:30 - 02:00',
      subtitle: 'Noites animadas com música ao vivo e muitos hambúrgueres.',
      organizerLabel: 'HardBar Organização',
      organizerLogo: '/assets/hardbar_avatar.png',
      banner: '/assets/hardbar_photo.png'
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
      lng: -8.6291,
      date: 'Domingo, 09:00 - 13:00',
      subtitle: 'Passeio anual de cicloturismo de Esgueira. Traz a tua bicicleta!',
      organizerLabel: 'AEE Organização',
      organizerLogo: '/assets/aee_avatar.png',
      banner: '/assets/aee_photo.png'
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
      lng: -8.6512,
      date: 'Quinta-feira, 18:00 - 20:00',
      subtitle: 'Junta-te a nós todas as quintas-feiras às 18h no café do parque.',
      organizerLabel: 'Tricot Aveiro Organização',
      organizerLogo: '/assets/profile.svg',
      banner: '/assets/tricot_thumb.png'
    },
    {
      id: 'event-4',
      title: 'Workshop de Ovos Moles',
      organizer: 'Oficina do Doce',
      image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=150&auto=format&fit=crop&q=60',
      logo: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=80&auto=format&fit=crop&q=60',
      live: false,
      description: 'Vem aprender a fazer o doce mais tradicional de Aveiro! Uma experiência prática onde crias os teus próprios Ovos Moles em moldes clássicos.',
      detailImage: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
      lat: 40.6445,
      lng: -8.6492,
      date: 'Sábado, 15:00 - 17:30',
      subtitle: 'Aprende o segredo da receita conventual de Aveiro nesta oficina interativa.',
      organizerLabel: 'Oficina do Doce Aveiro',
      organizerLogo: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=80&auto=format&fit=crop&q=60',
      banner: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'event-5',
      title: 'Sunset Surf Session',
      organizer: 'Barra Surf Club',
      image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=150&auto=format&fit=crop&q=60',
      logo: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=80&auto=format&fit=crop&q=60',
      live: true,
      description: 'Sessão de surf ao fim da tarde na Praia da Barra. Ondas excelentes e convívio garantido no final do dia com um sunset acústico.',
      detailImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
      lat: 40.6420,
      lng: -8.7480,
      date: 'Hoje, 17:30 - 20:30',
      subtitle: 'Aproveita o fim de tarde na praia com as melhores ondas e boa música.',
      organizerLabel: 'Barra Surf School',
      organizerLogo: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=80&auto=format&fit=crop&q=60',
      banner: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'event-6',
      title: 'Jazz no Parque',
      organizer: 'Aveiro Jazz Associativo',
      image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=150&auto=format&fit=crop&q=60',
      logo: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=80&auto=format&fit=crop&q=60',
      live: false,
      description: 'Um concerto ao ar livre sob a sombra das árvores do parque mais bonito de Aveiro. Traz a tua manta de piquenique e desfruta de excelente música.',
      detailImage: 'https://images.unsplash.com/photo-1486591978090-58e619d37fe7?w=600&auto=format&fit=crop&q=80',
      lat: 40.6368,
      lng: -8.6475,
      date: 'Domingo, 16:00 - 19:00',
      subtitle: 'Música ao vivo e piquenique no parque da cidade. Entrada livre.',
      organizerLabel: 'Aveiro Jazz Organização',
      organizerLogo: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=80&auto=format&fit=crop&q=60',
      banner: 'https://images.unsplash.com/photo-1486591978090-58e619d37fe7?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'event-7',
      title: 'Mercado Criativo de Aveiro',
      organizer: 'Leme Criativo',
      image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=150&auto=format&fit=crop&q=60',
      logo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=60',
      live: false,
      description: 'Mercado de design, ilustrações, cerâmica e artesanato urbano. Vem apoiar os artistas locais e encontrar peças únicas feitas à mão.',
      detailImage: 'https://images.unsplash.com/photo-1531058020387-3be344559be6?w=600&auto=format&fit=crop&q=80',
      lat: 40.6439,
      lng: -8.6428,
      date: 'Sábado e Domingo, 10:00 - 19:00',
      subtitle: 'Edição especial de verão na Praça da República. Artesanato local e design.',
      organizerLabel: 'Coletivo Leme Criativo',
      organizerLogo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=60',
      banner: 'https://images.unsplash.com/photo-1531058020387-3be344559be6?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'event-8',
      title: 'Torneio de Padel Ria',
      organizer: 'Aveiro Padel Club',
      image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=150&auto=format&fit=crop&q=60',
      logo: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=80&auto=format&fit=crop&q=60',
      live: true,
      description: 'Fase final do torneio de Padel no clube da Ria. Vem ver as melhores duplas em campo e desfrutar do ambiente festivo com street food.',
      detailImage: 'https://images.unsplash.com/photo-1545809074-59472b3f5ecc?w=600&auto=format&fit=crop&q=80',
      lat: 40.6505,
      lng: -8.6350,
      date: 'Hoje, 09:00 - 18:00',
      subtitle: 'Grandes jogos de Padel, bar aberto e foodtrucks ao longo do dia.',
      organizerLabel: 'Direção do Aveiro Padel Club',
      organizerLogo: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=80&auto=format&fit=crop&q=60',
      banner: 'https://images.unsplash.com/photo-1545809074-59472b3f5ecc?w=600&auto=format&fit=crop&q=80'
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
    },
    {
      id: 'moment-ev4-1',
      eventId: 'event-4',
      authorName: 'Maria Antónia',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=60',
      eventTitle: 'Workshop de Ovos Moles',
      location: 'Oficina do Doce, Aveiro',
      photo: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
      title: 'A minha primeira hóstia!',
      description: 'Consegui moldar a forma de concha direitinha! É muito mais difícil do que parece mas a formadora é super simpática.',
      time: '2 horas atrás',
      likes: 18,
      liked: false,
      isLive: false,
      comments: []
    },
    {
      id: 'moment-ev4-2',
      eventId: 'event-4',
      authorName: 'Carlos Santos',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=60',
      eventTitle: 'Workshop de Ovos Moles',
      location: 'Oficina do Doce, Aveiro',
      photo: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop&q=80',
      title: 'Deliciosos!',
      description: 'O recheio de gema de ovo está no ponto. Saem quentinhos e prontos a comer.',
      time: '1 hora atrás',
      likes: 25,
      liked: false,
      isLive: false,
      comments: [
        { id: 1, author: 'Rita', content: 'Que aspeto maravilhoso!' }
      ]
    },
    {
      id: 'moment-ev5-1',
      eventId: 'event-5',
      authorName: 'João Silva',
      authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=60',
      eventTitle: 'Sunset Surf Session',
      location: 'Praia da Barra, Ilhavo',
      photo: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
      title: 'Sunset incrível na Barra',
      description: 'A água está ótima e o céu está cor-de-laranja. Melhor sessão de surf da semana!',
      time: 'LIVE',
      likes: 57,
      liked: true,
      isLive: true,
      comments: [
        { id: 1, author: 'SurfAveiro', content: 'Grande onda, João!' }
      ]
    },
    {
      id: 'moment-ev5-2',
      eventId: 'event-5',
      authorName: 'Ana Costa',
      authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&auto=format&fit=crop&q=60',
      eventTitle: 'Sunset Surf Session',
      location: 'Praia da Barra',
      photo: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=600&auto=format&fit=crop&q=80',
      title: 'Espetáculo de cores',
      description: 'A acompanhar a malta do surf a partir do areal. Que vibe brutal no sunset acústico.',
      time: 'LIVE',
      likes: 39,
      liked: false,
      isLive: true,
      comments: []
    },
    {
      id: 'moment-ev6-1',
      eventId: 'event-6',
      authorName: 'Ricardo Jazz',
      authorAvatar: 'https://images.unsplash.com/photo-1500048993953-d23a436266cf?w=80&auto=format&fit=crop&q=60',
      eventTitle: 'Jazz no Parque',
      location: 'Parque Infante D. Pedro',
      photo: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&auto=format&fit=crop&q=80',
      title: 'Saxofone ao pôr do sol',
      description: 'O trio de jazz convidado é fantástico. O som do saxofone no meio do bosque cria uma atmosfera mágica.',
      time: '3 dias atrás',
      likes: 46,
      liked: false,
      isLive: false,
      comments: [
        { id: 1, author: 'Luísa', content: 'Foi maravilhoso! Estava lá também.' }
      ]
    },
    {
      id: 'moment-ev6-2',
      eventId: 'event-6',
      authorName: 'Beatriz Ramos',
      authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&auto=format&fit=crop&q=60',
      eventTitle: 'Jazz no Parque',
      location: 'Parque Infante D. Pedro',
      photo: 'https://images.unsplash.com/photo-1486591978090-58e619d37fe7?w=600&auto=format&fit=crop&q=80',
      title: 'Tarde perfeita',
      description: 'Piquenique com jazz de fundo. Aveiro no seu melhor nos dias de calor.',
      time: '3 dias atrás',
      likes: 31,
      liked: false,
      isLive: false,
      comments: []
    },
    {
      id: 'moment-ev7-1',
      eventId: 'event-7',
      authorName: 'Diana Artes',
      authorAvatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=80&auto=format&fit=crop&q=60',
      eventTitle: 'Mercado Criativo de Aveiro',
      location: 'Praça da República, Aveiro',
      photo: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80',
      title: 'Bancas cheias de cor',
      description: 'Tanta cerâmica linda e ilustrações originais. Impossível vir aqui e não comprar nada!',
      time: '2 dias atrás',
      likes: 52,
      liked: false,
      isLive: false,
      comments: [
        { id: 1, author: 'Sofia', content: 'Comprei uns brincos fantásticos lá hoje!' }
      ]
    },
    {
      id: 'moment-ev7-2',
      eventId: 'event-7',
      authorName: 'Rita Mendes',
      authorAvatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=80&auto=format&fit=crop&q=60',
      eventTitle: 'Mercado Criativo de Aveiro',
      location: 'Praça da República',
      photo: 'https://images.unsplash.com/photo-1531058020387-3be344559be6?w=600&auto=format&fit=crop&q=80',
      title: 'Apoiar o comércio local',
      description: 'Muito bom ver a Praça da República cheia de vida e de jovens criadores.',
      time: '2 dias atrás',
      likes: 28,
      liked: false,
      isLive: false,
      comments: []
    },
    {
      id: 'moment-ev8-1',
      eventId: 'event-8',
      authorName: 'Hugo Silva',
      authorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&auto=format&fit=crop&q=60',
      eventTitle: 'Torneio de Padel Ria',
      location: 'Aveiro Padel Club',
      photo: 'https://images.unsplash.com/photo-1545809074-59472b3f5ecc?w=600&auto=format&fit=crop&q=80',
      title: 'Que ponto incrível!',
      description: 'A final masculina está ao rubro. A disputar cada bola como se fosse a última.',
      time: 'LIVE',
      likes: 68,
      liked: false,
      isLive: true,
      comments: [
        { id: 1, author: 'PadelLover', content: 'Estão a jogar imenso!' }
      ]
    },
    {
      id: 'moment-ev8-2',
      eventId: 'event-8',
      authorName: 'Pedro Santos',
      authorAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&auto=format&fit=crop&q=60',
      eventTitle: 'Torneio de Padel Ria',
      location: 'Aveiro Padel Club',
      photo: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=600&auto=format&fit=crop&q=80',
      title: 'Street Food e Padel',
      description: 'Excelente ambiente nas bancas com os foodtrucks. Domingo bem passado.',
      time: 'LIVE',
      likes: 44,
      liked: false,
      isLive: true,
      comments: []
    }
  ]);

  const [currentTab, setCurrentTab] = useState('feed'); // 'feed' | 'camera' | 'map'
  const [activeStoryEventId, setActiveStoryEventId] = useState(null);
  const [viewingEventId, setViewingEventId] = useState(null);
  const [expandedMomentId, setExpandedMomentId] = useState(null);
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
  const [newPostLocation, setNewPostLocation] = useState('');
  const [isEventDropdownOpen, setIsEventDropdownOpen] = useState(false);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [eventSearchQuery, setEventSearchQuery] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [postTag1, setPostTag1] = useState('');
  const [postTag2, setPostTag2] = useState('');
  const [postTag3, setPostTag3] = useState('');
  const [postDescription, setPostDescription] = useState('');
  const [isBottomSheetCollapsed, setIsBottomSheetCollapsed] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [drafts, setDrafts] = useState([]);

  // UI animations
  const [animateHeartMomentId, setAnimateHeartMomentId] = useState(null);

  // Map Ref
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  // Video Ref
  const videoRef = useRef(null);

  // File Input Ref for gallery selection
  const fileInputRef = useRef(null);

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
          setViewingEventId(evt.id);
          setCurrentTab('feed');
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

  // Handle event selection and location linkage
  const handleSelectEvent = (eventId) => {
    setNewPostEventId(eventId);
    const selectedEvent = events.find(ev => ev.id === eventId);
    if (selectedEvent) {
      // Auto-fill location metadata to the event's location
      let locName = 'Aveiro, Portugal';
      if (selectedEvent.id === 'event-1') locName = 'HardBar, Aveiro';
      else if (selectedEvent.id === 'event-2') locName = 'Esgueira, Aveiro';
      else if (selectedEvent.id === 'event-3') locName = 'Café do Parque, Aveiro';
      else locName = selectedEvent.title + ', Aveiro';
      
      setNewPostLocation(locName);
    }
    setIsEventDropdownOpen(false);
    setEventSearchQuery('');
  };

  // PolarAI simulation
  const handleAiAutofill = () => {
    setIsAiLoading(true);
    setTimeout(() => {
      setIsAiLoading(false);
      if (newPostEventId === 'event-1') {
        setPostTitle('Estou a adorar!');
        setPostTag1('Concerto');
        setPostTag2('Música');
        setPostTag3('Hardbar');
        setPostDescription('Não estava a contar vir ao HardBar e ter um concerto!! Tenho de cá voltar! Adorei o Marcvs Marçal!');
      } else if (newPostEventId === 'event-2') {
        setPostTitle('Excelente pedalada!');
        setPostTag1('Desporto');
        setPostTag2('AEE');
        setPostTag3('Cicloturismo');
        setPostDescription('Grande adesão no cicloturismo de Esgueira! A energia do grupo está incrível.');
      } else if (newPostEventId === 'event-3') {
        setPostTitle('Tricot e Amigos');
        setPostTag1('Tricot');
        setPostTag2('Convívio');
        setPostTag3('Aveiro');
        setPostDescription('Mais uma quinta-feira fantástica de tricot e conversa animada no café do parque.');
      } else {
        const customEvent = events.find(ev => ev.id === newPostEventId);
        const titleName = customEvent ? customEvent.title : 'Evento';
        setPostTitle(`Vibe no ${titleName}!`);
        setPostTag1('Polariscope');
        setPostTag2('Vibe');
        setPostTag3('Momento');
        setPostDescription(`A aproveitar o momento e a registar tudo para a comunidade!`);
      }
    }, 1000);
  };

  // Save Post as Draft
  const handleSaveDraft = () => {
    if (!newPostEventId) {
      alert('Por favor, seleciona um evento antes de guardar o rascunho.');
      return;
    }

    const selectedEvent = events.find(ev => ev.id === newPostEventId) || events[0];

    const newDraft = {
      id: `draft-${Date.now()}`,
      eventId: selectedEvent.id,
      eventTitle: selectedEvent.title,
      photo: capturedPhoto,
      title: postTitle || 'Rascunho sem título',
      location: newPostLocation,
      tags: [postTag1, postTag2, postTag3].filter(Boolean),
      description: postDescription,
      time: new Date().toLocaleTimeString(),
    };

    setDrafts([...drafts, newDraft]);
    alert(`Rascunho "${newDraft.title}" guardado com sucesso!`);
    
    // Reset camera state
    setCapturedPhoto(null);
    setPostTitle('');
    setPostTag1('');
    setPostTag2('');
    setPostTag3('');
    setPostDescription('');
    setIsBottomSheetCollapsed(false);
    setCurrentTab('feed');
  };

  // Submit Captured Photo as new Feed Moment
  const handlePublishPost = (e) => {
    if (e) e.preventDefault();
    if (!capturedPhoto) return;

    if (!newPostEventId) {
      alert('Associação a um Evento é obrigatória!');
      return;
    }
    if (!postTitle.trim()) {
      alert('O Título do momento é obrigatório!');
      return;
    }

    const selectedEvent = events.find(ev => ev.id === newPostEventId) || events[0];
    const tagsArr = [postTag1, postTag2, postTag3].filter(t => t.trim() !== '');

    const newMoment = {
      id: `moment-${Date.now()}`,
      eventId: selectedEvent.id,
      authorName: selectedEvent.organizer,
      authorAvatar: selectedEvent.logo,
      eventTitle: selectedEvent.title,
      location: newPostLocation,
      photo: capturedPhoto,
      title: postTitle,
      description: postDescription.trim() || 'Registado agora mesmo durante o evento!',
      time: selectedEvent.live ? 'LIVE' : 'Agora mesmo',
      likes: 0,
      liked: false,
      isLive: selectedEvent.live,
      comments: [],
      tags: tagsArr
    };

    setMoments([newMoment, ...moments]);
    setCapturedPhoto(null);
    setPostTitle('');
    setPostTag1('');
    setPostTag2('');
    setPostTag3('');
    setPostDescription('');
    setIsBottomSheetCollapsed(false);
    setCurrentTab('feed');
  };

  // Handle local file selection from device gallery
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCapturedPhoto(event.target.result);
        setIsBottomSheetCollapsed(false);
        stopCamera();
      };
      reader.readAsDataURL(file);
    }
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
      lng: randomLng,
      date: 'Hoje, 20:00 - 23:00',
      subtitle: newEventDesc || 'Novo evento adicionado à comunidade!',
      organizerLabel: `${newEventOrg} Organização`,
      organizerLogo: '/assets/profile.svg',
      banner: newEventImg
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
      setNewPostLocation('HardBar, Aveiro');
    }
  }, [events, newPostEventId]);

  const currentEvent = viewingEventId ? events.find(e => e.id === viewingEventId) : null;

  return (
    <div className="phone-shell">
      <div className="app-viewport">
        {/* Floating Back Button for Event Detail View */}
        {currentTab === 'feed' && viewingEventId && (
          <button 
            className="event-detail-back-btn" 
            onClick={() => setViewingEventId(null)}
            aria-label="Voltar"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
        )}

        {/* --- MAIN HEADER --- */}
        {currentTab === 'feed' && !viewingEventId && (
          <header className="brand-header">
            <div className="brand-logo-container">
              <img src="/assets/logo.svg" className="brand-logo-icon" alt="microPolariscope Logo" />
              <h1 className="brand-logo-text">
                <span className="light">micro</span>
                <span className="bold">polariscope</span>
              </h1>
            </div>
            <button className="header-profile-btn" aria-label="Perfil">
              <svg width="18" height="18" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 15.5C18.038 15.5 20.5 13.038 20.5 10C20.5 6.962 18.038 4.5 15 4.5C11.962 4.5 9.5 6.962 9.5 10C9.5 13.038 11.962 15.5 15 15.5Z" fill="white"/>
                <path d="M5.375 28C5.375 21.95 10.325 18 15 18C19.675 18 24.625 21.95 24.625 28" fill="white"/>
              </svg>
            </button>
          </header>
        )}

        {/* --- SCREEN CONTENT AREA --- */}
        <main className={`screen-content ${currentTab === 'camera' ? 'no-padding' : ''}`}>
          
          {/* TAB 1: MOMENTS FEED */}
          {currentTab === 'feed' && (
            <>
              {viewingEventId && currentEvent ? (
                <div className="event-detail-view">
                  {/* Banner Section */}
                  <div className="event-detail-banner-container">
                    <div 
                      className="event-detail-banner-bg" 
                      style={{ backgroundImage: `url(${currentEvent.banner || currentEvent.detailImage || currentEvent.image})` }}
                    ></div>
                    
                    {/* Overlapping Avatar */}
                    <div className="event-detail-avatar-container">
                      <img 
                        src={currentEvent.logo || '/assets/profile.svg'} 
                        className="event-detail-avatar" 
                        alt={currentEvent.title} 
                      />
                    </div>
                  </div>

                  {/* Info Content Section */}
                  <div className="event-detail-info">
                    <h2 className="event-detail-title">{currentEvent.title}</h2>
                    <p className="event-detail-subtitle">{currentEvent.subtitle || currentEvent.description}</p>
                    
                    {/* Date Row (Critical UX Fix) */}
                    <div className="event-detail-date-row">
                      <svg className="icon-calendar" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                      <span>{currentEvent.date || 'Hoje, 20:00 - 23:00'}</span>
                    </div>

                    {/* Organizer Badge (Critical UX Fix) */}
                    <div className="event-detail-organizer-badge">
                      <img 
                        src={currentEvent.organizerLogo || currentEvent.logo || '/assets/profile.svg'} 
                        className="organizer-badge-logo" 
                        alt={currentEvent.organizer} 
                      />
                      <div className="organizer-badge-info">
                        <span className="organizer-badge-label">Organização</span>
                        <span className="organizer-badge-name">{currentEvent.organizerLabel || `${currentEvent.organizer} Organização`}</span>
                      </div>
                    </div>

                    {/* Action Button: Momentos capsule */}
                    <button 
                      className="event-detail-momentos-btn"
                      onClick={() => {
                        setActiveStoryEventId(currentEvent.id);
                      }}
                    >
                      Momentos
                    </button>
                  </div>

                  {/* Moments Grid */}
                  <div className="event-detail-moments-section">
                    <h3 className="moments-grid-title">Fotografias do Evento</h3>
                    <div className="event-detail-moments-grid">
                      {(() => {
                        const eventMoments = moments.filter(m => m.eventId === currentEvent.id);
                        if (eventMoments.length > 0) {
                          return eventMoments.map(m => (
                            <div 
                              key={m.id} 
                              className="grid-moment-card"
                              onClick={() => setExpandedMomentId(m.id)}
                            >
                              <img src={m.photo} alt={m.title} />
                              <div className="grid-moment-overlay">
                                <span className="grid-moment-likes">❤️ {m.likes}</span>
                              </div>
                            </div>
                          ));
                        } else {
                          return (
                            <div 
                              className="grid-moment-card fallback-card"
                              style={{ gridColumn: 'span 2', textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}
                            >
                              <img 
                                src={currentEvent.detailImage || currentEvent.image} 
                                alt="Stock event photo" 
                                style={{ width: '100%', borderRadius: '12px', marginBottom: '8px' }} 
                              />
                              <span style={{ fontSize: '13px' }}>Ainda não há fotografias partilhadas para este evento.</span>
                            </div>
                          );
                        }
                      })()}
                    </div>
                  </div>
                </div>
              ) : (
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
                        <div key={evt.id} className="event-story-item" onClick={() => setViewingEventId(evt.id)}>
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
                              <span>{m.eventTitle}</span>
                              {m.location && <span className="moment-location-pin"> • {m.location}</span>}
                              {m.isLive && <span className="live"> (LIVE)</span>}
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
                            {m.tags && m.tags.length > 0 && (
                              <div className="moment-photo-tags">
                                {m.tags.map((t, idx) => (
                                  <span key={idx} className="moment-tag-badge">#{t}</span>
                                ))}
                              </div>
                            )}
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
            </>
          )}

          {/* TAB 2: CAMERA CAPTURE */}
          {currentTab === 'camera' && (
            <div className="camera-screen-container">
              {/* --- UPPER SELECTORS OVERLAY --- */}
              <div className="camera-top-overlay">
                <button 
                  type="button"
                  className="camera-close-btn" 
                  onClick={() => {
                    setCapturedPhoto(null);
                    setPostTitle('');
                    setPostTag1('');
                    setPostTag2('');
                    setPostTag3('');
                    setPostDescription('');
                    setIsBottomSheetCollapsed(false);
                    setCurrentTab('feed');
                  }} 
                  aria-label="Close"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
                
                <div className="camera-selectors">
                  {/* Event Selector */}
                  <div className="camera-selector-container">
                    <button 
                      type="button"
                      className="camera-selector-btn" 
                      onClick={() => {
                        setIsEventDropdownOpen(!isEventDropdownOpen);
                        setIsLocationDropdownOpen(false);
                      }}
                    >
                      <span className="truncate-text">
                        {events.find(ev => ev.id === newPostEventId)?.title || 'Evento*'}
                      </span>
                      <svg className={`chevron-icon ${isEventDropdownOpen ? 'open' : ''}`} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </button>
                    
                    {isEventDropdownOpen && (
                      <div className="camera-dropdown-menu">
                        <div className="dropdown-search-container">
                          <svg className="dropdown-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                          </svg>
                          <input 
                            type="text" 
                            placeholder="Pesquisar Evento" 
                            className="dropdown-search-input"
                            value={eventSearchQuery}
                            onChange={(e) => setEventSearchQuery(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            autoFocus
                          />
                        </div>
                        
                        <div className="dropdown-items-list">
                          {events
                            .filter(ev => ev.title.toLowerCase().includes(eventSearchQuery.toLowerCase()))
                            .map(ev => (
                              <button
                                key={ev.id}
                                type="button"
                                className={`dropdown-item ${newPostEventId === ev.id ? 'active' : ''}`}
                                onClick={() => handleSelectEvent(ev.id)}
                              >
                                {ev.title}
                              </button>
                            ))
                          }
                          {events.filter(ev => ev.title.toLowerCase().includes(eventSearchQuery.toLowerCase())).length === 0 && (
                            <div className="dropdown-no-results">Nenhum evento encontrado</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Location Selector */}
                  <div className="camera-selector-container">
                    <button 
                      type="button"
                      className="camera-selector-btn" 
                      onClick={() => {
                        setIsLocationDropdownOpen(!isLocationDropdownOpen);
                        setIsEventDropdownOpen(false);
                      }}
                    >
                      <span className="truncate-text">
                        {newPostLocation || 'Localização'}
                      </span>
                      <svg className={`chevron-icon ${isLocationDropdownOpen ? 'open' : ''}`} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </button>
                    
                    {isLocationDropdownOpen && (
                      <div className="camera-dropdown-menu">
                        <div className="dropdown-items-list">
                          <button
                            type="button"
                            className="dropdown-item"
                            onClick={() => {
                              const selectedEv = events.find(ev => ev.id === newPostEventId);
                              if (selectedEv) {
                                let loc = 'Aveiro, Portugal';
                                if (selectedEv.id === 'event-1') loc = 'HardBar, Aveiro';
                                else if (selectedEv.id === 'event-2') loc = 'Esgueira, Aveiro';
                                else if (selectedEv.id === 'event-3') loc = 'Café do Parque, Aveiro';
                                else loc = selectedEv.title + ', Aveiro';
                                setNewPostLocation(loc);
                              }
                              setIsLocationDropdownOpen(false);
                            }}
                          >
                            Localização do Evento
                          </button>
                          <button
                            type="button"
                            className="dropdown-item"
                            onClick={() => {
                              setNewPostLocation('Minha Localização (GPS)');
                              setIsLocationDropdownOpen(false);
                            }}
                          >
                            Minha Localização (GPS)
                          </button>
                          <button
                            type="button"
                            className="dropdown-item"
                            onClick={() => {
                              setNewPostLocation('Jardim Oudinot');
                              setIsLocationDropdownOpen(false);
                            }}
                          >
                            Jardim Oudinot
                          </button>
                          <button
                            type="button"
                            className="dropdown-item"
                            onClick={() => {
                              setNewPostLocation('Cais da Fonte Nova');
                              setIsLocationDropdownOpen(false);
                            }}
                          >
                            Cais da Fonte Nova
                          </button>
                          
                          <div className="dropdown-custom-input-row" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="text"
                              placeholder="Outro... (Pressiona Enter)"
                              className="custom-location-input"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  if (e.target.value.trim()) {
                                    setNewPostLocation(e.target.value.trim());
                                    e.target.value = '';
                                  }
                                  setIsLocationDropdownOpen(false);
                                }
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* --- CAMERA VIEWFINDER / PREVIEW --- */}
              <div className="camera-preview-area">
                {!capturedPhoto ? (
                  // Viewfinder with Reticle overlay
                  <div className="camera-viewfinder">
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
                  // Captured Photo preview
                  <div className="camera-captured-preview">
                    <img src={capturedPhoto} className="camera-captured-img" alt="Captured" />
                    
                    {/* Collapsed Slide-Up indicator */}
                    {isBottomSheetCollapsed && (
                      <button 
                        type="button"
                        className="sheet-expand-trigger-btn"
                        onClick={() => setIsBottomSheetCollapsed(false)}
                      >
                        <div className="trigger-pulse-chevron">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f17522" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="18 15 12 9 6 15"></polyline>
                          </svg>
                        </div>
                        <span className="trigger-text">Ver Detalhes</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {!capturedPhoto ? (
                // Shutter Footer Controls (Before Capture)
                <div className="camera-shutter-footer">
                  {/* Hidden file input for device gallery uploads */}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    style={{ display: 'none' }} 
                    accept="image/*" 
                    onChange={handleFileChange} 
                  />

                  {/* Gallery Button: opens native device photo gallery selector */}
                  <button 
                    type="button" 
                    className="shutter-footer-icon-btn gallery-btn"
                    onClick={() => fileInputRef.current && fileInputRef.current.click()}
                    title="Pick from Gallery"
                  >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                  </button>

                  {/* Standard Capture Button */}
                  <button 
                    type="button"
                    className="shutter-button-outer"
                    onClick={() => {
                      capturePhoto();
                      setIsBottomSheetCollapsed(false);
                    }}
                    aria-label="Capture photo"
                  >
                    <div className="shutter-button-inner"></div>
                  </button>

                  {/* Balanced empty placeholder where AI button used to be */}
                  <div style={{ width: '48px' }}></div>
                </div>
              ) : (
                // Details Form Bottom Sheet (After Capture)
                !isBottomSheetCollapsed && (
                  <div className="post-metadata-sheet-overlay" onClick={() => setIsBottomSheetCollapsed(true)}>
                    <div className="post-metadata-sheet" onClick={(e) => e.stopPropagation()}>
                      {/* Swipe down handle */}
                      <div className="metadata-sheet-handle" onClick={() => setIsBottomSheetCollapsed(true)}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f17522" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </div>

                      <form className="metadata-form" onSubmit={(e) => { e.preventDefault(); handlePublishPost(); }}>
                        <div className="metadata-form-group">
                          <label className="metadata-form-label">Título*</label>
                          <input 
                            type="text" 
                            placeholder="Escreve um Título" 
                            className="metadata-form-input"
                            value={postTitle}
                            onChange={(e) => setPostTitle(e.target.value)}
                            required
                          />
                        </div>

                        <div className="metadata-form-group">
                          <label className="metadata-form-label">Tags</label>
                          <div className="metadata-tags-row">
                            <input 
                              type="text" 
                              placeholder="Tag 1" 
                              className="metadata-tag-chip-input"
                              value={postTag1}
                              onChange={(e) => setPostTag1(e.target.value)}
                            />
                            <input 
                              type="text" 
                              placeholder="Tag 2" 
                              className="metadata-tag-chip-input"
                              value={postTag2}
                              onChange={(e) => setPostTag2(e.target.value)}
                            />
                            <input 
                              type="text" 
                              placeholder="Tag 3" 
                              className="metadata-tag-chip-input"
                              value={postTag3}
                              onChange={(e) => setPostTag3(e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="metadata-form-group">
                          <label className="metadata-form-label">Descrição</label>
                          <textarea 
                            placeholder="Descreve o momento" 
                            className="metadata-form-textarea"
                            value={postDescription}
                            onChange={(e) => setPostDescription(e.target.value)}
                          />
                        </div>

                        <div className="metadata-actions-row">
                          {/* PolarAI AutoFill */}
                          <button 
                            type="button" 
                            className="metadata-action-btn polar-ai-btn"
                            disabled={isAiLoading}
                            onClick={handleAiAutofill}
                          >
                            {isAiLoading ? (
                              <div className="ai-spinner-icon"></div>
                            ) : (
                              <span>PolarAI</span>
                            )}
                          </button>

                          {/* Save Draft */}
                          <button 
                            type="button" 
                            className="metadata-action-btn rascunho-btn"
                            onClick={handleSaveDraft}
                          >
                            Rascunho
                          </button>

                          {/* Publish */}
                          <button 
                            type="submit" 
                            className="metadata-action-btn publicar-btn"
                          >
                            Publicar
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )
              )
            }
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
        {currentTab !== 'camera' && (
          <nav className="navbar-floating-capsule">
            <button 
              className={`navbar-item ${currentTab === 'feed' ? 'active' : ''}`}
              onClick={() => {
                setCurrentTab('feed');
                setViewingEventId(null);
                setExpandedMomentId(null);
              }}
              aria-label="Home"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path 
                  d="M9 22V15C9 13.3431 10.3431 12 12 12C13.6569 12 15 13.3431 15 15V22H21V9.5L12 3L3 9.5V22Z" 
                  stroke="white" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  fill={currentTab === 'feed' ? 'white' : 'none'}
                />
              </svg>
            </button>
            
            <button 
              className={`navbar-item ${currentTab === 'camera' ? 'active' : ''}`}
              onClick={() => {
                setCapturedPhoto(null);
                setCurrentTab('camera');
                setViewingEventId(null);
                setExpandedMomentId(null);
              }}
              aria-label="Capture Moment"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path 
                  d="M23 19C23 20.1 22.1 21 21 21H3C1.9 21 1 20.1 1 19V8C1 6.9 1.9 6 3 6H7L9 3H15L17 6H21C22.1 6 23 6.9 23 8V19Z" 
                  stroke="white" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  fill={currentTab === 'camera' ? 'white' : 'none'}
                />
                <circle 
                  cx="12" 
                  cy="13.5" 
                  r="4" 
                  stroke="white" 
                  strokeWidth="2"
                  fill={currentTab === 'camera' ? '#F17522' : 'none'}
                />
              </svg>
            </button>
            
            <button 
              className={`navbar-item ${currentTab === 'map' ? 'active' : ''}`}
              onClick={() => {
                setCurrentTab('map');
                setViewingEventId(null);
                setExpandedMomentId(null);
              }}
              aria-label="Event Map"
            >
              <svg width="28" height="26" viewBox="0 0 36 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path 
                  d="M1 4L12 0.5V26.5L1 30ZM12 0.5L24 4V30L12 26.5ZM24 4L35 0.5V26.5L24 30Z" 
                  stroke={currentTab === 'map' ? '#F17522' : 'white'}
                  strokeWidth="2.5" 
                  strokeLinejoin="round"
                  fill={currentTab === 'map' ? 'white' : 'none'}
                />
              </svg>
            </button>
          </nav>
        )}

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

        {/* --- EXPANDED MOMENT MODAL OVERLAY --- */}
        {expandedMomentId && (
          (() => {
            const m = moments.find(moment => moment.id === expandedMomentId);
            if (!m) return null;
            return (
              <div className="expanded-moment-overlay" onClick={() => setExpandedMomentId(null)}>
                <div className="expanded-moment-card" onClick={(e) => e.stopPropagation()}>
                  <div className="expanded-moment-header">
                    <div className="expanded-moment-author">
                      <img src={m.authorAvatar} className="expanded-moment-avatar" alt={m.authorName} />
                      <span className="expanded-moment-author-name">{m.authorName}</span>
                    </div>
                    <button className="expanded-moment-close-btn" onClick={() => setExpandedMomentId(null)}>×</button>
                  </div>
                  
                  <div className="expanded-moment-photo-container">
                    <img src={m.photo} className="expanded-moment-photo" alt={m.title} />
                  </div>

                  <div className="expanded-moment-details">
                    <h4 className="expanded-moment-title">{m.title}</h4>
                    {m.tags && m.tags.length > 0 && (
                      <div className="moment-photo-tags">
                        {m.tags.map((t, idx) => (
                          <span key={idx} className="moment-tag-badge">#{t}</span>
                        ))}
                      </div>
                    )}
                    <p className="expanded-moment-description">{m.description}</p>
                    <span className="expanded-moment-time">{m.time}</span>
                  </div>

                  <div className="expanded-moment-actions">
                    <button 
                      className={`expanded-moment-action-btn ${m.liked ? 'liked' : ''}`}
                      onClick={() => likeMoment(m.id)}
                    >
                      <svg viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                      <span>{m.likes} Likes</span>
                    </button>

                    <button 
                      className="expanded-moment-action-btn"
                      onClick={() => {
                        setExpandedMomentId(null);
                        setActiveCommentsMomentId(m.id);
                      }}
                    >
                      <svg viewBox="0 0 24 24">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                      </svg>
                      <span>{m.comments.length} Comentários</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })()
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
