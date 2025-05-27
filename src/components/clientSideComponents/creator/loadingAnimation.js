import "./styleModules/loadingAnimationModule.css";

export default function LoadingAnimation({ visible }) {
  if (!visible) return null;

  return (
    <div className="loading-overlay">
      <div className="loading-content">
        <div className="spinner">
          <div className="spinner-inner"></div>
        </div>
      </div>
    </div>
  );
}
