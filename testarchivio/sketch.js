let myMap;
let canvas;
const mappa = new Mappa('Leaflet');
let d_cerchio = 20;
let termx;
let termy;
let r=10;
let mySound;

class luogo{
	constructor(x, y){
		this.x = x
		this.y = y
	}
	get wd() {
		return this.x
	}
	get ht() {
		return this.y
	}
}

const terminio = new luogo(40.83874, 14.9383);
const accellica = new luogo(40.777, 15,006);
let places = [terminio, accellica]

let sounds = []
let snn = ['ambientone_laghi.wav', '01 San Biagio.wav']

// setup
const options = {
  lat: 40.777,
  lng: 15.006,
  zoom: 10,
  style: "http://{s}.tile.osm.org/{z}/{x}/{y}.png"
}

function preload() {
  soundFormats('mp3', 'wav');
	for(const i of snn){
		sounds.push(loadSound(i))
	}
}

function setup(){
 
  canvas = createCanvas(800,400) 

  myMap = mappa.tileMap(options)
  myMap.overlay(canvas)
}

function getpx(x, y){
	return myMap.latLngToPixel(x, y);
}

function draw(){
  clear();
	
//-----disegno cerchi per le coordinate
  fill(255, 0, 0)
	for (const i of places){
		ellipse((getpx(i.wd, i.ht)).x, (getpx(i.wd, i.ht)).y, d_cerchio, d_cerchio)
	}
  if (mouseIsPressed) {
    ellipse(mouseX, mouseY, 20, 20);
	  for (const i of places){
		let d = dist(mouseX, mouseY, (getpx(i.wd, i.ht)).x, (getpx(i.wd, i.ht)).y)
		if (d < r) {
			let n = places.indexOf(i)
			sounds[n].play()
  		}	
	}
}
}



