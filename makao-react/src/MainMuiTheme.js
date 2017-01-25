/**
 * Created by Masa on 28-Dec-16.
 */
import {
    teal900,cyan500, cyan700,
    grey100, grey300, grey500,
    blueGrey200,
    white, darkBlack, fullBlack,
} from 'material-ui/styles/colors';
import {fade} from 'material-ui/utils/colorManipulator';
import spacing from 'material-ui/styles/spacing';

/**
 *  Light Theme is the default theme used in material-ui. It is guaranteed to
 *  have all theme variables needed for every component. Variables not defined
 *  in a custom theme will default to these values.
 */
export default {
    spacing: spacing,
    fontFamily: 'Roboto, sans-serif',
    palette: {
        primary1Color: teal900,
        primary2Color: cyan700,
        primary3Color: blueGrey200,
        accent1Color: teal900,
        accent2Color: grey100,
        accent3Color: grey500,
        textColor: darkBlack,
        secondaryTextColor: fade(darkBlack, 0.54),
        alternateTextColor: white,
        canvasColor: white,
        borderColor: grey300,
        disabledColor: fade(darkBlack, 0.3),
        pickerHeaderColor: cyan500,
        clockCircleColor: fade(darkBlack, 0.07),
        shadowColor: fullBlack,
    },
    tabs: {
        backgroundColor: 'rgba(0,0,0,0)',
        textColor: fade(teal900, 0.7),
        selectedTextColor: teal900,
    },
};