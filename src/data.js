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

export function getThematics() {
    return thematics;
}

let content = [
  {
    _id: 1,
    _episode_id: 1, 
    _axis_id: '#FF0000', // Red
    name: 'Content 1',
    desc: 'Some content',
    type: 'text',
    subtype: 'quote',
    format: 'txt'
  },
  {
    _id: 2,
    _episode_id: 1, 
    _axis_id: '#FF7F00', // Orange
    name: 'Content 2',
    desc: 'Some content',
    type: 'text',
    subtype: 'quote',
    format: 'txt'
  },
  {
    _id: 3,
    _episode_id: 2, 
    _axis_id: '#FFFF00', // Yellow
    name: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    desc: 'Some content',
    type: 'text',
    subtype: 'quote',
    format: 'txt'
  },
  {
    _id: 4,
    _episode_id: 2, 
    _axis_id: '#00FF00', // Green
    name: 'Content 4',
    desc: 'Some content',
    type: 'text',
    subtype: 'quote',
    format: 'txt'
  },
  {
    _id: 5,
    _episode_id: 3, 
    _axis_id: '#0000FF', // Blue
    name: 'Content 5',
    desc: 'Some content',
    type: 'text',
    subtype: 'quote',
    format: 'txt'
  },
  {
    _id: 6,
    _episode_id: 4, 
    _axis_id: '#4B0082', // Indigo
    name: 'Content 6',
    desc: 'Some content',
    type: 'text',
    subtype: 'quote',
    format: 'txt'
  },
  {
    _id: 7,
    _episode_id: 5, 
    _axis_id: '#9400D3', // Violet
    name: 'Content 7',
    desc: 'Some content',
    type: 'text',
    subtype: 'quote',
    format: 'txt'
  }
];

export function getContentColors() {
  const myColors = Array.from(content, x => x._axis_id);
  return myColors;
}

export function getContent() {
  return content;
}