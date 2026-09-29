const menu=document.querySelector(".menu-toggle"),nav=document.querySelector(".nav");
if(menu&&nav){menu.addEventListener("click",()=>{const open=nav.classList.toggle("open");menu.setAttribute("aria-expanded",open)})}
const year=document.getElementById("year");if(year)year.textContent=new Date().getFullYear();

async function buildLiveSearchIndex(){
 try{
  const pages=["index.html","learn.html","tools.html","shariah.html","resources.html","about.html"];
  const live=[];
  for(const page of pages){
   const res=await fetch("./"+page,{cache:"no-store"}); if(!res.ok) continue;
   const html=await res.text(),doc=new DOMParser().parseFromString(html,"text/html");
   doc.querySelectorAll("main h1,main h2,main h3,main .calculator,main .content-card").forEach(el=>{
    const title=(el.matches("h1,h2,h3")?el.textContent:el.querySelector("h2,h3")?.textContent||"").trim();
    if(!title) return;
    let node=el, parts=[];
    for(let i=0;i<4&&node;i++,node=node.parentElement){const t=node.textContent?.replace(/\s+/g," ").trim();if(t)parts.push(t.slice(0,220));}
    const target=el.closest("[id]")?.id||"";
    live.push({title,page:page+(target?"#"+target:""),type:page.replace(".html",""),text:parts.join(" ")});
   });
  }
  return live;
 }catch(e){return []}
}
const SEARCH_INDEX=[
{title:"Stocks",page:"learn.html#stocks",type:"Learn",text:"shares ownership dividends financial statements valuation orders execution Shariah stock screening AAOIFI Standard 21"},
{title:"Crypto",page:"learn.html#crypto",type:"Learn",text:"blockchain coins tokens wallets private keys custody tokenomics staking lending yield Bitcoin Ethereum digital currency research IIFA"},
{title:"Islamic Finance",page:"learn.html#islamic",type:"Learn",text:"riba gharar maysir ownership possession permissible business scholarly disagreement Qur'an Islamic finance"},
{title:"Risk",page:"learn.html#risk",type:"Learn",text:"risk capacity position sizing drawdown concentration leverage fees slippage diversification risk management"},
{title:"Research",page:"learn.html#research",type:"Learn",text:"asset research company analysis financial statements contract verification sources uncertainty research workflow"},
{title:"Security",page:"learn.html#security",type:"Learn",text:"seed phrase private key phishing 2FA scams platform risk social engineering account security wallet security"},
{title:"Riba",page:"shariah.html#riba",type:"Shariah",text:"interest lending loans increase Qur'an 2:275 2:278 279 Sahih Muslim 1598 halal lawful wealth dua guidance"},
{title:"Gharar",page:"shariah.html#gharar",type:"Shariah",text:"uncertainty ambiguity contracts ownership price delivery terms Sahih Muslim 1513"},
{title:"Maysir",page:"shariah.html#maisir",type:"Shariah",text:"gambling wager betting Qur'an 5:90 91 speculation investment"},
{title:"Business Activities",page:"shariah.html#business",type:"Shariah",text:"company activity shares revenue debt cash financial screening AAOIFI Standard 21"},
{title:"Crypto Shariah",page:"shariah.html#crypto-shariah",type:"Shariah",text:"digital currencies cryptocurrency Bitcoin crypto assets IIFA Resolution 237 scholarly disagreement"},
{title:"Financial Products",page:"shariah.html#products",type:"Shariah",text:"margin leverage short selling derivatives futures options CFDs staking yield lending contracts"},
{title:"Governance",page:"shariah.html#governance",type:"Shariah",text:"primary sources Qur'an Sunnah AAOIFI IIFA attribution methodology date scholar review"},
{title:"Position Size Calculator",page:"tools.html",type:"Tool",text:"capital risk percentage entry stop price position size risk budget calculator"},
{title:"Compound Growth Calculator",page:"tools.html",type:"Tool",text:"starting amount contribution annual growth assumption years mathematical scenario"},
{title:"Risk Reward Calculator",page:"tools.html",type:"Tool",text:"entry stop target reward risk ratio analysis"},
{title:"Halal Stock Investing Guide",page:"resources.html",type:"Resource",text:"stock investing screening research workflow portfolio planning"},
{title:"Islamic Finance & Crypto",page:"resources.html",type:"Resource",text:"Islamic finance crypto evidence scholarly disagreement"},
{title:"Stock Analysis Workbook",page:"resources.html",type:"Resource",text:"business financial risk research workbook"},
{title:"Crypto Research Workbook",page:"resources.html",type:"Resource",text:"token custody use case risk Shariah research"},
{title:"Portfolio Planning Workbook",page:"resources.html",type:"Resource",text:"goals allocation risk capacity review"},
{title:"Investment Journal",page:"resources.html",type:"Resource",text:"thesis assumptions risk decision date lessons"},
{title:"About 360HH",page:"about.html",type:"Page",text:"Halal Hustlers Hub Islamic finance modern financial markets learning platform principles"},
{title:"360HH Home",page:"index.html",type:"Page",text:"learn verify calculate reflect decide stocks crypto tools Shariah resources"}
];

