// p5.js fractal banner code extracted from index.html

let brainNeurons = [];
let brainOutline = [];
let brainHue;
let breatheTime = 0;

function setup() {
  const h = 180;
  const cnv = createCanvas(windowWidth, h);
  cnv.parent('banner');
  colorMode(HSL, 360, 100, 100, 1);
  noFill();
  frameRate(30);
  
  createBrainShape();
}

function draw() {
  clear();

  /* Time-driven parameters */
  const now = new Date();
  const minutes = now.getHours() * 60 + now.getMinutes();
  const progress = minutes / 1440;
  brainHue = map(progress, 0, 1, 180, 320); // teal → pink
  
  breatheTime += 0.02; // breathing rhythm
  
  // Brain breathing scale (grows and shrinks)
  let breatheScale = 1 + sin(breatheTime) * 0.15; // ±15% size variation
  
  push();
  translate(width / 2, height / 2);
  scale(breatheScale);
  drawBrain();
  pop();
}

function createBrainShape() {
  brainNeurons = [];
  brainOutline = [];
  
  // Create complete superior brain outline - anatomically correct proportions
  const baseWidth = min(width * 0.45, 200);  // Narrower width
  const baseHeight = min(height * 0.95, 170); // Longer length (anterior-posterior)
  
  // Anatomically accurate superior brain outline
  const outlinePoints = [
    // Frontal pole
    {x: 0, y: -baseHeight * 0.45},
    
    // Right frontal lobe
    {x: baseWidth * 0.12, y: -baseHeight * 0.44},
    {x: baseWidth * 0.22, y: -baseHeight * 0.42},
    {x: baseWidth * 0.32, y: -baseHeight * 0.38},
    {x: baseWidth * 0.40, y: -baseHeight * 0.32},
    {x: baseWidth * 0.45, y: -baseHeight * 0.24},
    {x: baseWidth * 0.48, y: -baseHeight * 0.15},
    
    // Right parietal lobe
    {x: baseWidth * 0.50, y: -baseHeight * 0.05},
    {x: baseWidth * 0.50, y: baseHeight * 0.05},
    {x: baseWidth * 0.48, y: baseHeight * 0.15},
    
    // Right temporal lobe
    {x: baseWidth * 0.45, y: baseHeight * 0.22},
    {x: baseWidth * 0.40, y: baseHeight * 0.28},
    {x: baseWidth * 0.32, y: baseHeight * 0.32},
    
    // Right occipital lobe
    {x: baseWidth * 0.22, y: baseHeight * 0.35},
    {x: baseWidth * 0.12, y: baseHeight * 0.37},
    
    // Occipital pole
    {x: 0, y: baseHeight * 0.38},
    
    // Left occipital lobe
    {x: -baseWidth * 0.12, y: baseHeight * 0.37},
    {x: -baseWidth * 0.22, y: baseHeight * 0.35},
    
    // Left temporal lobe
    {x: -baseWidth * 0.32, y: baseHeight * 0.32},
    {x: -baseWidth * 0.40, y: baseHeight * 0.28},
    {x: -baseWidth * 0.45, y: baseHeight * 0.22},
    
    // Left parietal lobe
    {x: -baseWidth * 0.48, y: baseHeight * 0.15},
    {x: -baseWidth * 0.50, y: baseHeight * 0.05},
    {x: -baseWidth * 0.50, y: -baseHeight * 0.05},
    
    // Left frontal lobe
    {x: -baseWidth * 0.48, y: -baseHeight * 0.15},
    {x: -baseWidth * 0.45, y: -baseHeight * 0.24},
    {x: -baseWidth * 0.40, y: -baseHeight * 0.32},
    {x: -baseWidth * 0.32, y: -baseHeight * 0.38},
    {x: -baseWidth * 0.22, y: -baseHeight * 0.42},
    {x: -baseWidth * 0.12, y: -baseHeight * 0.44}
  ];
  
  brainOutline = outlinePoints;
  
  // Distribute neurons throughout the brain area with better coverage
  for (let i = 0; i < 120; i++) {
    let point = getBrainPoint(baseWidth, baseHeight, i);
    
    brainNeurons.push({
      x: point.x,
      y: point.y,
      size: random(2.5, 4.5),
      activity: random(0, TWO_PI),
      region: getRegion(point.x, point.y, baseWidth, baseHeight)
    });
  }
}

