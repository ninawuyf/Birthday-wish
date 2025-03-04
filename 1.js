let videoElement;
let floatingTexts = [];
let inputBox;
let isPlaying = false;
const fadeDuration = 60; 

function setup() {
    createCanvas(windowWidth, windowHeight);
    noStroke();

    
    videoElement = select("#bgVideo");

    
    inputBox = select("#textInput");

    
    select("#startButton").mousePressed(() => {
        select("#startDialog").style("display", "none");
        videoElement.attribute("autoplay", "true");
        videoElement.play();
        isPlaying = true;
        inputBox.style("display", "block");
    });

    
    inputBox.elt.addEventListener("keydown", function(event) {
        if (event.key === "Enter" && inputBox.value().trim() !== "") {
            addFloatingText(inputBox.value());
            inputBox.value(""); 
        }
    });
}


class FloatingText {
    constructor(text) {
        this.text = text;
        this.x = random(50, width - 250);
        this.y = random(50, height - 100);
        this.speedX = random(-2, 2); 
        this.speedY = random(-2, 2); 
        this.width = textWidth(text) + 30; 
        this.height = 40;
        this.alpha = 255; 
        this.lifeTime = fadeDuration * 60; 
    }

    update() {
        
        this.x += this.speedX;
        this.y += this.speedY;

        
        this.alpha -= 255 / this.lifeTime;

        
        if (this.x < 0 || this.x + this.width > width) this.speedX *= -1;
        if (this.y < 0 || this.y + this.height > height) this.speedY *= -1;
    }

    display() {
        fill(255, this.alpha); 
        stroke(0, this.alpha);
        strokeWeight(2);
        rect(this.x, this.y, this.width, this.height, 10); 

        fill(0, this.alpha);
        noStroke();
        textSize(18);
        textAlign(CENTER, CENTER);
        text(this.text, this.x + this.width / 2, this.y + this.height / 2);
    }

    isFaded() {
        return this.alpha <= 0;
    }
}


function addFloatingText(text) {
    let newText = new FloatingText(text);

    
    let maxAttempts = 50;
    let attempts = 0;
    while (attempts < maxAttempts) {
        let overlapping = false;
        for (let other of floatingTexts) {
            let d = dist(newText.x, newText.y, other.x, other.y);
            if (d < 50) { 
                overlapping = true;
                break;
            }
        }
        if (!overlapping) break; 
        newText.x = random(50, width - 250);
        newText.y = random(50, height - 100);
        attempts++;
    }

    floatingTexts.push(newText);
}


function draw() {
    clear(); 

    if (!isPlaying) return; 

    for (let i = floatingTexts.length - 1; i >= 0; i--) {
        floatingTexts[i].update();
        floatingTexts[i].display();

        
        if (floatingTexts[i].isFaded()) {
            floatingTexts.splice(i, 1);
        }
    }
}


function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}