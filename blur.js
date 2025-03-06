document.addEventListener('DOMContentLoaded', () => {
    const BLUR_ID = 'command-blur';
    const COMMAND_PALETTE_SELECTOR = '.quick-input-widget';
    const WORKBENCH_SELECTOR = '.monaco-workbench';

    const addBlurBackdrop = () => {
        const workbench = document.querySelector(WORKBENCH_SELECTOR);
        if (!workbench) return;

        removeBlurBackdrop(); // Remove any existing blur to avoid duplicates

        const blurElement = document.createElement('div');
        blurElement.id = BLUR_ID;
        blurElement.style.position = 'absolute';
        blurElement.style.inset = '0';
        blurElement.style.backdropFilter = 'blur(5px)';
        blurElement.style.backgroundColor = 'rgba(0,0,0,0.1)';
        blurElement.style.zIndex = '1000';

        // Clicking the blur area should close the palette
        blurElement.addEventListener('click', () => {
            removeBlurBackdrop();
            closeCommandPalette();
        });

        workbench.appendChild(blurElement);
    };

    const removeBlurBackdrop = () => {
        const existingBlur = document.getElementById(BLUR_ID);
        if (existingBlur) {
            existingBlur.remove();
        }
    };

    const closeCommandPalette = () => {
        const palette = document.querySelector(COMMAND_PALETTE_SELECTOR);
        if (palette) {
            palette.style.display = 'none'; // Trigger the default behavior
        }
    };

    const setupObserver = () => {
        const palette = document.querySelector(COMMAND_PALETTE_SELECTOR);
        if (!palette) {
            console.warn('Command palette not found. Retrying...');
            setTimeout(setupObserver, 500);
            return;
        }

        const observer = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    const isVisible = palette.style.display !== 'none';
                    if (isVisible) {
                        addBlurBackdrop();
                    } else {
                        removeBlurBackdrop();
                    }
                }
            }
        });

        observer.observe(palette, { attributes: true });

        if (palette.style.display !== 'none') {
            addBlurBackdrop();
        }
    };

    // Global keyboard shortcuts (Cmd+P, Esc)
    document.addEventListener('keydown', (event) => {
        if ((event.metaKey || event.ctrlKey) && event.key === 'p') {
            event.preventDefault();
            addBlurBackdrop();
        } else if (event.key === 'Escape') {
            removeBlurBackdrop();
        }
    });

    setupObserver();
});
