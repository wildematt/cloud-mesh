import {tr,isEnglish,bindLanguage,toggleLanguage} from './i18n.js?v=23';
import {CloudMesh,defaults} from './mesh.js?v=21';
const $=id=>document.getElementById(id),mesh=new CloudMesh($('scene')),specs=[['粒子场',[['particles','显示粒子','bool'],['dynamicParticles','原始自适应密度','bool'],['count','粒子数量上限',1000,100000,1000],['spread','空间厚度',.1,3,.05],['size','粒子大小',.3,3,.1],['brightness','亮度',.1,1.5,.05]]],['时间与形态',[['speed','时间倍率',-4,4,.25],['morph','形态时间 / s',0,900,1]]],['轨迹与涟漪',[['lines','显示轨迹','bool'],['waves','节点涟漪','bool'],['messages','同时显示轨迹',0,12,1],['messageSpeed','轨迹速度',.25,4,.25],['lineOpacity','轨迹不透明度',0,1,.01],['waveOpacity','涟漪不透明度',0,1,.01],['waveSpeed','涟漪速度',.25,4,.25]]],['相机与构图',[['automaticFraming','原始自动取景','bool'],['zoom','画面缩放',.5,2,.05],['yaw','水平角度',-180,180,1],['tilt','俯仰角度',-90,90,1],['roll','画面旋转',-180,180,1],['postprocessing','原始景深','bool'],['bokehScale','散景强度',0,6,.1],['focusRange','对焦范围',.1,6,.1],['focusDepth','对焦深度',-3,3,.1]]]];
for(let [i,[title,items]] of specs.entries()){let d=document.createElement('details');d.open=i<2;d.innerHTML=`<summary><span>${groupIcon(i)}${title}</span></summary>`;for(let [key,label,min,max,step]of items){let div=document.createElement('div');div.className='control';let bool=min==='bool';div.innerHTML=bool?`<label class="row" for="${key}">${label}<input id="${key}" type="checkbox"></label>`:`<div class="row"><label for="${key}">${label}</label><output id="${key}Out"></output></div><input id="${key}" type="range" min="${min}" max="${max}" step="${step}">`;d.append(div);} $('controls').append(d);}
function applyPreset(p){let patch={...p,theme:mesh.config.theme};for(let k of ['lineOpacity','waveOpacity','bokehScale','focusRange','focusDepth'])delete patch[k];mesh.set(patch)}
function sync(){syncTheme();document.dispatchEvent(new Event("colorsync"));for(let [,items]of specs)for(let [k,,type]of items){let el=$(k);if(type==='bool')el.checked=mesh.config[k];else{el.value=mesh.config[k];$(k+'Out').value=Number(mesh.config[k]).toLocaleString('en-US',{maximumFractionDigits:2});}}setIcon('play',mesh.config.animate?'pause':'play',mesh.config.animate?'暂停':'播放');}
for(let [,items]of specs)for(let [k,,type]of items)$(k).addEventListener('input',()=>{let value=type==='bool'?$(k).checked:Number($(k).value);let patch={[k]:value};if(k==='count')patch.dynamicParticles=false;if(['zoom','yaw','tilt','roll'].includes(k))patch.automaticFraming=false;mesh.set(patch);sync();});
function toast(s){$('toast').textContent=tr(s);$('toast').classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('toast').classList.remove('show'),2500)}
$('play').onclick=()=>{mesh.set({animate:!mesh.config.animate});sync()};$('reset').onclick=()=>{applyPreset(defaults);document.querySelectorAll('[data-preset]').forEach(x=>x.classList.toggle('selected',x.dataset.preset==='original'));sync();toast('已恢复原始参数')};$('panelToggle').onclick=()=>{let hidden=document.body.classList.toggle('panel-closed');$('panel').inert=hidden;$('panelToggle').setAttribute('aria-expanded',String(!hidden));};
const presets={original:{...defaults},halo:{...defaults,morph:180,spread:.45,tilt:35,messages:1,automaticFraming:false},flow:{...defaults,morph:600,spread:1.5,roll:-20,speed:2,messages:6,automaticFraming:false}};
document.querySelectorAll('[data-preset]').forEach(b=>b.onclick=()=>{applyPreset(presets[b.dataset.preset]);document.querySelectorAll('[data-preset]').forEach(x=>x.classList.toggle('selected',x===b));sync()});
function download(blob,name){let a=document.createElement('a'),u=URL.createObjectURL(blob);a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000)}
$('export').onclick=()=>{download(new Blob([JSON.stringify({...mesh.config,morph:Number(mesh.time.toFixed(2))},null,2)],{type:'application/json'}),'cloud-mesh-config.json');toast('配置已导出')};$('capture').onclick=()=>{mesh.draw();mesh.canvas?.toBlob(b=>{if(b)download(b,'cloud-mesh.png')})};$('importBtn').onclick=()=>$('importFile').click();$('importFile').onchange=async e=>{try{let file=e.target.files[0];if(!file)return;let v=JSON.parse(await file.text()),p={};if(!v||typeof v!=='object'||Array.isArray(v))throw Error();for(let [,items]of specs)for(let[k,,min,max]of items)if(k in v){if(min==='bool'){if(typeof v[k]!=='boolean')throw Error();}else if(typeof v[k]!=='number'||!Number.isFinite(v[k])||v[k]<min||v[k]>max)throw Error();p[k]=v[k];}for(let k of ['trailColor','waveColor'])if(k in v){if(v[k]!==null&&!/^#[0-9a-f]{6}$/i.test(v[k]))throw Error();p[k]=v[k];}if(['light','dark'].includes(v.theme))p.theme=v.theme;if('animate'in v&&typeof v.animate==='boolean')p.animate=v.animate;if(Number.isInteger(v.seed)&&v.seed>=0&&v.seed<=4294967295)p.seed=v.seed;mesh.set(p);sync();toast('配置已应用')}catch{toast('配置无效，请选择导出的 JSON 文件')}e.target.value=''};sync();

$('scene').addEventListener('renderstats',()=>sync());

function syncTheme(){let light=mesh.config.theme==='light';setIcon('themeToggle',light?'moon':'sun',light?'切换至深色皮肤':'切换至浅色皮肤');}
$('themeToggle').onclick=()=>{let theme=mesh.config.theme==='dark'?'light':'dark';mesh.set({theme});try{localStorage.setItem('cloud-mesh-theme',theme)}catch{}sync();syncTheme()};
try{let theme=localStorage.getItem('cloud-mesh-theme');if(theme==='light')mesh.set({theme})}catch{}sync();syncTheme();

function setIcon(id,name,label){
 const paths={
 sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/>',
 moon:'<path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z"/>',
 reset:'<path d="M3 10a9 9 0 1 1 2.6 8.4M3 4v6h6"/>',
 import:'<path d="M14 2H6a2 2 0 0 0-2 2v4m0 10v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Zm0 0v6h6M2 13h11m-4-4 4 4-4 4"/>',
 export:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2M14 2v6h6l-6-6M12 13h10m-4-4 4 4-4 4"/>',
 panel:'<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M15 3v18m3-12h.01M18 12h.01M18 15h.01"/>',
 pause:'<path d="M9 5v14M15 5v14"/>',
 play:'<path d="m8 5 11 7-11 7Z"/>',
 camera:'<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3Z"/><circle cx="12" cy="13" r="4"/>'
 };
 let el=$(id);if(el.dataset.icon!==name){el.innerHTML=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]}</svg>`;el.dataset.icon=name;}
 el.classList.add('icon-button');el.setAttribute('aria-label',tr(label));el.title=tr(label);
}
setIcon('reset','reset','重置');setIcon('export','export','导出配置');setIcon('panelToggle','panel','显示或隐藏参数面板');setIcon('capture','camera','保存画面 PNG');

function groupIcon(i){const paths=[
'<circle cx="6" cy="6" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/>',
'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
'<path d="M3 12c3-8 6 8 9 0s6 8 9 0M3 18c3-8 6 8 9 0s6 8 9 0"/>',
'<rect x="3" y="5" width="18" height="15" rx="3"/><circle cx="12" cy="12.5" r="4"/><path d="M8 5l1-2h6l1 2"/>'
];return `<svg class="group-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[i]}</svg>`}

setIcon('importBtn','import','导入配置');

// Animate native details while preserving keyboard activation and open semantics.
for(const section of document.querySelectorAll('#controls > details')){
 const summary=section.querySelector('summary');let animation=null,targetOpen=section.open;
 summary.addEventListener('click',event=>{
  event.preventDefault();targetOpen=!targetOpen;
  const start=section.getBoundingClientRect().height;
  if(animation){animation.onfinish=null;animation.cancel();animation=null;}
  section.style.height='';section.style.overflow='';
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){section.open=targetOpen;return;}
  section.open=true;
  const style=getComputedStyle(section);
  const closed=summary.getBoundingClientRect().height+parseFloat(style.paddingTop)+parseFloat(style.paddingBottom);
  const end=targetOpen?section.getBoundingClientRect().height:closed;
  section.style.overflow='hidden';
  animation=section.animate(targetOpen?[
   {height:start+'px',offset:0},{height:(end+5)+'px',offset:.76},{height:end+'px',offset:1}
  ]:[{height:start+'px',offset:0},{height:(start+2)+'px',offset:.12},{height:end+'px',offset:1}],
  {duration:targetOpen?420:300,easing:'cubic-bezier(.22,.8,.3,1)',fill:'both'});
  animation.onfinish=()=>{section.open=targetOpen;animation.cancel();animation=null;section.style.height='';section.style.overflow='';};
 });
}

// Direct scene manipulation; UI panels remain outside this pointer target.
{
 const scene=$('scene');let drag=null;
 const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
 scene.style.touchAction='none';
 scene.addEventListener('pointerdown',e=>{
  if(e.button!==0)return;
  drag={id:e.pointerId,x:e.clientX,y:e.clientY};scene.setPointerCapture(e.pointerId);scene.classList.add('dragging');
 });
 scene.addEventListener('pointermove',e=>{
  if(!drag||drag.id!==e.pointerId)return;
  let dx=e.clientX-drag.x,dy=e.clientY-drag.y;drag.x=e.clientX;drag.y=e.clientY;
  if(!dx&&!dy)return;
  mesh.set({automaticFraming:false,yaw:((mesh.config.yaw-dx*.3+540)%360)-180,tilt:clamp(mesh.config.tilt+dy*.3,-85,85)});sync();
 });
 const end=e=>{if(drag?.id!==e.pointerId)return;drag=null;scene.classList.remove('dragging');if(scene.hasPointerCapture(e.pointerId))scene.releasePointerCapture(e.pointerId)};
 scene.addEventListener('pointerup',end);scene.addEventListener('pointercancel',end);scene.addEventListener('lostpointercapture',()=>{drag=null;scene.classList.remove('dragging')});
 scene.addEventListener('wheel',e=>{e.preventDefault();let delta=e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?innerHeight:1);mesh.set({automaticFraming:false,zoom:clamp(mesh.config.zoom*Math.exp(-delta*.0015),.5,2)});sync()},{passive:false});
}

// Two-dimensional saturation/value palettes with a hue strip.
for(const [key,title] of [['trailColor','轨迹与涟漪颜色']]){
 const box=document.createElement('section');box.className='color-picker';box.innerHTML=`<div class="color-heading">${title}<span class="color-swatch"></span></div><div class="color-pad" role="slider" tabindex="0" aria-label="${title}饱和度与明度"><i></i></div><input class="hue-strip" type="range" min="0" max="360" step="1" aria-label="${title}色相"><div class="color-footer"><input class="hex-color" aria-label="${title}十六进制" maxlength="7" spellcheck="false"><button type="button">原始配色</button></div>`;
 document.querySelectorAll('#controls > details')[2].append(box);
 const pad=box.querySelector('.color-pad'),dot=pad.querySelector('i'),hue=box.querySelector('.hue-strip'),hex=box.querySelector('.hex-color'),swatch=box.querySelector('.color-swatch');let h=350,s=1,v=1,dragging=false;
 function rgb(){let c=v*s,x=c*(1-Math.abs((h/60)%2-1)),m=v-c;let a=h<60?[c,x,0]:h<120?[x,c,0]:h<180?[0,c,x]:h<240?[0,x,c]:h<300?[x,0,c]:[c,0,x];return '#'+a.map(n=>Math.round((n+m)*255).toString(16).padStart(2,'0')).join('')}
 function paint(){let color=rgb();pad.style.backgroundColor=`hsl(${h} 100% 50%)`;dot.style.left=s*100+'%';dot.style.top=(1-v)*100+'%';hue.value=h;hex.value=color.toUpperCase();swatch.style.background=color;pad.setAttribute('aria-valuetext',isEnglish()?`Saturation ${Math.round(s*100)}%, brightness ${Math.round(v*100)}%`:`饱和度 ${Math.round(s*100)}%，明度 ${Math.round(v*100)}%`);}
 function read(){if(dragging)return;let color=mesh.config[key]??(mesh.config.theme==='light'?'#be102b':'#ff1838');let n=parseInt(color.slice(1),16),r=(n>>16&255)/255,g=(n>>8&255)/255,b=(n&255)/255,max=Math.max(r,g,b),min=Math.min(r,g,b),d=max-min;v=max;s=max?d/max:0;if(d)h=((max===r?(g-b)/d:max===g?(b-r)/d+2:(r-g)/d+4)*60+360)%360;paint();box.dataset.custom=String(!!mesh.config[key]);}
 function apply(){paint();mesh.set({[key]:rgb()});box.dataset.custom='true';}
 function point(e){let r=pad.getBoundingClientRect();s=Math.max(0,Math.min(1,(e.clientX-r.left)/r.width));v=1-Math.max(0,Math.min(1,(e.clientY-r.top)/r.height));apply();}
 pad.onpointerdown=e=>{if(e.button!==0)return;e.preventDefault();dragging=true;pad.setPointerCapture(e.pointerId);point(e)};
 pad.onpointermove=e=>{if(dragging)point(e)};pad.onpointerup=pad.onpointercancel=()=>{dragging=false};pad.onlostpointercapture=()=>{dragging=false};
 pad.onkeydown=e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();let step=e.shiftKey?.1:.01;s=Math.max(0,Math.min(1,s+(e.key==='ArrowRight'?step:e.key==='ArrowLeft'?-step:0)));v=Math.max(0,Math.min(1,v+(e.key==='ArrowUp'?step:e.key==='ArrowDown'?-step:0)));apply()};
 hue.oninput=()=>{h=Number(hue.value);apply()};hex.oninput=()=>{if(/^#[0-9a-f]{6}$/i.test(hex.value)){mesh.set({[key]:hex.value.toLowerCase()});read()}};hex.onchange=()=>{if(/^#[0-9a-f]{6}$/i.test(hex.value)){mesh.set({[key]:hex.value.toLowerCase()});read()}else read()};box.querySelector('button').onclick=()=>{mesh.set({[key]:null});read()};document.addEventListener('colorsync',read);read();
}

document.addEventListener('languagechange',()=>{sync();setIcon('reset','reset','重置');setIcon('export','export','导出配置');setIcon('importBtn','import','导入配置');setIcon('panelToggle','panel','显示或隐藏参数面板');setIcon('capture','camera','保存画面 PNG');});
$('languageToggle').onclick=toggleLanguage;bindLanguage();
