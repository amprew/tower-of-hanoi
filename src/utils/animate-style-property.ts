function whichTransitionEvent(){
  const el = document.createElement('fakeelement');
  const transitions = {
    'WebkitTransition' :'webkitTransitionEnd',
    'MozTransition'    :'transitionend',
    'MSTransition'     :'msTransitionEnd',
    'OTransition'      :'oTransitionEnd',
    'transition'       :'transitionEnd'
  }

  for(const t in transitions){
    if( el.style[t] !== undefined ){
      return transitions[t];
    }
  }
}

export const animate = (el: HTMLElement, property: string, value: string) => new Promise<void>((resolve, reject) => {
  if(!el) return reject(new Error('Cannot find element'));
  const eventName = whichTransitionEvent();

  if(el.style[property] === value) return resolve();

  const listenToEnd = () => {
    resolve();
    el.removeEventListener(eventName, listenToEnd);
  };

  el.addEventListener(eventName, listenToEnd);

  el.style[property] = value;
});
