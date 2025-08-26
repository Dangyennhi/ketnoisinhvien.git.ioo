async function extractCV() {
  const file = document.getElementById("cvFile").files[0];
  if (!file) return alert("Vui lòng chọn file CV!");

  const loader = document.getElementById("waveLoader");
  const progressText = document.getElementById("progressText");
  const ocrTextDiv = document.getElementById("ocrText");


  loader.style.display = "block";
  progressText.innerText = "0%";
  ocrTextDiv.innerHTML = "";

  try {
    const { data: { text } } = await Tesseract.recognize(
      file,
      'vie+eng',
      {
        logger: m => {
          if (m.status === 'recognizing text') {
            let percent = Math.round(m.progress * 100);
            progressText.innerText = `${percent}%`;
          }
        }
      }
    );


    loader.style.display = "none";
    ocrTextDiv.innerHTML = `<b>Kết quả OCR:</b><br>${text}`;
    document.getElementById("name").value = findName(text);
    document.getElementById("email").value = findEmail(text);
    document.getElementById("position").value = findPosition(text);
    document.getElementById("skills").value = findSkills(text);

  } catch (err) {
    console.error(err);
    progressText.innerText = "❌ Lỗi khi đọc CV";
    loader.style.display = "none";
  }
}

function findName(text) {
  let match = text.match(/(?:Họ và tên|Ten)\s*[:\-]?\s*([^\n]+)/i);
  if (match) {
    return match[1].trim();
  }
  let match2 = text.match(/(?:Họ và tên|Tên)\s*[:\-]?\s*\n\s*([^\n]+)/i);
  if (match2) {
    return match2[1].trim();
  }

  return "";
}


function findEmail(text) {
  let emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/);
  return emailMatch ? emailMatch[0] : "";
}
function findPosition(text) {
  let keywords = ["Developer","Tester","IT","Java","Website","Support"];
  let found = keywords.find(k => text.toLowerCase().includes(k.toLowerCase()));
  return found || "";
}
function findSkills(text) {
  let skills = [];
  let allSkills = ["Java","Python","SQL","C++","JavaScript","Web","AI","HTML","CSS"];
  allSkills.forEach(s => {
    if (text.toLowerCase().includes(s.toLowerCase())) skills.push(s);
  });
  return skills.join(", ");
}

function saveProfile() {
  let profile = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    position: document.getElementById("position").value,
    skills: document.getElementById("skills").value.split(",").map(s => s.trim())
  };
  localStorage.setItem("studentProfile", JSON.stringify(profile));
  document.getElementById("saveResult").innerText = "✅ Hồ sơ đã lưu!";
}

function matchCompanies() {
   console.log("Danh sách công ty:", companies);
  let profile = JSON.parse(localStorage.getItem("studentProfile"));
  if (!profile) return alert("Chưa có hồ sơ!");

  let resultHTML = "";
  companies.forEach(c => {
    let score = 0;
    if (c.job.toLowerCase().includes(profile.position.toLowerCase())) score += 50;
    profile.skills.forEach(s => {
      if (c.job.toLowerCase().includes(s.toLowerCase())) score += 10;
    });
    if (score > 100) score = 100;

    resultHTML += `
      <div class="company">
        <span class="highlight">${c.name}</span> - ${c.job} <br>
        📍 ${c.address} <br>
        ⏰ ${c.workTime} <br>
        🔗 <a href="${c.link}" target="_blank">Chi tiết</a><br>
        ✅ Độ phù hợp: <b>${score}%</b>
      </div>
    `;
  });

  document.getElementById("companyList").innerHTML = resultHTML;
}
