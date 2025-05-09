import * as React from "react";
import { useState, useCallback, useRef, useEffect } from "react";
import Card from "@mui/material/Card";
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
} from "antd";
import { mockStudents } from "./mockData";

import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import {
  GET_RECENTLY_UPLOADED_IMAGES,
  STUDENTS_AUTOCOMPLETE,
} from "../gql/queries";
import { useDispatch, useSelector } from "react-redux";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import { debounce } from "lodash";
import {
  selectImagePreview,
  selectImages,
  selectImageToUpload,
  selectOptions,
  selectSelectedOption,
  setImagePreview,
  setImages,
  setSelectedOption,
  setStdOptions,
} from "../store/photosSlice";
import { SAVE_STUDENT_IMAGE } from "../gql/mutations";
import { selectUser } from "app/store/userSlice";
import { Save } from "lucide-react";
import PhotoEditor from "./PhotoEditor";

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
  const selectedStd = useSelector(selectSelectedOption);
  const imagePreview = useSelector(selectImagePreview);
  const imageToUpload = useSelector(selectImageToUpload);
  const [value, setValue] = useState("");
  const [options, setOptions] = useState([]);
  const [photos, setPhotos] = useState(mockStudents);
  const scrollContainerRef = React.useRef(null);
  const psRef = React.useRef(null);
  const userObj = useSelector(selectUser);
  const [image, setImage] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const {
    loading: loadingImages,
    error: imagesErr,
    data: imagesData,
  } = useQuery(GET_RECENTLY_UPLOADED_IMAGES, {
    notifyOnNetworkStatusChange: true,
  });

  const handleEditPhoto = (photo) => {
    setSelectedPhoto(photo);
    setEditingImage(photo.image);
    setIsEditorOpen(true);
  };

  const handleDeletePhoto = (photo) => {
    Modal.confirm({
      title: "Delete Photo",
      content: `Are you sure you want to delete ${photo.name}'s photo?`,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        const updatedPhotos = photos.filter((p) => p.id !== photo.id);
        setPhotos(updatedPhotos);
        dispatch(
          showMessage({
            message: "Photo deleted successfully",
            variant: "success",
          })
        );
      },
    });
  };
  const [studentsAutoComplete, { error, loading, data }] = useLazyQuery(
    STUDENTS_AUTOCOMPLETE,
    {
      notifyOnNetworkStatusChange: true,
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
  const [editMode, setEditMode] = useState("crop"); // crop, filter
  const [showGrid, setShowGrid] = useState(true);
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
    saveStudentImage,
    { error: saveErr, loading: savingStdImage, data: saveRes },
  ] = useMutation(SAVE_STUDENT_IMAGE, {
    refetchQueries: ["getRecentlyUploadedImages"], //to be fetch updated uploaded students
  });
  const images = useSelector(selectImages);

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

  // Mouse event handlers for cropping
  const handleMouseDown = (e) => {
    if (editMode !== "crop") return;

    const rect = cropperRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Determine if we're on a handle or inside the crop area
    const handleSize = 10; // Size of the resize handles
    const isInsideCrop =
      x >= cropArea.x &&
      x <= cropArea.x + cropArea.width &&
      y >= cropArea.y &&
      y <= cropArea.y + cropArea.height;

    // Check if we're on a corner handle
    const isOnNW =
      x >= cropArea.x - handleSize &&
      x <= cropArea.x + handleSize &&
      y >= cropArea.y - handleSize &&
      y <= cropArea.y + handleSize;
    const isOnNE =
      x >= cropArea.x + cropArea.width - handleSize &&
      x <= cropArea.x + cropArea.width + handleSize &&
      y >= cropArea.y - handleSize &&
      y <= cropArea.y + handleSize;
    const isOnSW =
      x >= cropArea.x - handleSize &&
      x <= cropArea.x + handleSize &&
      y >= cropArea.y + cropArea.height - handleSize &&
      y <= cropArea.y + cropArea.height + handleSize;
    const isOnSE =
      x >= cropArea.x + cropArea.width - handleSize &&
      x <= cropArea.x + cropArea.width + handleSize &&
      y >= cropArea.y + cropArea.height - handleSize &&
      y <= cropArea.y + cropArea.height + handleSize;

    // Check if we're on an edge handle
    const isOnN =
      !isOnNW &&
      !isOnNE &&
      x >= cropArea.x + handleSize &&
      x <= cropArea.x + cropArea.width - handleSize &&
      y >= cropArea.y - handleSize &&
      y <= cropArea.y + handleSize;
    const isOnE =
      !isOnNE &&
      !isOnSE &&
      x >= cropArea.x + cropArea.width - handleSize &&
      x <= cropArea.x + cropArea.width + handleSize &&
      y >= cropArea.y + handleSize &&
      y <= cropArea.y + cropArea.height - handleSize;
    const isOnS =
      !isOnSW &&
      !isOnSE &&
      x >= cropArea.x + handleSize &&
      x <= cropArea.x + cropArea.width - handleSize &&
      y >= cropArea.y + cropArea.height - handleSize &&
      y <= cropArea.y + cropArea.height + handleSize;
    const isOnW =
      !isOnNW &&
      !isOnSW &&
      x >= cropArea.x - handleSize &&
      x <= cropArea.x + handleSize &&
      y >= cropArea.y + handleSize &&
      y <= cropArea.y + cropArea.height - handleSize;

    // Set drag mode based on where the mouse is
    if (isOnNW) setDragMode("nw");
    else if (isOnNE) setDragMode("ne");
    else if (isOnSW) setDragMode("sw");
    else if (isOnSE) setDragMode("se");
    else if (isOnN) setDragMode("n");
    else if (isOnE) setDragMode("e");
    else if (isOnS) setDragMode("s");
    else if (isOnW) setDragMode("w");
    else if (isInsideCrop) setDragMode("move");
    else {
      // Start a new crop area
      setCropArea({
        x: x,
        y: y,
        width: 0,
        height: 0,
      });
      setDragMode("se"); // Start dragging the bottom-right corner
    }

    setIsDragging(true);
    setDragStartPos({ x, y });
    setInitialCropArea({ ...cropArea });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || editMode !== "crop") return;

    const rect = cropperRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const deltaX = x - dragStartPos.x;
    const deltaY = y - dragStartPos.y;

    let newCropArea = { ...cropArea };

    // Apply constraints based on drag mode
    if (dragMode === "move") {
      // Move the entire crop area
      newCropArea = {
        ...initialCropArea,
        x: initialCropArea.x + deltaX,
        y: initialCropArea.y + deltaY,
      };
    } else {
      // Resize the crop area
      if (dragMode.includes("n")) {
        newCropArea.y = initialCropArea.y + deltaY;
        newCropArea.height = initialCropArea.height - deltaY;
      }
      if (dragMode.includes("e")) {
        newCropArea.width = initialCropArea.width + deltaX;
      }
      if (dragMode.includes("s")) {
        newCropArea.height = initialCropArea.height + deltaY;
      }
      if (dragMode.includes("w")) {
        newCropArea.x = initialCropArea.x + deltaX;
        newCropArea.width = initialCropArea.width - deltaX;
      }
    }

    // Ensure width and height are positive
    if (newCropArea.width < 0) {
      newCropArea.x = newCropArea.x + newCropArea.width;
      newCropArea.width = Math.abs(newCropArea.width);

      // Flip drag mode horizontally
      if (dragMode === "nw") setDragMode("ne");
      else if (dragMode === "ne") setDragMode("nw");
      else if (dragMode === "sw") setDragMode("se");
      else if (dragMode === "se") setDragMode("sw");
      else if (dragMode === "w") setDragMode("e");
      else if (dragMode === "e") setDragMode("w");

      setDragStartPos({ x, y });
      setInitialCropArea(newCropArea);
    }

    if (newCropArea.height < 0) {
      newCropArea.y = newCropArea.y + newCropArea.height;
      newCropArea.height = Math.abs(newCropArea.height);

      // Flip drag mode vertically
      if (dragMode === "nw") setDragMode("sw");
      else if (dragMode === "ne") setDragMode("se");
      else if (dragMode === "sw") setDragMode("nw");
      else if (dragMode === "se") setDragMode("ne");
      else if (dragMode === "n") setDragMode("s");
      else if (dragMode === "s") setDragMode("n");

      setDragStartPos({ x, y });
      setInitialCropArea(newCropArea);
    }

    // Apply aspect ratio constraint if needed
    if (aspectRatio !== null) {
      if (dragMode.includes("n") || dragMode.includes("s")) {
        // Vertical resize - adjust width based on height
        newCropArea.width = newCropArea.height * aspectRatio;

        // Keep the correct side fixed
        if (dragMode.includes("w")) {
          newCropArea.x =
            initialCropArea.x + initialCropArea.width - newCropArea.width;
        }
      } else if (dragMode.includes("e") || dragMode.includes("w")) {
        // Horizontal resize - adjust height based on width
        newCropArea.height = newCropArea.width / aspectRatio;

        // Keep the correct side fixed
        if (dragMode.includes("n")) {
          newCropArea.y =
            initialCropArea.y + initialCropArea.height - newCropArea.height;
        }
      }
    }

    // Ensure crop area stays within the image bounds
    const containerWidth = cropperRef.current.clientWidth;
    const containerHeight = cropperRef.current.clientHeight;

    // Constrain to container bounds
    if (newCropArea.x < 0) newCropArea.x = 0;
    if (newCropArea.y < 0) newCropArea.y = 0;
    if (newCropArea.x + newCropArea.width > containerWidth) {
      if (dragMode.includes("w")) {
        newCropArea.x = containerWidth - newCropArea.width;
      } else {
        newCropArea.width = containerWidth - newCropArea.x;
      }
    }
    if (newCropArea.y + newCropArea.height > containerHeight) {
      if (dragMode.includes("n")) {
        newCropArea.y = containerHeight - newCropArea.height;
      } else {
        newCropArea.height = containerHeight - newCropArea.y;
      }
    }

    // Enforce minimum size
    const minSize = 20;
    if (newCropArea.width < minSize) {
      if (dragMode.includes("w")) {
        newCropArea.x = initialCropArea.x + initialCropArea.width - minSize;
      }
      newCropArea.width = minSize;
    }
    if (newCropArea.height < minSize) {
      if (dragMode.includes("n")) {
        newCropArea.y = initialCropArea.y + initialCropArea.height - minSize;
      }
      newCropArea.height = minSize;
    }

    setCropArea(newCropArea);

    // Update preview in real-time
    updateCropPreview(
      newCropArea.x,
      newCropArea.y,
      newCropArea.width,
      newCropArea.height
    );
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragMode(null);
  };

  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      return;
    }

    setImage(info.file.originFileObj);

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
  const saveEditedImage = async () => {
    try {
      let finalImage = editingImage;

      // Apply crop if in crop mode
      if (editMode === "crop" && cropperRef.current && imageRef.current) {
        const containerSize = {
          width: cropperRef.current.clientWidth,
          height: cropperRef.current.clientHeight,
        };

        finalImage = await getCroppedImg(
          editingImage,
          cropArea,
          containerSize,
          imageRef.current
        );

        // For avatar display, ensure the crop is square
        finalImage = await createSquareCrop(finalImage);
      }

      // Apply filters
      finalImage = await applyFilters(finalImage, filters);

      // Convert URL to blob for upload
      const response = await fetch(finalImage);
      const blob = await response.blob();
      const file = new File([blob], "edited-image.jpg", { type: "image/jpeg" });

      // Update the image state and preview
      setImage(file);
      dispatch(setImagePreview(finalImage));
      // setSelectedPhoto(file);

      // Close the editor
      setIsEditorOpen(false);

      // Reset editor state
      setEditMode("crop");
      setFilters({
        brightness: 100,
        contrast: 100,
        saturation: 100,
        blur: 0,
      });
    } catch (error) {
      console.error("Error saving edited image:", error);
      dispatch(
        showMessage({
          message: "Error saving edited image: " + error.message,
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
    dispatch(setImages(imagesData.getRecentlyUploadedImages));
  }

  const debouncedFetchSuggestions = useCallback(
    debounce(async (query) => {
      if (query) {
        const res = await studentsAutoComplete({
          variables: {
            query: query,
          },
        });
        dispatch(setStdOptions(res.data.student_autocomplete));

        const arr = res.data.student_autocomplete.map((item) => ({
          label: item.name,
          value: item.student_no, // Adjust based on your data structure
        }));

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
    console.log("data", data);
    const selected = _options.filter((op) => op.student_no == data)[0];
    dispatch(
      setImagePreview(
        `http://tredumo.com/api/student_image/${selected.student_no}`
      )
    );
    dispatch(setSelectedOption(selected));
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

  const handleSave = async () => {
    const payload = {
      file: image,
      stdno: selectedStd.student_no,
      saveStudentImageId: selectedStd.id,
      uploadedBy: userObj.user.user_id,
    };

    const res = await saveStudentImage({
      variables: payload,
    });

    // reset the forms
    dispatch(
      setSelectedOption({
        student_no: "",
      })
    );
    setImage(null);
    dispatch(setImagePreview(`https://tredumo.com/api/student_image/0`));
    dispatch(
      showMessage({
        message: res.data.saveStudentImage.message,
        variant: "success",
      })
    );
  };

  // Custom component for the WhatsApp-style grid overlay
  const WhatsAppGridOverlay = () => {
    if (!showGrid) return null;

    return (
      <div
        style={{
          position: "absolute",
          top: cropArea.y,
          left: cropArea.x,
          width: cropArea.width,
          height: cropArea.height,
          pointerEvents: "none",
          zIndex: 10,
        }}
      >
        {/* Horizontal lines */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "33.33%",
            height: 1,
            backgroundColor: "rgba(255, 255, 255, 0.7)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "66.66%",
            height: 1,
            backgroundColor: "rgba(255, 255, 255, 0.7)",
          }}
        />

        {/* Vertical lines */}
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: "33.33%",
            width: 1,
            backgroundColor: "rgba(255, 255, 255, 0.7)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: "66.66%",
            width: 1,
            backgroundColor: "rgba(255, 255, 255, 0.7)",
          }}
        />
      </div>
    );
  };

  // Render crop handles
  const renderCropHandles = () => {
    if (editMode !== "crop") return null;

    const handleStyle = {
      position: "absolute",
      width: "10px",
      height: "10px",
      backgroundColor: "white",
      border: "1px solid rgba(0, 0, 0, 0.3)",
      zIndex: 20,
    };

    return (
      <>
        {/* Corner handles */}
        <div
          style={{
            ...handleStyle,
            top: cropArea.y - 5,
            left: cropArea.x - 5,
            cursor: "nwse-resize",
          }}
        />
        <div
          style={{
            ...handleStyle,
            top: cropArea.y - 5,
            left: cropArea.x + cropArea.width - 5,
            cursor: "nesw-resize",
          }}
        />
        <div
          style={{
            ...handleStyle,
            top: cropArea.y + cropArea.height - 5,
            left: cropArea.x - 5,
            cursor: "nesw-resize",
          }}
        />
        <div
          style={{
            ...handleStyle,
            top: cropArea.y + cropArea.height - 5,
            left: cropArea.x + cropArea.width - 5,
            cursor: "nwse-resize",
          }}
        />

        {/* Edge handles */}
        <div
          style={{
            ...handleStyle,
            top: cropArea.y - 5,
            left: cropArea.x + cropArea.width / 2 - 5,
            cursor: "ns-resize",
          }}
        />
        <div
          style={{
            ...handleStyle,
            top: cropArea.y + cropArea.height / 2 - 5,
            left: cropArea.x + cropArea.width - 5,
            cursor: "ew-resize",
          }}
        />
        <div
          style={{
            ...handleStyle,
            top: cropArea.y + cropArea.height - 5,
            left: cropArea.x + cropArea.width / 2 - 5,
            cursor: "ns-resize",
          }}
        />
        <div
          style={{
            ...handleStyle,
            top: cropArea.y + cropArea.height / 2 - 5,
            left: cropArea.x - 5,
            cursor: "ew-resize",
          }}
        />
      </>
    );
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
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
              <Grid xs={4}>
                <Card
                  className="flex flex-col shadow"
                  style={{
                    borderRadius: 0,
                    borderTopLeftRadius: 10,
                    borderBottomLeftRadius: 10,
                    overflow: "scroll"
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
                      value={selectedStd ? selectedStd.student_no : ""}
                      onChange={(text) =>
                        dispatch(setSelectedOption({ student_no: text }))
                      }
                      // onClick={(e) => console.log("clicked", e.target.value)}
                    >
                      <Search
                        style={{ marginBottom: 20, marginTop: 5 }}
                        loading={loading}
                        placeholder="Enter Student Identifier"
                        size="large"
                      />
                    </AutoComplete>

                    <div>
                      <Box
                        sx={{
                          textAlign: "center",
                          display: "flex",
                          justifyContent: "center",
                          overflow: "auto",
                          maxHeight: "70vh",
                          borderRadius: 2,
                          // p: 1,
                        }}
                        
                      >
                        <img
                          src={`http://localhost:2222/student_photo/2400100002`}
                          alt={"AKAMPA"}
                          style={{
                            transform: `scale(${90 / 100})`,
                            transition: "transform 0.3s ease",
                            transformOrigin: "center",
                            borderRadius: 8,
                            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                            // ...getFilterStyle(),
                            margin: "10px 0px"
                          }}
                        />
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
                          // disabled={true}
                          icon={<PhotoCamera />}
                          style={{
                            width: 250,
                            height: 50,
                            fontSize: 16,
                            // backgroundColor: "#4a90e2",
                            borderRadius: 8,
                          }}
                        >
                          Upload Image
                        </Button2>
                      </Upload>

                      <Button2
                        block
                        size="large"
                        // disabled={true}
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
        />
      )}
    </div>
  );
}

export default DemoContent;
