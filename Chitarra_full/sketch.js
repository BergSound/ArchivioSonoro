let numero_cerchi_max = 30;
let numero_cerchi = 6;
let x = [numero_cerchi_max];
let y = [numero_cerchi_max];
let target_x = [numero_cerchi_max];
let target_y = [numero_cerchi_max];
let raggio; 

let trigger = [numero_cerchi_max] 
let trigger_pre = [numero_cerchi_max];
let lunghezza = [numero_cerchi_max];

let soglia_trigger = 0.05;

let freq = [numero_cerchi_max];
let durata = [numero_cerchi_max];
let volume = 1 / numero_cerchi;

let punto_corda_x = [numero_cerchi_max];
let punto_corda_y = [numero_cerchi_max];
let quiete_x = [numero_cerchi_max];
let quiete_y = [numero_cerchi_max];
let amp_x = [numero_cerchi_max];
let amp_y = [numero_cerchi_max];
let conta_pi = [numero_cerchi_max];
let vibra = 4; //[numero_cerchi_max];
let amp_vibrazione = 7;

let campione = [numero_cerchi_max];

let ipotenusa;
let cnv;


function setup() {
  
  cnv = createCanvas(windowWidth, windowHeight);
  cnv.mouseClicked(attiva_audio);
  
  raggio = (width + height) * 0.5 * 0.01;
  frameRate(30);
  
  for(let i = 0; i < numero_cerchi_max; i++) {
     
    x[i] = 0;
     y[i] = 0;
     
    target_x[i] = floor(random(width));
     target_y[i] = floor(random(height));
     
    trigger[i] = 0;
     trigger_pre[i] = 0;
    
    amp_x[i] = 0;
     amp_y[i] = 0;
    
    campione[i] = loadSound('samples/Chit_js.mp3');
     conta_pi[i] = PI;

  }
  
  ipotenusa = sqrt(width * width + height * height) * 0.8;
  
 getAudioContext().suspend();

} //fine setup()

