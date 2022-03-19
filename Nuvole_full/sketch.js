let colonne, righe;
let scala = 15;

let rumore_perlin = [];
let altezza = 50;

let perlin_x = 0, perlin_y = 0;
let incr_perlin = 0.08;

let movimento = 0;
let vel_movimento = 0.02;

let rumore;
let numero_filtri = 6;
let banco_filtri = [];

let amp_filtro = [];

let salto_filtro;
let freq_filtro = 200;

let cnv;

let riverbero;


function setup() {
  //createCanvas(displayWidth, displayHeight, WEBGL);
  cnv = createCanvas(windowWidth, windowHeight, WEBGL);
  cnv.mouseClicked(attiva_audio);
  
  colonne = width * 2 / scala;
  righe = height * 2 / scala;
  
  altezza = height * 0.8;
 
  frameRate(15);
  
  rumore = new p5.Noise('pink');
  rumore.amp(1);
  rumore.start();
  
  rumore.disconnect();
  
  riverbero = new p5.Reverb();
  
  for (let i = 0; i < numero_filtri; i++) {
     
     banco_filtri[i] = new p5.BandPass();
     rumore.connect(banco_filtri[i]);
    
     banco_filtri[i].disconnect();
     riverbero.process(banco_filtri[i], 5, 40); //tempo rev, decayRate %
    
    banco_filtri[i].freq(freq_filtro + freq_filtro * i);
   // banco_filtri[i].pan(map(i, 0, (numero_filtri - 1), -1, 1));
    banco_filtri[i].res(50);
    banco_filtri[i].amp(0);
  }
  
  riverbero.drywet(0.9);
  
 salto_filtro = floor(colonne/numero_filtri);
  
  getAudioContext().suspend();

}

function draw() {
  
  
  
  movimento -= vel_movimento;
  perlin_x = movimento ;
  
  for (let i = 0; i < colonne; i++) { 
   
    let perlino;
    rumore_perlin[i] = [];
    perlin_y = movimento * 1.5;

    for (let j = 0; j < righe; j++) {
     
     perlino = noise(perlin_x, perlin_y);
     rumore_perlin[i][j] = map(perlino, 0, 1, - altezza * 2, altezza);
     perlin_y += incr_perlin;
   }
    perlin_x += incr_perlin;
  
  }
  
  
  background(255);      
 

   let stato_audio = getAudioContext().state;
   
  if (stato_audio !== 'running') {
  stroke(255, 0, 0);
  fill(255, 0, 0);
  rect(8 - width * 0.5, 8 - height * 0.5, 34, 21);
  //text("OFF", 12, 23);
  }
  else {
  stroke(255);
  noFill();
  rect(8 - width * 0.5, 8 - height * 0.5, 34, 21);
  //text("ON", 12, 23);
  } 
 // translate(- width * 0.7, - height * 0.5);
  translate(- width  , - height );
  
  
   stroke(0);
  noFill();

 for (let j = 0; j < righe - 1; j++) { 
  
   beginShape(TRIANGLE_STRIP);
  
   for (let i = 0; i < colonne; i++) {
       
      vertex(i * scala, j * scala, rumore_perlin[i][j]);
     vertex(i * scala, (j + 1) * scala, rumore_perlin[i][j + 1]);
        
    } //fine for colonne
    
   endShape();
   
  } //fine for righe
 // freq_filtro = map(rumore_perlin[0][0], - altezza * 2, altezza, 200, 250);
    
for (let i = 0; i < numero_filtri; i++) {
  
    let amp_perlin = rumore_perlin[i * salto_filtro][floor(righe * 0.5)];
  
    banco_filtri[i].freq(freq_filtro + freq_filtro * i);
    amp_perlin = map(amp_perlin, - altezza * 2, altezza, 0, 1);
    amp_perlin = map(amp_perlin, 0.2, 1, 0, 1);
    let reso = map(amp_perlin, 0, 1, 20, 1);
    banco_filtri[i].res(reso);
    banco_filtri[i].amp( amp_perlin );

}
  
} //fine draw

function attiva_audio() {
   if (dist(mouseX, mouseY, 8, 8) <= 50) {
     if (getAudioContext().state !== 'running') {
          userStartAudio();
     }
     else {
       getAudioContext().suspend();
    }      
  }
}