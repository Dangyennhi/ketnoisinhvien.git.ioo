/* InternMatch - Frontend thuần (Sinh viên)
   - Router bằng hash: #/login #/register #/profile #/dashboard #/jobs/:id
   - Gọi API tại API_BASE (cập nhật nếu backend ở nơi khác)
*/

const API_BASE = "http://localhost:5000/api"; // chỉnh nếu cần

/* ---------- Helper API wrapper ---------- */
async function api(path, opts = {}) {
  const token = localStorage.getItem("token");
  const headers = opts.headers || {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (!(opts.body instanceof FormData)) headers["Content-Type"] = headers["Content-Type"] || "application/json";
  const res = await fetch(API_BASE + path, { ...opts, headers });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || res.statusText);
  }
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) return res.json();
  return res.text();
}

/* ---------- Simple Router ---------- */
const app = document.getElementById("app");
const navLinks = document.getElementById("nav-links");

function setNav() {
  const token = localStorage.getItem("token");
  navLinks.innerHTML = "";
  if (token) {
    navLinks.innerHTML = `
      <a href="#/dashboard" class="btn btn-ghost">Dashboard</a>
      <a href="#/profile" class="btn btn-ghost">Hồ sơ</a>
      <a href="#/logout" class="btn btn-ghost">Đăng xuất</a>
    `;
  } else {
    navLinks.innerHTML = `
      <a href="#/login" class="btn btn-ghost">Đăng nhập</a>
      <a href="#/register" class="btn btn-ghost">Đăng ký</a>
    `;
  }
}
setNav();

/* ---------- Pages ---------- */

