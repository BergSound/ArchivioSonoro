let valore_noise;
//Incremento x di 0.01
let incremento = 0.022;
let x_increment = incremento; //zoom x
//Increment z di 0.03 ogni ciclo
let y_increment = incremento; //zoom x
//Increment z di 0.03 ogni ciclo
let z_increment = incremento; //zoom z
//0.02 buono

//valori offset
let z_off, y_off, x_off;

let campione = [];
let sample = [];

let ampiezza;
let punto = [];
let suoni_play = 0;

let cnv;
let numero_sample = 20;
let lettura_punti;

let conta_sample;

function preload() {
  soundFormats('ogg', 'mp3');
  sample[0] = loadSound('sala1.mp3');
  sample[1] = loadSound('sala2.mp3');
  sample[2] = loadSound('sala3.mp3');
  sample[3] = loadSound('sala4.mp3');
  sample[4] = loadSound('sala5.mp3');
  sample[5] = loadSound('sala6.mp3');
  sample[6] = loadSound('sala7.mp3'); 
}


function setup() {

  cnv = createCanvas(windowWidth, windowHeight);
  cnv.mouseClicked(attiva_audio);
 
  frameRate(12);
 //gestione ottave e armoniche perlin
  noiseDetail(4, 0.7);
  z_off = 0;
  
  
  lettura_punti = floor(height / numero_sample);
  
  for (let i = 0; i < numero_sample; i++) {
        
      campione[i] = sample[floor(random(0, 7))];
      campione[i].rate(random(0.2, 3));
      campione[i].pan(random(-1, 1));
      
    }
  getAudioContext().suspend();
}

function draw() {
  

  x_off = 0;
  y_off = 0;

  background(0);

  for (let y = 0; y < height; y+= 10) {
   
    x_off += x_increment;
    y_off = 0;
    punto[y] = [];
    
    for (let x = 0; x < width; x+= 10) {
    
      valore_noise = noise(x_off, y_off, z_off);
      
      strokeWeight(4); //larghezza punto
   
    if (valore_noise >= 0.65) {
      stroke(255, 200, 0);
      punto[y][x] = 1;
       
      }
      
      else {

        stroke(0);
        punto[y][x] = 0;
       
      }
     
      y_off += y_increment;
      point(x, y); //disegno punto
      
    }
    
  }// fine for grafico

  z_off += z_increment;
 
 //-------sintesi sonora -------// 
   
  let somma = 0;
   
   for (let y = 0; y < height; y+= 10) {
   
  for (let x = 0; x < width; x+= 10) {

    somma = somma + punto[y][x];
     
   }
  } 
 
  let somma_max = (width * height) * 0.01;
  ampiezza = map(somma, 0, somma_max, 0, 1);
  
   let area = map(somma, 0, somma_max, 0, width);
  
//conta_sample = map(somma, 0, somma_max, 0, numero_sample);
  
 for (let i = 0; i < numero_sample; i++) {
    
   //noStroke();
  // fill(255, 255, 255, 150);
   //rect(0, i * lettura_punti, area, lettura_punti);
   
   campione[i].setVolume(ampiezza * 0.25);
   
   if (ampiezza < 0.2) {
      campione[i].pan(random(-1, 1));
   }
      
   if (random(10) > 5) {
      campione[i].rate(random(0.3, 5));
   }
   
   if (campione[i].isPlaying() == false) {
    
        campione[i].loop();
    }  
  }
  
 //print(ampiezza); 
  
  let stato_audio = getAudioContext().state;
   
  strokeWeight(2);
  if (stato_audio !== 'running') {
  stroke(255, 0, 0);
  noFill();
  rect(8, 8, 34, 21);
  text("OFF", 12, 23);
  }
  else {
  stroke(255);
  noFill();
  rect(8, 8, 34, 21);
  text("ON", 12, 23);
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