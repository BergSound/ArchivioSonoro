let myMap;
let canvas;
const mappa = new Mappa('Leaflet');
let d_cerchio = 20;
let termx;
let termy;
let r=10;
let mySound;

// setup
const options = {
  lat: 40.777,
  lng: 15.006,
  zoom: 10,
  style: "http://{s}.tile.osm.org/{z}/{x}/{y}.png"
}

function setup(){
 
  canvas = createCanvas(800,400); 

  myMap = mappa.tileMap(options); 
  myMap.overlay(canvas);
  
}

function draw(){
  clear();
  
  const terminio = myMap.latLngToPixel(40.83874, 14.9383); 
  
//-----disegno cerchi per le coordinate
  fill(255, 0, 0)
  ellipse(terminio.x, terminio.y, 20, 20);
  termx=terminio.x;
  termy=terminio.y;
  if (mouseIsPressed) {
    ellipse(mouseX, mouseY, 20, 20);
}
}

function mousePressed() {
  let d = dist(mouseX, mouseY, termx, termy);
  if (d < r) {
    mySound.play();
  }
}

function preload() {
  soundFormats('mp3', 'wav');
  mySound=loadSound('ex.wav');
}



/*function draw(){
  clear();
  
  const terminio = myMap.latLngToPixel(40.83874, 14.9383); 
  
//-----disegno cerchi per le coordinate-----//
  fill(255, 0, 0)
  ellipse(terminio.x, terminio.y, d_cerchio, d_cerchio);
}*/