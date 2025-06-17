const postId = new URLSearchParams(location.search).get("id");
let postIndex = -1;

function loadPost() {
  const posts = JSON.parse(localStorage.getItem("posts") || "[]");
  postIndex = posts.findIndex(p => p.id == postId);
  if (postIndex === -1) {
    document.getElementById("postDetail").innerHTML = "<p>게시글이 존재하지 않습니다.</p>";
    return;
  }

  const post = posts[postIndex];
  document.getElementById("postDetail").innerHTML = `
    <h2>${post.title}</h2>
    <p><strong>${post.author}</strong> | ${post.date}</p>
    <hr>
    <p>${post.content}</p>
  `;

  updateLikeDislikeDisplay(post);
  renderComments(post);
}

function getVoteStatus() {
  return localStorage.getItem(`vote_${postId}`); // 'like', 'dislike', or null
}

function setVoteStatus(status) {
  if (status) localStorage.setItem(`vote_${postId}`, status);
  else localStorage.removeItem(`vote_${postId}`);
}

function updateLikeDislikeDisplay(post) {
  document.getElementById("likeCount").textContent = post.likes || 0;
  document.getElementById("dislikeCount").textContent = post.dislikes || 0;

  const status = getVoteStatus();
  document.getElementById("likeBtn").classList.toggle("voted", status === "like");
  document.getElementById("dislikeBtn").classList.toggle("voted", status === "dislike");
}

function vote(type) {
  const posts = JSON.parse(localStorage.getItem("posts") || "[]");
  const post = posts[postIndex];
  if (!post) return;

  const status = getVoteStatus();

  if (status === type) {
    // 같은 버튼 다시 누르면 취소
    if (type === "like") post.likes--;
    else post.dislikes--;
    setVoteStatus(null);
  } else {
    // 반대 버튼 눌렀다면 바꿔치기
    if (type === "like") {
      post.likes++;
      if (status === "dislike") post.dislikes--;
    } else {
      post.dislikes++;
      if (status === "like") post.likes--;
    }
    setVoteStatus(type);
  }

  localStorage.setItem("posts", JSON.stringify(posts));
  loadPost();
}

function addComment() {
  const text = document.getElementById("commentInput").value.trim();
  if (!text) return;

  const posts = JSON.parse(localStorage.getItem("posts") || "[]");
  posts[postIndex].comments.push({ text, date: new Date().toLocaleString() });

  localStorage.setItem("posts", JSON.stringify(posts));
  document.getElementById("commentInput").value = "";
  loadPost();
}

function renderComments(post) {
  const list = document.getElementById("commentList");
  list.innerHTML = "";

  if (!post.comments || post.comments.length === 0) {
    list.innerHTML = "<li>댓글이 없습니다.</li>";
    return;
  }

  post.comments.forEach(c => {
    const li = document.createElement("li");
    li.innerHTML = `${c.text}<br><small>${c.date}</small>`;
    list.appendChild(li);
  });
}

// 삭제 기능
function deletePost() {
  if (!confirm("정말 이 게시글을 삭제하시겠습니까?")) return;

  let posts = JSON.parse(localStorage.getItem("posts") || "[]");
  posts = posts.filter(p => p.id != postId);
  localStorage.setItem("posts", JSON.stringify(posts));

  // 삭제 후 게시판 목록 페이지로 이동
  location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", loadPost);