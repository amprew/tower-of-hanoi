export const animate = (el: HTMLElement, property: string, value: string) => new Promise<void>((resolve, reject) => {
  if(!el) return reject(new Error('Cannot find element'));

  if(el.style[property] === value) return resolve();

  let fallbackTimer: number;
  const cleanup = () => {
    el.removeEventListener('transitionend', listenToEnd);
    el.removeEventListener('transitioncancel', listenToEnd);
    window.clearTimeout(fallbackTimer);
  };
  const listenToEnd = (event: TransitionEvent) => {
    if(event.target !== el || event.propertyName !== property) return;
    cleanup();
    resolve();
  };

  el.addEventListener('transitionend', listenToEnd);
  el.addEventListener('transitioncancel', listenToEnd);
  fallbackTimer = window.setTimeout(() => {
    cleanup();
    resolve();
  }, 300);

  el.style[property] = value;
});
