
import { useState } from "react";
import { ChevronRight, ChevronDown, File, Folder } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TreeNode {
  name: string;
  path: string;
  type: "file" | "dir";
  children?: TreeNode[];
}

interface CodeExplorerProps {
  tree: TreeNode;
  onSelectFile?: (path: string) => void;
  className?: string;
}

const FileTreeNode = ({ 
  node, 
  level = 0, 
  onSelectFile 
}: { 
  node: TreeNode; 
  level?: number;
  onSelectFile?: (path: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(level < 1);
  
  const handleToggle = () => {
    if (node.type === 'dir') {
      setIsOpen(!isOpen);
    } else if (onSelectFile) {
      onSelectFile(node.path);
    }
  };

  const isDirectory = node.type === 'dir';
  
  return (
    <div>
      <div 
        className={cn(
          "flex items-center py-1 px-2 rounded-md hover:bg-primary/5 cursor-pointer transition-colors",
          !isDirectory && "hover:text-primary"
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={handleToggle}
      >
        {isDirectory ? (
          <>
            {isOpen ? (
              <ChevronDown className="w-4 h-4 mr-1 flex-shrink-0" />
            ) : (
              <ChevronRight className="w-4 h-4 mr-1 flex-shrink-0" />
            )}
            <Folder className="w-4 h-4 mr-2 text-primary/70 flex-shrink-0" />
          </>
        ) : (
          <File className="w-4 h-4 mr-2 text-muted-foreground flex-shrink-0" />
        )}
        <span className="truncate text-sm">{node.name}</span>
      </div>
      
      {isDirectory && isOpen && node.children && (
        <div className="animate-fade-in">
          {node.children.map((child, index) => (
            <FileTreeNode
              key={child.path || index}
              node={child}
              level={level + 1}
              onSelectFile={onSelectFile}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const CodeExplorer = ({ tree, onSelectFile, className }: CodeExplorerProps) => {
  return (
    <div className={cn("glass-card animate-slide-in", className)}>
      <h3 className="text-lg font-medium mb-4">Repository Files</h3>
      <div className="overflow-auto max-h-[500px] pr-2">
        <FileTreeNode node={tree} onSelectFile={onSelectFile} />
      </div>
    </div>
  );
};

export default CodeExplorer;
