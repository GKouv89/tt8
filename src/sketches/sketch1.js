export function sketch(p5) {
    let path = "";
    let table;
    let width = 800;
    let height = 600;

    function render(){
      let bars = table.getRowCount();
      console.log(bars);
      let barWidth = width / bars;
      let barHeight = height;
      
      let x, y, d, col;
      // Loop over the dataset
      for (let i = 0; i < bars; i++){
        
        // Figure out the position of the bar
        x = i * barWidth;
        y = 0;
        
        // Figure out the colour of the bar
        d = table.get(i,1);
        
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
    }

    function myLoad(path){
      console.log('About to load: ' + path);
      table = p5.loadTable(path, 'csv', 'header', render);
    }

    p5.updateWithProps = props => {
        let oldpath = path;
        path = props.path;
        // if(oldpath != ""){
          myLoad(path);
        // }
        render();
    };

    // p5.preload = () => {};
    // p5.preload = (props) => {
    //   console.log('About to load: ' + props.path);
    //   table = p5.loadTable(props.path, 'csv', 'header');
    // };
    
    p5.setup = () => {  
      p5.createCanvas(width, height);
      p5.noLoop();
    };
  
    // p5.draw = () => {
    //   console.log('Done with loading');
    //   // Figure out the hight and width of each bar
    //   render();
    // };
  }