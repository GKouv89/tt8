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

const episodes = [
  {
    _id: 1,
    _thematic_id: 1,
    _session_id: 1
  },  
  {
    _id: 2,
    _thematic_id: 2,
    _session_id: 1
  },
  {
    _id: 3,
    _thematic_id: 1,
    _session_id: 1
  },
  {
    _id: 4,
    _thematic_id: 3,
    _session_id: 1
  },
  {
    _id: 5,
    _thematic_id: 2,
    _session_id: 1
  }
];

const axes = [
  {_id: 1,
  color: '#FF0000'},
  {_id: 2,
  color: '#FF7F00'},
  {_id: 3,
  color: '#FFFF00'},
  {_id: 4,
  color: '#00FF00'},
  {_id: 5,
  color: '#0000FF'},
  {_id: 6,
  color: '#4B0082'},
  {_id: 7,
  color: '#9400D3'},
];

export function getContentColors(content) {
  const myColors = Array.from(content, x => x._axis_id);
  return myColors;
}

export function getContentOfThematic(id){
  console.log('Thematic id is ' + id);
  let subsetOfEpisodes = episodes.filter(x => x._thematic_id == id);
  let myContent = [];
  for(let i = 0; i < subsetOfEpisodes.length; i++){
    for(let j = 0; j < content.length; j++){
      if(content[j]._episode_id == subsetOfEpisodes[i]._id){
        myContent.push(content[j]);
      }  
    }
  }
  return myContent;
}

export function getAxisColors(){
  return Array.from(axes, x => x.color);
}

export function getContent() {
  return content;
}