
/* WHAT IF LAB — Biology Experience V2 */

const stories = {

  'photosynthetic-human': [
    ['Capture sunlight','Convert light',
     'Store chemical energy','Compare with food'],

    'Even hypothetical photosynthetic skin would have limited collecting area. The body would still need water, protein, minerals and other nutrients. More sunlight also means heat and UV exposure.',

    'The energy budget assumes constant irradiance and efficiency; the human skin cells shown are fictional.'
  ],

  'limb-regeneration': [
    ['Wound closure','Cell recruitment',
     'Tissue patterning','Limb growth'],

    'Regeneration would require coordinated bone, muscle, blood vessel and nerve development. Human healing generally cannot reconstruct an entire lost limb.',

    'The stages are conceptual; the existing exponential growth curve does not predict when any biological stage occurs.'
  ],

  'glowing-human': [
    ['Cell activation','Chemical reaction',
     'Light emission','Environmental contrast'],

    'A glow could make a person visible at night, but producing light requires chemical energy. Strong ambient light would reduce contrast.',

    'Relative brightness is illustrative; humans do not have a natural visible bioluminescent skin system.'
  ],

  'human-camouflage': [
    ['Sense surroundings','Adjust pigments',
     'Match background','Remain detectable'],

    'Color matching alone cannot erase shadows, body shape or movement. Octopus skin can also modify its texture.',

    'The color-match index is not a real probability of detection.'
  ],

  'tardigrade-mode': [
    ['Normal hydration','Water loss',
     'Water restored','Rehydration'],

    'Some tardigrades tolerate severe dehydration through cryptobiosis. Humans cannot survive comparable water loss or enter that state.',

    'This illustrates a tardigrade-inspired water curve, not survival or human medical guidance.'
  ],

  'giant-insects': [
    ['Normal size','Body enlargement',
     'Volume rises','Scaling limits'],

    'Mass rises faster than cross-sectional area in geometrically similar bodies. Oxygen delivery, structural support and molting would all become challenging.',

    'Geometric scaling alone cannot predict the maximum size of a real insect.'
  ],

  'two-hearts': [
    ['Pressure source','Parallel pumps',
     'Network flow','System feedback'],

    'A second heart would require coordinated valves, pressure regulation and anatomy. Two pumps would not automatically double circulation.',

    'This is an ideal fluid network, not a physiological heart model.'
  ],

  'slime-mold-maze': [
    ['Explore routes','Reach food',
     'Compare costs','Favor cheaper path'],

    'Slime mold can reorganize its network without a brain. Real growth responds to nutrients, geometry and local conditions.',

    'The existing demonstration compares two preset routes, not an arbitrary maze or real growth algorithm.'
  ],

  'gecko-human': [
    ['Contact surface','Generate adhesion',
     'Compare forces','Hold or slip model'],

    'Gecko adhesion depends on microscopic structures and surface conditions. Scaling that ability to human bodies is difficult.',

    'An ideal force comparison cannot establish safe climbing or real adhesive performance.'
  ],

  'human-night-vision': [
    ['Collect photons','Detect signal',
     'Improve contrast','Reveal scene'],

    'Greater photon collection could improve low-light vision, with trade-offs in resolution, color or response time. Without photons, visible-light vision cannot work.',

    'This is a photon-count model, not a measured human retinal response.'
  ]

};

/* CINEMATIC SOLAR SIMULATION */

