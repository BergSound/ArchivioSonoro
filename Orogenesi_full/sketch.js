let colonne, righe;
let scala = 15;

let rumore_perlin = [];
let altezza = 200;

let perlin_x = 0, perlin_y = 0;
let incr_perlin = 0.12;

let movimento = 0;
let vel_movimento = 0.07;


function setup() {
  //createCanvas(displayWidth, displayHeight, WEBGL);
  createCanvas(windowWidth, windowHeight, WEBGL);
  
  colonne = width * 2 / scala;
  righe = height * 1.3 / scala;
  
  altezza = height * 0.8;
 
  frameRate(15);
}

function draw() {
  
  movimento -= vel_movimento;
  perlin_x = 0;
  
  for (let i = 0; i < colonne; i++) { 
   
    rumore_perlin[i] = [];
    perlin_y = movimento;

    for (let j = 0; j < righe; j++) {
     
     rumore_perlin[i][j] = map(noise(perlin_x, perlin_y), 0, 1, - altezza * 2, altezza);
     perlin_y += incr_perlin;
   }
    perlin_x += incr_perlin;
  
  }
  
  
  background(0);      
  stroke(255);
  noFill();
  
  rotateX(PI * 0.35);
  
  translate(- width * 0.7, - height * 0.5);

 for (let j = 0; j < righe - 1; j++) { 
  
   beginShape(TRIANGLE_STRIP);
  
   for (let i = 0; i < colonne; i++) {
       
      vertex(i * scala, j * scala, rumore_perlin[i][j]);
     vertex(i * scala, (j + 1) * scala, rumore_perlin[i][j + 1]);
        
    } //fine for colonne
    
   endShape();
   
  } //fine for righe
  
  
} //fine draw