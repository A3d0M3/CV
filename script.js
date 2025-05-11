// Збереження інформації про браузер
const browserInfo = {
  userAgent: navigator.userAgent,
  platform: navigator.platform,
  appVersion: navigator.appVersion,
  appName: navigator.appName,
  appCodeName: navigator.appCodeName,
  language: navigator.language
};

localStorage.setItem("browserInfo", JSON.stringify(browserInfo));

const footer = document.getElementById("info");
const storedInfo = JSON.parse(localStorage.getItem("browserInfo"));

footer.innerText = `Платформа: ${storedInfo.platform} | Мова: ${storedInfo.language} | Версія: ${storedInfo.appVersion}`;

// Отримання коментарів
fetch("https://jsonplaceholder.typicode.com/posts/9/comments")
  .then(response => response.json())
  .then(comments => {
    const container = document.getElementById("comments");

    comments.forEach(comment => {
      const div = document.createElement("div");
      div.style.border = "1px solid #ccc";
      div.style.margin = "10px 0";
      div.style.padding = "10px";

      div.innerHTML = `
        <h4>${comment.name}</h4>
        <p><strong>Email:</strong> ${comment.email}</p>
        <p>${comment.body}</p>
      `;

      container.appendChild(div);
    });
  })
  .catch(error => {
    console.error("Помилка при завантаженні коментарів:", error);
  });

// Відображення вікна зворотного зв'язку
setTimeout(() => {
  const modal = document.getElementById("feedback-modal");
  modal.style.display = "block";
}, 60000);

document.querySelector(".close-btn").onclick = function () {
  document.getElementById("feedback-modal").style.display = "none";
};

window.onclick = function (event) {
  const modal = document.getElementById("feedback-modal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
};

// Тема (нічна/денна)
const themeSwitch = document.getElementById("theme-switch");

themeSwitch.addEventListener("change", () => {
  const isDark = themeSwitch.checked;
  document.body.classList.toggle("dark-theme", isDark);
  localStorage.setItem("theme", isDark ? "dark" : "light");
  localStorage.setItem("themeSetAt", Date.now());
});

// Автовизначення теми з урахуванням часу останньої ручної зміни
function autoSetTheme() {
  const hours = new Date().getHours();
  const isNight = (hours < 7 || hours >= 21);

  const savedTheme = localStorage.getItem("theme");
  const themeSetAt = localStorage.getItem("themeSetAt");

  const now = Date.now();
  const oneHour = 60 * 60 * 1000;

  const recentlySetManually = themeSetAt && now - themeSetAt < oneHour;

  if (savedTheme && recentlySetManually) {
    document.body.classList.toggle("dark-theme", savedTheme === "dark");
    themeSwitch.checked = savedTheme === "dark";
  } else {
    document.body.classList.toggle("dark-theme", isNight);
    themeSwitch.checked = isNight;
    localStorage.setItem("theme", isNight ? "dark" : "light");
  }
}

document.addEventListener("DOMContentLoaded", autoSetTheme);
