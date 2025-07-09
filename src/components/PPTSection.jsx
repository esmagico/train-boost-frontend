import React, { useEffect, useRef } from "react";

const PPTSection = ({
  onAskQuestion,
  removeAskQuestionButton = false,
  height = "calc(100vh - 220px)",
  width = "70%",
}) => {
  const baseUrl =
    "https://docs.google.com/presentation/d/1h2O6645kWV0kWihwFF--DKx82RykKc1L";
  const googleSlidesUrl = `${baseUrl}/embed?rm=minimal&loop=true&delayms=5000&start=true&slide=1`;
  const iframeRef = useRef(null);
  const intervalRef = useRef(null);

  const goToNextSlide = () => {
    if (iframeRef.current) {
      // This message will be handled by Google Slides to go to the next slide
      iframeRef.current.contentWindow.postMessage("nextslide", "*");
    }
  };

  useEffect(() => {
    // Start the interval when component mounts
    intervalRef.current = setInterval(goToNextSlide, 5000); // 5000ms = 5 seconds

    // Clear interval on component unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleClickPresentation = () => {
    // Manually trigger next slide on click
    goToNextSlide();
    // Reset the interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(goToNextSlide, 5000);
    }
  };

  return (
    <div className={`flex flex-col w-[${width}] h-[calc(100vh-120px)]`}>
      <div
        onClick={handleClickPresentation}
        className="p-4 bg-white rounded-xl border border-gray-200 min-h-[500px] relative cursor-pointer"
        style={{ height }}
      >
        <iframe
          ref={iframeRef}
          src={googleSlidesUrl}
          className="w-full h-full rounded-xl"
          allowFullScreen
          allow="autoplay"
        />
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
