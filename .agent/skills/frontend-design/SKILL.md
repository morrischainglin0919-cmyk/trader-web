---
name: frontend-design
description: >-
  Create distinctive, production-grade frontend interfaces with high design quality.
  Enforces bold aesthetic stances, intentional typography, color harmony, responsive layout craft,
  and accessibility while eliminating generic AI UI slop.
---

# Frontend Design Skill

The **frontend-design** skill equips Antigravity with guidelines and evaluation frameworks to design and implement distinctive, production-ready frontend interfaces.

---

## 1. Core Mandate: Eliminating "AI UI Slop"

Standard AI-generated interfaces often suffer from generic, repetitive patterns:
*   Overused rounded-corner cards with faint grey borders on generic light grey backgrounds.
*   Generic indigo/purple-to-pink gradient buttons and glowing hero sections.
*   Indiscriminate use of Inter/Roboto without typographic personality.
*   Identical centered hero sections with three feature cards below.

### The Stance Principle
Before writing any HTML, CSS, or UI code, **you MUST commit to a named, cohesive aesthetic stance** appropriate for the project domain. Examples include:

*   **Editorial Brutalism**: High-contrast typography, thick borders, asymmetric grids, mono/serif pairings, raw structural aesthetic.
*   **Luxury Minimal**: Deep muted tones, serif headings, generous whitespace, delicate borders, elegant micro-animations.
*   **Industrial Utilitarian**: Monospace metrics, dense functional layouts, high-visibility status indicators, high utility.
*   **Modern Swiss / Grid-Strict**: Precise typographic scale, strict alignment, strong grid layout, bold primary accents.
*   **Kinetic Soft-Tech**: Soft depth, rich glassmorphic overlays, subtle micro-interactions, spring physics motion.

---

## 2. Design Feasibility & Impact Index (DFII)

Before implementing complex UIs, evaluate your design direction using the **Design Feasibility & Impact Index (DFII)** (rated 1 to 5 for each dimension):

1. **Implementation Feasibility (1-5)**: Can this design be implemented reliably without fragile hacks?
2. **Aesthetic Impact (1-5)**: Is the visual design distinctive, memorable, and aligned with a clear point of view?
3. **Context Fit (1-5)**: Does the design suit the user's intent, audience, and functional requirements?
4. **Performance & Accessibility Safety (1-5)**: Is the layout lightweight, responsive, 60fps capable, and WCAG AA compliant?
5. **Consistency Risk (1-5)**: Will this design scale gracefully across components and dynamic screen sizes?

### Scoring Formula
$$\text{DFII} = (\text{Impact} + \text{Fit} + \text{Feasibility} + \text{Performance}) - \text{Consistency Risk}$$

*   **12 – 15 (Exceptional)**: Proceed with full execution.
*   **8 – 11 (Solid)**: Execute with discipline; simplify edge cases.
*   **4 – 7 (Caution)**: Reduce visual complexity or refine layout.
*   $\mathbf{\le 3}$ **(Pivot)**: Re-evaluate and pick a more functional aesthetic direction.

---

## 3. Typographic & Visual Hierarchy

*   **Type Pairing**: Pair a distinctive headline font (Display Serif, Grotesque Sans, or Technical Mono) with a highly legible body typeface.
*   **Fluid Sizing**: Utilize fluid typographic scales using `clamp()` (e.g., `font-size: clamp(1.5rem, 4vw, 3rem);`) for seamless responsiveness.
*   **Vertical Rhythm**: Enforce explicit line-height (`1.1 - 1.25` for display headers, `1.5 - 1.7` for body text) and letter-spacing (`-0.02em` for large headers, `0.05em` for uppercase labels).

---

## 4. Color Architecture & Contrast

*   **60-30-10 Rule**:
    *   **60% Dominant Background**: Neutral canvas setting the overall mood.
    *   **30% Structural Secondary**: Containers, sidebars, borders, surface layers.
    *   **10% Focal Accent**: Primary action triggers, key data indicators, active states.
*   **Accessibility First**: Text must achieve at least 4.5:1 contrast ratio against its background (WCAG AA).
*   **Systemic Tokens**: Define CSS custom properties (`--bg-primary`, `--text-main`, `--accent-brand`) or Tailwind color extensions for consistency.

---

## 5. Interaction & Motion Craft

*   **Micro-Interactions**: Interactive elements must provide immediate, tactile feedback on hover, focus, and active states.
*   **Spring & Bezier Easing**: Use realistic physics easing such as `cubic-bezier(0.16, 1, 0.3, 1)` for smooth transitions.
*   **Accessibility Motion**: Always respect user motion preferences:
    ```css
    @media (prefers-reduced-motion: reduce) {
      *, ::before, ::after {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
      }
    }
    ```

---

## 6. Implementation Checklist

When building or updating UI code:
- [ ] Named aesthetic stance selected and adhered to consistently.
- [ ] Responsive grid layout tested across mobile, tablet, and desktop viewports.
- [ ] Semantic HTML tags (`<header>`, `<main>`, `<nav>`, `<article>`, `<footer>`) used throughout.
- [ ] Keyboard navigation and visible focus rings (`:focus-visible`) configured.
- [ ] No hardcoded pixel magic numbers; layout uses flexbox/grid containers.
