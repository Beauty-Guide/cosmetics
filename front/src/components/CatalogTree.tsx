import React, {useEffect, useState} from 'react';
// Импорты из react-complex-tree
import {StaticTreeDataProvider, Tree, UncontrolledTreeEnvironment, useTreeItemRenderContext,} from "react-complex-tree";
// import 'react-complex-tree/lib/style.css';
import "react-complex-tree/lib/style-modern.css";

// Типы для данных
interface Catalog {
    id: number;
    name: string;
    parent: Catalog | null;
    cosmetics: any[];
}

type TreeItem = {
    index: string;
    isLeaf: boolean;
    children: string[];
    data: { label: string };
};

type TreeData = Record<string, TreeItem>;

const RenderTreeItem = () => {
    const {item, depth, isOpen, onToggle} = useTreeItemRenderContext();
    return (
        <div style={{marginLeft: depth * 16}}>
            {/* Стрелка показывается только если hasChildren */}
            {item.hasChildren && (
                <span onClick={onToggle} style={{cursor: 'pointer', marginRight: '8px'}}>
          {isOpen ? '▼' : '▶'}
        </span>
            )}

            {/* Название элемента */}
            {item.data}
        </div>
    );
};

const CatalogTree: React.FC = () => {
    // const [treeData, setTreeData] = useState<TreeData>({});
    const [isLoading, setIsLoading] = useState(true);
    const [treeData, setTreeData] = useState<Record<string, TreeItem>>({});

    // === Функция для получения данных с API ===
    const fetchCatalogs = async () => {
        try {
            const response = await fetch('http://localhost:8080/admin/catalog/getAllCatalogs');
            const data: Catalog[] = await response.json();

            const treeItems: TreeData = {};

            // Сначала добавляем все элементы как "листы"
            data.forEach(item => {
                treeItems[item.id.toString()] = {
                    index: item.id.toString(),
                    // isLeaf: item.cosmetics.length === 0, TODO
                    isLeaf: true,
                    children: [],
                    data: {label: item.name},
                };
            });

            // Затем связываем родителей и детей
            data.forEach(item => {
                if (item.parent) {
                    const parentId = item.parent.id.toString();
                    const currentId = item.id.toString();

                    if (treeItems[parentId]) {
                        treeItems[parentId].children.push(currentId);
                        treeItems[parentId].isLeaf = false; // Если у элемента есть дети, он не лист
                    }
                }
            });

            // Определяем корневые узлы
            const rootNodes = data
                .filter(item => item.parent === null)
                .map(item => item.id.toString());

            // Создаем дерево с корневым узлом
            const fullTree: TreeData = {
                ...treeItems,
                root: {
                    index: 'root',
                    isLeaf: false,
                    children: rootNodes,
                    data: {label: 'Root'},
                },
            };

            // === Построим нужную нам структуру ===
            const customNestedTree = convertToCustomNestedStructure(fullTree, 'root');
            const finalResult = customNestedTree?.Root || {};

            console.log("@@@@@" + fullTree)
            console.log("@@@@@2" + finalResult)
            const processed = readTemplate(finalResult); // вернёт { items: { root: ..., '1': ..., ... } }
            setTreeData(processed.items);

        } catch (error) {
            console.error('Ошибка при загрузке каталогов:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const readTemplate = (template: any) => {
        const items: Record<string, any> = {};

        const buildItems = (node: any, parentId: string | null) => {
            for (const [key, value] of Object.entries(node)) {
                console.log(items)
                const isFolder = value !== null;
                items[key] = {
                    index: key,
                    canMove: true,
                    isFolder: isFolder,
                    data: {label: key},
                    canRename: true,
                    children: isFolder ? Object.keys(value as object) : [],
                };

                if (isFolder) {
                    buildItems(value, key);
                }
            }
        };

        buildItems(template, null);

        // Добавляем корневой узел
        const rootKey = 'root';
        items[rootKey] = {
            index: rootKey,
            canMove: true,
            isFolder: true,
            data: {label: 'Root'},
            children: Object.keys(template),
            canRename: true,
        };

        return {items};
    };
    const updateCatalogParent = async (catalogId: number, newParentId: number | null) => {
        try {
            await fetch(`http://localhost:8080/admin/catalog/${catalogId}/setParent`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({parentId: newParentId}),
            });
            console.log(`Catalog ${catalogId} updated to parent ${newParentId}`);
        } catch (error) {
            console.error('Ошибка при обновлении родителя каталога:', error);
        }
    };

    const handleDrop = (
        sourceItem: any,
        targetItem: any,
        relativeIndex?: number,
        targetIndex?: string
    ) => {
        // Получаем ID элемента и нового родителя
        console.log(sourceItem)
        console.log(targetItem)
        const catalogId = parseInt(sourceItem.index, 10);

        let newParentId = null;
        if (targetItem && targetItem.index !== 'root') {
            newParentId = parseInt(targetItem.index, 10);
        }

        // Отправляем PATCH-запрос на бэкенд
        // updateCatalogParent(catalogId, newParentId);
        fetchCatalogs()
    };

    // === Функция преобразования в нужную структуру ===
    const convertToCustomNestedStructure = (
        treeData: TreeData,
        nodeId: string
    ): Record<string, any> | null => {
        const node = treeData[nodeId];
        if (!node) return null;

        const key = node.data.label;

        if (node.isLeaf) {
            return {[key]: null};
        }

        const children: Record<string, any> = {};
        node.children.forEach(childId => {
            console.log("treeData" + treeData)
            console.log("childId" + childId)
            const child = convertToCustomNestedStructure(treeData, childId);
            if (child) {
                Object.entries(child).forEach(([childKey, value]) => {
                    children[childKey] = value;
                });
            }
        });
        console.log("KEY" + {[key]: children['index']})
        return {[key]: children};
    };

    useEffect(() => {
        console.log("useEffect")
        fetchCatalogs();
    }, []);

    if (isLoading || !treeData) {
        return <div>Загрузка...</div>;
    }

    return (
        <UncontrolledTreeEnvironment
            dataProvider={
                new StaticTreeDataProvider(treeData, (item, data) => ({
                    ...item,
                    data,
                }))
            }
            getItemTitle={(item) => item.data?.label || 'Без названия'}
            canDragAndDrop={true}
            canReorderItems={true}
            canDropOnFolder={true}
            canDropOnNonFolder={false}
            onDrop={handleDrop}
            viewState={{}}
        >
            <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example"/>
        </UncontrolledTreeEnvironment>
    );
};

export default CatalogTree;