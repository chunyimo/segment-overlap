import React, { ReactNode, useEffect, useRef } from "react";
import "./index.css";
export interface ITimeRangeProps {
  duration?: number;
  start?: number;
  end?: number;
  children?: ReactNode;
}

const PREFIX = "TimeRange";
const TimeRange: React.FC<ITimeRangeProps> = (props) => {
  const timeRangeRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let down = false;
    let dx = 0,
      sx = 0;
    const timeRangeItem = timeRangeRef.current;
    if (timeRangeItem) {
      timeRangeItem.addEventListener("mousemove", function (e) {
        console.info("mouse move");
        if (true || down) {
          timeRangeItem.style.left = e.clientX - (dx - sx) + "px";
        }
      });
      timeRangeItem.addEventListener("mousedown", function (e) {
        console.info("mouse down");
        dx = e.clientX;
        sx = parseInt(timeRangeItem.style.left);
        if (!down) {
          down = true;
        }
      });
      timeRangeItem.addEventListener("mouseup", function () {
        if (down) {
          down = false;
        }
      });
    }
  }, []);
  return <div ref={timeRangeRef} className={PREFIX}></div>;
};
export default React.memo(TimeRange);
