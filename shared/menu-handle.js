// =========================
// UNIVERSAL MENU HANDLE
// File: shared/menu-handle.js
// Full function names:
// createUniversalMenuHandle()
// buildUniversalMenuCard()
// openUniversalSideMenu()
// closeUniversalSideMenu()
// toggleUniversalSideMenu()
// toggleSideMenu()
// closeSideMenu()
// openSideMenu()
// setMainMenuHandleVisibility()
// getUniversalBasePath()
// getUniversalCurrentPageName()
// universalMenuGoMainPage()
// universalMenuRefreshApp()
// universalMenuOpenAppSettings()
// universalMenuOpenCloudMenu()
// universalMenuCloseCloudMenu()
// universalMenuToggleCloudMenu()
// universalMenuCloudSignIn()
// universalMenuCloudSignOut()
// universalMenuCloudSave()
// universalMenuCloudLoad()
// universalMenuUpdateCloudStatus()
// universalMenuWaitForCloudFile()
// universalMenuLoadCloudSyncFile()
// getUniversalShortcutChoices()
// getUniversalSavedShortcuts()
// setUniversalSavedShortcuts(shortcuts)
// buildUniversalSavedShortcutCards()
// buildUniversalShortcutPickerOverlay()
// universalMenuOpenShortcutPicker()
// universalMenuCloseShortcutPicker()
// universalMenuToggleShortcut(shortcutId)
// universalMenuAddShortcut(shortcutId)
// universalMenuRemoveShortcut(shortcutId)
// universalMenuGoShortcut(shortcutId)
// =========================

let universalSideMenuOpen = false;
let universalCloudMenuOpen = false;
let universalCloudFileStarted = false;
let universalMenuLastOptions = {};

