 class goccia{
    
    constructor() {
        
        this.x = random(0, width); //partenza gocce X
        this.y = random(-200, -100); //partenza gocce Y
        
      this.macro = random(0, 20); //mappature varie
        
      this.vel_caduta = map(this.macro, 0, 20, 0, 2);        
    }
    
    pioggia() {
      
      this.y = this.y + this.vel_caduta; //incr Y di caduta
      
      let acc_caduta = map(this.macro, 0, 20, 0, 0.08);
      this.vel_caduta = this.vel_caduta + acc_caduta; //accellero l'incremento Y di caduta
      
        
         if (this.y > height) { //riporto la goccia sopra
            
            this.x = random(0, width);
            this.y = random(-600, -100);
            this.vel_caduta = random(1, 10);
             
            if (numero_gocce < numero_gocce_max) {
              
             
              if (random(0, 1) > (0.7 + 0.25 * numero_gocce/numero_gocce_max)) {
               numero_gocce++;
              }
            }
        }
    }
    
    disegna() {
      
         this.lung_goccia = map(this.macro, 0, 20, 5, 20);
        
         this.dim_goccia = map(this.macro, 0, 20, 1, 4);
        strokeWeight(this.dim_goccia);
        stroke(255);
        line(this.x, this.y, this.x, this.y + this.lung_goccia);
      
    }
   
    get ypsilon() {
       return this.y
    }
   
    get ics() {
       return this.x
    }
   
    get lunghezza() {
       return this.lung_goccia
    }
   
    get grandezza() {
      return map(((this.dim_goccia + this.lung_goccia) * 0.5), 1, 12, 0, 1)
    }
}


let gocce = [];
let campione = [];
let numero_gocce_max = 200;
let numero_gocce = 1;
let sample = [];

let cnv;


function setup() {
  
  cnv = createCanvas(windowWidth, windowHeight);
  cnv.mouseClicked(attiva_audio);
 
  sample[0] = loadSound('goccia1.mp3');
  sample[1] = loadSound('goccia3.mp3');
  sample[2] = loadSound('goccia4.mp3');
  sample[3]= loadSound('goccia5.mp3');
    
  for(var i = 0; i < numero_gocce_max; i++) {
        
      gocce[i] = new goccia();
      campione[i] = sample[floor(random(0, 4))];
      campione[i].playMode('restart');
      
    }

     getAudioContext().suspend();
}

function draw() {

  
    background(0);
  

 /*if (numero_gocce == numero_gocce_max) {
   //il mouse fa da vento oppure da ombrello
 } */
    for(let i = 0 ; i < numero_gocce; i++) {
        
        gocce[i].pioggia();
        gocce[i].disegna();

      if (gocce[i].ypsilon >= (height - gocce[i].lunghezza)) {
          
        let freq = map(gocce[i].ics, 0, width, 0.8, 2.4);
        
        campione[i].rate(freq);
        campione[i].pan(map(gocce[i].ics, 0, width, -1, 1));
        campione[i].setVolume((1/(constrain(numero_gocce, 1, 50) + 1)) * gocce[i].grandezza);
        
        if (campione[i].isPlaying() == false) {
        campione[i].play();
        } 
      }
        
    }
  
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