function getBrainPoint(w, h, index) {
  // Generate points with strategic distribution for complete brain coverage
  let attempts = 0;
  
  // Ensure good coverage of upper brain regions (frontal and parietal areas)
  let biasTowardsTop = index < 40; // First 40 neurons biased towards top
  
  while (attempts < 50) {
    let x, y;
    
    if (biasTowardsTop) {
      // Bias towards upper brain areas
      x = random(-w * 0.45, w * 0.45);
      y = random(-h * 0.5, h * 0.05); // Focus on upper portion
    } else {
      // Normal distribution throughout brain
      x = random(-w * 0.5, w * 0.5);
      y = random(-h * 0.5, h * 0.4);
    }
    
    // Check if point is inside brain shape
    if (isInsideBrain(x, y, w, h)) {
      return {x: x, y: y};
    }
    attempts++;
  }
  return {x: 0, y: 0}; // fallback
}

function isInsideBrain(x, y, w, h) {
  // Anatomically accurate brain shape - oval with narrower front and back
  let normalizedX = x / (w * 0.5);
  let normalizedY = y / (h * 0.4);
  
  // Main brain oval
  let brainOval = (normalizedX * normalizedX) + (normalizedY * normalizedY) < 1;
  
  // Frontal narrowing
  if (y < -h * 0.2) {
    let frontFactor = 1 - Math.abs(y + h * 0.2) / (h * 0.25);
    brainOval = brainOval && Math.abs(x) < w * 0.35 * frontFactor;
  }
  
  // Occipital narrowing
  if (y > h * 0.15) {
    let backFactor = 1 - (y - h * 0.15) / (h * 0.25);
    brainOval = brainOval && Math.abs(x) < w * 0.4 * backFactor;
  }
  
  return brainOval;
}

function getRegion(x, y, w, h) {
  if (y < -h * 0.2) return 'frontal';
  if (y > h * 0.1) return 'occipital';
  if (abs(x) > w * 0.3) return 'temporal';
  return 'parietal';
}

function drawBrain() {
  // Draw neural connections
  stroke(brainHue, 40, 50, 0.35);
  strokeWeight(1.2);
  
  for (let i = 0; i < brainNeurons.length; i++) {
    for (let j = i + 1; j < brainNeurons.length; j++) {
      let neuronA = brainNeurons[i];
      let neuronB = brainNeurons[j];
      let d = dist(neuronA.x, neuronA.y, neuronB.x, neuronB.y);
      
      if (d < 40 && random() < 0.5) {
        let alpha = map(d, 0, 40, 0.5, 0.1);
        stroke(brainHue, 45, 65, alpha);
        strokeWeight(map(d, 0, 40, 1.8, 0.8));
        line(neuronA.x, neuronA.y, neuronB.x, neuronB.y);
      }
    }
  }
  
  // Draw neurons
  for (let neuron of brainNeurons) {
    let activity = sin(neuron.activity + breatheTime * 2.5) * 0.5 + 0.5;
    let alpha = map(activity, 0, 1, 0.5, 1.0);
    
    // Main neuron
    stroke(brainHue, 75, 75, alpha);
    strokeWeight(neuron.size);
    point(neuron.x, neuron.y);
    
    // Glow effect
    stroke(brainHue, 50, 85, alpha * 0.4);
    strokeWeight(neuron.size * 2.8);
    point(neuron.x, neuron.y);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, 180);
  createBrainShape();
}