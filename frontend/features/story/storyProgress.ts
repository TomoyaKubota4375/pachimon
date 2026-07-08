const STORY_PROGRESS_KEY = "pachimon-story-progress";

export type StoryProgress = {
  clearedStages: boolean[];
};

const DEFAULT_STAGE_COUNT = 5;

export function createInitialStoryProgress(): StoryProgress {
  return {
    clearedStages: Array(DEFAULT_STAGE_COUNT).fill(false),
  };
}

export function loadStoryProgress(): StoryProgress {
  if (typeof window === "undefined") {
    return createInitialStoryProgress();
  }

  const savedProgress = window.sessionStorage.getItem(STORY_PROGRESS_KEY);

  if (!savedProgress) {
    return createInitialStoryProgress();
  }

  try {
    return JSON.parse(savedProgress) as StoryProgress;
  } catch {
    return createInitialStoryProgress();
  }
}

export function saveStoryProgress(progress: StoryProgress) {
  if (typeof window === "undefined") return;

  window.sessionStorage.setItem(STORY_PROGRESS_KEY, JSON.stringify(progress));
}

export function markStageCleared(stageIndex: number): StoryProgress {
  const currentProgress = loadStoryProgress();

  const nextClearedStages = [...currentProgress.clearedStages];
  nextClearedStages[stageIndex] = true;

  const nextProgress = {
    ...currentProgress,
    clearedStages: nextClearedStages,
  };

  saveStoryProgress(nextProgress);

  return nextProgress;
}