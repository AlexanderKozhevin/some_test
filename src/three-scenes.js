import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
const reduce=matchMedia('(prefers-reduced-motion: reduce)');
const V=(x,y,z)=>new THREE.Vector3(x,y,z);
function roundPath(size,r){const h=size/2,p=new THREE.Shape();p.moveTo(-h+r,-h);p.lineTo(h-r,-h);p.quadraticCurveTo(h,-h,h,-h+r);p.lineTo(h,h-r);p.quadraticCurveTo(h,h,h-r,h);p.lineTo(-h+r,h);p.quadraticCurveTo(-h,h,-h,h-r);p.lineTo(-h,-h+r);p.quadraticCurveTo(-h,-h,-h+r,-h);return p;}
function frameGeo(s,w,d){const p=roundPath(s,s*.21),inner=roundPath(s-2*w,(s-2*w)*.2);p.holes.push(new THREE.Path(inner.getPoints(12).reverse()));const geo=new THREE.ExtrudeGeometry(p,{depth:d,bevelEnabled:true,bevelSegments:4,steps:1,bevelSize:.045,bevelThickness:.045,curveSegments:16});geo.center();return geo;}
function createScene(host){
 const mount=host.querySelector('.scene-canvas'),dark=host.dataset.dark==='true',kind=host.dataset.scene;
 let renderer;
 try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});}catch{host.classList.add('scene-unavailable');return;}
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.65));renderer.setClearColor(0x000000,0);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=dark?1.3:1.1;mount.append(renderer.domElement);
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(34,1,.1,80);camera.position.set(6,4.3,8.8);camera.lookAt(0,.1,0);
 const pmrem=new THREE.PMREMGenerator(renderer),room=new RoomEnvironment();const env=pmrem.fromScene(room,.04);scene.environment=env.texture;room.dispose();pmrem.dispose();
 scene.add(new THREE.HemisphereLight(0xe5f3ff,0x25344f,2.1));const key=new THREE.DirectionalLight(0xffffff,3.2);key.position.set(-4,7,5);scene.add(key);const rim=new THREE.DirectionalLight(0x72eddf,3.8);rim.position.set(4,2,-5);scene.add(rim);
 const mats={navy:new THREE.MeshPhysicalMaterial({color:0x132548,metalness:.65,roughness:.26,clearcoat:.6,clearcoatRoughness:.25}),silver:new THREE.MeshPhysicalMaterial({color:0xdbe4ed,metalness:.83,roughness:.25,clearcoat:.55}),glass:new THREE.MeshPhysicalMaterial({color:0x8ce4d6,metalness:.12,roughness:.16,transmission:.65,thickness:.5,ior:1.42,transparent:true,opacity:.93,clearcoat:1}),light:new THREE.MeshStandardMaterial({color:0x6febd7,emissive:0x3bd9c1,emissiveIntensity:.8,metalness:.4,roughness:.3}),black:new THREE.MeshStandardMaterial({color:0x09172a,metalness:.4,roughness:.4})};
 const model=new THREE.Group();scene.add(model);const pieces=[];let phase=0,exploded=0,targetExploded=0,spin=false,angle=0,px=0,py=0,sx=0,sy=0,visible=true,raf=0,lastTime=0,dirtyUntil=performance.now()+1400;
 function mesh(geo,mat,pos,explode){const m=new THREE.Mesh(geo,mat);m.position.copy(pos||V(0,0,0));model.add(m);if(explode){m.userData.origin=m.position.clone();m.userData.explode=explode;pieces.push(m);}return m;}
 function box(w,h,d,mat,pos,exp,r=.13){return mesh(new RoundedBoxGeometry(w,h,d,4,r),mat,pos,exp);}
 function ring(size,w,d,mat,pos,exp){return mesh(frameGeo(size,w,d),mat,pos,exp);}
 function path(points,color=0x53d8c9,opacity=.65,radius=.013){const curve=new THREE.CatmullRomCurve3(points);return mesh(new THREE.TubeGeometry(curve,56,radius,5,false),new THREE.MeshBasicMaterial({color,transparent:true,opacity}));}
 if(kind==='compute'){
  for(let i=0;i<5;i++){const y=(i-2)*.36;const plate=box(2.65,.18,2.65,[mats.silver,mats.navy,mats.glass,mats.navy,mats.silver][i],V(0,y,0),V(0,(i-2)*.35,0));
   if(i===4){const core=box(1.22,.16,1.22,mats.navy,V(0,y+.16,0),V(0,.7,0));box(.85,.05,.85,mats.glass,V(0,y+.26,0),V(0,.7,0));for(let j=0;j<8;j++){const x=(j-3.5)*.19;box(.05,.025,.23,mats.silver,V(x,y+.13,.87),V(0,.7,0),.01);box(.05,.025,.23,mats.silver,V(x,y+.13,-.87),V(0,.7,0),.01);}}
   for(let j=0;j<3;j++)box(.035,.035,.32,mats.light,V(-1.33,y,(j-1)*.5),V(0,(i-2)*.35,0),.01);
  }
  ring(3.55,.035,.025,mats.silver,V(0,-1.25,0)).rotation.x=Math.PI/2;
 }else if(kind==='storage'){
  for(let i=0;i<7;i++){const y=(i-3)*.29;box(2.5,.12,1.9,[mats.silver,mats.glass,mats.navy][i%3],V(0,y,0),V((i-3)*.055,(i-3)*.23,0),.13);for(let j=0;j<5;j++)box(.04,.025,.09,mats.light,V((j-2)*.17,y+.074,.65),V((i-3)*.055,(i-3)*.23,0),.008);}
  const arc=ring(3.2,.045,.04,mats.silver,V(0,0,0),V(0,0,-.6));arc.rotation.x=Math.PI/2;
 }else if(kind==='security'){
  const core=box(1.28,1.28,.75,mats.silver,V(0,0,0),V(0,0,-.25),.24);ring(1.04,.08,.04,mats.light,V(0,0,.43),V(0,0,-.25));
  ring(2.36,.3,.44,mats.navy,V(0,0,-.1),V(0,0,-.65));ring(3.1,.12,.28,mats.glass,V(0,0,.12),V(0,0,.55));ring(3.6,.045,.08,mats.light,V(0,0,.15),V(0,0,1.1));
  for(let i=0;i<7;i++){const x=-2.7+(i%3)*.19,y=(i-3)*.25;mesh(new THREE.SphereGeometry(.042,12,8),mats.light,V(x,y,0),V(-.4,0,0));}
  model.rotation.y=-.2;
 }else if(kind==='network'){
  mesh(new THREE.SphereGeometry(1.35,56,36),mats.navy);
  const vertices=[];for(let i=0;i<1800;i++){const z=1-2*(i+.5)/1800,phi=i*Math.PI*(3-Math.sqrt(5)),r=Math.sqrt(1-z*z);vertices.push(r*Math.cos(phi)*1.37,z*1.37,r*Math.sin(phi)*1.37);}
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));const points=new THREE.Points(geo,new THREE.PointsMaterial({color:dark?0x7cacc9:0x5385ab,size:.017,transparent:true,opacity:.6}));model.add(points);
  for(let i=0;i<4;i++){const g=new THREE.TorusGeometry(1.72+i*.11,.013,6,120);const m=mesh(g,i%2?mats.silver:mats.light,V(0,0,0),V(0,(i-1.5)*.25,0));m.rotation.set(.5+i*.6,.2+i*.9,i*.5);}
  const pts=[V(-1,.4,.96),V(.3,1.2,.6),V(1.2,-.5,.45),V(-.6,-.9,.8),V(.9,.8,-.65)];pts.forEach((p,i)=>{mesh(new THREE.SphereGeometry(.067,16,12),mats.light,p);const end=pts[(i+1)%pts.length],mid=p.clone().add(end).normalize().multiplyScalar(2);path([p,mid,end],i%2?0xaed8f0:0x5cf6d7,.75,.009);});
  model.rotation.y=.3;
 }else if(kind==='cluster'){
  const center=box(.95,.95,.95,mats.navy,V(0,0,0),V(0,0,0),.18);ring(.71,.075,.04,mats.light,V(0,0,.51));
  for(let i=0;i<6;i++){const a=i*Math.PI/3,x=Math.cos(a)*1.82,z=Math.sin(a)*1.6,y=(i%2-.5)*.8;const p=V(x,y,z);box(.66,.66,.66,i%2?mats.glass:mats.silver,p,p.clone().multiplyScalar(.3),.14);path([V(0,0,0),p.clone().multiplyScalar(.55).add(V(0,.2,0)),p],0x7dbed0,.55,.012);}
  const ringM=mesh(new THREE.TorusGeometry(2.25,.015,6,120),mats.silver);ringM.rotation.x=Math.PI/2;
 }else if(kind==='hosting'){
  for(let i=0;i<4;i++){let y=(i-1.5)*.53;box(2.5,.39,1.8,i===3?mats.silver:mats.navy,V(0,y,0),V(0,(i-1.5)*.37,0));for(let j=0;j<10;j++)box(.065,.16,.024,mats.black,V((j-4.5)*.145,y,.92),V(0,(i-1.5)*.37,0),.01);box(.08,.08,.035,mats.light,V(1.04,y,.92),V(0,(i-1.5)*.37,0),.02);}
 }else if(kind==='stream'){
  for(let i=0;i<3;i++){const m=ring(2.6,.12,.15,[mats.silver,mats.navy,mats.glass][i],V(0,0,(i-1)*.55),V(0,0,(i-1)*.55));m.scale.x=1.35;m.scale.y=.78;}
  const triangle=new THREE.Shape();triangle.moveTo(-.35,-.5);triangle.lineTo(.55,0);triangle.lineTo(-.35,.5);triangle.closePath();const geo=new THREE.ExtrudeGeometry(triangle,{depth:.18,bevelEnabled:true,bevelThickness:.045,bevelSize:.06,bevelSegments:4});geo.center();mesh(geo,mats.light,V(0,0,.85),V(0,0,.75));
 }
 // A procedural soft contact shadow makes the sculpture sit in the studio.
 const shadowCanvas=document.createElement('canvas');shadowCanvas.width=128;shadowCanvas.height=128;const ctx=shadowCanvas.getContext('2d'),gradient=ctx.createRadialGradient(64,64,4,64,64,62);gradient.addColorStop(0,dark?'rgba(0,0,0,.65)':'rgba(19,37,72,.23)');gradient.addColorStop(1,'rgba(19,37,72,0)');ctx.fillStyle=gradient;ctx.fillRect(0,0,128,128);const texture=new THREE.CanvasTexture(shadowCanvas);const shadow=new THREE.Mesh(new THREE.PlaneGeometry(6,5),new THREE.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false}));shadow.rotation.x=-Math.PI/2;shadow.position.y=-1.58;scene.add(shadow);
 model.scale.setScalar(1.12);
 const baseRotation=model.rotation.clone();
 function resize(){const {width,height}=mount.getBoundingClientRect();if(width<1||height<1)return;renderer.setSize(width,height,false);camera.aspect=width/height;const dist=width<370?1.2:1;camera.position.set(6*dist,4.3*dist,8.8*dist);camera.updateProjectionMatrix();invalidate();}
 function invalidate(){dirtyUntil=performance.now()+700;if(!raf&&visible&&!document.hidden)raf=requestAnimationFrame(draw);}
 function draw(now){raf=0;if(!visible||document.hidden)return;const dt=Math.min((now-(lastTime||now))/1000,.06);lastTime=now;exploded+=(targetExploded-exploded)*(reduce.matches?1:.09);sx+=(px-sx)*.075;sy+=(py-sy)*.075;if(spin&&!reduce.matches)angle+=dt*.22;
  model.rotation.y=baseRotation.y+angle+(reduce.matches?0:sx*.3);model.rotation.x=baseRotation.x+(reduce.matches?0:sy*.15);model.position.y=reduce.matches?0:Math.sin(Math.min(now/1000,8)*.6)*.018;
  for(const m of pieces)m.position.copy(m.userData.origin).addScaledVector(m.userData.explode,exploded);
  renderer.render(scene,camera);if(!host.classList.contains('scene-ready')){host.classList.add('scene-ready');host.dataset.rendered='true';}
  if(spin&&!reduce.matches||now<dirtyUntil||Math.abs(exploded-targetExploded)>.001)raf=requestAnimationFrame(draw);
 }
 const mode=host.querySelector('[data-scene-mode]'),rotate=host.querySelector('[data-scene-rotate]');
 mode.addEventListener('click',()=>{targetExploded=targetExploded?0:1;mode.setAttribute('aria-pressed',String(!!targetExploded));mode.innerHTML='<i data-lucide="layers-3" aria-hidden="true"></i> '+(targetExploded?'Собрать':'Разобрать');window.lucide?.createIcons({attrs:{'aria-hidden':'true'}});invalidate();});
 rotate.disabled=reduce.matches;
 rotate.addEventListener('click',()=>{spin=!spin;rotate.setAttribute('aria-pressed',String(spin));rotate.setAttribute('aria-label',spin?'Остановить вращение 3D':'Включить вращение 3D');invalidate();});
 host.addEventListener('pointermove',e=>{if(e.pointerType==='touch'||reduce.matches)return;const r=host.getBoundingClientRect();px=(e.clientX-r.left)/r.width-.5;py=(e.clientY-r.top)/r.height-.5;invalidate();});host.addEventListener('pointerleave',()=>{px=0;py=0;invalidate();});
 const io=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible)invalidate();else if(raf){cancelAnimationFrame(raf);raf=0;}},{threshold:.05});io.observe(host);const ro=new ResizeObserver(resize);ro.observe(mount);document.addEventListener('visibilitychange',()=>{if(!document.hidden)invalidate();else{cancelAnimationFrame(raf);raf=0;}});reduce.addEventListener('change',()=>{rotate.disabled=reduce.matches;if(reduce.matches){spin=false;rotate.setAttribute('aria-pressed','false');rotate.setAttribute('aria-label','Включить вращение 3D');}invalidate();});
 renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();cancelAnimationFrame(raf);host.classList.remove('scene-ready');host.classList.add('scene-unavailable');});
 window.addEventListener('pageshow',e=>{if(e.persisted)invalidate();});
 window.addEventListener('pagehide',e=>{cancelAnimationFrame(raf);raf=0;if(e.persisted)return;io.disconnect();ro.disconnect();scene.traverse(o=>{o.geometry?.dispose();if(o.material){for(const m of Array.isArray(o.material)?o.material:[o.material])m.dispose();}});texture.dispose();env.dispose();renderer.dispose();});
 resize();
}
for(const host of document.querySelectorAll('[data-scene]')){try{createScene(host);}catch(error){host.classList.add('scene-unavailable');console.warn('3D illustration fallback',error.message);}}
