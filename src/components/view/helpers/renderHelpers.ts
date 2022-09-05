export const createElement = (tag: string, className?: string, text?: string, id?: string, disabled?: boolean) => {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text) el.innerText = text;
  if (id) el.id = id;
  if (disabled) el.setAttribute('disabled', '');
  return el;
};
