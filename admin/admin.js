const $ = s => document.querySelector(s);
const API_KEY = "barsena_portfolio_api";
const TOKEN_KEY = "barsena_portfolio_token";

let apiUrl = localStorage.getItem(API_KEY) || window.PORTFOLIO_CONFIG?.apiUrl || "";
let token = sessionStorage.getItem(TOKEN_KEY) || "";
let content = null;

const apiInput = $("#apiUrl");
apiInput.value = apiUrl;

function normalizeApi(value){
  return String(value || "").trim().replace(/\/+$/,"");
}

function show(el, yes=true){ el.classList.toggle("hidden", !yes); }
function setState(text){ $("#saveState").textContent = text; }

$("#saveApi").addEventListener("click", async () => {
  apiUrl = normalizeApi(apiInput.value);
  if(!apiUrl) return;
  localStorage.setItem(API_KEY, apiUrl);
  await route();
});

$("#loginBtn").addEventListener("click", async () => {
  const password = $("#password").value;
  $("#loginMsg").textContent = "Signing in…";
  try{
    const res = await fetch(apiUrl + "/api/login", {
      method:"POST",
      headers:{"content-type":"application/json"},
      body:JSON.stringify({password})
    });
    const data = await res.json();
    if(!res.ok) throw new Error(data.error || "Login failed");
    token = data.token;
    sessionStorage.setItem(TOKEN_KEY, token);
    $("#loginMsg").textContent = "";
    await loadContent();
    renderEditor();
  }catch(err){
    $("#loginMsg").textContent = err.message;
  }
});

$("#reloadBtn").addEventListener("click", async () => {
  await loadContent();
  renderEditor();
});

$("#saveBtn").addEventListener("click", async () => {
  collectForm();
  setState("Saving…");
  try{
    const res = await fetch(apiUrl + "/api/content",{
      method:"PUT",
      headers:{
        "content-type":"application/json",
        "authorization":"Bearer " + token
      },
      body:JSON.stringify(content)
    });
    const data = await res.json();
    if(!res.ok) throw new Error(data.error || "Save failed");
    setState("Saved " + new Date().toLocaleTimeString());
  }catch(err){
    setState(err.message);
    if(/unauthorized/i.test(err.message)){
      token="";
      sessionStorage.removeItem(TOKEN_KEY);
      await route();
    }
  }
});

async function route(){
  show($("#setupCard"), !apiUrl);
  show($("#loginCard"), !!apiUrl && !token);
  show($("#editor"), false);

  if(apiUrl && token){
    try{
      await loadContent();
      renderEditor();
    }catch{
      token="";
      sessionStorage.removeItem(TOKEN_KEY);
      show($("#loginCard"), true);
    }
  }
}

async function loadContent(){
  setState("Loading…");
  const res = await fetch(apiUrl + "/api/content?ts=" + Date.now());
  const data = await res.json();
  if(!res.ok) throw new Error(data.error || "Failed to load content");
  if(data.content){
    content = data.content;
  }else{
    const fallback = await fetch("../content/site.json?ts=" + Date.now());
    content = await fallback.json();
  }
  setState("Ready");
}

function field(label, path, value, multiline=false){
  const wrap=document.createElement("div");
  wrap.className="field";
  const lab=document.createElement("label");
  lab.textContent=label;
  const input=document.createElement(multiline ? "textarea" : "input");
  input.dataset.path=path;
  input.value=value ?? "";
  wrap.append(lab,input);
  return wrap;
}

function section(title, key){
  const card=document.createElement("section");
  card.className="section-card";
  const small=document.createElement("small");
  small.textContent=key.toUpperCase();
  const h2=document.createElement("h2");
  h2.textContent=title;
  card.append(small,h2);
  return card;
}

