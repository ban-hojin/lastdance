// API 호출 
// 1. 호출 주소를 사용자 키값을 넣고 가져온다. 
// 2. 키값을 변수로 저장한다.
// 3. 인출 시간차 문제로 async 함수를 사용한다.(fetch 동시)
// 4. API 표준에 따른 호출을 선언한다.
// 5. fectch 함수를 통해 뉴스를 가져온다.
// 6. await를 통해 함수를 기다린다.(비동기 함수)
// 7. 자료를 json(객체형) 형식으로 받아온다.
// 8. 변수 할당을 통해 뉴스를 호출하여 받아온다.
// 9. 배포 문제로 URL 변경, 임시 API 활용 

// 자료 연계 및 현출
// 1. 화면구성 : 부트스트랩 설정, 컨테이너 사용 
// 2. 뉴욕타임즈 로고 및 메뉴 스타일 복사 활용 
// 3. 헤드라인, 이미지 등 크기 및 위치 조정
// 4. 메뉴 버튼, 메뉴 이름, 밑줄 등 스타일 뉴욕타임즈 복사 활용
// 5. 이벤트 및 칼러 지정 
// 6. 메인 내용 이지미와 글 위치 및 형식 설정 
// 7. 부트스트랩 그리드 사용, 스타일 조정
// 8. 뉴스를 받아오는 함수 샇용 및 위치 지정
// 9. Array,map 함수를 통해 내용을 지정하고 가져옴
// 10. 변수 및 콤마 등의 오류 해결 (mdn web docs 활용)

// 카테고리별, 키워드 검색
// 페이지네이션 

const API_KEY = "b1fe516cb2ff4032b010ec5773f3a973";
let articles = [];
let page = 1;
let totalPage = 1;
const PAGE_SIZE = 10;
// let url = new URL(
//   `https://newsapi.org/v2/top-headlines?country=kr&pageSize=${PAGE_SIZE}`
// );
let url = new URL(
  `https://noona-times-v2.netlify.app/top-headlines?country=kr&pageSize=${PAGE_SIZE}`
);
let menus = document.querySelectorAll("#menu-list button");
menus.forEach((menu) =>
  menu.addEventListener("click", (e) => getNewsByTopic(e))
);

const getNews = async () => {
  try {
    url.searchParams.set("page", page);
    console.log("Rrr", url);
    let response = await fetch(url);
    let data = await response.json();
    if (response.status == 200) {
      console.log("resutl", data);
      if (data.totalResults == 0) {
        page = 0;
        totalPage = 0;
        renderPagination();
        throw new Error("검색어와 일치하는 결과가 없습니다");
      }

      articles = data.articles;
      totalPage = Math.ceil(data.totalResults / PAGE_SIZE);
      render();
      renderPagination();
    } else {
      page = 0;
      totalPage = 0;
      renderPagination();
      throw new Error(data.message);
    }
  } catch (e) {
    errorRender(e.message);
    page = 0;
    totalPage = 0;
    renderPagination();
  }
};
const getLatestNews = () => {
  page = 1; // 9. 새로운거 search마다 1로 리셋
  // url = new URL(
  //   `https://newsapi.org/v2/top-headlines?country=kr&pageSize=${PAGE_SIZE}&apiKey=${API_KEY}`
  // );
  url = new URL(
    `https://noona-times-v2.netlify.app/top-headlines?country=kr&pageSize=${PAGE_SIZE}&apiKey=${API_KEY}`
  );
  getNews();
};

const getNewsByTopic = (event) => {
  const topic = event.target.textContent.toLowerCase();

  page = 1;
  // url = new URL(
  //   `https://newsapi.org/v2/top-headlines?country=kr&pageSize=${PAGE_SIZE}&category=${topic}&apiKey=${API_KEY}`
  // );
  url = new URL(
    `https://noona-times-v2.netlify.app/top-headlines?country=kr&pageSize=${PAGE_SIZE}&category=${topic}&apiKey=${API_KEY}`
  );
  getNews();
};

const openSearchBox = () => {
  let inputArea = document.getElementById("input-area");
  if (inputArea.style.display === "inline") {
    inputArea.style.display = "none";
  } else {
    inputArea.style.display = "inline";
  }
};

const getNewsByKeyword = () => {
  const keyword = document.getElementById("search-input").value;

  page = 1;
  // url = new URL(
  //   `https://newsapi.org/v2/top-headlines?q=${keyword}&country=kr&pageSize=${PAGE_SIZE}&apiKey=${API_KEY}`
  // );
  url = new URL(
    `https://noona-times-v2.netlify.app/top-headlines?q=${keyword}&country=kr&pageSize=${PAGE_SIZE}&apiKey=${API_KEY}`
  );
  getNews();
};

const render = () => {
  let resultHTML = articles
    .map((news) => {
      return `<div class="news row">
        <div class="col-lg-4">
            <img class="news-img"
                src="${
                  news.urlToImage ||
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU"
                }" />
        </div>
        <div class="col-lg-8">
            <a class="title" target="_blank" href="${news.url}">${
        news.title
      }</a>
            <p>${
              news.description == null || news.description == ""
                ? "내용없음"
                : news.description.length > 200
                ? news.description.substring(0, 200) + "..."
                : news.description
            }</p>
            <div>${news.source.name || "no source"}  ${moment(
        news.publishedAt
      ).fromNow()}</div>
        </div>
    </div>`;
    })
    .join("");

  document.getElementById("news-board").innerHTML = resultHTML;
};
const renderPagination = () => {
  let paginationHTML = ``;
  let pageGroup = Math.ceil(page / 5);
  let last = pageGroup * 5;
  if (last > totalPage) {
    last = totalPage;
  }
  let first = last - 4 <= 0 ? 1 : last - 4;
  if (first >= 6) {
    paginationHTML = `<li class="page-item" onclick="pageClick(1)">
                        <a class="page-link" href='#js-bottom'>&lt;&lt;</a>
                      </li>
                      <li class="page-item" onclick="pageClick(${page - 1})">
                        <a class="page-link" href='#js-bottom'>&lt;</a>
                      </li>`;
  }
  for (let i = first; i <= last; i++) {
    paginationHTML += `<li class="page-item ${i == page ? "active" : ""}" >
                        <a class="page-link" href='#js-bottom' onclick="pageClick(${i})" >${i}</a>
                       </li>`;
  }

  if (last < totalPage) {
    paginationHTML += `<li class="page-item" onclick="pageClick(${page + 1})">
                        <a  class="page-link" href='#js-program-detail-bottom'>&gt;</a>
                       </li>
                       <li class="page-item" onclick="pageClick(${totalPage})">
                        <a class="page-link" href='#js-bottom'>&gt;&gt;</a>
                       </li>`;
  }

  document.querySelector(".pagination").innerHTML = paginationHTML;
};

const pageClick = (pageNum) => {
  page = pageNum;
  window.scrollTo({ top: 0, behavior: "smooth" });
  getNews();
};
const errorRender = (message) => {
  document.getElementById(
    "news-board"
  ).innerHTML = `<h3 class="text-center alert alert-danger mt-1">${message}</h3>`;
};

const openNav = () => {
  document.getElementById("mySidenav").style.width = "250px";
};

const closeNav = () => {
  document.getElementById("mySidenav").style.width = "0";
};
getLatestNews();