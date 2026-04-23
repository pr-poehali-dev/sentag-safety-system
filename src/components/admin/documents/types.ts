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

export const DOCUMENTS_LIST_URL = 'https://functions.poehali.dev/e9f38517-fbfc-4fb7-95b2-fdba619687a1';
export const DOCUMENTS_UPLOAD_URL = 'https://functions.poehali.dev/e9f38517-fbfc-4fb7-95b2-fdba619687a1';
export const DOCUMENTS_DELETE_URL = 'https://functions.poehali.dev/e9f38517-fbfc-4fb7-95b2-fdba619687a1';

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