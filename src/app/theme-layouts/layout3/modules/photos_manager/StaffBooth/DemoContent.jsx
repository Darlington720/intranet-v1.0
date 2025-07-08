import * as React from "react";
import { useState, useCallback, useRef, useEffect } from "react";
import Card from "@mui/material/Card";
import { Delete } from "@mui/icons-material";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { lighten } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import { motion } from "framer-motion";
import Avatar from "@mui/material/Avatar";
import { AutoComplete, Tooltip, Modal, Slider, Radio, Tabs, Spin } from "antd";
import Phototable from "./Phototable";
import PhotoGrid from "./PhotoGrid";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import LinkedCameraIcon from "@mui/icons-material/LinkedCamera";
import PerfectScrollbar from "perfect-scrollbar";
import {
  Input as Input2,
  Space,
  Typography,
  Button as Button2,
  Upload,
  Popconfirm,
} from "antd";
import { mockStudents } from "./mockData";

import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import {
  GET_RECENTLY_UPLOADED_STAFF_IMAGES,
  STAFF_AUTOCOMPLETE,
} from "../gql/queries";
import { useDispatch, useSelector } from "react-redux";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import { debounce } from "lodash";
import {
  selectImageToUpload,
  selectOptions,
  selectSelectedStaff,
  selectStaffImages,
  selectStaffImageTimestamp,
  setSelectedStaff,
  setStaffImagePreview,
  setStaffImages,
  setStaffImageTimestamp,
  setStdOptions,
  selectStaffImagePreview,
} from "../store/photosSlice";
import { DELETE_STAFF_IMAGE, SAVE_STAFF_IMAGE } from "../gql/mutations";
import { selectUser } from "app/store/userSlice";
import { Edit, Save } from "lucide-react";
import PhotoEditor from "./PhotoEditor";
import { url2 } from "app/configs/apiConfig";
import { IconButton } from "@mui/material";

const { Search } = Input2;

// Function to create a canvas with the cropped image
const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.crossOrigin = "anonymous";
    image.src = url;
  });

const getCroppedImg = async (
  imageSrc,
  cropArea,
  containerSize,
  imageElement
) => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  // Get the actual displayed image dimensions
  const displayedWidth = imageElement.width;
  const displayedHeight = imageElement.height;

  // Get the position of the image within the container
  const imageLeft = (containerSize.width - displayedWidth) / 2;
  const imageTop = (containerSize.height - displayedHeight) / 2;

  // Adjust crop area to be relative to the image, not the container
  const imageCropArea = {
    x: cropArea.x - imageLeft,
    y: cropArea.y - imageTop,
    width: cropArea.width,
    height: cropArea.height,
  };

  // Calculate the scaling factor between the displayed image and the actual image
  const scaleX = image.naturalWidth / displayedWidth;
  const scaleY = image.naturalHeight / displayedHeight;

  // Calculate the actual crop dimensions in the original image
  const actualCrop = {
    x: Math.max(0, imageCropArea.x * scaleX),
    y: Math.max(0, imageCropArea.y * scaleY),
    width: imageCropArea.width * scaleX,
    height: imageCropArea.height * scaleY,
  };

  // Ensure we don't try to crop outside the image bounds
  if (actualCrop.x + actualCrop.width > image.naturalWidth) {
    actualCrop.width = image.naturalWidth - actualCrop.x;
  }
  if (actualCrop.y + actualCrop.height > image.naturalHeight) {
    actualCrop.height = image.naturalHeight - actualCrop.y;
  }

  // Set canvas dimensions to the cropped area
  canvas.width = actualCrop.width;
  canvas.height = actualCrop.height;

  // Draw the cropped portion of the image onto the canvas
  ctx.drawImage(
    image,
    actualCrop.x,
    actualCrop.y,
    actualCrop.width,
    actualCrop.height,
    0,
    0,
    actualCrop.width,
    actualCrop.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(URL.createObjectURL(blob));
    }, "image/jpeg");
  });
};

// Function to create a square crop from any rectangular crop
// This ensures the image will display properly in a circular avatar
const createSquareCrop = async (imageSrc) => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  // Determine the size of the square (use the smaller dimension)
  const size = Math.min(image.width, image.height);

  // Set canvas to be square
  canvas.width = size;
  canvas.height = size;

  // Calculate centering offsets
  const offsetX = (image.width - size) / 2;
  const offsetY = (image.height - size) / 2;

  // Draw the image centered in the square canvas
  ctx.drawImage(
    image,
    offsetX,
    offsetY,
    size,
    size, // Source rectangle
    0,
    0,
    size,
    size // Destination rectangle
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(URL.createObjectURL(blob));
    }, "image/jpeg");
  });
};

