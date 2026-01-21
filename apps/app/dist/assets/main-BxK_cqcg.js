(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function a(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(i){if(i.ep)return;i.ep=!0;const s=a(i);fetch(i.href,s)}})();let h,p,R,y,Ut,I=null,j=null;const wt=[{name:"VGA (640x480)",width:640,height:480},{name:"SVGA (800x600)",width:800,height:600},{name:"XGA (1024x768)",width:1024,height:768},{name:"SXGA (1280x960)",width:1280,height:960},{name:"SXGA+ (1400x1050)",width:1400,height:1050},{name:"UXGA (1600x1200)",width:1600,height:1200},{name:"2K (2048x1080)",width:2048,height:1080},{name:"4K (3840x2160)",width:3840,height:2160}];let ye=0;const di="r1_camera_resolution",ka=[{name:"Auto",value:"auto"},{name:"Daylight",value:"daylight"},{name:"Cloudy",value:"cloudy"},{name:"Tungsten",value:"tungsten"},{name:"Fluorescent",value:"fluorescent"},{name:"Candlelight",value:"candlelight"},{name:"Moonlight",value:"moonlight"}];let $e=0;const hi="r1_camera_white_balance";let G=0,A=[],ua=!1,P=1,rt=!1,Xn=0,$n=1,Re=!1,M=5,Et=500,ma=!1;const Qe={1:{delay:800,label:"Slow"},2:{delay:500,label:"Medium"},3:{delay:300,label:"Fast"}},ui="r1_camera_burst_settings",mi="r1_camera_timer_settings",gi="r1_camera_last_preset";let Oe=!1,be=null,de=10,qe=!1,pi=[3,5,10],W=1;const fi={1:{seconds:1,label:"1s"},2:{seconds:3,label:"3s"},3:{seconds:5,label:"5s"},4:{seconds:10,label:"10s"},5:{seconds:30,label:"30s"},6:{seconds:60,label:"1m"},7:{seconds:300,label:"5m"},8:{seconds:600,label:"10m"},9:{seconds:1800,label:"30m"},10:{seconds:3600,label:"1h"}};let Z="",Ee=!1;const yi="r1_camera_master_prompt",bi="r1_camera_master_prompt_enabled",Ti="r1_camera_aspect_ratio";let F="none",Je=!1,ce=!1,xt=null,ge=null,Ze=30,Ia=.1,Ve=!0,et=2,Ct=!1,tt=3;const wi="r1_camera_motion_settings";let ct=null;const mt={1:{seconds:3,label:"3s"},2:{seconds:10,label:"10s"},3:{seconds:30,label:"30s"},4:{seconds:60,label:"1m"},5:{seconds:300,label:"5m"},6:{seconds:600,label:"10m"},7:{seconds:900,label:"15m"},8:{seconds:1800,label:"30m"}};let H=!1;const Ei="r1_camera_no_magic_mode";let Ke,ga,lt=null,B=0,N=!1,je=!1,he=!1,x=0,ee=0,te=0,U=!1,vt=!1,Wt=!1,Kt=!1,Jt=!1,_t=!1,We=!1,nt=!1,re=-1,ae=0;const _i="R1CameraGallery",Xi=1,Le="images";let $=null,L=[];const vi="r1_gallery_sort_order";let J=-1,oe=1,Lt=!1,Qn=0,Zn=1,K=1;const Pt=16;let dt=null,ht=null,gt="newest",Ce=!1,S=new Set,Xt=!1,Te=[],Bt=null,Ae="",Dt="",ba=0,He="",pe="",Ge="";const ei={transform:"Take a picture and transform the image into [DESCRIBE TRANSFORMATION]. [ADD SPECIFIC DETAILS ABOUT STYLE, APPEARANCE, COLORS, ETC.]",transform_subject:"Take a picture and transform the subject into [WHAT THE SUBJECT BECOMES]. Preserve the subject's recognizable facial structure and identity. [ADD DETAILS ABOUT NEW APPEARANCE, ENVIRONMENT, LIGHTING].",convert:"Take a picture and convert the scene into [DESCRIBE NEW FORMAT/MEDIUM]. [ADD DETAILS ABOUT MATERIALS, TEXTURES, SCALE].",style:"Take a picture in the style of [ARTISTIC STYLE/ARTIST]. [ADD DETAILS ABOUT TECHNIQUE, COLORS, COMPOSITION].",place:"Take a picture and place the subject in [DESCRIBE SCENE/LOCATION]. [ADD DETAILS ABOUT LIGHTING, ATMOSPHERE, INTEGRATION].",recreate:"Take a picture and recreate [FAMOUS WORK/SCENE]. Replace [DESCRIBE WHAT TO REPLACE]. Preserve the iconic [DESCRIBE KEY ELEMENTS TO KEEP].",render:"Take a picture and render it as [FORMAT/MEDIUM]. [ADD DETAILS ABOUT APPEARANCE, TEXTURE, TECHNICAL SPECIFICS].",make:"Take a picture and make the subject into [CHARACTER/CREATURE]. [ADD DETAILS ABOUT APPEARANCE, TRAITS, SETTING]. Make it photorealistic.",analyze:"Analyze the image and [DESCRIBE WHAT TO ANALYZE/EXTRACT]. [ADD DETAILS ABOUT OUTPUT FORMAT] and email it to me.",custom:""},$i=[{name:"IMPRESSIONISM",category:["ART","PAINTING","CLASSIC"],message:"Take a picture and transform the image into a French Impressionist painting. Preserve subject identity. Use loose, visible brushstrokes, soft edges, and blended colors emphasizing natural light and atmosphere. Painterly oil-on-canvas texture with warm, luminous tones."},{name:"21st DOCTOR",category:["SCI-FI","TV","ADVENTURE","CHARACTER"],message:`Take a picture and transform the subject into the Doctor from the television series Doctor Who.

CORE CONCEPT (CRITICAL):
• The subject must be fully transformed into a version of the Doctor
• The subject is not an actor portraying the Doctor — the subject IS the Doctor
• The subject’s recognizable facial identity must be preserved while fully integrated into the role

DOCTOR TRANSFORMATION (CRITICAL):
• The subject must be fully costumed as the Doctor
• Clothing should reflect a specific Doctor era (tailored coat, suit, scarf, bow tie, or equivalent era-appropriate attire)
• The subject must be holding or wearing iconic Doctor gadgets (e.g., sonic screwdriver, psychic paper, wrist devices)

PROPS & ICONOGRAPHY (CRITICAL):
• The TARDIS must appear clearly in the scene (interior or exterior)
• Additional Doctor Who props may include:
  – Gallifreyan symbols
  – Alien technology
  – Time vortex elements
  – Era-specific tools or devices
• Props must feel physically present in the scene — not overlays or stickers

SEASON & ERA ADAPTATION LOGIC (CRITICAL):
• Automatically select ONE Doctor Who season or era
• The entire scene must visually adjust to match that era, including:
  – Costume styling
  – Color grading
  – Lighting style
  – Environmental design
• Examples:
  – Classic era: studio-lit sets, practical effects, theatrical staging
  – Modern era: cinematic lighting, dynamic angles, atmospheric depth

ENVIRONMENT:
• The subject must be placed within a believable Doctor Who setting
• Locations may include alien worlds, futuristic corridors, Earth-based locations, or the TARDIS interior
• The environment must feel lived-in and story-driven

CAMERA & LIGHTING:
• Cinematic framing
• Era-appropriate contrast and color palette
• Dynamic but grounded composition — no exaggerated superhero posing

TONE:
• Adventurous, intelligent, and heroic
• Sense of motion, urgency, or curiosity
• Never parody or cosplay

FINAL RESULT:
The final image must look like a real promotional still or episode frame from Doctor Who, with the subject fully embodied as the Doctor, equipped with iconic gadgets, placed in a season-accurate setting, and seamlessly integrated into the Doctor Who universe.`},{name:"3D PRINT FAILED",category:["HUMOR","TECH","3D"],message:`Take a picture and transform the subject into a real, physical 3D-printed object that has partially failed during printing. The subject must appear made from plastic filament with clearly visible horizontal layer lines across the entire surface.

Introduce obvious 3D-printing failures such as warped or shifted layers, missing sections, drooping filament, collapsed overhangs, stringing, and incomplete geometry as if the print stopped or misaligned mid-job.

The subject should appear as a photographed 3D print sitting on a workbench or print bed, with realistic shadows, shallow depth of field, and neutral lighting. Use a single solid filament color or limited two-color print. Avoid smooth, sculpted, or digital-rendered surfaces. The final image must clearly look like a failed physical 3D print, not a CGI model or statue.`},{name:"80s AND 90s ACTION FILMS",category:["HUMOR","MOVIES","SCENE","ACTION"],message:`Take a picture of the subject and place them into a scene from a classic 1980s or 1990s action film, such as *Die Hard*, *Lethal Weapon*, *Terminator*, or *Speed*.

The subject should appear as the action hero or main participant, performing a dramatic stunt, holding a weapon, or interacting with the environment in an exaggerated way.

Props, lighting, and costumes should match the era and style of the film, including explosions, helicopters, cars, or city backdrops.

Optional flavor text from the master prompt can add humorous twists, like awkward poses, improbable stunts, or ridiculous expressions.

The final image should look like a cinematic action movie still with the subject as the star, funny, dramatic, and larger-than-life.`},{name:"80s PROM DATE",category:["RETRO","HUMOR","PHOTOGRAPHY","POP CULTURE"],message:`Take a picture and transform it into an awkward 1980s prom photo taken at a high school prom.

The image should look like a posed flash photograph from the 1980s: harsh on-camera flash, flat lighting, soft focus, slight film grain, and muted color tones. Include typical prom decorations such as metallic balloons, crepe paper, tinsel, streamers, and a banner with the school name and graduation year (use external master prompt text if provided; otherwise invent a generic school name and year).

Dress all subjects in unmistakably tacky 1980s prom attire. Examples include oversized tuxedos, pastel or ruffled dresses, lace gloves, corsages, bow ties, cummerbunds, sequins, and shiny fabrics. Hairstyles must be exaggerated and era-accurate: big teased hair, feathered bangs, mullets, perms, or excessive hairspray volume.

Subject logic:
• If there is ONE subject and the subject appears masculine, add an older woman who plausibly looks like the subject’s mother as the prom date. She should be dressed formally but slightly out of place.
• If there is ONE subject and the subject appears feminine, add a younger boy who plausibly looks like a younger brother as the prom date. He should appear underdressed or uncomfortable.
• If there are TWO human subjects, present them as prom dates together, standing close but visibly awkward, stiff, or uncomfortable.

Body language should feel forced and uncomfortable: stiff smiles, arms held too rigidly, hands awkwardly placed, or obvious personal space tension. No one should look confident or natural.

Ensure the entire photo is fully visible within the frame, like a complete printed prom photo. The final image should feel painfully nostalgic, humorously awkward, and unmistakably 1980s — readable and funny on a small screen.`},{name:"AI-BUY",category:["UTILITY","AI","SHOPPING"],message:"Analyze the image and identify purchasable items. Provide product names, estimated prices, and purchase links. Present results in a clean, structured list and email it to me."},{name:"AI-IDENTIFY",category:["UTILITY","AI","ANALYSIS"],message:"Analyze the image in detail. Identify people, objects, environment, actions, expressions, and context. Provide a comprehensive, factual description without speculation and email it to me."},{name:"AI-SUMMARIZE",category:["UTILITY","AI","ANALYSIS"],message:"Analyze the image and provide a comprehensive summary of what is depicted, including context, activity, and notable visual details and email it to me."},{name:"AI-TRANSLATE",category:["UTILITY","AI","LANGUAGE"],message:"Analyze the image and detect any visible text in the image and translate it accurately into English. Preserve formatting where possible and email it to me."},{name:"A WHO",category:["HUMOR","MOVIES","CHRISTMAS","POP CULTURE"],message:"Take a picture and make the subject into a Who from Whoville from Dr. Seuss. Make it photorealistic."},{name:"ABSTRACT ART",category:["ART","MODERN","ABSTRACT"],message:"Take a picture in the style of Abstract Modern Art. Non-representational shapes, bold composition."},{name:"ABSTRACT EXPRESSIONISM",category:["ART","PAINTING","MODERN"],message:"Take a picture and transform the image into Abstract Expressionist style. Energetic splatters, layered textures, and dynamic forms while subject partially visible."},{name:"ACCIDENT SCENE",category:["HUMOR","DAMAGE","DRAMATIC"],message:`Take a picture and transform the main subject so it appears to have recently been involved in an accident. Preserve the original subject while adding realistic damage appropriate to its type.

Examples include:
• A car with dents, cracked lights, bent panels, or deployed airbags
• A bicycle with twisted wheels, scraped paint, or a broken chain
• A scooter, skateboard, or similar object with visible impact damage

Add subtle environmental clues such as skid marks, fallen debris, or disturbed surroundings when appropriate. The final image should look like a realistic aftermath photo, and remain clear on small screens.`},{name:"ACROBATS",category:["PERFORMANCE","CIRCUS","IMPOSSIBLE","SPECTACLE"],message:`Take a picture of the subject or subjects performing extreme, fantastical acrobatic feats.

Include:
• Multi-person stacked formations, human pyramids, or chains
• Impossible balances, mid-air catches, and synchronized aerial stunts
• Gravity-defying choreography that appears physically implausible yet believable

Bodies must interact realistically with visible tension, grip, and support — showing weight distribution and contact points.

Subjects can be dressed in circus, acrobatic, or performance attire appropriate for the scene.

Lighting, environment, and perspective should match a professional acrobatic stage, circus tent, or performance arena.

The final image should capture a surreal, awe-inspiring moment frozen in time, looking like a real performance photograph of impossible acrobatics.`},{name:"ADVENTURE TIME",category:["CARTOON","ANIMATION","ABSURD","FANTASY"],message:`Take a picture and transform the subject into a colorful, surreal cartoon world inspired by Adventure Time.

STYLE & CHARACTER RULES:
• Simple rounded shapes and elastic anatomy
• Bold outlines and flat, vibrant colors
• Whimsical proportions and exaggerated expressions
• Include multiple quirky cartoon characters native to this world
• Characters may be creatures, humanoids, or bizarre fantasy beings

SCENE & TONE:
• Playful, absurd, and slightly chaotic
• Bright candy-colored environments
• Cartoon physics and exaggerated motion allowed

The final image should look like a fully composed Adventure Time–style hand-drawn illustration with the subject and additional characters integrated seamlessly into the world.`},{name:"ADVERTISEMENT",category:["MASTER PROMPT","COMMERCIAL","MARKETING","PROFESSIONAL"],message:"Take a picture and transform it into a polished magazine-style advertisement while preserving clear facial likeness and identity of the subject. Present the subject naturally holding, wearing, or interacting with the featured product as the central focus of the ad. Primary information source: If product details are provided via externally supplied information, showcase that product accurately as the main advertised item. Incorporate the product’s name, type, and defining qualities into the visual presentation, slogan, and flavor text without altering or misrepresenting the product. Secondary enhancement: If no product details are externally provided, infer a plausible featured product based on what the subject is visibly holding, wearing, or using. If inference is required, keep the product generic and clearly implied rather than naming a specific real-world brand. Design the final image as a compact, mobile-friendly magazine advertisement layout optimized for small screens. Include a bold, high-contrast headline or slogan, a short block of engaging flavor text, and subtle supporting copy if space allows. Ensure all text is legible at small sizes with clean spacing and strong visual hierarchy. Use flattering, high-quality lighting, refined composition, and a modern editorial aesthetic. Maintain visual clarity, balanced framing, and an immediately recognizable advertising look. The result should be a full view of the page with a relevant background behind the page."},{name:"AESOPS FABLE",category:["STORYBOOK","KIDS","LESSON"],message:`Take a picture and transform the subject into a character within an Aesop’s fable. Select a fable based on the subject’s appearance, posture, expression, or perceived traits (such as confidence, cleverness, laziness, pride, patience), OR use a specific fable provided via external master prompt.

Depict the subject as a story character (human or animal) fully integrated into a classic fable scene, not as a modern person placed into an illustration. The environment, props, and other characters should visually support the chosen fable.

Render the image as a single illustrated storybook page. Ensure the entire page is fully visible within the frame, including margins, illustration, and text area. Do not crop or cut off any part of the page.

Include the **title of the selected fable** prominently and clearly within the page layout, such as at the top of the page or in a decorative storybook header. The title must be fully visible and immediately identifiable to the viewer.

Include the moral of the fable displayed clearly within the page, such as on a parchment banner, book page caption, or decorative text panel. The moral must be short, legible, and directly related to the scene.

Use a traditional storybook illustration style inspired by classic engraved or painted children’s book art. Keep the composition simple, symbolic, and clearly readable on a small screen. The final image should feel like a complete, intact page from an illustrated fable book.`},{name:"AFRICAN TRIBAL MASK",category:["ART","CULTURAL","MASK"],message:"Take a picture and transform the image into African tribal mask art. Simplify facial features, use bold geometric shapes, earthy colors, carved-wood textures, and ceremonial symbolism while keeping the subject recognizable."},{name:"ALBUM TRACKLIST COVER",category:["MUSIC","ART","POP CULTURE","RETRO"],message:`Take a picture and transform the subject into the main artist featured on a full vinyl record album cover.

The subject must be styled, dressed, and posed to clearly match a specific music genre and era inferred from their appearance, expression, clothing, environment, or mood. The visual aesthetic must strongly reflect a historically appropriate vinyl-era release year. For example:
• 1960s–70s Rock → analog grain, warm tones, natural light, leather or denim
• 1970s Disco → glossy photography, bold colors, dramatic poses
• 1980s Pop → neon accents, airbrushed look, studio lighting
• 1990s Grunge / Hip-hop → gritty texture, muted colors, urban realism
• 1950s–60s Jazz → monochrome or sepia, elegant composition
• Punk → raw, DIY photocopy look

If the genre is unclear, choose the most fitting genre and era based on the subject’s vibe and surroundings.

Design the image as a complete, square vinyl record cover. The subject must be clearly identifiable as the singer or band front-person, fully integrated into the composition — not pasted in. Lighting, color grading, and framing must feel intentional and era-accurate.

Add album typography directly onto the cover:
• Artist name (based on the subject or a humorous alias inspired by them)
• Album title (creative and genre-appropriate)
• A clearly visible tracklist arranged in a vinyl-typical layout
• A release year prominently displayed that matches the visual era (e.g., 1977, 1984, 1993)

The track names should collectively tell a loose story or emotional arc inspired by the subject’s appearance, pose, or environment. Titles should feel believable for the chosen genre and decade.

Optionally include era-appropriate vinyl details such as:
• Record label logo
• Catalog number
• Stereo / Mono indicator
• Parental Advisory label (only if appropriate for the genre)

Use authentic vinyl album design conventions: readable period-accurate fonts, balanced spacing, subtle print texture, and slight wear or aging if appropriate. The final image must unmistakably read as a real vinyl album cover and remain legible on small screens.`},{name:"ALIEN",category:["SCI FI","CREATURE","FANTASY"],message:"Take a picture and transform the subject into an alien being while preserving the subject’s core facial structure and identity. Introduce extraterrestrial traits such as altered skin color or texture, subtle bioluminescence, unusual eyes, or refined anatomical variations that still clearly resemble the subject. Place the subject naturally into a sci-fi environment such as an alien world, spacecraft interior, or futuristic city. Match lighting, perspective, and atmospheric effects so the subject appears genuinely part of the scene. Render the final image with photorealistic sci-fi realism and cinematic depth."},{name:"ALIEN ABDUCTION",category:["SCI-FI","HUMOR","FANTASY","PHOTOREALISTIC"],message:`Take a picture of the subject levitating inside a beam of light from a UFO.

The subject must appear physically suspended within the beam, with realistic shadows, reflections, and light interaction on their clothing and body.

The environment should be fully integrated — ground, surrounding scenery, and background lighting must react to the UFO beam naturally.

The beam may include atmospheric effects such as mist, dust, or subtle energy distortion. The subject should show expression or posture consistent with surprise, awe, or comedic fear.

The final image must look like a real photograph capturing a supernatural abduction moment, with no compositing shortcuts.`},{name:"ALIENS",category:["MOVIES","SCI FI","HORROR"],message:"Take a picture and place the subject in a scene from the movie Aliens. Dark sci-fi realism. Make it photorealistic."},{name:"ALTER EGO",category:["PERSONALITY","TRANSFORMATION","CREATIVE"],message:"Take a picture and transform the image to reveal an alternate version of the subject. Same facial identity, different personality and visual style."},{name:"ALTERED",category:["SUBTLE SURREAL","REALISM","UNSETTLING","DETAIL"],message:`Take a picture and subtly alter the subject’s physical appearance in a way that feels natural, plausible, and socially accepted.

CORE CONCEPT (CRITICAL):
• The subject must appear mostly normal at first glance
• One small physical detail should be quietly incorrect
• The alteration must feel like a normal human variation within this reality

SUBTLE ALTERATION LOGIC (CRITICAL):
• Choose ONE subtle physical change based on what is visible in the image
• The change must integrate cleanly into the subject’s anatomy
• The image must not draw attention to the alteration

POSSIBLE ALTERATIONS (EXAMPLES):
• A single eye centered naturally between where two eyes would normally be (cyclopean anatomy)
• If the subject is wearing glasses, convert them into a monocle that fits the single eye naturally
• An extra finger on a visible hand, proportioned and articulated correctly
• A forked tongue if the tongue is visible, subtle and functional
• A naturally grown unibrow or other socially normalized facial variation

REALISM & NORMALIZATION RULES (CRITICAL):
• Anatomy must look biologically coherent, not stitched or mutated
• No scars, seams, glow, or fantasy cues
• Accessories (glasses, makeup, grooming) must adapt logically to the altered anatomy
• The alteration should feel designed-for, not accommodated as an exception

SUBJECT BEHAVIOR:
• The subject must behave completely normally
• No awareness, surprise, or emphasis on the altered feature
• Expression and posture remain casual and unremarkable

SOCIAL CONTEXT:
• The surrounding world treats the alteration as ordinary
• No reactions, no stares, no narrative framing
• This is simply how people can look

CAMERA & LIGHTING:
• Neutral, everyday photography
• No dramatic lighting or focus pulling
• The camera must not highlight the altered feature

TONE:
• Quietly unsettling
• Matter-of-fact
• The unease comes from noticing, not from exaggeration

FINAL RESULT:
The final image must look like a completely normal photograph of a person with one subtle but undeniable physical difference — such as a single, centered eye with a properly fitted monocle. The alteration should feel biologically intentional, socially normalized, and easy to miss unless closely observed.`},{name:"AMBIGRAM",category:["TEXT","ART","TYPOGRAPHY"],message:"Take a picture of the given text and create a true ambigram that reads exactly the same when viewed upside-down (rotated 180 degrees). Use creative typography and design, but do not mirror, flip, or distort the letters in a way that changes the readable order. Randomize styles, fonts, and decorative elements for each attempt, but ensure the text is fully legible and maintains identical meaning when inverted. Include only the ambigram in the image, no extra text or captions."},{name:"AMERICAN GOTHIC",category:["ART","PAINTING","CLASSIC","PARODY"],message:"Take a picture and recreate the classic painting American Gothic. Replace one figure in the painting with the subject. If the subject is male, replace the male figure. If the subject is female, replace the female figure. If two subjects are present, replace both figures accordingly. Preserve the iconic composition, clothing style, background, and serious tone of the original artwork while integrating the subject naturally. The final image should be instantly recognizable as American Gothic with a humorous modern twist."},{name:"ANAGLYPH 3D (3D Glasses Needed)",category:["3D","RETRO","STEREOSCOPIC","OPTICAL"],message:`Take a picture and transform it into a classic red/blue anaglyph 3D image designed to be viewed with red/cyan or red/blue 3D glasses.

Create two slightly offset views of the scene representing left-eye and right-eye perspectives. Overlay the left-eye view in red and the right-eye view in cyan/blue, aligning them to produce a convincing stereoscopic depth effect.

Depth should be readable through horizontal parallax: foreground elements should show noticeable red/blue separation, while background elements should align more closely.

Preserve the subject’s recognizability while allowing controlled color channel separation. Avoid excessive ghosting or misalignment that would make the image uncomfortable to view.

Lighting, shading, and form should remain realistic so the depth effect feels natural when viewed through 3D glasses.

Do not include Magic Eye patterns, lenticular effects, or split-frame stereoscopy. The image must be a single combined anaglyph composition.

The final image should clearly appear flat without glasses and distinctly three-dimensional when viewed through red/blue 3D glasses. Ensure the entire composition remains visible and readable on a small screen.`},{name:"ANALOG FILM STRIP",category:["FILM","ANALOG","RETRO","CINEMA"],message:`Take a picture and transform it into a vintage analog film strip.

STRUCTURE (MANDATORY):
• The final image must be a horizontal or vertical film strip
• Contain exactly 1, 2, or 3 frames — NEVER more than 3
• Frames must be evenly spaced and clearly separated

FRAME CONTENT RULES:
• Each frame must show the subject at a slightly different moment
• Small variations in pose, expression, or motion between frames
• Frames should feel sequential, as if captured moments apart

FILM MATERIAL REQUIREMENTS:
• Visible sprocket holes along the edges
• Black or dark brown film base
• Frame borders must look physically printed, not digital overlays

ANALOG IMPERFECTIONS (REQUIRED):
• Light leaks
• Film grain
• Dust, scratches, or hair
• Slight frame misalignment
• Uneven exposure between frames

COLOR & STYLE:
• Muted, aged color or true black-and-white
• Slight yellowing or sepia tint acceptable
• Soft contrast and faded highlights

TEXT & MARKINGS:
• Optional frame numbers or edge codes
• Optional handwritten or stamped markings
• No modern fonts or digital UI

ABSOLUTE PROHIBITIONS:
• NO more than three frames
• NO modern digital film simulations
• NO clean or perfect edges
• NO single-photo presentation

FINAL VALIDATION RULE:
If it looks like one photo with a film texture on top, IT IS WRONG.

The final image must look like a real, physical strip of exposed and developed photographic film containing up to three frames.`},{name:"ANAMORPHIC ART",category:["ART","ILLUSION","3D"],message:"Take a picture and create an anamorphic image that appears distorted unless viewed from a specific angle. Correct perspective reveals the subject."},{name:"ANDY WARHOL",category:["ART","POP ART","ARTIST"],message:"Take a picture in the style of Andy Warhol. Pop Art with the use of four duplicated images in a frame."},{name:"ANGELS AND DEVILS",category:["HUMOR","FANTASY","CHARACTER"],message:`Take a picture and transform each subject into either an angel or a devil based on their appearance, posture, and demeanor. If multiple subjects are present, vary the transformation individually.

ANGELS should have soft glowing light, subtle halos, feathered wings, calm or kind expressions, and light-toned clothing.
DEVILS should have horns, tails, glowing or shadowed eyes, darker tones, sharp features, and mischievous or menacing expressions.

The transformation should feel natural and realistic, not costume-like. Wings, horns, and tails should be anatomically integrated.

Lighting and atmosphere should reinforce the role: warm and radiant for angels, dramatic and shadowy for devils.

The final image should clearly communicate who is an angel and who is a devil at a glance.`},{name:"ANGULAR MONOCHROMATIC",category:["ART","DESIGN","VECTOR","ABSTRACT"],message:`Take a picture and transform it into a bold, stylized vector illustration.

Render the image using flat geometric shapes and a strictly monochromatic color palette derived from the single dominant color of the original photo. Use variations of that color only (light, mid-tone, and dark values) rather than multiple hues or gradients.

Strongly abstract fine detail and simplify all forms into large angular planes that loosely describe the subject and environment. Define edges using hard transitions between adjacent color regions instead of line art. Do not use outlines.

Convey shading entirely through neighboring flat color fields, producing a graphic, poster-like quality reminiscent of cut paper, stencil art, or posterization.

Slightly round all corners of the color block shapes to avoid sharp points while maintaining an angular, faceted appearance.

Avoid texture, brush strokes, realism, or painterly effects. The final image should feel minimal, graphic, modern, and clearly readable on a small screen.`},{name:"ANGULAR POLYCHROMATIC",category:["ART","DESIGN","VECTOR","ABSTRACT"],message:`Take a picture and transform it into a bold, stylized vector illustration.

Render the image using flat geometric shapes and a vibrant polychromatic color palette derived from the original colors of the photo. Strongly abstract fine detail and organize colors into distinct light, mid-tone, and dark blocks rather than smooth gradients.

Simplify all forms into large angular planes that loosely describe the subject and environment. Define edges using hard transitions between adjacent color regions instead of line art. Do not use outlines.

Convey shading entirely through neighboring flat color fields, creating a graphic, poster-like quality reminiscent of cut paper, posterization, or modern vector art.

Slightly round all corners of the color block shapes to avoid harsh points while maintaining an angular, faceted appearance.

Avoid texture, brush strokes, realism, or painterly effects. The final image should feel clean, graphic, modern, and clearly readable on a small screen.`},{name:"ANIMAL RIDER",category:["HUMOR","FANTASY","EPIC"],message:`Take a picture and place the subject riding a large, powerful animal. The animal may be real or fictional (e.g., horse, elephant, lion, dragon, gryphon, dinosaur), and can be selected or influenced by the master prompt.

The animal should be massive and dominant in scale. The subject must be properly seated or mounted with correct posture, grip, and balance — not floating or pasted.

The animal should be in motion or a dramatic stance (charging, flying, roaring, climbing, standing triumphantly).

Lighting, perspective, and shadows must match between rider and animal.

The final image should feel epic, absurd, and cinematic — like a legendary hero riding an impossibly wild creature.`},{name:"ANIME ART",category:["ANIME","ANIMATION","JAPANESE","TRANSFORMATION"],message:"Take a picture and transform the subject into an anime character placed within a classic or modern anime franchise world alongside the show's iconic characters. Convert the subject into authentic anime art style with characteristic features: large expressive eyes with detailed highlights and reflections, simplified nose (small dot or line), small mouth, clean cel-shaded coloring with minimal gradients, smooth skin with occasional blush marks, distinctive anime hair with sharp spikes or flowing strands in vibrant colors that defy gravity. Preserve the subject's recognizable facial features and expression but render them in anime style. Place them in an iconic anime setting with the franchise's main characters visible in the scene - examples: Dragon Ball Z (with Goku, Vegeta, training with power auras and energy effects), Sailor Moon (with Sailor Scouts, magical transformation scene), Cowboy Bebop (with Spike and crew on the Bebop ship), Naruto (with Naruto, Sasuke, Sakura in Hidden Leaf Village), Attack on Titan (with Survey Corps members, titans in background), My Hero Academia (with Deku, Bakugo at UA High School), One Piece (with Luffy and Straw Hat crew on the ship), Pokemon (with Ash, Pikachu catching Pokemon). The subject should look like they belong in the anime as a new character interacting with the established cast. Include anime-specific visual elements: speed lines for action, sweat drops for nervousness, sparkles and flowers for dramatic moments, background characters in simpler detail, dramatic sky with lens flare effects. Use anime color palette - vibrant saturated colors, clean outlines (black ink lines), flat cel-shading with sharp shadow edges. Match the specific art style of the chosen franchise. Make it look like an actual frame from that anime series with the subject seamlessly integrated as a character among the show's cast."},{name:"ANSEL ADAMS",category:["PHOTOGRAPHY","BLACK AND WHITE","LANDSCAPE","CLASSIC"],message:`Take a picture and transform it into the photographic style of Ansel Adams.

MEDIUM & TECHNIQUE (CRITICAL):
• Black-and-white photography ONLY
• Large-format camera look
• Extreme tonal range using the Zone System
• Crisp focus and deep depth of field

TONAL CONTROL:
• Rich blacks with detail
• Bright highlights without clipping
• Strong midtone separation
• Dramatic contrast without harshness

SUBJECT & SCENE:
• The subject may be human or environmental
• If human, they must feel small within the scene
• Emphasis on scale, form, texture, and light

TEXTURE EMPHASIS:
• Rock, clouds, trees, skin, fabric, water
• Fine grain — never noisy

LIGHTING:
• Natural light only
• Emphasis on dramatic skies, clouds, and shadows
• No artificial light sources

ABSOLUTE PROHIBITIONS:
• NO color
• NO painterly effects
• NO modern HDR
• NO soft-focus aesthetics

FINAL RESULT:
The image must look like a meticulously exposed and printed Ansel Adams photograph — timeless, monumental, and technically precise.`},{name:"ANTIQUES",category:["VINTAGE","TRANSFORMATION","HISTORICAL","RETRO"],message:"Take a picture and transform every single object and element in the scene into its antique equivalent from the 1800s-1950s era. EVERY modern item must be converted: smartphones become rotary dial phones or candlestick phones, flat-screen TVs become wooden cabinet tube televisions with dials and rabbit ear antennas, laptops become typewriters, LED lights become oil lamps or Edison bulbs, modern cars become vintage automobiles (Model T, classic sedans), refrigerators become antique iceboxes, microwaves become old gas stoves, digital cameras become large format bellows cameras, modern furniture becomes Victorian or Art Deco pieces with ornate wood and upholstery. Convert ALL branded products to vintage versions: Coca-Cola bottles become classic glass contour bottles, modern packaging becomes vintage tin containers and cardboard boxes with retro graphics, sneakers become leather oxford shoes or boots. Transform the environment: modern architecture becomes period-appropriate (Victorian, Colonial, Art Deco), wallpaper becomes vintage patterns (floral, damask), flooring becomes hardwood or vintage tile, light fixtures become antique chandeliers or sconces. If people are present, transform them to match the period: women in long dresses, corsets, vintage hairstyles (finger waves, Gibson Girl updos, victory rolls); men in three-piece suits, suspenders, bow ties, fedoras or bowler hats, slicked hair or pompadours. Add period-appropriate aging and patina to everything - tarnished brass, aged wood, sepia or faded color tones, slight wear and vintage quality. The entire scene should look like a perfectly preserved photograph from 75-150 years ago with every element authentically period-accurate. Make it photorealistic as if time-traveled to the antique era."},{name:"AOL AIM PROFILE",category:["RETRO","INTERNET","2000S"],message:"Take a picture and transform it into a tiny, low-resolution AOL Instant Messenger profile photo. Crop awkwardly, reduce detail, and add heavy compression. The subject should remain recognizable but pixelated and informal."},{name:"ARCHEOLOGICAL PHOTO",category:["MASTER PROMPT","SCIENCE","DOCUMENTARY"],message:"Take a picture and transform it into an archeological field documentation sheet. Include a large, visible photograph of the subject as the central element, printed on aged paper. The photo should appear weathered, sun-faded, dusty, and slightly warped, as if it has been exposed at an excavation site for weeks. Identify the subject’s species or type using scientific or pseudo-scientific labeling. Add subtle field notes, specimen numbers, scale bars, and catalog markings around the photo. The final image should feel like an authentic archeological record centered around the photograph."},{name:"ARCHITECTURAL REDESIGN",category:["ARCHITECTURE","TRANSFORMATION","DESIGN","STYLE"],message:"Take a picture and identify the main building or structure in the image, then completely redesign it in a dramatically different architectural style while maintaining the same basic footprint and location. If the building is modern, transform it to a contrasting historical or regional style. If it's traditional, make it contemporary. Architectural style options include: Colonial (symmetrical facade, columns, shutters), Mediterranean (stucco walls, terracotta tile roof, arched windows), Spanish Colonial (white walls, red clay tiles, wrought iron details, courtyard), Victorian (ornate trim, turrets, wraparound porch, detailed woodwork), Art Deco (geometric patterns, stepped forms, metallic accents, bold colors), Brutalist (raw concrete, geometric masses, fortress-like), Mid-Century Modern (clean lines, large windows, flat roofs, integration with nature), Gothic (pointed arches, flying buttresses, ornate stonework), Craftsman (exposed beams, natural materials, low-pitched roofs), Contemporary (glass and steel, minimalist, asymmetrical), Tudor (half-timbering, steep gables, decorative chimneys), or Prairie Style (horizontal lines, overhanging eaves, natural materials). Maintain the building's location, surrounding landscape, and general scale, but completely transform all architectural elements - windows, doors, roof, materials, decorative details, columns, trim - to match the new style. Keep lighting and time of day consistent. The redesign should be thorough and authentic to the chosen architectural movement with period-appropriate materials, proportions, and details. Make it look like a photorealistic rendering of what that exact building would look like if designed in a completely different architectural tradition."},{name:"ARCHITECTURAL SCALE MODEL",category:["MINIATURE","ARCHITECTURE","MODEL"],message:"Take a picture and convert the scene into an architectural scale model. Subjects and objects should appear as miniature figurines within a foam-board or plastic model environment. Use clean edges, painted surfaces, and overhead lighting typical of design studios. Maintain proportional scale across all elements."},{name:"ARCHIVED PHOTO",category:["VINTAGE","DAMAGED","HISTORICAL"],message:"Take a picture and transform it into a damaged archival photograph. Add scratches, dust, faded tones, and slight warping. Portions of the image may be torn, stained, or missing. Use muted sepia or desaturated colors. The subject should feel historical, fragile, and partially lost to time."},{name:"ART BRUT",category:["ART","NAIVE","OUTSIDER"],message:"Take a picture and transform the image into Art Brut (outsider art) style painting. Use raw lines, naive proportions, uneven coloring, and spontaneous visual energy while preserving the subject."},{name:"ART DECO",category:["ART","DESIGN","VINTAGE","GEOMETRIC"],message:"Take a picture and transform the image into Art Deco poster style. Bold geometric shapes, metallic or pastel palette, stylized subject, decorative typography optional."},{name:"ART NOUVEAU",category:["ART","DESIGN","VINTAGE","ORGANIC"],message:"Take a picture and transform the image into a into an Art Nouveau illustration. Preserve the subject's identity, facial features, proportions, and pose. Use flowing, organic lines inspired by natural forms such as vines, flowers, and hair. Emphasize elegant curves, ornamental borders, and rhythmic linework. Flat or softly shaded color areas with muted, harmonious palettes. Decorative background integrated into the composition rather than separate. Poster-like composition inspired by Alphonse Mucha and late 19th-century European Art Nouveau. Painterly illustration style, not photorealistic. No modern elements, no Art Deco geometry, no hard angles."},{name:"ASCII ART",category:["TEXT","RETRO","COMPUTER"],message:"Take a picture and render it in ASCII format, where shapes and tones are created using punctuation and letters and using only keyboard characters to form the image. Built entirely from text characters, using letters, numbers, and symbols arranged in clever patterns. The image has a retro, digital feel, like something you would see on an old computer screen or printed in a vintage tech lab."},{name:"ASHCAN SCHOOL",category:["ART","PAINTING","REALISM"],message:"Take a picture and transform the image into an Ashcan School style painting. Gritty realism, urban atmosphere, loose brushwork, and muted tones. Subject feels candid and grounded."},{name:"AUSTRALIAN ABORIGINAL DOT PAINTING",category:["ART","CULTURAL","INDIGENOUS"],message:"Take a picture and transform the image into Aboriginal dot painting style. Use dot patterns, symbolic shapes, earthy palettes, and rhythmic repetition while preserving the subject’s silhouette."},{name:"AVATAR",category:["MOVIES","SCI FI","CREATURE"],message:"Take a picture and transform the subject into a realistic Na’vi character from the movie Avatar. Preserve the subject’s recognizable facial structure, eye shape, expressions, body proportions, and personality while adapting them to authentic Na’vi anatomy—tall, slender physique, elongated limbs, blue bioluminescent skin with natural striping, feline nose structure, large expressive eyes, pointed ears, and long braided hair with neural queue. Translate the subject’s clothing and accessories into culturally accurate Na’vi attire and materials. Match the exact cinematic lighting, color grading, skin translucency, subsurface scattering, and environmental interaction seen in Avatar. The subject must appear fully native to Pandora, not human-painted blue, with realistic scale, shadows, and immersion in the world."},{name:"BACKUP SINGER",category:["MUSIC","HUMOR","PERFORMANCE"],message:`Take a picture and place the subject into a live music performance as an off-key backup singer standing behind a talented lead singer or group.

The subject should be holding a microphone and singing enthusiastically but clearly out of sync or off-key. Other singers should be visibly reacting — giving awkward looks, side-eyes, or confused expressions.

Stage lighting, concert atmosphere, and microphones must feel realistic. The subject should be fully integrated into the performance, not pasted in.

The scene should feel funny, musical, and visually readable even on small screens.`},{name:"BALD",category:["HUMOR","PORTRAIT","TRANSFORMATION"],message:`Take a picture of the subject, human or animal, and make them completely bald.

Remove all hair or fur from the head area so the scalp is fully visible.

The bald look should be smooth, clean, and slightly exaggerated for comedic effect.

Make sure the head shape and lighting look natural so the baldness feels believable.

The final image should look like the subject has truly gone hairless, creating a funny and surprising transformation.`},{name:"BALLERINA",category:["HUMOR","COSTUME","PORTRAIT"],message:`Take a picture of the subject and dress them in a classic pink ballerina costume with a tutu, ballet slippers, and hair styled like a stage performer.

The same pink ballerina outfit must be used regardless of the subject’s gender or age.

Place the subject in a graceful ballet pose on a stage or in a dance studio, with soft theatrical lighting.

The contrast between the elegant ballerina outfit and the subject’s normal appearance should be part of the humor.

The final image should look like a real ballet photo shoot with playful, unexpected casting.`},{name:"BALLOON",category:["TOY","INFLATABLE","TRANSFORMATION"],message:`Take a picture and transform the ENTIRE image so that EVERYTHING is made entirely out of balloons.

The subject, background, scenery, lighting effects, shadows, and all objects must be physically constructed from inflated latex balloons.

Show visible balloon seams, tied ends, surface stretch, reflections, and pressure deformation.

DO NOT overlay balloons onto a photograph.
DO NOT leave any non-balloon surfaces visible.

The scene must look like a real balloon sculpture environment photographed in real life.`},{name:"BARBIE WORLD",category:["TOY","PINK","DOLL","POP CULTURE"],message:`Take a picture and transform the entire scene into a bright, stylized Barbie World composed entirely of physical toys.

Analyze the subject and environment and apply the following transformations:

• If the primary subject appears feminine, transform them into a Barbie doll.
• If the primary subject appears masculine, transform them into a Ken doll.

The doll’s face should retain the subject’s recognizable facial structure, proportions, and expression, but be rendered with smooth plastic skin, simplified features, glossy eyes, and the polished look of a physical Barbie or Ken toy.

Environmental logic:
• If the scene appears indoors, place the subject inside a Barbie Dreamhouse interior with pastel-colored plastic furniture, toy-like proportions, and miniature physical details.
• If the scene appears outdoors, place the subject inside or next to a Barbie convertible with realistic toy textures, bright colors, and a glossy finish.

Use high-key lighting, realistic toy textures, reflections, and scale consistency to ensure the subject and environment appear as physical toys rather than drawings or digital illustrations. Keep the composition bold, cheerful, and clearly readable on small screens.`},{name:"BARN BILLBOARD",category:["HUMOR","ADVERTISING","VINTAGE","RUSTIC"],message:`Take a picture of the subject and transform it into an advertisement painted on the side of an old barn.

The subject should be fully integrated into the barn wall texture, following the curvature, cracks, peeling paint, and wood grain.

The style should resemble a vintage or weathered hand-painted billboard, with faded colors, chipped paint, and sun-bleached effects.

Include appropriate rustic details like knots in wood, nails, and uneven surfaces. The environment around the barn should remain consistent with the original photo (fields, fences, sky, or surrounding scenery).

The final image should look like a real photograph of a barn with a large, old-fashioned painted advertisement featuring the subject.`},{name:"BAROQUE",category:["ART","PAINTING","CLASSIC","DRAMATIC"],message:"Take a picture in the style of Baroque painting. Dramatic lighting, deep contrasts, dynamic composition, ornate details, and theatrical visual richness."},{name:"BAUHAUS",category:["ART","DESIGN","MODERN","GEOMETRIC"],message:"Take a picture and transform the image into Bauhaus style art. Reduce the subject to functional geometric forms, clean lines, primary colors, and minimal composition."},{name:"BBS DOWNLOAD",category:["RETRO","INTERNET","90S","GLITCH"],message:`Take a picture and transform it into the experience of a slow-loading 1990s internet image over a dial-up connection. Render the image as if it is partially downloaded, frozen mid-load, or failing to fully render. Randomly select and display exactly ONE of the following on-screen status messages, styled in a simple early-web or system monospace font:
• "Stuck at 87%"
• "Connection Lost"
• "Retrying…"
• "Image Failed to Load (Alt Text Only)"
• "Low Bandwidth Mode"

Visually reflect the selected status message in the image rendering:
- If partially loaded, reveal only sections of the image using horizontal loading bands, blocky color fills, or coarse pixel previews.
- If failed, leave large portions blank, replaced by placeholder space, broken image icons, or alt-text-style text.
- If retrying, show uneven clarity with duplicated or misaligned segments. Preserve the subject’s recognizable features even when incomplete. Simulate authentic early-internet artifacts such as compression noise, color banding, abrupt resolution jumps, and unstable alignment. Include a minimal progress indicator or percentage counter when appropriate, ensuring all text is large and legible on small screens. The final image should feel frozen in time—nostalgic, frustrating, and unmistakably mid-download.`},{name:"BERENSTAIN",category:["CARTOON","ILLUSTRATION","CHILDRENS BOOK","CLASSIC"],message:`Take a picture and transform the subject into a warm, storybook-style cartoon inspired by classic Berenstain Bears illustrations.

STYLE & CHARACTER RULES:
• Soft ink outlines with watercolor-style coloring
• Cozy, rounded character designs
• Gentle facial expressions and readable emotions
• Include multiple friendly animal characters in a family or town setting

SCENE & TONE:
• Wholesome, educational, and nostalgic
• Domestic or small-town environments
• Storybook composition and warmth

The final image should look like a fully composed Berenstain Bears–style hand-drawn illustration with the subject and additional characters integrated seamlessly into the world.`},{name:"BIBLE VERSE",category:["RELIGIOUS","LESSON"],message:`Take a picture and analyze the subject’s appearance, expression, posture, and surrounding context. Select a Bible verse that best reflects the situation, moral lesson, warning, encouragement, or judgment suggested by the image, OR use a specific verse provided via external master prompt.

Transform the image into a reverent, illustrated or photographic composition where the subject is visually connected to the chosen verse. The subject may appear within a symbolic scene, subtle vignette, or respectful setting that reinforces the meaning of the passage.

Include the full text of the selected Bible verse clearly displayed within the image, along with the book, chapter, and verse reference (for example: Proverbs 17:28). Ensure the text is legible on a small screen.

Use a restrained, respectful tone. Avoid parody. The final image should feel like a devotional illustration or inspirational Bible page where the verse meaningfully corresponds to the subject’s traits or actions.`},{name:"BIBLICAL ILLUSTRATION",category:["ART","RELIGIOUS","MEDIEVAL"],message:"Take a picture in the style of a Medieval Biblical illustration. Illuminated manuscript style.  The result should be a full view of the illustration with a relevant background behind the illustration."},{name:"BILLBOARD",category:["COMMERCIAL","MASTER PROMPT","ADVERTISING","LARGE FORMAT"],message:"Take a picture and transform it into a large outdoor billboard featuring the subject. Include a clearly readable humorous headline and a calling number that can be appended via an external master prompt. The billboard should appear photographed from the street, with realistic perspective, lighting, shadows, and surrounding environment (sky, buildings, street). Ensure the subject is integrated naturally into the billboard image, and the text and number are large and legible even on a small screen."},{name:"BILLY BOB",category:["HUMOR","CHARACTER","EXAGGERATION"],message:`Take a picture and transform the subject into an exaggerated, over-the-top rural comedy character while preserving their recognizable identity.

Focus on playful visual exaggeration rather than insult or degradation.

CHARACTER DESIGN:
• Exaggerated buck teeth or gap-toothed grin
• Goofy, mischievous facial expression
• Slightly cartoonish facial proportions (big smile, expressive eyes)
• Mullet hairstyle (short on top and sides, long flowing in back)

WARDROBE:
• Plaid flannel shirt, sleeveless undershirt, or denim overalls with one strap undone
• Trucker cap or camouflage hat
• Worn work boots or bare feet

ACCESSORIES:
• Fishing rod, lawn chair, cooler, moonshine-style jug, or can of cheap beer
• Rusty tools, old tires, porch furniture, or lawn decorations

ENVIRONMENT:
• Rural yard, trailer-style home, weathered porch, rusted pickup truck
• Overgrown grass, scattered junk, sun-faded objects

STYLE & TONE:
• Clearly comedic and exaggerated
• Lighthearted parody, not mean-spirited
• Photorealistic but intentionally cartoonish in expression
• Warm outdoor lighting with slightly washed-out rural tones

IMPORTANT:
The transformation should feel like a playful caricature of a fictional rural comedy character, not a judgment of real people.

The subject’s identity must remain recognizable beneath the exaggerated styling.`},{name:"BIRTHDAY CARD",category:["GREETING","MASTER PROMPT","CELEBRATION","CARD"],message:"Take a picture and transform it into a polished birthday greeting card design. Place the subject as the centerpiece of the card, integrated naturally into a celebratory scene with decorations such as balloons, streamers, confetti, or candles appropriate to the birthday theme. Generate a warm, fun, or heartfelt birthday message using flavor text inspired by the subject’s appearance, personality, and surroundings. Incorporate any externally provided birthday details naturally into the design. Ensure the full birthday message is clearly visible within the image. The final result should look like a professionally designed greeting card with cohesive layout, festive lighting, and joyful atmosphere.  The result should be a full view of the card with a relevant background behind the card."},{name:"BLADE RUNNER",category:["MOVIES","SCI FI","CYBERPUNK"],message:"Take a picture and transform the image into a Blade Runner-inspired cinematic scene. Rain-soaked neon city, fog, reflections. High contrast, cyber-noir lighting. Photorealistic sci-fi atmosphere."},{name:"BLUEPRINT",category:["TECHNICAL","DESIGN","ARCHITECTURE"],message:"Take a picture and transform the image into a blueprint technical drawing. White linework on blue background. Precise, schematic style."},{name:"BLUEY",category:["CARTOON","KIDS","ANIMATED","AUSTRALIAN","TV"],message:"Take a picture and transform the subject into a character in the Bluey animated series. Convert the subject into Bluey's distinctive animation style - anthropomorphic dog character with the subject's recognizable features translated to cartoon form. The character should be a dog (Blue Heeler, Beagle, or other breed) standing upright on two legs with rounded cartoon proportions, simplified features, and that characteristic Bluey art style - smooth vector animation, solid color fills with minimal gradients, simple black outlines, expressive dot eyes, and rounded friendly shapes. Preserve the subject's identity through color choices, accessories, clothing patterns, and facial expression. Dress them in simple children's clothing typical of Bluey characters - t-shirts, shorts, dresses with minimal detail and solid colors. Place them in iconic Bluey locations: the Heeler family home (open plan living room, backyard with poinciana tree), playground, beach, or Brisbane suburban setting. Include other Bluey characters in the scene - Bluey, Bingo, Bandit, Chilli, or friends - interacting naturally with the subject character. Use Bluey's signature art style: flat cel animation, warm color palette (blues, oranges, yellows), soft shadows, playful poses, child-like energy. The background should have Bluey's detailed but stylized Australian home aesthetic - mid-century modern furniture, toys scattered around, natural lighting. Capture Bluey's wholesome imaginative play vibe. Make it look like an actual frame from a Bluey episode with the subject seamlessly integrated as a new character in the beloved Australian cartoon world."},{name:"BOARD GAME",category:["HUMOR","GAME","RETRO","POP CULTURE"],message:`Take a picture and transform the subject into the featured character on the front of a classic mass-market board game box inspired by iconic Hasbro or Mattel games (such as Life, Monopoly, Chutes and Ladders, Sorry!, Candy Land, or Trouble).

Design the image as a FULL, front-facing board game box, completely visible within the frame with no cropping. Show the box edges, title banner, age range, player count, and bottom information strip so it clearly reads as a real retail board game.

Select the specific game style automatically based on the subject’s appearance, mood, or environment:
• Formal, confident, or businesslike → Monopoly-style
• Cheerful, family-friendly, playful → Life-style
• Childlike, whimsical, or silly → Chutes & Ladders or Candy Land-style
• Chaotic or mischievous → Sorry! or Trouble-style

Illustrate the subject in the exaggerated, cheerful illustration style typical of classic board game box art — expressive pose, simplified features, bright saturated colors, and bold outlines. The subject should feel like part of the original game universe, not a modern photo pasted onto a box.

Create a humorous game title or subtitle inspired by the subject, written in large, bold, vintage-style typography that closely resembles classic board game branding without copying exact logos.

Include playful, absurd supporting details such as:
• fake player count and age range
• a ridiculous but family-friendly game objective
• small icon badges or bursts ("Family Favorite!", "New Edition!", "Now With More Drama!")

Ensure everything is readable on a small screen. The final image should feel instantly recognizable as a classic toy-store board game from the 1960s–1990s — nostalgic, colorful, wholesome, and funny.`},{name:"BOBBLEHEAD",category:["TOY","HUMOR","MASTER PROMPT"],message:`Take a picture and transform the subject into a collectible bobblehead figurine. The head must be fully **toy-like**, made of smooth, glossy plastic with subtle reflections and soft highlights — it should **look like a manufactured bobblehead head**, not a human head. Enlarge the head relative to the body in true bobblehead style, with slightly exaggerated cartoonish features while keeping the subject recognizable. Simplify details for a playful, toy-like appearance.

Render the body smaller, proportionally correct for a bobblehead, with a plastic finish and soft shadows to make it look tangible. Place the bobblehead on a small pedestal, fully visible in the frame.

Generate the honorary title dynamically using humorous flavor text derived from the subject’s traits, pose, expression, clothing, or environment. For example, 'Supreme Caffeine Conqueror' for someone holding a coffee cup, or 'Master of Stillness' for someone sitting cross-legged. Keep the title bold, funny, and absurd.

Ensure the full bobblehead and pedestal are visible, fully contained in the frame, and clearly readable on small screens. The final image should feel playful, exaggerated, **immediately humorous**, and unmistakably a **toy bobblehead** rather than a human figure.`},{name:"BODY PAINT",category:["ART","SURREAL","COLOR","HUMOR"],message:`Take a picture of the subject and transform their entire body into being completely covered in a single color of paint.

The paint must fully cover skin, clothing, and visible features, forming a seamless, uniform layer. It should appear realistic, with proper reflections, texture, gloss, and interaction with body contours.

Lighting and shadows must respond naturally to the paint surface. The environment must remain consistent with the original photo, reflecting realistic highlights and color spill from the painted subject.

The final image must look like a real photograph of the subject entirely covered in one color of paint, with no digital overlays or pasted effects.`},{name:"BODY TYPE INVERSION",category:["TRANSFORMATION","BODY","SWAP"],message:"Take a picture and transform the subject into a contrasting physique while preserving the subject’s recognizable facial structure, identity, posture, and personality. Adjust overall body proportions in a realistic and natural way, maintaining anatomical plausibility, balanced proportions, and consistent lighting. Adapt clothing to fit the updated physique naturally. Ensure the subject remains clearly identifiable and fully integrated into the scene, rendered with photorealistic detail."},{name:"BOKEH PHOTOGRAPHY",category:["PHOTOGRAPHY","ARTISTIC","BLUR"],message:"Take a picture in the style of Bokeh photography. Give it the aesthetic quality of the blur in the out-of-focus areas of a photograph with soft, circular light spots. Wide aperture and a fast lens, with the subject at a different focal plane from the background. Creates a shallow depth of field, blurring the background to make the subject stand out and adding a dreamy or artistic quality to the image."},{name:"BOOK COVER",category:["HUMOR","PUBLISHING","DESIGN","POP CULTURE"],message:`Take a picture and transform it into a fully designed book cover featuring the subject as the author and central figure.

Design a complete, realistic book cover layout that is fully visible within the frame, including title, subtitle, author name, and background artwork. The subject should be integrated into the cover art itself (illustrated or photo-based depending on style), not pasted on top.

Generate the book’s title and subtitle using humorous flavor text inspired by the subject’s appearance, posture, expression, clothing, or environment. Examples:
• "How I Almost Had It Together"
• "Leadership, Luck, and Lowered Expectations"
• "The Art of Trying"

Use professional book-cover typography and composition appropriate to the genre (self-help, memoir, motivational, or absurd nonfiction). Optionally include fake bestseller badges, review blurbs, or award seals for added humor.

If external master prompt text is provided, use it to influence the book’s title, subtitle, or genre.

Ensure the entire book cover is visible, centered, and readable on a small screen. The final image should feel like a real book you might actually see in a bookstore — polished, believable, and funny.`},{name:"BREAKING NEWS",category:["NEWS","TV","DRAMATIC","MASTER PROMPT"],message:"Take a picture and transform it into a realistic breaking-news television broadcast scene. Place the subject as the central focus of the news coverage, integrated naturally into the scene. Design an authentic news layout including lower-third graphics, headline banners, and on-screen text. Generate a breaking-news headline and brief caption using flavor text inspired by the subject’s appearance, actions, or surroundings, incorporating any externally provided details naturally. Ensure all text is clearly readable within the image. Match professional broadcast lighting, camera angles, and visual polish so the image convincingly resembles a real live news report."},{name:"BROADWAY MUSICAL",category:["THEATER","MUSICAL","BROADWAY","STAGE","PERFORMANCE"],message:`Take a picture and place the subject as a performer in a major Broadway musical production, randomly selecting from iconic shows: Cats, Wicked, Phantom of the Opera, Book of Mormon, Hamilton, Chicago, Les Miserables, Oklahoma, A Chorus Line, Fiddler on the Roof, West Side Story, Mamma Mia, Rent, or similar Broadway classics.

Costume the subject in character-appropriate attire from the selected show - whether elaborate period costume, stylized animal costume with makeup, revolutionary-era clothing, 1920s jazz-age attire, fantasy witch costume, or show-specific signature looks. Include detailed makeup, wigs, and accessories specific to that production's aesthetic.

Place the subject on stage within an iconic scene from that musical, surrounded by other cast members in full costume performing alongside them. Include recognizable set pieces, props, and staging elements from that specific show - grand staircases, chandeliers, barricades, urban fire escapes, Pride Rock, etc.

Stage lighting should be dramatic theatrical lighting with colored gels, spotlights, dramatic shadows, and that distinctive Broadway stage illumination. Capture the energy of live performance with dynamic poses mid-song or mid-choreography.

The subject should be frozen in a performance moment - singing with emotion, dancing with ensemble, delivering dramatic dialogue, or in an iconic pose from that show. Expression should convey the theatrical emotion and energy of Broadway performance.

Include production value details: orchestra pit visible at stage edge, audience barely visible in darkness beyond footlights, theater architecture, or the massive scale of Broadway set design.

The final image should look like a professional production photograph from an actual Broadway show - theatrical, dramatic, high-energy, with spectacular costumes and sets. The subject should appear as a genuine Broadway performer seamlessly integrated into the iconic musical, capturing the magic and grandeur of live theater.`},{name:"BULLFIGHTER",category:["FESTIVAL","SPAIN","CULTURE","HUMOR"],message:`Take a picture and transform the subject into a bullfighter in a traditional Spanish bullring.

Randomize the scene between two modes:

1. Serious Mode:
• Subject confidently posing as a matador
• Elegant stance with red cape
• Bull positioned calmly in the background at a safe distance
• Formal, heroic composition

2. Humorous Mode:
• Subject distracted or unaware
• Bull moving energetically in the arena behind them (NOT attacking or charging)
• Spectators reacting with exaggerated gestures, pointing and laughing
• Playful chaos atmosphere without danger

SCENE DETAILS:
• Realistic bullring arena
• Sand floor texture
• Traditional audience seating
• Authentic matador costume (gold embroidery, fitted jacket, sash, cape)
• Festival lighting and vibrant colors

IMPORTANT SAFETY RULES:
• No gore
• No injury
• No attack contact
• No violence depiction
• No imminent harm framing
• Bull must never be shown making contact with the subject

TONE:
• Lighthearted comedy or heroic drama
• Festival atmosphere
• Cinematic but safe
• Photorealistic cultural scene

Preserve the subject’s recognizable identity and facial features in all modes.`},{name:"BUMPER STICKER",category:["HUMOR","CAR","TEXT","MASTER PROMPT"],message:"Take a picture and place a realistic bumper sticker on a car or object featuring the subject. The sticker should contain a humorous saying based on the subject’s traits, which can be supplied via external master prompt. Ensure the sticker looks physically attached, with correct perspective, lighting, texture, and slight surface curvature. The subject should be recognizable in the sticker image if included, and the overall composition should read instantly as a real bumper sticker."},{name:"BUSBY BERKELEY MUSICAL",category:["MOVIES","MUSICAL","VINTAGE","DANCE","1930S"],message:`Take a picture and place the subject into an elaborate Busby Berkeley-style musical production number from 1930s-1940s Hollywood.

The subject should be positioned as the featured performer within Berkeley's signature kaleidoscopic geometric formations. Surround them with dozens of chorus dancers (showgirls) arranged in intricate patterns - circles, spirals, flower formations, or symmetrical designs viewed from an overhead camera angle.

Costume the subject in glamorous 1930s-1940s musical attire: sequined or beaded costume, feathers, flowing fabrics, art deco-inspired design elements, ornate headdress, or elegant formal wear. Chorus dancers should wear matching elaborate costumes creating visual patterns.

Setting should feature Berkeley's signature elements: glossy black reflective floors creating mirror effects, massive art deco sets with geometric staircases, enormous revolving platforms, dramatic columns, or abstract modernist backdrops. Include his famous overhead 'kaleidoscope' camera angle showing the full geometric pattern of dancers.

Lighting should be dramatic 1930s Hollywood style - strong key lights creating glamorous shadows, sparkle effects on sequins and reflective surfaces, high contrast black and white or early Technicolor look with saturated colors.

Choreography frozen mid-movement: synchronized dancers in identical poses creating living geometry, the subject at the center or focal point of the formation, arms and legs positioned to create patterns, possibly using props like fans, hoops, or ribbons arranged symmetrically.

The final image should look like an actual still from a Busby Berkeley musical number - impossibly elaborate, geometrically precise, glamorous, and larger-than-life with that distinctive 1930s-1940s Hollywood musical spectacular aesthetic. Capture the opulence, precision, and visual innovation of Berkeley's choreographed patterns.`},{name:"BUT CAN IT PLAY DOOM?",category:["RETRO","GAMING","90S","PIXEL"],message:"Take a picture and transform the subject into a classic early-1990s first-person shooter space marine rendered as a low-resolution pixel-art sprite. Preserve recognizable facial features, body proportions, and clothing identity while adapting them into a gritty, combat-ready sprite suitable for pseudo-3D FPS gameplay. Render the subject using chunky pixel shading, a limited retro color palette, visible dithering, and a forward-facing or slightly angled sprite orientation typical of early PC shooters. The character must appear natively integrated into the scene, not composited. Compose the image as a static gameplay frame from a first-person shooter perspective inside a dark industrial sci-fi environment with metallic corridors, harsh lighting, and ominous atmosphere. Include a bottom-of-screen retro FPS status interface featuring generic numeric indicators for health, armor, and ammunition, along with a small pixel-art player portrait that reflects the subject’s condition. Ensure the entire image reads clearly as a single authentic gameplay screenshot from a 1990s-era PC shooter, with crisp pixel edges, strong silhouette clarity, and cohesive retro aesthetics optimized for small screens."},{name:"BYZANTINE ICONOGRAPHY",category:["ART","RELIGIOUS","MEDIEVAL","GOLD"],message:"Take a picture and transform the image into a Byzantine-style religious icon. Place the subject in the center with a gilded halo, frontal pose, and flat symbolic colors. Add ornamental borders. The subject remains recognizable while adopting the solemn, formal, and spiritual style."},{name:"CABINET",category:["POLITICAL","FORMAL","GOVERNMENT","HISTORICAL"],message:"Take a picture and subtly place the subject as a Cabinet member standing next to a President of the United States during an official Cabinet meeting or photo opportunity. Choose a recognizable U.S. President - could be current or historical (Trump, Biden, Obama, Bush, Clinton, Reagan, Kennedy, etc.). Dress the subject in professional business attire appropriate for a Cabinet Secretary - dark suit and tie for men, professional suit or dress for women, American flag lapel pin. Place them in the White House Cabinet Room or Oval Office setting during an official gathering - standing behind or beside the seated President at the long Cabinet table, or standing in a group photo with other Cabinet members. Include authentic White House details: presidential seal visible, portraits of past presidents on walls, formal furniture, flags, ornate molding and décor. Other Cabinet members should be visible - Secretary of State, Defense, Treasury, etc. - all in formal business attire. The subject should have a serious, professional expression, appearing to listen attentively or participate in discussion. Show subtle body language of being part of the inner circle - standing close to President, in positions of importance. Use official White House photography aesthetic - professional lighting, formal composition, photojournalistic style. The subject should blend naturally into the scene as if they're an actual appointed Cabinet Secretary. Make it look like an authentic White House press pool photograph or official government documentation with the subject seamlessly integrated as a key advisor to the President."},{name:"CALENDAR PIN-UP",category:["HUMOR","CALENDAR","GLAMOUR"],message:`Take a picture and transform the subject into a playful, over-the-top calendar pin-up page in the style of novelty wall calendars sold in gift shops.

If the subject is male: place them as a heroic firefighter model wearing an open uniform shirt or tank top, helmet, and suspenders, posed confidently in front of a firehouse or fire truck.

If the subject is female: place them as a swimsuit calendar model wearing a stylish, tasteful swimsuit, posed confidently at a beach or poolside.

The mood should be fun, cheeky, and glamorous — never sexualized. Poses should feel like a commercial calendar shoot, not suggestive or explicit.

Include a full calendar layout with month name, dates, and a bold calendar title at the top. The final image should feel like a real novelty pin-up calendar page that someone might hang in an office or garage.`},{name:"CANDY",category:["FOOD","SWEET","TRANSFORMATION","COLORFUL","MATERIAL"],message:`Take a picture and completely REBUILD the entire image so that EVERYTHING is made entirely out of candy.

ABSOLUTE REQUIREMENT: No photographic pixels, skin, fabric, metal, plastic, paper, or real-world materials may remain.

The subject, clothing, facial features, hair, background, environment, objects, shadows, and depth must ALL be constructed entirely from candy materials.

DO NOT apply candy textures to a photo.
DO NOT overlay candy on top of existing objects.
DO NOT trace, mask, silhouette, or reuse the original photograph’s structure.

The image must look as if the original photograph never existed and was replaced by a fully constructed candy sculpture world.

Candy materials may include (used structurally, not decoratively):
• Gummies (gummy worms, gummy bears)
• Gumballs
• Hard candy (Werther’s Originals, Nerds, Jolly Ranchers)
• Chocolate (Tootsie Rolls, Hershey’s Kisses)
• Licorice (Twizzlers, Red Vines)
• Lollipops
• Chewy candy (Jelly Belly jelly beans, Bayside Candy fruit slices, candy corn, gumdrops)
• Sugar crystals and popping candy (Pop Rocks)
• Marshmallows, caramel, sprinkles, candy canes
• Candy wrappers ONLY if physically folded, crinkled, and used structurally

Candy construction rules:
• Hard candy for rigid forms (bones, structure, buildings)
• Gummies for flexible areas (skin, muscles, cheeks, folds)
• Chocolate for smooth surfaces and large masses
• Licorice and candy ropes for joints, outlines, and connections

Shading and depth MUST be created ONLY by:
• Candy translucency
• Color variation
• Gloss and reflection
• Candy density, layering, and stacking

Lighting must behave like real candy:
• Glossy highlights
• Sticky reflections
• Subsurface glow in translucent candies
• Slight melting, sagging, or stretching where appropriate

FINAL VALIDATION RULE:
If the image looks like a normal photograph with candy placed on top, IT IS WRONG.

The final image must look like a real, physical candy sculpture or candy-built environment photographed in real lighting.`},{name:"CARICATURE",category:["HUMOR","ART","EXAGGERATED"],message:"Take a picture and make it a caricature. Defined by exaggerated features, bold expressions, and a humorous twist while preserving likeness. It captures the essence of a person or scene in a fun, over-the-top way, like something you would get from a street artist at a fair, bursting with personality and charm."},{name:"CARRY ME",category:["HUMOR","SITUATIONAL","MASTER PROMPT"],message:`Take a picture and transform it into a scene where one person is carrying the subject on their shoulders.

If there are TWO subjects in the image: Have one subject carrying the other on their shoulders. Choose based on context, size, or humor - the carrier should look strained, proud, or playfully struggling while the person being carried shows excitement, triumph, or awkward balance.

If there is only ONE subject in the image: A famous person (specified via master prompt, or choose an appropriate celebrity if none specified) will either carry the subject on their shoulders OR the subject will carry the famous person. The interaction should feel natural and humorous.

Both people should have realistic expressions: the carrier might show effort, determination, or playful annoyance; the person on shoulders might show joy, victory, fear of falling, or awkward balance with arms outstretched.

Preserve recognizable facial features and body proportions for all people. The physical interaction must look believable - proper hand placement on legs/thighs, realistic weight distribution, natural body positioning.

Set the scene in an appropriate context: concert crowd, celebration, sporting event victory, parade, beach, park, or casual outdoor setting. Include realistic background elements and other people reacting to the moment.

Lighting and photography should be photorealistic, as if captured during an actual candid moment. The final image must look like a real photograph of this playful, triumphant, or humorous shoulder-carrying moment.`},{name:"CELL PHONE WALLPAPER",category:["WALLPAPER","MOBILE","HUMOR","DESIGN"],message:`Take a picture and transform the subject into a vertical smartphone wallpaper that looks like a fake, humorous phone operating system.

Use a tall portrait aspect ratio (about 9:16 or taller). The subject should be the main character of the ‘phone,’ either as the lock-screen wallpaper or as a character integrated into the interface.

Overlay a fake phone UI including:
• a fake clock and date
• silly or themed app icons inspired by the subject’s traits (e.g., "Fart Tracker", "Overthinking", "Drama Meter", "Nap Mode")
• fake battery, Wi-Fi, and signal indicators with humorous labels

Add subtle cracked-glass lines across the screen — fine hairline fractures, small chips, or spiderweb cracks — so it looks like a phone with a lightly damaged display. The cracks should sit on top of the image like real broken glass, but must not block the subject’s face or important UI text.

Design the interface so it feels like a real smartphone screen but with absurd, playful details. Icons should be large, readable, and placed naturally like a real phone home screen.

Leave the top and bottom areas clear enough that the subject’s face or main features are not blocked by UI elements.

The final image should feel like the subject owns their own ridiculous, slightly broken custom smartphone — funny, charming, and clearly readable on a small screen.`},{name:"CELTIC ART",category:["ART","CULTURAL","MEDIEVAL","KNOTS"],message:"Take a picture and convert it into a Celtic art piece inspired by the Book of Kells; highly detailed, intricate knotwork, flowing lines, and mystical geometry with the visual language of ancient Celtic art; ornate patterns and symbolic forms."},{name:"CERAMIC FIGURINE",category:["TOY","COLLECTIBLE","MINIATURE"],message:"Take a picture and transform the subject into a small ceramic figurine. The subject should appear glazed, hand-painted, and slightly imperfect, like a decorative shelf figurine. Use realistic reflections, chips, and glaze texture so it looks like a real ceramic object photographed on a table or shelf."},{name:"CERAMIC TILE",category:["ART","MOSAIC","DECORATIVE"],message:"Take a picture and convert the image into painted ceramic tiles. Glossy glaze, repeating patterns."},{name:"CH-CH-CH-CHIA PET",category:["HUMOR","RETRO","TRANSFORMATION"],message:"Take a picture and transform the subject into a Chia Pet terracotta planter. Subject should be shaped like a clay pottery figurine in terracotta orange-brown color with porous ceramic texture. Dense green chia sprouts growing from the top and surfaces, creating hair/fur effect with small green leaves. 1980s infomercial product aesthetic, sitting on surface, 'Ch-ch-ch-chia!' retro novelty gift appearance. Handmade pottery look with chia seeds sprouting lush greenery."},{name:"CHALKBOARD ILLUSTRATION",category:["HUMOR","ILLUSTRATION","RETRO"],message:`Take a picture and render the subject and scene entirely as a chalkboard drawing.

The image should look hand-drawn with white and colored chalk on a dusty black or green chalkboard. Lines should be rough, imperfect, and textured.

Include humorous chalk-written flavor text, arrows, labels, or diagrams pointing to exaggerated features or situations.

Use smudges, chalk dust, and erased areas to enhance realism.

DO NOT create a realistic photo with a chalk filter — the entire image must be illustrated in chalk style.

The final result should look like a funny classroom chalkboard drawing.`},{name:"CHAPULÍN COLORADO",category:["TV","COMEDY","MEXICAN","SUPERHERO","TRANSFORMATION"],message:"Take a picture and transform the subject into El Chapulín Colorado, the beloved Mexican comedy superhero. The subject should wear the iconic red suit with yellow heart emblem on the chest, red and yellow striped short sleeves and pant legs, red antennae on the head, and carry the chipote chillón (squeaky hammer). Preserve the subject's recognizable facial features but add El Chapulín's characteristic expression - wide-eyed, earnest, and slightly confused. Place them in a comedic action scene with dramatic lighting but humorous situation - perhaps striking an exaggerated heroic pose while something comical happens around them. Include other elements from the show like the chirimoya (horn of plenty device) or antenitas de vinil. Use bright, saturated colors typical of the classic TV show. Capture the essence of this beloved character - well-meaning, clumsy, but ultimately heroic. Make it photorealistic as if the subject actually became El Chapulín Colorado."},{name:"CHARACTER BOARD",category:["HUMOR","TOURIST","CUTOUT"],message:"Take a picture and transform it into a classic tourist character board photo. Place the subject’s face inside a cut-out hole of a painted character illustration, while the rest of the body is a flat, illustrated scene. The board may depict a humorous, heroic, historical, or themed character. Align the subject’s face naturally with the cut-out and slightly exaggerate expression for comedic effect. The painted board should look weathered or hand-painted, as if found at a tourist attraction. The final image should feel playful, kitschy, and instantly recognizable as a face-in-the-hole photo."},{name:"CHARCOAL",category:["ART","DRAWING","SKETCH"],message:"Take a picture and convert the image into a detailed charcoal sketch. Rich grayscale tones, textured shading, and expressive strokes on paper."},{name:"CHARLOTTE'S WEB",category:["TRANSFORMATION","LITERARY","SPIDER","TEXT","HARD MATERIAL"],message:`Take a picture and COMPLETELY REBUILD THE IMAGE so that the ENTIRE IMAGE is made ONLY from spider web silk.

ABSOLUTE MATERIAL LOCK:
• No skin
• No photography
• No shading from lighting on real objects
• No background image
• No objects behind the web

If ANY photographic image, face, body, or object is visible behind or beneath the web, THE RESULT IS INVALID.

The subject, face, body, background, depth, shadows, and environment MUST ALL be CONSTRUCTED FROM WEB STRANDS THEMSELVES.

DO NOT place a web over an image.
DO NOT trace a photo with silk.
DO NOT silhouette a person behind a web.

THE SUBJECT IS NOT BEHIND THE WEB.
THE SUBJECT IS NOT ON THE WEB.
THE SUBJECT IS THE WEB.

Construction rules:
• Dark areas = tightly packed overlapping silk strands
• Light areas = sparse silk spacing
• Facial features formed ONLY by strand density and direction

The web must use REAL orb-web physics:
• Radial support lines
• Spiral capture threads
• Irregular tension
• Anchor points extending into empty space (not onto objects)

Text requirement:
Readable text must be WOVEN INTO THE WEB STRUCTURE ITSELF using silk strands.

If master prompt text exists, weave that text.
Otherwise weave classic phrases:
SOME PIG / TERRIFIC / RADIANT / HUMBLE

Environmental rules:
• Background must be empty air, fog, darkness, or blurred depth — NOT scenery
• Light may illuminate strands but may NOT reveal hidden images

FINAL VALIDATION TEST:
If removing the spider silk would reveal a normal image underneath, THE RESULT IS WRONG.

The final image must look like a real macro photograph of a spider web that magically forms a subject and text through silk alone.`},{name:"CHAVO DEL OCHO",category:["TV","COMEDY","MEXICAN","RETRO","SITCOM"],message:`Take a picture and transform the subject into a character from the classic Mexican television show El Chavo del Ocho.

If the subject is MALE: Transform them into either Quico or El Chavo del Ocho. Preserve the subject's recognizable facial features while adapting their appearance to match the character's iconic look - period-appropriate clothing from the 1970s Mexican sitcom, characteristic hairstyle, and the comedic expression associated with the character. El Chavo wears his iconic barrel-striped shirt and cap, while Quico wears his sailor suit or formal attire.

If the subject is FEMALE: Transform them into La Chilindrina. Preserve recognizable facial features while adapting to her iconic appearance - including her signature freckles, pigtails with bows, colorful patterned dress, and thick-framed glasses. Capture her mischievous, playful expression.

The setting should reflect the show's environment: the vecindad (neighborhood courtyard), with its characteristic architecture, stairs, doorways, and the nostalgic 1970s Mexican aesthetic. Include warm, slightly vintage color tones and lighting that matches the show's classic filmed appearance.

The transformation should be photorealistic but capture the comedic, innocent, and nostalgic spirit of the beloved show. Expressions should be playful, exaggerated, or characteristic of the specific character's personality - El Chavo's innocent confusion, Quico's spoiled bratty attitude, or La Chilindrina's clever mischievousness.

Maintain the subject's identity while fully immersing them in the iconic visual world of El Chavo del Ocho with period-accurate costumes, setting, and the show's signature warm, nostalgic atmosphere.`},{name:"CHEAP REALITY",category:["SURREAL","UNDERPRODUCED","COMEDY","REALITY GLITCH"],message:`Take a picture and recreate the reality of the scene as if existence itself were underproduced and cheaply made.

CORE CONCEPT (CRITICAL):
• The world is real, not fictional, but visibly cheap
• This is not a movie set and not a parody of a movie
• Reality itself feels poorly funded and hastily constructed

UNDERPRODUCTION RULES (CRITICAL):
• Everyday objects appear flimsy, low-cost, or improvised
• Materials may include cardboard, thin plastic, tape, foam, cheap paint, or visible seams
• Structural elements look functional but barely convincing
• Nothing should look intentionally stylized — it should look like this is genuinely how reality is

ENVIRONMENTAL DETAILS:
• Walls, furniture, and surfaces may show:
  – Misaligned edges
  – Peeling paint or uneven finishes
  – Obvious shortcuts in construction
• Props should feel like last-minute solutions

SUBJECT INTEGRATION:
• The subject must behave normally, as if this cheapness is expected
• No awareness, surprise, or comedy posing
• The subject is not breaking the fourth wall

PHYSICS & LOGIC:
• Physics must still work correctly
• Gravity, scale, and perspective remain real
• The cheapness is purely in materials and execution, not physical laws

LIGHTING & CAMERA:
• Flat or utilitarian lighting
• No dramatic stylization
• Camera feels observational, not cinematic

TONE:
• Quietly absurd
• Dry, existential humor
• Feels like a universe built on a tight budget

FINAL RESULT:
The final image must look like genuine reality where everything is inexplicably cheap and underproduced — as if the universe was constructed with the bare minimum of resources. The humor should emerge from understatement and inevitability, not exaggeration or parody.`},{name:"CHECKMATE",category:["HUMOR","CHESS","GAME","STRATEGIC"],message:`Take a picture and transform the subject into ALL the chess pieces from one side (either white or black) positioned on an actual chessboard.

The subject's facial features, expressions, and personality should be adapted into EACH of the six different chess piece types: King, Queen, Rook (2), Knight (2), Bishop (2), and Pawn (8). Each piece should be a miniature sculptural version of the subject, maintaining recognizable identity while adapted to the specific piece's form and role.

Design variations for each piece type:
- KING: Subject with crown, regal posture, tallest and most ornate
- QUEEN: Subject with elaborate crown/headpiece, powerful stance, second tallest
- BISHOPS: Subject with pointed mitre hat, diagonal-moving poses
- KNIGHTS: Subject with horse-themed elements, dynamic action poses
- ROOKS: Subject as tower/castle form, strong geometric base
- PAWNS: Subject in simplified form, smallest and most numerous

All pieces should follow classic Staunton chess piece proportions but personalized with the subject's features, clothing details, or characteristics. Each piece should be clearly identifiable as both the subject AND the chess piece type.

Arrange all 16 pieces (1 King, 1 Queen, 2 Rooks, 2 Knights, 2 Bishops, 8 Pawns) in proper starting chess positions on a realistic wooden or marble chessboard. Include opposing traditional chess pieces on the other side for context and scale.

Lighting should be dramatic and strategic, casting shadows that emphasize the three-dimensional sculptural quality of each piece. Use proper perspective showing the full board setup.

The final image should look like a photograph of a complete custom chess set where every piece on one side is a personalized version of the subject, ready for an actual game. The subject becomes an entire army of chess pieces, not just one.`},{name:"CHEER-LEADER",category:["HUMOR","SPORTS","COSTUME"],message:`Take a picture and transform the subject into a female cheerleader regardless of their gender. Dress them in a classic cheerleading outfit with pom-poms, skirt, and team colors.

Give them energetic poses, big smiles, and stadium or gymnasium background.

The result should be playful, confident, and clearly recognizable as a cheerleader scene.`},{name:"CHEESE TOUCH",category:["HUMOR","FOOD","ABSURD"],message:`Take a picture and transform the entire scene as if everything has been infected by a mysterious 'cheese touch.'

Convert the subject, clothing, nearby objects, and visible environment into cheese-based versions of themselves. Use a variety of recognizable cheeses (cheddar, Swiss, mozzarella, brie, blue cheese, etc.) with appropriate textures, holes, melts, crumbles, and rinds.

The subject should still be clearly identifiable, but their skin, hair, and clothing should appear sculpted from cheese rather than flesh or fabric. Objects should retain their original shapes but be unmistakably made of cheese.

Avoid cartoon flatness — cheese should look tactile, slightly glossy or matte depending on type, with realistic imperfections. Use playful lighting to emphasize texture.

Ensure the entire composition remains readable on a small screen. The result should feel ridiculous, slightly disturbing, and very funny — as if reality itself has turned into cheese.`},{name:"CHILDHOOD VERSION",category:["AGE","TRANSFORMATION","YOUNG"],message:"Take a picture and depict the subject as a child while preserving recognizable traits. Soft lighting, nostalgic tone."},{name:"CHILD SKETCH ARTIST",category:["ART","NAIVE","CHILD LIKE"],message:"Take a picture and make the subject look like a childlike black and white sketch using simple shapes as if drawn by a six year old."},{name:"CHINESE INK WASH",category:["ART","PAINTING","ASIAN","INK"],message:"Take a picture and transform the image into a traditional Chinese ink wash painting. Use flowing brushstrokes, monochrome tones, soft gradients, and poetic negative space."},{name:"CHOCOLATE SCULPTURE",category:["FOOD","SCULPTURE","SWEET"],message:`Take a picture and transform the subject into a sculpted chocolate figure. The chocolate should appear glossy, slightly textured, and solid, with realistic reflections and subtle imperfections from molding.

Include a clearly visible bite taken from the subject, showing the inner texture of the chocolate. Preserve the subject’s recognizable facial structure and details through the chocolate form while maintaining realistic thickness and volume.

The subject should appear as a real chocolate sculpture placed on a surface, with appropriate shadows and lighting. Avoid CGI or drawn appearance. Ensure the composition is readable on a small screen and the chocolate looks physically edible.`},{name:"CINEMATIC HORROR",category:["HORROR","MOVIES","DARK"],message:"Take a picture and transform the subject into a cinematic horror character while preserving the subject’s recognizable facial structure, body proportions, and identity. Apply unsettling but non-graphic visual traits such as desaturated or ashen skin tones, darkened eye areas, an intense or vacant gaze, and subtly distressed clothing.  Ensure the subject appears physically present in the scene and fully integrated with the surroundings. Render the final image with photorealistic detail and a suspenseful horror aesthetic."},{name:"CIRCUS STAR",category:["HUMOR","STAGE","SPECTACLE"],message:`Take a picture of the subject and place them as the star performer in a grand circus.

The subject should be in the spotlight as a ringmaster, acrobat, strong person, lion tamer, or other dramatic circus role.

The background should include a big top tent, audience, lights, and circus atmosphere.

The subject should be the clear center of attention, performing something impressive or ridiculous.

The final image should look colorful, theatrical, and larger-than-life, like a classic circus poster brought to life.`},{name:"CITY IN TIME",category:["MASTER PROMPT","TRAVEL","HISTORICAL","LOCATION"],message:"Take a picture and place the subject standing naturally within a realistic urban environment. The city, location, and date are defined externally. Integrate the subject seamlessly into the scene so they appear physically present, with correct scale, perspective, lighting, shadows, and reflections. Match architecture, street layout, vehicles, signage, clothing styles, weather, and overall atmosphere appropriate to the specified city and date. Preserve the subject’s facial identity, proportions, posture, and personality while making the scene photorealistic and historically or contemporarily accurate."},{name:"CLASSIC TV COMMERCIAL",category:["RETRO","ADVERTISING","HUMOR","POP CULTURE"],message:`Take a picture and transform the subject into a scene from a famous classic television commercial. Select the commercial automatically based on the subject’s surroundings, visible objects, clothing, actions, or mood — for example:
• A soda or bottle → Coca-Cola or Dr Pepper
• Fast food context → Wendy’s or McDonald’s
• Party or outdoor gathering → Budweiser
• Family or wholesome setting → classic Coca-Cola or cereal ads

Place the subject directly INTO the commercial as if they are the main actor or spokesperson, fully integrated into the scene rather than pasted on. Adapt wardrobe, pose, expression, and lighting so the subject naturally belongs in the advertisement.

Recreate the commercial’s iconic visual language: era-appropriate color grading, film grain, lighting style, set design, camera framing, and product placement. Use a cinematic still-frame composition that feels like a paused moment from a TV ad.

Include a famous, recognizable tagline from the chosen commercial displayed clearly within the scene (on-screen text, signage, packaging, or lower-third caption). The tagline must be fully visible, legible, and feel naturally embedded in the ad design.

If a real brand logo or product appears in the original image or is provided via external master prompt, prioritize selecting that brand’s commercial.

Ensure the full frame is visible with no cropping of the subject, product, or tagline. When a brand is selected, prioritize its most iconic and culturally recognizable catchphrase from classic television commercials (e.g., Wendy’s “Where’s the Beef?”, Budweiser “Whassup!”, Coca-Cola “I’d Like to Buy the World a Coke”), and display it prominently. The scene should feel like a nostalgic parody or affectionate homage to the original commercial, not a modern advertisement or exact recreation. The final image should feel nostalgic, instantly recognizable, humorous, and clearly readable on a small screen — like a classic commercial screenshot frozen in time.`},{name:"CLAYMATION",category:["ANIMATION","CLAY","STOP MOTION"],message:"Take a picture and transform the image into claymation-style. Characters appear fully sculpted from clay with fingerprints and textures."},{name:"CLEANUP CHAOS",category:["UTILITY","ROOM","TRANSFORMATION"],message:`Take a picture of a room or indoor space. Analyze the scene to determine whether it appears mostly clean or messy.

If the room appears messy or cluttered, transform it into a clean, organized version of the same space. Remove clutter, straighten objects, clean surfaces, neatly arrange items, and improve overall order while preserving the original layout, furniture, and lighting.

If the room appears clean or orderly, transform it into a realistically messy version. Add believable clutter such as scattered clothes, papers, cups, toys, or everyday items. Introduce mild disorder without destroying the room or making it unsafe.

Maintain realism, consistent lighting, and the same camera perspective. The transformation should feel like the same room before and after tidying or neglect, and remain clearly readable on a small screen.`},{name:"CLOUD NINE",category:["ARTISTIC","SURREAL","TRANSFORMATION"],message:`Take a picture and transform the subject so it appears **entirely made of clouds**, with no remaining human, animal, or object materials visible.

The subject’s **entire form — head, body, limbs, and features — must be constructed exclusively from cloud matter**. Do not show skin, clothing, solid surfaces, or mixed materials. The subject must not appear inside clouds; the subject itself is the cloud.

The **overall cloud shape must follow the subject’s silhouette, posture, and proportions**. The subject’s outline governs the form.

Determine the cloud **type** as follows:
• If the subject is animate (person or animal), select the cloud type based on the subject’s apparent emotion:
  – Happy or playful → **Cumulus** (bright, puffy, well-defined)
  – Sad, tired, or withdrawn → **Nimbostratus** (heavy, low, rain-filled)
  – Angry, intense, or aggressive → **Cumulonimbus** (towering, dense, storm-like)
  – Calm or neutral → **Stratus** (smooth, layered, subdued)
• If the subject is inanimate, use **Altocumulus** clouds with a neutral, evenly spaced texture.

Use cloud density, lighting, internal shadow, and volume to imply facial features, limbs, and expression without outlines or solid edges.

Avoid solid ground unless contextually appropriate. Use sky gradients, mist, or distant horizons to support the illusion.

Ensure the silhouette remains readable on a small screen. The final image should feel surreal, expressive, and poetic — as if the subject fully transformed into a specific type of weather.`},{name:"COEN BROTHERS FILM",category:["MOVIES","DIRECTOR","QUIRKY","DRAMATIC"],message:"Take a picture and place the subject into a Coen Brothers film scene. Use their distinctive visual style: perfectly composed symmetrical framing, absurdist dark comedy situations, eccentric character styling, and deadpan cinematography. Show the subject as a quirky character in an oddball situation - perhaps caught in circumstances beyond their control with a bewildered or stoic expression. Include Coen Brothers elements: retro Americana settings, vintage cars, small-town locations, period-specific costumes and props. Use their characteristic lighting - naturalistic but carefully composed, often featuring golden hour warmth or harsh fluorescent interiors. Capture their blend of dark humor and existential dread - situations that are simultaneously funny and unsettling. Make it look like a frame from Fargo, The Big Lebowski, or No Country for Old Men with that unique Coen Brothers tone."},{name:"COINED",category:["MONEY","METALLIC","HISTORICAL","PORTRAIT","MASTER PROMPT"],message:"Take a picture and transform the subject's portrait onto the face of a coin. The subject's head should appear in profile or three-quarter view as embossed relief on the coin's surface, rendered in metallic texture - gold, silver, bronze, or copper. Show the portrait raised from the coin surface with dimensional depth and shadow, as if minted or stamped into metal. Surround the portrait with coin text elements around the rim. If master prompt text is provided, incorporate that text as the inscription on the coin - either around the rim, below the portrait, or as the motto. If no master prompt text is provided, use traditional coin phrases like denomination, year, country name, or Latin phrases ('E PLURIBUS UNUM', 'IN GOD WE TRUST'). Include decorative borders, stars, or laurel wreaths. The coin style can vary from ancient Roman/Greek coins with profile emperors, to medieval coins with crowned monarchs, to modern presidential coins with contemporary styling. Include authentic numismatic details: edge ridges (reeding), metallic patina or tarnish, slight wear showing age, that characteristic coin relief depth. The entire composition should be circular showing the full coin face. Use realistic metal textures - reflective highlights on raised surfaces, shadows in recessed areas, authentic metallic sheen. Make it look like an actual photographed commemorative or currency coin with the subject immortalized as the featured portrait, whether ancient artifact or modern minting."},{name:"COLLAGE",category:["ART","MIXED MEDIA","PAPER"],message:"Take a picture in the style of an artistic paper collage with visible cut edges and layered materials."},{name:"COLLECTIBLE TOY",category:["TOY","PACKAGING","COLLECTIBLE"],message:"Take a picture and transform the subject into a collectible toy encased inside its original packaging. Adapt the packaging style to match the type of toy: for example, a car becomes a Matchbox or Hot Wheels package, an action figure or superhero becomes a classic action figure box, a person becomes a Barbie-style doll package, etc. Use the subject’s characteristics, clothing, and personality to inspire the toy design and accessories. Generate flavor text and captions on the packaging based on the subject’s appearance, traits, and surroundings, making it feel like an authentic collectible. Ensure the subject remains recognizable while fully integrated as a toy. Render the final image in high detail with realistic reflections, packaging materials, and lighting, so it looks like a real collectible ready for display."},{name:"COLOR BY NUMBERS",category:["ART","PUZZLE","EDUCATIONAL","OUTLINED"],message:"Take a picture and transform it into a color-by-numbers activity page. Convert the subject into outlined sections, each labeled with a number corresponding to a specific color. The image should be divided into geometric and organic shapes - similar colors grouped into numbered regions. Use thick black outlines defining each section clearly, with numbers printed inside each area indicating which color to use. Include a color key/legend at the bottom or side showing: '1 = Red', '2 = Blue', '3 = Yellow', etc., with 8-15 different colors total. Some sections should already be colored in (showing the activity partially completed), while other sections remain white with just the number visible. Use typical color-by-numbers aesthetic: simplified shapes, clear boundaries, numbers legible inside each section, varying section sizes from tiny details to large areas. Show the page with coloring supplies nearby - colored pencils, crayons, or markers, maybe a partially colored section demonstrating the process. The outlines should be clean and bold for easy following. Include typical activity book elements: page number in corner, title 'Color By Numbers', possibly difficulty rating or age recommendation. The subject should be recognizable through the outlined simplified shapes even before coloring. Make it look like an actual color-by-numbers activity page from a coloring book, either fresh and uncolored or partially completed with some sections filled in."},{name:"COMEDY CLASSIC",category:["HUMOR","MOVIES","SCENE","COMEDY"],message:`Take a picture of the subject and place them into a scene from a cult comedy film, such as *Ghostbusters*, *Animal House*, *Caddyshack*, *Some Like it Hot*, *Blazing Saddles*, *Annie Hall*, *Planes, Trains and Automobiles*, *The Hangover*, *Coming to America*, *Beverly Hills Cop*, *Trading Places*, *A Fish Called Wanda*, *Big Lebowski*, *Dazed and Confused*, or *Wayne's World*.

The subject should be integrated as the central focus, interacting with the environment and versions of the scene’s characters.

Props, costumes, and lighting should match the film style, making the scene look like a real movie still.

Optional flavor text from the master prompt can guide which gag or absurd twist is included (e.g., subject holding the proton pack upside-down, bowling in an exaggerated pose, or mimicking a famous line with a ridiculous expression).

The final image should be funny, cinematic, and instantly recognizable as a cult comedy film, with the subject as the star.`},{name:"COMIC BOOK COVER",category:["COMICS","ART","POP CULTURE"],message:`Take a picture and transform the subject into the star of a comic book cover in the style of either Marvel or DC.

Design a full comic book cover layout including:
• Title logo
• Issue number
• Month and year
• Price (e.g., $1.25, 75¢, $3.99)
• Publisher seals, barcodes, or approval stamps

The subject should appear as a superhero or central character within a dramatic comic scene. Style can be classic or modern depending on external master prompt.

If external master prompt text specifies a franchise or hero (Spider-Man, Batman, Wonder Woman, Avengers, Justice League, etc.), base the cover on that property.

The final image must look like a real printed comic book cover.`},{name:"COMIC SUPERHERO",category:["COMICS","SUPERHERO","ACTION"],message:"Take a picture and transform the subject into a superhero inspired by their own traits, personality, or clothing. Preserve the subject’s recognizable facial features and body while designing a unique superhero identity based on what they are wearing or their notable characteristics. The superhero must wear a flowing cape integrated naturally into the costume. Show a full comic-book page with multiple panels depicting the subject in action, using powers or skills derived from their personal traits. Bold inks, vibrant colors, dynamic composition, and expressive onomatopoeia. Ensure the subject remains clearly identifiable while fully integrated into the comic-book superhero narrative."},{name:"COMPANY BADGE",category:["OFFICE","HUMOR","DOCUMENT","PHOTO EFFECT","MASTER PROMPT"],message:`Take a picture and transform the subject into an authentic corporate employee ID badge.

The final image must show the **entire badge fully visible** within the frame, oriented vertically or horizontally like a real workplace ID. Include realistic badge proportions, rounded corners, clip hole or lanyard slot, and slight plastic glare or lamination texture. The badge should appear photographed or scanned flat, not floating in space.

Place the subject’s photo in a standard ID photo area. The portrait should look like a real badge photo: neutral lighting, centered framing, simple background, and mild compression or sharpening typical of office badges.

Include the following badge details, all rendered clearly and legibly:
• **Employee Name:** Generate a humorous but plausible name based on the subject’s appearance, expression, or clothing (unless overridden by external master prompt).
• **Job Title:** Create a funny or exaggerated job title inspired by the subject’s visible traits or environment (e.g., "Senior Snack Analyst," "Head of Vibes," "Chief Button Presser").
• **Employee ID Number:** Use a fictional numeric or alphanumeric code.
• **Department:** Optional, humorous department name derived from context.

Include a **company name and logo**:
• If a real company logo or branding is visible in the image, adapt the logo.
• If a company name or logo is provided via external master prompt, use that name and create a believable logo mark to match.

Add small realistic badge elements such as barcodes, QR codes, issue dates, expiration dates, or security stripes. Text should look official but contain subtle humor when read closely.

Ensure the badge feels professionally designed yet gently ridiculous. Avoid overt meme styling. The final image should feel like a real corporate badge that someone accidentally made funny, and it must be clearly readable on a small screen.`},{name:"CONNECT THE DOTS",category:["PUZZLE","ACTIVITY","LINE ART"],message:`Take a picture and transform it into a classic printable connect-the-dots puzzle. Reduce the image to a clean line-art outline that captures the essential shape and silhouette of the subject while removing unnecessary detail.

Place numbered dots along the outline and key interior contours in a **logical sequential order starting with number 1**, so that connecting the dots in order will clearly reveal the subject. Dots should be large, evenly spaced, and easy to follow.

Show very minimal lines or connecting guides—only enough to hint at the outline if necessary, but primarily rely on the numbered dots. Avoid background details, shading, or other guides. Use high-contrast dots suitable for printing. Do not include text, instructions, or labels. The final image should resemble a traditional connect-the-dots puzzle where the user draws all connecting lines by hand, always beginning with dot 1.`},{name:"CONSCIENCE",category:["HUMOR","FANTASY","CHARACTER"],message:`Take a picture and create a scene with THREE versions of the subject:

1. One normal-sized subject in the center
2. One miniature angel version of the subject sitting or hovering on one shoulder
3. One miniature devil version of the subject on the opposite shoulder

The mini angel should appear kind, glowing, and persuasive. The mini devil should appear mischievous or sinister, whispering temptation.

The main subject’s expression should reveal the choice:
• EVIL choice: sly grin, raised eyebrow, mischievous expression
• GOOD choice: dopey happiness, innocent smile, relaxed posture

The miniature versions must look like the same person, not generic characters.

Lighting and composition should clearly frame all three figures.`},{name:"CONSPIRACY WALL",category:["HUMOR","MYSTERY","DOCUMENT","ABSURD"],message:`Take a picture and transform the subject into the center of a chaotic conspiracy investigation wall.

Place the subject’s photo (or multiple cropped versions of them) pinned to a corkboard, surrounded by printed photos, scribbled notes, newspaper clippings, diagrams, and red string connecting everything.

The conspiracy theme should be automatically invented based on the subject’s appearance, environment, or actions — OR be influenced by external master prompt text if provided (for example: "pizza", "aliens", "taxes", "office drama", "time travel", etc.).

Use absurd, humorous conspiracy logic. Examples:
• 'Always near the coffee machine'
• 'Was present every time the printer jammed'
• 'Knows too much about Tuesdays'
• 'Connected to the dog somehow'

Do not include readable real-world sensitive data. All notes should be fictional, funny, and harmless.

Include red string connecting photos, arrows, circles, and question marks drawn in marker. The board should feel cluttered, frantic, and obsessed.

Ensure the entire corkboard is fully visible in the frame. The final image should look like a deranged investigator has been tracking the subject for years.`},{name:"CONSTELLATION",category:["SPACE","STARS","NIGHT SKY"],message:"Take a picture and transform the subject into a living constellation in the night sky. Reimagine the subject’s silhouette, facial features, and pose as a pattern of glowing stars connected by faint celestial lines, while keeping their identity recognizable. Surround the subject with a deep, cosmic backdrop filled with nebulae, subtle stardust, and distant galaxies. Use soft glows, luminous highlights, and gentle gradients to create a magical, astronomical aesthetic. The subject should appear formed entirely from stars and light, as if they are part of the universe itself, rendered with crisp detail and awe-inspiring atmosphere."},{name:"CONSTRUCTIVISM",category:["ART","DESIGN","SOVIET","GEOMETRIC"],message:"Take a picture and transform the image into Constructivism style art. Bold geometry, diagonal compositions, limited color palettes, and graphic poster-like structure."},{name:"COOKIE",category:["FOOD","TRANSFORMATION","BAKING","SWEET"],message:"Take a picture and transform the subject into a cookie constructed entirely from edible materials on a cookie sheet. The subject's face, body, and all features must be built using only cookie dough, frosting, fondant, sprinkles, sugar crystals, chocolate chips, candy pieces, and other edible decorating elements. DO NOT print or place a picture on a cookie - instead, BUILD the subject's likeness FROM edible ingredients. Use cookie dough as the base shaped into the subject's outline and form. Create facial features using: royal icing piped for details and outlines, fondant rolled and shaped for dimensional features, colored sugar for shading and texture, chocolate chips or candies for eyes, sprinkles arranged to suggest hair texture or clothing patterns, edible food coloring to tint different areas. Show realistic cookie decorating techniques - piped frosting lines and borders, fondant cutouts layered on, dragée pearls for accents, edible glitter or luster dust for highlights. The cookie should be golden-brown baked dough as the foundation with all decorative elements applied on top. Include cookie baking details: slightly puffed edges, golden-brown color, subtle surface cracks. Place on aluminum cookie sheet with parchment paper, surrounded by decorating tools - piping bags, fondant tools, bowls of sprinkles, food coloring bottles. Use warm kitchen lighting. The subject should be recognizable through the strategic arrangement and color of edible decorating materials - like an elaborately decorated sugar cookie using professional cake decorating techniques. Make it look like a photograph of an actual decorated cookie where everything visible is 100% edible ingredients artfully arranged."},{name:"COPY MACHINE COPY",category:["OFFICE","RETRO","HUMOR","DEGRADED"],message:`Take a picture and transform it into an authentic photocopier copy made by pressing the subject directly against the copier glass.

The final image must resemble a single sheet of copier paper viewed flat and fully visible within the frame, including paper edges and margins. Do not crop the page.

The subject should appear distorted from being pressed against the glass: flattened features, slightly squashed face or objects, widened nose, compressed cheeks, stretched hands or fingers, and uneven contact areas. The distortion should feel physical and silly, not warped digitally.

Apply classic photocopier artifacts: harsh black-and-white or muddy grayscale tones, blown highlights, crushed shadows, toner speckling, faint streaks, edge shadows from the copier lid, uneven exposure, and slight skew or rotation. Include faint dust marks or smudges typical of a well-used office copier.

Lighting should feel internal to the copier — flat, overexposed, and directionless — not like studio lighting. The background should be blank or show subtle shadows from the copier lid.

Optionally include a small copier interface imprint or margin text such as page numbers, contrast indicators, or misaligned registration marks, rendered faintly and partially cut off.

If external master prompt text is provided, use it to influence the subject’s pose (e.g., face, hands, object pressed to glass) or tone of humor. The result should feel unmistakably like a dumb, impulsive office photocopy — absurd, tactile, and clearly readable on a small screen.`},{name:"COURTROOM SKETCH",category:["HUMOR","DOCUMENT","SKETCH","CRIME"],message:`Take a picture and transform the subject into a courtroom sketch drawn by a courtroom artist.

Render the subject in a loose, expressive pencil or charcoal style on off-white paper, with exaggerated but recognizable facial features, messy line work, and rough shading. The drawing should look like it was made quickly while observing the subject live in court.

Place the subject seated at a courtroom table or in the witness stand, with simplified figures of a judge, lawyers, or jury in the background.

Add subtle emotion based on the subject’s expression or posture — nervous, confused, smug, bored, or guilty — even if they are innocent.

Include a small caption area or handwritten label such as "The Defendant" or "Key Witness" (do not include real names unless provided via master prompt).

The entire sketch page should be fully visible within the frame, including paper edges. The final image should feel like a real courtroom artist drawing from a televised trial.`},{name:"CRAYON DRAWING",category:["ART","ILLUSTRATION","RETRO","TRANSFORMATION"],message:`Take a picture of the subject and transform the entire image into a crayon drawing on paper.

The subject and background must appear hand-drawn using wax crayons, with visible crayon strokes, uneven pressure, overlapping colors, and rough textures.

Paper texture must be visible, including tooth, fibers, and slight wrinkles or smudges.

Lines should be imperfect and childlike or naive in style, not digital or clean.

DO NOT leave any photorealistic elements or apply a crayon filter.

The final image must look like a real crayon drawing made on paper.`},{name:"CROP CIRCLE",category:["ALIEN","MYSTERY","AERIAL","PATTERN"],message:"Take a picture and transform the subject into an elaborate crop circle design viewed from directly above. The subject's face, body, and features must be created ENTIRELY FROM the contrast between flattened crops and standing crops - NOT a picture placed on a field. Use only flattened grain (darker, pressed-down wheat laid in swirled patterns) and standing grain (lighter, upright golden wheat) to build the image. The subject's portrait should be constructed like pointillism or halftone printing - areas of flattened crops create darker tones and shadows, areas of standing crops create lighter tones and highlights, and the pattern of which sections are flattened versus standing forms their recognizable likeness. The portrait should be recognizable from aerial view using geometric patterns, circles, lines, and curves typical of crop circle formations. Include authentic crop circle characteristics: precisely flattened grain stalks laid in directional swirls (clockwise or counterclockwise), sharp edges between flattened and standing crops, multiple concentric circles, connecting pathways, sacred geometry elements. Show the massive scale - the crop circle should span hundreds of feet across the field. Use aerial photography perspective as if photographed from helicopter or drone, showing surrounding farmland, field boundaries, trees at edges, perhaps a road or farmhouse for scale reference. Include subtle details suggesting mysterious origin - perfectly geometric precision, overnight appearance. The lighting should be golden hour with long shadows emphasizing the depth and dimension of the flattened patterns, making the contrast between pressed-down and standing grain more dramatic. Add subtle alien/UFO mystique - maybe a distant light in sky or mysterious glow. Make it look like an actual aerial photograph of an unexplained crop circle formation where the subject's portrait is built entirely from the agricultural pattern of flattened versus standing crops in massive field art."},{name:"CUBAN ART STYLE",category:["ART","PAINTING","MODERN"],message:`Take a picture and transform it into a Cuban art style illustration inspired by Cuban Modernism and Afro-Cuban visual traditions. Use bold tropical colors, strong outlines, flattened perspective, and expressive shapes.

Incorporate cultural rhythms through movement, pattern, and color. The subject should feel integrated into a warm, vibrant Cuban environment, with subtle influences of Afro-Cuban symbolism, music, and everyday life.

The final image should feel expressive, soulful, colorful, and culturally rich rather than realistic or photographic.`},{name:"CUBISM",category:["ART","PAINTING","MODERN","GEOMETRIC"],message:"Take a picture in the style of Cubist Art. Break objects into geometric forms and reassemble them from multiple viewpoints simultaneously, challenging traditional perspective and depth to emphasize the two-dimensional canvas."},{name:"CYBERPUNK",category:["SCI FI","NEON","FUTURISTIC"],message:"Take a picture and transform the image into a cyberpunk scene. Neon lighting, futuristic city elements, holographic accents, and high-contrast color palette. Cinematic night lighting with tech-inspired details."},{name:"DADA",category:["ART","SURREAL","ABSURD"],message:"Take a picture and transform the image into a Dada-style collage. Combine cut-and-paste textures, absurd juxtapositions, and fragmented composition. Subject recognizable within surreal elements."},{name:"DAD DANCING",category:["HUMOR","DANCE","EMBARRASSING","FAMILY"],message:"Take a picture and transform the subject into peak 'dad dancing' at a family event. Show them doing exaggerated, awkward, out-of-rhythm dance moves with complete confidence - finger guns, lawnmower move, shopping cart, sprinkler, or other classic dad moves. They should be wearing typical dad attire - tucked-in polo shirt, khakis or cargo shorts, white New Balance sneakers, maybe a fanny pack. Place them at a wedding reception, school dance, or family party. Include mortified teenagers (presumably their kids) in the background covering their faces, other dads joining in enthusiastically, and normal dancers clearing space around the dad dance zone. The subject should have pure joy and zero self-awareness on their face. Add disco ball lighting, DJ booth, or party decorations. Capture that specific energy of dads who dance like nobody's watching despite everyone definitely watching. Make it look like a candid photo of maximum dad embarrassment caught mid-dance move."},{name:"DALÍ",category:["ART","SURREAL","ARTIST"],message:"Take a picture and transform it into a painting of a surreal scene inspired by Salvador Dalí. Preserve the subject’s photographic realism while introducing dreamlike distortions, warped perspectives, melting forms, or impossible juxtapositions. Lighting should feel dramatic and hyper-real. The final image should feel uncanny, symbolic, and visually unsettling while still rooted in the original photo."},{name:"DANCING WITH THE STARS",category:["HUMOR","TV","ENTERTAINMENT","POP CULTURE"],message:`Take a picture and transform the subject into a scene from a glamorous ballroom dance competition show inspired by 'Dancing with the Stars.'

Dress the subject in an over-the-top, flashy dance costume — sequins, rhinestones, dramatic colors, exaggerated styling — appropriate for professional ballroom dancing.

Pose the subject mid-dance in a way that clearly suggests they do NOT know how to dance: awkward posture, stiff limbs, off-balance stance, mistimed spin, or exaggerated confusion. The humor should come from the contrast between the elegant setting and the subject’s obvious lack of dance skill.

Place the subject on a polished ballroom stage with dramatic lighting, spotlight beams, glossy floors, and a cheering audience in the background. The environment should feel high-budget and televised.

Optionally include subtle show elements like judges’ tables, score paddles, or stage graphics — without copying logos.

If external master prompt text is provided, use it to influence the dance style, outfit theme, or tone (romantic, intense, chaotic, overly dramatic).

Ensure the full subject, costume, and stage are visible and clearly readable on a small screen. The final image should feel like a frozen TV broadcast moment — glamorous, ridiculous, and instantly funny.`},{name:"DATING PROFILE",category:["HUMOR","SOCIAL MEDIA","PROFILE","MASTER PROMPT"],message:"Take a picture and create a dating profile–style image of the subject. Present the subject as approachable, charismatic, and recognizable, integrated naturally into a clean and appealing profile-style layout. Generate humorous or charming flavor text and a short bio inspired by the subject’s appearance, clothing, accessories, and surroundings, incorporating any externally provided profile details naturally. Ensure all text is clearly readable within the image. Render the final result with flattering lighting, clear focus, photorealistic detail, and a lively, engaging composition."},{name:"DEEP THOUGHTS BY JACK HANDEY",category:["HUMOR","ABSURD"],message:`Take a picture and transform it into a minimalist, deadpan inspirational-style image inspired by 'Deep Thoughts by Jack Handey.' The subject should appear calm, neutral, or unintentionally serious, regardless of how absurd the final message is.

Select ONE original 'Deep Thoughts by Jack Handey' quote and present it as the affirmation text. The humor should come from the contrast between the sincere visual tone and the unexpectedly absurd or philosophical text.

Compose the image simply and cleanly: the subject centered or thoughtfully framed, with the quote displayed clearly beneath or overlaid in an understated font. Do not explain the joke. Do not exaggerate expressions. Let the humor remain dry and subtle.

Ensure the entire image and text are fully visible and easily readable on a small screen. The final result should feel like a serious inspirational poster that accidentally delivers an absurd, ironic truth.`},{name:"DESOMETRIC ART",category:["ART"],message:"Take a picture in the style of desometric art."},{name:"DÍA DE LOS MUERTOS — CATRINA / CATRÍN",category:["CULTURE","FESTIVAL","TRADITIONAL","MEXICO","TRANSFORMATION","PORTRAIT"],message:`Take a picture and transform the subject into a traditional Día de los Muertos figure.

GENDERED TRANSFORMATION RULE:
• If the subject presents as female, transform them into a CATRINA.
• If the subject presents as male, transform them into a CATRÍN.
• If multiple subjects are present, apply the appropriate transformation to each individually.

CATRINA (FEMALE) REQUIREMENTS:
• Elegant, flowing traditional dress inspired by Mexican folkloric fashion
• Rich colors such as crimson, marigold orange, turquoise, royal blue, purple, or emerald
• Lace, embroidery, ruffles, and decorative patterns
• Traditional sugar skull face makeup:
  – White skull base
  – Black eye sockets
  – Decorative floral, swirl, heart, and filigree patterns in vivid colors
• Floral headpiece featuring marigolds (cempasúchil), roses, or paper flowers
• Makeup must follow facial anatomy — not a flat skull mask

CATRÍN (MALE) REQUIREMENTS:
• Dapper formal attire:
  – Black or dark suit
  – White shirt
  – Vest or bow tie or cravat
• Wide-brimmed hat or top hat adorned with flowers, ribbons, or subtle ornamentation
• Traditional sugar skull face makeup:
  – White skull base
  – Dark eye sockets
  – Elegant decorative patterns (less floral, more geometric or ornamental)
• Facial structure must remain human beneath the skull paint — not a full skeleton head

MAKEUP & STYLE RULES (CRITICAL):
• The subject remains HUMAN — NOT a literal skeleton
• The skull appearance must come from face paint and makeup artistry
• Preserve the subject’s facial proportions, expressions, and bone structure
• Avoid horror styling — this is celebratory, elegant, and artistic

ENVIRONMENT & MOOD:
• Lighting should feel festive, warm, and cinematic
• Optional elements may include candles, papel picado, marigold petals, altars, or festive street settings
• If no environment is specified, retain the original scene and reinterpret it with Día de los Muertos atmosphere

COLOR & AESTHETIC:
• Vibrant, saturated colors
• High contrast makeup details
• Elegant, joyful, and reverent — NOT spooky or grotesque

FINAL RESULT:
The image should look like a professional Día de los Muertos portrait — culturally respectful, richly detailed, celebratory, and unmistakably Catrina or Catrín — while preserving the subject’s identity beneath the makeup.`},{name:"DICTIONARY",category:["TEXT","REFERENCE","DEFINITION"],message:"Take a picture and transform it into a dictionary-style entry. Include a small, clearly visible photograph of the subject placed beside or beneath the definition, similar to a modern illustrated dictionary. Allow externally provided language to define the entry name. Use a clean, minimal layout with strong typography. The photo should act as a visual reference for the word, reinforcing the definition."},{name:"DIGITAL CIRCUS",category:["CARTOON","ANIMATION","SURREAL","DARK HUMOR"],message:`Take a picture and transform the subject into a surreal digital cartoon world inspired by The Amazing Digital Circus.

STYLE & CHARACTER RULES:
• Bold outlines and exaggerated cartoon anatomy
• High-contrast colors and uncanny proportions
• Include bizarre, unsettling cartoon performers or mascots

SCENE & TONE:
• Chaotic, unsettling, and absurd
• Circus or digital void environments
• Bright colors contrasted with psychological tension

The final image should look like a fully composed Digital Circus–style hand-drawn illustration with the subject and additional characters integrated seamlessly into the world.`},{name:"DISNEY",category:["ANIMATION","CARTOON","CLASSIC","DISNEY"],message:`Take a picture in the style of a hand-drawn Disney character portrait from the golden age of animation. Smooth linework, expressive poses, elegant shapes, vibrant but flat colors, and classic animation charm.

The final image should look like a fully composed Disney hand-drawn illustration with the subject and additional characters integrated seamlessly into the world.`},{name:"DI-Y ME?",category:["HUMOR","DIY","FAIL"],message:`Take a picture of the subject surrounded by a DIY project that has clearly gone wrong.

Show crooked construction, mismatched materials, exposed screws, incorrect assembly, and scattered tools.

The subject should appear exhausted, confused, or deeply regretful.

The final image must look like a real home improvement disaster photo.`},{name:"DOLLAR BOB",category:["DOCUMENT","HUMOR","VINTAGE","PARODY","MASTER PROMPT"],message:`Take a picture and transform it into a parody paper currency bill with the subject’s face replacing the central portrait.

The final image must show the **entire bill fully visible** within the frame, flat and uncropped, with realistic proportions, borders, and margins of a classic U.S.-style dollar bill. Do not zoom in or cut off edges.

Render the subject’s face as an engraved-style portrait suitable for currency printing. Preserve recognizable facial structure and expression, but translate it into fine linework, cross-hatching, and stippling so it looks printed, not photographic. The portrait should feel integrated into the bill design, not pasted on.

Design the bill with traditional currency elements:
• Ornamental borders and scrollwork
• Decorative frames and rosettes
• Serial numbers (fictional)
• Treasury-style seals (parody, non-official)
• Micro-pattern textures and guilloché lines

Replace all real-world identifiers with humorous equivalents:
• Use a fictional denomination (e.g., "$1 DOLLAR BOB," "$3 DOLLAR BOB," "$100 DOLLAR BOB")
• Replace national mottos with absurd or playful phrases inspired by the subject’s traits or posture
• Include a humorous title beneath the portrait instead of a real name (e.g., "In Snacks We Trust," "Certified Snack Authority")

Color palette should resemble classic green-and-black currency ink on aged paper. Add subtle wear such as folds, creases, ink bleed, or slight yellowing for realism.

If external master prompt text is provided, use it to influence the denomination, slogan, title, or tone of the bill.

All text, seals, and symbols must be clearly fictional and parody-based. The final image should feel like a real banknote someone printed as a joke — detailed, tactile, nostalgic, and clearly readable on a small screen.`},{name:"DOUBLE EXPOSURE",category:["PHOTOGRAPHY","ARTISTIC","LAYERED"],message:"Take a picture and create a double-exposure composition.    Blend the subject with a secondary scene using transparent overlays. Clear silhouette, balanced negative space. Moody, artistic tone."},{name:"DOT MATRIX",category:["RETRO","PRINTING","TECH","80S","LOW QUALITY"],message:"Take a picture and transform it as if printed by a vintage dot matrix printer from the 1980s-90s. Convert the entire image into a pattern of small dots arranged in a grid, creating the subject through varying dot density - denser dots for darker areas, sparser dots for lighter areas. Use only black dots on white or continuous feed printer paper with the characteristic green and white horizontal stripes and perforated tear-off edges on both sides (tractor feed holes). Show authentic dot matrix printing artifacts: slight misalignment of dots, banding where print head passed, individual dot visibility, no smooth gradients only dithered dot patterns, jagged diagonal lines, pixelated curves. The dots should be clearly visible as individual impacts from the print head pins. Include printer paper details: continuous fan-fold paper, perforated edges with sprocket holes, slight yellowing, that distinctive matte printer paper texture. Add printing imperfections: ink smudging, lighter sections where ribbon was fading, slight horizontal line patterns from print head movement, occasional missing dots from dead pins. The image should have very low resolution appearance - approximately 72-180 DPI equivalent, with all details reduced to dot patterns. Show the paper curl slightly, maybe still attached to the printer or freshly torn from tractor feed. Use overhead lighting showing the paper texture and raised ink dots. Make it look like an actual photograph of a dot matrix printout from an old Epson or IBM printer with that characteristic low-fi 1980s computer printing aesthetic."},{name:"DRAG ME",category:["HUMOR","TRANSFORMATION","GLAMOUR"],message:`Take a picture and transform the subject into a fabulous, over-the-top drag queen persona.

Preserve the subject's recognizable facial structure and features while applying full drag transformation: dramatic contouring, bold eye makeup with exaggerated lashes and colorful eyeshadow, sculpted cheekbones, overdrawn lips with glossy or matte finish, and flawlessly blended foundation.

Add a show-stopping drag wig: big hair with volume, vibrant colors, styled with curls, waves, or dramatic height. The wig should be theatrical and attention-grabbing.

Dress the subject in glamorous drag attire: sequined gowns, feather boas, rhinestone-covered garments, platform heels, dramatic jewelry, or avant-garde fashion pieces. The outfit should be bold, confident, and unapologetically fabulous.

Pose and expression should exude confidence, sass, and star power - fierce, playful, or elegantly commanding.

Lighting should be stage-quality with a touch of theatrical glamour. Background can be a runway, stage, club setting, or dramatic backdrop with spotlights.

The final image must be photorealistic, celebrating drag artistry with respect, humor, and fabulous energy. Make it fierce, make it fun, make it unforgettable.`},{name:"DREAM LOGIC",category:["SURREAL","ABSTRACT","DREAMY"],message:"Take a picture and transform the image using dream logic. Disjointed scale, symbolic elements. Unreal but emotionally coherent."},{name:"DRIVERS LICENSE",category:["HUMOR","ID","DOCUMENT","MASTER PROMPT"],message:"Take a picture and create a realistic but clearly fictional driver’s license–style image featuring the subject’s photo. Randomly select a U.S. state and replicate the general visual layout, color scheme, typography style, and design motifs associated with that state’s driver license, while clearly presenting it as a non-functional, artistic replica. Use placeholder information, fictional identifiers, and decorative text rather than real personal data. Preserve the subject’s recognizable facial features and neutral ID-style expression. The final image should resemble a stylized prop or novelty card, not a real or usable identification document."},{name:"DUTCH GOLDEN AGE",category:["ART","PAINTING","CLASSIC","REALISTIC"],message:"Take a picture and transform the image into Dutch Golden Age painting. Realistic textures, warm tones, precise detail, dramatic lighting, and naturalistic surroundings."},{name:"DWARF",category:["FANTASY","CREATURE","RPG"],message:"Take a picture and transform the subject into a fantasy dwarf while preserving the subject’s recognizable facial features, expressions, and identity. Adjust proportions to reflect a classic dwarf physique—shorter stature, sturdy build—while maintaining realism. Adapt clothing and gear into a believable fantasy style such as armor, leather, or artisan attire inspired by the subject’s original outfit. Place the subject into a detailed fantasy environment like a mountain hall, forge, or underground city. Use cinematic lighting, rich textures, and realistic materials to ensure the subject feels fully integrated into the fantasy world."},{name:"DYSTOPIAN",category:["SCI FI","DARK","APOCALYPTIC"],message:"Take a picture in the style of a Dystopian future. Bleak atmosphere. Make it photorealistic."},{name:"ECCE MONO",category:["HUMOR","ART","RESTORATION","FAIL"],message:`Take a picture of the subject and transform them into a badly restored artwork, inspired by infamous art restoration failures like the Ecce Homo / Ecce Mono incident.

The subject IS the artwork that has been restored incorrectly — not a viewer and not a separate person.

RESTORATION FAILURE (CRITICAL):
• The subject’s facial features must be distorted, simplified, or clumsily repainted
• Eyes may be uneven, misshapen, or misplaced
• Nose and mouth may be smudged, blobby, or incorrectly proportioned
• Expression should appear unintentionally humorous or confused

MEDIUM & TEXTURE:
• Painted fresco, mural, or aged religious-style artwork
• Visible brush strokes, uneven repainting, smeared paint
• Cracked plaster or wall texture beneath paint
• Colors slightly muddy or mismatched, as if an amateur attempted the restoration

IDENTITY PRESERVATION:
• The subject must still be faintly recognizable despite the failed restoration
• Facial structure and general likeness should be present but poorly executed

COMPOSITION:
• Frame the image as a photograph of the restored artwork on a wall
• Optional plaque or wall label suggesting it was recently restored

FINAL RESULT:
The image should clearly look like a well-meaning but disastrous art restoration where the subject’s face became unintentionally funny, awkward, or infamous — as if the artwork went viral for all the wrong reasons.`},{name:"EDO LANDSCAPE",category:["ART","ASIAN","JAPANESE","LANDSCAPE"],message:"Take a picture and transform it in the style of Japanese Edo period landscape prints. Include the subject in the scene while using clean outlines, flat color areas, and traditional compositional elements such as mountains, rivers, or bridges. The final image should feel elegant, balanced, and illustrative."},{name:"ELECTRIC BOOGALOO",category:["DANCE","HIP-HOP","MOTION","CULTURE"],message:`Take a picture and transform the subject into a high-energy breakdancing scene inspired by classic street dance culture and 'Electric Boogaloo.'

CORE CONCEPT (CRITICAL):
• The subject must be actively breakdancing
• The movement must look skilled, intentional, and dynamic
• The image should capture a peak moment of motion

DANCE STYLE & MOVEMENT:
• Authentic breakdancing poses such as:
  – Toprock
  – Downrock
  – Freezes
  – Power moves (windmills, flares, spins)
• Body positioning must look physically correct and controlled
• No awkwardness or parody

SUBJECT PRESENCE:
• Confident posture and expressive body language
• Facial expression should show focus, intensity, or joy
• Clothing should reflect street or dance culture (loose, flexible, expressive)

ENVIRONMENT:
• Urban or performance-oriented setting
• May include:
  – Dance floor or stage
  – Street or subway environment
  – Audience circle or informal crowd
• Environment should enhance the sense of movement

CAMERA & COMPOSITION:
• Dynamic framing that emphasizes motion
• Slight motion blur may be used selectively
• Camera angle should feel close to the action

LIGHTING & COLOR:
• Bold, energetic lighting
• Strong contrast and vibrant tones
• No muted or flat presentation

TONE:
• Celebratory, energetic, and expressive
• Feels like a moment of dance culture history
• Never ironic or mocking

FINAL RESULT:
The final image must look like a powerful, authentic breakdancing moment — the subject fully immersed in skilled movement, captured at the height of energy and expression, with a strong sense of rhythm and physical mastery.`},{name:"ELEMENTAL SELF",category:["FANTASY","ELEMENTAL","MAGICAL"],message:"Take a picture of the subject and transform only the subject into a human embodiment of a natural element: fire, water, earth, wind, or lightning. The subject’s body, clothing, and aura should visually integrate the chosen element, flowing naturally with their pose and expression. For fire, incorporate flames, embers, and glowing heat; for water, use flowing currents, ripples, and reflective surfaces; for earth, integrate rocks, soil, foliage, or crystals; for wind, show swirling air currents, leaves, or flowing garments; for lightning, incorporate electric arcs, sparks, and glowing energy. Preserve the subject’s recognizable facial features, identity, and proportions. The background should remain completely normal and unaltered, making the elemental subject clearly stand out. Use dramatic lighting, dynamic motion, and atmospheric effects on the subject only, rendered in ultra-realistic detail with vivid colors, depth, and surreal impact."},{name:"EMBROIDERY",category:["ART","TEXTILE","CRAFTS"],message:"Take a picture and transform the image into embroidery art. Thread textures, stitched lines, fabric background."},{name:"EMOJI THIS",category:["EMOJI","MODERN","EXPRESSIVE"],message:`Take a picture and reinterpret the subject using expressive emoji language while preserving the photo’s composition, body posture, clothing, and context.

FACE REPLACEMENT RULE (NON-NEGOTIABLE):
• If the subject is human, the ENTIRE HUMAN HEAD must be removed
• Replace it with ONE emoji as a full physical head
• NO human facial features may remain visible (no eyes, mouth, nose, skin, or chin)
• The emoji must occupy the exact volume of a head, aligned to the neck
• The emoji is NOT an overlay, sticker, decal, or mask
• Treat the emoji as a solid 3D object attached to the body

Use the following SIX priority categories, selecting at most ONE emoji from each when applicable:

1) Face / Emotion:
😀 😄 😁 😊 😂 🤣 😆 🙂 😌 😲 😮 😯 😱 😢 😞 😔 😪 😠 😡 🤬 😤 😕 🤔 😵‍💫 🌀 🥰 😍 😘 ❤️

2) Animal:
🐶 🐱 🐰 🐭 🐹 🐻 🐼 🐨 🐯 🦊 🐸 🐵 🐔 🐦 🐤 🐢 🐍 🐠 🐟

3) Food & Drink:
🍕 🍔 🌭 🌮 🍣 🍩 🍪 🍰 🥐 🥞 ☕ 🍺 🍷 🧃 🥤 🍎 🍌 🍓

4) Objects / Tech:
📱 💻 🎧 📷 🕶️ ⌚ 🎮 📚 💼 🔑 🧸 🎁 🛒

5) Clothing / Accessories:
👕 👗 🧢 👒 👟 👠 👜 🎒 🧥 🧤 🕶️ 👓

6) Activity / Context:
🎵 🎸 🎨 🏀 ⚽ 🚲 🎮 🧘 🏖️ 🏕️ 🏙️ ✈️ 🎉

Preserve the original background and spatial layout.`},{name:"ENCYCLOPEDIA",category:["MASTER PROMPT","TEXT","REFERENCE","EDUCATIONAL"],message:"Take a picture and transform it into a fake encyclopedia entry. Include a clear photograph of the subject placed near the top or alongside the text as a reference image. Style the layout like a printed encyclopedia page with columns, captions, and figure labels. Use authoritative yet humorous flavor text describing the subject’s background, significance, or behavior. The photograph should feel like an official illustrative plate supporting the article."},{name:"ERA FILTER",category:["MASTER PROMPT","HISTORICAL","TIME TRAVEL","VINTAGE"],message:"Take a picture and transform the subject and scene to accurately reflect the era specified externally. Adapt clothing, hairstyle, accessories, environment, color palette, materials, technology, and overall visual language to match the chosen historical or cultural era. Preserve the subject’s recognizable facial features, proportions, and identity while blending them naturally into the era’s aesthetic. Ensure lighting, textures, and image quality reflect the photographic or artistic limitations typical of that time period. The final image should appear as if the subject genuinely existed and was photographed in that era, with no modern elements visible."},{name:"ESCHER",category:["ART","ILLUSION","IMPOSSIBLE","ARTIST"],message:"Take a picture and transform the image into an M.C. Escher-inspired impossible space. Non-Euclidean architecture."},{name:"ETCH A SKETCH",category:["TOY","RETRO","LINE ART"],message:`Take a picture and recreate the subject as a classic Etch A Sketch drawing displayed inside a realistic Etch A Sketch toy. The entire red Etch A Sketch frame should be visible, including the screen area and the two control knobs at the bottom, so it feels like a photographed physical toy rather than a digital effect.

Render the subject using continuous, thin, single-line strokes characteristic of Etch A Sketch drawings. Use simple outlines and minimal detail while preserving the subject’s recognizable shape and expression. The drawing should appear slightly imperfect, with subtle line wobble and overlaps consistent with manual knob control.

Ensure the background is the Etch A Sketch screen texture, and keep the overall composition clean and centered. Do not add text or extra graphics. The final image should feel nostalgic, tactile, and immediately recognizable on a small screen.`},{name:"EXAGGERATED TRAIT",category:["HUMOR","CARICATURE","TRANSFORMATION","MASTER PROMPT"],message:"Take a picture and transform the subject by exaggerating a single physical trait while preserving the subject’s recognizable identity and overall proportions. The exaggerated feature should be visually prominent but anatomically coherent, blending naturally with the subject’s face and body. Adapt lighting, shadows, and perspective so the transformation feels intentional rather than distorted. Integrate the subject seamlessly into the scene, maintaining realism or stylized realism depending on the chosen direction. Ensure the final result feels playful and striking."},{name:"EXPECTING?",category:["HUMOR","LIFE","TRANSFORMATION"],message:`Take a picture and transform the subject into a visibly pregnant person regardless of gender.

The subject should appear proud and glowing, with a round belly, maternity clothing, and gentle, warm lighting.

The tone should be lighthearted, wholesome, and humorous rather than medical.`},{name:"EXPRESSIONISM",category:["ART","PAINTING","EMOTIONAL"],message:"Take a picture in the Expressionism artistic movement emphasizing subjective emotions and inner experiences, often distorting reality to convey intense emotions and psychological states."},{name:"EXTREME SPORTS MOMENT",category:["SPORTS","ACTION","DRAMATIC"],message:"Take a picture and transform the subject into a randomly selected sporting competition, such as a professional team sport, individual athletic event, or outdoor extreme sport. Depict the subject performing the most dramatic, high-impact moment possible within that sport — for example, a powerful slam dunk, a full sprint at the finish line, a massive aerial maneuver, or a daring ascent up a mountain. Preserve the subject’s recognizable facial features, expression, and identity while adapting clothing, gear, and posture appropriate to the sport. Place the subject in an authentic, dynamic environment with motion, energy, and cinematic lighting so the action feels intense and exhilarating. The scene should capture a peak, frozen-in-time moment of athletic achievement with realistic scale, motion blur, and photorealistic detail."},{name:"EYE OF THE BEHOLDER",category:["TV","BLACK AND WHITE","CLASSIC","DRAMA"],message:`Take a picture and transform the subject into the visual style of the classic Twilight Zone episode 'Eye of the Beholder.'

CORE CONCEPT (CRITICAL):
• The world’s definition of 'normal' is grotesque and unsettling
• The subject’s recognizable identity must be preserved beneath the distortion

MULTI-SUBJECT LOGIC RULE (CRITICAL):
• If MULTIPLE subjects are present in the image:
  – ONE subject must appear genuinely normal and conventionally human
  – ALL OTHER subjects must appear as the intentionally grotesque 'normal' citizens of that world
  – The grotesque subjects must visually and emotionally treat the human-looking subject as the abnormal one

DISGUST & GAZE INVERSION (CRITICAL):
• Grotesque subjects must look at the human-looking subject with disgust, discomfort, or moral judgment
• Facial expressions may include sneers, recoiling mouths, narrowed eyes, or tense jawlines
• Body language may include leaning away, crossed arms, pointing, or looming over the human subject
• The human-looking subject should appear isolated, vulnerable, or confused — not dominant

SINGLE-SUBJECT RULE:
• If only ONE subject is present, that subject must be one of the grotesque 'normal' citizens of this world

FACIAL TRANSFORMATION (GROTESQUE SUBJECTS):
• Distorted facial symmetry
• Heavy prosthetic-like features
• Flattened or exaggerated nose, uneven cheeks, misshapen mouth
• Features should resemble layered latex appliances — not monsters, aliens, or fantasy creatures

FACIAL TREATMENT (TRULY NORMAL SUBJECT):
• Minimal or no distortion
• Clean, human proportions
• Subtle lighting emphasis to heighten contrast
• Must feel socially rejected within the scene

STYLE & MEDIUM:
• High-contrast black-and-white
• Film grain, soft focus, and period-accurate television texture
• No color

LIGHTING & CAMERA:
• Stark shadows and dramatic angles
• Clinical, institutional, or oppressive lighting
• Framing should reinforce alienation and power imbalance

TONE:
• Serious, unsettling, and restrained
• No humor, no parody

FINAL RESULT:
The final image must look like a real frame from a 1960s Twilight Zone episode. When multiple subjects are present, grotesque 'normal' citizens must stare upon a truly human-looking subject with visible disgust, as if the human were the deformed one. The scene should feel haunting, oppressive, and philosophically unsettling — unmistakably faithful to 'Eye of the Beholder.'`},{name:"FAIRYTALE PAGE",category:["BOOK","FANTASY","ILLUSTRATION"],message:"Take a picture and make it into a page from a magical children fairytale book. Like a page pulled from a magical tale, a whimsical world of castles, forests, and enchanted creatures. Soft textures, rich colors, and fairytale-like details giving the image a dreamy, otherworldly feel.  The result should be a full view of the page with a relevant background behind the page."},{name:"FAIRYTALE MORAL",category:["BOOK","FABLE","LESSON"],message:"Take a picture and transform it into an illustrated fairytale moral or fable lesson. Depict the subject as the central figure in a symbolic, storybook-style scene. Generate a short moral or lesson written beneath or beside the illustration using flavor text inspired by the subject’s appearance, actions, or surroundings, incorporating any externally provided details naturally. The moral should read like a classic fable conclusion. Ensure all text is clearly visible. The overall tone should feel whimsical, wise, and timeless.  The result should be a full view of the illustration with a relevant background behind the illustration."},{name:"FAMILY GUY",category:["ANIMATION","CARTOON","TV"],message:`Take a picture in the style of a Family Guy cartoon scene, with simple shapes, clean lines, bold colors, and exaggerated features. Preserve the subject’s recognizable facial identity in the Family Guy style.

The subject must be the main character, but include other Family Guy characters in the scene interacting naturally — they can be Griffin family members, neighbors, or recurring secondary characters.

Backgrounds should reflect typical Family Guy settings: living room, Quahog streets, Drunken Clam, or other show locations. Ensure proper perspective and consistency with the show’s signature look.

The final image should look like a fully integrated Family Guy world with the subject seamlessly placed among other characters, maintaining the show’s humor, proportions, and visual style.`},{name:"FALLOUT",category:["GAME","POSTAPOC","RETRO"],message:`Take a picture and place the subject directly into the Fallout video game world.

Transform the subject into either a Vault Dweller OR a Ghoul using the following logic:

SELECTION RULE (CRITICAL):
• Randomly choose Vault Dweller or Ghoul with equal probability (50% Vault Dweller / 50% Ghoul)
• This selection MUST occur before evaluating the subject’s appearance
• Do NOT bias toward Ghoul for visual interest, detail, or drama
• Vault Dweller is NOT a fallback option

If Vault Dweller:
• Dress the subject in a bright blue-and-yellow Vault-Tec jumpsuit with a visible vault number
• Equip a Pip-Boy with a glowing green monochrome screen
• Clean, stylized, retro-futuristic Fallout aesthetic

If Ghoul:
• Severe radiation damage with leathery, cracked skin
• Collapsed nasal cartilage — the nose must be partially or completely missing, leaving a visible hole
• Exposed teeth, sunken eyes, asymmetrical facial damage
• Clothing is scavenged, pre-war, and deteriorated
• Subject must remain recognizable despite damage

ENVIRONMENT & ART DIRECTION (CRITICAL):
• Must visually match Fallout game art — not generic post-apocalypse
• 1950s retro-futurism, satirical Americana, Vault-Tec propaganda
• Nuka-Cola branding, radiation barrels, Pip-Boy tech, weathered signage
• Color grading: greenish tint, high contrast, slight comic-book realism
• Lighting should feel stylized, not cinematic

The final image must be immediately recognizable as Fallout — not just a ruined world.`},{name:"FAMILY CREST",category:["HUMOR","HERALDRY","PORTRAIT"],message:`Take a picture of the subject and turn them into the centerpiece of a grand family crest or coat of arms.

Place the subject’s face in the center of a shield surrounded by decorative symbols, banners, and icons that humorously represent their personality, habits, or interests.

The crest should include ornate scrollwork, ribbons, and classic heraldic styling.

Use external master prompt text, if provided, to influence the motto, symbols, or family name.

The final image should look like a serious, medieval-style coat of arms, but with silly or absurd details that make it funny.`},{name:"FAMILY HOLIDAY PHOTO",category:["RETRO","HUMOR","PHOTOGRAPHY","FAMILY"],message:`Take a picture and transform it into an awkward family holiday photo from the late 1980s or early 1990s.

Select a holiday automatically at random (e.g., Christmas, Thanksgiving, Easter, Halloween, Valentine’s Day, Fourth of July, New Year’s, or another widely recognized holiday), OR use a specific holiday provided via external master prompt.

The image should look like a staged holiday portrait taken with an on-camera flash: flat lighting, slight red-eye, soft focus, mild film grain, and dated color tones. The setting should feel like a living room or photo studio decorated for the chosen holiday.

Include classic, slightly tacky holiday decorations appropriate to the selected holiday. Decorations should feel excessive, mismatched, or unevenly arranged (e.g., too many balloons, awkward banners, cheap props, cluttered tables, or off-theme color combinations).

Dress all subjects in era-appropriate holiday clothing that clashes or feels uncomfortable. Examples include ugly sweaters, oversized cardigans, patterned vests, turtlenecks, stiff dresses, themed novelty outfits, or poorly coordinated formalwear. Hairstyles should be dated and awkward: big teased hair, perms, mullets, bowl cuts, feathered bangs, or obvious hairspray volume.

Subject logic:
• If there is ONE subject, surround them with added family members (parents, siblings, or relatives) who look mismatched or emotionally disconnected.
• If there are MULTIPLE subjects, present them as a family group standing or sitting closely together.

Body language should feel tense or unnatural: forced smiles, blank stares, crossed arms, stiff posture, uneven spacing, or someone clearly looking away from the camera. Not everyone should appear happy at the same time.

Optionally include a dated holiday banner, sign, or photo caption naming the holiday and year (use external master prompt text if provided; otherwise invent a plausible holiday label and year).

Ensure the entire photo is fully visible within the frame, like a complete printed holiday portrait. The final image should feel uncomfortably nostalgic, unintentionally funny, and instantly recognizable as an awkward family holiday photo — clearly readable on a small screen.`},{name:"FATE BOOK",category:["FANTASY","MYSTICAL","PROPHECY"],message:"Take a picture and transform it into a dramatic illustrated page from an ancient Book of Fate or Destiny. Present the subject as the central figure of a foretold prophecy, depicted in a mythic or symbolic scene that reflects their appearance, posture, and personality. Surround the subject with aged parchment textures, arcane symbols, constellations, or subtle mystical motifs. Generate a short prophecy-style passage written in poetic language inspired by the subject’s visual traits and surroundings, incorporating any externally provided details naturally. Ensure the entire prophecy text is fully visible and integrated into the page design. The final image should resemble a sacred manuscript or legendary tome, with cinematic lighting, rich detail, and an epic, timeless atmosphere.  The result should be a full view of the page with a relevant background behind the page."},{name:"FAUVISM",category:["ART","PAINTING","COLORFUL"],message:"Take a picture and transform the image into Fauvist style painting. Intense, vivid colors, simplified forms, and expressive brushwork while keeping the subject identifiable."},{name:"FAX MACHINE COPY",category:["RETRO","OFFICE","DEGRADED","HUMOR","MASTER PROMPT"],message:`Take a picture and transform it into an authentic single-page fax machine transmission from the 1980s–1990s.

The final image must look like a full sheet of faxed paper viewed flat and fully visible within the frame, including margins, header, and body. Do not crop the page.

Apply classic fax artifacts: harsh black-and-white contrast, dithering, streaking scan lines, slight skew, uneven toner density, paper curl shadows, compression noise, and faint horizontal banding. The subject should appear embedded within the faxed image area and degraded but still identifiable.

At the top of the page, include a standard fax cover header with the following sections, all rendered in simple monospace or office-style fonts and visibly degraded:

• **From (Sender):** A humorous sender name, company, fax number, and phone number inspired by the subject’s appearance, clothing, posture, or environment (e.g., "Gary from Accounting," "Dept. of Snacks," "Fax: 555-0199").
• **To (Recipient):** A humorous recipient name, organization, and fax number, derived from scene context or absurd office logic.
• **Date:** A plausible transmission date (can be generic or stylized).
• **Subject / Re:** A short, funny description of the fax contents based on the subject or scene (e.g., "Urgent: Hat Situation," "Re: Chair Malfunction Update").
• **Pages:** Include a page count such as "1 of 1".

Below the header, include a **Confidentiality Notice** in small text, written humorously but styled like a real legal disclaimer (e.g., warning unintended recipients to destroy the fax immediately or consult a supervisor named something absurd).

All names, numbers, and text must be fictional, non-sensitive, and clearly comedic. If external master prompt text is provided, use it to override or guide sender, recipient, subject line, or tone.

Ensure the overall result unmistakably resembles a real faxed document rather than a modern filter. The page should feel outdated, bureaucratic, slightly ridiculous, and clearly readable on a small screen.`},{name:"FAZZINO POP ART",category:["ART","POP ART","LAYERED","3D","COLORFUL"],message:`Take a picture and transform it into a vibrant 3D layered pop art composition with multiple raised paper-cut levels creating extreme visual depth at miniature scale.

Style characteristics: Ultra-bright saturated colors with bold black outlines, flat color fills with minimal shading, playful exaggerated proportions and perspectives. The aesthetic should resemble colorful painted cardstock or screen-printed paper sheets stacked at different heights, rendered with realistic miniature scale and physical dimensionality.

Layering structure: Divide the scene into at least 5-7 distinct depth levels with strong cast shadows between each layer emphasizing the sculptural three-dimensional quality.

CRITICAL - PACK THE SCENE WITH MINIATURES: Fill every inch of the composition with abundant miniature elements densely arranged: tiny buildings with architectural details, miniature cars and vehicles, small-scale people figures, street signs, storefronts, windows, decorative patterns, architectural ornaments, repeating shapes, whimsical embellishments, busy textures, trees, street lamps, and countless playful visual elements. The scene should feel like a bustling miniature cityscape or metropolitan diorama with an overwhelming joyful abundance of tiny detailed objects all bunched together. No empty space - every area should be filled with miniature sculptural elements.

The diorama MUST be constructed exclusively from elements present in the actual photographed scenery OR the location explicitly specified in the master prompt.

DO NOT invent a different city, skyline, or landmarks.

If the subject is in Miami, the diorama must reflect Miami.
If Las Vegas, Las Vegas.
If no location is provided, use ONLY the visible environment from the original image.

All buildings, streets, signage, vehicles, and scenery must be derived from the real environment and reinterpreted in layered, sculptural form.

The subject MUST appear as a FULL miniature human figure within the diorama — even if only a torso, head, or partial body was visible in the original photo.

The subject should be scaled down appropriately and integrated into the environment like a physical figurine.

Use layered depth, bright colors, paper-cut textures, stacked elements, and playful perspective.

The final image must look like a physical 3D pop-art diorama constructed from the real location — not a generic city illustration.

CRITICAL - SUBJECT SCALE: Transform the subject into a three-dimensional miniature figure within this densely packed layered diorama at the EXACT SAME SMALL SCALE as all other miniature elements. The subject must be proportionally sized to match the tiny buildings, miniature cars, and small people figures surrounding them - NOT larger or more prominent. If buildings are 2-3 inches tall in the miniature scene, the subject figure should be appropriately scaled (roughly 1 inch or smaller if representing a person). The subject should appear as ONE SMALL ELEMENT among many in the busy cityscape, not dominating the composition. They must have physical depth and dimension like a detailed figurine, integrated naturally among all other miniatures at consistent scale.

The final result should look like a physical framed miniature diorama or shadow box photographed straight-on, showcasing vibrant metropolitan energy with extreme visual depth, realistic three-dimensional construction, CONSISTENT miniature scale throughout with the subject properly sized to match all surrounding elements, overwhelming joyful abundance of densely packed tiny details, and clear dimensional separation between layers. Everything - including the subject - should appear as real miniature sculptural objects at the same small scale, bunched together in a busy, celebratory cityscape.`},{name:"FELT PUPPET",category:["TOY","PUPPET","CRAFTS"],message:"Take a picture and transform the image into a felt puppet scene. Soft fabric textures, handcrafted appearance."},{name:"FESTIVE-ALL!",category:["FESTIVAL","WORLD","PARTICIPATION","CELEBRATION"],message:`Take a picture and transform the subject into a participant in a famous festival anywhere in the world. Randomly select from the following:

- La Tomatina (Spain): Tomato-slinging streets filled with participants.
- Holi (India): Color powders thrown across crowds.
- Songkran Festival (Thailand): People using water guns and hoses to splash each other.
- Battle of the Oranges (Italy): Teams throwing oranges at each other.
- Belize Carnival: Painting, water, eggs, and flour thrown during parades with music and dancing.
- Boryeong Mud Festival (South Korea): Mud slides, mud baths, and playful mud activities.

Ensure the subject is fully integrated into the scene, participating actively in the festival. Include environmental cues, textures (tomatoes, colored powder, water splashes, mud, oranges), and festival-specific props or costumes. Preserve realistic lighting, motion, and perspective, creating an immersive festival atmosphere.`},{name:"FEUDAL JAPAN",category:["HISTORICAL","ASIAN","SAMURAI"],message:"Take a picture and place the subject in feudal Japan as a samurai. Preserve facial identity and physique. Authentic armor, period setting, cinematic lighting."},{name:"FIELD GUIDE",category:["NATURE","REFERENCE","MASTER PROMPT","SCIENTIFIC"],message:"Take a picture and transform it into a field guide page. Include a clear photograph of the subject as the main reference image, labeled as a specimen photo. Add a species name (real or humorous), habitat, behavior notes, and identifying traits. Use the visual style of a naturalist’s guidebook. The photograph should appear as a documented observation supporting the entry."},{name:"FIFTH BEATLE",category:["MUSIC","60S","ROCK","ICONIC","BRITISH"],message:`Take a picture and insert the subject as the fifth member of The Beatles in one of their iconic photographs. Randomly select from these famous scenes:

ABBEY ROAD CROSSING: Place the subject walking in line with the four Beatles across the zebra crossing on Abbey Road. The subject should be dressed in period-appropriate 1969 clothing (suit, casual wear, or barefoot like one member). Match the walking stride and positioning. Background shows the tree-lined London street.

COLORFUL MILITARY COSTUMES: Place the subject alongside the band wearing vibrant, elaborate military-inspired costume from 1967. Include ornate jacket with decorative elements, bright colors (pink, yellow, orange, blue), psychedelic era styling. Subject should be posed with the group in formal portrait arrangement.

BEACH SCENE: Insert the subject playing in the ocean waves with the band at a beach. Everyone should be in 1964 swimwear or casual beach clothes, splashing in water, showing youthful energy and joy. Bright sunny beach setting.

EARLY CLUB PERFORMANCE: Place the subject on stage with the band in a small underground club setting. Everyone wearing matching suits with narrow ties, distinctive 1960s hairstyles (mop-top or similar period style). Instruments visible, intimate venue with brick walls and low ceiling. Black and white or slightly muted color photography.

AIRPORT ARRIVAL: Insert the subject descending airplane stairs or in terminal with the band, surrounded by crowds of fans and press photographers. Everyone wearing sharp matching suits, waving to camera. 1960s airport setting with vintage aircraft visible. Capture the excitement and chaos of fan mania.

For all scenarios:
- Transform subject's appearance to match 1960s styling: period-appropriate haircut, clothing, and grooming
- Match the photographic quality of the era: film grain, color processing, or black and white aesthetic specific to that time period
- Preserve subject's recognizable facial features while adapting them to 1960s style
- Integrate subject naturally as if they were always part of the group
- Capture the specific mood and energy of that particular photograph
- Use authentic 1960s photography techniques, lighting, and composition

The final image should look like an actual vintage photograph from the 1960s with the subject seamlessly integrated as a genuine fifth member of the band, matching the iconic style and feeling of the original scene.`},{name:"FIGHT CLUB",category:["HUMOR","INJURY","ACTION","TOUGH"],message:`Take a picture and transform the subject to look like they've just been in a serious physical fight, with realistic battle damage and injuries.

Add visible injuries: a swollen black eye with dark purple bruising, a bloody nose with blood dripping or smeared on face, swollen or split lip, cuts and scrapes on face, reddened areas from impacts.

Clothing should be disheveled, torn, or stained with blood spots. Hair should be messy and out of place from the struggle.

The subject's expression should show exhaustion, defiance, toughness, or the aftermath of adrenaline - perhaps breathing heavily, grimacing, or showing a tough determined look despite the damage.

Optional context: Background could suggest where the fight occurred (alley, gym, street, parking lot), possibly with other visual clues of the altercation.

Keep all injuries photorealistic as if this is an actual photograph taken immediately after a fight. The damage should look fresh and recent with appropriate coloring for bruises (dark purple, red, swelling) and blood (realistic red, properly placed).

Preserve the subject's recognizable facial features while adding realistic fight injuries and tough, battle-worn appearance. The mood can be serious or darkly humorous depending on the subject's expression.`},{name:"FILM NOIR",category:["MOVIES","BLACK AND WHITE","VINTAGE","DRAMATIC"],message:"Take a picture and transform the image into classic film noir style. High-contrast black and white. Hard directional lighting, deep shadows, Venetian blind light patterns. Moody, dramatic composition."},{name:"FILTH MODE",category:["HUMOR","DIRTY","GROSS"],message:`Take a picture and identify the main subject or object. Transform it so it appears dirty, neglected, or gross while preserving its shape and identity.

Add realistic grime such as dirt, mud, stains, splashes, smears, or dried mess. If appropriate, include cartoonishly unpleasant elements like poop, sludge, or foul residue applied to the object’s surface without obscuring it completely.

Ensure the filth follows the object’s contours, texture, and lighting so it looks physically present rather than overlaid. The result should be visually obvious, humorous or shocking, and immediately readable on a small screen.`},{name:"FIND ME",category:["ILLUSION","HIDDEN","CAMOUFLAGE"],message:"Take a picture and transform the image so the subject is fully visible yet intentionally hidden through perfect visual camouflage. The subject’s clothing, colors, textures, and patterns must precisely match and continue the surrounding environment, making the subject difficult to distinguish at first glance. Do not remove or blur the subject — instead, conceal them through seamless pattern alignment, color continuity, and texture matching. The subject must remain physically present with accurate scale, lighting, shadows, and depth, so they clearly exist once noticed. Avoid outlines, highlights, or obvious separation; the concealment should feel deliberate, intelligent, and visually satisfying when discovered."},{name:"FORCED PERSPECTIVE",category:["ILLUSION","PHOTOGRAPHY","TRICK"],message:"Take a picture and place the subject into a scene that uses forced perspective to create a clever visual illusion. The subject should appear to interact with large or distant objects using scale tricks (for example: pinching the sun, holding the moon, pushing a skyscraper, balancing a mountain on their palm). Carefully align scale, depth, and camera angle so the illusion looks intentional and realistic. Preserve the subject’s identity and integrate lighting, shadows, and perspective so the interaction feels physically believable and visually playful."},{name:"FOREVER STAMP",category:["POSTAL","MINIATURE","VINTAGE"],message:"Take a picture and transform the subject into a large physical postage stamp. Show perforated edges, printed texture, ink dot patterns, and slight wear."},{name:"FRACTAL",category:["MATHEMATICAL","PATTERN","ABSTRACT"],message:"Take a picture and transform the image using fractal geometry. Recursive patterns, infinite detail."},{name:"FREAKSHOW POSTER",category:["HUMOR","VINTAGE","CIRCUS","POSTER"],message:`Take a picture of the subject and transform them into the star of a vintage freakshow poster from the late 1800s or early 1900s.

The subject should be presented as a dramatic, mysterious attraction with exaggerated features, theatrical posing, and bold stage lighting.

Design the image like an old carnival poster, with ornate borders, hand-painted lettering, and weathered paper texture.

Include a sensational headline and dramatic tagline describing the subject as a strange or amazing curiosity, using humorous or absurd flavor text.

The final image should look like an antique circus sideshow poster advertising the subject as a spectacular and unbelievable attraction.`},{name:"FREAKY FRIDAY",category:["HUMOR","SWAP","TRANSFORMATION"],message:`Take a picture and if the picture contains two or more clearly visible subjects, perform a realistic multi-subject head swap by exchanging their heads between bodies. Preserve body posture, clothing, lighting direction, skin tone consistency, and camera perspective. Maintain natural neck alignment and correct scale so each swapped head fits the new body believably.

If exactly one subject is detected, perform an inverse face transformation by subtly mirroring or inverting the subject’s facial features while preserving overall realism, expression, and identity. The result should feel intentionally uncanny but not distorted.

If no subjects are detected, return the original image unchanged. The final image should be visually coherent and readable on small screens.`},{name:"FRENCH CHEF DISASTER",category:["HUMOR","COOKING","TV","RETRO","PARODY"],message:"Take a picture and place the subject as the host of The French Chef cooking show in the style of Julia Child, but everything is going catastrophically wrong. Show them in a 1960s TV kitchen set with vintage appliances, wearing an apron, trying to maintain Julia Child's cheerful composure while absolute chaos unfolds. The kitchen should be a disaster - pots boiling over and spilling everywhere, food on fire with flames shooting up, whole chickens or ingredients flying through the air, wine bottles knocked over and spilling, utensils scattered everywhere, mixer spraying batter across the set. The subject should have that exaggerated Julia Child enthusiasm and dramatic hand gestures despite being covered in flour, sauce splattered across their face and apron, hair disheveled. Include vintage 1960s TV production elements: old cameras visible, grainy film quality, retro color palette, that characteristic public television aesthetic. Show the 'finished dish' they're supposed to create displayed beautifully on a card, contrasted with the smoking, collapsed, or unrecognizable disaster on their counter. Maybe they're holding up a charred mess while maintaining that bright TV smile and saying 'Bon Appétit!' Add vintage graphics, retro kitchen décor, and that wholesome 60s cooking show vibe completely undermined by culinary catastrophe. Make it look like a frame from a vintage cooking show where absolutely everything went wrong but the host keeps going with cheerful determination."},{name:"FRIDGE ART",category:["ART","HUMOR","NAIVE","CHILD LIKE"],message:`Take a picture and transform the subject into a child’s crayon drawing displayed on a refrigerator.

Render the subject as a deliberately crude crayon drawing with uneven proportions, simple shapes, wobbly outlines, and flat scribbled coloring. Facial features and limbs should be exaggerated or misaligned in a childlike way while still being loosely recognizable.

Use a plain white or lightly stained paper background with visible crayon texture and pressure marks. Add misspelled handwritten text such as a name, age, or caption written in childlike lettering.

Attach the drawing to a refrigerator using colorful magnets. Show part of the fridge surface, smudges, and nearby papers or photos.

Ensure the entire drawing and fridge context are fully visible. The final image should feel innocent, funny, and unmistakably like real fridge art made by a child.`},{name:"FROSTING CAKE ART",category:["FOOD","HUMOR","MASTER PROMPT"],message:`Take a picture and transform the subject into frosting-style artwork applied flat on the top of a cake. The subject should lie flush on the frosting surface — fully integrated — but the frosting itself should have realistic texture: piped swirls, slight ridges, creaminess, and subtle shadows so it clearly looks like real icing, not a topper.

Render the subject simply, preserving only the most recognizable facial features, posture, or silhouette. Avoid overly detailed or three-dimensional features; the design should be believable as hand-piped or painted frosting.

Include realistic cake decorations such as frosting borders, small swirls, sprinkles, or minor fondant accents. If no external message is provided via master prompt, automatically add playful flavor text based on the subject: e.g., 'Happy 1st Birthday!' if the subject appears young, or 'Happy Retirement!' if the subject appears older.

If an external message is provided, append it naturally using piping-style lettering around the subject. Ensure the full cake top and subject are fully visible in the frame. Use soft, realistic lighting and perspective so the subject and frosting appear tactile and integrated. The final image should feel festive, humorous, and clearly readable on small screens, while lying flat on the cake surface.`},{name:"FROZEN IN ICE",category:["COLD","ICE","PRESERVED"],message:"Take a picture and make it appear as if the subject is frozen inside a clear block of ice. The ice should have realistic cracks, bubbles, frost, and refraction. The subject must be clearly visible through the ice, distorted slightly by thickness and trapped depth."},{name:"FUN-FLATABLE",category:["FUN","INFLATABLE","HUMOR"],message:"Take a picture and transform the subject into an over-the-top inflatable mascot costume. Exaggerate proportions so the body is comically large and rounded, but keep the subject’s facial features visible on the inflated surface. Include whimsical folds, wrinkles, and inflated textures. Place the subject in a fun environment such as a stadium, street parade, or party. Ensure the entire inflatable is fully visible and clearly readable on a small screen, emphasizing absurd humor and playful energy."},{name:"FUNHOUSE MIRROR",category:["DISTORTION","OPTICAL","CARNIVAL","SURREAL"],message:`Take a picture and transform the subject as if reflected in a carnival funhouse mirror.

Randomly apply ONE of the following mirror distortions:
• Vertical concave (tall and pinched inward)
• Vertical convex (short and wide)
• Horizontal concave (squeezed side-to-side)
• Horizontal convex (stretched side-to-side)
• Concave-convex (pinched center with expanded ends)
• Convex-concave (expanded center with pinched ends)

The distortion must affect the ENTIRE subject and scene consistently, as true optical glass distortion — not digital warping.

Facial features, body proportions, and environment must bend smoothly and continuously according to the mirror curvature.

DO NOT crop the subject.
DO NOT break anatomy or introduce glitches.
DO NOT apply multiple distortions at once.

Lighting, reflections, and perspective must behave like reflective glass, with subtle highlights and edge reflections.

The final image must look like a real photograph taken of a funhouse mirror reflection.`},{name:"FUNKO POP",category:["TOY","COLLECTIBLE","POP CULTURE"],message:"Take a picture and turn the subject into a Funko Pop. Oversized head, simplified body."},{name:"FUTURAMA",category:["CARTOON","SCI FI","RETRO","POP CULTURE"],message:`Take a picture and transform the subject into an animated character placed directly inside a Futurama-style scene alongside recognizable characters from the show.

Render the subject in the same visual style as Futurama characters: clean bold outlines, flat cel shading, simplified geometric facial features, exaggerated eyes, smooth rounded head shapes, and bright saturated colors. Preserve the subject’s recognizability while fully adapting them into the cartoon style.

Place the subject INTO an iconic Futurama environment and scene, selected based on context or randomly, such as:
• inside the Planet Express building or conference room
• standing with Fry, Leela, and Bender in the Planet Express crew lineup
• walking through New New York with futuristic buildings and flying cars
• inside MomCorp, the Head Museum, or a sci-fi lab
• in a space scene with Futurama characters reacting to the subject

Existing Futurama characters may appear in the scene as supporting characters, background figures, or interaction partners, drawn accurately in their recognizable cartoon style. The subject should feel like a guest character naturally written into an episode, not pasted on top.

Adapt the subject’s clothing into Futurama-appropriate outfits — delivery uniforms, sci-fi jumpsuits, futuristic casual wear, or humorous future attire inspired by their real clothing.

Use simple painted backgrounds, clean animation lighting, and minimal texture consistent with hand-drawn cel animation. Avoid realistic shading or painterly effects.

Ensure the full scene is visible and readable on a small screen, with the subject clearly identifiable among the Futurama characters. The final image should feel like a freeze-frame from an actual Futurama episode where the subject unexpectedly appears.`},{name:"FUTURE SELF",category:["AGE","TRANSFORMATION","OLD"],message:"Take a picture and depict the subject 20-40 years in the future. Preserve facial structure with realistic aging."},{name:"GAMEBOY",category:["RETRO","GAMING","90S","PIXEL"],message:"Take a picture and transform the subject into an authentic early-1990s monochrome handheld console display using a classic green dot-matrix screen aesthetic. Render the entire image as if it is displayed on a low-resolution reflective LCD with a pea-green color palette, dark olive shadows, and pale green highlights. Convert the subject into true dot-matrix pixel art using a visible grid of circular pixels, limited tonal steps, and strong contrast. Preserve the subject’s recognizable facial features and silhouette while adapting them to the constraints of a handheld screen resolution. Simulate real screen characteristics including pixel ghosting, motion blur trails, uneven refresh, slight vertical smearing, faint scan artifacts, and subtle screen noise. Avoid smooth gradients—everything should appear quantized and grid-based. Frame the image strictly as the handheld screen view itself, with a thin dark border suggesting the screen edge. Do not include logos, branding, or copyrighted UI elements. Optional minimal pixel indicators (numbers or icons only) may appear at the edges of the screen. Optimize for small screens with bold shapes, clear separation, and immediate readability. The final image should feel indistinguishable from a real dot-matrix handheld screen captured mid-use—nostalgic, tactile, and unmistakably retro."},{name:"GARDEN GNOME",category:["HUMOR","TOY"],message:"Take a picture and transform the subject into a classic, life-sized garden gnome. Preserve facial recognition while giving the subject gnome features such as a pointed hat, whimsical clothing, and small props (e.g., shovel, lantern, mushroom). Place the gnome in a backyard or garden environment. Ensure the full gnome is visible, standing naturally, and clearly readable on a small screen. The final image should feel humorous, whimsical, and integrated into the scene."},{name:"GENDER INVERSION",category:["HUMOR","TRANSFORMATION","GENDER","SWAP"],message:"Take a picture and transform the subject into the opposite gender while preserving the subject’s core facial structure, expressions, and identity. Adjust facial features, body shape, hair, and secondary characteristics in a realistic and anatomically plausible way. Adapt clothing and styling to suit the transformed gender presentation while maintaining the subject’s original personality and essence. Ensure the subject appears naturally integrated into the scene, with consistent lighting, proportions, and photorealistic realism."},{name:"GHIBLI CAM",category:["ANIMATION","ANIME","JAPANESE"],message:"Take a picture in the Studio Ghibli anime style-soft colors, whimsical atmosphere, and hand-drawn aesthetic."},{name:"GIANT MONSTER",category:["HUMOR","SCI FI","KAIJU"],message:"Take a picture and transform the subject into a giant Kaiju-style monster attacking a city. The subject should tower over buildings at massive scale (100+ feet tall), with their recognizable features enlarged and made monstrous. Place them in an urban environment with skyscrapers, fleeing crowds, emergency vehicles, and destruction. Add cinematic disaster movie atmosphere with dramatic lighting, dust clouds, debris, and chaos. Include details like the monster's massive footprints crushing cars, toppling buildings, and helicopters circling. Make it look like a scene from a classic monster movie with photorealistic destruction and scale."},{name:"GIANT WORLD",category:["SIZE","GIANT","SCALE"],message:"Take a picture and transform the subject into a giant towering over the environment. Realistic scale interaction."},{name:"GLASS",category:["MATERIAL","TRANSPARENT","SCULPTURE"],message:"Take a picture and transform everything into transparent glass. Refraction, reflections, caustic lighting."},{name:"GLITCH REALITY",category:["DIGITAL","GLITCH","ERROR"],message:"Take a picture and introduce digital glitches into a realistic scene. Pixel tearing, compression artifacts. Reality appears corrupted."},{name:"GLOSSARY",category:["MASTER PROMPT","TEXT","REFERENCE","LABELED"],message:"Take a picture and create an image of a glossary identifying the main subject and a limited number of notable objects. Include the photograph prominently in the layout. Overlay clear letter markers (A, B, C, etc.) directly on or near each identified object in the image. Beneath the photo, create a glossary-style list where each entry begins with the matching letter and provides a brief description blending factual identification and light humor. Keep the layout simple and legible for a small screen. The photograph should clearly correspond to the labeled glossary entries."},{name:"GOO GOO GAA GAA",category:["HUMOR","TRANSFORMATION","BABY"],message:"Take a picture and place the subject's original face (completely unchanged) onto a baby's body. Keep the subject's exact face - same size, same features, same expression - but attach it to a realistic baby body (approximately 6-12 months old). DO NOT modify the face in any way - do not make it younger, smaller, or more baby-like. The face should remain identical to the original photo. Only the body changes to a baby body. The contrast between the unchanged face and baby body should be humorous and obvious. Show the baby-bodied subject in typical baby situations: crawling on the floor, sitting in a high chair making a mess with food, being fed with a bottle or spoon, playing with baby toys, lying in a crib, wearing a diaper, or being held by a parent. The baby body should have proper infant proportions - chubby limbs, small hands and feet, baby fat rolls, appropriate scale. Include realistic details like baby clothes (onesie, diaper), nursery environment, baby gear, and age-appropriate activities. The scene should be photorealistic with soft lighting. The humor comes from seeing the subject's recognizable original face (preserved exactly as it appears in the photo) on a tiny baby body in baby situations."},{name:"GOTHIC MEDIEVAL ART",category:["ART","PAINTING","MEDIEVAL","GOTHIC","ILLUSTRATION"],message:`Take a picture and transform the subject into a Gothic medieval-style artwork. Render the subject with elongated, dramatic proportions, stylized drapery, intricate patterns, and muted, earthy colors typical of 12th–15th century Gothic art. Include characteristic elements such as pointed arches, cathedral-like backgrounds, stained glass windows, ornate borders, and symbolic motifs.

Use flat or slightly sculptural lighting with subtle gold leaf accents, emphasizing solemnity and reverence. Preserve the subject’s facial features and expression while adapting them to the medieval aesthetic.

Include a simple decorative frame, text banners, or illuminated manuscript-style captions if relevant, ensuring all elements are fully visible in the final composition. The final image should feel like a historical Gothic painting, dramatic and atmospheric, clearly readable on small screens, and fully contained within the frame.`},{name:"GOUACHE ILLUSTRATION",category:["ART","PAINTING","ILLUSTRATION"],message:"Take a picture and transform the image into a gouache illustration. Matte textures, bold shapes, opaque color layers, and crisp edges while preserving subject identity."},{name:"GRAFFITI",category:["ART","STREET","URBAN"],message:"Take a picture in the style of Graffiti Art. Spray paint textures, urban wall surface."},{name:"GRAVITY FALLS",category:["CARTOON","ANIMATION","MYSTERY","PARANORMAL"],message:`Take a picture and transform the subject into a mysterious cartoon world inspired by Gravity Falls.

STYLE & CHARACTER RULES:
• Clean linework with slightly angular proportions
• Muted but warm color palette
• Expressive faces with grounded cartoon realism
• Include eccentric townsfolk or supernatural creatures

SCENE & TONE:
• Small-town mystery and paranormal weirdness
• Forests, cabins, roadside attractions, or strange landmarks
• Subtle humor mixed with intrigue

The final image should look like a fully composed Gravity Falls–style hand-drawn illustration with the subject and additional characters integrated seamlessly into the world.`},{name:"GRIMMS FAIRY TALE",category:["STORYBOOK","KIDS","LESSON"],message:`Take a picture and transform the subject into a character within a Grimm’s fairy tale. Select a fairy tale based on the subject’s appearance, posture, expression, or perceived traits (such as innocence, cleverness, arrogance, bravery, curiosity), OR use a specific fairy tale provided via external master prompt.

Depict the subject as a story character fully integrated into a classic Grimm-style fairy tale scene, not as a modern person placed into an illustration. The subject may appear as a human, villager, traveler, child, noble, or fairy-tale creature as appropriate to the chosen story. The environment and supporting elements should clearly reflect a traditional fairy tale setting such as forests, cottages, castles, roads, or village scenes.

Render the image as a single illustrated storybook page. Ensure the entire page is fully visible within the frame, including margins, illustration, and text area. Do not crop or cut off any part of the page.

Include the **title of the selected fairy tale** prominently and clearly within the page layout, such as at the top of the page or as a decorative storybook heading. The title must be fully visible and immediately identifiable to the viewer.

Include a short fairy-tale caption or lesson within the page, such as a brief story excerpt, warning, or thematic line appropriate to Grimm’s fairy tales. The text should be legible, concise, and directly connected to the scene.

Use a traditional fairy-tale illustration style inspired by 18th–19th century book engravings or painted storybook art. The tone may be whimsical, eerie, or cautionary, but not graphic. Keep the composition symbolic, atmospheric, and clearly readable on a small screen. The final image should feel like a complete, intact page from a Grimm’s fairy tale book.`},{name:"GUMBY",category:["ANIMATION","STOP-MOTION","CLAY","RETRO"],message:`Take a picture and transform the subject into the visual style of classic Gumby stop-motion animation.

STYLE & MATERIAL (CRITICAL):
• Soft clay construction with simple, flat shapes
• Minimal detail — iconic, abstracted forms
• Smooth but visibly molded clay texture

FACIAL & BODY DESIGN:
• Preserve the subject’s recognizable face but simplify heavily
• Small dot eyes or simple sculpted eyes
• Minimal mouth or expression
• Limbs should appear bendable and rubbery

POSE & SCALE:
• Subject should look like a flexible clay figure
• Poses may be awkward, bent, or gravity-defying

COLOR & LIGHTING:
• Bright, flat colors
• Even, simple lighting
• Retro television look

ENVIRONMENT:
• Stylized clay environments — flat ground, abstract landscapes, simple props
• Everything must appear clay-built

FINAL RESULT:
The final image must look like a frame from a classic Gumby episode — playful, abstract, and unmistakably retro clay animation.`},{name:"GYMNAST",category:["SPORT","ATHLETICS","IMPOSSIBLE","HUMOR"],message:`Take a picture of the subject and transform them into a gymnast performing physically impossible or extreme gymnastics feats.

The subject should be dressed in realistic gymnastics attire such as leotards, unitards, or competition uniforms.

Poses may include:
• Impossible flexibility and contortions
• Gravity-defying flips, spins, or aerial twists
• Anatomically absurd balances and holds
• Frozen mid-action to capture the peak of motion

Lighting, environment, and perspective should resemble a real gymnasium, competition arena, or performance space.

Anatomy, muscle definition, and limb placement must appear realistic even while achieving impossible poses.

The final image should look dramatic, athletic, absurdly impressive, and visually convincing, like a photograph capturing a once-in-a-lifetime extreme gymnastics moment.`},{name:"H. P. LOVECRAFT",category:["HORROR","FANTASY","SURREAL"],message:`Take a picture and place the subject into a dark, cosmic-horror world inspired by H. P. Lovecraft.

The subject should appear small or vulnerable within a vast, eerie environment filled with ancient ruins, strange symbols, impossible architecture, and unknowable cosmic forces.

Subtle tentacles, eldritch shapes, or alien geometries may appear in the background, but do not overwhelm the subject.

The mood should feel ominous, mysterious, and otherworldly rather than gory.`},{name:"HAIKU",category:["POETRY","JAPANESE","ZEN"],message:"Take a picture and create a serene, minimalist scene inspired by classical Japanese aesthetics in the spirit of Matsuo Bashō. Emphasize simplicity, natural elements, quiet atmosphere, and contemplative mood. Use flavor text drawn from the subject’s presence, expression, and surroundings to compose a traditional haiku. Display the complete haiku fully and clearly within the image, ensuring all lines are legible and unobstructed. Integrate the text harmoniously into the scene, such as on parchment, a wooden plaque, or subtle calligraphy-style overlay. Render the final image with refined detail, soft lighting, and a calm, poetic visual balance."},{name:"HAIR COLOR TRY-ON",category:["BEAUTY","STYLE","UTILITY"],message:`Take a picture of the subject and generate a 2×2 square grid showing four different hair colors applied to the same person. The face, hairstyle, lighting, and background must remain identical in all four panels — only the hair color changes.

Use realistic hair coloring with natural highlights, shadows, and root blending. Avoid flat or painted-on color.

Select four distinct colors (such as blonde, brunette, black, red, fantasy colors, etc.), chosen to complement the subject’s skin tone.

If external master prompt text is provided (such as decade, fashion style, fantasy theme, or celebrity), apply it to the color choices.

The result should look like a professional salon color preview.`},{name:"HAIRCUT REVEAL",category:["HUMOR","GROOMING","DISASTER","REACTION"],message:"Take a picture capturing the exact moment the subject sees their terrible new haircut in the mirror for the first time. Show their face frozen in horror, shock, or trying to hide devastation while the hairdresser beams proudly in the background holding scissors and mirror. The haircut should be objectively bad - uneven, way too short, bizarre style they didn't ask for, or drastically different from what they wanted. Include salon setting with styling chair, cape still on, hair clippings on floor. Other stylists in background trying not to stare. Show the contrast between the hairdresser's proud smile ('I did such a good job!') and the subject's internal screaming visible on their face. Maybe include a 'before' photo visible showing what they asked for versus this disaster. Add salon mirrors reflecting the damage from multiple angles. The subject might be forcing a smile while dying inside. Capture that universal experience of getting a bad haircut and having to pretend you like it. Make it look like that awful moment of truth in the salon chair."},{name:"HAIRSTYLE TRY-ON",category:["BEAUTY","STYLE","UTILITY"],message:`Take a picture of the subject and generate a 2×2 square grid showing four different realistic hairstyles on the same person. The subject’s face, lighting, pose, and background must remain identical in all four panels — only the hairstyle changes.

Each panel should feature a distinct hairstyle (for example: short, long, curly, straight, layered, undercut, etc.), chosen to suit the subject’s face shape and hairline.

Use high-quality, photorealistic hair rendering with correct lighting, shadows, and blending so the hair looks naturally attached to the subject’s scalp.

If external master prompt text is provided (such as era, fashion decade, celebrity inspiration, or theme), apply it consistently across all four hairstyles.

The final output must be a clean square grid with thin borders separating each option, designed to look like a professional virtual makeover preview.`},{name:"HAIRSTYLE TRY-ON (FUNNY)",category:["HUMOR","STYLE"],message:`Take a picture of the subject and generate a 2×2 grid showing four wildly different, funny, or exaggerated hairstyles on the same person. Keep the face and pose identical in all panels.

Include ridiculous, over-the-top, or unexpected styles (for example: disco afro, medieval wig, anime hair, mullet, punk spikes, powdered wig, etc.).

The hair should still be well-rendered and attached realistically, even when silly.

If external master prompt text is provided (like era or theme), exaggerate it humorously.

The final result should feel like a comedy makeover show.`},{name:"HAITIAN NAÏVE ART",category:["ART","CULTURAL","COLORFUL"],message:"Take a picture and transform the image into Haitian naïve style art. Bright colors, flattened depth, decorative storytelling elements, and joyful visual rhythm."},{name:"HANNA-BARBERA",category:["ART","CARTOON","RETRO"],message:`Take a picture and transform the subject into a classic Hanna-Barbera cartoon character rendered in authentic 1960s–1970s Hanna-Barbera animation style. Use bold black outlines, flat cel-shaded colors, limited animation aesthetics, simple geometric forms, and minimal shading. The subject should be fully redrawn to match the Hanna-Barbera look, not pasted or modernized.

Select ONE iconic Hanna-Barbera franchise and its signature setting, or lightly incorporate supporting characters from that franchise. Do NOT default to Scooby-Doo or Jetsons unless they are explicitly selected.

Possible franchises and signature settings include, but are not limited to:
• The Flintstones – prehistoric Bedrock, stone houses, foot-powered cars
• The Jetsons – futuristic apartment, floating city, conveyor walkways
• Yogi Bear – Jellystone Park with picnic tables and ranger elements
• Super Friends – Hall of Justice with heroic poses and iconic silhouettes
• Wacky Races – exaggerated race vehicles and chaotic motion
• Hong Kong Phooey – janitor’s closet transforming into a hero scene
• Josie and the Pussycats – live band performance on stage
• Captain Caveman – cave interiors and club-based antics
• Johnny Quest – adventure or science-lab environments
• Space Ghost – retro space settings or villain confrontations
• Fat Albert and the Cosby Kids – urban neighborhood streets, junkyard clubhouses, schoolyards, stoops, or classrooms with warm, grounded slice-of-life tone

Integrate the subject naturally into the chosen cartoon world as if they are a regular character in that series. The subject’s clothing, posture, and expression should adapt to the selected franchise’s style (for example: heavier rounded shapes and softer expressions for Fat Albert).

Use era-accurate Hanna-Barbera background techniques such as painted cel backgrounds, stylized repeating scenery, retro props, and limited-animation staging. Color palette and line thickness should match the chosen franchise’s specific visual identity.

The final image should feel like a freeze-frame from an authentic Hanna-Barbera TV episode, nostalgic, playful, and clearly readable on a small screen.`},{name:"HANS CHRISTIAN ANDERSEN",category:["STORYBOOK","KIDS","LESSON"],message:`Take a picture and transform the subject into a character within a Hans Christian Andersen fairy tale. Select a tale based on the subject’s appearance, posture, expression, or perceived traits (such as innocence, longing, pride, loneliness, hope, sacrifice, or wonder), OR use a specific Andersen tale provided via external master prompt.

Depict the subject as a story character fully integrated into a classic Andersen-style fairy tale scene, not as a modern person placed into an illustration. The subject may appear as a human, child, mermaid, toy, animal, noble, or symbolic figure depending on the chosen tale. The environment should reflect romantic, storybook settings such as seaside villages, snowy streets, royal halls, moonlit gardens, or candlelit interiors.

Render the image as a single illustrated storybook page. Ensure the entire page is fully visible within the frame, including margins, illustration, and text area. Do not crop or cut off any part of the page.

Include the title of the fairy tale clearly displayed on the page (for example: 'The Little Mermaid,' 'The Ugly Duckling,' 'The Emperor’s New Clothes,' 'The Snow Queen,' or 'The Princess and the Pea'). The title must be legible and visually distinct so the viewer immediately recognizes the story.

Include a short poetic line, lesson, or emotional reflection appropriate to Hans Christian Andersen’s style. This may express a moral, irony, or bittersweet truth rather than a direct lesson. The text should be concise, legible, and emotionally connected to the scene.

Use a classic 19th-century storybook illustration style inspired by delicate engravings, soft watercolor washes, or romantic ink drawings. The tone should feel whimsical, emotional, and slightly melancholic rather than comedic or dark. Keep the composition symbolic, gentle, and clearly readable on a small screen. The final image should feel like a complete, intact page from a Hans Christian Andersen fairy tale book.`},{name:"HAPPY HOLIDAYS",category:["MASTER PROMPT","CELEBRATION","HOLIDAY","COSTUME"],message:"Take a picture and place the subject in a festive holiday-themed scene based on the closest holiday to the current date. Dress the subject in holiday-appropriate attire: for Christmas, an ugly Christmas sweater; Halloween, a generic costume; 4th of July, an Uncle Sam outfit; Oktoberfest, lederhosen; Thanksgiving, a Pilgrim outfit; Easter, a bunny outfit; New Year’s, a baby’s diaper or Father Time clothing with hourglass; Valentine’s Day, a Cupid outfit with bow and heart arrow; St. Patrick’s Day, a Leprechaun outfit; Cinco de Mayo, a Mexican sombrero. Integrate the subject naturally into a scene reflecting the holiday’s environment, decorations, and mood. Generate a humorous or festive holiday message caption based on the chosen holiday. Preserve facial identity, proportions, and personality while making the scene photorealistic, vibrant, and lively."},{name:"HAPPY MEAL PROMO",category:["HUMOR","TOY","FAST FOOD","RETRO"],message:`Take a picture and transform the subject into a featured kids’ fast-food meal toy promotion inspired by classic Happy Meal–style campaigns.

Present the subject as a small, inexpensive plastic toy figure with simplified proportions, glossy molded surfaces, visible seams, and limited articulation. The figure should clearly look like a real mass-produced kids’ meal toy — slightly stiff, charmingly cheap, and intentionally basic — not a cartoon illustration or realistic figurine.

The image MUST include a fully visible kids’ meal box in the frame. The box should be front-facing and unmistakable, with recognizable fast-food kids’ meal proportions (folded cardboard box with handle or clamshell shape). The toy should appear either:
• displayed in front of the box, or
• pictured on the box artwork itself, or
• shown as part of a promotional display alongside the box

Design the scene as a complete toy promotion image with everything fully visible and uncropped. Include:
• the kids’ meal box with bold colors and playful graphics
• a toy name or toy series title inspired by the subject
• an overly enthusiastic promotional phrase (e.g., "Only in Kids’ Meals!", "Fun Inside!", "Playtime Included!")
• optional callouts like "Collect Them All!" or "Limited Time"

The toy’s pose, accessories, or expression should be humorously derived from the subject’s real traits, clothing, posture, or environment.

Avoid using real fast-food brand logos unless explicitly provided via external master prompt. Instead, evoke a generic fast-food kids’ meal aesthetic through color, layout, typography, and packaging style.

Ensure the entire kids’ meal box, toy, and promotional elements are fully visible and readable on a small screen. The final image should feel nostalgic, playful, slightly tacky, and instantly recognizable as a classic kids’ fast-food toy promotion from the 1990s–2000s.`},{name:"HAUNTED EPITAPH",category:["MASTER PROMPT","HORROR","HALLOWEEN","SPOOKY","TEXT"],message:"Take a picture and transform it into a playful, haunted graveyard scene inspired by classic theme-park haunted mansion aesthetics. Depict the subject as a stylized carved portrait, bust, or ghostly cameo associated with a decorative tombstone or memorial plaque, without implying real death. Create a humorous rhyming epitaph in the spirit of whimsical haunted mansion gravestones, using clever wordplay and flavor text inspired by the subject’s appearance, personality, clothing, or surroundings. Ensure the full rhyming epitaph is clearly visible and readable within the image. Use atmospheric lighting, fog, moonlight, and ornate stonework to create a spooky-but-fun tone. Keep the overall mood lighthearted, imaginative, and theatrical rather than dark or morbid.  The result should be a full view of the epitaph with a relevant background behind the epitaph."},{name:"HEAD SHOT",category:["HUMOR","PORTRAIT","ACTING"],message:`Take a picture of the subject and turn it into a professional actor’s head shot.

Use a clean studio background, flattering lighting, and a confident or dramatic pose.

Use external master prompt text to supply an actor name and optional flavor text.

Add a humorous talent list next to or under the portrait, including strange or ridiculous talents no one would normally list, such as 'Expert at Awkward Silence', 'Professional Stand-up Philosopher', or 'Can Cry on Command When Impaled'.

The final result should look like a real casting profile with a ridiculous twist.`},{name:"HENRY DANGER",category:["TV","SUPERHERO","HUMOR"],message:`Transform the subject into Henry Danger.

CORE RULE:
• The subject must be wearing the full Henry Danger costume
• The subject’s face replaces Henry Danger’s face under the mask

FACE INTEGRATION:
• The mask must fit the subject’s facial structure
• The face must look like it belongs to the character

FINAL RESULT:
The image should look like the subject IS Henry Danger in costume, not a face overlay.`},{name:"HIDDEN DETAILS",category:["ILLUSION","PUZZLE","HIDDEN"],message:"Take a picture and transform the image so subtle hidden elements are embedded. Viewer should discover details only after close inspection."},{name:"HIEROGLYPHICS",category:["TEXT","ANCIENT","EGYPTIAN"],message:"Take a picture and make it hieroglyphic art. Everything is converted to pictures and symbols etched onto a stone monument or drawn onto papyrus."},{name:"HISTORY",category:["MASTER PROMPT","HISTORICAL","EDUCATIONAL","TIME TRAVEL"],message:"Take a picture and place the subject seamlessly into a historical event that occurred on the date specified externally. Preserve the subject’s facial features, clothing, and posture while adapting them naturally to the historical setting, lighting, and perspective. Ensure the subject interacts believably with the environment, props, or people in the scene so they appear as an authentic part of the moment. Make the final image photorealistic and historically accurate, with no elements appearing out of place."},{name:"HITCHCOCK FILM",category:["MOVIES","SUSPENSE","DIRECTOR","THRILLER"],message:"Take a picture and place the subject into an iconic Alfred Hitchcock thriller scene. Use Hitchcock's distinctive visual style: dramatic high or low camera angles, bold shadows and noir lighting, vertiginous perspectives, and tension-filled composition. Show the subject in a moment of suspense or danger - pursued, discovering something shocking, or caught in psychological terror. Include Hitchcock's signature elements: stark lighting contrasts, expressionistic shadows, voyeuristic framing, and color schemes from his films (cool blues, deep reds). Place them in classic Hitchcock settings like shadowy staircases, fog-shrouded streets, elegant apartments, or dizzying heights. Capture that signature Hitchcock atmosphere of elegant dread and mounting psychological tension. Make it look like a frame from an actual Hitchcock masterpiece."},{name:"HOARDERS",category:["HUMOR","TV","REALITY","MESSY"],message:`Take a picture and transform it into a scene from the reality show 'Hoarders' with the subject surrounded by extreme clutter and accumulated items.

The subject should be standing or sitting in the middle of a severely cluttered room filled floor-to-ceiling with piles of stuff: stacks of newspapers and magazines, boxes overflowing with items, bags of belongings, old furniture piled up, random objects everywhere, narrow pathways through the clutter. The mess should be overwhelming and chaotic.

Items can be themed for humor: all garden gnomes, excessive craft supplies, thousands of fast food condiment packets, walls of VHS tapes, mountains of beanie babies, or traditional hoarding clutter. Make it densely packed and overwhelming.

The subject's expression should show they see nothing wrong with the situation - casual, defensive, or attached to their items. Clothing can be casual or slightly disheveled.

Lighting should match reality TV documentary style - natural indoor lighting, slightly dim, authentic and unglamorous. The scene should feel claustrophobic with limited space to move.

Optional elements: Concerned family member visible in background looking horrified, professional organizer or therapist trying to help, pets navigating through the clutter, visible dust or cobwebs adding to the neglected atmosphere.

The final image should look like an actual still from the Hoarders TV show - overwhelming clutter, reality TV documentary aesthetic, raw and authentic. The humor comes from the absurd amount of stuff and the subject's obliviousness to the extreme situation. Photorealistic with proper lighting and that specific reality TV look.`},{name:"HOPPER",category:["ART","PAINTING","AMERICAN","ARTIST"],message:"Take a picture and transform it into a scene inspired by Edward Hopper. Preserve the photographic framing but simplify forms and use strong directional lighting. Emphasize isolation, stillness, and quiet atmosphere. Colors should be muted and shadows deliberate. The final image should feel contemplative and emotionally distant."},{name:"HOROSCOPE",category:["MASTER PROMPT","HUMOR","TEXT"],message:`Take a picture and transform it into a deliberately silly horoscope-style image.

Determine the subject’s astrological sign based on externally provided input or infer one arbitrarily if none is supplied. Clearly display the astrological sign name and symbol.

Write ONE short horoscope message based on the subject’s visible traits, expression, posture, clothing, or situation. The horoscope must be humorous, blunt, and confidently ridiculous ������� it should sound specific, obvious, and completely unserious.

Use flavor text to exaggerate mundane or trivial traits (e.g., procrastination, overconfidence, distraction, stubbornness) as if they are unavoidable cosmic truths. Avoid mystical language, poetic ambiguity, or generic fortune-cookie phrasing.

Include a clearly labeled "Lucky Number" that is intentionally useless, impractical, or meaningless (e.g., decimals, extremely large numbers, fractions, timestamps, negative numbers, or oddly specific values). The lucky number must not be applicable to gambling, dates, clocks, or real-world decisions.

Compose the image like a fake astrology card or newspaper horoscope box. Keep the layout clean, bold, and readable on a small screen. Ensure the full card, sign, horoscope text, and lucky number are fully visible.

Do not explain the joke. Do not add disclaimers. Treat the horoscope as completely accurate, no matter how absurd.`},{name:"HORROR FILMS",category:["HUMOR","MOVIES","SCENE","HORROR"],message:`Take a picture of the subject and place them into a scene from a classic horror film, such as *Friday the 13th*, *Nightmare on Elm Street*, *The Shining*, or *Psycho*.

The subject should be the central figure, reacting to the horror environment or villain in a dramatic or exaggerated way.

Lighting, perspective, and props should match the iconic horror style — dark shadows, eerie lighting, and creepy set pieces.

Optional master prompt text can add humorous twists (e.g., subject holding a comically oversized weapon, screaming dramatically, or unintentionally scaring the villain).

The final image should feel cinematic, instantly recognizable as a classic horror scene, and funny or absurd depending on the subject’s pose or expression.`},{name:"I'M HUNGRY",category:["FOOD","TRANSFORMATION","MASTER PROMPT"],message:`Take a picture and transform the subject into a figure entirely made out of real, non-candy food items (vegetables, fruits, grains, bread, pasta, cheese, etc.). Preserve recognizable features, proportions, and posture while rendering them in edible textures — e.g., eyes made of olives, hair as leafy greens, clothing patterns from colorful produce. Avoid candy or chocolate elements.

Place the food figure in a simple, neutral background such as a kitchen counter, plate, or wooden surface, with natural lighting and subtle shadows to make it appear tangible and realistic. Ensure the entire subject is fully visible.

Add playful flavor text to the scene automatically based on the subject, like 'Dinner is served!' or 'Eat your vegetables!' or allow the user to append a custom message via master prompt.

The final image should feel whimsical, absurd, humorous, and clearly readable on small screens, emphasizing the creativity of using ordinary food items to replicate the subject.`},{name:"I'M WITH STOOPID",category:["HUMOR","TEXT","SHIRT"],message:`Take a picture and transform it so one subject appears to be wearing an 'I'm with Stoopid' t-shirt that looks physically printed on the fabric, not digitally overlaid. The shirt should include natural folds, fabric texture, slight ink distortion, and perspective warping so the design follows the body realistically.

If only one subject is detected, display the text 'I'm with Stoopid' with a single large arrow pointing upward toward the wearer’s own head.

If two or more subjects are detected, place the shirt on the primary subject and display the text 'I'm with Stoopid' with one or more arrows pointing sideways or diagonally toward the other visible subjects. Arrows should clearly indicate the other subjects without overlapping faces.

Ensure the text and arrows remain bold, high-contrast, and legible on small screens while maintaining a believable printed-shirt appearance. Preserve lighting consistency, fabric shading, and natural wrinkles so the shirt feels worn, not pasted.`},{name:"I AM WITH THE BAND",category:["MUSIC","PERFORMANCE","CELEBRITY","MASTER PROMPT"],message:"Take a picture and place the subject as a member of a famous singer’s band or musical group. Preserve the subject’s facial features, personality, and clothing while transforming them into a musician integrated into the ensemble. The subject should be holding or playing a musical instrument appropriate to the scene (guitar, drums, keyboard, etc.) and positioned naturally among other group members. Capture stage lighting, performance energy, and the dynamic interaction of a live or recorded music setting. Ensure the subject remains clearly identifiable while fully integrated into the famous singer’s group performance."},{name:"ICE SCULPTURE",category:["SCULPTURE","ICE","COLD"],message:"Take a picture and make subject into an ice sculpture. The sculpture has the clarity and sparkle of ice, often enhanced by lighting, to showcase its form. Clear, chiseled ice with internal refraction."},{name:"ICONIC PHOTO",category:["HISTORY","PHOTOGRAPHY","REALISM","ARCHIVAL","FACE"],message:`Take a picture and transform the subject into a famous historical photograph using ONE of the modes below, selected automatically based on the chosen source image.

FRAMING LOCK (CRITICAL):
• Preserve the FULL original composition of the historical photograph
• DO NOT zoom in, crop, reframe, or tighten the shot
• Match the original camera distance and field of view exactly
• Camera position, lens distance, and framing MUST match the source photograph 1:1
• The subject must be placed INTO the existing frame — the frame must NEVER be rebuilt or simplified
• The output must retain all original foreground, midground, and background elements

POPULATION & SUBJECT COUNT LOCK (CRITICAL):
• Preserve the EXACT number of people visible in the original photograph
• DO NOT remove, merge, isolate, or invent additional people
• Group photographs MUST remain group photographs
• Crowd density, spacing, and relative scale MUST match the source image exactly
• Single-subject reinterpretations of multi-subject photos are STRICTLY FORBIDDEN

---

MODE SELECTION RULE (MANDATORY):
• If the original photograph depicts anonymous or non-identifiable individuals, USE MODE A (True Face Replacement).
• If the photograph depicts a clearly identifiable public figure or protected individual, USE MODE B (Historical Reenactment).
• DO NOT substitute a different photo.
• DO NOT simplify the scene to make substitution easier

---

MODE A — TRUE FACE REPLACEMENT (ANONYMOUS SUBJECTS ONLY):
• The subject’s face must FULLY REPLACE the original subject’s face — not overlay it
• Match exact head angle, skull structure, expression, focal length, and depth of field
• Skin texture, grain, contrast, and lighting must match the original photograph
• No seams, glow, blur halos, or mismatched sharpness
• Preserve the original body, clothing, pose, environment, and composition exactly
• The result must look like a genuine archival photograph where the subject truly existed in that moment
• Face replacement must NOT alter the subject’s apparent distance from the camera
• The body, scale, and posture of ALL other people in the image must remain untouched

Allowed examples include:
• V-J Day in Times Square (1945)
• Lunch Atop a Skyscraper (1932)
• Bandit’s Roost, Mulberry Street (c.1888)
• The Steerage (1907)
• Bricklayer (1928)
• Anonymous street, labor, or crowd documentary photographs

---

MODE B — HISTORICAL REENACTMENT (PUBLIC FIGURES):
• The subject is transformed into a convincing historical reenactment of the original figure
• Facial identity must be preserved but adapted — NOT a literal face swap
• Match the era’s hairstyle, wardrobe, posture, and expression
• Preserve the original photograph’s camera angle, framing, lighting, and environment
• Match the original medium (black-and-white or color), film grain, softness, and imperfections
• No parody, exaggeration, caricature, or modern stylization
• The reenactment must occur within the original scene — NOT a cropped or reimagined version

Examples include:
• Marilyn Monroe Subway Grate (1954)
• Gandhi and the Spinning Wheel (1946)
• Muhammad Ali vs. Sonny Liston (1965)
• Winston Churchill Portrait (1941)
• Einstein Sticking Out His Tongue (1951)
• Chairman Mao Swims the Yangtze (1966)
• Demi Moore Vanity Fair (1991)
• The Situation Room (2011)

---

ABSOLUTE RULES:
• Do NOT mix modes
• Do NOT partially face-replace protected figures
• Do NOT modernize, stylize, or parody
• Do NOT reduce multi-subject images to single subjects
• Do NOT tighten framing for clarity or emphasis
• The final image must look like a real photograph captured in the original era

FINAL RESULT:
A historically authentic image where the subject either truly replaces an anonymous historical figure or convincingly reenacts a protected one, with no ambiguity, no framing drift, no population loss, and no fallback behavior.`},{name:"IDIOM",category:["HUMOR","LANGUAGE","LITERAL"],message:`Take a picture of the subject and interpret a common phrase or idiom in the most painfully literal visual way possible.

IDIOM SELECTION:
• Randomly choose a well-known idiom or saying
• Interpret it visually without metaphor or restraint

EXAMPLES (DO NOT SHOW TEXT):
• 'Head in the clouds'
• 'Breaking the ice'
• 'Burning the midnight oil'
• 'Walking on thin ice'
• 'Under pressure'
• 'Spilling the beans'

SUBJECT RULES:
• The subject must be the one experiencing the literal situation
• Preserve facial identity and expression

STYLE:
• Photorealistic or painterly
• The absurdity comes from literal interpretation, not cartoon style

FINAL RESULT:
The image should make the viewer instantly recognize the idiom and laugh at how aggressively literal it has been made.`},{name:"IF YOU THINK IT'S TRUE, IT'S SNOT",category:["HUMOR","GROSS","EMBARRASSING"],message:`Take a picture and transform it into one of two embarrassing nasal situations - RANDOMLY CHOOSE ONE:

OPTION 1 - VISIBLE BOOGERS: The subject is completely unaware they have visible nasal discharge (boogers) hanging from or under their nose. Add realistic mucus visible at the nostrils - it could be hanging, crusty, or dripping slightly. The subject's expression must show they are completely oblivious - looking normal, happy, confident, or engaged in conversation. They think everything is fine, making the situation more awkward and humorous.

OPTION 2 - NOSE PICKING: The subject is actively picking their nose with their finger inserted into their nostril. They are completely absorbed in the act, unaware they're being photographed. The finger should be realistically positioned in the nose with appropriate hand placement. Their expression should show concentration or absent-minded focus on the task. This could be in a public setting, during a meeting, in a car, or any situation where nose-picking would be particularly inappropriate.

For both options: Include optional context that makes it worse - professional setting (meeting, presentation, date, interview), talking to someone, or what they think is a nice photo opportunity.

Keep lighting and photography photorealistic. The humor comes from either the subject's obliviousness to the visible boogers OR being caught in the act of nose-picking.

Preserve recognizable facial features while adding the unfortunate nasal situation.`},{name:"IKEA INSTRUCTION MANUAL",category:["HUMOR","INSTRUCTIONS","DIAGRAM"],message:"Take a picture and transform the subject into an illustrated instruction manual page, similar to a flat-pack assembly guide. Depict simplified, diagram-style versions of the subject in multiple steps, showing how the subject is assembled or functions. Use clean line art, minimal colors, arrows, step numbers, icons, and humorous warning symbols inspired by the subject’s personality, clothing, or posture. Avoid text-heavy explanations; rely on visual storytelling and pictograms. Present the final image as a complete instruction manual page with a clean layout and playful, clever tone."},{name:"INANIMATE INSANITY",category:["CARTOON","ANIMATION","OBJECT","CHAOS"],message:`Take a picture and transform the subject into an expressive cartoon object-character inspired by Inanimate Insanity.

STYLE & CHARACTER RULES:
• The subject becomes a sentient object with a face
• Simple shapes with thick outlines
• Bright, saturated colors
• Include multiple competing object-characters surrounding the subject

SCENE & TONE:
• Competitive, energetic, and chaotic
• Simple abstract or game-like environments
• Exaggerated expressions and poses

The final image should look like a fully composed Inanimate Insanity–style hand-drawn illustration with the subject and additional characters integrated seamlessly into the world.`},{name:"INFINITY MIRROR",category:["ART","OPTICAL","LIGHT","INSTALLATION","SURREAL"],message:`Take a picture and transform the subject into a real infinity-mirror light sculpture.

The subject must remain clearly recognizable (face, body, or object). Do NOT replace the subject with abstract light.

Convert the interior of the subject into a two-way mirror cavity that creates infinite visual depth. The inside of the subject should look hollow and reflective, like a real infinity mirror, with reflections repeating deeper and deeper inside the subject’s shape.

Outline the subject’s silhouette, facial features, or body shape using thin LED light strips (neon-style). These LEDs form the FRAME of the infinity mirror. The lights must only run along the subject’s edges, eyes, mouth, body outline, or major contours — NOT across the background.

Inside those glowing outlines, the mirror reflections should multiply the LEDs endlessly, creating the illusion of a glowing tunnel extending inward.

The surrounding environment should be dark or neutral so the infinity effect stands out, but the subject must not disappear into the background.

Do NOT render this as a painting, illustration, or glowing person. It must look like a real physical infinity-mirror sculpture or wall installation photographed in a gallery.

The final image should look like a recognizable subject made of light and mirrors, with endless depth visible inside their face or body.`},{name:"INFLATABLE POOL TOY",category:["FUN","INFLATABLE","HUMOR","TOY"],message:`Take a picture and transform the subject into a single, continuous inflatable pool toy. The subject’s entire body, including the head and face, must be made of inflated vinyl material — the subject is the pool float itself, not wearing or sitting in one.

Render the face as part of the inflatable surface with printed or molded features, subtle distortions, and glossy reflections consistent with air-filled vinyl. Include seams, air valves, and slight shape irregularities.

Place the inflatable subject floating in water or resting poolside. Use realistic reflections, highlights, and water interaction. Ensure the entire inflatable is fully visible and readable on a small screen.`},{name:"INFRARED",category:["PHOTOGRAPHY","TECHNICAL","THERMAL"],message:"Take a picture and transform the image into infrared photography. Bright foliage, dark skies. Surreal tonal contrast."},{name:"INKBLOT",category:["ART","ABSTRACT","PSYCHOLOGY"],message:"Take a picture in the style of an inkblot-style artwork. Abstract symmetry, flowing ink forms on paper."},{name:"INTERVENTION",category:["HUMOR","TV","REALITY","DOCUMENTARY"],message:`Take a picture and transform it into a scene from the reality show 'Intervention' where family and friends confront someone about a problem.

The subject should be seated, looking shocked, defensive, emotional, or in denial. Surround them with concerned family members and friends sitting in a semicircle, all looking serious and worried. Include an intervention specialist or counselor present.

Setting should be a modest living room or community center room with folding chairs arranged in intervention style. Lighting should match reality TV documentary style - slightly dim, handheld camera aesthetic, authentic and raw.

Optional humorous details: Instead of serious addiction, the intervention could be for ridiculous obsessions like 'collecting too many throw pillows,' 'excessive karaoke,' 'TikTok addiction,' 'spending too much on craft supplies,' or 'won't stop talking about their fantasy football team.'

Include tissues boxes visible, people holding letters they've written, emotional expressions of concern from family members. The subject should look caught off guard, emotional, or stubbornly defensive.

The aesthetic should match reality TV confessional style with that specific documentary lighting and framing. Optional: Include text overlay at bottom like reality shows use - 'Day 1 of Intervention' or subject's name and their 'problem.'

The final image should look like an actual still frame from the Intervention TV show - emotional, raw, documentary style, capturing that specific reality TV aesthetic. Make it photorealistic but the humor comes from either the absurd reason for intervention or the over-the-top dramatic reactions.`},{name:"iPHONE CAMERA",category:["PHOTOGRAPHY","RETRO","SMARTPHONE"],message:"Take a picture and transform it into an early smartphone camera photo. Use soft focus, blown highlights, muted colors, and slight motion blur. The subject should feel casual, imperfect, and authentically early-mobile."},{name:"IS IT CAKE?",category:["HUMOR","FOOD","ILLUSION"],message:"Take a picture and transform the subject so it appears to be a realistic hyper-detailed cake. The subject should retain recognizable features but clearly be made of cake, frosting, fondant, and icing textures. Optionally show a slice cut out or a knife mid-cut revealing cake layers inside."},{name:"ISLAMIC MINIATURE",category:["ART","CULTURAL","MIDDLE EASTERN"],message:"Take a picture and transform the picture into an Islamic miniature style painting. Flattened perspective, decorative borders, fine line work, intricate patterns, and vivid colors."},{name:"ISOMETRIC",category:["DESIGN","3D","GEOMETRIC","STRUCTURAL"],message:`Take a picture and completely reconstruct the scene using strict isometric projection.

All elements must be viewed from a fixed isometric angle (approximately 30–45 degrees) with no vanishing points, no perspective convergence, and no camera lens distortion. Parallel lines must remain parallel.

Rebuild the scene as simplified geometric forms aligned to an isometric grid. Convert subjects, objects, and environments into clean, block-like or planar shapes while preserving recognizable proportions and silhouettes.

Depth must be represented only through isometric extrusion, vertical offsets, overlap, and stacking — not through blur, bokeh, or atmospheric effects.

Use consistent lighting and shading across all surfaces to reinforce form and depth. Shadows should be crisp, directional, and uniform, matching the isometric angle.

Surface detail should be simplified or removed. Avoid photographic textures, skin pores, fabric weave, or noise. Favor smooth, stylized surfaces suitable for a game map, architectural diagram, or technical illustration.

The final image should resemble a high-quality isometric game environment or design diagram — clean, readable, geometric, and clearly structured. Ensure the entire scene fits within the frame and remains legible on a small screen.`},{name:"JAVERT PHOTOBOMB",category:["HUMOR","MOVIES","PHOTOBOMB"],message:"Take a picture and add in the background Russell Crowe as Javert from Les Miserable photobombing the subject. Match lighting realistically."},{name:"JAPANESE SUMI-E",category:["ART","ASIAN","INK","ZEN"],message:"Take a picture and transform the image into Japanese sumi-e ink painting. Minimal brushstrokes, expressive ink flow, restrained composition, and elegant simplicity."},{name:"JOHANNES VERMEER",category:["ART","PAINTING","CLASSIC","ARTIST"],message:"Take a picture a make it into a vibrant, painterly portrait into a Dutch Golden Age portrait inspired by Vermeer. Soft window lighting, rich detail, oil paint texture, calm atmosphere."},{name:"JOHN HUGHES FILM",category:["HUMOR","MOVIES","SCENE","CULT CLASSIC"],message:`Take a picture of the subject and place them into a scene from a classic John Hughes film, such as *The Breakfast Club*, *Ferris Bueller's Day Off*, *Weird Science*, or *Sixteen Candles*.

The subject should be fully integrated into the scene, interacting naturally with the environment and other characters as if they are the main focus.

Costumes, lighting, and props should match the era of the film — 1980s high school or suburban settings, vintage cars, lockers, diners, etc.

Optional flavor text from the master prompt can influence the scene, such as having the subject deliver a famous line, partake in iconic antics, or create a humorous twist.

The final image should be cinematic, instantly recognizable as a John Hughes film, and funny or absurd depending on the subject’s pose or expression.`},{name:"JOSÉ GUADALUPE POSADA — CALAVERA ENGRAVING",category:["ART","ENGRAVING","HISTORICAL","DÍA DE LOS MUERTOS","PRINTMAKING"],message:`Take a picture and transform the subject into a José Guadalupe Posada–style calavera engraving.

The entire image must be rendered as a traditional Mexican relief print / engraving — as if carved into metal or wood and printed with ink.

STYLE REQUIREMENTS (CRITICAL):
• Black ink on off-white or aged paper
• High-contrast linework only — NO color
• Cross-hatching, stippling, and carved line textures
• Uneven ink density, imperfect registration, and hand-printed imperfections

SUBJECT TRANSFORMATION:
• Transform the subject into a calavera (skeletal figure) rendered in Posada’s satirical style
• Preserve the subject’s posture, clothing silhouette, and personality through skeletal interpretation
• Facial features must be skeletal but expressive — smiling, smirking, laughing, dancing, or posing
• The skeleton should clearly represent the subject’s identity through pose, clothing, and gesture

CLOTHING & THEMES:
• Victorian-era or early 20th-century Mexican attire (suits, dresses, hats, shawls, coats)
• Or reinterpret the subject’s modern clothing as period-appropriate engraved garments
• Clothing must be drawn entirely with engraved linework — no smooth fills

COMPOSITION RULES:
• Flat or shallow depth, like a printed broadside or newspaper illustration
• Minimal background OR simple engraved scenery (street, cemetery, dance floor, pulque tavern)
• Optional engraved banners, ribbons, or captions in Spanish-style lettering

TEXT (OPTIONAL):
• If master prompt text is provided, render it as hand-lettered engraved text
• Otherwise include satirical Posada-style phrases such as:
  – "La Calavera del [Subject]"
  – "Todos Acabamos Igual"
  – "La Muerte No Perdona"

ABSOLUTE PROHIBITIONS:
• NO modern illustration styles
• NO smooth digital shading
• NO photography, realism, or painterly effects
• NO color
• NO contemporary cartoon aesthetics

FINAL RESULT:
The image must look like an authentic early 1900s José Guadalupe Posada calavera engraving — a satirical, hand-carved print published in a Mexican broadside — humorous, macabre, expressive, and unmistakably traditional.`},{name:"KAHLO",category:["ART","PAINTING","ARTIST","MEXICAN"],message:"Take a picture and transform it into a portrait inspired by Frida Kahlo. Center the subject prominently with symbolic elements drawn from nature or personal identity. Use bold colors, flat backgrounds, and strong outlines. The subject should feel emotionally direct, intimate, and iconic."},{name:"KEITH HARING",category:["ART","POP ART","ARTIST","GRAFFITI"],message:"Take a picture in the style of the American artist, Keith Haring. Bold black lines, energetic figures, flat colors."},{name:"KEYCHAIN OR MAGNET",category:["SOUVENIR","MINIATURE","ACCESSORY","COLLECTIBLE"],message:"Take a picture and transform the subject into either a novelty keychain charm OR a refrigerator magnet souvenir - choose one. If KEYCHAIN: The subject should be miniaturized as a small keychain trinket - plastic figure, acrylic photo charm, rubber PVC character, metal engraved pendant, or resin-encased image. Show metal split ring or ball chain attachment, small metal loop at top, compact size (1-3 inches). The subject's likeness as molded plastic figurine, flat acrylic photo card, rubber cutout, stamped metal relief, or clear resin dome. Include slight wear, scratches, other keys attached. Place it laying on table with keys, hanging from backpack, or in hand showing tiny scale. If REFRIGERATOR MAGNET: The subject as a flat or slightly dimensional magnet - printed photo magnet, vinyl die-cut shape, ceramic tile, or resin-molded figure. Show flat backing with dark magnetic strip visible on reverse (if angled view), rectangular or custom die-cut shape, laminated surface. The subject as glossy photo print, colorful vinyl illustration, ceramic with glazed image, or puffy sticker style. Show it stuck to refrigerator among other magnets, holding papers, or on magnetic board in kitchen setting. Add magnet details: edge curl, faded colors, fingerprints, thin flat profile (2-4 inches). Both should look like actual souvenir items you'd buy at a gift shop featuring the subject. Make it photorealistic as one or the other."},{name:"KING OF THE WORLD!",category:["HUMOR","MOVIES","SCENE","ROMANCE"],message:`Take a picture of the subject and place them in a dramatic, cinematic ship-bow scene inspired by a famous romantic disaster-era film.

The subject stands at the front of a massive ocean liner with arms outstretched into the wind, expressing triumph, freedom, and exhilaration.

IMPORTANT RULES:
• This is a cinematic reenactment inspired by a well-known movie moment — NOT a direct recreation
• The subject must NOT replace or resemble any real actor
• Do NOT reproduce an exact frame, pose, or dialogue from the original film
• The scene should feel familiar but not identical

Visual details:
• Wind-blown hair and clothing
• Strong ocean breeze and dramatic sky
• Grand scale of the ship’s bow and open sea
• Realistic lighting, perspective, and motion

Humorous tone:
• The subject may look overly proud, wildly excited, or slightly off-balance from the wind
• Optional humorous exaggeration is allowed as long as it remains photorealistic

Final result:
A cinematic still that evokes an iconic romantic ship-bow moment, clearly starring the subject, humorous and dramatic.`},{name:"KISS CAM",category:["HUMOR","SITUATIONAL"],message:`Take a picture of one or more subjects and transform it into a humorous 'Kiss Cam' moment at a sporting event.

Render the scene photorealistically as if captured by a live stadium camera. The subjects should have exaggerated expressions of shock, embarrassment, awkwardness, or confusion - not cartoonish.

Include realistic background elements: stadium seating, cheering crowd in soft focus, jumbotron screens, arena lighting, and authentic sporting venue atmosphere.

The awkwardness should feel authentic and relatable: subjects might be leaning away, covering their faces, looking in opposite directions, holding drinks or food awkwardly, or clearly unprepared for the moment.

Optional realistic details: other audience members reacting in the background, stadium signage, team colors and branding, or humorous but believable context clues.

Optional props or signs in the background may add to the humor, e.g., 'Halitosis', 'Not Interested', 'Wrong Partner'.

The final image must look like an actual photograph taken at a real sporting event - authentic lighting, natural skin tones, realistic fabric and textures, and genuine human expressions. The humor comes from the real, relatable awkwardness of the situation, not cartoon exaggeration.`},{name:"KITSCH",category:["ART","TACKY","COLORFUL"],message:"Take a picture and transform the image into kitsch style art. Over-the-top colors, exaggerated sentimentality, playful excess, and intentionally cheesy visual elements."},{name:"KLINGON TRANSFORMATION",category:["SCI FI","STAR TREK","ALIEN","TRANSFORMATION"],message:"Take a picture and transform the subject into a realistic Klingon warrior. Preserve recognizable facial structure, expressions, body proportions, and personality while adapting them to authentic Klingon anatomy including pronounced ridged forehead, heavier brow, deeper-set eyes, rougher skin texture, and powerful build. Translate the subject’s clothing into Klingon armor or garments appropriate to their status while retaining the original clothing’s silhouette and identity cues. Cinematic sci-fi lighting, gritty realism, and cultural authenticity. The subject must appear fully Klingon, not human with prosthetics, and naturally integrated into their environment."},{name:"KUBRICK FILM",category:["MOVIES","CINEMATIC","DIRECTOR","DRAMATIC"],message:"Take a picture and place the subject into an iconic Stanley Kubrick film scene. Use Kubrick's distinctive visual style: perfectly symmetrical one-point perspective composition, stark geometric framing, dramatic lighting with strong contrast, and meticulous attention to detail. The subject should be centered in the frame with symmetrical elements on both sides. Use Kubrick's characteristic wide-angle lens look, slow deliberate camera movement aesthetic, and painterly color palette. Place them in settings reminiscent of his films - sterile futuristic spaces, grand hotel corridors, war rooms, or baroque mansions. Include atmospheric tension, psychological intensity, and that precise, controlled Kubrick aesthetic. Make it look like a frame from an actual Kubrick film with his signature compositional perfection and haunting atmosphere."},{name:"KULOMETRIC BANSASA",category:["ART","ABSTRACT","GEOMETRIC","EXPERIMENTAL"],message:`Take a picture and transform the subject into a Kulometric Bansasa–style artwork.

Reconstruct the subject using bold, fragmented geometric forms arranged in layered, rhythmic patterns. Break the subject into angular planes, curved segments, and modular shapes that feel intentionally constructed rather than organic. The subject must remain recognizable, but only through abstraction and structure.

Use high-contrast color blocks, unexpected color pairings, and sharp edges combined with controlled curves. Depth should be suggested through overlapping shapes, scale shifts, and offset layers rather than realistic perspective.

Incorporate a sense of motion and visual tension, as if the image is vibrating or slightly misaligned. Elements may appear rotated, sliced, staggered, or offset, creating a dynamic, kinetic composition.

Avoid realism, painterly textures, or soft gradients. Surfaces should feel flat, graphic, and deliberate — like a constructed visual system rather than a painting.

The background should support the geometry without competing with it, using negative space, grids, or subtle patterning. Ensure the full composition is visible and balanced within the frame.

The final image should feel modern, experimental, and architectural — a distinctive Kulometric Bansasa interpretation that is visually striking and clearly readable on a small screen.`},{name:"LANDMARKS",category:["TRAVEL","TOURIST","LOCATION","MASTER PROMPT"],message:"Take a picture and place the subject naturally in front of a randomly selected famous world landmark. Preserve the subject’s recognizable facial features, proportions, and identity while matching the lighting, perspective, color temperature, and camera style of the landmark environment. Ensure correct scale, shadows, reflections, and atmospheric depth so the subject appears physically present at the location rather than composited. Adapt clothing, posture, and environment subtly to fit the climate, culture, and setting without turning it into a costume. The landmark and surroundings should remain authentic and recognizable, with the subject fully integrated into the scene. Render with photorealistic detail and travel-photography realism."},{name:"LATTE ART",category:["BEVERAGE","COFFEE","FOAM ART","HARD MATERIAL"],message:`Take a picture and COMPLETELY TRANSFORM the subject so that the subject exists ONLY as latte foam art on the surface of an espresso drink.

ABSOLUTE REQUIREMENT:
The subject MUST EXIST ONLY AS FOAM PATTERNS ON LIQUID.

The subject may NOT exist as:
• A photograph
• A reflection
• A printed image
• A floating face
• A submerged object
• A picture inside the cup

DO NOT paste or place the subject into the drink.
DO NOT insert a photo into liquid.
DO NOT treat the coffee surface as a screen.

The subject MUST BE CREATED ONLY BY:
• Milk foam density
• Microfoam contrast
• Espresso crema flow
• Natural pour patterns
• Etched foam lines

Construction rules:
• Dark areas = espresso crema
• Light areas = milk microfoam
• Detail = foam thickness variation and etching

NO hard outlines.
NO graphic edges.
NO photographic texture.

The foam must behave realistically:
• Soft bleed
• Imperfect edges
• Liquid diffusion
• Slight asymmetry

The cup, rim, and environment should look real and photographic.

FINAL VALIDATION TEST:
If the latte surface were stirred, the subject would be destroyed.
If the image looks like a photo placed into coffee, IT IS WRONG.

The final image must look like a real café latte photographed from above, with the subject miraculously formed ONLY from foam and crema.`},{name:"LEGO",category:["TOY","BRICK","MINIATURE"],message:`Take a picture and transform the image into a realistic LEGO minifigure scene. Convert all subjects into LEGO minifigures with correct minifigure proportions: cylindrical torsos, blocky legs, movable arms and hands, and **classic LEGO minifigure heads**.

The subject’s head must be a smooth, cylindrical LEGO head with **all facial features painted directly onto the head**, including eyes, eyebrows, mouth, expression, facial hair, freckles, glasses, or other defining traits. Do NOT render realistic human heads, sculpted hair, or detailed facial geometry. Any hairstyle or head covering must appear only as a separate LEGO accessory piece (helmet, hat, hair piece), not as part of the head itself.

Translate the subject’s recognizable traits into simplified LEGO-style printed facial graphics while maintaining the iconic LEGO look.

Build the environment entirely from LEGO bricks at toy scale using plates, bricks, tiles, and accessories. Use realistic toy-photography lighting with soft shadows and subtle reflections so the scene looks like a photograph of an actual LEGO diorama. Keep the composition clear, proportional, and readable on small screens.`},{name:"LETTERHEAD",category:["BUSINESS","UTILITY","DOCUMENT","PROFESSIONAL","MASTER PROMPT"],message:`Take a picture of a sign, document, business card, storefront, or any visible branding related to a person or organization. Identify and extract readable text such as names, titles, addresses, phone numbers, email addresses, taglines, or other identifying information.

If the source image contains a visual logo, emblem, icon, symbol, or recognizable graphic mark, recreate a simplified, clean version of that logo at the top of the letterhead. The logo should be visually derived from the image itself (shapes, symbols, icons, or imagery), not generated from appended text. Preserve recognizability while simplifying for professional print use.

If no visual logo is present, construct a refined text-based header using the extracted name or business name, without inventing imagery.

If externally provided information is supplied (such as name, address, phone, email, or website), merge it seamlessly as supporting text beneath or beside the logo or header. Do not transform externally provided text into a logo or symbol.

Design a clean, professional, print-ready letterhead layout. Present the logo or header prominently at the top, followed by secondary details arranged with balanced alignment and spacing. Use modern, understated typography, subtle dividers, restrained color accents, and generous white space. Avoid novelty fonts, decorative graphics, or poster-like styling.

Ensure all text is crisp, readable, and properly aligned. The background should be clean and uncluttered, resembling a legitimate business letterhead suitable for formal correspondence or PDF export. Optimize for small screens while maintaining realistic print proportions.`},{name:"LET THEM EAT CAKE",category:["HISTORICAL","FRENCH","ROYAL"],message:"Take a picture and transform the subject into a member of Marie Antoinette’s 18th-century French royal court. Dress the subject in elaborate Rococo-era court attire with silk fabrics, lace, ribbons, and embroidery. Apply period-accurate makeup including pale powdered skin, subtle rouge, and defined beauty marks. Add a tall, powdered white wig styled with curls and decorative ornaments. Preserve the subject’s facial features while placing them in an elegant Versailles-style interior with soft lighting and refined posture. The final image should resemble a formal aristocratic court portrait from late 18th-century France."},{name:"LIGHT",category:["ABSTRACT","GLOWING","LUMINOUS"],message:"Take a picture and have everything made of light.  Varied colored lights with a glowing, ethereal, radiant effect."},{name:"LIMERICK",category:["POETRY","HUMOR","TEXT","MASTER PROMPT"],message:"Take a picture and transform the scene into a playful, cartoon-style illustration with exaggerated shapes, expressive features, and bright, cheerful colors. Use flavor text inspired by the subject’s appearance, pose, clothing, and surroundings to create a humorous limerick. Place the complete limerick clearly and fully visible beneath or alongside the cartoon image, ensuring all five lines are readable and unobstructed. The text should feel integrated into the cartoon design, such as on a sign, speech panel, or decorative text box. Maintain a lighthearted, whimsical tone throughout the final image.  The result should be a full view of the illustration with a relevant background behind the illustration."},{name:"LINE DRAWING",category:["ART","SKETCH","MINIMAL"],message:"Take a picture and convert the image into a hand-drawn line illustration. Black ink only, no color or shading. Clean white background with expressive line weight."},{name:"LINOLEUM PRINT",category:["ART","PRINT","CARVED"],message:"Take a picture and transform the image into a linoleum block print. Organic carved textures. Flat ink colors."},{name:"LITE-BRITE",category:["TOY","RETRO","GLOWING"],message:`Take a picture and recreate the subject as a Lite-Brite pegboard artwork displayed inside a physical Lite-Brite toy frame. The entire toy should be visible, including the dark backing, grid of holes, and colorful glowing pegs, so it appears as a photographed Lite-Brite rather than a digital overlay.

Transform the subject entirely using the Lite-Brite peg layout: the subject’s shape, facial features, and key details must be composed only of circular light pegs aligned to the pegboard grid. Do not use lines, shading, or any elements outside the peg layout to define the subject.

Use bright, saturated colors for each peg with subtle glow and soft bloom to emulate the light pegs. Simplify details as necessary to maintain recognizability while fully adhering to the pegboard constraints.

Keep the composition centered and uncluttered. Avoid text or extra graphics. The final image should feel tactile, nostalgic, and clearly readable on a small screen, looking like a true physical Lite-Brite creation.`},{name:"LIVING TATTOO",category:["TATTOO","BODY ART","INK","MASTER PROMPT"],message:"Take a picture and transform the subject into a realistic tattoo design as if the image itself has been tattooed onto skin. Reinterpret the subject as linework, shading, and ink textures while preserving recognizable facial features, pose, and personality. Render the subject using authentic tattoo styles such as fine-line blackwork, illustrative shading, stippling, or limited-color ink with bold linework and strong contrast. Avoid photorealism—everything should read clearly as tattoo art, not a photo. Place the tattoo naturally on a realistic skin surface (e.g., forearm, upper arm, shoulder, calf, or back), following proper body curvature, muscle flow, and skin texture. Include realistic ink characteristics such as slight bleed, skin texture with visible pores and hair follicles, natural redness around fresh ink, and subtle shading variations. Ensure the tattoo integrates organically with the skin—correct perspective, natural stretching, soft shadowing, and seamless edges—without looking pasted or flat. The tattoo may include optional framing elements like banners, borders, decorative flourishes, dates, small symbols, or brief text captions if contextually appropriate. Optimize for small screens with clean composition and clearly readable details. The final image should look like a professional tattoo artist's finished work—convincing, stylized, and something someone would actually get inked."},{name:"LOGO FROM TEXT",category:["DESIGN","LOGO","BRANDING","MASTER PROMPT"],message:`Take a picture and extract prominent readable word(s) from the source image. Use only the extracted word or concept as inspiration to generate a simple, professional logo symbol that visually represents the meaning of the word rather than its letterforms. For example, if the extracted word is an animal, object, or concept, depict a clean symbolic representation of that subject.

Limit logo generation strictly to the extracted source text. Do not transform, symbolize, or reinterpret any externally appended or supplemental text.

If additional text such as a name, address, phone number, or tagline is provided externally, render that text as literal, readable typography arranged neatly beneath or beside the logo symbol. Maintain clear separation between the logo mark and supporting text.

Apply a minimal, modern design style suitable for headers or branding: balanced proportions, restrained color usage, and clear negative space. Avoid illustrative complexity, mascots, or decorative effects. The final result should resemble a legitimate logo-and-header lockup suitable for professional use.`},{name:"LONG EXPOSURE",category:["PHOTOGRAPHY","MOTION","BLUR"],message:"Take a picture and apply long-exposure photography style. Light trails, motion blur on moving elements. Static subject remains sharp."},{name:"LOST AND FOUND",category:["HUMOR","POSTER","MISSING","MASTER PROMPT"],message:"Take a picture and transform it into a humorous lost-and-found poster. Present the subject as the missing item or person, framed in a simple poster layout with bold headings and tear-off–style design cues. Generate playful descriptive flavor text based on the subject’s appearance, clothing, expression, or surroundings, incorporating any externally provided details naturally. The tone should be clearly humorous and lighthearted. Ensure all text is fully visible and readable, and the subject remains recognizable. Render the final image with realistic paper texture, casual lighting, and authentic public-notice styling."},{name:"LOST IN TRANSLATION",category:["HUMOR","SCENE","INTERACTION","ABSURD"],message:`Take a picture of the subject interacting with a sign, menu, instructions, or written content that is completely confusing, absurd, or unintelligible.

The subject’s expression and posture must match confusion, frustration, or comedic misunderstanding.

The text or signs must appear naturally in the scene — realistic scale, perspective, shadows, and lighting consistent with the environment.

The final image should look like a real photograph of the subject in a humorous, absurd situational moment without digital overlays or floating text.`},{name:"LOST PET",category:["HUMOR","POSTER","PARODY"],message:`Take a picture and transform the subject into the focus of a classic lost pet flyer.

Present the image as a full, vertically oriented paper flyer taped or stapled to a public surface such as a telephone pole, bulletin board, or wall. The entire flyer must be fully visible within the frame, including margins, tape, and pull tabs at the bottom.

Render the subject as the missing ‘pet’ — even if the subject is clearly not an animal. The subject should appear naturally integrated into the photo area of the flyer, cropped or posed the way lost pet photos typically are.

Include the following flyer elements in a photocopied, black-and-white or faded color style:
• Large headline: "LOST PET" or "HAVE YOU SEEN THIS PET?"
• A short, humorous description based on the subject’s appearance, posture, clothing, or expression (e.g., "Easily distracted," "Responds to snacks," "Last seen avoiding responsibility")
• A vague or absurd last-seen location inspired by the scene or subject
• A reward that is comically low, oddly specific, or useless (e.g., "$7," "half a sandwich," "emotional closure")
• Tear-off phone number tabs along the bottom with repeated, generic numbers (not readable real phone numbers)

All text should feel hastily written or cheaply printed, like a real neighborhood flyer. If external master prompt text is provided, incorporate it naturally into the description, reward, or headline.

The tone should be dry, deadpan, and immediately readable as a joke. The final image should look like a real lost pet poster at first glance — then land the humor on closer inspection.`},{name:"LOUSY T-SHIRT",category:["HUMOR","RETRO","APPAREL","POP CULTURE"],message:`Take a picture and transform the subject so they appear to be wearing a souvenir-style t-shirt with a classic tourist-shop design.

The t-shirt should feature the phrase: “My friend went to [CITY] and all I got was this lousy t-shirt.” Use a city name and friend’s name provided via external master prompt. If none is provided, randomly select a well-known city and use a generic phrase without a name.

Design the shirt using common souvenir t-shirt aesthetics appropriate to the chosen city. Examples include:
• bold block lettering
• playful or cheesy fonts
• city skyline silhouettes
• landmark illustrations
• stars, flags, or decorative borders
• exaggerated colors or slightly faded screen-print ink

The design should look like it was purchased at a tourist gift shop — slightly tacky, mass-produced, and proudly obvious. The print should appear realistically applied to the fabric with natural folds, wrinkles, lighting, and slight distortion from the shirt’s movement.

Ensure the shirt fits naturally on the subject’s body and matches perspective, lighting, and fabric texture. The text must be fully visible and legible on a small screen.

Avoid modern minimalist branding or luxury fashion aesthetics. The final image should feel humorous, nostalgic, and unmistakably like a real souvenir t-shirt someone actually owns.`},{name:"LOVE ACTUALLY",category:["MASTER PROMPT","MOVIES","ROMANCE","SIGNS"],message:"Take a picture and create a cinematic two-panel composition where the subject communicates an emotional message using handwritten signs. Preserve clear facial likeness and identity while presenting the subject in a quiet, sincere moment. Design constraint: Render a single image split into exactly two side-by-side panels of equal size. In each panel, show the subject holding one handwritten sign facing the viewer. Limit the total number of signs to a maximum of two, with one short line of text per sign. Do not imply motion, animation, or time-based progression. Primary information source: If message text is provided via externally supplied details, divide the message across the two signs. Ensure the wording is original, natural, and emotionally resonant, and does not reference or recreate any specific copyrighted scene, dialogue, or characters. Secondary enhancement: If no message text is provided, infer a gentle, original two-line message based on the subject’s expression and context. Optimize the layout for small screens with bold, high-contrast handwritten text, clean spacing, and minimal clutter. Use soft, cinematic lighting, shallow depth of field, and a warm, intimate tone. Maintain an original setting and composition. Do not add additional panels, cards, or text beyond the two signs."},{name:"LOW POLY",category:["3D","GEOMETRIC","GAMING"],message:"Take a picture using very low-poly modeling use minimal detail, faceted surfaces, and angular edges."},{name:"MACRO",category:["PHOTOGRAPHY","CLOSE UP","DETAILED"],message:"Take a picture and transform the image into macro photography. Extreme close-up detail. Shallow depth of field, high texture clarity."},{name:"MACY'S PARADE BALLOON",category:["INFLATABLE","POP CULTURE","HUMOR"],message:`Take a picture and transform the subject into a giant inflatable parade balloon, like those seen in a Macy’s-style parade. Render the subject fully in balloon form — all features, including hair, clothing, and accessories, should appear as smooth, glossy, inflated balloons. Use tubular, rounded, or segment-like shapes typical of balloon sculpture. Exaggerate facial features slightly for comedic effect while keeping the subject recognizable.

Include parade context: ropes, handlers, and a city street environment to show scale. Ensure the balloon is fully visible, oversized, and clearly readable on a small screen. Use bright colors, subtle reflections, and soft highlights to reinforce the balloon material. The final image should feel absurdly playful, humorous, larger-than-life, and unmistakably made of balloons.`},{name:"MAD MAGAZINE",category:["HUMOR","SATIRE","CARICATURE"],message:"Take a picture and transform the subject into a classic Mad Magazine-style caricature. Preserve the subject’s recognizable facial features and personality while exaggerating key traits with over-the-top humor: enlarged head, expressive eyes, exaggerated expressions, and comically small or distorted body. Include irreverent, satirical flavor text, visual gags, and props that parody everyday life or pop culture. Bold linework, bright colors, and chaotic, playful composition. Ensure the subject is clearly identifiable within the humorous scene."},{name:"MADAME TUSSAUDS",category:["HUMOR","PORTRAIT","STATUE"],message:`Take a picture and transform the subject into a clearly identifiable WAX FIGURE displayed inside a Madame Tussauds–style museum.

The subject must NOT appear as a real person. The skin should look like wax: slightly glossy, smooth, subtly translucent, and unnaturally perfect. Facial features should appear rigid and frozen, with glassy, unfocused eyes and an expression that looks sculpted, not alive.

Include unmistakable wax museum indicators such as:
• A small name plaque or museum placard near the figure
• Velvet ropes, stanchions, or glass barriers
• Reflections and highlights consistent with wax under indoor museum lighting
• Visible seam lines near the hairline, neck, or wrists where wax molds meet

The subject’s hair should look sculpted and immobile, like molded wax strands. Hands and fingers should appear stiff and posed unnaturally.

DO NOT:
• Make the subject look alive or candid
• Use soft skin texture or natural pores
• Create a normal portrait

The final image must look like a photograph taken inside a wax museum, where the subject is unmistakably a wax replica and not a living person.`},{name:"MAGIC EYE",category:["ILLUSION","STEREOGRAM","3D"],message:`Take a picture and transform it into a single-image autostereogram (Magic Eye–style illusion). Encode the subject’s shape and depth into a repeating patterned texture so the image appears abstract at first glance but reveals the subject when viewed with relaxed or unfocused eyes.

Use a dense, repeating pattern with subtle depth cues that form the subject’s silhouette and major features in three dimensions. Do not include outlines, labels, or hints. The subject should not be immediately obvious without proper viewing.

Ensure the pattern is clean, evenly tiled, and centered. The final image should resemble a classic Magic Eye print that is visually stable and readable on a small screen.`},{name:"MAGICIAN FAIL",category:["HUMOR","MAGIC","ILLUSION","DISASTER"],message:`Take a picture of the subject and transform them into a stage magician during a deliberately staged magic illusion that is going humorously wrong.

IMPORTANT SAFETY CONTEXT:
• This is a theatrical magic performance
• No real injury, harm, or danger is occurring
• All failures are clearly illusion-based and harmless

The subject wears classic magician attire such as a tuxedo, cape, vest, or top hat.

Examples of comedic illusion failures include:
• A magician awkwardly stuck in a prop box with exaggerated, cartoonish frustration
• A clearly fake 'sawed-in-half' illusion where the separation is obviously theatrical and impossible (visible fake compartments, exaggerated gaps)
• A levitation trick where harmless stage supports are plainly visible
• A rabbit escaping the hat while the magician reacts in disbelief
• A disappearing act where only a costume piece vanishes

The failure must be unmistakable but clearly non-dangerous and played for comedy.

Include humorous visual cues such as:
• Overacted panic or embarrassment
• Assistants reacting dramatically but unharmed
• Audience laughing or gasping theatrically

Lighting, stage props, curtains, and spotlights should match a live stage performance.

The final image should look like a staged performance photograph capturing a slapstick moment of illusion failure — exaggerated, absurd, and clearly safe.`},{name:"MAGNUM CONTACT SHEET",category:["PHOTOGRAPHY","DOCUMENTARY","JOURNALISM","CONTACT SHEET"],message:`Take a picture and transform it into a Magnum Photos–style contact sheet from a documentary photo shoot.

CORE STRUCTURE:
• The final image must be a full contact sheet
• Multiple small rectangular frames arranged in a grid
• Visible film borders between frames

SUBJECT APPEARANCE:
• The subject must appear in MANY frames
• Slight variations in pose, expression, movement, or timing
• Some frames awkward, blurry, off-balance, or transitional

PHOTOGRAPHIC STYLE:
• Black-and-white photography
• Documentary realism
• Natural lighting only
• Imperfect exposure and focus variation

EDITORIAL MARKINGS:
• Include grease-pencil or marker edits:
  – Circles
  – X marks
  – Crop lines
• One or two frames should be clearly "selected" as the best shot

COMPOSITION RULES:
• Frames should feel sequential, as if moments apart
• The subject should appear candid, not posed
• Environment must remain consistent across frames

TEXT & DETAILS:
• Optional handwritten frame numbers
• Optional date or roll number
• Handwritten notes may appear in margins

ABSOLUTE PROHIBITIONS:
• NO single-image presentation
• NO polished final-photo look
• NO modern digital UI elements

FINAL RESULT:
The image must look like a real Magnum photographer’s contact sheet — raw, observational, imperfect, and revealing the process of capturing a meaningful moment involving the subject.`},{name:"MANDELA EFFECT",category:["HUMOR","HISTORY","PARADOX"],message:`Take a picture and transform the subject into a scene depicting a well-known Mandela Effect misremembered version of reality.

SELECT ONE SCENARIO:
• Subject as Henry VIII eating a turkey leg
• Subject as Mr. Monopoly wearing a monocle
• Subject holding Jiffy peanut butter
• Subject eating Fruit Loops cereal
• Subject watching Looney Toons
• Subject reading Berenstein Bears
• Subject holding Oscar Meyer wieners
• Subject viewing a map with New Zealand northeast of Australia
• Subject eating Double Stuff Oreos
• Subject holding Kit-Kat chocolate
• Subject holding Cheez-Itz box
• Subject holding a Curious George doll with a tail
• Ed McMahon handing the subject a Publishers Clearing House check
• Subject wearing Sketchers shoes
• Subject spraying Febreeze

CORE RULE:
• The incorrect version must be presented as completely normal
• No explanation or acknowledgment of error

FINAL RESULT:
The image should confidently depict the wrong version of reality as if it were always correct.`},{name:"MARGARET KEANE",category:["ART","PAINTING","ARTIST","PORTRAIT","BIG EYES"],message:`Take a picture and transform it into a stylized painted portrait featuring dramatically oversized, expressive eyes.

STYLE CHARACTERISTICS:
• Eyes are very large, glossy, and emotionally intense
• Prominent highlights give the eyes a luminous, soulful appearance
• Facial features are softly simplified and delicate
• Head slightly tilted with a wistful or contemplative expression

PAINTING STYLE:
• Smooth painterly texture
• Soft blended edges
• Muted or pastel color palette
• Gentle, atmospheric lighting
• Hair painted with flowing, delicate strokes

BACKGROUND:
• Minimal or softly abstracted to emphasize the face

The final image must clearly resemble a vintage mid-century expressive portrait painting focused on emotion and oversized eyes, not photorealism.`},{name:"MARIONETTE PUPPET",category:["TOY","PUPPET","STRINGS"],message:"Take a picture and transform the subject into a handcrafted marionette puppet. Preserve recognizable facial features, expressions, proportions, and clothing identity, adapted into carved wood, painted surfaces, stitched fabric, and jointed limbs. Visible strings extend upward from the limbs and head to a wooden marionette controller held above the frame or partially visible. The puppet must show realistic wear, grain, seams, and articulation points. Studio or theatrical lighting with shallow depth of field. The subject must clearly remain the same individual, now reimagined as a controlled puppet."},{name:"MASCOT",category:["SPORTS","CHARACTER","COSTUME"],message:`Take a picture and transform the subject into a realistic, full-body sports team mascot costume. The mascot must appear as a physical, wearable suit with a large oversized mascot head, visible seams, plush or foam textures, and costume proportions typical of real stadium mascots.

Preserve the subject’s recognizable traits by translating facial characteristics into the mascot head design, not by using the real face. Eyes, mouth, and expression should be part of the costume head.

Use photoreal lighting and materials so the mascot looks like a real person wearing a professional mascot suit, not a cartoon or illustration. Place the mascot in a stadium, field, or arena environment.

Ensure the full mascot body is visible and properly proportioned. The final image should look like a real sports mascot photographed during a live event.`},{name:"MATRIX",category:["MOVIES","SCI FI","CODE"],message:"Take a picture and transform the entire image into the style of the Matrix. Render the subject, background, and all elements as falling green Matrix code (digital rain), so that the person is fully made of glowing vertical code lines. The subject should remain recognizable in silhouette and pose, but composed entirely of streaming green characters, symbols, and binary-like patterns. Include motion blur and glowing highlights consistent with the iconic Matrix digital rain aesthetic. The scene should look like a fully immersive digital world, no natural textures, only cascading green code forming the subject and environment. Emphasize neon-green glow, high contrast, and a cinematic cyberpunk feel."},{name:"MAYHEM",category:["HUMOR","CHAOS","ABSURD"],message:"Take a picture and transform the scene into an outrageously funny visual scenario centered on the subject. Use exaggerated scale, unexpected objects, absurd logic, and chaotic interactions to create instant visual comedy. Preserve the subject’s recognizable face and identity while placing them in a situation that is wildly implausible yet visually coherent. The humor should be obvious at first glance, relying on visual absurdity rather than text, jokes, or captions. Push the scene to the edge of chaos while maintaining clear lighting, sharp detail, and readable composition."},{name:"MEDIEVAL KNIGHT",category:["HUMOR","HISTORICAL","FANTASY","MEDIEVAL"],message:"Take a picture and transform the subject into a medieval knight in full plate armor. Place them in a medieval castle courtyard or battlefield setting. Include authentic armor details like chainmail, helmet with visor, sword, shield with heraldic design, and royal banner. Preserve the subject's facial features visible through an open visor. Use dramatic medieval lighting, castle stone architecture, and period-appropriate atmosphere. Make it photorealistic as if the subject actually traveled back to medieval times. Include details like weathered metal, leather straps, and battle-worn equipment."},{name:"MEME",category:["HUMOR","INTERNET","TEXT","MASTER PROMPT"],message:"Take a picture and make it into a MEME, adding ironic humor and flavor text inspired by the content of the image. Clean composition with readable typography.  The result should be a full view of the meme."},{name:"MERMAID",category:["FANTASY","CREATURE","UNDERWATER"],message:"Take a picture and transform the subject into a realistic mermaid. Preserve the subject’s recognizable facial features, expressions, body proportions, and personality while adapting the lower body into a natural, anatomically believable fish tail with detailed scales and fins. The subject wears ocean-appropriate, functional aquatic attire designed for a mermaid, integrated naturally with the anatomy. Create a photorealistic underwater environment with flowing hair, suspended particles, coral reefs, and aquatic life. Use realistic underwater lighting with sunlight rays filtering through the water, emphasizing scale, depth, and immersion. The subject must appear fully native to the underwater world, not costumed."},{name:"MESOPOTAMIAN RELIEF",category:["ART","ANCIENT","MIDDLE EASTERN"],message:"Take a picture and Transform the image into a Mesopotamian bas-relief style. Flatten forms, use profile poses, and emphasize symbolic gestures. Apply sandstone textures and ancient ornamental borders."},{name:"METAL SCULPTURE",category:["ART","METAL","MODERN","SCULPTURE"],message:`Take a picture and transform the subject into a modern abstract metal sculpture. The subject should be constructed from welded metal pieces - steel plates, curved sheets, angular fragments, metal rods, and geometric forms all assembled together. Use brushed steel, rusted iron, oxidized copper, and weathered bronze surfaces with visible welds, seams, and rivets.

The sculpture should have an industrial, contemporary art feel with bold geometric shapes, flowing curves, and dynamic angles that suggest the subject's form and pose without literal representation. Include negative space and cutouts within the metal structure. Show the sculptural mass as solid, heavy metalwork with thickness and weight.

Surfaces should display authentic metal textures: brushed finish with directional grain, rust patina with orange and brown oxidation, verdigris green copper aging, polished reflective sections, and rough hammered areas. Include realistic weathering, scratches, and industrial fabrication marks.

Place the sculpture in an appropriate setting: museum gallery with spotlights, outdoor plaza, sculpture garden, or contemporary art space. Use dramatic lighting that creates strong highlights on polished metal surfaces and deep shadows in recesses. Show metal's reflective properties catching light.

The sculpture should be clearly recognizable as the subject through its overall form, proportions, and gesture, but rendered as an abstract modernist metalwork piece - an artistic interpretation rather than realistic statue. Make it look like a photograph of an actual large-scale metal sculpture by a contemporary artist, with impressive craftsmanship and artistic vision.`},{name:"METRIC SYSTEM IS FAKE",category:["ABSURD","SYSTEMS","COMEDY","SURREAL REALISM"],message:`Take a picture and transform the scene so that the metric system clearly exists but is fundamentally incorrect.

CORE CONCEPT (CRITICAL):
• The metric system is officially used everywhere
• Measurements are labeled, enforced, and respected
• However, the units make no physical sense

METRIC ABSURDITY RULES (CRITICAL):
• Objects are labeled with metric measurements that contradict reality
• Examples:
  – A coffee cup labeled '12 meters'
  – A doorway marked '0.4 kilograms tall'
  – A room measured in liters
  – A distance measured in Celsius
• Labels must appear official and standardized

SYSTEM CONSISTENCY:
• Everyone treats these measurements as normal
• Signs, tags, instruments, or markings reinforce the fake system
• No one reacts with confusion

SUBJECT BEHAVIOR:
• The subject interacts naturally with the environment
• No comedy posing or reaction
• The absurdity is systemic, not acknowledged

VISUAL PRESENTATION:
• Measurements should be clearly readable
• Units must be precise, not vague
• No mixing with imperial units

LIGHTING & CAMERA:
• Neutral, documentary-style framing
• Clean, legible composition
• Focus on clarity over drama

TONE:
• Deadpan
• Bureaucratic absurdity
• Feels like an official world with a broken foundation

FINAL RESULT:
The final image must look like a real place governed by a metric system that is internally accepted but physically wrong. The humor should come from the seriousness with which nonsense is enforced — calm, official, and deeply incorrect.`},{name:"MEXICAN MURALISM",category:["ART","PAINTING","MEXICAN","MURAL"],message:"Take a picture and transform the image into Mexican muralism style art. Bold figures, narrative storytelling, strong outlines, social symbolism, and monumental composition."},{name:"MICHELIN MAN",category:["HUMOR","TRANSFORMATION","TIRE","MASCOT"],message:"Take a picture of the subject and transform their entire body into a Michelin Man-style figure made of stacked white tires, while preserving the subject’s recognizable facial features, body proportions, and pose. The tires should follow the contours of their limbs and torso, with arms, legs, and head shaped to match the subject. Include realistic tire textures, tread patterns, and slight compression where tires stack, but let the subject’s identity shine through. The figure should look jolly and friendly, in a fitting setting like a tire shop, racetrack, or mascot event. Lighting should emphasize the white tire material while keeping the subject recognizable. Make it feel like a photograph of a real Michelin Man costume or sculpture based on the subject, not a generic mascot."},{name:"MIKE JUDGE ME",category:["CARTOON","SATIRE","RETRO","POP CULTURE"],message:`Take a picture and transform the subject into an animated character placed directly inside a scene from the world of Mike Judge cartoons.

Render the subject in a Mike Judge–style character design: slightly awkward proportions, stiff posture, minimal facial expression, uneven line work, flat cel-shaded colors, and intentionally plain or unflattering details. Preserve the subject’s recognizability while adapting them fully into the cartoon style.

Place the subject INTO a recognizable Mike Judge cartoon scene, selected based on context or randomly. The scene should clearly reflect one of the following shows and environments, and may include recognizable characters from that show:

• King of the Hill — suburban Arlen, Texas (backyard fence chats, alleyways, living rooms, Strickland Propane). Characters may include Hank Hill, Peggy, Bobby, Dale, Bill, or Boomhauer.
• Beavis and Butt-Head — grimy neighborhood streets, living room couch, fast-food joints, school hallways. Characters may include Beavis, Butt-Head, or classmates reacting to the subject.
• Daria — school hallways, classrooms, coffee shops, or suburban interiors. Characters may include Daria, Jane, Quinn, or classmates observing the subject.
• Office Space–style environment — dull corporate office, cubicle farms, break rooms, printer destruction areas. Characters may include bored coworkers or management-style figures inspired by the film’s tone.

Existing characters should appear as supporting or background characters interacting with or reacting to the subject. The subject should feel like a guest character awkwardly dropped into the episode, not replacing anyone.

Adapt the subject’s clothing into simplified everyday outfits typical of Mike Judge cartoons — plain t-shirts, polos, jeans, boring office attire, or aggressively normal suburban clothing.

Use muted, slightly washed-out color palettes, flat lighting, and simple painted backgrounds. Avoid exaggerated animation, flashy effects, or glossy textures.

Ensure the full scene is visible and readable on a small screen, with the subject clearly identifiable among the characters. The final image should feel like a freeze-frame from an actual Mike Judge episode — dry, awkward, observational, and quietly brutal.`},{name:"MILK CARTON",category:["HUMOR","MISSING","VINTAGE","MASTER PROMPT"],message:"Take a picture and place the subject on the side of a classic milk carton as a missing person feature. Design the carton with realistic packaging details, typography, and layout. Generate humorous descriptive flavor text for the missing person section based on the subject’s appearance, clothing, expression, or personality, incorporating any externally provided details naturally. Keep the tone playful and clearly fictional. Ensure the subject’s image is integrated naturally into the carton design and remains recognizable. Render the final image photorealistically with believable lighting, carton texture, and packaging realism."},{name:"MIME",category:["PERFORMANCE","COMEDY","FRENCH","STREET"],message:"Take a picture and transform the subject into a classic French mime performer. Apply full mime makeup - white face paint covering entire face and neck, black outlined eyes with exaggerated eyebrows drawn high on forehead, red or black lips painted in dramatic expression, beauty mark optional. Dress them in traditional mime costume: black and white horizontal striped shirt (marinière), black pants, black suspenders, white gloves, black beret. Show the subject frozen in an exaggerated mime pose - pretending to be trapped in an invisible box with hands pressed against imaginary glass walls, pulling an invisible rope, walking against invisible wind, or climbing invisible stairs. Their facial expression should be theatrical and over-dramatic. Place them in a street performance setting - cobblestone plaza, Parisian street scene, or park with small crowd watching. Include mime props if appropriate - invisible wall, trapped in box gesture, leaning on nothing. Use dramatic lighting and slight vignette for theatrical effect. The performance should be clearly pantomime with exaggerated physical comedy frozen mid-gesture. Make it look like a photograph of an actual street mime performance with that classic Marcel Marceau aesthetic and silent theatrical energy."},{name:"MINECRAFT",category:["GAMING","PIXEL","BLOCKY"],message:"Take a picture in the style of Minecraft. Blocky geometry, pixel textures."},{name:"MINIATURE SET",category:["MINIATURE","DIORAMA","MODEL"],message:`Take a picture and transform the entire scene into a handcrafted miniature diorama. Scale all subjects and objects to match the proportions of a physical miniature set, so they appear small and in proportion to each other. Render surfaces with handcrafted textures such as clay, painted wood, cardboard, fabric, or tiny props, giving the scene a realistic, tactile feel.

Use shallow depth of field, soft studio lighting, and subtle shadows to emulate macro photography of a real miniature model. Ensure the composition reads clearly, maintains visual depth, and feels like a meticulously constructed miniature set. Keep subjects and environment clearly recognizable and readable on small screens, with a handcrafted, physical toy-like aesthetic.`},{name:"MINIMALISM",category:["ART","SIMPLE","MODERN"],message:"Take a picture and transform the image into the Minimalism style. Simplify shapes, reduce color palette, and remove extraneous detail while keeping subject identifiable."},{name:"MINION MODE",category:["HUMOR","POP CULTURE","TRANSFORMATION"],message:`Take a picture and transform the subject into a small, yellow, gibberish-speaking cartoon minion.

Adapt the subject’s facial structure, expression, and personality into a simplified, rounded, toy-like character with yellow skin, large expressive eyes behind goggles, and a compact body. Preserve recognizable traits such as smile shape, eyebrow energy, or posture.

Dress the character in classic minion-style overalls or a similar worker outfit. Proportions should be exaggerated and playful, not realistic.

The environment should be simplified and colorful to match an animated comedy world. Lighting should be bright and cheerful.

Do not include text. The final image should feel mischievous, energetic, and immediately recognizable as a minion-style parody while remaining readable on a small screen.`},{name:"MIRROR WORLD",category:["ILLUSION","REFLECTION","SURREAL"],message:"Take a picture and create a mirrored reality where reflection differs from reality. Subtle narrative differences."},{name:"MONA LISA",category:["ART","CLASSIC","PARODY","PAINTING"],message:`Take a picture and transform the subject into the Mona Lisa painting.

Replace the Mona Lisa’s face with the subject, carefully adapting their facial features, expression, and posture to match the iconic pose, angle, and calm demeanor of the original artwork. The subject should feel painted into the scene, not pasted on.

Render the image in a classical Renaissance oil painting style with soft brushwork, subtle gradients, muted earth tones, and realistic canvas texture. Preserve the iconic background landscape, atmospheric depth, and lighting.

Gently adapt the subject’s hair or accessories into period-appropriate forms while maintaining recognizable traits (for example, modern glasses subtly reinterpreted as period-style frames).

Ensure the full painting is visible within the frame, including the subject, background, and edges of the artwork. The final image should feel like a museum-worthy reinterpretation — respectful, believable, and quietly humorous through contrast.`},{name:"MONDRIAN",category:["ART","GEOMETRIC","ARTIST","ABSTRACT"],message:"Take a picture and reinterpret it in the style of Piet Mondrian. Reduce the scene into a grid of bold black lines and flat blocks of primary colors with white space. Abstract the subject while maintaining a clear structural reference to the original composition. The final image should feel balanced, geometric, and modernist."},{name:"MONSTER",category:["HORROR","CREATURE","SCARY"],message:"Take a picture and transform the subject into a cinematic monster while preserving the subject’s recognizable facial structure, body proportions, and identity. Reimagine the subject with exaggerated, otherworldly features such as altered skin texture, enhanced musculature, claws, horns, scales, or glowing eyes, inspired by the subject’s original traits. Place the subject naturally into a dark, immersive environment that complements the creature’s design. Use dramatic lighting, shadows, and environmental interaction to ensure the monster appears physically present in the scene. Render in photorealistic detail with a powerful, intimidating atmosphere."},{name:"MOON",category:["SPACE","ASTRONAUT","SCI FI"],message:"Take a picture and place subject on the moon. Subject is wearing an astronaut suit. Subject face is visible through the helmet visor. The Earth is in the background. Make it photorealistic. Make it 8k resolution."},{name:"MORNING TALK SHOW",category:["HUMOR","TV","90S","DRAMA","SENSATIONAL"],message:"Take a picture and place the subject on a trashy 1980s-90s daytime talk show set as the victim or central figure in a sensationalist episode. Choose one of these iconic shows and match its specific style: MAURY POVICH (paternity test reveals, 'You ARE/ARE NOT the father!' graphics, women running backstage crying, Maury holding DNA results), MORTON DOWNEY JR. (confrontational 80s set, chain-smoking host, audience shouting matches, in-your-face aggressive style), GERALDO (chair-throwing brawls, nose-breaking fights, security rushing in, Geraldo in the middle of chaos), or JERRY SPRINGER (chanting audience 'JER-RY! JER-RY!', blonde security guard Steve breaking up fights, chair throwing, love triangles, surprise reveals). Show the subject sitting in the guest chair looking shocked, crying, angry, or dramatically emotional while the scandal unfolds. The set should match the chosen show's aesthetic: bright primary color blocking on walls, geometric patterns, cheap modular furniture, studio audience visible in tiered seating going wild - pointing, gasping, booing, cheering, chanting. Include the specific host with their signature style - Maury's concerned face, Morton's cigarette and aggression, Geraldo's mustache and brawler energy, or Jerry's amused detachment. Add on-screen graphics matching that show's style with sensationalist text. Include other guests in 90s fashion all in dramatic confrontation. Use harsh studio lighting, multiple cameras visible. Make it look like a freeze-frame from an actual episode of that specific show with maximum drama and chaos."},{name:"MOSAIC",category:["ART","TILE","COLORFUL"],message:"Take a picture in the style of a glass Mosaic. Small tiles, reflective surfaces."},{name:"MOTIVATIONAL CAT POSTER",category:["HUMOR","PARODY","OFFICE"],message:"Take a picture and transform the subject into a cat hanging from a tree branch for a motivational poster parody. Replace the subject's body with a cute kitten's body while preserving their face, show them gripping a branch with tiny paws, and include the classic 'HANG IN THERE!' text at the bottom. Use that distinctive 1980s motivational poster aesthetic with gradient background, inspirational font, and slightly faded photo quality as if it's been hanging in an office for decades."},{name:"MOUNT RUSHMORE",category:["LANDMARK","SCULPTURE","AMERICAN"],message:"Take a picture and make the subject face a carved head placed on Mount Rushmore. Make it photorealistic."},{name:"MOVIE SCENE INSERT",category:["MOVIES","CINEMATIC","MASHUP","MASTER PROMPT"],message:"Take a picture and place the subject inside a cinematic movie scene as if they were an original character in the film. Preserve the subject’s recognizable facial features, body proportions, clothing identity, and personality. Match the exact cinematography of the chosen movie including lens type, depth of field, film grain, color grading, lighting direction, production design, and era-accurate costuming if required. The subject must appear physically present in the scene with correct scale, shadows, reflections, and environmental interaction. The background, props, and atmosphere must be authentic to the movie’s world, making the subject indistinguishable from the original cast and fully integrated into the scene."},{name:"MR. POTATO HEAD",category:["TOY","RETRO","POTATO"],message:`Take a picture and transform the subject into a Mr. Potato Head–style toy.

Convert the subject into a smooth, potato-shaped plastic body with a slightly shiny, molded toy texture. The subject’s original human facial anatomy MUST NOT remain visible. All facial features (eyes, nose, mouth, ears, eyebrows) must be represented ONLY as removable Mr. Potato Head–style toy parts.

Important facial replacement rules:
• REMOVE the subject’s real nose, mouth, eyes, and ears entirely
• REPLACE them with toy-style plug-in parts mounted directly onto the potato surface
• Do NOT allow any human facial features to appear behind or beneath the toy parts
• Ensure correct positioning: the toy nose must sit centered above the toy mouth, with clear separation between parts

Arrange classic Mr. Potato Head components — eyes, eyebrows, nose, mouth, ears, arms, and optional accessories (hat, glasses, mustache) — snapped into visible peg holes or implied mounting points. Parts should feel modular, slightly misaligned, and intentionally toy-like, but never overlapping or duplicated.

Preserve the subject’s identity through:
• eye shape or spacing translated into toy eyes
• mouth expression adapted into a toy mouth
• accessories inspired by the subject (glasses, hat, etc.)

Maintain realistic toy scale, lighting, and soft shadows so the figure appears as a real physical plastic toy photographed in the real world.

Avoid cartoon drawing styles or painterly rendering. This must look like a tangible Mr. Potato Head toy, not an illustration.

Keep the composition clean and centered. Ensure the full toy is visible and clearly readable on small screens. The final image should feel nostalgic, playful, and unmistakably a Mr. Potato Head version of the subject — with no anatomical confusion.`},{name:"MUG SHOT",category:["HUMOR","MASTER PROMPT","POLICE"],message:`Take a picture of the subject and transform it into a realistic police-style booking photo (mugshot) without implying any real criminal behavior.

Background and framing: Place the subject against a height measurement wall with clear horizontal lines and markers. Use a neutral institutional backdrop. Camera angle should be straight-on with the subject facing forward in standard mugshot style.

Placard details: The subject holds a board displaying a whimsical ID number and date. Generate humorous or descriptive fictional text inspired by the subject's expression, clothing, or personality (examples: 'Stand-up Philosopher', 'Professional Procrastinator', 'Serial Cereal Eater'). Incorporate any externally provided master prompt text naturally.

Subject appearance: Hair, clothing, and expression may show slight comedic dishevelment or exaggerated personality traits. Expressions can be deadpan, silly, smirking, or exaggeratedly dramatic.

Lighting and quality: Use flat, institutional-style lighting typical of official ID photos, emphasizing facial features and photorealistic depth. Subtle imperfections (slight shadows, mild unevenness) may be included for realism.

The final image should look exactly like a genuine police-style booking photograph, preserving the subject's recognizable face, pose, and expression, but entirely safe, humorous, and fictional.`},{name:"MULTIPLICITY",category:["HUMOR","ABSURD","PHOTO EFFECT"],message:`Take a picture and transform the scene so the subject appears duplicated multiple times within the same frame.

Create several copies of the subject, each placed naturally into the environment with consistent lighting, scale, and perspective. The duplicates should feel like they coexist in the same moment rather than layered edits.

Each version of the subject should have a slightly different pose, expression, or attitude to suggest personality divergence — for example: confident, confused, bored, overexcited, distracted, or plotting.

Avoid obvious repetition. Vary posture, head tilt, facial expression, or interaction with the environment so each duplicate feels intentional.

Keep the composition readable on a small screen. Ensure no duplicate is cropped or partially hidden. The final image should feel funny, surreal, and immediately understandable — as if reality accidentally made too many copies of the same person.`},{name:"MULTIVERSE",category:["SCI FI","PARALLEL","ALTERNATE"],message:"Take a picture and create a parallel version of the same subject in a different reality. Parallel version is subtly different in style, clothing, or environment."},{name:"MUPPET",category:["PUPPET","TV","FELT"],message:`Take a picture and transform the subject into a Muppet-style puppet.

The subject must have felt skin, stitched seams, button or googly eyes, and exaggerated puppet proportions.

Include other recognizable Muppets or Sesame Street characters interacting naturally in the scene.

All characters must appear as physical puppets — not costumes or CGI characters.

Lighting should resemble a TV set or puppet stage.

The final image must look like a real behind-the-scenes Muppet production still.`},{name:"MUSEUM EXHIBIT",category:["MUSEUM","DISPLAY","EDUCATIONAL"],message:"Take a picture and present the subject as a museum exhibit on display. Place the subject behind glass or on a pedestal within a realistic museum gallery environment, with proper lighting, barriers, and signage. Generate an exhibit placard using descriptive or humorous flavor text inspired by the subject’s appearance, clothing, pose, or surroundings, incorporating any externally provided details naturally. The placard should include a title, short description, and optional faux historical or cultural context. Ensure the subject appears seamlessly integrated into the exhibit, with realistic scale, reflections, and museum ambiance. Render the final image photorealistically, as if photographed inside a real museum."},{name:"MUSICAL MOMENTS",category:["HUMOR","MOVIES","SCENE","MUSICAL"],message:`Take a picture of the subject and place them into a scene from a classic movie musical, such as *Grease*, *Footloose*, *Singin’ in the Rain*, or *The Sound of Music*.

The subject should be actively participating in the musical moment — dancing, singing, or dramatically posing — while fully integrated into the scene with background dancers, instruments, or choreography.

Costumes, props, lighting, and setting should match the original musical style and era.

Optional flavor text from the master prompt can influence the song, scene, or humorous twist (e.g., the subject missing a step, dramatically belting a line, or accidentally knocking over props).

The final image should look like a real movie still from the musical, cinematic, and humorous with the subject as the star.`},{name:"MYSTICAL",category:["FANTASY","MAGICAL","GLOWING"],message:"Take a picture and transform it into a realistic, detailed mystical world, where trees have faces and bioluminescent plants and objects light up."},{name:"MYTHOLOGY",category:["FANTASY","MYTHOLOGY","CREATURE"],message:"Take a picture and make the subject into a Greek or Roman mythological creature while preserving recognizable characteristics of the subject. Epic, classical atmosphere."},{name:"N64 BLUR FILTER",category:["RETRO","GAMING","90S","BLUR"],message:"Take a picture and transform it using a Nintendo 64–style blur and texture smoothing. Apply soft focus, smeared textures, and simplified geometry. Colors should feel slightly muddy but warm. The subject should look nostalgic and dreamlike, as if remembered from an old cartridge game."},{name:"NAPKIN DOODLE",category:["ART","DOODLE","MINIMAL","HUMOR"],message:`Take a picture of the subject and transform the scene into a pen doodle drawn on a paper napkin.

The napkin texture must be clearly visible, including folds, creases, embossed patterns, and uneven absorption of ink.

The subject should be drawn using simple, loose pen lines, stick-figure exaggeration, or quick caricature-style sketching.

Include casual doodle elements such as arrows, scribbles, crossed-out lines, coffee stains, or handwritten notes.

DO NOT create clean vector art or realistic shading.

The final image must look like a spontaneous doodle someone drew on a napkin at a restaurant.`},{name:"NAZCA LINES",category:["ANCIENT","MYSTERY","AERIAL","PERU","ARCHAEOLOGICAL"],message:"Take a picture and transform the subject into a massive Nazca Lines geoglyph in the Peruvian desert viewed from directly above. The subject's form should be recreated as an enormous ancient line drawing etched into the desert floor, visible only from aerial view. Use the characteristic Nazca Lines technique: shallow trenches carved into reddish-brown desert surface revealing lighter-colored ground beneath, creating bold continuous lines forming the subject's shape. The design should be simplified and stylized like authentic Nazca geoglyphs - geometric and recognizable but rendered in that distinctive ancient linear style with bold outlines and minimal interior detail. Show the massive scale - the geoglyph should span hundreds of feet across the arid desert plateau. Include authentic Nazca environment: reddish-brown desert soil, surrounding smaller geometric shapes and lines, trapezoids, spirals, and other mysterious markings nearby. Use aerial photography perspective as if photographed from aircraft, showing the Pan-American Highway cutting through the desert, surrounding barren landscape, distant mountains. The lines should appear ancient and weathered - slightly eroded edges, desert patina, centuries of age visible. Include the desert's characteristic patterns - wind-swept sand, sparse vegetation, rocky terrain. Show the mysterious precision of the lines - perfectly straight trenches, smooth curves, intentional design despite ground-level impossibility. Make it look like an actual aerial photograph of an ancient Nazca Lines geoglyph depicting the subject as a mysterious pre-Columbian ground drawing that has survived for over 1,500 years in the Peruvian desert."},{name:"NEGATIVE SPACE",category:["ART","MINIMAL","SILHOUETTE"],message:"Take a picture and use negative space to define the subject. Primary form emerges from absence rather than detail. Minimalist composition."},{name:"NEOCLASSICAL",category:["ART","PAINTING","CLASSIC"],message:"Take a picture and transform the image into Neoclassical style painting. Strong lines, realistic proportions, muted colors, classical architecture or drapery elements, and dignified subject presentation."},{name:"NEOLITHIC CAVE PAINTING",category:["ART","ANCIENT","PREHISTORIC"],message:"Take a picture and transform the image into a prehistoric cave painting. Render the subject using simplified, abstracted shapes, ochre and charcoal colors, and textured rock surfaces. The subject should remain identifiable while blending with ancient cave wall aesthetics."},{name:"NEON SIGN",category:["NEON","GLOWING","URBAN"],message:"Take a picture and transform the subject into a glowing neon sign. Recreate the subject’s silhouette, facial features, and defining characteristics using luminous neon tubing and light trails, while keeping the subject clearly recognizable. Use vibrant neon colors with realistic glow, reflections, and light bleed against a dark or urban-inspired background such as brick, concrete, or night scenery. Arrange the neon lines as if they were hand-bent glass tubes, with subtle imperfections and mounting hardware for realism. Render the final image with crisp detail, strong contrast, and a striking nighttime atmosphere."},{name:"NESTING DOLLS",category:["HUMOR","TRANSFORMATION","OBJECT","CULTURAL"],message:"Take a picture of the subject or subjects and transform them into a set of Russian-style nesting dolls (matryoshka dolls). Each doll should be a carved and painted wooden figure, with the largest on the outside and smaller dolls nested inside. The subject’s facial features must be fully integrated as if hand-painted on the wooden surface — no photographic face overlays, no floating heads. Simplify features in traditional matryoshka style, with decorative clothing and patterns painted onto the wood. Show realistic wood grain, brush strokes, and glossy lacquer finish. Optionally depict dolls partially opened to reveal smaller dolls inside. The final image must look like an actual photograph of real wooden nesting dolls, with the subject’s likeness authentically rendered as painted decoration on the wood."},{name:"NEWSPAPER",category:["NEWS","VINTAGE","MASTER PROMPT","TEXT","PRINT"],message:"Take a picture and Transform the image into a newspaper print. Halftone dots, grayscale ink. Newsprint texture. Include flavor text headline and story text inspired by the content of the image. The result should be a full view of the newspaper page with the newspaper header and date visible with a relevant background behind the newspaper."},{name:"NIGHTHAWKS",category:["ART","PAINTING","AMERICAN REALISM","HISTORICAL"],message:`Take a picture and transform it into the style of Edward Hopper’s painting Nighthawks (1942).

CORE REQUIREMENT:
The subject must REPLACE one of the human figures inside the diner without removing or cropping the rest of the scene.

POSITION LOCK (CRITICAL FIX):
• The subject MUST be located INSIDE the diner interior, behind the glass
• The subject may NOT appear on the sidewalk, street, exterior reflection, or outside the diner
• The subject must occupy the exact spatial position of an original interior figure

SUBJECT INTEGRATION:
• The subject becomes one diner patron or the bartender.
• Preserve Hopper’s original body pose, posture, and placement for that figure.
• Replace only the face (and optionally subtle hands/arms if visible) with the subject’s likeness, adapted to Hopper’s painted anatomy.
• The subject must feel emotionally detached, distant, or introspective.
• Keep the subject naturally integrated, proportionally scaled, and visually coherent with the rest of the figures and environment.

SCENE PRESERVATION (CRITICAL):
• Maintain the full diner interior, including all other patrons, the bartender, furniture, counters, stools, and décor.
• Preserve the exterior street, sidewalk, and urban emptiness visible through the windows.
• Keep all original compositions, geometry, and placement of characters and objects.
• Do NOT remove, crop, or replace any other elements aside from the single figure chosen for substitution.

STYLE & MEDIUM:
• Oil painting on canvas.
• Smooth but visible brushwork.
• Muted, controlled color palette.
• No photographic realism.
• No cartoon stylization.

LIGHTING (CRITICAL):
• Strong interior fluorescent diner light.
• Exterior street remains dark, empty, and quiet.
• Sharp contrast between interior warmth and exterior isolation.

COMPOSITION RULES:
• Preserve the original Nighthawks layout:
 – Corner diner.
 – Large glass windows.
 – Empty street.
• No additional people.
• No modern objects.

EMOTIONAL TONE:
• Loneliness.
• Stillness.
• Urban isolation.
• Suspended time.

ABSOLUTE PROHIBITIONS:
• Do NOT modernize the scene.
• Do NOT add extra figures.
• Do NOT exaggerate expressions.
• Do NOT break Hopper’s geometry.

FINAL RESULT:
The image must look like a faithful Hopper oil painting where the subject appears as if they were always part of Nighthawks — quiet, distant, and frozen in time — while the rest of the diner and exterior remain fully intact, unaltered, and visually consistent.`},{name:"NIGHT VISION",category:["PHOTOGRAPHY","GREEN","MILITARY"],message:"Take a picture and transform the image into night vision style. Green monochrome, sensor noise."},{name:"NOT IT!",category:["HUMOR","SOCIAL","PHOTO EFFECT"],message:`Take a picture and transform the scene so it appears the subjects are playing the classic game of "Not It."

Analyze the number of visible subjects:
• If multiple subjects are present, show all but one touching their index finger to their nose in a synchronized, quick-reaction pose.
• One subject should clearly be "too late" — their finger either not yet touching their nose, hovering just short, or their hand still moving — making it obvious they are now "it."

Body language and facial expressions are critical:
• The non-it subjects should look relieved, smug, amused, or triumphant.
• The subject who is "it" should look surprised, annoyed, resigned, or caught off-guard.

Ensure everyone remains in the same moment in time, as if the action was frozen immediately after the call of "Not it!" No motion blur — clarity is more important than realism.

Do not add text, arrows, or labels. The concept must be communicated purely through pose, gesture, and expression.

Match lighting, perspective, and scale so the scene feels like a candid photo capturing a spontaneous social moment. Keep the composition readable on a small screen, with all hands and faces clearly visible.`},{name:"NURSERY RHYME STORYBOOK",category:["STORYBOOK","KIDS","LESSON"],message:`Take a picture and transform the subject into the main character of a classic nursery rhyme. Select the nursery rhyme based on the subject’s appearance, personality, posture, environment, or externally provided instructions.

Examples include, but are not limited to: Jack and Jill (subject as Jack or Jill), Little Miss Muffet (subject as Miss Muffet), Mary Had a Little Lamb (subject as Mary), Humpty Dumpty (subject fully transformed into Humpty), Old MacDonald Had a Farm (subject as Old MacDonald), Row Row Row Your Boat (subject rowing the boat), Jack Be Nimble (subject as Jack), Little Bo Peep (subject as Bo Peep), Little Boy Blue (subject as Little Boy Blue), or similar well-known rhymes.

Transform the subject accordingly so they appear fully integrated into the nursery rhyme world — not posing on top of it. Costumes, props, environment, and proportions should make the subject look like they belong inside the story.

Render the scene in a whimsical, illustrated storybook style with soft colors, painterly textures, gentle lighting, and classic children’s book charm. Avoid modern objects or settings unless intentionally playful.

Include the **title of the nursery rhyme** prominently and clearly at the top or bottom of the image. Display a **short, complete version of the nursery rhyme text** within the scene in large, legible lettering, styled like a storybook page. All text must be fully visible and readable.

The final image should resemble a single open illustrated page from a nursery rhyme book, with the subject and all text fully contained within the frame, suitable for viewing on a small screen. The tone should be magical, nostalgic, and immediately recognizable.`},{name:"NUTCRACKER",category:["HUMOR","TRANSFORMATION","OBJECT","HOLIDAY"],message:`Take a picture of the subject and transform them into a classic wooden nutcracker figure.

The subject should appear as a rigid, carved wooden toy with jointed arms, a levered jaw, painted facial features, and a formal or military-style outfit.

Wood grain, paint wear, chips, and glossy varnish should be visible.

The mouth should appear hinged or mechanical, clearly identifying the figure as a nutcracker.

DO NOT make the subject look like a person in costume.

The final image must look like a real physical nutcracker figurine displayed upright.`},{name:"O’KEEFFE",category:["ART","PAINTING","ARTIST","ORGANIC"],message:"Take a picture and reinterpret it in the style of Georgia O’Keeffe. Simplify the subject into flowing organic forms with smooth gradients and soft transitions. Emphasize shape, color, and scale over detail. The final image should feel calm, intimate, and abstracted."},{name:"OBJECT MOSAIC",category:["ART","MOSAIC","TEXTURE"],message:"Take a picture and recreate the subject so that their entire face and body are constructed exclusively from hundreds or thousands of small physical objects such as coins, pennies, jellybeans, M&Ms, bottlecaps, beads, stones, buttons, or similar items. There must be NO visible skin, fabric, or underlying human form anywhere in the image. Every facial feature, contour, shadow, and body shape must be defined only by the placement, color, density, and orientation of the objects. From a distance, the subject must be clearly recognizable; up close, the image must resolve entirely into individual objects. Use realistic lighting, depth, and perspective so the objects cast shadows and feel physically present. Do not overlay or decorate a normal body — the objects themselves ARE the subject."},{name:"OBJECT WORLD",category:["TRANSFORMATION","SURREAL","ABSTRACT","ANTHROPOMORPHIC"],message:"Take a picture and transform the subject into a sentient anthropomorphic version of an inanimate object, while converting the entire world into that same type of object. First, determine what object best represents the subject based on their appearance, clothing, or context. The subject becomes that object while retaining their characteristics - their clothing colors/patterns become the object's colors and surface design, any text or logos on their outfit appear as labels or markings on the object, their facial expression translates to the object's 'face' (using natural features of that object type), their body proportions determine the object's shape and size. The entire environment must also be constructed from the same type of object - if subject becomes a car, the world is all cars; if a book, everything is books; if a bottle, all bottles; if furniture, all furniture pieces. Buildings, trees, ground, sky, other people - everything transforms into creative arrangements of that one object type. The objects should have personality and life while remaining recognizable as that object. Use photorealistic rendering with authentic material textures - metal, plastic, wood, glass, fabric depending on object type. Make it look like a parallel universe where this one object type has evolved into an entire functional ecosystem. Preserve the subject's identity through their object-form's unique colors, patterns, markings, and expressive features."},{name:"OLD MACDONALD HAD A FARM",category:["HUMOR","FARM","ANIMAL","TRANSFORMATION"],message:`Take a picture of the subject and create a photorealistic farm animal whose ORIGINAL ANIMAL HEAD DOES NOT EXIST.

Select exactly one farm animal: horse, pig, cow, sheep, goat, chicken, rooster, duck, goose, or rabbit.

COMPLETELY REMOVE THE ANIMAL’S HEAD AND SKULL. The animal’s original face, snout, beak, eyes, and mouth must NOT be visible anywhere.

Replace the animal’s entire head with the subject’s full human head — not just the face. The human head must be fully three-dimensional, volumetric, and anatomically attached to the animal’s neck as if it naturally grew there.

The subject’s human head must:
• Replace the animal’s head entirely
• Be correctly scaled to the animal’s body
• Connect seamlessly at the neck with realistic anatomy, skin transitions, fur/feather blending, and shadowing
• Match the animal’s head orientation, posture, and perspective

DO NOT:
• Paste, overlay, mask, or superimpose a photo
• Leave any part of the animal’s original head visible
• Place a human face on top of an animal face
• Create a collage or cutout effect

Optional animal features (ears, horns, wool, feathers) may appear BEHIND or AROUND the human head if anatomically plausible, but the animal’s face itself must be entirely gone.

The creature should be performing a normal farm activity (grazing, standing in a stall, pecking the ground, chewing cud, waddling, etc.) in a realistic farm environment such as a pasture, barn, coop, or muddy yard.

Lighting must be natural and consistent across the entire body and head.

The final result must look like a real photograph of a farm animal that somehow biologically evolved with a human head instead of an animal head — disturbing, absurd, and realistic, not edited or pasted.`},{name:"ONE SECOND BEFORE DISASTER",category:["HUMOR","DRAMATIC","SUSPENSE"],message:"Take a picture and depict the subject frozen in time exactly one second before a dramatic, chaotic, or humorous event occurs. Capture tension and anticipation in the subject’s pose and expression (for example: a falling object mid-air, a near collision, an imminent spill, or an unexpected surprise). Use cinematic lighting, motion cues, and environmental storytelling to make it obvious that something is about to happen, without actually showing the outcome."},{name:"OOMPA LOOMPA",category:["MOVIES","FANTASY","CANDY","CLASSIC","TRANSFORMATION"],message:`Take a picture and transform the subject into an Oompa Loompa character from the classic film, placing them in an iconic factory scene.

Transform the subject's appearance: reduce height to small stature, apply orange-tinted skin tone, style hair in distinctive manner (often green or unusual color), dress in white overalls with brown trim and shirt, knee-high socks, and black shoes. Preserve recognizable facial features while adapting to the distinctive look.

Place the subject in one of the famous factory locations: the chocolate waterfall and river area with candy mushrooms and edible landscape, the golden egg room with geese, the inventing room with experimental candy machines, the television chocolate room with equipment, or other whimsical factory settings filled with oversized candy, colorful pipes, fantastical machinery, and sweet-making equipment.

Surround the subject with other Oompa Loompas working in the factory or preparing to perform, all with matching appearance and costumes. Include the fantastical candy factory environment with vibrant colors, impossible proportions, whimsical industrial equipment, massive candy productions, and magical chocolate-making machinery.

The setting should capture the dreamlike quality of the factory: oversized candy elements, colorful pipes and machinery, sugar crystals, chocolate rivers, candy plants, lollipop trees, or other fantastical sweet-themed environmental details.

Lighting should have that slightly surreal, colorful quality of the original film - warm glowing light, candy-colored illumination, and the magical atmosphere of the factory.

Optional: Position subject as if about to perform or mid-performance of their famous moralizing musical number, with other Oompa Loompas in coordinated poses.

The final image should look like an actual still from the classic film - whimsical, colorful, slightly surreal, with the subject fully transformed and integrated into the magical candy factory world. Capture the fantastical, slightly uncanny charm of the original movie's aesthetic.`},{name:"OPERATION",category:["HUMOR","GAME","PARODY","DESIGN"],message:`Take a picture and transform it into the board-game Operation.

The final image must show the **entire game board fully visible** within the frame, viewed from above like a real tabletop game. Do not crop any part of the board.

Use a familiar Operation-style layout: a human body diagram with outlined cavities, exaggerated organs, bright colors, and clean, bold shapes. Replace the traditional game head with the subject’s head, adapted into a flat, illustrated style that matches the board aesthetic while remaining recognizable.

Integrate humorous, fictional items into the body cavities inspired by the subject’s traits or environment (e.g., snacks, phone, keys, coffee cup, tangled thoughts). Items should be cartoonish and clearly readable.

Include parody game elements such as:
• Stylized cavity outlines
• Plastic-board textures
• Simplified medical tools (tweezers, wires) as decorative elements
• Playful warning lights or buzz indicators (visual only, no text required)

This must be a humorous, original parody inspired by the classic game format.

Ensure colors are bold, shapes are clean, and all elements are readable on a small screen. The final image should feel like a ridiculous but believable board game someone could actually play.`},{name:"OPPOSITE SELF",category:["TRANSFORMATION","OPPOSITE","SWAP"],message:"Take a picture and transform the subject into their opposite self while preserving the subject’s recognizable facial structure, expressions, posture, and identity. Invert key physical characteristics in a realistic and anatomically plausible way, such as body type and gender presentation, while maintaining the subject’s personality and essence. Adapt facial features, body proportions, hair, and clothing naturally to fit the transformed appearance. Ensure the subject remains clearly identifiable and fully integrated into the scene with consistent lighting, perspective, and environment. Render the final image with photorealistic detail and believable realism."},{name:"OPTICAL ILLUSION",category:["ILLUSION","VISUAL","TRICK"],message:"Take a picture and convert the image into an optical illusion. Perspective shifts depending on viewing angle. Hidden secondary images emerge upon inspection."},{name:"ORIGA-ME",category:["ART","SURREAL","PAPER","SCULPTURE"],message:`Take a picture of the subject and transform them and the entire scene into a fully origami environment.

The subject’s body, clothing, and features must be constructed entirely from folded paper, with realistic creases, folds, layers, and shadows. No textures or elements from the original photo may remain.

The environment around the subject must also be made entirely of folded paper, including furniture, objects, or scenery.

Lighting and perspective must remain realistic, showing accurate paper shadows, edge highlights, and depth.

The final image should look like a single, cohesive origami scene with the subject fully integrated.`},{name:"OUTFIT TRY-ON",category:["FASHION","STYLE","UTILITY"],message:`Take a picture of the subject and generate a 2×2 square grid showing four different complete outfits on the same person. The subject’s pose, face, and environment must remain identical — only the clothing changes.

Each outfit should represent a distinct style (for example: casual, formal, streetwear, business, fantasy, retro, etc.).

Clothing must fit the subject’s body naturally with correct folds, shadows, and proportions.

If external master prompt text is provided (such as era, genre, or theme), use it to guide the outfit designs.

The final image should resemble a digital fashion fitting room.`},{name:"OVER-THE-TOP BEARD",category:["HUMOR","PORTRAIT","TRANSFORMATION"],message:`Take a picture of the subject, human or animal, and give them an extremely large, exaggerated beard.

The beard should be far bigger than normal, thick, fluffy, and dramatic — long enough to reach the chest or even lower.

The style can be wild, curly, braided, or oddly shaped, but it should clearly be the main visual focus.

The beard should look real and textured, even if its size is ridiculous.

The final image should look believable but absurd, as if the subject suddenly grew an epic, legendary beard.`},{name:"PAPER SHADOW BOX",category:["ART","PAPER","3D","LAYERED"],message:"Take a picture and transform the image into a layered paper shadow-box. Multiple cut paper layers creating depth. Soft directional lighting"},{name:"PARALLEL UNIVERSE HISTORY",category:["HISTORICAL","ALTERNATE","EDUCATIONAL"],message:`Take a picture and place the subject at the center of a universally recognizable moment in human history, replacing the original figure with the subject while preserving the significance, symbolism, and emotional weight of the event. The subject must be clearly recognizable and portrayed as the individual performing the defining action of the moment. Do not depict or reference the original historical figure by name or likeness. Instead, recreate the setting, era-appropriate environment, clothing, and atmosphere so the moment is immediately identifiable through visual context alone. Use implicit inference from the subject’s appearance, posture, and expression to select an appropriate historic theme (e.g., leadership, discovery, courage, progress, unity). If externally provided details are supplied, incorporate them as factual context for the moment. Present the image as a clean, collectible flashcard optimized for small screens. Include concise, readable text such as: 
• Title of the historic moment
• Year or era
• One-sentence description of the event’s significance
• A short, respectful caption describing the subject’s role. Ensure cinematic lighting, strong composition, and emotional impact. The final image should feel iconic, respectful, and timeless—like a photograph history forgot to record.`},{name:"PASSPORT PHOTO",category:["UTILITY","DOCUMENT","PROFESSIONAL"],message:`Take a picture and transform it into an official passport photo embedded within a realistic passport identity page.

The subject’s image must appear printed directly onto the passport page as part of the document layout, not as a standalone or floating photo. Integrate the photo naturally into the passport design with proper borders, alignment, and scale consistent with real passports.

Use a plain white or light grey background within the photo area. The subject should have a centered frontal view of the face and shoulders, a neutral expression, and even lighting with no harsh shadows. Maintain clean, sharp focus and accurate proportions.

Surround the photo with realistic passport elements such as text fields, lines, security patterns, microprint textures, and subtle holographic or watermark-style design details (without copying any specific real country’s passport).

Ensure the overall result looks like a legitimate government passport ID page, with the photo clearly integrated into the document and the full page visible within the frame.`},{name:"PATRON SAINT",category:["MASTER PROMPT","RELIGIOUS","SAINT","HOLY"],message:"Take a picture and transform the subject into a patron saint–style depiction while preserving clear facial likeness and identity. Present the subject in saintly attire with symbolic garments, colors, and iconography. Use a reverent, dignified pose with soft halo lighting and a subtle divine glow, rendered in a classical yet photorealistic aesthetic. Primary information source: If a saint name is provided via externally supplied details, accurately incorporate all historically associated information for that saint, including name, patronage domains, feast day, biographical summary, notable traditions, and fun facts. Do not alter or contradict known historical associations. Secondary enhancement: Use implicit visual inference from the subject’s appearance, clothing, accessories, environment, and expression to enhance symbolism, visual motifs, and flavor text, without overriding factual saint information. Fallback behavior: If no saint name is externally provided, create a clearly labeled symbolic or archetypal “Saint of [inferred theme]” based on implicit inference from the subject. Avoid naming or implying a real historical saint, omit specific feast dates, and present patronage and fun facts as symbolic rather than historical. Design the final image as a compact, mobile-friendly flash card or holy card layout optimized for small screens. Ensure all text is concise, high-contrast, and legible at small sizes, with clear hierarchy and minimal clutter. Maintain visual clarity, balanced composition, and immediate recognizability.  The result should be a full view of the card with a relevant background behind the card."},{name:"PEANUTS",category:["COMICS","CARTOON","VINTAGE"],message:"Take a picture in the style of a Peanuts cartoon strip. Have the subject speaking through a text bubble that reads GOOD GRIEF!"},{name:"PENNIES",category:["TRANSFORMATION","METAL","MONEY","COPPER","SCULPTURE"],message:`Take a picture and transform the subject into a sculpture constructed entirely from real pennies. The subject must be MADE OF pennies, not covered in them - every part of their body, face, clothing, and hair should be built from individual copper pennies arranged like tiles or scales to form the three-dimensional shape.

Use pennies at various angles and orientations: some showing Lincoln's head, others showing the memorial or shield back, creating texture and shading through the different faces of the coins. Include pennies in different conditions - bright shiny copper, aged brown, tarnished with green patina, worn smooth - to create dimensional depth, highlights, and shadows.

The pennies should be arranged in overlapping patterns similar to fish scales or roof tiles, building up the volumetric form. Tighter, more densely packed penny arrangements for fine details like facial features; slightly looser arrangements for larger body areas. The circular shape of individual pennies should be visible throughout.

The background and environment should also be constructed from pennies - walls, floor, furniture, all made from stacked and arranged pennies creating a complete penny-constructed world.

Photorealistic lighting with warm copper/reddish-brown metallic tones, highlights catching on raised coin edges, and shadows between overlapping layers. The final image should look like a photograph of an actual physical artwork where literally everything is built from real pennies - a penny mosaic sculpture in three dimensions.`},{name:"PEPPA PIG",category:["CARTOON","ANIMATION","CHILDLIKE","MINIMAL"],message:`Take a picture and transform the subject into a flat, minimal cartoon world inspired by Peppa Pig.

STYLE & CHARACTER RULES:
• Extremely simple shapes and thick outlines
• Flat colors with no shading
• Side-facing or slightly turned characters
• Include multiple simple animal characters

SCENE & TONE:
• Bright, cheerful, and childlike
• Simple outdoor or indoor settings
• Naive perspective and playful composition

The final image should look like a fully composed Peppa Pig–style hand-drawn illustration with the subject and additional characters integrated seamlessly into the world.`},{name:"PHOTOBOMB",category:["HUMOR","PHOTO","SCENE"],message:`Take a picture and create a scene where the subject is NOT the main focus, but is instead photobombing another photo.

CORE RULE:
• The main subject of the photo must be someone or something else
• The subject must appear unexpectedly in the background or edge of the frame

MULTIPLE SUBJECT RULE (CRITICAL):
• If more than one subject is present, randomly select ONE subject to be the photobomber
• The remaining subject(s) must act as the unaware main focus of the photo
• Only ONE photobomber is allowed per image

PHOTOBOMB BEHAVIOR:
• Exaggerated facial expression, awkward pose, or deliberate attention-seeking
• Leaning into frame, popping up behind someone, or staring directly at camera
• The photobomb should be unmistakable and intentional

COMPOSITION:
• The main subject must remain fully visible and centered
• The photobomber must be partially obscured, off-center, or intruding from the edge
• Do NOT crop the main subject

FINAL RESULT:
The image should clearly read as a normal photo ruined (or improved) by one subject aggressively photobombing it.`},{name:"PHOTO BOOTH STRIP",category:["HUMOR","PORTRAIT"],message:`Take a picture of the subject(s) and turn it into a classic photo booth strip with 3-4 frames vertically aligned.

Each frame should show a different funny or exaggerated pose or expression. Include props like hats, glasses, silly signs, or hand gestures to increase humor.

Background should resemble a traditional photo booth curtain, with soft lighting and simple textures. Include slight visual imperfections like film grain, light streaks, or small scratches to emulate a real photo strip.

The final result should feel like a tangible photo booth keepsake, with high readability, playful exaggeration, and a touch of nostalgia.`},{name:"PHOTO PUZZLE",category:["PUZZLE","JIGSAW","ACTIVITY"],message:`Take a picture and transform it into a printable jigsaw puzzle layout. Preserve the original photograph clearly while overlaying visible puzzle piece cut lines across the entire image.

Generate a classic jigsaw pattern with interlocking pieces of varied shapes and sizes. Ensure pieces are large enough to be easily cut out and assembled by hand. Avoid overly small or complex pieces. Keep the image centered and unobstructed so the subject remains recognizable even when divided.

Use clean, high-contrast cut lines that are clearly visible on small screens and when printed. Do not add numbers, text, or labels. The final image should look like a ready-to-print puzzle sheet that can be cut out and assembled in real life.`},{name:"PICTIONARY",category:["PUZZLE","HUMOR","GAME"],message:`Take a picture and transform the subject into a classic Pictionary-style drawing.

Render the subject as a rough, hand-drawn black marker sketch on a clean whiteboard or paper background. The drawing should look like it was made quickly by an amateur player under time pressure — uneven lines, simple shapes, minimal detail, and imperfect proportions.

Preserve just enough of the subject’s pose, silhouette, and key features so the intended idea is still recognizable, but clearly simplified into crude line art rather than a realistic portrait.

Optional visual cues may be included sparingly, such as motion lines, arrows, or simple icons (e.g., sweat drops, exclamation marks) to suggest action or intent, as commonly seen in Pictionary drawings.

Do NOT include written words, letters, numbers, labels, or clues. The image must rely entirely on the drawing to communicate the idea.

Frame the image so the entire drawing surface is visible, as if photographed during a real game of Pictionary. The final result should feel playful, messy, and immediately readable on a small screen.`},{name:"PICTURE PERFECT",category:["PHOTOGRAPHY","ENHANCED","PERFECT"],message:"Take a picture and make it picture perfect - improve lighting, colors, and overall composition. Professional perfection. Correct lighting, color, sharpness, and realism. Remove any imperfections.  Make it photorealistic.  8k resolution."},{name:"PIMP OR WORKING GIRL",category:["HUMOR","RETRO","70S","COSTUME","CHARACTERS"],message:`Take a picture and transform the subject into a stereotypical 1970s street character based on their gender.

If MALE: Transform into a flamboyant pimp with exaggerated 1970s style - wide-brimmed fur or velvet hat with feather, oversized sunglasses, flashy suit with loud patterns (zebra print, leopard print, bright colors), platform shoes, gold chains and jewelry, fur coat draped over shoulders, cane with ornate handle, confident swagger pose. Expression should be cocky and self-assured.

If FEMALE: Transform into a provocative street worker with exaggerated 1970s style - big teased hair or wig, heavy makeup with dramatic eye shadow and false lashes, revealing outfit with hot pants or mini skirt, fishnet stockings, platform boots or heels, fur jacket or boa, excessive jewelry, confident or sultry pose and expression.

Setting should reflect gritty urban 1970s street environment - neon signs, city street at night, vintage cars in background, period-appropriate storefronts. Lighting should have that warm sodium street light glow mixed with colorful neon.

Style should be photorealistic but capture the over-the-top, exaggerated aesthetic of 1970s exploitation films and blaxploitation cinema. Preserve the subject's recognizable facial features while fully committing to the theatrical costume and styling.

The final image should feel like a still from a 1970s film - authentic period details, grainy film quality, and the unapologetic bold style of that era's street culture aesthetic.`},{name:"PIXAR",category:["ANIMATION","3D","CARTOON","DISNEY"],message:`Take a picture in the style of Pixar signature 3D animation. Use Pixar’s blend of realism and cartoon expressiveness: vibrant colors, soft shadows, rounded features, large expressive eyes, emotional depth, and animated charm.

Scene should feel like a coherent Pixar world: playful, immersive, and dynamic. Lighting, shadows, and depth must match the 3D environment.

The final image should look like a fully-rendered Pixar movie still, with the subject integrated seamlessly among other Pixar characters, all animated in the same style.`},{name:"PIXEL ART",category:["RETRO","ARTISTIC","GAME","ABSTRACT"],message:`Take a picture and transform it into authentic pixel art.

Rebuild the image entirely using a low-resolution pixel grid. The subject must be constructed from visible, square pixels only — no smooth gradients, no blur, no vector lines, and no photographic textures.

Limit the color palette to a small, intentional set (approximately 8–24 colors total). Use flat color blocks with hard pixel edges. Shading should be achieved only through pixel placement and color stepping, not softness or blending.

Preserve the subject’s recognizability through simplified shapes, silhouettes, and key features rather than detail. Facial features, if present, should be minimal and symbolic.

Choose a classic pixel-art style inspired by retro video games (8-bit, 16-bit, or early handheld), but do not copy any specific copyrighted game or character.

Ensure the entire pixel artwork is visible, centered, and readable on a small screen. The final image should feel handcrafted, nostalgic, and unmistakably pixel art — not a filtered photo.`},{name:"PLAYBILL",category:["DOCUMENT","VINTAGE","THEATER","MASTER PROMPT"],message:`Take a picture and transform it into a complete, physical Playbill theater program booklet. The entire Playbill booklet must be fully visible within the frame, including the cover, edges, and proportions of a real printed program.

Design the front cover in classic Playbill style, with the bold Playbill header at the top and a theatrical production title beneath it. Feature the subject prominently on the cover as the star performer, rendered in a dramatic or comedic stage pose and integrated naturally into the cover art.

Ensure the subject appears printed on the cover itself, not floating above it, with realistic lighting, paper texture, slight wear, and subtle printing imperfections. Add stage-themed design elements such as curtains, spotlights, marquee lights, or silhouettes to reinforce the theatrical setting.

Include humorous or over-the-top flavor text describing the subject’s role or performance (e.g., 'A One-Person Musical About Snacks,' 'Winner of Seven Imaginary Awards'). All text should be legible and balanced for small screens.

The booklet should appear photographed against a relevant background (theater seat, stage floor, lobby surface, or neutral setting). Keep the entire Playbill booklet, including borders and corners, fully in frame and clearly readable. The final image should feel like an authentic, collectible theater program.`},{name:"PLUSH TOY",category:["TOY","SOFT","STUFFED"],message:"Take a picture and transform the subject into a plush toy. Soft fabric, stitching details. Cute proportions."},{name:"POINTILLISM",category:["ART","PAINTING","DOTS"],message:"Take a picture in the style of Pointillism Art. Complementary colors are placed next to each other to intensify each hue and create vibrancy as the viewer eye optically blends the dots from a distance. Made entirely of tiny, colorful dots."},{name:"POLICE SKETCH",category:["SKETCH","POLICE","WITNESS","DRAWING","MASTER PROMPT"],message:`Take a picture and transform the subject into a classic police sketch as if created from a witness description. Depict the subject as a hand-drawn pencil or charcoal sketch on off-white paper, using strong line work, cross-hatching, and shading to define facial structure and key features.

Simplify and alter details so the sketch is approximate rather than an exact replica of the subject. Preserve general identifying characteristics such as face shape, eyes, nose, mouth, hairline, and expression, but introduce small deviations consistent with a sketch from memory.

Use a neutral background with slight paper texture. Add text and police case numbers. The final image should feel serious, observational, and readable on a small screen, reflecting the imperfection of eyewitness recall.`},{name:"POLLOCK",category:["ART","PAINTING","ARTIST","ABSTRACT"],message:"Take a picture and reinterpret it through abstract expressionism inspired by Jackson Pollock. Overlay energetic splatters, drips, and layered paint textures while allowing hints of the original subject to remain visible beneath the chaos. The final image should feel raw, spontaneous, and motion-filled."},{name:"POKEMON CARD",category:["GAMING","CARD","COLLECTIBLE"],message:"Take a picture and make it into a pokemon card, add abilities and flavor text inspired by the content of the image. The result should be a full view of the card with a relevant background behind the card."},{name:"POLAROID",category:["PHOTOGRAPHY","INSTANT","VINTAGE"],message:"Take a picture and transform it into an authentic instant-film photograph aesthetic. Frame the image within a classic Polaroid-style border with a thicker white margin at the bottom. Apply subtle film grain, soft focus, slight color fading, and natural vignetting consistent with instant photography. Include gentle imperfections such as light leaks or minor exposure variation for realism. Ensure the subject remains clearly recognizable and centered within the frame. Render the final image to convincingly resemble a real printed instant photo."},{name:"POLITICAL BANNER",category:["HUMOR","PARODY","POSTER","CAMPAIGN"],message:`Take a picture and transform the subject into the star of a humorous political campaign banner.

Design the image to look like a real campaign poster or rally banner with bold typography, patriotic colors, stars, stripes, and dramatic lighting. The subject should appear as a confident candidate or mascot, posed heroically like they are running for office.

Invent a completely fictional, absurd campaign theme based on the subject’s appearance, clothing, pose, or environment — or use external master prompt text as the campaign platform. Examples:
• 'Running for President of Florida'
• 'Vote for Steve: More Coffee, Less Meetings'
• '2028: The Only One Who Knows Where the Remote Is'

Include:
• a fake campaign slogan
• a fictional office or cause
• a large election year (real or ridiculous)

Do NOT reference real politicians, real political parties, or real political issues. Everything must be parody, fictional, and harmless.

The banner should feel like a real political sign or rally poster, but the content should be clearly silly and satirical. Ensure all text and the subject are fully visible and readable on a small screen.`},{name:"POLITICAL CARTOON",category:["HUMOR","CARTOON","SATIRE","EDITORIAL"],message:`Take a picture and transform the subject into a classic political cartoon–style illustration.

Render the subject with exaggerated facial features, oversized expressions, and bold ink outlines, like a newspaper editorial cartoon. The subject should be the main caricature, not a background figure.

Invent a fictional, humorous issue, campaign, or cause based on the subject’s appearance, posture, clothing, or environment — or use external master prompt text as the cartoon’s theme. Examples:
• 'The Flatulence Shortage'
• 'The War on Baldness'
• 'The Campaign For Less Body Odor'

Place the subject into a symbolic scene that visually represents the joke — such as standing at a podium, arguing with a cartoon object, battling a pile of paperwork, or leading a ridiculous parade.

Include cartoon-style labels on objects, signs, or banners to explain the joke (e.g., 'Too Many Emails', 'Monday Morning', 'Broken Remote Control').

Do NOT reference real political parties, politicians, or real-world political issues. Everything must be fictional, absurd, and clearly satirical.

The final image should look like a newspaper editorial cartoon: hand-drawn ink style, flat colors, strong linework, humorous exaggeration, and instantly readable on a small screen.`},{name:"POOR RICHARD'S ALMANACK",category:["DOCUMENT","VINTAGE","HUMOR","HISTORICAL","TEXT"],message:`Take a picture and transform it into an authentic page from Poor Richard's Almanack by Benjamin Franklin. Render the subject as a central illustration in the style of 18th-century woodcut engravings with bold linework, cross-hatching, and period-accurate colonial American aesthetic. Surround the illustration with aged, yellowed paper showing foxing, stains, and worn edges typical of 1730s–1750s printed almanacs.

Include period-accurate typography using blackletter or colonial serif fonts for headers. Feature a famous Benjamin Franklin saying or proverb prominently on the page in large, clear text, such as 'Early to bed and early to rise, makes a man healthy, wealthy, and wise,' 'A penny saved is a penny earned,' or 'Well done is better than well said.' Ensure this saying is the **most prominent text element** and fully visible.

Optionally, add small marginal notes, weather predictions, or astronomical observations in smaller text around the edges. Include decorative borders, flourishes, and printer's ornaments typical of colonial printing. Render realistic ink impressions, slight printing misalignments, and other subtle imperfections to emulate a true 18th-century printed page.

Place the page fully within the frame with a relevant background behind it. Keep the entire almanac page, including borders, subject illustration, and text, **clearly visible and readable on small screens**. The final image should feel historically authentic, detailed, and visually rich while keeping the subject integrated into the almanac page.`},{name:"POP ART",category:["ART","POP ART","COLORFUL"],message:"Take a picture and make it Pop Art. Employs vibrant, bold colors, simplified imagery, and techniques from the commercial world like screen-printing, often with a sense of humor, irony, or wit."},{name:"POP-UP BOOK",category:["BOOK","PAPER","3D"],message:`Take a picture and transform the entire scene into a physical pop-up book made of paper. The subject should be constructed entirely as a pop-up paper structure that rises upward from folded paper layers attached to the book’s pages.

The subject must emerge directly from the page through visible folds, hinges, tabs, and layered paper planes. The body, face, and features should be formed from flat paper pieces assembled into a three-dimensional pop-up mechanism, clearly connected to the page surface.

Show the open book with two facing pages visible. The pop-up elements should clearly originate from the folds of the pages and extend upward, as if they would collapse flat when the book is closed.

Use realistic paper textures, visible creases, cut edges, and paper thickness. All materials must look like paper—no skin, fabric, plastic, or realistic surfaces. Lighting and shadows should emphasize the layered paper construction. The final image should look like a photographed pop-up book page where the subject is part of the paper engineering itself.`},{name:"PORCELAIN",category:["SCULPTURE","CERAMIC","DELICATE"],message:"Take a picture and make the subject a porcelain sculpture. Glossy ceramic finish."},{name:"PORTRAIT",category:["PHOTOGRAPHY","PORTRAIT","FRAMED"],message:"Take a picture in the style of Photorealistic Portrait. Frame the picture in a dark black wood frame."},{name:"POSTCARD",category:["TRAVEL","VINTAGE","GREETING","SOUVENIR"],message:`Take a picture and transform it into a physical vintage-style tourist postcard.

Design the postcard using classic souvenir postcard aesthetics: bold city lettering, saturated colors, slightly dated typography, and a cheerful, kitschy layout. Select a city automatically or use one provided via external master prompt.

Integrate the subject naturally into the postcard image as part of the photographed scene, not pasted on top. The subject should feel printed directly onto the card.

Include prominent text reading "WISH YOU WERE HERE" in a large, playful postcard-style font. The text must be clearly legible and feel printed on the card surface.

Add subtle wear details such as rounded corners, slight fading, paper texture, minor creases, or edge wear so the postcard feels handled and mailed.

Ensure the entire postcard is fully visible within the frame, including borders. The postcard should appear resting on a surface or held, with a relevant background visible behind the card.

The final image should feel nostalgic, friendly, and unmistakably like a real souvenir postcard — clearly readable on a small screen.`},{name:"POTATO",category:["HUMOR","FOOD","POTATO"],message:"Take a picture and make the subject into a potato.  Preserve recognizable traits humorously."},{name:"POTTER",category:["MOVIES","MASTER PROMPT","FANTASY","MAGIC"],message:"Take a picture and place the subject naturally within a detailed, cinematic scene from the Harry Potter universe. Preserve the subject’s facial identity. Surround the subject with authentic Hogwarts scenery—enchanted castle halls, floating candles, spell effects, and magical ambiance. Match the film’s lighting and color grading for realism. Capture depth and atmosphere similar to the movies, with subtle magical motion or glow around wands and objects. Maintain the subject’s natural facial features and proportions while blending clothing and environment into the Hogwarts world. Render in ultra-realistic 8K, with soft volumetric lighting, depth of field, and fantasy realism. Based on the subject’s personality, traits, and characteristics, assign the subject to one of the four Hogwarts houses and have them wear the corresponding house robes: Gryffindor (brave, daring, chivalrous, red & gold, lion), Slytherin (ambitious, cunning, resourceful, green & silver, serpent), Ravenclaw (wise, creative, intellectual, blue & bronze, eagle), or Hufflepuff (loyal, kind, hardworking, yellow & black, badger). Ensure the house choice aligns with the subject’s personality and integrates naturally into the scene."},{name:"POWERPUFF GIRLS",category:["ANIMATION","CARTOON","TV"],message:"Take a picture in the style of a Powerpuff girls animation."},{name:"PRE-RAPHAELITE",category:["ART","PAINTING","ROMANTIC"],message:"Take a picture and transform the image into Pre-Raphaelite style painting. Vivid colors, detailed textures, medieval or literary elements, and highly idealized subject portrayal."},{name:"PRODUCT SAFETY RECALL",category:["HUMOR","MASTER PROMPT","TEXT","DOCUMENT"],message:`Take a picture and transform it into a professional-looking product safety recall notice featuring the subject as the recalled product.

Design the image as a formal corporate recall poster or notice with a clean layout, neutral colors, and official warning-style formatting. Include a large product photo of the subject centered on the page.

Add humorous recall language such as 'Affected units may unexpectedly…' or 'Discontinue use if symptoms include…' based on the subject’s appearance or expression.

Include fake batch numbers, model codes, inspection stamps, and circular diagram callouts pointing to parts of the subject with labels. The text should be legible but clearly parody.

Ensure the entire recall notice page is fully visible, including margins and layout elements. The final image should feel like a real corporate recall document at first glance, with humor revealed on closer inspection.`},{name:"PROFILE",category:["HUMOR","MASTER PROMPT","FBI","TEXT","DOCUMENT"],message:"Take a picture and transform it into a humorous FBI-style profile page. Design the layout to resemble an official dossier with structured sections such as subject name, profile photo, and case notes. Generate playful flavor text, including a fictional name and lighthearted, clearly fictional infractions inspired by the subject’s appearance, expression, clothing, and surroundings, incorporating any externally provided details naturally. Maintain a realistic document aesthetic while ensuring the tone is clearly comedic. Render the final image photorealistically with crisp text, believable formatting, and polished presentation."},{name:"PROPAGANDA POSTER",category:["HUMOR","VINTAGE","POSTER","DRAMATIC"],message:`Take a picture of the subject and transform them into the heroic figure in a vintage propaganda-style poster.

The subject should be shown in a powerful, inspiring pose such as pointing forward, raising a fist, or leading a crowd.

Use bold colors, dramatic lighting, and strong graphic shapes typical of old propaganda artwork.

Include a large slogan or call-to-action on the poster using humorous or absurd flavor text. External master prompt text may be used to supply the slogan or theme.

The cause being promoted must be fictional and ridiculous, such as a campaign for snacks, naps, or avoiding Mondays.

The final image should look like a classic propaganda poster, bold, striking, and instantly readable.`},{name:"PROTEST",category:["HUMOR","MASTER PROMPT","POLITICS","TEXT"],message:`Take a picture and place the subject naturally into a realistic, non-political protest or demonstration scene. The subject should blend into a crowd of ordinary people as if they are genuinely participating, not staged or spotlighted.

The subject must be holding a clearly visible protest sign with a humorous, absurd, or lighthearted message inspired by the subject’s appearance, posture, expression, or surrounding context. The message should be playful and harmless (e.g., 'More Snacks, Less Responsibilities,' 'Justice for Left Socks,' 'End Meetings That Could’ve Been Emails'). The exact wording may be influenced by external flavor text or master prompts.

Ensure the sign looks authentic: handmade poster board or cardboard, bold marker lettering, slightly uneven edges, realistic hand grip, and natural perspective distortion. The sign text must be fully readable and entirely visible within the frame.

The environment should resemble a real protest setting (street, park, plaza, sidewalk) with believable crowd density, natural lighting, candid body language, and realistic depth of field. Avoid political slogans, symbols, or identifiable political figures.

The subject should not be isolated or overly centered — they should feel discovered within the crowd. Clothing, expressions, and posture should appear spontaneous and believable.

The final image must show the subject, their full protest sign, and enough surrounding context to clearly read the scene on a small screen. The tone should be comedic, observational, and visually convincing.`},{name:"PS1 POLYGON MEMORY",category:["RETRO","GAMING","90S","3D"],message:"Take a picture and transform it into a PlayStation 1–era 3D render. Use low-polygon geometry, warped textures, visible seams, and jittery perspective. Lighting should be flat or uneven. The subject should appear slightly uncanny, as if rendered by early 3D hardware."},{name:"PSYCHEDELIC 60s",category:["ART","PSYCHEDELIC","60S","COLORFUL"],message:"Take a picture and transform the image into 1960s psychedelic art. Swirling colors, distorted shapes, vibrant patterns, and dreamlike visual intensity."},{name:"PUNCHLINE",category:["HUMOR","VISUAL","CLEVER"],message:"Take a picture and transform it into a visually coherent scene that sets up a clear, believable expectation involving the subject, then delivers a clever visual punchline that subverts that expectation without using captions, speech bubbles, or overt comedy props. The humor must be communicated entirely through visual context, timing, and composition rather than exaggeration or parody. Preserve the subject’s recognizable identity and integrate them naturally into the scene so the punchline feels intentional and discovered rather than obvious. The image should read as normal at first glance, with the punchline revealing itself a moment later upon closer inspection. Render with realistic lighting, scale, and detail so the scene feels grounded despite the twist."},{name:"PUT ME IN COACH",category:["SPORTS","UNIFORM","ATHLETIC","TEAM","MASTER PROMPT"],message:"Take a picture and transform the subject into a professional or college sports team player wearing the authentic uniform of that team. If master prompt specifies a team name, use that exact team and their official uniform. If no team specified, choose a recognizable professional or college team. The subject must wear the team's accurate, official uniform with all correct details: team colors, logos, jersey number, team name, sponsor patches, stripes, and design elements specific to that franchise. Examples: NBA teams (Lakers purple and gold, Heat red, yellow and black, Celtics green, Bulls red and black with correct jerseys), NFL teams (Cowboys star, Patriots logo, Dolphins dolphin, correct helmet designs), MLB teams (Yankees pinstripes, Red Sox 'B', Dodgers blue), NHL teams (correct sweaters and team crests), College teams (specific school colors, mascot logos, athletic department branding), Soccer teams (correct kits with sponsor logos). Show the subject actively playing that sport in uniform - basketball player dribbling or shooting, football player throwing or catching, baseball batting or pitching, hockey skating with stick, soccer player with ball. Place them in the appropriate venue: team's home stadium/arena with correct court/field markings, team banners, scoreboards showing team logos, crowd in team colors. Include sport-specific equipment matching the team: helmets with team decals, team-branded shoes/cleats, correct ball/puck. The uniform details must be exact - right font for numbers, accurate logo placement, current season design, authentic material and cut. Make it photorealistic as if the subject is actually on that team's roster in official game action."},{name:"PUT ME IN THERE",category:["HUMOR","PLACEMENT","SITUATIONAL","LITERAL"],message:"Take a picture and identify a container, vehicle, enclosed space, or object in the image that the subject is near but not inside. Then place the subject inside that object in a humorous or unexpected way. Examples: if standing next to a car, show them squeezed inside the car (visible through windows); if near a refrigerator, show them crammed inside among the food; if near a boat, show them inside the boat fishing; if by a suitcase, show them folded up inside it; if next to a TV, show them inside the screen; if near a box, show them packed inside; if by an oven, show them awkwardly fitting inside; if next to a pool, show them fully submerged; if near a trash can, show them stuffed in it. The subject should be clearly visible inside the object - through glass, with the container opened to reveal them, or with a cutaway view. Their expression should show surprise, discomfort, resignation, or amusement at being in this confined space. Maintain realistic scale and physics - show how they actually fit (or barely fit) inside. The placement should be literal and humorous - taking 'put me in there' as a direct command. Include appropriate lighting changes for being inside the object (dimmer if enclosed, different color temperature, etc.). Make it look photorealistic as if the subject genuinely climbed or was placed inside the nearby object."},{name:"QR CODE ME",category:["DESIGN","DOCUMENT","HUMOR","ABSTRACT","MASTER PROMPT"],message:`Take a picture and transform it into a QR-code-style graphic where the subject is embedded into the code itself.

The final image should clearly read as a QR code at first glance, using a consistent grid of square black-and-white modules across the entire image. However, when viewed from a moderate distance, the subject’s face or silhouette should become recognizable through natural variations in module density and contrast.

Do NOT place a photographic image inside the QR code. The subject must be constructed entirely from QR-style square modules. No smooth shading, no realistic textures, and no visible photo elements.

Allow the subject’s general facial structure or silhouette to emerge softly from the pattern — eyes, nose, or head shape may be suggested, but only through block clustering and negative space, not sharp outlines or high-detail rendering.

The subject may be centered, but must not overpower the QR pattern. The grid must remain continuous and visually dominant across the entire image.

Include subtle QR-inspired elements such as finder squares or alignment blocks, integrated naturally without framing or spotlighting the subject.

This does NOT need to be a functional or scannable QR code. Treat the QR structure as a visual language, not a technical requirement.

If external master prompt text is provided, let it influence overall density, contrast, or rhythm of the blocks rather than forming readable text.

Use high contrast, clean edges, and a minimal black-and-white palette. The final image should feel clever, modern, and readable on a small screen — a QR code first, with the subject revealed through pattern.`},{name:"QUASI-MUTATION",category:["HORROR","TRANSFORMATION","CREATURE"],message:"Take a picture and transform the subject as if undergoing a dramatic mutation into a powerful alternate form. Randomly select a creature or archetype such as a werewolf, Hyde-style transformation, monstrous hybrid, or other iconic mutated form. Preserve the subject’s recognizable facial structure, eyes, expression, and identity while exaggerating musculature, posture, skin texture, or anatomy appropriate to the transformation. Blend human and creature features convincingly so the subject still feels like the same individual mid- or post-mutation. Integrate the subject naturally into the scene with cinematic lighting, dynamic pose, and realistic interaction with the environment. Render the final image with photorealistic detail, dramatic contrast, and a sense of raw power and transformation."},{name:"QUE PASA USA?",category:["TV","COMEDY","CUBAN","RETRO","SITCOM","70S"],message:`Take a picture and transform the subject into a scene from the classic bilingual Cuban-American sitcom 'Que Pasa USA?' from the 1970s.

Place the subject into the iconic Peña family household setting with the show's original characters present in the scene: the grandparents (Abuela and Abuelo), parents (Juana and Joe), and teenagers (Carmen and Joe Jr). The subject should be integrated naturally as if they are a family member, friend, or visitor interacting with the characters.

The setting should capture the show's characteristic environment: the modest Miami household interior with 1970s decor, furniture, and styling. Include authentic period details like vintage appliances, wallpaper patterns, family photos on walls, and the warm, lived-in feel of a Cuban-American home.

Capture the show's signature visual aesthetic: slightly grainy film quality from 1970s television production, warm indoor lighting, and the authentic multicamera sitcom look. Use the color palette and lighting that matches the original show's appearance.

The subject should be dressed in period-appropriate 1970s clothing that fits the scene. Their expression and body language should suggest they're part of a typical sitcom moment - family discussion, comedic misunderstanding, cultural clash between generations, or bilingual conversation.

Other characters in the scene should look authentic to the show - maintaining the actors' appearances from the original series. The interaction should feel natural and capture the show's themes of Cuban-American family life, generational differences, and the immigrant experience.

The final image should look like an actual still frame from the show, with the subject seamlessly integrated into this beloved piece of Cuban-American television history. Include the warm, nostalgic atmosphere and the show's signature blend of English and Spanish cultural elements.`},{name:"R-ROLL",category:["HUMOR","MEME","PHOTOBOMB","RICK ASTLEY"],message:"Take a picture and include a singing Rick Astley standing next to the subject.  Make it photorealistic."},{name:"RAGDOLL",category:["TOY","DOLL","SOFT"],message:"Take a picture and turn the subject into a ragdoll. Maintain the characteristics of the subject. Fabric textures, stitched seams."},{name:"RANDOM PROFESSIONAL",category:["OCCUPATION","COSTUME","PROFESSIONAL"],message:"Take a picture and transform the subject into a randomly selected professional role. Select from a broad range of contemporary professions across industries. The chosen profession should be clearly recognizable through accurate, real-world attire, accessories, and tools associated with that role. Preserve the subject’s recognizable facial structure, expression, and identity while adapting hairstyle, clothing, and posture to suit the profession naturally. Place the subject in a realistic environment appropriate to the profession, with consistent lighting, scale, and perspective so the transformation feels authentic rather than like a costume. Ensure the subject appears fully integrated into the scene, as if genuinely working in that profession. Render with photorealistic detail and believable realism."},{name:"RANGE OF EMOTIONS",category:["HUMOR","PORTRAIT","EMOTION","GRID"],message:`Take a picture of the subject and transform it into a 2×2 grid showing four different emotional states.

Each panel must show the same subject with a different exaggerated emotion chosen from: happy, sad, crying, mad, angry, depressed, shocked, or confused.

The expressions should be strong and clearly readable: wide smiles, tears, frowns, clenched jaws, or dramatic eye contact.

Lighting and framing should stay consistent so it looks like a real emotional photo shoot.

The final image should look like a professional but humorous acting range card, instantly showing how many moods the subject can portray.`},{name:"RANKIN / BASS",category:["ANIMATION","STOP-MOTION","HOLIDAY","RETRO"],message:`Take a picture and transform the subject into the visual style of classic Rankin/Bass stop-motion television specials.

STYLE & MATERIAL (CRITICAL):
• Stop-motion puppet aesthetic — not CGI
• Characters must appear hand-crafted from foam, felt, fabric, wood, and painted resin
• Visible seams, stitching, sculpted facial planes, and slightly stiff articulation
• Soft, rounded forms with exaggerated noses, cheeks, and simplified facial features

STORY ROLE LOGIC SWITCH (CRITICAL):
• Randomly assign the subject ONE story role from the list below
• Do NOT default to hero unless context clearly demands it
• The assigned role should subtly influence facial expression, posture, outfit, and scene placement

POSSIBLE ROLES:
• Gruff narrator — wise, weathered expression, slightly stern or knowing
• Villain — exaggerated sneer, arched brows, mischievous or menacing charm (family-friendly)
• Background elf — cheerful or busy demeanor, simple costume, supporting presence
• Skeptical side character — crossed arms, raised eyebrow, doubtful expression
• Comic relief — exaggerated smile, clumsy pose, whimsical expression

FACIAL & BODY DESIGN:
• Preserve the subject’s recognizable facial structure and expression
• Translate features into puppet form — carved eyes, painted pupils, simple mouths
• Proportions slightly cartoonish but grounded
• Poses should feel mid–stop-motion frame (slightly stiff or frozen in motion)

HOLIDAY vs YEAR-ROUND MODE LOGIC (CRITICAL):
• Automatically choose ONE mode based on scene context or random selection if unclear

HOLIDAY MODE:
• Snow and winter atmosphere
• Christmas décor (lights, ornaments, wreaths)
• Warm glowing lighting
• Festive or seasonal outfits

YEAR-ROUND MODE:
• Neutral miniature village or fantasy setting
• No holiday symbols or decorations
• Storybook, fairy-tale aesthetic
• Everyday whimsical outfits

COLOR & LIGHTING:
• Warm, cozy color palette
• Soft studio lighting with gentle shadows
• Slight film grain and vintage television softness
• Muted highlights — no modern HDR or sharpness

ENVIRONMENT:
• Hand-built miniature sets — villages, interiors, forests, or fantasy backdrops
• Everything must look physically constructed at miniature scale
• No photographic textures or realistic materials

ANIMATION FEEL:
• The image should feel like a single frame from a stop-motion animation
• Slight imperfections in alignment or posture are encouraged
• Whimsical, nostalgic, storybook tone

FINAL RESULT:
The final image must look like a real Rankin/Bass stop-motion puppet scene from a vintage television special, with the subject fully transformed into a handcrafted puppet character, assigned a clear story role, and presented in either a holiday or year-round setting — warm, nostalgic, and unmistakably classic.`},{name:"RAPPER",category:["MUSIC","HIP HOP","URBAN","CONTEMPORARY"],message:`Take a picture and transform the subject into a modern hip-hop rapper with authentic street style and attitude.

Clothing and style: Oversized designer hoodie or graphic t-shirt, baggy jeans or track pants, fresh sneakers (high-end brands like Jordans, Yeezys), fitted cap or beanie, multiple gold or diamond chains, expensive watch, rings on multiple fingers, possibly designer sunglasses. The outfit should mix streetwear with luxury brands.

Accessories and details: Visible tattoos (face, neck, hands), grills or gold teeth optional, perfectly groomed facial hair or clean-shaven, fresh haircut with clean lineup, possibly colored or styled hair.

Pose and expression: Confident, tough, or laid-back attitude - could be throwing up hand signs, leaning against expensive car, holding microphone, showing off jewelry, or in a power stance. Expression should convey swagger, confidence, and star presence.

Setting options: Recording studio with equipment visible, luxury car (Lamborghini, Bentley, Rolls Royce), mansion or penthouse, nightclub VIP section, urban street with graffiti backdrop, or stage with dramatic lighting.

Lighting should be professional - studio quality with dramatic shadows, colored gel lights (purple, blue, red), or high-contrast urban photography style.

Preserve the subject's recognizable facial features while transforming them into a photorealistic modern rapper with authentic hip-hop styling, expensive fashion, and the confidence and presence of a chart-topping artist. The final image should look like a professional promotional photo or album cover shot.`},{name:"RAYGUN",category:["SPORTS","OLYMPICS","DANCE","ABSURD"],message:`Take a picture and transform the scene into an Olympic breakdancing competition where the subject is performing very badly.

CORE CONCEPT (CRITICAL):
• The subject must be attempting to breakdance in an Olympic setting
• The performance must look genuinely awkward, unskilled, and out of place
• The subject must appear serious and committed, not joking

BAD DANCE LOGIC (CRITICAL):
• Movements should include visibly incorrect or bizarre breakdancing attempts, such as:
  – Kangaroo hops
  – Stiff arm flailing
  – Off-beat footwork
  – Awkward freezes that don’t quite work
• Body mechanics should look real but clearly wrong
• No exaggeration into cartoon physics

OLYMPIC CONTEXT (CRITICAL):
• The environment must clearly read as an Olympic competition
• Elements may include:
  – Olympic venue or arena
  – Judges table
  – Official signage or branding cues
  – Competitive lighting and staging

CROWD & REACTION LOGIC (CRITICAL):
• Other performers, judges, or athletes must be present
• Their reactions must include ONE OR MORE of the following:
  – Mocking or suppressed laughter
  – Bewildered stares
  – Confused concern
  – Visible disbelief
• Reactions must be directed at the subject

SUBJECT PRESENTATION:
• The subject must appear confident or earnest despite the poor performance
• Facial expression should suggest focus or determination
• No self-awareness or comedy posing

CAMERA & COMPOSITION:
• Framing should emphasize contrast between subject and observers
• Subject centered or spotlighted
• Onlookers clearly visible reacting in the same frame

TONE:
• Uncomfortable, absurd, and unintentionally funny
• Socially awkward rather than slapstick
• No parody framing or exaggerated comedy cues

FINAL RESULT:
The final image must look like a real Olympic breakdancing moment where the subject is earnestly performing but clearly outmatched, while other competitors and officials react with confusion or mockery. The humor should come from the contrast between seriousness and failure — painfully memorable and unmistakable.`},{name:"REAL-LUNGING",category:["HUMOR","SCARY","ANIMATED"],message:"Take a picture and make the inanimate object real and make it lunging at me. Make it photorealistic."},{name:"REAL-NOT LUNGING",category:["TRANSFORMATION","REALISTIC","ANIMATED"],message:"Take a picture and make the inanimate object real. Make it photorealistic."},{name:"REBIRTH OF VENUS",category:["CLASSICAL ART","RENAISSANCE","MYTHOLOGY","PAINTING"],message:`Take a picture and transform the subject into Venus in Sandro Botticelli’s 'The Birth of Venus.'

CORE CONCEPT (CRITICAL):
• The subject’s face must replace Venus’s face as if Botticelli painted them originally
• Gender of the subject is irrelevant — the face must still read as Venus
• No photographic insertion or modern realism

PAINTED FACE TRANSLATION (CRITICAL):
• Convert the subject’s facial features into Botticelli’s linear, idealized Renaissance style
• Use soft contours, delicate shading, and stylized anatomy
• Skin must appear painted with tempera-like texture
• No pores, no photographic lighting

STYLE & MEDIUM:
• Early Renaissance painting style
• Pale, luminous skin tones
• Fine linework and graceful proportions
• Flat but elegant depth

COMPOSITION:
• Preserve the iconic clam shell pose and posture
• Hair, body, and gesture must remain faithful to the original painting
• The subject’s face must harmonize with the overall idealized form

SUBJECT IDENTITY:
• Maintain recognizable facial structure
• Translate likeness through shape and proportion, not realism

TONE:
• Mythic, serene, and timeless
• No humor, no modern cues

FINAL RESULT:
The final image must look like Botticelli painted the subject as Venus herself, fully integrated into 'The Birth of Venus,' with no visible evidence of modern alteration or photographic substitution.`},{name:"RECIPE CARD-FUNNY",category:["HUMOR","FOOD","CARD"],message:"Take a picture and transform it into a humorous recipe card. Include the photograph at the top as the featured image. Treat the subject as if it were a recipe concept rather than literal food. Write playful, metaphorical ingredients and preparation steps that describe the subject’s personality, appearance, or vibe. Keep the layout simple and readable for a small screen. The final image should feel whimsical and intentionally absurd."},{name:"RECIPE CARD-SERIOUS",category:["RECIPE","FOOD","CARD"],message:"Take a picture and identify the subject. If the subject is food or appears edible, generate a real, practical recipe based on it. Include the photograph at the top of the layout as the featured image. Present a clear ingredients list and simple preparation steps. Use a clean, readable recipe-card style optimized for a small screen. The photograph should clearly represent the dish being described."},{name:"RECREATION OF ADAM",category:["CLASSICAL ART","RELIGIOUS","FRESCO","ICONIC"],message:`Take a picture and transform the subject into Adam in Michelangelo’s 'The Creation of Adam' from the Sistine Chapel ceiling.

CORE CONCEPT (CRITICAL):
• The subject’s face must replace Adam’s face as if Michelangelo painted it originally
• The result must appear as a true fresco, not a modified photograph

FRESCO PAINTING RULES (CRITICAL):
• Translate the subject’s facial structure into Michelangelo’s sculptural painting style
• Strong anatomical forms
• Painted shading with visible fresco texture
• No photographic detail, no smooth digital gradients

STYLE & MEDIUM:
• High Renaissance fresco
• Earthy pigments and muted saturation
• Subtle aging and ceiling texture
• Brush and plaster interaction visible

COMPOSITION:
• Preserve Adam’s iconic reclining pose and hand gesture
• Perspective must match the ceiling’s curvature
• Lighting must feel painted, not photographed

SUBJECT IDENTITY:
• Preserve likeness through anatomy and proportion
• The face must feel carved and painted, not pasted

TONE:
• Monumental, sacred, and timeless
• No parody, no humor

FINAL RESULT:
The final image must look like Michelangelo originally painted the subject as Adam in the Sistine Chapel. The subject’s face must feel inseparable from the fresco, as if no replacement ever occurred.`},{name:"RECURSIVE IMAGE",category:["ILLUSION","INFINITE","FRACTAL"],message:"Take a picture and transform the image into infinite visual recursion. The image contains itself within itself."},{name:"REMBRANDT",category:["ART","PAINTING","CLASSIC","ARTIST"],message:"Take a picture in the style of Rembrandt van Rijn, Dutch Golden Age painting, oil painting, chiaroscuro masterpiece. Dramatic chiaroscuro lighting. Add atmospheric texture: rich oil painting texture, thick impasto brushstrokes, moody and spiritual atmosphere."},{name:"REMEMBER, REMEMBER THE FIFTH OF NOVEMBER",category:["TRANSFORMATION","FACE","DISGUISE","COSTUME"],message:`Take a picture and transform ONLY the subject’s FACE into a physical mask constructed from the subject’s OWN facial structure.

ABSOLUTE PRIORITY RULE:
The mask MUST be derived from the subject’s actual facial geometry, proportions, expression, and identity FIRST.

DO NOT use a pre-existing or recognizable stock mask face.
DO NOT reproduce the standard Guy Fawkes / V for Vendetta facial shape.

The result must NOT look like a generic or canonical V mask.

MASK CONSTRUCTION RULES:
• The subject’s real nose shape, jaw width, cheekbones, eye spacing, brow line, smile shape, and facial asymmetry MUST define the mask’s form
• Facial identity must be immediately recognizable as the subject, even though it is a mask
• Surface must be smooth, sculptural, and artificial (no skin pores or flesh texture)

STYLE SELECTION (choose ONE):
Apply the following ONLY as stylistic inspiration layered onto the subject’s face-derived mask — never as a template:
• Guy Fawkes–inspired revolutionary mask (white porcelain finish, thin black painted accents, stylized mustache or smile adapted to the SUBJECT’S mouth and facial structure)
• Traditional theatrical mask (Greek comedy or tragedy shaped to the subject’s face)
• Venetian carnival mask (ornate decoration built around the subject’s facial geometry)
• Horror mask (blank or emotionless, but still shaped like the subject)
• Japanese Noh mask (wooden, painted, carved to match subject’s facial proportions)
• African tribal ceremonial mask (carved wood patterns following subject’s facial planes)
• Mexican Día de los Muertos calavera mask (skull styling mapped to subject’s face shape)
• Other cultural ceremonial mask styles that FOLLOW the subject’s facial structure

CRITICAL DISTINCTION:
If the subject were removed, the mask would no longer resemble a known fictional character — it would ONLY resemble the subject.

PHYSICAL MASK REQUIREMENTS:
• Visible edges where the mask meets skin at hairline and jawline
• Slight shadow gap between mask and face
• Optional elastic straps, ties, or mounting hardware
• Clearly defined material: porcelain, painted wood, plastic, paper mache, or lacquer

DO NOT alter:
• Hair
• Clothing
• Body
• Pose

FINAL VALIDATION RULE:
If the image looks like the subject wearing a recognizable V for Vendetta mask, IT IS WRONG.

The final image must look like a custom-crafted ceremonial or revolutionary mask made specifically from the subject’s own face — not a famous mask placed on them.`},{name:"RENAISSANCE",category:["ART","PAINTING","CLASSIC"],message:"Take a picture in the style of a Renaissance Painting. Include linear perspective, depth and realism. Focus on human expression, dynamic poses, and realistic landscapes. Feature a wide range of natural pigments like lead white, azurite, verdigris, ochers, malachite, vermilion, and lapis lazuli, used with binders such as egg tempera and oil, to create vibrant, naturalistic colors and complex effects. Focus on light, shadow, and harmonious blending to create realism and naturalism."},{name:"RICK AND MORTY",category:["ANIMATION","CARTOON","TV","SCI FI"],message:"Take a picture in the style of a Rick and Morty episode scene-colorful, chaotic, and slightly grotesque. Convert characters from the Rick and Morty multiverse, complete with wacky gadgets, bizarre outfits, angular features, and offbeat personalities."},{name:"RIDE PHOTO MOMENT",category:["MASTER PROMPT","AMUSEMENT PARK","ROLLER COASTER","ACTION"],message:"Take a picture and transform it into an official amusement park ride photo captured at the peak moment of excitement. Place the subject seated in a ride vehicle, mid-action, with wind-blown hair, dramatic expressions, and dynamic motion blur. Add an on-ride camera angle and a branded photo-frame overlay typical of theme park ride photos. Leave room for externally provided language to specify the amusement park name and ride name, and seamlessly incorporate those details into signage, ride branding, or the photo border. The final image should feel energetic, candid, and like a souvenir photo taken at the ride’s most thrilling moment."},{name:"RIDICULOUSNESS",category:["HUMOR","FAIL","STUNT","DISASTER"],message:"Take a picture and transform it into a freeze-frame moment from a ridiculous stunt gone wrong, captured just before disaster strikes. Show the subject mid-fail during an absurd stunt attempt - jumping off something they shouldn't, attempting parkour badly, riding something not meant to be ridden, or performing an ill-advised trick. Freeze the exact moment where you can see the disaster about to happen: losing balance, mid-fall, eyes wide with realization, face showing instant regret. Include environmental chaos - objects flying, water splashing, things breaking, friends in background reacting with shock or laughter. Add that characteristic shaky smartphone camera quality, slightly blurred from motion, awkward angle as if filmed by a friend. Include visual indicators of the impending pain - skateboard flying away, pool approaching fast, fence about to be hit, gravity taking over. Capture that specific energy of amateur stunt videos where you can see the exact moment they realized 'this was a terrible idea.' Make it look like a paused frame from a viral fail video compilation with comedic timing showing the split-second before impact."},{name:"RIDLEY SCOTT EPIC",category:["MOVIES","DIRECTOR","HISTORICAL","EPIC"],message:"Take a picture and place the subject into a Ridley Scott historical epic. Use his distinctive visual style: massive scale battle scenes, golden hour lighting with dust particles in sunbeams, smoke and atmosphere, grand architectural vistas, and gritty realistic period detail. Show the subject as a warrior, gladiator, or historical figure in an epic moment - addressing troops, mid-battle, or standing before monumental ancient architecture. Include Scott's signature elements: sandstorms, dramatic skies, thousands of extras suggested in composition, authentic period armor and weapons, Mediterranean or ancient settings. Use his characteristic cinematography - sweeping crane shots compressed into dramatic angles, sun backlight creating silhouettes and lens flares, rich earthy color palettes. Capture that Ridley Scott sense of epic scale and historical authenticity. Make it look like a frame from Gladiator, Kingdom of Heaven, or The Last Duel."},{name:"RIPLEY'S BELIEVE-IT-OR-NOT",category:["HUMOR","VINTAGE","HISTORICAL","CARTOON"],message:`Take a picture of the subject and transform it into a vintage newspaper oddities feature in the style of early 1900s 'Believe It or Not' cartoons.

The subject should be presented as part of a famous real-life historical oddity. Choose or invent a presentation based on one of these real, well-known curiosities:
• A man who could eat metal, bicycles, or glass
• A person with extremely long hair or beard
• An extremely tall or extremely short person
• A human with unusual physical abilities or endurance
• A bizarre but real historical record

Place the subject into the scene as the star of this oddity — performing, displaying, or being photographed as the incredible attraction.

Design the image like a classic newspaper cartoon with ink lines, bold headlines, arrows, labels, and dramatic captions explaining the unbelievable fact.

Use external master prompt text, if provided, to influence name of subject, which oddity is shown or to add humorous headline flavor.

The final image should look like a real historical 'believe it or not' newspaper feature: exaggerated, educational, and absurd, but grounded in a real type of recorded human curiosity.`},{name:"RISOGRAPH",category:["ART","PRINT","VINTAGE"],message:"Take a picture and transform the image into risograph print style. Layered ink colors, misregistration. Paper grain texture."},{name:"ROAD SIGN",category:["MASTER PROMPT","SIGN","HUMOR"],message:`Take a picture and transform it into a realistic roadside warning or informational sign featuring the subject. The sign must conform to standard road sign design conventions: simple shapes, high-contrast colors, bold sans-serif lettering, and minimal visual clutter.

Place the subject as a simplified, sign-style pictogram or silhouette illustration (not photoreal) rendered in the same visual language as pedestrian, animal, or caution signs. The subject should clearly resemble the person but be stylized to match real traffic sign iconography.

Include a short sign message such as '[NAME] CROSSING,' 'BEWARE OF [NAME],' or similar wording. Text must be large, centered, and legible from a distance.

Mount the sign on a realistic metal post in a roadside or urban environment. Ensure the entire sign, including edges and post, is fully visible within the frame. The final image should look like a real, installed road sign that someone could encounter in the wild.`},{name:"ROBLOX",category:["GAMING","3D","BLOCKY"],message:"Take a picture in the style of Roblox. Simplified 3D characters."},{name:"ROBOT",category:["SCI FI","ROBOT","MECHANICAL"],message:"Take a picture and make everything into mechanical robots that maintain the characteristics of the objects. Make it photorealistic."},{name:"ROB REINER FILM",category:["HUMOR","MOVIES","SCENE","CULT CLASSIC"],message:`Take a picture of the subject and place them into a famous scene from a Rob Reiner film, such as *The Princess Bride*, *When Harry Met Sally*, *Stand by Me*, or *Misery*.

The subject should be integrated naturally into the scene, interacting with the environment and other characters in a way that makes them the central focus.

Lighting, perspective, and costume should match the film style and era, making it look like a real frame from the movie.

Optional flavor text from the master prompt can influence which film or scene to use, or what absurd twist to add (e.g., subject delivers the iconic line, performs the fencing duel, or sits in the famous diner scene with a ridiculous expression).

The final image should be humorous, cinematic, and instantly recognizable as a reimagined Rob Reiner movie scene starring the subject.`},{name:"ROCKWELL",category:["ART","PAINTING","AMERICAN","ARTIST"],message:"Take a picture in the style of a Norman Rockwell illustration. Render with meticulous detail and vibrant colors to portray realistic, yet idealized nostalgic Americana."},{name:"ROCOCO",category:["ART","PAINTING","ORNATE","CLASSIC"],message:"Take a picture and transform the image into Rococo style painting. Pastel colors, ornamental patterns, playful composition, delicate brushstrokes, floral and interior details."},{name:"ROMANTICISM",category:["ART","PAINTING","ROMANTIC","DRAMATIC"],message:"Take a picture in the style of a Romanticism painting. Moody lighting, emotional intensity, dramatic composition, and expressive colors. Subject central and impactful."},{name:"ROMANESQUE PAINTING",category:["ART","PAINTING","MEDIEVAL"],message:"Take a picture and transform the image into Romanesque-style painting. Simplify forms, use bold outlines, flat areas of color, and stylized faces. Include architectural or decorative elements inspired by early medieval European art. Keep the subject recognizable while appearing as if part of a historical religious or historical scene."},{name:"RON HOWARD FILM",category:["MOVIES","DIRECTOR","DRAMA","INSPIRATIONAL"],message:"Take a picture and place the subject into a Ron Howard film scene. Use Howard's distinctive visual style: warm naturalistic lighting, golden hour cinematography, earnest emotional moments, sweeping crane shots suggesting epic scale, and polished mainstream Hollywood aesthetics. Show the subject in an uplifting dramatic moment - overcoming adversity, making a crucial decision, experiencing triumph, or in a heartfelt human connection. Include Ron Howard signature elements: based-on-true-story authenticity, period-accurate details (1960s space race, 1800s whaling ships, Depression-era settings), blue-collar American heroes, family dynamics, or historical events. Use his characteristic cinematography - warm amber tones, soft diffused lighting for emotional scenes, dramatic backlighting, clean compositions that feel accessible yet cinematic. Capture his style of inspirational storytelling - moments that feel genuine, hopeful, and emotionally resonant without cynicism. Include visual motifs of determination, teamwork, or human perseverance. Make it look like a frame from Apollo 13, A Beautiful Mind, Cinderella Man, or Rush with that polished Ron Howard blend of emotional authenticity and crowd-pleasing cinema."},{name:"ROTTEN TOMATOES",category:["PARODY","CRITICISM","DOCUMENTARY","ENTERTAINMENT","HUMOR"],message:`Take a picture and transform it into a Rotten Tomatoes–style documentary review page judging the life of the subject as if it were a film.

CORE CONCEPT:
The subject’s LIFE is the documentary.
The image should present the subject as the main documentary subject being critically reviewed.

CRITICAL PRESENTATION RULE:
The final image MUST look like a Rotten Tomatoes review page or score card — NOT a movie poster alone.

LAYOUT REQUIREMENTS:
• Prominent documentary title based on the subject
• Rotten / Fresh score presentation (Tomatometer-style)
• Critics score and Audience score (can be exaggerated or absurd)
• Short review blurbs placed around the image
• Overall layout must resemble an entertainment review website

DOCUMENTARY TITLE:
• Invent a humorous documentary title inspired by:
  – Subject’s appearance
  – Body language
  – Clothing
  – Environment
• Titles should sound serious but be funny when applied to the subject

Examples (STYLE ONLY):
• "Standing Still: A Life of Mild Confusion"
• "Mostly Late: The [Name] Story"
• "Unprepared for Success"

FLAVOR TEXT & REVIEWS:
• Write multiple short critic-style quotes
• Tone should mimic real film criticism — dramatic, pretentious, or snarky
• May exaggerate flaws or mundane traits humorously
• If master prompt text is provided, incorporate it into reviews or the synopsis

Examples (STYLE ONLY):
• "An unflinching look at questionable choices."
• "Ambitious, but fundamentally unnecessary."
• "It insists upon itself."

SCORING RULES:
• Scores may be illogically high or brutally low for comedic effect
• Use percentages, icons, or meters consistent with review culture
• Critics and audience scores may strongly disagree

SUBJECT INTEGRATION:
• The subject should appear as the documentary’s central visual — posed seriously, candidly, or awkwardly
• Lighting and framing should feel like a documentary still or press image

ABSOLUTE PROHIBITIONS:
• DO NOT create a generic meme
• DO NOT ignore review-site layout conventions
• DO NOT make the subject a fictional character — this is a documentary about THEM

FINAL RESULT:
The image must look like a legitimate Rotten Tomatoes documentary review page judging the subject’s life — complete with title, scores, critic blurbs, and serious presentation that makes the absurd premise funnier.`},{name:"ROUTE 66 BILLBOARD",category:["HUMOR","ADVERTISING","VINTAGE","ROAD TRIP"],message:`Take a picture of the subject and place them on a classic roadside Route 66 billboard.

The billboard should be realistic, with full structural support, shadows, perspective, and wear consistent with the environment.

The subject should be painted, printed, or applied as part of the advertisement, fully integrated with the surface of the billboard — not floating or pasted.

Include environmental details like the highway, desert landscape, distant mountains, signage poles, or roadside features visible in the original scene.

Colors, lighting, and weathering should match the local environment, with subtle fading, sun bleaching, or paint wear appropriate for a roadside billboard.

The final image should look like a real photograph of a Route 66 billboard featuring the subject.`},{name:"ROYAL PORTRAIT",category:["HUMOR","HISTORICAL","PORTRAIT"],message:`Take a picture of the subject and transform them into a royal figure in a classic painted portrait.

Dress the subject in elegant royal clothing such as crowns, robes, medals, or gowns.

Place them in a grand palace or painted studio background.

The style should resemble a formal oil painting with dramatic lighting and rich colors.

The subject should look powerful, noble, and slightly over-the-top, like a legendary monarch.`},{name:"ROYAL WEDDING",category:["CLASSIC FILM","DANCE","SURREAL","PRACTICAL EFFECT"],message:`Take a picture and transform the scene so the subject appears to be walking naturally on the wall or ceiling of their current location, inspired by the classic Fred Astaire sequence in 'Royal Wedding.'

CORE ILLUSION (CRITICAL):
• The subject must appear to be genuinely walking on a wall or ceiling
• The effect must look physically real and camera-based — not CGI, not pasted, not digitally manipulated
• The illusion should feel achieved through set rotation or camera orientation

PHYSICAL REALISM RULES (CRITICAL):
• Gravity must feel consistent within the frame
• Clothing, hair, shadows, and body posture must all support the illusion
• No floating, bending physics, or impossible body mechanics

ENVIRONMENT INTEGRATION:
• The subject must remain inside the real photographed location
• Walls, floors, ceilings, and furniture must appear continuous and structurally believable
• Objects in the environment should visually reinforce the rotated-space illusion

SUBJECT POSE & MOVEMENT:
• The subject should appear mid-step or in a natural walking pose
• Posture must feel relaxed and confident — not strained or acrobatic
• No exaggerated stunts or superhero motion

CAMERA & COMPOSITION:
• The camera angle must sell the illusion
• Straight lines, architectural edges, and shadows must align convincingly
• Avoid extreme wide-angle distortion

LIGHTING:
• Lighting must match the real environment
• Shadows must fall consistently with the perceived gravity direction
• No artificial spotlighting or surreal glow

TONE:
• Elegant, playful, and classic
• A sense of wonder without fantasy elements
• Grounded, charming, and visually clever

FINAL RESULT:
The final image must look like a practical, in-camera illusion from a classic Hollywood musical, where the subject appears to be genuinely walking on the wall or ceiling of the room. The effect should feel clever, elegant, and physically real — as if achieved through set rotation rather than digital manipulation.`},{name:"RPG PORTRAIT",category:["GAMING","RPG","PORTRAIT"],message:"Take a picture and transform the subject into an RPG character portrait. Fantasy UI frame, stat panel styling. Painted character art. The result should be a full view of the portrait with a relevant background behind the portrait."},{name:"RUBBER DUCKIE",category:["HUMOR","TOY","TRANSFORMATION"],message:"Take a picture and transform the subject into a yellow rubber duck bath toy. Bright yellow rubber material with orange beak, glossy plastic surface with light reflections, squeezable toy texture, black dot eyes. The subject's recognizable features should be incorporated into the duck's shape and form. Bath toy appearance, floating in water with subtle ripples, playful and whimsical."},{name:"RUBBER HOSE",category:["ANIMATION","CARTOON","VINTAGE","30S"],message:"Take a picture and transform the image into 1930s rubber hose animation style. Bouncy limbs, simple faces. Vintage cartoon aesthetic."},{name:"RUNNING FROM THE BULLS",category:["FESTIVAL","HUMOR","SPAIN","SAN FERMIN"],message:"Take a picture and transform the subject into a participant in the Running of the Bulls festival in Pamplona, Spain. Show the subject running comically away from a bull in an exaggerated, cartoonish chase — wide eyes, flailing arms, slipping on cobblestones, or losing a hat. Include other festival participants and spectators reacting humorously. The bull should look energetic and lively, but not menacing or injuring anyone. Emphasize dynamic motion, motion blur, and chaotic festival energy. Lighting and perspective should match real action photography, making the subject feel naturally part of the crowded festival scene while keeping it funny and over-the-top."},{name:"RUSSIAN ICONOGRAPHY",category:["ART","RELIGIOUS","RUSSIAN"],message:"Take a picture and transform the image into Russian iconography style art. Stylized facial features, gold accents, symbolic colors, frontal composition, and spiritual solemnity."},{name:"SATURDAY EVENING POST",category:["ART","PAINTING","AMERICAN","EDITORIAL","COVER"],message:`Take a picture and transform it into a Norman Rockwell–style Saturday Evening Post magazine cover.

CORE CONCEPT:
The subject is the central character in a single, readable moment that tells a clear story.

COVER COMPOSITION (CRITICAL):
• Vertical magazine cover layout
• Subject centered or prominently framed
• Clean, uncluttered background
• Strong narrative focus on one everyday moment

SUBJECT REQUIREMENTS:
• The subject must be a full or near-full figure
• Expression and body language must tell a story
• The subject should appear caught mid-moment (awkward, proud, embarrassed, thoughtful, mischievous)

STYLE & MEDIUM:
• Hand-painted illustration style
• Smooth, detailed brushwork
• Realistic but idealized proportions
• Warm, nostalgic Americana color palette

DETAILING:
• Highly detailed clothing, props, and facial expressions
• Subtle humor or irony visible on closer inspection
• No exaggerated caricature — realism with charm

TEXT ELEMENTS:
• Include "The Saturday Evening Post" masthead at the top
• Optional small cover text or date in period-appropriate typography
• Text must feel secondary to the illustration

ENVIRONMENT:
• Everyday American life setting (school, street, home, barbershop, workplace, small town scene)
• Time period ambiguous but mid-20th-century inspired

ABSOLUTE PROHIBITIONS:
• NO modern digital illustration styles
• NO painterly abstraction
• NO parody exaggeration
• NO busy collage layouts

FINAL RESULT:
The image must look like an authentic Norman Rockwell Saturday Evening Post cover — warm, narrative-driven, nostalgic, and centered on a single human story moment starring the subject.`},{name:"SCANDINAVIAN FOLK ART",category:["ART","CULTURAL","SCANDINAVIAN"],message:"Take a picture and transform the image into Scandinavian folk art style art. Decorative patterns, muted earthy tones, simple geometry, and traditional motifs."},{name:"SCARY MOVIE",category:["HUMOR","MOVIES","PARODY","MASK"],message:`Take a picture and transform the subject so their face appears as a comedic parody mask inspired by the exaggerated 'Whassup' character style from the Scary Movie films.

The mask MUST be solid white in color. Do NOT use skin tones, flesh colors, beige, pink, or realistic human coloration. The mask should clearly read as a white costume mask.

The mask should be clearly rubbery and costume-like, not realistic or eerie. Use a droopy, stretched face shape with oversized eye holes, exaggerated mouth opening, and slightly uneven proportions. The expression should feel goofy, slack, and intentionally silly rather than threatening.

Subtly adapt the mask to the subject so each render feels unique while staying comedic. Variations may include:
• mouth shape loosely matching the subject’s expression (open, smirking, surprised)
• uneven eye openings influenced by the subject’s eye spacing
• stretched or sagging areas reflecting the subject’s face shape
• molded impressions suggesting glasses or accessories if present

Dress the subject in a loose black hooded robe that looks like a cheap Halloween costume rather than a cinematic outfit. Fabric should appear lightweight, wrinkled, and slightly ill-fitting for comedic effect.

The overall tone must be humorous and absurd, not scary. Do not add blood, weapons, or horror elements. Lighting and composition should feel casual and playful, as if captured during a parody scene.

The final image should immediately read as a Scary Movie–style spoof — goofy, recognizable, and funny — while remaining clear and readable on small screens.`},{name:"SCHOOL BOY / SCHOOL GIRL",category:["HUMOR","TRANSFORMATION","COSTUME"],message:`Take a picture and transform the subject into a school boy or school girl wearing a culturally accurate school uniform.

Choose or vary the style based on geography: Japanese, American, European, British, or other international school uniforms.

Uniforms should include appropriate elements such as blazers, ties, skirts, shorts, knee socks, backpacks, or loafers depending on region.

The subject should appear naturally dressed, not in cosplay. Clothing should fit realistically with proper fabric folds and wear.

Backgrounds may include classrooms, hallways, schoolyards, or chalkboards.

The final image should be humorous due to contrast with the subject’s age or demeanor, but visually realistic.`},{name:"SCHOOLHOUSE ROCK!",category:["HUMOR","CARTOON","EDUCATIONAL","RETRO"],message:`Take a picture of the subject and recreate them as an animated character in the classic Schoolhouse Rock! cartoon style.

STYLE & MEDIUM (CRITICAL):
• 1970s hand-drawn animation style
• Thick outlines, flat colors, simple shapes
• Limited animation feel with playful exaggeration
• Bright, educational color palette

CHARACTER TRANSFORMATION:
• The subject becomes a cartoon character rendered in Schoolhouse Rock! style
• Preserve recognizable facial features and overall likeness
• Simplify features into cartoon form — not photorealistic

EPISODE RANDOMIZATION:
• Randomly select ONE of the original Schoolhouse Rock! episode themes (e.g. grammar, math, civics, history, science, economics)
• The scene, props, and environment should reflect the chosen episode’s topic

TEXT & BUBBLES (CRITICAL):
• Include speech bubbles, title cards, or lyric-style text
• Text should explain or humorously reference the selected educational topic
• If external master prompt flavor text is provided, reinterpret it as educational lyrics or dialogue

BACKGROUND:
• Abstract shapes, moving diagrams, or symbolic elements typical of the cartoons
• Blackboard motifs, arrows, labels, or bouncing icons

FINAL RESULT:
The image should look like a genuine frame from a Schoolhouse Rock! episode where the subject has been turned into a cheerful, slightly goofy educational cartoon character teaching a lesson.`},{name:"SCOOBY-DOO ENDING",category:["CARTOON","HUMOR","RETRO"],message:"Take a picture and place the subject in a classic Scooby-Doo unmasking scene ending. Subject shown as the unmasked villain with shocked/guilty expression, surrounded by the Mystery Inc. gang (Fred, Daphne, Velma, Shaggy, and Scooby-Doo) pointing accusingly. Subject drawn in Hanna-Barbera animation style with bold black outlines and flat cel-shaded colors. Include speech bubble with 'And I would have gotten away with it too, if it weren't for you meddling kids!' Classic 1970s Scooby-Doo art style, vintage cartoon aesthetic, iconic reveal moment from the show's ending. Spooky background setting like haunted mansion or abandoned amusement park."},{name:"SCOTT ADAMS' DILBERT",category:["COMIC","CARTOON","OFFICE","SATIRE","CORPORATE"],message:`Take a picture and transform the subject into the art style of Scott Adams' Dilbert comic strip.

Art style characteristics: Simple, clean black ink lines with minimal detail, geometric shapes, flat color fills with no gradients or shading, white backgrounds or minimal environment details. Characters have simplified facial features - dot eyes, simple curved lines for mouths, basic nose shapes. Bodies are rectangular or cylindrical with minimal anatomical detail.

Transform the subject into this simplified comic style while keeping them recognizable through key features like hairstyle, glasses, facial hair, or distinctive characteristics adapted to the minimalist art style. Use the characteristic Dilbert character proportions - slightly oversized heads on simple rectangular bodies.

Clothing should be office attire - dress shirt, tie, slacks for business look, rendered with simple clean lines and solid colors. Include the signature white collar and simple tie design typical of Dilbert characters.

Setting should be a minimal office cubicle environment - simple desk, computer monitor (rendered as basic rectangles), office chair, cubicle walls. Keep backgrounds sparse and clean with simple straight lines, characteristic of the comic strip's minimal aesthetic.

Expression should capture workplace emotions - deadpan frustration, sarcastic smile, exhausted resignation, or cynical awareness typical of Dilbert's office humor. Keep facial expressions simple but expressive using minimal lines.

The final image should look exactly like a panel from the Dilbert comic strip - clean ink lines, flat colors, minimal detail, geometric simplification, and the satirical corporate office aesthetic. The subject should be instantly recognizable while fully adapted to Scott Adams' distinctive minimalist comic art style.`},{name:"SCREAM",category:["HORROR","MOVIES","MASK"],message:`Take a picture and transform the subject so their face appears as a Ghostface-style mask while preserving the subject’s underlying facial structure, proportions, and expression. The mask should be smooth white with elongated eyes and mouth, subtly shaped by the subject’s face so it feels worn rather than pasted on.

Dress the subject in a flowing black hooded robe inspired by the classic Ghostface costume. Ensure the hood frames the mask naturally, with realistic fabric folds, shadows, and texture. Match lighting, perspective, and depth so the costume integrates seamlessly with the original scene.

Maintain a clean, non-graphic horror aesthetic. Do not add blood, weapons, or violent elements. The final image should feel eerie, iconic, and cinematic while remaining clearly readable on small screens.`},{name:"SECOND TO LAST SUPPER",category:["CLASSICAL ART","RELIGIOUS","PAINTING","ICONIC"],message:`Take a picture and transform the subject into one of the apostles within Leonardo da Vinci’s 'The Last Supper.'

CORE CONCEPT (CRITICAL):
• The subject must appear as if they were originally painted as one of the apostles
• This is not a photograph inserted into the painting
• The entire figure, including the face, must be rendered in Leonardo’s painted style

PAINTED INTEGRATION RULES (CRITICAL):
• The subject’s facial features must be translated into Renaissance oil painting form
• Match Leonardo’s brushwork, color blending, and soft sfumato edges
• Skin tones must appear painted, not photographic
• No sharp photo detail, no modern lighting, no overlay artifacts

COMPOSITION & PLACEMENT:
• The subject must occupy the position of ONE apostle
• Pose, gesture, and gaze must match the emotional grouping of that apostle
• Perspective and scale must perfectly align with the original mural

STYLE & MEDIUM:
• Italian High Renaissance fresco style
• Muted earth tones
• Soft shadows and subtle transitions
• Aged wall texture consistent with the original work

SUBJECT IDENTITY:
• Preserve the subject’s recognizable facial structure
• Translate identity through painted anatomy, not photo realism

TONE:
• Reverent, dramatic, and historically grounded
• No parody, no modern humor

FINAL RESULT:
The final image must look like Leonardo da Vinci originally painted the subject as one of the apostles in 'The Last Supper.' The subject should feel inseparable from the artwork, with no indication that a modern face was ever inserted.`},{name:"SECURITY CAMERA FOOTAGE",category:["SURVEILLANCE","LOW QUALITY","SECURITY"],message:"Take a picture and transform it into low-quality security camera footage. Render the image in washed-out grayscale or green-tinted night vision with heavy noise and compression artifacts. Add a timestamp and camera label (e.g., CAM 03, 02:14 AM) in a blocky digital font. The framing should feel awkward or off-center, with slight motion blur or ghosting. Reduce detail and sharpness while preserving the subject’s silhouette. The image should feel surveilled, impersonal, and slightly unsettling."},{name:"SEND IN THE CLOWNS",category:["HUMOR","INTERPRETATION","CLOWN","CIRCUS"],message:`Take a picture and transform the subject into a clown, adapting the clown’s style based on the subject’s facial expression. Preserve the subject’s facial structure and identity while applying expressive clown makeup and costume details. Automatically select ONE of the following interpretations based on the subject’s apparent emotion:

• Happy Clown — if the subject is smiling or joyful, use bright colors, a rounded red nose, cheerful face paint, and playful costume elements.
• Sad Clown — if the subject appears sad or frowning, use muted colors, downward eye makeup, a single painted tear, softer lighting, and a melancholic expression.
• Evil Clown — if the subject appears angry, intense, or menacing, use darker colors, sharp makeup lines, exaggerated shadows, unsettling grin or glare, and dramatic lighting.

Ensure the chosen clown type is visually clear and emotionally consistent. The final image should feel theatrical, expressive, and unmistakably clown-like while keeping the subject recognizable.`},{name:"SENTIENT OBJECT",category:["HUMOR","OBJECT","FACE"],message:"Take a picture and transform the subject into a sentient everyday object while preserving recognizable facial features, expressions, and personality. Choose an object that feels thematically connected to the subject’s clothing, pose, or surroundings, such as a vending machine, toaster, mailbox, lamp, or appliance. Integrate the subject’s face naturally into the object’s design so it appears alive and expressive. Place the character in a believable environment where the object would normally exist, with consistent lighting, scale, and shadows. Render the final image with surreal realism and a humorous, imaginative tone."},{name:"SEUSS",category:["BOOK","CARTOON","WHIMSICAL"],message:"Take a picture and transform the subject and the surrounding scene into a whimsical Dr. Seuss book illustration. Preserve the subject’s recognizable facial features and personality while adapting their appearance to the exaggerated, fantastical style of Dr. Seuss characters with playful proportions, quirky shapes, and vibrant colors. The environment should include imaginative, surreal elements typical of Seuss worlds—twisting landscapes, unusual plants, and whimsical architecture. Add accompanying flavor text transformed into a short rhyming poem or verse that complements the scene and subject, in the signature playful, rhythmic, and nonsensical style of Dr. Seuss. Ensure the subject remains clearly identifiable and fully integrated into the Seussian world."},{name:"SHAKESPEAREAN",category:["THEATER","CLASSIC","COSTUME"],message:"Take a picture and make the subject an actor in a Shakespearean play. Dress the subject in period-accurate costume in the same style as the chosen Shakespearean play, apply stage lighting, and dramatic theatrical pose."},{name:"SHARP CALM LATTE",category:["DESIGN","EDITORIAL","ABSTRACT","STRUCTURAL"],message:`Take a picture and reconstruct it using extreme sharp-edged depth simulation.

Break the scene into multiple flat, rigid layers (foreground, midground, background). Each layer must have hard, geometric edges with no feathering, no blur, and no soft transitions. Treat each layer like a physical cutout made from thick card stock or acrylic sheets.

Depth must be created ONLY through layer offset, overlap, scale, and cast shadows — never through photographic depth of field, bokeh, or blur. Shadows should be crisp, directional, and slightly offset to clearly reveal stacking order.

Simplify the subject into bold planar shapes while preserving recognizable silhouette and posture. Remove surface texture and fine photographic detail. Surfaces should appear smooth, matte, and manufactured.

Use a strictly limited calm latte palette: warm ivory, oat beige, sand, almond, soft clay, light mocha, and espresso brown. No saturated colors, no gradients beyond flat tonal steps.

Lighting should feel artificial and diagrammatic, as if lit for a design mockup or museum model, not a real-world photograph.

The final image should resemble a precision-cut, depth-layered design object or editorial poster. It must look constructed, not painted, not photographed, and not illustrated. Ensure all forms remain sharply defined and clearly readable on a small screen. Treat all edges as laser-cut; any softness or blur is an error.`},{name:"SHOPPING LIST",category:["UTILITY","LIST","SHOPPING"],message:"Take a picture and create a pictured shopping list identifying the main subject and all notable objects. Do not display a single full reference photo. Instead, separate each identified item and create a small cropped image or thumbnail of each subject or object. Present a numbered shopping list where each number is paired with its corresponding small image and a short description. Keep the layout clean and optimized for a small screen, with each item visually distinct and easy to scan."},{name:"SHOULDNT HAVE DONE THAT",category:["HUMOR","MISTAKE","REGRET"],message:"Take a picture and subtly make it look like the subject is doing something they absolutely should not be doing. The humor should come from obvious poor judgment."},{name:"SIDEWALK CHALK ART (HUMOROUS)",category:["HUMOR","ILLUSTRATION","STREET ART","TRANSFORMATION"],message:`Take a picture of the subject and transform the entire scene into realistic sidewalk chalk art drawn on concrete pavement.

The subject, background, and environment must all be rendered as chalk drawings — NOT a photo with a chalk filter.

The chalk style should include rough hand-drawn lines, uneven thickness, visible chalk dust, smudges, cracks in the pavement, and faded areas where chalk has been rubbed away.

The subject should appear as a chalk illustration integrated into the pavement, with foreshortening and perspective if appropriate, like classic street chalk art illusions.

Include humorous chalk-written flavor text, arrows, labels, doodles, or annotations interacting with the subject (e.g., pointing out exaggerated features or ridiculous situations).

DO NOT:
• Leave any part of the image photorealistic
• Overlay chalk textures on a real photo
• Create clean digital line art

Lighting should be natural outdoor daylight, with subtle shadows consistent with chalk sitting on pavement.

The final image must look like a real photograph of sidewalk chalk art drawn by a street artist — playful, imperfect, and clearly made of chalk.`},{name:"SIDEWALK CHALK FINE ART",category:["ART","STREET ART","REALISM","FINE ART"],message:`Take a picture of the subject and transform the entire scene into a serious, high-quality sidewalk chalk artwork drawn on pavement.

The style should be refined, detailed, and artistic — not humorous or cartoonish.

Render the subject with realistic proportions, expressive shading, and careful attention to light and depth using chalk techniques.

Include realistic pavement texture, cracks, chalk dust, and subtle color blending.

The composition should feel like professional street art created by a skilled chalk artist.

DO NOT use filters or photorealistic elements.

The final image must look like a museum-quality sidewalk chalk artwork photographed outdoors.`},{name:"SIDEWALK CHALK ILLUSION",category:["ART","STREET ART","ILLUSION","3D"],message:`Take a picture of the subject and transform the entire scene into realistic 3D sidewalk chalk illusion art drawn on concrete pavement.

The artwork should create a dramatic optical illusion such as a deep pit, a massive crack, a hole into another world, or a large creature emerging from the ground.

The subject should appear to be interacting with the illusion — standing at the edge, falling in, hanging on, being chased, or confronting the illusion.

Everything in the image must be drawn in chalk: subject, illusion, shadows, and environment.

Use exaggerated perspective and foreshortening typical of professional anamorphic sidewalk chalk art.

Include pavement texture, cracks, chalk dust, smudging, and worn areas.

DO NOT use photographic elements, filters, or pasted textures.

The final image must look like a real photograph of large-scale sidewalk chalk illusion art created by a skilled street artist.`},{name:"SILHOUETTE",category:["ART","SILHOUETTE","MINIMAL"],message:"Take a picture and convert the subject into a solid black silhouette. Subject interior filled with the background image. Outer background pure white."},{name:"SIMPSONS",category:["ANIMATION","CARTOON","TV"],message:`Take a picture in the style of a Simpsons cartoon scene, with yellow skin tones, bright palettes, and Springfield vibes. Maintain cartoon proportions and exaggerated features.

The subject must be the main character, but include other recognizable Simpsons characters in the scene interacting naturally — they can be family members, friends, or background Springfield citizens.

Background elements should reflect Springfield locations, like Moe’s Tavern, the Kwik-E-Mart, or Springfield Elementary, depending on the scene context.

The final image should look like a fully integrated Simpsons world with the subject seamlessly placed among other characters, as if part of a real episode.`},{name:"SIN CITY",category:["CINEMATIC","NOIR","COMIC","DRAMATIC","MOVIES"],message:`Take a picture and transform it into a Sin City–inspired graphic novel scene.

Render the image almost entirely in stark black and white with extreme contrast. Use deep, inky blacks and bright whites with very little midtone gray. Lighting should feel harsh, directional, and dramatic, emphasizing silhouettes, shadows, and negative space.

Allow only one or two selective color accents at most (such as red lips, blood-red elements, a glowing cigarette ember, or neon signage). All other elements must remain strictly monochrome.

Convert the subject into a stylized, high-contrast noir figure with sharp edges, heavy shadowing, and simplified facial features. Preserve recognizability through bold shapes and expression rather than realism.

The environment should feel urban and gritty — rain-soaked streets, fire escapes, alleyways, venetian-blind shadows, brick walls, or smoky interiors. Backgrounds may fade into black to heighten drama.

The final image should resemble a single panel from a dark neo-noir graphic novel. Avoid soft gradients, painterly textures, or photographic realism. The result must feel illustrated, cinematic, and unmistakably Sin City in tone, clearly readable on a small screen.`},{name:"SKETCH ART",category:["ART","SKETCH","COLORFUL"],message:"Take a picture in the style of colorful Sketch Art. A rapidly executed, freehand drawing that serves as a preliminary step for a more detailed, finished work."},{name:"SLIMED",category:["HUMOR","ACTION","MESSY"],message:`Take a picture of the subject and capture the moment they are being hit on the head by bright green slime.

The slime should be mid-impact or just beginning to cover their hair and face.

The subject should have a shocked or panicked expression as the slime lands.

The slime should look thick, glossy, and cartoonishly gooey.

The final image should freeze the exact moment of impact for maximum comedy.`},{name:"SMURFED!",category:["CARTOON","TRANSFORMATION","HUMOR"],message:"Take a picture and transform the subject into a Smurf character. Bright blue skin covering entire body, small stature (three apples high), distinctive white Phrygian cap, white pants, no shoes. Large expressive eyes, button nose, cheerful smile. Subject's recognizable facial features should be adapted to Smurf proportions. Place in magical Smurf Village setting with mushroom houses, forest environment, whimsical fairy-tale atmosphere. Classic Peyo cartoon style with smooth shading and vibrant colors. Friendly, cheerful, and enchanting storybook illustration quality."},{name:"SNOW GLOBE",category:["TOY","MINIATURE","WINTER","SOUVENIR"],message:`Take a picture and encapsulate the subject and scene inside a physical souvenir snow globe.

Miniaturize the subject and place them within a tiny, detailed environment inside the globe. If a city or location is provided via external master prompt, construct a miniature city scene inside the globe featuring simplified landmarks, buildings, or visual cues associated with that place. If no location is provided, create a generic charming miniature environment.

The subject should appear as a small figurine integrated into the miniature city scene — not floating, not full-sized, and not dominating the globe.

Render a clear glass sphere with realistic reflections, refraction, highlights, and slight distortion caused by the curved glass. Floating snow particles or glitter should be suspended throughout the globe at varying depths.

Include a visible snow globe base made of plastic or resin, styled like a tourist souvenir. The base should include a decorative plaque or label showing the city or location name (use external master prompt text if provided; otherwise invent a plausible destination name).

Ensure the entire snow globe — glass sphere and base — is fully visible within the frame. The globe should appear photographed on a surface or held in a hand, not floating in space.

The final image should feel charming, slightly kitschy, nostalgic, and unmistakably like a real souvenir snow globe, clearly readable on a small screen.`},{name:"SOAKED",category:["HUMOR","REALISM","WATER"],message:`Take a picture of the subject and make it look like they have just been completely drenched with water.

Hair, clothing, and skin should all appear visibly wet, with dripping water and darkened fabric.

The subject should look surprised, annoyed, or exhausted from being soaked.

Water droplets, puddles, or splashes should be visible to sell the realism.

The final image should look like it was captured seconds after a big splash or water dump.`},{name:"SOLARPUNK",category:["SCI FI","NATURE","UTOPIAN"],message:"Take a picture and transform the scene into a solarpunk future. Green architecture, renewable energy, optimistic tone."},{name:"SOUL-VANA",category:["HUMOR","SATIRE","URBAN","ABSURD"],message:`Take a picture and transform the scene into a massive human-dispensing tower inspired by car vending machines.

Replace cars with people. The tower should be a tall, cylindrical or rectangular glass structure filled with individual human-sized compartments, each containing a different person posed stiffly like a display item. The subject must appear inside one of the compartments, clearly visible, as if they are waiting to be dispensed.

Render the humans as intact, clothed, and calm — no distress, no danger, no violence. The tone should be surreal and comedic, not dark. Humans should feel more like oversized gumballs or capsule toys than trapped people.

Include clear visual cues that this is a vending-style system:
• a large mechanical claw, elevator platform, or rotating carousel mechanism
• numbered slots or bays
• soft interior lighting inside each compartment
• reflections and glass glare to sell realism

Add bold branding on the tower reading “SOUL-VANA” in large, modern lettering. Optional smaller flavor text may include humorous corporate slogans such as:
• “Dispensing Personalities Since Today”
• “Find Your Next You”
• “Low Mileage Humans Available Now”

If external master prompt text is provided, use it to customize:
• the city or location of the tower
• slogans, labels, or marketing copy
• which slot the subject occupies

The environment should resemble an urban plaza or parking structure, with scale clearly communicated by surrounding buildings or people. Ensure the entire tower and the subject’s compartment are fully visible within the frame.

The final image should feel like a glossy promotional photo for an absurd tech startup — clean, corporate, ridiculous, and immediately readable on a small screen.`},{name:"SOUTH PARK",category:["ANIMATION","CARTOON","TV"],message:`Take a picture in the style of a South Park cartoon scene with flat colors, simple shapes, blocky limbs, and exaggerated expressions. Maintain the subject’s recognizable facial identity in the South Park style.

The subject must be the main character, but include other South Park characters in the scene interacting naturally — they can be main kids, adults, or background townsfolk.

Backgrounds should reflect South Park settings: streets, schools, mountains, or indoors, keeping the simple geometric style and flat color palettes.

The final image should look like a fully composed South Park scene with the subject fully integrated among other characters, maintaining the show’s signature humor and aesthetic.`},{name:"SOUVENIR GONE WRONG",category:["HUMOR","TOURIST","TRAVEL"],message:"Take a picture and frame the subject like a classic tourist souvenir photo in front of a famous landmark. The subject should be posing confidently as if capturing a perfect travel photo, while unexpected chaos, absurd events, or humorous interruptions happen in the background (for example: animals photobombing, sudden weather, confused crowds, or strange events). Keep the subject calm and unaware while the background tells a funny or surprising story."},{name:"SPACE",category:["SPACE","ASTRONAUT","SCI FI"],message:"Take a picture and place the subject in a space station wearing a space suit. The Earth is visible in the background. Make it photorealistic."},{name:"SPANISH BAROQUE",category:["ART","PAINTING","SPANISH","CLASSIC"],message:"Take a picture and transform the image into a painting in the style of Diego Velázquez or similar Spanish Baroque painters. Use realistic lighting, subtle color palettes, and detailed textures. Capture the subject naturally, with dramatic depth and elegant composition reminiscent of 17th-century Spanish portraiture. Imbue the image with profound religious fervor, stark realism, and dramatic use of tenebrism to evoke strong emotions and piety."},{name:"SPIELBERG FILM",category:["HUMOR","MOVIES","SCENE","ADVENTURE"],message:`Take a picture of the subject and place them into a famous Spielberg movie scene, such as *E.T.*, *Jaws*, *Saving Private Ryan*, *Schindler's List*, *The Goonies*, *Jurassic Park*, or *Indiana Jones*.

The subject should appear as the central figure, interacting with the iconic environment or objects — holding the glowing finger in E.T., facing a dinosaur, or pulling a dramatic stunt in Indiana Jones style.

Lighting, perspective, and props should match the original film, making it cinematic and realistic.

Optional master prompt text can influence which film or scene is used, or add a humorous twist (e.g., subject holding the alien wrong, tripping over a dinosaur, or wearing a ridiculous explorer hat).

The final image should feel like a real movie still starring the subject, instantly recognizable as Spielberg-style adventure, with humor or absurdity added.`},{name:"SPONGEBOB SQUAREPANTS",category:["CARTOON","ANIMATION","ABSURD","UNDERWATER"],message:`Take a picture and transform the subject into a bright, underwater cartoon world inspired by SpongeBob SquarePants.

STYLE & CHARACTER RULES:
• Thick black outlines and highly simplified shapes
• Bright, saturated colors with minimal shading
• Exaggerated facial expressions and elastic cartoon anatomy
• The subject must be transformed into a SpongeBob-style character while retaining recognizable facial features
• Include multiple underwater cartoon characters native to this world

SCENE & TONE:
• Underwater setting with coral, sand, bubbles, and whimsical ocean props
• Absurd, energetic, and slapstick tone
• Cartoon physics encouraged — stretched poses, goofy expressions, exaggerated reactions

COMPOSITION:
• Clear, readable foreground characters
• Simple but iconic underwater environments
• No realism, no cinematic lighting, no gritty textures

The final image should look like a fully composed SpongeBob SquarePants–style hand-drawn illustration with the subject and additional characters integrated seamlessly into the world.`},{name:"SPORTS TROPHY",category:["HUMOR","AWARD","METALLIC"],message:"Take a picture and transform the subject into an actual sports trophy. The subject's upper body and head should be rendered in shiny gold, silver, or bronze metal posed triumphantly on a wooden or marble base. Preserve their facial features and expression in metallic form as if they're a commemorative statue-trophy. Include an engraved plaque on the base with humorous award text. Show realistic metal reflections, trophy cup handles if appropriate, and that distinctive trophy sheen. Place on a shelf or display case with dramatic lighting."},{name:"SPOT THE DIFFERENCE",category:["PUZZLE","GAME","ACTIVITY"],message:`Take a picture and duplicate it into two side-by-side frames showing the same scene. Keep the left frame as the original reference image.

Ensure the subject and all objects remain **exactly in the same position and fully visible** in both frames unless an object is intentionally removed. The subject should not be tilted or cropped out of frame; the entire area should be consistently in view on both sides.

In the right frame, introduce **5–7 subtle but clearly noticeable differences** in objects, colors, accessories, or minor details, such as:
• Removing or adding small objects
• Altering colors of items or clothing
• Slightly repositioning accessories or props (without moving the subject)
• Changing minor details of clothing, eyes, haircolor, hairstyle, or props
• Adjusting the size of small items or background elements

Do not add labels, arrows, or text. The two images should be aligned, evenly sized, and easy to compare on a small screen. The final result should resemble a classic children’s "find the differences" puzzle, with differences discoverable but the overall scene consistent and fully framed.`},{name:"STADIUM CROWD SIGN",category:["HUMOR","MASTER PROMPT","SPORTS","PHOTO EFFECT"],message:`Take a picture and place the subject inside a live sports stadium crowd. The subject should blend naturally into the audience, wearing a team jersey and appearing as one of many fans.

The subject must be holding a handmade or printed sign with a funny message inspired by flavor text or externally appended language. The sign should be readable but not oversized, matching real fan-made stadium signs.

Compose the scene so the subject is not immediately obvious at first glance. The viewer should discover the subject by scanning the crowd. Use realistic stadium lighting, depth, motion blur, and crowd density.

Ensure the subject, sign, and surrounding fans feel cohesive and photoreal. The final image should feel like a real moment captured during a live sporting event.`},{name:"STAGE PLAY MELTDOWN",category:["HUMOR","THEATER","DISASTER"],message:`Take a picture of the subject in the middle of a live stage play that is visibly falling apart.

Show obvious failures such as collapsing sets, broken props, missed cues, tangled costumes, or confused actors.

Stage lights, curtains, and audience reactions should be visible.

The subject should appear embarrassed, panicked, or frozen mid-mistake.

The final image should feel like a candid theater disaster moment.`},{name:"STAINED GLASS",category:["ART","GLASS","CHURCH"],message:"Take a picture and transform the image into a stained-glass artwork. Bold lead outlines, translucent color panels. Light glowing through the glass."},{name:"STANDING NEXT TO",category:["HUMOR","CELEBRITY","MASTER PROMPT","MASHUP"],message:"Take a picture and add a FAMOUS PERSON standing next to the subject. Match lighting and scale realistically."},{name:"STAND-UP COMEDIAN",category:["HUMOR","PERFORMANCE","STAGE","POP CULTURE"],message:`Take a picture and transform the subject into a stand-up comedian performing live on stage.

Place the subject on a comedy club stage with a microphone stand, spotlight lighting, and a classic stand-up backdrop such as a brick wall or dark curtain. The subject should appear mid-performance, holding or standing near the microphone, with posture and expression adapted from the subject’s real demeanor (confident, awkward, smug, confused, etc.).

Dress the subject in classic stand-up attire appropriate to a comedy club — casual jacket, button-down, t-shirt, or minimalist stage outfit — adapted naturally from the subject’s original clothing when possible.

Include ONE clearly readable on-screen joke caption, presented as part of the performance (subtitle, lower-third, or stage sign). The joke should be EITHER:

• a REAL, VERBATIM one-liner (under 90 characters) from a famous one-liner comedian, OR
• an ORIGINAL one-liner written in the STYLE of those comedians

When using a verbatim joke, randomly select from the comedic voices of:
• Stephen Wright
• Rodney Dangerfield
• Mitch Hedberg
• Norm Macdonald
• Anthony Jeselnik
• Jimmy Carr
• Henny Youngman

Verbatim jokes must be short, classic one-liners only (no long bits, no monologues), and must remain under 90 characters.

Optionally include subtle comedy-club details such as:
• a fake venue name or special title inspired by the subject
• a small audience silhouette or dimly lit crowd
• a mock comedy special title using flavor text (e.g., “Live From Poor Decisions”)

Ensure the full stage scene, subject, and joke text are fully visible and readable on a small screen. The final image should feel like a paused frame from a real comedy set — uncomfortable, confident, funny, and unmistakably stand-up.`},{name:"STAR TREK",category:["TV","SCI FI","SPACE","STAR TREK"],message:"Take a picture and place the subject on the bridge of the Starship Enterprise dressed in a Star Trek uniform. Make it photorealistic."},{name:"STAR WARS",category:["MOVIES","SCI FI","SPACE","STAR WARS"],message:"Take a picture and place the subject in a scene from the movie Start Wars.  Subject is dressed like a character in the movie. Make it photorealistic. Sci-fi realism."},{name:"STATUE",category:["SCULPTURE","BRONZE","MONUMENT"],message:"Take a picture and make subject into a bronze statue. Aged patina, sculptural realism."},{name:"STATUE OF LIBERTY",category:["HISTORY","MONUMENT","TRANSFORMATION","ICONIC"],message:`Take a picture and transform the subject so their face becomes the face of the Statue of Liberty.

CORE REQUIREMENT:
• The subject’s face must be transformed to appear as if it were sculpted as part of the Statue of Liberty
• This is NOT a face overlay or pasted photograph

FACIAL TRANSFORMATION (CRITICAL):
• Convert the subject’s facial features into carved stone form
• Match the Statue of Liberty’s scale, proportions, and facial structure
• Apply the statue’s oxidized copper-green coloration uniformly
• Texture must resemble aged metal or stone, not skin
• Facial expression should remain neutral and stoic

INTEGRATION RULES:
• The subject’s likeness must remain recognizable through sculptural form
• No photographic skin, pores, or modern detail
• No visible seams, edges, or overlays

SCENE & STYLE:
• Match the lighting and atmosphere of the real Statue of Liberty
• Sky, torch, crown, and drapery should feel monumental and authentic
• No cartoon exaggeration

FINAL RESULT:
An image where the subject looks as if they were the original sculptural model for the Statue of Liberty, fully integrated into the statue’s material, scale, and historic presence.`},{name:"STENCIL",category:["ART","GRAFFITI","STREET"],message:"Take a picture in the style of Stencil Art. High contrast, limited color palette."},{name:"STEREOSCOPE",category:["PHOTOGRAPHY","3D","VINTAGE"],message:"Take a picture and create a stereoscopic 3D side-by-side image from the photo. Maintain alignment and scale between left and right views. Subtle parallax for depth without distortion."},{name:"STEVEN UNIVERSE",category:["CARTOON","ANIMATION","PASTEL","EMOTIONAL"],message:`Take a picture and transform the subject into a soft, pastel-toned cartoon world inspired by Steven Universe.

STYLE & CHARACTER RULES:
• Rounded, gentle character designs
• Soft linework and warm pastel color palette
• Expressive but calm facial expressions
• Include multiple humanoid or magical characters that feel emotionally grounded

SCENE & TONE:
• Dreamlike, peaceful, and emotionally resonant
• Scenic backgrounds such as beaches, temples, or abstract landscapes
• Emphasis on mood and harmony

The final image should look like a fully composed Steven Universe–style hand-drawn illustration with the subject and additional characters integrated seamlessly into the world.`},{name:"STL FILE PREVIEW",category:["3D","TECH","MODELING","DIGITAL"],message:"Take a picture and transform the subject into a 3D STL file mesh preview as seen in 3D modeling software. Convert the subject into a three-dimensional triangulated mesh model displayed in typical STL viewer aesthetic. Show the subject rendered entirely as a polygonal mesh surface made of countless small triangles - visible triangle faces covering the entire form, sharp geometric facets, no smooth surfaces. Use monochrome solid color typical of STL previews - light gray, white, or cyan mesh on dark background. Display the model in 3D modeling software interface style: floating in black or gradient void, visible XYZ axis indicators (red X, green Y, blue Z arrows), grid floor plane underneath, wireframe or solid shaded view. Include technical overlay elements: triangle/polygon count displayed, file size, dimensions in millimeters, rotation widgets, view controls (front/side/top buttons). Show the model from a 3/4 perspective view revealing dimensional depth. Add 3D software UI elements around edges: toolbar icons, mesh info panel, layer controls. The mesh should have that characteristic low-poly STL look - geometric approximation of curves, stair-stepping on rounded edges, visible faceting, hard angles where triangles meet. Make it look like a screenshot from 3D printing software (Cura, PrusaSlicer) or CAD viewer showing the subject as a ready-to-print 3D model file with technical mesh visualization."},{name:"STORY MOMENT",category:["NARRATIVE","DRAMATIC","CINEMATIC"],message:"Take a picture and transform the image into a single dramatic story moment. Imply what happened before and what will happen next through visual clues. Cinematic composition."},{name:"STRANGER THINGS",category:["TV","SCI-FI","HORROR","RETRO","80S"],message:`Take a picture and place the subject directly into the world of an 1980s supernatural small-town thriller inspired by Stranger Things.

SUBJECT INTEGRATION:
• The subject must appear as a character living in this world, not pasted or staged
• Preserve the subject’s recognizable facial features and likeness
• Age, wardrobe, and styling should feel appropriate to the mid-1980s
• The subject may appear as a kid, teen, or adult depending on the photo

STYLE & AESTHETIC:
• Cinematic, moody lighting with strong shadows
• Cool blue tones mixed with warm practical lights (lamps, flashlights, neon signage)
• Subtle film grain and shallow depth of field
• Realistic but stylized TV-cinematic look — not cartoonish

WORLD & ENVIRONMENT:
• Small-town 1980s settings: suburban streets, school hallways, basements, forests, arcades, or labs
• Include period-accurate details: bikes, walkie-talkies, arcade machines, CRT TVs, cassette tapes
• Optional supernatural elements: flickering lights, creeping shadows, strange particles in the air, organic otherworldly textures

SUPERNATURAL RULES:
• Horror should feel tense and atmospheric, not gory
• Any creatures or anomalies must remain partially obscured, silhouetted, or hinted at
• Emphasize suspense, curiosity, and mystery

EMOTIONAL TONE:
• Unease mixed with wonder
• Friendship, bravery, and small-town isolation
• The feeling that something strange is happening just out of view

COMPOSITION RULES:
• The subject must be clearly part of the scene, interacting naturally with the environment
• No modern objects or clothing
• No parody or satire

FINAL RESULT:
The image must look like a dramatic frame from an 80s supernatural TV series, with the subject seamlessly integrated into a Stranger Things–inspired world, as if they were always part of the story.`},{name:"STREAMING",category:["ENTERTAINMENT","TV","FILM","PARODY","PLATFORM UI"],message:`Take a picture and place the subject into an existing streaming-platform show or movie presentation.

PLATFORM SELECTION:
Use ONE streaming platform, selected either automatically or via master prompt:
• Netflix
• Disney+
• Paramount+
• HBO Max
• Hulu
• Amazon Prime Video

The final image MUST look like the ACTUAL SCREEN INTERFACE of the selected platform — not just a scene from a show.

CRITICAL PLATFORM UI REQUIREMENTS:
• The image must be framed as a streaming app screen
• Include recognizable UI elements appropriate to the platform:
  – Platform-specific layout style
  – Content tiles, thumbnails, or hero banner
  – Progress bar, play button, episode selector, or category row styling
• Typography, spacing, and layout must clearly resemble the chosen platform’s real interface
• The subject must appear INSIDE the show/movie artwork or scene — not floating above the UI

SUBJECT INTEGRATION:
• The subject replaces or joins a character within the selected show or movie
• Lighting, costume, pose, and environment must match the original production
• The subject should look like they were actually cast in the show or film
• Preserve realism — not cartoon or illustration

SHOW / MOVIE PRESENTATION:
• Display a title card, hero banner, or featured tile
• Include flavor text describing the show or movie in the style of the platform
• Flavor text may be humorous, absurd, or exaggerated, but must feel authentic to streaming descriptions

FLAVOR TEXT RULES:
• Written like a real streaming synopsis
• May describe the subject’s role, bizarre plot twist, or ridiculous premise
• If master prompt text is provided, use it as the synopsis or tagline
• Otherwise invent a parody description appropriate to the platform

EXAMPLES (STYLE ONLY):
• “A gritty reimagining nobody asked for.”
• “One person. One mistake. Eight episodes too many.”
• “Critics hated it. Viewers watched it anyway.”

ABSOLUTE PROHIBITIONS:
• DO NOT show a generic TV screen
• DO NOT invent fake platforms
• DO NOT ignore platform-specific UI styling
• DO NOT place the subject outside the show artwork

FINAL RESULT:
The image must look like a real screenshot of a streaming platform interface, featuring an actual show or movie with the subject seamlessly integrated as part of the cast — complete with authentic layout, platform-specific visual language, and humorous but believable streaming flavor text.`},{name:"STREET ART",category:["ART","GRAFFITI","URBAN"],message:"Take a picture and transform the image into contemporary street art. Gritty textures, stenciled patterns, expressive composition, and urban color palette on a concrete or brick surface."},{name:"STRETCH ARMSTRONG",category:["TOY","RETRO","STRETCHED"],message:`Take a picture and transform the subject into a Stretch Armstrong–style action figure made of thick, rubbery material. Preserve the subject’s recognizable facial features while adapting them into a toy-like appearance with smooth skin, simplified details, and a slightly exaggerated jaw and expression.

Depict the subject’s arms, legs, or torso being stretched far beyond normal proportions, as if pulled by unseen hands or tension just outside the frame. The stretched areas should look elastic and dense, with believable thickness, subtle surface creases, and realistic stretch deformation rather than thin distortion.

Ensure the subject still resembles a physical toy: solid core, rounded forms, and consistent material texture. Use lighting and shadows that emphasize volume and rubbery sheen. Do not show injuries or damage. The final image should feel playful, nostalgic, and clearly readable on small screens.`},{name:"STRONGMAN",category:["HUMOR","STRENGTH","EXAGGERATED","PERFORMANCE"],message:"Take a picture and transform the subject into an old-timey circus strongman effortlessly lifting impossibly heavy objects that are visible in the original image. Identify large, heavy objects in the scene - cars, furniture, trees, boulders, appliances, other people - and show the subject lifting them overhead with one hand or holding them in exaggerated strongman poses. Dress the subject in classic strongman attire: handlebar mustache, tight-fitting leopard print or striped unitard/leotard, championship belt, wrist bands, boots. Give them an exaggerated muscular physique with bulging biceps and theatrical pose. Their expression should be confident and theatrical - flexing, showing off, or straining dramatically. The lifted objects should be comically oversized or clearly impossible to lift - entire cars, grand pianos, elephants, statues. Add vintage circus poster aesthetic if desired, or keep it photorealistic showing the absurd strength. Include amazed onlookers in background if present, or circus tent setting. Use dramatic lighting with spotlight effect. The contrast between ordinary objects in the scene and the subject's superhuman ability to lift them should be the humor. Make it look like a vintage strongman performance photo or circus advertisement showing impossible feats of strength."},{name:"STUCK IN WASHING MACHINE",category:["HUMOR","PREDICAMENT","SITCOM"],message:"Take a picture and transform the scene into a classic sitcom predicament: the subject hilariously stuck halfway in a front-loading washing machine. CRITICAL: The subject's face and neck must be visible and outside the washing machine - they are stuck with their head and neck outside while the rest of their body is trapped inside the machine. Show the subject's face clearly with an expression of embarrassment, frustration, or comedic despair. Their upper body should be leaning back or struggling to pull themselves out while their bottom half is wedged in the washing machine opening. The subject might be gripping the sides of the machine trying to extract themselves. Include wet laundry spilling out around them. Place the scene in a laundry room setting with washer/dryer, detergent bottles, laundry baskets. Include a second person looking bewildered, trying to help pull them out by their arms, or laughing at the situation. Use exaggerated physical comedy pose with bright sitcom lighting and that specific 'how did we get into this situation?' energy. Make it look like a freeze-frame from a 90s family sitcom showing the subject's embarrassed face clearly visible as they're stuck in an absurd but family-friendly predicament."},{name:"STUDENT ID",category:["HUMOR","ID","MASTER PROMPT","SCHOOL"],message:"Take a picture and create a realistic but clearly fictional student identification card featuring the subject’s photo. Style the photo to resemble a typical campus ID picture, with slightly awkward framing, flat lighting, mild motion blur or softness, and an unpolished snapshot quality rather than a flattering portrait. Design the ID to resemble the general style of a school or university commonly found near the subject’s location, using a fictional institution name inspired by regional themes. Include placeholder text, sample ID numbers, and decorative elements only. Preserve the subject’s recognizable facial features and neutral or mildly awkward expression. The final image should appear as a novelty or prop-style student ID, clearly non-functional and created for artistic purposes."},{name:"STUNT PERFORMER",category:["ACTION","MOVIES","DRAMATIC","ATHLETIC"],message:"Take a picture and transform the subject into a professional stunt performer executing an incredible action stunt. Show them mid-stunt in a dramatic freeze-frame moment - leaping between buildings, diving through explosions, hanging from helicopters, performing precision motorcycle jumps, or executing complex martial arts moves in mid-air. The subject should look intense, focused, and athletic with perfect form despite the danger. Include cinematic action movie elements: explosions with fire and debris in background, shattered glass particles frozen in air, dramatic backlighting, motion blur on fast-moving elements while subject stays sharp, sparks flying, smoke and dust clouds. Use dynamic camera angles - low angle hero shots, dramatic perspectives that emphasize height or danger. Show safety wires digitally removed for that authentic stunt aesthetic. Include protective gear where appropriate - knee pads under ripped jeans, practical costume that allows movement, maybe visible bruises or dirt showing this is real physical work. Capture that Hollywood action movie magic moment with perfect timing, dramatic lighting with rim lights and practical fire sources, and that sense of controlled chaos. Make it look like a frame from a big-budget action film where the subject is the fearless stunt double performing an impossible feat."},{name:"SUBWAY AD",category:["HUMOR","ADVERTISING","SCENE"],message:`Take a picture of the subject and place them inside a subway car covered in a large, awkward public advertisement featuring them.

The ad should imply the subject has a mildly embarrassing but non-explicit problem such as bad breath, flatulence, excessive sweating, or bladder leaks.

Choose one of these situations at random and build the ad around it:
• Bad breath → a real mint or mouthwash product
• Flatulence → a real digestive aid or deodorizing spray
• Heavy sweating → a real strong deodorant
• Bladder leaks → real protective undergarments

The ad should show the subject’s face with a big headline and product branding, making it look like they are the unfortunate model for the problem.

People around the subject in the subway should be reacting awkwardly, staring, or trying not to laugh.

The final image should look like a real transit advertisement gone terribly wrong, with bold text, clean design, and very public embarrassment.`},{name:"SUPERHERO",category:["COMICS","SUPERHERO","ACTION"],message:"Take a picture and transform the subject into a superhero from the DC or Marvel universe, preserving recognizable facial features and characteristics. Depict the subject performing an act of heroism or saving the day in a dramatic action scene, such as stopping a runaway train, rescuing civilians, or confronting a villain. Include dynamic superhero attire inspired by the subject’s clothing, colors, and traits, with capes, emblems, and iconic superhero elements. Use cinematic lighting, dramatic angles, and dynamic motion for a visually striking composition."},{name:"SUPREMES",category:["HUMOR","POLITICAL","JUDICIAL","FORMAL"],message:"Take a picture and place the subject as a Supreme Court Justice, replacing one of the current sitting justices in an official Supreme Court group portrait. Dress the subject in the traditional black judicial robe with all authentic details - flowing black fabric, white collar bands or jabot visible at neck, long sleeves. Place them seated or standing in the formal Supreme Court portrait arrangement - traditionally the Chief Justice seated center with Associate Justices arranged by seniority, seated in front row and standing in back row. The setting should be the Supreme Court chamber or official portrait room with characteristic elements: rich burgundy curtains in background, ornate classical columns, formal portrait lighting, American flags, the court's seal visible. Other current justices should be visible in the portrait around the subject, all in their robes in formal poses. The subject should maintain a serious, dignified judicial expression - neutral face, direct gaze at camera, authoritative bearing befitting the highest court. Use formal portrait photography style - professional lighting, sharp focus, traditional composition, muted color palette. Include the formal gravitas of official government portraiture - no smiling, stately poses, hands clasped or resting formally. The subject should look like they've been officially sworn in and are now part of the nine-justice bench. Make it look like an actual official Supreme Court group photograph with the subject seamlessly integrated as one of the justices."},{name:"SURREAL LANDSCAPE",category:["ART","SURREAL","LANDSCAPE"],message:"Take a picture and transform into a surreal landscape featuring a dreamlike quality pushing the boundaries of reality. Conjure a scene that has imaginative and otherworldly elements."},{name:"SURREALISM",category:["ART","SURREAL","DREAMLIKE"],message:"Take a picture in the style of Surrealist art. Include dreamlike imagery, illogical juxtapositions, automatism, vivid dream imagery, symbolism, and a sense of absurdity."},{name:"TABLOID",category:["NEWS","SENSATIONAL","SCANDAL"],message:'Take a picture in the style of a Newspaper tabloid. The tabloid is the National Equirer. Headline: "SCANDAL!!!".'},{name:"TAPESTRY",category:["ART","TEXTILE","MEDIEVAL"],message:"Take a picture and convert the image into a woven tapestry. Textile texture, medieval storytelling style."},{name:"TARANTINO FILM",category:["MOVIES","DIRECTOR","ACTION","DRAMATIC"],message:"Take a picture and place the subject into a Quentin Tarantino film scene. Use Tarantino's signature visual style: bold saturated colors, Dutch angles, dramatic low-angle hero shots, and stylized violence aesthetic. Show the subject in a tense standoff, cool walking shot, or intense dialogue moment. Include Tarantino's trademark elements: retro 1970s aesthetics, vintage cars, diners or seedy locations, bold typography for potential chapter titles. Use high contrast lighting, sunlit exteriors with lens flares, or moody interior amber lighting. Capture his style of making ordinary people look impossibly cool - sharp suits, leather jackets, sunglasses, confident poses. Add that Tarantino energy of stylized realism where everything is heightened, dangerous, and effortlessly badass. Make it look like a freeze-frame from Pulp Fiction, Kill Bill, or Reservoir Dogs."},{name:"TAROT CARD",category:["MYSTICAL","CARD","FORTUNE"],message:"Take a picture and transform the subject into a detailed tarot card illustration. Depict the subject as the central figure, preserving recognizable facial features and posture while adapting them into a stylized, symbolic art style inspired by traditional tarot imagery. Surround the subject with meaningful symbols, patterns, and motifs drawn from the subject’s appearance and surroundings. Include a decorative border and a card title at the top or bottom. Ensure the composition resembles a complete tarot card, with balanced layout, rich illustration detail, and a timeless, mystical aesthetic. The result should be a full view of the card with a relevant background behind the card."},{name:"TEA FOAM / MATCHA ART",category:["BEVERAGE","TEA","FOAM ART","TRANSFORMATION","MASTER PROMPT"],message:`Take a picture and transform the subject so that the subject exists ONLY as tea foam or matcha powder art on the surface of a real cup of tea.

The subject MUST be formed entirely from:
• Milk foam
• Tea foam
• Matcha powder
• Tea crema
• Natural liquid contrast

ABSOLUTE REQUIREMENT:
The subject may NOT exist as a photograph, reflection, illustration, or object inside the cup.

DO NOT paste, overlay, trace, silhouette, or embed the subject into the drink.

The subject MUST be CREATED by foam density, powder placement, liquid flow, and contrast — as if crafted by a skilled tea artist.

Allowed beverages include:
• Matcha latte
• Green tea with foam
• Milk tea
• Chai latte
• Hojicha latte
• Foam-topped herbal tea

Construction rules:
• Dark areas formed by dense matcha powder or tea crema
• Light areas formed by milk foam or microfoam
• Lines and edges formed by natural foam separation or etched tool strokes

Shading and detail MUST come ONLY from:
• Foam thickness variation
• Powder density
• Liquid diffusion
• Subtle etching marks made with a tea pick or toothpick

The foam must behave realistically:
• Soft edges
• Slight bubbles
• Uneven texture
• Natural liquid bleed
• No hard graphic outlines

The cup, rim, and environment must look real and photographic.

The subject MUST appear only on the surface of the tea.

FINAL VALIDATION RULE:
If the image looks like a normal photo placed inside a cup, IT IS WRONG.

The final image must look like a real cup of tea photographed in natural light, with the subject miraculously formed from tea foam or matcha art.`},{name:"TEXT LOGO",category:["DESIGN","UTILITY","LOGO","TYPOGRAPHY"],message:`Take a picture and generate a minimal logo derived purely from text, such as initials, monograms, or typographic lettermarks. This mode affects header branding only.

Do not introduce pictorial icons, illustrations, or decorative graphics. The logo should be subtle, professional, and typography-driven, integrating naturally into the existing header without altering layout hierarchy.

If other document or legal modes are active, ensure the logo remains understated and does not compete with formal structure.`},{name:"THERMAL",category:["PHOTOGRAPHY","THERMAL","HEAT"],message:"Take a picture and transform the image into thermal imaging. False-color heat mapping. High contrast."},{name:"THREE WISE MONKEYS",category:["HUMOR","POSE","SYMBOLIC","CLASSIC"],message:`Take a picture of the subject and recreate the classic 'Three Wise' concept: See No Evil, Hear No Evil, Speak No Evil — using the subject’s head and hands.

COMPOSITION (CRITICAL):
• Create THREE versions of the subject in a single image
• All three must be the same subject, evenly spaced side-by-side

POSES:
1) See No Evil:
• Subject’s hands fully cover their eyes

2) Hear No Evil:
• Subject’s hands fully cover their ears

3) Speak No Evil:
• Subject’s hands fully cover their mouth

RULES:
• Hands must physically block the features — not float or hover
• Facial proportions, lighting, and perspective must remain consistent across all three figures
• Each version must clearly resemble the same subject

STYLE:
• Can be realistic, painterly, or stylized, but must feel intentional and cohesive
• Neutral or simple background to emphasize the poses

FINAL RESULT:
The image should read instantly as a humorous, symbolic 'Three Wise' interpretation using the subject themselves, clearly showing all three concepts without ambiguity.`},{name:"TIBETAN THANGKA",category:["ART","RELIGIOUS","ASIAN"],message:"Take a picture and transform the image into Tibetan Thangka style painting. Highly detailed line work, symbolic composition, rich colors, and spiritual iconography."},{name:"TIKTOK CHALLENGE",category:["SOCIAL MEDIA","VIRAL","MODERN","DANCE","TREND"],message:"Take a picture and place the subject performing one of the viral TikTok or social media challenges. Choose from popular challenges: doing a trending dance (Renegade, Savage, WAP dance, Supalonely, Jerk dance, Harlem Shake), the Ice Bucket Challenge (bucket of ice water being dumped over head, shocked expression, freezing cold reaction), Milk Crate Challenge (climbing unstable pyramid of stacked crates, mid-fall or wobbling), Silhouette Challenge (striking poses in doorway with red filter effect), Buss It Challenge (transformation from casual to glam outfit mid-drop), Flip the Switch Challenge (outfit swap with another person mid-dance), Don't Rush Challenge (makeup transformation with brush toss between people), Wipe It Down Challenge (mirror cleaning reveals multiple costume/character changes), Plank Challenge (planking in dangerous or unusual locations), Mannequin Challenge (frozen mid-action), Bottle Cap Challenge (roundhouse kicking cap off bottle), In My Feelings Challenge (dancing next to moving car), Salt Bae Challenge (dramatically sprinkling salt), Tide Pod Challenge (DO NOT actually eat - show comedic reaction to colorful pod), or Cinnamon Challenge (attempting to swallow cinnamon, coughing disaster). Show the subject mid-challenge with characteristic TikTok aesthetic: filmed vertically in 9:16 ratio, ring light creating distinctive even lighting, trendy bedroom or bathroom background, TikTok interface elements visible (heart and comment icons on right side, song title and username at bottom, 'For You' page indicators, view count). Include motion blur for dance movements, multiple exposure effects for transformation challenges, water splash frozen mid-air for Ice Bucket. The subject should wear trendy Gen-Z fashion. Show smartphone recording setup visible. Make it look like an actual screenshot from a viral TikTok video mid-challenge."},{name:"TILT-SHIFT",category:["PHOTOGRAPHY","MINIATURE","BLUR"],message:"Take a picture and Apply tilt-shift photography effect. Selective focus creating a miniature diorama look. Blurred foreground and background."},{name:"TIM BURTON MOVIE",category:["MOVIES","FANTASY","GOTHIC","DIRECTOR","WHIMSICAL"],message:`Take a picture and transform the subject into a character within a Tim Burton film universe, randomly selecting from one of his classic movies: Edward Scissorhands, The Nightmare Before Christmas, Batman, Frankenweenie, Beetlejuice, Big Eyes, Mars Attacks!, Corpse Bride, or similar Burton films.

Transform the subject to match Tim Burton's signature visual style: pale skin with dark shadows under eyes, exaggerated features, elongated proportions, wild unkempt hair (often black with dramatic styling), dramatic makeup with dark eyes, gothic or quirky costume design with striped patterns, mismatched fabrics, Victorian-inspired clothing, or unusual color combinations (black, white, purple, deep reds).

Place the subject within an iconic scene from the chosen film with other characters from that movie present. The environment should capture Burton's distinctive aesthetic: twisted architecture, spiraling designs, forced perspective, gothic elements mixed with whimsy, stark contrast between light and shadow, surreal proportions, and his signature color palette.

The subject should be styled as if they belong in that specific Burton film - whether as a suburban character with pastel gothic twist, a stop-motion animated figure, a striped-suit wearing ghost, a gothic creature, or Victorian-era character depending on which film is selected. Preserve recognizable features while adapting them to Burton's exaggerated, slightly macabre artistic vision.

Lighting should be dramatic with strong contrasts - deep shadows, pools of light, moonlit scenes, or that distinctive Burton glow. The atmosphere should feel both whimsical and slightly dark, fantastical yet melancholic.

The final image should look like an actual still from a Tim Burton film - gothic, whimsical, visually striking, with exaggerated proportions and that unmistakable Burton aesthetic. The subject should be seamlessly integrated into the film's world alongside other iconic characters from that movie.`},{name:"TIME DILATION",category:["SCI FI","TIME","MOTION"],message:"Take a picture and depict the image as if time is slowed or fractured. Motion echoes, temporal distortions."},{name:"TIME MAGAZINE",category:["NEWS","MAGAZINE","COVER"],message:'Take a picture in the style of a polished TIME magazine cover. Title: "PERSON OF THE YEAR".'},{name:"TINY SELVES",category:["ILLUSION","MOSAIC","RECURSIVE"],message:"Take a picture and transform the subject so that their entire face and body are composed exclusively from hundreds of tiny, complete versions of the subject. There must be NO underlying full-size face, skin, or body visible anywhere. Every facial feature (eyes, nose, mouth), contour, and body shape must be formed only by the placement, density, and orientation of the tiny figures. The tiny versions should act like living building blocks, posed and arranged to define edges, shading, and structure. From a distance, the subject must read clearly as a complete human figure; up close, the image must resolve entirely into individual miniature subjects. Use consistent lighting and perspective so the construction feels intentional, surreal, and visually mind-bending. Do not partially fill, overlay, or decorate a normal body — the tiny figures ARE the body."},{name:"TINY WORLD",category:["MINIATURE","TILT SHIFT","SMALL"],message:"Take a picture and transform the scene so the subject appears miniature. Environment becomes massive. Tilt-shift realism."},{name:"TONIGHT SHOW INTERVIEW",category:["TV","TALK SHOW","CELEBRITY"],message:"Take a picture and place the subject on the late-night talk show set of The Tonight Show. Preserve the subject’s facial features, personality, and clothing while adapting them naturally to the environment. Include the iconic desk, host chair, stage lighting, and background elements such as cityscape backdrops. Show the subject interacting with the host, engaging in conversation, or reacting to jokes. Ensure the scene captures the lively, polished, and humorous atmosphere of the late-night talk show while keeping the subject clearly identifiable."},{name:"TOO BIG TO RIDE",category:["HUMOR","SCALE","ABSURD","REALISM"],message:`Take a picture and place the subject riding an object that is clearly designed for a much smaller being.

Choose one small rideable object: a tiny horse or pony, a child-sized tricycle, a Big Wheel, a miniature motorcycle, a unicycle, a toy-sized motorized convertible, or another obviously undersized vehicle or animal.

The SUBJECT MUST REMAIN NORMAL HUMAN SIZE.

The rideable object must remain physically small and NOT scaled up to fit the subject.

The humor must come from extreme size mismatch.

The subject should be awkwardly perched, knees bent too high, feet dragging, cramped posture, or overflowing the seat, clearly struggling to fit.

DO NOT:
• Shrink the subject
• Enlarge the object
• Float the subject above the object
• Create a cartoonish distortion unless explicitly requested

Weight interaction must be visible:
• The object compresses slightly under the subject’s weight
• Tires flatten, springs bend, animal slouches, or suspension sags
• The subject grips handles or reins tightly to maintain balance

Lighting, shadows, and perspective must match between subject and object.

The scene should look like a real photograph capturing a ridiculous but physically believable moment.

Optional master prompt text may specify the exact object, setting, or tone.

The final image must make it immediately obvious that the subject is riding something far too small for them.`},{name:"TOPIARY",category:["NATURE","SCULPTURE","GARDEN"],message:"Take a picture and transform the subject into a living topiary sculpture. Preserve the subject’s recognizable facial structure, hairstyle silhouette, body proportions, and clothing shapes translated into carefully trimmed foliage and greenery. Use dense leaves, hedges, vines, and floral textures shaped with precision pruning. The subject must appear grown organically from plants, not carved stone. Natural outdoor lighting, garden environment, and botanical realism with visible leaf detail and depth."},{name:"TOUPEE",category:["HUMOR","PORTRAIT","COSTUME"],message:`Take a picture of the subject, human or animal, and give them a very obvious, poorly fitting toupee.

The hairpiece should look fake, crooked, or slightly mismatched in color and style, making it clear it does not belong.

The subject’s original hair or fur may still be partially visible around the edges of the toupee.

The goal is for the toupee to look awkward and humorous, like it is about to fall off.

The final image should look realistic but absurd, with the bad hairpiece being the center of the joke.`},{name:"TRADING CARD",category:["SPORTS","MASTER PROMPT","CARD","COLLECTIBLE"],message:`Take a picture and transform the subject into a fully visible collectible sports trading card with a vintage 1980s/1990s style. Ensure the entire card—including all borders, portrait, background, stats, and flavor text—is fully visible and centered in the frame. Randomly assign a sport (e.g., basketball, soccer, baseball, football, tennis) for each render.

Include a clear portrait of the subject, a stylized action background, and a card border with realistic texture, embossing, and glossy surfaces. Apply worn effects such as yellowed edges, scratches, and slight discoloration for a vintage look.

Add the subject’s name, a mock team name or mascot, absurd over-the-top stats inspired by the subject’s appearance, pose, or personality (e.g., “99% chance to eat pizza mid-game,” “Can balance a coffee cup while dribbling”), and humorous flavor text describing the subject. Allow external master prompt text to be appended to the flavor text.

Ensure everything is legible on a small screen, the subject remains instantly recognizable, and the final image clearly shows the full card without cropping.`},{name:"TRADITIONAL ATTIRE",category:["CULTURE","FASHION","WORLD","TRANSFORMATION"],message:`Take a picture and transform the subject into wearing traditional attire from a specific country. 

If an external master prompt specifies a country, dress the subject in authentic traditional clothing of that country. If no country is specified, randomly select a country from the list below.

Countries and example traditional attire:

- Cuba: Guayaberas, traditional Cuban dresses
- Dominican Republic: Traditional ceremonial attire
- Nicaragua: Traditional Nicaraguan dress
- Mexico: Mariachi suits, Charras outfits
- Africa: Zulu attire, African prince/princess costumes
- Norway: Bunad
- Jamaica: Quadrille dress, Rastafarian
- Japan: Kimono (long T-shaped silk robe, wide sleeves, seasonal patterns)
- India: Sari, Sherwani, Salwar Kameez, Sikh attire
- Korea: Hanbok (jeogori jacket with chima skirt for women, baji pants for men)
- Poland: White blouse with long skirt and apron for women, long-sleeved shirt with trousers for men
- Russia: Sarafan dress with kokoshnik for women, traditional embroidered menswear
- Mongolia: Colorful ethnic costumes with intricate patterns
- Chile: Vibrant polleras, ponchos
- Ghana: Kente cloth attire
- UAE: Kandura for men, Abaya for women
- Argentina: Poncho, bombacha trousers, wide-brimmed hat, pollera skirts
- Peru: Poncho, pollera, chullo hat
- Brazil: Baiana dress, Bombacha trousers, Camisa de Botão
- Colombia: Sombrero Vueltiao, colorful polleras
- Canada: Hudson's Bay blanket coats, buckskin dresses, Mackinaw jackets
- USA: Colonial attire, Christian folk costumes
- Algeria: Djellaba, haik, Karako, burnous
- Tunisia: Jebba, Kaftans, Djebba, Kamis
- Nigeria: Agbada, Isiagu, Babban Riga, Buba, Sokoto
- Morocco: Djellaba, Kaftan
- Egypt: Kalasiris dress, tunics, head coverings
- Armenia: Taraz attire, long embroidered robes
- Malaysia: Baju Melayu for men, Baju Kurung for women
- Pakistan: Shalwar Kameez, Sherwani
- Iran: Qaba, Chador, Pirahan, Aba
- Turkey: Kaftan, Yelek, Şalvar, Fes
- Syria: Thoub robe, Sirwal pants, Bisht cloak, Abaya
- China: Hanfu, Zhongshan outfit, Cheongsam, Tang suit
- Finland: Kalevala-inspired attire, traditional coastal dresses
- Sweden: Folkdräkt, Sami Gákti, Dala costume
- Germany: Lederhosen, Dirndl, Hessian Trachten
- Ireland: Aran sweater, brat cloak
- Romania: Fota, embroidered blouse dress combinations
- Denmark: Skjorte, Læderbukser, embroidered blouses with skirts
- Britain: Tweed jackets, Barbour jackets, kilts
- Switzerland: Dirndl, Appenzeller Tracht, Lederhosen
- Scotland: Kilt, Ghillie shirts, tartan patterns
- France: Paletot coats, Rococo gowns
- Spain: Flamenco dress, Castilian dress, Baturro/Baturra costume, Chulapo/Chulapa costume, Baserritarra costume, Fallero/Fallera outfits
- Italy: Regional festival attire, lacework and vibrant southern patterns
- Portugal: Peasant dresses, nobility suits, embroidered wraps
- Greece: Chiton, Fustanella, himation
- Australia: Akubra hats, Aboriginal ceremonial wear

The subject must wear the **full traditional attire** including **headgear, footwear, jewelry, and accessories**.

The environment must **reflect the country visually**, including flags, cultural motifs, landscapes, or cityscapes recognizable to viewers.

Lighting, perspective, and shadows must remain realistic. The subject should appear fully integrated into the scene.

DO NOT overlay clothing textures on the original photo. DO NOT leave non-traditional or modern clothing visible. DO NOT use unrelated props.

The final image must look like a **photograph of a person authentically dressed in traditional attire in the corresponding country**.`},{name:"TRICK OR TREAT",category:["HALLOWEEN","COSTUME","HUMOR","SEASONAL"],message:`Take a picture and transform the subject into a playful Halloween trick-or-treater.

CORE CONCEPT:
• The subject’s HEAD must be preserved and clearly recognizable
• The BODY must be scaled down to the size and proportions of a child
• This is a stylized, humorous proportion shift — NOT realism

SUBJECT TRANSFORMATION:
• Place the subject’s head onto a child-sized body
• Head should be slightly oversized relative to the small body for a fun, cartoon-like effect
• Match lighting, angle, and perspective so the head looks naturally attached
• No floating heads or mismatched scale

COSTUME SELECTION (IMPORTANT):
• If an external master prompt suggests a specific costume, USE THAT COSTUME
• If no costume is provided externally, default to classic Halloween costumes such as:
  – Witch
  – Vampire
  – Ghost
  – Superhero
  – Monster
• Costume must fully cover the child-sized body

COSTUME & PROPS:
• The subject must be holding an orange pumpkin candy pail (jack-o’-lantern style)
• The pose should clearly suggest asking for candy (pail held forward or at waist level)

SCENE & ENVIRONMENT:
• Halloween night setting
• Suburban neighborhood, front porch, or doorway
• Autumn decorations encouraged: pumpkins, porch lights, leaves, spooky décor
• Warm porch lighting or soft night lighting

STYLE & TONE:
• Wholesome, humorous, and playful
• No horror, fear, or menace
• No realism that implies an actual child — this is a stylized character transformation

COMPOSITION RULES:
• Keep the subject centered and clearly visible
• Preserve a full-body view of the child-sized figure
• No cropping that removes the pumpkin pail or costume details

FINAL RESULT:
A fun Halloween image where the subject appears as a trick-or-treater with their recognizable head on a child-sized costumed body, holding a pumpkin candy pail and joyfully asking for candy.`},{name:"TROGLODYTE",category:["PREHISTORIC","TRANSFORMATION","ANTHROPOLOGY","ANCIENT"],message:"Take a picture and transform the subject into an early human ancestor species. Choose from: Homo neanderthalensis (stocky build, prominent brow ridge, receding forehead, large nose, robust frame), Homo habilis (smaller brain case, protruding face, ape-like features), Homo erectus (elongated skull, thick brow ridges, flat nose, muscular build), Homo heidelbergensis (large brow ridge, massive jaw, robust features), Homo floresiensis (very small stature 'hobbit', proportionally small brain), Denisovans (broad face, large molars, robust features), or Homo naledi (small brain, curved fingers, primitive and modern trait mix). Transform the subject's facial features and body structure to match the chosen species' anthropologically accurate characteristics - modify skull shape, brow ridges, jaw structure, nose, facial proportions, body build, and posture. Dress them in primitive Stone Age clothing - animal hide wraps, fur pelts, leather straps, bone ornaments, crude necklaces. Show body hair appropriate to the species. Place them in a prehistoric setting - cave entrance, rocky outcrop, savanna landscape, stone tool workshop, campfire scene. Include period-appropriate elements - stone tools, wooden spears, animal bones, primitive shelter, cave paintings in background. Use natural outdoor lighting - firelight, dawn/dusk, or cave shadows. The subject should maintain recognizable identity through coloring and general features while clearly displaying the anatomical characteristics of early hominid species. Add a text label at the bottom of the image displaying the species name in scientific format (e.g., 'Homo neanderthalensis' or 'Homo erectus') in a museum placard or documentary style with italicized Latin nomenclature. Make it photorealistic as if this is an actual reconstruction of what the subject would look like as that prehistoric human ancestor. Use scientifically accurate paleoanthropological features based on fossil evidence."},{name:"TRON",category:["MOVIES","SCI FI","NEON","CYBERPUNK"],message:"Take a picture and place the subject inside the digital world of Tron. Show them either riding a light cycle leaving glowing trails of neon light behind them as they race across the game grid, or participating in the disc battle game throwing and catching glowing identity discs. The subject should wear the iconic Tron suit with glowing circuit patterns - black suit with bright neon blue, orange, or white illuminated lines tracing across the body and helmet. The environment should be the dark geometric game grid with glowing floor lines, dramatic perspective, and that distinctive early CGI aesthetic. Use heavy contrast between deep blacks and vibrant neon colors. Include motion blur on light trails, reflective surfaces, and the surreal digital atmosphere of the Grid. Make it look like the subject is actually inside the Tron movie universe in an intense action moment."},{name:"TV DRAMA",category:["TV","DRAMA","CINEMATIC","MASTER PROMPT"],message:"Take a picture and place the subject into a famous dramatic television series scene. Preserve the subject’s facial features, expressions, and clothing while adapting them to the television drama style. Include cinematic lighting, moody atmosphere, and emotionally charged interactions with other characters or surroundings. The composition should convey tension, suspense, or deep narrative context, fully integrating the subject into the dramatic storyline of the show."},{name:"TV GAME SHOW",category:["TV","GAME SHOW","ENTERTAINMENT","MASTER PROMPT"],message:"Take a picture and place the subject into a famous television game show set. Preserve the subject’s facial features, personality, and clothing while transforming them into a contestant or host in the game show style. Include colorful set design, bright stage lighting, game props, podiums, or audience elements. Convey excitement, engagement, and fun, fully integrating the subject into the lively, competitive environment of the television show."},{name:"TV SITCOM",category:["TV","SITCOM","COMEDY","MASTER PROMPT"],message:"Take a picture and place the subject into a famous television sitcom scene. Preserve the subject’s facial features, personality, and clothing while adapting them to the sitcom style. Include bright, cheerful lighting, a recognizable multi-camera set or typical sitcom living room, and humorous interactions with other characters or props. Ensure the scene conveys comedic timing, lightheartedness, and laugh-track energy, fully integrating the subject into the television comedy environment."},{name:"TYPICAL TOURIST",category:["TOURIST","TRAVEL","FORCED PERSPECTIVE"],message:"Take a picture and place the subject in front of a randomly selected famous world landmark using classic forced-perspective tourist photography. The subject is intentionally interacting with the landmark through optical illusion—such as pinching it between their fingers, holding it up, pushing it, leaning against it, or framing it with their hands—while maintaining realistic scale and perspective from the camera’s point of view. Preserve the subject’s recognizable facial features, proportions, and identity. Carefully match camera angle, focal length, lighting direction, shadows, depth of field, and atmospheric perspective so the illusion feels natural and intentional rather than composited. The subject’s pose, hand placement, and eye line must align perfectly with the landmark to sell the visual trick. Capture the moment as if snapped at the exact perfect second. Render the final image with photorealistic travel-photo realism, playful humor, and precise forced-perspective accuracy."},{name:"UK POSTER ART 1930s",category:["ART","VINTAGE","POSTER","30S"],message:"Take a picture and transform the image into a 1930s British travel poster style art. Simplified shapes, bold typography, stylized landscapes, and clean graphic composition."},{name:"UNCLE SAM",category:["HISTORY","PROPAGANDA","ICONIC","POSTER"],message:`Take a picture and transform the subject into Uncle Sam as seen in a classic wartime recruitment poster.

CORE REQUIREMENT (CRITICAL):
• The subject must appear to be the original illustrated model for Uncle Sam
• The face must be fully redrawn in illustration form — not replaced or composited

ANTI-PHOTOSHOP RULE (CRITICAL):
• Do NOT paste or overlay the subject’s face onto an existing illustration
• Reconstruct Uncle Sam’s face from scratch using the subject’s facial structure
• The result must look hand-illustrated, not edited

FACIAL INTEGRATION (CRITICAL):
• Translate the subject’s facial features into vintage poster illustration style
• Match original linework, shading, and ink density
• Skin must appear painted or lithographed
• No photographic lighting, pores, or smooth gradients

STYLE & MEDIUM:
• Early 20th-century illustration / lithograph
• Slightly aged paper texture
• Muted reds, blues, and off-whites
• Period-accurate ink imperfections

COMPOSITION & TEXT:
• Preserve the iconic pointing pose and gaze
• Preserve classic typography and layout
• No modern design elements

TONE:
• Serious, authoritative, and patriotic
• No parody or humor

FINAL RESULT:
A fully convincing wartime Uncle Sam poster where the subject clearly appears to have been illustrated as Uncle Sam from the beginning. There must be no indication that a modern face was ever inserted or edited into the image.`},{name:"UNDER THE SEA",category:["UNDERWATER","OCEAN","NATURE"],message:"Take a picture and place the subject underwater in a natural ocean environment. The subject is wearing streamlined, sport-style swimwear suitable for ocean swimming, styled realistically for an underwater setting. Create a photorealistic underwater seascape capturing the beauty of the ocean depths. Include coral reefs, exotic fish, and aquatic plants, with sunlight filtering through the water to create dramatic lighting and rich color variation. Emphasize realism, scale, and natural movement in the water."},{name:"UNKEMPT",category:["HUMOR","GROOMING","EXAGGERATED"],message:`Take a picture and transform the subject into someone who desperately needs grooming, with exaggerated overgrown hair in unfortunate places.

Add extremely bushy, thick, unruly eyebrows that are wild and untamed - possibly connected in the middle (unibrow), with hairs going in all directions.

Show visible nose hairs protruding noticeably from the nostrils - long enough to be clearly visible and unkempt.

Add ear hair visibly growing out from the ear openings - bushy tufts that are clearly overgrown and neglected.

The subject's facial hair (if applicable) should also be scraggly, patchy, or unkempt. Overall hair should look messy and in need of a cut.

The subject's expression can be neutral, unaware, or even proud - making the lack of grooming more humorous. Alternatively, they could look disheveled and tired.

Keep the image photorealistic so the grooming issues look like an actual photograph of someone who has seriously neglected personal maintenance. The exaggeration should be humorous but believable.

Preserve the subject's recognizable facial structure and features while adding these exaggerated grooming problems.`},{name:"VACATION",category:["TRAVEL","MASTER PROMPT","TOURIST","LOCATION"],message:"Take a picture and have the subject standing in the middle of a CITY street somewhere in the world, with iconic and easily recognizable landmarks from that CITY in the background. The scene should capture the CITY life, detailed architecture, and natural lighting, with the person dressed in modern casual clothing, blending naturally into the environment. Make it photorealistic. 8k resolution."},{name:"VALENTINE",category:["ROMANCE","VALENTINE","HEART"],message:"Take a picture and frame the subject inside a visually prominent heart shape. Create a romantic Valentine’s Day–themed scene with warm colors, soft lighting, and gentle decorative elements. Extract subtle flavor text and inspiration from the subject’s appearance, expression, clothing, and surroundings to generate a heartfelt Valentine’s Day poem. Display the complete poem clearly and fully within the image, ensuring all lines are legible and unobstructed. Integrate the poem naturally into the composition, such as on a decorative card, ribbon, or elegant text panel, while keeping the subject as the central focus. Render the final image with polished, high-quality detail."},{name:"VAMPIRE",category:["HORROR","VAMPIRE","GOTHIC"],message:"Take a picture and transform the subject into a realistic vampire while preserving the subject’s recognizable facial structure, body proportions, and identity. Subtly enhance features with pale, luminous skin, sharp yet refined fangs, intense eyes, and an elegant, supernatural presence. Adapt the subject’s clothing to a dark, timeless vampire aesthetic while maintaining their original style and personality. Place the subject naturally into a moody, atmospheric environment such as a gothic interior, moonlit street, or candlelit chamber. Use cinematic lighting, deep shadows, and rich textures to create a seductive, mysterious tone. Ensure the subject appears fully integrated into the scene and render the final image in photorealistic detail with depth, realism, and supernatural elegance."},{name:"VAN GOGH",category:["ART","PAINTING","ARTIST","IMPRESSIONISM"],message:"Take a picture and transform it into a painted scene inspired by Vincent van Gogh. Preserve the photographic composition but reinterpret it using bold, swirling brushstrokes, thick paint texture, and expressive movement. Use vivid blues, yellows, and greens with visible directional strokes. The subject should remain clearly recognizable while the surrounding scene feels alive with motion and emotion."},{name:"VAPORWAVE",category:["ART","RETRO","90S","AESTHETIC"],message:"Take a picture and style it as if it were a retro-futuristic vaporwave album cover. Dreamy neon colors, glitchy textures, and retro-futuristic vibes. Inspired by 90s aesthetics and early internet culture, giving the photo a surreal, nostalgic feel, like a lost scene from an old VHS tape or a synthwave album cover."},{name:"VEGAS NEON SIGN",category:["NEON","CASINO","VEGAS","SIGNAGE","ADVERTISING"],message:`Take a picture and transform the subject into a large, spectacular neon sign mounted on the side of a Las Vegas casino building.

The subject's image should be converted into glowing neon tubing and illuminated sign elements. Their facial features, silhouette, and recognizable characteristics should be rendered using bright neon tubes in classic Vegas colors - hot pink, electric blue, bright red, golden yellow, vibrant purple, lime green.

Sign construction details: The neon should have realistic glass tube appearance with visible glowing gas, support brackets and framework visible, bulb marquee borders surrounding the main image, animated chasing lights or blinking elements, possibly text above or below saying the subject's name in classic Vegas marquee lettering.

Mount the sign prominently on the side of an authentic Las Vegas casino building - art deco or mid-century modern architecture, visible in evening or night setting. Include surrounding Vegas context: other neon signs visible in background, palm trees, busy street below with car light trails, other casinos in distance.

Lighting and atmosphere: The scene should be photographed at dusk or night when neon is most vibrant. The sign should be the brightest element, casting colorful glow on the building facade. Include atmospheric haze or slight blur to enhance the neon glow effect. Light from the sign should reflect on surrounding surfaces.

Scale: The sign should be LARGE - multiple stories tall on the casino building, dominating the facade, visible from far away. The subject's neon portrait should be the centerpiece of an elaborate sign display.

The final image should look like an actual photograph of a real Las Vegas casino with this spectacular custom neon sign installation, capturing the over-the-top glitz, glamour, and bright electric energy of classic Vegas signage. Photorealistic rendering with authentic neon glow, proper scale, and vintage Vegas atmosphere.`},{name:"VEHICLE TIME SHIFT",category:["CAR","TRANSFORMATION","VINTAGE","MODERN"],message:"Take a picture and identify the vehicle in the image, then transform it to a different era version of the same make and model while keeping everything else identical. If the vehicle is modern, transform it to a classic vintage version from the 1950s-1970s. If the vehicle is vintage/classic, transform it to the modern current version. Examples: 2024 Ford Mustang becomes 1967 Ford Mustang; 1965 VW Beetle becomes 2024 VW Beetle; 1963 Corvette becomes 2024 Corvette; modern Porsche 911 becomes 1970s Porsche 911; classic Bronco becomes modern Bronco. CRITICAL: Preserve exactly the same color, license plate number, location, background, lighting, angle, and any damage or modifications - ONLY change the body style, design elements, and year-specific features of that vehicle model. Keep wheels/rims in period-appropriate style for the new era. Maintain any custom details like racing stripes, decals, or accessories but update them to match the era shift. The transformation should be seamless - same car in same spot with same paint, just from a different decade. Update headlights, grille, body lines, bumpers, and trim to match the target era's authentic factory design for that specific make and model. Make it photorealistic as if this exact car (same color, same plate, same location) is simply from a different generation of that vehicle line."},{name:"VENDING MACHINE ITEM R1",category:["HUMOR","VENDING","PACKAGED","MASTER PROMPT"],message:`Take a picture and transform the subject into a novelty vending machine product. The subject should appear as a toy, figurine, or packaged novelty item clearly designed to be sold.

Place the product inside a vending machine slot behind glass. Show spiral coils, price tags without readable text, glass reflections, and interior vending machine lighting. The subject should appear scaled appropriately to fit the slot as a product, not as a real person.

Ensure the scene reads as playful and humorous, like a novelty item for sale, with the vending machine fully visible and the product clearly displayed inside.`},{name:"VENTRILOQUIST DUMMY",category:["HUMOR","PORTRAIT","PUPPET"],message:`Take a picture of the subject and transform them into a classic ventriloquist dummy.

The subject should look like a wooden puppet version of themselves, with a glossy painted face, carved features, and a hinged jaw line.

Give them slightly exaggerated eyes, a stiff posture, and a stylized puppet outfit such as a suit, bow tie, or dress.

The wood texture, joint seams, and mouth hinge should be clearly visible so it unmistakably looks like a ventriloquist dummy.

The final image should look like a lifelike puppet replica of the subject, humorous, eerie, and unmistakably artificial.`},{name:"VHS 80s",category:["RETRO","80S","VHS","VIDEO"],message:"Take a picture and transform the image into 1980s VHS footage. Soft focus, scanlines, color bleed, timestamp artifacts. Analog nostalgia aesthetic."},{name:"VICTORIA'S COMMON KNOWLEDGE RUNWAY",category:["HUMOR","FASHION","RUNWAY"],message:"Take a picture of the subject and transform them into a glamorous runway model in an extravagant fashion show. The subject should be walking confidently down a runway wearing over-the-top, flamboyant outfits — dramatic capes, feathered costumes, oversized hats, sparkling accessories, or theatrical fashion pieces. Include dramatic runway lighting, photographers, flashing cameras, and a cheering audience. The subject’s pose, facial expression, and stride should be exaggerated and confident, capturing the flair and drama of a live fashion show. Optional flavor text from the master prompt can influence the costume style or theme. The final image should look like a high-fashion runway photo shoot — realistic lighting, shadows, and perspective — but humorous if desired by exaggerating poses, outfit size, or runway theatrics."},{name:"VICTORIAN ENGRAVING",category:["ART","VINTAGE","ENGRAVING"],message:"Take a picture and transform the image into a Victorian engraving. Fine linework, cross-hatching, monochrome or sepia tones, and antique print texture."},{name:"VICTORIAN PHOTO",category:["PHOTOGRAPHY","VINTAGE","VICTORIAN"],message:"Take a picture in the style of a Vintage photo of a Victorian family. Sepia tones, period attire."},{name:"VIDEO GAME AVATAR",category:["GAMING","CHARACTER","AVATAR","MASTER PROMPT"],message:"Take a picture and place the subject inside a popular video   game world (randomized across classic side-scrollers, platformers, fighting games, action-adventure, open-world RPGs, and modern AAA titles). Transform the subject into a fully playable in-game character while preserving recognizable facial features, body shape, clothing identity, and personality. Match the exact art style, rendering technique, camera perspective, UI scale, and lighting of the chosen game. The subject must look natively integrated into the game world—not composited—with correct proportions, animation-ready pose, and environmental interaction. Entire background, props, and effects must be authentic to the video game universe."},{name:"VINTAGE POSTER",category:["ART","VINTAGE","POSTER","MOVIES","MASTER PROMPT"],message:"Take a picture in the style of a vintage movie poster. The poster uses lithography for printing on lightweight paper, and includes hand-painted illustrations. Add flavor text to the film title, director, and actor names inspired by the content of the image."},{name:"VIRTUOSO",category:["HUMOR","MUSIC","DRAMATIC"],message:`Take a picture of the subject and transform them into a solo musical virtuoso performing on stage.

The subject should be playing a single instrument such as a piano, violin, cello, guitar, trumpet, or another orchestral instrument.

Behind the subject, show a full orchestra performing along with them in a grand concert hall.

Spotlight the subject as the star of the performance while the orchestra supports them.

The scene should look dramatic, cinematic, and impressive, like a world-class concert starring the subject.`},{name:"VISUAL POETRY",category:["ART","POETRY","METAPHOR"],message:"Take a picture and transform the image into visual poetry. Metaphor-driven imagery with emotional rhythm."},{name:"VITRUVIAN MAN",category:["ART","CLASSICAL","RENAISSANCE","GEOMETRY","TRANSFORMATION"],message:`Take a picture and transform the subject into a Renaissance-style geometric figure inspired by Leonardo da Vinci.

STYLE:
• Hand-drawn ink sketch
• Sepia or brown ink
• Aged parchment background

GEOMETRIC COMPOSITION:
• Show the subject in two overlapping poses
• One pose fits inside a square
• One pose fits inside a circle
• Both poses share the same center point

FIGURE PRESENTATION:
• Subject is represented using abstract linework.

ANNOTATIONS:
• Handwritten mirror-style notes
• Pseudo-Latin or Renaissance-style text

The final image must resemble a Renaissance notebook page focused on proportion and geometry, not anatomy.`},{name:"VULCAN TRANSFORMATION",category:["SCI FI","STAR TREK","TRANSFORMATION","ALIEN"],message:"Take a picture and transform the subject into a realistic Vulcan. Preserve the subject’s recognizable facial features, bone structure, body proportions, and personality while adapting them to authentic Vulcan traits including pointed ears, subtle brow structure, calm expression, and controlled posture. Maintain the subject’s clothing identity translated into Vulcan-appropriate garments or Starfleet attire with clean lines and logical design. Neutral, disciplined body language, precise lighting, and understated realism. The subject must appear fully Vulcan, not human with cosmetic alterations."},{name:"WALDO",category:["PUZZLE","HIDDEN","GAME","ILLUSTRATION"],message:`Take a picture and transform it into a classic Where’s Waldo–style illustrated puzzle.

CORE RULE:
The subject MUST be difficult to find.
This is a search puzzle — NOT a character portrait.

SUBJECT INTEGRATION (CRITICAL):
• Transform the subject into ONE Waldo among MANY Waldos
• The subject must NOT be centered, enlarged, highlighted, or visually emphasized
• The subject must be the SAME size, pose complexity, color balance, and line weight as all other Waldos
• No visual cues may point to the subject

CAMOUFLAGE RULES:
• Place dozens or hundreds of nearly identical Waldo figures throughout the scene
• Vary poses, accessories, and minor details across all Waldos
• The subject’s Waldo may differ ONLY by subtle facial likeness — nothing else
• Clothing colors, stripes, hat, glasses, and posture must closely match surrounding Waldos

SCENE COMPLEXITY:
• The environment must be extremely busy and overcrowded
• Include overlapping characters, props, architecture, signage, and activity
• No empty space
• Visual noise and repetition are REQUIRED

POSITIONING RULES:
• The subject’s Waldo should be partially occluded, cut off by the frame, or overlapped by other elements
• Avoid clean silhouettes or isolated placement
• Place the subject at an arbitrary, non-obvious location

STYLE REQUIREMENTS:
• Hand-drawn illustration style
• Flat colors with thin black outlines
• Slightly whimsical, chaotic energy
• No photographic realism

ABSOLUTE PROHIBITIONS:
• DO NOT spotlight, highlight, zoom, or isolate the subject
• DO NOT place the subject in the foreground
• DO NOT reduce crowd density near the subject
• DO NOT label or point to the subject

FINAL RESULT:
The final image must function as a real Where’s Waldo puzzle — crowded, chaotic, visually overwhelming — where the subject blends into the sea of Waldos and requires careful searching to locate.`},{name:"WALLACE & GROMIT",category:["ANIMATION","STOP-MOTION","CLAY","BRITISH"],message:`Take a picture and transform the subject into the visual style of Wallace & Gromit stop-motion animation.

STYLE & MATERIAL (CRITICAL):
• Hand-molded clay characters — NOT CGI
• Visible fingerprints, thumb marks, and clay deformation
• Slight asymmetry and soft, imperfect forms

FACIAL & BODY DESIGN:
• Preserve the subject’s recognizable facial structure
• Translate features into exaggerated clay forms — large eyes, simplified noses, rounded cheeks
• Expressive but minimal mouths
• Proportions slightly caricatured

POSE & MOTION:
• Subject should appear frozen mid–stop-motion frame
• Slight stiffness or off-balance posture encouraged

COLOR & LIGHTING:
• Soft, even lighting
• Muted but colorful clay palette
• No harsh shadows or modern cinematic lighting

ENVIRONMENT:
• Miniature clay-built sets — interiors, streets, or whimsical everyday locations
• Everything must appear sculpted from clay at miniature scale
• No realistic photographic textures

FINAL RESULT:
The final image must look like a real Wallace & Gromit stop-motion frame — hand-crafted clay, charmingly imperfect, and unmistakably British.`},{name:"WANTED POSTER",category:["WESTERN","VINTAGE","POSTER"],message:'Take a picture in the style of an Old West Wanted Poster. Aged parchment, bullet holes. Title: "WANTED".'},{name:"WARDROBE MALFUNCTION",category:["HUMOR","FASHION","DISASTER","PHOTOREALISTIC"],message:`Take a picture of the subject frozen in a moment where their clothing is tearing, misfitting (shrunk or undersized), or hilariously failing.

The tear or malfunction must be physically integrated with the clothing texture and anatomy — fabric stretches, rips, or folds realistically across the subject’s body.

Include realistic lighting, shadows, and environmental context, such as a street, stage, gym, or indoor setting.

The final image must look like a real photograph capturing the exact comedic moment — absurd but believable, with no digital overlays or pasted elements.`},{name:"WARNER BROS CARTOON",category:["ANIMATION","CARTOON","CLASSIC"],message:`Take a picture and transform the subject in the style of a classic Warner Bros. cartoon placed inside a classic Warner Bros. cartoon world inspired by mid-20th-century theatrical animation. Preserve the subject’s facial structure and recognizability while adapting lighting, color, outlines, and shading so the subject feels naturally integrated into a hand-painted cel-animation environment.

The scene should follow one of the following Warner Bros.–style formats:
• A classic theatrical end-card inspired by the iconic "That’s all folks!" closing, where the subject’s face replaces the central character within concentric rings.
• A classic cartoon scene where the subject appears alongside well-known Warner Bros. characters.

Use bold black outlines, saturated colors, soft cel-style shading, exaggerated expressions, and simple painted backgrounds consistent with classic Warner Bros. cartoons. Ensure scale, eye-line, and pose interactions feel believable and playful. Keep the composition clear and readable on small screens.

Allow externally provided instructions to specify the exact character(s), scene type, setting, or tone. If no external instructions are provided, automatically choose a fitting Warner Bros.–style scene.`},{name:"WATERCOLOR",category:["ART","PAINTING","WATERCOLOR"],message:"Take a picture in the style of a Watercolor painting. The pigments are mixed with water and applied to paper, creating luminous, transparent washes of color."},{name:"WEDDING CAKE TOPPER",category:["WEDDING","HUMOR"],message:`Take a picture and transform the subject(s) into the traditional two-figure wedding cake topper. If only one subject is provided, assign them to one of the two figures; if two subjects are provided, each becomes one of the figures.

Render the figures as small, cheap plastic or resin figurines with smooth, slightly glossy surfaces and simplified, mass-produced detailing. The faces and features should retain recognizable aspects of the subjects but remain stylized and clearly toy-like. Clothing details (tuxedo, suit, wedding gown, veil, bouquet) should be painted on, not fabric.

Place the two figures securely on the top tier of a multi-layer wedding cake. Include realistic frosting textures, piped borders, subtle crumbs, and decorations such as flowers or fondant accents.

Position the toppers close together in the classic wedding pose, slightly off-center if needed to reflect a real hand-placed topper. The figures must clearly appear as part of the cake, not floating or separate.

Set the scene on a wedding reception table with soft lighting, pastel or neutral tones, and subtle background elements like table linens, flowers, or candles.

Ensure the entire top tier and both figurines are fully visible within the frame. Scale, shadows, and perspective must reinforce that the subject(s) are physical cheap plastic wedding cake toppers. The final image should feel charming, humorous, and recognizably a wedding cake topper scene.`},{name:"WEEKEND UPDATE",category:["HUMOR","SATIRE","TELEVISION","NEWS"],message:`Take a picture and transform the scene into a Weekend Update segment from Saturday Night Live.

CORE REQUIREMENT (CRITICAL):
• The image MUST include a recognizable Weekend Update anchor seated at the desk (e.g., Colin Jost or Michael Che anchor)
• The anchor must appear as part of the scene, not implied or cropped out

SCENE SETUP:
• Classic Weekend Update desk and backdrop
• Clean studio lighting and broadcast camera framing
• The anchor is visible on one side of the frame at the desk
• A topic image box appears beside the anchor, as seen in real Weekend Update segments

SUBJECT PRESENTATION:
• The subject appears ONLY inside the topic image box next to the anchor
• The subject image must look like a broadcast graphic, not a pasted photograph
• Match studio lighting, scale, and perspective of real Weekend Update graphics
• The subject must remain recognizable

HEADLINE / CHYRON (CRITICAL):
• A humorous headline or caption must appear directly beneath or over the subject’s image
• Headline must feel like authentic SNL Weekend Update writing
• Use external master prompt flavor text to influence the joke or headline
• If no external flavor text is provided, invent a sharp, absurd, or ironic headline

COMPOSITION RULES:
• Preserve the full Weekend Update framing
• Do NOT zoom into the subject image
• Do NOT remove the anchor
• The anchor and subject graphic must clearly coexist in the same shot

STYLE & TONE:
• Broadcast news realism
• Sharp, legible typography
• Comedic, satirical tone consistent with Weekend Update

FINAL RESULT:
The image must look like a real Weekend Update moment, with a visible anchor delivering a joke while the subject appears in the on-screen topic graphic with a humorous headline.`},{name:"WEIRD SCIENCE",category:["HUMOR","SCIENCE","DISASTER"],message:`Take a picture of the subject in the middle of a science experiment that is actively failing.

Show visible chaos such as smoke, foam overflow, sparks, cracked glassware, runaway reactions, or unexpected substances escaping.

The subject must appear caught mid-failure — shocked, panicked, or frozen in regret.

The image should look like a candid photograph taken at the exact moment the experiment went wrong.`},{name:"WES ANDERSON",category:["MOVIES","CINEMATIC","SYMMETRICAL"],message:"Take a picture and transform the image into a Wes Anderson-style scene. Perfect symmetry, centered composition. Pastel color palette, soft lighting. Whimsical, storybook tone."},{name:"WESTERN",category:["WESTERN","COWBOY","VINTAGE"],message:"Take a picture and have the setting be an Old West town.  Make it photorealistic cowboy setting."},{name:"WHAT IF?",category:["HUMOR","HISTORICAL","ALTERNATE","SCENE"],message:`Take a picture of the subject and place them into a famous historical moment, as if they personally changed the course of history.

The subject should be the central figure in the scene, interacting directly with a major historical event such as signing an important document, making a dramatic discovery, stopping a disaster, leading a crowd, or inventing something world-changing.

The setting, clothing, and environment should match the historical era being shown, making the scene feel authentic and cinematic.

Use external master prompt text, if provided, to suggest the historical moment or twist.

The tone should be playful and humorous, presenting the subject as an unexpected hero or key figure who altered history in a surprising way.`},{name:"WHEATIES BOX",category:["ADVERTISING","HUMOR","MASTER PROMPT"],message:`Take a picture and transform it into a complete, three-dimensional Wheaties cereal box. The entire box must be fully visible within the frame, including front face, edges, top flap, and box proportions.

Design the front panel in classic Wheaties style with a bold orange background. Feature the subject prominently as the heroic athlete printed on the box front. The subject must appear integrated into the printed packaging, not floating or cropped.

Add an absurd, over-the-top achievement based on the subject’s traits, posture, or environment. Display this achievement prominently like a headline.

Include exaggerated, playful flavor text inspired by cereal-box marketing copy. Use vintage-inspired typography and graphic accents without copying real slogans.

Apply realistic cardboard texture, slight wear, subtle creases, and printing imperfections. The box should appear photographed in a real environment. Ensure all text and the subject are readable on a small screen.`},{name:"WHETHER THE WEATHER",category:["REALISM","WEATHER","ENVIRONMENT","TRANSFORMATION"],message:`Take a picture and transform the weather conditions into the opposite state while preserving the original scene, composition, and subject.

WEATHER INVERSION RULE (CRITICAL):
• If the original scene is SUNNY or CLEAR → convert it to either RAINING or SNOWING
• If the original scene is RAINING or SNOWING → convert it to SUNNY and CLEAR
• Choose the opposite condition that creates the strongest visual contrast

PHOTOREALISM REQUIREMENT:
• The result must be fully photorealistic
• Lighting, shadows, reflections, and atmospheric effects must match the new weather
• No stylization, illustration, or fantasy effects

ENVIRONMENTAL CONSISTENCY (MANDATORY):
• If converted to RAIN:
  – All previously dry surfaces must appear wet
  – Roads, sidewalks, vehicles, and objects show realistic water sheen and reflections
  – Raindrops, splashes, puddles, and overcast sky must be present

• If converted to SNOW:
  – Objects, ground, rooftops, and surfaces must accumulate snow or ice
  – Breath vapor, frost, and cold haze may be visible
  – Snowfall should match realistic density and scale

• If converted to SUNNY:
  – All previously wet or snowy surfaces must appear dry
  – Snow and ice must be fully removed
  – Bright natural daylight, clear or lightly clouded sky
  – Stronger shadows and warmer color temperature

SUBJECT & OBJECT PRESERVATION:
• Do NOT change the subject, pose, camera angle, or framing
• Preserve all visible objects and structures
• Only alter weather, atmosphere, lighting, and surface conditions

ABSOLUTE PROHIBITIONS:
• No surreal or exaggerated weather
• No partial transformations (everything must obey the new weather)
• No time-of-day change unless required by realism

FINAL RESULT:
The image must look like the exact same photograph taken at the same moment and location — but under completely opposite, fully believable weather conditions.`},{name:"WHO'S A GOOD HUMAN?",category:["HUMOR","ROLE REVERSAL","SURREAL","PETS"],message:`Take a picture and apply a role-reversal between humans and pets.

First determine the type of subject:

• If the subject is an ANIMAL (dog, cat, bird, etc.): place them into a realistic human situation such as working in an office, driving a car, shopping, cooking, using a phone, or sitting in a café. The animal should behave like a person while still clearly being an animal. Use proper perspective, props, and body positioning so it looks natural and believable.

• If the subject is a HUMAN: transform them into a pet owned by an animal. The human should be on a leash, being carried, sitting in a pet carrier, or being walked by a dog, cat, or other animal. The animal must clearly be the owner and in control.

The scene should be funny but not mean-spirited — playful, surreal, and instantly understandable at a glance.

Maintain realistic lighting, scale, and contact between characters so the interaction feels physically real. The subject must be fully integrated into the scene, not pasted on.

If external master prompt text is provided, use it to influence the setting (for example: city, park, medieval, sci-fi, luxury, etc.).

The final image should feel like a clever visual gag you’d see on a magazine cover or viral poster.`},{name:"WINDOWS WALLPAPER",category:["WALLPAPER","DESKTOP","HUMOR","DESIGN"],message:`Take a picture and transform the subject into a widescreen desktop wallpaper that looks like a fake, humorous Windows-style computer desktop.

Use a wide landscape aspect ratio (about 16:9 or wider). The subject should appear as the main wallpaper image — either posed inside a scene or interacting with the ‘desktop.’

Overlay a fake desktop interface including:
• fake desktop icons with funny names based on the subject’s personality (e.g., "Tax Panic", "Selfies", "Emotional Support Folder", "Definitely Not Work")
• a fake taskbar with a clock, system tray, and silly system notifications
• at least one humorous pop-up or error message related to the subject

Icons should be placed around the subject so they do not block the face or important features.

The overall look should feel like a real computer desktop that someone paused mid-chaos — silly, cluttered, and personality-driven.

The final image should feel like a snapshot of the subject’s ridiculous personal computer, clearly readable on a large screen.`},{name:"WOOD CARVING",category:["ART","SCULPTURE","MATERIAL"],message:`Take a picture of the subject and completely transform ONLY the subject into a carved wooden sculpture.

ABSOLUTE REQUIREMENT: The subject must be 100% wood — no skin, fabric, metal, plastic, or photographic texture may remain.

The subject must appear SOLID and VOLUMETRIC, as if carved from a single block of wood.

Wood characteristics MUST include:
• Continuous wood grain wrapping around the entire body
• Visible carving marks, chisel lines, and tool imperfections
• Grain direction that follows anatomy (face, limbs, torso)
• Natural wood seams, knots, and density variation

DO NOT apply wood as a surface texture.
DO NOT allow pores, fabric weave, or skin shading to remain.

Clothing, hair, facial features, and accessories must ALL be carved wood — not separate materials.

Lighting must behave like real wood:
• Diffuse reflection
• No skin subsurface scattering
• Subtle grain-based shadow breakup

The environment MUST remain fully photographic and unchanged.

FINAL VALIDATION RULE:
If the subject looks like a person with a wood filter applied, IT IS WRONG.

The final image must look like a real wooden statue placed into the photographed environment.`},{name:"WOODCUT",category:["ART","PRINT","CARVED"],message:"Take a picture and transform the image into a traditional woodcut print. Bold carved lines, high contrast. Limited color palette."},{name:"X-RAY",category:["MEDICAL","X RAY","TECHNICAL"],message:"Take a picture and transform the image into an X-ray view. Semi-transparent layers revealing internal structure. Monochrome glow."},{name:"YARD SALE ITEM",category:["HUMOR","SALE"],message:`Take a picture and transform the subject into an item being sold at a casual neighborhood yard sale.

Depict the subject posed stiffly or passively like merchandise, with a strip of masking tape on their chest or body displaying a handwritten price. The price and text should be humorous, such as 'Still Works,' 'No Returns,' or 'As-Is.'

Include a handwritten yard-sale sign nearby with casual marker lettering and uneven lines. Surround the subject with typical yard sale items like folding tables, boxes, old toys, lamps, or clothes racks.

Use natural daylight and slightly cluttered suburban surroundings to sell the realism. The subject should feel like an object for sale, not a person shopping at the sale.

Ensure the full subject and sale setup are fully visible within the frame. The tone should be funny, awkward, and unmistakably a yard sale scenario.`},{name:"YEARBOOK",category:["SCHOOL","HUMOR","AWKWARD"],message:"Take a picture and make the subject appear in an awkward, unflattering yearbook photo. Retro school photo style."},{name:"YOU SMELL",category:["HUMOR","SOCIAL","REACTION"],message:`Take a picture of the subject and place them in a public setting such as a bus, office, party, or line.

The subject should have visible dark sweat stains under their arms.

People around the subject should be reacting to the smell using exaggerated gestures such as holding their nose, covering their mouth, leaning away, or making disgusted faces.

The subject should look unaware or embarrassed.

The scene should look realistic but humorous, with the reactions clearly selling the joke.`},{name:"ZOOM CALL DISASTER",category:["HUMOR","MODERN","RELATABLE","EMBARRASSING"],message:"Take a picture and transform it into a catastrophic Zoom call moment frozen in time. Show the subject in a split-screen grid layout with multiple video call windows. The main window shows the subject caught in an embarrassing situation - maybe in pajama bottoms while standing up, cat walking across keyboard, kid bursting in, unmuted during private moment, or inappropriate background visible. Include other participant windows showing shocked, amused, or secondhand-embarrassment faces reacting. Add authentic Zoom interface elements: mute/video buttons, participant names, 'You are muted' notification, grid view layout, poor lighting, pixelated video quality, frozen buffering frames. Capture that specific modern horror of professional facade collapsing during video conference. Make it look like an actual screenshot of a Zoom disaster moment."},{name:"ZOO-TOPIA",category:["MOVIES","ANIMAL","ANTHROPOMORPHIC","DISNEY"],message:"Take a picture and transform the subject into a realistic anthropomorphized animal character (Zootopia-style realism). Choose an animal form that naturally fits the subject’s facial structure, body type, and personality. Preserve recognizable facial features, expressions, proportions, hairstyle equivalents (fur patterns), and the subject’s exact clothing translated accurately onto the animal anatomy. The character must stand upright with human-like posture, hands, and gestures while retaining believable animal anatomy, fur detail, and species-specific traits. Photorealistic fur, skin, and fabric interaction with cinematic lighting. The subject must clearly remain the same individual, now reimagined as a believable anthropomorphic animal in a realistic world."}];let m=[...$i],T=0,Se=-1,Q=navigator.onLine,v=[],Fe=!1,Ne=null,Ht=0;const ki=500,Ii="r1_camera_queue";let De,_e,le;const Ai="r1_camera_styles";let fe=[];const Ri="r1_camera_favorites",Oi="r1_camera_visible_presets";let w=[],ve=!1,z=0,pt="",kt=!0;function Aa(e){lt&&(clearTimeout(lt),lt=null),Ke||(Ke=document.getElementById("style-reveal"),ga=document.getElementById("style-reveal-text")),!(!Ke||!ga)&&(ga.textContent=e,Ke.style.display="block",lt=setTimeout(()=>{Ke&&(Ke.style.display="none"),lt=null},1200))}function $t(){return new Promise((e,t)=>{const a=indexedDB.open(_i,Xi);a.onerror=()=>{console.error("Failed to open IndexedDB:",a.error),t(a.error)},a.onsuccess=()=>{$=a.result,console.log("IndexedDB opened successfully"),e($)},a.onupgradeneeded=n=>{$=n.target.result,$.objectStoreNames.contains(Le)||($.createObjectStore(Le,{keyPath:"id"}).createIndex("timestamp","timestamp",{unique:!1}),console.log("Object store created"))}})}async function Qi(){try{const e=localStorage.getItem("r1_gallery_index");if(!e){console.log("No old gallery data to migrate");return}const t=JSON.parse(e);let a=0;for(const n of t){const i="r1_gallery_"+n,s=localStorage.getItem(i);if(s){const o=JSON.parse(s);for(const r of o)await Si(r),a++;localStorage.removeItem(i)}}localStorage.removeItem("r1_gallery_index"),console.log(`Migration complete: ${a} images migrated to IndexedDB`),await Qt()}catch(e){console.error("Migration failed:",e)}}async function Qt(){try{$||await $t(),L=[];const a=$.transaction([Le],"readonly").objectStore(Le).getAll();return new Promise((n,i)=>{a.onsuccess=()=>{L=a.result||[];const s=localStorage.getItem(vi);s&&(gt=s),L.sort((o,r)=>r.timestamp-o.timestamp),console.log(`Gallery loaded: ${L.length} images`),n()},a.onerror=()=>{console.error("Failed to load gallery:",a.error),L=[],i(a.error)}})}catch(e){console.error("Error loading gallery:",e),L=[]}}async function Si(e){try{$||await $t();const n=$.transaction([Le],"readwrite").objectStore(Le).add(e);return new Promise((i,s)=>{n.onsuccess=()=>{console.log("Image saved to IndexedDB"),i()},n.onerror=()=>{console.error("Failed to save image:",n.error),s(n.error)}})}catch(t){console.error("Error saving image:",t)}}async function Ni(e){try{$||await $t();const n=$.transaction([Le],"readwrite").objectStore(Le).delete(e);return new Promise((i,s)=>{n.onsuccess=()=>{console.log("Image deleted from IndexedDB"),i()},n.onerror=()=>{console.error("Failed to delete image:",n.error),s(n.error)}})}catch(t){console.error("Error deleting image:",t)}}async function Ci(e){const t={id:Date.now().toString()+"-"+Math.random().toString(36).substr(2,9),imageBase64:e,timestamp:Date.now()};L.unshift(t),await Si(t),console.log(`Image added. Total: ${L.length}`)}function Zi(e){return!dt&&!ht?e:e.filter(t=>{const a=new Date(t.timestamp);a.setHours(0,0,0,0);const n=a.getTime();let i=!0,s=!0;if(dt){const o=new Date(dt).getTime();i=n>=o}if(ht){const o=new Date(ht).getTime();s=n<=o}return i&&s})}function es(e){const t=[...e];return gt==="newest"?t.sort((a,n)=>n.timestamp-a.timestamp):t.sort((a,n)=>a.timestamp-n.timestamp),t}function Ra(){let e=Zi(L);return es(e)}async function ne(){xe(),Yi(),R&&R.style.display==="block"&&na(),await Qt();const e=document.getElementById("gallery-modal"),t=document.getElementById("gallery-grid"),a=document.getElementById("gallery-pagination"),n=document.getElementById("page-info"),i=document.getElementById("prev-page"),s=document.getElementById("next-page"),o=document.getElementById("gallery-count");o&&(o.textContent=L.length);const r=document.getElementById("gallery-sort-order");r&&(r.value=gt);const l=Ra();if(l.length===0)t.innerHTML='<div class="gallery-empty">No photos match the selected filter.</div>',a.style.display="none";else{const c=Math.ceil(l.length/Pt);K=Math.min(K,c);const u=(K-1)*Pt,f=Math.min(u+Pt,l.length),k=l.slice(u,f),E=document.createDocumentFragment();k.forEach(O=>{const D=document.createElement("div");if(D.className="gallery-item",Ce&&S.has(O.id)&&D.classList.add("selected"),Ce){const Y=document.createElement("input");Y.type="checkbox",Y.className="gallery-item-checkbox",Y.checked=S.has(O.id),Y.addEventListener("click",ke=>{ke.stopPropagation(),ai(O.id)}),D.appendChild(Y)}const ie=document.createElement("img");ie.src=O.imageBase64,ie.alt="Gallery image",ie.loading="lazy",D.appendChild(ie),D.onclick=()=>{if(Ce)ai(O.id),ne();else{const Y=L.findIndex(ke=>ke.id===O.id);is(Y)}},E.appendChild(D)}),t.innerHTML="",t.appendChild(E),c>1?(a.style.display="flex",n.textContent=`Page ${K} of ${c}`,i.disabled=K===1,s.disabled=K===c):a.style.display="none"}e.style.display="flex"}async function ts(){document.getElementById("gallery-modal").style.display="none",K=1,await qi()}function as(){const e=Ra(),t=Math.ceil(e.length/Pt);K<t&&(K++,ne())}function ns(){K>1&&(K--,ne())}function pa(){K=1,ne()}function ti(e,t){const a=e==="start"?"gallery-start-date-btn":"gallery-end-date-btn",n=document.getElementById(a);if(!n)return;const i=n.querySelector(".date-button-text");if(i)if(t){const o=new Date(t+"T00:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});i.textContent=o,n.classList.add("has-date")}else i.textContent=e==="start"?"Start":"End",n.classList.remove("has-date")}function is(e){if(e<0||e>=L.length)return;J=e;const t=L[e],a=document.getElementById("image-viewer"),n=document.getElementById("viewer-image"),i=document.getElementById("viewer-prompt");n.src=t.imageBase64,n.style.transform="scale(1) translate(0, 0)",oe=1,i.value="",a.style.display="flex",document.getElementById("gallery-modal").style.display="none"}function ss(){document.getElementById("image-viewer").style.display="none",J=-1,oe=1;const e=document.getElementById("gallery-modal");e.style.display="flex",ne()}async function os(){if(!(J<0||J>=L.length)&&confirm("Delete this image from gallery?")){const e=L[J];await Ni(e.id),L.splice(J,1),document.getElementById("image-viewer").style.display="none",J=-1,oe=1,ne()}}function rs(){const e=document.getElementById("preset-selector");It();const t=document.getElementById("preset-count");t&&(t.textContent=m.length),e.style.display="flex",he=!0,x=0,Ye(),setTimeout(()=>{const a=document.getElementById("preset-list");a&&ba>0&&(a.scrollTop=ba)},50)}function Gt(){const e=document.getElementById("preset-list");e&&(ba=e.scrollTop),document.getElementById("preset-selector").style.display="none",Dt="",Ge="",document.getElementById("preset-filter").value="",he=!1,x=0;const t=document.getElementById("preset-selector-category-hint");t&&(t.style.display="none"),Xt=!1}function ls(){if(!he)return;const e=document.getElementById("preset-list");!e||e.querySelectorAll(".preset-item").length===0||(x=Math.max(0,x-1),Ye())}function cs(){if(!he)return;const e=document.getElementById("preset-list");if(!e)return;const t=e.querySelectorAll(".preset-item");t.length!==0&&(x=Math.min(t.length-1,x+1),Ye())}function Ye(){const e=document.getElementById("preset-list");if(!e)return;const t=e.querySelectorAll(".preset-item");if(t.length!==0&&(t.forEach(a=>{a.classList.remove("preset-selected")}),x>=0&&x<t.length)){const a=t[x];a.classList.add("preset-selected"),a.scrollIntoView({behavior:"smooth",block:"nearest"});const n=a.querySelector(".preset-name").textContent,i=m.find(o=>o.name===n),s=document.getElementById("preset-selector-category-hint");s&&i&&i.category?(s.innerHTML="",s.style.display="block",i.category.forEach((o,r)=>{const l=document.createElement("span");if(l.textContent=o,l.style.cursor="pointer",l.style.padding="0 2px",Ge===o&&(l.style.textDecoration="underline",l.style.fontWeight="bold"),l.onclick=c=>{c.stopPropagation(),Ge===o?Ge="":Ge=o,x=0,It()},s.appendChild(l),r<i.category.length-1){const c=document.createElement("span");c.textContent=", ",s.appendChild(c)}})):s&&(s.style.display="none")}}function ds(){if(!U)return;const e=document.getElementById("settings-submenu");!e||e.querySelectorAll(".menu-section-button").length===0||(ee=Math.max(0,ee-1),Oa())}function hs(){if(!U)return;const e=document.getElementById("settings-submenu");if(!e)return;const t=e.querySelectorAll(".menu-section-button");t.length!==0&&(ee=Math.min(t.length-1,ee+1),Oa())}function Oa(){const e=document.getElementById("settings-submenu");if(!e)return;const t=e.querySelectorAll(".menu-section-button");if(t.length!==0&&(t.forEach(a=>{a.classList.remove("menu-selected")}),ee>=0&&ee<t.length)){const a=t[ee];a.classList.add("menu-selected"),a.scrollIntoView({behavior:"smooth",block:"nearest"})}}function us(){const e=document.getElementById("resolution-submenu");if(!e||e.style.display!=="flex")return;const t=e.querySelectorAll(".resolution-item");t.length!==0&&(te=(te-1+t.length)%t.length,Sa(t))}function ms(){const e=document.getElementById("resolution-submenu");if(!e||e.style.display!=="flex")return;const t=e.querySelectorAll(".resolution-item");t.length!==0&&(te=(te+1)%t.length,Sa(t))}function Sa(e){if(e.forEach(t=>t.classList.remove("menu-selected")),te>=0&&te<e.length){const t=e[te];t.classList.add("menu-selected"),t.scrollIntoView({behavior:"smooth",block:"nearest"})}}function gs(){const e=document.getElementById("burst-submenu");if(!e||e.style.display!=="flex")return;const t=e.querySelector(".submenu-list");t&&(t.scrollTop=Math.max(0,t.scrollTop-80))}function ps(){const e=document.getElementById("burst-submenu");if(!e||e.style.display!=="flex")return;const t=e.querySelector(".submenu-list");t&&(t.scrollTop=Math.min(t.scrollHeight-t.clientHeight,t.scrollTop+80))}function fs(){const e=document.getElementById("timer-settings-submenu");if(!e||e.style.display!=="flex")return;const t=e.querySelector(".submenu-list");t&&(t.scrollTop=Math.max(0,t.scrollTop-80))}function ys(){const e=document.getElementById("timer-settings-submenu");if(!e||e.style.display!=="flex")return;const t=e.querySelector(".submenu-list");t&&(t.scrollTop=Math.min(t.scrollHeight-t.clientHeight,t.scrollTop+80))}function bs(){const e=document.getElementById("master-prompt-submenu");if(!e||e.style.display!=="flex")return;const t=e.querySelector(".submenu-list");t&&(t.scrollTop=Math.max(0,t.scrollTop-80))}function Ts(){const e=document.getElementById("master-prompt-submenu");if(!e||e.style.display!=="flex")return;const t=e.querySelector(".submenu-list");t&&(t.scrollTop=Math.min(t.scrollHeight-t.clientHeight,t.scrollTop+80))}function ws(){const e=document.getElementById("motion-submenu");if(!e||e.style.display!=="flex")return;const t=e.querySelector(".submenu-list");t&&(t.scrollTop=Math.max(0,t.scrollTop-80))}function Es(){const e=document.getElementById("motion-submenu");if(!e||e.style.display!=="flex")return;const t=e.querySelector(".submenu-list");t&&(t.scrollTop=Math.min(t.scrollHeight-t.clientHeight,t.scrollTop+80))}function Li(){if(!nt)return;const e=document.getElementById("preset-builder-submenu");if(!e||e.style.display!=="flex")return;const t=e.querySelector(".preset-builder-form");t&&(t.scrollTop=Math.max(0,t.scrollTop-80))}function Mi(){if(!nt)return;const e=document.getElementById("preset-builder-submenu");if(!e||e.style.display!=="flex")return;const t=e.querySelector(".preset-builder-form");t&&(t.scrollTop=Math.min(t.scrollHeight-t.clientHeight,t.scrollTop+80))}function vs(){const e=document.getElementById("gallery-modal");if(!e||e.style.display!=="flex")return;const t=e.querySelector(".gallery-scroll-container");t&&(t.scrollTop=Math.max(0,t.scrollTop-80))}function ks(){const e=document.getElementById("gallery-modal");if(!e||e.style.display!=="flex")return;const t=e.querySelector(".gallery-scroll-container");t&&(t.scrollTop=Math.min(t.scrollHeight-t.clientHeight,t.scrollTop+80))}function Is(){const e=document.getElementById("image-viewer");if(!e||e.style.display!=="flex")return;const t=e.querySelector(".viewer-controls");t&&(t.scrollTop=Math.max(0,t.scrollTop-80))}function As(){const e=document.getElementById("image-viewer");if(!e||e.style.display!=="flex")return;const t=e.querySelector(".viewer-controls");t&&(t.scrollTop=Math.min(t.scrollHeight-t.clientHeight,t.scrollTop+80))}function Rs(){const e=document.getElementById("style-editor");if(!e||e.style.display!=="flex")return;const t=e.querySelector(".style-editor-body");t&&(t.scrollTop=Math.max(0,t.scrollTop-80))}function Os(){const e=document.getElementById("style-editor");if(!e||e.style.display!=="flex")return;const t=e.querySelector(".style-editor-body");t&&(t.scrollTop=Math.min(t.scrollHeight-t.clientHeight,t.scrollTop+80))}function Ss(){const e=document.getElementById("queue-manager");if(!e||e.style.display!=="flex")return;const t=e.querySelector(".queue-list");t&&(t.scrollTop=Math.max(0,t.scrollTop-80))}function Ns(){const e=document.getElementById("queue-manager");if(!e||e.style.display!=="flex")return;const t=e.querySelector(".queue-list");t&&(t.scrollTop=Math.min(t.scrollHeight-t.clientHeight,t.scrollTop+80))}function Cs(){if(!he)return;const e=document.getElementById("preset-list");if(!e)return;const t=e.querySelectorAll(".preset-item");if(t.length===0||x>=t.length)return;const a=t[x];a&&a.click()}function It(){const e=document.getElementById("preset-list");e.innerHTML="";const a=qs().filter(r=>{if(Dt){const l=Dt.toLowerCase(),c=r.category&&r.category.some(f=>f.toLowerCase().includes(l));if(!(r.name.toLowerCase().includes(l)||r.message.toLowerCase().includes(l)||c))return!1}return Ge?r.category&&r.category.includes(Ge):!0}).sort((r,l)=>r.name.localeCompare(l.name)),n=a.filter(r=>at(r.name)),i=a.filter(r=>!at(r.name)),s=[...n,...i];if(s.length===0){e.innerHTML='<div class="preset-empty">No presets found</div>';return}s.forEach(r=>{const l=document.createElement("div");l.className="preset-item";const c=document.createElement("div");c.className="preset-name",c.textContent=r.name;const u=document.createElement("div");u.className="preset-description preset-description-hidden",u.textContent=r.message,l.appendChild(c),l.appendChild(u),l.onclick=()=>{u.classList.contains("preset-description-hidden")?u.classList.remove("preset-description-hidden"):Ls(r)},e.appendChild(l)});const o=document.getElementById("preset-count");o&&(o.textContent=s.length)}async function Ls(e){if(Xt){const a=Te.findIndex(n=>n.name===e.name);a>-1?Te.splice(a,1):Te.push(e),ji();return}if(window.batchProcessingActive){window.batchProcessingActive=!1;const a=window.batchImagesToProcess;window.batchImagesToProcess=null,Gt();const i=document.getElementById("preset-selector").querySelector(".preset-selector-header h3");i.textContent="Select Preset",await Us(e,a);return}const t=document.getElementById("viewer-prompt");t.value=e.message,Gt()}function Ms(){if(J<0||J>=L.length){alert("No image selected");return}const t=document.getElementById("viewer-prompt").value.trim();if(!t){alert("Please enter a prompt or load a preset");return}const a=L[J];typeof PluginMessageHandler<"u"?(PluginMessageHandler.postMessage(JSON.stringify({message:sa(t),pluginId:"com.r1.pixelart",imageBase64:a.imageBase64})),alert("Magic transform submitted! You can submit again with a different prompt.")):alert("Magic transform sent: "+t.substring(0,50)+"...")}function Ft(){Ce=!Ce;const e=document.getElementById("batch-mode-toggle"),t=document.getElementById("batch-controls"),a=document.getElementById("batch-action-bar");Ce?(e.textContent="Done",e.classList.add("active"),t.style.display="flex",a.style.display="flex",S.clear(),Zt(),ne()):(e.textContent="Select",e.classList.remove("active"),t.style.display="none",a.style.display="none",S.clear(),ne())}function Zt(){const e=document.getElementById("batch-selected-count"),t=document.getElementById("batch-apply-preset"),a=document.getElementById("batch-delete");e.textContent=`${S.size} selected`,t.disabled=S.size===0,a&&(a.disabled=S.size===0)}function js(){const e=Ra();S.clear(),e.forEach(t=>S.add(t.id)),Zt(),ne()}function xs(){S.clear(),Zt(),ne()}function ai(e){S.has(e)?S.delete(e):S.add(e),Zt()}async function Ps(){if(S.size===0)return;const e=document.getElementById("preset-selector"),t=e.querySelector(".preset-selector-header h3");t.textContent=`Select Preset (${S.size} images)`;const a=Array.from(S);window.batchProcessingActive=!0,window.batchImagesToProcess=a,It(),e.style.display="flex",he=!0,x=0,Ye()}async function Us(e,t){const a=t||Array.from(S),n=a.length,i=document.createElement("div");i.className="batch-progress-overlay",i.innerHTML=`
    <div class="batch-progress-text">Processing <span id="batch-current">0</span> / ${n}</div>
    <div class="batch-progress-bar">
      <div class="batch-progress-fill" id="batch-progress-fill" style="width: 0%"></div>
    </div>
  `,document.body.appendChild(i);let s=0;for(const o of a){const r=L.find(l=>l.id===o);if(r)try{const l=sa(e.message);typeof PluginMessageHandler<"u"&&PluginMessageHandler.postMessage(JSON.stringify({message:l,pluginId:"com.r1.pixelart",imageBase64:r.imageBase64})),s++,document.getElementById("batch-current").textContent=s,document.getElementById("batch-progress-fill").style.width=`${s/n*100}%`,await new Promise(c=>setTimeout(c,2e3))}catch(l){console.error(`Failed to process image ${o}:`,l)}}document.body.removeChild(i),Ce=!1,S.clear(),Ft(),alert(`Batch processing complete! ${s} of ${n} images submitted.`)}async function Bs(){if(S.size===0)return;const e=S.size;if(!confirm(`Are you sure you want to delete ${e} selected image${e>1?"s":""}? This cannot be undone.`))return;const a=Array.from(S),n=document.createElement("div");n.className="batch-progress-overlay",n.innerHTML=`
    <div class="batch-progress-text">Deleting <span id="batch-current">0</span> / ${e}</div>
    <div class="batch-progress-bar">
      <div class="batch-progress-fill" id="batch-progress-fill" style="width: 0%"></div>
    </div>
  `,document.body.appendChild(n);let i=0;for(const s of a)try{await Ni(s),i++,document.getElementById("batch-current").textContent=i,document.getElementById("batch-progress-fill").style.width=`${i/e*100}%`}catch(o){console.error(`Failed to delete image ${s}:`,o)}document.body.removeChild(n),Ce=!1,S.clear(),await Qt(),Ft(),alert(`${i} of ${e} image${i>1?"s":""} deleted successfully.`)}function Ds(e){Bt=e,Te=[],Xt=!0;const t=document.getElementById("preset-selector"),a=t.querySelector(".preset-selector-header h3");a.innerHTML='Select Presets (Multi-Select) <span id="multi-preset-count" style="font-size: 12px; color: #666;">(0 selected)</span>';let n=document.getElementById("multi-preset-controls");if(!n){n=document.createElement("div"),n.id="multi-preset-controls",n.style.cssText="padding: 8px; background: #f5f5f5; border-bottom: 1px solid #ddd; display: flex; gap: 8px; justify-content: space-between;",n.innerHTML=`
      <button id="multi-preset-apply" class="batch-control-button" style="background: #4CAF50; color: white;">Apply Selected</button>
      <button id="multi-preset-cancel" class="batch-control-button">Cancel</button>
    `;const i=document.getElementById("preset-filter");i.parentNode.insertBefore(n,i.nextSibling)}n.style.display="flex",It(),ji(),t.style.display="flex",he=!0,x=0,Ye(),document.getElementById("multi-preset-apply").onclick=Hs,document.getElementById("multi-preset-cancel").onclick=xi}function ji(){document.getElementById("preset-list").querySelectorAll(".preset-item").forEach(n=>{const i=n.querySelector(".preset-name").textContent;Te.some(o=>o.name===i)?(n.style.background="#e8f5e9",n.style.border="2px solid #4CAF50"):(n.style.background="",n.style.border="")});const a=document.getElementById("multi-preset-count");a&&(a.textContent=`(${Te.length} selected)`)}function xi(){Xt=!1,Bt=null,Te=[];const e=document.getElementById("multi-preset-controls");e&&(e.style.display="none");const t=document.querySelector(".preset-selector-header h3");t.textContent="Select Preset",Gt()}async function Hs(){if(Te.length===0){alert("Please select at least one preset");return}if(!Bt){alert("No image selected");return}const e=L.find(i=>i.id===Bt);if(!e){alert("Image not found");return}const t=[...Te];xi();const a=document.createElement("div");a.className="batch-progress-overlay",a.innerHTML=`
    <div class="batch-progress-text">Applying preset <span id="batch-current">0</span> / ${t.length}</div>
    <div class="batch-progress-bar">
      <div class="batch-progress-fill" id="batch-progress-fill" style="width: 0%"></div>
    </div>
  `,document.body.appendChild(a);let n=0;for(const i of t)try{const s=sa(i.message);typeof PluginMessageHandler<"u"&&PluginMessageHandler.postMessage(JSON.stringify({message:s,pluginId:"com.r1.pixelart",imageBase64:e.imageBase64})),n++,document.getElementById("batch-current").textContent=n,document.getElementById("batch-progress-fill").style.width=`${n/t.length*100}%`,await new Promise(o=>setTimeout(o,2e3))}catch(s){console.error(`Failed to apply preset ${i.name}:`,s)}document.body.removeChild(a),alert(`${n} preset${n>1?"s":""} applied successfully!`)}function Gs(){const e=document.getElementById("viewer-image"),t=document.querySelector(".image-viewer-container");let a=0,n=0,i=0,s=0,o=!1;t.addEventListener("touchstart",r=>{r.touches.length===2?(r.preventDefault(),Lt=!0,Qn=ni(r.touches[0],r.touches[1]),Zn=oe):r.touches.length===1&&oe>1&&(o=!0,i=r.touches[0].clientX-a,s=r.touches[0].clientY-n)},{passive:!1}),t.addEventListener("touchmove",r=>{if(Lt&&r.touches.length===2){r.preventDefault();const c=ni(r.touches[0],r.touches[1])/Qn;oe=Math.max(1,Math.min(Zn*c,5)),e.style.transform=`scale(${oe}) translate(${a}px, ${n}px)`}else o&&r.touches.length===1&&oe>1&&(r.preventDefault(),a=r.touches[0].clientX-i,n=r.touches[0].clientY-s,e.style.transform=`scale(${oe}) translate(${a}px, ${n}px)`)},{passive:!1}),t.addEventListener("touchend",r=>{r.touches.length<2&&(Lt=!1),r.touches.length===0&&(o=!1,oe===1&&(a=0,n=0,e.style.transform="scale(1) translate(0, 0)"))}),t.addEventListener("touchcancel",()=>{Lt=!1,o=!1})}function ni(e,t){const a=e.clientX-t.clientX,n=e.clientY-t.clientY;return Math.sqrt(a*a+n*n)}function it(){if(!N)return;const e=document.getElementById("menu-styles-list");if(!e)return;const t=e.querySelectorAll(".style-item");if(t.length===0)return;t.forEach(n=>{n.classList.remove("menu-selected")}),B=Math.max(0,Math.min(B,t.length-1));const a=t[B];if(a){a.classList.add("menu-selected"),a.scrollIntoView({behavior:"smooth",block:"nearest"});const n=parseInt(a.dataset.index),i=m[n],s=document.getElementById("menu-category-hint");s&&i&&i.category?(s.innerHTML="",s.style.display="block",i.category.forEach((o,r)=>{const l=document.createElement("span");if(l.textContent=o,l.style.cursor="pointer",l.style.padding="0 2px",pe===o&&(l.style.textDecoration="underline",l.style.fontWeight="bold"),l.onclick=c=>{c.stopPropagation(),pe===o?pe="":pe=o,B=0,we()},s.appendChild(l),r<i.category.length-1){const c=document.createElement("span");c.textContent=", ",s.appendChild(c)}})):s&&(s.style.display="none")}}function Fs(){if(!N||!je)return;const e=document.getElementById("menu-styles-list");!e||e.querySelectorAll(".style-item").length===0||(B=Math.max(0,B-1),it())}function zs(){if(!N||!je)return;const e=document.getElementById("menu-styles-list");if(!e)return;const t=e.querySelectorAll(".style-item");t.length!==0&&(B=Math.min(t.length-1,B+1),it())}function Vs(){if(!N||!je)return;const e=document.getElementById("menu-styles-list");if(!e)return;const t=e.querySelectorAll(".style-item");if(t.length===0||B>=t.length)return;const a=t[B];if(a&&a.querySelector(".style-name")){const s=Rt()[B];if(s){const o=m.findIndex(r=>r===s);o!==-1&&(T=o,V(),ja())}}}function Ys(){const e=localStorage.getItem(Ai);if(e)try{const i=JSON.parse(e).filter(s=>s.internal===!1);m.push(...i)}catch(n){console.error("Error loading styles:",n)}const t=localStorage.getItem(Ri);if(t)try{fe=JSON.parse(t),Array.isArray(fe)||(fe=[])}catch(n){console.error("Error parsing favorite styles:",n),fe=[]}Qs(),Xs(),Ks();const a=localStorage.getItem(Oi);if(a)try{w=JSON.parse(a),Array.isArray(w)||(w=[])}catch(n){console.error("Error parsing visible presets:",n),w=[]}w.length===0&&(w=m.map(n=>n.name),Me())}function Me(){try{localStorage.setItem(Oi,JSON.stringify(w))}catch(e){console.error("Error saving visible presets:",e)}}function qs(){return m.filter(e=>w.includes(e.name))}function Ws(e){try{localStorage.setItem(di,e.toString())}catch(t){console.error("Error saving resolution:",t)}}function Ks(){const e=localStorage.getItem(hi);e!==null&&($e=parseInt(e))}function Js(){localStorage.setItem(hi,$e.toString())}function At(){h&&setTimeout(()=>{const e=ka[$e];switch(h.style.filter="",e.value){case"daylight":h.style.filter="brightness(1.05) saturate(1.1)";break;case"cloudy":h.style.filter="brightness(1.1) saturate(0.95) sepia(0.05)";break;case"tungsten":h.style.filter="brightness(0.95) saturate(1.15) hue-rotate(-10deg)";break;case"fluorescent":h.style.filter="brightness(1.02) saturate(1.05) hue-rotate(5deg)";break;case"candlelight":h.style.filter="brightness(0.85) saturate(1.3) sepia(0.15) hue-rotate(-15deg)";break;case"moonlight":h.style.filter="brightness(0.7) saturate(0.8) hue-rotate(15deg) contrast(1.1)";break;case"auto":default:h.style.filter="";break}},50)}function Pi(e,t,a){const n=ka[$e];if(n.value==="auto")return;const i=e.getImageData(0,0,t,a),s=i.data;let o=1,r=1,l=0,c=1;switch(n.value){case"daylight":o=1.05,r=1.1,l=5;break;case"cloudy":o=1.1,r=.95,l=10;break;case"tungsten":o=.95,r=1.15,l=-20;break;case"fluorescent":o=1.02,r=1.05,l=-10;break;case"candlelight":o=.85,r=1.3,l=25,c=.95;break;case"moonlight":o=.7,r=.8,l=-15,c=1.1;break}for(let u=0;u<s.length;u+=4){let f=s[u],k=s[u+1],E=s[u+2];l>0?(f=Math.min(255,f+l),k=Math.min(255,k+l*.5)):l<0&&(E=Math.min(255,E-l)),f*=o,k*=o,E*=o;const O=.2989*f+.587*k+.114*E;f=O+r*(f-O),k=O+r*(k-O),E=O+r*(E-O),f=((f/255-.5)*c+.5)*255,k=((k/255-.5)*c+.5)*255,E=((E/255-.5)*c+.5)*255,s[u]=Math.max(0,Math.min(255,f)),s[u+1]=Math.max(0,Math.min(255,k)),s[u+2]=Math.max(0,Math.min(255,E))}e.putImageData(i,0,0)}function _s(){document.getElementById("settings-submenu").style.display="none";const e=document.getElementById("white-balance-submenu"),t=document.getElementById("white-balance-list");t.innerHTML="",ka.forEach((a,n)=>{const i=document.createElement("div");i.className="resolution-item",n===$e&&i.classList.add("active");const s=document.createElement("span");s.className="resolution-name",s.textContent=a.name,i.appendChild(s),i.onclick=()=>{$e=n,Js(),document.getElementById("current-white-balance-display").textContent=a.name,I&&At(),Ui()},t.appendChild(i)}),e.style.display="flex"}function Ui(){document.getElementById("white-balance-submenu").style.display="none",document.getElementById("settings-submenu").style.display="flex"}function Xs(){try{const e=localStorage.getItem(di);if(e!==null){const t=parseInt(e,10);t>=0&&t<wt.length&&(ye=t)}}catch(e){console.error("Error loading resolution:",e)}}function ft(){const t=m.filter(i=>w.includes(i.name)).slice().sort((i,s)=>i.name.localeCompare(s.name)),a=t.filter(i=>at(i.name)),n=t.filter(i=>!at(i.name));return{favorites:a,regular:n}}function Rt(){const{favorites:e,regular:t}=ft(),a=e.filter(i=>w.includes(i.name)),n=t.filter(i=>w.includes(i.name));return[...a,...n]}function Bi(){const e=Rt(),t=m[T];return e.findIndex(a=>a===t)}function Di(e){const a=Rt()[e];return m.findIndex(n=>n===a)}function ea(){try{const e=m.filter(t=>t.internal===!1);localStorage.setItem(Ai,JSON.stringify(e))}catch(e){console.error("Error saving styles:",e)}}function $s(e){const t=fe.indexOf(e);t>-1?fe.splice(t,1):fe.push(e),localStorage.setItem(Ri,JSON.stringify(fe));const a=document.querySelector(".styles-menu-scroll-container"),n=a?a.scrollTop:0;we(),a&&(a.scrollTop=n)}function Qs(){const e=localStorage.getItem(gi);if(e!==null)try{const t=parseInt(e,10);t>=0&&t<m.length&&(T=t)}catch(t){console.error("Error loading last used style:",t)}}function at(e){return fe.includes(e)}function Hi(){const e=m.filter(n=>!n.internal&&at(n.name));if(e.length>0){const n=e[Math.floor(Math.random()*e.length)];return m.findIndex(i=>i===n)}const t=m.filter(n=>!n.internal);if(t.length===0)return 0;const a=t[Math.floor(Math.random()*t.length)];return m.findIndex(n=>n===a)}function Zs(){ce=!ce;const e=document.getElementById("motion-toggle");if(ce)e.classList.add("active"),e.title="Motion Detection: ON",showStatus("Motion Detection enabled - Press side button to start",3e3);else{e.classList.remove("active"),e.title="Motion Detection: OFF",La(),ct&&(clearInterval(ct),ct=null);const t=document.getElementById("timer-countdown");t&&(t.style.display="none",t.classList.remove("countdown-fade-in","countdown-fade-out"));const a=document.getElementById("camera-button");a&&A.length>1&&(a.style.display="flex"),showStatus("Motion Detection OFF",2e3)}}function eo(){for(let e in mt)if(mt[e].seconds===tt)return parseInt(e);return 1}function to(){document.getElementById("settings-submenu").style.display="none",document.getElementById("motion-submenu").style.display="flex",_t=!0,U=!1}function ao(){document.getElementById("motion-submenu").style.display="none",_t=!1,ue()}function no(){document.getElementById("settings-submenu").style.display="none",document.getElementById("visible-presets-submenu").style.display="flex",N=!1,ve=!0,kt=!0,U=!1,z=0,pt="",document.getElementById("visible-presets-filter").value="",Xe(),zt()}function io(){document.getElementById("visible-presets-submenu").style.display="none",ve=!1,kt=!1,z=0,pt="",He="";const e=document.getElementById("visible-presets-category-hint");e&&(e.style.display="none"),ue()}function Gi(){document.getElementById("settings-submenu").style.display="none",document.getElementById("preset-builder-submenu").style.display="flex",N=!1,U=!1,nt=!0,ta()}function Na(){document.getElementById("preset-builder-submenu").style.display="none",nt=!1,re=-1;const e=document.getElementById("preset-builder-delete");e&&(e.style.display="none"),ue()}function ta(){re=-1,document.getElementById("preset-builder-name").value="",document.getElementById("preset-builder-category").value="",document.getElementById("preset-builder-template").value="",document.getElementById("preset-builder-prompt").value="";const e=document.getElementById("preset-builder-delete");e&&(e.style.display="none");const t=document.getElementById("preset-builder-clear");t&&(t.style.display="flex")}function so(e){const t=m[e];Gi(),re=e,setTimeout(()=>{const a=document.getElementById("preset-builder-name"),n=document.getElementById("preset-builder-category"),i=document.getElementById("preset-builder-prompt"),s=document.getElementById("preset-builder-template"),o=document.getElementById("preset-builder-delete"),r=document.getElementById("preset-builder-clear");a&&(a.value=t.name),n&&(n.value=t.category?t.category.join(", "):""),i&&(i.value=t.message),s&&(s.value=""),o&&(o.style.display="flex"),r&&(r.style.display="none")},100)}function oo(){const e=document.getElementById("preset-builder-template"),t=document.getElementById("preset-builder-prompt"),a=e.value;a&&ei[a]!==void 0&&(t.value=ei[a])}function ro(){const e=new Set;return m.forEach(t=>{t.category&&Array.isArray(t.category)&&t.category.forEach(a=>{e.add(a.toUpperCase())})}),Array.from(e).sort()}function lo(){const e=document.getElementById("preset-builder-name").value.trim(),t=document.getElementById("preset-builder-category").value.trim(),a=document.getElementById("preset-builder-prompt").value.trim();if(!e){alert("Please enter a preset name");return}if(!a){alert("Please enter a prompt");return}const n=t?t.split(",").map(i=>i.trim().toUpperCase()).filter(i=>i.length>0):["CUSTOM"];if(re>=0){const i=m[re].name;if(m[re]={name:e.toUpperCase(),category:n,message:a,internal:!1},i!==e.toUpperCase()){const s=w.indexOf(i);s>-1&&(w[s]=e.toUpperCase())}}else{const i=m.findIndex(o=>o.name.toUpperCase()===e.toUpperCase());if(i!==-1){if(!confirm(`A preset named "${e}" already exists. Do you want to overwrite it?`))return;m.splice(i,1)}const s={name:e.toUpperCase(),category:n,message:a,internal:!1};m.push(s),w.includes(s.name)||w.push(s.name)}Me(),ea(),alert(re>=0?`Preset "${e}" updated!`:`Preset "${e}" saved successfully!`),ta(),Na(),N&&we()}function co(){if(re<0){alert("No preset selected for deletion");return}const e=m[re];if(e.internal!==!1){alert("Cannot delete built-in presets");return}if(!confirm(`Delete preset "${e.name}"? This cannot be undone.`))return;m.splice(re,1);const t=w.indexOf(e.name);t>-1&&(w.splice(t,1),Me()),T>=m.length&&(T=m.length-1),ea(),alert(`Preset "${e.name}" deleted successfully!`),ta(),Na(),N&&we()}function Xe(){const e=document.getElementById("visible-presets-list");e.innerHTML="";const n=m.filter(o=>!o.internal).filter(o=>{if(pt){const r=pt.toLowerCase(),l=o.category&&o.category.some(u=>u.toLowerCase().includes(r));if(!(o.name.toLowerCase().includes(r)||l))return!1}return He?o.category&&o.category.includes(He):!0}).sort((o,r)=>o.name.localeCompare(r.name)),i=document.createDocumentFragment();n.forEach(o=>{const r=document.createElement("div");r.className="style-item",r.dataset.presetName=o.name;const l=document.createElement("input");l.type="checkbox",l.className="master-prompt-checkbox",l.checked=w.includes(o.name),l.style.marginRight="3vw";const c=document.createElement("span");c.className="style-name",c.textContent=o.name,r.appendChild(l),r.appendChild(c),l.onclick=u=>{u.stopPropagation(),ii(o.name,l.checked)},r.onclick=()=>{l.checked=!l.checked,ii(o.name,l.checked)},i.appendChild(r)}),e.appendChild(i);const s=document.getElementById("visible-presets-count");if(s){const o=n.filter(r=>w.includes(r.name)).length;s.textContent=o}setTimeout(()=>{yt()},50)}function ii(e,t){const a=w.indexOf(e);t&&a===-1?w.push(e):!t&&a>-1&&w.splice(a,1),Me(),zt(),Xe();const n=document.getElementById("styles-count");if(n){const{favorites:i,regular:s}=ft(),o=i.length+s.length;n.textContent=o}N&&we()}function zt(){const e=document.getElementById("current-visible-presets-display");if(e){const t=m.filter(n=>!n.internal).length,a=w.length;e.textContent=a===t?"All Visible":`${a} of ${t}`}}function ho(){if(!ve||!kt)return;const e=document.getElementById("visible-presets-list");!e||e.querySelectorAll(".style-item").length===0||(z=Math.max(0,z-1),yt())}function uo(){if(!ve||!kt)return;const e=document.getElementById("visible-presets-list");if(!e)return;const t=e.querySelectorAll(".style-item");t.length!==0&&(z=Math.min(t.length-1,z+1),yt())}function yt(){if(!ve)return;const e=document.getElementById("visible-presets-list");if(!e)return;const t=e.querySelectorAll(".style-item");if(t.length===0)return;t.forEach(n=>{n.classList.remove("menu-selected")}),z=Math.max(0,Math.min(z,t.length-1));const a=t[z];if(a){a.classList.add("menu-selected"),a.scrollIntoView({behavior:"smooth",block:"nearest"});const n=a.dataset.presetName,i=m.find(o=>o.name===n),s=document.getElementById("visible-presets-category-hint");s&&i&&i.category?(s.innerHTML="",s.style.display="block",i.category.forEach((o,r)=>{const l=document.createElement("span");if(l.textContent=o,l.style.cursor="pointer",l.style.padding="0 2px",He===o&&(l.style.textDecoration="underline",l.style.fontWeight="bold"),l.onclick=c=>{c.stopPropagation(),He===o?He="":He=o,z=0,Xe()},s.appendChild(l),r<i.category.length-1){const c=document.createElement("span");c.textContent=", ",s.appendChild(c)}})):s&&(s.style.display="none")}}function mo(){if(!ve||!kt)return;const e=document.getElementById("visible-presets-list");if(!e)return;const t=e.querySelectorAll(".style-item");if(t.length===0||z>=t.length)return;const a=t[z];a&&a.click()}function Fi(){const e=["Very Low","Low","Medium","High","Very High"],t=document.getElementById("current-motion-display");if(t){const a=Math.floor((50-Ze)/10)+1,n=Math.max(1,Math.min(5,a));t.textContent=`Sensitivity: ${e[n-1]}`}}function Mt(){const e={motionThreshold:Ze,motionPixelThreshold:Ia,motionContinuousEnabled:Ve,motionCooldown:et,motionStartDelay:tt};try{localStorage.setItem(wi,JSON.stringify(e))}catch(t){console.error("Failed to save motion settings:",t)}}function go(){try{const e=localStorage.getItem(wi);if(e){const o=JSON.parse(e);Ze=o.motionThreshold||30,Ia=o.motionPixelThreshold||.1,Ve=o.motionContinuousEnabled!==void 0?o.motionContinuousEnabled:!0,et=o.motionCooldown||2,tt=o.motionStartDelay||3}const t=document.getElementById("motion-sensitivity-slider");if(t){const o=Math.floor((50-Ze)/10)+1;t.value=Math.max(1,Math.min(5,o))}const a=document.getElementById("motion-continuous-enabled");a&&(a.checked=Ve);const n=document.getElementById("motion-cooldown-slider");n&&(n.value=et);const i=document.getElementById("motion-start-delay-slider"),s=document.getElementById("motion-start-delay-value");if(i&&s){const o=eo();i.value=o,s.textContent=mt[o].label}Fi()}catch(e){console.error("Failed to load motion settings:",e)}}function po(){H=!H;const e=document.getElementById("no-magic-status");e&&(e.textContent=H?"Enabled":"Disabled",e.style.color=H?"#4CAF50":"",e.style.fontWeight=H?"600":"");try{localStorage.setItem(Ei,JSON.stringify(H))}catch(t){console.error("Failed to save No Magic mode:",t)}H?showStatus("No Magic Mode ON - Camera only",2e3):showStatus("No Magic Mode OFF - AI prompts enabled",2e3)}function fo(){try{const e=localStorage.getItem(Ei);if(e!==null){H=JSON.parse(e);const t=document.getElementById("no-magic-status");t&&(t.textContent=H?"Enabled":"Disabled",t.style.color=H?"#4CAF50":"",t.style.fontWeight=H?"600":"")}}catch(e){console.error("Failed to load No Magic mode:",e)}}function yo(){document.getElementById("settings-submenu").style.display="none",document.getElementById("tutorial-submenu").style.display="flex",N=!1,We=!0,ae=0,U=!1,zi()}function bo(){document.getElementById("tutorial-submenu").style.display="none",We=!1,ue()}function To(e){const t=document.getElementById("tutorial-glossary"),a=document.getElementById("tutorial-content-area"),n=document.getElementById("section-"+e),i=document.getElementById("back-to-glossary");t&&a&&n&&(t.style.display="none",a.style.display="flex",i&&(i.style.display="block"),setTimeout(()=>{n.scrollIntoView({behavior:"smooth",block:"start"})},100))}function zi(){const e=document.getElementById("tutorial-glossary"),t=document.getElementById("tutorial-content-area"),a=document.getElementById("back-to-glossary");e&&t&&(t.style.display="none",e.style.display="block",a&&(a.style.display="none"),ae=0,setTimeout(()=>{Ca()},50))}function wo(){if(!We)return;const e=document.getElementById("tutorial-glossary");if(e&&e.style.display!=="none"){const n=e.querySelectorAll(".glossary-item");if(n.length===0)return;ae=(ae-1+n.length)%n.length,Ca();return}const t=document.getElementById("tutorial-content-area");if(!t||t.style.display!=="flex")return;const a=t.querySelector(".submenu-list.tutorial-content");a&&(a.scrollTop=Math.max(0,a.scrollTop-80))}function Eo(){if(!We)return;const e=document.getElementById("tutorial-glossary");if(e&&e.style.display!=="none"){const n=e.querySelectorAll(".glossary-item");if(n.length===0)return;ae=(ae+1)%n.length,Ca();return}const t=document.getElementById("tutorial-content-area");if(!t||t.style.display!=="flex")return;const a=t.querySelector(".submenu-list.tutorial-content");a&&(a.scrollTop=Math.min(a.scrollHeight-a.clientHeight,a.scrollTop+80))}function Ca(){const e=document.getElementById("tutorial-glossary");if(!e)return;const t=e.querySelectorAll(".glossary-item");if(t.length!==0&&(t.forEach(a=>{a.classList.remove("menu-selected")}),ae>=0&&ae<t.length)){const a=t[ae];a.classList.add("menu-selected"),a.scrollIntoView({behavior:"smooth",block:"nearest"})}}function Ta(){!h||!p||(ge=null,Ct=!1,xt=setInterval(()=>{if(!ce||Ct||!Ve&&R.style.display==="block")return;vo()&&(console.log("Motion detected! Capturing..."),Vt(),Ct=!0,setTimeout(()=>{if(Ct=!1,ge=null,R.style.display==="block"&&(R.style.display="none",h.style.display="block"),!Ve){La(),ce=!1;const t=document.getElementById("motion-toggle");t.classList.remove("active"),t.title="Motion Detection: OFF",showStatus("Motion capture complete - Press eye button to reactivate",3e3)}},et*1e3))},500))}function La(){xt&&(clearInterval(xt),xt=null),ge=null}function vo(){if(!h||!p)return!1;const e=p.getContext("2d"),t=320,a=240;p.width=t,p.height=a,e.drawImage(h,0,0,t,a);const n=e.getImageData(0,0,t,a);if(!ge)return ge=n,!1;let i=0;const s=t*a;for(let r=0;r<n.data.length;r+=4){const l=Math.abs(n.data[r]-ge.data[r]),c=Math.abs(n.data[r+1]-ge.data[r+1]),u=Math.abs(n.data[r+2]-ge.data[r+2]);(l+c+u)/3>Ze&&i++}return ge=n,i/s>Ia}function ko(){Je=!Je;const e=document.getElementById("random-toggle");Je?(e.classList.add("random-active"),y.textContent=`Random mode ON • ${m[T].name}`):(e.classList.remove("random-active"),V()),typeof PluginMessageHandler<"u"&&PluginMessageHandler.postMessage(JSON.stringify({action:"random_mode_toggled",enabled:Je,timestamp:Date.now()}))}function Io(){try{const e=localStorage.getItem(Ii);e&&(v=JSON.parse(e))}catch(e){console.error("Error loading queue:",e),v=[]}}function Ot(){try{localStorage.setItem(Ii,JSON.stringify(v))}catch(e){console.error("Error saving queue:",e)}}function fa(){De&&(Q?(De.className="connection-status online",De.querySelector("#connection-text").textContent="Online"):(De.className="connection-status offline",De.querySelector("#connection-text").textContent="Offline"),De.style.display="block"),st()}function st(){if(_e){const e=v.length;_e.querySelector("#queue-count").textContent=e,_e.style.display=e>0?"block":"none"}if(le){const e=v.length;le.querySelector("#sync-count").textContent=e,le.style.display=e>0&&Q?"block":"none"}}function Ao(){window.addEventListener("online",()=>{Q=!0,fa(),console.log("Connection restored"),v.length>0&&!Fe&&setTimeout(()=>{y.textContent=`Connection restored! Syncing ${v.length} photos...`,Tt()},1e3)}),window.addEventListener("offline",()=>{Q=!1,fa(),console.log("Connection lost"),Fe&&(y.textContent="Connection lost during sync")}),fa()}async function Ro(){try{return A=(await navigator.mediaDevices.enumerateDevices()).filter(t=>t.kind==="videoinput"),console.log("Available cameras:",A.length),A}catch(e){return console.error("Error enumerating cameras:",e),[]}}function aa(){const e=wt[ye];if(A.length===0)return{video:{facingMode:"environment",width:{ideal:e.width},height:{ideal:e.height}}};const a={video:{deviceId:{exact:A[G].deviceId},width:{ideal:e.width},height:{ideal:e.height}}};return ze()&&(a.video.advanced=[{zoom:1}]),a}async function Oo(e){if(!(e===ye||!I)){ye=e,Ws(e);try{y.textContent="Changing resolution...",I&&I.getTracks().forEach(a=>a.stop());const t=aa();I=await navigator.mediaDevices.getUserMedia(t),h.srcObject=I,j=I.getVideoTracks()[0],setTimeout(()=>{At()},100),await new Promise(a=>{h.onloadedmetadata=async()=>{try{await h.play(),bt(),await ot(P),setTimeout(a,100)}catch(n){console.error("Video play error:",n),a()}}}),V(),typeof PluginMessageHandler<"u"&&PluginMessageHandler.postMessage(JSON.stringify({action:"resolution_changed",resolution:wt[ye].name,timestamp:Date.now()}))}catch(t){console.error("Resolution change error:",t),y.textContent="Resolution change failed"}}}function wa(){if(A.length===0)return"Default Camera";const e=A[G];let t=e.label;return!t||t===""?e.deviceId?t=`Camera ${G+1}`:t="Unknown Camera":(t=t.replace(/\([^)]*\)/g,"").trim(),t.toLowerCase().includes("front")?t="Front Camera":t.toLowerCase().includes("back")||t.toLowerCase().includes("rear")?t="Back Camera":t.length>20&&(t=t.substring(0,17)+"...")),t}function ze(){if(A.length===0)return!1;const e=A[G];if(!e)return!1;const t=e.label.toLowerCase();return e.facingMode==="user"?!0:e.facingMode==="environment"?!1:t.includes("front")||t.includes("user")||t.includes("selfie")||t.includes("face")?!0:t.includes("back")||t.includes("rear")||t.includes("environment")?!1:A.length===2?G===1:G>0}function bt(){try{ze()?(h.style.transform="translateZ(0)",h.style.webkitTransform="translateZ(0)"):(h.style.transform="scaleX(-1) translateZ(0)",h.style.webkitTransform="scaleX(-1) translateZ(0)")}catch(e){console.warn("Mirror transform skipped:",e)}}function So(){if(!j)return!1;const e=j.getCapabilities();return e&&"zoom"in e}function Vi(){if(!j)return{min:1,max:5,step:.1};const e=j.getCapabilities();return e&&e.zoom?{min:Math.min(e.zoom.min||1,1),max:Math.max(e.zoom.max||5,5),step:e.zoom.step||.1}:{min:1,max:5,step:.1}}async function ot(e){if(j)try{if(So()){const t=Vi(),a=Math.max(t.min,Math.min(e,t.max)),n={advanced:[{zoom:a}]},i=j.getCapabilities();i&&i.focusMode&&i.focusMode.includes("continuous")&&(n.advanced[0].focusMode="continuous"),await j.applyConstraints(n),P=a,ze()?(h.style.transform="translateZ(0)",h.style.webkitTransform="translateZ(0)"):(h.style.transform="scaleX(-1) translateZ(0)",h.style.webkitTransform="scaleX(-1) translateZ(0)")}else{const t=Math.max(1,Math.min(e,5));P=t,ze()?(h.style.transform=`scale(${t})`,h.style.webkitTransform=`scale(${t})`):(h.style.transform=`scaleX(-1) scale(${t})`,h.style.webkitTransform=`scaleX(-1) scale(${t})`)}}catch{const a=Math.max(1,Math.min(e,5));P=a,ze()?(h.style.transform=`scale(${a})`,h.style.webkitTransform=`scale(${a})`):(h.style.transform=`scaleX(-1) scale(${a})`,h.style.webkitTransform=`scaleX(-1) scale(${a})`)}}async function Ea(){if(j)try{const e=j.getCapabilities();e&&e.focusMode&&(e.focusMode.includes("single-shot")?(await j.applyConstraints({advanced:[{focusMode:"single-shot",zoom:P}]}),console.log("Triggered single-shot focus"),setTimeout(async()=>{try{await j.applyConstraints({advanced:[{focusMode:"continuous",zoom:P}]})}catch(t){console.log("Could not return to continuous focus:",t)}},500)):e.focusMode.includes("manual")&&(await j.applyConstraints({advanced:[{focusMode:"manual",zoom:P}]}),console.log("Triggered manual focus")))}catch(e){console.log("Focus adjustment not supported or failed:",e)}}async function No(){if(ua||A.length<=1){console.log("Cannot switch camera: loading or not enough cameras");return}ua=!0;try{y.textContent="Switching camera...",I&&I.getTracks().forEach(t=>t.stop()),G=(G+1)%A.length,console.log(`Switching to camera ${G+1} of ${A.length}`);const e=aa();I=await navigator.mediaDevices.getUserMedia(e),h.srcObject=I,j=I.getVideoTracks()[0],setTimeout(()=>{At()},100),await new Promise(t=>{h.onloadedmetadata=async()=>{try{await h.play(),bt(),await ot(P),setTimeout(t,100)}catch(a){console.error("Video play error:",a),t()}}}),V(),typeof PluginMessageHandler<"u"&&PluginMessageHandler.postMessage(JSON.stringify({action:"camera_switched",cameraIndex:G,cameraLabel:wa(),timestamp:Date.now()}))}catch(e){console.error("Camera switch error:",e),y.textContent="Camera switch failed",G=(G-1+A.length)%A.length}finally{ua=!1}}function Co(){try{const e=localStorage.getItem(ui);if(e){const t=JSON.parse(e);M=t.count||5;const a=t.speed||2;Et=Qe[a].delay}}catch(e){console.error("Error loading burst settings:",e)}}function si(e,t){try{localStorage.setItem(ui,JSON.stringify({count:e,speed:t}))}catch(a){console.error("Error saving burst settings:",a)}}function Lo(){Re=!Re;const e=document.getElementById("burst-toggle");Re?(e.classList.add("burst-active"),y.textContent=`Burst mode ON (${M} photos) • ${m[T].name}`):(e.classList.remove("burst-active"),V()),typeof PluginMessageHandler<"u"&&PluginMessageHandler.postMessage(JSON.stringify({action:"burst_mode_toggled",enabled:Re,count:M,timestamp:Date.now()}))}function Mo(){Oe=!Oe;const e=document.getElementById("timer-toggle");Oe?(e.classList.add("timer-active"),y.textContent=`Timer mode ON (${de}s delay) • ${m[T].name}`):(e.classList.remove("timer-active"),be&&(clearInterval(be),be=null,document.getElementById("timer-countdown").style.display="none"),V()),typeof PluginMessageHandler<"u"&&PluginMessageHandler.postMessage(JSON.stringify({action:"timer_mode_toggled",enabled:Oe,delay:de,timestamp:Date.now()}))}function va(e){let t=de;const a=document.getElementById("timer-countdown"),n=document.getElementById("timer-countdown-text");n.textContent=t,a.style.display="flex",a.classList.remove("countdown-fade-out"),a.classList.add("countdown-fade-in"),y.textContent=`Timer: ${t}s...`,be=setInterval(()=>{t--,t>0?(a.classList.remove("countdown-fade-in"),a.classList.add("countdown-fade-out"),setTimeout(()=>{n.textContent=t,a.classList.remove("countdown-fade-out"),a.classList.add("countdown-fade-in"),y.textContent=`Timer: ${t}s...`},500)):(a.classList.remove("countdown-fade-in"),a.classList.add("countdown-fade-out"),setTimeout(()=>{a.style.display="none",a.classList.remove("countdown-fade-out"),clearInterval(be),be=null,e(),qe&&Oe&&(setTimeout(()=>{if(R.style.display==="block"){R.style.display="none",h.style.display="block";const i=document.getElementById("camera-button");i&&A.length>1&&(i.style.display="flex")}},500),setTimeout(()=>{Oe&&va(e)},W*1e3))},500))},1e3)}function Yi(){be&&(clearInterval(be),be=null,document.getElementById("timer-countdown").style.display="none",V())}function jo(){try{const e=localStorage.getItem(mi);if(e){const t=JSON.parse(e);de=t.delay||10,qe=t.repeat||!1,W=t.repeatInterval||1}}catch(e){console.error("Error loading timer settings:",e)}}function ya(){try{localStorage.setItem(mi,JSON.stringify({delay:de,repeat:qe,repeatInterval:W}))}catch(e){console.error("Error saving timer settings:",e)}}function ut(){const e=document.getElementById("current-timer-display");if(e){const t=qe?`Repeat (${fi[xo()].label})`:"No Repeat";e.textContent=`${de}s, ${t}`}}function xo(){for(const[e,t]of Object.entries(fi))if(t.seconds===W)return parseInt(e);return 1}async function oi(){if(!(!I||ma||R.style.display==="block")){ma=!0,y.textContent=`Burst mode: Taking ${M} photos...`;for(let e=0;e<M;e++)y.textContent=`Burst ${e+1}/${M}...`,Po(e+1),e<M-1&&await new Promise(t=>setTimeout(t,Et));ma=!1,y.textContent=`Burst complete! ${M} photos saved.`,Q&&!Fe?setTimeout(()=>{Tt()},500):Q||(y.textContent=`Burst complete! ${M} photos queued (offline).`),typeof PluginMessageHandler<"u"&&PluginMessageHandler.postMessage(JSON.stringify({action:"burst_complete",count:M,timestamp:Date.now()})),setTimeout(()=>{Re?y.textContent=`Burst mode ON (${M} photos) • ${m[T].name}`:V()},2e3)}}function Po(e){if(!I)return;Je&&(T=Hi()),p.width=h.videoWidth,p.height=h.videoHeight;const t=p.getContext("2d",{willReadFrequently:!1,alpha:!1});t.clearRect(0,0,p.width,p.height);const a=p.width/P,n=p.height/P,i=(p.width-a)/2,s=(p.height-n)/2;if(ze())t.drawImage(h,i,s,a,n,0,0,p.width,p.height);else{t.save(),t.scale(-1,1),t.drawImage(h,i,s,a,n,-p.width,0,p.width,p.height),t.restore();const u=document.createElement("canvas");u.width=p.width,u.height=p.height;const f=u.getContext("2d");f.scale(-1,1),f.drawImage(p,-p.width,0),t.clearRect(0,0,p.width,p.height),t.drawImage(u,0,0)}Pi(t,p.width,p.height);const o=ye>=2?.7:.8,r=p.toDataURL("image/jpeg",o),l=m[T];Ci(r);const c={id:Date.now().toString()+"-"+e,imageBase64:r,preset:l,timestamp:Date.now()};v.push(c),Ot(),st()}async function Uo(){try{if(h=document.getElementById("video"),p=document.getElementById("canvas"),R=document.getElementById("captured-image"),y=document.getElementById("status"),Ut=document.getElementById("reset-button"),document.getElementById("start-screen").querySelector(".start-text").textContent="Loading camera...",document.getElementById("start-button").disabled=!0,await Ro(),A.length>1){const l=A.findIndex(c=>{const u=c.label.toLowerCase();return u.includes("back")||u.includes("rear")||u.includes("environment")});G=l!==-1?l:A.length-1}else G=0;const e=aa();I=await navigator.mediaDevices.getUserMedia(e),h.srcObject=I,j=I.getVideoTracks()[0],setTimeout(()=>{At()},100),console.log("Camera initialized:",wa()),Io(),Ao(),await new Promise(l=>{h.onloadedmetadata=async()=>{try{await h.play(),bt(),ot(1),h.addEventListener("playing",bt),setTimeout(l,100)}catch(c){console.error("Video play error:",c),l()}}}),document.getElementById("start-screen").style.display="none",document.getElementById("camera-container").style.display="flex",y.style.display="block";const t=document.getElementById("camera-button");A.length>1&&(t.style.display="flex");const a=document.getElementById("menu-button");a&&(a.style.display="flex");const n=document.getElementById("burst-toggle");n&&(n.style.display="flex");const i=document.getElementById("random-toggle");i&&(i.style.display="flex");const s=document.getElementById("timer-toggle");s&&(s.style.display="flex");const o=document.getElementById("motion-toggle");o&&(o.style.display="flex");const r=document.getElementById("gallery-button");r&&(r.style.display="flex"),V(),typeof PluginMessageHandler<"u"&&PluginMessageHandler.postMessage(JSON.stringify({status:"camera_ready",availableCameras:A.length,currentCamera:wa(),timestamp:Date.now()}))}catch(e){console.error("Camera access error:",e),y.textContent="Camera access denied",typeof PluginMessageHandler<"u"&&PluginMessageHandler.postMessage(JSON.stringify({status:"camera_error",error:e.message,timestamp:Date.now()}))}}function xe(){I&&h&&(I.getTracks().forEach(e=>{e.stop()}),h.style.display="none",h.srcObject=null)}async function qi(){if(h)try{const e=aa();I=await navigator.mediaDevices.getUserMedia(e),h.srcObject=I,j=I.getVideoTracks()[0],setTimeout(()=>{At()},100),await new Promise(t=>{h.onloadedmetadata=async()=>{try{await h.play(),bt(),await ot(P),setTimeout(t,100)}catch(a){console.error("Video resume error:",a),t()}}}),h.style.display="block"}catch(e){console.error("Failed to resume camera:",e),y.textContent="Camera resume failed"}}function Vt(){if(!I)return;Je&&(T=Hi(),Aa(m[T].name)),p.width=h.videoWidth,p.height=h.videoHeight;const e=p.getContext("2d",{willReadFrequently:!1,alpha:!1});e.clearRect(0,0,p.width,p.height);const t=p.width/P,a=p.height/P,n=(p.width-t)/2,i=(p.height-a)/2;if(ze())e.drawImage(h,n,i,t,a,0,0,p.width,p.height);else{e.save(),e.scale(-1,1),e.drawImage(h,n,i,t,a,-p.width,0,p.width,p.height),e.restore();const f=document.createElement("canvas");f.width=p.width,f.height=p.height;const k=f.getContext("2d");k.scale(-1,1),k.drawImage(p,-p.width,0),e.clearRect(0,0,p.width,p.height),e.drawImage(f,0,0)}Pi(e,p.width,p.height);const s=ye>=2?.7:.8,o=p.toDataURL("image/jpeg",s);R.src=o,R.style.display="block",R.style.transform="none",h.style.display="none",ce||Oe&&qe?Ut.style.display="none":Ut.style.display="block";const r=document.getElementById("camera-button");r&&(r.style.display="none");const l=document.getElementById("resolution-button");l&&(l.style.display="none"),Ci(o);const c=m[T],u={id:Date.now().toString(),imageBase64:o,preset:c,timestamp:Date.now()};if(v.push(u),Ot(),st(),Q){const f=H?"Photo saved!":"Photo saved! Uploading...";y.textContent=f,Fe||Tt()}else y.textContent=`Photo queued for sync (${v.length} in queue)`;typeof PluginMessageHandler<"u"&&PluginMessageHandler.postMessage(JSON.stringify({action:"photo_captured",queued:!0,queueLength:v.length,timestamp:Date.now()}))}async function Tt(){if(v.length===0||Fe)return;if(!Q){y.textContent="Cannot sync - offline";return}Fe=!0,le.disabled=!0,le.classList.add("syncing"),console.log(`Syncing ${v.length} queued photos...`);const e=v.length;let t=0;for(;v.length>0&&Q;){const a=v[0];try{if(y.textContent=`Syncing ${t+1}/${e}...`,typeof PluginMessageHandler<"u"&&!H&&PluginMessageHandler.postMessage(JSON.stringify({message:sa(a.preset.message),pluginId:"com.r1.pixelart",imageBase64:a.imageBase64})),await new Promise(n=>setTimeout(n,2e3)),Q)v.shift(),t++,Ot(),st();else{console.log("Lost connection during sync");break}await new Promise(n=>setTimeout(n,2e3))}catch(n){console.error("Sync error:",n),y.textContent="Sync error - will retry later";break}}if(Fe=!1,le.disabled=!1,le.classList.remove("syncing"),v.length===0){const a=H?`All ${t} photos saved!`:`All ${t} photos synced successfully!`;y.textContent=a,setTimeout(()=>{V()},2e3)}else Q?y.textContent=`Synced ${t}. ${v.length} remaining.`:y.textContent=`Connection lost. ${v.length} photos queued.`;typeof PluginMessageHandler<"u"&&PluginMessageHandler.postMessage(JSON.stringify({action:"sync_complete",synced:t,remaining:v.length,timestamp:Date.now()}))}function Ma(){const e=document.getElementById("queue-manager"),t=document.getElementById("queue-list");t.innerHTML="",v.length===0?t.innerHTML=`
      <div class="queue-empty">
        <h4>No Photos in Queue</h4>
        <p>Take photos while offline and they'll appear here for syncing.</p>
      </div>
    `:v.forEach((a,n)=>{const i=document.createElement("div");i.className="queue-item",i.innerHTML=`
        <div class="queue-item-header">
          <span class="queue-item-style">${a.preset.name}</span>
          <span class="queue-item-time">${new Date(a.timestamp).toLocaleString()}</span>
        </div>
        <img src="${a.imageBase64}" class="queue-item-preview" alt="Queued photo">
        <div class="queue-item-actions">
          <button onclick="removeFromQueue(${n})" class="delete-button">Remove</button>
          <button onclick="previewQueueItem(${n})" class="secondary">Preview</button>
        </div>
      `,t.appendChild(i)}),e.style.display="flex"}function Bo(){document.getElementById("queue-manager").style.display="none"}function Do(e){confirm("Remove this photo from the sync queue?")&&(v.splice(e,1),Ot(),st(),Ma())}function Ho(e){const t=v[e];alert(`Style: ${t.preset.name}
Prompt: ${t.preset.message}
Saved: ${new Date(t.timestamp).toLocaleString()}`)}function Wi(){confirm("Clear all photos from the queue? This cannot be undone.")&&(v=[],Ot(),st(),Ma())}window.addEventListener("sideClick",()=>{if(console.log("Side button pressed"),U){const n=document.getElementById("settings-submenu").querySelectorAll(".menu-section-button");n.length>0&&ee<n.length&&n[ee].click();return}if(ve){mo();return}if(We){const a=document.getElementById("tutorial-glossary");if(a&&a.style.display!=="none"){const n=a.querySelectorAll(".glossary-item");n.length>0&&ae<n.length&&n[ae].click()}return}if(vt){const n=document.getElementById("resolution-submenu").querySelectorAll(".resolution-item");n.length>0&&te<n.length&&n[te].click();return}if(he){Cs();return}if(N&&je){Vs();return}const e=document.getElementById("start-screen"),t=document.getElementById("start-button");if(e&&e.style.display!=="none")console.log("Simulating tap on start button"),setTimeout(()=>{t.click()},100);else if(R&&R.style.display==="block")na();else{if(ce){if(tt>0){let a=tt;const n=document.getElementById("timer-countdown"),i=document.getElementById("timer-countdown-text");i.textContent=a,n.style.display="flex",n.classList.remove("countdown-fade-out"),n.classList.add("countdown-fade-in"),y.textContent=`Motion Detection starting in ${a}s...`,ct=setInterval(()=>{a--,a>0?(n.classList.remove("countdown-fade-in"),n.classList.add("countdown-fade-out"),setTimeout(()=>{i.textContent=a,n.classList.remove("countdown-fade-out"),n.classList.add("countdown-fade-in"),y.textContent=`Motion Detection starting in ${a}s...`},500)):(n.classList.remove("countdown-fade-in"),n.classList.add("countdown-fade-out"),setTimeout(()=>{n.style.display="none",n.classList.remove("countdown-fade-out"),clearInterval(ct),ce&&h&&h.readyState>=2&&(Ta(),showStatus("Motion Detection active - Move in front of camera",3e3))},500))},1e3)}else Ta(),showStatus("Motion Detection ON - Move in front of camera",3e3);return}Oe?va(Re?()=>oi():()=>Vt()):Re?oi():Vt()}});window.addEventListener("scrollUp",()=>{var t,a,n,i;if(console.log("Scroll wheel: up"),he){ls();return}if(We){wo();return}if(nt){Li();return}if(ve){ho();return}if(N&&je){Fs();return}if(_t){ws();return}if(Jt){bs();return}if(Kt){fs();return}if(Wt){gs();return}if(vt){us();return}if(U){ds();return}if(((t=document.getElementById("gallery-modal"))==null?void 0:t.style.display)==="flex"){vs();return}if(((a=document.getElementById("image-viewer"))==null?void 0:a.style.display)==="flex"){Is();return}if(((n=document.getElementById("style-editor"))==null?void 0:n.style.display)==="flex"){Rs();return}if(((i=document.getElementById("queue-manager"))==null?void 0:i.style.display)==="flex"){Ss();return}if(!I||R.style.display==="block")return;const e=Date.now();e-Ht<ki||(Ht=e,Ne&&clearTimeout(Ne),Ne=setTimeout(()=>{let s=Bi();const o=Rt();s=(s-1+o.length)%o.length,T=Di(s);const r=m[T];r&&Aa(r.name),V(),typeof PluginMessageHandler<"u"&&PluginMessageHandler.postMessage(JSON.stringify({action:"preset_changed",preset:m[T].name,timestamp:Date.now()})),Ne=null},50))});window.addEventListener("scrollDown",()=>{var t,a,n,i;if(console.log("Scroll wheel: down"),he){cs();return}if(We){Eo();return}if(nt){Mi();return}if(ve){uo();return}if(N&&je){zs();return}if(_t){Es();return}if(Jt){Ts();return}if(Kt){ys();return}if(Wt){ps();return}if(vt){ms();return}if(U){hs();return}if(((t=document.getElementById("gallery-modal"))==null?void 0:t.style.display)==="flex"){ks();return}if(((a=document.getElementById("image-viewer"))==null?void 0:a.style.display)==="flex"){As();return}if(((n=document.getElementById("style-editor"))==null?void 0:n.style.display)==="flex"){Os();return}if(((i=document.getElementById("queue-manager"))==null?void 0:i.style.display)==="flex"){Ns();return}if(!I||R.style.display==="block")return;const e=Date.now();e-Ht<ki||(Ht=e,Ne&&clearTimeout(Ne),Ne=setTimeout(()=>{let s=Bi();const o=Rt();s=(s+1)%o.length,T=Di(s);const r=m[T];r&&Aa(r.name),V(),typeof PluginMessageHandler<"u"&&PluginMessageHandler.postMessage(JSON.stringify({action:"preset_changed",preset:m[T].name,timestamp:Date.now()})),Ne=null},50))});function V(){T=Math.max(0,Math.min(T,m.length-1));const e=m[T];if(j)try{const t={};j.applyConstraints(t)}catch(t){console.error("Error applying preset constraints:",t)}y&&(y.textContent=`Style: ${e.name}`),localStorage.setItem(gi,T.toString()),N&&it()}window.onPluginMessage=function(e){console.log("Received plugin message:",e),e&&e.status==="processing"?y.textContent="AI is processing your image...":e&&e.status==="complete"?y.textContent="AI transformation complete!":e&&e.error&&(y.textContent="Error: "+e.error)};typeof PluginMessageHandler<"u"?(console.log("Flutter channel is available"),PluginMessageHandler.postMessage(JSON.stringify({message:"AI Camera Styles initialized",pluginId:"com.r1.pixelart"}))):console.log("Running in development mode - Flutter channel not available");function na(){R.style.display="none",ce&&Ve||(La(),ce&&Ta()),R.style.transform="none",h.style.display="block",Ut.style.display="none";const e=document.getElementById("camera-button");e&&A.length>1&&(e.style.display="flex");const t=document.getElementById("resolution-button");t&&(t.style.display="flex"),setTimeout(()=>{ot(P)},50),V()}function ri(e,t){const a=e.clientX-t.clientX,n=e.clientY-t.clientY;return Math.sqrt(a*a+n*n)}function Go(){const e=document.getElementById("video");e.addEventListener("touchstart",a=>{a.touches.length===2&&(a.preventDefault(),rt=!0,Xn=ri(a.touches[0],a.touches[1]),$n=P)},{passive:!1});let t=null;e.addEventListener("touchmove",a=>{if(rt&&a.touches.length===2){a.preventDefault();const i=ri(a.touches[0],a.touches[1])/Xn,s=$n*i,o=Vi(),r=Math.max(o.min,Math.min(s,o.max));t||(ot(r),t=setTimeout(()=>{t=null},50))}},{passive:!1}),e.addEventListener("touchend",a=>{a.touches.length<2&&(rt&&Ea(),rt=!1,console.log("Pinch ended, current zoom:",P))}),e.addEventListener("touchcancel",()=>{rt=!1})}function Fo(){const e=document.getElementById("video");let t=null,a=!1;e.addEventListener("touchstart",n=>{!N&&R.style.display==="none"&&(a=!1,t=setTimeout(()=>{a=!0;const i=n.touches[0],s=e.getBoundingClientRect(),o=i.clientX-s.left,r=i.clientY-s.top,l=document.createElement("div");l.style.position="absolute",l.style.left=o+"px",l.style.top=r+"px",l.style.width="80px",l.style.height="80px",l.style.border="3px solid #4CAF50",l.style.borderRadius="50%",l.style.transform="translate(-50%, -50%)",l.style.pointerEvents="none",l.style.animation="capturePulse 0.4s ease-out",l.style.zIndex="150",l.style.backgroundColor="rgba(76, 175, 80, 0.2)",document.getElementById("camera-container").appendChild(l),setTimeout(()=>{l.remove()},400),Vt(),navigator.vibrate&&navigator.vibrate(50)},500))}),e.addEventListener("touchend",n=>{if(t&&(clearTimeout(t),t=null),!a&&!N&&R.style.display==="none"){Ea();const i=n.changedTouches[0],s=e.getBoundingClientRect(),o=i.clientX-s.left,r=i.clientY-s.top,l=document.createElement("div");l.style.position="absolute",l.style.left=o+"px",l.style.top=r+"px",l.style.width="60px",l.style.height="60px",l.style.border="2px solid #FE5F00",l.style.borderRadius="50%",l.style.transform="translate(-50%, -50%)",l.style.pointerEvents="none",l.style.animation="focusPulse 0.6s ease-out",l.style.zIndex="150",document.getElementById("camera-container").appendChild(l),setTimeout(()=>{l.remove()},600)}}),e.addEventListener("touchcancel",n=>{t&&(clearTimeout(t),t=null)}),e.addEventListener("click",n=>{if(!N&&R.style.display==="none"){Ea();const i=e.getBoundingClientRect(),s=n.clientX-i.left,o=n.clientY-i.top,r=document.createElement("div");r.style.position="absolute",r.style.left=s+"px",r.style.top=o+"px",r.style.width="60px",r.style.height="60px",r.style.border="2px solid #FE5F00",r.style.borderRadius="50%",r.style.transform="translate(-50%, -50%)",r.style.pointerEvents="none",r.style.animation="focusPulse 0.6s ease-out",r.style.zIndex="150",document.getElementById("camera-container").appendChild(r),setTimeout(()=>{r.remove()},600)}})}function ia(){const e=document.getElementById("unified-menu");R&&R.style.display==="block"&&na(),we();const t=document.getElementById("styles-count");if(t){const{favorites:a,regular:n}=ft(),i=a.length+n.length;t.textContent=i}Ki(),Yt(),qt(),ut(),N=!0,je=!0,xe(),Yi(),e.style.display="flex"}async function ja(){N=!1,je=!1,B=0,Ae="",pe="",document.getElementById("style-filter").value="";const e=document.getElementById("menu-category-hint");e&&(e.style.display="none"),document.getElementById("unified-menu").style.display="none",await qi()}function ue(){const e=document.getElementById("settings-submenu"),t=document.getElementById("unified-menu");Ki(),Yt(),ut(),qt(),t.style.display="none",xe(),e.style.display="flex",N=!1,U=!0,ee=0,setTimeout(()=>{Oa()},50)}function zo(){document.getElementById("settings-submenu").style.display="none",U=!1,ee=0,ia()}function Vo(){const e=document.getElementById("timer-settings-submenu"),t=document.getElementById("settings-submenu"),a=document.getElementById("timer-delay-slider"),n=document.getElementById("timer-delay-value"),i=document.getElementById("timer-repeat-enabled");if(a&&n){const r=pi.indexOf(de);a.value=r!==-1?r+1:3,n.textContent=de}i&&(i.checked=qe);const s=document.getElementById("timer-repeat-interval-input"),o=document.getElementById("timer-repeat-interval-unit");s&&o&&(W>=3600&&W%3600===0?(s.value=W/3600,o.value="3600"):W>=60&&W%60===0?(s.value=W/60,o.value="60"):(s.value=W,o.value="1")),t.style.display="none",xe(),e.style.display="flex",Kt=!0,U=!1}function Yo(){document.getElementById("timer-settings-submenu").style.display="none",Kt=!1,ue()}function qo(){const e=document.querySelector(".styles-menu-scroll-container");e&&(e.scrollTo({top:0,behavior:"smooth"}),B=0,it())}function Wo(){const e=document.querySelector(".styles-menu-scroll-container");if(e){e.scrollTo({top:e.scrollHeight,behavior:"smooth"});const t=document.getElementById("menu-styles-list");if(t){const a=t.querySelectorAll(".style-item");a.length>0&&(B=a.length-1,it())}}}function Ki(){const e=document.getElementById("current-resolution-display");if(e){const t=wt[ye];e.textContent=`${t.width}x${t.height}`}}function Yt(){const e=document.getElementById("current-burst-display");if(e){let t="Medium";for(const[a,n]of Object.entries(Qe))if(n.delay===Et){t=n.label;break}e.textContent=`${M} photos, ${t}`}}function Ko(){document.getElementById("settings-submenu").style.display="none",xe();const e=document.getElementById("resolution-submenu"),t=document.getElementById("resolution-list");t.innerHTML="",wt.forEach((a,n)=>{const i=document.createElement("div");i.className="resolution-item",n===ye&&i.classList.add("active");const s=document.createElement("span");s.className="resolution-name",s.textContent=a.name,i.appendChild(s),i.onclick=()=>{Oo(n),Ji()},t.appendChild(i)}),e.style.display="flex",vt=!0,U=!1,te=0,setTimeout(()=>{const a=e.querySelectorAll(".resolution-item");Sa(a)},100)}async function Ji(){document.getElementById("resolution-submenu").style.display="none",vt=!1,te=0,ue()}function Jo(){document.getElementById("settings-submenu").style.display="none",xe();const e=document.getElementById("burst-submenu"),t=document.getElementById("burst-count-slider"),a=document.getElementById("burst-speed-slider"),n=document.getElementById("burst-count-value"),i=document.getElementById("burst-speed-value");if(t&&n&&(t.value=M,n.textContent=M),a&&i){let s=2;for(const[o,r]of Object.entries(Qe))if(r.delay===Et){s=parseInt(o);break}a.value=s,i.textContent=Qe[s].label}e.style.display="flex",Wt=!0,U=!1}async function _o(){document.getElementById("burst-submenu").style.display="none",Wt=!1,ue()}function Xo(){document.getElementById("settings-submenu").style.display="none",xe();const e=document.getElementById("master-prompt-submenu"),t=document.getElementById("master-prompt-enabled"),a=document.getElementById("master-prompt-text"),n=document.getElementById("master-prompt-char-count");t&&(t.checked=Ee),a&&(a.value=Z,a.disabled=!Ee,n&&(n.textContent=Z.length)),e.style.display="flex",Jt=!0,U=!1}async function $o(){document.getElementById("master-prompt-submenu").style.display="none",Jt=!1,ue()}function Qo(){document.getElementById("settings-submenu").style.display="none",xe();const e=document.getElementById("aspect-ratio-submenu");e.style.display="flex",U=!1}async function Zo(){document.getElementById("aspect-ratio-submenu").style.display="none",ue()}function li(){const e=document.getElementById("current-aspect-ratio-display");e&&(e.textContent=F==="none"?"None":F)}function qt(){const e=document.getElementById("current-master-prompt-display");if(e)if(Ee&&Z.trim()){const t=Z.substring(0,20);e.textContent=`Enabled: ${t}${Z.length>20?"...":""}`}else Ee?e.textContent="Enabled (empty)":e.textContent="Disabled"}function jt(){try{localStorage.setItem(yi,Z),localStorage.setItem(bi,Ee.toString()),localStorage.setItem(Ti,F)}catch(e){console.error("Failed to save master prompt:",e)}}function er(){try{const e=localStorage.getItem(yi),t=localStorage.getItem(bi);e!==null&&(Z=e),t!==null&&(Ee=t==="true");const a=localStorage.getItem(Ti);if(a){F=a;const n=document.getElementById("aspect-ratio-1-1"),i=document.getElementById("aspect-ratio-16-9");n&&(n.checked=F==="1:1"),i&&(i.checked=F==="16:9");const s=document.getElementById("current-aspect-ratio-display");s&&(s.textContent=F==="none"?"None":F)}}catch(e){console.error("Failed to load master prompt:",e)}}function sa(e){let t=e;return Ee&&Z.trim()&&(t=`${e} ${Z}`),F==="1:1"?t+=" Use a square aspect ratio.":F==="16:9"&&(t+=" Use a square aspect ratio, but pad the image with black bars at top and bottom to simulate a 16:9 aspect ratio."),t}function we(e=!1){const t=document.getElementById("menu-styles-list");t.innerHTML="",t.replaceWith(t.cloneNode(!1));const a=document.getElementById("menu-styles-list"),n=document.createDocumentFragment(),{favorites:i,regular:s}=ft(),o=i.filter(c=>{if(Ae){const u=Ae.toLowerCase(),f=c.category&&c.category.some(E=>E.toLowerCase().includes(u));if(!(c.name.toLowerCase().includes(u)||c.message.toLowerCase().includes(u)||f))return!1}return pe?c.category&&c.category.includes(pe):!0}),r=s.filter(c=>{if(Ae){const u=Ae.toLowerCase(),f=c.category&&c.category.some(E=>E.toLowerCase().includes(u));if(!(c.name.toLowerCase().includes(u)||c.message.toLowerCase().includes(u)||f))return!1}return pe?c.category&&c.category.includes(pe):!0});if(o.length>0){const c=document.createElement("h3");c.className="menu-section-header",c.textContent="★ Favorites",n.appendChild(c),o.forEach(u=>{const f=ci(u);n.appendChild(f)})}if(r.length>0){const c=document.createElement("h3");c.className="menu-section-header",c.textContent=Ae?"Search Results":"All Styles",n.appendChild(c),r.forEach(u=>{const f=ci(u);n.appendChild(f)})}if(r.length===0&&o.length===0&&Ae){const c=document.createElement("div");c.className="menu-empty",c.textContent="No styles found",n.appendChild(c)}a.appendChild(n),a.addEventListener("click",tr);const l=document.getElementById("styles-count");if(l){const{favorites:c,regular:u}=ft(),f=c.length+u.length;l.textContent=f}e||(B=0,it())}function ci(e){const t=m.findIndex(r=>r===e),a=document.createElement("div");a.className="style-item",a.dataset.index=t,t===T&&a.classList.add("active");const n=document.createElement("button");n.className="style-favorite",n.textContent=at(e.name)?"⭐":"☆",n.dataset.action="favorite",n.dataset.styleName=e.name;const i=document.createElement("span");i.className="style-name",i.textContent=e.name;const s=document.createElement("button");s.className="style-edit";const o=e.internal===!1;return s.textContent=o?"Builder":"Edit",s.dataset.action=o?"builder":"edit",s.dataset.index=t,a.appendChild(n),a.appendChild(i),a.appendChild(s),a}function tr(e){const t=e.target;if(t.dataset.action==="favorite"){e.stopPropagation();const n=t.dataset.styleName;$s(n);return}if(t.dataset.action==="edit"){e.stopPropagation();const n=parseInt(t.dataset.index);nr(n);return}if(t.dataset.action==="builder"){e.stopPropagation();const n=parseInt(t.dataset.index);so(n);return}const a=t.closest(".style-item");if(a){const n=parseInt(a.dataset.index);isNaN(n)||(T=n,V(),ja())}}function ar(e="Add New Style"){const t=document.getElementById("style-editor");document.getElementById("editor-title").textContent=e,t.style.display="flex"}function xa(){document.getElementById("style-editor").style.display="none",document.getElementById("style-name").value="",document.getElementById("style-message").value="";const e=document.getElementById("style-category");e&&(e.value=""),document.getElementById("delete-style").style.display="none",Se=-1}function nr(e){Se=e;const t=m[e];document.getElementById("style-name").value=t.name,document.getElementById("style-message").value=t.message;const a=document.getElementById("style-category");a&&(a.value=t.category?t.category.join(", "):""),document.getElementById("delete-style").style.display="block",ar("Edit Style")}function ir(){const e=document.getElementById("style-name").value.trim(),t=document.getElementById("style-message").value.trim(),a=document.getElementById("style-category").value.trim(),n=a?a.split(",").map(i=>i.trim().toUpperCase()).filter(i=>i.length>0):[];if(!e||!t){alert("Please fill in both name and AI prompt");return}if(Se>=0){const i=m[Se].name;if(m[Se]={name:e,category:n,message:t},i!==e){const s=w.indexOf(i);s>-1&&(w[s]=e,Me())}}else m.push({name:e,category:n,message:t}),w.push(e),Me();ea(),alert(Se>=0?`Preset "${e}" updated!`:`Preset "${e}" saved!`),xa(),ia()}function sr(){Se>=0&&m.length>1&&confirm("Delete this style?")&&(m.splice(Se,1),T>=m.length&&(T=m.length-1),ea(),xa(),ia())}function or(){try{const e=new(window.AudioContext||window.webkitAudioContext),t=e.currentTime,a=e.createOscillator(),n=e.createGain(),i=e.createBiquadFilter();a.type="square",a.frequency.setValueAtTime(2400,t),a.frequency.exponentialRampToValueAtTime(1800,t+.012),i.type="highpass",i.frequency.setValueAtTime(1500,t),n.gain.setValueAtTime(.5,t),n.gain.exponentialRampToValueAtTime(.001,t+.015),a.connect(i),i.connect(n),n.connect(e.destination),a.start(t),a.stop(t+.015);const s=e.createOscillator(),o=e.createGain(),r=e.createBiquadFilter();s.type="square",s.frequency.setValueAtTime(1200,t+.015),s.frequency.exponentialRampToValueAtTime(200,t+.023),r.type="bandpass",r.frequency.setValueAtTime(1500,t+.015),r.Q.setValueAtTime(2,t+.015),o.gain.setValueAtTime(.4,t+.015),o.gain.exponentialRampToValueAtTime(.001,t+.03),s.connect(r),r.connect(o),o.connect(e.destination),s.start(t+.015),s.stop(t+.03);const l=e.createOscillator(),c=e.createGain();l.type="triangle",l.frequency.setValueAtTime(400,t+.023),l.frequency.setValueAtTime(450,t+.027),l.frequency.setValueAtTime(380,t+.031),l.frequency.setValueAtTime(420,t+.035),c.gain.setValueAtTime(0,t+.023),c.gain.linearRampToValueAtTime(.15,t+.025),c.gain.exponentialRampToValueAtTime(.001,t+.04),l.connect(c),c.connect(e.destination),l.start(t+.023),l.stop(t+.04);const u=e.createOscillator(),f=e.createGain(),k=e.createBiquadFilter();u.type="square",u.frequency.setValueAtTime(800,t+.05),u.frequency.exponentialRampToValueAtTime(150,t+.06),k.type="bandpass",k.frequency.setValueAtTime(1e3,t+.05),k.Q.setValueAtTime(2,t+.05),f.gain.setValueAtTime(.5,t+.05),f.gain.exponentialRampToValueAtTime(.001,t+.07),u.connect(k),k.connect(f),f.connect(e.destination),u.start(t+.05),u.stop(t+.07);const E=e.createOscillator(),O=e.createGain(),D=e.createBiquadFilter();E.type="sine",E.frequency.setValueAtTime(180,t+.05),E.frequency.exponentialRampToValueAtTime(120,t+.095),D.type="lowpass",D.frequency.setValueAtTime(300,t+.05),O.gain.setValueAtTime(0,t+.05),O.gain.linearRampToValueAtTime(.2,t+.055),O.gain.exponentialRampToValueAtTime(.001,t+.105),E.connect(D),D.connect(O),O.connect(e.destination),E.start(t+.05),E.stop(t+.105);const ie=e.sampleRate*.08,Y=e.createBuffer(1,ie,e.sampleRate),ke=Y.getChannelData(0);for(let Be=0;Be<ie;Be++){const St=Math.sin(Be/200)*.5+.5;ke[Be]=(Math.random()*2-1)*St}const Pe=e.createBufferSource();Pe.buffer=Y;const Ie=e.createBiquadFilter();Ie.type="bandpass",Ie.frequency.setValueAtTime(3e3,t+.07),Ie.Q.setValueAtTime(1,t+.07);const _=e.createGain();_.gain.setValueAtTime(0,t+.07),_.gain.linearRampToValueAtTime(.12,t+.075),_.gain.linearRampToValueAtTime(.12,t+.125),_.gain.exponentialRampToValueAtTime(.001,t+.15),Pe.connect(Ie),Ie.connect(_),_.connect(e.destination),Pe.start(t+.07),Pe.stop(t+.15);const X=e.createOscillator(),Ue=e.createGain();X.type="square",X.frequency.setValueAtTime(600,t+.145),X.frequency.exponentialRampToValueAtTime(100,t+.155),Ue.gain.setValueAtTime(.25,t+.145),Ue.gain.exponentialRampToValueAtTime(.001,t+.165),X.connect(Ue),Ue.connect(e.destination),X.start(t+.145),X.stop(t+.165)}catch(e){console.log("Audio generation failed:",e)}}window.addEventListener("load",()=>{Ys(),er(),Go(),Fo();const e=document.getElementById("start-button");e&&e.addEventListener("click",()=>{or();const d=document.querySelector(".camera-body");d&&(d.style.transition="all 0.1s",d.style.boxShadow="0 0 50px rgba(255, 255, 255, 1)",setTimeout(()=>{d.style.boxShadow=""},100));const g=document.querySelector(".lens-inner");g&&(g.style.transition="all 0.05s",g.style.transform="translate(-50%, -50%) scale(0.95)",setTimeout(()=>{g.style.transform="translate(-50%, -50%) scale(1)"},50)),setTimeout(()=>{Uo()},300)});const t=document.getElementById("burst-toggle");t&&t.addEventListener("click",Lo);const a=document.getElementById("timer-toggle");a&&a.addEventListener("click",Mo);const n=document.getElementById("random-toggle");n&&n.addEventListener("click",ko);const i=document.getElementById("motion-toggle");i&&i.addEventListener("click",Zs);const s=document.getElementById("menu-button");s&&s.addEventListener("click",ia);const o=document.getElementById("close-menu");o&&o.addEventListener("click",ja);const r=document.getElementById("jump-to-top");r&&r.addEventListener("click",qo);const l=document.getElementById("jump-to-bottom");l&&l.addEventListener("click",Wo);const c=document.getElementById("settings-menu-button");c&&c.addEventListener("click",ue);const u=document.getElementById("settings-back");u&&u.addEventListener("click",zo);const f=document.getElementById("resolution-settings-button");f&&f.addEventListener("click",Ko);const k=document.getElementById("resolution-back");k&&k.addEventListener("click",Ji);const E=document.getElementById("burst-settings-button");E&&E.addEventListener("click",Jo);const O=document.getElementById("burst-back");O&&O.addEventListener("click",_o);const D=document.getElementById("timer-settings-button");D&&D.addEventListener("click",Vo);const ie=document.getElementById("timer-settings-back");ie&&ie.addEventListener("click",Yo);const Y=document.getElementById("master-prompt-settings-button");Y&&Y.addEventListener("click",Xo);const ke=document.getElementById("master-prompt-back");ke&&ke.addEventListener("click",$o);const Pe=document.getElementById("aspect-ratio-settings-button");Pe&&Pe.addEventListener("click",Qo);const Ie=document.getElementById("aspect-ratio-back");Ie&&Ie.addEventListener("click",Zo);const _=document.getElementById("aspect-ratio-1-1"),X=document.getElementById("aspect-ratio-16-9");_&&_.addEventListener("change",d=>{d.target.checked?(F="1:1",X&&(X.checked=!1)):F="none",jt(),li()}),X&&X.addEventListener("change",d=>{d.target.checked?(F="16:9",_&&(_.checked=!1)):F="none",jt(),li()});const Ue=document.getElementById("motion-settings-button");Ue&&Ue.addEventListener("click",to);const Be=document.getElementById("motion-back");Be&&Be.addEventListener("click",ao);const St=document.getElementById("visible-presets-settings-button");St&&St.addEventListener("click",no);const Pa=document.getElementById("visible-presets-back");Pa&&Pa.addEventListener("click",io);const Ua=document.getElementById("preset-builder-button");Ua&&Ua.addEventListener("click",Gi);const Ba=document.getElementById("preset-builder-back");Ba&&Ba.addEventListener("click",Na);const Da=document.getElementById("preset-builder-jump-up");Da&&Da.addEventListener("click",Li);const Ha=document.getElementById("preset-builder-jump-down");Ha&&Ha.addEventListener("click",Mi);const Ga=document.getElementById("preset-builder-template");Ga&&Ga.addEventListener("change",oo);const Fa=document.getElementById("preset-builder-name");Fa&&Fa.addEventListener("keypress",d=>{var g;d.key==="Enter"&&(d.preventDefault(),(g=document.getElementById("preset-builder-category"))==null||g.focus())});const se=document.getElementById("preset-builder-category"),me=document.getElementById("category-autocomplete");if(se&&me){const d=()=>{const b=se.value,C=b.lastIndexOf(","),q=(C>=0?b.substring(C+1):b).trim().toUpperCase(),Jn=ro(),_n=q?Jn.filter(Nt=>Nt.includes(q)):Jn;_n.length>0?(me.innerHTML=_n.map(Nt=>`<div class="category-autocomplete-item" data-category="${Nt}">${Nt}</div>`).join(""),me.style.display="block"):me.style.display="none"},g=b=>{const C=se.value,q=C.lastIndexOf(",");q>=0?se.value=C.substring(0,q+1)+" "+b+", ":se.value=b+", ",me.style.display="none",se.focus()};se.addEventListener("input",d),se.addEventListener("focus",d),me.addEventListener("click",b=>{if(b.target.classList.contains("category-autocomplete-item")){const C=b.target.getAttribute("data-category");g(C)}}),document.addEventListener("click",b=>{!se.contains(b.target)&&!me.contains(b.target)&&(me.style.display="none")}),se.addEventListener("keypress",b=>{var C;b.key==="Enter"&&(b.preventDefault(),me.style.display="none",(C=document.getElementById("preset-builder-template"))==null||C.focus())})}const za=document.getElementById("preset-builder-save");za&&za.addEventListener("click",lo);const Va=document.getElementById("preset-builder-clear");Va&&Va.addEventListener("click",ta);const Ya=document.getElementById("preset-builder-delete");Ya&&Ya.addEventListener("click",co),document.querySelectorAll(".chip-section-header").forEach(d=>{d.addEventListener("click",()=>{const g=d.getAttribute("data-section"),b=document.getElementById("section-"+g),C=b.style.display==="block";document.querySelectorAll(".chip-section-content").forEach(q=>{q.style.display="none"}),document.querySelectorAll(".chip-section-header").forEach(q=>{q.classList.remove("expanded")}),C||(b.style.display="block",d.classList.add("expanded"))})}),document.querySelectorAll(".preset-chip").forEach(d=>{d.addEventListener("click",g=>{const b=g.target.getAttribute("data-text"),C=document.getElementById("preset-builder-prompt"),q=C.value;q.trim()?C.value=q+" "+b:C.value=b,C.scrollTop=C.scrollHeight})});const qa=document.getElementById("preset-builder-quality");qa&&qa.addEventListener("change",d=>{const g=d.target.value;if(g){const b=document.getElementById("preset-builder-prompt"),C=b.value;C.trim()?b.value=C+" "+g:b.value=g,d.target.value="",b.scrollTop=b.scrollHeight}});const Wa=document.getElementById("visible-presets-filter");Wa&&Wa.addEventListener("input",d=>{pt=d.target.value,Xe()});const Ka=document.getElementById("visible-presets-select-all");Ka&&Ka.addEventListener("click",()=>{w=m.filter(g=>!g.internal).map(g=>g.name),Me(),Xe(),zt(),N&&we()});const Ja=document.getElementById("visible-presets-deselect-all");Ja&&Ja.addEventListener("click",()=>{w=[],Me(),Xe(),zt(),N&&we()});const _a=document.getElementById("visible-presets-jump-up");_a&&_a.addEventListener("click",()=>{z=0,yt()});const Xa=document.getElementById("visible-presets-jump-down");Xa&&Xa.addEventListener("click",()=>{const d=document.getElementById("visible-presets-list");if(d){const g=d.querySelectorAll(".style-item");g.length>0&&(z=g.length-1,yt())}});const $a=document.getElementById("white-balance-settings-button");$a&&$a.addEventListener("click",_s);const Qa=document.getElementById("white-balance-back");Qa&&Qa.addEventListener("click",Ui);const Za=document.getElementById("motion-sensitivity-slider"),en=document.getElementById("motion-sensitivity-value");if(Za&&en){const d=["Very Low","Low","Medium","High","Very High"];Za.addEventListener("input",g=>{const b=parseInt(g.target.value);en.textContent=d[b-1],Ze=50-b*10,Mt(),Fi()})}const tn=document.getElementById("motion-continuous-enabled");tn&&tn.addEventListener("change",d=>{Ve=d.target.checked,Mt()});const an=document.getElementById("motion-cooldown-slider"),nn=document.getElementById("motion-cooldown-value");an&&nn&&an.addEventListener("input",d=>{et=parseInt(d.target.value),nn.textContent=`${et}s`,Mt()});const sn=document.getElementById("motion-start-delay-slider"),on=document.getElementById("motion-start-delay-value");sn&&on&&sn.addEventListener("input",d=>{const g=parseInt(d.target.value);tt=mt[g].seconds,on.textContent=mt[g].label,Mt()});const rn=document.getElementById("no-magic-toggle-button");rn&&rn.addEventListener("click",po);const ln=document.getElementById("tutorial-button");ln&&ln.addEventListener("click",yo);const cn=document.getElementById("tutorial-back");cn&&cn.addEventListener("click",bo),document.querySelectorAll(".glossary-item").forEach(d=>{d.addEventListener("click",()=>{const g=d.getAttribute("data-section");To(g)})});const dn=document.getElementById("back-to-glossary");dn&&dn.addEventListener("click",zi);const hn=document.getElementById("master-prompt-enabled");hn&&hn.addEventListener("change",d=>{Ee=d.target.checked;const g=document.getElementById("master-prompt-text");g&&(g.disabled=!Ee),jt(),qt()});const un=document.getElementById("master-prompt-text");un&&un.addEventListener("input",d=>{Z=d.target.value;const g=document.getElementById("master-prompt-char-count");g&&(g.textContent=Z.length),jt(),qt()});const mn=document.getElementById("style-filter");let oa=null;mn&&mn.addEventListener("input",d=>{Ae=d.target.value,oa&&clearTimeout(oa),oa=setTimeout(()=>{we()},150)});const gn=document.getElementById("burst-count-slider"),ra=document.getElementById("burst-speed-slider");gn&&gn.addEventListener("input",d=>{M=parseInt(d.target.value),document.getElementById("burst-count-value").textContent=M;const g=parseInt(ra.value);si(M,g),Yt(),Re&&(y.textContent=`Burst mode ON (${M} photos) • ${m[T].name}`)}),ra&&ra.addEventListener("input",d=>{const g=parseInt(d.target.value);Et=Qe[g].delay,document.getElementById("burst-speed-value").textContent=Qe[g].label,si(M,g),Yt()});const pn=document.getElementById("timer-delay-slider"),fn=document.getElementById("timer-delay-value");pn&&fn&&pn.addEventListener("input",d=>{const g=parseInt(d.target.value)-1;de=pi[g],fn.textContent=de,ya(),ut()});const yn=document.getElementById("timer-repeat-enabled");yn&&yn.addEventListener("change",d=>{qe=d.target.checked,ya(),ut()});const la=document.getElementById("timer-repeat-interval-input"),ca=document.getElementById("timer-repeat-interval-unit");if(la&&ca){const d=()=>{const g=parseInt(la.value)||1,b=parseInt(ca.value);W=g*b,ya(),ut()};la.addEventListener("input",d),ca.addEventListener("change",d)}Co(),jo(),go(),fo();const bn=document.getElementById("reset-button");bn&&bn.addEventListener("click",na);const Tn=document.getElementById("camera-button");Tn&&Tn.addEventListener("click",No);const wn=document.getElementById("close-editor");wn&&wn.addEventListener("click",xa);const En=document.getElementById("save-style");En&&En.addEventListener("click",ir);const vn=document.getElementById("delete-style");vn&&vn.addEventListener("click",sr),De=document.getElementById("connection-status"),_e=document.getElementById("queue-status"),le=document.getElementById("sync-button"),le&&le.addEventListener("click",Tt),_e&&_e.addEventListener("click",Ma);const kn=document.getElementById("close-queue-manager");kn&&kn.addEventListener("click",Bo);const In=document.getElementById("sync-all");In&&In.addEventListener("click",Tt);const An=document.getElementById("clear-queue");An&&An.addEventListener("click",Wi);const Rn=document.getElementById("gallery-button");Rn&&Rn.addEventListener("click",ne);const On=document.getElementById("close-gallery");On&&On.addEventListener("click",ts);const Sn=document.getElementById("close-viewer");Sn&&Sn.addEventListener("click",ss);const Nn=document.getElementById("delete-viewer-image");Nn&&Nn.addEventListener("click",os);const Cn=document.getElementById("gallery-start-date-btn"),da=document.getElementById("gallery-start-date");Cn&&da&&(Cn.addEventListener("click",()=>{da.showPicker()}),da.addEventListener("change",d=>{dt=d.target.value||null,ti("start",dt),pa()}));const Ln=document.getElementById("gallery-end-date-btn"),ha=document.getElementById("gallery-end-date");Ln&&ha&&(Ln.addEventListener("click",()=>{ha.showPicker()}),ha.addEventListener("change",d=>{ht=d.target.value||null,ti("end",ht),pa()}));const Mn=document.getElementById("gallery-sort-order");Mn&&Mn.addEventListener("change",d=>{gt=d.target.value;try{localStorage.setItem(vi,gt)}catch(g){console.error("Failed to save sort order:",g)}pa()});const jn=document.getElementById("prev-page");jn&&jn.addEventListener("click",ns);const xn=document.getElementById("next-page");xn&&xn.addEventListener("click",as);const Pn=document.getElementById("load-preset-button");Pn&&Pn.addEventListener("click",rs);const Un=document.getElementById("multi-preset-button");Un&&Un.addEventListener("click",()=>{if(J>=0){const d=L[J].id;Ds(d)}});const Bn=document.getElementById("close-preset-selector");Bn&&Bn.addEventListener("click",Gt);const Dn=document.getElementById("preset-filter");Dn&&Dn.addEventListener("input",d=>{Dt=d.target.value,It()});const Hn=document.getElementById("preset-selector-jump-up");Hn&&Hn.addEventListener("click",()=>{x=0,Ye()});const Gn=document.getElementById("preset-selector-jump-down");Gn&&Gn.addEventListener("click",()=>{const d=document.getElementById("preset-list");if(d){const g=d.querySelectorAll(".preset-item");g.length>0&&(x=g.length-1,Ye())}});const Fn=document.getElementById("magic-button");Fn&&Fn.addEventListener("click",Ms);const zn=document.getElementById("batch-mode-toggle");zn&&zn.addEventListener("click",Ft);const Vn=document.getElementById("batch-select-all");Vn&&Vn.addEventListener("click",js);const Yn=document.getElementById("batch-deselect-all");Yn&&Yn.addEventListener("click",xs);const qn=document.getElementById("batch-cancel");qn&&qn.addEventListener("click",Ft);const Wn=document.getElementById("batch-apply-preset");Wn&&Wn.addEventListener("click",Ps);const Kn=document.getElementById("batch-delete");Kn&&Kn.addEventListener("click",Bs),$t().then(async()=>{localStorage.getItem("r1_gallery_index")?(console.log("Migrating old gallery data..."),await Qi()):await Qt()}).catch(d=>{console.error("Failed to initialize database:",d)}),Gs()});window.removeFromQueue=Do;window.previewQueueItem=Ho;window.clearQueue=Wi;console.log("AI Camera Styles app initialized!");
