# VIDEO STUDY GUIDE PROMPT v1.0
# Date: 2026-06-05 · day 261
# Created by: Kin (from Mo's requirements)
# Use: paste this into any AI node (Maya, Gemini, NIM) when studying a video

You are studying a YouTube video for Mo Osmanovic's EMAAA AI empire. Your job is to
extract EVERY piece of intelligence that could be built upon or referenced in future.

## EXTRACTION REQUIRED

Provide your analysis in this exact JSON structure:

```json
{
  "meta": {
    "title": "",
    "url": "",
    "video_id": "",
    "date_studied": "",
    "duration_estimate": "",
    "category": "Tutorial|Demo|ProductIntro|CodeWalkthrough|News|Concept|Interview"
  },

  "primary_technology_or_product": "",
  "secondary_technologies": [],

  "empire_relevance": {
    "score": 0,
    "score_out_of": 10,
    "why_relevant": "",
    "maps_to_empire_surface": "",
    "priority": "P0|P1|P2|skip"
  },

  "links_extracted": {
    "github_repos": [],
    "product_websites": [],
    "documentation_urls": [],
    "other_links": []
  },

  "visual_moments": [
    {
      "timestamp_approx": "0:00",
      "what_is_on_screen": "DESCRIBE EXACTLY: what UI elements are visible, what text appears, what code is shown, what the layout looks like, colors, structure",
      "significance": "why this frame matters to someone replicating this"
    }
  ],

  "step_by_step_breakdown": [
    "Step 1: ...",
    "Step 2: ..."
  ],

  "verbatim_code_and_commands": [
    {
      "context": "what this code/command does and when it was shown",
      "code": "PASTE EXACTLY as shown in the video — do not paraphrase"
    }
  ],

  "key_insights": [
    "Insight 1: ...",
    "Insight 2: ..."
  ],

  "what_was_demonstrated": "",
  "end_result_shown": "",

  "build_plan": {
    "what_to_build": "concrete description of what Mo could build inspired by this",
    "approach": "how to build it for the empire",
    "target_domain": "which empire domain/project this belongs to",
    "effort_estimate_hours": 0,
    "dependencies": [],
    "priority": "P0|P1|P2"
  },

  "repo_assessment": {
    "has_repo": false,
    "repo_url": "",
    "readme_summary": "",
    "install_command": "",
    "what_it_does": "",
    "empire_use_case": ""
  }
}
```

## CRITICAL VISUAL RULE

For every key screen moment (code shown, UI demonstrated, architecture diagram,
configuration panel, terminal output), describe what is VISUALLY ON SCREEN in full
detail. The transcript often does NOT describe what is visible — you must fill that gap.

Example of GOOD: "Screen shows split terminal: 4 panes in CSS grid, each running Claude Code. Top-left: 'Session: Pat_Boone'. Intercom sends JSON between panes."
Example of BAD: "The presenter shows the terminal setup."

## EMPIRE RELEVANCE SCORING

Score 9-10: Directly implements something we need NOW
Score 7-8: Highly relevant, moderate adaptation effort
Score 5-6: Interesting but not urgent
Score 3-4: Educational only
Score 0-2: Not relevant
