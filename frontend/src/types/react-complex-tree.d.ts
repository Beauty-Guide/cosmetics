declare module "react-complex-tree" {
    import React from "react";

    export interface TreeProps {
        treeId: string;
        rootIds: string[];
        getChildren: (nodeId: string) => Promise<string[]>;
        renderNode: (props: {
            node: {
                id: string;
                data: any;
            };
            depth: number;
            isOpen: boolean;
            isSelected: boolean;
            getNodeProps: (props: { style?: React.CSSProperties }) => any;
        }) => React.ReactNode;
        selectedIds: string[];
        expandedIds: string[];
        onExpandedIdsChange: (ids: string[]) => void;
    }

    export const Tree: React.FC<TreeProps>;
}