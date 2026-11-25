
/* WHAT IF LAB
   CHEMISTRY — STRANGE LAWS OF MATTER
   Experiments 30–39
*/

export function chemistryLabs(E) {

  const {
    knob, metric, fmt, clamp,
    line, path, circle, glow,
    label, bar, arrow
  } = E;

  const C = {
    blue: "#6acbff",
    green: "#83e8bc",
    gold: "#ffd080",
    red: "#ff8c81",
    purple: "#b5a3ff",
    white: "#e7f3ff"
  };

  const progress = s => clamp(s.t / 8, 0, 1);

  const pct = n => fmt(n * 100, 1) + "%";

  function box(c,x,y,w,h,color) {
    c.fillStyle = color;
    c.fillRect(x,y,w,h);
  }

  function title(c,text) {
    label(c,text,20,24,C.green);
  }

  function vessel(c,x,y,w,h,fill) {

    const g = c.createLinearGradient(x,y,x+w,y);

    g.addColorStop(0,"#375769");
    g.addColorStop(.5,"#142b3a");
    g.addColorStop(1,"#375769");

    box(c,x,y,w,h,g);

    box(
      c,x+4,y+h-h*fill,
      w-8,h*fill,"#267da3"
    );

    line(c,x,y,x,y+h,C.blue,2);
    line(c,x+w,y,x+w,y+h,C.blue,2);
    line(c,x,y+h,x+w,y+h,C.blue,2);

    line(
      c,x+4,y+h-h*fill,
      x+w-4,y+h-h*fill,
      C.blue,2
    );
  }

  function atom(c,x,y,r,color,text) {

    const g = c.createRadialGradient(
      x-r*.3,y-r*.3,1,x,y,r
    );

    g.addColorStop(0,"#ffffff");
    g.addColorStop(.3,color);
    g.addColorStop(1,"#142936");

    circle(c,x,y,r,g,color);

    if(text) {
      label(c,text,x,y+4,C.white,"center");
    }
  }

  function molecule(c,x,y,scale=1) {

    line(c,x,y,x-15*scale,y+13*scale,C.white,3);
    line(c,x,y,x+15*scale,y+13*scale,C.white,3);

    atom(c,x,y,11*scale,C.red,"");
    atom(c,x-15*scale,y+13*scale,7*scale,C.blue,"");
    atom(c,x+15*scale,y+13*scale,7*scale,C.blue,"");
  }

  function reflect(x,w) {
    const a = ((x%(2*w))+2*w)%(2*w);
    return a>w?2*w-a:a;
  }

  const labs = [

    /* 30 — FLAMMABLE WATER */

    {
      id:"flammable-water",
      title:"What if water could burn?",
      label:"Energy & Chemical Stability",

      desc:"Imagine water releasing chemical energy instead of being a stable combustion product.",

      action:"Run fictional energy release",

      knobs:[
        knob("energy","Invented energy release",0,100,5,50,"kJ"),
        knob("mass","Thermal mass",.5,5,.5,1,"kg"),
        knob("loss","Heat lost to surroundings",0,90,5,20,"%")
      ],

      presets:[
        ["Real water",{energy:0}],
        ["Fictional reaction",{energy:50}],
        ["High heat loss",{loss:80}]
      ],

      formula:"ΔT = Q / (mc)",

      explain:"Ordinary water is not a combustible fuel. It is a stable product of hydrogen combustion. This thought experiment assigns an invented energy release to water and explores the resulting heat transfer.",

      note:"Counterfactual model only. Energy is invented and heat capacity is held at 4.18 kJ/kg/K. No real combustion reaction or ignition method is represented.",

      calc:p=>({
        heat:p.energy*(1-p.loss/100),
        rise:p.energy*(1-p.loss/100)/(p.mass*4.18)
      }),

      stats:(p,s,q)=>[
        ["Released energy",fmt(p.energy*progress(s))+" kJ"],
        ["Retained heat",fmt(q.heat*progress(s))+" kJ"],
        ["Temperature rise",fmt(q.rise*progress(s))+" °C"],
        ["Energy lost",fmt(p.energy*p.loss/100*progress(s))+" kJ"]
      ],

      draw:(c,p,s,q)=>{

        title(c,"COUNTERFACTUAL ENERGY RELEASE");

        vessel(c,85,85,220,155,.65);

        const f=progress(s);

        for(let i=0;i<18;i++) {

          const x=105+(i*43)%175;
          const y=155+(i*27)%62;

          molecule(c,x,y,.5);

          if(p.energy>0&&f>0) {

            c.globalAlpha=f*p.energy/100;

            glow(
              c,x,
              125-((i*11+s.t*28)%78),
              3+i%3,C.gold
            );

          }

          c.globalAlpha=1;
        }

        box(c,420,65,32,160,"#233747");

        box(
          c,426,
          219-Math.min(148,q.rise*f*3),
          20,Math.min(148,q.rise*f*3),
          C.red
        );

        circle(c,436,225,20,C.red);

        label(
          c,fmt(q.rise*f)+" °C rise",
          490,150,C.gold
        );

        bar(c,85,272,490,f,C.green,"Energy transfer");

      }
    },

    /* 31 — VANISHING OXYGEN */

    {
      id:"oxygen-disappears",
      title:"What if oxygen disappeared?",
      label:"Atmospheric Chemistry",

      desc:"Remove molecular oxygen from a virtual air chamber and observe changes in gas pressure.",

      action:"Remove oxygen",

      knobs:[
        knob("remove","Oxygen removed",0,100,1,100,"%"),
        knob("pressure","Initial air pressure",50,120,1,101,"kPa")
      ],

      presets:[
        ["Normal air",{remove:0}],
        ["Half the oxygen",{remove:50}],
        ["All oxygen",{remove:100}]
      ],

      formula:"Ptotal = ΣPi · PO₂ = xO₂ × Pinitial",

      explain:"Dry air contains approximately 21 percent oxygen by volume. Removing oxygen from a fixed-volume gas mixture reduces total pressure if temperature is unchanged. Aerobic respiration and ordinary oxygen-dependent combustion would be disrupted.",

      note:"Fixed-volume ideal-gas model. Only free molecular oxygen is removed, not oxygen chemically bound in water, rocks or living tissue. It is not an exposure or survival calculator.",

      calc:p=>({
        o:p.pressure*.2095,
        other:p.pressure*.7905
      }),

      stats:(p,s,q)=>{

        let o=q.o*(1-p.remove/100*progress(s));

        return [
          ["Oxygen partial pressure",fmt(o)+" kPa"],
          ["Total pressure",fmt(o+q.other)+" kPa"],
          ["Oxygen fraction",pct(o/(o+q.other))],
          ["Other gas pressure",fmt(q.other)+" kPa"]
        ];
      },

      draw:(c,p,s,q)=>{

        title(c,"VIRTUAL ATMOSPHERE CHAMBER");

        box(c,35,42,590,195,"#132b3d");

        const gone=p.remove/100*progress(s);

        for(let i=0;i<100;i++) {

          const oxygen=i<21;

          if(oxygen&&i<21*gone)continue;

          const x=48+reflect(
            i*71+s.t*(15+i%6),560
          );

          const y=56+reflect(
            i*43+s.t*(10+i%7),165
          );

          const color=oxygen?C.blue:C.purple;

          atom(c,x-3,y,4,color,"");
          atom(c,x+3,y,4,color,"");
        }

        circle(c,58,254,6,C.blue);
        label(c,"Oxygen",70,258);

        circle(c,185,254,6,C.purple);
        label(c,"Other gases",197,258);

        bar(
          c,380,272,230,
          (q.other+q.o*(1-gone))/p.pressure,
          C.green,"Relative pressure"
        );
      }
    },

    /* 32 — SELF HEALING METAL */

    {
      id:"self-healing-metal",
      title:"What if metals could heal themselves?",
      label:"Materials Chemistry",

      desc:"Create a crack in a virtual metal plate and watch a hypothetical repair mechanism reconnect it.",

      action:"Activate self-repair",

      knobs:[
        knob("damage","Initial crack length",5,100,1,70,"mm"),
        knob("rate","Model repair rate",.1,3,.1,1,"1/hour"),
        knob("hours","Virtual repair time",1,12,1,5,"hours")
      ],

      presets:[
        ["No rapid healing",{rate:.1}],
        ["Rapid repair",{rate:3}],
        ["Major damage",{damage:100}]
      ],

      formula:"L(t) = L₀ exp(−kt)",

      explain:"Some advanced materials can repair certain forms of damage. Metal repair requires appropriate atomic movement and bonding. Imagine a material with an unusually effective autonomous repair process.",

      note:"Invented exponential crack-reduction model. Crack closure does not guarantee recovery of strength, fatigue resistance or structural safety.",

      calc:p=>({
        final:p.damage*Math.exp(-p.rate*p.hours)
      }),

      stats:(p,s,q)=>{

        const h=p.hours*progress(s);
        const left=p.damage*Math.exp(-p.rate*h);

        return [
          ["Remaining crack",fmt(left,3)+" mm"],
          ["Geometric closure",pct(1-left/p.damage)],
          ["Virtual repair time",fmt(h)+" h"],
          ["Final model crack",fmt(q.final,3)+" mm"]
        ];
      },

      draw:(c,p,s)=>{

        title(c,"AUTONOMOUS MATERIAL REPAIR");

        const gradient=c.createLinearGradient(0,50,0,240);

        gradient.addColorStop(0,"#a8b9c7");
        gradient.addColorStop(.5,"#516b80");
        gradient.addColorStop(1,"#273c50");

        box(c,60,55,540,180,gradient);

        const f=Math.exp(
          -p.rate*p.hours*progress(s)
        );

        const length=p.damage/100*160;

        const pts=[];

        for(let i=0;i<=16;i++){

          const y=58+i/16*length;

          pts.push([
            330+Math.sin(i*2.1)*13,y
          ]);

        }

        const count=Math.ceil(17*f);

        if(count>1){

          path(
            c,pts.slice(0,count),
            "#07131c",Math.max(1,8*f)
          );

        }

        for(let i=count;i<17;i++){

          glow(c,pts[i][0],pts[i][1],3,C.green);

        }

        bar(c,60,270,540,1-f,C.green,"Model crack closure");

      }
    },

    /* 33 — SINKING ICE */

    {
      id:"sinking-ice",
      title:"What if ice sank in water?",
      label:"Density & Molecular Structure",

      desc:"Change solid-water density and compare ordinary floating ice with a fictional sinking version.",

      action:"Release both ice cubes",

      knobs:[
        knob("ice","Hypothetical ice density",700,1300,1,1100,"kg/m³"),
        knob("water","Liquid density",950,1100,1,1000,"kg/m³")
      ],

      presets:[
        ["Ordinary ice",{ice:917,water:1000}],
        ["Neutral buoyancy",{ice:1000,water:1000}],
        ["Sinking ice",{ice:1200,water:1000}]
      ],

      formula:"Fb = ρliquid Vsub g",

      explain:"Ice normally floats because its hydrogen-bonded crystal structure is less dense than liquid water. Floating ice can insulate water beneath it. If ice were denser, the freezing behavior of lakes would change substantially.",

      note:"Ideal buoyancy model. The scene does not calculate lake temperature, freezing rate or ecosystem survival. Motion is illustrative.",

      calc:p=>({
        ratio:p.ice/p.water
      }),

      stats:(p,s,q)=>[
        ["Density ratio",fmt(q.ratio,3)],
        ["Model outcome",q.ratio>1?"Sinks":q.ratio===1?"Neutral":"Floats"],
        ["Resting submerged fraction",pct(Math.min(1,q.ratio))],
        ["Fully immersed force balance",fmt((p.water-p.ice)*9.81/1000)+" N/L"]
      ],

      draw:(c,p,s,q)=>{

        title(c,"NORMAL ICE VS ALTERED ICE");

        function tank(x,density,name){

          vessel(c,x,65,255,185,.65);

          const r=density/p.water;
          const f=progress(s);
          const surface=250-185*.65;

          const target=r>1
            ?200
            :r===1
              ?surface+15
              :surface-50*(1-r);

          const y=35+(target-35)*f;

          const ice=c.createLinearGradient(
            x+100,y,x+150,y+50
          );

          ice.addColorStop(0,"#e5ffff");
          ice.addColorStop(1,"#6bb6d8");

          box(c,x+102,y,50,50,ice);

          line(c,x+102,y,x+152,y+50,"#c5efff");

          line(c,x+152,y,x+102,y+50,"#c5efff");

          label(c,name,x+127,280,C.white,"center");

        }

        tank(40,917,"ORDINARY ICE");
        tank(365,p.ice,"ALTERED ICE");

      }
    },

    /* 34 — NO EVAPORATION */

    {
      id:"no-evaporation",
      title:"What if water never evaporated?",
      label:"Phase Changes & Water Cycle",

      desc:"Compare a normal water reservoir with one whose evaporation has been switched off.",

      action:"Run water-cycle comparison",

      knobs:[
        knob("water","Initial water mass",20,100,5,80,"kg"),
        knob("rate","Normal evaporation rate",0,5,.25,2,"kg/h"),
        knob("hours","Virtual elapsed time",1,24,1,12,"hours")
      ],

      presets:[
        ["Humid model",{rate:.25}],
        ["Rapid loss model",{rate:5}],
        ["Long dry period",{hours:24}]
      ],

      formula:"M(t) = max(0, M₀ − rt)",

      explain:"Evaporation transfers water from surfaces into the atmosphere. Without it, the supply of water vapor for clouds and precipitation would be disrupted.",

      note:"Local constant-rate mass-balance model with no rain, inflow or condensation. It is not a global weather forecast.",

      calc:p=>({
        loss:Math.min(p.water,p.rate*p.hours)
      }),

      stats:(p,s,q)=>{

        const h=p.hours*progress(s);
        const lost=Math.min(p.water,p.rate*h);

        return [
          ["Normal water remaining",fmt(p.water-lost)+" kg"],
          ["Altered water remaining",fmt(p.water)+" kg"],
          ["Normal vapor produced",fmt(lost)+" kg"],
          ["Virtual time",fmt(h)+" h"]
        ];
      },

      draw:(c,p,s)=>{

        title(c,"TWO DIFFERENT WATER CYCLES");

        const f=progress(s);

        const normal=Math.max(
          0,p.water-p.rate*p.hours*f
        );

        for(let j=0;j<2;j++){

          const x=40+j*325;

          const fill=j?p.water/100:normal/100;

          vessel(c,x,95,255,145,fill);

          if(j===0&&normal>0){

            for(let i=0;i<20;i++){

              c.globalAlpha=Math.min(1,p.rate/5);

              const y=95-((i*17+s.t*25)%55);

              circle(
                c,x+20+(i*49)%215,
                y,2,C.blue
              );

            }

            c.globalAlpha=1;

          }

          label(
            c,j?"NO EVAPORATION":"NORMAL EVAPORATION",
            x+127,270,C.white,"center"
          );

        }

      }
    },

    /* 35 — INSTANT DIAMOND */

    {
      id:"overnight-diamonds",
      title:"What if diamonds grew overnight?",
      label:"Crystal Chemistry",

      desc:"Watch a hypothetical diamond crystal increase in size and explore its changing mass.",

      action:"Grow virtual crystal",

      knobs:[
        knob("seed","Initial crystal edge",.1,2,.1,.5,"mm"),
        knob("rate","Invented edge growth rate",0,1,.05,.2,"mm/h"),
        knob("hours","Growth time",1,12,1,8,"hours")
      ],

      presets:[
        ["Tiny seed",{seed:.1}],
        ["No growth",{rate:0}],
        ["Fictional overnight growth",{rate:.8,hours:8}]
      ],

      formula:"L = L₀ + rt · m = ρL³",

      explain:"Diamond is a three-dimensional network of tetrahedrally bonded carbon atoms. Crystal growth requires adding atoms to an existing structure under suitable conditions.",

      note:"Invented linear growth rate and cubic crystal geometry. Diamond density is approximately 3.51 g/cm³. This is not a synthesis procedure or real growth forecast.",

      calc:p=>({
        edge:p.seed+p.rate*p.hours
      }),

      stats:(p,s,q)=>{

        const h=p.hours*progress(s);
        const edge=p.seed+p.rate*h;
        const mass=3.51*edge**3;

        return [
          ["Model crystal edge",fmt(edge,3)+" mm"],
          ["Crystal mass",fmt(mass,4)+" mg"],
          ["Carat equivalent",fmt(mass/200,4)+" ct"],
          ["Final edge length",fmt(q.edge)+" mm"]
        ];
      },

      draw:(c,p,s)=>{

        title(c,"FICTIONAL CRYSTAL GROWTH");

        const edge=p.seed+p.rate*p.hours*progress(s);
        const r=20+Math.min(85,edge*8);
        const x=180,y=150;

        const facets=[
          [[x-r,y-20],[x,y-r],[x,y-20]],
          [[x,y-r],[x+r,y-20],[x,y-20]],
          [[x-r,y-20],[x,y-20],[x,y+r]],
          [[x+r,y-20],[x,y-20],[x,y+r]]
        ];

        facets.forEach((pts,i)=>{

          c.beginPath();

          pts.forEach(([a,b],j)=>
            j?c.lineTo(a,b):c.moveTo(a,b)
          );

          c.closePath();

          c.fillStyle=[
            "#b3e6ff","#568cba",
            "#719cc7","#d9f7ff"
          ][i];

          c.fill();
          c.strokeStyle="#effcff";
          c.stroke();

        });

        const center=[480,145];

        const nodes=[
          [480,65],[405,160],
          [550,160],[485,220]
        ];

        nodes.forEach(([a,b])=>{

          line(c,center[0],center[1],a,b,C.blue,3);
          atom(c,a,b,14,C.blue,"C");

        });

        atom(c,480,145,17,C.purple,"C");

        label(c,"CRYSTAL",180,275,C.white,"center");
        label(c,"TETRAHEDRAL BONDING",480,275,C.white,"center");

      }
    },

    /* 36 — MOLECULAR MOTION */

    {
      id:"frozen-molecules",
      title:"What if molecules stopped moving?",
      label:"Kinetic Molecular Theory",

      desc:"Cool a virtual gas chamber and compare molecular motion with its original state.",

      action:"Cool the gas",

      knobs:[
        knob("temp","Final temperature",1,600,1,50,"K"),
        knob("mass","Molar mass",4,44,1,28,"g/mol")
      ],

      presets:[
        ["Room temperature",{temp:293}],
        ["Cryogenic model",{temp:77}],
        ["Near absolute zero",{temp:1}]
      ],

      formula:"vrms = √(3RT/M) · KE = 3kT/2",

      explain:"An ideal gas has lower average translational kinetic energy at lower absolute temperature. Classical kinetic theory predicts motion approaching zero as temperature approaches zero.",

      note:"Ideal-gas extrapolation only. Real gases may condense or freeze, quantum motion can remain, and absolute zero cannot be reached by a finite cooling process.",

      calc:p=>({
        finalSpeed:Math.sqrt(
          3*8.314*p.temp/(p.mass/1000)
        )
      }),

      stats:(p,s,q)=>{

        const t=293+(p.temp-293)*progress(s);

        return [
          ["Current temperature",fmt(t)+" K"],
          ["RMS molecular speed",fmt(Math.sqrt(3*8.314*t/(p.mass/1000)))+" m/s"],
          ["Mean translational energy",(1.5*1.380649e-23*t).toExponential(2)+" J"],
          ["Final model speed",fmt(q.finalSpeed)+" m/s"]
        ];
      },

      draw:(c,p,s)=>{

        title(c,"THERMAL MOTION COMPARISON");

        const current=293+(p.temp-293)*progress(s);

        for(let j=0;j<2;j++){

          const x=35+j*325;

          const temp=j?current:293;

          const startSpeed=Math.sqrt(293/293*28/p.mass);
          const endSpeed=Math.sqrt(temp/293*28/p.mass);

          const travel=s.t*(j
            ?(startSpeed+endSpeed)/2
            :startSpeed);

          box(c,x,55,265,185,"#132c3e");

          for(let i=0;i<34;i++){

            const px=x+12+reflect(
              i*73+travel*(30+i%9),241
            );

            const py=67+reflect(
              i*47+travel*(20+i%6),161
            );

            atom(
              c,px,py,5,
              j?C.blue:C.gold,""
            );

          }

          label(
            c,fmt(temp,0)+" K",
            x+132,270,C.white,"center"
          );

        }

      }
    },

    /* 37 — UNIVERSAL SOLVENT */

    {
      id:"universal-solvent",
      title:"What if water dissolved everything?",
      label:"Solubility & Saturation",

      desc:"Add virtual solute to water and see dissolved particles compete with solid sediment.",

      action:"Mix solution",

      knobs:[
        knob("water","Water mass",100,500,25,200,"g"),
        knob("solute","Solute added",10,400,10,250,"g"),
        knob("limit","Model solubility",5,200,5,40,"g/100g water")
      ],

      presets:[
        ["Low solubility",{limit:10}],
        ["High solubility",{limit:200}],
        ["Excess solute",{solute:400}]
      ],

      formula:"Maximum dissolved mass = S × water mass / 100",

      explain:"A solvent can dissolve particular substances up to a concentration determined by chemical interactions and conditions. Water is useful for dissolving many ionic and polar substances, but it cannot dissolve everything.",

      note:"Generic solute with an adjustable equilibrium solubility. Mixing time is schematic, not measured dissolution kinetics.",

      calc:p=>({
        capacity:p.water*p.limit/100,
        dissolved:Math.min(p.solute,p.water*p.limit/100)
      }),

      stats:(p,s,q)=>{

        const d=q.dissolved*progress(s);

        return [
          ["Dissolved mass",fmt(d)+" g"],
          ["Undissolved mass",fmt(p.solute-d)+" g"],
          ["Equilibrium capacity",fmt(q.capacity)+" g"],
          ["Final state",p.solute>=q.capacity?"Saturated":"Unsaturated"]
        ];
      },

      draw:(c,p,s,q)=>{

        title(c,"MOLECULAR DISSOLUTION");

        vessel(c,65,55,320,200,.8);

        const d=q.dissolved*progress(s);
        const fraction=d/p.solute;

        for(let i=0;i<80;i++){

          if(i<80*fraction){

            const x=80+reflect(
              i*73+s.t*15,290
            );

            const y=105+reflect(
              i*49+s.t*12,132
            );

            atom(c,x,y,4,C.gold,"");

          }else{

            const x=83+(i*19)%284;
            const y=245-Math.floor(i/15)*7;

            circle(c,x,y,4,C.gold);

          }

        }

        bar(c,425,105,190,fraction,C.green,"Dissolved fraction");

        bar(c,425,175,190,1-fraction,C.gold,"Solid fraction");

        label(c,"Solute mass conserved",420,245,C.white);

      }
    },

    /* 38 — NEVER ENDING REACTION */

    {
      id:"endless-reaction",
      title:"What if chemical reactions never stopped?",
      label:"Chemical Equilibrium",

      desc:"Watch molecules switch between reactant and product even after their concentrations stabilize.",

      action:"Start reversible reaction",

      knobs:[
        knob("forward","Forward rate constant",.1,2,.1,1,"1/s"),
        knob("reverse","Reverse rate constant",.1,2,.1,.5,"1/s")
      ],

      presets:[
        ["Product favored",{forward:2,reverse:.2}],
        ["Equal equilibrium",{forward:1,reverse:1}],
        ["Reactant favored",{forward:.2,reverse:2}]
      ],

      formula:"A ⇌ B · Beq = kf/(kf+kr)",

      explain:"Reversible reactions can continue in both directions at dynamic equilibrium. The forward and reverse rates become equal, so the average concentrations no longer change.",

      note:"Closed, normalized, reversible first-order reaction model. No perpetual net production of matter or energy is implied.",

      calc:p=>({
        eq:p.forward/(p.forward+p.reverse)
      }),

      stats:(p,s,q)=>{

        const b=q.eq*(
          1-Math.exp(-(p.forward+p.reverse)*s.t)
        );

        return [
          ["Reactant A",pct(1-b)],
          ["Product B",pct(b)],
          ["Forward flux",fmt(p.forward*(1-b),3)+" /s"],
          ["Reverse flux",fmt(p.reverse*b,3)+" /s"]
        ];
      },

      draw:(c,p,s,q)=>{

        title(c,"DYNAMIC EQUILIBRIUM");

        box(c,35,50,280,140,"#132b3d");

        const b=q.eq*(
          1-Math.exp(-(p.forward+p.reverse)*s.t)
        );

        for(let i=0;i<48;i++){

          const j=(i+Math.floor(s.t*5))%48;

          atom(
            c,
            50+reflect(i*41+s.t*12,250),
            65+reflect(i*27+s.t*17,110),
            6,j<48*b?C.gold:C.blue,""
          );

        }

        line(c,355,55,355,235,C.white);
        line(c,355,235,625,235,C.white);

        for(let mode=0;mode<2;mode++){

          const pts=[];

          for(let i=0;i<=80;i++){

            const t=i/10;

            const y=q.eq*(
              1-Math.exp(-(p.forward+p.reverse)*t)
            );

            pts.push([
              355+i/80*270,
              235-(mode?y:1-y)*175
            ]);

          }

          path(c,pts,mode?C.gold:C.blue,2);

        }

        line(
          c,355+progress(s)*270,55,
          355+progress(s)*270,235,
          C.green,2,[4,4]
        );

        label(c,"A",370,48,C.blue);
        label(c,"B",400,48,C.gold);

        bar(c,35,225,280,1-b,C.blue,"Reactant");

        bar(c,35,270,280,b,C.gold,"Product");

      }
    },

    /* 39 — TWO-BOND CARBON */

    {
      id:"two-bond-carbon",
      title:"What if carbon could form only two bonds?",
      label:"Organic Chemistry",

      desc:"Build an abstract molecular network and compare chains with branched carbon structures.",

      action:"Assemble carbon network",

      knobs:[
        knob("bonds","Maximum single-bond neighbors",2,4,1,2,"neighbors"),
        knob("atoms","Carbon atoms",4,16,1,12,"atoms")
      ],

      presets:[
        ["Two neighbors",{bonds:2}],
        ["Three neighbors",{bonds:3}],
        ["Four neighbors",{bonds:4}]
      ],

      formula:"Maximum graph degree = allowed neighbor count",

      explain:"Carbon normally has four valence bonds and can form chains, rings and branches. In a hypothetical single-bond network limited to two neighbors, connected structures could form paths or rings, but not branching junctions.",

      note:"Graph-theory thought experiment. It ignores bond order, hydrogen, charge, molecular geometry and stability. It is not a prediction of actual molecules.",

      calc:p=>{

        const nodes=[];
        const edges=[];

        for(let i=0;i<p.atoms;i++){

          if(p.bonds===2){

            nodes.push([
              45+i/(p.atoms-1)*570,
              145+(i%2)*30
            ]);

            if(i>0)edges.push([i-1,i]);

          }else{

            const parent=i===0
              ?-1
              :1+Math.floor(
                (i-1-p.bonds)/(p.bonds-1)
              );

            const par=Math.max(0,parent);

            nodes.push([
              80+(i%5)*125,
              70+Math.floor(i/5)*70
            ]);

            if(i>0)edges.push([par,i]);

          }

        }

        const degrees=nodes.map(()=>0);

        edges.forEach(([a,b])=>{

          degrees[a]++;
          degrees[b]++;

        });

        return {
          nodes,edges,degrees,
          branches:degrees.filter(d=>d>=3).length
        };

      },

      stats:(p,s,q)=>[
        ["Carbon atoms",String(p.atoms)],
        ["Bonds in final model",String(q.edges.length)],
        ["Branching junctions",String(q.branches)],
        ["Maximum allowed neighbors",String(p.bonds)]
      ],

      draw:(c,p,s,q)=>{

        title(c,"ASSEMBLING A CARBON NETWORK");

        const count=Math.max(
          1,Math.floor(p.atoms*progress(s))
        );

        q.edges.forEach(([a,b])=>{

          if(a>=count||b>=count)return;

          line(
            c,...q.nodes[a],...q.nodes[b],
            C.blue,3
          );

        });

        q.nodes.forEach(([x,y],i)=>{

          if(i>=count)return;

          atom(
            c,x,y,12,
            q.degrees[i]>=3?C.gold:C.purple,
            "C"
          );

        });

        label(
          c,p.bonds===2
            ?"CHAIN STRUCTURE — NO BRANCHING"
            :"BRANCHING STRUCTURE",
          330,280,C.green,"center"
        );

      }
    }

  ];

  /* REGISTER CHEMISTRY PACK */

  labs.forEach((lab,i)=>{

    lab.number=String(i+30);

    lab.category="chemistry";

    lab.duration=()=>8;

  });

  return labs;

}

/* END OF CHEMISTRY PACK */
