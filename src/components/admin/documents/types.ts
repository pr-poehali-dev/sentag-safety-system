export interface Document {
  id: number;
  title: string;
  description: string;
  iconName: string;
  fileUrl: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  createdAt: string;
  thumbnailUrl?: string;
}

export const ICON_OPTIONS = [
  'FileCheck', 'Award', 'FileText', 'ClipboardCheck', 'BookOpen', 'Shield',
  'File', 'Download', 'FileBadge', 'FileBox', 'FileStack', 'Paperclip'
];

export const DOCUMENTS_LIST_URL = 'https://functions.poehali.dev/0c6aa7f0-6f84-4a44-938f-3e2ba7024f4b';
export const DOCUMENTS_UPLOAD_URL = 'https://functions.poehali.dev/3a50767d-8e84-4ec4-aa31-c0c115ada27d';
export const DOCUMENTS_DELETE_URL = 'https://functions.poehali.dev/ed8b5498-3e46-4bd6-b0b8-8cd49df60a3d';

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader.result as string;
      resolve(base64.split(',')[1]);
    };
    reader.onerror = reject;
  });
};

export const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return bytes + ' Б';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' КБ';
  return (bytes / (1024 * 1024)).toFixed(1) + ' МБ';
};
