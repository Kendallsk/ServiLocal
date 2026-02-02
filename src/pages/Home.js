import { useEffect, useState } from 'react';

import Header from '../components/Header';
import HeroMap from '../components/HeroMap';
import SearchBar from '../components/SearchBar';
import CategoryCarousel from '../components/CategoryCarousel';

import ServiceShowcase from '../components/ServiceShowcase';




 // Categorías
  const categorias = [
    {
    id: 1,
    nombre: 'Electricista',
    slug: 'electricista',
    descripcion: 'Instalaciones, mantenimiento y reparaciones eléctricas.',
    image: 'https://plus.unsplash.com/premium_photo-1661908782924-de673a5c6988?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZWxlY3RyaWNpc3RhfGVufDB8fDB8fHww',
  },
  {
    id: 2,
    nombre: 'Plomero',
    slug: 'plomero',
    descripcion: 'Reparación de tuberías, grifería y fugas de agua.',
    image: 'https://plus.unsplash.com/premium_photo-1663045495725-89f23b57cfc5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGxvbWVyb3xlbnwwfHwwfHx8MA%3D%3D',
  },
  {
    id: 3,
    nombre: 'Gas',
    slug: 'gas',
    descripcion: 'Instalación y mantenimiento de sistemas de gas.',
    image: 'https://imagenes.primicias.ec/files/og_thumbnail/uploads/2024/05/25/6652b9f900cd0.jpeg',
  },

   {
    id: 4,
    nombre: 'Carpintero',
    slug: 'carpintero',
    descripcion: 'Arreglar o elaboracion de muebles',
    image: 'https://plus.unsplash.com/premium_photo-1664300494539-313eac2a6095?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2FycGludGVyb3xlbnwwfHwwfHx8MA%3D%3D',
  },

   {
    id: 5,
    nombre: 'Albañil',
    slug: 'albanil',
    descripcion: 'Construtar de infraestructura del hogar',
    image: 'https://media.istockphoto.com/id/2183863027/es/foto/trabajador-de-la-construcci%C3%B3n-sonriendo-y-usando-su-tel%C3%A9fono-celular-en-una-obra.webp?a=1&b=1&s=612x612&w=0&k=20&c=sxEkWS8rnPw2OEzPOnrjmJ0ImTPmrcM5jgV6CzX9Vgo=',
  },

   {
    id: 6,
    nombre: 'Niñera',
    slug: 'ninera',
    descripcion: 'Cuidadora de niños',
    image: 'https://plus.unsplash.com/premium_photo-1710024588156-8fd763d86961?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bmklQzMlQjFlcmF8ZW58MHx8MHx8fDA%3D',
  },

   {
    id: 7,
    nombre: 'Pintor',
    slug: 'pintor',
    descripcion: 'Pintar todo tipo de infraestructura',
    image: 'https://images.unsplash.com/photo-1602910344216-bd2226c18d4c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cGludG9yfGVufDB8fDB8fHww',
  },
  ];

const Home = () => {
  
   
  const [activeCategory, setActiveCategory] = useState(categorias[0]);
  
  const [searchQuery, setSearchQuery] = useState('');

  // Centro del mapa (default: Latacunga)
  const [mapCenter, setMapCenter] = useState({
    lat: -0.2208,
    lng: -78.5123,
  });

 

  const filteredCategorias = categorias.filter(cat =>
    cat.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pedir ubicación al cargar
useEffect(() => {
  if (!navigator.geolocation) {
    console.warn('Geolocalización no soportada');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      setMapCenter({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });

      console.log('Precisión (metros):', position.coords.accuracy);
    },
    (error) => {
      console.warn('No se pudo obtener ubicación', error);
    },
    {
      enableHighAccuracy: true, // 🔥 CLAVE
      timeout: 10000,
      maximumAge: 0,
    }
  );
}, []);


  // Marker basado en el centro actual
  const markers = [
    {
      position: mapCenter,
      title: 'Tu ubicación',
    },
  ];

  return (
    <>
      <Header activeCategory={activeCategory} />
      <HeroMap
        mapCenter={mapCenter}
        markers={markers}
        activeCategory={activeCategory}
      />

      <ServiceShowcase
          categorias={filteredCategorias}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />


    </>
  );
};

export default Home;
