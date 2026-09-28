const projectData = {
  titiplo: {
    kicker: "01 / SaaS & Product",
    title: "TITIPLO",
    intro: "A lightweight SaaS ecosystem for jastip businesses, connecting the operational seller workflow with a buyer-facing storefront.",
    problem: "Jastip operations are often fragmented across chat, spreadsheets, payment screenshots, and manual tracking.",
    approach: "Design one guided flow for trips, products, customers, orders, payment proof, subscription status, and notifications while keeping infrastructure lean.",
    outcome: "A clearer operating system for sellers and a more structured purchase experience for buyers, designed for mobile-first use.",
    stack: ["Cloudflare Workers","D1","Android","JavaScript","Google Drive","Product Design"]
  },
  loss: {
    kicker: "02 / Analytics",
    title: "Loss of Sales Dashboard",
    intro: "An inventory intelligence dashboard built to make out-of-stock risk and potential missed revenue easier to understand.",
    problem: "Stock history, sales velocity, OOS days, and potential loss lived in separate data flows, making period analysis slow and difficult.",
    approach: "Generalize source data, derive operational KPIs, and create period-based filtering with support for OOS and optional low-stock potential.",
    outcome: "A single view for tracking stock risk, OOS exposure, and estimated sales impact with more practical daily monitoring.",
    stack: ["Google Sheets","Apps Script","JavaScript","Inventory Analytics","Automation"]
  },
  nfc: {
    kicker: "03 / Physical + Digital Product",
    title: "NFC Review System",
    intro: "A tap-to-review product using NFC and QR as the physical entry point into a lightweight activation and routing system.",
    problem: "Review cards are easy to distribute, but businesses need unique identification, simple activation, and a low-friction path to the review form.",
    approach: "Assign a unique serial to each card, enable first-use activation, and route subsequent taps directly toward the configured Google Review destination.",
    outcome: "A reusable product model that combines inexpensive NFC hardware with a serverless web layer and unique card identity.",
    stack: ["NTAG","QR","Cloudflare Workers","Google Review","Serverless"]
  },
  commerce: {
    kicker: "04 / Operations",
    title: "E-commerce Automation",
    intro: "A collection of operational tools designed to reduce repetitive marketplace and commerce work.",
    problem: "Pricing, fees, stock checks, reporting, and marketplace workflows can become repetitive and error-prone at scale.",
    approach: "Translate business rules into calculators, formulas, scripts, integrations, and monitoring flows that fit existing team processes.",
    outcome: "Faster repetitive work, more consistent calculations, and operational visibility without forcing teams into a heavy new system.",
    stack: ["Shopify","Google Sheets","Apps Script","Marketplace Ops","Automation"]
  },
  anti: {
    kicker: "05 / Android Experiment",
    title: "Android Anti-Theft",
    intro: "A security-focused Android experiment exploring automated incident capture after suspicious unlock activity.",
    problem: "A lost device can quickly become difficult to trace once access attempts begin or connectivity changes.",
    approach: "Explore failed-unlock triggers, camera capture, device location, alert delivery, and a lightweight remote service layer.",
    outcome: "A working experimental architecture for device-side security events and remote alert workflows.",
    stack: ["Android","Cloudflare","Device APIs","Security","Automation"]
  }
};

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
},{threshold:.12});
document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));

document.querySelectorAll(".spotlight").forEach(card => {
  card.addEventListener("pointermove", e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX-r.left}px`);
    card.style.setProperty("--my", `${e.clientY-r.top}px`);
  });
});

const tilt = document.querySelector(".tilt-card");
if (tilt && matchMedia("(pointer:fine)").matches) {
  tilt.addEventListener("pointermove", e => {
    const r = tilt.getBoundingClientRect();
    const x = (e.clientX-r.left)/r.width-.5;
    const y = (e.clientY-r.top)/r.height-.5;
    tilt.style.transform = `rotateY(${x*8}deg) rotateX(${-y*8}deg) rotate(2deg)`;
  });
  tilt.addEventListener("pointerleave",()=> {
    tilt.style.transform = "rotate(4deg)";
  });
}

const dialog = document.querySelector("#case-dialog");
const fields = {
  title: document.querySelector("#dialog-title"),
  kicker: document.querySelector("#dialog-kicker"),
  intro: document.querySelector("#dialog-intro"),
  problem: document.querySelector("#dialog-problem"),
  approach: document.querySelector("#dialog-approach"),
  outcome: document.querySelector("#dialog-outcome"),
  stack: document.querySelector("#dialog-stack")
};

document.querySelectorAll(".project-open").forEach(btn => {
  btn.addEventListener("click", () => {
    const data = projectData[btn.dataset.project];
    fields.kicker.textContent = data.kicker;
    fields.title.textContent = data.title;
    fields.intro.textContent = data.intro;
    fields.problem.textContent = data.problem;
    fields.approach.textContent = data.approach;
    fields.outcome.textContent = data.outcome;
    fields.stack.innerHTML = data.stack.map(item => `<span>${item}</span>`).join("");
    dialog.showModal();
  });
});

document.querySelector(".dialog-close").addEventListener("click",()=>dialog.close());
dialog.addEventListener("click",e=>{ if(e.target===dialog) dialog.close(); });
document.addEventListener("keydown",e=>{ if(e.key==="Escape" && dialog.open) dialog.close(); });

const menuBtn = document.querySelector(".menu-btn");
menuBtn.addEventListener("click",()=>{
  document.body.classList.toggle("menu-open");
  menuBtn.textContent = document.body.classList.contains("menu-open") ? "Close" : "Menu";
});
document.querySelectorAll(".nav a").forEach(a=>a.addEventListener("click",()=>{
  document.body.classList.remove("menu-open");
  menuBtn.textContent="Menu";
}));

document.querySelector("#year").textContent = new Date().getFullYear();
