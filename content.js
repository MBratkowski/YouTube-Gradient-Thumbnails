// content.js
const DEBUG = true;

function debugLog(...args) {
    if (DEBUG) {
        console.log('%c[Thumbnail Gradient]', 'color: #4CAF50; font-weight: bold;', ...args);
    }
}

async function getImageColor(imgUrl) {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            
            ctx.drawImage(img, 0, 0);
            
            try {
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;
                let r = 0, g = 0, b = 0;
                let pixels = 0;
                
                for (let i = 0; i < data.length; i += 4) {
                    if (data[i + 3] > 128) {
                        r += data[i];
                        g += data[i + 1];
                        b += data[i + 2];
                        pixels++;
                    }
                }
                
                if (pixels > 0) {
                    r = Math.round(r / pixels);
                    g = Math.round(g / pixels);
                    b = Math.round(b / pixels);
                    resolve(`rgb(${r},${g},${b})`);
                } else {
                    resolve(null);
                }
            } catch (error) {
                debugLog('Błąd podczas analizy obrazu:', error);
                resolve(null);
            }
        };
        
        img.onerror = () => {
            debugLog('Błąd ładowania obrazu:', imgUrl);
            resolve(null);
        };
        
        img.src = imgUrl;
    });
}

async function processYouTubeThumbnail(thumbnail) {
  debugLog('Przetwarzanie miniatury:', thumbnail);
  
  // Szukamy kontenera rich-grid-media
  const videoContainer = thumbnail.closest('ytd-rich-grid-media');
  if (!videoContainer) {
      debugLog('Nie znaleziono kontenera wideo');
      return null;
  }

  // Selektory dopasowane do aktualnej struktury YouTube
  const avatarImg = videoContainer.querySelector('.yt-spec-avatar-shape__image.yt-core-image--loaded');
  const videoTitle = videoContainer.querySelector('#video-title');
  const channelNameElement = videoContainer.querySelector('ytd-channel-name #text a');
  const viewCountElement = videoContainer.querySelector('#metadata-line span:first-child');
  const timeAgoElement = videoContainer.querySelector('#metadata-line span:last-child');

  debugLog('Znalezione elementy:', {
      avatarImg: !!avatarImg,
      videoTitle: !!videoTitle,
      channelName: !!channelNameElement,
      viewCount: !!viewCountElement,
      timeAgo: !!timeAgoElement
  });

  let color = null;
  if (avatarImg && avatarImg.src) {
      try {
          color = await getImageColor(avatarImg.src);
          debugLog('Pobrany kolor z avatara:', color);
      } catch (error) {
          debugLog('Błąd podczas pobierania koloru:', error);
      }
  }

  const data = {
      color,
      title: videoTitle ? videoTitle.textContent.trim() : '',
      metadata: {
          channel: channelNameElement ? channelNameElement.textContent.trim() : '',
          views: viewCountElement ? viewCountElement.textContent.trim() : '',
          time: timeAgoElement ? timeAgoElement.textContent.trim() : ''
      }
  };

  debugLog('Przetworzone dane:', data);
  return data;
}

function generateGradient(baseColor = null) {
  // Stonowana paleta kolorów przyjazna dla ADHD
  const defaultPalettes = [
      // Odcienie niebieskiego (uspokajające)
      {
          primary: '#4A90E2',
          secondary: '#5B9FEF'
      },
      // Stonowana zieleń (relaksująca)
      {
          primary: '#48A88D',
          secondary: '#5BB89D'
      },
      // Ciepły fiolet (zrównoważony)
      {
          primary: '#8E6B9E',
          secondary: '#9D7AAD'
      },
      // Stonowany błękit (łagodny)
      {
          primary: '#5B9AA0',
          secondary: '#6AA9AF'
      },
      // Ciepły szary (neutralny)
      {
          primary: '#767B91',
          secondary: '#858A9F'
      }
  ];

  if (baseColor) {
      try {
          const match = baseColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
          if (match) {
              const [_, r, g, b] = match;
              
              // Stonowanie kolorów przez zmniejszenie nasycenia
              const factor = 0.7; // Zmniejszamy intensywność
              const brighterFactor = 1.2; // Delikatniejsza różnica w gradiencie
              
              // Obliczanie stonowanych kolorów
              const muted = {
                  r: Math.round(r * factor),
                  g: Math.round(g * factor),
                  b: Math.round(b * factor)
              };
              
              // Tworzenie jaśniejszej wersji stonowanego koloru
              const brighter = {
                  r: Math.min(255, Math.round(muted.r * brighterFactor)),
                  g: Math.min(255, Math.round(muted.g * brighterFactor)),
                  b: Math.min(255, Math.round(muted.b * brighterFactor))
              };

              const color1 = `rgb(${muted.r}, ${muted.g}, ${muted.b})`;
              const color2 = `rgb(${brighter.r}, ${brighter.g}, ${brighter.b})`;
              
              return `linear-gradient(135deg, ${color1}, ${color2})`;
          }
      } catch (error) {
          debugLog('Błąd podczas generowania gradientu:', error);
      }
  }
  
  // Jeśli nie ma baseColor lub wystąpił błąd, używamy domyślnej palety
  const palette = defaultPalettes[Math.floor(Math.random() * defaultPalettes.length)];
  return `linear-gradient(135deg, ${palette.primary}, ${palette.secondary})`;
}


