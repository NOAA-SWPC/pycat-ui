// INITIALIZE GLOBAL VARIABLES

const homeDir = '/pycat-ui/data';
const imgDir = '/pycat-ui';
const portNum = 5500;
let currentImg = 0;
let imgNum;

const width = 512;
const height = 512;
const twoPi = Math.PI * 2;
const deg2rad = Math.PI/180;

let centerY = 256;
let centerZ = 256;
let latitude = Number(document.getElementById('latRange').value);
let longitude = Number(document.getElementById('lonRange').value);
let aWidth = Number(document.getElementById('aRange').value);
//let bheight = aWidth / Math.sqrt(2);
let psi = Number(document.getElementById('psiRange').value);
let omega = [];
//let minT = -1 * (Math.PI / 2); //needed to find min and max t such that only half the lemniscate is drawn
//let maxT = Math.PI / 2;
//let tVal = [];
let nT = 100;
let yPrime = [];
let zPrime = [];
let x0Init = [];
let y0Init = [];
let z0Init = [];
let calcPath;

// PERFORM PRE-CALCULATIONS FOR 3D CONE
//      create base cone

let pSq;
let b = [];
let c = [];
let beta = [];
let r = [];
let rnorm = [];
let Nrz = [];
let z = [];
let coneInc = 1/nT;

let pIdx = 0
for (let p = 0; p <= 1.0; p+=coneInc) {
    z.push(p);
    pSq = p*p;
    b.push(2.0*pSq + 1.0);
    c.push(pSq*((pSq) - 1.0));
    beta.push((- b[pIdx] + Math.sqrt(b[pIdx]*b[pIdx] - 4.0*c[pIdx]))/2.0);
    r.push(Math.sqrt(beta[pIdx]));
    pIdx++;
    
}

r.forEach(function(rVal){
    rnorm.push(rVal / Math.max(...r));
})

//      compute number of radial points for each z
rnorm.forEach(function(rnormVal){
    Nrz.push(parseInt(rnormVal*nT + 1)); //asType integer still needed?
})


//      allocate arrays for points on surface
let Npoints=0;

for (var i in Nrz) {
    Npoints += Nrz[i];
}

function add(accumulator, a) {
    return accumulator + a;
}

let i1 = 0;
let i2 = 0;
let omegaInt;

for (let pt = 0; pt <= Npoints; pt+=1) {
    
    i2 = i1 + Nrz[pt];
    omegaInt = twoPi/Nrz[pt];
    // DEFINE phi ARRAY
    for (let t = 0.0; t <= twoPi; t+=omegaInt) {
        omega.push(t);
    }
    for (let s = i1; s <= i2; s+=1){
        x0Init[s] = r[pt] * Math.sin(omega[s]);
        y0Init[s] = r[pt] * Math.cos(omega[s]);
        z0Init[s] = z[pt];
    }
    
    i1 = i2;
}

let imageArr = [];
let fetchURL = "http://localhost:" + portNum + homeDir + "/images.json";
const fetchRequest = new Request(fetchURL); // 




