export async function handleToFrame(selection: readonly SceneNode[]) {
    const newSelection: SceneNode[] = [];
    if (selection.length === 0) return;
    for (const node of selection) {
        const frame = figma.createFrame();
        frame.x = node.x;
        frame.y = node.y;
        frame.resize(node.width, node.height);
        if ('rotation' in node) {
            frame.rotation = node.rotation;
        }
        frame.name = node.name;
        if ('fills' in node) frame.fills = node.fills;
        if ('effects' in node) frame.effects = node.effects;
        if ('opacity' in node) frame.opacity = node.opacity;
        if ('blendMode' in node) frame.blendMode = node.blendMode;
        if ('strokes' in node) {
            frame.strokes = node.strokes;
            frame.strokeWeight = node.strokeWeight;
            frame.strokeAlign = node.strokeAlign;
        }
        if ('cornerRadius' in node && node.cornerRadius !== figma.mixed && typeof node.cornerRadius === 'number') {
            frame.cornerRadius = node.cornerRadius;
        }
        if ('cornerSmoothing' in node) frame.cornerSmoothing = node.cornerSmoothing;
        if (node.parent) {
            node.parent.appendChild(frame);
            if (frame.parent) {
                frame.parent.insertChild(frame.parent.children.indexOf(node), frame);
            }
        }
        if ('children' in node) {
            for (const c of node.children) frame.appendChild(c);
        }
        node.remove();
        newSelection.push(frame);
    }
    figma.currentPage.selection = newSelection;
}

export async function handleToRect(selection: readonly SceneNode[]) {
    const newSelection: SceneNode[] = [];
    for (const node of selection) {
        if (node.type === "FRAME" || node.type === "GROUP") {
            const r = figma.createRectangle();
            r.x = node.x;
            r.y = node.y;
            r.resize(node.width, node.height);
            if ('rotation' in node) {
                r.rotation = node.rotation;
            }
            r.name = node.name;
            r.opacity = node.opacity;
            r.blendMode = node.blendMode;
            if ('fills' in node && node.fills !== figma.mixed) r.fills = node.fills;
            if ('effects' in node) r.effects = node.effects;
            if ('strokes' in node) {
                r.strokes = node.strokes;
                r.strokeWeight = node.strokeWeight;
                r.strokeAlign = node.strokeAlign;
            }
            if ('cornerRadius' in node && node.cornerRadius !== figma.mixed && typeof node.cornerRadius === 'number') {
                r.cornerRadius = node.cornerRadius;
            }
            if ('cornerSmoothing' in node) r.cornerSmoothing = node.cornerSmoothing;
            if (node.parent) {
                node.parent.appendChild(r);
                if (node.parent) {
                    node.parent.insertChild(node.parent.children.indexOf(node), r);
                }
            }
            node.remove();
            newSelection.push(r);
        }
    }
    if (newSelection.length > 0) {
        figma.currentPage.selection = newSelection;
    }
}

export async function handleSwapFs(_selection: readonly SceneNode[]) {
    // 实现Frame和Shape互换功能
    // 这里需要根据实际需求实现具体逻辑
    console.log("handleSwapFs function called");
}

export async function handleResetImage(_selection: readonly SceneNode[]) {
    // 实现重置图片功能
    // 这里需要根据实际需求实现具体逻辑
    console.log("handleResetImage function called");
}