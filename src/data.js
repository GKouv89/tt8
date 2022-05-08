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