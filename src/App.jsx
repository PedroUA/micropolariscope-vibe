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
      banner: '/assets/hardbar_photo.png',
      badgeColor: 'rgba(0,0,0,0.75)'
    },
    {
      id: 'event-quiz',
      title: 'Noites de Quiz Dr. Why',
      organizer: 'HardBar',
      image: '/assets/quiz_photo.png',
      logo: '/assets/hardbar_avatar.png',
      live: false,
      description: 'Diverte-te com a nossa noite de Open Mic organizada pela Aveiro Cult, Associação de Artistas de Aveiro!',
      detailImage: '/assets/quiz_photo.png',
      lat: 40.6405,
      lng: -8.6445,
      date: 'Terça-feira, 21:30 - 23:30',
      subtitle: 'Noites de Quiz super divertidas! Junta a tua equipa e vem testar a tua cultura geral.',
      organizerLabel: 'HardBar Organização',
      organizerLogo: '/assets/hardbar_avatar.png',
      banner: '/assets/quiz_photo.png',
      badgeColor: '#f17522'
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
  const [newEventDesc, setNewEventDesc] = useState('');
  const [newEventImg, setNewEventImg] = useState(STOCK_IMAGES[0].url);
  const [customEventImg, setCustomEventImg] = useState(null);
  const [newEventDate, setNewEventDate] = useState('Hoje, 20:00 - 23:00');
  const [newEventLocation, setNewEventLocation] = useState('');

  // Comment Input State
  const [newCommentText, setNewCommentText] = useState('');

  // User Profile State
  const [viewingUser, setViewingUser] = useState(null);
  const [userProfileTab, setUserProfileTab] = useState('events'); // 'events' | 'moments'

  // Authentication States
  const [currentUser, setCurrentUser] = useState(null); // { name: string, avatar: string, email: string }
  const [loginScreen, setLoginScreen] = useState('welcome'); // 'welcome' | 'login' | 'register'
  
  // Login Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  // Register Form States
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [registerAvatar, setRegisterAvatar] = useState('/assets/profile.svg');

  const openUserProfile = (userName, avatar) => {
    let role = 'Membro';
    let bio = 'Amante de Aveiro, partilho momentos e vibes!';
    let banner = 'https://images.unsplash.com/photo-1486591978090-58e619d37fe7?w=600&auto=format&fit=crop&q=80';

    if (userName.toLowerCase().includes('hardbar') || userName.toLowerCase().includes('hard bar')) {
      role = 'Instituição';
      bio = 'Cozinha com amor, ingredientes frescos e momentos felizes.';
      banner = '/assets/hardbar_photo.png';
    } else if (userName.toLowerCase().includes('esgueira') || userName.toLowerCase().includes('aee')) {
      role = 'Escola';
      bio = 'Comunidade escolar unida pelo desporto e aprendizagem.';
      banner = '/assets/aee_photo.png';
    } else if (userName.toLowerCase().includes('tricot')) {
      role = 'Clube';
      bio = 'Ponto por ponto, partilhamos histórias e novelos.';
      banner = '/assets/tricot_thumb.png';
    } else if (userName.toLowerCase().includes('oficina') || userName.toLowerCase().includes('doce')) {
      role = 'Empresa';
      bio = 'A arte tradicional dos Ovos Moles de Aveiro.';
      banner = 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80';
    } else if (userName.toLowerCase().includes('surf')) {
      role = 'Clube';
      bio = 'A nossa paixão é o mar e as melhores ondas.';
      banner = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80';
    }

    setViewingUser({
      name: userName,
      avatar: avatar || '/assets/profile.svg',
      role,
      bio,
      banner
    });
    setUserProfileTab('events');
    setViewingEventId(null);
  };

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
  const eventFileInputRef = useRef(null);
  const profileAvatarInputRef = useRef(null);

  // --- FIGMA SCREEN 571:948 STATES & ACTIONS ---
  const USER_LOCATION = [40.6435, -8.6406];
  const [isSharingSheetOpen, setIsSharingSheetOpen] = useState(false);
  const [sharingData, setSharingData] = useState({
    type: 'map',
    label: 'Minha Localização',
    url: `http://micropolariscope.app.maps/HEU(/&Gz-lat${USER_LOCATION[0]}-lng${USER_LOCATION[1]}`
  });
  const [mapSearchQuery, setMapSearchQuery] = useState('');
  const [isMapRecording, setIsMapRecording] = useState(false);
  const [polariscopeVisible, setPolariscopeVisible] = useState(true);
  const [mapStyle, setMapStyle] = useState('light');
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const handleVoiceSearch = () => {
    if (isMapRecording) return;
    setIsMapRecording(true);
    showToast("A ouvir... Diga o nome de um evento");
    
    setTimeout(() => {
      const speechOptions = ['Hardbar', 'Cicloturismo', 'Tricot'];
      const chosen = speechOptions[Math.floor(Math.random() * speechOptions.length)];
      setMapSearchQuery(chosen);
      setIsMapRecording(false);
      showToast(`Pesquisa por voz: "${chosen}"!`);
    }, 1800);
  };

  const handleLocationClick = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(USER_LOCATION, 15, { animate: true });
      showToast("Focando na sua localização");
    }
  };

  const handleShareClick = () => {
    setSharingData({
      type: 'map',
      label: 'Minha Localização',
      url: `http://micropolariscope.app.maps/HEU(/&Gz-lat${USER_LOCATION[0]}-lng${USER_LOCATION[1]}`
    });
    setIsSharingSheetOpen(true);
  };

  const handleShareMomentClick = (m) => {
    setSharingData({
      type: 'moment',
      label: `Partilhar Momento: ${m.title}`,
      url: `http://micropolariscope.app/m/${m.id}`
    });
    setIsSharingSheetOpen(true);
  };

  const handleCompassClick = () => {
    setPolariscopeVisible(!polariscopeVisible);
    setMapStyle(mapStyle === 'light' ? 'dark' : 'light');
    showToast(polariscopeVisible ? "Radar Polariscope Desativado" : "Radar Polariscope Ativo!");
  };

  const handleCopyLocation = () => {
    const activeUrl = sharingData?.url || `http://micropolariscope.app.maps/HEU(/&Gz-lat${USER_LOCATION[0]}-lng${USER_LOCATION[1]}`;
    navigator.clipboard.writeText(activeUrl);
    const itemLabel = sharingData?.type === 'map' ? 'localização' : 'momento';
    showToast(`Link de ${itemLabel} copiado!`);
  };

  const handleSocialShare = (platform) => {
    const itemLabel = sharingData?.type === 'map' ? 'a localização' : 'o momento';
    showToast(`A partilhar ${itemLabel} via ${platform}...`);
    setTimeout(() => {
      setIsSharingSheetOpen(false);
    }, 1200);
  };

  // --- MAP INTEGRATION ---
  useEffect(() => {
    let map = null;

    if (currentTab === 'map' && mapContainerRef.current && !mapInstanceRef.current) {
      // Initialize map centered at Aveiro
      map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false
      }).setView([40.6425, -8.6430], 14);

      mapInstanceRef.current = map;

      // Add initial tiles
      const tileUrl = mapStyle === 'light'
        ? 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
      tileLayerRef.current = L.tileLayer(tileUrl, { maxZoom: 19 }).addTo(map);

      // Custom orange arrow icon for user location (Figma 571:948)
      const userIcon = L.divIcon({
        html: `
          <div style="transform: rotate(25deg); display: flex; align-items: center; justify-content: center; filter: drop-shadow(0px 4px 6px rgba(0,0,0,0.25));">
            <svg width="42" height="42" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L22 22L12 18L2 22L12 2Z" fill="#f17522" stroke="white" stroke-width="2.5" stroke-linejoin="round"/>
            </svg>
          </div>
        `,
        className: 'user-marker-icon',
        iconSize: [42, 42],
        iconAnchor: [21, 21]
      });

      L.marker(USER_LOCATION, { icon: userIcon })
        .addTo(map)
        .bindPopup('Minha Localização');

      // Force size recalculation to fix grey rendering bugs
      [50, 150, 400, 1000].forEach(delay => {
        setTimeout(() => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.invalidateSize();
          }
        }, delay);
      });
    }

    // Refresh markers whenever events or map changes
    if (currentTab === 'map' && mapInstanceRef.current) {
      const activeMap = mapInstanceRef.current;

      // Clear existing markers
      markersRef.current.forEach(m => {
        if (m.marker) m.marker.remove();
        else m.remove();
      });
      markersRef.current = [];

      // Filter events based on search query
      const filteredEvents = events.filter(evt =>
        evt.title.toLowerCase().includes(mapSearchQuery.toLowerCase()) ||
        evt.organizer.toLowerCase().includes(mapSearchQuery.toLowerCase())
      );

      // Add markers for filtered events
      filteredEvents.forEach(evt => {
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
          <img src="${evt.detailImage || evt.image}" />
          <div class="map-card-popup-title">${evt.title}</div>
          <div class="map-card-popup-org">${evt.organizer}</div>
          ${evt.live ? '<span style="color:#ff1b1b; font-size:10px; font-weight:700;">● AO VIVO</span>' : ''}
          <button>Ver Detalhes</button>
        `;

        popupContent.querySelector('button').addEventListener('click', () => {
          setViewingEventId(evt.id);
          setCurrentTab('feed');
        });

        const marker = L.marker([evt.lat, evt.lng], { icon: customIcon })
          .bindPopup(popupContent, { maxWidth: 160 })
          .addTo(activeMap);

        markersRef.current.push({ eventId: evt.id, marker });
      });
    }

    return () => {
      // Cleanup map instance if tab unmounts
      if (currentTab !== 'map' && mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [currentTab, events, mapSearchQuery]);

  // --- MAP STYLE UPDATES ---
  const tileLayerRef = useRef(null);
  useEffect(() => {
    if (currentTab === 'map' && mapInstanceRef.current) {
      if (tileLayerRef.current) {
        tileLayerRef.current.remove();
      }

      const tileUrl = mapStyle === 'light'
        ? 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

      tileLayerRef.current = L.tileLayer(tileUrl, { maxZoom: 19 }).addTo(mapInstanceRef.current);
    }
  }, [mapStyle, currentTab]);

  // --- MAP RESIZE ROBUSTNESS ---
  useEffect(() => {
    if (currentTab === 'map' && mapInstanceRef.current) {
      const timer = setTimeout(() => {
        mapInstanceRef.current.invalidateSize();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [mapStyle, mapSearchQuery, isSharingSheetOpen, currentTab]);

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
      if (selectedEvent.location) locName = selectedEvent.location;
      else if (selectedEvent.id === 'event-1') locName = 'HardBar, Aveiro';
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

  // Handle event cover file selection from device gallery
  const handleEventFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomEventImg(event.target.result);
        setNewEventImg(event.target.result);
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

  // Navigate moments manually inside the story player
  const navigateMoment = (direction) => {
    const currentIndex = moments.findIndex(m => m.id === expandedMomentId);
    if (direction === 'next') {
      if (currentIndex < moments.length - 1) {
        setExpandedMomentId(moments[currentIndex + 1].id);
      } else {
        setExpandedMomentId(null);
      }
    } else if (direction === 'prev') {
      if (currentIndex > 0) {
        setExpandedMomentId(moments[currentIndex - 1].id);
      }
    }
  };

  // --- AUTHENTICATION HANDLERS ---
  const handleLogin = (e) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setLoginError('Por favor preencha todos os campos.');
      return;
    }
    
    // Extract a nice user name from email
    let userName = loginEmail.split('@')[0];
    userName = userName.charAt(0).toUpperCase() + userName.slice(1);
    
    if (userName.toLowerCase() === 'hardbar' || userName.toLowerCase() === 'hard bar') {
      userName = 'HardBar';
    }

    const avatar = userName === 'HardBar' ? '/assets/hardbar_avatar.png' : '/assets/profile.svg';

    setCurrentUser({
      name: userName,
      avatar: avatar,
      email: loginEmail
    });
    setLoginEmail('');
    setLoginPassword('');
    setLoginError('');
    showToast(`Bem-vindo, ${userName}!`);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!registerName.trim() || !registerEmail.trim() || !registerPassword.trim()) {
      setRegisterError('Por favor preencha todos os campos.');
      return;
    }

    setCurrentUser({
      name: registerName,
      avatar: registerAvatar,
      email: registerEmail
    });
    setRegisterName('');
    setRegisterEmail('');
    setRegisterPassword('');
    setRegisterAvatar('/assets/profile.svg');
    setRegisterError('');
    showToast(`Conta criada! Bem-vindo, ${registerName}!`);
  };

  const handleProfileAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        if (currentUser) {
          setCurrentUser(prev => ({ ...prev, avatar: dataUrl }));
          if (viewingUser) {
            setViewingUser(prev => ({ ...prev, avatar: dataUrl }));
          }
          showToast('Foto de perfil atualizada!');
        } else {
          setRegisterAvatar(dataUrl);
          showToast('Foto de perfil selecionada!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGuestLogin = () => {
    setCurrentUser({
      name: 'Visitante',
      avatar: '/assets/profile.svg',
      email: 'visitante@micropolariscope.pt'
    });
    showToast('Entrou como Visitante!');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setViewingUser(null);
    setLoginScreen('welcome');
    showToast('Sessão terminada.');
  };

  // --- FORM ACTIONS ---
  const handleCreateEvent = (e) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;

    // Generate random coordinates in Aveiro area
    const randomLat = 40.635 + Math.random() * 0.02;
    const randomLng = -8.66 + Math.random() * 0.025;

    const newEvt = {
      id: `event-${Date.now()}`,
      title: newEventTitle,
      organizer: currentUser ? currentUser.name : 'Eu',
      image: newEventImg,
      logo: currentUser ? currentUser.avatar : '/assets/profile.svg',
      live: false,
      description: newEventDesc || 'Novo evento adicionado à comunidade! Junta-te a nós e cria momentos.',
      detailImage: newEventImg,
      lat: randomLat,
      lng: randomLng,
      date: newEventDate || 'Hoje, 20:00 - 23:00',
      location: newEventLocation || 'Aveiro, Portugal',
      subtitle: newEventDesc || 'Novo evento adicionado à comunidade!',
      organizerLabel: currentUser ? `${currentUser.name} Organização` : 'A Minha Organização',
      organizerLogo: currentUser ? currentUser.avatar : '/assets/profile.svg',
      banner: newEventImg
    };

    setEvents([...events, newEvt]);

    // Reset Form
    setNewEventTitle('');
    setNewEventDesc('');
    setNewEventDate('Hoje, 20:00 - 23:00');
    setNewEventLocation('');
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
              { 
                id: Date.now(), 
                author: currentUser ? currentUser.name : 'Eu', 
                authorAvatar: currentUser ? currentUser.avatar : '/assets/profile.svg', 
                content: newCommentText 
              }
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

  // Desktop Drag-to-Scroll vertical utility for feed and details
  useEffect(() => {
    const slider = document.querySelector('.screen-content');
    if (!slider) return;

    let isDown = false;
    let startY;
    let scrollTop;

    const onMouseDown = (e) => {
      // Ignore click on interactive buttons, inputs, textareas
      if (e.target.closest('button') || e.target.closest('input') || e.target.closest('textarea') || e.target.closest('svg') || e.target.closest('.eventos-scroll-bar')) {
        return;
      }
      isDown = true;
      slider.classList.add('active-dragging');
      startY = e.pageY - slider.offsetTop;
      scrollTop = slider.scrollTop;
    };

    const onMouseLeave = () => {
      isDown = false;
      slider.classList.remove('active-dragging');
    };

    const onMouseUp = () => {
      isDown = false;
      slider.classList.remove('active-dragging');
    };

    const onMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const y = e.pageY - slider.offsetTop;
      const walk = (y - startY) * 1.5; // multiplier for scrolling speed
      slider.scrollTop = scrollTop - walk;
    };

    const onDragStart = (e) => {
      if (e.target.tagName === 'IMG') {
        e.preventDefault();
      }
    };

    slider.addEventListener('mousedown', onMouseDown);
    slider.addEventListener('mouseleave', onMouseLeave);
    slider.addEventListener('mouseup', onMouseUp);
    slider.addEventListener('mousemove', onMouseMove);
    slider.addEventListener('dragstart', onDragStart);

    return () => {
      slider.removeEventListener('mousedown', onMouseDown);
      slider.removeEventListener('mouseleave', onMouseLeave);
      slider.removeEventListener('mouseup', onMouseUp);
      slider.removeEventListener('mousemove', onMouseMove);
      slider.removeEventListener('dragstart', onDragStart);
    };
  }, [currentTab, viewingEventId]);

  // Desktop Drag-to-Scroll horizontal utility for events bar
  useEffect(() => {
    const slider = document.querySelector('.eventos-scroll-bar');
    if (!slider) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    const onMouseDown = (e) => {
      if (e.target.closest('button')) return;
      isDown = true;
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    };

    const onMouseLeave = () => {
      isDown = false;
    };

    const onMouseUp = () => {
      isDown = false;
    };

    const onMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 1.5;
      slider.scrollLeft = scrollLeft - walk;
    };

    const onDragStart = (e) => {
      if (e.target.tagName === 'IMG') {
        e.preventDefault();
      }
    };

    slider.addEventListener('mousedown', onMouseDown);
    slider.addEventListener('mouseleave', onMouseLeave);
    slider.addEventListener('mouseup', onMouseUp);
    slider.addEventListener('mousemove', onMouseMove);
    slider.addEventListener('dragstart', onDragStart);

    return () => {
      slider.removeEventListener('mousedown', onMouseDown);
      slider.removeEventListener('mouseleave', onMouseLeave);
      slider.removeEventListener('mouseup', onMouseUp);
      slider.removeEventListener('mousemove', onMouseMove);
      slider.removeEventListener('dragstart', onDragStart);
    };
  }, [currentTab, viewingEventId]);

  const currentEvent = viewingEventId ? events.find(e => e.id === viewingEventId) : null;

  return (
    <div className="phone-shell">
      <div className="app-viewport">
        <input 
          type="file" 
          ref={profileAvatarInputRef} 
          style={{ display: 'none' }} 
          accept="image/*" 
          onChange={handleProfileAvatarChange} 
        />
        {!currentUser ? (
          <div className="auth-flow-container">
            {loginScreen === 'welcome' && (
              <div className="welcome-screen">
                <header className="auth-header">
                  <div className="auth-header-logo-container">
                    <svg className="auth-logo-svg" width="24" height="24" viewBox="0 0 38 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M31.5803 30.4242L36.9553 13.779M28.1249 30.0371L34.2678 11.4565M31.5803 32.7468H12.7677M13.9194 35.8436H30.8124M21.5981 30.0371L24.6695 21.1339M25.0535 30.0371L27.3571 23.0694M21.5981 15.3274L28.8928 20.7468M23.9017 13.0048L29.6606 17.65M18.5266 0.617751L31.9642 11.0694M15.8391 2.94033L30.8124 14.1661M13.9194 4.87582L0.473583 15.096M16.607 6.8113L1.63365 18.4242M19.2945 9.13388L13.5355 13.3919M21.982 11.0694L14.6873 16.4887M11.2319 14.5532L14.3034 23.4565M8.54441 16.8758L10.848 23.4565M10.848 26.1661H20.0624M11.9998 29.65H19.2945M5.85689 18.4242L11.6159 36.6178M3.16937 20.7468L8.16048 36.6178" stroke="currentColor" strokeWidth="2.5" strokeMiterlimit="4"/>
                    </svg>
                    <h1 className="auth-header-logo-text">
                      <span className="light">micro</span>
                      <span className="bold">polariscope</span>
                    </h1>
                  </div>
                </header>

                <div className="welcome-body">
                  <h2 className="welcome-title">Olá!</h2>
                  
                  <div className="welcome-logo-large">
                    <svg className="auth-logo-svg" width="204" height="202" viewBox="0 0 38 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M31.5803 30.4242L36.9553 13.779M28.1249 30.0371L34.2678 11.4565M31.5803 32.7468H12.7677M13.9194 35.8436H30.8124M21.5981 30.0371L24.6695 21.1339M25.0535 30.0371L27.3571 23.0694M21.5981 15.3274L28.8928 20.7468M23.9017 13.0048L29.6606 17.65M18.5266 0.617751L31.9642 11.0694M15.8391 2.94033L30.8124 14.1661M13.9194 4.87582L0.473583 15.096M16.607 6.8113L1.63365 18.4242M19.2945 9.13388L13.5355 13.3919M21.982 11.0694L14.6873 16.4887M11.2319 14.5532L14.3034 23.4565M8.54441 16.8758L10.848 23.4565M10.848 26.1661H20.0624M11.9998 29.65H19.2945M5.85689 18.4242L11.6159 36.6178M3.16937 20.7468L8.16048 36.6178" stroke="currentColor" strokeWidth="2.5" strokeMiterlimit="4"/>
                    </svg>
                  </div>

                  <p className="welcome-subtitle">Pronto(a) para partilhar os teus melhores Momentos?</p>
                </div>

                <div className="welcome-actions">
                  <button className="auth-btn auth-btn-secondary" onClick={() => setLoginScreen('register')}>
                    Criar conta
                  </button>
                  <button className="auth-btn auth-btn-primary" onClick={() => setLoginScreen('login')}>
                    Iniciar sessão
                  </button>
                  <div className="auth-guest-link">
                    ...ou entra como <span className="visitor-underlined" onClick={handleGuestLogin}>Visitante</span>
                  </div>
                </div>
              </div>
            )}

            {loginScreen === 'login' && (
              <div className="auth-form-screen">
                <header className="auth-header">
                  <button className="auth-back-btn" onClick={() => setLoginScreen('welcome')} aria-label="Voltar">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                  </button>
                  <div className="auth-header-logo-container">
                    <svg className="auth-logo-svg" width="24" height="24" viewBox="0 0 38 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M31.5803 30.4242L36.9553 13.779M28.1249 30.0371L34.2678 11.4565M31.5803 32.7468H12.7677M13.9194 35.8436H30.8124M21.5981 30.0371L24.6695 21.1339M25.0535 30.0371L27.3571 23.0694M21.5981 15.3274L28.8928 20.7468M23.9017 13.0048L29.6606 17.65M18.5266 0.617751L31.9642 11.0694M15.8391 2.94033L30.8124 14.1661M13.9194 4.87582L0.473583 15.096M16.607 6.8113L1.63365 18.4242M19.2945 9.13388L13.5355 13.3919M21.982 11.0694L14.6873 16.4887M11.2319 14.5532L14.3034 23.4565M8.54441 16.8758L10.848 23.4565M10.848 26.1661H20.0624M11.9998 29.65H19.2945M5.85689 18.4242L11.6159 36.6178M3.16937 20.7468L8.16048 36.6178" stroke="currentColor" strokeWidth="2.5" strokeMiterlimit="4"/>
                    </svg>
                    <h1 className="auth-header-logo-text">
                      <span className="light">micro</span>
                      <span className="bold">polariscope</span>
                    </h1>
                  </div>
                </header>

                <form className="auth-form" onSubmit={handleLogin}>
                  <h3 className="auth-form-title">Iniciar sessão</h3>
                  
                  {loginError && <div className="auth-error-msg">{loginError}</div>}

                  <div className="auth-input-group">
                    <input 
                      type="email" 
                      id="login-email"
                      className="auth-input-field" 
                      placeholder=" "
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                    <label htmlFor="login-email" className="auth-input-label">E-mail</label>
                  </div>

                  <div className="auth-input-group">
                    <input 
                      type="password" 
                      id="login-password"
                      className="auth-input-field" 
                      placeholder=" "
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                    <label htmlFor="login-password" className="auth-input-label">Palavra-passe</label>
                  </div>

                  <button type="submit" className="auth-submit-btn">
                    Entrar
                  </button>
                </form>
              </div>
            )}

            {loginScreen === 'register' && (
              <div className="auth-form-screen">
                <header className="auth-header">
                  <button className="auth-back-btn" onClick={() => setLoginScreen('welcome')} aria-label="Voltar">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                  </button>
                  <div className="auth-header-logo-container">
                    <svg className="auth-logo-svg" width="24" height="24" viewBox="0 0 38 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M31.5803 30.4242L36.9553 13.779M28.1249 30.0371L34.2678 11.4565M31.5803 32.7468H12.7677M13.9194 35.8436H30.8124M21.5981 30.0371L24.6695 21.1339M25.0535 30.0371L27.3571 23.0694M21.5981 15.3274L28.8928 20.7468M23.9017 13.0048L29.6606 17.65M18.5266 0.617751L31.9642 11.0694M15.8391 2.94033L30.8124 14.1661M13.9194 4.87582L0.473583 15.096M16.607 6.8113L1.63365 18.4242M19.2945 9.13388L13.5355 13.3919M21.982 11.0694L14.6873 16.4887M11.2319 14.5532L14.3034 23.4565M8.54441 16.8758L10.848 23.4565M10.848 26.1661H20.0624M11.9998 29.65H19.2945M5.85689 18.4242L11.6159 36.6178M3.16937 20.7468L8.16048 36.6178" stroke="currentColor" strokeWidth="2.5" strokeMiterlimit="4"/>
                    </svg>
                    <h1 className="auth-header-logo-text">
                      <span className="light">micro</span>
                      <span className="bold">polariscope</span>
                    </h1>
                  </div>
                </header>

                <form className="auth-form" onSubmit={handleRegister}>
                  <h3 className="auth-form-title">Criar conta</h3>
                  
                  {registerError && <div className="auth-error-msg">{registerError}</div>}

                  {/* Profile Avatar Selection Card */}
                  <div className="auth-avatar-selection-card" onClick={() => profileAvatarInputRef.current && profileAvatarInputRef.current.click()}>
                    <div className="auth-avatar-selection-wrapper">
                      <img src={registerAvatar} alt="Profile Avatar" className="auth-avatar-selection-img" />
                      <div className="auth-avatar-selection-badge">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                          <circle cx="12" cy="13" r="4"/>
                        </svg>
                      </div>
                    </div>
                    <span className="auth-avatar-selection-label">Escolher foto de perfil</span>
                  </div>

                  <div className="auth-input-group">
                    <input 
                      type="text" 
                      id="register-name"
                      className="auth-input-field" 
                      placeholder=" "
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      required
                    />
                    <label htmlFor="register-name" className="auth-input-label">Nome Completo</label>
                  </div>

                  <div className="auth-input-group">
                    <input 
                      type="email" 
                      id="register-email"
                      className="auth-input-field" 
                      placeholder=" "
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      required
                    />
                    <label htmlFor="register-email" className="auth-input-label">E-mail</label>
                  </div>

                  <div className="auth-input-group">
                    <input 
                      type="password" 
                      id="register-password"
                      className="auth-input-field" 
                      placeholder=" "
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      required
                    />
                    <label htmlFor="register-password" className="auth-input-label">Palavra-passe</label>
                  </div>

                  <button type="submit" className="auth-submit-btn">
                    Criar conta
                  </button>
                </form>
              </div>
            )}
          </div>
        ) : (
          <>
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
        {currentTab === 'feed' && !viewingEventId && !viewingUser && (
          <header className="brand-header">
            <div className="brand-logo-container">
              <img src="/assets/logo.svg" className="brand-logo-icon" alt="microPolariscope Logo" />
              <h1 className="brand-logo-text">
                <span className="light">micro</span>
                <span className="bold">polariscope</span>
              </h1>
            </div>
            <button 
              className="header-profile-btn" 
              onClick={() => openUserProfile(currentUser ? currentUser.name : 'Eu', currentUser ? currentUser.avatar : '/assets/profile.svg')}
              aria-label="Perfil"
            >
              <svg width="18" height="18" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 15.5C18.038 15.5 20.5 13.038 20.5 10C20.5 6.962 18.038 4.5 15 4.5C11.962 4.5 9.5 6.962 9.5 10C9.5 13.038 11.962 15.5 15 15.5Z" fill="white"/>
                <path d="M5.375 28C5.375 21.95 10.325 18 15 18C19.675 18 24.625 21.95 24.625 28" fill="white"/>
              </svg>
            </button>
          </header>
        )}

        {/* --- SCREEN CONTENT AREA --- */}
        <main className={`screen-content ${currentTab === 'camera' ? 'no-padding' : ''}`}>
          
          {/* USER PROFILE PAGE */}
          {viewingUser ? (
            <div className="user-profile-view">
              {/* Back Button */}
              <button 
                className="event-detail-back-btn user-profile-back-btn" 
                onClick={() => setViewingUser(null)}
                aria-label="Voltar"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>

              {/* Banner Section */}
              <div className="event-detail-banner-container">
                <div 
                  className="event-detail-banner-bg" 
                  style={{ backgroundImage: `url(${viewingUser.banner})` }}
                ></div>
                
                {/* Overlapping Avatar */}
                <div 
                  className={`event-detail-avatar-container ${currentUser && (viewingUser.name === currentUser.name || (currentUser.name === 'Visitante' && viewingUser.name === 'Eu')) ? 'editable-avatar' : ''}`}
                  onClick={(e) => {
                    const isOwnProfile = currentUser && (viewingUser.name === currentUser.name || (currentUser.name === 'Visitante' && viewingUser.name === 'Eu'));
                    if (isOwnProfile && e.target.closest('.avatar-edit-overlay')) {
                      if (profileAvatarInputRef.current) {
                        profileAvatarInputRef.current.click();
                      }
                    } else {
                      setUserProfileTab('moments');
                      showToast('A abrir a galeria de momentos...');
                    }
                  }}
                  title={currentUser && (viewingUser.name === currentUser.name || (currentUser.name === 'Visitante' && viewingUser.name === 'Eu')) ? "Clique na foto para ver a galeria ou no ícone para alterar" : "Ver galeria de momentos"}
                >
                  <img 
                    src={viewingUser.avatar} 
                    className="event-detail-avatar" 
                    alt={viewingUser.name} 
                  />
                  {currentUser && (viewingUser.name === currentUser.name || (currentUser.name === 'Visitante' && viewingUser.name === 'Eu')) && (
                    <div className="avatar-edit-overlay">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                        <circle cx="12" cy="13" r="4"/>
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              {/* User Meta Info */}
              <div className="user-profile-meta">
                <h2 className="user-profile-name">{viewingUser.name}</h2>
                <span className="user-profile-role">{viewingUser.role}</span>
                <p className="user-profile-bio">{viewingUser.bio}</p>
                {currentUser && (viewingUser.name === currentUser.name || (currentUser.name === 'Visitante' && viewingUser.name === 'Eu')) && (
                  <button 
                    className="user-profile-logout-capsule-btn" 
                    onClick={handleLogout}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px', display: 'inline-block', verticalAlign: 'middle' }}>
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Terminar Sessão
                  </button>
                )}
              </div>

              {/* Tabs selector */}
              <div className="user-profile-tabs-selector">
                <button 
                  className={`user-profile-tab-btn ${userProfileTab === 'events' ? 'active' : ''}`}
                  onClick={() => setUserProfileTab('events')}
                >
                  Eventos
                </button>
                <button 
                  className={`user-profile-tab-btn ${userProfileTab === 'moments' ? 'active' : ''}`}
                  onClick={() => setUserProfileTab('moments')}
                >
                  Momentos
                </button>
              </div>

              {/* Tab Content */}
              <div className="user-profile-tab-content">
                {userProfileTab === 'events' ? (
                  <div className="user-profile-events-list">
                    {(() => {
                      const userEvents = events.filter(e => {
                        const orgClean = e.organizer.toLowerCase().replace(/\s+/g, '');
                        const nameClean = viewingUser.name.toLowerCase().replace(/\s+/g, '');
                        return orgClean.includes(nameClean) || nameClean.includes(orgClean);
                      });
                      if (userEvents.length > 0) {
                        return userEvents.map(evt => (
                          <div key={evt.id} className="user-profile-event-card" onClick={() => { setViewingEventId(evt.id); setViewingUser(null); }}>
                            <img src={evt.image} className="user-profile-event-img" alt={evt.title} />
                            
                            <div 
                              className="user-profile-event-title-badge"
                              style={evt.badgeColor ? { backgroundColor: evt.badgeColor } : {}}
                            >
                              {evt.title}
                            </div>

                            <div className="user-profile-event-desc-overlay">
                              <p className="user-profile-event-desc">{evt.description}</p>
                            </div>
                          </div>
                        ));
                      } else {
                        return (
                          <div className="user-profile-fallback">
                            Não organizou nenhum evento ainda.
                          </div>
                        );
                      }
                    })()}
                  </div>
                ) : (
                  <div className="user-profile-moments-list">
                    {(() => {
                      const userMoments = moments.filter(m => {
                        const authorClean = m.authorName.toLowerCase().replace(/\s+/g, '');
                        const nameClean = viewingUser.name.toLowerCase().replace(/\s+/g, '');
                        return authorClean.includes(nameClean) || nameClean.includes(authorClean);
                      });
                      if (userMoments.length > 0) {
                        return userMoments.map(m => (
                          <div key={m.id} className="user-profile-moment-card" onClick={() => setExpandedMomentId(m.id)}>
                            <img src={m.photo} className="user-profile-moment-img" alt={m.title} />
                            <div className="user-profile-moment-info">
                              <span className="user-profile-moment-title">{m.title}</span>
                              <span className="user-profile-moment-likes">❤️ {m.likes} Likes</span>
                            </div>
                          </div>
                        ));
                      } else {
                        return (
                          <div className="user-profile-fallback">
                            Não partilhou nenhum momento ainda.
                          </div>
                        );
                      }
                    })()}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
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
                    <div 
                      className="event-detail-organizer-badge"
                      onClick={() => openUserProfile(currentEvent.organizer, currentEvent.logo)}
                      style={{ cursor: 'pointer' }}
                    >
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
                          <img 
                            src={m.authorAvatar} 
                            className="moment-author-avatar" 
                            alt={m.authorName} 
                            onClick={() => openUserProfile(m.authorName, m.authorAvatar)}
                            style={{ cursor: 'pointer' }}
                          />
                          <div className="moment-author-info">
                            <span 
                              className="moment-author-name"
                              onClick={() => openUserProfile(m.authorName, m.authorAvatar)}
                              style={{ cursor: 'pointer' }}
                            >
                              {m.authorName}
                            </span>
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
                          onClick={() => setExpandedMomentId(m.id)}
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

                          <button 
                            className="moment-action-btn"
                            onClick={() => handleShareMomentClick(m)}
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="18" cy="5" r="3"/>
                              <circle cx="6" cy="12" r="3"/>
                              <circle cx="18" cy="19" r="3"/>
                              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                            </svg>
                            <span>Partilhar</span>
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
              {/* 1. Leaflet map */}
              <div id="map" ref={mapContainerRef} className="leaflet-map-div"></div>

              {/* 2. Polariscope Radar Overlay */}
              {polariscopeVisible && (
                <div className="polariscope-overlay">
                  <div className="polariscope-circle circle-1"></div>
                  <div className="polariscope-circle circle-2"></div>
                  <div className="polariscope-circle circle-3"></div>
                  <div className="polariscope-circle circle-4"></div>
                  <div className="polariscope-axis axis-h"></div>
                  <div className="polariscope-axis axis-v"></div>
                  <div className="polariscope-axis axis-d1"></div>
                  <div className="polariscope-axis axis-d2"></div>
                  <div className="polariscope-center"></div>
                </div>
              )}

              {/* 3. Floating Search Bar (Top) */}
              <div className="floating-search-bar">
                <button className="search-logo-btn" aria-label="Polariscope Home">
                  <svg width="24" height="24" viewBox="0 0 38 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f17522" />
                        <stop offset="100%" stopColor="#f7ad1a" />
                      </linearGradient>
                    </defs>
                    <path d="M31.5803 30.4242L36.9553 13.779M28.1249 30.0371L34.2678 11.4565M31.5803 32.7468H12.7677M13.9194 35.8436H30.8124M21.5981 30.0371L24.6695 21.1339M25.0535 30.0371L27.3571 23.0694M21.5981 15.3274L28.8928 20.7468M23.9017 13.0048L29.6606 17.65M18.5266 0.617751L31.9642 11.0694M15.8391 2.94033L30.8124 14.1661M13.9194 4.87582L0.473583 15.096M16.607 6.8113L1.63365 18.4242M19.2945 9.13388L13.5355 13.3919M21.982 11.0694L14.6873 16.4887M11.2319 14.5532L14.3034 23.4565M8.54441 16.8758L10.848 23.4565M10.848 26.1661H20.0624M11.9998 29.65H19.2945M5.85689 18.4242L11.6159 36.6178M3.16937 20.7468L8.16048 36.6178" stroke="url(#logo-grad)" strokeWidth="2.5" strokeMiterlimit="4"/>
                  </svg>
                </button>
                <input 
                  type="text" 
                  placeholder="Search here" 
                  className="search-input-field"
                  value={mapSearchQuery}
                  onChange={(e) => setMapSearchQuery(e.target.value)}
                />
                <button 
                  className={`search-mic-btn ${isMapRecording ? 'recording' : ''}`} 
                  onClick={handleVoiceSearch}
                  aria-label="Search by voice"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                    <path d="M19 10v1a7 7 0 0 1-14 0v-1"/>
                    <line x1="12" x2="12" y1="19" y2="22"/>
                  </svg>
                </button>
              </div>

              {/* 4. Floating Actions Column (Figma bottom-right) */}
              <div className="floating-actions-column-map">
                <button 
                  className="map-action-fab"
                  onClick={handleLocationClick}
                  title="Centralizar na minha localização"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="22" x2="18" y1="12" y2="12"/>
                    <line x1="6" x2="2" y1="12" y2="12"/>
                    <line x1="12" x2="12" y1="6" y2="2"/>
                    <line x1="12" x2="12" y1="22" y2="18"/>
                  </svg>
                </button>
                <button 
                  className="map-action-fab"
                  onClick={handleShareClick}
                  title="Partilhar Localização"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="18" cy="5" r="3"/>
                    <circle cx="6" cy="12" r="3"/>
                    <circle cx="18" cy="19" r="3"/>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                  </svg>
                </button>
                
                {/* Hidden polariscope toggle */}
                <button 
                  className={`map-action-fab ${polariscopeVisible ? 'active' : ''}`}
                  onClick={handleCompassClick}
                  style={{ display: 'none' }}
                >
                  <svg viewBox="0 0 24 24">
                    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
                    <circle cx="12" cy="12" r="10"/>
                  </svg>
                </button>
              </div>
            </div>
          )}

            </>
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

        {/* --- EXPANDED MOMENT MODAL OVERLAY (Instagram-style Stories player) --- */}
        {expandedMomentId && (
          (() => {
            const m = moments.find(moment => moment.id === expandedMomentId);
            if (!m) return null;
            return (
              <div className="story-player-overlay moment-story-player">
                {/* Tap Navigation */}
                <div className="story-tap-navigation">
                  <div className="story-tap-left" onClick={() => navigateMoment('prev')}></div>
                  <div className="story-tap-right" onClick={() => navigateMoment('next')}></div>
                </div>

                {/* Header with bars and metadata */}
                <div className="story-player-header">
                  <div className="story-progress-bar-container">
                    {moments.map((mom, idx) => {
                      const currentActiveIndex = moments.findIndex(item => item.id === expandedMomentId);
                      let fillClass = '';
                      if (idx < currentActiveIndex) {
                        fillClass = 'completed';
                      } else if (idx === currentActiveIndex) {
                        fillClass = 'active';
                      }
                      return (
                        <div key={mom.id} className="story-progress-bar-bg">
                          <div className={`story-progress-bar-fill ${fillClass}`} style={idx === currentActiveIndex ? { width: '100%', transition: 'none' } : {}}></div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="story-player-meta">
                    <div className="story-player-author">
                      <img src={m.authorAvatar} className="story-player-avatar" alt="Avatar" />
                      <div className="story-player-info">
                        <div className="story-player-name">{m.authorName}</div>
                        <div className="story-player-subtitle">
                          {m.eventTitle} {m.isLive && <span style={{color:'#ff3b30', fontWeight:'bold'}}>(LIVE)</span>}
                        </div>
                      </div>
                    </div>
                    <button className="story-player-close" onClick={() => setExpandedMomentId(null)}>×</button>
                  </div>
                </div>

                {/* Media Content */}
                <div className="story-player-content" onDoubleClick={() => likeMoment(m.id, true)}>
                  <img src={m.photo} className="story-player-image" alt="Story content" />
                  
                  {/* Floating Pop Heart Animation */}
                  <span className={`double-tap-heart ${animateHeartMomentId === m.id ? 'animate' : ''}`}>
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="#ff1b1b">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  </span>
                </div>

                {/* Bottom details & action row */}
                <div className="story-player-info-card moment-story-info-card">
                  <h2 className="story-player-title">{m.title}</h2>
                  {m.tags && m.tags.length > 0 && (
                    <div className="moment-photo-tags" style={{ marginBottom: '4px' }}>
                      {m.tags.map((t, idx) => (
                        <span key={idx} className="moment-tag-badge">#{t}</span>
                      ))}
                    </div>
                  )}
                  <p className="story-player-description">{m.description}</p>
                  
                  <div className="moment-story-actions-row" style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                    <button 
                      className={`expanded-moment-action-btn ${m.liked ? 'liked' : ''}`}
                      onClick={(e) => { e.stopPropagation(); likeMoment(m.id); }}
                      style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff' }}
                    >
                      <svg viewBox="0 0 24 24" style={{ stroke: m.liked ? '#ff1b1b' : '#fff' }}>
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                      <span>{m.likes} Likes</span>
                    </button>

                    <button 
                      className="expanded-moment-action-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedMomentId(null);
                        setActiveCommentsMomentId(m.id);
                      }}
                      style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff' }}
                    >
                      <svg viewBox="0 0 24 24" style={{ stroke: '#fff' }}>
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                      </svg>
                      <span>{m.comments.length} Comentários</span>
                    </button>

                    <button 
                      className="expanded-moment-action-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedMomentId(null);
                        handleShareMomentClick(m);
                      }}
                      style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff' }}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="18" cy="5" r="3"/>
                        <circle cx="6" cy="12" r="3"/>
                        <circle cx="18" cy="19" r="3"/>
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                      </svg>
                      <span>Partilhar</span>
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
            <div className="orange-bottom-sheet" onClick={(e) => e.stopPropagation()}>
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
                  <label className="form-label">Data e Hora do Evento</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Sábado, 15:00 - 18:00" 
                    className="form-input"
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Localização (Nome do Espaço/Cidade)</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Cais da Fonte Nova, Aveiro" 
                    className="form-input"
                    value={newEventLocation}
                    onChange={(e) => setNewEventLocation(e.target.value)}
                    required
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
                    {customEventImg && (
                      <div 
                        className={`image-selector-option ${newEventImg === customEventImg ? 'selected' : ''}`}
                        onClick={() => setNewEventImg(customEventImg)}
                      >
                        <img src={customEventImg} alt="Imagem Carregada" />
                      </div>
                    )}
                    <div 
                      className="image-selector-option upload-option"
                      onClick={() => eventFileInputRef.current && eventFileInputRef.current.click()}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#f2f2f7',
                        border: '2px dashed #ff8e42',
                        borderRadius: '12px',
                        color: 'var(--primary)',
                        flexDirection: 'column',
                        gap: '2px'
                      }}
                      title="Carregar da Galeria"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21 15 16 10 5 21"/>
                      </svg>
                      <span style={{ fontSize: '8px', fontWeight: 'bold' }}>Galeria</span>
                    </div>
                  </div>
                  <input 
                    type="file" 
                    ref={eventFileInputRef} 
                    style={{ display: 'none' }} 
                    accept="image/*" 
                    onChange={handleEventFileChange} 
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
                      <img src={c.authorAvatar || "/assets/profile.svg"} className="comment-avatar" alt="Avatar" />
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
          </>
        )}

        {/* --- TOAST NOTIFICATIONS --- */}
        {toastMessage && (
          <div className="toast-notification">
            {toastMessage}
          </div>
        )}

        {/* --- BOTTOM SHEET: SHARING SHEET (Figma Match 571:1027) --- */}
        {isSharingSheetOpen && (
          <div className="bottom-sheet-overlay" onClick={() => setIsSharingSheetOpen(false)}>
            <div className="sharing-bottom-sheet" onClick={(e) => e.stopPropagation()}>
              <div className="sharing-sheet-drag-handle" onClick={() => setIsSharingSheetOpen(false)}>
                <svg width="22" height="10" viewBox="0 0 22 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 2L11 8L20 2" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              <div className="sharing-sheet-title-row">
                <h3 className="sharing-sheet-title">Partilhar</h3>
                <button className="sharing-sheet-close-btn" onClick={() => setIsSharingSheetOpen(false)}>×</button>
              </div>

              <div className="share-location-card">
                <div className="share-location-info">
                  <span className="share-location-label">{sharingData?.label || 'Minha Localização'}</span>
                  <span className="share-location-url">{sharingData?.url || `http://micropolariscope.app.maps/HEU(/&Gz-lat${USER_LOCATION[0]}-lng${USER_LOCATION[1]}`}</span>
                </div>
                <button className="share-copy-btn" onClick={handleCopyLocation} title="Copiar Link">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                  </svg>
                </button>
              </div>

              <div className="sharing-social-row">
                <div className="sharing-social-card" onClick={() => handleSocialShare('WhatsApp')}>
                  <div className="sharing-social-icon-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                    </svg>
                  </div>
                  <span className="sharing-social-label">WhatsApp</span>
                </div>

                <div className="sharing-social-card" onClick={() => handleSocialShare('Instagram')}>
                  <div className="sharing-social-icon-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#E1306C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                    </svg>
                  </div>
                  <span className="sharing-social-label">Instagram</span>
                </div>

                <div className="sharing-social-card" onClick={() => handleSocialShare('Facebook')}>
                  <div className="sharing-social-icon-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#1877F2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                    </svg>
                  </div>
                  <span className="sharing-social-label">Facebook</span>
                </div>

                <div className="sharing-social-card" onClick={() => handleSocialShare('Mais')}>
                  <div className="sharing-social-icon-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#666666" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="1"/>
                      <circle cx="19" cy="12" r="1"/>
                      <circle cx="5" cy="12" r="1"/>
                    </svg>
                  </div>
                  <span className="sharing-social-label">Mais</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
