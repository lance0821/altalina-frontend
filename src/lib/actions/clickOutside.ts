/**
 * Svelte action that dispatches an event when user clicks outside of the element
 * @param {HTMLElement} node
 * @param {() => void} callback Function to run when click happens outside of node
 */
export function clickOutside(node, callback) {
    const handleClick = (event) => {
        if (!node.contains(event.target)) {
            callback();
        }
    };

    document.addEventListener('click', handleClick, true);

    return {
        destroy() {
            document.removeEventListener('click', handleClick, true);
        }
    };
}