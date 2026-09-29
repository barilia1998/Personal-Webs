const projectData = {
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
    kicker.textContent = data.kicker;
    title.textContent = data.title;
    intro.textContent = data.intro;
    problem.textContent = data.problem;
    approach.textContent = data.approach;
    outcome.textContent = data.outcome;
    stack.innerHTML = data.stack.map(item => `<span>${item}</span>`).join("");
    dialog.showModal();
  });
});

document.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", e => { if (e.target === dialog) dialog.close(); });

const menuBtn = document.querySelector(".menu-btn");
menuBtn.addEventListener("click", () => {
  document.body.classList.toggle("menu-open");
  menuBtn.textContent = document.body.classList.contains("menu-open") ? "Close" : "Menu";
});
document.querySelectorAll(".nav a").forEach(a => a.addEventListener("click", () => {
  document.body.classList.remove("menu-open");
  menuBtn.textContent = "Menu";
}));

document.querySelector("#year").textContent = new Date().getFullYear();
