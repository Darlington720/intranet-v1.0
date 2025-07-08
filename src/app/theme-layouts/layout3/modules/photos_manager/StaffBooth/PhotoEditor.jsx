import React, { useState, useRef, useCallback } from "react";
import { styled } from "@mui/material/styles";
import {
  Box,
  Slider,
  Button,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  IconButton,
  CircularProgress,
} from "@mui/material";
import Cropper from "react-easy-crop";
import CloseIcon from "@mui/icons-material/Close";

const DialogContainer = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    maxWidth: "1200px",
    width: "90%",
    height: "80vh",
    margin: theme.spacing(2),
  },
}));

const EditorContainer = styled(Box)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
}));

const ControlsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  marginTop: theme.spacing(2),
}));

const SliderContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  width: "100%",
}));

const CropContainer = styled(Box)({
  position: "relative",
  width: "100%",
  height: "100%",
  backgroundColor: "#333",
  minHeight: "500px",
});

const PhotoEditor = ({selectedStd, image, onSave, open, onClose, savingImage = false }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const imageRef = useRef(null);
  const [minZoom, setMinZoom] = useState(1);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.src = url;
    });

  const getCroppedImg = async (imageSrc, pixelCrop, rotation = 0) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const maxSize = Math.max(image.width, image.height);
    canvas.width = maxSize;
    canvas.height = maxSize;

    ctx.translate(maxSize / 2, maxSize / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-maxSize / 2, -maxSize / 2);

    ctx.drawImage(
      image,
      maxSize / 2 - image.width / 2,
      maxSize / 2 - image.height / 2
    );

    const data = ctx.getImageData(0, 0, maxSize, maxSize);
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.putImageData(
      data,
      Math.round(0 - maxSize / 2 + image.width / 2 - pixelCrop.x),
      Math.round(0 - maxSize / 2 + image.height / 2 - pixelCrop.y)
    );

    return canvas;
  };

  const handleSave = useCallback(async () => {
    if (!croppedAreaPixels) return;

    try {
      const canvas = await getCroppedImg(image, croppedAreaPixels, rotation);
      const ctx = canvas.getContext("2d");

      // Apply filters to the canvas
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
      ctx.drawImage(canvas, 0, 0);

      // Get the final image as base64
      const croppedImage = canvas.toDataURL("image/jpeg");

      const imageData = {
        croppedImage,
        crop: croppedAreaPixels,
        rotation,
        brightness,
        contrast,
        saturation,
      };
      onSave(imageData);
    } catch (e) {
      console.error("Error saving image:", e);
    }
  }, [croppedAreaPixels, rotation, brightness, contrast, saturation, onSave]);

  const handleImageLoad = useCallback((img) => {
    imageRef.current = img;

    const imgWidth = img.naturalWidth;
    const imgHeight = img.naturalHeight;

    const zoomForWidth = imgWidth / 300;
    const zoomForHeight = imgHeight / 300;

    const calculatedMinZoom = Math.max(zoomForWidth, zoomForHeight);

    setMinZoom(calculatedMinZoom);
    setZoom(calculatedMinZoom);

    // ✅ Center the crop area
    setCrop({ x: 0, y: 0 });
  }, []);

  return (
    <DialogContainer open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2 }}>
        Photo Editor - {selectedStd?.staff_id} ({selectedStd?.name})
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} sx={{ height: "100%" }}>
          <Grid item xs={12} md={8}>
            <CropContainer>
              <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                minZoom={minZoom}
                zoomWithScroll={true}
                rotation={rotation}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onRotationChange={setRotation}
                onCropComplete={onCropComplete}
                onMediaLoaded={handleImageLoad} // << add this
                cropSize={{ width: 300, height: 300 }}
                style={{
                  containerStyle: {
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#333",
                  },
                  mediaStyle: {
                    filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`,
                  },
                }}
              />
            </CropContainer>
          </Grid>
          <Grid item xs={12} md={4}>
            <ControlsContainer>
              <SliderContainer>
                <Typography variant="body2" style={{ minWidth: 100 }}>
                  Zoom
                </Typography>
                <Slider
                  value={zoom}
                  min={0.5}
                  max={3}
                  step={0.1}
                  onChange={(e, value) => setZoom(value)}
                />
              </SliderContainer>

              <SliderContainer>
                <Typography variant="body2" style={{ minWidth: 100 }}>
                  Rotation
                </Typography>
                <Slider
                  value={rotation}
                  min={0}
                  max={360}
                  step={1}
                  onChange={(e, value) => setRotation(value)}
                />
              </SliderContainer>

              <SliderContainer>
                <Typography variant="body2" style={{ minWidth: 100 }}>
                  Brightness
                </Typography>
                <Slider
                  value={brightness}
                  min={0}
                  max={200}
                  onChange={(e, value) => setBrightness(value)}
                />
              </SliderContainer>

              <SliderContainer>
                <Typography variant="body2" style={{ minWidth: 100 }}>
                  Contrast
                </Typography>
                <Slider
                  value={contrast}
                  min={0}
                  max={200}
                  onChange={(e, value) => setContrast(value)}
                />
              </SliderContainer>

              <SliderContainer>
                <Typography variant="body2" style={{ minWidth: 100 }}>
                  Saturation
                </Typography>
                <Slider
                  value={saturation}
                  min={0}
                  max={200}
                  onChange={(e, value) => setSaturation(value)}
                />
              </SliderContainer>

              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                style={{ alignSelf: "flex-end", marginTop: 16 }}
                disabled={savingImage}
              >
                {savingImage ? (
                  <>
                  <CircularProgress
                    variant="indeterminate"
                    disableShrink
                    sx={{
                      // color: "#fff",
                      animationDuration: "550ms",
                      marginRight: 1
                    }}
                    size={18}
                    thickness={6}
                  /> <>Saving Changes</>
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </ControlsContainer>
          </Grid>
        </Grid>
      </DialogContent>
    </DialogContainer>
  );
};

export default PhotoEditor;
