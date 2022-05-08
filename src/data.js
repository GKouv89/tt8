let thematics = [
  { 
    _id: 1,
    name: 'Περιβάλλον',
    desc: 'Η πρώτη περιγραφή',
    img_path: process.env.PUBLIC_URL + 'pubassets/environment.jpg'
  },
  { 
    _id: 2,
    name: 'Εργασία',
    desc: 'Η 2η περιγραφή',
    img_path: process.env.PUBLIC_URL + 'pubassets/jobs.jpg'
  },
  { 
    _id: 3,
    name: 'Μεταναστευτικό',
    desc: 'Η 3η περιγραφή',
    img_path: process.env.PUBLIC_URL + 'pubassets/immigration.jpg'
  }
];

let colors = [
  // {'name': '#9400D3'}, // Violet
	// {'name': '#4B0082'}, // Indigo
  
  '#9400D3',
  '#4B0082',
  '#0000FF', // Blue	
  '#00FF00', // Green
	'#FFFF00', // Yellow
	'#FF7F00', // Orange
  '#FF0000', // Red
];
  
export function getThematics() {
    return thematics;
}

export function getColors() {
  return colors;
}