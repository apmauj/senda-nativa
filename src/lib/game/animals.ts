// ============================================================
// Senda Nativa — Fichas de los animales autóctonos de Uruguay
// ============================================================

import type { AnimalId, AnimalInfo } from './types'

export const ANIMALS: AnimalInfo[] = [
  {
    id: 'carpincho',
    name: 'CARPINCHO',
    scientificName: 'Hydrochoerus hydrochaeris',
    nickname: 'EL MÁS TRANQUILO DEL RÍO',
    personality: 'TRANQUILO Y SOCIABLE',
    habitat: 'RÍOS, ARROYOS Y BAÑADOS',
    funFact:
      'ES EL ROEDOR MÁS GRANDE DEL MUNDO Y LE ENCANTA REMOJARSE EN EL AGUA CON SUS AMIGOS.',
    conservation: 'PREOCUPACIÓN MENOR',
    color: '#A9744F',
    colorSoft: '#F3E4D7',
  },
  {
    id: 'zorrito',
    name: 'ZORRITO ROJO',
    scientificName: 'Lycalopex gymnocercus',
    nickname: 'EL PATRULLERO DE LA PRADERA',
    personality: 'CURIOSO Y DESPIERTO',
    habitat: 'PASTIZALES Y BORDES DE MONTE',
    funFact:
      'ES EL ZORRO DE CAMPO: TIENE LA COLA CON PUNTA BLANCA Y SALE A PASEAR AL ATARDECER.',
    conservation: 'PREOCUPACIÓN MENOR',
    color: '#E8834A',
    colorSoft: '#FBEADD',
  },
  {
    id: 'guazubira',
    name: 'GUAZUBIRÁ',
    scientificName: 'Mazama gouazoubira',
    nickname: 'LA CORZUELA DEL MONTE',
    personality: 'TÍMIDA Y ÁGIL',
    habitat: 'MONTE INDÍGENA Y SIERRAS',
    funFact:
      'ES UN VENADITO CHICO, MUY BUENO ESCONDIÉNDOSE ENTRE LOS ARBUSTOS Y SALTANDO CERROS.',
    conservation: 'PREOCUPACIÓN MENOR',
    color: '#C99A6B',
    colorSoft: '#F5EAD9',
  },
  {
    id: 'mulita',
    name: 'MULITA',
    scientificName: 'Dasypus hybridus',
    nickname: 'LA EXCAVADORA DE CAMPO',
    personality: 'ESFORZADA Y VALIENTE',
    habitat: 'CAMPOS Y PASTIZALES BLANDOS',
    funFact:
      'TIENE UN CAPARAZÓN CON BANDITAS, ESCARBA BUSCANDO RICOS BICHOS Y SE HACE BOLA SI SE ASUSTA.',
    conservation: 'CASI AMENAZADO',
    color: '#C4907E',
    colorSoft: '#F6E5DE',
  },
  {
    id: 'lobito',
    name: 'LOBITO DE RÍO',
    scientificName: 'Lontra longicaudis',
    nickname: 'LA PESCADORA JUGUETONA',
    personality: 'JUGUETONA Y VELOZ',
    habitat: 'ARROYOS Y RÍOS DE TODO EL PAÍS',
    funFact:
      'SABE PESCAR CON SUS PATITAS Y SE DESLIZA PANZA ABAJO POR LAS PIEDRAS SOLO PARA JUGAR.',
    conservation: 'VULNERABLE',
    color: '#8A5A3C',
    colorSoft: '#EFDFD2',
  },
  {
    id: 'lechuza',
    name: 'LECHUZA DE CAMPO',
    scientificName: 'Bubo virginianus',
    nickname: 'LA VIGILANTE NOCTURNA',
    personality: 'OBSERVADORA Y SABIA',
    habitat: 'MONTES, PARQUES Y SIERRAS',
    funFact:
      'TIENE PLUMITAS QUE PARECEN OREJAS Y ESCUCHA HASTA EL PASITO MÁS CHICO DE NOCHE.',
    conservation: 'PREOCUPACIÓN MENOR',
    color: '#C7A976',
    colorSoft: '#F3EAD9',
  },
  {
    id: 'yacare',
    name: 'YACARÉ',
    scientificName: 'Caiman latirostris',
    nickname: 'EL SONRIENTE DEL ESTERO',
    personality: 'PACIENTE Y RELAJADO',
    habitat: 'ESTEROS, LAGUNAS Y RÍOS',
    funFact:
      'VOLVIÓ A LOS HUMEDALES DEL URUGUAY Y LE GUSTA TOMAR SOL CON LA BOQUITABIERTA.',
    conservation: 'CASI AMENAZADO',
    color: '#7C8F56',
    colorSoft: '#E8EDDA',
  },
  {
    id: 'yaguarete',
    name: 'YAGUARETÉ',
    scientificName: 'Panthera onca',
    nickname: 'EL GRAN FELINO QUE VOLVIÓ',
    personality: 'FUERTE Y SILENCIOSO',
    habitat: 'HUMEDALES DEL RÍO URUGUAY',
    funFact:
      'CADA YAGUARETÉ TIENE SU PROPIO DIBUJO DE MANCHAS, ¡COMO UNA HUELLA DIGITAL!',
    conservation: 'EN PELIGRO',
    color: '#E9A23B',
    colorSoft: '#FBEFD8',
  },
]

export const ANIMALS_BY_ID: Record<AnimalId, AnimalInfo> = Object.fromEntries(
  ANIMALS.map((a) => [a.id, a])
) as Record<AnimalId, AnimalInfo>

export function getAnimal(id: AnimalId): AnimalInfo {
  return ANIMALS_BY_ID[id]
}
