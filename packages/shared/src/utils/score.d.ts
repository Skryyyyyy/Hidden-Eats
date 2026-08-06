import { Review, HiddenGemBreakdown } from '../types/review.js';
/**
 * Calculates the Hidden Gem Score (weighted average of sub-scores)
 */
export declare function calculateHiddenGemScore(reviews: Review[]): HiddenGemBreakdown;
