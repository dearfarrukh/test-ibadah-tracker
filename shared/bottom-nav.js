// =========================
// UNIVERSAL BOTTOM NAV
// File: shared/bottom-nav.js
// Full function names:
// createUniversalBottomNav()
// goUniversalBottomHome()
// goUniversalBottomSalah()
// goUniversalBottomTracker()
// goUniversalBottomMore()
// =========================

function createUniversalBottomNav(activePage){

  let oldNav = document.getElementById("universalBottomNav");
  if(oldNav){
    oldNav.remove();
  }

  let nav = document.createElement("div");
  nav.id = "universalBottomNav";

  nav.style.position = "fixed";
  nav.style.left = "0";
  nav.style.right = "0";
  nav.style.bottom = "0";
  nav.style.height = "86px";
  nav.style.padding = "8px 3%";
  nav.style.background = "rgba(255,255,255,0.94)";
  nav.style.backdropFilter = "blur(22px)";
  nav.style.webkitBackdropFilter = "blur(22px)";
  nav.style.borderTop = "1px solid rgba(0,0,0,0.08)";
  nav.style.display = "flex";
  nav.style.alignItems = "center";
  nav.style.justifyContent = "space-around";
  nav.style.zIndex = "99999";
  nav.style.boxShadow = "0 -8px 24px rgba(0,0,0,0.08)";
  nav.style.boxSizing = "border-box";

  nav.innerHTML = `
    ${buildUniversalBottomNavItem({
      key:"home",
      label:"Home",
      icon:"../Images/Icons/Home1.png",
      activePage:activePage,
      onclick:"goUniversalBottomHome()"
    })}

    ${buildUniversalBottomNavItem({
      key:"salah",
      label:"Salah",
      icon:"../Images/Icons/Salah.png",
      activePage:activePage,
      onclick:"goUniversalBottomSalah()"
    })}

    ${buildUniversalBottomNavItem({
      key:"tracker",
      label:"Tracker",
      icon:"../Images/Icons/Tracker.png",
      activePage:activePage,
      onclick:"goUniversalBottomTracker()"
    })}

    ${buildUniversalBottomNavItem({
      key:"more",
      label:"More",
      icon:"../Images/Icons/More.png",
      activePage:activePage,
      onclick:"goUniversalBottomMore()"
    })}
  `;

  document.body.appendChild(nav);

  document.body.style.paddingBottom = "calc(86px + env(safe-area-inset-bottom, 0px))";
}

// =========================
// BUILD UNIVERSAL BOTTOM NAV ITEM
// =========================
function buildUniversalBottomNavItem(item){

  let isActive = item.key === item.activePage;

  if(isActive){
    return `
      <div onclick="${item.onclick}" style="
      flex:1;
      display:flex;
      flex-direction:column;
      align-items:center;
      justify-content:center;
      gap:3px;
      cursor:pointer;
      ">
        <div style="
        width:54px;
        height:54px;
        border-radius:22px;
        background:#e9e9ee;
        display:flex;
        align-items:center;
        justify-content:center;
        box-shadow:inset 0 0 0 1px rgba(0,0,0,0.05);
        flex-shrink:0;
        ">
          <img src="${item.icon}" style="
          width:48px;
          height:48px;
          object-fit:contain;
          display:block;
          ">
        </div>
        <div style="
        font-size:11px;
        font-weight:900;
        color:#111;
        line-height:1;
        ">
          ${item.label}
        </div>
      </div>
    `;
  }

  return `
    <div onclick="${item.onclick}" style="
    flex:1;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    gap:3px;
    cursor:pointer;
    ">
      <img src="${item.icon}" style="
      width:42px;
      height:42px;
      object-fit:contain;
      display:block;
      opacity:0.72;
      flex-shrink:0;
      ">
      <div style="
      font-size:11px;
      font-weight:800;
      color:#666;
      line-height:1;
      ">
        ${item.label}
      </div>
    </div>
  `;
}

// =========================
// GO UNIVERSAL BOTTOM HOME
// =========================
function goUniversalBottomHome(){
  window.location.href = "../home/";
}

// =========================
// GO UNIVERSAL BOTTOM SALAH
// =========================
function goUniversalBottomSalah(){
  window.location.href = "../salah/";
}

// =========================
// GO UNIVERSAL BOTTOM TRACKER
// =========================
function goUniversalBottomTracker(){
  window.location.href = "../tracker/";
}

// =========================
// GO UNIVERSAL BOTTOM MORE
// =========================
function goUniversalBottomMore(){
  window.location.href = "../more/";
}
