import React, { ReactNode, useRef } from 'react';
import TimeTrack from '../TimeTrack';
import { timeTrackList } from '../../mock';
import './index.css';
export interface ITimeTrackListProps {
  children?: ReactNode;
}

const PREFIX = 'TimeTrackList';
const TimeTrackList: React.FC<ITimeTrackListProps> = (props) => {
  const timeTrackListContainerRef = useRef<HTMLDivElement>(null);
  return (
    <div className={PREFIX}>
      <div
        ref={timeTrackListContainerRef}
        className={`${PREFIX}-timeTrackListContainer`}
      >
        {timeTrackList.map((time, index) => {
          return (
            <TimeTrack
              timeTrackListContainerRef={timeTrackListContainerRef}
              key={index}
            />
          );
        })}
      </div>
    </div>
  );
};
export default React.memo(TimeTrackList);
