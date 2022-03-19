let punti = [];
let dens =  25; //dens 25
let spazio;

let mult_pi = [];

let scala_perlin = 0.02; //zoom sul rumore
//0.02 buono per il sito
//0.008 bello
//o.001 bello ma non sembrano radici

let conta_punti = 1;
let conta_frame = 0;
let conta_max = 1;

let colore = 1;

let osc = [];
let frequenza = [];
let pan = [];

let amp;
let numero_osc = 10;

let salta_punti;

let DW = 0.5;
let reverb;

let freq_mult = 1;

let cnv;



function setup() {
  
  cnv = createCanvas(windowWidth, windowHeight);
  cnv.mouseClicked(attiva_audio);
  
  background(0);
  
  frameRate(12);
  
  noiseDetail(5, 0.5);
  
  let lung_x = width;
  let lung_y = height;
  let lung;
  
  if (lung_x >= lung_y) {
     lung = lung_x;
  }
  
  else{
  lung = lung_y;
  }
  
  spazio = lung / dens;
  
  for (let x = 0; x < lung_x; x += spazio) {
    for (let y = 0; y < lung_y; y += spazio) {
      
      let punto = createVector (x + random(-10, 10), 
                                y + random(-10, 10));
      
      punti.push(punto);
    }
     
  }
  
  reverb = new p5.Reverb();
  
   amp = (1 / (numero_osc + 2)) ;
  
  salta_punti = floor(punti.length / numero_osc);
  
  for (let i = 0; i < punti.length; i++) {
    
   mult_pi[i] = 2;
    
  }
  
    for (let i = 0; i < numero_osc; i++) {
    
   mult_pi[i] = 2;
   osc[i] = new p5.Oscillator('sine');
   osc[i].start();
   osc[i].amp(amp);
      
   osc[i].disconnect();
   reverb.process(osc[i], 5, 10);
   reverb.drywet(DW);
    
  }
    
     getAudioContext().suspend();
} // fine setup

function draw() {
  
     let stato_audio = getAudioContext().state;
   
  if (stato_audio !== 'running') {
  stroke(255, 0, 0);
  fill(0);
  rect(8, 8, 34, 21);
  noFill();
  text("OFF", 12, 23);
  }
  else {
  stroke(255);
  fill(0);
  rect(8, 8, 34, 21);
  noFill();
  text("ON ", 12, 23);
  }
    
    stroke(255 * colore, 255, 255 * colore, 55 + 200 * colore);
    strokeWeight(1);
  
  if ((frameCount - conta_frame) >= 3 && conta_punti < punti.length) {
     
     conta_frame = frameCount;
     conta_punti += 1;
     conta_max = conta_punti;
      
  }
    if (conta_punti == punti.length){
       conta_max = punti.length;
      //conta_punti = 0;
      conta_punti = punti.length + 1;
      colore = !colore;
      freq_mult = 1.5;
      reverb.drywet(1);
    }
  
  for (let i = 0; i < punti.length; i++) {
    
    let X = punti[i].x;
    let Y = punti[i].y;
    
    if (X < -5) {
       punti[i].set(width, random(height));
    }
    
     if (Y < -5) {
       punti[i].set(random(width), height);
       //mult_pi[i] = -2;
    }
    
     if (X > width + 5) {
       punti[i].set(0, random(height));
    }
     if (Y > height + 5) {
       punti[i].set(random(width), 0);
      // mult_pi[i] = -2;
    }
    
    let rumore = noise(X * scala_perlin, Y * scala_perlin);
    let angolo_mov = map(rumore, 0, 1, 0, PI * mult_pi[i]);
    
    let vett_ruota = createVector(cos(angolo_mov), sin(angolo_mov)); //creo un versore con inclinazione random
    
    punti[i].add(vett_ruota);
     
     point(punti[i].x, punti[i].y, 0);
    
  }
  
  for (let i = 0; i < numero_osc; i++) {
      
    let ampiezza = map(punti[i * salta_punti].x, 0, width, 0.3, 1);
    frequenza[i] = map(punti[i * salta_punti].y, 0, height, 400 * freq_mult, 80);
    //pan[i] = map(punti[i].x, 0, width, -1, 1);
    
    osc[i].freq(frequenza[i], 0.1);
    //osc[i].pan(pan[i]);
    osc[i].amp(amp);
    
    
  }
}


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