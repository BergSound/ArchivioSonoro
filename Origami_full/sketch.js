let popolazione_max = 100;
let popolazione = 30;
let numero_cerchi = popolazione + 1;
let x = [numero_cerchi];
let y = [numero_cerchi];
let target_x = [numero_cerchi];
let target_y = [numero_cerchi];

let trigger = [numero_cerchi] , trigger_pre = [numero_cerchi];
let lunghezza_a = [numero_cerchi];
let lunghezza_b = [numero_cerchi];
let lunghezza_c = [numero_cerchi];
let semiperimetro = [numero_cerchi];
let area = [numero_cerchi];

let riempi_triangoli = [numero_cerchi];

let osc = [numero_cerchi - 2];
let modulante = [numero_cerchi - 2];
let frequenza = [numero_cerchi - 2];
let ampiezza = [numero_cerchi - 2];

let freq_min = 100;
let freq_max = 800;

let forma_onda = [numero_cerchi - 2];

let cnv;

let area_max = 3000;

function setup() {
  
  cnv = createCanvas(windowWidth, windowHeight); 
  cnv.mouseClicked(attiva_audio);
  
  raggio = width * 0.01;
  frameRate(20);
  
  for(let i = 0; i < numero_cerchi; i++) {
     
    x[i] = 0;
     y[i] = 0;
     
    target_x[i] = floor(random(width/4, width - width/4));
     target_y[i] = floor(random(height));
    
    area[i] = 0;
     
    trigger[i] = 0;
     trigger_pre[i] = 0;
    
     // riempi_triangoli[i] = ((i + 1) / numero_cerchi) * 255;
    riempi_triangoli[i] = random(230);
   if (i > 0){
    while (abs(riempi_triangoli[i] - riempi_triangoli[i - 1]) < 25 || riempi_triangoli[i] == 50) {
       riempi_triangoli[i] = random(230);
    }
   }
 
  }
  
  
   for (let i = 0; i < numero_cerchi - 2; i++) { 
      
    if (riempi_triangoli[i] <= 60) {
       forma_onda[i] = 'sine';
    }
     else if (riempi_triangoli[i] > 60 && riempi_triangoli[i] <= 120 ) {
       forma_onda[i] = 'triangle';
     }
     
     else if (riempi_triangoli[i] > 120 && riempi_triangoli[i] <= 180 ) {
       forma_onda[i] = 'square';
     }
       else {
       forma_onda[i] = 'sawtooth'; 
      }
  
    osc[i] = new p5.Oscillator('sine');
    osc[i].start();
    modulante[i] = new p5.Oscillator(forma_onda[i]);
    modulante[i].start();
    modulante[i].disconnect(); //disconnetto modulante da output
   
   }
    
 getAudioContext().suspend();
  
} //fine setup()

function draw() {
  background(50);
  
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
  

  stroke(255);
  
  for (let i = 0; i < numero_cerchi; i++) {
  
    if (x[i] < target_x[i]) {
       x[i]++;
    }
      
    if (x[i] > target_x[i]) {
       x[i]--;
    }
    if (x[i] == target_x[i]) {
       target_x[i] = floor(random(width/4, width - width/4));
      frequenza[i] = floor(map(x[i], 0, width/2, freq_min, freq_max) + 1);
    }
      
    if (y[i] < target_y[i]) {
       y[i]++;
    }
      
    if (y[i] > target_y[i]) {
       y[i]--;
    }
    if (y[i] == target_y[i]) {
       target_y[i] = floor(random(height));
      frequenza[i] = floor(map(y[i], 0, height, freq_min, freq_max) + 1);
    } 
        
  } //fine for generazione grafica

//-------------calcolo triangoli----------------//
  
  for (let i = 0; i < numero_cerchi; i++) {
    fill(riempi_triangoli[i]); 
    
    if (i < (numero_cerchi - 2)) {
      
      triangle(x[i], y[i], x[i +1], y[i + 1], x[i + 2], y[i + 2]);
     
      lunghezza_a[i] = calcola_lunghezza(x[i],     x[i + 1], y[i],     y[i + 1]);
      lunghezza_b[i] = calcola_lunghezza(x[i + 1], x[i + 2], y[i + 1], y[i + 2]);
      lunghezza_c[i] = calcola_lunghezza(x[i + 2], x[i],     y[i + 2], y[i]);
      
      semiperimetro[i] = somma_lunghezze(lunghezza_a[i], lunghezza_b[i], lunghezza_c[i]);
      area[i] = calcola_eulero(semiperimetro[i], lunghezza_a[i], lunghezza_b[i], lunghezza_c[i]);
      
     }
    
     else if (i < (numero_cerchi - 1)) {
      
      triangle(x[i], y[i], x[i + 1], y[i + 1], x[numero_cerchi - 1], y[numero_cerchi - 1]);
      
      lunghezza_a[i] = calcola_lunghezza(x[i],     x[i + 1],             y[i],                 y[i + 1]);
      lunghezza_b[i] = calcola_lunghezza(x[i + 1], x[numero_cerchi - 1], y[i + 1],             y[numero_cerchi - 1]);
      lunghezza_c[i] = calcola_lunghezza(x[numero_cerchi - 1], x[i],     y[numero_cerchi - 1], y[i]);
      
      semiperimetro[i] = somma_lunghezze(lunghezza_a[i], lunghezza_b[i], lunghezza_c[i]);
      area[i] = calcola_eulero(semiperimetro[i], lunghezza_a[i], lunghezza_b[i], lunghezza_c[i]);
    
     }

  }//fine calcolo triangoli
  
//-------------sintesi sonora----------------//
    
 for (let i = 0; i < numero_cerchi - 2; i++) { 
   
   if (area[i] >= area_max) {
      area_max = area[i];     
   }
   
   area[i] = constrain(area[i], 0, area_max);
   
   if (isNaN(area[i])) {
      area[i] = 0;
   }
   
   let ampiezza_map = map(area[i], 0, area_max, 0, (1 / (popolazione + 1)));
   ampiezza[i] = constrain(ampiezza_map, 0, 1);
  
   if (i < (numero_cerchi - 3)) {

    //frequenza[i] = map(x[i], 0, width, freq_min, freq_max);
 
    modulante[i].freq(frequenza[i]);
   
    modulante[i].amp(1);

    osc[i].freq(frequenza[i]); 
    osc[i].freq(modulante[i] * area[i] * 0.05 * (y[i] + 1)); 
    osc[i].amp(ampiezza[i] + 0.0001);
 
  }
  else {
    
    //frequenza[i] = map(x[i], 0, width, freq_min, freq_max);
 
    modulante[i].freq(frequenza[0]);
     modulante[i].amp(1);
   
    osc[i].freq(frequenza[i]); 
    osc[i].freq(modulante[i] * area[0] * 0.05 * (y[0] +1)); 
    osc[i].amp(ampiezza[i] + 0.0001);
   
   }
 } // fine sintesi sonora

    
//-------------utility----------------//
  
  for (let i = 0; i < numero_cerchi; i++) {
    
     trigger_pre[i] = trigger[i];
  }
  
} //fine draw()

function calcola_lunghezza(x1, x2, y1, y2) {
   return sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
}

function somma_lunghezze(L1, L2, L3) {
   return ((L1 + L2 + L3) * 0.5);
}

function calcola_eulero(p, a, b, c) {

  return sqrt(p * (p - a) * (p - b) * (p - c));

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