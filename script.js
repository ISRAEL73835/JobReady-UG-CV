const $ = id => document.getElementById(id);
const fields = ["name","phone","email","location","role","education","summary","experience","skills","references"];
let docType = "cv";

document.querySelectorAll(".segmented button").forEach(btn=>{
  btn.addEventListener("click",()=>{
    document.querySelectorAll(".segmented button").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    docType = btn.dataset.type;
    updatePreview();
  });
});

function getData(){
  const d={};
  fields.forEach(k=>d[k]=$(k).value.trim());
  return d;
}
function esc(s){return String(s||"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function para(s){return esc(s).replace(/\n/g,"<br>");}

function updatePreview(){
  const d=getData();
  const title = d.name || "Your Name";
  const contact=[d.phone,d.email,d.location].filter(Boolean).map(esc).join(" • ");
  const heading = docType==="cv" ? "Curriculum Vitae" : "Job Application";
  $("documentPreview").innerHTML = `
    <h1>${esc(title)}</h1>
    <p class="contact">${contact || "Phone • Email • Location"}</p>
    <p><strong>${esc(d.role || "Target role")}</strong></p>
    <hr>
    ${docType==="application" ? `<h2>Application</h2><p>Dear Hiring Manager,</p><p>${para(d.summary || "I am writing to apply for the advertised position. I believe my skills and experience make me a suitable candidate.")}</p>` : ""}
    <h2>${docType==="cv" ? "Professional Summary" : "Education"}</h2>
    <p>${para(docType==="cv" ? (d.summary||"Add your professional summary.") : (d.education||"Add your education details."))}</p>
    ${docType==="cv" ? `<h2>Education</h2><p>${para(d.education||"Add your education details.")}</p>` : ""}
    <h2>Work Experience</h2><p>${para(d.experience||"Add your work experience.")}</p>
    <h2>Skills</h2><p>${para(d.skills||"Add your skills.")}</p>
    <h2>References</h2><p>${para(d.references||"Available on request.")}</p>
  `;
}
$("previewBtn").onclick=updatePreview;
$("printBtn").onclick=()=>window.print();

$("saveBtn").onclick=()=>{
  localStorage.setItem("jobready_profile",JSON.stringify(getData()));
  alert("Your details have been saved on this device.");
};
$("clearBtn").onclick=()=>{
  if(confirm("Clear all saved details?")){
    localStorage.removeItem("jobready_profile");
    fields.forEach(k=>$(k).value="");
    updatePreview();
  }
};

const saved=localStorage.getItem("jobready_profile");
if(saved){
  try{
    const d=JSON.parse(saved);
    fields.forEach(k=>{if(d[k]!==undefined)$(k).value=d[k]});
    updatePreview();
  }catch(e){}
}

function chatReply(q){
  q=q.toLowerCase();
  if(q.includes("summary")||q.includes("objective"))
    return "Keep your summary short: say what role you want, your strongest skills, and the value you can bring. Aim for 2–4 sentences.";
  if(q.includes("skill"))
    return "List real skills related to the job. Examples: communication, customer care, Microsoft Office, sales, teamwork, driving, or computer skills.";
  if(q.includes("experience"))
    return "Write the employer, job title, dates, and 3–5 important duties or achievements. If you have no formal experience, include internships, volunteering, projects, or relevant practical work.";
  if(q.includes("application")||q.includes("cover"))
    return "A good application explains the job you want, why you are interested, your relevant strengths, and a polite request for an interview.";
  if(q.includes("education"))
    return "Start with your most recent qualification. Include institution, course/qualification and year when useful.";
  return "I can guide you on summaries, skills, education, work experience, CV structure, and job applications. Ask me one of those.";
}
$("chatBtn").onclick=sendChat;
$("chatInput").addEventListener("keydown",e=>{if(e.key==="Enter")sendChat()});
function sendChat(){
  const q=$("chatInput").value.trim(); if(!q)return;
  const box=$("chatMessages");
  box.innerHTML += `<div class="user">${esc(q)}</div><div class="bot">${esc(chatReply(q))}</div>`;
  $("chatInput").value="";
  box.scrollTop=box.scrollHeight;
}
