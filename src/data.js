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
    desc: 'Ένα χαρακτηρηστικό απόφθευγμα από το επεισόδιο 1',
    type: 'text',
    subtype: 'quote',
    format: 'txt',
    path: ""
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
    desc: 'Ένα χαρακτηριστικό απόφθευγμα από το επεισόδιο 3',
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
    path: process.env.PUBLIC_URL + '/pubassets/_DSC9344.jpg'
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
    name: "Διορατικότητα"
  },
  {_id: 2,
    name: "Αγάπη"
  },
  {_id: 3,
    name: "Ονειροπόλος"
  },
  {_id: 4,
    name: "Καταπίεση"
  },
  {_id: 5,
    name: "Υπεραξία"
  },
  {_id: 6,
    name: "Καταπληκτικό"
  },
  {_id: 7,
    name: "Σταθερότητα"
  },
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
  // console.log(subsetOfContent);
  return subsetOfContent;
}

export function getPieceOfContent(id){
  return content[id];
}

export function getEpisodeDescription(id){
  return episodes[id].desc;
}