function createGradientElement(width, height, videoData) {
    const gradient = document.createElement('div');
    gradient.className = 'minimalist-gradient';
    gradient.style.width = width + 'px';
    gradient.style.height = height + 'px';
    
    if (videoData) {
        gradient.style.background = generateGradient(videoData.color);
        
        const infoContainer = document.createElement('div');
        infoContainer.className = 'video-info-container';
        
        // Tytuł
        if (videoData.title) {
            const titleDiv = document.createElement('div');
            titleDiv.className = 'video-title';
            titleDiv.textContent = videoData.title;
            infoContainer.appendChild(titleDiv);
        }
        
        // Nazwa kanału
        if (videoData.metadata.channel) {
            const channelDiv = document.createElement('div');
            channelDiv.className = 'channel-name';
            channelDiv.textContent = videoData.metadata.channel;
            infoContainer.appendChild(channelDiv);
        }
        
        // Liczba wyświetleń
        if (videoData.metadata.views) {
            const viewsDiv = document.createElement('div');
            viewsDiv.className = 'view-count';
            viewsDiv.textContent = videoData.metadata.views;
            infoContainer.appendChild(viewsDiv);
        }
        
        // Czas publikacji
        if (videoData.metadata.time) {
            const timeDiv = document.createElement('div');
            timeDiv.className = 'time-ago';
            timeDiv.textContent = videoData.metadata.time;
            infoContainer.appendChild(timeDiv);
        }
        
        gradient.appendChild(infoContainer);
    }
    
    return gradient;
}

function cleanupMetadata(videoContainer) {
  if (!videoContainer) return;
  
  // Lista selektorów elementów do ukrycia
  const selectorsToHide = [
      '#meta',
      'ytd-video-meta-block',
      '#avatar-container',
      '#metadata',
      '#byline-container',
      '#metadata-line',
      '#details'
  ];

  selectorsToHide.forEach(selector => {
      const element = videoContainer.querySelector(selector);
      if (element) {
          element.style.display = 'none';
          element.style.visibility = 'hidden';
          element.style.height = '0';
          element.style.overflow = 'hidden';
      }
  });
}

// Zaktualizuj funkcję replaceThumbnails, dodając wywołanie cleanupMetadata
function updateProgressBarColor(gradient, videoContainer) {
  if (!videoContainer) return;
  
  const progressBar = videoContainer.querySelector('ytd-thumbnail-overlay-resume-playback-renderer #progress');
  if (!progressBar) return;

  // Pobieramy kolor z gradientu miniatury i używamy go do paska postępu
  const color = gradient.style.getPropertyValue('--gradient');
  if (color) {
      progressBar.style.background = color;
  }
}