function solarScene(canvas,p,t,duration){

  const c=canvas.getContext('2d');

  const f=Math.min(1,t/duration), W=660,H=300;

  c.setTransform(
    canvas.width/W,0,0,canvas.height/H,0,0
  );

  const sky=c.createLinearGradient(0,0,0,H);

  sky.addColorStop(0,'#223e4b');
  sky.addColorStop(1,'#9fac82');

  c.fillStyle=sky;
  c.fillRect(0,0,W,H);

  const sx=75+f*225;
  const sy=115-75*Math.sin(f*Math.PI);

  const halo=c.createRadialGradient(
    sx,sy,6,sx,sy,95
  );

  halo.addColorStop(
    0,'rgba(255,232,157,0.9)'
  );

  halo.addColorStop(
    1,'rgba(255,232,157,0)'
  );

  c.globalAlpha=p.light/1000;
  c.fillStyle=halo;
  c.fillRect(0,0,W,H);

  c.fillStyle='#ffe8a2';
  c.beginPath();
  c.arc(sx,sy,19,0,Math.PI*2);
  c.fill();
  c.globalAlpha=1;

  /* LANDSCAPE */

  for(let layer=0;layer<3;layer++){

    c.fillStyle=[
      '#59756a','#345b50','#193b34'
    ][layer];

    c.beginPath();
    c.moveTo(0,H);

    for(let x=0;x<=W;x+=5){

      c.lineTo(
        x,
        165+layer*38+
        16*Math.sin(x/55+layer*2)+
        9*Math.cos(x/23)
      );

    }

    c.lineTo(W,H);
    c.closePath();
    c.fill();

  }

  for(let i=0;i<22;i++){

    const x=i*31;
    const y=250+9*Math.sin(i*5);
    const h=19+(i*17)%45;

    c.fillStyle='#244b3a';

    c.beginPath();
    c.moveTo(x-11,y);
    c.lineTo(x,y-h);
    c.lineTo(x+11,y);
    c.fill();

  }

  /* MOVING SUNLIGHT PARTICLES */

  c.strokeStyle=
    'rgba(255,231,153,'+
    (p.light/1000*.35)+')';

  c.lineWidth=2;

  for(let i=0;i<9;i++){

    c.beginPath();
    c.moveTo(sx,sy);
    c.lineTo(390+i*6,85+i*15);
    c.stroke();

    const u=(i/9+t*.35)%1;

    c.fillStyle='#ffe8a0';
    c.globalAlpha=p.light/1000;

    c.beginPath();

    c.arc(
      sx+(390+i*6-sx)*u,
      sy+(85+i*15-sy)*u,
      2,0,Math.PI*2
    );

    c.fill();

  }

  c.globalAlpha=1;

  /* HUMAN BODY ILLUSTRATION */

  c.save();
  c.translate(440,40);
  c.scale(1.1,1.1);

  const skin=c.createLinearGradient(
    -42,0,45,0
  );

  skin.addColorStop(0,'#335a50');
  skin.addColorStop(.5,'#a1d2a0');
  skin.addColorStop(1,'#4d7c64');

  c.fillStyle=skin;

  c.beginPath();
  c.ellipse(0,25,14,20,0,0,Math.PI*2);
  c.fill();

  c.beginPath();

  c.moveTo(-7,43);
  c.lineTo(-9,53);
  c.quadraticCurveTo(-33,53,-37,68);
  c.lineTo(-49,119);
  c.quadraticCurveTo(-45,127,-39,119);
  c.lineTo(-22,83);
  c.lineTo(-18,115);
  c.lineTo(-22,207);
  c.lineTo(-8,207);
  c.lineTo(0,137);
  c.lineTo(8,207);
  c.lineTo(22,207);
  c.lineTo(18,115);
  c.lineTo(22,83);
  c.lineTo(39,119);
  c.quadraticCurveTo(45,127,49,119);
  c.lineTo(37,68);
  c.quadraticCurveTo(33,53,9,53);
  c.lineTo(7,43);
  c.closePath();
  c.fill();

  /* HYPOTHETICAL ACTIVE SKIN CELLS */

  c.globalAlpha=p.light/1000;

  c.shadowBlur=8;
  c.shadowColor='#aaff89';
  c.fillStyle='#c7fca2';

  for(let i=0;i<28;i++){

    c.beginPath();

    c.arc(
      -12+(i*7)%25,
      62+(i*13)%48,
      1.5+.7*Math.sin(t*3+i),
      0,Math.PI*2
    );

    c.fill();

  }

  c.restore();
  c.globalAlpha=1;

  c.fillStyle='#e5f8dc';
  c.font='13px system-ui';

  c.fillText(
    'ILLUSTRATIVE SOLAR EXPOSURE',
    18,22
  );

  /* LIVE ENERGY ACCUMULATION */

  const kcal=
    p.light*p.area*p.eff/100*
    p.hours*3600/4184*f;

  c.fillStyle='#0b201c';
  c.fillRect(20,257,278,27);

  c.fillStyle='#96e5ac';

  c.fillRect(
    20,257,
    278*Math.min(1,kcal/2000),27
  );

  c.fillStyle='#fff';
  c.font='bold 12px system-ui';

  c.fillText(
    kcal.toFixed(1)+' kcal accumulated',
    28,275
  );

}

