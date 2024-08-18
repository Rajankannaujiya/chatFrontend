import { configureStore} from "@reduxjs/toolkit";
import themeSlice from "./themeSlice";
import refreshSidebar from "./refreshSidebar";

// Combine reducers
export const store =configureStore({
    reducer:{
          themekey:themeSlice,
        refreshkey:refreshSidebar
    }
})