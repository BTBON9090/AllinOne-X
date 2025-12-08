export async function handleUpOne(selection: readonly SceneNode[]) {
    const arr: SceneNode[] = [];
    selection.forEach(n => {
        if (n.parent && n.parent.parent) {
            n.parent.parent.appendChild(n);
            arr.push(n);
        }
    });
    if (arr.length > 0) {
        figma.currentPage.selection = arr;
    }
}

export async function handleUpAll(selection: readonly SceneNode[]) {
    const arr: SceneNode[] = [];
    selection.forEach(n => {
        figma.currentPage.appendChild(n);
        arr.push(n);
    });
    figma.currentPage.selection = arr;
}

export async function handleUngroupAll(selection: readonly SceneNode[]) {
    for (const n of selection) {
        if ('findAll' in n) {
            let gs = n.findAll(x => x.type === 'GROUP');
            while (gs.length > 0) {
                gs.forEach(g => {
                    if (g.type === 'GROUP' && !('removed' in g && g.removed)) {
                        figma.ungroup(g as GroupNode);
                    }
                });
                gs = n.findAll(x => x.type === 'GROUP');
            }
        }
    }
}

export async function handleUnlockAll(selection: readonly SceneNode[]) {
    function ul(n: SceneNode) {
        if ('locked' in n) n.locked = false;
        if ('children' in n && n.children) n.children.forEach(ul);
    }
    selection.forEach(ul);
}

export async function handleDetachAll(selection: readonly SceneNode[]) {
    for (const n of selection) {
        if ('findAll' in n) {
            const instances = n.findAll(x => x.type === 'INSTANCE');
            instances.forEach(inst => (inst as InstanceNode).detachInstance());
        }
    }
}

export async function handleRemoveHidden(selection: readonly SceneNode[]) {
    for (const n of selection) {
        if ('findAll' in n) {
            const hiddenNodes = n.findAll(x => !x.visible);
            hiddenNodes.forEach(node => node.remove());
        }
    }
}