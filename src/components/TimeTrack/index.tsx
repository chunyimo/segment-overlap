import React, { ReactNode, RefObject, useRef } from 'react';
import TimeRange from '../TimeRange';
import './index.css';
export interface ITimeTrackProps {
  timeTrackListContainerRef: RefObject<HTMLDivElement>;
  children?: ReactNode;
}

const PREFIX = 'TimeTrack';
const TimeTrack: React.FC<ITimeTrackProps> = (props) => {
  const { timeTrackListContainerRef } = props;
  const timeTrackRef = useRef<HTMLDivElement>(null);
  return (
    <div ref={timeTrackRef} className={PREFIX}>
      <TimeRange
        timeTrackListContainerRef={timeTrackListContainerRef}
        timeTrackRef={timeTrackRef}
      />
    </div>
  );
};
export default React.memo(TimeTrack);
