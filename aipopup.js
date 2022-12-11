import { elementRegExp } from './elements.js';
import { getRegExps, drawCommandValue } from './dictionary.js';

const input = document.getElementById('ai-popup');
const resultContainer = document.getElementById('result-container');

drawCommandValue(input)
input.contentEditable = true;


const state = {
    createdState: false,
    editingElement: null
};


const changeInputHandle = () => {

    const value = input.innerHTML.replace(/<[^>]+>/g, "").replaceAll('&nbsp;', '');
    const createCommand = new RegExp(`^create.* (${elementRegExp}).*`, 'i').exec(value);
    drawCommandValue(input)

    const createElementType = createCommand?.find(e => e === 'popup')

    if (createCommand && !state.createdState) {
        createElement(createCommand, createElementType, false)
    }

    //if created element and want to change styles
    if (state.createdState && state.editingElement) {
        styleGenerator(createCommand, state.editingElement)
    }
}

function createElement(text, elementType) {
    let newElement = null;
    switch (elementType) {
        case 'popup':
            newElement = document.createElement('div');
            styleGenerator(text, newElement)
            break;
        default:
            break;
    }
    resultContainer.append(newElement)
    state.editingElement = newElement;
    state.createdState = true;
}

function styleGenerator(text, element) {

    element.setAttribute('style', '')
    let style = '';
    const { widthAndHeight, fixedPosition, backgroundColor, borderRadiusAllCorners } = getRegExps(text)
    const alignmentStyles = {
        'center': 'inset:0; margin:auto;  margin-bottom:auto; position:fixed;',
        'center-top': 'inset:0; margin:0 auto auto auto; position:fixed;',
        'center-bottom': 'inset:0; margin:auto auto 0; position:fixed;',
        'center-left': 'inset:0; margin:auto auto auto 0; position:fixed;',
        'center-right': 'inset:0; margin:auto 0 auto auto; position:fixed;',
        'left': 'inset:0; margin-right:auto; position:fixed;',
        'left-center': 'inset:0; margin: auto 0; position:fixed;',
        'left-bottom': 'inset:0; margin:auto 0 0 0; position:fixed;',
        'right': 'inset:0; margin-left:auto; position:fixed;',
        'right-center': 'inset:0; margin:auto 0 auto auto; position:fixed;',
        'right-bottom': 'inset:0; margin:auto 0 0 auto; position:fixed;',
    }
    if (fixedPosition) {
        style.replace(Object.values(alignmentStyles).toString(), '');
        style += alignmentStyles[fixedPosition]?.toString()
    }
    element.setAttribute('style', style)

    if (widthAndHeight) {
        element.style.width = widthAndHeight
        element.style.height = widthAndHeight
    }


    if (backgroundColor) {
        element.style.backgroundColor = backgroundColor
    }

    if (borderRadiusAllCorners) {
        element.style.borderRadius = borderRadiusAllCorners
    }

}
input.addEventListener('input', changeInputHandle)