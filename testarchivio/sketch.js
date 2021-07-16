let myMap;
let canvas;
const mappa = new Mappa('Leaflet');
let d_cerchio = 20;

let cord_x = [];
let cord_y = [];

let r = d_cerchio * 0.5;

let trigger = false, trigger_pre = false;

let h_rett = 100;
let h_font = h_rett * 0.15;


class luogo {
	
  constructor(x, y, n_file, n_luogo, datazione, mic, note) {
		this.x = x
		this.y = y
        this.n_file = n_file
        this.n_luogo = n_luogo
        this.datazione = datazione
        this.mic = mic
        this.note = note
	}
	get lat() {
		return this.x
	}
	get long() {
		return this.y
	}
    get nome_audio() {
        return this.n_file
    } 
    get nome_luogo() {
       return this.n_luogo
    }
   get data() {
       return this.datazione
    }
   get microfono() {
       return this.mic
    }
  get annotazioni() {
       return this.note
    }
   
}

//---constructor LUOGO (lat, long, nome_file, luogo, giorno/mese/anno, tecnica_microfonica, annotazioni, inquinamento, colore)

const terminio = new luogo(40.83874, 14.9383, 'ex.wav', 'Terminio', '15.06.2018', 'MS', 'bene ma non benissimo');
const accellica = new luogo(40.777, 15.006, '01 San Biagio.wav', 'Accellica', '12.11.2020', 'XY 90°', 'ammappete');
const terminio2 = new luogo(40.94874, 14.9383, 'in.wav', 'Lucareneto', '07.02.2016', 'XY 120°', 'è il sottobosco');
const accellica2 = new luogo(40.877, 15.006, 'ambientone_laghi.wav', 'Sottobosco', '31.12.2019', 'BINAURALE', 'un lucareneto');

let luoghi = [terminio, accellica, terminio2, accellica2]

let suoni = [];
let nomi_suoni = [];

for(const i of luoghi) {
		
    nomi_suoni.push(i.nome_audio)
	
  }


const options = {
  lat: 40.777,
  lng: 15.006,
  zoom: 10,
  style: "http://{s}.tile.osm.org/{z}/{x}/{y}.png"
}

function preload() {
  
  soundFormats('wav');
	
  for(const i of nomi_suoni) {
		
    suoni.push(loadSound(i))
	
  }
}

function setup() {
 
  //canvas = createCanvas(displayWidth, displayHeight) 
  canvas = createCanvas(800, 400)

  myMap = mappa.tileMap(options)
  myMap.overlay(canvas)
	
}

function getpx(x, y) {
	return myMap.latLngToPixel(x, y);
}

function draw() {
  clear();
	
//-----disegno cerchi per le coordinate

  
for (const i of luoghi) {
  
  fill(255, 0, 0)
  
let n = luoghi.indexOf(i)
 
 cord_x[n] = getpx(i.lat, i.long).x;
 cord_y[n] = getpx(i.lat, i.long).y;
    
 ellipse(cord_x[n], cord_y[n], d_cerchio, d_cerchio);
 
 let d = dist(mouseX, mouseY, cord_x[n], cord_y[n]);
  
if (d < r) {
 // visualizzo rettangolo con informazioni sul file, con retta da mouse a spigolo rettangolo

  line (mouseX, mouseY, h_rett, (height - h_rett * 1.1));
  line (mouseX, mouseY, h_rett + (width - 2 * h_rett), (height - h_rett * 1.1));
  
  fill(255, 255, 255);
  rect(h_rett, (height - h_rett * 1.1), (width - 2 * h_rett), h_rett);
  
  fill(0, 0, 0);
  textSize(h_font)
  
  text ('LUOGO: ', h_rett + 10, (height - h_rett * 1.1) + 1.5 * h_font);
  text (i.nome_luogo, 3 * h_rett, (height - h_rett * 1.1) + 1.5 * h_font);
  
  text ('DATA: ', h_rett + 10, (height - h_rett * 1.1) + 3 *  h_font);
  text (i.data, 3 * h_rett, (height - h_rett * 1.1) + 3 * h_font);
  
  text ('MICROFONAZIONE: ', h_rett + 10, (height - h_rett * 1.1) + 4.5 *  h_font);
  text (i.microfono, 3 * h_rett, (height - h_rett * 1.1) + 4.5 * h_font);
  
  text ('ANNOTAZIONI: ', h_rett + 10, (height - h_rett * 1.1) + 6 *  h_font);
  text (i.annotazioni, 3 * h_rett, (height - h_rett * 1.1) + 6 * h_font);
  
  if (mouseIsPressed) {
     trigger = true;
  }
  else { 
     trigger = false;
  }
  
  if (trigger == true && trigger_pre == false) {
    
    if (suoni[n].isPlaying() == false) {
        suoni[n].play();
      }
     
     else {
        suoni[n].stop();
    }  

   }
 
  } //fine mouse su cerchio 
 
 } //fine for
  
  trigger_pre = trigger;

} //fine draw
 
