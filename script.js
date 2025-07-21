import { mbtiOpposite, personalityTypes, mbtiData } from './data.js';

// ================== 1. HIỂN THỊ / ĐÓNG TRANG CHI TIẾT ==================

/**
 * Hiển thị lại trang danh sách MBTI, ẩn trang chi tiết
 */
function showListPage() {
  document.getElementById('detail-page').style.display = 'none';
  document.getElementById('list').style.display = 'block';
  window.scrollTo(0, 0);
}

/**
 * Hiển thị trang chi tiết MBTI theo mã code
 * - Ẩn danh sách, hiện chi tiết
 * - Tải hình, code, description
 * - Hiển thị danh sách section (table of contents)
 * - Xử lý click vào từng section để hiển thị nội dung chi tiết
 */
function showDetailPage(mbtiCode) {
  const mbtiGroup = mbtiData.mbtiGroups.find(group => group.code === mbtiCode);
  if (!mbtiGroup) return;

  document.getElementById('list').style.display = 'none';
  document.getElementById('detail-page').style.display = 'block';

  document.getElementById('detail-image').setAttribute('src', mbtiGroup.image);
  document.getElementById('detail-code').textContent = `${mbtiGroup.code} - ${mbtiGroup.name}`;
  document.getElementById('detail-description').textContent = mbtiGroup.description;

  const tableOfContent = document.querySelector('.tableofcontents');
  tableOfContent.querySelectorAll('.sections-div').forEach(div => div.remove());

  const sectionsDiv = document.createElement('div');
  sectionsDiv.className = 'sections-div';
  let activeSection = null;

  const itemsContainer = document.querySelector('.right-detail-container');

  /**
   * Hiển thị nội dung chi tiết của một section
   * - Hiển thị tiêu đề
   * - Hiển thị nội dung và bảng (nếu có)
   */
  function renderItems(section) {
    const header = document.getElementById('right-detail-header');
    if (header) header.textContent = section.section;

    itemsContainer.querySelectorAll('.detail-item, .tables-container').forEach(item => item.remove());

    if (Array.isArray(section.items)) {
      section.items.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'detail-item';

        if (item.title) {
          const itemTitle = document.createElement('h3');
          itemTitle.className = 'item-title';
          itemTitle.textContent = item.title;
          itemDiv.appendChild(itemTitle);
        }

        if (item.content) {
          const itemContent = document.createElement('div');
          itemContent.className = 'item-content';
          itemContent.innerHTML = item.content.replace(/\n/g, '<br>');
          itemDiv.appendChild(itemContent);
        }

        if (Array.isArray(item.itemsChild)) {
          item.itemsChild.forEach(child => {
            const childDiv = document.createElement('div');
            childDiv.className = 'detail-item';

            if (child.titleChild) {
              const childTitle = document.createElement('h4');
              childTitle.className = 'item-title child-item';
              childTitle.textContent = child.titleChild;
              childDiv.appendChild(childTitle);
            }

            if (child.content) {
              const childContent = document.createElement('div');
              childContent.className = 'item-content';
              childContent.innerHTML = child.content.replace(/\n/g, '<br>');
              childDiv.appendChild(childContent);
            }

            itemDiv.appendChild(childDiv);
          });
        }

        itemsContainer.appendChild(itemDiv);
      });
    }

    if (Array.isArray(section.tables)) {
      const tablesContainer = document.createElement('div');
      tablesContainer.className = 'tables-container';
      tablesContainer.style.overflowX = 'auto';
      tablesContainer.style.padding = '10px 0';

      section.tables.forEach(table => {
        const tableWrapper = document.createElement('div');
        tableWrapper.className = 'table-wrapper';
        tableWrapper.style.marginBottom = '16px';

        const tbl = document.createElement('table');

        const thead = document.createElement('thead');
        const headRow = document.createElement('tr');
        table.headers.forEach(headerText => {
          const th = document.createElement('th');
          th.innerHTML = headerText;
          headRow.appendChild(th);
        });
        thead.appendChild(headRow);
        tbl.appendChild(thead);

        const tbody = document.createElement('tbody');
        table.rows.forEach(row => {
          const tr = document.createElement('tr');
          row.forEach(cell => {
            const td = document.createElement('td');
            td.innerHTML = cell;
            tr.appendChild(td);
          });
          tbody.appendChild(tr);
        });

        tbl.appendChild(tbody);
        tableWrapper.appendChild(tbl);
        tablesContainer.appendChild(tableWrapper);
      });

      itemsContainer.appendChild(tablesContainer);
    }

    if (section.content) {
          const sectionContent = document.createElement('div');
          sectionContent.className = 'item-content';
          sectionContent.innerHTML = section.content.replace(/\n/g, '<br>');
          itemsContainer.appendChild(sectionContent);
    }
  }

  // Tạo danh sách section bên trái (table of contents)
  mbtiGroup.details.forEach(section => {
    const sectionDiv = document.createElement('div');
    sectionDiv.className = 'section-div';

    const iconDiv = document.createElement('div');
    iconDiv.className = 'icon';
    iconDiv.textContent = '➤';
    iconDiv.style.opacity = '0';
    iconDiv.style.transition = 'opacity 0.3s, transform 0.3s';

    const title = document.createElement('span');
    title.textContent = section.section;

    sectionDiv.appendChild(iconDiv);
    sectionDiv.appendChild(title);

    sectionDiv.addEventListener('mouseenter', () => {
      if (window.innerWidth > 480 && activeSection !== sectionDiv) {
        iconDiv.style.opacity = '1';
        iconDiv.style.transform = 'translateX(2px)';
      }
    });

    sectionDiv.addEventListener('mouseleave', () => {
      if (window.innerWidth > 480 && activeSection !== sectionDiv) {
        iconDiv.style.opacity = '0';
        iconDiv.style.transform = 'translateX(-10px)';
      }
    });

    sectionDiv.addEventListener('click', () => {
      sectionsDiv.querySelectorAll('.section-div').forEach(div => {
        div.classList.remove('active');
        div.querySelector('.icon').style.opacity = '0';
        div.querySelector('.icon').style.transform = window.innerWidth > 480 ? 'translateX(-10px)' : 'none';
      });

      sectionDiv.classList.add('active');
      iconDiv.style.opacity = '1';
      iconDiv.style.transform = window.innerWidth > 480 ? 'translateX(2px)' : 'none';
      activeSection = sectionDiv;
      renderItems(section);

      if (window.innerWidth <= 480) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        leftDetail.classList.remove('show');
        menuButton.classList.remove('active');
        menuIcon.setAttribute('src', './img/menu.png');
      } else {
        document.getElementById('detail-description').scrollIntoView({ behavior: 'smooth' });
      }
    });

    sectionsDiv.appendChild(sectionDiv);

    if (section.section === 'Tổng quan') {
      sectionDiv.classList.add('active');
      iconDiv.style.opacity = '1';
      iconDiv.style.transform = window.innerWidth > 480 ? 'translateX(2px)' : 'none';
      activeSection = sectionDiv;
      renderItems(section);
    }
  });

  tableOfContent.appendChild(sectionsDiv);
  window.scrollTo(0, 0);
}

