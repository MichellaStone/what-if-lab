
/* What If Lab — Human Consequence Explorer */

(() => {
  'use strict';

  const metrics = document.getElementById('metrics');

  if (!metrics || typeof read !== 'function') return;

  const root = document.createElement('section');

  root.id = 'human-explorer';
  root.className = 'panel';
  root.style.margin = '14px 0';

  root.innerHTML = `

  <style>

  #human-explorer .hx-grid{
    display:grid;
    grid-template-columns:minmax(0,1fr) minmax(0,1fr);
    gap:16px
  }

  #human-explorer svg{
    display:block;
    width:100%;
    height:auto;
    background:#091827;
    border-radius:12px
  }

  #human-explorer .hx-card{
    background:#0b1929;
    border:1px solid #29445a;
    border-radius:12px;
    padding:14px;
    min-width:0
  }

  #human-explorer .hx-bar{
    height:8px;
    background:#25384b;
    border-radius:9px;
    overflow:hidden;
    margin:8px 0 14px
  }

  #human-explorer .hx-bar i{
    display:block;
    height:100%;
    background:#8ad8fa;
    transition:width .15s
  }

  #human-explorer .hx-hot{
    cursor:pointer;
    outline:none
  }

  #human-explorer .hx-hot:focus-visible circle{
    stroke:#fff;
    stroke-width:4
  }

  #human-explorer .hx-flow{
    stroke-dasharray:7 8;
    animation:hx-flow 1s linear infinite
  }

  @keyframes hx-flow{
    to{stroke-dashoffset:-30}
  }

  @media(prefers-reduced-motion:reduce){
    #human-explorer .hx-flow{
      animation:none
    }
  }

  @media(max-width:780px){
    #human-explorer .hx-grid{
      grid-template-columns:1fr
    }
  }

  </style>

  <div class="eyebrow">
    HUMAN CONSEQUENCE EXPLORER
  </div>

  <h2>What happens to us?</h2>

  <p class="muted">
    Explore the human body, everyday life and civilization.
    The model follows the main atmosphere timeline.
  </p>

  <div class="row">

    <button data-hx-mode="outside"
      aria-pressed="true">
      Unprotected outdoors
    </button>

    <button data-hx-mode="inside"
      aria-pressed="false">
      Sealed habitat
    </button>

  </div>

  <div class="hx-grid">

    <div class="hx-card">

      <svg viewBox="0 0 340 380"
        role="group"
        aria-label="Interactive human body diagram">

        <defs>
          <linearGradient id="hxSkin">
            <stop stop-color="#426678"/>
            <stop offset=".5" stop-color="#8aa9b7"/>
            <stop offset="1" stop-color="#3d5d70"/>
          </linearGradient>
        </defs>

        <path d="M146 91 L146 110
          Q109 112 101 140 L73 224
          Q69 237 82 240 L117 170
          L119 226 L110 344 L139 344
          L165 246 L193 344 L222 344
          L211 226 L213 170 L248 240
          Q261 237 257 224 L229 140
          Q221 112 184 110 L184 91Z"
          fill="url(#hxSkin)"
          stroke="#a5ccdc"/>

        <ellipse cx="165" cy="61"
          rx="38" ry="43"
          fill="url(#hxSkin)"
          stroke="#a5ccdc"/>

        <path d="M145 45 Q135 24 159 27
          Q177 18 190 39 Q202 56 185 65
          Q165 76 148 63Z"
          fill="#b7a4ff"
          stroke="#e0d5ff"/>

        <path d="M162 84 V132
          M168 130 L145 151
          M168 130 L188 151"
          fill="none"
          stroke="#abd9ee"
          stroke-width="6"
          stroke-linecap="round"/>

        <path d="M155 133 Q134 122 126 148
          L124 183 Q128 202 156 192Z
          M175 133 Q196 122 204 148
          L206 183 Q202 202 175 192Z"
          fill="#ec999d"
          stroke="#ffccd0"/>

        <path d="M165 179
          C142 155 133 193 165 214
          C197 193 188 155 165 179Z"
          fill="#d96c7c"/>

        <path class="hx-flow"
          id="hxFlow"
          d="M165 191 L165 115 L165 75
          M165 210 L165 239 L133 322
          M165 239 L203 322"
          fill="none"
          stroke="#91dfff"
          stroke-width="3"/>

        <g fill="#0c1e2e"
          stroke="#ffd28b"
          stroke-width="2">

        ${[
          ['brain',165,46],
          ['ear',200,65],
          ['lungs',137,158],
          ['heart',165,195],
          ['skin',226,210]
        ].map(([k,x,y])=>`

          <g class="hx-hot"
            data-hx-organ="${k}"
            role="button"
            tabindex="0"
            aria-label="Explore ${k}">

            <circle cx="${x}" cy="${y}" r="12"/>

            <circle cx="${x}" cy="${y}" r="4"
              fill="#ffd28b"
              stroke="none"/>

          </g>

        `).join('')}

        </g>

        <text x="170" y="370"
          fill="#a9bfd3"
          font-size="12"
          text-anchor="middle">
          Select an organ or use the buttons
        </text>

      </svg>

      <div class="row">

        ${['brain','lungs','heart','ear','skin']
          .map(k=>`

          <button data-hx-organ="${k}">

            ${k==='ear'
              ?'Ears'
              :k[0].toUpperCase()+k.slice(1)}

          </button>

        `).join('')}

      </div>

    </div>

    <div class="hx-card">

      <small>ENVIRONMENT AROUND THE PERSON</small>

      <h2 id="hxPressure"></h2>

      <small>Pressure relative to normal sea level</small>

      <div class="hx-bar">
        <i id="hxPbar"></i>
      </div>

      <h2 id="hxOxygen"></h2>

      <small>
        Dry-gas oxygen partial pressure,
        relative to normal air
      </small>

      <div class="hx-bar">
        <i id="hxObar"></i>
      </div>

      <p class="status" id="hxStatus"
        aria-live="polite"></p>

      <div class="eyebrow">
        INSIDE THE BODY
      </div>

      <h2 id="hxOrganTitle"></h2>

      <p id="hxOrganText"></p>

      <p class="note">
        Schematic only. Blue flow lines represent
        oxygen availability in the surrounding gas,
        not measured blood oxygen or blood flow.
        No survival time or safe exposure is calculated.
      </p>

      <button id="hxHabitat">
        Open habitat controls ↑
      </button>

    </div>

  </div>

  <div class="row">

    <button data-hx-topic="daily"
      aria-pressed="true">
      Everyday life
    </button>

    <button data-hx-topic="society"
      aria-pressed="false">
      Civilization
    </button>

    <button data-hx-topic="myths"
      aria-pressed="false">
      Movie myths
    </button>

  </div>

  <div class="hx-card" id="hxTopic"></div>

  <p class="note">

    Further reading:

    <a href="https://imagine.gsfc.nasa.gov/ask_astro/space_travel.html">
      NASA — vacuum exposure
    </a>

    ·

    <a href="https://www.ncbi.nlm.nih.gov/books/NBK470190/">
      Aerospace pressure effects
    </a>

    ·

    <a href="https://www.nasa.gov/general/what-is-earths-atmosphere/">
      NASA — atmosphere
    </a>

  </p>

  `;

  metrics.after(root);

  const $h = id => root.querySelector('#'+id);


  /* HUMAN ANATOMY INFORMATION */

  const organs = {

    brain:[
      'Brain',

      'Reduced oxygen availability can impair thinking and coordination. In a vacuum, oxygen supply fails rapidly; loss of consciousness and severe injury can follow.'
    ],

    lungs:[
      'Lungs',

      'Falling pressure reduces the oxygen available to breathe. Rapid decompression can expand trapped gas and injure delicate lung tissue.'
    ],

    heart:[
      'Heart and circulation',

      'Blood carries oxygen to organs. Severe oxygen deprivation threatens heart and brain function. The pressure of circulating blood means it does not instantly boil inside vessels.'
    ],

    ear:[
      'Ears and sinuses',

      'A rapid pressure difference across air-filled spaces can injure the ears or sinuses. With no surrounding gas, airborne sound cannot travel.'
    ],

    skin:[
      'Skin and eyes',

      'At extremely low ambient pressure, exposed moisture can vaporize at body temperature. Skin does not make a person explode. Loss of atmospheric UV protection creates additional hazards outdoors.'
    ]

  };


  /* BROADER HUMAN CONSEQUENCES */

  const topics = {

    daily:[
      'Outside daily life',

      'Unprotected outdoor breathing becomes impossible if the original atmosphere is entirely removed. Airborne speech and ordinary air-breathing engines stop working in a vacuum. Radio communication can still work, and gravity remains nearly unchanged.'
    ],

    society:[
      'Civilization and infrastructure',

      'Human communities would depend on engineered sealed environments, oxygen supply, carbon dioxide removal, water recovery, food production, energy and radiation shielding. Ordinary buildings are not automatically pressure vessels. Population outcomes cannot be calculated from this simple model.'
    ],

    myths:[
      'What movies get wrong',

      'People do not instantly explode, freeze solid or have all their blood immediately boil. The main acute threats are oxygen deprivation and decompression injury. Earth does not lose its gravity merely because the air disappears.'
    ]

  };


  let mode='outside';
  let organ='lungs';
  let topic='daily';


  /* SYNCHRONIZE WITH WORLD SIMULATION */

  function update(){

    const world=read();

    const pressure=mode==='inside'
      ?Number(document.getElementById('cabin').value)
      :world.p;

    const oxygen=mode==='inside'
      ?pressure*
        Number(document.getElementById('oxygen').value)/100
      :world.o;

    const ratio=Math.max(
      0,
      Math.min(1,oxygen/(101.325*.2095))
    );

    $h('hxPressure').textContent=
      pressure.toFixed(2)+' kPa';

    $h('hxOxygen').textContent=
      'O₂: '+oxygen.toFixed(2)+' kPa';

    $h('hxPbar').style.width=
      Math.min(100,pressure/101.325*100)+'%';

    $h('hxObar').style.width=
      ratio*100+'%';

    $h('hxFlow').style.opacity=
      String(.1+.9*ratio);

    $h('hxFlow').style.animationPlayState=
      oxygen===0?'paused':'running';

    $h('hxStatus').textContent=

      pressure===0

      ?'No modeled ambient pressure or oxygen.'

      :pressure<=6.27

      ?'Extreme low-pressure region: water at body temperature can vaporize.'

      :oxygen<101.325*.2095

      ?'Oxygen partial pressure is below the normal sea-level reference.'

      :'Oxygen is at or above the reference; this does not establish a safe environment.';

    $h('hxOrganTitle').textContent=
      organs[organ][0];

    $h('hxOrganText').textContent=
      organs[organ][1];

    $h('hxTopic').textContent=
      topics[topic].join(' — ');

  }


  /* INTERACTIVE HOTSPOTS */

  function bind(attr,fn){

    root.querySelectorAll('['+attr+']')
      .forEach(el=>{

        const activate=()=>
          fn(el.getAttribute(attr));

        el.addEventListener('click',activate);

        if(el.tagName.toLowerCase()==='g'){

          el.addEventListener('keydown',e=>{

            if(e.key==='Enter'||e.key===' '){

              e.preventDefault();

              activate();

            }

          });

        }

      });

  }


  function select(attr,v){

    root.querySelectorAll('['+attr+']')
      .forEach(el=>{

        el.setAttribute(
          'aria-pressed',
          String(el.getAttribute(attr)===v)
        );

      });

  }


  bind('data-hx-mode',v=>{

    mode=v;

    select('data-hx-mode',v);

    update();

  });


  bind('data-hx-organ',v=>{

    organ=v;

    select('data-hx-organ',v);

    update();

  });


  bind('data-hx-topic',v=>{

    topic=v;

    select('data-hx-topic',v);

    update();

  });


  /* LINK TO HABITAT LAB */

  $h('hxHabitat').onclick=()=>{

    mode='inside';

    select('data-hx-mode',mode);

    document.querySelector(
      '[data-view="human"]'
    ).click();

    document.getElementById(
      'humanTools'
    ).scrollIntoView({

      behavior:matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches?'auto':'smooth',

      block:'center'

    });

    update();

  };


  /* LIVE ATMOSPHERE UPDATES */

  new MutationObserver(update).observe(

    metrics,

    {childList:true}

  );

  select('data-hx-organ',organ);

  update();

})();

/* END OF HUMAN CONSEQUENCE EXPLORER */
