(() => {
    const frameType = document.currentScript.dataset.frameType;

    if (frameType === 'class') {
        const content = document.querySelector('.class-page') || document.body;

        const reportClassHeight = () => {
            const height = Math.ceil(content.getBoundingClientRect().height);
            window.parent.postMessage({ type: 'class-height', height }, '*');
        };

        new ResizeObserver(reportClassHeight).observe(content);
        document.querySelectorAll('details').forEach((details) => {
            details.addEventListener('toggle', reportClassHeight);
        });
        window.addEventListener('message', (event) => {
            if (event.source === window.parent && event.data?.type === 'measure-class-height') {
                reportClassHeight();
            }
        });
        window.addEventListener('load', reportClassHeight);
        window.addEventListener('resize', reportClassHeight);
        return;
    }

    if (frameType === 'tutoria') {
        const lessonFrame = document.getElementById('lesson-frame');
        const page = document.querySelector('.tutoria-page');

        const reportPageHeight = () => {
            const height = Math.ceil(page.getBoundingClientRect().height);
            window.parent.postMessage({ type: 'tutoria-height', height }, '*');
        };

        window.addEventListener('message', (event) => {
            if (event.source !== lessonFrame.contentWindow || event.data?.type !== 'class-height') {
                return;
            }

            const height = Number(event.data.height);
            if (!Number.isFinite(height)) {
                return;
            }

            const nextHeight = `${Math.max(520, Math.ceil(height))}px`;
            if (lessonFrame.style.height !== nextHeight) {
                lessonFrame.style.height = nextHeight;
                lessonFrame.contentWindow.postMessage({ type: 'measure-class-height' }, '*');
            }
            reportPageHeight();
        });

        new ResizeObserver(reportPageHeight).observe(page);
        lessonFrame.addEventListener('load', reportPageHeight);
        window.addEventListener('load', reportPageHeight);
        window.addEventListener('resize', reportPageHeight);
    }
})();