// =========================
// CREATE UNIVERSAL MENU HANDLE
// Full function name: createUniversalMenuHandle()
// =========================
function createUniversalMenuHandle(options){

  if(options && Object.keys(options).length){
    universalMenuLastOptions = options;
  }

  options = options || universalMenuLastOptions || {};

  let iconBasePath = options.iconBasePath || "Images/Icons/";

  let oldOverlay = document.getElementById("sideMenuOverlay");
  let oldHandle = document.getElementById("menuHandle");
  let oldMenu = document.getElementById("sideMenu");
  let oldCloudOverlay = document.getElementById("universalCloudOverlay");
  let oldShortcutOverlay = document.getElementById("universalShortcutOverlay");

  if(oldOverlay) oldOverlay.remove();
  if(oldHandle) oldHandle.remove();
  if(oldMenu) oldMenu.remove();
  if(oldCloudOverlay) oldCloudOverlay.remove();
  if(oldShortcutOverlay) oldShortcutOverlay.remove();

  universalMenuLoadCloudSyncFile();

  let overlay = document.createElement("div");
  overlay.id = "sideMenuOverlay";
  overlay.onclick = closeUniversalSideMenu;
  overlay.style.cssText = `
    display:none;
    position:fixed;
    top:0;
    left:0;
    right:0;
    bottom:0;
    background:rgba(0,0,0,0.35);
    z-index:9997;
  `;

  let handle = document.createElement("div");
  handle.id = "menuHandle";
  handle.onclick = toggleUniversalSideMenu;
  handle.style.cssText = `
    position:fixed;
    top:18px;
    left:0;
    width:34px;
    height:96px;
    background:rgba(255,255,255,0.68);
    backdrop-filter:blur(14px);
    -webkit-backdrop-filter:blur(14px);
    border-top-right-radius:18px;
    border-bottom-right-radius:18px;
    border:1px solid rgba(255,255,255,0.55);
    box-shadow:0 6px 18px rgba(0,0,0,0.10);
    display:flex;
    align-items:center;
    justify-content:center;
    z-index:9999;
    cursor:pointer;
    transition:all 0.25s ease;
  `;

  handle.innerHTML = `
    <span id="menuHandleIcon" style="
    color:#3a3a3c;
    font-size:10px;
    font-weight:800;
    letter-spacing:1.5px;
    line-height:1.15;
    text-align:center;
    display:block;
    ">
      M<br>E<br>N<br>U
    </span>
  `;

  let menu = document.createElement("div");
  menu.id = "sideMenu";
  menu.style.cssText = `
    position:fixed;
    top:0;
    left:-280px;
    width:260px;
    height:100dvh;
    max-height:100dvh;
    background:rgba(233,233,238,0.96);
    backdrop-filter:blur(18px);
    -webkit-backdrop-filter:blur(18px);
    box-shadow:10px 0 30px rgba(0,0,0,0.16);
    z-index:9998;
    padding:96px 14px calc(env(safe-area-inset-bottom) + 14px) 14px;
    transition:left 0.28s ease;
    box-sizing:border-box;
    border-top-right-radius:28px;
    border-bottom-right-radius:28px;
    border-right:1px solid rgba(255,255,255,0.55);
    overflow:hidden;
    display:flex;
    flex-direction:column;
  `;

  menu.innerHTML = `
    <div style="
    font-size:24px;
    font-weight:800;
    color:#111;
    margin-bottom:16px;
    letter-spacing:0.2px;
    text-align:center;
    flex-shrink:0;
    ">
      Menu
    </div>

    <div id="universalMenuScrollArea" style="
    width:100%;
    flex:1;
    min-height:0;
    overflow-y:auto;
    overflow-x:hidden;
    -webkit-overflow-scrolling:touch;
    padding:0 4px 12px 4px;
    box-sizing:border-box;
    ">

      ${buildUniversalMenuCard({
        title:"Main Page",
        icon:iconBasePath + "home.png",
        onclick:"universalMenuGoMainPage()"
      })}

      ${buildUniversalMenuCard({
        title:"Refresh App",
        icon:iconBasePath + "refresh.png",
        onclick:"universalMenuRefreshApp()"
      })}

      ${buildUniversalMenuCard({
        title:"App Settings",
        icon:iconBasePath + "settings.png",
        onclick:"universalMenuOpenAppSettings()"
      })}

      ${buildUniversalMenuCard({
        title:"Cloud Sync",
        icon:iconBasePath + "settings.png",
        onclick:"universalMenuOpenCloudMenu()"
      })}

      ${buildUniversalSavedShortcutCards()}

    </div>

    <div style="
    width:100%;
    flex-shrink:0;
    padding:10px 4px 0 4px;
    box-sizing:border-box;
    background:linear-gradient(to top, rgba(233,233,238,0.98), rgba(233,233,238,0.75), rgba(233,233,238,0));
    ">
      <button onclick="universalMenuOpenShortcutPicker()" style="
      width:100%;
      border:none;
      border-radius:18px;
      background:#111;
      color:white;
      font-size:16px;
      font-weight:950;
      line-height:1;
      cursor:pointer;
      display:flex;
      align-items:center;
      justify-content:center;
      gap:7px;
      padding:14px 14px;
      box-shadow:0 8px 18px rgba(0,0,0,0.14);
      font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display','Segoe UI',Arial,sans-serif;
      ">
        Add Shortcut <span style="font-size:20px;line-height:1;">+</span>
      </button>
    </div>
  `;

  let cloudOverlay = document.createElement("div");
  cloudOverlay.id = "universalCloudOverlay";
  cloudOverlay.onclick = function(event){
    if(event.target && event.target.id === "universalCloudOverlay"){
      universalMenuCloseCloudMenu();
    }
  };
  cloudOverlay.style.cssText = `
    display:none;
    position:fixed;
    inset:0;
    width:100%;
    height:100%;
    background:rgba(0,0,0,0.35);
    backdrop-filter:blur(10px);
    -webkit-backdrop-filter:blur(10px);
    z-index:12000;
    align-items:flex-end;
    justify-content:center;
    padding:0 4% calc(env(safe-area-inset-bottom) + 18px) 4%;
    box-sizing:border-box;
  `;

  cloudOverlay.innerHTML = `
    <div onclick="event.stopPropagation();" style="
    width:100%;
    max-width:430px;
    background:rgba(255,255,255,0.96);
    border-radius:30px;
    padding:14px 4% 18px 4%;
    box-shadow:0 -18px 48px rgba(0,0,0,0.22);
    border:1px solid rgba(255,255,255,0.70);
    box-sizing:border-box;
    ">
      <div style="
      width:44px;
      height:5px;
      background:#c9c9cf;
      border-radius:99px;
      margin:0 auto 16px auto;
      "></div>

      <div style="
      font-size:26px;
      font-weight:950;
      color:#111;
      text-align:center;
      margin-bottom:8px;
      letter-spacing:-0.5px;
      ">
        ☁️ Cloud Sync
      </div>

      <div id="universalCloudStatusLine" style="
      font-size:14px;
      font-weight:750;
      color:#666;
      text-align:center;
      line-height:1.4;
      margin-bottom:16px;
      ">
        Cloud: Checking...
      </div>

      <button onclick="universalMenuCloudSignIn()" style="
      width:100%;
      border:none;
      border-radius:18px;
      padding:15px;
      background:#111;
      color:white;
      font-size:17px;
      font-weight:900;
      cursor:pointer;
      margin-bottom:10px;
      ">
        Sign in with Google
      </button>

      <button onclick="universalMenuCloudSignOut()" style="
      width:100%;
      border:none;
      border-radius:18px;
      padding:15px;
      background:#fff1f1;
      color:#d11a2a;
      font-size:17px;
      font-weight:900;
      cursor:pointer;
      margin-bottom:10px;
      ">
        Sign out
      </button>

      <button onclick="universalMenuCloseCloudMenu()" style="
      width:100%;
      border:none;
      border-radius:18px;
      padding:15px;
      background:#e9e9ee;
      color:#111;
      font-size:17px;
      font-weight:900;
      cursor:pointer;
      ">
        Close
      </button>

      <div style="
      font-size:12px;
      font-weight:650;
      color:#777;
      text-align:center;
      line-height:1.4;
      margin-top:12px;
      ">
        This cloud menu is shared. Each page will connect its own save/load system.
      </div>
    </div>
  `;

  let shortcutOverlay = buildUniversalShortcutPickerOverlay();

  document.body.appendChild(overlay);
  document.body.appendChild(handle);
  document.body.appendChild(menu);
  document.body.appendChild(cloudOverlay);
  document.body.appendChild(shortcutOverlay);

  universalMenuWaitForCloudFile();

}

