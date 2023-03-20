let thematics = [
  { 
    _id: 1,
    name: 'Περιβάλλον',
    desc: `Το δικαίωμα στην εργασία εντάσσεται στην Οικουμενική Διακήρυξη για τα
    Δικαιώματα του Ανθρώπου. Ως <<ελευθερία του επαγγέλματος και δικαίωμα προς εργασία>>
    περιγράφεται στον Χάρτη των Θεμελιωδών Δικαιωμάτων της Ευρωπαϊκής Ένωσης (άρθρο 15),
    ενώ το δικαίωμα στην εργασία προστατεύται και από το Ελληνικό Σύνταγμα. Η εργασία αποτελεί
    κομβικό σημείο κατά την παραγωγή και την κατανάλωση αγαθών.`,
    img_path: process.env.PUBLIC_URL + '/pubassets/_DSC9344.jpg'
  },
  { 
    _id: 2,
    name: 'Εργασία',
    desc: `Το δικαίωμα στην εργασία εντάσσεται στην Οικουμενική Διακήρυξη για τα
    Δικαιώματα του Ανθρώπου. Ως <<ελευθερία του επαγγέλματος και δικαίωμα προς εργασία>>
    περιγράφεται στον Χάρτη των Θεμελιωδών Δικαιωμάτων της Ευρωπαϊκής Ένωσης (άρθρο 15),
    ενώ το δικαίωμα στην εργασία προστατεύται και από το Ελληνικό Σύνταγμα. Η εργασία αποτελεί
    κομβικό σημείο κατά την παραγωγή και την κατανάλωση αγαθών.`,
    img_path: process.env.PUBLIC_URL + '/pubassets/Eleusina.jpg'
  },
  { 
    _id: 3,
    name: 'Μεταναστευτικό',
    desc: `Το δικαίωμα στην εργασία εντάσσεται στην Οικουμενική Διακήρυξη για τα
    Δικαιώματα του Ανθρώπου. Ως <<ελευθερία του επαγγέλματος και δικαίωμα προς εργασία>>
    περιγράφεται στον Χάρτη των Θεμελιωδών Δικαιωμάτων της Ευρωπαϊκής Ένωσης (άρθρο 15),
    ενώ το δικαίωμα στην εργασία προστατεύται και από το Ελληνικό Σύνταγμα. Η εργασία αποτελεί
    κομβικό σημείο κατά την παραγωγή και την κατανάλωση αγαθών.`,
    img_path: process.env.PUBLIC_URL + '/pubassets/_DSC5708.jpg'
  }
];

export function getThematics() {
    return thematics;
}

export const AllAxesColors = [
  '#943853',
  '#FDFB85',
  '#A5A796',
  '#F2C47B',
  '#ADCF8C',
  '#C8E9F3',
  '#D7E575'
]
export const AllThematicColors = [
  '#8D6EF4',
  '#EB7943',
  '#D2DED7'
]


let content = [
  {
    _id: 1,
    _episode_id: 1, 
    _axis_id: 1, // Red
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
    _axis_id: 2, // Orange
    name: 'Απόφθευγμα',
    desc: 'Θέλω να φύγουν τα σάπια καράβια',
    type: 'text',
    subtype: 'quote',
    format: 'txt',
    path: ""
    // path: ""
  },
  {
    _id: 3,
    _episode_id: 2, 
    _axis_id: 3, // Yellow
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
    _axis_id: 4, // Green
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
    _axis_id: 5, // Blue
    name: 'Απόφθευγμα',
    desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    type: 'text',
    subtype: 'quote',
    format: 'txt',
    path: ""
  },
  {
    _id: 6,
    _episode_id: 4, 
    _axis_id: 6, // Indigo
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
    _axis_id: 7, // Violet
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
    _axis_id: 7, // Violet
    name: 'Ενδεικτική εικόνα',
    desc: 'Μία ενδεικτική εικόνα για το επεισόδιο 1',
    type: 'img',
    format: '.jpg',
    // path: process.env.PUBLIC_URL + '/pubassets/_DSC9344.jpg'
    // path: "/data/_DSC9344.jpg"
    path: "data/_DSC9344.jpg"
  },
  {
    _id: 9,
    _episode_id: 3,
    _axis_id: 3,
    name: 'Απλή Οπτικοποίηση',
    desc: 'Χρωματική Οπτικοποίηση των θερμοκρασιών της Γης τα έτη 1880-2022.',
    type: 'visualization',
    subtype: 'plain',
    fileName: '1.csv',
    // path: ""
  },
  {
    _id: 10,
    _episode_id: 3,
    _axis_id: 4,
    name: 'Αλληλεπιδραστική Οπτικοποίηση',
    desc: 'Οπτικοποίηση με αλληλεπίδραση των θερμοκρασιών της Γης τα έτη 1880-2022.',
    type: 'visualization',
    subtype: 'slider',
    fileName: '1.csv'
    // path: ""
  },
  {
    _id: 11,
    _episode_id: 3,
    _axis_id: 5,
    name: 'Απλή Ηχοποίηση',
    desc: 'Ηχοποίηση των θερμοκρασιών της Γης τα έτη 1880-2022.',
    type: 'sonification'
    // path: ""
  },
  {
    _id: 12,
    _episode_id: 1,
    _axis_id: 1,
    name: 'Participant 1 Biometrics',
    desc: 'Biometrics of the first participant from Section 2',
    type: 'biometrics',
    path: "data/thematic_1/episode_1/participant_data/P1-Section2-2.csv"
  },
  {
    _id: 13,
    _episode_id: 1,
    _axis_id: 4,
    name: 'Participant 3 Biometrics',
    desc: 'Biometrics of the third participant from Section 2',
    type: 'biometrics',
    path: "data/thematic_1/episode_1/participant_data/P3-Section2-2.csv"
  },
  {
    _id: 14,
    _episode_id: 1,
    _axis_id: 1,
    name: 'Participant 4 Biometrics',
    desc: 'Biometrics of the fourth participant from Section 2',
    type: 'biometrics',
    path: "data/thematic_1/episode_1/participant_data/P4-Section2-2.csv"
  },
  {
    _id: 15,
    _episode_id: 1,
    _axis_id: 4,
    name: 'Participant 5 Biometrics',
    desc: 'Biometrics of the fifth participant from Section 2',
    type: 'biometrics',
    path: "data/thematic_1/episode_1/participant_data/P5-Section2-2.csv"
  }
];

