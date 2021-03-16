import React, {
  ReactNode,
  RefObject,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";
import TimeRange from "../TimeRange";
import { calculateConflict } from "../TimeTrackList/util";
import "./index.css";
export interface ITimeTrackProps {
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
  children?: ReactNode;
  catchHandler: (type: string, payload?: {}) => void;
}

const PREFIX = "TimeTrack";
const TimeTrack: React.FC<ITimeTrackProps> = (props) => {
  const {
    timeTrackListContainerRef,
    conflictRange,
    updateConflictRange,
    timeRange,
    updateTimeRanges,
    catchHandler,
  } = props;
  useEffect(() => {
    const conflict = calculateConflict(
      [timeRange.start, timeRange.start + timeRange.duration],
      conflictRange
    );
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, 2000, 32);
        for (let i = 0; i < conflict.length; i++) {
          const currentConflict = conflict[i];
          ctx.fillStyle = "red";
          ctx.fillRect(currentConflict[0], 0, currentConflict[1], 32);
        }
        // ctx.clearRect(0, 0, 2000, 32);
        // ctx.fillStyle = "red";
        // ctx.fillRect(200, 0, 20, 32);
      }
    }
  }, [conflictRange, timeRange]);
  const timeTrackRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const handleDelete = useCallback(() => {
    updateTimeRanges(timeRange, "delete");
  }, [timeRange]);
  return (
    <div ref={timeTrackRef} className={PREFIX}>
      <TimeRange
        catchHandler={catchHandler}
        key={timeRange.id}
        updateTimeRanges={updateTimeRanges}
        timeRange={timeRange}
        updateConflictRange={updateConflictRange}
        conflictRange={conflictRange}
        timeTrackListContainerRef={timeTrackListContainerRef}
        timeTrackRef={timeTrackRef}
      />
      <canvas
        width="2000"
        height="32"
        ref={canvasRef}
        className="TimeRange-canvas"
      />
      <button onClick={handleDelete} className="TimeRange-delete">
        删除
      </button>
    </div>
  );
};
export default React.memo(TimeTrack);
