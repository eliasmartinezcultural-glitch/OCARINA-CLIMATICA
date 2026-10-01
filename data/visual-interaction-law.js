window.OCARINA_VISUAL_LAW = Object.freeze({
  version: "1.0",
  status: "LOCKED",
  base: "PL1+V3.17",
  scope: "all-future-ui-and-interaction",
  principle: "deep-technology-simple-human-experience",
  devices: ["small-phone","large-phone","tablet","laptop","desktop","touch","mouse","trackpad","keyboard","stylus"],
  acceptance: ["utility","clarity","multidevice","accessibility","performance","traceability","reversibility"],
  evidenceStates: ["observed","forecast","derived","estimated","documentary","memory"],
  forbidden: [
    "hover-only-critical-interaction",
    "horizontal-scroll-for-core-content",
    "tiny-critical-controls",
    "focus-obscured-by-fixed-ui",
    "motion-without-purpose",
    "visualization-without-provenance",
    "desktop-only-critical-function",
    "complexity-without-user-benefit"
  ],
  interactionLoop: ["state","action","response","evidence","return"],
  nonRegression: true
});
