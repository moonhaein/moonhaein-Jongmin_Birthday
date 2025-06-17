const postsPerPage = 15;
let currentPage = 1;

function getPosts() {
  return JSON.parse(localStorage.getItem("posts") || "[]");
}

function renderPosts() {
  const postList = document.getElementById("postList");
  postList.innerHTML = "";

  const posts = getPosts();
  const start = (currentPage - 1) * postsPerPage;
  const pagePosts = posts.slice(start, start + postsPerPage);

  if (pagePosts.length === 0) {
    postList.innerHTML = "<li>작성된 게시글이 없습니다.</li>";
    return;
  }

  pagePosts.forEach(post => {
    const li = document.createElement("li");
    li.classList.add("clickable");
    li.innerHTML = `<strong>${post.title}</strong><br><small>${post.author} | ${post.date}</small>`;
    li.onclick = () => {
      location.href = `post.html?id=${post.id}`;
    };
    postList.appendChild(li);
  });
}

function renderPagination() {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  const posts = getPosts();
  const totalPages = Math.ceil(posts.length / postsPerPage);

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.classList.add("clickable");
    if (i === currentPage) btn.classList.add("active");
    btn.onclick = () => {
      currentPage = i;
      renderPosts();
      renderPagination();
    };
    pagination.appendChild(btn);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderPosts();
  renderPagination();
});