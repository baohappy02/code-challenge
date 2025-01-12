// @Input: File
// @Output: MB
export const calculateFileSizeInMB = (file: File): number => {
  const fileSizeInBytes = file.size;
  const fileSizeInMB = fileSizeInBytes / (1024 * 1024); // Convert to MB
  return fileSizeInMB;
};
