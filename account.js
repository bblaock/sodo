import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://wbuyglftsgldasawsllt.supabase.co";
const SUPABASE_KEY = "sb_publishable_GJt9mKuvro43J_iJZduL6w_3SWPPAfG";
const FUNCTION_URL = SUPABASE_URL + "/functions/v1/trakt-sync";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const $ = (id) => document.getElementById(id);
const authPanel = $("auth-panel"), accountPanel = $("account-panel"), message = $("message");

function say(text, error = false) {
  message.textContent = text;
  message.classList.remove("hidden");
  message.style.borderColor = error ? "#a34a4a" : "var(--line)";
  message.style.color = error ? "#ffb2a8" : "var(--muted)";
}
async function session() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}
async function api(action) {
  const current = await session();
  if (!current) throw new Error("سجّل الدخول إلى حساب SODO أولاً");
  const response = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": "Bearer " + current.access_token, "apikey": SUPABASE_KEY },
    body: JSON.stringify({ action })
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "تعذّر تنفيذ الطلب");
  return result;
}
async function refreshStatus() {
  try {
    const status = await api("status");
    $("trakt-status").textContent = status.connected
      ? "Trakt متصل بحسابك" + (status.last_synced_at ? " · آخر مزامنة: " + new Date(status.last_synced_at).toLocaleString("ar") : " · لم تتم المزامنة بعد")
      : "حساب Trakt غير مربوط حالياً";
    $("connect").classList.toggle("hidden", status.connected);
    $("sync").classList.toggle("hidden", !status.connected);
    $("disconnect").classList.toggle("hidden", !status.connected);
  } catch (error) { say(error.message, true); }
}
async function render() {
  const current = await session();
  authPanel.classList.toggle("hidden", !!current);
  accountPanel.classList.toggle("hidden", !current);
  if (current) {
    $("identity").textContent = "مسجّل الدخول: " + (current.user.email || "حساب SODO");
    await refreshStatus();
  }
}
$("signin").addEventListener("click", async () => {
  try {
    const { error } = await supabase.auth.signInWithPassword({ email: $("email").value.trim(), password: $("password").value });
    if (error) throw error;
    say("تم تسجيل الدخول.");
    await render();
  } catch (error) { say(error.message, true); }
});
$("signup").addEventListener("click", async () => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: $("email").value.trim(),
      password: $("password").value,
      options: { emailRedirectTo: "https://bblaock.github.io/sodo/account/" }
    });
    if (error) throw error;
    if (data.session) { say("تم إنشاء حسابك."); await render(); }
    else say("أرسلنا رسالة تأكيد إلى بريدك. افتحها لإكمال إنشاء الحساب، ثم ارجع إلى صفحة حساب SODO.");
  } catch (error) { say(error.message, true); }
});
$("connect").addEventListener("click", async () => {
  try {
    const result = await api("start");
    location.href = result.authorization_url;
  } catch (error) { say(error.message, true); }
});
$("sync").addEventListener("click", async () => {
  $("sync").disabled = true;
  try {
    const result = await api("sync");
    say("اكتملت المزامنة. تمت إضافة " + result.imported + " مشاهدة إلى سجلك الخاص.");
    await refreshStatus();
  } catch (error) { say(error.message, true); }
  finally { $("sync").disabled = false; }
});
$("disconnect").addEventListener("click", async () => {
  if (!confirm("هل تريد فصل Trakt وحذف رموز الربط وحالة المزامنة؟ لن نحذف سجل المشاهدة المستورد.")) return;
  try { await api("disconnect"); say("تم فصل Trakt وحذف بيانات الربط."); await refreshStatus(); }
  catch (error) { say(error.message, true); }
});
$("signout").addEventListener("click", async () => {
  await supabase.auth.signOut();
  say("تم تسجيل الخروج.");
  await render();
});
supabase.auth.onAuthStateChange(() => { queueMicrotask(render); });
render();