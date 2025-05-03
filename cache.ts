import NodeCache from 'node-cache';
export const cache = new NodeCache({ stdTTL: 100 });

export const getCached = (key: string, fallback: () => Promise<any>) => {
  const value = cache.get(key);
  if (value) return Promise.resolve(value);

  return fallback().then((data) => {
    cache.set(key, data);
    return data;
  });
};