const episodes = [
  {
    _id: 1,
    _thematic_id: 1,
    _session_id: 1,
    desc: "Αυτή είναι μία σύντομη περιγραφή του 1ου επεισοδίου."
    // desc: `Contrary to popular belief, Lorem Ipsum is not simply random text. 
    // It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. 
    // Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, 
    // looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, 
    // and going through the cites of the word in classical literature, discovered the undoubtable source. 
    // Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" 
    // (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, 
    // very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.`
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
    name: "Διορατικότητα",
    color: '#943853'
  },
  {_id: 2,
    name: "Αγάπη",
    color: '#FDFB85'
  },
  {_id: 3,
    name: "Ονειροπόλος",
    color: '#A5A796'
  },
  {_id: 4,
    name: "Καταπίεση",
    color: '#F2C47B'
  },
  {_id: 5,
    name: "Υπεραξία",
    color: '#ADCF8C'
  },
  {_id: 6,
    name: "Καταπληκτικό",
    color: '#C8E9F3'
  },
  {_id: 7,
    name: "Σταθερότητα",
    color: '#D7E575'
  },
];

export function getContentColors(content) {
  const myColors = Array.from(content, x => x._axis_id);
  return myColors;
}

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

export function getAxisColors(episodeID){
  let myAxes = [];
  for(let i = 0; i < content.length; i++){
    if(content[i]._episode_id == episodeID){
      myAxes.push(content[i]._axis_id);
    }
  }
  let uniqueAxes = myAxes.filter(onlyUnique);
  // console.log(uniqueAxes);
  return uniqueAxes;
}

export function getAxisColors2(episodeID){
  let myAxes = [], currAxis;
  for(let i = 0; i < content.length; i++){
    if(content[i]._episode_id == episodeID){
      currAxis = content[i]._axis_id - 1
      myAxes.push(axes[currAxis].color);
    }
  }
  let uniqueAxes = myAxes.filter(onlyUnique);
  return uniqueAxes;
}

// This is used to return all axes colors, as well as their names, 
// so that the sonifications/visualizations can have them
export function getAxisColorsAndNames(episodeID){
  let myAxes = [], currAxis;
  for(let i = 0; i < content.length; i++){
    if(content[i]._episode_id == episodeID){
      currAxis = content[i]._axis_id - 1
      myAxes.push(currAxis);
    }
  }
  let uniqueAxes = myAxes.filter(onlyUnique);
  let result = []
  uniqueAxes.map((axis) => result.push({"color": axes[axis].color, "name": `Axis ${axis+1}`}))
  return result;
}

// This will return objects with the friendly names of the files
// and their respective paths when queried from the visualization/sonification
export function getAllEpisodeBiometrics(episodeID){
  let result = []
  content.map((contentPiece) => {
    if(contentPiece._episode_id == episodeID && contentPiece.type == 'biometrics')
      result.push({"path": contentPiece.path, "name": contentPiece.name})
  })
  return result
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

export function getAxisNames(){
  return Array.from(axes, x => x.name);
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
  return subsetOfContent;
}

export function getPieceOfContent(id){
  return content[id];
}

export function getEpisodeDescription(id){
  return episodes[id].desc;
}

export function getStudioContent(episodeId){
  let subsetOfContent = content.filter(x => (x._episode_id == episodeId && (x.type == 'visualization' || x.type == 'sonification')));
  // console.log(subsetOfContent);
  return subsetOfContent;
}