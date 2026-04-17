let languages = [];

fetch("/search-index.json")
  .then(res => res.json())
  .then(data => { languages = data; });

function levenshtein(a, b) {
  a = a.toLowerCase().trim();
  b = b.toLowerCase().trim();
  const dp = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));

  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  return dp[a.length][b.length];
}

function validCandidate(query, name) {
  query = query.toLowerCase();
  name = name.toLowerCase();
  let matchCount = 0;
  for (let c of query) {
    if (name.includes(c)) matchCount++;
  }
  return (matchCount / query.length) >= 0.6;
}

function score(a, b) {
  const maxLen = Math.max(a.length, b.length);
  const dist = levenshtein(a, b);
  let s = (1 - dist / maxLen) * 100;
  if (s > 100) s = 100;
  if (s < 0) s = 0;
  return Math.round(s);
}

function getResults(query) {
  if (!languages.length) return [];
  const q = query.toLowerCase().trim();
  return languages
    .filter(lang => validCandidate(q, lang.name))
    .map(lang => ({
      ...lang,
      score: score(lang.name, q)
    }))
    .sort((a, b) => b.score - a.score);
}

document.addEventListener("DOMContentLoaded", () => {
  const input = document.querySelector(".search input");
  const button = document.querySelector(".search button");

  if (!input || !button) return;

  const dropdown = document.createElement("div");
  dropdown.className = "search-dropdown";
  input.parentElement.appendChild(dropdown);

  function render(query) {
    query = query.trim().toLowerCase();
    if (!query || !languages.length) {
      dropdown.style.display = "none";
      return;
    }

    const results = getResults(query);
    const best = results[0];

    dropdown.innerHTML = "";
    dropdown.style.display = "block";

    if (best && best.score >= 70 && best.score < 90) {
      const hint = document.createElement("div");
      hint.className = "search-hint";
      hint.innerHTML = `did you mean <b>${best.name}</b>?`;
      hint.onclick = () => { window.location.href = best.file; };
      dropdown.appendChild(hint);
    }

    results.slice(0, 6).forEach((res, i) => {
      const item = document.createElement("div");
      item.className = "search-item";
      if (i === 0) item.classList.add("active");
      item.innerHTML = `<span>${res.name}</span><small>${res.score}</small>`;
      item.onclick = () => { window.location.href = res.file; };
      dropdown.appendChild(item);
    });
  }

  function doSearch() {
    const results = getResults(input.value);
    const best = results[0];
    if (best) {
      window.location.href = best.file;
      return;
    }
    input.style.border = "2px solid red";
    setTimeout(() => {
      input.style.border = "2px solid #3c2f2f";
    }, 500);
  }

  input.addEventListener("input", () => render(input.value));
  input.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      e.preventDefault();
      doSearch();
    }
  });
  button.addEventListener("click", doSearch);
});