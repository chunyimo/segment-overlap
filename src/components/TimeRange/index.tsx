import React, {
  ReactNode,
  RefObject,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import './index.css';
export interface ITimeRangeProps {
  timeTrackListContainerRef: RefObject<HTMLDivElement>;
  timeTrackRef: RefObject<HTMLDivElement>;
  duration?: number;
  start?: number;
  end?: number;
  children?: ReactNode;
}

const PREFIX = 'TimeRange';
const TimeRange: React.FC<ITimeRangeProps> = (props) => {
  const { start = 0, timeTrackRef, timeTrackListContainerRef } = props;
  const timeRangeRef = useRef<HTMLDivElement>(null);
  const leftResizeRef = useRef<HTMLDivElement>(null);
  const rightResizeRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let down = false;
    let moveWidth = 0,
      offsetX = 0;
    const timeRangeItem = timeRangeRef.current;
    const timeTrackListContainer = timeTrackListContainerRef.current;
    if (timeRangeItem && timeTrackListContainer) {
      const timeTrackListContainerRect = timeTrackListContainer.getBoundingClientRect();
      timeTrackListContainer.addEventListener('mousemove', function (e) {
        const relativeX = e.pageX - timeTrackListContainerRect.x;
        if (down) {
          let left = relativeX - offsetX;
          console.info('left: ', left);
          left =
            left < 0
              ? 0
              : left <= timeTrackListContainerRect.width - moveWidth
              ? left
              : timeTrackListContainerRect.width - moveWidth;
          if (0 <= left && left <= timeTrackListContainerRect.width) {
            timeRangeItem.style.left = left + 'px';
          }
        }
      });
      timeRangeItem.addEventListener('mousedown', function (e) {
        offsetX = e.offsetX;
        moveWidth = timeRangeItem.getBoundingClientRect().width;
        if (!down) {
          down = true;
        }
      });
      document.addEventListener('mouseup', function () {
        if (down) {
          down = false;
        }
      });
    }
  }, []);
  const resize = useCallback((side: 'left' | 'right', clientX: number) => {
    let divWidth = timeRangeRef.current?.getBoundingClientRect().width;
    let divLeft = timeRangeRef.current?.offsetLeft;

    return (e: any) => {
      const timeTrackListContainer = timeTrackListContainerRef.current;
      if (timeRangeRef.current && timeTrackListContainer) {
        const mouseDiffx = e.clientX - clientX;

        let newDivWidth;

        let newDivLeft;
        if (side === 'left') {
          console.info('mouseDiffx: ', mouseDiffx);
          // @ts-ignore
          if (divWidth >= 20) {
            // @ts-ignore
            newDivLeft = divLeft + mouseDiffx;
          }
          // @ts-ignore
          if (newDivLeft >= 0) {
            // @ts-ignore
            newDivWidth = divWidth - mouseDiffx;
            if (newDivWidth < 20) {
              newDivWidth = 20;
            }
          }
        } else {
          console.info('mouseDiffx: ', mouseDiffx);
          // @ts-ignore
          newDivWidth = divWidth + mouseDiffx;
          newDivLeft = divLeft;
        }
        console.log('new left: ', newDivLeft);
        if (
          // @ts-ignore
          newDivLeft + newDivWidth >
          timeTrackListContainer.getBoundingClientRect().width
        ) {
          newDivWidth =
            // @ts-ignore
            timeTrackListContainer.getBoundingClientRect().width - newDivLeft;
        }
        // @ts-ignore
        if (newDivLeft < 0) {
          newDivLeft = 0;
        }
        // @ts-ignore
        timeRangeRef.current.style.width = Math.ceil(newDivWidth) + 'px';
        // @ts-ignore
        timeRangeRef.current.style.left = Math.ceil(newDivLeft) + 'px';
      }
    };
  }, []);
  useEffect(() => {
    const leftResize = leftResizeRef.current;
    const rightResize = rightResizeRef.current;
    const timeTrackListContainer = timeTrackListContainerRef.current;

    if (leftResize && timeTrackListContainer && rightResize) {
      leftResize.addEventListener('mousedown', function (e) {
        e.stopPropagation();
        const clientX = e.clientX;
        const leftRisizeHandler = resize('left', clientX);
        timeTrackListContainer.addEventListener('mousemove', leftRisizeHandler);
        document.addEventListener('mouseup', function () {
          timeTrackListContainer?.removeEventListener(
            'mousemove',
            leftRisizeHandler
          );
        });
      });
      rightResize.addEventListener('mousedown', function (e) {
        e.stopPropagation();
        const clientX = e.clientX;
        const rightRisizeHandler = resize('right', clientX);
        timeTrackListContainer.addEventListener(
          'mousemove',
          rightRisizeHandler
        );
        document.addEventListener('mouseup', function () {
          timeTrackListContainer?.removeEventListener(
            'mousemove',
            rightRisizeHandler
          );
        });
      });
    }
  }, []);
  return (
    <div style={{ left: start }} ref={timeRangeRef} className={PREFIX}>
      <div ref={leftResizeRef} className="leftResize"></div>
      <div ref={rightResizeRef} className="rightResize"></div>
    </div>
  );
};
export default React.memo(TimeRange);