document.addEventListener("DOMContentLoaded", function() {
    // SET UP INITIAL DOCUMENT

    
    calcPath = createPath();

    svg = d3.select('svg')
        .attr('width', width)
        .attr('height', height);

    svg.append('rect') //this is where we want to put the slideshow of fits files
        .attr('width', width)
        .attr('height', height)
        .attr('fill','url(#img1)')
        .attr('id','cmeBkg');

    svg.append('path')
        .attr('id', 'calculatedPath')
        .attr('d', calcPath)
        .attr('stroke','white')
        .style('fill','transparent');

    console.log("DOM fully loaded and parsed");

    fetch(fetchRequest)
    .then((response) => response.json())
    .then((data) => {
        imgNum = 0;
        data.forEach(function(imgName, idx) {
            imageArr.push(imgDir + imgName['image']);
            imgNum ++;
        });
    })
    .then(() => {
        let patImg = document.getElementById("patternImg");
        patImg.href.baseVal = imageArr[0];
    })

    document.getElementById('slideRange').addEventListener('change', function(){
        let currentIdx = this.value
        let cmePatternImg = document.getElementById("patternImg");
        cmePatternImg.href.baseVal = imageArr[currentIdx];
    })

    
    // CALCULATE COORDINATE ARRAYS & THE RESPECTIVE PATH


    function createPath() {
        let yPrime = [];
        let zPrime = [];
        x0 = x0Init;
        y0 = y0Init;
        z0 = z0Init;

        // scale with height and cone angle
        let psiRad = psi * deg2rad;

        let rs = Math.tan(psiRad);
        let d = Math.sqrt(2.0) * aWidth;
        x0 = x0.map(x => x*rs*d);
        y0 = y0.map(y => y*rs*d);
        z0 = z0.map(z => z*d);


        // Now rotate cone by specified colatitude and longitude

        let theta = (90.0 - latitude) * deg2rad;
        let phi = (longitude) * deg2rad;

        // We only really need yprime and zprime
        // no need to compute xprime

        let st = Math.sin(theta);
        let ct = Math.cos(theta);
        let sp = Math.sin(phi);
        let cp = Math.cos(phi);

        for (let i = 0; i < z0.length; i++) {
            yPrime[i] = ct*sp*x0[i] + cp*y0[i] + st*sp*z0[i];
            zPrime[i] = ct*z0[i] - st*x0[i];
       
        }

        // compute ymin, ymax for each z

        dz = .02;
        hdz = 0.5 * dz;
        zMin = Math.min(...zPrime);
        zMax = Math.max(...zPrime);
        iMin = zPrime.find(() => z == zMin);
        iMax = zPrime.find(() => z == zMax);
        yzMin = yPrime[iMin];
        yzMax = yPrime[iMax];
        let yzPairs = [];

        yPrime.forEach(function(yVal, idx) {
            yzPairs.push([yVal, zPrime[idx]]);
        });

        let hull = d3.polygonHull(yzPairs);

        let lemPath = 'M '+ String(hull[0][0]+centerY) + ' ' + String(hull[0][1]+centerZ);
        hull.forEach(function(yzPair){
            lemPath = lemPath + ' L ' + String(yzPair[0]+centerY) + ' ' + String(yzPair[1]+centerZ);
        });

        lemPath = lemPath + ' Z';
        
        return lemPath
    }

    document.getElementById('latRange').addEventListener('mouseup', function(){
        latitude = Number(this.value);
        calcPath = createPath();
        this.nextSibling.nextSibling.innerText = this.value;
        d3.select('#calculatedPath').attr('d', calcPath);
        //d3.select('#calculatedPath').attr('transform', `rotate(${phi}, ${centerX}, ${centerY})`);

    })

    document.getElementById('lonRange').addEventListener('mouseup', function(){
        longitude = Number(this.value);
        calcPath = createPath();
        this.nextSibling.nextSibling.innerText = this.value;
        d3.select('#calculatedPath').attr('d', calcPath);
        //d3.select('#calculatedPath').attr('transform', `rotate(${phi}, ${centerX}, ${centerY})`);

    })

    document.getElementById('aRange').addEventListener('mouseup', function(){
        aWidth = Number(this.value);
        calcPath = createPath();
        this.nextSibling.nextSibling.innerText = this.value;
        d3.select('#calculatedPath').attr('d', calcPath);
        //d3.select('#calculatedPath').attr('transform', `rotate(${phi}, ${centerX}, ${centerY})`);

    })

    document.getElementById('psiRange').addEventListener('mouseup', function(){
        psi = Number(this.value);
        calcPath = createPath();
        this.nextSibling.nextSibling.innerText = this.value;
        d3.select('#calculatedPath').attr('d', calcPath);
        //d3.select('#calculatedPath').attr('transform', `rotate(${phi}, ${centerX}, ${centerY})`);

    })
    



    

});

  