function draw() {
  
  background(100);
  
  let stato_audio = getAudioContext().state;
   
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
 
  for (let i = 0; i < numero_cerchi; i++) {
  
    if (i < (numero_cerchi - 1)) {
     stroke(0);
     fill(0);
     ellipse(x[i], y[i], raggio, raggio);
     stroke(0 + 255 * trigger[i]);
      
     quiete_x[i] = (x[i] + x[i + 1]) * 0.5;
     quiete_y[i] = (y[i] + y[i + 1]) * 0.5;
  
     amp_x[i] = amp_x[i] * 0.98;
     amp_y[i] = amp_y[i] * 0.98;
     conta_pi[i]++;
      
  if (trigger[i] == 1 && trigger_pre[i] == 0) {

     amp_x[i] = amp_vibrazione;
     amp_y[i] = amp_vibrazione; 
     conta_pi[i] = PI;
  }
    
   punto_corda_x[i] = quiete_x[i] + amp_x[i] * sin(vibra * conta_pi[i]);
   punto_corda_y[i] = quiete_y[i] + amp_y[i] * sin(vibra * conta_pi[i]);   
      
       noFill();
       beginShape();
       curveVertex(x[i], y[i]);
       curveVertex(x[i], y[i]);
       curveVertex(punto_corda_x[i], punto_corda_y[i]);
       curveVertex(x[i + 1], y[i + 1]);
       curveVertex(x[i + 1], y[i + 1]);
       endShape(); 
     
      lunghezza[i] = calcola_lunghezza(x[i], x[i + 1], y[i], y[i + 1]);  
    }
    
    else {
     ellipse(x[i], y[i], raggio, raggio);
     stroke(255 - 255 * trigger[i]);
     //line(x[i], y[i], x[0], y[0]);
     quiete_x[i] = (x[i] + x[0]) * 0.5;
     quiete_y[i] = (y[i] + y[0]) * 0.5;
  
     amp_x[i] = amp_x[i] * 0.98;
     amp_y[i] = amp_y[i] * 0.98;
     conta_pi[i]++;
      
  if (trigger[i] == 1) {
     punto_corda_x[i] = quiete_x[i] + amp_vibrazione;
     punto_corda_y[i] = quiete_y[i] + amp_vibrazione;
     amp_x[i] = (punto_corda_x[i] - quiete_x[i])
     amp_y[i] = (punto_corda_y[i] - quiete_y[i])
     conta_pi[i] = PI;
  }
    
   punto_corda_x[i] = quiete_x[i] + amp_x[i] * sin(vibra * conta_pi[i]);
   punto_corda_y[i] = quiete_y[i] + amp_y[i] * sin(vibra * conta_pi[i]);   
      
       noFill();
       beginShape();
       curveVertex(x[i], y[i]);
       curveVertex(x[i], y[i]);
       curveVertex(punto_corda_x[i], punto_corda_y[i]);
       curveVertex(x[0], y[0]);
       curveVertex(x[0], y[0]);
       endShape();
      
      
lunghezza[i] = calcola_lunghezza(x[i], x[0], y[i], y[0]);
    }
 
    if (x[i] < target_x[i]) {
       x[i]++;
    }
      
    if (x[i] > target_x[i]) {
       x[i]--;
    }
    if (x[i] == target_x[i]) {
       target_x[i] = floor(random(width));
    }
      
    if (y[i] < target_y[i]) {
       y[i]++;
    }
      
    if (y[i] > target_y[i]) {
       y[i]--;
    }
    if (y[i] == target_y[i]) {
       target_y[i] = floor(random(height));
    } 

  //da rendere non lineare   
    freq[i] = map(lunghezza[i], 0, ipotenusa, 1.2, 0.2);
  //da aggiustare in base al numero di trigger attivi
    volume = 1/numero_cerchi;
    //se voglio la freq con effetto detuning
    campione[i].rate(freq[i]);
    //pan
    campione[i].pan((quiete_x[i] / width) * 2 - 1);
   
    if (trigger[i] == 1 && trigger_pre[i] == 0) { //&& campione[i].isPlaying() == false) {
      campione[i].setVolume(volume);
      //campione[i].rate(freq[i]); //se voglio la freq fissa
      campione[i].play();
      
    }
   
    trigger_pre[i] = trigger[i];  
    trigger[i] = 0;
    
  } //fine for generazione grafica e sonora

    
//-------------calcolo punto su linea----------------//

     for (let i = 0; i < numero_cerchi; i++) {
      for (let j = 0; j < numero_cerchi; j++) {
    
    if (i < (numero_cerchi - 1)) {
          if (j != i && j != (i + 1)) {
trigger[i] = calcola_punto_retta(x[i], y[i], x[i + 1], y[i + 1], x[j], y[j], trigger[i]);    
          }
      }
       else {
trigger[numero_cerchi - 1] = calcola_punto_retta(x[numero_cerchi - 1], 
                                                 y[numero_cerchi - 1], 
                                                 x[0], y[0], 
                                                 x[j], y[j],  
                                                 trigger[numero_cerchi - 1]);
      }
     }
    } 
  
} //fine draw()

function calcola_lunghezza(x1, x2, y1, y2) {
   return sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
}

function calcola_punto_retta(x0, y0, x1, y1, x2, y2, trigga) {
  
  let A = (x2 - x1) / (x0 - x1);
  let B = (y2 - y1) / (y0 - y1);

  if (trigga == 0) { 
  
  if ((abs(x2 - x1) <= soglia_trigger) && (abs(x0 - x1) == 0)) {
      // il segmento tende a essere verticale
       if (y0 < y1) {
        if (y2 > y0 && y2 < y1) {
        trigga = 1;
       }
        else {
         if (y2 < y0 && y2 > y1) {
          trigga = 1;
         }
        }
      } 
    } 
  if ((abs(y2 - y1) <= soglia_trigger) && (abs(y0 - y1) == 0)) {
      // il segmento tende a essere orizzontale
       if (x0 < x1) {
        if (x2 > x0 && x2 < x1) {
        trigga = 1;
       }
        else {
         if (x2 < x0 && x2 > x1) {
          trigga = 1;
         }
        }       
      }      
    } 
    
    if (abs(A - B) <= soglia_trigger) {
    
    if (x0 < x1) {
      if ((x2 > x0) && (x2 < x1)) {
        trigga =  1; 
        }
     }
    else {
       if ((x2 < x0) && (x2 > x1)) {
       trigga =  1; 
     }
    }
   }
  }
 return trigga;
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