// =========================
// BUILD UNIVERSAL MENU CARD
// Full function name: buildUniversalMenuCard()
// =========================
function buildUniversalMenuCard(item){

  return `
    <div onclick="${item.onclick}" style="
    background:rgba(255,255,255,0.82);
    padding:16px 16px;
    border-radius:20px;
    font-size:18px;
    font-weight:800;
    color:#111;
    margin-bottom:12px;
    box-shadow:0 8px 18px rgba(0,0,0,0.08);
    cursor:pointer;
    border:1px solid rgba(255,255,255,0.55);
    display:flex;
    align-items:center;
    gap:12px;
    ">
      <img src="${item.icon}" onerror="this.style.display='none'" style="
      width:30px;
      height:30px;
      display:block;
      flex-shrink:0;
      object-fit:contain;
      ">
      <span style="
      display:flex;
      align-items:center;
      line-height:1;
      ">
        ${item.title}
      </span>
    </div>
  `;
}

// =========================
// GET UNIVERSAL SHORTCUT CHOICES
// Full function name: getUniversalShortcutChoices()
// =========================
function getUniversalShortcutChoices(){

  return [
    {id:"quran", title:"📖 Quran", path:"quran/"},
    {id:"tasbih", title:"🔢 Tasbih", path:"tasbih/"},
    {id:"dua", title:"🤲 Dua", path:"duapage/"},
    {id:"dailyazkar", title:"📿 Daily Azkar", path:"dailyazkar/"},
    {id:"qibla", title:"🧭 Qibla", path:"qibla/"},
    {id:"qaza", title:"🧮 Qaza Tracker", path:"qazatracker/"},
    {id:"books", title:"📚 Books", path:"books/"}
  ];

}

