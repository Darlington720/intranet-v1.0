import { createSlice } from "@reduxjs/toolkit";
import { url2 } from "app/configs/apiConfig";
import { rootReducer } from "app/store/lazyLoadedSlices";

const initialState = {
  activeBooth: null,
  activeTab: "booth", // Use string identifiers instead of numbers
  options: [],
  selectedOption: {
    student_no: "",
  },
  imagePreview: `${url2}/student_photo/0`,
  staffImagePreview: `${url2}/staff_photo/0`,
  imageToUpload: null,
  recentUploads: [],
  selectedRow: null,
  images: [],
  staffImages: [],
  imageTimestamp: Date.now(),
  staffImageTimestamp: Date.now(),
  selectedStaff: {
    staff_id: "",
  }
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
    setStaffImagePreview: (state, action) => {
      state.staffImagePreview = action.payload;
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
    setImageTimestamp: (state, action) => {
      state.imageTimestamp = action.payload;
    },
    setSelectedStaff: (state, action) => {
      state.selectedStaff = action.payload;
    },
    setStaffImageTimestamp: (state, action) => {
      state.staffImageTimestamp = action.payload;
    },
    setStaffImages: (state, action) => {
      state.staffImages = action.payload;
    },
  },
  selectors: {
    selectActiveBooth: (state) => state.activeBooth,
    selectActiveTab: (state) => state.activeTab,
    selectOptions: (state) => state.options,
    selectSelectedOption: (state) => state.selectedOption,
    selectImagePreview: (state) => state.imagePreview,
    selectStaffImagePreview: (state) => state.staffImagePreview,
    selectImageToUpload: (state) => state.imageToUpload,
    selectRecentUploads: (state) => state.recentUploads,
    selectSelectedRow: (state) => state.selectedRow,
    selectImages: (state) => state.images,
    selectImageTimestamp: (state) => state.imageTimestamp,
    selectSelectedStaff: (state) => state.selectedStaff,
    selectStaffImageTimestamp: (state) => state.staffImageTimestamp,
    selectStaffImages: (state) => state.staffImages,

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
  setStaffImagePreview,
  setImageToUpload,
  setRecentUploads,
  setSelectedRow,
  setImages,
  setImageTimestamp,
  setSelectedStaff,
  setStaffImageTimestamp,
  setStaffImages,
} = photosSlice.actions;
export const {
  selectActiveBooth,
  selectActiveTab,
  selectOptions,
  selectSelectedOption,
  selectImagePreview,
  selectStaffImagePreview,
  selectImageToUpload,
  selectRecentUploads,
  selectSelectedRow,
  selectImages,
  selectImageTimestamp,
  selectSelectedStaff,
  selectStaffImageTimestamp,
  selectStaffImages,
} = injectedSlice.selectors;
export default photosSlice.reducer;