// Zaktualizuj funkcję replaceThumbnails dodając wywołanie updateProgressBarColor
async function replaceThumbnails() {
  try {
      const thumbnails = document.querySelectorAll('ytd-rich-grid-media img.yt-core-image:not([data-gradient-applied])');
      
      for (const thumbnail of thumbnails) {
          if (!thumbnail.dataset.gradientApplied && thumbnail.width > 0) {
              const videoContainer = thumbnail.closest('ytd-rich-grid-media');
              const videoData = await processYouTubeThumbnail(thumbnail);
              
              if (videoData) {
                  const gradient = document.createElement('div');
                  gradient.className = 'minimalist-gradient';
                  gradient.style.width = thumbnail.width + 'px';
                  gradient.style.height = thumbnail.height + 'px';
                  gradient.style.setProperty('--gradient', generateGradient(videoData.color));
                  
                  const infoContainer = createInfoElements(videoData);
                  gradient.appendChild(infoContainer);
                  
                  if (thumbnail.parentNode) {
                      thumbnail.parentNode.insertBefore(gradient, thumbnail);
                      thumbnail.style.display = 'none';
                      thumbnail.dataset.gradientApplied = 'true';
                      
                      // Aktualizacja koloru paska postępu
                      updateProgressBarColor(gradient, videoContainer);
                      cleanupMetadata(videoContainer);
                  }
              }
          }
      }
  } catch (error) {
      debugLog('Błąd podczas zamiany miniatur:', error);
  }
}

function createInfoElements(videoData) {
  const infoContainer = document.createElement('div');
  infoContainer.className = 'video-info-container';

  const topSection = document.createElement('div');
  topSection.className = 'video-info-top';

  const bottomSection = document.createElement('div');
  bottomSection.className = 'video-info-bottom';

  // Tytuł w górnej sekcji
  if (videoData.title) {
      const titleDiv = document.createElement('div');
      titleDiv.className = 'video-title';
      titleDiv.textContent = videoData.title;
      topSection.appendChild(titleDiv);
  }

  // Informacje w dolnej sekcji
  if (videoData.metadata.channel) {
      const channelDiv = document.createElement('div');
      channelDiv.className = 'channel-name';
      channelDiv.textContent = videoData.metadata.channel;
      bottomSection.appendChild(channelDiv);
  }

  const metadataContainer = document.createElement('div');
  metadataContainer.className = 'metadata-container';

  if (videoData.metadata.views) {
      const viewsDiv = document.createElement('div');
      viewsDiv.className = 'view-count';
      viewsDiv.textContent = videoData.metadata.views;
      metadataContainer.appendChild(viewsDiv);
  }

  if (videoData.metadata.time) {
      const timeDiv = document.createElement('div');
      timeDiv.className = 'time-ago';
      timeDiv.textContent = videoData.metadata.time;
      metadataContainer.appendChild(timeDiv);
  }

  bottomSection.appendChild(metadataContainer);
  infoContainer.appendChild(topSection);
  infoContainer.appendChild(bottomSection);

  return infoContainer;
}


const styleSheet = document.createElement('style');
styleSheet.textContent = `
    .minimalist-gradient {
        border-radius: 16px;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        cursor: pointer;
        position: relative;
        overflow: hidden;
        background: var(--gradient);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }
    
    .minimalist-gradient:hover {
        transform: translateY(-4px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .video-info-container {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: grid;
        grid-template-rows: 1fr auto;
        padding: 24px;
        background: linear-gradient(
            180deg, 
            rgba(0, 0, 0, 0.1) 0%, 
            rgba(0, 0, 0, 0.3) 50%,
            rgba(0, 0, 0, 0.5) 100%
        );
        opacity: 1;
    }

    .video-info-top {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        padding-bottom: 16px;
    }

    .video-info-bottom {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .video-title {
        color: rgba(255, 255, 255, 0.95);
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 18px;
        font-weight: 500;
        line-height: 1.4;
        letter-spacing: 0.01em;
        margin-bottom: 8px;
        text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
    }

    .channel-name {
        color: rgba(255, 255, 255, 0.9);
        font-size: 14px;
        font-weight: 400;
        letter-spacing: 0.01em;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .metadata-container {
        display: flex;
        align-items: center;
        gap: 12px;
        color: rgba(255, 255, 255, 0.8);
        font-size: 13px;
        font-weight: 400;
    }

    .view-count {
        display: flex;
        align-items: center;
    }

    .view-count::after {
        content: '•';
        margin-left: 12px;
        opacity: 0.6;
    }

    .time-ago {
        color: rgba(255, 255, 255, 0.7);
    }

    /* Delikatniejsze przejście przy hover */
    .minimalist-gradient:hover .video-info-container {
        background: linear-gradient(
            180deg, 
            rgba(0, 0, 0, 0.2) 0%, 
            rgba(0, 0, 0, 0.4) 50%,
            rgba(0, 0, 0, 0.6) 100%
        );
        transition: background 0.4s ease-out;
    }
`;

