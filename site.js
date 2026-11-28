/* SODO — Multilingual system: Arabic, English, Russian */

(() => {
  "use strict";
  // Fix Arabic glyph joining by removing inappropriate tracking on Arabic routes.
  // Keep the site's original Tafkir Arabic font; other language routes are untouched.
  if (document.documentElement.lang === "ar") {
    const arabicSpacingFix = document.createElement("style");
    arabicSpacingFix.textContent = `
      html[lang="ar"] body :is(h1,h2,h3,h4,h5,h6,p,a,button,label,small,strong,em,li,blockquote) {
        letter-spacing: normal !important;
      }
      html[lang="ar"] .logo { letter-spacing: 5px !important; }
      html[lang="ar"] .eyebrow { letter-spacing: 0 !important; }
    `;
    document.head.appendChild(arabicSpacingFix);
  }

    const translations = {
    ar: {
      home: "الرئيسية",
      about: "من نحن",
      thoughts: "أفكار",
      films: "سينما",
      "Watched Films": "أفلام شاهدتها",
      "COLLECTION": "الأرشيف",
      "NEXT TO WATCH": "التالي للمشاهدة",
      "SERIES": "المسلسلات",
      "01 / COLLECTION": "01 / الأرشيف",
      "02 / NEXT TO WATCH": "02 / التالي للمشاهدة",
      "03 / SERIES": "03 / المسلسلات",
      "Watchlist": "قائمة المشاهدة",
      "Series": "مسلسلات",
      "A personal record of films watched and stories discovered.": "سجلّ شخصي للأفلام التي شاهدتها والحكايات التي اكتشفتها.",
      "Films I’ve watched": "أفلام شاهدتها",
      "Films I plan to watch": "أفلام أخطط لمشاهدتها",
      "Series, season by season.": "مسلسلات، موسمًا بعد موسم.",
      "Your watched films will appear here.": "ستظهر هنا الأفلام التي شاهدتها.",
      "Your watchlist is ready for the films you want to see next.": "هذه قائمتك للأفلام التي ترغب بمشاهدتها لاحقًا.",
      "Your series collection will appear here.": "ستظهر هنا مجموعة المسلسلات الخاصة بك.",
      "Watched": "تمت المشاهدة",
      "Planned": "مخطط للمشاهدة",
      "TV Series": "مسلسلات تلفزيونية",
      "Films I have watched": "أفلام شاهدتها",
      "Series I have watched": "مسلسلات شاهدتها",
      "Details to be confirmed": "التفاصيل قيد التأكيد",
      "Title saved to your watched list.": "تم حفظ العنوان في قائمة أفلامك التي شاهدتها.",
      "Back to cinema": "العودة إلى السينما",
      "Cinema / Film notes": "السينما / تفاصيل الفيلم",
      "Film details": "معلومات الفيلم",
      "Story": "القصة",
      "Year": "سنة الإنتاج",
      "IMDb rating": "تقييم IMDb",
      "Original language": "اللغة الأصلية",
      "Work status": "حالة العمل",
      "Written sequel – unconfirmed": "تكملة مكتوبة – غير مؤكدة",
      "No sequel announced": "لا توجد تكملة معلنة",
      "A novel sequel exists": "تكملة روائية موجودة",
      "Complete — final fifth season": "مكتمل – الموسم الخامس والأخير",
      "Complete — 3 seasons": "مكتمل – 3 مواسم",
      "Complete": "مكتمل",
      "Complete — 8 seasons": "مكتمل – 8 مواسم",
      "Complete — 4 seasons": "مكتمل – 4 مواسم",
      "Final season coming in 2027": "الموسم الأخير قادم في 2027",
      "English": "الإنجليزية",
      "Korean": "الكورية",
      "Genre": "التصنيف",
      "Director": "المخرج",
      "Cast": "طاقم التمثيل",
      "Runtime": "مدة الفيلم",
      "Rating": "التقييم",
      "Drama": "دراما",
      "Science fiction · Thriller": "خيال علمي · إثارة",
      "Romance · Drama": "رومانسي · دراما",
      "War · Thriller": "حرب · إثارة",
      "Horror · Sci-Fi · Action": "رعب · خيال علمي · أكشن",
      "Survival · Adventure · Thriller": "نجاة · مغامرة · إثارة",
      "Horror · Sci-Fi · Thriller": "رعب · خيال علمي · إثارة",
      "A mysterious discovery is made on the outskirts of a remote harbor town. The residents find themselves in a desperate fight for survival against something they have never encountered before.": "يُكتشف أمر غامض عند أطراف بلدة ساحلية نائية، فيجد سكانها أنفسهم أمام معركة يائسة للبقاء في مواجهة شيء لم يسبق لهم أن واجهوه.",
      "After a harrowing plane crash, Special Forces veteran James Belmont and his combat dog, Odin, find themselves stranded deep in the Alaskan wilderness. Together, they must fight for survival against the elements.": "بعد تحطم طائرة مروّع، يجد جندي سابق في القوات الخاصة وكلبه القتالي أودين نفسيهما عالقين في براري ألاسكا. وعليهما معاً القتال من أجل النجاة من قسوة الطبيعة.",
      "Vero Airlines Flight 298 travels from New Orleans to Seattle when a series of terrifying, unexplained events turns the journey into a supernatural nightmare.": "تتحول رحلة طائرة فيرو رقم 298 من نيو أورلينز إلى سياتل إلى كابوس خارق للطبيعة، بعدما تقع سلسلة من الأحداث المرعبة التي لا يمكن تفسيرها.",
      "Anja, a theatre director and mother of three, receives a life-threatening diagnosis just before Christmas. As she and her partner Tomas face an uncertain future, their relationship is tested in unexpected ways.": "تتلقى أنيا، وهي مخرجة مسرح وأم لثلاثة أطفال، تشخيصاً يهدد حياتها قبيل عيد الميلاد. وبينما تواجه مع شريكها توماس مستقبلاً مجهولاً، تمر علاقتهما باختبارات غير متوقعة.",
      "After losing his wife and memory in a car accident, a single father undergoes an experimental treatment to recover his past. But the memories he uncovers make him question who he really is.": "بعد أن يفقد زوجته وذاكرته في حادث سيارة، يخضع أب أعزب لعلاج تجريبي لاستعادة ماضيه. لكن الذكريات التي يكتشفها تجعله يتساءل عن هويته الحقيقية.",
      "Louisa Clark takes a job caring for Will Traynor, a wealthy young man whose life changed after an accident. Their growing connection challenges both of them to see life and possibility differently.": "تعمل لويزا كلارك لرعاية ويل تراينر، الشاب الثري الذي تغيرت حياته بعد حادث. ومع تطور علاقتهما، يواجه كلاهما نظرة مختلفة إلى الحياة وإمكاناتها.",
      "During the Battle of the Bulge, a wounded American soldier becomes trapped behind German lines. With only his radio and survival skills, he must evade enemy forces and find a way back to his unit.": "خلال معركة الثغرة، يجد جندي أمريكي مصاب نفسه عالقاً خلف خطوط الألمان. وبالاعتماد على جهاز اللاسلكي ومهارات النجاة، يحاول الإفلات من قوات العدو والعودة إلى وحدته.",
      "When Anja receives a life-threatening diagnosis just before Christmas, she and her partner Tomas are forced to confront the distance that has grown between them and rediscover love, trust, and family.": "عندما تتلقى أنيا تشخيصاً طبياً يهدد حياتها قبيل عيد الميلاد، تجد نفسها وشريكها توماس أمام اختبار قاسٍ يجبرهما على مواجهة المسافة التي اتسعت بينهما، وإعادة اكتشاف الحب والثقة والعائلة.",
      "After a car accident leaves him without his memories, a widowed father undergoes an experimental treatment to recover his past—only to discover memories that make him question his own identity.": "بعد حادث سيارة يفقده ذاكرته، يخضع أب أرمل لعلاج تجريبي لاستعادة ماضيه، لكنه يكتشف ذكريات تدفعه إلى التشكيك في هويته وحقيقة ما يتذكره.",
      "Louisa Clark becomes the companion of Will Traynor, a wealthy man whose life changed after an accident. As their bond deepens, both are challenged to reconsider what gives life meaning.": "تعمل لويزا كلارك مرافقةً لويل تراينر، رجل ثري تغيرت حياته إثر حادث. ومع تعمق العلاقة بينهما، يواجه الاثنان أسئلة جديدة حول معنى الحياة وما يجعلها جديرة بأن تُعاش.",
      "During the Battle of the Bulge, a wounded American soldier is trapped behind German lines. With only his radio and survival skills, he must evade enemy forces and find a way back to his unit.": "خلال معركة الثغرة في الحرب العالمية الثانية، يجد جندي أمريكي مصاب نفسه عالقاً خلف خطوط الألمان. وبالاعتماد على جهاز اللاسلكي ومهاراته في النجاة، يحاول الإفلات من قوات العدو والعودة إلى وحدته.",
      "We could not reliably identify a film with this exact title. The title is kept in your watched list without inventing a year, rating, synopsis, or poster.": "لم نتمكن من التحقق من فيلم يحمل هذا العنوان بدقة. أبقينا الاسم في قائمة أفلامك من دون اختلاق سنة إنتاج أو تقييم أو نبذة أو بوستر.",
      "Cinema / Series notes": "السينما / تفاصيل المسلسل",
      "Series details": "معلومات المسلسل",
      "Creator": "صُنّاع العمل",
      "Seasons": "عدد المواسم",
      "Episodes": "عدد الحلقات",
      "Network": "المنصة / القناة",
      "Action · Drama · Superhero · Satire": "أكشن · دراما · أبطال خارقون · سخرية",
      "Action · Crime · Drama · Superhero": "أكشن · جريمة · دراما · أبطال خارقون",
      "Crime · Drama · Thriller": "جريمة · دراما · إثارة",
      "Action · Adventure · Drama · Fantasy": "أكشن · مغامرة · دراما · فانتازيا",
      "Drama · Mystery · Teen drama": "دراما · غموض · دراما مراهقين",
      "A group of vigilantes sets out to expose and take down corrupt superheroes who abuse their powers, challenging the powerful corporation that protects them.": "تسعى مجموعة من الحراس إلى كشف الأبطال الخارقين الفاسدين الذين يستغلون قواهم وإسقاطهم، متحدّين الشركة النافذة التي تحميهم.",
      "Blind lawyer Matt Murdock uses his heightened senses to fight crime in New York by night, balancing his work in the courtroom with his life as the masked vigilante Daredevil.": "يستخدم المحامي الكفيف مات موردوك حواسه الحادة لمحاربة الجريمة في نيويورك ليلاً، محاولاً الموازنة بين عمله في المحكمة وحياته السرية بصفته الحارس المقنّع ديرديفل.",
      "After being diagnosed with terminal cancer, chemistry teacher Walter White turns to manufacturing methamphetamine with a former student, setting off a dangerous transformation that threatens his family and everything around him.": "بعد تشخيص إصابته بسرطان في مراحله النهائية، يلجأ مدرس الكيمياء والتر وايت إلى تصنيع الميثامفيتامين بالتعاون مع طالب سابق، لتبدأ رحلة تحول خطيرة تهدد عائلته وكل ما يحيط به.",
      "Several noble families struggle for control of the Iron Throne and the Seven Kingdoms of Westeros, while an ancient danger gathers beyond the Wall.": "تتصارع عائلات نبيلة عديدة للسيطرة على العرش الحديدي والممالك السبع في ويستروس، بينما يتجمع خطر قديم خلف الجدار.",
      "After the death of classmate Hannah Baker, Clay Jensen receives a set of recordings in which she explains the events and people connected to her decision. The story follows the students as they confront grief, secrets, and the consequences of their actions.": "بعد وفاة زميلته هانا بيكر، يتلقى كلاي جنسن مجموعة تسجيلات تشرح فيها الأحداث والأشخاص المرتبطين بقرارها. ويتابع العمل الطلاب وهم يواجهون الحزن والأسرار وعواقب أفعالهم.",
      "Matt Murdock and Wilson Fisk find themselves on a collision course as their past identities resurface. As Fisk rises to power in New York, Daredevil fights back to protect the city and the people he loves.": "يجد مات موردوك وويلسون فيسك نفسيهما في مواجهة حتمية مع عودة هوياتهما السابقة إلى الواجهة. وبينما يصعد فيسك إلى السلطة في نيويورك، يقاوم ديرديفل لحماية المدينة والأشخاص الذين يحبهم.",
      projects: "مشاريع",
      eyebrow: "مساحة شخصية",
      heroText: "مساحة للأفكار والثقافة والسينما والاستكشاف الإبداعي. مكان ما بين ما نفكر فيه وما نصنعه.",
      discover: "اكتشف SODO ↗",
      space: "مساحة للاستكشاف.",
      aboutIntro: "SODO مساحة شخصية مخصصة للأفكار والثقافة والسينما والعمل الإبداعي. مكان لجمع الأفكار واستكشاف وجهات النظر ومشاركة الأشياء ذات المعنى.",
      different: "وجهات نظر مختلفة.",
      notes: "ملاحظات وتأملات وأفكار تستحق المشاركة.",
      cinema: "قصص وتجارب سينمائية وبصرية.",
      work: "تجارب إبداعية وأعمال قيد التطوير.",
      footer: "جميع الحقوق محفوظة",
      "Think.": "فكّر.",
      "Feel.": "اشعر.",
      "Create.": "اصنع.",
      "Think. Feel. Create.": "فكّر. اشعر. اصنع.",
      "Social media": "وسائل التواصل الاجتماعي",
      "Toggle theme": "تبديل المظهر",
      "Home": "الرئيسية",
      "About": "من نحن",
      "Thoughts": "أفكار",
      "Films": "سينما",
      "Projects": "مشاريع",
      "A space for ideas": "مساحة للأفكار",
      "Stories on screen": "حكايات على الشاشة",
      "Ideas into reality": "تحويل الأفكار إلى واقع",
      "ABOUT SODO / 01": "عن SODO / 01",
      "More than": "أكثر من",
      "a website.": "مجرد موقع.",
      "Thoughts.": "أفكار.",
      "Films.": "سينما.",
      "Projects.": "مشاريع.",
      "Every idea starts somewhere.": "كل فكرة تبدأ من مكان ما.",
      "Look a little closer.": "انظر عن قرب قليلًا.",
      "Make room for imagination.": "اترك مساحة للخيال.",
      "Beyond the Frame": "ما وراء الإطار",
      "Visual Poetry": "شعرية الصورة",
      "The Art of Cinema": "فن السينما",
      "SODO Website": "موقع SODO",
      "Visual Experiments": "تجارب بصرية",
      "More Ideas": "المزيد من الأفكار",
      "Coming Soon": "قريبًا",
      "A Personal Space": "مساحة شخصية",
      "Discover SODO": "اكتشف SODO",
      "Language": "اللغة",
      "Choose language": "اختر اللغة",
      "Light mode": "الوضع النهاري",
      "Dark mode": "الوضع الليلي",
      "A space for exploration.": "مساحة للاستكشاف.",
      "Different perspectives.": "وجهات نظر مختلفة.",
      "Notes, reflections and ideas worth sharing.": "ملاحظات وتأملات وأفكار تستحق المشاركة.",
      "Stories, cinema and visual experiences.": "قصص وتجارب سينمائية وبصرية.",
      "Creative experiments and things in progress.": "تجارب إبداعية وأعمال قيد التطوير.",
      "SODO is a personal space for ideas, culture, cinema and creative exploration. A place where curiosity meets expression.": "SODO مساحة شخصية للأفكار والثقافة والسينما والاستكشاف الإبداعي. مكان يلتقي فيه الفضول بالتعبير.",
      "The idea behind SODO.": "الفكرة وراء SODO.",
      "This space is built around the things that make us think, feel and see the world differently.": "تتمحور هذه المساحة حول الأشياء التي تجعلنا نفكر ونشعر ونرى العالم بصورة مختلفة.",
      "From personal reflections to films, projects and creative discoveries, SODO brings different interests together in one place.": "من التأملات الشخصية إلى الأفلام والمشاريع والاكتشافات الإبداعية، يجمع SODO اهتمامات مختلفة في مكان واحد.",
      "It is a work in progress — always evolving, always exploring.": "إنه عمل مستمر في التطور، دائم الاستكشاف.",
      "A collection of ideas, reflections, and little things worth thinking about. Some thoughts deserve a place to stay.": "مجموعة من الأفكار والتأملات والتفاصيل الصغيرة التي تستحق التفكير. بعض الأفكار تستحق مكانًا تبقى فيه.",
      "Sometimes, all it takes is a simple thought to open the door to something new.": "أحيانًا، كل ما نحتاجه هو فكرة بسيطة تفتح الباب لشيء جديد.",
      "The smallest details can sometimes tell the biggest stories.": "أصغر التفاصيل قد تحمل أحيانًا أكبر الحكايات.",
      "Not everything needs a reason. Some things are worth creating simply because they feel right.": "ليس كل شيء بحاجة إلى سبب. بعض الأشياء تستحق أن نصنعها لأنها ببساطة تشبهنا.",
      "Cinema is more than moving images. It is emotion, perspective, storytelling, and worlds waiting to be discovered.": "السينما أكثر من مجرد صور متحركة. إنها مشاعر ووجهات نظر وحكايات وعوالم تنتظر الاكتشاف.",
      "Stories that stay with us.": "حكايات تبقى معنا.",
      "When images speak louder than words.": "حين تتحدث الصور بصوت أعلى من الكلمات.",
      "A journey through light, sound, and feeling.": "رحلة عبر الضوء والصوت والشعور.",
      "A space for experiments, creative ideas, and things built with curiosity and passion. Every project begins with an idea.": "مساحة للتجارب والأفكار الإبداعية والأشياء التي تُبنى بدافع الفضول والشغف. كل مشروع يبدأ بفكرة.",
      "A personal digital space for thoughts, cinema, creativity, and expression.": "مساحة رقمية شخصية للأفكار والسينما والإبداع والتعبير.",
      "Exploring visual identity, design, colors, and creative possibilities.": "استكشاف الهوية البصرية والتصميم والألوان والإمكانات الإبداعية.",
      "New experiments and projects will find their place here over time.": "ستجد التجارب والمشاريع الجديدة مكانها هنا مع مرور الوقت.",
      "All rights reserved": "جميع الحقوق محفوظة",
      "A BEGINNING": "بداية",
      "PERSPECTIVE": "وجهة نظر",
      "CREATIVITY": "إبداع",
      "DIGITAL SPACE": "مساحة رقمية",
      "CREATIVE EXPLORATION": "استكشاف إبداعي",
      "01 / ABOUT": "01 / من نحن",
      "02 / EXPLORE": "02 / استكشف",
      "01 — IDEAS": "01 — أفكار",
      "02 — CINEMA": "02 — سينما",
      "03 — WORK": "03 — مشاريع",
      "01 — A BEGINNING": "01 — بداية",
      "02 — PERSPECTIVE": "02 — وجهة نظر",
      "03 — CREATIVITY": "03 — إبداع",
      "01 — DIGITAL SPACE": "01 — مساحة رقمية",
      "02 — CREATIVE EXPLORATION": "02 — استكشاف إبداعي",
      "03 — COMING SOON": "03 — قريبًا",
      "Switch to light mode": "تفعيل الوضع النهاري",
      "Switch to dark mode": "تفعيل الوضع الليلي"
    },

    en: {
      home: "Home",
      about: "About",
      thoughts: "Thoughts",
      films: "Films",
      "Watched Films": "Watched Films",
      "COLLECTION": "COLLECTION",
      "NEXT TO WATCH": "NEXT TO WATCH",
      "SERIES": "SERIES",
      "01 / COLLECTION": "01 / COLLECTION",
      "02 / NEXT TO WATCH": "02 / NEXT TO WATCH",
      "03 / SERIES": "03 / SERIES",
      "Watchlist": "Watchlist",
      "Series": "Series",
      "A personal record of films watched and stories discovered.": "A personal record of films watched and stories discovered.",
      "Films I’ve watched": "Films I’ve watched",
      "Films I plan to watch": "Films I plan to watch",
      "Series, season by season.": "Series, season by season.",
      "Your watched films will appear here.": "Your watched films will appear here.",
      "Your watchlist is ready for the films you want to see next.": "Your watchlist is ready for the films you want to see next.",
      "Your series collection will appear here.": "Your series collection will appear here.",
      "Watched": "Watched",
      "Planned": "Planned",
      "TV Series": "TV Series",
      "Films I have watched": "Films I have watched",
      "Series I have watched": "Series I have watched",
      "Details to be confirmed": "Details to be confirmed",
      "Title saved to your watched list.": "Title saved to your watched list.",
      "Back to cinema": "Back to cinema",
      "Cinema / Film notes": "Cinema / Film notes",
      "Film details": "Film details",
      "Story": "Story",
      "Year": "Year",
      "IMDb rating": "IMDb rating",
      "Original language": "Original language",
      "Work status": "Work status",
      "Written sequel – unconfirmed": "Written sequel – unconfirmed",
      "No sequel announced": "No sequel announced",
      "A novel sequel exists": "A novel sequel exists",
      "Complete — final fifth season": "Complete — final fifth season",
      "Complete — 3 seasons": "Complete — 3 seasons",
      "Complete": "Complete",
      "Complete — 8 seasons": "Complete — 8 seasons",
      "Complete — 4 seasons": "Complete — 4 seasons",
      "Final season coming in 2027": "Final season coming in 2027",
      "English": "English",
      "Korean": "Korean",
      "Genre": "Genre",
      "Director": "Director",
      "Cast": "Cast",
      "Runtime": "Runtime",
      "Rating": "Rating",
      "Drama": "Drama",
      "Science fiction · Thriller": "Science fiction · Thriller",
      "Romance · Drama": "Romance · Drama",
      "War · Thriller": "War · Thriller",
      "Anja, a theatre director and mother of three, receives a life-threatening diagnosis just before Christmas. As she and her partner Tomas face an uncertain future, their relationship is tested in unexpected ways.": "Anja, a theatre director and mother of three, receives a life-threatening diagnosis just before Christmas. As she and her partner Tomas face an uncertain future, their relationship is tested in unexpected ways.",
      "After losing his wife and memory in a car accident, a single father undergoes an experimental treatment to recover his past. But the memories he uncovers make him question who he really is.": "After losing his wife and memory in a car accident, a single father undergoes an experimental treatment to recover his past. But the memories he uncovers make him question who he really is.",
      "Louisa Clark takes a job caring for Will Traynor, a wealthy young man whose life changed after an accident. Their growing connection challenges both of them to see life and possibility differently.": "Louisa Clark takes a job caring for Will Traynor, a wealthy young man whose life changed after an accident. Their growing connection challenges both of them to see life and possibility differently.",
      "During the Battle of the Bulge, a wounded American soldier becomes trapped behind German lines. With only his radio and survival skills, he must evade enemy forces and find a way back to his unit.": "During the Battle of the Bulge, a wounded American soldier becomes trapped behind German lines. With only his radio and survival skills, he must evade enemy forces and find a way back to his unit.",
      "When Anja receives a life-threatening diagnosis just before Christmas, she and her partner Tomas are forced to confront the distance that has grown between them and rediscover love, trust, and family.": "When Anja receives a life-threatening diagnosis just before Christmas, she and her partner Tomas are forced to confront the distance that has grown between them and rediscover love, trust, and family.",
      "After a car accident leaves him without his memories, a widowed father undergoes an experimental treatment to recover his past—only to discover memories that make him question his own identity.": "After a car accident leaves him without his memories, a widowed father undergoes an experimental treatment to recover his past—only to discover memories that make him question his own identity.",
      "Louisa Clark becomes the companion of Will Traynor, a wealthy man whose life changed after an accident. As their bond deepens, both are challenged to reconsider what gives life meaning.": "Louisa Clark becomes the companion of Will Traynor, a wealthy man whose life changed after an accident. As their bond deepens, both are challenged to reconsider what gives life meaning.",
      "During the Battle of the Bulge, a wounded American soldier is trapped behind German lines. With only his radio and survival skills, he must evade enemy forces and find a way back to his unit.": "During the Battle of the Bulge, a wounded American soldier is trapped behind German lines. With only his radio and survival skills, he must evade enemy forces and find a way back to his unit.",
      "We could not reliably identify a film with this exact title. The title is kept in your watched list without inventing a year, rating, synopsis, or poster.": "We could not reliably identify a film with this exact title. The title is kept in your watched list without inventing a year, rating, synopsis, or poster.",
      projects: "Projects",
      eyebrow: "A Personal Space",
      heroText: "A space for ideas, culture, cinema, and creative exploration. Somewhere between what we think and what we create.",
      discover: "Discover SODO ↗",
      space: "A space to explore.",
      aboutIntro: "SODO is a personal space dedicated to ideas, culture, cinema, and creative work. A place to collect ideas, explore perspectives, and share meaningful things.",
      different: "Different perspectives.",
      notes: "Notes, reflections and ideas worth sharing.",
      cinema: "Stories, cinema and visual experiences.",
      work: "Creative experiments and things in progress.",
      footer: "All rights reserved",
      "فكّر.": "Think.",
      "اشعر.": "Feel.",
      "اصنع.": "Create.",
      "فكّر. اشعر. اصنع.": "Think. Feel. Create.",
      "وسائل التواصل الاجتماعي": "Social media",
      "تبديل المظهر": "Toggle theme",
      "الرئيسية": "Home",
      "من نحن": "About",
      "عن الموقع": "About",
      "أفكار": "Thoughts",
      "سينما": "Films",
      "مشاريع": "Projects",
      "مساحة شخصية": "A Personal Space",
      "اكتشف SODO": "Discover SODO",
      "اللغة": "Language",
      "اختر اللغة": "Choose language",
      "الوضع النهاري": "Light mode",
      "الوضع الليلي": "Dark mode",
      "تفعيل الوضع النهاري": "Switch to light mode",
      "تفعيل الوضع الليلي": "Switch to dark mode",
      "مساحة للاستكشاف.": "A space for exploration.",
      "وجهات نظر مختلفة.": "Different perspectives.",
      "ملاحظات وتأملات وأفكار تستحق المشاركة.": "Notes, reflections and ideas worth sharing.",
      "قصص وتجارب سينمائية وبصرية.": "Stories, cinema and visual experiences.",
      "تجارب إبداعية وأعمال قيد التطوير.": "Creative experiments and things in progress.",
      "أكثر من": "More than",
      "مجرد موقع.": "a website.",
      "الفكرة وراء SODO.": "The idea behind SODO.",
      "كل فكرة تبدأ من مكان ما.": "Every idea starts somewhere.",
      "انظر عن قرب قليلًا.": "Look a little closer.",
      "اترك مساحة للخيال.": "Make room for imagination.",
      "ما وراء الإطار": "Beyond the Frame",
      "شعرية الصورة": "Visual Poetry",
      "فن السينما": "The Art of Cinema",
      "موقع SODO": "SODO Website",
      "تجارب بصرية": "Visual Experiments",
      "المزيد من الأفكار": "More Ideas",
      "قريبًا": "Coming Soon",
      "جميع الحقوق محفوظة": "All rights reserved"
    },

    ru: {
      home: "Главная",
      about: "О проекте",
      thoughts: "Мысли",
      films: "Кино",
      "Watched Films": "Просмотренные фильмы",
      "COLLECTION": "КОЛЛЕКЦИЯ",
      "NEXT TO WATCH": "К ПРОСМОТРУ",
      "SERIES": "СЕРИАЛЫ",
      "01 / COLLECTION": "01 / КОЛЛЕКЦИЯ",
      "02 / NEXT TO WATCH": "02 / К ПРОСМОТРУ",
      "03 / SERIES": "03 / СЕРИАЛЫ",
      "Watchlist": "Список просмотра",
      "Series": "Сериалы",
      "A personal record of films watched and stories discovered.": "Личный архив просмотренных фильмов и открытых историй.",
      "Films I’ve watched": "Фильмы, которые я посмотрел",
      "Films I plan to watch": "Фильмы, которые планирую посмотреть",
      "Series, season by season.": "Сериалы, сезон за сезоном.",
      "Your watched films will appear here.": "Здесь появятся просмотренные вами фильмы.",
      "Your watchlist is ready for the films you want to see next.": "Здесь будет список фильмов, которые вы хотите посмотреть.",
      "Your series collection will appear here.": "Здесь появится ваша коллекция сериалов.",
      "Watched": "Просмотрено",
      "Planned": "В планах",
      "TV Series": "Телесериалы",
      "Films I have watched": "Просмотренные фильмы",
      "Series I have watched": "Просмотренные сериалы",
      "Details to be confirmed": "Данные уточняются",
      "Title saved to your watched list.": "Название сохранено в списке просмотренных фильмов.",
      "Back to cinema": "Вернуться в раздел кино",
      "Cinema / Film notes": "Кино / информация о фильме",
      "Film details": "Информация о фильме",
      "Story": "Сюжет",
      "Year": "Год",
      "IMDb rating": "Рейтинг IMDb",
      "Original language": "Язык оригинала",
      "Work status": "Статус",
      "Written sequel – unconfirmed": "Продолжение в книге — не подтверждено",
      "No sequel announced": "Продолжение не объявлено",
      "A novel sequel exists": "Есть продолжение в романе",
      "Complete — final fifth season": "Завершён — пятый и последний сезон",
      "Complete — 3 seasons": "Завершён — 3 сезона",
      "Complete": "Завершён",
      "Complete — 8 seasons": "Завершён — 8 сезонов",
      "Complete — 4 seasons": "Завершён — 4 сезона",
      "Final season coming in 2027": "Последний сезон выйдет в 2027 году",
      "English": "Английский",
      "Korean": "Корейский",
      "Genre": "Жанр",
      "Director": "Режиссёр",
      "Cast": "В ролях",
      "Runtime": "Продолжительность",
      "Rating": "Оценка",
      "Drama": "Драма",
      "Science fiction · Thriller": "Фантастика · Триллер",
      "Romance · Drama": "Мелодрама · Драма",
      "War · Thriller": "Военный · Триллер",
      "Horror · Sci-Fi · Action": "Ужасы · Фантастика · Боевик",
      "Survival · Adventure · Thriller": "Выживание · Приключения · Триллер",
      "Horror · Sci-Fi · Thriller": "Ужасы · Фантастика · Триллер",
      "A mysterious discovery is made on the outskirts of a remote harbor town. The residents find themselves in a desperate fight for survival against something they have never encountered before.": "На окраине отдалённого портового городка обнаруживают нечто загадочное. Жители оказываются втянуты в отчаянную борьбу за выживание против того, с чем никогда прежде не сталкивались.",
      "After a harrowing plane crash, Special Forces veteran James Belmont and his combat dog, Odin, find themselves stranded deep in the Alaskan wilderness. Together, they must fight for survival against the elements.": "После страшной авиакатастрофы бывший боец спецназа и его служебная собака Один оказываются в глуши Аляски. Вместе им предстоит бороться за жизнь и противостоять суровой природе.",
      "Vero Airlines Flight 298 travels from New Orleans to Seattle when a series of terrifying, unexplained events turns the journey into a supernatural nightmare.": "Рейс авиакомпании Vero Airlines 298 из Нового Орлеана в Сиэтл превращается в сверхъестественный кошмар после серии пугающих и необъяснимых событий.",
      "Anja, a theatre director and mother of three, receives a life-threatening diagnosis just before Christmas. As she and her partner Tomas face an uncertain future, their relationship is tested in unexpected ways.": "Анья, театральный режиссёр и мать троих детей, незадолго до Рождества получает опасный для жизни диагноз. Столкнувшись с неопределённым будущим, она и её партнёр Томас проходят через неожиданные испытания отношений.",
      "After losing his wife and memory in a car accident, a single father undergoes an experimental treatment to recover his past. But the memories he uncovers make him question who he really is.": "Потеряв жену и память в автокатастрофе, отец-одиночка проходит экспериментальное лечение, чтобы восстановить прошлое. Но найденные воспоминания заставляют его усомниться в собственной личности.",
      "Louisa Clark takes a job caring for Will Traynor, a wealthy young man whose life changed after an accident. Their growing connection challenges both of them to see life and possibility differently.": "Луиза Кларк устраивается ухаживать за Уиллом Трейнором — богатым молодым человеком, чья жизнь изменилась после аварии. Их сближение заставляет обоих по-новому взглянуть на жизнь и её возможности.",
      "During the Battle of the Bulge, a wounded American soldier becomes trapped behind German lines. With only his radio and survival skills, he must evade enemy forces and find a way back to his unit.": "Во время Арденнской операции раненый американский солдат оказывается в тылу немецких войск. Используя радиостанцию и навыки выживания, он пытается избежать врага и вернуться в своё подразделение.",
      "When Anja receives a life-threatening diagnosis just before Christmas, she and her partner Tomas are forced to confront the distance that has grown between them and rediscover love, trust, and family.": "Получив перед Рождеством диагноз, угрожающий её жизни, Анья вместе со своим партнёром Томасом вынуждена столкнуться с отчуждением, возникшим между ними, и заново открыть для себя любовь, доверие и семейные ценности.",
      "After a car accident leaves him without his memories, a widowed father undergoes an experimental treatment to recover his past—only to discover memories that make him question his own identity.": "После автокатастрофы овдовевший отец теряет память и проходит экспериментальное лечение, чтобы восстановить прошлое. Однако найденные воспоминания заставляют его усомниться в собственной личности.",
      "Louisa Clark becomes the companion of Will Traynor, a wealthy man whose life changed after an accident. As their bond deepens, both are challenged to reconsider what gives life meaning.": "Луиза Кларк становится компаньонкой Уилла Трейнора — богатого мужчины, чья жизнь изменилась после аварии. По мере сближения им обоим приходится переосмыслить смысл жизни.",
      "During the Battle of the Bulge, a wounded American soldier is trapped behind German lines. With only his radio and survival skills, he must evade enemy forces and find a way back to his unit.": "Во время Арденнской операции раненый американский солдат оказывается в тылу немецких войск. Используя лишь радиостанцию и навыки выживания, он пытается избежать плена и вернуться к своему подразделению.",
      "We could not reliably identify a film with this exact title. The title is kept in your watched list without inventing a year, rating, synopsis, or poster.": "Не удалось достоверно определить фильм с таким точным названием. Название сохранено в списке просмотренного без выдуманных года, рейтинга, описания или постера.",
      "Cinema / Series notes": "Кино / информация о сериале",
      "Series details": "Информация о сериале",
      "Creator": "Создатель",
      "Seasons": "Сезоны",
      "Episodes": "Эпизоды",
      "Network": "Платформа / канал",
      "Action · Drama · Superhero · Satire": "Боевик · Драма · Супергерои · Сатира",
      "Action · Crime · Drama · Superhero": "Боевик · Криминал · Драма · Супергерои",
      "Crime · Drama · Thriller": "Криминал · Драма · Триллер",
      "Action · Adventure · Drama · Fantasy": "Боевик · Приключения · Драма · Фэнтези",
      "Drama · Mystery · Teen drama": "Драма · Детектив · Подростковая драма",
      "A group of vigilantes sets out to expose and take down corrupt superheroes who abuse their powers, challenging the powerful corporation that protects them.": "Группа борцов с преступностью пытается разоблачить коррумпированных супергероев, злоупотребляющих своими силами, и бросает вызов могущественной корпорации, которая их защищает.",
      "Blind lawyer Matt Murdock uses his heightened senses to fight crime in New York by night, balancing his work in the courtroom with his life as the masked vigilante Daredevil.": "Слепой адвокат Мэтт Мёрдок использует обострённые чувства, чтобы по ночам бороться с преступностью в Нью-Йорке, совмещая работу в суде с жизнью линчевателя в маске Сорвиголовы.",
      "After being diagnosed with terminal cancer, chemistry teacher Walter White turns to manufacturing methamphetamine with a former student, setting off a dangerous transformation that threatens his family and everything around him.": "Узнав о смертельном диагнозе, учитель химии Уолтер Уайт начинает производить метамфетамин вместе с бывшим учеником. Это запускает опасное превращение, которое угрожает его семье и всему вокруг.",
      "Several noble families struggle for control of the Iron Throne and the Seven Kingdoms of Westeros, while an ancient danger gathers beyond the Wall.": "Несколько знатных семей борются за Железный трон и власть над Семью королевствами Вестероса, пока за Стеной пробуждается древняя угроза.",
      "After the death of classmate Hannah Baker, Clay Jensen receives a set of recordings in which she explains the events and people connected to her decision. The story follows the students as they confront grief, secrets, and the consequences of their actions.": "После смерти одноклассницы Ханны Бейкер Клэй Дженсен получает записи, в которых она рассказывает о событиях и людях, связанных с её решением. Ученикам предстоит столкнуться с горем, тайнами и последствиями собственных поступков.",
      "Matt Murdock and Wilson Fisk find themselves on a collision course as their past identities resurface. As Fisk rises to power in New York, Daredevil fights back to protect the city and the people he loves.": "Мэтт Мёрдок и Уилсон Фиск оказываются на пути неизбежного столкновения, когда возвращается их прошлое. Пока Фиск укрепляет власть в Нью-Йорке, Сорвиголова борется за защиту города и близких ему людей.",
      projects: "Проекты",
      eyebrow: "Личное пространство",
      heroText: "Пространство для идей, культуры, кино и творчества. Место между тем, что мы думаем, и тем, что создаём.",
      discover: "Открыть SODO ↗",
      space: "Пространство для открытий.",
      aboutIntro: "SODO — личное пространство, посвящённое идеям, культуре, кино и творчеству. Место, где можно собирать идеи, изучать разные взгляды и делиться тем, что имеет значение.",
      different: "Разные взгляды.",
      notes: "Заметки, размышления и идеи, которыми стоит делиться.",
      cinema: "Истории, кино и визуальные впечатления.",
      work: "Творческие эксперименты и проекты в процессе.",
      footer: "Все права защищены",
      "Think.": "Думай.",
      "Feel.": "Чувствуй.",
      "Create.": "Создавай.",
      "Think. Feel. Create.": "Думай. Чувствуй. Создавай.",
      "Social media": "Социальные сети",
      "Toggle theme": "Сменить тему",
      "Home": "Главная",
      "About": "О проекте",
      "Thoughts": "Мысли",
      "Films": "Кино",
      "Projects": "Проекты",
      "A space for ideas": "Пространство для идей",
      "Stories on screen": "Истории на экране",
      "Ideas into reality": "От идей к реальности",
      "ABOUT SODO / 01": "О SODO / 01",
      "More than": "Больше, чем",
      "a website.": "просто сайт.",
      "Thoughts.": "Мысли.",
      "Films.": "Кино.",
      "Projects.": "Проекты.",
      "Every idea starts somewhere.": "Каждая идея откуда-то начинается.",
      "Look a little closer.": "Присмотритесь внимательнее.",
      "Make room for imagination.": "Оставьте место воображению.",
      "Beyond the Frame": "За пределами кадра",
      "Visual Poetry": "Визуальная поэзия",
      "The Art of Cinema": "Искусство кино",
      "SODO Website": "Сайт SODO",
      "Visual Experiments": "Визуальные эксперименты",
      "More Ideas": "Больше идей",
      "Coming Soon": "Скоро",
      "A Personal Space": "Личное пространство",
      "Discover SODO": "Открыть SODO",
      "Language": "Язык",
      "Choose language": "Выбрать язык",
      "Light mode": "Светлая тема",
      "Dark mode": "Тёмная тема",
      "Switch to light mode": "Включить светлую тему",
      "Switch to dark mode": "Включить тёмную тему",
      "A space for exploration.": "Пространство для открытий.",
      "Different perspectives.": "Разные взгляды.",
      "Notes, reflections and ideas worth sharing.": "Заметки, размышления и идеи, которыми стоит делиться.",
      "Stories, cinema and visual experiences.": "Истории, кино и визуальные впечатления.",
      "Creative experiments and things in progress.": "Творческие эксперименты и проекты в процессе.",
      "SODO is a personal space for ideas, culture, cinema and creative exploration. A place where curiosity meets expression.": "SODO — личное пространство для идей, культуры, кино и творческого поиска. Место, где любопытство встречается с самовыражением.",
      "The idea behind SODO.": "Идея SODO.",
      "This space is built around the things that make us think, feel and see the world differently.": "Это пространство посвящено тому, что помогает нам думать, чувствовать и по-другому смотреть на мир.",
      "From personal reflections to films, projects and creative discoveries, SODO brings different interests together in one place.": "От личных размышлений до фильмов, проектов и творческих открытий — SODO объединяет разные интересы в одном месте.",
      "It is a work in progress — always evolving, always exploring.": "Это проект, который постоянно развивается и продолжает исследовать новое.",
      "A collection of ideas, reflections, and little things worth thinking about. Some thoughts deserve a place to stay.": "Коллекция идей, размышлений и маленьких вещей, над которыми стоит задуматься. Некоторые мысли заслуживают своего места.",
      "Sometimes, all it takes is a simple thought to open the door to something new.": "Иногда достаточно простой мысли, чтобы открыть дверь чему-то новому.",
      "The smallest details can sometimes tell the biggest stories.": "Самые маленькие детали порой рассказывают самые большие истории.",
      "Not everything needs a reason. Some things are worth creating simply because they feel right.": "Не всему нужна причина. Некоторые вещи стоит создавать просто потому, что они близки нам.",
      "Cinema is more than moving images. It is emotion, perspective, storytelling, and worlds waiting to be discovered.": "Кино — это больше, чем движущиеся изображения. Это эмоции, взгляды, истории и миры, ожидающие открытия.",
      "Stories that stay with us.": "Истории, которые остаются с нами.",
      "When images speak louder than words.": "Когда изображения говорят громче слов.",
      "A journey through light, sound, and feeling.": "Путешествие через свет, звук и чувства.",
      "A space for experiments, creative ideas, and things built with curiosity and passion. Every project begins with an idea.": "Пространство для экспериментов, творческих идей и проектов, созданных из любопытства и увлечённости. Каждый проект начинается с идеи.",
      "A personal digital space for thoughts, cinema, creativity, and expression.": "Личное цифровое пространство для мыслей, кино, творчества и самовыражения.",
      "Exploring visual identity, design, colors, and creative possibilities.": "Исследование визуального стиля, дизайна, цветов и творческих возможностей.",
      "New experiments and projects will find their place here over time.": "Со временем здесь появятся новые эксперименты и проекты.",
      "All rights reserved": "Все права защищены",
      "A BEGINNING": "НАЧАЛО",
      "PERSPECTIVE": "ВЗГЛЯД",
      "CREATIVITY": "ТВОРЧЕСТВО",
      "DIGITAL SPACE": "ЦИФРОВОЕ ПРОСТРАНСТВО",
      "CREATIVE EXPLORATION": "ТВОРЧЕСКИЙ ПОИСК",
      "01 / ABOUT": "01 / О ПРОЕКТЕ",
      "02 / EXPLORE": "02 / ИССЛЕДОВАТЬ",
      "01 — IDEAS": "01 — ИДЕИ",
      "02 — CINEMA": "02 — КИНО",
      "03 — WORK": "03 — ПРОЕКТЫ",
      "01 — A BEGINNING": "01 — НАЧАЛО",
      "02 — PERSPECTIVE": "02 — ВЗГЛЯД",
      "03 — CREATIVITY": "03 — ТВОРЧЕСТВО",
      "01 — DIGITAL SPACE": "01 — ЦИФРОВОЕ ПРОСТРАНСТВО",
      "02 — CREATIVE EXPLORATION": "02 — ТВОРЧЕСКИЙ ПОИСК",
      "03 — COMING SOON": "03 — СКОРО",
      "Switch to light mode": "Включить светлую тему",
      "Switch to dark mode": "Включить тёмную тему"
    }
  };

  const icons = {
    sun: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"></path></svg>',
    moon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 15.5A8.5 8.5 0 0 1 8.5 3.5 8.5 8.5 0 1 0 20.5 15.5Z"></path></svg>',
    globe: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"></path></svg>'
  };

  const flagIcons = {
    ar: '<svg class="flag-icon" viewBox="0 0 24 24" aria-hidden="true"><defs><clipPath id="flag-iraq-clip"><circle cx="12" cy="12" r="10.5"/></clipPath></defs><g clip-path="url(#flag-iraq-clip)"><path fill="#ce1126" d="M0 0h24v8H0z"/><path fill="#fff" d="M0 8h24v8H0z"/><path fill="#000" d="M0 16h24v8H0z"/><path fill="#078930" d="M8 11.1h8v.75H8zm1 1.3h6v.65H9z"/></g><circle cx="12" cy="12" r="10.5" fill="none" stroke="currentColor" stroke-opacity=".2"/></svg>',
    en: '<svg class="flag-icon" viewBox="0 0 24 24" aria-hidden="true"><defs><clipPath id="flag-usa-clip"><circle cx="12" cy="12" r="10.5"/></clipPath></defs><g clip-path="url(#flag-usa-clip)"><path fill="#fff" d="M0 0h24v24H0z"/><path fill="#b22234" d="M0 0h24v2H0zm0 4h24v2H0zm0 4h24v2H0zm0 4h24v2H0zm0 4h24v2H0zm0 4h24v2H0z"/><path fill="#3c3b6e" d="M0 0h11v11H0z"/><g fill="#fff"><circle cx="2" cy="2" r=".55"/><circle cx="5.5" cy="2" r=".55"/><circle cx="9" cy="2" r=".55"/><circle cx="3.7" cy="5" r=".55"/><circle cx="7.2" cy="5" r=".55"/><circle cx="2" cy="8" r=".55"/><circle cx="5.5" cy="8" r=".55"/><circle cx="9" cy="8" r=".55"/></g></g><circle cx="12" cy="12" r="10.5" fill="none" stroke="currentColor" stroke-opacity=".2"/></svg>',
    ru: '<svg class="flag-icon" viewBox="0 0 24 24" aria-hidden="true"><defs><clipPath id="flag-russia-clip"><circle cx="12" cy="12" r="10.5"/></clipPath></defs><g clip-path="url(#flag-russia-clip)"><path fill="#fff" d="M0 0h24v8H0z"/><path fill="#0039a6" d="M0 8h24v8H0z"/><path fill="#d52b1e" d="M0 16h24v8H0z"/></g><circle cx="12" cy="12" r="10.5" fill="none" stroke="currentColor" stroke-opacity=".2"/></svg>'
  };

  const getPreference = (key, fallback) => {
    try {
      return localStorage.getItem(key) || fallback;
    } catch (_) {
      return fallback;
    }
  };

  const savePreference = (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch (_) {}
  };

  const originalTextNodes = new WeakMap();
  const originalElementTexts = new WeakMap();
  const originalAttributes = new WeakMap();

  function translateText(root, dictionary) {
    // Arabic is the source language on the main site. Build a reverse lookup so
    // Arabic-only text can be translated into English or Russian as well.
    const normalize = value => String(value || "").trim().replace(/\s+/g, " ");
    const arabicToKey = new Map();
    Object.entries(translations.ar).forEach(([key, value]) => {
      const normalizedArabic = normalize(value);
      if (normalizedArabic && !arabicToKey.has(normalizedArabic)) arabicToKey.set(normalizedArabic, key);
    });

    const translateOriginal = value => {
      const normalized = normalize(value);
      if (!normalized) return undefined;
      if (dictionary[normalized] !== undefined) return dictionary[normalized];
      const sourceKey = arabicToKey.get(normalized);
      return sourceKey !== undefined ? dictionary[sourceKey] : undefined;
    };

    // Keep original source text so switching between all three languages is reversible.
    root.querySelectorAll("*").forEach(element => {
      if (element.matches("[data-i18n],script,style,code,pre")) return;
      if (element.children.length !== 0) return;
      if (!originalElementTexts.has(element)) originalElementTexts.set(element, element.textContent || "");
      const original = originalElementTexts.get(element);
      const trimmed = original.trim();
      const translated = translateOriginal(trimmed);
      element.textContent = translated !== undefined ? original.replace(trimmed, translated) : original;
    });

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      const parent = node.parentElement;
      if (!parent || parent.closest("[data-i18n],script,style,code,pre")) return;
      if (parent.children.length === 0) return;
      if (!originalTextNodes.has(node)) originalTextNodes.set(node, node.nodeValue);
      const original = originalTextNodes.get(node);
      const trimmed = original.trim();
      const translated = translateOriginal(trimmed);
      node.nodeValue = translated !== undefined ? original.replace(trimmed, translated) : original;
    });

    root.querySelectorAll("*").forEach(element => {
      if (element.matches("[data-i18n]")) return;
      ["placeholder", "title", "aria-label", "alt"].forEach(attribute => {
        if (!originalAttributes.has(element)) originalAttributes.set(element, {});
        const saved = originalAttributes.get(element);
        if (!(attribute in saved)) saved[attribute] = element.getAttribute(attribute);
        const original = saved[attribute];
        const translated = original ? translateOriginal(original) : undefined;
        if (translated !== undefined) element.setAttribute(attribute, translated);
        else if (original !== null) element.setAttribute(attribute, original);
      });
    });
  }
  // Translate content that is rendered after the initial page load (film cards,
  // saved lists, and other client-generated sections).
  let dynamicTranslationObserver = null;

  function translateDynamicSubtree(root, dictionary) {
    if (!root || root.nodeType !== 1) return;

    if (root.matches("[data-i18n]")) {
      const key = root.dataset.i18n;
      if (dictionary[key] !== undefined) root.textContent = dictionary[key];
    }

    root.querySelectorAll("[data-i18n]").forEach(element => {
      const key = element.dataset.i18n;
      if (dictionary[key] !== undefined) element.textContent = dictionary[key];
    });

    translateText(root, dictionary);
  }

  function observeDynamicTranslations() {
    if (dynamicTranslationObserver || !document.body || !("MutationObserver" in window)) return;

    dynamicTranslationObserver = new MutationObserver(records => {
      const language = document.documentElement.lang || getPreference("sodo-language", "ar");
      if (language === "ar") return;

      const dictionary = translations[language] || translations.en;
      records.forEach(record => {
        record.addedNodes.forEach(node => {
          // Ignore text nodes created by our own textContent updates. Newly
          // rendered interface fragments arrive as elements and are translated.
          if (node.nodeType === 1) translateDynamicSubtree(node, dictionary);
        });
      });
    });

    dynamicTranslationObserver.observe(document.body, { childList: true, subtree: true });
  }

  function applyLanguage(language) {
    const lang = translations[language] ? language : "ar";
    const dictionary = translations[lang];

    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

    const forcedTranslations = {
      ar: { aboutIntro: "SODO مساحة شخصية مخصصة للأفكار والثقافة والسينما والعمل الإبداعي. مكان لجمع الأفكار واستكشاف وجهات النظر ومشاركة الأشياء ذات المعنى." },
      en: { aboutIntro: "SODO is a personal space dedicated to ideas, culture, cinema, and creative work. A place to collect ideas, explore perspectives, and share meaningful things." },
      ru: { aboutIntro: "SODO — личное пространство, посвящённое идеям, культуре, кино и творчеству. Место, где можно собирать идеи, изучать разные взгляды и делиться тем, что имеет значение." }
    };

    document.querySelectorAll("[data-i18n]").forEach(element => {
      const key = element.dataset.i18n;

      const forced = forcedTranslations[lang] && forcedTranslations[lang][key];
      if (forced !== undefined || dictionary[key] !== undefined) {
        element.textContent = forced !== undefined ? forced : dictionary[key];
      }
    });

    translateText(document.body, dictionary);

    const titles = {
      ar: {
        "index.html": "الرئيسية — SODO",
        "about.html": "عن الموقع — SODO",
        "thoughts.html": "أفكار — SODO",
        "films.html": "سينما — SODO",
        "projects.html": "مشاريع — SODO"
      },
      en: {
        "index.html": "Home — SODO",
        "about.html": "About — SODO",
        "thoughts.html": "Thoughts — SODO",
        "films.html": "Films — SODO",
        "projects.html": "Projects — SODO"
      },
      ru: {
        "index.html": "Главная — SODO",
        "about.html": "О проекте — SODO",
        "thoughts.html": "Мысли — SODO",
        "films.html": "Кино — SODO",
        "projects.html": "Проекты — SODO"
      }
    };

    const pathParts = location.pathname.split("/").filter(Boolean);
    const currentSlug = pathParts[pathParts.length - 1] || "sodo";
    const page = pathParts.includes("films") ? "films.html" : (currentSlug === "sodo" ? "index.html" : (currentSlug.endsWith(".html") ? currentSlug : `${currentSlug}.html`));

    // Keep the current section visibly selected in every page navigation.
    document.querySelectorAll("nav a:not(.logo)[href]").forEach(link => {
      const targetPath = new URL(link.href, location.href).pathname;
      const targetParts = targetPath.split("/").filter(Boolean);
      const targetSlug = targetParts[targetParts.length - 1] || "sodo";
      const targetPage = targetSlug === "sodo" ? "index.html" : (targetSlug.endsWith(".html") ? targetSlug : `${targetSlug}.html`);
      const active = targetPage === page;
      link.classList.toggle("active", active);
      if (active) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });

    if (titles[lang][page]) {
      document.title = titles[lang][page];
    }
    const filmHeading = document.querySelector(".film-copy h1");
    if (filmHeading) document.title = `${filmHeading.textContent.trim()} — SODO`;

    const descriptions = {
      ar: {
        "index.html": "SODO مساحة للأفكار والثقافة والسينما والإبداع.",
        "about.html": "تعرّف على SODO وفكرته ومساحته المخصصة للأفكار والثقافة والإبداع.",
        "thoughts.html": "أفكار وتأملات وملاحظات تستحق التفكير والمشاركة.",
        "films.html": "مساحة لاستكشاف السينما والحكايات والتجارب البصرية.",
        "projects.html": "مشاريع وتجارب إبداعية وأفكار تتحول إلى واقع."
      },
      en: {
        "index.html": "SODO — a space for ideas, culture, cinema, and creativity.",
        "about.html": "Discover SODO, its idea, and its space for culture and creative exploration.",
        "thoughts.html": "Thoughts, reflections, and notes worth thinking about and sharing.",
        "films.html": "Explore cinema, storytelling, and visual experiences with SODO.",
        "projects.html": "Creative projects, experiments, and ideas taking shape."
      },
      ru: {
        "index.html": "SODO — пространство для идей, культуры, кино и творчества.",
        "about.html": "Познакомьтесь с SODO — пространством для культуры, идей и творчества.",
        "thoughts.html": "Мысли, размышления и заметки, которыми стоит делиться.",
        "films.html": "Исследуйте кино, истории и визуальные впечатления вместе с SODO.",
        "projects.html": "Творческие проекты, эксперименты и идеи в процессе развития."
      }
    };
    const description = document.querySelector('meta[name="description"]');
    if (description && descriptions[lang][page]) {
      description.setAttribute("content", descriptions[lang][page]);
    }

    const code = document.querySelector(".language-code");

    if (code) {
      code.textContent = lang.toUpperCase();
    }

    document.querySelectorAll(".language-option").forEach(link => {
      const active = link.dataset.lang === lang;
      link.classList.toggle("active", active);
      if (active) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });

    const themeButton = document.querySelector(".theme-toggle");

    if (themeButton) {
      const light = document.body.classList.contains("light-mode");
      const label = light
        ? dictionary["Switch to dark mode"] || "Switch to dark mode"
        : dictionary["Switch to light mode"] || "Switch to light mode";

      themeButton.setAttribute("aria-label", label);
      themeButton.setAttribute("title", label);
    }

    savePreference("sodo-language", lang);
  }

  // SODO now has one canonical appearance: cinematic dark mode.
  // Clear any legacy light-mode class/preference so old browser settings cannot
  // turn individual pages, including Cinema and film/series details, white.
  function applyTheme() {
    document.body.classList.remove("light-mode");
    document.documentElement.style.colorScheme = "dark";
    document.documentElement.style.setProperty("--accent", "#c8ff4d");

    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) themeColor.setAttribute("content", "#080a08");

    document.querySelectorAll(".theme-toggle").forEach(button => button.remove());
    savePreference("sodo-theme", "dark");
  }

  function createControls() {
    const header = document.querySelector("header");
    if (!header) return;

    let tools = document.querySelector(".site-tools");
    if (!tools) {
      const nav = header.querySelector("nav");
      if (!nav) return;
      tools = document.createElement("div");
      tools.className = "site-tools";
      nav.appendChild(tools);
    }

    tools.innerHTML = `
      <div class="language-control">
        <button class="site-tool-button language-trigger" type="button"
          aria-label="Choose language" aria-expanded="false" aria-haspopup="true" aria-controls="site-language-menu">
          ${icons.globe}<span class="language-code">AR</span>
        </button>
        <div class="language-menu" id="site-language-menu" role="menu">
          <a class="language-option" data-no-page-transition href="/sodo/ar/" data-lang="ar" role="menuitem" aria-label="العربية">${flagIcons.ar}</a>
          <a class="language-option" data-no-page-transition href="/sodo/en/" data-lang="en" role="menuitem" aria-label="English">${flagIcons.en}</a>
          <a class="language-option" data-no-page-transition href="/sodo/ru/" data-lang="ru" role="menuitem" aria-label="Русский">${flagIcons.ru}</a>
        </div>
      </div>
    `;

    const trigger = tools.querySelector(".language-trigger");
    const menu = tools.querySelector(".language-menu");
    trigger.addEventListener("click", () => {
      const willOpen = !menu.classList.contains("open");
      if (willOpen) {
        const rect = trigger.getBoundingClientRect();
        const menuWidth = Math.min(50, window.innerWidth - 16);
        const left = Math.max(8, Math.min(rect.right - menuWidth, window.innerWidth - menuWidth - 8));
        menu.style.position = "fixed";
        menu.style.top = `${rect.bottom + 9}px`;
        menu.style.left = `${left}px`;
        menu.style.right = "auto";
        menu.style.width = `${menuWidth}px`;
      }
      menu.classList.toggle("open", willOpen);
      // Force the visual state as well as the class. This prevents a page-specific
      // stylesheet from leaving the menu hidden even though the ARIA state changes.
      menu.style.display = willOpen ? "flex" : "none";
      menu.style.visibility = willOpen ? "visible" : "hidden";
      trigger.setAttribute("aria-expanded", String(willOpen));
    });
    // Use real links for language navigation. This works consistently with
    // touch, mouse, keyboard, and browser navigation without competing events.
    const localeBase = "/sodo/";
    const routeParts = window.location.pathname.slice(localeBase.length).split("/").filter(Boolean);
    if (["ar", "en", "ru"].includes(routeParts[0])) routeParts.shift();
    const routeSuffix = routeParts.length ? routeParts.join("/") + "/" : "";
    menu.style.display = "none";
    menu.style.visibility = "hidden";

    menu.querySelectorAll(".language-option[data-lang]").forEach(option => {
      option.href = localeBase + option.dataset.lang + "/" + routeSuffix +
        window.location.search + window.location.hash;
    });

    document.addEventListener("click", event => {
      if (!tools.contains(event.target)) {
        menu.classList.remove("open");
        menu.style.display = "none";
        menu.style.visibility = "hidden";
        trigger.setAttribute("aria-expanded", "false");
      }
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && menu.classList.contains("open")) {
        menu.classList.remove("open");
        menu.style.display = "none";
        menu.style.visibility = "hidden";
        trigger.setAttribute("aria-expanded", "false");
        trigger.focus();
      }
    });
  }

  function installStyles() {
    if (document.getElementById("sodo-i18n-style")) return;

    const style = document.createElement("style");
    style.id = "sodo-i18n-style";

    style.textContent = `
      /* Shared, layout-stable header across every SODO section.
         Preserve the existing visual/transition effects; normalize only geometry. */
      body > header {
        position: relative;
        z-index: 100;
        box-sizing: border-box;
        width: 100%;
        max-width: 1044px;
        min-height: 138px;
        margin-inline: auto;
        padding: 22px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 24px;
      }

      body > header > .container {
        width: 100%;
        max-width: none;
        margin: 0;
      }

      body > header nav {
        box-sizing: border-box;
        min-width: 0;
        min-height: 82px;
        display: flex;
        flex: 1 1 auto;
        align-items: center;
        justify-content: space-between;
        flex-wrap: nowrap;
        gap: 22px;
      }

      body > header nav > .logo {
        flex: 0 0 auto;
        line-height: 1;
      }

      body > header nav > .nav-links {
        min-width: 0;
        flex: 1 1 auto;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: nowrap;
        gap: clamp(12px, 2.2vw, 28px);
        margin: 0;
        padding: 0;
      }

      body > header nav > a:not(.logo) {
        flex: 0 0 auto;
        white-space: nowrap;
      }

      body > header .site-tools {
        position: relative;
        z-index: 101;
        flex: 0 0 auto;
        margin-inline-start: 0;
      }

      body > header .nav-links a,
      body > header nav > a:not(.logo) {
        line-height: 1.5;
      }

      @media (max-width: 700px) {
        body > header {
          min-height: 0;
          padding: 18px 16px;
          flex-direction: column;
          align-items: stretch;
          justify-content: center;
          gap: 10px;
        }

        body > header nav {
          width: 100%;
          min-height: 0;
          flex-wrap: wrap;
          justify-content: center;
          gap: 12px 16px;
        }

        body > header nav > .nav-links {
          flex: 1 1 100%;
          flex-wrap: wrap;
          justify-content: center;
          gap: 10px 16px;
        }

        body > header nav > .logo {
          margin-inline: auto;
        }

        body > header .site-tools {
          margin: 0;
        }
      }

      .site-tools {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-inline-start: 12px;
        position: relative;
        z-index: 999;
      }

      .site-tool-button {
        width: 42px;
        height: 42px;
        min-width: 42px;
        padding: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: 1px solid var(--line,#293126);
        border-radius: 50%;
        background: var(--surface,#111510);
        color: var(--text,#f4f7ef);
        cursor: pointer;
        transition: .25s ease;
      }

      .site-tool-button:hover {
        border-color: #c8ff4d;
        transform: translateY(-2px);
      }

      .site-tool-button svg {
        width: 19px;
        height: 19px;
        fill: none;
        stroke: #c8ff4d;
        stroke-width: 1.6;
        stroke-linecap: round;
        stroke-linejoin: round;
      }

      .language-control { position: relative; }

      .language-trigger {
        width: auto;
        min-width: 76px;
        padding: 0 10px;
        gap: 7px;
        border-radius: 22px;
        font-size: 12px;
        font-weight: 600;
      }

      .language-trigger svg {
        width: 17px;
        height: 17px;
      }

      .language-menu {
        position: absolute;
        z-index: 102;
        top: calc(100% + 9px);
        inset-inline-end: 0;
        width: 50px;
        min-width: 0;
        max-width: calc(100vw - 16px);
        box-sizing: border-box;
        padding: 5px;
        display: none;
        flex-direction: column;
        gap: 3px;
        background: #10140f;
        border: 1px solid #30392b;
        border-radius: 11px;
        box-shadow: 0 12px 30px #0004;
      }

      .language-menu.open { display: flex; }

      .language-option {
        width: 100%;
        border: 0;
        border-radius: 7px;
        padding: 7px 0;
        justify-content: center;
        display: flex;
        align-items: center;
        gap: 0;
        text-align: center;
        background: transparent;
        color: #e9eee3;
        font: inherit;
        font-size: 13px;
        cursor: pointer;
        text-decoration: none;
      }

      .flag-icon {
        width: 23px;
        height: 23px;
        flex: 0 0 23px;
        display: block;
        border-radius: 50%;
        overflow: hidden;
      }

      .language-option span { line-height: 1; }

      nav a.active,
      .nav-links a.active {
        color: var(--accent, #c8ff4d) !important;
        text-decoration-line: underline;
        text-decoration-color: var(--accent, #c8ff4d);
        text-decoration-thickness: 2px;
        text-underline-offset: 7px;
      }

      .language-option:hover,
      .language-option.active {
        background: #c8ff4d1a;
        color: #c8ff4d;
      }

      body.light-mode {
        --bg: #f4f5ef !important;
        --surface: #fff !important;
        --panel: #fff !important;
        --line: #d9dfd0 !important;
        --border: #d9dfd0 !important;
        --text: #171b14 !important;
        --muted: #626b5c !important;
        --accent: #36570a !important;
        background: #f4f5ef !important;
        color: #171b14 !important;
      }

      body.light-mode .site-tool-button {
        background: #fff;
        color: #171b14;
        border-color: #d9dfd0;
      }

      body.light-mode .site-tool-button svg {
        stroke: #36570a;
      }

      body.light-mode .site-tool-button:hover {
        border-color: #36570a;
      }

      body.light-mode .language-menu {
        background: #fff;
        border-color: #d9dfd0;
      }

      body.light-mode .language-option { color: #171b14; }

      body.light-mode .language-option:hover,
      body.light-mode .language-option.active {
        background: #f0f5e7;
        color: #36570a;
      }

      html[dir="rtl"] nav,
      html[dir="rtl"] .nav-links {
        direction: rtl;
      }

      @media(max-width:700px) {
        .site-tools {
          margin: 8px 0;
          gap: 7px;
        }

        .site-tool-button {
          width: 39px;
          height: 39px;
          min-width: 39px;
        }

        .language-trigger {
          width: auto;
          min-width: 70px;
        }
      }



    `;

    document.head.appendChild(style);

    // Keep text metrics and tap states stable across every page and device.
    // This layer intentionally avoids changing the site's palette or animations.
    const stabilityStyle = document.createElement("style");
    stabilityStyle.id = "sodo-stability-style";
    stabilityStyle.textContent = `
      html {
        -webkit-text-size-adjust: 100%;
        text-size-adjust: 100%;
        scroll-behavior: smooth;
      }

      body {
        min-width: 320px;
        overflow-x: clip;
      }

      img, svg, video {
        max-width: 100%;
      }

      a, button, [role="button"] {
        -webkit-tap-highlight-color: transparent;
        touch-action: manipulation;
      }

      button, input, select, textarea {
        font-family: inherit;
        max-width: 100%;
      }

      a, button, input, select, textarea, [role="button"] {
        font-synthesis: none;
      }

      a:focus-visible,
      button:focus-visible,
      input:focus-visible,
      select:focus-visible,
      textarea:focus-visible,
      [role="button"]:focus-visible {
        outline: 2px solid var(--accent, #c8ff4d);
        outline-offset: 3px;
      }

      body > header,
      body > main,
      body > footer,
      main,
      main > section,
      .container,
      .movie-grid,
      .movie-card,
      .movie-card-info,
      .card,
      .project,
      .film,
      .film-copy {
        min-width: 0;
      }

      .movie-grid {
        align-items: stretch;
      }

      .movie-card {
        height: 100%;
      }

      .movie-card h3,
      .movie-title-link,
      .movie-meta,
      .section-heading h2,
      .card h3,
      .project h2 {
        overflow-wrap: anywhere;
      }

      .movie-poster {
        background: #20251e;
      }

      @media (max-width: 380px) {
        body > header {
          padding-inline: 14px;
        }

        .site-tools {
          flex-wrap: wrap;
        }

        .movie-grid {
          gap: 8px;
        }

        .movie-card {
          padding: 5px;
        }

        .movie-card h3 {
          font-size: 12px;
          line-height: 1.45;
        }

        .movie-meta {
          font-size: 10px;
          line-height: 1.45;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        html {
          scroll-behavior: auto;
        }

        *, *::before, *::after {
          animation-duration: .01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: .01ms !important;
        }
      }
    `;
    document.head.appendChild(stabilityStyle);
  }

  function installMotionSystem() {
    if (document.getElementById("sodo-motion-style")) return;

    const style = document.createElement("style");
    style.id = "sodo-motion-style";
    style.textContent = `
      :root {
        --sodo-motion-fast: 160ms;
        --sodo-motion-base: 260ms;
        --sodo-motion-slow: 420ms;
        --sodo-motion-ease: cubic-bezier(.22,.61,.36,1);
      }

      @keyframes sodo-page-enter {
        from { opacity: 0; transform: translate3d(0, 9px, 0); }
        to { opacity: 1; transform: translate3d(0, 0, 0); }
      }

      body.sodo-motion-enter > header,
      body.sodo-motion-enter > main,
      body.sodo-motion-enter > footer {
        animation: sodo-page-enter 440ms var(--sodo-motion-ease) both;
      }
      body.sodo-motion-enter > main { animation-delay: 35ms; }
      body.sodo-motion-enter > footer { animation-delay: 70ms; }

      [data-sodo-reveal] {
        opacity: 0;
        transform: translate3d(0, 15px, 0);
        transition:
          opacity var(--sodo-motion-slow) var(--sodo-motion-ease),
          transform var(--sodo-motion-slow) var(--sodo-motion-ease);
        transition-delay: var(--sodo-reveal-delay, 0ms);
        will-change: opacity, transform;
      }
      [data-sodo-reveal].sodo-is-visible {
        opacity: 1;
        transform: translate3d(0, 0, 0);
        will-change: auto;
      }

      a, button, [role="button"] {
        -webkit-tap-highlight-color: transparent;
      }
      a:active, button:active, [role="button"]:active {
        transition-duration: var(--sodo-motion-fast);
      }
      body.sodo-page-leaving {
        opacity: 0;
        transform: translate3d(0, -4px, 0);
        transition: opacity 180ms ease, transform 180ms ease;
        pointer-events: none;
      }

      @media (prefers-reduced-motion: reduce) {
        body.sodo-motion-enter > header,
        body.sodo-motion-enter > main,
        body.sodo-motion-enter > footer {
          animation: none !important;
        }
        [data-sodo-reveal] {
          opacity: 1 !important;
          transform: none !important;
          transition: none !important;
          will-change: auto !important;
        }
        body.sodo-page-leaving {
          opacity: 1 !important;
          transform: none !important;
          transition: none !important;
        }
      }
    `;
    document.head.appendChild(style);

    const reducedMotion = window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      document.querySelectorAll("[data-sodo-reveal]").forEach(el => {
        el.classList.add("sodo-is-visible");
      });
      return;
    }

    document.body.classList.add("sodo-motion-enter");

    const revealSelector = [
      "main > .hero",
      "main > h1",
      "main > .intro",
      "main > .eyebrow",
      "main > section",
      "main > .content",
      ".cards > .card",
      ".movie-grid > .movie-card",
      ".cinema-tabs > a",
      ".project",
      ".film-layout",
      ".film-hero",
      ".work-heading",
      ".details-panel",
      ".watched-film",
      ".footer-socials"
    ].join(",");

    const revealItems = Array.from(document.querySelectorAll(revealSelector));
    revealItems.forEach((el, index) => {
      if (el.closest("#sodo-welcome-overlay")) return;
      el.setAttribute("data-sodo-reveal", "");
      el.style.setProperty("--sodo-reveal-delay", (Math.min(index % 6, 5) * 48) + "ms");
    });

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries, currentObserver) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("sodo-is-visible");
          currentObserver.unobserve(entry.target);
        });
      }, { threshold: 0.08, rootMargin: "0px 0px -28px 0px" });

      revealItems.forEach(el => {
        if (!el.closest("#sodo-welcome-overlay")) observer.observe(el);
      });
    } else {
      revealItems.forEach(el => el.classList.add("sodo-is-visible"));
    }

    document.addEventListener("click", event => {
      if (event.defaultPrevented || event.button !== 0 ||
          event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const link = event.target.closest("a[href]");
      const card = !link && event.target.closest("[data-card-href]");
      if (card && event.target.closest("a, button, input, select, textarea")) return;
      if (!link && !card) return;
      if (link && (link.classList.contains("language-option") || link.target || link.hasAttribute("download") ||
          link.hasAttribute("data-no-page-transition") ||
          (link.getAttribute("rel") || "").split(/\s+/).includes("external"))) return;

      let destination;
      try {
        destination = new URL(link ? link.href : card.dataset.cardHref, window.location.href);
      } catch (_) { return; }
      if (destination.origin !== window.location.origin ||
          destination.pathname === window.location.pathname &&
          destination.search === window.location.search ||
          destination.hash && destination.pathname === window.location.pathname) return;

      event.preventDefault();
      if (card) event.stopImmediatePropagation();
      document.body.classList.add("sodo-page-leaving");
      window.setTimeout(() => window.location.assign(destination.href), 180);
    }, true);
  }

  // Safari/iOS may restore the previous document from the back-forward cache.
  // Clear the exit state so a swipe-back never leaves the restored page invisible
  // or unable to receive taps until the user refreshes.
  window.addEventListener("pageshow", function onSodoPageShow() {
    if (!document.body) return;
    document.body.classList.remove("sodo-page-leaving");
  });

  
  function installSocialIconOnlyFooter() {
    const telegramIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m21.4 4.6-3.2 15.1c-.2 1.1-.9 1.4-1.8.9l-5-3.7-2.4 2.3c-.3.3-.5.5-1 .5l.4-5.1 9.3-8.4c.4-.4-.1-.6-.6-.2L6.6 13.3l-5-1.6c-1.1-.3-1.1-1.1.2-1.6L20.2 3c.9-.3 1.6.2 1.2 1.6Z" fill="currentColor"/></svg>';
    document.querySelectorAll(".footer-socials").forEach((footer) => {
      footer.querySelectorAll("a").forEach((link) => {
        link.querySelectorAll("span").forEach((label) => label.remove());
        const href = link.getAttribute("href") || "";
        if (href.includes("x.com")) link.setAttribute("aria-label", "X");
        else if (href.includes("instagram.com")) link.setAttribute("aria-label", "Instagram");
        else if (href.includes("t.me")) link.setAttribute("aria-label", "Telegram");
      });
      if (!footer.querySelector('a[href*="t.me/bblaock"]')) {
        const link = document.createElement("a");
        link.href = "https://t.me/bblaock";
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.setAttribute("aria-label", "Telegram");
        link.innerHTML = telegramIcon;
        footer.appendChild(link);
      }
    });
    if (!document.getElementById("sodo-social-icon-only-style")) {
      const style = document.createElement("style");
      style.id = "sodo-social-icon-only-style";
      style.textContent = `
        .footer-socials a {
          width: 42px !important;
          height: 42px !important;
          min-width: 42px !important;
          min-height: 42px !important;
          padding: 0 !important;
          gap: 0 !important;
          justify-content: center !important;
          align-items: center !important;
          border-radius: 50% !important;
        }
        .footer-socials a span { display: none !important; }
        .footer-socials a svg { width: 19px !important; height: 19px !important; flex: 0 0 19px !important; }
      `;
      document.head.appendChild(style);
    }
  }

  function installCinemaLightTheme() {
    if (document.getElementById("sodo-cinema-light-theme")) return;
    const style = document.createElement("style");
    style.id = "sodo-cinema-light-theme";
    style.textContent = `
      body.light-mode .film-layout {
        background: linear-gradient(135deg, #ffffff 0%, #f7f9f2 58%, #eef2e7 100%) !important;
        border-color: #d9dfd0 !important;
        box-shadow: 0 24px 65px #26351a18 !important;
        color: #171b14 !important;
      }
      body.light-mode .film-layout::before {
        background: radial-gradient(ellipse, #789b3212 0%, #789b3208 34%, transparent 70%) !important;
      }
      body.light-mode .film-layout .story-block,
      body.light-mode .film-layout .work-heading {
        border-color: #d9dfd0 !important;
      }
      body.light-mode .film-layout .story-block h2,
      body.light-mode .film-layout .work-heading h1,
      body.light-mode .film-layout .details-panel h2 {
        color: #171b14 !important;
      }
      body.light-mode .film-layout .story {
        color: #46513f !important;
      }
      body.light-mode .film-layout .eyebrow,
      body.light-mode .film-layout .meta-item strong {
        color: #36570a !important;
      }
      body.light-mode .film-layout .meta-item {
        background: #ffffff !important;
        border-color: #d9dfd0 !important;
        color: #171b14 !important;
        backdrop-filter: none !important;
      }
      body.light-mode .film-layout .meta-label,
      body.light-mode .film-layout .details-list dt {
        color: #626b5c !important;
      }
      body.light-mode .film-layout .details-panel {
        background: #ffffff !important;
        border-color: #d9dfd0 !important;
        color: #171b14 !important;
      }
      body.light-mode .film-layout .details-list dd {
        color: #252c20 !important;
      }
      body.light-mode .film-layout .detail-poster {
        border-color: #b7c69b !important;
        box-shadow: 0 18px 42px #26351a20, 0 0 0 5px #26351a08 !important;
      }
    `;
    document.head.appendChild(style);
  }

  function installCinemaSearch() {
    const path = window.location.pathname;
    if (!/\/films\/(?:index\.html)?$/.test(path)) return;
    if (document.getElementById("sodo-cinema-search")) return;

    const grids = Array.from(document.querySelectorAll(".cinema-section .movie-grid"));
    if (!grids.length) return;

    const lang = document.documentElement.lang || "en";
    const labels = {
      ar: { placeholder: "ابحث في السينما…", results: "نتيجة", none: "لا توجد نتائج مطابقة.", sort: "ترتيب", featured: "الترتيب الأصلي", title: "الاسم: أ–ي", year: "الأحدث أولاً", rating: "الأعلى تقييماً" },
      en: { placeholder: "Search cinema…", results: "results", none: "No matching titles.", sort: "Sort", featured: "Featured order", title: "Title: A–Z", year: "Newest first", rating: "Highest rated" },
      ru: { placeholder: "Поиск по кино…", results: "результатов", none: "Совпадений нет.", sort: "Сортировка", featured: "Исходный порядок", title: "Название: А–Я", year: "Сначала новые", rating: "С высоким рейтингом" }
    };
    const copy = labels[lang] || labels.en;

    const wrap = document.createElement("div");
    wrap.id = "sodo-cinema-search";
    wrap.className = "sodo-cinema-search";
    wrap.innerHTML = `
      <label class="sodo-cinema-search-label" for="sodo-cinema-search-input">${copy.placeholder}</label>
      <div class="sodo-cinema-search-row">
        <input id="sodo-cinema-search-input" type="search" autocomplete="off" enterkeyhint="search"
          placeholder="${copy.placeholder}" aria-label="${copy.placeholder}">
        <label class="sodo-cinema-sort-label" for="sodo-cinema-sort">${copy.sort}</label>
        <select id="sodo-cinema-sort" aria-label="${copy.sort}">
          <option value="featured">${copy.featured}</option>
          <option value="title">${copy.title}</option>
          <option value="year">${copy.year}</option>
          <option value="rating">${copy.rating}</option>
        </select>
        <span class="sodo-cinema-search-count" aria-live="polite"></span>
      </div>
      <p class="sodo-cinema-search-empty" hidden></p>
    `;

    const style = document.createElement("style");
    style.id = "sodo-cinema-search-style";
    style.textContent = `
      .sodo-cinema-search { margin: 0 0 32px; }
      .sodo-cinema-search-label {
        display:block; margin:0 0 9px; color:var(--accent,#c8ff4d);
        font-size:11px; letter-spacing:1.8px; text-transform:uppercase;
      }
      .sodo-cinema-search-row { display:flex; align-items:center; gap:10px; }
      #sodo-cinema-search-input {
        flex:1 1 240px; min-width:0; width:100%; padding:12px 14px;
        border:1px solid var(--border,#293126); border-radius:10px;
        background:var(--panel,#111510); color:var(--text,#f4f7ef);
        outline:none; font:inherit; font-size:14px;
      }
      #sodo-cinema-search-input:focus, #sodo-cinema-sort:focus {
        border-color:var(--accent,#c8ff4d);
        box-shadow:0 0 0 3px color-mix(in srgb, var(--accent,#c8ff4d) 14%, transparent);
      }
      #sodo-cinema-sort {
        min-width:145px; max-width:190px; padding:11px 12px;
        border:1px solid var(--border,#293126); border-radius:10px;
        background:var(--panel,#111510); color:var(--text,#f4f7ef);
        font:inherit; font-size:12px;
      }
      .sodo-cinema-sort-label { color:var(--muted,#b0b9a9); font-size:11px; white-space:nowrap; }
      .sodo-cinema-search-count { flex:0 0 auto; color:var(--muted,#b0b9a9); font-size:11px; white-space:nowrap; }
      .sodo-cinema-search-empty { margin:12px 0 0; color:var(--muted,#b0b9a9); font-size:13px; }
      @media(max-width:600px) {
        .sodo-cinema-search-row { display:grid; grid-template-columns:minmax(0,1fr) auto; gap:9px; }
        #sodo-cinema-search-input { grid-column:1 / -1; }
        .sodo-cinema-sort-label { grid-column:1; align-self:center; }
        #sodo-cinema-sort { grid-column:2; width:100%; max-width:none; }
        .sodo-cinema-search-count { grid-column:1 / -1; text-align:start; }
      }
    `;
    document.head.appendChild(style);

    const anchor = document.querySelector(".cinema-tabs") || grids[0];
    anchor.parentNode.insertBefore(wrap, anchor);

    const input = wrap.querySelector("#sodo-cinema-search-input");
    const sort = wrap.querySelector("#sodo-cinema-sort");
    const count = wrap.querySelector(".sodo-cinema-search-count");
    const empty = wrap.querySelector(".sodo-cinema-search-empty");
    let cards = grids.flatMap(grid => Array.from(grid.querySelectorAll(":scope > .movie-card")));

    const normalize = value => String(value || "").normalize("NFKC").toLocaleLowerCase();
    const getText = card => normalize([
      card.querySelector("h3")?.textContent,
      card.querySelector(".movie-meta")?.textContent,
      card.textContent
    ].join(" "));

    function applyFilter() {
      const query = normalize(input.value);
      const visible = cards.filter(card => !query || getText(card).includes(query)).length;
      count.textContent = query ? String(visible) + " " + copy.results : "";
      empty.hidden = visible !== 0 || !query;
      empty.textContent = copy.none;
      document.dispatchEvent(new CustomEvent("sodo:cinema-search", { detail: { query } }));
    }

    document.addEventListener("sodo:cinema-cards-updated", () => {
      cards = grids.flatMap(grid => Array.from(grid.querySelectorAll(":scope > .movie-card")));
      applyFilter();
    });

    input.addEventListener("input", applyFilter, { passive: true });
    input.addEventListener("search", applyFilter);
    sort.addEventListener("change", () => {
      document.dispatchEvent(new CustomEvent("sodo:cinema-sort", { detail: { sort: sort.value } }));
    });
  }

  function initialize() {
    installStyles();
    installMotionSystem();
    createControls();
    installSocialIconOnlyFooter();
    installCinemaSearch();

    // The locale in the current URL is authoritative on every localized page.
    // Stored preferences are only a fallback for legacy routes.
    const routeParts = window.location.pathname.split("/").filter(Boolean);
    const routeLanguage = routeParts[0] === "sodo" && ["ar", "en", "ru"].includes(routeParts[1])
      ? routeParts[1]
      : null;
    applyLanguage(routeLanguage || getPreference("sodo-language", "ar"));
    observeDynamicTranslations();
    applyTheme();
    document.documentElement.classList.add("site-ready");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize);
  } else {
    initialize();
  }
})();