/* MICROSCOPIC BIOLOGY VIEW */

function cellScene(canvas,p,t){

  const c=canvas.getContext('2d');

  c.setTransform(
    canvas.width/320,0,0,
    canvas.height/130,0,0
  );

  c.fillStyle='#0d2323';
  c.fillRect(0,0,320,130);

  c.fillStyle='#244a3e';
  c.strokeStyle='#8bc8a2';
  c.lineWidth=2;

  c.beginPath();
  c.ellipse(160,65,128,48,0,0,Math.PI*2);
  c.fill();
  c.stroke();

  for(let i=0;i<6;i++){

    const x=78+i*32;
    const y=56+(i%2)*23;

    c.fillStyle='#80bd69';

    c.beginPath();
    c.ellipse(x,y,12,8,-.3,0,Math.PI*2);
    c.fill();

    c.strokeStyle='#355f32';

    for(let j=-3;j<=3;j+=3){

      c.beginPath();
      c.moveTo(x-6,y+j);
      c.lineTo(x+6,y+j);
      c.stroke();

    }

    c.fillStyle='#f8da8a';
    c.globalAlpha=p.light/1000;

    const u=(i/6+t*.6)%1;

    c.beginPath();
    c.arc(x,14+(y-14)*u,2,0,Math.PI*2);
    c.fill();
    c.globalAlpha=1;

  }

  c.fillStyle='#d9efd8';
  c.font='10px system-ui';

  c.fillText(
    'FICTIONAL CHLOROPLAST-LIKE CELLS',
    13,121
  );

}

/* SHARED BIOLOGY EXPERIENCE ENGINE */

