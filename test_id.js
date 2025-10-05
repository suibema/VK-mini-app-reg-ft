function getLaunchParams() {
  const params = {};

  // Читаем query (?vk_user_id=...)
  const query = new URLSearchParams(window.location.search);
  for (const [key, value] of query.entries()) {
    params[key] = value;
  }

  // Читаем hash (#vk_user_id=...&start_param=...)
  if (window.location.hash) {
    const hash = new URLSearchParams(window.location.hash.slice(1));
    for (const [key, value] of hash.entries()) {
      params[key] = value;
    }
  }

  return params;
}

// пример использования
const launchParams = getLaunchParams();
const startParam = launchParams['start_param'];
const userId = launchParams['vk_user_id'];

console.log('user_id:', userId);
console.log('start_param:', startParam);
