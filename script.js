const defaultProjectData = {
  loss: {
    kicker: "02 / Analytics",
    title: "Loss of Sales Dashboard",
    intro: "This started because checking OOS, stock history, and potential lost sales manually was taking too much time.",
    problem: "Stock history, sales velocity, OOS dates, and lost-sales estimates were spread across different sheets and calculations.",
    approach: "I pulled those pieces into one flow, then kept simplifying the dashboard around the questions I actually needed answered.",
    outcome: "A much clearer way to see which SKUs are actually causing operational and sales impact.",
    stack: ["Google Sheets","Apps Script","JavaScript","Inventory Analytics"]
  },
  nfc: {
    kicker: "03 / Physical product experiment",
    title: "NFC Review System",
    intro: "I wanted to see if a cheap NFC tag could become a small product instead of just a tech demo.",
    problem: "A simple tap card is easy to copy conceptually, so it needed its own identity, activation flow, and destination setup.",
    approach: "Each card gets a unique serial, an activation step, and a simple routing layer behind the tap.",
    outcome: "A reusable physical + digital product idea that can be produced cheaply and configured per customer.",
    stack: ["NFC","QR","Cloudflare Workers","JavaScript"]
  },
  commerce: {
    kicker: "04 / Daily work turned into tools",
    title: "E-commerce Automation",
    intro: "Not one project, but a growing collection of shortcuts I built because I did not want to repeat the same work every day.",
    problem: "Pricing, fees, stock checks, reporting, and marketplace calculations are repetitive and easy to get wrong.",
    approach: "Whenever a task repeated often enough, I tried to turn it into a formula, calculator, script, or lightweight workflow.",
    outcome: "Less repetitive admin, fewer manual calculations, and faster day-to-day operations.",
    stack: ["Shopify","Google Sheets","Apps Script","Marketplace Ops"]
  },
  anti: {
    kicker: "05 / Weekend rabbit hole",
    title: "Android Anti-Theft",
    intro: "This was mostly curiosity: what could an Android device do automatically after a suspicious unlock attempt?",
    problem: "A stolen or lost phone becomes much harder to trace once somebody starts trying to access it.",
    approach: "I experimented with failed-unlock triggers, camera capture, device location, and remote alerts.",
    outcome: "A working proof of concept and a good excuse to learn more about Android device behavior.",
    stack: ["Android","Cloudflare","Device APIs","Security"]
  }
};

let projectData = structuredClone(defaultProjectData);

function text(selector, value){
  const el = document.querySelector(selector);
  if(el && value !== undefined && value !== null) el.textContent = value;
}

function htmlText(selector, before, emphasis, after){
  const el = document.querySelector(selector);
  if(!el) return;
  el.textContent = "";
  el.append(document.createTextNode(before || ""));
  const em = document.createElement("em");
  em.textContent = emphasis || "";
  el.append(em);
  el.append(document.createTextNode(after || ""));
}

function setList(containerSelector, items, render){
  const container = document.querySelector(containerSelector);
  if(!container || !Array.isArray(items)) return;
  container.innerHTML = items.map(render).join("");
}

