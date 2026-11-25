(function(){
var s=document.querySelectorAll('.slide'),d=document.querySelectorAll('.dots button'),i=0,t;
function go(n){s[i].classList.remove('on');d[i].classList.remove('on');i=(n+s.length)%s.length;s[i].classList.add('on');d[i].classList.add('on')}
if(s.length){d.forEach(function(b,n){b.onclick=function(){go(n);clearInterval(t)}});
if(!matchMedia('(prefers-reduced-motion:reduce)').matches)t=setInterval(function(){go(i+1)},4500)}
var q=document.getElementById('q'),c=document.getElementById('cat'),cards=document.querySelectorAll('[data-cat]');
function f(){var w=q.value.toLowerCase();cards.forEach(function(x){
x.hidden=!((!c.value||x.dataset.cat==c.value)&&x.dataset.name.toLowerCase().indexOf(w)>-1)})}
if(q){q.oninput=f;c.onchange=f}
})();
