import React, { useState } from 'react';
import { FileText, Plus, Search } from 'lucide-react';
import { useCRMStore } from '../../store/crmStore';
import { FileUploader } from '../../components/crm/FileUploader';
import { FolderTree } from '../../components/crm/FolderTree';
import { FileList } from '../../components/crm/FileList';
import { SearchBar } from '../../components/SearchBar';
import type { File, Folder } from '../../types/crm';

export function Toolkit() {
  const { files, folders, addFile, addFolder, deleteFile, renameFile } = useCRMStore();
  const [selectedFolderId, setSelectedFolderId] = useState<string>('root');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['root']));
  const [searchQuery, setSearchQuery] = useState('');

  const handleUpload = async (file: File, folderId: string) => {
    // In a real application, this would handle the actual file upload
    // For now, we'll just add it to the store
    const newFile = {
      id: crypto.randomUUID(),
      name: file.name,
      type: file.type,
      size: file.size,
      url: URL.createObjectURL(file),
      folderId,
      uploadedBy: 'Current User',
      uploadedAt: new Date().toISOString(),
    };
    
    addFile(newFile);
  };

  const handleCreateFolder = (parentId: string) => {
    const folderName = prompt('Enter folder name:');
    if (!folderName) return;

    const newFolder: Folder = {
      id: crypto.randomUUID(),
      name: folderName,
      parentId: parentId === 'root' ? null : parentId,
      createdBy: 'Current User',
      createdAt: new Date().toISOString(),
    };

    addFolder(newFolder);
    setExpandedFolders(new Set(expandedFolders.add(parentId)));
  };

  const handleToggleFolder = (folderId: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  };

  const handleRenameFile = (fileId: string) => {
    const file = files.find(f => f.id === fileId);
    if (!file) return;

    const newName = prompt('Enter new file name:', file.name);
    if (!newName) return;

    renameFile(fileId, newName);
  };

  const handleDeleteFile = (fileId: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return;
    deleteFile(fileId);
  };

  const handleDownloadFile = (fileId: string) => {
    const file = files.find(f => f.id === fileId);
    if (!file) return;

    // In a real application, this would handle the actual file download
    // For now, we'll just open the URL in a new tab
    window.open(file.url, '_blank');
  };

  const filteredFiles = files.filter(file => {
    const matchesFolder = file.folderId === selectedFolderId;
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <FileText className="h-6 w-6 text-indigo-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Marketing Tools</h2>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <div className="col-span-1">
          <FolderTree
            folders={folders}
            selectedFolderId={selectedFolderId}
            onSelectFolder={setSelectedFolderId}
            onCreateFolder={handleCreateFolder}
            expandedFolders={expandedFolders}
            onToggleFolder={handleToggleFolder}
          />
        </div>

        <div className="col-span-3 space-y-6">
          <div className="flex items-center justify-between">
            <div className="w-64">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search files..."
              />
            </div>
          </div>

          <FileUploader
            onUpload={(file) => handleUpload(file, selectedFolderId)}
            currentFolderId={selectedFolderId}
          />

          <FileList
            files={filteredFiles}
            onRename={handleRenameFile}
            onDelete={handleDeleteFile}
            onDownload={handleDownloadFile}
          />
        </div>
      </div>
    </div>
  );
}