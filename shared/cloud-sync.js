// =========================
// IBADAH CLOUD SYNC
// File: test-ibadah-tracker/shared/cloud-sync.js
// Full function names:
// ibadahWaitForAuthReady()
// ibadahSignInWithGoogle()
// ibadahSignOut()
// ibadahGetCurrentUser()
// ibadahSaveAppData()
// ibadahLoadAppData()
// ibadahLoadAppDocument()
// =========================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

// =========================
// FIREBASE CONFIG
// Same Firebase project for now.
// Each signed-in user still saves under their own UID.
// Path:
// users / user.uid / apps / appName
// =========================
const firebaseConfig = {
  apiKey: "AIzaSyCyN0YMYoe8MYKnFXSGLSt6SObAGWr1pQM",
  authDomain: "smart-tools-sync.firebaseapp.com",
  projectId: "smart-tools-sync",
  storageBucket: "smart-tools-sync.firebasestorage.app",
  messagingSenderId: "162182388613",
  appId: "1:162182388613:web:d060a6360772907d6042ec"
};

// =========================
// INITIALIZE FIREBASE
// =========================
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

let currentIbadahUser = null;
let ibadahAuthReady = false;
let ibadahAuthReadyResolvers = [];

// =========================
// MARK AUTH READY
// Full function name: markIbadahAuthReady()
// =========================
function markIbadahAuthReady(){

  ibadahAuthReady = true;

  ibadahAuthReadyResolvers.forEach(function(resolve){
    resolve(currentIbadahUser);
  });

  ibadahAuthReadyResolvers = [];

}

// =========================
// WAIT UNTIL FIREBASE AUTH IS READY
// Full function name: ibadahWaitForAuthReady()
// =========================
function ibadahWaitForAuthReady(){

  if(ibadahAuthReady){
    return Promise.resolve(currentIbadahUser);
  }

  return new Promise(function(resolve){
    ibadahAuthReadyResolvers.push(resolve);
  });

}

// =========================
// WATCH LOGIN STATE
// Full listener name: onAuthStateChanged()
// =========================
onAuthStateChanged(auth, function(user){

  currentIbadahUser = user || null;

  markIbadahAuthReady();

  window.dispatchEvent(new CustomEvent("ibadahCloudUserChanged", {
    detail:{
      user:currentIbadahUser
    }
  }));

});

// =========================
// SIGN IN WITH GOOGLE
// Full function name: ibadahSignInWithGoogle()
// =========================
async function ibadahSignInWithGoogle(){

  const result = await signInWithPopup(auth, provider);

  currentIbadahUser = result.user;

  window.dispatchEvent(new CustomEvent("ibadahCloudUserChanged", {
    detail:{
      user:currentIbadahUser
    }
  }));

  return result.user;

}

// =========================
// SIGN OUT
// Full function name: ibadahSignOut()
// =========================
async function ibadahSignOut(){

  await signOut(auth);

  currentIbadahUser = null;

  window.dispatchEvent(new CustomEvent("ibadahCloudUserChanged", {
    detail:{
      user:null
    }
  }));

}

// =========================
// GET CURRENT USER
// Full function name: ibadahGetCurrentUser()
// =========================
function ibadahGetCurrentUser(){

  return currentIbadahUser || auth.currentUser || null;

}

// =========================
// SAVE ONE APP DATA
// Full function name: ibadahSaveAppData()
// Example appName:
// ibadahTasks
// qazaTracker
// dailyDhikr
// duaPage
// quranBookmarks
// tasbih
// prayerTracker
// =========================
async function ibadahSaveAppData(appName, data){

  await ibadahWaitForAuthReady();

  const user = auth.currentUser;

  if(!user){
    throw new Error("Please sign in before saving cloud data.");
  }

  const ref = doc(db, "users", user.uid, "apps", appName);

  await setDoc(ref, {
    appName:appName,
    data:data,
    updatedAt:serverTimestamp()
  }, {
    merge:true
  });

  return true;

}

// =========================
// LOAD ONE APP DATA
// Full function name: ibadahLoadAppData()
// =========================
async function ibadahLoadAppData(appName){

  await ibadahWaitForAuthReady();

  const user = auth.currentUser;

  if(!user){
    throw new Error("Please sign in before loading cloud data.");
  }

  const ref = doc(db, "users", user.uid, "apps", appName);
  const snap = await getDoc(ref);

  if(!snap.exists()){
    return null;
  }

  const saved = snap.data();

  return saved.data || null;

}

// =========================
// LOAD ONE APP FULL CLOUD DOCUMENT
// Full function name: ibadahLoadAppDocument()
// Gives data + updatedAt if needed later
// =========================
async function ibadahLoadAppDocument(appName){

  await ibadahWaitForAuthReady();

  const user = auth.currentUser;

  if(!user){
    throw new Error("Please sign in before loading cloud data.");
  }

  const ref = doc(db, "users", user.uid, "apps", appName);
  const snap = await getDoc(ref);

  if(!snap.exists()){
    return null;
  }

  return snap.data();

}

// =========================
// MAKE FUNCTIONS AVAILABLE TO IBADAH HTML PAGES
// Full object name: window.ibadahCloud
// =========================
window.ibadahCloud = {
  signIn:ibadahSignInWithGoogle,
  signOut:ibadahSignOut,
  getCurrentUser:ibadahGetCurrentUser,
  waitForAuthReady:ibadahWaitForAuthReady,
  saveAppData:ibadahSaveAppData,
  loadAppData:ibadahLoadAppData,
  loadAppDocument:ibadahLoadAppDocument
};
