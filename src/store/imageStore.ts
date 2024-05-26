import {create} from "zustand";

interface ImageStore {
  isOpen: boolean;
  images: string[]; // Array of image URLs or paths
  imageIndex: number;
  openModal: () => void;
  closeModal: () => void;
  setImagesModal: (photos: string[]) => void;
  setImageIndex: (index: number) => void;
}

export const useImageStore = create<ImageStore>((set) => ({
  isOpen: false, // Initial state for isOpen
  images: [], // Initial empty image array
  imageIndex: 0,
  openModal: () => set((state) => ({ isOpen: true })),
  closeModal: () => set((state) => ({ isOpen: false })),
  setImagesModal: (photos: string[]) => set((state) => ({ images: photos })),
  setImageIndex: (index: number) => set((state) => ({ imageIndex: index}))
}));
