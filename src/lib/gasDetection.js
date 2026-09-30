/**
 * SurakshaAR — Smoke & Gas Detection Engine (DISABLED)
 *
 * Real-world smoke plume and optical diffusion detection has been completely removed.
 * Ready for the upcoming virtual AR hazard training module.
 */

export class SmokePlumeDetector {
  constructor() {
    this.state = 'none'
  }

  detect() {
    return {
      isGasHazard: false,
      isSmoke: false,
      state: 'none',
      visualConfidence: 0,
      bbox: null,
      pixelCount: 0,
    }
  }

  reset() {
    this.state = 'none'
  }
}

export const GasTrainingDetector = SmokePlumeDetector

export function isSkinPixel() {
  return false
}
