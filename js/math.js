
/* WHAT IF LAB
   MATHEMATICS — BEYOND INTUITION
   Experiments 40–49
*/

export function mathLabs(E) {

  const {
    knob, metric, fmt, clamp,
    line, path, circle, glow,
    label, bar, arrow
  } = E;

  const C = {
    blue:"#73b9ff",
    cyan:"#6be5db",
    gold:"#ffd080",
    purple:"#b9a5ff",
    red:"#ff8795",
    white:"#eaf4ff",
    muted:"#92a8c4"
  };

  const TAU = Math.PI*2;
  const rad = a=>a*Math.PI/180;
  const pct = n=>fmt(n*100,1)+"%";
  const progress = s=>clamp(s.t/8,0,1);

  function box(c,x,y,w,h,color){
    c.fillStyle=color;
    c.fillRect(x,y,w,h);
  }

  function heading(c,text){
    label(c,text,20,24,C.cyan);
  }

  function grid(c,x,y,w,h,step=25){

    box(c,x,y,w,h,"#0c1929");

    for(let i=0;i<=w;i+=step){
      line(c,x+i,y,x+i,y+h,"#20334a");
    }

    for(let i=0;i<=h;i+=step){
      line(c,x,y+i,x+w,y+i,"#20334a");
    }

  }

  function polygon(c,pts,color,stroke){

    if(!pts.length)return;

    c.beginPath();

    pts.forEach(([x,y],i)=>
      i?c.lineTo(x,y):c.moveTo(x,y)
    );

    c.closePath();

    if(color){
      c.fillStyle=color;
      c.fill();
    }

    if(stroke){
      c.strokeStyle=stroke;
      c.lineWidth=1.5;
      c.stroke();
    }

  }

  const labs = [

    /* 40 — FOUR DIMENSIONS */

    {
      id:"four-dimensional-world",
      title:"What if we lived in four dimensions?",
      label:"4D Geometry",

      desc:"Rotate a four-dimensional hypercube and observe its projection into familiar dimensions.",

      action:"Rotate the tesseract",

      knobs:[
        knob("angle","Fourth-dimensional rotation",0,360,1,25,"°"),
        knob("speed","Rotation speed",0,2,.1,.7,"×"),
        knob("distance","Projection distance",2.5,6,.1,3.5,"units")
      ],

      presets:[
        ["Classic tesseract",{angle:0,speed:.5}],
        ["4D rotation",{angle:45,speed:1}],
        ["Strong perspective",{distance:2.5}]
      ],

      formula:"A hypercube has 2ⁿ vertices and n × 2ⁿ⁻¹ edges.",

      explain:"A tesseract is the four-dimensional equivalent of a cube. Its fourth spatial coordinate is called w. Rotation in the x-w plane changes the projected shape without changing the original four-dimensional object.",

      note:"This is a 2D projection of a 4D mathematical object, not a physical fourth-dimensional world.",

      calc:p=>({vertices:16,edges:32}),

      stats:(p,s,q)=>[
        ["Dimensions","4"],
        ["Vertices",String(q.vertices)],
        ["Edges",String(q.edges)],
        ["Cubic cells","8"]
      ],

      draw:(c,p,s)=>{

        heading(c,"HYPERCUBE / FOUR-DIMENSIONAL ROTATION");

        const a=rad(p.angle)+s.t*p.speed;
        const b=s.t*p.speed*.5+.5;

        const vertices=[];

        for(let i=0;i<16;i++){

          const x=(i&1)?1:-1;
          const y=(i&2)?1:-1;
          const z=(i&4)?1:-1;
          const w=(i&8)?1:-1;

          const X=x*Math.cos(a)-w*Math.sin(a);
          const W=x*Math.sin(a)+w*Math.cos(a);

          const f=p.distance/(p.distance-W);

          const Y=y*Math.cos(b)-z*Math.sin(b);
          const Z=y*Math.sin(b)+z*Math.cos(b);

          vertices.push([
            330+X*f*43+Z*f*22,
            150+Y*f*43-Z*f*15
          ]);

        }

        for(let i=0;i<16;i++){

          for(let axis=0;axis<4;axis++){

            const j=i^(1<<axis);

            if(j<i)continue;

            line(
              c,...vertices[i],...vertices[j],
              axis===3?C.gold:
              (i&8)?C.purple:C.cyan,
              1.7
            );

          }

        }

        vertices.forEach(([x,y],i)=>
          glow(c,x,y,3,(i&8)?C.purple:C.cyan)
        );

        label(c,"Cubic edges",30,275,C.cyan);
        label(c,"Fourth-axis edges",480,275,C.gold);

      }
    },

    /* 41 — HILBERT'S HOTEL */

    {
      id:"infinity-hotel",
      title:"What if infinity had a hotel?",
      label:"Infinity & Set Theory",

      desc:"Move guests inside a fully occupied infinite hotel and discover why infinity behaves differently.",

      action:"Make room for new guests",

      knobs:[
        knob("guests","New arriving guests",1,5,1,1,"guests"),
        knob("mode","Arrival type",0,1,1,0,"0 finite / 1 infinite")
      ],

      presets:[
        ["One new guest",{guests:1,mode:0}],
        ["Five new guests",{guests:5,mode:0}],
        ["Infinitely many guests",{mode:1}]
      ],

      formula:"Finite arrivals: n → n + k. Infinite arrivals: n → 2n.",

      explain:"Hilbert's Hotel has infinitely many occupied rooms. Moving every guest from room n to n+k frees k rooms. Moving everyone to room 2n leaves all odd-numbered rooms available for infinitely many new guests.",

      note:"Only the first ten rooms and some guests are shown. A real hotel cannot contain infinitely many rooms or complete infinitely many moves.",

      calc:p=>({shift:p.guests}),

      stats:(p,s,q)=>[
        ["Total rooms","Countably infinite"],
        ["New guests",p.mode?"Infinite":String(p.guests)],
        ["Room mapping",p.mode?"n → 2n":"n → n + "+p.guests],
        ["Empty rooms created",p.mode?"Infinite":String(p.guests)]
      ],

      draw:(c,p,s)=>{

        heading(c,"HILBERT'S INFINITE HOTEL");

        const f=progress(s);

        const roomX=n=>45+(n-1)*58;

        for(let n=1;n<=10;n++){

          const x=roomX(n);

          box(c,x,105,49,100,"#263b50");

          box(c,x+6,125,37,72,"#101e30");

          label(c,String(n),x+24,117,C.white,"center");

          circle(c,x+35,177,2,C.gold);

        }

        label(c,"...",645,157,C.white,"center");

        for(let n=1;n<=10;n++){

          const dest=p.mode?2*n:n+p.guests;

          const x=roomX(n)+24+
            (dest-n)*58*f;

          if(x>650)continue;

          const y=160-45*Math.sin(Math.PI*f);

          circle(c,x,y,10,C.cyan);

          label(c,String(n),x,y+4,"#102032","center");

        }

        for(let i=0;i<5;i++){

          const n=p.mode?2*i+1:i+1;

          if(!p.mode&&i>=p.guests)break;

          const x=roomX(n)+24;

          if(f>.75){

            circle(
              c,x,245-85*(f-.75)/.25,
              10,C.gold
            );

          }else{

            circle(c,x,245,10,C.gold);

          }

        }

        label(c,"Existing guests",30,285,C.cyan);
        label(c,"New arrivals",480,285,C.gold);

      }
    },

    /* 42 — PARALLEL LINES */

    {
      id:"parallel-lines-meet",
      title:"What if parallel lines could meet?",
      label:"Projective Geometry",

      desc:"Change viewing perspective and observe how parallel railway tracks appear to converge.",

      action:"Change viewing perspective",

      knobs:[
        knob("depth","Viewing depth",5,200,5,100,"units"),
        knob("width","Track separation",1,5,.1,2,"units"),
        knob("height","Observer height",1,5,.1,2,"units")
      ],

      presets:[
        ["Nearby tracks",{depth:10}],
        ["Far horizon",{depth:200}],
        ["Wide tracks",{width:5}]
      ],

      formula:"Projected separation = f × W / Z",

      explain:"Parallel lines in Euclidean space never intersect. In perspective projection, their apparent separation decreases with depth. Projective geometry represents their common direction using a point at infinity.",

      note:"The tracks remain parallel in physical space. Their vanishing point is a feature of projection.",

      calc:p=>({
        separation:200*p.width/p.depth
      }),

      stats:(p,s,q)=>[
        ["Physical separation",fmt(p.width)+" units"],
        ["Viewing depth",fmt(p.depth)+" units"],
        ["Projected separation",fmt(q.separation)+" px"],
        ["Physical intersection","None"]
      ],

      draw:(c,p,s)=>{

        heading(c,"PERSPECTIVE / VANISHING POINT");

        const depth=5+(p.depth-5)*progress(s);

        const horizon=75;

        const project=(x,z)=>[
          330+200*x/z,
          horizon+200*p.height/z
        ];

        box(c,0,horizon,660,225,"#253943");

        line(c,0,horizon,660,horizon,C.muted);

        for(let z=5;z<=depth;z+=3){

          const A=project(-p.width*.65,z);
          const B=project(p.width*.65,z);

          line(c,...A,...B,"#8c8079",3);

        }

        [-1,1].forEach(sign=>{

          line(
            c,...project(sign*p.width/2,5),
            ...project(sign*p.width/2,depth),
            C.white,3
          );

          line(
            c,...project(sign*p.width/2,depth),
            330,horizon,C.gold,1,[5,5]
          );

        });

        glow(c,330,horizon,5,C.gold);

        label(c,"Vanishing point",340,horizon-12,C.gold);

        label(c,"Euclidean tracks remain parallel",330,280,C.white,"center");

      }
    },

    /* 43 — KOCH SNOWFLAKE */

    {
      id:"infinite-perimeter",
      title:"What if a shape had infinite perimeter?",
      label:"Fractals",

      desc:"Build a Koch snowflake and explore how its perimeter grows while its enclosed area remains finite.",

      action:"Build the fractal",

      knobs:[
        knob("level","Fractal iterations",0,5,1,4,"iterations"),
        knob("side","Initial triangle side",1,10,.5,3,"units")
      ],

      presets:[
        ["Original triangle",{level:0}],
        ["Complex fractal",{level:5}],
        ["Early growth",{level:2}]
      ],

      formula:"Pₙ = 3a(4/3)ⁿ · Aₙ = A₀[8/5 − 3/5(4/9)ⁿ]",

      explain:"Every segment of a Koch snowflake is replaced by four segments, each one-third as long. Repeating the process makes its perimeter grow without bound, while its area approaches a finite limit.",

      note:"The animation shows up to five finite iterations. Infinite perimeter is a mathematical limit, not a completed physical drawing.",

      calc:p=>({
        base:Math.sqrt(3)*p.side**2/4
      }),

      stats:(p,s,q)=>{

        const n=Math.round(p.level*progress(s));

        return [
          ["Segments",String(3*4**n)],
          ["Perimeter",fmt(3*p.side*(4/3)**n)+" units"],
          ["Area",fmt(q.base*(1.6-.6*(4/9)**n))+" units²"],
          ["Limiting area",fmt(q.base*1.6)+" units²"]
        ];

      },

      draw:(c,p,s)=>{

        heading(c,"KOCH SNOWFLAKE / FRACTAL GROWTH");

        const n=Math.round(p.level*progress(s));

        let pts=[
          [330,46],[220+220,235],
          [220,235],[330,46]
        ];

        for(let step=0;step<n;step++){

          const next=[];

          for(let i=0;i<pts.length-1;i++){

            const [x,y]=pts[i];
            const [X,Y]=pts[i+1];

            const dx=(X-x)/3;
            const dy=(Y-y)/3;

            next.push(
              [x,y],
              [x+dx,y+dy],
              [
                x+1.5*dx+Math.sqrt(3)/2*dy,
                y+1.5*dy-Math.sqrt(3)/2*dx
              ],
              [x+2*dx,y+2*dy]
            );

          }

          next.push(pts[pts.length-1]);

          pts=next;

        }

        polygon(c,pts,"#193e50",C.cyan);

        label(c,"Iteration "+n,25,265,C.gold);

        label(c,fmt(3*4**n,0)+" edges",635,265,C.white,"right");

      }
    },

    /* 44 — EXPONENTIAL PAPER FOLDING */

    {
      id:"paper-folding-42",
      title:"What if you folded paper 42 times?",
      label:"Exponential Growth",

      desc:"Double the thickness of paper repeatedly and compare it with astronomical distances.",

      action:"Start folding",

      knobs:[
        knob("folds","Number of folds",0,50,1,42,"folds"),
        knob("thickness","Initial thickness",.05,.2,.01,.1,"mm")
      ],

      presets:[
        ["Ten folds",{folds:10}],
        ["Reach Moon scale",{folds:42,thickness:.1}],
        ["Fifty folds",{folds:50}]
      ],

      formula:"T = T₀ × 2ⁿ",

      explain:"Each ideal fold doubles the paper thickness. At 42 folds, paper initially 0.1 mm thick would have a mathematical thickness of about 440,000 km, exceeding the average Earth-Moon distance.",

      note:"Ideal exponential model. Actual folding is constrained by paper size, strength, compression and the force required.",

      calc:p=>({
        final:p.thickness*2**p.folds/1e6
      }),

      stats:(p,s,q)=>{

        const n=Math.round(p.folds*progress(s));
        const mm=p.thickness*2**n;
        const km=mm/1e6;

        return [
          ["Completed folds",String(n)],
          ["Thickness",km>=1?fmt(km)+" km":fmt(mm,3)+" mm"],
          ["Earth-Moon distance",pct(km/384400)],
          ["Final thickness",fmt(q.final,4)+" km"]
        ];

      },

      draw:(c,p,s)=>{

        heading(c,"EXPONENTIAL GROWTH / LOG SCALE");

        const n=Math.round(p.folds*progress(s));

        const x=v=>50+clamp(
          (Math.log10(Math.max(v,1e-8))+8)/14,
          0,1
        )*550;

        const km=p.thickness*2**n/1e6;

        line(c,50,155,600,155,C.muted,2);

        const landmarks=[
          [1e-6,"1 mm"],
          [.001,"1 m"],
          [1,"1 km"],
          [12742,"Earth diameter"],
          [384400,"Moon distance"]
        ];

        landmarks.forEach(([v,name],i)=>{

          const X=x(v);
          const y=i%2?205:110;

          line(c,X,155,X,y,C.muted);

          label(c,name,X,y+(i%2?17:-8),C.white,"center");

        });

        line(c,50,155,x(km),155,C.cyan,5);

        glow(c,x(km),155,8,C.gold);

        for(let i=0;i<Math.min(n+1,18);i++){

          box(c,28+i*2,35+i*2,45,3,C.blue);

        }

        label(c,"Folds: "+n,105,60,C.cyan);

        label(c,"Distances shown logarithmically",330,280,C.muted,"center");

      }
    },

    /* 45 — FIBONACCI NATURE */

    {
      id:"fibonacci-world",
      title:"What if the world followed Fibonacci?",
      label:"Sequences & Natural Patterns",

      desc:"Explore Fibonacci ratios and change the angle of a growing sunflower-like mathematical pattern.",

      action:"Grow the spiral pattern",

      knobs:[
        knob("points","Number of seeds",30,240,10,180,"seeds"),
        knob("angle","Angle between seeds",90,180,.01,137.51,"°"),
        knob("index","Fibonacci index",2,18,1,12,"n")
      ],

      presets:[
        ["Golden angle",{angle:137.51}],
        ["Right angle",{angle:90}],
        ["Three-way pattern",{angle:120}]
      ],

      formula:"Fₙ = Fₙ₋₁ + Fₙ₋₂ · φ = (1 + √5)/2",

      explain:"Ratios between successive Fibonacci numbers approach the golden ratio. A divergence angle of about 137.5 degrees produces a well-distributed spiral pattern, similar to patterns found in some plants.",

      note:"The seed pattern is a mathematical phyllotaxis model. Fibonacci numbers do not govern every natural form.",

      calc:p=>{

        const f=[0,1];

        for(let i=2;i<=p.index+1;i++){
          f.push(f[i-1]+f[i-2]);
        }

        return {
          f,
          ratio:f[p.index+1]/f[p.index]
        };

      },

      stats:(p,s,q)=>[
        ["Fibonacci number",String(q.f[p.index])],
        ["Next number",String(q.f[p.index+1])],
        ["Successive ratio",fmt(q.ratio,6)],
        ["Golden ratio",fmt((1+Math.sqrt(5))/2,6)]
      ],

      draw:(c,p,s,q)=>{

        heading(c,"PHYLLOTAXIS / GOLDEN ANGLE");

        circle(c,210,150,115,"#122e2c","#3e7864");

        const n=Math.max(
          1,Math.round(p.points*progress(s))
        );

        for(let i=0;i<n;i++){

          const a=i*rad(p.angle);
          const r=109*Math.sqrt(i/p.points);

          const x=210+r*Math.cos(a);
          const y=150+r*Math.sin(a);

          circle(
            c,x,y,3.5,
            i%2?C.gold:C.cyan
          );

        }

        label(c,"FIBONACCI SEQUENCE",410,65,C.cyan);

        q.f.slice(-6).forEach((v,i)=>{

          label(c,String(v),415,95+i*27,C.white);

          bar(
            c,470,90+i*27,150,
            v/q.f[q.f.length-1],
            C.purple,""
          );

        });

        label(c,"Divergence: "+fmt(p.angle)+"°",210,285,C.gold,"center");

      }
    },

    /* 46 — MONTY HALL PROBLEM */

    {
      id:"monty-hall-paradox",
      title:"What if probability could deceive you?",
      label:"Probability & Statistics",

      desc:"Play a simulated three-door game and compare the winning rates of staying and switching.",

      action:"Run repeated games",

      knobs:[
        knob("trials","Number of games",10,1000,10,300,"games"),
        knob("seed","Random sequence seed",1,99,1,12,"seed")
      ],

      presets:[
        ["Small sample",{trials:10}],
        ["100 games",{trials:100}],
        ["1000 games",{trials:1000}]
      ],

      formula:"P(stay wins) = 1/3 · P(switch wins) = 2/3",

      explain:"You choose one of three doors. A host who knows the prize location opens an unchosen losing door and always offers a switch. Switching wins whenever the original choice was wrong, which happens with probability two-thirds.",

      note:"The host must follow these rules. The simulated results vary with sample size and random seed.",

      calc:p=>{

        let seed=p.seed>>>0;

        const random=()=>{

          seed=(Math.imul(1664525,seed)+1013904223)>>>0;

          return seed/4294967296;

        };

        const games=[];
        const wins=[0];

        for(let i=0;i<p.trials;i++){

          const prize=Math.floor(random()*3);
          const pick=Math.floor(random()*3);

          const options=[0,1,2].filter(
            d=>d!==prize&&d!==pick
          );

          const open=options[
            Math.floor(random()*options.length)
          ];

          games.push({prize,pick,open});

          wins.push(wins[i]+Number(prize===pick));

        }

        return {games,wins};

      },

      stats:(p,s,q)=>{

        const n=Math.floor(p.trials*progress(s));
        const stay=q.wins[n];
        const change=n-stay;

        return [
          ["Games played",String(n)],
          ["Stay win rate",n?pct(stay/n):"—"],
          ["Switch win rate",n?pct(change/n):"—"],
          ["Theory","33.3% / 66.7%"]
        ];

      },

      draw:(c,p,s,q)=>{

        heading(c,"MONTY HALL / STAY VS SWITCH");

        const n=Math.floor(p.trials*progress(s));

        const game=q.games[Math.max(0,n-1)];

        for(let i=0;i<3;i++){

          const x=40+i*105;

          box(c,x,70,85,145,
            i===game.open?"#0a1422":"#405877"
          );

          label(c,"DOOR "+(i+1),x+42,60,C.white,"center");

          if(i===game.open){

            label(c,"EMPTY",x+42,145,C.muted,"center");

          }else if(n>0&&i===game.prize){

            glow(c,x+42,135,14,C.gold);
            label(c,"PRIZE",x+42,175,C.gold,"center");

          }

          if(i===game.pick){

            label(c,"YOUR PICK",x+42,230,C.cyan,"center");

          }

        }

        const stay=n?q.wins[n]/n:0;
        const change=n?1-stay:0;

        bar(c,400,110,220,stay,C.blue,"Stay: "+pct(stay));
        bar(c,400,175,220,change,C.gold,"Switch: "+pct(change));

        label(c,"Trials: "+n,400,240,C.white);

      }
    },

    /* 47 — CURVED GEOMETRY */

    {
      id:"curved-space-geometry",
      title:"What if space had curved geometry?",
      label:"Non-Euclidean Geometry",

      desc:"Construct a triangle on a sphere and discover why its angles can add up to more than 180 degrees.",

      action:"Draw spherical triangle",

      knobs:[
        knob("longitude","Longitude separation",10,160,1,90,"°"),
        knob("radius","Sphere radius",1,10,.5,5,"units")
      ],

      presets:[
        ["270° triangle",{longitude:90}],
        ["Small triangle",{longitude:15}],
        ["Wide triangle",{longitude:150}]
      ],

      formula:"Angle sum = 180° + λ · Area = R² × λ(rad)",

      explain:"A spherical triangle can have two vertices on the equator and one at the north pole. The meridians meet the equator at right angles, so its third angle equals their longitude separation.",

      note:"This is spherical surface geometry. General relativity uses a more complex spacetime geometry.",

      calc:p=>({
        sum:180+p.longitude,
        area:p.radius**2*rad(p.longitude)
      }),

      stats:(p,s,q)=>[
        ["Angle A","90°"],
        ["Angle B","90°"],
        ["Total angle sum",fmt(q.sum)+"°"],
        ["Spherical area",fmt(q.area)+" units²"]
      ],

      draw:(c,p,s)=>{

        heading(c,"SPHERICAL TRIANGLE / CURVED SURFACE");

        const cx=215,cy=151,R=114;

        const g=c.createRadialGradient(
          175,105,8,cx,cy,R
        );

        g.addColorStop(0,"#4e9fb8");
        g.addColorStop(1,"#132d50");

        circle(c,cx,cy,R,g,C.blue,2);

        const project=(lat,lon)=>[
          cx+R*Math.cos(lat)*Math.sin(lon),
          cy-R*Math.sin(lat)
        ];

        for(let a=-60;a<=60;a+=30){

          const lat=rad(a);
          const pts=[];

          for(let i=-90;i<=90;i+=3){
            pts.push(project(lat,rad(i)));
          }

          path(c,pts,"#416784");

        }

        const half=rad(p.longitude/2);
        const pts=[];

        for(let i=0;i<=40;i++){
          pts.push(project(Math.PI/2*(1-i/40),-half));
        }

        for(let i=0;i<=40;i++){
          pts.push(project(0,-half+2*half*i/40));
        }

        for(let i=0;i<=40;i++){
          pts.push(project(Math.PI/2*i/40,half));
        }

        const f=progress(s);

        if(f>=1){
          polygon(c,pts,"rgba(255,208,128,.27)",C.gold);
        }else{
          path(c,pts.slice(0,Math.max(1,Math.floor(pts.length*f))),C.gold,3);
        }

        label(c,"FLAT TRIANGLE",485,60,C.cyan,"center");

        polygon(
          c,[[485,80],[420,180],[550,180]],
          "#1e344b",C.cyan
        );

        label(c,"180°",485,210,C.white,"center");

        label(c,"SPHERICAL: "+fmt(180+p.longitude)+"°",485,260,C.gold,"center");

      }
    },

    /* 48 — CHAOS THEORY */

    {
      id:"butterfly-effect",
      title:"What if a tiny change created chaos?",
      label:"Chaos & Dynamical Systems",

      desc:"Start two nearly identical mathematical systems and watch their trajectories evolve.",

      action:"Run both systems",

      knobs:[
        knob("r","Growth parameter",2.5,4,.01,3.9,"r"),
        knob("delta","Initial difference",.0001,.01,.0001,.001,"Δx"),
        knob("steps","Iterations",20,100,5,60,"steps")
      ],

      presets:[
        ["Stable system",{r:2.8}],
        ["Periodic behavior",{r:3.2}],
        ["Chaotic regime",{r:3.95,delta:.0001}]
      ],

      formula:"xₙ₊₁ = r × xₙ × (1 − xₙ)",

      explain:"The logistic map is deterministic, but certain parameter values produce sensitive dependence on initial conditions. Two trajectories starting extremely close together may later become very different.",

      note:"Not every parameter produces chaos. This model demonstrates mathematical sensitivity, not a literal weather or butterfly prediction.",

      calc:p=>{

        const a=[.35];
        const b=[.35+p.delta];

        for(let i=0;i<p.steps;i++){

          a.push(p.r*a[i]*(1-a[i]));
          b.push(p.r*b[i]*(1-b[i]));

        }

        return {a,b};

      },

      stats:(p,s,q)=>{

        const n=Math.round(p.steps*progress(s));

        return [
          ["Iteration",String(n)],
          ["System A",fmt(q.a[n],6)],
          ["System B",fmt(q.b[n],6)],
          ["Current difference",fmt(Math.abs(q.a[n]-q.b[n]),6)]
        ];

      },

      draw:(c,p,s,q)=>{

        heading(c,"TWO NEARLY IDENTICAL SYSTEMS");

        grid(c,45,45,575,210,25);

        const n=Math.round(p.steps*progress(s));

        [q.a,q.b].forEach((values,j)=>{

          const pts=[];

          for(let i=0;i<=n;i++){

            pts.push([
              45+i/p.steps*575,
              255-values[i]*210
            ]);

          }

          path(c,pts,j?C.gold:C.cyan,2);

          if(pts.length){
            glow(c,...pts[pts.length-1],4,j?C.gold:C.cyan);
          }

        });

        label(c,"System A",45,280,C.cyan);
        label(c,"System B",180,280,C.gold);
        label(c,"Iteration "+n,620,280,C.white,"right");

      }
    },

    /* 49 — COMPLEX NUMBERS */

    {
      id:"imaginary-number-world",
      title:"What if imaginary numbers became visible?",
      label:"Complex Numbers",

      desc:"Turn multiplication into rotation and scaling on the complex plane.",

      action:"Rotate the complex number",

      knobs:[
        knob("angle","Rotation per multiplication",-180,180,1,45,"°"),
        knob("radius","Magnitude multiplier",.5,1.4,.05,1,"×"),
        knob("steps","Multiplications",1,12,1,8,"times")
      ],

      presets:[
        ["Multiply by i",{angle:90,radius:1,steps:4}],
        ["Expanding spiral",{angle:45,radius:1.25}],
        ["Shrinking spiral",{angle:60,radius:.8}]
      ],

      formula:"z = r(cos θ + i sin θ) · zⁿ = rⁿeⁱⁿᶿ",

      explain:"A complex number has real and imaginary components. Multiplying by a complex number scales the magnitude and adds an angle. Multiplication by i rotates a point counterclockwise by 90 degrees.",

      note:"The imaginary axis is a mathematical coordinate, not an additional physical spatial dimension.",

      calc:p=>({
        scale:Math.max(1,p.radius**p.steps)
      }),

      stats:(p,s,q)=>{

        const n=Math.round(p.steps*progress(s));

        const a=rad(p.angle*n);
        const r=p.radius**n;

        return [
          ["Real component",fmt(r*Math.cos(a),5)],
          ["Imaginary component",fmt(r*Math.sin(a),5)],
          ["Magnitude",fmt(r,5)],
          ["Accumulated rotation",fmt(p.angle*n)+"°"]
        ];

      },

      draw:(c,p,s,q)=>{

        heading(c,"ARGAND PLANE / COMPLEX MULTIPLICATION");

        grid(c,60,40,540,230,25);

        const cx=330,cy=155;

        line(c,60,cy,600,cy,C.muted,1.5);
        line(c,cx,40,cx,270,C.muted,1.5);

        label(c,"Real axis",590,cy-8,C.white,"right");
        label(c,"Imaginary axis",cx+8,55,C.white);

        const n=Math.round(p.steps*progress(s));
        const scale=100/q.scale;

        const pts=[];

        for(let i=0;i<=n;i++){

          const a=rad(p.angle*i);
          const r=p.radius**i*scale;

          const x=cx+r*Math.cos(a);
          const y=cy-r*Math.sin(a);

          pts.push([x,y]);

          circle(c,x,y,3,C.cyan);

        }

        path(c,pts,C.purple,2);

        const [x,y]=pts[pts.length-1];

        arrow(c,cx,cy,x,y,C.gold);

        glow(c,x,y,6,C.gold);

        label(c,"z^"+n,x+9,y-10,C.gold);

        label(c,"Multiplication = rotation + scaling",330,290,C.white,"center");

      }
    }

  ];

  /* REGISTER MATHEMATICS PACK */

  labs.forEach((lab,i)=>{

    lab.number=String(i+40);

    lab.category="math";

    lab.duration=()=>8;

  });

  return labs;

}

/* END OF MATHEMATICS PACK */
