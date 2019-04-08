class LazyLoader {
    constructor(options) {
        const defaults = {
            classNames: {
                listen: "js-lazy--listen",
                observed: "js-lazy--observed",
                initialized: "js-lazy--initialized"
            },
            once: true,
            onShow: null,
            target: null,
            observerOption: {
                rootMargin: "200px 200px 200px 200px"
            }
        };

        this.options = {...defaults, ...options};
    };

    getOptions = () => {
        return this.options;
    };

    getObserver = () => {
        return new IntersectionObserver(this.observerCallback(), this.options.observerOption);
    };

    observerCallback = () => {
        return ((entries, observer) => {
            entries.forEach(entry => {
                const isVisible = entry.intersectionRatio > 0;

                if (isVisible) {
                    const entryClassList = entry.target.classList;
                    entryClassList.remove(this.options.classNames.listen);
                    entryClassList.add(this.options.classNames.observed);

                    this.options.onShow?.(entry.target);

                    entryClassList.remove(this.options.classNames.observed);
                    entryClassList.add(this.options.classNames.initialized);

                    if (this.options.once) {
                        observer.unobserve(entry.target);
                    }
                }
            });
        });
    };

    observe = () => {
        this.observer = this.getObserver();
        const target = this.options.target;

        if (typeof target === "string") {
            const nodes = document.querySelectorAll(target);
            nodes.forEach(node => {
                node.classList.add(this.options.classNames.listen);
                this.observer.observe(node);
            });
        } else {
            console.error("Unsupported type for target");
        }
    };
}

module.exports = function () {
    const selector = ".tab-pane";

    const observer = new LazyLoader({
        target: selector,
        onShow: function (node) {
            console.log(node);
        }
    });

    observer.observe();
};
