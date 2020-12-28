import React, { useRef } from 'react';

import { animate } from '../utils/animate-style-property';

import Block from './block';

type Props = {
  items: number[],
  currentSelected: number,
  setSelectedColumn: Function,
  index: number,
  handleMouseOver: Function
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

const Col = ({ items, currentSelected, setSelectedColumn, index, handleMouseOver }: Props) => {
  const colRef = useRef(null);

  const onClick = () => {
    if(currentSelected === null) {
      const animation = animateBlockUp(colRef.current);
      setSelectedColumn(index, animation);
      return;
    }

    if(currentSelected === index) {
      const animation = animateBlockDown(colRef.current);
      setSelectedColumn(index, animation);
      return;
    }

    const animation = animateBlockDown(colRef.current);
    setSelectedColumn(index, animation);
    return;
  }

  return (
    <div
      className="col block-group"
      onClick={onClick}
      ref={colRef}
      onMouseEnter={() => handleMouseOver(index)}
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
