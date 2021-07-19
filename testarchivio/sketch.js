//DA AGGIUSTARE: 
//fare un load dei file più efficiente
//se il file è il play e levo il check box poi rimane graficamente in play quando riattivo il box
//se il cerchio è sul box si attivano/disattivano entrambi
//doppio click del mouse zoomma la mappa

//usare save() per permettere il download del file

let myMap;
let canvas;
const mappa = new Mappa('Leaflet');
let d_cerchio = [] //20;

let cord_x = [];
let cord_y = [];

let r = 10;

let trigger = false, trigger_pre = false;

let h_rett;
let h_font;

let colori = []
let rosso = [], verde = [], blu = [], alfa = [];

let box = [true, true, true, true, false];
let box_x = [190, 290, 390, 490, 725];
let box_y = [22,   22,  22,  22,  22];
let check_box = [];
let trigger_box = false, trigger_box_pre = false;

let play_suono = [], play_suono_pre = [];

let tracce_mix_attive = 0;
let max_tracce_mix = 4;

let tempo_traccia = 1, durata_traccia = 0;
let nuova_traccia, ultima_traccia;


class luogo {
	
  constructor(x, y, n_file, n_luogo, datazione, mic, note, color) {
		
        this.x = x
		this.y = y
        this.n_file = n_file
        this.n_luogo = n_luogo
        this.datazione = datazione
        this.mic = mic
        this.note = note
        this.color = color
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
  get etichetta() {
      return this.color
  }
   
}

//---constructor LUOGO (lat, long, nome_file, luogo, giorno/mese/anno, tecnica_microfonica, annotazioni, colore, inquinamento)

const terminio = new luogo(40.83874, 14.9383, 'ex.wav', 'Terminio', '15.06.2018', 'MS', 'bene ma non benissimo');
const accellica = new luogo(40.777, 15.006, '01 San Biagio.wav', 'Accellica', '12.11.2020', 'XY 90°', 'ammappete');
const terminio2 = new luogo(40.94874, 14.9383, 'in.wav', 'Lucareneto', '07.02.2016', 'XY 120°', 'è il sottobosco');
const accellica2 = new luogo(40.877, 15.006, 'ambientone_laghi.wav', 'Sottobosco', '31.12.2019', 'BINAURALE', 'un lucareneto');

let luoghi = [terminio, accellica, terminio2, accellica2]

let numero_luoghi = luoghi.lenght;

let suoni = [];
let nomi_suoni = [];

for (const i of luoghi) {
		
  nomi_suoni.push(i.nome_audio)
    
  colori.push(i.etichetta)
  
  let n = luoghi.indexOf(i);
  
  play_suono[n] = false;
  play_suono_pre[n] = false;
  
  alfa[n] = 120;
  d_cerchio[n] = 20;
   
  if (colori[n] == 'acqua') {
    
    rosso[n] = 0;
    verde [n] = 150;
    blu[n] = 255; 
   }
 
  else if (colori[n] == 'bosco') {
    
    rosso[n] = 25;
    verde [n] = 255;
    blu[n] = 0;
    
  }
  
   else if (colori[n] == 'vetta') {
    
    rosso[n] = 255;
    verde [n] = 155;
    blu[n] = 0;
    
  }
  
 else if (colori[n] == 'altro') {
    
    rosso[n] = 255;
    verde [n] = 55;
    blu[n] = 255;
    
   }
   
  } //fine for gestione luoghi

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
 
  canvas = createCanvas(800,400);
  
  h_rett = height * 0.22;
  h_font = h_rett * 0.15;

  myMap = mappa.tileMap(options)
  myMap.overlay(canvas)
   
}

function getpx(x, y) {
	return myMap.latLngToPixel(x, y);
}

