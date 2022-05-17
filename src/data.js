let thematics = [
  { 
    _id: 1,
    name: 'Περιβάλλον',
    desc: 'Η πρώτη περιγραφή',
    img_path: process.env.PUBLIC_URL + '/pubassets/environment.jpg'
  },
  { 
    _id: 2,
    name: 'Εργασία',
    desc: 'Η 2η περιγραφή',
    img_path: process.env.PUBLIC_URL + '/pubassets/jobs.jpg'
  },
  { 
    _id: 3,
    name: 'Μεταναστευτικό',
    desc: 'Η 3η περιγραφή',
    img_path: process.env.PUBLIC_URL + '/pubassets/immigration.jpg'
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
    name: 'Ποιοτικές Παρατηρήσεις Ψυχολόγων',
    desc: 'Οι ποιοτικές παρατηρήσεις των ψυχολόγων για το επεισόδιο 1',
    type: 'text',
    subtype: 'observations',
    format: 'txt',
    path: process.env.PUBLIC_URL + '/pubassets/MyFirstQuote.txt'
  },
  {
    _id: 2,
    _episode_id: 1, 
    _axis_id: '#FF7F00', // Orange
    name: 'Απόφθευγμα',
    desc: 'Ένα χαρακτηρηστικό απόφθευγμα από το επεισόδιο 1',
    type: 'text',
    subtype: 'quote',
    format: 'txt',
    path: ""
  },
  {
    _id: 3,
    _episode_id: 2, 
    _axis_id: '#FFFF00', // Yellow
    name: 'Ποιοτικές Παρατηρήσεις Ψυχολόγων',
    desc: 'Οι ποιοτικές παρατηρήσεις των ψυχολόγων για το επεισόδιο 2',
    type: 'text',
    subtype: 'observations',
    format: 'txt',
    path: ""
  },
  {
    _id: 4,
    _episode_id: 2, 
    _axis_id: '#00FF00', // Green
    name: 'Απομαγνητοφώνηση',
    desc: 'Η απομαγνητοφώνηση των διαλόγων του επεισοδίου 2',
    type: 'text',
    subtype: 'transcript',
    format: 'txt',
    path: ""
  },
  {
    _id: 5,
    _episode_id: 3, 
    _axis_id: '#0000FF', // Blue
    name: 'Απόφθευγμα',
    desc: 'Ένα χαρακτηριστικό απόφθευγμα από το επεισόδιο 3',
    type: 'text',
    subtype: 'quote',
    format: 'txt',
    path: ""
  },
  {
    _id: 6,
    _episode_id: 4, 
    _axis_id: '#4B0082', // Indigo
    name: 'Απομαγνητοφώνηση',
    desc: 'Η απομαγνητοφώνηση των διαλόγων του επεισοδίου 4',
    type: 'text',
    subtype: 'transcript',
    format: 'txt',
    path: ""
  },
  {
    _id: 7,
    _episode_id: 5, 
    _axis_id: '#9400D3', // Violet
    name: 'Απόφθευγμα',
    desc: 'Ένα χαρακτηριστικό απόφθευγμα από το επεισόδιο 5',
    type: 'text',
    subtype: 'quote',
    format: 'txt',
    path: ""
  },
  {
    _id: 8,
    _episode_id: 1, 
    _axis_id: '#9400D3', // Violet
    name: 'Ενδεικτική εικόνα',
    desc: 'Μία ενδεικτική εικόνα για το επεισόδιο 1',
    type: 'img',
    format: '.jpg',
    path: process.env.PUBLIC_URL + '/pubassets/environment.jpg'
  }
];

const episodes = [
  {
    _id: 1,
    _thematic_id: 1,
    _session_id: 1,
    desc: "Αυτή είναι μία σύντομη περιγραφή του 1ου επεισοδίου."
  },  
  {
    _id: 2,
    _thematic_id: 2,
    _session_id: 1,
    desc: "Αυτή είναι μία σύντομη περιγραφή του 2ου επεισοδίου."
  },
  {
    _id: 3,
    _thematic_id: 1,
    _session_id: 1,
    desc: "Αυτή είναι μία σύντομη περιγραφή του 3ου επεισοδίου."
  },
  {
    _id: 4,
    _thematic_id: 3,
    _session_id: 1,
    desc: "Αυτή είναι μία σύντομη περιγραφή του 4ου επεισοδίου."
  },
  {
    _id: 5,
    _thematic_id: 2,
    _session_id: 1,
    desc: "Αυτή είναι μία σύντομη περιγραφή του 5ου επεισοδίου."
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

export function getThematicEpisodes(id){
  let subsetOfEpisodes = episodes.filter(x => x._thematic_id == id);
  let epNos = Array.from(subsetOfEpisodes, x => x._id);
  return epNos;
}

export function getEpisodeContent(id){
  let subsetOfContent = content.filter(x => x._episode_id == id);
  // console.log(subsetOfContent);
  return subsetOfContent;
}

export function getPieceOfContent(id){
  return content[id];
}

export function getEpisodeDescription(id){
  return episodes[id].desc;
}