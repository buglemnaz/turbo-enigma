// Konum ve veri
const lat = 36.5472, lon = 31.9943;
const stopData = {
  schedules: {
    "12": ["06:40","07:40","08:40","09:40","10:40","11:40","12:40","13:40","14:40","15:40","16:40","17:40","18:40","19:40","20:40","21:40","22:40","23:40"],
    "202": ["07:05","08:05","09:05","10:05","11:05","12:05","13:05","14:05","15:05","16:05","17:05","18:05","19:05","20:05","21:05","22:05","23:05"],
    "2B": ["06:38","07:38","08:38","09:38","10:38","11:38","12:38","13:38","14:38","15:38","16:38","17:38","18:38","19:38","20:38","21:38","22:38","23:38"],
    "50": ["06:40","07:40","08:40","09:40","10:40","11:40","12:40","13:40","14:40","15:40","16:40","17:40","18:40","19:40","20:40","21:40","22:40","23:40","01:07"]
  }
};
const translations = {
  tr: { stopName:"Başkent Hastanesi Durağı", route:"Hatlar: 12, 202, 2B, 50", nextBusText:"En yakın otobüs (hat {line}): {min} dk sonra", noBus:"Bugünlük otobüs yok" },
  en: { stopName:"Başkent Hospital Stop", route:"Lines: 12, 202, 2B, 50", nextBusText:"Next bus (line {line}): in {min} min", noBus:"No more buses today" },
  de: { stopName:"Haltestelle Başkent Krankenhaus", route:"Linien: 12, 202, 2B, 50", nextBusText:"Nächster Bus (Linie {line}): in {min} Min", noBus:"Heute keine Busse mehr" },
  ru: { stopName:"Остановка Больница Башкент", route:"Маршруты: 12, 202, 2B, 50", nextBusText:"Следующий автобус (маршрут {line}): через {min} мин", noBus:"Сегодня автобусов больше нет" }
};
let currentLang = 'tr';

// Harita kurulumu
const map = L.map('map').setView([lat, lon], 16);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{ attribution:'© OpenStreetMap contributors' }).addTo(map);
const marker = L.marker([lat, lon]).addTo(map);

// Zaman hesaplama
function minutesUntil(timeStr) {
  const now = new Date(), [h,m] = timeStr.split(':').map(Number);
  const t=new Date(now); t.setHours(h,m,0,0); const diff=(t-now)/60000;
  return diff>=0 ? Math.floor(diff) : null;
}

// Ekranı güncelle
function update() {
  const t = translations[currentLang];
  document.getElementById("stop-name").textContent = t.stopName;
  document.getElementById("route").textContent = t.route;
  marker.bindPopup(t.stopName);
  const ul = document.getElementById("bus-times");
  ul.innerHTML = "";
  let next = null;
  Object.entries(stopData.schedules).forEach(([line, times])=>{
    times.forEach(time=>{
      const li = document.createElement("li");
      li.textContent = `${line} — ${time}`;
      ul.appendChild(li);
      const m = minutesUntil(time);
      if(m!==null && (!next || m<next.min)) next={line,min:m};
    });
  });
  document.getElementById("next-bus").textContent = next
    ? t.nextBusText.replace("{line}",next.line).replace("{min}",next.min)
    : t.noBus;
}

// Dil değişimi
function setLanguage(lang) {
  currentLang = lang;
  update();
}

// Sayfa açıldığında
window.onload = () => {
  update();
  setInterval(update, 60000);
};