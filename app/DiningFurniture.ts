import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

// Dimensions are metres; the restaurant avatar is 1.75 m tall.
export const DINING_DIMENSIONS = { tableHeight: .76, tableRadius: .78, seatHeight: .47, chairHeight: 1.02 };

function surfaceTexture(kind: "walnut" | "weave") {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 512;
  const ctx = canvas.getContext("2d")!;
  let seed = 81;
  const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  ctx.fillStyle = kind === "walnut" ? "#6b4931" : "#c9bda8";
  ctx.fillRect(0, 0, 512, 512);
  if (kind === "walnut") {
    for (let i = 0; i < 1100; i++) {
      const x = random() * 512;
      ctx.beginPath(); ctx.moveTo(x, 0);
      ctx.bezierCurveTo(x + Math.sin(x * .04) * 15, 180, x - 12, 330, x + 6, 512);
      ctx.strokeStyle = `rgba(${random() > .5 ? "30,15,8" : "195,147,92"},${.035 + random() * .10})`;
      ctx.lineWidth = .4 + random() * 1.3; ctx.stroke();
    }
  } else {
    for (let y = 0; y < 512; y += 3) for (let x = 0; x < 512; x += 3) {
      ctx.fillStyle = `rgba(${(x + y) % 2 ? "65,49,32" : "255,247,225"},${.05 + random() * .12})`;
      ctx.fillRect(x, y, 1, 3);
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 4;
  return texture;
}

function plankTexture() {
  const canvas=document.createElement("canvas");canvas.width=canvas.height=1024;
  const ctx=canvas.getContext("2d")!;
  ctx.fillStyle="#261b16";ctx.fillRect(0,0,1024,1024);
  const grain=surfaceTexture("walnut");
  for(let row=0;row<8;row++)for(let column=-1;column<4;column++){
    const x=column*384+(row%3)*128,y=row*128;
    ctx.drawImage(grain.image as HTMLCanvasElement,x+1,y+1,382,126);
    ctx.fillStyle=`rgba(22,12,5,${.13+((row*7+column*3+40)%9)*.025})`;ctx.fillRect(x+1,y+1,382,126);
    ctx.fillStyle="rgba(222,183,131,.12)";ctx.fillRect(x+2,y+2,380,1);
  }
  grain.dispose();const texture=new THREE.CanvasTexture(canvas);
  texture.colorSpace=THREE.SRGBColorSpace;texture.wrapS=texture.wrapT=THREE.RepeatWrapping;
  texture.repeat.set(5,5);texture.anisotropy=8;return texture;
}

export function addDiningFurniture(scene: THREE.Scene, renderer: THREE.WebGLRenderer) {
  const root = new THREE.Group(); root.name = "Human-scale dining furniture"; scene.add(root);
  const walnutMap = surfaceTexture("walnut"), fabricMap = surfaceTexture("weave");
  const floorMap=plankTexture();
  const floor=scene.children.find(child=>child instanceof THREE.Mesh && child.geometry instanceof THREE.PlaneGeometry) as THREE.Mesh | undefined;
  if(floor){const material=floor.material as THREE.MeshStandardMaterial;material.map=floorMap;material.color.set(0xb6aaa0);material.roughness=.48;material.metalness=0;material.needsUpdate=true;}
  const walnut = new THREE.MeshPhysicalMaterial({ color: 0x93765d, map: walnutMap, roughness: .34, clearcoat: .3, clearcoatRoughness: .32 });
  const upholstery = new THREE.MeshPhysicalMaterial({ color: 0xf2ebdf, map: fabricMap, bumpMap: fabricMap, bumpScale: .0015, roughness: .87, sheen: .3, sheenColor: new THREE.Color(0xf5eddf) });
  const wood = new THREE.MeshStandardMaterial({ color: 0x281b17, roughness: .4, map: walnutMap });
  const brass = new THREE.MeshStandardMaterial({ color: 0xb29a62, metalness: .82, roughness: .32 });
  const porcelain = new THREE.MeshPhysicalMaterial({ color: 0xeee7da, roughness: .22, clearcoat: .4 });
  const seam = new THREE.MeshStandardMaterial({ color: 0xa2947a, roughness: .8 });
  const glass = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: .08, metalness: .05, transparent: true, opacity: .27 });
  const flameMaterial=new THREE.MeshBasicMaterial({color:0xffdc95});
  const panelMaterial=new THREE.MeshStandardMaterial({color:0x33242a,roughness:.78});
  const trimMaterial=new THREE.MeshStandardMaterial({color:0x49363a,roughness:.5});
  const silver=new THREE.MeshStandardMaterial({color:0xcac6be,metalness:.94,roughness:.22});
  const geometries = new Set<THREE.BufferGeometry>();
  const materials: THREE.Material[] = [walnut, upholstery, wood, brass, porcelain, seam, glass, flameMaterial,panelMaterial,trimMaterial,silver];
  const mesh = (parent: THREE.Object3D, geo: THREE.BufferGeometry, mat: THREE.Material, x=0,y=0,z=0) => {
    geometries.add(geo); const object = new THREE.Mesh(geo,mat); object.position.set(x,y,z);
    object.castShadow = object.receiveShadow = true; parent.add(object); return object;
  };
  const tube = (parent: THREE.Object3D, points: THREE.Vector3[], radius: number, mat: THREE.Material, closed=false) => mesh(parent,new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points,closed),48,radius,6,closed),mat);
  const rounded = (w:number,h:number,d:number,r:number) => new RoundedBoxGeometry(w,h,d,3,r);
  // Architectural detailing stays inside the existing outer walls and clear of every doorway.
  const panel=(x:number,z:number,rotation:number)=>{
    const group=new THREE.Group();group.position.set(x,0,z);group.rotation.y=rotation;root.add(group);
    mesh(group,rounded(1.45,2.55,.045,.02),panelMaterial,0,1.58,0);
    for(const px of [-.745,.745])mesh(group,rounded(.035,2.62,.035,.009),trimMaterial,px,1.58,.025);
    for(const y of [.27,2.89])mesh(group,rounded(1.52,.035,.035,.009),trimMaterial,0,y,.025);
    mesh(group,rounded(1.5,.14,.08,.016),wood,0,.09,.035);
  };
  for(const x of [-8.6,-6.7,-4.8,-2.9,2.9,4.8,6.7,8.6])panel(x,-9.74,0);
  for(const z of [-8.6,-6.7,-4.8,-2.9,2.9,4.8,6.7,8.6]){panel(-9.74,z,Math.PI/2);panel(9.74,z,-Math.PI/2);}
  for(const x of [-8.6,-6.7,.3,2.2,8.4])panel(x,9.74,Math.PI);
  // Low-profile rug binding breaks up the formerly flat red disc.
  const rugFabric=surfaceTexture("weave");rugFabric.repeat.set(36,36);
  const rugMaterial=new THREE.MeshStandardMaterial({color:0x531f2a,map:rugFabric,roughness:1,bumpMap:rugFabric,bumpScale:.003});materials.push(rugMaterial);
  const rug=mesh(root,new THREE.CircleGeometry(4.25,96),rugMaterial,0,.008,0);rug.rotation.x=-Math.PI/2;rug.castShadow=false;
  for(const radius of [4.13,4.20]){const binding=mesh(root,new THREE.TorusGeometry(radius,.012,6,96),seam,0,.012,0);binding.rotation.x=Math.PI/2;binding.castShadow=false;}
  const shadowCanvas = document.createElement("canvas"); shadowCanvas.width=shadowCanvas.height=128;
  const sc=shadowCanvas.getContext("2d")!, gradient=sc.createRadialGradient(64,64,8,64,64,64);
  gradient.addColorStop(0,"rgba(0,0,0,.36)");gradient.addColorStop(.55,"rgba(0,0,0,.18)");gradient.addColorStop(1,"rgba(0,0,0,0)");
  sc.fillStyle=gradient;sc.fillRect(0,0,128,128);
  const shadowMap=new THREE.CanvasTexture(shadowCanvas);
  const shadowMat=new THREE.MeshBasicMaterial({map:shadowMap,transparent:true,depthWrite:false});
  const contact=(parent:THREE.Object3D,size:number)=>{const s=mesh(parent,new THREE.PlaneGeometry(size,size),shadowMat,0,.014,0);s.rotation.x=-Math.PI/2;s.castShadow=false;};

  function chair() {
    const group = new THREE.Group(); group.name="Curved linen dining chair — 1.02m";
    mesh(group,rounded(.54,.11,.53,.047),upholstery,0,.455,0);
    mesh(group,rounded(.49,.07,.48,.022),wood,0,.382,0);
    // A continuous curved upholstered shell, rather than a flat rectangular slab.
    const shape=new THREE.Shape();shape.moveTo(-.285,.12);shape.quadraticCurveTo(0,.35,.285,.12);
    shape.lineTo(.285,.205);shape.quadraticCurveTo(0,.435,-.285,.205);shape.closePath();
    const shell=new THREE.ExtrudeGeometry(shape,{depth:.49,bevelEnabled:true,bevelThickness:.025,bevelSize:.025,bevelSegments:4,steps:4,curveSegments:24});
    shell.rotateX(Math.PI/2);shell.translate(0,.99,0);
    mesh(group,shell,upholstery);
    const topPoints=[];
    for(let i=0;i<=24;i++){const x=-.275+i*.55/24;topPoints.push(new THREE.Vector3(x,1.003,.20+.11*(1-(x/.275)**2)));}
    tube(group,topPoints,.004,seam);
    for(const x of [-.22,.22])for(const z of [-.19,.19]){
      const leg=mesh(group,new THREE.CylinderGeometry(.024,.017,.38,12),wood,x,.195,z);
      leg.rotation.z=-Math.sign(x)*.055;leg.rotation.x=Math.sign(z)*.045;
      mesh(group,new THREE.CylinderGeometry(.018,.019,.065,12),brass,x+Math.sign(x)*.009,.042,z+Math.sign(z)*.008);
    }
    for(const side of [-1,1]){
      tube(group,[new THREE.Vector3(side*.265,.52,-.17),new THREE.Vector3(side*.27,.62,-.02),new THREE.Vector3(side*.27,.72,.2)],.032,upholstery);
      // Small nailhead accents, kept flush to the fabric.
      for(let i=0;i<10;i++)mesh(group,new THREE.SphereGeometry(.005,6,4),brass,side*.302,.57+i*.041,.20);
    }
    contact(group,.85);return group;
  }

  function table(x:number,z:number,withChairs:boolean) {
    const group=new THREE.Group();group.position.set(x,0,z);root.add(group);group.name="Walnut dining table — 0.76m";
    const top=mesh(group,new THREE.CylinderGeometry(.78,.77,.055,64),walnut,0,.7325,0);
    top.geometry.computeVertexNormals();
    mesh(group,new THREE.CylinderGeometry(.765,.765,.042,64),porcelain,0,.686,0);
    for(const y of [.708,.664]){const rim=mesh(group,new THREE.TorusGeometry(.765,.008,8,64),brass,0,y,0);rim.rotation.x=Math.PI/2;}
    const bottom=mesh(group,new THREE.TorusGeometry(.43,.016,8,48),brass,0,.075,0);bottom.rotation.x=Math.PI/2;
    for(let i=0;i<6;i++){
      const a=i*Math.PI/3,points=[];
      for(let j=0;j<=32;j++){const t=j/32*Math.PI*2;const radial=.36+Math.cos(t)*.15;points.push(new THREE.Vector3(Math.cos(a)*radial,.365+Math.sin(t)*.29,Math.sin(a)*radial));}
      tube(group,points,.014,brass,true);
    }
    contact(group,2.2);
    mesh(group,new THREE.CylinderGeometry(.045,.05,.18,20),porcelain,0,.858,0);
    mesh(group,new THREE.SphereGeometry(.012,8,8),flameMaterial,0,.956,0);
    if(withChairs) for(let i=0;i<4;i++){
      const angle=i*Math.PI/2+.25,dx=Math.sin(angle),dz=Math.cos(angle);
      const c=chair();c.position.set(dx*1.08,0,dz*1.08);c.rotation.y=angle;group.add(c);
      const plate=mesh(group,new THREE.CylinderGeometry(.14,.12,.016,32),porcelain,dx*.52,.772,dz*.52);
      const lip=mesh(group,new THREE.TorusGeometry(.131,.006,6,32),porcelain,plate.position.x,.781,plate.position.z);lip.rotation.x=Math.PI/2;
      const setting=new THREE.Group();setting.position.set(dx*.52,.785,dz*.52);setting.rotation.y=angle;group.add(setting);
      const napkin=mesh(setting,rounded(.13,.014,.19,.009),upholstery,0,.012,0);napkin.rotation.y=.13;
      mesh(setting,rounded(.018,.009,.19,.005),silver,.195,0,0);
      mesh(setting,rounded(.018,.009,.13,.005),silver,-.195,0,.025);
      for(let tine=0;tine<3;tine++)mesh(setting,new THREE.CylinderGeometry(.002,.002,.047,6),silver,-.203+tine*.008,0,-.058).rotation.x=Math.PI/2;
      const gx=dx*.48+dz*.18,gz=dz*.48-dx*.18;
      mesh(group,new THREE.CylinderGeometry(.035,.035,.007,16),glass,gx,.773,gz);
      mesh(group,new THREE.CylinderGeometry(.005,.005,.085,8),glass,gx,.815,gz);
      const bowl=mesh(group,new THREE.SphereGeometry(.043,16,12,0,Math.PI*2,0,Math.PI*.75),glass,gx,.887,gz);bowl.scale.y=1.3;
    }
  }
  for(const [x,z] of [[-5.4,-5.2],[0,-5.2],[5.3,-4.8],[-5.2,0],[4.9,.4],[-4.8,4.6]])table(x,z,true);
  table(0,2.7,false);

  // Neutral reflected studio light gives metal and varnish readable, soft reflections.
  const pmrem=new THREE.PMREMGenerator(renderer),room=new RoomEnvironment();
  const environment=pmrem.fromScene(room,.06);scene.environment=environment.texture;scene.environmentIntensity=.28;
  room.dispose();pmrem.dispose();
  const key=new THREE.SpotLight(0xffe3bd,100,24,Math.PI*.36,.75,2);
  key.position.set(-3,6,4);key.target.position.set(0,0,0);key.castShadow=true;
  key.shadow.mapSize.set(1024,1024);key.shadow.bias=-.0004;key.shadow.normalBias=.025;
  scene.add(key,key.target);
  return ()=>{
    root.removeFromParent();key.removeFromParent();key.target.removeFromParent();
    geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());shadowMat.dispose();
    walnutMap.dispose();fabricMap.dispose();floorMap.dispose();rugFabric.dispose();shadowMap.dispose();environment.dispose();scene.environment=null;
  };
}
