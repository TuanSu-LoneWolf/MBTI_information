import { mbtiOpposite, personalityTypes } from '../data/mbtiInfo.js';

// ================== 1. TẠO DANH SÁCH OPPOSITE ==================
const gridOpposite = document.getElementById('grid-opposite');
const oppositeList = document.getElementById("opposite-list");

mbtiOpposite.forEach(object => {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <div class="card-content">
      <img src="${object.img}">
      <div class="card-note">
        <div class="number">${object.id}</div>
        <p>${object.description}</p>
      </div>
    </div>
  `;
  gridOpposite.appendChild(card);
});

const endOpposite = document.createElement("div");
endOpposite.id = "end-opposite";
endOpposite.innerText = "Bằng cách kết hợp từng khía cạnh của những cặp đối lập này, MBTI hình thành 16 nhóm tính cách và định nghĩa chúng dựa trên những nghiên cứu về tâm lý học của Katherine Cook Briggs và con gái bà, Isabel Briggs Myers.";
oppositeList.appendChild(endOpposite);

// ================== 2. TẠO DANH SÁCH MBTI (CAROUSEL) ==================
const mbtiGrid = document.getElementById('mbti-grid');
const dotsContainer = document.getElementById('dots-container');
let currentPage = 0;

function renderPages() {
  mbtiGrid.innerHTML = '';

  for (let i = 0; i < 2; i++) {
    const page = document.createElement('div');
    page.className = 'mbti-page';

    personalityTypes.slice(i * 8, (i + 1) * 8).forEach(item => {
      const card = document.createElement('a');
      card.className = 'mbti-card';
      card.setAttribute('href', `pages/detail.html?code=${item.code}`);

      card.innerHTML = `
      ${window.innerWidth <= 1100 ? `
        <div class="card-front-title">    
          <div class="mobile-item-code">${item.code} - ${item.name}</div>
          <div class="mobile-desc">${item.description}</div>
        </div>
        <img src="${item.image}" alt="${item.name}">` : ''}
      <div class="card-inner">
        <div class="card-front" style="color:${item.color}; background:${item.colorBr}">
          <h3>${item.code}</h3>
          <p>${item.name}</p>
          <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="card-back">
          <p>${item.description}</p>
        </div>
      </div>`;

      page.appendChild(card);
    });

    mbtiGrid.appendChild(page);
  }
}

function renderDots() {
  dotsContainer.innerHTML = '';
  for (let i = 0; i < 2; i++) {
    const dot = document.createElement('span');
    dot.className = 'dot' + (i === currentPage ? ' active' : '');
    dot.addEventListener('click', () => goToPage(i));
    dotsContainer.appendChild(dot);
  }
}

function goToPage(pageIndex) {
  if (pageIndex < 0) pageIndex = 1;
  if (pageIndex > 1) pageIndex = 0;
  currentPage = pageIndex;
  mbtiGrid.style.transform = `translateX(-${pageIndex * 50}%)`;
  renderDots();
}

// ================== 3. SỰ KIỆN DẪN HƯỚNG & KHỞI TẠO ==================

document.querySelector('.left-arrow').addEventListener('click', () => {
  goToPage(currentPage === 0 ? 1 : 0);
});

document.querySelector('.right-arrow').addEventListener('click', () => {
  goToPage(currentPage === 0 ? 1 : 0);
});

window.addEventListener('resize', () => {
  renderPages();
  renderDots();
  goToPage(currentPage);
});

document.addEventListener('DOMContentLoaded', function () {
  renderPages();
  renderDots();
});
