import React, {
  ReactNode,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "./index.css";
import { throttle, debounce, fill } from "lodash";
import { calculateConflict } from "../TimeTrackList/util";
export interface ITimeRangeProps {
  updateTimeRanges: (
    _timeRange: {
      id: string;
      start: number;
      duration: number;
    },
    type: "update" | "add" | "delete"
  ) => void;
  timeRange: { id: string; start: number; duration: number };
  updateConflictRange: any;
  conflictRange: Array<[number, number]>;
  timeTrackListContainerRef: RefObject<HTMLDivElement>;
  timeTrackRef: RefObject<HTMLDivElement>;
  duration?: number;
  start?: number;
  end?: number;
  children?: ReactNode;
  catchHandler: (type: string, payload?: {}) => void;
}

const PREFIX = "TimeRange";
const TimeRange: React.FC<ITimeRangeProps> = (props) => {
  const {
    start = 0,
    duration = 20,
    timeTrackRef,
    timeTrackListContainerRef,
    conflictRange,
    updateConflictRange,
    timeRange,
    updateTimeRanges,
    catchHandler,
  } = props;
  const [timeInfo, setTimeInfo] = useState<{ start: number; duration: number }>(
    { start: timeRange.start, duration: timeRange.duration }
  );
  const [cachedTimeInfo, setCachedTimeInfo] = useState<{
    start: number;
    duration: number;
  }>(timeInfo);
  const timeRangeRef = useRef<HTMLDivElement>(null);
  const leftResizeRef = useRef<HTMLDivElement>(null);
  const rightResizeRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const handleMove = useCallback(
    (left: number, moveWidth: number) =>
      throttle(() => {
        const timeRangeItem = timeRangeRef.current;
        const timeTrackListContainer = timeTrackListContainerRef.current;
        if (timeRangeItem && timeTrackListContainer) {
          left =
            left < 0
              ? 0
              : left <=
                timeTrackListContainer?.getBoundingClientRect().width -
                  moveWidth
              ? left
              : timeTrackListContainer?.getBoundingClientRect().width -
                moveWidth;
          left = Math.ceil(left);
          timeRangeItem.style.left = left + "px";
          setTimeInfo((time) => ({ ...time, start: left }));
        }
      }, 100),
    []
  );
  // register move
  useEffect(() => {
    let down = false;
    let moveWidth = 0,
      offsetX = 0;
    const timeRangeItem = timeRangeRef.current;
    const timeTrackListContainer = timeTrackListContainerRef.current;
    if (timeRangeItem && timeTrackListContainer) {
      const timeTrackListContainerRect = timeTrackListContainer.getBoundingClientRect();
      timeTrackListContainer.addEventListener("mousemove", function (e) {
        const relativeX = e.pageX - timeTrackListContainerRect.x;
        if (down) {
          let left = relativeX - offsetX;
          handleMove(left, moveWidth)();
        }
      });
      timeRangeItem.addEventListener("mousedown", function (e) {
        catchHandler("move", { timeRange });
        setCachedTimeInfo({ ...timeInfo });
        offsetX = e.offsetX;
        moveWidth = timeRangeItem.getBoundingClientRect().width;
        if (!down) {
          down = true;
        }
      });
      document.addEventListener("mouseup", function () {
        if (down) {
          catchHandler("clear move");
          down = false;
        }
      });
    }
  }, []);
  const handleLeftResize = useCallback(
    (divWidth: number, divLeft: number, mouseDiffx: number) => {
      return throttle(() => {
        if (timeRangeRef.current && timeTrackListContainerRef.current) {
          // @ts-ignore
          let newDivWidth, newDivLeft;
          if (
            timeRangeRef.current?.getBoundingClientRect().width > 20 ||
            mouseDiffx < 0
          ) {
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
          if (
            // @ts-ignore
            newDivLeft + newDivWidth >
            timeTrackListContainerRef.current.getBoundingClientRect().width
          ) {
            newDivWidth =
              // @ts-ignore
              timeTrackListContainer.getBoundingClientRect().width - newDivLeft;
          }
          // @ts-ignore
          if (newDivLeft < 0) {
            newDivLeft = 0;
          }
          newDivWidth = Math.ceil(newDivWidth as number);
          newDivLeft = Math.ceil(newDivLeft as number);
          // @ts-ignore
          timeRangeRef.current.style.width = newDivWidth + "px";
          // @ts-ignore
          timeRangeRef.current.style.left = newDivLeft + "px";

          setTimeInfo((time) => ({
            ...time,
            // @ts-ignore
            start: newDivLeft,
            // @ts-ignore
            duration: newDivWidth,
          }));
        }
      }, 100);
    },
    []
  );
  const handleRightResize = useCallback(
    (divWidth: number, divLeft: number, mouseDiffx: number) => {
      return throttle(() => {
        if (timeRangeRef.current && timeTrackListContainerRef.current) {
          // @ts-ignore
          let newDivWidth, newDivLeft;
          newDivWidth = divWidth + mouseDiffx;
          newDivLeft = divLeft;
          if (
            // @ts-ignore
            newDivLeft + newDivWidth >
            timeTrackListContainerRef.current.getBoundingClientRect().width
          ) {
            newDivWidth =
              // @ts-ignore
              timeTrackListContainerRef.current.getBoundingClientRect().width -
              newDivLeft;
          }
          // @ts-ignore
          if (newDivLeft < 0) {
            newDivLeft = 0;
          }
          newDivWidth = Math.ceil(newDivWidth as number);
          newDivLeft = Math.ceil(newDivLeft as number);
          // @ts-ignore
          timeRangeRef.current.style.width = newDivWidth + "px";
          // @ts-ignore
          timeRangeRef.current.style.left = newDivLeft + "px";

          setTimeInfo((time) => ({
            ...time,
            // @ts-ignore
            start: newDivLeft,
            // @ts-ignore
            duration: newDivWidth,
          }));
        }
      }, 100);
    },
    []
  );
  const resize = useCallback((side: "left" | "right", clientX: number) => {
    let divWidth = timeRangeRef.current?.getBoundingClientRect().width;
    let divLeft = timeRangeRef.current?.offsetLeft;

    return (e: any) => {
      const timeTrackListContainer = timeTrackListContainerRef.current;
      if (timeRangeRef.current && timeTrackListContainer) {
        const mouseDiffx = e.clientX - clientX;

        let newDivWidth;

        let newDivLeft;
        if (side === "left") {
          handleLeftResize(divWidth as number, divLeft as number, mouseDiffx)();
        } else {
          handleRightResize(
            divWidth as number,
            divLeft as number,
            mouseDiffx
          )();
        }
      }
    };
  }, []);
  // register move
  useEffect(() => {
    const leftResize = leftResizeRef.current;
    const rightResize = rightResizeRef.current;
    const timeTrackListContainer = timeTrackListContainerRef.current;

    if (leftResize && timeTrackListContainer && rightResize) {
      leftResize.addEventListener("mousedown", function (e) {
        e.stopPropagation();
        const clientX = e.clientX;
        const leftRisizeHandler = resize("left", clientX);
        timeTrackListContainer.addEventListener("mousemove", leftRisizeHandler);
        document.addEventListener("mouseup", function () {
          timeTrackListContainer?.removeEventListener(
            "mousemove",
            leftRisizeHandler
          );
        });
      });
      rightResize.addEventListener("mousedown", function (e) {
        e.stopPropagation();
        const clientX = e.clientX;
        const rightRisizeHandler = resize("right", clientX);
        timeTrackListContainer.addEventListener(
          "mousemove",
          rightRisizeHandler
        );
        document.addEventListener("mouseup", function () {
          timeTrackListContainer?.removeEventListener(
            "mousemove",
            rightRisizeHandler
          );
        });
      });
    }
  }, []);
  // 重新计算冲突部分
  useEffect(() => {}, []);
  // 跟新timeRange
  useEffect(() => {
    updateTimeRanges({ ...timeRange, ...timeInfo }, "update");
  }, [timeInfo]);
  // 绘制冲突部分
  // useEffect(() => {
  //   const conflict = calculateConflict(
  //     [timeInfo.start, timeInfo.start + timeInfo.duration],
  //     conflictRange
  //   );
  //   const canvas = canvasRef.current;
  //   if (canvas) {
  //     const ctx = canvas.getContext("2d");
  //     if (ctx) {
  //       console.info("conflict: ", conflict);
  //       // ctx.clearRect(0, 0, 2000, 32);
  //       // ctx.fillStyle = "red";
  //       // ctx.fillRect(200, 0, 20, 32);
  //     }
  //   }
  // }, [conflictRange, timeInfo]);

  return (
    <div
      style={{ left: timeRange.start, width: timeRange.duration }}
      ref={timeRangeRef}
      className={PREFIX}
    >
      <canvas
        width="2000"
        height="32"
        ref={canvasRef}
        className="TimeRange-canvas"
      />
      <div ref={leftResizeRef} className="leftResize"></div>
      <div ref={rightResizeRef} className="rightResize"></div>
    </div>
  );
};
export default React.memo(TimeRange);
