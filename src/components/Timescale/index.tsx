import React, { ReactNode, useEffect, useMemo, useRef } from "react";
import "./index.css";
export interface ITimescaleProps {
  lrPadding?: number;
  bigStep?: number;
  smallStep?: number;
  children?: ReactNode;
}

const Timescale: React.FC<ITimescaleProps> = (props) => {
  const { lrPadding = 60 } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { canvasWidth } = useMemo(() => {
    const canvasWidth = 1440 + 2 * lrPadding;
    return { canvasWidth };
  }, []);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvasWidth, 32);
        ctx.fillStyle = "black";
        for (let i = 0; i <= 24; i++) {
          const time = `00${i}`.slice(-2) + ":00";
          ctx.fillRect(lrPadding + i * 60, 32 - 15, 1, 15);
          ctx.fillText(time, lrPadding + i * 60 - 10, 32 - 19);
        }
        for (let i = 0; i <= 24 * 6; i++) {
          ctx.fillRect(lrPadding + i * 10, 32 - 5, 1, 5);
        }
        ctx.fillRect(lrPadding, 32 - 1, 1441, 1);
      }
    }
  }, []);

  return (
    <div className={"Timescale"}>
      <canvas
        width={`${canvasWidth}px`}
        height="32px"
        className={`Timescale-canvas`}
        ref={canvasRef}
      />
    </div>
  );
};
export default React.memo(Timescale);
