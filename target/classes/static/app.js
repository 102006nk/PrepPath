const STORAGE_KEY = "preppath-personal-v1";

const dsaWeeks = [
  ["Arrays and complexity","Arrays, Big-O notation, Java collections"],
  ["Strings and hashing","String manipulation, HashMap and HashSet"],
  ["Two pointers and sliding window","Two pointers, sliding window and prefix sums"],
  ["Sorting and binary search","Sorting algorithms and binary search patterns"],
  ["Recursion and backtracking","Recursion, subsets and basic backtracking"],
  ["Linked lists","Insertion, deletion, reversal and fast/slow pointers"],
  ["Stacks and queues","Stack, queue and monotonic stack"],
  ["Binary trees","Tree traversals, height and level order"],
  ["BST and heaps","Binary search trees, PriorityQueue and heaps"],
  ["Graphs: BFS and DFS","Graph representation, BFS and DFS"],
  ["Dynamic programming basics","Memoization, tabulation and simple DP"],
  ["Greedy and intervals","Greedy strategy and interval problems"],
  ["Mixed medium problems","Timed mixed interview problems"],
  ["Revision and mock tests","Review mistakes and take timed coding tests"]
];

const webWeeks = [
  ["HTML fundamentals","Semantic HTML, forms, links, images and page structure"],
  ["CSS and responsive design","Selectors, box model, flexbox, grid and media queries"],
  ["JavaScript fundamentals","Variables, functions, arrays, objects and conditions"],
  ["DOM and browser events","DOM selection, events, validation and localStorage"],
  ["Modern JavaScript","ES6, arrow functions, promises, async and await"],
  ["React fundamentals","Components, JSX, props and state"],
  ["React hooks and forms","useState, useEffect and controlled forms"],
  ["React Router and APIs","Routing, API calls, loading and error states"],
  ["Node.js and Express","Node basics, npm, Express server and routes"],
  ["MongoDB and CRUD","Collections, documents and CRUD operations"],
  ["Frontend-backend integration","Connect React to Express APIs, middleware and validation"],
  ["Authentication","Password hashing, login flow and JWT basics"],
  ["Full-stack integration","Complete features, environment variables and deployment"],
  ["Testing and polish","Bug fixing, README, testing and deployment preparation"]
];

const projectsSeed = [
  {name:"Personal Portfolio",icon:"🎨",description:"Create a responsive portfolio with About, Skills, Projects and Contact sections.",weeks:"Weeks 1–2"},
  {name:"Smart Calculator",icon:"🧮",description:"Build a calculator with a clean interface and keyboard support.",weeks:"Weeks 3–4"},
  {name:"React Task Manager",icon:"✅",description:"Create tasks, update status, filter tasks and save them locally.",weeks:"Weeks 5–6"},
  {name:"Weather App",icon:"🌤️",description:"Use a weather API to display current conditions and forecasts.",weeks:"Weeks 7–8"},
  {name:"Notes Management System",icon:"📝",description:"Build create, edit, delete and search features for notes.",weeks:"Weeks 9–10"},
  {name:"Job Application Tracker",icon:"💼",description:"Track company, role, application date, status and notes.",weeks:"Weeks 11–12"},
  {name:"Placement Preparation Platform",icon:"🚀",description:"Bring together login, DSA progress, planner, question bank and dashboard.",weeks:"Weeks 13–14"}
];

const fundamentalsSeed = {
  "Java OOP":["Classes and objects","Constructors and this keyword","Inheritance and polymorphism","Abstraction and interfaces","Exception handling"],
  "DBMS":["Keys and constraints","Normalisation","SQL queries","Joins and subqueries","Transactions and indexes"],
  "Operating Systems":["Processes and threads","CPU scheduling","Deadlocks","Memory management","Paging and virtual memory"],
  "Computer Networks":["OSI and TCP/IP models","HTTP and HTTPS","DNS","TCP vs UDP","Client-server architecture"]
};

const englishHabitsSeed = [
  "Speak in English for 10 minutes",
  "Learn 5 useful vocabulary words",
  "Read an English article for 10 minutes",
  "Listen to an English video or podcast",
  "Explain one technical topic aloud",
  "Practise one interview answer"
];