// Function to apply filters to the image
const applyFilters = (imageSrc, filters) => {
  return new Promise(async (resolve) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = image.width;
    canvas.height = image.height;

    // Apply filters
    ctx.filter = `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturation}%) blur(${filters.blur}px)`;
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      resolve(URL.createObjectURL(blob));
    }, "image/jpeg");
  });
};

function DemoContent() {
  const [activeTab, setActiveTab] = React.useState("1");
  const [viewMode, setViewMode] = React.useState("grid");
  const [searchText, setSearchText] = useState("");
  const dispatch = useDispatch();
  const _options = useSelector(selectOptions);
  const selectedStaff = useSelector(selectSelectedStaff);
  const imagePreview = useSelector(selectStaffImagePreview);
  const imageToUpload = useSelector(selectImageToUpload);
  const [value, setValue] = useState("");
  const [options, setOptions] = useState([]);
  const [photos, setPhotos] = useState(mockStudents);
  const scrollContainerRef = React.useRef(null);
  const psRef = React.useRef(null);
  const userObj = useSelector(selectUser);
  const [image, setImage] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const imageTimestamp = useSelector(selectStaffImageTimestamp);
  const {
    loading: loadingImages,
    error: imagesErr,
    data: imagesData,
  } = useQuery(GET_RECENTLY_UPLOADED_STAFF_IMAGES, {
    notifyOnNetworkStatusChange: true,
  });

  const handleEditPhoto = (photo) => {
    console.log("photo", photo);
    const staff = {
      staff_id: photo.staff_id,
      name: photo.staff_name,
      ...photo,
    };

    // dispatch(setSelectedStaff(staff));
    setSelectedPhoto(staff);

    // Create a new image with crossOrigin attribute
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const dataUrl = canvas.toDataURL("image/jpeg");
      setEditingImage(dataUrl);
      setIsEditorOpen(true);
    };
    img.src = photo.image;
  };

  const handleDeletePhoto = (staff) => {
    const st = {
      staff_id: staff.staff_id,
      name: staff.staff_name,
      ...staff,
    };
    // console.log("student", student);
    Modal.confirm({
      title: "Delete Photo",
      content: `Are you sure you want to delete ${st.name}'s photo?`,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      centered: true,
      async onOk() {
        await confirmDelete(st, false);
      },
    });
  };
  const [staffAutoComplete, { error, loading, data, refetch }] = useLazyQuery(
    STAFF_AUTOCOMPLETE,
    {
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "no-cache",
    }
  );

  // Image editor state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [filters, setFilters] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
  });
  const [aspectRatio, setAspectRatio] = useState(1); // Default to square (1:1) for avatar
  const [previewCrop, setPreviewCrop] = useState(null); // Store the preview of the cropped image

  // Custom cropper state
  const cropperRef = useRef(null);
  const imageRef = useRef(null);
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const [dragMode, setDragMode] = useState(null); // null, 'move', 'nw', 'ne', 'sw', 'se', 'n', 'e', 's', 'w'
  const [initialCropArea, setInitialCropArea] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const [
    saveStaffImage,
    { error: saveErr, loading: savingStdImage, data: saveRes },
  ] = useMutation(SAVE_STAFF_IMAGE, {
    refetchQueries: ["GetRecentlyUploadedStaffImages"],
  });
  const [deleteStaffImage, { error: deleteErr, loading: deletingImage }] =
    useMutation(DELETE_STAFF_IMAGE, {
      refetchQueries: ["GetRecentlyUploadedStaffImages"],
    });
  const images = useSelector(selectStaffImages);

  const fileInputRef = React.useRef(null);

  // Initialize crop area when image loads
  useEffect(() => {
    if (editingImage && cropperRef.current) {
      const img = new Image();
      img.onload = () => {
        const containerWidth = cropperRef.current.clientWidth;
        const containerHeight = cropperRef.current.clientHeight;

        // Calculate the displayed image size (maintaining aspect ratio)
        let displayWidth, displayHeight;
        const imgAspectRatio = img.width / img.height;
        const containerAspectRatio = containerWidth / containerHeight;

        if (imgAspectRatio > containerAspectRatio) {
          // Image is wider than container (relative to height)
          displayWidth = containerWidth;
          displayHeight = containerWidth / imgAspectRatio;
        } else {
          // Image is taller than container (relative to width)
          displayHeight = containerHeight;
          displayWidth = containerHeight * imgAspectRatio;
        }

        setImageSize({ width: displayWidth, height: displayHeight });

        // For avatar, default to square crop in the center
        const size = Math.min(displayWidth, displayHeight) * 0.8;
        const initialX = (containerWidth - size) / 2;
        const initialY = (containerHeight - size) / 2;

        setCropArea({
          x: initialX,
          y: initialY,
          width: size,
          height: size,
        });

        // Generate preview
        updateCropPreview(initialX, initialY, size, size);
      };
      img.src = editingImage;
    }
  }, [editingImage]);

  // Apply aspect ratio constraints when it changes
  useEffect(() => {
    if (aspectRatio && cropArea.width && cropArea.height) {
      // Maintain the current center point
      const centerX = cropArea.x + cropArea.width / 2;
      const centerY = cropArea.y + cropArea.height / 2;

      // Calculate new dimensions based on aspect ratio
      let newWidth = cropArea.width;
      let newHeight = cropArea.height;

      if (aspectRatio === 1) {
        // Square
        newWidth = Math.min(cropArea.width, cropArea.height);
        newHeight = newWidth;
      } else if (aspectRatio === 3 / 4) {
        // Portrait (3:4)
        if (cropArea.width * 4 > cropArea.height * 3) {
          newWidth = (cropArea.height * 3) / 4;
          newHeight = cropArea.height;
        } else {
          newWidth = cropArea.width;
          newHeight = (cropArea.width * 4) / 3;
        }
      } else if (aspectRatio === 4 / 3) {
        // Landscape (4:3)
        if (cropArea.width * 3 > cropArea.height * 4) {
          newWidth = cropArea.width;
          newHeight = (cropArea.width * 3) / 4;
        } else {
          newWidth = (cropArea.height * 4) / 3;
          newHeight = cropArea.height;
        }
      }

      // Calculate new position to maintain center
      const newX = centerX - newWidth / 2;
      const newY = centerY - newHeight / 2;

      setCropArea({
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight,
      });

      // Update preview
      updateCropPreview(newX, newY, newWidth, newHeight);
    }
  }, [aspectRatio]);

  // Function to update the crop preview
  const updateCropPreview = async (x, y, width, height) => {
    if (!editingImage || !imageRef.current || !cropperRef.current) return;

    try {
      const containerSize = {
        width: cropperRef.current.clientWidth,
        height: cropperRef.current.clientHeight,
      };

      const croppedImageUrl = await getCroppedImg(
        editingImage,
        { x, y, width, height },
        containerSize,
        imageRef.current
      );

      // For avatar display, ensure the crop is square
      const squareCrop = await createSquareCrop(croppedImageUrl);

      setPreviewCrop(squareCrop);
    } catch (error) {
      console.error("Error generating crop preview:", error);
    }
  };

  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      return;
    }

    setImage(info.file.originFileObj);
    setSelectedPhoto(selectedStaff);

    // Get this url from response in real world.
    getBase64(info.file.originFileObj, (url) => {
      // Open the editor modal with the image
      setEditingImage(url);
      setIsEditorOpen(true);
      // Default to square aspect ratio for avatar
      setAspectRatio(1);
    });
  };

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  // Save edited image
  const saveEditedImage = async (imageData) => {
    const { croppedImage, crop, rotation, brightness, contrast, saturation } =
      imageData;

    try {
      // Convert base64 to blob for upload
      const response = await fetch(croppedImage);
      const blob = await response.blob();
      const file = new File([blob], "edited-photo.jpeg", {
        type: "image/jpeg",
      });

      // Update the image state with the edited image
      setImage(file);

      const payload = {
        staffId: selectedPhoto?.staff_id,
        file: file,
        saveStaffImageId: selectedPhoto?.id || null,
      };

      console.log("selectedStd", selectedStaff);
      console.log("payload", payload);

      const res = await saveStaffImage({
        variables: payload,
      });

      dispatch(setStaffImageTimestamp(Date.now()));

      // console.log("response", res.data);

      // Close the editor
      setIsEditorOpen(false);

      // console.log("selected std", selectedStd)
      dispatch(setSelectedStaff({ staff_id: "" }));
      dispatch(setStaffImagePreview(`${url2}/staff_photo/0`));

      // Show success message
      dispatch(
        showMessage({
          message: res.data.saveStaffImage.message,
          variant: "success",
        })
      );
    } catch (error) {
      console.error("Error processing edited image:", error);
      dispatch(
        showMessage({
          message: "Error saving edited image",
          variant: "error",
        })
      );
    }
  };

  useEffect(() => {
    if (error) {
      dispatch(
        showMessage({
          message: error.message,
          variant: "error",
        })
      );
    }

    if (saveErr) {
      dispatch(
        showMessage({
          message: saveErr.message,
          variant: "error",
        })
      );
    }

    if (imagesErr) {
      dispatch(
        showMessage({
          message: imagesErr.message,
          variant: "error",
        })
      );
    }
  }, [error, saveErr, imagesErr]);

  if (imagesData) {
    // console.log('imagesData', imagesData)
    dispatch(setStaffImages(imagesData.getRecentlyUploadedStaffImages));
  }

  const debouncedFetchSuggestions = useCallback(
    debounce(async (query) => {
      if (query) {
        const res = await staffAutoComplete({
          variables: {
            query: query,
          },
        });

        dispatch(setStdOptions(res.data.staff_autocomplete));

        const arr = res.data.staff_autocomplete.map((item) => ({
          label: item.name,
          value: item.staff_id, // Adjust based on your data structure
        }));

        // console.log("arr", arr);

        setOptions(arr);
      } else {
        setOptions([]);
      }
    }, 300), // Adjust debounce delay as needed
    []
  );

  const handleSearch = (value) => {
    debouncedFetchSuggestions(value);
  };

  const onSelect = (data) => {
    const selected = _options.filter((op) => op.staff_id == data)[0];
    console.log("selected", selected);
    dispatch(setStaffImagePreview(`${url2}/staff_photo/${selected.staff_id}`));
    dispatch(setSelectedStaff(selected));
    setSelectedPhoto(selected);
    setImage(null);
  };

  React.useEffect(() => {
    if (scrollContainerRef.current) {
      psRef.current = new PerfectScrollbar(scrollContainerRef.current, {
        wheelSpeed: 2,
        wheelPropagation: false,
        minScrollbarLength: 20,
      });

      return () => {
        if (psRef.current) {
          psRef.current.destroy();
          psRef.current = null;
        }
      };
    }
  }, []);

  const confirmDelete = async (staff, reloadPreview = true) => {
    const res = await deleteStaffImage({
      variables: {
        staffId: staff.staff_id,
      },
    });

    dispatch(
      showMessage({
        message: res.data.deleteStaffImage.message,
        variant: "success",
      })
    );

    dispatch(setStaffImageTimestamp(Date.now()));

    if (reloadPreview) {
      const res2 = await refetch({
        query: staff.staff_id,
      });
      // console.log('res2', res2.data)
      dispatch(setStaffImageTimestamp(Date.now()));
      const std = res2.data.staff_autocomplete.find(
        (item) => item.staff_id == staff.staff_id
      );
      dispatch(setStaffImagePreview(`${url2}/staff_photo/${staff.staff_id}`));
      dispatch(setSelectedStaff(std));
      setImage(null);
    }
  };

  return (
    <div
      className="flex-auto p-24 sm:p-40"
      style={{
        height: "calc(100vh - 160px)",
      }}
    >
      <div
        className="border-2 border-dashed rounded-2xl"
        style={{
          height: "calc(100vh - 230px)",
        }}
      >
        <motion.div initial="hidden" animate="show">
          <Box>
            <Grid container spacing={2}>
              <Grid xs={4}>
                <Card
                  className="flex flex-col shadow"
                  style={{
                    borderRadius: 0,
                    borderTopLeftRadius: 10,
                    borderBottomLeftRadius: 10,
                    overflow: "scroll",
                  }}
                >
                  <CardContent
                    className="flex flex-col flex-auto p-24"
                    style={{
                      height: "calc(100vh - 235px)",
                      justifyContent: "center",
                    }}
                  >
                    <AutoComplete
                      options={options}
                      onSelect={onSelect}
                      onSearch={handleSearch}
                      value={selectedStaff ? selectedStaff.name : ""}
                      onChange={(text) => {
                        dispatch(setSelectedStaff({ staff_id: text }));
                        if (text == "") {
                          dispatch(setSelectedStaff({ staff_id: "" }));
                          dispatch(setStaffImagePreview(`${url2}/staff_photo/0`));
                        }
                      }}
                      // onClick={(e) => console.log("clicked", e.target.value)}
                    >
                      <Search
                        style={{ marginBottom: 20, marginTop: 5 }}
                        loading={loading}
                        placeholder="Enter Staff Identifier"
                        size="large"
                      />
                    </AutoComplete>

                    <div>
                      <Box
                        sx={{
                          textAlign: "center",
                          display: "flex",
                          justifyContent: "center",
                          position: "relative",
                          overflow: "hidden",
                          // maxHeight: "70vh",
                          height: 300,
                          // width: 300,
                          borderRadius: 2,
                          // backgroundColor: "red",
                          // p: 0,
                          // margin: "10px auto",
                        }}
                      >
                        <img
                          src={`${imagePreview}?t=${imageTimestamp}`}
                          alt={selectedStaff.name}
                          style={{
                            transform: `scale(${90 / 100})`,
                            transition: "transform 0.3s ease",
                            transformOrigin: "center",
                            borderRadius: 8,
                            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                            // ...getFilterStyle(),
                            margin: "10px 0px",
                          }}
                        />
                        {selectedStaff?.has_photo && (
                          <Popconfirm
                            title="Delete Image"
                            description="Are you sure to delete?"
                            onConfirm={(e) => confirmDelete(selectedStaff)}
                            // onCancel={cancel}
                            okText="Yes"
                            cancelText="No"
                          >
                            <IconButton
                              // onClick={handleRemovePhoto}
                              sx={{
                                position: "absolute",
                                top: 25,
                                right: 80,
                                backgroundColor: "rgba(255, 255, 255, 1)",
                                "&:hover": {
                                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                                },
                                zIndex: 10,
                              }}
                              size="small"
                            >
                              <Delete fontSize="small" color="error" />
                            </IconButton>
                          </Popconfirm>
                        )}
                      </Box>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 10,
                        marginTop: 0,
                      }}
                    >
                      {selectedStaff?.has_photo ? (
                        <Button2
                          block
                          size="large"
                          type="primary"
                          disabled={!selectedStaff?.name}
                          icon={
                            selectedStaff?.has_photo ? (
                              <Edit />
                            ) : (
                              <PhotoCamera />
                            )
                          }
                          style={{
                            width: 250,
                            height: 50,
                            fontSize: 16,
                            // backgroundColor: "#4a90e2",
                            borderRadius: 8,
                          }}
                          onClick={() => {
                            const payload = {
                              staff_id: selectedStaff.staff_id,
                              name: selectedStaff.name,
                              image: `${url2}/staff_photo/${selectedStaff.staff_id}`,
                              ...selectedStaff,
                            };
                            handleEditPhoto(payload);
                            // console.log("selected std", selectedStd)
                          }}
                        >
                          {selectedStaff?.has_photo
                            ? "Edit Image"
                            : "Upload Image"}
                        </Button2>
                      ) : (
                        <Upload
                          showUploadList={false}
                          maxCount={1}
                          accept="image/png, image/jpeg, image/jpg"
                          onChange={handleChange}
                        >
                          <Button2
                            block
                            size="large"
                            type="primary"
                            disabled={!selectedStaff?.name}
                            icon={
                              selectedStaff?.has_photo ? (
                                <Edit />
                              ) : (
                                <PhotoCamera />
                              )
                            }
                            style={{
                              width: 250,
                              height: 50,
                              fontSize: 16,
                              // backgroundColor: "#4a90e2",
                              borderRadius: 8,
                            }}
                          >
                            {selectedStaff?.has_photo
                              ? "Edit Image"
                              : "Upload Image"}
                          </Button2>
                        </Upload>
                      )}

                      <Button2
                        block
                        size="large"
                        disabled={!selectedStaff?.name}
                        icon={<LinkedCameraIcon />}
                        style={{
                          width: 250,
                          height: 50,
                          fontSize: 16,
                          borderRadius: 8,
                        }}
                      >
                        Take Photo
                      </Button2>
                    </div>
                  </CardContent>
                </Card>
              </Grid>

              <Grid xs={8}>
                {/* <Phototable /> */}
                <div
                  style={{
                    height: "calc(100vh - 250px)",
                    overflowY: "scroll",
                  }}
                >
                  <Spin spinning={loadingImages} tip="Loading Recent Images...">
                    <PhotoGrid
                      photos={images}
                      onEditPhoto={handleEditPhoto}
                      onDeletePhoto={handleDeletePhoto}
                    />
                  </Spin>
                </div>
              </Grid>
            </Grid>
          </Box>
        </motion.div>
      </div>

      {selectedPhoto && (
        <PhotoEditor
          image={editingImage}
          open={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          onSave={saveEditedImage}
          savingImage={savingStdImage}
          selectedStd={selectedPhoto}
        />
      )}
    </div>
  );
}

export default DemoContent;
