import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export function createPyramidScene(host, onLost, onSelect) {
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' }); } catch { return null; }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  host.appendChild(renderer.domElement);
  const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(36, 1, .1, 50);
  camera.position.set(0, 1.5, 9.1); camera.lookAt(0, 0, 0);
  const pmrem = new THREE.PMREMGenerator(renderer), room = new RoomEnvironment();
  const env = pmrem.fromScene(room, .04); scene.environment = env.texture; room.dispose(); pmrem.dispose();
  scene.add(new THREE.HemisphereLight(0xddeaff, 0x081426, 1.4));
  const light = new THREE.DirectionalLight(0xffffff, 2.2); light.position.set(-3, 5, 4); scene.add(light);
  const object = new THREE.Group(); scene.add(object); object.rotation.y = Math.PI/3+.12;
  const apex = new THREE.Vector3(0, 2, 0);
  const base = Array.from({length:3}, (_,i) => new THREE.Vector3(Math.sin(i*Math.PI*2/3)*2.25, -1.35, Math.cos(i*Math.PI*2/3)*2.25));
  const faces = base.map((point,i) => {
    const shape = new THREE.Shape();
    const points = [apex, point, base[(i+1)%3]];
    const center = points.reduce((v,p)=>v.add(p),new THREE.Vector3()).divideScalar(3);
    const u = point.clone().sub(apex).normalize();
    const normal = point.clone().sub(apex).cross(base[(i+1)%3].clone().sub(apex)).normalize();
    const v = normal.clone().cross(u);
    points.forEach((p,n)=> { const d=p.clone().sub(center); if(n===0) shape.moveTo(d.dot(u),d.dot(v)); else shape.lineTo(d.dot(u),d.dot(v)); }); shape.closePath();
    const geometry = new THREE.ExtrudeGeometry(shape,{depth:.13,bevelEnabled:true,bevelThickness:.018,bevelSize:.018,bevelSegments:2,steps:1});
    const material = new THREE.MeshPhysicalMaterial({color:i===0?0xa5102b:0x003da5,metalness:.25,roughness:.4,clearcoat:.2,envMapIntensity:.4,side:THREE.DoubleSide});
    const group = new THREE.Group(); group.position.copy(center);
    const matrix = new THREE.Matrix4().makeBasis(u,v,normal); group.quaternion.setFromRotationMatrix(matrix);
        const shell = new THREE.Mesh(geometry,new THREE.MeshPhysicalMaterial({color:i===0?0xe1bd70:0xc0c0c0,metalness:.95,roughness:.25}));
    group.add(shell);
    const inset = new THREE.Mesh(geometry,material); inset.scale.set(.963,.963,1); inset.position.z=.045; group.add(inset);
    // Fine machined inlays follow the triangular face rather than a generic glow.
    const trimMaterial = new THREE.LineBasicMaterial({color:i===0?0xe1bd70:0xc0c0c0,transparent:true,opacity:.32});
    for (const scale of [.78,.82]) {
      const trimPoints = shape.getPoints().map(p=>new THREE.Vector3(p.x*scale,p.y*scale,.2));
      group.add(new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(trimPoints),trimMaterial.clone()));
    }
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geometry,30),new THREE.LineBasicMaterial({color:i===0?0xe1bd70:0xc0c0c0})); group.add(edges);
    // Upright, readable information is carried by the actual moving face.
    const service=[2,1,0][i];
    const labelCanvas=document.createElement('canvas');labelCanvas.width=1024;labelCanvas.height=600;
    const ctx=labelCanvas.getContext('2d');ctx.fillStyle=i===0?'#f4dfb3':'#edf1f7';ctx.strokeStyle=ctx.fillStyle;ctx.lineWidth=5;ctx.textAlign='center';
    if(service===0){ctx.strokeRect(452,40,120,78);ctx.beginPath();ctx.moveTo(452,60);ctx.lineTo(572,60);ctx.stroke();}
    else if(service===1){for(let bar=0;bar<7;bar++){const h=[25,50,80,100,80,50,25][bar];ctx.fillRect(455+bar*18,85-h/2,7,h);}}
    else{ctx.font='72px monospace';ctx.fillText('</>',512,105);}
    ctx.font='22px monospace';ctx.fillText(`0${service+1} / WHOFF`,512,174);
    ctx.font='600 120px Arial';ctx.fillText(['WEBSITES','AI AGENTS','DEVELOPER'][service],512,280);
    ctx.fillText(service===2?'TOOLS':'',512,390);
    ctx.font='40px Arial';ctx.fillText(['Design. Build. Launch.','Answer. Assist. Automate.','Build your next idea.'][service],512,467);
    ctx.font='34px monospace';ctx.fillText('SELECT TO EXPLORE  ↗',512,550);
    const labelTexture=new THREE.CanvasTexture(labelCanvas);labelTexture.colorSpace=THREE.SRGBColorSpace;
    const label=new THREE.Mesh(new THREE.PlaneGeometry(2.5,1.46),new THREE.MeshBasicMaterial({map:labelTexture,transparent:true,toneMapped:false,depthWrite:false}));
    const right=base[(i+1)%3].clone().sub(point).normalize();const up=normal.clone().cross(right).normalize();
    const labelOrientation=new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(right,up,normal));
    label.quaternion.copy(group.quaternion.clone().invert().multiply(labelOrientation));
    const labelOffset=normal.clone().multiplyScalar(.24).addScaledVector(up,-.2);label.position.copy(labelOffset.applyQuaternion(group.quaternion.clone().invert()));
    group.add(label);
    group.userData.service = [2,1,0][i]; object.add(group); return {group,center,material,direction:new THREE.Vector3(center.x, .25, center.z).normalize()};
  });
  const core = new THREE.Mesh(new THREE.OctahedronGeometry(.52),new THREE.MeshStandardMaterial({color:0xe1bd70,metalness:.9,roughness:.2,emissive:0x392408,emissiveIntensity:.6})); object.add(core);
  let selection=0, rotation=Math.PI/3+.12, rotationTarget=Math.PI/3+.12, hovered=-1;
  let frame=0, dead=false, visible=true, target=0, current=0, paused=false, reduced=false;
  function draw() {
    frame=0; if(dead||!visible||document.hidden)return;
    current = reduced ? target : THREE.MathUtils.lerp(current,target,.09);
    if(Math.abs(current-target)<.001)current=target;
    faces.forEach(({group,center,direction})=>group.position.copy(center).addScaledVector(direction,current*.48));
        rotation = reduced ? rotationTarget : THREE.MathUtils.lerp(rotation,rotationTarget,.1);
    if(Math.abs(rotation-rotationTarget)<.001)rotation=rotationTarget;
    object.rotation.y=rotation+current*.2; core.rotation.y=current*1.5;
    faces.forEach(({group,material})=>{material.emissive.setHex(group.userData.service===selection?0x091b40:0);material.emissiveIntensity=group.userData.service===hovered?.7:.25;});
    renderer.render(scene,camera); host.dataset.open=current.toFixed(3); host.dataset.selection=String(selection); host.dataset.faces=String(faces.length);
    if((current!==target||rotation!==rotationTarget)&&!paused) schedule();
  }
  function schedule(){if(!frame&&!dead&&!paused&&visible&&!document.hidden)frame=requestAnimationFrame(draw);}
  const resize = new ResizeObserver(()=>{const {width,height}=host.getBoundingClientRect();renderer.setSize(width,height);camera.aspect=width/Math.max(1,height);camera.updateProjectionMatrix();schedule();}); resize.observe(host);
  const observer = new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;schedule();});observer.observe(host);
  const visibility=()=>schedule(); document.addEventListener('visibilitychange',visibility);
  const lost=e=>{e.preventDefault();onLost();}; renderer.domElement.addEventListener('webglcontextlost',lost);
  schedule();
  const raycaster=new THREE.Raycaster(), pointer=new THREE.Vector2();
  function pick(event){const rect=host.getBoundingClientRect();pointer.set((event.clientX-rect.left)/rect.width*2-1,-(event.clientY-rect.top)/rect.height*2+1);raycaster.setFromCamera(pointer,camera);const hit=raycaster.intersectObjects(faces.map(f=>f.group),true).find(h=>h.object.isMesh);return hit?.object.parent.userData.service;}
  const move=event=>{const index=pick(event);hovered=index??-1;host.style.cursor=index===undefined?'default':'pointer';schedule();};
  const leave=()=>{hovered=-1;host.style.cursor='default';schedule();};
  const click=event=>{const index=pick(event);if(index!==undefined)onSelect(index);};
  host.addEventListener('pointermove',move);host.addEventListener('pointerleave',leave);host.addEventListener('click',click);
  return {
    select(index){selection=index;rotationTarget=[Math.PI/3+.12,Math.PI+.12,-Math.PI/3+.12][index];target=.65;if(reduced||paused){rotation=rotationTarget;current=target;draw();}else schedule();},
    setOpen(value,instant=false){target=Math.max(0,Math.min(1,value));if(instant||reduced||paused){current=target;draw();}else schedule();},
    setReduced(value){reduced=value;schedule();},
    setPaused(value){paused=value;if(value){target=current;cancelAnimationFrame(frame);frame=0;}else schedule();},
    dispose(){host.removeEventListener("pointermove",move);host.removeEventListener("pointerleave",leave);host.removeEventListener("click",click);dead=true;cancelAnimationFrame(frame);resize.disconnect();observer.disconnect();document.removeEventListener('visibilitychange',visibility);renderer.domElement.removeEventListener('webglcontextlost',lost);scene.traverse(o=>{o.geometry?.dispose();if(o.material){o.material.map?.dispose();o.material.dispose();}});env.dispose();renderer.dispose();renderer.domElement.remove();}
  };
}
