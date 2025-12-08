export async function handleJoinText(selection: readonly SceneNode[]) {
    if (selection.length < 2) {
        figma.notify("Select at least 2 text layers");
        return;
    }
    const textNodes = selection.filter(n => n.type === "TEXT") as TextNode[];
    if (textNodes.length < 2) {
        figma.notify("No text layers selected");
        return;
    }
    textNodes.sort((a, b) => (Math.abs(a.y - b.y) > 5) ? a.y - b.y : a.x - b.x);
    let font = textNodes[0].fontName;
    if (font === figma.mixed) font = textNodes[0].getRangeFontName(0, 1) as FontName;
    try {
        await figma.loadFontAsync(font as FontName);
    } catch (e) {
        figma.notify("Load font failed");
        return;
    }
    const combinedText = textNodes.map(n => n.characters).join('\n');
    const newText = textNodes[0].clone();
    newText.characters = combinedText;
    newText.textAutoResize = "HEIGHT";
    for (let i = 1; i < textNodes.length; i++) {
        textNodes[i].remove();
    }
    figma.currentPage.selection = [newText];
}

export async function handleSplitText(selection: readonly SceneNode[]) {
    if (selection.length === 0) return;
    const newSelection: SceneNode[] = [];
    for (const node of selection) {
        if (node.type !== "TEXT") continue;
        const textNode = node as TextNode;
        const lines = textNode.characters.split(/\r\n|\r|\n/);
        if (lines.length <= 1) continue;
        let font = textNode.fontName;
        if (font === figma.mixed) font = textNode.getRangeFontName(0, 1) as FontName;
        try {
            await figma.loadFontAsync(font as FontName);
        } catch (e) {
            continue;
        }
        let curY = textNode.y;
        if (!textNode.parent) continue;
        for (const line of lines) {
            if (!line.trim()) continue;
            const t = textNode.clone();
            t.characters = line;
            t.textAutoResize = "WIDTH_AND_HEIGHT";
            t.y = curY;
            textNode.parent.appendChild(t);
            newSelection.push(t);
            curY += t.height + 10;
        }
        textNode.remove();
    }
    if (newSelection.length > 0) {
        figma.currentPage.selection = newSelection;
    }
}

export async function handleRenameContent(selection: readonly SceneNode[]) {
    for (const node of selection) {
        let newName = "";
        if (node.type === "TEXT") {
            newName = (node as TextNode).characters;
        } else if ('findOne' in node) {
            const t = node.findOne(n => n.type === "TEXT") as TextNode | null;
            if (t) newName = t.characters;
        }
        if (newName) {
            if (newName.length > 20) newName = newName.substring(0, 20) + "...";
            node.name = newName;
        }
    }
}

export async function handleSelectText(selection: readonly SceneNode[]) {
    const allTextNodes: TextNode[] = [];
    
    // 遍历选择的节点及其子节点
    for (const node of selection) {
        if (node.type === "TEXT") {
            allTextNodes.push(node as TextNode);
        } else if ('children' in node && 'findAll' in node) {
            const textNodes = node.findAll((n: SceneNode) => n.type === "TEXT") as TextNode[];
            allTextNodes.push(...textNodes);
        }
    }
    
    // 如果没有选择节点，搜索整个页面
    if (selection.length === 0) {
        const textNodes = figma.currentPage.findAll((n: SceneNode) => n.type === "TEXT") as TextNode[];
        allTextNodes.push(...textNodes);
    }
    
    if (allTextNodes.length > 0) {
        figma.currentPage.selection = allTextNodes;
        figma.notify(`Selected ${allTextNodes.length} text layers`);
    } else {
        figma.notify("No text layers found");
    }
}