import { createSlice } from "@reduxjs/toolkit";
import { rootReducer } from "app/store/lazyLoadedSlices";

const initialState = {
  activeTab: "student_view",
  student_no: "",
  student_file: null,
  active_student_tab: "basic_data",
  activeSettingsTab: "scholarship_types",
};
/**
 * The File Manager App slice.
 */
export const registrationSlice = createSlice({
  name: "scholarships",
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setStudentNo: (state, action) => {
      state.student_no = action.payload;
    },
    setStudentFile: (state, action) => {
      state.student_file = action.payload;
    },
    setActiveStudentTab: (state, action) => {
      state.active_student_tab = action.payload;
    },
    setActiveSettingsTab: (state, action) => {
      state.selectActiveSettingsTab = action.payload;
    },
  },

  selectors: {
    selectActiveTab: (state) => state.activeTab,
    selectStudentNo: (state) => state.student_no,
    selectStudentFile: (state) => state.student_file,
    selectActiveStudentTab: (state) => state.active_student_tab,
    selectActiveSettingsTab: (state) => state.selectActiveSettingsTab,
  },
});
/**
 * Lazy load
 * */
rootReducer.inject(registrationSlice);
const injectedSlice = registrationSlice.injectInto(rootReducer);
export const {
  setActiveTab,
  setStudentNo,
  setStudentFile,
  setActiveStudentTab,
  setActiveSettingsTab,
} = registrationSlice.actions;

export const {
  selectActiveTab,
  selectStudentNo,
  selectStudentFile,
  selectActiveStudentTab,
  selectActiveSettingsTab,
} = injectedSlice.selectors;
export default registrationSlice.reducer;