// =========================
// GET UNIVERSAL SAVED SHORTCUTS
// Full function name: getUniversalSavedShortcuts()
// =========================
function getUniversalSavedShortcuts(){

  let saved = localStorage.getItem("ibadahUniversalMenuShortcuts");

  if(!saved) return [];

  try{
    let parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  }catch(error){
    return [];
  }

}

// =========================
// SET UNIVERSAL SAVED SHORTCUTS
// Full function name: setUniversalSavedShortcuts(shortcuts)
// =========================
function setUniversalSavedShortcuts(shortcuts){

  localStorage.setItem("ibadahUniversalMenuShortcuts", JSON.stringify(shortcuts || []));

}

// =========================
// BUILD UNIVERSAL SAVED SHORTCUT CARDS
// Full function name: buildUniversalSavedShortcutCards()
// =========================
function buildUniversalSavedShortcutCards(){

  let savedShortcuts = getUniversalSavedShortcuts();
  let choices = getUniversalShortcutChoices();
  let html = "";

  savedShortcuts.forEach(function(shortcutId){

    let item = choices.find(function(choice){
      return choice.id === shortcutId;
    });

    if(!item) return;

    html += `
      <div onclick="universalMenuGoShortcut('${item.id}')" style="
      background:rgba(255,255,255,0.82);
      padding:16px 16px;
      border-radius:20px;
      font-size:18px;
      font-weight:800;
      color:#111;
      margin-bottom:12px;
      box-shadow:0 8px 18px rgba(0,0,0,0.08);
      cursor:pointer;
      border:1px solid rgba(255,255,255,0.55);
      display:flex;
      align-items:center;
      gap:12px;
      ">
        <span style="font-size:24px;line-height:1;">${item.title.split(" ")[0]}</span>
        <span style="display:flex;align-items:center;line-height:1;">
          ${item.title.replace(/^\S+\s*/, "")}
        </span>
      </div>
    `;

  });

  return html;

}

// =========================
// BUILD UNIVERSAL SHORTCUT PICKER OVERLAY
// Full function name: buildUniversalShortcutPickerOverlay()
// =========================
function buildUniversalShortcutPickerOverlay(){

  let overlay = document.createElement("div");
  overlay.id = "universalShortcutOverlay";
  overlay.onclick = function(event){
    if(event.target && event.target.id === "universalShortcutOverlay"){
      universalMenuCloseShortcutPicker();
    }
  };

  overlay.style.cssText = `
    display:none;
    position:fixed;
    inset:0;
    width:100%;
    height:100%;
    background:rgba(0,0,0,0.28);
    backdrop-filter:blur(6px);
    -webkit-backdrop-filter:blur(6px);
    z-index:13000;
    align-items:center;
    justify-content:center;
    padding:0 5%;
    box-sizing:border-box;
  `;

  let choices = getUniversalShortcutChoices();
  let savedShortcuts = getUniversalSavedShortcuts();

  let rows = choices.map(function(item){

    let isAdded = savedShortcuts.includes(item.id);
    let actionText = isAdded ? "Remove" : "Add";
    let actionBg = isAdded ? "#fff1f1" : "#edf8ef";
    let actionColor = isAdded ? "#d11a2a" : "#166534";

    return `
      <button onclick="universalMenuToggleShortcut('${item.id}')" style="
      width:100%;
      border:none;
      background:#f7f7fa;
      color:#111;
      padding:9px 10px;
      border-radius:14px;
      font-size:15px;
      font-weight:850;
      text-align:left;
      cursor:pointer;
      margin-bottom:7px;
      font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display','Segoe UI',Arial,sans-serif;
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:8px;
      ">
        <span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${item.title}</span>
        <span style="
        flex-shrink:0;
        background:${actionBg};
        color:${actionColor};
        border-radius:999px;
        padding:6px 9px;
        font-size:12px;
        font-weight:950;
        ">
          ${actionText}
        </span>
      </button>
    `;

  }).join("");

  overlay.innerHTML = `
    <div onclick="event.stopPropagation();" style="
    width:82%;
    max-width:320px;
    background:rgba(255,255,255,0.98);
    border-radius:24px;
    padding:14px 14px 12px 14px;
    box-shadow:0 18px 44px rgba(0,0,0,0.22);
    border:1px solid rgba(255,255,255,0.75);
    box-sizing:border-box;
    ">
      <div style="
      font-size:18px;
      font-weight:950;
      color:#111;
      text-align:center;
      margin-bottom:10px;
      ">Add Shortcut</div>

      ${rows}

      <button onclick="universalMenuCloseShortcutPicker()" style="
      width:100%;
      border:none;
      background:#e9e9ee;
      color:#111;
      padding:11px 14px;
      border-radius:14px;
      font-size:16px;
      font-weight:850;
      cursor:pointer;
      font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display','Segoe UI',Arial,sans-serif;
      ">Close</button>
    </div>
  `;

  return overlay;

}

