/**
 * SurakshaAR — Innovation Layer: Trainee Competency & Telemetry Tracker
 * 
 * Tracks real response times (ms), sequence adherence against standard operating
 * procedures (SOP), categorizes trainee safety mistakes, and derives competency
 * gaps to drive targeted re-training recommendations.
 * 
 * CRITICAL HONESTY NOTICE:
 * All tracked hazards are visual training simulations rendered for vocational mastery.
 * No hardware gas/temperature sensor data is fabricated or implied.
 */

// ── Standard Competency Gaps ────────────────────────────────────────────────
export const COMPETENCY_GAPS = {
  HAZARD_IDENTIFICATION_SPEED: {
    id: 'HAZARD_IDENTIFICATION_SPEED',
    label: 'Hazard Recognition Speed',
    label_hi: 'खतरे की पहचान की गति',
    label_sat: 'ᱵᱚᱛᱚᱨ ᱪᱤᱱᱦᱟᱹᱣ ᱨᱮᱱᱟᱜ ᱞᱟᱦᱟᱱᱛᱤ',
    description: 'Ability to locate and verify industrial hazards within the initial critical response window.',
  },
  PPE_COMPLIANCE_DISCIPLINE: {
    id: 'PPE_COMPLIANCE_DISCIPLINE',
    label: 'PPE Selection & Fitting Compliance',
    label_hi: 'PPE चयन और उपयोग अनुशासन',
    label_sat: 'PPE ᱵᱟᱪᱷᱟᱣ ᱟᱨ ᱦᱚᱨᱚᱜ ᱱᱤᱭᱟᱹᱢ',
    description: 'Adherence to mandatory personal protective equipment before entering hazardous zones.',
  },
  FIRE_ASSESSMENT_ACCURACY: {
    id: 'FIRE_ASSESSMENT_ACCURACY',
    label: 'Fire Severity Assessment & Suppression',
    label_hi: 'आग की तीव्रता का सटीक आकलन',
    label_sat: 'ᱥᱮᱸᱜᱮᱞ ᱡᱩᱞ ᱯᱟᱨᱠᱷᱟᱣ ᱟᱨ ᱤᱬᱤᱡ',
    description: 'Evaluating incipient vs. uncontrolled fire and applying the correct extinguishing or evacuation protocol.',
  },
  EVACUATION_DECISION_EFFICIENCY: {
    id: 'EVACUATION_DECISION_EFFICIENCY',
    label: 'Emergency Evacuation & Route Finding',
    label_hi: 'आपातकालीन निकासी और मार्ग पहचान',
    label_sat: 'ᱟᱯᱟᱛᱠᱟᱞᱤᱱ ᱚᱰᱚᱠ ᱟᱨ ᱦᱚᱨ ᱪᱤᱱᱦᱟᱹᱣ',
    description: 'Immediate departure along designated emergency exit routes to safe muster points without hesitation.',
  },
  SPATIAL_SAFETY_AWARENESS: {
    id: 'SPATIAL_SAFETY_AWARENESS',
    label: 'Spatial Hazard & Safe Clearance Awareness',
    label_hi: 'स्थानिक सुरक्षा और सुरक्षित दूरी की समझ',
    label_sat: 'ᱴᱷᱟᱶ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱟᱨ ᱥᱟᱺᱜᱤᱧ ᱵᱟᱰᱟᱭ',
    description: 'Maintaining safe stand-off distance from energized panels and hazardous discharge zones.',
  },
}

class CompetencyTracker {
  constructor() {
    this.currentSessionId = null
    this.scenarioId = null
    this.scenarioTitle = null
    this.hazardType = null
    this.stepStartTime = 0
    this.sessionStartTime = 0
    this.telemetryLogs = []
    this.identifiedGaps = []
    this.reTrainingRecommendations = []
  }

  /**
   * Initializes tracking for a new training drill
   */
  startSession({ sessionId, scenarioId, scenarioTitle, hazardType }) {
    this.currentSessionId = sessionId
    this.scenarioId = scenarioId
    this.scenarioTitle = scenarioTitle
    this.hazardType = hazardType
    this.sessionStartTime = Date.now()
    this.telemetryLogs = []
    this.identifiedGaps = []
    this.reTrainingRecommendations = []

    console.log('[SurakshaAR CompetencyTracker] Session started:', {
      sessionId,
      scenarioTitle,
      hazardType,
      timestamp: new Date().toISOString(),
    })
  }

  /**
   * Marks the presentation of a specific step (starts reaction stopwatch)
   */
  startStep(stepIndex, stepLabel) {
    this.stepStartTime = performance.now()
    console.log(`[SurakshaAR CompetencyTracker] Step ${stepIndex} (${stepLabel}) presented. Timing initiated.`)
  }

  /**
   * Records a trainee action with measured reaction time and sequence verification
   */
  recordAction({
    stepIndex,
    stepLabel,
    expectedSequenceIndex,
    isPpeStep = false,
    decisionChoice = null,
    arTrackingMode = 'webxr_hit_test',
    surfaceDetected = true,
    distanceToHazard = null,
  }) {
    const elapsedMs = Math.round(performance.now() - this.stepStartTime)
    const sequenceCorrect = stepIndex === expectedSequenceIndex

    const entry = {
      sessionId: this.currentSessionId,
      scenarioId: this.scenarioId,
      timestamp: new Date().toISOString(),
      stepIndex,
      stepLabel,
      elapsedMs,
      sequenceCorrect,
      isPpeStep,
      decisionChoice,
      arTrackingMode,
      surfaceDetected,
      distanceToHazard,
      success: true,
      mistakeType: null,
    }

    this.telemetryLogs.push(entry)
    this._persistAndDispatch()
    return entry
  }