export function mountBiology({
  labs,draw,defaults,state
}){

  const id=new URLSearchParams(
    location.search
  ).get('lab');

  const lab=labs.find(
    l=>l.id===id&&l.category==='biology'
  );

  const page=document.getElementById(
    'experiment-page'
  );

  if(!lab||!page||!stories[id])return;

  const [stages,reality,limits]=stories[id];

  const root=document.createElement('section');

  root.className='bio2';

  root.innerHTML=`

  <style>

    .bio2{
      margin-top:24px;
      --bio:#8de3af;
    }

    .bio2 .bpanel{
      background:var(--panel);
      border:1px solid var(--border);
      border-radius:18px;
      padding:18px;
      min-width:0;
    }

    .bio2 .bgrid{
      display:grid;
      grid-template-columns:
        minmax(0,2fr) minmax(0,1fr);
      gap:16px;
    }

    .bio2 canvas{
      display:block;
      width:100%;
      height:auto;
      background:#0c191d;
      border-radius:12px;
    }

    .bio2 .bcap{
      font-size:11px;
      letter-spacing:1.5px;
      color:var(--bio);
      font-weight:700;
      margin-bottom:10px;
    }

    .bio2 .brow{
      display:flex;
      flex-wrap:wrap;
      gap:8px;
      align-items:center;
      margin:12px 0;
    }

    .bio2 .brow button{
      flex:1;
      font-size:13px;
      padding:10px;
    }

    .bio2 .bsteps{
      display:grid;
      grid-template-columns:repeat(4,minmax(0,1fr));
      gap:6px;
      margin:12px 0;
    }

    .bio2 .bstep{
      border:1px solid var(--border);
      border-radius:9px;
      padding:9px;
      font-size:11px;
      color:var(--muted);
    }

    .bio2 .bstep.active{
      border-color:var(--bio);
      color:var(--text);
      background:var(--surface);
    }

    .bio2 .bnum{
      display:block;
      color:var(--bio);
      font-weight:700;
      margin-bottom:6px;
    }

    .bio2 .bdetails{
      display:grid;
      grid-template-columns:1fr 1fr;
      gap:14px;
      margin:16px 0;
    }

    .bio2 .bpanel p{
      font-size:14px;
      line-height:1.7;
      color:var(--muted);
      margin:10px 0;
    }

    .bio2 .bpanel h3{
      margin:8px 0;
    }

    .bio2 .control{
      padding:12px;
      margin:8px 0;
    }

    .bio2 [hidden]{
      display:none!important;
    }

    .bio2 input[type=range]{
      margin-top:10px;
    }

    @media(max-width:800px){

      .bio2 .bgrid,
      .bio2 .bdetails{
        grid-template-columns:1fr;
      }

      .bio2 .bsteps{
        grid-template-columns:repeat(2,1fr);
      }

    }

  </style>

  <div class="bgrid">

    <div class="bpanel">

      <div class="bcap">
        01 / LIVE BIOLOGY SIMULATION
      </div>

      <canvas data-main
        width="1320"
        height="600"
        role="img"
        aria-label="${lab.label} simulation">
      </canvas>

      <div class="brow">

        <button class="primary" data-play>
          ${lab.action}
        </button>

        <button class="secondary" data-reset>
          Reset
        </button>

        <button class="secondary" data-compare
          aria-pressed="false">
          Compare start
        </button>

      </div>

      <label for="bio2-time">

        Simulation timeline

        <output data-time></output>

      </label>

      <input id="bio2-time"
        data-timeline
        type="range"
        min="0"
        max="1000"
        step="1"
        value="0">

      <div class="bsteps">

        ${stages.map((x,i)=>`

          <div class="bstep">

            <span class="bnum">
              0${i+1}
            </span>

            ${x}

          </div>

        `).join('')}

      </div>

      <div data-comparison hidden>

        <div class="bcap">
          SAME INPUTS / START OF MODEL
        </div>

        <canvas data-before
          width="990"
          height="450"
          role="img"
          aria-label="Initial simulation state">
        </canvas>

      </div>

      <p>
        Illustrative timeline,
        not measured biological timings.
      </p>

    </div>

    <div class="bpanel">

      <div class="bcap">
        02 / CHANGE THE RULES
      </div>

      ${lab.knobs.map(k=>`

        <div class="control">

          <label for="bio2-${k.key}">

            ${k.label}

            <output data-out="${k.key}">
            </output>

          </label>

          <input id="bio2-${k.key}"
            data-knob="${k.key}"
            type="range"
            min="${k.min}"
            max="${k.max}"
            step="${k.step}"
            value="${k.value}">

        </div>

      `).join('')}

      <div class="brow">

        ${lab.presets.map(([name],i)=>`

          <button class="secondary"
            data-preset="${i}">

            ${name}

          </button>

        `).join('')}

      </div>

      <div class="metrics" data-results>

        ${Array.from({length:4},()=>

          '<div class="metric">'+
          '<small></small>'+
          '<strong></strong>'+
          '</div>'

        ).join('')}

      </div>

    </div>

  </div>

  <div class="bdetails">

    <article class="bpanel">

      <div class="bcap">
        03 / INSIDE THE BIOLOGY
      </div>

      <h3 data-phase></h3>

      ${id==='photosynthetic-human'

        ? '<canvas data-cell width="640" height="260" role="img" aria-label="Hypothetical light-collecting skin cell"></canvas>'

        : ''

      }

      <p>${lab.explain}</p>

      <div class="formula">
        ${lab.formula}
      </div>

    </article>

    <article class="bpanel">

      <div class="bcap">
        04 / WHAT WOULD REALLY HAPPEN?
      </div>

      <h3>Reality check</h3>

      <p>${reality}</p>

      <h3>Model limitations</h3>

      <p>${limits}</p>

      <p>${lab.note}</p>

    </article>

  </div>

  <a href="index.html#experiments">
    ← Explore all experiments
  </a>

  `;

  /* LIVE STATE MANAGEMENT */

  const find=x=>root.querySelector(x);

  const all=x=>[
    ...root.querySelectorAll(x)
  ];

  let p=defaults(lab);
  let s=state(lab,p);
  let q=lab.calc(p);

  let raf=0;
  let last=0;

  let playing=false;
  let compare=false;

  const reduced=matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  const duration=()=>
    lab.duration?lab.duration(p,q):10;

  function scene(canvas,t){

    if(id==='photosynthetic-human'){

      solarScene(
        canvas,p,t,duration()
      );

    }else{

      draw(canvas,lab,p,{...s,t},q);

    }

  }

  function paint(){

    const d=duration();

    const f=Math.min(1,s.t/d);

    const idx=Math.min(
      3,Math.floor(f*4)
    );

    scene(find('[data-main]'),s.t);

    if(id==='photosynthetic-human'){

      cellScene(
        find('[data-cell]'),p,s.t
      );

    }

    if(compare){

      scene(find('[data-before]'),0);

    }

    find('[data-timeline]').value=
      Math.round(f*1000);

    find('[data-time]').textContent=
      Math.round(f*100)+'%';

    find('[data-phase]').textContent=
      stages[idx];

    all('.bstep').forEach((el,i)=>{

      el.classList.toggle(
        'active',i===idx
      );

    });

    const values=lab.stats(p,s,q);

    all('[data-results] .metric')
      .forEach((el,i)=>{

        el.querySelector('small')
          .textContent=values[i][0];

        el.querySelector('strong')
          .textContent=values[i][1];

      });

    find('[data-play]').textContent=

      playing?'Pause':

      s.t>=d?'Run again':

      s.t>0?'Resume':

      lab.action;

  }

  function stop(){

    playing=false;

    cancelAnimationFrame(raf);

    last=0;

  }

  function refresh(){

    s=state(lab,p);

    q=lab.calc(p);

    all('[data-knob]').forEach(el=>{

      el.value=p[el.dataset.knob];

    });

    lab.knobs.forEach(k=>{

      find(`[data-out="${k.key}"]`)
        .textContent=p[k.key]+' '+k.unit;

    });

    paint();

  }

  function tick(now){

    if(!playing)return;

    const dt=last
      ?Math.min(.05,(now-last)/1000)
      :0;

    last=now;

    s.t=Math.min(
      duration(),s.t+dt
    );

    if(s.t>=duration())stop();

    paint();

    if(playing){

      raf=requestAnimationFrame(tick);

    }

  }

  /* PLAY / PAUSE */

  find('[data-play]').onclick=()=>{

    if(playing){

      stop();
      paint();
      return;

    }

    if(s.t>=duration())s.t=0;

    if(reduced){

      s.t=duration();
      paint();
      return;

    }

    playing=true;

    last=0;

    paint();

    raf=requestAnimationFrame(tick);

  };

  /* RESET */

  find('[data-reset]').onclick=()=>{

    stop();

    p=defaults(lab);

    refresh();

  };

  /* INTERACTIVE TIMELINE */

  find('[data-timeline]').oninput=e=>{

    stop();

    s.t=duration()*
      Number(e.target.value)/1000;

    paint();

  };

  /* BEFORE / AFTER COMPARISON */

  find('[data-compare]').onclick=()=>{

    compare=!compare;

    find('[data-comparison]').hidden=
      !compare;

    find('[data-compare]').setAttribute(
      'aria-pressed',String(compare)
    );

    paint();

  };

  /* CONTROL SLIDERS */

  all('[data-knob]').forEach(el=>{

    el.oninput=()=>{

      stop();

      p[el.dataset.knob]=
        Number(el.value);

      refresh();

    };

  });

  /* PRESET SCENARIOS */

  all('[data-preset]').forEach(el=>{

    el.onclick=()=>{

      stop();

      Object.assign(
        p,
        lab.presets[
          Number(el.dataset.preset)
        ][1]
      );

      refresh();

    };

  });

  /* MOUNT NEW EXPERIENCE */

  refresh();

  page.replaceChildren(root);

}

/* END OF BIOLOGY EXPERIENCE V2 */
