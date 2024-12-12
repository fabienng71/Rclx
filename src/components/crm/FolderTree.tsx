import React from 'react';
import { ChevronRight, ChevronDown, Folder, FolderOpen } from 'lucide-react';
import { cn } from '../../utils/cn';
import type { Folder as FolderType } from '../../types/crm';

interface FolderTreeProps {
  folders: FolderType[];
  selectedFolderId: string;
  onSelectFolder: (folderId: string) => void;
  onCreateFolder: (parentId: string) => void;
  expandedFolders: Set<string>;
  onToggleFolder: (folderId: string) => void;
}

export function FolderTree({
  folders,
  selectedFolderId,
  onSelectFolder,
  onCreateFolder,
  expandedFolders,
  onToggleFolder,
}: FolderTreeProps) {
  const rootFolders = folders.filter(folder => !folder.parentId);

  const renderFolder = (folder: FolderType, level: number = 0) => {
    const isExpanded = expandedFolders.has(folder.id);
    const isSelected = selectedFolderId === folder.id;
    const childFolders = folders.filter(f => f.parentId === folder.id);
    const hasChildren = childFolders.length > 0;

    return (
      <div key={folder.id} className="select-none">
        <div
          className={cn(
            "flex items-center space-x-1 py-1 px-2 rounded-md cursor-pointer",
            isSelected ? "bg-indigo-100 text-indigo-900" : "hover:bg-gray-100",
          )}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => onSelectFolder(folder.id)}
        >
          {hasChildren ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFolder(folder.id);
              }}
              className="p-1 hover:bg-gray-200 rounded"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronRight className="h-4 w-4 text-gray-500" />
              )}
            </button>
          ) : (
            <span className="w-6" />
          )}
          
          {isExpanded ? (
            <FolderOpen className="h-4 w-4 text-indigo-500" />
          ) : (
            <Folder className="h-4 w-4 text-indigo-500" />
          )}
          
          <span className="text-sm">{folder.name}</span>
        </div>

        {isExpanded && hasChildren && (
          <div className="ml-4">
            {childFolders.map(childFolder => renderFolder(childFolder, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900">Folders</h3>
        <button
          onClick={() => onCreateFolder(selectedFolderId)}
          className="text-sm text-indigo-600 hover:text-indigo-900"
        >
          New Folder
        </button>
      </div>
      <div className="space-y-1">
        {rootFolders.map(folder => renderFolder(folder))}
      </div>
    </div>
  );
}