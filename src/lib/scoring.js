/**
 * SurakshaAR — Training Session Scoring Utility
 *
 * Rules (SIH 2026 brief):
 *   Base score: 100
 *   Deduct 10 pts per missed/incorrect step
 *   Deduct up to 20 pts for slow reaction time (scaled vs benchmark)
 *   Bonus +5 pts if ALL PPE steps completed correctly
 *
 * Min: 0 | Max: 105
 */
export function calculateScore(steps, benchmarkTimeMs) {
  if (!Array.isArray(steps) || steps.length === 0) {
    return { score: 0, breakdown: { missedSteps: 0, stepPenalty: 0, totalTimeMs: 0, timePenalty: 0, allPPECorrect: false, ppeBonus: 0 } }
  }
  const missedSteps = steps.filter(s => !s.was_correct).length
  const stepPenalty = missedSteps * 10
  const totalTimeMs = steps.reduce((sum, s) => sum + (s.time_taken_ms ?? 0), 0)
  let timePenalty = 0
  if (totalTimeMs > benchmarkTimeMs) {
    const overRatio = (totalTimeMs - benchmarkTimeMs) / benchmarkTimeMs
    timePenalty = Math.min(20, Math.round(overRatio * 20))
  }
  const ppeSteps = steps.filter(s => s.is_ppe_step)
  const allPPECorrect = ppeSteps.length > 0 && ppeSteps.every(s => s.was_correct)
  const ppeBonus = allPPECorrect ? 5 : 0
  const score = Math.max(0, Math.min(105, 100 - stepPenalty - timePenalty + ppeBonus))
  return { score, breakdown: { missedSteps, stepPenalty, totalTimeMs, timePenalty, allPPECorrect, ppeBonus } }
}

export function scoreRating(score) {
  if (score >= 90) return { label: 'Excellent', color: '#2E8B57', bg: '#E6F4EC' }
  if (score >= 75) return { label: 'Good', color: '#0E7C7B', bg: '#E8F5F5' }
  if (score >= 55) return { label: 'Fair', color: '#d4882a', bg: '#FDF3E3' }
  return { label: 'Needs Work', color: '#C0392B', bg: '#FCEAEA' }
}

export function generateFeedbackTips(breakdown, hazardType) {
  const tips = []
  if (breakdown.missedSteps > 0) {
    tips.push(`You missed ${breakdown.missedSteps} step(s). Review the correct sequence for a ${hazardType.replace('_', ' ')} emergency before retrying.`)
  }
  if (breakdown.timePenalty > 0) {
    tips.push(`Your response time was slower than the benchmark. In a real emergency, every second counts — aim to complete the scenario faster.`)
  }
  if (!breakdown.allPPECorrect) {
    tips.push(`PPE steps were missed or done incorrectly. Always don the correct Personal Protective Equipment before approaching a hazard.`)
  }
  if (breakdown.missedSteps === 0 && breakdown.timePenalty === 0) {
    tips.push(`Outstanding! You completed all steps correctly and within the benchmark time.`)
  }
  if (breakdown.allPPECorrect) {
    tips.push(`Great PPE discipline! Wearing the correct protective equipment earned you the +5 bonus points.`)
  }
  return tips
}

export function assessmentRating(score, total) {
  const pct = (score / total) * 100
  if (pct >= 80) return { label: 'Excellent', color: '#2E8B57', bg: '#E6F4EC', passed: true }
  if (pct >= 60) return { label: 'Passed', color: '#0E7C7B', bg: '#E8F5F5', passed: true }
  return { label: 'Not Passed', color: '#C0392B', bg: '#FCEAEA', passed: false }
}

/**
 * Smart Assessment Quad-Metric Engine (SIH26041 Specification)
 * Computes: Knowledge Score, Procedure Score, Critical Errors, Response Time
 */
export function calculateSmartAssessment({
  session = null,
  steps = [],
  criticalErrors = 0,
  benchmarkTimeMs = 60000,
  mcqScore = 85,
}) {
  const totalSteps = steps.length || 6
  const knowledgeScore = mcqScore ?? 85
  const correctSteps = steps.filter(s => s.was_correct).length
  const ppeSteps = steps.filter(s => s.is_ppe_step)
  const allPPECorrect = ppeSteps.length > 0 && ppeSteps.every(s => s.was_correct)
  const ppeBonus = allPPECorrect ? 5 : 0
  const procedureBase = Math.round((correctSteps / totalSteps) * 100)
  const procedureScore = Math.min(100, procedureBase + ppeBonus)
  const totalTimeMs = steps.reduce((sum, s) => sum + (s.time_taken_ms ?? 0), 0) || 45000
  const responseTimeSec = Math.round(totalTimeMs / 1000)
  const benchmarkSec = Math.round(benchmarkTimeMs / 1000)
  const criticalErrorCount = criticalErrors + steps.filter(s => s.is_critical_error || s.consequence_failure).length
  const passed = knowledgeScore >= 60 && procedureScore >= 60 && criticalErrorCount === 0
  const overallScore = Math.max(0, Math.min(100, Math.round((knowledgeScore * 0.45) + (procedureScore * 0.55) - (criticalErrorCount * 30))))

  return {
    knowledgeScore,
    procedureScore,
    criticalErrorCount,
    responseTimeSec,
    benchmarkSec,
    passed,
    overallScore,
    competencies: {
      hazardRecognition: correctSteps >= 1 ? 95 : 40,
      ppeCompliance: allPPECorrect ? 100 : 50,
      equipmentHandling: criticalErrorCount === 0 ? 92 : 30,
      evacuationTiming: responseTimeSec <= benchmarkSec ? 96 : 65,
    }
  }
}
