import { createSlice } from "@reduxjs/toolkit";
import { rootReducer } from "app/store/lazyLoadedSlices";

const initialState = {
  activeBooth: null,
  activeTab: "booth", // Use string identifiers instead of numbers
  options: [],
  selectedOption: {
    student_no: "",
  },
  imagePreview: `http://tredumo.com/api/student_image/0`,
  imageToUpload: null,
  recentUploads: [],
  selectedRow: null,
  images: []
};
/**
 * The File Manager App slice.
 */
export const photosSlice = createSlice({
  name: "photos",
  initialState,
  reducers: {
    setActiveBooth: (state, action) => {
      state.activeBooth = action.payload;
      // Reset activeTab when changing booth
      state.activeTab = "booth"; // Reset to the first tab
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setStdOptions: (state, action) => {
      state.options = action.payload;
    },
    setSelectedOption: (state, action) => {
      state.selectedOption = action.payload;
    },
    setImagePreview: (state, action) => {
      state.imagePreview = action.payload;
    },
    setImageToUpload: (state, action) => {
      state.imageToUpload = action.payload;
    },
    setRecentUploads: (state, action) => {
      state.recentUploads = action.payload;
    },
    setSelectedRow: (state, action) => {
      state.selectedRow = action.payload;
    },
    setImages: (state, action) => {
      state.images = action.payload;
    },
  },
  selectors: {
    selectActiveBooth: (state) => state.activeBooth,
    selectActiveTab: (state) => state.activeTab,
    selectOptions: (state) => state.options,
    selectSelectedOption: (state) => state.selectedOption,
    selectImagePreview: (state) => state.imagePreview,
    selectImageToUpload: (state) => state.imageToUpload,
    selectRecentUploads: (state) => state.recentUploads,
    selectSelectedRow: (state) => state.selectedRow,
    selectImages: (state) => state.images,
  },
});
/**
 * Lazy load
 * */
rootReducer.inject(photosSlice);
const injectedSlice = photosSlice.injectInto(rootReducer);
export const {
  setActiveBooth,
  setActiveTab,
  setStdOptions,
  setSelectedOption,
  setImagePreview,
  setImageToUpload,
  setRecentUploads,
  setSelectedRow,
  setImages
} = photosSlice.actions;
export const {
  selectActiveBooth,
  selectActiveTab,
  selectOptions,
  selectSelectedOption,
  selectImagePreview,
  selectImageToUpload,
  selectRecentUploads,
  selectSelectedRow,
  selectImages
} = injectedSlice.selectors;
export default photosSlice.reducer;
