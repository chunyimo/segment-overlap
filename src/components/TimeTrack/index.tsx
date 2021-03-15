import React, { ReactNode } from "react";
import TimeRange from "../TimeRange";
import "./index.css";
export interface ITimeTrackProps {
  children?: ReactNode;
}

const PREFIX = "TimeTrack";
const TimeTrack: React.FC<ITimeTrackProps> = (props) => {
  return (
    <div className={PREFIX}>
      <TimeRange />
    </div>
  );
};
export default React.memo(TimeTrack);
