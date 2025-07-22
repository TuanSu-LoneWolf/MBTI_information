import { mbtiData } from '../data/mbtiInfo.js';

// ================== 1. KHỞI TẠO TRANG DỰA TRÊN TÊN URL được gửi từ index.html ==================

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const mbtiCode = urlParams.get('code');
  if (mbtiCode) {
    showDetailPage(mbtiCode);
  } else {
    // Nếu người dùng truy cập thẳng mà không có code
    document.getElementById('detail-code').textContent = 'Không tìm thấy mã MBTI.';
  }
});


// ================== 2. HIỂN THỊ TRANG CHI TIẾT ==================

function showDetailPage(mbtiCode) {
  const mbtiGroup = mbtiData.mbtiGroups.find(group => group.code === mbtiCode);
  if (!mbtiGroup) {
    console.error(`Không tìm thấy dữ liệu cho MBTI code: ${mbtiCode}`);
    return;
  }

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

  function renderItems(section) {
    const header = document.getElementById('right-detail-header');
    if (header) header.textContent = section.section;

    itemsContainer.querySelectorAll('.detail-item, .tables-container, .item-content').forEach(item => item.remove());

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
        menuIcon.setAttribute('src', '../img/menu.png');
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

  // Thay title nhóm tính cách tương ứng
  document.title = `${mbtiGroup.code} - ${mbtiGroup.name}`
}

// ================== 3. NÚT TRÁI / PHẢI ==================

document.querySelector('.left-arrow')?.addEventListener('click', () => {
  goToPage(currentPage === 0 ? 1 : 0);
});

document.querySelector('.right-arrow')?.addEventListener('click', () => {
  goToPage(currentPage === 0 ? 1 : 0);
});

// ================== 4. MENU TRÁI ==================

const menuButton = document.querySelector('.btn-nav');
const menuIcon = document.querySelector('.menu');
const leftDetail = document.querySelector('.left-detail-container');

menuButton?.addEventListener('click', function () {
  leftDetail.classList.toggle('show');
  menuButton.classList.toggle('active');

  if (menuButton.classList.contains('active')) {
    menuIcon.setAttribute('src', '../img/menuActive.png');
  } else {
    menuIcon.setAttribute('src', '../img/menu.png');
  }
});

// ================== 5. Hiện thị tên nhóm tính cách ==================