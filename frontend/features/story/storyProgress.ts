const STORY_PROGRESS_KEY = "pachimon-story-progress";

const DEFAULT_STAGE_COUNT = 5;

export type StoryProgress = {
  clearedStages: boolean[];
};

export function loadStoryProgress(): StoryProgress {
  if (typeof window === "undefined") {
    return {
      clearedStages: Array(DEFAULT_STAGE_COUNT).fill(false),
    };
  }

  const saved = sessionStorage.getItem(STORY_PROGRESS_KEY);

  if (!saved) {
    return {
      clearedStages: Array(DEFAULT_STAGE_COUNT).fill(false),
    };
  }

  try {
    return JSON.parse(saved) as StoryProgress;
  } catch {
    return {
      clearedStages: Array(DEFAULT_STAGE_COUNT).fill(false),
    };
  }
}

export function saveStoryProgress(progress: StoryProgress) {
  sessionStorage.setItem(STORY_PROGRESS_KEY, JSON.stringify(progress));
}

export function markStageCleared(stageIndex: number): StoryProgress {
  const progress = loadStoryProgress();

  const clearedStages = [...progress.clearedStages];
  clearedStages[stageIndex] = true;

  const nextProgress: StoryProgress = {
    clearedStages,
  };

  saveStoryProgress(nextProgress);

  return nextProgress;
}