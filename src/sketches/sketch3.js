export default function sketch(p5) {
    let path = `http://localhost/data/visualizations/plain/1.csv`;
    let table;
    let width = 800;
    let height = 600;
    let startingYear = -1;
    let endingYear = -1;

    p5.updateWithProps = props => {
      let oldStartingYear = startingYear;
      startingYear = props.startingYear;
      endingYear = props.endingYear;
      console.log('New bounds: [' + startingYear + ', ' + endingYear +']');
      if(oldStartingYear !== -1){
        p5.redraw();        
      }
    };

    p5.preload = () => {table = p5.loadTable(path, 'csv', 'header');};
    p5.setup = () => {  
      p5.createCanvas(width, height);
      p5.noLoop();
    };
  
    p5.draw = () => {
      // Figure out the hight and width of each bar
      let bars = table.getRowCount();
      let startingRow = -1;
      let endingRow = -1;
      let year;
      for (let i = 0; i < bars; i++){
        year = table.get(i,0);
        if(startingRow == -1 && year >= startingYear){
          startingRow = i;
        }
        if(endingRow == -1 && year >= endingYear){
          endingRow = i;
          break;
        }
      }
      if(startingRow == -1){ // WIP: ONLY A TEMPORARY FIX
        startingRow = bars;
      }
      if(endingRow == -1){
        endingRow = bars;
      }
      console.log('Bar count: ' + (endingRow - startingRow));
      console.log('Ending row: ' + endingRow);
      console.log('Starting row: ' + startingRow);
      let barWidth = width / (endingRow - startingRow);
      let barHeight = height;
      
      let x, y, d, col;
      // Loop over the dataset
      for (let i = startingRow, counter = 0; i < endingRow; i++, counter++){
        
        // Figure out the position of the bar
        x = counter * barWidth;
        y = 0;
        
        // Figure out the colour of the bar
        d = table.get(i,1);
        if(i == startingRow){
          console.log(d);
        }
        if(d > 0){
          col = p5.lerpColor(p5.color(255), p5.color(255, 0, 0), d);  
        } else {
          col = p5.lerpColor(p5.color(255), p5.color(0, 0, 255), -d);
        }
          
        p5.fill(col);
        p5.noStroke();
        
        // Draw the bar
        p5.rect(x, y, barWidth, barHeight);  
      }
    };
  }