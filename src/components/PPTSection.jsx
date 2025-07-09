import React, { useRef } from "react";

const PPTSection = ({
  onAskQuestion,
  removeAskQuestionButton = false,
  height = "calc(100vh - 220px)",
  width = "70%",
  autoPlayDelay = 5000,
  presentationUrl = "https://docs.google.com/presentation/d/1h2O6645kWV0kWihwFF--DKx82RykKc1L/edit?usp=drive_link&ouid=112603893642491756794&rtpof=true&sd=true", // new prop
}) => {
  const iframeRef = useRef(null);

  const extractPresentationId = (url) => {
    const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : null;
  };

  const presentationId = extractPresentationId(presentationUrl);
  const getSlideUrl = () => {
    if (!presentationId) return "";
    return `https://docs.google.com/presentation/d/${presentationId}/embed?start=true&loop=true&delayms=${autoPlayDelay}&slide=1`;
  };

  return (
    <div className={`flex flex-col w-[${width}] h-[calc(100vh-120px)]`}>
      <div
        className="p-4 bg-white rounded-xl border border-gray-200 min-h-[500px] relative"
        style={{ height }}
      >
        {presentationId ? (
          <iframe
            ref={iframeRef}
            src={getSlideUrl()}
            className="w-full h-full rounded-xl"
            allowFullScreen
            allow="autoplay"
            title="Presentation Slides"
            frameBorder="0"
            sandbox="allow-same-origin allow-scripts allow-popups allow-presentation"
          />
        ) : (
          <div className="text-red-500 text-center">
            Invalid Google Drive Presentation URL
          </div>
        )}
      </div>
      {!removeAskQuestionButton && (
        <div className="flex justify-center mt-4">
          <button
            onClick={onAskQuestion}
            className="cursor-pointer px-6 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors"
          >
            Ask a Question
          </button>
        </div>
      )}
    </div>
  );
};

export default PPTSection;
