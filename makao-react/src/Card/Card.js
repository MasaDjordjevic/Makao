/**
 * Created by Masa on 22-Dec-16.
 */
export default class Card {
    constructor(sym, num, jackSymbol = null) {
        this.symbol = sym;
        this.number = num;
        this.jackSymbol = jackSymbol;
    }

    stringify() {
        switch (+this.number) {
            case 1:
                return {short: "A", long: "ace"};
            case 2:
                return {short: "2", long: "two"};
            case 3:
                return {short: "3", long: "three"};
            case 4:
                return {short: "4", long: "four"};
            case 5:
                return {short: "5", long: "five"};
            case 6:
                return {short: "6", long: "six"};
            case 7:
                return {short: "7", long: "seven"};
            case 8:
                return {short: "8", long: "eight"};
            case 9:
                return {short: "9", long: "nine"};
            case 10:
                return {short: "10", long: "ten"};
            case 12:
                return {short: "J", long: "jack"};
            case 13:
                return {short: "Q", long: "queen"};
            case 14:
                return {short: "K", long: "king"};
            default:
                return null;
        }
    }
};