const speakingSeed = [
  "Introduce yourself","Talk about your education and CSE branch","Why did you choose computer science?","Explain Java in simple words",
  "Explain arrays and DSA","Describe a web development concept","Explain React and its use","Explain one project you built",
  "What happens in the backend?","Explain databases and APIs","Talk about a challenge you solved","Why should we hire you?",
  "Describe your final project","Give yourself a complete mock interview"
];

const hrSeed = [
  "Tell me about yourself.","What are your strengths and areas you want to improve?","Why did you choose CSE?","Why do you want this role?","Tell me about a challenge you faced.","Describe a project you worked on.","Where do you see yourself in five years?","Why should we hire you?"
];

function freshState() {
  return {
    dayChecks: {},
    dsaTopicChecks: {},
    webChecks: {},
    projects: projectsSeed.map(p => ({...p,status:"Not started"})),
    problems: [],
    englishHabits: {},
    speakingChecks: {},
    hrChecks: {},
    fundamentals: {},
    createdAt: new Date().toISOString()
  };
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved && typeof saved === "object" ? {...freshState(), ...saved} : freshState();
  } catch (error) {
    console.warn("Could not read saved progress. Starting with a fresh tracker.", error);
    return freshState();
  }
}
let state = loadState();
let weeklyChartInstance = null;
let areaChartInstance = null;

const startDate = new Date(2026, 10, 26); // 26 November 2026, local time
const dayNames = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  updateDashboardStats();
}
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2200);
}
function dateForDay(dayNumber) {
  const date = new Date(startDate);
  date.setDate(startDate.getDate() + dayNumber - 1);
  return date;
}
function dateLabel(date) {
  return `${date.getDate()} ${monthNames[date.getMonth()]}`;
}
function weekForDay(dayNumber) {
  return Math.min(14, Math.ceil(dayNumber / 7));
}
function getDayTasks(dayNumber) {
  const week = weekForDay(dayNumber);
  const dayInWeek = ((dayNumber - 1) % 7) + 1;
  const dsa = dsaWeeks[week - 1];
  const web = webWeeks[week - 1];
  const tasks = [
    {id:`d${dayNumber}-dsa`,area:"Java DSA",title:dsa[0],detail:dayInWeek % 2 === 0 ? `Solve 1–2 problems on ${dsa[1]}. Review your approach and time complexity.` : `Study ${dsa[1]}. Write a small Java example and practise one problem.`},
    {id:`d${dayNumber}-web`,area:"Web development",title:web[0],detail:dayInWeek % 2 === 0 ? `Practise ${web[1]}. Add the result to your current learning project.` : `Learn ${web[1]}. Write notes and build a small example.`},
    {id:`d${dayNumber}-english`,area:"English",title:"Speaking and communication",detail:"Speak for 10 minutes, learn 5 words and practise one interview answer."},
    {id:`d${dayNumber}-cs`,area:"CS fundamentals",title:week <= 2 ? "Java OOP" : week <= 6 ? "DBMS" : week <= 10 ? "Operating Systems" : "Computer Networks",detail:"Spend 15 minutes revising one concept and explain it aloud."}
  ];
  if (week === 14 && dayNumber > 95) tasks.push({id:`d${dayNumber}-mock`,area:"Revision",title:"Mock interview and revision",detail:"Review your weak areas and practise explaining your projects."});
  return tasks;
}
function dayComplete(dayNumber) {
  const tasks = getDayTasks(dayNumber);
  return tasks.every(task => !!state.dayChecks[task.id]);
}
function completedDays() {
  let count = 0;
  for (let day = 1; day <= 100; day++) if (dayComplete(day)) count++;
  return count;
}
function allDailyChecks() {
  let count = 0;
  for (let day = 1; day <= 100; day++) count += getDayTasks(day).filter(t => state.dayChecks[t.id]).length;
  return count;
}
function allDailyTaskCount() {
  let count = 0;
  for (let day = 1; day <= 100; day++) count += getDayTasks(day).length;
  return count;
}
function dsaTopicCount() { return Object.values(state.dsaTopicChecks).filter(Boolean).length; }
function webTopicCount() { return Object.values(state.webChecks).filter(Boolean).length; }
function projectCount() { return state.projects.filter(p => p.status === "Completed").length; }
function englishCount() { return Object.values(state.englishHabits).filter(Boolean).length + Object.values(state.speakingChecks).filter(Boolean).length; }

