import Breadcrumbs from "@mui/material/Breadcrumbs";
import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { useDispatch } from "react-redux";
import { setActiveBooth } from "../store/photosSlice";
import { ArrowLeft } from "lucide-react";

function DemoHeader() {
  const dispatch = useDispatch();
  const onLeftSidebarToggle = () => {
    dispatch(setActiveBooth(null));
  };
  return (
    <div className="flex flex-col w-full sm:py-10 sm:px-40">
      <div>
        <div className="flex sm:hidden" />
      </div>
      <div className="flex items-center w-full mt-8 -mx-10">
        <div className="flex shrink-0 items-center">
          <IconButton onClick={onLeftSidebarToggle} aria-label="toggle sidebar">
            <ArrowLeft
              size={35}
              style={{ color: "black", fontWeight: "bolder" }}
            />
          </IconButton>
        </div>

        <Typography
          component="h2"
          className="flex-1 text-3xl md:text-4xl font-extrabold tracking-tight leading-7 sm:leading-10 truncate mx-10"
        >
          Back to Main Menu
        </Typography>
      </div>
    </div>
  );
}

export default DemoHeader;
