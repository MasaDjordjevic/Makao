/**
 * Created by Masa on 26-Jan-17.
 */
export const columnWidth = 20;
export const columnPadding = 5;

export function getScoresWidth(playerNumber) {
    return (playerNumber + 1) * (columnWidth + 2 * columnPadding) * 1.2
}