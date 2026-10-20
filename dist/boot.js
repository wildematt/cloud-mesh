// Keep the initial UI consistent while the renderer module loads.
const status=document.getElementById('boot-status');
const slow=setTimeout(()=>{status.textContent='加载时间较长，请稍候…'},12000);
try {
  await import('./app.js?v=23');
  clearTimeout(slow);
  document.body.classList.remove('booting');
  status.remove();
} catch(error) {
  clearTimeout(slow);
  console.error('Cloud Mesh initialization failed',error);
  status.textContent='加载失败，请重试';
  const retry=document.createElement('button');
  retry.textContent='重新加载';
  retry.onclick=()=>location.reload();
  status.append(retry);
}
