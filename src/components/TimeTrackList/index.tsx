import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import TimeTrack from "../TimeTrack";
import { timeTrackList } from "../../mock";
import {
  initConflictRange,
  initTimeRange,
  mockConflictRange,
  initTimeScale,
} from "./util";
import "./index.css";
import { findIndex } from "lodash";
export interface ITimeTrackListProps {
  children?: ReactNode;
}

const PREFIX = "TimeTrackList";
const TimeTrackList: React.FC<ITimeTrackListProps> = (props) => {
  const timeTrackListContainerRef = useRef<HTMLDivElement>(null);
  const [timeRanges, setTimeRanges] = useState(initTimeRange);
  const [conflictRange, setConflictRange] = useState<any>([]);
  const [moveConflictRange, setMoveConflictRange] = useState<any>([]);
  const [timeScale, setTimeScale] = useState<number[]>(initTimeScale);
  const updateConflictRange = useCallback((_conflictRange: number[]) => {
    setConflictRange(_conflictRange);
  }, []);
  const [cachedChangeInfo, setCachedChangeInfo] = useState<{ id: string }>();
  const changedTimeRangeId = useRef<string>("");
  const moveActionTimeScale = useRef<number[]>([]);
  const timeScaleRef = useRef<number[]>(timeScale);
  const timeRangesRef = useRef<
    Array<{
      id: string;
      start: number;
      duration: number;
    }>
  >();
  const updateTimeRanges = useCallback(
    (
      _timeRange: { id: string; start: number; duration: number },
      type: "update" | "add" | "delete"
    ) => {
      if (type === "update") {
        setTimeRanges((timeRanges) => {
          const index = findIndex(
            timeRanges,
            (timeRange) => timeRange.id === _timeRange.id
          );
          if (index > -1) {
            console.log("update", _timeRange);
            const _timeRanges = [...timeRanges];
            _timeRanges[index] = _timeRange;
            changedTimeRangeId.current = _timeRange.id;
            return _timeRanges;
          }
          return timeRanges;
        });
      } else if (type === "delete") {
        setTimeRanges((timeRanges) => {
          const index = findIndex(
            timeRanges,
            (timeRange) => timeRange.id === _timeRange.id
          );
          if (index > -1) {
            const _timeRanges = [...timeRanges];
            _timeRanges.splice(index, 1);
            return _timeRanges;
          }
          return timeRanges;
        });
      } else if (type === "add") {
        console.info("add: ");
        setTimeRanges((timeRanges) => {
          const _timeRanges = [...timeRanges, _timeRange];
          return _timeRanges;
        });
      }
    },
    []
  );

  useEffect(() => {
    timeRangesRef.current = timeRanges;
  }, [timeRanges]);
  // 计算 timeScale
  const catchHandler = useCallback((action: string, payload?: any) => {
    if (action === "move") {
      const timeRangeId = payload?.timeRange?.timeRangeId;
      if (timeRangeId && timeRangesRef.current) {
        const timeRanges = timeRangesRef.current;
        const _timeScale = [...initTimeScale];
        for (let i = 0; i < timeRanges.length; i++) {
          const timeRange = timeRanges[i];
          if (timeRange.id !== timeRangeId) {
            for (
              let j = timeRange.start;
              j < timeRange.start + timeRange.duration;
              j++
            ) {
              _timeScale[j] += 1;
            }
          }
        }
        moveActionTimeScale.current = _timeScale;
      }
    }
  }, []);
  useEffect(() => {
    const container = document.querySelector("#TrackListContainer");
    if (container) {
      console.info("scrollTop: ", container.scrollTop);
      const startIndex =
        Math.floor(container.scrollTop / 32) - 2 < 0
          ? 0
          : Math.floor(container.scrollTop / 32) - 2;
      const endIndex = Math.min(startIndex + 25, timeRanges.length);
      const _timeScale = [...initTimeScale];
      for (let i = 0; i < timeRanges.length; i++) {
        const timeRange = timeRanges[i];
        for (
          let j = timeRange.start;
          j < timeRange.start + timeRange.duration;
          j++
        ) {
          _timeScale[j] += 1;
        }
      }
      setTimeScale(_timeScale);
    }
  }, [timeRanges]);

  // 计算冲突区域
  useEffect(() => {
    // console.log(timeScale);
    const _conflictRanges = [];
    let _conflictStart = -1,
      _conflictDuration = 0;
    for (let i = 0; i < timeScale.length; i++) {
      if (timeScale[i] >= 2) {
        _conflictDuration++;
      }
      if (timeScale[i] >= 2 && _conflictStart === -1) {
        _conflictStart = i;
      }
      if (timeScale[i] < 2 && _conflictStart > -1) {
        _conflictRanges.push([
          _conflictStart,
          _conflictStart + _conflictDuration,
        ]);
        _conflictStart = -1;
        _conflictDuration = 0;
      }
    }
    setConflictRange(_conflictRanges);
  }, [timeScale]);

  const handelAdd = useCallback(() => {
    const newTimeRange = {
      id: Math.random().toString(32).slice(2),
      start: 20,
      duration: 80,
    };
    updateTimeRanges(newTimeRange, "add");
  }, []);
  return (
    <div className={PREFIX}>
      <div
        ref={timeTrackListContainerRef}
        className={`${PREFIX}-timeTrackListContainer`}
      >
        {timeRanges.map((time, index) => {
          return (
            <TimeTrack
              catchHandler={catchHandler}
              updateTimeRanges={updateTimeRanges}
              timeRange={time}
              updateConflictRange={updateConflictRange}
              conflictRange={conflictRange}
              timeTrackListContainerRef={timeTrackListContainerRef}
              key={index}
            />
          );
        })}
      </div>
      <button onClick={handelAdd} className={`${PREFIX}-add`}>
        新增
      </button>
    </div>
  );
};
export default React.memo(TimeTrackList);