// =========================
// OPEN UNIVERSAL SHORTCUT PICKER
// Full function name: universalMenuOpenShortcutPicker()
// =========================
function universalMenuOpenShortcutPicker(){

  let overlay = document.getElementById("universalShortcutOverlay");
  if(overlay){
    overlay.style.display = "flex";
  }

}

// =========================
// CLOSE UNIVERSAL SHORTCUT PICKER
// Full function name: universalMenuCloseShortcutPicker()
// =========================
function universalMenuCloseShortcutPicker(){

  let overlay = document.getElementById("universalShortcutOverlay");
  if(overlay){
    overlay.style.display = "none";
  }

}

// =========================
// TOGGLE UNIVERSAL MENU SHORTCUT
// Full function name: universalMenuToggleShortcut(shortcutId)
// =========================
function universalMenuToggleShortcut(shortcutId){

  let savedShortcuts = getUniversalSavedShortcuts();

  if(savedShortcuts.includes(shortcutId)){
    universalMenuRemoveShortcut(shortcutId);
  }else{
    universalMenuAddShortcut(shortcutId);
  }

}

// =========================
// ADD UNIVERSAL MENU SHORTCUT
// Full function name: universalMenuAddShortcut(shortcutId)
// =========================
function universalMenuAddShortcut(shortcutId){

  let choices = getUniversalShortcutChoices();
  let existsInChoices = choices.some(function(item){
    return item.id === shortcutId;
  });

  if(!existsInChoices) return;

  let savedShortcuts = getUniversalSavedShortcuts();

  if(!savedShortcuts.includes(shortcutId)){
    savedShortcuts.push(shortcutId);
    setUniversalSavedShortcuts(savedShortcuts);
  }

  universalMenuCloseShortcutPicker();
  createUniversalMenuHandle(universalMenuLastOptions);
  openUniversalSideMenu();

}

// =========================
// REMOVE UNIVERSAL MENU SHORTCUT
// Full function name: universalMenuRemoveShortcut(shortcutId)
// =========================
function universalMenuRemoveShortcut(shortcutId){

  let savedShortcuts = getUniversalSavedShortcuts().filter(function(item){
    return item !== shortcutId;
  });

  setUniversalSavedShortcuts(savedShortcuts);

  universalMenuCloseShortcutPicker();
  createUniversalMenuHandle(universalMenuLastOptions);
  openUniversalSideMenu();

}

// =========================
// GO TO UNIVERSAL MENU SHORTCUT
// Full function name: universalMenuGoShortcut(shortcutId)
// =========================
function universalMenuGoShortcut(shortcutId){

  let choices = getUniversalShortcutChoices();
  let item = choices.find(function(choice){
    return choice.id === shortcutId;
  });

  if(!item) return;

  closeUniversalSideMenu();

  window.location.href = getUniversalBasePath() + item.path;

}

// =========================
// OPEN UNIVERSAL SIDE MENU
// Full function name: openUniversalSideMenu()
// =========================
function openUniversalSideMenu(){

  let overlay = document.getElementById("sideMenuOverlay");
  let menu = document.getElementById("sideMenu");

  if(overlay) overlay.style.display = "block";
  if(menu) menu.style.left = "0";

  universalSideMenuOpen = true;

}

