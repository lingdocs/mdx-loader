module.exports = () => {
    return function(tree) {
        const t = {
            ...tree,
            children: tree.children.map(modifyChild),
        };
        return t;
    }
}

function modifyChild(child) {
    if (child.type === "heading") {
        return {
            ...child,
            children: [
                {
                    type: "jsx",
                    // PROBLEM: this only allows us to have text in heading - jsx IN the heading gets lost
                    value: `<a className="heading-link" href="#${child.data.id}">${child.children[0].value}</a>`,
                },
            ]
        };
    }
    return {
        ...child,
        ...child.children ? {
            children: child.children.map(modifyChild),
        } : {},
    };
}