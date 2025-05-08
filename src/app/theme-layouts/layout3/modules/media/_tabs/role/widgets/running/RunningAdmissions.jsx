import * as React from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Drawer from "@mui/material/Drawer";
import Select from "@mui/material/Select";
import ButtonComponent from "./ButtonComponent";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { motion } from "framer-motion";
import clsx from "clsx";
import TextField from "@mui/material/TextField";
import toast, { Toaster } from "react-hot-toast";
import Divider from "@mui/material/Divider";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import AddIcon from "@mui/icons-material/Add";
import { Icon } from "@iconify/react";
import { useSuspenseQuery } from "@apollo/client";
import { GET_STAFF_MEMBERS } from "app/theme-layouts/layout3/graphql/queries";
import { useDispatch } from "react-redux";
import { saveStaffMembers } from "app/store/appSlice";

// import AddRole from "./AddRole";
function createData(id, name, calories, fat, carbs, protein) {
  return {
    id,
    name,
    calories,
    fat,
    carbs,
    protein,
  };
}

const container = {
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const rows = [
  {
    role_name: "System Adminstrator",
    system_role: "Yes",
    created_by: "Joel Musiitwa",
    created_when: "22-10-06",
    status: "Active",
    updated_by: "Lubega Tasha",
    updated_when: "23-02-14",
  },
  {
    role_name: "System Administrator",
    system_role: "Yes",
    created_by: "John Doe",
    created_when: "22-10-06",
    status: "Active",
    updated_by: "Jane Smith",
    updated_when: "23-02-14",
  },
  {
    role_name: "User",
    system_role: "No",
    created_by: "Alice Johnson",
    created_when: "22-11-15",
    status: "Inactive",
    updated_by: "Bob Williams",
    updated_when: "23-03-22",
  },
  {
    role_name: "Manager",
    system_role: "Yes",
    created_by: "Eva Davis",
    created_when: "21-09-30",
    status: "Active",
    updated_by: "Michael Brown",
    updated_when: "23-01-10",
  },
  {
    role_name: "Guest",
    system_role: "No",
    created_by: "Sophie Miller",
    created_when: "22-08-18",
    status: "Active",
    updated_by: "Charlie Wilson",
    updated_when: "23-04-05",
  },
  {
    role_name: "Developer",
    system_role: "No",
    created_by: "David White",
    created_when: "22-03-02",
    status: "Active",
    updated_by: "Olivia Taylor",
    updated_when: "23-05-12",
  },
  {
    role_name: "Analyst",
    system_role: "No",
    created_by: "Ryan Green",
    created_when: "21-12-12",
    status: "Inactive",
    updated_by: "Emma Lee",
    updated_when: "23-02-28",
  },
  {
    role_name: "Support Specialist",
    system_role: "No",
    created_by: "Liam Clark",
    created_when: "22-06-08",
    status: "Active",
    updated_by: "Ava Harris",
    updated_when: "23-06-17",
  },
  {
    role_name: "Tester",
    system_role: "No",
    created_by: "Mia Turner",
    created_when: "22-04-25",
    status: "Inactive",
    updated_by: "Noah King",
    updated_when: "23-01-03",
  },
  {
    role_name: "Designer",
    system_role: "No",
    created_by: "Sophia Adams",
    created_when: "21-07-01",
    status: "Active",
    updated_by: "Jackson Wright",
    updated_when: "23-07-22",
  },
  {
    role_name: "Auditor",
    system_role: "No",
    created_by: "Aiden Moore",
    created_when: "22-01-09",
    status: "Active",
    updated_by: "Scarlett Turner",
    updated_when: "23-08-08",
  },
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const columns = [
  { id: "role_name", label: "Role", minWidth: 10 },
  {
    id: "system_role",
    numeric: false,
    // disablePadding: true,
    label: "System Role",
  },
  {
    id: "created_by",
    numeric: false,
    disablePadding: false,
    label: "Created By",
  },
  {
    id: "created_when",
    numeric: false,
    disablePadding: false,
    label: "Created when",
  },
  {
    id: "status",
    numeric: false,
    disablePadding: false,
    label: "Status",
  },
  {
    id: "updated_by",
    numeric: false,
    disablePadding: false,
    label: "Updated By",
  },
  {
    id: "updated_when",
    numeric: false,
    disablePadding: false,
    label: "Updated When",
  },
];

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        {columns.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
            style={{
              // border: "1px solid #ddd",
              // padding: "8px",
              textAlign: "left",
            }}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar({ onAddUserButtonClick }) {
  // const { numSelected } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
      }}
    >
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={12} sm={6}>
          <div style={{ display: "flex", gap: "5px" }}>
            <ButtonComponent />
            <Button
              variant="contained"
              onClick={onAddUserButtonClick}
              startIcon={<AddIcon />} // Add icon to the left of the button text
            >
              Add Role
            </Button>
          </div>
        </Grid>
      </Grid>
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

function DemoContent() {
  const {
    loading: staffMembersLoading,
    error,
    data,
  } = useSuspenseQuery(GET_STAFF_MEMBERS);

  if (error) {
    return console.log("staff members error", error);
  }

  const dispatch = useDispatch();

  React.useEffect(() => {
    if (data) {
      dispatch(saveStaffMembers(data));
    }
  }, []);

  const [systemRole, setSystemRole] = React.useState("No"); // Step 1: Add state for system role
  const handleSystemRoleChange = (event) => {
    setSystemRole(event.target.value);
  };

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 300 }}
      role="presentation"
      // onClick={toggleDrawer(anchor, false)}
      // onKeyDown={toggleDrawer(anchor, false)}
    >
      {/* <AddRole /> */}
      <Divider />
    </Box>
  );
  const handleAddRole = () => {
    handleClose();
    toast.success("Role added", {
      position: "top-right",
    });
  };
  const [loading, setLoading] = React.useState(true); // Step 2
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage]
  );

  React.useEffect(() => {
    // Simulate loading delay (You can replace this with your actual data fetching logic)
    const delay = setTimeout(() => {
      setLoading(false);
    }, 2000);

    // Cleanup function to clear the timeout if the component is unmounted
    return () => clearTimeout(delay);
  }, []);

  return (
    <motion.div variants={item}>
      <div className="flex-auto p-0 sm:p-0 h-full">
        <Box sx={{ width: "100%" }}>
          <Paper
            sx={{
              width: "100%",
              mb: 2,
              borderTopRightRadius: 0,
              borderTopLeftRadius: 0,
            }}
          >
            <EnhancedTableToolbar
              onAddUserButtonClick={handleClickOpen}
              numSelected={selected.length}
            />

            <Dialog
              open={open}
              onClose={handleClose}
              PaperProps={{
                component: "form",
                onSubmit: (event) => {
                  event.preventDefault();
                  const formData = new FormData(event.currentTarget);
                  const formJson = Object.fromEntries(formData.entries());
                  const roleName = formJson.name;
                  console.log("Role Name:", roleName);
                  console.log("System Role:", systemRole);

                  handleClose();
                },
              }}
            >
              <DialogTitle>Add Role</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Provide the required information for the new role: name,
                  system role status in order to create the new role
                </DialogContentText>

                {/* Updated spacing for better design */}
                <TextField
                  autoFocus
                  required
                  margin="dense"
                  id="name"
                  name="name"
                  label="Role"
                  type="name"
                  fullWidth
                  variant="standard"
                  sx={{ mb: 2 }} // Add margin-bottom
                />

                <FormControl fullWidth sx={{ mb: 2 }}>
                  {" "}
                  {/* Add margin-bottom */}
                  <InputLabel id="system-role-label">System Role</InputLabel>
                  <Select
                    labelId="system-role-label"
                    id="system-role"
                    value={systemRole}
                    label="System Role"
                    onChange={handleSystemRoleChange}
                  >
                    <MenuItem value="Yes">Yes</MenuItem>
                    <MenuItem value="No">No</MenuItem>
                  </Select>
                </FormControl>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleAddRole} type="submit">
                  Add
                </Button>
              </DialogActions>
            </Dialog>
            <Toaster />

            <TableContainer sx={{ maxHeight: 320 }}>
              <Table
                sx={{ minWidth: 750 }}
                aria-labelledby="tableTitle"
                size={"small"}
                stickyHeader
                style={{
                  borderCollapse: "collapse",
                  width: "100%",
                }}
                aria-label="sticky table"
              >
                <EnhancedTableHead
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onSelectAllClick={handleSelectAllClick}
                  onRequestSort={handleRequestSort}
                  rowCount={rows.length}
                />
                <TableBody>
                  {visibleRows.map((row, index) => {
                    const isItemSelected = isSelected(row.id);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, row.id)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.id}
                        selected={isItemSelected}
                        sx={{ cursor: "pointer" }}
                      >
                        <TableCell
                          padding="checkbox"
                          style={{
                            border: "1px solid #ddd",
                            // padding: "8px",
                            textAlign: "left",
                          }}
                        >
                          <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            inputProps={{
                              "aria-labelledby": labelId,
                            }}
                          />
                        </TableCell>
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                          style={{
                            border: "1px solid #ddd",
                            // padding: "8px",
                            paddingLeft: 10,
                            textAlign: "left",
                          }}
                        >
                          {row.role_name}
                        </TableCell>
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                          style={{
                            border: "1px solid #ddd",
                            // padding: "8px",
                            paddingLeft: 10,
                            textAlign: "left",
                          }}
                        >
                          {row.system_role}
                        </TableCell>
                        <TableCell
                          align="right"
                          style={{
                            border: "1px solid #ddd",
                            // padding: "8px",
                            textAlign: "left",
                          }}
                        >
                          {row.created_by}
                        </TableCell>
                        <TableCell
                          align="right"
                          style={{
                            border: "1px solid #ddd",
                            // padding: "8px",
                            textAlign: "left",
                          }}
                        >
                          {row.created_when}
                        </TableCell>
                        <TableCell
                          component="th"
                          scope="row"
                          align="right"
                          style={{
                            border: "1px solid #ddd",
                            // padding: "8px",
                            textAlign: "left",
                          }}
                        >
                          <Typography
                            className={clsx(
                              "inline-flex items-center font-bold text-10 px-10 py-2 rounded-full tracking-wide uppercase",
                              "pending" &&
                                "bg-red-100 text-red-800 dark:bg-red-600 dark:text-red-50",
                              "completed" &&
                                "bg-green-50 text-green-800 dark:bg-green-600 dark:text-green-50"
                            )}
                            sx={{ "& svg": { margin: 0 } }}
                          >
                            {row.status === "Admission Letter" ? (
                              <>
                                <PictureAsPdfIcon
                                  sx={{ marginRight: 5, fontSize: 16 }}
                                />
                                Admission Letter
                              </>
                            ) : row.status === "ended" ? (
                              <>
                                <PictureAsPdfIcon
                                  sx={{ marginRight: 5, fontSize: 16 }}
                                />
                                Ended
                              </>
                            ) : (
                              row.status
                            )}
                          </Typography>
                        </TableCell>
                        <TableCell
                          align="right"
                          style={{
                            border: "1px solid #ddd",
                            // padding: "8px",
                            textAlign: "left",
                          }}
                        >
                          {row.updated_by}
                        </TableCell>

                        <TableCell
                          align="right"
                          style={{
                            border: "1px solid #ddd",
                            // padding: "8px",
                            textAlign: "left",
                          }}
                        >
                          {row.updated_when}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow
                      style={{
                        height: (dense ? 33 : 53) * emptyRows,
                      }}
                    >
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Box>
      </div>
    </motion.div>
  );
}

export default DemoContent;
