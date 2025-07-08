import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import _ from "@lodash";
import Button from "@mui/material/Button";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { Icon } from "@iconify/react";
import { url2 } from "app/configs/apiConfig";

// import { getProjects, selectProjects } from "./store/projectsSlice";

const formatDateString = (timestamp) => {
  if (!timestamp || isNaN(timestamp) || timestamp <= 0) {
    return "Invalid Date";
  }

  const date = new Date(timestamp);

  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }

  const options = {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);

  const [weekday, month, day, year, time] = formattedDate.split(" ");

  const ampm = date.getHours() >= 12 ? "PM" : "AM";

  return `${weekday}-${month}-${day}-${year} ${time} ${ampm}`
    .replace(/,/g, "")
    .toUpperCase();
};

function ProjectDashboardAppHeader(props) {
  // const dispatch = useDispatch();
  // const projects = useSelector(selectProjects);
  const projects = [
    {
      id: 1,
      name: "Home",
    },
  ];
  const user = useSelector((state) => state.user.user);

  const [selectedProject, setSelectedProject] = useState({
    id: 1,
    menuEl: null,
  });

  // useEffect(() => {
  //   dispatch(getProjects());
  // }, [dispatch]);

  function handleChangeProject(id) {
    setSelectedProject({
      id,
      menuEl: null,
    });
  }

  function handleOpenProjectMenu(event) {
    setSelectedProject({
      id: selectedProject.id,
      menuEl: event.currentTarget,
    });
  }

  function handleCloseProjectMenu() {
    setSelectedProject({
      id: selectedProject.id,
      menuEl: null,
    });
  }

  if (_.isEmpty(projects)) {
    return null;
  }

  return (
    <div className="flex flex-col w-full px-24 sm:px-32">
      <div className="flex flex-col sm:flex-row flex-auto sm:items-center min-w-0 my-32 sm:my-48">
        <div className="flex flex-auto items-center min-w-0">
          <Avatar
            className="flex-0 w-80 h-80"
            alt="user photo"
            // src={user?.data?.photoURL}
            src={`${url2}/staff_photo/${user?.biodata?.staff_id}`}
          >
            {user?.data?.displayName[0]}
          </Avatar>
          <div className="flex flex-col min-w-0 mx-16">
            <Typography className="text-2xl md:text-5xl font-semibold tracking-tight leading-7 md:leading-snug truncate">
              {`Welcome back, ${user?.biodata?.salutation} ${user?.biodata?.surname} ${user?.biodata?.other_names}!`}
            </Typography>

            <div className="flex items-center">
              <Typography
                className="mx-6 leading-6 truncate"
                color="text.secondary"
                style={{
                  fontSize: 16,
                }}
              >
                Last logged in:{" "}
                {formatDateString(
                  parseInt(
                    user.last_logged_in[0]
                      ? user.last_logged_in[0].logged_in
                      : "_"
                  )
                )}
              </Typography>
            </div>
          </div>
        </div>
        <div className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12">
          <Button
            className="whitespace-nowrap"
            variant="contained"
            color="primary"
            startIcon={<Icon icon="pajamas:messages" width="16" height="16" />}
          >
            Messages
          </Button>
          <Button
            className="whitespace-nowrap"
            variant="contained"
            color="secondary"
            startIcon={
              <Icon
                icon="material-symbols:settings-outline-rounded"
                width="16"
                height="16"
              />
            }
          >
            Settings
          </Button>
        </div>
      </div>
      <div className="flex items-center">
        <Button
          onClick={handleOpenProjectMenu}
          className="flex items-center border border-solid border-b-0 rounded-t-xl rounded-b-0 h-40 px-16 text-13 sm:text-16"
          variant="default"
          sx={{
            backgroundColor: (theme) => theme.palette.background.default,
            borderColor: (theme) => theme.palette.divider,
          }}
          endIcon={
            <FuseSvgIcon size={20} color="action">
              heroicons-solid:chevron-down
            </FuseSvgIcon>
          }
        >
          {_.find(projects, ["id", selectedProject.id]).name}
        </Button>
        {/* <Menu
          id="project-menu"
          anchorEl={selectedProject.menuEl}
          open={Boolean(selectedProject.menuEl)}
          onClose={handleCloseProjectMenu}
        > */}
        {/* {projects &&
            projects.map((project) => (
              <MenuItem
                key={project.id}
                onClick={(ev) => {
                  handleChangeProject(project.id);
                }}
              >
                {project.name}
              </MenuItem>
            ))} */}
        {/* </Menu> */}
      </div>
    </div>
  );
}

export default ProjectDashboardAppHeader;
