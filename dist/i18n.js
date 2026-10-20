const words={
'粒子场':'Particles','时间与形态':'Time & Shape','轨迹与涟漪':'Trails & Ripples','相机与构图':'Camera & Composition',
'显示粒子':'Show particles','原始自适应密度':'Original adaptive density','粒子数量上限':'Particle limit','空间厚度':'Depth','粒子大小':'Particle size','亮度':'Brightness',
'时间倍率':'Time scale','形态时间 / s':'Shape time / s','显示轨迹':'Show trails','节点涟漪':'Node ripples','同时显示轨迹':'Concurrent trails','轨迹速度':'Trail speed','轨迹不透明度':'Trail opacity','涟漪不透明度':'Ripple opacity','涟漪速度':'Ripple speed',
'原始自动取景':'Original auto framing','画面缩放':'Zoom','水平角度':'Yaw','俯仰角度':'Pitch','画面旋转':'Roll','原始景深':'Original depth of field','散景强度':'Bokeh strength','对焦范围':'Focus range','对焦深度':'Focus depth',
'星云':'Nebula','光环':'Halo','银河':'Galaxy','轨迹与涟漪颜色':'Trail & ripple color','原始配色':'Original colors',
'轨迹与涟漪颜色饱和度与明度':'Color saturation and brightness','轨迹与涟漪颜色色相':'Color hue','轨迹与涟漪颜色十六进制':'Hex color',
'切换至深色皮肤':'Switch to dark theme','切换至浅色皮肤':'Switch to light theme','暂停':'Pause','播放':'Play','重置':'Reset','导入配置':'Import configuration','导出配置':'Export configuration','显示或隐藏参数面板':'Toggle settings panel','保存画面 PNG':'Save image as PNG','配置导入与导出':'Import and export configuration','社交主页':'Social profiles',
'GitHub，链接待补充':'GitHub, link coming soon','小红书，链接待补充':'Xiaohongshu, link coming soon','GitHub · 链接待补充':'GitHub · link coming soon','小红书 · 链接待补充':'Xiaohongshu · link coming soon',
'已恢复原始参数':'Original settings restored','配置已导出':'Configuration exported','配置已应用':'Configuration applied','配置无效，请选择导出的 JSON 文件':'Invalid configuration. Choose an exported JSON file.',
'原始 WebGL 粒子动画，可通过右侧面板调节':'WebGL particle animation with adjustable settings'
};
let language='zh';
export function tr(s){return language==='en'?(words[s]??s):s}
export function isEnglish(){return language==='en'}
const texts=[],attributes=[];
export function bindLanguage(){const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);while(walker.nextNode()){let n=walker.currentNode;if(words[n.textContent.trim()])texts.push([n,n.textContent.trim()]);}for(const el of document.querySelectorAll('[aria-label],[title]'))for(const attr of ['aria-label','title']){let value=el.getAttribute(attr);if(words[value]&&!el.dataset.icon)attributes.push([el,attr,value]);}applyLanguage();}
function applyLanguage(){document.documentElement.lang=language==='en'?'en':'zh-CN';document.title=language==='en'?'Cloud Mesh - Particle Nebula':'Cloud Mesh - 粒子星云';for(const [node,value]of texts)node.textContent=tr(value);for(const [el,attr,value]of attributes)el.setAttribute(attr,tr(value));let button=document.getElementById('languageToggle');button.textContent=language==='en'?'中':'EN';button.title=language==='en'?'切换至中文':'Switch to English';button.setAttribute('aria-label',button.title);document.dispatchEvent(new Event('languagechange'));}
export function toggleLanguage(){language=language==='en'?'zh':'en';applyLanguage();}
