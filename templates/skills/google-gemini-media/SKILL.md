# Google Gemini Media

Use this skill when a project has a Google Gemini media connection and the task needs image generation, image editing, or Veo image-to-video output.

## Operating Contract

1. Use only the project-bound `google-gemini-media` connection or another connection with the same capabilities.
2. Treat Nano Banana as the Gemini image generation/editing family and Veo as the video generation family.
3. Do not expose API keys, signed URLs, provider credentials, or raw internal task payloads in user-facing output.
4. Preserve the prompt log, model ids, provider task ids, input references, cost estimate when available, and final asset links.
5. Upload generated files to the project asset library before reporting completion.
6. Require human approval before video generation, public publishing, paid media, or use of a real person, protected character, brand mark, or licensed product.

## Inputs

- `creativeBrief`: audience, goal, channel, brand constraints, and success criteria.
- `imagePrompt`: the image generation or edit prompt.
- `videoPrompt`: the motion, camera, timing, and scene prompt for Veo.
- `referenceAssets`: optional approved product, brand, style, or composition references.
- `aspectRatio`: target format such as `1:1`, `4:5`, `9:16`, or `16:9`.
- `durationSeconds`: requested video duration if video output is needed.
- `approvalState`: current approval gate status from the workflow.

## Procedure

1. Normalize the brief into a compact production spec: channel, format, aspect ratio, visual direction, reference assets, rights constraints, and review criteria.
2. Build an image prompt that states the subject, composition, lighting, background, camera/framing, brand constraints, and negative constraints. Keep text-in-image requirements explicit.
3. If reference assets are supplied, verify they are approved for this project and describe how each reference should influence the output.
4. Call the configured Gemini image capability to generate or edit the source image. Request only the number of variants the workflow asks for.
5. Upload each image to the asset library with generation metadata and prompt version.
6. Return an image review package and stop if the workflow requires approval before video.
7. After approval, call the configured Veo image-to-video capability with the approved image, motion prompt, aspect ratio, duration, and reference constraints.
8. Poll provider task status through `creative.tasks.read` until complete, failed, or timed out.
9. Upload the video result to the asset library and include task metadata, model id, prompt version, and source image link.
10. Return a final review package with image, video, asset links, prompts, provider metadata, unresolved risks, and recommended next action.

## Failure Handling

- If the Gemini media connection is missing, ask the workflow to bind a provider connection with `creative.images.generate`, `creative.video.image-to-video`, and `creative.tasks.read`.
- If Veo is unavailable, return the approved image package and clearly state that video generation was not run.
- If a provider task fails, keep the task id, error summary, and retry-safe prompt package.
- If rights or safety constraints are unclear, stop at the approval gate instead of generating.

## Source Note

This AgentHub skill is original guidance. It is conceptually inspired by the MIT-licensed `cnemri/google-genai-skills` Nano Banana and Veo skills and by Google's Gemini API documentation for Nano Banana image generation and Veo image-to-video.
