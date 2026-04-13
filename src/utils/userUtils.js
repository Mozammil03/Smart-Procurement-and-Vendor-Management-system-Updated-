export function getUserDisplayName() {
  const explicitName =
    localStorage.getItem("displayName") ||
    localStorage.getItem("username") ||
    localStorage.getItem("userName") ||
    localStorage.getItem("name") ||
    localStorage.getItem("firstName") ||
    localStorage.getItem("lastName") ||
    localStorage.getItem("email");

  if (explicitName) {
    const trimmed = explicitName.trim();
    if (/^\d+$/.test(trimmed) || /^User\s*\d+$/i.test(trimmed)) {
      // Avoid displaying raw numeric IDs or fallback user IDs.
    } else if (trimmed.includes("@")) {
      return trimmed.split("@")[0];
    } else {
      return trimmed;
    }
  }

  const role = localStorage.getItem("role")?.toLowerCase();
  if (role) {
    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  }

  return "User";
}

export function getUserAvatarInitial(name) {
  return (name?.trim()?.charAt(0)?.toUpperCase() || "U");
}
