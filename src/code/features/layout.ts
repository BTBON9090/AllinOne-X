export async function handleRemoveAl(selection: readonly SceneNode[]) {
    function rm(n: SceneNode) {
        if ('layoutMode' in n && n.layoutMode && n.layoutMode !== 'NONE') {
            n.layoutMode = 'NONE';
        }
        if ('children' in n && n.children) {
            n.children.forEach(rm);
        }
    }
    selection.forEach(rm);
}

export async function handleSortLayers(selection: readonly SceneNode[]) {
    if (selection.length < 2) return;
    const parent = selection[0].parent;
    if (!selection.every(n => n.parent === parent)) {
        figma.notify("Selection must share same parent");
        return;
    }
    const sorted = [...selection].sort((a, b) => 
        (Math.abs(a.y - b.y) > 2) ? a.y - b.y : a.x - b.x
    );
    if (parent) {
        for (const node of sorted) {
            parent.appendChild(node);
        }
    }
}