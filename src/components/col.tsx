import React, { useRef } from 'react';

import { animate } from '../utils/animate-style-property';

import Block from './block';

type Props = {
  items: number[],
  currentSelected: number,
  setSelectedColumn: (index: number, animation: () => Promise<void>) => boolean,
  index: number,
  handleMouseOver: (index: number) => void
}

type PreloadedAnimation = () => Promise<void>;

const animateBlockUp = (column: HTMLElement): PreloadedAnimation => () => {
  const firstBlock: HTMLElement = column.querySelector('.block:first-child');
  if(!firstBlock) return;

  const computedVal = (-firstBlock.offsetTop - firstBlock.offsetHeight - 2) + 'px';

  return animate(firstBlock, 'top', computedVal);
  // firstBlock.style.top = (-firstBlock.offsetTop - firstBlock.offsetHeight - 2) + "px";
};

const animateBlockDown = (column): PreloadedAnimation => () => {
  const firstBlock: HTMLElement = column.querySelector('.block:first-child');
  const firstBlockRect = firstBlock?.getBoundingClientRect();

  const activeBlock: HTMLElement = document.querySelector('.active-block');
  const activeBlockRect = activeBlock?.getBoundingClientRect();

  if(!firstBlock) {
    const columnBlockRect = column?.getBoundingClientRect();
    const computedVal = ((columnBlockRect.y + column.offsetHeight) - activeBlockRect.y - activeBlock.clientHeight - 2) + 'px';

    return animate(activeBlock, 'top', computedVal);
  } else {
    const computedVal = (firstBlockRect.y - activeBlockRect.y - activeBlock.clientHeight - 2) + 'px';
    return animate(activeBlock, 'top', computedVal);
  }
};

const applyActiveShake = () => {
  const activeBlock: HTMLElement = document.querySelector('.active-block');

  activeBlock.classList.add('shake-animation');
  setTimeout(() => activeBlock.classList.remove('shake-animation'), 500);
};

const Col = ({ items, currentSelected, setSelectedColumn, index, handleMouseOver }: Props) => {
  const colRef = useRef(null);

  const onClick = () => {
    handleMouseOver(index);

    const animation = currentSelected === null ?
      animateBlockUp(colRef.current) :
      animateBlockDown(colRef.current);

    const result = setSelectedColumn(index, animation);
    if(!result) {
      applyActiveShake();
    }
    return;
  }

  return (
    <div
      className="col block-group"
      onClick={onClick}
      ref={colRef}
      onMouseMove={() => handleMouseOver(index)}
    >
        {
          items
            .slice(currentSelected === index ? 1 : 0)
            .map((item) => <Block size={item} key={item} />)
        }
    </div>
  );
};

export default Col;