// =========================
// CLOSE UNIVERSAL SIDE MENU
// Full function name: closeUniversalSideMenu()
// =========================
function closeUniversalSideMenu(){

  let overlay = document.getElementById("sideMenuOverlay");
  let menu = document.getElementById("sideMenu");

  if(overlay) overlay.style.display = "none";
  if(menu) menu.style.left = "-280px";

  universalSideMenuOpen = false;

}

// =========================
// TOGGLE UNIVERSAL SIDE MENU
// Full function name: toggleUniversalSideMenu()
// =========================
function toggleUniversalSideMenu(){

  if(universalSideMenuOpen){
    closeUniversalSideMenu();
  }else{
    openUniversalSideMenu();
  }

}

// =========================
// OLD FUNCTION NAME SUPPORT
// Full function name: toggleSideMenu()
// =========================
function toggleSideMenu(){

  toggleUniversalSideMenu();

}

// =========================
// OLD FUNCTION NAME SUPPORT
// Full function name: closeSideMenu()
// =========================
function closeSideMenu(){

  closeUniversalSideMenu();

}

// =========================
// OLD FUNCTION NAME SUPPORT
// Full function name: openSideMenu()
// =========================
function openSideMenu(){

  openUniversalSideMenu();

}

// =========================
// SET MAIN MENU HANDLE VISIBILITY
// Full function name: setMainMenuHandleVisibility()
// =========================
function setMainMenuHandleVisibility(show){

  let handle = document.getElementById("menuHandle");
  if(!handle) return;

  handle.style.display = show ? "flex" : "none";

}

// =========================
// GET UNIVERSAL BASE PATH
// Full function name: getUniversalBasePath()
// =========================
function getUniversalBasePath(){

  if(window.location.pathname.includes("/test-ibadah-tracker/")){
    return "/test-ibadah-tracker/";
  }

  if(window.location.pathname.includes("/ibadah-tracker/")){
    return "/ibadah-tracker/";
  }

  return "./";

}

// =========================
// GET UNIVERSAL CURRENT PAGE NAME
// Full function name: getUniversalCurrentPageName()
// =========================
function getUniversalCurrentPageName(){

  let path = window.location.pathname.toLowerCase();

  if(path.includes("/home/")) return "home";
  if(path.includes("/tracker/")) return "tracker";
  if(path.includes("/salah/")) return "salah";
  if(path.includes("/more/")) return "more";
  if(path.includes("/quran/")) return "quran";
  if(path.includes("/tasbih/")) return "tasbih";
  if(path.includes("/qazatracker/")) return "qaza";
  if(path.includes("/duapage/")) return "dua";
  if(path.includes("/dailyazkar/")) return "dailyazkar";
  if(path.includes("/qibla/")) return "qibla";
  if(path.includes("/books/")) return "books";
  if(path.includes("/appsettings/")) return "appsettings";

  return "home";

}

// =========================
// MENU ACTION: MAIN PAGE
// Full function name: universalMenuGoMainPage()
// =========================
function universalMenuGoMainPage(){

  closeUniversalSideMenu();

  localStorage.setItem("ibadahFolderReturnPage", "home");
  window.location.href = getUniversalBasePath();

}

// =========================
// MENU ACTION: REFRESH APP
// Full function name: universalMenuRefreshApp()
// =========================
function universalMenuRefreshApp(){

  closeUniversalSideMenu();

  window.location.href = window.location.pathname + "?v=" + Date.now();

}

// =========================
// MENU ACTION: APP SETTINGS
// Full function name: universalMenuOpenAppSettings()
// =========================
function universalMenuOpenAppSettings(){

  closeUniversalSideMenu();

  let currentPage = getUniversalCurrentPageName();

  if(currentPage === "appsettings"){
    currentPage = "more";
  }

  localStorage.setItem("appSettingsReturnPage", currentPage);

  window.location.href = getUniversalBasePath() + "appsettings/?from=" + currentPage + "&v=" + Date.now();

}

