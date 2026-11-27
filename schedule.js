/* RAM&A 2026 — interactive schedule. Reads window.RAMA_DATA (schedule-data.js). */
(function(){
var D=window.RAMA_DATA; if(!D) return;
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function tm(h){var p=h.split(':');return (+p[0])*60+(+p[1]);}
function fmt(m){return ('0'+Math.floor(m/60)).slice(-2)+':'+('0'+m%60).slice(-2);}
function slots(b){var s=tm(b.start),e=tm(b.end),n=b.n,L=(e-s)/n,out=[];for(var i=0;i<n;i++)out.push(fmt(Math.round(s+i*L))+'–'+fmt(Math.round(s+(i+1)*L)));return out;}
function talksFor(ms,blk){return ((D.talks||{})[ms]||{})[blk]||[];}
function roomOf(ms){return (D.rooms||{})[ms]||'';}
function blockList(ms,blk,showTimes){
  var b=D.blocks[blk],sl=slots(b),t=talksFor(ms,blk),h='<ol class="ss-talks">';
  for(var i=0;i<b.n;i++){var x=t[i];
    h+='<li><span class="ss-t">'+sl[i]+'</span>'+(x?'<span class="ss-x"><b>'+esc(x.title||'Title to be announced')+'</b><em>'+esc(x.speaker||'')+(x.affil?', '+esc(x.affil):'')+'</em></span>':'<span class="ss-x ss-tba">Talk to be announced</span>')+'</li>';}
  return h+'</ol>';
}
/* ---------- dialog on schedule page ---------- */
var dlg;
function ensureDialog(){
  if(dlg) return dlg;
  dlg=document.createElement('dialog');dlg.className='sch-dialog';dlg.setAttribute('aria-labelledby','sch-dlg-title');
  dlg.innerHTML='<div class="sch-dlg-in"><button type="button" class="sch-dlg-x" aria-label="Close">×</button><div id="sch-dlg-body"></div></div>';
  document.body.appendChild(dlg);
  dlg.addEventListener('click',function(e){if(e.target===dlg||e.target.closest('.sch-dlg-x'))dlg.close();});
  dlg.addEventListener('close',function(){document.documentElement.classList.remove('sch-lock');if(dlg._from)dlg._from.focus();});
  return dlg;
}
function open(html,from){var d=ensureDialog();document.getElementById('sch-dlg-body').innerHTML=html;d._from=from;document.documentElement.classList.add('sch-lock');if(d.showModal)d.showModal();else d.setAttribute('open','');d.querySelector('.sch-dlg-in').scrollTop=0;}
var DAYN={'22':'Tuesday 22 December','23':'Wednesday 23 December','24':'Thursday 24 December'};
function keynote(day,slot,from){
  var id=(D.keynoteSlots||{})[day+'-'+slot],sp=id&&D.keynoteSpeakers[id],t=D.keynoteTimes[slot],h;
  h='<p class="sch-dlg-kick">Keynote Lecture '+slot+' · '+DAYN[day]+' · '+t[0]+'–'+t[1]+'</p>';
  if(sp){
    h+='<div class="sch-kn-card">'+(sp.photo?'<img src="'+esc(sp.photo)+'" alt="'+esc(sp.name)+'" width="120" height="120">':'')+'<div><h2 id="sch-dlg-title">'+(sp.url?'<a href="'+esc(sp.url)+'" target="_blank" rel="noopener">'+esc(sp.name)+'</a>':esc(sp.name))+'</h2><p class="sch-kn-aff">'+esc(sp.affil)+'</p></div></div>'+
       '<h3 class="sch-dlg-h">Title of talk</h3><p class="sch-kn-talk">'+(sp.talk?esc(sp.talk):'To be announced')+'</p>'+(sp.abstract?'<p>'+esc(sp.abstract)+'</p>':'');
  } else {
    h+='<h2 id="sch-dlg-title">Speaker to be announced</h2><p class="sch-kn-aff">Speaker, affiliation and talk title for this lecture will be published here shortly.</p>';
  }
  h+='<p class="sch-dlg-foot"><a href="speakers.html">See all keynote speakers →</a></p>';
  open(h,from);
}
function block(blk,from){
  var b=D.blocks[blk],h='<p class="sch-dlg-kick">'+esc(b.date)+' · '+b.start+'–'+b.end+' · '+(b.mode==='online'?'Online':'In person')+'</p><h2 id="sch-dlg-title">'+(b.mode==='online'?'Online Presentations':'Contributed Talks')+': parallel sessions</h2><p class="sch-dlg-sub">'+b.n+' talks in each of the 11 symposia'+(b.mode==='online'?' (online)':'')+'. Select a symposium to see its full schedule.</p><div class="sch-sym-grid">';
  D.symposia.forEach(function(s){
    var r=roomOf(s.id);
    h+='<details class="sch-sym"><summary><span class="sch-sym-no">MS'+s.no+'</span><a href="symposium-schedule.html#'+s.id+'">'+esc(s.title)+'</a><span class="sch-sym-room">'+(b.mode==='online'?'Online':(r?esc(r):'Room TBA'))+'<i class="sch-chev" aria-hidden="true">▾</i></span></summary>'+blockList(s.id,blk)+'</details>';
  });
  h+='</div>';
  open(h,from);
}
document.addEventListener('click',function(e){
  var t=e.target.closest&&e.target.closest('.sch-hit'); if(!t) return;
  if(t.dataset.kind==='kn') keynote(t.dataset.day,t.dataset.slot,t); else block(t.dataset.block,t);
});
/* ---------- symposium-schedule page ---------- */
var list=document.getElementById('ss-list'),chips=document.getElementById('ss-chips');
if(list){
  var order=['22-pm','22-on','23-am','23-pm','23-on','24-am','24-pm'];
  chips.innerHTML=D.symposia.map(function(s){return '<a href="#'+s.id+'" title="'+esc(s.title)+'">MS'+s.no+'</a>';}).join('');
  list.innerHTML=D.symposia.map(function(s){
    var r=roomOf(s.id);
    return '<article class="ss-card" id="'+s.id+'"><header><span class="ss-no">Symposium '+s.no+'</span><h3>'+esc(s.title)+'</h3><p>Conveners: '+s.conveners.map(esc).join(', ')+(r?' · Venue: '+esc(r):'')+'</p><a class="sym-sched-link" href="symposiums.html#'+s.id+'">Topics &amp; details →</a></header>'+
      order.map(function(k){var b=D.blocks[k];return '<div class="ss-block ss-'+b.mode+'"><h4>'+esc(b.date)+' · '+b.start+'–'+b.end+'<span class="ss-mode">'+(b.mode==='online'?'Online':'In person')+'</span></h4>'+blockList(s.id,k)+'</div>';}).join('')+'</article>';
  }).join('');
  if(location.hash){var el=document.getElementById(location.hash.slice(1));if(el)window.addEventListener('load',function(){setTimeout(function(){el.scrollIntoView();},150);});}
}
})();
