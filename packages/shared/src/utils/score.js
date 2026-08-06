"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateHiddenGemScore = calculateHiddenGemScore;
/**
 * Calculates the Hidden Gem Score (weighted average of sub-scores)
 */
function calculateHiddenGemScore(reviews) {
    if (!reviews || reviews.length === 0) {
        return {
            overallScore: 0,
            foodQuality: 0,
            priceWorth: 0,
            service: 0,
            ambience: 0,
            consistency: 0,
            reviewCount: 0,
        };
    }
    let foodTotal = 0;
    let priceTotal = 0;
    let serviceTotal = 0;
    let ambienceTotal = 0;
    let consistencyTotal = 0;
    for (const r of reviews) {
        foodTotal += r.food_quality;
        priceTotal += r.price_worth;
        serviceTotal += r.service;
        ambienceTotal += r.ambience;
        consistencyTotal += r.consistency;
    }
    const count = reviews.length;
    const foodQuality = foodTotal / count;
    const priceWorth = priceTotal / count;
    const service = serviceTotal / count;
    const ambience = ambienceTotal / count;
    const consistency = consistencyTotal / count;
    // Weighted calculation: Food Quality (40%), Price Worth (25%), Consistency (15%), Service (10%), Ambience (10%)
    const rawWeighted = foodQuality * 0.4 +
        priceWorth * 0.25 +
        consistency * 0.15 +
        service * 0.1 +
        ambience * 0.1;
    // Scale to 10-point scale
    const overallScore = Math.round(rawWeighted * 2 * 10) / 10;
    return {
        overallScore,
        foodQuality: Math.round(foodQuality * 10) / 10,
        priceWorth: Math.round(priceWorth * 10) / 10,
        service: Math.round(service * 10) / 10,
        ambience: Math.round(ambience * 10) / 10,
        consistency: Math.round(consistency * 10) / 10,
        reviewCount: count,
    };
}
