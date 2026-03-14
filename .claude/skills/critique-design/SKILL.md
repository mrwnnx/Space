---
name: critique-design
description: Review and critique design decisions in UI/UX, visual design, and software architecture. Use when the user wants structured feedback on design choices, layouts, component structure, color usage, typography, accessibility, or architectural patterns.
---

# Design Critique Skill

Provide a thorough, structured critique of design decisions — whether UI/UX, visual design, or software architecture. Deliver actionable, prioritized feedback.

## Workflow

Make a todo list for all the tasks in this workflow and work on them one after another.

### 1. Understand the Scope

Identify what is being critiqued:

- **UI/UX design**: wireframes, mockups, screenshots, Figma links, HTML/CSS components
- **Visual design**: colors, typography, spacing, imagery, brand consistency
- **Software architecture**: system diagrams, code structure, API design, data models
- **Component/code design**: React/Vue/Angular components, design system usage

Ask the user to provide:
- The design artifact (screenshot, file, code, description)
- The context (target audience, platform, constraints)
- The goals (what the design should achieve)

If any of this is missing, ask before proceeding.

### 2. Analyze the Design

Evaluate the design across relevant dimensions:

#### For UI/UX Design
- **Clarity**: Is the purpose immediately obvious? Is the hierarchy clear?
- **Consistency**: Does it follow established patterns and conventions?
- **Accessibility**: Contrast ratios, keyboard navigation, screen reader support (WCAG 2.1 AA)
- **Responsiveness**: How does it behave across screen sizes?
- **User flow**: Are interactions intuitive? Are there unnecessary steps?
- **Feedback**: Does the UI communicate state changes clearly?

#### For Visual Design
- **Color**: Palette harmony, contrast, semantic use of color
- **Typography**: Hierarchy, readability, font pairing, line-height and spacing
- **Spacing & layout**: Grid usage, whitespace, alignment, proximity
- **Visual weight**: Balance, focal points, call-to-action prominence
- **Brand alignment**: Consistency with the design system or brand guidelines

#### For Software Architecture / Code Design
- **Separation of concerns**: Are responsibilities clearly delineated?
- **Cohesion & coupling**: Are modules cohesive? Are dependencies minimal?
- **Scalability**: Will this hold up as requirements grow?
- **Maintainability**: Is the structure easy to navigate and extend?
- **Naming & abstractions**: Are names clear and abstractions well-chosen?
- **Patterns**: Are appropriate design patterns applied?

### 3. Structure the Critique

Organize feedback into three tiers:

#### Critical Issues (Must Fix)
- Blocks usability or accessibility
- Violates core design principles
- Creates technical debt or scalability risk

#### Improvements (Should Fix)
- Reduces consistency or clarity
- Misses an opportunity to improve UX
- Minor architectural smell

#### Suggestions (Nice to Have)
- Enhancements to polish or delight
- Alternative approaches worth considering
- Long-term improvements

### 4. Deliver the Critique

Format the critique clearly:

```
## Design Critique

### Context
[Brief restatement of what was reviewed and the goals]

### Critical Issues
1. **[Issue name]** — [What the problem is, why it matters, how to fix it]

### Improvements
1. **[Issue name]** — [What could be better and how]

### Suggestions
1. **[Suggestion]** — [Why this could add value]

### Summary
[2-3 sentences summarizing the overall design quality and key priorities]
```

### 5. Follow Up

After delivering the critique:
- Offer to go deeper on any specific area
- Offer to help implement the suggested fixes
- If the user updates the design, re-run the critique on the new version

## Key Principles

- Be direct and specific — vague feedback is not useful
- Always explain *why* something is a problem, not just *what*
- Balance criticism with acknowledgment of what works well
- Prioritize ruthlessly — not all feedback is equal
- Focus on the user/reader of the design, not personal preference
- Cite standards where relevant (WCAG, Material Design, platform HIG, etc.)
