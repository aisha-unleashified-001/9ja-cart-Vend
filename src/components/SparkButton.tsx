import { ArrowRight } from "lucide-react";
import { useId } from "react";
import "./SparkButton.css";

const SparkButton = () => {
  const id = useId();
  const innerPathId = `ambilight-inner-${id}`;
  const outerPathId = `ambilight-outer-${id}`;

  // Generate 50 points with decreasing opacity for the comet tail
  const points = Array.from({ length: 50 }, (_, i) => ({
    distance: i,
    delay: i * 10,
    opacity: 1 - i * 0.02,
  }));

  return (
    <div className="ambilight-container">
      {/* Button content */}
      <button className="ambilight-button">
        <span className="text-xl font-bold">Start selling now</span>
        <ArrowRight className="w-5 h-5 ml-4" />
      </button>

      {/* Inner track */}
      <div className="ambilight-track ambilight-track-inner">
        <svg className="ambilight-svg" viewBox="0 0 262 72">
          <path
            id={innerPathId}
            d="M 96,0 h 130 a 36,36 0 0 1 36,36 v 0 a 36,36 0 0 1 -36,36 h -190 a 36,36 0 0 1 -36,-36 v -0 a 36,36 0 0 1 36,-36 Z"
            fill="none"
          />
        </svg>
        <div className="ambilight-lighting">
          {points.map((point) => (
            <div
              key={point.distance}
              className="ambilight-point ambilight-point-cyan"
              style={{
                offsetPath: `path("M 96,0 h 130 a 36,36 0 0 1 36,36 v 0 a 36,36 0 0 1 -36,36 h -190 a 36,36 0 0 1 -36,-36 v -0 a 36,36 0 0 1 36,-36 Z")`,
                animationDelay: `${point.delay}ms`,
                opacity: point.opacity,
              }}
            />
          ))}
        </div>
      </div>

      {/* Outer track */}
      <div className="ambilight-track ambilight-track-outer">
        <svg className="ambilight-svg" viewBox="0 0 278 88">
          <path
            id={outerPathId}
            d="M 44,0 h 190 a 44,44 0 0 1 44,44 v 0 a 44,44 0 0 1 -44,44 h -190 a 44,44 0 0 1 -44,-44 v -0 a 44,44 0 0 1 44,-44 Z"
            fill="none"
          />
        </svg>
        <div className="ambilight-lighting">
          {points.map((point) => (
            <div
              key={point.distance}
              className="ambilight-point ambilight-point-magenta"
              style={{
                offsetPath: `path("M 44,0 h 190 a 44,44 0 0 1 44,44 v 0 a 44,44 0 0 1 -44,44 h -190 a 44,44 0 0 1 -44,-44 v -0 a 44,44 0 0 1 44,-44 Z")`,
                animationDelay: `${point.delay}ms`,
                opacity: point.opacity,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SparkButton;
