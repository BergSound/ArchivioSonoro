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

const monte_mai = new luogo(40.790808, 14.874866, 'vento_monte_mai_2_07_2018_16_25.wav', 'Vetta Monte Mai', '02.07.2018 16:25', 'MS', 'Vento da sud', 'vetta');

const grotta_scalandrone = new luogo(40.767823, 14.993144, 'grotta_scalandone_08_06_17.wav', 'Grotta dello Scalandrone', '08.06.2017 15:30', 'XY 120°', 'Cascata dentro la grotta, registrata dalla spiaggetta', 'acqua');

const pendici_accellica = new luogo(40.782567, 14.983494, 'AccellicaNord_15_08_16_12.38.wav', 'Pendici Monte Accellica - versante Nord', '15.08.2016 12:38', 'XY 90°', 'Suoni di bosco sul sentiero per la vetta nord', 'bosco');

const pendici_san_michele = new luogo(40.80082, 14.81299, 'pizzoSanMichele_3_09_16_14_02.wav', 'Pendici Pizzo San Michele', '03.09.2016 14:05', 'XY 120°', 'Suoni di bosco sul sentiero per il Pizzo San Michele', 'bosco');

const pizzo_san_michele = new luogo(40.799159, 14.844128, 'vento_pizzoSanMichele.wav', 'Pizzo San Michele', '03.09.2016 16:05', 'XY 120°', 'Vento e grilli di fronte al santuario', 'vetta');

const lago_laceno = new luogo(40.806956, 15.096356, 'lago_laceno_alba_27_06_19_6_15.wav', 'Lago Laceno', '27.06.2019 6:00', 'BINAURALE', 'Alba sul lago, con rapaci e mucche', 'bosco');

const castel_franci = new luogo(40.915295, 15.039577, 'castel_franci_9_05_21_10_22.wav', 'Fiume Calore - Castel Franci', '05.09.2021 10:00', 'MS', 'Piccola diga sul fiume Calore, tratto avvelenato da scarico abusivo', 'acqua');

const raio_tufara = new luogo(40.8341614, 15.0089888, 'raio_della_tufara_12_10_2018.wav', 'Raio della Tufara - Affluente dello Scorzella', '12.10.2018 10:00', 'XY 90°', 'Ruscello che cade in piscine naturali da tuffi a cufaniello', 'acqua');

const valli_50 = new luogo(40.8341614, 15.0089888, 'uccelli_terminio_10_06_19_16_35.wav', 'Terminio - Valli Cinquanta', '10.06.2019 16:35', 'BINAURALE', 'piccola valle con concerto di uccelli', 'bosco'); //cambiare coordinate

const lago_conza_rane = new luogo(40.881527, 15.29451, 'conza_rane 8_09_21_11_35.wav', 'Lago di Conza', '08.09.2021 11:35', 'XY 90°', 'Rane sul lago, con suoni di traffico della statale', 'altro');

const lago_conza_alba = new luogo(40.882951, 15.319318, 'alba_conza.wav', 'Lago di Conza', '08.09.2021 5:35', 'XY 90°', 'Alba sul lago', 'altro');

const sorgente_sabato = new luogo(40.787036, 14.98379, 'Fiume_Lontano_FiumeSabato_agosto_2017.wav', 'Sorgente Fiume Sabato', 'agosto 2017', 'XY 90°', 'Fiume nel bosco', 'acqua');

const vallone_matruonolo = new luogo(40.832759, 14.916878, 'vallone_matruonolo_cascata_2_04_21wav.wav', 'Vallone Matruonolo', '02.04.2021 12:10', 'XY 120°', 'Due piccole cascate di un affluente del Sabato', 'acqua');


let luoghi = [monte_mai, grotta_scalandrone, 
	      pendici_accellica, pendici_san_michele, pizzo_san_michele, 
	      lago_laceno, castel_franci, raio_tufara, 
	      valli_50, lago_conza_rane, lago_conza_alba, 
	      sorgente_sabato, vallone_matruonolo] 

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
   
} //fine setup

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
 
