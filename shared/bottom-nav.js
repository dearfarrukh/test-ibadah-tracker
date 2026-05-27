// =========================
// UNIVERSAL BOTTOM NAV
// File: shared/bottom-nav.js
// Full function names:
// createUniversalBottomNav()
// buildUniversalBottomNavItem()
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
  nav.style.width = "100%";

  /*
    iPhone safe-area fix:
    Bar height now grows with safe-area instead of squeezing icons upward.
  */
  nav.style.minHeight = "86px";
  nav.style.height = "calc(76px + env(safe-area-inset-bottom))";
  nav.style.padding = "7px 3% calc(env(safe-area-inset-bottom) + 7px) 3%";

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

  /*
    Give page content enough space above bottom bar.
    This avoids content hiding behind the nav on iPhone.
  */
  document.body.style.paddingBottom = "calc(112px + env(safe-area-inset-bottom))";
}

// =========================
// BUILD UNIVERSAL BOTTOM NAV ITEM
// Full function name: buildUniversalBottomNavItem()
// =========================
function buildUniversalBottomNavItem(item){

  let isActive = item.key === item.activePage;

  if(isActive){
    return `
      <div onclick="${item.onclick}" style="
      flex:1;
      min-width:0;
      height:100%;
      display:flex;
      flex-direction:column;
      align-items:center;
      justify-content:center;
      gap:2px;
      cursor:pointer;
      box-sizing:border-box;
      ">
        <div style="
        width:48px;
        height:48px;
        border-radius:20px;
        background:#e9e9ee;
        display:flex;
        align-items:center;
        justify-content:center;
        box-shadow:inset 0 0 0 1px rgba(0,0,0,0.05);
        flex-shrink:0;
        box-sizing:border-box;
        ">
          <img src="${item.icon}" style="
          width:40px;
          height:40px;
          object-fit:contain;
          display:block;
          flex-shrink:0;
          ">
        </div>

        <div style="
        font-size:10.5px;
        font-weight:900;
        color:#111;
        line-height:1;
        height:12px;
        display:flex;
        align-items:center;
        justify-content:center;
        white-space:nowrap;
        ">
          ${item.label}
        </div>
      </div>
    `;
  }

  return `
    <div onclick="${item.onclick}" style="
    flex:1;
    min-width:0;
    height:100%;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    gap:2px;
    cursor:pointer;
    box-sizing:border-box;
    ">
      <img src="${item.icon}" style="
      width:38px;
      height:38px;
      object-fit:contain;
      display:block;
      opacity:0.72;
      flex-shrink:0;
      ">

      <div style="
      font-size:10.5px;
      font-weight:800;
      color:#666;
      line-height:1;
      height:12px;
      display:flex;
      align-items:center;
      justify-content:center;
      white-space:nowrap;
      ">
        ${item.label}
      </div>
    </div>
  `;
}

// =========================
// GO UNIVERSAL BOTTOM HOME
// Full function name: goUniversalBottomHome()
// =========================
function goUniversalBottomHome(){

  window.location.href = "../home/";

}

// =========================
// GO UNIVERSAL BOTTOM SALAH
// Full function name: goUniversalBottomSalah()
// =========================
function goUniversalBottomSalah(){

  window.location.href = "../salah/";

}

// =========================
// GO UNIVERSAL BOTTOM TRACKER
// Full function name: goUniversalBottomTracker()
// =========================
function goUniversalBottomTracker(){

  window.location.href = "../tracker/";

}

// =========================
// GO UNIVERSAL BOTTOM MORE
// Full function name: goUniversalBottomMore()
// =========================
function goUniversalBottomMore(){

  window.location.href = "../more/";

}
