/**
 * Created by Masa on 22-Dec-16.
 */

export const blackColor = "#36474f";
export const redColor = "#d4494f";
export const font = "Roboto Condensed";
export const cardHoverGrowth = 1.05;

export const rotatedStyle = {
    transform: "rotate(180deg)",
};

export function isBlack(symbol) {
    return symbol === "spades" || symbol === "clubs";
}
export function getCardWidth(height) {
    return height / 3 * 2;
}
