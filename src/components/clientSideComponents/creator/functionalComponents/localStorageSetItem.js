export default function setLocalStorageItem(key, value) {
  localStorage.setItem(key, value);
  window.dispatchEvent(new Event("localStorageUpdated"));
}
