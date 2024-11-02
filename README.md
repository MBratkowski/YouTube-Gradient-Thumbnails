# YouTube Gradient Thumbnails

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A Chrome extension that transforms YouTube video thumbnails into minimalistic, ADHD-friendly gradients with essential video information. This extension aims to create a more focused and less distracting browsing experience on YouTube.

![Extension Preview](/content/image_01.png)

## Features

- 🎨 Transforms thumbnails into calming, ADHD-friendly gradients
- 👁️ Reduces visual clutter and distractions
- 📊 Maintains essential video information in a clean format
- 🎯 Improves focus while browsing YouTube
- 🌈 Color schemes based on channel avatars
- ⌛ Custom progress bar with soothing colors
- 📱 Responsive design that works across different video sizes

## Installation

### From Source
1. Clone this repository:
```bash
git clone https://github.com/yourusername/youtube-gradient-thumbnails.git
```

2. Open Chrome and navigate to:
```
chrome://extensions/
```

3. Enable "Developer mode" in the top-right corner

4. Click "Load unpacked" and select the extension directory

### Manual Installation
1. Download the latest release from the Releases page
2. Unzip the downloaded file
3. Follow steps 2-4 from the "From Source" section

## Usage

After installation, the extension will automatically:
- Transform video thumbnails into gradients
- Display video titles, channel names, and view counts in a clean format
- Show a custom progress bar for watched videos
- Hide distracting elements while maintaining essential information

No additional configuration is required, though you can disable the extension through Chrome's extension manager if needed.

## Customization

The extension uses carefully selected colors that are ADHD-friendly by default. However, you can customize the appearance by modifying the `content.js` file:

```javascript
// Customize gradient colors
const defaultPalettes = [
    {
        primary: '#4A90E2',
        secondary: '#5B9FEF'
    },
    // Add your custom color pairs here
];

// Customize progress bar color
ytd-thumbnail-overlay-resume-playback-renderer #progress {
    background-color: #48A88D !important;
}
```

## Project Structure

```
youtube-gradient-thumbnails/
├── manifest.json          # Extension configuration
├── content.js            # Main extension logic
├── README.md             # This file
```

## Technical Details

The extension works by:
1. Identifying video thumbnails on YouTube pages
2. Extracting colors from channel avatars
3. Generating smooth gradients based on these colors
4. Creating a clean overlay with essential video information
5. Replacing the original thumbnail with the gradient version
6. Maintaining YouTube's functionality while reducing visual noise

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Known Issues

- The extension needs to be reloaded if YouTube is loaded in a new tab without a page refresh
- Gradients might take a moment to appear on very fast scrolling
- Some custom YouTube layouts might not be fully supported

## Future Plans

- [ ] Add user customizable color schemes
- [ ] Implement local storage for watched video states
- [ ] Add animation options
- [ ] Create options page for customization
- [ ] Add support for YouTube Music
- [ ] Improve performance on infinite scroll

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to YouTube's frontend structure for making this possible
- Inspired by minimalist design principles
- Color schemes based on ADHD-friendly design research

## Support

If you encounter any issues or have suggestions, please:
1. Check the [Known Issues](#known-issues) section
2. Search through [existing issues](https://github.com/MBratkowski/YouTube-Gradient-Thumbnails/issues)
3. Create a new issue if your problem isn't already listed

## Authors

- *Mateusz Bratkowski* - [YourGitHub](https://github.com/MBratkowski)

## Changelog

### Version 1.0.0
- Initial release
- Basic gradient transformation
- ADHD-friendly color schemes
- Custom progress bar
- Essential video information display

---
Made with ❤️ for a more focused YouTube experience