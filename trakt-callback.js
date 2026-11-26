(() => {
  const params = new URLSearchParams(location.search);
  const code = params.get("code");
  const state = params.get("state");
  if (!code || !state) return;
  const panel = document.querySelector(".language-panel");
  if (panel) {
    panel.innerHTML = '<h1 class="brand">SODO<span class="brand-dot">.</span></h1><p class="prompt" id="trakt-callback-status">جارٍ إكمال الربط الآمن مع Trakt…</p>';
  }
  const cleanUrl = location.pathname;
  fetch("https://wbuyglftsgldasawsllt.supabase.co/functions/v1/trakt-sync", {
    method: "POST",
    headers: { "Content-Type": "application/json", "apikey": "sb_publishable_GJt9mKuvro43J_iJZduL6w_3SWPPAfG" },
    body: JSON.stringify({ action: "callback", code, state })
  }).then(async response => {
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "تعذّر إكمال الربط");
    history.replaceState({}, "", cleanUrl);
    const status = document.getElementById("trakt-callback-status");
    if (status) status.textContent = "تم ربط Trakt بنجاح. جارٍ فتح حساب SODO…";
    setTimeout(() => location.replace("/sodo/account/"), 1200);
  }).catch(error => {
    const status = document.getElementById("trakt-callback-status");
    if (status) status.textContent = error.message + " — ارجع إلى حساب SODO وحاول مرة أخرى.";
    history.replaceState({}, "", cleanUrl);
  });
})();