import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const URL="https://wbuyglftsgldasawsllt.supabase.co";
const KEY="sb_publishable_GJt9mKuvro43J_iJZduL6w_3SWPPAfG";
const supabase=createClient(URL,KEY);
const $=id=>document.getElementById(id);
const locale=document.body.dataset.locale||"en";
const copy={
 ar:{
  needAuth:"سجّل الدخول أولاً.",emailPassword:"أدخل البريد الإلكتروني وكلمة المرور.",signedUp:"تم إنشاء الحساب. أكّد بريدك الإلكتروني، ثم ارجع إلى دردشة SODO وسجّل الدخول.",
  usernameInvalid:"اسم المستخدم يجب أن يكون 3–20 حرفاً إنجليزياً صغيراً أو رقماً أو شرطة سفلية.",usernameTaken:"اسم المستخدم مستخدم بالفعل. اختر اسماً آخر.",profileSaved:"تم حفظ ملفك الشخصي.",
  searchMin:"اكتب 3 أحرف على الأقل للبحث.",noUsers:"لم نعثر على مستخدم بهذا الاسم.",noConversations:"لا توجد محادثات بعد. ابحث عن @username لإرسال طلب صداقة.",
  sendError:"تعذّر إرسال الرسالة.",emptyMessage:"اكتب رسالة أولاً.",profileError:"تعذّر تحميل ملفك الشخصي.",updated:"تم تحديث الصورة الرمزية.",
  generic:"حدث خطأ. حاول مرة أخرى.",noMessages:"ابدأ المحادثة برسالة قصيرة.",justNow:"الآن",addFriend:"إضافة صديق",requestSent:"تم إرسال الطلب",
  incoming:"طلبات واردة",outgoing:"طلبات مرسلة",noIncoming:"لا توجد طلبات واردة.",noOutgoing:"لا توجد طلبات مرسلة.",accept:"قبول",reject:"رفض",
  requestAccepted:"تم قبول الطلب. يمكنكما الآن بدء المحادثة.",requestRejected:"تم رفض طلب الصداقة.",requestError:"تعذّر تنفيذ طلب الصداقة.",
  alreadyFriends:"صديقان — افتح المحادثة",pendingIncoming:"هذا المستخدم أرسل إليك طلب صداقة",pendingOutgoing:"طلب الصداقة قيد الانتظار"
 },
 en:{
  needAuth:"Please sign in first.",emailPassword:"Enter your email and password.",signedUp:"Account created. Confirm the email, then return to SODO Chat and sign in.",
  usernameInvalid:"Username must be 3–20 lowercase letters, numbers or underscores.",usernameTaken:"That username is already taken. Choose another.",profileSaved:"Your profile has been saved.",
  searchMin:"Enter at least 3 characters to search.",noUsers:"No users found.",noConversations:"No conversations yet. Search for an @username to send a friend request.",
  sendError:"Could not send the message.",emptyMessage:"Write a message first.",profileError:"Could not load your profile.",updated:"Avatar updated.",
  generic:"Something went wrong. Please try again.",noMessages:"Start the conversation with a message.",justNow:"Now",addFriend:"Add friend",requestSent:"Request sent",
  incoming:"Incoming requests",outgoing:"Sent requests",noIncoming:"No incoming requests.",noOutgoing:"No sent requests.",accept:"Accept",reject:"Decline",
  requestAccepted:"Request accepted. You can now start chatting.",requestRejected:"Friend request declined.",requestError:"Could not process the friend request.",
  alreadyFriends:"Friends — open chat",pendingIncoming:"This user sent you a friend request",pendingOutgoing:"Friend request pending"
 },
 ru:{
  needAuth:"Сначала войдите в аккаунт.",emailPassword:"Введите почту и пароль.",signedUp:"Аккаунт создан. Подтвердите почту, затем вернитесь в SODO Chat и войдите.",
  usernameInvalid:"Имя: 3–20 символов, строчные латинские буквы, цифры или подчёркивание.",usernameTaken:"Это имя уже занято. Выберите другое.",profileSaved:"Профиль сохранён.",
  searchMin:"Введите не менее 3 символов.",noUsers:"Пользователи не найдены.",noConversations:"Пока нет чатов. Найдите @username и отправьте запрос в друзья.",
  sendError:"Не удалось отправить сообщение.",emptyMessage:"Сначала напишите сообщение.",profileError:"Не удалось загрузить профиль.",updated:"Аватар обновлён.",
  generic:"Произошла ошибка. Попробуйте ещё раз.",noMessages:"Начните разговор с сообщения.",justNow:"Сейчас",addFriend:"Добавить",requestSent:"Запрос отправлен",
  incoming:"Входящие запросы",outgoing:"Отправленные запросы",noIncoming:"Нет входящих запросов.",noOutgoing:"Нет отправленных запросов.",accept:"Принять",reject:"Отклонить",
  requestAccepted:"Запрос принят. Теперь можно начать чат.",requestRejected:"Запрос отклонён.",requestError:"Не удалось обработать запрос.",
  alreadyFriends:"Вы друзья — открыть чат",pendingIncoming:"Этот пользователь отправил вам запрос",pendingOutgoing:"Запрос ожидает ответа"
 }
};
const t=copy[locale]||copy.en;
const emojis=["😀","😃","😄","😁","😅","😂","🙂","😉","😊","😍","🥰","😘","😎","🤔","😭","😢","😡","🤝","👍","👎","👏","🙏","❤️","💚","✨","🔥","🎉","🌙","⭐","☕"];
let user=null,profile=null,selectedAvatar=1,activeConversation=null,activeOther=null,activeChannel=null,searchTimer=null,editingProfile=false;
function toast(message){const el=$("toast");el.textContent=message;el.classList.remove("hidden");clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.add("hidden"),3200)}
function show(id,on){$(id).classList.toggle("hidden",!on)}
function normalizeUsername(value){return value.trim().replace(/^@/,"").toLowerCase()}
function validUsername(value){return /^[a-z0-9_]{3,20}$/.test(value)}
function avatarSrc(id){return "/sodo/assets/chat/avatars/avatar-"+id+".svg"}
function makeButton(label,className,handler){const b=document.createElement("button");b.type="button";b.className=className;b.textContent=label;b.addEventListener("click",handler);return b}
function avatarButton(id,selected){const b=document.createElement("button");b.type="button";b.className="avatar-choice";b.setAttribute("aria-pressed",String(selected));b.innerHTML='<img alt="" src="'+avatarSrc(id)+'">';b.addEventListener("click",()=>{selectedAvatar=id;document.querySelectorAll(".avatar-choice").forEach(x=>x.setAttribute("aria-pressed","false"));b.setAttribute("aria-pressed","true")});return b}
function renderAvatarChoices(){const grid=$("avatar-grid");grid.replaceChildren();for(let i=1;i<=10;i++)grid.append(avatarButton(i,i===selectedAvatar))}
async function getSession(){const {data,error}=await supabase.auth.getSession();if(error)throw error;return data.session}
async function loadProfile(){const {data,error}=await supabase.from("chat_profiles").select("id,username,avatar_id").eq("id",user.id).maybeSingle();if(error)throw error;return data}
function setSelf(){$("self-avatar").src=avatarSrc(profile.avatar_id);$("self-handle").textContent="@"+profile.username}
async function enterApp(){show("auth-panel",false);show("profile-setup",false);show("chat-app",true);setSelf();await Promise.all([loadConversations(),loadFriendRequests()])}
async function initialize(){
 const session=await getSession();user=session?.user||null;
 if(!user){show("auth-panel",true);show("profile-setup",false);show("chat-app",false);return}
 try{profile=await loadProfile();if(!profile){show("auth-panel",false);show("profile-setup",true);show("chat-app",false);selectedAvatar=1;renderAvatarChoices();return}await enterApp()}
 catch(error){console.error(error);toast(t.profileError)}
}
$("signin").addEventListener("click",async()=>{const email=$("email").value.trim(),password=$("password").value;if(!email||!password){toast(t.emailPassword);return}$("signin").disabled=true;try{const {error}=await supabase.auth.signInWithPassword({email,password});if(error)throw error;await initialize()}catch(e){toast(e.message||t.generic)}finally{$("signin").disabled=false}});
$("signup").addEventListener("click",async()=>{const email=$("email").value.trim(),password=$("password").value;if(!email||!password){toast(t.emailPassword);return}$("signup").disabled=true;try{const {data,error}=await supabase.auth.signUp({email,password,options:{emailRedirectTo:"https://bblaock.github.io/sodo/account/"}});if(error)throw error;if(data.session){user=data.user;await initialize()}else toast(t.signedUp)}catch(e){toast(e.message||t.generic)}finally{$("signup").disabled=false}});
$("save-profile").addEventListener("click",async()=>{
 const username=normalizeUsername($("username").value);if(!validUsername(username)){toast(t.usernameInvalid);return}
 const button=$("save-profile");button.disabled=true;
 try{const wasEditing=editingProfile;const query=wasEditing?supabase.from("chat_profiles").update({username,avatar_id:selectedAvatar}).eq("id",user.id):supabase.from("chat_profiles").insert({id:user.id,username,avatar_id:selectedAvatar});const {data,error}=await query.select("id,username,avatar_id").single();if(error){if(error.code==="23505")throw new Error(t.usernameTaken);throw error}profile=data;editingProfile=false;button.textContent=locale==="ar"?"حفظ الملف الشخصي":locale==="ru"?"Сохранить профиль":"Save profile";toast(wasEditing?t.updated:t.profileSaved);await enterApp()}
 catch(e){toast(e.message||t.generic)}finally{button.disabled=false}
});
$("edit-profile").addEventListener("click",()=>{editingProfile=true;selectedAvatar=profile.avatar_id;renderAvatarChoices();$("username").value=profile.username;show("chat-app",false);show("profile-setup",true);$("save-profile").textContent=locale==="ar"?"حفظ التغييرات":locale==="ru"?"Сохранить изменения":"Save changes"});
async function getFriendRequest(otherId){const low=[user.id,otherId].sort()[0],high=[user.id,otherId].sort()[1];const {data,error}=await supabase.from("chat_friend_requests").select("id,requester_id,addressee_id,status,created_at,responded_at").eq("pair_low",low).eq("pair_high",high).maybeSingle();if(error)throw error;return data}
async function searchUsers(query){
 const value=normalizeUsername(query),results=$("search-results");results.replaceChildren();if(value.length<3){toast(t.searchMin);return}
 const {data,error}=await supabase.rpc("search_chat_profile",{p_username:value});if(error)throw error;
 if(!data?.length){const p=document.createElement("p");p.className="tiny-note";p.textContent=t.noUsers;results.append(p);return}
 for(const person of data){const request=await getFriendRequest(person.id);const b=document.createElement("div");b.className="user-result";const img=document.createElement("img");img.src=avatarSrc(person.avatar_id);img.alt="";const d=document.createElement("div");const strong=document.createElement("strong");strong.textContent="@"+person.username;const small=document.createElement("span");const actions=document.createElement("div");actions.className="user-result-actions";d.append(strong,small);b.append(img,d,actions);
  if(request?.status==="accepted"){small.textContent=t.alreadyFriends;actions.append(makeButton(locale==="ar"?"فتح":locale==="ru"?"Открыть":"Open","mini-action",()=>openConversation(person).catch(e=>toast(e.message||t.generic))))}
  else if(request?.status==="pending"&&request.requester_id===user.id){small.textContent=t.pendingOutgoing;actions.append(makeButton(t.requestSent,"mini-action is-muted",()=>{}))}
  else if(request?.status==="pending"&&request.addressee_id===user.id){small.textContent=t.pendingIncoming;actions.append(makeButton(t.accept,"mini-action",()=>acceptRequest(request,person).catch(e=>toast(e.message||t.requestError))),makeButton(t.reject,"mini-action is-muted",()=>rejectRequest(request).catch(e=>toast(e.message||t.requestError))))}
  else{small.textContent="";actions.append(makeButton(t.addFriend,"mini-action",()=>sendFriendRequest(person).catch(e=>toast(e.message||t.requestError))))}
  results.append(b);
 }
}
$("search-form").addEventListener("submit",async e=>{e.preventDefault();try{await searchUsers($("user-search").value)}catch(e){toast(e.message||t.generic)}});
$("user-search").addEventListener("input",()=>{clearTimeout(searchTimer);const value=$("user-search").value;if(normalizeUsername(value).length<3){$("search-results").replaceChildren();return}searchTimer=setTimeout(()=>searchUsers(value).catch(e=>toast(e.message||t.generic)),300)});
async function sendFriendRequest(person){const {error}=await supabase.rpc("send_chat_friend_request",{p_target_user_id:person.id});if(error)throw error;toast(t.requestSent);await Promise.all([loadFriendRequests(),searchUsers($("user-search").value)])}
async function acceptRequest(request,person){const {data,error}=await supabase.from("chat_friend_requests").update({status:"accepted",responded_at:new Date().toISOString()}).eq("id",request.id).eq("addressee_id",user.id).eq("status","pending").select("id").maybeSingle();if(error)throw error;if(!data)throw new Error(t.requestError);toast(t.requestAccepted);await loadFriendRequests();await openConversation(person)}
async function rejectRequest(request){const {data,error}=await supabase.from("chat_friend_requests").update({status:"rejected",responded_at:new Date().toISOString()}).eq("id",request.id).eq("addressee_id",user.id).eq("status","pending").select("id").maybeSingle();if(error)throw error;if(!data)throw new Error(t.requestError);toast(t.requestRejected);await loadFriendRequests();if($("user-search").value.trim())await searchUsers($("user-search").value)}
async function loadFriendRequests(){
 const {data:rows,error}=await supabase.from("chat_friend_requests").select("id,requester_id,addressee_id,status,created_at").eq("status","pending").or("requester_id.eq."+user.id+",addressee_id.eq."+user.id).order("created_at",{ascending:false}).limit(100);if(error)throw error;
 const ids=[...new Set(rows.map(r=>r.requester_id===user.id?r.addressee_id:r.requester_id))];let people=[];
 if(ids.length){const {data,error:profileError}=await supabase.rpc("get_chat_profiles",{p_user_ids:ids});if(profileError)throw profileError;people=data||[]}
 const byId=new Map(people.map(p=>[p.id,p]));const incoming=$("incoming-requests"),outgoing=$("outgoing-requests");incoming.replaceChildren();outgoing.replaceChildren();
 const incomingRows=rows.filter(r=>r.addressee_id===user.id),outgoingRows=rows.filter(r=>r.requester_id===user.id);
 function addRow(container,request,person,isIncoming){if(!person)return;const row=document.createElement("div");row.className="request-item";const img=document.createElement("img");img.src=avatarSrc(person.avatar_id);img.alt="";const handle=document.createElement("strong");handle.textContent="@"+person.username;const actions=document.createElement("div");actions.className="request-actions";if(isIncoming){actions.append(makeButton(t.accept,"mini-action",()=>acceptRequest(request,person).catch(e=>toast(e.message||t.requestError))),makeButton(t.reject,"mini-action is-muted",()=>rejectRequest(request).catch(e=>toast(e.message||t.requestError))))}else{const pending=document.createElement("span");pending.className="request-pending";pending.textContent=t.requestSent;actions.append(pending)}row.append(img,handle,actions);container.append(row)}
 for(const request of incomingRows)addRow(incoming,request,byId.get(request.requester_id),true);
 for(const request of outgoingRows)addRow(outgoing,request,byId.get(request.addressee_id),false);
 if(!incomingRows.length){const p=document.createElement("p");p.className="tiny-note";p.textContent=t.noIncoming;incoming.append(p)}
 if(!outgoingRows.length){const p=document.createElement("p");p.className="tiny-note";p.textContent=t.noOutgoing;outgoing.append(p)}
 $("incoming-count").textContent=String(incomingRows.length);$("outgoing-count").textContent=String(outgoingRows.length);
}
async function ensureConversation(other){
 const ids=[user.id,other.id].sort();const {error:insertError}=await supabase.from("chat_conversations").insert({user_one:ids[0],user_two:ids[1]});if(insertError&&insertError.code!=="23505")throw insertError;
 const {data,error}=await supabase.from("chat_conversations").select("id,user_one,user_two,created_at").eq("user_one",ids[0]).eq("user_two",ids[1]).single();if(error)throw error;return data
}
async function openConversation(other){
 const conversation=await ensureConversation(other);activeConversation=conversation;activeOther=other;$("thread-avatar").src=avatarSrc(other.avatar_id);$("thread-handle").textContent="@"+other.username;show("empty-thread",false);show("active-thread",true);
 await loadMessages();await loadConversations();
 if(activeChannel)await supabase.removeChannel(activeChannel);
 activeChannel=supabase.channel("sodo-chat-"+conversation.id).on("postgres_changes",{event:"INSERT",schema:"public",table:"chat_messages",filter:"conversation_id=eq."+conversation.id},payload=>appendMessage(payload.new)).subscribe();
}
async function loadConversations(){
 const {data:rows,error}=await supabase.from("chat_conversations").select("id,user_one,user_two,created_at").or("user_one.eq."+user.id+",user_two.eq."+user.id).order("created_at",{ascending:false}).limit(50);if(error)throw error;
 $("conversation-count").textContent=String(rows.length);const list=$("conversation-list");list.replaceChildren();if(!rows.length){const p=document.createElement("p");p.className="tiny-note";p.textContent=t.noConversations;list.append(p);return}
 const ids=rows.map(c=>c.user_one===user.id?c.user_two:c.user_one);const {data:people,error:peopleError}=await supabase.rpc("get_chat_profiles",{p_user_ids:ids});if(peopleError)throw peopleError;const byId=new Map((people||[]).map(p=>[p.id,p]));
 for(const c of rows){const person=byId.get(c.user_one===user.id?c.user_two:c.user_one);if(!person)continue;const b=document.createElement("button");b.type="button";b.className="conversation-item";b.setAttribute("aria-current",String(activeConversation?.id===c.id));const img=document.createElement("img");img.src=avatarSrc(person.avatar_id);img.alt="";const d=document.createElement("div");const strong=document.createElement("strong");strong.textContent="@"+person.username;const small=document.createElement("span");small.textContent=locale==="ar"?"محادثة خاصة":locale==="ru"?"Личный чат":"Private chat";d.append(strong,small);b.append(img,d);b.addEventListener("click",()=>openConversation(person).catch(e=>toast(e.message||t.generic)));list.append(b)}
}
function appendMessage(row){
 const container=$("messages"),placeholder=container.querySelector(".tiny-note");if(placeholder)placeholder.remove();if(container.querySelector('[data-message-id="'+row.id+'"]'))return;
 const article=document.createElement("article");article.className="message"+(row.sender_id===user.id?" mine":"");article.dataset.messageId=String(row.id);const p=document.createElement("p");p.textContent=row.body;const time=document.createElement("time");time.dateTime=row.created_at;time.textContent=new Date(row.created_at).toLocaleTimeString(locale==="ar"?"ar-IQ":locale==="ru"?"ru-RU":"en-US",{hour:"2-digit",minute:"2-digit"});article.append(p,time);container.append(article);container.scrollTop=container.scrollHeight;
}
async function loadMessages(){const {data,error}=await supabase.from("chat_messages").select("id,conversation_id,sender_id,body,created_at").eq("conversation_id",activeConversation.id).order("created_at",{ascending:true}).limit(200);if(error)throw error;const container=$("messages");container.replaceChildren();for(const row of data)appendMessage(row);if(!data.length){const p=document.createElement("p");p.className="tiny-note";p.style.textAlign="center";p.textContent=t.noMessages;container.append(p)}}
$("message-form").addEventListener("submit",async e=>{e.preventDefault();const body=$("message-input").value.trim();if(!body){toast(t.emptyMessage);return}if(!activeConversation)return;const button=$("message-form").querySelector("button[type=submit]");button.disabled=true;try{const {data,error}=await supabase.from("chat_messages").insert({conversation_id:activeConversation.id,sender_id:user.id,body}).select("id,conversation_id,sender_id,body,created_at").single();if(error)throw error;appendMessage(data);$("message-input").value=""}catch(e){toast(e.message||t.sendError)}finally{button.disabled=false;$("message-input").focus()}});
$("emoji-toggle").addEventListener("click",()=>show("emoji-picker",$("emoji-picker").classList.contains("hidden")));
const picker=$("emoji-picker");for(const emoji of emojis){const b=document.createElement("button");b.type="button";b.textContent=emoji;b.setAttribute("aria-label",emoji);b.addEventListener("click",()=>{$("message-input").value+=$("message-input").value?" "+emoji:emoji;$("message-input").focus()});picker.append(b)}
$("signout").addEventListener("click",async()=>{if(activeChannel)await supabase.removeChannel(activeChannel);await supabase.auth.signOut();user=null;profile=null;activeConversation=null;initialize().catch(e=>toast(e.message||t.generic))});
supabase.auth.onAuthStateChange((_event,session)=>{queueMicrotask(()=>{user=session?.user||null;initialize().catch(e=>toast(e.message||t.generic))})});
renderAvatarChoices();initialize().catch(e=>toast(e.message||t.generic));