styleSheet.textContent += `
    /* Ukrywanie oryginalnych metadanych - bardziej specyficzne selektory */
    ytd-rich-grid-media #meta,
    ytd-rich-grid-media ytd-video-meta-block,
    ytd-rich-grid-media #avatar-container,
    ytd-rich-grid-media .ytd-rich-grid-media#meta,
    ytd-rich-grid-media .ytd-video-meta-block,
    ytd-rich-grid-media #metadata,
    ytd-rich-grid-media #byline-container,
    ytd-rich-grid-media #metadata-line {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        height: 0 !important;
        overflow: hidden !important;
        margin: 0 !important;
        padding: 0 !important;
    }

    /* Ukrywanie dodatkowych elementów meta */
    ytd-rich-grid-media .ytd-rich-grid-media[id="meta"],
    ytd-rich-grid-media .ytd-rich-grid-media[id="metadata"],
    ytd-rich-grid-media .ytd-rich-grid-media[id="metadata-line"] {
        display: none !important;
    }

    /* Usuwanie marginesów i paddingów z kontenerów */
    ytd-rich-grid-media #details {
        margin-top: 0 !important;
        padding-top: 0 !important;
    }

    /* Ukrywanie separatorów */
    ytd-rich-grid-media #separator {
        display: none !important;
    }
`;


styleSheet.textContent += `
    /* Modyfikacja paska postępu - wersja podstawowa */
    ytd-thumbnail-overlay-resume-playback-renderer #progress {
        background-color: #48A88D !important; /* Przyjazny zielony */
    }

    /* Wersja zaawansowana z gradientem i animacją */
    ytd-thumbnail-overlay-resume-playback-renderer #progress {
        background: linear-gradient(
            90deg,
            #48A88D 0%,
            #5BB89D 100%
        ) !important;
        transition: width 0.3s ease-out !important;
        border-radius: 0 2px 2px 0 !important;
        height: 3px !important;
    }

    /* Dodanie delikatnego cienia dla lepszej widoczności */
    ytd-thumbnail-overlay-resume-playback-renderer {
        background: rgba(0, 0, 0, 0.1) !important;
        height: 3px !important;
    }

    /* Modyfikacja paska postępu podczas hover */
    .minimalist-gradient:hover ytd-thumbnail-overlay-resume-playback-renderer #progress {
        background: linear-gradient(
            90deg,
            #5BB89D 0%,
            #6AC8AD 100%
        ) !important;
        height: 4px !important;
        transition: all 0.3s ease-out !important;
    }

    /* Alternatywne kolory (możesz wybrać jeden z poniższych zestawów) */
    
    /* Spokojny niebieski */
    /*
    ytd-thumbnail-overlay-resume-playback-renderer #progress {
        background: linear-gradient(
            90deg,
            #4A90E2 0%,
            #5B9FEF 100%
        ) !important;
    }
    */

    /* Stonowany fiolet */
    /*
    ytd-thumbnail-overlay-resume-playback-renderer #progress {
        background: linear-gradient(
            90deg,
            #8E6B9E 0%,
            #9D7AAD 100%
        ) !important;
    }
    */

    /* Ciepły szary */
    /*
    ytd-thumbnail-overlay-resume-playback-renderer #progress {
        background: linear-gradient(
            90deg,
            #767B91 0%,
            #858A9F 100%
        ) !important;
    }
    */
`;
document.head.appendChild(styleSheet);

// Inicjalizacja z debounce
let isProcessing = false;
let processingTimeout;

const observer = new MutationObserver(() => {
    if (!isProcessing) {
        isProcessing = true;
        clearTimeout(processingTimeout);
        
        processingTimeout = setTimeout(() => {
            replaceThumbnails().finally(() => {
                isProcessing = false;
            });
        }, 100);
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

// Początkowe uruchomienie
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', replaceThumbnails);
} else {
    replaceThumbnails();
}