(function(){
  /* Early-bird countdown: shown only while the deadline is still ahead. */
  var out=document.getElementById('rgDaysLeft');
  if(out){
    var deadline=new Date('2026-11-15T23:59:59');
    var days=Math.ceil((deadline-new Date())/86400000);
    if(days>0){
      out.querySelector('b').textContent=days;
      out.querySelector('span').textContent=days===1?'day left at early-bird rates':'days left at early-bird rates';
      out.classList.add('is-on');
    }
  }

  /* Highlight the in-page tab for the section currently in view. */
  var tabs=[].slice.call(document.querySelectorAll('.rg-tab'));
  if(!tabs.length||!('IntersectionObserver' in window))return;
  var map={};
  tabs.forEach(function(t){var id=t.getAttribute('href').slice(1);var el=document.getElementById(id);if(el)map[id]={tab:t,el:el};});
  var ids=Object.keys(map);
  function setCurrent(id){tabs.forEach(function(t){var on=t===map[id].tab;t.classList.toggle('is-current',on);if(on)t.setAttribute('aria-current','true');else t.removeAttribute('aria-current');});
    var t=map[id].tab,list=t.parentNode.parentNode;
    if(list.scrollWidth>list.clientWidth){list.scrollTo({left:t.offsetLeft-list.clientWidth/2+t.clientWidth/2,behavior:'smooth'});}}
  function update(){
    var line=(parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--fixed-bars-h'))||206)+120;
    var cur=null;
    ids.forEach(function(id){if(map[id].el.getBoundingClientRect().top<=line)cur=id;});
    if(cur)setCurrent(cur);else tabs.forEach(function(t){t.classList.remove('is-current');});
  }
  var tick=false;
  window.addEventListener('scroll',function(){if(tick)return;tick=true;requestAnimationFrame(function(){update();tick=false;});},{passive:true});
  window.addEventListener('resize',update);
  update();
})();
