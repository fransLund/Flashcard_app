
export interface Flashcard {
  id: string;
  term: string;
  definition: string;
  context?: string;
}

export enum AppState {
  INPUT = 'INPUT',
  LOADING = 'LOADING',
  STUDY = 'STUDY'
}

export interface TranslationResponse {
  flashcards: Array<{
    term: string;
    definition: string;
    context?: string;
  }>;
}
