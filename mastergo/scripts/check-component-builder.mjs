import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const main = fs.readFileSync(path.join(root, 'main.ts'), 'utf8');
const ui = fs.readFileSync(path.join(root, 'ui.html'), 'utf8');

const checks = [
  ['实例逆向消息分支', main.includes("case 'component-builder-reverse'")],
  ['Frame 构建消息分支', main.includes("case 'component-builder-create'")],
  ['创建组件 API', main.includes('mg.createComponent()')],
  ['创建组件集 API', main.includes('mg.combineAsVariants(createdComponents)')],
  ['文字属性生成', main.includes("addComponentProperty(propertyName, 'TEXT'")],
  ['实例切换属性生成', main.includes("'INSTANCE_SWAP'") && main.includes('mainComponent: propertyId')],
  ['组件属性变量绑定恢复', main.includes('mg.variables.setVariableInComponent')],
  ['逆向使用副本', /clone = source\.clone\(\)[\s\S]+clone\.detachInstance\(\)/.test(main)],
  ['解绑失败安全复制降级', main.includes('materializeSceneNodeAsComponent(') && main.includes('cloneSceneNodeForReverse(')],
  ['结构彻底失败时使用视觉快照兜底', main.includes('materializeSceneNodeAsRasterComponent(') && main.includes("source.exportAsync({ format: 'PNG' })") && main.includes('mg.createImage(exported)')],
  ['逆向异步等待视觉兜底完成', main.includes('const reverseInstanceToMaster = async') && main.includes('await reverseInstanceToMaster(')],
  ['连续点击互斥保护', main.includes('let componentReverseRunning = false') && main.includes('实例逆向正在处理中')],
  ['生成与画布后处理错误隔离', /result = await reverseInstanceToMaster\([\s\S]+if \(!result\) break;[\s\S]+try \{ mg\.document\.currentPage\.selection/.test(main)],
  ['连续逆向结果自动向右避让', main.includes('boundsOverlap(candidate, item)') && main.includes('for (let attempt = 0; attempt < 100; attempt++)')],
  ['断链嵌套实例不再原样复制', main.includes('instanceHasBrokenReferences(') && main.includes('const mustMaterialize = source.type === \'INSTANCE\'')],
  ['单变体组件集创建失败降级为单组件', main.includes('组件集创建失败，已保留为单个组件母版')],
  ['属性保留数量按真实创建结果统计', main.includes('let restoredCount = 0') && main.includes('restoredCount++') && main.includes('propertyCount: restored.restoredCount')],
  ['直接读取原组件集真实子组件', main.includes("node.type === 'COMPONENT'") && main.includes('getChildren(sourceSet)')],
  ['团队库按 parentId 精确补齐真实变体', main.includes('mg.getComponentListVal()') && main.includes('sourceSetKeys.has(item.parentId)') && main.includes('mg.importComponentByKeyAsync(item.ukey)')],
  ['远端组件集按真实 mainComponent 图搜索', main.includes('discoverSourceVariantComponents') && main.includes('probe.setVariantPropertyValues({ [property.name]: option })') && main.includes('add(safeMainComponent(probe))')],
  ['变体发现不生成属性笛卡尔积', main.includes('每次只切换一个已声明值') && main.includes('不做笛卡尔积造型')],
  ['完整变体还原上限为 100', main.includes('const MAX_REVERSED_VARIANTS = 100') && !main.includes('安全还原上限 512')],
  ['本地或目录超过上限自动降级', (main.match(/return \{ variants: \[main\], overflowCount: (?:direct|catalogItems)\.length \}/g) || []).length === 2],
  ['远端探测超过上限自动降级', main.includes('overflowCount: found.size') && main.includes('overflowCountIsMinimum: true')],
  ['超限仍保留单变体组件集', main.includes('let limitVariantExpansion = false') && main.includes('if (variantProperties.length > 0 || limitVariantExpansion)')],
  ['超限视觉兜底仍进入组件集', main.includes("if (built.recoveryMode === 'raster' && !limitVariantExpansion)")],
  ['超限恢复全部原变体维度和值', main.includes('restoreLimitedVariantSchema(set, component, properties, warnings)') && main.includes('component.setVariantPropertyValues(values)')],
  ['超限不制造空组合占位组件', main.includes('其他属性组合允许保持为空') && main.includes('不为它们批量制造占位组件')],
  ['超限成功提示说明单变体组件集', main.includes('个变体超过上限 ${MAX_REVERSED_VARIANTS}，已保留为单变体组件集及原属性')],
  ['每个真实变体从原组件创建实例', main.includes('variantInstance = sourceVariant.createInstance()')],
  ['未选中变体实例化失败直接从原组件恢复', main.includes('buildReversedComponentFromSourceComponent(') && main.includes('已改从原组件结构恢复')],
  ['选中实例彻底不可读时回退原母版', main.includes('const buildReversedComponentWithMainFallback =') && (main.match(/buildReversedComponentWithMainFallback\(/g) || []).length >= 2 && main.includes('未映射到组件属性的手工覆盖可能无法保留')],
  ['不可读叶子实例生成结构占位', main.includes('const createReverseLeafPlaceholder =') && main.includes('已保留尺寸和根层样式并降级为 Frame 占位')],
  ['根实例完全不可读仍生成空组件', main.includes('已创建保留根层尺寸与样式的空组件占位') && !main.includes('无法安全生成空白母版')],
  ['嵌套实例母版 ID 全部安全读取', main.includes('const safeMainComponentId =') && (main.match(/safeMainComponent\([^\n]+\)\?\.id/g) || []).length === 1],
  ['失效节点最终错误转为中文说明', main.includes('const describeReverseFailure =') && main.includes('组件仍包含已删除的节点引用')],
  ['选中变体优先保留当前实例覆盖', main.includes('const isSelectedVariant = sameComponentIdentity(sourceVariant, main)') && /if \(isSelectedVariant\) \{[\s\S]+buildReversedComponentWithMainFallback\(\s*source,\s*sourceVariant,/.test(main)],
  ['全部真实变体一次合并', main.includes('const stagingComponents = records.map(record => record.component)')
    && main.includes('mg.combineAsVariants(stagingComponents)')],
  ['变体数量与节点身份完整性校验', main.includes('validateRestoredVariantSet(set, records, warnings)') && main.includes('actualComponents.length !== records.length') && main.includes('actualIds.has(record.component.id)')],
  ['宿主名称规范化不再误判失败', !main.includes('const sameNames') && main.includes('名称不是稳定身份') && main.includes('已按组件节点身份确认全部变体完整')],
  ['无法证明完整性时拒绝伪组件集', main.includes('无法证明其他变体完整性') && main.includes('已停止生成伪组件集')],
  ['无对应图层属性不进入组件集', main.includes('在所有还原变体中都没有对应图层') && main.includes('没有成功绑定任何图层，已删除')],
  ['缺失文字属性引用通过哨兵文本探测', main.includes('__AIO_PROP_') && main.includes("referenceKey = 'characters'") && main.includes('snapshot.characters === marker')],
  ['缺失布尔属性引用通过显隐差异探测', main.includes("referenceKey = 'isVisible'") && main.includes('after.isVisible !== snapshot.isVisible')],
  ['实例切换属性仅唯一对应时推断', main.includes("referenceKey = 'mainComponent'") && main.includes('candidates.length === 1')],
  ['行为探测不修改原实例', main.includes('probe = sourceComponent.createInstance()') && main.includes('safeRemoveNode(probe)')],
  ['源组件单值变体属性不主动删除', !main.includes('pruneRedundantVariantProperties') && !main.includes('没有区分作用的变体属性')],
  ['只恢复实际存在的变体值别名', main.includes('actualOptions.has(option)') && main.includes('editVariantPropertyValuesAlias')],
  ['失效原型目标安全过滤', main.includes('captureReactionSnapshots(') && main.includes('原型目标已不存在')],
  ['旧组件属性引用先清理', main.includes('clearComponentPropertyReferences(component, warnings)')],
  ['子层按原索引重建', main.includes('component.insertChild(childIndex, child)')],
  ['解绑前捕获实例状态', /const nodeStates = captureNodeStates\(source\)[\s\S]+clone = source\.clone\(\)/.test(main)],
  ['逆向恢复原多层顺序', main.includes('restoreTopLevelOrder(component, nodeStates)') && main.includes('父层先重排')],
  ['逆向使用绝对坐标放到右侧', main.includes('source.absoluteBoundingBox') && main.includes('bounds.x + bounds.width + 48') && main.includes('getReversePlacement(source, set.width, set.height, [set])')],
  ['全层充满布局快照恢复', main.includes('const layoutOrder = [...snapshots].sort') && !/if \(restoreLayout && snapshot\.path\.length === 1\)/.test(main) && main.includes("trySetDefined(node, 'alignSelf', snapshot.alignSelf)") && main.includes("trySetDefined(node, 'flexGrow', snapshot.flexGrow)")],
  ['Auto Layout 尺寸约束按合法上下文恢复', main.includes('const canSetAutoLayoutBounds =') && main.includes('if (canSetAutoLayoutBounds(dst))') && main.includes('if (canSetAutoLayoutBounds(node))') && !/'alignSelf', 'flexGrow', 'minWidth'/.test(main)],
  ['显隐与锁定快照恢复', main.includes("trySet(node, 'isVisible', snapshot.isVisible)") && main.includes("trySet(node, 'isLocked', snapshot.isLocked)")],
  ['属性引用目标校验', main.includes('resolveSnapshotNode(component, snapshot)')],
  ['失效实例节点降级处理', main.includes('safeNodeById(defaultValue)') && main.includes('已跳过该实例属性')],
  ['组件集合并后统一建属性', /mg\.combineAsVariants\(createdComponents\)[\s\S]+exposeBuilderPropertiesForSet\(set, exposeText, exposeInstances\)/.test(main)],
  ['组件构建器导航', ui.includes('data-nav="componentBuilder"')],
  ['组件构建器面板', ui.includes('id="componentBuilderPanel"')],
  ['逆向入口位于简易工具', ui.includes("trackAndRun('component-builder-reverse')") && ui.includes('data-key="reverse_component"')],
  ['组件构建面板不再放逆向按钮', !ui.includes('id="builderReverseBtn"')],
  ['三种构建模式', ['single', 'multiple', 'set'].every(mode => ui.includes(`data-builder-mode="${mode}"`))]
];

const checkboxTag = id => ui.match(new RegExp(`<input[^>]*id=["']${id}["'][^>]*>`, 'i'))?.[0] || '';
checks.push(
  ['文字属性默认不勾选', checkboxTag('builderExposeText') !== '' && !/\schecked(?:\s|=|>)/i.test(checkboxTag('builderExposeText'))],
  ['实例属性默认不勾选', checkboxTag('builderExposeInstances') !== '' && !/\schecked(?:\s|=|>)/i.test(checkboxTag('builderExposeInstances'))]
);

const failed = checks.filter(([, ok]) => !ok);
checks.forEach(([label, ok]) => console.log(`${ok ? '✓' : '✗'} ${label}`));
if (failed.length > 0) {
  console.error(`组件构建器静态检查失败：${failed.map(([label]) => label).join('、')}`);
  process.exit(1);
}
console.log(`组件构建器静态检查通过 (${checks.length}/${checks.length})。`);
