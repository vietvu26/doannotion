import React, {useState} from 'react';
import {View} from 'react-native';
import styles from './styles';

export interface TreeNode {
  id: string;
  children?: TreeNode[];
  [key: string]: any;
}

interface TreeViewProps {
  data: TreeNode[];
  level?: number;
  maxLevel?: number;
  parentIdField?: string;
  renderNode: (
    node: TreeNode,
    level: number,
    isLast: boolean,
  ) => React.ReactNode;
}

const TreeView = ({
  data,
  level = 0,
  maxLevel,
  parentIdField,
  renderNode,
}: TreeViewProps) => {
  const flatChildren = (nodes: TreeNode[]): TreeNode[] =>
    nodes.flatMap(node => [
      {...node, children: undefined},
      ...(node.children ? flatChildren(node.children) : []),
    ]);

  const limitDepth = (nodes: TreeNode[], maxLevel: number): TreeNode[] => {
    const walk = (node: TreeNode, level: number): TreeNode => {
      if (level >= maxLevel - 1) {
        const kids = node.children ? flatChildren(node.children) : [];
        return {...node, children: kids.length ? kids : undefined};
      }
      return {...node, children: node.children?.map(c => walk(c, level + 1))};
    };
    return nodes.map(n => walk(n, 0));
  };

  const buildDataTree = (items: TreeNode[], parentIdField?: string): TreeNode[] => {
    const nodeMap: Record<string, TreeNode> = {};
    items.forEach(item => (nodeMap[item.id] = {...item}));
    const roots: TreeNode[] = [];
    items.forEach(item => {
      const parentId = parentIdField ? item[parentIdField] : undefined;
      if (parentId && typeof parentId === 'string' && nodeMap[parentId]) {
        const p = nodeMap[parentId];
        p.children = p.children || [];
        p.children.push(nodeMap[item.id]);
      } else {
        roots.push(nodeMap[item.id]);
      }
    });
    return roots;
  };

  const processedData = (() => {
    if (level === 0) {
      const tree = buildDataTree(data, parentIdField);
      return maxLevel !== undefined ? limitDepth(tree, maxLevel) : tree;
    }
    return data;
  })();

  const [firstChildTop, setFirstChildTop] = useState<number | null>(null);
  const [lastChildBottom, setLastChildBottom] = useState<number | null>(null);

  return (
    <View style={{position: 'relative'}}>
      {processedData.length > 1 &&
        firstChildTop !== null &&
        lastChildBottom !== null && (
          <View
            style={[
              styles.siblingConnector,
              {
                top: firstChildTop,
                height: lastChildBottom - firstChildTop,
              },
            ]}
          />
        )}

      {processedData.map((node, index) => {
        const hasChildren = !!node.children && node.children.length > 0;

        const isLast = index === processedData.length - 1;

        return (
          <View
            key={node.id}
            style={{marginTop: 12}}
            onLayout={e => {
              const {y} = e.nativeEvent.layout;
              if (index === 0) setFirstChildTop(y + 16);
              if (isLast) setLastChildBottom(y);
            }}>
            <View style={{flexDirection: 'row'}}>
              {level > 0 && <View style={styles.connerBlock} />}
              {hasChildren && <View style={styles.inserVertical} />}
              <View style={{flex: 1}}>{renderNode(node, level, isLast)}</View>
            </View>

            {hasChildren && (
              <View style={{marginLeft: 40}}>
                <TreeView
                  data={node.children!}
                  level={level + 1}
                  maxLevel={maxLevel}
                  parentIdField={parentIdField}
                  renderNode={renderNode}
                />
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
};

export default TreeView;
