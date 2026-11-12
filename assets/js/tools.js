/* SmallBusinessSolution.com — calculators & generators (all client-side; nothing leaves the browser unless you submit a form) */
(function(){
"use strict";
var $=function(s,c){return(c||document).querySelector(s)},$$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
var root=$("[data-tool]");if(!root)return;var T=root.dataset.tool;
var money=function(n,d){return(n<0?"-":"")+"$"+Math.abs(n).toLocaleString(undefined,{minimumFractionDigits:d==null?0:d,maximumFractionDigits:d==null?0:d})};
var pct=function(n){return(isFinite(n)?n.toFixed(1):"—")+"%"};
var v=function(id){var e=$("#"+id);return e?parseFloat(e.value)||0:0};
function on(fn){root.addEventListener("input",fn);root.addEventListener("change",fn);fn()}
function rows(dl,a){$(dl).innerHTML=a.map(function(r){return"<dt>"+r[0]+"</dt><dd>"+r[1]+"</dd>"}).join("")}
/* share the calculated result with the lead form */
function remember(summary){try{localStorage.setItem("sbs_last_result",summary)}catch(e){}}

var tools={
loan:function(){on(function(){
  var P=v("amt"),r=v("rate")/1200,n=Math.max(1,Math.round(v("term"))),fee=v("fee")/100*P;
  var pay=r?P*r/(1-Math.pow(1+r,-n)):P/n,tot=pay*n,int=tot-P;
  $("#out").textContent=money(pay,2);
  rows("#dl",[["Total interest",money(int)],["Origination fee",money(fee)],["Total cost of loan",money(int+fee)],["Total repaid",money(tot+fee)],["Payments",n+" monthly"]]);
  var bal=P,h="",yr={};for(var k=1;k<=n;k++){var i=bal*r,pr=pay-i;bal=Math.max(0,bal-pr);var y=Math.ceil(k/12);yr[y]=yr[y]||[0,0,0];yr[y][0]+=pr;yr[y][1]+=i;yr[y][2]=bal}
  for(var y2 in yr)h+="<tr><td>Year "+y2+"</td><td>"+money(yr[y2][0])+"</td><td>"+money(yr[y2][1])+"</td><td>"+money(yr[y2][2])+"</td></tr>";
  $("#amort").innerHTML=h;remember("Loan "+money(P)+" at "+v("rate")+"% for "+n+" months = "+money(pay,2)+"/mo");
})},
breakeven:function(){on(function(){
  var F=v("fixed"),P=v("price"),V=v("varc"),G=v("target"),m=P-V;
  if(m<=0){$("#out").textContent="Not reachable";rows("#dl",[["Why","Each sale loses money — raise price or cut cost per sale"]]);return}
  var u=Math.ceil(F/m),ut=Math.ceil((F+G)/m);
  $("#out").textContent=u.toLocaleString()+" units";
  rows("#dl",[["Break-even revenue",money(u*P)],["Contribution margin / unit",money(m,2)],["Contribution margin %",pct(m/P*100)],["Units for target profit",ut.toLocaleString()],["Revenue for target profit",money(ut*P)],["Per day (30-day month)",(u/30).toFixed(1)+" units"]]);
  remember("Break-even: "+u+" units/mo ("+money(u*P)+")");
})},
margin:function(){on(function(){
  var c=v("cost"),p=v("price"),tm=v("tmargin"),tk=v("tmarkup"),g=p-c;
  $("#out").textContent=p?pct(g/p*100):"—";
  rows("#dl",[["Gross profit / unit",money(g,2)],["Markup on cost",c?pct(g/c*100):"—"],["Price for "+tm+"% margin",tm<100?money(c/(1-tm/100),2):"—"],["Price for "+tk+"% markup",money(c*(1+tk/100),2)],["Units to earn $1,000 profit",g>0?Math.ceil(1000/g).toLocaleString():"—"]]);
  remember("Margin "+(p?pct(g/p*100):"—")+" on cost "+money(c,2)+" / price "+money(p,2));
})},
startup:function(){
  var key="sbs_startup",def=[["Business registration & licences",500,"once"],["Legal & accounting setup",1200,"once"],["Website & domain",1500,"once"],["Equipment & tools",5000,"once"],["Initial inventory / supplies",3000,"once"],["Branding & signage",800,"once"],["Rent / workspace",1500,"monthly"],["Software subscriptions",150,"monthly"],["Insurance",120,"monthly"],["Marketing",600,"monthly"],["Utilities & phone",200,"monthly"],["Owner pay",3000,"monthly"]];
  var data;try{data=JSON.parse(localStorage.getItem(key))||def}catch(e){data=def}
  var tb=$("#items");
  function draw(){tb.innerHTML=data.map(function(r,i){return'<tr><td><input aria-label="Item" data-i="'+i+'" data-k="0" value="'+String(r[0]).replace(/"/g,"&quot;")+'"></td><td><input aria-label="Amount" type="number" min="0" data-i="'+i+'" data-k="1" value="'+r[1]+'"></td><td><select aria-label="Frequency" data-i="'+i+'" data-k="2"><option value="once"'+(r[2]==="once"?" selected":"")+'>One-time</option><option value="monthly"'+(r[2]==="monthly"?" selected":"")+'>Monthly</option></select></td><td><button type="button" class="btn btn-ghost" data-del="'+i+'" aria-label="Remove">×</button></td></tr>'}).join("");calc()}
  function calc(){var once=0,mo=0;data.forEach(function(r){if(r[2]==="once")once+=+r[1]||0;else mo+=+r[1]||0});var m=v("months"),buf=v("buffer")/100,tot=(once+mo*m)*(1+buf);
    $("#out").textContent=money(tot);rows("#dl",[["One-time costs",money(once)],["Monthly costs",money(mo)],["Months of runway",m],["Safety buffer",pct(buf*100)],["Total to raise / save",money(tot)]]);
    try{localStorage.setItem(key,JSON.stringify(data))}catch(e){}remember("Startup budget "+money(tot)+" ("+money(once)+" one-time + "+money(mo)+"/mo)")}
  tb.addEventListener("input",function(e){var t=e.target;if(t.dataset.i){data[t.dataset.i][t.dataset.k]=t.dataset.k==="1"?parseFloat(t.value)||0:t.value;calc()}});
  tb.addEventListener("change",function(e){var t=e.target;if(t.tagName==="SELECT"){data[t.dataset.i][2]=t.value;calc()}});
  tb.addEventListener("click",function(e){var d=e.target.dataset.del;if(d!=null){data.splice(+d,1);draw()}});
  $("#add").addEventListener("click",function(){data.push(["New item",0,"once"]);draw()});
  $("#reset").addEventListener("click",function(){data=JSON.parse(JSON.stringify(def));draw()});
  $("#months").addEventListener("input",calc);$("#buffer").addEventListener("input",calc);draw();
},
runway:function(){on(function(){
  var cash=v("cash"),rev=v("rev"),exp=v("exp"),g=v("growth")/100,burn=exp-rev,m=0,c=cash,r=rev,pos=null;
  while(m<120){c+=r-exp;m++;if(pos===null&&r>=exp)pos=m;if(c<0)break;r*=1+g}
  var txt=c>=0?"120+ months":m+" months";$("#out").textContent=txt;
  rows("#dl",[["Current monthly burn",burn>0?money(burn):"Profitable"],["Simple runway (no growth)",burn>0?(cash/burn).toFixed(1)+" months":"Indefinite"],["Months to break-even",pos?pos:"Not within 10 yrs"],["Cash-out date",c>=0?"Not within 10 yrs":new Date(new Date().setMonth(new Date().getMonth()+m)).toLocaleDateString(undefined,{month:"short",year:"numeric"})]]);
  remember("Runway "+txt+" (cash "+money(cash)+", burn "+money(burn)+")");
})},
employee:function(){on(function(){
  var sal=v("salary"),tax=v("ptax")/100,ben=v("benefits")*12,eq=v("equip"),rec=v("recruit"),tr=v("training"),pto=v("pto"),hrs=v("hours");
  var total=sal*(1+tax)+ben+eq+rec+tr,work=Math.max(1,(52*hrs)-(pto*hrs/5));
  $("#out").textContent=money(total);
  rows("#dl",[["Payroll taxes & insurance",money(sal*tax)],["Benefits (yearly)",money(ben)],["Equipment, software & other",money(eq+rec+tr)],["Cost multiplier vs salary",(total/sal||0).toFixed(2)+"×"],["Cost per productive hour",money(total/work,2)],["Monthly cost",money(total/12)]]);
  remember("Employee true cost "+money(total)+"/yr on "+money(sal)+" salary");
})},
invoice:function(){
  var key="sbs_invoice",items=$("#inv-items");
  function row(d){d=d||["",1,0];var tr=document.createElement("tr");tr.innerHTML='<td><input aria-label="Description" class="d" value="'+String(d[0]).replace(/"/g,"&quot;")+'" placeholder="Service or product"></td><td style="width:80px"><input aria-label="Quantity" class="q" type="number" min="0" step="any" value="'+d[1]+'"></td><td style="width:120px"><input aria-label="Rate" class="r" type="number" min="0" step="any" value="'+d[2]+'"></td><td class="amt" style="width:110px;text-align:right;font-family:var(--mono)"></td><td class="no-print" style="width:44px"><button type="button" class="btn btn-ghost x" aria-label="Remove line">×</button></td>';items.appendChild(tr)}
  function calc(){var cur=$("#cur").value,sub=0;$$("tr",items).forEach(function(tr){var a=(+$(".q",tr).value||0)*(+$(".r",tr).value||0);sub+=a;$(".amt",tr).textContent=cur+a.toFixed(2)});
    var disc=v("disc"),tax=(sub-disc)*v("tax")/100,tot=sub-disc+tax;$("#i-sub").textContent=cur+sub.toFixed(2);$("#i-disc").textContent="-"+cur+disc.toFixed(2);$("#i-tax").textContent=cur+tax.toFixed(2);$("#i-tot").textContent=cur+tot.toFixed(2);save()}
  function save(){var o={f:{},l:[]};$$("[data-s]").forEach(function(e){o.f[e.id]=e.value});$$("tr",items).forEach(function(tr){o.l.push([$(".d",tr).value,$(".q",tr).value,$(".r",tr).value])});try{localStorage.setItem(key,JSON.stringify(o))}catch(e){}}
  var o;try{o=JSON.parse(localStorage.getItem(key))}catch(e){}
  if(o){for(var k in o.f){var el=$("#"+k);if(el)el.value=o.f[k]}o.l.forEach(row)}else{row(["Consulting — strategy session",2,150]);row(["Website updates",5,60]);
    var d=new Date();$("#idate").value=d.toISOString().slice(0,10);d.setDate(d.getDate()+14);$("#due").value=d.toISOString().slice(0,10)}
  root.addEventListener("input",calc);root.addEventListener("change",calc);
  items.addEventListener("click",function(e){if(e.target.classList.contains("x")){e.target.closest("tr").remove();calc()}});
  $("#add-line").addEventListener("click",function(){row();calc()});$("#print").addEventListener("click",function(){window.print()});
  $("#clear").addEventListener("click",function(){if(confirm("Clear this invoice?")){localStorage.removeItem(key);location.reload()}});calc();
},
names:function(){
  var pre={modern:["Nova","Bright","Swift","Peak","Bold","True","Prime","Clear","Next","Kind"],classic:["Heritage","Royal","Golden","Summit","Crown","Liberty","Oak","Keystone","Harbor","Main Street"],playful:["Happy","Zippy","Buzzy","Jolly","Snappy","Lucky","Sunny","Perky","Hop","Wiggle"],local:["Corner","Hometown","Neighbor","Village","Uptown","Northside","Riverside","Parkside","Metro","Local"]};
  var suf=["Co","Works","Hub","Lab","Studio","Collective","House","Supply","Partners","Group","Pro","Labs","Craft","Bros","& Co"];
  function gen(){var k=($("#kw").value||"Bakery").trim(),st=$("#style").value,P=pre[st],out=[],seen={},cap=k.charAt(0).toUpperCase()+k.slice(1);
    function add(n){if(!seen[n]){seen[n]=1;out.push(n)}}
    P.forEach(function(p,i){add(p+" "+cap);add(cap+" "+suf[i%suf.length])});
    add("The "+cap+" "+suf[(k.length)%suf.length]);add(cap+"ly");add(cap+"ify");add("Get"+cap.replace(/\s/g,""));add(cap+" & "+P[3]);add(P[1]+P[2]+" "+cap);
    $("#names").innerHTML=out.slice(0,24).map(function(n){var dom=n.toLowerCase().replace(/&/g,"and").replace(/[^a-z0-9]/g,"");return'<div class="card"><h3 style="margin:0 0 6px">'+n+'</h3><p><a href="https://www.namecheap.com/domains/registration/results/?domain='+dom+'.com" target="_blank" rel="noopener nofollow">Check '+dom+'.com →</a></p></div>'}).join("")}
  $("#gen").addEventListener("click",gen);$("#kw").addEventListener("keydown",function(e){if(e.key==="Enter"){e.preventDefault();gen()}});gen();
},
health:function(){
  var f=$("#hc");
  f.addEventListener("submit",function(e){e.preventDefault();
    var qs=$$("fieldset",f),score=0,max=qs.length*3,weak=[];
    qs.forEach(function(q){var c=$("input:checked",q),s=c?+c.value:0;score+=s;if(s<2)weak.push(q.dataset.area)});
    var pc=Math.round(score/max*100),band=pc>=80?["Strong","Your fundamentals are solid. Focus on scaling what already works."]:pc>=55?["Stable, with gaps","A few weak spots are costing you money or risk. Fix the areas below first."]:["At risk","Several core systems need attention. Start with the top two areas below this week."];
    var tips={money:["/tools/profit-margin-calculator.html","Know your margins & break-even"],cash:["/guides/cash-flow-management.html","Build a cash-flow routine"],legal:["/guides/choosing-a-business-structure.html","Get your structure & contracts right"],marketing:["/guides/local-marketing-on-a-budget.html","Build a repeatable marketing engine"],online:["/guides/small-business-website-that-converts.html","Fix your website & online presence"],books:["/guides/bookkeeping-basics.html","Get bookkeeping under control"],team:["/guides/hiring-your-first-employee.html","Systemize and delegate"],security:["/guides/small-business-cybersecurity.html","Lock down your accounts"],pricing:["/guides/how-to-price-products-and-services.html","Fix your pricing"],funding:["/guides/small-business-funding-options.html","Line up funding before you need it"]};
    $("#hc-score").textContent=pc+"/100";$("#hc-band").textContent=band[0];$("#hc-text").textContent=band[1];
    $("#hc-weak").innerHTML=weak.length?weak.map(function(w){var t=tips[w];return'<li><a href="'+t[0]+'">'+t[1]+'</a></li>'}).join(""):"<li>No weak areas — nice work.</li>";
    var r=$("#hc-result");r.hidden=false;r.scrollIntoView({behavior:"smooth"});
    $("#hc-hidden").value="Score "+pc+"/100 ("+band[0]+"). Weak areas: "+(weak.join(", ")||"none");
    try{localStorage.setItem("sbs_last_result","Health check "+pc+"/100; weak: "+weak.join(", "))}catch(e){}
  });
}
};
if(tools[T])tools[T]();
/* pass last result into any "get help" link on tool pages */
$$("a[data-help]").forEach(function(a){a.addEventListener("click",function(){try{sessionStorage.setItem("sbs_ctx",localStorage.getItem("sbs_last_result")||"")}catch(e){}})});
})();