function renderToday() {
  const today = new Date();
  let dayNo = Math.floor((new Date(today.getFullYear(),today.getMonth(),today.getDate()) - startDate) / 86400000) + 1;
  if (dayNo < 1 || dayNo > 100) dayNo = 1;
  const tasks = getDayTasks(dayNo);
  document.getElementById("todayTasks").innerHTML = tasks.map(t => `
    <label class="today-task">
      <input type="checkbox" data-day-check="${t.id}" ${state.dayChecks[t.id] ? "checked" : ""}>
      <span><b>${escapeHtml(t.area)} · ${escapeHtml(t.title)}</b><small>${escapeHtml(t.detail)}</small></span>
    </label>`).join("");
  document.getElementById("todayTasks").querySelectorAll("[data-day-check]").forEach(input => {
    input.addEventListener("change", () => {
      state.dayChecks[input.dataset.dayCheck] = input.checked;
      saveState(); renderToday(); renderPlanner(); updateDashboardStats();
      showToast("Today's progress saved");
    });
  });
  const week = weekForDay(dayNo);
  document.getElementById("weekFocus").innerHTML = `
    <div class="week-focus-item"><span>Java DSA</span><b>${escapeHtml(dsaWeeks[week-1][0])}</b></div>
    <div class="week-focus-item"><span>Web development</span><b>${escapeHtml(webWeeks[week-1][0])}</b></div>
    <div class="week-focus-item"><span>English</span><b>Daily communication</b></div>`;
}
function renderPlanner() {
  const weekFilter = document.getElementById("weekFilter").value;
  const statusFilter = document.getElementById("plannerStatus").value;
  const days = [];
  for (let day = 1; day <= 100; day++) {
    const week = weekForDay(day), date = dateForDay(day), tasks = getDayTasks(day);
    const done = dayComplete(day);
    if (weekFilter !== "all" && Number(weekFilter) !== week) continue;
    if (statusFilter === "done" && !done) continue;
    if (statusFilter === "pending" && done) continue;
    const weekend = date.getDay() === 0 || date.getDay() === 6;
    days.push(`<article class="day-card ${done ? "done" : ""}">
      <div class="day-index"><div><small>DAY</small>${day}</div></div>
      <div class="day-content"><h3>${dayNames[date.getDay()]}, ${dateLabel(date)} · Week ${week}</h3>
        <p>${weekend ? "Weekend target: 5 study hours" : "Weekday target: 3 study hours"} · ${tasks.length} study activities</p>
        <div class="day-tags">${tasks.map(t=>`<span class="tag">${escapeHtml(t.area)}</span>`).join("")}</div>
      </div>
      <button class="day-action" data-open-day="${day}">${done ? "Completed ✓" : "View tasks"}</button>
    </article>`);
  }
  document.getElementById("dayList").innerHTML = days.join("") || `<div class="panel muted">No days match this filter.</div>`;
  document.getElementById("plannerProgress").textContent = `${completedDays()} of 100 days completed`;
  document.querySelectorAll("[data-open-day]").forEach(btn => btn.addEventListener("click", () => openDayDetails(Number(btn.dataset.openDay))));
}
function openDayDetails(day) {
  const date = dateForDay(day), tasks = getDayTasks(day);
  const overlay = document.createElement("div");
  overlay.className = "modal-backdrop";
  overlay.innerHTML = `<div class="modal"><button class="modal-close" aria-label="Close">×</button><span class="eyebrow">DAY ${day} · WEEK ${weekForDay(day)}</span><h2>${dayNames[date.getDay()]}, ${dateLabel(date)}</h2><p class="muted small">${date.getDay()===0||date.getDay()===6?"5-hour weekend study target":"3-hour weekday study target"}</p>
    <div class="modal-tasks">${tasks.map(t=>`<label class="check-row"><input type="checkbox" data-modal-check="${t.id}" ${state.dayChecks[t.id]?"checked":""}><span><b>${escapeHtml(t.area)}:</b> ${escapeHtml(t.title)}<small>${escapeHtml(t.detail)}</small></span></label>`).join("")}</div>
    <button class="primary-btn modal-done">Save and close</button></div>`;
  document.body.appendChild(overlay);
  overlay.querySelector(".modal-close").onclick = () => overlay.remove();
  overlay.querySelector(".modal-done").onclick = () => {
    overlay.querySelectorAll("[data-modal-check]").forEach(input => state.dayChecks[input.dataset.modalCheck] = input.checked);
    saveState(); overlay.remove(); renderPlanner(); renderToday(); updateDashboardStats(); showToast("Day updated");
  };
  overlay.addEventListener("click", e => { if(e.target === overlay) overlay.remove(); });
}
function renderDsa() {
  document.getElementById("dsaTopics").innerHTML = dsaWeeks.map((topic,i)=>`
    <label class="topic-item"><input type="checkbox" data-dsa="${i}" ${state.dsaTopicChecks[i]?"checked":""}>
      <span><b>Week ${i+1}: ${escapeHtml(topic[0])}</b><small>${escapeHtml(topic[1])}</small></span></label>`).join("");
  document.querySelectorAll("[data-dsa]").forEach(input=>input.addEventListener("change",()=>{
    state.dsaTopicChecks[input.dataset.dsa]=input.checked;saveState();renderDsa();showToast("DSA topic updated");
  }));
  const list = document.getElementById("problemList");
  list.innerHTML = state.problems.length ? state.problems.map((p,i)=>`
    <div class="problem-row"><div><b>${escapeHtml(p.name)}</b><br><small>${escapeHtml(p.difficulty)} · ${escapeHtml(p.date)}</small></div>
    <div>${p.link?`<a href="${escapeAttr(p.link)}" target="_blank" rel="noopener">Open problem ↗</a>`:""} <button data-delete-problem="${i}" aria-label="Delete problem">✕</button></div></div>`).join("") : `<p class="muted small">No problems added yet. Add your first LeetCode problem above.</p>`;
  document.querySelectorAll("[data-delete-problem]").forEach(btn=>btn.addEventListener("click",()=>{
    state.problems.splice(Number(btn.dataset.deleteProblem),1);saveState();renderDsa();showToast("Problem removed");
  }));
  document.getElementById("dsaProgress").textContent=`${state.problems.length} problems logged`;
  document.getElementById("dsaSolvedBig").textContent=state.problems.length;
  document.getElementById("dsaTopicsDone").textContent=`${dsaTopicCount()}/14`;
}
function renderWeb() {
  document.getElementById("webTopics").innerHTML = webWeeks.map((topic,i)=>`
    <div class="web-week"><div class="web-week-head"><b>Week ${i+1} · ${escapeHtml(topic[0])}</b><small>${state.webChecks[i]?"Completed ✓":"In progress"}</small></div><p>${escapeHtml(topic[1])}</p><label><input type="checkbox" data-web="${i}" ${state.webChecks[i]?"checked":""}> Mark this week's learning complete</label></div>`).join("");
  document.querySelectorAll("[data-web]").forEach(input=>input.addEventListener("change",()=>{
    state.webChecks[input.dataset.web]=input.checked;saveState();renderWeb();showToast("Web roadmap updated");
  }));
  document.getElementById("webProgress").textContent=`${Math.round(webTopicCount()/14*100)}% complete`;
}
function renderProjects() {
  document.getElementById("projectGrid").innerHTML = state.projects.map((p,i)=>`
    <article class="project-card"><div class="project-emoji">${p.icon}</div><h3>${escapeHtml(p.name)}</h3><p>${escapeHtml(p.description)}</p><small>${escapeHtml(p.weeks)}</small>
      <select data-project="${i}"><option ${p.status==="Not started"?"selected":""}>Not started</option><option ${p.status==="In progress"?"selected":""}>In progress</option><option ${p.status==="Completed"?"selected":""}>Completed</option></select></article>`).join("");
  document.querySelectorAll("[data-project]").forEach(select=>select.addEventListener("change",()=>{
    state.projects[Number(select.dataset.project)].status=select.value;saveState();renderProjects();showToast("Project status saved");
  }));
  document.getElementById("projectProgress").textContent=`${projectCount()}/7 completed`;
}
function renderEnglish() {
  document.getElementById("englishHabits").innerHTML=englishHabitsSeed.map((h,i)=>`
    <label class="check-row"><input type="checkbox" data-english="${i}" ${state.englishHabits[i]?"checked":""}>${escapeHtml(h)}</label>`).join("");
  document.getElementById("speakingTopics").innerHTML=speakingSeed.map((t,i)=>`
    <label class="topic-item"><input type="checkbox" data-speaking="${i}" ${state.speakingChecks[i]?"checked":""}><span><b>Week ${i+1}</b><small>${escapeHtml(t)}</small></span></label>`).join("");
  document.getElementById("hrQuestions").innerHTML=hrSeed.map((q,i)=>`
    <details class="question-item"><summary>${escapeHtml(q)}</summary><p>Practise answering this question aloud. Keep your answer clear, specific and honest. Use an example when possible.</p><label class="check-row"><input type="checkbox" data-hr="${i}" ${state.hrChecks[i]?"checked":""}> I practised this answer</label></details>`).join("");
  document.querySelectorAll("[data-english]").forEach(el=>el.addEventListener("change",()=>{state.englishHabits[el.dataset.english]=el.checked;saveState();updateEnglishProgress();}));
  document.querySelectorAll("[data-speaking]").forEach(el=>el.addEventListener("change",()=>{state.speakingChecks[el.dataset.speaking]=el.checked;saveState();updateEnglishProgress();}));
  document.querySelectorAll("[data-hr]").forEach(el=>el.addEventListener("change",()=>{state.hrChecks[el.dataset.hr]=el.checked;saveState();updateEnglishProgress();}));
  updateEnglishProgress();
}
function updateEnglishProgress() { document.getElementById("englishProgress").textContent=`${englishCount()} practice items checked`; }
function renderFundamentals() {
  document.getElementById("fundamentalsList").innerHTML=Object.entries(fundamentalsSeed).map(([area,items])=>`
    <section class="fundamental-card"><h3>${escapeHtml(area)}</h3>${items.map((item,i)=>`<label><input type="checkbox" data-fundamental="${area}|${i}" ${state.fundamentals[area+"|"+i]?"checked":""}>${escapeHtml(item)}</label>`).join("")}</section>`).join("");
  document.querySelectorAll("[data-fundamental]").forEach(el=>el.addEventListener("change",()=>{
    state.fundamentals[el.dataset.fundamental]=el.checked;saveState();updateFundamentalsProgress();
  }));
  updateFundamentalsProgress();
}
function updateFundamentalsProgress() {
  const total=Object.values(fundamentalsSeed).reduce((sum,a)=>sum+a.length,0);
  const done=Object.values(state.fundamentals).filter(Boolean).length;
  document.getElementById("fundamentalsProgress").textContent=`${Math.round(done/total*100)}% complete`;
}
function updateDashboardStats() {
  const percent=Math.round(allDailyChecks()/allDailyTaskCount()*100);
  document.getElementById("overallPercent").textContent=percent+"%";
  document.getElementById("overallBar").style.width=percent+"%";
  document.getElementById("overallCaption").textContent=percent===100?"Amazing! All daily activities completed.":percent>0?"You're making progress. Keep going!":"Your journey starts with one task.";
  document.getElementById("daysCompleted").textContent=`${completedDays()}/100`;
  document.getElementById("dsaSolved").textContent=state.problems.length;
  document.getElementById("projectsCompleted").textContent=`${projectCount()}/7`;
  document.getElementById("analyticsOverall").textContent=percent+"%";
  document.getElementById("analyticsTasks").textContent=allDailyChecks();
}
function renderAnalytics() {
  if(typeof Chart==="undefined") {
    document.querySelector(".chart-grid").innerHTML="<p class='muted'>Charts need an internet connection to load the chart library. Your progress tracking still works offline.</p>";
    return;
  }
  const weekly=[];
  for(let w=1;w<=14;w++){
    let done=0,total=0;
    for(let d=(w-1)*7+1;d<=Math.min(w*7,100);d++){
      const tasks=getDayTasks(d);total+=tasks.length;done+=tasks.filter(t=>state.dayChecks[t.id]).length;
    }
    weekly.push(total?Math.round(done/total*100):0);
  }
  if(weeklyChartInstance)weeklyChartInstance.destroy();
  weeklyChartInstance=new Chart(document.getElementById("weeklyChart"),{type:"bar",data:{labels:weekly.map((_,i)=>"W"+(i+1)),datasets:[{label:"Daily task completion %",data:weekly,borderRadius:6,backgroundColor:"#8c7cf0"}]},options:{responsive:true,scales:{y:{beginAtZero:true,max:100,ticks:{callback:v=>v+"%"}}},plugins:{legend:{display:false}}}});
  if(areaChartInstance)areaChartInstance.destroy();
  const areaCounts=[
    allDailyChecksByArea("Java DSA"),allDailyChecksByArea("Web development"),
    allDailyChecksByArea("English"),allDailyChecksByArea("CS fundamentals")
  ];
  areaChartInstance=new Chart(document.getElementById("areaChart"),{type:"doughnut",data:{labels:["Java DSA","Web development","English","CS fundamentals"],datasets:[{data:areaCounts,backgroundColor:["#7868e8","#4db99b","#efa56d","#6ca9dc"],borderWidth:0}]},options:{responsive:true,plugins:{legend:{position:"bottom",labels:{boxWidth:10,font:{size:10}}}}}});
}
function allDailyChecksByArea(area) {
  let count=0;
  for(let d=1;d<=100;d++)count+=getDayTasks(d).filter(t=>t.area===area&&state.dayChecks[t.id]).length;
  return count;
}
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
}
function escapeAttr(value) { return escapeHtml(value); }

