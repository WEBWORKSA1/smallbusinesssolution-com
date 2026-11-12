/* SmallBusinessSolution.com — core site script */
(function(){
"use strict";
var $=function(s,c){return(c||document).querySelector(s)},$$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
var store={get:function(k){try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}},set:function(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
/* contact address is assembled at runtime only — never present in page text */
function addr(){return [126,108,105,126,118,121,114,122,104,56,71,110,116,104,112,115,53,106,118,116].map(function(c){return String.fromCharCode(c-7)}).join("")}
window.SBS={store:store,addr:addr};

$$(".js-year").forEach(function(e){e.textContent=new Date().getFullYear()});

/* mobile menu + active link */
var mb=$(".menu-btn"),nav=$("#nav");
if(mb){mb.addEventListener("click",function(){var o=nav.classList.toggle("open");mb.setAttribute("aria-expanded",o)})}
var p=location.pathname;$$("#nav a").forEach(function(a){var h=a.getAttribute("href");if(h!=="/"&&(p===h||(h.length>6&&p.indexOf(h.replace(".html",""))===0)))a.classList.add("on")});

/* mail links */
$$("[data-mail]").forEach(function(a){a.addEventListener("click",function(e){e.preventDefault();location.href="mailto:"+addr()+"?subject="+encodeURIComponent(a.getAttribute("data-mail")||"Inquiry from SmallBusinessSolution.com")})});

/* forms → AJAX relay to the private inbox */
function sendForm(f,extra){
  var data={},fd=new FormData(f);fd.forEach(function(v,k){data[k]=data[k]?data[k]+", "+v:v});
  if(data._honey)return Promise.resolve(true);delete data._honey;
  for(var k in extra||{})data[k]=extra[k];
  data._subject=(f.getAttribute("data-subject")||"Website form")+" — SmallBusinessSolution.com";
  data._template="table";data.page=location.href;data.submitted=new Date().toString();
  return fetch("https://formsubmit.co/ajax/"+addr(),{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify(data)}).then(function(r){if(!r.ok)throw 0;return true});
}
window.SBS.sendForm=sendForm;
$$("form.js-form").forEach(function(f){f.addEventListener("submit",function(e){
  e.preventDefault();var m=$(".form-msg",f),b=$("button[type=submit]",f);if(b){b.disabled=true;b.dataset.t=b.textContent;b.textContent="Sending…"}
  var extra=f._extra?f._extra():null;
  sendForm(f,extra).then(function(){
    if(m){m.className="form-msg ok";m.textContent=f.getAttribute("data-ok")||"Thanks — we received your message."}
    f.reset();if(f.id)localStorage.removeItem("sbs_"+f.id);
    store.set("sbs_lead",1);var r=f.getAttribute("data-redirect");if(r)setTimeout(function(){location.href=r},1600);
    if(f.onSent)f.onSent();
  }).catch(function(){if(m){m.className="form-msg err";m.textContent="Sorry, that didn't go through. Please check your connection and try again."}})
  .then(function(){if(b){b.disabled=false;b.textContent=b.dataset.t}});
})});

/* cookie consent */
var ck=$(".cookie");if(ck&&!store.get("sbs_cookie")){ck.hidden=false}
$$(".js-cookie").forEach(function(b){b.addEventListener("click",function(){store.set("sbs_cookie",b.dataset.v);ck.hidden=true;if(b.dataset.v==="essential"){(window.adsbygoogle=window.adsbygoogle||[]).requestNonPersonalizedAds=1}})});
if(store.get("sbs_cookie")==="essential"){(window.adsbygoogle=window.adsbygoogle||[]).requestNonPersonalizedAds=1}

/* exit-intent lead magnet (desktop, once per session, never after a lead) */
var md=$("#exit-modal");
function closeM(){md.hidden=true}
if(md){$(".modal-x",md).addEventListener("click",closeM);md.addEventListener("click",function(e){if(e.target===md)closeM()});document.addEventListener("keydown",function(e){if(e.key==="Escape")closeM()});
  var armed=false;setTimeout(function(){armed=true},9000);
  document.addEventListener("mouseout",function(e){
    if(!armed||e.clientY>8||e.relatedTarget||sessionStorage.getItem("sbs_exit")||store.get("sbs_lead")||/get-matched/.test(p))return;
    sessionStorage.setItem("sbs_exit",1);md.hidden=false;var i=$("input[type=email]",md);if(i)i.focus();
  });
}

/* tip of the day — rotates automatically by date */
var tips=[
["💵","Pay yourself a fixed amount on a fixed day. Irregular owner draws are the #1 reason small businesses misread their real profit."],
["🧾","Send invoices the same day the work is done. Every day of delay adds roughly a day to when you get paid."],
["📈","Raise prices on new customers first. It's the lowest-risk way to test demand at a higher price."],
["🏦","Keep business and personal money in separate accounts — it makes taxes, loans and audits dramatically easier."],
["⭐","Ask for a review within 24 hours of a happy moment. Review requests sent later get a fraction of the response."],
["🔐","Turn on two-factor authentication for email, banking and your website host today. It blocks most account takeovers."],
["⏱️","Track one number weekly: cash in the bank. Profit is an opinion; cash is a fact."],
["🤝","Your best new customers usually come from existing ones. Give happy clients a simple, specific way to refer you."],
["📊","Know your break-even. If you don't know how many sales cover fixed costs, you can't price or plan with confidence."],
["🧮","Set aside 25–30% of profit for taxes in a separate account so tax season isn't a cash crisis."],
["📍","Claim and complete your free Google Business Profile — it's often the highest-ROI marketing a local business can do."],
["🧑‍💼","Write down how you do your 5 most repeated tasks. Documented processes are what let you hire, delegate and sell."],
["💳","Offer at least two ways to pay. Removing payment friction raises conversion more than most ad spend."],
["📅","Review subscriptions quarterly. Small recurring software charges quietly add up to thousands a year."],
["📞","Answer leads within an hour. Response speed is one of the strongest predictors of winning a job."],
["🎯","Pick one marketing channel and do it well for 90 days before adding another."],
["📦","Your top 20% of products or clients usually drive most profit. Find them, then do more of that."],
["🧯","Keep 3 months of fixed costs as an emergency buffer before you expand."],
["✍️","Put every client agreement in writing — even a one-page scope and payment terms prevents most disputes."],
["🔁","Turn one-off services into a monthly plan where you can. Recurring revenue makes a business more stable and more valuable."]
];
var te=$("#tip");if(te){var d=Math.floor((Date.now()-new Date(new Date().getFullYear(),0,0))/864e5),t=tips[d%tips.length];te.innerHTML='<span class="ic" aria-hidden="true">'+t[0]+'</span><p style="margin:0">'+t[1]+'</p>'}

/* upcoming deadlines — computed, never stale */
var dl=$("#deadlines");
if(dl){var now=new Date(),y=now.getFullYear(),list=[],ev=[[0,15,"US Q4 estimated tax payment (prior year)"],[0,31,"W-2 / 1099-NEC forms due to workers (US)"],[2,15,"US S-corp & partnership returns"],[3,15,"US individual return + Q1 estimated tax"],[3,30,"Canada personal income tax filing"],[5,15,"US Q2 estimated tax / Canada self-employed filing"],[8,15,"US Q3 estimated tax"],[11,31,"Year-end: last day for this year's deductible purchases"]];
  [y,y+1].forEach(function(yy){ev.forEach(function(e){var dt=new Date(yy,e[0],e[1],23,59);if(dt>=now)list.push([dt,e[2]])})});
  list.sort(function(a,b){return a[0]-b[0]});
  dl.innerHTML=list.slice(0,4).map(function(x){var n=Math.ceil((x[0]-now)/864e5);return "<li><span>"+x[1]+"<br><small class='muted'>"+x[0].toLocaleDateString(undefined,{month:"short",day:"numeric",year:"numeric"})+"</small></span><b>"+n+"d</b></li>"}).join("")}

/* countdown to end of current month (contest) */
function tick(){var n=new Date(),end=new Date(n.getFullYear(),n.getMonth()+1,0,23,59,59),s=Math.max(0,(end-n)/1e3);
  $$(".js-count").forEach(function(c){c.innerHTML=[[Math.floor(s/86400),"days"],[Math.floor(s%86400/3600),"hrs"],[Math.floor(s%3600/60),"min"],[Math.floor(s%60),"sec"]].map(function(v){return"<div><b>"+v[0]+"</b><small>"+v[1]+"</small></div>"}).join("")});
  $$(".js-month").forEach(function(c){c.textContent=n.toLocaleDateString(undefined,{month:"long",year:"numeric"})});}
if($(".js-count")||$(".js-month")){tick();setInterval(tick,1000)}

/* lite YouTube embeds */
function vid(el){var id=el.dataset.id;el.style.backgroundImage="url(https://i.ytimg.com/vi/"+id+"/hqdefault.jpg)";el.setAttribute("aria-label","Play video: "+(el.dataset.title||""));
  el.addEventListener("click",function(){if(el.classList.contains("playing"))return;el.classList.add("playing");el.innerHTML='<iframe src="https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&rel=0" title="'+(el.dataset.title||"Video")+'" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>'})}
$$(".vid[data-id]").forEach(vid);

/* auto-updating feeds (refreshed daily by GitHub Actions) */
function esc(s){return String(s||"").replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
var nl=$("#news-list");
if(nl){fetch("/assets/data/news.json",{cache:"no-cache"}).then(function(r){return r.json()}).then(function(j){var it=(j.items||[]).slice(0,+nl.dataset.limit||30);
  if(!it.length)return;nl.innerHTML=it.map(function(i){return'<a class="news-item" href="'+esc(i.link)+'" target="_blank" rel="noopener nofollow"><b>'+esc(i.title)+'</b><small>'+esc(i.source)+(i.date?" · "+new Date(i.date).toLocaleDateString():"")+'</small></a>'}).join("");
  var u=$("#news-updated");if(u&&j.updated)u.textContent="Updated "+new Date(j.updated).toLocaleString()}).catch(function(){})}
var vl=$("#latest-videos");
if(vl){fetch("/assets/data/videos.json",{cache:"no-cache"}).then(function(r){return r.json()}).then(function(j){var it=(j.items||[]).slice(0,+vl.dataset.limit||6);if(!it.length)return;
  vl.innerHTML=it.map(function(i){return'<div class="card"><button class="vid" data-id="'+esc(i.id)+'" data-title="'+esc(i.title)+'"></button><h3 style="margin-top:12px;font-size:1rem">'+esc(i.title)+'</h3><p>'+esc(i.channel)+'</p></div>'}).join("");$$(".vid[data-id]",vl).forEach(vid)}).catch(function(){})}

/* multi-step wizard (Get Matched, provider signup) */
$$("form.wizard").forEach(function(f){
  var steps=$$(".step",f),bar=$(".steps",f),i=0,key="sbs_"+f.id;
  if(bar)bar.innerHTML=steps.map(function(){return"<span></span>"}).join("");
  function show(n){i=n;steps.forEach(function(s,k){s.classList.toggle("on",k===n)});if(bar)$$("span",bar).forEach(function(s,k){s.classList.toggle("on",k<=n)});
    var c=$(".step-count",f);if(c)c.textContent="Step "+(n+1)+" of "+steps.length;}
  function valid(){var ok=true;$$("input,select,textarea",steps[i]).forEach(function(el){if(!el.checkValidity()){ok=false}});
    if(!ok){var bad=$$("input,select,textarea",steps[i]).filter(function(el){return!el.checkValidity()})[0];if(bad)bad.reportValidity()}return ok}
  $$("[data-next]",f).forEach(function(b){b.addEventListener("click",function(){if(valid()&&i<steps.length-1){show(i+1);f.scrollIntoView({behavior:"smooth",block:"start"})}})});
  $$("[data-prev]",f).forEach(function(b){b.addEventListener("click",function(){if(i>0)show(i-1)})});
  /* autosave + restore */
  var saved=store.get(key)||{};
  $$("input,select,textarea",f).forEach(function(el){if(!el.name||el.name.charAt(0)==="_")return;var v=saved[el.name];if(v==null)return;
    if(el.type==="radio"||el.type==="checkbox"){el.checked=[].concat(v).indexOf(el.value)>-1}else el.value=v});
  f.addEventListener("input",function(){var o={};new FormData(f).forEach(function(v,k){if(k.charAt(0)!=="_")o[k]=o[k]?[].concat(o[k],v):v});store.set(key,o)});
  /* prefill from ?need= */
  var cx=$('input[name="tool_result"]',f);if(cx){try{cx.value=sessionStorage.getItem("sbs_ctx")||localStorage.getItem("sbs_last_result")||""}catch(e){}}
  var q=new URLSearchParams(location.search).get("need");if(q){var r=$('input[name="need"][value="'+q+'"]',f);if(r)r.checked=true}
  f.onSent=function(){localStorage.removeItem(key);show(0);var t=$(".thanks",f.parentNode);if(t){f.hidden=true;t.hidden=false;t.scrollIntoView({behavior:"smooth"})}};
  show(0);
});

/* hero quick break-even */
var qb=$("#quick-be");
if(qb){var fx=$("#qb-fixed"),pr=$("#qb-price"),vc=$("#qb-var"),out=$("#qb-out"),sub=$("#qb-sub");
  function q(){var F=+fx.value||0,P=+pr.value||0,V=+vc.value||0,m=P-V;if(m<=0){out.textContent="—";sub.textContent="Price must be higher than cost per sale.";return}
    var u=Math.ceil(F/m);out.textContent=u.toLocaleString()+" sales";sub.textContent="per month to cover $"+F.toLocaleString()+" in fixed costs ($"+(u*P).toLocaleString()+" revenue)."}
  [fx,pr,vc].forEach(function(e){e.addEventListener("input",q)});q()}
})();
