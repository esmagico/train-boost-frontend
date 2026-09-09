import {
    useEffect,
    useCallback
} from 'react';

export const useFullscreenOnLandscape = (enabled = true) => {
    const enterFullscreen = useCallback(async () => {
        try {
            if (document.documentElement.requestFullscreen) {
                await document.documentElement.requestFullscreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
                // Safari
                await document.documentElement.webkitRequestFullscreen();
            } else if (document.documentElement.mozRequestFullScreen) {
                // Firefox
                await document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.msRequestFullscreen) {
                // IE/Edge
                await document.documentElement.msRequestFullscreen();
            }
        } catch (error) {
            console.log('Fullscreen request failed:', error);
        }
    }, []);

    const exitFullscreen = useCallback(async () => {
        try {
            if (document.exitFullscreen) {
                await document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                // Safari
                await document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                // Firefox
                await document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
                // IE/Edge
                await document.msExitFullscreen();
            }
        } catch (error) {
            console.log('Exit fullscreen failed:', error);
        }
    }, []);

    const handleOrientationChange = useCallback(() => {
        if (!enabled) return;

        // Small delay to ensure orientation change is complete
        setTimeout(() => {
            // Use the physical screen dimensions, not the viewport — an
            // on-screen keyboard shrinks window.innerHeight (and even
            // matchMedia('(orientation: ...)'), which the CSS spec also
            // defines in terms of the viewport) without the device actually
            // rotating. window.screen.width/height are unaffected by that.
            const isLandscape = window.screen.width > window.screen.height;
            const isFullscreen = document.fullscreenElement ||
                document.webkitFullscreenElement ||
                document.mozFullScreenElement ||
                document.msFullscreenElement;

            // Only auto-enter fullscreen on landscape, don't auto-exit
            if (isLandscape && !isFullscreen) {
                enterFullscreen();
            }
            // Let users manually control exit from fullscreen
        }, 100);
    }, [enabled, enterFullscreen]);

    useEffect(() => {
        if (!enabled) return;

        // Listen for orientation changes
        window.addEventListener('orientationchange', handleOrientationChange);
        window.addEventListener('resize', handleOrientationChange);

        // Check initial orientation
        handleOrientationChange();

        return () => {
            window.removeEventListener('orientationchange', handleOrientationChange);
            window.removeEventListener('resize', handleOrientationChange);
        };
    }, [enabled, handleOrientationChange]);

    return {
        enterFullscreen,
        exitFullscreen,
    };
};