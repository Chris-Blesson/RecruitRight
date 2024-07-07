export const entityIdGenerator = (entityName: string) => {
  const randomValue = "f0a";
  const currentTimeEpoch = Date.now();
  return `${entityName}_${randomValue}_${currentTimeEpoch}`;
};
