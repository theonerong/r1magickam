// Camera elements
let video, canvas, capturedImage, statusElement, resetButton;
let stream = null;
let videoTrack = null;

// Resolution settings
const RESOLUTION_PRESETS = [
  { name: 'VGA (640x480)', width: 640, height: 480 },
  { name: 'SVGA (800x600)', width: 800, height: 600 },
  { name: 'XGA (1024x768)', width: 1024, height: 768 },
  { name: 'SXGA (1280x960)', width: 1280, height: 960 },
  { name: 'SXGA+ (1400x1050)', width: 1400, height: 1050 },
  { name: 'UXGA (1600x1200)', width: 1600, height: 1200 },
  { name: '2K (2048x1080)', width: 2048, height: 1080 },
  { name: '4K (3840x2160)', width: 3840, height: 2160 }
];
let currentResolutionIndex = 0; // Default to Low (640x480)
const RESOLUTION_STORAGE_KEY = 'r1_camera_resolution';
// White balance settings
const WHITE_BALANCE_MODES = [
  { name: 'Auto', value: 'auto' },
  { name: 'Daylight', value: 'daylight' },
  { name: 'Cloudy', value: 'cloudy' },
  { name: 'Tungsten', value: 'tungsten' },
  { name: 'Fluorescent', value: 'fluorescent' },
  { name: 'Candlelight', value: 'candlelight' },
  { name: 'Moonlight', value: 'moonlight' }
];
let currentWhiteBalanceIndex = 0; // Default to Auto
const WHITE_BALANCE_STORAGE_KEY = 'r1_camera_white_balance';

// Camera switching variables
let currentCameraIndex = 0;
let availableCameras = [];
let isLoadingCamera = false;

// Zoom variables
let currentZoom = 1;
let isPinching = false;
let initialPinchDistance = 0;
let initialZoom = 1;
let zoomThrottleTimeout = null;

// Burst mode variables
let isBurstMode = false;
let burstCount = 5;
let burstDelay = 500;
let isBursting = false;
const BURST_SPEEDS = {
  1: { delay: 800, label: 'Slow' },
  2: { delay: 500, label: 'Medium' },
  3: { delay: 300, label: 'Fast' }
};
const BURST_SETTINGS_KEY = 'r1_camera_burst_settings';
const TIMER_SETTINGS_KEY = 'r1_camera_timer_settings';
const LAST_USED_PRESET_KEY = 'r1_camera_last_preset';

// Timer variables
let isTimerMode = false;
let timerCountdown = null;
let timerDelay = 10; // 10 seconds
let timerRepeatEnabled = false;
let timerDelayOptions = [3, 5, 10]; // Slider maps to these values
let timerRepeatInterval = 1; 

// Add this constant for repeat interval options - ADD THIS
const TIMER_REPEAT_INTERVALS = {
  1: { seconds: 1, label: '1s' },
  2: { seconds: 3, label: '3s' },
  3: { seconds: 5, label: '5s' },
  4: { seconds: 10, label: '10s' },
  5: { seconds: 30, label: '30s' },
  6: { seconds: 60, label: '1m' },
  7: { seconds: 300, label: '5m' },
  8: { seconds: 600, label: '10m' },
  9: { seconds: 1800, label: '30m' },
  10: { seconds: 3600, label: '1h' }
};

// Master Prompt settings
let masterPromptText = '';
let masterPromptEnabled = false;
const MASTER_PROMPT_STORAGE_KEY = 'r1_camera_master_prompt';
const MASTER_PROMPT_ENABLED_KEY = 'r1_camera_master_prompt_enabled';
const ASPECT_RATIO_STORAGE_KEY = 'r1_camera_aspect_ratio';
let selectedAspectRatio = 'none'; // 'none', '1:1', or '16:9'

// Randomizer variables
let isRandomMode = false;

// Motion detection variables
let isMotionDetectionMode = false;
let motionDetectionInterval = null;
let lastFrameData = null;
let motionThreshold = 30; // Sensitivity: lower = more sensitive
let motionPixelThreshold = 0.1; // Percentage of pixels that need to change
let motionContinuousEnabled = true; // Continue capturing without New Photo button
let motionCooldown = 2; // Seconds to wait after capture
let isMotionCooldownActive = false;
let motionStartDelay = 3; // Seconds to wait before starting detection
const MOTION_SETTINGS_KEY = 'r1_camera_motion_settings';
let motionStartInterval = null;

// Start delay options mapping
const MOTION_START_DELAYS = {
  1: { seconds: 3, label: '3s' },
  2: { seconds: 10, label: '10s' },
  3: { seconds: 30, label: '30s' },
  4: { seconds: 60, label: '1m' },
  5: { seconds: 300, label: '5m' },
  6: { seconds: 600, label: '10m' },
  7: { seconds: 900, label: '15m' },
  8: { seconds: 1800, label: '30m' }
};

// No Magic mode
let noMagicMode = false;
const NO_MAGIC_MODE_KEY = 'r1_camera_no_magic_mode';

// Style reveal elements
let styleRevealElement, styleRevealText;
let styleRevealTimeout = null;
let filterDebounceTimeout = null;

// Menu scrolling variables
let currentMenuIndex = 0;
let isMenuOpen = false;
let menuScrollEnabled = false;
let isTutorialOpen = false;
let tutorialScrollEnabled = false;
let isPresetSelectorOpen = false;
let currentPresetIndex_Gallery = 0;
let currentSettingsIndex = 0;
let currentResolutionIndex_Menu = 0;
let currentBurstIndex = 0;
let currentTimerIndex = 0;
let currentMasterPromptIndex = 0;
let currentMotionIndex = 0;
let isSettingsSubmenuOpen = false;
let isResolutionSubmenuOpen = false;
let isBurstSubmenuOpen = false;
let isTimerSubmenuOpen = false;
let isMasterPromptSubmenuOpen = false;
let isMotionSubmenuOpen = false;
let isAspectRatioSubmenuOpen = false;
let currentAspectRatioIndex = 0;
let isTutorialSubmenuOpen = false;
let isPresetBuilderSubmenuOpen = false;
let editingPresetBuilderIndex = -1;
let currentGalleryIndex = 0;
let currentViewerIndex = 0;
let currentEditorIndex = 0;
let currentQueueIndex = 0;
let currentTutorialGlossaryIndex = 0;

// Gallery variables - IndexedDB
const DB_NAME = 'R1CameraGallery';
const DB_VERSION = 1;
const STORE_NAME = 'images';
let db = null;
let galleryImages = [];
const GALLERY_SORT_ORDER_KEY = 'r1_gallery_sort_order';
let currentViewerImageIndex = -1;
let viewerZoom = 1;
let viewerIsPinching = false;
let viewerInitialPinchDistance = 0;
let viewerInitialZoom = 1;
let currentGalleryPage = 1;
const ITEMS_PER_PAGE = 16;
let galleryStartDate = null;
let galleryEndDate = null;
let gallerySortOrder = 'newest';

// Batch processing variables
let isBatchMode = false;
let selectedBatchImages = new Set();

// Multiple preset variables
let isMultiPresetMode = false;
let isBatchPresetSelectionActive = false;
let selectedPresets = [];
let multiPresetImageId = null;

// Style filter
let styleFilterText = '';
let presetFilterText = '';
let presetListScrollPosition = 0;
let visiblePresetsFilterByCategory = ''; // Track selected category filter
let mainMenuFilterByCategory = ''; // Track selected category filter for main menu
let galleryPresetFilterByCategory = ''; // Track selected category filter for gallery preset selector

// Preset Builder templates
const PRESET_TEMPLATES = {
  transform: "Take a picture and transform the image into [DESCRIBE TRANSFORMATION]. [ADD SPECIFIC DETAILS ABOUT STYLE, APPEARANCE, COLORS, ETC.]",
  transform_subject: "Take a picture and transform the subject into [WHAT THE SUBJECT BECOMES]. Preserve the subject's recognizable facial structure and identity. [ADD DETAILS ABOUT NEW APPEARANCE, ENVIRONMENT, LIGHTING].",
  convert: "Take a picture and convert the scene into [DESCRIBE NEW FORMAT/MEDIUM]. [ADD DETAILS ABOUT MATERIALS, TEXTURES, SCALE].",
  style: "Take a picture in the style of [ARTISTIC STYLE/ARTIST]. [ADD DETAILS ABOUT TECHNIQUE, COLORS, COMPOSITION].",
  place: "Take a picture and place the subject in [DESCRIBE SCENE/LOCATION]. [ADD DETAILS ABOUT LIGHTING, ATMOSPHERE, INTEGRATION].",
  recreate: "Take a picture and recreate [FAMOUS WORK/SCENE]. Replace [DESCRIBE WHAT TO REPLACE]. Preserve the iconic [DESCRIBE KEY ELEMENTS TO KEEP].",
  render: "Take a picture and render it as [FORMAT/MEDIUM]. [ADD DETAILS ABOUT APPEARANCE, TEXTURE, TECHNICAL SPECIFICS].",
  make: "Take a picture and make the subject into [CHARACTER/CREATURE]. [ADD DETAILS ABOUT APPEARANCE, TRAITS, SETTING]. Make it photorealistic.",
  analyze: "Analyze the image and [DESCRIBE WHAT TO ANALYZE/EXTRACT]. [ADD DETAILS ABOUT OUTPUT FORMAT] and email it to me.",
  custom: ""
};

// Default camera presets
const DEFAULT_PRESETS = [
  {
    name: "IMPRESSIONISM",
    category: ["ART", "PAINTING", "CLASSIC"],
    message: "Take a picture and transform the image into a French Impressionist painting. Preserve subject identity. Use loose, visible brushstrokes, soft edges, and blended colors emphasizing natural light and atmosphere. Painterly oil-on-canvas texture with warm, luminous tones."
  },
  {
    name: "3D PRINT FAILED",
    category: ["HUMOR", "TECH", "3D"],
    message: "Take a picture and transform the subject into a real, physical 3D-printed object that has partially failed during printing. The subject must appear made from plastic filament with clearly visible horizontal layer lines across the entire surface.\n\nIntroduce obvious 3D-printing failures such as warped or shifted layers, missing sections, drooping filament, collapsed overhangs, stringing, and incomplete geometry as if the print stopped or misaligned mid-job.\n\nThe subject should appear as a photographed 3D print sitting on a workbench or print bed, with realistic shadows, shallow depth of field, and neutral lighting. Use a single solid filament color or limited two-color print. Avoid smooth, sculpted, or digital-rendered surfaces. The final image must clearly look like a failed physical 3D print, not a CGI model or statue."
  },
  {
    name: "80s AND 90s ACTION FILMS",
    category: ["HUMOR", "MOVIE", "SCENE", "ACTION"],
    message: "Take a picture of the subject and place them into a scene from a classic 1980s or 1990s action film, such as *Die Hard*, *Lethal Weapon*, *Terminator*, or *Speed*.\n\nThe subject should appear as the action hero or main participant, performing a dramatic stunt, holding a weapon, or interacting with the environment in an exaggerated way.\n\nProps, lighting, and costumes should match the era and style of the film, including explosions, helicopters, cars, or city backdrops.\n\nOptional flavor text from the master prompt can add humorous twists, like awkward poses, improbable stunts, or ridiculous expressions.\n\nThe final image should look like a cinematic action movie still with the subject as the star, funny, dramatic, and larger-than-life."
  },
  {
    name: "80s PROM DATE",
    category: ["RETRO", "HUMOR", "PHOTOGRAPHY", "POP CULTURE"],
    message: "Take a picture and transform it into an awkward 1980s prom photo taken at a high school prom.\n\nThe image should look like a posed flash photograph from the 1980s: harsh on-camera flash, flat lighting, soft focus, slight film grain, and muted color tones. Include typical prom decorations such as metallic balloons, crepe paper, tinsel, streamers, and a banner with the school name and graduation year (use external master prompt text if provided; otherwise invent a generic school name and year).\n\nDress all subjects in unmistakably tacky 1980s prom attire. Examples include oversized tuxedos, pastel or ruffled dresses, lace gloves, corsages, bow ties, cummerbunds, sequins, and shiny fabrics. Hairstyles must be exaggerated and era-accurate: big teased hair, feathered bangs, mullets, perms, or excessive hairspray volume.\n\nSubject logic:\n• If there is ONE subject and the subject appears masculine, add an older woman who plausibly looks like the subject’s mother as the prom date. She should be dressed formally but slightly out of place.\n• If there is ONE subject and the subject appears feminine, add a younger boy who plausibly looks like a younger brother as the prom date. He should appear underdressed or uncomfortable.\n• If there are TWO human subjects, present them as prom dates together, standing close but visibly awkward, stiff, or uncomfortable.\n\nBody language should feel forced and uncomfortable: stiff smiles, arms held too rigidly, hands awkwardly placed, or obvious personal space tension. No one should look confident or natural.\n\nEnsure the entire photo is fully visible within the frame, like a complete printed prom photo. The final image should feel painfully nostalgic, humorously awkward, and unmistakably 1980s — readable and funny on a small screen."
  },
  {
    name: "AI-BUY",
    category: ["UTILITY", "AI", "SHOPPING"],
    message: "Analyze the image and identify purchasable items. Provide product names, estimated prices, and purchase links. Present results in a clean, structured list and email it to me."
  },
  {
    name: "AI-IDENTIFY",
    category: ["UTILITY", "AI", "ANALYSIS"],
    message: "Analyze the image in detail. Identify people, objects, environment, actions, expressions, and context. Provide a comprehensive, factual description without speculation and email it to me."
  },
  {
    name: "AI-SUMMARIZE",
    category: ["UTILITY", "AI", "ANALYSIS"],
    message: "Analyze the image and provide a comprehensive summary of what is depicted, including context, activity, and notable visual details and email it to me."
  },
  {
    name: "AI-TRANSLATE",
    category: ["UTILITY", "AI", "LANGUAGE"],
    message: "Analyze the image and detect any visible text in the image and translate it accurately into English. Preserve formatting where possible and email it to me."
  },
  {
    name: "A WHO",
    category: ["HUMOR", "MOVIES", "CHRISTMAS", "POP CULTURE"],
    message: "Take a picture and make the subject into a Who from Whoville from Dr. Seuss. Make it photorealistic."
  },
  {
    name: "ABSTRACT ART",
    category: ["ART", "MODERN", "ABSTRACT"],
    message: "Take a picture in the style of Abstract Modern Art. Non-representational shapes, bold composition."
  },
  {
    name: "ABSTRACT EXPRESSIONISM",
    category: ["ART", "PAINTING", "MODERN"],
    message: "Take a picture and transform the image into Abstract Expressionist style. Energetic splatters, layered textures, and dynamic forms while subject partially visible."
  },
  {
    name: "ACCIDENT SCENE",
    category: ["HUMOR", "DAMAGE", "DRAMATIC"],
    message: "Take a picture and transform the main subject so it appears to have recently been involved in an accident. Preserve the original subject while adding realistic damage appropriate to its type.\n\nExamples include:\n• A car with dents, cracked lights, bent panels, or deployed airbags\n• A bicycle with twisted wheels, scraped paint, or a broken chain\n• A scooter, skateboard, or similar object with visible impact damage\n\nAdd subtle environmental clues such as skid marks, fallen debris, or disturbed surroundings when appropriate. The final image should look like a realistic aftermath photo, and remain clear on small screens."
  },
  {
    name: "ADVERTISEMENT",
    category: ["MASTER PROMPT", "COMMERCIAL", "MARKETING", "PROFESSIONAL"],
    message: "Take a picture and transform it into a polished magazine-style advertisement while preserving clear facial likeness and identity of the subject. Present the subject naturally holding, wearing, or interacting with the featured product as the central focus of the ad. Primary information source: If product details are provided via externally supplied information, showcase that product accurately as the main advertised item. Incorporate the product’s name, type, and defining qualities into the visual presentation, slogan, and flavor text without altering or misrepresenting the product. Secondary enhancement: If no product details are externally provided, infer a plausible featured product based on what the subject is visibly holding, wearing, or using. If inference is required, keep the product generic and clearly implied rather than naming a specific real-world brand. Design the final image as a compact, mobile-friendly magazine advertisement layout optimized for small screens. Include a bold, high-contrast headline or slogan, a short block of engaging flavor text, and subtle supporting copy if space allows. Ensure all text is legible at small sizes with clean spacing and strong visual hierarchy. Use flattering, high-quality lighting, refined composition, and a modern editorial aesthetic. Maintain visual clarity, balanced framing, and an immediately recognizable advertising look. The result should be a full view of the page with a relevant background behind the page."
  },
  {
    name: "AESOPS FABLE",
    category: ["STORYBOOK", "KIDS", "LESSON"],
    message: "Take a picture and transform the subject into a character within an Aesop’s fable. Select a fable based on the subject’s appearance, posture, expression, or perceived traits (such as confidence, cleverness, laziness, pride, patience), OR use a specific fable provided via external master prompt.\n\nDepict the subject as a story character (human or animal) fully integrated into a classic fable scene, not as a modern person placed into an illustration. The environment, props, and other characters should visually support the chosen fable.\n\nRender the image as a single illustrated storybook page. Ensure the entire page is fully visible within the frame, including margins, illustration, and text area. Do not crop or cut off any part of the page.\n\nInclude the **title of the selected fable** prominently and clearly within the page layout, such as at the top of the page or in a decorative storybook header. The title must be fully visible and immediately identifiable to the viewer.\n\nInclude the moral of the fable displayed clearly within the page, such as on a parchment banner, book page caption, or decorative text panel. The moral must be short, legible, and directly related to the scene.\n\nUse a traditional storybook illustration style inspired by classic engraved or painted children’s book art. Keep the composition simple, symbolic, and clearly readable on a small screen. The final image should feel like a complete, intact page from an illustrated fable book."
  },
  {
    name: "AFRICAN TRIBAL MASK",
    category: ["ART", "CULTURAL", "MASK"],
    message: "Take a picture and transform the image into African tribal mask art. Simplify facial features, use bold geometric shapes, earthy colors, carved-wood textures, and ceremonial symbolism while keeping the subject recognizable."
  },
  {
    name: "ALBUM TRACKLIST COVER",
    category: ["MUSIC", "ART", "POP CULTURE", "RETRO"],
    message: "Take a picture and transform the subject into the main artist featured on a full vinyl record album cover.\n\nThe subject must be styled, dressed, and posed to clearly match a specific music genre and era inferred from their appearance, expression, clothing, environment, or mood. The visual aesthetic must strongly reflect a historically appropriate vinyl-era release year. For example:\n• 1960s–70s Rock → analog grain, warm tones, natural light, leather or denim\n• 1970s Disco → glossy photography, bold colors, dramatic poses\n• 1980s Pop → neon accents, airbrushed look, studio lighting\n• 1990s Grunge / Hip-hop → gritty texture, muted colors, urban realism\n• 1950s–60s Jazz → monochrome or sepia, elegant composition\n• Punk → raw, DIY photocopy look\n\nIf the genre is unclear, choose the most fitting genre and era based on the subject’s vibe and surroundings.\n\nDesign the image as a complete, square vinyl record cover. The subject must be clearly identifiable as the singer or band front-person, fully integrated into the composition — not pasted in. Lighting, color grading, and framing must feel intentional and era-accurate.\n\nAdd album typography directly onto the cover:\n• Artist name (based on the subject or a humorous alias inspired by them)\n• Album title (creative and genre-appropriate)\n• A clearly visible tracklist arranged in a vinyl-typical layout\n• A release year prominently displayed that matches the visual era (e.g., 1977, 1984, 1993)\n\nThe track names should collectively tell a loose story or emotional arc inspired by the subject’s appearance, pose, or environment. Titles should feel believable for the chosen genre and decade.\n\nOptionally include era-appropriate vinyl details such as:\n• Record label logo\n• Catalog number\n• Stereo / Mono indicator\n• Parental Advisory label (only if appropriate for the genre)\n\nUse authentic vinyl album design conventions: readable period-accurate fonts, balanced spacing, subtle print texture, and slight wear or aging if appropriate. The final image must unmistakably read as a real vinyl album cover and remain legible on small screens."
  },
  {
    name: "ALIEN",
    category: ["SCI FI", "CREATURE", "FANTASY"],
    message: "Take a picture and transform the subject into an alien being while preserving the subject’s core facial structure and identity. Introduce extraterrestrial traits such as altered skin color or texture, subtle bioluminescence, unusual eyes, or refined anatomical variations that still clearly resemble the subject. Place the subject naturally into a sci-fi environment such as an alien world, spacecraft interior, or futuristic city. Match lighting, perspective, and atmospheric effects so the subject appears genuinely part of the scene. Render the final image with photorealistic sci-fi realism and cinematic depth."
  },
  {
    name: "ALIENS",
    category: ["MOVIES", "SCI FI", "HORROR"],
    message: "Take a picture and place the subject in a scene from the movie Aliens. Dark sci-fi realism. Make it photorealistic."
  },
  {
    name: "ALTER EGO",
    category: ["PERSONALITY", "TRANSFORMATION", "CREATIVE"],
    message: "Take a picture and transform the image to reveal an alternate version of the subject. Same facial identity, different personality and visual style."
  },
  {
    name: "AMBIGRAM",
    category: ["TEXT", "ART", "TYPOGRAPHY"],
    message: "Take a picture of the given text and create a true ambigram that reads exactly the same when viewed upside-down (rotated 180 degrees). Use creative typography and design, but do not mirror, flip, or distort the letters in a way that changes the readable order. Randomize styles, fonts, and decorative elements for each attempt, but ensure the text is fully legible and maintains identical meaning when inverted. Include only the ambigram in the image, no extra text or captions."
  },
  {
    name: "AMERICAN GOTHIC",
    category: ["ART", "PAINTING", "CLASSIC", "PARODY"],
    message: "Take a picture and recreate the classic painting American Gothic. Replace one figure in the painting with the subject. If the subject is male, replace the male figure. If the subject is female, replace the female figure. If two subjects are present, replace both figures accordingly. Preserve the iconic composition, clothing style, background, and serious tone of the original artwork while integrating the subject naturally. The final image should be instantly recognizable as American Gothic with a humorous modern twist."
  },
  {
    name: "ANAGLYPH 3D (3D Glasses Needed)",
    category: ["3D", "RETRO", "STEREOSCOPIC", "OPTICAL"],
    message: "Take a picture and transform it into a classic red/blue anaglyph 3D image designed to be viewed with red/cyan or red/blue 3D glasses.\n\nCreate two slightly offset views of the scene representing left-eye and right-eye perspectives. Overlay the left-eye view in red and the right-eye view in cyan/blue, aligning them to produce a convincing stereoscopic depth effect.\n\nDepth should be readable through horizontal parallax: foreground elements should show noticeable red/blue separation, while background elements should align more closely.\n\nPreserve the subject’s recognizability while allowing controlled color channel separation. Avoid excessive ghosting or misalignment that would make the image uncomfortable to view.\n\nLighting, shading, and form should remain realistic so the depth effect feels natural when viewed through 3D glasses.\n\nDo not include Magic Eye patterns, lenticular effects, or split-frame stereoscopy. The image must be a single combined anaglyph composition.\n\nThe final image should clearly appear flat without glasses and distinctly three-dimensional when viewed through red/blue 3D glasses. Ensure the entire composition remains visible and readable on a small screen."
  },
  {
    name: "ANAMORPHIC ART",
    category: ["ART", "ILLUSION", "3D"],
    message: "Take a picture and create an anamorphic image that appears distorted unless viewed from a specific angle. Correct perspective reveals the subject."
  },
  {
    name: "ANDY WARHOL",
    category: ["ART", "POP ART", "ARTIST"],
    message: "Take a picture in the style of Andy Warhol. Pop Art with the use of four duplicated images in a frame."
  },
  {
    name: "ANGULAR MONOCHROMATIC",
    category: ["ART", "DESIGN", "VECTOR", "ABSTRACT"],
    message: "Take a picture and transform it into a bold, stylized vector illustration.\n\nRender the image using flat geometric shapes and a strictly monochromatic color palette derived from the single dominant color of the original photo. Use variations of that color only (light, mid-tone, and dark values) rather than multiple hues or gradients.\n\nStrongly abstract fine detail and simplify all forms into large angular planes that loosely describe the subject and environment. Define edges using hard transitions between adjacent color regions instead of line art. Do not use outlines.\n\nConvey shading entirely through neighboring flat color fields, producing a graphic, poster-like quality reminiscent of cut paper, stencil art, or posterization.\n\nSlightly round all corners of the color block shapes to avoid sharp points while maintaining an angular, faceted appearance.\n\nAvoid texture, brush strokes, realism, or painterly effects. The final image should feel minimal, graphic, modern, and clearly readable on a small screen."
  },
  {
    name: "ANGULAR POLYCHROMATIC",
    category: ["ART", "DESIGN", "VECTOR", "ABSTRACT"],
    message: "Take a picture and transform it into a bold, stylized vector illustration.\n\nRender the image using flat geometric shapes and a vibrant polychromatic color palette derived from the original colors of the photo. Strongly abstract fine detail and organize colors into distinct light, mid-tone, and dark blocks rather than smooth gradients.\n\nSimplify all forms into large angular planes that loosely describe the subject and environment. Define edges using hard transitions between adjacent color regions instead of line art. Do not use outlines.\n\nConvey shading entirely through neighboring flat color fields, creating a graphic, poster-like quality reminiscent of cut paper, posterization, or modern vector art.\n\nSlightly round all corners of the color block shapes to avoid harsh points while maintaining an angular, faceted appearance.\n\nAvoid texture, brush strokes, realism, or painterly effects. The final image should feel clean, graphic, modern, and clearly readable on a small screen."
  },
  {
    name: "AOL AIM PROFILE",
    category: ["RETRO", "INTERNET", "2000S"],
    message: "Take a picture and transform it into a tiny, low-resolution AOL Instant Messenger profile photo. Crop awkwardly, reduce detail, and add heavy compression. The subject should remain recognizable but pixelated and informal."
  },
  {
    name: "ARCHEOLOGICAL PHOTO",
    category: ["MASTER PROMPT", "SCIENCE", "DOCUMENTARY"],
    message: "Take a picture and transform it into an archeological field documentation sheet. Include a large, visible photograph of the subject as the central element, printed on aged paper. The photo should appear weathered, sun-faded, dusty, and slightly warped, as if it has been exposed at an excavation site for weeks. Identify the subject’s species or type using scientific or pseudo-scientific labeling. Add subtle field notes, specimen numbers, scale bars, and catalog markings around the photo. The final image should feel like an authentic archeological record centered around the photograph."
  },
  {
    name: "ARCHITECTURAL SCALE MODEL",
    category: ["MINIATURE", "ARCHITECTURE", "MODEL"],
    message: "Take a picture and convert the scene into an architectural scale model. Subjects and objects should appear as miniature figurines within a foam-board or plastic model environment. Use clean edges, painted surfaces, and overhead lighting typical of design studios. Maintain proportional scale across all elements."
  },
  {
    name: "ARCHIVED PHOTO",
    category: ["VINTAGE", "DAMAGED", "HISTORICAL"],
    message: "Take a picture and transform it into a damaged archival photograph. Add scratches, dust, faded tones, and slight warping. Portions of the image may be torn, stained, or missing. Use muted sepia or desaturated colors. The subject should feel historical, fragile, and partially lost to time."
  },
  {
    name: "ART BRUT",
    category: ["ART", "NAIVE", "OUTSIDER"],
    message: "Take a picture and transform the image into Art Brut (outsider art) style painting. Use raw lines, naive proportions, uneven coloring, and spontaneous visual energy while preserving the subject."
  },
  {
    name: "ART DECO",
    category: ["ART", "DESIGN", "VINTAGE", "GEOMETRIC"],
    message: "Take a picture and transform the image into Art Deco poster style. Bold geometric shapes, metallic or pastel palette, stylized subject, decorative typography optional."
  },
  {
    name: "ART NOUVEAU",
    category: ["ART", "DESIGN", "VINTAGE", "ORGANIC"],
    message: "Take a picture and transform the image into a into an Art Nouveau illustration. Preserve the subject's identity, facial features, proportions, and pose. Use flowing, organic lines inspired by natural forms such as vines, flowers, and hair. Emphasize elegant curves, ornamental borders, and rhythmic linework. Flat or softly shaded color areas with muted, harmonious palettes. Decorative background integrated into the composition rather than separate. Poster-like composition inspired by Alphonse Mucha and late 19th-century European Art Nouveau. Painterly illustration style, not photorealistic. No modern elements, no Art Deco geometry, no hard angles."
  },
  {
    name: "ASCII ART",
    category: ["TEXT", "RETRO", "COMPUTER"],
    message: "Take a picture and render it in ASCII format, where shapes and tones are created using punctuation and letters and using only keyboard characters to form the image. Built entirely from text characters, using letters, numbers, and symbols arranged in clever patterns. The image has a retro, digital feel, like something you would see on an old computer screen or printed in a vintage tech lab."
  },
  {
    name: "ASHCAN SCHOOL",
    category: ["ART", "PAINTING", "REALISM"],
    message: "Take a picture and transform the image into an Ashcan School style painting. Gritty realism, urban atmosphere, loose brushwork, and muted tones. Subject feels candid and grounded."
  },
  {
    name: "AUSTRALIAN ABORIGINAL DOT PAINTING",
    category: ["ART", "CULTURAL", "INDIGENOUS"],
    message: "Take a picture and transform the image into Aboriginal dot painting style. Use dot patterns, symbolic shapes, earthy palettes, and rhythmic repetition while preserving the subject’s silhouette."
  },
  {
  name: "AVATAR",
  category: ["MOVIES", "SCI FI", "CREATURE"],
  message: "Take a picture and transform the subject into a realistic Na’vi character from the movie Avatar. Preserve the subject’s recognizable facial structure, eye shape, expressions, body proportions, and personality while adapting them to authentic Na’vi anatomy—tall, slender physique, elongated limbs, blue bioluminescent skin with natural striping, feline nose structure, large expressive eyes, pointed ears, and long braided hair with neural queue. Translate the subject’s clothing and accessories into culturally accurate Na’vi attire and materials. Match the exact cinematic lighting, color grading, skin translucency, subsurface scattering, and environmental interaction seen in Avatar. The subject must appear fully native to Pandora, not human-painted blue, with realistic scale, shadows, and immersion in the world."
  },
  {
    name: "BACKUP SINGER",
    category: ["MUSIC", "HUMOR", "PERFORMANCE"],
    message: "Take a picture and place the subject into a live music performance as an off-key backup singer standing behind a talented lead singer or group.\n\nThe subject should be holding a microphone and singing enthusiastically but clearly out of sync or off-key. Other singers should be visibly reacting — giving awkward looks, side-eyes, or confused expressions.\n\nStage lighting, concert atmosphere, and microphones must feel realistic. The subject should be fully integrated into the performance, not pasted in.\n\nThe scene should feel funny, musical, and visually readable even on small screens."
  },
  {
    name: "BALD",
    category: ["HUMOR", "PORTRAIT", "TRANSFORMATION"],
    message: "Take a picture of the subject, human or animal, and make them completely bald.\n\nRemove all hair or fur from the head area so the scalp is fully visible.\n\nThe bald look should be smooth, clean, and slightly exaggerated for comedic effect.\n\nMake sure the head shape and lighting look natural so the baldness feels believable.\n\nThe final image should look like the subject has truly gone hairless, creating a funny and surprising transformation."
  },
  {
    name: "BALLERINA",
    category: ["HUMOR", "COSTUME", "PORTRAIT"],
    message: "Take a picture of the subject and dress them in a classic pink ballerina costume with a tutu, ballet slippers, and hair styled like a stage performer.\n\nThe same pink ballerina outfit must be used regardless of the subject’s gender or age.\n\nPlace the subject in a graceful ballet pose on a stage or in a dance studio, with soft theatrical lighting.\n\nThe contrast between the elegant ballerina outfit and the subject’s normal appearance should be part of the humor.\n\nThe final image should look like a real ballet photo shoot with playful, unexpected casting."
  },
  {
    name: "BALLOON",
    category: ["TOY", "INFLATABLE", "FUN"],
    message: "Take a picture in the style of a balloon animal or character.  Shiny latex texture."
  },
  {
    name: "BARBIE WORLD",
    category: ["TOY", "PINK", "DOLL", "POP CULTURE"],
    message: "Take a picture and transform the entire scene into a bright, stylized Barbie World composed entirely of physical toys.\n\nAnalyze the subject and environment and apply the following transformations:\n\n• If the primary subject appears feminine, transform them into a Barbie doll.\n• If the primary subject appears masculine, transform them into a Ken doll.\n\nThe doll’s face should retain the subject’s recognizable facial structure, proportions, and expression, but be rendered with smooth plastic skin, simplified features, glossy eyes, and the polished look of a physical Barbie or Ken toy.\n\nEnvironmental logic:\n• If the scene appears indoors, place the subject inside a Barbie Dreamhouse interior with pastel-colored plastic furniture, toy-like proportions, and miniature physical details.\n• If the scene appears outdoors, place the subject inside or next to a Barbie convertible with realistic toy textures, bright colors, and a glossy finish.\n\nUse high-key lighting, realistic toy textures, reflections, and scale consistency to ensure the subject and environment appear as physical toys rather than drawings or digital illustrations. Keep the composition bold, cheerful, and clearly readable on small screens."
  },
  {
    name: "BAROQUE",
    category: ["ART", "PAINTING", "CLASSIC", "DRAMATIC"],
    message: "Take a picture in the style of Baroque painting. Dramatic lighting, deep contrasts, dynamic composition, ornate details, and theatrical visual richness."
  },
  {
    name: "BAUHAUS",
    category: ["ART", "DESIGN", "MODERN", "GEOMETRIC"],
    message: "Take a picture and transform the image into Bauhaus style art. Reduce the subject to functional geometric forms, clean lines, primary colors, and minimal composition."
  },
  {
    name: "BBS DOWNLOAD",
    category: ["RETRO", "INTERNET", "90S", "GLITCH"],
    message: "Take a picture and transform it into the experience of a slow-loading 1990s internet image over a dial-up connection. Render the image as if it is partially downloaded, frozen mid-load, or failing to fully render. Randomly select and display exactly ONE of the following on-screen status messages, styled in a simple early-web or system monospace font:\n• \"Stuck at 87%\"\n• \"Connection Lost\"\n• \"Retrying…\"\n• \"Image Failed to Load (Alt Text Only)\"\n• \"Low Bandwidth Mode\"\n\nVisually reflect the selected status message in the image rendering:\n- If partially loaded, reveal only sections of the image using horizontal loading bands, blocky color fills, or coarse pixel previews.\n- If failed, leave large portions blank, replaced by placeholder space, broken image icons, or alt-text-style text.\n- If retrying, show uneven clarity with duplicated or misaligned segments. Preserve the subject’s recognizable features even when incomplete. Simulate authentic early-internet artifacts such as compression noise, color banding, abrupt resolution jumps, and unstable alignment. Include a minimal progress indicator or percentage counter when appropriate, ensuring all text is large and legible on small screens. The final image should feel frozen in time—nostalgic, frustrating, and unmistakably mid-download."
  },
  {
  name: "BIBLE VERSE",
  category: ["RELIGIOUS", "LESSON"],
  message: "Take a picture and analyze the subject’s appearance, expression, posture, and surrounding context. Select a Bible verse that best reflects the situation, moral lesson, warning, encouragement, or judgment suggested by the image, OR use a specific verse provided via external master prompt.\n\nTransform the image into a reverent, illustrated or photographic composition where the subject is visually connected to the chosen verse. The subject may appear within a symbolic scene, subtle vignette, or respectful setting that reinforces the meaning of the passage.\n\nInclude the full text of the selected Bible verse clearly displayed within the image, along with the book, chapter, and verse reference (for example: Proverbs 17:28). Ensure the text is legible on a small screen.\n\nUse a restrained, respectful tone. Avoid parody. The final image should feel like a devotional illustration or inspirational Bible page where the verse meaningfully corresponds to the subject’s traits or actions."
  },
  {
    name: "BIBLICAL ILLUSTRATION",
    category: ["ART", "RELIGIOUS", "MEDIEVAL"],
    message: "Take a picture in the style of a Medieval Biblical illustration. Illuminated manuscript style.  The result should be a full view of the illustration with a relevant background behind the illustration."
  },
  {
    name: "BILLBOARD",
    category: ["COMMERCIAL", "MASTER PROMPT", "ADVERTISING", "LARGE FORMAT"],
    message: "Take a picture and transform it into a large outdoor billboard featuring the subject. Include a clearly readable humorous headline and a calling number that can be appended via an external master prompt. The billboard should appear photographed from the street, with realistic perspective, lighting, shadows, and surrounding environment (sky, buildings, street). Ensure the subject is integrated naturally into the billboard image, and the text and number are large and legible even on a small screen."
  },
  {
    name: "BIRTHDAY CARD",
    category: ["GREETING", "MASTER PROMPT", "CELEBRATION", "CARD"],
    message: "Take a picture and transform it into a polished birthday greeting card design. Place the subject as the centerpiece of the card, integrated naturally into a celebratory scene with decorations such as balloons, streamers, confetti, or candles appropriate to the birthday theme. Generate a warm, fun, or heartfelt birthday message using flavor text inspired by the subject’s appearance, personality, and surroundings. Incorporate any externally provided birthday details naturally into the design. Ensure the full birthday message is clearly visible within the image. The final result should look like a professionally designed greeting card with cohesive layout, festive lighting, and joyful atmosphere.  The result should be a full view of the card with a relevant background behind the card."
  },
  {
    name: "BLADE RUNNER",
    category: ["MOVIES", "SCI FI", "CYBERPUNK"],
    message: "Take a picture and transform the image into a Blade Runner-inspired cinematic scene. Rain-soaked neon city, fog, reflections. High contrast, cyber-noir lighting. Photorealistic sci-fi atmosphere."
  },
  {
    name: "BLUEPRINT",
    category: ["TECHNICAL", "DESIGN", "ARCHITECTURE"],
    message: "Take a picture and transform the image into a blueprint technical drawing. White linework on blue background. Precise, schematic style."
  },
  {
    name: "BOARD GAME",
    category: ["HUMOR", "GAME", "RETRO", "POP CULTURE"],
    message: "Take a picture and transform the subject into the featured character on the front of a classic mass-market board game box inspired by iconic Hasbro or Mattel games (such as Life, Monopoly, Chutes and Ladders, Sorry!, Candy Land, or Trouble).\n\nDesign the image as a FULL, front-facing board game box, completely visible within the frame with no cropping. Show the box edges, title banner, age range, player count, and bottom information strip so it clearly reads as a real retail board game.\n\nSelect the specific game style automatically based on the subject’s appearance, mood, or environment:\n• Formal, confident, or businesslike → Monopoly-style\n• Cheerful, family-friendly, playful → Life-style\n• Childlike, whimsical, or silly → Chutes & Ladders or Candy Land-style\n• Chaotic or mischievous → Sorry! or Trouble-style\n\nIllustrate the subject in the exaggerated, cheerful illustration style typical of classic board game box art — expressive pose, simplified features, bright saturated colors, and bold outlines. The subject should feel like part of the original game universe, not a modern photo pasted onto a box.\n\nCreate a humorous game title or subtitle inspired by the subject, written in large, bold, vintage-style typography that closely resembles classic board game branding without copying exact logos.\n\nInclude playful, absurd supporting details such as:\n• fake player count and age range\n• a ridiculous but family-friendly game objective\n• small icon badges or bursts (\"Family Favorite!\", \"New Edition!\", \"Now With More Drama!\")\n\nEnsure everything is readable on a small screen. The final image should feel instantly recognizable as a classic toy-store board game from the 1960s–1990s — nostalgic, colorful, wholesome, and funny."
  },
  {
    name: "BOBBLEHEAD",
    category: ["TOY", "HUMOR", "MASTER PROMPT"],
    message: "Take a picture and transform the subject into a collectible bobblehead figurine. The head must be fully **toy-like**, made of smooth, glossy plastic with subtle reflections and soft highlights — it should **look like a manufactured bobblehead head**, not a human head. Enlarge the head relative to the body in true bobblehead style, with slightly exaggerated cartoonish features while keeping the subject recognizable. Simplify details for a playful, toy-like appearance.\n\nRender the body smaller, proportionally correct for a bobblehead, with a plastic finish and soft shadows to make it look tangible. Place the bobblehead on a small pedestal, fully visible in the frame.\n\nGenerate the honorary title dynamically using humorous flavor text derived from the subject’s traits, pose, expression, clothing, or environment. For example, 'Supreme Caffeine Conqueror' for someone holding a coffee cup, or 'Master of Stillness' for someone sitting cross-legged. Keep the title bold, funny, and absurd.\n\nEnsure the full bobblehead and pedestal are visible, fully contained in the frame, and clearly readable on small screens. The final image should feel playful, exaggerated, **immediately humorous**, and unmistakably a **toy bobblehead** rather than a human figure."
  },
  {
    name: "BODY TYPE INVERSION",
    category: ["TRANSFORMATION", "BODY", "SWAP"],
    message: "Take a picture and transform the subject into a contrasting physique while preserving the subject’s recognizable facial structure, identity, posture, and personality. Adjust overall body proportions in a realistic and natural way, maintaining anatomical plausibility, balanced proportions, and consistent lighting. Adapt clothing to fit the updated physique naturally. Ensure the subject remains clearly identifiable and fully integrated into the scene, rendered with photorealistic detail."
  },
  {
    name: "BOKEH PHOTOGRAPHY",
    category: ["PHOTOGRAPHY", "ARTISTIC", "BLUR"],
    message: "Take a picture in the style of Bokeh photography. Give it the aesthetic quality of the blur in the out-of-focus areas of a photograph with soft, circular light spots. Wide aperture and a fast lens, with the subject at a different focal plane from the background. Creates a shallow depth of field, blurring the background to make the subject stand out and adding a dreamy or artistic quality to the image."
  },
  {
    name: "BOOK COVER",
    category: ["HUMOR", "PUBLISHING", "DESIGN", "POP CULTURE"],
    message: "Take a picture and transform it into a fully designed book cover featuring the subject as the author and central figure.\n\nDesign a complete, realistic book cover layout that is fully visible within the frame, including title, subtitle, author name, and background artwork. The subject should be integrated into the cover art itself (illustrated or photo-based depending on style), not pasted on top.\n\nGenerate the book’s title and subtitle using humorous flavor text inspired by the subject’s appearance, posture, expression, clothing, or environment. Examples:\n• \"How I Almost Had It Together\"\n• \"Leadership, Luck, and Lowered Expectations\"\n• \"The Art of Trying\"\n\nUse professional book-cover typography and composition appropriate to the genre (self-help, memoir, motivational, or absurd nonfiction). Optionally include fake bestseller badges, review blurbs, or award seals for added humor.\n\nIf external master prompt text is provided, use it to influence the book’s title, subtitle, or genre.\n\nEnsure the entire book cover is visible, centered, and readable on a small screen. The final image should feel like a real book you might actually see in a bookstore — polished, believable, and funny."
  },
  {
    name: "BREAKING NEWS",
    category: ["NEWS", "TV", "DRAMATIC", "MASTER PROMPT"],
    message: "Take a picture and transform it into a realistic breaking-news television broadcast scene. Place the subject as the central focus of the news coverage, integrated naturally into the scene. Design an authentic news layout including lower-third graphics, headline banners, and on-screen text. Generate a breaking-news headline and brief caption using flavor text inspired by the subject’s appearance, actions, or surroundings, incorporating any externally provided details naturally. Ensure all text is clearly readable within the image. Match professional broadcast lighting, camera angles, and visual polish so the image convincingly resembles a real live news report."
  },
  {
    name: "BROADWAY MUSICAL",
    category: ["THEATER", "MUSICAL", "BROADWAY", "STAGE", "PERFORMANCE"],
    message: "Take a picture and place the subject as a performer in a major Broadway musical production, randomly selecting from iconic shows: Cats, Wicked, Phantom of the Opera, Book of Mormon, Hamilton, Chicago, Les Miserables, Oklahoma, A Chorus Line, Fiddler on the Roof, West Side Story, Mamma Mia, Rent, or similar Broadway classics.\n\nCostume the subject in character-appropriate attire from the selected show - whether elaborate period costume, stylized animal costume with makeup, revolutionary-era clothing, 1920s jazz-age attire, fantasy witch costume, or show-specific signature looks. Include detailed makeup, wigs, and accessories specific to that production's aesthetic.\n\nPlace the subject on stage within an iconic scene from that musical, surrounded by other cast members in full costume performing alongside them. Include recognizable set pieces, props, and staging elements from that specific show - grand staircases, chandeliers, barricades, urban fire escapes, Pride Rock, etc.\n\nStage lighting should be dramatic theatrical lighting with colored gels, spotlights, dramatic shadows, and that distinctive Broadway stage illumination. Capture the energy of live performance with dynamic poses mid-song or mid-choreography.\n\nThe subject should be frozen in a performance moment - singing with emotion, dancing with ensemble, delivering dramatic dialogue, or in an iconic pose from that show. Expression should convey the theatrical emotion and energy of Broadway performance.\n\nInclude production value details: orchestra pit visible at stage edge, audience barely visible in darkness beyond footlights, theater architecture, or the massive scale of Broadway set design.\n\nThe final image should look like a professional production photograph from an actual Broadway show - theatrical, dramatic, high-energy, with spectacular costumes and sets. The subject should appear as a genuine Broadway performer seamlessly integrated into the iconic musical, capturing the magic and grandeur of live theater."
  },
  {
    name: "BUMPER STICKER",
    category: ["HUMOR", "CAR", "TEXT", "MASTER PROMPT"],
    message: "Take a picture and place a realistic bumper sticker on a car or object featuring the subject. The sticker should contain a humorous saying based on the subject’s traits, which can be supplied via external master prompt. Ensure the sticker looks physically attached, with correct perspective, lighting, texture, and slight surface curvature. The subject should be recognizable in the sticker image if included, and the overall composition should read instantly as a real bumper sticker."
  },
  {
    name: "BUSBY BERKELEY MUSICAL",
    category: ["MOVIES", "MUSICAL", "VINTAGE", "DANCE", "1930S"],
    message: "Take a picture and place the subject into an elaborate Busby Berkeley-style musical production number from 1930s-1940s Hollywood.\n\nThe subject should be positioned as the featured performer within Berkeley's signature kaleidoscopic geometric formations. Surround them with dozens of chorus dancers (showgirls) arranged in intricate patterns - circles, spirals, flower formations, or symmetrical designs viewed from an overhead camera angle.\n\nCostume the subject in glamorous 1930s-1940s musical attire: sequined or beaded costume, feathers, flowing fabrics, art deco-inspired design elements, ornate headdress, or elegant formal wear. Chorus dancers should wear matching elaborate costumes creating visual patterns.\n\nSetting should feature Berkeley's signature elements: glossy black reflective floors creating mirror effects, massive art deco sets with geometric staircases, enormous revolving platforms, dramatic columns, or abstract modernist backdrops. Include his famous overhead 'kaleidoscope' camera angle showing the full geometric pattern of dancers.\n\nLighting should be dramatic 1930s Hollywood style - strong key lights creating glamorous shadows, sparkle effects on sequins and reflective surfaces, high contrast black and white or early Technicolor look with saturated colors.\n\nChoreography frozen mid-movement: synchronized dancers in identical poses creating living geometry, the subject at the center or focal point of the formation, arms and legs positioned to create patterns, possibly using props like fans, hoops, or ribbons arranged symmetrically.\n\nThe final image should look like an actual still from a Busby Berkeley musical number - impossibly elaborate, geometrically precise, glamorous, and larger-than-life with that distinctive 1930s-1940s Hollywood musical spectacular aesthetic. Capture the opulence, precision, and visual innovation of Berkeley's choreographed patterns."
  },
  {
  name: "BUT CAN IT PLAY DOOM?",
  category: ["RETRO", "GAMING", "90S", "PIXEL"],
  message: "Take a picture and transform the subject into a classic early-1990s first-person shooter space marine rendered as a low-resolution pixel-art sprite. Preserve recognizable facial features, body proportions, and clothing identity while adapting them into a gritty, combat-ready sprite suitable for pseudo-3D FPS gameplay. Render the subject using chunky pixel shading, a limited retro color palette, visible dithering, and a forward-facing or slightly angled sprite orientation typical of early PC shooters. The character must appear natively integrated into the scene, not composited. Compose the image as a static gameplay frame from a first-person shooter perspective inside a dark industrial sci-fi environment with metallic corridors, harsh lighting, and ominous atmosphere. Include a bottom-of-screen retro FPS status interface featuring generic numeric indicators for health, armor, and ammunition, along with a small pixel-art player portrait that reflects the subject’s condition. Ensure the entire image reads clearly as a single authentic gameplay screenshot from a 1990s-era PC shooter, with crisp pixel edges, strong silhouette clarity, and cohesive retro aesthetics optimized for small screens."
  },
  {
    name: "BYZANTINE ICONOGRAPHY",
    category: ["ART", "RELIGIOUS", "MEDIEVAL", "GOLD"],
    message: "Take a picture and transform the image into a Byzantine-style religious icon. Place the subject in the center with a gilded halo, frontal pose, and flat symbolic colors. Add ornamental borders. The subject remains recognizable while adopting the solemn, formal, and spiritual style."
  },
  {
    name: "CALENDAR PIN-UP",
    category: ["HUMOR", "CALENDAR", "GLAMOUR"],
    message: "Take a picture and transform the subject into a playful, over-the-top calendar pin-up page in the style of novelty wall calendars sold in gift shops.\n\nIf the subject is male: place them as a heroic firefighter model wearing an open uniform shirt or tank top, helmet, and suspenders, posed confidently in front of a firehouse or fire truck.\n\nIf the subject is female: place them as a swimsuit calendar model wearing a stylish, tasteful swimsuit, posed confidently at a beach or poolside.\n\nThe mood should be fun, cheeky, and glamorous — never sexualized. Poses should feel like a commercial calendar shoot, not suggestive or explicit.\n\nInclude a full calendar layout with month name, dates, and a bold calendar title at the top. The final image should feel like a real novelty pin-up calendar page that someone might hang in an office or garage."
  },
  {
    name: "CANDY",
    category: ["FOOD", "SWEET", "TRANSFORMATION", "COLORFUL"],
    message: "Take a picture and make everything made out of candy. Glossy sweets, playful textures."
  },
  {
    name: "CARICATURE",
    category: ["HUMOR", "ART", "EXAGGERATED"],
    message: "Take a picture and make it a caricature. Defined by exaggerated features, bold expressions, and a humorous twist while preserving likeness. It captures the essence of a person or scene in a fun, over-the-top way, like something you would get from a street artist at a fair, bursting with personality and charm."
  },
  {
    name: "CARRY ME",
    category: ["HUMOR", "PHOTO", "SITUATIONAL", "MASTER PROMPT"],
    message: "Take a picture and transform it into a scene where one person is carrying the subject on their shoulders.\n\nIf there are TWO subjects in the image: Have one subject carrying the other on their shoulders. Choose based on context, size, or humor - the carrier should look strained, proud, or playfully struggling while the person being carried shows excitement, triumph, or awkward balance.\n\nIf there is only ONE subject in the image: A famous person (specified via master prompt, or choose an appropriate celebrity if none specified) will either carry the subject on their shoulders OR the subject will carry the famous person. The interaction should feel natural and humorous.\n\nBoth people should have realistic expressions: the carrier might show effort, determination, or playful annoyance; the person on shoulders might show joy, victory, fear of falling, or awkward balance with arms outstretched.\n\nPreserve recognizable facial features and body proportions for all people. The physical interaction must look believable - proper hand placement on legs/thighs, realistic weight distribution, natural body positioning.\n\nSet the scene in an appropriate context: concert crowd, celebration, sporting event victory, parade, beach, park, or casual outdoor setting. Include realistic background elements and other people reacting to the moment.\n\nLighting and photography should be photorealistic, as if captured during an actual candid moment. The final image must look like a real photograph of this playful, triumphant, or humorous shoulder-carrying moment."
  },
  {
    name: "CELL PHONE WALLPAPER",
    category: ["WALLPAPER", "MOBILE", "HUMOR", "DESIGN"],
    message: "Take a picture and transform the subject into a vertical smartphone wallpaper that looks like a fake, humorous phone operating system.\n\nUse a tall portrait aspect ratio (about 9:16 or taller). The subject should be the main character of the ‘phone,’ either as the lock-screen wallpaper or as a character integrated into the interface.\n\nOverlay a fake phone UI including:\n• a fake clock and date\n• silly or themed app icons inspired by the subject’s traits (e.g., \"Fart Tracker\", \"Overthinking\", \"Drama Meter\", \"Nap Mode\")\n• fake battery, Wi-Fi, and signal indicators with humorous labels\n\nAdd subtle cracked-glass lines across the screen — fine hairline fractures, small chips, or spiderweb cracks — so it looks like a phone with a lightly damaged display. The cracks should sit on top of the image like real broken glass, but must not block the subject’s face or important UI text.\n\nDesign the interface so it feels like a real smartphone screen but with absurd, playful details. Icons should be large, readable, and placed naturally like a real phone home screen.\n\nLeave the top and bottom areas clear enough that the subject’s face or main features are not blocked by UI elements.\n\nThe final image should feel like the subject owns their own ridiculous, slightly broken custom smartphone — funny, charming, and clearly readable on a small screen."
  },
  {
    name: "CELTIC ART",
    category: ["ART", "CULTURAL", "MEDIEVAL", "KNOTS"],
    message: "Take a picture and convert it into a Celtic art piece inspired by the Book of Kells; highly detailed, intricate knotwork, flowing lines, and mystical geometry with the visual language of ancient Celtic art; ornate patterns and symbolic forms."
  },
  {
    name: "CERAMIC FIGURINE",
    category: ["TOY", "COLLECTIBLE", "MINIATURE"],
    message: "Take a picture and transform the subject into a small ceramic figurine. The subject should appear glazed, hand-painted, and slightly imperfect, like a decorative shelf figurine. Use realistic reflections, chips, and glaze texture so it looks like a real ceramic object photographed on a table or shelf."
  },
  {
    name: "CERAMIC TILE",
    category: ["ART", "MOSAIC", "DECORATIVE"],
    message: "Take a picture and convert the image into painted ceramic tiles. Glossy glaze, repeating patterns."
  },
  {
    name: "CH-CH-CH-CHIA PET",
    category: ["HUMOR", "RETRO", "TRANSFORM"],
    message: "Take a picture and transform the subject into a Chia Pet terracotta planter. Subject should be shaped like a clay pottery figurine in terracotta orange-brown color with porous ceramic texture. Dense green chia sprouts growing from the top and surfaces, creating hair/fur effect with small green leaves. 1980s infomercial product aesthetic, sitting on surface, 'Ch-ch-ch-chia!' retro novelty gift appearance. Handmade pottery look with chia seeds sprouting lush greenery."
  },
  {
    name: "CHARACTER BOARD",
    category: ["HUMOR", "TOURIST", "CUTOUT"],
    message: "Take a picture and transform it into a classic tourist character board photo. Place the subject’s face inside a cut-out hole of a painted character illustration, while the rest of the body is a flat, illustrated scene. The board may depict a humorous, heroic, historical, or themed character. Align the subject’s face naturally with the cut-out and slightly exaggerate expression for comedic effect. The painted board should look weathered or hand-painted, as if found at a tourist attraction. The final image should feel playful, kitschy, and instantly recognizable as a face-in-the-hole photo."
  },
  {
    name: "CHARCOAL",
    category: ["ART", "DRAWING", "SKETCH"],
    message: "Take a picture and convert the image into a detailed charcoal sketch. Rich grayscale tones, textured shading, and expressive strokes on paper."
  },
  {
    name: "CIRCUS STAR",
    category: ["HUMOR", "STAGE", "SPECTACLE"],
    message: "Take a picture of the subject and place them as the star performer in a grand circus.\n\nThe subject should be in the spotlight as a ringmaster, acrobat, strong person, lion tamer, or other dramatic circus role.\n\nThe background should include a big top tent, audience, lights, and circus atmosphere.\n\nThe subject should be the clear center of attention, performing something impressive or ridiculous.\n\nThe final image should look colorful, theatrical, and larger-than-life, like a classic circus poster brought to life."
  },
  {
    name: "EL CHAVO",
    category: ["TV", "COMEDY", "MEXICAN", "RETRO", "SITCOM"],
    message: "Take a picture and transform the subject into a character from the classic Mexican television show El Chavo del Ocho.\n\nIf the subject is MALE: Transform them into either Quico or El Chavo del Ocho. Preserve the subject's recognizable facial features while adapting their appearance to match the character's iconic look - period-appropriate clothing from the 1970s Mexican sitcom, characteristic hairstyle, and the comedic expression associated with the character. El Chavo wears his iconic barrel-striped shirt and cap, while Quico wears his sailor suit or formal attire.\n\nIf the subject is FEMALE: Transform them into La Chilindrina. Preserve recognizable facial features while adapting to her iconic appearance - including her signature freckles, pigtails with bows, colorful patterned dress, and thick-framed glasses. Capture her mischievous, playful expression.\n\nThe setting should reflect the show's environment: the vecindad (neighborhood courtyard), with its characteristic architecture, stairs, doorways, and the nostalgic 1970s Mexican aesthetic. Include warm, slightly vintage color tones and lighting that matches the show's classic filmed appearance.\n\nThe transformation should be photorealistic but capture the comedic, innocent, and nostalgic spirit of the beloved show. Expressions should be playful, exaggerated, or characteristic of the specific character's personality - El Chavo's innocent confusion, Quico's spoiled bratty attitude, or La Chilindrina's clever mischievousness.\n\nMaintain the subject's identity while fully immersing them in the iconic visual world of El Chavo del Ocho with period-accurate costumes, setting, and the show's signature warm, nostalgic atmosphere."
  },
  {
    name: "CHECKMATE",
    category: ["HUMOR", "CHESS", "GAME", "STRATEGIC"],
    message: "Take a picture and transform the subject into ALL the chess pieces from one side (either white or black) positioned on an actual chessboard.\n\nThe subject's facial features, expressions, and personality should be adapted into EACH of the six different chess piece types: King, Queen, Rook (2), Knight (2), Bishop (2), and Pawn (8). Each piece should be a miniature sculptural version of the subject, maintaining recognizable identity while adapted to the specific piece's form and role.\n\nDesign variations for each piece type:\n- KING: Subject with crown, regal posture, tallest and most ornate\n- QUEEN: Subject with elaborate crown/headpiece, powerful stance, second tallest\n- BISHOPS: Subject with pointed mitre hat, diagonal-moving poses\n- KNIGHTS: Subject with horse-themed elements, dynamic action poses\n- ROOKS: Subject as tower/castle form, strong geometric base\n- PAWNS: Subject in simplified form, smallest and most numerous\n\nAll pieces should follow classic Staunton chess piece proportions but personalized with the subject's features, clothing details, or characteristics. Each piece should be clearly identifiable as both the subject AND the chess piece type.\n\nArrange all 16 pieces (1 King, 1 Queen, 2 Rooks, 2 Knights, 2 Bishops, 8 Pawns) in proper starting chess positions on a realistic wooden or marble chessboard. Include opposing traditional chess pieces on the other side for context and scale.\n\nLighting should be dramatic and strategic, casting shadows that emphasize the three-dimensional sculptural quality of each piece. Use proper perspective showing the full board setup.\n\nThe final image should look like a photograph of a complete custom chess set where every piece on one side is a personalized version of the subject, ready for an actual game. The subject becomes an entire army of chess pieces, not just one."
  },
  {
    name: "CHEER-LEADER",
    category: ["HUMOR", "SPORTS", "COSTUME"],
    message: "Take a picture and transform the subject into a female cheerleader regardless of their gender. Dress them in a classic cheerleading outfit with pom-poms, skirt, and team colors.\n\nGive them energetic poses, big smiles, and stadium or gymnasium background.\n\nThe result should be playful, confident, and clearly recognizable as a cheerleader scene."
  },
  {
    name: "CHEESE TOUCH",
    category: ["HUMOR", "FOOD", "ABSURD"],
    message: "Take a picture and transform the entire scene as if everything has been infected by a mysterious 'cheese touch.'\n\nConvert the subject, clothing, nearby objects, and visible environment into cheese-based versions of themselves. Use a variety of recognizable cheeses (cheddar, Swiss, mozzarella, brie, blue cheese, etc.) with appropriate textures, holes, melts, crumbles, and rinds.\n\nThe subject should still be clearly identifiable, but their skin, hair, and clothing should appear sculpted from cheese rather than flesh or fabric. Objects should retain their original shapes but be unmistakably made of cheese.\n\nAvoid cartoon flatness — cheese should look tactile, slightly glossy or matte depending on type, with realistic imperfections. Use playful lighting to emphasize texture.\n\nEnsure the entire composition remains readable on a small screen. The result should feel ridiculous, slightly disturbing, and very funny — as if reality itself has turned into cheese."
  },
  {
    name: "CHILDHOOD VERSION",
    category: ["AGE", "TRANSFORMATION", "YOUNG"],
    message: "Take a picture and depict the subject as a child while preserving recognizable traits. Soft lighting, nostalgic tone."
  },
  {
    name: "CHILD SKETCH ARTIST",
    category: ["ART", "NAIVE", "CHILD LIKE"],
    message: "Take a picture and make the subject look like a childlike black and white sketch using simple shapes as if drawn by a six year old."
  },
  {
    name: "CHINESE INK WASH",
    category: ["ART", "PAINTING", "ASIAN", "INK"],
    message: "Take a picture and transform the image into a traditional Chinese ink wash painting. Use flowing brushstrokes, monochrome tones, soft gradients, and poetic negative space."
  },
  {
    name: "CHOCOLATE SCULPTURE",
    category: ["FOOD", "SCULPTURE", "SWEET"],
    message: "Take a picture and transform the subject into a sculpted chocolate figure. The chocolate should appear glossy, slightly textured, and solid, with realistic reflections and subtle imperfections from molding.\n\nInclude a clearly visible bite taken from the subject, showing the inner texture of the chocolate. Preserve the subject’s recognizable facial structure and details through the chocolate form while maintaining realistic thickness and volume.\n\nThe subject should appear as a real chocolate sculpture placed on a surface, with appropriate shadows and lighting. Avoid CGI or drawn appearance. Ensure the composition is readable on a small screen and the chocolate looks physically edible."
  },
  {
    name: "CINEMATIC HORROR",
    category: ["HORROR", "MOVIES", "DARK"],
    message: "Take a picture and transform the subject into a cinematic horror character while preserving the subject’s recognizable facial structure, body proportions, and identity. Apply unsettling but non-graphic visual traits such as desaturated or ashen skin tones, darkened eye areas, an intense or vacant gaze, and subtly distressed clothing.  Ensure the subject appears physically present in the scene and fully integrated with the surroundings. Render the final image with photorealistic detail and a suspenseful horror aesthetic."
  },
  {
    name: "CITY IN TIME",
    category: ["MASTER PROMPT", "TRAVEL", "HISTORICAL", "LOCATION"],
    message: "Take a picture and place the subject standing naturally within a realistic urban environment. The city, location, and date are defined externally. Integrate the subject seamlessly into the scene so they appear physically present, with correct scale, perspective, lighting, shadows, and reflections. Match architecture, street layout, vehicles, signage, clothing styles, weather, and overall atmosphere appropriate to the specified city and date. Preserve the subject’s facial identity, proportions, posture, and personality while making the scene photorealistic and historically or contemporarily accurate."
  },
  {
    name: "CLASSIC TV COMMERCIAL",
    category: ["RETRO", "ADVERTISING", "HUMOR", "POP CULTURE"],
    message: "Take a picture and transform the subject into a scene from a famous classic television commercial. Select the commercial automatically based on the subject’s surroundings, visible objects, clothing, actions, or mood — for example:\n• A soda or bottle → Coca-Cola or Dr Pepper\n• Fast food context → Wendy’s or McDonald’s\n• Party or outdoor gathering → Budweiser\n• Family or wholesome setting → classic Coca-Cola or cereal ads\n\nPlace the subject directly INTO the commercial as if they are the main actor or spokesperson, fully integrated into the scene rather than pasted on. Adapt wardrobe, pose, expression, and lighting so the subject naturally belongs in the advertisement.\n\nRecreate the commercial’s iconic visual language: era-appropriate color grading, film grain, lighting style, set design, camera framing, and product placement. Use a cinematic still-frame composition that feels like a paused moment from a TV ad.\n\nInclude a famous, recognizable tagline from the chosen commercial displayed clearly within the scene (on-screen text, signage, packaging, or lower-third caption). The tagline must be fully visible, legible, and feel naturally embedded in the ad design.\n\nIf a real brand logo or product appears in the original image or is provided via external master prompt, prioritize selecting that brand’s commercial.\n\nEnsure the full frame is visible with no cropping of the subject, product, or tagline. When a brand is selected, prioritize its most iconic and culturally recognizable catchphrase from classic television commercials (e.g., Wendy’s “Where’s the Beef?”, Budweiser “Whassup!”, Coca-Cola “I’d Like to Buy the World a Coke”), and display it prominently. The scene should feel like a nostalgic parody or affectionate homage to the original commercial, not a modern advertisement or exact recreation. The final image should feel nostalgic, instantly recognizable, humorous, and clearly readable on a small screen — like a classic commercial screenshot frozen in time."
  },
  {
    name: "CLAYMATION",
    category: ["ANIMATION", "CLAY", "STOP MOTION"],
    message: "Take a picture and transform the image into claymation-style. Characters appear sculpted from clay with fingerprints and textures."
  },
  {
    name: "CLEANUP CHAOS",
    category: ["UTILITY", "ROOM", "TRANSFORMATION"],
    message: "Take a picture of a room or indoor space. Analyze the scene to determine whether it appears mostly clean or messy.\n\nIf the room appears messy or cluttered, transform it into a clean, organized version of the same space. Remove clutter, straighten objects, clean surfaces, neatly arrange items, and improve overall order while preserving the original layout, furniture, and lighting.\n\nIf the room appears clean or orderly, transform it into a realistically messy version. Add believable clutter such as scattered clothes, papers, cups, toys, or everyday items. Introduce mild disorder without destroying the room or making it unsafe.\n\nMaintain realism, consistent lighting, and the same camera perspective. The transformation should feel like the same room before and after tidying or neglect, and remain clearly readable on a small screen."
  },
  {
    name: "CLOUD NINE",
    category: ["ARTISTIC", "SURREAL", "TRANSFORMATION"],
    message: "Take a picture and transform the subject so it appears **entirely made of clouds**, with no remaining human, animal, or object materials visible.\n\nThe subject’s **entire form — head, body, limbs, and features — must be constructed exclusively from cloud matter**. Do not show skin, clothing, solid surfaces, or mixed materials. The subject must not appear inside clouds; the subject itself is the cloud.\n\nThe **overall cloud shape must follow the subject’s silhouette, posture, and proportions**. The subject’s outline governs the form.\n\nDetermine the cloud **type** as follows:\n• If the subject is animate (person or animal), select the cloud type based on the subject’s apparent emotion:\n  – Happy or playful → **Cumulus** (bright, puffy, well-defined)\n  – Sad, tired, or withdrawn → **Nimbostratus** (heavy, low, rain-filled)\n  – Angry, intense, or aggressive → **Cumulonimbus** (towering, dense, storm-like)\n  – Calm or neutral → **Stratus** (smooth, layered, subdued)\n• If the subject is inanimate, use **Altocumulus** clouds with a neutral, evenly spaced texture.\n\nUse cloud density, lighting, internal shadow, and volume to imply facial features, limbs, and expression without outlines or solid edges.\n\nAvoid solid ground unless contextually appropriate. Use sky gradients, mist, or distant horizons to support the illusion.\n\nEnsure the silhouette remains readable on a small screen. The final image should feel surreal, expressive, and poetic — as if the subject fully transformed into a specific type of weather."
  },
  {
    name: "COLLAGE",
    category: ["ART", "MIXED MEDIA", "PAPER"],
    message: "Take a picture in the style of an artistic paper collage with visible cut edges and layered materials."
  },
  {
    name: "COLLECTIBLE TOY",
    category: ["TOY", "PACKAGING", "COLLECTIBLE"],
    message: "Take a picture and transform the subject into a collectible toy encased inside its original packaging. Adapt the packaging style to match the type of toy: for example, a car becomes a Matchbox or Hot Wheels package, an action figure or superhero becomes a classic action figure box, a person becomes a Barbie-style doll package, etc. Use the subject’s characteristics, clothing, and personality to inspire the toy design and accessories. Generate flavor text and captions on the packaging based on the subject’s appearance, traits, and surroundings, making it feel like an authentic collectible. Ensure the subject remains recognizable while fully integrated as a toy. Render the final image in high detail with realistic reflections, packaging materials, and lighting, so it looks like a real collectible ready for display."
  },
  {
    name: "COMEDY CLASSIC",
    category: ["HUMOR", "MOVIE", "SCENE", "COMEDY"],
    message: "Take a picture of the subject and place them into a scene from a cult comedy film, such as *Ghostbusters*, *Animal House*, *Caddyshack*, *Some Like it Hot*, *Blazing Saddles*, *Annie Hall*, *Planes, Trains and Automobiles*, *The Hangover*, *Coming to America*, *Beverly Hills Cop*, *Trading Places*, *A Fish Called Wanda*, *Big Lebowski*, *Dazed and Confused*, or *Wayne's World*.\n\nThe subject should be integrated as the central focus, interacting with the environment and versions of the scene’s characters.\n\nProps, costumes, and lighting should match the film style, making the scene look like a real movie still.\n\nOptional flavor text from the master prompt can guide which gag or absurd twist is included (e.g., subject holding the proton pack upside-down, bowling in an exaggerated pose, or mimicking a famous line with a ridiculous expression).\n\nThe final image should be funny, cinematic, and instantly recognizable as a cult comedy film, with the subject as the star."
  },
  {
    name: "COMIC BOOK COVER",
    category: ["COMICS", "ART", "POP CULTURE"],
    message: "Take a picture and transform the subject into the star of a comic book cover in the style of either Marvel or DC.\n\nDesign a full comic book cover layout including:\n• Title logo\n• Issue number\n• Month and year\n• Price (e.g., $1.25, 75¢, $3.99)\n• Publisher seals, barcodes, or approval stamps\n\nThe subject should appear as a superhero or central character within a dramatic comic scene. Style can be classic or modern depending on external master prompt.\n\nIf external master prompt text specifies a franchise or hero (Spider-Man, Batman, Wonder Woman, Avengers, Justice League, etc.), base the cover on that property.\n\nThe final image must look like a real printed comic book cover."
  },
  {
    name: "COMIC SUPERHERO",
    category: ["COMICS", "SUPERHERO", "ACTION"],
    message: "Take a picture and transform the subject into a superhero inspired by their own traits, personality, or clothing. Preserve the subject’s recognizable facial features and body while designing a unique superhero identity based on what they are wearing or their notable characteristics. The superhero must wear a flowing cape integrated naturally into the costume. Show a full comic-book page with multiple panels depicting the subject in action, using powers or skills derived from their personal traits. Bold inks, vibrant colors, dynamic composition, and expressive onomatopoeia. Ensure the subject remains clearly identifiable while fully integrated into the comic-book superhero narrative."
  },
  {
    name: "COMPANY BADGE",
    category: ["OFFICE","HUMOR","DOCUMENT","PHOTO EFFECT", "MASTER PROMPT"],
    message: "Take a picture and transform the subject into an authentic corporate employee ID badge.\n\nThe final image must show the **entire badge fully visible** within the frame, oriented vertically or horizontally like a real workplace ID. Include realistic badge proportions, rounded corners, clip hole or lanyard slot, and slight plastic glare or lamination texture. The badge should appear photographed or scanned flat, not floating in space.\n\nPlace the subject’s photo in a standard ID photo area. The portrait should look like a real badge photo: neutral lighting, centered framing, simple background, and mild compression or sharpening typical of office badges.\n\nInclude the following badge details, all rendered clearly and legibly:\n• **Employee Name:** Generate a humorous but plausible name based on the subject’s appearance, expression, or clothing (unless overridden by external master prompt).\n• **Job Title:** Create a funny or exaggerated job title inspired by the subject’s visible traits or environment (e.g., \"Senior Snack Analyst,\" \"Head of Vibes,\" \"Chief Button Presser\").\n• **Employee ID Number:** Use a fictional numeric or alphanumeric code.\n• **Department:** Optional, humorous department name derived from context.\n\nInclude a **company name and logo**:\n• If a real company logo or branding is visible in the image, adapt the logo.\n• If a company name or logo is provided via external master prompt, use that name and create a believable logo mark to match.\n\nAdd small realistic badge elements such as barcodes, QR codes, issue dates, expiration dates, or security stripes. Text should look official but contain subtle humor when read closely.\n\nEnsure the badge feels professionally designed yet gently ridiculous. Avoid overt meme styling. The final image should feel like a real corporate badge that someone accidentally made funny, and it must be clearly readable on a small screen."
  },
  {
    name: "CONNECT THE DOTS",
    category: ["PUZZLE", "ACTIVITY", "LINE ART"],
    message: "Take a picture and transform it into a classic printable connect-the-dots puzzle. Reduce the image to a clean line-art outline that captures the essential shape and silhouette of the subject while removing unnecessary detail.\n\nPlace numbered dots along the outline and key interior contours in a **logical sequential order starting with number 1**, so that connecting the dots in order will clearly reveal the subject. Dots should be large, evenly spaced, and easy to follow.\n\nShow very minimal lines or connecting guides—only enough to hint at the outline if necessary, but primarily rely on the numbered dots. Avoid background details, shading, or other guides. Use high-contrast dots suitable for printing. Do not include text, instructions, or labels. The final image should resemble a traditional connect-the-dots puzzle where the user draws all connecting lines by hand, always beginning with dot 1."
  },
  {
    name: "CONSPIRACY WALL",
    category: ["HUMOR", "MYSTERY", "DOCUMENT", "ABSURD"],
    message: "Take a picture and transform the subject into the center of a chaotic conspiracy investigation wall.\n\nPlace the subject’s photo (or multiple cropped versions of them) pinned to a corkboard, surrounded by printed photos, scribbled notes, newspaper clippings, diagrams, and red string connecting everything.\n\nThe conspiracy theme should be automatically invented based on the subject’s appearance, environment, or actions — OR be influenced by external master prompt text if provided (for example: \"pizza\", \"aliens\", \"taxes\", \"office drama\", \"time travel\", etc.).\n\nUse absurd, humorous conspiracy logic. Examples:\n• 'Always near the coffee machine'\n• 'Was present every time the printer jammed'\n• 'Knows too much about Tuesdays'\n• 'Connected to the dog somehow'\n\nDo not include readable real-world sensitive data. All notes should be fictional, funny, and harmless.\n\nInclude red string connecting photos, arrows, circles, and question marks drawn in marker. The board should feel cluttered, frantic, and obsessed.\n\nEnsure the entire corkboard is fully visible in the frame. The final image should look like a deranged investigator has been tracking the subject for years."
  },
  {
    name: "CONSTELLATION",
    category: ["SPACE", "STARS", "NIGHT SKY"],
    message: "Take a picture and transform the subject into a living constellation in the night sky. Reimagine the subject’s silhouette, facial features, and pose as a pattern of glowing stars connected by faint celestial lines, while keeping their identity recognizable. Surround the subject with a deep, cosmic backdrop filled with nebulae, subtle stardust, and distant galaxies. Use soft glows, luminous highlights, and gentle gradients to create a magical, astronomical aesthetic. The subject should appear formed entirely from stars and light, as if they are part of the universe itself, rendered with crisp detail and awe-inspiring atmosphere."
  },
  {
    name: "CONSTRUCTIVISM",
    category: ["ART", "DESIGN", "SOVIET", "GEOMETRIC"],
    message: "Take a picture and transform the image into Constructivism style art. Bold geometry, diagonal compositions, limited color palettes, and graphic poster-like structure."
  },
  {
    name: "COPY MACHINE COPY",
    category: ["OFFICE","RETRO","HUMOR","DEGRADED"],
    message: "Take a picture and transform it into an authentic photocopier copy made by pressing the subject directly against the copier glass.\n\nThe final image must resemble a single sheet of copier paper viewed flat and fully visible within the frame, including paper edges and margins. Do not crop the page.\n\nThe subject should appear distorted from being pressed against the glass: flattened features, slightly squashed face or objects, widened nose, compressed cheeks, stretched hands or fingers, and uneven contact areas. The distortion should feel physical and silly, not warped digitally.\n\nApply classic photocopier artifacts: harsh black-and-white or muddy grayscale tones, blown highlights, crushed shadows, toner speckling, faint streaks, edge shadows from the copier lid, uneven exposure, and slight skew or rotation. Include faint dust marks or smudges typical of a well-used office copier.\n\nLighting should feel internal to the copier — flat, overexposed, and directionless — not like studio lighting. The background should be blank or show subtle shadows from the copier lid.\n\nOptionally include a small copier interface imprint or margin text such as page numbers, contrast indicators, or misaligned registration marks, rendered faintly and partially cut off.\n\nIf external master prompt text is provided, use it to influence the subject’s pose (e.g., face, hands, object pressed to glass) or tone of humor. The result should feel unmistakably like a dumb, impulsive office photocopy — absurd, tactile, and clearly readable on a small screen."
  },
  {
    name: "COURTROOM SKETCH",
    category: ["HUMOR", "DOCUMENT", "SKETCH", "CRIME"],
    message: "Take a picture and transform the subject into a courtroom sketch drawn by a courtroom artist.\n\nRender the subject in a loose, expressive pencil or charcoal style on off-white paper, with exaggerated but recognizable facial features, messy line work, and rough shading. The drawing should look like it was made quickly while observing the subject live in court.\n\nPlace the subject seated at a courtroom table or in the witness stand, with simplified figures of a judge, lawyers, or jury in the background.\n\nAdd subtle emotion based on the subject’s expression or posture — nervous, confused, smug, bored, or guilty — even if they are innocent.\n\nInclude a small caption area or handwritten label such as \"The Defendant\" or \"Key Witness\" (do not include real names unless provided via master prompt).\n\nThe entire sketch page should be fully visible within the frame, including paper edges. The final image should feel like a real courtroom artist drawing from a televised trial."
  },
  {
    name: "CUBAN ART STYLE",
    category: ["ART", "PAINTING", "MODERN"],
    message: "Take a picture and transform it into a Cuban art style illustration inspired by Cuban Modernism and Afro-Cuban visual traditions. Use bold tropical colors, strong outlines, flattened perspective, and expressive shapes.\n\nIncorporate cultural rhythms through movement, pattern, and color. The subject should feel integrated into a warm, vibrant Cuban environment, with subtle influences of Afro-Cuban symbolism, music, and everyday life.\n\nThe final image should feel expressive, soulful, colorful, and culturally rich rather than realistic or photographic."
  },
  {
    name: "CUBISM",
    category: ["ART", "PAINTING", "MODERN", "GEOMETRIC"],
    message: "Take a picture in the style of Cubist Art. Break objects into geometric forms and reassemble them from multiple viewpoints simultaneously, challenging traditional perspective and depth to emphasize the two-dimensional canvas."
  },
  {
    name: "CYBERPUNK",
    category: ["SCI FI", "NEON", "FUTURISTIC"],
    message: "Take a picture and transform the image into a cyberpunk scene. Neon lighting, futuristic city elements, holographic accents, and high-contrast color palette. Cinematic night lighting with tech-inspired details."
  },
  {
    name: "DADA",
    category: ["ART", "SURREAL", "ABSURD"],
    message: "Take a picture and transform the image into a Dada-style collage. Combine cut-and-paste textures, absurd juxtapositions, and fragmented composition. Subject recognizable within surreal elements."
  },
  {
    name: "DALÍ",
    category: ["ART", "SURREAL", "ARTIST"],
    message: "Take a picture and transform it into a painting of a surreal scene inspired by Salvador Dalí. Preserve the subject’s photographic realism while introducing dreamlike distortions, warped perspectives, melting forms, or impossible juxtapositions. Lighting should feel dramatic and hyper-real. The final image should feel uncanny, symbolic, and visually unsettling while still rooted in the original photo."
  },
  {
    name: "DANCING WITH THE STARS",
    category: ["HUMOR", "TV", "ENTERTAINMENT", "POP CULTURE"],
    message: "Take a picture and transform the subject into a scene from a glamorous ballroom dance competition show inspired by 'Dancing with the Stars.'\n\nDress the subject in an over-the-top, flashy dance costume — sequins, rhinestones, dramatic colors, exaggerated styling — appropriate for professional ballroom dancing.\n\nPose the subject mid-dance in a way that clearly suggests they do NOT know how to dance: awkward posture, stiff limbs, off-balance stance, mistimed spin, or exaggerated confusion. The humor should come from the contrast between the elegant setting and the subject’s obvious lack of dance skill.\n\nPlace the subject on a polished ballroom stage with dramatic lighting, spotlight beams, glossy floors, and a cheering audience in the background. The environment should feel high-budget and televised.\n\nOptionally include subtle show elements like judges’ tables, score paddles, or stage graphics — without copying logos.\n\nIf external master prompt text is provided, use it to influence the dance style, outfit theme, or tone (romantic, intense, chaotic, overly dramatic).\n\nEnsure the full subject, costume, and stage are visible and clearly readable on a small screen. The final image should feel like a frozen TV broadcast moment — glamorous, ridiculous, and instantly funny."
  },
  {
    name: "DATING PROFILE",
    category: ["HUMOR", "SOCIAL MEDIA", "PROFILE", "MASTER PROMPT"],
    message: "Take a picture and create a dating profile–style image of the subject. Present the subject as approachable, charismatic, and recognizable, integrated naturally into a clean and appealing profile-style layout. Generate humorous or charming flavor text and a short bio inspired by the subject’s appearance, clothing, accessories, and surroundings, incorporating any externally provided profile details naturally. Ensure all text is clearly readable within the image. Render the final result with flattering lighting, clear focus, photorealistic detail, and a lively, engaging composition."
  },
  {
    name: "DEEP THOUGHTS BY JACK HANDEY",
    category: ["HUMOR", "ABSURD"],
    message: "Take a picture and transform it into a minimalist, deadpan inspirational-style image inspired by 'Deep Thoughts by Jack Handey.' The subject should appear calm, neutral, or unintentionally serious, regardless of how absurd the final message is.\n\nSelect ONE original 'Deep Thoughts by Jack Handey' quote and present it as the affirmation text. The humor should come from the contrast between the sincere visual tone and the unexpectedly absurd or philosophical text.\n\nCompose the image simply and cleanly: the subject centered or thoughtfully framed, with the quote displayed clearly beneath or overlaid in an understated font. Do not explain the joke. Do not exaggerate expressions. Let the humor remain dry and subtle.\n\nEnsure the entire image and text are fully visible and easily readable on a small screen. The final result should feel like a serious inspirational poster that accidentally delivers an absurd, ironic truth."
  },
  {
    name: "DESOMETRIC ART",
    category: ["ART"],
    message: "Take a picture in the style of desometric art."
  },
  {
    name: "DICTIONARY",
    category: ["TEXT", "REFERENCE", "DEFINITION"],
    message: "Take a picture and transform it into a dictionary-style entry. Include a small, clearly visible photograph of the subject placed beside or beneath the definition, similar to a modern illustrated dictionary. Allow externally provided language to define the entry name. Use a clean, minimal layout with strong typography. The photo should act as a visual reference for the word, reinforcing the definition."
  },
  {
    name: "DISNEY",
    category: ["ANIMATION", "CARTOON", "CLASSIC", "DISNEY"],
    message: "Take a picture in the style of a hand-drawn Disney character portrait from the golden age of animation."
  },
  {
    name: "DOLLAR BOB",
    category: ["DOCUMENT","HUMOR","VINTAGE","PARODY", "MASTER PROMPT"],
    message: "Take a picture and transform it into a parody paper currency bill with the subject’s face replacing the central portrait.\n\nThe final image must show the **entire bill fully visible** within the frame, flat and uncropped, with realistic proportions, borders, and margins of a classic U.S.-style dollar bill. Do not zoom in or cut off edges.\n\nRender the subject’s face as an engraved-style portrait suitable for currency printing. Preserve recognizable facial structure and expression, but translate it into fine linework, cross-hatching, and stippling so it looks printed, not photographic. The portrait should feel integrated into the bill design, not pasted on.\n\nDesign the bill with traditional currency elements:\n• Ornamental borders and scrollwork\n• Decorative frames and rosettes\n• Serial numbers (fictional)\n• Treasury-style seals (parody, non-official)\n• Micro-pattern textures and guilloché lines\n\nReplace all real-world identifiers with humorous equivalents:\n• Use a fictional denomination (e.g., \"$1 DOLLAR BOB,\" \"$3 DOLLAR BOB,\" \"$100 DOLLAR BOB\")\n• Replace national mottos with absurd or playful phrases inspired by the subject’s traits or posture\n• Include a humorous title beneath the portrait instead of a real name (e.g., \"In Snacks We Trust,\" \"Certified Snack Authority\")\n\nColor palette should resemble classic green-and-black currency ink on aged paper. Add subtle wear such as folds, creases, ink bleed, or slight yellowing for realism.\n\nIf external master prompt text is provided, use it to influence the denomination, slogan, title, or tone of the bill.\n\nAll text, seals, and symbols must be clearly fictional and parody-based. The final image should feel like a real banknote someone printed as a joke — detailed, tactile, nostalgic, and clearly readable on a small screen."
  },
  {
    name: "DOUBLE EXPOSURE",
    category: ["PHOTOGRAPHY", "ARTISTIC", "LAYERED"],
    message: "Take a picture and create a double-exposure composition.    Blend the subject with a secondary scene using transparent overlays. Clear silhouette, balanced negative space. Moody, artistic tone."
  },
  {
    name: "DRAG ME",
    category: ["HUMOR", "TRANSFORMATION", "GLAMOUR"],
    message: "Take a picture and transform the subject into a fabulous, over-the-top drag queen persona.\n\nPreserve the subject's recognizable facial structure and features while applying full drag transformation: dramatic contouring, bold eye makeup with exaggerated lashes and colorful eyeshadow, sculpted cheekbones, overdrawn lips with glossy or matte finish, and flawlessly blended foundation.\n\nAdd a show-stopping drag wig: big hair with volume, vibrant colors, styled with curls, waves, or dramatic height. The wig should be theatrical and attention-grabbing.\n\nDress the subject in glamorous drag attire: sequined gowns, feather boas, rhinestone-covered garments, platform heels, dramatic jewelry, or avant-garde fashion pieces. The outfit should be bold, confident, and unapologetically fabulous.\n\nPose and expression should exude confidence, sass, and star power - fierce, playful, or elegantly commanding.\n\nLighting should be stage-quality with a touch of theatrical glamour. Background can be a runway, stage, club setting, or dramatic backdrop with spotlights.\n\nThe final image must be photorealistic, celebrating drag artistry with respect, humor, and fabulous energy. Make it fierce, make it fun, make it unforgettable."
  },
  {
    name: "DREAM LOGIC",
    category: ["SURREAL", "ABSTRACT", "DREAMY"],
    message: "Take a picture and transform the image using dream logic. Disjointed scale, symbolic elements. Unreal but emotionally coherent."
  },
  {
    name: "DRIVERS LICENSE",
    category: ["HUMOR", "ID", "DOCUMENT", "MASTER PROMPT"],
    message: "Take a picture and create a realistic but clearly fictional driver’s license–style image featuring the subject’s photo. Randomly select a U.S. state and replicate the general visual layout, color scheme, typography style, and design motifs associated with that state’s driver license, while clearly presenting it as a non-functional, artistic replica. Use placeholder information, fictional identifiers, and decorative text rather than real personal data. Preserve the subject’s recognizable facial features and neutral ID-style expression. The final image should resemble a stylized prop or novelty card, not a real or usable identification document."
  },
  {
    name: "DUTCH GOLDEN AGE",
    category: ["ART", "PAINTING", "CLASSIC", "REALISTIC"],
    message: "Take a picture and transform the image into Dutch Golden Age painting. Realistic textures, warm tones, precise detail, dramatic lighting, and naturalistic surroundings."
  },
  {
    name: "DWARF",
    category: ["FANTASY", "CREATURE", "RPG"],
    message: "Take a picture and transform the subject into a fantasy dwarf while preserving the subject’s recognizable facial features, expressions, and identity. Adjust proportions to reflect a classic dwarf physique—shorter stature, sturdy build—while maintaining realism. Adapt clothing and gear into a believable fantasy style such as armor, leather, or artisan attire inspired by the subject’s original outfit. Place the subject into a detailed fantasy environment like a mountain hall, forge, or underground city. Use cinematic lighting, rich textures, and realistic materials to ensure the subject feels fully integrated into the fantasy world."
  },
  {
    name: "DYSTOPIAN",
    category: ["SCI FI", "DARK", "APOCALYPTIC"],
    message: "Take a picture in the style of a Dystopian future. Bleak atmosphere. Make it photorealistic."
  },
  {
    name: "EDO LANDSCAPE",
    category: ["ART", "ASIAN", "JAPANESE", "LANDSCAPE"],
    message: "Take a picture and transform it in the style of Japanese Edo period landscape prints. Include the subject in the scene while using clean outlines, flat color areas, and traditional compositional elements such as mountains, rivers, or bridges. The final image should feel elegant, balanced, and illustrative."
  },
  {
    name: "ELEMENTAL SELF",
    category: ["FANTASY", "ELEMENTAL", "MAGICAL"],
    message: "Take a picture of the subject and transform only the subject into a human embodiment of a natural element: fire, water, earth, wind, or lightning. The subject’s body, clothing, and aura should visually integrate the chosen element, flowing naturally with their pose and expression. For fire, incorporate flames, embers, and glowing heat; for water, use flowing currents, ripples, and reflective surfaces; for earth, integrate rocks, soil, foliage, or crystals; for wind, show swirling air currents, leaves, or flowing garments; for lightning, incorporate electric arcs, sparks, and glowing energy. Preserve the subject’s recognizable facial features, identity, and proportions. The background should remain completely normal and unaltered, making the elemental subject clearly stand out. Use dramatic lighting, dynamic motion, and atmospheric effects on the subject only, rendered in ultra-realistic detail with vivid colors, depth, and surreal impact."
  },
  {
    name: "EMBROIDERY",
    category: ["ART", "TEXTILE", "CRAFTS"],
    message: "Take a picture and transform the image into embroidery art. Thread textures, stitched lines, fabric background."
  },
  {
    name: "EMOJI THIS",
    category: ["EMOJI", "MODERN", "EXPRESSIVE"],
    message: "Take a picture and reinterpret the subject using expressive emoji language while preserving the photo’s composition, body posture, clothing, and context. Emojis should visually translate what is seen in the image using the following SIX priority categories, selecting at most ONE emoji from each category when applicable:\n\n1) Face / Emotion (highest priority):\nIf the subject is a human face, replace or overlay the face with ONE emoji matching the apparent expression or mood:\n• Happy / Smiling → 😀 😄 😁 😊\n• Laughing / Playful → 😂 🤣 😆 😹\n• Calm / Relaxed → 🙂 😌 😴 🧘\n• Surprised / Shocked → 😲 😮 😯 😱\n• Sad / Tired → 😢 😞 😔 😪\n• Angry / Intense → 😠 😡 🤬 😤\n• Confused / Dizzy → 😕 🤔 😵‍💫 🌀\n• Love / Affection → 🥰 😍 😘 ❤️\n\n2) Animal (if present):\nIf an animal is visible, include ONE appropriate animal emoji matching species and apparent mood:\n🐶 🐱 🐰 🐭 🐹 🐻 🐼 🐨 🐯 🦊 🐸 🐵 🐔 🐦 🐤 🐢 🐍 🐠 🐟\n\n3) Food & Drink:\nIf food or drink is visible or being consumed, include ONE relevant emoji:\n🍕 🍔 🌭 🌮 🍣 🍩 🍪 🍰 🥐 🥞 ☕ 🍺 🍷 🧃 🥤 🍎 🍌 🍓\n\n4) Objects / Tech / Props:\nIf the subject is holding or interacting with an object, include ONE relevant emoji:\n📱 💻 🎧 📷 🕶️ ⌚ 🎮 📚 💼 🔑 🧸 🎁 🛒\n\n5) Clothing / Accessories:\nIf notable clothing or accessories are present, include ONE emoji that best represents them:\n👕 👗 🧢 👒 👟 👠 👜 🎒 🧥 🧤 🕶️ 👓\n\n6) Activity / Context (lowest priority):\nIf the image clearly implies an activity or setting, include ONE emoji to reflect it:\n🎵 🎸 🎨 🏀 ⚽ 🚲 🎮 🧘 🏖️ 🏕️ 🏙️ ✈️ 🎉\n\nComposition Rules:\n• Use UP TO SIX emojis total, at most ONE per category.\n• Emojis should be large, clear, and visually blended into the scene.\n• Preserve the original photo’s background, body posture, and spatial layout.\n\nThe final image should feel playful, expressive, and instantly readable, as if the photo itself has been translated into emoji language."
  },
  {
    name: "EMOJI EXPLOSION",
    category: ["EMOJI", "ANIMATED", "EXPRESSIVE"],
    message: "Take a picture and reinterpret the subject using expressive emoji language. Render emojis as animated visual elements with subtle looping motion baked into the image. Match animation style to emotion and context:\n\n• Happy or playful emojis gently bounce or bob\n• Calm emojis softly pulse or breathe\n• Sad emojis slowly drift downward\n• Angry emojis subtly shake or vibrate\n• Surprised emojis pop or wobble briefly\n\nLimit motion to smooth, readable loops suitable for small screens. Preserve body posture, background, and context. The final output should feel alive, playful, and expressive, with animation enhancing—not distracting from—the image."
  },
  {
    name: "ENCYCLOPEDIA",
    category: ["MASTER PROMPT", "TEXT", "REFERENCE", "EDUCATIONAL"],
    message: "Take a picture and transform it into a fake encyclopedia entry. Include a clear photograph of the subject placed near the top or alongside the text as a reference image. Style the layout like a printed encyclopedia page with columns, captions, and figure labels. Use authoritative yet humorous flavor text describing the subject’s background, significance, or behavior. The photograph should feel like an official illustrative plate supporting the article."
  },
  {
    name: "ERA FILTER",
    category: ["MASTER PROMPT", "HISTORICAL", "TIME TRAVEL", "VINTAGE"],
    message: "Take a picture and transform the subject and scene to accurately reflect the era specified externally. Adapt clothing, hairstyle, accessories, environment, color palette, materials, technology, and overall visual language to match the chosen historical or cultural era. Preserve the subject’s recognizable facial features, proportions, and identity while blending them naturally into the era’s aesthetic. Ensure lighting, textures, and image quality reflect the photographic or artistic limitations typical of that time period. The final image should appear as if the subject genuinely existed and was photographed in that era, with no modern elements visible."
  },
  {
    name: "ESCHER",
    category: ["ART", "ILLUSION", "IMPOSSIBLE", "ARTIST"],
    message: "Take a picture and transform the image into an M.C. Escher-inspired impossible space. Non-Euclidean architecture."
  },
  {
    name: "ETCH A SKETCH",
    category: ["TOY", "RETRO", "LINE ART"],
    message: "Take a picture and recreate the subject as a classic Etch A Sketch drawing displayed inside a realistic Etch A Sketch toy. The entire red Etch A Sketch frame should be visible, including the screen area and the two control knobs at the bottom, so it feels like a photographed physical toy rather than a digital effect.\n\nRender the subject using continuous, thin, single-line strokes characteristic of Etch A Sketch drawings. Use simple outlines and minimal detail while preserving the subject’s recognizable shape and expression. The drawing should appear slightly imperfect, with subtle line wobble and overlaps consistent with manual knob control.\n\nEnsure the background is the Etch A Sketch screen texture, and keep the overall composition clean and centered. Do not add text or extra graphics. The final image should feel nostalgic, tactile, and immediately recognizable on a small screen."
  },
  {
    name: "EXAGGERATED TRAIT",
    category: ["HUMOR", "CARICATURE", "TRANSFORMATION", "MASTER PROMPT"],
    message: "Take a picture and transform the subject by exaggerating a single physical trait while preserving the subject’s recognizable identity and overall proportions. The exaggerated feature should be visually prominent but anatomically coherent, blending naturally with the subject’s face and body. Adapt lighting, shadows, and perspective so the transformation feels intentional rather than distorted. Integrate the subject seamlessly into the scene, maintaining realism or stylized realism depending on the chosen direction. Ensure the final result feels playful and striking."
  },
  {
   name: "EXPECTING?",
   category: ["HUMOR", "LIFE", "TRANSFORMATION"],
   message: "Take a picture and transform the subject into a visibly pregnant person regardless of gender.\n\nThe subject should appear proud and glowing, with a round belly, maternity clothing, and gentle, warm lighting.\n\nThe tone should be lighthearted, wholesome, and humorous rather than medical."
  },
  {
    name: "EXPRESSIONISM",
    category: ["ART", "PAINTING", "EMOTIONAL"],
    message: "Take a picture in the Expressionism artistic movement emphasizing subjective emotions and inner experiences, often distorting reality to convey intense emotions and psychological states."
  },
  {
    name: "EXTREME SPORTS MOMENT",
    category: ["SPORTS", "ACTION", "DRAMATIC"],
    message: "Take a picture and transform the subject into a randomly selected sporting competition, such as a professional team sport, individual athletic event, or outdoor extreme sport. Depict the subject performing the most dramatic, high-impact moment possible within that sport — for example, a powerful slam dunk, a full sprint at the finish line, a massive aerial maneuver, or a daring ascent up a mountain. Preserve the subject’s recognizable facial features, expression, and identity while adapting clothing, gear, and posture appropriate to the sport. Place the subject in an authentic, dynamic environment with motion, energy, and cinematic lighting so the action feels intense and exhilarating. The scene should capture a peak, frozen-in-time moment of athletic achievement with realistic scale, motion blur, and photorealistic detail."
  },
  {
    name: "FAIRYTALE PAGE",
    category: ["BOOK", "FANTASY", "ILLUSTRATION"],
    message: "Take a picture and make it into a page from a magical children fairytale book. Like a page pulled from a magical tale, a whimsical world of castles, forests, and enchanted creatures. Soft textures, rich colors, and fairytale-like details giving the image a dreamy, otherworldly feel.  The result should be a full view of the page with a relevant background behind the page."
  },
  {
    name: "FAIRYTALE MORAL",
    category: ["BOOK", "FABLE", "LESSON"],
    message: "Take a picture and transform it into an illustrated fairytale moral or fable lesson. Depict the subject as the central figure in a symbolic, storybook-style scene. Generate a short moral or lesson written beneath or beside the illustration using flavor text inspired by the subject’s appearance, actions, or surroundings, incorporating any externally provided details naturally. The moral should read like a classic fable conclusion. Ensure all text is clearly visible. The overall tone should feel whimsical, wise, and timeless.  The result should be a full view of the illustration with a relevant background behind the illustration."
  },
  {
    name: "FAMILY CREST",
    category: ["HUMOR", "HERALDRY", "PORTRAIT"],
    message: "Take a picture of the subject and turn them into the centerpiece of a grand family crest or coat of arms.\n\nPlace the subject’s face in the center of a shield surrounded by decorative symbols, banners, and icons that humorously represent their personality, habits, or interests.\n\nThe crest should include ornate scrollwork, ribbons, and classic heraldic styling.\n\nUse external master prompt text, if provided, to influence the motto, symbols, or family name.\n\nThe final image should look like a serious, medieval-style coat of arms, but with silly or absurd details that make it funny."
  },
  {
    name: "FAMILY HOLIDAY PHOTO",
    category: ["RETRO", "HUMOR", "PHOTOGRAPHY", "FAMILY"],
    message: "Take a picture and transform it into an awkward family holiday photo from the late 1980s or early 1990s.\n\nSelect a holiday automatically at random (e.g., Christmas, Thanksgiving, Easter, Halloween, Valentine’s Day, Fourth of July, New Year’s, or another widely recognized holiday), OR use a specific holiday provided via external master prompt.\n\nThe image should look like a staged holiday portrait taken with an on-camera flash: flat lighting, slight red-eye, soft focus, mild film grain, and dated color tones. The setting should feel like a living room or photo studio decorated for the chosen holiday.\n\nInclude classic, slightly tacky holiday decorations appropriate to the selected holiday. Decorations should feel excessive, mismatched, or unevenly arranged (e.g., too many balloons, awkward banners, cheap props, cluttered tables, or off-theme color combinations).\n\nDress all subjects in era-appropriate holiday clothing that clashes or feels uncomfortable. Examples include ugly sweaters, oversized cardigans, patterned vests, turtlenecks, stiff dresses, themed novelty outfits, or poorly coordinated formalwear. Hairstyles should be dated and awkward: big teased hair, perms, mullets, bowl cuts, feathered bangs, or obvious hairspray volume.\n\nSubject logic:\n• If there is ONE subject, surround them with added family members (parents, siblings, or relatives) who look mismatched or emotionally disconnected.\n• If there are MULTIPLE subjects, present them as a family group standing or sitting closely together.\n\nBody language should feel tense or unnatural: forced smiles, blank stares, crossed arms, stiff posture, uneven spacing, or someone clearly looking away from the camera. Not everyone should appear happy at the same time.\n\nOptionally include a dated holiday banner, sign, or photo caption naming the holiday and year (use external master prompt text if provided; otherwise invent a plausible holiday label and year).\n\nEnsure the entire photo is fully visible within the frame, like a complete printed holiday portrait. The final image should feel uncomfortably nostalgic, unintentionally funny, and instantly recognizable as an awkward family holiday photo — clearly readable on a small screen."
  },
  {
    name: "FATE BOOK",
    category: ["FANTASY", "MYSTICAL", "PROPHECY"],
    message: "Take a picture and transform it into a dramatic illustrated page from an ancient Book of Fate or Destiny. Present the subject as the central figure of a foretold prophecy, depicted in a mythic or symbolic scene that reflects their appearance, posture, and personality. Surround the subject with aged parchment textures, arcane symbols, constellations, or subtle mystical motifs. Generate a short prophecy-style passage written in poetic language inspired by the subject’s visual traits and surroundings, incorporating any externally provided details naturally. Ensure the entire prophecy text is fully visible and integrated into the page design. The final image should resemble a sacred manuscript or legendary tome, with cinematic lighting, rich detail, and an epic, timeless atmosphere.  The result should be a full view of the page with a relevant background behind the page."
  },
  {
    name: "FAUVISM",
    category: ["ART", "PAINTING", "COLORFUL"],
    message: "Take a picture and transform the image into Fauvist style painting. Intense, vivid colors, simplified forms, and expressive brushwork while keeping the subject identifiable."
  },
  {
    name: "FAX MACHINE COPY",
    category: ["RETRO","OFFICE","DEGRADED","HUMOR", "MASTER PROMPT"],
    message: "Take a picture and transform it into an authentic single-page fax machine transmission from the 1980s–1990s.\n\nThe final image must look like a full sheet of faxed paper viewed flat and fully visible within the frame, including margins, header, and body. Do not crop the page.\n\nApply classic fax artifacts: harsh black-and-white contrast, dithering, streaking scan lines, slight skew, uneven toner density, paper curl shadows, compression noise, and faint horizontal banding. The subject should appear embedded within the faxed image area and degraded but still identifiable.\n\nAt the top of the page, include a standard fax cover header with the following sections, all rendered in simple monospace or office-style fonts and visibly degraded:\n\n• **From (Sender):** A humorous sender name, company, fax number, and phone number inspired by the subject’s appearance, clothing, posture, or environment (e.g., \"Gary from Accounting,\" \"Dept. of Snacks,\" \"Fax: 555-0199\").\n• **To (Recipient):** A humorous recipient name, organization, and fax number, derived from scene context or absurd office logic.\n• **Date:** A plausible transmission date (can be generic or stylized).\n• **Subject / Re:** A short, funny description of the fax contents based on the subject or scene (e.g., \"Urgent: Hat Situation,\" \"Re: Chair Malfunction Update\").\n• **Pages:** Include a page count such as \"1 of 1\".\n\nBelow the header, include a **Confidentiality Notice** in small text, written humorously but styled like a real legal disclaimer (e.g., warning unintended recipients to destroy the fax immediately or consult a supervisor named something absurd).\n\nAll names, numbers, and text must be fictional, non-sensitive, and clearly comedic. If external master prompt text is provided, use it to override or guide sender, recipient, subject line, or tone.\n\nEnsure the overall result unmistakably resembles a real faxed document rather than a modern filter. The page should feel outdated, bureaucratic, slightly ridiculous, and clearly readable on a small screen."
  },
  {
    name: "FAZZINO POP ART",
    category: ["ART", "POP ART", "LAYERED", "3D", "COLORFUL"],
    message: "Take a picture and transform it into a vibrant 3D layered pop art composition with multiple raised paper-cut levels creating extreme visual depth at miniature scale.\n\nStyle characteristics: Ultra-bright saturated colors with bold black outlines, flat color fills with minimal shading, playful exaggerated proportions and perspectives. The aesthetic should resemble colorful painted cardstock or screen-printed paper sheets stacked at different heights, rendered with realistic miniature scale and physical dimensionality.\n\nLayering structure: Divide the scene into at least 5-7 distinct depth levels with strong cast shadows between each layer emphasizing the sculptural three-dimensional quality.\n\nCRITICAL - PACK THE SCENE WITH MINIATURES: Fill every inch of the composition with abundant miniature elements densely arranged: tiny buildings with architectural details, miniature cars and vehicles, small-scale people figures, street signs, storefronts, windows, decorative patterns, architectural ornaments, repeating shapes, whimsical embellishments, busy textures, trees, street lamps, and countless playful visual elements. The scene should feel like a bustling miniature cityscape or metropolitan diorama with an overwhelming joyful abundance of tiny detailed objects all bunched together. No empty space - every area should be filled with miniature sculptural elements.\n\nCRITICAL - SUBJECT SCALE: Transform the subject into a three-dimensional miniature figure within this densely packed layered diorama at the EXACT SAME SMALL SCALE as all other miniature elements. The subject must be proportionally sized to match the tiny buildings, miniature cars, and small people figures surrounding them - NOT larger or more prominent. If buildings are 2-3 inches tall in the miniature scene, the subject figure should be appropriately scaled (roughly 1 inch or smaller if representing a person). The subject should appear as ONE SMALL ELEMENT among many in the busy cityscape, not dominating the composition. They must have physical depth and dimension like a detailed figurine, integrated naturally among all other miniatures at consistent scale.\n\nThe final result should look like a physical framed miniature diorama or shadow box photographed straight-on, showcasing vibrant metropolitan energy with extreme visual depth, realistic three-dimensional construction, CONSISTENT miniature scale throughout with the subject properly sized to match all surrounding elements, overwhelming joyful abundance of densely packed tiny details, and clear dimensional separation between layers. Everything - including the subject - should appear as real miniature sculptural objects at the same small scale, bunched together in a busy, celebratory cityscape."
  },
  {
    name: "FELT PUPPET",
    category: ["TOY", "PUPPET", "CRAFTS"],
    message: "Take a picture and transform the image into a felt puppet scene. Soft fabric textures, handcrafted appearance."
  },
  {
    name: "FEUDAL JAPAN",
    category: ["HISTORICAL", "ASIAN", "SAMURAI"],
    message: "Take a picture and place the subject in feudal Japan as a samurai. Preserve facial identity and physique. Authentic armor, period setting, cinematic lighting."
  },
  {
    name: "FIELD GUIDE",
    category: ["NATURE", "REFERENCE", "MASTER PROMPT", "SCIENTIFIC"],
    message: "Take a picture and transform it into a field guide page. Include a clear photograph of the subject as the main reference image, labeled as a specimen photo. Add a species name (real or humorous), habitat, behavior notes, and identifying traits. Use the visual style of a naturalist’s guidebook. The photograph should appear as a documented observation supporting the entry."
  },
  {
    name: "FIFTH BEATLE",
    category: ["MUSIC", "60S", "ROCK", "ICONIC", "BRITISH"],
    message: "Take a picture and insert the subject as the fifth member of The Beatles in one of their iconic photographs. Randomly select from these famous scenes:\n\nABBEY ROAD CROSSING: Place the subject walking in line with the four Beatles across the zebra crossing on Abbey Road. The subject should be dressed in period-appropriate 1969 clothing (suit, casual wear, or barefoot like one member). Match the walking stride and positioning. Background shows the tree-lined London street.\n\nCOLORFUL MILITARY COSTUMES: Place the subject alongside the band wearing vibrant, elaborate military-inspired costume from 1967. Include ornate jacket with decorative elements, bright colors (pink, yellow, orange, blue), psychedelic era styling. Subject should be posed with the group in formal portrait arrangement.\n\nBEACH SCENE: Insert the subject playing in the ocean waves with the band at a beach. Everyone should be in 1964 swimwear or casual beach clothes, splashing in water, showing youthful energy and joy. Bright sunny beach setting.\n\nEARLY CLUB PERFORMANCE: Place the subject on stage with the band in a small underground club setting. Everyone wearing matching suits with narrow ties, distinctive 1960s hairstyles (mop-top or similar period style). Instruments visible, intimate venue with brick walls and low ceiling. Black and white or slightly muted color photography.\n\nAIRPORT ARRIVAL: Insert the subject descending airplane stairs or in terminal with the band, surrounded by crowds of fans and press photographers. Everyone wearing sharp matching suits, waving to camera. 1960s airport setting with vintage aircraft visible. Capture the excitement and chaos of fan mania.\n\nFor all scenarios:\n- Transform subject's appearance to match 1960s styling: period-appropriate haircut, clothing, and grooming\n- Match the photographic quality of the era: film grain, color processing, or black and white aesthetic specific to that time period\n- Preserve subject's recognizable facial features while adapting them to 1960s style\n- Integrate subject naturally as if they were always part of the group\n- Capture the specific mood and energy of that particular photograph\n- Use authentic 1960s photography techniques, lighting, and composition\n\nThe final image should look like an actual vintage photograph from the 1960s with the subject seamlessly integrated as a genuine fifth member of the band, matching the iconic style and feeling of the original scene."
  },
  {
    name: "FIGHT CLUB",
    category: ["HUMOR", "INJURY", "ACTION", "TOUGH"],
    message: "Take a picture and transform the subject to look like they've just been in a serious physical fight, with realistic battle damage and injuries.\n\nAdd visible injuries: a swollen black eye with dark purple bruising, a bloody nose with blood dripping or smeared on face, swollen or split lip, cuts and scrapes on face, reddened areas from impacts.\n\nClothing should be disheveled, torn, or stained with blood spots. Hair should be messy and out of place from the struggle.\n\nThe subject's expression should show exhaustion, defiance, toughness, or the aftermath of adrenaline - perhaps breathing heavily, grimacing, or showing a tough determined look despite the damage.\n\nOptional context: Background could suggest where the fight occurred (alley, gym, street, parking lot), possibly with other visual clues of the altercation.\n\nKeep all injuries photorealistic as if this is an actual photograph taken immediately after a fight. The damage should look fresh and recent with appropriate coloring for bruises (dark purple, red, swelling) and blood (realistic red, properly placed).\n\nPreserve the subject's recognizable facial features while adding realistic fight injuries and tough, battle-worn appearance. The mood can be serious or darkly humorous depending on the subject's expression."
  },
  {
    name: "FILM NOIR",
    category: ["MOVIES", "BLACK AND WHITE", "VINTAGE", "DRAMATIC"],
    message: "Take a picture and transform the image into classic film noir style. High-contrast black and white. Hard directional lighting, deep shadows, Venetian blind light patterns. Moody, dramatic composition."
  },
  {
    name: "FILTH MODE",
    category: ["HUMOR", "DIRTY", "GROSS"],
    message: "Take a picture and identify the main subject or object. Transform it so it appears dirty, neglected, or gross while preserving its shape and identity.\n\nAdd realistic grime such as dirt, mud, stains, splashes, smears, or dried mess. If appropriate, include cartoonishly unpleasant elements like poop, sludge, or foul residue applied to the object’s surface without obscuring it completely.\n\nEnsure the filth follows the object’s contours, texture, and lighting so it looks physically present rather than overlaid. The result should be visually obvious, humorous or shocking, and immediately readable on a small screen."
  },
  {
    name: "FIND ME",
    category: ["ILLUSION", "HIDDEN", "CAMOUFLAGE"],
    message: "Take a picture and transform the image so the subject is fully visible yet intentionally hidden through perfect visual camouflage. The subject’s clothing, colors, textures, and patterns must precisely match and continue the surrounding environment, making the subject difficult to distinguish at first glance. Do not remove or blur the subject — instead, conceal them through seamless pattern alignment, color continuity, and texture matching. The subject must remain physically present with accurate scale, lighting, shadows, and depth, so they clearly exist once noticed. Avoid outlines, highlights, or obvious separation; the concealment should feel deliberate, intelligent, and visually satisfying when discovered."
  },
  {
    name: "FORCED PERSPECTIVE",
    category: ["ILLUSION", "PHOTOGRAPHY", "TRICK"],
    message: "Take a picture and place the subject into a scene that uses forced perspective to create a clever visual illusion. The subject should appear to interact with large or distant objects using scale tricks (for example: pinching the sun, holding the moon, pushing a skyscraper, balancing a mountain on their palm). Carefully align scale, depth, and camera angle so the illusion looks intentional and realistic. Preserve the subject’s identity and integrate lighting, shadows, and perspective so the interaction feels physically believable and visually playful."
  },
  {
    name: "FOREVER STAMP",
    category: ["POSTAL", "MINIATURE", "VINTAGE"],
    message: "Take a picture and transform the subject into a large physical postage stamp. Show perforated edges, printed texture, ink dot patterns, and slight wear."
  },
  {
    name: "FRACTAL",
    category: ["MATHEMATICAL", "PATTERN", "ABSTRACT"],
    message: "Take a picture and transform the image using fractal geometry. Recursive patterns, infinite detail."
  },
  {
    name: "FREAKSHOW POSTER",
    category: ["HUMOR", "VINTAGE", "CIRCUS", "POSTER"],
    message: "Take a picture of the subject and transform them into the star of a vintage freakshow poster from the late 1800s or early 1900s.\n\nThe subject should be presented as a dramatic, mysterious attraction with exaggerated features, theatrical posing, and bold stage lighting.\n\nDesign the image like an old carnival poster, with ornate borders, hand-painted lettering, and weathered paper texture.\n\nInclude a sensational headline and dramatic tagline describing the subject as a strange or amazing curiosity, using humorous or absurd flavor text.\n\nThe final image should look like an antique circus sideshow poster advertising the subject as a spectacular and unbelievable attraction."
  },
  {
    name: "FREAKY FRIDAY",
    category: ["HUMOR", "SWAP", "TRANSFORMATION"],
    message: "Take a picture and if the picture contains two or more clearly visible subjects, perform a realistic multi-subject head swap by exchanging their heads between bodies. Preserve body posture, clothing, lighting direction, skin tone consistency, and camera perspective. Maintain natural neck alignment and correct scale so each swapped head fits the new body believably.\n\nIf exactly one subject is detected, perform an inverse face transformation by subtly mirroring or inverting the subject’s facial features while preserving overall realism, expression, and identity. The result should feel intentionally uncanny but not distorted.\n\nIf no subjects are detected, return the original image unchanged. The final image should be visually coherent and readable on small screens."
  },
  {
    name: "FRIDGE ART",
    category: ["ART", "HUMOR", "NAIVE", "CHILD LIKE"], 
    message: "Take a picture and transform the subject into a child’s crayon drawing displayed on a refrigerator.\n\nRender the subject as a deliberately crude crayon drawing with uneven proportions, simple shapes, wobbly outlines, and flat scribbled coloring. Facial features and limbs should be exaggerated or misaligned in a childlike way while still being loosely recognizable.\n\nUse a plain white or lightly stained paper background with visible crayon texture and pressure marks. Add misspelled handwritten text such as a name, age, or caption written in childlike lettering.\n\nAttach the drawing to a refrigerator using colorful magnets. Show part of the fridge surface, smudges, and nearby papers or photos.\n\nEnsure the entire drawing and fridge context are fully visible. The final image should feel innocent, funny, and unmistakably like real fridge art made by a child."
  },
  {
    name: "FROSTING CAKE ART",
    category: ["FOOD","HUMOR", "MASTER PROMPT"],
    message: "Take a picture and transform the subject into frosting-style artwork applied flat on the top of a cake. The subject should lie flush on the frosting surface — fully integrated — but the frosting itself should have realistic texture: piped swirls, slight ridges, creaminess, and subtle shadows so it clearly looks like real icing, not a topper.\n\nRender the subject simply, preserving only the most recognizable facial features, posture, or silhouette. Avoid overly detailed or three-dimensional features; the design should be believable as hand-piped or painted frosting.\n\nInclude realistic cake decorations such as frosting borders, small swirls, sprinkles, or minor fondant accents. If no external message is provided via master prompt, automatically add playful flavor text based on the subject: e.g., 'Happy 1st Birthday!' if the subject appears young, or 'Happy Retirement!' if the subject appears older.\n\nIf an external message is provided, append it naturally using piping-style lettering around the subject. Ensure the full cake top and subject are fully visible in the frame. Use soft, realistic lighting and perspective so the subject and frosting appear tactile and integrated. The final image should feel festive, humorous, and clearly readable on small screens, while lying flat on the cake surface."
  },
  {
    name: "FROZEN IN ICE",
    category: ["COLD", "ICE", "PRESERVED"],
    message: "Take a picture and make it appear as if the subject is frozen inside a clear block of ice. The ice should have realistic cracks, bubbles, frost, and refraction. The subject must be clearly visible through the ice, distorted slightly by thickness and trapped depth."
  },
  {
    name: "FUN-FLATABLE",
    category: ["FUN", "INFLATABLE", "HUMOR"],
    message: "Take a picture and transform the subject into an over-the-top inflatable mascot costume. Exaggerate proportions so the body is comically large and rounded, but keep the subject’s facial features visible on the inflated surface. Include whimsical folds, wrinkles, and inflated textures. Place the subject in a fun environment such as a stadium, street parade, or party. Ensure the entire inflatable is fully visible and clearly readable on a small screen, emphasizing absurd humor and playful energy."
  },
  {
    name: "FUNKO POP",
    category: ["TOY", "COLLECTIBLE", "POP CULTURE"],
    message: "Take a picture and turn the subject into a Funko Pop. Oversized head, simplified body."
  },
  {
    name: "FUTURAMA",
    category: ["CARTOON", "SCI-FI", "RETRO", "POP CULTURE"],
    message: "Take a picture and transform the subject into an animated character placed directly inside a Futurama-style scene alongside recognizable characters from the show.\n\nRender the subject in the same visual style as Futurama characters: clean bold outlines, flat cel shading, simplified geometric facial features, exaggerated eyes, smooth rounded head shapes, and bright saturated colors. Preserve the subject’s recognizability while fully adapting them into the cartoon style.\n\nPlace the subject INTO an iconic Futurama environment and scene, selected based on context or randomly, such as:\n• inside the Planet Express building or conference room\n• standing with Fry, Leela, and Bender in the Planet Express crew lineup\n• walking through New New York with futuristic buildings and flying cars\n• inside MomCorp, the Head Museum, or a sci-fi lab\n• in a space scene with Futurama characters reacting to the subject\n\nExisting Futurama characters may appear in the scene as supporting characters, background figures, or interaction partners, drawn accurately in their recognizable cartoon style. The subject should feel like a guest character naturally written into an episode, not pasted on top.\n\nAdapt the subject’s clothing into Futurama-appropriate outfits — delivery uniforms, sci-fi jumpsuits, futuristic casual wear, or humorous future attire inspired by their real clothing.\n\nUse simple painted backgrounds, clean animation lighting, and minimal texture consistent with hand-drawn cel animation. Avoid realistic shading or painterly effects.\n\nEnsure the full scene is visible and readable on a small screen, with the subject clearly identifiable among the Futurama characters. The final image should feel like a freeze-frame from an actual Futurama episode where the subject unexpectedly appears."
  },
  {
    name: "FUTURE SELF",
    category: ["AGE", "TRANSFORMATION", "OLD"],
    message: "Take a picture and depict the subject 20-40 years in the future. Preserve facial structure with realistic aging."
  },
  {
    name: "GAMEBOY",
    category: ["RETRO", "GAMING", "90S", "PIXEL"],
    message: "Take a picture and transform the subject into an authentic early-1990s monochrome handheld console display using a classic green dot-matrix screen aesthetic. Render the entire image as if it is displayed on a low-resolution reflective LCD with a pea-green color palette, dark olive shadows, and pale green highlights. Convert the subject into true dot-matrix pixel art using a visible grid of circular pixels, limited tonal steps, and strong contrast. Preserve the subject’s recognizable facial features and silhouette while adapting them to the constraints of a handheld screen resolution. Simulate real screen characteristics including pixel ghosting, motion blur trails, uneven refresh, slight vertical smearing, faint scan artifacts, and subtle screen noise. Avoid smooth gradients—everything should appear quantized and grid-based. Frame the image strictly as the handheld screen view itself, with a thin dark border suggesting the screen edge. Do not include logos, branding, or copyrighted UI elements. Optional minimal pixel indicators (numbers or icons only) may appear at the edges of the screen. Optimize for small screens with bold shapes, clear separation, and immediate readability. The final image should feel indistinguishable from a real dot-matrix handheld screen captured mid-use—nostalgic, tactile, and unmistakably retro."
  },
  {
  name: "GARDEN GNOME",
  category: ["HUMOR","TOY"],
  message: "Take a picture and transform the subject into a classic, life-sized garden gnome. Preserve facial recognition while giving the subject gnome features such as a pointed hat, whimsical clothing, and small props (e.g., shovel, lantern, mushroom). Place the gnome in a backyard or garden environment. Ensure the full gnome is visible, standing naturally, and clearly readable on a small screen. The final image should feel humorous, whimsical, and integrated into the scene."
  },
  {
    name: "GENDER INVERSION",
    category: ["HUMOR", "TRANSFORMATION", "GENDER", "SWAP"],
    message: "Take a picture and transform the subject into the opposite gender while preserving the subject’s core facial structure, expressions, and identity. Adjust facial features, body shape, hair, and secondary characteristics in a realistic and anatomically plausible way. Adapt clothing and styling to suit the transformed gender presentation while maintaining the subject’s original personality and essence. Ensure the subject appears naturally integrated into the scene, with consistent lighting, proportions, and photorealistic realism."
  },
  {
    name: "GHIBLI CAM",
    category: ["ANIMATION", "ANIME", "JAPANESE"],
    message: "Take a picture in the Studio Ghibli anime style-soft colors, whimsical atmosphere, and hand-drawn aesthetic."
  },
  {
    name: "GIANT WORLD",
    category: ["SIZE", "GIANT", "SCALE"],
    message: "Take a picture and transform the subject into a giant towering over the environment. Realistic scale interaction."
  },
  {
    name: "GLASS",
    category: ["MATERIAL", "TRANSPARENT", "SCULPTURE"],
    message: "Take a picture and transform everything into transparent glass. Refraction, reflections, caustic lighting."
  },
  {
    name: "GLITCH REALITY",
    category: ["DIGITAL", "GLITCH", "ERROR"],
    message: "Take a picture and introduce digital glitches into a realistic scene. Pixel tearing, compression artifacts. Reality appears corrupted."
  },
  {
    name: "GLOSSARY",
    category: ["MASTER PROMPT", "TEXT", "REFERENCE", "LABELED"],
    message: "Take a picture and create an image of a glossary identifying the main subject and a limited number of notable objects. Include the photograph prominently in the layout. Overlay clear letter markers (A, B, C, etc.) directly on or near each identified object in the image. Beneath the photo, create a glossary-style list where each entry begins with the matching letter and provides a brief description blending factual identification and light humor. Keep the layout simple and legible for a small screen. The photograph should clearly correspond to the labeled glossary entries."
  },
  {
    name: "GOTHIC MEDIEVAL ART",
    category: ["ART", "PAINTING", "MEDIEVAL", "GOTHIC", "ILLUSTRATION"],
    message: "Take a picture and transform the subject into a Gothic medieval-style artwork. Render the subject with elongated, dramatic proportions, stylized drapery, intricate patterns, and muted, earthy colors typical of 12th–15th century Gothic art. Include characteristic elements such as pointed arches, cathedral-like backgrounds, stained glass windows, ornate borders, and symbolic motifs.\n\nUse flat or slightly sculptural lighting with subtle gold leaf accents, emphasizing solemnity and reverence. Preserve the subject’s facial features and expression while adapting them to the medieval aesthetic.\n\nInclude a simple decorative frame, text banners, or illuminated manuscript-style captions if relevant, ensuring all elements are fully visible in the final composition. The final image should feel like a historical Gothic painting, dramatic and atmospheric, clearly readable on small screens, and fully contained within the frame."
  },
  {
    name: "GOUACHE ILLUSTRATION",
    category: ["ART", "PAINTING", "ILLUSTRATION"],
    message: "Take a picture and transform the image into a gouache illustration. Matte textures, bold shapes, opaque color layers, and crisp edges while preserving subject identity."
  },
  {
    name: "GRAFFITI",
    category: ["ART", "STREET", "URBAN"],
    message: "Take a picture in the style of Graffiti Art. Spray paint textures, urban wall surface."
  },
  {
    name: "GRIMMS FAIRY TALE",
    category: ["STORYBOOK", "KIDS", "LESSON"],
    message: "Take a picture and transform the subject into a character within a Grimm’s fairy tale. Select a fairy tale based on the subject’s appearance, posture, expression, or perceived traits (such as innocence, cleverness, arrogance, bravery, curiosity), OR use a specific fairy tale provided via external master prompt.\n\nDepict the subject as a story character fully integrated into a classic Grimm-style fairy tale scene, not as a modern person placed into an illustration. The subject may appear as a human, villager, traveler, child, noble, or fairy-tale creature as appropriate to the chosen story. The environment and supporting elements should clearly reflect a traditional fairy tale setting such as forests, cottages, castles, roads, or village scenes.\n\nRender the image as a single illustrated storybook page. Ensure the entire page is fully visible within the frame, including margins, illustration, and text area. Do not crop or cut off any part of the page.\n\nInclude the **title of the selected fairy tale** prominently and clearly within the page layout, such as at the top of the page or as a decorative storybook heading. The title must be fully visible and immediately identifiable to the viewer.\n\nInclude a short fairy-tale caption or lesson within the page, such as a brief story excerpt, warning, or thematic line appropriate to Grimm’s fairy tales. The text should be legible, concise, and directly connected to the scene.\n\nUse a traditional fairy-tale illustration style inspired by 18th–19th century book engravings or painted storybook art. The tone may be whimsical, eerie, or cautionary, but not graphic. Keep the composition symbolic, atmospheric, and clearly readable on a small screen. The final image should feel like a complete, intact page from a Grimm’s fairy tale book."
  },
  {
    name: "H. P. LOVECRAFT",
    category: ["HORROR", "FANTASY", "SURREAL"],
    message: "Take a picture and place the subject into a dark, cosmic-horror world inspired by H. P. Lovecraft.\n\nThe subject should appear small or vulnerable within a vast, eerie environment filled with ancient ruins, strange symbols, impossible architecture, and unknowable cosmic forces.\n\nSubtle tentacles, eldritch shapes, or alien geometries may appear in the background, but do not overwhelm the subject.\n\nThe mood should feel ominous, mysterious, and otherworldly rather than gory."
  },
  {
    name: "HAIKU",
    category: ["POETRY", "JAPANESE", "ZEN"],
    message: "Take a picture and create a serene, minimalist scene inspired by classical Japanese aesthetics in the spirit of Matsuo Bashō. Emphasize simplicity, natural elements, quiet atmosphere, and contemplative mood. Use flavor text drawn from the subject’s presence, expression, and surroundings to compose a traditional haiku. Display the complete haiku fully and clearly within the image, ensuring all lines are legible and unobstructed. Integrate the text harmoniously into the scene, such as on parchment, a wooden plaque, or subtle calligraphy-style overlay. Render the final image with refined detail, soft lighting, and a calm, poetic visual balance."
  },
  {
    name: "HAIR COLOR TRY-ON",
    category: ["BEAUTY", "STYLE", "UTILITY"],
    message: "Take a picture of the subject and generate a 2×2 square grid showing four different hair colors applied to the same person. The face, hairstyle, lighting, and background must remain identical in all four panels — only the hair color changes.\n\nUse realistic hair coloring with natural highlights, shadows, and root blending. Avoid flat or painted-on color.\n\nSelect four distinct colors (such as blonde, brunette, black, red, fantasy colors, etc.), chosen to complement the subject’s skin tone.\n\nIf external master prompt text is provided (such as decade, fashion style, fantasy theme, or celebrity), apply it to the color choices.\n\nThe result should look like a professional salon color preview."
  },
  {
    name: "HAIRSTYLE TRY-ON",
    category: ["BEAUTY", "STYLE", "UTILITY"],
    message: "Take a picture of the subject and generate a 2×2 square grid showing four different realistic hairstyles on the same person. The subject’s face, lighting, pose, and background must remain identical in all four panels — only the hairstyle changes.\n\nEach panel should feature a distinct hairstyle (for example: short, long, curly, straight, layered, undercut, etc.), chosen to suit the subject’s face shape and hairline.\n\nUse high-quality, photorealistic hair rendering with correct lighting, shadows, and blending so the hair looks naturally attached to the subject’s scalp.\n\nIf external master prompt text is provided (such as era, fashion decade, celebrity inspiration, or theme), apply it consistently across all four hairstyles.\n\nThe final output must be a clean square grid with thin borders separating each option, designed to look like a professional virtual makeover preview."
  },
  {
    name: "HAIRSTYLE TRY-ON (FUNNY)",
    category: ["HUMOR", "STYLE"],
    message: "Take a picture of the subject and generate a 2×2 grid showing four wildly different, funny, or exaggerated hairstyles on the same person. Keep the face and pose identical in all panels.\n\nInclude ridiculous, over-the-top, or unexpected styles (for example: disco afro, medieval wig, anime hair, mullet, punk spikes, powdered wig, etc.).\n\nThe hair should still be well-rendered and attached realistically, even when silly.\n\nIf external master prompt text is provided (like era or theme), exaggerate it humorously.\n\nThe final result should feel like a comedy makeover show."
  },
  {
    name: "HAITIAN NAÏVE ART",
    category: ["ART", "CULTURAL", "COLORFUL"],
    message: "Take a picture and transform the image into Haitian naïve style art. Bright colors, flattened depth, decorative storytelling elements, and joyful visual rhythm."
  },
  {
    name: "HANNA-BARBERA",
    category: ["ART", "CARTOON", "RETRO"],
    message: "Take a picture and transform the subject into a classic Hanna-Barbera cartoon character rendered in authentic 1960s–1970s Hanna-Barbera animation style. Use bold black outlines, flat cel-shaded colors, limited animation aesthetics, simple geometric forms, and minimal shading. The subject should be fully redrawn to match the Hanna-Barbera look, not pasted or modernized.\n\nSelect ONE iconic Hanna-Barbera franchise and its signature setting, or lightly incorporate supporting characters from that franchise. Do NOT default to Scooby-Doo or Jetsons unless they are explicitly selected.\n\nPossible franchises and signature settings include, but are not limited to:\n• The Flintstones – prehistoric Bedrock, stone houses, foot-powered cars\n• The Jetsons – futuristic apartment, floating city, conveyor walkways\n• Yogi Bear – Jellystone Park with picnic tables and ranger elements\n• Super Friends – Hall of Justice with heroic poses and iconic silhouettes\n• Wacky Races – exaggerated race vehicles and chaotic motion\n• Hong Kong Phooey – janitor’s closet transforming into a hero scene\n• Josie and the Pussycats – live band performance on stage\n• Captain Caveman – cave interiors and club-based antics\n• Johnny Quest – adventure or science-lab environments\n• Space Ghost – retro space settings or villain confrontations\n• Fat Albert and the Cosby Kids – urban neighborhood streets, junkyard clubhouses, schoolyards, stoops, or classrooms with warm, grounded slice-of-life tone\n\nIntegrate the subject naturally into the chosen cartoon world as if they are a regular character in that series. The subject’s clothing, posture, and expression should adapt to the selected franchise’s style (for example: heavier rounded shapes and softer expressions for Fat Albert).\n\nUse era-accurate Hanna-Barbera background techniques such as painted cel backgrounds, stylized repeating scenery, retro props, and limited-animation staging. Color palette and line thickness should match the chosen franchise’s specific visual identity.\n\nThe final image should feel like a freeze-frame from an authentic Hanna-Barbera TV episode, nostalgic, playful, and clearly readable on a small screen."
  },
  {
    name: "HANS CHRISTIAN ANDERSEN",
    category: ["STORYBOOK", "KIDS", "LESSON"],
  message: "Take a picture and transform the subject into a character within a Hans Christian Andersen fairy tale. Select a tale based on the subject’s appearance, posture, expression, or perceived traits (such as innocence, longing, pride, loneliness, hope, sacrifice, or wonder), OR use a specific Andersen tale provided via external master prompt.\n\nDepict the subject as a story character fully integrated into a classic Andersen-style fairy tale scene, not as a modern person placed into an illustration. The subject may appear as a human, child, mermaid, toy, animal, noble, or symbolic figure depending on the chosen tale. The environment should reflect romantic, storybook settings such as seaside villages, snowy streets, royal halls, moonlit gardens, or candlelit interiors.\n\nRender the image as a single illustrated storybook page. Ensure the entire page is fully visible within the frame, including margins, illustration, and text area. Do not crop or cut off any part of the page.\n\nInclude the title of the fairy tale clearly displayed on the page (for example: 'The Little Mermaid,' 'The Ugly Duckling,' 'The Emperor’s New Clothes,' 'The Snow Queen,' or 'The Princess and the Pea'). The title must be legible and visually distinct so the viewer immediately recognizes the story.\n\nInclude a short poetic line, lesson, or emotional reflection appropriate to Hans Christian Andersen’s style. This may express a moral, irony, or bittersweet truth rather than a direct lesson. The text should be concise, legible, and emotionally connected to the scene.\n\nUse a classic 19th-century storybook illustration style inspired by delicate engravings, soft watercolor washes, or romantic ink drawings. The tone should feel whimsical, emotional, and slightly melancholic rather than comedic or dark. Keep the composition symbolic, gentle, and clearly readable on a small screen. The final image should feel like a complete, intact page from a Hans Christian Andersen fairy tale book."
  },
  {
    name: "HAPPY HOLIDAYS",
    category: ["MASTER PROMPT", "CELEBRATION", "HOLIDAY", "COSTUME"],
    message: "Take a picture and place the subject in a festive holiday-themed scene based on the closest holiday to the current date. Dress the subject in holiday-appropriate attire: for Christmas, an ugly Christmas sweater; Halloween, a generic costume; 4th of July, an Uncle Sam outfit; Oktoberfest, lederhosen; Thanksgiving, a Pilgrim outfit; Easter, a bunny outfit; New Year’s, a baby’s diaper or Father Time clothing with hourglass; Valentine’s Day, a Cupid outfit with bow and heart arrow; St. Patrick’s Day, a Leprechaun outfit; Cinco de Mayo, a Mexican sombrero. Integrate the subject naturally into a scene reflecting the holiday’s environment, decorations, and mood. Generate a humorous or festive holiday message caption based on the chosen holiday. Preserve facial identity, proportions, and personality while making the scene photorealistic, vibrant, and lively."
  },
  {
    name: "HAPPY MEAL PROMO",
    category: ["HUMOR", "TOY", "FAST FOOD", "RETRO"],
    message: "Take a picture and transform the subject into a featured kids’ fast-food meal toy promotion inspired by classic Happy Meal–style campaigns.\n\nPresent the subject as a small, inexpensive plastic toy figure with simplified proportions, glossy molded surfaces, visible seams, and limited articulation. The figure should clearly look like a real mass-produced kids’ meal toy — slightly stiff, charmingly cheap, and intentionally basic — not a cartoon illustration or realistic figurine.\n\nThe image MUST include a fully visible kids’ meal box in the frame. The box should be front-facing and unmistakable, with recognizable fast-food kids’ meal proportions (folded cardboard box with handle or clamshell shape). The toy should appear either:\n• displayed in front of the box, or\n• pictured on the box artwork itself, or\n• shown as part of a promotional display alongside the box\n\nDesign the scene as a complete toy promotion image with everything fully visible and uncropped. Include:\n• the kids’ meal box with bold colors and playful graphics\n• a toy name or toy series title inspired by the subject\n• an overly enthusiastic promotional phrase (e.g., \"Only in Kids’ Meals!\", \"Fun Inside!\", \"Playtime Included!\")\n• optional callouts like \"Collect Them All!\" or \"Limited Time\"\n\nThe toy’s pose, accessories, or expression should be humorously derived from the subject’s real traits, clothing, posture, or environment.\n\nAvoid using real fast-food brand logos unless explicitly provided via external master prompt. Instead, evoke a generic fast-food kids’ meal aesthetic through color, layout, typography, and packaging style.\n\nEnsure the entire kids’ meal box, toy, and promotional elements are fully visible and readable on a small screen. The final image should feel nostalgic, playful, slightly tacky, and instantly recognizable as a classic kids’ fast-food toy promotion from the 1990s–2000s."
  },
  {
    name: "HAUNTED EPITAPH",
    category: ["MASTER PROMPT", "HORROR", "HALLOWEEN", "SPOOKY", "TEXT"],
    message: "Take a picture and transform it into a playful, haunted graveyard scene inspired by classic theme-park haunted mansion aesthetics. Depict the subject as a stylized carved portrait, bust, or ghostly cameo associated with a decorative tombstone or memorial plaque, without implying real death. Create a humorous rhyming epitaph in the spirit of whimsical haunted mansion gravestones, using clever wordplay and flavor text inspired by the subject’s appearance, personality, clothing, or surroundings. Ensure the full rhyming epitaph is clearly visible and readable within the image. Use atmospheric lighting, fog, moonlight, and ornate stonework to create a spooky-but-fun tone. Keep the overall mood lighthearted, imaginative, and theatrical rather than dark or morbid.  The result should be a full view of the epitaph with a relevant background behind the epitaph."
  },
  {
    name: "HEAD SHOT",
    category: ["HUMOR", "PORTRAIT", "ACTING"],
    message: "Take a picture of the subject and turn it into a professional actor’s head shot.\n\nUse a clean studio background, flattering lighting, and a confident or dramatic pose.\n\nUse external master prompt text to supply an actor name and optional flavor text.\n\nAdd a humorous talent list next to or under the portrait, including strange or ridiculous talents no one would normally list, such as 'Expert at Awkward Silence', 'Professional Stand-up Philosopher', or 'Can Cry on Command When Impaled'.\n\nThe final result should look like a real casting profile with a ridiculous twist."
  },
  {
    name: "HIDDEN DETAILS",
    category: ["ILLUSION", "PUZZLE", "HIDDEN"],
    message: "Take a picture and transform the image so subtle hidden elements are embedded. Viewer should discover details only after close inspection."
  },
  {
    name: "HIEROGLYPHICS",
    category: ["TEXT", "ANCIENT", "EGYPTIAN"],
    message: "Take a picture and make it hieroglyphic art. Everything is converted to pictures and symbols etched onto a stone monument or drawn onto papyrus."
  },
  {
    name: "HISTORY",
    category: ["MASTER PROMPT", "HISTORICAL", "EDUCATIONAL", "TIME TRAVEL"],
    message: "Take a picture and place the subject seamlessly into a historical event that occurred on the date specified externally. Preserve the subject’s facial features, clothing, and posture while adapting them naturally to the historical setting, lighting, and perspective. Ensure the subject interacts believably with the environment, props, or people in the scene so they appear as an authentic part of the moment. Make the final image photorealistic and historically accurate, with no elements appearing out of place."
  },
  {
    name: "HOARDERS",
    category: ["HUMOR", "TV", "REALITY", "MESSY"],
    message: "Take a picture and transform it into a scene from the reality show 'Hoarders' with the subject surrounded by extreme clutter and accumulated items.\n\nThe subject should be standing or sitting in the middle of a severely cluttered room filled floor-to-ceiling with piles of stuff: stacks of newspapers and magazines, boxes overflowing with items, bags of belongings, old furniture piled up, random objects everywhere, narrow pathways through the clutter. The mess should be overwhelming and chaotic.\n\nItems can be themed for humor: all garden gnomes, excessive craft supplies, thousands of fast food condiment packets, walls of VHS tapes, mountains of beanie babies, or traditional hoarding clutter. Make it densely packed and overwhelming.\n\nThe subject's expression should show they see nothing wrong with the situation - casual, defensive, or attached to their items. Clothing can be casual or slightly disheveled.\n\nLighting should match reality TV documentary style - natural indoor lighting, slightly dim, authentic and unglamorous. The scene should feel claustrophobic with limited space to move.\n\nOptional elements: Concerned family member visible in background looking horrified, professional organizer or therapist trying to help, pets navigating through the clutter, visible dust or cobwebs adding to the neglected atmosphere.\n\nThe final image should look like an actual still from the Hoarders TV show - overwhelming clutter, reality TV documentary aesthetic, raw and authentic. The humor comes from the absurd amount of stuff and the subject's obliviousness to the extreme situation. Photorealistic with proper lighting and that specific reality TV look."
  },
  {
    name: "HOPPER",
    category: ["ART", "PAINTING", "AMERICAN", "ARTIST"],
    message: "Take a picture and transform it into a scene inspired by Edward Hopper. Preserve the photographic framing but simplify forms and use strong directional lighting. Emphasize isolation, stillness, and quiet atmosphere. Colors should be muted and shadows deliberate. The final image should feel contemplative and emotionally distant."
  },
  {
    name: "HOROSCOPE",
    category: ["MASTER PROMPT", "HUMOR", "TEXT"],
    message: "Take a picture and transform it into a deliberately silly horoscope-style image.\n\nDetermine the subject’s astrological sign based on externally provided input or infer one arbitrarily if none is supplied. Clearly display the astrological sign name and symbol.\n\nWrite ONE short horoscope message based on the subject’s visible traits, expression, posture, clothing, or situation. The horoscope must be humorous, blunt, and confidently ridiculous — it should sound specific, obvious, and completely unserious.\n\nUse flavor text to exaggerate mundane or trivial traits (e.g., procrastination, overconfidence, distraction, stubbornness) as if they are unavoidable cosmic truths. Avoid mystical language, poetic ambiguity, or generic fortune-cookie phrasing.\n\nInclude a clearly labeled \"Lucky Number\" that is intentionally useless, impractical, or meaningless (e.g., decimals, extremely large numbers, fractions, timestamps, negative numbers, or oddly specific values). The lucky number must not be applicable to gambling, dates, clocks, or real-world decisions.\n\nCompose the image like a fake astrology card or newspaper horoscope box. Keep the layout clean, bold, and readable on a small screen. Ensure the full card, sign, horoscope text, and lucky number are fully visible.\n\nDo not explain the joke. Do not add disclaimers. Treat the horoscope as completely accurate, no matter how absurd."
  },
  {
    name: "CLASSIC HORROR FILMS",
    category: ["HUMOR", "MOVIE", "SCENE", "HORROR"],
    message: "Take a picture of the subject and place them into a scene from a classic horror film, such as *Friday the 13th*, *Nightmare on Elm Street*, *The Shining*, or *Psycho*.\n\nThe subject should be the central figure, reacting to the horror environment or villain in a dramatic or exaggerated way.\n\nLighting, perspective, and props should match the iconic horror style — dark shadows, eerie lighting, and creepy set pieces.\n\nOptional master prompt text can add humorous twists (e.g., subject holding a comically oversized weapon, screaming dramatically, or unintentionally scaring the villain).\n\nThe final image should feel cinematic, instantly recognizable as a classic horror scene, and funny or absurd depending on the subject’s pose or expression."
  },
  {
    name: "I'M HUNGRY",
    category: ["FOOD", "TRANSFORMATION", "MASTER PROMPT"],
    message: "Take a picture and transform the subject into a figure entirely made out of real, non-candy food items (vegetables, fruits, grains, bread, pasta, cheese, etc.). Preserve recognizable features, proportions, and posture while rendering them in edible textures — e.g., eyes made of olives, hair as leafy greens, clothing patterns from colorful produce. Avoid candy or chocolate elements.\n\nPlace the food figure in a simple, neutral background such as a kitchen counter, plate, or wooden surface, with natural lighting and subtle shadows to make it appear tangible and realistic. Ensure the entire subject is fully visible.\n\nAdd playful flavor text to the scene automatically based on the subject, like 'Dinner is served!' or 'Eat your vegetables!' or allow the user to append a custom message via master prompt.\n\nThe final image should feel whimsical, absurd, humorous, and clearly readable on small screens, emphasizing the creativity of using ordinary food items to replicate the subject."
  },
  {
    name: "I'M WITH STOOPID",
    category: ["HUMOR", "TEXT", "SHIRT"],
    message: "Take a picture and transform it so one subject appears to be wearing an 'I'm with Stoopid' t-shirt that looks physically printed on the fabric, not digitally overlaid. The shirt should include natural folds, fabric texture, slight ink distortion, and perspective warping so the design follows the body realistically.\n\nIf only one subject is detected, display the text 'I'm with Stoopid' with a single large arrow pointing upward toward the wearer’s own head.\n\nIf two or more subjects are detected, place the shirt on the primary subject and display the text 'I'm with Stoopid' with one or more arrows pointing sideways or diagonally toward the other visible subjects. Arrows should clearly indicate the other subjects without overlapping faces.\n\nEnsure the text and arrows remain bold, high-contrast, and legible on small screens while maintaining a believable printed-shirt appearance. Preserve lighting consistency, fabric shading, and natural wrinkles so the shirt feels worn, not pasted."
  },
  {
    name: "I AM WITH THE BAND",
    category: ["MUSIC", "PERFORMANCE", "CELEBRITY", "MASTER PROMPT"],
    message: "Take a picture and place the subject as a member of a famous singer’s band or musical group. Preserve the subject’s facial features, personality, and clothing while transforming them into a musician integrated into the ensemble. The subject should be holding or playing a musical instrument appropriate to the scene (guitar, drums, keyboard, etc.) and positioned naturally among other group members. Capture stage lighting, performance energy, and the dynamic interaction of a live or recorded music setting. Ensure the subject remains clearly identifiable while fully integrated into the famous singer’s group performance."
  },
  {
    name: "ICE SCULPTURE",
    category: ["SCULPTURE", "ICE", "COLD"],
    message: "Take a picture and make subject into an ice sculpture. The sculpture has the clarity and sparkle of ice, often enhanced by lighting, to showcase its form. Clear, chiseled ice with internal refraction."
  },
  {
    name: "IDIOM",
    category: ["HUMOR", "LANGUAGE", "LITERAL"],
    message: "Take a picture and visually interpret a common idiom or phrase in a completely literal way. Place the subject directly inside the literal version of the expression (for example: head in the clouds, walking on thin ice, burning the midnight oil). Preserve realism in lighting and composition while embracing the absurdity of the literal interpretation. The scene should be instantly readable, humorous, and visually clever without requiring any text."
  },
  {
    name: "IF YOU THINK IT'S TRUE, IT'S SNOT",
    category: ["HUMOR", "GROSS", "EMBARRASSING"],
    message: "Take a picture and transform it into one of two embarrassing nasal situations - RANDOMLY CHOOSE ONE:\n\nOPTION 1 - VISIBLE BOOGERS: The subject is completely unaware they have visible nasal discharge (boogers) hanging from or under their nose. Add realistic mucus visible at the nostrils - it could be hanging, crusty, or dripping slightly. The subject's expression must show they are completely oblivious - looking normal, happy, confident, or engaged in conversation. They think everything is fine, making the situation more awkward and humorous.\n\nOPTION 2 - NOSE PICKING: The subject is actively picking their nose with their finger inserted into their nostril. They are completely absorbed in the act, unaware they're being photographed. The finger should be realistically positioned in the nose with appropriate hand placement. Their expression should show concentration or absent-minded focus on the task. This could be in a public setting, during a meeting, in a car, or any situation where nose-picking would be particularly inappropriate.\n\nFor both options: Include optional context that makes it worse - professional setting (meeting, presentation, date, interview), talking to someone, or what they think is a nice photo opportunity.\n\nKeep lighting and photography photorealistic. The humor comes from either the subject's obliviousness to the visible boogers OR being caught in the act of nose-picking.\n\nPreserve recognizable facial features while adding the unfortunate nasal situation."
  },
  {
    name: "IKEA INSTRUCTION MANUAL",
    category: ["HUMOR", "INSTRUCTIONS", "DIAGRAM"],
    message: "Take a picture and transform the subject into an illustrated instruction manual page, similar to a flat-pack assembly guide. Depict simplified, diagram-style versions of the subject in multiple steps, showing how the subject is assembled or functions. Use clean line art, minimal colors, arrows, step numbers, icons, and humorous warning symbols inspired by the subject’s personality, clothing, or posture. Avoid text-heavy explanations; rely on visual storytelling and pictograms. Present the final image as a complete instruction manual page with a clean layout and playful, clever tone."
  },
  {
    name: "INFINITY MIRROR",
    category: ["ART", "OPTICAL", "LIGHT", "INSTALLATION", "SURREAL"],
    message: "Take a picture and transform the subject into a real infinity-mirror light sculpture.\n\nThe subject must remain clearly recognizable (face, body, or object). Do NOT replace the subject with abstract light.\n\nConvert the interior of the subject into a two-way mirror cavity that creates infinite visual depth. The inside of the subject should look hollow and reflective, like a real infinity mirror, with reflections repeating deeper and deeper inside the subject’s shape.\n\nOutline the subject’s silhouette, facial features, or body shape using thin LED light strips (neon-style). These LEDs form the FRAME of the infinity mirror. The lights must only run along the subject’s edges, eyes, mouth, body outline, or major contours — NOT across the background.\n\nInside those glowing outlines, the mirror reflections should multiply the LEDs endlessly, creating the illusion of a glowing tunnel extending inward.\n\nThe surrounding environment should be dark or neutral so the infinity effect stands out, but the subject must not disappear into the background.\n\nDo NOT render this as a painting, illustration, or glowing person. It must look like a real physical infinity-mirror sculpture or wall installation photographed in a gallery.\n\nThe final image should look like a recognizable subject made of light and mirrors, with endless depth visible inside their face or body."
  },
  {
    name: "INFLATABLE POOL TOY",
    category: ["FUN", "INFLATABLE", "HUMOR", "TOY"],
    message: "Take a picture and transform the subject into a single, continuous inflatable pool toy. The subject’s entire body, including the head and face, must be made of inflated vinyl material — the subject is the pool float itself, not wearing or sitting in one.\n\nRender the face as part of the inflatable surface with printed or molded features, subtle distortions, and glossy reflections consistent with air-filled vinyl. Include seams, air valves, and slight shape irregularities.\n\nPlace the inflatable subject floating in water or resting poolside. Use realistic reflections, highlights, and water interaction. Ensure the entire inflatable is fully visible and readable on a small screen."
  },
  {
    name: "INFRARED",
    category: ["PHOTOGRAPHY", "TECHNICAL", "THERMAL"],
    message: "Take a picture and transform the image into infrared photography. Bright foliage, dark skies. Surreal tonal contrast."
  },
  {
    name: "INKBLOT",
    category: ["ART", "ABSTRACT", "PSYCHOLOGY"],
    message: "Take a picture in the style of an inkblot-style artwork. Abstract symmetry, flowing ink forms on paper."
  },
  {
    name: "INTERVENTION",
    category: ["HUMOR", "TV", "REALITY", "DOCUMENTARY"],
    message: "Take a picture and transform it into a scene from the reality show 'Intervention' where family and friends confront someone about a problem.\n\nThe subject should be seated, looking shocked, defensive, emotional, or in denial. Surround them with concerned family members and friends sitting in a semicircle, all looking serious and worried. Include an intervention specialist or counselor present.\n\nSetting should be a modest living room or community center room with folding chairs arranged in intervention style. Lighting should match reality TV documentary style - slightly dim, handheld camera aesthetic, authentic and raw.\n\nOptional humorous details: Instead of serious addiction, the intervention could be for ridiculous obsessions like 'collecting too many throw pillows,' 'excessive karaoke,' 'TikTok addiction,' 'spending too much on craft supplies,' or 'won't stop talking about their fantasy football team.'\n\nInclude tissues boxes visible, people holding letters they've written, emotional expressions of concern from family members. The subject should look caught off guard, emotional, or stubbornly defensive.\n\nThe aesthetic should match reality TV confessional style with that specific documentary lighting and framing. Optional: Include text overlay at bottom like reality shows use - 'Day 1 of Intervention' or subject's name and their 'problem.'\n\nThe final image should look like an actual still frame from the Intervention TV show - emotional, raw, documentary style, capturing that specific reality TV aesthetic. Make it photorealistic but the humor comes from either the absurd reason for intervention or the over-the-top dramatic reactions."
  },
  {
    name: "iPHONE CAMERA",
    category: ["PHOTOGRAPHY", "RETRO", "SMARTPHONE"],
    message: "Take a picture and transform it into an early smartphone camera photo. Use soft focus, blown highlights, muted colors, and slight motion blur. The subject should feel casual, imperfect, and authentically early-mobile."
  },
  {
    name: "IS IT CAKE?",
    category: ["HUMOR", "FOOD", "ILLUSION"],
    message: "Take a picture and transform the subject so it appears to be a realistic hyper-detailed cake. The subject should retain recognizable features but clearly be made of cake, frosting, fondant, and icing textures. Optionally show a slice cut out or a knife mid-cut revealing cake layers inside."
  },

  {
    name: "ISLAMIC MINIATURE",
    category: ["ART", "CULTURAL", "MIDDLE EASTERN"],
    message: "Take a picture and transform the picture into an Islamic miniature style painting. Flattened perspective, decorative borders, fine line work, intricate patterns, and vivid colors."
  },
  {
    name: "ISOMETRIC",
    category: ["DESIGN", "3D", "GEOMETRIC", "STRUCTURAL"],
    message: "Take a picture and completely reconstruct the scene using strict isometric projection.\n\nAll elements must be viewed from a fixed isometric angle (approximately 30–45 degrees) with no vanishing points, no perspective convergence, and no camera lens distortion. Parallel lines must remain parallel.\n\nRebuild the scene as simplified geometric forms aligned to an isometric grid. Convert subjects, objects, and environments into clean, block-like or planar shapes while preserving recognizable proportions and silhouettes.\n\nDepth must be represented only through isometric extrusion, vertical offsets, overlap, and stacking — not through blur, bokeh, or atmospheric effects.\n\nUse consistent lighting and shading across all surfaces to reinforce form and depth. Shadows should be crisp, directional, and uniform, matching the isometric angle.\n\nSurface detail should be simplified or removed. Avoid photographic textures, skin pores, fabric weave, or noise. Favor smooth, stylized surfaces suitable for a game map, architectural diagram, or technical illustration.\n\nThe final image should resemble a high-quality isometric game environment or design diagram — clean, readable, geometric, and clearly structured. Ensure the entire scene fits within the frame and remains legible on a small screen."
  },
  {
    name: "JAVERT PHOTOBOMB",
    category: ["HUMOR", "MOVIES", "PHOTOBOMB"],
    message: "Take a picture and add in the background Russell Crowe as Javert from Les Miserable photobombing the subject. Match lighting realistically."
  },
  {
    name: "JAPANESE SUMI-E",
    category: ["ART", "ASIAN", "INK", "ZEN"],
    message: "Take a picture and transform the image into Japanese sumi-e ink painting. Minimal brushstrokes, expressive ink flow, restrained composition, and elegant simplicity."
  },
  {
    name: "JOHANNES VERMEER",
    category: ["ART", "PAINTING", "CLASSIC", "ARTIST"],
    message: "Take a picture a make it into a vibrant, painterly portrait into a Dutch Golden Age portrait inspired by Vermeer. Soft window lighting, rich detail, oil paint texture, calm atmosphere."
  },
  {
    name: "JOHN HUGHES FILM",
    category: ["HUMOR", "MOVIE", "SCENE", "CULT CLASSIC"],
    message: "Take a picture of the subject and place them into a scene from a classic John Hughes film, such as *The Breakfast Club*, *Ferris Bueller's Day Off*, *Weird Science*, or *Sixteen Candles*.\n\nThe subject should be fully integrated into the scene, interacting naturally with the environment and other characters as if they are the main focus.\n\nCostumes, lighting, and props should match the era of the film — 1980s high school or suburban settings, vintage cars, lockers, diners, etc.\n\nOptional flavor text from the master prompt can influence the scene, such as having the subject deliver a famous line, partake in iconic antics, or create a humorous twist.\n\nThe final image should be cinematic, instantly recognizable as a John Hughes film, and funny or absurd depending on the subject’s pose or expression."
  },
  {
    name: "KAHLO",
    category: ["ART", "PAINTING", "ARTIST", "MEXICAN"],
    message: "Take a picture and transform it into a portrait inspired by Frida Kahlo. Center the subject prominently with symbolic elements drawn from nature or personal identity. Use bold colors, flat backgrounds, and strong outlines. The subject should feel emotionally direct, intimate, and iconic."
  },
  {
    name: "KEITH HARING",
    category: ["ART", "POP ART", "ARTIST", "GRAFFITI"],
    message: "Take a picture in the style of the American artist, Keith Haring. Bold black lines, energetic figures, flat colors."
  },
  {
    name: "KING OF THE WORLD!",
    category: ["HUMOR", "MOVIE", "SCENE", "ROMANCE"],
    message: "Take a picture of the subject and place them in the iconic *Titanic* scene on the ship’s bow, arms outstretched, shouting 'I’m the king of the world!'\n\nThe subject should be the central figure, fully integrated with realistic lighting, wind effects, and perspective from the bow of the ship.\n\nOptional flavor text from the master prompt can influence the subject’s pose, facial expression, or humorous twist (e.g., over-the-top excitement, exaggerated wind-blown hair, or slipping slightly).\n\nThe final image should feel like a dramatic cinematic still, instantly recognizable as the famous scene, but humorous and starring the subject as the protagonist."
  },
  {
    name: "KISS CAM",
    category: ["HUMOR", "PHOTO", "SITUATIONAL"],
    message: "Take a picture of one or more subjects and transform it into a humorous 'Kiss Cam' moment at a sporting event.\n\nRender the scene photorealistically as if captured by a live stadium camera. The subjects should have exaggerated expressions of shock, embarrassment, awkwardness, or confusion - not cartoonish.\n\nInclude realistic background elements: stadium seating, cheering crowd in soft focus, jumbotron screens, arena lighting, and authentic sporting venue atmosphere.\n\nThe awkwardness should feel authentic and relatable: subjects might be leaning away, covering their faces, looking in opposite directions, holding drinks or food awkwardly, or clearly unprepared for the moment.\n\nOptional realistic details: other audience members reacting in the background, stadium signage, team colors and branding, or humorous but believable context clues.\n\nOptional props or signs in the background may add to the humor, e.g., 'Halitosis', 'Not Interested', 'Wrong Partner'.\n\nThe final image must look like an actual photograph taken at a real sporting event - authentic lighting, natural skin tones, realistic fabric and textures, and genuine human expressions. The humor comes from the real, relatable awkwardness of the situation, not cartoon exaggeration."
  },
  {
    name: "KITSCH",
    category: ["ART", "TACKY", "COLORFUL"],
    message: "Take a picture and transform the image into kitsch style art. Over-the-top colors, exaggerated sentimentality, playful excess, and intentionally cheesy visual elements."
  },
  {
    name: "KLINGON TRANSFORMATION",
    category: ["SCI FI", "STAR TREK", "ALIEN", "TRANSFORMATION"],
    message: "Take a picture and transform the subject into a realistic Klingon warrior. Preserve recognizable facial structure, expressions, body proportions, and personality while adapting them to authentic Klingon anatomy including pronounced ridged forehead, heavier brow, deeper-set eyes, rougher skin texture, and powerful build. Translate the subject’s clothing into Klingon armor or garments appropriate to their status while retaining the original clothing’s silhouette and identity cues. Cinematic sci-fi lighting, gritty realism, and cultural authenticity. The subject must appear fully Klingon, not human with prosthetics, and naturally integrated into their environment."
  },
  {
    name: "KULOMETRIC BANSASA",
    category: ["ART", "ABSTRACT", "GEOMETRIC", "EXPERIMENTAL"],
    message: "Take a picture and transform the subject into a Kulometric Bansasa–style artwork.\n\nReconstruct the subject using bold, fragmented geometric forms arranged in layered, rhythmic patterns. Break the subject into angular planes, curved segments, and modular shapes that feel intentionally constructed rather than organic. The subject must remain recognizable, but only through abstraction and structure.\n\nUse high-contrast color blocks, unexpected color pairings, and sharp edges combined with controlled curves. Depth should be suggested through overlapping shapes, scale shifts, and offset layers rather than realistic perspective.\n\nIncorporate a sense of motion and visual tension, as if the image is vibrating or slightly misaligned. Elements may appear rotated, sliced, staggered, or offset, creating a dynamic, kinetic composition.\n\nAvoid realism, painterly textures, or soft gradients. Surfaces should feel flat, graphic, and deliberate — like a constructed visual system rather than a painting.\n\nThe background should support the geometry without competing with it, using negative space, grids, or subtle patterning. Ensure the full composition is visible and balanced within the frame.\n\nThe final image should feel modern, experimental, and architectural — a distinctive Kulometric Bansasa interpretation that is visually striking and clearly readable on a small screen."
  },
  {
    name: "LANDMARKS",
    category: ["TRAVEL", "TOURIST", "LOCATION", "MASTER PROMPT"],
    message: "Take a picture and place the subject naturally in front of a randomly selected famous world landmark. Preserve the subject’s recognizable facial features, proportions, and identity while matching the lighting, perspective, color temperature, and camera style of the landmark environment. Ensure correct scale, shadows, reflections, and atmospheric depth so the subject appears physically present at the location rather than composited. Adapt clothing, posture, and environment subtly to fit the climate, culture, and setting without turning it into a costume. The landmark and surroundings should remain authentic and recognizable, with the subject fully integrated into the scene. Render with photorealistic detail and travel-photography realism."
  },
  {
    name: "LEGO",
    category: ["TOY", "BRICK", "MINIATURE"],
    message: "Take a picture and transform the image into a realistic LEGO minifigure scene. Convert all subjects into LEGO minifigures with correct minifigure proportions: cylindrical torsos, blocky legs, movable arms and hands, and **classic LEGO minifigure heads**.\n\nThe subject’s head must be a smooth, cylindrical LEGO head with **all facial features painted directly onto the head**, including eyes, eyebrows, mouth, expression, facial hair, freckles, glasses, or other defining traits. Do NOT render realistic human heads, sculpted hair, or detailed facial geometry. Any hairstyle or head covering must appear only as a separate LEGO accessory piece (helmet, hat, hair piece), not as part of the head itself.\n\nTranslate the subject’s recognizable traits into simplified LEGO-style printed facial graphics while maintaining the iconic LEGO look.\n\nBuild the environment entirely from LEGO bricks at toy scale using plates, bricks, tiles, and accessories. Use realistic toy-photography lighting with soft shadows and subtle reflections so the scene looks like a photograph of an actual LEGO diorama. Keep the composition clear, proportional, and readable on small screens."
  },
  {
    name: "LETTERHEAD",
    category: ["BUSINESS", "UTILITY", "DOCUMENT", "PROFESSIONAL", "MASTER PROMPT"],
    message: "Take a picture of a sign, document, business card, storefront, or any visible branding related to a person or organization. Identify and extract readable text such as names, titles, addresses, phone numbers, email addresses, taglines, or other identifying information.\n\nIf the source image contains a visual logo, emblem, icon, symbol, or recognizable graphic mark, recreate a simplified, clean version of that logo at the top of the letterhead. The logo should be visually derived from the image itself (shapes, symbols, icons, or imagery), not generated from appended text. Preserve recognizability while simplifying for professional print use.\n\nIf no visual logo is present, construct a refined text-based header using the extracted name or business name, without inventing imagery.\n\nIf externally provided information is supplied (such as name, address, phone, email, or website), merge it seamlessly as supporting text beneath or beside the logo or header. Do not transform externally provided text into a logo or symbol.\n\nDesign a clean, professional, print-ready letterhead layout. Present the logo or header prominently at the top, followed by secondary details arranged with balanced alignment and spacing. Use modern, understated typography, subtle dividers, restrained color accents, and generous white space. Avoid novelty fonts, decorative graphics, or poster-like styling.\n\nEnsure all text is crisp, readable, and properly aligned. The background should be clean and uncluttered, resembling a legitimate business letterhead suitable for formal correspondence or PDF export. Optimize for small screens while maintaining realistic print proportions."
  },
  {
    name: "LET THEM EAT CAKE",
    category: ["HISTORICAL", "FRENCH", "ROYAL"],
    message: "Take a picture and transform the subject into a member of Marie Antoinette’s 18th-century French royal court. Dress the subject in elaborate Rococo-era court attire with silk fabrics, lace, ribbons, and embroidery. Apply period-accurate makeup including pale powdered skin, subtle rouge, and defined beauty marks. Add a tall, powdered white wig styled with curls and decorative ornaments. Preserve the subject’s facial features while placing them in an elegant Versailles-style interior with soft lighting and refined posture. The final image should resemble a formal aristocratic court portrait from late 18th-century France."
  },
  {
    name: "LIGHT",
    category: ["ABSTRACT", "GLOWING", "LUMINOUS"],
    message: "Take a picture and have everything made of light.  Varied colored lights with a glowing, ethereal, radiant effect."
  },
  {
  name: "LIMERICK",
  category: ["POETRY", "HUMOR", "TEXT", "MASTER PROMPT"],
  message: "Take a picture and transform the scene into a playful, cartoon-style illustration with exaggerated shapes, expressive features, and bright, cheerful colors. Use flavor text inspired by the subject’s appearance, pose, clothing, and surroundings to create a humorous limerick. Place the complete limerick clearly and fully visible beneath or alongside the cartoon image, ensuring all five lines are readable and unobstructed. The text should feel integrated into the cartoon design, such as on a sign, speech panel, or decorative text box. Maintain a lighthearted, whimsical tone throughout the final image.  The result should be a full view of the illustration with a relevant background behind the illustration."
  },
  {
    name: "LINE DRAWING",
    category: ["ART", "SKETCH", "MINIMAL"],
    message: "Take a picture and convert the image into a hand-drawn line illustration. Black ink only, no color or shading. Clean white background with expressive line weight."
  },
  {
    name: "LINOLEUM PRINT",
    category: ["ART", "PRINT", "CARVED"],
    message: "Take a picture and transform the image into a linoleum block print. Organic carved textures. Flat ink colors."
  },
  {
    name: "LITE-BRITE",
    category: ["TOY", "RETRO", "GLOWING"],
    message: "Take a picture and recreate the subject as a Lite-Brite pegboard artwork displayed inside a physical Lite-Brite toy frame. The entire toy should be visible, including the dark backing, grid of holes, and colorful glowing pegs, so it appears as a photographed Lite-Brite rather than a digital overlay.\n\nTransform the subject entirely using the Lite-Brite peg layout: the subject’s shape, facial features, and key details must be composed only of circular light pegs aligned to the pegboard grid. Do not use lines, shading, or any elements outside the peg layout to define the subject.\n\nUse bright, saturated colors for each peg with subtle glow and soft bloom to emulate the light pegs. Simplify details as necessary to maintain recognizability while fully adhering to the pegboard constraints.\n\nKeep the composition centered and uncluttered. Avoid text or extra graphics. The final image should feel tactile, nostalgic, and clearly readable on a small screen, looking like a true physical Lite-Brite creation."
  },
  {
    name: "LIVING TATTOO",
    category: ["TATTOO", "BODY ART", "INK", "MASTER PROMPT"],
    message: "Take a picture and transform the subject into a realistic tattoo design as if the image itself has been tattooed onto skin. Reinterpret the subject as linework, shading, and ink textures while preserving recognizable facial features, pose, and personality. Render the subject using authentic tattoo styles such as fine-line blackwork, illustrative shading, stippling, or limited-color ink with bold linework and strong contrast. Avoid photorealism—everything should read clearly as tattoo art, not a photo. Place the tattoo naturally on a realistic skin surface (e.g., forearm, upper arm, shoulder, calf, or back), following proper body curvature, muscle flow, and skin texture. Include realistic ink characteristics such as slight bleed, skin texture with visible pores and hair follicles, natural redness around fresh ink, and subtle shading variations. Ensure the tattoo integrates organically with the skin—correct perspective, natural stretching, soft shadowing, and seamless edges—without looking pasted or flat. The tattoo may include optional framing elements like banners, borders, decorative flourishes, dates, small symbols, or brief text captions if contextually appropriate. Optimize for small screens with clean composition and clearly readable details. The final image should look like a professional tattoo artist's finished work—convincing, stylized, and something someone would actually get inked."
  },
  {
    name: "LOGO FROM TEXT",
    category: ["DESIGN", "LOGO", "BRANDING", "MASTER PROMPT"],
    message: "Take a picture and extract prominent readable word(s) from the source image. Use only the extracted word or concept as inspiration to generate a simple, professional logo symbol that visually represents the meaning of the word rather than its letterforms. For example, if the extracted word is an animal, object, or concept, depict a clean symbolic representation of that subject.\n\nLimit logo generation strictly to the extracted source text. Do not transform, symbolize, or reinterpret any externally appended or supplemental text.\n\nIf additional text such as a name, address, phone number, or tagline is provided externally, render that text as literal, readable typography arranged neatly beneath or beside the logo symbol. Maintain clear separation between the logo mark and supporting text.\n\nApply a minimal, modern design style suitable for headers or branding: balanced proportions, restrained color usage, and clear negative space. Avoid illustrative complexity, mascots, or decorative effects. The final result should resemble a legitimate logo-and-header lockup suitable for professional use."
  },
  {
    name: "LONG EXPOSURE",
    category: ["PHOTOGRAPHY", "MOTION", "BLUR"],
    message: "Take a picture and apply long-exposure photography style. Light trails, motion blur on moving elements. Static subject remains sharp."
  },
  {
    name: "LOST AND FOUND",
    category: ["HUMOR", "POSTER", "MISSING", "MASTER PROMPT"],
    message: "Take a picture and transform it into a humorous lost-and-found poster. Present the subject as the missing item or person, framed in a simple poster layout with bold headings and tear-off–style design cues. Generate playful descriptive flavor text based on the subject’s appearance, clothing, expression, or surroundings, incorporating any externally provided details naturally. The tone should be clearly humorous and lighthearted. Ensure all text is fully visible and readable, and the subject remains recognizable. Render the final image with realistic paper texture, casual lighting, and authentic public-notice styling."
  },
  {
    name: "LOST PET",
    category: ["HUMOR", "POSTER", "PARODY"],
    message: "Take a picture and transform the subject into the focus of a classic lost pet flyer.\n\nPresent the image as a full, vertically oriented paper flyer taped or stapled to a public surface such as a telephone pole, bulletin board, or wall. The entire flyer must be fully visible within the frame, including margins, tape, and pull tabs at the bottom.\n\nRender the subject as the missing ‘pet’ — even if the subject is clearly not an animal. The subject should appear naturally integrated into the photo area of the flyer, cropped or posed the way lost pet photos typically are.\n\nInclude the following flyer elements in a photocopied, black-and-white or faded color style:\n• Large headline: \"LOST PET\" or \"HAVE YOU SEEN THIS PET?\"\n• A short, humorous description based on the subject’s appearance, posture, clothing, or expression (e.g., \"Easily distracted,\" \"Responds to snacks,\" \"Last seen avoiding responsibility\")\n• A vague or absurd last-seen location inspired by the scene or subject\n• A reward that is comically low, oddly specific, or useless (e.g., \"$7,\" \"half a sandwich,\" \"emotional closure\")\n• Tear-off phone number tabs along the bottom with repeated, generic numbers (not readable real phone numbers)\n\nAll text should feel hastily written or cheaply printed, like a real neighborhood flyer. If external master prompt text is provided, incorporate it naturally into the description, reward, or headline.\n\nThe tone should be dry, deadpan, and immediately readable as a joke. The final image should look like a real lost pet poster at first glance — then land the humor on closer inspection."
  },
  {
    name: "LOUSY T-SHIRT",
    category: ["HUMOR", "RETRO", "APPAREL", "POP CULTURE"],
    message: "Take a picture and transform the subject so they appear to be wearing a souvenir-style t-shirt with a classic tourist-shop design.\n\nThe t-shirt should feature the phrase: “My friend went to [CITY] and all I got was this lousy t-shirt.” Use a city name and friend’s name provided via external master prompt. If none is provided, randomly select a well-known city and use a generic phrase without a name.\n\nDesign the shirt using common souvenir t-shirt aesthetics appropriate to the chosen city. Examples include:\n• bold block lettering\n• playful or cheesy fonts\n• city skyline silhouettes\n• landmark illustrations\n• stars, flags, or decorative borders\n• exaggerated colors or slightly faded screen-print ink\n\nThe design should look like it was purchased at a tourist gift shop — slightly tacky, mass-produced, and proudly obvious. The print should appear realistically applied to the fabric with natural folds, wrinkles, lighting, and slight distortion from the shirt’s movement.\n\nEnsure the shirt fits naturally on the subject’s body and matches perspective, lighting, and fabric texture. The text must be fully visible and legible on a small screen.\n\nAvoid modern minimalist branding or luxury fashion aesthetics. The final image should feel humorous, nostalgic, and unmistakably like a real souvenir t-shirt someone actually owns."
  },
  {
    name: "LOVE ACTUALLY",
    category: ["MASTER PROMPT", "MOVIES", "ROMANCE", "SIGNS"],
    message: "Take a picture and create a cinematic two-panel composition where the subject communicates an emotional message using handwritten signs. Preserve clear facial likeness and identity while presenting the subject in a quiet, sincere moment. Design constraint: Render a single image split into exactly two side-by-side panels of equal size. In each panel, show the subject holding one handwritten sign facing the viewer. Limit the total number of signs to a maximum of two, with one short line of text per sign. Do not imply motion, animation, or time-based progression. Primary information source: If message text is provided via externally supplied details, divide the message across the two signs. Ensure the wording is original, natural, and emotionally resonant, and does not reference or recreate any specific copyrighted scene, dialogue, or characters. Secondary enhancement: If no message text is provided, infer a gentle, original two-line message based on the subject’s expression and context. Optimize the layout for small screens with bold, high-contrast handwritten text, clean spacing, and minimal clutter. Use soft, cinematic lighting, shallow depth of field, and a warm, intimate tone. Maintain an original setting and composition. Do not add additional panels, cards, or text beyond the two signs."
  },
  {
    name: "LOW POLY",
    category: ["3D", "GEOMETRIC", "GAMING"],
    message: "Take a picture using very low-poly modeling use minimal detail, faceted surfaces, and angular edges."
  },
  {
    name: "MACRO",
    category: ["PHOTOGRAPHY", "CLOSE UP", "DETAILED"],
    message: "Take a picture and transform the image into macro photography. Extreme close-up detail. Shallow depth of field, high texture clarity."
  },
  {
    name: "MACY'S PARADE BALLOON",
    category: ["INFLATABLE", "POP CULTURE", "HUMOR"],
    message: "Take a picture and transform the subject into a giant inflatable parade balloon, like those seen in a Macy’s-style parade. Render the subject fully in balloon form — all features, including hair, clothing, and accessories, should appear as smooth, glossy, inflated balloons. Use tubular, rounded, or segment-like shapes typical of balloon sculpture. Exaggerate facial features slightly for comedic effect while keeping the subject recognizable.\n\nInclude parade context: ropes, handlers, and a city street environment to show scale. Ensure the balloon is fully visible, oversized, and clearly readable on a small screen. Use bright colors, subtle reflections, and soft highlights to reinforce the balloon material. The final image should feel absurdly playful, humorous, larger-than-life, and unmistakably made of balloons."
  },
  {
    name: "MAD MAGAZINE",
    category: ["HUMOR", "SATIRE", "CARICATURE"],
    message: "Take a picture and transform the subject into a classic Mad Magazine-style caricature. Preserve the subject’s recognizable facial features and personality while exaggerating key traits with over-the-top humor: enlarged head, expressive eyes, exaggerated expressions, and comically small or distorted body. Include irreverent, satirical flavor text, visual gags, and props that parody everyday life or pop culture. Bold linework, bright colors, and chaotic, playful composition. Ensure the subject is clearly identifiable within the humorous scene."
  },
  {
    name: "MADAME TUSSAUDS",
    category: ["HUMOR", "PORTRAIT", "STATUE"],
    message: "Take a picture of the subject and transform them into a wax museum figure, like a Madame Tussauds exhibit.\n\nThe subject should look like a lifelike wax replica of themselves, with smooth, slightly shiny skin, glassy eyes, and stiff, posed posture.\n\nLighting should resemble a museum display, with spotlights and a clean background.\n\nThe final image should clearly look like a wax statue of the subject, not a real person, while still closely resembling them."
  },
  {
    name: "MAGIC EYE",
    category: ["ILLUSION", "STEREOGRAM", "3D"],
    message: "Take a picture and transform it into a single-image autostereogram (Magic Eye–style illusion). Encode the subject’s shape and depth into a repeating patterned texture so the image appears abstract at first glance but reveals the subject when viewed with relaxed or unfocused eyes.\n\nUse a dense, repeating pattern with subtle depth cues that form the subject’s silhouette and major features in three dimensions. Do not include outlines, labels, or hints. The subject should not be immediately obvious without proper viewing.\n\nEnsure the pattern is clean, evenly tiled, and centered. The final image should resemble a classic Magic Eye print that is visually stable and readable on a small screen."
  },
  {
    name: "MARIONETTE PUPPET",
    category: ["TOY", "PUPPET", "STRINGS"],
    message: "Take a picture and transform the subject into a handcrafted marionette puppet. Preserve recognizable facial features, expressions, proportions, and clothing identity, adapted into carved wood, painted surfaces, stitched fabric, and jointed limbs. Visible strings extend upward from the limbs and head to a wooden marionette controller held above the frame or partially visible. The puppet must show realistic wear, grain, seams, and articulation points. Studio or theatrical lighting with shallow depth of field. The subject must clearly remain the same individual, now reimagined as a controlled puppet."
  },
  {
    name: "MASCOT",
    category: ["SPORTS", "CHARACTER", "COSTUME"],
    message: "Take a picture and transform the subject into a realistic, full-body sports team mascot costume. The mascot must appear as a physical, wearable suit with a large oversized mascot head, visible seams, plush or foam textures, and costume proportions typical of real stadium mascots.\n\nPreserve the subject’s recognizable traits by translating facial characteristics into the mascot head design, not by using the real face. Eyes, mouth, and expression should be part of the costume head.\n\nUse photoreal lighting and materials so the mascot looks like a real person wearing a professional mascot suit, not a cartoon or illustration. Place the mascot in a stadium, field, or arena environment.\n\nEnsure the full mascot body is visible and properly proportioned. The final image should look like a real sports mascot photographed during a live event."
  },
  {
    name: "MATRIX",
    category: ["MOVIES", "SCI FI", "CODE"],
    message: "Take a picture in the style of the Matrix. Include Matrix Rain."
  },
  {
    name: "MAYHEM",
    category: ["HUMOR", "CHAOS", "ABSURD"],
    message: "Take a picture and transform the scene into an outrageously funny visual scenario centered on the subject. Use exaggerated scale, unexpected objects, absurd logic, and chaotic interactions to create instant visual comedy. Preserve the subject’s recognizable face and identity while placing them in a situation that is wildly implausible yet visually coherent. The humor should be obvious at first glance, relying on visual absurdity rather than text, jokes, or captions. Push the scene to the edge of chaos while maintaining clear lighting, sharp detail, and readable composition."
  },
  {
    name: "MEME",
    category: ["HUMOR", "INTERNET", "TEXT", "MASTER PROMPT"],
    message: "Take a picture and make it into a MEME, adding ironic humor and flavor text inspired by the content of the image. Clean composition with readable typography.  The result should be a full view of the meme."
  },
  {
    name: "MERMAID",
    category: ["FANTASY", "CREATURE", "UNDERWATER"],
    message: "Take a picture and transform the subject into a realistic mermaid. Preserve the subject’s recognizable facial features, expressions, body proportions, and personality while adapting the lower body into a natural, anatomically believable fish tail with detailed scales and fins. The subject wears ocean-appropriate, functional aquatic attire designed for a mermaid, integrated naturally with the anatomy. Create a photorealistic underwater environment with flowing hair, suspended particles, coral reefs, and aquatic life. Use realistic underwater lighting with sunlight rays filtering through the water, emphasizing scale, depth, and immersion. The subject must appear fully native to the underwater world, not costumed."
  },
  {
    name: "MESOPOTAMIAN RELIEF",
    category: ["ART", "ANCIENT", "MIDDLE EASTERN"],
    message: "Take a picture and Transform the image into a Mesopotamian bas-relief style. Flatten forms, use profile poses, and emphasize symbolic gestures. Apply sandstone textures and ancient ornamental borders."
  },
  {
    name: "MEXICAN MURALISM",
    category: ["ART", "PAINTING", "MEXICAN", "MURAL"],
    message: "Take a picture and transform the image into Mexican muralism style art. Bold figures, narrative storytelling, strong outlines, social symbolism, and monumental composition."
  },
  {
    name: "MIKE JUDGE ME",
    category: ["CARTOON", "SATIRE", "RETRO", "POP CULTURE"],
    message: "Take a picture and transform the subject into an animated character placed directly inside a scene from the world of Mike Judge cartoons.\n\nRender the subject in a Mike Judge–style character design: slightly awkward proportions, stiff posture, minimal facial expression, uneven line work, flat cel-shaded colors, and intentionally plain or unflattering details. Preserve the subject’s recognizability while adapting them fully into the cartoon style.\n\nPlace the subject INTO a recognizable Mike Judge cartoon scene, selected based on context or randomly. The scene should clearly reflect one of the following shows and environments, and may include recognizable characters from that show:\n\n• King of the Hill — suburban Arlen, Texas (backyard fence chats, alleyways, living rooms, Strickland Propane). Characters may include Hank Hill, Peggy, Bobby, Dale, Bill, or Boomhauer.\n• Beavis and Butt-Head — grimy neighborhood streets, living room couch, fast-food joints, school hallways. Characters may include Beavis, Butt-Head, or classmates reacting to the subject.\n• Daria — school hallways, classrooms, coffee shops, or suburban interiors. Characters may include Daria, Jane, Quinn, or classmates observing the subject.\n• Office Space–style environment — dull corporate office, cubicle farms, break rooms, printer destruction areas. Characters may include bored coworkers or management-style figures inspired by the film’s tone.\n\nExisting characters should appear as supporting or background characters interacting with or reacting to the subject. The subject should feel like a guest character awkwardly dropped into the episode, not replacing anyone.\n\nAdapt the subject’s clothing into simplified everyday outfits typical of Mike Judge cartoons — plain t-shirts, polos, jeans, boring office attire, or aggressively normal suburban clothing.\n\nUse muted, slightly washed-out color palettes, flat lighting, and simple painted backgrounds. Avoid exaggerated animation, flashy effects, or glossy textures.\n\nEnsure the full scene is visible and readable on a small screen, with the subject clearly identifiable among the characters. The final image should feel like a freeze-frame from an actual Mike Judge episode — dry, awkward, observational, and quietly brutal."
  },
  {
  name: "MILK CARTON",
  category: ["HUMOR", "MISSING", "VINTAGE", "MASTER PROMPT"],
  message: "Take a picture and place the subject on the side of a classic milk carton as a missing person feature. Design the carton with realistic packaging details, typography, and layout. Generate humorous descriptive flavor text for the missing person section based on the subject’s appearance, clothing, expression, or personality, incorporating any externally provided details naturally. Keep the tone playful and clearly fictional. Ensure the subject’s image is integrated naturally into the carton design and remains recognizable. Render the final image photorealistically with believable lighting, carton texture, and packaging realism."
  },
  {
    name: "MINECRAFT",
    category: ["GAMING", "PIXEL", "BLOCKY"],
    message: "Take a picture in the style of Minecraft. Blocky geometry, pixel textures."
  },
  {
    name: "MINIATURE SET",
    category: ["MINIATURE", "DIORAMA", "MODEL"],
    message: "Take a picture and transform the entire scene into a handcrafted miniature diorama. Scale all subjects and objects to match the proportions of a physical miniature set, so they appear small and in proportion to each other. Render surfaces with handcrafted textures such as clay, painted wood, cardboard, fabric, or tiny props, giving the scene a realistic, tactile feel.\n\nUse shallow depth of field, soft studio lighting, and subtle shadows to emulate macro photography of a real miniature model. Ensure the composition reads clearly, maintains visual depth, and feels like a meticulously constructed miniature set. Keep subjects and environment clearly recognizable and readable on small screens, with a handcrafted, physical toy-like aesthetic."
  },
  {
    name: "MINIMALISM",
    category: ["ART", "SIMPLE", "MODERN"],
    message: "Take a picture and transform the image into the Minimalism style. Simplify shapes, reduce color palette, and remove extraneous detail while keeping subject identifiable."
  },
  {
    name: "MINION MODE",
    category: ["HUMOR","POP CULTURE","TRANSFORMATION"],
    message: "Take a picture and transform the subject into a small, yellow, gibberish-speaking cartoon minion.\n\nAdapt the subject’s facial structure, expression, and personality into a simplified, rounded, toy-like character with yellow skin, large expressive eyes behind goggles, and a compact body. Preserve recognizable traits such as smile shape, eyebrow energy, or posture.\n\nDress the character in classic minion-style overalls or a similar worker outfit. Proportions should be exaggerated and playful, not realistic.\n\nThe environment should be simplified and colorful to match an animated comedy world. Lighting should be bright and cheerful.\n\nDo not include text. The final image should feel mischievous, energetic, and immediately recognizable as a minion-style parody while remaining readable on a small screen."
  },
  {
    name: "MIRROR WORLD",
    category: ["ILLUSION", "REFLECTION", "SURREAL"],
    message: "Take a picture and create a mirrored reality where reflection differs from reality. Subtle narrative differences."
  },
  {
    name: "MONA LISA",
    category: ["ART", "CLASSIC", "PARODY", "PAINTING"],
    message: "Take a picture and transform the subject into the Mona Lisa painting.\n\nReplace the Mona Lisa’s face with the subject, carefully adapting their facial features, expression, and posture to match the iconic pose, angle, and calm demeanor of the original artwork. The subject should feel painted into the scene, not pasted on.\n\nRender the image in a classical Renaissance oil painting style with soft brushwork, subtle gradients, muted earth tones, and realistic canvas texture. Preserve the iconic background landscape, atmospheric depth, and lighting.\n\nGently adapt the subject’s hair or accessories into period-appropriate forms while maintaining recognizable traits (for example, modern glasses subtly reinterpreted as period-style frames).\n\nEnsure the full painting is visible within the frame, including the subject, background, and edges of the artwork. The final image should feel like a museum-worthy reinterpretation — respectful, believable, and quietly humorous through contrast."
  },
  {
    name: "MONDRIAN",
    category: ["ART", "GEOMETRIC", "ARTIST", "ABSTRACT"],
    message: "Take a picture and reinterpret it in the style of Piet Mondrian. Reduce the scene into a grid of bold black lines and flat blocks of primary colors with white space. Abstract the subject while maintaining a clear structural reference to the original composition. The final image should feel balanced, geometric, and modernist."
  },
  {
    name: "MONSTER",
    category: ["HORROR", "CREATURE", "SCARY"],
    message: "Take a picture and transform the subject into a cinematic monster while preserving the subject’s recognizable facial structure, body proportions, and identity. Reimagine the subject with exaggerated, otherworldly features such as altered skin texture, enhanced musculature, claws, horns, scales, or glowing eyes, inspired by the subject’s original traits. Place the subject naturally into a dark, immersive environment that complements the creature’s design. Use dramatic lighting, shadows, and environmental interaction to ensure the monster appears physically present in the scene. Render in photorealistic detail with a powerful, intimidating atmosphere."
  },
  {
    name: "MOON",
    category: ["SPACE", "ASTRONAUT", "SCI FI"],
    message: "Take a picture and place subject on the moon. Subject is wearing an astronaut suit. Subject face is visible through the helmet visor. The Earth is in the background. Make it photorealistic. Make it 8k resolution."
  },
  {
    name: "MOSAIC",
    category: ["ART", "TILE", "COLORFUL"],
    message: "Take a picture in the style of a glass Mosaic. Small tiles, reflective surfaces."
  },
  {
    name: "MOUNT RUSHMORE",
    category: ["LANDMARK", "SCULPTURE", "AMERICAN"],
    message: "Take a picture and make the subject face a carved head placed on Mount Rushmore. Make it photorealistic."
  },
  {
    name: "MOVIE REEL",
    category: ["MOVIES", "VINTAGE", "FILM"],
    message: "Take a picture and make the scene into a movie reel with multiple frames. Move the subject slightly from one frame to the next to simulate movement."
  },
  {
    name: "MOVIE SCENE INSERT",
    category: ["MOVIES", "CINEMATIC", "MASHUP", "MASTER PROMPT"],
    message: "Take a picture and place the subject inside a cinematic movie scene as if they were an original character in the film. Preserve the subject’s recognizable facial features, body proportions, clothing identity, and personality. Match the exact cinematography of the chosen movie including lens type, depth of field, film grain, color grading, lighting direction, production design, and era-accurate costuming if required. The subject must appear physically present in the scene with correct scale, shadows, reflections, and environmental interaction. The background, props, and atmosphere must be authentic to the movie’s world, making the subject indistinguishable from the original cast and fully integrated into the scene."
  },
  {
    name: "MR. POTATO HEAD",
    category: ["TOY", "RETRO", "POTATO"],
    message: "Take a picture and transform the subject into a Mr. Potato Head–style toy.\n\nConvert the subject into a smooth, potato-shaped plastic body with a slightly shiny, molded toy texture. The subject’s original human facial anatomy MUST NOT remain visible. All facial features (eyes, nose, mouth, ears, eyebrows) must be represented ONLY as removable Mr. Potato Head–style toy parts.\n\nImportant facial replacement rules:\n• REMOVE the subject’s real nose, mouth, eyes, and ears entirely\n• REPLACE them with toy-style plug-in parts mounted directly onto the potato surface\n• Do NOT allow any human facial features to appear behind or beneath the toy parts\n• Ensure correct positioning: the toy nose must sit centered above the toy mouth, with clear separation between parts\n\nArrange classic Mr. Potato Head components — eyes, eyebrows, nose, mouth, ears, arms, and optional accessories (hat, glasses, mustache) — snapped into visible peg holes or implied mounting points. Parts should feel modular, slightly misaligned, and intentionally toy-like, but never overlapping or duplicated.\n\nPreserve the subject’s identity through:\n• eye shape or spacing translated into toy eyes\n• mouth expression adapted into a toy mouth\n• accessories inspired by the subject (glasses, hat, etc.)\n\nMaintain realistic toy scale, lighting, and soft shadows so the figure appears as a real physical plastic toy photographed in the real world.\n\nAvoid cartoon drawing styles or painterly rendering. This must look like a tangible Mr. Potato Head toy, not an illustration.\n\nKeep the composition clean and centered. Ensure the full toy is visible and clearly readable on small screens. The final image should feel nostalgic, playful, and unmistakably a Mr. Potato Head version of the subject — with no anatomical confusion."
  },
  {
    name: "MUG SHOT",
    category: ["HUMOR", "MASTER PROMPT", "POLICE", "PHOTO"],
    message: "Take a picture of the subject and transform it into a realistic police booking photo (mugshot).\n\nBackground and framing: Position the subject against a height measurement wall with horizontal lines and measurement markers clearly visible behind them. Use a neutral institutional background with the measurement scale. Camera angle should be straight-on with subject facing forward in standard mugshot pose.\n\nPlacement and details: The subject should be holding a placard or booking board displaying booking number, date, and police department name. Generate humorous or descriptive arrest charge text on the placard inspired by the subject's appearance, clothing, expression, or characteristics (examples: 'Public Nudity at Costco,' 'Theft of Garden Gnome,' 'Excessive Karaoke'), incorporating any externally provided details from master prompt naturally.\n\nSubject appearance: Show signs of a rough day - disheveled hair, tired or defiant expression, smudged makeup (if applicable), wrinkled or slightly torn clothing, possibly minor injuries like a black eye or scrapes. Expression can be deadpan, angry, smirking, crying, or showing attitude. Include details suggesting what they were doing when arrested through their outfit or appearance.\n\nLighting and quality: Use harsh, unflattering institutional fluorescent lighting typical of police stations - flat, bright, casting slight shadows under eyes and emphasizing imperfections. Colors should be slightly washed out or have that institutional quality. Include subtle imperfections typical of ID photography: slightly uneven lighting, mild shadows, imperfect framing, or slight camera artifacts to enhance authenticity.\n\nThe final image should look exactly like an actual police booking photograph - institutional, unflattering, official documentation style with that specific harsh government facility aesthetic. Preserve the subject's recognizable facial features, posture, and expression while maintaining a realistic, photorealistic composition that captures the authentic look and feel of a real mugshot."
  },
  {
    name: "MULTIPLICITY",
    category: ["HUMOR", "ABSURD", "PHOTO EFFECT"],
    message: "Take a picture and transform the scene so the subject appears duplicated multiple times within the same frame.\n\nCreate several copies of the subject, each placed naturally into the environment with consistent lighting, scale, and perspective. The duplicates should feel like they coexist in the same moment rather than layered edits.\n\nEach version of the subject should have a slightly different pose, expression, or attitude to suggest personality divergence — for example: confident, confused, bored, overexcited, distracted, or plotting.\n\nAvoid obvious repetition. Vary posture, head tilt, facial expression, or interaction with the environment so each duplicate feels intentional.\n\nKeep the composition readable on a small screen. Ensure no duplicate is cropped or partially hidden. The final image should feel funny, surreal, and immediately understandable — as if reality accidentally made too many copies of the same person."
  },
  {
    name: "MULTIVERSE",
    category: ["SCI FI", "PARALLEL", "ALTERNATE"],
    message: "Take a picture and create a parallel version of the same subject in a different reality. Parallel version is subtly different in style, clothing, or environment."
  },
  {
    name: "MUPPET",
    category: ["PUPPET", "TV", "FELT"],
    message: "Take a picture and make it a Muppet. Felt textures, button eyes, puppet proportions. Preserve subject personality."
  },
  {
    name: "MUSEUM EXHIBIT",
    category: ["MUSEUM", "DISPLAY", "EDUCATIONAL"],
    message: "Take a picture and present the subject as a museum exhibit on display. Place the subject behind glass or on a pedestal within a realistic museum gallery environment, with proper lighting, barriers, and signage. Generate an exhibit placard using descriptive or humorous flavor text inspired by the subject’s appearance, clothing, pose, or surroundings, incorporating any externally provided details naturally. The placard should include a title, short description, and optional faux historical or cultural context. Ensure the subject appears seamlessly integrated into the exhibit, with realistic scale, reflections, and museum ambiance. Render the final image photorealistically, as if photographed inside a real museum."
  },
  {
    name: "MUSICAL MOMENTS",
    category: ["HUMOR", "MOVIE", "SCENE", "MUSICAL"],
    message: "Take a picture of the subject and place them into a scene from a classic movie musical, such as *Grease*, *Footloose*, *Singin’ in the Rain*, or *The Sound of Music*.\n\nThe subject should be actively participating in the musical moment — dancing, singing, or dramatically posing — while fully integrated into the scene with background dancers, instruments, or choreography.\n\nCostumes, props, lighting, and setting should match the original musical style and era.\n\nOptional flavor text from the master prompt can influence the song, scene, or humorous twist (e.g., the subject missing a step, dramatically belting a line, or accidentally knocking over props).\n\nThe final image should look like a real movie still from the musical, cinematic, and humorous with the subject as the star."
  },
  {
    name: "MYSTICAL",
    category: ["FANTASY", "MAGICAL", "GLOWING"],
    message: "Take a picture and transform it into a realistic, detailed mystical world, where trees have faces and bioluminescent plants and objects light up."
  },
  {
    name: "MYTHOLOGY",
    category: ["FANTASY", "MYTHOLOGY", "CREATURE"],
    message: "Take a picture and make the subject into a Greek or Roman mythological creature while preserving recognizable characteristics of the subject. Epic, classical atmosphere."
  },
  {
    name: "N64 BLUR FILTER",
    category: ["RETRO", "GAMING", "90S", "BLUR"],
    message: "Take a picture and transform it using a Nintendo 64–style blur and texture smoothing. Apply soft focus, smeared textures, and simplified geometry. Colors should feel slightly muddy but warm. The subject should look nostalgic and dreamlike, as if remembered from an old cartridge game."
  },
  {
    name: "NEGATIVE SPACE",
    category: ["ART", "MINIMAL", "SILHOUETTE"],
    message: "Take a picture and use negative space to define the subject. Primary form emerges from absence rather than detail. Minimalist composition."
  },
  {
    name: "NEOCLASSICAL",
    category: ["ART", "PAINTING", "CLASSIC"],
    message: "Take a picture and transform the image into Neoclassical style painting. Strong lines, realistic proportions, muted colors, classical architecture or drapery elements, and dignified subject presentation."
  },
  {
    name: "NEOLITHIC CAVE PAINTING",
    category: ["ART", "ANCIENT", "PREHISTORIC"],
    message: "Take a picture and transform the image into a prehistoric cave painting. Render the subject using simplified, abstracted shapes, ochre and charcoal colors, and textured rock surfaces. The subject should remain identifiable while blending with ancient cave wall aesthetics."
  },
  {
    name: "NEON SIGN",
    category: ["NEON", "GLOWING", "URBAN"],
    message: "Take a picture and transform the subject into a glowing neon sign. Recreate the subject’s silhouette, facial features, and defining characteristics using luminous neon tubing and light trails, while keeping the subject clearly recognizable. Use vibrant neon colors with realistic glow, reflections, and light bleed against a dark or urban-inspired background such as brick, concrete, or night scenery. Arrange the neon lines as if they were hand-bent glass tubes, with subtle imperfections and mounting hardware for realism. Render the final image with crisp detail, strong contrast, and a striking nighttime atmosphere."
  },
  {
    name: "NEWSPAPER",
    category: ["NEWS", "VINTAGE", "MASTER PROMPT", "TEXT", "PRINT"],
    message: "Take a picture and Transform the image into a newspaper print. Halftone dots, grayscale ink. Newsprint texture. Include flavor text headline and story text inspired by the content of the image. The result should be a full view of the newspaper page with the newspaper header and date visible with a relevant background behind the newspaper."
  },
  {
    name: "NIGHT VISION",
    category: ["PHOTOGRAPHY", "GREEN", "MILITARY"],
    message: "Take a picture and transform the image into night vision style. Green monochrome, sensor noise."
  },
  {
    name: "NOT IT!",
    category: ["HUMOR","SOCIAL","PHOTO EFFECT"],
    message: "Take a picture and transform the scene so it appears the subjects are playing the classic game of \"Not It.\"\n\nAnalyze the number of visible subjects:\n• If multiple subjects are present, show all but one touching their index finger to their nose in a synchronized, quick-reaction pose.\n• One subject should clearly be \"too late\" — their finger either not yet touching their nose, hovering just short, or their hand still moving — making it obvious they are now \"it.\"\n\nBody language and facial expressions are critical:\n• The non-it subjects should look relieved, smug, amused, or triumphant.\n• The subject who is \"it\" should look surprised, annoyed, resigned, or caught off-guard.\n\nEnsure everyone remains in the same moment in time, as if the action was frozen immediately after the call of \"Not it!\" No motion blur — clarity is more important than realism.\n\nDo not add text, arrows, or labels. The concept must be communicated purely through pose, gesture, and expression.\n\nMatch lighting, perspective, and scale so the scene feels like a candid photo capturing a spontaneous social moment. Keep the composition readable on a small screen, with all hands and faces clearly visible."
  },
  {
    name: "NURSERY RHYME STORYBOOK",
    category: ["STORYBOOK", "KIDS", "LESSON"],
    message: "Take a picture and transform the subject into the main character of a classic nursery rhyme. Select the nursery rhyme based on the subject’s appearance, personality, posture, environment, or externally provided instructions.\n\nExamples include, but are not limited to: Jack and Jill (subject as Jack or Jill), Little Miss Muffet (subject as Miss Muffet), Mary Had a Little Lamb (subject as Mary), Humpty Dumpty (subject fully transformed into Humpty), Old MacDonald Had a Farm (subject as Old MacDonald), Row Row Row Your Boat (subject rowing the boat), Jack Be Nimble (subject as Jack), Little Bo Peep (subject as Bo Peep), Little Boy Blue (subject as Little Boy Blue), or similar well-known rhymes.\n\nTransform the subject accordingly so they appear fully integrated into the nursery rhyme world — not posing on top of it. Costumes, props, environment, and proportions should make the subject look like they belong inside the story.\n\nRender the scene in a whimsical, illustrated storybook style with soft colors, painterly textures, gentle lighting, and classic children’s book charm. Avoid modern objects or settings unless intentionally playful.\n\nInclude the **title of the nursery rhyme** prominently and clearly at the top or bottom of the image. Display a **short, complete version of the nursery rhyme text** within the scene in large, legible lettering, styled like a storybook page. All text must be fully visible and readable.\n\nThe final image should resemble a single open illustrated page from a nursery rhyme book, with the subject and all text fully contained within the frame, suitable for viewing on a small screen. The tone should be magical, nostalgic, and immediately recognizable."
  },
  {
  name: "O’KEEFFE",
  category: ["ART", "PAINTING", "ARTIST", "ORGANIC"],  
  message: "Take a picture and reinterpret it in the style of Georgia O’Keeffe. Simplify the subject into flowing organic forms with smooth gradients and soft transitions. Emphasize shape, color, and scale over detail. The final image should feel calm, intimate, and abstracted."
  },
  {
    name: "OBJECT MOSAIC",
    category: ["ART", "MOSAIC", "TEXTURE"],
    message: "Take a picture and recreate the subject so that their entire face and body are constructed exclusively from hundreds or thousands of small physical objects such as coins, pennies, jellybeans, M&Ms, bottlecaps, beads, stones, buttons, or similar items. There must be NO visible skin, fabric, or underlying human form anywhere in the image. Every facial feature, contour, shadow, and body shape must be defined only by the placement, color, density, and orientation of the objects. From a distance, the subject must be clearly recognizable; up close, the image must resolve entirely into individual objects. Use realistic lighting, depth, and perspective so the objects cast shadows and feel physically present. Do not overlay or decorate a normal body — the objects themselves ARE the subject."
  },
  {
    name: "ONE SECOND BEFORE DISASTER",
    category: ["HUMOR", "DRAMATIC", "SUSPENSE"],
    message: "Take a picture and depict the subject frozen in time exactly one second before a dramatic, chaotic, or humorous event occurs. Capture tension and anticipation in the subject’s pose and expression (for example: a falling object mid-air, a near collision, an imminent spill, or an unexpected surprise). Use cinematic lighting, motion cues, and environmental storytelling to make it obvious that something is about to happen, without actually showing the outcome."
  },
  {
    name: "OOMPA LOOMPA",
    category: ["MOVIES", "FANTASY", "CANDY", "CLASSIC", "TRANSFORMATION"],
    message: "Take a picture and transform the subject into an Oompa Loompa character from the classic film, placing them in an iconic factory scene.\n\nTransform the subject's appearance: reduce height to small stature, apply orange-tinted skin tone, style hair in distinctive manner (often green or unusual color), dress in white overalls with brown trim and shirt, knee-high socks, and black shoes. Preserve recognizable facial features while adapting to the distinctive look.\n\nPlace the subject in one of the famous factory locations: the chocolate waterfall and river area with candy mushrooms and edible landscape, the golden egg room with geese, the inventing room with experimental candy machines, the television chocolate room with equipment, or other whimsical factory settings filled with oversized candy, colorful pipes, fantastical machinery, and sweet-making equipment.\n\nSurround the subject with other Oompa Loompas working in the factory or preparing to perform, all with matching appearance and costumes. Include the fantastical candy factory environment with vibrant colors, impossible proportions, whimsical industrial equipment, massive candy productions, and magical chocolate-making machinery.\n\nThe setting should capture the dreamlike quality of the factory: oversized candy elements, colorful pipes and machinery, sugar crystals, chocolate rivers, candy plants, lollipop trees, or other fantastical sweet-themed environmental details.\n\nLighting should have that slightly surreal, colorful quality of the original film - warm glowing light, candy-colored illumination, and the magical atmosphere of the factory.\n\nOptional: Position subject as if about to perform or mid-performance of their famous moralizing musical number, with other Oompa Loompas in coordinated poses.\n\nThe final image should look like an actual still from the classic film - whimsical, colorful, slightly surreal, with the subject fully transformed and integrated into the magical candy factory world. Capture the fantastical, slightly uncanny charm of the original movie's aesthetic."
  },
  {
    name: "OPERATION",
    category: ["HUMOR", "GAME", "PARODY", "DESIGN"],
    message: "Take a picture and transform it into the board-game Operation.\n\nThe final image must show the **entire game board fully visible** within the frame, viewed from above like a real tabletop game. Do not crop any part of the board.\n\nUse a familiar Operation-style layout: a human body diagram with outlined cavities, exaggerated organs, bright colors, and clean, bold shapes. Replace the traditional game head with the subject’s head, adapted into a flat, illustrated style that matches the board aesthetic while remaining recognizable.\n\nIntegrate humorous, fictional items into the body cavities inspired by the subject’s traits or environment (e.g., snacks, phone, keys, coffee cup, tangled thoughts). Items should be cartoonish and clearly readable.\n\nInclude parody game elements such as:\n• Stylized cavity outlines\n• Plastic-board textures\n• Simplified medical tools (tweezers, wires) as decorative elements\n• Playful warning lights or buzz indicators (visual only, no text required)\n\nThis must be a humorous, original parody inspired by the classic game format.\n\nEnsure colors are bold, shapes are clean, and all elements are readable on a small screen. The final image should feel like a ridiculous but believable board game someone could actually play."
  },
  {
    name: "OPPOSITE SELF",
    category: ["TRANSFORMATION", "OPPOSITE", "SWAP"],
    message: "Take a picture and transform the subject into their opposite self while preserving the subject’s recognizable facial structure, expressions, posture, and identity. Invert key physical characteristics in a realistic and anatomically plausible way, such as body type and gender presentation, while maintaining the subject’s personality and essence. Adapt facial features, body proportions, hair, and clothing naturally to fit the transformed appearance. Ensure the subject remains clearly identifiable and fully integrated into the scene with consistent lighting, perspective, and environment. Render the final image with photorealistic detail and believable realism."
  },
  {
    name: "OPTICAL ILLUSION",
    category: ["ILLUSION", "VISUAL", "TRICK"],
    message: "Take a picture and convert the image into an optical illusion. Perspective shifts depending on viewing angle. Hidden secondary images emerge upon inspection."
  },
  {
   name: "OUTFIT TRY-ON",
   category: ["FASHION", "STYLE", "UTILITY"],
   message: "Take a picture of the subject and generate a 2×2 square grid showing four different complete outfits on the same person. The subject’s pose, face, and environment must remain identical — only the clothing changes.\n\nEach outfit should represent a distinct style (for example: casual, formal, streetwear, business, fantasy, retro, etc.).\n\nClothing must fit the subject’s body naturally with correct folds, shadows, and proportions.\n\nIf external master prompt text is provided (such as era, genre, or theme), use it to guide the outfit designs.\n\nThe final image should resemble a digital fashion fitting room."
  },
  {
    name: "OVER-THE-TOP BEARD",
    category: ["HUMOR", "PORTRAIT", "TRANSFORMATION"],
    message: "Take a picture of the subject, human or animal, and give them an extremely large, exaggerated beard.\n\nThe beard should be far bigger than normal, thick, fluffy, and dramatic — long enough to reach the chest or even lower.\n\nThe style can be wild, curly, braided, or oddly shaped, but it should clearly be the main visual focus.\n\nThe beard should look real and textured, even if its size is ridiculous.\n\nThe final image should look believable but absurd, as if the subject suddenly grew an epic, legendary beard."
  },
  {
    name: "PAPER SHADOW BOX",
    category: ["ART", "PAPER", "3D", "LAYERED"],
    message: "Take a picture and transform the image into a layered paper shadow-box. Multiple cut paper layers creating depth. Soft directional lighting"
  },
  {
    name: "PAPERCRAFT",
    category: ["ART", "PAPER", "3D", "CRAFTS"],
    message: "Take a picture in the style of three-dimensional Papercraft. Folded paper textures and layered construction."
  },
  {
    name: "PARALLEL UNIVERSE HISTORY",
    category: ["HISTORICAL", "ALTERNATE", "EDUCATIONAL"],
    message: "Take a picture and place the subject at the center of a universally recognizable moment in human history, replacing the original figure with the subject while preserving the significance, symbolism, and emotional weight of the event. The subject must be clearly recognizable and portrayed as the individual performing the defining action of the moment. Do not depict or reference the original historical figure by name or likeness. Instead, recreate the setting, era-appropriate environment, clothing, and atmosphere so the moment is immediately identifiable through visual context alone. Use implicit inference from the subject’s appearance, posture, and expression to select an appropriate historic theme (e.g., leadership, discovery, courage, progress, unity). If externally provided details are supplied, incorporate them as factual context for the moment. Present the image as a clean, collectible flashcard optimized for small screens. Include concise, readable text such as: \n• Title of the historic moment\n• Year or era\n• One-sentence description of the event’s significance\n• A short, respectful caption describing the subject’s role. Ensure cinematic lighting, strong composition, and emotional impact. The final image should feel iconic, respectful, and timeless—like a photograph history forgot to record."
  },
  {
    name: "PASSPORT PHOTO",
    category: ["UTILITY", "DOCUMENT", "PROFESSIONAL"],
    message: "Take a picture and transform it into an official passport photo embedded within a realistic passport identity page.\n\nThe subject’s image must appear printed directly onto the passport page as part of the document layout, not as a standalone or floating photo. Integrate the photo naturally into the passport design with proper borders, alignment, and scale consistent with real passports.\n\nUse a plain white or light grey background within the photo area. The subject should have a centered frontal view of the face and shoulders, a neutral expression, and even lighting with no harsh shadows. Maintain clean, sharp focus and accurate proportions.\n\nSurround the photo with realistic passport elements such as text fields, lines, security patterns, microprint textures, and subtle holographic or watermark-style design details (without copying any specific real country’s passport).\n\nEnsure the overall result looks like a legitimate government passport ID page, with the photo clearly integrated into the document and the full page visible within the frame."
  },
  {
    name: "PATRON SAINT",
    category: ["MASTER PROMPT", "RELIGIOUS", "SAINT", "HOLY"],
    message: "Take a picture and transform the subject into a patron saint–style depiction while preserving clear facial likeness and identity. Present the subject in saintly attire with symbolic garments, colors, and iconography. Use a reverent, dignified pose with soft halo lighting and a subtle divine glow, rendered in a classical yet photorealistic aesthetic. Primary information source: If a saint name is provided via externally supplied details, accurately incorporate all historically associated information for that saint, including name, patronage domains, feast day, biographical summary, notable traditions, and fun facts. Do not alter or contradict known historical associations. Secondary enhancement: Use implicit visual inference from the subject’s appearance, clothing, accessories, environment, and expression to enhance symbolism, visual motifs, and flavor text, without overriding factual saint information. Fallback behavior: If no saint name is externally provided, create a clearly labeled symbolic or archetypal \“Saint of [inferred theme]\” based on implicit inference from the subject. Avoid naming or implying a real historical saint, omit specific feast dates, and present patronage and fun facts as symbolic rather than historical. Design the final image as a compact, mobile-friendly flash card or holy card layout optimized for small screens. Ensure all text is concise, high-contrast, and legible at small sizes, with clear hierarchy and minimal clutter. Maintain visual clarity, balanced composition, and immediate recognizability.  The result should be a full view of the card with a relevant background behind the card."
  },
  {
    name: "PEANUTS",
    category: ["COMICS", "CARTOON", "VINTAGE"],
    message: "Take a picture in the style of a Peanuts cartoon strip. Have the subject speaking through a text bubble that reads GOOD GRIEF!"
  },
  {
    name: "PENNIES",
    category: ["TRANSFORMATION", "METAL", "MONEY", "COPPER", "SCULPTURE"],
    message: "Take a picture and transform the subject and entire environment into a composition made entirely of pennies.\n\nThe subject's body, clothing, face, and all features should be constructed from pennies arranged to create three-dimensional form and detail. Use pennies at various angles to catch light differently - some showing Lincoln's profile, others showing the memorial or shield back, creating texture and depth through the varied orientations and tarnish levels of the coins.\n\nInclude pennies of different conditions and ages: shiny new copper pennies, aged darker brown pennies, tarnished green pennies, worn smooth pennies. Use this variation to create shadows, highlights, and dimensional depth. Arrange pennies in overlapping patterns like scales or tiles to build up the subject's form.\n\nThe entire environment should also be made of pennies - floor, walls, furniture, background objects, everything constructed from stacked, arranged, or layered pennies. Create architectural elements and environmental details through penny arrangements.\n\nLighting should emphasize the metallic copper surfaces - warm reddish-brown tones, reflective highlights catching on raised coin edges, shadows between overlapping pennies creating depth. The composition should have realistic metallic sheen and texture.\n\nThe subject should remain recognizable through the arrangement and density of the pennies - use tighter penny arrangements for detailed areas like the face, looser arrangements for larger surfaces. The three-dimensional form should be clear despite being made entirely of circular coins.\n\nThe final image should look like an actual photograph of an elaborate sculpture or installation artwork where everything visible - subject, environment, objects - is constructed from real pennies, creating a unified copper-toned metallic world with impressive detail and dimensional quality."
  },
  {
    name: "PHOTO BOOTH STRIP",
    category: ["HUMOR", "PHOTO", "CARTOON", "PORTRAIT"],
    message: "Take a picture of the subject(s) and turn it into a classic photo booth strip with 3-4 frames vertically aligned.\n\nEach frame should show a different funny or exaggerated pose or expression. Include props like hats, glasses, silly signs, or hand gestures to increase humor.\n\nBackground should resemble a traditional photo booth curtain, with soft lighting and simple textures. Include slight visual imperfections like film grain, light streaks, or small scratches to emulate a real photo strip.\n\nThe final result should feel like a tangible photo booth keepsake, with high readability, playful exaggeration, and a touch of nostalgia."
  },
  {
    name: "PHOTO PUZZLE",
    category: ["PUZZLE", "JIGSAW", "ACTIVITY"],
    message: "Take a picture and transform it into a printable jigsaw puzzle layout. Preserve the original photograph clearly while overlaying visible puzzle piece cut lines across the entire image.\n\nGenerate a classic jigsaw pattern with interlocking pieces of varied shapes and sizes. Ensure pieces are large enough to be easily cut out and assembled by hand. Avoid overly small or complex pieces. Keep the image centered and unobstructed so the subject remains recognizable even when divided.\n\nUse clean, high-contrast cut lines that are clearly visible on small screens and when printed. Do not add numbers, text, or labels. The final image should look like a ready-to-print puzzle sheet that can be cut out and assembled in real life."
  },
  {
    name: "PICTIONARY",
    category: ["PUZZLE", "HUMOR", "GAME"],
    message: "Take a picture and transform the subject into a classic Pictionary-style drawing.\n\nRender the subject as a rough, hand-drawn black marker sketch on a clean whiteboard or paper background. The drawing should look like it was made quickly by an amateur player under time pressure — uneven lines, simple shapes, minimal detail, and imperfect proportions.\n\nPreserve just enough of the subject’s pose, silhouette, and key features so the intended idea is still recognizable, but clearly simplified into crude line art rather than a realistic portrait.\n\nOptional visual cues may be included sparingly, such as motion lines, arrows, or simple icons (e.g., sweat drops, exclamation marks) to suggest action or intent, as commonly seen in Pictionary drawings.\n\nDo NOT include written words, letters, numbers, labels, or clues. The image must rely entirely on the drawing to communicate the idea.\n\nFrame the image so the entire drawing surface is visible, as if photographed during a real game of Pictionary. The final result should feel playful, messy, and immediately readable on a small screen."
  },
  {
    name: "PICTURE PERFECT",
    category: ["PHOTOGRAPHY", "ENHANCED", "PERFECT"],
    message: "Take a picture and make it picture perfect - improve lighting, colors, and overall composition. Professional perfection. Correct lighting, color, sharpness, and realism. Remove any imperfections.  Make it photorealistic.  8k resolution."
  },
  {
    name: "PIMP OR WORKING GIRL",
    category: ["HUMOR", "RETRO", "70S", "COSTUME", "CHARACTERS"],
    message: "Take a picture and transform the subject into a stereotypical 1970s street character based on their gender.\n\nIf MALE: Transform into a flamboyant pimp with exaggerated 1970s style - wide-brimmed fur or velvet hat with feather, oversized sunglasses, flashy suit with loud patterns (zebra print, leopard print, bright colors), platform shoes, gold chains and jewelry, fur coat draped over shoulders, cane with ornate handle, confident swagger pose. Expression should be cocky and self-assured.\n\nIf FEMALE: Transform into a provocative street worker with exaggerated 1970s style - big teased hair or wig, heavy makeup with dramatic eye shadow and false lashes, revealing outfit with hot pants or mini skirt, fishnet stockings, platform boots or heels, fur jacket or boa, excessive jewelry, confident or sultry pose and expression.\n\nSetting should reflect gritty urban 1970s street environment - neon signs, city street at night, vintage cars in background, period-appropriate storefronts. Lighting should have that warm sodium street light glow mixed with colorful neon.\n\nStyle should be photorealistic but capture the over-the-top, exaggerated aesthetic of 1970s exploitation films and blaxploitation cinema. Preserve the subject's recognizable facial features while fully committing to the theatrical costume and styling.\n\nThe final image should feel like a still from a 1970s film - authentic period details, grainy film quality, and the unapologetic bold style of that era's street culture aesthetic."
  },
  {
    name: "PIXAR",
    category: ["ANIMATION", "3D", "CARTOON", "DISNEY"],
    message: "Take a picture in the style of Pixar signature 3D animation.  Use the Pixar style of blending realism with cartoon expressiveness. Vibrant colors, soft shadows, big eyes, rounded features, emotional depth, and animated charm."
  },
  {
    name: "PIXEL ART",
    category: ["RETRO", "ARTISTIC", "GAME", "ABSTRACT"],
    message: "Take a picture and transform it into authentic pixel art.\n\nRebuild the image entirely using a low-resolution pixel grid. The subject must be constructed from visible, square pixels only — no smooth gradients, no blur, no vector lines, and no photographic textures.\n\nLimit the color palette to a small, intentional set (approximately 8–24 colors total). Use flat color blocks with hard pixel edges. Shading should be achieved only through pixel placement and color stepping, not softness or blending.\n\nPreserve the subject’s recognizability through simplified shapes, silhouettes, and key features rather than detail. Facial features, if present, should be minimal and symbolic.\n\nChoose a classic pixel-art style inspired by retro video games (8-bit, 16-bit, or early handheld), but do not copy any specific copyrighted game or character.\n\nEnsure the entire pixel artwork is visible, centered, and readable on a small screen. The final image should feel handcrafted, nostalgic, and unmistakably pixel art — not a filtered photo."
  },
  {
  name: "PLAYBILL",
  category: ["DOCUMENT","VINTAGE", "THEATER", "MASTER PROMPT"],
  message: "Take a picture and transform it into a complete, physical Playbill theater program booklet. The entire Playbill booklet must be fully visible within the frame, including the cover, edges, and proportions of a real printed program.\n\nDesign the front cover in classic Playbill style, with the bold Playbill header at the top and a theatrical production title beneath it. Feature the subject prominently on the cover as the star performer, rendered in a dramatic or comedic stage pose and integrated naturally into the cover art.\n\nEnsure the subject appears printed on the cover itself, not floating above it, with realistic lighting, paper texture, slight wear, and subtle printing imperfections. Add stage-themed design elements such as curtains, spotlights, marquee lights, or silhouettes to reinforce the theatrical setting.\n\nInclude humorous or over-the-top flavor text describing the subject’s role or performance (e.g., 'A One-Person Musical About Snacks,' 'Winner of Seven Imaginary Awards'). All text should be legible and balanced for small screens.\n\nThe booklet should appear photographed against a relevant background (theater seat, stage floor, lobby surface, or neutral setting). Keep the entire Playbill booklet, including borders and corners, fully in frame and clearly readable. The final image should feel like an authentic, collectible theater program."
  },
  {
    name: "PLUSH TOY",
    category: ["TOY", "SOFT", "STUFFED"],
    message: "Take a picture and transform the subject into a plush toy. Soft fabric, stitching details. Cute proportions."
  },
  {
    name: "POINTILLISM",
    category: ["ART", "PAINTING", "DOTS"],
    message: "Take a picture in the style of Pointillism Art. Complementary colors are placed next to each other to intensify each hue and create vibrancy as the viewer eye optically blends the dots from a distance. Made entirely of tiny, colorful dots."
  },
  {
    name: "POLICE SKETCH",
    category: ["SKETCH", "POLICE", "WITNESS", "DRAWING", "MASTER PROMPT"],
    message: "Take a picture and transform the subject into a classic police sketch as if created from a witness description. Depict the subject as a hand-drawn pencil or charcoal sketch on off-white paper, using strong line work, cross-hatching, and shading to define facial structure and key features.\n\nSimplify and alter details so the sketch is approximate rather than an exact replica of the subject. Preserve general identifying characteristics such as face shape, eyes, nose, mouth, hairline, and expression, but introduce small deviations consistent with a sketch from memory.\n\nUse a neutral background with slight paper texture. Add text and police case numbers. The final image should feel serious, observational, and readable on a small screen, reflecting the imperfection of eyewitness recall."
  },
  {
    name: "POLLOCK",
    category: ["ART", "PAINTING", "ARTIST", "ABSTRACT"],
    message: "Take a picture and reinterpret it through abstract expressionism inspired by Jackson Pollock. Overlay energetic splatters, drips, and layered paint textures while allowing hints of the original subject to remain visible beneath the chaos. The final image should feel raw, spontaneous, and motion-filled."
  },
  {
    name: "POKEMON CARD",
    category: ["GAMING", "CARD", "COLLECTIBLE"],
    message: "Take a picture and make it into a pokemon card, add abilities and flavor text inspired by the content of the image. The result should be a full view of the card with a relevant background behind the card."
  },
  {
    name: "POLAROID",
    category: ["PHOTOGRAPHY", "INSTANT", "VINTAGE"],
    message: "Take a picture and transform it into an authentic instant-film photograph aesthetic. Frame the image within a classic Polaroid-style border with a thicker white margin at the bottom. Apply subtle film grain, soft focus, slight color fading, and natural vignetting consistent with instant photography. Include gentle imperfections such as light leaks or minor exposure variation for realism. Ensure the subject remains clearly recognizable and centered within the frame. Render the final image to convincingly resemble a real printed instant photo."
  },
  {
  name: "POLITICAL BANNER",
  category: ["HUMOR", "PARODY", "POSTER", "CAMPAIGN"],
  message: "Take a picture and transform the subject into the star of a humorous political campaign banner.\n\nDesign the image to look like a real campaign poster or rally banner with bold typography, patriotic colors, stars, stripes, and dramatic lighting. The subject should appear as a confident candidate or mascot, posed heroically like they are running for office.\n\nInvent a completely fictional, absurd campaign theme based on the subject’s appearance, clothing, pose, or environment — or use external master prompt text as the campaign platform. Examples:\n• 'Running for President of Florida'\n• 'Vote for Steve: More Coffee, Less Meetings'\n• '2028: The Only One Who Knows Where the Remote Is'\n\nInclude:\n• a fake campaign slogan\n• a fictional office or cause\n• a large election year (real or ridiculous)\n\nDo NOT reference real politicians, real political parties, or real political issues. Everything must be parody, fictional, and harmless.\n\nThe banner should feel like a real political sign or rally poster, but the content should be clearly silly and satirical. Ensure all text and the subject are fully visible and readable on a small screen."
  },
  {
    name: "POLITICAL CARTOON",
    category: ["HUMOR", "CARTOON", "SATIRE", "EDITORIAL"],
    message: "Take a picture and transform the subject into a classic political cartoon–style illustration.\n\nRender the subject with exaggerated facial features, oversized expressions, and bold ink outlines, like a newspaper editorial cartoon. The subject should be the main caricature, not a background figure.\n\nInvent a fictional, humorous issue, campaign, or cause based on the subject’s appearance, posture, clothing, or environment — or use external master prompt text as the cartoon’s theme. Examples:\n• 'The Flatulence Shortage'\n• 'The War on Baldness'\n• 'The Campaign For Less Body Odor'\n\nPlace the subject into a symbolic scene that visually represents the joke — such as standing at a podium, arguing with a cartoon object, battling a pile of paperwork, or leading a ridiculous parade.\n\nInclude cartoon-style labels on objects, signs, or banners to explain the joke (e.g., 'Too Many Emails', 'Monday Morning', 'Broken Remote Control').\n\nDo NOT reference real political parties, politicians, or real-world political issues. Everything must be fictional, absurd, and clearly satirical.\n\nThe final image should look like a newspaper editorial cartoon: hand-drawn ink style, flat colors, strong linework, humorous exaggeration, and instantly readable on a small screen."
  },
  {
    name: "POOR RICHARD'S ALMANACK",
    category: ["DOCUMENT", "VINTAGE", "HUMOR", "HISTORICAL", "TEXT"],
    message: "Take a picture and transform it into an authentic page from Poor Richard's Almanack by Benjamin Franklin. Render the subject as a central illustration in the style of 18th-century woodcut engravings with bold linework, cross-hatching, and period-accurate colonial American aesthetic. Surround the illustration with aged, yellowed paper showing foxing, stains, and worn edges typical of 1730s–1750s printed almanacs.\n\nInclude period-accurate typography using blackletter or colonial serif fonts for headers. Feature a famous Benjamin Franklin saying or proverb prominently on the page in large, clear text, such as 'Early to bed and early to rise, makes a man healthy, wealthy, and wise,' 'A penny saved is a penny earned,' or 'Well done is better than well said.' Ensure this saying is the **most prominent text element** and fully visible.\n\nOptionally, add small marginal notes, weather predictions, or astronomical observations in smaller text around the edges. Include decorative borders, flourishes, and printer's ornaments typical of colonial printing. Render realistic ink impressions, slight printing misalignments, and other subtle imperfections to emulate a true 18th-century printed page.\n\nPlace the page fully within the frame with a relevant background behind it. Keep the entire almanac page, including borders, subject illustration, and text, **clearly visible and readable on small screens**. The final image should feel historically authentic, detailed, and visually rich while keeping the subject integrated into the almanac page."
  },
  {
    name: "POP ART",
    category: ["ART", "POP ART", "COLORFUL"],
    message: "Take a picture and make it Pop Art. Employs vibrant, bold colors, simplified imagery, and techniques from the commercial world like screen-printing, often with a sense of humor, irony, or wit."
  },
  {
    name: "POP-UP BOOK",
    category: ["BOOK", "PAPER", "3D"],
    message: "Take a picture and transform the entire scene into a physical pop-up book made of paper. The subject should be constructed entirely as a pop-up paper structure that rises upward from folded paper layers attached to the book’s pages.\n\nThe subject must emerge directly from the page through visible folds, hinges, tabs, and layered paper planes. The body, face, and features should be formed from flat paper pieces assembled into a three-dimensional pop-up mechanism, clearly connected to the page surface.\n\nShow the open book with two facing pages visible. The pop-up elements should clearly originate from the folds of the pages and extend upward, as if they would collapse flat when the book is closed.\n\nUse realistic paper textures, visible creases, cut edges, and paper thickness. All materials must look like paper—no skin, fabric, plastic, or realistic surfaces. Lighting and shadows should emphasize the layered paper construction. The final image should look like a photographed pop-up book page where the subject is part of the paper engineering itself."
  },
  {
    name: "PORCELAIN",
    category: ["SCULPTURE", "CERAMIC", "DELICATE"],
    message: "Take a picture and make the subject a porcelain sculpture. Glossy ceramic finish."
  },
  {
    name: "PORTRAIT",
    category: ["PHOTOGRAPHY", "PORTRAIT", "FRAMED"],
    message: "Take a picture in the style of Photorealistic Portrait. Frame the picture in a dark black wood frame."
  },
  {
    name: "POSTCARD",
    category: ["TRAVEL", "VINTAGE", "GREETING", "SOUVENIR"],
    message: "Take a picture and transform it into a physical vintage-style tourist postcard.\n\nDesign the postcard using classic souvenir postcard aesthetics: bold city lettering, saturated colors, slightly dated typography, and a cheerful, kitschy layout. Select a city automatically or use one provided via external master prompt.\n\nIntegrate the subject naturally into the postcard image as part of the photographed scene, not pasted on top. The subject should feel printed directly onto the card.\n\nInclude prominent text reading \"WISH YOU WERE HERE\" in a large, playful postcard-style font. The text must be clearly legible and feel printed on the card surface.\n\nAdd subtle wear details such as rounded corners, slight fading, paper texture, minor creases, or edge wear so the postcard feels handled and mailed.\n\nEnsure the entire postcard is fully visible within the frame, including borders. The postcard should appear resting on a surface or held, with a relevant background visible behind the card.\n\nThe final image should feel nostalgic, friendly, and unmistakably like a real souvenir postcard — clearly readable on a small screen."
  },
  {
    name: "POTATO",
    category: ["HUMOR", "FOOD", "POTATO"],
    message: "Take a picture and make the subject into a potato.  Preserve recognizable traits humorously."
  },
  {
    name: "POTTER",
    category: ["MOVIES", "MASTER PROMPT", "FANTASY", "MAGIC"],
    message: "Take a picture and place the subject naturally within a detailed, cinematic scene from the Harry Potter universe. Preserve the subject’s facial identity. Surround the subject with authentic Hogwarts scenery—enchanted castle halls, floating candles, spell effects, and magical ambiance. Match the film’s lighting and color grading for realism. Capture depth and atmosphere similar to the movies, with subtle magical motion or glow around wands and objects. Maintain the subject’s natural facial features and proportions while blending clothing and environment into the Hogwarts world. Render in ultra-realistic 8K, with soft volumetric lighting, depth of field, and fantasy realism. Based on the subject’s personality, traits, and characteristics, assign the subject to one of the four Hogwarts houses and have them wear the corresponding house robes: Gryffindor (brave, daring, chivalrous, red & gold, lion), Slytherin (ambitious, cunning, resourceful, green & silver, serpent), Ravenclaw (wise, creative, intellectual, blue & bronze, eagle), or Hufflepuff (loyal, kind, hardworking, yellow & black, badger). Ensure the house choice aligns with the subject’s personality and integrates naturally into the scene."
  },
  {
    name: "POWERPUFF GIRLS",
    category: ["ANIMATION", "CARTOON", "TV"],
    message: "Take a picture in the style of a Powerpuff girls animation."
  },
  {
    name: "PRE-RAPHAELITE",
    category: ["ART", "PAINTING", "ROMANTIC"],
    message: "Take a picture and transform the image into Pre-Raphaelite style painting. Vivid colors, detailed textures, medieval or literary elements, and highly idealized subject portrayal."
  },
  {
    name: "PRODUCT SAFETY RECALL",
    category: ["HUMOR", "MASTER PROMPT", "TEXT", "DOCUMENT"],
    message: "Take a picture and transform it into a professional-looking product safety recall notice featuring the subject as the recalled product.\n\nDesign the image as a formal corporate recall poster or notice with a clean layout, neutral colors, and official warning-style formatting. Include a large product photo of the subject centered on the page.\n\nAdd humorous recall language such as 'Affected units may unexpectedly…' or 'Discontinue use if symptoms include…' based on the subject’s appearance or expression.\n\nInclude fake batch numbers, model codes, inspection stamps, and circular diagram callouts pointing to parts of the subject with labels. The text should be legible but clearly parody.\n\nEnsure the entire recall notice page is fully visible, including margins and layout elements. The final image should feel like a real corporate recall document at first glance, with humor revealed on closer inspection."
  },
  {
    name: "PROFILE",
    category: ["HUMOR", "MASTER PROMPT", "FBI", "TEXT", "DOCUMENT"],
    message: "Take a picture and transform it into a humorous FBI-style profile page. Design the layout to resemble an official dossier with structured sections such as subject name, profile photo, and case notes. Generate playful flavor text, including a fictional name and lighthearted, clearly fictional infractions inspired by the subject’s appearance, expression, clothing, and surroundings, incorporating any externally provided details naturally. Maintain a realistic document aesthetic while ensuring the tone is clearly comedic. Render the final image photorealistically with crisp text, believable formatting, and polished presentation."
  },
  {
    name: "PROPAGANDA POSTER",
    category: ["HUMOR", "VINTAGE", "POSTER", "DRAMATIC"],
    message: "Take a picture of the subject and transform them into the heroic figure in a vintage propaganda-style poster.\n\nThe subject should be shown in a powerful, inspiring pose such as pointing forward, raising a fist, or leading a crowd.\n\nUse bold colors, dramatic lighting, and strong graphic shapes typical of old propaganda artwork.\n\nInclude a large slogan or call-to-action on the poster using humorous or absurd flavor text. External master prompt text may be used to supply the slogan or theme.\n\nThe cause being promoted must be fictional and ridiculous, such as a campaign for snacks, naps, or avoiding Mondays.\n\nThe final image should look like a classic propaganda poster, bold, striking, and instantly readable."
  },
  {
    name: "PROTEST",
    category: ["HUMOR", "MASTER PROMPT", "POLITICS", "TEXT"],
    message: "Take a picture and place the subject naturally into a realistic, non-political protest or demonstration scene. The subject should blend into a crowd of ordinary people as if they are genuinely participating, not staged or spotlighted.\n\nThe subject must be holding a clearly visible protest sign with a humorous, absurd, or lighthearted message inspired by the subject’s appearance, posture, expression, or surrounding context. The message should be playful and harmless (e.g., 'More Snacks, Less Responsibilities,' 'Justice for Left Socks,' 'End Meetings That Could’ve Been Emails'). The exact wording may be influenced by external flavor text or master prompts.\n\nEnsure the sign looks authentic: handmade poster board or cardboard, bold marker lettering, slightly uneven edges, realistic hand grip, and natural perspective distortion. The sign text must be fully readable and entirely visible within the frame.\n\nThe environment should resemble a real protest setting (street, park, plaza, sidewalk) with believable crowd density, natural lighting, candid body language, and realistic depth of field. Avoid political slogans, symbols, or identifiable political figures.\n\nThe subject should not be isolated or overly centered — they should feel discovered within the crowd. Clothing, expressions, and posture should appear spontaneous and believable.\n\nThe final image must show the subject, their full protest sign, and enough surrounding context to clearly read the scene on a small screen. The tone should be comedic, observational, and visually convincing."
  },
  {
    name: "PS1 POLYGON MEMORY",
    category: ["RETRO", "GAMING", "90S", "3D"],
    message: "Take a picture and transform it into a PlayStation 1–era 3D render. Use low-polygon geometry, warped textures, visible seams, and jittery perspective. Lighting should be flat or uneven. The subject should appear slightly uncanny, as if rendered by early 3D hardware."
  },
  {
    name: "PSYCHEDELIC 60s",
    category: ["ART", "PSYCHEDELIC", "60S", "COLORFUL"],
    message: "Take a picture and transform the image into 1960s psychedelic art. Swirling colors, distorted shapes, vibrant patterns, and dreamlike visual intensity."
  },
  {
    name: "PUNCHLINE",
    category: ["HUMOR", "VISUAL", "CLEVER"],
    message: "Take a picture and transform it into a visually coherent scene that sets up a clear, believable expectation involving the subject, then delivers a clever visual punchline that subverts that expectation without using captions, speech bubbles, or overt comedy props. The humor must be communicated entirely through visual context, timing, and composition rather than exaggeration or parody. Preserve the subject’s recognizable identity and integrate them naturally into the scene so the punchline feels intentional and discovered rather than obvious. The image should read as normal at first glance, with the punchline revealing itself a moment later upon closer inspection. Render with realistic lighting, scale, and detail so the scene feels grounded despite the twist."
  },
  {
    name: "QR CODE ME",
    category: ["DESIGN", "DOCUMENT", "HUMOR", "ABSTRACT", "MASTER PROMPT"],
    message: "Take a picture and transform it into a QR-code-style graphic where the subject is embedded into the code itself.\n\nThe final image should clearly read as a QR code at first glance, using a consistent grid of square black-and-white modules across the entire image. However, when viewed from a moderate distance, the subject’s face or silhouette should become recognizable through natural variations in module density and contrast.\n\nDo NOT place a photographic image inside the QR code. The subject must be constructed entirely from QR-style square modules. No smooth shading, no realistic textures, and no visible photo elements.\n\nAllow the subject’s general facial structure or silhouette to emerge softly from the pattern — eyes, nose, or head shape may be suggested, but only through block clustering and negative space, not sharp outlines or high-detail rendering.\n\nThe subject may be centered, but must not overpower the QR pattern. The grid must remain continuous and visually dominant across the entire image.\n\nInclude subtle QR-inspired elements such as finder squares or alignment blocks, integrated naturally without framing or spotlighting the subject.\n\nThis does NOT need to be a functional or scannable QR code. Treat the QR structure as a visual language, not a technical requirement.\n\nIf external master prompt text is provided, let it influence overall density, contrast, or rhythm of the blocks rather than forming readable text.\n\nUse high contrast, clean edges, and a minimal black-and-white palette. The final image should feel clever, modern, and readable on a small screen — a QR code first, with the subject revealed through pattern."
  },
  {
    name: "QUASI-MUTATION",
    category: ["HORROR", "TRANSFORMATION", "CREATURE"],
    message: "Take a picture and transform the subject as if undergoing a dramatic mutation into a powerful alternate form. Randomly select a creature or archetype such as a werewolf, Hyde-style transformation, monstrous hybrid, or other iconic mutated form. Preserve the subject’s recognizable facial structure, eyes, expression, and identity while exaggerating musculature, posture, skin texture, or anatomy appropriate to the transformation. Blend human and creature features convincingly so the subject still feels like the same individual mid- or post-mutation. Integrate the subject naturally into the scene with cinematic lighting, dynamic pose, and realistic interaction with the environment. Render the final image with photorealistic detail, dramatic contrast, and a sense of raw power and transformation."
  },
  {
    name: "QUE PASA USA?",
    category: ["TV", "COMEDY", "CUBAN", "RETRO", "SITCOM", "70S"],
    message: "Take a picture and transform the subject into a scene from the classic bilingual Cuban-American sitcom 'Que Pasa USA?' from the 1970s.\n\nPlace the subject into the iconic Peña family household setting with the show's original characters present in the scene: the grandparents (Abuela and Abuelo), parents (Juana and Joe), and teenagers (Carmen and Joe Jr). The subject should be integrated naturally as if they are a family member, friend, or visitor interacting with the characters.\n\nThe setting should capture the show's characteristic environment: the modest Miami household interior with 1970s decor, furniture, and styling. Include authentic period details like vintage appliances, wallpaper patterns, family photos on walls, and the warm, lived-in feel of a Cuban-American home.\n\nCapture the show's signature visual aesthetic: slightly grainy film quality from 1970s television production, warm indoor lighting, and the authentic multicamera sitcom look. Use the color palette and lighting that matches the original show's appearance.\n\nThe subject should be dressed in period-appropriate 1970s clothing that fits the scene. Their expression and body language should suggest they're part of a typical sitcom moment - family discussion, comedic misunderstanding, cultural clash between generations, or bilingual conversation.\n\nOther characters in the scene should look authentic to the show - maintaining the actors' appearances from the original series. The interaction should feel natural and capture the show's themes of Cuban-American family life, generational differences, and the immigrant experience.\n\nThe final image should look like an actual still frame from the show, with the subject seamlessly integrated into this beloved piece of Cuban-American television history. Include the warm, nostalgic atmosphere and the show's signature blend of English and Spanish cultural elements."
  },
  {
    name: "R-ROLL",
    category: ["HUMOR", "MEME", "PHOTOBOMB", "RICK ASTLEY"],
    message: "Take a picture and include a singing Rick Astley standing next to the subject.  Make it photorealistic."
  },
  {
    name: "RAGDOLL",
    category: ["TOY", "DOLL", "SOFT"],
    message: "Take a picture and turn the subject into a ragdoll. Maintain the characteristics of the subject. Fabric textures, stitched seams."
  },
  {
    name: "RANDOM PROFESSIONAL",
    category: ["OCCUPATION", "COSTUME", "PROFESSIONAL"],
    message: "Take a picture and transform the subject into a randomly selected professional role. Select from a broad range of contemporary professions across industries. The chosen profession should be clearly recognizable through accurate, real-world attire, accessories, and tools associated with that role. Preserve the subject’s recognizable facial structure, expression, and identity while adapting hairstyle, clothing, and posture to suit the profession naturally. Place the subject in a realistic environment appropriate to the profession, with consistent lighting, scale, and perspective so the transformation feels authentic rather than like a costume. Ensure the subject appears fully integrated into the scene, as if genuinely working in that profession. Render with photorealistic detail and believable realism."
  },
  {
    name: "RANGE OF EMOTIONS",
    category: ["HUMOR", "PORTRAIT", "EMOTION", "GRID"],
    message: "Take a picture of the subject and transform it into a 2×2 grid showing four different emotional states.\n\nEach panel must show the same subject with a different exaggerated emotion chosen from: happy, sad, crying, mad, angry, depressed, shocked, or confused.\n\nThe expressions should be strong and clearly readable: wide smiles, tears, frowns, clenched jaws, or dramatic eye contact.\n\nLighting and framing should stay consistent so it looks like a real emotional photo shoot.\n\nThe final image should look like a professional but humorous acting range card, instantly showing how many moods the subject can portray."
  },
  {
    name: "RAPPER",
    category: ["MUSIC", "HIP HOP", "URBAN", "CONTEMPORARY"],
    message: "Take a picture and transform the subject into a modern hip-hop rapper with authentic street style and attitude.\n\nClothing and style: Oversized designer hoodie or graphic t-shirt, baggy jeans or track pants, fresh sneakers (high-end brands like Jordans, Yeezys), fitted cap or beanie, multiple gold or diamond chains, expensive watch, rings on multiple fingers, possibly designer sunglasses. The outfit should mix streetwear with luxury brands.\n\nAccessories and details: Visible tattoos (face, neck, hands), grills or gold teeth optional, perfectly groomed facial hair or clean-shaven, fresh haircut with clean lineup, possibly colored or styled hair.\n\nPose and expression: Confident, tough, or laid-back attitude - could be throwing up hand signs, leaning against expensive car, holding microphone, showing off jewelry, or in a power stance. Expression should convey swagger, confidence, and star presence.\n\nSetting options: Recording studio with equipment visible, luxury car (Lamborghini, Bentley, Rolls Royce), mansion or penthouse, nightclub VIP section, urban street with graffiti backdrop, or stage with dramatic lighting.\n\nLighting should be professional - studio quality with dramatic shadows, colored gel lights (purple, blue, red), or high-contrast urban photography style.\n\nPreserve the subject's recognizable facial features while transforming them into a photorealistic modern rapper with authentic hip-hop styling, expensive fashion, and the confidence and presence of a chart-topping artist. The final image should look like a professional promotional photo or album cover shot."
  },
  {
    name: "REAL-LUNGING",
    category: ["HUMOR", "SCARY", "ANIMATED"],
    message: "Take a picture and make the inanimate object real and make it lunging at me. Make it photorealistic."
  },
  {
    name: "REAL-NOT LUNGING",
    category: ["TRANSFORMATION", "REALISTIC", "ANIMATED"],
    message: "Take a picture and make the inanimate object real. Make it photorealistic."
  },
  {
    name: "RECIPE CARD-FUNNY",
    category: ["HUMOR", "FOOD", "CARD"],
    message: "Take a picture and transform it into a humorous recipe card. Include the photograph at the top as the featured image. Treat the subject as if it were a recipe concept rather than literal food. Write playful, metaphorical ingredients and preparation steps that describe the subject’s personality, appearance, or vibe. Keep the layout simple and readable for a small screen. The final image should feel whimsical and intentionally absurd."
  },
  {
    name: "RECIPE CARD-SERIOUS",
    category: ["RECIPE", "FOOD", "CARD"],
    message: "Take a picture and identify the subject. If the subject is food or appears edible, generate a real, practical recipe based on it. Include the photograph at the top of the layout as the featured image. Present a clear ingredients list and simple preparation steps. Use a clean, readable recipe-card style optimized for a small screen. The photograph should clearly represent the dish being described."
  },
  {
    name: "RECURSIVE IMAGE",
    category: ["ILLUSION", "INFINITE", "FRACTAL"],
    message: "Take a picture and transform the image into infinite visual recursion. The image contains itself within itself."
  },
  {
    name: "REMBRANDT",
    category: ["ART", "PAINTING", "CLASSIC", "ARTIST"],
    message: "Take a picture in the style of Rembrandt van Rijn, Dutch Golden Age painting, oil painting, chiaroscuro masterpiece. Dramatic chiaroscuro lighting. Add atmospheric texture: rich oil painting texture, thick impasto brushstrokes, moody and spiritual atmosphere."
  },
  {
    name: "RENAISSANCE",
    category: ["ART", "PAINTING", "CLASSIC"],
    message: "Take a picture in the style of a Renaissance Painting. Include linear perspective, depth and realism. Focus on human expression, dynamic poses, and realistic landscapes. Feature a wide range of natural pigments like lead white, azurite, verdigris, ochers, malachite, vermilion, and lapis lazuli, used with binders such as egg tempera and oil, to create vibrant, naturalistic colors and complex effects. Focus on light, shadow, and harmonious blending to create realism and naturalism."
  },
  {
    name: "RICK AND MORTY",
    category: ["ANIMATION", "CARTOON", "TV", "SCI FI"],
    message: "Take a picture in the style of a Rick and Morty episode scene-colorful, chaotic, and slightly grotesque. Convert characters from the Rick and Morty multiverse, complete with wacky gadgets, bizarre outfits, angular features, and offbeat personalities."
  },
  {
    name: "RIDE PHOTO MOMENT",
    category: ["MASTER PROMPT", "AMUSEMENT PARK", "ROLLER COASTER", "ACTION"],
    message: "Take a picture and transform it into an official amusement park ride photo captured at the peak moment of excitement. Place the subject seated in a ride vehicle, mid-action, with wind-blown hair, dramatic expressions, and dynamic motion blur. Add an on-ride camera angle and a branded photo-frame overlay typical of theme park ride photos. Leave room for externally provided language to specify the amusement park name and ride name, and seamlessly incorporate those details into signage, ride branding, or the photo border. The final image should feel energetic, candid, and like a souvenir photo taken at the ride’s most thrilling moment."
  },
  {
    name: "RIPLEY'S BELIEVE-IT-OR-NOT",
    category: ["HUMOR", "VINTAGE", "HISTORY", "CARTOON"],
    message: "Take a picture of the subject and transform it into a vintage newspaper oddities feature in the style of early 1900s 'Believe It or Not' cartoons.\n\nThe subject should be presented as part of a famous real-life historical oddity. Choose or invent a presentation based on one of these real, well-known curiosities:\n• A man who could eat metal, bicycles, or glass\n• A person with extremely long hair or beard\n• An extremely tall or extremely short person\n• A human with unusual physical abilities or endurance\n• A bizarre but real historical record\n\nPlace the subject into the scene as the star of this oddity — performing, displaying, or being photographed as the incredible attraction.\n\nDesign the image like a classic newspaper cartoon with ink lines, bold headlines, arrows, labels, and dramatic captions explaining the unbelievable fact.\n\nUse external master prompt text, if provided, to influence name of subject, which oddity is shown or to add humorous headline flavor.\n\nThe final image should look like a real historical 'believe it or not' newspaper feature: exaggerated, educational, and absurd, but grounded in a real type of recorded human curiosity."
  },
  {
    name: "RISOGRAPH",
    category: ["ART", "PRINT", "VINTAGE"],
    message: "Take a picture and transform the image into risograph print style. Layered ink colors, misregistration. Paper grain texture."
  },
  {
    name: "ROAD SIGN",
    category: ["MASTER PROMPT", "SIGN", "HUMOR"],
    message: "Take a picture and transform it into a realistic roadside warning or informational sign featuring the subject. The sign must conform to standard road sign design conventions: simple shapes, high-contrast colors, bold sans-serif lettering, and minimal visual clutter.\n\nPlace the subject as a simplified, sign-style pictogram or silhouette illustration (not photoreal) rendered in the same visual language as pedestrian, animal, or caution signs. The subject should clearly resemble the person but be stylized to match real traffic sign iconography.\n\nInclude a short sign message such as '[NAME] CROSSING,' 'BEWARE OF [NAME],' or similar wording. Text must be large, centered, and legible from a distance.\n\nMount the sign on a realistic metal post in a roadside or urban environment. Ensure the entire sign, including edges and post, is fully visible within the frame. The final image should look like a real, installed road sign that someone could encounter in the wild."
  },
  {
    name: "ROBLOX",
    category: ["GAMING", "3D", "BLOCKY"],
    message: "Take a picture in the style of Roblox. Simplified 3D characters."
  },
  {
    name: "ROBOT",
    category: ["SCI FI", "ROBOT", "MECHANICAL"],
    message: "Take a picture and make everything into mechanical robots that maintain the characteristics of the objects. Make it photorealistic."
  },
  {
    name: "ROB REINER FILM",
    category: ["HUMOR", "MOVIE", "SCENE", "CULT CLASSIC"],
    message: "Take a picture of the subject and place them into a famous scene from a Rob Reiner film, such as *The Princess Bride*, *When Harry Met Sally*, *Stand by Me*, or *Misery*.\n\nThe subject should be integrated naturally into the scene, interacting with the environment and other characters in a way that makes them the central focus.\n\nLighting, perspective, and costume should match the film style and era, making it look like a real frame from the movie.\n\nOptional flavor text from the master prompt can influence which film or scene to use, or what absurd twist to add (e.g., subject delivers the iconic line, performs the fencing duel, or sits in the famous diner scene with a ridiculous expression).\n\nThe final image should be humorous, cinematic, and instantly recognizable as a reimagined Rob Reiner movie scene starring the subject."
  },
  {
    name: "ROCKWELL",
    category: ["ART", "PAINTING", "AMERICAN", "ARTIST"],
    message: "Take a picture in the style of a Norman Rockwell illustration. Render with meticulous detail and vibrant colors to portray realistic, yet idealized nostalgic Americana."
  },
  {
    name: "ROCOCO",
    category: ["ART", "PAINTING", "ORNATE", "CLASSIC"],
    message: "Take a picture and transform the image into Rococo style painting. Pastel colors, ornamental patterns, playful composition, delicate brushstrokes, floral and interior details."
  },
  {
    name: "ROMANTICISM",
    category: ["ART", "PAINTING", "ROMANTIC", "DRAMATIC"],
    message: "Take a picture in the style of a Romanticism painting. Moody lighting, emotional intensity, dramatic composition, and expressive colors. Subject central and impactful."
  },
  {
    name: "ROMANESQUE PAINTING",
    category: ["ART", "PAINTING", "MEDIEVAL"],
    message: "Take a picture and transform the image into Romanesque-style painting. Simplify forms, use bold outlines, flat areas of color, and stylized faces. Include architectural or decorative elements inspired by early medieval European art. Keep the subject recognizable while appearing as if part of a historical religious or historical scene."
  },
  {
     name: "ROYAL PORTRAIT",
     category: ["HUMOR", "HISTORY", "PORTRAIT"],
     message: "Take a picture of the subject and transform them into a royal figure in a classic painted portrait.\n\nDress the subject in elegant royal clothing such as crowns, robes, medals, or gowns.\n\nPlace them in a grand palace or painted studio background.\n\nThe style should resemble a formal oil painting with dramatic lighting and rich colors.\n\nThe subject should look powerful, noble, and slightly over-the-top, like a legendary monarch."
  },
  {
    name: "RPG PORTRAIT",
    category: ["GAMING", "RPG", "PORTRAIT"],
    message: "Take a picture and transform the subject into an RPG character portrait. Fantasy UI frame, stat panel styling. Painted character art. The result should be a full view of the portrait with a relevant background behind the portrait."
  },
  {
    name: "RUBBER DUCKIE",
    category: ["HUMOR", "TOY", "TRANSFORM"],
    message: "Take a picture and transform the subject into a yellow rubber duck bath toy. Bright yellow rubber material with orange beak, glossy plastic surface with light reflections, squeezable toy texture, black dot eyes. The subject's recognizable features should be incorporated into the duck's shape and form. Bath toy appearance, floating in water with subtle ripples, playful and whimsical."
  },
  {
    name: "RUBBER HOSE",
    category: ["ANIMATION", "CARTOON", "VINTAGE", "30S"],
    message: "Take a picture and transform the image into 1930s rubber hose animation style. Bouncy limbs, simple faces. Vintage cartoon aesthetic."
  },
  {
    name: "RUSSIAN ICONOGRAPHY",
    category: ["ART", "RELIGIOUS", "RUSSIAN"],
    message: "Take a picture and transform the image into Russian iconography style art. Stylized facial features, gold accents, symbolic colors, frontal composition, and spiritual solemnity."
  },
  {
    name: "SCANDINAVIAN FOLK ART",
    category: ["ART", "CULTURAL", "SCANDINAVIAN"],
    message: "Take a picture and transform the image into Scandinavian folk art style art. Decorative patterns, muted earthy tones, simple geometry, and traditional motifs."
  },
  {
    name: "SCARY MOVIE",
    category: ["HUMOR", "MOVIES", "PARODY", "MASK"],
    message: "Take a picture and transform the subject so their face appears as a comedic parody mask inspired by the exaggerated 'Whassup' character style from the Scary Movie films.\n\nThe mask MUST be solid white in color. Do NOT use skin tones, flesh colors, beige, pink, or realistic human coloration. The mask should clearly read as a white costume mask.\n\nThe mask should be clearly rubbery and costume-like, not realistic or eerie. Use a droopy, stretched face shape with oversized eye holes, exaggerated mouth opening, and slightly uneven proportions. The expression should feel goofy, slack, and intentionally silly rather than threatening.\n\nSubtly adapt the mask to the subject so each render feels unique while staying comedic. Variations may include:\n• mouth shape loosely matching the subject’s expression (open, smirking, surprised)\n• uneven eye openings influenced by the subject’s eye spacing\n• stretched or sagging areas reflecting the subject’s face shape\n• molded impressions suggesting glasses or accessories if present\n\nDress the subject in a loose black hooded robe that looks like a cheap Halloween costume rather than a cinematic outfit. Fabric should appear lightweight, wrinkled, and slightly ill-fitting for comedic effect.\n\nThe overall tone must be humorous and absurd, not scary. Do not add blood, weapons, or horror elements. Lighting and composition should feel casual and playful, as if captured during a parody scene.\n\nThe final image should immediately read as a Scary Movie–style spoof — goofy, recognizable, and funny — while remaining clear and readable on small screens."
  },
  {
    name: "SCOOBY-DOO ENDING",
    category: ["CARTOON", "HUMOR", "RETRO"],
    message: "Take a picture and place the subject in a classic Scooby-Doo unmasking scene ending. Subject shown as the unmasked villain with shocked/guilty expression, surrounded by the Mystery Inc. gang (Fred, Daphne, Velma, Shaggy, and Scooby-Doo) pointing accusingly. Subject drawn in Hanna-Barbera animation style with bold black outlines and flat cel-shaded colors. Include speech bubble with 'And I would have gotten away with it too, if it weren't for you meddling kids!' Classic 1970s Scooby-Doo art style, vintage cartoon aesthetic, iconic reveal moment from the show's ending. Spooky background setting like haunted mansion or abandoned amusement park."
  },
  {
    name: "SCOTT ADAMS' DILBERT",
    category: ["COMIC", "CARTOON", "OFFICE", "SATIRE", "CORPORATE"],
    message: "Take a picture and transform the subject into Scott Adams' distinctive Dilbert comic strip art style.\n\nArt style characteristics: Simple, clean black ink lines with minimal detail, geometric shapes, flat color fills with no gradients or shading, white backgrounds or minimal environment details. Characters have simplified facial features - dot eyes, simple curved lines for mouths, basic nose shapes. Bodies are rectangular or cylindrical with minimal anatomical detail.\n\nTransform the subject into this simplified comic style while keeping them recognizable through key features like hairstyle, glasses, facial hair, or distinctive characteristics adapted to the minimalist art style. Use the characteristic Dilbert character proportions - slightly oversized heads on simple rectangular bodies.\n\nClothing should be office attire - dress shirt, tie, slacks for business look, rendered with simple clean lines and solid colors. Include the signature white collar and simple tie design typical of Dilbert characters.\n\nSetting should be a minimal office cubicle environment - simple desk, computer monitor (rendered as basic rectangles), office chair, cubicle walls. Keep backgrounds sparse and clean with simple straight lines, characteristic of the comic strip's minimal aesthetic.\n\nExpression should capture workplace emotions - deadpan frustration, sarcastic smile, exhausted resignation, or cynical awareness typical of Dilbert's office humor. Keep facial expressions simple but expressive using minimal lines.\n\nThe final image should look exactly like a panel from the Dilbert comic strip - clean ink lines, flat colors, minimal detail, geometric simplification, and the satirical corporate office aesthetic. The subject should be instantly recognizable while fully adapted to Scott Adams' distinctive minimalist comic art style."
  },
  {
    name: "SCREAM",
    category: ["HORROR", "MOVIES", "MASK"],
    message: "Take a picture and transform the subject so their face appears as a Ghostface-style mask while preserving the subject’s underlying facial structure, proportions, and expression. The mask should be smooth white with elongated eyes and mouth, subtly shaped by the subject’s face so it feels worn rather than pasted on.\n\nDress the subject in a flowing black hooded robe inspired by the classic Ghostface costume. Ensure the hood frames the mask naturally, with realistic fabric folds, shadows, and texture. Match lighting, perspective, and depth so the costume integrates seamlessly with the original scene.\n\nMaintain a clean, non-graphic horror aesthetic. Do not add blood, weapons, or violent elements. The final image should feel eerie, iconic, and cinematic while remaining clearly readable on small screens."
  },
  {
    name: "SECURITY CAMERA FOOTAGE",
    category: ["SURVEILLANCE", "LOW QUALITY", "SECURITY"],
    message: "Take a picture and transform it into low-quality security camera footage. Render the image in washed-out grayscale or green-tinted night vision with heavy noise and compression artifacts. Add a timestamp and camera label (e.g., CAM 03, 02:14 AM) in a blocky digital font. The framing should feel awkward or off-center, with slight motion blur or ghosting. Reduce detail and sharpness while preserving the subject’s silhouette. The image should feel surveilled, impersonal, and slightly unsettling."
  },
  {
    name: "SEND IN THE CLOWNS",
    category: ["HUMOR", "INTERPRETATION", "CLOWN", "CIRCUS"],
    message: "Take a picture and transform the subject into a clown, adapting the clown’s style based on the subject’s facial expression. Preserve the subject’s facial structure and identity while applying expressive clown makeup and costume details. Automatically select ONE of the following interpretations based on the subject’s apparent emotion:\n\n• Happy Clown — if the subject is smiling or joyful, use bright colors, a rounded red nose, cheerful face paint, and playful costume elements.\n• Sad Clown — if the subject appears sad or frowning, use muted colors, downward eye makeup, a single painted tear, softer lighting, and a melancholic expression.\n• Evil Clown — if the subject appears angry, intense, or menacing, use darker colors, sharp makeup lines, exaggerated shadows, unsettling grin or glare, and dramatic lighting.\n\nEnsure the chosen clown type is visually clear and emotionally consistent. The final image should feel theatrical, expressive, and unmistakably clown-like while keeping the subject recognizable."
  },
  {
    name: "SENTIENT OBJECT",
    category: ["HUMOR", "OBJECT", "FACE"],
    message: "Take a picture and transform the subject into a sentient everyday object while preserving recognizable facial features, expressions, and personality. Choose an object that feels thematically connected to the subject’s clothing, pose, or surroundings, such as a vending machine, toaster, mailbox, lamp, or appliance. Integrate the subject’s face naturally into the object’s design so it appears alive and expressive. Place the character in a believable environment where the object would normally exist, with consistent lighting, scale, and shadows. Render the final image with surreal realism and a humorous, imaginative tone."
  },
  {
    name: "SEUSS",
    category: ["BOOK", "CARTOON", "WHIMSICAL"],
    message: "Take a picture and transform the subject and the surrounding scene into a whimsical Dr. Seuss book illustration. Preserve the subject’s recognizable facial features and personality while adapting their appearance to the exaggerated, fantastical style of Dr. Seuss characters with playful proportions, quirky shapes, and vibrant colors. The environment should include imaginative, surreal elements typical of Seuss worlds—twisting landscapes, unusual plants, and whimsical architecture. Add accompanying flavor text transformed into a short rhyming poem or verse that complements the scene and subject, in the signature playful, rhythmic, and nonsensical style of Dr. Seuss. Ensure the subject remains clearly identifiable and fully integrated into the Seussian world."
  },
  {
    name: "SHAKESPEAREAN",
    category: ["THEATER", "CLASSIC", "COSTUME"],
    message: "Take a picture and make the subject an actor in a Shakespearean play. Dress the subject in period-accurate costume in the same style as the chosen Shakespearean play, apply stage lighting, and dramatic theatrical pose."
  },
  {
    name: "SHARP CALM LATTE",
    category: ["DESIGN", "EDITORIAL", "ABSTRACT", "STRUCTURAL"],
    message: "Take a picture and reconstruct it using extreme sharp-edged depth simulation.\n\nBreak the scene into multiple flat, rigid layers (foreground, midground, background). Each layer must have hard, geometric edges with no feathering, no blur, and no soft transitions. Treat each layer like a physical cutout made from thick card stock or acrylic sheets.\n\nDepth must be created ONLY through layer offset, overlap, scale, and cast shadows — never through photographic depth of field, bokeh, or blur. Shadows should be crisp, directional, and slightly offset to clearly reveal stacking order.\n\nSimplify the subject into bold planar shapes while preserving recognizable silhouette and posture. Remove surface texture and fine photographic detail. Surfaces should appear smooth, matte, and manufactured.\n\nUse a strictly limited calm latte palette: warm ivory, oat beige, sand, almond, soft clay, light mocha, and espresso brown. No saturated colors, no gradients beyond flat tonal steps.\n\nLighting should feel artificial and diagrammatic, as if lit for a design mockup or museum model, not a real-world photograph.\n\nThe final image should resemble a precision-cut, depth-layered design object or editorial poster. It must look constructed, not painted, not photographed, and not illustrated. Ensure all forms remain sharply defined and clearly readable on a small screen. Treat all edges as laser-cut; any softness or blur is an error."
  },
  {
    name: "SHOPPING LIST",
    category: ["UTILITY", "LIST", "SHOPPING"],
    message: "Take a picture and create a pictured shopping list identifying the main subject and all notable objects. Do not display a single full reference photo. Instead, separate each identified item and create a small cropped image or thumbnail of each subject or object. Present a numbered shopping list where each number is paired with its corresponding small image and a short description. Keep the layout clean and optimized for a small screen, with each item visually distinct and easy to scan."
  },
  {
    name: "SHOULDNT HAVE DONE THAT",
    category: ["HUMOR", "MISTAKE", "REGRET"],
    message: "Take a picture and subtly make it look like the subject is doing something they absolutely should not be doing. The humor should come from obvious poor judgment."
  },
  {
    name: "SILHOUETTE",
    category: ["ART", "SILHOUETTE", "MINIMAL"],
    message: "Take a picture and convert the subject into a solid black silhouette. Subject interior filled with the background image. Outer background pure white."
  },
  {
    name: "SIMPSONS",
    category: ["ANIMATION", "CARTOON", "TV"],
    message: "Take a picture in the style of a Simpsons cartoon scene, with yellow skin tones and Springfield vibes.  Complete with cartoon proportions and bright palettes. Preserve facial identity."
  },
  {
    name: "SIN CITY",
    category: ["CINEMATIC", "NOIR", "COMIC", "DRAMATIC", "MOVIES"],
    message: "Take a picture and transform it into a Sin City–inspired graphic novel scene.\n\nRender the image almost entirely in stark black and white with extreme contrast. Use deep, inky blacks and bright whites with very little midtone gray. Lighting should feel harsh, directional, and dramatic, emphasizing silhouettes, shadows, and negative space.\n\nAllow only one or two selective color accents at most (such as red lips, blood-red elements, a glowing cigarette ember, or neon signage). All other elements must remain strictly monochrome.\n\nConvert the subject into a stylized, high-contrast noir figure with sharp edges, heavy shadowing, and simplified facial features. Preserve recognizability through bold shapes and expression rather than realism.\n\nThe environment should feel urban and gritty — rain-soaked streets, fire escapes, alleyways, venetian-blind shadows, brick walls, or smoky interiors. Backgrounds may fade into black to heighten drama.\n\nThe final image should resemble a single panel from a dark neo-noir graphic novel. Avoid soft gradients, painterly textures, or photographic realism. The result must feel illustrated, cinematic, and unmistakably Sin City in tone, clearly readable on a small screen."
  },
  {
    name: "SKETCH ART",
    category: ["ART", "SKETCH", "COLORFUL"],
    message: "Take a picture in the style of colorful Sketch Art. A rapidly executed, freehand drawing that serves as a preliminary step for a more detailed, finished work."
  },
  {
    name: "SLIMED",
    category: ["HUMOR", "ACTION", "MESSY"],
    message: "Take a picture of the subject and capture the moment they are being hit on the head by bright green slime.\n\nThe slime should be mid-impact or just beginning to cover their hair and face.\n\nThe subject should have a shocked or panicked expression as the slime lands.\n\nThe slime should look thick, glossy, and cartoonishly gooey.\n\nThe final image should freeze the exact moment of impact for maximum comedy."
  },
  {
    name: "SMURFED!",
    category: ["CARTOON", "TRANSFORM", "HUMOR"],
    message: "Take a picture and transform the subject into a Smurf character. Bright blue skin covering entire body, small stature (three apples high), distinctive white Phrygian cap, white pants, no shoes. Large expressive eyes, button nose, cheerful smile. Subject's recognizable facial features should be adapted to Smurf proportions. Place in magical Smurf Village setting with mushroom houses, forest environment, whimsical fairy-tale atmosphere. Classic Peyo cartoon style with smooth shading and vibrant colors. Friendly, cheerful, and enchanting storybook illustration quality."
  },
  {
    name: "SNOW GLOBE",
    category: ["TOY", "MINIATURE", "WINTER", "SOUVENIR"],
    message: "Take a picture and encapsulate the subject and scene inside a physical souvenir snow globe.\n\nMiniaturize the subject and place them within a tiny, detailed environment inside the globe. If a city or location is provided via external master prompt, construct a miniature city scene inside the globe featuring simplified landmarks, buildings, or visual cues associated with that place. If no location is provided, create a generic charming miniature environment.\n\nThe subject should appear as a small figurine integrated into the miniature city scene — not floating, not full-sized, and not dominating the globe.\n\nRender a clear glass sphere with realistic reflections, refraction, highlights, and slight distortion caused by the curved glass. Floating snow particles or glitter should be suspended throughout the globe at varying depths.\n\nInclude a visible snow globe base made of plastic or resin, styled like a tourist souvenir. The base should include a decorative plaque or label showing the city or location name (use external master prompt text if provided; otherwise invent a plausible destination name).\n\nEnsure the entire snow globe — glass sphere and base — is fully visible within the frame. The globe should appear photographed on a surface or held in a hand, not floating in space.\n\nThe final image should feel charming, slightly kitschy, nostalgic, and unmistakably like a real souvenir snow globe, clearly readable on a small screen."
  },
  {
    name: "SOAKED",
    category: ["HUMOR", "REALISM", "WATER"],
    message: "Take a picture of the subject and make it look like they have just been completely drenched with water.\n\nHair, clothing, and skin should all appear visibly wet, with dripping water and darkened fabric.\n\nThe subject should look surprised, annoyed, or exhausted from being soaked.\n\nWater droplets, puddles, or splashes should be visible to sell the realism.\n\nThe final image should look like it was captured seconds after a big splash or water dump."
  },
  {
    name: "SOLARPUNK",
    category: ["SCI FI", "NATURE", "UTOPIAN"],
    message: "Take a picture and transform the scene into a solarpunk future. Green architecture, renewable energy, optimistic tone."
  },
  {
    name: "SOUL-VANA",
    category: ["HUMOR", "SATIRE", "URBAN", "ABSURD"],
    message: "Take a picture and transform the scene into a massive human-dispensing tower inspired by car vending machines.\n\nReplace cars with people. The tower should be a tall, cylindrical or rectangular glass structure filled with individual human-sized compartments, each containing a different person posed stiffly like a display item. The subject must appear inside one of the compartments, clearly visible, as if they are waiting to be dispensed.\n\nRender the humans as intact, clothed, and calm — no distress, no danger, no violence. The tone should be surreal and comedic, not dark. Humans should feel more like oversized gumballs or capsule toys than trapped people.\n\nInclude clear visual cues that this is a vending-style system:\n• a large mechanical claw, elevator platform, or rotating carousel mechanism\n• numbered slots or bays\n• soft interior lighting inside each compartment\n• reflections and glass glare to sell realism\n\nAdd bold branding on the tower reading “SOUL-VANA” in large, modern lettering. Optional smaller flavor text may include humorous corporate slogans such as:\n• “Dispensing Personalities Since Today”\n• “Find Your Next You”\n• “Low Mileage Humans Available Now”\n\nIf external master prompt text is provided, use it to customize:\n• the city or location of the tower\n• slogans, labels, or marketing copy\n• which slot the subject occupies\n\nThe environment should resemble an urban plaza or parking structure, with scale clearly communicated by surrounding buildings or people. Ensure the entire tower and the subject’s compartment are fully visible within the frame.\n\nThe final image should feel like a glossy promotional photo for an absurd tech startup — clean, corporate, ridiculous, and immediately readable on a small screen."
  },
  {
    name: "SOUTH PARK",
    category: ["ANIMATION", "CARTOON", "TV"],   
    message: "Take a picture in the style of a South Park cartoon scene with flat colors and exaggerated expressions.  Blocky limbs, simple shapes, and expressive faces."
  },
  {
    name: "SOUVENIR GONE WRONG",
    category: ["HUMOR", "TOURIST", "TRAVEL"],
    message: "Take a picture and frame the subject like a classic tourist souvenir photo in front of a famous landmark. The subject should be posing confidently as if capturing a perfect travel photo, while unexpected chaos, absurd events, or humorous interruptions happen in the background (for example: animals photobombing, sudden weather, confused crowds, or strange events). Keep the subject calm and unaware while the background tells a funny or surprising story."
  },
  {
    name: "SPACE",
    category: ["SPACE", "ASTRONAUT", "SCI FI"],
    message: "Take a picture and place the subject in a space station wearing a space suit. The Earth is visible in the background. Make it photorealistic."
  },
  {
    name: "SPANISH BAROQUE",
    category: ["ART", "PAINTING", "SPANISH", "CLASSIC"],
    message: "Take a picture and transform the image into a painting in the style of Diego Velázquez or similar Spanish Baroque painters. Use realistic lighting, subtle color palettes, and detailed textures. Capture the subject naturally, with dramatic depth and elegant composition reminiscent of 17th-century Spanish portraiture. Imbue the image with profound religious fervor, stark realism, and dramatic use of tenebrism to evoke strong emotions and piety."
  },
  {
    name: "SPIELBERG FILM",
    category: ["HUMOR", "MOVIE", "SCENE", "ADVENTURE"],
    message: "Take a picture of the subject and place them into a famous Spielberg movie scene, such as *E.T.*, *Jaws*, *Saving Private Ryan*, *Schindler's List*, *The Goonies*, *Jurassic Park*, or *Indiana Jones*.\n\nThe subject should appear as the central figure, interacting with the iconic environment or objects — holding the glowing finger in E.T., facing a dinosaur, or pulling a dramatic stunt in Indiana Jones style.\n\nLighting, perspective, and props should match the original film, making it cinematic and realistic.\n\nOptional master prompt text can influence which film or scene is used, or add a humorous twist (e.g., subject holding the alien wrong, tripping over a dinosaur, or wearing a ridiculous explorer hat).\n\nThe final image should feel like a real movie still starring the subject, instantly recognizable as Spielberg-style adventure, with humor or absurdity added."
  },
  {
    name: "SPOT THE DIFFERENCE",
    category: ["PUZZLE", "GAME", "ACTIVITY"],
    message: "Take a picture and duplicate it into two side-by-side frames showing the same scene. Keep the left frame as the original reference image.\n\nEnsure the subject and all objects remain **exactly in the same position and fully visible** in both frames unless an object is intentionally removed. The subject should not be tilted or cropped out of frame; the entire area should be consistently in view on both sides.\n\nIn the right frame, introduce **5–7 subtle but clearly noticeable differences** in objects, colors, accessories, or minor details, such as:\n• Removing or adding small objects\n• Altering colors of items or clothing\n• Slightly repositioning accessories or props (without moving the subject)\n• Changing minor details of clothing, eyes, haircolor, hairstyle, or props\n• Adjusting the size of small items or background elements\n\nDo not add labels, arrows, or text. The two images should be aligned, evenly sized, and easy to compare on a small screen. The final result should resemble a classic children’s \"find the differences\" puzzle, with differences discoverable but the overall scene consistent and fully framed."
  },
  {
    name: "STADIUM CROWD SIGN",
    category: ["HUMOR","MASTER PROMPT", "SPORTS", "PHOTO EFFECT"],
    message: "Take a picture and place the subject inside a live sports stadium crowd. The subject should blend naturally into the audience, wearing a team jersey and appearing as one of many fans.\n\nThe subject must be holding a handmade or printed sign with a funny message inspired by flavor text or externally appended language. The sign should be readable but not oversized, matching real fan-made stadium signs.\n\nCompose the scene so the subject is not immediately obvious at first glance. The viewer should discover the subject by scanning the crowd. Use realistic stadium lighting, depth, motion blur, and crowd density.\n\nEnsure the subject, sign, and surrounding fans feel cohesive and photoreal. The final image should feel like a real moment captured during a live sporting event."
  },
  {
    name: "STAINED GLASS",
    category: ["ART", "GLASS", "CHURCH"],
    message: "Take a picture and transform the image into a stained-glass artwork. Bold lead outlines, translucent color panels. Light glowing through the glass."
  },
  {
    name: "STANDING NEXT TO",
    category: ["HUMOR", "CELEBRITY", "MASTER PROMPT", "MASHUP"],
    message: "Take a picture and add a FAMOUS PERSON standing next to the subject. Match lighting and scale realistically."
  },
  {
    name: "STAND-UP COMEDIAN",
    category: ["HUMOR", "PERFORMANCE", "STAGE", "POP CULTURE"],
    message: "Take a picture and transform the subject into a stand-up comedian performing live on stage.\n\nPlace the subject on a comedy club stage with a microphone stand, spotlight lighting, and a classic stand-up backdrop such as a brick wall or dark curtain. The subject should appear mid-performance, holding or standing near the microphone, with posture and expression adapted from the subject’s real demeanor (confident, awkward, smug, confused, etc.).\n\nDress the subject in classic stand-up attire appropriate to a comedy club — casual jacket, button-down, t-shirt, or minimalist stage outfit — adapted naturally from the subject’s original clothing when possible.\n\nInclude ONE clearly readable on-screen joke caption, presented as part of the performance (subtitle, lower-third, or stage sign). The joke should be EITHER:\n\n• a REAL, VERBATIM one-liner (under 90 characters) from a famous one-liner comedian, OR\n• an ORIGINAL one-liner written in the STYLE of those comedians\n\nWhen using a verbatim joke, randomly select from the comedic voices of:\n• Stephen Wright\n• Rodney Dangerfield\n• Mitch Hedberg\n• Norm Macdonald\n• Anthony Jeselnik\n• Jimmy Carr\n• Henny Youngman\n\nVerbatim jokes must be short, classic one-liners only (no long bits, no monologues), and must remain under 90 characters.\n\nOptionally include subtle comedy-club details such as:\n• a fake venue name or special title inspired by the subject\n• a small audience silhouette or dimly lit crowd\n• a mock comedy special title using flavor text (e.g., “Live From Poor Decisions”)\n\nEnsure the full stage scene, subject, and joke text are fully visible and readable on a small screen. The final image should feel like a paused frame from a real comedy set — uncomfortable, confident, funny, and unmistakably stand-up."
  },
  {
    name: "STAR TREK",
    category: ["TV", "SCI FI", "SPACE", "STAR TREK"],
    message: "Take a picture and place the subject on the bridge of the Starship Enterprise dressed in a Star Trek uniform. Make it photorealistic."
  },
  {
    name: "STAR WARS",
    category: ["MOVIES", "SCI FI", "SPACE", "STAR WARS"],
    message: "Take a picture and place the subject in a scene from the movie Start Wars.  Subject is dressed like a character in the movie. Make it photorealistic. Sci-fi realism."
  },
  {
    name: "STATUE",
    category: ["SCULPTURE", "BRONZE", "MONUMENT"],
    message: "Take a picture and make subject into a bronze statue. Aged patina, sculptural realism."
  },
  {
    name: "STENCIL",
    category: ["ART", "GRAFFITI", "STREET"],
    message: "Take a picture in the style of Stencil Art. High contrast, limited color palette."
  },
  {
    name: "STEREOSCOPE",
    category: ["PHOTOGRAPHY", "3D", "VINTAGE"],
    message: "Take a picture and create a stereoscopic 3D side-by-side image from the photo. Maintain alignment and scale between left and right views. Subtle parallax for depth without distortion."
  },
  {
    name: "STORY MOMENT",
    category: ["NARRATIVE", "DRAMATIC", "CINEMATIC"],
    message: "Take a picture and transform the image into a single dramatic story moment. Imply what happened before and what will happen next through visual clues. Cinematic composition."
  },
  {
    name: "STREET ART",
    category: ["ART", "GRAFFITI", "URBAN"],
    message: "Take a picture and transform the image into contemporary street art. Gritty textures, stenciled patterns, expressive composition, and urban color palette on a concrete or brick surface."
  },
  {
    name: "STRETCH ARMSTRONG",
    category: ["TOY", "RETRO", "STRETCHED"],
    message: "Take a picture and transform the subject into a Stretch Armstrong–style action figure made of thick, rubbery material. Preserve the subject’s recognizable facial features while adapting them into a toy-like appearance with smooth skin, simplified details, and a slightly exaggerated jaw and expression.\n\nDepict the subject’s arms, legs, or torso being stretched far beyond normal proportions, as if pulled by unseen hands or tension just outside the frame. The stretched areas should look elastic and dense, with believable thickness, subtle surface creases, and realistic stretch deformation rather than thin distortion.\n\nEnsure the subject still resembles a physical toy: solid core, rounded forms, and consistent material texture. Use lighting and shadows that emphasize volume and rubbery sheen. Do not show injuries or damage. The final image should feel playful, nostalgic, and clearly readable on small screens."
  },
  {
    name: "STUDENT ID",
    category: ["HUMOR", "ID", "MASTER PROMPT", "SCHOOL"],
    message: "Take a picture and create a realistic but clearly fictional student identification card featuring the subject’s photo. Style the photo to resemble a typical campus ID picture, with slightly awkward framing, flat lighting, mild motion blur or softness, and an unpolished snapshot quality rather than a flattering portrait. Design the ID to resemble the general style of a school or university commonly found near the subject’s location, using a fictional institution name inspired by regional themes. Include placeholder text, sample ID numbers, and decorative elements only. Preserve the subject’s recognizable facial features and neutral or mildly awkward expression. The final image should appear as a novelty or prop-style student ID, clearly non-functional and created for artistic purposes."
  },
  {
    name: "SUBWAY AD",
    category: ["HUMOR", "ADVERTISEMENT", "SCENE"],
    message: "Take a picture of the subject and place them inside a subway car covered in a large, awkward public advertisement featuring them.\n\nThe ad should imply the subject has a mildly embarrassing but non-explicit problem such as bad breath, flatulence, excessive sweating, or bladder leaks.\n\nChoose one of these situations at random and build the ad around it:\n• Bad breath → a real mint or mouthwash product\n• Flatulence → a real digestive aid or deodorizing spray\n• Heavy sweating → a real strong deodorant\n• Bladder leaks → real protective undergarments\n\nThe ad should show the subject’s face with a big headline and product branding, making it look like they are the unfortunate model for the problem.\n\nPeople around the subject in the subway should be reacting awkwardly, staring, or trying not to laugh.\n\nThe final image should look like a real transit advertisement gone terribly wrong, with bold text, clean design, and very public embarrassment."
  },
  {
    name: "SUPERHERO",
    category: ["COMICS", "SUPERHERO", "ACTION"],
    message: "Take a picture and transform the subject into a superhero from the DC or Marvel universe, preserving recognizable facial features and characteristics. Depict the subject performing an act of heroism or saving the day in a dramatic action scene, such as stopping a runaway train, rescuing civilians, or confronting a villain. Include dynamic superhero attire inspired by the subject’s clothing, colors, and traits, with capes, emblems, and iconic superhero elements. Use cinematic lighting, dramatic angles, and dynamic motion for a visually striking composition."
  },
  {
    name: "SURREAL LANDSCAPE",
    category: ["ART", "SURREAL", "LANDSCAPE"],
    message: "Take a picture and transform into a surreal landscape featuring a dreamlike quality pushing the boundaries of reality. Conjure a scene that has imaginative and otherworldly elements."
  },
  {
    name: "SURREALISM",
    category: ["ART", "SURREAL", "DREAMLIKE"],
    message: "Take a picture in the style of Surrealist art. Include dreamlike imagery, illogical juxtapositions, automatism, vivid dream imagery, symbolism, and a sense of absurdity."
  },
  {
    name: "TABLOID",
    category: ["NEWS", "SENSATIONAL", "SCANDAL"],
    message: "Take a picture in the style of a Newspaper tabloid. The tabloid is the National Equirer. Headline: \"SCANDAL!!!\"."
  },
  {
    name: "TAPESTRY",
    category: ["ART", "TEXTILE", "MEDIEVAL"],
    message: "Take a picture and convert the image into a woven tapestry. Textile texture, medieval storytelling style."
  },
  {
    name: "TAROT CARD",
    category: ["MYSTICAL", "CARD", "FORTUNE"],
    message: "Take a picture and transform the subject into a detailed tarot card illustration. Depict the subject as the central figure, preserving recognizable facial features and posture while adapting them into a stylized, symbolic art style inspired by traditional tarot imagery. Surround the subject with meaningful symbols, patterns, and motifs drawn from the subject’s appearance and surroundings. Include a decorative border and a card title at the top or bottom. Ensure the composition resembles a complete tarot card, with balanced layout, rich illustration detail, and a timeless, mystical aesthetic. The result should be a full view of the card with a relevant background behind the card."
  },
  {
    name: "TEXT LOGO",
    category: ["DESIGN", "UTILITY", "LOGO", "TYPOGRAPHY"],
    message: "Take a picture and generate a minimal logo derived purely from text, such as initials, monograms, or typographic lettermarks. This mode affects header branding only.\n\nDo not introduce pictorial icons, illustrations, or decorative graphics. The logo should be subtle, professional, and typography-driven, integrating naturally into the existing header without altering layout hierarchy.\n\nIf other document or legal modes are active, ensure the logo remains understated and does not compete with formal structure."
  },
  {
    name: "THERMAL",
    category: ["PHOTOGRAPHY", "THERMAL", "HEAT"],
    message: "Take a picture and transform the image into thermal imaging. False-color heat mapping. High contrast."
  },
  {
    name: "TIBETAN THANGKA",
    category: ["ART", "RELIGIOUS", "ASIAN"],
    message: "Take a picture and transform the image into Tibetan Thangka style painting. Highly detailed line work, symbolic composition, rich colors, and spiritual iconography."
  },
  {
    name: "TILT-SHIFT",
    category: ["PHOTOGRAPHY", "MINIATURE", "BLUR"],
    message: "Take a picture and Apply tilt-shift photography effect. Selective focus creating a miniature diorama look. Blurred foreground and background."
  },
  {
    name: "TIM BURTON MOVIE",
    category: ["MOVIES", "FANTASY", "GOTHIC", "DIRECTOR", "WHIMSICAL"],
    message: "Take a picture and transform the subject into a character within a Tim Burton film universe, randomly selecting from one of his classic movies: Edward Scissorhands, The Nightmare Before Christmas, Batman, Frankenweenie, Beetlejuice, Big Eyes, Mars Attacks!, Corpse Bride, or similar Burton films.\n\nTransform the subject to match Tim Burton's signature visual style: pale skin with dark shadows under eyes, exaggerated features, elongated proportions, wild unkempt hair (often black with dramatic styling), dramatic makeup with dark eyes, gothic or quirky costume design with striped patterns, mismatched fabrics, Victorian-inspired clothing, or unusual color combinations (black, white, purple, deep reds).\n\nPlace the subject within an iconic scene from the chosen film with other characters from that movie present. The environment should capture Burton's distinctive aesthetic: twisted architecture, spiraling designs, forced perspective, gothic elements mixed with whimsy, stark contrast between light and shadow, surreal proportions, and his signature color palette.\n\nThe subject should be styled as if they belong in that specific Burton film - whether as a suburban character with pastel gothic twist, a stop-motion animated figure, a striped-suit wearing ghost, a gothic creature, or Victorian-era character depending on which film is selected. Preserve recognizable features while adapting them to Burton's exaggerated, slightly macabre artistic vision.\n\nLighting should be dramatic with strong contrasts - deep shadows, pools of light, moonlit scenes, or that distinctive Burton glow. The atmosphere should feel both whimsical and slightly dark, fantastical yet melancholic.\n\nThe final image should look like an actual still from a Tim Burton film - gothic, whimsical, visually striking, with exaggerated proportions and that unmistakable Burton aesthetic. The subject should be seamlessly integrated into the film's world alongside other iconic characters from that movie."
  },
  {
    name: "TIME DILATION",
    category: ["SCI FI", "TIME", "MOTION"],
    message: "Take a picture and depict the image as if time is slowed or fractured. Motion echoes, temporal distortions."
  },
  {
    name: "TIME MAGAZINE",
    category: ["NEWS", "MAGAZINE", "COVER"],
    message: "Take a picture in the style of a polished TIME magazine cover. Title: \"PERSON OF THE YEAR\"."
  },
  {
    name: "TINY SELVES",
    category: ["ILLUSION", "MOSAIC", "RECURSIVE"],
    message: "Take a picture and transform the subject so that their entire face and body are composed exclusively from hundreds of tiny, complete versions of the subject. There must be NO underlying full-size face, skin, or body visible anywhere. Every facial feature (eyes, nose, mouth), contour, and body shape must be formed only by the placement, density, and orientation of the tiny figures. The tiny versions should act like living building blocks, posed and arranged to define edges, shading, and structure. From a distance, the subject must read clearly as a complete human figure; up close, the image must resolve entirely into individual miniature subjects. Use consistent lighting and perspective so the construction feels intentional, surreal, and visually mind-bending. Do not partially fill, overlay, or decorate a normal body — the tiny figures ARE the body."
  },
  {
    name: "TINY WORLD",
    category: ["MINIATURE", "TILT SHIFT", "SMALL"],
    message: "Take a picture and transform the scene so the subject appears miniature. Environment becomes massive. Tilt-shift realism."
  },
  {
    name: "TONIGHT SHOW INTERVIEW",
    category: ["TV", "TALK SHOW", "CELEBRITY"],
    message: "Take a picture and place the subject on the late-night talk show set of The Tonight Show. Preserve the subject’s facial features, personality, and clothing while adapting them naturally to the environment. Include the iconic desk, host chair, stage lighting, and background elements such as cityscape backdrops. Show the subject interacting with the host, engaging in conversation, or reacting to jokes. Ensure the scene captures the lively, polished, and humorous atmosphere of the late-night talk show while keeping the subject clearly identifiable."
  },
  {
    name: "TOPIARY",
    category: ["NATURE", "SCULPTURE", "GARDEN"],
    message: "Take a picture and transform the subject into a living topiary sculpture. Preserve the subject’s recognizable facial structure, hairstyle silhouette, body proportions, and clothing shapes translated into carefully trimmed foliage and greenery. Use dense leaves, hedges, vines, and floral textures shaped with precision pruning. The subject must appear grown organically from plants, not carved stone. Natural outdoor lighting, garden environment, and botanical realism with visible leaf detail and depth."
  },
  {
    name: "TOUPEE",
    category: ["HUMOR", "PORTRAIT", "COSTUME"],
    message: "Take a picture of the subject, human or animal, and give them a very obvious, poorly fitting toupee.\n\nThe hairpiece should look fake, crooked, or slightly mismatched in color and style, making it clear it does not belong.\n\nThe subject’s original hair or fur may still be partially visible around the edges of the toupee.\n\nThe goal is for the toupee to look awkward and humorous, like it is about to fall off.\n\nThe final image should look realistic but absurd, with the bad hairpiece being the center of the joke."
  },
  {
    name: "TRADING CARD",
    category: ["SPORTS", "MASTER PROMPT", "CARD", "COLLECTIBLE"],
    message: "Take a picture and transform the subject into a fully visible collectible sports trading card with a vintage 1980s/1990s style. Ensure the entire card—including all borders, portrait, background, stats, and flavor text—is fully visible and centered in the frame. Randomly assign a sport (e.g., basketball, soccer, baseball, football, tennis) for each render.\n\nInclude a clear portrait of the subject, a stylized action background, and a card border with realistic texture, embossing, and glossy surfaces. Apply worn effects such as yellowed edges, scratches, and slight discoloration for a vintage look.\n\nAdd the subject’s name, a mock team name or mascot, absurd over-the-top stats inspired by the subject’s appearance, pose, or personality (e.g., “99% chance to eat pizza mid-game,” “Can balance a coffee cup while dribbling”), and humorous flavor text describing the subject. Allow external master prompt text to be appended to the flavor text.\n\nEnsure everything is legible on a small screen, the subject remains instantly recognizable, and the final image clearly shows the full card without cropping."
  },
  {
    name: "TV DRAMA",
    category: ["TV", "DRAMA", "CINEMATIC", "MASTER PROMPT"],
    message: "Take a picture and place the subject into a famous dramatic television series scene. Preserve the subject’s facial features, expressions, and clothing while adapting them to the television drama style. Include cinematic lighting, moody atmosphere, and emotionally charged interactions with other characters or surroundings. The composition should convey tension, suspense, or deep narrative context, fully integrating the subject into the dramatic storyline of the show."
  },
  {
    name: "TV GAME SHOW",
    category: ["TV", "GAME SHOW", "ENTERTAINMENT", "MASTER PROMPT"],
    message: "Take a picture and place the subject into a famous television game show set. Preserve the subject’s facial features, personality, and clothing while transforming them into a contestant or host in the game show style. Include colorful set design, bright stage lighting, game props, podiums, or audience elements. Convey excitement, engagement, and fun, fully integrating the subject into the lively, competitive environment of the television show."
  },
  {
    name: "TV SITCOM",
    category: ["TV", "SITCOM", "COMEDY", "MASTER PROMPT"],
    message: "Take a picture and place the subject into a famous television sitcom scene. Preserve the subject’s facial features, personality, and clothing while adapting them to the sitcom style. Include bright, cheerful lighting, a recognizable multi-camera set or typical sitcom living room, and humorous interactions with other characters or props. Ensure the scene conveys comedic timing, lightheartedness, and laugh-track energy, fully integrating the subject into the television comedy environment." 
  },
  {
    name: "TYPICAL TOURIST",
    category: ["TOURIST", "TRAVEL", "FORCED PERSPECTIVE"],
    message: "Take a picture and place the subject in front of a randomly selected famous world landmark using classic forced-perspective tourist photography. The subject is intentionally interacting with the landmark through optical illusion—such as pinching it between their fingers, holding it up, pushing it, leaning against it, or framing it with their hands—while maintaining realistic scale and perspective from the camera’s point of view. Preserve the subject’s recognizable facial features, proportions, and identity. Carefully match camera angle, focal length, lighting direction, shadows, depth of field, and atmospheric perspective so the illusion feels natural and intentional rather than composited. The subject’s pose, hand placement, and eye line must align perfectly with the landmark to sell the visual trick. Capture the moment as if snapped at the exact perfect second. Render the final image with photorealistic travel-photo realism, playful humor, and precise forced-perspective accuracy."
  },
  {
    name: "UK POSTER ART 1930s",
    category: ["ART", "VINTAGE", "POSTER", "30S"],
    message: "Take a picture and transform the image into a 1930s British travel poster style art. Simplified shapes, bold typography, stylized landscapes, and clean graphic composition."
  },
  {
    name: "UNDER THE SEA",
    category: ["UNDERWATER", "OCEAN", "NATURE"],
    message: "Take a picture and place the subject underwater in a natural ocean environment. The subject is wearing streamlined, sport-style swimwear suitable for ocean swimming, styled realistically for an underwater setting. Create a photorealistic underwater seascape capturing the beauty of the ocean depths. Include coral reefs, exotic fish, and aquatic plants, with sunlight filtering through the water to create dramatic lighting and rich color variation. Emphasize realism, scale, and natural movement in the water."
  },
  {
    name: "UNKEMPT",
    category: ["HUMOR", "GROOMING", "EXAGGERATED"],
    message: "Take a picture and transform the subject into someone who desperately needs grooming, with exaggerated overgrown hair in unfortunate places.\n\nAdd extremely bushy, thick, unruly eyebrows that are wild and untamed - possibly connected in the middle (unibrow), with hairs going in all directions.\n\nShow visible nose hairs protruding noticeably from the nostrils - long enough to be clearly visible and unkempt.\n\nAdd ear hair visibly growing out from the ear openings - bushy tufts that are clearly overgrown and neglected.\n\nThe subject's facial hair (if applicable) should also be scraggly, patchy, or unkempt. Overall hair should look messy and in need of a cut.\n\nThe subject's expression can be neutral, unaware, or even proud - making the lack of grooming more humorous. Alternatively, they could look disheveled and tired.\n\nKeep the image photorealistic so the grooming issues look like an actual photograph of someone who has seriously neglected personal maintenance. The exaggeration should be humorous but believable.\n\nPreserve the subject's recognizable facial structure and features while adding these exaggerated grooming problems."
  },
  {
    name: "VACATION",
    category: ["TRAVEL", "MASTER PROMPT", "TOURIST", "LOCATION"],
    message: "Take a picture and have the subject standing in the middle of a CITY street somewhere in the world, with iconic and easily recognizable landmarks from that CITY in the background. The scene should capture the CITY life, detailed architecture, and natural lighting, with the person dressed in modern casual clothing, blending naturally into the environment. Make it photorealistic. 8k resolution."
  },
  {
    name: "VALENTINE",
    category: ["ROMANCE", "VALENTINE", "HEART"],
    message: "Take a picture and frame the subject inside a visually prominent heart shape. Create a romantic Valentine’s Day–themed scene with warm colors, soft lighting, and gentle decorative elements. Extract subtle flavor text and inspiration from the subject’s appearance, expression, clothing, and surroundings to generate a heartfelt Valentine’s Day poem. Display the complete poem clearly and fully within the image, ensuring all lines are legible and unobstructed. Integrate the poem naturally into the composition, such as on a decorative card, ribbon, or elegant text panel, while keeping the subject as the central focus. Render the final image with polished, high-quality detail."
  },
  {
    name: "VAMPIRE",
    category: ["HORROR", "VAMPIRE", "GOTHIC"],
    message: "Take a picture and transform the subject into a realistic vampire while preserving the subject’s recognizable facial structure, body proportions, and identity. Subtly enhance features with pale, luminous skin, sharp yet refined fangs, intense eyes, and an elegant, supernatural presence. Adapt the subject’s clothing to a dark, timeless vampire aesthetic while maintaining their original style and personality. Place the subject naturally into a moody, atmospheric environment such as a gothic interior, moonlit street, or candlelit chamber. Use cinematic lighting, deep shadows, and rich textures to create a seductive, mysterious tone. Ensure the subject appears fully integrated into the scene and render the final image in photorealistic detail with depth, realism, and supernatural elegance."
  },
  {
    name: "VAN GOGH",
    category: ["ART", "PAINTING", "ARTIST", "IMPRESSIONISM"],
    message: "Take a picture and transform it into a painted scene inspired by Vincent van Gogh. Preserve the photographic composition but reinterpret it using bold, swirling brushstrokes, thick paint texture, and expressive movement. Use vivid blues, yellows, and greens with visible directional strokes. The subject should remain clearly recognizable while the surrounding scene feels alive with motion and emotion."
  },
  {
    name: "VAPORWAVE",
    category: ["ART", "RETRO", "90S", "AESTHETIC"],
    message: "Take a picture and style it as if it were a retro-futuristic vaporwave album cover. Dreamy neon colors, glitchy textures, and retro-futuristic vibes. Inspired by 90s aesthetics and early internet culture, giving the photo a surreal, nostalgic feel, like a lost scene from an old VHS tape or a synthwave album cover."
  },
  {
    name: "VEGAS NEON SIGN",
    category: ["NEON", "CASINO", "VEGAS", "SIGNAGE", "ADVERTISING"],
    message: "Take a picture and transform the subject into a large, spectacular neon sign mounted on the side of a Las Vegas casino building.\n\nThe subject's image should be converted into glowing neon tubing and illuminated sign elements. Their facial features, silhouette, and recognizable characteristics should be rendered using bright neon tubes in classic Vegas colors - hot pink, electric blue, bright red, golden yellow, vibrant purple, lime green.\n\nSign construction details: The neon should have realistic glass tube appearance with visible glowing gas, support brackets and framework visible, bulb marquee borders surrounding the main image, animated chasing lights or blinking elements, possibly text above or below saying the subject's name in classic Vegas marquee lettering.\n\nMount the sign prominently on the side of an authentic Las Vegas casino building - art deco or mid-century modern architecture, visible in evening or night setting. Include surrounding Vegas context: other neon signs visible in background, palm trees, busy street below with car light trails, other casinos in distance.\n\nLighting and atmosphere: The scene should be photographed at dusk or night when neon is most vibrant. The sign should be the brightest element, casting colorful glow on the building facade. Include atmospheric haze or slight blur to enhance the neon glow effect. Light from the sign should reflect on surrounding surfaces.\n\nScale: The sign should be LARGE - multiple stories tall on the casino building, dominating the facade, visible from far away. The subject's neon portrait should be the centerpiece of an elaborate sign display.\n\nThe final image should look like an actual photograph of a real Las Vegas casino with this spectacular custom neon sign installation, capturing the over-the-top glitz, glamour, and bright electric energy of classic Vegas signage. Photorealistic rendering with authentic neon glow, proper scale, and vintage Vegas atmosphere."
  },
  {
    name: "VENDING MACHINE ITEM R1",
    category: ["HUMOR", "VENDING", "PACKAGED", "MASTER PROMPT"],
    message: "Take a picture and transform the subject into a novelty vending machine product. The subject should appear as a toy, figurine, or packaged novelty item clearly designed to be sold.\n\nPlace the product inside a vending machine slot behind glass. Show spiral coils, price tags without readable text, glass reflections, and interior vending machine lighting. The subject should appear scaled appropriately to fit the slot as a product, not as a real person.\n\nEnsure the scene reads as playful and humorous, like a novelty item for sale, with the vending machine fully visible and the product clearly displayed inside."
  },
  {
    name: "VENTRILOQUIST DUMMY",
    category: ["HUMOR", "PORTRAIT", "PUPPET"],
    message: "Take a picture of the subject and transform them into a classic ventriloquist dummy.\n\nThe subject should look like a wooden puppet version of themselves, with a glossy painted face, carved features, and a hinged jaw line.\n\nGive them slightly exaggerated eyes, a stiff posture, and a stylized puppet outfit such as a suit, bow tie, or dress.\n\nThe wood texture, joint seams, and mouth hinge should be clearly visible so it unmistakably looks like a ventriloquist dummy.\n\nThe final image should look like a lifelike puppet replica of the subject, humorous, eerie, and unmistakably artificial."
  },
  {
    name: "VHS 80s",
    category: ["RETRO", "80S", "VHS", "VIDEO"],
    message: "Take a picture and transform the image into 1980s VHS footage. Soft focus, scanlines, color bleed, timestamp artifacts. Analog nostalgia aesthetic."
  },
  {
    name: "VICTORIA’S SECRET RUNWAY",
    category: ["HUMOR", "FASHION", "RUNWAY"],
    message: "Take a picture of the subject and transform them into a glamorous runway model in the style of a Victoria’s Secret fashion show.\n\nThe subject should be walking confidently down a fashion runway, wearing extravagant lingerie, wings, or over-the-top show outfits. Include dramatic lighting, photographers, flashing cameras, and a cheering audience.\n\nThe subject’s pose, facial expression, and stride should be exaggerated and confident, capturing the flair and drama of a live runway show.\n\nOptional flavor text from the master prompt can influence the outfit theme or style.\n\nThe final image should look like a high-fashion runway photo shoot — realistic lighting, shadows, and perspective — but humorous if desired by exaggerating poses, outfit size, or runway theatrics."
  },
  {
    name: "VICTORIAN ENGRAVING",
    category: ["ART", "VINTAGE", "ENGRAVING"],
    message: "Take a picture and transform the image into a Victorian engraving. Fine linework, cross-hatching, monochrome or sepia tones, and antique print texture."
  },
  {
    name: "VICTORIAN PHOTO",
    category: ["PHOTOGRAPHY", "VINTAGE", "VICTORIAN"],
    message: "Take a picture in the style of a Vintage photo of a Victorian family. Sepia tones, period attire."
  },
  {
    name: "VIDEO GAME AVATAR",
    category: ["GAMING", "CHARACTER", "AVATAR", "MASTER PROMPT"],
    message: "Take a picture and place the subject inside a popular video   game world (randomized across classic side-scrollers, platformers, fighting games, action-adventure, open-world RPGs, and modern AAA titles). Transform the subject into a fully playable in-game character while preserving recognizable facial features, body shape, clothing identity, and personality. Match the exact art style, rendering technique, camera perspective, UI scale, and lighting of the chosen game. The subject must look natively integrated into the game world—not composited—with correct proportions, animation-ready pose, and environmental interaction. Entire background, props, and effects must be authentic to the video game universe."
  },
  {
    name: "VINTAGE POSTER",
    category: ["ART", "VINTAGE", "POSTER", "MOVIES", "MASTER PROMPT"],
    message: "Take a picture in the style of a vintage movie poster. The poster uses lithography for printing on lightweight paper, and includes hand-painted illustrations. Add flavor text to the film title, director, and actor names inspired by the content of the image."
  },
  {
    name: "VIRTUOSO",
    category: ["HUMOR", "MUSIC", "DRAMATIC"],
    message: "Take a picture of the subject and transform them into a solo musical virtuoso performing on stage.\n\nThe subject should be playing a single instrument such as a piano, violin, cello, guitar, trumpet, or another orchestral instrument.\n\nBehind the subject, show a full orchestra performing along with them in a grand concert hall.\n\nSpotlight the subject as the star of the performance while the orchestra supports them.\n\nThe scene should look dramatic, cinematic, and impressive, like a world-class concert starring the subject."
  },
  {
    name: "VISUAL POETRY",
    category: ["ART", "POETRY", "METAPHOR"],
    message: "Take a picture and transform the image into visual poetry. Metaphor-driven imagery with emotional rhythm."
  },
  {
    name: "VULCAN TRANSFORMATION",
    category: ["SCI FI", "STAR TREK", "TRANSFORMATION", "ALIEN"],
    message: "Take a picture and transform the subject into a realistic Vulcan. Preserve the subject’s recognizable facial features, bone structure, body proportions, and personality while adapting them to authentic Vulcan traits including pointed ears, subtle brow structure, calm expression, and controlled posture. Maintain the subject’s clothing identity translated into Vulcan-appropriate garments or Starfleet attire with clean lines and logical design. Neutral, disciplined body language, precise lighting, and understated realism. The subject must appear fully Vulcan, not human with cosmetic alterations."
  },
  {
    name: "WALDO",
    category: ["PUZZLE", "HIDDEN", "GAME"],
    message: "Take a picture in the style of a Where’s Waldo illustration. The subject appears as Waldo with preserved traits, surrounded by many similar figures in a busy scene."
  },
  {
    name: "WANTED POSTER",
    category: ["WESTERN", "VINTAGE", "POSTER"],
    message: "Take a picture in the style of an Old West Wanted Poster. Aged parchment, bullet holes. Title: \"WANTED\"."
  },
  {
    name: "WARNER BROS CARTOON",
    category: ["ANIMATION", "CARTOON", "CLASSIC"],
    message: "Take a picture and transform the subject in the style of a classic Warner Bros. cartoon placed inside a classic Warner Bros. cartoon world inspired by mid-20th-century theatrical animation. Preserve the subject’s facial structure and recognizability while adapting lighting, color, outlines, and shading so the subject feels naturally integrated into a hand-painted cel-animation environment.\n\nThe scene should follow one of the following Warner Bros.–style formats:\n• A classic theatrical end-card inspired by the iconic \"That’s all folks!\" closing, where the subject’s face replaces the central character within concentric rings.\n• A classic cartoon scene where the subject appears alongside well-known Warner Bros. characters.\n\nUse bold black outlines, saturated colors, soft cel-style shading, exaggerated expressions, and simple painted backgrounds consistent with classic Warner Bros. cartoons. Ensure scale, eye-line, and pose interactions feel believable and playful. Keep the composition clear and readable on small screens.\n\nAllow externally provided instructions to specify the exact character(s), scene type, setting, or tone. If no external instructions are provided, automatically choose a fitting Warner Bros.–style scene."
  },
  {
    name: "WATERCOLOR",
    category: ["ART", "PAINTING", "WATERCOLOR"],
    message: "Take a picture in the style of a Watercolor painting. The pigments are mixed with water and applied to paper, creating luminous, transparent washes of color."
  },
  {
    name: "WEDDING CAKE TOPPER",
    category: ["WEDDING", "HUMOR"],
    message: "Take a picture and transform the subject(s) into the traditional two-figure wedding cake topper. If only one subject is provided, assign them to one of the two figures; if two subjects are provided, each becomes one of the figures.\n\nRender the figures as small, cheap plastic or resin figurines with smooth, slightly glossy surfaces and simplified, mass-produced detailing. The faces and features should retain recognizable aspects of the subjects but remain stylized and clearly toy-like. Clothing details (tuxedo, suit, wedding gown, veil, bouquet) should be painted on, not fabric.\n\nPlace the two figures securely on the top tier of a multi-layer wedding cake. Include realistic frosting textures, piped borders, subtle crumbs, and decorations such as flowers or fondant accents.\n\nPosition the toppers close together in the classic wedding pose, slightly off-center if needed to reflect a real hand-placed topper. The figures must clearly appear as part of the cake, not floating or separate.\n\nSet the scene on a wedding reception table with soft lighting, pastel or neutral tones, and subtle background elements like table linens, flowers, or candles.\n\nEnsure the entire top tier and both figurines are fully visible within the frame. Scale, shadows, and perspective must reinforce that the subject(s) are physical cheap plastic wedding cake toppers. The final image should feel charming, humorous, and recognizably a wedding cake topper scene."
  },
  {
    name: "WES ANDERSON",
    category: ["MOVIES", "CINEMATIC", "SYMMETRICAL"],
    message: "Take a picture and transform the image into a Wes Anderson-style scene. Perfect symmetry, centered composition. Pastel color palette, soft lighting. Whimsical, storybook tone."
  },
  {
    name: "WESTERN",
    category: ["WESTERN", "COWBOY", "VINTAGE"],
    message: "Take a picture and have the setting be an Old West town.  Make it photorealistic cowboy setting."
  },
  {
  name: "WHAT IF?",
  category: ["HUMOR", "HISTORY", "ALTERNATE", "SCENE"],
  message: "Take a picture of the subject and place them into a famous historical moment, as if they personally changed the course of history.\n\nThe subject should be the central figure in the scene, interacting directly with a major historical event such as signing an important document, making a dramatic discovery, stopping a disaster, leading a crowd, or inventing something world-changing.\n\nThe setting, clothing, and environment should match the historical era being shown, making the scene feel authentic and cinematic.\n\nUse external master prompt text, if provided, to suggest the historical moment or twist.\n\nThe tone should be playful and humorous, presenting the subject as an unexpected hero or key figure who altered history in a surprising way."
  },
  {
    name: "WHEATIES BOX",
    category: ["ADVERTISING", "HUMOR", "MASTER PROMPT"],
    message: "Take a picture and transform it into a complete, three-dimensional Wheaties cereal box. The entire box must be fully visible within the frame, including front face, edges, top flap, and box proportions.\n\nDesign the front panel in classic Wheaties style with a bold orange background. Feature the subject prominently as the heroic athlete printed on the box front. The subject must appear integrated into the printed packaging, not floating or cropped.\n\nAdd an absurd, over-the-top achievement based on the subject’s traits, posture, or environment. Display this achievement prominently like a headline.\n\nInclude exaggerated, playful flavor text inspired by cereal-box marketing copy. Use vintage-inspired typography and graphic accents without copying real slogans.\n\nApply realistic cardboard texture, slight wear, subtle creases, and printing imperfections. The box should appear photographed in a real environment. Ensure all text and the subject are readable on a small screen."
  },
  {
    name: "WHO'S A GOOD HUMAN?",
    category: ["HUMOR", "ROLE REVERSAL", "SURREAL", "PETS"],
    message: "Take a picture and apply a role-reversal between humans and pets.\n\nFirst determine the type of subject:\n\n• If the subject is an ANIMAL (dog, cat, bird, etc.): place them into a realistic human situation such as working in an office, driving a car, shopping, cooking, using a phone, or sitting in a café. The animal should behave like a person while still clearly being an animal. Use proper perspective, props, and body positioning so it looks natural and believable.\n\n• If the subject is a HUMAN: transform them into a pet owned by an animal. The human should be on a leash, being carried, sitting in a pet carrier, or being walked by a dog, cat, or other animal. The animal must clearly be the owner and in control.\n\nThe scene should be funny but not mean-spirited — playful, surreal, and instantly understandable at a glance.\n\nMaintain realistic lighting, scale, and contact between characters so the interaction feels physically real. The subject must be fully integrated into the scene, not pasted on.\n\nIf external master prompt text is provided, use it to influence the setting (for example: city, park, medieval, sci-fi, luxury, etc.).\n\nThe final image should feel like a clever visual gag you’d see on a magazine cover or viral poster."
  },
  {
    name: "WINDOWS WALLPAPER",
    category: ["WALLPAPER", "DESKTOP", "HUMOR", "DESIGN"],
    message: "Take a picture and transform the subject into a widescreen desktop wallpaper that looks like a fake, humorous Windows-style computer desktop.\n\nUse a wide landscape aspect ratio (about 16:9 or wider). The subject should appear as the main wallpaper image — either posed inside a scene or interacting with the ‘desktop.’\n\nOverlay a fake desktop interface including:\n• fake desktop icons with funny names based on the subject’s personality (e.g., \"Tax Panic\", \"Selfies\", \"Emotional Support Folder\", \"Definitely Not Work\")\n• a fake taskbar with a clock, system tray, and silly system notifications\n• at least one humorous pop-up or error message related to the subject\n\nIcons should be placed around the subject so they do not block the face or important features.\n\nThe overall look should feel like a real computer desktop that someone paused mid-chaos — silly, cluttered, and personality-driven.\n\nThe final image should feel like a snapshot of the subject’s ridiculous personal computer, clearly readable on a large screen."
  },
  {
    name: "WOODCUT",
    category: ["ART", "PRINT", "CARVED"],
    message: "Take a picture and transform the image into a traditional woodcut print. Bold carved lines, high contrast. Limited color palette."
  },
  {
    name: "X-RAY",
    category: ["MEDICAL", "X RAY", "TECHNICAL"],
    message: "Take a picture and transform the image into an X-ray view. Semi-transparent layers revealing internal structure. Monochrome glow."
  },
  {
  name: "YARD SALE ITEM",
  category: ["HUMOR", "SALE"],
  message: "Take a picture and transform the subject into an item being sold at a casual neighborhood yard sale.\n\nDepict the subject posed stiffly or passively like merchandise, with a strip of masking tape on their chest or body displaying a handwritten price. The price and text should be humorous, such as 'Still Works,' 'No Returns,' or 'As-Is.'\n\nInclude a handwritten yard-sale sign nearby with casual marker lettering and uneven lines. Surround the subject with typical yard sale items like folding tables, boxes, old toys, lamps, or clothes racks.\n\nUse natural daylight and slightly cluttered suburban surroundings to sell the realism. The subject should feel like an object for sale, not a person shopping at the sale.\n\nEnsure the full subject and sale setup are fully visible within the frame. The tone should be funny, awkward, and unmistakably a yard sale scenario."
  },
  {
    name: "YEARBOOK",
    category: ["SCHOOL", "PHOTO", "AWKWARD"],
    message: "Take a picture and make the subject appear in an awkward, unflattering yearbook photo. Retro school photo style."
  },
  {
    name: "YOU SMELL",
    category: ["HUMOR", "SOCIAL", "REACTION"],
    message: "Take a picture of the subject and place them in a public setting such as a bus, office, party, or line.\n\nThe subject should have visible dark sweat stains under their arms.\n\nPeople around the subject should be reacting to the smell using exaggerated gestures such as holding their nose, covering their mouth, leaning away, or making disgusted faces.\n\nThe subject should look unaware or embarrassed.\n\nThe scene should look realistic but humorous, with the reactions clearly selling the joke."
  },
  {
  name: "ZOO-TOPIA",
  category: ["MOVIES", "ANIMAL", "ANTHROPOMORPHIC", "DISNEY"],
  message: "Take a picture and transform the subject into a realistic anthropomorphized animal character (Zootopia-style realism). Choose an animal form that naturally fits the subject’s facial structure, body type, and personality. Preserve recognizable facial features, expressions, proportions, hairstyle equivalents (fur patterns), and the subject’s exact clothing translated accurately onto the animal anatomy. The character must stand upright with human-like posture, hands, and gestures while retaining believable animal anatomy, fur detail, and species-specific traits. Photorealistic fur, skin, and fabric interaction with cinematic lighting. The subject must clearly remain the same individual, now reimagined as a believable anthropomorphic animal in a realistic world."
  }
];

// Load styles from localStorage or use defaults
let CAMERA_PRESETS = [...DEFAULT_PRESETS];
let currentPresetIndex = 0;
let editingStyleIndex = -1;
let isOnline = navigator.onLine;
let photoQueue = [];
let isSyncing = false;
// Scroll debouncing variables
let scrollTimeout = null;
let lastScrollTime = 0;
const SCROLL_DEBOUNCE_MS = 500;
const QUEUE_STORAGE_KEY = 'r1_camera_queue';

// Connection status elements
let connectionStatusElement, queueStatusElement, syncButton;

// Local storage key (for ALL camera presets)
const STORAGE_KEY = 'r1_camera_styles';

// Local storage key (for the ARRAY of favorite style names)
let favoriteStyles = []; 
const FAVORITE_STYLES_KEY = 'r1_camera_favorites';
const VISIBLE_PRESETS_KEY = 'r1_camera_visible_presets';
let visiblePresets = []; // Array of preset names that should be shown
let isVisiblePresetsSubmenuOpen = false;
let currentVisiblePresetsIndex = 0;
let visiblePresetsFilterText = '';
let visiblePresetsScrollEnabled = true;

// Style reveal functionality
function showStyleReveal(styleName) {
  if (styleRevealTimeout) {
    clearTimeout(styleRevealTimeout);
    styleRevealTimeout = null;
  }

  if (!styleRevealElement) {
    styleRevealElement = document.getElementById('style-reveal');
    styleRevealText = document.getElementById('style-reveal-text');
  }

  
  if (!styleRevealElement || !styleRevealText) return;
  
  styleRevealText.textContent = styleName;
  styleRevealElement.style.display = 'block';
  
  styleRevealTimeout = setTimeout(() => {
    if (styleRevealElement) {
      styleRevealElement.style.display = 'none';
    }
    styleRevealTimeout = null;
  }, 1200);
}

// ===================================
// Gallery Functions
// ===================================

// Initialize IndexedDB
function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => {
      console.error('Failed to open IndexedDB:', request.error);
      reject(request.error);
    };
    
    request.onsuccess = () => {
      db = request.result;
      console.log('IndexedDB opened successfully');
      resolve(db);
    };
    
    request.onupgradeneeded = (event) => {
      db = event.target.result;
      
      // Create object store if it doesn't exist
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const objectStore = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        objectStore.createIndex('timestamp', 'timestamp', { unique: false });
        console.log('Object store created');
      }
    };
  });
}

// Migrate old localStorage data to IndexedDB (run once)
async function migrateFromLocalStorage() {
  try {
    const oldIndexJson = localStorage.getItem('r1_gallery_index');
    if (!oldIndexJson) {
      console.log('No old gallery data to migrate');
      return;
    }
    
    const index = JSON.parse(oldIndexJson);
    let migratedCount = 0;
    
    for (const keyNum of index) {
      const keyName = 'r1_gallery_' + keyNum;
      const imagesJson = localStorage.getItem(keyName);
      if (imagesJson) {
        const images = JSON.parse(imagesJson);
        for (const image of images) {
          await saveImageToDB(image);
          migratedCount++;
        }
        // Clean up old localStorage key
        localStorage.removeItem(keyName);
      }
    }
    
    // Clean up old index
    localStorage.removeItem('r1_gallery_index');
    
    console.log(`Migration complete: ${migratedCount} images migrated to IndexedDB`);
    
    // Reload gallery
    await loadGallery();
  } catch (err) {
    console.error('Migration failed:', err);
  }
}

// Load gallery from IndexedDB
async function loadGallery() {
  try {
    if (!db) {
      await initDB();
    }
    
    galleryImages = [];
    
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const objectStore = transaction.objectStore(STORE_NAME);
    const request = objectStore.getAll();
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        galleryImages = request.result || [];
        
        // Load saved sort order
        const savedSortOrder = localStorage.getItem(GALLERY_SORT_ORDER_KEY);
        if (savedSortOrder) {
          gallerySortOrder = savedSortOrder;
        }
        
        // Sort by timestamp descending
        galleryImages.sort((a, b) => b.timestamp - a.timestamp);
        
        console.log(`Gallery loaded: ${galleryImages.length} images`);
        resolve();
      };
      
      request.onerror = () => {
        console.error('Failed to load gallery:', request.error);
        galleryImages = [];
        reject(request.error);
      };
    });
  } catch (err) {
    console.error('Error loading gallery:', err);
    galleryImages = [];
  }
}

// Save single image to IndexedDB
async function saveImageToDB(imageItem) {
  try {
    if (!db) {
      await initDB();
    }
    
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const objectStore = transaction.objectStore(STORE_NAME);
    const request = objectStore.add(imageItem);
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        console.log('Image saved to IndexedDB');
        resolve();
      };
      
      request.onerror = () => {
        console.error('Failed to save image:', request.error);
        reject(request.error);
      };
    });
  } catch (err) {
    console.error('Error saving image:', err);
  }
}

// Delete image from IndexedDB
async function deleteImageFromDB(imageId) {
  try {
    if (!db) {
      await initDB();
    }
    
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const objectStore = transaction.objectStore(STORE_NAME);
    const request = objectStore.delete(imageId);
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        console.log('Image deleted from IndexedDB');
        resolve();
      };
      
      request.onerror = () => {
        console.error('Failed to delete image:', request.error);
        reject(request.error);
      };
    });
  } catch (err) {
    console.error('Error deleting image:', err);
  }
}

// Get image count from IndexedDB
async function getImageCount() {
  try {
    if (!db) {
      await initDB();
    }
    
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const objectStore = transaction.objectStore(STORE_NAME);
    const request = objectStore.count();
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        resolve(request.result);
      };
      
      request.onerror = () => {
        console.error('Failed to count images:', request.error);
        reject(request.error);
      };
    });
  } catch (err) {
    console.error('Error counting images:', err);
    return 0;
  }
}

async function addToGallery(imageBase64) {
  const galleryItem = {
    id: Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9),
    imageBase64: imageBase64,
    timestamp: Date.now()
  };
  
  // Add to memory array
  galleryImages.unshift(galleryItem);
  
  // Save to IndexedDB (no limit!)
  await saveImageToDB(galleryItem);
  
  console.log(`Image added. Total: ${galleryImages.length}`);
}

function filterGalleryByDate(images) {
  if (!galleryStartDate && !galleryEndDate) {
    return images;
  }
  
  return images.filter(item => {
    const itemDate = new Date(item.timestamp);
    itemDate.setHours(0, 0, 0, 0);
    const itemTime = itemDate.getTime();
    
    let matchesStart = true;
    let matchesEnd = true;
    
    if (galleryStartDate) {
      const startTime = new Date(galleryStartDate).getTime();
      matchesStart = itemTime >= startTime;
    }
    
    if (galleryEndDate) {
      const endTime = new Date(galleryEndDate).getTime();
      matchesEnd = itemTime <= endTime;
    }
    
    return matchesStart && matchesEnd;
  });
}

function sortGalleryImages(images) {
  const sorted = [...images];
  if (gallerySortOrder === 'newest') {
    sorted.sort((a, b) => b.timestamp - a.timestamp);
  } else {
    sorted.sort((a, b) => a.timestamp - b.timestamp);
  }
  return sorted;
}

function getFilteredAndSortedGallery() {
  let filtered = filterGalleryByDate(galleryImages);
  return sortGalleryImages(filtered);
}

async function showGallery() {
  pauseCamera();
  cancelTimerCountdown();

  // Clear any captured image before opening gallery
  if (capturedImage && capturedImage.style.display === 'block') {
    resetToCamera();
  }
  
  // Reload gallery from IndexedDB to ensure we have latest data
  await loadGallery();
  const modal = document.getElementById('gallery-modal');
  const grid = document.getElementById('gallery-grid');
  const pagination = document.getElementById('gallery-pagination');
  const pageInfo = document.getElementById('page-info');
  const prevBtn = document.getElementById('prev-page');
  const nextBtn = document.getElementById('next-page');

  // Update gallery count in header
  const galleryCount = document.getElementById('gallery-count');
  if (galleryCount) {
    galleryCount.textContent = galleryImages.length;
  }
  
  // Set the sort order dropdown to current value
  const sortOrderSelect = document.getElementById('gallery-sort-order');
  if (sortOrderSelect) {
    sortOrderSelect.value = gallerySortOrder;
  }
  
  const filteredImages = getFilteredAndSortedGallery();
  
  if (filteredImages.length === 0) {
    grid.innerHTML = '<div class="gallery-empty">No photos match the selected filter.</div>';
    pagination.style.display = 'none';
  } else {
    const totalPages = Math.ceil(filteredImages.length / ITEMS_PER_PAGE);
    currentGalleryPage = Math.min(currentGalleryPage, totalPages);
    
    const startIndex = (currentGalleryPage - 1) * ITEMS_PER_PAGE;
    const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredImages.length);
    const pageImages = filteredImages.slice(startIndex, endIndex);
    
    const fragment = document.createDocumentFragment();
    
    pageImages.forEach((item) => {
      const imgContainer = document.createElement('div');
      imgContainer.className = 'gallery-item';
      
      if (isBatchMode && selectedBatchImages.has(item.id)) {
        imgContainer.classList.add('selected');
      }
      
      if (isBatchMode) {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'gallery-item-checkbox';
        checkbox.checked = selectedBatchImages.has(item.id);
        checkbox.addEventListener('click', (e) => {
          e.stopPropagation();
          toggleBatchImageSelection(item.id);
        });
        imgContainer.appendChild(checkbox);
      }
      
      const img = document.createElement('img');
      img.src = item.imageBase64;
      img.alt = 'Gallery image';
      img.loading = 'lazy';
      
      imgContainer.appendChild(img);
      
      imgContainer.onclick = () => {
        if (isBatchMode) {
          toggleBatchImageSelection(item.id);
          showGallery(); // Refresh to update checkboxes
        } else {
          const originalIndex = galleryImages.findIndex(i => i.id === item.id);
          openImageViewer(originalIndex);
        }
      };
      
      fragment.appendChild(imgContainer);
    });
    
    grid.innerHTML = '';
    grid.appendChild(fragment);
    
    if (totalPages > 1) {
      pagination.style.display = 'flex';
      pageInfo.textContent = `Page ${currentGalleryPage} of ${totalPages}`;
      prevBtn.disabled = currentGalleryPage === 1;
      nextBtn.disabled = currentGalleryPage === totalPages;
    } else {
      pagination.style.display = 'none';
    }
  }
  
  modal.style.display = 'flex';
}

async function hideGallery() {
  document.getElementById('gallery-modal').style.display = 'none';
  currentGalleryPage = 1;
  await resumeCamera(); // Now this only happens when truly closing gallery
}

function nextGalleryPage() {
  const filteredImages = getFilteredAndSortedGallery();
  const totalPages = Math.ceil(filteredImages.length / ITEMS_PER_PAGE);
  if (currentGalleryPage < totalPages) {
    currentGalleryPage++;
    showGallery();
  }
}

function prevGalleryPage() {
  if (currentGalleryPage > 1) {
    currentGalleryPage--;
    showGallery();
  }
}

function onGalleryFilterChange() {
  currentGalleryPage = 1;
  showGallery();
}

function updateDateButtonText(type, dateValue) {
  const btnId = type === 'start' ? 'gallery-start-date-btn' : 'gallery-end-date-btn';
  const btn = document.getElementById(btnId);
  if (!btn) return;
  
  const textSpan = btn.querySelector('.date-button-text');
  if (!textSpan) return;
  
  if (dateValue) {
    const date = new Date(dateValue + 'T00:00:00');
    const formatted = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    textSpan.textContent = formatted;
    btn.classList.add('has-date');
  } else {
    textSpan.textContent = type === 'start' ? 'Start' : 'End';
    btn.classList.remove('has-date');
  }
}

function openImageViewer(index) {
  if (index < 0 || index >= galleryImages.length) return;
  
  currentViewerImageIndex = index;
  const item = galleryImages[index];
  
  const viewer = document.getElementById('image-viewer');
  const img = document.getElementById('viewer-image');
  const promptInput = document.getElementById('viewer-prompt');
  
  img.src = item.imageBase64;
  img.style.transform = 'scale(1) translate(0, 0)';
  viewerZoom = 1;
  
  promptInput.value = '';
  
  viewer.style.display = 'flex';
  
  // hideGallery();

  document.getElementById('gallery-modal').style.display = 'none';
}

function closeImageViewer() {
  document.getElementById('image-viewer').style.display = 'none';
  currentViewerImageIndex = -1;
  viewerZoom = 1;
  
  // Show gallery again without resuming camera
  const modal = document.getElementById('gallery-modal');
  modal.style.display = 'flex';
  // Don't call showGallery() as it would reload everything
  // Just refresh the grid
  showGallery();
}

async function deleteViewerImage() {
  if (currentViewerImageIndex < 0 || currentViewerImageIndex >= galleryImages.length) {
    return;
  }
  
  if (confirm('Delete this image from gallery?')) {
    const imageToDelete = galleryImages[currentViewerImageIndex];
    
    // Remove from IndexedDB
    await deleteImageFromDB(imageToDelete.id);
    
    // Remove from memory array
    galleryImages.splice(currentViewerImageIndex, 1);
    
    document.getElementById('image-viewer').style.display = 'none';
    currentViewerImageIndex = -1;
    viewerZoom = 1;
    
    showGallery();
  }
}

function showPresetSelector() {
  const modal = document.getElementById('preset-selector');
  populatePresetList();

  // Initialize preset count display
  const presetCountElement = document.getElementById('preset-count');
  if (presetCountElement) {
    presetCountElement.textContent = CAMERA_PRESETS.length;
  }

  modal.style.display = 'flex';
  isPresetSelectorOpen = true;
  currentPresetIndex_Gallery = 0;
  updatePresetSelection();
  
  // Restore scroll position after DOM updates
  setTimeout(() => {
    const presetList = document.getElementById('preset-list');
    if (presetList && presetListScrollPosition > 0) {
      presetList.scrollTop = presetListScrollPosition;
    }
  }, 50);
}

function hidePresetSelector() {
  // Save scroll position before hiding
  const presetList = document.getElementById('preset-list');
  if (presetList) {
    presetListScrollPosition = presetList.scrollTop;
  }
  
  document.getElementById('preset-selector').style.display = 'none';
  presetFilterText = '';
  galleryPresetFilterByCategory = ''; // Clear category filter
  document.getElementById('preset-filter').value = '';
  isPresetSelectorOpen = false;
  currentPresetIndex_Gallery = 0;
  
  // Hide category hint
  const categoryHint = document.getElementById('preset-selector-category-hint');
  if (categoryHint) {
    categoryHint.style.display = 'none';
  }

  // Clear special mode flags
  isBatchPresetSelectionActive = false;
  isMultiPresetMode = false;
}

function scrollPresetListUp() {
  if (!isPresetSelectorOpen) return;
  
  const presetList = document.getElementById('preset-list');
  if (!presetList) return;

  const items = presetList.querySelectorAll('.preset-item');
  if (items.length === 0) return;

  currentPresetIndex_Gallery = Math.max(0, currentPresetIndex_Gallery - 1);
  updatePresetSelection();
}

function scrollPresetListDown() {
  if (!isPresetSelectorOpen) return;
  
  const presetList = document.getElementById('preset-list');
  if (!presetList) return;

  const items = presetList.querySelectorAll('.preset-item');
  if (items.length === 0) return;

  currentPresetIndex_Gallery = Math.min(items.length - 1, currentPresetIndex_Gallery + 1);
  updatePresetSelection();
}

function updatePresetSelection() {
  const presetList = document.getElementById('preset-list');
  if (!presetList) return;

  const items = presetList.querySelectorAll('.preset-item');
  if (items.length === 0) return;

  // Remove previous selection
  items.forEach(item => {
    item.classList.remove('preset-selected');
  });

  // Add selection to current item
  if (currentPresetIndex_Gallery >= 0 && currentPresetIndex_Gallery < items.length) {
    const currentItem = items[currentPresetIndex_Gallery];
    currentItem.classList.add('preset-selected');
    
    // Scroll item into view
    currentItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Show category hint with individually clickable categories
    const presetName = currentItem.querySelector('.preset-name').textContent;
    const preset = CAMERA_PRESETS.find(p => p.name === presetName);
    const categoryHint = document.getElementById('preset-selector-category-hint');
    if (categoryHint && preset && preset.category) {
      // Clear previous content
      categoryHint.innerHTML = '';
      categoryHint.style.display = 'block';
      
      // Create a clickable span for each category
      preset.category.forEach((cat, index) => {
        const categorySpan = document.createElement('span');
        categorySpan.textContent = cat;
        categorySpan.style.cursor = 'pointer';
        categorySpan.style.padding = '0 2px';
        
        // Highlight if this category is currently being filtered
        if (galleryPresetFilterByCategory === cat) {
          categorySpan.style.textDecoration = 'underline';
          categorySpan.style.fontWeight = 'bold';
        }
        
        // Make each category clickable
        categorySpan.onclick = (e) => {
          e.stopPropagation();
          // If already filtering by this category, clear the filter
          if (galleryPresetFilterByCategory === cat) {
            galleryPresetFilterByCategory = '';
          } else {
            // Filter by this category
            galleryPresetFilterByCategory = cat;
          }
          currentPresetIndex_Gallery = 0;
          populatePresetList();
        };
        
        categoryHint.appendChild(categorySpan);
        
        // Add comma separator if not the last category
        if (index < preset.category.length - 1) {
          const comma = document.createElement('span');
          comma.textContent = ', ';
          categoryHint.appendChild(comma);
        }
      });
    } else if (categoryHint) {
      categoryHint.style.display = 'none';
    }
  }
}

function scrollSettingsUp() {
  if (!isSettingsSubmenuOpen) return;
  
  const submenu = document.getElementById('settings-submenu');
  if (!submenu) return;

  const items = submenu.querySelectorAll('.menu-section-button');
  if (items.length === 0) return;

  currentSettingsIndex = Math.max(0, currentSettingsIndex - 1);
  updateSettingsSelection();
}

function scrollSettingsDown() {
  if (!isSettingsSubmenuOpen) return;
  
  const submenu = document.getElementById('settings-submenu');
  if (!submenu) return;

  const items = submenu.querySelectorAll('.menu-section-button');
  if (items.length === 0) return;

  currentSettingsIndex = Math.min(items.length - 1, currentSettingsIndex + 1);
  updateSettingsSelection();
}

function updateSettingsSelection() {
  const submenu = document.getElementById('settings-submenu');
  if (!submenu) return;

  const items = submenu.querySelectorAll('.menu-section-button');
  if (items.length === 0) return;

  // Remove previous selection
  items.forEach(item => {
    item.classList.remove('menu-selected');
  });

  // Add selection to current item
  if (currentSettingsIndex >= 0 && currentSettingsIndex < items.length) {
    const currentItem = items[currentSettingsIndex];
    currentItem.classList.add('menu-selected');
    
    // Scroll item into view
    currentItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function scrollResolutionMenuUp() {
  const submenu = document.getElementById('resolution-submenu');
  if (!submenu || submenu.style.display !== 'flex') return;
  
  const items = submenu.querySelectorAll('.resolution-item');
  if (items.length === 0) return;
  
  currentResolutionIndex_Menu = (currentResolutionIndex_Menu - 1 + items.length) % items.length;
  updateResolutionMenuSelection(items);
}

function scrollResolutionMenuDown() {
  const submenu = document.getElementById('resolution-submenu');
  if (!submenu || submenu.style.display !== 'flex') return;
  
  const items = submenu.querySelectorAll('.resolution-item');
  if (items.length === 0) return;
  
  currentResolutionIndex_Menu = (currentResolutionIndex_Menu + 1) % items.length;
  updateResolutionMenuSelection(items);
}

function updateResolutionMenuSelection(items) {
  items.forEach(item => item.classList.remove('menu-selected'));
  
  if (currentResolutionIndex_Menu >= 0 && currentResolutionIndex_Menu < items.length) {
    const currentItem = items[currentResolutionIndex_Menu];
    currentItem.classList.add('menu-selected');
    currentItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function scrollBurstUp() {
  const submenu = document.getElementById('burst-submenu');
  if (!submenu || submenu.style.display !== 'flex') return;
  
  const container = submenu.querySelector('.submenu-list');
  if (container) {
    container.scrollTop = Math.max(0, container.scrollTop - 80);
  }
}

function scrollBurstDown() {
  const submenu = document.getElementById('burst-submenu');
  if (!submenu || submenu.style.display !== 'flex') return;
  
  const container = submenu.querySelector('.submenu-list');
  if (container) {
    container.scrollTop = Math.min(container.scrollHeight - container.clientHeight, container.scrollTop + 80);
  }
}

function scrollTimerUp() {
  const submenu = document.getElementById('timer-settings-submenu');
  if (!submenu || submenu.style.display !== 'flex') return;
  
  const container = submenu.querySelector('.submenu-list');
  if (container) {
    container.scrollTop = Math.max(0, container.scrollTop - 80);
  }
}

function scrollTimerDown() {
  const submenu = document.getElementById('timer-settings-submenu');
  if (!submenu || submenu.style.display !== 'flex') return;
  
  const container = submenu.querySelector('.submenu-list');
  if (container) {
    container.scrollTop = Math.min(container.scrollHeight - container.clientHeight, container.scrollTop + 80);
  }
}

function scrollMasterPromptUp() {
  const submenu = document.getElementById('master-prompt-submenu');
  if (!submenu || submenu.style.display !== 'flex') return;
  
  const container = submenu.querySelector('.submenu-list');
  if (container) {
    container.scrollTop = Math.max(0, container.scrollTop - 80);
  }
}

function scrollMasterPromptDown() {
  const submenu = document.getElementById('master-prompt-submenu');
  if (!submenu || submenu.style.display !== 'flex') return;
  
  const container = submenu.querySelector('.submenu-list');
  if (container) {
    container.scrollTop = Math.min(container.scrollHeight - container.clientHeight, container.scrollTop + 80);
  }
}

function scrollMotionUp() {
  const submenu = document.getElementById('motion-submenu');
  if (!submenu || submenu.style.display !== 'flex') return;
  
  const container = submenu.querySelector('.submenu-list');
  if (container) {
    container.scrollTop = Math.max(0, container.scrollTop - 80);
  }
}

function scrollMotionDown() {
  const submenu = document.getElementById('motion-submenu');
  if (!submenu || submenu.style.display !== 'flex') return;
  
  const container = submenu.querySelector('.submenu-list');
  if (container) {
    container.scrollTop = Math.min(container.scrollHeight - container.clientHeight, container.scrollTop + 80);
  }
}

function scrollPresetBuilderUp() {
  if (!isPresetBuilderSubmenuOpen) return;
  
  const submenu = document.getElementById('preset-builder-submenu');
  if (!submenu || submenu.style.display !== 'flex') return;
  
  const container = submenu.querySelector('.preset-builder-form');
  if (container) {
    container.scrollTop = Math.max(0, container.scrollTop - 80);
  }
}

function scrollPresetBuilderDown() {
  if (!isPresetBuilderSubmenuOpen) return;
  
  const submenu = document.getElementById('preset-builder-submenu');
  if (!submenu || submenu.style.display !== 'flex') return;
  
  const container = submenu.querySelector('.preset-builder-form');
  if (container) {
    container.scrollTop = Math.min(container.scrollHeight - container.clientHeight, container.scrollTop + 80);
  }
}

function scrollGalleryUp() {
  const modal = document.getElementById('gallery-modal');
  if (!modal || modal.style.display !== 'flex') return;
  
  const container = modal.querySelector('.gallery-scroll-container');
  if (container) {
    container.scrollTop = Math.max(0, container.scrollTop - 80);
  }
}

function scrollGalleryDown() {
  const modal = document.getElementById('gallery-modal');
  if (!modal || modal.style.display !== 'flex') return;
  
  const container = modal.querySelector('.gallery-scroll-container');
  if (container) {
    container.scrollTop = Math.min(container.scrollHeight - container.clientHeight, container.scrollTop + 80);
  }
}

function scrollViewerUp() {
  const viewer = document.getElementById('image-viewer');
  if (!viewer || viewer.style.display !== 'flex') return;
  
  const container = viewer.querySelector('.viewer-controls');
  if (container) {
    container.scrollTop = Math.max(0, container.scrollTop - 80);
  }
}

function scrollViewerDown() {
  const viewer = document.getElementById('image-viewer');
  if (!viewer || viewer.style.display !== 'flex') return;
  
  const container = viewer.querySelector('.viewer-controls');
  if (container) {
    container.scrollTop = Math.min(container.scrollHeight - container.clientHeight, container.scrollTop + 80);
  }
}

function scrollEditorUp() {
  const editor = document.getElementById('style-editor');
  if (!editor || editor.style.display !== 'flex') return;
  
  const container = editor.querySelector('.style-editor-body');
  if (container) {
    container.scrollTop = Math.max(0, container.scrollTop - 80);
  }
}

function scrollEditorDown() {
  const editor = document.getElementById('style-editor');
  if (!editor || editor.style.display !== 'flex') return;
  
  const container = editor.querySelector('.style-editor-body');
  if (container) {
    container.scrollTop = Math.min(container.scrollHeight - container.clientHeight, container.scrollTop + 80);
  }
}

function scrollQueueUp() {
  const queue = document.getElementById('queue-manager');
  if (!queue || queue.style.display !== 'flex') return;
  
  const container = queue.querySelector('.queue-list');
  if (container) {
    container.scrollTop = Math.max(0, container.scrollTop - 80);
  }
}

function scrollQueueDown() {
  const queue = document.getElementById('queue-manager');
  if (!queue || queue.style.display !== 'flex') return;
  
  const container = queue.querySelector('.queue-list');
  if (container) {
    container.scrollTop = Math.min(container.scrollHeight - container.clientHeight, container.scrollTop + 80);
  }
}

function selectCurrentPresetItem() {
  if (!isPresetSelectorOpen) return;

  const presetList = document.getElementById('preset-list');
  if (!presetList) return;

  const items = presetList.querySelectorAll('.preset-item');
  if (items.length === 0 || currentPresetIndex_Gallery >= items.length) return;

  const currentItem = items[currentPresetIndex_Gallery];
  if (currentItem) {
    // Trigger the click event
    currentItem.click();
  }
}

function populatePresetList() {
  const list = document.getElementById('preset-list');
  list.innerHTML = '';
  
  const filtered = getVisiblePresets().filter(preset => {
    // First apply text search filter
    if (presetFilterText) {
      const searchText = presetFilterText.toLowerCase();
      const categoryMatch = preset.category && preset.category.some(cat => cat.toLowerCase().includes(searchText));
      const textMatch = preset.name.toLowerCase().includes(searchText) || 
             preset.message.toLowerCase().includes(searchText) ||
             categoryMatch;
      if (!textMatch) return false;
    }
    
    // Then apply category filter if active
    if (galleryPresetFilterByCategory) {
      return preset.category && preset.category.includes(galleryPresetFilterByCategory);
    }
    
    return true;
  });
  
  // Sort alphabetically by name
  const sortedAll = filtered.sort((a, b) => a.name.localeCompare(b.name));
  
  // Separate favorites and regular presets
  const favorites = sortedAll.filter(p => isFavoriteStyle(p.name));
  const regular = sortedAll.filter(p => !isFavoriteStyle(p.name));
  
  // Combine: favorites first, then regular
  const sorted = [...favorites, ...regular];
  
  if (sorted.length === 0) {
    list.innerHTML = '<div class="preset-empty">No presets found</div>';
    return;
  }
  
  sorted.forEach(preset => {
    const item = document.createElement('div');
    item.className = 'preset-item';
    
    const name = document.createElement('div');
    name.className = 'preset-name';
    name.textContent = preset.name;
    
    const message = document.createElement('div');
    message.className = 'preset-description preset-description-hidden';
    message.textContent = preset.message;
    
    item.appendChild(name);
    item.appendChild(message);
    
    item.onclick = () => {
      // Toggle description visibility
      if (message.classList.contains('preset-description-hidden')) {
        message.classList.remove('preset-description-hidden');
      } else {
        // If description is showing, select the preset
        selectPreset(preset);
      }
    };
    
    list.appendChild(item);
  });
// Update preset count
  const presetCountElement = document.getElementById('preset-count');
  if (presetCountElement) {
    presetCountElement.textContent = sorted.length;
  }
}

async function selectPreset(preset) {
  // Multi-preset mode
  if (isMultiPresetMode) {
    const index = selectedPresets.findIndex(p => p.name === preset.name);
    if (index > -1) {
      selectedPresets.splice(index, 1);
    } else {
      selectedPresets.push(preset);
    }
    updateMultiPresetList();
    return;
  }
  
  // Batch processing mode
  if (window.batchProcessingActive) {
    window.batchProcessingActive = false;
    const imagesToProcess = window.batchImagesToProcess;
    window.batchImagesToProcess = null;
    
    hidePresetSelector();
    
    const modal = document.getElementById('preset-selector');
    const header = modal.querySelector('.preset-selector-header h3');
    header.textContent = 'Select Preset';
    
    await processBatchImages(preset, imagesToProcess);
    return;
  }
  
  // Normal preset selection for viewer
  const promptInput = document.getElementById('viewer-prompt');
  promptInput.value = preset.message;
  hidePresetSelector();
}

function submitMagicTransform() {
  if (currentViewerImageIndex < 0 || currentViewerImageIndex >= galleryImages.length) {
    alert('No image selected');
    return;
  }
  
  const promptInput = document.getElementById('viewer-prompt');
  const prompt = promptInput.value.trim();
  
  if (!prompt) {
    alert('Please enter a prompt or load a preset');
    return;
  }
  
  const item = galleryImages[currentViewerImageIndex];
  
  if (typeof PluginMessageHandler !== 'undefined') {
    PluginMessageHandler.postMessage(JSON.stringify({
      message: getFinalPrompt(prompt),
      pluginId: 'com.r1.pixelart',
      imageBase64: item.imageBase64
    }));
    
    alert('Magic transform submitted! You can submit again with a different prompt.');
  } else {
    alert('Magic transform sent: ' + prompt.substring(0, 50) + '...');
  }
}

// Batch Mode Functions
function toggleBatchMode() {
  isBatchMode = !isBatchMode;
  const toggleBtn = document.getElementById('batch-mode-toggle');
  const batchControls = document.getElementById('batch-controls');
  const batchActionBar = document.getElementById('batch-action-bar');
  
  if (isBatchMode) {
    toggleBtn.textContent = 'Done';
    toggleBtn.classList.add('active');
    batchControls.style.display = 'flex';
    batchActionBar.style.display = 'flex';
    selectedBatchImages.clear();
    updateBatchSelection();
    showGallery();
  } else {
    toggleBtn.textContent = 'Select';
    toggleBtn.classList.remove('active');
    batchControls.style.display = 'none';
    batchActionBar.style.display = 'none';
    selectedBatchImages.clear();
    showGallery();
  }
}

function updateBatchSelection() {
  const countElement = document.getElementById('batch-selected-count');
  const applyButton = document.getElementById('batch-apply-preset');
  const deleteButton = document.getElementById('batch-delete');
  
  countElement.textContent = `${selectedBatchImages.size} selected`;
  applyButton.disabled = selectedBatchImages.size === 0;
  if (deleteButton) {
    deleteButton.disabled = selectedBatchImages.size === 0;
  }
}

function selectAllBatchImages() {
  const filteredImages = getFilteredAndSortedGallery();
  selectedBatchImages.clear();
  filteredImages.forEach(img => selectedBatchImages.add(img.id));
  updateBatchSelection();
  showGallery();
}

function deselectAllBatchImages() {
  selectedBatchImages.clear();
  updateBatchSelection();
  showGallery();
}

function toggleBatchImageSelection(imageId) {
  if (selectedBatchImages.has(imageId)) {
    selectedBatchImages.delete(imageId);
  } else {
    selectedBatchImages.add(imageId);
  }
  updateBatchSelection();
}

async function applyPresetToBatch() {
  if (selectedBatchImages.size === 0) return;
  
  const modal = document.getElementById('preset-selector');
  const header = modal.querySelector('.preset-selector-header h3');
  header.textContent = `Select Preset (${selectedBatchImages.size} images)`;

  // Set batch selection flag
  isBatchPresetSelectionActive = true;
  
  // Store which images to process
  const imagesToProcess = Array.from(selectedBatchImages);
  
  // Override selectPreset temporarily - store original first
  const originalSelectPreset = selectPreset;
  
  // Create a global flag
  window.batchProcessingActive = true;
  window.batchImagesToProcess = imagesToProcess;
  
  populatePresetList();
  modal.style.display = 'flex';
  isPresetSelectorOpen = true;
  currentPresetIndex_Gallery = 0;
  updatePresetSelection();
}

async function processBatchImages(preset, imagesToProcess) {
 // Clear batch selection flag
  isBatchPresetSelectionActive = false;
  const selectedIds = imagesToProcess || Array.from(selectedBatchImages);
  const total = selectedIds.length;
  
  const overlay = document.createElement('div');
  overlay.className = 'batch-progress-overlay';
  overlay.innerHTML = `
    <div class="batch-progress-text">Processing <span id="batch-current">0</span> / ${total}</div>
    <div class="batch-progress-bar">
      <div class="batch-progress-fill" id="batch-progress-fill" style="width: 0%"></div>
    </div>
  `;
  document.body.appendChild(overlay);
  
  let processed = 0;
  
  for (const imageId of selectedIds) {
    const image = galleryImages.find(img => img.id === imageId);
    if (!image) continue;
    
    try {
      const finalPrompt = getFinalPrompt(preset.message);
      
      if (typeof PluginMessageHandler !== 'undefined') {
        PluginMessageHandler.postMessage(JSON.stringify({
          message: finalPrompt,
          pluginId: 'com.r1.pixelart',
          imageBase64: image.imageBase64
        }));
      }
      
      processed++;
      document.getElementById('batch-current').textContent = processed;
      document.getElementById('batch-progress-fill').style.width = `${(processed / total) * 100}%`;
      
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`Failed to process image ${imageId}:`, error);
    }
  }
  
  document.body.removeChild(overlay);
  
  isBatchMode = false;
  selectedBatchImages.clear();
  toggleBatchMode();
  
  alert(`Batch processing complete! ${processed} of ${total} images submitted.`);
}

async function batchDeleteImages() {
  if (selectedBatchImages.size === 0) return;
  
  const count = selectedBatchImages.size;
  const confirmed = confirm(`Are you sure you want to delete ${count} selected image${count > 1 ? 's' : ''}? This cannot be undone.`);
  
  if (!confirmed) return;
  
  const imagesToDelete = Array.from(selectedBatchImages);
  
  // Show progress
  const overlay = document.createElement('div');
  overlay.className = 'batch-progress-overlay';
  overlay.innerHTML = `
    <div class="batch-progress-text">Deleting <span id="batch-current">0</span> / ${count}</div>
    <div class="batch-progress-bar">
      <div class="batch-progress-fill" id="batch-progress-fill" style="width: 0%"></div>
    </div>
  `;
  document.body.appendChild(overlay);
  
  let deleted = 0;
  
  for (const imageId of imagesToDelete) {
    try {
      await deleteImageFromDB(imageId);
      deleted++;
      document.getElementById('batch-current').textContent = deleted;
      document.getElementById('batch-progress-fill').style.width = `${(deleted / count) * 100}%`;
    } catch (error) {
      console.error(`Failed to delete image ${imageId}:`, error);
    }
  }
  
  document.body.removeChild(overlay);
  
  // Exit batch mode and reload gallery
  isBatchMode = false;
  selectedBatchImages.clear();
  await loadGallery();
  toggleBatchMode();
  
  alert(`${deleted} of ${count} image${deleted > 1 ? 's' : ''} deleted successfully.`);
}

function openMultiPresetSelector(imageId) {
  multiPresetImageId = imageId;
  selectedPresets = [];
  isMultiPresetMode = true;
  
  const modal = document.getElementById('preset-selector');
  const header = modal.querySelector('.preset-selector-header h3');
  header.innerHTML = 'Select Presets (Multi-Select) <span id="multi-preset-count" style="font-size: 12px; color: #666;">(0 selected)</span>';
  
  // Add multi-select controls if not already there
  let multiControls = document.getElementById('multi-preset-controls');
  if (!multiControls) {
    multiControls = document.createElement('div');
    multiControls.id = 'multi-preset-controls';
    multiControls.style.cssText = 'padding: 8px; background: #f5f5f5; border-bottom: 1px solid #ddd; display: flex; gap: 8px; justify-content: space-between;';
    multiControls.innerHTML = `
      <button id="multi-preset-apply" class="batch-control-button" style="background: #4CAF50; color: white;">Apply Selected</button>
      <button id="multi-preset-cancel" class="batch-control-button">Cancel</button>
    `;
    
    const presetFilter = document.getElementById('preset-filter');
    presetFilter.parentNode.insertBefore(multiControls, presetFilter.nextSibling);
  }
  multiControls.style.display = 'flex';
  
  populatePresetList();
  updateMultiPresetList();
  modal.style.display = 'flex';
  isPresetSelectorOpen = true;
  currentPresetIndex_Gallery = 0;
  updatePresetSelection();
  
  // Add event listeners for multi-preset controls
  document.getElementById('multi-preset-apply').onclick = applyMultiplePresets;
  document.getElementById('multi-preset-cancel').onclick = cancelMultiPresetMode;
}

function updateMultiPresetList() {
  const presetList = document.getElementById('preset-list');
  const items = presetList.querySelectorAll('.preset-item');
  
  items.forEach(item => {
    const presetName = item.querySelector('.preset-name').textContent;
    const isSelected = selectedPresets.some(p => p.name === presetName);
    
    if (isSelected) {
      item.style.background = '#e8f5e9';
      item.style.border = '2px solid #4CAF50';
    } else {
      item.style.background = '';
      item.style.border = '';
    }
  });
  
  const countSpan = document.getElementById('multi-preset-count');
  if (countSpan) {
    countSpan.textContent = `(${selectedPresets.length} selected)`;
  }
}

function cancelMultiPresetMode() {
  isMultiPresetMode = false;
  multiPresetImageId = null;
  selectedPresets = [];
  
  const multiControls = document.getElementById('multi-preset-controls');
  if (multiControls) {
    multiControls.style.display = 'none';
  }
  
  const header = document.querySelector('.preset-selector-header h3');
  header.textContent = 'Select Preset';
  
  hidePresetSelector();
}

async function applyMultiplePresets() {
  if (selectedPresets.length === 0) {
    alert('Please select at least one preset');
    return;
  }
  
  if (!multiPresetImageId) {
    alert('No image selected');
    return;
  }
  
  const image = galleryImages.find(img => img.id === multiPresetImageId);
  if (!image) {
    alert('Image not found');
    return;
  }
  
  // Save presets before canceling mode (which clears the array)
  const presetsToApply = [...selectedPresets];
  
  cancelMultiPresetMode();
  
  // Show progress
  const overlay = document.createElement('div');
  overlay.className = 'batch-progress-overlay';
  overlay.innerHTML = `
    <div class="batch-progress-text">Applying preset <span id="batch-current">0</span> / ${presetsToApply.length}</div>
    <div class="batch-progress-bar">
      <div class="batch-progress-fill" id="batch-progress-fill" style="width: 0%"></div>
    </div>
  `;
  document.body.appendChild(overlay);
  
  let processed = 0;
  
  for (const preset of presetsToApply) {
    try {
      const finalPrompt = getFinalPrompt(preset.message);
      
      if (typeof PluginMessageHandler !== 'undefined') {
        PluginMessageHandler.postMessage(JSON.stringify({
          message: finalPrompt,
          pluginId: 'com.r1.pixelart',
          imageBase64: image.imageBase64
        }));
      }
      
      processed++;
      document.getElementById('batch-current').textContent = processed;
      document.getElementById('batch-progress-fill').style.width = `${(processed / presetsToApply.length) * 100}%`;
      
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`Failed to apply preset ${preset.name}:`, error);
    }
  }
  
  document.body.removeChild(overlay);
  alert(`${processed} preset${processed > 1 ? 's' : ''} applied successfully!`);
}

function setupViewerPinchZoom() {
  const img = document.getElementById('viewer-image');
  const container = document.querySelector('.image-viewer-container');
  
  let translateX = 0;
  let translateY = 0;
  let startX = 0;
  let startY = 0;
  let isDragging = false;
  
  container.addEventListener('touchstart', (e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      viewerIsPinching = true;
      viewerInitialPinchDistance = getDistance(e.touches[0], e.touches[1]);
      viewerInitialZoom = viewerZoom;
    } else if (e.touches.length === 1 && viewerZoom > 1) {
      isDragging = true;
      startX = e.touches[0].clientX - translateX;
      startY = e.touches[0].clientY - translateY;
    }
  }, { passive: false });
  
  container.addEventListener('touchmove', (e) => {
    if (viewerIsPinching && e.touches.length === 2) {
      e.preventDefault();
      const currentDistance = getDistance(e.touches[0], e.touches[1]);
      const scale = currentDistance / viewerInitialPinchDistance;
      viewerZoom = Math.max(1, Math.min(viewerInitialZoom * scale, 5));
      
      img.style.transform = `scale(${viewerZoom}) translate(${translateX}px, ${translateY}px)`;
    } else if (isDragging && e.touches.length === 1 && viewerZoom > 1) {
      e.preventDefault();
      translateX = e.touches[0].clientX - startX;
      translateY = e.touches[0].clientY - startY;
      
      img.style.transform = `scale(${viewerZoom}) translate(${translateX}px, ${translateY}px)`;
    }
  }, { passive: false });
  
  container.addEventListener('touchend', (e) => {
    if (e.touches.length < 2) {
      viewerIsPinching = false;
    }
    if (e.touches.length === 0) {
      isDragging = false;
      if (viewerZoom === 1) {
        translateX = 0;
        translateY = 0;
        img.style.transform = 'scale(1) translate(0, 0)';
      }
    }
  });
  
  container.addEventListener('touchcancel', () => {
    viewerIsPinching = false;
    isDragging = false;
  });
}

function getDistance(touch1, touch2) {
  const dx = touch1.clientX - touch2.clientX;
  const dy = touch1.clientY - touch2.clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

function updateMenuSelection() {
  if (!isMenuOpen) return;

  const stylesList = document.getElementById('menu-styles-list');
  if (!stylesList) return;

  const items = stylesList.querySelectorAll('.style-item');
  if (items.length === 0) return;

  items.forEach(item => {
    item.classList.remove('menu-selected');
  });

  currentMenuIndex = Math.max(0, Math.min(currentMenuIndex, items.length - 1));

  const currentItem = items[currentMenuIndex];
  if (currentItem) {
    currentItem.classList.add('menu-selected');
    
    currentItem.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    });
    
    // Show category hint with individually clickable categories
    const presetIndex = parseInt(currentItem.dataset.index);
    const preset = CAMERA_PRESETS[presetIndex];
    const categoryHint = document.getElementById('menu-category-hint');
    if (categoryHint && preset && preset.category) {
      // Clear previous content
      categoryHint.innerHTML = '';
      categoryHint.style.display = 'block';
      
      // Create a clickable span for each category
      preset.category.forEach((cat, index) => {
        const categorySpan = document.createElement('span');
        categorySpan.textContent = cat;
        categorySpan.style.cursor = 'pointer';
        categorySpan.style.padding = '0 2px';
        
        // Highlight if this category is currently being filtered
        if (mainMenuFilterByCategory === cat) {
          categorySpan.style.textDecoration = 'underline';
          categorySpan.style.fontWeight = 'bold';
        }
        
        // Make each category clickable
        categorySpan.onclick = (e) => {
          e.stopPropagation();
          // If already filtering by this category, clear the filter
          if (mainMenuFilterByCategory === cat) {
            mainMenuFilterByCategory = '';
          } else {
            // Filter by this category
            mainMenuFilterByCategory = cat;
          }
          currentMenuIndex = 0;
          populateStylesList();
        };
        
        categoryHint.appendChild(categorySpan);
        
        // Add comma separator if not the last category
        if (index < preset.category.length - 1) {
          const comma = document.createElement('span');
          comma.textContent = ', ';
          categoryHint.appendChild(comma);
        }
      });
    } else if (categoryHint) {
      categoryHint.style.display = 'none';
    }
  }
}

let currentSubmenuIndex = 0;

function scrollSubmenuUp(submenuId, itemSelector) {
  const submenu = document.getElementById(submenuId);
  if (!submenu || submenu.style.display !== 'flex') return;
  
  const items = submenu.querySelectorAll(itemSelector);
  if (items.length === 0) return;
  
  currentSubmenuIndex = (currentSubmenuIndex - 1 + items.length) % items.length;
  updateSubmenuSelection(submenu, items);
}

function scrollSubmenuDown(submenuId, itemSelector) {
  const submenu = document.getElementById(submenuId);
  if (!submenu || submenu.style.display !== 'flex') return;
  
  const items = submenu.querySelectorAll(itemSelector);
  if (items.length === 0) return;
  
  currentSubmenuIndex = (currentSubmenuIndex + 1) % items.length;
  updateSubmenuSelection(submenu, items);
}

function updateSubmenuSelection(submenu, items) {
  items.forEach(item => item.classList.remove('menu-selected'));
  
  if (currentSubmenuIndex >= 0 && currentSubmenuIndex < items.length) {
    const currentItem = items[currentSubmenuIndex];
    currentItem.classList.add('menu-selected');
    currentItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function resetSubmenuIndex() {
  currentSubmenuIndex = 0;
}

function scrollMenuUp() {
  if (!isMenuOpen || !menuScrollEnabled) return;
  
  const stylesList = document.getElementById('menu-styles-list');
  if (!stylesList) return;

  const items = stylesList.querySelectorAll('.style-item');
  if (items.length === 0) return;

  currentMenuIndex = Math.max(0, currentMenuIndex - 1);
  updateMenuSelection();
}

function scrollMenuDown() {
  if (!isMenuOpen || !menuScrollEnabled) return;
  
  const stylesList = document.getElementById('menu-styles-list');
  if (!stylesList) return;

  const items = stylesList.querySelectorAll('.style-item');
  if (items.length === 0) return;

  currentMenuIndex = Math.min(items.length - 1, currentMenuIndex + 1);
  updateMenuSelection();
}

function selectCurrentMenuItem() {
  if (!isMenuOpen || !menuScrollEnabled) return;

  const stylesList = document.getElementById('menu-styles-list');
  if (!stylesList) return;

  const items = stylesList.querySelectorAll('.style-item');
  if (items.length === 0 || currentMenuIndex >= items.length) return;

  const currentItem = items[currentMenuIndex];
  if (currentItem) {
    const styleNameElement = currentItem.querySelector('.style-name');
    if (styleNameElement) {
      const sortedPresets = getSortedPresets();
      const selectedPreset = sortedPresets[currentMenuIndex];
      if (selectedPreset) {
        const originalIndex = CAMERA_PRESETS.findIndex(p => p === selectedPreset);
        if (originalIndex !== -1) {
          currentPresetIndex = originalIndex;
          updatePresetDisplay();
          hideUnifiedMenu();
        }
      }
    }
  }
}

// Load saved styles
function loadStyles() {
    const storedStyles = localStorage.getItem(STORAGE_KEY);
    if (storedStyles) {
        try {
            const loadedStyles = JSON.parse(storedStyles);
            
            // Only add custom presets (those with internal: false)
            const customPresets = loadedStyles.filter(p => p.internal === false);
            CAMERA_PRESETS.push(...customPresets);
        } catch (e) {
            console.error("Error loading styles:", e);
        }
    }
    
    const favoritesJson = localStorage.getItem(FAVORITE_STYLES_KEY);
    if (favoritesJson) {
        try {
            favoriteStyles = JSON.parse(favoritesJson);
            if (!Array.isArray(favoriteStyles)) {
                favoriteStyles = []; 
            }
        } catch (e) {
            console.error("Error parsing favorite styles:", e);
            favoriteStyles = []; 
        }
    }
    
    loadLastUsedStyle(); 
    
    loadResolution();
    loadWhiteBalanceSettings();
    
    // Load visible presets
    const visibleJson = localStorage.getItem(VISIBLE_PRESETS_KEY);
    if (visibleJson) {
        try {
            visiblePresets = JSON.parse(visibleJson);
            if (!Array.isArray(visiblePresets)) {
                visiblePresets = [];
            }
        } catch (e) {
            console.error("Error parsing visible presets:", e);
            visiblePresets = [];
        }
    }
    
    // If no visible presets saved, show all by default
    if (visiblePresets.length === 0) {
        visiblePresets = CAMERA_PRESETS.map(p => p.name);
        saveVisiblePresets();
    }
}

// Save visible presets to localStorage
function saveVisiblePresets() {
    try {
        localStorage.setItem(VISIBLE_PRESETS_KEY, JSON.stringify(visiblePresets));
    } catch (err) {
        console.error('Error saving visible presets:', err);
    }
}

// Get only visible presets
function getVisiblePresets() {
    return CAMERA_PRESETS.filter(preset => visiblePresets.includes(preset.name));
}

// Save resolution setting
function saveResolution(index) {
  try {
    localStorage.setItem(RESOLUTION_STORAGE_KEY, index.toString());
  } catch (err) {
    console.error('Error saving resolution:', err);
  }
}

// Load white balance settings
function loadWhiteBalanceSettings() {
  const saved = localStorage.getItem(WHITE_BALANCE_STORAGE_KEY);
  if (saved !== null) {
    currentWhiteBalanceIndex = parseInt(saved);
  }
}

// Save white balance settings
function saveWhiteBalanceSettings() {
  localStorage.setItem(WHITE_BALANCE_STORAGE_KEY, currentWhiteBalanceIndex.toString());
}

// Apply white balance filter
function applyWhiteBalance() {
  if (!video) return;
  
  // Small delay to ensure video is ready
  setTimeout(() => {
    const mode = WHITE_BALANCE_MODES[currentWhiteBalanceIndex];
    
    // Remove existing filter
    video.style.filter = '';
    
    // Apply CSS filter based on mode
    switch(mode.value) {
      case 'daylight':
        video.style.filter = 'brightness(1.05) saturate(1.1)';
        break;
      case 'cloudy':
        video.style.filter = 'brightness(1.1) saturate(0.95) sepia(0.05)';
        break;
      case 'tungsten':
        video.style.filter = 'brightness(0.95) saturate(1.15) hue-rotate(-10deg)';
        break;
      case 'fluorescent':
        video.style.filter = 'brightness(1.02) saturate(1.05) hue-rotate(5deg)';
        break;
      case 'candlelight':
        video.style.filter = 'brightness(0.85) saturate(1.3) sepia(0.15) hue-rotate(-15deg)';
        break;
      case 'moonlight':
        video.style.filter = 'brightness(0.7) saturate(0.8) hue-rotate(15deg) contrast(1.1)';
        break;
      case 'auto':
      default:
        video.style.filter = '';
        break;
    }
  }, 50);
}

function applyWhiteBalanceToCanvas(ctx, width, height) {
  const mode = WHITE_BALANCE_MODES[currentWhiteBalanceIndex];
  
  if (mode.value === 'auto') {
    return; // No adjustment needed
  }
  
  // Get image data
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  
  // Define adjustments for each mode
  let brightness = 1.0;
  let saturation = 1.0;
  let warmth = 0; // Positive = warmer (red/yellow), Negative = cooler (blue)
  let contrast = 1.0;
  
  switch(mode.value) {
    case 'daylight':
      brightness = 1.05;
      saturation = 1.1;
      warmth = 5;
      break;
    case 'cloudy':
      brightness = 1.1;
      saturation = 0.95;
      warmth = 10;
      break;
    case 'tungsten':
      brightness = 0.95;
      saturation = 1.15;
      warmth = -20;
      break;
    case 'fluorescent':
      brightness = 1.02;
      saturation = 1.05;
      warmth = -10;
      break;
    case 'candlelight':
      brightness = 0.85;
      saturation = 1.3;
      warmth = 25;
      contrast = 0.95;
      break;
    case 'moonlight':
      brightness = 0.7;
      saturation = 0.8;
      warmth = -15;
      contrast = 1.1;
      break;
  }
  
  // Apply adjustments to each pixel
  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];
    
    // Apply warmth (shift towards red/yellow or blue)
    if (warmth > 0) {
      r = Math.min(255, r + warmth);
      g = Math.min(255, g + warmth * 0.5);
    } else if (warmth < 0) {
      b = Math.min(255, b - warmth);
    }
    
    // Apply brightness
    r *= brightness;
    g *= brightness;
    b *= brightness;
    
    // Apply saturation
    const gray = 0.2989 * r + 0.5870 * g + 0.1140 * b;
    r = gray + saturation * (r - gray);
    g = gray + saturation * (g - gray);
    b = gray + saturation * (b - gray);
    
    // Apply contrast
    r = ((r / 255 - 0.5) * contrast + 0.5) * 255;
    g = ((g / 255 - 0.5) * contrast + 0.5) * 255;
    b = ((b / 255 - 0.5) * contrast + 0.5) * 255;
    
    // Clamp values
    data[i] = Math.max(0, Math.min(255, r));
    data[i + 1] = Math.max(0, Math.min(255, g));
    data[i + 2] = Math.max(0, Math.min(255, b));
  }
  
  // Put modified image data back
  ctx.putImageData(imageData, 0, 0);
}

function showWhiteBalanceSubmenu() {
  document.getElementById('settings-submenu').style.display = 'none';
  
  const submenu = document.getElementById('white-balance-submenu');
  const list = document.getElementById('white-balance-list');
  list.innerHTML = '';
  
  WHITE_BALANCE_MODES.forEach((mode, index) => {
    const item = document.createElement('div');
    item.className = 'resolution-item';
    if (index === currentWhiteBalanceIndex) {
      item.classList.add('active');
    }
    
    const name = document.createElement('span');
    name.className = 'resolution-name';
    name.textContent = mode.name;
    
    item.appendChild(name);
    
    item.onclick = () => {
      currentWhiteBalanceIndex = index;
      saveWhiteBalanceSettings();
      document.getElementById('current-white-balance-display').textContent = mode.name;
      if (stream) {
        applyWhiteBalance();
      }
      hideWhiteBalanceSubmenu();
    };
    
    list.appendChild(item);
  });
  
  submenu.style.display = 'flex';
}

function hideWhiteBalanceSubmenu() {
  document.getElementById('white-balance-submenu').style.display = 'none';
  document.getElementById('settings-submenu').style.display = 'flex';
}

// Load resolution setting
function loadResolution() {
  try {
    const saved = localStorage.getItem(RESOLUTION_STORAGE_KEY);
    if (saved !== null) {
      const index = parseInt(saved, 10);
      if (index >= 0 && index < RESOLUTION_PRESETS.length) {
        currentResolutionIndex = index;
      }
    }
  } catch (err) {
    console.error('Error loading resolution:', err);
  }
}

function getStylesLists() {
    const presets = CAMERA_PRESETS.filter(p => visiblePresets.includes(p.name));
    
    const sortedAll = presets.slice().sort((a, b) => a.name.localeCompare(b.name));
    
    const favorites = sortedAll.filter(p => isFavoriteStyle(p.name));
    
    const regular = sortedAll.filter(p => !isFavoriteStyle(p.name));

    return { favorites, regular };
}

function getSortedPresets() {
    const { favorites, regular } = getStylesLists();
    // Filter to only visible presets
    const visibleFavorites = favorites.filter(p => visiblePresets.includes(p.name));
    const visibleRegular = regular.filter(p => visiblePresets.includes(p.name));
    return [...visibleFavorites, ...visibleRegular];
}

// Get the current preset's position in the sorted array
function getCurrentSortedIndex() {
  const sortedPresets = getSortedPresets();
  const currentPreset = CAMERA_PRESETS[currentPresetIndex];
  return sortedPresets.findIndex(p => p === currentPreset);
}

// Get original index from sorted index
function getOriginalIndexFromSorted(sortedIndex) {
  const sortedPresets = getSortedPresets();
  const preset = sortedPresets[sortedIndex];
  return CAMERA_PRESETS.findIndex(p => p === preset);
}

// Save styles to localStorage
function saveStyles() {
  try {
    // Only save custom presets (internal: false), not the 360 defaults
    const customPresets = CAMERA_PRESETS.filter(p => p.internal === false);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customPresets));
  } catch (err) {
    console.error('Error saving styles:', err);
  }
}

function createStyleMenuItem(preset) {
    const originalIndex = CAMERA_PRESETS.findIndex(p => p === preset);
    
    const item = document.createElement('div');
    item.className = 'style-item';
    
    if (originalIndex === currentPresetIndex) {
        item.classList.add('active');
    }
    
    const name = document.createElement('span');
    name.className = 'style-name';
    name.textContent = preset.name;
    
    const favBtn = document.createElement('button');
    favBtn.className = 'style-favorite';
    favBtn.textContent = isFavoriteStyle(preset.name) ? '⭐' : '☆'; 
    favBtn.onclick = (e) => {
        e.stopPropagation();
        saveFavoriteStyle(preset.name); 
    };
    
    const editBtn = document.createElement('button');
    editBtn.className = 'style-edit';
    
    // Check if this is a user-created preset (has internal: false explicitly set)
    const isUserPreset = (preset.internal === false);
    
    if (isUserPreset) {
        editBtn.textContent = 'Builder';
        editBtn.onclick = (e) => {
            e.stopPropagation();
            editPresetInBuilder(originalIndex);
        };
    } else {
        editBtn.textContent = 'Edit';
        editBtn.onclick = (e) => {
            e.stopPropagation();
            editStyle(originalIndex);
        };
    }
         
    item.appendChild(favBtn);
    item.appendChild(name);
    item.appendChild(editBtn);
    
    item.onclick = () => {
        currentPresetIndex = originalIndex;
        updatePresetDisplay();
        hideUnifiedMenu();
    };
    
    return item;
}

// Save favorite style
function saveFavoriteStyle(styleName) {
    const index = favoriteStyles.indexOf(styleName);
    
    if (index > -1) {
        favoriteStyles.splice(index, 1);
    } else {
        favoriteStyles.push(styleName);
    }

    localStorage.setItem(FAVORITE_STYLES_KEY, JSON.stringify(favoriteStyles));
    
    // Save current scroll position before repopulating
    const scrollContainer = document.querySelector('.styles-menu-scroll-container');
    const scrollPosition = scrollContainer ? scrollContainer.scrollTop : 0;
    
    populateStylesList();
    
    // Restore scroll position after repopulating
    if (scrollContainer) {
        scrollContainer.scrollTop = scrollPosition;
    }
}

function loadLastUsedStyle() {
    const savedIndex = localStorage.getItem(LAST_USED_PRESET_KEY);
    
    if (savedIndex !== null) {
        try {
            const index = parseInt(savedIndex, 10);
            if (index >= 0 && index < CAMERA_PRESETS.length) {
                currentPresetIndex = index;
            }
        } catch (err) {
            console.error('Error loading last used style:', err);
        }
    }
}

// Check if style is favorited
function isFavoriteStyle(styleName) {
    return favoriteStyles.includes(styleName);
}

// Get random preset index from favorites (or all presets if no favorites)
function getRandomPresetIndex() {
  const favoritedPresets = CAMERA_PRESETS.filter(p => 
    !p.internal && isFavoriteStyle(p.name)
  );
  
  if (favoritedPresets.length > 0) {
    const randomPreset = favoritedPresets[Math.floor(Math.random() * favoritedPresets.length)];
    return CAMERA_PRESETS.findIndex(p => p === randomPreset);
  }
  
  const allPresets = CAMERA_PRESETS.filter(p => !p.internal);
  if (allPresets.length === 0) return 0;
  
  const randomPreset = allPresets[Math.floor(Math.random() * allPresets.length)];
  return CAMERA_PRESETS.findIndex(p => p === randomPreset);
}

function toggleMotionDetection() {
  isMotionDetectionMode = !isMotionDetectionMode;
  const btn = document.getElementById('motion-toggle');
  
  if (isMotionDetectionMode) {
    btn.classList.add('active');
    btn.title = 'Motion Detection: ON';
    showStatus('Motion Detection enabled - Press side button to start', 3000);
  } else {
    btn.classList.remove('active');
    btn.title = 'Motion Detection: OFF';
    stopMotionDetection();
    
    // Clear any active countdown
    if (motionStartInterval) {
      clearInterval(motionStartInterval);
      motionStartInterval = null;
    }
    
    // Hide countdown display
    const countdownElement = document.getElementById('timer-countdown');
    if (countdownElement) {
      countdownElement.style.display = 'none';
      countdownElement.classList.remove('countdown-fade-in', 'countdown-fade-out');
    }

    // Restore camera button visibility
    const cameraButton = document.getElementById('camera-button');
    if (cameraButton && availableCameras.length > 1) {
      cameraButton.style.display = 'flex';
    }
    
    showStatus('Motion Detection OFF', 2000);
  }
}

function getStartDelaySliderValue() {
  for (let key in MOTION_START_DELAYS) {
    if (MOTION_START_DELAYS[key].seconds === motionStartDelay) {
      return parseInt(key);
    }
  }
  return 1; // Default to 3s
}

function showMotionSubmenu() {
  document.getElementById('settings-submenu').style.display = 'none';
  document.getElementById('motion-submenu').style.display = 'flex';
  isMotionSubmenuOpen = true;
  isSettingsSubmenuOpen = false;
}

function hideMotionSubmenu() {
  document.getElementById('motion-submenu').style.display = 'none';
  isMotionSubmenuOpen = false;
  showSettingsSubmenu();
}

function showVisiblePresetsSubmenu() {
  document.getElementById('settings-submenu').style.display = 'none';
  document.getElementById('visible-presets-submenu').style.display = 'flex';
  isMenuOpen = false; // ADD THIS LINE
  isVisiblePresetsSubmenuOpen = true;
  visiblePresetsScrollEnabled = true;
  isSettingsSubmenuOpen = false;
  currentVisiblePresetsIndex = 0;
  visiblePresetsFilterText = '';
  document.getElementById('visible-presets-filter').value = '';
  populateVisiblePresetsList();
  updateVisiblePresetsDisplay();
}

function hideVisiblePresetsSubmenu() {
  document.getElementById('visible-presets-submenu').style.display = 'none';
  isVisiblePresetsSubmenuOpen = false;
  visiblePresetsScrollEnabled = false;
  currentVisiblePresetsIndex = 0;
  visiblePresetsFilterText = '';
  visiblePresetsFilterByCategory = ''; // Clear category filter
  // Hide category hint
  const categoryHint = document.getElementById('visible-presets-category-hint');
  if (categoryHint) {
    categoryHint.style.display = 'none';
  }
  showSettingsSubmenu();
}

// Show Preset Builder submenu
function showPresetBuilderSubmenu() {
  document.getElementById('settings-submenu').style.display = 'none';
  document.getElementById('preset-builder-submenu').style.display = 'flex';
  
  isMenuOpen = false;
  isSettingsSubmenuOpen = false;
  isPresetBuilderSubmenuOpen = true;
  
  // Clear the form
  clearPresetBuilderForm();
}

function hidePresetBuilderSubmenu() {
  document.getElementById('preset-builder-submenu').style.display = 'none';
  isPresetBuilderSubmenuOpen = false;
  editingPresetBuilderIndex = -1;
  
  // Hide delete button when closing
  const deleteButton = document.getElementById('preset-builder-delete');
  if (deleteButton) deleteButton.style.display = 'none';
  
  showSettingsSubmenu();
}

// Clear Preset Builder form
function clearPresetBuilderForm() {
  editingPresetBuilderIndex = -1;
  document.getElementById('preset-builder-name').value = '';
  document.getElementById('preset-builder-category').value = '';
  document.getElementById('preset-builder-template').value = '';
  document.getElementById('preset-builder-prompt').value = '';
  
  // Show clear button and hide delete button when creating new preset
  const deleteButton = document.getElementById('preset-builder-delete');
  if (deleteButton) deleteButton.style.display = 'none';
  
  const clearButton = document.getElementById('preset-builder-clear');
  if (clearButton) clearButton.style.display = 'flex';
}

// Edit preset in builder
function editPresetInBuilder(index) {
  const preset = CAMERA_PRESETS[index];
  
  // Show the submenu first
  showPresetBuilderSubmenu();
  
  // Set the editing index AFTER showing (which clears the form)
  editingPresetBuilderIndex = index;
  
 // Use setTimeout to ensure DOM is ready before populating
  setTimeout(() => {
    const nameInput = document.getElementById('preset-builder-name');
    const categoryInput = document.getElementById('preset-builder-category');
    const promptTextarea = document.getElementById('preset-builder-prompt');
    const templateSelect = document.getElementById('preset-builder-template');
    const deleteButton = document.getElementById('preset-builder-delete');
    const clearButton = document.getElementById('preset-builder-clear');
    
    if (nameInput) nameInput.value = preset.name;
    if (categoryInput) categoryInput.value = preset.category ? preset.category.join(', ') : '';
    if (promptTextarea) promptTextarea.value = preset.message;
    if (templateSelect) templateSelect.value = '';
    
    // Show delete button and hide clear button when editing existing preset
    if (deleteButton) {
      deleteButton.style.display = 'flex';
    }
    if (clearButton) {
      clearButton.style.display = 'none';
    }
  }, 100);
}

// Handle template selection
function handleTemplateSelection() {
  const templateSelect = document.getElementById('preset-builder-template');
  const promptTextarea = document.getElementById('preset-builder-prompt');
  const selectedTemplate = templateSelect.value;
  
  if (selectedTemplate && PRESET_TEMPLATES[selectedTemplate] !== undefined) {
    promptTextarea.value = PRESET_TEMPLATES[selectedTemplate];
  }
}

// Get all unique categories from existing presets
function getAllCategories() {
  const categoriesSet = new Set();
  CAMERA_PRESETS.forEach(preset => {
    if (preset.category && Array.isArray(preset.category)) {
      preset.category.forEach(cat => {
        categoriesSet.add(cat.toUpperCase());
      });
    }
  });
  return Array.from(categoriesSet).sort();
}

// Save custom preset
function saveCustomPreset() {
  const name = document.getElementById('preset-builder-name').value.trim();
  const categoryInput = document.getElementById('preset-builder-category').value.trim();
  const prompt = document.getElementById('preset-builder-prompt').value.trim();
  
  // Validation
  if (!name) {
    alert('Please enter a preset name');
    return;
  }
  
  if (!prompt) {
    alert('Please enter a prompt');
    return;
  }
  
// Parse categories
  const categories = categoryInput 
    ? categoryInput.split(',').map(cat => cat.trim().toUpperCase()).filter(cat => cat.length > 0)
    : ['CUSTOM'];
  
  // Check if we're editing an existing preset
  if (editingPresetBuilderIndex >= 0) {
    // Editing mode
    const oldName = CAMERA_PRESETS[editingPresetBuilderIndex].name;
    CAMERA_PRESETS[editingPresetBuilderIndex] = {
      name: name.toUpperCase(),
      category: categories,
      message: prompt,
      internal: false
    };
    
    // If name changed, update visiblePresets array
    if (oldName !== name.toUpperCase()) {
      const visIndex = visiblePresets.indexOf(oldName);
      if (visIndex > -1) {
        visiblePresets[visIndex] = name.toUpperCase();
      }
    }
  } else {
    // Creating new preset - check if name already exists
    const existingIndex = CAMERA_PRESETS.findIndex(p => p.name.toUpperCase() === name.toUpperCase());
    if (existingIndex !== -1) {
      if (!confirm(`A preset named "${name}" already exists. Do you want to overwrite it?`)) {
        return;
      }
      // Remove the existing preset
      CAMERA_PRESETS.splice(existingIndex, 1);
    }
    
    // Create new preset object
    const newPreset = {
      name: name.toUpperCase(),
      category: categories,
      message: prompt,
      internal: false
    };
    
    // Add to presets array
    CAMERA_PRESETS.push(newPreset);
    
    // Add to visible presets (always make new presets visible by default)
    if (!visiblePresets.includes(newPreset.name)) {
      visiblePresets.push(newPreset.name);
    }
  }
  
  // Save to localStorage (save visible presets BEFORE custom presets)
  saveVisiblePresets();
  saveStyles();
  
  // Show success message
  alert(editingPresetBuilderIndex >= 0 ? `Preset "${name}" updated!` : `Preset "${name}" saved successfully!`);
  
  // Clear form and go back
  clearPresetBuilderForm();
  hidePresetBuilderSubmenu();
  
  // Refresh menu if it's open
  if (isMenuOpen) {
    populateStylesList();
  }
}

// Delete custom preset from builder
function deleteCustomPreset() {
  if (editingPresetBuilderIndex < 0) {
    alert('No preset selected for deletion');
    return;
  }
  
  const preset = CAMERA_PRESETS[editingPresetBuilderIndex];
  
  // Verify this is a user-created preset
  if (preset.internal !== false) {
    alert('Cannot delete built-in presets');
    return;
  }
  
  if (!confirm(`Delete preset "${preset.name}"? This cannot be undone.`)) {
    return;
  }
  
  // Remove from CAMERA_PRESETS
  CAMERA_PRESETS.splice(editingPresetBuilderIndex, 1);
  
  // Remove from visible presets
  const visIndex = visiblePresets.indexOf(preset.name);
  if (visIndex > -1) {
    visiblePresets.splice(visIndex, 1);
    saveVisiblePresets();
  }
  
  // Adjust current preset index if needed
  if (currentPresetIndex >= CAMERA_PRESETS.length) {
    currentPresetIndex = CAMERA_PRESETS.length - 1;
  }
  
  // Save changes
  saveStyles();
  
  alert(`Preset "${preset.name}" deleted successfully!`);
  
  // Clear form and go back
  clearPresetBuilderForm();
  hidePresetBuilderSubmenu();
  
  // Refresh menu if open
  if (isMenuOpen) {
    populateStylesList();
  }
}

function populateVisiblePresetsList() {
  const list = document.getElementById('visible-presets-list');
  list.innerHTML = '';
  
  const allPresets = CAMERA_PRESETS.filter(p => !p.internal);
  const filtered = allPresets.filter(preset => {
    // First apply text search filter
    if (visiblePresetsFilterText) {
      const searchText = visiblePresetsFilterText.toLowerCase();
      const categoryMatch = preset.category && preset.category.some(cat => cat.toLowerCase().includes(searchText));
      const textMatch = preset.name.toLowerCase().includes(searchText) || categoryMatch;
      if (!textMatch) return false;
    }
    
    // Then apply category filter if active (filter by single category)
    if (visiblePresetsFilterByCategory) {
      return preset.category && preset.category.includes(visiblePresetsFilterByCategory);
    }
    
    return true;
  });
  
  const sorted = filtered.sort((a, b) => a.name.localeCompare(b.name));
  
  const fragment = document.createDocumentFragment();
  
  sorted.forEach(preset => {
    const item = document.createElement('div');
    item.className = 'style-item';
    item.dataset.presetName = preset.name;
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'master-prompt-checkbox';
    checkbox.checked = visiblePresets.includes(preset.name);
    checkbox.style.marginRight = '3vw';
    
    const name = document.createElement('span');
    name.className = 'style-name';
    name.textContent = preset.name;
    
    item.appendChild(checkbox);
    item.appendChild(name);
    
    checkbox.onclick = (e) => {
      e.stopPropagation();
      toggleVisiblePreset(preset.name, checkbox.checked);
    };
    
    item.onclick = () => {
      checkbox.checked = !checkbox.checked;
      toggleVisiblePreset(preset.name, checkbox.checked);
    };
    
    fragment.appendChild(item);
  });
  
  list.appendChild(fragment);
  
  const countElement = document.getElementById('visible-presets-count');
  if (countElement) {
    const visibleCount = sorted.filter(p => visiblePresets.includes(p.name)).length;
    countElement.textContent = visibleCount;
  }
// Update selection after render
  setTimeout(() => {
    updateVisiblePresetsSelection();
  }, 50);
}

function toggleVisiblePreset(presetName, isVisible) {
  const index = visiblePresets.indexOf(presetName);
  
  if (isVisible && index === -1) {
    visiblePresets.push(presetName);
  } else if (!isVisible && index > -1) {
    visiblePresets.splice(index, 1);
  }
  
  saveVisiblePresets();
  updateVisiblePresetsDisplay();
  populateVisiblePresetsList(); // Update the current submenu list
  
  // Always update main menu count (even if not open)
  const stylesCountElement = document.getElementById('styles-count');
  if (stylesCountElement) {
    const { favorites, regular } = getStylesLists();
    const totalVisible = favorites.length + regular.length;
    stylesCountElement.textContent = totalVisible;
  }
  
  // Refresh main menu if open
  if (isMenuOpen) {
    populateStylesList();
  }
}

function updateVisiblePresetsDisplay() {
  const display = document.getElementById('current-visible-presets-display');
  if (display) {
    const total = CAMERA_PRESETS.filter(p => !p.internal).length;
    const visible = visiblePresets.length;
    display.textContent = visible === total ? 'All Visible' : `${visible} of ${total}`;
  }
}

function scrollVisiblePresetsUp() {
  if (!isVisiblePresetsSubmenuOpen || !visiblePresetsScrollEnabled) return;
  
  const visiblePresetsList = document.getElementById('visible-presets-list');
  if (!visiblePresetsList) return;

  const items = visiblePresetsList.querySelectorAll('.style-item');
  if (items.length === 0) return;

  currentVisiblePresetsIndex = Math.max(0, currentVisiblePresetsIndex - 1);
  updateVisiblePresetsSelection();
}

function scrollVisiblePresetsDown() {
  if (!isVisiblePresetsSubmenuOpen || !visiblePresetsScrollEnabled) return;
  
  const visiblePresetsList = document.getElementById('visible-presets-list');
  if (!visiblePresetsList) return;

  const items = visiblePresetsList.querySelectorAll('.style-item');
  if (items.length === 0) return;

  currentVisiblePresetsIndex = Math.min(items.length - 1, currentVisiblePresetsIndex + 1);
  updateVisiblePresetsSelection();
}

function updateVisiblePresetsSelection() {
  if (!isVisiblePresetsSubmenuOpen) return;

  const visiblePresetsList = document.getElementById('visible-presets-list');
  if (!visiblePresetsList) return;

  const items = visiblePresetsList.querySelectorAll('.style-item');
  if (items.length === 0) return;

  items.forEach(item => {
    item.classList.remove('menu-selected');
  });

  currentVisiblePresetsIndex = Math.max(0, Math.min(currentVisiblePresetsIndex, items.length - 1));

  const currentItem = items[currentVisiblePresetsIndex];
  if (currentItem) {
    currentItem.classList.add('menu-selected');
    
    currentItem.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    });
    
    // Show category hint with individually clickable categories
    const presetName = currentItem.dataset.presetName;
    const preset = CAMERA_PRESETS.find(p => p.name === presetName);
    const categoryHint = document.getElementById('visible-presets-category-hint');
    if (categoryHint && preset && preset.category) {
      // Clear previous content
      categoryHint.innerHTML = '';
      categoryHint.style.display = 'block';
      
      // Create a clickable span for each category
      preset.category.forEach((cat, index) => {
        const categorySpan = document.createElement('span');
        categorySpan.textContent = cat;
        categorySpan.style.cursor = 'pointer';
        categorySpan.style.padding = '0 2px';
        
        // Highlight if this category is currently being filtered
        if (visiblePresetsFilterByCategory === cat) {
          categorySpan.style.textDecoration = 'underline';
          categorySpan.style.fontWeight = 'bold';
        }
        
        // Make each category clickable
        categorySpan.onclick = (e) => {
          e.stopPropagation();
          // If already filtering by this category, clear the filter
          if (visiblePresetsFilterByCategory === cat) {
            visiblePresetsFilterByCategory = '';
          } else {
            // Filter by this category
            visiblePresetsFilterByCategory = cat;
          }
          currentVisiblePresetsIndex = 0;
          populateVisiblePresetsList();
        };
        
        categoryHint.appendChild(categorySpan);
        
        // Add comma separator if not the last category
        if (index < preset.category.length - 1) {
          const comma = document.createElement('span');
          comma.textContent = ', ';
          categoryHint.appendChild(comma);
        }
      });
    } else if (categoryHint) {
      categoryHint.style.display = 'none';
    }
  }
}

function selectCurrentVisiblePresetsItem() {
  if (!isVisiblePresetsSubmenuOpen || !visiblePresetsScrollEnabled) return;

  const visiblePresetsList = document.getElementById('visible-presets-list');
  if (!visiblePresetsList) return;

  const items = visiblePresetsList.querySelectorAll('.style-item');
  if (items.length === 0 || currentVisiblePresetsIndex >= items.length) return;

  const currentItem = items[currentVisiblePresetsIndex];
  if (currentItem) {
    currentItem.click();
  }
}

function updateMotionDisplay() {
  const sensitivityLabels = ['Very Low', 'Low', 'Medium', 'High', 'Very High'];
  const currentMotionDisplay = document.getElementById('current-motion-display');
  if (currentMotionDisplay) {
    const sensitivityLevel = Math.floor((50 - motionThreshold) / 10) + 1;
    const clampedLevel = Math.max(1, Math.min(5, sensitivityLevel));
    currentMotionDisplay.textContent = `Sensitivity: ${sensitivityLabels[clampedLevel - 1]}`;
  }
}

function saveMotionSettings() {
  const settings = {
    motionThreshold,
    motionPixelThreshold,
    motionContinuousEnabled,
    motionCooldown,
    motionStartDelay
  };
  try {
    localStorage.setItem(MOTION_SETTINGS_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save motion settings:', err);
  }
}

function loadMotionSettings() {
  try {
    const saved = localStorage.getItem(MOTION_SETTINGS_KEY);
    if (saved) {
      const settings = JSON.parse(saved);
      motionThreshold = settings.motionThreshold || 30;
      motionPixelThreshold = settings.motionPixelThreshold || 0.1;
      motionContinuousEnabled = settings.motionContinuousEnabled !== undefined ? settings.motionContinuousEnabled : true;
      motionCooldown = settings.motionCooldown || 2;
      motionStartDelay = settings.motionStartDelay || 3;
    }
    
    // Always update UI elements whether saved settings exist or not
    const sensitivitySlider = document.getElementById('motion-sensitivity-slider');
    if (sensitivitySlider) {
      const sliderValue = Math.floor((50 - motionThreshold) / 10) + 1;
      sensitivitySlider.value = Math.max(1, Math.min(5, sliderValue));
    }
    
    const continuousCheckbox = document.getElementById('motion-continuous-enabled');
    if (continuousCheckbox) {
      continuousCheckbox.checked = motionContinuousEnabled;
    }
      
      const cooldownSlider = document.getElementById('motion-cooldown-slider');
      if (cooldownSlider) {
        cooldownSlider.value = motionCooldown;
      }

      const startDelaySlider = document.getElementById('motion-start-delay-slider');
      const startDelayValue = document.getElementById('motion-start-delay-value');
      if (startDelaySlider && startDelayValue) {
        const sliderValue = getStartDelaySliderValue();
        startDelaySlider.value = sliderValue;
        startDelayValue.textContent = MOTION_START_DELAYS[sliderValue].label;
      }      

      updateMotionDisplay();
  } catch (err) {
    console.error('Failed to load motion settings:', err);
  }
}

function toggleNoMagicMode() {
  noMagicMode = !noMagicMode;
  
  const statusElement = document.getElementById('no-magic-status');
  if (statusElement) {
    statusElement.textContent = noMagicMode ? 'Enabled' : 'Disabled';
    statusElement.style.color = noMagicMode ? '#4CAF50' : '';
    statusElement.style.fontWeight = noMagicMode ? '600' : '';
  }
  
  try {
    localStorage.setItem(NO_MAGIC_MODE_KEY, JSON.stringify(noMagicMode));
  } catch (err) {
    console.error('Failed to save No Magic mode:', err);
  }
  
  if (noMagicMode) {
    showStatus('No Magic Mode ON - Camera only', 2000);
  } else {
    showStatus('No Magic Mode OFF - AI prompts enabled', 2000);
  }
}

function loadNoMagicMode() {
  try {
    const saved = localStorage.getItem(NO_MAGIC_MODE_KEY);
    if (saved !== null) {
      noMagicMode = JSON.parse(saved);
      
      const statusElement = document.getElementById('no-magic-status');
      if (statusElement) {
        statusElement.textContent = noMagicMode ? 'Enabled' : 'Disabled';
        statusElement.style.color = noMagicMode ? '#4CAF50' : '';
        statusElement.style.fontWeight = noMagicMode ? '600' : '';
      }
    }
  } catch (err) {
    console.error('Failed to load No Magic mode:', err);
  }
}

function showTutorialSubmenu() {
  document.getElementById('settings-submenu').style.display = 'none';
  document.getElementById('tutorial-submenu').style.display = 'flex';

  isMenuOpen = false; // ADD THIS LINE  
  isTutorialOpen = true;
  tutorialScrollEnabled = true; // Enable scrolling immediately
  isTutorialSubmenuOpen = true;
  currentTutorialGlossaryIndex = 0;
  isSettingsSubmenuOpen = false;
  
  // Show glossary by default
  showTutorialGlossary();
}

function hideTutorialSubmenu() {
  document.getElementById('tutorial-submenu').style.display = 'none';
  isTutorialOpen = false;
  tutorialScrollEnabled = true;
  isTutorialSubmenuOpen = false;
  showSettingsSubmenu();
}

function showTutorialSection(sectionId) {
  const glossary = document.getElementById('tutorial-glossary');
  const contentArea = document.getElementById('tutorial-content-area');
  const targetSection = document.getElementById('section-' + sectionId);
  const backToGlossaryBtn = document.getElementById('back-to-glossary');
  
  if (glossary && contentArea && targetSection) {
    glossary.style.display = 'none';
    contentArea.style.display = 'flex';
    
    // Show back to menu button
    if (backToGlossaryBtn) {
      backToGlossaryBtn.style.display = 'block';
    }
    
    tutorialScrollEnabled = true; // Enable scrolling when viewing content
    
    // Scroll to the target section
    setTimeout(() => {
      targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }
}

function showTutorialGlossary() {
  const glossary = document.getElementById('tutorial-glossary');
  const contentArea = document.getElementById('tutorial-content-area');
  const backToGlossaryBtn = document.getElementById('back-to-glossary');
  
  if (glossary && contentArea) {
    contentArea.style.display = 'none';
    glossary.style.display = 'block';
    
    // Hide back to menu button when on glossary
    if (backToGlossaryBtn) {
      backToGlossaryBtn.style.display = 'none';
    }
    
    tutorialScrollEnabled = true;
    currentTutorialGlossaryIndex = 0;
    
    // Update selection after render
    setTimeout(() => {
      updateTutorialGlossarySelection();
    }, 50);
  }
}

function scrollTutorialUp() {
  if (!isTutorialSubmenuOpen) return;
  
  // Check if glossary is visible
  const glossary = document.getElementById('tutorial-glossary');
  if (glossary && glossary.style.display !== 'none') {
    const items = glossary.querySelectorAll('.glossary-item');
    if (items.length === 0) return;
    
    currentTutorialGlossaryIndex = (currentTutorialGlossaryIndex - 1 + items.length) % items.length;
    updateTutorialGlossarySelection();
    return;
  }
  
  // Otherwise scroll tutorial content
  const contentArea = document.getElementById('tutorial-content-area');
  if (!contentArea || contentArea.style.display !== 'flex') return;
  
  const tutorialContent = contentArea.querySelector('.submenu-list.tutorial-content');
  if (tutorialContent) {
    tutorialContent.scrollTop = Math.max(0, tutorialContent.scrollTop - 80);
  }
}

function scrollTutorialDown() {
  if (!isTutorialSubmenuOpen) return;
  
  // Check if glossary is visible
  const glossary = document.getElementById('tutorial-glossary');
  if (glossary && glossary.style.display !== 'none') {
    const items = glossary.querySelectorAll('.glossary-item');
    if (items.length === 0) return;
    
    currentTutorialGlossaryIndex = (currentTutorialGlossaryIndex + 1) % items.length;
    updateTutorialGlossarySelection();
    return;
  }
  
  // Otherwise scroll tutorial content
  const contentArea = document.getElementById('tutorial-content-area');
  if (!contentArea || contentArea.style.display !== 'flex') return;
  
  const tutorialContent = contentArea.querySelector('.submenu-list.tutorial-content');
  if (tutorialContent) {
    tutorialContent.scrollTop = Math.min(tutorialContent.scrollHeight - tutorialContent.clientHeight, tutorialContent.scrollTop + 80);
  }
}

function updateTutorialGlossarySelection() {
  const glossary = document.getElementById('tutorial-glossary');
  if (!glossary) return;

  const items = glossary.querySelectorAll('.glossary-item');
  if (items.length === 0) return;

  // Remove previous selection
  items.forEach(item => {
    item.classList.remove('menu-selected');
  });

  // Add selection to current item
  if (currentTutorialGlossaryIndex >= 0 && currentTutorialGlossaryIndex < items.length) {
    const currentItem = items[currentTutorialGlossaryIndex];
    currentItem.classList.add('menu-selected');
    
    // Scroll item into view
    currentItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function startMotionDetection() {
  if (!video || !canvas) return;
  
  lastFrameData = null;
  isMotionCooldownActive = false;
  
  motionDetectionInterval = setInterval(() => {
    if (!isMotionDetectionMode) {
      return;
    }
    
    // Skip if in cooldown or if captured image is showing (and continuous mode is off)
    if (isMotionCooldownActive) {
      return;
    }
    
    if (!motionContinuousEnabled && capturedImage.style.display === 'block') {
      return;
    }
    
    const motionDetected = detectMotion();
    if (motionDetected) {
      console.log('Motion detected! Capturing...');
      capturePhoto();
      
      // Start cooldown period
      isMotionCooldownActive = true;
      setTimeout(() => {
        isMotionCooldownActive = false;
        lastFrameData = null; // Reset frame comparison after cooldown
        
        // Auto-return to camera view after cooldown
        if (capturedImage.style.display === 'block') {
          capturedImage.style.display = 'none';
          video.style.display = 'block';
        }
        
        // If continuous mode is OFF, stop motion detection after one capture
        if (!motionContinuousEnabled) {
          stopMotionDetection();
          isMotionDetectionMode = false;
          const btn = document.getElementById('motion-toggle');
          btn.classList.remove('active');
          btn.title = 'Motion Detection: OFF';
          showStatus('Motion capture complete - Press eye button to reactivate', 3000);
        }
      }, motionCooldown * 1000);
    }
  }, 500); // Check every 500ms
}

function stopMotionDetection() {
  if (motionDetectionInterval) {
    clearInterval(motionDetectionInterval);
    motionDetectionInterval = null;
  }
  lastFrameData = null;
}

function detectMotion() {
  if (!video || !canvas) return false;
  
  const context = canvas.getContext('2d');
  const width = 320; // Use smaller size for performance
  const height = 240;
  
  canvas.width = width;
  canvas.height = height;
  context.drawImage(video, 0, 0, width, height);
  
  const currentFrame = context.getImageData(0, 0, width, height);
  
  if (!lastFrameData) {
    lastFrameData = currentFrame;
    return false;
  }
  
  let diffPixels = 0;
  const totalPixels = width * height;
  
  for (let i = 0; i < currentFrame.data.length; i += 4) {
    const rDiff = Math.abs(currentFrame.data[i] - lastFrameData.data[i]);
    const gDiff = Math.abs(currentFrame.data[i + 1] - lastFrameData.data[i + 1]);
    const bDiff = Math.abs(currentFrame.data[i + 2] - lastFrameData.data[i + 2]);
    
    const avgDiff = (rDiff + gDiff + bDiff) / 3;
    
    if (avgDiff > motionThreshold) {
      diffPixels++;
    }
  }
  
  lastFrameData = currentFrame;
  
  const changePercentage = diffPixels / totalPixels;
  return changePercentage > motionPixelThreshold;
}

// Toggle random mode
function toggleRandomMode() {
  isRandomMode = !isRandomMode;
  
  const randomToggle = document.getElementById('random-toggle');
  if (isRandomMode) {
    randomToggle.classList.add('random-active');
    statusElement.textContent = `Random mode ON • ${CAMERA_PRESETS[currentPresetIndex].name}`;
  } else {
    randomToggle.classList.remove('random-active');
    updatePresetDisplay();
  }
  
  if (typeof PluginMessageHandler !== 'undefined') {
    PluginMessageHandler.postMessage(JSON.stringify({ 
      action: 'random_mode_toggled',
      enabled: isRandomMode,
      timestamp: Date.now() 
    }));
  }
}

// Load queued photos from localStorage
function loadQueue() {
  try {
    const saved = localStorage.getItem(QUEUE_STORAGE_KEY);
    if (saved) {
      photoQueue = JSON.parse(saved);
    }
  } catch (err) {
    console.error('Error loading queue:', err);
    photoQueue = [];
  }
}

// Save queue to localStorage
function saveQueue() {
  try {
    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(photoQueue));
  } catch (err) {
    console.error('Error saving queue:', err);
  }
}

// Update connection status display
function updateConnectionStatus() {
  if (connectionStatusElement) {
    if (isOnline) {
      connectionStatusElement.className = 'connection-status online';
      connectionStatusElement.querySelector('#connection-text').textContent = 'Online';
    } else {
      connectionStatusElement.className = 'connection-status offline';
      connectionStatusElement.querySelector('#connection-text').textContent = 'Offline';
    }
    connectionStatusElement.style.display = 'block';
  }
  
  updateQueueDisplay();
}

// Update queue count display
function updateQueueDisplay() {
  if (queueStatusElement) {
    const count = photoQueue.length;
    queueStatusElement.querySelector('#queue-count').textContent = count;
    queueStatusElement.style.display = count > 0 ? 'block' : 'none';
  }
  
  if (syncButton) {
    const count = photoQueue.length;
    syncButton.querySelector('#sync-count').textContent = count;
    syncButton.style.display = count > 0 && isOnline ? 'block' : 'none';
  }
}

// Setup connection monitoring
function setupConnectionMonitoring() {
  window.addEventListener('online', () => {
    isOnline = true;
    updateConnectionStatus();
    console.log('Connection restored');
    
    if (photoQueue.length > 0 && !isSyncing) {
      setTimeout(() => {
        statusElement.textContent = `Connection restored! Syncing ${photoQueue.length} photos...`;
        syncQueuedPhotos();
      }, 1000);
    }
  });
  
  window.addEventListener('offline', () => {
    isOnline = false;
    updateConnectionStatus();
    console.log('Connection lost');
    
    if (isSyncing) {
      statusElement.textContent = 'Connection lost during sync';
    }
  });
  
  updateConnectionStatus();
}

// Enumerate available cameras
async function enumerateCameras() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    availableCameras = devices.filter(device => device.kind === 'videoinput');
    console.log('Available cameras:', availableCameras.length);
    return availableCameras;
  } catch (err) {
    console.error('Error enumerating cameras:', err);
    return [];
  }
}

// Get camera constraints for current camera
function getCameraConstraints() {
  const resolution = RESOLUTION_PRESETS[currentResolutionIndex];
  
  if (availableCameras.length === 0) {
    return {
      video: {
        facingMode: 'environment',
        width: { ideal: resolution.width },
        height: { ideal: resolution.height }
      }
    };
  }

  const currentCamera = availableCameras[currentCameraIndex];
  const constraints = {
    video: {
      deviceId: { exact: currentCamera.deviceId },
      width: { ideal: resolution.width },
      height: { ideal: resolution.height }
    }
  };
  
  if (isFrontCamera()) {
    constraints.video.advanced = [{ zoom: 1.0 }];
  }
  
  return constraints;
}

// Change resolution and restart camera
async function changeResolution(newIndex) {
  if (newIndex === currentResolutionIndex || !stream) return;
  
  currentResolutionIndex = newIndex;
  saveResolution(newIndex);
  
  try {
    statusElement.textContent = 'Changing resolution...';
    
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    
    const constraints = getCameraConstraints();
    stream = await navigator.mediaDevices.getUserMedia(constraints);
    
    video.srcObject = stream;
    videoTrack = stream.getVideoTracks()[0];
    // Apply white balance
    setTimeout(() => {
      applyWhiteBalance();
    }, 100);
    
    await new Promise((resolve) => {
      video.onloadedmetadata = async () => {
        try {
          await video.play();
          applyVideoTransform();
          await applyZoom(currentZoom);
          setTimeout(resolve, 100);
        } catch (err) {
          console.error('Video play error:', err);
          resolve();
        }
      };
    });
    
    updatePresetDisplay();
    
    if (typeof PluginMessageHandler !== 'undefined') {
      PluginMessageHandler.postMessage(JSON.stringify({ 
        action: 'resolution_changed',
        resolution: RESOLUTION_PRESETS[currentResolutionIndex].name,
        timestamp: Date.now() 
      }));
    }
    
  } catch (err) {
    console.error('Resolution change error:', err);
    statusElement.textContent = 'Resolution change failed';
  }
}

// Get camera label for display
function getCurrentCameraLabel() {
  if (availableCameras.length === 0) return 'Default Camera';
  
  const currentCamera = availableCameras[currentCameraIndex];
  let label = currentCamera.label;
  
  if (!label || label === '') {
    if (currentCamera.deviceId) {
      label = `Camera ${currentCameraIndex + 1}`;
    } else {
      label = 'Unknown Camera';
    }
  } else {
    label = label.replace(/\([^)]*\)/g, '').trim();
    if (label.toLowerCase().includes('front')) {
      label = 'Front Camera';
    } else if (label.toLowerCase().includes('back') || label.toLowerCase().includes('rear')) {
      label = 'Back Camera';
    } else if (label.length > 20) {
      label = label.substring(0, 17) + '...';
    }
  }
  
  return label;
}

function isFrontCamera() {
  if (availableCameras.length === 0) return false;
  
  const currentCamera = availableCameras[currentCameraIndex];
  if (!currentCamera) return false;
  
  const label = currentCamera.label.toLowerCase();
  
  // Check facingMode first (most reliable)
  if (currentCamera.facingMode === 'user') return true;
  if (currentCamera.facingMode === 'environment') return false;
  
  // Check label for keywords
  // Front camera keywords
  if (label.includes('front') || label.includes('user') || label.includes('selfie') || label.includes('face')) {
    return true;
  }
  
  // Back camera keywords
  if (label.includes('back') || label.includes('rear') || label.includes('environment')) {
    return false;
  }
  
  // For R1: camera index 0 is typically back, camera index 1 is typically front
  // This is a fallback when labels don't give us info
  if (availableCameras.length === 2) {
    return currentCameraIndex === 1;
  }
  
  // Last resort: assume first camera is back camera
  return currentCameraIndex > 0;
}

// Apply mirror transform to video
function applyVideoTransform() {
  try {
    const isFront = isFrontCamera();
    
    if (!isFront) {  // Changed: now mirror when NOT front camera
  video.style.transform = "scaleX(-1) translateZ(0)";
  video.style.webkitTransform = "scaleX(-1) translateZ(0)";
} else {
  video.style.transform = "translateZ(0)";
  video.style.webkitTransform = "translateZ(0)";
}
  } catch (err) {
    console.warn("Mirror transform skipped:", err);
  }
}

// Check if camera supports zoom
function supportsZoom() {
  if (!videoTrack) return false;
  const capabilities = videoTrack.getCapabilities();
  return capabilities && 'zoom' in capabilities;
}

// Get zoom constraints
function getZoomConstraints() {
  if (!videoTrack) return { min: 1, max: 5, step: 0.1 };
  const capabilities = videoTrack.getCapabilities();
  if (capabilities && capabilities.zoom) {
    return {
      min: Math.min(capabilities.zoom.min || 1, 1),
      max: Math.max(capabilities.zoom.max || 5, 5),
      step: capabilities.zoom.step || 0.1
    };
  }
  return { min: 1, max: 5, step: 0.1 };
}

// Apply zoom to video track
async function applyZoom(zoomLevel) {
  if (!videoTrack) return;
  
  try {
    if (supportsZoom()) {
      const constraints = getZoomConstraints();
      const clampedZoom = Math.max(constraints.min, Math.min(zoomLevel, constraints.max));
      
      const constraintsToApply = {
        advanced: [{ zoom: clampedZoom }]
      };
      
      const capabilities = videoTrack.getCapabilities();
      if (capabilities && capabilities.focusMode && capabilities.focusMode.includes('continuous')) {
        constraintsToApply.advanced[0].focusMode = 'continuous';
      }
      
      await videoTrack.applyConstraints(constraintsToApply);
      
      currentZoom = clampedZoom;
      
      // Apply mirror transform for front camera even with hardware zoom
      if (!isFrontCamera()) {
        video.style.transform = "scaleX(-1) translateZ(0)";
        video.style.webkitTransform = "scaleX(-1) translateZ(0)";
      } else {
        video.style.transform = "translateZ(0)";
        video.style.webkitTransform = "translateZ(0)";
      }
    } else {
      const clampedZoom = Math.max(1, Math.min(zoomLevel, 5));
      currentZoom = clampedZoom;
      
      if (!isFrontCamera()) {
        video.style.transform = `scaleX(-1) scale(${clampedZoom})`;
        video.style.webkitTransform = `scaleX(-1) scale(${clampedZoom})`;
      } else {
        video.style.transform = `scale(${clampedZoom})`;
        video.style.webkitTransform = `scale(${clampedZoom})`;
      }
    }
  } catch (err) {
    const clampedZoom = Math.max(1, Math.min(zoomLevel, 5));
    currentZoom = clampedZoom;
    
    if (!isFrontCamera()) {
      video.style.transform = `scaleX(-1) scale(${clampedZoom})`;
      video.style.webkitTransform = `scaleX(-1) scale(${clampedZoom})`;
    } else {
      video.style.transform = `scale(${clampedZoom})`;
      video.style.webkitTransform = `scale(${clampedZoom})`;
    }
  }
}

// Trigger manual focus (tap-to-focus simulation)
async function triggerFocus() {
  if (!videoTrack) return;
  
  try {
    const capabilities = videoTrack.getCapabilities();
    
    if (capabilities && capabilities.focusMode) {
      if (capabilities.focusMode.includes('single-shot')) {
        await videoTrack.applyConstraints({
          advanced: [{ 
            focusMode: 'single-shot',
            zoom: currentZoom 
          }]
        });
        console.log('Triggered single-shot focus');
        
        setTimeout(async () => {
          try {
            await videoTrack.applyConstraints({
              advanced: [{ 
                focusMode: 'continuous',
                zoom: currentZoom 
              }]
            });
          } catch (err) {
            console.log('Could not return to continuous focus:', err);
          }
        }, 500);
      } else if (capabilities.focusMode.includes('manual')) {
        await videoTrack.applyConstraints({
          advanced: [{ 
            focusMode: 'manual',
            zoom: currentZoom 
          }]
        });
        console.log('Triggered manual focus');
      }
    }
  } catch (err) {
    console.log('Focus adjustment not supported or failed:', err);
  }
}

// Reset zoom
async function resetZoom() {
  currentZoom = 1;
  await applyZoom(1);
}

// Switch to next camera
async function switchCamera() {
  if (isLoadingCamera || availableCameras.length <= 1) {
    console.log('Cannot switch camera: loading or not enough cameras');
    return;
  }
  
  isLoadingCamera = true;
  
  try {
    statusElement.textContent = 'Switching camera...';
    
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    
    currentCameraIndex = (currentCameraIndex + 1) % availableCameras.length;
    console.log(`Switching to camera ${currentCameraIndex + 1} of ${availableCameras.length}`);
    
    const constraints = getCameraConstraints();
    stream = await navigator.mediaDevices.getUserMedia(constraints);
    
    video.srcObject = stream;
    videoTrack = stream.getVideoTracks()[0];
    // Apply white balance
    setTimeout(() => {
      applyWhiteBalance();
    }, 100);
    
    await new Promise((resolve) => {
      video.onloadedmetadata = async () => {
        try {
          await video.play();
          applyVideoTransform();
          await applyZoom(currentZoom);
          setTimeout(resolve, 100);
        } catch (err) {
          console.error('Video play error:', err);
          resolve();
        }
      };
    });
    
    updatePresetDisplay();
    
    if (typeof PluginMessageHandler !== 'undefined') {
      PluginMessageHandler.postMessage(JSON.stringify({ 
        action: 'camera_switched',
        cameraIndex: currentCameraIndex,
        cameraLabel: getCurrentCameraLabel(),
        timestamp: Date.now() 
      }));
    }
    
  } catch (err) {
    console.error('Camera switch error:', err);
    statusElement.textContent = 'Camera switch failed';
    
    currentCameraIndex = (currentCameraIndex - 1 + availableCameras.length) % availableCameras.length;
  } finally {
    isLoadingCamera = false;
  }
}

// Load burst settings
function loadBurstSettings() {
  try {
    const saved = localStorage.getItem(BURST_SETTINGS_KEY);
    if (saved) {
      const settings = JSON.parse(saved);
      burstCount = settings.count || 5;
      const speedKey = settings.speed || 2;
      burstDelay = BURST_SPEEDS[speedKey].delay;
    }
  } catch (err) {
    console.error('Error loading burst settings:', err);
  }
}

// Save burst settings
function saveBurstSettings(count, speed) {
  try {
    localStorage.setItem(BURST_SETTINGS_KEY, JSON.stringify({
      count: count,
      speed: speed
    }));
  } catch (err) {
    console.error('Error saving burst settings:', err);
  }
}

// Toggle burst mode
function toggleBurstMode() {
  isBurstMode = !isBurstMode;
  
  const burstToggle = document.getElementById('burst-toggle');
  if (isBurstMode) {
    burstToggle.classList.add('burst-active');
    statusElement.textContent = `Burst mode ON (${burstCount} photos) • ${CAMERA_PRESETS[currentPresetIndex].name}`;
  } else {
    burstToggle.classList.remove('burst-active');
    updatePresetDisplay();
  }
  
  if (typeof PluginMessageHandler !== 'undefined') {
    PluginMessageHandler.postMessage(JSON.stringify({ 
      action: 'burst_mode_toggled',
      enabled: isBurstMode,
      count: burstCount,
      timestamp: Date.now() 
    }));
  }
}

// Toggle timer mode
function toggleTimerMode() {
  isTimerMode = !isTimerMode;
  
  const timerToggle = document.getElementById('timer-toggle');
  if (isTimerMode) {
    timerToggle.classList.add('timer-active');
    statusElement.textContent = `Timer mode ON (${timerDelay}s delay) • ${CAMERA_PRESETS[currentPresetIndex].name}`;
  } else {
    timerToggle.classList.remove('timer-active');
    // Cancel any active timer
    if (timerCountdown) {
      clearInterval(timerCountdown);
      timerCountdown = null;
      document.getElementById('timer-countdown').style.display = 'none';
    }
    updatePresetDisplay();
  }
  
  if (typeof PluginMessageHandler !== 'undefined') {
    PluginMessageHandler.postMessage(JSON.stringify({ 
      action: 'timer_mode_toggled',
      enabled: isTimerMode,
      delay: timerDelay,
      timestamp: Date.now() 
    }));
  }
}

// Start timer countdown
function startTimerCountdown(captureCallback) {
  let remainingSeconds = timerDelay;
  const countdownElement = document.getElementById('timer-countdown');
  const countdownText = document.getElementById('timer-countdown-text');
  
  // Show initial countdown
  countdownText.textContent = remainingSeconds;
  countdownElement.style.display = 'flex';
  countdownElement.classList.remove('countdown-fade-out');
  countdownElement.classList.add('countdown-fade-in');
  
  statusElement.textContent = `Timer: ${remainingSeconds}s...`;
  
  timerCountdown = setInterval(() => {
    remainingSeconds--;
    
    if (remainingSeconds > 0) {
      // Fade out current number
      countdownElement.classList.remove('countdown-fade-in');
      countdownElement.classList.add('countdown-fade-out');
      
      setTimeout(() => {
        // Update number and fade in
        countdownText.textContent = remainingSeconds;
        countdownElement.classList.remove('countdown-fade-out');
        countdownElement.classList.add('countdown-fade-in');
        statusElement.textContent = `Timer: ${remainingSeconds}s...`;
      }, 500);
      
    } else {
      // Timer finished - fade out and capture
      countdownElement.classList.remove('countdown-fade-in');
      countdownElement.classList.add('countdown-fade-out');
      
      setTimeout(() => {
        countdownElement.style.display = 'none';
        countdownElement.classList.remove('countdown-fade-out');
        clearInterval(timerCountdown);
        timerCountdown = null;
        
        // Execute the capture callback
        captureCallback();
        
        // In continuous mode, auto-return to camera and continue
        if (timerRepeatEnabled && isTimerMode) {
          // Auto-return to camera view after brief delay
          setTimeout(() => {
            if (capturedImage.style.display === 'block') {
              capturedImage.style.display = 'none';
              video.style.display = 'block';
              
              // Restore camera switch button if multiple cameras available
              const cameraButton = document.getElementById('camera-button');
              if (cameraButton && availableCameras.length > 1) {
                cameraButton.style.display = 'flex';
              }
            }
          }, 500);
          
          // Continue timer loop
          setTimeout(() => {
            if (isTimerMode) {
              startTimerCountdown(captureCallback);
            }
          }, timerRepeatInterval * 1000);
        }
      }, 500);
    }
  }, 1000);
}

// Cancel timer countdown
function cancelTimerCountdown() {
  if (timerCountdown) {
    clearInterval(timerCountdown);
    timerCountdown = null;
    document.getElementById('timer-countdown').style.display = 'none';
    updatePresetDisplay();
  }
}

// Load timer settings from localStorage
function loadTimerSettings() {
  try {
    const saved = localStorage.getItem(TIMER_SETTINGS_KEY);
    if (saved) {
      const settings = JSON.parse(saved);
      timerDelay = settings.delay || 10;
      timerRepeatEnabled = settings.repeat || false;
      timerRepeatInterval = settings.repeatInterval || 1;
    }
  } catch (err) {
    console.error('Error loading timer settings:', err);
  }
}

// Save timer settings to localStorage
function saveTimerSettings() {
  try {
    localStorage.setItem(TIMER_SETTINGS_KEY, JSON.stringify({
      delay: timerDelay,
      repeat: timerRepeatEnabled,
      repeatInterval: timerRepeatInterval // ADD THIS LINE
    }));
  } catch (err) {
    console.error('Error saving timer settings:', err);
  }
}

// Update timer display in settings menu
function updateTimerDisplay() {
  const display = document.getElementById('current-timer-display');
  if (display) {
    const repeatText = timerRepeatEnabled ? `Repeat (${TIMER_REPEAT_INTERVALS[getTimerRepeatIntervalKey()].label})` : 'No Repeat';
    display.textContent = `${timerDelay}s, ${repeatText}`;
  }
}

// Helper function to get current repeat interval key
function getTimerRepeatIntervalKey() {
  for (const [key, value] of Object.entries(TIMER_REPEAT_INTERVALS)) {
    if (value.seconds === timerRepeatInterval) {
      return parseInt(key);
    }
  }
  return 1; // Default to 1 second
}

// Burst mode capture
async function startBurstCapture() {
  if (!stream || isBursting || capturedImage.style.display === 'block') {
    return;
  }
  
  isBursting = true;
  
  statusElement.textContent = `Burst mode: Taking ${burstCount} photos...`;
  
  for (let i = 0; i < burstCount; i++) {
    statusElement.textContent = `Burst ${i + 1}/${burstCount}...`;
    
    captureBurstPhoto(i + 1);
    
    if (i < burstCount - 1) {
      await new Promise(resolve => setTimeout(resolve, burstDelay));
    }
  }
  
  isBursting = false;
  statusElement.textContent = `Burst complete! ${burstCount} photos saved.`;
  
  if (isOnline && !isSyncing) {
    setTimeout(() => {
      syncQueuedPhotos();
    }, 500);
  } else if (!isOnline) {
    statusElement.textContent = `Burst complete! ${burstCount} photos queued (offline).`;
  }
  
  if (typeof PluginMessageHandler !== 'undefined') {
    PluginMessageHandler.postMessage(JSON.stringify({ 
      action: 'burst_complete',
      count: burstCount,
      timestamp: Date.now() 
    }));
  }
  
  setTimeout(() => {
    if (isBurstMode) {
      statusElement.textContent = `Burst mode ON (${burstCount} photos) • ${CAMERA_PRESETS[currentPresetIndex].name}`;
    } else {
      updatePresetDisplay();
    }
  }, 2000);
}

function captureBurstPhoto(photoNumber) {
  if (!stream) return;
  
  if (isRandomMode) {
    currentPresetIndex = getRandomPresetIndex();
  }
  
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  
  const ctx = canvas.getContext('2d', { willReadFrequently: false, alpha: false });
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  const zoomedWidth = canvas.width / currentZoom;
  const zoomedHeight = canvas.height / currentZoom;
  const offsetX = (canvas.width - zoomedWidth) / 2;
  const offsetY = (canvas.height - zoomedHeight) / 2;
  
  // Since selfie camera (mis-identified as !isFrontCamera) shows mirrored preview,
  // we need to flip the capture back to normal orientation
  if (!isFrontCamera()) {
    // This is actually the SELFIE camera - capture needs double flip to un-mirror
    ctx.save();
    ctx.scale(-1, 1);
    
    ctx.drawImage(
      video,
      offsetX, offsetY, zoomedWidth, zoomedHeight,
      -canvas.width, 0, canvas.width, canvas.height
    );
    
    ctx.restore();
    
    // Now flip the canvas content back to un-mirror the final photo
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.scale(-1, 1);
    tempCtx.drawImage(canvas, -canvas.width, 0);
    
    // Copy back to main canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(tempCanvas, 0, 0);
  } else {
    // This is the regular camera - keep as is
    ctx.drawImage(
      video,
      offsetX, offsetY, zoomedWidth, zoomedHeight,
      0, 0, canvas.width, canvas.height
    );
  }
  
  // Apply white balance adjustments to canvas pixels
  applyWhiteBalanceToCanvas(ctx, canvas.width, canvas.height);
  
  // Use lower quality for higher resolutions to reduce file size
  const quality = currentResolutionIndex >= 2 ? 0.7 : 0.8;
  const dataUrl = canvas.toDataURL('image/jpeg', quality);
  const currentPreset = CAMERA_PRESETS[currentPresetIndex];
  
  // Add to gallery
  addToGallery(dataUrl);
  
  const queueItem = {
    id: Date.now().toString() + '-' + photoNumber,
    imageBase64: dataUrl,
    preset: currentPreset,
    timestamp: Date.now()
  };
  
  photoQueue.push(queueItem);
  saveQueue();
  updateQueueDisplay();
}

// Initialize camera
async function initCamera() {
  try {
    video = document.getElementById('video');
    canvas = document.getElementById('canvas');
    capturedImage = document.getElementById('captured-image');
    statusElement = document.getElementById('status');
    resetButton = document.getElementById('reset-button');
    
    document.getElementById('start-screen').querySelector('.start-text').textContent = 'Loading camera...';
    document.getElementById('start-button').disabled = true;
    
    await enumerateCameras();
    
    if (availableCameras.length > 1) {
      const backCameraIndex = availableCameras.findIndex(camera => {
        const label = camera.label.toLowerCase();
        return label.includes('back') || label.includes('rear') || label.includes('environment');
      });
      
      currentCameraIndex = backCameraIndex !== -1 ? backCameraIndex : availableCameras.length - 1;
    } else {
      currentCameraIndex = 0;
    }
    
    const constraints = getCameraConstraints();
    stream = await navigator.mediaDevices.getUserMedia(constraints);
    
    video.srcObject = stream;
    videoTrack = stream.getVideoTracks()[0];
    // Apply white balance
    setTimeout(() => {
      applyWhiteBalance();
    }, 100);
    
    console.log('Camera initialized:', getCurrentCameraLabel());

    loadQueue();
    setupConnectionMonitoring();
    
    await new Promise((resolve) => {
      video.onloadedmetadata = async () => {
        try {
          await video.play();
          applyVideoTransform();
          applyZoom(1);
          video.addEventListener('playing', applyVideoTransform);
          setTimeout(resolve, 100);
        } catch (err) {
          console.error('Video play error:', err);
          resolve();
        }
      };
    });
    
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('camera-container').style.display = 'flex';
    statusElement.style.display = 'block';
    
    const cameraButton = document.getElementById('camera-button');
    if (availableCameras.length > 1) {
      cameraButton.style.display = 'flex';
    }
    
    const menuButton = document.getElementById('menu-button');
    if (menuButton) {
      menuButton.style.display = 'flex';
    }
    
    const burstToggle = document.getElementById('burst-toggle');
    if (burstToggle) {
      burstToggle.style.display = 'flex';
    }

    const randomToggle = document.getElementById('random-toggle');
    if (randomToggle) {
      randomToggle.style.display = 'flex';
    }

    const timerToggle = document.getElementById('timer-toggle');
    if (timerToggle) {
      timerToggle.style.display = 'flex';
    }
    
    const motionToggle = document.getElementById('motion-toggle');
    if (motionToggle) {
      motionToggle.style.display = 'flex';
    }

    const galleryButton = document.getElementById('gallery-button');
    if (galleryButton) {
      galleryButton.style.display = 'flex';
    }

    updatePresetDisplay();
    
    if (typeof PluginMessageHandler !== 'undefined') {
      PluginMessageHandler.postMessage(JSON.stringify({ 
        status: 'camera_ready',
        availableCameras: availableCameras.length,
        currentCamera: getCurrentCameraLabel(),
        timestamp: Date.now() 
      }));
    }
  } catch (err) {
    console.error('Camera access error:', err);
    statusElement.textContent = 'Camera access denied';
    if (typeof PluginMessageHandler !== 'undefined') {
      PluginMessageHandler.postMessage(JSON.stringify({ 
        status: 'camera_error',
        error: err.message,
        timestamp: Date.now() 
      }));
    }
  }
}

// Pause camera stream to reduce lag
function pauseCamera() {
  if (stream && video) {
    // Stop all tracks to actually disable the camera hardware
    stream.getTracks().forEach(track => {
      track.stop();
    });
    video.style.display = 'none';
    video.srcObject = null;
  }
}

// Resume camera stream
async function resumeCamera() {
  if (video) {
    try {
      // Restart the camera with the same constraints
      const constraints = getCameraConstraints();
      stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      video.srcObject = stream;
      videoTrack = stream.getVideoTracks()[0];
      // Apply white balance
      setTimeout(() => {
        applyWhiteBalance();
      }, 100);
      
      await new Promise((resolve) => {
        video.onloadedmetadata = async () => {
          try {
            await video.play();
            applyVideoTransform();
            await applyZoom(currentZoom);
            setTimeout(resolve, 100);
          } catch (err) {
            console.error('Video resume error:', err);
            resolve();
          }
        };
      });
      
      video.style.display = 'block';
    } catch (err) {
      console.error('Failed to resume camera:', err);
      statusElement.textContent = 'Camera resume failed';
    }
  }
}

// Capture photo and send to WebSocket
function capturePhoto() {
  if (!stream) return;
  
  if (isRandomMode) {
    currentPresetIndex = getRandomPresetIndex();
    showStyleReveal(CAMERA_PRESETS[currentPresetIndex].name);
  }
  
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  
  const ctx = canvas.getContext('2d', { willReadFrequently: false, alpha: false });
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  const zoomedWidth = canvas.width / currentZoom;
  const zoomedHeight = canvas.height / currentZoom;
  const offsetX = (canvas.width - zoomedWidth) / 2;
  const offsetY = (canvas.height - zoomedHeight) / 2;
  
  // Since selfie camera (mis-identified as !isFrontCamera) shows mirrored preview,
  // we need to flip the capture back to normal orientation
  if (!isFrontCamera()) {
    // This is actually the SELFIE camera - capture needs double flip to un-mirror
    ctx.save();
    ctx.scale(-1, 1);
    
    ctx.drawImage(
      video,
      offsetX, offsetY, zoomedWidth, zoomedHeight,
      -canvas.width, 0, canvas.width, canvas.height
    );
    
    ctx.restore();
    
    // Now flip the canvas content back to un-mirror the final photo
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.scale(-1, 1);
    tempCtx.drawImage(canvas, -canvas.width, 0);
    
    // Copy back to main canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(tempCanvas, 0, 0);
  } else {
    // This is the regular camera - keep as is
    ctx.drawImage(
      video,
      offsetX, offsetY, zoomedWidth, zoomedHeight,
      0, 0, canvas.width, canvas.height
    );
  }
  
  // Apply white balance adjustments to canvas pixels
  applyWhiteBalanceToCanvas(ctx, canvas.width, canvas.height);
  
  // Use lower quality for higher resolutions to reduce file size
  const quality = currentResolutionIndex >= 2 ? 0.7 : 0.8;
  const dataUrl = canvas.toDataURL('image/jpeg', quality);
  capturedImage.src = dataUrl;
  capturedImage.style.display = 'block';
  capturedImage.style.transform = 'none';
  video.style.display = 'none';
  
  // Hide reset button when motion detection OR continuous timer is active
  if (isMotionDetectionMode || (isTimerMode && timerRepeatEnabled)) {
    resetButton.style.display = 'none';
  } else {
    resetButton.style.display = 'block';
  }
  // } else {
  //   resetButton.style.display = 'none';
  // }
  // above three lines may be wrong

  const cameraButton = document.getElementById('camera-button');
  if (cameraButton) {
    cameraButton.style.display = 'none';
  }
  
  const resolutionButton = document.getElementById('resolution-button');
  if (resolutionButton) {
    resolutionButton.style.display = 'none';
  }
  
  addToGallery(dataUrl);
  
  const currentPreset = CAMERA_PRESETS[currentPresetIndex];
  
  const queueItem = {
    id: Date.now().toString(),
    imageBase64: dataUrl,
    preset: currentPreset,
    timestamp: Date.now()
  };
  
  photoQueue.push(queueItem);
  saveQueue();
  updateQueueDisplay();
  
  if (isOnline) {
    const message = noMagicMode 
      ? 'Photo saved!'
      : 'Photo saved! Uploading...';
    statusElement.textContent = message;
    if (!isSyncing) {
      syncQueuedPhotos();
    }
  } else {
    statusElement.textContent = `Photo queued for sync (${photoQueue.length} in queue)`;
  }
  
  if (typeof PluginMessageHandler !== 'undefined') {
    PluginMessageHandler.postMessage(JSON.stringify({ 
      action: 'photo_captured',
      queued: true,
      queueLength: photoQueue.length,
      timestamp: Date.now() 
    }));
  }
}

async function syncQueuedPhotos() {
  if (photoQueue.length === 0 || isSyncing) {
    return;
  }
  
  if (!isOnline) {
    statusElement.textContent = 'Cannot sync - offline';
    return;
  }
  
  isSyncing = true;
  syncButton.disabled = true;
  syncButton.classList.add('syncing');
  
  console.log(`Syncing ${photoQueue.length} queued photos...`);
  
  const originalCount = photoQueue.length;
  let successCount = 0;
  
  while (photoQueue.length > 0 && isOnline) {
    const item = photoQueue[0];
    
    try {
      statusElement.textContent = `Syncing ${successCount + 1}/${originalCount}...`;
      
      if (typeof PluginMessageHandler !== 'undefined' && !noMagicMode) {
        PluginMessageHandler.postMessage(JSON.stringify({
          message: getFinalPrompt(item.preset.message),
          pluginId: 'com.r1.pixelart',
          imageBase64: item.imageBase64
        }));
      }
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (isOnline) {
        photoQueue.shift();
        successCount++;
        saveQueue();
        updateQueueDisplay();
      } else {
        console.log('Lost connection during sync');
        break;
      }
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      console.error('Sync error:', error);
      statusElement.textContent = 'Sync error - will retry later';
      break;
    }
  }
  
  isSyncing = false;
  syncButton.disabled = false;
  syncButton.classList.remove('syncing');
  
  if (photoQueue.length === 0) {
    const message = noMagicMode 
      ? `All ${successCount} photos saved!`
      : `All ${successCount} photos synced successfully!`;
    statusElement.textContent = message;
    setTimeout(() => {
      updatePresetDisplay();
    }, 2000);
  } else if (!isOnline) {
    statusElement.textContent = `Connection lost. ${photoQueue.length} photos queued.`;
  } else {
    statusElement.textContent = `Synced ${successCount}. ${photoQueue.length} remaining.`;
  }
  
  if (typeof PluginMessageHandler !== 'undefined') {
    PluginMessageHandler.postMessage(JSON.stringify({ 
      action: 'sync_complete',
      synced: successCount,
      remaining: photoQueue.length,
      timestamp: Date.now() 
    }));
  }
}

// Show queue manager
function showQueueManager() {
  const manager = document.getElementById('queue-manager');
  const list = document.getElementById('queue-list');
  
  list.innerHTML = '';
  
  if (photoQueue.length === 0) {
    list.innerHTML = `
      <div class="queue-empty">
        <h4>No Photos in Queue</h4>
        <p>Take photos while offline and they'll appear here for syncing.</p>
      </div>
    `;
  } else {
    photoQueue.forEach((item, index) => {
      const queueItem = document.createElement('div');
      queueItem.className = 'queue-item';
      
      queueItem.innerHTML = `
        <div class="queue-item-header">
          <span class="queue-item-style">${item.preset.name}</span>
          <span class="queue-item-time">${new Date(item.timestamp).toLocaleString()}</span>
        </div>
        <img src="${item.imageBase64}" class="queue-item-preview" alt="Queued photo">
        <div class="queue-item-actions">
          <button onclick="removeFromQueue(${index})" class="delete-button">Remove</button>
          <button onclick="previewQueueItem(${index})" class="secondary">Preview</button>
        </div>
      `;
      
      list.appendChild(queueItem);
    });
  }
  
  manager.style.display = 'flex';
}

// Hide queue manager
function hideQueueManager() {
  document.getElementById('queue-manager').style.display = 'none';
}

// Remove item from queue
function removeFromQueue(index) {
  if (confirm('Remove this photo from the sync queue?')) {
    photoQueue.splice(index, 1);
    saveQueue();
    updateQueueDisplay();
    showQueueManager();
  }
}

// Preview queue item
function previewQueueItem(index) {
  const item = photoQueue[index];
  alert(`Style: ${item.preset.name}\nPrompt: ${item.preset.message}\nSaved: ${new Date(item.timestamp).toLocaleString()}`);
}

// Clear entire queue
function clearQueue() {
  if (confirm('Clear all photos from the queue? This cannot be undone.')) {
    photoQueue = [];
    saveQueue();
    updateQueueDisplay();
    showQueueManager();
  }
}

// Side button handler
window.addEventListener('sideClick', () => {
  console.log('Side button pressed');
  
  // Settings submenu - select current item
  if (isSettingsSubmenuOpen) {
    const submenu = document.getElementById('settings-submenu');
    const items = submenu.querySelectorAll('.menu-section-button');
    if (items.length > 0 && currentSettingsIndex < items.length) {
      items[currentSettingsIndex].click();
    }
    return;
  }

 // Visible Presets submenu - select current item
  if (isVisiblePresetsSubmenuOpen) {
    selectCurrentVisiblePresetsItem();
    return;
  }

  // Tutorial submenu - select current item
  if (isTutorialSubmenuOpen) {
    const glossary = document.getElementById('tutorial-glossary');
    if (glossary && glossary.style.display !== 'none') {
      // In glossary view - select the highlighted item
      const items = glossary.querySelectorAll('.glossary-item');
      if (items.length > 0 && currentTutorialGlossaryIndex < items.length) {
        items[currentTutorialGlossaryIndex].click();
      }
    }
    // If in content view, side button does nothing (just scrolls)
    return;
  }
  
  // Resolution submenu - select current item
  if (isResolutionSubmenuOpen) {
    const submenu = document.getElementById('resolution-submenu');
    const items = submenu.querySelectorAll('.resolution-item');
    if (items.length > 0 && currentResolutionIndex_Menu < items.length) {
      items[currentResolutionIndex_Menu].click();
    }
    return;
  }
  
  if (isPresetSelectorOpen) {
    selectCurrentPresetItem();
    return;
  }
 
  if (isMenuOpen && menuScrollEnabled) {
    selectCurrentMenuItem();
    return;
  }
  
  const startScreen = document.getElementById('start-screen');
  const startButton = document.getElementById('start-button');
  
  if (startScreen && startScreen.style.display !== 'none') {
    console.log('Simulating tap on start button');
    
    setTimeout(() => {
      startButton.click();
    }, 100);
    
  } else if (capturedImage && capturedImage.style.display === 'block') {
    resetToCamera();
  } else {
    // If motion detection is active, side button starts the delay countdown
    if (isMotionDetectionMode) {
      // Show countdown and start motion detection after delay
      if (motionStartDelay > 0) {
        let remainingSeconds = motionStartDelay;
        const countdownElement = document.getElementById('timer-countdown');
        const countdownText = document.getElementById('timer-countdown-text');
        
        countdownText.textContent = remainingSeconds;
        countdownElement.style.display = 'flex';
        countdownElement.classList.remove('countdown-fade-out');
        countdownElement.classList.add('countdown-fade-in');
        
        statusElement.textContent = `Motion Detection starting in ${remainingSeconds}s...`;
        
        motionStartInterval = setInterval(() => {
          remainingSeconds--;
          
          if (remainingSeconds > 0) {
            countdownElement.classList.remove('countdown-fade-in');
            countdownElement.classList.add('countdown-fade-out');
            
            setTimeout(() => {
              countdownText.textContent = remainingSeconds;
              countdownElement.classList.remove('countdown-fade-out');
              countdownElement.classList.add('countdown-fade-in');
              statusElement.textContent = `Motion Detection starting in ${remainingSeconds}s...`;
            }, 500);
          } else {
            countdownElement.classList.remove('countdown-fade-in');
            countdownElement.classList.add('countdown-fade-out');
            
            setTimeout(() => {
              countdownElement.style.display = 'none';
              countdownElement.classList.remove('countdown-fade-out');
              clearInterval(motionStartInterval);
              
              // Start motion detection
              if (isMotionDetectionMode && video && video.readyState >= 2) {
                startMotionDetection();
                showStatus('Motion Detection active - Move in front of camera', 3000);
              }
            }, 500);
          }
        }, 1000);
      } else {
        // No delay - start immediately
        startMotionDetection();
        showStatus('Motion Detection ON - Move in front of camera', 3000);
      }
      return;
    }
    
    // Normal photo capture (not in motion detection mode)
    // Check if timer is active
    if (isTimerMode) {
      if (isBurstMode) {
        startTimerCountdown(() => startBurstCapture());
      } else {
        startTimerCountdown(() => capturePhoto());
      }
    } else {
      // No timer - capture immediately
      if (isBurstMode) {
        startBurstCapture();
      } else {
        capturePhoto();
      }
    }
  }
});

// Scroll wheel handler for preset cycling and menu navigation
window.addEventListener('scrollUp', () => {
  console.log('Scroll wheel: up');
  
  // Preset selector (gallery)
  if (isPresetSelectorOpen) {
    scrollPresetListUp(); // or Down
    return;
  }
  
  // Tutorial submenu - CHECK BEFORE MAIN MENU
  if (isTutorialSubmenuOpen) {
    scrollTutorialUp(); // or Down
    return;
  }

    // Preset Builder submenu
  if (isPresetBuilderSubmenuOpen) {
    scrollPresetBuilderUp();
    return;
  }  
  
  // Visible Presets submenu - CHECK BEFORE MAIN MENU
  if (isVisiblePresetsSubmenuOpen) {
    scrollVisiblePresetsUp(); // or Down
    return;
  }

  // Main menu
  if (isMenuOpen && menuScrollEnabled) {
    scrollMenuUp(); // or Down
    return;
  }
  
  // Motion submenu
  if (isMotionSubmenuOpen) {
    scrollMotionUp();
    return;
  }

  // Master prompt submenu
  if (isMasterPromptSubmenuOpen) {
    scrollMasterPromptUp();
    return;
  }
  
  // Timer submenu
  if (isTimerSubmenuOpen) {
    scrollTimerUp();
    return;
  }
  
  // Burst submenu
  if (isBurstSubmenuOpen) {
    scrollBurstUp();
    return;
  }
  
  // Resolution submenu
  if (isResolutionSubmenuOpen) {
    scrollResolutionMenuUp();
    return;
  }
  
  // Settings submenu - CHECK AFTER all other submenus
  if (isSettingsSubmenuOpen) {
    scrollSettingsUp();
    return;
  }
  
  // Gallery
  if (document.getElementById('gallery-modal')?.style.display === 'flex') {
    scrollGalleryUp();
    return;
  }
  
  // Image viewer
  if (document.getElementById('image-viewer')?.style.display === 'flex') {
    scrollViewerUp();
    return;
  }
  
  // Style editor
  if (document.getElementById('style-editor')?.style.display === 'flex') {
    scrollEditorUp();
    return;
  }
  
  // Queue manager
  if (document.getElementById('queue-manager')?.style.display === 'flex') {
    scrollQueueUp();
    return;
  }
  
  // Camera preset cycling
  if (!stream || capturedImage.style.display === 'block') return;
  
  const now = Date.now();
  if (now - lastScrollTime < SCROLL_DEBOUNCE_MS) {
    return;
  }
  lastScrollTime = now;
  
  if (scrollTimeout) {
    clearTimeout(scrollTimeout);
  }
  
  scrollTimeout = setTimeout(() => {
    let currentSortedIndex = getCurrentSortedIndex();
    const sortedPresets = getSortedPresets();
    
    currentSortedIndex = (currentSortedIndex - 1 + sortedPresets.length) % sortedPresets.length;
    
    currentPresetIndex = getOriginalIndexFromSorted(currentSortedIndex);
    
    const currentPreset = CAMERA_PRESETS[currentPresetIndex];
    if (currentPreset) {
      showStyleReveal(currentPreset.name);
    }
    
    updatePresetDisplay();
    
    if (typeof PluginMessageHandler !== 'undefined') {
      PluginMessageHandler.postMessage(JSON.stringify({ 
        action: 'preset_changed',
        preset: CAMERA_PRESETS[currentPresetIndex].name,
        timestamp: Date.now() 
      }));
    }
    
    scrollTimeout = null;
  }, 50);
});

window.addEventListener('scrollDown', () => {
  console.log('Scroll wheel: down');
  
  // Preset selector (gallery)
  if (isPresetSelectorOpen) {
    scrollPresetListDown();
    return;
  }

  // Tutorial - CHECK BEFORE Settings submenu
  if (isTutorialSubmenuOpen) {
    scrollTutorialDown();
    return;
  }

    // Preset Builder submenu
  if (isPresetBuilderSubmenuOpen) {
    scrollPresetBuilderDown();
    return;
  }

 // Visible Presets submenu
  if (isVisiblePresetsSubmenuOpen) {
    scrollVisiblePresetsDown();
    return;
  }
  
  // Main menu
  if (isMenuOpen && menuScrollEnabled) {
    scrollMenuDown();
    return;
  }

  // Motion submenu
  if (isMotionSubmenuOpen) {
    scrollMotionDown();
    return;
  }
  
  // Master prompt submenu
  if (isMasterPromptSubmenuOpen) {
    scrollMasterPromptDown();
    return;
  }
  
  // Timer submenu
  if (isTimerSubmenuOpen) {
    scrollTimerDown();
    return;
  }
  
  // Burst submenu
  if (isBurstSubmenuOpen) {
    scrollBurstDown();
    return;
  }
  
  // Resolution submenu
  if (isResolutionSubmenuOpen) {
    scrollResolutionMenuDown();
    return;
  }
  
  // Settings submenu - CHECK AFTER all other submenus
  if (isSettingsSubmenuOpen) {
    scrollSettingsDown();
    return;
  }
  
  // Gallery
  if (document.getElementById('gallery-modal')?.style.display === 'flex') {
    scrollGalleryDown();
    return;
  }
  
  // Image viewer
  if (document.getElementById('image-viewer')?.style.display === 'flex') {
    scrollViewerDown();
    return;
  }
  
  // Style editor
  if (document.getElementById('style-editor')?.style.display === 'flex') {
    scrollEditorDown();
    return;
  }
  
  // Queue manager
  if (document.getElementById('queue-manager')?.style.display === 'flex') {
    scrollQueueDown();
    return;
  }
  
  // Camera preset cycling
  if (!stream || capturedImage.style.display === 'block') return;
  
  const now = Date.now();
  if (now - lastScrollTime < SCROLL_DEBOUNCE_MS) {
    return;
  }
  lastScrollTime = now;
  
  if (scrollTimeout) {
    clearTimeout(scrollTimeout);
  }
  
  scrollTimeout = setTimeout(() => {
    let currentSortedIndex = getCurrentSortedIndex();
    const sortedPresets = getSortedPresets();
    
    currentSortedIndex = (currentSortedIndex + 1) % sortedPresets.length;
    
    currentPresetIndex = getOriginalIndexFromSorted(currentSortedIndex);
    
    const currentPreset = CAMERA_PRESETS[currentPresetIndex];
    if (currentPreset) {
      showStyleReveal(currentPreset.name);
    }
    
    updatePresetDisplay();
    
    if (typeof PluginMessageHandler !== 'undefined') {
      PluginMessageHandler.postMessage(JSON.stringify({ 
        action: 'preset_changed',
        preset: CAMERA_PRESETS[currentPresetIndex].name,
        timestamp: Date.now() 
      }));
    }
    
    scrollTimeout = null;
  }, 50);
});

// Function to update preset display
function updatePresetDisplay() {
    currentPresetIndex = Math.max(0, Math.min(currentPresetIndex, CAMERA_PRESETS.length - 1));
    const currentPreset = CAMERA_PRESETS[currentPresetIndex];

    if (videoTrack) {
        try {
            const constraints = {};
            videoTrack.applyConstraints(constraints);
        } catch (e) {
            console.error('Error applying preset constraints:', e);
        }
    }

    if (statusElement) {
        statusElement.textContent = `Style: ${currentPreset.name}`;
    }

    localStorage.setItem(LAST_USED_PRESET_KEY, currentPresetIndex.toString());

    if (isMenuOpen) {
        updateMenuSelection();
    }
}

// Listen for plugin messages (responses from AI)
window.onPluginMessage = function(data) {
  console.log('Received plugin message:', data);
  
  if (data && data.status === 'processing') {
    statusElement.textContent = 'AI is processing your image...';
  } else if (data && data.status === 'complete') {
    statusElement.textContent = 'AI transformation complete!';
  } else if (data && data.error) {
    statusElement.textContent = 'Error: ' + data.error;
  }
};

// Check if Flutter is available
if (typeof PluginMessageHandler !== 'undefined') {
  console.log('Flutter channel is available');
  
  PluginMessageHandler.postMessage(JSON.stringify({ 
    message: 'AI Camera Styles initialized',
    pluginId: 'com.r1.pixelart'
  }));
} else {
  console.log('Running in development mode - Flutter channel not available');
}

// Reset button handler
function resetToCamera() {
  capturedImage.style.display = 'none';
  
  // Don't stop/restart motion detection if it's active with continuous mode
  if (isMotionDetectionMode && motionContinuousEnabled) {
    // Motion detection is already running, don't interrupt it
  } else {
    stopMotionDetection();
    if (isMotionDetectionMode) {
      startMotionDetection();
    }
  }

  capturedImage.style.transform = 'none';
  video.style.display = 'block';
  resetButton.style.display = 'none';
  
  const cameraButton = document.getElementById('camera-button');
  if (cameraButton && availableCameras.length > 1) {
    cameraButton.style.display = 'flex';
  }
  
  const resolutionButton = document.getElementById('resolution-button');
  if (resolutionButton) {
    resolutionButton.style.display = 'flex';
  }
  
  setTimeout(() => {
    applyZoom(currentZoom);
  }, 50);
  
  updatePresetDisplay();
}

// Calculate distance between two touch points
function getTouchDistance(touch1, touch2) {
  const dx = touch1.clientX - touch2.clientX;
  const dy = touch1.clientY - touch2.clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

// Setup pinch-to-zoom gesture handlers
function setupPinchZoom() {
  const videoElement = document.getElementById('video');
  
  videoElement.addEventListener('touchstart', (e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      isPinching = true;
      initialPinchDistance = getTouchDistance(e.touches[0], e.touches[1]);
      initialZoom = currentZoom;
    }
  }, { passive: false });
  
let zoomThrottleTimeout = null;
videoElement.addEventListener('touchmove', (e) => {
    if (isPinching && e.touches.length === 2) {
      e.preventDefault();
      
      const currentDistance = getTouchDistance(e.touches[0], e.touches[1]);
      const scale = currentDistance / initialPinchDistance;
      
      const newZoom = initialZoom * scale;
      const constraints = getZoomConstraints();
      const clampedZoom = Math.max(constraints.min, Math.min(newZoom, constraints.max));
      
      // Throttle zoom updates to every 50ms
      if (!zoomThrottleTimeout) {
        applyZoom(clampedZoom);
        zoomThrottleTimeout = setTimeout(() => {
          zoomThrottleTimeout = null;
        }, 50);
      }
    }
  }, { passive: false });
  
videoElement.addEventListener('touchend', (e) => {
    if (e.touches.length < 2) {
      if (isPinching) {
        triggerFocus();
      }
      isPinching = false;
      console.log('Pinch ended, current zoom:', currentZoom);
    }
  });
  
  videoElement.addEventListener('touchcancel', () => {
    isPinching = false;
  });
}

// Add tap-to-focus functionality
function setupTapToFocus() {
  const videoElement = document.getElementById('video');
  let longPressTimer = null;
  let isLongPress = false;
  
  videoElement.addEventListener('touchstart', (e) => {
    if (!isMenuOpen && capturedImage.style.display === 'none') {
      isLongPress = false;
      
      // Start long-press timer (500ms)
      longPressTimer = setTimeout(() => {
        isLongPress = true;
        
        // Visual feedback for long-press
        const touch = e.touches[0];
        const rect = videoElement.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        
        const captureIndicator = document.createElement('div');
        captureIndicator.style.position = 'absolute';
        captureIndicator.style.left = x + 'px';
        captureIndicator.style.top = y + 'px';
        captureIndicator.style.width = '80px';
        captureIndicator.style.height = '80px';
        captureIndicator.style.border = '3px solid #4CAF50';
        captureIndicator.style.borderRadius = '50%';
        captureIndicator.style.transform = 'translate(-50%, -50%)';
        captureIndicator.style.pointerEvents = 'none';
        captureIndicator.style.animation = 'capturePulse 0.4s ease-out';
        captureIndicator.style.zIndex = '150';
        captureIndicator.style.backgroundColor = 'rgba(76, 175, 80, 0.2)';
        
        document.getElementById('camera-container').appendChild(captureIndicator);
        
        setTimeout(() => {
          captureIndicator.remove();
        }, 400);
        
        // Take photo
        capturePhoto();
        
        // Haptic feedback if available
        if (navigator.vibrate) {
          navigator.vibrate(50);
        }
      }, 500);
    }
  });
  
  videoElement.addEventListener('touchend', (e) => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    }
    
    // If it wasn't a long press, do tap-to-focus
    if (!isLongPress && !isMenuOpen && capturedImage.style.display === 'none') {
      triggerFocus();
      
      const touch = e.changedTouches[0];
      const rect = videoElement.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      
      const focusIndicator = document.createElement('div');
      focusIndicator.style.position = 'absolute';
      focusIndicator.style.left = x + 'px';
      focusIndicator.style.top = y + 'px';
      focusIndicator.style.width = '60px';
      focusIndicator.style.height = '60px';
      focusIndicator.style.border = '2px solid #FE5F00';
      focusIndicator.style.borderRadius = '50%';
      focusIndicator.style.transform = 'translate(-50%, -50%)';
      focusIndicator.style.pointerEvents = 'none';
      focusIndicator.style.animation = 'focusPulse 0.6s ease-out';
      focusIndicator.style.zIndex = '150';
      
      document.getElementById('camera-container').appendChild(focusIndicator);
      
      setTimeout(() => {
        focusIndicator.remove();
      }, 600);
    }
  });
  
  videoElement.addEventListener('touchcancel', (e) => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    }
  });
  
  // Keep click event for non-touch devices (tap-to-focus only)
  videoElement.addEventListener('click', (e) => {
    if (!isMenuOpen && capturedImage.style.display === 'none') {
      triggerFocus();
      
      const rect = videoElement.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const focusIndicator = document.createElement('div');
      focusIndicator.style.position = 'absolute';
      focusIndicator.style.left = x + 'px';
      focusIndicator.style.top = y + 'px';
      focusIndicator.style.width = '60px';
      focusIndicator.style.height = '60px';
      focusIndicator.style.border = '2px solid #FE5F00';
      focusIndicator.style.borderRadius = '50%';
      focusIndicator.style.transform = 'translate(-50%, -50%)';
      focusIndicator.style.pointerEvents = 'none';
      focusIndicator.style.animation = 'focusPulse 0.6s ease-out';
      focusIndicator.style.zIndex = '150';
      
      document.getElementById('camera-container').appendChild(focusIndicator);
      
      setTimeout(() => {
        focusIndicator.remove();
      }, 600);
    }
  });
}

// Unified menu functions
function showUnifiedMenu() {
  const menu = document.getElementById('unified-menu');
  
  // Clear any captured image before opening menu
  if (capturedImage && capturedImage.style.display === 'block') {
    resetToCamera();
  }
  
  populateStylesList();
  // Initialize styles count display
  const stylesCountElement = document.getElementById('styles-count');
  if (stylesCountElement) {
    const { favorites, regular } = getStylesLists();
    const totalVisible = favorites.length + regular.length;
    stylesCountElement.textContent = totalVisible;
  }
  updateResolutionDisplay();
  updateBurstDisplay();
  updateMasterPromptDisplay();
  updateTimerDisplay();
  
  isMenuOpen = true;
  menuScrollEnabled = true;
  
  pauseCamera();
  cancelTimerCountdown();
  menu.style.display = 'flex';
}

async function hideUnifiedMenu() {
  isMenuOpen = false;
  menuScrollEnabled = false;
  currentMenuIndex = 0;
  styleFilterText = '';
  mainMenuFilterByCategory = ''; // Clear category filter
  document.getElementById('style-filter').value = '';
  
  // Hide category hint
  const categoryHint = document.getElementById('menu-category-hint');
  if (categoryHint) {
    categoryHint.style.display = 'none';
  }
  
  document.getElementById('unified-menu').style.display = 'none';
  await resumeCamera();
}

// Show Settings submenu
function showSettingsSubmenu() {
  const submenu = document.getElementById('settings-submenu');
  const menu = document.getElementById('unified-menu');
  
  updateResolutionDisplay();
  updateBurstDisplay();
  updateTimerDisplay();
  updateMasterPromptDisplay();
  
  menu.style.display = 'none';
  pauseCamera();
  submenu.style.display = 'flex';
  isMenuOpen = false; // ADD THIS LINE
  isSettingsSubmenuOpen = true;
  currentSettingsIndex = 0;
  
  // Highlight first item after render
  setTimeout(() => {
     updateSettingsSelection();
  }, 50);
}

// Hide Settings submenu
function hideSettingsSubmenu() {
  document.getElementById('settings-submenu').style.display = 'none';
  isSettingsSubmenuOpen = false;
  currentSettingsIndex = 0;
  showUnifiedMenu();
}

// Show Timer Settings submenu
function showTimerSettingsSubmenu() {
  const submenu = document.getElementById('timer-settings-submenu');
  const settingsMenu = document.getElementById('settings-submenu');
  
  // Load current values into UI
  const delaySlider = document.getElementById('timer-delay-slider');
  const delayValue = document.getElementById('timer-delay-value');
  const repeatCheckbox = document.getElementById('timer-repeat-enabled');
  
  if (delaySlider && delayValue) {
    const sliderIndex = timerDelayOptions.indexOf(timerDelay);
    delaySlider.value = sliderIndex !== -1 ? sliderIndex + 1 : 3;
    delayValue.textContent = timerDelay;
  }
  
  if (repeatCheckbox) {
    repeatCheckbox.checked = timerRepeatEnabled;
  }
  
  // Load repeat interval input values
  const intervalInput = document.getElementById('timer-repeat-interval-input');
  const intervalUnit = document.getElementById('timer-repeat-interval-unit');
  if (intervalInput && intervalUnit) {
    // Determine best unit and value
    if (timerRepeatInterval >= 3600 && timerRepeatInterval % 3600 === 0) {
      intervalInput.value = timerRepeatInterval / 3600;
      intervalUnit.value = '3600';
    } else if (timerRepeatInterval >= 60 && timerRepeatInterval % 60 === 0) {
      intervalInput.value = timerRepeatInterval / 60;
      intervalUnit.value = '60';
    } else {
      intervalInput.value = timerRepeatInterval;
      intervalUnit.value = '1';
    }
  }
  
  settingsMenu.style.display = 'none';
  pauseCamera();
  submenu.style.display = 'flex';
  isTimerSubmenuOpen = true;
  isSettingsSubmenuOpen = false;
}

// Hide Timer Settings submenu
function hideTimerSettingsSubmenu() {
  document.getElementById('timer-settings-submenu').style.display = 'none';
  isTimerSubmenuOpen = false;
  showSettingsSubmenu();
}

function jumpToTopOfMenu() {
  const scrollContainer = document.querySelector('.styles-menu-scroll-container');
  if (scrollContainer) {
    scrollContainer.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    // Reset selection to first item
    currentMenuIndex = 0;
    updateMenuSelection();
  }
}

function jumpToBottomOfMenu() {
  const scrollContainer = document.querySelector('.styles-menu-scroll-container');
  if (scrollContainer) {
    scrollContainer.scrollTo({
      top: scrollContainer.scrollHeight,
      behavior: 'smooth'
    });
    // Set selection to last item
    const stylesList = document.getElementById('menu-styles-list');
    if (stylesList) {
      const items = stylesList.querySelectorAll('.style-item');
      if (items.length > 0) {
        currentMenuIndex = items.length - 1;
        updateMenuSelection();
      }
    }
  }
}

function updateResolutionDisplay() {
  const display = document.getElementById('current-resolution-display');
  if (display) {
    const res = RESOLUTION_PRESETS[currentResolutionIndex];
    display.textContent = `${res.width}x${res.height}`;
  }
}

function updateBurstDisplay() {
  const display = document.getElementById('current-burst-display');
  if (display) {
    let speedLabel = 'Medium';
    for (const [key, value] of Object.entries(BURST_SPEEDS)) {
      if (value.delay === burstDelay) {
        speedLabel = value.label;
        break;
      }
    }
    display.textContent = `${burstCount} photos, ${speedLabel}`;
  }
}

function showResolutionSubmenu() {
  document.getElementById('settings-submenu').style.display = 'none';
  pauseCamera();
  
  const submenu = document.getElementById('resolution-submenu');
  const list = document.getElementById('resolution-list');
  list.innerHTML = '';
  
  RESOLUTION_PRESETS.forEach((preset, index) => {
    const item = document.createElement('div');
    item.className = 'resolution-item';
    if (index === currentResolutionIndex) {
      item.classList.add('active');
    }
    
    const name = document.createElement('span');
    name.className = 'resolution-name';
    name.textContent = preset.name;
    
    item.appendChild(name);
    
    item.onclick = () => {
      changeResolution(index);
      hideResolutionSubmenu();
    };
    
    list.appendChild(item);
  });
  
  submenu.style.display = 'flex';
  isResolutionSubmenuOpen = true;
  isSettingsSubmenuOpen = false;
  currentResolutionIndex_Menu = 0;
  
  // Update selection after render
  setTimeout(() => {
    const items = submenu.querySelectorAll('.resolution-item');
    updateResolutionMenuSelection(items);
  }, 100);
}

async function hideResolutionSubmenu() {
  document.getElementById('resolution-submenu').style.display = 'none';
  isResolutionSubmenuOpen = false;
  currentResolutionIndex_Menu = 0;
  showSettingsSubmenu();
  // await resumeCamera();
}

function showBurstSubmenu() {
  document.getElementById('settings-submenu').style.display = 'none';
  pauseCamera();
  
  const submenu = document.getElementById('burst-submenu');
  
  const countSlider = document.getElementById('burst-count-slider');
  const speedSlider = document.getElementById('burst-speed-slider');
  const countValue = document.getElementById('burst-count-value');
  const speedValue = document.getElementById('burst-speed-value');
  
  if (countSlider && countValue) {
    countSlider.value = burstCount;
    countValue.textContent = burstCount;
  }
  
  if (speedSlider && speedValue) {
    let currentSpeed = 2;
    for (const [key, value] of Object.entries(BURST_SPEEDS)) {
      if (value.delay === burstDelay) {
        currentSpeed = parseInt(key);
        break;
      }
    }
    speedSlider.value = currentSpeed;
    speedValue.textContent = BURST_SPEEDS[currentSpeed].label;
  }

  submenu.style.display = 'flex';
  isBurstSubmenuOpen = true;
  isSettingsSubmenuOpen = false;
}

async function hideBurstSubmenu() {
  document.getElementById('burst-submenu').style.display = 'none';
  isBurstSubmenuOpen = false;
  // await resumeCamera();
  showSettingsSubmenu();
}

function showMasterPromptSubmenu() {
  document.getElementById('settings-submenu').style.display = 'none';
  pauseCamera();
  
  const submenu = document.getElementById('master-prompt-submenu');
  const checkbox = document.getElementById('master-prompt-enabled');
  const textarea = document.getElementById('master-prompt-text');
  const charCount = document.getElementById('master-prompt-char-count');
  
  if (checkbox) {
    checkbox.checked = masterPromptEnabled;
  }
  
  if (textarea) {
    textarea.value = masterPromptText;
    textarea.disabled = !masterPromptEnabled;
    if (charCount) {
      charCount.textContent = masterPromptText.length;
    }
  }
  
  submenu.style.display = 'flex';
  isMasterPromptSubmenuOpen = true;
  isSettingsSubmenuOpen = false;
}

async function hideMasterPromptSubmenu() {
  document.getElementById('master-prompt-submenu').style.display = 'none';
  isMasterPromptSubmenuOpen = false;
  // await resumeCamera();
  showSettingsSubmenu();
}

function showAspectRatioSubmenu() {
  document.getElementById('settings-submenu').style.display = 'none';
  pauseCamera();
  
  const submenu = document.getElementById('aspect-ratio-submenu');
  submenu.style.display = 'flex';
  isAspectRatioSubmenuOpen = true;
  isSettingsSubmenuOpen = false;
}

async function hideAspectRatioSubmenu() {
  document.getElementById('aspect-ratio-submenu').style.display = 'none';
  isAspectRatioSubmenuOpen = false;
  showSettingsSubmenu();
}

function updateAspectRatioDisplay() {
  const display = document.getElementById('current-aspect-ratio-display');
  if (display) {
    display.textContent = selectedAspectRatio === 'none' ? 'None' : selectedAspectRatio;
  }
}

function updateMasterPromptDisplay() {
  const display = document.getElementById('current-master-prompt-display');
  if (display) {
    if (masterPromptEnabled && masterPromptText.trim()) {
      const preview = masterPromptText.substring(0, 20);
      display.textContent = `Enabled: ${preview}${masterPromptText.length > 20 ? '...' : ''}`;
    } else if (masterPromptEnabled) {
      display.textContent = 'Enabled (empty)';
    } else {
      display.textContent = 'Disabled';
    }
  }
}

function saveMasterPrompt() {
  try {
    localStorage.setItem(MASTER_PROMPT_STORAGE_KEY, masterPromptText);
    localStorage.setItem(MASTER_PROMPT_ENABLED_KEY, masterPromptEnabled.toString());
    localStorage.setItem(ASPECT_RATIO_STORAGE_KEY, selectedAspectRatio);
  } catch (err) {
    console.error('Failed to save master prompt:', err);
  }
}

function loadMasterPrompt() {
  try {
    const savedText = localStorage.getItem(MASTER_PROMPT_STORAGE_KEY);
    const savedEnabled = localStorage.getItem(MASTER_PROMPT_ENABLED_KEY);
    
    if (savedText !== null) {
      masterPromptText = savedText;
    }
    
    if (savedEnabled !== null) {
      masterPromptEnabled = savedEnabled === 'true';
    }
    
    // Load aspect ratio
    const savedAspectRatio = localStorage.getItem(ASPECT_RATIO_STORAGE_KEY);
    if (savedAspectRatio) {
      selectedAspectRatio = savedAspectRatio;
      
      // Update checkboxes
      const checkbox1_1 = document.getElementById('aspect-ratio-1-1');
      const checkbox16_9 = document.getElementById('aspect-ratio-16-9');
      
      if (checkbox1_1) checkbox1_1.checked = (selectedAspectRatio === '1:1');
      if (checkbox16_9) checkbox16_9.checked = (selectedAspectRatio === '16:9');
      
      // Update display
      const displayElement = document.getElementById('current-aspect-ratio-display');
      if (displayElement) {
        displayElement.textContent = selectedAspectRatio === 'none' ? 'None' : selectedAspectRatio;
      }
    }
  } catch (err) {
    console.error('Failed to load master prompt:', err);
  }
}

function getFinalPrompt(basePrompt) {
  let finalPrompt = basePrompt;
  
  if (masterPromptEnabled && masterPromptText.trim()) {
    finalPrompt = `${basePrompt} ${masterPromptText}`;
  }
  
  // Add aspect ratio override at the very end
  if (selectedAspectRatio === '1:1') {
    finalPrompt += ' Use a square aspect ratio.';
  } else if (selectedAspectRatio === '16:9') {
    finalPrompt += ' Use a square aspect ratio, but pad the image with black bars at top and bottom to simulate a 16:9 aspect ratio.';
  }
  
  return finalPrompt;
}

function populateStylesList(preserveScroll = false) {
    const list = document.getElementById('menu-styles-list');
    list.innerHTML = '';
    
    // Remove old event listener if it exists
    list.replaceWith(list.cloneNode(false));
    const newList = document.getElementById('menu-styles-list');
    
    const fragment = document.createDocumentFragment();
    
    const { favorites, regular } = getStylesLists();
    
    const filteredFavorites = favorites.filter(preset => {
      // First apply text search filter
      if (styleFilterText) {
        const searchText = styleFilterText.toLowerCase();
        const categoryMatch = preset.category && preset.category.some(cat => cat.toLowerCase().includes(searchText));
        const textMatch = preset.name.toLowerCase().includes(searchText) || 
               preset.message.toLowerCase().includes(searchText) ||
               categoryMatch;
        if (!textMatch) return false;
      }
      
      // Then apply category filter if active
      if (mainMenuFilterByCategory) {
        return preset.category && preset.category.includes(mainMenuFilterByCategory);
      }
      
      return true;
    });
    
    const filtered = regular.filter(preset => {
      // First apply text search filter
      if (styleFilterText) {
        const searchText = styleFilterText.toLowerCase();
        const categoryMatch = preset.category && preset.category.some(cat => cat.toLowerCase().includes(searchText));
        const textMatch = preset.name.toLowerCase().includes(searchText) || 
               preset.message.toLowerCase().includes(searchText) ||
               categoryMatch;
        if (!textMatch) return false;
      }
      
      // Then apply category filter if active
      if (mainMenuFilterByCategory) {
        return preset.category && preset.category.includes(mainMenuFilterByCategory);
      }
      
      return true;
    });

    if (filteredFavorites.length > 0) {
        const favHeader = document.createElement('h3');
        favHeader.className = 'menu-section-header';
        favHeader.textContent = '★ Favorites';
        fragment.appendChild(favHeader);

        filteredFavorites.forEach(preset => {
            const item = createStyleMenuItemFast(preset);
            fragment.appendChild(item);
        });
    }

    if (filtered.length > 0) {
        const regularHeader = document.createElement('h3');
        regularHeader.className = 'menu-section-header';
        regularHeader.textContent = styleFilterText ? 'Search Results' : 'All Styles';
        fragment.appendChild(regularHeader);
        
        filtered.forEach(preset => {
            const item = createStyleMenuItemFast(preset);
            fragment.appendChild(item);
        });
    }
    
    if (filtered.length === 0 && filteredFavorites.length === 0 && styleFilterText) {
      const emptyMsg = document.createElement('div');
      emptyMsg.className = 'menu-empty';
      emptyMsg.textContent = 'No styles found';
      fragment.appendChild(emptyMsg);
    }

    newList.appendChild(fragment);
    
    // Single event listener for the entire list using event delegation
    newList.addEventListener('click', handleStyleListClick);

// Update styles count - count from getStylesLists which already filters to visible
  const stylesCountElement = document.getElementById('styles-count');
  if (stylesCountElement) {
    const { favorites, regular } = getStylesLists();
    const totalVisible = favorites.length + regular.length;
    stylesCountElement.textContent = totalVisible;
  }
    
    if (!preserveScroll) {
        currentMenuIndex = 0;
        updateMenuSelection();
    }
}

function createStyleMenuItemFast(preset) {
    const originalIndex = CAMERA_PRESETS.findIndex(p => p === preset);
    
    const item = document.createElement('div');
    item.className = 'style-item';
    item.dataset.index = originalIndex; // Store index in data attribute
    
    if (originalIndex === currentPresetIndex) {
        item.classList.add('active');
    }
    
    const favBtn = document.createElement('button');
    favBtn.className = 'style-favorite';
    favBtn.textContent = isFavoriteStyle(preset.name) ? '⭐' : '☆';
    favBtn.dataset.action = 'favorite';
    favBtn.dataset.styleName = preset.name;
    
    const name = document.createElement('span');
    name.className = 'style-name';
    name.textContent = preset.name;
    
    const editBtn = document.createElement('button');
    editBtn.className = 'style-edit';
    
    // Check if this is a user-created preset (has internal: false)
    const isUserPreset = (preset.internal === false);
    editBtn.textContent = isUserPreset ? 'Builder' : 'Edit';
    editBtn.dataset.action = isUserPreset ? 'builder' : 'edit';
    editBtn.dataset.index = originalIndex;
    
    item.appendChild(favBtn);
    item.appendChild(name);
    item.appendChild(editBtn);
    
    return item;
}

// Add this new event delegation handler
function handleStyleListClick(e) {
    const target = e.target;
    
    // Handle favorite button click
    if (target.dataset.action === 'favorite') {
        e.stopPropagation();
        const styleName = target.dataset.styleName;
        saveFavoriteStyle(styleName);
        return;
    }
    
    // Handle edit button click
    if (target.dataset.action === 'edit') {
        e.stopPropagation();
        const index = parseInt(target.dataset.index);
        editStyle(index);
        return;
    }
    
    // Handle builder button click
    if (target.dataset.action === 'builder') {
        e.stopPropagation();
        const index = parseInt(target.dataset.index);
        editPresetInBuilder(index);
        return;
    }
    
    // Handle item click
    const item = target.closest('.style-item');
    if (item) {
        const index = parseInt(item.dataset.index);
        if (!isNaN(index)) {
            currentPresetIndex = index;
            updatePresetDisplay();
            hideUnifiedMenu();
        }
    }
}

function showStyleEditor(title = 'Add New Style') {
  const editor = document.getElementById('style-editor');
  document.getElementById('editor-title').textContent = title;
  editor.style.display = 'flex';
}

function hideStyleEditor() {
  document.getElementById('style-editor').style.display = 'none';
  document.getElementById('style-name').value = '';
  document.getElementById('style-message').value = '';
  const categoryInput = document.getElementById('style-category');
  if (categoryInput) {
    categoryInput.value = '';
  }
  document.getElementById('delete-style').style.display = 'none';
  editingStyleIndex = -1;
}

function editStyle(index) {
  editingStyleIndex = index;
  const preset = CAMERA_PRESETS[index];
  
  document.getElementById('style-name').value = preset.name;
  document.getElementById('style-message').value = preset.message;
  
  const categoryInput = document.getElementById('style-category');
  if (categoryInput) {
    categoryInput.value = preset.category ? preset.category.join(', ') : '';
  }
  
  document.getElementById('delete-style').style.display = 'block';
  
  showStyleEditor('Edit Style');
}

function saveStyle() {
  const name = document.getElementById('style-name').value.trim();
  const message = document.getElementById('style-message').value.trim();
  const categoryInput = document.getElementById('style-category').value.trim();
  
  // Parse categories from comma-separated string
  const category = categoryInput ? 
    categoryInput.split(',').map(c => c.trim().toUpperCase()).filter(c => c.length > 0) : 
    [];
  
  if (!name || !message) {
    alert('Please fill in both name and AI prompt');
    return;
  }
  
  if (editingStyleIndex >= 0) {
    const oldName = CAMERA_PRESETS[editingStyleIndex].name;
    CAMERA_PRESETS[editingStyleIndex] = { name, category, message };
    
    // If name changed, update visiblePresets array
    if (oldName !== name) {
      const visIndex = visiblePresets.indexOf(oldName);
      if (visIndex > -1) {
        visiblePresets[visIndex] = name;
        saveVisiblePresets();
      }
    }
  } else {
    CAMERA_PRESETS.push({ name, category, message });
    // ADD NEW PRESET TO VISIBLE LIST AUTOMATICALLY
    visiblePresets.push(name);
    saveVisiblePresets();
  }
  
  saveStyles();
  
  alert(editingStyleIndex >= 0 ? `Preset "${name}" updated!` : `Preset "${name}" saved!`);
  
  hideStyleEditor();
  showUnifiedMenu();
}

function deleteStyle() {
  if (editingStyleIndex >= 0 && CAMERA_PRESETS.length > 1) {
    if (confirm('Delete this style?')) {
      CAMERA_PRESETS.splice(editingStyleIndex, 1);
      
      if (currentPresetIndex >= CAMERA_PRESETS.length) {
        currentPresetIndex = CAMERA_PRESETS.length - 1;
      }
      
      saveStyles();
      hideStyleEditor();
      showUnifiedMenu();
    }
  }
}

// Generate mechanical camera shutter sound using Web Audio API
function playCameraShutterSound() {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const currentTime = audioContext.currentTime;
    
    // === INTRO: High-pitched metallic prep sound ===
    const introOsc = audioContext.createOscillator();
    const introGain = audioContext.createGain();
    const introFilter = audioContext.createBiquadFilter();
    
    introOsc.type = 'square';
    introOsc.frequency.setValueAtTime(2400, currentTime);
    introOsc.frequency.exponentialRampToValueAtTime(1800, currentTime + 0.012);
    
    introFilter.type = 'highpass';
    introFilter.frequency.setValueAtTime(1500, currentTime);
    
    introGain.gain.setValueAtTime(0.5, currentTime);
    introGain.gain.exponentialRampToValueAtTime(0.001, currentTime + 0.015);
    
    introOsc.connect(introFilter);
    introFilter.connect(introGain);
    introGain.connect(audioContext.destination);
    
    introOsc.start(currentTime);
    introOsc.stop(currentTime + 0.015);
    
    // === FIRST CLICK: Shutter opening (sharp, metallic) ===
    const click1Osc = audioContext.createOscillator();
    const click1Gain = audioContext.createGain();
    const click1Filter = audioContext.createBiquadFilter();
    
    click1Osc.type = 'square';
    click1Osc.frequency.setValueAtTime(1200, currentTime + 0.015);
    click1Osc.frequency.exponentialRampToValueAtTime(200, currentTime + 0.023);
    
    click1Filter.type = 'bandpass';
    click1Filter.frequency.setValueAtTime(1500, currentTime + 0.015);
    click1Filter.Q.setValueAtTime(2, currentTime + 0.015);
    
    click1Gain.gain.setValueAtTime(0.4, currentTime + 0.015);
    click1Gain.gain.exponentialRampToValueAtTime(0.001, currentTime + 0.030);
    
    click1Osc.connect(click1Filter);
    click1Filter.connect(click1Gain);
    click1Gain.connect(audioContext.destination);
    
    click1Osc.start(currentTime + 0.015);
    click1Osc.stop(currentTime + 0.030);
    
    // === MECHANICAL RATTLE: Spring tension ===
    const rattleOsc = audioContext.createOscillator();
    const rattleGain = audioContext.createGain();
    
    rattleOsc.type = 'triangle';
    rattleOsc.frequency.setValueAtTime(400, currentTime + 0.023);
    rattleOsc.frequency.setValueAtTime(450, currentTime + 0.027);
    rattleOsc.frequency.setValueAtTime(380, currentTime + 0.031);
    rattleOsc.frequency.setValueAtTime(420, currentTime + 0.035);
    
    rattleGain.gain.setValueAtTime(0, currentTime + 0.023);
    rattleGain.gain.linearRampToValueAtTime(0.15, currentTime + 0.025);
    rattleGain.gain.exponentialRampToValueAtTime(0.001, currentTime + 0.040);
    
    rattleOsc.connect(rattleGain);
    rattleGain.connect(audioContext.destination);
    
    rattleOsc.start(currentTime + 0.023);
    rattleOsc.stop(currentTime + 0.040);
    
    // === SECOND CLICK: Shutter closing (deeper, firm) ===
    const click2Osc = audioContext.createOscillator();
    const click2Gain = audioContext.createGain();
    const click2Filter = audioContext.createBiquadFilter();
    
    click2Osc.type = 'square';
    click2Osc.frequency.setValueAtTime(800, currentTime + 0.050);
    click2Osc.frequency.exponentialRampToValueAtTime(150, currentTime + 0.060);
    
    click2Filter.type = 'bandpass';
    click2Filter.frequency.setValueAtTime(1000, currentTime + 0.050);
    click2Filter.Q.setValueAtTime(2, currentTime + 0.050);
    
    click2Gain.gain.setValueAtTime(0.5, currentTime + 0.050);
    click2Gain.gain.exponentialRampToValueAtTime(0.001, currentTime + 0.070);
    
    click2Osc.connect(click2Filter);
    click2Filter.connect(click2Gain);
    click2Gain.connect(audioContext.destination);
    
    click2Osc.start(currentTime + 0.050);
    click2Osc.stop(currentTime + 0.070);
    
    // === METAL RESONANCE: Body vibration ===
    const resonanceOsc = audioContext.createOscillator();
    const resonanceGain = audioContext.createGain();
    const resonanceFilter = audioContext.createBiquadFilter();
    
    resonanceOsc.type = 'sine';
    resonanceOsc.frequency.setValueAtTime(180, currentTime + 0.050);
    resonanceOsc.frequency.exponentialRampToValueAtTime(120, currentTime + 0.095);
    
    resonanceFilter.type = 'lowpass';
    resonanceFilter.frequency.setValueAtTime(300, currentTime + 0.050);
    
    resonanceGain.gain.setValueAtTime(0, currentTime + 0.050);
    resonanceGain.gain.linearRampToValueAtTime(0.2, currentTime + 0.055);
    resonanceGain.gain.exponentialRampToValueAtTime(0.001, currentTime + 0.105);
    
    resonanceOsc.connect(resonanceFilter);
    resonanceFilter.connect(resonanceGain);
    resonanceGain.connect(audioContext.destination);
    
    resonanceOsc.start(currentTime + 0.050);
    resonanceOsc.stop(currentTime + 0.105);
    
    // === FILM ADVANCE: Mechanical winding ===
    const bufferSize = audioContext.sampleRate * 0.08;
    const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      // Create rhythmic noise pattern for gear sound
      const rhythm = Math.sin(i / 200) * 0.5 + 0.5;
      output[i] = (Math.random() * 2 - 1) * rhythm;
    }
    
    const noiseSource = audioContext.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    
    const noiseFilter = audioContext.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(3000, currentTime + 0.070);
    noiseFilter.Q.setValueAtTime(1, currentTime + 0.070);
    
    const noiseGain = audioContext.createGain();
    noiseGain.gain.setValueAtTime(0, currentTime + 0.070);
    noiseGain.gain.linearRampToValueAtTime(0.12, currentTime + 0.075);
    noiseGain.gain.linearRampToValueAtTime(0.12, currentTime + 0.125);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, currentTime + 0.150);
    
    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(audioContext.destination);
    
    noiseSource.start(currentTime + 0.070);
    noiseSource.stop(currentTime + 0.150);
    
    // === FINAL LOCK CLICK: Winding complete ===
    const lockOsc = audioContext.createOscillator();
    const lockGain = audioContext.createGain();
    
    lockOsc.type = 'square';
    lockOsc.frequency.setValueAtTime(600, currentTime + 0.145);
    lockOsc.frequency.exponentialRampToValueAtTime(100, currentTime + 0.155);
    
    lockGain.gain.setValueAtTime(0.25, currentTime + 0.145);
    lockGain.gain.exponentialRampToValueAtTime(0.001, currentTime + 0.165);
    
    lockOsc.connect(lockGain);
    lockGain.connect(audioContext.destination);
    
    lockOsc.start(currentTime + 0.145);
    lockOsc.stop(currentTime + 0.165);
    
  } catch (err) {
    console.log('Audio generation failed:', err);
  }
}

// Initialize on load
window.addEventListener('load', () => {
  loadStyles();
  loadMasterPrompt();
  setupPinchZoom();
  setupTapToFocus();
  
  const startBtn = document.getElementById('start-button');
if (startBtn) {
  startBtn.addEventListener('click', () => {
    // Play shutter sound
    playCameraShutterSound();
    
    // Add camera flash effect
    const cameraBody = document.querySelector('.camera-body');
    if (cameraBody) {
      cameraBody.style.transition = 'all 0.1s';
      cameraBody.style.boxShadow = '0 0 50px rgba(255, 255, 255, 1)';
      setTimeout(() => {
        cameraBody.style.boxShadow = '';
      }, 100);
    }
    
    // Add lens snap effect
    const lensInner = document.querySelector('.lens-inner');
    if (lensInner) {
      lensInner.style.transition = 'all 0.05s';
      lensInner.style.transform = 'translate(-50%, -50%) scale(0.95)';
      setTimeout(() => {
        lensInner.style.transform = 'translate(-50%, -50%) scale(1)';
      }, 50);
    }
    
    // Initialize camera after brief delay for effect
    setTimeout(() => {
      initCamera();
    }, 300);
  });
}

  const burstToggleBtn = document.getElementById('burst-toggle');
  if (burstToggleBtn) {
    burstToggleBtn.addEventListener('click', toggleBurstMode);
  }

  const timerToggleBtn = document.getElementById('timer-toggle');
  if (timerToggleBtn) {
    timerToggleBtn.addEventListener('click', toggleTimerMode);
  }
  
  const randomToggleBtn = document.getElementById('random-toggle');
  if (randomToggleBtn) {
    randomToggleBtn.addEventListener('click', toggleRandomMode);
  }

  const motionToggleBtn = document.getElementById('motion-toggle');
  if (motionToggleBtn) {
    motionToggleBtn.addEventListener('click', toggleMotionDetection);
  }
  
  const menuBtn = document.getElementById('menu-button');
  if (menuBtn) {
    menuBtn.addEventListener('click', showUnifiedMenu);
  }
  
  const closeMenuBtn = document.getElementById('close-menu');
  if (closeMenuBtn) {
    closeMenuBtn.addEventListener('click', hideUnifiedMenu);
  }

  const jumpToTopBtn = document.getElementById('jump-to-top');
  if (jumpToTopBtn) {
    jumpToTopBtn.addEventListener('click', jumpToTopOfMenu);
  }
  
  const jumpToBottomBtn = document.getElementById('jump-to-bottom');
  if (jumpToBottomBtn) {
    jumpToBottomBtn.addEventListener('click', jumpToBottomOfMenu);
  }
  
  const settingsMenuBtn = document.getElementById('settings-menu-button');
  if (settingsMenuBtn) {
    settingsMenuBtn.addEventListener('click', showSettingsSubmenu);
  }
  
  const settingsBackBtn = document.getElementById('settings-back');
  if (settingsBackBtn) {
    settingsBackBtn.addEventListener('click', hideSettingsSubmenu);
  }
  
  const resolutionSettingsBtn = document.getElementById('resolution-settings-button');
  if (resolutionSettingsBtn) {
    resolutionSettingsBtn.addEventListener('click', showResolutionSubmenu);
  }
  
  const resolutionBackBtn = document.getElementById('resolution-back');
  if (resolutionBackBtn) {
    resolutionBackBtn.addEventListener('click', hideResolutionSubmenu);
  }
  
  const burstSettingsBtn = document.getElementById('burst-settings-button');
  if (burstSettingsBtn) {
    burstSettingsBtn.addEventListener('click', showBurstSubmenu);
  }
  
  const burstBackBtn = document.getElementById('burst-back');
  if (burstBackBtn) {
    burstBackBtn.addEventListener('click', hideBurstSubmenu);
  }

  const timerSettingsBtn = document.getElementById('timer-settings-button');
  if (timerSettingsBtn) {
    timerSettingsBtn.addEventListener('click', showTimerSettingsSubmenu);
  }
  
  const timerSettingsBackBtn = document.getElementById('timer-settings-back');
  if (timerSettingsBackBtn) {
    timerSettingsBackBtn.addEventListener('click', hideTimerSettingsSubmenu);
  }
 
  const masterPromptSettingsBtn = document.getElementById('master-prompt-settings-button');
  if (masterPromptSettingsBtn) {
    masterPromptSettingsBtn.addEventListener('click', showMasterPromptSubmenu);
  }
  
  const masterPromptBackBtn = document.getElementById('master-prompt-back');
  if (masterPromptBackBtn) {
    masterPromptBackBtn.addEventListener('click', hideMasterPromptSubmenu);
  }
  
  const aspectRatioSettingsBtn = document.getElementById('aspect-ratio-settings-button');
  if (aspectRatioSettingsBtn) {
    aspectRatioSettingsBtn.addEventListener('click', showAspectRatioSubmenu);
  }
  
  const aspectRatioBackBtn = document.getElementById('aspect-ratio-back');
  if (aspectRatioBackBtn) {
    aspectRatioBackBtn.addEventListener('click', hideAspectRatioSubmenu);
  }
  
  // Aspect ratio checkboxes - make them mutually exclusive
  const aspectRatio1_1 = document.getElementById('aspect-ratio-1-1');
  const aspectRatio16_9 = document.getElementById('aspect-ratio-16-9');
  
  if (aspectRatio1_1) {
    aspectRatio1_1.addEventListener('change', (e) => {
      if (e.target.checked) {
        selectedAspectRatio = '1:1';
        if (aspectRatio16_9) aspectRatio16_9.checked = false;
      } else {
        selectedAspectRatio = 'none';
      }
      saveMasterPrompt();
      updateAspectRatioDisplay();
    });
  }
  
  if (aspectRatio16_9) {
    aspectRatio16_9.addEventListener('change', (e) => {
      if (e.target.checked) {
        selectedAspectRatio = '16:9';
        if (aspectRatio1_1) aspectRatio1_1.checked = false;
      } else {
        selectedAspectRatio = 'none';
      }
      saveMasterPrompt();
      updateAspectRatioDisplay();
    });
  }

  const motionSettingsBtn = document.getElementById('motion-settings-button');
  if (motionSettingsBtn) {
    motionSettingsBtn.addEventListener('click', showMotionSubmenu);
  }
  
  const motionBackBtn = document.getElementById('motion-back');
  if (motionBackBtn) {
    motionBackBtn.addEventListener('click', hideMotionSubmenu);
  }

  const visiblePresetsSettingsBtn = document.getElementById('visible-presets-settings-button');
  if (visiblePresetsSettingsBtn) {
    visiblePresetsSettingsBtn.addEventListener('click', showVisiblePresetsSubmenu);
  }
  
  const visiblePresetsBackBtn = document.getElementById('visible-presets-back');
  if (visiblePresetsBackBtn) {
    visiblePresetsBackBtn.addEventListener('click', hideVisiblePresetsSubmenu);
  }

  // Preset Builder
  const presetBuilderBtn = document.getElementById('preset-builder-button');
  if (presetBuilderBtn) {
    presetBuilderBtn.addEventListener('click', showPresetBuilderSubmenu);
  }
  
  const presetBuilderBack = document.getElementById('preset-builder-back');
  if (presetBuilderBack) {
    presetBuilderBack.addEventListener('click', hidePresetBuilderSubmenu);
  }
  
  // Enable scroll for preset builder
  const presetBuilderJumpUp = document.getElementById('preset-builder-jump-up');
  if (presetBuilderJumpUp) {
    presetBuilderJumpUp.addEventListener('click', scrollPresetBuilderUp);
  }
  
  const presetBuilderJumpDown = document.getElementById('preset-builder-jump-down');
  if (presetBuilderJumpDown) {
    presetBuilderJumpDown.addEventListener('click', scrollPresetBuilderDown);
  }
  
  const presetBuilderTemplate = document.getElementById('preset-builder-template');
  if (presetBuilderTemplate) {
    presetBuilderTemplate.addEventListener('change', handleTemplateSelection);
  }
  
  // Handle Enter key navigation in preset builder
  const presetBuilderName = document.getElementById('preset-builder-name');
  if (presetBuilderName) {
    presetBuilderName.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        document.getElementById('preset-builder-category')?.focus();
      }
    });
  }
  
  const presetBuilderCategory = document.getElementById('preset-builder-category');
  const categoryAutocomplete = document.getElementById('category-autocomplete');
  
  if (presetBuilderCategory && categoryAutocomplete) {
    // Show autocomplete suggestions
    const showCategorySuggestions = () => {
      const inputValue = presetBuilderCategory.value;
      const lastComma = inputValue.lastIndexOf(',');
      const currentCategory = (lastComma >= 0 ? inputValue.substring(lastComma + 1) : inputValue).trim().toUpperCase();
      
      const allCategories = getAllCategories();
      const filteredCategories = currentCategory 
        ? allCategories.filter(cat => cat.includes(currentCategory))
        : allCategories;
      
      if (filteredCategories.length > 0) {
        categoryAutocomplete.innerHTML = filteredCategories
          .map(cat => `<div class="category-autocomplete-item" data-category="${cat}">${cat}</div>`)
          .join('');
        categoryAutocomplete.style.display = 'block';
      } else {
        categoryAutocomplete.style.display = 'none';
      }
    };
    
    // Insert selected category
    const insertCategory = (category) => {
      const inputValue = presetBuilderCategory.value;
      const lastComma = inputValue.lastIndexOf(',');
      
      if (lastComma >= 0) {
        // Replace the last category after the comma
        presetBuilderCategory.value = inputValue.substring(0, lastComma + 1) + ' ' + category + ', ';
      } else {
        // Replace entire input
        presetBuilderCategory.value = category + ', ';
      }
      
      categoryAutocomplete.style.display = 'none';
      presetBuilderCategory.focus();
    };
    
    // Show suggestions on input
    presetBuilderCategory.addEventListener('input', showCategorySuggestions);
    
    // Show suggestions on focus
    presetBuilderCategory.addEventListener('focus', showCategorySuggestions);
    
    // Handle clicking on autocomplete items
    categoryAutocomplete.addEventListener('click', (e) => {
      if (e.target.classList.contains('category-autocomplete-item')) {
        const category = e.target.getAttribute('data-category');
        insertCategory(category);
      }
    });
    
    // Hide autocomplete when clicking outside
    document.addEventListener('click', (e) => {
      if (!presetBuilderCategory.contains(e.target) && !categoryAutocomplete.contains(e.target)) {
        categoryAutocomplete.style.display = 'none';
      }
    });
    
    // Handle Enter key
    presetBuilderCategory.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        categoryAutocomplete.style.display = 'none';
        document.getElementById('preset-builder-template')?.focus();
      }
    });
  }
  
  const presetBuilderSave = document.getElementById('preset-builder-save');
  if (presetBuilderSave) {
    presetBuilderSave.addEventListener('click', saveCustomPreset);
  }
  
  const presetBuilderClear = document.getElementById('preset-builder-clear');
  if (presetBuilderClear) {
    presetBuilderClear.addEventListener('click', clearPresetBuilderForm);
  }

  const presetBuilderDelete = document.getElementById('preset-builder-delete');
  if (presetBuilderDelete) {
    presetBuilderDelete.addEventListener('click', deleteCustomPreset);
  }

  // Collapsible chip sections
  const chipSectionHeaders = document.querySelectorAll('.chip-section-header');
  chipSectionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const section = header.getAttribute('data-section');
      const content = document.getElementById('section-' + section);
      const isExpanded = content.style.display === 'block';
      
      // Close all sections
      document.querySelectorAll('.chip-section-content').forEach(c => {
        c.style.display = 'none';
      });
      document.querySelectorAll('.chip-section-header').forEach(h => {
        h.classList.remove('expanded');
      });
      
      // Toggle current section
      if (!isExpanded) {
        content.style.display = 'block';
        header.classList.add('expanded');
      }
    });
  });

  // Preset Builder chip buttons
  const presetChips = document.querySelectorAll('.preset-chip');
  presetChips.forEach(chip => {
    chip.addEventListener('click', (e) => {
      const textToAdd = e.target.getAttribute('data-text');
      const promptTextarea = document.getElementById('preset-builder-prompt');
      const currentText = promptTextarea.value;
      
      // Add text at the end
      if (currentText.trim()) {
        promptTextarea.value = currentText + ' ' + textToAdd;
      } else {
        promptTextarea.value = textToAdd;
      }
      
      // Scroll to bottom of textarea
      promptTextarea.scrollTop = promptTextarea.scrollHeight;
    });
  });
  
   // Quality dropdown
  const qualitySelect = document.getElementById('preset-builder-quality');
  if (qualitySelect) {
    qualitySelect.addEventListener('change', (e) => {
      const textToAdd = e.target.value;
      if (textToAdd) {
        const promptTextarea = document.getElementById('preset-builder-prompt');
        const currentText = promptTextarea.value;
        
        if (currentText.trim()) {
          promptTextarea.value = currentText + ' ' + textToAdd;
        } else {
          promptTextarea.value = textToAdd;
        }
        
        // Reset dropdown
        e.target.value = '';
        promptTextarea.scrollTop = promptTextarea.scrollHeight;
      }
    });
  }

  const visiblePresetsFilter = document.getElementById('visible-presets-filter');
  if (visiblePresetsFilter) {
    visiblePresetsFilter.addEventListener('input', (e) => {
      visiblePresetsFilterText = e.target.value;
      populateVisiblePresetsList();
    });
  }
  
  const visiblePresetsSelectAll = document.getElementById('visible-presets-select-all');
  if (visiblePresetsSelectAll) {
    visiblePresetsSelectAll.addEventListener('click', () => {
      const allPresets = CAMERA_PRESETS.filter(p => !p.internal);
      visiblePresets = allPresets.map(p => p.name);
      saveVisiblePresets();
      populateVisiblePresetsList();
      updateVisiblePresetsDisplay();
      if (isMenuOpen) populateStylesList();
    });
  }
  
  const visiblePresetsDeselectAll = document.getElementById('visible-presets-deselect-all');
  if (visiblePresetsDeselectAll) {
    visiblePresetsDeselectAll.addEventListener('click', () => {
      visiblePresets = [];
      saveVisiblePresets();
      populateVisiblePresetsList();
      updateVisiblePresetsDisplay();
      if (isMenuOpen) populateStylesList();
    });
  }
  
  const visiblePresetsJumpUp = document.getElementById('visible-presets-jump-up');
  if (visiblePresetsJumpUp) {
    visiblePresetsJumpUp.addEventListener('click', () => {
      currentVisiblePresetsIndex = 0;
      updateVisiblePresetsSelection();
    });
  }
  
  const visiblePresetsJumpDown = document.getElementById('visible-presets-jump-down');
  if (visiblePresetsJumpDown) {
    visiblePresetsJumpDown.addEventListener('click', () => {
      const list = document.getElementById('visible-presets-list');
      if (list) {
        const items = list.querySelectorAll('.style-item');
        if (items.length > 0) {
          currentVisiblePresetsIndex = items.length - 1;
          updateVisiblePresetsSelection();
        }
      }
    });
  }

  // White Balance Settings
  const whiteBalanceSettingsBtn = document.getElementById('white-balance-settings-button');
  if (whiteBalanceSettingsBtn) {
    whiteBalanceSettingsBtn.addEventListener('click', showWhiteBalanceSubmenu);
  }
  
  const whiteBalanceBackBtn = document.getElementById('white-balance-back');
  if (whiteBalanceBackBtn) {
    whiteBalanceBackBtn.addEventListener('click', hideWhiteBalanceSubmenu);
  }

  const motionSensitivitySlider = document.getElementById('motion-sensitivity-slider');
  const motionSensitivityValue = document.getElementById('motion-sensitivity-value');
  if (motionSensitivitySlider && motionSensitivityValue) {
    const sensitivityLabels = ['Very Low', 'Low', 'Medium', 'High', 'Very High'];
    motionSensitivitySlider.addEventListener('input', (e) => {
      const level = parseInt(e.target.value);
      motionSensitivityValue.textContent = sensitivityLabels[level - 1];
      // Convert slider (1-5) to threshold (50-10)
      motionThreshold = 50 - (level * 10);
      saveMotionSettings();
      updateMotionDisplay();
    });
  }
  
  const motionContinuousCheckbox = document.getElementById('motion-continuous-enabled');
  if (motionContinuousCheckbox) {
    motionContinuousCheckbox.addEventListener('change', (e) => {
      motionContinuousEnabled = e.target.checked;
      saveMotionSettings();
    });
  }
  
  const motionCooldownSlider = document.getElementById('motion-cooldown-slider');
  const motionCooldownValue = document.getElementById('motion-cooldown-value');
  if (motionCooldownSlider && motionCooldownValue) {
    motionCooldownSlider.addEventListener('input', (e) => {
      motionCooldown = parseInt(e.target.value);
      motionCooldownValue.textContent = `${motionCooldown}s`;
      saveMotionSettings();
    });
  }

  const motionStartDelaySlider = document.getElementById('motion-start-delay-slider');
  const motionStartDelayValue = document.getElementById('motion-start-delay-value');
  if (motionStartDelaySlider && motionStartDelayValue) {
    motionStartDelaySlider.addEventListener('input', (e) => {
      const key = parseInt(e.target.value);
      motionStartDelay = MOTION_START_DELAYS[key].seconds;
      motionStartDelayValue.textContent = MOTION_START_DELAYS[key].label;
      saveMotionSettings();
    });
  }

  const noMagicToggleBtn = document.getElementById('no-magic-toggle-button');
  if (noMagicToggleBtn) {
    noMagicToggleBtn.addEventListener('click', toggleNoMagicMode);
  }

  const tutorialBtn = document.getElementById('tutorial-button');
  if (tutorialBtn) {
    tutorialBtn.addEventListener('click', showTutorialSubmenu);
  }
  
  const tutorialBackBtn = document.getElementById('tutorial-back');
  if (tutorialBackBtn) {
    tutorialBackBtn.addEventListener('click', hideTutorialSubmenu);
  }
  
  // Glossary navigation
  const glossaryItems = document.querySelectorAll('.glossary-item');
  glossaryItems.forEach(item => {
    item.addEventListener('click', () => {
      const sectionId = item.getAttribute('data-section');
      showTutorialSection(sectionId);
    });
  });
  
  const backToGlossaryBtn = document.getElementById('back-to-glossary');
  if (backToGlossaryBtn) {
    backToGlossaryBtn.addEventListener('click', showTutorialGlossary);
  }

  const masterPromptCheckbox = document.getElementById('master-prompt-enabled');
  if (masterPromptCheckbox) {
    masterPromptCheckbox.addEventListener('change', (e) => {
      masterPromptEnabled = e.target.checked;
      const textarea = document.getElementById('master-prompt-text');
      if (textarea) {
        textarea.disabled = !masterPromptEnabled;
      }
      saveMasterPrompt();
      updateMasterPromptDisplay();
    });
  }
  
  const masterPromptTextarea = document.getElementById('master-prompt-text');
  if (masterPromptTextarea) {
    masterPromptTextarea.addEventListener('input', (e) => {
      masterPromptText = e.target.value;
      const charCount = document.getElementById('master-prompt-char-count');
      if (charCount) {
        charCount.textContent = masterPromptText.length;
      }
      saveMasterPrompt();
      updateMasterPromptDisplay();
    });
  }

  const styleFilter = document.getElementById('style-filter');
  let filterDebounceTimeout = null;
  if (styleFilter) {
    styleFilter.addEventListener('input', (e) => {
      styleFilterText = e.target.value;
      
      // Debounce filter updates
      if (filterDebounceTimeout) clearTimeout(filterDebounceTimeout);
      filterDebounceTimeout = setTimeout(() => {
        populateStylesList();
      }, 150); // Wait 150ms after user stops typing
    });
  }
   
  const burstCountSlider = document.getElementById('burst-count-slider');
  const burstSpeedSlider = document.getElementById('burst-speed-slider');
  
  if (burstCountSlider) {
    burstCountSlider.addEventListener('input', (e) => {
      burstCount = parseInt(e.target.value);
      document.getElementById('burst-count-value').textContent = burstCount;
      
      const speedKey = parseInt(burstSpeedSlider.value);
      saveBurstSettings(burstCount, speedKey);
      updateBurstDisplay();
      
      if (isBurstMode) {
        statusElement.textContent = `Burst mode ON (${burstCount} photos) • ${CAMERA_PRESETS[currentPresetIndex].name}`;
      }
    });
  }
  
  if (burstSpeedSlider) {
    burstSpeedSlider.addEventListener('input', (e) => {
      const speedKey = parseInt(e.target.value);
      burstDelay = BURST_SPEEDS[speedKey].delay;
      document.getElementById('burst-speed-value').textContent = BURST_SPEEDS[speedKey].label;
      
      saveBurstSettings(burstCount, speedKey);
      updateBurstDisplay();
    });
  }

  // Timer settings listeners
  const timerDelaySlider = document.getElementById('timer-delay-slider');
  const timerDelayValue = document.getElementById('timer-delay-value');
  if (timerDelaySlider && timerDelayValue) {
    timerDelaySlider.addEventListener('input', (e) => {
      const index = parseInt(e.target.value) - 1;
      timerDelay = timerDelayOptions[index];
      timerDelayValue.textContent = timerDelay;
      saveTimerSettings();
      updateTimerDisplay();
    });
  }
  
  const timerRepeatCheckbox = document.getElementById('timer-repeat-enabled');
  if (timerRepeatCheckbox) {
    timerRepeatCheckbox.addEventListener('change', (e) => {
      timerRepeatEnabled = e.target.checked;
      saveTimerSettings();
      updateTimerDisplay();
    });
  }

  // Timer repeat interval input
  const timerRepeatIntervalInput = document.getElementById('timer-repeat-interval-input');
  const timerRepeatIntervalUnit = document.getElementById('timer-repeat-interval-unit');
  if (timerRepeatIntervalInput && timerRepeatIntervalUnit) {
    const updateRepeatInterval = () => {
      const value = parseInt(timerRepeatIntervalInput.value) || 1;
      const multiplier = parseInt(timerRepeatIntervalUnit.value);
      timerRepeatInterval = value * multiplier;
      saveTimerSettings();
      updateTimerDisplay();
    };
    
    timerRepeatIntervalInput.addEventListener('input', updateRepeatInterval);
    timerRepeatIntervalUnit.addEventListener('change', updateRepeatInterval);
  }

  loadBurstSettings();
  loadTimerSettings();
  loadMotionSettings();
  loadNoMagicMode();

  const resetBtn = document.getElementById('reset-button');
  if (resetBtn) {
    resetBtn.addEventListener('click', resetToCamera);
  }
  
  const cameraBtn = document.getElementById('camera-button');
  if (cameraBtn) {
    cameraBtn.addEventListener('click', switchCamera);
  }
  
  const closeEditorBtn = document.getElementById('close-editor');
  if (closeEditorBtn) {
    closeEditorBtn.addEventListener('click', hideStyleEditor);
  }
  
  const saveStyleBtn = document.getElementById('save-style');
  if (saveStyleBtn) {
    saveStyleBtn.addEventListener('click', saveStyle);
  }
  
  const deleteStyleBtn = document.getElementById('delete-style');
  if (deleteStyleBtn) {
    deleteStyleBtn.addEventListener('click', deleteStyle);
  }
  
  connectionStatusElement = document.getElementById('connection-status');
  queueStatusElement = document.getElementById('queue-status');
  syncButton = document.getElementById('sync-button');
  
  if (syncButton) {
    syncButton.addEventListener('click', syncQueuedPhotos);
  }
  
  if (queueStatusElement) {
    queueStatusElement.addEventListener('click', showQueueManager);
  }
  
  const closeQueueBtn = document.getElementById('close-queue-manager');
  if (closeQueueBtn) {
    closeQueueBtn.addEventListener('click', hideQueueManager);
  }
  
  const syncAllBtn = document.getElementById('sync-all');
  if (syncAllBtn) {
    syncAllBtn.addEventListener('click', syncQueuedPhotos);
  }
  
  const clearQueueBtn = document.getElementById('clear-queue');
  if (clearQueueBtn) {
    clearQueueBtn.addEventListener('click', clearQueue);
  }
  
  const galleryBtn = document.getElementById('gallery-button');
  if (galleryBtn) {
    galleryBtn.addEventListener('click', showGallery);
  }
  
  const closeGalleryBtn = document.getElementById('close-gallery');
  if (closeGalleryBtn) {
    closeGalleryBtn.addEventListener('click', hideGallery);
  }
  
  const closeViewerBtn = document.getElementById('close-viewer');
  if (closeViewerBtn) {
    closeViewerBtn.addEventListener('click', closeImageViewer);
  }
  
  const deleteViewerBtn = document.getElementById('delete-viewer-image');
  if (deleteViewerBtn) {
    deleteViewerBtn.addEventListener('click', deleteViewerImage);
  }
  
  const startDateBtn = document.getElementById('gallery-start-date-btn');
  const startDateInput = document.getElementById('gallery-start-date');
  if (startDateBtn && startDateInput) {
    startDateBtn.addEventListener('click', () => {
      startDateInput.showPicker();
    });
    startDateInput.addEventListener('change', (e) => {
      galleryStartDate = e.target.value || null;
      updateDateButtonText('start', galleryStartDate);
      onGalleryFilterChange();
    });
  }
  
  const endDateBtn = document.getElementById('gallery-end-date-btn');
  const endDateInput = document.getElementById('gallery-end-date');
  if (endDateBtn && endDateInput) {
    endDateBtn.addEventListener('click', () => {
      endDateInput.showPicker();
    });
    endDateInput.addEventListener('change', (e) => {
      galleryEndDate = e.target.value || null;
      updateDateButtonText('end', galleryEndDate);
      onGalleryFilterChange();
    });
  }
  
  const sortOrderSelect = document.getElementById('gallery-sort-order');
  if (sortOrderSelect) {
    sortOrderSelect.addEventListener('change', (e) => {
      gallerySortOrder = e.target.value;
      // Save sort order preference
      try {
        localStorage.setItem(GALLERY_SORT_ORDER_KEY, gallerySortOrder);
      } catch (err) {
        console.error('Failed to save sort order:', err);
      }
      onGalleryFilterChange();
    });
  }
  
  const prevPageBtn = document.getElementById('prev-page');
  if (prevPageBtn) {
    prevPageBtn.addEventListener('click', prevGalleryPage);
  }
  
  const nextPageBtn = document.getElementById('next-page');
  if (nextPageBtn) {
    nextPageBtn.addEventListener('click', nextGalleryPage);
  }
  
  const loadPresetBtn = document.getElementById('load-preset-button');
  if (loadPresetBtn) {
    loadPresetBtn.addEventListener('click', showPresetSelector);
  }
  
  const multiPresetBtn = document.getElementById('multi-preset-button');
  if (multiPresetBtn) {
    multiPresetBtn.addEventListener('click', () => {
      if (currentViewerImageIndex >= 0) {
        const imageId = galleryImages[currentViewerImageIndex].id;
        openMultiPresetSelector(imageId);
      }
    });
  }

  const closePresetSelectorBtn = document.getElementById('close-preset-selector');
  if (closePresetSelectorBtn) {
    closePresetSelectorBtn.addEventListener('click', hidePresetSelector);
  }
  
  const presetFilter = document.getElementById('preset-filter');
  if (presetFilter) {
    presetFilter.addEventListener('input', (e) => {
      presetFilterText = e.target.value;
      populatePresetList();
    });
  }
  
  const presetSelectorJumpUp = document.getElementById('preset-selector-jump-up');
  if (presetSelectorJumpUp) {
    presetSelectorJumpUp.addEventListener('click', () => {
      currentPresetIndex_Gallery = 0;
      updatePresetSelection();
    });
  }
  
  const presetSelectorJumpDown = document.getElementById('preset-selector-jump-down');
  if (presetSelectorJumpDown) {
    presetSelectorJumpDown.addEventListener('click', () => {
      const list = document.getElementById('preset-list');
      if (list) {
        const items = list.querySelectorAll('.preset-item');
        if (items.length > 0) {
          currentPresetIndex_Gallery = items.length - 1;
          updatePresetSelection();
        }
      }
    });
  }

  const magicBtn = document.getElementById('magic-button');
  if (magicBtn) {
    magicBtn.addEventListener('click', submitMagicTransform);
  }
  
  const batchModeToggle = document.getElementById('batch-mode-toggle');
  if (batchModeToggle) {
    batchModeToggle.addEventListener('click', toggleBatchMode);
  }

  const batchSelectAll = document.getElementById('batch-select-all');
  if (batchSelectAll) {
    batchSelectAll.addEventListener('click', selectAllBatchImages);
  }

  const batchDeselectAll = document.getElementById('batch-deselect-all');
  if (batchDeselectAll) {
    batchDeselectAll.addEventListener('click', deselectAllBatchImages);
  }

  const batchCancel = document.getElementById('batch-cancel');
  if (batchCancel) {
    batchCancel.addEventListener('click', toggleBatchMode);
  }

  const batchApplyPreset = document.getElementById('batch-apply-preset');
  if (batchApplyPreset) {
    batchApplyPreset.addEventListener('click', applyPresetToBatch);
  }

  const batchDelete = document.getElementById('batch-delete');
  if (batchDelete) {
    batchDelete.addEventListener('click', batchDeleteImages);
  }

  // Initialize IndexedDB and load gallery
  initDB().then(async () => {
    // Check if we need to migrate from localStorage
    const oldIndexJson = localStorage.getItem('r1_gallery_index');
    if (oldIndexJson) {
      console.log('Migrating old gallery data...');
      await migrateFromLocalStorage();
    } else {
      await loadGallery();
    }
  }).catch(err => {
    console.error('Failed to initialize database:', err);
  });
  setupViewerPinchZoom();

});

// Make functions available globally for inline onclick handlers
window.removeFromQueue = removeFromQueue;
window.previewQueueItem = previewQueueItem;
window.clearQueue = clearQueue;

console.log('AI Camera Styles app initialized!');
