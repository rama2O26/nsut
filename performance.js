document.addEventListener('visibilitychange',function(){
document.documentElement.classList.toggle('page-hidden',document.hidden);
},{passive:true});