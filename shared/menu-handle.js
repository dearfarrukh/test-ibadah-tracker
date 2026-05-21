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
// =========================

let universalSideMenuOpen = false;

// =========================
// CREATE UNIVERSAL MENU HANDLE
// Full function name: createUniversalMenuHandle()
// =========================
function createUniversalMenuHandle(options){

  options = options || {};

  let iconBasePath = options.iconBasePath || "Images/Icons/";

  let oldOverlay = document.getElementById("sideMenuOverlay");
  let oldHandle = document.getElementById("menuHandle");
  let oldMenu = document.getElementById("sideMenu");

  if(oldOverlay) oldOverlay.remove();
  if(oldHandle) oldHandle.remove();
  if(oldMenu) oldMenu.remove();

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
    height:100%;
    background:rgba(233,233,238,0.96);
    backdrop-filter:blur(18px);
    -webkit-backdrop-filter:blur(18px);
    box-shadow:10px 0 30px rgba(0,0,0,0.16);
    z-index:9998;
    padding:108px 18px 20px 18px;
    transition:left 0.28s ease;
    box-sizing:border-box;
    border-top-right-radius:28px;
    border-bottom-right-radius:28px;
    border-right:1px solid rgba(255,255,255,0.55);
    overflow:hidden;
  `;

  menu.innerHTML = `
    <div style="
    font-size:24px;
    font-weight:800;
    color:#111;
    margin-bottom:22px;
    letter-spacing:0.2px;
    text-align:center;
    ">
      Menu
    </div>

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
  `;

  document.body.appendChild(overlay);
  document.body.appendChild(handle);
  document.body.appendChild(menu);

}

// =========================
// BUILD UNIVERSAL MENU CARD
// Full function name: buildUniversalMenuCard()
// =========================
function buildUniversalMenuCard(item){

  return `
    <div onclick="${item.onclick}" style="
    background:rgba(255,255,255,0.82);
    padding:16px 18px;
    border-radius:20px;
    font-size:18px;
    font-weight:800;
    color:#111;
    margin-bottom:14px;
    box-shadow:0 8px 18px rgba(0,0,0,0.08);
    cursor:pointer;
    border:1px solid rgba(255,255,255,0.55);
    display:flex;
    align-items:center;
    gap:12px;
    ">
      <img src="${item.icon}" style="
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