function openSiteSearch(){
 let modal=document.querySelector(".site-search");
 if(modal){modal.classList.add("open");setTimeout(()=>modal.querySelector("input")?.focus(),40);return}
 modal=document.createElement("div");modal.className="site-search";modal.innerHTML='<div class="search-backdrop" data-search-close></div><section class="search-dialog" role="dialog" aria-modal="true" aria-label="Search 360HH"><div class="search-head"><span class="kicker">360HH SEARCH</span><button class="search-close" type="button" aria-label="Close search">×</button></div><div class="search-input-wrap"><span>⌕</span><input type="search" placeholder="Search stocks, crypto, riba, risk, tools..." autocomplete="off"></div><div class="search-results" aria-live="polite"><div class="search-empty">Start typing to search the 360HH knowledge hub.</div></div></section>';
 document.body.appendChild(modal);modal.classList.add("open");
 const input=modal.querySelector("input"),results=modal.querySelector(".search-results"); let liveIndex=[]; buildLiveSearchIndex().then(x=>{liveIndex=x});
 const close=()=>modal.classList.remove("open");modal.querySelector(".search-close").onclick=close;modal.querySelector("[data-search-close]").onclick=close;
 const run=()=>{const q=input.value.trim().toLowerCase();if(!q){results.innerHTML='<div class="search-empty">Start typing to search the 360HH knowledge hub.</div>';return}
 const terms=q.split(/\s+/).filter(Boolean);const source=[...SEARCH_INDEX,...liveIndex];const ranked=source.map(item=>{const hay=(item.title+" "+item.type+" "+item.text).toLowerCase();let score=0;terms.forEach(t=>{if(item.title.toLowerCase().includes(t))score+=5;if(hay.includes(t))score+=2});return {...item,score}}).filter(x=>x.score>0).sort((a,b)=>b.score-a.score).slice(0,10);
 results.innerHTML=ranked.length?ranked.map(x=>'<a class="search-result" href="./'+x.page+'"><span class="search-type">'+x.type+'</span><strong>'+x.title+'</strong><small>'+x.text+'</small><b>Open →</b></a>').join(""):'<div class="search-empty">No matching topic found. Try a broader term like “stock”, “crypto”, “riba”, “risk” or “security”.</div>'};
 input.addEventListener("input",run);input.addEventListener("keydown",e=>{if(e.key==="Escape")close()});
}
document.querySelector(".nav")?.insertAdjacentHTML("beforeend",'<button class="search-trigger" type="button" aria-label="Search 360HH" title="Search 360HH">⌕<span>Search</span></button>');
document.querySelector(".search-trigger")?.addEventListener("click",openSiteSearch);
document.addEventListener("keydown",e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){e.preventDefault();openSiteSearch()}});