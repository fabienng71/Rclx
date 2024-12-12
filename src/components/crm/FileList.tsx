import React from 'react';
import { FileText, Image, FileSpreadsheet, File, MoreVertical, Download, Pencil, Trash2 } from 'lucide-react';
import { formatDate } from '../../utils/format';
import type { File as FileType } from '../../types/crm';

interface FileListProps {
  files: FileType[];
  onRename: (fileId: string) => void;
  onDelete: (fileId: string) => void;
  onDownload: (fileId: string) => void;
}

const FILE_ICONS = {
  'application/pdf': FileText,
  'application/msword': FileText,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': FileText,
  'application/vnd.ms-excel': FileSpreadsheet,
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': FileSpreadsheet,
  'application/vnd.ms-powerpoint': File,
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': File,
  'image/jpeg': Image,
  'image/png': Image,
} as const;

export function FileList({ files, onRename, onDelete, onDownload }: FileListProps) {
  const [menuOpen, setMenuOpen] = React.useState<string | null>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);

  const getFileIcon = (type: string) => {
    const Icon = FILE_ICONS[type as keyof typeof FILE_ICONS] || FileText;
    return <Icon className="h-5 w-5" />;
  };

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuOpen && !(event.target as Element).closest('.file-menu')) {
        setMenuOpen(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  // Adjust menu position if it goes off-screen
  React.useEffect(() => {
    if (menuOpen && menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      if (rect.right > viewportWidth) {
        menuRef.current.style.left = 'auto';
        menuRef.current.style.right = '0';
      }

      if (rect.bottom > viewportHeight) {
        menuRef.current.style.top = 'auto';
        menuRef.current.style.bottom = '100%';
      }
    }
  }, [menuOpen]);

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="min-w-full divide-y divide-gray-200">
        {files.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No files in this folder
          </div>
        ) : (
          <div className="bg-white">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center px-6 py-4 hover:bg-gray-50"
              >
                <div className="flex-shrink-0 text-gray-400">
                  {getFileIcon(file.type)}
                </div>
                <div className="ml-4 flex-1">
                  <div className="text-sm font-medium text-gray-900">
                    {file.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    Uploaded {formatDate(file.uploadedAt)} by {file.uploadedBy}
                  </div>
                </div>
                <div className="relative file-menu">
                  <button
                    onClick={() => setMenuOpen(menuOpen === file.id ? null : file.id)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <MoreVertical className="h-5 w-5 text-gray-400" />
                  </button>
                  
                  {menuOpen === file.id && (
                    <div 
                      ref={menuRef}
                      className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
                      style={{ zIndex: 50 }}
                    >
                      <div className="py-1" role="menu">
                        <button
                          onClick={() => {
                            onDownload(file.id);
                            setMenuOpen(null);
                          }}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          <Download className="h-4 w-4 mr-3" />
                          Download
                        </button>
                        <button
                          onClick={() => {
                            onRename(file.id);
                            setMenuOpen(null);
                          }}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          <Pencil className="h-4 w-4 mr-3" />
                          Rename
                        </button>
                        <button
                          onClick={() => {
                            onDelete(file.id);
                            setMenuOpen(null);
                          }}
                          className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                        >
                          <Trash2 className="h-4 w-4 mr-3" />
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}