function draw() {
  
clear();

//----------gestione check_box-----------//
  
for (let i = 0; i < 5; i++) {
  
  let d_box = dist(mouseX, mouseY, box_x[i], box_y[i]);
  
  if (d_box <= 20) {
    
   if (mouseIsPressed) {
     trigger_box = true;
    }
    else { 
     trigger_box = false;
  }
    
  if (trigger_box == true && trigger_box_pre == false) {
    
     box[i] = !box[i];
   }   
  }
}

  
for (const i of luoghi) {
    
 let n = luoghi.indexOf(i) 
 
  if (colori[n] == 'acqua') {   
     check_box[n] = box[0];
   }
  else if (colori[n] == 'bosco') {    
     check_box[n] = box[1];    
  }  
  else if (colori[n] == 'vetta') {
     check_box[n] = box[2];
  }  
  else if (colori[n] == 'altro') {    
     check_box[n] = box[3];    
   }
  
//-----------gestione player audio---------//
  
play_suono[n] = suoni[n].isPlaying();  
 
if (check_box[n] == true) {
  
//-----------gestione picentini mix---------//
 
  if (box[4] == true) {
    
     if ((tracce_mix_attive < max_tracce_mix) && (tempo_traccia > durata_traccia * 0.1)) {
             
   //----------------randomizzatore scelta tracce---------------// 
       
       indice_traccia = int(random(numero_luoghi));
       
       if (check_box[indice_traccia] == true && play_suono[indice_traccia] == false) {
         
         play_suono[indice_traccia] = true;
         tracce_mix_attive++;
      
       //ultima_traccia = nuova_traccia;
         //indice_traccia4 = indice_traccia3
         //indice_traccia3 = indice_traccia2
         //indice_traccia2 = indice_traccia1
         nuova_traccia = suoni[indice_traccia];
         tempo_traccia = nuova_traccia.currentTime;
         durata_traccia = nuova_traccia.duration;
         
       }
               
     }
  } //fine if PicentiniMix attivo
  
  else {
     tracce_mix_attive = 0;
     tempo_traccia = 1;
     durata_traccia = 0;
  }
   
 if (suoni[n].isPlaying() == true) {
  
  alfa[n] = 255;
  d_cerchio[n] = 20 + 12;// * sin (PI *  ); 
  
  }
   else {
     alfa[n] = 120;
     d_cerchio[n] = 20;
  }
  
 fill(rosso[n], verde[n], blu[n], alfa[n])
 
 cord_x[n] = getpx(i.lat, i.long).x;
 cord_y[n] = getpx(i.lat, i.long).y;
    
 ellipse(cord_x[n], cord_y[n], d_cerchio[n], d_cerchio[n]);
  
 let d = dist(mouseX, mouseY, cord_x[n], cord_y[n]);
  
 if (d < (d_cerchio[n] * 0.5)) {
 
  // visualizzo rettangolo con informazioni sul file

  line (mouseX, mouseY, h_rett, (height - h_rett * 1.1));
  line (mouseX, mouseY, h_rett + (width - 2 * h_rett), (height - h_rett * 1.1));
  
  fill(255, 255, 255);
  rect(h_rett, (height - h_rett * 1.1), (width - 2 * h_rett), h_rett);
  
  fill(0, 0, 0);
  textSize(h_font)
  
  text ('DESCRIZIONE: ', h_rett + 10, (height - h_rett * 1.1) + 1.5 * h_font);
  text (i.annotazioni, 3 * h_rett, (height - h_rett * 1.1) + 1.5 * h_font);
  
  text ('LUOGO: ', h_rett + 10, (height - h_rett * 1.1) + 3 *  h_font);
  text (i.n_luogo, 3 * h_rett, (height - h_rett * 1.1) + 3 * h_font);
  
  text ('DATA: ', h_rett + 10, (height - h_rett * 1.1) + 4.5 *  h_font);
  text (i.data, 3 * h_rett, (height - h_rett * 1.1) + 4.5 * h_font);
  
  text ('MICROFONAZIONE: ', h_rett + 10, (height - h_rett * 1.1) + 6 *  h_font);
  text (i.mic, 3 * h_rett, (height - h_rett * 1.1) + 6 * h_font);
  
  if (mouseIsPressed) {
     trigger = true;
  }
  else { 
     trigger = false;
  }
  
  if (trigger == true && trigger_pre == false) {
    
    play_suono[n] = !play_suono[n];

   }
 
  } //fine mouse su cerchio 
  
  if (play_suono[n] == true && play_suono_pre[n] == false) {
     suoni[n].play();
  }
  else if (play_suono[n] == false && play_suono_pre[n] == true) {
     suoni[n].stop();
  }
  
  play_suono_pre[n] = play_suono[n];
  
 } //fine if check_box

} //fine FOR
 
//---------gestione grafica check box------//
  
 fill(255, 255, 255)
 
 rect(80, 12, 440, 40) //rettangolo attiva etichette suoni
 rect(600, 12, 155, 40) //rettangolo attiva PicentiniMix
  
 fill(0, 0, 0);
 textSize(h_font);
 text ('Attiva ', 85, 36);
 text ('Acqua', 145, 36);
 text ('Bosco', 245, 36);
 text ('Vetta', 350, 36);
 text ('Altro', 450, 36);
 text ('Attiva PicentiniMix', 604, 36);
  
 fill(0, 150, 255, 50 + 155 * box[0]); //acqua
 rect(box_x[0], box_y[0], 20, 20);
 
 fill(25, 255, 0, 50 + 155 * box[1]); //bosco
 rect(box_x[1], box_y[1], 20, 20);
  
 fill(255, 155, 0, 50 + 155 * box[2]); //vetta
 rect(box_x[2], box_y[2], 20, 20);
 
 fill(255, 55, 255, 50 + 155 * box[3]); //altro
 rect(box_x[3], box_y[3], 20, 20);
 
 fill(255, 0, 0, 50 + 155 * box[4]); //picentini mix
 rect(box_x[4], box_y[4], 20, 20);

//-----------utility-----------//
  
  trigger_pre = trigger;
  trigger_box_pre = trigger_box;

} //fine draw
 
