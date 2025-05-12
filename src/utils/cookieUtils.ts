export const getCookie = (name: string): string | null => {
    const cookieArr = document.cookie.split(";");
    for (const cookie of cookieArr) {
      const trimmed = cookie.trim();
      if (trimmed.startsWith(name + "=")) {
        return trimmed.substring(name.length + 1);
      }
    }
    return null;
  };
  