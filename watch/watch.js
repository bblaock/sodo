(() => {
  "use strict";
  const $ = (id) => id.startsWith(".") ? document.querySelector(id) : document.getElementById(id);
  const copy = {
    ar:{eyebrow:"SODO EXPERIENCE / 01",title:"مشاهدة معًا",intro:"فيلم واحد، شاشتان، ولحظة مشتركة مهما كانت المسافة.",roomLabel:"غرفة مشاهدة خاصة",roomTitle:"ابدأ غرفة مشاهدة",yourName:"اسمك",youtubeLink:"رابط YouTube",createRoom:"إنشاء غرفة",joinRoom:"دخول الغرفة",copyInvite:"نسخ رابط الدعوة",roomHint:"أنشئ غرفة ثم شارك رابطها مع الشخص الذي تريد المشاهدة معه.",roomCode:"رمز الغرفة",playerHint:"أضف رابط YouTube لبدء المشاهدة",nowWatching:"نشاهد الآن",noVideo:"لم يتم اختيار فيديو بعد",viewers:"مشاهدون",chatTitle:"الدردشة",chatEmpty:"ابدأوا الحديث أثناء الفيلم…",legal:"استخدم روابط الفيديو التي تسمح بالمشاهدة المضمّنة، واحرص على امتلاك حق مشاركة المحتوى.",connected:"متصل — المزامنة جاهزة",offline:"المزامنة غير مفعّلة بعد",connecting:"جارٍ الاتصال…",badUrl:"أدخل رابط YouTube صحيحًا.",roomCreated:"تم إنشاء الغرفة. انسخ الرابط وشاركه مع صديقك.",joined:"دخلت الغرفة. أرسل الرابط للطرف الآخر.",needBackend:"الواجهة جاهزة، لكن يلزم ربط Supabase لتفعيل المزامنة بين الأجهزة.",noRoom:"أنشئ غرفة أولاً أو افتح رابط دعوة صحيحًا.",copied:"تم نسخ رابط الدعوة.",sendError:"تعذر إرسال الرسالة الآن.",chatPlaceholder:"اكتب رسالة…",watchTogether:"مشاهدة جماعية",guest:"ضيف SODO"},
    en:{eyebrow:"SODO EXPERIENCE / 01",title:"Watch Together",intro:"One film, two screens, one shared moment — no matter the distance.",roomLabel:"PRIVATE WATCH ROOM",roomTitle:"Start a watch room",yourName:"Your name",youtubeLink:"YouTube link",createRoom:"Create room",joinRoom:"Join room",copyInvite:"Copy invite link",roomHint:"Create a room, then share its link with the person you want to watch with.",roomCode:"ROOM CODE",playerHint:"Add a YouTube link to start watching",nowWatching:"NOW WATCHING",noVideo:"No video selected yet",viewers:"viewers",chatTitle:"Chat",chatEmpty:"Say hello while you watch…",legal:"Use videos that allow embedding and make sure you have the right to share the content.",connected:"Connected — sync is ready",offline:"Sync is not enabled yet",connecting:"Connecting…",badUrl:"Enter a valid YouTube link.",roomCreated:"Room created. Copy the invite link and share it.",joined:"You joined the room. Invite the other person.",needBackend:"The interface is ready. Connect Supabase to enable cross-device sync.",noRoom:"Create a room first or open a valid invite link.",copied:"Invite link copied.",sendError:"Message could not be sent.",chatPlaceholder:"Write a message…",watchTogether:"Watch Together",guest:"SODO guest"},
    ru:{eyebrow:"SODO EXPERIENCE / 01",title:"Смотрим вместе",intro:"Один фильм, два экрана и общий момент — несмотря на расстояние.",roomLabel:"ПРИВАТНАЯ КОМНАТА",roomTitle:"Создать комнату",yourName:"Ваше имя",youtubeLink:"Ссылка YouTube",createRoom:"Создать комнату",joinRoom:"Войти в комнату",copyInvite:"Скопировать приглашение",roomHint:"Создайте комнату и отправьте ссылку тому, с кем хотите смотреть.",roomCode:"КОД КОМНАТЫ",playerHint:"Добавьте ссылку YouTube, чтобы начать просмотр",nowWatching:"СЕЙЧАС СМОТРИМ",noVideo:"Видео ещё не выбрано",viewers:"зрителей",chatTitle:"Чат",chatEmpty:"Общайтесь во время просмотра…",legal:"Используйте видео со встроенным просмотром и убедитесь, что у вас есть право делиться контентом.",connected:"Подключено — синхронизация готова",offline:"Синхронизация пока не включена",connecting:"Подключение…",badUrl:"Введите корректную ссылку YouTube.",roomCreated:"Комната создана. Скопируйте ссылку и отправьте её.",joined:"Вы вошли в комнату. Пригласите второго участника.",needBackend:"Интерфейс готов. Подключите Supabase для синхронизации между устройствами.",noRoom:"Сначала создайте комнату или откройте действительную ссылку.",copied:"Ссылка скопирована.",sendError:"Не удалось отправить сообщение.",chatPlaceholder:"Напишите сообщение…",watchTogether:"Смотрим вместе",guest:"Гость SODO"}
  };
  let lang = document.documentElement.lang || localStorage.getItem("sodo-language") || "ar";
  const t = (key) => (copy[lang] || copy.ar)[key] || copy.ar[key] || key;
  function translate() {
    lang = document.documentElement.lang || localStorage.getItem("sodo-language") || "ar";
    document.querySelectorAll("[data-watch]").forEach(el => { const value=t(el.dataset.watch); if(value) el.textContent=value; });
    $("chat-input").placeholder=t("chatPlaceholder");
    $("display-name").placeholder=t("guest");
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }
  new MutationObserver(translate).observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
  translate();

  const config = window.SODO_WATCH_CONFIG || {};
  const hasBackend = Boolean(config.supabaseUrl && config.supabaseAnonKey && window.supabase?.createClient);
  const client = hasBackend ? window.supabase.createClient(config.supabaseUrl,config.supabaseAnonKey) : null;
  const params = new URLSearchParams(location.search);
  let roomId = params.get("room") || "";
  let channel = null;
  let player = null;
  let playerReady = false;
  let applyingRemote = false;
  let pendingVideoId = "";
  let lastVideoId = "";
  let viewerCount = 1;
  const nameInput = $("display-name");
  nameInput.value = sessionStorage.getItem("sodo-watch-name") || "";
  nameInput.addEventListener("change",()=>sessionStorage.setItem("sodo-watch-name",nameInput.value.trim()));
  $("connection-status").textContent = hasBackend ? t("connecting") : t("offline");
  if (!hasBackend) $("connection-status").classList.add("error");

  function youtubeId(value) {
    try {
      const url = new URL(value.trim());
      if (url.hostname === "youtu.be") return url.pathname.slice(1).split("/")[0];
      if (["youtube.com","www.youtube.com","m.youtube.com","youtube-nocookie.com","www.youtube-nocookie.com"].includes(url.hostname)) {
        if (url.pathname === "/watch") return url.searchParams.get("v");
        const match = url.pathname.match(/^\/(embed|shorts|live)\/([\w-]+)/);
        return match ? match[2] : null;
      }
    } catch (_) {}
    return null;
  }
  function setMessage(message){ $("room-message").textContent=message; }
  function showRoom() {
    if(!roomId) return;
    $("room-code-row").hidden=false;
    $("room-code").textContent=roomId.slice(0,8).toUpperCase();
    $("copy-invite").disabled=false;
  }
  function currentInvite(){ const url=new URL(location.href); url.searchParams.set("room",roomId); return url.toString(); }
  async function copyInvite(){
    try { await navigator.clipboard.writeText(currentInvite()); setMessage(t("copied")); }
    catch (_) { setMessage(currentInvite()); }
  }
  $("copy-invite").addEventListener("click",copyInvite);

  function ensurePlayer(videoId) {
    pendingVideoId=videoId;
    $("player-placeholder").hidden=true;
    $("video-title").textContent="YouTube · "+videoId;
    if (playerReady && player) { if(lastVideoId!==videoId){lastVideoId=videoId;player.loadVideoById(videoId);} return; }
    if (window.YT && window.YT.Player && !player) createPlayer(videoId);
  }
  function createPlayer(videoId) {
    player=new YT.Player("youtube-player",{videoId,playerVars:{playsinline:1,rel:0,origin:location.origin},events:{
      onReady:()=>{playerReady=true;lastVideoId=pendingVideoId;},
      onStateChange:(event)=>{if(applyingRemote||!channel)return;const action=event.data===YT.PlayerState.PLAYING?"play":event.data===YT.PlayerState.PAUSED?"pause":null;if(action){
        const time=player.getCurrentTime(),videoId=lastVideoId||pendingVideoId;
        broadcast({type:"playback",action,videoId,time,sentAt:Date.now()});
        if(channel) channel.track({name:nameInput.value.trim()||t("guest"),videoId,action,time,joinedAt:new Date().toISOString()});
      }}
    }});
  }
  window.onYouTubeIframeAPIReady=()=>{if(pendingVideoId)createPlayer(pendingVideoId);};

  async function broadcast(payload){
    if(!channel)return;
    try{await channel.send({type:"broadcast",event:"sodo",payload});}catch(_){}
  }
  function applyPlayback(data){
    if(!playerReady||!player||!data)return;
    applyingRemote=true;
    if(data.videoId&&data.videoId!==lastVideoId){lastVideoId=data.videoId;pendingVideoId=data.videoId;player.loadVideoById(data.videoId,data.time||0);}
    else if(Number.isFinite(data.time)) player.seekTo(Math.max(0,data.time),true);
    if(data.action==="play") player.playVideo();
    if(data.action==="pause") player.pauseVideo();
    window.setTimeout(()=>{applyingRemote=false;},900);
  }
  async function connectRoom(){
    if(!roomId){setMessage(t("noRoom"));return;}
    showRoom();
    if(!hasBackend){setMessage(t("needBackend"));return;}
    if(channel){await client.removeChannel(channel);channel=null;}
    $("connection-status").textContent=t("connecting");
    channel=client.channel("sodo-watch-"+roomId,{config:{broadcast:{ack:true,self:false},presence:{key:crypto.randomUUID()}}});
    channel.on("broadcast",{event:"sodo"},({payload})=>{
      if(payload?.type==="playback")applyPlayback(payload);
      if(payload?.type==="chat")appendMessage(payload.name,payload.message,false);
      if(payload?.type==="video"&&payload.videoId){pendingVideoId=payload.videoId;ensurePlayer(payload.videoId);}
    });
    channel.on("presence",{event:"sync"},()=>{
      const state=channel.presenceState();
      viewerCount=Object.keys(state).length||1;
      $("viewer-count").textContent=String(viewerCount);
      for(const peers of Object.values(state)){
        for(const peer of peers){
          if(peer.videoId && peer.videoId!==lastVideoId){
            pendingVideoId=peer.videoId;
            $("youtube-url").value="https://www.youtube.com/watch?v="+peer.videoId;
            ensurePlayer(peer.videoId);
            if(peer.action) applyPlayback({videoId:peer.videoId,action:peer.action,time:peer.time||0});
            return;
          }
        }
      }
    });
    channel.subscribe(async status=>{
      if(status==="SUBSCRIBED"){
        $("connection-status").textContent=t("connected");$("connection-status").classList.add("ready");$("connection-status").classList.remove("error");
        await channel.track({name:nameInput.value.trim()||t("guest"),joinedAt:new Date().toISOString(),videoId:pendingVideoId||"",action:"pause",time:0});
      }
    });
  }
  function setRoom(nextRoom, message){
    roomId=nextRoom;
    const url=new URL(location.href);url.searchParams.set("room",roomId);history.replaceState({}, "", url);
    showRoom();setMessage(message);connectRoom();
  }
  $("create-room").addEventListener("click",()=>{
    const id=crypto.randomUUID().replaceAll("-","");
    setRoom(id,t("roomCreated"));
    const idFromUrl=youtubeId($("youtube-url").value);
    if(idFromUrl) setVideo(idFromUrl,true);
  });
  $("join-room").addEventListener("click",()=>{
    const idFromUrl=youtubeId($("youtube-url").value);
    if(!roomId){setMessage(t("noRoom"));return;}
    connectRoom();
    if(idFromUrl)setVideo(idFromUrl,true);
    setMessage(t("joined"));
  });
  function setVideo(id,notify){
    if(!id){setMessage(t("badUrl"));return;}
    pendingVideoId=id;ensurePlayer(id);
    if(notify){
      broadcast({type:"video",videoId:id});
      if(channel) channel.track({name:nameInput.value.trim()||t("guest"),videoId:id,action:"pause",time:0,joinedAt:new Date().toISOString()});
    }
  }
  $("youtube-url").addEventListener("change",()=>{
    const id=youtubeId($("youtube-url").value);
    if(id&&roomId)setVideo(id,true);
  });
  $("youtube-url").addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();const id=youtubeId(e.currentTarget.value);if(id&&roomId)setVideo(id,true);else if(!id)setMessage(t("badUrl"));}});
  function appendMessage(name,message,send){
    if(!message)return;
    const empty=$(".empty-chat");if(empty)empty.remove();
    const item=document.createElement("div");item.className="chat-message";
    const author=document.createElement("strong");author.textContent=name||t("guest");
    const body=document.createElement("span");body.textContent=message;
    item.append(author,body);$("chat-messages").append(item);$("chat-messages").scrollTop=$("chat-messages").scrollHeight;
    if(send)broadcast({type:"chat",name:name||t("guest"),message});
  }
  $("chat-form").addEventListener("submit",event=>{
    event.preventDefault();const input=$("chat-input");const message=input.value.trim();
    if(!message)return;if(!channel){setMessage(t("needBackend"));return;}
    appendMessage(nameInput.value.trim()||t("guest"),message,true);input.value="";
  });
  if(roomId){showRoom();connectRoom();}
  if(!hasBackend){$("create-room").title=t("needBackend");}
})();