function showLogin() {
  document.title = "Đăng nhập - InternMatch";
  app.innerHTML = `
    <div class="card" style="max-width:480px;margin:24px auto">
      <h3>Đăng nhập (Sinh viên)</h3>
      <div class="small">Dùng email và mật khẩu</div>
      <div style="height:12px"></div>
      <input id="email" class="input" placeholder="Email" />
      <input id="password" type="password" class="input" placeholder="Mật khẩu" />
      <div style="height:12px"></div>
      <button id="btnLogin" class="btn btn-primary">Đăng nhập</button>
      <div class="small" style="margin-top:8px">Chưa có tài khoản? <a href="#/register">Đăng ký</a></div>
    </div>
  `;
  document.getElementById("btnLogin").onclick = async () => {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    try {
      const data = await api("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
      if (data.token) localStorage.setItem("token", data.token);
      setNav();
      location.hash = "#/dashboard";
    } catch (err) {
      alert("Đăng nhập thất bại: " + err.message);
    }
  };
}

function showRegister() {
  document.title = "Đăng ký - InternMatch";
  app.innerHTML = `
    <div class="card" style="max-width:480px;margin:24px auto">
      <h3>Đăng ký (Sinh viên)</h3>
      <input id="name" class="input" placeholder="Họ và tên" />
      <input id="email" class="input" placeholder="Email" />
      <input id="password" type="password" class="input" placeholder="Mật khẩu" />
      <div style="height:12px"></div>
      <button id="btnRegister" class="btn btn-primary">Đăng ký</button>
      <div class="small" style="margin-top:8px">Đã có tài khoản? <a href="#/login">Đăng nhập</a></div>
    </div>
  `;
  document.getElementById("btnRegister").onclick = async () => {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    try {
      await api("/auth/register", { method: "POST", body: JSON.stringify({ name, email, password, role: "student" }) });
      alert("Đăng ký thành công. Vui lòng đăng nhập.");
      location.hash = "#/login";
    } catch (err) {
      alert("Lỗi đăng ký: " + err.message);
    }
  };
}

async function showProfile() {
  document.title = "Hồ sơ - InternMatch";
  app.innerHTML = `
    <div class="card">
      <h3>Hồ sơ sinh viên</h3>
      <div class="grid grid-2" style="align-items:start">
        <div>
          <label>Họ và tên</label>
          <input id="name" class="input" />
          <label>Chuyên ngành</label>
          <input id="major" class="input" />
          <label>Kỹ năng (phân cách bởi dấu phẩy)</label>
          <input id="skills" class="input" />
          <label>Tiểu sử / mô tả ngắn</label>
          <textarea id="bio" class="input" rows="4"></textarea>
          <div style="height:8px"></div>
          <button id="btnSave" class="btn btn-primary">Lưu hồ sơ</button>
        </div>
        <div>
          <label>Tải CV (PDF, DOC, JPG, PNG)</label>
          <input id="file" type="file" accept=".pdf,.doc,.docx,.jpg,.png" class="input" />
          <div style="height:8px"></div>
          <button id="btnUpload" class="btn btn-primary">Tải lên & Phân tích</button>
          <div id="ocrStatus" class="small" style="margin-top:8px"></div>
          <div style="height:12px"></div>
          <h4>Kỹ năng đã nhận diện</h4>
          <div id="skillList" class="small"></div>
        </div>
      </div>
    </div>
  `;

  // load profile if exists
  try {
    const p = await api("/student/profile").catch(()=>null);
    if (p) {
      document.getElementById("name").value = p.name || "";
      document.getElementById("major").value = p.major || "";
      document.getElementById("skills").value = (p.skills || []).join(", ");
      document.getElementById("bio").value = p.bio || "";
      renderSkills(p.skills || []);
    }
  } catch (err) { /* ignore */ }

  document.getElementById("btnSave").onclick = async () => {
    const body = {
      name: document.getElementById("name").value,
      major: document.getElementById("major").value,
      skills: document.getElementById("skills").value.split(",").map(s=>s.trim()).filter(Boolean),
      bio: document.getElementById("bio").value
    };
    try {
      await api("/student/profile", { method: "PUT", body: JSON.stringify(body) });
      alert("Lưu thành công");
    } catch (err) { alert("Lỗi lưu: " + err.message); }
  };

  function renderSkills(arr) {
    const el = document.getElementById("skillList");
    el.innerHTML = arr.map(s=>`<span class="skill">${s}</span>`).join(" ");
  }

  document.getElementById("btnUpload").onclick = async () => {
    const f = document.getElementById("file").files[0];
    if (!f) return alert("Chưa chọn file");
    const fd = new FormData(); fd.append("file", f);
    const status = document.getElementById("ocrStatus");
    status.textContent = "Đang tải CV lên...";
    try {
      const res = await fetch(API_BASE + "/files/upload", { method: "POST", body: fd, headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }});
      if (!res.ok) throw new Error("Upload thất bại");
      const j = await res.json(); // { file_id: ... }
      status.textContent = "Đã upload. Đang yêu cầu phân tích OCR...";
      // trigger OCR (backend may process async)
      await api("/ocr/process", { method: "POST", body: JSON.stringify({ file_id: j.file_id }) });
      status.textContent = "Đã gửi yêu cầu OCR. Đợi vài giây...";
      // poll profile for updated skills (simple)
      setTimeout(async ()=>{
        try {
          const p2 = await api("/student/profile");
          renderSkills(p2.skills || []);
          status.textContent = "Phân tích hoàn tất.";
        } catch (e) { status.textContent = "Phân tích hoàn tất (không lấy được dữ liệu)"; }
      }, 1500);
    } catch (err) { status.textContent = "Lỗi: " + err.message; }
  };
}

async function showDashboard() {
  document.title = "Dashboard - InternMatch";
  app.innerHTML = `
    <div class="card">
      <h3>Việc thực tập phù hợp</h3>
      <div id="jobsList"></div>
    </div>
  `;
  const jobsList = document.getElementById("jobsList");
  try {
    const data = await api("/matches/my");
    const items = data.matches || [];
    if (items.length === 0) jobsList.innerHTML = "<div class='small'>Không có kết quả phù hợp.</div>";
    else jobsList.innerHTML = items.map(j=>`
      <div class="job-row">
        <div>
          <div style="font-weight:600">${escapeHtml(j.title)}</div>
          <div class="small">${escapeHtml(j.company || "")}</div>
        </div>
        <div class="flex">
          <div class="small">${j.score}%</div>
          <a class="btn btn-primary" href="#/jobs/${j.id}">Xem</a>
        </div>
      </div>
    `).join("");
  } catch (err) {
    // fallback mock
    const mock = [
      { id:"job-1", title:"Thực tập Frontend Developer", company:"Công ty A", score:87 },
      { id:"job-2", title:"Thực tập Data Analyst", company:"StartUp B", score:72 }
    ];
    jobsList.innerHTML = mock.map(j=>`
      <div class="job-row">
        <div>
          <div style="font-weight:600">${j.title}</div>
          <div class="small">${j.company}</div>
        </div>
        <div class="flex">
          <div class="small">${j.score}%</div>
          <a class="btn btn-primary" href="#/jobs/${j.id}">Xem</a>
        </div>
      </div>
    `).join("");
  }
}

