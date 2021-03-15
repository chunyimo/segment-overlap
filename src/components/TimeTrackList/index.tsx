import React, { ReactNode } from "react";
import TimeTrack from "../TimeTrack";
import { timeTrackList } from "../../mock";
import "./index.css";
export interface ITimeTrackListProps {
  children?: ReactNode;
}

const PREFIX = "TimeTrackList";
const TimeTrackList: React.FC<ITimeTrackListProps> = (props) => {
  return (
    <div className={PREFIX}>
      {timeTrackList.map((time, index) => {
        return <TimeTrack key={index} />;
      })}
    </div>
  );
};
export default React.memo(TimeTrackList);
