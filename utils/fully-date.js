export function fullyDate() {
  const d = new Date();
  const date = String(d.getDate());
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
  return `${days[d.getDay()]}-${date.length < 2 ? `0${date}` : date}-${months[d.getMonth()]}-${d.getFullYear()}`
};
