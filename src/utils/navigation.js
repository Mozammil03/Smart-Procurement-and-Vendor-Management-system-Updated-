let globalNavigate = null;

export function setGlobalNavigate(navigate) {
  globalNavigate = navigate;
}

export function navigateTo(path, options = { replace: true }) {
  if (typeof globalNavigate === "function") {
    return globalNavigate(path, options);
  }

  if (typeof window !== "undefined") {
    window.location.href = path;
  }
}
