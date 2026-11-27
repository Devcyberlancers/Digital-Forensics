/* Page-at-a-time PDF reading surface. No print, save or download controls. */
(()=>{
 'use strict';
 const create=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text)e.textContent=text;return e;};
 async function open(data,slot){
  if(!window.pdfjsLib)throw Error('PDF reader library missing');
  const loading=pdfjsLib.getDocument({data,useSystemFonts:true,useWorkerFetch:false,useWasm:false,isEvalSupported:false});
  const pdf=await loading.promise;
  const root=create('div','case-reader'),controls=create('div','case-reader-controls'),previous=create('button','case-action','Previous'),next=create('button','case-action','Next');
  const label=create('label','case-reader-page-label','Page '),pageInput=create('input'),total=create('span','',` of ${pdf.numPages}`),go=create('button','case-action','Go');
  pageInput.type='number';pageInput.min='1';pageInput.max=String(pdf.numPages);pageInput.value='1';pageInput.setAttribute('aria-label','Walkthrough page');label.append(pageInput,total);
  const smaller=create('button','case-action','−'),larger=create('button','case-action','+'),zoomText=create('span','','Fit width');
  smaller.setAttribute('aria-label','Zoom out');larger.setAttribute('aria-label','Zoom in');
  for(const b of [previous,next,go,smaller,larger])b.type='button';controls.append(previous,label,go,next,smaller,zoomText,larger);
  const status=create('p','case-reader-status','Loading page…');status.setAttribute('role','status');status.setAttribute('aria-live','polite');
  const scroll=create('div','case-reader-scroll'),canvas=create('canvas'),accessible=create('div','case-reader-text');
  canvas.setAttribute('role','img');scroll.append(canvas);root.append(controls,status,scroll,accessible);slot.replaceChildren(root);
  let pageNumber=1,zoom=1,renderTask=null,dead=false,sequence=0;
  async function render(){
   const token=++sequence;if(renderTask){renderTask.cancel();renderTask=null;}
   status.textContent=`Loading page ${pageNumber} of ${pdf.numPages}…`;
   previous.disabled=pageNumber<=1;next.disabled=pageNumber>=pdf.numPages;pageInput.value=String(pageNumber);
   try{
    const page=await pdf.getPage(pageNumber);if(dead||token!==sequence)return;
    const natural=page.getViewport({scale:1});const width=Math.max(240,(scroll.clientWidth||slot.clientWidth||900)-32);
    const viewport=page.getViewport({scale:(width/natural.width)*zoom}),ratio=Math.min(window.devicePixelRatio||1,2);
    canvas.width=Math.ceil(viewport.width*ratio);canvas.height=Math.ceil(viewport.height*ratio);canvas.style.width=viewport.width+'px';canvas.style.height=viewport.height+'px';
    canvas.setAttribute('aria-label',`Walkthrough page ${pageNumber} of ${pdf.numPages}`);
    renderTask=page.render({canvasContext:canvas.getContext('2d'),viewport,transform:ratio!==1?[ratio,0,0,ratio,0,0]:null});await renderTask.promise;
    if(dead||token!==sequence)return;renderTask=null;status.textContent=`Page ${pageNumber} of ${pdf.numPages}`;scroll.scrollTop=0;
    zoomText.textContent=zoom===1?'Fit width':Math.round(zoom*100)+'%';
    const text=await page.getTextContent();if(!dead&&token===sequence)accessible.textContent=text.items.map(i=>i.str).join(' ');
   }catch(error){if(!dead&&token===sequence&&error.name!=='RenderingCancelledException')status.textContent='Could not render this page. Try reopening the walkthrough in a current browser.';}
  }
  previous.addEventListener('click',()=>{if(pageNumber>1){pageNumber--;render();}});
  next.addEventListener('click',()=>{if(pageNumber<pdf.numPages){pageNumber++;render();}});
  function jump(){const n=Number(pageInput.value);if(Number.isInteger(n)&&n>=1&&n<=pdf.numPages){if(n!==pageNumber){pageNumber=n;render();}}else pageInput.value=String(pageNumber);}
  pageInput.addEventListener('change',jump);go.addEventListener('click',jump);pageInput.addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();jump();}});
  smaller.addEventListener('click',()=>{zoom=Math.max(.5,zoom-.25);render();});larger.addEventListener('click',()=>{zoom=Math.min(2,zoom+.25);render();});
  await render();
  return {destroy(){dead=true;sequence++;renderTask?.cancel();loading.destroy();slot.replaceChildren();}};
 }
 window.DFIRPdfReader={open};
})();
