# Concept A: Binary Choice Design

## Overview

Concept A implements the **Binary Choice** approach for Placemaker Tools' landing page. This concept prioritizes efficiency and decision speed by presenting users with a clear, high-contrast split-screen interface.

## Design Philosophy

**"Efficiency First"** - Minimalist and high-contrast design that forces immediate decision-making to prevent "scroll paralysis."

## Key Features

### 🎯 Split-Screen Vertical Cards
- **Full-height cards**: Each task type takes up 50% of the screen width and significant height
- **Visual hierarchy**: Clear separation between High Impact and Quick Daily tasks
- **Hover interactions**: Cards lift and transform on hover for tactile feedback

### ⚡ High-Contrast Design
- **Distinct visual identity**: Each card has its own color scheme and icon
- **Gradient backgrounds**: Subtle gradients that don't distract from content
- **Clear typography**: Bold headings and readable descriptions

### 📊 Sticky Bottom Intelligence
- **Location stats drawer**: Always visible summary at the bottom
- **Sticky positioning**: Stays in view as users scroll or interact
- **Quick access**: Essential metrics without taking up prime real estate

## Layout Structure

```
┌─────────────────────────────────────────────────┐
│                Navigation                        │
├─────────────────────────────────────────────────┤
│              Identity Header                     │
├─────────────────┬───────────────────────────────┤
│                 │                               │
│   High Impact   │      Quick Daily              │
│     Card        │        Card                   │
│   (Blue/Purple) │    (Green/Teal)              │
│                 │                               │
│                 │                               │
├─────────────────┴───────────────────────────────┤
│          Location Intelligence Card              │
│              (Sticky Bottom)                     │
└─────────────────────────────────────────────────┘
```

## User Experience Goals

1. **Fast Decision Making**: Users should immediately understand their two options
2. **Clear Task Differentiation**: High Impact vs. Quick Daily are visually and functionally distinct
3. **Minimal Cognitive Load**: No scrolling or exploration required to understand options
4. **Efficient Task Routing**: Direct paths to `/placemaker-classic-review` or `/my-world`

## Implementation Details

- **Route**: `/concept-a`
- **Loading State**: Skeleton components for smooth loading
- **Responsive Design**: Cards stack vertically on mobile
- **Accessibility**: Full keyboard navigation and screen reader support

## Comparison with Concept B

| Feature | Concept A | Concept B |
|---------|-----------|-----------|
| **Layout** | Vertical split-screen | Horizontal stacked cards |
| **Decision Speed** | ⭐ Very fast | Engaging exploration |
| **Gamification** | Minimal | ⭐ Heavy (badges, progress) |
| **User Stats** | Standard header | ⭐ Center stage |
| **Time to Task** | Immediate | Motivational journey |

## Usage

Navigate to `/concept-a` to experience the Binary Choice design approach.

## Files

- `src/app/concept-a/page.tsx` - Main component
- `src/app/concept-a/loading.tsx` - Loading state
- `src/components/dashboard/task-choice-cards.tsx` - Shared task cards (used by both concepts)
- `src/components/dashboard/identity-header.tsx` - User identity component
- `src/components/dashboard/location-intelligence-card.tsx` - Bottom stats card