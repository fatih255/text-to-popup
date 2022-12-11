const dictionary = {

    general: [],
    style: {
        widthAndHeight: {
            RegExp: `(?<=(width and height of)(.*px|em|rem|vw|vh))`,
            captureTextIndex: 1,
            captureValueIndex: 2,
            description: 'change width and height same value',
        },
        fixedPosition: {
            RegExp: `.*(in the (.*) of the page).*`,
            captureTextIndex: 1,
            captureValueIndex: 2,
            description: 'change fixed position'
        },
        backgroundColor: {
            RegExp: `.* (a (.*) background color) .*`,
            captureTextIndex: 1,
            captureValueIndex: 2,
            description: 'change background color'
        },
        borderRadiusAllCorners: {
            RegExp: '(?<=(soften the edges by) (.*px|em|rem|vw|vh))',
            captureTextIndex: 1,
            captureValueIndex: 2,
            description: 'change border radius all corners'
        }
    }
}

let previousResults = 0;
const drawCommandValue = (input) => {

    const text = input.innerHTML.replace(/<[^>]+>/g, "").replaceAll('&nbsp;', '');

    const valueResult = Object.keys(dictionary.style).map((key) =>
        new RegExp(`${dictionary.style[key].RegExp}`, 'i')
            .exec(text)
        ?.[dictionary.style[key].captureValueIndex])

    const textResult = Object.keys(dictionary.style).map((key) =>
        new RegExp(`${dictionary.style[key].RegExp}`, 'i')
            .exec(text)
        ?.[dictionary.style[key].captureTextIndex]
    )

    const textRegex = new RegExp(`${textResult.join('|')}`, 'gi')
    const valueRegex = new RegExp(`${valueResult.join('|')}`, 'gi')

    if (previousResults === [...valueResult, ...textResult].filter((x) => x == null).length) return

    previousResults = [...valueResult, ...textResult].filter((x) => x == null).length

    const results = {
        string: text,
        html: text
            .replace(valueRegex, (value) => value && `<span class="command-value">&nbsp;&nbsp;${value}&nbsp;&nbsp;</span>`)
            .replace(textRegex,
                (value) => value && `<span class="command-text">&nbsp;&nbsp;${value}&nbsp;&nbsp;</span>`)
    }
    input.innerHTML = results.html;
    if (input.hasChildNodes()) {  // if the element is not empty
        const spaceDiv = document.createElement('span');
        spaceDiv.id = 'last'
        spaceDiv.contentEditable = true;
        spaceDiv.innerHTML = '&nbsp;'
        input.appendChild(spaceDiv);
        let s = window.getSelection();
        let r = document.createRange();
        let e = input.childElementCount > 0 ? input.lastChild : input;
        r.setStart(e, 1);
        r.setEnd(e, 1);
        s.removeAllRanges();
        s.addRange(r);
    }
}

const getRegExps = (text) => {

    return Object
        .keys(dictionary.style)
        .reduce((acc, key) => Object(
            {
                ...acc,
                [key]: new RegExp(`${dictionary.style[key].RegExp}`, 'i')
                    .exec(text)
                    ?.[dictionary.style[key].captureValueIndex]
            }), {})
}

export { getRegExps, drawCommandValue }
export default dictionary