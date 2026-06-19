import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import './App.css';

const getDistanceKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Pre-defined image options for event creators to select from
const STOCK_IMAGES = [
  { url: '/assets/hardbar_photo.png', name: 'Concerto' },
  { url: '/assets/aee_photo.png', name: 'Cicloturismo' },
  { url: '/assets/tricot_thumb.png', name: 'Tricot' },
];

const getOrganizerRole = (organizerName, currentUser) => {
  if (!organizerName) return 'Pessoal';
  if (currentUser && organizerName === currentUser.name) {
    return currentUser.accountType === 'Organização' ? 'Organização' : 'Pessoal';
  }
  const nameLower = organizerName.toLowerCase();
  if (
    nameLower.includes('hardbar') ||
    nameLower.includes('hard bar') ||
    nameLower.includes('esgueira') ||
    nameLower.includes('aee') ||
    nameLower.includes('oficina') ||
    nameLower.includes('doce') ||
    nameLower.includes('surf') ||
    nameLower.includes('jazz') ||
    nameLower.includes('leme') ||
    nameLower.includes('tricot')
  ) {
    return 'Organização';
  }
  return 'Pessoal';
};

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
      location: 'Bustos',
      description: 'Concerto incrível com o artista Marcvs Marçal! Uma noite inesquecível de música ao vivo no melhor bar da zona.',
      detailImage: '/assets/hardbar_photo.png',
      lat: 40.4950,
      lng: -8.5471,
      date: 'Hoje, 21:30 - 02:00',
      subtitle: 'Noites animadas com música ao vivo e muitos hambúrgueres.',
      organizerLabel: 'HardBar',
      organizerLogo: '/assets/hardbar_avatar.png',
      banner: '/assets/hardbar_photo.png',
      badgeColor: '#f17522'
    },
    {
      id: 'event-quiz',
      title: 'Noites de Quiz Dr. Why',
      organizer: 'HardBar',
      image: '/assets/quiz_photo.png',
      logo: '/assets/hardbar_avatar.png',
      live: false,
      location: 'Bustos',
      description: 'Diverte-te com a nossa noite de Quiz super divertida! Junta a tua equipa, testa a tua cultura geral e ganha prémios fantásticos.',
      detailImage: '/assets/quiz_photo.png',
      lat: 40.4960,
      lng: -8.5490,
      date: 'Terça-feira, 21:30 - 23:30',
      subtitle: 'Noites de Quiz super divertidas! Junta a tua equipa e vem testar a tua cultura geral.',
      organizerLabel: 'HardBar',
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
      location: 'Esgueira, Aveiro',
      description: 'Passeio anual de cicloturismo. Venha pedalar connosco e promover a saúde e a mobilidade sustentável!',
      detailImage: '/assets/aee_photo.png',
      lat: 40.6550,
      lng: -8.6180,
      date: 'Domingo, 09:00 - 13:00',
      subtitle: 'Passeio anual de cicloturismo de Esgueira. Traz a tua bicicleta!',
      organizerLabel: 'AEE',
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
      location: 'Parque Infante D. Pedro, Aveiro',
      description: 'Junte-se a nós todas as quintas-feiras às 18h no café do parque para tricotar, conversar e trocar experiências!',
      detailImage: '/assets/tricot_thumb.png',
      lat: 40.6385,
      lng: -8.6512,
      date: 'Quinta-feira, 18:00 - 20:00',
      subtitle: 'Junta-te a nós todas as quintas-feiras às 18h no café do parque.',
      organizerLabel: 'Tricot Aveiro',
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
      location: 'Oficina do Doce, Aveiro',
      description: 'Vem aprender a fazer o doce mais tradicional de Aveiro! Uma experiência prática onde crias os teus próprios Ovos Moles in moldes clássicos.',
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
      location: 'Praia da Barra, Ílhavo',
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
      location: 'Jardim Oudinot, Gafanha da Nazaré',
      description: 'Um concerto ao ar livre sob a brisa da ria no bonito Jardim Oudinot. Traz a tua manta de piquenique e desfruta de excelente música.',
      detailImage: 'https://images.unsplash.com/photo-1486591978090-58e619d37fe7?w=600&auto=format&fit=crop&q=80',
      lat: 40.6430,
      lng: -8.7250,
      date: 'Domingo, 16:00 - 19:00',
      subtitle: 'Música ao vivo e piquenique no parque da cidade. Entrada livre.',
      organizerLabel: 'Aveiro Jazz',
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
      location: 'Praça da República, Aveiro',
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
      location: 'Padel Club, Cacia',
      description: 'Fase final do torneio de Padel no clube da Ria. Vem ver as melhores duplas em campo e desfrutar do ambiente festivo com street food.',
      detailImage: 'https://images.unsplash.com/photo-1545809074-59472b3f5ecc?w=600&auto=format&fit=crop&q=80',
      lat: 40.6820,
      lng: -8.6050,
      date: 'Hoje, 09:00 - 18:00',
      subtitle: 'Grandes jogos de Padel, bar aberto e foodtrucks ao longo do dia.',
      organizerLabel: 'Direção do Aveiro Padel Club',
      organizerLogo: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=80&auto=format&fit=crop&q=60',
      banner: 'https://images.unsplash.com/photo-1545809074-59472b3f5ecc?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'event-9',
      title: 'Francesinhas & Co. na Foz',
      organizer: 'Porto Gastronomia',
      image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=150&auto=format&fit=crop&q=60',
      logo: '/assets/profile.svg',
      live: false,
      location: 'Foz do Douro, Porto',
      description: 'Convívio gastronómico à beira-rio. Vem saborear as melhores francesinhas com molho caseiro tradicional e batata frita estaladiça na Foz do Douro.',
      detailImage: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=600&auto=format&fit=crop&q=80',
      lat: 41.1579,
      lng: -8.6291,
      date: 'Amanhã, 12:00 - 16:00',
      subtitle: 'Um almoço memorável com a melhor francesinha do norte.',
      organizerLabel: 'Associação de Gastronomia do Porto',
      organizerLogo: '/assets/profile.svg',
      banner: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'event-10',
      title: 'Fado de Coimbra no Penedo',
      organizer: 'Coimbra Académica',
      image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=150&auto=format&fit=crop&q=60',
      logo: '/assets/profile.svg',
      live: false,
      location: 'Penedo da Saudade, Coimbra',
      description: 'Uma noite especial de fados de Coimbra ao luar, interpretada por estudantes e antigos estudantes universitários com trajes tradicionais.',
      detailImage: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&auto=format&fit=crop&q=80',
      lat: 40.2075,
      lng: -8.4235,
      date: 'Sábado, 21:00 - 23:30',
      subtitle: 'Serenata tradicional no Penedo da Saudade.',
      organizerLabel: 'Associação de Fado de Coimbra',
      organizerLogo: '/assets/profile.svg',
      banner: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'event-11',
      title: 'Passeio Moliceiro ao Pôr do Sol',
      organizer: 'Ria de Aveiro Tours',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=150&auto=format&fit=crop&q=60',
      logo: '/assets/profile.svg',
      live: true,
      location: 'Canais de Aveiro',
      description: 'Descobre a beleza da ria a bordo de um moliceiro tradicional, acompanhado por espumante da Bairrada e os clássicos ovos moles de Aveiro.',
      detailImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
      lat: 40.6433,
      lng: -8.6534,
      date: 'Hoje, 19:30 - 21:00',
      subtitle: 'Navega pelos canais urbanos num passeio romântico ao entardecer.',
      organizerLabel: 'Ria Tours',
      organizerLogo: '/assets/profile.svg',
      banner: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'event-12',
      title: 'Festival do Bacalhau de Ílhavo',
      organizer: 'Município de Ílhavo',
      image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=150&auto=format&fit=crop&q=60',
      logo: '/assets/profile.svg',
      live: false,
      location: 'Jardim Henriqueta Maia, Ílhavo',
      description: 'Showcookings com chefs nacionais, provas gastronómicas, artesanato local e concertos ao vivo no Jardim Henriqueta Maia.',
      detailImage: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop&q=80',
      lat: 40.6080,
      lng: -8.6690,
      date: 'Amanhã, 11:00 - 23:00',
      subtitle: 'A maior festa gastronómica dedicada ao bacalhau.',
      organizerLabel: 'Câmara Municipal de Ílhavo',
      organizerLogo: '/assets/profile.svg',
      banner: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'event-13',
      title: 'Feira de São Mateus',
      organizer: 'Viseu Marca',
      image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=150&auto=format&fit=crop&q=60',
      logo: '/assets/profile.svg',
      live: false,
      location: 'Rossio, Viseu',
      description: 'A feira franca mais antiga da Península Ibérica. Diversões, gastronomia regional, exposições de artesanato e grandes concertos musicais.',
      detailImage: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&auto=format&fit=crop&q=80',
      lat: 40.6575,
      lng: -7.9135,
      date: 'De 10 de Agosto a 21 de Setembro',
      subtitle: 'A feira de todas as feiras no coração de Viseu.',
      organizerLabel: 'Viseu Marca',
      organizerLogo: '/assets/profile.svg',
      banner: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'event-agueda',
      title: 'Festival da Lampreia e Leitão',
      organizer: 'Câmara de Águeda',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=150&auto=format&fit=crop&q=60',
      logo: '/assets/profile.svg',
      live: true,
      location: 'Águeda',
      description: 'O melhor da gastronomia regional de Águeda! Delicie-se com o Leitão da Bairrada e a tradicional lampreia, acompanhados por vinhos locais e muita música popular.',
      detailImage: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop&q=80',
      lat: 40.5750,
      lng: -8.4443,
      date: 'Hoje a Domingo, 12:00 - 23:00',
      subtitle: 'Uma verdadeira viagem pelos sabores tradicionais da nossa região.',
      organizerLabel: 'Câmara Municipal de Águeda',
      organizerLogo: '/assets/profile.svg',
      banner: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'event-feira-marco',
      title: 'Feira de Março',
      organizer: 'Aveiro Expo',
      image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=150&auto=format&fit=crop&q=60',
      logo: '/assets/profile.svg',
      live: false,
      location: 'Aveiro Expo',
      description: 'A maior feira do centro do país! Concertos de grandes artistas, exposições comerciais, gastronomia típica e a clássica zona de diversões.',
      detailImage: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&auto=format&fit=crop&q=80',
      lat: 40.6433,
      lng: -8.6360,
      date: 'De 25 de Março a 25 de Abril',
      subtitle: 'Tradição, comércio e concertos fantásticos no Rossio de Aveiro.',
      organizerLabel: 'Aveiro Expo',
      organizerLogo: '/assets/profile.svg',
      banner: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'event-vagueira',
      title: 'Sunset na Vagueira',
      organizer: 'Vagueira Beach Club',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=150&auto=format&fit=crop&q=60',
      logo: '/assets/profile.svg',
      live: true,
      location: 'Praia da Vagueira, Vagos',
      description: 'Música ao pôr do sol na Praia da Vagueira! Descontraia com os melhores DJs locais, cocktails frescos e a brisa do mar ao final da tarde.',
      detailImage: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=600&auto=format&fit=crop&q=80',
      lat: 40.5630,
      lng: -8.7670,
      date: 'Hoje, 17:00 - 22:00',
      subtitle: 'O melhor sunset da costa aveirense com vista para o mar.',
      organizerLabel: 'Vagueira Beach Club',
      organizerLogo: '/assets/profile.svg',
      banner: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'event-braga-romana',
      title: 'Braga Romana',
      organizer: 'Município de Braga',
      image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=150&auto=format&fit=crop&q=60',
      logo: '/assets/profile.svg',
      live: false,
      location: 'Braga',
      description: 'Reviva o passado romano de Bracara Augusta! Mercados tradicionais, desfiles imperiais, recriações históricas e gastronomia da época pelas ruas do centro histórico.',
      detailImage: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&auto=format&fit=crop&q=80',
      lat: 41.5503,
      lng: -8.4200,
      date: 'De 22 a 26 de Maio',
      subtitle: 'Uma viagem inesquecível de regresso à antiga Bracara Augusta.',
      organizerLabel: 'Município de Braga',
      organizerLogo: '/assets/profile.svg',
      banner: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'event-sjoao-porto',
      title: 'São João do Porto',
      organizer: 'Associação Festas Porto',
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=150&auto=format&fit=crop&q=60',
      logo: '/assets/profile.svg',
      live: true,
      location: 'Porto',
      description: 'A noite mais longa e alegre do ano no Porto! Martelos de plástico, balões de ar quente, as tradicionais fogueiras e o espetacular fogo de artifício no Rio Douro.',
      detailImage: 'https://images.unsplash.com/photo-1486591978090-58e619d37fe7?w=600&auto=format&fit=crop&q=80',
      lat: 41.1579,
      lng: -8.6291,
      date: '23 de Junho, 20:00 - 06:00',
      subtitle: 'Celebre o São João na Ribeira com martelos, balões e sardinhas.',
      organizerLabel: 'Associação de Festas do Porto',
      organizerLogo: '/assets/profile.svg',
      banner: 'https://images.unsplash.com/photo-1486591978090-58e619d37fe7?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'event-queima-coimbra',
      title: 'Queima das Fitas Coimbra',
      organizer: 'AAC',
      image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=150&auto=format&fit=crop&q=60',
      logo: '/assets/profile.svg',
      live: false,
      location: 'Coimbra',
      description: 'A maior e mais antiga festa académica do país! Da Serenata Monumental na Sé Velha ao tradicional cortejo de carros alegóricos pelas ruas da cidade.',
      detailImage: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&auto=format&fit=crop&q=80',
      lat: 40.2033,
      lng: -8.4200,
      date: 'De 3 a 10 de Maio',
      subtitle: 'A semana académica mítica dos estudantes de Coimbra.',
      organizerLabel: 'Associação Académica de Coimbra',
      organizerLogo: '/assets/profile.svg',
      banner: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'event-santos-alfama',
      title: 'Santos Populares em Alfama',
      organizer: 'Junta Alfama',
      image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=150&auto=format&fit=crop&q=60',
      logo: '/assets/profile.svg',
      live: true,
      location: 'Alfama, Lisboa',
      description: 'O bairro de Alfama enche-se de cor, música e o cheiro a sardinha assada! Venha dançar nos arraiais tradicionais e sentir a verdadeira alma lisboeta.',
      detailImage: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&auto=format&fit=crop&q=80',
      lat: 38.7122,
      lng: -9.1294,
      date: '12 de Junho, 19:00 - 04:00',
      subtitle: 'Arraiais tradicionais, manjericos e sardinhas no coração de Lisboa.',
      organizerLabel: 'Junta de Freguesia de Alfama',
      organizerLogo: '/assets/profile.svg',
      banner: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'event-evora-classica',
      title: 'Festival Évora Clássica',
      organizer: 'Assoc Canto Evora',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=150&auto=format&fit=crop&q=60',
      logo: '/assets/profile.svg',
      live: false,
      location: 'Templo Romano, Évora',
      description: 'Concertos ao ar livre de música clássica no deslumbrante cenário do Templo Romano de Évora (Templo de Diana). Uma noite mágica sob as estrelas.',
      detailImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80',
      lat: 38.5726,
      lng: -7.9073,
      date: 'Sábado, 18:00 - 22:00',
      subtitle: 'Orquestra de câmara ao vivo junto ao património mundial da UNESCO.',
      organizerLabel: "Associação Canto d'Évora",
      organizerLogo: '/assets/profile.svg',
      banner: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'event-marisco-olhao',
      title: 'Festival de Marisco',
      organizer: 'Município de Olhão',
      image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=150&auto=format&fit=crop&q=60',
      logo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&auto=format&fit=crop&q=60',
      live: true,
      location: 'Olhão, Algarve',
      description: 'O maior festival gastronómico do sul do país! Saboreie o marisco mais fresco da Ria Formosa - amêijoas, sapateiras, ostras e camarões ao som de concertos diários.',
      detailImage: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80',
      lat: 37.0255,
      lng: -7.8415,
      date: 'De 10 a 15 de Agosto, 19:00 - 00:00',
      subtitle: 'Marisco fresco da Ria Formosa e grandes espetáculos musicais.',
      organizerLabel: 'Município de Olhão',
      organizerLogo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&auto=format&fit=crop&q=60',
      banner: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'event-viana-agonia',
      title: 'Romaria da Sra. da Agonia',
      organizer: 'Assoc. Cultural Vianense',
      image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=150&auto=format&fit=crop&q=60',
      logo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=60',
      live: true,
      location: 'Viana do Castelo',
      description: 'A rainha das romarias de Portugal! Desfile da mordomia com quilos de ouro ao peito, cortejos etnográficos, tapetes de sal e o espetacular fogo de artifício no Rio Lima.',
      detailImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
      lat: 41.7018,
      lng: -8.8347,
      date: 'De 18 a 22 de Agosto',
      subtitle: 'A maior e mais colorida romaria tradicional de Portugal.',
      organizerLabel: 'Associação Cultural Vianense',
      organizerLogo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=60',
      banner: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'event-guimaraes-afonsina',
      title: 'Feira Afonsina',
      organizer: 'Cultura Guimarães',
      image: 'https://images.unsplash.com/photo-1503174971373-b1f69850bded?w=150&auto=format&fit=crop&q=60',
      logo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=60',
      live: false,
      location: 'Castelo de Guimarães',
      description: 'Viaje no tempo até à fundação do Condado Portucalense. Recriações históricas, torneios medievais, tabernas com iguarias de época e mercado medieval em redor do castelo.',
      detailImage: 'https://images.unsplash.com/photo-1503174971373-b1f69850bded?w=600&auto=format&fit=crop&q=80',
      lat: 41.4478,
      lng: -8.2906,
      date: 'De 21 a 24 de Junho',
      subtitle: 'Viva o ambiente medieval no berço de Portugal.',
      organizerLabel: 'Câmara Municipal de Guimarães',
      organizerLogo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=60',
      banner: 'https://images.unsplash.com/photo-1503174971373-b1f69850bded?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'event-sintra-pirilampos',
      title: 'Caminhada dos Pirilampos',
      organizer: 'Sintra Verde Aventura',
      image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=150&auto=format&fit=crop&q=60',
      logo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=60',
      live: true,
      location: 'Serra de Sintra',
      description: 'Uma caminhada mágica noturna pela mística Serra de Sintra sob o brilho dos pirilampos. Um percurso guiado de 8km com lendas e mistérios locais.',
      detailImage: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&auto=format&fit=crop&q=80',
      lat: 38.7933,
      lng: -9.3909,
      date: 'Hoje, 21:00 - 00:00',
      subtitle: 'Explore os trilhos misteriosos de Sintra à luz das lanternas.',
      organizerLabel: 'Sintra Verde Aventura',
      organizerLogo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=60',
      banner: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'event-setubal-choco',
      title: 'Festival do Choco Frito',
      organizer: 'Município de Setúbal',
      image: 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=150&auto=format&fit=crop&q=60',
      logo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&auto=format&fit=crop&q=60',
      live: false,
      location: 'Doca dos Pescadores, Setúbal',
      description: 'Venha deliciar-se com o melhor choco frito de Setúbal! Várias tabernas e restaurantes trazem receitas tradicionais, acompanhadas pelo Moscatel de Setúbal.',
      detailImage: 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=600&auto=format&fit=crop&q=80',
      lat: 38.5204,
      lng: -8.8926,
      date: 'De 2 a 5 de Julho',
      subtitle: 'Sabores do mar e animação na Doca dos Pescadores.',
      organizerLabel: 'Câmara Municipal de Setúbal',
      organizerLogo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&auto=format&fit=crop&q=60',
      banner: 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'event-portalegre-rali',
      title: 'Rali de Portalegre 500',
      organizer: 'Automóvel Club de Portugal',
      image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=150&auto=format&fit=crop&q=60',
      logo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=60',
      live: true,
      location: 'Portalegre, Alentejo',
      description: 'A mítica prova todo-o-terreno da Península Ibérica! Carros, motos e quads competem pelas pistas de terra batida e ribeiras do Alto Alentejo.',
      detailImage: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&auto=format&fit=crop&q=80',
      lat: 39.2938,
      lng: -7.4312,
      date: 'De 22 a 24 de Outubro',
      subtitle: 'Adrenalina e velocidade nas pistas do Alentejo.',
      organizerLabel: 'ACP Sport',
      organizerLogo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=60',
      banner: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'event-beja-ovibeja',
      title: 'Ovibeja',
      organizer: 'ACOS - Agric. do Sul',
      image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=150&auto=format&fit=crop&q=60',
      logo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&auto=format&fit=crop&q=60',
      live: false,
      location: 'Parque de Exposições, Beja',
      description: 'A grande feira agrícola do Alentejo. Cante Alentejano, concertos de grandes artistas, exposições pecuárias, provas de azeite e tasquinhas gastronómicas.',
      detailImage: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&auto=format&fit=crop&q=80',
      lat: 38.0167,
      lng: -7.8653,
      date: 'De 28 de Abril a 3 de Maio',
      subtitle: 'Todo o Alentejo deste mundo na grande feira de Beja.',
      organizerLabel: 'ACOS - Associação de Agricultores do Sul',
      organizerLogo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&auto=format&fit=crop&q=60',
      banner: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'event-portimao-sardinha',
      title: 'Festival da Sardinha',
      organizer: 'Município de Portimão',
      image: 'https://images.unsplash.com/photo-1534482421-64566f976cfa?w=150&auto=format&fit=crop&q=60',
      logo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&auto=format&fit=crop&q=60',
      live: true,
      location: 'Zona Ribeirinha de Portimão',
      description: 'O aroma inconfundível da sardinha assada à beira-rio! Concertos ao vivo, animação de rua, artesanato e milhares de sardinhas assadas na hora.',
      detailImage: 'https://images.unsplash.com/photo-1534482421-64566f976cfa?w=600&auto=format&fit=crop&q=80',
      lat: 37.1386,
      lng: -8.5372,
      date: 'De 3 a 7 de Agosto',
      subtitle: 'Sardinha fresca e grandes concertos junto ao Rio Arade.',
      organizerLabel: 'Câmara Municipal de Portimão',
      organizerLogo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&auto=format&fit=crop&q=60',
      banner: 'https://images.unsplash.com/photo-1534482421-64566f976cfa?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'event-faro-f',
      title: 'Festival F',
      organizer: 'Faro Ativo',
      image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=150&auto=format&fit=crop&q=60',
      logo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&auto=format&fit=crop&q=60',
      live: true,
      location: 'Vila Adentro, Faro',
      description: 'O último grande festival de verão! O centro histórico de Faro (Vila Adentro) acolhe vários palcos integrados nas muralhas históricas com o melhor da música nacional.',
      detailImage: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&auto=format&fit=crop&q=80',
      lat: 37.0125,
      lng: -7.9344,
      date: 'De 3 a 5 de Setembro',
      subtitle: 'Cultura, música e património no coração de Faro.',
      organizerLabel: 'Município de Faro',
      organizerLogo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&auto=format&fit=crop&q=60',
      banner: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&auto=format&fit=crop&q=80'
    }
  ]);

  const [moments, setMoments] = useState([
    {
      id: 'moment-1',
      eventId: 'event-1',
      authorName: 'HardBar',
      authorAvatar: '/assets/hardbar_avatar.png',
      eventTitle: 'Concerto no HardBar',
      location: 'Bustos',
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
      location: 'Esgueira, Aveiro',
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
      photo: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=600&auto=format&fit=crop&q=80',
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
    },
    {
      id: 'moment-ev9-1',
      eventId: 'event-9',
      authorName: 'Carlos Porto',
      authorAvatar: '/assets/profile.svg',
      eventTitle: 'Francesinhas & Co. na Foz',
      location: 'Foz do Douro, Porto',
      photo: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=600&auto=format&fit=crop&q=80',
      title: 'A melhor do norte!',
      description: 'O molho picante da francesinha está soberbo. Acompanhado por uma cerveja artesanal bem fresca!',
      time: 'Amanhã',
      likes: 72,
      liked: false,
      isLive: false,
      comments: []
    },
    {
      id: 'moment-ev10-1',
      eventId: 'event-10',
      authorName: 'Coimbra Estudante',
      authorAvatar: '/assets/profile.svg',
      eventTitle: 'Fado de Coimbra no Penedo',
      location: 'Penedo da Saudade, Coimbra',
      photo: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&auto=format&fit=crop&q=80',
      title: 'Serenatas no penedo',
      description: 'O som da guitarra de Coimbra ecoa no Penedo da Saudade. Noite mágica de tradição académica.',
      time: '1 dia atrás',
      likes: 95,
      liked: false,
      isLive: false,
      comments: []
    },
    {
      id: 'moment-ev11-1',
      eventId: 'event-11',
      authorName: 'Marta Aveiro',
      authorAvatar: '/assets/profile.svg',
      eventTitle: 'Passeio Moliceiro ao Pôr do Sol',
      location: 'Canais de Aveiro',
      photo: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
      title: 'Pôr do sol dourado na ria',
      description: 'Navegar ao entardecer no moliceiro é das melhores experiências em Aveiro. O espumante estava divinal!',
      time: 'LIVE',
      likes: 112,
      liked: true,
      isLive: true,
      comments: []
    },
    {
      id: 'moment-ev12-1',
      eventId: 'event-12',
      authorName: 'Luís Gastrónomo',
      authorAvatar: '/assets/profile.svg',
      eventTitle: 'Festival do Bacalhau de Ílhavo',
      location: 'Jardim Henriqueta Maia, Ílhavo',
      photo: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop&q=80',
      title: 'Pataniscas de chorar por mais',
      description: 'Showcooking excelente no festival do bacalhau. Prova de pataniscas acabadas de fritar!',
      time: 'Amanhã',
      likes: 83,
      liked: false,
      isLive: false,
      comments: []
    },
    {
      id: 'moment-ev13-1',
      eventId: 'event-13',
      authorName: 'Sofia Viseu',
      authorAvatar: '/assets/profile.svg',
      eventTitle: 'Feira de São Mateus',
      location: 'Rossio, Viseu',
      photo: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80',
      title: 'Carrossel gigante e farturas',
      description: 'A Feira de São Mateus já abriu! Muita animação, farturas quentinhas e diversões para toda a família.',
      time: '2 dias atrás',
      likes: 104,
      liked: false,
      isLive: false,
      comments: []
    },
    {
      id: 'moment-agueda-1',
      eventId: 'event-agueda',
      authorName: 'Gustavo Santos',
      authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=60',
      eventTitle: 'Festival da Lampreia e Leitão',
      location: 'Águeda',
      photo: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
      title: 'Prato de Leitão da Bairrada fantástico!',
      description: 'Estaladiço e no ponto! Recomendo vivamente a visita a Águeda este fim de semana.',
      time: 'AO VIVO',
      likes: 35,
      liked: false,
      isLive: true,
      comments: [
        { id: 1, author: 'Rita', content: 'Que delícia! Vou lá amanhã jantar.' }
      ]
    },
    {
      id: 'moment-agueda-2',
      eventId: 'event-agueda',
      authorName: 'Marta Ribeiro',
      authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&auto=format&fit=crop&q=60',
      eventTitle: 'Festival da Lampreia e Leitão',
      location: 'Águeda',
      photo: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&auto=format&fit=crop&q=80',
      title: 'Concerto de música popular a começar',
      description: 'Grande ambiente na tenda gigante! O recinto está cheio.',
      time: '1 hora atrás',
      likes: 21,
      liked: false,
      isLive: false,
      comments: []
    },
    {
      id: 'moment-feira-1',
      eventId: 'event-feira-marco',
      authorName: 'Pedro Fonseca',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=60',
      eventTitle: 'Feira de Março',
      location: 'Aveiro Expo',
      photo: 'https://images.unsplash.com/photo-1486591978090-58e619d37fe7?w=600&auto=format&fit=crop&q=80',
      title: 'Concerto incrível dos D.A.M.A!',
      description: 'O recinto da feira está ao rubro hoje! Melhor concerto do ano.',
      time: 'Ontem',
      likes: 92,
      liked: false,
      isLive: false,
      comments: [
        { id: 1, author: 'Luís', content: 'Eu também estava lá! Foi brutal.' }
      ]
    },
    {
      id: 'moment-feira-2',
      eventId: 'event-feira-marco',
      authorName: 'Ana Martins',
      authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&auto=format&fit=crop&q=60',
      eventTitle: 'Feira de Março',
      location: 'Aveiro Expo',
      photo: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80',
      title: 'Volta no carrossel gigante e farturas',
      description: 'Uma tradição indispensável de Aveiro. A vista do topo é incrível!',
      time: '3 dias atrás',
      likes: 67,
      liked: false,
      isLive: false,
      comments: []
    },
    {
      id: 'moment-vagueira-1',
      eventId: 'event-vagueira',
      authorName: 'João Costa',
      authorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&auto=format&fit=crop&q=60',
      eventTitle: 'Sunset na Vagueira',
      location: 'Praia da Vagueira, Vagos',
      photo: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
      title: 'Que pôr do sol incrível na praia!',
      description: 'Música espetacular e a melhor vibe da Vagueira. Venham que ainda está a decorrer.',
      time: 'AO VIVO',
      likes: 54,
      liked: false,
      isLive: true,
      comments: [
        { id: 1, author: 'Diana', content: 'Vibe brutal! A caminho.' }
      ]
    },
    {
      id: 'moment-vagueira-2',
      eventId: 'event-vagueira',
      authorName: 'Sandra Lima',
      authorAvatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=80&auto=format&fit=crop&q=60',
      eventTitle: 'Sunset na Vagueira',
      location: 'Praia da Vagueira, Vagos',
      photo: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=600&auto=format&fit=crop&q=80',
      title: 'Sunset à beira-mar com grande música',
      description: 'DJs fantásticos e muitos cocktails! O fim de tarde perfeito.',
      time: 'AO VIVO',
      likes: 48,
      liked: false,
      isLive: true,
      comments: []
    },
    {
      id: 'moment-braga-romana-1',
      eventId: 'event-braga-romana',
      authorName: 'Afonso Guerreiro',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=60',
      eventTitle: 'Braga Romana',
      location: 'Braga',
      photo: 'https://images.unsplash.com/photo-1503174971373-b1f69850bded?w=600&auto=format&fit=crop&q=80',
      title: 'Sentir-me no império romano!',
      description: 'O desfile imperial foi lindo, as roupas estão super detalhadas. Toda a gente vestida a rigor!',
      time: '2 horas atrás',
      likes: 54,
      liked: false,
      isLive: false,
      comments: [
        { id: 1, author: 'Diana', content: 'Que espetáculo! Adorava ter ido.' }
      ]
    },
    {
      id: 'moment-braga-romana-2',
      eventId: 'event-braga-romana',
      authorName: 'Braga Viva',
      authorAvatar: '/assets/profile.svg',
      eventTitle: 'Braga Romana',
      location: 'Braga',
      photo: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop&q=80',
      title: 'Artesãos e mercadores de volta',
      description: 'As bancas de artesanato tradicional já estão abertas na Praça do Município. Venha provar o pão romano cozido em forno de lenha.',
      time: 'LIVE',
      likes: 120,
      liked: false,
      isLive: true,
      comments: []
    },
    {
      id: 'moment-sjoao-porto-1',
      eventId: 'event-sjoao-porto',
      authorName: 'Diana Ramos',
      authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&auto=format&fit=crop&q=60',
      eventTitle: 'São João do Porto',
      location: 'Porto',
      photo: 'https://images.unsplash.com/photo-1486591978090-58e619d37fe7?w=600&auto=format&fit=crop&q=80',
      title: 'Marteladas na Ribeira!',
      description: 'São João não é São João sem levar com um martelo de plástico na cabeça a cada dois passos! Vibe incrível na Ribeira!',
      time: 'LIVE',
      likes: 95,
      liked: false,
      isLive: true,
      comments: [
        { id: 1, author: 'Rui', content: 'Cuidado com os balões de ar quente!' }
      ]
    },
    {
      id: 'moment-sjoao-porto-2',
      eventId: 'event-sjoao-porto',
      authorName: 'Porto Turístico',
      authorAvatar: '/assets/profile.svg',
      eventTitle: 'São João do Porto',
      location: 'Ribeira, Porto',
      photo: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
      title: 'Preparativos para o Fogo de Artifício',
      description: 'As balsas no Rio Douro já estão posicionadas para o grande espetáculo piromusical da meia-noite. Aconselhamos a vir cedo para conseguir o melhor lugar.',
      time: 'LIVE',
      likes: 240,
      liked: false,
      isLive: true,
      comments: []
    },
    {
      id: 'moment-queima-coimbra-1',
      eventId: 'event-queima-coimbra',
      authorName: 'Tiago Doutor',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=60',
      eventTitle: 'Queima das Fitas Coimbra',
      location: 'Coimbra',
      photo: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&auto=format&fit=crop&q=80',
      title: 'Serenata Monumental arrepiante',
      description: 'Ouvir a balada de Coimbra na Sé Velha com milhares de capas negras traçadas... Não há explicação para este sentimento.',
      time: '3 dias atrás',
      likes: 180,
      liked: false,
      isLive: false,
      comments: []
    },
    {
      id: 'moment-queima-coimbra-2',
      eventId: 'event-queima-coimbra',
      authorName: 'AAC Organização',
      authorAvatar: '/assets/profile.svg',
      eventTitle: 'Queima das Fitas Coimbra',
      location: 'Coimbra',
      photo: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&auto=format&fit=crop&q=80',
      title: 'Cortejo das Fitas',
      description: 'Os carros alegóricos já estão prontos para descer a Alta em direção à Baixa. Traga o seu grelo e a sua fita para celebrar connosco!',
      time: 'Ontem',
      likes: 310,
      liked: false,
      isLive: false,
      comments: [
        { id: 1, author: 'Carlos', content: 'Que saudades do meu tempo de estudante!' }
      ]
    },
    {
      id: 'moment-santos-alfama-1',
      eventId: 'event-santos-alfama',
      authorName: 'Beatriz Antunes',
      authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&auto=format&fit=crop&q=60',
      eventTitle: 'Santos Populares em Alfama',
      location: 'Alfama, Lisboa',
      photo: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&auto=format&fit=crop&q=80',
      title: 'Sardinhas na brasa e manjericos',
      description: 'O cheiro a sardinha assada já invadiu as ruelas de Alfama. Comprei este manjerico com uma quadra super gira!',
      time: 'LIVE',
      likes: 87,
      liked: false,
      isLive: true,
      comments: []
    },
    {
      id: 'moment-santos-alfama-2',
      eventId: 'event-santos-alfama',
      authorName: 'Lisboa Eventos',
      authorAvatar: '/assets/profile.svg',
      eventTitle: 'Santos Populares em Alfama',
      location: 'Alfama, Lisboa',
      photo: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&auto=format&fit=crop&q=80',
      title: 'Arraial Popular Oficial',
      description: 'Os palcos já estão montados em Alfama. Junte-se a nós para a grande noite de Santo António com concertos ao vivo até de madrugada.',
      time: 'LIVE',
      likes: 195,
      liked: false,
      isLive: true,
      comments: [
        { id: 1, author: 'Pedro', content: 'O melhor arraial da cidade!' }
      ]
    },
    {
      id: 'moment-evora-classica-1',
      eventId: 'event-evora-classica',
      authorName: 'Mateus Ramos',
      authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=60',
      eventTitle: 'Festival Évora Clássica',
      location: 'Évora',
      photo: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80',
      title: 'Concerto de Chopin sob o Templo',
      description: 'O Templo de Diana iluminado à noite com piano clássico ao fundo... É das experiências mais românticas e relaxantes que já tive.',
      time: '1 dia atrás',
      likes: 62,
      liked: false,
      isLive: false,
      comments: []
    },
    {
      id: 'moment-evora-classica-2',
      eventId: 'event-evora-classica',
      authorName: "Associação Canto d'Évora",
      authorAvatar: '/assets/profile.svg',
      eventTitle: 'Festival Évora Clássica',
      location: 'Évora',
      photo: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80',
      title: 'Abertura do Festival',
      description: 'Sejam bem-vindos à edição deste ano do Festival Évora Clássica. A Orquestra Sinfónica Juvenil abre o certame com as Quatro Estações de Vivaldi.',
      time: '2 dias atrás',
      likes: 145,
      liked: false,
      isLive: false,
      comments: []
    },
    {
      id: 'moment-marisco-olhao-1',
      eventId: 'event-marisco-olhao',
      authorName: 'Juliana Costa',
      authorAvatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=80&auto=format&fit=crop&q=60',
      eventTitle: 'Festival de Marisco',
      location: 'Olhão, Algarve',
      photo: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop&q=80',
      title: 'Banquete de Marisco fresco!',
      description: 'Amêijoas à Bulhão Pato e uma sapateira recheada de comer e chorar por mais. Vale a pena a viagem até Olhão!',
      time: 'LIVE',
      likes: 110,
      liked: false,
      isLive: true,
      comments: [
        { id: 1, author: 'Sara', content: 'Que inveja! Deixa um bocado para mim.' }
      ]
    },
    {
      id: 'moment-marisco-olhao-2',
      eventId: 'event-marisco-olhao',
      authorName: 'Município de Olhão',
      authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&auto=format&fit=crop&q=60',
      eventTitle: 'Festival de Marisco',
      location: 'Olhão, Algarve',
      photo: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop&q=80',
      title: 'Abastecimento da Ria Formosa',
      description: 'Os nossos mariscadores locais garantem marisco fresco capturado diariamente na Ria Formosa. Venha apoiar o setor e deliciar-se.',
      time: 'LIVE',
      likes: 220,
      liked: false,
      isLive: true,
      comments: [
        { id: 1, author: 'Filipe Santos', content: 'Marisco fresco de verdade só mesmo na Ria Formosa!' },
        { id: 2, author: 'Helena Costa', content: 'Parabéns à organização, estava tudo excelente ontem à noite.' }
      ]
    },
    {
      id: 'moment-viana-agonia-1',
      eventId: 'event-viana-agonia',
      authorName: 'Rita Vasconcelos',
      authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=60',
      eventTitle: 'Romaria da Sra. da Agonia',
      location: 'Viana do Castelo',
      photo: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
      title: 'Trajes prontos e ouro ao peito!',
      description: 'O Desfile da Mordomia vai começar e o ouro de Viana já brilha nas ruas! Orgulho enorme nas nossas tradições e na nossa terra.',
      time: 'Há 5 min',
      likes: 184,
      liked: false,
      isLive: true,
      comments: [
        { id: 1, author: 'Maria João', content: 'Que linda! O traje minhoto é o mais bonito do mundo.' },
        { id: 2, author: 'Manuel Barbosa', content: 'Boa sorte no desfile, representa Viana com orgulho!' }
      ]
    },
    {
      id: 'moment-viana-agonia-2',
      eventId: 'event-viana-agonia',
      authorName: 'Assoc. Cultural Vianense',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=60',
      eventTitle: 'Romaria da Sra. da Agonia',
      location: 'Rio Lima, Viana do Castelo',
      photo: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80',
      title: 'Fogo de Artifício sobre o Rio Lima',
      description: 'Tudo a postos para o espetáculo pirotécnico da meia-noite sobre o Rio Lima. Uma tradição que une todos os vianenses.',
      time: 'Hoje às 19:30',
      likes: 312,
      liked: false,
      isLive: false,
      comments: [
        { id: 1, author: 'Carla Dias', content: 'Já estou a guardar lugar na ponte!' }
      ]
    },
    {
      id: 'moment-guimaraes-afonsina-1',
      eventId: 'event-guimaraes-afonsina',
      authorName: 'Rodrigo Lemos',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=60',
      eventTitle: 'Feira Afonsina',
      location: 'Castelo de Guimarães',
      photo: 'https://images.unsplash.com/photo-1503174971373-b1f69850bded?w=600&auto=format&fit=crop&q=80',
      title: 'Regresso à Idade Média',
      description: 'Sensação incrível de caminhar entre cavaleiros, artesãos e bobos da corte ao pé do nosso castelo! Guimarães respira história.',
      time: 'Há 45 min',
      likes: 96,
      liked: false,
      isLive: false,
      comments: [
        { id: 1, author: 'Tiago Ramos', content: 'O hidromel da banca principal está ótimo.' },
        { id: 2, author: 'Beatriz Silva', content: 'A recriação histórica do cerco foi espetacular.' }
      ]
    },
    {
      id: 'moment-guimaraes-afonsina-2',
      eventId: 'event-guimaraes-afonsina',
      authorName: 'Cultura Guimarães',
      authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=60',
      eventTitle: 'Feira Afonsina',
      location: 'Muralhas de Guimarães',
      photo: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop&q=80',
      title: 'Tabernas Históricas abertas',
      description: 'Prove o hidromel tradicional, o porco no espeto e os doces conventuais nas tabernas junto à muralha medieval.',
      time: 'LIVE',
      likes: 215,
      liked: false,
      isLive: true,
      comments: []
    },
    {
      id: 'moment-sintra-pirilampos-1',
      eventId: 'event-sintra-pirilampos',
      authorName: 'Leonor Silva',
      authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&auto=format&fit=crop&q=60',
      eventTitle: 'Caminhada dos Pirilampos',
      location: 'Serra de Sintra',
      photo: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&auto=format&fit=crop&q=80',
      title: 'Mística pura na Serra de Sintra',
      description: 'Caminhar sob o nevoeiro clássico de Sintra à noite, com o som do vento e alguns pirilampos pelo caminho, é mágico.',
      time: 'LIVE',
      likes: 88,
      liked: false,
      isLive: true,
      comments: [
        { id: 1, author: 'Duarte', content: 'Que inveja! Como está a temperatura na serra?' },
        { id: 2, author: 'Leonor Silva', content: 'Está fresco e húmido, traz agasalho!' }
      ]
    },
    {
      id: 'moment-sintra-pirilampos-2',
      eventId: 'event-sintra-pirilampos',
      authorName: 'Sintra Verde Aventura',
      authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=60',
      eventTitle: 'Caminhada dos Pirilampos',
      location: 'Serra de Sintra',
      photo: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=600&auto=format&fit=crop&q=80',
      title: 'Grupo pronto para a partida',
      description: 'Grupo de 50 caminhantes aventureiros equipados com lanternas, prontos a explorar os caminhos secretos da Serra de Sintra.',
      time: 'LIVE',
      likes: 124,
      liked: false,
      isLive: true,
      comments: []
    },
    {
      id: 'moment-setubal-choco-1',
      eventId: 'event-setubal-choco',
      authorName: 'Francisco Neves',
      authorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&auto=format&fit=crop&q=60',
      eventTitle: 'Festival do Choco Frito',
      location: 'Doca de Setúbal',
      photo: 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=600&auto=format&fit=crop&q=80',
      title: 'Melhor choco frito de Portugal!',
      description: 'Paragem obrigatória na doca para comer choco frito super tenro, com limão espremido e um copo de moscatel fresco.',
      time: 'Ontem',
      likes: 147,
      liked: false,
      isLive: false,
      comments: [
        { id: 1, author: 'Sandra Loureiro', content: 'Foste a que restaurante? Tem muita fila?' },
        { id: 2, author: 'Francisco Neves', content: 'Fui ao Leo do Choco Frito. Tinha uns 20 min de espera, mas vale cada segundo!' }
      ]
    },
    {
      id: 'moment-setubal-choco-2',
      eventId: 'event-setubal-choco',
      authorName: 'Setúbal Gastronómica',
      authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&auto=format&fit=crop&q=60',
      eventTitle: 'Festival do Choco Frito',
      location: 'Mercado do Livramento',
      photo: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop&q=80',
      title: 'Showcooking com Chefs Locais',
      description: 'Aprenda a cozinhar o choco de formas criativas com o Chef João no Mercado do Livramento. Entrada livre até esgotar a lotação.',
      time: 'Ontem às 16:30',
      likes: 93,
      liked: false,
      isLive: false,
      comments: []
    },
    {
      id: 'moment-portalegre-rali-1',
      eventId: 'event-portalegre-rali',
      authorName: 'Rui Campino',
      authorAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&auto=format&fit=crop&q=60',
      eventTitle: 'Rali de Portalegre 500',
      location: 'Portalegre',
      photo: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&auto=format&fit=crop&q=80',
      title: 'Muita poeira e adrenaline!',
      description: 'O troço das ribeiras de Portalegre é o mais espetacular do rali. As máquinas estão a voar sobre a terra batida e a passar os vaus de água!',
      time: 'LIVE',
      likes: 210,
      liked: false,
      isLive: true,
      comments: [
        { id: 1, author: 'Luís Rebelo', content: 'Que foto brutal! Consegues ver os quads?' },
        { id: 2, author: 'Rui Campino', content: 'Sim, os quads passam daqui a 10 minutos!' }
      ]
    },
    {
      id: 'moment-portalegre-rali-2',
      eventId: 'event-portalegre-rali',
      authorName: 'ACP Sport',
      authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=60',
      eventTitle: 'Rali de Portalegre 500',
      location: 'Portalegre',
      photo: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=600&auto=format&fit=crop&q=80',
      title: 'Partida do Troço Especial',
      description: 'Primeira moto na pista para a super especial de Portalegre. Vibe espetacular com milhares de espetadores ao longo do circuito.',
      time: 'LIVE',
      likes: 380,
      liked: false,
      isLive: true,
      comments: []
    },
    {
      id: 'moment-beja-ovibeja-1',
      eventId: 'event-beja-ovibeja',
      authorName: 'Mariana Bento',
      authorAvatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=80&auto=format&fit=crop&q=60',
      eventTitle: 'Ovibeja',
      location: 'Beja',
      photo: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&auto=format&fit=crop&q=80',
      title: 'Cante Alentejano arrepiante',
      description: 'Ouvir o grupo coral na Ovibeja arrepiou-me até aos ossos. Que tradição tão bonita que passa de geração em geração no Alentejo.',
      time: '2 dias atrás',
      likes: 125,
      liked: false,
      isLive: false,
      comments: [
        { id: 1, author: 'Joana', content: 'Lindo! O cante alentejano é património mundial com toda a justiça.' }
      ]
    },
    {
      id: 'moment-beja-ovibeja-2',
      eventId: 'event-beja-ovibeja',
      authorName: 'ACOS Organização',
      authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&auto=format&fit=crop&q=60',
      eventTitle: 'Ovibeja',
      location: 'Parque de Exposições, Beja',
      photo: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&auto=format&fit=crop&q=80',
      title: 'Inovação Agrícola em Beja',
      description: 'Apresentação dos novos sistemas de rega e tecnologia sustentável no pavilhão de conferências tecnológicas. Grande afluência de profissionais.',
      time: '3 dias atrás',
      likes: 74,
      liked: false,
      isLive: false,
      comments: []
    },
    {
      id: 'moment-portimao-sardinha-1',
      eventId: 'event-portimao-sardinha',
      authorName: 'Vasco Martins',
      authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=60',
      eventTitle: 'Festival da Sardinha',
      location: 'Portimão',
      photo: 'https://images.unsplash.com/photo-1534482421-64566f976cfa?w=600&auto=format&fit=crop&q=80',
      title: 'Sardinhas gordas a pingar no pão!',
      description: 'A sardinha está fantástica, bem gorda e no ponto de sal. Comer com a mão e pingar no pão de milho alentejano é obrigatório aqui em Portimão!',
      time: 'LIVE',
      likes: 198,
      liked: false,
      isLive: true,
      comments: [
        { id: 1, author: 'Fábio Melo', content: 'Que inveja, rapaz! Acompanha com uma salada algarvia!' }
      ]
    },
    {
      id: 'moment-portimao-sardinha-2',
      eventId: 'event-portimao-sardinha',
      authorName: 'Portimão Turismo',
      authorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&auto=format&fit=crop&q=60',
      eventTitle: 'Festival da Sardinha',
      location: 'Portimão, Algarve',
      photo: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
      title: 'Grande concerto ribeirinho',
      description: 'O palco principal na zona ribeirinha recebe hoje a fadista Carminho ao pôr do sol. Entrada livre, junte-se à festa!',
      time: 'LIVE',
      likes: 310,
      liked: false,
      isLive: true,
      comments: []
    },
    {
      id: 'moment-faro-f-1',
      eventId: 'event-faro-f',
      authorName: 'Sara Pinheiro',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=60',
      eventTitle: 'Festival F',
      location: 'Cidade Velha, Faro',
      photo: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
      title: 'Melhor festival urbano do sul!',
      description: 'Os palcos montados dentro das muralhas históricas da Vila Adentro criam uma atmosfera intimista e mágica. Adoro este festival!',
      time: 'LIVE',
      likes: 165,
      liked: false,
      isLive: true,
      comments: [
        { id: 1, author: 'Margarida', content: 'O concerto dos D.A.M.A esteve incrível!' }
      ]
    },
    {
      id: 'moment-faro-f-2',
      eventId: 'event-faro-f',
      authorName: 'Festival F Oficial',
      authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&auto=format&fit=crop&q=60',
      eventTitle: 'Festival F',
      location: 'Vila Adentro, Faro',
      photo: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
      title: 'Palco Muralha esgotado!',
      description: 'Lotação esgotada no Palco Muralha para receber Pedro Abrunhosa. Que noite absolutamente inesquecível no centro de Faro.',
      time: 'LIVE',
      likes: 420,
      liked: false,
      isLive: true,
      comments: []
    },
    {
      id: 'moment-ev3-1',
      eventId: 'event-3',
      authorName: 'Sílvia Aguiar',
      authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&auto=format&fit=crop&q=60',
      eventTitle: 'Quintas com tricot',
      location: 'Parque Infante D. Pedro, Aveiro',
      photo: 'https://images.unsplash.com/photo-1606744824163-985d376605aa?w=600&auto=format&fit=crop&q=80',
      title: 'Tricotar ao ar livre',
      description: 'Uma tarde super produtiva no parque da cidade. O tempo está ótimo para pôr a conversa em dia enquanto tricotamos cachecóis!',
      time: 'Há 3 horas',
      likes: 24,
      liked: false,
      isLive: false,
      comments: [
        { id: 1, author: 'Helena', content: 'Que lã maravilhosa! Onde compraste?' }
      ]
    },
    {
      id: 'moment-ev3-2',
      eventId: 'event-3',
      authorName: 'Rita Ramos',
      authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&auto=format&fit=crop&q=60',
      eventTitle: 'Quintas com tricot',
      location: 'Parque Infante D. Pedro, Aveiro',
      photo: 'https://images.unsplash.com/photo-1608748010899-18f300247112?w=600&auto=format&fit=crop&q=80',
      title: 'Primeira mala terminada!',
      description: 'Finalmente acabei o meu projeto de crochet. Adorei a ajuda das companheiras do clube!',
      time: 'Ontem',
      likes: 38,
      liked: false,
      isLive: false,
      comments: []
    },
    {
      id: 'moment-quiz-1',
      eventId: 'event-quiz',
      authorName: 'Joana Martins',
      authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=60',
      eventTitle: 'Noites de Quiz Dr. Why',
      location: 'Bustos',
      photo: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
      title: 'Quase no topo!',
      description: 'A nossa equipa ficou em 2º lugar esta semana! A pergunta sobre geografia rasteira custou-nos a vitória. Vibe excelente!',
      time: '2 dias atrás',
      likes: 45,
      liked: false,
      isLive: false,
      comments: [
        { id: 1, author: 'Filipe', content: 'Na próxima semana levamos a taça!' }
      ]
    },
    {
      id: 'moment-quiz-2',
      eventId: 'event-quiz',
      authorName: 'Carlos Pires',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=60',
      eventTitle: 'Noites de Quiz Dr. Why',
      location: 'Bustos',
      photo: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
      title: 'Casa cheia no Quiz',
      description: 'Super divertido! O comando sem fios falhou uma vez, mas rimo-nos imenso. Grande noite no HardBar.',
      time: '2 dias atrás',
      likes: 29,
      liked: false,
      isLive: false,
      comments: []
    },
    {
      id: 'moment-ev1-2',
      eventId: 'event-1',
      authorName: 'Rui Martins',
      authorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&auto=format&fit=crop&q=60',
      eventTitle: 'Concerto no Hardbar',
      location: 'Bustos',
      photo: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
      title: 'Marcvs de volta!',
      description: 'Que concerto arrepiante! A interpretação acústica de "Ria Formosa" foi espetacular.',
      time: 'Há 18 horas',
      likes: 56,
      liked: false,
      isLive: false,
      comments: []
    },
    {
      id: 'moment-ev2-3',
      eventId: 'event-2',
      authorName: 'Sandro Neves',
      authorAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&auto=format&fit=crop&q=60',
      eventTitle: 'Cicloturismo - AEE',
      location: 'Esgueira, Aveiro',
      photo: 'https://images.unsplash.com/photo-1541614101331-1a5a3a194e92?w=600&auto=format&fit=crop&q=80',
      title: 'Pausa para água e fruta',
      description: 'Metade do percurso já está concluída. As pernas doem mas a paisagem sobre a ria compensa tudo!',
      time: 'LIVE',
      likes: 64,
      liked: false,
      isLive: true,
      comments: []
    },
    {
      id: 'moment-ev11-2',
      eventId: 'event-11',
      authorName: 'Diana Antunes',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=60',
      eventTitle: 'Passeio Moliceiro ao Pôr do Sol',
      location: 'Canais de Aveiro',
      photo: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=600&auto=format&fit=crop&q=80',
      title: 'Cores mágicas sobre os canais',
      description: 'O canal central de Aveiro está com um tom dourado lindíssimo hoje. Recomendo muito fazer o passeio a esta hora.',
      time: 'LIVE',
      likes: 95,
      liked: false,
      isLive: true,
      comments: []
    },
    {
      id: 'moment-ev4-3',
      eventId: 'event-4',
      authorName: 'Guilherme Silva',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=60',
      eventTitle: 'Workshop de Ovos Moles',
      location: 'Oficina do Doce, Aveiro',
      photo: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&auto=format&fit=crop&q=80',
      title: 'Amassar com carinho',
      description: 'A aprender a rechear as hóstias dos ovos moles na Oficina do Doce. Muito mais difícil do que parece!',
      time: 'Há 2 horas',
      likes: 47,
      liked: false,
      isLive: false,
      comments: []
    },
    {
      id: 'moment-ev5-3',
      eventId: 'event-5',
      authorName: 'Patrícia Costa',
      authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=60',
      eventTitle: 'Feira de Março',
      location: 'Parque de Feiras e Exposições, Aveiro',
      photo: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80',
      title: 'Luzes e diversão!',
      description: 'A Feira de Março está incrível este ano! A roda gigante tem uma vista fantástica sobre Aveiro à noite.',
      time: 'LIVE',
      likes: 112,
      liked: false,
      isLive: true,
      comments: []
    },
    {
      id: 'moment-ev6-3',
      eventId: 'event-6',
      authorName: 'Carlos Pires',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=60',
      eventTitle: 'Jazz no Parque',
      location: 'Jardim Oudinot, Gafanha da Nazaré',
      photo: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&auto=format&fit=crop&q=80',
      title: 'Solo espetacular!',
      description: 'O saxofonista acabou de dar um espetáculo incrível no Parque Infante D. Pedro. Que final de tarde agradável.',
      time: 'Há 4 horas',
      likes: 67,
      liked: false,
      isLive: false,
      comments: []
    },
    {
      id: 'moment-ev7-3',
      eventId: 'event-7',
      authorName: 'Margarida Santos',
      authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&auto=format&fit=crop&q=60',
      eventTitle: 'Festival do Moliceiro',
      location: 'Canais de Aveiro',
      photo: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&auto=format&fit=crop&q=80',
      title: 'Corrida de Moliceiros',
      description: 'Os barcos moliceiros à vela estão a dar espetáculo na ria. O colorido das velas é indescritível!',
      time: 'Ontem',
      likes: 83,
      liked: false,
      isLive: false,
      comments: []
    },
    {
      id: 'moment-ev8-3',
      eventId: 'event-8',
      authorName: 'João Fernandes',
      authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=60',
      eventTitle: 'Torneio de Padel',
      location: 'Cacia, Aveiro',
      photo: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&auto=format&fit=crop&q=80',
      title: 'Match point!',
      description: 'Grande final masculina no Torneio de Padel de Cacia. A dupla local está a dar tudo!',
      time: 'LIVE',
      likes: 58,
      liked: false,
      isLive: true,
      comments: []
    },
    {
      id: 'moment-ev9-2',
      eventId: 'event-9',
      authorName: 'Sofia Martins',
      authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&auto=format&fit=crop&q=60',
      eventTitle: 'Arte Nova Street Art Tour',
      location: 'Canais de Aveiro',
      photo: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=600&auto=format&fit=crop&q=80',
      title: 'Cores na cidade',
      description: 'A descobrir a fantástica Arte Nova e arte urbana escondida nas ruas de Aveiro nesta visita guiada.',
      time: 'Há 5 horas',
      likes: 72,
      liked: false,
      isLive: false,
      comments: []
    },
    {
      id: 'moment-ev13-2',
      eventId: 'event-13',
      authorName: 'Tiago Rocha',
      authorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&auto=format&fit=crop&q=60',
      eventTitle: 'Workshop de Cerâmica Vista Alegre',
      location: 'Fábrica Vista Alegre, Ílhavo',
      photo: 'https://images.unsplash.com/photo-1576016770956-debb63d900fe?w=600&auto=format&fit=crop&q=80',
      title: 'A modelar o barro',
      description: 'Primeira vez na roda de oleiro na Fábrica Vista Alegre. Uma experiência terapêutica fantástica!',
      time: 'Há 1 dia',
      likes: 91,
      liked: false,
      isLive: false,
      comments: []
    },
    {
      id: 'moment-ev10-2',
      eventId: 'event-10',
      authorName: 'Ana Rodrigues',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=60',
      eventTitle: 'Feira do Livro de Aveiro',
      location: 'Cais da Fonte Nova, Aveiro',
      photo: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=600&auto=format&fit=crop&q=80',
      title: 'Novas leituras',
      description: 'Consegui encontrar duas edições raras na Feira do Livro de Aveiro. A zona ribeirinha está muito acolhedora!',
      time: 'Há 3 horas',
      likes: 64,
      liked: false,
      isLive: false,
      comments: []
    }
  ]);

  const [currentTab, setCurrentTab] = useState('feed'); // 'feed' | 'camera' | 'map'
  const [activeStoryEventId, setActiveStoryEventId] = useState(null);
  const [viewingEventId, setViewingEventId] = useState(null);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [expandedMomentId, setExpandedMomentId] = useState(null);
  const [storyTimeProgress, setStoryTimeProgress] = useState(0);
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [activeCommentsMomentId, setActiveCommentsMomentId] = useState(null);

  // New Event Form State
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDesc, setNewEventDesc] = useState('');
  const [newEventImg, setNewEventImg] = useState(STOCK_IMAGES[0].url);
  const [customEventImg, setCustomEventImg] = useState(null);
  const [newEventDate, setNewEventDate] = useState('Hoje, 12:00');
  const [newEventLocation, setNewEventLocation] = useState('');

  // Comment Input State
  const [newCommentText, setNewCommentText] = useState('');

  // User Profile State
  const [viewingUser, setViewingUser] = useState(null);
  const [userProfileTab, setUserProfileTab] = useState('contributos'); // 'contributos' | 'guardados'

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
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [registerAccountType, setRegisterAccountType] = useState('Pessoal'); // 'Pessoal' | 'Organização'
  const [registerError, setRegisterError] = useState('');
  const [registerAvatar, setRegisterAvatar] = useState('/assets/profile.svg');
  // DateTimePicker State
  const [isDateTimePickerOpen, setIsDateTimePickerOpen] = useState(false);
  const [pickerTab, setPickerTab] = useState('date'); // 'date' | 'time'
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 5, 11)); // June 11, 2026 as shown in screenshot
  const [selectedHour, setSelectedHour] = useState(12);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [isAllDay, setIsAllDay] = useState(false);
  const [currentPickerMonth, setCurrentPickerMonth] = useState(5); // June
  const [currentPickerYear, setCurrentPickerYear] = useState(2026);

  // DateTimePicker helper functions
  const daysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };
  const startDayOfWeek = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const confirmDateTimeSelection = () => {
    const formattedHour = selectedHour.toString().padStart(2, '0');
    const formattedMinute = selectedMinute.toString().padStart(2, '0');

    const isToday = selectedDate.getDate() === 11 && selectedDate.getMonth() === 5 && selectedDate.getFullYear() === 2026;

    let dateStr = '';
    if (isToday) {
      dateStr = 'Hoje';
    } else {
      const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
      dateStr = `${selectedDate.getDate()} de ${months[selectedDate.getMonth()]}`;
    }

    const timeStr = isAllDay ? 'Todo o dia' : `${formattedHour}:${formattedMinute}`;
    setNewEventDate(`${dateStr}, ${timeStr}`);
    setIsDateTimePickerOpen(false);
  };

  const formatDateLabel = (date) => {
    const monthsShort = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const isToday = date.getDate() === 11 && date.getMonth() === 5 && date.getFullYear() === 2026;
    if (isToday) return 'Hoje';
    return `${date.getDate()} ${monthsShort[date.getMonth()]}`;
  };

  const formatTimeLabel = (h, m) => {
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (isDateTimePickerOpen && pickerTab === 'time' && !isAllDay) {
      setTimeout(() => {
        const itemHeight = 40;
        if (hourScrollRef.current) {
          hourScrollRef.current.scrollTop = (selectedHour + 48) * itemHeight;
        }
        if (minuteScrollRef.current) {
          const minutesArray = getMinutesRange();
          const minuteIndex = minutesArray.indexOf(selectedMinute);
          if (minuteIndex !== -1) {
            minuteScrollRef.current.scrollTop = (minuteIndex + minutesArray.length * 2) * itemHeight;
          }
        }
      }, 50);
    }
  }, [isDateTimePickerOpen, pickerTab, isAllDay]);

  const handleHoursScroll = (e) => {
    const container = e.target;
    const itemHeight = 40;
    const scrollTop = container.scrollTop;
    const cycleHeight = 24 * itemHeight;

    if (scrollTop < cycleHeight * 1.5) {
      container.scrollTop += cycleHeight;
      return;
    } else if (scrollTop > cycleHeight * 3.5) {
      container.scrollTop -= cycleHeight;
      return;
    }

    const calculatedHour = Math.round((scrollTop - cycleHeight * 2) / itemHeight) % 24;
    const hour = (calculatedHour + 24) % 24;

    if (selectedHour !== hour) {
      setSelectedHour(hour);
    }
  };

  const handleMinutesScroll = (e) => {
    const container = e.target;
    const itemHeight = 40;
    const scrollTop = container.scrollTop;
    const minutesArray = getMinutesRange();
    const len = minutesArray.length;
    const cycleHeight = len * itemHeight;

    if (scrollTop < cycleHeight * 1.5) {
      container.scrollTop += cycleHeight;
      return;
    } else if (scrollTop > cycleHeight * 3.5) {
      container.scrollTop -= cycleHeight;
      return;
    }

    const calculatedIndex = Math.round((scrollTop - cycleHeight * 2) / itemHeight) % len;
    const index = (calculatedIndex + len) % len;
    const minute = minutesArray[index];

    if (selectedMinute !== minute) {
      setSelectedMinute(minute);
    }
  };

  const renderHoursList = () => {
    const hours = getHoursRange();
    const quintupleHours = [...hours, ...hours, ...hours, ...hours, ...hours];
    return quintupleHours.map((h, i) => {
      const isSelected = selectedHour === h;
      return (
        <div
          key={`h-${i}`}
          className={`time-wheel-item ${isSelected ? 'active' : ''}`}
          onClick={(e) => {
            setSelectedHour(h);
            const container = e.currentTarget.parentElement.parentElement;
            const itemHeight = 40;
            const cycleIndex = i % 24;
            container.scrollTop = (cycleIndex + 48) * itemHeight;
          }}
        >
          {h.toString().padStart(2, '0')}
        </div>
      );
    });
  };

  const renderMinutesList = () => {
    const minutes = getMinutesRange();
    const len = minutes.length;
    const quintupleMinutes = [...minutes, ...minutes, ...minutes, ...minutes, ...minutes];
    return quintupleMinutes.map((m, i) => {
      const isSelected = selectedMinute === m;
      return (
        <div
          key={`m-${i}`}
          className={`time-wheel-item ${isSelected ? 'active' : ''}`}
          onClick={(e) => {
            setSelectedMinute(m);
            const container = e.currentTarget.parentElement.parentElement;
            const itemHeight = 40;
            const cycleIndex = i % len;
            container.scrollTop = (cycleIndex + len * 2) * itemHeight;
          }}
        >
          {m.toString().padStart(2, '0')}
        </div>
      );
    });
  };

  const getMonthYearLabel = (month, year) => {
    const months = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
    return `${months[month]} de ${year}`;
  };

  const prevMonth = () => {
    if (currentPickerMonth === 0) {
      setCurrentPickerMonth(11);
      setCurrentPickerYear(currentPickerYear - 1);
    } else {
      setCurrentPickerMonth(currentPickerMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentPickerMonth === 11) {
      setCurrentPickerMonth(0);
      setCurrentPickerYear(currentPickerYear + 1);
    } else {
      setCurrentPickerMonth(currentPickerMonth + 1);
    }
  };

  const getHoursRange = () => {
    return Array.from({ length: 24 }, (_, i) => i);
  };

  const getMinutesRange = () => {
    return Array.from({ length: 12 }, (_, i) => i * 5);
  };

  const addHoursToCurrent = (h) => {
    const newHour = (selectedHour + h) % 24;
    setSelectedHour(newHour);
    const itemHeight = 40;
    if (hourScrollRef.current) {
      hourScrollRef.current.scrollTop = (newHour + 48) * itemHeight;
    }
  };

  const setSpecificTime = (h, m) => {
    setSelectedHour(h);
    setSelectedMinute(m);
    const itemHeight = 40;
    if (hourScrollRef.current) {
      hourScrollRef.current.scrollTop = (h + 48) * itemHeight;
    }
    if (minuteScrollRef.current) {
      const minutesArray = getMinutesRange();
      const minuteIndex = minutesArray.indexOf(m);
      if (minuteIndex !== -1) {
        minuteScrollRef.current.scrollTop = (minuteIndex + minutesArray.length * 2) * itemHeight;
      }
    }
  };

  const renderCalendarDays = () => {
    const totalDays = daysInMonth(currentPickerYear, currentPickerMonth);
    const startDay = startDayOfWeek(currentPickerYear, currentPickerMonth);

    const prevMonthDays = daysInMonth(currentPickerYear, currentPickerMonth - 1);
    const cells = [];

    for (let i = startDay - 1; i >= 0; i--) {
      const dayNum = prevMonthDays - i;
      cells.push(
        <span key={`prev-${dayNum}`} className="calendar-day-cell sibling-month">
          {dayNum}
        </span>
      );
    }

    for (let d = 1; d <= totalDays; d++) {
      const isSelected = selectedDate.getDate() === d &&
        selectedDate.getMonth() === currentPickerMonth &&
        selectedDate.getFullYear() === currentPickerYear;

      cells.push(
        <span
          key={`day-${d}`}
          className={`calendar-day-cell ${isSelected ? 'selected' : ''}`}
          onClick={() => setSelectedDate(new Date(currentPickerYear, currentPickerMonth, d))}
        >
          {d}
        </span>
      );
    }

    const remaining = 42 - cells.length;
    for (let n = 1; n <= remaining; n++) {
      cells.push(
        <span key={`next-${n}`} className="calendar-day-cell sibling-month">
          {n}
        </span>
      );
    }

    return cells;
  };

  // Preload key images in the background on mount
  useEffect(() => {
    const imagesToPreload = [
      '/assets/logo.svg',
      '/assets/profile.svg',
      '/assets/plus.svg',
      '/assets/map.svg',
      '/assets/camera.svg',
      '/assets/nav-camera.svg',
      '/assets/nav-map.svg',
      '/assets/nav-profile.svg',
      '/assets/hardbar_thumb.png',
      '/assets/hardbar_avatar.png',
      '/assets/hardbar_photo.png',
      '/assets/aee_avatar.png',
      '/assets/aee_photo.png',
      '/assets/cicloturismo_thumb.png',
      '/assets/quiz_photo.png',
      '/assets/tricot_thumb.png',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80'
    ];
    imagesToPreload.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const openUserProfile = (userName, avatar) => {
    setNavHistory((prev) => {
      const nextHist = [...prev, { tab: currentTab, viewingUser: viewingUser, viewingEventId: viewingEventId }];
      if (nextHist.length > 20) nextHist.shift();
      return nextHist;
    });

    let role = 'Pessoal';
    let bio = 'Amante de Aveiro, partilho momentos e vibes!';
    let banner = 'https://images.unsplash.com/photo-1486591978090-58e619d37fe7?w=600&auto=format&fit=crop&q=80';

    if (currentUser && userName === currentUser.name) {
      if (currentUser.accountType === 'Organização') {
        role = 'Organização';
        bio = 'Organização oficial parceira do Polariscope.';
      } else {
        role = 'Pessoal';
      }
    } else if (userName.toLowerCase().includes('hardbar') || userName.toLowerCase().includes('hard bar')) {
      role = 'Organização';
      bio = 'Cozinha com amor, ingredientes frescos e momentos felizes.';
      banner = '/assets/hardbar_photo.png';
    } else if (userName.toLowerCase().includes('esgueira') || userName.toLowerCase().includes('aee')) {
      role = 'Organização';
      bio = 'Comunidade escolar unida pelo desporto e aprendizagem.';
      banner = '/assets/aee_photo.png';
    } else if (userName.toLowerCase().includes('tricot')) {
      role = 'Organização';
      bio = 'Ponto por ponto, partilhamos histórias e novelos.';
      banner = '/assets/tricot_thumb.png';
    } else if (userName.toLowerCase().includes('oficina') || userName.toLowerCase().includes('doce')) {
      role = 'Organização';
      bio = 'A arte tradicional dos Ovos Moles de Aveiro.';
      banner = 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80';
    } else if (userName.toLowerCase().includes('surf')) {
      role = 'Organização';
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
    setUserProfileTab('contributos');
    setViewingEventId(null);
  };

  const handleEventClick = (eventId) => {
    if (!eventId) return;
    setNavHistory((prev) => {
      const nextHist = [...prev, { tab: currentTab, viewingUser: viewingUser, viewingEventId: viewingEventId }];
      if (nextHist.length > 20) nextHist.shift();
      return nextHist;
    });
    setCurrentTab('feed');
    setViewingEventId(eventId);
    setViewingUser(null);
    setExpandedMomentId(null);
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
  const [cameraOnboardingStep, setCameraOnboardingStep] = useState(null); // null | 'event' | 'location'
  const [hasSeenCameraOnboarding, setHasSeenCameraOnboarding] = useState(false);
  const [eventSearchQuery, setEventSearchQuery] = useState('');
  const [locationSearchQuery, setLocationSearchQuery] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [postTag1, setPostTag1] = useState('');
  const [postTag2, setPostTag2] = useState('');
  const [postTag3, setPostTag3] = useState('');
  const [postDescription, setPostDescription] = useState('');
  const [isBottomSheetCollapsed, setIsBottomSheetCollapsed] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [drafts, setDrafts] = useState([]);
  const [savedEvents, setSavedEvents] = useState([]);
  const [likedEvents, setLikedEvents] = useState([]);
  const [savedMoments, setSavedMoments] = useState([]);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editProfileName, setEditProfileName] = useState('');
  const [editProfileBio, setEditProfileBio] = useState('');
  const [editProfileRole, setEditProfileRole] = useState('Pessoal');
  const profileBannerInputRef = useRef(null);

  // UI animations
  const [animateHeartMomentId, setAnimateHeartMomentId] = useState(null);

  // Map Ref
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const radiusCircleRef = useRef(null);
  const radiusCenterMarkerRef = useRef(null);

  // Video Ref
  const videoRef = useRef(null);

  // File Input Ref for gallery selection
  const fileInputRef = useRef(null);
  const eventFileInputRef = useRef(null);
  const profileAvatarInputRef = useRef(null);
  const hourScrollRef = useRef(null);
  const minuteScrollRef = useRef(null);

  // Ref to track mouse/pointer down coordinates for moment clicks
  const momentMouseDownPosRef = useRef({ x: 0, y: 0, time: 0 });

  const handleMomentClick = (e, momentId) => {
    const start = momentMouseDownPosRef.current;
    const dist = Math.hypot(e.clientX - start.x, e.clientY - start.y);
    // If the user dragged more than 8px, it is considered a scroll gesture, not a click
    if (dist > 8) {
      return;
    }
    setExpandedMomentId(momentId);
  };

  // Active event press gesture ref
  const activeEventPressRef = useRef({
    timer: null,
    isLongPress: false,
    eventId: null,
    startX: 0,
    startY: 0,
    cancelled: false
  });

  const handleEventPressStart = (e, eventId) => {
    if (e.button !== undefined && e.button !== 0) return;
    if (activeEventPressRef.current.timer) {
      clearTimeout(activeEventPressRef.current.timer);
    }
    activeEventPressRef.current = {
      timer: setTimeout(() => {
        activeEventPressRef.current.isLongPress = true;
        if (navigator.vibrate) {
          try {
            navigator.vibrate(50);
          } catch (err) {
            console.error("Vibration error:", err);
          }
        }
        setSelectedEventId(prev => prev === eventId ? null : eventId);
      }, 500),
      isLongPress: false,
      eventId: eventId,
      startX: e.clientX,
      startY: e.clientY,
      cancelled: false
    };
  };

  const handleEventPressMove = (e) => {
    const state = activeEventPressRef.current;
    if (state.cancelled || !state.timer) return;
    const dist = Math.hypot(e.clientX - state.startX, e.clientY - state.startY);
    if (dist > 8) {
      if (state.timer) clearTimeout(state.timer);
      state.timer = null;
      state.cancelled = true;
    }
  };

  const handleEventPressEnd = (e, eventId) => {
    const state = activeEventPressRef.current;
    if (state.timer) {
      clearTimeout(state.timer);
    }
    if (!state.cancelled && !state.isLongPress && state.eventId === eventId) {
      if (selectedEventId !== null) {
        setSelectedEventId(null);
      } else {
        handleEventClick(eventId);
      }
    }
    activeEventPressRef.current = {
      timer: null,
      isLongPress: false,
      eventId: null,
      startX: 0,
      startY: 0,
      cancelled: false
    };
  };

  const handleEventPressCancel = () => {
    const state = activeEventPressRef.current;
    if (state.timer) {
      clearTimeout(state.timer);
    }
    state.timer = null;
    state.cancelled = true;
  };

  // Dynamic moments generator for all 31 events (ensures each has at least 5 moments)
  useEffect(() => {
    const extraAuthors = [
      { name: 'Bernardo Costa', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=60' },
      { name: 'Mariana Santos', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=60' },
      { name: 'José Rodrigues', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=60' },
      { name: 'Catarina Martins', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&auto=format&fit=crop&q=60' },
      { name: 'Miguel Oliveira', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&auto=format&fit=crop&q=60' },
      { name: 'Leonor Pires', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=60' },
      { name: 'Soraia Fonseca', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&auto=format&fit=crop&q=60' }
    ];

    const categoryData = {
      music: {
        photos: [
          'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&auto=format&fit=crop&q=80'
        ],
        titles: [
          'Espetáculo de som e luz!',
          'Que energia contagiante!',
          'Melhor concerto do ano!',
          'A plateia ao rubro!',
          'Acústica fantástica.',
          'Mais uma música incrível!'
        ],
        descriptions: [
          'Os efeitos visuais estão qualquer coisa de espetacular. Recomendo muito vir ver ao vivo!',
          'Toda a gente a cantar em uníssono. Uma noite inesquecível no meio do público!',
          'Os solos de guitarra foram simplesmente brilhantes. Vibe excelente!',
          'Não há nada como sentir a música ao vivo. Que grande momento!',
          'A melodia perfeita para um final de dia espetacular com amigos.',
          'Mais uma música que nos fez saltar a todos. Energia no topo!'
        ]
      },
      sports: {
        photos: [
          'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1541614101331-1a5a3a194e92?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=600&auto=format&fit=crop&q=80'
        ],
        titles: [
          'Superação total!',
          'Equipa fantástica.',
          'Esforço recompensado!',
          'A caminho da meta!',
          'Grande jogada.',
          'Desporto ao ar livre!'
        ],
        descriptions: [
          'Dar tudo até ao último segundo. O esforço físico foi enorme mas valeu muito a pena!',
          'Grande espírito de união e entreajuda. Juntos somos muito mais fortes!',
          'Treino de hoje concluído com a melhor sensação de dever cumprido. Fantástico!',
          'A manter o ritmo firme enquanto a meta se aproxima. Vibe desportiva fantástica!',
          'Um ponto espetacular jogado com garra. O nível técnico está muito alto!',
          'Nada se compara a praticar desporto rodeado por esta paisagem natural única.'
        ]
      },
      crafts: {
        photos: [
          'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1606744824163-985d376605aa?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1576016770956-debb63d900fe?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=600&auto=format&fit=crop&q=80'
        ],
        titles: [
          'Pormenores criativos.',
          'Foco no detalhe!',
          'Arte em progresso.',
          'Projeto manual!',
          'Modelagem relaxante.',
          'Mistura de cores.'
        ],
        descriptions: [
          'A dar os últimos retoques neste trabalho artístico feito à mão. Terapia pura!',
          'Os detalhes minuciosos fazem toda a diferença na peça final. Dedicação total!',
          'Processo criativo ativo. Ver a peça a ganhar forma é das melhores sensações!',
          'Trabalho manual muito estimulante. A partilhar ideias e técnicas novas hoje!',
          'Sentir a plasticidade dos materiais nas mãos. Excelente workshop!',
          'A explorar novas combinações de tonalidades vibrantes. Lindo de ver!'
        ]
      },
      food: {
        photos: [
          'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1534482421-64566f976cfa?w=600&auto=format&fit=crop&q=80'
        ],
        titles: [
          'Delícia gastronómica!',
          'Ingredientes frescos.',
          'Sabor tradicional!',
          'Apresentação de chef.',
          'Cozinhar com amor!',
          'Petiscos saborosos.'
        ],
        descriptions: [
          'A provar esta especialidade local irresistível. Explosão de sabores única!',
          'Prato confecionado apenas com produtos frescos da região. Saudável e saboroso!',
          'A receita tradicional que nunca desilude. Conforto gastronómico excelente!',
          'O empratamento está lindíssimo e o sabor supera todas as expectativas.',
          'Partilhar truques de cozinha no workshop culinário. Muito enriquecedor!',
          'Tarde excelente de petiscos com amigos na esplanada. Recomendo imenso!'
        ]
      },
      culture: {
        photos: [
          'https://images.unsplash.com/photo-1472653431158-6364773b2a56?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=600&auto=format&fit=crop&q=80'
        ],
        titles: [
          'Património incrível.',
          'Tradição viva!',
          'Cores festivas.',
          'Passeio cultural.',
          'Momento único.',
          'Partilha de saberes.'
        ],
        descriptions: [
          'A contemplar a riqueza arquitetónica e histórica deste local fantástico.',
          'Costumes e saberes que passam de geração em geração. Lindo de assistir!',
          'As decorações tradicionais dão uma alma única a este evento festivo.',
          'A descobrir recantos repletos de história na visita guiada de hoje.',
          'Um registo fotográfico especial para recordar este dia tão dinâmico.',
          'Conversas interessantes e partilha de histórias marcantes com toda a gente.'
        ]
      }
    };

    const getEventCategory = (evtId, evtTitle) => {
      const id = evtId.toLowerCase();
      const title = evtTitle.toLowerCase();
      if (id.includes('concert') || id.includes('jazz') || id.includes('faro-f') || id.includes('classica') || title.includes('concerto') || title.includes('jazz') || title.includes('fado') || title.includes('música')) {
        return 'music';
      }
      if (id.includes('ciclo') || id.includes('padel') || id.includes('pirilampo') || id.includes('rali') || title.includes('cicloturismo') || title.includes('padel') || title.includes('caminhada') || title.includes('rali') || title.includes('torneio')) {
        return 'sports';
      }
      if (id.includes('tricot') || id.includes('ceram') || id.includes('arte') || title.includes('tricot') || title.includes('cerâmica') || title.includes('arte') || title.includes('workshop')) {
        return 'crafts';
      }
      if (id.includes('ovo') || id.includes('marisco') || id.includes('choco') || id.includes('sardinha') || id.includes('salina') || title.includes('ovo') || title.includes('marisco') || title.includes('choco') || title.includes('sardinha') || title.includes('doce') || title.includes('comer') || title.includes('gastronom')) {
        return 'food';
      }
      return 'culture';
    };

    const allEventIds = [
      'event-1', 'event-2', 'event-3', 'event-4', 'event-5', 'event-6', 'event-7', 'event-8', 'event-9', 'event-10',
      'event-11', 'event-12', 'event-13', 'event-agueda', 'event-feira-marco', 'event-vagueira', 'event-braga-romana',
      'event-sjoao-porto', 'event-queima-coimbra', 'event-santos-alfama', 'event-evora-classica', 'event-marisco-olhao',
      'event-viana-agonia', 'event-guimaraes-afonsina', 'event-sintra-pirilampos', 'event-setubal-choco',
      'event-portalegre-rali', 'event-beja-ovibeja', 'event-portimao-sardinha', 'event-faro-f', 'event-quiz'
    ];

    const eventTitlesMap = {
      'event-1': 'Concerto no Hardbar',
      'event-2': 'Cicloturismo - AEE',
      'event-3': 'Quintas com tricot',
      'event-4': 'Workshop de Ovos Moles',
      'event-5': 'Feira de Março',
      'event-6': 'Jazz no Parque',
      'event-7': 'Festival do Moliceiro',
      'event-8': 'Torneio de Padel',
      'event-9': 'Arte Nova Street Art Tour',
      'event-10': 'Feira do Livro de Aveiro',
      'event-11': 'Passeio Moliceiro ao Pôr do Sol',
      'event-12': 'Visita guiada às Salinas',
      'event-13': 'Workshop de Cerâmica Vista Alegre',
      'event-agueda': 'AgitÁgueda',
      'event-feira-marco': 'Feira de Março Especial',
      'event-vagueira': 'Vagueira Surf Event',
      'event-braga-romana': 'Braga Romana',
      'event-sjoao-porto': 'São João do Porto',
      'event-queima-coimbra': 'Queima das Fitas de Coimbra',
      'event-santos-alfama': 'Santos Populares em Alfama',
      'event-evora-classica': 'Festival Évora Clássica',
      'event-marisco-olhao': 'Festival de Marisco',
      'event-viana-agonia': 'Romaria da Sra. da Agonia',
      'event-guimaraes-afonsina': 'Feira Afonsina',
      'event-sintra-pirilampos': 'Caminhada dos Pirilampos',
      'event-setubal-choco': 'Festival do Choco Frito',
      'event-portalegre-rali': 'Rali de Portalegre 500',
      'event-beja-ovibeja': 'Ovibeja',
      'event-portimao-sardinha': 'Festival da Sardinha',
      'event-faro-f': 'Festival F',
      'event-quiz': 'Noites de Quiz Dr. Why'
    };

    const eventLocationsMap = {
      'event-1': 'Bustos', 'event-2': 'Esgueira, Aveiro', 'event-3': 'Parque Infante D. Pedro, Aveiro',
      'event-4': 'Oficina do Doce, Aveiro', 'event-5': 'Parque de Feiras e Exposições, Aveiro',
      'event-6': 'Jardim Oudinot, Gafanha da Nazaré', 'event-7': 'Canais de Aveiro', 'event-8': 'Cacia, Aveiro',
      'event-9': 'Canais de Aveiro', 'event-10': 'Cais da Fonte Nova, Aveiro', 'event-11': 'Canais de Aveiro',
      'event-12': 'Salinas de Aveiro', 'event-13': 'Fábrica Vista Alegre, Ílhavo', 'event-agueda': 'Águeda',
      'event-feira-marco': 'Aveiro', 'event-vagueira': 'Praia da Vagueira', 'event-braga-romana': 'Braga',
      'event-sjoao-porto': 'Porto', 'event-queima-coimbra': 'Coimbra', 'event-santos-alfama': 'Lisboa',
      'event-evora-classica': 'Évora', 'event-marisco-olhao': 'Olhão', 'event-viana-agonia': 'Viana do Castelo',
      'event-guimaraes-afonsina': 'Guimarães', 'event-sintra-pirilampos': 'Sintra', 'event-setubal-choco': 'Setúbal',
      'event-portalegre-rali': 'Portalegre', 'event-beja-ovibeja': 'Beja', 'event-portimao-sardinha': 'Portimão',
      'event-faro-f': 'Faro', 'event-quiz': 'Aveiro'
    };

    setMoments(prev => {
      if (prev.some(m => m.id.startsWith('moment-gen-'))) {
        return prev;
      }
      const copy = [...prev];
      allEventIds.forEach(evtId => {
        const existingCount = copy.filter(m => m.eventId === evtId).length;
        if (existingCount < 5) {
          const title = eventTitlesMap[evtId] || 'Evento';
          const location = eventLocationsMap[evtId] || 'Portugal';
          const category = getEventCategory(evtId, title);
          const data = categoryData[category] || categoryData.culture;

          const momentsNeeded = 5 - existingCount;
          for (let i = 0; i < momentsNeeded; i++) {
            const idx = (evtId.charCodeAt(evtId.length - 1) + i) % 6;
            const author = extraAuthors[(evtId.charCodeAt(evtId.length - 1) + i) % extraAuthors.length];
            const photo = data.photos[idx];
            const momentTitle = data.titles[idx];
            const desc = data.descriptions[idx];

            copy.push({
              id: `moment-gen-${evtId}-${i}`,
              eventId: evtId,
              authorName: author.name,
              authorAvatar: author.avatar,
              eventTitle: title,
              location: location,
              photo: photo,
              title: momentTitle,
              description: desc,
              time: `Há ${i + 1} dias`,
              likes: 15 + (evtId.charCodeAt(evtId.length - 1) * 3 + i * 7) % 80,
              liked: false,
              isLive: false,
              comments: []
            });
          }
        }
      });
      return copy;
    });
  }, []);

  // --- FIGMA SCREEN 571:948 STATES & ACTIONS ---
  const USER_LOCATION = [40.6312, -8.6575]; // University of Aveiro coordinates for testing
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
  const [captureRadius, setCaptureRadius] = useState(25);
  const [radiusCenter, setRadiusCenter] = useState(USER_LOCATION);
  const [isRadiusModalOpen, setIsRadiusModalOpen] = useState(false);
  const [isMapCenteredOnUser, setIsMapCenteredOnUser] = useState(false);
  const [hasSeenMapOnboarding, setHasSeenMapOnboarding] = useState(false);
  const [feedOnboardingStep, setFeedOnboardingStep] = useState(1); // 1 = Step 1: Hierarchy, 2 = Step 2: Long press focus, null = Hidden
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showFullscreenPopup, setShowFullscreenPopup] = useState(true);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isNativeFull = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );
      setIsFullscreen(isNativeFull);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    const hasRequestFullscreen = typeof document.documentElement.requestFullscreen === 'function';
    const hasWebkitRequestFullscreen = typeof document.documentElement.webkitRequestFullscreen === 'function';

    if (hasRequestFullscreen) {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
          console.error(`Error entering fullscreen: ${err.message}`);
          setIsFullscreen(true);
        });
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    } else if (hasWebkitRequestFullscreen) {
      if (!document.webkitFullscreenElement) {
        document.documentElement.webkitRequestFullscreen();
      } else {
        if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
      }
    } else {
      setIsFullscreen(prev => !prev);
    }
  };

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
      if (!isMapCenteredOnUser) {
        mapInstanceRef.current.setView(USER_LOCATION, 15, { animate: true });
        setIsMapCenteredOnUser(true);
        showToast("Mapa centrado na sua localização. Clique novamente para centrar o raio.");
      } else {
        setRadiusCenter(USER_LOCATION);
        showToast("Raio de pesquisa centrado na sua localização.");
      }
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

  const handleShareEventClick = (evt) => {
    setSharingData({
      type: 'event',
      label: `Partilhar Evento: ${evt.title}`,
      url: `http://micropolariscope.app/e/${evt.id}`
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
    let itemLabel = 'localização';
    if (sharingData?.type === 'moment') itemLabel = 'momento';
    else if (sharingData?.type === 'event') itemLabel = 'evento';
    showToast(`Link de ${itemLabel} copiado!`);
  };

  const handleSocialShare = (platform) => {
    let itemLabel = 'a localização';
    if (sharingData?.type === 'moment') itemLabel = 'o momento';
    else if (sharingData?.type === 'event') itemLabel = 'o evento';
    showToast(`A partilhar ${itemLabel} via ${platform}...`);
    setTimeout(() => {
      setIsSharingSheetOpen(false);
    }, 1200);
  };

  // --- MAP INTEGRATION ---
  useEffect(() => {
    let map = null;
    let onTouchStart = null;
    let onTouchMove = null;
    let onTouchEnd = null;
    let mapContainer = null;

    if (currentTab === 'map' && mapContainerRef.current && !mapInstanceRef.current) {
      // Initialize map centered at Aveiro
      map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false,
        tap: false
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

      // Keep GPS location arrow marker
      L.marker(USER_LOCATION, { icon: userIcon })
        .addTo(map)
        .bindPopup('Minha Posição (GPS)');

      // Custom target icon for radius center
      const centerIcon = L.divIcon({
        html: `
          <div style="display: flex; align-items: center; justify-content: center; filter: drop-shadow(0px 4px 6px rgba(0,0,0,0.3));">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="#f17522" stroke-width="3" fill="rgba(241, 117, 34, 0.3)"/>
              <circle cx="12" cy="12" r="3" fill="#f17522"/>
            </svg>
          </div>
        `,
        className: 'radius-center-marker-icon',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      // Target pin marker for search radius center
      const centerMarker = L.marker(radiusCenter, { icon: centerIcon, draggable: true })
        .addTo(map)
        .bindPopup('Foco da Pesquisa (Arraste)');

      centerMarker.on('dragend', (e) => {
        const newPos = e.target.getLatLng();
        setRadiusCenter([newPos.lat, newPos.lng]);
      });

      radiusCenterMarkerRef.current = centerMarker;

      // Add visual capture radius circle centered at radiusCenter
      const radiusCircle = L.circle(radiusCenter, {
        color: '#f17522',
        fillColor: '#f17522',
        fillOpacity: 0.12,
        weight: 1.5,
        radius: captureRadius * 1000 // Convert km to meters
      });

      if (polariscopeVisible) {
        radiusCircle.addTo(map);
      }

      radiusCircleRef.current = radiusCircle;

      // Fit bounds to show the initial radius circle
      map.fitBounds(radiusCircle.getBounds());

      // Listen to map events for long-press re-centering & clearing isMapCenteredOnUser
      let pressTimer = null;
      let startPoint = null;

      const startPress = (latlng, point) => {
        if (pressTimer) clearTimeout(pressTimer);
        startPoint = point;
        pressTimer = setTimeout(() => {
          setRadiusCenter([latlng.lat, latlng.lng]);
          if (navigator.vibrate) {
            navigator.vibrate(50);
          }
          pressTimer = null;
          startPoint = null;
        }, 1000);
      };

      const cancelPress = () => {
        if (pressTimer) {
          clearTimeout(pressTimer);
          pressTimer = null;
        }
        startPoint = null;
      };

      map.on('mousedown', (e) => {
        if (e.originalEvent && e.originalEvent.button === 0) {
          startPress(e.latlng, e.containerPoint);
        }
      });

      map.on('mousemove', (e) => {
        if (startPoint && e.containerPoint) {
          const dist = startPoint.distanceTo(e.containerPoint);
          if (dist > 15) {
            cancelPress();
          }
        }
      });

      map.on('mouseup', cancelPress);

      // Bind native touch events directly to the map container to bypass Leaflet event blocking on mobile
      mapContainer = mapContainerRef.current;
      if (mapContainer) {
        onTouchStart = (e) => {
          const touch = e.touches ? e.touches[0] : null;
          if (!touch) return;

          const rect = mapContainer.getBoundingClientRect();
          const containerPoint = L.point(
            touch.clientX - rect.left,
            touch.clientY - rect.top
          );
          const latlng = map.containerPointToLatLng(containerPoint);
          if (latlng) {
            startPress(latlng, containerPoint);
          }
        };

        onTouchMove = (e) => {
          if (startPoint) {
            const touch = e.touches ? e.touches[0] : null;
            if (touch) {
              const rect = mapContainer.getBoundingClientRect();
              const currentPoint = L.point(
                touch.clientX - rect.left,
                touch.clientY - rect.top
              );
              const dist = startPoint.distanceTo(currentPoint);
              if (dist > 15) {
                cancelPress();
              }
            } else {
              cancelPress();
            }
          }
        };

        onTouchEnd = cancelPress;

        mapContainer.addEventListener('touchstart', onTouchStart, { passive: true });
        mapContainer.addEventListener('touchmove', onTouchMove, { passive: true });
        mapContainer.addEventListener('touchend', onTouchEnd, { passive: true });
        mapContainer.addEventListener('touchcancel', onTouchEnd, { passive: true });
      }

      map.on('dragstart', () => {
        setIsMapCenteredOnUser(false);
      });
      map.on('zoomstart', () => {
        cancelPress();
        setIsMapCenteredOnUser(false);
      });
      map.on('movestart', () => {
        setIsMapCenteredOnUser(false);
      });

      // Force size recalculation to fix grey rendering bugs
      [50, 150, 400, 1000].forEach(delay => {
        setTimeout(() => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.invalidateSize();
          }
        }, delay);
      });
    }

    return () => {
      if (mapContainer && onTouchStart) {
        mapContainer.removeEventListener('touchstart', onTouchStart);
        mapContainer.removeEventListener('touchmove', onTouchMove);
        mapContainer.removeEventListener('touchend', onTouchEnd);
        mapContainer.removeEventListener('touchcancel', onTouchEnd);
      }
      // Cleanup map instance if tab unmounts
      if (currentTab !== 'map' && mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        radiusCircleRef.current = null;
        radiusCenterMarkerRef.current = null;
      }
    };
  }, [currentTab, mapStyle]);

  // Refresh markers whenever events or search query changes
  useEffect(() => {
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

  }, [currentTab, events, mapSearchQuery]);

  // Update capture radius circle dynamically
  useEffect(() => {
    if (mapInstanceRef.current && radiusCircleRef.current) {
      const circle = radiusCircleRef.current;
      circle.setRadius(captureRadius * 1000);

      if (polariscopeVisible) {
        if (!mapInstanceRef.current.hasLayer(circle)) {
          circle.addTo(mapInstanceRef.current);
        }
        // Auto-fit bounds on radius change to see circle boundary
        mapInstanceRef.current.fitBounds(circle.getBounds());
      } else {
        if (mapInstanceRef.current.hasLayer(circle)) {
          circle.remove();
        }
      }
    }
  }, [captureRadius, polariscopeVisible]);

  // Update radius center marker and circle dynamically when radiusCenter state changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      if (radiusCenterMarkerRef.current) {
        radiusCenterMarkerRef.current.setLatLng(radiusCenter);
      }
      if (radiusCircleRef.current) {
        radiusCircleRef.current.setLatLng(radiusCenter);
        // Auto-fit bounds when radius center changes to see search circle boundary
        mapInstanceRef.current.fitBounds(radiusCircleRef.current.getBounds());
      }
    }
  }, [radiusCenter]);

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

  // --- HISTORY & MOBILE BACK BUTTON HANDLER ---
  const wasDetailOpenRef = useRef(false);
  useEffect(() => {
    const handlePopState = (event) => {
      if (activeStoryEventId) {
        setActiveStoryEventId(null);
      } else if (expandedMomentId) {
        setExpandedMomentId(null);
      } else if (viewingEventId) {
        setViewingEventId(null);
      } else if (viewingUser) {
        setViewingUser(null);
      } else if (loginScreen !== 'welcome' && !currentUser) {
        setLoginScreen('welcome');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [viewingUser, viewingEventId, expandedMomentId, activeStoryEventId, loginScreen, currentUser]);

  useEffect(() => {
    const isDetailOpen = !!(viewingUser || viewingEventId || expandedMomentId || activeStoryEventId || (loginScreen !== 'welcome' && !currentUser));

    if (isDetailOpen !== wasDetailOpenRef.current) {
      if (isDetailOpen) {
        window.history.pushState({ isAppDetail: true }, '');
      } else {
        if (window.history.state && window.history.state.isAppDetail) {
          window.history.back();
        }
      }
      wasDetailOpenRef.current = isDetailOpen;
    }
  }, [viewingUser, viewingEventId, expandedMomentId, activeStoryEventId, loginScreen, currentUser]);

  // --- MAP RESIZE ROBUSTNESS ---
  useEffect(() => {
    if (currentTab === 'map' && mapInstanceRef.current) {
      const timer = setTimeout(() => {
        mapInstanceRef.current.invalidateSize();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [mapStyle, mapSearchQuery, isSharingSheetOpen, currentTab]);

  // Camera onboarding popup trigger
  useEffect(() => {
    if (currentTab === 'camera') {
      if (!hasSeenCameraOnboarding && !newPostEventId && !newPostLocation) {
        setCameraOnboardingStep('event');
        setHasSeenCameraOnboarding(true);
      }
    } else {
      setCameraOnboardingStep(null);
    }
  }, [currentTab, hasSeenCameraOnboarding]);

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
        video: { facingMode: 'environment' },
        audio: false
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Auto re-enter fullscreen if the browser exited it during the system permission prompt
      setTimeout(() => {
        const hasRequestFullscreen = typeof document.documentElement.requestFullscreen === 'function';
        const hasWebkitRequestFullscreen = typeof document.documentElement.webkitRequestFullscreen === 'function';
        const isCurrentlyFull = !!(document.fullscreenElement || document.webkitFullscreenElement);

        if (!isCurrentlyFull) {
          if (hasRequestFullscreen) {
            document.documentElement.requestFullscreen().catch(err => {
              console.log("Could not re-enter fullscreen after camera started: ", err);
            });
          } else if (hasWebkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen();
          }
        }
      }, 500);
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
    if (!capturedPhoto) {
      showToast('Tira uma foto primeiro!');
      return;
    }

    const selectedEvent = events.find(ev => ev.id === newPostEventId);

    const newDraft = {
      id: `draft-${Date.now()}`,
      eventId: selectedEvent ? selectedEvent.id : '',
      eventTitle: selectedEvent ? selectedEvent.title : 'Sem Evento',
      photo: capturedPhoto,
      title: postTitle || 'Rascunho sem título',
      location: newPostLocation || '',
      tags: [postTag1, postTag2, postTag3].filter(Boolean),
      description: postDescription,
      time: new Date().toLocaleTimeString(),
    };

    setDrafts([...drafts, newDraft]);
    showToast('Rascunho guardado!');

    // Reset camera state
    setCapturedPhoto(null);
    setPostTitle('');
    setPostTag1('');
    setPostTag2('');
    setPostTag3('');
    setPostDescription('');
    setNewPostEventId('');
    setNewPostLocation('');
    setEventSearchQuery('');
    setLocationSearchQuery('');
    setIsBottomSheetCollapsed(false);
    setCurrentTab('feed');
  };

  // Submit Captured Photo as new Feed Moment
  const handlePublishPost = (e) => {
    if (e) e.preventDefault();
    if (!capturedPhoto) return;

    if (!newPostEventId) {
      showToast('Seleciona um evento.');
      return;
    }
    if (!newPostLocation || !newPostLocation.trim()) {
      showToast('Define a localização.');
      return;
    }
    if (!postTitle.trim()) {
      showToast('Escreve um título.');
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
      time: selectedEvent.live ? 'AO VIVO' : 'Agora mesmo',
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
    setNewPostEventId('');
    setNewPostLocation('');
    setEventSearchQuery('');
    setLocationSearchQuery('');
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

  // Get moments specific to the active context (user profile, event, or all)
  const getActiveStoryMoments = () => {
    if (viewingUser) {
      if (userProfileTab === 'guardados') {
        return moments.filter(m => savedMoments.includes(m.id));
      } else {
        return moments.filter(m => {
          const authorClean = m.authorName.toLowerCase().replace(/\s+/g, '');
          const nameClean = viewingUser.name.toLowerCase().replace(/\s+/g, '');
          return authorClean.includes(nameClean) || nameClean.includes(authorClean);
        });
      }
    }
    if (viewingEventId) {
      return moments.filter(m => m.eventId === viewingEventId);
    }
    if (selectedEventId) {
      return moments.filter(m => m.eventId === selectedEventId);
    }
    return moments;
  };

  // Navigate moments manually inside the story player
  const navigateMoment = (direction) => {
    const activeMoments = getActiveStoryMoments();
    const currentIndex = activeMoments.findIndex(m => m.id === expandedMomentId);
    if (direction === 'next') {
      if (currentIndex !== -1 && currentIndex < activeMoments.length - 1) {
        setExpandedMomentId(activeMoments[currentIndex + 1].id);
      } else {
        setExpandedMomentId(null);
      }
    } else if (direction === 'prev') {
      if (currentIndex > 0) {
        setExpandedMomentId(activeMoments[currentIndex - 1].id);
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
  const handleOpenRegister = () => {
    setRegisterName('');
    setRegisterEmail('');
    setRegisterPassword('');
    setRegisterConfirmPassword('');
    setRegisterAccountType('');
    setRegisterError('');
    setLoginScreen('register');
  };

  const handleOpenLogin = () => {
    setLoginEmail('');
    setLoginPassword('');
    setLoginError('');
    setLoginScreen('login');
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!registerName.trim() || !registerEmail.trim() || !registerPassword.trim() || !registerConfirmPassword.trim()) {
      setRegisterError('Por favor preencha todos os campos.');
      return;
    }

    if (registerPassword.length < 8) {
      setRegisterError('Deve ter no minimo 8 caracteres.');
      return;
    }

    if (registerPassword !== registerConfirmPassword) {
      setRegisterError('As palavras-passe não coincidem.');
      return;
    }

    setCurrentUser({
      name: registerName,
      avatar: registerAvatar,
      email: registerEmail,
      accountType: registerAccountType
    });
    setRegisterName('');
    setRegisterEmail('');
    setRegisterPassword('');
    setRegisterConfirmPassword('');
    setRegisterAccountType('Pessoal');
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

  const handleProfileBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        if (currentUser) {
          setCurrentUser(prev => ({ ...prev, banner: dataUrl }));
          if (viewingUser) {
            setViewingUser(prev => ({ ...prev, banner: dataUrl }));
          }
          showToast('Banner de perfil atualizado!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleSaveEvent = (eventId) => {
    setSavedEvents(prev => {
      if (prev.includes(eventId)) {
        showToast('Evento removido dos guardados');
        return prev.filter(id => id !== eventId);
      } else {
        showToast('Evento guardado com sucesso!');
        return [...prev, eventId];
      }
    });
  };

  const toggleSaveMoment = (momentId) => {
    setSavedMoments(prev => {
      if (prev.includes(momentId)) {
        showToast('Momento removido dos guardados');
        return prev.filter(id => id !== momentId);
      } else {
        showToast('Momento guardado com sucesso!');
        return [...prev, momentId];
      }
    });
  };

  const getEventLikes = (evt) => {
    if (!evt) return 0;
    if (evt.likes !== undefined) return evt.likes;
    // Calculate a stable pseudo-random like count based on the event title hash
    const hash = evt.title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return (hash % 45) + 15; // Stable number between 15 and 59
  };

  const toggleLikeEvent = (eventId) => {
    if (!currentUser) {
      showToast('Inicia sessão para gostar deste evento!');
      return;
    }
    setLikedEvents(prev => {
      const isLiked = prev.includes(eventId);
      setEvents(allEvents => allEvents.map(evt => {
        if (evt.id === eventId) {
          const currentLikes = getEventLikes(evt);
          return {
            ...evt,
            likes: isLiked ? Math.max(0, currentLikes - 1) : currentLikes + 1
          };
        }
        return evt;
      }));

      if (isLiked) {
        showToast('Removido dos favoritos');
        return prev.filter(id => id !== eventId);
      } else {
        showToast('Gostaste deste evento!');
        return [...prev, eventId];
      }
    });
  };

  const handleSaveProfile = (updatedName, updatedBio, updatedRole) => {
    if (!updatedName.trim()) {
      showToast('O nome não pode estar vazio.');
      return;
    }

    const updatedUser = {
      ...currentUser,
      name: updatedName,
      bio: updatedBio,
      accountType: updatedRole
    };
    setCurrentUser(updatedUser);

    setViewingUser(prev => ({
      ...prev,
      name: updatedName,
      bio: updatedBio,
      role: updatedRole
    }));

    // Update moments created by this user
    setMoments(prevMoments => prevMoments.map(m => {
      const authorClean = m.authorName.toLowerCase().replace(/\s+/g, '');
      const userClean = currentUser.name.toLowerCase().replace(/\s+/g, '');
      if (authorClean === userClean || (currentUser.name === 'Visitante' && m.authorName === 'Eu')) {
        return {
          ...m,
          authorName: updatedName,
          authorAvatar: currentUser.avatar
        };
      }
      return m;
    }));

    // Update events created by this user
    setEvents(prevEvents => prevEvents.map(evt => {
      const orgClean = evt.organizer.toLowerCase().replace(/\s+/g, '');
      const userClean = currentUser.name.toLowerCase().replace(/\s+/g, '');
      if (orgClean === userClean || (currentUser.name === 'Visitante' && evt.organizer === 'Eu')) {
        return {
          ...evt,
          organizer: updatedName,
          organizerLabel: updatedName,
          organizerLogo: currentUser.avatar
        };
      }
      return evt;
    }));

    setIsEditingProfile(false);
    showToast('Perfil atualizado com sucesso!');
  };

  const startEditingProfile = () => {
    setEditProfileName(viewingUser ? viewingUser.name : (currentUser ? currentUser.name : ''));
    setEditProfileBio(viewingUser ? viewingUser.bio : (currentUser ? currentUser.bio || '' : ''));
    setEditProfileRole(viewingUser ? (viewingUser.role === 'Membro' || viewingUser.role === 'Pessoal' ? 'Pessoal' : 'Organização') : (currentUser ? currentUser.accountType || 'Pessoal' : 'Pessoal'));
    setIsEditingProfile(true);
  };

  const loadDraftToCamera = (draft) => {
    setCapturedPhoto(draft.photo);
    setPostTitle(draft.title === 'Rascunho sem título' ? '' : draft.title);
    setPostTag1(draft.tags[0] || '');
    setPostTag2(draft.tags[1] || '');
    setPostTag3(draft.tags[2] || '');
    setPostDescription(draft.description || '');
    setNewPostEventId(draft.eventId || '');
    setNewPostLocation(draft.location || '');
    setCurrentTab('camera');
    setViewingUser(null);
    showToast('Rascunho carregado na câmara!');
  };

  const deleteDraft = (draftId) => {
    if (window.confirm('Eliminar rascunho?')) {
      setDrafts(prev => prev.filter(d => d.id !== draftId));
      showToast('Rascunho eliminado.');
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

  // --- BOTTOM SHEET DRAG GESTURE ---
  const sheetRef = useRef(null);
  const dragStartYRef = useRef(0);
  const isDraggingSheetRef = useRef(false);

  const handleSheetDragStart = (e) => {
    dragStartYRef.current = e.clientY;
    isDraggingSheetRef.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    if (sheetRef.current) {
      sheetRef.current.style.transition = 'none';
    }
  };

  const handleSheetDragMove = (e) => {
    if (!isDraggingSheetRef.current) return;
    const diffY = e.clientY - dragStartYRef.current;
    if (diffY > 0 && sheetRef.current) {
      sheetRef.current.style.transform = `translateY(${diffY}px)`;
    }
  };

  const handleSheetDragEnd = (e) => {
    if (!isDraggingSheetRef.current) return;
    isDraggingSheetRef.current = false;
    const diffY = e.clientY - dragStartYRef.current;
    e.currentTarget.releasePointerCapture(e.pointerId);

    if (sheetRef.current) {
      if (diffY > 100) { // Dragged down more than 100px: collapse sheet
        sheetRef.current.style.transition = 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)';
        sheetRef.current.style.transform = 'translateY(100%)';
        setTimeout(() => {
          setIsBottomSheetCollapsed(true);
          if (sheetRef.current) {
            sheetRef.current.style.transform = '';
            sheetRef.current.style.transition = '';
          }
        }, 250);
      } else { // Snap back
        sheetRef.current.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
        sheetRef.current.style.transform = 'translateY(0)';
        setTimeout(() => {
          if (sheetRef.current) {
            sheetRef.current.style.transition = '';
          }
        }, 300);
      }
    }
  };

  // Event sheet drag gesture
  const eventSheetRef = useRef(null);
  const dragStartEventYRef = useRef(0);
  const isDraggingEventSheetRef = useRef(false);

  const handleEventSheetDragStart = (e) => {
    dragStartEventYRef.current = e.clientY;
    isDraggingEventSheetRef.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    if (eventSheetRef.current) {
      eventSheetRef.current.style.transition = 'none';
    }
  };

  const handleEventSheetDragMove = (e) => {
    if (!isDraggingEventSheetRef.current) return;
    const diffY = e.clientY - dragStartEventYRef.current;
    if (diffY > 0 && eventSheetRef.current) {
      eventSheetRef.current.style.transform = `translateY(${diffY}px)`;
    }
  };

  const handleEventSheetDragEnd = (e) => {
    if (!isDraggingEventSheetRef.current) return;
    isDraggingEventSheetRef.current = false;
    const diffY = e.clientY - dragStartEventYRef.current;
    e.currentTarget.releasePointerCapture(e.pointerId);

    if (eventSheetRef.current) {
      if (diffY > 100) { // Dragged down more than 100px: collapse event sheet
        eventSheetRef.current.style.transition = 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)';
        eventSheetRef.current.style.transform = 'translateY(100%)';
        setTimeout(() => {
          setIsCreatingEvent(false);
          if (eventSheetRef.current) {
            eventSheetRef.current.style.transform = '';
            eventSheetRef.current.style.transition = '';
          }
        }, 250);
      } else { // Snap back
        eventSheetRef.current.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
        eventSheetRef.current.style.transform = 'translateY(0)';
        setTimeout(() => {
          if (eventSheetRef.current) {
            eventSheetRef.current.style.transition = '';
          }
        }, 300);
      }
    }
  };

  const closeMomentSheetWithAnimation = () => {
    if (sheetRef.current) {
      sheetRef.current.style.transition = 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)';
      sheetRef.current.style.transform = 'translateY(100%)';
      setTimeout(() => {
        setIsBottomSheetCollapsed(true);
        if (sheetRef.current) {
          sheetRef.current.style.transform = '';
          sheetRef.current.style.transition = '';
        }
      }, 250);
    } else {
      setIsBottomSheetCollapsed(true);
    }
  };

  const closeEventSheetWithAnimation = () => {
    if (eventSheetRef.current) {
      eventSheetRef.current.style.transition = 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)';
      eventSheetRef.current.style.transform = 'translateY(100%)';
      setTimeout(() => {
        setIsCreatingEvent(false);
        if (eventSheetRef.current) {
          eventSheetRef.current.style.transform = '';
          eventSheetRef.current.style.transition = '';
        }
      }, 250);
    } else {
      setIsCreatingEvent(false);
    }
  };


  // Story player mobile drag/swipe gesture refs
  const dragStartStoryRef = useRef({ x: 0, y: 0, time: 0 });
  const isDraggingStoryRef = useRef(false);
  const hasDraggedStoryRef = useRef(false);

  // Navigation History Stack logic for detail views
  const [navHistory, setNavHistory] = useState([]);

  const goBack = () => {
    if (navHistory.length === 0) {
      setViewingUser(null);
      setViewingEventId(null);
      return;
    }

    const prevHistory = [...navHistory];
    const prevState = prevHistory.pop();
    setNavHistory(prevHistory);

    if (prevState.tab !== undefined) {
      setCurrentTab(prevState.tab);
    }
    setViewingUser(prevState.viewingUser);
    setViewingEventId(prevState.viewingEventId);
  };

  const handleStoryDragStart = (e) => {
    // If pointer down was on an interactive element (button, link, etc.), ignore for swipe drag
    const target = e.target;
    if (
      target.tagName === 'BUTTON' ||
      target.closest('button') ||
      target.closest('a') ||
      target.closest('.moment-story-actions-row')
    ) {
      return;
    }

    if (e.button !== undefined && e.button !== 0) return;
    dragStartStoryRef.current = { x: e.clientX, y: e.clientY, time: Date.now() };
    isDraggingStoryRef.current = true;
    hasDraggedStoryRef.current = false;
    e.currentTarget.style.transition = 'none';
  };

  const handleStoryDragMove = (e) => {
    if (!isDraggingStoryRef.current) return;
    const diffY = e.clientY - dragStartStoryRef.current.y;
    const diffX = e.clientX - dragStartStoryRef.current.x;

    if (Math.abs(diffY) > 8 || Math.abs(diffX) > 8) {
      hasDraggedStoryRef.current = true;
    }

    const scale = Math.max(0.85, 1 - Math.min(Math.abs(diffY) / 1000, 0.15));
    e.currentTarget.style.transform = `translateY(${diffY}px) scale(${scale})`;
  };

  const handleStoryDragEnd = (e, type) => {
    if (!isDraggingStoryRef.current) return;
    isDraggingStoryRef.current = false;

    const diffY = e.clientY - dragStartStoryRef.current.y;
    const elapsed = Date.now() - dragStartStoryRef.current.time;

    const isSwipeDismiss = Math.abs(diffY) > 120 || (Math.abs(diffY) > 50 && elapsed < 250);

    if (isSwipeDismiss) {
      e.currentTarget.style.transition = 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease';
      const direction = diffY > 0 ? 1 : -1;
      e.currentTarget.style.transform = `translateY(${direction * 100}%) scale(0.85)`;
      e.currentTarget.style.opacity = '0';

      const target = e.currentTarget;
      setTimeout(() => {
        if (target) {
          target.style.transform = '';
          target.style.transition = '';
          target.style.opacity = '';
        }
        if (type === 'moment') {
          setExpandedMomentId(null);
        } else {
          setActiveStoryEventId(null);
        }
      }, 200);
    } else {
      e.currentTarget.style.transition = 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)';
      e.currentTarget.style.transform = 'translateY(0) scale(1)';
      const target = e.currentTarget;
      setTimeout(() => {
        if (target) {
          target.style.transition = '';
        }
      }, 250);
    }
  };

  const handleStoryClickCapture = (e) => {
    if (hasDraggedStoryRef.current) {
      e.stopPropagation();
      e.preventDefault();
      hasDraggedStoryRef.current = false;
    }
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
      date: newEventDate || 'Hoje, 12:00',
      location: newEventLocation || 'Aveiro, Portugal',
      subtitle: newEventDesc || 'Novo evento adicionado à comunidade!',
      organizerLabel: currentUser ? currentUser.name : 'A Minha Organização',
      organizerLogo: currentUser ? currentUser.avatar : '/assets/profile.svg',
      banner: newEventImg
    };

    setEvents([...events, newEvt]);

    // Auto-select event if created from Camera tab
    if (currentTab === 'camera') {
      setNewPostEventId(newEvt.id);
      setNewPostLocation(newEvt.location);
    }

    // Reset Form
    setNewEventTitle('');
    setNewEventDesc('');
    setNewEventDate('Hoje, 12:00');
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

  // Default event selection in Camera tab - kept unselected as both are mandatory

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

    // Attach mouseup and mousemove to document so dragging outside the element still works
    const onMouseUp = () => {
      if (!isDown) return;
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
    slider.addEventListener('dragstart', onDragStart);
    // Listen on document so mouse leaving frame boundary still works
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mousemove', onMouseMove);

    return () => {
      slider.removeEventListener('mousedown', onMouseDown);
      slider.removeEventListener('dragstart', onDragStart);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mousemove', onMouseMove);
    };
  }, [currentTab, viewingEventId, viewingUser, currentUser, isCreatingEvent]);

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
  }, [currentTab, viewingEventId, viewingUser, currentUser]);

  const currentEvent = viewingEventId ? events.find(e => e.id === viewingEventId) : null;

  return (
    <div className={`phone-shell ${isFullscreen ? 'fullscreen-active' : ''}`}>
      <div className="app-viewport">
        <input
          type="file"
          ref={profileAvatarInputRef}
          style={{ display: 'none' }}
          accept="image/*"
          onChange={handleProfileAvatarChange}
        />
        <input
          type="file"
          ref={profileBannerInputRef}
          style={{ display: 'none' }}
          accept="image/*"
          onChange={handleProfileBannerChange}
        />
        {!currentUser ? (
          <div className="auth-flow-container">
            {loginScreen === 'welcome' && (
              <div className="welcome-screen">
                <header className="auth-header">
                  <div className="brand-logo-container">
                    <img src="/assets/logo.svg" className="brand-logo-icon" alt="microPolariscope Logo" />
                    <h1 className="brand-logo-text">
                      <span className="light">micro</span>
                      <span className="regular">polariscope</span>
                    </h1>
                  </div>
                </header>

                <div className="welcome-body" style={{ position: 'relative' }}>
                  {/* Fullscreen button in white body (top-left) */}
                  <button
                    onClick={toggleFullscreen}
                    className="fullscreen-body-btn"
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '16px',
                      background: 'rgba(241, 117, 34, 0.08)',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '6px 10px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      cursor: 'pointer',
                      color: 'var(--primary)',
                      fontSize: '10px',
                      fontWeight: '700',
                      fontFamily: 'var(--font-family)',
                      zIndex: 10,
                      boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                    }}
                  >
                    {isFullscreen ? (
                      <>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 14h6v6M20 10h-6V4M14 10l7-7M10 14l-7 7" />
                        </svg>
                        <span>Janela</span>
                      </>
                    ) : (
                      <>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3" />
                        </svg>
                        <span>Ecrã Inteiro</span>
                      </>
                    )}
                  </button>

                  <h2 className="welcome-title">Olá!</h2>

                  <div className="welcome-logo-large">
                    <svg width="213" height="208" viewBox="0 0 213 208" fill="none" xmlns="http://www.w3.org/2000/svg" className="animated-pentagon-logo">
                      <defs>
                        {/* Mask made of the pentagon lines */}
                        <mask id="pentagon-lines-mask">
                          <path
                            d="M177.074 171.316L207.13 77.9183M157.752 169.144L192.102 64.8861M177.074 184.348H71.8766M78.3172 201.725H172.78M121.255 169.144L138.43 119.187M140.577 169.144L153.458 130.047M121.255 86.6065L162.046 117.015M134.136 73.5742L166.339 99.6387M104.08 4.06885L179.221 62.714M89.0516 17.1011L172.78 80.0904M78.3172 27.9613L3.13013 85.308M93.3454 38.8215L9.61701 103.983M108.374 51.8538L76.1703 75.7463M123.402 62.714L82.611 93.1226M63.289 82.2624L80.4641 132.219M48.2609 95.2947L61.1422 132.219M61.1422 147.424H112.667M67.5828 166.972H108.374M33.2327 103.983L65.4359 206.069M18.2045 117.015L46.114 206.069"
                            stroke="white"
                            strokeWidth="10.3226"
                            strokeMiterlimit="3.99393"
                          />
                        </mask>

                        {/* Gradient color Definition */}
                        <linearGradient id="logo-gradient" x1="106.227" y1="4.06885" x2="106.227" y2="208.241" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#F77E1A" />
                          <stop offset="1" stopColor="#F7AD1A" />
                        </linearGradient>
                      </defs>

                      {/* Stacked image layers clipped to the pentagon lines */}
                      <g mask="url(#pentagon-lines-mask)">
                        <rect width="213" height="208" fill="#e2e8f0" />
                        <image href="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80" className="pentagon-img pentagon-img-1" x="0" y="0" width="213" height="208" preserveAspectRatio="xMidYMid slice" />
                        <image href="https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=300&auto=format&fit=crop&q=80" className="pentagon-img pentagon-img-2" x="0" y="0" width="213" height="208" preserveAspectRatio="xMidYMid slice" />
                        <image href="https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&auto=format&fit=crop&q=80" className="pentagon-img pentagon-img-3" x="0" y="0" width="213" height="208" preserveAspectRatio="xMidYMid slice" />
                        <image href="https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=300&auto=format&fit=crop&q=80" className="pentagon-img pentagon-img-4" x="0" y="0" width="213" height="208" preserveAspectRatio="xMidYMid slice" />
                      </g>

                      {/* Gradient outline lines overlay */}
                      <path
                        className="pentagon-gradient-path"
                        d="M177.074 171.316L207.13 77.9183M157.752 169.144L192.102 64.8861M177.074 184.348H71.8766M78.3172 201.725H172.78M121.255 169.144L138.43 119.187M140.577 169.144L153.458 130.047M121.255 86.6065L162.046 117.015M134.136 73.5742L166.339 99.6387M104.08 4.06885L179.221 62.714M89.0516 17.1011L172.78 80.0904M78.3172 27.9613L3.13013 85.308M93.3454 38.8215L9.61701 103.983M108.374 51.8538L76.1703 75.7463M123.402 62.714L82.611 93.1226M63.289 82.2624L80.4641 132.219M48.2609 95.2947L61.1422 132.219M61.1422 147.424H112.667M67.5828 166.972H108.374M33.2327 103.983L65.4359 206.069M18.2045 117.015L46.114 206.069"
                        stroke="url(#logo-gradient)"
                        strokeWidth="10.3226"
                        strokeMiterlimit="3.99393"
                      />
                    </svg>
                  </div>

                  <p className="welcome-subtitle">
                    Pronto(a) para partilhar<br />
                    os teus melhores<br />
                    Momentos?
                  </p>
                </div>

                <div className="welcome-actions">
                  <button className="auth-btn auth-btn-secondary" onClick={handleOpenRegister}>
                    Criar conta
                  </button>
                  <button className="auth-btn auth-btn-primary" onClick={handleOpenLogin}>
                    Iniciar sessão
                  </button>
                  <div className="auth-guest-link">
                    ...ou entra como <span className="visitor-underlined" onClick={handleGuestLogin}>Visitante</span>
                  </div>

                  {/* Version badge */}
                  <div className="prototype-version-badge" style={{ fontSize: '10px', color: '#94a3b8', marginTop: '16px', fontWeight: '500', fontFamily: 'var(--font-family)', letterSpacing: '0.5px' }}>
                    Protótipo v1.5.a
                  </div>
                </div>

                {/* Fullscreen Popup Dialog */}
                {showFullscreenPopup && (
                  <div className="fullscreen-popup-overlay" style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999,
                    padding: '20px'
                  }}>
                    <div className="fullscreen-popup-card" style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '16px',
                      padding: '24px',
                      width: '100%',
                      maxWidth: '300px',
                      textAlign: 'center',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                      fontFamily: 'var(--font-family)'
                    }}>
                      <div style={{ color: 'var(--primary)', marginBottom: '12px', display: 'flex', justifyContent: 'center' }}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3" />
                        </svg>
                      </div>
                      <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '700', color: '#1e293b' }}>Ecrã Inteiro</h3>
                      <p style={{ margin: '0 0 20px 0', fontSize: '12px', color: '#64748b', lineHeight: '1.5' }}>
                        Desejas ver a aplicação em ecrã inteiro para uma melhor experiência e evitar sobreposições?
                      </p>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button
                          onClick={() => setShowFullscreenPopup(false)}
                          style={{
                            flex: 1,
                            padding: '10px',
                            borderRadius: '8px',
                            border: '1px solid #cbd5e1',
                            backgroundColor: '#ffffff',
                            color: '#64748b',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          Não
                        </button>
                        <button
                          onClick={() => {
                            toggleFullscreen();
                            setShowFullscreenPopup(false);
                          }}
                          style={{
                            flex: 1,
                            padding: '10px',
                            borderRadius: '8px',
                            border: 'none',
                            backgroundColor: 'var(--primary)',
                            color: '#ffffff',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          Sim
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {loginScreen === 'login' && (
              <div className="auth-form-screen" style={{ position: 'relative' }}>
                <header className="auth-header">
                  <div className="brand-logo-container">
                    <img src="/assets/logo.svg" className="brand-logo-icon" alt="microPolariscope Logo" />
                    <h1 className="brand-logo-text">
                      <span className="light">micro</span>
                      <span className="regular">polariscope</span>
                    </h1>
                  </div>
                </header>

                <button className="auth-back-circle-btn" onClick={() => setLoginScreen('welcome')} aria-label="Voltar">
                  <svg viewBox="0 0 24 24" width="16" height="16" stroke="#ffffff" strokeWidth="4.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </button>

                <form className="auth-form" onSubmit={handleLogin} style={{ padding: '24px 30px' }}>
                  <h3 className="register-title">Iniciar sessão</h3>

                  {loginError && <div className="auth-error-msg">{loginError}</div>}

                  <div className="register-field-group">
                    <label htmlFor="login-email" className="register-label">Email</label>
                    <input
                      type="email"
                      id="login-email"
                      className="register-input"
                      placeholder="Email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="register-field-group" style={{ marginBottom: '8px' }}>
                    <label htmlFor="login-password" className="register-label">Palavra-passe</label>
                    <input
                      type="password"
                      id="login-password"
                      className="register-input"
                      placeholder="Palavra-passe"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                    <span
                      className="login-forgot-password"
                      onClick={() => showToast("Recuperação de palavra-passe enviada!")}
                    >
                      Esqueceste-te da palavra-passe?
                    </span>
                  </div>

                  <button 
                    type="submit" 
                    className={`register-submit-btn ${loginEmail.trim() && loginPassword.trim() ? 'filled' : ''}`} 
                    style={{ marginTop: '24px' }}
                  >
                    Inicia sessão
                  </button>

                  <div className="auth-guest-link" style={{ marginTop: '16px', textAlign: 'center' }}>
                    ...ou entra como <span className="visitor-underlined" onClick={handleGuestLogin}>Visitante</span>
                  </div>
                </form>
              </div>
            )}

            {loginScreen === 'register' && (
              <div className="auth-form-screen" style={{ position: 'relative' }}>
                <header className="auth-header">
                  <div className="brand-logo-container">
                    <img src="/assets/logo.svg" className="brand-logo-icon" alt="microPolariscope Logo" />
                    <h1 className="brand-logo-text">
                      <span className="light">micro</span>
                      <span className="regular">polariscope</span>
                    </h1>
                  </div>
                </header>

                <button className="auth-back-circle-btn" onClick={() => setLoginScreen('welcome')} aria-label="Voltar">
                  <svg viewBox="0 0 24 24" width="16" height="16" stroke="#ffffff" strokeWidth="4.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </button>

                <form className="auth-form" onSubmit={handleRegister} style={{ padding: '24px 30px' }}>
                  <h3 className="register-title">Criar conta</h3>

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

                  <div className="register-field-group">
                    <label htmlFor="register-name" className="register-label">Nome</label>
                    <input
                      type="text"
                      id="register-name"
                      className="register-input"
                      placeholder="Nome"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="register-field-group">
                    <label htmlFor="register-email" className="register-label">Email</label>
                    <input
                      type="email"
                      id="register-email"
                      className="register-input"
                      placeholder="Email"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="register-field-group">
                    <label htmlFor="register-password" className="register-label">Palavra-passe</label>
                    <input
                      type="password"
                      id="register-password"
                      className="register-input"
                      placeholder="Palavra-passe"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      required
                    />
                    <span className="register-field-hint">Deve ter no minimo 8 caracteres</span>
                  </div>

                  <div className="register-field-group">
                    <label htmlFor="register-confirm-password" className="register-label">Confirmar palavra-passe</label>
                    <input
                      type="password"
                      id="register-confirm-password"
                      className="register-input"
                      placeholder="Palavra-passe"
                      value={registerConfirmPassword}
                      onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="register-field-group">
                    <span className="register-label">Tipo de conta</span>
                    <div className="register-account-types">
                      <div
                        className="register-checkbox-label"
                        onClick={() => setRegisterAccountType('Organização')}
                      >
                        <div className={`register-checkbox-custom ${registerAccountType === 'Organização' ? 'checked' : ''}`}>
                          <svg viewBox="0 0 24 24">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </div>
                        <span>Organização</span>
                      </div>

                      <div
                        className="register-checkbox-label"
                        onClick={() => setRegisterAccountType('Pessoal')}
                      >
                        <div className={`register-checkbox-custom ${registerAccountType === 'Pessoal' ? 'checked' : ''}`}>
                          <svg viewBox="0 0 24 24">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </div>
                        <span>Pessoal</span>
                      </div>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className={`register-submit-btn ${registerName.trim() && registerEmail.trim() && registerPassword.trim() && registerConfirmPassword.trim() ? 'filled' : ''}`}
                  >
                    Criar conta
                  </button>

                  <div className="auth-guest-link" style={{ marginTop: '16px', textAlign: 'center' }}>
                    ...ou entra como <span className="visitor-underlined" onClick={handleGuestLogin}>Visitante</span>
                  </div>
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
                onClick={goBack}
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
                    <span className="regular">polariscope</span>
                  </h1>
                </div>
                <button
                  className="header-profile-btn"
                  onClick={() => openUserProfile(currentUser ? currentUser.name : 'Eu', currentUser ? currentUser.avatar : '/assets/profile.svg')}
                  aria-label="Perfil"
                >
                  <svg width="18" height="18" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 15.5C18.038 15.5 20.5 13.038 20.5 10C20.5 6.962 18.038 4.5 15 4.5C11.962 4.5 9.5 6.962 9.5 10C9.5 13.038 11.962 15.5 15 15.5Z" fill="white" />
                    <path d="M5.375 28C5.375 21.95 10.325 18 15 18C19.675 18 24.625 21.95 24.625 28" fill="white" />
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
                    onClick={goBack}
                    aria-label="Voltar"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                  </button>

                  {/* Top Banner Actions (Notifications and Settings) */}
                  {(() => {
                    const isOwnProfile = currentUser && (
                      viewingUser.name.toLowerCase().replace(/\s+/g, '') === currentUser.name.toLowerCase().replace(/\s+/g, '') ||
                      (currentUser.name === 'Visitante' && viewingUser.name === 'Eu')
                    );
                    if (!isOwnProfile) return null;
                    return (
                      <div className="profile-banner-actions">
                        <button
                          className="profile-action-btn notification-btn"
                          onClick={() => setIsNotificationsOpen(true)}
                          aria-label="Notificações"
                        >
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                          </svg>
                          <span className="bell-badge"></span>
                        </button>
                        <button
                          className="profile-action-btn settings-btn"
                          onClick={() => setIsSettingsOpen(true)}
                          aria-label="Configurações"
                        >
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="3"></circle>
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                          </svg>
                        </button>
                      </div>
                    );
                  })()}

                  {/* Banner Section */}
                  <div className="event-detail-banner-container">
                    <div
                      className="event-detail-banner-bg"
                      style={{ backgroundImage: `url(${viewingUser.banner})` }}
                    ></div>

                    {/* Overlapping Avatar */}
                    <div
                      className={`event-detail-avatar-container ${currentUser && (viewingUser.name.toLowerCase().replace(/\s+/g, '') === currentUser.name.toLowerCase().replace(/\s+/g, '') || (currentUser.name === 'Visitante' && viewingUser.name === 'Eu')) ? 'editable-avatar' : ''}`}
                      onClick={(e) => {
                        const isOwnProfile = currentUser && (viewingUser.name.toLowerCase().replace(/\s+/g, '') === currentUser.name.toLowerCase().replace(/\s+/g, '') || (currentUser.name === 'Visitante' && viewingUser.name === 'Eu'));
                        if (isOwnProfile && e.target.closest('.avatar-edit-overlay')) {
                          if (profileAvatarInputRef.current) {
                            profileAvatarInputRef.current.click();
                          }
                        }
                      }}
                      title={currentUser && (viewingUser.name.toLowerCase().replace(/\s+/g, '') === currentUser.name.toLowerCase().replace(/\s+/g, '') || (currentUser.name === 'Visitante' && viewingUser.name === 'Eu')) ? "Alterar foto de perfil" : "Foto de perfil"}
                    >
                      <img
                        src={viewingUser.avatar}
                        className="event-detail-avatar"
                        alt={viewingUser.name}
                      />
                      {currentUser && (viewingUser.name.toLowerCase().replace(/\s+/g, '') === currentUser.name.toLowerCase().replace(/\s+/g, '') || (currentUser.name === 'Visitante' && viewingUser.name === 'Eu')) && (
                        <div className="avatar-edit-overlay">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                            <circle cx="12" cy="13" r="4" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* User Meta Info */}
                  <div className="user-profile-meta">
                    <h2 className="user-profile-name">{viewingUser.name}</h2>
                    <span className="user-profile-role">
                      {viewingUser.role === 'Membro' || viewingUser.role === 'Pessoal' ? 'Pessoal' : 'Organização'}
                    </span>
                    <p className="user-profile-bio">{viewingUser.bio}</p>
                    {(() => {
                      const isOwnProfile = currentUser && (
                        viewingUser.name.toLowerCase().replace(/\s+/g, '') === currentUser.name.toLowerCase().replace(/\s+/g, '') ||
                        (currentUser.name === 'Visitante' && viewingUser.name === 'Eu')
                      );
                      if (isOwnProfile) {
                        return (
                          <button
                            className="profile-edit-btn"
                            onClick={startEditingProfile}
                          >
                            Editar perfil
                          </button>
                        );
                      }
                      return null;
                    })()}
                  </div>

                  {/* Tabs selector */}
                  {(() => {
                    const isOwnProfile = currentUser && (
                      viewingUser.name.toLowerCase().replace(/\s+/g, '') === currentUser.name.toLowerCase().replace(/\s+/g, '') ||
                      (currentUser.name === 'Visitante' && viewingUser.name === 'Eu')
                    );
                    if (!isOwnProfile) return null;
                    return (
                      <div className="user-profile-tabs-selector">
                        <button
                          className={`user-profile-tab-btn ${userProfileTab === 'contributos' ? 'active' : 'inactive'}`}
                          onClick={() => setUserProfileTab('contributos')}
                        >
                          Contributos
                        </button>
                        <button
                          className={`user-profile-tab-btn ${userProfileTab === 'guardados' ? 'active' : 'inactive'}`}
                          onClick={() => setUserProfileTab('guardados')}
                        >
                          Guardados
                        </button>
                      </div>
                    );
                  })()}

                  {/* Tab Content */}
                  <div className="user-profile-tab-content">
                    {userProfileTab === 'contributos' ? (
                      <div className="profile-contributos-sections">
                        {(() => {
                          const isOwnProfile = currentUser && (
                            viewingUser.name.toLowerCase().replace(/\s+/g, '') === currentUser.name.toLowerCase().replace(/\s+/g, '') ||
                            (currentUser.name === 'Visitante' && viewingUser.name === 'Eu')
                          );

                          const userEvents = events.filter(e => {
                            const orgClean = e.organizer.toLowerCase().replace(/\s+/g, '');
                            const nameClean = viewingUser.name.toLowerCase().replace(/\s+/g, '');
                            return orgClean.includes(nameClean) || nameClean.includes(orgClean);
                          });

                          const userMoments = moments.filter(m => {
                            const authorClean = m.authorName.toLowerCase().replace(/\s+/g, '');
                            const nameClean = viewingUser.name.toLowerCase().replace(/\s+/g, '');
                            return authorClean.includes(nameClean) || nameClean.includes(authorClean);
                          });

                          return (
                            <>
                              {/* 1. Rascunhos (Own Profile only) */}
                              {isOwnProfile && (
                                <div className="profile-section" style={{ marginBottom: '24px' }}>
                                  <h3 className="profile-section-title">Rascunhos ({drafts.length})</h3>
                                  {drafts.length > 0 ? (
                                    <div className="profile-drafts-list" style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px', width: '100%' }}>
                                      {drafts.map(draft => (
                                        <div key={draft.id} className="profile-draft-card" onClick={() => loadDraftToCamera(draft)} style={{ flex: '0 0 110px', position: 'relative', cursor: 'pointer', background: '#f8f9fa', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e9ecef' }}>
                                          <img src={draft.photo} alt={draft.title} style={{ width: '100%', height: '110px', objectFit: 'cover' }} />
                                          <div style={{ padding: '6px' }}>
                                            <div style={{ fontSize: '11px', fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#333' }}>{draft.title}</div>
                                            <div style={{ fontSize: '9px', color: '#888', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{draft.eventTitle}</div>
                                          </div>
                                          <button
                                            type="button"
                                            className="profile-draft-delete-btn"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              deleteDraft(draft.id);
                                            }}
                                            style={{ position: 'absolute', top: '6px', right: '6px', background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff', cursor: 'pointer' }}
                                            aria-label="Eliminar rascunho"
                                          >
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                              <line x1="18" y1="6" x2="6" y2="18"></line>
                                              <line x1="6" y1="6" x2="18" y2="18"></line>
                                            </svg>
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="profile-section-fallback">Não tem rascunhos na câmara.</div>
                                  )}
                                </div>
                              )}

                              {/* 2. Momentos */}
                              <div className="profile-section" style={{ marginBottom: '24px' }}>
                                <h3 className="profile-section-title">
                                  {isOwnProfile ? `Momentos (${userMoments.length})` : 'Momentos Recentes'}
                                </h3>
                                {userMoments.length > 0 ? (
                                  <div className={`user-profile-moments-list ${!isOwnProfile ? 'compact' : ''}`}>
                                    {userMoments.map(m => (
                                      <div
                                        key={m.id}
                                        className="user-profile-moment-card"
                                        onPointerDown={(e) => {
                                          momentMouseDownPosRef.current = { x: e.clientX, y: e.clientY, time: Date.now() };
                                        }}
                                        onClick={(e) => handleMomentClick(e, m.id)}
                                      >
                                        <img src={m.photo} className="user-profile-moment-img" alt={m.title} />
                                        <div className="user-profile-moment-info">
                                          <span className="user-profile-moment-title">{m.title}</span>
                                          <span className="user-profile-moment-likes">❤️ {m.likes} Gostos</span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="profile-section-fallback">Não partilhou nenhum momento ainda.</div>
                                )}
                              </div>

                              {/* 3. Eventos */}
                              <div className="profile-section">
                                <h3 className="profile-section-title">Eventos ({userEvents.length})</h3>
                                {userEvents.length > 0 ? (
                                  <div className="user-profile-events-list">
                                    {userEvents.map(evt => (
                                      <div key={evt.id} className="user-profile-event-card" onClick={() => handleEventClick(evt.id)}>
                                        <img src={evt.image} className="user-profile-event-img" alt={evt.title} />
                                        <div className="user-profile-event-title-badge">
                                          {evt.title}
                                        </div>
                                        <div className="user-profile-event-desc-overlay">
                                          <p className="user-profile-event-desc">{evt.description}</p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="profile-section-fallback">Não organizou nenhum evento ainda.</div>
                                )}
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    ) : (
                      <div className="profile-guardados-sections">
                        {/* 1. Momentos Guardados */}
                        <div className="profile-section" style={{ marginBottom: '24px' }}>
                          <h3 className="profile-section-title">Momentos Guardados</h3>
                          {(() => {
                            const savedMom = moments.filter(m => savedMoments.includes(m.id));
                            if (savedMom.length > 0) {
                              return (
                                <div className="user-profile-moments-list">
                                  {savedMom.map(m => (
                                    <div
                                      key={m.id}
                                      className="user-profile-moment-card"
                                      onPointerDown={(e) => {
                                        momentMouseDownPosRef.current = { x: e.clientX, y: e.clientY, time: Date.now() };
                                      }}
                                      onClick={(e) => handleMomentClick(e, m.id)}
                                    >
                                      <img src={m.photo} className="user-profile-moment-img" alt={m.title} />
                                      <div className="user-profile-moment-info">
                                        <span className="user-profile-moment-title">{m.title}</span>
                                        <span className="user-profile-moment-likes">❤️ {m.likes} Gostos</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              );
                            } else {
                              return <div className="profile-section-fallback">Não tem momentos guardados.</div>;
                            }
                          })()}
                        </div>

                        {/* 2. Eventos Guardados */}
                        <div className="profile-section">
                          <h3 className="profile-section-title">Eventos Guardados</h3>
                          {(() => {
                            const savedEvts = events.filter(evt => savedEvents.includes(evt.id));
                            if (savedEvts.length > 0) {
                              return (
                                <div className="user-profile-events-list">
                                  {savedEvts.map(evt => (
                                    <div key={evt.id} className="user-profile-event-card" onClick={() => handleEventClick(evt.id)}>
                                      <img src={evt.image} className="user-profile-event-img" alt={evt.title} />
                                      <div className="user-profile-event-title-badge">
                                        {evt.title}
                                      </div>
                                      <div className="user-profile-event-desc-overlay">
                                        <p className="user-profile-event-desc">{evt.description}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              );
                            } else {
                              return <div className="profile-section-fallback">Não tem eventos guardados.</div>;
                            }
                          })()}
                        </div>
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
                                src={currentEvent.image || '/assets/profile.svg'}
                                className="event-detail-avatar"
                                alt={currentEvent.title}
                              />
                            </div>
                          </div>

                          {/* Info Content Section */}
                          <div className="event-detail-info">
                            <div className="event-detail-title-row" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                              <h2 className="event-detail-title" style={{ margin: 0, textAlign: 'center' }}>{currentEvent.title}</h2>
                            </div>
                            <p className="event-detail-subtitle">{currentEvent.subtitle || currentEvent.description}</p>

                            {/* Meta Info (Location & Date) */}
                            <div className="event-detail-meta-container">
                              {currentEvent.location && (
                                <div className="event-detail-location-row">
                                  <svg className="icon-map-pin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                    <circle cx="12" cy="10" r="3"></circle>
                                  </svg>
                                  <span>{currentEvent.location}</span>
                                </div>
                              )}

                              <div className="event-detail-date-row">
                                <svg className="icon-calendar" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
                                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                  <line x1="16" y1="2" x2="16" y2="6"></line>
                                  <line x1="8" y1="2" x2="8" y2="6"></line>
                                  <line x1="3" y1="10" x2="21" y2="10"></line>
                                </svg>
                                <span>{currentEvent.date || 'Hoje, 20:00 - 23:00'}</span>
                              </div>
                            </div>

                            {/* Creator Identification (Inline below Date) */}
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
                                <span className="organizer-badge-label">
                                  {getOrganizerRole(currentEvent.organizer, currentUser)}
                                </span>
                                <span className="organizer-badge-name">
                                  {currentEvent.organizerLabel || currentEvent.organizer}
                                </span>
                              </div>
                            </div>

                            {/* Event Actions Bar: Like, Save, Share */}
                            <div className="event-detail-actions-bar">
                              <button 
                                type="button" 
                                className={`event-detail-action-btn like-btn ${likedEvents.includes(currentEvent.id) ? 'active' : ''}`} 
                                onClick={() => toggleLikeEvent(currentEvent.id)}
                              >
                                <svg viewBox="0 0 24 24" fill={likedEvents.includes(currentEvent.id) ? "#ff3b30" : "none"} stroke={likedEvents.includes(currentEvent.id) ? "#ff3b30" : "currentColor"} strokeWidth="2.5">
                                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                </svg>
                                <span>{getEventLikes(currentEvent)} Likes</span>
                              </button>

                              {currentUser && (
                                <button 
                                  type="button" 
                                  className={`event-detail-action-btn save-btn ${savedEvents.includes(currentEvent.id) ? 'active' : ''}`} 
                                  onClick={() => toggleSaveEvent(currentEvent.id)}
                                >
                                  <svg viewBox="0 0 24 24" fill={savedEvents.includes(currentEvent.id) ? "var(--primary)" : "none"} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                                  </svg>
                                  <span>{savedEvents.includes(currentEvent.id) ? 'Guardado' : 'Guardar'}</span>
                                </button>
                              )}

                              <button 
                                type="button" 
                                className="event-detail-action-btn share-btn" 
                                onClick={() => handleShareEventClick(currentEvent)}
                              >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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

                          {/* Moments Grid */}
                          <div className="event-detail-moments-section">
                            {/* Centered Momentos Identifier/Button */}
                            <div className="moments-grid-header-container">
                              <button
                                className="event-detail-momentos-btn"
                                onClick={() => {
                                  const eventMoments = moments.filter(m => m.eventId === currentEvent.id);
                                  if (eventMoments.length > 0) {
                                    setExpandedMomentId(eventMoments[0].id);
                                  } else {
                                    showToast("Ainda não há momentos partilhados para este evento.");
                                  }
                                }}
                              >
                                Momentos
                              </button>
                            </div>
                            <div className="event-detail-moments-grid">
                              {(() => {
                                const eventMoments = moments.filter(m => m.eventId === currentEvent.id);
                                if (eventMoments.length > 0) {
                                  return eventMoments.map(m => (
                                    <div
                                      key={m.id}
                                      className="grid-moment-card"
                                      onPointerDown={(e) => {
                                        momentMouseDownPosRef.current = { x: e.clientX, y: e.clientY, time: Date.now() };
                                      }}
                                      onClick={(e) => handleMomentClick(e, m.id)}
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
                            <h2
                              className="eventos-title"
                              onClick={() => setIsRadiusModalOpen(true)}
                              style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                            >
                              <span>Eventos</span>
                              <span className="eventos-title-radius">{captureRadius}km</span>
                              <svg className="eventos-title-edit-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 20h9" />
                                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                              </svg>
                            </h2>
                            <div className="eventos-scroll-bar">
                              {/* Plus card - "Criar Evento" */}
                              <div
                                className="event-story-item"
                                onClick={() => setIsCreatingEvent(true)}
                              >
                                <div className="event-card-frame">
                                  <button className="create-event-btn" aria-label="Criar Evento">
                                    <img src="/assets/plus.svg" alt="Plus Icon" />
                                  </button>
                                </div>
                                <span className="event-story-caption">Criar Evento</span>
                              </div>

                              {/* Dynamic Event list filtered by distance */}
                              {(() => {
                                const filtered = events.filter(evt => {
                                  const dist = getDistanceKm(radiusCenter[0], radiusCenter[1], evt.lat, evt.lng);
                                  return dist <= captureRadius;
                                });

                                if (filtered.length === 0) {
                                  return (
                                    <div className="no-events-in-radius-message">
                                      Sem eventos no raio de {captureRadius}km
                                    </div>
                                  );
                                }

                                return filtered.map(evt => {
                                  const isSelected = selectedEventId === evt.id;
                                  const isAnySelected = selectedEventId !== null;
                                  const itemClass = `event-story-item ${isSelected ? 'selected' : ''} ${isAnySelected && !isSelected ? 'not-selected' : ''}`;
                                  return (
                                    <div
                                      key={evt.id}
                                      className={itemClass}
                                      onPointerDown={(e) => handleEventPressStart(e, evt.id)}
                                      onPointerUp={(e) => handleEventPressEnd(e, evt.id)}
                                      onPointerMove={handleEventPressMove}
                                      onPointerCancel={handleEventPressCancel}
                                      onPointerLeave={handleEventPressCancel}
                                      style={{ touchAction: 'pan-x' }}
                                    >
                                      <div className={`event-card-frame ${evt.live ? 'live-event' : 'active-event'}`}>
                                        <div className="event-card-image-container">
                                          <img src={evt.image} alt={evt.title} />
                                        </div>
                                      </div>
                                      <span className="event-story-caption">{evt.title}</span>
                                    </div>
                                  );
                                });
                              })()}
                            </div>
                          </section>

                          {/* Feed of Moments */}
                          <section className="moments-feed">
                            {(() => {
                              const eventsWithinRadiusIds = events
                                .filter(evt => {
                                  const dist = getDistanceKm(radiusCenter[0], radiusCenter[1], evt.lat, evt.lng);
                                  return dist <= captureRadius;
                                })
                                .map(evt => evt.id);

                              let filteredMoments = moments.filter(m => eventsWithinRadiusIds.includes(m.eventId));

                              if (selectedEventId) {
                                filteredMoments = filteredMoments.filter(m => m.eventId === selectedEventId);
                              }

                              if (filteredMoments.length === 0) {
                                return (
                                  <div className="no-moments-in-radius-message" style={{ textAlign: 'center', padding: '40px 20px', color: '#888', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', margin: '10px 0 30px 0' }}>
                                    <p style={{ fontWeight: '600', fontSize: '14px', margin: '0 0 4px 0' }}>
                                      {selectedEventId ? 'Sem momentos para este evento' : `Sem momentos no raio de ${captureRadius}km`}
                                    </p>
                                    <p style={{ fontSize: '12px', margin: 0 }}>
                                      {selectedEventId ? 'Clica no evento novamente para limpar o filtro.' : 'Tenta aumentar o raio ou reposicionar o centro da pesquisa.'}
                                    </p>
                                  </div>
                                );
                              }

                              return filteredMoments.map(m => (
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
                                        <span
                                          className="moment-event-title-span"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleEventClick(m.eventId);
                                          }}
                                          style={{ cursor: 'pointer', textDecoration: 'underline' }}
                                        >
                                          {m.eventTitle}
                                        </span>
                                        {m.location && <span className="moment-location-pin"> • {m.location}</span>}
                                        {m.isLive && <span className="live"> (AO VIVO)</span>}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Main image content with overlay details */}
                                  <div
                                    className="moment-image-container"
                                    onPointerDown={(e) => {
                                      momentMouseDownPosRef.current = { x: e.clientX, y: e.clientY, time: Date.now() };
                                    }}
                                    onClick={(e) => handleMomentClick(e, m.id)}
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
                                      <time className="moment-photo-time">{m.time === 'LIVE' ? 'AO VIVO' : m.time}</time>
                                    </div>

                                    {/* Floating Pop Heart Animation */}
                                    <span className={`double-tap-heart ${animateHeartMomentId === m.id ? 'animate' : ''}`}>
                                      <svg width="60" height="60" viewBox="0 0 24 24" fill="#ff1b1b">
                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                      </svg>
                                    </span>
                                  </div>

                                  {/* Actions: Likes, Comments, Share, Bookmarks (Figma 635:868) */}
                                  <div className="moment-actions-figma">
                                    <button
                                      className="moment-comments-pill-btn"
                                      onClick={() => setActiveCommentsMomentId(m.id)}
                                    >
                                      Comentários {m.comments.length > 0 && `(${m.comments.length})`}
                                    </button>

                                    <div className="moment-icons-right">
                                      <button
                                        className={`moment-icon-action-btn heart-btn ${m.liked ? 'liked' : ''}`}
                                        onClick={() => likeMoment(m.id)}
                                        aria-label="Gostar"
                                        style={{ position: 'relative' }}
                                      >
                                        <svg viewBox="0 0 35.0005 31.0041" fill={m.liked ? "var(--primary)" : "none"} stroke="currentColor" strokeWidth="3" strokeLinejoin="round">
                                          <path d="M31.1737 14.01L17.461 29.5041L3.70726 14.01C-3.7333 4.54136 9.36525 -4.06646 17.461 6.04774C26.7042 -4.06646 38.5921 4.54136 31.1737 14.01Z" />
                                        </svg>
                                        <span style={{
                                          position: 'absolute',
                                          top: '44%',
                                          left: '50%',
                                          transform: 'translate(-50%, -50%)',
                                          fontSize: '9px',
                                          fontWeight: '900',
                                          color: m.liked ? '#ffffff' : 'var(--primary)',
                                          pointerEvents: 'none'
                                        }}>
                                          {m.likes}
                                        </span>
                                      </button>

                                      <button
                                        className="moment-icon-action-btn share-btn"
                                        onClick={() => handleShareMomentClick(m)}
                                        aria-label="Partilhar"
                                      >
                                        <svg viewBox="0 0 27.0622 26.5001" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round">
                                          <path d="M12.4833 1.39259C12.8958 1.17704 13.3942 1.20784 13.7763 1.47364L25.2763 9.47364C25.6121 9.70732 25.8124 10.0909 25.8124 10.5C25.8124 10.9092 25.6121 11.2927 25.2763 11.5264L13.7763 19.5264C13.3942 19.7922 12.8958 19.823 12.4833 19.6074C12.0709 19.3919 11.8124 18.9654 11.8124 18.5V14.4658C10.5741 14.2189 9.59474 14.3566 8.80751 14.6924C7.82383 15.112 7.00173 15.9004 6.329 16.958C4.96147 19.1081 4.38986 22.0896 4.31142 24.0498C4.28635 24.6765 3.80031 25.1881 3.17568 25.2451C2.55112 25.3021 1.98082 24.8872 1.84267 24.2754C0.374352 17.7728 1.77421 13.5793 4.45009 10.957C6.66074 8.79083 9.57114 7.87806 11.8124 7.44532V2.50001C11.8124 2.03464 12.0709 1.60816 12.4833 1.39259Z" />
                                        </svg>
                                      </button>

                                      {currentUser && (
                                        <button
                                          className={`moment-icon-action-btn save-btn ${savedMoments.includes(m.id) ? 'saved' : ''}`}
                                          onClick={() => toggleSaveMoment(m.id)}
                                          aria-label="Guardar"
                                        >
                                          <svg viewBox="0 0 27 31" fill={savedMoments.includes(m.id) ? "var(--primary)" : "none"} stroke="currentColor" strokeWidth="3" strokeLinejoin="round">
                                            <path d="M25.5 1.5H1.5V2.97368V29.5L14.25 21.3947L25.5 29.5V1.5Z" />
                                          </svg>
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </article>
                              ));
                            })()}
                          </section>

                          {/* Feed Onboarding Guide Overlay */}
                          {feedOnboardingStep !== null && (
                            <div className="feed-onboarding-overlay">
                              <div className="feed-onboarding-card">
                                {feedOnboardingStep === 1 ? (
                                  <>
                                    <div className="feed-onboarding-icon">
                                      <svg width="58" height="58" viewBox="0 0 38 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <defs>
                                          <linearGradient id="logo-grad-onboarding" x1="0%" y1="0%" x2="0%" y2="100%">
                                            <stop offset="0%" stopColor="#F77E1A" />
                                            <stop offset="100%" stopColor="#F7AD1A" />
                                          </linearGradient>
                                        </defs>
                                        <path
                                          d="M31.5803 30.4242L36.9553 13.779M28.1249 30.0371L34.2678 11.4565M31.5803 32.7468H12.7677M13.9194 35.8436H30.8124M21.5981 30.0371L24.6695 21.1339M25.0535 30.0371L27.3571 23.0694M21.5981 15.3274L28.8928 20.7468M23.9017 13.0048L29.6606 17.65M18.5266 0.617751L31.9642 11.0694M15.8391 2.94033L30.8124 14.1661M13.9194 4.87582L0.473583 15.096M16.607 6.8113L1.63365 18.4242M19.2945 9.13388L13.5355 13.3919M21.982 11.0694L14.6873 16.4887M11.2319 14.5532L14.3034 23.4565M8.54441 16.8758L10.848 23.4565M10.848 26.1661H20.0624M11.9998 29.65H19.2945M5.85689 18.4242L11.6159 36.6178M3.16937 20.7468L8.16048 36.6178"
                                          stroke="url(#logo-grad-onboarding)"
                                          strokeWidth="2.5"
                                          strokeMiterlimit="4"
                                        />
                                      </svg>
                                    </div>
                                    <h3 className="feed-onboarding-title">Introdução</h3>
                                    <p className="feed-onboarding-desc">
                                      Descobre como está organizado o microPolariscope!
                                    </p>

                                    <div className="feed-onboarding-features">
                                      <div className="feed-onboarding-feature eventos-feature">
                                        <div>
                                          <strong>Eventos (Horizontal)</strong>
                                          <p>A barra superior agrupa os Eventos que estão dentro do raio definido por ti.</p>
                                        </div>
                                      </div>

                                      <div className="feed-onboarding-feature momentos-feature">
                                        <div>
                                          <strong>Momentos (Vertical)</strong>
                                          <p>Dentro de cada Evento, encontras o feed de Momentos — fotografias e comentários partilhados pela comunidade.</p>
                                        </div>
                                      </div>
                                    </div>

                                    <button
                                      className="feed-onboarding-btn"
                                      onClick={() => setFeedOnboardingStep(2)}
                                    >
                                      Seguinte
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <div className="feed-onboarding-icon">
                                      <div className="onboarding-focus-demo">
                                        <div className="onboarding-mock-bar">
                                          {/* Event 1 (Left) - Feira */}
                                          <div className="onboarding-mock-event event-1">
                                            <div className="onboarding-mock-event-border">
                                              <div className="onboarding-mock-event-img">
                                                <img src="/mock_feira.jpg" alt="Feira" />
                                              </div>
                                            </div>
                                            <span className="onboarding-mock-event-label">Feira</span>
                                          </div>

                                          {/* Event 2 (Middle) - Festival */}
                                          <div className="onboarding-mock-event event-2">
                                            <div className="onboarding-mock-event-border double-outline">
                                              <div className="onboarding-mock-event-img">
                                                <img src="https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=120&auto=format&fit=crop&q=80" alt="Festival" />
                                              </div>
                                            </div>
                                            <span className="onboarding-mock-event-label">Festival</span>
                                            
                                            {/* Hand Icon (maozinha) pointing finger (a apontar o dedo) */}
                                            <img className="onboarding-tap-icon" src="/mock_hand.png" alt="Touch gesture" width="36" height="36" />
                                          </div>

                                          {/* Event 3 (Right) - Teatro */}
                                          <div className="onboarding-mock-event event-3">
                                            <div className="onboarding-mock-event-border">
                                              <div className="onboarding-mock-event-img">
                                                <img src="/mock_teatro.jpg" alt="Teatro" />
                                              </div>
                                            </div>
                                            <span className="onboarding-mock-event-label">Teatro</span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <h3 className="feed-onboarding-title">Modo Foco no Evento</h3>
                                    <p className="feed-onboarding-desc">
                                      Podes destacar um Evento para filtrar o feed instantaneamente:
                                    </p>

                                    <div className="feed-onboarding-features">
                                      <div className="feed-onboarding-feature">
                                        <div>
                                          <strong>Focar Evento</strong>
                                          <p>Mantém pressionado um evento na barra superior para ativar o modo foco. O evento ganha um contorno laranja brilhante.</p>
                                        </div>
                                      </div>

                                      <div className="feed-onboarding-feature">
                                        <div>
                                          <strong>Filtro Automático</strong>
                                          <p>O feed vertical passa a mostrar apenas os momentos desse evento. Toca rápido no evento para desativar e ver tudo novamente.</p>
                                        </div>
                                      </div>
                                    </div>

                                    <button
                                      className="feed-onboarding-btn"
                                      onClick={() => setFeedOnboardingStep(null)}
                                    >
                                      Entendido
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </>
                  )}

                  {/* TAB 2: CAMERA CAPTURE */}
                  {currentTab === 'camera' && (
                    <div className="camera-screen-container">
                      {cameraOnboardingStep !== null && (
                        <div 
                          className="camera-onboarding-backdrop" 
                          onClick={() => {
                            if (cameraOnboardingStep === 'event') {
                              setCameraOnboardingStep('location');
                            } else {
                              setCameraOnboardingStep(null);
                            }
                          }}
                        />
                      )}
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
                            setNewPostEventId('');
                            setNewPostLocation('');
                            setEventSearchQuery('');
                            setLocationSearchQuery('');
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
                          <div className={`camera-selector-container ${cameraOnboardingStep === 'event' ? 'onboarding-active' : ''}`}>
                            <button
                              type="button"
                              className={`camera-selector-btn ${cameraOnboardingStep === 'event' ? 'onboarding-highlighted' : ''}`}
                              onClick={() => {
                                setIsEventDropdownOpen(!isEventDropdownOpen);
                                setIsLocationDropdownOpen(false);
                              }}
                            >
                              <span className="truncate-text">
                                {events.find(ev => ev.id === newPostEventId)?.title || 'Evento *'}
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
                                  {/* Special Item: Criar Evento */}
                                  {('Criar Evento'.toLowerCase().includes(eventSearchQuery.toLowerCase())) && (
                                    <button
                                      type="button"
                                      className="dropdown-item special-location-item"
                                      onClick={() => {
                                        setIsCreatingEvent(true);
                                        setIsEventDropdownOpen(false);
                                      }}
                                    >
                                      Criar Evento
                                    </button>
                                  )}

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
                                  {events.filter(ev => ev.title.toLowerCase().includes(eventSearchQuery.toLowerCase())).length === 0 &&
                                    !'Criar Evento'.toLowerCase().includes(eventSearchQuery.toLowerCase()) && (
                                      <div className="dropdown-no-results">Nenhum evento encontrado</div>
                                    )}
                                </div>
                              </div>
                            )}

                            {cameraOnboardingStep === 'event' && (
                              <div className="camera-onboarding-tooltip" onClick={(e) => e.stopPropagation()}>
                                <div className="camera-onboarding-tooltip-arrow"></div>
                                <h4 className="camera-onboarding-tooltip-title">
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transform: 'translateY(1px)' }}>
                                    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                                    <line x1="4" y1="22" x2="4" y2="15"></line>
                                  </svg>
                                  Associar Evento *
                                </h4>
                                <p className="camera-onboarding-tooltip-text">
                                  Associe este momento a um evento. Isto é obrigatório para que os participantes o vejam no feed do evento.
                                </p>
                                <div className="camera-onboarding-tooltip-footer">
                                  <button
                                    type="button"
                                    className="camera-onboarding-tooltip-btn"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setCameraOnboardingStep('location');
                                    }}
                                  >
                                    Seguinte
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Location Selector */}
                          <div className={`camera-selector-container ${cameraOnboardingStep === 'location' ? 'onboarding-active' : ''}`}>
                            <button
                              type="button"
                              className={`camera-selector-btn ${cameraOnboardingStep === 'location' ? 'onboarding-highlighted' : ''}`}
                              onClick={() => {
                                setIsLocationDropdownOpen(!isLocationDropdownOpen);
                                setIsEventDropdownOpen(false);
                              }}
                            >
                              <span className="truncate-text">
                                {newPostLocation || 'Localização *'}
                              </span>
                              <svg className={`chevron-icon ${isLocationDropdownOpen ? 'open' : ''}`} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="6 9 12 15 18 9"></polyline>
                              </svg>
                            </button>

                            {isLocationDropdownOpen && (
                              <div className="camera-dropdown-menu">
                                <div className="dropdown-search-container">
                                  <svg className="dropdown-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                  </svg>
                                  <input
                                    type="text"
                                    placeholder="Pesquisar localização"
                                    className="dropdown-search-input"
                                    value={locationSearchQuery}
                                    onChange={(e) => setLocationSearchQuery(e.target.value)}
                                    onClick={(e) => e.stopPropagation()}
                                    autoFocus
                                  />
                                </div>

                                <div className="dropdown-items-list">
                                  {/* Special Items */}
                                  {('Localização do Evento'.toLowerCase().includes(locationSearchQuery.toLowerCase())) && (
                                    <button
                                      type="button"
                                      className={`dropdown-item special-location-item ${(() => {
                                        const selectedEv = events.find(ev => ev.id === newPostEventId);
                                        let eventLoc = 'Aveiro, Portugal';
                                        if (selectedEv) {
                                          if (selectedEv.id === 'event-1') eventLoc = 'HardBar, Aveiro';
                                          else if (selectedEv.id === 'event-2') eventLoc = 'Esgueira, Aveiro';
                                          else if (selectedEv.id === 'event-3') eventLoc = 'Café do Parque, Aveiro';
                                          else eventLoc = selectedEv.title + ', Aveiro';
                                        }
                                        return newPostLocation === eventLoc ? 'active' : '';
                                      })()}`}
                                      onClick={() => {
                                        const selectedEv = events.find(ev => ev.id === newPostEventId);
                                        if (selectedEv) {
                                          let loc = 'Aveiro, Portugal';
                                          if (selectedEv.id === 'event-1') loc = 'HardBar, Aveiro';
                                          else if (selectedEv.id === 'event-2') loc = 'Esgueira, Aveiro';
                                          else if (selectedEv.id === 'event-3') loc = 'Café do Parque, Aveiro';
                                          else loc = selectedEv.title + ', Aveiro';
                                          setNewPostLocation(loc);
                                        } else {
                                          setNewPostLocation('Aveiro, Portugal');
                                        }
                                        setIsLocationDropdownOpen(false);
                                        setLocationSearchQuery('');
                                      }}
                                    >
                                      Localização do Evento
                                    </button>
                                  )}

                                  {('Minha Localização (GPS)'.toLowerCase().includes(locationSearchQuery.toLowerCase())) && (
                                    <button
                                      type="button"
                                      className={`dropdown-item special-location-item ${newPostLocation === 'Minha Localização (GPS)' ? 'active' : ''}`}
                                      onClick={() => {
                                        setNewPostLocation('Minha Localização (GPS)');
                                        setIsLocationDropdownOpen(false);
                                        setLocationSearchQuery('');
                                      }}
                                    >
                                      Minha Localização (GPS)
                                    </button>
                                  )}

                                  {/* Regular Items */}
                                  {[
                                    'Jardim Oudinot',
                                    'Cais da Fonte Nova',
                                    'Praia da Barra',
                                    'Costa Nova',
                                    'Universidade de Aveiro',
                                    'Forum Aveiro'
                                  ]
                                    .filter(loc => loc.toLowerCase().includes(locationSearchQuery.toLowerCase()))
                                    .map((loc, idx) => (
                                      <button
                                        key={idx}
                                        type="button"
                                        className={`dropdown-item ${newPostLocation === loc ? 'active' : ''}`}
                                        onClick={() => {
                                          setNewPostLocation(loc);
                                          setIsLocationDropdownOpen(false);
                                          setLocationSearchQuery('');
                                        }}
                                      >
                                        {loc}
                                      </button>
                                    ))
                                  }

                                  {/* No results fallback */}
                                  {(!'Localização do Evento'.toLowerCase().includes(locationSearchQuery.toLowerCase()) &&
                                    !'Minha Localização (GPS)'.toLowerCase().includes(locationSearchQuery.toLowerCase()) &&
                                    [
                                      'Jardim Oudinot',
                                      'Cais da Fonte Nova',
                                      'Praia da Barra',
                                      'Costa Nova',
                                      'Universidade de Aveiro',
                                      'Forum Aveiro'
                                    ].filter(loc => loc.toLowerCase().includes(locationSearchQuery.toLowerCase())).length === 0) && (
                                      <div className="dropdown-no-results">Nenhuma localização encontrada</div>
                                    )
                                  }

                                  <div className="dropdown-custom-input-row" onClick={(e) => e.stopPropagation()}>
                                    <input
                                      type="text"
                                      placeholder="Outro..."
                                      className="custom-location-input"
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                          e.preventDefault();
                                          if (e.target.value.trim()) {
                                            setNewPostLocation(e.target.value.trim());
                                            e.target.value = '';
                                          }
                                          setIsLocationDropdownOpen(false);
                                          setLocationSearchQuery('');
                                        }
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            )}

                            {cameraOnboardingStep === 'location' && (
                              <div className="camera-onboarding-tooltip" onClick={(e) => e.stopPropagation()}>
                                <div className="camera-onboarding-tooltip-arrow"></div>
                                <h4 className="camera-onboarding-tooltip-title">
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                    <circle cx="12" cy="10" r="3"></circle>
                                  </svg>
                                  Definir Localização *
                                </h4>
                                <p className="camera-onboarding-tooltip-text">
                                  Indique a localização ou palco da foto para situar este momento no mapa do evento.
                                </p>
                                <div className="camera-onboarding-tooltip-footer">
                                  <button
                                    type="button"
                                    className="camera-onboarding-tooltip-btn"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setCameraOnboardingStep(null);
                                    }}
                                  >
                                    Entendi
                                  </button>
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
                          <div className="post-metadata-sheet-overlay" onClick={closeMomentSheetWithAnimation}>
                            <div
                              ref={sheetRef}
                              className="post-metadata-sheet"
                              onClick={(e) => e.stopPropagation()}
                              onPointerMove={handleSheetDragMove}
                              onAnimationEnd={(e) => {
                                e.currentTarget.style.animation = 'none';
                                e.currentTarget.style.transform = 'translateY(0)';
                              }}
                            >
                              {/* Drag handle */}
                              <div
                                className="metadata-sheet-handle"
                                onClick={closeMomentSheetWithAnimation}
                                onPointerDown={handleSheetDragStart}
                                onPointerUp={handleSheetDragEnd}
                                style={{ touchAction: 'none' }}
                              ></div>

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
                                  <button
                                    type="button"
                                    className="metadata-action-btn polar-ai-btn"
                                    disabled={isAiLoading}
                                    onClick={handleAiAutofill}
                                  >
                                    {isAiLoading ? (
                                      <div className="ai-spinner-icon"></div>
                                    ) : (
                                      <>
                                        <svg className="sparkle-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275Z" />
                                          <path d="m5 3 1 2.5L8.5 6 6 7 5 9.5 4 7 1.5 6 4 5Z" opacity="0.8" />
                                          <path d="m19 17 1 2.5 2.5.5-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1Z" opacity="0.8" />
                                        </svg>
                                        <span>PolarIA</span>
                                      </>
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
                            <path d="M31.5803 30.4242L36.9553 13.779M28.1249 30.0371L34.2678 11.4565M31.5803 32.7468H12.7677M13.9194 35.8436H30.8124M21.5981 30.0371L24.6695 21.1339M25.0535 30.0371L27.3571 23.0694M21.5981 15.3274L28.8928 20.7468M23.9017 13.0048L29.6606 17.65M18.5266 0.617751L31.9642 11.0694M15.8391 2.94033L30.8124 14.1661M13.9194 4.87582L0.473583 15.096M16.607 6.8113L1.63365 18.4242M19.2945 9.13388L13.5355 13.3919M21.982 11.0694L14.6873 16.4887M11.2319 14.5532L14.3034 23.4565M8.54441 16.8758L10.848 23.4565M10.848 26.1661H20.0624M11.9998 29.65H19.2945M5.85689 18.4242L11.6159 36.6178M3.16937 20.7468L8.16048 36.6178" stroke="url(#logo-grad)" strokeWidth="2.5" strokeMiterlimit="4" />
                          </svg>
                        </button>
                        <input
                          type="text"
                          placeholder="Pesquisar aqui"
                          className="search-input-field"
                          value={mapSearchQuery}
                          onChange={(e) => setMapSearchQuery(e.target.value)}
                        />
                      </div>

                      {/* 4. Floating Actions Column (Figma bottom-right) */}
                      <div className="floating-actions-column-map">
                        <button
                          className={`map-action-fab ${radiusCenter && radiusCenter[0] === USER_LOCATION[0] && radiusCenter[1] === USER_LOCATION[1] ? 'active' : ''}`}
                          onClick={handleLocationClick}
                          title="Centralizar na minha localização"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="22" x2="18" y1="12" y2="12" />
                            <line x1="6" x2="2" y1="12" y2="12" />
                            <line x1="12" x2="12" y1="6" y2="2" />
                            <line x1="12" x2="12" y1="22" y2="18" />
                          </svg>
                        </button>
                        <button
                          className="map-action-fab"
                          onClick={handleShareClick}
                          title="Partilhar Localização"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="18" cy="5" r="3" />
                            <circle cx="6" cy="12" r="3" />
                            <circle cx="18" cy="19" r="3" />
                            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                          </svg>
                        </button>

                        {/* Hidden polariscope toggle */}
                        <button
                          className={`map-action-fab ${polariscopeVisible ? 'active' : ''}`}
                          onClick={handleCompassClick}
                          style={{ display: 'none' }}
                        >
                          <svg viewBox="0 0 24 24">
                            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                            <circle cx="12" cy="12" r="10" />
                          </svg>
                        </button>
                      </div>

                      {/* 5. Range Slider Control (Bottom) */}
                      <div className="map-radius-control-capsule">
                        <span className="radius-label">Raio de Captura: <strong>{captureRadius}km</strong></span>
                        <input
                          type="range"
                          min="10"
                          max="300"
                          value={captureRadius}
                          onChange={(e) => setCaptureRadius(Number(e.target.value))}
                          className="map-radius-slider"
                        />
                        <span className="map-interaction-tip" style={{ fontSize: '9px', color: '#f17522', fontWeight: 'bold', textAlign: 'center', marginTop: '2px', lineHeight: '1.2' }}>
                          Pressiona 1 segundo na zona onde queres que seja o centro do raio (ou arrasta o alvo)
                        </span>
                      </div>

                      {/* Onboarding Guide Overlay */}
                      {!hasSeenMapOnboarding && (
                        <div className="map-onboarding-overlay">
                          <div className="map-onboarding-card">
                            <div className="map-onboarding-icon">🗺️</div>
                            <h3 className="map-onboarding-title">Dicas do Mapa</h3>
                            <p className="map-onboarding-desc">
                              Descobre como navegar e definir a tua área de pesquisa:
                            </p>

                            <div className="map-onboarding-features">
                              <div className="map-onboarding-feature">
                                <span className="feature-icon">⏳</span>
                                <div>
                                  <strong>Pressiona 1s</strong>
                                  <p>Fica a pressionar num ponto do mapa para definir o centro do raio e evitar cliques acidentais.</p>
                                </div>
                              </div>

                              <div className="map-onboarding-feature">
                                <span className="feature-icon">🎯</span>
                                <div>
                                  <strong>Botão de Localização (GPS)</strong>
                                  <p>1º clique centra o mapa em ti.<br />2º clique centra o raio na tua localização atual (o botão fica <span style={{ color: '#f17522', fontWeight: 'bold' }}>laranja</span>).</p>
                                </div>
                              </div>
                            </div>

                            <button
                              className="map-onboarding-btn"
                              onClick={() => setHasSeenMapOnboarding(true)}
                            >
                              Entendido
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                </>
              )}

            </main>

            {/* --- FLOATING BOTTOM NAVBAR --- */}
            {currentTab !== 'camera' && (
              <nav className="navbar-floating-capsule">
                <button
                  className={`navbar-item ${currentTab === 'feed' && !viewingUser ? 'active' : ''}`}
                  onClick={() => {
                    setCurrentTab('feed');
                    setViewingUser(null);
                    setViewingEventId(null);
                    setExpandedMomentId(null);
                    setSelectedEventId(null);
                    setNavHistory([]);
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
                      fill={currentTab === 'feed' && !viewingUser ? 'white' : 'none'}
                    />
                  </svg>
                </button>

                <button
                  className={`navbar-item ${currentTab === 'camera' ? 'active' : ''}`}
                  onClick={() => {
                    setCapturedPhoto(null);
                    setCurrentTab('camera');
                    setViewingUser(null);
                    setViewingEventId(null);
                    setExpandedMomentId(null);
                    setSelectedEventId(null);
                    setNavHistory([]);
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
                  className={`navbar-item ${currentTab === 'map' && !viewingUser ? 'active' : ''}`}
                  onClick={() => {
                    setCurrentTab('map');
                    setViewingUser(null);
                    setViewingEventId(null);
                    setExpandedMomentId(null);
                    setSelectedEventId(null);
                    setNavHistory([]);
                  }}
                  aria-label="Event Map"
                >
                  <svg width="28" height="26" viewBox="0 0 36 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M1 4L12 0.5V26.5L1 30ZM12 0.5L24 4V30L12 26.5ZM24 4L35 0.5V26.5L24 30Z"
                      stroke={currentTab === 'map' && !viewingUser ? '#F17522' : 'white'}
                      strokeWidth="2.5"
                      strokeLinejoin="round"
                      fill={currentTab === 'map' && !viewingUser ? 'white' : 'none'}
                    />
                  </svg>
                </button>
              </nav>
            )}

            {/* --- STORY PLAYER OVERLAY (Instagram-style) --- */}
            {activeStoryEventId && activeStoryEvent && (
              <div 
                className="story-player-overlay"
                onPointerDown={handleStoryDragStart}
                onPointerMove={handleStoryDragMove}
                onPointerUp={(e) => handleStoryDragEnd(e, 'story')}
                onClickCapture={handleStoryClickCapture}
              >
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
                          {activeStoryEvent.title} {activeStoryEvent.live && <span style={{ color: '#ff3b30', fontWeight: 'bold' }}>(AO VIVO)</span>}
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
                const activeMoments = getActiveStoryMoments();
                const m = activeMoments.find(moment => moment.id === expandedMomentId) || moments.find(moment => moment.id === expandedMomentId);
                if (!m) return null;
                return (
                  <div 
                    className="story-player-overlay moment-story-player"
                    onPointerDown={handleStoryDragStart}
                    onPointerMove={handleStoryDragMove}
                    onPointerUp={(e) => handleStoryDragEnd(e, 'moment')}
                    onClickCapture={handleStoryClickCapture}
                  >
                    {/* Tap Navigation */}
                    <div className="story-tap-navigation">
                      <div className="story-tap-left" onClick={() => navigateMoment('prev')}></div>
                      <div className="story-tap-right" onClick={() => navigateMoment('next')}></div>
                    </div>

                    {/* Header with bars and metadata */}
                    <div className="story-player-header">
                      <div className="story-progress-bar-container">
                        {activeMoments.map((mom, idx) => {
                          const currentActiveIndex = activeMoments.findIndex(item => item.id === expandedMomentId);
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
                              <span
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEventClick(m.eventId);
                                }}
                                style={{ cursor: 'pointer', textDecoration: 'underline', color: '#ffb380' }}
                              >
                                {m.eventTitle}
                              </span>
                              {m.isLive && <span style={{ color: '#ff3b30', fontWeight: 'bold' }}>(AO VIVO)</span>}
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
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
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
                          style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#f17522' }}
                        >
                          <svg viewBox="0 0 24 24" style={{ stroke: '#f17522', fill: m.liked ? '#f17522' : 'none', width: '20px', height: '20px' }}>
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                          </svg>
                          <span style={{ fontWeight: '700' }}>{m.likes}</span>
                        </button>

                        <button
                          className="expanded-moment-action-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveCommentsMomentId(m.id);
                          }}
                          style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#f17522' }}
                        >
                          <svg viewBox="0 0 24 24" style={{ stroke: '#f17522', fill: 'none', width: '20px', height: '20px' }}>
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                          </svg>
                          <span style={{ fontWeight: '700' }}>{m.comments.length}</span>
                        </button>

                        <button
                          className={`expanded-moment-action-btn ${savedMoments.includes(m.id) ? 'saved' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSaveMoment(m.id);
                          }}
                          style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#f17522' }}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            style={{
                              stroke: '#f17522',
                              strokeWidth: '2.5',
                              fill: savedMoments.includes(m.id) ? "#f17522" : "none",
                              width: '20px',
                              height: '20px'
                            }}
                          >
                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                          </svg>
                        </button>

                        <button
                          className="expanded-moment-action-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShareMomentClick(m);
                          }}
                          style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#f17522' }}
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="#f17522" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '20px', height: '20px' }}>
                            <circle cx="18" cy="5" r="3" />
                            <circle cx="6" cy="12" r="3" />
                            <circle cx="18" cy="19" r="3" />
                            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()
            )}

            {/* --- BOTTOM SHEET: CREATE EVENT --- */}
            {isCreatingEvent && (
              <div className="bottom-sheet-overlay" onClick={closeEventSheetWithAnimation}>
                <div
                  ref={eventSheetRef}
                  className="orange-bottom-sheet"
                  onClick={(e) => e.stopPropagation()}
                  onPointerMove={handleEventSheetDragMove}
                  onAnimationEnd={(e) => {
                    e.currentTarget.style.animation = 'none';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div
                    className="bottom-sheet-drag-handle"
                    onClick={closeEventSheetWithAnimation}
                    onPointerDown={handleEventSheetDragStart}
                    onPointerUp={handleEventSheetDragEnd}
                    style={{ touchAction: 'none', cursor: 'pointer' }}
                  ></div>

                  <div className="bottom-sheet-header">
                    <h3 className="bottom-sheet-title">Criar Novo Evento</h3>
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
                      <button
                        type="button"
                        className="form-input-clickable"
                        onClick={() => {
                          setPickerTab('date');
                          setIsDateTimePickerOpen(true);
                        }}
                      >
                        <span>{newEventDate || 'Selecionar Data e Hora'}</span>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                      </button>
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
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
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



                    <button type="submit" className="submit-btn">Criar Evento</button>
                  </form>
                </div>
              </div>
            )}

            {/* --- DATE TIME PICKER MODAL --- */}
            {isDateTimePickerOpen && (
              <div className="datetime-picker-overlay" onClick={() => setIsDateTimePickerOpen(false)}>
                <div className="datetime-picker-modal" onClick={e => e.stopPropagation()}>
                  <div className="datetime-picker-header">
                    <div className="datetime-picker-title-row">
                      <span className="datetime-picker-title-text">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '6px' }}>
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        Data e Hora
                      </span>
                      <button type="button" className="datetime-picker-close-btn" onClick={() => setIsDateTimePickerOpen(false)}>
                        ✕
                      </button>
                    </div>

                    <div className="datetime-picker-tabs">
                      <button
                        type="button"
                        className={`datetime-tab ${pickerTab === 'date' ? 'active' : ''}`}
                        onClick={() => setPickerTab('date')}
                      >
                        {formatDateLabel(selectedDate)}
                      </button>
                      <span className="datetime-tab-divider">|</span>
                      <button
                        type="button"
                        className={`datetime-tab ${pickerTab === 'time' ? 'active' : ''}`}
                        onClick={() => setPickerTab('time')}
                      >
                        {isAllDay ? 'Todo o dia' : formatTimeLabel(selectedHour, selectedMinute)}
                      </button>
                    </div>
                  </div>

                  <div className="datetime-picker-content">
                    {pickerTab === 'date' ? (
                      <div className="calendar-view">
                        <div className="calendar-month-selector">
                          <button type="button" className="cal-nav-btn" onClick={prevMonth}>&lt;</button>
                          <span className="cal-month-label">{getMonthYearLabel(currentPickerMonth, currentPickerYear)}</span>
                          <button type="button" className="cal-nav-btn" onClick={nextMonth}>&gt;</button>
                        </div>
                        <div className="calendar-weekdays">
                          <span>DOM</span>
                          <span>SEG</span>
                          <span>TER</span>
                          <span>QUA</span>
                          <span>QUI</span>
                          <span>SEX</span>
                          <span>SÁB</span>
                        </div>
                        <div className="calendar-days-grid">
                          {renderCalendarDays()}
                        </div>
                      </div>
                    ) : (
                      <div className="time-picker-view">
                        <div className="all-day-toggle-row">
                          <span className="toggle-label">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '6px', verticalAlign: 'middle' }}>
                              <circle cx="12" cy="12" r="10" />
                              <polyline points="12 6 12 12 16 14" />
                            </svg>
                            Todo o dia
                          </span>
                          <label className="switch">
                            <input
                              type="checkbox"
                              checked={isAllDay}
                              onChange={e => setIsAllDay(e.target.checked)}
                            />
                            <span className="slider round"></span>
                          </label>
                        </div>

                        {!isAllDay && (
                          <>
                            <div className="time-wheel-container">
                              {/* Hours column */}
                              <div
                                ref={hourScrollRef}
                                className="time-wheel-col"
                                onScroll={handleHoursScroll}
                              >
                                <div className="time-wheel-scroll">
                                  {renderHoursList()}
                                </div>
                              </div>
                              <div className="time-wheel-colon">:</div>
                              {/* Minutes column */}
                              <div
                                ref={minuteScrollRef}
                                className="time-wheel-col"
                                onScroll={handleMinutesScroll}
                              >
                                <div className="time-wheel-scroll">
                                  {renderMinutesList()}
                                </div>
                              </div>
                            </div>

                            <div className="quick-time-chips">
                              <button type="button" onClick={() => addHoursToCurrent(1)}>Daqui a 1 hora</button>
                              <button type="button" onClick={() => setSpecificTime(7, 0)}>07:00</button>
                              <button type="button" onClick={() => setSpecificTime(15, 0)}>15:00</button>
                              <button type="button" onClick={() => setSpecificTime(22, 0)}>22:00</button>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="datetime-picker-footer">
                    <button type="button" className="datetime-picker-confirm-btn" onClick={confirmDateTimeSelection}>
                      Confirmar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* --- BOTTOM SHEET: COMMENTS SECTION --- */}
            {activeCommentsMomentId && activeCommentsMoment && (
              <div className="bottom-sheet-overlay" onClick={() => setActiveCommentsMomentId(null)} style={{ zIndex: 2500 }}>
                <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
                  <div className="bottom-sheet-drag-handle"></div>

                  <div className="bottom-sheet-header">
                    <h3 className="bottom-sheet-title">Comentários</h3>
                    <button className="bottom-sheet-close" onClick={() => setActiveCommentsMomentId(null)}>×</button>
                  </div>

                  {/* List comments */}
                  <div className="comments-list">
                    {activeCommentsMoment.comments.length === 0 ? (
                      <p style={{ color: 'var(--text-muted)', fontSize: '13px', textAlign: 'center', padding: '16px 0' }}>
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
          <div className="bottom-sheet-overlay" onClick={() => setIsSharingSheetOpen(false)} style={{ zIndex: 2500 }}>
            <div className="sharing-bottom-sheet" onClick={(e) => e.stopPropagation()}>
              <div className="sharing-sheet-drag-handle" onClick={() => setIsSharingSheetOpen(false)}>
                <svg width="22" height="10" viewBox="0 0 22 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 2L11 8L20 2" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
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
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                </button>
              </div>

              <div className="sharing-social-row">
                <div className="sharing-social-card" onClick={() => handleSocialShare('WhatsApp')}>
                  <div className="sharing-social-icon-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                    </svg>
                  </div>
                  <span className="sharing-social-label">WhatsApp</span>
                </div>

                <div className="sharing-social-card" onClick={() => handleSocialShare('Instagram')}>
                  <div className="sharing-social-icon-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#E1306C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                  </div>
                  <span className="sharing-social-label">Instagram</span>
                </div>

                <div className="sharing-social-card" onClick={() => handleSocialShare('Facebook')}>
                  <div className="sharing-social-icon-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#1877F2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                  </div>
                  <span className="sharing-social-label">Facebook</span>
                </div>

                <div className="sharing-social-card" onClick={() => handleSocialShare('Mais')}>
                  <div className="sharing-social-icon-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#666666" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="1" />
                      <circle cx="19" cy="12" r="1" />
                      <circle cx="5" cy="12" r="1" />
                    </svg>
                  </div>
                  <span className="sharing-social-label">Mais</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- MODAL: ADJUST CAPTURE RADIUS --- */}
        {isRadiusModalOpen && (
          <div className="radius-modal-overlay" onClick={() => setIsRadiusModalOpen(false)}>
            <div className="radius-modal-card" onClick={(e) => e.stopPropagation()}>
              <h3 className="radius-modal-title">Raio de Captura</h3>
              <p className="radius-modal-desc">
                Ajusta o raio para ver os eventos que decorrem até esta distância da tua localização.
              </p>

              <div className="radius-modal-value-display">
                <span className="radius-value-number">{captureRadius}</span>
                <span className="radius-value-unit">km</span>
              </div>

              <div className="radius-modal-slider-container">
                <input
                  type="range"
                  min="10"
                  max="300"
                  value={captureRadius}
                  onChange={(e) => setCaptureRadius(Number(e.target.value))}
                  className="modal-radius-slider"
                />
                <div className="slider-labels">
                  <span>10 km</span>
                  <span>150 km</span>
                  <span>300 km</span>
                </div>
              </div>

              <button className="radius-modal-confirm-btn" onClick={() => setIsRadiusModalOpen(false)}>
                Confirmar
              </button>
            </div>
          </div>
        )}

        {/* --- BOTTOM SHEET: EDIT PROFILE --- */}
        {isEditingProfile && (
          <div className="bottom-sheet-overlay" onClick={() => setIsEditingProfile(false)}>
            <div className="orange-bottom-sheet profile-edit-sheet" onClick={(e) => e.stopPropagation()}>
              <div className="bottom-sheet-drag-handle"></div>
              <div className="orange-bottom-sheet-header">
                <h2>Editar Perfil</h2>
              </div>
              <div className="orange-bottom-sheet-content">
                <div className="profile-edit-avatar-section">
                  <div className="profile-edit-media-preview" style={{ backgroundImage: `url(${currentUser?.banner || viewingUser?.banner})` }}>
                    <button
                      type="button"
                      className="edit-media-btn edit-banner-btn"
                      onClick={() => profileBannerInputRef.current && profileBannerInputRef.current.click()}
                    >
                      Alterar Banner
                    </button>
                  </div>

                  <div className="profile-edit-avatar-container">
                    <img src={currentUser?.avatar || viewingUser?.avatar} className="profile-edit-avatar-img" alt="Avatar" />
                    <button
                      type="button"
                      className="edit-avatar-camera-btn"
                      onClick={() => profileAvatarInputRef.current && profileAvatarInputRef.current.click()}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                        <circle cx="12" cy="13" r="4" />
                      </svg>
                    </button>
                  </div>
                </div>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveProfile(editProfileName, editProfileBio, editProfileRole);
                }} className="profile-edit-form">
                  <div className="form-group">
                    <label className="orange-label">Nome</label>
                    <input
                      type="text"
                      className="orange-input"
                      value={editProfileName}
                      onChange={(e) => setEditProfileName(e.target.value)}
                      placeholder="Nome do perfil"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="orange-label">Biografia</label>
                    <textarea
                      className="orange-input textarea-bio"
                      value={editProfileBio}
                      onChange={(e) => setEditProfileBio(e.target.value)}
                      placeholder="Fale um pouco sobre si..."
                      rows="3"
                    />
                  </div>

                  <div className="form-group">
                    <label className="orange-label">Tipo de conta</label>
                    <div className="account-type-toggle-row">
                      <button
                        type="button"
                        className={`account-type-pill ${editProfileRole === 'Pessoal' ? 'active' : ''}`}
                        onClick={() => setEditProfileRole('Pessoal')}
                      >
                        Pessoal
                      </button>
                      <button
                        type="button"
                        className={`account-type-pill ${editProfileRole === 'Organização' ? 'active' : ''}`}
                        onClick={() => setEditProfileRole('Organização')}
                      >
                        Organização
                      </button>
                    </div>
                  </div>

                  <div className="profile-edit-buttons-row">
                    <button
                      type="button"
                      className="profile-edit-cancel-btn"
                      onClick={() => setIsEditingProfile(false)}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="profile-edit-save-btn"
                    >
                      Guardar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* --- BOTTOM SHEET: NOTIFICATIONS --- */}
        {isNotificationsOpen && (
          <div className="bottom-sheet-overlay" onClick={() => setIsNotificationsOpen(false)}>
            <div className="orange-bottom-sheet notifications-sheet" onClick={(e) => e.stopPropagation()}>
              <div className="bottom-sheet-drag-handle"></div>
              <div className="orange-bottom-sheet-header">
                <h2>Notificações</h2>
              </div>
              <div className="orange-bottom-sheet-content">
                <div className="notifications-list">
                  <div className="notification-item unread">
                    <div className="notification-avatar" style={{ backgroundImage: `url(/assets/hardbar_avatar.png)` }}></div>
                    <div className="notification-details">
                      <p><strong>HardBar</strong> gostou do teu momento em <em>Concerto no Hardbar</em>.</p>
                      <span className="notification-time">Há 5 min</span>
                    </div>
                    <div className="notification-status-dot"></div>
                  </div>
                  <div className="notification-item">
                    <div className="notification-avatar" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80)` }}></div>
                    <div className="notification-details">
                      <p><strong>Ana Silva</strong> começou a seguir-te.</p>
                      <span className="notification-time">Há 1 hora</span>
                    </div>
                  </div>
                  <div className="notification-item">
                    <div className="notification-avatar" style={{ backgroundImage: `url(/assets/logo.svg)` }}></div>
                    <div className="notification-details">
                      <p><strong>PolarIA</strong> sugeriu adicionar o momento ao evento <em>Cicloturismo Aveiro</em>.</p>
                      <span className="notification-time">Há 1 dia</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- BOTTOM SHEET: SETTINGS --- */}
        {isSettingsOpen && (
          <div className="bottom-sheet-overlay" onClick={() => setIsSettingsOpen(false)}>
            <div className="orange-bottom-sheet settings-sheet" onClick={(e) => e.stopPropagation()}>
              <div className="bottom-sheet-drag-handle"></div>
              <div className="orange-bottom-sheet-header">
                <h2>Configurações</h2>
              </div>
              <div className="orange-bottom-sheet-content settings-content-list">
                <button
                  className="settings-action-row"
                  onClick={() => {
                    setIsSettingsOpen(false);
                    startEditingProfile();
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <span>Editar Perfil</span>
                </button>

                <button className="settings-action-row" onClick={() => { showToast('Idioma: Português'); setIsSettingsOpen(false); }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                  </svg>
                  <span>Idioma (Português)</span>
                </button>

                <button className="settings-action-row" onClick={() => { showToast('Notificações ativas'); setIsSettingsOpen(false); }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                  </svg>
                  <span>Definições de Notificações</span>
                </button>

                <button
                  className="settings-action-row"
                  onClick={() => {
                    toggleFullscreen();
                    setIsSettingsOpen(false);
                  }}
                >
                  {isFullscreen ? (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 14h6v6M20 10h-6V4M14 10l7-7M10 14l-7 7" />
                      </svg>
                      <span>Sair de Ecrã Inteiro</span>
                    </>
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3" />
                      </svg>
                      <span>Entrar em Ecrã Inteiro</span>
                    </>
                  )}
                </button>

                <button
                  className="settings-action-row logout-row"
                  onClick={() => {
                    setIsSettingsOpen(false);
                    handleLogout();
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  <span>Terminar Sessão</span>
                </button>

                {/* Version badge inside settings */}
                <div className="settings-version-badge" style={{ fontSize: '10px', color: '#94a3b8', marginTop: '20px', marginBottom: '8px', textAlign: 'center', fontWeight: '500', fontFamily: 'var(--font-family)', letterSpacing: '0.5px', width: '100%' }}>
                  Protótipo v1.5.a
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