  /**
   * Records a specific trainee mistake or protocol deviation
   */
  recordMistake({
    stepIndex,
    stepLabel,
    mistakeType, // 'timeout' | 'wrong_decision_call' | 'sequence_violation' | 'unsafe_distance'
    details,
    decisionChoice = null,
  }) {
    const elapsedMs = Math.round(performance.now() - this.stepStartTime)

    const mistakeEntry = {
      sessionId: this.currentSessionId,
      scenarioId: this.scenarioId,
      timestamp: new Date().toISOString(),
      stepIndex,
      stepLabel,
      elapsedMs,
      success: false,
      mistakeType,
      decisionChoice,
      details,
    }

    this.telemetryLogs.push(mistakeEntry)

    // Dynamically derive competency gaps based on error patterns
    this._evaluateCompetencyGap(mistakeEntry)
    this._persistAndDispatch()

    console.warn('[SurakshaAR CompetencyTracker] Trainee mistake recorded:', mistakeEntry)
    return mistakeEntry
  }

  /**
   * Internal rule engine: maps specific telemetry mistakes to competency gaps
   */
  _evaluateCompetencyGap(mistake) {
    let gap = null
    let recommendation = null

    if (mistake.stepIndex === 0 && mistake.mistakeType === 'timeout') {
      gap = COMPETENCY_GAPS.HAZARD_IDENTIFICATION_SPEED
      recommendation = {
        gapId: gap.id,
        triggerRetraining: true,
        recommendedScenario: this.scenarioId,
        focusArea: 'Initial Hazard Sweep & Target Identification',
        urgency: 'high',
      }
    } else if (mistake.isPpeStep || mistake.stepIndex === 2) {
      gap = COMPETENCY_GAPS.PPE_COMPLIANCE_DISCIPLINE
      recommendation = {
        gapId: gap.id,
        triggerRetraining: true,
        recommendedScenario: 'a1b2c3d4-0004-0004-0004-000000000004', // PPE Baseline
        focusArea: 'Mandatory PPE Sequence & Fitment Inspection',
        urgency: 'critical',
      }
    } else if (mistake.stepIndex === 3) {
      gap = COMPETENCY_GAPS.FIRE_ASSESSMENT_ACCURACY
      recommendation = {
        gapId: gap.id,
        triggerRetraining: true,
        recommendedScenario: this.scenarioId,
        focusArea: 'PASS Extinguisher Protocol & Incident Containment',
        urgency: 'high',
      }
    } else if (mistake.stepIndex >= 4) {
      gap = COMPETENCY_GAPS.EVACUATION_DECISION_EFFICIENCY
      recommendation = {
        gapId: gap.id,
        triggerRetraining: true,
        recommendedScenario: this.scenarioId,
        focusArea: 'Emergency Exit Identification & Muster Assembly',
        urgency: 'medium',
      }
    }

    if (gap && !this.identifiedGaps.some(g => g.id === gap.id)) {
      this.identifiedGaps.push(gap)
    }
    if (recommendation && !this.reTrainingRecommendations.some(r => r.gapId === recommendation.gapId)) {
      this.reTrainingRecommendations.push(recommendation)
    }
  }

  /**
   * Returns complete structured training report for analytics and certificate engine
   */
  getSummaryReport() {
    const totalSteps = this.telemetryLogs.length
    const successfulActions = this.telemetryLogs.filter(l => l.success).length
    const mistakes = this.telemetryLogs.filter(l => !l.success)
    const avgResponseTimeMs = totalSteps > 0
      ? Math.round(this.telemetryLogs.reduce((acc, l) => acc + (l.elapsedMs || 0), 0) / totalSteps)
      : 0

    return {
      sessionId: this.currentSessionId,
      scenarioId: this.scenarioId,
      scenarioTitle: this.scenarioTitle,
      hazardType: this.hazardType,
      durationMs: Date.now() - this.sessionStartTime,
      avgResponseTimeMs,
      totalActions: totalSteps,
      accuracyRate: totalSteps > 0 ? Math.round((successfulActions / totalSteps) * 100) : 100,
      mistakesCount: mistakes.length,
      identifiedGaps: [...this.identifiedGaps],
      reTrainingRecommendations: [...this.reTrainingRecommendations],
      telemetryLogs: [...this.telemetryLogs],
      isVisualSimulation: true,
      trainingComplianceStandard: 'SIH26041-VOCATIONAL-SAFETY-v1',
    }
  }

  _persistAndDispatch() {
    try {
      const summary = this.getSummaryReport()
      localStorage.setItem(`suraksha_competency_${this.currentSessionId}`, JSON.stringify(summary))
      localStorage.setItem('suraksha_latest_competency_report', JSON.stringify(summary))

      // Emit global DOM event for reactive UI updates
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('suraksha:competency-updated', {
            detail: summary,
          })
        )
      }
    } catch (e) {
      console.warn('[SurakshaAR CompetencyTracker] Persistence error:', e)
    }
  }
}

export const competencyTracker = new CompetencyTracker()