function showPage(name) {
  document.querySelectorAll(".page").forEach(p=>p.classList.toggle("active",p.id==="page-"+name));
  document.querySelectorAll(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.page===name));
  const titles={dashboard:["YOUR PLACEMENT JOURNEY","Good to see you!"],planner:["YOUR 100-DAY PLAN","Daily planner"],dsa:["JAVA · PROBLEM SOLVING","Java DSA"],web:["FULL-STACK DEVELOPMENT","Web development"],projects:["BUILD YOUR PORTFOLIO","My projects"],english:["COMMUNICATION SKILLS","English practice"],fundamentals:["CORE COMPUTER SCIENCE","CS fundamentals"],analytics:["YOUR GROWTH","Progress analytics"]};
  document.getElementById("pageEyebrow").textContent=titles[name][0];
  document.getElementById("pageTitle").textContent=titles[name][1];
  document.getElementById("sidebar").classList.remove("open");
  if(name==="analytics"){updateDashboardStats();renderAnalytics();}
}
document.querySelectorAll(".nav-item").forEach(btn=>btn.addEventListener("click",()=>showPage(btn.dataset.page)));
document.querySelectorAll("[data-goto]").forEach(btn=>btn.addEventListener("click",()=>showPage(btn.dataset.goto)));
document.getElementById("mobileMenu").addEventListener("click",()=>document.getElementById("sidebar").classList.toggle("open"));
document.getElementById("weekFilter").innerHTML='<option value="all">All weeks</option>'+Array.from({length:14},(_,i)=>`<option value="${i+1}">Week ${i+1}</option>`).join("");
document.getElementById("weekFilter").addEventListener("change",renderPlanner);
document.getElementById("plannerStatus").addEventListener("change",renderPlanner);
document.getElementById("addProblemBtn").addEventListener("click",()=>document.getElementById("problemForm").classList.toggle("hidden"));
document.getElementById("problemForm").addEventListener("submit",e=>{
  e.preventDefault();
  const name=document.getElementById("problemName").value.trim();
  const difficulty=document.getElementById("problemDifficulty").value;
  const link=document.getElementById("problemLink").value.trim();
  if(!name){showToast("Enter a problem name");return;}
  if(link && !/^https?:\/\//i.test(link)){showToast("Enter a valid URL starting with http or https");return;}
  state.problems.push({name,difficulty,link,date:new Date().toLocaleDateString()});
  saveState();e.target.reset();e.target.classList.add("hidden");renderDsa();showToast("Problem added");
});
function exportProgress() {
  const blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");a.href=url;a.download="preppath-progress-backup.json";a.click();
  URL.revokeObjectURL(url);showToast("Progress backup exported");
}
document.getElementById("exportBtn").addEventListener("click",exportProgress);
document.getElementById("exportBtn2").addEventListener("click",exportProgress);
document.getElementById("importFile").addEventListener("change",async e=>{
  const file=e.target.files[0];if(!file)return;
  try{
    const imported=JSON.parse(await file.text());
    if(!imported||typeof imported!=="object"||!Array.isArray(imported.projects)||!Array.isArray(imported.problems))throw new Error("Invalid backup file");
    state={...freshState(),...imported};saveState();renderAll();showToast("Progress backup imported");
  }catch(err){showToast("Could not import this backup file");}
  e.target.value="";
});
function renderAll() {
  renderToday();renderPlanner();renderDsa();renderWeb();renderProjects();renderEnglish();renderFundamentals();updateDashboardStats();
}
document.getElementById("todayDate").textContent=new Date().toLocaleDateString(undefined,{weekday:"short",day:"numeric",month:"short"});
renderAll();
