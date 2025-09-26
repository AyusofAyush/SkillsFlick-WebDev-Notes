# Video Assets

This folder contains sample videos for the portfolio website.

## Video Files

### demo-project.mp4

- **Description**: Project demonstration video showing the e-commerce platform in action
- **Duration**: ~2 minutes
- **Resolution**: 1920x1080
- **Format**: MP4 (H.264)
- **Usage**: Embedded in project detail modals

### portfolio-intro.mp4

- **Description**: Brief introduction video for the hero section
- **Duration**: 30 seconds
- **Resolution**: 1280x720
- **Format**: MP4 (H.264)
- **Usage**: Hero section background or introduction

### coding-timelapse.mp4

- **Description**: Time-lapse video of coding session
- **Duration**: 1 minute
- **Resolution**: 1920x1080
- **Format**: MP4 (H.264)
- **Usage**: About section or skills demonstration

## Video Optimization

All videos are optimized for web delivery:

- Compressed for fast loading
- Multiple quality options available
- Responsive video player integration
- Lazy loading implementation

## Fallback Images

Each video has a corresponding poster image for cases where video cannot be played or to improve loading performance.

## Usage in Code

Videos are integrated into the website using HTML5 video elements with proper controls and accessibility features:

```html
<video controls poster="poster-image.jpg">
  <source src="video-file.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>
```

## Browser Support

Videos are encoded to support:

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+
- Mobile browsers (iOS Safari, Chrome Mobile)
