const HISTORY_KEY = 'kyydevv_deploy_history';

export const history = {
  getAll: () => {
    try {
      const data = localStorage.getItem(HISTORY_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  add: (item) => {
    try {
      const current = history.getAll();
      const newItem = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        ...item
      };
      const updated = [newItem, ...current].slice(0, 30); // keep last 30
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('History add error', e);
      return [];
    }
  },
  clear: () => {
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch (e) {
      console.error('History clear error', e);
    }
  }
};
