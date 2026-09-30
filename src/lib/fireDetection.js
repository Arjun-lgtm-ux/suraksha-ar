/**
 * SurakshaAR — Fire Detection Engine (DISABLED)
 *
 * Real-world combustion flame computer vision detection has been completely removed.
 * Ready for the upcoming virtual AR hazard training module.
 */

export class FireDetector {
  constructor() {
    this.state = 'none'
  }

  detect() {
    return {
      isFire: false,
      state: 'none',
      confidence: 0,
      bbox: null,
      pixelCount: 0,
      flickerRatio: 0,
    }
  }

  reset() {
    this.state = 'none'
  }
}