function applyContent(c){
  if(!c || typeof c !== "object") return;

  if(c.hero){
    text(".hello", c.hero.hello);
    htmlText(".hero-left h1", c.hero.titleBefore, c.hero.titleEmphasis, c.hero.titleAfter);
    text(".hero-copy", c.hero.description);
  }

  if(c.desk){
    text(".desk-header span:first-child", c.desk.title);
    text(".desk-header .scribble", c.desk.note);
    text(".desk-footer", c.desk.location);
    if(Array.isArray(c.desk.items)){
      document.querySelectorAll(".desk-row").forEach((row,i)=>{
        const item=c.desk.items[i];
        if(!item) return;
        const strong=row.querySelector("strong");
        const p=row.querySelector("p");
        if(strong) strong.textContent=item.title || "";
        if(p) p.textContent=item.description || "";
      });
    }
  }

  if(c.work){
    text("#work .section-label", c.work.eyebrow);
    text("#work .section-intro h2", c.work.heading);
    if(c.work.titiplo){
      text(".feature-copy .project-meta span:last-child", c.work.titiplo.meta);
      text(".feature-copy h3", c.work.titiplo.title);
      text(".feature-copy .project-lead", c.work.titiplo.description);
      const link=document.querySelector(".feature-copy .project-link");
      if(link && c.work.titiplo.linkLabel){
        const icon=link.querySelector(".ui-icon");
        link.childNodes.forEach(node=>{ if(node.nodeType===Node.TEXT_NODE) node.remove(); });
        link.insertBefore(document.createTextNode(c.work.titiplo.linkLabel+" "), icon || null);
      }
    }
  }

  if(c.projects){
    projectData = {...projectData, ...c.projects};
    document.querySelectorAll(".project-open").forEach(btn=>{
      const key=btn.dataset.project;
      const p=c.projects[key];
      if(!p) return;
      const t=btn.querySelector(".project-title");
      const d=btn.querySelector(".project-desc");
      if(t) t.textContent=p.title || "";
      if(d) d.textContent=p.description || "";
    });
  }

  if(c.quote){
    text(".personal-note .note-small", c.quote.eyebrow);
    text(".personal-note blockquote", c.quote.text);
    text(".personal-note .note-sign", c.quote.sign);
  }

  if(c.about){
    text("#about .section-label", c.about.eyebrow);
    text("#about .section-intro h2", c.about.heading);
    text("#about .about-big p", c.about.lead);
    const paras=document.querySelectorAll("#about .about-small p");
    if(paras[0] && c.about.paragraphs?.[0] !== undefined) paras[0].textContent=c.about.paragraphs[0];
    if(paras[1] && c.about.paragraphs?.[1] !== undefined) paras[1].textContent=c.about.paragraphs[1];

    if(Array.isArray(c.about.tools)){
      setList("#about .toolbox", c.about.tools, item => `<span>${escapeHtml(item)}</span>`);
    }
  }

  if(c.experience){
    text("#experience .section-label", c.experience.eyebrow);
    text("#experience .section-intro h2", c.experience.heading);
    if(Array.isArray(c.experience.items)){
      const list=document.querySelector("#experience .experience-list");
      if(list){
        list.innerHTML=c.experience.items.map(item=>`
          <div class="experience-row reveal visible">
            <span class="year">${escapeHtml(item.year || "")}</span>
            <div>
              <strong>${escapeHtml(item.company || "")}</strong>
              <p>${escapeHtml(item.description || "")}</p>
            </div>
          </div>`).join("");
      }
    }
  }

  if(c.footer){
    text(".footer-card .section-label", c.footer.eyebrow);
    text(".footer-card h2", c.footer.heading);
    text(".site-footer > span:first-child", "© " + new Date().getFullYear() + " " + (c.footer.copyright || "Bayu Adjie Rossena"));
    text(".site-footer > span:last-child", c.footer.note);
  }
}

function escapeHtml(value){
  return String(value ?? "")
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;")
    .replace(/'/g,"&#039;");
}

async function loadCmsContent(){
  const api=(window.PORTFOLIO_CONFIG?.apiUrl || "").replace(/\/+$/,"");

  if(api){
    try{
      const res=await fetch(api+"/api/content",{cache:"no-store"});
      if(res.ok){
        const data=await res.json();
        if(data.content){
          applyContent(data.content);
          return;
        }
      }
    }catch(err){
      console.warn("CMS API unavailable, using local content.",err);
    }
  }

  try{
    const res=await fetch("./content/site.json",{cache:"no-store"});
    if(res.ok) applyContent(await res.json());
  }catch(err){
    console.warn("Local CMS content unavailable.",err);
  }
}

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
},{threshold:.1});

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

const dialog = document.querySelector("#case-dialog");
const title = document.querySelector("#dialog-title");
const kicker = document.querySelector("#dialog-kicker");
const intro = document.querySelector("#dialog-intro");
const problem = document.querySelector("#dialog-problem");
const approach = document.querySelector("#dialog-approach");
const outcome = document.querySelector("#dialog-outcome");
const stack = document.querySelector("#dialog-stack");

document.querySelectorAll(".project-open").forEach(btn => {
  btn.addEventListener("click", () => {
    const data = projectData[btn.dataset.project];
    if(!data) return;
    kicker.textContent = data.kicker || "";
    title.textContent = data.title || "";
    intro.textContent = data.intro || "";
    problem.textContent = data.problem || "";
    approach.textContent = data.approach || "";
    outcome.textContent = data.outcome || "";
    stack.innerHTML = (data.stack || []).map(item => `<span>${escapeHtml(item)}</span>`).join("");
    dialog.showModal();
  });
});

document.querySelector(".dialog-close")?.addEventListener("click", () => dialog.close());
dialog?.addEventListener("click", e => { if (e.target === dialog) dialog.close(); });

const menuBtn = document.querySelector(".menu-btn");
menuBtn?.addEventListener("click", () => {
  document.body.classList.toggle("menu-open");
  menuBtn.textContent = document.body.classList.contains("menu-open") ? "Close" : "Menu";
});

document.querySelectorAll(".nav a").forEach(a => a.addEventListener("click", () => {
  document.body.classList.remove("menu-open");
  if(menuBtn) menuBtn.textContent = "Menu";
}));

const year=document.querySelector("#year");
if(year) year.textContent = new Date().getFullYear();

loadCmsContent();