window.showListPage = showListPage;

// ================== 2. TẠO DANH SÁCH OPPOSITE ==================

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

// ================== 3. TẠO DANH SÁCH MBTI (CAROUSEL) ==================

const mbtiGrid = document.getElementById('mbti-grid');
const dotsContainer = document.getElementById('dots-container');
let currentPage = 0;

/**
 * Hiển thị danh sách MBTI thành 2 page
 * - Hiển thị 8 loại mỗi trang
 * - Responsive theo width (show mobile view nếu <1100)
 */
function renderPages() {
  mbtiGrid.innerHTML = '';

  for (let i = 0; i < 2; i++) {
    const page = document.createElement('div');
    page.className = 'mbti-page';

    personalityTypes.slice(i * 8, (i + 1) * 8).forEach(item => {
      const card = document.createElement('div');
      card.className = 'mbti-card';
      card.setAttribute('data-code', item.code);

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

      card.addEventListener('click', function () {
        showDetailPage(item.code);
      });

      page.appendChild(card);
    });

    mbtiGrid.appendChild(page);
  }
}

/**
 * Tạo và làm mới dots dưới carousel
 */
function renderDots() {
  dotsContainer.innerHTML = '';
  for (let i = 0; i < 2; i++) {
    const dot = document.createElement('span');
    dot.className = 'dot' + (i === currentPage ? ' active' : '');
    dot.addEventListener('click', () => goToPage(i));
    dotsContainer.appendChild(dot);
  }
}

/**
 * Di chuyển carousel đến trang chỉ định
 */
function goToPage(pageIndex) {
  if (pageIndex < 0) pageIndex = 1;
  if (pageIndex > 1) pageIndex = 0;
  currentPage = pageIndex;
  mbtiGrid.style.transform = `translateX(-${pageIndex * 50}%)`;
  renderDots();
}

// ================== 4. SỰ KIỆN DẪN HƯỚNG & KHỞI TẠO ==================

document.querySelector('.left-arrow').addEventListener('click', () => {
  goToPage(currentPage === 0 ? 1 : 0);
});

document.querySelector('.right-arrow').addEventListener('click', () => {
  goToPage(currentPage === 0 ? 1 : 0);
});

const menuButton = document.querySelector('.btn-nav');
const menuIcon = document.querySelector('.menu');
const leftDetail = document.querySelector('.left-detail-container');

menuButton.addEventListener('click', function () {
  leftDetail.classList.toggle('show');
  menuButton.classList.toggle('active');

  if (menuButton.classList.contains('active')) {
    menuIcon.setAttribute('src', './img/menuActive.png');
  } else {
    menuIcon.setAttribute('src', './img/menu.png');
  }
});

window.addEventListener('resize', () => {
  renderPages();
  renderDots();
  goToPage(currentPage);
});

document.addEventListener('DOMContentLoaded', function () {
  renderPages();
  renderDots();
  showListPage();
});