// =========================
// LOAD CLOUD SYNC FILE
// Full function name: universalMenuLoadCloudSyncFile()
// =========================
function universalMenuLoadCloudSyncFile(){

  if(universalCloudFileStarted){
    return;
  }

  universalCloudFileStarted = true;

  let oldScript = document.querySelector('script[data-ibadah-cloud-sync="yes"]');
  if(oldScript){
    return;
  }

  let script = document.createElement("script");
  script.type = "module";
  script.src = getUniversalBasePath() + "shared/cloud-sync.js?v=" + Date.now();
  script.setAttribute("data-ibadah-cloud-sync", "yes");

  script.onerror = function(){
    universalMenuUpdateCloudStatus("Cloud file not found yet. Next step is shared/cloud-sync.js.");
  };

  document.head.appendChild(script);

}

// =========================
// WAIT FOR CLOUD FILE
// Full function name: universalMenuWaitForCloudFile()
// =========================
function universalMenuWaitForCloudFile(){

  let tries = 0;

  let timer = setInterval(function(){

    tries++;

    universalMenuUpdateCloudStatus();

    if(window.ibadahCloud){
      clearInterval(timer);
      universalMenuUpdateCloudStatus();
      return;
    }

    if(tries > 40){
      clearInterval(timer);
      universalMenuUpdateCloudStatus("Cloud file not ready. We still need shared/cloud-sync.js.");
    }

  }, 250);

}

// =========================
// OPEN CLOUD MENU
// Full function name: universalMenuOpenCloudMenu()
// =========================
function universalMenuOpenCloudMenu(){

  closeUniversalSideMenu();

  let cloudOverlay = document.getElementById("universalCloudOverlay");
  if(cloudOverlay){
    cloudOverlay.style.display = "flex";
  }

  universalCloudMenuOpen = true;

  universalMenuUpdateCloudStatus();

}

// =========================
// CLOSE CLOUD MENU
// Full function name: universalMenuCloseCloudMenu()
// =========================
function universalMenuCloseCloudMenu(){

  let cloudOverlay = document.getElementById("universalCloudOverlay");
  if(cloudOverlay){
    cloudOverlay.style.display = "none";
  }

  universalCloudMenuOpen = false;

}

// =========================
// TOGGLE CLOUD MENU
// Full function name: universalMenuToggleCloudMenu()
// =========================
function universalMenuToggleCloudMenu(){

  if(universalCloudMenuOpen){
    universalMenuCloseCloudMenu();
  }else{
    universalMenuOpenCloudMenu();
  }

}

// =========================
// UPDATE CLOUD STATUS
// Full function name: universalMenuUpdateCloudStatus()
// =========================
function universalMenuUpdateCloudStatus(customMessage){

  let line = document.getElementById("universalCloudStatusLine");
  if(!line) return;

  if(customMessage){
    line.innerText = customMessage;
    line.style.color = "#9a3412";
    return;
  }

  if(!window.ibadahCloud){
    line.innerText = "Cloud: File not loaded yet.";
    line.style.color = "#9a3412";
    return;
  }

  let user = null;

  try{
    if(window.ibadahCloud.getCurrentUser){
      user = window.ibadahCloud.getCurrentUser();
    }
  }catch(error){
    user = null;
  }

  if(user){
    line.innerText = "Cloud: Signed in as " + (user.email || "Google user");
    line.style.color = "#166534";
  }else{
    line.innerText = "Cloud: Not signed in";
    line.style.color = "#9a3412";
  }

}

// =========================
// CLOUD SIGN IN
// Full function name: universalMenuCloudSignIn()
// =========================
async function universalMenuCloudSignIn(){

  try{

    if(!window.ibadahCloud || !window.ibadahCloud.signIn){
      universalMenuUpdateCloudStatus("Cloud file missing. Create shared/cloud-sync.js first.");
      return;
    }

    universalMenuUpdateCloudStatus("Cloud: Opening Google sign-in...");

    await window.ibadahCloud.signIn();

    universalMenuUpdateCloudStatus();

  }catch(error){

    console.log(error);
    universalMenuUpdateCloudStatus("Cloud sign-in failed. Check popup blocker or Firebase setup.");

  }

}

