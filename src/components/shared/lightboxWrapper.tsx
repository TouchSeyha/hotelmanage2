'use client';

import Lightbox from 'yet-another-react-lightbox';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';

interface LightboxWrapperProps {
  open: boolean;
  onClose: () => void;
  index: number;
  slides: Array<{ src: string; alt?: string; width: number; height: number }>;
}

function LightboxWrapperComponent({ open, onClose, index, slides }: LightboxWrapperProps) {
  return (
    <Lightbox
      open={open}
      close={onClose}
      index={index}
      slides={slides}
      plugins={[Thumbnails, Zoom, Fullscreen]}
      thumbnails={{
        position: 'bottom',
        width: 120,
        height: 80,
        border: 1,
        borderRadius: 4,
        padding: 4,
        gap: 16,
      }}
      zoom={{
        maxZoomPixelRatio: 3,
        scrollToZoom: true,
      }}
      animation={{
        fade: 250,
        swipe: 250,
      }}
      carousel={{
        finite: false,
        preload: 2,
      }}
      controller={{
        closeOnBackdropClick: true,
      }}
    />
  );
}

export default LightboxWrapperComponent;