function renderEditor(){
  show($("#setupCard"), false);
  show($("#loginCard"), false);
  show($("#editor"), true);

  const root=$("#formRoot");
  root.innerHTML="";

  const hero=section("Hero","hero");
  hero.append(
    field("Greeting","hero.hello",content.hero.hello),
    field("Title — before emphasis","hero.titleBefore",content.hero.titleBefore),
    field("Title — emphasized word","hero.titleEmphasis",content.hero.titleEmphasis),
    field("Title — after emphasis","hero.titleAfter",content.hero.titleAfter),
    field("Description","hero.description",content.hero.description,true)
  );
  root.append(hero);

  const work=section("Featured project","work");
  work.append(
    field("Section label","work.eyebrow",content.work.eyebrow),
    field("Section heading","work.heading",content.work.heading,true),
    field("TITIPLO meta","work.titiplo.meta",content.work.titiplo.meta),
    field("TITIPLO title","work.titiplo.title",content.work.titiplo.title),
    field("TITIPLO description","work.titiplo.description",content.work.titiplo.description,true),
    field("TITIPLO link label","work.titiplo.linkLabel",content.work.titiplo.linkLabel)
  );
  root.append(work);

  Object.entries(content.projects).forEach(([key,p],idx)=>{
    const card=section("Project " + String(idx+2).padStart(2,"0"),"projects."+key);
    card.append(
      field("Title",`projects.${key}.title`,p.title),
      field("Short description",`projects.${key}.description`,p.description,true),
      field("Case study label",`projects.${key}.kicker`,p.kicker),
      field("Case intro",`projects.${key}.intro`,p.intro,true),
      field("Problem",`projects.${key}.problem`,p.problem,true),
      field("Approach",`projects.${key}.approach`,p.approach,true),
      field("Outcome",`projects.${key}.outcome`,p.outcome,true),
      field("Stack — comma separated",`projects.${key}.stack`,p.stack.join(", "))
    );
    root.append(card);
  });

  const about=section("About","about");
  about.append(
    field("Section label","about.eyebrow",content.about.eyebrow),
    field("Heading","about.heading",content.about.heading),
    field("Lead","about.lead",content.about.lead,true),
    field("Paragraph 1","about.paragraphs.0",content.about.paragraphs[0],true),
    field("Paragraph 2","about.paragraphs.1",content.about.paragraphs[1],true),
    field("Tools — comma separated","about.tools",content.about.tools.join(", "))
  );
  root.append(about);

  const exp=section("Experience","experience");
  exp.append(
    field("Section label","experience.eyebrow",content.experience.eyebrow),
    field("Heading","experience.heading",content.experience.heading)
  );
  content.experience.items.forEach((item,i)=>{
    const wrap=document.createElement("div");
    wrap.className="array-item section-grid";
    wrap.append(
      field("Period",`experience.items.${i}.year`,item.year),
      field("Company",`experience.items.${i}.company`,item.company),
      field("Description",`experience.items.${i}.description`,item.description,true)
    );
    exp.append(wrap);
  });
  root.append(exp);

  const footer=section("Quote & Footer","footer");
  footer.append(
    field("Quote label","quote.eyebrow",content.quote.eyebrow),
    field("Quote","quote.text",content.quote.text,true),
    field("Quote signature","quote.sign",content.quote.sign),
    field("Footer label","footer.eyebrow",content.footer.eyebrow),
    field("Footer heading","footer.heading",content.footer.heading,true),
    field("Copyright name","footer.copyright",content.footer.copyright),
    field("Footer note","footer.note",content.footer.note)
  );
  root.append(footer);
}

function setByPath(obj,path,value){
  const keys=path.split(".");
  let cur=obj;
  for(let i=0;i<keys.length-1;i++) cur=cur[keys[i]];
  const last=keys[keys.length-1];
  if(last==="stack" || last==="tools"){
    cur[last]=value.split(",").map(v=>v.trim()).filter(Boolean);
  }else{
    cur[last]=value;
  }
}

function collectForm(){
  document.querySelectorAll("[data-path]").forEach(input=>{
    setByPath(content,input.dataset.path,input.value);
  });
}

route();