// =========================
// CLOUD SIGN OUT
// Full function name: universalMenuCloudSignOut()
// =========================
async function universalMenuCloudSignOut(){

  try{

    if(!window.ibadahCloud || !window.ibadahCloud.signOut){
      universalMenuUpdateCloudStatus("Cloud file missing. Create shared/cloud-sync.js first.");
      return;
    }

    await window.ibadahCloud.signOut();

    universalMenuUpdateCloudStatus("Cloud: Signed out. Local app data is still saved.");

  }catch(error){

    console.log(error);
    universalMenuUpdateCloudStatus("Cloud sign-out failed.");

  }

}

// =========================
// CLOUD SAVE CURRENT PAGE
// Full function name: universalMenuCloudSave()
// =========================
async function universalMenuCloudSave(){

  try{

    if(!window.ibadahCloud){
      universalMenuUpdateCloudStatus("Cloud file missing. Create shared/cloud-sync.js first.");
      return;
    }

    if(window.ibadahCloud.waitForAuthReady){
      await window.ibadahCloud.waitForAuthReady();
    }

    if(!window.ibadahCloud.getCurrentUser || !window.ibadahCloud.getCurrentUser()){
      universalMenuUpdateCloudStatus("Please sign in first.");
      return;
    }

    if(typeof window.ibadahCloudSaveCurrentPage === "function"){
      await window.ibadahCloudSaveCurrentPage();
      universalMenuUpdateCloudStatus();
      return;
    }

    let currentPage = getUniversalCurrentPageName();

    if(currentPage === "qaza" && typeof window.saveQazaToCloud === "function"){
      await window.saveQazaToCloud();
      universalMenuUpdateCloudStatus();
      return;
    }

    if(currentPage === "tracker" && typeof window.saveTrackerToCloud === "function"){
      await window.saveTrackerToCloud();
      universalMenuUpdateCloudStatus();
      return;
    }

    universalMenuUpdateCloudStatus("This page is not connected to cloud save yet.");

  }catch(error){

    console.log(error);
    universalMenuUpdateCloudStatus("Cloud save failed.");

  }

}

// =========================
// CLOUD LOAD CURRENT PAGE
// Full function name: universalMenuCloudLoad()
// =========================
async function universalMenuCloudLoad(){

  try{

    if(!window.ibadahCloud){
      universalMenuUpdateCloudStatus("Cloud file missing. Create shared/cloud-sync.js first.");
      return;
    }

    if(window.ibadahCloud.waitForAuthReady){
      await window.ibadahCloud.waitForAuthReady();
    }

    if(!window.ibadahCloud.getCurrentUser || !window.ibadahCloud.getCurrentUser()){
      universalMenuUpdateCloudStatus("Please sign in first.");
      return;
    }

    if(typeof window.ibadahCloudLoadCurrentPage === "function"){
      await window.ibadahCloudLoadCurrentPage();
      universalMenuUpdateCloudStatus();
      return;
    }

    let currentPage = getUniversalCurrentPageName();

    if(currentPage === "qaza" && typeof window.loadQazaFromCloud === "function"){
      await window.loadQazaFromCloud();
      universalMenuUpdateCloudStatus();
      return;
    }

    if(currentPage === "tracker" && typeof window.loadTrackerFromCloud === "function"){
      await window.loadTrackerFromCloud();
      universalMenuUpdateCloudStatus();
      return;
    }

    universalMenuUpdateCloudStatus("This page is not connected to cloud load yet.");

  }catch(error){

    console.log(error);
    universalMenuUpdateCloudStatus("Cloud load failed.");

  }

}

// =========================
// CLOUD USER CHANGE LISTENER
// Full listener name: ibadahCloudUserChanged
// =========================
window.addEventListener("ibadahCloudUserChanged", function(){
  universalMenuUpdateCloudStatus();
});
