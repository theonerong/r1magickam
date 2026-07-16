import { presetStorage } from './storage.js';
import { presetImporter, earnCredit, unlockAllPresets, getCredits, resetCredits, presetsAreDifferent, getCustomPresetSources, saveCustomPresetSources, getDefaultPresetEnabled, saveDefaultPresetEnabled } from './preset-import.js';

// Accent-insensitive search helper — strips diacritics so "cafe" finds "café"
// NFC → NFD decomposes accented chars; removing \u0300-\u036F strips the accent marks.
// The resulting string is the same length as the NFC original, so character positions align.
function stripAccents(str) {
  return (str || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// Loading overlay helpers 

function showLoadingOverlay(label) {
  let overlay = document.getElementById('mk-loading-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'mk-loading-overlay';
    overlay.className = 'mk-loading-overlay';
    overlay.innerHTML = '<div class="mk-loading-spinner"></div><div class="mk-loading-label" id="mk-loading-label"></div>';
    document.body.appendChild(overlay);
  }
  const labelEl = document.getElementById('mk-loading-label');
  if (labelEl) labelEl.textContent = label || 'Loading...';
  overlay.style.display = 'flex';
}

function hideLoadingOverlay() {
  const overlay = document.getElementById('mk-loading-overlay');
  if (overlay) overlay.style.display = 'none';
}

// Expose so preset-import.js can call hideLoadingOverlay when the import modal opens

window._hideLoadingOverlay = hideLoadingOverlay;


// No need for DEFAULT_PRESETS - will load from JSON when needed
let DEFAULT_PRESETS = [];
let totalFactoryPresetCount = 0;

// Camera elements
let video, canvas, capturedImage, statusElement, resetButton;
let stream = null;
let videoTrack = null;

// ===== CUSTOM ALERT & CONFIRM SYSTEM =====

// Custom styled alert to replace browser alert()
function customAlert(message, type = 'info') {
  return new Promise((resolve) => {
    const modal = document.getElementById('custom-alert-modal');
    const messageEl = document.getElementById('custom-alert-message');
    const buttonsEl = document.getElementById('custom-alert-buttons');
    
    // Set message
    messageEl.textContent = message;
    
    // Set up single OK button
    buttonsEl.innerHTML = '<button class="custom-alert-btn custom-alert-btn-primary" id="custom-alert-ok">OK</button>';
    
    // Show modal
    modal.style.display = 'flex';
    
    // Handle OK button
    const okBtn = document.getElementById('custom-alert-ok');
    const handleOk = () => {
      modal.style.display = 'none';
      okBtn.removeEventListener('click', handleOk);
      resolve();
    };
    okBtn.addEventListener('click', handleOk);
  });
}

// Custom styled confirm to replace browser confirm()
function customConfirm(message, options = {}) {
  return new Promise((resolve) => {
    const modal = document.getElementById('custom-alert-modal');
    const messageEl = document.getElementById('custom-alert-message');
    const buttonsEl = document.getElementById('custom-alert-buttons');
    
    // Set message
    messageEl.textContent = message;
    
    // Set up Yes/No buttons
    const yesText = options.yesText || 'Yes';
    const noText = options.noText || 'No';
    const danger = options.danger ? 'custom-alert-btn-danger' : 'custom-alert-btn-primary';
    
    buttonsEl.innerHTML = `
      <button class="custom-alert-btn custom-alert-btn-secondary" id="custom-confirm-no">${noText}</button>
      <button class="custom-alert-btn ${danger}" id="custom-confirm-yes">${yesText}</button>
    `;
    
    // Show modal
    modal.style.display = 'flex';
    
    // Handle buttons
    const yesBtn = document.getElementById('custom-confirm-yes');
    const noBtn = document.getElementById('custom-confirm-no');
    
    const handleYes = () => {
      modal.style.display = 'none';
      yesBtn.removeEventListener('click', handleYes);
      noBtn.removeEventListener('click', handleNo);
      resolve(true);
    };
    
    const handleNo = () => {
      modal.style.display = 'none';
      yesBtn.removeEventListener('click', handleYes);
      noBtn.removeEventListener('click', handleNo);
      resolve(false);
    };
    
    yesBtn.addEventListener('click', handleYes);
    noBtn.addEventListener('click', handleNo);
  });
}

// Override native alert and confirm (optional - for easier migration)
window.alert = customAlert;
window.confirm = customConfirm;

// Resolution settings
const RESOLUTION_PRESETS = [
  { name: 'VGA (640x480)', width: 640, height: 480 },
  { name: 'SVGA (800x600)', width: 800, height: 600 },
  { name: 'XGA (1024x768)', width: 1024, height: 768 },
  { name: 'SXGA (1280x960)', width: 1280, height: 960 },
  { name: 'SXGA+ (1400x1050)', width: 1400, height: 1050 },
  { name: 'UXGA (1600x1200)', width: 1600, height: 1200 },
  { name: '2K (2048x1080)', width: 2048, height: 1080 },
  { name: 'HD (3264x2448)', width: 3264, height: 2448 }
];
let currentResolutionIndex = 0; // Default to Low (640x480)
const RESOLUTION_STORAGE_KEY = 'r1_camera_resolution';

// Import resolution settings
const IMPORT_RESOLUTION_OPTIONS = [
  { name: 'VGA (640x480)', width: 640, height: 480 },
  { name: 'SVGA (800x600)', width: 800, height: 600 },
  { name: 'XGA (1024x768)', width: 1024, height: 768 },
  { name: 'SXGA (1280x960)', width: 1280, height: 960 },
  { name: 'UXGA (1600x1200)', width: 1600, height: 1200 },
  { name: '2K (2048x1080)', width: 2048, height: 1080 }
];
let currentImportResolutionIndex = 0; // Default to VGA (640x480)
const IMPORT_RESOLUTION_STORAGE_KEY = 'r1_import_resolution';

// White balance settings - COMMENTED OUT
// const WHITE_BALANCE_MODES = [
//   { name: 'Auto', value: 'auto' },
//   { name: 'Daylight', value: 'daylight' },
//   { name: 'Cloudy', value: 'cloudy' },
//   { name: 'Tungsten', value: 'tungsten' },
//   { name: 'Fluorescent', value: 'fluorescent' },
//   { name: 'Candlelight', value: 'candlelight' },
//   { name: 'Moonlight', value: 'moonlight' }
// ];
// let currentWhiteBalanceIndex = 0; // Default to Auto
// const WHITE_BALANCE_STORAGE_KEY = 'r1_camera_white_balance';

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
let masterPromptSlots = [];
let mpRemoveMode = false;
const MASTER_PROMPT_STORAGE_KEY = 'r1_camera_master_prompt';
const MASTER_PROMPT_ENABLED_KEY = 'r1_camera_master_prompt_enabled';
const MP_SLOTS_STORAGE_KEY = 'r1_camera_mp_slots';
const DELETED_MP_TRASH_KEY = 'r1_deleted_mp_trash';
const ASPECT_RATIO_STORAGE_KEY = 'r1_camera_aspect_ratio';
let selectedAspectRatio = 'none'; // 'none', '1:1', or '16:9'

// Random seed selection tracking
const SELECTION_HISTORY_KEY = 'r1_camera_selection_history';
let selectionHistory = {}; // Format: { presetName: [selection1, selection2, ...] }
const MAX_HISTORY_PER_PRESET = 5; // Remember last 5 selections per preset

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

// Manual Options mode
let manualOptionsMode = false;
const MANUAL_OPTIONS_KEY = 'r1_camera_manual_options';
const TOUR_PROGRESS_KEY = 'r1_camera_tour_progress';
const APP_VERSION = (() => {
  const d = new Date(document.lastModified);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return 'v' + mm + '.' + dd + '.' + yyyy + '.' + hh + '.' + min;
})();
let manuallySelectedOption = null;

// Track if we entered Master Prompt from gallery
let returnToGalleryFromMasterPrompt = false;
let savedViewerImageIndex = -1;

// Track if we opened an editor from the gallery viewer prompt tap
let returnToGalleryFromViewerEdit = false;
let returnToMainMenuFromBuilder = false;
let isPresetInfoModalOpen = false;

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
let isResetDatabaseSubmenuOpen = false;
let isResolutionSubmenuOpen = false;
let isBurstSubmenuOpen = false;
let isTimerSubmenuOpen = false;
let isMasterPromptSubmenuOpen = false;
let isMotionSubmenuOpen = false;
let isAspectRatioSubmenuOpen = false;
let currentAspectRatioIndex = 0;
let isImportResolutionSubmenuOpen = false;
let currentImportResolutionIndex_Menu = 0;
let isTutorialSubmenuOpen = false;
let isPresetBuilderSubmenuOpen = false;
let isPresetFileSettingsOpen = false;
let isRestoreSubmenuOpen = false;
let restoreActiveTab = 'presets';
let currentRestoreIndex = 0;
let _editingSourceIndex = -1;
let editingPresetBuilderIndex = -1;
let singleOptionCounter = 0;
let optionGroupCounter = 0;
let currentGalleryIndex = 0;
let currentViewerIndex = 0;
let currentEditorIndex = 0;
let currentQueueIndex = 0;
let currentTutorialGlossaryIndex = 0;

// Gallery variables - IndexedDB
const DB_NAME = 'R1CameraGallery';
const DB_VERSION = 3;
const STORE_NAME = 'images';
let db = null;
let galleryImages = [];
let _galleryHighlightIndex = 0;
let _galleryTopNavIndex = -1;
let _galleryBottomNavIndex = -1;
let previewGalleryImages = [];
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

// GALLERY FOLDERS

const FOLDERS_STORAGE_KEY = 'r1_gallery_folders';
let galleryFolders = []; // [{ id, name, createdAt }]
let currentFolderView = null; // null = root gallery, string = folderId
// END GALLERY FOLDERS

// Multiple preset variables
let isMultiPresetMode = false;
let isBatchPresetSelectionActive = false;
let selectedPresets = [];
let multiPresetImageId = null;

// Camera multi-preset variables

let isCameraMultiPresetActive = false;
let cameraSelectedPresets = []; // The presets selected for next capture
let cameraMultiManualSelections = {}; // Saved manual option selections per preset name
const CAMERA_MULTI_PRESET_KEY = 'r1_camera_multi_presets';
const CAMERA_MULTI_SELECTIONS_KEY = 'r1_camera_multi_selections';

// Camera LAYER-preset variables (combines multiple presets into ONE prompt)

let isCameraLayerActive = false;
let cameraLayerPresets = []; // [primaryPreset, layer1, layer2, ...]
let cameraLayerManualSelections = {}; // Manual option selections per preset name
const CAMERA_LAYER_PRESET_KEY = 'r1_camera_layer_presets';

// Gallery LAYER-preset variables (persists while viewer is open)

let isGalleryLayerActive = false;
let galleryLayerPresets = []; // saved layer selections for the gallery viewer
let galleryLayerManualSelections = {}; // saved manual option selections

// Gallery MULTI-preset variables (persists while viewer is open, like LAYER)

let isGalleryMultiActive = false;
let galleryMultiPresets = []; // saved multi selections for the gallery viewer
let galleryMultiManualSelections = {}; // saved manual option selections for multi

// Remembers the last manually-selected options for a SINGLE preset (no multi/layer
// combo active) so the user can be asked "Use same options selected?" next time,
// instead of always being sent straight back through the options modal.
// Tracked separately for the gallery viewer and the camera screen.
let gallerySingleLastPresetName = null;
let gallerySingleLastSelection = null;
let cameraSingleLastPresetName = null;
let cameraSingleLastSelection = null;

// Shared flag so selectPreset() knows we are picking layers

let isLayerPresetMode = false;
let layerSelectedPresets = []; // Temp array while user is choosing
let galleryLayerImageId = null; // Set when opening Layer from the gallery viewer

// Style filter

let styleFilterText = '';
let presetFilterText = '';
let presetListScrollPosition = 0;
let visiblePresetsFilterByCategory = ''; // Track selected category filter
let mainMenuFilterByCategory = ''; // Track selected category filter for main menu
let galleryPresetFilterByCategory = ''; // Track selected category filter for gallery preset selector
let isStyleFilterFocused = false; // ADD THIS
let isVisiblePresetsFilterFocused = false; // ADD THIS
let isPresetFilterFocused = false; // ADD THIS

// QR Code detection variables

let qrDetectionInterval = null;
let lastDetectedQR = null;
let qrDetectionActive = false;
const QR_DETECTION_INTERVAL = 500; // Check every 500ms
let qrScannerMode = 'gallery'; // 'gallery', 'preset-source', or 'preview-image'

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
  
  // Random Selection Templates
  random_even_odd: `Take a picture and transform [DESCRIBE BASE TRANSFORMATION].

SELECTION (CRITICAL):
- If an external master prompt specifies [WHAT CAN BE SPECIFIED], USE THAT
- If the RANDOM SEED ends in an EVEN number (0,2,4,6,8): SELECT Option A
- If the RANDOM SEED ends in an ODD number (1,3,5,7,9): SELECT Option B

If Option A:
[DESCRIBE WHAT HAPPENS IN OPTION A - BE SPECIFIC ABOUT VISUAL DETAILS, STYLE, SETTING, ETC.]

If Option B:
[DESCRIBE WHAT HAPPENS IN OPTION B - BE SPECIFIC ABOUT VISUAL DETAILS, STYLE, SETTING, ETC.]

[ADD ANY ADDITIONAL INSTRUCTIONS THAT APPLY TO BOTH OPTIONS - LIGHTING, QUALITY, PRESERVATION, ETC.]`,

  random_last_digit: `Take a picture and transform [DESCRIBE BASE TRANSFORMATION].

SELECTION (CRITICAL):
- If an external master prompt specifies [WHAT CAN BE SPECIFIED], USE THAT
- If none is specified, SELECT EXACTLY ONE using LAST DIGIT modulo [NUMBER 2-10]:
  - 0: [OPTION 1 DESCRIPTION]
  - 1: [OPTION 2 DESCRIPTION]
  - 2: [OPTION 3 DESCRIPTION]
  - 3: [OPTION 4 DESCRIPTION]
  - 4: [OPTION 5 DESCRIPTION]
  - 5: [OPTION 6 DESCRIPTION]
  - 6: [OPTION 7 DESCRIPTION]
  - 7: [OPTION 8 DESCRIPTION]
  - 8: [OPTION 9 DESCRIPTION]
  - 9: [OPTION 10 DESCRIPTION]

[ADD ANY ADDITIONAL INSTRUCTIONS THAT APPLY TO ALL OPTIONS - STYLE, QUALITY, TECHNICAL DETAILS, ETC.]

IMPORTANT:
- Replace [NUMBER 2-10] with the actual number of options you have (between 2 and 10)
- Remove any unused option lines (e.g., if you only have 5 options, remove lines 5-9)
- Each option should be a distinct visual variation or transformation
- For exactly 10 options, use LAST DIGIT modulo 10 (covers digits 0-9)`,

  random_last_two: `Take a picture and transform [DESCRIBE BASE TRANSFORMATION].

SELECTION (CRITICAL):
- If an external master prompt specifies [WHAT CAN BE SPECIFIED], USE THAT
- If none is specified, SELECT EXACTLY ONE using LAST TWO DIGITS modulo [NUMBER 11-99]:
  - 0: [OPTION 1 DESCRIPTION]
  - 1: [OPTION 2 DESCRIPTION]
  - 2: [OPTION 3 DESCRIPTION]
  - 3: [OPTION 4 DESCRIPTION]
  - 4: [OPTION 5 DESCRIPTION]
  - 5: [OPTION 6 DESCRIPTION]
  - 6: [OPTION 7 DESCRIPTION]
  - 7: [OPTION 8 DESCRIPTION]
  - 8: [OPTION 9 DESCRIPTION]
  - 9: [OPTION 10 DESCRIPTION]
  - 10: [OPTION 11 DESCRIPTION]
  - 11: [OPTION 12 DESCRIPTION]
  - 12: [OPTION 13 DESCRIPTION]
  - 13: [OPTION 14 DESCRIPTION]
  - 14: [OPTION 15 DESCRIPTION]
  - 15: [OPTION 16 DESCRIPTION]
  - 16: [OPTION 17 DESCRIPTION]
  - 17: [OPTION 18 DESCRIPTION]
  - 18: [OPTION 19 DESCRIPTION]
  - 19: [OPTION 20 DESCRIPTION]
  - 20: [OPTION 21 DESCRIPTION]

[ADD ANY ADDITIONAL INSTRUCTIONS THAT APPLY TO ALL OPTIONS]

IMPORTANT:
- Replace [NUMBER 11-99] with the actual number of options (between 11 and 99)
- Add or remove option lines to match your number of options
- Use LAST TWO DIGITS only when you have MORE than 10 options
- Ensure the colon (:) comes immediately after the modulo number
- Use exactly 2 spaces before each dash (-)
- Keep all options in one continuous list with no blank lines`,

  random_last_three: `Take a picture and transform [DESCRIBE BASE TRANSFORMATION].

SELECTION (CRITICAL):
- If an external master prompt specifies [WHAT CAN BE SPECIFIED], USE THAT
- If none is specified, SELECT EXACTLY ONE using LAST THREE DIGITS modulo [NUMBER 100+]:
  - 0: [OPTION 1 DESCRIPTION]
  - 1: [OPTION 2 DESCRIPTION]
  - 2: [OPTION 3 DESCRIPTION]
  - 3: [OPTION 4 DESCRIPTION]
  - 4: [OPTION 5 DESCRIPTION]
  (continue numbering for all your options)
  - 98: [OPTION 99 DESCRIPTION]
  - 99: [OPTION 100 DESCRIPTION]
  - 100: [OPTION 101 DESCRIPTION]

[ADD ANY ADDITIONAL INSTRUCTIONS THAT APPLY TO ALL OPTIONS]

IMPORTANT:
- Replace [NUMBER 100+] with the actual number of options (101 or more)
- Add option lines for every option you want to include
- Use LAST THREE DIGITS only when you have 101 or more options
- Ensure the colon (:) comes immediately after the modulo number
- Use exactly 2 spaces before each dash (-)
- Keep all options in one continuous list with no blank lines
- This format is ideal for large preset collections like 120 Star Trek species or 150 character types`,
  
  custom: ""
};

// Load styles from localStorage or use defaults
let CAMERA_PRESETS = [];
let factoryPresets = [];
let hasImportedPresets = false; // Track if we're using imported presets
let currentPresetIndex = 0;
let editingStyleIndex = -1;
let isOnline = navigator.onLine;
let photoQueue = [];
let isSyncing = false;
let _connectionMonitoringActive = false;

// Scroll debouncing variables
let scrollTimeout = null;
let lastScrollTime = 0;

// Manual options modal state flag
let manualOptionsModalVisible = false;

const SCROLL_DEBOUNCE_MS = 500;
const QUEUE_STORAGE_KEY = 'r1_camera_queue';

// Connection status elements
let connectionStatusElement, queueStatusElement, syncButton;

// Local storage key (for ALL camera presets)
const STORAGE_KEY = 'r1_camera_styles';

// Local storage key (for the ARRAY of favorite style names)
let favoriteStyles = []; 
let _favoriteStylesSet = new Set(); // Fast O(1) lookup mirror for favoriteStyles
let _stylesListCache = null;        // Cached result of getStylesLists()
let _stylesDataVersion = 0;         // Incremented whenever presets/visibility/favorites change
let _stylesListCacheVersion = -1;   // Version when cache was last built
let _listDOMVersion = -1;           // _stylesDataVersion when the menu DOM was last fully built
let _listDOMIsFiltered = false;     // true when the current menu DOM was built with a filter active
const FAVORITE_STYLES_KEY = 'r1_camera_favorites';
const VISIBLE_PRESETS_KEY = 'r1_camera_visible_presets';
let visiblePresets = []; // Array of preset names that should be shown
let _visiblePresetsSet = new Set(); // Fast O(1) lookup mirror for visiblePresets
let isVisiblePresetsSubmenuOpen = false;
let currentVisiblePresetsIndex = 0;
let visiblePresetsFilterText = '';
let visiblePresetsScrollEnabled = true;

// ===== PRESET SAMPLE IMAGE LONG-PRESS PREVIEW (SHARED UTILITY) =====

let _presetPreviewOverlay = null;
let _presetPreviewImg = null;
let _presetPreviewLabel = null;
let _presetPreviewNoImg = null;
let _styleListLongPressTimer = null;

// ── Custom preview image edit state ──
let _previewEditMode = false;
let _previewEditPreset = null;
let _previewEditGalleryWasOpen = false;
let _previewEditSelectionOverlay = null;
let _previewEditGalleryBanner = null;

const CUSTOM_PREVIEW_KEY_PREFIX = 'r1_custom_preview_';

function getCustomPreviewImage(presetName) {
  try { return localStorage.getItem(CUSTOM_PREVIEW_KEY_PREFIX + presetName) || null; } catch(e) { return null; }
}
function saveCustomPreviewImage(presetName, dataUrl) {
  try { localStorage.setItem(CUSTOM_PREVIEW_KEY_PREFIX + presetName, dataUrl); } catch(e) { console.error('Could not save custom preview:', e); }
}
function clearCustomPreviewImage(presetName) {
  try { localStorage.removeItem(CUSTOM_PREVIEW_KEY_PREFIX + presetName); } catch(e) {}
}

function _ensurePresetPreviewOverlay() {
  if (_presetPreviewOverlay) return;

  _presetPreviewOverlay = document.createElement('div');
  _presetPreviewOverlay.style.cssText = 'display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.88); z-index:99999; align-items:center; justify-content:center; flex-direction:column; pointer-events:all;';

  // × close button — top right
  const closeBtn = document.createElement('div');
  closeBtn.textContent = '×';
  closeBtn.style.cssText = 'position:absolute; top:10px; right:18px; color:#fff; font-size:28px; cursor:pointer; pointer-events:all; line-height:1;';
  closeBtn.addEventListener('touchstart', (e) => { e.stopPropagation(); e.preventDefault(); });
  closeBtn.addEventListener('touchend', (e) => { e.stopPropagation(); e.preventDefault(); hidePresetImagePreview(); });
  closeBtn.addEventListener('mousedown', (e) => { e.stopPropagation(); e.preventDefault(); hidePresetImagePreview(); });

  // + edit button — top left
  const editBtn = document.createElement('div');
  editBtn.textContent = '+';
  editBtn.style.cssText = 'position:absolute; top:10px; left:18px; color:#fff; font-size:22px; font-weight:bold; cursor:pointer; pointer-events:all; background:rgba(254,95,0,0.85); border-radius:50%; width:34px; height:34px; display:flex; align-items:center; justify-content:center; line-height:1; user-select:none;';
  editBtn.addEventListener('touchstart', (e) => { e.stopPropagation(); e.preventDefault(); });
  editBtn.addEventListener('touchend', (e) => { e.stopPropagation(); e.preventDefault(); _openGalleryForPreviewEdit(); });
  editBtn.addEventListener('mousedown', (e) => { e.stopPropagation(); e.preventDefault(); _openGalleryForPreviewEdit(); });

  const _presetPreviewImgWrapper = document.createElement('div');
  _presetPreviewImgWrapper.style.cssText = 'width:92vw; height:72vh; display:flex; align-items:center; justify-content:center;';
  _presetPreviewImg = document.createElement('img');
  _presetPreviewImg.style.cssText = 'width:100%; height:100%; object-fit:contain; border-radius:10px; border:2px solid #555;';

  _presetPreviewLabel = document.createElement('div');
  _presetPreviewLabel.style.cssText = 'color:#fff; font-size:11px; margin-top:6px; font-weight:bold; letter-spacing:1px;';

  _presetPreviewNoImg = document.createElement('div');
  _presetPreviewNoImg.style.cssText = 'color:#aaa; font-size:13px; display:none; margin-top:20px;';
  _presetPreviewNoImg.textContent = 'No sample image available';

  _presetPreviewOverlay.appendChild(editBtn);
  _presetPreviewOverlay.appendChild(closeBtn);
  _presetPreviewImgWrapper.appendChild(_presetPreviewImg);
  _presetPreviewOverlay.appendChild(_presetPreviewImgWrapper);
  _presetPreviewOverlay.appendChild(_presetPreviewLabel);
  _presetPreviewOverlay.appendChild(_presetPreviewNoImg);
  document.body.appendChild(_presetPreviewOverlay);
}

function showPresetImagePreview(preset) {
  _ensurePresetPreviewOverlay();
  _previewEditPreset = preset;
  _presetPreviewLabel.textContent = preset.name;
  _presetPreviewImg.style.display = 'none';
  _presetPreviewNoImg.style.display = 'none';

  // Custom preview from gallery takes priority over the default public folder image
  const customImg = getCustomPreviewImage(preset.name);
  let imageUrl;
  if (customImg) {
    imageUrl = customImg;
  } else {
    const safeName = preset.name.replace(/[\/\\:*?"<>|\s]/g, '_');
    imageUrl = preset.imageUrl || ('./public/' + safeName + '.png');
  }

  _presetPreviewImg.onload = () => { _presetPreviewImg.style.display = 'block'; _presetPreviewNoImg.style.display = 'none'; };
  _presetPreviewImg.onerror = () => { _presetPreviewImg.style.display = 'none'; _presetPreviewNoImg.style.display = 'block'; };
  _presetPreviewImg.src = imageUrl;
  _presetPreviewOverlay.style.display = 'flex';
}

function hidePresetImagePreview() {
  if (!_presetPreviewOverlay) return;
  _presetPreviewOverlay.style.display = 'none';
  _presetPreviewImg.src = '';
}

function attachPresetLongPress(item, preset) {
  const LONG_PRESS_MS = 600;
  let _timer = null;

  item.addEventListener('touchstart', () => {
    _timer = setTimeout(() => showPresetImagePreview(preset), LONG_PRESS_MS);
  }, { passive: true });

  item.addEventListener('touchend',   () => { clearTimeout(_timer); _timer = null; }, { passive: true });
  item.addEventListener('touchmove',  () => { clearTimeout(_timer); _timer = null; }, { passive: true });
  item.addEventListener('touchcancel',() => { clearTimeout(_timer); _timer = null; }, { passive: true });

  item.addEventListener('mousedown', () => {
    _timer = setTimeout(() => showPresetImagePreview(preset), LONG_PRESS_MS);
  });
  item.addEventListener('mouseup', () => { clearTimeout(_timer); _timer = null; });
  item.addEventListener('mouseleave', () => { clearTimeout(_timer); _timer = null; });
}

function _handleStyleListLongPressStart(e) {
  const item = e.target.closest('.style-item');
  if (!item) return;
  const index = parseInt(item.dataset.index);
  if (isNaN(index)) return;
  const preset = CAMERA_PRESETS[index];
  if (!preset) return;
  _styleListLongPressTimer = setTimeout(() => showPresetImagePreview(preset), 600);
}

function _handleStyleListLongPressEnd() {
  clearTimeout(_styleListLongPressTimer);
  _styleListLongPressTimer = null;
}

function _openGalleryForPreviewEdit() {
  if (!_previewEditPreset) return;
  _previewEditMode = true;

  // Hide preset preview overlay — we return to it after the user picks an image
  _presetPreviewOverlay.style.display = 'none';

  // Load preview gallery images from IndexedDB if not already loaded, then show picker
  if (previewGalleryImages && previewGalleryImages.length > 0) {
    _showPreviewImagePickerOverlay();
  } else {
    loadPreviewGallery().then(() => _showPreviewImagePickerOverlay()).catch(() => _showPreviewImagePickerOverlay());
  }
}

function _showPreviewEditGalleryBanner() {
  if (_previewEditGalleryBanner) { _previewEditGalleryBanner.remove(); _previewEditGalleryBanner = null; }
  const galleryModal = document.getElementById('gallery-modal');
  if (!galleryModal || !_previewEditPreset) return;

  _previewEditGalleryBanner = document.createElement('div');
  _previewEditGalleryBanner.style.cssText = 'position:sticky; top:0; left:0; right:0; z-index:9999; background:rgba(254,95,0,0.95); color:#fff; padding:10px 14px; font-size:12px; font-weight:bold; letter-spacing:0.3px; display:flex; align-items:center; justify-content:space-between; flex-shrink:0;';
  _previewEditGalleryBanner.innerHTML = `<span>Tap an image to set as preview for <strong>${_previewEditPreset.name}</strong></span><span id="_pvt-cancel-gallery" style="font-size:22px; cursor:pointer; padding:0 4px; line-height:1;">×</span>`;
  galleryModal.insertBefore(_previewEditGalleryBanner, galleryModal.firstChild);

  const cancelBtn = document.getElementById('_pvt-cancel-gallery');
  if (cancelBtn) {
    const doCancel = (e) => { e.stopPropagation(); e.preventDefault(); _exitPreviewEditMode(true); };
    cancelBtn.addEventListener('touchend', doCancel);
    cancelBtn.addEventListener('mousedown', doCancel);
  }
}

function _showPreviewImagePickerOverlay() {
  // Remove any leftover picker from a previous session
  const existing = document.getElementById('_preview-img-picker');
  if (existing) existing.remove();

  const picker = document.createElement('div');
  picker.id = '_preview-img-picker';
  picker.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:#111; z-index:999998; display:flex; flex-direction:column; pointer-events:all;';

  // ── Top header row: Default button (left) + X button (right) ──
  const header = document.createElement('div');
  header.style.cssText = 'display:flex; align-items:center; justify-content:space-between; padding:6px 10px; background:rgba(254,95,0,0.95); flex-shrink:0; box-sizing:border-box;';

  // Default (revert) button — top left
  const defaultBtn = document.createElement('div');
  defaultBtn.textContent = '↩';
  defaultBtn.title = 'Revert to default';
  defaultBtn.style.cssText = 'width:32px; height:32px; min-width:32px; min-height:32px; color:#fff; font-size:18px; cursor:pointer; flex-shrink:0; display:flex; align-items:center; justify-content:center; border:2px solid rgba(255,255,255,0.5); border-radius:5px; box-sizing:border-box; user-select:none;';
  const doDefault = (e) => {
    e.stopPropagation();
    e.preventDefault();
    picker.remove();
    _revertPreviewToDefault();
  };
  defaultBtn.addEventListener('touchend', doDefault);
  defaultBtn.addEventListener('mousedown', doDefault);

  // X cancel button — top right
  const cancelX = document.createElement('div');
  cancelX.textContent = '×';
  cancelX.style.cssText = 'width:32px; height:32px; min-width:32px; min-height:32px; color:#fff; font-size:22px; cursor:pointer; flex-shrink:0; display:flex; align-items:center; justify-content:center; border:2px solid rgba(255,255,255,0.5); border-radius:5px; box-sizing:border-box; line-height:1; user-select:none;';
  const doCancel = (e) => {
    e.stopPropagation();
    e.preventDefault();
    picker.remove();
    _previewEditMode = false;
    const p = _previewEditPreset;
    _previewEditPreset = null;
    if (p) showPresetImagePreview(p);
  };
  cancelX.addEventListener('touchend', doCancel);
  cancelX.addEventListener('mousedown', doCancel);

  header.appendChild(defaultBtn);
  header.appendChild(cancelX);

  // ── Slim banner: "Pick preview for: [preset]" ──
  const banner = document.createElement('div');
  banner.style.cssText = 'background:rgba(200,75,0,0.92); color:#fff; font-size:11px; font-weight:bold; text-align:center; padding:3px 10px; flex-shrink:0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; box-sizing:border-box; letter-spacing:0.3px;';
  banner.textContent = 'Pick preview for: ' + (_previewEditPreset ? _previewEditPreset.name : '');

  // ── Scrollable image grid ──
  const grid = document.createElement('div');
  grid.style.cssText = 'flex:1; overflow-y:auto; -webkit-overflow-scrolling:touch; display:grid; grid-template-columns:repeat(3,1fr); gap:2px; padding:2px; align-content:start; box-sizing:border-box;';

  // Scroll wheel support for R1 device scroll wheel
  grid.addEventListener('wheel', (e) => {
    e.preventDefault();
    grid.scrollTop += e.deltaY;
  }, { passive: false });

  if (previewGalleryImages && previewGalleryImages.length > 0) {
    const sorted = [...previewGalleryImages].sort((a, b) => b.timestamp - a.timestamp);
    sorted.forEach(img => {
      const cell = document.createElement('div');
      cell.style.cssText = 'position:relative; padding-bottom:100%; overflow:hidden; cursor:pointer; background:#222;';
      const imgEl = document.createElement('img');
      imgEl.src = img.imageBase64;
      imgEl.style.cssText = 'position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover;';
      imgEl.loading = 'lazy';
      cell.appendChild(imgEl);

      // Touch scroll sensitivity fix: only select if finger barely moved
      let _touchStartY = 0;
      let _touchMoved = false;
      cell.addEventListener('touchstart', (e) => {
        _touchStartY = e.touches[0].clientY;
        _touchMoved = false;
      }, { passive: true });
      cell.addEventListener('touchmove', (e) => {
        if (Math.abs(e.touches[0].clientY - _touchStartY) > 8) {
          _touchMoved = true;
        }
      }, { passive: true });
      cell.addEventListener('touchend', (e) => {
        if (_touchMoved) return; // user was scrolling, do not select
        e.stopPropagation();
        e.preventDefault();
        picker.remove();
        _handlePreviewEditImageSelect(img.imageBase64);
      });
      cell.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        e.preventDefault();
        picker.remove();
        _handlePreviewEditImageSelect(img.imageBase64);
      });
      grid.appendChild(cell);
    });
  } else {
    const empty = document.createElement('div');
    empty.style.cssText = 'grid-column:1/-1; color:#888; text-align:center; padding:40px 16px; font-size:12px; line-height:1.6;';
    empty.textContent = 'No preview images yet. Go to Preset File Settings → Preview Images tab to import some via QR code.';
    grid.appendChild(empty);
  }

  picker.appendChild(header);
  picker.appendChild(banner);
  picker.appendChild(grid);
  document.body.appendChild(picker);
}

function _handlePreviewEditImageSelect(imageBase64) {
  if (_previewEditSelectionOverlay) { _previewEditSelectionOverlay.remove(); _previewEditSelectionOverlay = null; }

  _previewEditSelectionOverlay = document.createElement('div');
  _previewEditSelectionOverlay.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.93); z-index:999999; display:flex; flex-direction:column; align-items:center; justify-content:center; pointer-events:all;';

  const previewImg = document.createElement('img');
  previewImg.src = imageBase64;
  previewImg.style.cssText = 'width:88vw; max-height:58vh; object-fit:contain; border-radius:10px; border:2px solid #555; margin-bottom:14px;';

  const label = document.createElement('div');
  label.textContent = `Set as preview for: ${_previewEditPreset ? _previewEditPreset.name : ''}`;
  label.style.cssText = 'color:#aaa; font-size:11px; margin-bottom:22px; text-align:center; padding:0 20px;';

  const btnRow = document.createElement('div');
  btnRow.style.cssText = 'display:flex; gap:28px; align-items:center; justify-content:center;';

  const labelRow = document.createElement('div');
  labelRow.style.cssText = 'display:flex; gap:28px; align-items:center; justify-content:center; margin-top:8px;';

  const makeBtn = (symbol, bg, labelText, handler) => {
    const btn = document.createElement('div');
    btn.textContent = symbol;
    btn.style.cssText = `width:36px; height:36px; background:${bg}; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:20px; color:#fff; cursor:pointer; user-select:none;`;
    const doAction = (e) => { e.preventDefault(); e.stopPropagation(); handler(); };
    btn.addEventListener('touchend', doAction);
    btn.addEventListener('mousedown', doAction);
    const lbl = document.createElement('div');
    lbl.textContent = labelText;
    lbl.style.cssText = 'width:36px; text-align:center; color:#888; font-size:10px; letter-spacing:0.3px;';
    btnRow.appendChild(btn);
    labelRow.appendChild(lbl);
  };

  makeBtn('✓', '#4CAF50', 'Use',    () => _confirmPreviewEdit(imageBase64));
  makeBtn('×', '#cc3333', 'Cancel', () => _cancelPreviewEdit());

  _previewEditSelectionOverlay.appendChild(previewImg);
  _previewEditSelectionOverlay.appendChild(label);
  _previewEditSelectionOverlay.appendChild(btnRow);
  _previewEditSelectionOverlay.appendChild(labelRow);
  document.body.appendChild(_previewEditSelectionOverlay);
}

function _confirmPreviewEdit(imageBase64) {
  if (_previewEditPreset) saveCustomPreviewImage(_previewEditPreset.name, imageBase64);
  _exitPreviewEditMode(true);
}

function _cancelPreviewEdit() {
  _exitPreviewEditMode(true);
}

function _revertPreviewToDefault() {
  if (_previewEditPreset) clearCustomPreviewImage(_previewEditPreset.name);
  _exitPreviewEditMode(true);
}

function _exitPreviewEditMode(showPreview) {
  if (_previewEditSelectionOverlay) { _previewEditSelectionOverlay.remove(); _previewEditSelectionOverlay = null; }
  if (_previewEditGalleryBanner)    { _previewEditGalleryBanner.remove();    _previewEditGalleryBanner = null; }

  // Also remove the standalone picker overlay if it somehow survived
  const picker = document.getElementById('_preview-img-picker');
  if (picker) picker.remove();

  const presetToShow = _previewEditPreset;
  _previewEditMode   = false;
  _previewEditPreset = null;

  if (showPreview && presetToShow) {
    showPresetImagePreview(presetToShow);
  }
}

// ===== END PRESET SAMPLE IMAGE LONG-PRESS PREVIEW =====

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
  
  // If NO MAGIC MODE is on, always show NO MAGIC MODE in popup
  styleRevealText.textContent = noMagicMode ? '⚡ NO MAGIC MODE' : styleName;
  // Force the CSS animation to restart cleanly on every call
  styleRevealElement.style.display = 'none';
  // Trigger reflow so the browser registers the display change before showing again
  void styleRevealElement.offsetHeight;
  styleRevealElement.style.display = 'block';
  
  styleRevealTimeout = setTimeout(() => {
    if (styleRevealElement) {
      styleRevealElement.style.display = 'none';
    }
    styleRevealTimeout = null;
  }, 1800);
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

      // Create preview images store if it doesn't exist
      if (!db.objectStoreNames.contains('preview_images')) {
        const pvStore = db.createObjectStore('preview_images', { keyPath: 'id' });
        pvStore.createIndex('timestamp', 'timestamp', { unique: false });
      }

      // Create deleted images store for trash/restore functionality
      if (!db.objectStoreNames.contains('deleted_images')) {
        const delStore = db.createObjectStore('deleted_images', { keyPath: 'id' });
        delStore.createIndex('deletedAt', 'deletedAt', { unique: false });
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

// ── Preview Gallery DB functions (separate from main gallery) ──
async function loadPreviewGallery() {
  try {
    if (!db) await initDB();
    const transaction = db.transaction(['preview_images'], 'readonly');
    const objectStore = transaction.objectStore('preview_images');
    const request = objectStore.getAll();
    return new Promise((resolve) => {
      request.onsuccess = () => {
        previewGalleryImages = request.result || [];
        previewGalleryImages.sort((a, b) => b.timestamp - a.timestamp);
        resolve();
      };
      request.onerror = () => { previewGalleryImages = []; resolve(); };
    });
  } catch (e) { previewGalleryImages = []; }
}

async function savePreviewImageToDB(imageItem) {
  if (!db) await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['preview_images'], 'readwrite');
    const objectStore = transaction.objectStore('preview_images');
    const request = objectStore.put(imageItem);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

async function deletePreviewImageFromDB(id) {
  if (!db) await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['preview_images'], 'readwrite');
    const objectStore = transaction.objectStore('preview_images');
    const request = objectStore.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// Save single image to IndexedDB
async function saveImageToDB(imageItem) {
  try {
    if (!db) {
      await initDB();
    }
    
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const objectStore = transaction.objectStore(STORE_NAME);
    const request = objectStore.put(imageItem);
    
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

// ===== TRASH / SOFT DELETE SYSTEM =====

const DELETED_PRESETS_TRASH_KEY = 'r1_deleted_presets_trash';

async function softDeleteImage(imageId) {
  try {
    if (!db) await initDB();
    let imageItem = galleryImages.find(function(img) { return img.id === imageId; });
    if (!imageItem) {
      imageItem = await new Promise(function(resolve) {
        var tx = db.transaction([STORE_NAME], 'readonly');
        var store = tx.objectStore(STORE_NAME);
        var req = store.get(imageId);
        req.onsuccess = function() { resolve(req.result || null); };
        req.onerror = function() { resolve(null); };
      });
    }
    if (imageItem) {
      var deletedItem = Object.assign({}, imageItem, { deletedAt: Date.now() });
      await new Promise(function(resolve, reject) {
        var tx = db.transaction(['deleted_images'], 'readwrite');
        var store = tx.objectStore('deleted_images');
        var req = store.put(deletedItem);
        req.onsuccess = function() { resolve(); };
        req.onerror = function() { reject(req.error); };
      });
    }
    await deleteImageFromDB(imageId);
  } catch (err) {
    console.error('softDeleteImage error:', err);
    await deleteImageFromDB(imageId);
  }
}

async function getDeletedImages() {
  try {
    if (!db) await initDB();
    return new Promise(function(resolve) {
      var tx = db.transaction(['deleted_images'], 'readonly');
      var store = tx.objectStore('deleted_images');
      var req = store.getAll();
      req.onsuccess = function() { resolve(req.result || []); };
      req.onerror = function() { resolve([]); };
    });
  } catch (err) {
    console.error('getDeletedImages error:', err);
    return [];
  }
}

async function restoreImageFromTrash(imageId) {
  try {
    if (!db) await initDB();
    var item = await new Promise(function(resolve) {
      var tx = db.transaction(['deleted_images'], 'readonly');
      var store = tx.objectStore('deleted_images');
      var req = store.get(imageId);
      req.onsuccess = function() { resolve(req.result || null); };
      req.onerror = function() { resolve(null); };
    });
    if (!item) return;
    var restoredItem = Object.assign({}, item);
    delete restoredItem.deletedAt;
    await saveImageToDB(restoredItem);
    await permanentlyDeleteImageFromTrash(imageId);
    galleryImages.unshift(restoredItem);
  } catch (err) {
    console.error('restoreImageFromTrash error:', err);
  }
}

async function permanentlyDeleteImageFromTrash(imageId) {
  try {
    if (!db) await initDB();
    return new Promise(function(resolve, reject) {
      var tx = db.transaction(['deleted_images'], 'readwrite');
      var store = tx.objectStore('deleted_images');
      var req = store.delete(imageId);
      req.onsuccess = function() { resolve(); };
      req.onerror = function() { reject(req.error); };
    });
  } catch (err) {
    console.error('permanentlyDeleteImageFromTrash error:', err);
  }
}

function getDeletedPresets() {
  try {
    var raw = localStorage.getItem(DELETED_PRESETS_TRASH_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) { return []; }
}

function saveToPresetTrash(preset) {
  try {
    var deleted = getDeletedPresets();
    var idx = deleted.findIndex(function(p) { return p.name === preset.name; });
    var entry = Object.assign({}, preset, { deletedAt: Date.now() });
    if (idx >= 0) { deleted[idx] = entry; } else { deleted.push(entry); }
    localStorage.setItem(DELETED_PRESETS_TRASH_KEY, JSON.stringify(deleted));
  } catch (e) { console.error('saveToPresetTrash error:', e); }
}

function removeFromPresetTrash(presetName) {
  try {
    var updated = getDeletedPresets().filter(function(p) { return p.name !== presetName; });
    localStorage.setItem(DELETED_PRESETS_TRASH_KEY, JSON.stringify(updated));
  } catch (e) { console.error('removeFromPresetTrash error:', e); }
}

// ===== END TRASH SYSTEM =====

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
    timestamp: Date.now(),
    resolution: (canvas && canvas.width && canvas.height) ? canvas.width + 'x' + canvas.height : null
  };
  
  // Add to memory array
  galleryImages.unshift(galleryItem);
  
  // Save to IndexedDB (no limit!)
  await saveImageToDB(galleryItem);
  
  console.log(`Image added. Total: ${galleryImages.length}`);
}

// ===== IMAGE METADATA OVERLAY =====

function showImageMetadata(item, clientX, clientY) {
  hideImageMetadata(); // remove any stale tooltip first

  const tooltip = document.createElement('div');
  tooltip.id = 'img-meta-tooltip';
  tooltip.className = 'img-meta-tooltip';

  const date = new Date(item.timestamp);
  const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const res = item.resolution || 'Unknown';

  tooltip.innerHTML =
    '<div>\uD83D\uDCC5 ' + dateStr + '</div>' +
    '<div>\uD83D\uDD50 ' + timeStr + '</div>' +
    '<div>\uD83D\uDCD0 ' + res + '</div>';

  document.body.appendChild(tooltip);

  // Position after render so offsetWidth/Height are available
  requestAnimationFrame(function() {
    var tw = tooltip.offsetWidth;
    var th = tooltip.offsetHeight;
    var vw = window.innerWidth;
    var vh = window.innerHeight;

    var left = clientX + 14;
    var top  = clientY - th - 14;

    if (left + tw > vw - 8) left = clientX - tw - 14;
    if (left < 8)            left = 8;
    if (top < 8)             top  = clientY + 14;
    if (top + th > vh - 8)  top  = vh - th - 8;

    tooltip.style.left = left + 'px';
    tooltip.style.top  = top  + 'px';
  });
}

function hideImageMetadata() {
  var existing = document.getElementById('img-meta-tooltip');
  if (existing) existing.remove();
}

// ===== END IMAGE METADATA OVERLAY =====

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
      const startTime = new Date(galleryStartDate + 'T00:00:00').getTime();
      matchesStart = itemTime >= startTime;
    }
    
    if (galleryEndDate) {
      const endTime = new Date(galleryEndDate + 'T00:00:00').getTime();
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

async function showGallery(renderOnly = false) {
  if (!renderOnly) {
    pauseCamera();
    cancelTimerCountdown();

    // Clear any captured image before opening gallery
    if (capturedImage && capturedImage.style.display === 'block') {
      resetToCamera();
    }
    
    // Reload gallery from IndexedDB to ensure we have latest data
    await loadGallery();
  }
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
  // Sync the custom sort button label
  const sortLabelSync = document.getElementById('gallery-sort-label');
  if (sortLabelSync) {
    sortLabelSync.textContent = '🔀 SORT';
  }
  
  // Show or hide the folder breadcrumb bar
  let breadcrumb = document.getElementById('gallery-folder-breadcrumb');
  if (!breadcrumb) {
    breadcrumb = document.createElement('div');
    breadcrumb.id = 'gallery-folder-breadcrumb';
    breadcrumb.className = 'gallery-folder-breadcrumb';
    grid.parentNode.insertBefore(breadcrumb, grid);
  }
  if (currentFolderView !== null) {
    const folder = galleryFolders.find(f => f.id === currentFolderView);
    breadcrumb.style.display = 'flex';
    breadcrumb.innerHTML = '';
    const backBtn = document.createElement('button');
    backBtn.className = 'gallery-folder-breadcrumb-back';
    backBtn.textContent = '← Back';
    backBtn.addEventListener('click', closeFolderView);
    const label = document.createElement('span');
    label.textContent = `📁 ${folder ? folder.name : 'Folder'}`;
    breadcrumb.appendChild(backBtn);
    breadcrumb.appendChild(label);
  } else {
    breadcrumb.style.display = 'none';
  }

  // Get images for current view (root or folder)
  const viewImages = getImagesInCurrentView();
  const filteredImages = viewImages.filter(img => {
    if (!galleryStartDate && !galleryEndDate) return true;
    const d = new Date(img.timestamp);
    d.setHours(0,0,0,0);
    const t = d.getTime();
    if (galleryStartDate && t < new Date(galleryStartDate + 'T00:00:00').getTime()) return false;
    if (galleryEndDate && t > new Date(galleryEndDate + 'T00:00:00').getTime()) return false;
    return true;
  });
  const sortedImages = gallerySortOrder === 'oldest'
    ? [...filteredImages].sort((a,b) => a.timestamp - b.timestamp)
    : [...filteredImages].sort((a,b) => b.timestamp - a.timestamp);

  // Build a combined list of all items for the current view.
  // At root: folders come first (as pseudo-items), then images.
  // Inside a folder: images only.
  const showFolders = currentFolderView === null && !galleryStartDate && !galleryEndDate;

  // Each entry is either { type:'folder', folder } or { type:'image', item }
  const allItems = [];
  if (showFolders) {
    galleryFolders.forEach(folder => allItems.push({ type: 'folder', folder }));
  }
  sortedImages.forEach(item => allItems.push({ type: 'image', item }));

  const fragment = document.createDocumentFragment();

  if (allItems.length === 0) {
    grid.innerHTML = currentFolderView !== null
      ? '<div class="gallery-empty">This folder is empty.</div>'
      : '<div class="gallery-empty">No photos yet.</div>';
    pagination.style.display = 'none';
  } else {
    const totalPages = Math.ceil(allItems.length / ITEMS_PER_PAGE) || 1;
    currentGalleryPage = Math.min(currentGalleryPage, totalPages);

    const startIndex = (currentGalleryPage - 1) * ITEMS_PER_PAGE;
    const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, allItems.length);
    const pageItems = allItems.slice(startIndex, endIndex);
    let lastDateLabel = null;
    pageItems.forEach(entry => {
      if (entry.type === 'folder') {
        const folder = entry.folder;
        const folderEl = document.createElement('div');
        folderEl.className = 'gallery-item gallery-folder';
        folderEl.dataset.folderId = folder.id;

        if (isBatchMode && selectedBatchImages.has(folder.id)) {
          folderEl.classList.add('selected');
        }

        if (isBatchMode) {
          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.className = 'gallery-item-checkbox';
          checkbox.checked = selectedBatchImages.has(folder.id);
          checkbox.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleBatchImageSelection(folder.id);
          });
          folderEl.appendChild(checkbox);
        }

        const icon = document.createElement('div');
        icon.className = 'gallery-folder-icon';
        icon.textContent = '📁';
        folderEl.appendChild(icon);

        const nameEl = document.createElement('div');
        nameEl.className = 'gallery-folder-name';
        nameEl.textContent = folder.name;
        folderEl.appendChild(nameEl);

        // Long press to rename; tap to open (or select in batch)
        let pressTimer = null;
        folderEl.addEventListener('touchstart', () => {
          pressTimer = setTimeout(() => {
            pressTimer = null;
            if (!isBatchMode) startFolderRename(folder.id);
          }, 600);
        }, { passive: true });
        folderEl.addEventListener('touchend', () => {
          if (pressTimer) { clearTimeout(pressTimer); pressTimer = null; }
        });
        folderEl.addEventListener('touchmove', () => {
          if (pressTimer) { clearTimeout(pressTimer); pressTimer = null; }
        });

        folderEl.onclick = (e) => {
          if (isBatchMode) {
            if (e.target.type === 'checkbox') return;
            const rect = folderEl.getBoundingClientRect();
            const relX = e.clientX - rect.left;
            const relY = e.clientY - rect.top;
            if (relX < rect.width * 0.4 && relY < rect.height * 0.4) {
              toggleBatchImageSelection(folder.id);
            } else {
              openFolderView(folder.id);
            }
          } else {
            openFolderView(folder.id);
          }
        };

        fragment.appendChild(folderEl);

      } else {
        // Image entry
        const item = entry.item;

        // --- Date Divider ---
        const _itemDate = new Date(item.timestamp);
        const _dateLabel = _itemDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        if (_dateLabel !== lastDateLabel) {
          lastDateLabel = _dateLabel;
          const _divider = document.createElement('div');
          _divider.className = 'gallery-date-divider';
          _divider.innerHTML = `<span class="gallery-date-divider-text">${_dateLabel}</span>`;
          fragment.appendChild(_divider);
        }
        // --- End Date Divider ---

        const imgContainer = document.createElement('div');
        imgContainer.className = 'gallery-item';
        imgContainer.dataset.imageId = item.id;

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

        // Long press handling — batch mode: move-to-folder; normal mode: metadata overlay
        let imgPressTimer = null;
        let _longPressFired = false;
        if (isBatchMode) {
          imgContainer.addEventListener('touchstart', () => {
            _longPressFired = false;
            imgPressTimer = setTimeout(() => {
              imgPressTimer = null;
              _longPressFired = true;
              if (!selectedBatchImages.has(item.id)) {
                toggleBatchImageSelection(item.id);
              }
              showMoveToFolderModal();
            }, 600);
          }, { passive: true });
          imgContainer.addEventListener('touchend', () => {
            if (imgPressTimer) { clearTimeout(imgPressTimer); imgPressTimer = null; }
          });
          imgContainer.addEventListener('touchmove', () => {
            if (imgPressTimer) { clearTimeout(imgPressTimer); imgPressTimer = null; }
          });
        } else {
          // Normal (non-batch) mode: long-press shows metadata
          imgContainer.addEventListener('touchstart', (e) => {
            _longPressFired = false;
            const t = e.touches[0];
            imgPressTimer = setTimeout(() => {
              imgPressTimer = null;
              _longPressFired = true;
              showImageMetadata(item, t.clientX, t.clientY);
            }, 600);
          }, { passive: true });
          imgContainer.addEventListener('touchend', () => {
            if (imgPressTimer) { clearTimeout(imgPressTimer); imgPressTimer = null; }
            if (_longPressFired) {
              // Keep tooltip visible for 2 seconds after the user lifts their finger
              setTimeout(() => { hideImageMetadata(); _longPressFired = false; }, 2000);
            }
          });
          imgContainer.addEventListener('touchmove', () => {
            if (imgPressTimer) { clearTimeout(imgPressTimer); imgPressTimer = null; }
            hideImageMetadata();
            _longPressFired = false;
          });
        }

        imgContainer.onclick = () => {
          // Suppress click if a long-press just fired (tooltip is showing)
          if (_longPressFired) { return; }
          if (isBatchMode) {
            toggleBatchImageSelection(item.id);
          } else if (_previewEditMode) {
            _handlePreviewEditImageSelect(item.imageBase64);
          } else {
            const originalIndex = galleryImages.findIndex(i => i.id === item.id);
            openImageViewer(originalIndex);
          }
        };

        fragment.appendChild(imgContainer);
      }
    });

    grid.innerHTML = '';
    grid.appendChild(fragment);
    _galleryHighlightIndex = 0;
    _galleryTopNavIndex = -1;
    _galleryBottomNavIndex = -1;
    _clearGalleryTopNavHighlight();
    _clearGalleryBottomNavHighlight();
    _applyGalleryHighlight(false);

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
  window._carouselGuardUntil = Infinity;
  currentGalleryPage = 1;
  currentFolderView = null;
  // Always clear the NEW PHOTO overlay when returning to camera
  if (capturedImage) capturedImage.style.display = 'none';
  if (resetButton)   resetButton.style.display   = 'none';

  const cameraButtonEl = document.getElementById('camera-button');
  if (cameraButtonEl && availableCameras.length > 1) {
    cameraButtonEl.style.display = 'flex';
  }

  // Reset select mode so re-entering the gallery always starts fresh
  if (isBatchMode) {
    isBatchMode = false;
    selectedBatchImages.clear();
    const toggleBtn = document.getElementById('batch-mode-toggle');
    const batchControls = document.getElementById('batch-controls');
    const batchActionBar = document.getElementById('batch-action-bar');
    if (toggleBtn) { toggleBtn.textContent = 'Select'; toggleBtn.classList.remove('active'); }
    if (batchControls) batchControls.style.display = 'none';
    if (batchActionBar) batchActionBar.style.display = 'none';
  }

  await reinitializeCamera(); // Re-initialize fully so camera switch works after gallery
  window._carouselGuardUntil = 0;
  if (window._showCamCarousels) window._showCamCarousels();
  
  // Restore status element display (in case it was hidden by upload function)
  if (statusElement) {
    statusElement.style.display = 'block';
  }
  
  // Re-show the style reveal footer
  if (noMagicMode) {
    if (statusElement) statusElement.textContent = '⚡ NO MAGIC MODE';
    showStyleReveal('⚡ NO MAGIC MODE');
  } else if (isTimerMode || isBurstMode || isMotionDetectionMode || isRandomMode || isMultiPresetMode) {
    let modeName = '';
    if (isTimerMode) modeName = '⏱️ Timer Mode';
    else if (isBurstMode) modeName = '📸 Burst Mode';
    else if (isMotionDetectionMode) modeName = '👁️ Motion Detection';
    else if (isRandomMode) modeName = '🎲 Random Mode';
    if (statusElement) statusElement.textContent = `${modeName} • ${CAMERA_PRESETS[currentPresetIndex] ? CAMERA_PRESETS[currentPresetIndex].name : ''}`;
    showStyleReveal(modeName);
  } else {
    // Update both footer AND popup immediately
    updatePresetDisplay();
  }
}

function nextGalleryPage() {
  // Count folders + images together, matching how showGallery paginates
  const showFolders = currentFolderView === null && !galleryStartDate && !galleryEndDate;
  const folderCount = showFolders ? galleryFolders.length : 0;
  const imageCount = getFilteredAndSortedGallery().length;
  const totalItems = folderCount + imageCount;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  if (currentGalleryPage < totalPages) {
    currentGalleryPage++;
    showGallery(true);
  }
}

function prevGalleryPage() {
  if (currentGalleryPage > 1) {
    currentGalleryPage--;
    showGallery(true);
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

  // Always reset preset header and loaded preset when opening a new image
  // (will be restored if returning from editor)
  window.viewerLoadedPreset = null;
  isGalleryLayerActive         = false;
  galleryLayerPresets          = [];
  galleryLayerManualSelections = {};
  isGalleryMultiActive         = false;
  galleryMultiPresets          = [];
  galleryMultiManualSelections = {};
  const presetHeader = document.getElementById('viewer-preset-header');
  if (presetHeader) presetHeader.textContent = 'NO PRESET LOADED';

  // Also cancel any pending "restore text" from a submission or flash that
  // was still in flight on the PREVIOUS image — otherwise it fires later
  // (after this image is already open) and overwrites this header with
  // that old image's stale preset name.
  if (_viewerHeaderRestoreTimer) {
    clearTimeout(_viewerHeaderRestoreTimer);
    _viewerHeaderRestoreTimer = null;
  }
  _viewerHeaderTrueText     = null;
  _viewerHeaderBusy         = false;
  _viewerHeaderPendingFlash = null;
  _gallerySubmitShowNames   = false;

  // Show combined indicator if in combined mode
  const combinedIndicator = document.getElementById('viewer-combined-indicator');
  if (combinedIndicator) {
    if (window.isCombinedMode) combinedIndicator.classList.add('visible');
    else combinedIndicator.classList.remove('visible');
  }
  
  // Light up MP button if master prompt is enabled
  const mpBtn = document.getElementById('mp-viewer-button');
  if (mpBtn) {
    if (masterPromptEnabled) {
      mpBtn.classList.add('enabled');
    } else {
      mpBtn.classList.remove('enabled');
    }
  }

  // Light up Options button if manual options mode is enabled
  const optionsBtn = document.getElementById('options-viewer-button');
  if (optionsBtn) {
    if (manualOptionsMode) {
      optionsBtn.classList.add('enabled');
    } else {
      optionsBtn.classList.remove('enabled');
    }
  }
  
  viewer.style.display = 'flex';
  // Ensure both carousels are visible when viewer opens
  if (window.initViewerCarousels) window.initViewerCarousels();

  // hideGallery();

  document.getElementById('gallery-modal').style.display = 'none';
}

function closeImageViewer() {
  document.getElementById('image-viewer').style.display = 'none';
  currentViewerImageIndex = -1;
  viewerZoom = 1;
  window.viewerLoadedPreset = null;
  isGalleryMultiActive         = false;
  galleryMultiPresets          = [];
  galleryMultiManualSelections = {};

  // When user exits the viewer, delete the combined temp image and clear combined mode
  if (window.isCombinedMode && window.pendingCombinedImageId) {
    const tempId = window.pendingCombinedImageId;
    window.isCombinedMode = false;
    window.pendingCombinedImageId = null;
    const tempIndex = galleryImages.findIndex(img => img.id === tempId);
    if (tempIndex >= 0) galleryImages.splice(tempIndex, 1);
    deleteImageFromDB(tempId).catch(err => console.error('Failed to delete temp combined image:', err));
  }
  // Hide combined indicator
  const combinedIndicator = document.getElementById('viewer-combined-indicator');
  if (combinedIndicator) combinedIndicator.classList.remove('visible');

  // Show gallery again without resuming camera
  const modal = document.getElementById('gallery-modal');
  modal.style.display = 'flex';
  // Don't call showGallery() as it would reload everything
  // Just refresh the grid
  showGallery(true);
}

async function deleteViewerImage() {
  if (currentViewerImageIndex < 0 || currentViewerImageIndex >= galleryImages.length) {
    return;
  }
  
  if (await confirm('Move this image to trash? It can be restored from Settings \u2192 Restore Deleted Items.')) {
    const imageToDelete = galleryImages[currentViewerImageIndex];
    
    // Remove from IndexedDB
    await softDeleteImage(imageToDelete.id);
    
    // Remove from memory array
    galleryImages.splice(currentViewerImageIndex, 1);
    
    document.getElementById('image-viewer').style.display = 'none';
    currentViewerImageIndex = -1;
    viewerZoom = 1;
    
    showGallery(true);
  }
}

function showPresetSelector() {
  const modal = document.getElementById('preset-selector');
  
  // CRITICAL FIX: Reset multi-preset mode when entering single-select mode
  isMultiPresetMode = false;
  isBatchPresetSelectionActive = false;
  selectedPresets = [];

  // Also clear saved gallery multi state — user is switching to single preset
  clearGalleryMultiState();
  
  // Hide multi-preset controls if they exist
  const multiControls = document.getElementById('multi-preset-controls');
  if (multiControls) multiControls.style.display = 'none';

  // Hide layer-preset controls if they exist
  const layerControls = document.getElementById('layer-preset-controls');
  if (layerControls) layerControls.style.display = 'none';
  isLayerPresetMode = false;
  layerSelectedPresets = [];

  // Reset header to single-select mode
  const header = modal.querySelector('.preset-selector-header h3');
  if (header) {
    header.innerHTML = 'Select Preset (<span id="preset-count">0</span>)';
  }
  
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
    currentItem.scrollIntoView({ behavior: window._alphaLongPressActive ? 'instant' : 'smooth', block: 'nearest' });
    
    // Show category hint with individually clickable categories
    const presetName = currentItem.querySelector('.preset-name').textContent;
    const preset = CAMERA_PRESETS.find(p => p.name === presetName);
    const categoryHint = document.getElementById('preset-selector-category-hint');
    if (categoryHint && preset && preset.category && !isPresetFilterFocused) {
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
          // Rebuild the highlight + category footer right away so the
          // clicked category shows its underline immediately (the menu and
          // settings lists already do this as part of their own repopulate).
          updatePresetSelection();
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
  const container = document.getElementById('mp-slots-container');
  if (container) container.scrollTop = Math.max(0, container.scrollTop - 80);
}

function scrollMasterPromptDown() {
  const container = document.getElementById('mp-slots-container');
  if (container) container.scrollTop = Math.min(container.scrollHeight - container.clientHeight, container.scrollTop + 80);
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

function _applyGalleryHighlight(scrollIntoView) {
  const items = Array.from(document.querySelectorAll('#gallery-grid .gallery-item'));
  items.forEach((item, i) => item.classList.toggle('nav-highlight', i === _galleryHighlightIndex));
  if (scrollIntoView) {
    const target = items[_galleryHighlightIndex];
    if (target) target.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }
}

function _getGalleryTopNavItems() {
  const result = [];
  const closeBtn = document.getElementById('close-gallery');
  const startBtn = document.getElementById('gallery-start-date-btn');
  const endBtn = document.getElementById('gallery-end-date-btn');
  const sortBtn = document.getElementById('gallery-sort-btn');
  const breadcrumb = document.getElementById('gallery-folder-breadcrumb');
  const backBtn = (breadcrumb && breadcrumb.style.display !== 'none')
    ? breadcrumb.querySelector('.gallery-folder-breadcrumb-back')
    : null;
  if (closeBtn) result.push(closeBtn);
  if (startBtn) result.push(startBtn);
  if (endBtn) result.push(endBtn);
  if (sortBtn) result.push(sortBtn);
  if (backBtn) result.push(backBtn);
  return result;
}

function _applyGalleryTopNavHighlight(index) {
  const topItems = _getGalleryTopNavItems();
  topItems.forEach((btn, i) => btn.classList.toggle('nav-highlight-top', i === index));
}

function _clearGalleryTopNavHighlight() {
  _applyGalleryTopNavHighlight(-1);
}

function _getGalleryBottomNavItems() {
  const result = [];
  const prevBtn = document.getElementById('prev-page');
  const nextBtn = document.getElementById('next-page');
  const pagination = document.getElementById('gallery-pagination');
  if (!pagination || pagination.style.display === 'none') return result;
  if (prevBtn && !prevBtn.disabled) result.push(prevBtn);
  if (nextBtn && !nextBtn.disabled) result.push(nextBtn);
  return result;
}

function _applyGalleryBottomNavHighlight(index) {
  const bottomItems = _getGalleryBottomNavItems();
  bottomItems.forEach((btn, i) => btn.classList.toggle('nav-highlight-top', i === index));
}

function _clearGalleryBottomNavHighlight() {
  _applyGalleryBottomNavHighlight(-1);
}

function scrollGalleryUp() {
  const modal = document.getElementById('gallery-modal');
  if (!modal || modal.style.display !== 'flex') return;

  // If we are in the bottom pagination nav, move left or exit back to image grid
  if (_galleryBottomNavIndex >= 0) {
    if (_galleryBottomNavIndex > 0) {
      _galleryBottomNavIndex--;
      _applyGalleryBottomNavHighlight(_galleryBottomNavIndex);
    } else {
      // Exit bottom nav, return to last image in grid
      _clearGalleryBottomNavHighlight();
      _galleryBottomNavIndex = -1;
      const items = document.querySelectorAll('#gallery-grid .gallery-item');
      if (items.length) {
        _galleryHighlightIndex = items.length - 1;
        _applyGalleryHighlight(true);
      }
    }
    return;
  }

  if (_galleryTopNavIndex >= 0) {
    // Already in top nav — move to the previous (higher) button, stop at 0
    if (_galleryTopNavIndex > 0) _galleryTopNavIndex--;
    _applyGalleryTopNavHighlight(_galleryTopNavIndex);
    // Scroll the controls bar into view so the buttons are visible
    const controls = document.querySelector('.gallery-controls');
    if (controls) controls.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    return;
  }

  const items = document.querySelectorAll('#gallery-grid .gallery-item');
  if (!items.length) return;

  if (_galleryHighlightIndex === 0) {
    // At the first image — enter top nav at the bottommost button
    const topItems = _getGalleryTopNavItems();
    if (topItems.length > 0) {
      items.forEach(el => el.classList.remove('nav-highlight'));
      _galleryTopNavIndex = topItems.length - 1;
      _applyGalleryTopNavHighlight(_galleryTopNavIndex);
      // Scroll the controls bar into view so the buttons are visible
      const controls = document.querySelector('.gallery-controls');
      if (controls) controls.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  } else {
    _galleryHighlightIndex--;
    _applyGalleryHighlight(true);
  }
}

function scrollGalleryDown() {
  const modal = document.getElementById('gallery-modal');
  if (!modal || modal.style.display !== 'flex') return;

  // If we are in the bottom pagination nav, move right or stay at end
  if (_galleryBottomNavIndex >= 0) {
    const bottomItems = _getGalleryBottomNavItems();
    if (_galleryBottomNavIndex < bottomItems.length - 1) {
      _galleryBottomNavIndex++;
      _applyGalleryBottomNavHighlight(_galleryBottomNavIndex);
    }
    // Scroll pagination into view
    const pagination = document.getElementById('gallery-pagination');
    if (pagination) pagination.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    return;
  }

  if (_galleryTopNavIndex >= 0) {
    // In top nav — move to the next (lower) button
    const topItems = _getGalleryTopNavItems();
    if (_galleryTopNavIndex < topItems.length - 1) {
      _galleryTopNavIndex++;
      _applyGalleryTopNavHighlight(_galleryTopNavIndex);
    } else {
      // Exit top nav, return to image grid at item 0
      _clearGalleryTopNavHighlight();
      _galleryTopNavIndex = -1;
      const items = document.querySelectorAll('#gallery-grid .gallery-item');
      if (items.length) {
        _galleryHighlightIndex = 0;
        _applyGalleryHighlight(true);
      }
    }
    return;
  }

  const items = document.querySelectorAll('#gallery-grid .gallery-item');
  if (!items.length) return;

  if (_galleryHighlightIndex >= items.length - 1) {
    // At the last image — try to enter bottom pagination nav
    const bottomItems = _getGalleryBottomNavItems();
    if (bottomItems.length > 0) {
      items.forEach(el => el.classList.remove('nav-highlight'));
      _galleryBottomNavIndex = 0;
      _applyGalleryBottomNavHighlight(_galleryBottomNavIndex);
      // Scroll pagination into view
      const pagination = document.getElementById('gallery-pagination');
      if (pagination) pagination.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    return;
  }

  _galleryHighlightIndex = Math.min(items.length - 1, _galleryHighlightIndex + 1);
  _applyGalleryHighlight(true);
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
    
    const messageField = document.getElementById('style-message');
    const container = editor.querySelector('.style-editor-body');

    // If you are typing in the message field, scroll the field itself
    if (document.activeElement === messageField) {
        messageField.scrollTop = Math.max(0, messageField.scrollTop - 100);
    } else if (container) {
        // Otherwise scroll the whole modal
        container.scrollTop = Math.max(0, container.scrollTop - 200);
    }
}

function scrollEditorDown() {
    const editor = document.getElementById('style-editor');
    if (!editor || editor.style.display !== 'flex') return;
    
    const messageField = document.getElementById('style-message');
    const container = editor.querySelector('.style-editor-body');

    // If you are typing in the message field, scroll the field itself
    if (document.activeElement === messageField) {
        messageField.scrollTop = Math.min(messageField.scrollHeight - messageField.clientHeight, messageField.scrollTop + 100);
    } else if (container) {
        // Otherwise scroll the whole modal
        container.scrollTop = Math.min(container.scrollHeight - container.clientHeight, container.scrollTop + 200);
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
  
  const _presetSearchText = presetFilterText ? stripAccents(presetFilterText.toLowerCase()) : '';
  const filtered = getVisiblePresets().filter(preset => {
    // First apply text search filter
    if (_presetSearchText) {
      const searchText = _presetSearchText;
      const categoryMatch = preset.category && preset.category.some(cat => stripAccents(cat.toLowerCase()).includes(searchText));
      const optionsMatch = (
        (preset.options && preset.options.some(o => o.text && stripAccents(o.text.toLowerCase()).includes(searchText))) ||
        (preset.optionGroups && preset.optionGroups.some(g => g.title && stripAccents(g.title.toLowerCase()).includes(searchText) || g.options && g.options.some(o => o.text && stripAccents(o.text.toLowerCase()).includes(searchText))))
      );
      const textMatch = stripAccents(preset.name.toLowerCase()).includes(searchText) ||
             stripAccents((preset.message || '').toLowerCase()).includes(searchText) ||
             stripAccents((preset.additionalInstructions || '').toLowerCase()).includes(searchText) ||
             categoryMatch || optionsMatch;
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
    message.textContent = preset.message || '(No message — uses server default)';
    
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
    
    attachPresetLongPress(item, preset);
    list.appendChild(item);
  });
// Update preset count
  const presetCountElement = document.getElementById('preset-count');
  if (presetCountElement) {
    presetCountElement.textContent = sorted.length;
  }
}

async function selectPreset(preset) {
  // LAYER-preset mode — builds one combined prompt
  if (isLayerPresetMode) {
    const index = layerSelectedPresets.findIndex(p => p.name === preset.name);
    if (index !== -1) {
      // Deselect
      layerSelectedPresets.splice(index, 1);
    } else {
      if (layerSelectedPresets.length >= 5) {
        alert('Maximum 5 presets allowed in Layer mode. Deselect one first.');
        return;
      }
      layerSelectedPresets.push(preset);
    }
    updateLayerPresetList();
    return;
  }

  // Multi-preset mode
  if (isMultiPresetMode) {
    const index = selectedPresets.findIndex(p => p.name === preset.name);
    if (index !== -1) {
      selectedPresets.splice(index, 1);
    } else {
      if (selectedPresets.length >= 20) {
        alert('Maximum 20 presets allowed. Deselect one first.');
        return;
      }
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
  // Build full readable text including options and additional instructions
  const promptInput = document.getElementById('viewer-prompt');
  let fullText = preset.message || '';

  if (preset.randomizeOptions) {
    if (preset.optionGroups && preset.optionGroups.length > 0) {
      preset.optionGroups.forEach(group => {
        fullText += '\n\n' + group.title + ':\n';
        group.options.forEach((opt, i) => {
          fullText += '  ' + i + ': ' + opt.text + '\n';
        });
      });
    } else if (preset.options && preset.options.length > 0) {
      fullText += '\n\nOPTIONS:\n';
      preset.options.forEach((opt, i) => {
        fullText += '  ' + i + ': ' + opt.text + '\n';
      });
    }
  }

  if (preset.additionalInstructions && preset.additionalInstructions.trim()) {
    fullText += '\n\n' + preset.additionalInstructions;
  }

  promptInput.value = fullText;

  // Store the original preset so the Magic button uses the correct structured data
  window.viewerLoadedPreset = preset;

  // If layer mode was active, clear it — user has chosen a new single preset
  clearGalleryLayerState();

  // Update the preset name header
  const presetHeader = document.getElementById('viewer-preset-header');
  if (presetHeader) presetHeader.textContent = preset.name;

  hidePresetSelector();
}

async function submitMagicTransform() {
  if (currentViewerImageIndex < 0 || currentViewerImageIndex >= galleryImages.length) {
    alert('No image selected');
    return;
  }

  // GALLERY LAYER MODE
  // This prevents the random preset picker and wrong manual options modal from firing.

  if (isGalleryLayerActive && galleryLayerPresets.length > 0) {
    const item = galleryImages[currentViewerImageIndex];
    const resizedImageBase64 = await resizeImageForSubmission(item.imageBase64);

    // If manual options mode is on, offer to reuse last time's picks before
    // walking through the options modal again for each preset.
    if (manualOptionsMode && !noMagicMode) {
      const previousLayerSelections = { ...galleryLayerManualSelections };
      const hasPreviousLayerSelections = Object.keys(previousLayerSelections).length > 0;
      let reuseLayerSelections = false;
      if (hasPreviousLayerSelections) {
        reuseLayerSelections = await customConfirm('Use same options selected?');
      }

      if (reuseLayerSelections) {
        galleryLayerManualSelections = previousLayerSelections;
      } else {
        galleryLayerManualSelections = {};
        for (const preset of galleryLayerPresets) {
          const options = parsePresetOptions(preset);
          if (options.length > 0) {
            const selectedValue = await showManualOptionsModal(preset, options);
            if (selectedValue !== null) {
              galleryLayerManualSelections[preset.name] = selectedValue;
            }
          }
        }
      }
    }

    const magicPrompt = buildCombinedLayerPrompt(galleryLayerPresets, galleryLayerManualSelections);

    // GALLERY CREDIT GAME — earn 1 credit per unique imported preset used in this layer
    try {
      const imported = presetImporter.getImportedPresets();
      if (imported.length > 0) {
        const importedNames = new Set(imported.map(p => p.name));
        const presetsUsed = galleryLayerPresets.filter(p => p.name && importedNames.has(p.name));
        let totalNewCredits = 0;
        for (const p of presetsUsed) {
          if (earnCredit(p.name)) totalNewCredits++;
        }
        if (totalNewCredits > 0) {
          const creditsEl = document.getElementById('import-credits-display');
          if (creditsEl) creditsEl.textContent = `Credits: ${getCredits()}`;
          setTimeout(() => {
            const newTotal = getCredits();
            showGalleryCreditFlash(`🪙 ${totalNewCredits > 1 ? totalNewCredits + ' Credits' : 'Credit'} Earned!\n(${newTotal} total)`);
          }, 300);
        }
      }
    } catch (e) { /* non-critical */ }

    // ALWAYS queue it first — whether online or offline — so it survives
    // an app restart or a lost connection partway through sending.
    // Same queue the camera screen's Sync button uses.
    const queueItem = {
      id: Date.now().toString() + '-gal-layer',
      imageBase64: resizedImageBase64,
      preset: {
        name: 'Layer: ' + galleryLayerPresets.map(p => p.name).join(' + '),
        message: magicPrompt,
        options: [],
        randomizeOptions: false,
        additionalInstructions: ''
      },
      isCombined: false,
      timestamp: Date.now()
    };
    photoQueue.push(queueItem);
    saveQueue();
    updateQueueDisplay();

    if (isOnline) {
      showGallerySubmittingIndicator('Submitting layers...');
      if (!isSyncing) syncQueuedPhotos();
      waitForSyncToFinish().then(hideGallerySubmittingIndicator);
      alert('Magic transform submitted! You can submit again with a different prompt.');
    } else {
      showGalleryPresetFlash('Layer queued');
      alert('You\'re offline — this will send automatically once you\'re back online (or tap Sync on the camera screen).');
    }
    return;
  }
  // END GALLERY LAYER MODE 

  // GALLERY MULTI MODE
  // Re-applies the previously saved multi presets without re-opening the selector.

  if (isGalleryMultiActive && galleryMultiPresets.length > 0) {
    const item = galleryImages[currentViewerImageIndex];
    const resizedImageBase64 = await resizeImageForSubmission(item.imageBase64);

    // If manual options mode is on, offer to reuse last time's picks before
    // walking through the options modal again for each preset.
    if (manualOptionsMode && !noMagicMode) {
      const previousMultiSelections = { ...galleryMultiManualSelections };
      const hasPreviousMultiSelections = Object.keys(previousMultiSelections).length > 0;
      let reuseMultiSelections = false;
      if (hasPreviousMultiSelections) {
        reuseMultiSelections = await customConfirm('Use same options selected?');
      }

      if (reuseMultiSelections) {
        galleryMultiManualSelections = previousMultiSelections;
      } else {
        galleryMultiManualSelections = {};
        for (const preset of galleryMultiPresets) {
          const options = parsePresetOptions(preset);
          if (options.length > 0) {
            const selectedValue = await showManualOptionsModal(preset, options);
            if (selectedValue !== null) {
              galleryMultiManualSelections[preset.name] = selectedValue;
            }
          }
        }
      }
    }

    // GALLERY CREDIT GAME — earn 1 credit per unique imported preset used in this multi-selection
    try {
      const imported = presetImporter.getImportedPresets();
      if (imported.length > 0) {
        const importedNames = new Set(imported.map(p => p.name));
        const presetsUsed = galleryMultiPresets.filter(p => p.name && importedNames.has(p.name));
        let totalNewCredits = 0;
        for (const p of presetsUsed) {
          if (earnCredit(p.name)) totalNewCredits++;
        }
        if (totalNewCredits > 0) {
          const creditsEl = document.getElementById('import-credits-display');
          if (creditsEl) creditsEl.textContent = `Credits: ${getCredits()}`;
          setTimeout(() => {
            const newTotal = getCredits();
            showGalleryCreditFlash(`🪙 ${totalNewCredits > 1 ? totalNewCredits + ' Credits' : 'Credit'} Earned!\n(${newTotal} total)`);
          }, 300);
        }
      }
    } catch (e) { /* non-critical */ }

    // ALWAYS queue every preset first — whether online or offline — so
    // nothing gets lost if the connection drops partway through.
    // Same queue the camera screen's Sync button uses.
    const presetsToApply = [...galleryMultiPresets];
    for (let i = 0; i < presetsToApply.length; i++) {
      const preset = presetsToApply[i];
      const manualSelection = galleryMultiManualSelections[preset.name] ?? null;
      const queueItem = {
        id: Date.now().toString() + '-gal-mp' + i,
        imageBase64: resizedImageBase64,
        preset: preset,
        manualSelection: manualSelection,
        timestamp: Date.now()
      };
      photoQueue.push(queueItem);
    }
    saveQueue();
    updateQueueDisplay();

    if (isOnline) {
      showGallerySubmittingIndicator(`Submitting ${presetsToApply.length} preset${presetsToApply.length > 1 ? 's' : ''}...`, true);
      if (!isSyncing) syncQueuedPhotos();
      waitForSyncToFinish().then(hideGallerySubmittingIndicator);
      alert(`${presetsToApply.length} preset${presetsToApply.length > 1 ? 's' : ''} submitted!`);
    } else {
      showGalleryPresetFlash(`${presetsToApply.length} preset${presetsToApply.length > 1 ? 's' : ''} queued`);
      alert(`You're offline — ${presetsToApply.length} preset${presetsToApply.length > 1 ? 's' : ''} queued. They'll send automatically once you're back online (or tap Sync on the camera screen).`);
    }
    return;
  }
  // END GALLERY MULTI MODE

  const promptInput = document.getElementById('viewer-prompt');
  let prompt = promptInput.value.trim();
  let presetName = 'Custom Prompt';
  let matchedPreset = null;
  let manualSelection = null;
  
 // Check if this prompt matches a known preset (loaded via "Load Preset")
  // Use stored preset directly - textarea may contain expanded text so don't compare by message
  if (window.viewerLoadedPreset) {
    matchedPreset = window.viewerLoadedPreset;
    presetName = matchedPreset.name;
  } else if (prompt) {
    matchedPreset = CAMERA_PRESETS.find(p => p.message === prompt);
    if (matchedPreset) {
      presetName = matchedPreset.name;
    }
  }
  
  // If no prompt entered, only use a random preset if no preset was intentionally loaded
  if (!prompt && !window.viewerLoadedPreset) {
    const randomIndex = getRandomPresetIndex();
    const randomPreset = CAMERA_PRESETS[randomIndex];
    matchedPreset = randomPreset;
    prompt = randomPreset.message;
    presetName = randomPreset.name;
    
    // Show which preset was randomly selected
    alert(`Using random preset: ${presetName}`);
  }
  
 // Handle manual options for gallery
  // Manual Options does NOT work with No Magic Mode
  if (manualOptionsMode && !noMagicMode && matchedPreset) {
    const options = parsePresetOptions(matchedPreset);
    
    if (options.length > 0) {
      let reuseSingleSelection = false;
      if (gallerySingleLastPresetName === matchedPreset.name && gallerySingleLastSelection !== null) {
        reuseSingleSelection = await customConfirm('Use same options selected?');
      }

      let selectedValue;
      if (reuseSingleSelection) {
        selectedValue = gallerySingleLastSelection;
      } else {
        selectedValue = await showManualOptionsModal(matchedPreset, options);

        if (selectedValue === null) {
          return; // User cancelled
        }
      }

      manualSelection = selectedValue;
      gallerySingleLastPresetName = matchedPreset.name;
      gallerySingleLastSelection = selectedValue;
    }
  }
  
  // If manual options mode is OFF, check if user made inline selections in the viewer
  if (!manualOptionsMode && matchedPreset && matchedPreset.randomizeOptions) {
    const inlineSelection = collectViewerSelectedOptions(matchedPreset);
    if (inlineSelection !== null) {
      manualSelection = inlineSelection;
    }
  }
  
  const item = galleryImages[currentViewerImageIndex];
  const resizedImageBase64 = await resizeImageForSubmission(item.imageBase64);
  const finalPreset = matchedPreset || {name: presetName, message: prompt, options: [], randomizeOptions: false, additionalInstructions: ''};

  // GALLERY CREDIT GAME — earn 1 credit if this is the first time using this imported preset
  // (moved here so it fires the same way whether you're online or offline)
  try {
    const imported = presetImporter.getImportedPresets();
    const usedName = matchedPreset ? matchedPreset.name : presetName;
    const isImported = imported.some(p => p.name === usedName);
    if (isImported && usedName) {
      const credited = earnCredit(usedName);
      if (credited) {
        const creditsEl = document.getElementById('import-credits-display');
        if (creditsEl) creditsEl.textContent = `Credits: ${getCredits()}`;
        setTimeout(() => {
          const newTotal = getCredits();
          showGalleryCreditFlash(`🪙 Credit Earned!\n(${newTotal} total)`);
        }, 300);
      }
    }
  } catch (e) { /* non-critical */ }

  // ALWAYS queue it first — whether online or offline — so it survives an
  // app restart or a lost connection partway through sending.
  // Same queue the camera screen's Sync button uses.
  const queueItem = {
    id: Date.now().toString() + '-gal-single',
    imageBase64: resizedImageBase64,
    preset: finalPreset,
    manualSelection: manualSelection,
    timestamp: Date.now()
  };
  photoQueue.push(queueItem);
  saveQueue();
  updateQueueDisplay();

  if (isOnline) {
    showGallerySubmittingIndicator(`Submitting ${finalPreset.name}...`, true);
    if (!isSyncing) syncQueuedPhotos();
    waitForSyncToFinish().then(hideGallerySubmittingIndicator);
    alert('Magic transform submitted! You can submit again with a different prompt.');
  } else {
    showGalleryPresetFlash(`${finalPreset.name} queued`);
    alert('You\'re offline — this will send automatically once you\'re back online (or tap Sync on the camera screen).');
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
    showGallery(true);
  } else {
    toggleBtn.textContent = 'Select';
    toggleBtn.classList.remove('active');
    batchControls.style.display = 'none';
    batchActionBar.style.display = 'none';
    selectedBatchImages.clear();
    showGallery(true);
  }
}

function updateBatchSelection() {
  const countElement = document.getElementById('batch-selected-count');
  const applyButton = document.getElementById('batch-apply-preset');
  const deleteButton = document.getElementById('batch-delete');
  const combineButton = document.getElementById('batch-combine');
  
  countElement.textContent = `${selectedBatchImages.size} selected`;
  applyButton.disabled = selectedBatchImages.size === 0;
  if (deleteButton) {
    deleteButton.disabled = selectedBatchImages.size === 0;
  }
  // Combine only active when exactly 2 images selected
  if (combineButton) {
    combineButton.disabled = selectedBatchImages.size !== 2;
  }
}

function selectAllBatchImages() {
  selectedBatchImages.clear();
  // Include folders if at root
  if (currentFolderView === null) {
    galleryFolders.forEach(f => selectedBatchImages.add(f.id));
  }
  // Include images in current view
  getImagesInCurrentView().forEach(img => selectedBatchImages.add(img.id));
  updateBatchSelection();
  showGallery(true);
}

function deselectAllBatchImages() {
  selectedBatchImages.clear();
  updateBatchSelection();
  showGallery(true);
}

function toggleBatchImageSelection(imageId) {
  if (selectedBatchImages.has(imageId)) {
    selectedBatchImages.delete(imageId);
  } else {
    selectedBatchImages.add(imageId);
  }
  updateBatchSelection();

  // Update the checkbox and highlight directly in the DOM
  // so we don't need a full page reload on every click
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;
  grid.querySelectorAll('.gallery-item').forEach(container => {
    if (container.dataset.imageId === imageId) {
      const checkbox = container.querySelector('.gallery-item-checkbox');
      const selected = selectedBatchImages.has(imageId);
      if (checkbox) checkbox.checked = selected;
      if (selected) {
        container.classList.add('selected');
      } else {
        container.classList.remove('selected');
      }
    }
  });
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

  // If Manual Options mode is on, ask the user ONCE before processing any images
  let batchManualSelection = null;
  if (manualOptionsMode && !noMagicMode) {
    const options = parsePresetOptions(preset);
    if (options.length > 0) {
      batchManualSelection = await showManualOptionsModal(preset, options);
    }
  }

  // ALWAYS queue every image first — whether online or offline — so
  // nothing gets lost if the connection drops partway through the batch.
  // Same queue the camera screen's Sync button uses.
  for (let i = 0; i < selectedIds.length; i++) {
    const imageId = selectedIds[i];
    const image = galleryImages.find(img => img.id === imageId);
    if (!image) continue;
    const resizedImageBase64 = await resizeImageForSubmission(image.imageBase64);
    const queueItem = {
      id: Date.now().toString() + '-gal-batch' + i,
      imageBase64: resizedImageBase64,
      preset: preset,
      manualSelection: batchManualSelection,
      timestamp: Date.now()
    };
    photoQueue.push(queueItem);
  }
  saveQueue();
  updateQueueDisplay();
  isBatchMode = false;
  selectedBatchImages.clear();
  toggleBatchMode();

  if (isOnline) {
    if (!isSyncing) syncQueuedPhotos();
    alert(`${total} image${total > 1 ? 's' : ''} submitted!`);
  } else {
    alert(`You're offline — ${total} image${total > 1 ? 's' : ''} queued. They'll send automatically once you're back online (or tap Sync on the camera screen).`);
  }
}

async function reencodeImageVariant(base64, index) {
  // Produces microscopically different JPEG bytes for each index
  // while keeping the image visually identical.
  // This prevents the backend from fingerprinting repeated identical submissions.
  if (index === 0) return base64;
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      // Each index uses a slightly different quality — visually imperceptible
      const quality = Math.max(0.80, 0.92 - (index * 0.002));
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => resolve(base64);
    img.src = base64;
  });
}

// Resize a base64 image to fit within 2048px wide while maintaining 3:4 aspect ratio
// Returns a new base64 string at the corrected size
async function resizeImageForSubmission(imageBase64) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const MAX_WIDTH = 2048;
      const TARGET_RATIO_W = 3;
      const TARGET_RATIO_H = 4;

      // Calculate canvas size to match 3:4 aspect ratio
      let canvasWidth = img.width;
      let canvasHeight = Math.round(canvasWidth * TARGET_RATIO_H / TARGET_RATIO_W);

      // If the image is taller than the 3:4 canvas, anchor to height instead
      if (img.height > canvasHeight) {
        canvasHeight = img.height;
        canvasWidth = Math.round(canvasHeight * TARGET_RATIO_W / TARGET_RATIO_H);
      }

      // Cap at 2048px wide
      if (canvasWidth > MAX_WIDTH) {
        const downScale = MAX_WIDTH / canvasWidth;
        canvasWidth = MAX_WIDTH;
        canvasHeight = Math.round(canvasHeight * downScale);
      }

      const canvas = document.createElement('canvas');
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      const ctx = canvas.getContext('2d');

      // Black background (fills any letterbox padding)
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // Scale image to fit within the canvas, preserving its aspect ratio
      const scale = Math.min(canvasWidth / img.width, canvasHeight / img.height);
      const drawW = Math.round(img.width * scale);
      const drawH = Math.round(img.height * scale);
      const offsetX = Math.floor((canvasWidth - drawW) / 2);
      const offsetY = Math.floor((canvasHeight - drawH) / 2);

      ctx.drawImage(img, offsetX, offsetY, drawW, drawH);

      resolve(canvas.toDataURL('image/jpeg', 0.92));
    };
    img.onerror = () => resolve(imageBase64); // Fall back to original if load fails
    img.src = imageBase64;
  });
}

// ── CAMERA LIVE COMBINE MODE ──────────────────────────────────────────────

// Toggles camera live combine mode on/off.
// Blocked during burst, timer, and motion detection.
function toggleCameraLiveCombineMode() {
  if (isBurstMode || isTimerMode || isMotionDetectionMode) {
    alert('Combine mode is not available with Burst, Timer, or Motion Detection.');
    return;
  }
  window.isCameraLiveCombineMode = !window.isCameraLiveCombineMode;
  window.cameraCombineFirstPhoto = null; // reset any pending first photo

  const btn = document.getElementById('camera-combine-toggle');
  if (btn) {
    if (window.isCameraLiveCombineMode) {
      btn.classList.add('combine-active');
      if (statusElement) statusElement.textContent = '🖼️🖼️ Combine ON — press side button to take first photo';
      showStyleReveal('🖼️🖼️ COMBINE ON\nTAKE 1ST PHOTO');
    } else {
      btn.classList.remove('combine-active');
      if (statusElement) updatePresetDisplay();
    }
  }
}

// Takes two base64 images and returns a combined base64 using the same
// side-by-side 3:4 canvas logic as the gallery combine function.
async function buildCombinedImageBase64(base64A, base64B) {
  // Resize each photo to valid resolution and 3:4 aspect ratio before combining,
  // so the combined canvas dimensions are consistent with gallery combine behaviour.
  const [resizedA, resizedB] = await Promise.all([
    resizeImageForSubmission(base64A),
    resizeImageForSubmission(base64B)
  ]);

  const loadImg = (src) => new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Image load failed'));
    img.src = src;
  });

  const [imageA, imageB] = await Promise.all([loadImg(resizedA), loadImg(resizedB)]);

  const targetHeight = Math.max(imageA.height, imageB.height);
  const scaleA = targetHeight / imageA.height;
  const scaleB = targetHeight / imageB.height;
  const totalWidth = Math.round(imageA.width * scaleA) + Math.round(imageB.width * scaleB);

  const targetRatioW = 3;
  const targetRatioH = 4;
  let canvasWidth = totalWidth;
  let canvasHeight = Math.round(canvasWidth * targetRatioH / targetRatioW);

  if (targetHeight > canvasHeight) {
    canvasHeight = targetHeight;
    canvasWidth = Math.round(canvasHeight * targetRatioW / targetRatioH);
  }

  const MAX_WIDTH = 2048;
  if (canvasWidth > MAX_WIDTH) {
    const downScale = MAX_WIDTH / canvasWidth;
    canvasWidth = MAX_WIDTH;
    canvasHeight = Math.round(canvasHeight * downScale);
  }

  const halfCanvas = Math.floor(canvasWidth / 2);
  const finalHeightA = Math.round(imageA.height * (halfCanvas / imageA.width));
  const finalHeightB = Math.round(imageB.height * (halfCanvas / imageB.width));

  const canvas = document.createElement('canvas');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  ctx.drawImage(imageA, 0, Math.floor((canvasHeight - finalHeightA) / 2), halfCanvas, finalHeightA);
  ctx.drawImage(imageB, halfCanvas, Math.floor((canvasHeight - finalHeightB) / 2), halfCanvas, finalHeightB);

  ctx.strokeStyle = 'rgba(255,255,255,0.3)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(halfCanvas, 0);
  ctx.lineTo(halfCanvas, canvasHeight);
  ctx.stroke();

  return canvas.toDataURL('image/jpeg', 0.92);
}

// Called after both photos are taken in camera live combine mode.
// Combines them and sends the result with the appropriate preset.
async function finalizeCameraLiveCombine(photo1Base64, photo2Base64, presetOverride, isVoiceMode) {
  try {
    statusElement.textContent = '🖼️ Combining photos...';

    const combinedBase64 = await buildCombinedImageBase64(photo1Base64, photo2Base64);
    // Combined image is kept in memory only — not saved to the gallery.
    // The two individual photos were already saved to the gallery when captured.

    // Determine which preset to use
    let preset;
    if (presetOverride) {
      // Voice mode: use the spoken preset exactly as-is, no combine preamble
      preset = presetOverride;
    } else if (isCameraMultiPresetActive && cameraSelectedPresets.length > 0) {
      // Multi-preset mode: handled separately below
      preset = null;
    } else if (isCameraLayerActive && cameraLayerPresets.length > 0) {
      // Layer mode: handled separately below
      preset = null;
    } else if (isRandomMode) {
      currentPresetIndex = getRandomPresetIndex();
      preset = CAMERA_PRESETS[currentPresetIndex];
      showStyleReveal(preset.name);
    } else {
      preset = CAMERA_PRESETS[currentPresetIndex];
    }

    // Build the queue item(s) and send
    if (isCameraMultiPresetActive && cameraSelectedPresets.length > 0 && !presetOverride) {
      // Multi-preset combine: one queue item per preset, all with the combined image
      const presetsToApply = [...cameraSelectedPresets];
      for (let i = 0; i < presetsToApply.length; i++) {
        const p = presetsToApply[i];
        const manualSelection = cameraMultiManualSelections[p.name] ?? null;

        // Apply combine preamble for multi-preset (not voice mode)
        window.isCombinedMode = true;
        const finalPrompt = getFinalPrompt(p, manualSelection);
        window.isCombinedMode = false;

        const queueItem = {
          id: Date.now().toString() + '-cam-comb-mp' + i,
          imageBase64: combinedBase64,
          preset: p,
          manualSelection: manualSelection,
          isCombined: true,
          timestamp: Date.now()
        };
        photoQueue.push(queueItem);
      }
      saveQueue();
      updateQueueDisplay();

      if (isOnline && !noMagicMode) {
        statusElement.textContent = `Multi combine: sending ${presetsToApply.length} presets...`;
        if (!isSyncing) syncQueuedPhotos();
      } else {
        statusElement.textContent = `${presetsToApply.length} combined presets queued`;
      }

    } else if (isCameraLayerActive && cameraLayerPresets.length > 0 && !presetOverride) {
      // Layer combine: merge all layer presets into ONE prompt, apply combine preamble to primary
      const combinedPrompt = buildCombinedLayerPrompt(cameraLayerPresets, cameraLayerManualSelections);
      const queueItem = {
        id: Date.now().toString() + '-layer-comb',
        imageBase64: combinedBase64,
        preset: {
          name: 'Layer: ' + cameraLayerPresets.map(p => p.name).join(' + '),
          message: combinedPrompt,
          options: [],
          randomizeOptions: false,
          additionalInstructions: ''
        },
        isCombined: false,
        timestamp: Date.now()
      };
      photoQueue.push(queueItem);
      saveQueue();
      updateQueueDisplay();

      if (isOnline && !noMagicMode) {
        statusElement.textContent = `📑🖼️🖼️ Layer combine sent!`;
        if (!isSyncing) syncQueuedPhotos();
      } else {
        statusElement.textContent = `📑🖼️🖼️ Layer combine queued`;
      }

        // Layer mode persists — user must tap the lit button to clear it

      } else if (preset) {
      // Single preset path
      // For voice mode the preset message is already the full spoken intent —
      // do NOT apply the combine preamble (user described what they wanted).
      // For normal/random mode, apply the combine preamble.

      let finalPrompt;
      if (isVoiceMode) {
        finalPrompt = getFinalPrompt(preset, null); // no combine preamble
      } else {
        window.isCombinedMode = true;
        finalPrompt = getFinalPrompt(preset, null);
        window.isCombinedMode = false;
      }

      const queueItem = {
        id: Date.now().toString() + '-cam-comb',
        imageBase64: combinedBase64,
        preset: preset,
        isCombined: !isVoiceMode,
        timestamp: Date.now()
      };
      photoQueue.push(queueItem);
      saveQueue();
      updateQueueDisplay();

      if (isOnline && !noMagicMode) {
        statusElement.textContent = '🖼️🖼️ Combined photo sent!';
        if (!isSyncing) syncQueuedPhotos();
      } else {
        statusElement.textContent = '🖼️🖼️ Combined photo queued';
      }
    }

    // Clean up combine mode state
    window.isCameraLiveCombineMode = false;
    window.cameraCombineFirstPhoto = null;
    const btn = document.getElementById('camera-combine-toggle');
    if (btn) btn.classList.remove('combine-active');

  } catch (err) {
    console.error('Camera live combine failed:', err);
    statusElement.textContent = '❌ Combine failed: ' + err.message;
    window.cameraCombineFirstPhoto = null;
  }
}

// END CAMERA LIVE COMBINE MODE

// GALLERY FOLDER FUNCTIONS

function loadFolders() {
  try {
    const saved = localStorage.getItem(FOLDERS_STORAGE_KEY);
    galleryFolders = saved ? JSON.parse(saved) : [];
    if (!Array.isArray(galleryFolders)) galleryFolders = [];
  } catch (e) {
    galleryFolders = [];
  }
}

function saveFolders() {
  localStorage.setItem(FOLDERS_STORAGE_KEY, JSON.stringify(galleryFolders));
}

function createNewFolder() {
  const id = 'folder-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6);
  const folder = { id, name: 'New Folder', createdAt: Date.now() };
  galleryFolders.push(folder);
  saveFolders();
  showGallery(true);
  // Immediately enter rename mode for the new folder
  setTimeout(() => startFolderRename(id), 100);
}

function startFolderRename(folderId) {
  const el = document.querySelector(`.gallery-folder[data-folder-id="${folderId}"]`);
  if (!el) return;
  el.classList.add('gallery-folder-renaming');
  const nameEl = el.querySelector('.gallery-folder-name');
  const folder = galleryFolders.find(f => f.id === folderId);
  if (!folder) return;

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'gallery-folder-rename-input';
  input.value = folder.name === 'New Folder' ? '' : folder.name;
  input.placeholder = 'Folder name';
  input.maxLength = 30;
  el.appendChild(input);
  input.focus();

  const save = () => {
    const newName = input.value.trim() || 'New Folder';
    folder.name = newName;
    saveFolders();
    el.classList.remove('gallery-folder-renaming');
    input.remove();
    if (nameEl) nameEl.textContent = newName;
  };

  input.addEventListener('blur', save);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); save(); }
  });
}

function openFolderView(folderId) {
  currentFolderView = folderId;
  currentGalleryPage = 1;
  showGallery(true);
}

function closeFolderView() {
  currentFolderView = null;
  currentGalleryPage = 1;
  showGallery(true);
}

function getImagesInCurrentView() {
  // Returns images belonging to the current view (root or folder)
  if (currentFolderView === null) {
    return galleryImages.filter(img => !img.folderId && !img.isCombinedTemp);
  } else {
    return galleryImages.filter(img => img.folderId === currentFolderView);
  }
}

async function moveSelectedImagesToFolder(targetFolderId) {
  // targetFolderId = null means move to root gallery
  const ids = Array.from(selectedBatchImages);
  for (const imageId of ids) {
    const img = galleryImages.find(i => i.id === imageId);
    if (!img) continue;
    if (targetFolderId === null) {
      delete img.folderId;
    } else {
      img.folderId = targetFolderId;
    }
    // Persist the updated folderId to IndexedDB
    await saveImageToDB(img);
  }
  selectedBatchImages.clear();
  updateBatchSelection();
  showGallery(true);
}

function showMoveToFolderModal() {
  if (selectedBatchImages.size === 0) return;
  const modal = document.getElementById('move-to-folder-modal');
  const list = document.getElementById('move-to-folder-list');
  list.innerHTML = '';

  // Gallery (root) option
  const rootItem = document.createElement('div');
  rootItem.className = 'move-to-folder-item gallery-root';
  rootItem.innerHTML = '🖼️ Gallery (root)';
  rootItem.addEventListener('click', async () => {
    modal.style.display = 'none';
    await moveSelectedImagesToFolder(null);
  });
  list.appendChild(rootItem);

  // Each folder
  galleryFolders.forEach(folder => {
    const item = document.createElement('div');
    item.className = 'move-to-folder-item';
    item.innerHTML = `📁 ${folder.name}`;
    item.addEventListener('click', async () => {
      modal.style.display = 'none';
      await moveSelectedImagesToFolder(folder.id);
    });
    list.appendChild(item);
  });

  modal.style.display = 'flex';
}

async function deleteFolderAndContents(folderId) {
  // When a folder is deleted, move its images back to root
  for (const img of galleryImages) {
    if (img.folderId === folderId) {
      delete img.folderId;
      await saveImageToDB(img);
    }
  }
  galleryFolders = galleryFolders.filter(f => f.id !== folderId);
  saveFolders();
  if (currentFolderView === folderId) {
    currentFolderView = null;
  }
}

// END GALLERY FOLDER FUNCTIONS

async function combineTwoImages() {
  if (selectedBatchImages.size !== 2) {
    alert('Please select exactly 2 images to combine.');
    return;
  }

  const ids = Array.from(selectedBatchImages);
  const imgA = galleryImages.find(img => img.id === ids[0]);
  const imgB = galleryImages.find(img => img.id === ids[1]);

  if (!imgA || !imgB) {
    alert('Could not find selected images.');
    return;
  }

  try {
    showGalleryStatusMessage('Combining images...', 'info', 0);

    const loadImage = (src) => new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error('Failed to load image'));
      image.src = src;
    });

    const [imageA, imageB] = await Promise.all([
      loadImage(imgA.imageBase64),
      loadImage(imgB.imageBase64)
    ]);

    // Scale both images to the same height (the taller one sets the height)
    // then place side by side — no cropping
    const targetHeight = Math.max(imageA.height, imageB.height);

    // Scale each image proportionally to targetHeight
    const scaleA = targetHeight / imageA.height;
    const scaleB = targetHeight / imageB.height;
    const scaledWidthA = Math.round(imageA.width * scaleA);
    const scaledWidthB = Math.round(imageB.width * scaleB);
    const totalWidth = scaledWidthA + scaledWidthB;

    // Enforce 3:4 aspect ratio (width:height = 3:4) for the combined canvas
    // Fit within this ratio without cropping — pad with black if needed
    const targetRatioW = 3;
    const targetRatioH = 4;

    // Canvas height based on 3:4 from total width
    let canvasWidth = totalWidth;
    let canvasHeight = Math.round(canvasWidth * targetRatioH / targetRatioW);

    // If the images at targetHeight are taller than the 3:4 canvas, scale down
    if (targetHeight > canvasHeight) {
      canvasHeight = targetHeight;
      canvasWidth = Math.round(canvasHeight * targetRatioW / targetRatioH);
    }

    // Cap at 2048px wide to stay within safe canvas limits
    const MAX_WIDTH = 2048;
    if (canvasWidth > MAX_WIDTH) {
      const downScale = MAX_WIDTH / canvasWidth;
      canvasWidth = MAX_WIDTH;
      canvasHeight = Math.round(canvasHeight * downScale);
    }

    // Recalculate image widths to fit within the canvas width (half each)
    const halfCanvas = Math.floor(canvasWidth / 2);
    const finalHeightA = Math.round(imageA.height * (halfCanvas / imageA.width));
    const finalHeightB = Math.round(imageB.height * (halfCanvas / imageB.width));

    const canvas = document.createElement('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext('2d');

    // Black background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw image A on left half, vertically centred, no cropping
    const offsetAY = Math.floor((canvasHeight - finalHeightA) / 2);
    ctx.drawImage(imageA, 0, offsetAY, halfCanvas, finalHeightA);

    // Draw image B on right half, vertically centred, no cropping
    const offsetBY = Math.floor((canvasHeight - finalHeightB) / 2);
    ctx.drawImage(imageB, halfCanvas, offsetBY, halfCanvas, finalHeightB);

    // Dividing line
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(halfCanvas, 0);
    ctx.lineTo(halfCanvas, canvasHeight);
    ctx.stroke();

    const combinedBase64 = canvas.toDataURL('image/jpeg', 0.92);

    // Save as temporary combined image — flagged for deletion after use
    const tempId = Date.now().toString() + '-combined-' + Math.random().toString(36).substr(2, 9);
    const newImageData = {
      id: tempId,
      imageBase64: combinedBase64,
      timestamp: Date.now(),
      isCombinedTemp: true
    };

    galleryImages.unshift(newImageData);
    await saveImageToDB(newImageData);

    // Store the combined image ID so we can delete it after sending
    window.pendingCombinedImageId = tempId;
    window.isCombinedMode = true;

    // Exit batch mode silently
    isBatchMode = false;
    selectedBatchImages.clear();
    const toggleBtn = document.getElementById('batch-mode-toggle');
    const batchControls = document.getElementById('batch-controls');
    const batchActionBar = document.getElementById('batch-action-bar');
    if (toggleBtn) { toggleBtn.textContent = 'Select'; toggleBtn.classList.remove('active'); }
    if (batchControls) batchControls.style.display = 'none';
    if (batchActionBar) batchActionBar.style.display = 'none';

    // Open the combined image in the viewer immediately
    await showGallery();
    const newIndex = galleryImages.findIndex(img => img.id === tempId);
    if (newIndex >= 0) {
      document.getElementById('gallery-modal').style.display = 'none';
      openImageViewer(newIndex);
    }

    showGalleryStatusMessage(
      '✅ Images combined! Now select a preset and tap ✨ MAGIC to transform both subjects.',
      'success',
      5000
    );

  } catch (err) {
    window.isCombinedMode = false;
    window.pendingCombinedImageId = null;
    console.error('Combine failed:', err);
    showGalleryStatusMessage('Failed to combine images: ' + err.message, 'error', 4000);
  }
}

async function batchDeleteImages() {
  if (selectedBatchImages.size === 0) return;
  
  const count = selectedBatchImages.size;
  // Count folders and images separately so the message describes the right things.
  // Deleting a folder is NOT a trash move — the folder goes away and its images
  // return to the main gallery — so the wording must not promise trash restore.
  const selIds = Array.from(selectedBatchImages);
  const folderSelCount = selIds.filter(id => id.startsWith('folder-')).length;
  const imageSelCount = selIds.length - folderSelCount;

  let confirmMsg;
  if (folderSelCount > 0 && imageSelCount > 0) {
    confirmMsg = `Delete ${folderSelCount} folder${folderSelCount > 1 ? 's' : ''} and move ${imageSelCount} image${imageSelCount > 1 ? 's' : ''} to trash? Images inside deleted folders move back to the main gallery. Trashed images can be restored from Settings \u2192 Restore Deleted Items.`;
  } else if (folderSelCount > 0) {
    confirmMsg = `Delete ${folderSelCount} folder${folderSelCount > 1 ? 's' : ''}? The images inside will move back to the main gallery.`;
  } else {
    confirmMsg = `Move ${imageSelCount} selected image${imageSelCount > 1 ? 's' : ''} to trash? They can be restored from Settings \u2192 Restore Deleted Items.`;
  }
  const confirmed = await confirm(confirmMsg);
  
  if (!confirmed) return;
  
  // Separate folders from images in the selection
  const foldersToDelete = Array.from(selectedBatchImages).filter(id => id.startsWith('folder-'));
  const imagesToDelete = Array.from(selectedBatchImages).filter(id => !id.startsWith('folder-'));

  // Delete selected folders (images inside move to root)
  for (const folderId of foldersToDelete) {
    await deleteFolderAndContents(folderId);
  }
  
  // Show progress (only when there are images to move — folder removal is instant)
  let deleted = 0;

  if (imagesToDelete.length > 0) {
    const overlay = document.createElement('div');
    overlay.className = 'batch-progress-overlay';
    overlay.innerHTML = `
      <div class="batch-progress-text">Deleting <span id="batch-current">0</span> / ${imagesToDelete.length}</div>
      <div class="batch-progress-bar">
        <div class="batch-progress-fill" id="batch-progress-fill" style="width: 0%"></div>
      </div>
    `;
    document.body.appendChild(overlay);

    for (const imageId of imagesToDelete) {
      try {
        await softDeleteImage(imageId);
        deleted++;
        document.getElementById('batch-current').textContent = deleted;
        document.getElementById('batch-progress-fill').style.width = `${(deleted / imagesToDelete.length) * 100}%`;
      } catch (error) {
        console.error(`Failed to delete image ${imageId}:`, error);
      }
    }

    document.body.removeChild(overlay);
  }

  // Exit batch mode cleanly — set flag first then update UI without toggling
  isBatchMode = false;
  selectedBatchImages.clear();
  await loadGallery();

  // Update UI to reflect batch mode is off without calling toggleBatchMode()
  // (toggleBatchMode would flip isBatchMode back to true since it's already false)
  const toggleBtn = document.getElementById('batch-mode-toggle');
  const batchControls = document.getElementById('batch-controls');
  const batchActionBar = document.getElementById('batch-action-bar');
  if (toggleBtn) { toggleBtn.textContent = 'Select'; toggleBtn.classList.remove('active'); }
  if (batchControls) batchControls.style.display = 'none';
  if (batchActionBar) batchActionBar.style.display = 'none';

  showGallery(true);

  const resultParts = [];
  if (deleted > 0) resultParts.push(`${deleted} image${deleted !== 1 ? 's' : ''} moved to trash`);
  if (foldersToDelete.length > 0) resultParts.push(`${foldersToDelete.length} folder${foldersToDelete.length !== 1 ? 's' : ''} deleted`);
  alert(resultParts.length > 0 ? resultParts.join(' and ') + '.' : 'Nothing was deleted.');
}

function openMultiPresetSelector(imageId) {
  multiPresetImageId = imageId;
  // Pre-populate with previously saved gallery multi selections (like LAYER does)
  selectedPresets = isGalleryMultiActive ? [...galleryMultiPresets] : [];
  isMultiPresetMode = true;
  
  const modal = document.getElementById('preset-selector');
  const header = modal.querySelector('.preset-selector-header h3');
  header.innerHTML = 'Select Presets <span id="multi-preset-count" style="font-size: 12px; color: #666;">(0 selected)</span>';
  
  // Add multi-select controls if not already there
  let multiControls = document.getElementById('multi-preset-controls');
  if (!multiControls) {
    multiControls = document.createElement('div');
    multiControls.id = 'multi-preset-controls';
    multiControls.style.cssText = 'padding: 1vw 8px; background: #000; border-bottom: 1px solid #333; display: flex; gap: 2vw; justify-content: flex-start; align-items: center;';
    multiControls.innerHTML = `
      <button id="multi-preset-apply" class="batch-control-button" style="background: #4CAF50; color: white; height: 8vw; min-height: 32px;">Apply Selected</button>
      <button id="multi-preset-cancel" class="batch-control-button" style="height: 8vw; min-height: 32px;">Cancel</button>
    `;
    
    const presetFilter = document.getElementById('preset-filter');
    const filterRow = presetFilter.closest('.filter-row') || presetFilter.parentNode;
    const presetList = document.getElementById('preset-list');
    filterRow.parentNode.insertBefore(multiControls, filterRow);
  }
  multiControls.style.display = 'flex';

  // Hide layer controls if leftover from a previous session
  const layerControls = document.getElementById('layer-preset-controls');
  if (layerControls) layerControls.style.display = 'none';
  isLayerPresetMode = false;
  layerSelectedPresets = [];
  
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
      item.style.background = 'rgba(76,175,80,0.20)';
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

// Open multi-preset selector from the main camera carousel button
function openCameraMultiPresetSelector() {
  // Disabled when No Magic Mode is on
  if (noMagicMode) {
    if (statusElement) statusElement.textContent = '⚡ NO MAGIC MODE — Multi Preset unavailable';
    setTimeout(() => updatePresetDisplay(), 2000);
    return;
  }
  // Disabled when burst, motion, or random mode is active
  if (isBurstMode || isMotionDetectionMode || isRandomMode) {
    if (statusElement) statusElement.textContent = 'Turn off other modes before using Multi Preset';
    setTimeout(() => updatePresetDisplay(), 2000);
    return;
  }

  // Re-use the gallery preset selector modal
  const modal = document.getElementById('preset-selector');
  const header = modal.querySelector('.preset-selector-header h3');
  header.innerHTML = 'Select Presets (max 20) <span id="multi-preset-count" style="font-size: 12px; color: #aaa;">(0 selected)</span>';

  // Switch to camera-multi mode (not gallery multi mode)
  isMultiPresetMode = true;
  isCameraMultiPresetActive = false; // will be set true on Apply
  selectedPresets = [...cameraSelectedPresets]; // pre-populate with current selections

  // Add multi-select controls
  let multiControls = document.getElementById('multi-preset-controls');
  if (!multiControls) {
    multiControls = document.createElement('div');
    multiControls.id = 'multi-preset-controls';
    multiControls.style.cssText = 'padding: 1vw 8px; background: #000; border-bottom: 1px solid #333; display: flex; gap: 2vw; justify-content: flex-start; align-items: center;';
    multiControls.innerHTML = `
      <button id="multi-preset-apply" class="batch-control-button" style="background: #4CAF50; color: white; height: 8vw; min-height: 32px;">Apply Selected</button>
      <button id="multi-preset-cancel" class="batch-control-button" style="height: 8vw; min-height: 32px;">Cancel</button>
    `;
    const presetFilter = document.getElementById('preset-filter');
    const filterRow = presetFilter.closest('.filter-row') || presetFilter.parentNode;
    const presetList = document.getElementById('preset-list');
    filterRow.parentNode.insertBefore(multiControls, filterRow);
  }
  multiControls.style.display = 'flex';

  // Hide layer controls if leftover from a previous session
  const layerControls = document.getElementById('layer-preset-controls');
  if (layerControls) layerControls.style.display = 'none';
  isLayerPresetMode = false;
  layerSelectedPresets = [];

  populatePresetList();
  updateMultiPresetList();
  modal.style.display = 'flex';
  isPresetSelectorOpen = true;
  currentPresetIndex_Gallery = 0;
  updatePresetSelection();

  // Wire up buttons for camera context
  document.getElementById('multi-preset-apply').onclick = applyCameraMultiPresets;
  document.getElementById('multi-preset-cancel').onclick = cancelCameraMultiPresetSelector;
}

function cancelCameraMultiPresetSelector() {
  isMultiPresetMode = false;
  selectedPresets = [];
  const multiControls = document.getElementById('multi-preset-controls');
  if (multiControls) multiControls.style.display = 'none';
  const header = document.querySelector('.preset-selector-header h3');
  if (header) header.textContent = 'Select Preset';
  hidePresetSelector();
  // Return to camera, no changes
}

function applyCameraMultiPresets() {
  if (selectedPresets.length === 0) {
    alert('Please select at least one preset');
    return;
  }
  if (selectedPresets.length > 20) {
    alert('Maximum 20 presets allowed');
    return;
  }

  cameraSelectedPresets = [...selectedPresets];
  cameraMultiManualSelections = {};
  isCameraMultiPresetActive = true;

  isMultiPresetMode = false;
  selectedPresets = [];
  const multiControls = document.getElementById('multi-preset-controls');
  if (multiControls) multiControls.style.display = 'none';
  const header = document.querySelector('.preset-selector-header h3');
  if (header) header.textContent = 'Select Preset';
  hidePresetSelector();

  // Highlight the carousel button
  const btn = document.getElementById('camera-multi-preset-toggle');
  if (btn) btn.classList.add('camera-multi-active');

  // If manual options is enabled, gather selections for all selected presets now
  if (manualOptionsMode && !noMagicMode) {
    gatherCameraMultiManualSelections(0);
  } else {
    saveCameraMultiPresets();
    updatePresetDisplay();
  }
}

// Collect manual option selections one preset at a time before the photo is taken
async function gatherCameraMultiManualSelections(index) {
  if (index >= cameraSelectedPresets.length) {
    // All gathered - save and update display
    saveCameraMultiPresets();
    updatePresetDisplay();
    return;
  }

  const preset = cameraSelectedPresets[index];
  const options = parsePresetOptions(preset);

  if (options.length > 0) {
    const selectedValue = await showManualOptionsModal(preset, options);
    if (selectedValue !== null) {
      cameraMultiManualSelections[preset.name] = selectedValue;
    }
  }
  gatherCameraMultiManualSelections(index + 1);
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

  // Clear layer mode — user has chosen new multi presets
  clearGalleryLayerState();

  // Save multi state persistently so MAGIC button can reuse it
  galleryMultiPresets          = [...presetsToApply];
  isGalleryMultiActive         = true;
  galleryMultiManualSelections = {};
  window.viewerLoadedPreset    = null;

  const multiHeader = document.getElementById('viewer-preset-header');
  if (multiHeader) multiHeader.textContent = `🎞️ MULTI (${presetsToApply.length})`;

  cancelMultiPresetMode();

  // If Manual Options mode is on, collect selections for each preset one at a time BEFORE feeding
  if (manualOptionsMode && !noMagicMode) {
    for (const preset of presetsToApply) {
      const options = parsePresetOptions(preset);
      if (options.length > 0) {
        const selectedValue = await showManualOptionsModal(preset, options);
        if (selectedValue !== null) {
          galleryMultiManualSelections[preset.name] = selectedValue;
        }
      }
    }
  }

  // ALWAYS queue every preset first — whether online or offline — so
  // nothing gets lost if the connection drops partway through.
  // Same queue the camera screen's Sync button uses.
  const resizedImageBase64 = await resizeImageForSubmission(image.imageBase64);
  for (let i = 0; i < presetsToApply.length; i++) {
    const preset = presetsToApply[i];
    const manualSelection = galleryMultiManualSelections[preset.name] ?? null;
    // Slightly different image encoding per preset so the backend doesn't
    // treat repeated submissions of the same photo as duplicates.
    const variantImage = await reencodeImageVariant(resizedImageBase64, i);
    const queueItem = {
      id: Date.now().toString() + '-gal-mp' + i,
      imageBase64: variantImage,
      preset: preset,
      manualSelection: manualSelection,
      timestamp: Date.now()
    };
    photoQueue.push(queueItem);
  }
  saveQueue();
  updateQueueDisplay();

  if (isOnline) {
    showGallerySubmittingIndicator(`Submitting ${presetsToApply.length} preset${presetsToApply.length > 1 ? 's' : ''}...`, true);
    if (!isSyncing) syncQueuedPhotos();
    waitForSyncToFinish().then(hideGallerySubmittingIndicator);
    alert(`${presetsToApply.length} preset${presetsToApply.length > 1 ? 's' : ''} submitted!`);
  } else {
    showGalleryPresetFlash(`${presetsToApply.length} preset${presetsToApply.length > 1 ? 's' : ''} queued`);
    alert(`You're offline — ${presetsToApply.length} preset${presetsToApply.length > 1 ? 's' : ''} queued. They'll send automatically once you're back online (or tap Sync on the camera screen).`);
  }

  // GALLERY MULTI-PRESET CREDIT GAME — earn credits for each unique imported preset used
  try {
    const imported = presetImporter.getImportedPresets();
    if (imported.length > 0) {
      const importedNames = new Set(imported.map(p => p.name));
      let totalNewCredits = 0;
      for (const preset of presetsToApply) {
        if (preset.name && importedNames.has(preset.name)) {
          if (earnCredit(preset.name)) totalNewCredits++;
        }
      }
      if (totalNewCredits > 0) {
        const creditsEl = document.getElementById('import-credits-display');
        if (creditsEl) creditsEl.textContent = `Credits: ${getCredits()}`;
        setTimeout(() => {
          const newTotal = getCredits();
          showGalleryCreditFlash(`🪙 ${totalNewCredits > 1 ? totalNewCredits + ' Credits' : 'Credit'} Earned!\n(${newTotal} total)`);
        }, 300);
      }
    }
  } catch (e) { /* non-critical */ }

}

function setupViewerPinchZoom() {
  const img = document.getElementById('viewer-image');
  const container = document.querySelector('.image-viewer-container');
  
  let translateX = 0;
  let translateY = 0;
  let startX = 0;
  let startY = 0;
  let isDragging = false;

  // Clamp pan so the image never moves outside the container bounds
  function clampTranslate(tx, ty) {
    const containerW = container.clientWidth;
    const containerH = container.clientHeight;
    const imgW = img.naturalWidth || img.clientWidth;
    const imgH = img.naturalHeight || img.clientHeight;

    // How much the scaled image overflows each side
    // The image is displayed at object-fit:contain so its rendered size fits inside container
    const renderedW = Math.min(containerW, imgW * (containerH / imgH));
    const renderedH = Math.min(containerH, imgH * (containerW / imgW));

    // Max translation: half the overflow in each direction, in unscaled pixels
    const maxX = Math.max(0, (renderedW * viewerZoom - containerW) / 2 / viewerZoom);
    const maxY = Math.max(0, (renderedH * viewerZoom - containerH) / 2 / viewerZoom);

    return {
      x: Math.max(-maxX, Math.min(maxX, tx)),
      y: Math.max(-maxY, Math.min(maxY, ty))
    };
  }

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

      // Re-clamp translation at the new zoom level
      const clamped = clampTranslate(translateX, translateY);
      translateX = clamped.x;
      translateY = clamped.y;

      img.style.transform = `scale(${viewerZoom}) translate(${translateX}px, ${translateY}px)`;
    } else if (isDragging && e.touches.length === 1 && viewerZoom > 1) {
      e.preventDefault();
      const rawX = e.touches[0].clientX - startX;
      const rawY = e.touches[0].clientY - startY;

      const clamped = clampTranslate(rawX, rawY);
      translateX = clamped.x;
      translateY = clamped.y;

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

// ===== VIEWER SWIPE NAVIGATION =====
// Swipe UP on the photo = next image, swipe DOWN = previous image.
// Cycling stays inside the group being viewed: photos inside a folder cycle
// only within that folder; photos at the root cycle only through root photos.
// The list follows the same order (and any active date filter) as the gallery
// grid, and wraps around at the ends. Reuses openImageViewer, so everything
// that normally happens when opening an image happens here too.

function viewerSwipeNavigate(direction) {
  // direction: +1 = next, -1 = previous
  if (currentViewerImageIndex < 0 || currentViewerImageIndex >= galleryImages.length) return;
  if (window.isCombinedMode) return; // temp combined preview isn't part of a browsable group
  const currentItem = galleryImages[currentViewerImageIndex];

  // Same images the gallery grid shows for this view (root vs folder),
  // honoring the active date filter...
  const viewImages = getImagesInCurrentView().filter(img => {
    if (!galleryStartDate && !galleryEndDate) return true;
    const d = new Date(img.timestamp);
    d.setHours(0, 0, 0, 0);
    const t = d.getTime();
    if (galleryStartDate && t < new Date(galleryStartDate + 'T00:00:00').getTime()) return false;
    if (galleryEndDate && t > new Date(galleryEndDate + 'T00:00:00').getTime()) return false;
    return true;
  });
  // ...in the same order the grid displays them
  const ordered = gallerySortOrder === 'oldest'
    ? [...viewImages].sort((a, b) => a.timestamp - b.timestamp)
    : [...viewImages].sort((a, b) => b.timestamp - a.timestamp);

  if (ordered.length < 2) return; // nothing else to cycle to

  const pos = ordered.findIndex(img => img.id === currentItem.id);
  if (pos === -1) return; // open image isn't part of this view's list

  const nextPos = (pos + direction + ordered.length) % ordered.length; // wraps at the ends
  const targetIndex = galleryImages.findIndex(img => img.id === ordered[nextPos].id);
  if (targetIndex === -1) return;

  openImageViewer(targetIndex);
}

function setupViewerSwipeNavigation() {
  const container = document.querySelector('.image-viewer-container');
  if (!container) return;

  let swipeStartX = 0;
  let swipeStartY = 0;
  let swipeValid = false;

  container.addEventListener('touchstart', (e) => {
    // Only a single finger on an UNZOOMED photo can begin a swipe.
    // Two fingers = pinch zoom, one finger while zoomed in = pan — both are
    // handled by setupViewerPinchZoom and are left completely alone here.
    if (e.touches.length === 1 && viewerZoom === 1) {
      swipeStartX = e.touches[0].clientX;
      swipeStartY = e.touches[0].clientY;
      swipeValid = true;
    } else {
      swipeValid = false;
    }
  }, { passive: true });

  container.addEventListener('touchmove', (e) => {
    if (e.touches.length > 1) swipeValid = false; // a pinch began mid-gesture
  }, { passive: true });

  container.addEventListener('touchend', (e) => {
    if (e.touches.length > 0) return;      // wait until the last finger lifts
    if (!swipeValid) return;
    swipeValid = false;
    if (viewerZoom !== 1) return;

    const t = e.changedTouches && e.changedTouches[0];
    if (!t) return;
    const dx = t.clientX - swipeStartX;
    const dy = t.clientY - swipeStartY;

    // A deliberate, mostly-vertical swipe: at least 50px of travel and
    // clearly more vertical than horizontal. Plain taps stay well below
    // this, so tap behaviors (like toggling the side buttons) are unaffected.
    if (Math.abs(dy) >= 50 && Math.abs(dy) > Math.abs(dx) * 1.5) {
      // Keep this swipe from ALSO counting as a tap on the viewer backdrop
      // (which would flip the side-button carousels in single-tap mode).
      e.stopPropagation();
      viewerSwipeNavigate(dy < 0 ? 1 : -1); // up = next, down = previous
    }
  }, { passive: true });

  container.addEventListener('touchcancel', () => { swipeValid = false; }, { passive: true });
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

    if (currentMenuIndex === 0) {
      const scrollContainer = document.querySelector('.styles-menu-scroll-container');
      if (scrollContainer) scrollContainer.scrollTop = 0;
    } else {
      currentItem.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
    
    // Show category hint with individually clickable categories
    const presetIndex = parseInt(currentItem.dataset.index);
    const preset = CAMERA_PRESETS[presetIndex];
    const categoryHint = document.getElementById('menu-category-hint');
    if (categoryHint && preset && preset.category && !isStyleFilterFocused) {
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
async function loadStyles() {
    // Initialize IndexedDB storage — run both at the same time instead of one after the other
    await Promise.all([presetStorage.init(), presetImporter.init()]);
    
    // Load imported presets and modifications at the same time instead of one after the other
    const [importedPresets, modifications] = await Promise.all([
        presetImporter.loadImportedPresets(),
        presetStorage.getAllModifications()
    ]);
    const hasImports = importedPresets.length > 0;
    const hasModifications = modifications.length > 0;
    
    // Always fetch the real preset count so the tutorial display is always correct
    // Save the result so we can reuse it later without downloading the file again
    let _cachedFactoryPresets = null;
    try {
        showLoadingOverlay('Loading presets...');
        // Wait one frame so the browser actually paints the spinner before the heavy work starts
        await new Promise(resolve => setTimeout(resolve, 30));
        _cachedFactoryPresets = await presetImporter.loadPresetsFromFile();
        totalFactoryPresetCount = _cachedFactoryPresets.length;
        const tutorialCountEl = document.getElementById('tutorial-preset-count');
        if (tutorialCountEl) tutorialCountEl.textContent = totalFactoryPresetCount;
    } catch (e) {
        console.log('Could not fetch preset count:', e);
    } finally {
        hideLoadingOverlay();
    }

    // Only load presets if user has imports or modifications
    if (hasImports || hasModifications) {
        // Merge factory presets with user modifications
        CAMERA_PRESETS = await mergePresetsWithStorage();
        _stylesDataVersion++;
    } else {
        // First time user - don't load anything yet
        CAMERA_PRESETS = [];
        _stylesDataVersion++;
        
        // Show a message that they need to import presets
        setTimeout(async () => {
            const shouldImport = await confirm('Welcome! You should import a preset to get started. Would you like to import now?');
            if (shouldImport) {
                // Initialize the camera first so the user can exit the menu normally after importing
                document.getElementById('start-screen').style.display = 'none';
                await initCamera();
                // Now open the menu straight to the import screen
                document.getElementById('menu-button').click();
                setTimeout(() => {
                    document.getElementById('settings-menu-button').click();
                    setTimeout(() => {
                        document.getElementById('import-presets-button').click();
                    }, 100);
                }, 100);
            }
        }, 500);
    
        // Still load old localStorage custom presets for migration
        const storedStyles = localStorage.getItem(STORAGE_KEY);
        if (storedStyles) {
            try {
                const loadedStyles = JSON.parse(storedStyles);
                
                // Only add custom presets (those with internal: false)
                const customPresets = loadedStyles.filter(p => p.internal === false);
                
                // Migrate old custom presets to new storage
                for (const preset of customPresets) {
                    await presetStorage.saveNewPreset(preset);
                    if (!CAMERA_PRESETS.find(p => p.name === preset.name)) {
                        CAMERA_PRESETS.push(preset);
                    }
                }
                
                // Clear old storage after migration
                localStorage.removeItem(STORAGE_KEY);
            } catch (e) {
                console.error("Error loading styles:", e);
            }
        }
    }

    // Load favorites — runs for all users every startup
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
    _favoriteStylesSet = new Set(favoriteStyles);
    
    loadLastUsedStyle(); 
    
    loadResolution();
    // loadWhiteBalanceSettings();
    
    // Load visible presets — runs for all users every startup
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
    
    // Clean up visible presets - remove any preset names that no longer exist in CAMERA_PRESETS
    const validPresetNames = new Set(CAMERA_PRESETS.map(p => p.name));
    const originalLength = visiblePresets.length;
    visiblePresets = visiblePresets.filter(name => validPresetNames.has(name));
    _visiblePresetsSet = new Set(visiblePresets);
    
    // If we removed any invalid names, save the cleaned list
    if (originalLength !== visiblePresets.length) {
        saveVisiblePresets();
    }
    
    // If no visible presets saved, show all by default
    if (visiblePresets.length === 0 && CAMERA_PRESETS.length > 0) {
        visiblePresets = CAMERA_PRESETS.map(p => p.name);
        saveVisiblePresets();
    }
    
    // Update the display to show correct count on startup
    updateVisiblePresetsDisplay();

    // Check for updates immediately — store as a promise the camera can wait for
    window._presetsUpdateCheckPromise = checkForPresetsUpdates(_cachedFactoryPresets);
}

// Check for updates on startup

async function checkForPresetsUpdates(preloadedPresets) {
  try {
    const jsonPresets = preloadedPresets || await presetImporter.loadPresetsFromFile();
    const importedPresets = presetImporter.getImportedPresets();

    if (importedPresets.length === 0) return;

    let newCount = 0;
    let updatedCount = 0;
    const importedNames = new Set(importedPresets.map(p => p.name));

    for (const jsonPreset of jsonPresets) {
      const existing = importedPresets.find(p => p.name === jsonPreset.name);
      if (!existing) {
        newCount++;
      } else if (presetsAreDifferent(existing, jsonPreset)) {
        updatedCount++;
      }
    }

    if (newCount > 0 || updatedCount > 0) {
      window.hasPresetsUpdates = true;
      const hintEl = document.getElementById('import-presets-hint');
      if (hintEl) {
        const parts = [];
        if (newCount > 0) parts.push(`${newCount} new`);
        if (updatedCount > 0) parts.push(`${updatedCount} updated`);
        hintEl.textContent = `🔴 ${parts.join(' and ')} preset${(newCount + updatedCount) !== 1 ? 's' : ''} available`;
        hintEl.style.color = '#FF5722';
        hintEl.style.fontWeight = 'bold';
      }
    }
  } catch (error) {
    console.log('Could not check for updates:', error);
  }
}

// Re-checks presets.json against currently imported presets and updates
// the settings button indicator to accurately reflect remaining updates.

async function recheckForUpdates() {
  try {
    const jsonPresets = await presetImporter.loadPresetsFromFile();
    const importedPresets = presetImporter.getImportedPresets();

    let newCount = 0;
    let updatedCount = 0;
    const importedNames = new Set(importedPresets.map(p => p.name));

    for (const jsonPreset of jsonPresets) {
      const existing = importedPresets.find(p => p.name === jsonPreset.name);
      if (!existing) {
        newCount++;
      } else if (presetsAreDifferent(existing, jsonPreset)) {
        updatedCount++;
      }
    }

    const stillHasUpdates = newCount > 0 || updatedCount > 0;
    window.hasPresetsUpdates = stillHasUpdates;

    const hintEl = document.getElementById('import-presets-hint');
    if (hintEl) {
      if (stillHasUpdates) {
        const parts = [];
        if (newCount > 0) parts.push(`${newCount} new`);
        if (updatedCount > 0) parts.push(`${updatedCount} updated`);
        hintEl.textContent = `🔴 ${parts.join(' and ')} preset${(newCount + updatedCount) !== 1 ? 's' : ''} available`;
        hintEl.style.color = '#FF5722';
        hintEl.style.fontWeight = 'bold';
      } else {
        hintEl.textContent = 'Load from our Library';
        hintEl.style.color = '';
        hintEl.style.fontWeight = '';
      }
    }
  } catch (error) {
    console.log('Could not recheck for updates:', error);
  }
}

// Update master prompt indicator visibility
function updateMasterPromptIndicator() {
  const mpIndicator = document.getElementById('master-prompt-indicator');
  const startScreen = document.getElementById('start-screen');
  if (mpIndicator) {
    // Only show if master prompt enabled AND start screen is gone
    mpIndicator.style.display = (masterPromptEnabled && !startScreen) ? 'block' : 'none';
  }
}

async function mergePresetsWithStorage() {
  const modifications = await presetStorage.getAllModifications();
  const deletedNames = new Set();
  const modifiedData = new Map();
  const newPresets = [];

  // Process all stored modifications
  for (const record of modifications) {
    if (record.type === 'deletion') {
      deletedNames.add(record.name);
    } else if (record.type === 'modification') {
      modifiedData.set(record.name, record.data);
    } else if (record.type === 'new') {
      newPresets.push(record.data);
    }
  }

  // Check if user has imported presets
  const importedPresets = await presetImporter.loadImportedPresets();
  hasImportedPresets = importedPresets.length > 0;
  
  let basePresets;
  
  if (hasImportedPresets) {
    // Use imported presets
    basePresets = importedPresets;
  } else {
    // First time user - load factory presets only now
    if (factoryPresets.length === 0) {
      try {
        DEFAULT_PRESETS = await presetImporter.loadPresetsFromFile();
        factoryPresets = [...DEFAULT_PRESETS];
        totalFactoryPresetCount = DEFAULT_PRESETS.length;
        const tutorialCountEl = document.getElementById('tutorial-preset-count');
        if (tutorialCountEl) tutorialCountEl.textContent = totalFactoryPresetCount;
      } catch (e) {
        DEFAULT_PRESETS = [];
        factoryPresets = [];
      }
    }
    basePresets = factoryPresets;
  }

  // Apply modifications and filter deletions
  const mergedPresets = basePresets
    .filter(preset => !deletedNames.has(preset.name))
    .map(preset => {
      if (modifiedData.has(preset.name)) {
        return { ...preset, ...modifiedData.get(preset.name) };
      }
      return { ...preset };
    });

  // Add new user-created presets
  return [...mergedPresets, ...newPresets];
}

// Save visible presets to localStorage
function saveVisiblePresets() {
    _visiblePresetsSet = new Set(visiblePresets);
    _stylesDataVersion++;
    try {
        localStorage.setItem(VISIBLE_PRESETS_KEY, JSON.stringify(visiblePresets));
    } catch (err) {
        console.error('Error saving visible presets:', err);
    }
}

// Get only visible presets
function getVisiblePresets() {
    return CAMERA_PRESETS.filter(preset => _visiblePresetsSet.has(preset.name));
}

// Save resolution setting
function saveResolution(index) {
  try {
    localStorage.setItem(RESOLUTION_STORAGE_KEY, index.toString());
  } catch (err) {
    console.error('Error saving resolution:', err);
  }
}

// ========== WHITE BALANCE FUNCTIONS - COMMENTED OUT ==========
// // Load white balance settings
// function loadWhiteBalanceSettings() {
//   const saved = localStorage.getItem(WHITE_BALANCE_STORAGE_KEY);
//   if (saved !== null) {
//     currentWhiteBalanceIndex = parseInt(saved);
//   }
// }

// // Save white balance settings
// function saveWhiteBalanceSettings() {
//   localStorage.setItem(WHITE_BALANCE_STORAGE_KEY, currentWhiteBalanceIndex.toString());
// }

// // Apply white balance filter
// function applyWhiteBalance() {
//   if (!video) return;
//   
//   // Small delay to ensure video is ready
//   setTimeout(() => {
//     const mode = WHITE_BALANCE_MODES[currentWhiteBalanceIndex];
//     
//     // Remove existing filter
//     video.style.filter = '';
//     
//     // Apply CSS filter based on mode
//     switch(mode.value) {
//       case 'daylight':
//         video.style.filter = 'brightness(1.05) saturate(1.1)';
//         break;
//       case 'cloudy':
//         video.style.filter = 'brightness(1.1) saturate(0.95) sepia(0.05)';
//         break;
//       case 'tungsten':
//         video.style.filter = 'brightness(0.95) saturate(1.15) hue-rotate(-10deg)';
//         break;
//       case 'fluorescent':
//         video.style.filter = 'brightness(1.02) saturate(1.05) hue-rotate(5deg)';
//         break;
//       case 'candlelight':
//         video.style.filter = 'brightness(0.85) saturate(1.3) sepia(0.15) hue-rotate(-15deg)';
//         break;
//       case 'moonlight':
//         video.style.filter = 'brightness(0.7) saturate(0.8) hue-rotate(15deg) contrast(1.1)';
//         break;
//       case 'auto':
//       default:
//         video.style.filter = '';
//         break;
//     }
//   }, 50);
// }

// function applyWhiteBalanceToCanvas(ctx, width, height) {
//   const mode = WHITE_BALANCE_MODES[currentWhiteBalanceIndex];
//   
//   if (mode.value === 'auto') {
//     return; // No adjustment needed
//   }
//   
//   // Get image data
//   const imageData = ctx.getImageData(0, 0, width, height);
//   const data = imageData.data;
//   
//   // Define adjustments for each mode
//   let brightness = 1.0;
//   let saturation = 1.0;
//   let warmth = 0; // Positive = warmer (red/yellow), Negative = cooler (blue)
//   let contrast = 1.0;
//   
//   switch(mode.value) {
//     case 'daylight':
//       brightness = 1.05;
//       saturation = 1.1;
//       warmth = 5;
//       break;
//     case 'cloudy':
//       brightness = 1.1;
//       saturation = 0.95;
//       warmth = 10;
//       break;
//     case 'tungsten':
//       brightness = 0.95;
//       saturation = 1.15;
//       warmth = -20;
//       break;
//     case 'fluorescent':
//       brightness = 1.02;
//       saturation = 1.05;
//       warmth = -10;
//       break;
//     case 'candlelight':
//       brightness = 0.85;
//       saturation = 1.3;
//       warmth = 25;
//       contrast = 0.95;
//       break;
//     case 'moonlight':
//       brightness = 0.7;
//       saturation = 0.8;
//       warmth = -15;
//       contrast = 1.1;
//       break;
//   }
//   
//   // Apply adjustments to each pixel
//   for (let i = 0; i < data.length; i += 4) {
//     let r = data[i];
//     let g = data[i + 1];
//     let b = data[i + 2];
//     
//     // Apply warmth (shift towards red/yellow or blue)
//     if (warmth > 0) {
//       r = Math.min(255, r + warmth);
//       g = Math.min(255, g + warmth * 0.5);
//     } else if (warmth < 0) {
//       b = Math.min(255, b - warmth);
//     }
//     
//     // Apply brightness
//     r *= brightness;
//     g *= brightness;
//     b *= brightness;
//     
//     // Apply saturation
//     const gray = 0.2989 * r + 0.5870 * g + 0.1140 * b;
//     r = gray + saturation * (r - gray);
//     g = gray + saturation * (g - gray);
//     b = gray + saturation * (b - gray);
//     
//     // Apply contrast
//     r = ((r / 255 - 0.5) * contrast + 0.5) * 255;
//     g = ((g / 255 - 0.5) * contrast + 0.5) * 255;
//     b = ((b / 255 - 0.5) * contrast + 0.5) * 255;
//     
//     // Clamp values
//     data[i] = Math.max(0, Math.min(255, r));
//     data[i + 1] = Math.max(0, Math.min(255, g));
//     data[i + 2] = Math.max(0, Math.min(255, b));
//   }
//   
//   // Put modified image data back
//   ctx.putImageData(imageData, 0, 0);
// }

// function showWhiteBalanceSubmenu() {
//   document.getElementById('settings-submenu').style.display = 'none';
//   
//   const submenu = document.getElementById('white-balance-submenu');
//   const list = document.getElementById('white-balance-list');
//   list.innerHTML = '';
//   
//   WHITE_BALANCE_MODES.forEach((mode, index) => {
//     const item = document.createElement('div');
//     item.className = 'resolution-item';
//     if (index === currentWhiteBalanceIndex) {
//       item.classList.add('active');
//     }
//     
//     const name = document.createElement('span');
//     name.className = 'resolution-name';
//     name.textContent = mode.name;
//     
//     item.appendChild(name);
//     
//     item.onclick = () => {
//       currentWhiteBalanceIndex = index;
//       saveWhiteBalanceSettings();
//       document.getElementById('current-white-balance-display').textContent = mode.name;
//       if (stream) {
//         applyWhiteBalance();
//       }
//       hideWhiteBalanceSubmenu();
//     };
//     
//     list.appendChild(item);
//   });
//   
//   submenu.style.display = 'flex';
// }

// function hideWhiteBalanceSubmenu() {
//   document.getElementById('white-balance-submenu').style.display = 'none';
//   document.getElementById('settings-submenu').style.display = 'flex';
// }
// ========== END WHITE BALANCE FUNCTIONS ==========

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
    if (_stylesListCache && _stylesListCacheVersion === _stylesDataVersion) {
        return _stylesListCache;
    }
    const presets = CAMERA_PRESETS.filter(p => _visiblePresetsSet.has(p.name));
    const sortedAll = presets.slice().sort((a, b) => a.name.localeCompare(b.name));
    const favorites = sortedAll.filter(p => isFavoriteStyle(p.name));
    const regular = sortedAll.filter(p => !isFavoriteStyle(p.name));
    _stylesListCache = { favorites, regular };
    _stylesListCacheVersion = _stylesDataVersion;
    return _stylesListCache;
}

function getSortedPresets() {
    const { favorites, regular } = getStylesLists();
    // getStylesLists already filters to visible presets — just combine them
    return [...favorites, ...regular];
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
  // LEGACY FUNCTION - kept for backward compatibility during migration period
  // New presets are saved to IndexedDB via presetStorage.saveNewPreset()
  // This function only exists to support old localStorage-based presets
  // and can be removed in a future version after migration period
  try {
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
            returnToMainMenuFromBuilder = true;
            hideUnifiedMenu();
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
        _favoriteStylesSet.delete(styleName);
    } else {
        favoriteStyles.push(styleName);
        _favoriteStylesSet.add(styleName);
    }

    _stylesDataVersion++;
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
    return _favoriteStylesSet.has(styleName);
}

// Get random preset index from favorites (or all presets if no favorites)
function getRandomPresetIndex() {
  // Get visible presets using the same logic as scroll wheel
  const sortedPresets = getSortedPresets();
  
  if (sortedPresets.length === 0) return 0;
  
  // Filter to only favorites if they exist
  const favoritedVisible = sortedPresets.filter(p => isFavoriteStyle(p.name));
  
  if (favoritedVisible.length > 0) {
    const randomPreset = favoritedVisible[Math.floor(Math.random() * favoritedVisible.length)];
    return CAMERA_PRESETS.findIndex(p => p === randomPreset);
  }
  
  // Otherwise pick from all visible presets
  const randomPreset = sortedPresets[Math.floor(Math.random() * sortedPresets.length)];
  return CAMERA_PRESETS.findIndex(p => p === randomPreset);
}

function toggleMotionDetection() {
  if (window.isCameraLiveCombineMode) {
    alert('Turn off Combine mode before enabling Motion Detection.');
    return;
  }
  isMotionDetectionMode = !isMotionDetectionMode;
  const btn = document.getElementById('motion-toggle');
  
  if (isMotionDetectionMode) {
    btn.classList.add('active');
    btn.title = 'Motion Detection: ON';
    statusElement.textContent = noMagicMode 
      ? `⚡ NO MAGIC MODE • 👁️ Motion Detection`
      : `Motion Detection mode ON • ${CAMERA_PRESETS[currentPresetIndex].name}`;
    showStyleReveal('👁️ Motion Detection');
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
    
    // Show current preset when motion detection is turned off
    if (CAMERA_PRESETS && CAMERA_PRESETS[currentPresetIndex]) {
      statusElement.textContent = noMagicMode
        ? `⚡ NO MAGIC MODE`
        : `Style: ${CAMERA_PRESETS[currentPresetIndex].name}`;
      showStyleReveal(CAMERA_PRESETS[currentPresetIndex].name);
    }
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

// Called when user taps the viewer prompt text area
function handleViewerPromptTap() {
  const hasLoadedPreset = !!window.viewerLoadedPreset;

// Clear saved gallery multi state — user is editing a prompt instead
  clearGalleryMultiState();
  
  if (!hasLoadedPreset) {
    // No preset loaded: open Preset Builder to create a new one
    returnToGalleryFromViewerEdit = true;
    // Close the image viewer and gallery modal so builder has full screen
    document.getElementById('image-viewer').style.display = 'none';
    document.getElementById('gallery-modal').style.display = 'none';
    // Close main menu if open
    document.getElementById('unified-menu').style.display = 'none';
    isMenuOpen = false;
    // Open settings submenu first (needed as parent context), then go to builder
    document.getElementById('settings-submenu').style.display = 'flex';
    isSettingsSubmenuOpen = true;
    // Open preset builder
    document.getElementById('settings-submenu').style.display = 'none';
    document.getElementById('preset-builder-submenu').style.display = 'flex';
    isSettingsSubmenuOpen = false;
    isPresetBuilderSubmenuOpen = true;
    clearPresetBuilderForm();
  } else {
    // A preset is loaded — use internal flag to determine editor (same logic as main menu)
    const loadedPreset = window.viewerLoadedPreset;
    // Find the current version of this preset in CAMERA_PRESETS
    const presetIndex = CAMERA_PRESETS.findIndex(p => p.name === loadedPreset.name);
    const currentPresetObj = presetIndex >= 0 ? CAMERA_PRESETS[presetIndex] : loadedPreset;
    const isCustomPreset = (currentPresetObj.internal === false);

    returnToGalleryFromViewerEdit = true;
    document.getElementById('image-viewer').style.display = 'none';
    document.getElementById('gallery-modal').style.display = 'none';
    document.getElementById('unified-menu').style.display = 'none';
    isMenuOpen = false;

    if (isCustomPreset) {
      // Custom preset (internal: false): open Preset Builder in edit mode
      if (presetIndex >= 0) {
        editPresetInBuilder(presetIndex);
      } else {
        // Preset not found by name — clear form for new entry
        document.getElementById('preset-builder-submenu').style.display = 'flex';
        isSettingsSubmenuOpen = false;
        isPresetBuilderSubmenuOpen = true;
        clearPresetBuilderForm();
      }
    } else {
      // Factory/imported preset: open Style Editor in edit mode
      if (presetIndex >= 0) {
        editStyle(presetIndex);
        showStyleEditor('Edit Style');
      }
    }
  }
}

// ===== RESTORE DELETED ITEMS SUBMENU =====

function showRestoreSubmenu() {
  document.getElementById('settings-submenu').style.display = 'none';
  isSettingsSubmenuOpen = false;
  document.getElementById('restore-deleted-submenu').style.display = 'flex';
  isRestoreSubmenuOpen = true;
  restoreActiveTab = 'presets';
  currentRestoreIndex = 0;
  switchRestoreTab('presets');
}

function hideRestoreSubmenu() {
  document.getElementById('restore-deleted-submenu').style.display = 'none';
  isRestoreSubmenuOpen = false;
  showSettingsSubmenu();
}

function switchRestoreTab(tab) {
  restoreActiveTab = tab;
  currentRestoreIndex = 0;
  document.getElementById('restore-tab-presets').classList.toggle('active', tab === 'presets');
  document.getElementById('restore-tab-images').classList.toggle('active', tab === 'images');
  document.getElementById('restore-tab-mp').classList.toggle('active', tab === 'mp');
  document.getElementById('restore-panel-presets').style.display = tab === 'presets' ? 'block' : 'none';
  document.getElementById('restore-panel-images').style.display  = tab === 'images'  ? 'block' : 'none';
  document.getElementById('restore-panel-mp').style.display      = tab === 'mp'      ? 'block' : 'none';
  if (tab === 'presets') {
    populateDeletedPresetsList();
    setTimeout(updateRestoreSelection, 50);
  } else if (tab === 'images') {
    populateDeletedImagesList().then(function() {
      setTimeout(updateRestoreSelection, 50);
    });
  } else {
    populateDeletedMpList();
    setTimeout(updateRestoreSelection, 50);
  }
}

function populateDeletedPresetsList() {
  var list = document.getElementById('restore-presets-list');
  if (!list) return;
  var deleted = getDeletedPresets();
  list.innerHTML = '';
  if (deleted.length === 0) {
    list.innerHTML = '<div style="padding:4vw;color:#666;font-size:3.5vw;text-align:center;">No deleted presets</div>';
    return;
  }
  deleted.sort(function(a, b) { return b.deletedAt - a.deletedAt; });
  deleted.forEach(function(preset) {
    var item = document.createElement('label');
    item.className = 'restore-preset-item';
    item.style.cssText = 'display:flex;align-items:center;padding:3vw 2vw;border-bottom:1px solid #222;gap:3vw;cursor:pointer;transition:background 0.1s;';
    var cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.dataset.name = preset.name;
    cb.style.cssText = 'width:5vw;height:5vw;min-width:22px;min-height:22px;accent-color:#FE5F00;flex-shrink:0;cursor:pointer;';
    var nameSpan = document.createElement('span');
    nameSpan.textContent = preset.name;
    nameSpan.style.cssText = 'font-size:4vw;color:#fff;flex:1;word-break:break-word;';
    item.appendChild(cb);
    item.appendChild(nameSpan);
    list.appendChild(item);
  });
}

async function populateDeletedImagesList() {
  var grid = document.getElementById('restore-images-grid');
  if (!grid) return;
  grid.innerHTML = '<div style="grid-column:1/-1;padding:4vw;color:#888;font-size:3.5vw;text-align:center;">Loading...</div>';
  var deleted = await getDeletedImages();
  grid.innerHTML = '';
  if (deleted.length === 0) {
    grid.innerHTML = '<div style="grid-column:1/-1;padding:4vw;color:#666;font-size:3.5vw;text-align:center;">No deleted images</div>';
    return;
  }
  deleted.sort(function(a, b) { return b.deletedAt - a.deletedAt; });
  deleted.forEach(function(img) {
    var cell = document.createElement('div');
    cell.className = 'restore-image-item';
    cell.style.cssText = 'position:relative;padding-bottom:100%;background:#222;border-radius:2vw;overflow:hidden;';
    var imgEl = document.createElement('img');
    imgEl.src = img.imageBase64;
    imgEl.loading = 'lazy';
    imgEl.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;pointer-events:none;';
    var cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.dataset.id = img.id;
    cb.style.cssText = 'position:absolute;top:5px;left:5px;width:5vw;height:5vw;min-width:20px;min-height:20px;accent-color:#FE5F00;z-index:2;cursor:pointer;';
    cell.appendChild(imgEl);
    cell.appendChild(cb);
    grid.appendChild(cell);
  });
}

function getRestoreItems() {
  if (restoreActiveTab === 'presets') {
    return Array.from(document.querySelectorAll('#restore-presets-list .restore-preset-item'));
  } else if (restoreActiveTab === 'images') {
    return Array.from(document.querySelectorAll('#restore-images-grid .restore-image-item'));
  } else {
    return Array.from(document.querySelectorAll('#restore-mp-list .restore-preset-item'));
  }
}

function updateRestoreSelection() {
  var items = getRestoreItems();
  // Remove highlight from all items
  items.forEach(function(item) {
    item.style.outline = '';
    item.style.outlineOffset = '';
    item.style.background = '';
  });
  if (items.length === 0) return;
  currentRestoreIndex = Math.max(0, Math.min(currentRestoreIndex, items.length - 1));
  var current = items[currentRestoreIndex];
  if (current) {
    current.style.outline = '3px solid #FE5F00';
    current.style.outlineOffset = '-2px';
    if (restoreActiveTab === 'presets') {
      current.style.background = 'rgba(254,95,0,0.12)';
    }
    current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function scrollRestoreUp() {
  if (!isRestoreSubmenuOpen) return;
  var items = getRestoreItems();
  if (items.length === 0) return;
  currentRestoreIndex = Math.max(0, currentRestoreIndex - 1);
  updateRestoreSelection();
}

function scrollRestoreDown() {
  if (!isRestoreSubmenuOpen) return;
  var items = getRestoreItems();
  if (items.length === 0) return;
  currentRestoreIndex = Math.min(items.length - 1, currentRestoreIndex + 1);
  updateRestoreSelection();
}

function restoreSelectAll() {
  var items = getRestoreItems();
  if (items.length === 0) return;
  var allChecked = items.every(function(item) {
    var cb = item.querySelector('input[type="checkbox"]');
    return cb && cb.checked;
  });
  items.forEach(function(item) {
    var cb = item.querySelector('input[type="checkbox"]');
    if (cb) cb.checked = !allChecked;
  });
}

async function restoreSelected() {
  if (restoreActiveTab === 'presets') {
    var list = document.getElementById('restore-presets-list');
    var checked = Array.from(list.querySelectorAll('input[type="checkbox"]:checked'));
    if (checked.length === 0) { await customAlert('No presets selected.'); return; }
    if (!await customConfirm('Restore ' + checked.length + ' preset(s) back to your preset list?')) return;
    var allDeleted = getDeletedPresets();
    for (var i = 0; i < checked.length; i++) {
      var name = checked[i].dataset.name;
      var preset = allDeleted.find(function(p) { return p.name === name; });
      if (!preset) continue;
      var cleanPreset = Object.assign({}, preset);
      delete cleanPreset.deletedAt;
      await presetStorage.saveNewPreset(cleanPreset);
      if (!CAMERA_PRESETS.some(function(p) { return p.name === name; })) {
        CAMERA_PRESETS.push(cleanPreset);
      }
      if (!visiblePresets.includes(name)) {
        visiblePresets.push(name);
        _visiblePresetsSet.add(name);
      }
      removeFromPresetTrash(name);
    }
    saveVisiblePresets();
    saveStyles();
    _stylesDataVersion++;
    populateDeletedPresetsList();
    setTimeout(updateRestoreSelection, 50);
    await customAlert('Preset(s) restored successfully!');
  } else if (restoreActiveTab === 'images') {
    var grid = document.getElementById('restore-images-grid');
    var checked = Array.from(grid.querySelectorAll('input[type="checkbox"]:checked'));
    if (checked.length === 0) { await customAlert('No images selected.'); return; }
    if (!await customConfirm('Restore ' + checked.length + ' image(s) back to the gallery?')) return;
    for (var j = 0; j < checked.length; j++) {
      await restoreImageFromTrash(checked[j].dataset.id);
    }
    await populateDeletedImagesList();
    setTimeout(updateRestoreSelection, 50);
    await customAlert('Image(s) restored successfully!');
  } else {
    var mpList = document.getElementById('restore-mp-list');
    var checked = Array.from(mpList.querySelectorAll('input[type="checkbox"]:checked'));
    if (checked.length === 0) { await customAlert('No master prompts selected.'); return; }
    if (!await customConfirm('Restore ' + checked.length + ' master prompt(s)?')) return;
    var trash = getMpTrash();
    checked.forEach(cb => {
      var slot = trash.find(s => s.id === cb.dataset.id);
      if (!slot) return;
      var restored = Object.assign({}, slot);
      delete restored.deletedAt;
      masterPromptSlots.push(restored);
      removeFromMpTrash(slot.id);
    });
    saveMasterPrompt();
    updateMasterPromptDisplay();
    populateDeletedMpList();
    setTimeout(updateRestoreSelection, 50);
    await customAlert('Master prompt(s) restored successfully!');
  }
}

async function permanentlyDeleteSelected() {
  if (restoreActiveTab === 'presets') {
    var list = document.getElementById('restore-presets-list');
    var checked = Array.from(list.querySelectorAll('input[type="checkbox"]:checked'));
    if (checked.length === 0) { await customAlert('No presets selected.'); return; }
    if (!await customConfirm('Permanently delete ' + checked.length + ' preset(s)? This cannot be undone.', { danger: true, yesText: 'Delete', noText: 'Cancel' })) return;
    checked.forEach(function(cb) { removeFromPresetTrash(cb.dataset.name); });
    populateDeletedPresetsList();
    setTimeout(updateRestoreSelection, 50);
    await customAlert('Preset(s) permanently deleted.');
  } else if (restoreActiveTab === 'images') {
    var grid = document.getElementById('restore-images-grid');
    var checked = Array.from(grid.querySelectorAll('input[type="checkbox"]:checked'));
    if (checked.length === 0) { await customAlert('No images selected.'); return; }
    if (!await customConfirm('Permanently delete ' + checked.length + ' image(s)? This cannot be undone.', { danger: true, yesText: 'Delete', noText: 'Cancel' })) return;
    for (var k = 0; k < checked.length; k++) {
      await permanentlyDeleteImageFromTrash(checked[k].dataset.id);
    }
    await populateDeletedImagesList();
    setTimeout(updateRestoreSelection, 50);
    await customAlert('Image(s) permanently deleted.');
  } else {
    var mpList = document.getElementById('restore-mp-list');
    var checked = Array.from(mpList.querySelectorAll('input[type="checkbox"]:checked'));
    if (checked.length === 0) { await customAlert('No master prompts selected.'); return; }
    if (!await customConfirm('Permanently delete ' + checked.length + ' master prompt(s)? This cannot be undone.', { danger: true, yesText: 'Delete', noText: 'Cancel' })) return;
    checked.forEach(cb => removeFromMpTrash(cb.dataset.id));
    populateDeletedMpList();
    setTimeout(updateRestoreSelection, 50);
    await customAlert('Master prompt(s) permanently deleted.');
  }
}

// ===== END RESTORE DELETED ITEMS SUBMENU =====

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
  const savedBuilderIndex = editingPresetBuilderIndex;
  editingPresetBuilderIndex = -1;
  
  // Hide delete button when closing
  const deleteButton = document.getElementById('preset-builder-delete');
  if (deleteButton) deleteButton.style.display = 'none';
  
  // If we came from the gallery viewer, return there instead of settings
  if (returnToGalleryFromViewerEdit) {
    returnToGalleryFromViewerEdit = false;
    document.getElementById('settings-submenu').style.display = 'none';
    isSettingsSubmenuOpen = false;
    // Remember which preset was loaded before we open the viewer (openImageViewer blanks the field)
    const presetToRestore = window.viewerLoadedPreset;
    openImageViewer(currentViewerImageIndex);
    // Determine which preset to load into the viewer
    let presetToShow = null;
    if (presetToRestore) {
      // Editing existing — find by name first, fall back to saved index
      let updatedPreset = CAMERA_PRESETS.find(p => p.name === presetToRestore.name);
      if (!updatedPreset && savedBuilderIndex >= 0 && CAMERA_PRESETS[savedBuilderIndex]) {
        updatedPreset = CAMERA_PRESETS[savedBuilderIndex];
      }
      presetToShow = updatedPreset || presetToRestore;
    } else if (savedBuilderIndex >= 0 && CAMERA_PRESETS[savedBuilderIndex]) {
      // Edited existing preset with no prior loaded preset
      presetToShow = CAMERA_PRESETS[savedBuilderIndex];
    } else {
      // Brand new preset — it was just pushed to CAMERA_PRESETS, find it by internal:false at end
      const newPresets = CAMERA_PRESETS.filter(p => p.internal === false);
      if (newPresets.length > 0) presetToShow = newPresets[newPresets.length - 1];
    }
    if (presetToShow) {
      window.viewerLoadedPreset = presetToShow;
      let fullText = presetToShow.message || '';
      if (presetToShow.randomizeOptions) {
        if (presetToShow.optionGroups && presetToShow.optionGroups.length > 0) {
          presetToShow.optionGroups.forEach(group => {
            fullText += '\n\n' + group.title + ':\n';
            group.options.forEach((opt, i) => { fullText += '  ' + i + ': ' + opt.text + '\n'; });
          });
        } else if (presetToShow.options && presetToShow.options.length > 0) {
          fullText += '\n\nOPTIONS:\n';
          presetToShow.options.forEach((opt, i) => { fullText += '  ' + i + ': ' + opt.text + '\n'; });
        }
      }
      if (presetToShow.additionalInstructions && presetToShow.additionalInstructions.trim()) {
        fullText += '\n\n' + presetToShow.additionalInstructions;
      }
      const promptInput = document.getElementById('viewer-prompt');
      if (promptInput) promptInput.value = fullText;
      const presetHeader = document.getElementById('viewer-preset-header');
      if (presetHeader) presetHeader.textContent = presetToShow.name;
    }
    updatePresetDisplay();
    return;
  }

  // If we came from the main menu + button, return to main menu
  if (returnToMainMenuFromBuilder) {
    returnToMainMenuFromBuilder = false;
    showUnifiedMenu();
    return;
  }
  
  showSettingsSubmenu();
}

// ============================================================
// VIEWER PRESET OPTIONS (Gallery - Load Preset)
// ============================================================

// Show option fields in the gallery viewer when a preset with options is loaded
function showViewerPresetOptions(preset) {
  const container = document.getElementById('viewer-options-container');
  const singleDiv = document.getElementById('viewer-single-options');
  const multiDiv = document.getElementById('viewer-multi-options');
  
  if (!container) return;
  
  // Clear previous
  document.getElementById('viewer-single-options-list').innerHTML = '';
  document.getElementById('viewer-multi-options-groups').innerHTML = '';
  
  if (!preset.randomizeOptions) {
    container.style.display = 'none';
    return;
  }
  
  container.style.display = 'block';
  
  if (preset.optionGroups && preset.optionGroups.length > 0) {
    // Multi-selection
    singleDiv.style.display = 'none';
    multiDiv.style.display = 'block';
    const groupsContainer = document.getElementById('viewer-multi-options-groups');
    
    preset.optionGroups.forEach((group, groupIndex) => {
      const groupDiv = document.createElement('div');
      groupDiv.style.marginBottom = '10px';
      
      const label = document.createElement('div');
      label.style.cssText = 'font-size: 11px; color: #aaa; margin-bottom: 6px;';
      label.textContent = group.title + ':';
      groupDiv.appendChild(label);
      
      group.options.forEach((opt, optIndex) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.dataset.groupIndex = groupIndex;
        btn.dataset.optIndex = optIndex;
        btn.textContent = opt.text;
        btn.style.cssText = 'display: block; width: 100%; text-align: left; padding: 8px 12px; margin-bottom: 4px; background: #2a2a2a; color: #fff; border: 1px solid #444; border-radius: 4px; cursor: pointer; font-size: 12px;';
        btn.addEventListener('click', () => {
          // Deselect others in same group
          groupDiv.querySelectorAll('button').forEach(b => {
            b.style.background = '#2a2a2a';
            b.style.borderColor = '#444';
            b.removeAttribute('data-selected');
          });
          btn.style.background = '#4CAF50';
          btn.style.borderColor = '#4CAF50';
          btn.setAttribute('data-selected', 'true');
        });
        groupDiv.appendChild(btn);
      });
      
      groupsContainer.appendChild(groupDiv);
    });
  } else if (preset.options && preset.options.length > 0) {
    // Single selection
    multiDiv.style.display = 'none';
    singleDiv.style.display = 'block';
    const listContainer = document.getElementById('viewer-single-options-list');
    
    preset.options.forEach((opt, optIndex) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.dataset.optIndex = optIndex;
      btn.textContent = opt.text;
      btn.style.cssText = 'display: block; width: 100%; text-align: left; padding: 8px 12px; margin-bottom: 4px; background: #2a2a2a; color: #fff; border: 1px solid #444; border-radius: 4px; cursor: pointer; font-size: 12px;';
      btn.addEventListener('click', () => {
        // Deselect all others
        listContainer.querySelectorAll('button').forEach(b => {
          b.style.background = '#2a2a2a';
          b.style.borderColor = '#444';
          b.removeAttribute('data-selected');
        });
        btn.style.background = '#4CAF50';
        btn.style.borderColor = '#4CAF50';
        btn.setAttribute('data-selected', 'true');
      });
      listContainer.appendChild(btn);
    });
  } else {
    container.style.display = 'none';
  }
}

// Collect the viewer's selected options (returns manualSelection or null for random)
function collectViewerSelectedOptions(preset) {
  if (!preset || !preset.randomizeOptions) return null;
  
  if (preset.optionGroups && preset.optionGroups.length > 0) {
    const groupsContainer = document.getElementById('viewer-multi-options-groups');
    if (!groupsContainer) return null;
    const selections = [];
    const groupDivs = groupsContainer.children;
    let anySelected = false;
    
    for (let i = 0; i < groupDivs.length; i++) {
      const selectedBtn = groupDivs[i].querySelector('button[data-selected]');
      if (selectedBtn) {
        selections.push(parseInt(selectedBtn.dataset.optIndex));
        anySelected = true;
      } else {
        selections.push(null); // No selection for this group
      }
    }
    
    // If none selected, return null (will randomize)
    return anySelected ? selections.map(s => s === null ? 0 : s) : null;
    
  } else if (preset.options && preset.options.length > 0) {
    const listContainer = document.getElementById('viewer-single-options-list');
    if (!listContainer) return null;
    const selectedBtn = listContainer.querySelector('button[data-selected]');
    return selectedBtn ? parseInt(selectedBtn.dataset.optIndex) : null;
  }
  
  return null;
}

// ============================================================
// STYLE EDITOR OPTION MANAGEMENT
// ============================================================

let styleOptionCounter = 0;
let styleGroupCounter = 0;

function toggleStyleRandomizeOptions() {
  const checkbox = document.getElementById('style-randomize');
  const selectionTypeContainer = document.getElementById('style-selection-type-container');
  
  if (checkbox.checked) {
    selectionTypeContainer.style.display = 'block';
    updateStyleSelectionTypeVisibility();
  } else {
    selectionTypeContainer.style.display = 'none';
    document.getElementById('style-single-options-container').style.display = 'none';
    document.getElementById('style-multi-options-container').style.display = 'none';
  }
}

function updateStyleSelectionTypeVisibility() {
  const selectionType = document.getElementById('style-selection-type').value;
  if (selectionType === 'single') {
    document.getElementById('style-single-options-container').style.display = 'block';
    document.getElementById('style-multi-options-container').style.display = 'none';
  } else {
    document.getElementById('style-single-options-container').style.display = 'none';
    document.getElementById('style-multi-options-container').style.display = 'block';
  }
}

function addStyleSingleOption(text = '', enabled = true) {
  const list = document.getElementById('style-single-options-list');
  const div = document.createElement('div');
  div.className = 'option-item';
  div.style.cssText = 'display:flex; align-items:center; gap:0;';
  
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = enabled;
  checkbox.title = 'Include this option';
  checkbox.className = 'style-option-checkbox';
  checkbox.style.cssText = 'margin:0; padding:0; flex-shrink:0;';
  checkbox.dataset.role = 'option-enabled';
  
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Option description';
  input.value = text;
  input.style.cssText = 'flex:1; min-width:0;';
  
  const removeBtn = document.createElement('button');
  removeBtn.textContent = 'Remove';
  removeBtn.onclick = () => div.remove();
  
  div.appendChild(checkbox);
  div.appendChild(input);
  div.appendChild(removeBtn);
  list.appendChild(div);
}

function addStyleOptionGroup(title = '', options = []) {
  const container = document.getElementById('style-multi-options-groups');
  const groupId = `style-group-${styleGroupCounter++}`;
  
  const groupDiv = document.createElement('div');
  groupDiv.className = 'option-group';
  groupDiv.dataset.groupId = groupId;
  
  const header = document.createElement('div');
  header.className = 'option-group-header';
  
  const titleInput = document.createElement('input');
  titleInput.type = 'text';
  titleInput.placeholder = 'Group Title (e.g., "COLOR", "STYLE")';
  titleInput.value = title;
  titleInput.dataset.role = 'group-title';
  
  const removeGroupBtn = document.createElement('button');
  removeGroupBtn.textContent = 'Remove Group';
  removeGroupBtn.onclick = () => groupDiv.remove();
  
  header.appendChild(titleInput);
  header.appendChild(removeGroupBtn);
  groupDiv.appendChild(header);
  
  const optionsDiv = document.createElement('div');
  optionsDiv.className = 'option-group-options';
  optionsDiv.dataset.role = 'group-options';
  groupDiv.appendChild(optionsDiv);
  
  const addBtn = document.createElement('button');
  addBtn.className = 'add-group-option';
  addBtn.textContent = '+ Add Option to Group';
  addBtn.onclick = () => addStyleGroupOption(groupId);
  groupDiv.appendChild(addBtn);
  
  container.appendChild(groupDiv);
  
  if (options.length > 0) {
    options.forEach(opt => addStyleGroupOption(groupId, opt.text, opt.enabled !== false));
  } else {
    addStyleGroupOption(groupId);
  }
}

function addStyleGroupOption(groupId, text = '', enabled = true) {
  const group = document.querySelector(`[data-group-id="${groupId}"]`);
  if (!group) return;
  
  const optionsContainer = group.querySelector('[data-role="group-options"]');
  const div = document.createElement('div');
  div.className = 'option-item';
  div.style.cssText = 'display:flex; align-items:center; gap:0;';
  
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = enabled;
  checkbox.title = 'Include this option';
  checkbox.className = 'style-option-checkbox';
  checkbox.style.cssText = 'margin:0; padding:0; flex-shrink:0;';
  checkbox.dataset.role = 'option-enabled';
  
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Option description';
  input.value = text;
  input.style.cssText = 'flex:1; min-width:0;';
  
  const removeBtn = document.createElement('button');
  removeBtn.textContent = 'Remove';
  removeBtn.onclick = () => div.remove();
  
  div.appendChild(checkbox);
  div.appendChild(input);
  div.appendChild(removeBtn);
  optionsContainer.appendChild(div);
}

function collectStyleSingleOptions() {
  const list = document.getElementById('style-single-options-list');
  const items = list.querySelectorAll('.option-item');
  const options = [];
  items.forEach((div, index) => {
    const input = div.querySelector('input[type="text"]');
    const checkbox = div.querySelector('input[type="checkbox"]');
    const text = input ? input.value.trim() : '';
    if (text) {
      options.push({ id: String(index + 1).padStart(3, '0'), text, enabled: checkbox ? checkbox.checked : true });
    }
  });
  return options;
}

function collectStyleOptionGroups() {
  const container = document.getElementById('style-multi-options-groups');
  const groups = container.querySelectorAll('.option-group');
  const optionGroups = [];
  groups.forEach(group => {
    const titleInput = group.querySelector('[data-role="group-title"]');
    const title = titleInput.value.trim().toUpperCase();
    if (!title) return;
    const optionDivs = group.querySelectorAll('[data-role="group-options"] .option-item');
    const options = [];
    optionDivs.forEach((div, index) => {
      const input = div.querySelector('input[type="text"]');
      const checkbox = div.querySelector('input[type="checkbox"]');
      const text = input ? input.value.trim() : '';
      if (text) options.push({ id: String(index + 1).padStart(3, '0'), text, enabled: checkbox ? checkbox.checked : true });
    });
    if (options.length > 0) optionGroups.push({ title, options });
  });
  return optionGroups;
}

function clearStyleEditorOptionFields() {
  const checkbox = document.getElementById('style-randomize');
  if (checkbox) checkbox.checked = false;
  const additional = document.getElementById('style-additional');
  if (additional) additional.value = '';
  const singleList = document.getElementById('style-single-options-list');
  if (singleList) singleList.innerHTML = '';
  const multiGroups = document.getElementById('style-multi-options-groups');
  if (multiGroups) multiGroups.innerHTML = '';
  const selTypeCont = document.getElementById('style-selection-type-container');
  if (selTypeCont) selTypeCont.style.display = 'none';
  const singleCont = document.getElementById('style-single-options-container');
  if (singleCont) singleCont.style.display = 'none';
  const multiCont = document.getElementById('style-multi-options-container');
  if (multiCont) multiCont.style.display = 'none';
  styleOptionCounter = 0;
  styleGroupCounter = 0;
}

// Toggle randomize options visibility
function toggleRandomizeOptions() {
  const randomizeCheckbox = document.getElementById('preset-builder-randomize');
  const selectionTypeContainer = document.getElementById('selection-type-container');
  const selectionType = document.getElementById('preset-builder-selection-type');
  
  if (randomizeCheckbox.checked) {
    selectionTypeContainer.style.display = 'block';
    updateSelectionTypeVisibility();
  } else {
    selectionTypeContainer.style.display = 'none';
    document.getElementById('single-options-container').style.display = 'none';
    document.getElementById('multi-options-container').style.display = 'none';
  }
}

// Update which option container is visible
function updateSelectionTypeVisibility() {
  const selectionType = document.getElementById('preset-builder-selection-type').value;
  const singleContainer = document.getElementById('single-options-container');
  const multiContainer = document.getElementById('multi-options-container');
  
  if (selectionType === 'single') {
    singleContainer.style.display = 'block';
    multiContainer.style.display = 'none';
  } else {
    singleContainer.style.display = 'none';
    multiContainer.style.display = 'block';
  }
}

// Add single option
function addSingleOption(text = '') {
  const list = document.getElementById('single-options-list');
  const id = `single-option-${singleOptionCounter++}`;
  
  const div = document.createElement('div');
  div.className = 'option-item';
  div.dataset.optionId = id;
  
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Option description (e.g., "Red background with blue text")';
  input.value = text;
  
  const removeBtn = document.createElement('button');
  removeBtn.textContent = 'Remove';
  removeBtn.onclick = () => div.remove();
  
  div.appendChild(input);
  div.appendChild(removeBtn);
  list.appendChild(div);
}

// Add option group
function addOptionGroup(title = '', options = []) {
  const container = document.getElementById('multi-options-groups');
  const groupId = `option-group-${optionGroupCounter++}`;
  
  const groupDiv = document.createElement('div');
  groupDiv.className = 'option-group';
  groupDiv.dataset.groupId = groupId;
  
  // Group header
  const header = document.createElement('div');
  header.className = 'option-group-header';
  
  const titleInput = document.createElement('input');
  titleInput.type = 'text';
  titleInput.placeholder = 'Group Title (e.g., "COLOR", "SIZE", "STYLE")';
  titleInput.value = title;
  titleInput.dataset.role = 'group-title';
  
  const removeGroupBtn = document.createElement('button');
  removeGroupBtn.textContent = 'Remove Group';
  removeGroupBtn.onclick = () => groupDiv.remove();
  
  header.appendChild(titleInput);
  header.appendChild(removeGroupBtn);
  groupDiv.appendChild(header);
  
  // Options container
  const optionsDiv = document.createElement('div');
  optionsDiv.className = 'option-group-options';
  optionsDiv.dataset.role = 'group-options';
  groupDiv.appendChild(optionsDiv);
  
  // Add option button
  const addBtn = document.createElement('button');
  addBtn.className = 'add-group-option';
  addBtn.textContent = '+ Add Option to Group';
  addBtn.onclick = () => addGroupOption(groupId);
  groupDiv.appendChild(addBtn);
  
  container.appendChild(groupDiv);
  
  // Add initial options if provided
  if (options.length > 0) {
    options.forEach(opt => addGroupOption(groupId, opt.text));
  } else {
    // Add one empty option by default
    addGroupOption(groupId);
  }
}

// Add option to specific group
function addGroupOption(groupId, text = '') {
  const group = document.querySelector(`[data-group-id="${groupId}"]`);
  if (!group) return;
  
  const optionsContainer = group.querySelector('[data-role="group-options"]');
  
  const div = document.createElement('div');
  div.className = 'option-item';
  
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Option description';
  input.value = text;
  
  const removeBtn = document.createElement('button');
  removeBtn.textContent = 'Remove';
  removeBtn.onclick = () => div.remove();
  
  div.appendChild(input);
  div.appendChild(removeBtn);
  optionsContainer.appendChild(div);
}

// Collect single options from UI
function collectSingleOptions() {
  const list = document.getElementById('single-options-list');
  const items = list.querySelectorAll('.option-item input');
  const options = [];
  
  items.forEach((input, index) => {
    const text = input.value.trim();
    if (text) {
      options.push({
        id: String(index + 1).padStart(3, '0'),
        text: text
      });
    }
  });
  
  return options;
}

// Collect option groups from UI
function collectOptionGroups() {
  const container = document.getElementById('multi-options-groups');
  const groups = container.querySelectorAll('.option-group');
  const optionGroups = [];
  
  groups.forEach(group => {
    const titleInput = group.querySelector('[data-role="group-title"]');
    const title = titleInput.value.trim().toUpperCase();
    
    if (!title) return; // Skip groups without title
    
    const optionInputs = group.querySelectorAll('[data-role="group-options"] .option-item input');
    const options = [];
    
    optionInputs.forEach((input, index) => {
      const text = input.value.trim();
      if (text) {
        options.push({
          id: String(index + 1).padStart(3, '0'),
          text: text
        });
      }
    });
    
    if (options.length > 0) {
      optionGroups.push({ title, options });
    }
  });
  
  return optionGroups;
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

  // Close all chip sections when clearing
  document.querySelectorAll('.chip-section-content').forEach(c => {
    c.style.display = 'none';
  });
  document.querySelectorAll('.chip-section-header').forEach(h => {
    h.classList.remove('expanded');
  });
// Clear new fields
  document.getElementById('preset-builder-randomize').checked = false;
  document.getElementById('preset-builder-additional').value = '';
  document.getElementById('single-options-list').innerHTML = '';
  document.getElementById('multi-options-groups').innerHTML = '';
  document.getElementById('selection-type-container').style.display = 'none';
  document.getElementById('single-options-container').style.display = 'none';
  document.getElementById('multi-options-container').style.display = 'none';
  singleOptionCounter = 0;
  optionGroupCounter = 0;
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
    if (promptTextarea) promptTextarea.value = preset.message || '';
    if (templateSelect) templateSelect.value = '';
    
    // Load additional instructions
    const additionalTextarea = document.getElementById('preset-builder-additional');
    if (additionalTextarea) {
      additionalTextarea.value = preset.additionalInstructions || '';
    }
    
    // Load randomize options and option data into UI
    const randomizeCheckboxLoad = document.getElementById('preset-builder-randomize');
    const selectionTypeLoad = document.getElementById('preset-builder-selection-type');
    
    // Clear existing option UI first
    document.getElementById('single-options-list').innerHTML = '';
    document.getElementById('multi-options-groups').innerHTML = '';
    singleOptionCounter = 0;
    optionGroupCounter = 0;
    
    if (randomizeCheckboxLoad) {
      randomizeCheckboxLoad.checked = preset.randomizeOptions || false;
      
      if (preset.randomizeOptions) {
        document.getElementById('selection-type-container').style.display = 'block';
        
        if (preset.optionGroups && preset.optionGroups.length > 0) {
          // Multi-selection
          selectionTypeLoad.value = 'multi';
          document.getElementById('single-options-container').style.display = 'none';
          document.getElementById('multi-options-container').style.display = 'block';
          preset.optionGroups.forEach(group => {
            addOptionGroup(group.title, group.options);
          });
        } else if (preset.options && preset.options.length > 0) {
          // Single selection
          selectionTypeLoad.value = 'single';
          document.getElementById('single-options-container').style.display = 'block';
          document.getElementById('multi-options-container').style.display = 'none';
          preset.options.forEach(opt => {
            addSingleOption(opt.text);
          });
        } else {
          document.getElementById('single-options-container').style.display = 'none';
          document.getElementById('multi-options-container').style.display = 'none';
        }
      } else {
        document.getElementById('selection-type-container').style.display = 'none';
        document.getElementById('single-options-container').style.display = 'none';
        document.getElementById('multi-options-container').style.display = 'none';
      }
    }
    
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
async function saveCustomPreset() {
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
  
  // Store oldName BEFORE modifying for IndexedDB cleanup later
  let oldNameForDB = null;
  
  // Check if we're editing an existing preset
  if (editingPresetBuilderIndex >= 0) {
    // Editing mode
    const oldName = CAMERA_PRESETS[editingPresetBuilderIndex].name;
    oldNameForDB = oldName; // Store for IndexedDB cleanup
    
    // Collect options data
    const randomizeCheckbox = document.getElementById('preset-builder-randomize');
    const selectionType = document.getElementById('preset-builder-selection-type');
    const additionalInstructions = document.getElementById('preset-builder-additional').value.trim();
    
    const randomizeOptions = randomizeCheckbox.checked;
    let options = [];
    let optionGroups = [];
    
    if (randomizeOptions) {
      if (selectionType.value === 'single') {
        options = collectSingleOptions();
      } else {
        optionGroups = collectOptionGroups();
      }
    }
    
    CAMERA_PRESETS[editingPresetBuilderIndex] = {
      name: name.toUpperCase(),
      category: categories,
      message: prompt,
      options: options,
      optionGroups: optionGroups,
      randomizeOptions: randomizeOptions,
      additionalInstructions: additionalInstructions,
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
      if (!await confirm(`A preset named "${name}" already exists. Do you want to overwrite it?`)) {
        return;
      }
      // Store old name for IndexedDB cleanup
      oldNameForDB = CAMERA_PRESETS[existingIndex].name;
      // Remove the existing preset
      CAMERA_PRESETS.splice(existingIndex, 1);
    }
    
    // Create new preset object
    // Collect options data
    const randomizeCheckbox = document.getElementById('preset-builder-randomize');
    const selectionType = document.getElementById('preset-builder-selection-type');
    const additionalInstructions = document.getElementById('preset-builder-additional').value.trim();
    
    const randomizeOptions = randomizeCheckbox.checked;
    let options = [];
    let optionGroups = [];
    
    if (randomizeOptions) {
      if (selectionType.value === 'single') {
        options = collectSingleOptions();
      } else {
        optionGroups = collectOptionGroups();
      }
    }
    
    const newPreset = {
      name: name.toUpperCase(),
      category: categories,
      message: prompt,
      options: options,
      optionGroups: optionGroups,
      randomizeOptions: randomizeOptions,
      additionalInstructions: additionalInstructions,
      internal: false
    };
    
    // Add to presets array
    CAMERA_PRESETS.push(newPreset);
    
    // Add to visible presets (always make new presets visible by default)
    if (!_visiblePresetsSet.has(newPreset.name)) {
      visiblePresets.push(newPreset.name);
    }
  }
  
  // Save visible presets first
  saveVisiblePresets();
  
  // Save custom preset to IndexedDB
  const finalPreset = editingPresetBuilderIndex >= 0 
    ? CAMERA_PRESETS[editingPresetBuilderIndex]
    : CAMERA_PRESETS[CAMERA_PRESETS.length - 1];
  
  // If name changed from old name, delete old IndexedDB record first
  if (oldNameForDB && oldNameForDB !== finalPreset.name) {
    const transaction = presetStorage.db.transaction(['presets'], 'readwrite');
    const store = transaction.objectStore('presets');
    await store.delete(`new_${oldNameForDB}`);
  }
  
  // Save new/updated preset to IndexedDB
  await presetStorage.saveNewPreset(finalPreset);
  
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
async function deleteCustomPreset() {
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
  
  if (!await confirm(`Delete preset "${preset.name}"? This cannot be undone.`)) {
    return;
  }
  
  // Save to trash before removing so it can be restored later
  saveToPresetTrash(CAMERA_PRESETS[editingPresetBuilderIndex]);

  // Remove from CAMERA_PRESETS
  CAMERA_PRESETS.splice(editingPresetBuilderIndex, 1);
  
  // Remove from visible presets
  const visIndex = visiblePresets.indexOf(preset.name);
  if (visIndex > -1) {
    visiblePresets.splice(visIndex, 1);
    saveVisiblePresets();
  }
  
  // Check if we deleted the currently active preset
  const wasCurrentPreset = (editingPresetBuilderIndex === currentPresetIndex);
  
  // Adjust current preset index if needed
  if (currentPresetIndex >= CAMERA_PRESETS.length) {
    currentPresetIndex = CAMERA_PRESETS.length - 1;
  }
  
  // If we deleted the current preset, switch to first visible preset
  if (wasCurrentPreset) {
    const visiblePresetObjects = CAMERA_PRESETS.filter(p => _visiblePresetsSet.has(p.name));
    if (visiblePresetObjects.length > 0) {
      currentPresetIndex = CAMERA_PRESETS.findIndex(p => p.name === visiblePresetObjects[0].name);
    } else if (CAMERA_PRESETS.length > 0) {
      // No visible presets, just use first available
      currentPresetIndex = 0;
    }
  }
  
  // Always update the camera footer after deletion
  updatePresetDisplay();

  // Clear viewer loaded preset and reset gallery header since the preset is gone
  window.viewerLoadedPreset = null;
  isGalleryLayerActive         = false;
  galleryLayerPresets          = [];
  galleryLayerManualSelections = {};
  const presetHeader = document.getElementById('viewer-preset-header');
  if (presetHeader) presetHeader.textContent = 'NO PRESET LOADED';
  
  // Remove from IndexedDB
  const transaction = presetStorage.db.transaction(['presets'], 'readwrite');
  const store = transaction.objectStore('presets');
  await store.delete(`new_${preset.name}`);
  
  // Also remove from old localStorage (legacy)
  saveStyles();
  
  // Update visible presets display to reflect deletion
  updateVisiblePresetsDisplay();
  
  alert(`Preset "${preset.name}" deleted successfully!`);
  
  // Clear form and go back
  clearPresetBuilderForm();
  hidePresetBuilderSubmenu();
  
  // Refresh menu if open
  if (isMenuOpen) {
    populateStylesList();
  }
}

function populateVisiblePresetsList(skipScrollSync = false) {
  const list = document.getElementById('visible-presets-list');
  
  // Save current scroll position from the scroll container (like favorites does)
  const scrollContainer = document.querySelector('#visible-presets-submenu .submenu-list');
  const scrollPosition = scrollContainer ? scrollContainer.scrollTop : 0;
  
  list.innerHTML = '';
  
  // Only show presets that were explicitly imported or are user-created custom presets
// Do NOT show factory presets from JSON that weren't imported
const importedPresetNames = new Set(presetImporter.getImportedPresets().map(p => p.name));
const allPresets = CAMERA_PRESETS.filter(p => {
  if (p.internal) return false;  // Never show internal presets
  
  // Show if: explicitly imported OR user-created custom preset
  const isImported = importedPresetNames.has(p.name);
  const isCustom = !factoryPresets.some(fp => fp.name === p.name);
  
  return isImported || isCustom;
});
  const _visibleSearchText = visiblePresetsFilterText ? stripAccents(visiblePresetsFilterText.toLowerCase()) : '';
  const filtered = allPresets.filter(preset => {
    // First apply text search filter
    if (_visibleSearchText) {
      const searchText = _visibleSearchText;
      const categoryMatch = preset.category && preset.category.some(cat => stripAccents(cat.toLowerCase()).includes(searchText));
      const optionsMatch = (
        (preset.options && preset.options.some(o => o.text && stripAccents(o.text.toLowerCase()).includes(searchText))) ||
        (preset.optionGroups && preset.optionGroups.some(g => g.title && stripAccents(g.title.toLowerCase()).includes(searchText) || g.options && g.options.some(o => o.text && stripAccents(o.text.toLowerCase()).includes(searchText))))
      );
      const textMatch = stripAccents(preset.name.toLowerCase()).includes(searchText) ||
             stripAccents((preset.message || '').toLowerCase()).includes(searchText) ||
             stripAccents((preset.additionalInstructions || '').toLowerCase()).includes(searchText) ||
             categoryMatch || optionsMatch;
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
    checkbox.checked = _visiblePresetsSet.has(preset.name);
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
    
    attachPresetLongPress(item, preset);
    fragment.appendChild(item);
  });
  
  list.appendChild(fragment);
  
  const countElement = document.getElementById('visible-presets-count');
  if (countElement) {
    const visibleCount = sorted.filter(p => _visiblePresetsSet.has(p.name)).length;
    countElement.textContent = visibleCount;
  }
  
// Update selection after render — skipped when caller manages scroll position itself
  if (!skipScrollSync) {
    setTimeout(() => {
      updateVisiblePresetsSelection();
    }, 50);
  }
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
  
  // Check if the currently active preset was just made invisible
  const currentPreset = CAMERA_PRESETS[currentPresetIndex];
  if (currentPreset && !isVisible && currentPreset.name === presetName) {
    // Current preset was made invisible - switch to first visible preset
    const visiblePresetObjects = CAMERA_PRESETS.filter(p => _visiblePresetsSet.has(p.name));
    if (visiblePresetObjects.length > 0) {
      // Find index of first visible preset in CAMERA_PRESETS
      currentPresetIndex = CAMERA_PRESETS.findIndex(p => p.name === visiblePresetObjects[0].name);
      // Update the camera footer immediately
      updatePresetDisplay();
    }
  }
  
// Save scroll position before repopulating (like favorites does)
  const scrollContainer = document.querySelector('#visible-presets-submenu .submenu-list');
  const scrollPosition = scrollContainer ? scrollContainer.scrollTop : 0;
  
  // Pass true to skip the internal scrollIntoView — we restore the position ourselves below
  populateVisiblePresetsList(true);
  
  // Restore scroll position after repopulating
  if (scrollContainer) {
    requestAnimationFrame(() => {
      scrollContainer.scrollTop = scrollPosition;
    });
  }
  
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
    if (categoryHint && preset && preset.category && !isVisiblePresetsFilterFocused) {
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
    
    // Update UI elements
    {
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
    }
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
  
  // Update the camera footer immediately
  updateNoMagicFooter();
  
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
      
      // Update the camera footer on startup if NO MAGIC is active
      updateNoMagicFooter();
    }
  } catch (err) {
    console.error('Failed to load No Magic mode:', err);
  }
}

// Manual Options Mode Toggle
function toggleManualOptionsMode() {
  manualOptionsMode = !manualOptionsMode;
  
  // Update the settings menu status label
  const statusElement = document.getElementById('manual-options-status');
  if (statusElement) {
    statusElement.textContent = manualOptionsMode ? 'Enabled' : 'Disabled';
    statusElement.style.color = manualOptionsMode ? '#4CAF50' : '';
    statusElement.style.fontWeight = manualOptionsMode ? '600' : '';
  }
  
  // Save to localStorage
  try {
    localStorage.setItem(MANUAL_OPTIONS_KEY, JSON.stringify(manualOptionsMode));
  } catch (err) {
    console.error('Failed to save Manual Select mode:', err);
  }
  
  // Update the camera footer
  updateNoMagicFooter();
  updatePresetDisplay();
  
  // Sync the gallery Options button color if it exists
  const optionsBtn = document.getElementById('options-viewer-button');
  if (optionsBtn) {
    if (manualOptionsMode) {
      optionsBtn.classList.add('enabled');
    } else {
      optionsBtn.classList.remove('enabled');
    }
  }

  // Sync the camera left carousel Options button
  const camOptBtn = document.getElementById('cam-options-btn');
  if (camOptBtn) {
    if (manualOptionsMode) camOptBtn.classList.add('enabled');
    else camOptBtn.classList.remove('enabled');
  }
}

// 
// LAYER PRESET SYSTEM
// Combines multiple presets into ONE merged prompt sent as a single AI request.
// 

// Build the combined layered prompt from an ordered array of presets.
// layerPresets[0] = PRIMARY, layerPresets[1..n] = additional layers.

function buildCombinedLayerPrompt(layerPresets, manualSelections = {}) {
  if (!layerPresets || layerPresets.length === 0) return '';

  const primaryPreset  = layerPresets[0];
  const additionalPresets = layerPresets.slice(1);

  // Helper: strips opening "Take a picture and/of/in/that" so layers
  // read as style modifiers rather than new photo requests
  function stripPhotoOpener(text) {
    if (!text) return '';
    return text
      .replace(/^Take a picture of the subject and /i, '')
      .replace(/^Take a picture of the subject, /i, '')
      .replace(/^Take a picture of the subject /i, '')
      .replace(/^Take a picture and /i, '')
      .replace(/^Take a picture of /i, '')
      .replace(/^Take a picture in /i, '')
      .replace(/^Take a picture that /i, '')
      .replace(/^Take a picture\./i, '')
      .replace(/^Take a picture /i, '')
      .trim();
  }

  // 1. Start with the primary message
  let finalPrompt = primaryPreset.message || '';

  // 2. Single-image reminder after the primary message
  finalPrompt += '\n\nPlease apply all style instructions to the same single image.';

  // 3. Primary preset options — manual selection if available, otherwise random
  if (primaryPreset.randomizeOptions) {
    const primaryManual = manualSelections[primaryPreset.name] ?? null;
    if (primaryManual !== null) {
      finalPrompt += '\n\n' + buildSelectedOptionsText(primaryPreset, primaryManual);
    } else {
      finalPrompt += '\n\n' + buildRandomOptionsText(primaryPreset);
    }
  }

  // 4. Additional transformation layers — strip photo opener so AI
  //    reads these as style modifiers, not new photo requests
  if (additionalPresets.length > 0) {
    finalPrompt += '\n\n--- ADDITIONAL TRANSFORMATION LAYERS ---\n';
    finalPrompt += '(Apply all of the following as style modifiers to the same single image)\n';
    additionalPresets.forEach((preset, index) => {
      const layerText = stripPhotoOpener(preset.message || '');
      finalPrompt += `\nLayer ${index + 1}:\n${layerText}\n`;
      // Add layer options — manual selection if available, otherwise random
      if (preset.randomizeOptions) {
        const layerManual = manualSelections[preset.name] ?? null;
        if (layerManual !== null) {
          finalPrompt += buildSelectedOptionsText(preset, layerManual) + '\n';
        } else {
          finalPrompt += buildRandomOptionsText(preset) + '\n';
        }
      }
    });
  }

  // 5. Final instructions (primary first, then each layer)
  finalPrompt += '\n\n--- FINAL INSTRUCTIONS ---\n';
  if (primaryPreset.additionalInstructions && primaryPreset.additionalInstructions.trim()) {
    finalPrompt += primaryPreset.additionalInstructions + '\n';
  }
  additionalPresets.forEach(preset => {
    if (preset.additionalInstructions && preset.additionalInstructions.trim()) {
      finalPrompt += preset.additionalInstructions + '\n';
    }
  });

  // 6. Master prompt override (if enabled)
  if (masterPromptEnabled) {
    const activeTexts = masterPromptSlots.filter(s => s.active && s.text.trim()).map(s => s.text.trim());
    if (activeTexts.length > 0) {
      finalPrompt += `\n\nOVERRIDE INSTRUCTIONS (these take priority over everything above - apply exactly as specified):\n${activeTexts.join('\n')}`;
    }
  }

  // 7. Aspect ratio
  if (selectedAspectRatio === '1:1') {
    finalPrompt += '\n\nOutput this image with a perfect 1:1 square aspect ratio. All content, subjects, and visual elements must be fully contained within the square frame. Do not add any borders, bars, or empty padding around the image. Nothing may extend beyond the square boundary.';
  } else if (selectedAspectRatio === '16:9') {
    finalPrompt += '\n\nOutput this image with a 16:9 widescreen aspect ratio by placing solid black bars at the top and bottom only. All image content, subjects, and visual elements must be fully contained within the central widescreen area between the black bars. No subject, object, or any visual element may overlap with, extend into, or appear within the black bar regions under any circumstances. The black bars must remain completely solid black with absolutely nothing visible within them.';
  }

  console.log('COMBINED LAYER PROMPT:', finalPrompt);

  console.log('COMBINED LAYER PROMPT:', finalPrompt);
  return finalPrompt;
}

// Update the visual highlight in the preset list when in Layer mode.
// PRIMARY = purple badge, Layers = grey numbered badges.

function updateLayerPresetList() {
  const presetList = document.getElementById('preset-list');
  if (!presetList) return;
  const items = presetList.querySelectorAll('.preset-item');

  items.forEach(item => {
    const presetName = item.querySelector('.preset-name').textContent;
    const selectedIndex = layerSelectedPresets.findIndex(p => p.name === presetName);

    // Remove old badges
    const oldBadge = item.querySelector('.layer-badge');
    if (oldBadge) oldBadge.remove();

    if (selectedIndex !== -1) {
      // Highlight selected
      item.style.background = selectedIndex === 0 ? 'rgba(156,39,176,0.25)' : 'rgba(85,85,85,0.35)';
      item.style.border = selectedIndex === 0 ? '2px solid #9c27b0' : '2px solid #888';

      // Add order badge
      const badge = document.createElement('span');
      badge.className = selectedIndex === 0 ? 'layer-badge layer-badge-primary' : 'layer-badge layer-badge-layer';
      badge.textContent = selectedIndex === 0 ? 'PRIMARY' : `Layer ${selectedIndex}`;
      item.querySelector('.preset-name').appendChild(badge);
    } else {
      item.style.background = '';
      item.style.border = '';
    }
  });

  const countSpan = document.getElementById('layer-preset-count');
  if (countSpan) {
    const label = layerSelectedPresets.length === 0
      ? '(0 selected)'
      : `(${layerSelectedPresets.length} selected — 1st = PRIMARY)`;
    countSpan.textContent = label;
  }
}

// CAMERA LAYER

// Opens the preset selector in Layer mode from the camera carousel button.

function openCameraLayerPresetSelector() {
  if (noMagicMode) {
    if (statusElement) statusElement.textContent = '⚡ NO MAGIC MODE — Layer Preset unavailable';
    setTimeout(() => updatePresetDisplay(), 2000);
    return;
  }
  if (isRandomMode) {
    if (statusElement) statusElement.textContent = '🎲 Random Mode is on — Layer Preset unavailable';
    setTimeout(() => updatePresetDisplay(), 2000);
    return;
  }

  isLayerPresetMode   = true;
  galleryLayerImageId = null; // camera context, not gallery
  layerSelectedPresets = [...cameraLayerPresets]; // pre-fill with existing selections

  const modal  = document.getElementById('preset-selector');
  const header = modal.querySelector('.preset-selector-header h3');
  header.innerHTML = 'Select Layer Presets (max 5) <span id="layer-preset-count" style="font-size:12px;color:#aaa;">(0 selected — 1st = PRIMARY)</span>';

  // Inject controls bar (or reuse)
  let layerControls = document.getElementById('layer-preset-controls');
  if (!layerControls) {
    layerControls = document.createElement('div');
    layerControls.id = 'layer-preset-controls';
    layerControls.style.cssText = 'padding:0 8px;background:#1a1a1a;border-bottom:1px solid #444;display:flex;gap:8px;justify-content:space-between;align-items:stretch;';
    layerControls.innerHTML = `
      <button id="layer-preset-apply"  class="batch-control-button" style="background:#9c27b0;color:#fff;">Apply Selected</button>
      <button id="layer-preset-cancel" class="batch-control-button">Cancel</button>
    `;
    const presetFilter = document.getElementById('preset-filter');
    const filterRow    = presetFilter.closest('.filter-row') || presetFilter.parentNode;
    filterRow.parentNode.insertBefore(layerControls, filterRow);
  }
  layerControls.style.display = 'flex';

  // Hide multi-preset controls if visible
  const multiControls = document.getElementById('multi-preset-controls');
  if (multiControls) multiControls.style.display = 'none';

  populatePresetList();
  updateLayerPresetList();
  modal.style.display   = 'flex';
  isPresetSelectorOpen  = true;
  currentPresetIndex_Gallery = 0;
  updatePresetSelection();

  document.getElementById('layer-preset-apply').onclick  = applyCameraLayerPresets;
  document.getElementById('layer-preset-cancel').onclick = cancelLayerPresetSelector;
}

function cancelLayerPresetSelector() {
  isLayerPresetMode    = false;
  layerSelectedPresets = [];
  const layerControls  = document.getElementById('layer-preset-controls');
  if (layerControls) layerControls.style.display = 'none';
  const header = document.querySelector('.preset-selector-header h3');
  if (header) header.textContent = 'Select Preset';
  hidePresetSelector();
}

async function applyCameraLayerPresets() {
  if (layerSelectedPresets.length === 0) {
    alert('Please select at least one preset. The first preset you tap becomes the PRIMARY.');
    return;
  }

  cameraLayerPresets  = [...layerSelectedPresets];
  isCameraLayerActive = true;
  isLayerPresetMode   = false;
  layerSelectedPresets = [];

  const layerControls = document.getElementById('layer-preset-controls');
  if (layerControls) layerControls.style.display = 'none';
  const header = document.querySelector('.preset-selector-header h3');
  if (header) header.textContent = 'Select Preset';
  hidePresetSelector();

  // Highlight the carousel button purple
  const btn = document.getElementById('camera-layer-toggle');
  if (btn) btn.classList.add('layer-active');

  // If Manual Options mode is on, gather selections for each preset now
  cameraLayerManualSelections = {};
  if (manualOptionsMode && !noMagicMode) {
    for (const preset of cameraLayerPresets) {
      const options = parsePresetOptions(preset);
      if (options.length > 0) {
        const selectedValue = await showManualOptionsModal(preset, options);
        if (selectedValue !== null) {
          cameraLayerManualSelections[preset.name] = selectedValue;
        }
      }
    }
  }

  // Save to localStorage so it survives a page refresh
  saveCameraLayerPresets();
  updatePresetDisplay();
  if (statusElement) {
    const names = cameraLayerPresets.map((p, i) => i === 0 ? `[PRIMARY] ${p.name}` : `[L${i}] ${p.name}`).join(' + ');
    statusElement.textContent = `📑 Layer: ${names}`;
  }
}

// Persist layer selections across refreshes
function saveCameraLayerPresets() {
  try {
    localStorage.setItem(CAMERA_LAYER_PRESET_KEY, JSON.stringify(cameraLayerPresets.map(p => p.name)));
  } catch (err) {
    console.error('Failed to save camera layer presets:', err);
  }
}

// Clear layer mode entirely
function clearCameraLayerPresets() {
  cameraLayerPresets  = [];
  isCameraLayerActive = false;
  try { localStorage.removeItem(CAMERA_LAYER_PRESET_KEY); } catch (err) {}
  const btn = document.getElementById('camera-layer-toggle');
  if (btn) btn.classList.remove('layer-active');
  updatePresetDisplay();
}

// Clears gallery layer state and resets the header indicator.
// Called whenever the user picks a new preset, edits a prompt, or selects multi.

function clearGalleryLayerState() {
  if (!isGalleryLayerActive) return; // nothing to clear
  isGalleryLayerActive         = false;
  galleryLayerPresets          = [];
  galleryLayerManualSelections = {};
}

function clearGalleryMultiState() {
  if (!isGalleryMultiActive) return; // nothing to clear
  isGalleryMultiActive         = false;
  galleryMultiPresets          = [];
  galleryMultiManualSelections = {};
}

// GALLERY LAYER 

// Opens the preset selector in Layer mode from the gallery image viewer.

function openGalleryLayerPresetSelector(imageId) {
  galleryLayerImageId  = imageId;
  isLayerPresetMode    = true;
  layerSelectedPresets = [];
  
  // Clear gallery multi state — user is switching to layer mode
  clearGalleryMultiState();

  const modal  = document.getElementById('preset-selector');
  const header = modal.querySelector('.preset-selector-header h3');
  header.innerHTML = 'Select Layer Presets (max 5) <span id="layer-preset-count" style="font-size:12px;color:#aaa;">(0 selected — 1st = PRIMARY)</span>';

  let layerControls = document.getElementById('layer-preset-controls');
  if (!layerControls) {
    layerControls = document.createElement('div');
    layerControls.id = 'layer-preset-controls';
    layerControls.style.cssText = 'padding:0 8px;background:#1a1a1a;border-bottom:1px solid #444;display:flex;gap:8px;justify-content:space-between;align-items:stretch;';
    layerControls.innerHTML = `
      <button id="layer-preset-apply"  class="batch-control-button" style="background:#9c27b0;color:#fff;">Apply Selected</button>
      <button id="layer-preset-cancel" class="batch-control-button">Cancel</button>
    `;
    const presetFilter = document.getElementById('preset-filter');
    const filterRow    = presetFilter.closest('.filter-row') || presetFilter.parentNode;
    filterRow.parentNode.insertBefore(layerControls, filterRow);
  }
  layerControls.style.display = 'flex';

  const multiControls = document.getElementById('multi-preset-controls');
  if (multiControls) multiControls.style.display = 'none';

  populatePresetList();
  updateLayerPresetList();
  modal.style.display   = 'flex';
  isPresetSelectorOpen  = true;
  currentPresetIndex_Gallery = 0;
  updatePresetSelection();

  document.getElementById('layer-preset-apply').onclick  = applyGalleryLayerPresets;
  document.getElementById('layer-preset-cancel').onclick = cancelLayerPresetSelector;
}

// Sends the combined layered prompt + selected gallery image to the Rabbit servers.
async function applyGalleryLayerPresets() {
  if (layerSelectedPresets.length === 0) {
    alert('Please select at least one preset. The first preset you tap becomes the PRIMARY.');
    return;
  }
  if (!galleryLayerImageId) {
    alert('No image selected.');
    return;
  }

  const image = galleryImages.find(img => img.id === galleryLayerImageId);
  if (!image) {
    alert('Image not found in gallery.');
    return;
  }

  const presetsToApply = [...layerSelectedPresets];

  // Save selections so they persist while the viewer is open
  galleryLayerPresets          = [...presetsToApply];
  isGalleryLayerActive         = true;
  galleryLayerManualSelections = {};

  // Clean up selector UI
  isLayerPresetMode    = false;
  layerSelectedPresets = [];
  galleryLayerImageId  = null;
  const layerControls  = document.getElementById('layer-preset-controls');
  if (layerControls) layerControls.style.display = 'none';
  const header = document.querySelector('.preset-selector-header h3');
  if (header) header.textContent = 'Select Preset';
  hidePresetSelector();

  // Gather manual option selections if Manual Options mode is on
  // and save them to galleryLayerManualSelections so MAGIC button reuses them
  galleryLayerManualSelections = {};
  if (manualOptionsMode && !noMagicMode) {
    for (const preset of presetsToApply) {
      const options = parsePresetOptions(preset);
      if (options.length > 0) {
        const selectedValue = await showManualOptionsModal(preset, options);
        if (selectedValue !== null) {
          galleryLayerManualSelections[preset.name] = selectedValue;
        }
      }
    }
  }

  // Build ONE combined prompt from all selected layers
  const combinedPrompt = buildCombinedLayerPrompt(presetsToApply, galleryLayerManualSelections);

  const resizedImageBase64 = await resizeImageForSubmission(image.imageBase64);

  // ALWAYS queue it first — whether online or offline — so it survives an
  // app restart or a lost connection partway through sending.
  // Same queue the camera screen's Sync button uses.
  const queueItem = {
    id: Date.now().toString() + '-gal-layer',
    imageBase64: resizedImageBase64,
    preset: {
      name: 'Layer: ' + presetsToApply.map(p => p.name).join(' + '),
      message: combinedPrompt,
      options: [],
      randomizeOptions: false,
      additionalInstructions: ''
    },
    isCombined: false,
    timestamp: Date.now()
  };
  photoQueue.push(queueItem);
  saveQueue();
  updateQueueDisplay();
  const presetHeader = document.getElementById('viewer-preset-header');
  if (presetHeader) presetHeader.textContent = '📑 LAYER';

  if (isOnline) {
    showGallerySubmittingIndicator('Submitting layers...');
    if (!isSyncing) syncQueuedPhotos();
    waitForSyncToFinish().then(hideGallerySubmittingIndicator);

    // GALLERY LAYER CREDIT GAME — earn credits for each unique imported preset used
    try {
      const _layerImported = presetImporter.getImportedPresets();
      if (_layerImported.length > 0) {
        const _layerImportedNames = new Set(_layerImported.map(p => p.name));
        let _layerNewCredits = 0;
        for (const preset of presetsToApply) {
          if (preset.name && _layerImportedNames.has(preset.name)) {
            if (earnCredit(preset.name)) _layerNewCredits++;
          }
        }
        if (_layerNewCredits > 0) {
          const _layerCreditsEl = document.getElementById('import-credits-display');
          if (_layerCreditsEl) _layerCreditsEl.textContent = `Credits: ${getCredits()}`;
          setTimeout(() => {
            const _layerTotal = getCredits();
            showGalleryCreditFlash(`🪙 ${_layerNewCredits > 1 ? _layerNewCredits + ' Credits' : 'Credit'} Earned!\n(${_layerTotal} total)`);
          }, 300);
        }
      }
    } catch (e) { /* non-critical */ }

    alert(`Layer preset applied! ${presetsToApply.length} preset${presetsToApply.length > 1 ? 's' : ''} merged into one transform.`);
  } else {
    showGalleryPresetFlash(`${presetsToApply.length} preset${presetsToApply.length > 1 ? 's' : ''} queued`);
    alert('You\'re offline — this will send automatically once you\'re back online (or tap Sync on the camera screen).');
  }
}

// END LAYER PRESET SYSTEM

// Save camera multi-preset state to localStorage
function saveCameraMultiPresets() {
  try {
    localStorage.setItem(CAMERA_MULTI_PRESET_KEY, JSON.stringify(cameraSelectedPresets.map(p => p.name)));
    localStorage.setItem(CAMERA_MULTI_SELECTIONS_KEY, JSON.stringify(cameraMultiManualSelections));
  } catch (err) {
    console.error('Failed to save camera multi presets:', err);
  }
}

// Clear camera multi-preset state
function clearCameraMultiPresets() {
  cameraSelectedPresets = [];
  cameraMultiManualSelections = {};
  isCameraMultiPresetActive = false;
  try {
    localStorage.removeItem(CAMERA_MULTI_PRESET_KEY);
    localStorage.removeItem(CAMERA_MULTI_SELECTIONS_KEY);
  } catch (err) {}
  const btn = document.getElementById('camera-multi-preset-toggle');
  if (btn) btn.classList.remove('camera-multi-active');
  updatePresetDisplay();
}

// Load Manual Options Mode from storage
function loadManualOptionsMode() {
  try {
    const saved = localStorage.getItem(MANUAL_OPTIONS_KEY);
    if (saved !== null) {
      manualOptionsMode = JSON.parse(saved);
      
      const statusElement = document.getElementById('manual-options-status');
      if (statusElement) {
        statusElement.textContent = manualOptionsMode ? 'Enabled' : 'Disabled';
        statusElement.style.color = manualOptionsMode ? '#4CAF50' : '';
        statusElement.style.fontWeight = manualOptionsMode ? '600' : '';
      }
      
      // updateNoMagicFooter(); - DON'T call updateNoMagicFooter here - it runs before presets load
    }
  } catch (err) {
    console.error('Failed to load Manual Select mode:', err);
  }
}

// Show manual options modal and wait for user selection
// sections = array of { title, options: [{value, label}] }
// Returns array of selected values (one per section), or null if cancelled
async function showManualOptionsModal(preset, sections) {
  // Legacy support: if passed a flat array of options (single modulo preset), wrap it
  if (sections.length > 0 && !sections[0].hasOwnProperty('title')) {
    sections = [{ title: 'SELECT', options: sections }];
  }

  return new Promise((resolve) => {
    const modal = document.getElementById('manual-options-modal');
    const list = document.getElementById('manual-options-list');
    const presetNameEl = document.getElementById('manual-options-preset-name');
    
    if (!modal || !list || !presetNameEl) {
      console.error('Manual select modal elements not found');
      resolve(null);
      return;
    }
    
    presetNameEl.textContent = preset.name;
    list.innerHTML = '';
       
    sections.forEach((section, sectionIndex) => {
      // Section header
      const header = document.createElement('div');
      header.style.padding = '10px 12px 4px';
      header.style.fontWeight = '700';
      header.style.fontSize = '11px';
      header.style.letterSpacing = '0.05em';
      header.style.color = '#aaa';
      header.style.textTransform = 'uppercase';
      header.style.borderTop = sectionIndex > 0 ? '1px solid #333' : 'none';
      header.style.marginTop = sectionIndex > 0 ? '8px' : '0';
      header.textContent = section.title;
      list.appendChild(header);

      section.options.forEach((option, optIndex) => {
        const globalIndex = `s${sectionIndex}_o${optIndex}`;
        const item = document.createElement('div');
        item.className = 'style-item';
        item.style.padding = '10px 12px';
        item.style.cursor = 'pointer';
        item.style.display = 'flex';
        item.style.alignItems = 'center';
        
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = `manual-option-section-${sectionIndex}`;
        radio.id = `manual-option-${globalIndex}`;
        radio.value = option.value;
        radio.style.marginRight = '10px';
        
        const label = document.createElement('label');
        label.htmlFor = `manual-option-${globalIndex}`;
        label.textContent = option.label;
        label.style.cursor = 'pointer';
        label.style.flex = '1';
        label.style.fontSize = '12px';
        
        item.appendChild(radio);
        item.appendChild(label);
        
        item.onclick = () => { radio.checked = true; };
        
        list.appendChild(item);
      });

      // Auto-select first option in each section
      const firstRadio = list.querySelector(`input[name="manual-option-section-${sectionIndex}"]`);
      if (firstRadio) firstRadio.checked = true;
    });

    // ── Arrow navigation setup ──
    // Build a flat array of all radios in DOM order
    const allRadios = Array.from(list.querySelectorAll('input[type="radio"]'));

    // Map each flat radio index → its section index (for group jumping)
    const radioSectionMap = [];
    sections.forEach((section, sectionIndex) => {
      section.options.forEach(() => radioSectionMap.push(sectionIndex));
    });

    // First flat index of each section (for double-click group jump)
    const sectionStartIndices = [];
    let _runningIdx = 0;
    sections.forEach((section) => {
      sectionStartIndices.push(_runningIdx);
      _runningIdx += section.options.length;
    });

    let _navIdx = 0; // tracks the currently arrow-navigated option

    const navToIndex = (idx) => {
      if (idx < 0) idx = 0;
      if (idx >= allRadios.length) idx = allRadios.length - 1;
      _navIdx = idx;
      allRadios[idx].checked = true;
      allRadios[idx].closest('.style-item')?.scrollIntoView({
        block: 'nearest',
        behavior: window._alphaLongPressActive ? 'instant' : 'smooth'
      });
    };

    // Keep _navIdx in sync when user taps an option directly
    allRadios.forEach((radio, idx) => {
      radio.addEventListener('change', () => { _navIdx = idx; });
    });

    // Double-click detection timers
    let _upClickTimer = null;
    let _downClickTimer = null;
    const DBLCLICK_MS = 280;

    // Use let so we can reassign after cloning
    let navUpBtn  = document.getElementById('manual-options-nav-up');
    let navDownBtn = document.getElementById('manual-options-nav-down');

    // Clone buttons to strip any accumulated long-press listeners from prior invocations
    if (navUpBtn) {
      const f = navUpBtn.cloneNode(true);
      navUpBtn.parentNode.replaceChild(f, navUpBtn);
      navUpBtn = f;
    }
    if (navDownBtn) {
      const f = navDownBtn.cloneNode(true);
      navDownBtn.parentNode.replaceChild(f, navDownBtn);
      navDownBtn = f;
    }

    const handleNavUp = () => {
      if (_upClickTimer) {
        // Double click — jump to first option of previous section
        clearTimeout(_upClickTimer);
        _upClickTimer = null;
        const prevSection = radioSectionMap[_navIdx] - 1;
        navToIndex(prevSection >= 0 ? sectionStartIndices[prevSection] : 0);
      } else {
        _upClickTimer = setTimeout(() => {
          _upClickTimer = null;
          navToIndex(_navIdx - 1); // single click — previous option
        }, DBLCLICK_MS);
      }
    };

    const handleNavDown = () => {
      if (_downClickTimer) {
        // Double click — jump to first option of next section
        clearTimeout(_downClickTimer);
        _downClickTimer = null;
        const nextSection = radioSectionMap[_navIdx] + 1;
        navToIndex(nextSection < sections.length ? sectionStartIndices[nextSection] : allRadios.length - 1);
      } else {
        _downClickTimer = setTimeout(() => {
          _downClickTimer = null;
          navToIndex(_navIdx + 1); // single click — next option
        }, DBLCLICK_MS);
      }
    };

    if (navUpBtn)   navUpBtn.onclick   = handleNavUp;
    if (navDownBtn) navDownBtn.onclick = handleNavDown;

    // Long press: continuously step through options one at a time, crossing section boundaries naturally
    if (window._addAlphaLongPress) {
      window._addAlphaLongPress(navUpBtn,   () => navToIndex(_navIdx - 1));
      window._addAlphaLongPress(navDownBtn, () => navToIndex(_navIdx + 1));
    }
    
    modal.style.display = 'flex';
    manualOptionsModalVisible = true;
    requestAnimationFrame(() => {
        const _optScrollContainer = document.querySelector('#manual-options-modal .styles-menu-scroll-container');
        if (_optScrollContainer) _optScrollContainer.scrollTop = 0;
    });

    const closeBtn = document.getElementById('close-manual-options');
    const cancelBtn = document.getElementById('cancel-manual-options');
    const confirmBtn = document.getElementById('confirm-manual-options');
    
    const cleanup = () => {
        modal.style.display = 'none';
        manualOptionsModalVisible = false;
      if (closeBtn) closeBtn.onclick = null;
      if (cancelBtn) cancelBtn.onclick = null;
      if (confirmBtn) confirmBtn.onclick = null;
      if (navUpBtn) navUpBtn.onclick = null;
      if (navDownBtn) navDownBtn.onclick = null;
      if (_upClickTimer)   { clearTimeout(_upClickTimer);   _upClickTimer   = null; }
      if (_downClickTimer) { clearTimeout(_downClickTimer); _downClickTimer = null; }
    };
    
    const handleClose = () => {
      cleanup();
      resolve(null);
    };
    
    const handleConfirm = () => {
      const selections = [];
      sections.forEach((section, sectionIndex) => {
        const selected = list.querySelector(`input[name="manual-option-section-${sectionIndex}"]:checked`);
        selections.push(selected ? parseInt(selected.value) : 0);
      });
      cleanup();
      // If only one section, return single value for backwards compat; else return array
      resolve(sections.length === 1 ? selections[0] : selections);
    };
    
    if (closeBtn) closeBtn.onclick = handleClose;
    if (cancelBtn) cancelBtn.onclick = handleClose;
    if (confirmBtn) confirmBtn.onclick = handleConfirm;
  });
}

function updateNoMagicFooter() {
  if (!window.cameraStarted) return;
  
  if (noMagicMode) {
    if (statusElement) {
      statusElement.textContent = '⚡ NO MAGIC MODE';
    }
  } else if (manualOptionsMode) {
    if (statusElement) {
      statusElement.textContent = '🎯 MANUALLY SELECT';
    }
  } else {
    updatePresetDisplay();
  }
}

// Load import resolution setting
function loadImportResolution() {
  const saved = localStorage.getItem(IMPORT_RESOLUTION_STORAGE_KEY);
  if (saved !== null) {
    currentImportResolutionIndex = parseInt(saved, 10);
  }
  updateImportResolutionDisplay();
}

// Save import resolution setting
function saveImportResolution() {
  localStorage.setItem(IMPORT_RESOLUTION_STORAGE_KEY, currentImportResolutionIndex.toString());
  updateImportResolutionDisplay();
}

// Update import resolution display
function updateImportResolutionDisplay() {
  const display = document.getElementById('current-import-resolution-display');
  if (display) {
    const res = IMPORT_RESOLUTION_OPTIONS[currentImportResolutionIndex];
    display.textContent = res.name.split(' ')[0];
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

// ===== TUTORIAL SEARCH =====

let tutorialSearchResults = [];
let tutorialSearchIndex = 0;
let tutorialSearchOriginalHTML = null;

function tutorialSearchRun() {
  const input = document.getElementById('tutorial-search-input');
  const status = document.getElementById('tutorial-search-status');
  const contentArea = document.getElementById('tutorial-content-area');
  if (!input || !contentArea) return;

  const query = input.value.trim();

  // Restore original HTML first (remove any previous highlights)
  const tutorialContent = contentArea.querySelector('.tutorial-content');
  if (tutorialSearchOriginalHTML !== null) {
    tutorialContent.innerHTML = tutorialSearchOriginalHTML;
  }

  tutorialSearchResults = [];
  tutorialSearchIndex = 0;

  if (!query) {
    if (status) status.textContent = '';
    tutorialSearchOriginalHTML = null;
    return;
  }

  // Save clean HTML before highlighting
  tutorialSearchOriginalHTML = tutorialContent.innerHTML;

  // Split into individual words, strip accents so "cafe" finds "café"
  const words = query.split(/\s+/).filter(w => w.length > 0);
  const normalizedWords = words.map(w => stripAccents(w.toLowerCase()));

  // Build regex from accent-stripped words
  const escapedWords = normalizedWords.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const re = new RegExp('(' + escapedWords.join('|') + ')', 'gi');

  // Walk all text nodes — test against accent-stripped content so "cafe" hits "café"
  const walker = document.createTreeWalker(tutorialContent, NodeFilter.SHOW_TEXT, null);
  const matchNodes = [];
  let node;
  while ((node = walker.nextNode())) {
    const normalized = stripAccents(node.textContent);
    if (re.test(normalized)) {
      matchNodes.push(node);
    }
    re.lastIndex = 0;
  }

  // Highlight matches — match positions in normalized text align 1:1 with original,
  // so we can slice the original text using positions found in the normalized version.
  matchNodes.forEach(textNode => {
    const parent = textNode.parentNode;
    if (!parent) return;
    const original = textNode.textContent;
    const normalized = stripAccents(original);
    re.lastIndex = 0;
    const frag = document.createDocumentFragment();
    let lastIndex = 0;
    let match;
    while ((match = re.exec(normalized)) !== null) {
      if (match.index > lastIndex) {
        frag.appendChild(document.createTextNode(original.slice(lastIndex, match.index)));
      }
      const mark = document.createElement('mark');
      mark.className = 'tutorial-search-match';
      mark.style.cssText = 'background:#FE5F00;color:#000;border-radius:2px;padding:0 1px;';
      mark.textContent = original.slice(match.index, match.index + match[0].length);
      frag.appendChild(mark);
      tutorialSearchResults.push(mark);
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < original.length) {
      frag.appendChild(document.createTextNode(original.slice(lastIndex)));
    }
    parent.replaceChild(frag, textNode);
  });

  if (status) {
    status.textContent = tutorialSearchResults.length > 0
      ? `${tutorialSearchResults.length} result${tutorialSearchResults.length !== 1 ? 's' : ''} found`
      : 'No results found';
  }

  if (tutorialSearchResults.length > 0) {
    tutorialSearchIndex = 0;
    tutorialSearchScrollTo(0);
  }
}

function tutorialSearchScrollTo(index) {
  const status = document.getElementById('tutorial-search-status');
  tutorialSearchResults.forEach((el, i) => {
    el.style.background = i === index ? '#fff200' : '#FE5F00';
    el.style.color = '#000';
  });
  if (tutorialSearchResults[index]) {
    tutorialSearchResults[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  if (status && tutorialSearchResults.length > 0) {
    status.textContent = `Result ${index + 1} of ${tutorialSearchResults.length}`;
  }
}

function tutorialSearchNext() {
  if (tutorialSearchResults.length === 0) return;
  tutorialSearchIndex = (tutorialSearchIndex + 1) % tutorialSearchResults.length;
  tutorialSearchScrollTo(tutorialSearchIndex);
}

function tutorialSearchPrev() {
  if (tutorialSearchResults.length === 0) return;
  tutorialSearchIndex = (tutorialSearchIndex - 1 + tutorialSearchResults.length) % tutorialSearchResults.length;
  tutorialSearchScrollTo(tutorialSearchIndex);
}

function tutorialSearchClear() {
  const input = document.getElementById('tutorial-search-input');
  const status = document.getElementById('tutorial-search-status');
  const contentArea = document.getElementById('tutorial-content-area');
  if (input) input.value = '';
  if (status) status.textContent = '';
  if (tutorialSearchOriginalHTML !== null && contentArea) {
    const tutorialContent = contentArea.querySelector('.tutorial-content');
    if (tutorialContent) tutorialContent.innerHTML = tutorialSearchOriginalHTML;
    tutorialSearchOriginalHTML = null;
  }
  tutorialSearchResults = [];
  tutorialSearchIndex = 0;
}
// ===== END TUTORIAL SEARCH =====

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

// =============================================
// GUIDED TOUR ENGINE
// =============================================

let tourCurrentStep = 0;
let tourActive = false;

const TOUR_STEPS = [
  { section: 'Welcome', title: '👋 Welcome to the Audio Tour!', body: 'This tour walks you through every feature of Magic Kamera. Use Next and Back or scroll wheel to navigate. Pressing the side button advances the tour. Tap Skip Tour to exit. Program saves your position.' },
  { section: 'Basic Controls', title: '📸 Side Button — Take a Photo', body: 'Press the side button on your R1 to capture a photo. It is sent for AI transformation using the visible selected preset. You may also speak your preset with a long press.' },
  { section: 'Basic Controls', title: '🔄 Scroll Wheel — Change Presets', get body() { return `Rotate the scroll wheel up or down to cycle through all ${totalFactoryPresetCount || 800} unlocked visible AI presets. The current preset name is shown at the bottom of the screen.`; } },
  { section: 'Basic Controls', title: '📷 Camera Switch Button', body: 'Tap the camera icon to toggle between front selfie and back camera at any time before taking a photo.' },
  { section: 'Basic Controls', title: '☰ Menu Button', body: 'Opens the main menu where you access all settings ⚙️, preset management, import preset tools, and this tutorial. The main menu has a plus (+) button in the header to create new presets.' },
  { section: 'Basic Controls', title: '🖼️ Gallery Button', body: 'Opens your saved photo gallery. View, re-prompt, batch process, organize your images into folders, or delete your images from here.' },
  { section: 'Basic Controls', title: '🔁 New Photo Button', body: 'After a photo is captured, the program shows you an image preview and sends the image to be processed, tap New Photo or press the side button again to return to the live camera view.' },
  { section: 'AI Presets', title: '✨ What Are AI Presets?', get body() { return `Presets are AI transformation instructions. Each one tells the AI how to reimagine your photo — as a comic book cover, oil painting, 3D print, ${totalFactoryPresetCount || 800} styles in all.`; } },
  { section: 'AI Presets', title: '⭐ Favorites', body: 'In the main menu, the visible selected preset is highlighted. Tap the star next to any preset to mark it as a favorite. Favorites are used by Random Mode to choose the presets that will be randomized. If no favorites are chosen, random mode chooses between all visible presets.' },
  { section: 'AI Presets', title: '🔍 Filter Presets', body: 'Use the search box in the main menu to quickly find presets by name or category. Tap a category tag at the bottom to filter by style. Tapping on the x next to the search box removes the keyboard. Double click to clear the text in the search bar.' },
  { section: 'AI Presets', title: '🔊 Hear Preset Info', body: 'When browsing presets in the Import screen, tap any preset to show the description. With the description visible, hard press the preset to have the description read aloud. Use the mute button in the header to toggle audio on or off.' },
  { section: 'Special Modes', title: '🎯 Special Modes — How to Access', body: 'Both carousels are default visible on the main camera screen. The Special Modes carousel is on the right.  Single click (default) on the main camera screen to hide/reveal the carousel buttons. This may be adjusted in settings.' },
  { section: 'Special Modes', title: '🎲 Random Mode', body: 'Picks a random preset for every photo you take. If you have favorites selected it draws only from those, otherwise from all visible presets.' },
  { section: 'Special Modes', title: '⏱️ Timer Mode', body: 'Set a countdown of 3, 5, or 10 seconds before each shot. Enable repeat mode so it automatically keeps taking photos at a set interval.' },
  { section: 'Special Modes', title: '📸⚡ Burst Mode', body: 'Captures 3 to 10 photos rapidly in one press. Choose slow, medium, or fast burst speed in Settings. Great for action shots or getting multiple variations.' },
  { section: 'Special Modes', title: '👁️ Motion Detection', body: 'Automatically captures when movement is detected in frame. Set sensitivity, start delay, and cooldown interval. The eye icon pulses when motion detection is triggered.' },
  { section: 'Special Modes', title: '🎞️ Multi Preset', body: 'Select up to 20 presets to apply to a single photo. Tap the film strip button in the carousel, choose presets, and tap Apply Selected. When you take a photo, each preset is sent in order with a 3 second gap between them.' },
  { section: 'Special Modes', title: '🖼️🖼️ Combine images:', body: 'Located near the bottom of the right carousel. Click to take two images and apply a combined image preset instruction with your selected preset or speak the preset with long press of the side button.' },
  { section: 'Special Modes', title: '📑 Layer presets:', body: 'Located at the bottom of the right carousel. Click to combine and apply multiple presets to a single image. Select primary preset and then add up to 4 more layers (5 in all). Does not work with spoken presets.' },
  { section: 'Special Modes', title: '📝 Master and 🎛️ Options', body: 'Located below the Menu button on the left side within a carousel. The MASTER button accesses Master Prompt settings. The OPTIONS button toggles Manually Select Options mode. Both Glow green when enabled.' },
  { section: 'Gallery', title: '🖼️ Gallery Activities', body: 'Within the gallery there are thumbnails of captured images. You can either select multiple images to apply a preset, or select a single image to either edit, export or apply one or several presets.' },
  { section: 'Uploading Images', title: '📥 Importing External Images', body: 'In the gallery, you may also bring any image from the web into the gallery using a QR code. Upload the image to catbox.moe, copy the direct link, and generate a QR code at qr-code-generator.com.' },
  { section: 'Uploading Images', title: '📷 Scanning the QR Code', body: 'In the gallery, press Import then Scan QR Code. Point your R1 camera at the QR code and wait. The image will be automatically saved to your gallery.' },
  { section: 'Uploading Images', title: '⚠️ Verify Your Link First', body: 'Before making the QR code, paste the link into a browser. If it shows only the image with nothing around it, it will work. If it shows a webpage with the image embedded, it will not work.' },
  { section: 'Gallery', title: '☑️ Batch Operations', body: 'Tap the Select button to enter batch mode. Select multiple images, then apply one preset to all of them or delete them in bulk. If only two are selected, you may also combine them. Always tap DONE when finished.' },
  { section: 'Gallery', title: '📁+ New Folder', body: 'Create a new folder to organize your saved images. Name the folder and save. Long press edits name. Images may be moved by selecting image(s) then long pressing the last image.' },
  { section: 'Gallery', title: '🖼️🖼️ Combine Images', body: 'Tap the Select button to enter batch mode. Select two images, then click Combine to create one image. You can apply presets to create combined subjects into one final image using existing presets.' }, 
  { section: 'Gallery', title: '🔀 Sort and Filter', body: 'Use the SORT button — to the right of Start and End — to sort images by Newest First or Oldest First. Filter by date range using the Start and End buttons.' },
  { section: 'Gallery', title: '🖼️ Image Viewer', body: 'Tap a thumbnail image in the gallery to view it full-screen. The viewer is redesigned to give your photo maximum screen space. Pinch to zoom in and out. Touch swipe up or down to cycle through other images within the gallery root directory or user folder.' },
  { section: 'Gallery', title: '🎨 Applying Presets to Single Image', body: 'After clicking on a single image, Tap LOAD or MULTI to transform a saved image. Click twice on a preset to apply to the image. You can stack multiple transformations. You may also layer up to five presets.' },
  { section: 'Gallery', title: '🏷️ Preset Header', body: 'At the very top of the image viewer a header shows the name of the currently loaded preset. Tap the header to hear the preset name and description.' },
  { section: 'Gallery', title: '🗑️ Delete Button', body: 'The delete button is on the top-left corner of the single image viewer.' },
  { section: 'Gallery', title: '🎠 Left Carousel', body: 'MASTER and OPTIONS buttons are located below the delete button and are visible by default (Single click (default) screen to hide-this may be adjusted in settings). The MASTER button toggles Master Prompt and OPTIONS button toggles Manually Select Options mode.' },
  { section: 'Gallery', title: '🎠 Right Carousel', body: 'The right side carousel has three buttons — ✏️ EDIT which opens the image editor, 📤 EXPORT which uploads to gofile.io, and 📑 LAYER which combines presets to single image. Single click (default) screen to hide the buttons. This may be adjusted in settings' },
  { section: 'Gallery', title: '⬇️ Bottom Bar Buttons', body: 'Four buttons on the bottom of image viewer. PROMPT opens editor. LOAD opens preset selector. MULTI opens multi-preset selector. MAGIC transforms image using the loaded preset, or randomly if nothing is loaded.' },
  { section: 'Gallery', title: '📤 Export to gofile.io', body: 'Tapping EXPORT in the right carousel. You get a QR code with a link that expires after 24 hours. Most useful in No Magic Mode.' },
  { section: 'Image Editor', title: '✏️ Opening the Editor', body: 'While viewing any photo, the image viewer contains the EDIT button. Tap it. The editor opens the image with a right-side carousel containing the crop, rotate, sharpen, auto-correct, color filters (vivid, warm, cool, Black and White (B&W) and Fade), and brightness and contrast control sliders.' },
  { section: 'Image Editor', title: '✂️ Crop Tool', body: 'Tap Crop to activate. Two orange corner markers appear. Drag them to frame your desired area. Tap Crop again to apply.' },
  { section: 'Image Editor', title: '🔄 Rotate Tool', body: 'Rotates your image 90 degrees clockwise each tap. Tap multiple times to reach 180, 270, or back to 0 degrees.' },
  { section: 'Image Editor', title: '🔍 Sharpen and Auto Correct', body: 'Sharpen makes edges crisper. Auto Correct automatically balances brightness, contrast, and color. Great as a first step before manual tweaks.' },
  { section: 'Image Editor', title: '🎨 Color Filters', body: 'Five filters below Auto Correct in the carousel. Vivid boosts saturation and contrast. Warm lifts reds and yellows. Cool shifts the image toward blue tones. B&W converts to professional black and white. Fade compresses contrast.' },
  { section: 'Image Editor', title: '☀️ Brightness and Contrast Sliders', body: 'At the top of the editor, drag the sliders to adjust brightness and contrast anywhere from negative 100 to positive 100 in real time.' },
  { section: 'Image Editor', title: '↶ Undo and Save', body: 'Undo steps back through your edit history one step at a time. Saving an edited image creates a new image in your gallery. Close (x) exits without saving.' },
  { section: 'Settings', title: '▣ Resolution', body: 'Choose from VGA 640 by 480 up to HD 3264 by 2448. Lower resolutions are recommended if you want images to appear in the magic gallery and you want to save space in your r1 device. Camera program slows if a high resolution is chosen.' },
  { section: 'Settings', title: '📐 Aspect Ratio', body: 'Choose 1 to 1 square or 16 to 9 letterbox. Leave both unchecked for neither. Default is neither. We highly recommend choosing an aspect ratio to display the full image, preventing accidental cropping.' },
  { section: 'Settings', title: '📝 Master Prompt', body: 'Adds instructions to presets. Enable first, type additions and press field to activate. Add more than one if desired. Add name and occasion to personalize presets. Can also be toggled from MASTER button inside image viewer or main camera screen.' },
  { section: 'Settings', title: '👁️ Visible Presets', body: 'Choose which imported presets appear in your menus. Select All, deselect individually, or remove all. Category tags show at the bottom when a preset is highlighted.' },
  { section: 'Settings', title: '🔨 Preset Builder', body: 'Build your own custom AI presets. Choose a template, add chips for quality and style, enable random options with single or multi-selection groups, add critical rules, then save. Also accessible directly from the main menu plus (+) button.' },
  { section: 'Settings', title: '🚫 No Magic Mode', body: 'Disables AI processing and works as a regular camera. Photos save only to the plugin gallery, not to the rabbit hole or magic gallery.' },
  { section: 'Settings', title: '🎛️ Manually Select Options Mode', body: 'When enabled and you choose a preset with options, a popup asks you to pick which option to use rather than a randomized option. Can also be toggled from the OPTIONS button inside the image viewer or on the main camera screen.' },
  { section: 'Settings', title: '🗑️ Restore Deleted Items', body: 'Restore custom or modified presets (Presets tab), images (Images tab)  and/or master prompts (Master tab) deleted from their sections. Will not restore presets that were deleted using the Reset Database.' },
  { section: 'Settings', title: '📥 Import Presets (Starting Style)', body: 'You begin with four unlocked presets-Caricature, Claymation, Impressionism and LEGO. Import them from the Import Presets section to capture photos and begin the fun journey of unlocking your imported artistic library.' },
  { section: 'Settings', title: '📥 Import Presets (Import Art)', body: 'Browse our external library in Settings. Check individual unlocked styles or use the All checkmark to select all  presets to import (assuming you have the credits).' },
  { section: 'Settings', title: '📥 Import Presets (New/Updated Presets)', body: 'Button indicates if there are any new/updated presets. Any updates are flagged so you can re-import changed/updated presets that you own. If you do not import updated presets, the preset will not be updated. New presets appear locked.' },
  { section: 'Settings', title: '📥 Import Presets (Unlock)', body: 'Imported styles first appear locked. To unlock one, you need a credit. Take a photo with any preset you own, or reprompt a gallery image, to earn one credit. Each unique preset earns one credit — no repeats. Use credits to unlock new presets from the import list. Check regularly for newly added styles.' },
  { section: 'Settings', title: '📂 Preset File Settings (Overview)', body: 'An advanced feature located directly below Import Presets in Settings. It has two tabs: Preset Sources for loading custom preset collections, and Preview Images for importing your own preset thumbnail images. No credits are required for any custom source presets.' },
  { section: 'Settings', title: '📂 Preset File Settings (Source Repository)', body: 'Tap the Preset Sources tab and scroll to Add Custom Source. Enter name, type the raw URL to your JSON preset file. For GitHub, open the file and tap the Raw button to get the correct URL (or use the Convert GitHub to Raw button in program). Tap Add Source.' },
  { section: 'Settings', title: '📂 Preset File Settings (Source QR Code)', body: 'Upload JSON preset file to catbox.moe, copy direct link, generate QR code at qr-code-generator.com. Tap Preset Sources tab, scroll to Import Source via QR Code, press Scan. Scan code. The modal closes filling the text field with URL. Name it. Tap Add Source.' },
  { section: 'Settings', title: '📂 Preset File Settings (Importing Preview Images)', body: 'Tap the Preview Images tab. Upload your image to catbox.moe, get the direct link, generate a QR code, then press Scan QR Code to Import Preview Images. Scan the code. Image saves to your preview gallery. Recommended import size 160x160 pixels.' },
  { section: 'Settings', title: '📂 Preset File Settings (Correct Format)', body: 'Custom JSON files must be a preset matching the built-in format. To include preview images in a repository, create folder named public at same level as JSON file. Name image to match preset name, replace spaces and special characters with underscores. Save as PNG.' },
  { section: 'Settings', title: '📂 Preset File Settings (External Builder)', body: 'The custom JSON file must be a valid preset array matching the built-in format. We recommend using the Magic Kamera front end Preset builder at - https://jorge-e-t.github.io/MKPresetBuilder/' },
  { section: 'Settings', title: '📂 Preset File Settings (Managing Sources)', body: 'Each source has an ON and OFF toggle and EDIT button. The built-in library toggle appears when one custom source is active. Turning off custom sources re-enables the default. Use EDIT to change name or URL without deleting. The X button removes source entirely.' },
  { section: 'Settings', title: '📂 Preset File Settings (Managing Preview Images)', body: 'Hard press preset in a preset list to preview. Tap orange plus button to pick replacement image from your preview gallery. To revert to the original or remove a custom image, tap the top left undo arrow button.' },
  { section: 'Settings', title: '⚙️ Button Settings', body: 'Includes the settings for the main camera screen carousel and the Gallery Image Viewer screen carousel buttons. You may select different colors for buttons and text in the main camera and gallery image viewer screens. You may also select opacity (default solid) and set how many taps to hide/reveal the buttons.' },
  { section: 'Settings', title: '📖 Tutorial', body: 'Last section in the settings. This area includes this audio tour. It also includes an indexed tutorial with a search engine. Type to search or click on the search field and press the side button to speak the query.' },
  { section: 'Tips and Advanced', title: '🏷️ Category Searching', body: 'Every preset has categories. When a preset is highlighted in the Visible Presets menu, its categories appear at the bottom. Tap a category to filter all presets in that group.' },
  { section: 'Tips and Advanced', title: '🖼️ Preview Preset', body: 'When you long press on a preset, you are provided a sample image preview of what the style will look like.' },
  { section: 'Tips and Advanced', title: '🧠 Master Prompt Power Tip', body: 'Search for master or master prompt in the Visible Presets menu to find presets designed to work with Master Prompt. These respond to names, occasions, and custom context you provide. All presets may be affected by the Master Prompt. Add several master prompts to your preset by activating them.' },
  { section: 'Tips and Advanced', title: '📶 Offline Queue', body: 'If you take photos and the program goes offline - no worries - photos queue automatically and may be synced to the rabbit hole once your connection returns. The queue count shows on the screen.' },
  { section: 'Tips and Advanced', title: '🔁 Reset Database', body: 'The nuclear option in Settings. Revert individual settings, presets, credits, images or entire program to default. All custom work deleted. Use only if something is seriously broken. Once you reset any portion of the database, RESTART PROGRAM FOR SETTINGS TO RESET CLEANLY.' },
  { section: 'Tips and Advanced', title: '💀 Content Filter Error', body: 'If you go into your rabbit hole and you receive a content filter image error, this happens because AI is quirky. The beauty of Magic Kamera is you can reprompt. Keep tapping that magic button until successful.' },
  { section: 'Tips and Advanced', title: '↑↓ Jump Navigation (Presets)', body: 'Areas with presets, click the up/down arrows once moves one page. Double-click (or hard press) jumps to next or previous letter of alphabet within that section (favorites and non-favorites are navigated separately). Triple-click jumps all the way to top or bottom of list.' },
  { section: 'Tips and Advanced', title: '↑↓ Jump Navigation (Options)', body: 'In the select options modal (When options are enabled), single clicking the up/down arrows move to the next option and double clicking jumps to the next options group.' },
  { section: 'Tips and Advanced', title: '↑↓ Jump Navigation (Settings)', body: 'In the settings submenu, clicking the up/down arrows once moves one setting. Double-clicking jumps all the way to the top or bottom of the list.' },
  { section: 'Troubleshooting', title: '❌ Camera access denied', body: 'This error will appear at the bottom of your main camera screen if you do not have any active presets, either imported or made with the preset builder.' },
  { section: 'Troubleshooting', title: '❌ Image stuck in queue status', body: 'This error will occur if you attempt to take a picture without a preset in your menu preset list. To clear, go to Reset Database in the settings submenu. Click the Photo Queue button and then click apply.' },
  { section: 'Done!', title: '🎉 Tour Complete!', body: 'That\'s Magic Kamera. Now go make magic! This tour or the text tutorial in this menu is here if you need a refresher. If you come across The One Ron G, The One Hashtag Cyber or The One Rabbit Jesus, tell them you enjoy this program.' },
];

function tourSpeak(text) {
  if (typeof PluginMessageHandler !== 'undefined') {
    PluginMessageHandler.postMessage(JSON.stringify({
      message: text,
      wantsR1Response: true
    }));
  } else if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  }
}

function tourStopSpeaking() {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

function startGuidedTour() {
  const saved = localStorage.getItem(TOUR_PROGRESS_KEY);
  tourCurrentStep = saved ? parseInt(saved, 10) : 0;
  if (isNaN(tourCurrentStep) || tourCurrentStep >= TOUR_STEPS.length) tourCurrentStep = 0;
  tourActive = true;
  hideTutorialSubmenu();
  document.getElementById('guided-tour-overlay').style.display = 'block';
  setTimeout(() => { renderTourStep(false); }, 300);
}

function endGuidedTour() {
  tourActive = false;
  tourStopSpeaking();
  // Save progress so user can resume later — clear it if they finished the last step
  if (tourCurrentStep >= TOUR_STEPS.length - 1) {
    localStorage.removeItem(TOUR_PROGRESS_KEY);
  } else {
    localStorage.setItem(TOUR_PROGRESS_KEY, tourCurrentStep.toString());
  }
  document.getElementById('guided-tour-overlay').style.display = 'none';
  showTutorialSubmenu();
}

function tourNext() {
  tourStopSpeaking();
  if (tourCurrentStep < TOUR_STEPS.length - 1) {
    tourCurrentStep++;
    renderTourStep(false);
  } else {
    endGuidedTour();
  }
}

function tourBack() {
  tourStopSpeaking();
  if (tourCurrentStep > 0) {
    tourCurrentStep--;
    renderTourStep(false);
  }
}

function renderTourStep(speak) {
  const step = TOUR_STEPS[tourCurrentStep];
  const total = TOUR_STEPS.length;

  document.getElementById('tour-step-badge').textContent = 'Step ' + (tourCurrentStep + 1) + ' of ' + total;
  document.getElementById('tour-section-label').textContent = step.section;
  document.getElementById('tour-card-title').textContent = step.title;
  document.getElementById('tour-card-body').textContent = step.body;
  document.getElementById('tour-progress-fill').style.width = (((tourCurrentStep + 1) / total) * 100) + '%';

  const backBtn = document.getElementById('tour-btn-back');
  if (backBtn) backBtn.disabled = tourCurrentStep === 0;

  const soundBtn = document.getElementById('tour-btn-sound');
  if (soundBtn) {
    soundBtn.onclick = () => {
      tourSpeak(step.title.replace(/[\p{Emoji}]/gu, '') + '. ' + step.body);
    };
  }

  const nextBtn = document.getElementById('tour-btn-next');
  if (nextBtn) nextBtn.textContent = tourCurrentStep === total - 1 ? 'Finish ✓' : 'Next ›';

  // Only speak when user navigates, not on first load
  if (speak) {
    tourSpeak(step.title.replace(/[\p{Emoji}]/gu, '') + '. ' + step.body);
  }

  // Always center the card
  const card = document.getElementById('tour-card');
  card.style.transform = 'translate(-50%, -50%)';
  card.style.top = '50%';
  card.style.left = '50%';
}

// Show import resolution submenu
function showImportResolutionSubmenu() {
  document.getElementById('settings-submenu').style.display = 'none';
  const submenu = document.getElementById('import-resolution-submenu');
  const list = document.getElementById('import-resolution-list');
  
  list.innerHTML = '';
  IMPORT_RESOLUTION_OPTIONS.forEach((res, index) => {
    const item = document.createElement('div');
    item.className = 'resolution-item';
    if (index === currentImportResolutionIndex) {
      item.classList.add('selected');
    }
    item.textContent = res.name;
    item.onclick = () => {
      currentImportResolutionIndex = index;
      saveImportResolution();
      hideImportResolutionSubmenu();
    };
    list.appendChild(item);
  });
  
  submenu.style.display = 'flex';
  isImportResolutionSubmenuOpen = true;
  currentImportResolutionIndex_Menu = 0;
}

// Hide import resolution submenu
function hideImportResolutionSubmenu() {
  document.getElementById('import-resolution-submenu').style.display = 'none';
  document.getElementById('settings-submenu').style.display = 'flex';
  isImportResolutionSubmenuOpen = false;
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
          // Show current preset when motion detection auto-stops
          if (CAMERA_PRESETS && CAMERA_PRESETS[currentPresetIndex]) {
            showStyleReveal(CAMERA_PRESETS[currentPresetIndex].name);
          }
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
    statusElement.textContent = noMagicMode
      ? `⚡ NO MAGIC MODE • 🎲 Random Mode`
      : `Random mode ON • ${CAMERA_PRESETS[currentPresetIndex].name}`;
    showStyleReveal('🎲 Random Mode');
  } else {
    randomToggle.classList.remove('random-active');
    updatePresetDisplay();
    // Show current preset when random mode is turned off
    if (CAMERA_PRESETS && CAMERA_PRESETS[currentPresetIndex]) {
      showStyleReveal(CAMERA_PRESETS[currentPresetIndex].name);
    }
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
    // If this fails (e.g. device storage is full), the item(s) currently in
    // photoQueue only exist in memory — closing or restarting the app before
    // a successful save would lose them for good. Warn the user right away
    // instead of failing silently.
    alert('Could not save the offline queue (storage may be full). Please tap Sync now, or avoid closing the app until it says everything is synced.');
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
    // connectionStatusElement.style.display = 'block'; // not auto-showing only shown on init
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
    syncButton.style.display = count > 0 && isOnline ? 'flex' : 'none';
  }
}

// Setup connection monitoring
function setupConnectionMonitoring() {
  // Guard: only register the window listeners once, no matter how many times
  // initCamera is called (e.g. after a failed camera start the user retries).
  if (!_connectionMonitoringActive) {
    _connectionMonitoringActive = true;

    window.addEventListener('online', () => {
      isOnline = true;
      updateConnectionStatus();
      console.log('Connection restored');

      if (photoQueue.length > 0) {
        if (statusElement) {
          statusElement.textContent = `Back online! ${photoQueue.length} item${photoQueue.length > 1 ? 's' : ''} queued — tap Sync to send.`;
        }
      }
    });

    window.addEventListener('offline', () => {
      isOnline = false;
      updateConnectionStatus();
      console.log('Connection lost');

      if (isSyncing) {
        if (statusElement) statusElement.textContent = 'Connection lost during sync';
      }
    });
  }

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
        width: { exact: resolution.width },
        height: { exact: resolution.height },
        frameRate: { ideal: 30, max: 30 }
      }
    };
  }

  const currentCamera = availableCameras[currentCameraIndex];
  const constraints = {
    video: {
      deviceId: { exact: currentCamera.deviceId },
      width: { exact: resolution.width },
      height: { exact: resolution.height },
      frameRate: { ideal: 30, max: 30 }
    }
  };
  
  if (isFrontCamera()) {
    constraints.video.advanced = [{ zoom: 1.0 }];
  }
  
  return constraints;
}

// Change resolution and restart camera
async function changeResolution(newIndex) {
  if (newIndex === currentResolutionIndex) return;
  
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
    // setTimeout(() => {
    //   applyWhiteBalance();
    // }, 100);
    
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
    // setTimeout(() => {
    //  applyWhiteBalance();
    // }, 100);
    
    await new Promise((resolve) => {
      if (video.readyState >= 1) {
        video.play().then(() => {
          applyVideoTransform();
          applyZoom(currentZoom);
          setTimeout(resolve, 100);
        }).catch((err) => {
          console.error('Video play error:', err);
          resolve();
        });
      } else {
        video.onloadedmetadata = async () => {
          video.onloadedmetadata = null;
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
        // Safety timeout so we never hang forever
        setTimeout(resolve, 3000);
      }
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
  if (window.isCameraLiveCombineMode) {
    alert('Turn off Combine mode before enabling Burst mode.');
    return;
  }
  isBurstMode = !isBurstMode;
  
  const burstToggle = document.getElementById('burst-toggle');
  if (isBurstMode) {
    burstToggle.classList.add('burst-active');
    statusElement.textContent = noMagicMode
      ? `⚡ NO MAGIC MODE • 📸 Burst Mode`
      : `Burst mode ON (${burstCount} photos) • ${CAMERA_PRESETS[currentPresetIndex].name}`;
    showStyleReveal('📸 Burst Mode');
  } else {
    burstToggle.classList.remove('burst-active');
    updatePresetDisplay();
    // Show current preset when burst mode is turned off
    if (CAMERA_PRESETS && CAMERA_PRESETS[currentPresetIndex]) {
      showStyleReveal(CAMERA_PRESETS[currentPresetIndex].name);
    }
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
  if (window.isCameraLiveCombineMode) {
    alert('Turn off Combine mode before enabling Timer mode.');
    return;
  }
  isTimerMode = !isTimerMode;
  
  const timerToggle = document.getElementById('timer-toggle');
  if (isTimerMode) {
    timerToggle.classList.add('timer-active');
    statusElement.textContent = noMagicMode
      ? `⚡ NO MAGIC MODE • ⏱️ Timer Mode`
      : `Timer mode ON (${timerDelay}s delay) • ${CAMERA_PRESETS[currentPresetIndex].name}`;
    showStyleReveal('⏱️ Timer Mode');
  } else {
    timerToggle.classList.remove('timer-active');
    // Cancel any active timer
    if (timerCountdown) {
      clearInterval(timerCountdown);
      timerCountdown = null;
      document.getElementById('timer-countdown').style.display = 'none';
    }
    updatePresetDisplay();
    // Show current preset when timer mode is turned off
    if (CAMERA_PRESETS && CAMERA_PRESETS[currentPresetIndex]) {
      showStyleReveal(CAMERA_PRESETS[currentPresetIndex].name);
    }
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
  // Clear the voice preset now that all burst shots have been taken.
  window.voicePreset = null;
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
      statusElement.textContent = noMagicMode
        ? `⚡ NO MAGIC MODE • 📸 Burst Mode`
        : `Burst mode ON (${burstCount} photos) • ${CAMERA_PRESETS[currentPresetIndex].name}`;
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
  
  // Only resize if dimensions actually changed to save CPU
  if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
  }
  
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
  
  // Apply white balance adjustments to canvas pixels - COMMENTED OUT
  // applyWhiteBalanceToCanvas(ctx, canvas.width, canvas.height);
  
  // Use lower quality for higher resolutions to reduce file size
const quality = currentResolutionIndex >= 2 ? 0.7 : 0.8;
  const dataUrl = canvas.toDataURL('image/jpeg', quality);
  // Use the voice preset if set — all burst shots share the same voice preset.
  // voicePreset is cleared by startBurstCapture after the loop finishes.
  const currentPreset = window.voicePreset || CAMERA_PRESETS[currentPresetIndex];
  
  // Add to gallery
  addToGallery(dataUrl);
  
  // NO PRESETS LOADED: nothing to send — the photo was already saved to the
  // gallery above, so skip the queue entirely (prevents jamming the sync).
  if (!currentPreset) {
    return;
  }
  
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
    
    const startScreen = document.getElementById('start-screen');
    if (startScreen) {
      const startText = startScreen.querySelector('.start-text');
      if (startText) {
        startText.textContent = 'Requesting camera access...';
      }
      const startButton = document.getElementById('start-button');
      if (startButton) {
        startButton.disabled = true;
      }
    }
    
    // Load the queue FIRST — before camera access — so saved items survive
    // even if the camera hangs or fails on this attempt.
    loadQueue();

    // Reset any stale sync state left over from a previous suspended session.
    isSyncing = false;
    if (syncButton) {
      syncButton.disabled = false;
      syncButton.classList.remove('syncing');
    }

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

    // Timeout prevents an infinite freeze when the camera hardware is in a
    // dirty state from a previous crash or force-close.
    stream = await Promise.race([
      navigator.mediaDevices.getUserMedia(constraints),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Camera access timed out — tap Start to try again.')), 15000)
      )
    ]);
    
    video.srcObject = stream;
    videoTrack = stream.getVideoTracks()[0];
    // Apply white balance
    // setTimeout(() => {
    //  applyWhiteBalance();
    // }, 100);
    
    console.log('Camera initialized:', getCurrentCameraLabel());

    setupConnectionMonitoring();
    
    await new Promise((resolve) => {
      // Timeout prevents a second freeze point if onloadedmetadata never fires.
      const videoLoadTimeout = setTimeout(() => {
        console.warn('Video metadata timed out — proceeding anyway');
        resolve();
      }, 10000);

      video.onloadedmetadata = async () => {
        clearTimeout(videoLoadTimeout);
        try {
          await video.play();
          applyVideoTransform();
          applyZoom(1);
          setTimeout(resolve, 100);
        } catch (err) {
          console.error('Video play error:', err);
          resolve();
        }
      };
    });
    
    document.getElementById('start-screen').remove(); // Deletes from memory
    document.getElementById('camera-container').style.display = 'flex';
    statusElement.style.display = 'block';

    // Re-run after the container is visible so the sync button is guaranteed
    // to appear if there are queued items waiting.
    updateQueueDisplay();
    
    const cameraButton = document.getElementById('camera-button');
    if (availableCameras.length > 1) {
      cameraButton.style.display = 'flex';
    }
    
    if (window._showCamCarousels) window._showCamCarousels();

    updatePresetDisplay();
    
    // Show online indicator for 3 seconds
    const connectionStatus = document.getElementById('connection-status');
    if (connectionStatus && isOnline) {
      connectionStatus.style.display = 'block';
      setTimeout(() => {
        connectionStatus.style.display = 'none';
      }, 3000);
    }
    
    // Wait for the update check to finish (if still running), then show indicator
    if (window._presetsUpdateCheckPromise) {
      await window._presetsUpdateCheckPromise;
      window._presetsUpdateCheckPromise = null;
    }
    if (window.hasPresetsUpdates) {
      const updatesIndicator = document.getElementById('updates-indicator');
      if (updatesIndicator) {
        updatesIndicator.style.display = 'block';
        setTimeout(() => {
          updatesIndicator.style.display = 'none';
        }, 3000);
      }
    }
    
    // Show master prompt indicator if enabled
    updateMasterPromptIndicator();
    
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
    
    // RE-ENABLE THE START BUTTON SO USER CAN TRY AGAIN
    const startButton = document.getElementById('start-button');
    if (startButton) {
      startButton.disabled = false;
    }
    const startScreen = document.getElementById('start-screen');
    if (startScreen) {
      startScreen.style.display = 'block';
    }
    
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
    stream.getTracks().forEach(track => track.stop());
    video.style.display = 'none';
    video.srcObject = null;
    stream = null;
    videoTrack = null;
    isLoadingCamera = false;
  }
}

async function reinitializeCamera() {
  if (!video) return;
  try {
    // Stop any existing stream completely
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      stream = null;
      videoTrack = null;
    }

    // Open the correct camera directly — no temporary stream needed.
    // The original device IDs from initCamera are still valid and will
    // open the right camera without any front-camera cycling flash.
    const constraints = getCameraConstraints();
    stream = await navigator.mediaDevices.getUserMedia(constraints);

    video.srcObject = stream;
    videoTrack = stream.getVideoTracks()[0];

    await new Promise((resolve) => {
      if (video.readyState >= 1) {
        video.play().then(() => {
          applyVideoTransform();
          applyZoom(currentZoom);
          setTimeout(resolve, 100);
        }).catch((err) => {
          console.error('Video reinit error:', err);
          applyVideoTransform();
          resolve();
        });
      } else {
        video.onloadedmetadata = async () => {
          video.onloadedmetadata = null;
          try {
            await video.play();
            applyVideoTransform();
            await applyZoom(currentZoom);
            setTimeout(resolve, 100);
          } catch (err) {
            console.error('Video reinit error:', err);
            applyVideoTransform();
            resolve();
          }
        };
        setTimeout(resolve, 3000);
      }
    });

    video.style.display = 'block';

    // NOW that the real camera stream is active, re-enumerate cameras.
    // This gives us real device IDs so switchCamera() works correctly after
    // returning from the gallery or menu — without opening any extra camera.
    await enumerateCameras();

    // Keep currentCameraIndex in sync with the camera that actually opened.
    if (videoTrack) {
      const trackSettings = videoTrack.getSettings ? videoTrack.getSettings() : {};
      if (trackSettings.deviceId && availableCameras.length > 0) {
        const matchIdx = availableCameras.findIndex(c => c.deviceId === trackSettings.deviceId);
        if (matchIdx !== -1) currentCameraIndex = matchIdx;
      }
    }

    console.log('Camera fully re-initialized. Available cameras:', availableCameras.length);

  } catch (err) {
    console.error('Failed to re-initialize camera:', err);
    if (statusElement) statusElement.textContent = 'Camera restart failed';
  }

  // Restore status element display
  if (statusElement) {
    statusElement.style.display = 'block';
  }

  // Re-show the style reveal footer
  if (noMagicMode) {
    if (statusElement) statusElement.textContent = '⚡ NO MAGIC MODE';
    showStyleReveal('⚡ NO MAGIC MODE');
  } else if (isTimerMode || isBurstMode || isMotionDetectionMode || isRandomMode || isMultiPresetMode) {
    let modeName = '';
    if (isTimerMode) modeName = '⏱️ Timer Mode';
    else if (isBurstMode) modeName = '📸 Burst Mode';
    else if (isMotionDetectionMode) modeName = '👁️ Motion Detection';
    else if (isRandomMode) modeName = '🎲 Random Mode';
    if (statusElement) statusElement.textContent = `${modeName} • ${CAMERA_PRESETS[currentPresetIndex] ? CAMERA_PRESETS[currentPresetIndex].name : ''}`;
    showStyleReveal(modeName);
  } else {
    updatePresetDisplay();
  }
}

// Resume camera stream
async function resumeCamera() {
  if (video) {
    try {
      // Open the camera directly using current constraints.
      // No temporary stream needed — the original device IDs are still valid
      // and open the right camera without any front-camera cycling flash.
      const constraints = getCameraConstraints();
      stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      video.srcObject = stream;
      videoTrack = stream.getVideoTracks()[0];

      await new Promise((resolve) => {
        if (video.readyState >= 1) {
          video.play().then(() => {
            applyVideoTransform();
            applyZoom(currentZoom);
            setTimeout(resolve, 100);
          }).catch((err) => {
            console.error('Video resume error:', err);
            applyVideoTransform();
            resolve();
          });
        } else {
          video.onloadedmetadata = async () => {
            video.onloadedmetadata = null;
            try {
              await video.play();
              applyVideoTransform();
              await applyZoom(currentZoom);
              setTimeout(resolve, 100);
            } catch (err) {
              console.error('Video resume error:', err);
              applyVideoTransform();
              resolve();
            }
          };
          setTimeout(resolve, 3000);
        }
      });
      
      video.style.display = 'block';

      // Re-enumerate cameras now that the real stream is active.
      // This populates real device IDs so switchCamera() works correctly.
      await enumerateCameras();

      // Keep currentCameraIndex in sync with the camera that actually opened.
      if (videoTrack) {
        const trackSettings = videoTrack.getSettings ? videoTrack.getSettings() : {};
        if (trackSettings.deviceId && availableCameras.length > 0) {
          const matchIdx = availableCameras.findIndex(c => c.deviceId === trackSettings.deviceId);
          if (matchIdx !== -1) currentCameraIndex = matchIdx;
        }
      }
            
    } catch (err) {
      console.error('Failed to resume camera:', err);
      statusElement.textContent = 'Camera resume failed';
    }
  }
}

// Resolves which manual option value to use for a single (non-multi, non-layer)
// camera preset. If the same preset was used with manual options last time,
// asks "Use same options selected?" first instead of always reopening the modal.
async function resolveCameraSingleManualSelection(preset, options) {
  let reuse = false;
  if (cameraSingleLastPresetName === preset.name && cameraSingleLastSelection !== null) {
    reuse = await customConfirm('Use same options selected?');
  }

  if (reuse) {
    return cameraSingleLastSelection;
  }

  const selectedValue = await showManualOptionsModal(preset, options);
  if (selectedValue !== null) {
    cameraSingleLastPresetName = preset.name;
    cameraSingleLastSelection = selectedValue;
  }
  return selectedValue;
}

// Resolves the manual option selections to use for the active camera Multi-preset
// combo. Offers to reuse the previous selections before re-asking for each preset.
// Skipped entirely for Timer/Motion/Burst modes, same as the single-preset path.
async function resolveCameraMultiManualSelections() {
  const isIncompatibleMode = isTimerMode || isMotionDetectionMode || isBurstMode;
  if (!(manualOptionsMode && !noMagicMode) || isIncompatibleMode) {
    return cameraMultiManualSelections;
  }

  const presetsWithOptions = cameraSelectedPresets.filter(p => parsePresetOptions(p).length > 0);
  if (presetsWithOptions.length === 0) {
    return cameraMultiManualSelections;
  }

  const hasPrevious = presetsWithOptions.some(p => cameraMultiManualSelections[p.name] !== undefined);
  if (hasPrevious) {
    const reuse = await customConfirm('Use same options selected?');
    if (reuse) {
      return cameraMultiManualSelections;
    }
  }

  const freshSelections = {};
  for (const preset of cameraSelectedPresets) {
    const options = parsePresetOptions(preset);
    if (options.length > 0) {
      const selectedValue = await showManualOptionsModal(preset, options);
      if (selectedValue !== null) {
        freshSelections[preset.name] = selectedValue;
      }
    }
  }
  cameraMultiManualSelections = freshSelections;
  return cameraMultiManualSelections;
}

// Same idea as resolveCameraMultiManualSelections, but for the camera Layer combo.
async function resolveCameraLayerManualSelections() {
  const isIncompatibleMode = isTimerMode || isMotionDetectionMode || isBurstMode;
  if (!(manualOptionsMode && !noMagicMode) || isIncompatibleMode) {
    return cameraLayerManualSelections;
  }

  const presetsWithOptions = cameraLayerPresets.filter(p => parsePresetOptions(p).length > 0);
  if (presetsWithOptions.length === 0) {
    return cameraLayerManualSelections;
  }

  const hasPrevious = presetsWithOptions.some(p => cameraLayerManualSelections[p.name] !== undefined);
  if (hasPrevious) {
    const reuse = await customConfirm('Use same options selected?');
    if (reuse) {
      return cameraLayerManualSelections;
    }
  }

  const freshSelections = {};
  for (const preset of cameraLayerPresets) {
    const options = parsePresetOptions(preset);
    if (options.length > 0) {
      const selectedValue = await showManualOptionsModal(preset, options);
      if (selectedValue !== null) {
        freshSelections[preset.name] = selectedValue;
      }
    }
  }
  cameraLayerManualSelections = freshSelections;
  return cameraLayerManualSelections;
}

// Capture photo and send to WebSocket
function capturePhoto() {
  if (!stream) return;
  
  if (isRandomMode && CAMERA_PRESETS.length > 0) {
    currentPresetIndex = getRandomPresetIndex();
    showStyleReveal(CAMERA_PRESETS[currentPresetIndex].name);
  }
  
  // Only resize if dimensions actually changed to save CPU
  if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
  }
  
  const ctx = canvas.getContext('2d', { 
    willReadFrequently: false, 
    alpha: false,
    desynchronized: true
  });
  
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
  // applyWhiteBalanceToCanvas(ctx, canvas.width, canvas.height);
  
  // Use lower quality for higher resolutions to reduce file size
  const quality = currentResolutionIndex >= 2 ? 0.7 : 0.8;
  const dataUrl = canvas.toDataURL('image/jpeg', quality);
  capturedImage.src = dataUrl;
  capturedImage.style.display = 'block';
  capturedImage.style.transform = 'none';
  video.style.display = 'none';
  
    // Stop QR detection when photo is captured
  stopQRDetection();

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

  // PRESET CREDIT GAME — earn 1 credit per unique imported preset used to take a photo
  // Works for single preset, multi-preset, and layer modes

  (async () => {
    try {
      const imported = presetImporter.getImportedPresets();
      if (imported.length > 0) {
        const importedNames = new Set(imported.map(p => p.name));

        // Collect which presets are actually being used this shot
        let presetsUsed = [];
        if (isCameraMultiPresetActive && cameraSelectedPresets.length > 0) {
          // Multi-preset: check every selected preset
          presetsUsed = cameraSelectedPresets.filter(p => p.name && importedNames.has(p.name));
        } else if (isCameraLayerActive && cameraLayerPresets.length > 0) {
          // Layer-preset: check every layer preset
          presetsUsed = cameraLayerPresets.filter(p => p.name && importedNames.has(p.name));
        } else {
          // Single preset (including random and voice modes)
          const activePreset = CAMERA_PRESETS[currentPresetIndex];
          if (activePreset && activePreset.name && importedNames.has(activePreset.name)) {
            presetsUsed = [activePreset];
          }
        }

        let totalNewCredits = 0;
        for (const p of presetsUsed) {
          if (earnCredit(p.name)) totalNewCredits++;
        }

        if (totalNewCredits > 0) {
          playTaDaSound();
          const newTotal = getCredits();
          setTimeout(() => {
            showStyleReveal(`🪙 ${totalNewCredits > 1 ? totalNewCredits + ' Credits' : 'Credit'} Earned!\n(${newTotal} total)`);
            if (statusElement) {
              const prev = statusElement.textContent;
              statusElement.textContent = `🪙 Credit${totalNewCredits > 1 ? 's' : ''} earned! You have ${newTotal} credit${newTotal !== 1 ? 's' : ''}`;
              setTimeout(() => { statusElement.textContent = prev || ''; }, 4000);
            }
          }, 1800);
        }
      }
    } catch (e) { /* non-critical, ignore errors */ }
  })();
  
  // CAMERA MULTI-PRESET PATH

  if (isCameraMultiPresetActive && cameraSelectedPresets.length > 0) {
    resolveCameraMultiManualSelections().then((selectionsToUse) => {
      // Queue one item per selected preset, all sharing the same image
      const presetsToApply = [...cameraSelectedPresets];
      for (let i = 0; i < presetsToApply.length; i++) {
        const preset = presetsToApply[i];
        const manualSelection = selectionsToUse[preset.name] ?? null;
        const queueItem = {
          id: Date.now().toString() + '-mp' + i,
          imageBase64: dataUrl,
          preset: preset,
          manualSelection: manualSelection,
          timestamp: Date.now()
        };
        photoQueue.push(queueItem);
      }
      saveQueue();
      updateQueueDisplay();

      if (isOnline && !noMagicMode) {
        statusElement.textContent = `Multi: sending ${presetsToApply.length} presets...`;
        if (!isSyncing) {
          syncQueuedPhotos();
        }
      } else {
        statusElement.textContent = `${presetsToApply.length} presets queued`;
      }

      // Multi-preset mode persists — user must tap the lit button to clear it
    });
    return;
  }
  // END CAMERA MULTI-PRESET PATH

  // CAMERA LAYER-PRESET PATH
  // Merges all selected layer presets into ONE combined prompt and sends once.

  if (isCameraLayerActive && cameraLayerPresets.length > 0 && !isRandomMode) {
    resolveCameraLayerManualSelections().then((selectionsToUse) => {
      const combinedPrompt = buildCombinedLayerPrompt(cameraLayerPresets, selectionsToUse);
      const queueItem = {
        id: Date.now().toString() + '-layer',
        imageBase64: dataUrl,
        preset: {
          name: 'Layer: ' + cameraLayerPresets.map(p => p.name).join(' + '),
          message: combinedPrompt,
          options: [],
          randomizeOptions: false,
          additionalInstructions: ''
        },
        timestamp: Date.now()
      };
      photoQueue.push(queueItem);
      saveQueue();
      updateQueueDisplay();

      if (isOnline && !noMagicMode) {
        statusElement.textContent = `📑 Layer prompt sent (${cameraLayerPresets.length} presets merged)`;
        if (!isSyncing) syncQueuedPhotos();
      } else {
        statusElement.textContent = `📑 Layer prompt queued (${cameraLayerPresets.length} presets merged)`;
      }
    });

    // Layer mode persists — user must tap the lit button to clear it
    return;
  }
  // END CAMERA LAYER-PRESET PATH


  // Use the voice preset if the user just spoke one, then clear it
  // so the next photo goes back to the normally selected preset.
  const currentPreset = window.voicePreset || CAMERA_PRESETS[currentPresetIndex];
  window.voicePreset = null;
  
  // NO PRESETS LOADED: there is nothing to send to the AI, and queueing a
  // photo without a preset used to jam the sync queue permanently. The photo
  // was already saved to the gallery above, so just say so and stop here —
  // the same way No Magic Mode saves without sending.
  if (!currentPreset) {
    statusElement.textContent = 'Photo saved! (no presets loaded)';
    if (typeof PluginMessageHandler !== 'undefined') {
      PluginMessageHandler.postMessage(JSON.stringify({
        action: 'photo_captured',
        queued: false,
        queueLength: photoQueue.length,
        timestamp: Date.now()
      }));
    }
    return;
  }
  
  const queueItem = {
    id: Date.now().toString(),
    imageBase64: dataUrl,
    preset: currentPreset,
    timestamp: Date.now()
  };
  
  // Add to queue BEFORE showing modal
  photoQueue.push(queueItem);
  saveQueue();
  updateQueueDisplay();
  
  // If Manual Options is enabled and preset has options, show modal
  // BUT: Manual Options does NOT work with Timer, Motion Detection, or Burst modes
  // It ONLY works with Random mode or no special mode
  const isIncompatibleMode = isTimerMode || isMotionDetectionMode || isBurstMode;
  
  if (manualOptionsMode && !noMagicMode && !isIncompatibleMode) {
    const options = parsePresetOptions(currentPreset);
    
    if (options.length > 0) {
      // Show modal (or reuse last selection) and wait for the result
              resolveCameraSingleManualSelection(currentPreset, options).then((selectedValue) => {
        if (selectedValue !== null) {
          // User selected an option - update the queue item
          const queueIndex = photoQueue.findIndex(item => item.id === queueItem.id);
          if (queueIndex !== -1) {
            photoQueue[queueIndex].manualSelection = selectedValue;
            saveQueue();
          }
          
          // Trigger sync
          if (isOnline && !noMagicMode) {
            statusElement.textContent = 'Photo saved! Uploading...';
            if (!isSyncing) {
              syncQueuedPhotos();
            }
          } else {
            statusElement.textContent = `Photo queued (${photoQueue.length} in queue)`;
          }
        } else {
          // User cancelled - remove from queue
          const queueIndex = photoQueue.findIndex(item => item.id === queueItem.id);
          if (queueIndex !== -1) {
            photoQueue.splice(queueIndex, 1);
            saveQueue();
            updateQueueDisplay();
          }
          statusElement.textContent = 'Photo not sent - cancelled';
        }
      });
      return; // Exit early - modal will handle sync
    }
  }
  
  // No manual options needed - proceed normally
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

// FAILSAFE: actively verifies the internet connection is really alive.
// The browser's own online/offline flag (navigator.onLine) can claim
// "online" when the connection is actually dead — this makes a tiny real
// network request to be sure, so photos are never sent into the void.
async function verifyRealConnectivity() {
  if (!isOnline) return false;
  if (typeof fetch !== 'function' || typeof AbortController !== 'function') {
    return true; // can't actively verify in this environment — fall back to the browser flag
  }
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    await fetch('https://www.google.com/generate_204', {
      mode: 'no-cors',
      cache: 'no-store',
      signal: controller.signal
    });
    clearTimeout(timer);
    return true;
  } catch (e) {
    return false;
  }
}

// While photos are stuck in the queue because the connectivity check failed,
// quietly retry every 30 seconds so they go out on their own once the
// internet comes back — even if the browser never notices the change.
let _connectivityRetryTimer = null;
function _scheduleConnectivityRetry() {
  if (_connectivityRetryTimer) clearTimeout(_connectivityRetryTimer);
  _connectivityRetryTimer = setTimeout(() => {
    _connectivityRetryTimer = null;
    if (photoQueue.length > 0) syncQueuedPhotos(true);
  }, 30000);
}

async function syncQueuedPhotos(fromAutoRetry) {
  if (photoQueue.length === 0 || isSyncing) {
    return;
  }
  
  if (!isOnline) {
    statusElement.textContent = 'Cannot sync - offline';
    return;
  }
  
  isSyncing = true;
  if (syncButton) {
    syncButton.disabled = true;
    syncButton.classList.add('syncing');
  }
  
  console.log(`Syncing ${photoQueue.length} queued photos...`);
  
  const originalCount = photoQueue.length;
  let successCount = 0;
  let connectionLost = false;
  
  while (photoQueue.length > 0 && isOnline) {
    // FAILSAFE: confirm the connection is genuinely alive before sending
    // this photo. If not, stop here — nothing gets removed from the queue.
    const reallyOnline = await verifyRealConnectivity();
    if (!reallyOnline) {
      console.log('Connectivity check failed — keeping photos queued');
      connectionLost = true;
      break;
    }

    const item = photoQueue[0];

    // SELF-HEAL: an older bug could queue a photo with NO preset attached
    // (taken when no presets were loaded). There is nothing to send for such
    // an item — the photo is already in the gallery — so remove it and move
    // on, instead of letting it error out and block everything behind it
    // forever. This automatically unjams queues stuck from before this fix.
    if (!item || !item.preset) {
      photoQueue.shift();
      saveQueue();
      updateQueueDisplay();
      continue;
    }

    // Update the gallery header (if it's showing) with this preset's name —
    // visual only, mirrors the camera screen's own countdown rhythm.
    updateGallerySubmittingIndicator(item.preset && item.preset.name);
    
    try {
      statusElement.textContent = `Syncing ${successCount + 1}/${originalCount}...`;
      
      if (typeof PluginMessageHandler !== 'undefined' && !noMagicMode) {
        if (item.isCombined) window.isCombinedMode = true;
        const syncedPrompt = getFinalPrompt(item.preset, item.manualSelection ?? null);
        if (item.isCombined) window.isCombinedMode = false;
        const syncPayload = {
          pluginId: 'com.r1.pixelart',
          imageBase64: item.imageBase64
        };
        if (syncedPrompt && syncedPrompt.trim()) {
          syncPayload.message = syncedPrompt;
        }
        PluginMessageHandler.postMessage(JSON.stringify(syncPayload));
      }
      
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      if (isOnline) {
        photoQueue.shift();
        successCount++;
        saveQueue();
        updateQueueDisplay();
      } else {
        console.log('Lost connection during sync');
        break;
      }
      
      await new Promise(resolve => setTimeout(resolve, 3000));
      
    } catch (error) {
      console.error('Sync error:', error);
      statusElement.textContent = 'Sync error - will retry later';
      break;
    }
  }
  
  isSyncing = false;
  if (syncButton) {
    syncButton.disabled = false;
    syncButton.classList.remove('syncing');
  }
  
  if (connectionLost) {
    statusElement.textContent = `⚠️ No connection — ${photoQueue.length} photo${photoQueue.length > 1 ? 's' : ''} kept in queue`;
    updateQueueDisplay();
    _scheduleConnectivityRetry();
    if (fromAutoRetry !== true) {
      alert(`No internet connection detected. ${photoQueue.length} item${photoQueue.length > 1 ? 's' : ''} stayed safely in the queue and will send automatically once the connection returns — or tap Sync to retry.`);
    }
  } else if (photoQueue.length === 0) {
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
async function removeFromQueue(index) {
  if (await confirm('Remove this photo from the sync queue?')) {
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
async function clearQueue() {
  if (await confirm('Clear all photos from the queue? This cannot be undone.')) {
    photoQueue = [];
    saveQueue();
    updateQueueDisplay();
    showQueueManager();
  }
}

// Captures the current camera frame and returns it as a base64 data URL.
// Used by camera live combine mode to grab each photo without triggering
// the full capturePhoto queue/sync flow.
function captureRawPhotoDataUrl() {
  if (!stream) return null;

  if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
  }

  const ctx = canvas.getContext('2d', { willReadFrequently: false, alpha: false, desynchronized: true });
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const zoomedWidth = canvas.width / currentZoom;
  const zoomedHeight = canvas.height / currentZoom;
  const offsetX = (canvas.width - zoomedWidth) / 2;
  const offsetY = (canvas.height - zoomedHeight) / 2;

  if (!isFrontCamera()) {
    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(video, offsetX, offsetY, zoomedWidth, zoomedHeight, -canvas.width, 0, canvas.width, canvas.height);
    ctx.restore();
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.scale(-1, 1);
    tempCtx.drawImage(canvas, -canvas.width, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(tempCanvas, 0, 0);
  } else {
    ctx.drawImage(video, offsetX, offsetY, zoomedWidth, zoomedHeight, 0, 0, canvas.width, canvas.height);
  }

  const quality = currentResolutionIndex >= 2 ? 0.7 : 0.8;
  return canvas.toDataURL('image/jpeg', quality);
}

// Side button handler
window.addEventListener('sideClick', () => {
  console.log('Side button pressed');

  // Block side button during guided tour — advance to next step instead
  if (tourActive) {
    tourNext();
    return;
  }

  // Gallery — side button opens or checks the highlighted item
  const galleryModalOpen = document.getElementById('gallery-modal')?.style.display === 'flex';
  if (galleryModalOpen) {
    // Bottom pagination nav (Prev/Next page buttons)
    if (_galleryBottomNavIndex >= 0) {
      const bottomItems = _getGalleryBottomNavItems();
      const btn = bottomItems[_galleryBottomNavIndex];
      if (btn) btn.click();
      return;
    }
    if (_galleryTopNavIndex >= 0) {
      const topItems = _getGalleryTopNavItems();
      const btn = topItems[_galleryTopNavIndex];
      if (btn) btn.click();
      return;
    }
    const items = Array.from(document.querySelectorAll('#gallery-grid .gallery-item'));
    const highlighted = items[_galleryHighlightIndex];
    if (highlighted) {
      const imageId = highlighted.dataset.imageId;
      const folderId = highlighted.dataset.folderId;
      if (isBatchMode) {
        // In select mode: toggle the checkbox on the highlighted item
        if (imageId) toggleBatchImageSelection(imageId);
      } else if (folderId) {
        // Open the highlighted folder
        openFolderView(folderId);
      } else if (imageId) {
        // Open the highlighted image in the viewer
        const originalIndex = galleryImages.findIndex(i => i.id === imageId);
        if (originalIndex >= 0) openImageViewer(originalIndex);
      }
    }
    return;
  }

  // When the manual options modal is open, side button clicks the confirm/send button
  // NOTE: this must be checked BEFORE imageViewerOpen — the image viewer stays flex behind the modal
  if (manualOptionsModalVisible) {
    const confirmBtn = document.getElementById('confirm-manual-options');
    if (confirmBtn) confirmBtn.click();
    return;
  }

  // When the image viewer is open, side button triggers the magic button instead of taking a photo
  const imageViewerOpen = document.getElementById('image-viewer')?.style.display === 'flex';
  if (imageViewerOpen) {
    const magicBtn = document.getElementById('magic-button');
    if (magicBtn) magicBtn.click();
    return;
  }

  // Restore Deleted Items submenu - side button toggles checkbox on highlighted item
  if (isRestoreSubmenuOpen) {
    var restoreItems = getRestoreItems();
    if (restoreItems.length > 0 && currentRestoreIndex < restoreItems.length) {
      var currentRestoreItem = restoreItems[currentRestoreIndex];
      if (currentRestoreItem) {
        var restoreCb = currentRestoreItem.querySelector('input[type="checkbox"]');
        if (restoreCb) restoreCb.click();
      }
    }
    return;
  }

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

    // If we are in combine mode and waiting for photo 2, don't reset — capture instead

    if (window.isCameraLiveCombineMode && window.cameraCombineFirstPhoto) {
      // Take photo 2 immediately
      const dataUrl = captureRawPhotoDataUrl();
      if (dataUrl) {
        addToGallery(dataUrl);
        const photo1 = window.cameraCombineFirstPhoto;
        window.cameraCombineFirstPhoto = null;
        const voicePresetForCombine = window.cameraCombineVoicePreset || null;
        window.cameraCombineVoicePreset = null;
        finalizeCameraLiveCombine(photo1, dataUrl, voicePresetForCombine, voicePresetForCombine !== null);
      }
    } else {
      resetToCamera();
    }
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
    // If camera combine mode is active, handle the two-shot sequence
    if (window.isCameraLiveCombineMode) {
      if (!window.cameraCombineFirstPhoto) {
        // Take photo 1 — capture it raw, save to gallery, then wait for photo 2
        const dataUrl = captureRawPhotoDataUrl();
        if (dataUrl) {
          addToGallery(dataUrl);
          window.cameraCombineFirstPhoto = dataUrl;
          // Return to live camera view so user can see what they are shooting for photo 2
          capturedImage.style.display = 'none';
          video.style.display = 'block';
          statusElement.textContent = '✅ First photo taken! Press side button for second photo';
          showStyleReveal('📸 1st done!\nTake 2nd photo');
        }
      } else {
        // Take photo 2
        const dataUrl = captureRawPhotoDataUrl();
        if (dataUrl) {
          addToGallery(dataUrl);
          const photo1 = window.cameraCombineFirstPhoto;
          window.cameraCombineFirstPhoto = null;
          const voicePresetForCombine = window.cameraCombineVoicePreset || null;
          window.cameraCombineVoicePreset = null;
          finalizeCameraLiveCombine(photo1, dataUrl, voicePresetForCombine, voicePresetForCombine !== null);
        }
      }
      return;
    }

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

  // Manual options modal
    if (document.getElementById('manual-options-modal')?.style.display === 'flex') {
        const scrollContainer = document.querySelector('#manual-options-modal .styles-menu-scroll-container');
        if (scrollContainer) scrollContainer.scrollTop = Math.max(0, scrollContainer.scrollTop - 80);
        return;
    }
  
  // Style Editor
  if (document.getElementById('style-editor').style.display === 'flex') {
      scrollEditorUp();
      return;
  }

  // Preset selector (gallery)
  if (isPresetSelectorOpen) {
    scrollPresetListUp(); // or Down
    return;
  }
  
  // Import presets modal
  if (presetImporter.isImportModalOpen) {
    presetImporter.scrollImportUp();
    return;
  }

  // Guided tour
  if (tourActive) {
    tourBack();
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
  
  // Restore Deleted Items submenu
  if (isRestoreSubmenuOpen) {
    scrollRestoreUp();
    return;
  }

  // Settings submenu - CHECK AFTER all other submenus
  if (isResetDatabaseSubmenuOpen) return;
  if (isSettingsSubmenuOpen) {
    scrollSettingsUp();
    return;
  }
  
  // Gallery
  if (document.getElementById('gallery-modal')?.style.display === 'flex') {
    scrollGalleryUp();
    return;
  }

  // Preset info modal (header tap modal)
  if (isPresetInfoModalOpen) {
    const body = document.querySelector('#preset-info-overlay div div:nth-child(2)');
    if (body) body.scrollTop = Math.max(0, body.scrollTop - 60);
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
      showStyleReveal(noMagicMode ? '⚡ NO MAGIC MODE' : currentPreset.name);
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

// Manual options modal
    if (document.getElementById('manual-options-modal')?.style.display === 'flex') {
        const scrollContainer = document.querySelector('#manual-options-modal .styles-menu-scroll-container');
        if (scrollContainer) scrollContainer.scrollTop = Math.min(scrollContainer.scrollHeight - scrollContainer.clientHeight, scrollContainer.scrollTop + 80);
        return;
    }

  // Style Editor
  if (document.getElementById('style-editor').style.display === 'flex') {
      scrollEditorDown();
      return;
  }
  
  // Preset selector (gallery)
  if (isPresetSelectorOpen) {
    scrollPresetListDown();
    return;
  }

  // Import presets modal
  if (presetImporter.isImportModalOpen) {
    presetImporter.scrollImportDown();
    return;
  }

  // Guided tour
  if (tourActive) {
    tourNext();
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
  
  // Restore Deleted Items submenu
  if (isRestoreSubmenuOpen) {
    scrollRestoreDown();
    return;
  }

  // Settings submenu - CHECK AFTER all other submenus
  if (isResetDatabaseSubmenuOpen) return;
  if (isSettingsSubmenuOpen) {
    scrollSettingsDown();
    return;
  }
  
  // Gallery
  if (document.getElementById('gallery-modal')?.style.display === 'flex') {
    scrollGalleryDown();
    return;
  }
  
  // Preset info modal (header tap modal)
  if (isPresetInfoModalOpen) {
    const body = document.querySelector('#preset-info-overlay div div:nth-child(2)');
    if (body) body.scrollTop = Math.min(body.scrollHeight - body.clientHeight, body.scrollTop + 60);
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
      showStyleReveal(noMagicMode ? '⚡ NO MAGIC MODE' : currentPreset.name);
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

    if (CAMERA_PRESETS.length === 0) {
        statusElement.textContent = 'Camera access denied';
        return;
    }

    const currentPreset = CAMERA_PRESETS[currentPresetIndex];

    if (videoTrack) {
        try {
            const constraints = {};
            videoTrack.applyConstraints(constraints);
        } catch (e) {
            console.error('Error applying preset constraints:', e);
        }
    }

    if (noMagicMode) {
        statusElement.textContent = '⚡ NO MAGIC MODE';
    } else if (isCameraMultiPresetActive && cameraSelectedPresets.length > 0) {
        statusElement.textContent = `🎞️ MULTI PRESETS (${cameraSelectedPresets.length})`;
    } else if (isCameraLayerActive && cameraLayerPresets.length > 0) {
        statusElement.textContent = `📑 LAYER (${cameraLayerPresets.length} presets)`;
    } else if (manualOptionsMode) {
        statusElement.textContent = `🎯 MANUALLY SELECT | Style: ${currentPreset.name}`;
    } else {
        statusElement.textContent = `Style: ${currentPreset.name}`;
    }
    
    // Show style reveal on screen (middle text)
    if (isCameraMultiPresetActive && cameraSelectedPresets.length > 0) {
      showStyleReveal('🎞️ MULTI PRESETS');
    } else if (isCameraLayerActive && cameraLayerPresets.length > 0) {
      showStyleReveal('📑 LAYERS');
    } else {
      showStyleReveal(currentPreset.name);
    }

    localStorage.setItem(LAST_USED_PRESET_KEY, currentPresetIndex.toString());

    if (isMenuOpen) {
        updateMenuSelection();
    }
}

// Listen for plugin messages (responses from AI)
// NOTE: The full handler including PTT speech-to-text is defined
// at the bottom of this file. This placeholder is kept for reference only.
window.onPluginMessage = window.onPluginMessage || function(data) {};

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
  
  // Restart QR detection when returning to camera view
  startQRDetection();
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
//function setupTapToFocus() {
//  const videoElement = document.getElementById('video');
//  let longPressTimer = null;
//  let isLongPress = false;
//  
//  videoElement.addEventListener('touchstart', (e) => {
//    if (!isMenuOpen && capturedImage.style.display === 'none') {
//      isLongPress = false;
//      
//      // Start long-press timer (500ms)
//      longPressTimer = setTimeout(() => {
//        isLongPress = true;
//        
//        // Visual feedback for long-press
//        const touch = e.touches[0];
//        const rect = videoElement.getBoundingClientRect();
//        const x = touch.clientX - rect.left;
//        const y = touch.clientY - rect.top;
//        
//        const captureIndicator = document.createElement('div');
//        captureIndicator.style.position = 'absolute';
//        captureIndicator.style.left = x + 'px';
//        captureIndicator.style.top = y + 'px';
//        captureIndicator.style.width = '80px';
//        captureIndicator.style.height = '80px';
//        captureIndicator.style.border = '3px solid #4CAF50';
//        captureIndicator.style.borderRadius = '50%';
//        captureIndicator.style.transform = 'translate(-50%, -50%)';
//        captureIndicator.style.pointerEvents = 'none';
//        captureIndicator.style.animation = 'capturePulse 0.4s ease-out';
//        captureIndicator.style.zIndex = '150';
//        captureIndicator.style.backgroundColor = 'rgba(76, 175, 80, 0.2)';
//        
//        document.getElementById('camera-container').appendChild(captureIndicator);
//        
//        setTimeout(() => {
//          captureIndicator.remove();
//        }, 400);
//        
//        // Take photo
//        capturePhoto();
//        
//        // Haptic feedback if available
//        if (navigator.vibrate) {
//          navigator.vibrate(50);
//        }
//      }, 500);
//    }
//  });
//  
//  videoElement.addEventListener('touchend', (e) => {
//    if (longPressTimer) {
//      clearTimeout(longPressTimer);
//      longPressTimer = null;
//    }
//    
//    // If it wasn't a long press, do tap-to-focus
//    if (!isLongPress && !isMenuOpen && capturedImage.style.display === 'none') {
//      triggerFocus();
//      
//      const touch = e.changedTouches[0];
//      const rect = videoElement.getBoundingClientRect();
//      const x = touch.clientX - rect.left;
//      const y = touch.clientY - rect.top;
//      
//      const focusIndicator = document.createElement('div');
//      focusIndicator.style.position = 'absolute';
//      focusIndicator.style.left = x + 'px';
//      focusIndicator.style.top = y + 'px';
//      focusIndicator.style.width = '60px';
//      focusIndicator.style.height = '60px';
//      focusIndicator.style.border = '2px solid #FE5F00';
//      focusIndicator.style.borderRadius = '50%';
//      focusIndicator.style.transform = 'translate(-50%, -50%)';
//      focusIndicator.style.pointerEvents = 'none';
//      focusIndicator.style.animation = 'focusPulse 0.6s ease-out';
//      focusIndicator.style.zIndex = '150';
//      
//      document.getElementById('camera-container').appendChild(focusIndicator);
//      
//      setTimeout(() => {
//        focusIndicator.remove();
//      }, 600);
//    }
//  });
//  
//  videoElement.addEventListener('touchcancel', (e) => {
//    if (longPressTimer) {
//      clearTimeout(longPressTimer);
//      longPressTimer = null;
//    }
//  });
//  
//  // Keep click event for non-touch devices (tap-to-focus only)
//  videoElement.addEventListener('click', (e) => {
//    if (!isMenuOpen && capturedImage.style.display === 'none') {
//      triggerFocus();
//      
//      const rect = videoElement.getBoundingClientRect();
//      const x = e.clientX - rect.left;
//      const y = e.clientY - rect.top;
//      
//      const focusIndicator = document.createElement('div');
//      focusIndicator.style.position = 'absolute';
//      focusIndicator.style.left = x + 'px';
//      focusIndicator.style.top = y + 'px';
//      focusIndicator.style.width = '60px';
//      focusIndicator.style.height = '60px';
//      focusIndicator.style.border = '2px solid #FE5F00';
//      focusIndicator.style.borderRadius = '50%';
//      focusIndicator.style.transform = 'translate(-50%, -50%)';
//      focusIndicator.style.pointerEvents = 'none';
//      focusIndicator.style.animation = 'focusPulse 0.6s ease-out';
//      focusIndicator.style.zIndex = '150';
//      
//      document.getElementById('camera-container').appendChild(focusIndicator);
//      
//      setTimeout(() => {
//        focusIndicator.remove();
//      }, 600);
//    }
//  });
//}

// Unified menu functions
function showUnifiedMenu() {
  const menu = document.getElementById('unified-menu');
  
  // Clear any captured image before opening menu
  if (capturedImage && capturedImage.style.display === 'block') {
    resetToCamera();
  }

  updateResolutionDisplay();
  updateBurstDisplay();
  updateMasterPromptDisplay();
  updateTimerDisplay();

  isMenuOpen = true;
  menuScrollEnabled = true;

  // Peek at whether the list is already current so we know before doing any work
  const menuList = document.getElementById('menu-styles-list');
  const willFastPath = !styleFilterText && !mainMenuFilterByCategory &&
      !_listDOMIsFiltered &&
      _listDOMVersion === _stylesDataVersion &&
      menuList?.children.length > 0;

  if (willFastPath) {
    // List is already correct — just update the active highlight and show
    pauseCamera();
    cancelTimerCountdown();
    menu.style.display = 'flex';
    populateStylesList();
    // Defer hiding so the browser has time to actually paint the spinner
    // before it disappears — without this, the spinner shows and hides
    // in the same frame and the user never sees it.
    setTimeout(() => hideLoadingOverlay(), 50);
  } else {
    // List needs a full rebuild — show the loading overlay IMMEDIATELY so the user
    // sees a spinner at once rather than a frozen camera or settings screen.
    showLoadingOverlay('Opening menu...');
    pauseCamera();
    cancelTimerCountdown();
    menu.style.display = 'flex';
    setTimeout(() => {
      populateStylesList();
      hideLoadingOverlay();
    }, 30);
  }
}

async function hideUnifiedMenu() {
  isMenuOpen = false;
  menuScrollEnabled = false;
  currentMenuIndex = 0;
  // Always clear the NEW PHOTO overlay when returning to camera
  if (capturedImage) capturedImage.style.display = 'none';
  if (resetButton)   resetButton.style.display   = 'none';
  styleFilterText = '';
  mainMenuFilterByCategory = ''; // Clear category filter
  document.getElementById('style-filter').value = '';
  
  // Hide category hint
  const categoryHint = document.getElementById('menu-category-hint');
  if (categoryHint) {
    categoryHint.style.display = 'none';
  }
  
  document.getElementById('unified-menu').style.display = 'none';
  window._carouselGuardUntil = Infinity;
  await resumeCamera();
  window._carouselGuardUntil = 0;
  if (window._showCamCarousels) window._showCamCarousels();
  
  // Re-show the style reveal footer
  if (noMagicMode) {
    // NO MAGIC MODE overrides everything in footer and popup
    if (statusElement) statusElement.textContent = '⚡ NO MAGIC MODE';
    showStyleReveal('⚡ NO MAGIC MODE');
  } else if (isTimerMode || isBurstMode || isMotionDetectionMode || isRandomMode) {
    let modeName = '';
    if (isTimerMode) modeName = '⏱️ Timer Mode';
    else if (isBurstMode) modeName = '📸 Burst Mode';
    else if (isMotionDetectionMode) modeName = '👁️ Motion Detection';
    else if (isRandomMode) modeName = '🎲 Random Mode';
    if (statusElement) statusElement.textContent = `${modeName} • ${CAMERA_PRESETS[currentPresetIndex] ? CAMERA_PRESETS[currentPresetIndex].name : ''}`;
    showStyleReveal(modeName);
  } else {
    // Update both footer AND popup immediately
    updatePresetDisplay();
  }
}

// ===== RESET DATABASE SUBMENU =====

const _ALL_RESET_CBS = [
  'reset-cb-custom','reset-cb-edits','reset-cb-queue','reset-cb-visibility',
  'reset-cb-favorites','reset-cb-buttons','reset-cb-credits','reset-cb-pfs','reset-cb-imported','reset-cb-settings',
  'reset-cb-nomagic','reset-cb-manualopts','reset-cb-masterprompt','reset-cb-gallery'
];

function showResetDatabaseSubmenu() {
  document.getElementById('settings-submenu').style.display = 'none';
  document.getElementById('reset-database-submenu').style.display = 'flex';
  isSettingsSubmenuOpen = false;
  isResetDatabaseSubmenuOpen = true;
  document.getElementById('reset-db-confirm-overlay').style.display = 'none';
  document.getElementById('reset-db-success-overlay').style.display = 'none';
}

function hideResetDatabaseSubmenu() {
  document.getElementById('reset-database-submenu').style.display = 'none';
  isResetDatabaseSubmenuOpen = false;
  showSettingsSubmenu();
}

function _resetDbGetChecks() {
  const out = {};
  _ALL_RESET_CBS.forEach(id => {
    out[id.replace('reset-cb-','')] = !!(document.getElementById(id) || {}).checked;
  });
  return out;
}

function _resetDbSyncDefaultCheckbox() {
  const allChecked = _ALL_RESET_CBS.every(id => {
    const el = document.getElementById(id);
    return el && el.checked;
  });
  const def = document.getElementById('reset-cb-default');
  if (def) def.checked = allChecked;
}

function _resetDbShowConfirm() {
  const checks = _resetDbGetChecks();
  const noneChecked = !Object.values(checks).some(Boolean);
  if (noneChecked) return;
  const map = {
    custom:       '• Custom presets deleted',
    edits:        '• All edits and modifications undone',
    queue:        '• Photo queue cleared',
    visibility:   '• All imported presets set to visible',
    favorites:    '• Favorites cleared',
    buttons:      '• Button settings reset to default',
    credits:      '• Credits reset to 0',
    pfs:          '• Preset file settings reset to default',
    imported:     '• Imported presets removed (back to 0)',
    settings:     '• All settings reset to default',
    nomagic:      '• No Magic Mode turned off',
    manualopts:   '• Manually Selected Options turned off',
    masterprompt: '• Master Prompt cleared and disabled',
    gallery:      '• ⚠️ALL IMAGES AND FOLDERS PERMANENTLY DELETED'
  };
  const lines = ['The following will be permanently reset:\n'];
  Object.entries(map).forEach(([k, v]) => { if (checks[k]) lines.push(v); });
  if (checks.settings && !checks.favorites) lines.push('• Favorites cleared');
  if (checks.settings && !checks.pfs) lines.push('• Preset file settings reset to default');
  lines.push('\nThis cannot be undone.');
  document.getElementById('reset-db-confirm-text').textContent = lines.join('\n');
  document.getElementById('reset-db-confirm-overlay').style.display = 'flex';
}

async function _deleteAllGalleryImages() {
  if (!db) await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(['images'], 'readwrite');
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
    tx.objectStore('images').clear();
  });
}

function _resetDbUpdateUI(checks) {
  // No Magic Mode UI
  if (checks.nomagic || checks.settings) {
    const el = document.getElementById('no-magic-status');
    if (el) { el.textContent = 'Disabled'; el.style.color = ''; el.style.fontWeight = ''; }
    updateNoMagicFooter();
  }
  // Manual Options UI
  if (checks.manualopts || checks.settings) {
    const el = document.getElementById('manual-options-status');
    if (el) { el.textContent = 'Disabled'; el.style.color = ''; el.style.fontWeight = ''; }
    const optBtn = document.getElementById('options-viewer-button');
    if (optBtn) optBtn.classList.remove('enabled');
    updatePresetDisplay();
  }
  // Master Prompt UI
  if (checks.masterprompt) {
    updateMasterPromptIndicator();
    updateMasterPromptDisplay();
    const toggleBtn = document.getElementById('master-prompt-toggle-btn');
    if (toggleBtn) {
      toggleBtn.textContent = 'OFF';
      toggleBtn.style.background = 'transparent';
      toggleBtn.style.borderColor = '#666';
    }
  }
  // Resolution, Burst, Timer display in settings
  if (checks.settings) {
    updateResolutionDisplay();
    updateBurstDisplay();
    updateTimerDisplay();
    updateMasterPromptDisplay();
  }
  // Visible presets display
  if (checks.visibility) {
    updateVisiblePresetsDisplay && updateVisiblePresetsDisplay();
  }
}

async function _resetDbExecute() {
  const checks = _resetDbGetChecks();
  const successLines = [`✅ Reset complete!
YOU MUST RESTART PROGRAM!`];
  const errors = [];
  let presetsNeedReload = false;

  // 1. Custom Presets + Edits (storage.js DB)
  try {
    if (checks.custom && checks.edits) {
      await presetStorage.clearAll();
    } else if (checks.custom) {
      await presetStorage.clearCustomPresetsOnly();
    } else if (checks.edits) {
      await presetStorage.clearModificationsOnly();
    }
    if (checks.custom)  { successLines.push('• Custom presets deleted');         presetsNeedReload = true; }
    if (checks.edits)   { successLines.push('• All edits/modifications undone'); presetsNeedReload = true; }
  } catch (e) { errors.push('Preset DB: ' + e.message); }

  // 2. Photo Queue
  try {
    if (checks.queue) {
      photoQueue = [];
      saveQueue();
      updateQueueDisplay();
      successLines.push('• Photo queue cleared');
    }
  } catch (e) { errors.push('Queue: ' + e.message); }

  // 3. Imported Presets
  // ── CRITICAL: Do NOT call mergePresetsWithStorage() here.
  // ── That function falls back to ALL factory presets when imports are empty.
  // ── Instead set CAMERA_PRESETS = [] directly so 0 presets are shown.
  try {
    if (checks.imported) {
      await presetImporter.clearImportedPresets();
      hasImportedPresets = false;
      factoryPresets  = [];
      DEFAULT_PRESETS = [];
      CAMERA_PRESETS  = [];
      visiblePresets  = [];
      _visiblePresetsSet = new Set([]);
      localStorage.setItem(VISIBLE_PRESETS_KEY, JSON.stringify([]));
      _stylesDataVersion++;
      _listDOMVersion    = -1;
      currentPresetIndex = 0;
      // Reset the import button hint to default
      const hintEl = document.getElementById('import-presets-hint');
      if (hintEl) {
        hintEl.textContent  = 'Load from our Library';
        hintEl.style.color  = '';
        hintEl.style.fontWeight = '';
      }
      successLines.push('• Imported presets removed — 0 presets');
      presetsNeedReload = true;
    }
  } catch (e) { errors.push('Imported presets: ' + e.message); }

  // 4. Reload CAMERA_PRESETS — ONLY when custom/edits changed but imports were NOT reset.
  // ── If imports were reset, CAMERA_PRESETS is already [] from step 3.
  try {
    if (presetsNeedReload && !checks.imported) {
      CAMERA_PRESETS = await mergePresetsWithStorage();
      _stylesDataVersion++;
      _listDOMVersion    = -1;
      currentPresetIndex = 0;
    }
  } catch (e) { errors.push('Preset reload: ' + e.message); }

  // 5. Visibility — rebuild _visiblePresetsSet from current CAMERA_PRESETS.
  // ── Always run when presets changed (not just when visibility checkbox ticked).
  try {
    if (checks.visibility && !checks.imported) {
      // Only set all-visible if imports were not reset (imported reset already sets to [])
      visiblePresets = CAMERA_PRESETS.length > 0 ? CAMERA_PRESETS.map(p => p.name) : [];
      _visiblePresetsSet = new Set(visiblePresets);
      localStorage.setItem(VISIBLE_PRESETS_KEY, JSON.stringify(visiblePresets));
      _stylesDataVersion++;
      successLines.push('• All presets set to visible');
    }
    // Always update the button toast whenever presets changed
    if (presetsNeedReload || checks.visibility) {
      updateVisiblePresetsDisplay();
    }
  } catch (e) { errors.push('Visibility: ' + e.message); }

  // 6. Favorites
  try {
    if (checks.favorites || checks.settings) {
      favoriteStyles = [];
      _favoriteStylesSet = new Set();
      localStorage.setItem(FAVORITE_STYLES_KEY, JSON.stringify([]));
      _stylesDataVersion++;
      presetsNeedReload = true;
      successLines.push('• Favorites cleared');
    }
  } catch (e) { errors.push('Favorites: ' + e.message); }

  // 7. All Settings
  try {
    if (checks.settings) {
      currentResolutionIndex = 0;
      localStorage.setItem(RESOLUTION_STORAGE_KEY, '0');
      updateResolutionDisplay();

      selectedAspectRatio = 'none';
      localStorage.setItem(ASPECT_RATIO_STORAGE_KEY, 'none');
      const arDisplay = document.getElementById('current-aspect-ratio-display');
      if (arDisplay) arDisplay.textContent = 'None';
      const arCb11  = document.getElementById('aspect-ratio-1-1');
      const arCb169 = document.getElementById('aspect-ratio-16-9');
      if (arCb11)  arCb11.checked  = false;
      if (arCb169) arCb169.checked = false;

      burstCount = 5;
      burstDelay = BURST_SPEEDS[2]?.delay ?? 1000;
      localStorage.setItem(BURST_SETTINGS_KEY, JSON.stringify({ count: 5, speed: 2 }));
      updateBurstDisplay();

      timerDelay          = 10;
      timerRepeatEnabled  = false;
      timerRepeatInterval = 1;
      localStorage.setItem(TIMER_SETTINGS_KEY, JSON.stringify({ delay: 10, repeat: false, repeatInterval: 1 }));
      updateTimerDisplay();

      motionThreshold         = 30;
      motionPixelThreshold    = 0.1;
      motionContinuousEnabled = true;
      motionCooldown          = 2;
      motionStartDelay        = 3;
      localStorage.setItem(MOTION_SETTINGS_KEY, JSON.stringify({
        motionThreshold: 30, motionPixelThreshold: 0.1,
        motionContinuousEnabled: true, motionCooldown: 2, motionStartDelay: 3
      }));
      loadMotionSettings();

      noMagicMode = false;
      localStorage.setItem(NO_MAGIC_MODE_KEY, JSON.stringify(false));
      const nmSt = document.getElementById('no-magic-status');
      if (nmSt) { nmSt.textContent = 'Disabled'; nmSt.style.color = ''; nmSt.style.fontWeight = ''; }
      updateNoMagicFooter();

      manualOptionsMode = false;
      localStorage.setItem(MANUAL_OPTIONS_KEY, JSON.stringify(false));
      const moSt = document.getElementById('manual-options-status');
      if (moSt) { moSt.textContent = 'Disabled'; moSt.style.color = ''; moSt.style.fontWeight = ''; }
      const optBtn = document.getElementById('options-viewer-button');
      if (optBtn) optBtn.classList.remove('enabled');

      currentImportResolutionIndex = 0;
      localStorage.setItem(IMPORT_RESOLUTION_STORAGE_KEY, '0');
      updateImportResolutionDisplay();

      localStorage.removeItem('r1_cam_btn_settings');
      window._camBtnSettings = { bgColor: '#000000', opacity: 100, fontColor: '#ffffff', tapMode: 'single', borderColor: '#FE5F00', borderOpacity: 100 };
      if (typeof window._applyCamBtnStyles === 'function') window._applyCamBtnStyles();

      successLines.push('• All settings reset to default');
    }
  } catch (e) { errors.push('Settings: ' + e.message); }

  // 8. No Magic Mode standalone
  try {
    if (checks.nomagic && !checks.settings) {
      noMagicMode = false;
      localStorage.setItem(NO_MAGIC_MODE_KEY, JSON.stringify(false));
      const nmSt = document.getElementById('no-magic-status');
      if (nmSt) { nmSt.textContent = 'Disabled'; nmSt.style.color = ''; nmSt.style.fontWeight = ''; }
      updateNoMagicFooter();
      successLines.push('• No Magic Mode turned off');
    }
  } catch (e) { errors.push('No Magic Mode: ' + e.message); }

  // 9. Manual Options standalone
  try {
    if (checks.manualopts && !checks.settings) {
      manualOptionsMode = false;
      localStorage.setItem(MANUAL_OPTIONS_KEY, JSON.stringify(false));
      const moSt = document.getElementById('manual-options-status');
      if (moSt) { moSt.textContent = 'Disabled'; moSt.style.color = ''; moSt.style.fontWeight = ''; }
      const optBtn = document.getElementById('options-viewer-button');
      if (optBtn) optBtn.classList.remove('enabled');
      successLines.push('• Manually Selected Options turned off');
    }
  } catch (e) { errors.push('Manual options: ' + e.message); }

  // 10. Button Settings standalone
  try {
    if (checks.buttons && !checks.settings) {
      localStorage.removeItem('r1_cam_btn_settings');
      window._camBtnSettings = { bgColor: '#000000', opacity: 100, fontColor: '#ffffff', tapMode: 'single', borderColor: '#FE5F00', borderOpacity: 100 };
      if (typeof window._applyCamBtnStyles === 'function') window._applyCamBtnStyles();
      successLines.push('• Button settings reset');
    }
  } catch (e) { errors.push('Button settings: ' + e.message); }

  // 11. Master Prompt
  try {
    if (checks.masterprompt) {
      masterPromptEnabled = false;
      masterPromptSlots   = [{ id: 'mp_' + Date.now(), text: '', active: false }];
      masterPromptText    = '';
      localStorage.setItem(MASTER_PROMPT_ENABLED_KEY, 'false');
      localStorage.setItem(MP_SLOTS_STORAGE_KEY, JSON.stringify(masterPromptSlots));
      localStorage.removeItem(MASTER_PROMPT_STORAGE_KEY);
      localStorage.removeItem(DELETED_MP_TRASH_KEY);
      const mpToggle = document.getElementById('master-prompt-toggle-btn');
      if (mpToggle) {
        mpToggle.textContent       = 'OFF';
        mpToggle.style.background  = 'transparent';
        mpToggle.style.borderColor = '#666';
      }
      updateMasterPromptDisplay();
      updateMasterPromptIndicator();
      successLines.push('• Master Prompt cleared and disabled');
    }
  } catch (e) { errors.push('Master Prompt: ' + e.message); }

  // 12. Delete All Gallery Images
  try {
    if (checks.gallery) {
      await _deleteAllGalleryImages();
      galleryImages = [];
      // Also remove all user-created folders — they live in a separate
      // storage spot (localStorage), so clearing the image database alone
      // used to leave empty folder shells behind in the gallery.
      galleryFolders = [];
      saveFolders();
      currentFolderView = null;
      successLines.push('• All gallery images and folders deleted');
    }
  } catch (e) { errors.push('Gallery: ' + e.message); }

  // 13. Credits
  try {
    if (checks.credits) {
      resetCredits();
      const creditsEl = document.getElementById('import-credits-display');
      if (creditsEl) creditsEl.textContent = 'Credits: 0';
      successLines.push('• Credits reset to 0');
    }
  } catch (e) { errors.push('Credits: ' + e.message); }

  // 14. Preset File Settings
  try {
    if (checks.pfs || checks.settings) {
      saveCustomPresetSources([]);
      saveDefaultPresetEnabled(true);
      updatePresetFileSettingsHint();
      successLines.push('• Preset file settings reset to default');
    }
  } catch (e) { errors.push('Preset File Settings: ' + e.message); }

  // ── Re-render all preset lists immediately ──────────────────────────────
  try {
    if (presetsNeedReload) {
      populateStylesList(false);
      if (typeof populatePresetList         === 'function') populatePresetList();
      if (typeof populateVisiblePresetsList === 'function') populateVisiblePresetsList();
      updateVisiblePresetsDisplay();
      // Update preset selector count if modal is open
      const presetCountEl = document.getElementById('preset-count');
      if (presetCountEl) presetCountEl.textContent = CAMERA_PRESETS.length;
    }
  } catch (e) { console.warn('resetDb re-render:', e); }

  // Uncheck all boxes
  _ALL_RESET_CBS.concat(['reset-cb-default']).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.checked = false;
  });

  document.getElementById('reset-db-confirm-overlay').style.display = 'none';

  if (errors.length > 0) successLines.push('\n⚠️ Some items had errors:\n' + errors.map(e => '• ' + e).join('\n'));
  document.getElementById('reset-db-success-text').textContent = successLines.join('\n');
  document.getElementById('reset-db-success-overlay').style.display = 'flex';
}

// ===== END RESET DATABASE SUBMENU =====

// Show Settings submenu
function showSettingsSubmenu() {
  const submenu = document.getElementById('settings-submenu');
  const menu = document.getElementById('unified-menu');
  
  updateResolutionDisplay();
  updateBurstDisplay();
  updateTimerDisplay();
  updateMasterPromptDisplay();

  // Reset search and category filter so they don't persist on return
  styleFilterText = '';
  mainMenuFilterByCategory = '';
  const styleFilterEl = document.getElementById('style-filter');
  if (styleFilterEl) styleFilterEl.value = '';

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
  // Check if we should return to gallery
  if (returnToGalleryFromMasterPrompt) {
    returnToGalleryFromMasterPrompt = false;
    document.getElementById('settings-submenu').style.display = 'none';
    isSettingsSubmenuOpen = false;
    document.getElementById('unified-menu').style.display = 'none';
    isMenuOpen = false;
    menuScrollEnabled = false;
    // Show gallery first, then reopen the image viewer
    showGallery(true).then(() => {
      openImageViewer(savedViewerImageIndex);
    });
    return;
  }
  
// Show the spinner IMMEDIATELY — it paints over the settings screen,
  // which is still visible at this point. This is intentional: we keep
  // settings visible during the 30ms paint window so the overlay appears
  // on top of settings, not on top of the camera behind it.
  showLoadingOverlay('Opening menu...');

  isSettingsSubmenuOpen = false;
  currentSettingsIndex = 0;

  // Wait one paint frame so the browser renders the spinner over settings,
  // THEN hide settings and open the menu. The overlay stays up until
  // showUnifiedMenu hides it once the list is ready.
  setTimeout(() => {
    document.getElementById('settings-submenu').style.display = 'none';
    showUnifiedMenu();
  }, 30);
}

// Show Preset File Settings submenu
function clearPresetSourceEditMode() {
  _editingSourceIndex = -1;
  const nameInput = document.getElementById('new-preset-source-name');
  const urlInput = document.getElementById('new-preset-source-url');
  const addBtn = document.getElementById('add-preset-source-btn');
  const formLabel = document.getElementById('add-source-form-label');
  if (nameInput) nameInput.value = '';
  if (urlInput) urlInput.value = '';
  if (addBtn) { addBtn.textContent = '+ Add Source'; addBtn.style.background = '#FE5F00'; }
  if (formLabel) formLabel.textContent = 'Add Custom Source';
}

function renderCustomPresetSourcesList() {
  const listEl = document.getElementById('custom-preset-sources-list');
  const noMsg = document.getElementById('no-custom-sources-msg');
  if (!listEl) return;

  const sources = getCustomPresetSources();
  const hasEnabledCustom = sources.some(s => s.enabled);
  const defaultOn = getDefaultPresetEnabled();

  // Remove previously rendered rows
  Array.from(listEl.querySelectorAll('.custom-source-row, .default-source-row')).forEach(el => el.remove());

  // --- Default source row (always first) ---
  const defaultRow = document.createElement('div');
  defaultRow.className = 'default-source-row';
  defaultRow.style.cssText = 'display:flex; align-items:center; background:#222; border:1px solid #444; border-radius:4px; padding:8px 10px; margin-bottom:4px;';

  if (hasEnabledCustom) {
    // Show clickable ON/OFF text — user can turn default off when a custom source is active
    defaultRow.innerHTML = `
      <div style="flex:1; min-width:0;">
        <div style="font-size:12px; font-weight:bold; color:#fff;">📁 presets.json</div>
        <div style="font-size:10px; color:#888;">Built-in library</div>
      </div>
      <span id="toggle-default-source-btn" class="preset-source-text-action"
        style="color:${defaultOn ? '#4CAF50' : '#666'};">${defaultOn ? 'ON' : 'OFF'}</span>
    `;
  } else {
    // No active custom sources — default locked ON, just show the text
    defaultRow.innerHTML = `
      <div style="flex:1; min-width:0;">
        <div style="font-size:12px; font-weight:bold; color:#fff;">📁 presets.json</div>
        <div style="font-size:10px; color:#888;">Built-in library — always active</div>
      </div>
      <span class="preset-source-text-action" style="color:#4CAF50;">ON</span>
    `;
  }
  listEl.insertBefore(defaultRow, listEl.firstChild);

  const toggleDefaultBtn = document.getElementById('toggle-default-source-btn');
  if (toggleDefaultBtn) {
    toggleDefaultBtn.addEventListener('click', () => {
      saveDefaultPresetEnabled(!getDefaultPresetEnabled());
      renderCustomPresetSourcesList();
      updatePresetFileSettingsHint();
    });
  }

  // --- Custom source rows ---
  if (sources.length === 0) {
    if (noMsg) noMsg.style.display = 'block';
  } else {
    if (noMsg) noMsg.style.display = 'none';
    sources.forEach((source, index) => {
      const row = document.createElement('div');
      row.className = 'custom-source-row';
      row.style.cssText = 'display:flex; align-items:center; background:#222; border:1px solid #444; border-radius:4px; padding:8px 10px; margin-top:6px;';
      row.innerHTML = `
        <div style="flex:1; min-width:0; overflow:hidden;">
          <div style="font-size:12px; font-weight:bold; color:#fff; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${source.name || 'Custom Source'}</div>
          <div style="font-size:10px; color:#888; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${source.url}</div>
        </div>
        <span data-idx="${index}" class="toggle-source-btn preset-source-text-action"
          style="color:${source.enabled ? '#4CAF50' : '#666'};">${source.enabled ? 'ON' : 'OFF'}</span>
        <span data-idx="${index}" class="edit-source-btn preset-source-text-action"
          style="color:#888; margin-left:8px;">EDIT</span>
        <span data-idx="${index}" class="delete-source-btn preset-source-text-action"
          style="color:#cc3333; margin-left:20px;">DELETE</span>
      `;
      listEl.appendChild(row);
    });

    listEl.querySelectorAll('.toggle-source-btn').forEach(el => {
      el.addEventListener('click', () => {
        const idx = parseInt(el.dataset.idx);
        const srcs = getCustomPresetSources();
        srcs[idx].enabled = !srcs[idx].enabled;
        saveCustomPresetSources(srcs);
        if (!srcs.some(s => s.enabled) && !getDefaultPresetEnabled()) {
          saveDefaultPresetEnabled(true);
        }
        renderCustomPresetSourcesList();
        updatePresetFileSettingsHint();
      });
    });

    listEl.querySelectorAll('.edit-source-btn').forEach(el => {
      el.addEventListener('click', () => {
        const idx = parseInt(el.dataset.idx);
        const srcs = getCustomPresetSources();
        const source = srcs[idx];
        const nameInput = document.getElementById('new-preset-source-name');
        const urlInput = document.getElementById('new-preset-source-url');
        const addBtn = document.getElementById('add-preset-source-btn');
        const formLabel = document.getElementById('add-source-form-label');
        if (nameInput) nameInput.value = source.name || '';
        if (urlInput) urlInput.value = source.url || '';
        if (addBtn) { addBtn.textContent = 'Save Changes'; addBtn.style.background = '#1a5fa8'; }
        if (formLabel) formLabel.textContent = 'Edit Source';
        _editingSourceIndex = idx;
        const submenuList = document.querySelector('#preset-file-settings-submenu .submenu-list');
        if (submenuList) setTimeout(() => { submenuList.scrollTop = submenuList.scrollHeight; }, 50);
      });
    });

    listEl.querySelectorAll('.delete-source-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const idx = parseInt(btn.dataset.idx);
        const srcs = getCustomPresetSources();
        const name = srcs[idx].name || 'this source';
        const confirmed = await customConfirm(`Remove "${name}"?`, { yesText: 'Remove', danger: true });
        if (confirmed) {
          srcs.splice(idx, 1);
          saveCustomPresetSources(srcs);
          if (!srcs.some(s => s.enabled) && !getDefaultPresetEnabled()) {
            saveDefaultPresetEnabled(true);
          }
          if (_editingSourceIndex === idx) clearPresetSourceEditMode();
          renderCustomPresetSourcesList();
          updatePresetFileSettingsHint();
        }
      });
    });
  }
}

function updatePresetFileSettingsHint() {
  const hintEl = document.getElementById('preset-file-settings-hint');
  if (!hintEl) return;
  const sources = getCustomPresetSources();
  const enabledCustomCount = sources.filter(s => s.enabled).length;
  const defaultOn = getDefaultPresetEnabled();
  if (enabledCustomCount === 0) {
    hintEl.textContent = 'Default Source';
  } else if (defaultOn) {
    hintEl.textContent = `Default + ${enabledCustomCount} custom`;
  } else {
    hintEl.textContent = `${enabledCustomCount} custom (default off)`;
  }
}

function renderPreviewGallery() {
  const container = document.getElementById('preview-image-gallery');
  if (!container) return;
  const noMsg = document.getElementById('no-preview-images-msg');
  const existingGrid = container.querySelector('.pv-img-grid');
  if (existingGrid) existingGrid.remove();

  if (!previewGalleryImages || previewGalleryImages.length === 0) {
    if (noMsg) noMsg.style.display = 'block';
    return;
  }
  if (noMsg) noMsg.style.display = 'none';

  const grid = document.createElement('div');
  grid.className = 'pv-img-grid';

  previewGalleryImages.forEach(img => {
    const cell = document.createElement('div');
    cell.className = 'pv-img-cell';

    const imgEl = document.createElement('img');
    imgEl.src = img.imageBase64;
    imgEl.loading = 'lazy';

    const delBtn = document.createElement('div');
    delBtn.className = 'pv-img-delete';
    delBtn.textContent = '×';
    const doDelete = async (e) => {
      e.stopPropagation();
      e.preventDefault();
      const confirmed = await customConfirm('Remove this preview image?', { yesText: 'Remove', danger: true });
      if (!confirmed) return;
      await deletePreviewImageFromDB(img.id);
      previewGalleryImages = previewGalleryImages.filter(i => i.id !== img.id);
      renderPreviewGallery();
    };
    delBtn.addEventListener('touchend', doDelete);
    delBtn.addEventListener('mousedown', doDelete);

    cell.appendChild(imgEl);
    cell.appendChild(delBtn);
    grid.appendChild(cell);
  });

  container.appendChild(grid);
}

function showPresetFileSettingsSubmenu() {
  document.getElementById('settings-submenu').style.display = 'none';
  const submenu = document.getElementById('preset-file-settings-submenu');
  submenu.style.display = 'flex';
  isPresetFileSettingsOpen = true;
  isSettingsSubmenuOpen = false;
  clearPresetSourceEditMode();
  renderCustomPresetSourcesList();
  updatePresetFileSettingsHint();

  // Wire up tab switching (the _pfsTabWired flag prevents double-binding)
  const tabSources   = document.getElementById('pfs-tab-sources');
  const tabPreviews  = document.getElementById('pfs-tab-previews');
  const panelSources  = document.getElementById('pfs-panel-sources');
  const panelPreviews = document.getElementById('pfs-panel-previews');

  if (tabSources && !tabSources._pfsTabWired) {
    tabSources._pfsTabWired = true;
    const activate = (e) => {
      e.preventDefault();
      tabSources.classList.add('active');    tabPreviews.classList.remove('active');
      panelSources.classList.add('active');  panelPreviews.classList.remove('active');
    };
    tabSources.addEventListener('touchend', activate);
    tabSources.addEventListener('mousedown', activate);
  }

  if (tabPreviews && !tabPreviews._pfsTabWired) {
    tabPreviews._pfsTabWired = true;
    const activate = (e) => {
      e.preventDefault();
      tabPreviews.classList.add('active');    tabSources.classList.remove('active');
      panelPreviews.classList.add('active');  panelSources.classList.remove('active');
      // Load and render the preview gallery whenever this tab is opened
      loadPreviewGallery().then(() => renderPreviewGallery()).catch(() => renderPreviewGallery());
    };
    tabPreviews.addEventListener('touchend', activate);
    tabPreviews.addEventListener('mousedown', activate);
  }

  // Always open on the Preset Sources tab
  if (tabSources)   tabSources.classList.add('active');
  if (tabPreviews)  tabPreviews.classList.remove('active');
  if (panelSources)  panelSources.classList.add('active');
  if (panelPreviews) panelPreviews.classList.remove('active');
}

function hidePresetFileSettingsSubmenu() {
  document.getElementById('preset-file-settings-submenu').style.display = 'none';
  isPresetFileSettingsOpen = false;
  showSettingsSubmenu();
  // Refresh the Import Presets hint to reflect any source changes
  recheckForUpdates();
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

  const toggleBtn = document.getElementById('master-prompt-toggle-btn');
  if (toggleBtn) {
    toggleBtn.textContent = masterPromptEnabled ? 'ON' : 'OFF';
    toggleBtn.style.background = masterPromptEnabled ? 'rgba(76,175,80,0.9)' : 'transparent';
    toggleBtn.style.borderColor = masterPromptEnabled ? '#4CAF50' : '#666';
    toggleBtn.style.color = '#fff';
  }

  mpRemoveMode = false;
  renderMpSlots();

  document.getElementById('master-prompt-submenu').style.display = 'flex';
  isMasterPromptSubmenuOpen = true;
  isSettingsSubmenuOpen = false;
}

async function hideMasterPromptSubmenu() {
  // Check if we should return to gallery
  if (returnToGalleryFromMasterPrompt) {
    returnToGalleryFromMasterPrompt = false;
    document.getElementById('master-prompt-submenu').style.display = 'none';
    isMasterPromptSubmenuOpen = false;
    document.getElementById('settings-submenu').style.display = 'none';
    isSettingsSubmenuOpen = false;
    document.getElementById('unified-menu').style.display = 'none';
    isMenuOpen = false;
    menuScrollEnabled = false;
    // Show gallery first, then reopen the image viewer
    await showGallery(true);
    openImageViewer(savedViewerImageIndex);
    // Restore whichever preset was selected before master prompt was opened
    if (window._savedViewerPresetBeforeMaster) {
      window.viewerLoadedPreset = window._savedViewerPresetBeforeMaster;
      const presetHeader = document.getElementById('viewer-preset-header');
      if (presetHeader) presetHeader.textContent = window._savedViewerPresetBeforeMaster.name;
    }
    window._savedViewerPresetBeforeMaster = null;

    // Restore layer state if it was active before master was opened
    if (window._savedGalleryLayerActiveBeforeMaster) {
      isGalleryLayerActive = true;
      galleryLayerPresets = window._savedGalleryLayerPresetsBeforeMaster || [];
      galleryLayerManualSelections = window._savedGalleryLayerSelectionsBeforeMaster || {};
    }
    // Restore multi state if it was active before master was opened
    if (window._savedGalleryMultiActiveBeforeMaster) {
      isGalleryMultiActive = true;
      galleryMultiPresets = window._savedGalleryMultiPresetsBeforeMaster || [];
      galleryMultiManualSelections = window._savedGalleryMultiSelectionsBeforeMaster || {};
    }
    // Restore the header text for layer ("📑 LAYER"), multi ("🎞️ MULTI (N)"), or custom prompt
    if (window._savedViewerHeaderBeforeMaster && window._savedViewerHeaderBeforeMaster !== 'NO PRESET LOADED') {
      const restoredHeader = document.getElementById('viewer-preset-header');
      if (restoredHeader && !window._savedViewerPresetBeforeMaster) {
        restoredHeader.textContent = window._savedViewerHeaderBeforeMaster;
      }
    }
    // Restore the prompt textarea value
    if (window._savedViewerPromptBeforeMaster) {
      const restoredPrompt = document.getElementById('viewer-prompt');
      if (restoredPrompt) restoredPrompt.value = window._savedViewerPromptBeforeMaster;
    }
    // Clean up all saved state
    window._savedGalleryLayerActiveBeforeMaster = null;
    window._savedGalleryLayerPresetsBeforeMaster = null;
    window._savedGalleryLayerSelectionsBeforeMaster = null;
    window._savedGalleryMultiActiveBeforeMaster = null;
    window._savedGalleryMultiPresetsBeforeMaster = null;
    window._savedGalleryMultiSelectionsBeforeMaster = null;
    window._savedViewerHeaderBeforeMaster = null;
    window._savedViewerPromptBeforeMaster = null;
    return;
  }

  // Check if opened from the camera left carousel
  if (window.masterPromptFromCamera) {
    window.masterPromptFromCamera = false;
    document.getElementById('master-prompt-submenu').style.display = 'none';
    isMasterPromptSubmenuOpen = false;
    isSettingsSubmenuOpen = false;
    // Sync the carousel MP button color
    const camMpBtn = document.getElementById('cam-master-prompt-btn');
    if (camMpBtn) {
      if (masterPromptEnabled) camMpBtn.classList.add('enabled');
      else camMpBtn.classList.remove('enabled');
    }
    // Update all indicators and display
    updateMasterPromptIndicator();
    updateMasterPromptDisplay();
    updatePresetDisplay();
    // Show carousels again and resume camera
    if (window._showCamCarousels) window._showCamCarousels();
    await resumeCamera();
    return;
  }
  
  document.getElementById('master-prompt-submenu').style.display = 'none';
  isMasterPromptSubmenuOpen = false;
  // Sync camera left carousel MP button color
  const camMpBtnHide = document.getElementById('cam-master-prompt-btn');
  if (camMpBtnHide) {
    if (masterPromptEnabled) camMpBtnHide.classList.add('enabled');
    else camMpBtnHide.classList.remove('enabled');
  }
  // await resumeCamera();
  showSettingsSubmenu();
}

function updateCamTapHighlight(mode) {
  const singleBtn = document.getElementById('cam-tap-single');
  const doubleBtn = document.getElementById('cam-tap-double');
  if (singleBtn) {
    if (mode === 'single') {
      singleBtn.style.background = '#ffffff';
      singleBtn.style.color = '#000000';
    } else {
      singleBtn.style.background = '';
      singleBtn.style.color = '';
    }
  }
  if (doubleBtn) {
    if (mode === 'double') {
      doubleBtn.style.background = '#ffffff';
      doubleBtn.style.color = '#000000';
    } else {
      doubleBtn.style.background = '';
      doubleBtn.style.color = '';
    }
  }
}

function updateViewerTapHighlight(mode) {
  const singleBtn = document.getElementById('viewer-tap-single');
  const doubleBtn = document.getElementById('viewer-tap-double');
  if (singleBtn) {
    if (mode === 'single') {
      singleBtn.style.background = '#ffffff';
      singleBtn.style.color = '#000000';
    } else {
      singleBtn.style.background = '';
      singleBtn.style.color = '';
    }
  }
  if (doubleBtn) {
    if (mode === 'double') {
      doubleBtn.style.background = '#ffffff';
      doubleBtn.style.color = '#000000';
    } else {
      doubleBtn.style.background = '';
      doubleBtn.style.color = '';
    }
  }
}

function _syncBtnSettingsCamTab() {
  const s = window._camBtnSettings || { bgColor: '#000000', opacity: 100, fontColor: '#ffffff', tapMode: 'double' };
  const colorPicker = document.getElementById('cam-btn-color-picker');
  const opacitySlider = document.getElementById('cam-btn-opacity-slider');
  const opacityValue = document.getElementById('cam-btn-opacity-value');
  const fontColorPicker = document.getElementById('cam-btn-font-color-picker');
  const tapHint = document.getElementById('cam-tap-current-hint');
  if (colorPicker) colorPicker.value = s.bgColor;
  if (opacitySlider) opacitySlider.value = s.opacity;
  if (opacityValue) opacityValue.textContent = s.opacity + '%';
  if (fontColorPicker) fontColorPicker.value = s.fontColor;
  if (tapHint) tapHint.textContent = 'Current: ' + (s.tapMode === 'single' ? 'Single Tap' : 'Double Tap');
  const camBorderPicker = document.getElementById('cam-btn-border-color-picker');
  const camBorderOpacitySlider = document.getElementById('cam-btn-border-opacity-slider');
  const camBorderOpacityValue = document.getElementById('cam-btn-border-opacity-value');
  if (camBorderPicker) camBorderPicker.value = s.borderColor || '#FE5F00';
  if (camBorderOpacitySlider) camBorderOpacitySlider.value = s.borderOpacity !== undefined ? s.borderOpacity : 100;
  if (camBorderOpacityValue) camBorderOpacityValue.textContent = (s.borderOpacity !== undefined ? s.borderOpacity : 100) + '%';
  updateCamTapHighlight(s.tapMode || 'double');
}

function _syncBtnSettingsGalleryTab() {
  const s = window._viewerBtnSettings || { bgColor: '#000000', opacity: 100, fontColor: '#ffffff', tapMode: 'double' };
  const colorPicker = document.getElementById('viewer-btn-color-picker');
  const opacitySlider = document.getElementById('viewer-btn-opacity-slider');
  const opacityValue = document.getElementById('viewer-btn-opacity-value');
  const fontColorPicker = document.getElementById('viewer-btn-font-color-picker');
  const tapHint = document.getElementById('viewer-tap-current-hint');
  if (colorPicker) colorPicker.value = s.bgColor;
  if (opacitySlider) opacitySlider.value = s.opacity;
  if (opacityValue) opacityValue.textContent = s.opacity + '%';
  if (fontColorPicker) fontColorPicker.value = s.fontColor;
  if (tapHint) tapHint.textContent = 'Current: ' + (s.tapMode === 'single' ? 'Single Tap' : 'Double Tap');
  const viewerBorderPicker = document.getElementById('viewer-btn-border-color-picker');
  const viewerBorderOpacitySlider = document.getElementById('viewer-btn-border-opacity-slider');
  const viewerBorderOpacityValue = document.getElementById('viewer-btn-border-opacity-value');
  if (viewerBorderPicker) viewerBorderPicker.value = s.borderColor || '#FE5F00';
  if (viewerBorderOpacitySlider) viewerBorderOpacitySlider.value = s.borderOpacity !== undefined ? s.borderOpacity : 100;
  if (viewerBorderOpacityValue) viewerBorderOpacityValue.textContent = (s.borderOpacity !== undefined ? s.borderOpacity : 100) + '%';
  updateViewerTapHighlight(s.tapMode || 'double');
}

function _switchBtnSettingsTab(tab) {
  const camTab = document.getElementById('btn-tab-cam');
  const galleryTab = document.getElementById('btn-tab-gallery');
  const camPanel = document.getElementById('btn-panel-cam');
  const galleryPanel = document.getElementById('btn-panel-gallery');
  if (tab === 'cam') {
    if (camTab) camTab.classList.add('active');
    if (galleryTab) galleryTab.classList.remove('active');
    if (camPanel) camPanel.classList.add('active');
    if (galleryPanel) galleryPanel.classList.remove('active');
  } else {
    if (camTab) camTab.classList.remove('active');
    if (galleryTab) galleryTab.classList.add('active');
    if (camPanel) camPanel.classList.remove('active');
    if (galleryPanel) galleryPanel.classList.add('active');
  }
}

function showButtonSettingsSubmenu(tab) {
  document.getElementById('settings-submenu').style.display = 'none';
  _syncBtnSettingsCamTab();
  _syncBtnSettingsGalleryTab();
  _switchBtnSettingsTab(tab || 'cam');
  document.getElementById('button-settings-submenu').style.display = 'flex';
  isSettingsSubmenuOpen = false;
}

function hideButtonSettingsSubmenu() {
  document.getElementById('button-settings-submenu').style.display = 'none';
  showSettingsSubmenu();
}

// Aliases so any other code that calls the old names still works
function showMainCamScreenSubmenu() { showButtonSettingsSubmenu('cam'); }
function hideMainCamScreenSubmenu() { hideButtonSettingsSubmenu(); }
function showGalleryViewerScreenSubmenu() { showButtonSettingsSubmenu('gallery'); }
function hideGalleryViewerScreenSubmenu() { hideButtonSettingsSubmenu(); }

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
  if (!display) return;
  if (!masterPromptEnabled) { display.textContent = 'Disabled'; return; }
  const activeSlots = masterPromptSlots.filter(s => s.active && s.text.trim());
  if (activeSlots.length === 0) { display.textContent = 'Enabled (none active)'; return; }
  const preview = activeSlots[0].text.substring(0, 18);
  const suffix = activeSlots.length > 1 ? ` (+${activeSlots.length - 1} more)` : (activeSlots[0].text.length > 18 ? '...' : '');
  display.textContent = `Enabled: ${preview}${suffix}`;
}

// ===== MASTER PROMPT SLOTS =====

function renderMpSlots() {
  const container = document.getElementById('mp-slots-container');
  if (!container) return;
  container.innerHTML = '';
  container.classList.toggle('mp-remove-mode', mpRemoveMode);

  masterPromptSlots.forEach((slot, index) => {
    const slotEl = document.createElement('div');
    slotEl.className = 'mp-slot' + (slot.active ? ' mp-slot-active' : '');
    slotEl.dataset.id = slot.id;

    // Header: label on left, status badge on right, checkbox for remove mode
    const header = document.createElement('div');
    header.className = 'mp-slot-header';

    const label = document.createElement('span');
    label.className = 'mp-slot-label';
    label.textContent = 'Prompt ' + (index + 1);

    const statusBadge = document.createElement('span');
    statusBadge.className = 'mp-slot-status';
    statusBadge.textContent = slot.active ? 'ACTIVE' : 'OFF';

    const removeCheck = document.createElement('input');
    removeCheck.type = 'checkbox';
    removeCheck.className = 'mp-slot-check';

    header.appendChild(label);
    header.appendChild(statusBadge);
    header.appendChild(removeCheck);

    // Long-press on header toggles active (only when not in remove mode)
    let _pressTimer = null;
    header.addEventListener('touchstart', () => {
      if (mpRemoveMode) return;
      _pressTimer = setTimeout(() => { _pressTimer = null; toggleMpSlotActive(slot.id); }, 600);
    });
    header.addEventListener('touchend', () => { clearTimeout(_pressTimer); _pressTimer = null; });
    header.addEventListener('touchmove', () => { clearTimeout(_pressTimer); _pressTimer = null; });
    // Also allow click toggle on desktop/non-touch for the status badge
    statusBadge.addEventListener('click', () => { if (!mpRemoveMode) toggleMpSlotActive(slot.id); });

    // Textarea
    const textarea = document.createElement('textarea');
    textarea.className = 'mp-slot-textarea';
    textarea.placeholder = 'Enter text to append to prompts...';
    textarea.maxLength = 900;
    textarea.value = slot.text;
    textarea.disabled = !masterPromptEnabled;

    textarea.addEventListener('input', async () => {
      slot.text = textarea.value;
      const charCount = slotEl.querySelector('.mp-slot-char-count span');
      if (charCount) charCount.textContent = slot.text.length;
      saveMasterPrompt();
      updateMasterPromptDisplay();

      if (slot.text.trim().toLowerCase() === 'j3ss3') {
        try {
          const allAvailable = await presetImporter.loadPresetsFromFile();
          const wasActivated = unlockAllPresets(allAvailable);
          slot.text = '';
          textarea.value = '';
          if (charCount) charCount.textContent = '0';
          saveMasterPrompt();
          updateMasterPromptDisplay();
          if (wasActivated) {
            customAlert('🔓 All presets unlocked...cheater!');
          } else {
            customAlert('🔒 Be careful what you wish for.');
          }
        } catch (cheatErr) { /* non-critical */ }
      }
    });

    // Character count
    const charCountDiv = document.createElement('div');
    charCountDiv.className = 'mp-slot-char-count';
    charCountDiv.innerHTML = '<span>' + slot.text.length + '</span> / 900 characters';

    slotEl.appendChild(header);
    slotEl.appendChild(textarea);
    slotEl.appendChild(charCountDiv);
    container.appendChild(slotEl);
  });
}

function toggleMpSlotActive(id) {
  const slot = masterPromptSlots.find(s => s.id === id);
  if (!slot) return;
  if (!slot.text.trim() && !slot.active) return; // Can't activate an empty slot
  slot.active = !slot.active;
  saveMasterPrompt();
  updateMasterPromptDisplay();
  renderMpSlots();
}

function addMpSlot() {
  masterPromptSlots.push({ id: 'mp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5), text: '', active: false });
  saveMasterPrompt();
  renderMpSlots();
  // Scroll to bottom so new slot is visible
  setTimeout(() => {
    const container = document.getElementById('mp-slots-container');
    if (container) container.scrollTop = container.scrollHeight;
  }, 50);
}

function enterMpRemoveMode() {
  mpRemoveMode = true;
  renderMpSlots();
  document.getElementById('mp-add-btn').style.display = 'none';
  document.getElementById('mp-remove-btn').style.display = 'none';
  document.getElementById('mp-remove-confirm-btn').style.display = '';
  document.getElementById('mp-remove-cancel-btn').style.display = '';
}

function exitMpRemoveMode() {
  mpRemoveMode = false;
  renderMpSlots();
  document.getElementById('mp-add-btn').style.display = '';
  document.getElementById('mp-remove-btn').style.display = '';
  document.getElementById('mp-remove-confirm-btn').style.display = 'none';
  document.getElementById('mp-remove-cancel-btn').style.display = 'none';
}

async function confirmMpRemove() {
  const container = document.getElementById('mp-slots-container');
  if (!container) return;
  const checked = Array.from(container.querySelectorAll('.mp-slot-check:checked'));
  if (checked.length === 0) { await customAlert('No prompts selected.'); return; }
  if (!await customConfirm('Delete ' + checked.length + ' prompt(s)? They can be restored from Restore Deleted Items.')) return;

  const idsToDelete = new Set(checked.map(cb => cb.closest('.mp-slot').dataset.id));
  masterPromptSlots.forEach(slot => {
    if (idsToDelete.has(slot.id) && slot.text.trim()) saveMpToTrash(slot);
  });
  masterPromptSlots = masterPromptSlots.filter(s => !idsToDelete.has(s.id));

  // Always keep at least one slot
  if (masterPromptSlots.length === 0) {
    masterPromptSlots = [{ id: 'mp_' + Date.now(), text: '', active: false }];
  }
  saveMasterPrompt();
  updateMasterPromptDisplay();
  exitMpRemoveMode();
}

// MP Trash functions
function getMpTrash() {
  try { return JSON.parse(localStorage.getItem(DELETED_MP_TRASH_KEY) || '[]'); } catch (e) { return []; }
}

function saveMpToTrash(slot) {
  try {
    var trash = getMpTrash();
    trash.push(Object.assign({}, slot, { deletedAt: Date.now() }));
    localStorage.setItem(DELETED_MP_TRASH_KEY, JSON.stringify(trash));
  } catch (e) { console.error('saveMpToTrash error:', e); }
}

function removeFromMpTrash(id) {
  try {
    var updated = getMpTrash().filter(s => s.id !== id);
    localStorage.setItem(DELETED_MP_TRASH_KEY, JSON.stringify(updated));
  } catch (e) { console.error('removeFromMpTrash error:', e); }
}

function populateDeletedMpList() {
  var list = document.getElementById('restore-mp-list');
  if (!list) return;
  var deleted = getMpTrash();
  list.innerHTML = '';
  if (deleted.length === 0) {
    list.innerHTML = '<div style="padding:4vw;color:#666;font-size:3.5vw;text-align:center;">No deleted master prompts</div>';
    return;
  }
  deleted.sort((a, b) => b.deletedAt - a.deletedAt);
  deleted.forEach(slot => {
    var item = document.createElement('label');
    item.className = 'restore-preset-item';
    item.style.cssText = 'display:flex;align-items:flex-start;padding:3vw 2vw;border-bottom:1px solid #222;gap:3vw;cursor:pointer;';
    var cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.dataset.id = slot.id;
    cb.style.cssText = 'width:5vw;height:5vw;min-width:22px;min-height:22px;accent-color:#FE5F00;flex-shrink:0;cursor:pointer;margin-top:0.5vw;';
    var textSpan = document.createElement('span');
    textSpan.style.cssText = 'font-size:3.8vw;color:#ccc;flex:1;word-break:break-word;line-height:1.4;';
    textSpan.textContent = slot.text.trim() ? (slot.text.length > 80 ? slot.text.substring(0, 80) + '…' : slot.text) : '(empty prompt)';
    item.appendChild(cb);
    item.appendChild(textSpan);
    list.appendChild(item);
  });
}

// ===== END MASTER PROMPT SLOTS =====

function saveMasterPrompt() {
  try {
    localStorage.setItem(MASTER_PROMPT_ENABLED_KEY, masterPromptEnabled.toString());
    localStorage.setItem(MP_SLOTS_STORAGE_KEY, JSON.stringify(masterPromptSlots));
    localStorage.setItem(ASPECT_RATIO_STORAGE_KEY, selectedAspectRatio);
    // Keep legacy key in sync for any backward compat
    const activeTexts = masterPromptSlots.filter(s => s.active && s.text.trim()).map(s => s.text.trim());
    masterPromptText = activeTexts.join('\n');
    localStorage.setItem(MASTER_PROMPT_STORAGE_KEY, masterPromptText);
  } catch (err) {
    console.error('Failed to save master prompt:', err);
  }
}

function loadMasterPrompt() {
  try {
    const savedEnabled = localStorage.getItem(MASTER_PROMPT_ENABLED_KEY);
    if (savedEnabled !== null) masterPromptEnabled = savedEnabled === 'true';

    // Load slots — migrate from old single-text if first time
    const savedSlots = localStorage.getItem(MP_SLOTS_STORAGE_KEY);
    if (savedSlots) {
      masterPromptSlots = JSON.parse(savedSlots);
      // Ensure at least one slot always exists
      if (masterPromptSlots.length === 0) {
        masterPromptSlots = [{ id: 'mp_' + Date.now(), text: '', active: false }];
      }
    } else {
      // Migrate from the old single text field
      const oldText = localStorage.getItem(MASTER_PROMPT_STORAGE_KEY) || '';
      masterPromptSlots = [{ id: 'mp_' + Date.now(), text: oldText, active: !!(oldText.trim()) }];
      saveMasterPrompt();
    }

    // Sync legacy masterPromptText
    masterPromptText = masterPromptSlots.filter(s => s.active && s.text.trim()).map(s => s.text.trim()).join('\n');

    updateMasterPromptIndicator();

    // Load aspect ratio
    const savedAspectRatio = localStorage.getItem(ASPECT_RATIO_STORAGE_KEY);
    if (savedAspectRatio) {
      selectedAspectRatio = savedAspectRatio;
      const checkbox1_1 = document.getElementById('aspect-ratio-1-1');
      const checkbox16_9 = document.getElementById('aspect-ratio-16-9');
      if (checkbox1_1) checkbox1_1.checked = (selectedAspectRatio === '1:1');
      if (checkbox16_9) checkbox16_9.checked = (selectedAspectRatio === '16:9');
      const displayElement = document.getElementById('current-aspect-ratio-display');
      if (displayElement) displayElement.textContent = selectedAspectRatio === 'none' ? 'None' : selectedAspectRatio;
    }
  } catch (err) {
    console.error('Failed to load master prompt:', err);
  }
}

// Load selection history from localStorage
function loadSelectionHistory() {
  try {
    const saved = localStorage.getItem(SELECTION_HISTORY_KEY);
    if (saved) {
      selectionHistory = JSON.parse(saved);
    }
  } catch (err) {
    console.error('Failed to load selection history:', err);
    selectionHistory = {};
  }
}

// Save selection history to localStorage
function saveSelectionHistory() {
  try {
    localStorage.setItem(SELECTION_HISTORY_KEY, JSON.stringify(selectionHistory));
  } catch (err) {
    console.error('Failed to save selection history:', err);
  }
}

// Add a selection to history
function addToHistory(presetName, selection) {
  if (!presetName || !selection) return;
  
  if (!selectionHistory[presetName]) {
    selectionHistory[presetName] = [];
  }
  
  // Add new selection at the beginning
  selectionHistory[presetName].unshift(selection);
  
  // Keep only the last MAX_HISTORY_PER_PRESET selections
  if (selectionHistory[presetName].length > MAX_HISTORY_PER_PRESET) {
    selectionHistory[presetName] = selectionHistory[presetName].slice(0, MAX_HISTORY_PER_PRESET);
  }
  
  saveSelectionHistory();
}

// Clear history for a specific preset (useful for testing)
function clearPresetHistory(presetName) {
  if (presetName && selectionHistory[presetName]) {
    delete selectionHistory[presetName];
    saveSelectionHistory();
  }
}

// Clear all selection history
function clearAllHistory() {
  selectionHistory = {};
  saveSelectionHistory();
}

// Check if Manual Options can be used based on current mode
function canUseManualOptions() {
  if (noMagicMode) {
    return { 
      allowed: false, 
      reason: 'Manual Select disabled: No Magic Mode is active' 
    };
  }
  
  if (isTimerMode) {
    return { 
      allowed: false, 
      reason: 'Manual Select disabled: Timer Mode is active' 
    };
  }
  
  if (isMotionDetectionMode) {
    return { 
      allowed: false, 
      reason: 'Manual Select disabled: Motion Detection is active' 
    };
  }
  
  if (isBurstMode) {
    return { 
      allowed: false, 
      reason: 'Manual Select disabled: Burst Mode is active' 
    };
  }
  
  return { allowed: true };
}

// Parse preset message to extract random options for manual selection
// Returns array of sections: [{ title, options: [{value, label}] }]
function parsePresetOptions(preset) {
  const sections = [];
  
  // NEW FORMAT: Check if preset has optionGroups (multi-selection like FRIENDS)
  if (preset.optionGroups && preset.optionGroups.length > 0) {
    preset.optionGroups.forEach(group => {
      const activeOptions = group.options
        .map((opt, index) => ({ opt, index }))
        .filter(({ opt }) => opt.enabled !== false);
      const pool = activeOptions.length > 0 ? activeOptions : group.options.map((opt, index) => ({ opt, index }));
      sections.push({
        title: group.title,
        options: pool.map(({ opt, index }) => ({
          value: index,
          label: `${index}: ${opt.text}`
        }))
      });
    });
    return sections;
  }
  
  // NEW FORMAT: Check if preset has options array (single-selection)
  if (preset.options && preset.options.length > 0) {
    const activeOptions = preset.options
      .map((opt, index) => ({ opt, index }))
      .filter(({ opt }) => opt.enabled !== false);
    const pool = activeOptions.length > 0 ? activeOptions : preset.options.map((opt, index) => ({ opt, index }));
    sections.push({
      title: 'SELECT',
      options: pool.map(({ opt, index }) => ({
        value: index,
        label: `${index}: ${opt.text}`
      }))
    });
    return sections;
  }
  
  // No options - return empty
  return [];
}

function getFinalPrompt(preset, manualSelection = null) {
  // Build prompt from clean preset structure
  let finalPrompt = preset.message || null;
  if (finalPrompt === null) {
    // No message — return null so the caller can omit the message key entirely
    // which tells the r1 server to use its own built-in default magic behavior
    return null;
  }

//  finalPrompt = finalPrompt;

  // If this is a combined image, replace the opening "Take a picture" with the combine preamble

  if (window.isCombinedMode) {
    const combinePreamble = 'Take a picture of this image containing two photos placed side by side — the left half is Subject A and the right half is Subject B. Take both subjects and transform them together into a single unified image —';
    // Replace ONLY the words "Take a picture" at the very start, preserving the rest of the sentence
    finalPrompt = finalPrompt.replace(/^Take a picture/i, combinePreamble);
  }
  
  // Handle options if preset uses randomization
  if (preset.randomizeOptions) {
    if (manualSelection !== null) {
      // User manually selected options
      finalPrompt += '\n\n' + buildSelectedOptionsText(preset, manualSelection);
    } else {
      // Random selection
      finalPrompt += '\n\n' + buildRandomOptionsText(preset);
    }
  }
  
  // Add active master prompt slots at the end as concrete override instructions
  if (masterPromptEnabled) {
    const activeTexts = masterPromptSlots.filter(s => s.active && s.text.trim()).map(s => s.text.trim());
    if (activeTexts.length > 0) {
      finalPrompt += `\n\nOVERRIDE INSTRUCTIONS (these take priority over everything above - apply exactly as specified):\n${activeTexts.join('\n')}`;
    }
  }
  
  // Add additional instructions (CRITICAL/MANDATORY sections)
  if (preset.additionalInstructions && preset.additionalInstructions.trim()) {
    finalPrompt += '\n\n' + preset.additionalInstructions;
  }
  
  // Add aspect ratio override at the very end
  if (selectedAspectRatio === '1:1') {
    finalPrompt += '\n\nOutput this image with a perfect 1:1 square aspect ratio. All content, subjects, and visual elements must be fully contained within the square frame. Do not add any borders, bars, or empty padding around the image. Nothing may extend beyond the square boundary.';
  } else if (selectedAspectRatio === '16:9') {
    finalPrompt += '\n\nOutput this image with a 16:9 widescreen aspect ratio by placing solid black bars at the top and bottom only. All image content, subjects, and visual elements must be fully contained within the central widescreen area between the black bars. No subject, object, or any visual element may overlap with, extend into, or appear within the black bar regions under any circumstances. The black bars must remain completely solid black with absolutely nothing visible within them.';
  }
  
  const trimmed = finalPrompt.trim();
  console.log('FINAL PROMPT:', trimmed || '(empty — server default)');
  return trimmed || null;
}

// Helper: Build text for manually selected options
function buildSelectedOptionsText(preset, selection) {
  let text = 'SELECTED OPTIONS:\n';
  
  // Multi-selection (array of selections)
  if (Array.isArray(selection)) {
    preset.optionGroups.forEach((group, index) => {
      const selectedOption = group.options[selection[index]];
      text += `• ${group.title}: ${selectedOption.text}\n`;
    });
  }
  // Single selection (single number)
  else {
    const selectedOption = preset.options[selection];
    text += `• ${selectedOption.text}`;
  }
  
  return text;
}

// Helper: Build text for random selections
function buildRandomOptionsText(preset) {
  const seed = Date.now();
  let text = 'SELECTED OPTIONS (Random):\n';
  
  // Multi-selection preset
  if (preset.optionGroups && preset.optionGroups.length > 0) {
    preset.optionGroups.forEach((group, index) => {
      const activeOptions = group.options.filter(o => o.enabled !== false);
      const pool = activeOptions.length > 0 ? activeOptions : group.options;
      const selectedIndex = (seed + index * 13) % pool.length;
      const selectedOption = pool[selectedIndex];
      text += `• ${group.title}: ${selectedOption.text}\n`;
    });
  }
  // Single selection preset
  else if (preset.options && preset.options.length > 0) {
    const activeOptions = preset.options.filter(o => o.enabled !== false);
    const pool = activeOptions.length > 0 ? activeOptions : preset.options;
    const selectedIndex = seed % pool.length;
    const selectedOption = pool[selectedIndex];
    text += `• ${selectedOption.text}`;
  }
  
  return text;
}

function trackSelection(presetName, selectedOption) {
  if (!presetName || !selectedOption) return;
  
  // Get current history
  const history = getPresetHistory(presetName);
  
  // Add new selection to beginning
  history.unshift(selectedOption);
  
  // Keep only last 5 selections
  if (history.length > MAX_HISTORY_PER_PRESET) {
    history.splice(MAX_HISTORY_PER_PRESET);
  }
  
  // Save back to storage
  selectionHistory[presetName] = history;
  localStorage.setItem(SELECTION_HISTORY_KEY, JSON.stringify(selectionHistory));
}

function getPresetHistory(presetName) {
  if (!presetName) return [];
  
  // Load history from storage if not in memory
  if (!selectionHistory[presetName]) {
    const stored = localStorage.getItem(SELECTION_HISTORY_KEY);
    if (stored) {
      try {
        selectionHistory = JSON.parse(stored);
      } catch (e) {
        selectionHistory = {};
      }
    }
  }
  
  return selectionHistory[presetName] || [];
}

function _escapeHTML(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function buildStyleItemHTML(preset, indexMap, activeIndex) {
    const originalIndex = indexMap.get(preset);
    const activeClass = originalIndex === activeIndex ? ' active' : '';
    const favText = isFavoriteStyle(preset.name) ? '⭐' : '☆';
    const isUserPreset = (preset.internal === false);
    const editAction = isUserPreset ? 'builder' : 'edit';
    const editText = isUserPreset ? 'Builder' : 'Edit';
    const escapedName = _escapeHTML(preset.name);
    return `<div class="style-item${activeClass}" data-index="${originalIndex}"><button class="style-favorite" data-action="favorite" data-style-name="${escapedName}">${favText}</button><span class="style-name">${escapedName}</span><button class="style-edit" data-action="${editAction}" data-index="${originalIndex}">${editText}</button></div>`;
}

function populateStylesList(preserveScroll = false) {
    const list = document.getElementById('menu-styles-list');

    // ── Fast path: skip full rebuild if data hasn't changed and no filter is active ──
    // The existing DOM nodes are still correct — just update the active highlight.
    if (!styleFilterText && !mainMenuFilterByCategory &&
        !_listDOMIsFiltered &&
        _listDOMVersion === _stylesDataVersion &&
        list.children.length > 0) {

        // Update active-preset highlight — touch only the 2 affected nodes, not all 800
        const prevActive = list.querySelector('.style-item.active');
        if (prevActive) prevActive.classList.remove('active');
        const activeItem = list.querySelector(`.style-item[data-index="${currentPresetIndex}"]`);
        if (activeItem) activeItem.classList.add('active');

        if (!preserveScroll) {
            currentMenuIndex = 0;
        }
        return;
    }

    // Slow path: rebuild needed — caller is responsible for visual feedback via overlay
    _doPopulateStylesList(list, preserveScroll);
}

function _doPopulateStylesList(list, preserveScroll) {
    // Remove the old delegation listener before re-adding below
    list.removeEventListener('click', handleStyleListClick);
    const newList = list;

    // Build a one-time index map so we can look up originalIndex in O(1)
    const presetIndexMap = new Map(CAMERA_PRESETS.map((p, i) => [p, i]));

    const { favorites, regular } = getStylesLists();
    
    const _stylesSearchText = styleFilterText ? stripAccents(styleFilterText.toLowerCase()) : '';
    const filteredFavorites = favorites.filter(preset => {
      // First apply text search filter
      if (_stylesSearchText) {
        const searchText = _stylesSearchText;
        const categoryMatch = preset.category && preset.category.some(cat => stripAccents(cat.toLowerCase()).includes(searchText));
        const optionsMatch = (
          (preset.options && preset.options.some(o => o.text && stripAccents(o.text.toLowerCase()).includes(searchText))) ||
          (preset.optionGroups && preset.optionGroups.some(g => g.title && stripAccents(g.title.toLowerCase()).includes(searchText) || g.options && g.options.some(o => o.text && stripAccents(o.text.toLowerCase()).includes(searchText))))
        );
        const textMatch = stripAccents(preset.name.toLowerCase()).includes(searchText) ||
                         stripAccents((preset.message || '').toLowerCase()).includes(searchText) ||
                         stripAccents((preset.additionalInstructions || '').toLowerCase()).includes(searchText) ||
                         categoryMatch || optionsMatch;
        if (!textMatch) return false;
      }
      if (mainMenuFilterByCategory) {
        return preset.category && preset.category.includes(mainMenuFilterByCategory);
      }
      return true;
    });

    const filtered = regular.filter(preset => {
      if (_stylesSearchText) {
        const searchText = _stylesSearchText;
        const categoryMatch = preset.category && preset.category.some(cat => stripAccents(cat.toLowerCase()).includes(searchText));
        const optionsMatch = (
          (preset.options && preset.options.some(o => o.text && stripAccents(o.text.toLowerCase()).includes(searchText))) ||
          (preset.optionGroups && preset.optionGroups.some(g => g.title && stripAccents(g.title.toLowerCase()).includes(searchText) || g.options && g.options.some(o => o.text && stripAccents(o.text.toLowerCase()).includes(searchText))))
        );
        const textMatch = stripAccents(preset.name.toLowerCase()).includes(searchText) ||
                         stripAccents((preset.message || '').toLowerCase()).includes(searchText) ||
                         stripAccents((preset.additionalInstructions || '').toLowerCase()).includes(searchText) ||
                         categoryMatch || optionsMatch;
        if (!textMatch) return false;
      }
      if (mainMenuFilterByCategory) {
        return preset.category && preset.category.includes(mainMenuFilterByCategory);
      }
      return true;
    });

    // Build HTML as a string — 10x faster than createElement for large lists
    const parts = [];

    if (filteredFavorites.length > 0) {
        parts.push('<h3 class="menu-section-header">★ Favorites</h3>');
        filteredFavorites.forEach(preset => {
            parts.push(buildStyleItemHTML(preset, presetIndexMap, currentPresetIndex));
        });
    }

    if (filtered.length > 0) {
        const headerText = styleFilterText ? 'Search Results' : 'All Styles';
        parts.push(`<h3 class="menu-section-header">${headerText}</h3>`);
        filtered.forEach(preset => {
            parts.push(buildStyleItemHTML(preset, presetIndexMap, currentPresetIndex));
        });
    }

    if (filtered.length === 0 && filteredFavorites.length === 0 && styleFilterText) {
        parts.push('<div class="menu-empty">No styles found</div>');
    }

    newList.innerHTML = parts.join('');

    // Track whether this DOM represents a filtered or full list
    _listDOMIsFiltered = !!(styleFilterText || mainMenuFilterByCategory);
    if (!_listDOMIsFiltered) {
        _listDOMVersion = _stylesDataVersion;
    }
    
    // Single event listener for the entire list using event delegation
    newList.addEventListener('click', handleStyleListClick);

    // Long-press image preview delegation for the main styles list
    newList.removeEventListener('touchstart', _handleStyleListLongPressStart);
    newList.removeEventListener('touchend', _handleStyleListLongPressEnd);
    newList.removeEventListener('touchmove', _handleStyleListLongPressEnd);
    newList.removeEventListener('mousedown', _handleStyleListLongPressStart);
    newList.removeEventListener('mouseup', _handleStyleListLongPressEnd);
    newList.removeEventListener('mouseleave', _handleStyleListLongPressEnd);
    newList.addEventListener('touchstart', _handleStyleListLongPressStart, { passive: true });
    newList.addEventListener('touchend',  _handleStyleListLongPressEnd, { passive: true });
          newList.addEventListener('touchmove', _handleStyleListLongPressEnd, { passive: true });
    newList.addEventListener('mousedown', _handleStyleListLongPressStart);
    newList.addEventListener('mouseup', _handleStyleListLongPressEnd);
    newList.addEventListener('mouseleave', _handleStyleListLongPressEnd);

    // Update styles count — reuse already-computed filtered lists
    const stylesCountElement = document.getElementById('styles-count');
    if (stylesCountElement) {
        stylesCountElement.textContent = filteredFavorites.length + filtered.length;
    }
    
    if (!preserveScroll) {
        currentMenuIndex = 0;
        if (isMenuOpen && document.getElementById('unified-menu')?.style.display === 'flex') {
            updateMenuSelection();
        }
    }
}

function createStyleMenuItemFast(preset, indexMap) {
    const originalIndex = indexMap ? indexMap.get(preset) : CAMERA_PRESETS.findIndex(p => p === preset);
    
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
        returnToMainMenuFromBuilder = true;
        hideUnifiedMenu();
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
  
  // Focus the scrollable body to enable R1 scroll wheel
  setTimeout(() => {
    const editorBody = document.querySelector('.style-editor-body');
    if (editorBody) {
      editorBody.focus();
    }
  }, 100);
}

// Detect keyboard visibility and adjust style editor layout
let styleEditorKeyboardVisible = false;

// Detect when inputs receive focus (keyboard likely opening)
function handleStyleEditorInputFocus() {
  if (!styleEditorKeyboardVisible) {
    styleEditorKeyboardVisible = true;
    const editorBody = document.querySelector('.style-editor-body');
    if (editorBody) {
      editorBody.style.gap = '0.5vh';
      editorBody.style.paddingBottom = '0.5vw';
    }
  }
}

// Detect when inputs lose focus (keyboard likely closing)
function handleStyleEditorInputBlur() {
  // Only reset if no other input in the editor has focus
  setTimeout(() => {
    const editorInputs = document.querySelectorAll('.style-input, .style-textarea');
    const anyFocused = Array.from(editorInputs).some(input => input === document.activeElement);
    
    if (!anyFocused && styleEditorKeyboardVisible) {
      styleEditorKeyboardVisible = false;
      const editorBody = document.querySelector('.style-editor-body');
      if (editorBody) {
        editorBody.style.gap = '1vh';
        editorBody.style.paddingBottom = '1vw';
      }
    }
  }, 100);
}

// Add event listeners to style editor inputs
const styleNameInput = document.getElementById('style-name');
const styleCategoryInput = document.getElementById('style-category');
const styleMessageTextarea = document.getElementById('style-message');

if (styleNameInput) {
  styleNameInput.addEventListener('focus', handleStyleEditorInputFocus);
  styleNameInput.addEventListener('blur', handleStyleEditorInputBlur);
}

if (styleCategoryInput) {
  styleCategoryInput.addEventListener('focus', handleStyleEditorInputFocus);
  styleCategoryInput.addEventListener('blur', handleStyleEditorInputBlur);
}

if (styleMessageTextarea) {
  styleMessageTextarea.addEventListener('focus', handleStyleEditorInputFocus);
  styleMessageTextarea.addEventListener('blur', handleStyleEditorInputBlur);
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
  const savedEditingStyleIndex = editingStyleIndex;
  editingStyleIndex = -1;
  
  // If we came from the gallery viewer, return there instead of menu
  if (returnToGalleryFromViewerEdit) {
    returnToGalleryFromViewerEdit = false;
    // Remember which preset was loaded before we open the viewer (openImageViewer blanks the field)
    const presetToRestore = window.viewerLoadedPreset;
    openImageViewer(currentViewerImageIndex);
    // Determine which preset to load into the viewer
    let presetToShow = null;
    if (presetToRestore) {
      // Editing existing — find by name first, fall back to saved index
      let updatedPreset = CAMERA_PRESETS.find(p => p.name === presetToRestore.name);
      if (!updatedPreset && savedEditingStyleIndex >= 0 && CAMERA_PRESETS[savedEditingStyleIndex]) {
        updatedPreset = CAMERA_PRESETS[savedEditingStyleIndex];
      }
      presetToShow = updatedPreset || presetToRestore;
    } else if (savedEditingStyleIndex >= 0 && CAMERA_PRESETS[savedEditingStyleIndex]) {
      // Edited existing with no prior loaded preset
      presetToShow = CAMERA_PRESETS[savedEditingStyleIndex];
    } else {
      // Brand new preset saved from style editor — find most recently saved
      presetToShow = CAMERA_PRESETS[CAMERA_PRESETS.length - 1] || null;
    }
    if (presetToShow) {
      window.viewerLoadedPreset = presetToShow;
      let fullText = presetToShow.message || '';
      if (presetToShow.randomizeOptions) {
        if (presetToShow.optionGroups && presetToShow.optionGroups.length > 0) {
          presetToShow.optionGroups.forEach(group => {
            fullText += '\n\n' + group.title + ':\n';
            group.options.forEach((opt, i) => { fullText += '  ' + i + ': ' + opt.text + '\n'; });
          });
        } else if (presetToShow.options && presetToShow.options.length > 0) {
          fullText += '\n\nOPTIONS:\n';
          presetToShow.options.forEach((opt, i) => { fullText += '  ' + i + ': ' + opt.text + '\n'; });
        }
      }
      if (presetToShow.additionalInstructions && presetToShow.additionalInstructions.trim()) {
        fullText += '\n\n' + presetToShow.additionalInstructions;
      }
      const promptInput = document.getElementById('viewer-prompt');
      if (promptInput) promptInput.value = fullText;
      const presetHeader = document.getElementById('viewer-preset-header');
      if (presetHeader) presetHeader.textContent = presetToShow.name;
    }
    updatePresetDisplay();
    return;
  }
}

function editStyle(index) {
  editingStyleIndex = index;
  const preset = CAMERA_PRESETS[index];
  
  document.getElementById('style-name').value = preset.name;
  document.getElementById('style-message').value = preset.message || '';
  
  const categoryInput = document.getElementById('style-category');
  if (categoryInput) {
    categoryInput.value = preset.category ? preset.category.join(', ') : '';
  }
  
  // Clear and reload option fields
  clearStyleEditorOptionFields();
  
  // Load additional instructions
  const additionalEl = document.getElementById('style-additional');
  if (additionalEl) additionalEl.value = preset.additionalInstructions || '';
  
  // Load randomize options and options data
  const randomizeEl = document.getElementById('style-randomize');
  const selectionTypeEl = document.getElementById('style-selection-type');
  
  if (randomizeEl && preset.randomizeOptions) {
    randomizeEl.checked = true;
    document.getElementById('style-selection-type-container').style.display = 'block';
    
    if (preset.optionGroups && preset.optionGroups.length > 0) {
      selectionTypeEl.value = 'multi';
      document.getElementById('style-single-options-container').style.display = 'none';
      document.getElementById('style-multi-options-container').style.display = 'block';
      preset.optionGroups.forEach(group => addStyleOptionGroup(group.title, group.options));
    } else if (preset.options && preset.options.length > 0) {
      selectionTypeEl.value = 'single';
      document.getElementById('style-single-options-container').style.display = 'block';
      document.getElementById('style-multi-options-container').style.display = 'none';
      preset.options.forEach(opt => addStyleSingleOption(opt.text, opt.enabled !== false));
    }
  }
  
  document.getElementById('delete-style').style.display = 'block';
  
  showStyleEditor('Edit Style');
}

async function saveStyle() {
  const name = document.getElementById('style-name').value.trim();
  const message = document.getElementById('style-message').value.trim();
  const categoryInput = document.getElementById('style-category').value.trim();
  
  // Parse categories from comma-separated string
  const category = categoryInput ? 
    categoryInput.split(',').map(c => c.trim().toUpperCase()).filter(c => c.length > 0) : 
    [];
  
  if (!name) {
    alert('Please fill in the style name');
    return;
  }
  
  // Collect option fields
  const styleRandomize = document.getElementById('style-randomize');
  const styleSelectionType = document.getElementById('style-selection-type');
  const styleAdditional = document.getElementById('style-additional');
  const randomizeOptions = styleRandomize ? styleRandomize.checked : false;
  const additionalInstructions = styleAdditional ? styleAdditional.value.trim() : '';
  let options = [];
  let optionGroups = [];
  if (randomizeOptions && styleSelectionType) {
    if (styleSelectionType.value === 'single') {
      options = collectStyleSingleOptions();
    } else {
      optionGroups = collectStyleOptionGroups();
    }
  }
  
  if (editingStyleIndex >= 0) {
    const oldName = CAMERA_PRESETS[editingStyleIndex].name;
    const wasCustom = CAMERA_PRESETS[editingStyleIndex].internal === false;
      CAMERA_PRESETS[editingStyleIndex] = { name, category, message, options, optionGroups, randomizeOptions, additionalInstructions, internal: wasCustom ? false : undefined };
    
    // Check if it's a factory preset OR imported preset
    const isFactoryPreset = factoryPresets.some(p => p.name === oldName);
    const isImportedPreset = hasImportedPresets && presetImporter.getImportedPresets().some(p => p.name === oldName);
    
    if (isFactoryPreset || isImportedPreset) {
      // Save as modification (doesn't change the original)
      await presetStorage.saveModification(oldName, {
        name: name,
        message: message,
        category: category,
        options: options,
        optionGroups: optionGroups,
        randomizeOptions: randomizeOptions,
        additionalInstructions: additionalInstructions
      });
    } else {
      // User-created preset - update it directly, preserving internal: false
      await presetStorage.saveNewPreset({ name, category, message, options, optionGroups, randomizeOptions, additionalInstructions, internal: false });
    }
    
    // If name changed, update visiblePresets array
    if (oldName !== name) {
      const visIndex = visiblePresets.indexOf(oldName);
      if (visIndex > -1) {
        visiblePresets[visIndex] = name;
        saveVisiblePresets();
      }
    }
  } else {
    const newPreset = { name, category, message, options, optionGroups, randomizeOptions, additionalInstructions };
    await presetStorage.saveNewPreset(newPreset);
    CAMERA_PRESETS.push(newPreset);
    // ADD NEW PRESET TO VISIBLE LIST AUTOMATICALLY
    visiblePresets.push(name);
    saveVisiblePresets();
  }
  
  // saveStyles(); // REMOVED - redundant, already saved to IndexedDB above
  
  alert(editingStyleIndex >= 0 ? `Preset "${name}" updated!` : `Preset "${name}" saved!`);
  
  const cameFromViewer = returnToGalleryFromViewerEdit;
  hideStyleEditor();
  if (!cameFromViewer) {
    showUnifiedMenu();
  }
}

async function deleteStyle() {
  if (editingStyleIndex >= 0 && CAMERA_PRESETS.length > 1) {
    if (await confirm('Delete this style?')) {
      const presetName = CAMERA_PRESETS[editingStyleIndex].name;
      
      // Check if it's a factory preset, imported preset, or user-created
      const isFactoryPreset = factoryPresets.some(p => p.name === presetName);
      const isImportedPreset = hasImportedPresets && presetImporter.getImportedPresets().some(p => p.name === presetName);
      
      if (isImportedPreset) {
        // Delete from imported presets
        await presetImporter.deletePreset(presetName);
      } else if (isFactoryPreset) {
        // Mark factory preset as deleted
        await presetStorage.saveDeletion(presetName);
      } else {
        // User-created preset: save to trash so it can be restored, then remove
        saveToPresetTrash(CAMERA_PRESETS[editingStyleIndex]);
        await presetStorage.removeModification(presetName);
      }
      
      CAMERA_PRESETS.splice(editingStyleIndex, 1);
      
      // Remove from visible presets
      const visIndex = visiblePresets.indexOf(presetName);
      if (visIndex > -1) {
        visiblePresets.splice(visIndex, 1);
        saveVisiblePresets();
      }
      
      // Save whether we're deleting the currently active preset BEFORE modifying currentPresetIndex
      const deletingCurrentPreset = (editingStyleIndex === currentPresetIndex);
      
      // Determine new current preset index after deletion
      if (editingStyleIndex === currentPresetIndex) {
        // We deleted the currently selected preset
        // Move to previous preset, or stay at 0 if we deleted the first one
        currentPresetIndex = Math.max(0, editingStyleIndex - 1);
      } else if (editingStyleIndex < currentPresetIndex) {
        // We deleted a preset before the current one, so shift current index down
        currentPresetIndex = currentPresetIndex - 1;
      }
      // If we deleted a preset after the current one, currentPresetIndex stays the same
      
      // Ensure index is within bounds
      currentPresetIndex = Math.max(0, Math.min(currentPresetIndex, CAMERA_PRESETS.length - 1));
      
      saveStyles();
      
      // If we deleted the currently active preset, switch to first visible preset
      if (deletingCurrentPreset) {
        const visiblePresetObjects = CAMERA_PRESETS.filter(p => _visiblePresetsSet.has(p.name));
        if (visiblePresetObjects.length > 0) {
          currentPresetIndex = CAMERA_PRESETS.findIndex(p => p.name === visiblePresetObjects[0].name);
        } else if (CAMERA_PRESETS.length > 0) {
          // No visible presets, just use first available
          currentPresetIndex = 0;
        }
      }
      
      // After deletion, verify the current preset is visible; if not, switch to first visible
      const currentPreset = CAMERA_PRESETS[currentPresetIndex];
      if (currentPreset && !_visiblePresetsSet.has(currentPreset.name)) {
        // Current preset is not visible, switch to first visible preset
        const visiblePresetObjects = CAMERA_PRESETS.filter(p => _visiblePresetsSet.has(p.name));
        if (visiblePresetObjects.length > 0) {
          currentPresetIndex = CAMERA_PRESETS.findIndex(p => p.name === visiblePresetObjects[0].name);
        } else if (CAMERA_PRESETS.length > 0) {
          // No visible presets, just use first available
          currentPresetIndex = 0;
        }
      }
      
      // Update the preset display to reflect the switch
        updatePresetDisplay();
      
        // Update visible presets display to reflect deletion
        updateVisiblePresetsDisplay();

        // Clear viewer loaded preset and reset gallery header since the preset is gone
        window.viewerLoadedPreset = null;
        const deletedPresetHeader = document.getElementById('viewer-preset-header');
        if (deletedPresetHeader) deletedPresetHeader.textContent = 'NO PRESET LOADED';
      
        const cameFromViewer = returnToGalleryFromViewerEdit;
        hideStyleEditor();
      
      if (!cameFromViewer) {
        // Save scroll position before showing menu
        const scrollContainer = document.querySelector('.styles-menu-scroll-container');
        const scrollPosition = scrollContainer ? scrollContainer.scrollTop : 0;
        
        showUnifiedMenu();
        
        // Restore scroll position after menu is shown
        if (scrollContainer) {
          requestAnimationFrame(() => {
            scrollContainer.scrollTop = scrollPosition;
          });
        }
      }
      
      alert(`Preset "${presetName}" deleted successfully!`);
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
  loadSelectionHistory();
  setupPinchZoom();
//  setupTapToFocus();
  
  const versionEl = document.getElementById('app-version');
     if (versionEl) versionEl.textContent = APP_VERSION;

  const splashTourBtn = document.getElementById('splash-tour-button');
  if (splashTourBtn) {
    splashTourBtn.addEventListener('click', () => {
      document.getElementById('start-screen').style.display = 'none';
      initCamera();
      startGuidedTour();
    });
    splashTourBtn.addEventListener('touchend', (e) => {
      e.preventDefault();
      document.getElementById('start-screen').style.display = 'none';
      initCamera();
      startGuidedTour();
    });
  }
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
    
    // Initialize camera immediately while the visual effects play
    initCamera();
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
  
  const cameraMultiPresetBtn = document.getElementById('camera-multi-preset-toggle');
    if (cameraMultiPresetBtn) {
      cameraMultiPresetBtn.addEventListener('click', () => {
        // If already active, clicking again clears it
        if (isCameraMultiPresetActive) {
          clearCameraMultiPresets();
          if (statusElement) statusElement.textContent = 'Multi-preset cleared';
          setTimeout(() => updatePresetDisplay(), 1500);
        } else {
          openCameraMultiPresetSelector();
        }
      });
    }

  const cameraLayerBtn = document.getElementById('camera-layer-toggle');
  if (cameraLayerBtn) {
    cameraLayerBtn.addEventListener('click', () => {
      // If already active, clicking again clears it
      if (isCameraLayerActive) {
        clearCameraLayerPresets();
        if (statusElement) statusElement.textContent = 'Layer presets cleared';
        setTimeout(() => updatePresetDisplay(), 1500);
      } else {
        openCameraLayerPresetSelector();
      }
    });
  }

  const galleryLayerBtn = document.getElementById('layer-preset-viewer-button');
  if (galleryLayerBtn) {
    galleryLayerBtn.addEventListener('click', () => {
      const currentImage = galleryImages[currentViewerImageIndex];
      if (!currentImage) {
        alert('No image open in the viewer.');
        return;
      }
      openGalleryLayerPresetSelector(currentImage.id);
    });
  }

  const cameraCombineBtn = document.getElementById('camera-combine-toggle');
  if (cameraCombineBtn) {
    cameraCombineBtn.addEventListener('click', toggleCameraLiveCombineMode);
  }

  const menuBtn = document.getElementById('menu-button');
  if (menuBtn) {
    menuBtn.addEventListener('click', showUnifiedMenu);
  }
  
  const closeMenuBtn = document.getElementById('close-menu');
  if (closeMenuBtn) {
    closeMenuBtn.addEventListener('click', hideUnifiedMenu);
  }

  // ═══════════════════════════════════════════════════════
  // ALPHA LETTER JUMP — Shared utilities
  // Used by both double-click (existing) and hard-press (new)
  // ═══════════════════════════════════════════════════════

  let _alphaOverlayTimer = null;
  function _showAlphaOverlay(letter) {
    const overlay = document.getElementById('alpha-letter-overlay');
    if (!overlay) return;
    const span = overlay.querySelector('.alpha-overlay-letter');
    if (span) {
      span.textContent = letter;
      // Restart the pop-in animation so it fires for every new letter
      span.style.animation = 'none';
      void span.offsetWidth; // force reflow
      span.style.animation = '';
    }
    if (_alphaOverlayTimer) clearTimeout(_alphaOverlayTimer);
    overlay.style.opacity = '1';
    _alphaOverlayTimer = setTimeout(() => { overlay.style.opacity = '0'; }, 1000);
  }
  // Expose globally so preset-import.js can call it
  window._showAlphaOverlay = _showAlphaOverlay;

  function _jumpMenuAlpha(direction) {
    const sc   = document.querySelector('.styles-menu-scroll-container');
    const list = document.getElementById('menu-styles-list');
    if (!sc || !list) return;
    const items = Array.from(list.querySelectorAll('.style-item'));
    if (!items.length) return;
    const cTop = sc.getBoundingClientRect().top;
    let idx = 0;
    items.forEach((el, i) => { if (el.getBoundingClientRect().top < cTop + 10) idx = i; });
    const curName   = ((items[idx].querySelector('.style-name') || {}).textContent || '').trim();
    const curLetter = stripAccents(curName).toUpperCase().charAt(0);
    const curIsFav  = isFavoriteStyle(curName);

    const doScroll = (targetIdx) => {
      sc.scrollTo({ top: items[targetIdx].getBoundingClientRect().top - sc.getBoundingClientRect().top + sc.scrollTop, behavior: window._alphaLongPressActive ? 'instant' : 'smooth' });
      currentMenuIndex = targetIdx;
      items.forEach(el => el.classList.remove('menu-selected'));
      items[targetIdx].classList.add('menu-selected');
    };

    if (direction === 'down') {
      for (let i = idx + 1; i < items.length; i++) {
        const nm      = ((items[i].querySelector('.style-name') || {}).textContent || '').trim();
        const isFav   = isFavoriteStyle(nm);
        const ltr     = stripAccents(nm).toUpperCase().charAt(0);
        // Jump on either a new letter OR crossing the favorites/non-favorites boundary
        if (ltr !== curLetter || isFav !== curIsFav) {
          doScroll(i);
          _showAlphaOverlay(ltr);
          return;
        }
      }
    } else {
      for (let i = idx - 1; i >= 0; i--) {
        const nm      = ((items[i].querySelector('.style-name') || {}).textContent || '').trim();
        const isFav   = isFavoriteStyle(nm);
        const ltr     = stripAccents(nm).toUpperCase().charAt(0);
        // Jump on either a new letter OR crossing the favorites/non-favorites boundary
        if (ltr !== curLetter || isFav !== curIsFav) {
          // Find the first item of this letter group within its own section
          let first = i;
          while (first > 0) {
            const p    = ((items[first - 1].querySelector('.style-name') || {}).textContent || '').trim();
            if (isFavoriteStyle(p) !== isFav) break;
            if (stripAccents(p).toUpperCase().charAt(0) !== ltr) break;
            first--;
          }
          doScroll(first);
          _showAlphaOverlay(ltr);
          return;
        }
      }
    }
  }

  function _jumpVisiblePresetsAlpha(direction) {
    const submenu = document.getElementById('visible-presets-submenu');
    const sc   = submenu ? submenu.querySelector('.submenu-list') : null;
    const list = document.getElementById('visible-presets-list');
    if (!sc || !list) return;
    const items = Array.from(list.querySelectorAll('.style-item'));
    if (!items.length) return;
    const cTop = sc.getBoundingClientRect().top;
    let idx = 0;
    items.forEach((el, i) => { if (el.getBoundingClientRect().top < cTop + 10) idx = i; });
    const curName   = ((items[idx].querySelector('.style-name') || {}).textContent || '').trim();
    const curLetter = stripAccents(curName).toUpperCase().charAt(0);
    if (direction === 'down') {
      for (let i = idx + 1; i < items.length; i++) {
        const nm  = ((items[i].querySelector('.style-name') || {}).textContent || '').trim();
        const ltr = stripAccents(nm).toUpperCase().charAt(0);
        if (ltr !== curLetter) {
          sc.scrollTo({ top: items[i].getBoundingClientRect().top - sc.getBoundingClientRect().top + sc.scrollTop, behavior: window._alphaLongPressActive ? 'instant' : 'smooth' });
          currentVisiblePresetsIndex = i;
          items.forEach(el => el.classList.remove('menu-selected'));
          items[i].classList.add('menu-selected');
          _showAlphaOverlay(ltr);
          return;
        }
      }
    } else {
      for (let i = idx - 1; i >= 0; i--) {
        const nm  = ((items[i].querySelector('.style-name') || {}).textContent || '').trim();
        const ltr = stripAccents(nm).toUpperCase().charAt(0);
        if (ltr !== curLetter) {
          let first = i;
          while (first > 0) {
            const p = ((items[first - 1].querySelector('.style-name') || {}).textContent || '').trim();
            if (stripAccents(p).toUpperCase().charAt(0) !== ltr) break;
            first--;
          }
          sc.scrollTo({ top: items[first].getBoundingClientRect().top - sc.getBoundingClientRect().top + sc.scrollTop, behavior: window._alphaLongPressActive ? 'instant' : 'smooth' });
          currentVisiblePresetsIndex = first;
          items.forEach(el => el.classList.remove('menu-selected'));
          items[first].classList.add('menu-selected');
          _showAlphaOverlay(ltr);
          return;
        }
      }
    }
  }

  function _jumpPresetSelectorAlpha(direction) {
    const list = document.getElementById('preset-list');
    if (!list) return;
    const items = Array.from(list.querySelectorAll('.preset-item'));
    if (!items.length) return;
    const idx     = Math.max(0, Math.min(currentPresetIndex_Gallery, items.length - 1));
    const curName = ((items[idx].querySelector('.preset-name') || {}).textContent || '').trim();
    const curLtr  = stripAccents(curName).toUpperCase().charAt(0);
    const curIsFav = isFavoriteStyle(curName);

    if (direction === 'down') {
      for (let i = idx + 1; i < items.length; i++) {
        const nm    = ((items[i].querySelector('.preset-name') || {}).textContent || '').trim();
        const isFav = isFavoriteStyle(nm);
        const ltr   = stripAccents(nm).toUpperCase().charAt(0);
        // Jump on either a new letter OR crossing the favorites/non-favorites boundary
        if (ltr !== curLtr || isFav !== curIsFav) {
          currentPresetIndex_Gallery = i;
          updatePresetSelection();
          _showAlphaOverlay(ltr);
          return;
        }
      }
    } else {
      for (let i = idx - 1; i >= 0; i--) {
        const nm    = ((items[i].querySelector('.preset-name') || {}).textContent || '').trim();
        const isFav = isFavoriteStyle(nm);
        const ltr   = stripAccents(nm).toUpperCase().charAt(0);
        // Jump on either a new letter OR crossing the favorites/non-favorites boundary
        if (ltr !== curLtr || isFav !== curIsFav) {
          // Find the first item of this letter group within its own section
          let first = i;
          while (first > 0) {
            const p = ((items[first - 1].querySelector('.preset-name') || {}).textContent || '').trim();
            if (isFavoriteStyle(p) !== isFav) break;
            if (stripAccents(p).toUpperCase().charAt(0) !== ltr) break;
            first--;
          }
          currentPresetIndex_Gallery = first;
          updatePresetSelection();
          _showAlphaOverlay(ltr);
          return;
        }
      }
    }
  }

  function _addAlphaLongPress(btn, jumpFn) {
    let _lpTimer    = null;
    let _lpInterval = null;
    let _lpSuppress = false;
    btn.addEventListener('click', (e) => {
      if (_lpSuppress) { _lpSuppress = false; e.stopImmediatePropagation(); }
    }, true);
    btn.addEventListener('touchstart', () => {
      if (_lpTimer)    clearTimeout(_lpTimer);
      if (_lpInterval) clearInterval(_lpInterval);
      _lpTimer = setTimeout(() => {
        _lpSuppress = true;
        window._alphaLongPressActive = true;
        jumpFn();
        _lpInterval = setInterval(jumpFn, 500);
      }, 500);
    }, { passive: true });
    function _lpStop() {
      if (_lpTimer)    { clearTimeout(_lpTimer);    _lpTimer    = null; }
      if (_lpInterval) { clearInterval(_lpInterval); _lpInterval = null; }
      window._alphaLongPressActive = false;
    }
    btn.addEventListener('touchend',    _lpStop);
    btn.addEventListener('touchcancel', _lpStop);
  }
  // Expose globally so preset-import.js can wire up its buttons
  window._addAlphaLongPress = _addAlphaLongPress;
  // ═══════════════════════════════════════════════════════

  const jumpToTopBtn = document.getElementById('jump-to-top');
  if (jumpToTopBtn) {
    let menuUpTimer = null;
    let menuUpCount = 0;
    jumpToTopBtn.addEventListener('click', () => {
      menuUpCount++;
      if (menuUpTimer) clearTimeout(menuUpTimer);
      menuUpTimer = setTimeout(() => {
        menuUpTimer = null;
        const count = menuUpCount;
        menuUpCount = 0;
        const scrollContainer = document.querySelector('.styles-menu-scroll-container');
        if (count === 1) {
            // Single-tap: scroll up one page
            if (scrollContainer) {
              scrollContainer.scrollTop = Math.max(0, scrollContainer.scrollTop - scrollContainer.clientHeight);
              const listEl = document.getElementById('menu-styles-list');
              if (listEl) {
                requestAnimationFrame(() => {
                  const allItems = Array.from(listEl.querySelectorAll('.style-item'));
                  const cRect = scrollContainer.getBoundingClientRect();
                  let firstIdx = 0;
                  for (let ii = 0; ii < allItems.length; ii++) {
                    if (allItems[ii].getBoundingClientRect().top >= cRect.top - 5) { firstIdx = ii; break; }
                  }
                  currentMenuIndex = firstIdx;
                  updateMenuSelection();
                });
              }
            }
        } else if (count === 2) {
          // Double-tap: jump to previous letter (shared with long-press)
          _jumpMenuAlpha('up');
        } else {
          // Triple-tap: jump to very top
          jumpToTopOfMenu();
        }
      }, 300);
    });
    _addAlphaLongPress(jumpToTopBtn, () => _jumpMenuAlpha('up'));
  }

  const jumpToBottomBtn = document.getElementById('jump-to-bottom');
  if (jumpToBottomBtn) {
    let menuDownTimer = null;
    let menuDownCount = 0;
    jumpToBottomBtn.addEventListener('click', () => {
      menuDownCount++;
      if (menuDownTimer) clearTimeout(menuDownTimer);
      menuDownTimer = setTimeout(() => {
        menuDownTimer = null;
        const count = menuDownCount;
        menuDownCount = 0;
        const scrollContainer = document.querySelector('.styles-menu-scroll-container');
        if (count === 1) {
            // Single-tap: scroll down one page
            if (scrollContainer) {
              scrollContainer.scrollTop = Math.min(
                scrollContainer.scrollHeight - scrollContainer.clientHeight,
                scrollContainer.scrollTop + scrollContainer.clientHeight
              );
              const listEl = document.getElementById('menu-styles-list');
              if (listEl) {
                requestAnimationFrame(() => {
                  const allItems = Array.from(listEl.querySelectorAll('.style-item'));
                  const cRect = scrollContainer.getBoundingClientRect();
                  let firstIdx = 0;
                  for (let ii = 0; ii < allItems.length; ii++) {
                    if (allItems[ii].getBoundingClientRect().top >= cRect.top - 5) { firstIdx = ii; break; }
                  }
                  currentMenuIndex = firstIdx;
                  updateMenuSelection();
                });
              }
            }
        } else if (count === 2) {
          // Double-tap: jump to next letter (shared with long-press)
          _jumpMenuAlpha('down');
        } else {
          // Triple-tap: jump to very bottom
          jumpToBottomOfMenu();
        }
      }, 300);
    });
    _addAlphaLongPress(jumpToBottomBtn, () => _jumpMenuAlpha('down'));
  }
  
  const settingsMenuBtn = document.getElementById('settings-menu-button');
  if (settingsMenuBtn) {
    settingsMenuBtn.addEventListener('click', showSettingsSubmenu);
  }
  
  // + button in main menu header — opens preset builder, returns to main menu on exit
  const menuAddPresetBtn = document.getElementById('menu-add-preset-button');
  if (menuAddPresetBtn) {
    menuAddPresetBtn.addEventListener('click', () => {
      returnToMainMenuFromBuilder = true;
      hideUnifiedMenu();
      document.getElementById('preset-builder-submenu').style.display = 'flex';
      isMenuOpen = false;
      isSettingsSubmenuOpen = false;
      isPresetBuilderSubmenuOpen = true;
      clearPresetBuilderForm();
    });
  }

  // Tapping the preset header shows a scrollable modal with fixed name, scrollable body, fixed buttons
  const viewerPresetHeader = document.getElementById('viewer-preset-header');
  if (viewerPresetHeader) {
    viewerPresetHeader.addEventListener('click', () => {

      // Helper that builds and shows the overlay modal
      function showPresetInfoModal(titleText, bodyText, speakText) {
        const overlay = document.createElement('div');
        overlay.id = 'preset-info-overlay';
        overlay.style.cssText = `
          position: fixed; inset: 0; z-index: 200000;
          display: flex; align-items: center; justify-content: center;
          background: rgba(0,0,0,0.75); backdrop-filter: blur(4px);
        `;

        // Read button only shown when there is something to speak
        const readBtnHTML = speakText ? `<button id="preset-info-speak-btn" style="background:rgba(255,255,255,0.1);color:#fff;border:1px solid rgba(255,255,255,0.2);border-radius:5px;font-size:10px;font-weight:600;padding:0 10px;height:22px !important;min-height:0 !important;line-height:22px;min-width:52px;cursor:pointer;text-transform:uppercase;letter-spacing:0.3px;box-sizing:border-box;display:inline-flex;align-items:center;justify-content:center;">🔊 Read</button>` : '';

        overlay.innerHTML = `
          <div style="
            position: relative;
            background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
            border-radius: 12px;
            border: 1px solid rgba(255,255,255,0.1);
            box-shadow: 0 12px 40px rgba(0,0,0,0.6);
            width: 85vw;
            max-width: 340px;
            max-height: 80vh;
            display: flex;
            flex-direction: column;
            overflow: hidden;
          ">
            <!-- Fixed title -->
            <div style="
              padding: 12px 16px 8px;
              border-bottom: 1px solid rgba(255,255,255,0.1);
              flex-shrink: 0;
            ">
              <div style="
                font-size: 13px;
                font-weight: 700;
                color: #FE5F00;
                text-align: center;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                word-break: break-word;
              ">${titleText}</div>
            </div>
            <!-- Scrollable body -->
            <div style="
              padding: 10px 16px;
              overflow-y: auto;
              flex: 1;
              min-height: 40px;
              -webkit-overflow-scrolling: touch;
            ">
              <div style="
                font-size: 13px;
                line-height: 1.5;
                color: #ddd;
                word-wrap: break-word;
                white-space: pre-wrap;
              ">${bodyText}</div>
            </div>
            <!-- Fixed button row -->
            <div style="
              padding: 6px 16px 8px;
              border-top: 1px solid rgba(255,255,255,0.1);
              display: flex;
              justify-content: space-between;
              align-items: center;
              flex-shrink: 0;
              gap: 12px;
            ">
              ${readBtnHTML}
              <button id="preset-info-exit-btn" style="background:linear-gradient(135deg,#4CAF50 0%,#45a049 100%);color:#fff;border:none;border-radius:5px;font-size:10px;font-weight:600;padding:0 10px;height:22px !important;min-height:0 !important;line-height:22px;min-width:52px;cursor:pointer;text-transform:uppercase;letter-spacing:0.3px;box-sizing:border-box;display:inline-flex;align-items:center;justify-content:center;margin-left:auto;">EXIT</button>
            </div>
          </div>
        `;

        document.body.appendChild(overlay);
                   isPresetInfoModalOpen = true;

        const exitBtn = document.getElementById('preset-info-exit-btn');
        const speakBtn = document.getElementById('preset-info-speak-btn');

        const closeModal = () => {
          tourStopSpeaking();
          isPresetInfoModalOpen = false;
          exitBtn.removeEventListener('click', closeModal);
          if (speakBtn) speakBtn.removeEventListener('click', handleSpeak);
          if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        };

        const handleSpeak = () => {
          tourSpeak(speakText);
          if (speakBtn) {
            speakBtn.style.background = 'rgba(254, 95, 0, 0.7)';
            speakBtn.style.borderColor = '#FE5F00';
            speakBtn.style.color = '#fff';
            setTimeout(() => {
              if (speakBtn) {
                speakBtn.style.background = 'rgba(255,255,255,0.1)';
                speakBtn.style.borderColor = 'rgba(255,255,255,0.2)';
                speakBtn.style.color = '#fff';
              }
            }, 1500);
          }
        };

        exitBtn.addEventListener('click', closeModal);
        if (speakBtn) speakBtn.addEventListener('click', handleSpeak);
      }

      // Multi preset mode active in gallery viewer — show the list of selected presets
      if (isGalleryMultiActive && galleryMultiPresets.length > 0) {
        const multiHeader = document.getElementById('viewer-preset-header');
        const presetNames = galleryMultiPresets
          .map((p, i) => `${i + 1}. ${p.name}`)
          .join('\n');
        showPresetInfoModal(
          multiHeader ? multiHeader.textContent : `🎞️ MULTI (${galleryMultiPresets.length})`,
          `${galleryMultiPresets.length} preset${galleryMultiPresets.length > 1 ? 's' : ''} queued to apply sequentially:\n\n${presetNames}\n\nTap ✨ MAGIC to apply again.`,
          null
        );
        return;
      }
      
      // Layer mode active — show info but nothing to speak

      if (isGalleryLayerActive && galleryLayerPresets.length > 0) {
        const layerNames = galleryLayerPresets
          .map((p, i) => i === 0 ? `PRIMARY: ${p.name}` : `Layer ${i}: ${p.name}`)
          .join('\n');
        showPresetInfoModal(
          '📑 Layer Mode Active',
          `${galleryLayerPresets.length} presets combined into one transform:\n\n${layerNames}\n\nTap ✨ MAGIC to apply again.`,
          null
        );
        return;
      }

      // No preset loaded — show info modal with Magic button hint
      if (!window.viewerLoadedPreset) {
        showPresetInfoModal(
          'No Preset Loaded',
          'No preset is currently loaded.\n\nIf you tap the ✨ MAGIC button without loading a preset, it will automatically pick a random preset for you.',
          null
        );
        return;
      }

      // Preset is loaded — show name and first sentence
      const preset = window.viewerLoadedPreset;
      const firstSentence = (preset.message || '').split('.')[0].trim() + '.';
      showPresetInfoModal(
        preset.name,
        firstSentence,
        preset.name + '. ' + firstSentence
      );
    });
  }

  const settingsBackBtn = document.getElementById('settings-back');
  if (settingsBackBtn) {
    settingsBackBtn.addEventListener('click', hideSettingsSubmenu);
  }
  
  const settingsJumpUpBtn = document.getElementById('settings-jump-up');
  if (settingsJumpUpBtn) {
    let settingsUpTapTimer = null;
    settingsJumpUpBtn.addEventListener('click', () => {
      if (settingsUpTapTimer) {
        // Double-tap: jump to top
        clearTimeout(settingsUpTapTimer);
        settingsUpTapTimer = null;
        currentSettingsIndex = 0;
        updateSettingsSelection();
      } else {
        // Single-tap: wait to see if double-tap follows
        settingsUpTapTimer = setTimeout(() => {
          settingsUpTapTimer = null;
          scrollSettingsUp();
        }, 300);
      }
    });
  }

  const settingsJumpDownBtn = document.getElementById('settings-jump-down');
  if (settingsJumpDownBtn) {
    let settingsDownTapTimer = null;
    settingsJumpDownBtn.addEventListener('click', () => {
      if (settingsDownTapTimer) {
        // Double-tap: jump to bottom
        clearTimeout(settingsDownTapTimer);
        settingsDownTapTimer = null;
        const submenu = document.getElementById('settings-submenu');
        if (submenu) {
          const items = submenu.querySelectorAll('.menu-section-button');
          currentSettingsIndex = items.length - 1;
          updateSettingsSelection();
        }
      } else {
        // Single-tap: wait to see if double-tap follows
        settingsDownTapTimer = setTimeout(() => {
          settingsDownTapTimer = null;
          scrollSettingsDown();
        }, 300);
      }
    });
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
  
  // Button Settings (combined Main Camera + Gallery tabs)

  const buttonSettingsBtn = document.getElementById('button-settings-button');
  if (buttonSettingsBtn) {
    buttonSettingsBtn.addEventListener('click', () => showButtonSettingsSubmenu('cam'));
  }

  const buttonSettingsBackBtn = document.getElementById('button-settings-back');
  if (buttonSettingsBackBtn) {
    buttonSettingsBackBtn.addEventListener('click', hideButtonSettingsSubmenu);
  }

  const btnTabCam = document.getElementById('btn-tab-cam');
  if (btnTabCam) {
    btnTabCam.addEventListener('click', () => _switchBtnSettingsTab('cam'));
  }

  const btnTabGallery = document.getElementById('btn-tab-gallery');
  if (btnTabGallery) {
    btnTabGallery.addEventListener('click', () => _switchBtnSettingsTab('gallery'));
  }

  const camBtnColorPicker = document.getElementById('cam-btn-color-picker');
  if (camBtnColorPicker) {
    camBtnColorPicker.addEventListener('input', (e) => {
      window._camBtnSettings.bgColor = e.target.value;
      window._applyCamBtnStyles();
      localStorage.setItem('r1_cam_btn_settings', JSON.stringify(window._camBtnSettings));
    });
  }

  const camBtnOpacitySlider = document.getElementById('cam-btn-opacity-slider');
  if (camBtnOpacitySlider) {
    camBtnOpacitySlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value);
      window._camBtnSettings.opacity = val;
      const opacityValueEl = document.getElementById('cam-btn-opacity-value');
      if (opacityValueEl) opacityValueEl.textContent = val + '%';
      window._applyCamBtnStyles();
      localStorage.setItem('r1_cam_btn_settings', JSON.stringify(window._camBtnSettings));
    });
  }

  const camBtnColorDefaultBtn = document.getElementById('cam-btn-color-default');
  if (camBtnColorDefaultBtn) {
    camBtnColorDefaultBtn.addEventListener('click', () => {
      window._camBtnSettings.bgColor = '#000000';
      window._camBtnSettings.opacity = 100;
      const colorPickerEl = document.getElementById('cam-btn-color-picker');
      const opacitySliderEl = document.getElementById('cam-btn-opacity-slider');
      const opacityValueEl = document.getElementById('cam-btn-opacity-value');
      if (colorPickerEl) colorPickerEl.value = '#000000';
      if (opacitySliderEl) opacitySliderEl.value = 100;
      if (opacityValueEl) opacityValueEl.textContent = '100%';
      window._applyCamBtnStyles();
      localStorage.setItem('r1_cam_btn_settings', JSON.stringify(window._camBtnSettings));
    });
  }

  const camBtnFontColorPicker = document.getElementById('cam-btn-font-color-picker');
  if (camBtnFontColorPicker) {
    camBtnFontColorPicker.addEventListener('input', (e) => {
      window._camBtnSettings.fontColor = e.target.value;
      window._applyCamBtnStyles();
      localStorage.setItem('r1_cam_btn_settings', JSON.stringify(window._camBtnSettings));
    });
  }

  const camBtnFontColorDefaultBtn = document.getElementById('cam-btn-font-color-default');
  if (camBtnFontColorDefaultBtn) {
    camBtnFontColorDefaultBtn.addEventListener('click', () => {
      window._camBtnSettings.fontColor = '#ffffff';
      const fontColorPickerEl = document.getElementById('cam-btn-font-color-picker');
      if (fontColorPickerEl) fontColorPickerEl.value = '#ffffff';
      window._applyCamBtnStyles();
      localStorage.setItem('r1_cam_btn_settings', JSON.stringify(window._camBtnSettings));
    });
  }

  const camTapSingleBtn = document.getElementById('cam-tap-single');
  if (camTapSingleBtn) {
    camTapSingleBtn.addEventListener('click', () => {
      window._camBtnSettings.tapMode = 'single';
      const tapHintEl = document.getElementById('cam-tap-current-hint');
      if (tapHintEl) tapHintEl.textContent = 'Current: Single Tap';
      updateCamTapHighlight('single');
      localStorage.setItem('r1_cam_btn_settings', JSON.stringify(window._camBtnSettings));
    });
  }

  const camTapDoubleBtn = document.getElementById('cam-tap-double');
  if (camTapDoubleBtn) {
    camTapDoubleBtn.addEventListener('click', () => {
      window._camBtnSettings.tapMode = 'double';
      const tapHintEl = document.getElementById('cam-tap-current-hint');
      if (tapHintEl) tapHintEl.textContent = 'Current: Double Tap';
      updateCamTapHighlight('double');
      localStorage.setItem('r1_cam_btn_settings', JSON.stringify(window._camBtnSettings));
    });
  }

  const camScreenResetAllBtn = document.getElementById('cam-screen-reset-all');
  if (camScreenResetAllBtn) {
    camScreenResetAllBtn.addEventListener('click', () => {
      window._camBtnSettings = { bgColor: '#000000', opacity: 100, fontColor: '#ffffff', tapMode: 'single', borderColor: '#FE5F00', borderOpacity: 100 };
      const colorPickerEl = document.getElementById('cam-btn-color-picker');
      const opacitySliderEl = document.getElementById('cam-btn-opacity-slider');
      const opacityValueEl = document.getElementById('cam-btn-opacity-value');
      const fontColorPickerEl = document.getElementById('cam-btn-font-color-picker');
      const tapHintEl = document.getElementById('cam-tap-current-hint');
      if (colorPickerEl) colorPickerEl.value = '#000000';
      if (opacitySliderEl) opacitySliderEl.value = 100;
      if (opacityValueEl) opacityValueEl.textContent = '100%';
      if (fontColorPickerEl) fontColorPickerEl.value = '#ffffff';
      if (tapHintEl) tapHintEl.textContent = 'Current: Single Tap';
      const camBorderPickerEl = document.getElementById('cam-btn-border-color-picker');
      const camBorderOpacitySliderEl = document.getElementById('cam-btn-border-opacity-slider');
      const camBorderOpacityValueEl = document.getElementById('cam-btn-border-opacity-value');
      if (camBorderPickerEl) camBorderPickerEl.value = '#FE5F00';
      if (camBorderOpacitySliderEl) camBorderOpacitySliderEl.value = 100;
      if (camBorderOpacityValueEl) camBorderOpacityValueEl.textContent = '100%';
      updateCamTapHighlight('single');
      window._applyCamBtnStyles();
      localStorage.setItem('r1_cam_btn_settings', JSON.stringify(window._camBtnSettings));
    });
  }

  const camBtnBorderColorPicker = document.getElementById('cam-btn-border-color-picker');
  if (camBtnBorderColorPicker) {
    camBtnBorderColorPicker.addEventListener('input', (e) => {
      window._camBtnSettings.borderColor = e.target.value;
      window._applyCamBtnStyles();
      localStorage.setItem('r1_cam_btn_settings', JSON.stringify(window._camBtnSettings));
    });
  }

  const camBtnBorderColorDefaultBtn = document.getElementById('cam-btn-border-color-default');
  if (camBtnBorderColorDefaultBtn) {
    camBtnBorderColorDefaultBtn.addEventListener('click', () => {
      window._camBtnSettings.borderColor = '#FE5F00';
      const pickerEl = document.getElementById('cam-btn-border-color-picker');
      if (pickerEl) pickerEl.value = '#FE5F00';
      window._applyCamBtnStyles();
      localStorage.setItem('r1_cam_btn_settings', JSON.stringify(window._camBtnSettings));
    });
  }

  const camBtnBorderOpacitySlider = document.getElementById('cam-btn-border-opacity-slider');
  if (camBtnBorderOpacitySlider) {
    camBtnBorderOpacitySlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value);
      window._camBtnSettings.borderOpacity = val;
      const opacityValueEl = document.getElementById('cam-btn-border-opacity-value');
      if (opacityValueEl) opacityValueEl.textContent = val + '%';
      window._applyCamBtnStyles();
      localStorage.setItem('r1_cam_btn_settings', JSON.stringify(window._camBtnSettings));
    });
  }
  // ── End Main Camera Screen Settings ─────────────────────────────

  const viewerBtnColorPicker = document.getElementById('viewer-btn-color-picker');
  if (viewerBtnColorPicker) {
    viewerBtnColorPicker.addEventListener('input', (e) => {
      window._viewerBtnSettings.bgColor = e.target.value;
      window._applyViewerBtnStyles();
      localStorage.setItem('r1_viewer_btn_settings', JSON.stringify(window._viewerBtnSettings));
    });
  }

  const viewerBtnOpacitySlider = document.getElementById('viewer-btn-opacity-slider');
  if (viewerBtnOpacitySlider) {
    viewerBtnOpacitySlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value);
      window._viewerBtnSettings.opacity = val;
      const opacityValueEl = document.getElementById('viewer-btn-opacity-value');
      if (opacityValueEl) opacityValueEl.textContent = val + '%';
      window._applyViewerBtnStyles();
      localStorage.setItem('r1_viewer_btn_settings', JSON.stringify(window._viewerBtnSettings));
    });
  }

  const viewerBtnColorDefaultBtn = document.getElementById('viewer-btn-color-default');
  if (viewerBtnColorDefaultBtn) {
    viewerBtnColorDefaultBtn.addEventListener('click', () => {
      window._viewerBtnSettings.bgColor = '#000000';
      window._viewerBtnSettings.opacity = 100;
      const colorPickerEl = document.getElementById('viewer-btn-color-picker');
      const opacitySliderEl = document.getElementById('viewer-btn-opacity-slider');
      const opacityValueEl = document.getElementById('viewer-btn-opacity-value');
      if (colorPickerEl) colorPickerEl.value = '#000000';
      if (opacitySliderEl) opacitySliderEl.value = 100;
      if (opacityValueEl) opacityValueEl.textContent = '100%';
      window._applyViewerBtnStyles();
      localStorage.setItem('r1_viewer_btn_settings', JSON.stringify(window._viewerBtnSettings));
    });
  }

  const viewerBtnFontColorPicker = document.getElementById('viewer-btn-font-color-picker');
  if (viewerBtnFontColorPicker) {
    viewerBtnFontColorPicker.addEventListener('input', (e) => {
      window._viewerBtnSettings.fontColor = e.target.value;
      window._applyViewerBtnStyles();
      localStorage.setItem('r1_viewer_btn_settings', JSON.stringify(window._viewerBtnSettings));
    });
  }

  const viewerBtnFontColorDefaultBtn = document.getElementById('viewer-btn-font-color-default');
  if (viewerBtnFontColorDefaultBtn) {
    viewerBtnFontColorDefaultBtn.addEventListener('click', () => {
      window._viewerBtnSettings.fontColor = '#ffffff';
      const fontColorPickerEl = document.getElementById('viewer-btn-font-color-picker');
      if (fontColorPickerEl) fontColorPickerEl.value = '#ffffff';
      window._applyViewerBtnStyles();
      localStorage.setItem('r1_viewer_btn_settings', JSON.stringify(window._viewerBtnSettings));
    });
  }

  const viewerTapSingleBtn = document.getElementById('viewer-tap-single');
  if (viewerTapSingleBtn) {
    viewerTapSingleBtn.addEventListener('click', () => {
      window._viewerBtnSettings.tapMode = 'single';
      const tapHintEl = document.getElementById('viewer-tap-current-hint');
      if (tapHintEl) tapHintEl.textContent = 'Current: Single Tap';
      updateViewerTapHighlight('single');
      localStorage.setItem('r1_viewer_btn_settings', JSON.stringify(window._viewerBtnSettings));
    });
  }

  const viewerTapDoubleBtn = document.getElementById('viewer-tap-double');
  if (viewerTapDoubleBtn) {
    viewerTapDoubleBtn.addEventListener('click', () => {
      window._viewerBtnSettings.tapMode = 'double';
      const tapHintEl = document.getElementById('viewer-tap-current-hint');
      if (tapHintEl) tapHintEl.textContent = 'Current: Double Tap';
      updateViewerTapHighlight('double');
      localStorage.setItem('r1_viewer_btn_settings', JSON.stringify(window._viewerBtnSettings));
    });
  }

  const viewerScreenResetAllBtn = document.getElementById('viewer-screen-reset-all');
  if (viewerScreenResetAllBtn) {
    viewerScreenResetAllBtn.addEventListener('click', () => {
      window._viewerBtnSettings = { bgColor: '#000000', opacity: 100, fontColor: '#ffffff', tapMode: 'single', borderColor: '#FE5F00', borderOpacity: 100 };
      const colorPickerEl = document.getElementById('viewer-btn-color-picker');
      const opacitySliderEl = document.getElementById('viewer-btn-opacity-slider');
      const opacityValueEl = document.getElementById('viewer-btn-opacity-value');
      const fontColorPickerEl = document.getElementById('viewer-btn-font-color-picker');
      const tapHintEl = document.getElementById('viewer-tap-current-hint');
      if (colorPickerEl) colorPickerEl.value = '#000000';
      if (opacitySliderEl) opacitySliderEl.value = 100;
      if (opacityValueEl) opacityValueEl.textContent = '100%';
      if (fontColorPickerEl) fontColorPickerEl.value = '#ffffff';
      if (tapHintEl) tapHintEl.textContent = 'Current: Single Tap';
      const viewerBorderPickerEl = document.getElementById('viewer-btn-border-color-picker');
      const viewerBorderOpacitySliderEl = document.getElementById('viewer-btn-border-opacity-slider');
      const viewerBorderOpacityValueEl = document.getElementById('viewer-btn-border-opacity-value');
      if (viewerBorderPickerEl) viewerBorderPickerEl.value = '#FE5F00';
      if (viewerBorderOpacitySliderEl) viewerBorderOpacitySliderEl.value = 100;
      if (viewerBorderOpacityValueEl) viewerBorderOpacityValueEl.textContent = '100%';
      updateViewerTapHighlight('single');
      window._applyViewerBtnStyles();
      localStorage.setItem('r1_viewer_btn_settings', JSON.stringify(window._viewerBtnSettings));
    });
  }

  const viewerBtnBorderColorPicker = document.getElementById('viewer-btn-border-color-picker');
  if (viewerBtnBorderColorPicker) {
    viewerBtnBorderColorPicker.addEventListener('input', (e) => {
      window._viewerBtnSettings.borderColor = e.target.value;
      window._applyViewerBtnStyles();
      localStorage.setItem('r1_viewer_btn_settings', JSON.stringify(window._viewerBtnSettings));
    });
  }

  const viewerBtnBorderColorDefaultBtn = document.getElementById('viewer-btn-border-color-default');
  if (viewerBtnBorderColorDefaultBtn) {
    viewerBtnBorderColorDefaultBtn.addEventListener('click', () => {
      window._viewerBtnSettings.borderColor = '#FE5F00';
      const pickerEl = document.getElementById('viewer-btn-border-color-picker');
      if (pickerEl) pickerEl.value = '#FE5F00';
      window._applyViewerBtnStyles();
      localStorage.setItem('r1_viewer_btn_settings', JSON.stringify(window._viewerBtnSettings));
    });
  }

  const viewerBtnBorderOpacitySlider = document.getElementById('viewer-btn-border-opacity-slider');
  if (viewerBtnBorderOpacitySlider) {
    viewerBtnBorderOpacitySlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value);
      window._viewerBtnSettings.borderOpacity = val;
      const opacityValueEl = document.getElementById('viewer-btn-border-opacity-value');
      if (opacityValueEl) opacityValueEl.textContent = val + '%';
      window._applyViewerBtnStyles();
      localStorage.setItem('r1_viewer_btn_settings', JSON.stringify(window._viewerBtnSettings));
    });
  }
  // ── End Gallery Image Viewer Screen Settings ─────────────────────────────

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

  // Style Editor option fields
  const styleRandomizeEl = document.getElementById('style-randomize');
  if (styleRandomizeEl) {
    styleRandomizeEl.addEventListener('change', toggleStyleRandomizeOptions);
  }
  const styleSelectionTypeEl = document.getElementById('style-selection-type');
  if (styleSelectionTypeEl) {
    styleSelectionTypeEl.addEventListener('change', updateStyleSelectionTypeVisibility);
  }
  const styleAddSingleBtn = document.getElementById('style-add-single-option');
  if (styleAddSingleBtn) {
    styleAddSingleBtn.addEventListener('click', () => addStyleSingleOption());
  }
  const styleAddGroupBtn = document.getElementById('style-add-option-group');
  if (styleAddGroupBtn) {
    styleAddGroupBtn.addEventListener('click', () => addStyleOptionGroup());
  }

  // Preset Builder - Randomize options checkbox
  const randomizeCheckboxEl = document.getElementById('preset-builder-randomize');
  if (randomizeCheckboxEl) {
    randomizeCheckboxEl.addEventListener('change', toggleRandomizeOptions);
  }
  
  // Preset Builder - Selection type dropdown
  const selectionTypeSelectEl = document.getElementById('preset-builder-selection-type');
  if (selectionTypeSelectEl) {
    selectionTypeSelectEl.addEventListener('change', updateSelectionTypeVisibility);
  }
  
  // Preset Builder - Add single option button
  const addSingleOptionBtn = document.getElementById('add-single-option');
  if (addSingleOptionBtn) {
    addSingleOptionBtn.addEventListener('click', () => addSingleOption());
  }
  
  // Preset Builder - Add option group button
  const addOptionGroupBtn = document.getElementById('add-option-group');
  if (addOptionGroupBtn) {
    addOptionGroupBtn.addEventListener('click', () => addOptionGroup());
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
    let visiblePresetsFilterDebounce = null;
    visiblePresetsFilter.addEventListener('input', (e) => {
      visiblePresetsFilterText = e.target.value;
      if (visiblePresetsFilterDebounce) clearTimeout(visiblePresetsFilterDebounce);
      visiblePresetsFilterDebounce = setTimeout(() => {
        populateVisiblePresetsList();
      }, 300);
    });
    
    // Hide category footer when field is focused (keyboard appears)
    visiblePresetsFilter.addEventListener('focus', () => {
      isVisiblePresetsFilterFocused = true;
      const categoryHint = document.getElementById('visible-presets-category-hint');
      if (categoryHint) {
        categoryHint.style.display = 'none';
      }
    });
    
    // Show category footer when keyboard dismissed
    visiblePresetsFilter.addEventListener('blur', () => {
      isVisiblePresetsFilterFocused = false;
      // Category footer will be restored by updateVisiblePresetsSelection when needed
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
    let vpUpTimer = null;
    let vpUpCount = 0;
    visiblePresetsJumpUp.addEventListener('click', () => {
      vpUpCount++;
      if (vpUpTimer) clearTimeout(vpUpTimer);
      vpUpTimer = setTimeout(() => {
        vpUpTimer = null;
        const count = vpUpCount;
        vpUpCount = 0;
        const submenu = document.getElementById('visible-presets-submenu');
        const container = submenu ? submenu.querySelector('.submenu-list') : null;
        if (count === 1) {
            // Single-tap: page up
            if (container) {
              container.scrollTop = Math.max(0, container.scrollTop - container.clientHeight);
              const listEl = document.getElementById('visible-presets-list');
              if (listEl) {
                requestAnimationFrame(() => {
                  const allItems = Array.from(listEl.querySelectorAll('.style-item'));
                  const cRect = container.getBoundingClientRect();
                  let firstIdx = 0;
                  for (let ii = 0; ii < allItems.length; ii++) {
                    if (allItems[ii].getBoundingClientRect().top >= cRect.top - 5) { firstIdx = ii; break; }
                  }
                  currentVisiblePresetsIndex = firstIdx;
                  updateVisiblePresetsSelection();
                });
              }
            }
        } else if (count === 2) {
          // Double-tap: jump to previous letter (shared with long-press)
          _jumpVisiblePresetsAlpha('up');
        } else {
          // Triple-tap: jump to very top
          currentVisiblePresetsIndex = 0;
          updateVisiblePresetsSelection();
        }
      }, 300);
    });
    _addAlphaLongPress(visiblePresetsJumpUp, () => _jumpVisiblePresetsAlpha('up'));
  }

  const visiblePresetsJumpDown = document.getElementById('visible-presets-jump-down');
  if (visiblePresetsJumpDown) {
    let vpDownTimer = null;
    let vpDownCount = 0;
    visiblePresetsJumpDown.addEventListener('click', () => {
      vpDownCount++;
      if (vpDownTimer) clearTimeout(vpDownTimer);
      vpDownTimer = setTimeout(() => {
        vpDownTimer = null;
        const count = vpDownCount;
        vpDownCount = 0;
        const submenu = document.getElementById('visible-presets-submenu');
        const container = submenu ? submenu.querySelector('.submenu-list') : null;
        if (count === 1) {
            // Single-tap: page down
            if (container) {
              container.scrollTop = Math.min(
                container.scrollHeight - container.clientHeight,
                container.scrollTop + container.clientHeight
              );
              const listEl = document.getElementById('visible-presets-list');
              if (listEl) {
                requestAnimationFrame(() => {
                  const allItems = Array.from(listEl.querySelectorAll('.style-item'));
                  const cRect = container.getBoundingClientRect();
                  let firstIdx = 0;
                  for (let ii = 0; ii < allItems.length; ii++) {
                    if (allItems[ii].getBoundingClientRect().top >= cRect.top - 5) { firstIdx = ii; break; }
                  }
                  currentVisiblePresetsIndex = firstIdx;
                  updateVisiblePresetsSelection();
                });
              }
            }
        } else if (count === 2) {
          // Double-tap: jump to next letter (shared with long-press)
          _jumpVisiblePresetsAlpha('down');
        } else {
          // Triple-tap: jump to very bottom
          const list = document.getElementById('visible-presets-list');
          if (list) {
            const items = list.querySelectorAll('.style-item');
            if (items.length > 0) {
              currentVisiblePresetsIndex = items.length - 1;
              updateVisiblePresetsSelection();
            }
          }
        }
      }, 300);
    });
    _addAlphaLongPress(visiblePresetsJumpDown, () => _jumpVisiblePresetsAlpha('down'));
  }

// ========== IMAGE EDITOR FUNCTIONALITY ==========
let editorCanvas = null;
let editorCtx = null;
let editorOriginalImage = null;
let editorCurrentImage = null;
let editorHistory = [];
let editorCurrentRotation = 0;
let editorBrightness = 0;
let editorContrast = 0;
let isCropMode = false;
let cropPoint1 = null;
let cropPoint2 = null;

// Open image editor
function openImageEditor() {
  const imageToEdit = galleryImages[currentViewerImageIndex];
  if (!imageToEdit) return;
  
  // Hide viewer, show editor
  document.getElementById('image-viewer').style.display = 'none';
  document.getElementById('image-editor-modal').style.display = 'flex';
  
  // Initialize canvas
  editorCanvas = document.getElementById('editor-canvas');
  editorCtx = editorCanvas.getContext('2d', { willReadFrequently: true });
  
  // Load image
  const img = new Image();
  img.onload = () => {
    editorOriginalImage = img;
    editorCurrentImage = img;
    editorHistory = [];
    editorCurrentRotation = 0;
    editorBrightness = 0;
    editorContrast = 0;
    
    // Reset sliders
    document.getElementById('brightness-slider').value = 0;
    document.getElementById('contrast-slider').value = 0;
    document.getElementById('brightness-value').textContent = '0';
    document.getElementById('contrast-value').textContent = '0';
    
    renderEditorImage();
    updateUndoButton();
  };
  img.src = imageToEdit.imageBase64;
}

// Render current image to canvas
function renderEditorImage() {
  if (!editorCurrentImage || !editorCanvas) return;
  
  // CRITICAL: Keep canvas at ORIGINAL resolution - don't downscale!
  // Canvas dimensions = actual image dimensions
  editorCanvas.width = editorCurrentImage.width;
  editorCanvas.height = editorCurrentImage.height;
  
  // Clear canvas
  editorCtx.clearRect(0, 0, editorCanvas.width, editorCanvas.height);
  
  // Draw image at FULL original resolution
  editorCtx.drawImage(editorCurrentImage, 0, 0);
  
  // Apply brightness and contrast
  if (editorBrightness !== 0 || editorContrast !== 0) {
    applyBrightnessContrast();
  }
  
  // Let CSS handle the display scaling (canvas will auto-scale to fit container)
  // The .editor-canvas CSS already has max-width: 100%; max-height: 100%;
}

// Apply brightness and contrast
function applyBrightnessContrast() {
  const imageData = editorCtx.getImageData(0, 0, editorCanvas.width, editorCanvas.height);
  const data = imageData.data;
  
  const brightness = editorBrightness;
  const contrast = (editorContrast + 100) / 100;
  
  for (let i = 0; i < data.length; i += 4) {
    // Apply contrast
    data[i] = ((data[i] / 255 - 0.5) * contrast + 0.5) * 255;
    data[i + 1] = ((data[i + 1] / 255 - 0.5) * contrast + 0.5) * 255;
    data[i + 2] = ((data[i + 2] / 255 - 0.5) * contrast + 0.5) * 255;
    
    // Apply brightness
    data[i] += brightness;
    data[i + 1] += brightness;
    data[i + 2] += brightness;
    
    // Clamp values
    data[i] = Math.max(0, Math.min(255, data[i]));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1]));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2]));
  }
  
  editorCtx.putImageData(imageData, 0, 0);
}

// Rotate image
function rotateImage() {
  saveToHistory();
  
  editorCurrentRotation = (editorCurrentRotation + 90) % 360;
  
  // Create temporary canvas for rotation
  const tempCanvas = document.createElement('canvas');
  const tempCtx = tempCanvas.getContext('2d');
  
  // Swap width/height for 90° or 270° rotations
  if (editorCurrentRotation === 90 || editorCurrentRotation === 270) {
    tempCanvas.width = editorCurrentImage.height;
    tempCanvas.height = editorCurrentImage.width;
  } else {
    tempCanvas.width = editorCurrentImage.width;
    tempCanvas.height = editorCurrentImage.height;
  }
  
  // Perform rotation
  tempCtx.translate(tempCanvas.width / 2, tempCanvas.height / 2);
  tempCtx.rotate((editorCurrentRotation * Math.PI) / 180);
  tempCtx.drawImage(editorCurrentImage, -editorCurrentImage.width / 2, -editorCurrentImage.height / 2);
  
  // Create new image from rotated canvas
  const rotatedImg = new Image();
  rotatedImg.onload = () => {
    editorCurrentImage = rotatedImg;
    renderEditorImage();
  };
  rotatedImg.src = tempCanvas.toDataURL('image/jpeg', 0.95);
}

// Sharpen image
function sharpenImage() {
  saveToHistory();
  
  const imageData = editorCtx.getImageData(0, 0, editorCanvas.width, editorCanvas.height);
  const data = imageData.data;
  const width = editorCanvas.width;
  const height = editorCanvas.height;
  
  // Create output array
  const output = new Uint8ClampedArray(data);
  
  // Sharpening kernel (3x3)
  const kernel = [
    0, -1, 0,
    -1, 5, -1,
    0, -1, 0
  ];
  
  // Apply convolution
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      for (let c = 0; c < 3; c++) { // RGB channels only
        let sum = 0;
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const pixelIndex = ((y + ky) * width + (x + kx)) * 4 + c;
            const kernelIndex = (ky + 1) * 3 + (kx + 1);
            sum += data[pixelIndex] * kernel[kernelIndex];
          }
        }
        output[(y * width + x) * 4 + c] = Math.max(0, Math.min(255, sum));
      }
    }
  }
  
  // Copy output back to imageData
  for (let i = 0; i < data.length; i += 4) {
    data[i] = output[i];
    data[i + 1] = output[i + 1];
    data[i + 2] = output[i + 2];
  }
  
  editorCtx.putImageData(imageData, 0, 0);
  
  // Save current canvas as new image
  const newImg = new Image();
  newImg.onload = () => {
    editorCurrentImage = newImg;
    renderEditorImage();
  };
  newImg.src = editorCanvas.toDataURL('image/jpeg', 0.95);
}

// Auto-correct (simple enhancement)
function autoCorrect() {
  saveToHistory();
  
  const imageData = editorCtx.getImageData(0, 0, editorCanvas.width, editorCanvas.height);
  const data = imageData.data;
  
  // Simple auto-enhance: increase contrast and saturation slightly
  const contrast = 1.15;
  const saturation = 1.2;
  const brightness = 5;
  
  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];
    
    // Apply contrast
    r = ((r / 255 - 0.5) * contrast + 0.5) * 255;
    g = ((g / 255 - 0.5) * contrast + 0.5) * 255;
    b = ((b / 255 - 0.5) * contrast + 0.5) * 255;
    
    // Apply saturation
    const gray = 0.2989 * r + 0.5870 * g + 0.1140 * b;
    r = gray + saturation * (r - gray);
    g = gray + saturation * (g - gray);
    b = gray + saturation * (b - gray);
    
    // Apply brightness
    r += brightness;
    g += brightness;
    b += brightness;
    
    // Clamp values
    data[i] = Math.max(0, Math.min(255, r));
    data[i + 1] = Math.max(0, Math.min(255, g));
    data[i + 2] = Math.max(0, Math.min(255, b));
  }
  
  editorCtx.putImageData(imageData, 0, 0);
  
  // Save current canvas as new image
  const newImg = new Image();
  newImg.onload = () => {
    editorCurrentImage = newImg;
    renderEditorImage();
  };
  newImg.src = editorCanvas.toDataURL('image/jpeg', 0.95);
}

// Enter crop mode
function enterCropMode() {
  isCropMode = !isCropMode;
  const cropOverlay = document.getElementById('crop-overlay');
  const cropButton = document.getElementById('crop-button');
  
  if (isCropMode) {
    cropOverlay.style.display = 'block';
    cropButton.classList.add('active');
    cropPoint1 = null;
    cropPoint2 = null;
    
    // Reset crop corners to default positions
    const container = document.querySelector('.editor-image-container');
    const containerRect = container.getBoundingClientRect();
    const canvasRect = editorCanvas.getBoundingClientRect();
    
    const topLeft = document.querySelector('.crop-top-left');
    const bottomRight = document.querySelector('.crop-bottom-right');
    
    topLeft.style.left = ((canvasRect.left - containerRect.left) + canvasRect.width * 0.1) + 'px';
    topLeft.style.top = ((canvasRect.top - containerRect.top) + canvasRect.height * 0.1) + 'px';
    
    bottomRight.style.right = (containerRect.right - canvasRect.right + canvasRect.width * 0.1) + 'px';
    bottomRight.style.bottom = (containerRect.bottom - canvasRect.bottom + canvasRect.height * 0.1) + 'px';
    
  } else {
    cropOverlay.style.display = 'none';
    cropButton.classList.remove('active');
  }
}

// Perform crop
function performCrop() {
  if (!isCropMode) return;
  
  saveToHistory();
  
  const container = document.querySelector('.editor-image-container');
  const containerRect = container.getBoundingClientRect();
  const canvasRect = editorCanvas.getBoundingClientRect();
  
  const topLeft = document.querySelector('.crop-top-left');
  const bottomRight = document.querySelector('.crop-bottom-right');
  
  const topLeftRect = topLeft.getBoundingClientRect();
  const bottomRightRect = bottomRight.getBoundingClientRect();
  
  // Calculate crop coordinates relative to canvas
  const x1 = topLeftRect.left - canvasRect.left;
  const y1 = topLeftRect.top - canvasRect.top;
  const x2 = bottomRightRect.right - canvasRect.left;
  const y2 = bottomRightRect.bottom - canvasRect.top;
  
  const cropWidth = x2 - x1;
  const cropHeight = y2 - y1;
  
  if (cropWidth <= 0 || cropHeight <= 0) {
    alert('Invalid crop area');
    return;
  }
  
  // Create cropped image
  const scaleX = editorCurrentImage.width / canvasRect.width;
  const scaleY = editorCurrentImage.height / canvasRect.height;
  
  const sourceX = x1 * scaleX;
  const sourceY = y1 * scaleY;
  const sourceWidth = cropWidth * scaleX;
  const sourceHeight = cropHeight * scaleY;
  
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = sourceWidth;
  tempCanvas.height = sourceHeight;
  const tempCtx = tempCanvas.getContext('2d');
  
  tempCtx.drawImage(
    editorCurrentImage,
    sourceX, sourceY, sourceWidth, sourceHeight,
    0, 0, sourceWidth, sourceHeight
  );
  
  // Create new image from cropped canvas
  const croppedImg = new Image();
  croppedImg.onload = () => {
    editorCurrentImage = croppedImg;
    isCropMode = false;
    document.getElementById('crop-overlay').style.display = 'none';
    document.getElementById('crop-button').classList.remove('active');
    renderEditorImage();
  };
  croppedImg.src = tempCanvas.toDataURL('image/jpeg', 0.95);
}

// Save current state to history
function saveToHistory() {
  const historyItem = {
    image: editorCurrentImage,
    rotation: editorCurrentRotation,
    brightness: editorBrightness,
    contrast: editorContrast
  };
  editorHistory.push(historyItem);
  updateUndoButton();
}

// Undo last action
function undoEdit() {
  if (editorHistory.length === 0) return;
  
  const previousState = editorHistory.pop();
  editorCurrentImage = previousState.image;
  editorCurrentRotation = previousState.rotation;
  editorBrightness = previousState.brightness;
  editorContrast = previousState.contrast;
  
  document.getElementById('brightness-slider').value = editorBrightness;
  document.getElementById('contrast-slider').value = editorContrast;
  document.getElementById('brightness-value').textContent = editorBrightness;
  document.getElementById('contrast-value').textContent = editorContrast;
  
  renderEditorImage();
  updateUndoButton();
}

// Update undo button state
function updateUndoButton() {
  const undoButton = document.getElementById('undo-edit-button');
  undoButton.disabled = editorHistory.length === 0;
}

// Save edited image
async function saveEditedImage() {
  // Get final canvas with all adjustments
  const finalCanvas = document.createElement('canvas');
  finalCanvas.width = editorCanvas.width;
  finalCanvas.height = editorCanvas.height;
  const finalCtx = finalCanvas.getContext('2d');
  
  // Copy current canvas
  finalCtx.drawImage(editorCanvas, 0, 0);
  
  // Convert to base64
  const editedBase64 = finalCanvas.toDataURL('image/jpeg', 0.9);
  
  // Create new image entry
  const newImageData = {
    id: Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9),
    imageBase64: editedBase64,
    timestamp: Date.now(),
    resolution: finalCanvas.width + 'x' + finalCanvas.height
  };
  
  // Add to gallery
  galleryImages.unshift(newImageData);
  await saveImageToDB(newImageData);
  
  // Update the viewer to show the NEW edited image
  currentViewerImageIndex = 0; // The new image is now at index 0
  const viewerImg = document.getElementById('viewer-image');
  viewerImg.src = editedBase64;
  viewerImg.style.transform = 'scale(1) translate(0, 0)';
  viewerZoom = 1;
  
  // Close editor
  closeImageEditor();
  
  // Refresh gallery
  await showGallery(true);
  showGalleryStatusMessage('Edited image saved!', 'success', 3000);
}

// Close image editor
function closeImageEditor() {
  document.getElementById('image-editor-modal').style.display = 'none';
  document.getElementById('image-viewer').style.display = 'flex';
  
  // Reset crop mode
  isCropMode = false;
  document.getElementById('crop-overlay').style.display = 'none';
  document.getElementById('crop-button').classList.remove('active');
}

// ===== CSS FILTER FUNCTIONS (pure canvas — no API call needed) =====

// Helper: commit the current canvas state as a new editorCurrentImage and re-render.
// Called at the end of every filter function, identical to the pattern in autoCorrect/sharpenImage.
function refreshEditorImage() {
  var newImg = new Image();
  newImg.onload = function() {
    editorCurrentImage = newImg;
    renderEditorImage();
  };
  newImg.src = editorCanvas.toDataURL('image/jpeg', 0.95);
}

// Vivid — boost saturation and add a touch of contrast
function applyFilterVivid() {
  saveToHistory();
  var imageData = editorCtx.getImageData(0, 0, editorCanvas.width, editorCanvas.height);
  var data = imageData.data;
  for (var i = 0; i < data.length; i += 4) {
    var r = data[i], g = data[i+1], b = data[i+2];
    var gray = 0.2989*r + 0.5870*g + 0.1140*b;
    var sat = 1.6;
    r = gray + sat*(r-gray);
    g = gray + sat*(g-gray);
    b = gray + sat*(b-gray);
    var con = 1.1;
    r = ((r/255-0.5)*con+0.5)*255;
    g = ((g/255-0.5)*con+0.5)*255;
    b = ((b/255-0.5)*con+0.5)*255;
    data[i]   = Math.max(0, Math.min(255, r));
    data[i+1] = Math.max(0, Math.min(255, g));
    data[i+2] = Math.max(0, Math.min(255, b));
  }
  editorCtx.putImageData(imageData, 0, 0);
  refreshEditorImage();
}

// Warm — lift reds and yellows, pull back blues
function applyFilterWarm() {
  saveToHistory();
  var imageData = editorCtx.getImageData(0, 0, editorCanvas.width, editorCanvas.height);
  var data = imageData.data;
  for (var i = 0; i < data.length; i += 4) {
    data[i]   = Math.min(255, data[i]   + 30);
    data[i+1] = Math.min(255, data[i+1] + 10);
    data[i+2] = Math.max(0,   data[i+2] - 30);
  }
  editorCtx.putImageData(imageData, 0, 0);
  refreshEditorImage();
}

// Cool — lift blues, pull back reds for a cold, clean look
function applyFilterCool() {
  saveToHistory();
  var imageData = editorCtx.getImageData(0, 0, editorCanvas.width, editorCanvas.height);
  var data = imageData.data;
  for (var i = 0; i < data.length; i += 4) {
    data[i]   = Math.max(0,   data[i]   - 20);
    data[i+1] = Math.min(255, data[i+1] + 10);
    data[i+2] = Math.min(255, data[i+2] + 30);
  }
  editorCtx.putImageData(imageData, 0, 0);
  refreshEditorImage();
}

// B&W — convert to luminosity-weighted grayscale
function applyFilterBW() {
  saveToHistory();
  var imageData = editorCtx.getImageData(0, 0, editorCanvas.width, editorCanvas.height);
  var data = imageData.data;
  for (var i = 0; i < data.length; i += 4) {
    var gray = Math.round(0.2989*data[i] + 0.5870*data[i+1] + 0.1140*data[i+2]);
    data[i] = data[i+1] = data[i+2] = gray;
  }
  editorCtx.putImageData(imageData, 0, 0);
  refreshEditorImage();
}

// Fade — compress contrast toward middle gray for a matte, faded-film look
function applyFilterFade() {
  saveToHistory();
  var imageData = editorCtx.getImageData(0, 0, editorCanvas.width, editorCanvas.height);
  var data = imageData.data;
  for (var i = 0; i < data.length; i += 4) {
    data[i]   = Math.max(0, Math.min(255, data[i]   * 0.70 + 50));
    data[i+1] = Math.max(0, Math.min(255, data[i+1] * 0.70 + 50));
    data[i+2] = Math.max(0, Math.min(255, data[i+2] * 0.70 + 50));
  }
  editorCtx.putImageData(imageData, 0, 0);
  refreshEditorImage();
}

// ===== END CSS FILTER FUNCTIONS =====

// Event listeners for image editor
document.getElementById('edit-viewer-image')?.addEventListener('click', openImageEditor);
document.getElementById('close-image-editor')?.addEventListener('click', closeImageEditor);
document.getElementById('rotate-button')?.addEventListener('click', rotateImage);
document.getElementById('sharpen-button')?.addEventListener('click', sharpenImage);
document.getElementById('autocorrect-button')?.addEventListener('click', autoCorrect);
document.getElementById('undo-edit-button')?.addEventListener('click', undoEdit);
document.getElementById('save-edit-button')?.addEventListener('click', saveEditedImage);
document.getElementById('filter-vivid-button')?.addEventListener('click', applyFilterVivid);
document.getElementById('filter-warm-button')?.addEventListener('click', applyFilterWarm);
document.getElementById('filter-cool-button')?.addEventListener('click', applyFilterCool);
document.getElementById('filter-bw-button')?.addEventListener('click', applyFilterBW);
document.getElementById('filter-fade-button')?.addEventListener('click', applyFilterFade);

// Crop button toggles crop mode, then applies crop on second click
let cropClickCount = 0;
document.getElementById('crop-button')?.addEventListener('click', () => {
  if (!isCropMode) {
    enterCropMode();
    cropClickCount = 0;
  } else {
    performCrop();
  }
});

// Brightness slider
document.getElementById('brightness-slider')?.addEventListener('input', (e) => {
  editorBrightness = parseInt(e.target.value);
  document.getElementById('brightness-value').textContent = editorBrightness;
  renderEditorImage();
});

// Contrast slider
document.getElementById('contrast-slider')?.addEventListener('input', (e) => {
  editorContrast = parseInt(e.target.value);
  document.getElementById('contrast-value').textContent = editorContrast;
  renderEditorImage();
});

// Drag crop corners
let draggedCorner = null;

document.querySelectorAll('.crop-corner').forEach(corner => {
  corner.addEventListener('touchstart', (e) => {
    e.preventDefault();
    draggedCorner = corner;
  });
});

document.addEventListener('touchmove', (e) => {
  if (!draggedCorner || !isCropMode) return;
  e.preventDefault();
  
  const touch = e.touches[0];
  const container = document.querySelector('.editor-image-container');
  const containerRect = container.getBoundingClientRect();
  const canvasRect = editorCanvas.getBoundingClientRect();
  
  // Calculate position relative to container
  let x = touch.clientX - containerRect.left;
  let y = touch.clientY - containerRect.top;
  
  // Get canvas boundaries relative to container
  const canvasLeft = canvasRect.left - containerRect.left;
  const canvasTop = canvasRect.top - containerRect.top;
  const canvasRight = canvasRect.right - containerRect.left;
  const canvasBottom = canvasRect.bottom - containerRect.top;
  
  // Get corner size
  const cornerSize = draggedCorner.offsetWidth;
  
  if (draggedCorner.classList.contains('crop-top-left')) {
    // Clamp to canvas boundaries
    x = Math.max(canvasLeft, Math.min(x, canvasRight - cornerSize));
    y = Math.max(canvasTop, Math.min(y, canvasBottom - cornerSize));
    
    // Also ensure it doesn't go past bottom-right corner
    const bottomRight = document.querySelector('.crop-bottom-right');
    const bottomRightRect = bottomRight.getBoundingClientRect();
    const maxX = bottomRightRect.right - containerRect.left - cornerSize * 2;
    const maxY = bottomRightRect.bottom - containerRect.top - cornerSize * 2;
    
    x = Math.min(x, maxX);
    y = Math.min(y, maxY);
    
    draggedCorner.style.left = x + 'px';
    draggedCorner.style.top = y + 'px';
    
  } else if (draggedCorner.classList.contains('crop-bottom-right')) {
    // Clamp to canvas boundaries
    x = Math.max(canvasLeft + cornerSize, Math.min(x, canvasRight));
    y = Math.max(canvasTop + cornerSize, Math.min(y, canvasBottom));
    
    // Also ensure it doesn't go past top-left corner
    const topLeft = document.querySelector('.crop-top-left');
    const topLeftRect = topLeft.getBoundingClientRect();
    const minX = topLeftRect.right - containerRect.left + cornerSize;
    const minY = topLeftRect.bottom - containerRect.top + cornerSize;
    
    x = Math.max(x, minX);
    y = Math.max(y, minY);
    
    draggedCorner.style.right = (containerRect.width - x) + 'px';
    draggedCorner.style.bottom = (containerRect.height - y) + 'px';
  }
});

document.addEventListener('touchend', () => {
  draggedCorner = null;
});

// ========== END IMAGE EDITOR ==========

  // White Balance Settings - COMMENTED OUT
  // const whiteBalanceSettingsBtn = document.getElementById('white-balance-settings-button');
  // if (whiteBalanceSettingsBtn) {
  //   whiteBalanceSettingsBtn.addEventListener('click', showWhiteBalanceSubmenu);
  // }
  
  // const whiteBalanceBackBtn = document.getElementById('white-balance-back');
  // if (whiteBalanceBackBtn) {
  //   whiteBalanceBackBtn.addEventListener('click', hideWhiteBalanceSubmenu);
  // }

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

  const manualOptionsToggleBtn = document.getElementById('manual-options-toggle-button');
  if (manualOptionsToggleBtn) {
    manualOptionsToggleBtn.addEventListener('click', toggleManualOptionsMode);
  }

  const tutorialBtn = document.getElementById('tutorial-button');
  if (tutorialBtn) {
    tutorialBtn.addEventListener('click', showTutorialSubmenu);
  }

  var restoreDeletedBtn = document.getElementById('restore-deleted-button');
  if (restoreDeletedBtn) {
    restoreDeletedBtn.addEventListener('click', showRestoreSubmenu);
  }
  var restoreDeletedBack = document.getElementById('restore-deleted-back');
  if (restoreDeletedBack) {
    restoreDeletedBack.addEventListener('click', hideRestoreSubmenu);
  }
  var restoreTabPresetsEl = document.getElementById('restore-tab-presets');
  if (restoreTabPresetsEl) {
    restoreTabPresetsEl.addEventListener('click', function() { switchRestoreTab('presets'); });
  }
  var restoreTabImagesEl = document.getElementById('restore-tab-images');
  if (restoreTabImagesEl) {
    restoreTabImagesEl.addEventListener('click', function() { switchRestoreTab('images'); });
  }
  var restoreTabMpEl = document.getElementById('restore-tab-mp');
  if (restoreTabMpEl) {
    restoreTabMpEl.addEventListener('click', function() { switchRestoreTab('mp'); });
  }
  // Reset Database submenu
  const resetDbBackBtn = document.getElementById('reset-database-back');
  if (resetDbBackBtn) resetDbBackBtn.addEventListener('click', hideResetDatabaseSubmenu);

  const resetDbClearBtn = document.getElementById('reset-db-clear-btn');
  if (resetDbClearBtn) resetDbClearBtn.addEventListener('click', () => {
    _ALL_RESET_CBS.concat(['reset-cb-default']).forEach(id => {
      const el = document.getElementById(id);
      if (el) el.checked = false;
    });
  });

  const resetDbApplyBtn = document.getElementById('reset-db-apply-btn');
  if (resetDbApplyBtn) resetDbApplyBtn.addEventListener('click', _resetDbShowConfirm);

  const resetDbConfirmYes = document.getElementById('reset-db-confirm-yes');
  if (resetDbConfirmYes) resetDbConfirmYes.addEventListener('click', _resetDbExecute);

  const resetDbConfirmNo = document.getElementById('reset-db-confirm-no');
  if (resetDbConfirmNo) resetDbConfirmNo.addEventListener('click', () => {
    document.getElementById('reset-db-confirm-overlay').style.display = 'none';
  });

  const resetDbSuccessOk = document.getElementById('reset-db-success-ok');
  if (resetDbSuccessOk) resetDbSuccessOk.addEventListener('click', () => {
    document.getElementById('reset-db-success-overlay').style.display = 'none';
    hideResetDatabaseSubmenu();
    renderMenuStyles();
  });

  // "Back to Default" auto-checks all; all checked auto-checks default
  const resetCbDefault = document.getElementById('reset-cb-default');
  if (resetCbDefault) {
    resetCbDefault.addEventListener('change', () => {
      _ALL_RESET_CBS.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.checked = resetCbDefault.checked;
      });
    });
  }

  _ALL_RESET_CBS.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', _resetDbSyncDefaultCheckbox);
  });
  var restoreSelectAllEl = document.getElementById('restore-select-all-btn');
  if (restoreSelectAllEl) {
    restoreSelectAllEl.addEventListener('click', restoreSelectAll);
  }
  var restoreRestoreEl = document.getElementById('restore-restore-btn');
  if (restoreRestoreEl) {
    restoreRestoreEl.addEventListener('click', restoreSelected);
  }
  var restoreDeleteEl = document.getElementById('restore-delete-btn');
  if (restoreDeleteEl) {
    restoreDeleteEl.addEventListener('click', permanentlyDeleteSelected);
  }
  
  const tutorialBackBtn = document.getElementById('tutorial-back');
  if (tutorialBackBtn) {
    tutorialBackBtn.addEventListener('click', hideTutorialSubmenu);
  }
  
// Import presets button handler
  const importPresetsBtn = document.getElementById('import-presets-button');
  if (importPresetsBtn) {
    importPresetsBtn.addEventListener('click', async () => {
      try {
        showLoadingOverlay('Loading presets...');
        // Wait one frame so the browser actually paints the spinner before the heavy work starts
        await new Promise(resolve => setTimeout(resolve, 30));
const result = await presetImporter.import();
        
        if (result.success) {
          // Save preset names that existed BEFORE import (to detect truly new presets)
          const presetsBeforeImport = new Set(CAMERA_PRESETS.map(p => p.name));
          
          // Reload presets (merges imported + modifications)
          CAMERA_PRESETS = await mergePresetsWithStorage();
          _stylesDataVersion++;
          
          // Clean up visible presets after reloading and add only NEW presets
          const validPresetNames = new Set(CAMERA_PRESETS.map(p => p.name));
          
          // Keep existing visible presets that are still valid
          visiblePresets = visiblePresets.filter(name => validPresetNames.has(name));
          
          // Add ONLY truly NEW presets (ones that didn't exist before import) as visible by default
          CAMERA_PRESETS.forEach(preset => {
            if (!presetsBeforeImport.has(preset.name) && !_visiblePresetsSet.has(preset.name)) {
              visiblePresets.push(preset.name);
            }
          });
          
          saveVisiblePresets();
          
          // Update menu display
          populateStylesList();
          updateVisiblePresetsDisplay();
          
          // Update styles count
          const stylesCountElement = document.getElementById('styles-count');
          if (stylesCountElement) {
            const visibleCount = CAMERA_PRESETS.filter(p => _visiblePresetsSet.has(p.name)).length;
            stylesCountElement.textContent = visibleCount;
          }

          // Refresh the camera footer and center indicator immediately
                       updatePresetDisplay();

                      // Re-check accurately how many updates remain after import
                     await recheckForUpdates();
          
                     alert(result.message);
                  } else if (result.message !== 'cancelled' && result.message !== 'No presets selected') {
                     alert('Import failed: ' + result.message);
                  }
      } catch (error) {
        alert('Import error: ' + error.message);
      }
    });
  }

  // Preset File Settings button
  const presetFileSettingsBtn = document.getElementById('preset-file-settings-button');
  if (presetFileSettingsBtn) {
    presetFileSettingsBtn.addEventListener('click', showPresetFileSettingsSubmenu);
  }

  const presetFileSettingsBackBtn = document.getElementById('preset-file-settings-back');
  if (presetFileSettingsBackBtn) {
    presetFileSettingsBackBtn.addEventListener('click', hidePresetFileSettingsSubmenu);
  }

  const importPresetSourceQRBtn = document.getElementById('import-preset-source-qr-btn');
  if (importPresetSourceQRBtn) {
    importPresetSourceQRBtn.addEventListener('click', () => {
      openPresetSourceQRScanner();
    });
  }

  const importPreviewImageQRBtn = document.getElementById('import-preview-image-qr-btn');
  if (importPreviewImageQRBtn) {
    importPreviewImageQRBtn.addEventListener('click', () => {
      openPreviewImageQRScanner();
    });
  }

  const addPresetSourceBtn = document.getElementById('add-preset-source-btn');
  if (addPresetSourceBtn) {
    addPresetSourceBtn.addEventListener('click', async () => {
      const nameInput = document.getElementById('new-preset-source-name');
      const urlInput = document.getElementById('new-preset-source-url');
      const name = (nameInput.value || '').trim();
      const url = (urlInput.value || '').trim();

      if (!url) {
        await customAlert('Please enter a URL.');
        return;
      }
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        await customAlert('URL must start with http:// or https://');
        return;
      }

      const srcs = getCustomPresetSources();

      if (_editingSourceIndex >= 0) {
        // ---- SAVE EDIT MODE ----
        srcs[_editingSourceIndex].name = name || 'Custom Source';
        srcs[_editingSourceIndex].url = url;
        saveCustomPresetSources(srcs);
        clearPresetSourceEditMode();
        renderCustomPresetSourcesList();
        updatePresetFileSettingsHint();
        await customAlert('Source updated. Open Import Presets to load from it.');
      } else {
        // ---- ADD NEW MODE ----
        if (srcs.some(s => s.url === url)) {
          await customAlert('This URL has already been added.');
          return;
        }
        srcs.push({ name: name || 'Custom Source', url, enabled: true });
        saveCustomPresetSources(srcs);
        nameInput.value = '';
        urlInput.value = '';
        renderCustomPresetSourcesList();
        updatePresetFileSettingsHint();
        await customAlert('Source saved. Open Import Presets to load from it. If the source fails to load, you will see a message there.');
      }
    });
  }

  // Convert GitHub to Raw button
  const convertGithubUrlBtn = document.getElementById('convert-github-url-btn');
  if (convertGithubUrlBtn) {
    convertGithubUrlBtn.addEventListener('click', async () => {
      const urlInput = document.getElementById('new-preset-source-url');
      const url = (urlInput.value || '').trim();

      if (!url) {
        await customAlert('Enter a URL in the field above first.');
        return;
      }
      if (url.includes('raw.githubusercontent.com')) {
        await customAlert('This URL is already in raw GitHub format. No conversion needed.');
        return;
      }
      if (!url.includes('github.com')) {
        await customAlert('This is not a GitHub URL. No conversion needed.');
        return;
      }
      // Convert github.com web UI URL to raw.githubusercontent.com content URL
      const rawUrl = url
        .replace(/^https?:\/\/(www\.)?github\.com\//, 'https://raw.githubusercontent.com/')
        .replace('/tree/', '/')
        .replace('/blob/', '/');
      urlInput.value = rawUrl;
      await customAlert(`Converted to raw format:\n${rawUrl}`);
    });
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

  // Tutorial search wiring
  const tutSearchInput = document.getElementById('tutorial-search-input');
  if (tutSearchInput) {
    let tutSearchDebounce = null;
    tutSearchInput.addEventListener('input', () => {
      if (tutSearchDebounce) clearTimeout(tutSearchDebounce);
      tutSearchDebounce = setTimeout(tutorialSearchRun, 200);
    });
  }
  const tutSearchNext = document.getElementById('tutorial-search-next');
  if (tutSearchNext) tutSearchNext.addEventListener('click', tutorialSearchNext);
  const tutSearchPrev = document.getElementById('tutorial-search-prev');
  if (tutSearchPrev) tutSearchPrev.addEventListener('click', tutorialSearchPrev);
  // × button: first click dismisses keyboard, second click clears search

  const tutSearchBlur = document.getElementById('tutorial-search-blur');
  if (tutSearchBlur && tutSearchInput) {
    let tutBlurClickCount = 0;
    let tutBlurClickTimer = null;
    tutSearchBlur.addEventListener('click', () => {
      tutBlurClickCount++;
      if (tutBlurClickCount === 1) {
        tutSearchInput.blur();
        tutBlurClickTimer = setTimeout(() => { tutBlurClickCount = 0; }, 1000);
      } else {
        clearTimeout(tutBlurClickTimer);
        tutBlurClickCount = 0;
        tutSearchInput.value = '';
        tutorialSearchClear();
      }
    });
  }

  const startTourBtn = document.getElementById('start-guided-tour');
  if (startTourBtn) {
    startTourBtn.addEventListener('click', startGuidedTour);
    startTourBtn.addEventListener('touchend', (e) => { e.preventDefault(); startGuidedTour(); });
  }

  const tourSkipBtn = document.getElementById('tour-btn-skip');
  if (tourSkipBtn) {
    tourSkipBtn.addEventListener('click', endGuidedTour);
    tourSkipBtn.addEventListener('touchend', (e) => { e.preventDefault(); endGuidedTour(); });
  }

  const tourBackBtn = document.getElementById('tour-btn-back');
  if (tourBackBtn) {
    tourBackBtn.addEventListener('click', tourBack);
    tourBackBtn.addEventListener('touchend', (e) => { e.preventDefault(); tourBack(); });
  }

  const tourNextBtn = document.getElementById('tour-btn-next');
  if (tourNextBtn) {
    tourNextBtn.addEventListener('click', tourNext);
    tourNextBtn.addEventListener('touchend', (e) => { e.preventDefault(); tourNext(); });
  }  

  const masterPromptToggleBtn = document.getElementById('master-prompt-toggle-btn');
  if (masterPromptToggleBtn) {
    masterPromptToggleBtn.addEventListener('click', () => {
      masterPromptEnabled = !masterPromptEnabled;
      masterPromptToggleBtn.textContent = masterPromptEnabled ? 'ON' : 'OFF';
      masterPromptToggleBtn.style.background = masterPromptEnabled ? 'rgba(76,175,80,0.9)' : 'transparent';
      masterPromptToggleBtn.style.borderColor = masterPromptEnabled ? '#4CAF50' : '#666';
      renderMpSlots();
      saveMasterPrompt();
      
      // Update main screen indicator
      const mpIndicator = document.getElementById('master-prompt-indicator');
      if (mpIndicator) {
        mpIndicator.style.display = masterPromptEnabled ? 'block' : 'none';
      }

      updateMasterPromptDisplay();
      // Sync camera left carousel MP button color
      const camMpBtnChk = document.getElementById('cam-master-prompt-btn');
      if (camMpBtnChk) {
        if (masterPromptEnabled) camMpBtnChk.classList.add('enabled');
        else camMpBtnChk.classList.remove('enabled');
      }
    });
  }
  
  // Wire up MP slot toolbar buttons
  const mpAddBtn = document.getElementById('mp-add-btn');
  if (mpAddBtn) mpAddBtn.addEventListener('click', addMpSlot);

  const mpRemoveBtn = document.getElementById('mp-remove-btn');
  if (mpRemoveBtn) mpRemoveBtn.addEventListener('click', enterMpRemoveMode);

  const mpRemoveConfirmBtn = document.getElementById('mp-remove-confirm-btn');
  if (mpRemoveConfirmBtn) mpRemoveConfirmBtn.addEventListener('click', confirmMpRemove);

  const mpRemoveCancelBtn = document.getElementById('mp-remove-cancel-btn');
  if (mpRemoveCancelBtn) mpRemoveCancelBtn.addEventListener('click', exitMpRemoveMode);

 // Filter blur buttons — first click dismisses keyboard, second click clears text
  function makeFilterBlurBtn(btnId, filterId, onClear) {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    let blurClickCount = 0;
    let blurClickTimer = null;
    btn.addEventListener('click', () => {
      const f = document.getElementById(filterId);
      if (!f) return;
      blurClickCount++;
      if (blurClickCount === 1) {
        // First click: just dismiss keyboard
        f.blur();
        blurClickTimer = setTimeout(() => { blurClickCount = 0; }, 1000);
      } else {
        // Second click within 1 second: clear the field
        clearTimeout(blurClickTimer);
        blurClickCount = 0;
        f.value = '';
        f.dispatchEvent(new Event('input', { bubbles: true }));
        if (onClear) onClear();
      }
    });
  }

  makeFilterBlurBtn('style-filter-blur-btn', 'style-filter', () => {
    styleFilterText = '';
    mainMenuFilterByCategory = '';
    populateStylesList();
  });

  makeFilterBlurBtn('visible-presets-filter-blur-btn', 'visible-presets-filter', () => {
    visiblePresetsFilterText = '';
    visiblePresetsFilterByCategory = '';
    populateVisiblePresetsList();
  });

  makeFilterBlurBtn('preset-filter-blur-btn', 'preset-filter', () => {
    presetFilterText = '';
    galleryPresetFilterByCategory = '';
    populatePresetList();
  });

 const styleFilter = document.getElementById('style-filter');
  let filterDebounceTimeout = null;
  if (styleFilter) {
    styleFilter.addEventListener('input', (e) => {
      styleFilterText = e.target.value;
      
      // Debounce filter updates
      if (filterDebounceTimeout) clearTimeout(filterDebounceTimeout);
      filterDebounceTimeout = setTimeout(() => {
        populateStylesList();
      }, 300); // Wait 300ms after user stops typing
    });
    
    // Hide category footer when field is focused (keyboard appears)
    styleFilter.addEventListener('focus', () => {
      isStyleFilterFocused = true;
      const categoryHint = document.getElementById('menu-category-hint');
      if (categoryHint) {
        categoryHint.style.display = 'none';
      }
    });
    
    // Show category footer when keyboard dismissed
    styleFilter.addEventListener('blur', () => {
      isStyleFilterFocused = false;
      // Category footer will be restored by updateMenuSelection when needed
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
        statusElement.textContent = noMagicMode
          ? `⚡ NO MAGIC MODE • 📸 Burst Mode`
          : `Burst mode ON (${burstCount} photos) • ${CAMERA_PRESETS[currentPresetIndex].name}`;
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
  loadManualOptionsMode();
  loadImportResolution();

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
  
  // Add scroll wheel support for style editor
//  const styleEditorBody = document.querySelector('.style-editor-body');
//  if (styleEditorBody) {
//    styleEditorBody.addEventListener('wheel', (e) => {
//      e.stopPropagation();
//      const delta = e.deltaY;
//      styleEditorBody.scrollTop += delta;
//    }, { passive: true });
//  }

  // Add scroll wheel support for style message textarea
//  const styleMessageTextarea = document.getElementById('style-message');
//  if (styleMessageTextarea) {
//    styleMessageTextarea.addEventListener('wheel', (e) => {
//      const atTop = styleMessageTextarea.scrollTop === 0;
//      const atBottom = styleMessageTextarea.scrollTop + styleMessageTextarea.clientHeight >= styleMessageTextarea.scrollHeight;
//    
    // Only allow scrolling within textarea if not at boundaries
//      if ((e.deltaY < 0 && !atTop) || (e.deltaY > 0 && !atBottom)) {
//        e.stopPropagation();
//      }
//    }, { passive: true });
//  }

  const importResolutionBtn = document.getElementById('import-resolution-settings-button');
  if (importResolutionBtn) {
    importResolutionBtn.addEventListener('click', showImportResolutionSubmenu);
  }
  
  const importResolutionBackBtn = document.getElementById('import-resolution-back');
  if (importResolutionBackBtn) {
    importResolutionBackBtn.addEventListener('click', hideImportResolutionSubmenu);
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
  
  // Gallery Import Button
  const galleryImportBtn = document.getElementById('gallery-import-button');
  if (galleryImportBtn) {
    galleryImportBtn.addEventListener('click', () => {
      qrScannerMode = 'gallery';
      openQRScannerModal();
    });
  }
  
  // QR Scanner Close Button
  const closeQRScannerBtn = document.getElementById('close-qr-scanner');
  if (closeQRScannerBtn) {
    closeQRScannerBtn.addEventListener('click', () => {
      closeQRScannerModal();
    });
  }

  const closeViewerBtn = document.getElementById('close-viewer');
  if (closeViewerBtn) {
    closeViewerBtn.addEventListener('click', closeImageViewer);
  }
  
  const deleteViewerBtn = document.getElementById('delete-viewer-image');
  if (deleteViewerBtn) {
    deleteViewerBtn.addEventListener('click', deleteViewerImage);
  }
  
  const uploadViewerBtn = document.getElementById('upload-viewer-image');
  if (uploadViewerBtn) {
    uploadViewerBtn.addEventListener('click', uploadViewerImage);
  }

  const mpViewerBtn = document.getElementById('mp-viewer-button');
  if (mpViewerBtn) {
    mpViewerBtn.addEventListener('click', () => {
      // Save current viewer image index AND current preset
      savedViewerImageIndex = currentViewerImageIndex;
      window._savedViewerPresetBeforeMaster = window.viewerLoadedPreset || null;

      // Save layer/multi/prompt state so it can also be restored on return
      window._savedGalleryLayerActiveBeforeMaster = isGalleryLayerActive;
      window._savedGalleryLayerPresetsBeforeMaster = [...galleryLayerPresets];
      window._savedGalleryLayerSelectionsBeforeMaster = Object.assign({}, galleryLayerManualSelections);
      window._savedGalleryMultiActiveBeforeMaster = isGalleryMultiActive;
      window._savedGalleryMultiPresetsBeforeMaster = [...galleryMultiPresets];
      window._savedGalleryMultiSelectionsBeforeMaster = Object.assign({}, galleryMultiManualSelections);
      const _phEl = document.getElementById('viewer-preset-header');
      window._savedViewerHeaderBeforeMaster = _phEl ? _phEl.textContent : 'NO PRESET LOADED';
      const _vpEl = document.getElementById('viewer-prompt');
      window._savedViewerPromptBeforeMaster = _vpEl ? _vpEl.value : '';

      // Close image viewer and gallery
      document.getElementById('image-viewer').style.display = 'none';
      document.getElementById('gallery-modal').style.display = 'none';
      
      // Set flag to return to gallery
      returnToGalleryFromMasterPrompt = true;
      
      // Open settings submenu first
      document.getElementById('unified-menu').style.display = 'flex';
      isMenuOpen = true;
      document.getElementById('settings-submenu').style.display = 'flex';
      isSettingsSubmenuOpen = true;
      
      // Use the proper function to show master prompt (loads values correctly)
      showMasterPromptSubmenu();
    });
  }
  
  const optionsViewerBtn = document.getElementById('options-viewer-button');
  if (optionsViewerBtn) {
    optionsViewerBtn.addEventListener('click', () => {
      toggleManualOptionsMode();
      if (manualOptionsMode) {
        optionsViewerBtn.classList.add('enabled');
      } else {
        optionsViewerBtn.classList.remove('enabled');
      }
    });
  }

  // QR Scan Button
  const qrScanBtn = document.getElementById('qr-scan-button');
  if (qrScanBtn) {
    qrScanBtn.addEventListener('click', () => {
      const scanBtn = document.getElementById('qr-scan-button');
      const scannerVideo = document.getElementById('qr-scanner-video');
      
      if (scanBtn) {
        scanBtn.disabled = true;
      }
      
      // Start video playback when scan button is pressed
      if (scannerVideo && scannerVideo.paused) {
        scannerVideo.play();
      }
      
      updateQRScannerStatus('Scanning...', '');
      startQRDetection();
    });
  }

  const closeQrModalBtn = document.getElementById('close-qr-modal');
  if (closeQrModalBtn) {
    closeQrModalBtn.addEventListener('click', closeQrModal);
  }

  // Custom date picker modal logic — uses scrollable button lists (no native OS picker)
  const _MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  function _setDatePickerValue(field, value) {
    const hidden = document.getElementById(`gallery-date-${field}`);
    if (hidden) hidden.value = value;
    const list = document.getElementById(`gallery-date-${field}-list`);
    if (list) {
      list.querySelectorAll('.gallery-date-option-btn').forEach(btn => {
        btn.classList.toggle('date-selected', btn.dataset.value === value);
      });
      const sel = list.querySelector('.date-selected');
      if (sel) sel.scrollIntoView({ block: 'nearest' });
    }
    if (field === 'month' || field === 'year') _populateDatePickerDays();
  }

  function _buildDateList(containerId, items, currentValue, field) {
    const list = document.getElementById(containerId);
    if (!list) return;
    list.innerHTML = '';
    items.forEach(({ label, value }) => {
      const btn = document.createElement('button');
      btn.className = 'gallery-date-option-btn' + (value === currentValue ? ' date-selected' : '');
      btn.dataset.value = value;
      btn.textContent = label;
      btn.addEventListener('click', () => _setDatePickerValue(field, value));
      list.appendChild(btn);
    });
  }

  function _populateDatePickerDays() {
    const monthVal   = (document.getElementById('gallery-date-month') || {}).value || '';
    const yearVal    = (document.getElementById('gallery-date-year')  || {}).value || '';
    const dayVal     = (document.getElementById('gallery-date-day')   || {}).value || '';
    const month      = parseInt(monthVal, 10);
    const year       = parseInt(yearVal,  10) || new Date().getFullYear();
    const total      = month ? new Date(year, month, 0).getDate() : 31;
    const items      = [];
    for (let d = 1; d <= total; d++) {
      const val = String(d).padStart(2, '0');
      items.push({ label: String(d), value: val });
    }
    _buildDateList('gallery-date-day-list', items, dayVal, 'day');
  }

  function openDatePickerModal(type) {
    const modal = document.getElementById('gallery-date-modal');
    const title = document.getElementById('gallery-date-modal-title');
    if (!modal) return;
    modal._dateType = type;
    if (title) title.textContent = type === 'start' ? 'START DATE' : 'END DATE';

    const existing  = type === 'start' ? galleryStartDate : galleryEndDate;
    const parts     = existing ? existing.split('-') : ['', '', ''];
    const curYear   = parts[0] || '';
    const curMonth  = parts[1] || '';
    const curDay    = parts[2] || '';

    // Pre-load hidden inputs so _populateDatePickerDays reads them correctly
    const hidM = document.getElementById('gallery-date-month');
    const hidD = document.getElementById('gallery-date-day');
    const hidY = document.getElementById('gallery-date-year');
    if (hidM) hidM.value = curMonth;
    if (hidD) hidD.value = curDay;
    if (hidY) hidY.value = curYear;

    // Build month buttons
    const monthItems = _MONTHS_SHORT.map((name, i) => ({
      label: name,
      value: String(i + 1).padStart(2, '0')
    }));
    _buildDateList('gallery-date-month-list', monthItems, curMonth, 'month');

    // Build year buttons (newest first)
    const nowYear = new Date().getFullYear();
    const yearItems = [];
    for (let y = nowYear; y >= 2020; y--) {
      yearItems.push({ label: String(y), value: String(y) });
    }
    _buildDateList('gallery-date-year-list', yearItems, curYear, 'year');

    // Build day buttons (respects current month/year)
    _populateDatePickerDays();

    modal.style.display = 'flex';
  }

  // OK button — confirm the selected date
  const _dateOkBtn = document.getElementById('gallery-date-ok');
  if (_dateOkBtn) {
    _dateOkBtn.addEventListener('click', () => {
      const modal    = document.getElementById('gallery-date-modal');
      const monthVal = (document.getElementById('gallery-date-month') || {}).value || '';
      const dayVal   = (document.getElementById('gallery-date-day')   || {}).value || '';
      const yearVal  = (document.getElementById('gallery-date-year')  || {}).value || '';
      const type     = modal._dateType;
      if (monthVal && dayVal && yearVal) {
        const dateValue = `${yearVal}-${monthVal}-${dayVal}`;
        if (type === 'start') {
          galleryStartDate = dateValue;
          updateDateButtonText('start', galleryStartDate);
        } else {
          galleryEndDate = dateValue;
          updateDateButtonText('end', galleryEndDate);
        }
        onGalleryFilterChange();
      }
      modal.style.display = 'none';
    });
  }

  // Clear button — wipe the date filter
  const _dateClearBtn = document.getElementById('gallery-date-clear');
  if (_dateClearBtn) {
    _dateClearBtn.addEventListener('click', () => {
      const modal = document.getElementById('gallery-date-modal');
      const type  = modal._dateType;
      if (type === 'start') {
        galleryStartDate = null;
        updateDateButtonText('start', null);
      } else {
        galleryEndDate = null;
        updateDateButtonText('end', null);
      }
      onGalleryFilterChange();
      modal.style.display = 'none';
    });
  }

  // Cancel button — close without changes
  const _dateCancelBtn = document.getElementById('gallery-date-cancel');
  if (_dateCancelBtn) {
    _dateCancelBtn.addEventListener('click', () => {
      document.getElementById('gallery-date-modal').style.display = 'none';
    });
  }

  // Tap the dark overlay to cancel
  const _dateOverlay = document.querySelector('#gallery-date-modal .gallery-custom-modal-overlay');
  if (_dateOverlay) {
    _dateOverlay.addEventListener('click', () => {
      document.getElementById('gallery-date-modal').style.display = 'none';
    });
  }

  const startDateBtn = document.getElementById('gallery-start-date-btn');
  const startDateInput = document.getElementById('gallery-start-date');
  if (startDateBtn) {
    startDateBtn.addEventListener('click', () => openDatePickerModal('start'));
  }
  if (startDateInput) {
    startDateInput.addEventListener('change', (e) => {
      galleryStartDate = e.target.value || null;
      updateDateButtonText('start', galleryStartDate);
      onGalleryFilterChange();
    });
  }

  const endDateBtn = document.getElementById('gallery-end-date-btn');
  const endDateInput = document.getElementById('gallery-end-date');
  if (endDateBtn) {
    endDateBtn.addEventListener('click', () => openDatePickerModal('end'));
  }
  if (endDateInput) {
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

  // Custom sort modal wiring
  const _gallerySortBtn   = document.getElementById('gallery-sort-btn');
  const _gallerySortModal = document.getElementById('gallery-sort-modal');

  if (_gallerySortBtn && _gallerySortModal) {
    _gallerySortBtn.addEventListener('click', () => {
      // Highlight whichever option is currently active
      document.querySelectorAll('#gallery-sort-modal .gallery-custom-modal-option').forEach(opt => {
        opt.classList.toggle('active-sort', opt.dataset.value === gallerySortOrder);
      });
      _gallerySortModal.style.display = 'flex';
    });

    // Each option button picks a sort order and closes
    document.querySelectorAll('#gallery-sort-modal .gallery-custom-modal-option').forEach(opt => {
      opt.addEventListener('click', () => {
        const newSort = opt.dataset.value;
        if (sortOrderSelect) {
          sortOrderSelect.value = newSort;
          sortOrderSelect.dispatchEvent(new Event('change'));
        }
        const _sortLabel = document.getElementById('gallery-sort-label');
        if (_sortLabel) {
          _sortLabel.textContent = '🔀 SORT';
        }
        _gallerySortModal.style.display = 'none';
      });
    });

    // Cancel button
    const _sortCancelBtn = document.getElementById('gallery-sort-cancel');
    if (_sortCancelBtn) {
      _sortCancelBtn.addEventListener('click', () => {
        _gallerySortModal.style.display = 'none';
      });
    }

    // Tap the dark overlay to cancel
    const _sortOverlay = _gallerySortModal.querySelector('.gallery-custom-modal-overlay');
    if (_sortOverlay) {
      _sortOverlay.addEventListener('click', () => {
        _gallerySortModal.style.display = 'none';
      });
    }
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

  // EDITOR button now handles what the viewer prompt used to handle
  const viewerEditorBtn = document.getElementById('viewer-editor-button');
  if (viewerEditorBtn) {
    viewerEditorBtn.addEventListener('click', handleViewerPromptTap);
  }

  // Keep the hidden textarea from triggering anything
  const viewerPromptInput = document.getElementById('viewer-prompt');
  if (viewerPromptInput) {
    viewerPromptInput.addEventListener('input', () => {
      window.viewerLoadedPreset = null;
      // Clear layer mode — user is now typing a custom prompt
      clearGalleryLayerState();
      const promptHeader = document.getElementById('viewer-preset-header');
      if (promptHeader) promptHeader.textContent = 'CUSTOM PROMPT';
    });
  }

  const closePresetSelectorBtn = document.getElementById('close-preset-selector');
  if (closePresetSelectorBtn) {
    closePresetSelectorBtn.addEventListener('click', hidePresetSelector);
  }
  
  const presetFilter = document.getElementById('preset-filter');
  if (presetFilter) {
    let presetFilterDebounce = null;
    presetFilter.addEventListener('input', (e) => {
      presetFilterText = e.target.value;
      if (presetFilterDebounce) clearTimeout(presetFilterDebounce);
      presetFilterDebounce = setTimeout(() => {
        populatePresetList();
      }, 300);
    });
    
    // Hide footer and controls when user starts typing (keyboard appears)
    presetFilter.addEventListener('focus', () => {
      isPresetFilterFocused = true;
      // Hide category footer
      const categoryHint = document.getElementById('preset-selector-category-hint');
      if (categoryHint) {
        categoryHint.style.display = 'none';
      }
      
      // Hide multi-preset controls if they exist
      const multiControls = document.getElementById('multi-preset-controls');
      if (multiControls) {
        multiControls.style.display = 'none';
      }
    });
    
    // Show them back when user is done typing (keyboard dismissed)
    presetFilter.addEventListener('blur', () => {
      isPresetFilterFocused = false;
      // Only restore multi-preset controls if we're in multi-preset mode
      if (isMultiPresetMode) {
        const multiControls = document.getElementById('multi-preset-controls');
        if (multiControls) {
          multiControls.style.display = 'flex';
        }
      }
      
      // Category footer will be restored by updatePresetSelection when needed
    });
  }
  
  const presetSelectorJumpUp = document.getElementById('preset-selector-jump-up');
  if (presetSelectorJumpUp) {
    let psUpTimer = null;
    let psUpCount = 0;
    presetSelectorJumpUp.addEventListener('click', () => {
      psUpCount++;
      if (psUpTimer) clearTimeout(psUpTimer);
      psUpTimer = setTimeout(() => {
        psUpTimer = null;
        const count = psUpCount;
        psUpCount = 0;
        const container = document.querySelector('.preset-list');
        if (count === 1) {
          // Single-tap: page up + sync highlight to first visible item
          if (container) {
            container.scrollTop = Math.max(0, container.scrollTop - container.clientHeight);
          }
          const list = document.getElementById('preset-list');
          if (list && container) {
            const items = list.querySelectorAll('.preset-item');
            const containerTop = container.getBoundingClientRect().top;
            for (let i = 0; i < items.length; i++) {
              if (items[i].getBoundingClientRect().top >= containerTop) {
                currentPresetIndex_Gallery = i;
                break;
              }
            }
            updatePresetSelection();
          }
        } else if (count === 2) {
          // Double-tap: jump to previous letter (shared with long-press)
          _jumpPresetSelectorAlpha('up');
        } else {
          // Triple-tap: jump to very top
          currentPresetIndex_Gallery = 0;
          updatePresetSelection();
        }
      }, 300);
    });
    _addAlphaLongPress(presetSelectorJumpUp, () => _jumpPresetSelectorAlpha('up'));
  }

  const presetSelectorJumpDown = document.getElementById('preset-selector-jump-down');
  if (presetSelectorJumpDown) {
    let psDownTimer = null;
    let psDownCount = 0;
    presetSelectorJumpDown.addEventListener('click', () => {
      psDownCount++;
      if (psDownTimer) clearTimeout(psDownTimer);
      psDownTimer = setTimeout(() => {
        psDownTimer = null;
        const count = psDownCount;
        psDownCount = 0;
        const container = document.querySelector('.preset-list');
        if (count === 1) {
          // Single-tap: page down + sync highlight to first visible item
          if (container) {
            container.scrollTop = Math.min(
              container.scrollHeight - container.clientHeight,
              container.scrollTop + container.clientHeight
            );
          }
          const list = document.getElementById('preset-list');
          if (list && container) {
            const items = list.querySelectorAll('.preset-item');
            const containerTop = container.getBoundingClientRect().top;
            for (let i = 0; i < items.length; i++) {
              if (items[i].getBoundingClientRect().top >= containerTop) {
                currentPresetIndex_Gallery = i;
                break;
              }
            }
            updatePresetSelection();
          }
        } else if (count === 2) {
          // Double-tap: jump to next letter (shared with long-press)
          _jumpPresetSelectorAlpha('down');
        } else {
          // Triple-tap: jump to very bottom
          const list = document.getElementById('preset-list');
          if (list) {
            const items = list.querySelectorAll('.preset-item');
            if (items.length > 0) {
              currentPresetIndex_Gallery = items.length - 1;
              updatePresetSelection();
            }
          }
        }
      }, 300);
    });
    _addAlphaLongPress(presetSelectorJumpDown, () => _jumpPresetSelectorAlpha('down'));
  }

  const magicBtn = document.getElementById('magic-button');
  if (magicBtn) {
    magicBtn.addEventListener('click', submitMagicTransform);
  }
  
  const batchModeToggle = document.getElementById('batch-mode-toggle');
  if (batchModeToggle) {
    batchModeToggle.addEventListener('click', toggleBatchMode);
  }

  const batchNewFolder = document.getElementById('batch-new-folder');
  if (batchNewFolder) {
    batchNewFolder.addEventListener('click', createNewFolder);
  }

  const batchSelectAll = document.getElementById('batch-select-all');
  if (batchSelectAll) {
    batchSelectAll.addEventListener('click', selectAllBatchImages);
  }

  const closeMoveToFolder = document.getElementById('close-move-to-folder');
  if (closeMoveToFolder) {
    closeMoveToFolder.addEventListener('click', () => {
      document.getElementById('move-to-folder-modal').style.display = 'none';
    });
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

  const batchCombine = document.getElementById('batch-combine');
  if (batchCombine) {
    batchCombine.addEventListener('click', combineTwoImages);
  }

  const batchDelete = document.getElementById('batch-delete');
  if (batchDelete) {
    batchDelete.addEventListener('click', batchDeleteImages);
  }

  // Load folder structure
  loadFolders();

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
  setupViewerSwipeNavigation();

});

// Make functions available globally for inline onclick handlers
window.removeFromQueue = removeFromQueue;
window.previewQueueItem = previewQueueItem;
window.clearQueue = clearQueue;
window.tourNext = tourNext;
window.tourBack = tourBack;
window.endGuidedTour = endGuidedTour;
window.startGuidedTour = startGuidedTour;

// Upload image to gofile.io
async function uploadViewerImage() {
  if (currentViewerImageIndex < 0) return;
  
  const statusElement = document.getElementById('status');
  const uploadBtn = document.getElementById('upload-viewer-image');
  
  try {
    // Disable button and show status
    uploadBtn.disabled = true;
      uploadBtn.innerHTML = '⏳';
    if (statusElement) {
      statusElement.style.display = 'block';
      statusElement.textContent = 'Getting server...';
    }
    
    // Step 1: Get the best server from gofile.io
    const serverResponse = await fetch('https://api.gofile.io/servers');
    if (!serverResponse.ok) {
      throw new Error('Failed to get upload server');
    }
    const serverData = await serverResponse.json();
    
    if (serverData.status !== 'ok' || !serverData.data || !serverData.data.servers || serverData.data.servers.length === 0) {
      throw new Error('No upload servers available');
    }
    
    // Use the first available server
    const server = serverData.data.servers[0].name;
    
    if (statusElement) {
      statusElement.textContent = 'Uploading image...';
    }
    
    const imageData = galleryImages[currentViewerImageIndex];
    // Convert base64 to blob
    const base64Data = imageData.imageBase64.split(',')[1];
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/png' });
    
    // Create form data for gofile.io
    const formData = new FormData();
    formData.append('file', blob, `magic-kamera-${Date.now()}.png`);
    
    // Step 2: Upload to the assigned server (no token needed for guest uploads)
    const uploadUrl = `https://${server}.gofile.io/uploadFile`;
    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error('Upload failed - status: ' + response.status);
    }
    
    // gofile.io returns JSON with the download URL
    const result = await response.json();
    
    if (result.status !== 'ok' || !result.data || !result.data.downloadPage) {
      throw new Error('Upload failed: ' + (result.status || 'unknown error'));
    }
    
    const downloadUrl = result.data.downloadPage;
    
    if (statusElement) {
      statusElement.textContent = 'Upload successful!';
      setTimeout(() => {
        statusElement.style.display = 'none';
      }, 2000);
    }
    
    // Show QR code
    showQrCode(downloadUrl.trim());
    
  } catch (error) {
    console.error('Upload error:', error);
    if (statusElement) {
      statusElement.textContent = 'Upload failed: ' + error.message;
      setTimeout(() => {
        statusElement.style.display = 'none';
      }, 4000);
    }
  } finally {
    // Re-enable button
    uploadBtn.disabled = false;
      uploadBtn.innerHTML = '📤<br><span class="viewer-carousel-label">Export</span>';
  }
}

// Show QR code modal
function showQrCode(url) {
  const qrModal = document.getElementById('qr-modal');
  const qrContainer = document.getElementById('qr-code-container');
  const qrUrlText = document.getElementById('qr-url-text');
  
  if (!qrModal || !qrContainer || !qrUrlText) return;
  
  // Clear previous QR code
  qrContainer.innerHTML = '';
  
  // Generate new QR code
  new QRCode(qrContainer, {
    text: url,
    width: 128,
    height: 128,
    colorDark: '#000000',
    colorLight: '#ffffff',
    correctLevel: QRCode.CorrectLevel.H
  });
  
  // Set URL text
  qrUrlText.textContent = url;
  
  // Show modal
  qrModal.style.display = 'flex';
}

// Close QR code modal
function closeQrModal() {
  const qrModal = document.getElementById('qr-modal');
  if (qrModal) {
    qrModal.style.display = 'none';
  }
}

// Open QR Scanner Modal
function openPresetSourceQRScanner() {
  qrScannerMode = 'preset-source';
  const titleEl = document.querySelector('#qr-scanner-modal .qr-scanner-header h4');
  if (titleEl) titleEl.textContent = 'Scan QR Code — Preset JSON Source';
  openQRScannerModal();
}

function openPreviewImageQRScanner() {
  qrScannerMode = 'preview-image';
  const titleEl = document.querySelector('#qr-scanner-modal .qr-scanner-header h4');
  if (titleEl) titleEl.textContent = 'Scan QR Code — Preview Image';
  openQRScannerModal();
}

async function importPreviewImageFromQR(url) {
  // Reset scanner mode back to default
  qrScannerMode = 'gallery';
  const titleEl = document.querySelector('#qr-scanner-modal .qr-scanner-header h4');
  if (titleEl) titleEl.textContent = 'Scan QR Code to Import';

  closeQRScannerModal();
  if (!url || !url.trim()) return;

  showLoadingOverlay('Downloading preview image...');
  try {
    const imageUrl = url.trim();
    const proxies = [
      '',
      'https://wsrv.nl/?url=',
      'https://corsproxy.io/?',
      'https://api.allorigins.win/raw?url=',
      'https://api.codetabs.com/v1/proxy?quest='
    ];

    let response = null;
    for (let i = 0; i < proxies.length; i++) {
      try {
        const fetchUrl = proxies[i] ? proxies[i] + encodeURIComponent(imageUrl) : imageUrl;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000);
        const res = await fetch(fetchUrl, { signal: controller.signal });
        clearTimeout(timeoutId);
        if (res.ok) { response = res; break; }
      } catch (e) { continue; }
    }

    if (!response || !response.ok) throw new Error('All download methods failed. Check the URL and try again.');

    let blob = await response.blob();
    const isImageType = blob.type.startsWith('image/');
    const isOctetStream = blob.type === 'application/octet-stream' || blob.type === '';
    if (blob.type && !isImageType && !isOctetStream) throw new Error('Not an image file: ' + blob.type);

    // Resize to a reasonable preview size
    const previewResizeResult = await resizeAndCompressImage(blob, 800, 800, 0.85);
    blob = previewResizeResult.blob;

    const base64Data = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('FileReader error'));
      reader.readAsDataURL(blob);
    });

    hideLoadingOverlay();

    const imageData = {
      id: Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9),
      imageBase64: base64Data,
      timestamp: Date.now()
    };

    await savePreviewImageToDB(imageData);
    previewGalleryImages.unshift(imageData);
    renderPreviewGallery();

    const hintEl = document.getElementById('preview-image-import-hint');
    if (hintEl) {
      hintEl.textContent = '✓ Preview image imported successfully!';
      hintEl.style.display = 'block';
      setTimeout(() => { hintEl.style.display = 'none'; }, 4000);
    }

  } catch (err) {
    hideLoadingOverlay();
    await customAlert('Failed to import preview image: ' + err.message);
  }
}

async function importPresetSourceFromQR(url) {
  // Reset modal title back to gallery default for future use
  qrScannerMode = 'gallery';
  const titleEl = document.querySelector('#qr-scanner-modal .qr-scanner-header h4');
  if (titleEl) titleEl.textContent = 'Scan QR Code to Import';

  closeQRScannerModal();

  if (!url || !url.trim()) return;

  // Immediately fetch and validate the scanned URL before doing anything else
  showLoadingOverlay('Validating preset source...');
  try {
    const response = await fetch(url.trim());
    if (!response.ok) {
      hideLoadingOverlay();
      await customAlert('Could not reach the scanned URL. Make sure the file is publicly accessible and try again.');
      return;
    }

    let data;
    try {
      data = await response.json();
    } catch (parseErr) {
      hideLoadingOverlay();
      await customAlert('The scanned URL does not point to a valid JSON file. Only JSON preset files may be added as sources.');
      return;
    }

    if (!Array.isArray(data) || data.length === 0) {
      hideLoadingOverlay();
      await customAlert('The scanned file is not a valid preset source. It must be a JSON array containing at least one preset.');
      return;
    }

    const validPresets = data.filter(p => p.name && p.message);
    if (validPresets.length === 0) {
      hideLoadingOverlay();
      await customAlert('The scanned JSON file does not contain any valid presets. Each preset must have at least a name and a message field.');
      return;
    }

    hideLoadingOverlay();

    // Validation passed — derive a display name from the filename in the URL
    let derivedName = '';
    try {
      const parts = url.split('/');
      const filename = parts[parts.length - 1];
      derivedName = filename
        .replace(/\.json$/i, '')
        .replace(/[-_]/g, ' ')
        .trim()
        .split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
    } catch (e) {}

    // Populate the existing Add Custom Source form inputs
    const nameInput = document.getElementById('new-preset-source-name');
    const urlInput  = document.getElementById('new-preset-source-url');
    if (nameInput) nameInput.value = derivedName || 'Custom Presets';
    if (urlInput)  urlInput.value  = url.trim();

    // Scroll the submenu list down so the form is visible
    const submenuList = document.querySelector('#preset-file-settings-submenu .submenu-list');
    if (submenuList) setTimeout(() => { submenuList.scrollTop = submenuList.scrollHeight; }, 100);

    // Show the inline hint confirming the scan and validation
    const hintEl = document.getElementById('preset-source-qr-hint');
    if (hintEl) {
      hintEl.textContent = `✓ Valid preset source confirmed — ${validPresets.length} preset${validPresets.length !== 1 ? 's' : ''} found. Edit the name if needed, then tap + Add Source.`;
      hintEl.style.display = 'block';
      setTimeout(() => { hintEl.style.display = 'none'; }, 8000);
    }

  } catch (err) {
    hideLoadingOverlay();
    await customAlert('Failed to validate the scanned URL: ' + err.message);
  }
}

function openQRScannerModal() {
  const scannerModal = document.getElementById('qr-scanner-modal');
  const scannerVideo = document.getElementById('qr-scanner-video');
  
  if (!scannerModal || !scannerVideo) return;
  
  // Show modal
  scannerModal.style.display = 'flex';
  
  // Start camera for QR scanning (but don't start detection yet)
  startQRScannerCamera();
  
  // Reset status
  updateQRScannerStatus('Ready to scan', '');
  
  // Enable scan button
  const scanBtn = document.getElementById('qr-scan-button');
  if (scanBtn) {
    scanBtn.disabled = false;
  }
}

// Close QR Scanner Modal
function closeQRScannerModal() {
  const scannerModal = document.getElementById('qr-scanner-modal');
  if (scannerModal) {
    scannerModal.style.display = 'none';
  }
  
  // Stop QR detection and camera
  stopQRDetection();
  stopQRScannerCamera();
  
  // Reset status
  updateQRScannerStatus('Point camera at QR code...', '');
}

// Start camera for QR scanner
async function startQRScannerCamera() {
  const scannerVideo = document.getElementById('qr-scanner-video');
  
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' }
    });
    
    scannerVideo.srcObject = stream;
    
    // Pause the video until user presses scan button
    scannerVideo.onloadedmetadata = () => {
      scannerVideo.pause();
      updateQRScannerStatus('Ready to scan', '');
    };
  } catch (error) {
    console.error('Error starting QR scanner camera:', error);
    updateQRScannerStatus('Camera access denied', 'error');
  }
}

// Stop QR scanner camera
function stopQRScannerCamera() {
  const scannerVideo = document.getElementById('qr-scanner-video');
  
  if (scannerVideo && scannerVideo.srcObject) {
    const tracks = scannerVideo.srcObject.getTracks();
    tracks.forEach(track => track.stop());
    scannerVideo.srcObject = null;
  }
}

// Update QR scanner status message
function updateQRScannerStatus(message, type = '') {
  const statusElement = document.getElementById('qr-scanner-status');
  if (statusElement) {
    statusElement.textContent = message;
    statusElement.className = 'qr-scanner-status';
    if (type) {
      statusElement.classList.add(type);
    }
  }
}

function playTaDaSound() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) {
      const ctx = new AudioCtx();
      const notes = [523.25, 659.25, 783.99, 1046.5];
      const delays = [0, 0.08, 0.16, 0.28];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        osc.type = 'triangle';
        const t = ctx.currentTime + delays[i];
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.22, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
        osc.start(t);
        osc.stop(t + 0.35);
      });
      setTimeout(() => { try { ctx.close(); } catch(e){} }, 1500);
    }
  } catch (e) { /* non-critical */ }
}

// Shared helper behind showGalleryCreditFlash / showGalleryPresetFlash.
// Remembers the TRUE original header text the first time a flash starts, and
// only restores to that (not to whatever the other flash left behind) once
// the most recent flash's timer finishes. Keeps overlapping flashes from
// permanently overwriting the header if they happen close together.
let _viewerHeaderTrueText = null;
let _viewerHeaderRestoreTimer = null;
let _viewerHeaderBusy = false;
let _viewerHeaderPendingFlash = null;
let _gallerySubmitShowNames = false;

function _flashViewerHeader(message, duration, multiline, withSound) {
  if (_viewerHeaderBusy) {
    // The submitting spinner is up — save this flash (and its chime) and show
    // it right after the spinner finishes, instead of dropping it. This is how
    // the credits popup AND its sound land together AFTER "Submitting..."
    // rather than getting lost behind it.
    _viewerHeaderPendingFlash = { message, duration, multiline, withSound };
    return;
  }
  const header = document.getElementById('viewer-preset-header');
  if (!header) return;
  if (_viewerHeaderRestoreTimer) {
    clearTimeout(_viewerHeaderRestoreTimer);
  } else {
    _viewerHeaderTrueText = header.textContent;
  }
  if (multiline) {
    header.style.whiteSpace = 'pre-line';
    header.style.lineHeight = '1.3';
    header.style.fontSize = '2.8vw';
  }
  // Play the chime at the exact moment the message becomes visible
  if (withSound) playTaDaSound();
  header.textContent = message;
  _viewerHeaderRestoreTimer = setTimeout(() => {
    header.textContent = _viewerHeaderTrueText;
    header.style.whiteSpace = '';
    header.style.lineHeight = '';
    header.style.fontSize = '';
    _viewerHeaderTrueText = null;
    _viewerHeaderRestoreTimer = null;
  }, duration);
}

function showGalleryCreditFlash(message) {
  _flashViewerHeader(message, 3500, true, true);
}

// Brief static message for when a preset gets queued while offline — nothing
// is actively being sent yet, so no spinner here.
function showGalleryPresetFlash(message) {
  _flashViewerHeader(message, 3000, false);
}

// Writes the spinner icon plus a text message into the viewer header.
function _setSubmittingHeaderText(message) {
  const header = document.getElementById('viewer-preset-header');
  if (!header) return;
  header.innerHTML = '<span class="header-spin-icon"></span>';
  header.appendChild(document.createTextNode(message));
}

// Shows a spinning indicator in the viewer's top preset header while presets
// are actively being sent to the AI. Stays up until hideGallerySubmittingIndicator()
// is called — it does not time out on its own, since a submission can take a
// few seconds depending on how many presets are queued.
// If showNames is true, the sync engine will replace the message with the
// name of each preset as it gets sent (see updateGallerySubmittingIndicator).
function showGallerySubmittingIndicator(message, showNames = false) {
  const header = document.getElementById('viewer-preset-header');
  if (!header) return;
  if (_viewerHeaderRestoreTimer) {
    // A brief popup (e.g. the credits message) is on screen right now.
    // The REAL title is the one that popup saved — keep that, and never
    // treat the popup text itself as the title to restore later.
    clearTimeout(_viewerHeaderRestoreTimer);
    _viewerHeaderRestoreTimer = null;
    header.style.whiteSpace = '';
    header.style.lineHeight = '';
    header.style.fontSize = '';
  } else if (!_viewerHeaderBusy) {
    _viewerHeaderTrueText = header.textContent;
  }
  _viewerHeaderBusy = true;
  _gallerySubmitShowNames = showNames;
  _setSubmittingHeaderText(message);
}

// Called by the sync engine each time it starts sending a queued item, so the
// gallery header can count down by showing WHICH preset is going out right now.
// Does nothing unless the gallery submitting indicator is up in names mode.
function updateGallerySubmittingIndicator(presetName) {
  if (!_viewerHeaderBusy || !_gallerySubmitShowNames) return;
  let name = presetName || 'preset';
  // Truncate long preset names so the message always fits the header
  if (name.length > 16) name = name.slice(0, 16);
  _setSubmittingHeaderText('Submitting ' + name + '...');
}

function hideGallerySubmittingIndicator() {
  if (!_viewerHeaderBusy) return;
  _viewerHeaderBusy = false;
  _gallerySubmitShowNames = false;
  const header = document.getElementById('viewer-preset-header');
  if (header) {
    header.textContent = _viewerHeaderTrueText;
  }
  _viewerHeaderTrueText = null;
  // If a credit popup (or any other flash) tried to appear while we were
  // busy submitting, show it now that the header is free again.
  if (_viewerHeaderPendingFlash) {
    const pending = _viewerHeaderPendingFlash;
    _viewerHeaderPendingFlash = null;
    _flashViewerHeader(pending.message, pending.duration, pending.multiline, pending.withSound);
  }
}

// Resolves once the shared sync engine finishes (or immediately if it's not
// running) — lets the gallery know when to hide the submitting indicator,
// without changing anything about how syncing itself works.
function waitForSyncToFinish() {
  return new Promise((resolve) => {
    if (!isSyncing) { resolve(); return; }
    const check = setInterval(() => {
      if (!isSyncing) {
        clearInterval(check);
        resolve();
      }
    }, 200);
  });
}

// Show gallery status message
function showGalleryStatusMessage(message, type = 'info', duration = 3000) {
  const statusElement = document.getElementById('gallery-status-message');
  if (!statusElement) return;
  
  statusElement.textContent = message;
  statusElement.className = 'gallery-status-message';
  
  if (type === 'error') {
    statusElement.classList.add('error');
  } else if (type === 'success') {
    statusElement.classList.add('success');
  }
  
  statusElement.style.display = 'block';
  
  // Auto-hide after duration
  setTimeout(() => {
    statusElement.style.display = 'none';
  }, duration);
}

function startQRDetection() {
  if (qrDetectionActive) return;
  
  qrDetectionActive = true;
  qrDetectionInterval = setInterval(detectQRCode, QR_DETECTION_INTERVAL);
}

// Stop QR code detection
function stopQRDetection() {
  qrDetectionActive = false;
  if (qrDetectionInterval) {
    clearInterval(qrDetectionInterval);
    qrDetectionInterval = null;
  }
  // Don't clear lastDetectedQR here - it's needed for import
  // It will be cleared after successful import in importFromQRCode()
}

// Detect QR code in video stream
function detectQRCode() {
  const scannerVideo = document.getElementById('qr-scanner-video');
  if (!scannerVideo || scannerVideo.readyState !== scannerVideo.HAVE_ENOUGH_DATA) return;
  
  const tempCanvas = document.createElement('canvas');
  const context = tempCanvas.getContext('2d');
  
  tempCanvas.width = scannerVideo.videoWidth;
  tempCanvas.height = scannerVideo.videoHeight;
  
  context.drawImage(scannerVideo, 0, 0, tempCanvas.width, tempCanvas.height);
  const imageData = context.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
  
  // Use jsQR library to detect QR code
  const code = jsQR(imageData.data, imageData.width, imageData.height);
  
  if (code && code.data) {
    // Check if it's a valid URL
    if (isValidURL(code.data)) {
      if (lastDetectedQR !== code.data) {
        lastDetectedQR = code.data;
        updateQRScannerStatus('QR Code detected! Importing...', 'success');
        
        // Stop scanning once QR is detected
        stopQRDetection();
        
        // Auto-import when QR code is detected
        setTimeout(() => {
          if (qrScannerMode === 'preset-source') {
            const scannedUrl = lastDetectedQR;
            lastDetectedQR = null;
            importPresetSourceFromQR(scannedUrl);
          } else if (qrScannerMode === 'preview-image') {
            const scannedUrl = lastDetectedQR;
            lastDetectedQR = null;
            importPreviewImageFromQR(scannedUrl);
          } else {
            importFromQRCode();
          }
        }, 500);
      }
    } else {
      stopQRDetection();
      closeQRScannerModal();
      showGalleryStatusMessage('Invalid QR code - must be a valid URL', 'error', 4000);
    }
  } else {
    updateQRScannerStatus('Scanning...', '');
  }
}

// Check if string is valid URL
function isValidURL(string) {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
}

// Resize and compress image to match camera resolution settings
async function resizeAndCompressImage(blob, maxWidth = 640, maxHeight = 480, quality = 0.85) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(blob);

    const doResize = (sourceImg) => {
      let width = sourceImg.width;
      let height = sourceImg.height;

      // Only resize if image exceeds either max dimension
      if (width > maxWidth || height > maxHeight) {
        // Calculate scale needed to fit within both maxWidth and maxHeight
        const scaleW = maxWidth / width;
        const scaleH = maxHeight / height;
        const scale = Math.min(scaleW, scaleH); // use the more restrictive scale
        width = Math.round(width * scale);
        height = Math.round(height * scale);
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(sourceImg, 0, 0, width, height);

      canvas.toBlob(
        (resizedBlob) => {
          if (resizedBlob) {
            resolve({ blob: resizedBlob, width, height });
          } else {
            reject(new Error('Failed to compress image'));
          }
        },
        'image/jpeg',
        quality
      );
    };

    img.onload = () => {
      URL.revokeObjectURL(url);
      doResize(img);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      // Retry by forcing blob type to image/png (some proxies strip content-type)
      if (blob.type !== 'image/png' && blob.type !== 'image/jpeg') {
        const retypedBlob = new Blob([blob], { type: 'image/png' });
        const retryUrl = URL.createObjectURL(retypedBlob);
        const retryImg = new Image();
        retryImg.onload = () => {
          URL.revokeObjectURL(retryUrl);
          doResize(retryImg);
        };
        retryImg.onerror = () => {
          URL.revokeObjectURL(retryUrl);
          reject(new Error('Failed to load image for resizing'));
        };
        retryImg.src = retryUrl;
      } else {
        reject(new Error('Failed to load image for resizing'));
      }
    };

    img.src = url;
  });
}

// Import image from QR code
async function importFromQRCode() {
  if (!lastDetectedQR) {
    closeQRScannerModal();
    showGalleryStatusMessage('No QR code detected', 'error', 3000);
    return;
  }

  try {
    updateQRScannerStatus('Downloading image...', '');

    const imageUrl = lastDetectedQR.trim();

    // Try direct fetch first (fastest, works when server allows it),
    // then fall back to image-specific and generic CORS proxies
    const proxies = [
      '',                                          // Direct fetch first
      'https://wsrv.nl/?url=',                     // Image-specific proxy (best)
      'https://corsproxy.io/?',                    // Generic CORS proxy
      'https://api.allorigins.win/raw?url=',       // Generic CORS proxy
      'https://api.codetabs.com/v1/proxy?quest='   // Generic CORS proxy
    ];

    let response = null;

    for (let i = 0; i < proxies.length; i++) {
      try {
        const fetchUrl = proxies[i]
          ? proxies[i] + encodeURIComponent(imageUrl)
          : imageUrl;

        updateQRScannerStatus(`Trying method ${i + 1}/${proxies.length}...`, '');

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000);

        const res = await fetch(fetchUrl, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (res.ok) {
          response = res;
          updateQRScannerStatus('Download successful!', 'success');
          break;
        }
      } catch (error) {
        continue; // Try next proxy
      }
    }

    if (!response || !response.ok) {
      throw new Error('All download methods failed. Check the URL and try again.');
    }

    updateQRScannerStatus('Reading image data...', '');
    let blob = await response.blob();

    const originalSize = Math.round(blob.size / 1024);
    updateQRScannerStatus('Original size: ' + originalSize + 'KB', '');

    // Accept image types and octet-stream (some proxies strip content-type)
    const isImageType = blob.type.startsWith('image/');
    const isOctetStream = blob.type === 'application/octet-stream' || blob.type === '';
    if (blob.type && !isImageType && !isOctetStream) {
      throw new Error('Not an image file: ' + blob.type);
    }

    updateQRScannerStatus('Optimizing image...', '');
    const importRes = IMPORT_RESOLUTION_OPTIONS[currentImportResolutionIndex];
    const importResizeResult = await resizeAndCompressImage(blob, importRes.width, importRes.height, 0.85);
    blob = importResizeResult.blob;
    const importedWidth = importResizeResult.width;
    const importedHeight = importResizeResult.height;

    const newSize = Math.round(blob.size / 1024);
    updateQRScannerStatus('Compressed: ' + originalSize + 'KB → ' + newSize + 'KB', '');

    updateQRScannerStatus('Converting to base64...', '');
    const base64Data = await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Base64 conversion timeout — image may be too large'));
      }, 15000);

      const reader = new FileReader();
      reader.onloadend = () => { clearTimeout(timeout); resolve(reader.result); };
      reader.onerror = () => { clearTimeout(timeout); reject(new Error('FileReader error')); };
      reader.readAsDataURL(blob);
    });

    updateQRScannerStatus('Saving to gallery...', '');

    const imageData = {
      id: Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9),
      imageBase64: base64Data,
      timestamp: Date.now(),
      resolution: (importedWidth && importedHeight) ? importedWidth + 'x' + importedHeight : null
    };

    // Save to IndexedDB FIRST — only add to memory if save succeeds
    await saveImageToDB(imageData);
    galleryImages.unshift(imageData);

    updateQRScannerStatus('✅ Import successful!', 'success');
    lastDetectedQR = null;

    closeQRScannerModal();
    await showGallery();
    showGalleryStatusMessage('Image imported successfully!', 'success', 3000);

  } catch (error) {
    lastDetectedQR = null;
    closeQRScannerModal();
    showGalleryStatusMessage('Import failed: ' + error.message, 'error', 4000);
  }
}

// Reset Database button now opens the new selective reset submenu
document.getElementById('factory-reset-button').addEventListener('click', showResetDatabaseSubmenu); 

// Carousel infinite scroll logic
document.addEventListener('DOMContentLoaded', function() {
  const carousel = document.querySelector('.mode-carousel-track');
  
  if (carousel) {
    
// Re-attach event listeners to cloned buttons
    const allButtons = carousel.querySelectorAll('.mode-button');
    allButtons.forEach(button => {
      const mode = button.getAttribute('data-mode');
      if (mode === 'random') {
        button.addEventListener('click', toggleRandomMode);
      } else if (mode === 'motion') {
        button.addEventListener('click', toggleMotionDetection);
      } else if (mode === 'burst') {
        button.addEventListener('click', toggleBurstMode);
      } else if (mode === 'timer') {
                   button.addEventListener('click', toggleTimerMode);
              } else if (mode === 'camera-combine') {
        button.addEventListener('click', toggleCameraLiveCombineMode);
      }
    });
  }
});

// Gallery image viewer — tap to toggle both carousels (single or double based on settings)

(function() {
  const viewerEl = document.getElementById('image-viewer');
  if (!viewerEl) return;

  let lastTapTime = 0;
  let lastTapX = 0;
  let lastTapY = 0;
  const DOUBLE_TAP_DELAY = 300;
  const DOUBLE_TAP_RADIUS = 40;

  let leftVisible = true;
  let rightVisible = true;

  // Set carousels visible by default on open
  function initViewerCarousels() {
    const right = document.getElementById('viewer-carousel');
    const left = document.getElementById('viewer-left-carousel');
    if (right) { right.classList.remove('hidden'); rightVisible = true; }
    if (left) { left.classList.remove('hidden'); leftVisible = true; }
  }
  // Expose so openImageViewer can call it
  window.initViewerCarousels = initViewerCarousels;

  function toggleViewerCarousels() {
    const right = document.getElementById('viewer-carousel');
    const left = document.getElementById('viewer-left-carousel');

    leftVisible = !leftVisible;
    rightVisible = !rightVisible;

    if (left) {
      if (leftVisible) left.classList.remove('hidden');
      else left.classList.add('hidden');
    }
    if (right) {
      if (rightVisible) right.classList.remove('hidden');
      else right.classList.add('hidden');
    }

    lastTapTime = 0;
  }

  viewerEl.addEventListener('touchend', (e) => {
    if (e.changedTouches.length !== 1) return;

    // Only react to taps on the photo itself or the viewer backdrop — taps
    // on the title (which opens the preset info panel) or inside any panel
    // opened over the viewer must never flip the side buttons underneath.
    if (e.target !== viewerEl &&
        !e.target.closest('.image-viewer-container')) return;

    const s = window._viewerBtnSettings || { tapMode: 'single' };

    if (s.tapMode === 'single') {
      // Single-tap: skip if the user tapped a button or interactive element so those still work normally
      if (e.target.closest('button, a, input, select, textarea, [role="button"]')) return;
      toggleViewerCarousels();
      return;
    }

    // Double-tap mode (default)
    const touch = e.changedTouches[0];
    const now = Date.now();
    const timeDiff = now - lastTapTime;
    const distX = Math.abs(touch.clientX - lastTapX);
    const distY = Math.abs(touch.clientY - lastTapY);

    if (timeDiff < DOUBLE_TAP_DELAY && distX < DOUBLE_TAP_RADIUS && distY < DOUBLE_TAP_RADIUS) {
      toggleViewerCarousels();
    } else {
      lastTapTime = now;
      lastTapX = touch.clientX;
      lastTapY = touch.clientY;
    }
  }, { passive: true });
})();

// --- Gallery Image Viewer Screen: Button Styles ---

(function() {
  const DEFAULT_VIEWER_SETTINGS = { bgColor: '#000000', opacity: 100, fontColor: '#ffffff', tapMode: 'single', borderColor: '#FE5F00', borderOpacity: 100 };
  let viewerSettings = { ...DEFAULT_VIEWER_SETTINGS };
  try {
    const saved = localStorage.getItem('r1_viewer_btn_settings');
    if (saved) viewerSettings = { ...DEFAULT_VIEWER_SETTINGS, ...JSON.parse(saved) };
  } catch (e) {}

  window._viewerBtnSettings = viewerSettings;

  function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  }

  function applyViewerBtnStyles() {
    const s = window._viewerBtnSettings;
    const { r, g, b } = hexToRgb(s.bgColor);
    const a = s.opacity / 100;
    const bg = `rgba(${r}, ${g}, ${b}, ${a})`;
    const fc = s.fontColor;
    const bc = hexToRgb(s.borderColor || '#FE5F00');
    const ba = (s.borderOpacity !== undefined ? s.borderOpacity : 100) / 100;
    const border = `rgba(${bc.r}, ${bc.g}, ${bc.b}, ${ba})`;

    let styleEl = document.getElementById('_viewer-btn-custom-style');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = '_viewer-btn-custom-style';
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = `
      .viewer-carousel-button { background: ${bg} !important; color: ${fc} !important; border-color: ${border} !important; }
      .viewer-carousel-label { color: ${fc} !important; }
      .viewer-left-carousel-btn:not(.enabled) { background: ${bg} !important; border-color: ${border} !important; }
      .viewer-left-carousel-btn { color: ${fc} !important; }
      .viewer-bottom-btn { background: ${bg} !important; color: ${fc} !important; border-color: ${border} !important; }
      .viewer-delete-button { background: ${bg} !important; color: ${fc} !important; }
      .viewer-close-button { background: ${bg} !important; color: ${fc} !important; }
    `;
  }

  window._applyViewerBtnStyles = applyViewerBtnStyles;
  applyViewerBtnStyles();
})();

// ===== LEFT CAMERA CAROUSEL =====

(function() {
  // Sync enabled state of MP and Options buttons on load
  function syncLeftCamBtns() {
    const mpBtn = document.getElementById('cam-master-prompt-btn');
    const optBtn = document.getElementById('cam-options-btn');
    if (mpBtn) {
      if (masterPromptEnabled) mpBtn.classList.add('enabled');
      else mpBtn.classList.remove('enabled');
    }
    if (optBtn) {
      if (manualOptionsMode) optBtn.classList.add('enabled');
      else optBtn.classList.remove('enabled');
    }
  }

  // Master Prompt button — opens master prompt submenu directly, returns to camera on exit
  const camMpBtn = document.getElementById('cam-master-prompt-btn');
  if (camMpBtn) {
    camMpBtn.addEventListener('click', () => {
      // Hide carousel so settings has full screen
      document.getElementById('left-cam-carousel').style.display = 'none';
      // Open settings submenu as required parent context
      document.getElementById('unified-menu').style.display = 'none';
      isMenuOpen = false;
      // Go directly to master prompt submenu
      showMasterPromptSubmenu();
      // Flag so hideMasterPromptSubmenu knows to return to camera not settings
      window.masterPromptFromCamera = true;
    });
  }

  // Options toggle button — toggles manualOptionsMode immediately
  const camOptBtn = document.getElementById('cam-options-btn');
  if (camOptBtn) {
    camOptBtn.addEventListener('click', () => {
      toggleManualOptionsMode();
      // Sync this button's color
      if (manualOptionsMode) camOptBtn.classList.add('enabled');
      else camOptBtn.classList.remove('enabled');
    });
  }

  // Initial sync after a brief delay to ensure state is loaded
  setTimeout(syncLeftCamBtns, 200);
})();

console.log('AI Camera Styles app initialized!');

// --- Main Camera Screen: Button Styles + Tap-to-Toggle Carousels ---

(function() {
  // ── Load saved settings

  const DEFAULT_SETTINGS = { bgColor: '#000000', opacity: 100, fontColor: '#ffffff', tapMode: 'single', borderColor: '#FE5F00', borderOpacity: 100 };
  let settings = { ...DEFAULT_SETTINGS };
  try {
    const saved = localStorage.getItem('r1_cam_btn_settings');
    if (saved) settings = { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
  } catch (e) {}

  // Expose on window so the settings submenu (wired up elsewhere) can read/write it
  window._camBtnSettings = settings;

  // ── Apply button styles 

  function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  }

  function applyCamBtnStyles() {
    const s = window._camBtnSettings;
    const { r, g, b } = hexToRgb(s.bgColor);
    const a = s.opacity / 100;
    const bg = `rgba(${r}, ${g}, ${b}, ${a})`;
    const fc = s.fontColor;
    const bc = hexToRgb(s.borderColor || '#FE5F00');
    const ba = (s.borderOpacity !== undefined ? s.borderOpacity : 100) / 100;
    const border = `rgba(${bc.r}, ${bc.g}, ${bc.b}, ${ba})`;

    let styleEl = document.getElementById('_cam-btn-custom-style');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = '_cam-btn-custom-style';
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = `
      .left-cam-btn:not(.enabled) { background: ${bg} !important; border-color: ${border} !important; }
      .left-cam-btn { color: ${fc} !important; }
      .mode-button:not(.random-active):not(.active):not(.burst-active):not(.timer-active):not(.camera-multi-active):not(.combine-active):not(.layer-active) { background: ${bg} !important; border-color: ${border} !important; }
      .mode-button { color: ${fc} !important; }
      .camera-button { background: ${bg} !important; border-color: ${border} !important; }
      .mode-label { color: ${fc} !important; }
      .button-label { color: ${fc} !important; }
    `;
  }

  // Expose so the settings submenu event listeners can call it
  window._applyCamBtnStyles = applyCamBtnStyles;

  // Apply on load
  applyCamBtnStyles();

  // ── Tap-to-toggle carousels

  let lastTapTime = 0;
  let lastTapX = 0;
  let lastTapY = 0;
  const DOUBLE_TAP_DELAY = 300;
  const DOUBLE_TAP_RADIUS = 40;

  let leftVisible = true;
  let rightVisible = true;

  // Expose a single restore function so reinitializeCamera and startup
  // always use the same class-based system and keep the closure in sync.
  window._showCamCarousels = function () {
    leftVisible = true;
    rightVisible = true;
    const leftCarousel = document.getElementById('left-cam-carousel');
    const rightCarousel = document.querySelector('.mode-carousel');
    if (leftCarousel) {
      leftCarousel.classList.remove('hidden');
      leftCarousel.style.display = ''; // clear any competing inline override
    }
    if (rightCarousel) {
      rightCarousel.style.transform = 'translateX(0)';
      rightCarousel.style.pointerEvents = 'auto';
      rightCarousel.style.display = '';
    }
  };

  function isOnMainCameraScreen() {
    if (document.getElementById('gallery-modal')?.style.display === 'flex') return false;
    if (document.getElementById('image-viewer')?.style.display === 'flex') return false;
    if (document.getElementById('unified-menu')?.style.display === 'flex') return false;
    if (document.getElementById('settings-submenu')?.style.display === 'flex') return false;
    if (document.getElementById('master-prompt-submenu')?.style.display === 'flex') return false;
    if (document.getElementById('preset-builder-submenu')?.style.display === 'flex') return false;
    if (document.getElementById('button-settings-submenu')?.style.display === 'flex') return false;
    if (document.getElementById('resolution-submenu')?.style.display === 'flex') return false;
    if (document.getElementById('aspect-ratio-submenu')?.style.display === 'flex') return false;
    if (document.getElementById('burst-submenu')?.style.display === 'flex') return false;
    if (document.getElementById('timer-settings-submenu')?.style.display === 'flex') return false;
    if (document.getElementById('motion-submenu')?.style.display === 'flex') return false;
    if (document.getElementById('visible-presets-submenu')?.style.display === 'flex') return false;
    if (document.getElementById('import-resolution-submenu')?.style.display === 'flex') return false;
    if (document.getElementById('tutorial-submenu')?.style.display === 'flex') return false;
    if (document.getElementById('preset-selector')?.style.display === 'flex') return false;
    if (document.getElementById('manual-options-modal')?.style.display === 'flex') return false;
    if (document.getElementById('custom-alert-modal')?.style.display === 'flex') return false;
    return true;
  }

  function toggleCarousels() {
    const leftCarousel = document.getElementById('left-cam-carousel');
    const rightCarousel = document.querySelector('.mode-carousel');

    leftVisible = !leftVisible;
    rightVisible = !rightVisible;

    if (leftCarousel) {
      if (leftVisible) leftCarousel.classList.remove('hidden');
      else leftCarousel.classList.add('hidden');
    }
    if (rightCarousel) {
      if (rightVisible) {
        rightCarousel.style.transform = 'translateX(0)';
        rightCarousel.style.pointerEvents = 'auto';
      } else {
        rightCarousel.style.transform = 'translateX(calc(100% + 8px))';
        rightCarousel.style.pointerEvents = 'none';
      }
    }
    lastTapTime = 0;
  }

  document.addEventListener('touchend', (e) => {
    if (!isOnMainCameraScreen()) return;
    if (window._carouselGuardUntil && Date.now() < window._carouselGuardUntil) return;
    if (e.changedTouches.length !== 1) return;

    const s = window._camBtnSettings;

    if (s.tapMode === 'single') {
      // Single-tap: skip if the user tapped a button or interactive element so those still work normally
      if (e.target.closest('button, a, input, select, textarea, [role="button"]')) return;
      toggleCarousels();
      return;
    }

    // Double-tap mode (default)
    const touch = e.changedTouches[0];
    const now = Date.now();
    const timeDiff = now - lastTapTime;
    const distX = Math.abs(touch.clientX - lastTapX);
    const distY = Math.abs(touch.clientY - lastTapY);

    if (timeDiff < DOUBLE_TAP_DELAY && distX < DOUBLE_TAP_RADIUS && distY < DOUBLE_TAP_RADIUS) {
      toggleCarousels();
    } else {
      lastTapTime = now;
      lastTapX = touch.clientX;
      lastTapY = touch.clientY;
    }
  }, { passive: true });
})();

// ===== PTT (Push-to-Talk) for Text Fields =====
// When the user taps into any text input or textarea, pressing the
// r1 side button will start/stop speech-to-text and insert the result.

(function() {
  // This tracks whichever text field or textarea the user last tapped into.
  // It starts as null, meaning no field is active.
  let activePttField = null;

  // The list of every text input and textarea in the app that should
  // support PTT. Each one is found by its id from the HTML.
  const pttFieldIds = [
    'style-filter',           // Filter styles search box in the menu
    'visible-presets-filter', // Filter presets search box in settings
    'preset-filter',          // Filter presets search box in preset selector
    'master-prompt-text',     // Master prompt textarea in settings
    'preset-builder-prompt',  // AI prompt textarea in preset builder
    'preset-builder-name',    // Preset name field in preset builder
    'preset-builder-category',// Category field in preset builder
    'preset-builder-additional', // Additional rules textarea in preset builder
    'tutorial-search-input',  // Tutorial search field
    'style-name',             // Style name field in edit style
    'style-category',         // Category field in edit style
    'style-message',          // AI prompt textarea in edit style
    'style-additional'        // Additional rules textarea in edit style
  ];

  // When the user taps INTO a field, remember it as the active PTT target.
  // When the user taps AWAY from all fields, clear the active target so
  // that the side button goes back to doing its normal camera functions.
  function attachPttListeners() {
    pttFieldIds.forEach(function(id) {
      const field = document.getElementById(id);
      if (!field) return;

      field.addEventListener('focus', function() {
        activePttField = field;
      });

      field.addEventListener('blur', function() {
        // Small delay so a tap on the PTT button doesn't
        // clear the field before the button event fires.
        setTimeout(function() {
          if (document.activeElement !== field) {
            activePttField = null;
          }
        }, 300);
      });
    });
  }

  // Run immediately for fields that exist on page load,
  // and again after a short delay to catch fields that are
  // built dynamically by the app after startup.
  attachPttListeners();
  setTimeout(attachPttListeners, 2000);

  // The import filter field is created dynamically when the import
  // modal opens, so we watch for it and attach PTT when it appears.
  const importObserver = new MutationObserver(function() {
    const importField = document.getElementById('import-preset-filter');
    if (importField && !importField.dataset.pttAttached) {
      importField.dataset.pttAttached = 'true';
      importField.addEventListener('focus', function() {
        activePttField = importField;
      });
      importField.addEventListener('blur', function() {
        setTimeout(function() {
          if (document.activeElement !== importField) {
            activePttField = null;
          }
        }, 300);
      });
    }

    // Attach PTT to any master prompt slot textareas that were just rendered
    document.querySelectorAll('.mp-slot-textarea').forEach(function(textarea) {
      if (!textarea.dataset.pttAttached) {
        textarea.dataset.pttAttached = 'true';
        textarea.addEventListener('focus', function() {
          activePttField = textarea;
        });
        textarea.addEventListener('blur', function() {
          setTimeout(function() {
            if (document.activeElement !== textarea) {
              activePttField = null;
            }
          }, 300);
        });
      }
    });
  });
  importObserver.observe(document.body, { childList: true, subtree: true });

  // Listen for the r1 side button being pressed down.
  window.addEventListener('longPressStart', function() {

    // --- TEXT FIELD MODE ---
    // If the user is inside a text field, do speech-to-text into that field.
    if (activePttField) {
      CreationVoiceHandler.postMessage('start');
      return;
    }

    // --- CAMERA VOICE PRESET MODE ---
    // If we are on the main camera screen (no menus open, no text field active),
    // a long press starts listening to create a spoken custom preset.
    // This does NOT work if No Magic Mode is on, Random Mode is on,
    // or Multi-Preset Mode is active — those modes have their own behaviour.
    const galleryOpen = document.getElementById('gallery-modal')?.style.display === 'flex';
    const viewerOpen = document.getElementById('image-viewer')?.style.display === 'flex';
    const menuOpen = document.getElementById('unified-menu')?.style.display === 'flex';
    const settingsOpen = document.getElementById('settings-submenu')?.style.display === 'flex';
    const masterPromptOpen = document.getElementById('master-prompt-submenu')?.style.display === 'flex';
    const presetBuilderOpen = document.getElementById('preset-builder-submenu')?.style.display === 'flex';
    const anyScreenOpen = galleryOpen || viewerOpen || menuOpen || settingsOpen || masterPromptOpen || presetBuilderOpen;

    if (!anyScreenOpen && !noMagicMode && !isRandomMode && !isCameraMultiPresetActive && !isCameraLayerActive) {
      window.isVoicePresetListening = true;
      if (window.isCameraLiveCombineMode) {
        statusElement.textContent = '🎙️ Listening... speak your combine preset';
      } else {
        statusElement.textContent = '🎙️ Listening... speak your preset';
      }
      CreationVoiceHandler.postMessage('start');
    }
  });

  // Listen for the r1 side button being released.
  window.addEventListener('longPressEnd', function() {

    // --- TEXT FIELD MODE ---
    if (activePttField) {
      CreationVoiceHandler.postMessage('stop');
      return;
    }

    // --- CAMERA VOICE PRESET MODE ---
    // Stop listening and wait for the transcript to come back via onPluginMessage.
    if (window.isVoicePresetListening) {
      CreationVoiceHandler.postMessage('stop');
      // isVoicePresetListening stays true until the transcript arrives
      // so onPluginMessage knows to treat the result as a camera preset
    }
  });

  // When the r1 device finishes listening and sends back the
  // spoken words, insert them into whichever field is active.
  // This also keeps the original AI image response handling working.
  window.onPluginMessage = function(data) {

    // --- Original AI image response handling ---
    if (data && data.status === 'processing') {
      statusElement.textContent = 'AI is processing your image...';
    } else if (data && data.status === 'complete') {
      statusElement.textContent = 'AI transformation complete!';
    } else if (data && data.error) {
      statusElement.textContent = 'Error: ' + data.error;
    }

    // --- PTT speech-to-text handling ---
    if (data.type === 'sttEnded' && data.transcript) {

      // TEXT FIELD: insert spoken words into the active field
      if (activePttField) {
        const field = activePttField;
        const start = field.selectionStart;
        const end = field.selectionEnd;
        const before = field.value.substring(0, start);
        const after = field.value.substring(end);
        // Only keep trailing period in the master prompt field — strip it everywhere else

        // Keep trailing period in master prompt, edit style, and preset builder fields
        const keepPeriodFields = new Set([
          'master-prompt-text',
          'style-message',
          'style-additional',
          'preset-builder-prompt',
          'preset-builder-additional'
        ]);
        let insertText = data.transcript;
        const isMpSlot = field.classList && field.classList.contains('mp-slot-textarea');
        if (!keepPeriodFields.has(field.id) && !isMpSlot) {
          insertText = insertText.replace(/[.,!?;:]+\s*$/, '');
        }
        field.value = before + insertText + after;
        const newPos = start + insertText.length;
        field.setSelectionRange(newPos, newPos);
        field.dispatchEvent(new Event('input', { bubbles: true }));

      // CAMERA VOICE PRESET: transcript becomes the custom preset,
      // then the camera fires immediately
      } else if (window.isVoicePresetListening) {
        window.isVoicePresetListening = false;

        // Build a one-time preset object from the spoken words
        window.voicePreset = {
          name: 'Voice Preset',
          message: data.transcript,
          options: [],
          randomizeOptions: false,
          additionalInstructions: ''
        };

        statusElement.textContent = '🎙️ Got it! Taking photo...';

        // If camera combine mode is active, the voice preset drives the combine flow.
        // Take photo 1 immediately, save to gallery, then prompt for photo 2.
        if (window.isCameraLiveCombineMode) {
          const dataUrl = captureRawPhotoDataUrl();
          if (dataUrl) {
            addToGallery(dataUrl);
            window.cameraCombineFirstPhoto = dataUrl;
            // Return to live camera view so user can see what they are shooting for photo 2
            capturedImage.style.display = 'none';
            video.style.display = 'block';
            // Store the voice preset so finalizeCameraLiveCombine can use it
            const spokenPreset = window.voicePreset;
            window.voicePreset = null;
            statusElement.textContent = '✅ First photo taken! Press side button for second photo';
            showStyleReveal('📸 1st done!\nTake 2nd photo');
            // Override the sideClick for next press to capture photo 2 with this voice preset
            window.cameraCombineVoicePreset = spokenPreset;
          }
          return;
        }

        // Normal (non-combine) voice preset — trigger the camera as usual
        if (!isMotionDetectionMode) {
          if (isTimerMode) {
            if (isBurstMode) {
              startTimerCountdown(() => startBurstCapture());
            } else {
              startTimerCountdown(() => capturePhoto());
            }
          } else {
            if (isBurstMode) {
              startBurstCapture();
            } else {
              capturePhoto();
            }
          }
        }
        // Motion detection: voicePreset is now set and will be picked up
        // automatically the next time motion triggers capturePhoto()
      }
    }
  };

})();

// ===== HSV COLOR PICKER =====
(function () {
  'use strict';

  // --- Efficient HSV ↔ RGB conversion (branchless math, no lookup tables) ---

  function hsvToRgb(h, s, v) {
    // h: 0–360, s/v: 0–1  →  [r, g, b]: 0–255 integers
    const f = (n) => {
      const k = (n + h / 60) % 6;
      return (v - v * s * Math.max(0, Math.min(k, 4 - k, 1))) * 255 | 0;
    };
    return [f(5), f(3), f(1)];
  }

  function rgbToHsv(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
    const s = max ? d / max : 0, v = max;
    let h = 0;
    if (d) {
      if      (max === r) h = ((g - b) / d + 6) % 6;
      else if (max === g) h = (b - r) / d + 2;
      else                h = (r - g) / d + 4;
      h *= 60;
    }
    return [h, s, v];
  }

  function hexToRgb(hex) {
    const n = parseInt(hex.replace('#', ''), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => (x | 0).toString(16).padStart(2, '0')).join('');
  }

  // --- Shared state ---
  let activeInputId = null;
  let hue = 0, sat = 1, val = 1;
  let _originalHex = '#000000';

  const SV_W = 210, SV_H = 185, HUE_H = 18;

  // --- Build popup DOM once ---
  const popup = document.createElement('div');
  popup.id = '_hsv-popup';
  Object.assign(popup.style, {
    display: 'none', position: 'fixed', zIndex: '99999',
    background: '#1c1c1c', border: '1px solid #484848',
    borderRadius: '9px', padding: '10px',
    boxShadow: '0 8px 28px rgba(0,0,0,0.88)',
    width: (SV_W + 20) + 'px', boxSizing: 'border-box',
    userSelect: 'none', WebkitUserSelect: 'none'
  });
  popup.innerHTML =
    '<canvas id="_hsv-sv" width="' + SV_W + '" height="' + SV_H + '" ' +
      'style="display:block;cursor:crosshair;border-radius:5px 5px 0 0;touch-action:none;"></canvas>' +
    '<canvas id="_hsv-hue" width="' + SV_W + '" height="' + HUE_H + '" ' +
      'style="display:block;margin-top:3px;cursor:crosshair;border-radius:0 0 5px 5px;touch-action:none;"></canvas>' +
    '<div style="display:flex;align-items:center;gap:7px;margin-top:9px;">' +
      '<div id="_hsv-prev" style="width:32px;height:32px;border-radius:5px;border:1px solid #555;flex-shrink:0;"></div>' +
      '<input id="_hsv-hex" type="text" maxlength="7" spellcheck="false" ' +
        'style="flex:1;padding:6px 8px;background:#272727;color:#fff;border:1px solid #555;' +
               'border-radius:5px;font-size:12px;font-family:monospace;min-width:0;">' +
      '<button id="_hsv-ok" type="button" ' +
        'style="padding:6px 12px;background:#2a2a2a;color:#fff;border:1px solid #555;' +
               'border-radius:5px;cursor:pointer;font-size:15px;flex-shrink:0;">✓</button>' +
      '<button id="_hsv-cancel" type="button" ' +
        'style="padding:6px 12px;background:#2a2a2a;color:#ff5555;border:1px solid #555;' +
               'border-radius:5px;cursor:pointer;font-size:15px;flex-shrink:0;">✕</button>' +
    '</div>';
  document.body.appendChild(popup);

  const svCanvas  = document.getElementById('_hsv-sv');
  const hueCanvas = document.getElementById('_hsv-hue');
  const prevBox   = document.getElementById('_hsv-prev');
  const hexInput  = document.getElementById('_hsv-hex');
  const okBtn     = document.getElementById('_hsv-ok');
  const cancelBtn = document.getElementById('_hsv-cancel');
  const svCtx     = svCanvas.getContext('2d');
  const hueCtx    = hueCanvas.getContext('2d');

  // --- Drawing ---
  function drawSV() {
    const [r, g, b] = hsvToRgb(hue, 1, 1);
    // Horizontal: white → pure hue colour
    const gH = svCtx.createLinearGradient(0, 0, SV_W, 0);
    gH.addColorStop(0, '#fff');
    gH.addColorStop(1, 'rgb(' + r + ',' + g + ',' + b + ')');
    svCtx.fillStyle = gH;
    svCtx.fillRect(0, 0, SV_W, SV_H);
    // Vertical: transparent → black
    const gV = svCtx.createLinearGradient(0, 0, 0, SV_H);
    gV.addColorStop(0, 'rgba(0,0,0,0)');
    gV.addColorStop(1, '#000');
    svCtx.fillStyle = gV;
    svCtx.fillRect(0, 0, SV_W, SV_H);
    // Cursor: outer dark ring + inner white ring
    const cx = sat * SV_W, cy = (1 - val) * SV_H;
    svCtx.beginPath(); svCtx.arc(cx, cy, 8, 0, 6.2832);
    svCtx.strokeStyle = 'rgba(0,0,0,0.55)'; svCtx.lineWidth = 2.5; svCtx.stroke();
    svCtx.beginPath(); svCtx.arc(cx, cy, 6, 0, 6.2832);
    svCtx.strokeStyle = '#fff'; svCtx.lineWidth = 2; svCtx.stroke();
  }

  function drawHue() {
    // Full spectrum gradient
    const g = hueCtx.createLinearGradient(0, 0, SV_W, 0);
    for (let i = 0; i <= 6; i++) g.addColorStop(i / 6, 'hsl(' + (i * 60) + ',100%,50%)');
    hueCtx.fillStyle = g;
    hueCtx.fillRect(0, 0, SV_W, HUE_H);
    // Cursor: thin white bar with dark outline
    const x = (hue / 360) * SV_W;
    hueCtx.fillStyle = 'rgba(0,0,0,0.45)';
    hueCtx.fillRect(x - 3, 0, 6, HUE_H);
    hueCtx.fillStyle = '#fff';
    hueCtx.fillRect(x - 2, 0, 4, HUE_H);
  }

  function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }

  function commitColor() {
    const [r, g, b] = hsvToRgb(hue, sat, val);
    const hex = rgbToHex(r, g, b);
    prevBox.style.background = hex;
    hexInput.value = hex;
    if (activeInputId) {
      const inp = document.getElementById(activeInputId);
      if (inp) {
        inp.value = hex; // triggers patched setter → updates swatch background
        inp.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }
  }

  function redrawAndCommit() { drawSV(); drawHue(); commitColor(); }

  // rAF throttle — collapses multiple pointer events into one draw per frame
  let _rafPending = false;
  let _pendingDraw = null;
  function scheduleRedraw(drawFn) {
    _pendingDraw = drawFn;
    if (!_rafPending) {
      _rafPending = true;
      requestAnimationFrame(function () {
        _rafPending = false;
        if (_pendingDraw) { _pendingDraw(); _pendingDraw = null; }
        commitColor();
      });
    }
  }

  // --- Pointer drag for SV canvas ---
  svCanvas.addEventListener('pointerdown', (e) => {
    svCanvas.setPointerCapture(e.pointerId);
    const r = svCanvas.getBoundingClientRect();
    sat = clamp((e.clientX - r.left) / SV_W, 0, 1);
    val = clamp(1 - (e.clientY - r.top) / SV_H, 0, 1);
    redrawAndCommit(); // immediate on first touch — no rAF delay
  });
  svCanvas.addEventListener('pointermove', (e) => {
    if (e.buttons > 0) {
      const r = svCanvas.getBoundingClientRect();
      sat = clamp((e.clientX - r.left) / SV_W, 0, 1);
      val = clamp(1 - (e.clientY - r.top) / SV_H, 0, 1);
      scheduleRedraw(drawSV); // hue bar unchanged — skip redrawing it
    }
  });

  // --- Pointer drag for hue bar ---
  hueCanvas.addEventListener('pointerdown', (e) => {
    hueCanvas.setPointerCapture(e.pointerId);
    const r = hueCanvas.getBoundingClientRect();
    hue = clamp((e.clientX - r.left) / SV_W, 0, 1) * 360;
    redrawAndCommit(); // immediate on first touch — no rAF delay
  });
  hueCanvas.addEventListener('pointermove', (e) => {
    if (e.buttons > 0) {
      const r = hueCanvas.getBoundingClientRect();
      hue = clamp((e.clientX - r.left) / SV_W, 0, 1) * 360;
      scheduleRedraw(function () { drawSV(); drawHue(); }); // hue changed — both canvases need redraw
    }
  });

  // --- Hex text field ---
  hexInput.addEventListener('input', (e) => {
    const v = e.target.value.trim();
    if (/^#[0-9a-fA-F]{6}$/.test(v)) {
      const [r, g, b] = hexToRgb(v);
      [hue, sat, val] = rgbToHsv(r, g, b);
      drawSV(); drawHue();
      prevBox.style.background = v;
      if (activeInputId) {
        const inp = document.getElementById(activeInputId);
        if (inp) {
          inp.value = v;
          inp.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }
    }
  });
  hexInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') closePopup(); });

  // Close on ✓ button or click outside
  okBtn.addEventListener('click', closePopup);
  cancelBtn.addEventListener('click', () => {
    if (activeInputId) {
      const inp = document.getElementById(activeInputId);
      if (inp) {
        inp.value = _originalHex;
        inp.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }
    closePopup();
  });
  document.addEventListener('pointerdown', (e) => {
    if (popup.style.display === 'none') return;
    if (!popup.contains(e.target) && !e.target.classList.contains('hsv-swatch-btn')) {
      closePopup();
    }
  }, true);

  function closePopup() {
    popup.style.display = 'none';
    activeInputId = null;
  }

  // --- Open picker when a swatch button is tapped ---
  function openPicker(btn) {
    activeInputId = btn.dataset.for;
    const inp = document.getElementById(activeInputId);
    const hex = (inp && inp.value) ? inp.value : '#000000';
    const [r, g, b] = hexToRgb(hex);
    [hue, sat, val] = rgbToHsv(r, g, b);

    // Position popup so it stays on screen
    const rect  = btn.getBoundingClientRect();
    const popW  = SV_W + 20;
    const popH  = SV_H + HUE_H + 70;
    let left    = rect.left;
    let top     = rect.bottom + 5;
    if (left + popW > window.innerWidth  - 8) left = window.innerWidth  - popW - 8;
    if (top  + popH > window.innerHeight - 8) top  = rect.top - popH - 5;
    if (top < 8) top = 8;
    if (left < 8) left = 8;
    popup.style.left = left + 'px';
    popup.style.top  = top  + 'px';
    _originalHex = (inp && inp.value) ? inp.value : '#000000';
    popup.style.display = 'block';
    redrawAndCommit();
  }

  // Single delegated click listener for all swatch buttons
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('hsv-swatch-btn')) openPicker(e.target);
  });

  // --- Patch the .value setter on each hidden input so the swatch
  //     background always stays in sync when existing code sets values
  //     (default buttons, reset-all, sync-on-open functions, etc.) ---
  [
    'cam-btn-color-picker',
    'cam-btn-font-color-picker',
    'cam-btn-border-color-picker',
    'viewer-btn-color-picker',
    'viewer-btn-font-color-picker',
    'viewer-btn-border-color-picker'
  ].forEach(function (id) {
    const el = document.getElementById(id);
    if (!el) return;
    let _v = el.getAttribute('value') || '#000000';
    Object.defineProperty(el, 'value', {
      configurable: true,
      get: function () { return _v; },
      set: function (v) {
        _v = v;
        const swatch = document.querySelector('.hsv-swatch-btn[data-for="' + id + '"]');
        if (swatch) swatch.style.background = v;
      }
    });
  });

})();
