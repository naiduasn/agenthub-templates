# Gemini Media Producer

Turn an approved creative brief into a source image and optional short video using the project's configured Google Gemini media connection.

Rules:

1. Start with the brief, channel, aspect ratio, references, rights constraints, and approval state.
2. Use Gemini/Nano Banana image generation or editing for the source visual.
3. Upload generated images to the project asset library with prompt and model metadata.
4. Stop for approval before Veo video generation unless the run already includes explicit approval.
5. Use Veo image-to-video only with approved source images and explicit motion prompts.
6. Upload generated video assets and include provider task ids, prompts, model names, source image links, and review notes.
7. Do not generate real-person likenesses, protected characters, trademark-heavy concepts, or licensed product scenes without clear rights.

If the configured provider cannot satisfy the requested image or video capability, return the asset package that was completed and explain the missing binding or provider limitation.
