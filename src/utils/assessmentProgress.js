import { isSlideVideoCompleted } from "./videoProgress";

// Assessment progress management utility
const ASSESSMENT_PROGRESS_KEY = "assessmentProgress";

export const getAssessmentProgress = (presentationId) => {
  try {
    const stored = localStorage.getItem(ASSESSMENT_PROGRESS_KEY);
    if (!stored) return null;

    const allProgress = JSON.parse(stored);
    return (
      allProgress[presentationId] ||
      allProgress[String(presentationId)] ||
      allProgress[Number(presentationId)] ||
      null
    );
  } catch (error) {
    console.log("Error getting assessment progress:", error);
    return null;
  }
};

export const setAssessmentCompleted = (presentationId, assessmentId) => {
  try {
    const stored = localStorage.getItem(ASSESSMENT_PROGRESS_KEY);
    const allProgress = stored ? JSON.parse(stored) : {};

    if (!allProgress[presentationId]) {
      allProgress[presentationId] = {};
    }

    allProgress[presentationId][assessmentId] = true;
    localStorage.setItem(ASSESSMENT_PROGRESS_KEY, JSON.stringify(allProgress));
  } catch (error) {
    console.log("Error setting assessment completed:", error);
  }
};

export const isAssessmentCompletedLocally = (presentationId, assessmentId) => {
  if (!assessmentId || !presentationId) return false;

  const progress = getAssessmentProgress(presentationId);
  return Boolean(
    progress &&
      (progress[assessmentId] === true ||
        progress[String(assessmentId)] === true ||
        progress[Number(assessmentId)] === true)
  );
};

export const clearAssessmentProgress = (presentationId) => {
  try {
    const stored = localStorage.getItem(ASSESSMENT_PROGRESS_KEY);
    if (!stored) return;

    const allProgress = JSON.parse(stored);
    if (allProgress[presentationId]) {
      delete allProgress[presentationId];
    }
    if (allProgress[String(presentationId)]) {
      delete allProgress[String(presentationId)];
    }
    if (allProgress[Number(presentationId)]) {
      delete allProgress[Number(presentationId)];
    }
    localStorage.setItem(ASSESSMENT_PROGRESS_KEY, JSON.stringify(allProgress));
  } catch (error) {
    console.log("Error clearing assessment progress:", error);
  }
};

export const isAssessmentCompleted = (assessment, presentationId, completedAssessmentIds = []) => {
  if (!assessment) return true;
  return (
    assessment.passed === true ||
    assessment.attempts_used > 0 ||
    completedAssessmentIds.includes(assessment.id) ||
    completedAssessmentIds.includes(String(assessment.id)) ||
    completedAssessmentIds.includes(Number(assessment.id)) ||
    isAssessmentCompletedLocally(presentationId, assessment.id)
  );
};

export const isAssessmentValid = (assessment) => {
  if (!assessment || !assessment.id) return false;
  const formattedType = (assessment.type || "").toUpperCase().replace(/[\s_]+/g, "");
  const isRolePlay =
    formattedType === "ROLEPLAY" ||
    assessment.assessment_type === "ROLE_PLAY" ||
    assessment.type === "ROLE PLAY";

  if (isRolePlay) return true;

  // Regular quiz assessment must have at least 1 question
  return typeof assessment.question_count === "number" ? assessment.question_count > 0 : true;
};

export const canAccessSlideAssessment = ({
  videos = [],
  videoIndex,
  assessmentIndex = 0,
  assessment,
  presentationId,
  completedAssessmentIds = [],
}) => {
  const currentVideo = videos[videoIndex];
  if (!currentVideo) return false;

  const validSlideAssessments = (currentVideo.slide_assessments || []).filter(isAssessmentValid);
  const targetAssessment = assessment || validSlideAssessments[assessmentIndex];
  if (!targetAssessment || !isAssessmentValid(targetAssessment)) return false;

  // If this assessment is already completed, allow access (e.g. for review)
  if (isAssessmentCompleted(targetAssessment, presentationId, completedAssessmentIds)) {
    return true;
  }

  // Current slide's video must be completed
  if (!isSlideVideoCompleted(currentVideo.slide, videos, presentationId)) {
    return false;
  }

  // All previous videos must be completed
  const allPreviousVideosCompleted = videos
    .slice(0, videoIndex)
    .every((v) => isSlideVideoCompleted(v.slide, videos, presentationId));
  if (!allPreviousVideosCompleted) return false;

  // All valid slide assessments in all previous videos must be completed
  const allPreviousSlideAssessmentsCompleted = videos
    .slice(0, videoIndex)
    .every((v) =>
      (v.slide_assessments || [])
        .filter(isAssessmentValid)
        .every((a) => isAssessmentCompleted(a, presentationId, completedAssessmentIds))
    );
  if (!allPreviousSlideAssessmentsCompleted) return false;

  // All prior valid assessments on the current slide must be completed
  const targetIndex = assessment
    ? validSlideAssessments.findIndex((a) => a.id === targetAssessment.id)
    : assessmentIndex;
  if (targetIndex > 0) {
    const priorAssessmentsOnSameSlideCompleted = validSlideAssessments
      .slice(0, targetIndex)
      .every((a) => isAssessmentCompleted(a, presentationId, completedAssessmentIds));
    if (!priorAssessmentsOnSameSlideCompleted) return false;
  }

  return true;
};

export const canAccessFinalAssessment = ({
  videos = [],
  assessmentDetails = [],
  presentationId,
  completedAssessmentIds = [],
}) => {
  const finalAssessment = assessmentDetails?.[0];
  if (!finalAssessment || !isAssessmentValid(finalAssessment)) return false;

  // If final assessment is already passed or completed, it is accessible
  if (isAssessmentCompleted(finalAssessment, presentationId, completedAssessmentIds)) {
    return true;
  }

  // All videos must be completed
  const allVideosCompleted =
    videos.length === 0 ||
    videos.every((v) => isSlideVideoCompleted(v.slide, videos, presentationId));
  if (!allVideosCompleted) return false;

  // All slide assessments must be completed (ignoring assessments with 0 questions)
  const allSlideAssessmentsCompleted = videos.every((v) =>
    (v.slide_assessments || [])
      .filter(isAssessmentValid)
      .every((a) => isAssessmentCompleted(a, presentationId, completedAssessmentIds))
  );

  return allSlideAssessmentsCompleted;
};