async function showJobDetail(id) {
  document.title = "Chi tiết công việc - InternMatch";
  app.innerHTML = `<div class="card"><div>Đang tải...</div></div>`;
  let job = null;
  try {
    job = await api(`/jobs/${id}`);
  } catch (err) {
    job = { id, title: "Thực tập Frontend Developer", company: "Công ty A", description: "Làm UI/UX, React, HTML/CSS", skills: ["react","javascript"] };
  }
  app.innerHTML = `
    <div class="card">
      <h3>${escapeHtml(job.title)}</h3>
      <div class="small">${escapeHtml(job.company)}</div>
      <p style="margin-top:8px">${escapeHtml(job.description || "")}</p>
      <div class="small">Kỹ năng: ${(job.skills||[]).join(', ')}</div>
      <div style="height:12px"></div>
      <button id="btnApply" class="btn btn-primary">Ứng tuyển</button>
      <div style="height:12px"></div>
      <h4>Chat với nhà tuyển dụng</h4>
      <div class="chat-box" id="chatBox"></div>
      <div class="flex" style="margin-top:8px">
        <input id="chatInput" class="input" placeholder="Gửi tin nhắn..." />
        <button id="btnSend" class="btn btn-primary">Gửi</button>
      </div>
    </div>
  `;
  document.getElementById("btnApply").onclick = async () => {
    try {
      await api("/applications", { method: "POST", body: JSON.stringify({ job_id: id }) });
      alert("Ứng tuyển thành công");
    } catch (err) { alert("Lỗi khi ứng tuyển: " + err.message); }
  };

  // load chat messages
  const chatBox = document.getElementById("chatBox");
  async function loadChat(){
    try {
      const res = await api(`/chat/job/${id}`);
      const arr = res.messages || [];
      chatBox.innerHTML = arr.map(m => `<div class="${m.from === 'me' ? 'msg-me' : ''}"><div class="msg ${m.from === 'me' ? '' : 'msg-from'}">${escapeHtml(m.text)}</div></div>`).join("");
      chatBox.scrollTop = chatBox.scrollHeight;
    } catch (err) {
      chatBox.innerHTML = "<div class='small'>Không có cuộc trò chuyện.</div>";
    }
  }
  await loadChat();

  document.getElementById("btnSend").onclick = async () => {
    const text = document.getElementById("chatInput").value.trim();
    if (!text) return;
    try {
      await api(`/chat/job/${id}`, { method: "POST", body: JSON.stringify({ text }) });
      document.getElementById("chatInput").value = "";
      await loadChat();
    } catch (err) { alert("Gửi thất bại: " + err.message); }
  };
}

/* ---------- Utilities ---------- */
function escapeHtml(s="") {
  return String(s).replace(/[&<>"']/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
}

/* ---------- Router logic ---------- */
async function router() {
  setNav();
  const hash = location.hash || "#/dashboard";
  if (hash === "#/logout") {
    localStorage.removeItem("token"); setNav(); location.hash = "#/login"; return;
  }
  if (hash.startsWith("#/login")) return showLogin();
  if (hash.startsWith("#/register")) return showRegister();
  if (hash.startsWith("#/profile")) return showProfile();
  if (hash.startsWith("#/dashboard")) return showDashboard();
  if (hash.startsWith("#/jobs/")) {
    const id = hash.split("/")[2];
    return showJobDetail(id);
  }
  // default
  showDashboard();
}

window.addEventListener("hashchange", router);
window.addEventListener("load", router);
