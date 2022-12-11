const elements = [
    {
        name: 'popup'
    },
    {
        name: 'button'
    }
]
export const elementRegExp = elements.map(e => e.name).join('|')

export default elements
